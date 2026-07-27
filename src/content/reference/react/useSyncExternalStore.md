---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` es un Hook de React que te permite suscribirte a una fuente de almacenamiento de datos (*store*) externa.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Llama a `useSyncExternalStore` en el nivel superior de tu componente para leer un valor de una fuente de almacenamiento de datos externa.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Devuelve la instantánea de los datos en la fuente de almacenamiento de datos. Necesitas pasar dos funciones como argumentos:

1. La función `subscribe` debe suscribirse a la fuente de almacenamiento de datos y devolver una función que cancela dicha suscripción.
2. La función `getSnapshot` debería obtener una instantánea de los datos de la fuente de almacenamiento de datos.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `subscribe`: Una función que toma un solo argumento `callback` y lo suscribe a la fuente de almacenamiento de datos. Cuando la fuente de almacenamiento de datos cambia, debe invocar el `callback` proporcionado, lo que provocará que React vuelva a llamar a `getSnapshot` y (si es necesario) volver a renderizar el componente. La función `subscribe` debería devolver una función que limpia dicha suscripción.

* `getSnapshot`: Una función que devuelve una instantánea de los datos de la fuente de almacenamiento de datos que necesita el componente. Si bien la fuente de almacenamiento de datos no ha cambiado, las llamadas repetidas a `getSnapshot` deben devolver el mismo valor. Si la fuente de almacenamiento de datos cambia y el valor devuelto es diferente (usando para la comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ), React volverá a rerenderizar el componente.

* **opcional** `getServerSnapshot`: Una función que devuelve la instantánea inicial de los datos de la fuente de almacenamiento de datos. Se usará solo durante el renderizado en el servidor y durante la hidratación del contenido renderizado por el servidor en el cliente. La instantánea del servidor debe ser la misma entre el cliente y el servidor, y generalmente se serializa y pasa del servidor al cliente. Si no se proporciona esta función, el renderizado del componente en el servidor generará un error.

#### Devuelve {/*returns*/}

La instantánea actual de la fuente de almacenamiento que puedes usar en tu lógica de renderizado.

#### Advertencias {/*caveats*/}

* La instantánea de la fuente de almacenamiento de datos devuelta por `getSnapshot` debe ser inmutable. Si la fuente subyacente tiene datos mutables, devuelve una nueva instantánea inmutable si los datos han cambiado. De lo contrario, devuelve la última instantánea almacenada en caché.

* Si se pasa una función `subscribe` diferente durante un rerenderizado, React se volverá a suscribir a la fuente de almacenamiento de datos usando la función `subscribe` recién pasada. Puedes evitarlo declarando `subscribe` fuera del componente.

* If the store is mutated during a [non-blocking Transition update](/reference/react/useTransition), React will fall back to performing that update as blocking. Specifically, for every Transition update, React will call `getSnapshot` a second time just before applying changes to the DOM. If it returns a different value than when it was called originally, React will restart the update from scratch, this time applying it as a blocking update, to ensure that every component on screen is reflecting the same version of the store.

* It's not recommended to _suspend_ a render based on a store value returned by `useSyncExternalStore`. The reason is that mutations to the external store cannot be marked as [non-blocking Transition updates](/reference/react/useTransition), so they will trigger the nearest [`Suspense` fallback](/reference/react/Suspense), replacing already-rendered content on screen with a loading spinner, which typically makes a poor UX.

  For example, the following are discouraged:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Calling `use` with a Promise dependent on `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Conditionally rendering a lazy component based on `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Uso {/*usage*/}

### Suscripción a una fuente de almacenamiento datos externa {/*subscribing-to-an-external-store*/}

Normalmente la mayoría de tus componentes de React solo leerán datos de sus [props,](/learn/passing-props-to-a-component), [estado,](/reference/react/useState) y [contexto.](/reference/react/useContext). Sin embargo, a veces un componente necesita leer algunos datos de alguna fuente de almacenamiento fuera de React que cambia con el tiempo. Esto incluye:

* Bibliotecas de gestión de estado de terceros que mantienen el estado fuera de React.
* APIs del navegador que exponen un valor mutable y eventos para suscribirse a sus cambios.

Llama a `useSyncExternalStore` en el primer nivel de tu componente para leer un valor de una fuente de datos externa.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Esto devuelve la <CodeStep step={3}>instantánea</CodeStep> del dato en la fuente de almacenamiento de datos. Necesitas pasar dos funciones como argumentos:

1. La <CodeStep step={1}>función `subscribe`</CodeStep> deberá suscribirse a la fuente de almacenamiento de datos y devolver una función que permita des suscribirse.
2. La <CodeStep step={2}>función `getSnapshot`</CodeStep> deberá obtener una instantánea de los datos de la fuente.

React utilizará estas funciones para mantener tu componente suscrito a la fuente de almacenamiento de datos y volver a renderizarlo con los cambios.

<<<<<<< HEAD
Por ejemplo, en el *sandbox* debajo, `todosStore` se implementa como una fuente de almacenamiento de datos externa que almacena datos fuera de React. El componente `TodosApp` se conecta a esta fuente de almacenamiento externa de datos con el Hook `useSyncExternalStore`.
=======
For example, in the sandbox below, `todosStore` is implemented as an external store that stores data outside of React. The `TodosApp` component connects to that external store with the `useSyncExternalStore` Hook.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Agregar tarea</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// Este es un ejemplo de una fuente de almacenamiento de datos de terceros
// que podría necesitar integrarse con React.

// Si tu aplicación está completamente construida con React,
// recomendamos usar el control de estado de React en su lugar.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Cuando sea posible, recomendamos usar el control de estado incorporado en React con [`useState`](/reference/react/useState) y [`useReducer`](/reference/react/useReducer) en su lugar. La API `useExternalSyncStore` es útil mayormente si necesitas integrarte con código existente que no sea de React.

</Note>

---

### Suscripción a una API del navegador {/*subscribing-to-a-browser-api*/}

Otra razón para usar `useSyncExternalStore` es cuando deseas suscribirte a algún valor expuesto por el navegador que cambia con el tiempo. Por ejemplo, supón que deseas que tu componente muestre si la conexión de red está activa. El navegador expone esta información a través de una propiedad llamada [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

Este valor puede cambiar con el tiempo sin que React sea notificado, por lo que necesitas leerlo con `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Para implementar la función `getSnapshot`, lee el valor actual de la API del navegador:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

