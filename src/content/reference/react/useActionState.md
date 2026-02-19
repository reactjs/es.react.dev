---
title: useActionState
---

<Intro>

`useActionState` es un Hook de React que te permite actualizar el estado basándote en el resultado de una acción de formulario.

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

En versiones anteriores de React Canary, esta API era parte de React DOM y se llamaba `useFormState`.

</Note>


<InlineToc />

---

## Referencia {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

Llama a `useActionState` en el nivel superior de tu componente para crear un estado del componente que se actualiza [cuando se invoca una acción de formulario](/reference/react-dom/components/form). Le pasas a `useActionState` una función de acción de formulario existente junto con un estado inicial, y te devuelve una nueva acción que puedes usar en tu formulario, junto con el estado más reciente del formulario y si la acción aún está pendiente. El estado más reciente del formulario también se pasa a la función que proporcionaste.

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

El estado del formulario es el valor que devuelve la acción la última vez que se envió el formulario. Si el formulario aún no se ha enviado, es el estado inicial que proporcionaste.

Si se usa con una Función de Servidor, `useActionState` permite mostrar la respuesta del servidor al enviar el formulario incluso antes de que la hidratación haya completado.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `fn`: La función que se llamará cuando se envíe el formulario o se presione el botón. Cuando se llama a la función, recibirá el estado previo del formulario (inicialmente el `initialState` que pasaste, y posteriormente su valor de retorno anterior) como primer argumento, seguido de los argumentos que una acción de formulario normalmente recibe.
* `initialState`: El valor que deseas que tenga el estado inicialmente. Puede ser cualquier valor serializable. Este argumento se ignora después de que la acción se invoque por primera vez.
* **opcional** `permalink`: Un string que contiene la URL única de la página que este formulario modifica. Para usar en páginas con contenido dinámico (por ejemplo: feeds) en conjunto con mejora progresiva: si `fn` es una [función de servidor](/reference/rsc/server-functions) y el formulario se envía antes de que el paquete de JavaScript se cargue, el navegador navegará a la URL de permalink especificada, en lugar de la URL de la página actual. Asegúrate de que el mismo componente de formulario se renderice en la página de destino (incluyendo la misma acción `fn` y `permalink`) para que React sepa cómo pasar el estado. Una vez que el formulario se haya hidratado, este parámetro no tiene efecto.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Devuelve {/*returns*/}

`useActionState` devuelve un _array_ con los siguientes valores:

1. El estado actual. Durante el primer renderizado, coincidirá con el `initialState` que hayas pasado. Después de que la acción se invoque, coincidirá con el valor que devolvió la acción.
2. Una nueva acción que puedes pasar como la prop `action` a tu componente `form` o como la prop `formAction` a cualquier componente `button` dentro del formulario. La acción también puede llamarse manualmente dentro de [`startTransition`](/reference/react/startTransition).
3. El flag `isPending` que te indica si hay una Transición pendiente.

#### Advertencias {/*caveats*/}

* Cuando se usa con un framework que soporta React Server Components, `useActionState` permite hacer los formularios interactivos antes de que JavaScript se haya ejecutado en el cliente. Cuando se usa sin Server Components, es equivalente al estado local del componente.
* La función pasada a `useActionState` recibe un argumento extra, el estado previo o inicial, como su primer argumento. Esto hace que su firma sea diferente a si se usara directamente como una acción de formulario sin usar `useActionState`.

---

## Uso {/*usage*/}

### Usar información devuelta por una acción de formulario {/*using-information-returned-by-a-form-action*/}

Llama a `useActionState` en el nivel superior de tu componente para acceder al valor de retorno de una acción desde la última vez que se envió el formulario.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState` devuelve un _array_ con los siguientes elementos:

1. El <CodeStep step={1}>estado actual</CodeStep> del formulario, que inicialmente se establece con el <CodeStep step={4}>estado inicial</CodeStep> que proporcionaste, y después de enviar el formulario se establece con el valor de retorno de la <CodeStep step={3}>acción</CodeStep> que proporcionaste.
2. Una <CodeStep step={2}>nueva acción</CodeStep> que pasas a `<form>` como su prop `action` o la llamas manualmente dentro de `startTransition`.
3. Un <CodeStep step={1}>estado pendiente</CodeStep> que puedes utilizar mientras tu acción se está procesando.

Cuando se envía el formulario, se llamará a la función de <CodeStep step={3}>acción</CodeStep> que proporcionaste. Su valor de retorno se convertirá en el nuevo <CodeStep step={1}>estado actual</CodeStep> del formulario.

La <CodeStep step={3}>acción</CodeStep> que proporcionaste también recibirá un nuevo primer argumento, el <CodeStep step={1}>estado actual</CodeStep> del formulario. La primera vez que se envía el formulario, este será el <CodeStep step={4}>estado inicial</CodeStep> que proporcionaste, mientras que en envíos posteriores, será el valor de retorno de la última vez que se llamó a la acción. El resto de los argumentos son los mismos que si no se hubiera usado `useActionState`.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Mostrar información después de enviar un formulario" titleId="display-information-after-submitting-a-form">

#### Mostrar errores de formulario {/*display-form-errors*/}

Para mostrar mensajes como un mensaje de error o un toast devuelto por una Función de Servidor, envuelve la acción en una llamada a `useActionState`.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

#### Mostrar información estructurada después de enviar un formulario {/*display-structured-information-after-submitting-a-form*/}

El valor de retorno de una Función de Servidor puede ser cualquier valor serializable. Por ejemplo, podría ser un objeto que incluya un booleano indicando si la acción fue exitosa, un mensaje de error, o información actualizada.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

</Recipes>

## Solución de problemas {/*troubleshooting*/}

### Mi acción ya no puede leer los datos del formulario enviado {/*my-action-can-no-longer-read-the-submitted-form-data*/}

Cuando envuelves una acción con `useActionState`, recibe un argumento extra *como su primer argumento*. Los datos del formulario enviado son por lo tanto su *segundo* argumento en lugar de ser el primero como sería normalmente. El nuevo primer argumento que se agrega es el estado actual del formulario.

```js
function action(currentState, formData) {
  // ...
}
```
