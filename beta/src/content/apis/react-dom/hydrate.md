---
título: hydrate
---
<Pitfall>

En React 18, `hydrate` fue sustituido por [`hydrateRoot`.](/apis/react-dom/client/hydrateRoot) El uso de `hydrate` en React 18 advertirá que tu aplicación se comportará como si estuviera ejecutando React 17. Más información [here.](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis)

</Pitfall>

<Intro>

`hydrate` permite mostrar componentes React dentro de un nodo DOM del navegador cuyo contenido HTML ha sido generado previamente por [`react-dom/server`](/apis/react-dom/server) en React 17 y posteriores.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

Llama a `hydrate` para unir un  <CodeStep step={1}>componente React</CodeStep> en un <CodeStep step={2}>nodo DOM del navegador</CodeStep> renderizado por el servidor.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import {hydrate} from 'react-dom';

hydrate(<App />, document.getElementById('root'));
````

Utilizando `hydrate()` para hacer una aplicación sólo para clientes (una aplicación sin HTML renderizado en el servidor) no es compatible. Utilice [`render()`](/apis/react-dom/render) (en React 17 e inferior) o [`createRoot()`](/apis/react-dom/client/createRoot) (en React 18+) en su lugar.

### Hydrating HTML renderizado por el servidor {/*hydrating-server-rendered-html*/}

En React, "hydration" es la forma en que React se "adhiere" al HTML existente que ya fue renderizado por React en un entorno de servidor. Durante (hydration), React intentará adjuntar escuchas de eventos al marcado existente y se encargará de renderizar la aplicación en el cliente.

En las aplicaciones totalmente construidas con React, **sólo se hidratará (hydrate) un "root", una vez al inicio para toda la aplicación**.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hola, mundo!</h1></div>
```

```js index.js active
import './styles.css';
import {hydrate} from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Hola, mundo!</h1>;
}
```

</Sandpack>

Normalmente no deberías necesitar llamar a `hydrate` de nuevo o llamarlo en más sitios. A partir de este punto, React gestionará el DOM de tu aplicación. Si quieres actualizar la UI, tus componentes pueden hacerlo [usando state].(/apis/react/useState)

Para más información sobre hydration, consulte la documentación de [`hydrateRoot`].(/apis/react-dom/client/hydrateRoot)

---

### Errores inevitables de hydration {/*avoiding-unavoidable-hydration-mismatches*/}

Si el contenido del atributo o del texto de un solo elemento es inevitablemente diferente entre el servidor y el cliente (por ejemplo, una marca de tiempo), puede silenciar la advertencia de error de hydration.

Para silenciar los avisos de hydration en un elemento, añada `suppresshydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Fecha actual: 01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import {hydrate} from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
export default function App() {
  return (
    <>
      <h1 suppressHydrationWarning={true}>
        Fecha actual: {new Date().toLocaleDateString()}
      </h1>
    </>
  );
}
```

</Sandpack>

Esto sólo funciona a un nivel de profundidad, y pretende ser una escotilla de escape. No lo utilices en exceso. A menos que se trate de contenido de texto, React todavía no intentará parchearlo, por lo que puede permanecer inconsistente hasta futuras actualizaciones.

### Manejo de diferentes contenidos del cliente y del servidor {/*handling-different-client-and-server-content*/}

Si necesitas intencionadamente renderizar algo diferente en el servidor y en el cliente, puedes hacer un renderizado de dos pasos. Los componentes que renderizan algo diferente en el cliente pueden leer una [variable de estado](/apis/react/useState) como `isClient`, que puedes establecer como `true` en un [effect](/apis/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  Contenido HTML dentro de <div id="root">...</div>
  se generó a partir de App mediante react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js index.js
import './styles.css';
import {hydrate} from 'react-dom';
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
      {isClient ? 'Es Cliente' : 'Es Servidor'}
    </h1>
  );
}
```

</Sandpack>

De esta forma, el pase inicial de renderizado renderizará el mismo contenido que el servidor, evitando errores, pero un pase adicional ocurrirá de forma sincronizada justo después de hydration.

<Pitfall>

Este enfoque hará que tus componentes sean más lentos porque tienen que renderizar dos veces, así que úsalo con precaución.

Recuerda que debes tener en cuenta la experiencia del usuario en conexiones lentas. El código JavaScript puede cargarse significativamente más tarde que el renderizado inicial del HTML, por lo que si se renderiza algo diferente en el pase del cliente, la transición puede ser discordante. Sin embargo, si se ejecuta bien, puede ser beneficioso renderizar un "shell" de la aplicación en el servidor, y sólo mostrar algunos de los widgets adicionales en el cliente. Para saber cómo hacer esto sin tener problemas de errores de marcado, consulte la explicación del párrafo anterior.

</Pitfall>



## Referencia {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate-root*/}

Llame a `hydrate` en React 17 y por debajo para "unir" React al HTML existente que ya fue renderizado por React en un entorno de servidor.

```js
hydrate(reactNode, domNode);
```

React se unirá al HTML que existe dentro del `domNode`, y se encargará de gestionar el DOM dentro de él. Una aplicación completamente construida con React normalmente sólo tendrá una llamada a `hydrate` con su componente raíz.

[Vea los ejemplos anteriores.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: El "nodo React" utilizado para renderizar el HTML existente. Normalmente será un elemento JSX como `<App />` que se renderizó con un método `ReactDOM Server` como `renderToString(<App />)` en React 17.

* `domNode`: Un [elemento DOM](https://developer.mozilla.org/es/docs/Web/API/Element) que se ha representado como elemento raíz en el servidor.

* **optional**: `callback`: Es una función. Si se pasa, React la llamará después de que su componente haya llamado hydrated.

#### Returns {/*returns*/}

`hydrate` Devuelve null.

#### Advertencias {/*caveats*/}
* `hydrate` espera que el contenido renderizado sea idéntico al contenido renderizado por el servidor. React puede parchear las diferencias en el contenido del texto, pero debes tratar los errores de compatibilidad como si se tratara un error y solucionarlos.
* En el modo de desarrollo, React avisa de las incompatibilidades durante hydration. No hay garantías de que las diferencias de atributos sean parcheadas en caso de incompatibilidad. Esto es importante por razones de rendimiento, ya que en la mayoría de las aplicaciones, las incompatibilidades son raras, por lo que validar todo el código sería excesivamente complicado.
* Es probable que sólo tengas una llamada a "hidrate" en tu aplicación. Si utilizas un framework, es posible que haga esta llamada por ti.
* Si tu aplicación está renderizada por el cliente y no tiene HTML renderizado, el uso de `hydrate()` no está permitido. Utiliza [render()](/apis/react-dom/render) (para React 17 e inferior) o [createRoot()](/apis/react-dom/client/createRoot) (para React 18+) en su lugar.

---