A continuación, debes implementar la función `subscribe`. Por ejemplo, cuando `navigator.onLine` cambia, el navegador activa los eventos [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) y [`offline` ](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) en el objeto `window`. Debe suscribir el argumento `callback` a los eventos correspondientes y luego devolver una función que limpie estas suscripciones:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Ahora React sabe cómo leer el valor de la API `navigator.onLine` externa y cómo suscribirse a sus cambios. Intenta desconectar tu dispositivo de la red y observa que como respuesta el componente se vuelve a renderizar:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Extracción de lógica en un Hook personalizado {/*extracting-the-logic-to-a-custom-hook*/}

Por lo general, no deberías escribir `useSyncExternalStore` directamente en tus componentes. En su lugar, normalmente lo llamarás desde tu propio Hook personalizado. Esto te permite usar la misma fuente de almacenamiento externa desde diferentes componentes.

Por ejemplo, este Hook personalizado `useOnlineStatus` monitoriza si la red está en línea:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Ahora diferentes componentes pueden llamar a `useOnlineStatus` sin repetir la implementación subyacente:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Añadir compatibilidad con el renderizado en el servidor {/*adding-support-for-server-rendering*/}

Si tu aplicación React usa [renderizado en el servidor,](/reference/react-dom/server), tus componentes React también se ejecutarán fuera del entorno del navegador para generar el HTML inicial. Esto crea algunos desafíos cuando se conecta a una fuente de datos externa:

- Si te estás conectando a una API única del navegador, no funcionará porque no existe en el servidor.
- Si te estás conectando a una fuente de datos externa de terceros, necesitarás que sus datos coincidan entre el servidor y el cliente.

