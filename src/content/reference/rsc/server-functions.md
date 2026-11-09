---
title: Server Functions
---

<RSC>

Las Server Functions son para usarse en [React Server Components](/reference/rsc/server-components).

**Nota:** Hasta Septiembre de 2024, nos referíamos a todas las Server Functions como “Server Actions”. Si una Server Function se pasa a una propiedad de acción o se llama desde dentro de una acción, entonces es una Server Action, pero no todas las Server Functions son Server Actions. La nomenclatura en esta documentación ha sido actualizada para reflejar que las Server Functions pueden ser usadas para múltiples propósitos.

</RSC>

<Intro>

Las Server Functions permiten a los Client Components llamar a funciones asíncronas ejecutadas en el servidor.

</Intro>

<InlineToc />

<Note>

#### ¿Cómo se crea la compatibilidad con las Server Functions? {/*how-do-i-build-support-for-server-functions*/}

<<<<<<< HEAD
Mientras que las Server Functions en React 19 son estables y no se romperán entre versiones menores, las APIs subyacentes utilizadas para implementar Server Functions en un bundler o framework de React Server Components no siguen un versionado semántico y pueden romperse entre versiones menores en React 19.x.
=======
While Server Functions in React 19 are stable and will not break between minor versions, the underlying APIs used to implement Server Functions in a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Para soportar Server Functions como bundler o framework, recomendamos usar una versión específica de React, o usar la versión Canary. Seguiremos trabajando con bundlers y frameworks para estabilizar las API utilizadas para implementar Server Functions en el futuro.

</Note>

<<<<<<< HEAD
Cuando se define una Server Function con la directiva [`"use server"`](/reference/rsc/use-server), tu framework creará automáticamente una referencia a la Server Function, y pasará esa referencia al Client Component. Cuando esa función es llamada en el cliente, React enviará una petición al servidor para ejecutar la función, y devolver el resultado.
=======
When a Server Function is defined with the [`"use server"`](/reference/rsc/use-server) directive, your framework will automatically create a reference to the Server Function, and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function, and return the result.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Las Server Functions pueden crearse en Server Components y pasarse como props a los Client Components, o pueden importarse y utilizarse en Client Components.

## Uso {/*usage*/}

<<<<<<< HEAD
### Creación de una Server Function a partir de un Server Component {/*creating-a-server-function-from-a-server-component*/}
=======
### Creating a Server Function in a Server Component {/*creating-a-server-function-from-a-server-component*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Los Server Components pueden definir Server Functions con la directiva `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote() {
  async function createNoteAction() {
    // Server Function
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}
```

Cuando React renderiza la Server Function `EmptyNote`, creará una referencia a la función `createNoteAction`, y pasará esa referencia al Client Component `Button`. Cuando se pulse el botón, React enviará una petición al servidor para ejecutar la función `createNoteAction` con la referencia proporcionada:

```js {5}
"use client";

export default function Button({onClick}) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>;
}
```

Para más información, consulte la documentación de [`"use server"`](/reference/rsc/use-server).

<<<<<<< HEAD

### Importar Server Functions desde Client Components {/*importing-server-functions-from-client-components*/}
=======
### Importing a Server Function into a Client Component {/*importing-server-functions-from-client-components*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Los Client Components pueden importar Server Functions desde archivos que utilicen la directiva `"use server"`:

```js [[1, 4, "createNote"]]
// actions.js
"use server";

export async function createNote() {
  await db.notes.create();
}
```

Cuando el bundler construye el Client Component `EmptyNote`, creará una referencia a la función `createNote` en el bundle. Cuando se pulse el botón, React enviará una petición al servidor para ejecutar la función `createNote` utilizando la referencia proporcionada:

```js [[1, 4, "createNote"], [1, 7, "createNote"], [1, 9, "createNote"]]
// EmptyNote.js
"use client";

