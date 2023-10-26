---
el título: useFormStatus
canario: Verdadero
---

<Canary>

El Hook 'useFormStatus' actualmente solo está disponible en los canales canary y experimental de React. [Obtenga más información sobre los canales de lanzamiento de React aquí.](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useFormStatus` es un Hook que le brinda información de estado de la última presentación de formulario.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Referencia {/*referencia*/}

### `useFormStatus()` {/*use-form-status*/}

El Hook `useFormStatus` proporciona información de estado de la última presentación de formulario.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Para obtener información de estado, el componente `Submit` debe renderizarse dentro de un `<form>`. El Hook devuelve información como la propiedad <CodeStep step={1}>`pending`</CodeStep> que le indica si el formulario se está enviando activamente.

En el ejemplo anterior, `Submit` utiliza esta información para desactivar las pulsaciones de `button` mientras se envía el formulario.

[Vea más ejemplos a continuación.](#usage)

#### Parámetros {/*parameters*/}

`useFormStatus` no toma ningún parámetro.

#### Devolución {/*return*/}

Un objeto `status` con las siguientes propiedades:

* `pending`: Un booleano. Si es true, esto significa que el `<form>` padre está pendiente de envío. De lo contrario, es `false`.

* `data`: Un objeto que implementa la [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) que contiene los datos que el `<form>` padre está enviando. Si no hay un envío activo o no hay un `<form>` padre, será `null`.

* `method`: Un valor de cadena que puede ser `'get'` o `'post'`. Esto representa si el `<form>` padre está enviando con el método `GET` o `POST` [método HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). Por defecto, un `<form>` usará el método `GET` y puede especificarse mediante la propiedad [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (Enlace a la documentación de `<form>`. "Lea más sobre la propiedad `action` en `<form>`.")
* `action`: Una referencia a la función pasada a la propiedad `action` en el `<form>` padre. Si no hay un `<form>` padre, la propiedad es `null`. Si se proporciona un valor de URI a la propiedad `action`, o no se especifica la propiedad `action`, `status.action` será `null`.

#### Caveats {/*caveats*/}

* The `useFormStatus` Hook must be called from a component that is rendered inside a `<form>`. 
* `useFormStatus` will only return status information for a parent `<form>`. It will not return status information for any `<form>` rendered in that same component or children components.

---

## Uso {/*usage*/}

### Mostrar un estado pendiente durante el envío del formulario {/*display-a-pending-state-during-form-submission*/}
Para mostrar un estado pendiente mientras se envía un formulario, puede llamar al Hook `useFormStatus` en un componente renderizado en un `<form>` y leer la propiedad `pending` que se devuelve.

Aquí utilizamos la propiedad `pending` para indicar que el formulario se está enviando.

<Sandpack>

```js App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
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

```js actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>  

<Pitfall>

##### `useFormStatus` no devolverá información de estado para un `<form>` renderizado en el mismo componente. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

El Hook `useFormStatus` solo devuelve información de estado para un `<form>` padre y no para ningún `<form>` renderizado en el mismo componente que llama al Hook o en componentes hijos.

```js
function Form() {
  // 🚩 `pending` will never be true
  // useFormStatus does not track the form rendered in this component
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

En su lugar, llame a `useFormStatus` desde un componente que esté ubicado dentro de un `<form>`.

```js
function Submit() {
  // ✅ `pending` will be derived from the form that wraps the Submit component
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // This is the <form> `useFormStatus` tracks
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Leer los datos del formulario que se están enviando {/*read-form-data-being-submitted*/}

Puede utilizar la propiedad `data` de la información de estado devuelta por `useFormStatus` para mostrar los datos que el usuario está enviando.

Aquí tenemos un formulario donde los usuarios pueden solicitar un nombre de usuario. Podemos utilizar `useFormStatus` para mostrar un mensaje de estado temporal que confirme el nombre de usuario que han solicitado.

<Sandpack>

```js UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  const [showSubmitted, setShowSubmitted] = useState(false);
  const submittedUsername = useRef(null);
  const timeoutId = useRef(null);

  useMemo(() => {
    if (pending) {
      submittedUsername.current = data?.get('username');
      if (timeoutId.current != null) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        timeoutId.current = null;
        setShowSubmitted(false);
      }, 2000);
      setShowSubmitted(true);
    }
  }, [pending, data]);

  return (
    <>
      <label>Request a Username: </label><br />
      <input type="text" name="username" />
      <button type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Submit'}
      </button>
      {showSubmitted ? (
        <p>Submitted request for username: {submittedUsername.current}</p>
      ) : null}
    </>
  );
}
```

```js App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";

export default function App() {
  return (
    <form action={submitForm}>
      <UsernameForm />
    </form>
  );
}
```

```js actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>  

---

## Solución de problemas {/*troubleshooting*/}

### `status.pending` nunca es `true` {/*pending-is-never-true*/}

`useFormStatus` solo proporcionará información de estado para un `<form>` padre.

Si el componente que llama a `useFormStatus` no está anidado dentro de un `<form>`, `status.pending` siempre devolverá `false`. Asegúrese de llamar a `useFormStatus` desde un componente que sea hijo de un elemento `<form>`.

`useFormStatus` no hará un seguimiento del estado de un `<form>` renderizado en el mismo componente. Consulte [Pitfall](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) para obtener más detalles.