Para resolver estos problemas, pasa una función `getServerSnapshot` como tercer argumento a `useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

La función `getServerSnapshot` es similar a `getSnapshot`, pero solo se ejecuta en dos situaciones:

- Se ejecuta en el servidor al generar el HTML.
- Se ejecuta en el cliente durante la [hidratación](/reference/react-dom/client/hydrateRoot), es decir, cuando React toma el HTML del servidor y lo hace interactivo.

Esto te permite proporcionar la instantánea del valor inicial que se utilizará antes de que la aplicación se vuelva interactiva. Si no hay un valor inicial significativo para el renderizado en el servidor, puedes [forzar el componente para que se renderice solo en el cliente.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

<Note>

Asegúrate de que `getServerSnapshot` devuelva exactamente los mismos datos en el renderizado inicial del cliente que en el que es devuelto en el servidor. Por ejemplo, si `getServerSnapshot` devolvió algún contenido prepopulado de la fuente de almacenamiento en el servidor, debes transferir este contenido al cliente. Una forma común de hacer esto es emitir una etiqueta `<script>` que establece una propiedad global como `window.MY_STORE_DATA` durante el renderizado en el servidor, y que permitirá poder leer esa propiedad global desde el cliente en `getServerSnapshot`. Tu fuente de almacenamiento externa debería proporcionar instrucciones sobre cómo hacer esto.

</Note>

---

## Solución de problemas {/*troubleshooting*/}

### Recibo un error: "*The result of `getSnapshot` should be cached* (el resultado de `getSnapshot` debería almacenarse en caché)" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

Si obtienes este error, significa que tu función `getSnapshot` devuelve un nuevo objeto cada vez que se llama, por ejemplo:

```js {2-5}
function getSnapshot() {
  // 🔴 Do not return always different objects from getSnapshot
  return {
    todos: myStore.todos
  };
}
```

React volverá a rerenderizar el componente si el valor de devolución de `getSnapshot` es diferente al de la última vez. Por eso, si siempre devuelves un valor diferente, entrarás en un bucle infinito y obtendrás este error.

Tu objeto `getSnapshot` solo debería devolver un objeto diferente si algo realmente ha cambiado. Si tu fuente de almacenamiento de datos externa contiene datos inmutables, puede devolver esos datos directamente:

```js {2-3}
function getSnapshot() {
  // ✅ You can return immutable data
  return myStore.todos;
}
```

Si los datos de tu fuente de almacenamiento son mutables, tu función `getSnapshot` debería devolver una instantánea inmutable de la misma. Esto significa que *sí* necesita crear nuevos objetos, pero no debería hacer esto en cada llamada. En su lugar, debe almacenar la última instantánea calculada y devolver la misma instantánea que la última vez si los datos almacenados no han cambiado. La forma en que determina si los datos mutables han cambiado depende de cómo se implemente tu fuente de almacenamiento mutable.

---

### Mi función `subscribe` se llama después de cada rerenderizado {/*my-subscribe-function-gets-called-after-every-re-render*/}

Esta función `subscribe` se define *dentro* de un componente, por lo que es diferente en cada rerenderizado:

```js {2-5}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // 🚩 Siempre una función diferente, por lo que React se volverá a suscribir en cada rerenderizado
  function subscribe() {
    // ...
  }

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```

<<<<<<< HEAD
React se volverá a suscribir a tu fuente de almacenamiento si pasas una función de `subscribe` diferente entre rerenderizados. Si esto causa problemas de rendimiento y desea evitar volver a suscribirse a la fuente de almacenamiento de datos externa, mueva la función `subscribe` fuera:
=======
React will resubscribe to your store if you pass a different `subscribe` function between re-renders. If this causes performance issues and you'd like to avoid resubscribing, move the `subscribe` function outside:
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

```js {1-4}
// ✅ Siempre la misma función, por lo que React no necesitará volver a suscribirse
function subscribe() {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Alternativamente, puedes envolver `subscribe` con [`useCallback`](/reference/react/useCallback) para solo resuscribirte cuando algún argumento cambie:

```js {2-5}
function ChatIndicator({ userId }) {
  // ✅ Same function as long as userId doesn't change
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```
