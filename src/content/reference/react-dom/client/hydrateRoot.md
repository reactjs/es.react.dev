---
title: hydrateRoot
---

<Intro>

`hydrateRoot` te permite mostrar componentes de React dentro de un nodo DOM del navegador cuyo contenido HTML fue generado previamente por [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Llama a `hydrateRoot` para "adjuntar" React al HTML existente que ya fue renderizado por React en un entorno del servidor.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React se unirá al HTML que existe dentro de `domNode`, y se encargará de gestionar el DOM dentro de él. Una aplicación completamente construida con React normalmente sólo tendrá una llamada a `hydrateRoot` con su componente raíz.

[Consulta los ejemplos anteriores.](#usage)

#### Parámetros {/*parameters*/}

* `domNode`: Un [elemento del DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) que se ha renderizado como el elemento raíz en el servidor.

* `reactNode`: El "nodo de React" utilizado para renderizar el HTML existente. Normalmente será un trozo de JSX como `<App />` que se ha renderizado con un método de `ReactDOM Server` como `renderToPipeableStream(<App />)`.

* **opcional** `options`: Un objeto que contiene opciones para esta raíz de React.

  * **opcional** `onRecoverableError`: *Callback* que se llama cuando React se recupera automáticamente de los errores.
  * **opcional** `identifierPrefix`: Prefijo que React utiliza para los IDs generados por [`useId`.](/reference/react/useId) Útil para evitar conflictos cuando se utilizan varias raíces en la misma página. Debe ser el mismo prefijo que se utiliza en el servidor.
  * **opcional** `nonce`:

#### Devuelve {/*returns*/}

`hydrateRoot` devuelve un objeto con dos métodos: [`render`](#root-render) y [`unmount`.](#root-unmount)

#### Advertencias {/*caveats*/}

* `hydrateRoot()` espera que el contenido renderizado sea idéntico al contenido renderizado por el servidor. Deberías tratar los desajustes como errores y solucionarlos.
* En el modo de desarrollo, React avisa de los desajustes durante la hidratación. No hay garantías de que las diferencias de atributos sean parcheadas en caso de desajustes. Esto es importante por razones de rendimiento, ya que en la mayoría de las aplicaciones, los desajustes son raros, por lo que validar todo el marcado sería prohibitivamente caro.
* Es probable que sólo tengas una llamada a `hydrateRoot` en tu aplicación. Si utilizas un *framework*, puede que la haga por ti.
* Si tu aplicación está renderizada en el cliente y no tiene HTML renderizado, el uso de `hydrateRoot()` no es válido. Utiliza [`createRoot()`](/reference/react-dom/client/createRoot) en su lugar.

---

### `root.render(reactNode)` {/*root-render*/}

Llama a `root.render` para actualizar un componente de React dentro de una raíz de React hidratada para un elemento DOM del navegador.

```js
root.render(<App />);
```

React actualizará `<App />` en la raíz hidratada (`root`).

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*root-render-parameters*/}

* `reactNode`: Un "nodo de React" que quieres actualizar. Normalmente será un trozo de JSX como `<App />`, pero también puedes pasar un elemento React construido con [`createElement()`.](/reference/react/createElement), un *string*, un número, `null`, o `undefined`.


#### Devuelve {/*root-render-returns*/}

`root.render` devuelve `undefined`.

#### Advertencias {/*root-render-caveats*/}

* Si llamas a `root.render` antes de que la raíz haya terminado de hidratarse, React borrará el contenido HTML existente renderizado por el servidor y cambiará toda la raíz a renderizado del cliente.

---

### `root.unmount()` {/*root-unmount*/}

Llama a `root.unmount` para destruir un árbol renderizado dentro de una raíz de React.

```js
root.unmount();
```

Una aplicación completamente construida con React normalmente no tendrá ninguna llamada a `root.unmount`.

Esto es útil mayormente si el nodo DOM de tu raíz de React (o cualquiera de sus ancestros) puede ser eliminado del DOM por algún otro código. Por ejemplo, imagina un panel de pestañas jQuery que elimina las pestañas inactivas del DOM. Si se elimina una pestaña, todo lo que hay dentro de ella (incluyendo las raíces React que hay dentro) se eliminará también del DOM. En ese caso, tienes que decirle a React que "deje" de gestionar el contenido de la raíz eliminada llamando a `root.unmount`. De lo contrario, los componentes dentro de la raíz eliminada no sabrán limpiar y liberar recursos globales como las suscripciones.

Al llamar a `root.unmount` se desmontarán todos los componentes de la raíz y se "separará" React del nodo DOM raíz, incluyendo la eliminación de cualquier controlador de eventos o estado en el árbol. 


#### Parámetros {/*root-unmount-parameters*/}

`root.unmount` no acepta ningún parámetro.


#### Devuelve {/*root-unmount-returns*/}

`render` devuelve `null`.

#### Advertencias {/*root-unmount-caveats*/}

* Llamando a `root.unmount` se desmontarán todos los componentes del árbol y se "separará" React del nodo DOM raíz.

* Una vez que se llama a `root.unmount` no se puede volver a llamar a `root.render` en la raíz. El intento de llamar a `root.render` en una raíz desmontada arrojará el error "Cannot update an unmounted root" (No se puede actualizar una raíz desmontada).

---

## Uso {/*usage*/}

### Hidratación de HTML renderizado en el servidor {/*hydrating-server-rendered-html*/}

Si el HTML de tu aplicación fue generado por [`react-dom/server`](/reference/react-dom/client/createRoot), hay que *hidratarlo* en el cliente.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Esto hidratará el HTML del servidor dentro del <CodeStep step={1}>nodo DOM del navegador</CodeStep> con el <CodeStep step={2}>componente de React</CodeStep> para tu aplicación. Por lo general, lo harás una vez al inicio. Si utilizas un *framework*, puede que tras bambalinas lo haga por ti.

Para hidratar tu aplicación, React "adjuntará" la lógica de tus componentes al HTML inicial generado desde el servidor. La hidratación convierte la instantánea inicial de HTML del servidor en una aplicación totalmente interactiva que se ejecuta en el navegador.

<Sandpack>

```html public/index.html
<!--
  El contenido HTML dentro de <div id="root">...</div>
  fue generado a partir de App por react-dom/server.
-->
<div id="root"><h1>Hola, mundo!</h1><button>Me has hecho clic <!-- -->0<!-- --> veces</button></div>
```

```js index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>¡Hola, mundo!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Me has hecho clic {count} veces
    </button>
  );
}
```

</Sandpack>

No deberías necesitar llamar a `hydrateRoot` de nuevo o llamarlo en más sitios. A partir de este punto, React gestionará el DOM de tu aplicación. Si quieres actualizar la interfaz de usuario, tus componentes pueden hacerlo [usando el estado.](/reference/react/useState)

<Pitfall>

El árbol de React que pases a `hydrateRoot` tiene que producir **la misma salida** que en el servidor.

Esto es importante para la experiencia del usuario. El usuario pasará algún tiempo mirando el HTML generado por el servidor antes de que se cargue tu código JavaScript. El renderizado del servidor crea la ilusión de que la aplicación se carga más rápido al mostrar la instantánea del HTML de su salida. Mostrar de repente un contenido diferente rompe esa ilusión. Por ello, la salida de renderizado del servidor debe coincidir con la salida del renderizado inicial en el cliente durante la hidratación.

Las causas más comunes que conducen a errores de hidratación incluyen:

* Espacios en blanco extra (como nuevas líneas) alrededor del HTML generado por React dentro del nodo raíz.
* Utilizar comprobaciones como `typeof window !== 'undefined'` en tu lógica de renderizado.
* Utilizar APIs exclusivas del navegador como [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) en tu lógica de renderizado.
* Renderizar datos diferentes en el servidor y en el cliente.

React puede recuperarse de algunos errores de hidratación, pero **debes solucionarlos como cualquier otro error.** En el mejor de los casos, conducirán a una aplicación más lenta; en el peor, los manejadores de eventos se adjuntarán a los elementos equivocados.

</Pitfall>

---

### Hidratar un documento completo {/*hydrating-an-entire-document*/}

Las aplicaciones construidas completamente con React pueden renderizar un documento completo a partir del componente raíz, incluyendo la etiqueta [`html`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html):

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

Para hidratar el documento completo, pasa la variable global [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) como primer argumento a `hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### Suppressing unavoidable hydration mismatch errors {/*suppressing-unavoidable-hydration-mismatch-errors*/}

If a single element’s attribute or text content is unavoidably different between the server and the client (for example, a timestamp), you may silence the hydration mismatch warning.

To silence hydration warnings on an element, add `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
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

This only works one level deep, and is intended to be an escape hatch. Don’t overuse it. Unless it’s text content, React still won’t attempt to patch it up, so it may remain inconsistent until future updates.

---

### Handling different client and server content {/*handling-different-client-and-server-content*/}

If you intentionally need to render something different on the server and the client, you can do a two-pass rendering. Components that render something different on the client can read a [state variable](/reference/react/useState) like `isClient`, which you can set to `true` in an [Effect](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
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

This way the initial render pass will render the same content as the server, avoiding mismatches, but an additional pass will happen synchronously right after hydration.

<Pitfall>

This approach makes hydration slower because your components have to render twice. Be mindful of the user experience on slow connections. The JavaScript code may load significantly later than the initial HTML render, so rendering a different UI immediately after hydration may also feel jarring to the user.

</Pitfall>

---

### Actualización de un componente raíz hidratado {/*updating-a-hydrated-root-component*/}

Después de que la raíz haya terminado de hidratarse, puedes llamar a [`root.render`](#root-render) para actualizar el componente raíz de React. **Al contrario que con [`createRoot`](/reference/react-dom/client/createRoot), normalmente no es necesario hacerlo porque el contenido inicial ya se ha renderizado como HTML.**

Si llamas a `root.render` en algún momento después de la hidratación, y la estructura del árbol de componentes coincide con lo que se renderizó previamente, React [preservará el estado.](/learn/preserving-and-resetting-state) Fíjate que puedes escribir en la entrada de texto, lo que significa que las actualizaciones de las llamadas sucesivas a `render` cada segundo en este ejemplo no son destructivas:

<Sandpack>

```html public/index.html
<!--
  Todo el contenido HTML dentro de  <div id="root">...</div> fue
  generado al renderizar <App /> con react-dom/server.
-->
<div id="root"><h1>¡Hola, mundo! <!-- -->0</h1><input placeholder="Escriba algo aquí"/></div>
```

```js index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Escriba algo aquí" />
    </>
  );
}
```

</Sandpack>

Es poco común llamar a [`root.render`](#root-render) en una raíz hidratada. Por lo general, lo que deberías hacer es [actualizar el estado](/reference/react/useState) dentro de uno de los componentes.
