---
title: Poner en cola una Serie de Actualizaciones del Estado
---

<Intro>

Al establecer una variable de estado se pondrá en cola otro render. Pero a veces, es posible que quieras realizar varias operaciones antes de poner en cola la siguiente renderización. Para hacer esto, nos facilita entender cómo React pone en lotes las actualizaciones del estado.

</Intro>

<YouWillLearn>

* Qué es el "batching" y cómo lo utiliza React para procesar múltiples actualizaciones del estado
* Cómo aplicar varias actualizaciones a la misma variable del estado de forma consecutiva

</YouWillLearn>

## React batches state updates {/*react-batches-state-updates*/}

Podrías esperar que al hacer clic en el botón "+3" el contador se incremente tres veces porque llama a `setNumber(number + 1)` tres veces:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Sin embargo, como se puede recordar de la sección anterior, [los valores del estado de cada render son fijos](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), para que el valor de `number` dentro del manejador de eventos del primer render sea siempre `0`, sin importar cuántas veces se llame a `setNumber(1)`:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Pero hay otro factor a discutir aquí. **React espera hasta que *todo* el código de los manejadores de eventos se haya ejecutado antes de procesar sus actualizaciones del estado.** Por ello, el re-renderizado sólo se produce *después* de todas las llamadas `setNumber()`.

Esto puede recordarte a un camarero que toma nota de un pedido en un restaurante. El camarero no corre a la cocina al mencionar tu primer plato. En lugar de eso, te deja terminar tu pedido, te permite hacer cambios en él e incluso toma nota de los pedidos de las otras personas en la mesa.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Un elegante cursor en un restaurante hace un pedido varias veces con React, haciendo el papel de camarero. Después de que ella llame a setState() múltiples veces, el camarero anota lo último que ella pidió como su pedido final." />

