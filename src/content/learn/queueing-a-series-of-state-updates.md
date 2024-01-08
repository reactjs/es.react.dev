---
title: Poner en cola una serie de actualizaciones del estado
---

<Intro>

Al asignar una variable de estado se pondrá en cola otro renderizado. Pero a veces, es posible que quieras realizar varias operaciones antes de poner en cola el siguiente renderizado. Para hacer esto, nos ayuda entender cómo React realiza las actualizaciones de estado por lotes.

</Intro>

<YouWillLearn>

* Qué es "la actualización por lotes (_batching_)" y cómo lo utiliza React para procesar múltiples actualizaciones del estado
* Cómo aplicar varias actualizaciones a la misma variable de estado de forma consecutiva

</YouWillLearn>

## React actualiza el estado por lotes {/*react-batches-state-updates*/}

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

Sin embargo, como se puede recordar de la sección anterior, [los valores del estado de cada renderizado son fijos](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), por lo que el valor de `number` dentro del controlador de evento del primer renderizado siempre es `0`, sin importar cuántas veces se llame a `setNumber(1)`:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Pero hay otro factor a analizar aquí. **React espera a que *todo* el código de los controladores de eventos se haya ejecutado antes de procesar tus actualizaciones de estado.** Por ello, el rerenderizado sólo se produce *después* de todas las llamadas `setNumber()`.

Esto puede recordarte a un camarero que toma nota de un pedido en un restaurante. ¡El camarero no corre a la cocina al mencionar tu primer plato! En cambio, te deja terminar tu pedido, te permite hacerle cambios e incluso toma nota de los pedidos de las otras personas en la mesa.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Un elegante cursor en un restaurante hace un pedido varias veces con React, que interpreta el papel de camarero. Después de que ella llama a setState() múltiples veces, el camarero anota lo último que ella pidió como su pedido final." />

Esto te permite actualizar múltiples variables del estado -incluso de múltiples componentes- sin realizar demasiados [rerenderizados.](/learn/render-and-commit#re-renders-when-state-updates) Pero esto también significa que la UI no se actualizará hasta _después_ de que tu controlador de evento, y cualquier código en él, se complete. Este comportamiento, también conocido como **batching**, hace que tu aplicación de React se ejecute mucho más rápido. También evita tener que lidiar con confusos renderizados "a medio terminar" en los que sólo se han actualizado algunas de las variables.

**React no agrupa *múltiples* eventos intencionados como los clics** --cada clic se controla por separado. Puedes estar seguro de que React sólo actualizará por lotes cuando sea seguro hacerlo. Esto garantiza que, por ejemplo, si el primer clic del botón desactiva un formulario, el segundo clic no lo enviará de nuevo.

## Actualización de la misma variable de estado varias veces antes del siguiente renderizado {/*updating-the-same-state-variable-multiple-times-before-the-next-render*/}

Es un caso de uso poco común, pero si quieres actualizar la misma variable de estado varias veces antes del siguiente renderizado, en lugar de pasar el *siguiente valor de estado* como `setNumber(number + 1)`, puedes pasar una *función* que calcule el siguiente estado basado en el anterior en la cola, como `setNumber(n => n + 1)`. Es una forma de decirle a React que "haga algo con el valor del estado" en lugar de simplemente reemplazarlo.

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

Aquí, `n => n + 1` se la llama una **función de actualización.** Cuando la pasas a una asignación de estado:

1. React pone en cola esta función para que se procese después de que se haya ejecutado el resto del código del controlador de evento.
2. Durante el siguiente renderizado, React recorre la cola y te da el estado final actualizado.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Así es como funciona React a través de estas líneas de código mientras se ejecuta el controlador de evento:

1. `setNumber(n => n + 1)`: `n => n + 1` es una función. React la añade a la cola.
2. `setNumber(n => n + 1)`: `n => n + 1` es una función. React la añade a la cola.
3. `setNumber(n => n + 1)`: `n => n + 1` es una función. React la añade a la cola.

Cuando llamas a `useState` durante el siguiente renderizado, React recorre la cola. El estado anterior `number` era `0`, así que eso es lo que React pasa a la primera función actualizadora como el argumento `n`. Luego React toma el valor de devolución de tu función actualizadora anterior y lo pasa al siguiente actualizador como `n`, y así sucesivamente:

| Actualización en cola | `n` | Devuelve    |
|-----------------------|-----|-------------|
| `n => n + 1`          | `0` | `0 + 1 = 1` |
| `n => n + 1`          | `1` | `1 + 1 = 2` |
| `n => n + 1`          | `2` | `2 + 1 = 3` |

React almacena `3` como resultado final y lo devuelve desde `useState`.

Por eso, al hacer clic en "+3" en el ejemplo anterior, el valor se incrementa correctamente en 3.
### ¿Qué ocurre si se actualiza el estado después de sustituirlo? {/*what-happens-if-you-update-state-after-replacing-it*/}

¿Qué pasa con este controlador de evento? ¿Qué valor crees que tendrá `number` en el próximo renderizado?

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
      }}>Incrementa el número</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Esto es lo que este controlador de evento le dice a React que haga:

