---
title: useTransition
---

<Intro>

`useTransition` es un Hook de React que te permite actualizar el estado sin bloquear la UI.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useTransition()` {/*usetransition*/}

<<<<<<< HEAD
Llama a `useTransition` en el nivel superior de tu componente para marcar algunas actualizaciones de estado como transiciones.
=======
Call `useTransition` at the top level of your component to mark some state updates as Transitions.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

`useTransition` no recibe ningun parámetro.

#### Devuelve {/*returns*/}

`useTransition` devuelve un _array_ con exactamente dos elementos:

<<<<<<< HEAD
1. `isPending` que indica si hay una transición pendiente.
2. [`startTransition` function](#starttransition) que permite marcar una actualización de estado como una transición.
=======
1. The `isPending` flag that tells you whether there is a pending Transition.
2. The [`startTransition` function](#starttransition) that lets you mark a state update as a Transition.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

---

### Función `startTransition` {/*starttransition*/}

<<<<<<< HEAD
La función `startTransition` devuelta por `useTransition` permite marcar una actualización de estado como una transición.
=======
The `startTransition` function returned by `useTransition` lets you mark a state update as a Transition.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### Parámetros {/*starttransition-parameters*/}

<<<<<<< HEAD
* `scope`: Una función que actualiza algún estado llamando a una o varias [funciones `set`.](/reference/react/useState#setstate) React inmediatamente llama a `scope` sin parámetros y marca todas las actualizaciones de estado programadas sincrónicamente durante la llamada a la función `scope` como transiciones. Serán [sin bloqueo](#marking-a-state-update-as-a-non-blocking-transition) y [no mostrarán indicadores de carga no deseados.](#preventing-unwanted-loading-indicators)
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no parameters and marks all state updates scheduled synchronously during the `scope` function call as Transitions. They will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](#preventing-unwanted-loading-indicators)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

#### Devuelve {/*starttransition-returns*/}

`startTransition` no devuelve nada.

#### Advertencias {/*starttransition-caveats*/}

<<<<<<< HEAD
* `useTransition` es un Hook, por lo que sólo puede ser llamado dentro de componentes o Hooks personalizados. Si necesitas iniciar una transición en otro lugar (por ejemplo, desde una biblioteca de datos), llama a la función independiente [`startTransition`](/reference/react/startTransition) en su lugar.

* Puedes envolver una actualización en una transición sólo si tienes acceso a la función `set` de ese estado. Si deseas iniciar una transición en respuesta a alguna prop o algún valor de un Hook personalizado, prueba [`useDeferredValue`](/reference/react/useDeferredValue) en su lugar.

* La función que pases a `startTransition` debe ser síncrona. React ejecuta inmediatamente esta función, marcando como transiciones todas las actualizaciones de estado que se produzcan mientras se ejecuta. Si intentas realizar más actualizaciones de estado más tarde (por ejemplo, en un tiempo de espera), no se marcarán como transiciones.

* Una actualización de estado marcada como transición será interrumpida por otras actualizaciones de estado. Por ejemplo, si actualizas un componente gráfico dentro de una transición, pero luego empiezas a escribir en un input mientras el gráfico está en medio de un rerenderizado, React reiniciará el trabajo de renderizado en el componente gráfico después de gestionar la actualización del input.
=======
* `useTransition` is a Hook, so it can only be called inside components or custom Hooks. If you need to start a Transition somewhere else (for example, from a data library), call the standalone [`startTransition`](/reference/react/startTransition) instead.

* You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as Transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as Transitions.

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input update.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

* Las actualizaciones de transición no pueden utilizarse para controlar las entradas de texto.

<<<<<<< HEAD
* Si hay varias transiciones en curso, React las agrupa. Se trata de una limitación que probablemente se eliminará en una versión futura.
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

---

## Uso {/*usage*/}

<<<<<<< HEAD
### Marcar una actualización de estado como transición no bloqueante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Llama a `useTransition` en el nivel superior de tu componente para marcar las actualizaciones de estado como *transiciones* no bloqueantes.
=======
### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

Call `useTransition` at the top level of your component to mark state updates as non-blocking *Transitions*.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` devuelve un array con exactamente dos elementos:

