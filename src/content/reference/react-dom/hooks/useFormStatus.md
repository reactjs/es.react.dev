---
title: useFormStatus
---

<Intro>

`useFormStatus` es un Hook que brinda información de estado del último formulario enviado.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

El Hook `useFormStatus` provee información de estado del último formulario enviado.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Enviar</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

<<<<<<< HEAD
Para obtener información de estado, el componente de `Enviar` tiene que ser renderizado dentro de un `<form>`. El Hook retorna información como la propiedad <CodeStep step={1}>`pending`</CodeStep> que te dice si el formulario se está enviando activamente.
=======
To get status information, the `Submit` component must be rendered within a `<form>`. The Hook returns information like the <CodeStep step={1}>`pending`</CodeStep> property which tells you if the form is actively submitting.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

En el ejemplo de arriba, `Enviar` usa esta información para deshabilitar la pulsación de `<button>` mientras el formulario se está enviando.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

`useFormStatus` no toma ningún parámetro.

#### Retorna {/*returns*/}

Un objeto de `status` con las siguientes propiedades:

* `pending`: Un booleano. Si es `true` significa que el `<form>` padre está pendiente de enviarse. De otro modo es `false`.

* `data`:Un objeto que implementa la [`interfaz FormData`](https://developer.mozilla.org/es/docs/Web/API/FormData) que contiene los datos que el `<form>` padre está enviando. Si no hay ningún envío activo o no hay `<form>`, va a ser `null`.

* `method`: El valor de un string ya sea `'get'` o `'post'`. Este representa si el `<form>` se está enviando con el [método HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Methods) `GET` o `POST`. Por defecto, un `<form>` va a usar el método `GET` y puede estar especificado con la propiedad de [`method`](https://developer.mozilla.org/es/docs/Web/HTML/Element/form#method).

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: Una referencia a la función que es pasada al prop de `action` en el `<form>` padre. Si no hay un `<form>` padre, la propiedad es `null`. Si se ha proporcionado un valor URI al prop de `action`, o no se ha especificado un prop de `action`, `status.action` va a ser `null`. 

#### Advertencias {/*caveats*/}

<<<<<<< HEAD
* El Hook `useFormStatus` debe llamarse desde un componente que se renderiza dentro de un `<form>`. 
* `useFormStatus` solo retornará información de estado para un `<form>` padre. No retornará información de estado a ningún `<form>` renderizado en ese mismo componente o componente hijos.
=======
* The `useFormStatus` Hook must be called from a component that is rendered inside a `<form>`.
* `useFormStatus` will only return status information for a parent `<form>`. It will not return status information for any `<form>` rendered in that same component or children components.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

---

## Uso {/*usage*/}

### Muestra un estado pendiente durante el envío de un formulario {/*display-a-pending-state-during-form-submission*/}
Para mostrar un estado pendiente mientras un formulario se está enviando, puedes llamar al Hook `useFormStatus` en un componente renderizado en un `<form>` y leer la propiedad `pending` que retorna.

<<<<<<< HEAD
Aquí, usamos la propiedad `pending` para indicar que el formulario se está enviando. 
=======
Here, we use the `pending` property to indicate the form is submitting.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```
</Sandpack>

<Pitfall>

##### `useFormStatus` no retorna información de estado a un `<form>` renderizado en el mismo componente. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

El Hook `useFormStatus` solo retorna información de estado a un `<form>` padre y no para ningún `<form>` renderizado en el mismo componente que llama el Hook, o componentes hijos.

```js
function Form() {
  // 🚩 `pending` nunca será true
  // useFormStatus no rastrea el formulario renderizado en este componente
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

En su lugar llama a `useFormStatus` desde dentro de un componente que se encuentra dentro de un `<form>`.

```js
function Submit() {
<<<<<<< HEAD
  // ✅ `pending` se derivará del formulario que envuelve el componente Enviar
  const { pending } = useFormStatus(); 
=======
  // ✅ `pending` will be derived from the form that wraps the Submit component
  const { pending } = useFormStatus();
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61
  return <button disabled={pending}>...</button>;
}

function Form() {
  // Este es el <form> que `useFormStatus` rastrea
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Lee los datos del formulario que se envían {/*read-form-data-being-submitted*/}

Puedes usar la propiedad `data` de la información de estado que retorna del `useFormStatus` para mostrar qué datos está siendo enviando por el usuario.

Aquí, tenemos un formulario donde los usuarios pueden solicitar un nombre de usuario. Podemos usar `useFormStatus` para mostrar temporalmente un mensaje de estado que confirme qué nombre de usuario han solicitado.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Solicita un nombre de usuario: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Enviar
      </button>
      <br />
      <p>{data ? `Solicitando ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>

---

## Solución de problemas {/*troubleshooting*/}

### `status.pending` nunca es `true` {/*pending-is-never-true*/}

<<<<<<< HEAD
`useFormStatus` solo retornará información de estado a un `<form>` padre. 
=======
`useFormStatus` will only return status information for a parent `<form>`.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

Si el componente que llama a `useFormStatus` no está anidado en un `<form>`, `status.pending` siempre retornará `false`. Verifica que `useFormStatus` está siendo llamado en un componente que es hijo de un elemento `<form>`.

`useFormStatus` no rastreará al estado de un `<form>` renderizado en el mismo componente. Mira [Atención](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component)  para más detalles.
