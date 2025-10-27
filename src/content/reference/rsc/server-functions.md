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

Mientras que las Server Functions en React 19 son estables y no se romperán entre versiones menores, las APIs subyacentes utilizadas para implementar Server Functions en un bundler o framework de React Server Components no siguen un versionado semántico y pueden romperse entre versiones menores en React 19.x.

Para soportar Server Functions como bundler o framework, recomendamos usar una versión específica de React, o usar la versión Canary. Seguiremos trabajando con bundlers y frameworks para estabilizar las API utilizadas para implementar Server Functions en el futuro.

</Note>

<<<<<<< HEAD
Cuando se define una Server Function con la directiva [`"use server"`](/reference/rsc/use-server), tu framework creará automáticamente una referencia a la Server Function, y pasará esa referencia al Client Component. Cuando esa función es llamada en el cliente, React enviará una petición al servidor para ejecutar la función, y devolver el resultado.
=======
When a Server Function is defined with the [`"use server"`](/reference/rsc/use-server) directive, your framework will automatically create a reference to the Server Function, and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function, and return the result.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

Las Server Functions pueden crearse en Server Components y pasarse como props a los Client Components, o pueden importarse y utilizarse en Client Components.

## Uso {/*usage*/}

### Creación de una Server Function a partir de un Server Component {/*creating-a-server-function-from-a-server-component*/}

Los Server Components pueden definir Server Functions con la directiva `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Cuando React renderiza la Server Function `EmptyNote`, creará una referencia a la función `createNoteAction`, y pasará esa referencia al Client Component `Button`. Cuando se pulse el botón, React enviará una petición al servidor para ejecutar la función `createNoteAction` con la referencia proporcionada:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

Para más información, consulte la documentación de [`"use server"`](/reference/rsc/use-server).


### Importar Server Functions desde Client Components {/*importing-server-functions-from-client-components*/}

Los Client Components pueden importar Server Functions desde archivos que utilicen la directiva `"use server"`:

```js [[1, 3, "createNote"]]
"use server";

export async function createNote() {
  await db.notes.create();
}

```

Cuando el bundler construye el Client Component `EmptyNote`, creará una referencia a la función `createNote` en el bundle. Cuando se pulse el botón, React enviará una petición al servidor para ejecutar la función `createNote` utilizando la referencia proporcionada:

```js [[1, 2, "createNote"], [1, 5, "createNote"], [1, 7, "createNote"]]
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

Para más información, consulte la documentación de [`"use server"`](/reference/rsc/use-server).

### Server Functions con Actions {/*server-functions-with-actions*/}

Las Server Functions pueden ser llamadas desde Actions en el cliente:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Failed: {error}</span>}
    </form>
  )
}
```

Esto te permite acceder al estado `isPending` de la Server Function envolviéndola en una Action en el cliente.

Para más información, consulte la documentación de [Llamada a una Server Function fuera de `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### Server Functions con Form Actions {/*using-server-functions-with-form-actions*/}

Las Server Functions funcionan con las nuevas funciones de Form de React 19.

Puede pasar una Server Function a un Form para automáticamente enviar el formulario al servidor:


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

Cuando el envío del Form tiene éxito, React restablecerá automáticamente el formulario. Puedes añadir `useActionState` para acceder al estado pendiente, última respuesta, o para soportar la mejora progresiva.

Para más información, consulte la documentación de [Server Functions en Forms](/reference/rsc/use-server#server-functions-in-forms).

### Server Functions con `useActionState` {/*server-functions-with-use-action-state*/}

Puede llamar a las Server Functions con `useActionState` para el caso común en el que sólo necesite acceder al estado pendiente de la acción y a la última respuesta devuelta:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

Al utilizar `useActionState` con Server Functions, React también reproducirá automáticamente los envíos de formularios introducidos antes de que finalice la hidratación. Esto significa que los usuarios pueden interactuar con la aplicación incluso antes de que esta se haya hidratado.

<<<<<<< HEAD
Para más información, consulte la documentación de [`useActionState`](/reference/react/useActionState).
=======
For more, see the docs for [`useActionState`](/reference/react/useActionState).
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

### Mejora progresiva con `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Las Server Functions también admiten la mejora progresiva con el tercer argumento de `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

Cuando se proporciona <CodeStep step={2}>permalink</CodeStep> a `useActionState`, React redirigirá a la URL proporcionada si el formulario se envía antes de que se cargue el paquete JavaScript.

<<<<<<< HEAD
Para más información, consulte la documentación de [`useActionState`](/reference/react/useActionState).
=======
For more, see the docs for [`useActionState`](/reference/react/useActionState).
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72