<<<<<<< HEAD
1. <CodeStep step={1}>`isPending` flag</CodeStep> que te indica si hay una transición pendiente.
2. <CodeStep step={2}>`startTransition` function</CodeStep> que permite marcar una actualización de estado como una transición.

A continuación, puedes marcar una actualización de estado como una transición de esta manera:
=======
1. The <CodeStep step={1}>`isPending` flag</CodeStep> that tells you whether there is a pending Transition.
2. The <CodeStep step={2}>`startTransition` function</CodeStep> that lets you mark a state update as a Transition.

You can then mark a state update as a Transition like this:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Las transiciones permiten mantener la capacidad de respuesta de las actualizaciones de la interfaz de usuario incluso en dispositivos lentos.

<<<<<<< HEAD
Con una transición, la interfaz de usuario mantiene su capacidad de respuesta en medio de una nueva renderización. Por ejemplo, si el usuario hace clic en una pestaña pero luego cambia de opinión y hace clic en otra, puede hacerlo sin esperar a que termine la primera renderización.
=======
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

<Recipes titleText="Diferencia entre useTransition y las actualizaciones de estado normales" titleId="examples">

<<<<<<< HEAD
#### Actualizar la pestaña actual en una transición {/*updating-the-current-tab-in-a-transition*/}
=======
#### Updating the current tab in a Transition {/*updating-the-current-tab-in-a-transition*/}
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

En este ejemplo, la pestaña "Posts" está **artificialmente ralentizada** para que tarde al menos un segundo en renderizarse.

<<<<<<< HEAD
Haz clic en "Mensajes" y luego inmediatamente en "Contacto". Observa que esto interrumpe la renderización lenta de "Posts". La pestaña _"Contact"_ se muestra inmediatamente. Debido a que esta actualización de estado está marcada como una transición, una renderización lenta no congela la interfaz de usuario.
=======
Click "Posts" and then immediately click "Contact". Notice that this interrupts the slow render of "Posts". The "Contact" tab shows immediately. Because this state update is marked as a Transition, a slow re-render did not freeze the user interface.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        Acerca de
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // No hace nada durante 1 ms por ítem para emular un código extremadamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

<<<<<<< HEAD
#### Actualizar la pestaña actual sin transición {/*updating-the-current-tab-without-a-transition*/}

En este ejemplo, la pestaña "Posts" también es **artificialmente ralentizada** para que tarde al menos un segundo en renderizarse. A diferencia del ejemplo anterior, esta actualización de estado **no es una transición.**

Haz clic en "Mensajes" e inmediatamente después en "Contacto". Observa que la aplicación se congela mientras se renderiza la pestaña ralentizada, y la interfaz de usuario deja de responder. Esta actualización de estado no es una transición, por lo que una renderización lenta congela la interfaz de usuario.
=======
#### Updating the current tab without a Transition {/*updating-the-current-tab-without-a-transition*/}

In this example, the "Posts" tab is also **artificially slowed down** so that it takes at least a second to render. Unlike in the previous example, this state update is **not a Transition.**

Click "Posts" and then immediately click "Contact". Notice that the app freezes while rendering the slowed down tab, and the UI becomes unresponsive. This state update is not a Transition, so a slow re-render freezed the user interface.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        Acerca de
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // No hace nada durante 1 ms por ítem para emular un código extremadamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

<<<<<<< HEAD
### Actualización del componente principal en una transición {/*updating-the-parent-component-in-a-transition*/}

También puedes actualizar el estado de un componente padre desde la llamada "useTransition". Por ejemplo, este componente `TabButton` envuelve su lógica `onClick` en una transición:
=======
### Updating the parent component in a Transition {/*updating-the-parent-component-in-a-transition*/}

You can update a parent component's state from the `useTransition` call, too. For example, this `TabButton` component wraps its `onClick` logic in a Transition:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

<<<<<<< HEAD
Debido a que el componente padre actualiza su estado dentro del controlador de evento `onClick`, esa actualización de estado se marca como una transición. Esta es la razón por la que, como en el ejemplo anterior, puedes hacer clic en "Posts" y luego inmediatamente hacer clic en "Contacto". La actualización de la pestaña seleccionada se marca como una transición, por lo que no bloquea las interacciones del usuario.
=======
Because the parent component updates its state inside the `onClick` event handler, that state update gets marked as a Transition. This is why, like in the earlier example, you can click on "Posts" and then immediately click "Contact". Updating the selected tab is marked as a Transition, so it does not block user interactions.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        Acerca de
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // No hace nada durante 1 ms por ítem para emular un código extremadamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