import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  return <button onClick={() => createNote()}>Create Empty Note</button>;
}
```

Para más información, consulte la documentación de [`"use server"`](/reference/rsc/use-server).

<<<<<<< HEAD
### Server Functions con Actions {/*server-functions-with-actions*/}
=======
### Calling a Server Function from an Action {/*server-functions-with-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Las Server Functions pueden ser llamadas desde Actions en el cliente:

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 15, "updateName"], [2, 13, "submitAction"], [2, 28, "submitAction"]]
// UpdateName.js
"use client";

import {useState, useTransition} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  function submitAction() {
    startTransition(async () => {
      const {error} = await updateName(name);
      // State updates after await aren't automatically marked as Transitions,
      // so wrap them in another startTransition.
      startTransition(() => {
        setError(error);
        if (!error) {
          setName('');
        }
      });
    });
  }

  return (
    <form action={submitAction}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={event => setName(event.target.value)}
        disabled={isPending}
      />
      {error && <span>Failed: {error}</span>}
    </form>
  );
}
```

Esto te permite acceder al estado `isPending` de la Server Function envolviéndola en una Action en el cliente.

<<<<<<< HEAD
Para más información, consulte la documentación de [Llamada a una Server Function fuera de `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### Server Functions con Form Actions {/*using-server-functions-with-form-actions*/}
=======
For more, see the docs for [Calling a Server Function outside of `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form).

### Passing a Server Function to the `<form>` `action` prop {/*using-server-functions-with-form-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Las Server Functions funcionan con las nuevas funciones de Form de React 19.

<<<<<<< HEAD
Puede pasar una Server Function a un Form para automáticamente enviar el formulario al servidor:
=======
Pass a Server Function to the `<form>` `action` prop to submit the form to the server. React passes the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to the Server Function as its first argument:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    throw new Error('Name is required');
  }
  await db.users.updateName(name);
}
```

```js [[1, 4, "updateName"], [1, 8, "updateName"]]
// UpdateName.js
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  );
}
```

<<<<<<< HEAD
Cuando el envío del Form tiene éxito, React restablecerá automáticamente el formulario. Puedes añadir `useActionState` para acceder al estado pendiente, última respuesta, o para soportar la mejora progresiva.
=======
When the Server Function passed to the `<form>` `action` prop succeeds, React automatically resets the form's uncontrolled fields. Users can submit the form before its JavaScript bundle loads. Use `useActionState` to access the Action's pending state and most recent return value.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Para más información, consulte la documentación de [Server Functions en Forms](/reference/rsc/use-server#server-functions-in-forms).

<<<<<<< HEAD
### Server Functions con `useActionState` {/*server-functions-with-use-action-state*/}

Puede llamar a las Server Functions con `useActionState` para el caso común en el que sólo necesite acceder al estado pendiente de la acción y a la última respuesta devuelta:
=======
### Calling a Server Function with `useActionState` {/*server-functions-with-use-action-state*/}

Call a Server Function with `useActionState` to access the Action's pending state and most recent return value. The Server Function receives the previous state as its first argument and the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) as its second argument. Its return value becomes the next state:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(previousState, formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "submitAction"], [2, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending} />
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

<<<<<<< HEAD
Al utilizar `useActionState` con Server Functions, React también reproducirá automáticamente los envíos de formularios introducidos antes de que finalice la hidratación. Esto significa que los usuarios pueden interactuar con la aplicación incluso antes de que esta se haya hidratado.

Para más información, consulte la documentación de [`useActionState`](/reference/react/useActionState).

### Mejora progresiva con `useActionState` {/*progressive-enhancement-with-useactionstate*/}
=======
When the function passed to `useActionState` is a Server Function, users can submit the form before hydration finishes. React can display the Server Function's return value before JavaScript loads.

For more, see the docs for [`useActionState`](/reference/react/useActionState).

To keep submitted values or control when the form resets, see [Preserving form values after an Action](/reference/react-dom/components/form#preserve-form-values-after-an-action).

### Supporting progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Las Server Functions también admiten la mejora progresiva con el tercer argumento de `useActionState`.

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "/name/update"], [3, 8, "submitAction"], [3, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, {error: null}, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<<<<<<< HEAD
Cuando se proporciona <CodeStep step={2}>permalink</CodeStep> a `useActionState`, React redirigirá a la URL proporcionada si el formulario se envía antes de que se cargue el paquete JavaScript.

Para más información, consulte la documentación de [`useActionState`](/reference/react/useActionState).
=======
If you pass the <CodeStep step={2}>`permalink`</CodeStep> to `useActionState`, the browser navigates to that URL when the form is submitted before the JavaScript bundle loads. At the destination, render the same form component with the same Server Function and `permalink` so React can pass the returned state to it.

For more, see the docs for [`useActionState`](/reference/react/useActionState).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
