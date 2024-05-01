---
title: use
canary: true
---

<Canary>

<<<<<<< HEAD
El Hook `use` está actualmente disponible solo en React Canary y canales experimentales. Aprende más sobre los [canales de lanzamiento de React aquí](/community/versioning-policy#all-release-channels).   
=======
The `use` API is currently only available in React's Canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

</Canary>

<Intro>

<<<<<<< HEAD
`use` es un Hook de React que te permite leer el valor de un recurso como una [Promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) o [contexto](/learn/passing-data-deeply-with-context).
=======
`use` is a React API that lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `use(resource)` {/*use*/}

Llama a `use` en tu componente para leer el valor de un recurso como una [Promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) o [contexto](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

<<<<<<< HEAD
A diferencia de otros Hooks de React, `use` puede ser llamado dentro de bucles y condicionales como `if`. Al igual que otros Hooks de React, la función que llama a `use` tiene que ser un componente o Hook.

Cuando es llamado con una Promesa, el Hook de `use` se integra con [`Suspense`](/reference/react/Suspense) y [barreras de error](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). El componente que llama a `use` *se suspende* mientras que la Promesa pasada a `use` es pendiente. Si el componente que llama a `use` es envuelto en una barrera de Suspense, el fallback será mostrado. Una vez que la Promesa es resuelta, el fallback de Suspense es remplazada por los componentes renderizados usando los datos devueltos por el Hook `use`. Si la Promesa pasada a `use` es rechazada, se mostrará el fallback del error mas cercano a la barrera de error.
=======
Unlike React Hooks, `use` can be called within loops and conditional statements like `if`. Like React Hooks, the function that calls `use` must be a Component or Hook.

When called with a Promise, the `use` API integrates with [`Suspense`](/reference/react/Suspense) and [error boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). The component calling `use` *suspends* while the Promise passed to `use` is pending. If the component that calls `use` is wrapped in a Suspense boundary, the fallback will be displayed.  Once the Promise is resolved, the Suspense fallback is replaced by the rendered components using the data returned by the `use` API. If the Promise passed to `use` is rejected, the fallback of the nearest Error Boundary will be displayed.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `resource`: esta es la fuente de los datos de los que quieres leer un valor. Un recurso puede ser una [Promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) o un [contexto](/learn/passing-data-deeply-with-context).

#### Devuelve {/*returns*/}

<<<<<<< HEAD
El Hook `use`  devuelve el valor que se leyó del recurso como el valor resuelto de una [Promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) o [contexto](/learn/passing-data-deeply-with-context).
=======
The `use` API returns the value that was read from the resource like the resolved value of a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

#### Advertencias {/*caveats*/}

<<<<<<< HEAD
* El Hook `use` debe ser llamado dentro de un componente o un Hook.
* Cuando se recupera datos en un [Componente del Servidor](/reference/react/use-server), se prefiere el uso de `async` y `await` por encima de `use`. `async` y `await` retoman el renderizado desde el punto donde se invocó `await`, mientras que `use` vuelve a renderizar el componente después de que se resuelvan los datos.
* Se prefiere la creación de Promesas en los [Componente del Servidors](/reference/react/use-server) y pasarlos a los [Componente del Clientes](/reference/react/use-client) por encima de crear Promesas en los Componente del Clientes. Las Promesas creadas en los Componente del Clientes son recreadas en cada renderizado. Las Promesas que son pasadas de un Componente del Servidor a un Componente del Cliente son estables en todos los renderizados. [Ver este ejemplo](#streaming-data-from-server-to-client).
=======
* The `use` API must be called inside a Component or a Hook.
* When fetching data in a [Server Component](/reference/rsc/use-server), prefer `async` and `await` over `use`. `async` and `await` pick up rendering from the point where `await` was invoked, whereas `use` re-renders the component after the data is resolved.
* Prefer creating Promises in [Server Components](/reference/rsc/use-server) and passing them to [Client Components](/reference/rsc/use-client) over creating Promises in Client Components. Promises created in Client Components are recreated on every render. Promises passed from a Server Component to a Client Component are stable across re-renders. [See this example](#streaming-data-from-server-to-client).
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

---

## Uso {/*usage*/}

### Leer contexto con `use` {/*reading-context-with-use*/}

Cuando un [contexto](/learn/passing-data-deeply-with-context) se pasa a `use`, funciona de manera similar a [`useContext`](/reference/react/useContext). Mientras `useContext` debe ser llamado en el nivel mas alto de tu componente, `use` puede ser llamado dentro de condicionales como `if` y en bucles como `for`. Se prefiere `use` por encima de `useContext` porque es más flexible. 

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use` devuelve el <CodeStep step={2}>valor de contexto</CodeStep> para el <CodeStep step={1}>contexto</CodeStep> que pasas. Para determinar el valor del contexto, React busca en el árbol de componentes y encuentra  **el proveedor de contexto más cercano arriba** para ese contexto en particular.  

Para pasar el contexto a un `Button`, envuélvalo en uno de sus componentes padres en el proveedor de contexto correspondiente.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renderiza botones adentro ...
}
```

No importa cuántas capas de componentes hay entre el proveedor y el `Button`. Cuando un `Button` *en cualquier lugar* dentro de un `Form` llama a `use(ThemeContext)`, recibirá `"dark"` como valor.   

A diferencia de [`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> se puede llamar en condicionales y bucles como <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> se llama desde dentro de una declaración <CodeStep step={1}>`if`</CodeStep>, lo que te permite leer valores condicionalmente de un contexto.

<Pitfall>

Al igual que `useContext`, `use(context)` siempre busca el proveedor de contexto más cercano *arriba* del componente que lo llama. Busca hacia arriba y no considera los proveedores de contexto en el componente desde el cual llamas `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Bienvenido">
      <Button show={true}>Registrarse</Button>
      <Button show={false}>Iniciar sesión</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Transmisión de datos del servidor al cliente (streaming) {/*streaming-data-from-server-to-client*/}

Se puede transmitir un flujo de datos del servidor al cliente (*streaming*) pasando una Promesa como una prop desde un <CodeStep step={1}>Componente del Servidor</CodeStep> a un <CodeStep step={2}>Componente del Cliente</CodeStep>.  

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>Esperando mensaje...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

<<<<<<< HEAD
El <CodeStep step={2}>Componente del Cliente</CodeStep> toma la <CodeStep step={4}>Promesa que ha recibido como una prop</CodeStep> y la pasa al Hook <CodeStep step={5}>`use`</CodeStep>. Esto permite al <CodeStep step={2}>Componente del Cliente</CodeStep> leer el valor de <CodeStep step={4}>la Promesa</CodeStep> que fue inicialmente creada por el Componente del Servidor.
=======
The <CodeStep step={2}>Client Component</CodeStep> then takes <CodeStep step={4}>the Promise it received as a prop</CodeStep> and passes it to the <CodeStep step={5}>`use`</CodeStep> API. This allows the <CodeStep step={2}>Client Component</CodeStep> to read the value from <CodeStep step={4}>the Promise</CodeStep> that was initially created by the Server Component.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Aquí está el mensaje: {messageContent}</p>;
}
```
<<<<<<< HEAD
Debido a que <CodeStep step={2}>`Message`</CodeStep> está envuelto en <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, el fallback se mostrará hasta que la Promesa esté resuelta. Cuando se resuelva la Promesa, el valor será leído por el Hook  <CodeStep step={5}>`use`</CodeStep> y el componente <CodeStep step={2}>`Message`</CodeStep> reemplazará el fallback de Suspense.
=======
Because <CodeStep step={2}>`Message`</CodeStep> is wrapped in <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, the fallback will be displayed until the Promise is resolved. When the Promise is resolved, the value will be read by the <CodeStep step={5}>`use`</CodeStep> API and the <CodeStep step={2}>`Message`</CodeStep> component will replace the Suspense fallback.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Aquí está el mensaje: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Descargando mensaje...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Descargar mensaje</button>;
  }
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// API is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Note>

Al pasar una Promesa de un Componente del Servidor a un Componente del Cliente, su valor resuelto debe ser serializable para pasar entre el servidor y el cliente. Los tipos de datos como las funciones no son serializables y no pueden ser el valor resuelto de dicha Promesa.

</Note>


<DeepDive>

#### ¿Debo resolver una promesa en un Componente del Servidor o en un Componente del Cliente? {/*resolve-promise-in-server-or-client-component*/}

<<<<<<< HEAD
Una Promesa se puede pasar de un Componente del Servidor a un Componente del Cliente y resolverse en el Componente del Cliente con el Hook `use`. También puedes resolver la Promesa en un Componente del Servidor con `await` y pasar los datos requeridos al Componente del Cliente como una prop.
=======
A Promise can be passed from a Server Component to a Client Component and resolved in the Client Component with the `use` API. You can also resolve the Promise in a Server Component with `await` and pass the required data to the Client Component as a prop.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

Pero el uso de `await` en un [Componente del Servidor](/reference/react/components#server-components) bloqueará su renderizado hasta que finalice la declaración de `await`. Pasar una Promesa de un Componente del Servidor a un Componente del Cliente evita que la Promesa bloquee la representación del Componente del Servidor.

</DeepDive>

### Lidiar con las promesas rechazadas {/*dealing-with-rejected-promises*/}

En algunas ocasiones una Promesa pasada a `use` puede ser rechazada. Puedes manejar Promesas rechazadas de estas maneras:

1. [Mostrar un error a los usuarios con una barrera de error.](#displaying-an-error-to-users-with-error-boundary)
2. [Proporcionar un valor alternativo con `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use` no puede ser llamado en un bloque try-catch. En vez de un bloque try-catch [envuelve tu componente con una barrera de error](#displaying-an-error-to-users-with-error-boundary), o [proporciona un valor alternativo para usar con el método `.catch` de Promise](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Mostrar un error a los usuarios con una barrera de error {/*displaying-an-error-to-users-with-error-boundary*/}

<<<<<<< HEAD
Si quieres mostrar un error a tus usuarios cuando se rechaza una Promesa, puedes usar una [barrera de error](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Para usar una barrera de error, envuelve el componente donde estás llamando al Hook `use` en una barrera de error. Si se rechaza la Promesa que fue pasada a `use`, se mostrará el fallback para la barrera de error.
=======
If you'd like to display an error to your users when a Promise is rejected, you can use an [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). To use an error boundary, wrap the component where you are calling the `use` API in an error boundary. If the Promise passed to `use` is rejected the fallback for the error boundary will be displayed.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Algo ha salido mal</p>}>
      <Suspense fallback={<p>⌛Descargando el mensaje...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Aquí está el mensaje: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Descargar mensaje</button>;
  }
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// API is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### Proporcionar un valor alternativo con  `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

Si quieres proporcionar un valor alternativo cuando se rechaza la Promesa pasada a `use`, puedes usar el método <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> de la Promesa.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no se encontró ningún mensaje nuevo.";
  });

  return (
    <Suspense fallback={<p>Esperando mensaje...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Para usar el método <CodeStep step={1}>`catch`</CodeStep> de la Promesa, llama a <CodeStep step={1}>`catch`</CodeStep> en el objeto de la Promesa. <CodeStep step={1}>`catch`</CodeStep> toma un solo argumento: una función que toma un mensaje de error como un argumento. Lo que sea <CodeStep step={2}>devuelto</CodeStep> por la función pasada a <CodeStep step={1}>`catch`</CodeStep> se utilizará como valor resuelto de la Promesa.

---

## Solución de problemas {/*troubleshooting*/}

### “Excepción de Suspense: ¡Esto no es un error real!” {/*suspense-exception-error*/}

<<<<<<< HEAD
Estás llamando a `use` fuera de un componente de React o función Hook, o llamando a `use` en un bloque try-catch. Si estás llamando a `use` dentro de un bloque try-catch, envuelve tu componente en una barrera de error o llama al `catch` de la Promesa para detectar el error y resolver la Promesa con otro valor. [Ver estos ejemplos](#dealing-with-rejected-promises).

Si estás llamando a `use` fuera de un componente de React o función Hook, mueve la llamada de `use` a un componente de React o función Hook.
=======
You are either calling `use` outside of a React Component or Hook function, or calling `use` in a try–catch block. If you are calling `use` inside a try–catch block, wrap your component in an error boundary, or call the Promise's `catch` to catch the error and resolve the Promise with another value. [See these examples](#dealing-with-rejected-promises).

If you are calling `use` outside a React Component or Hook function, move the `use` call to a React Component or Hook function.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ la función que llama a `use` no es un componente ni un Hook
    const message = use(messagePromise);
    // ...
```

<<<<<<< HEAD
En su lugar, llama a `use` fuera de las clausuras de cualquier componente, donde la función que llama a `use` es un componente o un Hook.
=======
Instead, call `use` outside any component closures, where the function that calls `use` is a Component or Hook.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` está siendo llamado desde un componente. 
  const message = use(messagePromise);
  // ...
```