1. `setNumber(number + 5)`: `number` es `0`, así que `setNumber(0 + 5)`. React añade *"reemplazar con `5`"* a su cola.
2. `setNumber(n => n + 1)`: `n => n + 1` es una función de actualización. React añade *esa función* a su cola.

Durante el siguiente renderizado, React recorre la cola de estados:

| Actualización en cola | `n`            | Devuelve    |
|-----------------------|----------------|-------------|
| "reemplazar con `5`"  | `0` (sin usar) | `5`         |
| `n => n + 1`          | `5`            | `5 + 1 = 6` |

React almacena `6` como resultado final y lo devuelve desde `useState`. 

<Note>

> Te habrás dado cuenta de que `setState(x)` en realidad funciona como `setState(n => x)`, ¡pero `n` no se utiliza!

</Note>

### ¿Qué ocurre si se sustituye el estado después de actualizarlo? {/*what-happens-if-you-replace-state-after-updating-it*/}

Probemos un ejemplo más. ¿Qué valor crees que tendrá "number" en el próximo renderizado?

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
      }}>Incrementa el número</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Así es como funciona React a través de estas líneas de código mientras se ejecuta este controlador de evento:

1. `setNumber(number + 5)`: `number` es `0`, así que `setNumber(0 + 5)`. React añade *"reemplazar con `5`"* a su cola.
2. `setNumber(n => n + 1)`: `n => n + 1` es una función de actualización. React añade *esa función* a su cola.
3. `setNumber(42)`: React añade *"reemplazar con `42`"* a su cola.

Durante el siguiente renderizado, React recorre la cola de estados:

| Actualización en cola | `n`            | Devuelve    |
|-----------------------|----------------|-------------|
| "reemplazar con `5`"  | `0` (sin usar) | `5`         |
| `n => n + 1`          | `5`            | `5 + 1 = 6` |
| "reemplazar con `42`" | `6` (sin usar) | `42`        |

Entonces React almacena `42` como resultado final y lo devuelve desde `useState`.

Para resumir, así es como puedes pensar en lo que estás pasando a la función de asignación de estado `setNumber`:

* **Una función de actualización** (p. ej. `n => n + 1`) se añade a la cola.
* **Cualquier otro valor** (p. ej. pasarle un `5`) añade "reemplazar con `5`" a la cola, ignorando lo que ya está en cola.

Después de que el controlador de evento se complete, React lanzará un rerenderizado. Durante el rerenderizado, React procesará la cola. Las funciones de actualización se ejecutan durante el renderizado, por lo que **las funciones de actualización deben ser [puras](/learn/keeping-components-pure)** y sólo *devuelven* el resultado. No intentes establecer el estado desde dentro de ellas o ejecutar otros efectos secundarios. En modo estricto, React ejecutará cada función de actualización dos veces (pero descartará el segundo resultado) para ayudarte a encontrar errores.

### Convenciones de nomenclatura {/*naming-conventions*/}

