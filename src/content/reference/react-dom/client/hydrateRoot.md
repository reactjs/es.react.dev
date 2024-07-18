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

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `domNode`: Un [elemento del DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) que se ha renderizado como el elemento raíz en el servidor.

* `reactNode`: El "nodo de React" utilizado para renderizar el HTML existente. Normalmente será un trozo de JSX como `<App />` que se ha renderizado con un método de `ReactDOM Server` como `renderToPipeableStream(<App />)`.

* **opcional** `options`: Un objeto que contiene opciones para esta raíz de React.

  * <CanaryBadge title="This feature is only available in the Canary channel" /> **optional** `onCaughtError`: Callback called when React catches an error in an Error Boundary. Called with the `error` caught by the Error Boundary, and an `errorInfo` object containing the `componentStack`.
  * <CanaryBadge title="This feature is only available in the Canary channel" /> **optional** `onUncaughtError`: Callback called when an error is thrown and not caught by an Error Boundary. Called with the `error` that was thrown and an `errorInfo` object containing the `componentStack`.
  * **optional** `onRecoverableError`: Callback called when React automatically recovers from errors. Called with the `error` React throws, and an `errorInfo` object containing the `componentStack`. Some recoverable errors may include the original error cause as `error.cause`.
  * **opcional** `identifierPrefix`: Prefijo que React utiliza para los IDs generados por [`useId`.](/reference/react/useId) Útil para evitar conflictos cuando se utilizan varias raíces en la misma página. Debe ser el mismo prefijo que se utiliza en el servidor.

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

Al llamar a `root.unmount` se desmontarán todos los componentes de la raíz y se "separará" React del nodo DOM raíz, incluyendo la eliminación de cualquier controlador de evento o estado en el árbol. 


#### Parámetros {/*root-unmount-parameters*/}

`root.unmount` no acepta ningún parámetro.


#### Devuelve {/*root-unmount-returns*/}

`root.unmount` devuelve `undefined`.

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
<div id="root"><h1>Hola, mundo!</h1><button>Me hiciste clic <!-- -->0<!-- --> veces</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
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
      Me hiciste clic {count} veces
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

React puede recuperarse de algunos errores de hidratación, pero **debes solucionarlos como cualquier otro error.** En el mejor de los casos, conducirán a una aplicación más lenta; en el peor, los controladores de eventos se adjuntarán a los elementos equivocados.

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

### Suprimir errores inevitables de desajuste de hidratación {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Si el atributo o contenido de texto de un único elemento es inevitablemente diferente entre el servidor y el cliente (por ejemplo, una marca de tiempo), puede silenciar la advertencia de desajuste de hidratación.

Para silenciar las advertencias de hidratación en un elemento, agrega `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  El contenido HTML dentro de <div id="root">...</div>
  fue generado desde App por react-dom/server.
-->
<div id="root" ><h1>Fecha actual: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Fecha actual: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Esto sólo funciona a un nivel de profundidad, y pretende ser una vía de escape. No abuses de su uso. A menos que sea contenido de texto, React aún no intentará parchearlo, por lo que puede permanecer inconsistente hasta futuras actualizaciones.

---

### Manejar diferentes contenidos de cliente y servidor {/*handling-different-client-and-server-content*/}

Si intencionalmente necesitas renderizar algo diferente en el servidor y en el cliente, puedes hacer un renderizado de dos pasadas. Los componentes que renderizan algo diferente en el cliente pueden leer una [variable de estado](/reference/react/useState) como `isClient`, que puedes establecer en `true` en un [Efecto](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  El contenido HTML dentro de <div id="root">...</div>
  fue generado desde App por react-dom/server.
-->
<div id="root"><h1>Es Servidor</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
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

De esta forma el pase de render inicial renderizará el mismo contenido que el servidor, evitando desajustes, pero un pase adicional sucederá de forma sincrónica justo después de la hidratación.

<Pitfall>

Este enfoque hace que la hidratación sea más lenta porque sus componentes tienen que renderizar dos veces. Tenga en cuenta la experiencia del usuario en conexiones lentas. El código JavaScript puede cargarse significativamente más tarde que el renderizado HTML inicial, por lo que renderizar una interfaz de usuario diferente inmediatamente después de la hidratación también puede resultar molesto para el usuario.

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

```js src/index.js active
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

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>¡Hola, mundo! {counter}</h1>
      <input placeholder="Escriba algo aquí" />
    </>
  );
}
```

</Sandpack>

Es poco común llamar a [`root.render`](#root-render) en una raíz hidratada. Por lo general, lo que deberías hacer es [actualizar el estado](/reference/react/useState) dentro de uno de los componentes.

### Show a dialog for uncaught errors {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError` is only available in the latest React Canary release.

