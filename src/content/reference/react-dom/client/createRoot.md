---
title: createRoot
---

<Intro>

`createRoot` te permite crear una raíz para mostrar componentes de React dentro de un nodo del DOM del navegador.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Llama a `createRoot` para crear una raíz de React y mostrar contenido dentro de un elemento del DOM del navegador.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React creará una raíz para el nodo del DOM (`domNode`) y tomará el control del manejo del DOM dentro de él. Después de crear una raíz, se necesita llamar a [`root.render`](#root-render) para mostrar un componente de React dentro de él:

```js
root.render(<App />);
```

Una aplicación construida completamente con React suele llamar `createRoot` una vez para su componente de raíz. Una página que utiliza un poco de React para unas partes de la página puede tener tantas raíces como sean necesarias.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `domNode`: Un [elemento del DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React creará una raíz para este elemento del DOM y te permite que puedas llamar funciones en la raíz, como `render` y mostrar el contenido renderizado por React.

* **opcional** `options`: Un objeto que contiene opciones para esta raíz de React.

  * <CanaryBadge title="This feature is only available in the Canary channel" /> **optional** `onCaughtError`: Callback called when React catches an error in an Error Boundary. Called with the `error` caught by the Error Boundary, and an `errorInfo` object containing the `componentStack`.
  * <CanaryBadge title="This feature is only available in the Canary channel" /> **optional** `onUncaughtError`: Callback called when an error is thrown and not caught by an Error Boundary. Called with the `error` that was thrown, and an `errorInfo` object containing the `componentStack`.
  * **optional** `onRecoverableError`: Callback called when React automatically recovers from errors. Called with an `error` React throws, and an `errorInfo` object containing the `componentStack`. Some recoverable errors may include the original error cause as `error.cause`.
  * **opcional** `identifierPrefix`: prefijo de tipo string que React utiliza para IDs generados por [`useId`.](/reference/react/useId) Útil para evitar conflictos cuando se utilizan múltiples raíces en la misma página.

#### Devuelve {/*returns*/}

`createRoot` devuelve un objeto con dos métodos: [`render`](#root-render) y [`unmount`.](#root-unmount)

#### Advertencias {/*caveats*/}
* Si tu aplicación se renderiza por el servidor, usar `createRoot()` no es permitido. En su lugar, utiliza [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* Probablemente, solo se llamará `createRoot` una vez en tu aplicación. Si utilizas un framework, puede que haga esta llamada por ti.
* Cuando quieres renderizar una pieza de JSX en otra parte del árbol del DOM que no es un hijo de tu componente (por ejemplo, un modal o un *tooltip*), usa [`createPortal`](/reference/react-dom/createPortal) en vez de `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Llama a `root.render` para mostrar una pieza de [JSX](/learn/writing-markup-with-jsx) ("node de React") en el nodo del DOM del navegador de la raíz de React.

```js
root.render(<App />);
```

React mostrará `<App />` en la raíz (`root`) y se encargará de administrar el DOM dentro de ella.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*root-render-parameters*/}

* `reactNode`: Un *Nodo de React* que deseas mostrar. Por lo general, será una pieza de JSX como `<App />`, pero también puedes pasar un elemento de React construido con [`createElement()`](/reference/react/createElement), un string, un número, `null`, o `undefined`.


#### Devuelve {/*root-render-returns*/}

`root.render` devuelve `undefined`.

#### Advertencias {/*root-render-caveats*/}

* La primera vez que llamas a `root.render`, React borrará todo el contenido HTML existente dentro de la raíz de React antes de renderizar el componente de React dentro de ella.

* Si el nodo del DOM de tu raíz contiene HTML generado por React en el servidor o durante la compilación , usa [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) en su lugar, que adjunta los controladores de eventos al HTML existente.

* Si llamas a `render` en la misma raíz más de una vez, React actualizará el DOM según sea necesario para reflejar el último JSX que pasaste. React decidirá qué partes del DOM se pueden reutilizar y cuáles deben ser recreadas para ["emparejarlo"](/learn/preserving-and-resetting-state) con el árbol renderizado previamente. Llamar a `render` en la misma raíz nuevamente es similar a llamar a la [función `set`](/reference/react/useState#setstate) en el componente raíz: React evita actualizaciones del DOM innecesarias.

---

### `root.unmount()` {/*root-unmount*/}

Llama a `root.unmount` para destruir un árbol renderizado dentro de una raíz de React.

```js
root.unmount();
```

Una aplicación completamente construida con React usualmente no tendrá ninguna llamada a `root.unmount`.

Esto es útil sobre todo si el nodo del DOM de tu raíz de React (o cualquiera de sus ancestros) puede ser eliminado del DOM por algún otro código. Por ejemplo, imagina un panel de pestañas de jQuery que elimine las pestañas inactivas del DOM. Si se elimina una pestaña, todo lo que contiene (incluidas las raíces de React) también se eliminará del DOM. En ese caso, debes decirle a React que "detenga" la administración del contenido de la raíz eliminada con la llamada a `root.unmount`. Si no, los componentes dentro de la raíz eliminada no sabrán cómo limpiar y liberar recursos globales como suscripciones.

Llamar a `root.unmount` desmontará todos los componentes en la raíz y "separará" React del nodo del DOM raíz, incluida la eliminación de cualquier controlador de evento o estado en el árbol. 


#### Parámetros {/*root-unmount-parameters*/}

`root.unmount` no acepta ningún parámetro.


#### Devuelve {/*root-unmount-returns*/}

`root.unmount` devuelve `undefined`.

#### Advertencias {/*root-unmount-caveats*/}

* Llamar a `root.unmount` desmontará todos los componentes en el árbol y "separará" React de la raíz del nodo del DOM.

* Una vez que llames a `root.unmount`, no podrás volver a llamar a `root.render` en la misma raíz. Intentar llamar a `root.render` en una raíz desmontada generará el error _"Cannot update an unmounted root"_ ("No se puede actualizar una raíz desmontada"). Sin embargo, puedes crear una nueva raíz para el mismo nodo DOM después de que se haya desmontado la raíz anterior para ese nodo.

---

## Uso {/*usage*/}

### Renderizar una aplicación construida completamente con React {/*rendering-an-app-fully-built-with-react*/}

Si tu aplicación está construida completamente con React, crea una raíz única para toda tu aplicación.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Usualmente, solo necesitarás ejecutar este código una vez al inicio. Este código:

1. Encontrará el <CodeStep step={1}>nodo del DOM del navegador</CodeStep> definido en tu HTML.
2. Mostrará dentro el <CodeStep step={2}>componente de React</CodeStep> para tu aplicación.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Este es el nodo del DOM -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
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

**Si tu aplicación está construida completamente con React, no deberías necesitar crear más raíces, o llamar a [`root.render`](#root-render) otra vez.** 

A partir de este punto, React administrará el DOM de tu aplicación entera. Para agregar más componentes, [anídalos dentro del componente de la aplicación `App`.](/learn/importing-and-exporting-components) Cuando necesitas actualizar la interfaz de usuario (UI), cada uno de tus componentes puede lograrlo [con el uso de estado.](/reference/react/useState) Cuando necesitas mostrar contenido adicional como un modal o globos de ayuda fuera del nodo del DOM, [renderízalo con un portal.](/reference/react-dom/createPortal)

<Note>

Cuando tu HTML está vacío, el usuario ve una página en blanco hasta que el código de JavaScript de la aplicación se cargue y ejecute:

```html
<div id="root"></div>
```

¡Esto puede sentirse muy lento! Para resolverlo, puedes generar el HTML inicial a partir de tus componentes [en el servidor o durante la compilación.](/reference/react-dom/server) Entonces tus visitantes pueden leer el texto, ver imágenes, y hacer clic en los enlaces antes de que se cargue cualquiera de los códigos de JavaScript. Recomendamos [utilizar un framework](/learn/start-a-new-react-project#building-with-a-full-featured-framework) que tenga esta optimización incorporada. Dependiendo de cuando se ejecuta, se llama *renderizado de lado del servidor (SSR)*  o *generación de sitios estáticos (SSG)*

</Note>

<Pitfall>

**Las aplicaciones que utilizan el renderizado del lado del servidor o la generación estática deben llamar a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) en lugar de `createRoot`.** React luego *hidratará* (reutilizará) los nodos del DOM de tu HTML en lugar de destruirlos y volver a crearlos.

</Pitfall>

---

### Renderizar una página construida parcialmente con React {/*rendering-a-page-partially-built-with-react*/}

Si tu página [no está construida completamente con React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), puedes llamar a `createRoot` varias veces para crear una raíz para cada pieza de nivel superior de la UI administrada por React. Puedes mostrar contenido diferente en cada raíz con una llamada a [`root.render`.](#root-render)

Aquí, dos componentes diferentes de React se renderizan dentro de dos nodos del DOM definidos en el archivo `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Inicio</NavLink>
      <NavLink href="/about">Acerca de</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="¡Hola!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

También se puede crear un nodo del DOM nuevo con [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) y añadirlo al documento manualmente.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // Puedes añadirlo en cualquier parte del documento
```

Para eliminar el árbol de React del nodo del DOM y limpiar todos los recursos utilizados por este, llama a [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Mayormente es útil si tus componentes de React están dentro de una aplicación escrita en otro framework.

---

### Actualización de un componente raíz {/*updating-a-root-component*/}

Puedes llamar a `render` más de una vez en la misma raíz. Siempre que el árbol de componentes corresponda con lo que se había renderizado anteriormente, React [preservará el estado.](/learn/preserving-and-resetting-state) Fíjate que puedes escribir en el input, lo que significa que las actualizaciones por llamar repetidamente a `render` cada segundo en este ejemplo no son destructivas:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

No es común llamar a `render` más de una vez. En cambio, se suele [actualizar el estado](/reference/react/useState) dentro de uno de los componentes.

### Show a dialog for uncaught errors {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError` is only available in the latest React Canary release.

</Canary>

By default, React will log all uncaught errors to the console. To implement your own error reporting, you can provide the optional `onUncaughtError` root option:

```js [[1, 6, "onUncaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
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
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
root.render(<App />);
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

By default, React will log all errors caught by an Error Boundary to `console.error`. To override this behavior, you can provide the optional `onCaughtError` root option to handle errors caught by an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
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
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error, 
        componentStack: errorInfo.componentStack,
      });
    }
  }
});
root.render(<App />);
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

### Displaying a dialog for recoverable errors {/*displaying-a-dialog-for-recoverable-errors*/}

React may automatically render a component a second time to attempt to recover from an error thrown in render. If successful, React will log a recoverable error to the console to notify the developer. To override this behavior, you can provide the optional `onRecoverableError` root option:

```js [[1, 6, "onRecoverableError"], [2, 6, "error", 1], [3, 10, "error.cause"], [4, 6, "errorInfo"], [5, 11, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Recoverable error',
        error,
        error.cause,
        errorInfo.componentStack,
      );
    }
  }
);
root.render(<App />);
```

The <CodeStep step={1}>onRecoverableError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that React throws. Some errors may include the original cause as <CodeStep step={3}>error.cause</CodeStep>. 
2. An <CodeStep step={4}>errorInfo</CodeStep> object that contains the <CodeStep step={5}>componentStack</CodeStep> of the error.

You can use the `onRecoverableError` root option to display error dialogs:

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
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack,
    });
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

// 🚩 Bug: Never do this. This will force an error.
let errorThrown = false;
export default function App() {
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
      >
        {!errorThrown && <Throw />}
        <p>This component threw an error, but recovered during a second render.</p>
        <p>Since it recovered, no Error Boundary was shown, but <code>onRecoverableError</code> was used to show an error dialog.</p>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
    </div>
  );
}

function Throw({error}) {
  // Simulate an external value changing during concurrent render.
  errorThrown = true;
  foo.bar = 'baz';
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


---
## Solución de problemas {/*troubleshooting*/}

### He creado una raíz, pero no se muestra nada {/*ive-created-a-root-but-nothing-is-displayed*/}

Asegúrate de no haber olvidado *renderizar* realmente tu aplicación dentro de la raíz:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Hasta que no hagas eso, no se muestra nada.

---

### I'm getting an error: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

A common mistake is to pass the options for `createRoot` to `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

To fix, pass the root options to `createRoot(...)`, not `root.render(...)`:
```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### Recibo un error: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Este error significa que lo que esté pasando a `createRoot` no es un nodo del DOM.

Si no estás seguro de lo que está pasando, intenta imprimirlo en consola:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Por ejemplo, si `domNode` es `null`, significa que [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) devolvió `null`. Esto pasa si no hay ningún nodo en el documento con el ID dado en el momento de su llamada. Puede haber algunas razones para ello:

1. El ID que estás buscando puede diferir del ID que usaste en el archivo HTML. ¡Comprueba si hay errores tipográficos!
2. La etiqueta `<script>` de tu paquete no puede "ver" ningún nodo del DOM que aparezca *después* de ella en el HTML.

Otra forma común de obtener este error es escribir `createRoot(<App />)` en lugar de `createRoot(domNode)`.

---

### Recibo un error: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Este error significa que lo que pases a `root.render` no es un componente de React.

Esto puede ocurrir si llamas a `root.render` con `Component` en lugar de `<Component />`:

```js {2,5}
// 🚩 Incorrecto: App es una función, no un componente.
root.render(App);

// ✅ Correcto: <App /> es un componente.
root.render(<App />);
```

O si pasas una función a `root.render`, en lugar del resultado de llamarla:

```js {2,5}
// 🚩 Incorrecto: createApp es una función, no un componente.

// ✅ Correcto: llama a createApp para devolver un componente.
root.render(createApp());
```

---

### Mi HTML renderizado en el servidor se recrea desde cero {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Si tu aplicación está renderizada en el servidor e incluye el HTML inicial generado por React, puedes notar que crear una raíz y llamar a `root.render` elimina todo ese HTML, y luego recrea todos los nodos del DOM desde cero. Esto puede ser más lento, reinicia el foco y las posiciones de desplazamiento y puede perder otras entradas del usuario.

Las aplicaciones renderizadas por el servidor deben usar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) en lugar de `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Ten en cuenta que su API es diferente. En particular, usualmente no habrá una llamada posterior a `root.render`.