<<<<<<< HEAD
### Visualización de un estado visual pendiente durante la transición {/*displaying-a-pending-visual-state-during-the-transition*/}

Puedes utilizar el valor booleano `isPending` devuelto por `useTransition` para indicar al usuario que una transición está en curso. Por ejemplo, el botón de la pestaña puede tener un estado visual especial "pendiente":
=======
### Displaying a pending visual state during the Transition {/*displaying-a-pending-visual-state-during-the-transition*/}

You can use the `isPending` boolean value returned by `useTransition` to indicate to the user that a Transition is in progress. For example, the tab button can have a special "pending" visual state:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Fíjate en que hacer clic en _"Posts"_ ahora es más sensible porque el botón de la pestaña se actualiza inmediatamente:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        Acerca de
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // No hace nada durante 1 ms por ítem para emular un código extremadamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Evitar indicadores de carga no deseados {/*preventing-unwanted-loading-indicators*/}

En este ejemplo, el componente `PostsTab` obtiene algunos datos utilizando una fuente de datos [preparada par usarse con Suspense](/reference/react/Suspense). Al hacer clic en la pestaña _"Posts"_, el componente `PostsTab` se *suspende*, haciendo que aparezca el fallback de carga más cercano:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        Acerca de
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Ocultar todo el contenedor de pestañas para mostrar un indicador de carga conduce a una experiencia de usuario discordante. Si añades `useTransition` a `TabButton`, puedes indicar que se muestre el estado pendiente en el botón de la pestaña.

