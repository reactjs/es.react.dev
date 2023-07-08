---
title: hydrate
---

<Deprecated>

Esta API se eliminará en una futura versión mayor de React.

En React 18, `hydrate` fue sustituido por [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) El uso de `hydrate` en React 18 advertirá que tu aplicación se comportará como si estuviera ejecutando React 17. Más información [aquí.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`hydrate` te permite mostrar componentes de React dentro de un nodo DOM del navegador cuyo contenido HTML ha sido generado previamente por [`react-dom/server`](/reference/react-dom/server) en React 17 y anteriores.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

Llama a `hydrate` en React 17 y versiones anteriores para "unir" React al HTML existente que ya fue renderizado por React en un entorno de servidor.

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React se unirá al HTML que existe dentro del nodo DOM `domNode`, y se encargará de gestionar el DOM dentro de él. Una aplicación completamente construida con React normalmente sólo tendrá una llamada a `hydrate` con su componente raíz.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: El "nodo de React" utilizado para renderizar el HTML existente. Normalmente será un elemento JSX como `<App />` que se renderizó con un método de `ReactDOM Server` como `renderToString(<App />)` en React 17.

* `domNode`: Un [elemento DOM](https://developer.mozilla.org/es/docs/Web/API/Element) que se renderizó como elemento raíz en el servidor.

* **optional**: `callback`: Es una función. Si se pasa, React la llamará después de que tu componente se haya hidratado.

#### Returns {/*returns*/}

`hydrate` devuelve null.

#### Advertencias {/*caveats*/}
* `hydrate` espera que el contenido renderizado sea idéntico al contenido renderizado por el servidor. React puede parchear diferencias en el contenido del texto, pero debes tratar las diferencias como errores y solucionarlos.
* En el modo de desarrollo, React avisa de las diferencias durante la hidratación. No hay garantías de que las diferencias de atributos sean parcheadas en caso de detectarse. Esto es importante por razones de rendimiento, ya que en la mayoría de las aplicaciones, las diferencias son raras, por lo que validar todo el código sería excesivamente complicado.
* Es probable que sólo tengas una llamada a `hydrate` en tu aplicación. Si utilizas un framework, es posible que haga esta llamada por ti.
* Si tu aplicación está renderizada por el cliente y no tiene HTML renderizado, el uso de `hydrate()` no está permitido. Utiliza [render()](/reference/react-dom/render) (para React 17 y anteriores) o [createRoot()](/reference/react-dom/client/createRoot) (para React 18+) en su lugar.

---

## Uso {/*usage*/}

Llama a `hydrate` para unir un  <CodeStep step={1}>componente de React</CodeStep> a un <CodeStep step={2}>nodo DOM del navegador</CodeStep> renderizado por el servidor.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

Utilizar `hydrate()` para renderizar una aplicación del lado del cliente (una aplicación sin HTML renderizado en el servidor) no está adimitido. Utiliza [`render()`](/reference/react-dom/render) (en React 17 y anteriores) o [`createRoot()`](/reference/react-dom/client/createRoot) (en React 18+) en su lugar.

### Hidratar HTML renderizado por el servidor {/*hydrating-server-rendered-html*/}

En React, la "hidratación" es la forma en que React se "adhiere" al HTML existente que ya fue renderizado por React en un entorno de servidor. Durante la hidratación, React intentará adjuntar manejadores de eventos al marcado existente y se encargará de renderizar la aplicación en el cliente.

En las aplicaciones totalmente construidas con React, **sólo se hidratará una "raíz", una vez al inicio para toda la aplicación**.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1></div>
```

```js index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

Comúnmente no deberías necesitar llamar a `hydrate` nuevamente o llamarlo en varios lugares. A partir de este punto, React manejará el DOM de tu aplicación. Si quieres actualizar la UI, tus componentes pueden hacerlo con [el uso de estado.](/reference/react/useState)

Para más información sobre la hidratación, consulta la documentación de [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot)

---

### Suprimir errores de diferencias inevitables en la hidratación {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Si el atributo o el contenido de texto de un solo elemento es inevitablemente diferente entre el servidor y el cliente (por ejemplo, una marca de tiempo), puedes silenciar la advertencia de la diferencia en la hidratación.

Para silenciar las advertencias de hidratación en un elemento, añade `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: 01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Esto solo funciona a un nivel de profundidad, y pretende ser una escotilla de escape. No lo utilices en exceso. A menos de que se trate de contenido de texto, React todavía no intentará parchearlo, por lo que puede permanecer inconsistente hasta futuras actualizaciones.

---

### Manejar contenido diferente entre el cliente y el servidor {/*handling-different-client-and-server-content*/}

Si intencionalmente necesitas renderizar algo distinto en el servidor y el cliente, puedes hacer un renderizado en dos pasos. Los componentes que renderizan algo diferente en el cliente pueden leer una [variable de estado](/reference/react/useState) como `isClient`, que puedes establecer en `true` en un [efecto](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  El contenido HTML dentro de <div id="root">...</div>
  se generó a partir de App por react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

De esta forma, el pase inicial de renderizado renderizará el mismo contenido que el servidor, evitando errores, pero un pase adicional ocurrirá de forma sincronizada justo después de la hidratación.

<Pitfall>

Este enfoque hace que la hidratación sea más lenta porque tus componentes tienen que renderizarse dos veces. Ten en cuenta la experiencia de usuario en conexiones lentas. El código JavaScript puede cargarse significativamente más tarde que el renderizado inicial del HTML, por lo que si se renderiza una UI diferente inmediatamente luego de la hidratación podría ser una experiencia discordante para el usuario.

</Pitfall>