</Canary>

By default, React will log all uncaught errors to the console. To implement your own error reporting, you can provide the optional `onUncaughtError` root option:

```js [[1, 7, "onUncaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Uncaught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

The <CodeStep step={1}>onUncaughtError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that was thrown.
2. An <CodeStep step={3}>errorInfo</CodeStep> object that contains the <CodeStep step={4}>componentStack</CodeStep> of the error.

You can use the `onUncaughtError` root option to display error dialogs:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><div><span>This error shows the error dialog:</span><button>Throw error</button></div></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";
import {renderToString} from 'react-dom/server';

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);
  
  if (throwError) {
    foo.bar = 'baz';
  }
  
  return (
    <div>
      <span>This error shows the error dialog:</span>
      <button onClick={() => setThrowError(true)}>
        Throw error
      </button>
    </div>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>


### Displaying Error Boundary errors {/*displaying-error-boundary-errors*/}

<Canary>

`onCaughtError` is only available in the latest React Canary release.

</Canary>

By default, React will log all errors caught by an Error Boundary to `console.error`. To override this behavior, you can provide the optional `onCaughtError` root option for errors caught by an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

The <CodeStep step={1}>onCaughtError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that was caught by the boundary.
2. An <CodeStep step={3}>errorInfo</CodeStep> object that contains the <CodeStep step={4}>componentStack</CodeStep> of the error.

You can use the `onCaughtError` root option to display error dialogs or filter known errors from logging:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><span>This error will not show the error dialog:</span><button>Throw known error</button><span>This error will show the error dialog:</span><button>Throw unknown error</button></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>This error will not show the error dialog:</span>
        <button onClick={handleKnown}>
          Throw known error
        </button>
        <span>This error will show the error dialog:</span>
        <button onClick={handleUnknown}>
          Throw unknown error
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Show a dialog for recoverable hydration mismatch errors {/*show-a-dialog-for-recoverable-hydration-mismatch-errors*/}

When React encounters a hydration mismatch, it will automatically attempt to recover by rendering on the client. By default, React will log hydration mismatch errors to `console.error`. To override this behavior, you can provide the optional `onRecoverableError` root option:

```js [[1, 7, "onRecoverableError"], [2, 7, "error", 1], [3, 11, "error.cause", 1], [4, 7, "errorInfo"], [5, 12, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        error.cause,
        errorInfo.componentStack
      );
    }
  }
);
```

The <CodeStep step={1}>onRecoverableError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> React throws. Some errors may include the original cause as <CodeStep step={3}>error.cause</CodeStep>.
2. An <CodeStep step={4}>errorInfo</CodeStep> object that contains the <CodeStep step={5}>componentStack</CodeStep> of the error.

You can use the `onRecoverableError` root option to display error dialogs for hydration mismatches:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><span>Server</span></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack
    });
  }
});
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <span>{typeof window !== 'undefined' ? 'Client' : 'Server'}</span>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

## Troubleshooting {/*troubleshooting*/}


### I'm getting an error: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

A common mistake is to pass the options for `hydrateRoot` to `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

To fix, pass the root options to `hydrateRoot(...)`, not `root.render(...)`:
```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