Observa que al hacer clic en "Entradas" ya no se sustituye todo el contenedor de la pestaña por un spinner:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        Acerca de
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<<<<<<< HEAD
[Más información sobre el uso de transiciones con Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Las transiciones sólo "esperarán" el tiempo suficiente para evitar ocultar el contenido *ya revelado* (como el contenedor de la pestaña). Si la pestaña Entradas tuviera una [barrera de `<Suspense>` anidada,](/reference/react/Suspense#revealing-nested-content-as-it-loads) la transición no la "esperaría".
=======
[Read more about using Transitions with Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Transitions will only "wait" long enough to avoid hiding *already revealed* content (like the tab container). If the Posts tab had a [nested `<Suspense>` boundary,](/reference/react/Suspense#revealing-nested-content-as-it-loads) the Transition would not "wait" for it.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

</Note>

---

### Construir un enrutador preparado para Suspense {/*building-a-suspense-enabled-router*/}

<<<<<<< HEAD
Si estás construyendo un framework de React o un enrutador, te recomendamos marcar las navegaciones de página como transiciones.
=======
If you're building a React framework or a router, we recommend marking page navigations as Transitions.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Esto se recomienda por dos razones:

- [Las transiciones son interrumpibles,](#marking-a-state-update-as-a-non-blocking-transition) que permite al usuario hacer clic sin esperar a que se complete la nueva renderización.
- [Las transiciones evitan indicadores de carga no deseados,](#preventing-unwanted-loading-indicators) que permite al usuario evitar saltos bruscos en la navegación.

<<<<<<< HEAD
He aquí un pequeño ejemplo de enrutador simplificado que utiliza transiciones para las navegaciones.
=======
Here is a tiny simplified router example using Transitions for navigations.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

<<<<<<< HEAD
Se espera que los enredadores [preparados para Suspense](/reference/react/Suspense) envuelvan las actualizaciones de navegación en transiciones por defecto.
=======
[Suspense-enabled](/reference/react/Suspense) routers are expected to wrap the navigation updates into Transitions by default.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

</Note>

---

### Displaying an error to users with an error boundary {/*displaying-an-error-to-users-with-error-boundary*/}

<Canary>

La barrera de error para useTransition está disponible actualmente solo en los canales experimental y canary de React. Más información sobre [los canales de lanzamiento de React aquí](/community/versioning-policy#all-release-channels).

</Canary>

Si una función que se pasa a `startTransition` lanza un error, puedes mostrar un error a tu usuario con una [barrera de error](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Para usar una barrera de error, envuelve el componente en el que estás llamando a `useTransition` en una barrera de error. Una vez que la función que se pasa a `startTransition` lanza un error se mostrará el _fallback_ de la barrera de error.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
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

<<<<<<< HEAD
### No funciona la actualización de una entrada en una transición {/*updating-an-input-in-a-transition-doesnt-work*/}

No se puede utilizar una transición para una variable de estado que controla una entrada:
=======
### Updating an input in a Transition doesn't work {/*updating-an-input-in-a-transition-doesnt-work*/}

You can't use a Transition for a state variable that controls an input:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use Transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

<<<<<<< HEAD
Esto se debe a que las transiciones son no bloqueantes, pero la actualización de una entrada en respuesta al evento de cambio debe producirse de forma sincrónica. Si deseas ejecutar una transición en respuesta a la escritura, tiene dos opciones:

1. Puedes declarar dos variables de estado separadas: una para el estado de la entrada (que siempre se actualiza de forma sincrónica), y otra que actualizarás en una transición. Esto te permite controlar la entrada utilizando el estado síncrono, y pasar la variable de estado de transición (que "irá por detrás" de la entrada) al resto de tu lógica de renderizado.
2. Alternativamente, puedes tener una variable de estado, y añadir [`useDeferredValue`](/reference/react/useDeferredValue) que "irá por detrás" del valor real. Se activarán rerenderizados no bloqueantes para "ponerse al día" con el nuevo valor de forma automática.

---

### React no trata mi actualización de estado como una transición {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Cuando envuelvas una actualización de estado en una transición, asegúrate de que ocurre *durante* la llamada `startTransition`:
=======
This is because Transitions are non-blocking, but updating an input in response to the change event should happen synchronously. If you want to run a Transition in response to typing, you have two options:

1. You can declare two separate state variables: one for the input state (which always updates synchronously), and one that you will update in a Transition. This lets you control the input using the synchronous state, and pass the Transition state variable (which will "lag behind" the input) to the rest of your rendering logic.
2. Alternatively, you can have one state variable, and add [`useDeferredValue`](/reference/react/useDeferredValue) which will "lag behind" the real value. It will trigger non-blocking re-renders to "catch up" with the new value automatically.

---

### React doesn't treat my state update as a Transition {/*react-doesnt-treat-my-state-update-as-a-transition*/}

When you wrap a state update in a Transition, make sure that it happens *during* the `startTransition` call:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

La función que pases a `startTransition` debe ser síncrona.

<<<<<<< HEAD
No puedes marcar una actualización como una transición así:
=======
You can't mark an update as a Transition like this:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

En su lugar, podrías hacer esto:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

<<<<<<< HEAD
Del mismo modo, no se puede marcar una actualización como una transición como esta:
=======
Similarly, you can't mark an update as a Transition like this:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Setting state *after* startTransition call
  setPage('/about');
});
```

Sin embargo, esto funciona en su lugar:

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

---

### Quiero llamar a `useTransition` desde fuera de un componente {/*i-want-to-call-usetransition-from-outside-a-component*/}

No puedes llamar a `useTransition` fuera de un componente porque es un Hook. En este caso, utiliza el método independiente [`startTransition`](/reference/react/startTransition). Funciona de la misma manera, pero no proporciona el indicador `isPending`.

---

### La función que paso a `startTransition` se ejecuta inmediatamente {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Si ejecutas este código, imprimirá 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

<<<<<<< HEAD
**Se espera que imprima 1, 2, 3.** La función que pasas a `startTransition` no se retrasa. Al contrario que con el `setTimeout` del navegador, no ejecuta el callback más tarde. React ejecuta tu función inmediatamente, pero cualquier actualización de estado programada *mientras se está ejecutando* se marca como transición. Puedes imaginar que funciona así:
=======
**It is expected to print 1, 2, 3.** The function you pass to `startTransition` does not get delayed. Unlike with the browser `setTimeout`, it does not run the callback later. React executes your function immediately, but any state updates scheduled *while it is running* are marked as Transitions. You can imagine that it works like this:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a Transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```