Esto te permite actualizar múltiples variables del estado -incluso de múltiples componentes- sin realizar demasiados [re-renderizados.](/learn/render-and-commit#re-renders-when-state-updates) Pero esto también significa que la UI no se actualizará hasta _después_ de que tu controlador de eventos, y cualquier código en él, se complete. Este comportamiento, también conocido como **batching**, hace que tu aplicación de React se ejecute mucho más rápido. También evita tener que lidiar con confusos renderizados "a medio terminar" en los que sólo se han actualizado algunas de las variables.

**React no hace lotes a través de *múltiples* eventos intencionados como los clics**--cada clic se maneja por separado. Puedes estar seguro de que React sólo hará lotes cuando sea del todo posible hacerlo. Esto garantiza que, por ejemplo, si el primer clic del botón desactiva un formulario, el segundo clic no lo enviará de nuevo.

## Actualización de la misma variable de estado varias veces antes de la siguiente renderización {/*updating-the-same-state-variable-multiple-times-before-the-next-render*/}

Es un caso de uso poco común, pero si quieres actualizar la misma variable de estado varias veces antes de la siguiente renderización, en lugar de pasar el *siguiente valor de estado* como `setNumber(number + 1)`, puedes pasar una *función* que calcule el siguiente estado basado en el anterior en la cola, como `setNumber(n => n + 1)`. Es una forma de decirle a React que "haga algo con el valor del estado" en lugar de simplemente reemplazarlo.

Intenta incrementar el contador ahora:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Aquí, `n => n + 1` se la llama una **función de actualización.** Cuando la pasas a un seteador del estado:

1. React pone en cola esta función para que se procese después de que se haya ejecutado el resto del código del manejador de eventos.
2. Durante el siguiente renderizado, React recorre la cola y te da el estado final actualizado.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Así es como funciona React a través de estas líneas de código mientras se ejecuta el manejador de eventos:

1. `setNumber(n => n + 1)`: `n => n + 1` es una función. React la añade a la cola.
2. `setNumber(n => n + 1)`: `n => n + 1` es una función. React la añade a la cola.
3. `setNumber(n => n + 1)`: `n => n + 1` es una función. React la añade a la cola.

Cuando llamas a `useState` durante el siguiente renderizado, React recorre la cola. El estado anterior `number` era `0`, así que eso es lo que React pasa a la primera función actualizadora como el argumento `n`. Luego React toma el valor de retorno de su función actualizadora anterior y lo pasa al siguiente actualizador como `n`, y así sucesivamente:

|  queued update | `n` | returns |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React almacena `3` como resultado final y lo devuelve desde `useState`.

Por eso, al hacer clic en "+3" en el ejemplo anterior, el valor se incrementa correctamente en 3.
### Qué ocurre si se actualiza el estado después de sustituirlo {/*what-happens-if-you-update-state-after-replacing-it*/}

¿Qué pasa con este manejador de eventos? ¿Qué valor crees que tendrá `number` en la proxima renderización?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Esto es lo que este manejador de eventos le dice a React que haga:

1. `setNumber(number + 5)`: `number` es `0`, así que `setNumber(0 + 5)`. React añade *"reemplazar con `5`"* a su cola.
2. `setNumber(n => n + 1)`: `n => n + 1` es una función de actualización. React añade *esa función* a su cola.

Durante el siguiente renderizado, React recorre la cola de estados:

|   queued update       | `n` | returns |
|--------------|---------|-----|
| "replace with `5`" | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React almacena `6` como resultado final y lo devuelve desde `useState`. 

> Te habrás dado cuenta de que `setState(x)` en realidad funciona como `setState(n => x)`, ¡pero `n` no se utiliza!

### ¿Qué ocurre si se sustituye el estado después de actualizarlo? {/*what-happens-if-you-replace-state-after-updating-it*/}

Probemos un ejemplo más. ¿Qué valor crees que tendrá "number" en la próxima renderización?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Así es como funciona React a través de estas líneas de código mientras se ejecuta este manejador de eventos:

1. `setNumber(number + 5)`: `number` es `0`, así que `setNumber(0 + 5)`. React añade *"reemplazar con `5`"* a su cola.
2. `setNumber(n => n + 1)`: `n => n + 1` es una función de actualización. React añade *esa función* a su cola.
3. `setNumber(42)`: React añade *"reemplazar con `42`"* a su cola.

Durante el siguiente renderizado, React recorre la cola de estados:

|   queued update       | `n` | returns |
|--------------|---------|-----|
| "replace with `5`" | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "replace with `42`" | `6` (unused) | `42` |

Entonces React almacena `42` como resultado final y lo devuelve desde `useState`.

Para resumir, así es como puedes pensar en lo que estás pasando al seteador del estado `setNumber`:

* **Una función de actualización** (p.ej. `n => n + 1`) se añade a la cola.
* **Cualquier otro valor** (p.ej. number `5`) añade "reemplazar con `5`" a la cola, ignorando lo que ya está en cola.

Después de que el manejador de eventos se complete, React lanzará un re-renderizado. Durante el re-renderizado, React procesará la cola. Las funciones de actualización se ejecutan durante el renderizado, por lo que **las funciones de actualización deben ser [puras](/learn/keeping-components-pure)** y sólo *devuelven* el resultado. No intentes establecer el estado desde dentro de ellos o ejecutar otros efectos secundarios. En modo estricto, React ejecutará cada función de actualización dos veces (pero descartará el segundo resultado) para ayudarte a encontrar errores.

### Convenciones de nomenclatura {/*naming-conventions*/}

Es habitual nombrar el argumento de la función de actualización por las primeras letras de la variable de estado correspondiente:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Si prefieres un código más detallado, otra opción habitual es repetir el nombre completo de la variable del estado, como `setEnabled(enabled => !enabled)`, o utilizar un prefijo como `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Establecer el estado no cambia la variable en el renderizado existente, pero si solicita uno nuevo.
* React procesa las actualizaciones de estado después de que los manejadores de eventos hayan terminado de ejecutarse. Esto se llama "batching".
* Para actualizar algún estado varias veces en un evento, puedes utilizar la función de actualización `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### Fijar un contador de peticiones {/*fix-a-request-counter*/}

Estás trabajando en una aplicación de comercialización de arte que permite al usuario enviar varios pedidos de un artículo de arte al mismo tiempo. Cada vez que el usuario pulsa el botón "Comprar", el contador de "Pendientes" debería aumentar en uno. Después de tres segundos, el contador de "Pendientes" debería disminuir y el de "Completados" debería aumentar.

Sin embargo, el contador de "Pendientes" no se comporta como está previsto. Al pulsar "Comprar", disminuye a `-1` (¡lo que no debería ser posible!). Y si pulsa rápido dos veces, ambos contadores parecen comportarse de forma imprevisible.

¿Por qué ocurre esto? Arregla ambos contadores.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Dentro del manejador de eventos `handleClick`, los valores de `pending` y `completed` corresponden a lo que eran en el momento del evento de clic. Para el primer render, `pending` era `0`, por lo que `setPending(pending - 1)` se convierte en `setPending(-1)`, lo cual es incorrecto. Como quieres *incrementar* o *decrementar* los contadores, en lugar de establecerlos a un valor concreto determinado durante el clic, puedes pasar las funciones del actualizador:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Esto asegura que cuando se incrementa o decrementa un contador, se hace en relación a su *último* estado en lugar de cuál era el estado en el momento del clic.

</Solution>

#### Implement the state queue yourself {/*implement-the-state-queue-yourself*/}

En este reto, ¡reimplementarás una pequeña parte de React desde cero! No es tan difícil como parece.

Desplázate por la vista previa del sandbox. Observa que muestra **cuatro casos de prueba.** Corresponden a los ejemplos que has visto antes en esta página. Tu tarea es implementar la función `getFinalState` para que devuelva el resultado correcto para cada uno de esos casos. Si la implementas correctamente, las cuatro pruebas deberían pasar.

Recibirás dos argumentos: `baseState` es el estado inicial (como `0`), y la `queue` es un array que contiene una mezcla de números (como `5`) y funciones de actualización (como `n => n + 1`) en el orden en que fueron añadidas.

Tu tarea es devolver el estado final, tal y como muestran las tablas de esta página.

<Hint>

Si te sientes atascado, empieza con esta estructura de código:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

¡Rellena las líneas que faltan!

</Hint>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Este es el algoritmo exacto descrito en esta página que React utiliza para calcular el estado final:

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Ahora ya sabes cómo funciona esta parte de React.

</Solution>

</Challenges>