Es habitual nombrar el argumento de la función de actualización por las primeras letras de la variable de estado correspondiente:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Si prefieres un código más detallado, otra opción habitual es repetir el nombre completo de la variable del estado, como `setEnabled(enabled => !enabled)`, o utilizar un prefijo como `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Establecer el estado no cambia la variable en el renderizado existente, pero si solicita un nuevo renderizado.
* React procesa las actualizaciones de estado después de que los controladores de eventos hayan terminado de ejecutarse. Esto se llama _batching_.
* Para actualizar algún estado varias veces en un evento, puedes utilizar la función de actualización `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### Fijar un contador de peticiones {/*fix-a-request-counter*/}

Estás trabajando en una aplicación de comercialización de arte que permite al usuario enviar varios pedidos de un artículo de arte al mismo tiempo. Cada vez que el usuario pulsa el botón "Buy", el contador de "Pending" debería aumentar en uno. Después de tres segundos, el contador de "Pending" debería disminuir y el de "Completed" debería aumentar.

Sin embargo, el contador de "Pending" no se comporta como está previsto. Al pulsar "Comprar", disminuye a `-1` (¡lo que no debería ser posible!). Y si pulsas rápido dos veces, ambos contadores parecen comportarse de forma imprevisible.

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
        Pendiente: {pending}
      </h3>
      <h3>
        Completado: {completed}
      </h3>
      <button onClick={handleClick}>
        Comprar     
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

Dentro del controlador de evento `handleClick`, los valores de `pending` y `completed` corresponden a lo que eran en el momento del evento de clic. Para el primer renderizado, `pending` era `0`, por lo que `setPending(pending - 1)` se convierte en `setPending(-1)`, lo cual es incorrecto. Como quieres *incrementar* o *disminuir* los contadores, en lugar de establecerlos a un valor concreto determinado durante el clic, puedes pasar las funciones de actualización:

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
        Pendiente: {pending}
      </h3>
      <h3>
        Completado: {completed}
      </h3>
      <button onClick={handleClick}>
        Comprar
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

Esto asegura que cuando se incrementa o disminuye un contador, se hace con relación a su *último* estado y no al valor del estado en el momento del clic.

</Solution>

#### Implementa la cola de estado tú mismo {/*implement-the-state-queue-yourself*/}

¡En este reto, reimplementarás una pequeña parte de React desde cero! No es tan difícil como parece.

Desplázate por la vista previa del _sandbox_. Observa que muestra **cuatro casos de prueba.** Se corresponden con los ejemplos que has visto antes en esta página. Tu tarea es implementar la función `getFinalState` para que devuelva el resultado correcto para cada uno de esos casos. Si la implementas correctamente, las cuatro pruebas deberían pasar.

Recibirás dos argumentos: `baseState` es el estado inicial (como `0`), y la `queue` es un array que contiene una mezcla de números (como `5`) y funciones de actualización (como `n => n + 1`) en el orden en que fueron añadidas.

Tu tarea es devolver el estado final, ¡tal y como muestran las tablas de esta página!

<Hint>

Si te sientes atascado, empieza con esta estructura de código:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: aplica la función de actualización
    } else {
      // TODO: reemplaza el estado
    }
  }

  return finalState;
}
```

¡Rellena las líneas que faltan!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: haz algo con la cola...

  return finalState;
}
```

```js src/App.js
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
      <p>Estado base: <b>{baseState}</b></p>
      <p>Cola: <b>[{queue.join(', ')}]</b></p>
      <p>Resultado esperado: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Tu resultado: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correcto' :
          'erróneo'
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

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Aplica la función de actualización.
      finalState = update(finalState);
    } else {
      // Reemplaza el siguiente estado.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
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
      <p>Estado base: <b>{baseState}</b></p>
      <p>Cola: <b>[{queue.join(', ')}]</b></p>
      <p>Resultado esperado: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Tu resultado: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correcto' :
          'erróneo'
        })
      </p>
    </>
  );
}
```

</Sandpack>

¡Ahora ya sabes cómo funciona esta parte de React!

</Solution>

</Challenges>

