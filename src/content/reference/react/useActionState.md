---
title: useActionState
---

<Intro>

<<<<<<< HEAD
`useActionState` es un Hook de React que te permite actualizar el estado basándote en el resultado de una acción de formulario.
=======
`useActionState` is a React Hook that lets you update state with side effects using [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

```js
const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState, permalink?);
```

</Intro>

<<<<<<< HEAD
<Note>

En versiones anteriores de React Canary, esta API era parte de React DOM y se llamaba `useFormState`.

</Note>


=======
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec
<InlineToc />

---

## Referencia {/*reference*/}

### `useActionState(reducerAction, initialState, permalink?)` {/*useactionstate*/}

<<<<<<< HEAD
{/* TODO T164397693: link to actions documentation once it exists */}

Llama a `useActionState` en el nivel superior de tu componente para crear un estado del componente que se actualiza [cuando se invoca una acción de formulario](/reference/react-dom/components/form). Le pasas a `useActionState` una función de acción de formulario existente junto con un estado inicial, y te devuelve una nueva acción que puedes usar en tu formulario, junto con el estado más reciente del formulario y si la acción aún está pendiente. El estado más reciente del formulario también se pasa a la función que proporcionaste.
=======
Call `useActionState` at the top level of your component to create state for the result of an Action.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

```js
import { useActionState } from 'react';

function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

<<<<<<< HEAD
El estado del formulario es el valor que devuelve la acción la última vez que se envió el formulario. Si el formulario aún no se ha enviado, es el estado inicial que proporcionaste.

Si se usa con una Función de Servidor, `useActionState` permite mostrar la respuesta del servidor al enviar el formulario incluso antes de que la hidratación haya completado.

[Ver más ejemplos abajo.](#usage)
=======
[See more examples below.](#usage)
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

#### Parámetros {/*parameters*/}

<<<<<<< HEAD
* `fn`: La función que se llamará cuando se envíe el formulario o se presione el botón. Cuando se llama a la función, recibirá el estado previo del formulario (inicialmente el `initialState` que pasaste, y posteriormente su valor de retorno anterior) como primer argumento, seguido de los argumentos que una acción de formulario normalmente recibe.
* `initialState`: El valor que deseas que tenga el estado inicialmente. Puede ser cualquier valor serializable. Este argumento se ignora después de que la acción se invoque por primera vez.
* **opcional** `permalink`: Un string que contiene la URL única de la página que este formulario modifica. Para usar en páginas con contenido dinámico (por ejemplo: feeds) en conjunto con mejora progresiva: si `fn` es una [función de servidor](/reference/rsc/server-functions) y el formulario se envía antes de que el paquete de JavaScript se cargue, el navegador navegará a la URL de permalink especificada, en lugar de la URL de la página actual. Asegúrate de que el mismo componente de formulario se renderice en la página de destino (incluyendo la misma acción `fn` y `permalink`) para que React sepa cómo pasar el estado. Una vez que el formulario se haya hidratado, este parámetro no tiene efecto.

{/* TODO T164397693: link to serializable values docs once it exists */}
=======
* `reducerAction`: The function to be called when the Action is triggered. When called, it receives the previous state (initially the `initialState` you provided, then its previous return value) as its first argument, followed by the `actionPayload` passed to `dispatchAction`.
* `initialState`: The value you want the state to be initially. React ignores this argument after `dispatchAction` is invoked for the first time.
* **optional** `permalink`: A string containing the unique page URL that this form modifies.
  * For use on pages with [React Server Components](/reference/rsc/server-components) with progressive enhancement.
  * If `reducerAction` is a [Server Function](/reference/rsc/server-functions) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL rather than the current page's URL.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

#### Devuelve {/*returns*/}

<<<<<<< HEAD
`useActionState` devuelve un _array_ con los siguientes valores:

1. El estado actual. Durante el primer renderizado, coincidirá con el `initialState` que hayas pasado. Después de que la acción se invoque, coincidirá con el valor que devolvió la acción.
2. Una nueva acción que puedes pasar como la prop `action` a tu componente `form` o como la prop `formAction` a cualquier componente `button` dentro del formulario. La acción también puede llamarse manualmente dentro de [`startTransition`](/reference/react/startTransition).
3. El flag `isPending` que te indica si hay una Transición pendiente.
=======
`useActionState` returns an array with exactly three values:

1. The current state. During the first render, it will match the `initialState` you passed. After `dispatchAction` is invoked, it will match the value returned by the `reducerAction`.
2. A `dispatchAction` function that you call inside [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
3. The `isPending` flag that tells you if any dispatched Actions for this Hook are pending.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

#### Advertencias {/*caveats*/}

<<<<<<< HEAD
* Cuando se usa con un framework que soporta React Server Components, `useActionState` permite hacer los formularios interactivos antes de que JavaScript se haya ejecutado en el cliente. Cuando se usa sin Server Components, es equivalente al estado local del componente.
* La función pasada a `useActionState` recibe un argumento extra, el estado previo o inicial, como su primer argumento. Esto hace que su firma sea diferente a si se usara directamente como una acción de formulario sin usar `useActionState`.
=======
* `useActionState` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* React queues and executes multiple calls to `dispatchAction` sequentially. Each call to `reducerAction` receives the result of the previous call.
* The `dispatchAction` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* When using the `permalink` option, ensure the same form component is rendered on the destination page (including the same `reducerAction` and `permalink`) so React knows how to pass the state through. Once the page becomes interactive, this parameter has no effect.
* When using Server Functions, `initialState` needs to be [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values) (values like plain objects, arrays, strings, and numbers).
* If `dispatchAction` throws an error, React cancels all queued actions and shows the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary).
* If there are multiple ongoing Actions, React batches them together. This is a limitation that may be removed in a future release.

<Note>

`dispatchAction` must be called from an Action.

You can wrap it in [`startTransition`](/reference/react/startTransition), or pass it to an [Action prop](/reference/react/useTransition#exposing-action-props-from-components). Calls outside that scope won’t be treated as part of the Transition and [log an error](#async-function-outside-transition) on development mode.

</Note>

---

### `reducerAction` function {/*reduceraction*/}

The `reducerAction` function passed to `useActionState` receives the previous state and returns a new state.

Unlike reducers in `useReducer`, the `reducerAction` can be async and perform side effects:

```js
async function reducerAction(previousState, actionPayload) {
  const newState = await post(actionPayload);
  return newState;
}
```

Each time you call `dispatchAction`, React calls the `reducerAction` with the `actionPayload`. The reducer will perform side effects such as posting data, and return the new state. If `dispatchAction` is called multiple times, React queues and executes them in order so the result of the previous call is passed as `previousState` for the current call.

#### Parameters {/*reduceraction-parameters*/}

* `previousState`: The last state. Initially this is equal to the `initialState`. After the first call to `dispatchAction`, it's equal to the last state returned.

* **optional** `actionPayload`: The argument passed to `dispatchAction`. It can be a value of any type. Similar to `useReducer` conventions, it is usually an object with a `type` property identifying it and, optionally, other properties with additional information.

#### Returns {/*reduceraction-returns*/}

`reducerAction` returns the new state, and triggers a Transition to re-render with that state.

#### Caveats {/*reduceraction-caveats*/}

* `reducerAction` can be sync or async. It can perform sync actions like showing a notification, or async actions like posting updates to a server.
* `reducerAction` is not invoked twice in `<StrictMode>` since `reducerAction` is designed to allow side effects.
* The return type of `reducerAction` must match the type of `initialState`. If TypeScript infers a mismatch, you may need to explicitly annotate your state type.
* If you set state after `await` in the `reducerAction` you currently need to wrap the state update in an additional `startTransition`. See the [startTransition](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) docs for more info.
* When using Server Functions, `actionPayload` needs to be [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values) (values like plain objects, arrays, strings, and numbers).

<DeepDive>

#### Why is it called `reducerAction`? {/*why-is-it-called-reduceraction*/}

The function passed to `useActionState` is called a *reducer action* because:

- It *reduces* the previous state into a new state, like `useReducer`.
- It's an *Action* because it's called inside a Transition and can perform side effects.

Conceptually, `useActionState` is like `useReducer`, but you can do side effects in the reducer.

</DeepDive>
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

---

## Uso {/*usage*/}

<<<<<<< HEAD
### Usar información devuelta por una acción de formulario {/*using-information-returned-by-a-form-action*/}

Llama a `useActionState` en el nivel superior de tu componente para acceder al valor de retorno de una acción desde la última vez que se envió el formulario.
=======
### Adding state to an Action {/*adding-state-to-an-action*/}

Call `useActionState` at the top level of your component to create state for the result of an Action.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

```js [[1, 7, "count"], [2, 7, "dispatchAction"], [3, 7, "isPending"]]
import { useActionState } from 'react';

async function addToCartAction(prevCount) {
  // ...
}
function Counter() {
  const [count, dispatchAction, isPending] = useActionState(addToCartAction, 0);

  // ...
}
```

<<<<<<< HEAD
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
=======
`useActionState` returns an array with exactly three items:

1. The <CodeStep step={1}>current state</CodeStep>, initially set to the initial state you provided.
2. The <CodeStep step={2}>action dispatcher</CodeStep> that lets you trigger `reducerAction`.
3. A <CodeStep step={3}>pending state</CodeStep> that tells you whether the Action is in progress.

To call `addToCartAction`, call the <CodeStep step={2}>action dispatcher</CodeStep>. React will queue calls to `addToCartAction` with the previous count.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(async (prevCount) => {
    return await addToCart(prevCount)
  }, 0);

  function handleClick() {
    startTransition(() => {
      dispatchAction();
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>Qty: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>Add Ticket{isPending ? ' 🌀' : '  '}</button>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row button {
  margin-left: auto;
  min-width: 150px;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
```

</Sandpack>

Every time you click "Add Ticket," React queues a call to `addToCartAction`. React shows the pending state until all the tickets are added, and then re-renders with the final state.

<<<<<<< HEAD
#### Mostrar información estructurada después de enviar un formulario {/*display-structured-information-after-submitting-a-form*/}

El valor de retorno de una Función de Servidor puede ser cualquier valor serializable. Por ejemplo, podría ser un objeto que incluya un booleano indicando si la acción fue exitosa, un mensaje de error, o información actualizada.
=======
<DeepDive>

#### How `useActionState` queuing works {/*how-useactionstate-queuing-works*/}

Try clicking "Add Ticket" multiple times. Every time you click, a new `addToCartAction` is queued. Since there's an artificial 1 second delay, that means 4 clicks will take ~4 seconds to complete.

**This is intentional in the design of `useActionState`.**

We have to wait for the previous result of `addToCartAction` in order to pass the `prevCount` to the next call to `addToCartAction`. That means React has to wait for the previous Action to finish before calling the next Action.

You can typically solve this by [using with useOptimistic](/reference/react/useActionState#using-with-useoptimistic) but for more complex cases you may want to consider [cancelling queued actions](#cancelling-queued-actions) or not using `useActionState`.

</DeepDive>

---

### Using multiple Action types {/*using-multiple-action-types*/}

To handle multiple types, you can pass an argument to `dispatchAction`.

By convention, it is common to write it as a switch statement. For each case in the switch, calculate and return some next state. The argument can have any shape, but it is common to pass objects with a `type` property identifying the action.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function handleAdd() {
    startTransition(() => {
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="qty">{isPending ? '🌀' : count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

When you click to increase or decrease the quantity, an `"ADD"` or `"REMOVE"` is dispatched. In the `reducerAction`, different APIs are called to update the quantity.

In this example, we use the pending state of the Actions to replace both the quantity and the total. If you want to provide immediate feedback, such as immediately updating the quantity, you can use `useOptimistic`.

<DeepDive>

#### How is `useActionState` different from `useReducer`? {/*useactionstate-vs-usereducer*/}

You might notice this example looks a lot like `useReducer`, but they serve different purposes:

- **Use `useReducer`** to manage state of your UI. The reducer must be pure.

- **Use `useActionState`** to manage state of your Actions. The reducer can perform side effects.

You can think of `useActionState` as `useReducer` for side effects from user Actions. Since it computes the next Action to take based on the previous Action, it has to [order the calls sequentially](/reference/react/useActionState#how-useactionstate-queuing-works). If you want to perform Actions in parallel, use `useState` and `useTransition` directly.

</DeepDive>

---

### Using with `useOptimistic` {/*using-with-useoptimistic*/}

You can combine `useActionState` with [`useOptimistic`](/reference/react/useOptimistic) to show immediate UI feedback:


<Sandpack>

```js src/App.js
import { useActionState, startTransition, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  function handleAdd() {
    startTransition(() => {
      setOptimisticCount(c => c + 1);
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      setOptimisticCount(c => c - 1);
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>


`setOptimisticCount` immediately updates the quantity, and `dispatchAction()` queues the `updateCartAction`. A pending indicator appears on both the quantity and total to give the user feedback that their update is still being applied.

---


### Using with Action props {/*using-with-action-props*/}

When you pass the `dispatchAction` function to a component that exposes an [Action prop](/reference/react/useTransition#exposing-action-props-from-components), you don't need to call `startTransition` or `useOptimistic` yourself.

This example shows using the `increaseAction` and `decreaseAction` props of a QuantityStepper component:

<Sandpack>

```js src/App.js
import { useActionState } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function addAction() {
    dispatchAction({type: 'ADD'});
  }

  function removeAction() {
    dispatchAction({type: 'REMOVE'});
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Since `<QuantityStepper>` has built-in support for transitions, pending state, and optimistically updating the count, you just need to tell the Action _what_ to change, and _how_ to change it is handled for you.

---

### Cancelling queued Actions {/*cancelling-queued-actions*/}

You can use an `AbortController` to cancel pending Actions:

<Sandpack>

```js src/App.js
import { useActionState, useRef } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const abortRef = useRef(null);
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  async function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'ADD', signal: abortRef.current.signal });
  }

  async function removeAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'REMOVE', signal: abortRef.current.signal });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      try {
        return await addToCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return prevCount + 1;
      }
    }
    case 'REMOVE': {
      try {
        return await removeFromCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return Math.max(0, prevCount - 1);
      }
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
          <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
class AbortError extends Error {
  name = 'AbortError';
  constructor(message = 'The operation was aborted') {
    super(message);
  }
}

function sleep(ms, signal) {
  if (!signal) return new Promise((resolve) => setTimeout(resolve, ms));
  if (signal.aborted) return Promise.reject(new AbortError());

  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(id);
      reject(new AbortError());
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}
export async function addToCart(count, opts) {
  await sleep(1000, opts?.signal);
  return count + 1;
}

export async function removeFromCart(count, opts) {
  await sleep(1000, opts?.signal);
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Try clicking increase or decrease multiple times, and notice that the total updates within 1 second no matter how many times you click. This works because it uses an `AbortController` to "complete" the previous Action so the next Action can proceed.

<Pitfall>

Aborting an Action isn't always safe.

For example, if the Action performs a mutation (like writing to a database), aborting the network request doesn't undo the server-side change. This is why `useActionState` doesn't abort by default. It's only safe when you know the side effect can be safely ignored or retried.

</Pitfall>

---

### Using with `<form>` Action props {/*use-with-a-form*/}

You can pass the `dispatchAction` function as the `action` prop to a `<form>`.

When used this way, React automatically wraps the submission in a Transition, so you don't need to call `startTransition` yourself. The `reducerAction` receives the previous state and the submitted `FormData`:

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function formAction(formData) {
    const type = formData.get('type');
    if (type === 'ADD') {
      setOptimisticCount(c => c + 1);
    } else {
      setOptimisticCount(c => Math.max(0, c - 1));
    }
    return dispatchAction(formData);
  }

  return (
    <form action={formAction} className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button type="submit" name="type" value="ADD">▲</button>
            <button type="submit" name="type" value="REMOVE">▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </form>
  );
}

async function updateCartAction(prevCount, formData) {
  const type = formData.get('type');
  switch (type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

In this example, when the user clicks the stepper arrows, the button submits the form and `useActionState` calls `updateCartAction` with the form data. The example uses `useOptimistic` to immediately show the new quantity while the server confirms the update.

<RSC>

When used with a [Server Function](/reference/rsc/server-functions), `useActionState` allows the server's response to be shown before hydration (when React attaches to server-rendered HTML) completes. You can also use the optional `permalink` parameter for progressive enhancement (allowing the form to work before JavaScript loads) on pages with dynamic content. This is typically handled by your framework for you.

</RSC>

See the [`<form>`](/reference/react-dom/components/form#handle-form-submission-with-a-server-function) docs for more information on using Actions with forms.

---

### Handling errors {/*handling-errors*/}

There are two ways to handle errors with `useActionState`.

For known errors, such as "quantity not available" validation errors from your backend, you can return it as part of your `reducerAction` state and display it in the UI.

For unknown errors, such as `undefined is not a function`, you can throw an error. React will cancel all queued Actions and shows the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) by rethrowing the error from the `useActionState` hook.

<Sandpack>

```js src/App.js
import {useActionState, startTransition} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {addToCart} from './api';
import Total from './Total';

function Checkout() {
  const [state, dispatchAction, isPending] = useActionState(
    async (prevState, quantity) => {
      const result = await addToCart(prevState.count, quantity);
      if (result.error) {
        // Return the error from the API as state
        return {...prevState, error: `Could not add quanitiy ${quantity}: ${result.error}`};
      }

      if (!isPending) {
        // Clear the error state for the first dispatch.
        return {count: result.count, error: null};
      }

      // Return the new count, and any errors that happened.
      return {count: result.count, error: prevState.error};


    },
    {
      count: 0,
      error: null,
    }
  );

  function handleAdd(quantity) {
    startTransition(() => {
      dispatchAction(quantity);
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>
          {isPending && '🌀 '}Qty: {state.count}
        </span>
      </div>
      <div className="buttons">
        <button onClick={() => handleAdd(1)}>Add 1</button>
        <button onClick={() => handleAdd(10)}>Add 10</button>
        <button onClick={() => handleAdd(NaN)}>Add NaN</button>
      </div>
      {state.error && <div className="error">{state.error}</div>}
      <hr />
      <Total quantity={state.count} isPending={isPending} />
    </div>
  );
}



export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={({resetErrorBoundary}) => (
        <div className="checkout">
          <h2>Something went wrong</h2>
          <p>The action could not be completed.</p>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}>
      <Checkout />
    </ErrorBoundary>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>
        {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
      </span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count, quantity) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (quantity > 5) {
    return {error: 'Quantity not available'};
  } else if (isNaN(quantity)) {
    throw new Error('Quantity must be a number');
  }
  return {count: count + quantity};
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.buttons {
  display: flex;
  gap: 8px;
}

.error {
  color: red;
  font-size: 14px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

In this example, "Add 10" simulates an API that returns a validation error, which `updateCartAction` stores in state and displays inline. "Add NaN" results in an invalid count, so `updateCartAction` throws, which propagates through `useActionState` to the `ErrorBoundary` and shows a reset UI.


---

## Solución de problemas {/*troubleshooting*/}

<<<<<<< HEAD
### Mi acción ya no puede leer los datos del formulario enviado {/*my-action-can-no-longer-read-the-submitted-form-data*/}

Cuando envuelves una acción con `useActionState`, recibe un argumento extra *como su primer argumento*. Los datos del formulario enviado son por lo tanto su *segundo* argumento en lugar de ser el primero como sería normalmente. El nuevo primer argumento que se agrega es el estado actual del formulario.
=======
### My `isPending` flag is not updating {/*ispending-not-updating*/}

If you're calling `dispatchAction` manually (not through an Action prop), make sure you wrap the call in [`startTransition`](/reference/react/startTransition):
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

When `dispatchAction` is passed to an Action prop, React automatically wraps it in a Transition.

---

### My Action cannot read form data {/*action-cannot-read-form-data*/}

When you use `useActionState`, the `reducerAction` receives an extra argument as its first argument: the previous or initial state. The submitted form data is therefore its second argument instead of its first.

```js {2,7}
// Without useActionState
function action(formData) {
  const name = formData.get('name');
}

// With useActionState
function action(prevState, formData) {
  const name = formData.get('name');
}
```

---

### My actions are being skipped {/*actions-skipped*/}

If you call `dispatchAction` multiple times and some of them don't run, it may be because an earlier `dispatchAction` call threw an error.

When a `reducerAction` throws, React skips all subsequently queued `dispatchAction` calls.

To handle this, catch errors within your `reducerAction` and return an error state instead of throwing:

```js
async function myReducerAction(prevState, data) {
  try {
    const result = await submitData(data);
    return { success: true, data: result };
  } catch (error) {
    // ✅ Return error state instead of throwing
    return { success: false, error: error.message };
  }
}
```

---

### My state doesn't reset {/*reset-state*/}

`useActionState` doesn't provide a built-in reset function. To reset the state, you can design your `reducerAction` to handle a reset signal:

```js
const initialState = { name: '', error: null };

async function formAction(prevState, payload) {
  // Handle reset
  if (payload === null) {
    return initialState;
  }
  // Normal action logic
  const result = await submitData(payload);
  return result;
}

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(formAction, initialState);

  function handleReset() {
    startTransition(() => {
      dispatchAction(null); // Pass null to trigger reset
    });
  }

  // ...
}
```

Alternatively, you can add a `key` prop to the component using `useActionState` to force it to remount with fresh state, or a `<form>` `action` prop, which resets automatically after submission.

---

### I'm getting an error: "An async function with useActionState was called outside of a transition." {/*async-function-outside-transition*/}

A common mistake is to forget to call `dispatchAction` from inside a Transition:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.

</ConsoleLogLine>
</ConsoleBlockMulti>


This error happens because `dispatchAction` must run inside a Transition:

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ❌ Wrong: calling dispatchAction outside a Transition
    dispatchAction();
  }

  // ...
}
```

To fix, either wrap the call in [`startTransition`](/reference/react/startTransition):

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

Or pass `dispatchAction` to an Action prop, is call in a Transition:

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  // ✅ Correct: action prop wraps in a Transition for you
  return <Button action={dispatchAction}>...</Button>;
}
```

---

### I'm getting an error: "Cannot update action state while rendering" {/*cannot-update-during-render*/}

You cannot call `dispatchAction` during render:

<ConsoleBlock level="error">

Cannot update action state while rendering.

</ConsoleBlock>

This causes an infinite loop because calling `dispatchAction` schedules a state update, which triggers a re-render, which calls `dispatchAction` again.

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  // ❌ Wrong: calling dispatchAction during render
  dispatchAction();

  // ...
}
```

To fix, only call `dispatchAction` in response to user events (like form submissions or button clicks).
