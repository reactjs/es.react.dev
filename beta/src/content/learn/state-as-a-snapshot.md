---
title: El estado como una instantánea
---

<Intro>

Las variables de estado pueden parecerse a las variables normales de JavaScript en las que se puede leer y escribir. Sin embargo, el estado se comporta más como una instantánea. Al asignarlo no se cambia la variable de estado que ya tienes, sino que se desencadena una re-renderización.

</Intro>

<YouWillLearn>

* Cómo la asignación del estado desencadena las re-renderizaciones.
* Cuándo y cómo se actualiza el estado.
* Por qué el estado no se actualiza inmediatamente después de asignarlo.
* Cómo los controladores de eventos acceden a una "instantánea" del estado.

</YouWillLearn>

## Asignando disparadores de estado renderiza {/*setting-state-triggers-renders*/}

Podrías pensar que tu interfaz de usuario cambia directamente en respuesta al evento del usuario como un clic. En React, funciona un poco diferente de este modelo mental. En la página anterior, viste que [asignando un estado solicita una re-renderizacion](/learn/render-and-commit#step-1-trigger-a-render) de React. Esto significa que para que una interfaz reaccione al evento, es necesario *actualizar el estado*.

En este ejemplo, al pulsar "enviar", `setIsSent(true)` indica a React que vuelva a renderizar la UI:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Esto es lo que ocurre cuando se hace clic en el botón:

1. El `onSubmit` ejecuta el gestor de eventos.
2. `setIsSent(true)` asigna `isSent` a `true` y pone en cola una nueva renderización.
3. React vuelve a renderizar el componente según el nuevo valor de `isSent`.

Veamos con más detalle la relación entre el estado y la representación.

## La renderización toma una instantánea en el tiempo {/*rendering-takes-a-snapshot-in-time*/}

["Renderización"](/learn/render-and-commit#step-2-react-renders-your-components) significa que React está llamando a tu componente, que es una función. El JSX que devuelve de esa función es como una instantánea de la UI en el tiempo. Tus props, gestores de eventos y variables locales fueron todos calculados **usando su estado en el momento del renderizado.**

A diferencia de una fotografía o un fotograma de una película, la "instantánea" de la interfaz de usuario que devuelve es interactiva. Incluye lógica como gestores de eventos que especifican lo que sucede en respuesta a las entradas. React entonces actualiza la pantalla para que coincida con esta instantánea y conecta los gestores de eventos. Como resultado, al pulsar un botón se activará el controlador de clic de tu JSX.

Cuando React vuelve a renderizar un componente:

1. React llama de nuevo a tu función.
2. Tu función devuelve una nueva instantánea JSX.
3. A continuación, React actualiza la pantalla para que coincida con la instantánea que ha devuelto.

<IllustrationBlock title="Re-rendering" sequential>
    <Illustration caption="React executing the function" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calculating the snapshot" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Updating the DOM tree" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Como memoria de un componente, el estado no es como una variable regular que desaparece después de que tu función regrese. El estado en realidad "vive" en el propio React -como si estuviera en una estantería- fuera de tu función. Cuando React llama a tu componente, te da una instantánea del estado para ese renderizado en particular. Tu componente devuelve una instantánea de la interfaz de usuario con un nuevo conjunto de accesorios y gestores de eventos en su JSX, todo calculado **usando los valores de estado de ese renderizado**.

<IllustrationBlock sequential>
  <Illustration caption="You tell React to update the state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React updates the state value" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React passes a snapshot of the state value into the component" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

He aquí un pequeño experimento para mostrarte cómo funciona esto. En este ejemplo, se podría esperar que al hacer clic en el botón "+3" se incrementara el contador tres veces porque se llama a `setNumber(number + 1)` tres veces.

Mira lo que ocurre cuando hace clic en el botón "+3":

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

Observa que `number` sólo se incrementa una vez por clic.

**La asignacion del estado sólo lo cambia para el *siguiente* renderizado.** Durante el primer renderizado, `number` era `0`. Esto es por qué, en *ese renderizado* el gestor `onClick`, el valor de `number` sigue siendo `0` incluso después de que `setNumber(number + 1)` haya sido llamado:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Esto es lo que el gestor de clic de este botón le dice a React que haga:

1. `setNumber(number + 1)`: `number` es `0` así que `setNumber(0 + 1)`.
    - React se prepara para el cambiar `number` a `1` en el siguiente renderizado.
2. `setNumber(number + 1)`: `number` es `0` así que `setNumber(0 + 1)`.
    - React se prepara para el cambiar `number` a `1` en el siguiente renderizado.
3. `setNumber(number + 1)`: `number` es `0` así que `setNumber(0 + 1)`.
    - React se prepara para el cambiar `number` a `1` en el siguiente renderizado.

Aunque hayas llamado a `setNumber(number + 1)` tres veces, en *ese renderizado* el controlador de eventos `number` es siempre `0`, por lo que asignas el estado a `1` tres veces. Por eso, una vez que el gestor de eventos termina, React vuelve a renderizar el componente con `number` igual a `1` en lugar de `3`.

También puedes visualizarlo sustituyendo mentalmente las variables de estado por sus valores en tu código. Haciendo que la variable de estado `number` sea `0` para *ese renderizado*, su gestor de eventos se ve así:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Para el siguiente renderizado, `number` es `1`, así que en *ese renderizado* El gestor de clics tiene el siguiente aspecto:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Por eso, al pulsar de nuevo el botón, el contador se pone en `2`, y luego a `3` en el siguiente clic, y así sucesivamente.

## Estado en el tiempo {/*state-over-time*/}

Bueno, eso fue divertido. Intenta adivinar lo que al hacer clic en este botón te alertará:

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Si utiliza el método de sustitución de antes, puedes adivinar que la alerta mostrará "0":

```js
setNumber(0 + 5);
alert(0);
```

¿Pero qué pasa si pones un temporizador en la alerta, de modo que sólo se dispare _después_ de que el componente se vuelva a renderizar? ¿Diría "0" o "5"? Adivínalo.

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

¿Sorprendido? Si se utiliza el método de sustitución, se puede ver la "instantánea" del estado pasado a la alerta.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

El estado almacenado en React puede haber cambiado en el momento en que se ejecuta la alerta, pero se programó utilizando una instantánea del estado en el momento en que el usuario interactuó con ella.

**El valor de una variable de estado nunca cambia dentro de un renderizado,** incluso si el codigo de tu gestor de eventos sea asíncrono. Dentro de *ese renderizado* `onClick`, el valor de `number` sigue siendo `0` incluso después de `setNumber(number + 5)` fue llamado. Su valor se "asignó" cuando React "tomó la instantánea" de la UI al llamar a su componente.

Aquí hay un ejemplo de cómo eso hace que sus gestores de eventos sean menos propensos a errores de sincronización. A continuación se muestra un formulario que envía un mensaje con un retraso de cinco segundos. Imagina este escenario:

1. Pulsas el botón "Enviar", enviando "Hola" a Alice.
2. Antes de que termine la demora de cinco segundos, cambia el valor del campo "Para" a "Bob".

¿Qué esperas que muestre la `alert`? ¿Mostraría "Has dicho Hola a Alice"? ¿O mostraría "Has dicho Hola a Bob"? Haz una suposicion basada en lo que sabes y pruebalo:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React mantiene los valores de estado "asignados" dentro de los gestores de eventos de un renderizado.** No hay que preocuparse de si el estado ha cambiado mientras se ejecuta el código.

Pero, ¿y si quieres leer el último estado antes de una nueva renderización? querrás usar una [función de actualización de estado](/learn/queueing-a-series-of-state-updates), ¡en la siguiente página!

<Recap>

* Asignando un estado solicita una re-renderizacion
* React almacena el estado fuera de su componente, como si estuviera en una estantería.
* Cuando llamas `useState`, React te da una instantanea del estado *para esa renderizacion*.
* Las variables y los gestores de eventos no "sobreviven" a las re-renderizaciones. Cada renderizado tiene sus propios gestores de eventos.
* Cada renderizado (y las funciones dentro de él) siempre "verán" la instantánea del estado que React dio a *ese* renderizado.
* Puedes sustituir mentalmente el estado en los gestores de eventos, de forma similar a como piensas en el JSX renderizado.
* Los gestores de eventos creados en el pasado tienen los valores de estado del renderizado en el que fueron creados.

</Recap>



<Challenges>

#### Implementar un semáforo {/*implement-a-traffic-light*/}

Aquí hay un componente de luz de paso de peatones que cambia cuando se pulsa el botón:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Añade un `alert` al gestor de clics. Cuando la luz es verde y dice "Caminar", al hacer clic en el botón debe decir "Parar es lo siguiente". Cuando la luz es roja y dice "Parar", al hacer clic en el botón debe decir "Caminar es lo siguiente".

¿Hay alguna diferencia si se pone el `alert` antes o después de la llamada a `setWalk`?

<Solution>

Tu `alert` debería ser así:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Ya sea que lo pongas antes o después del `setWalk` no hace ninguna diferencia. El valor de ese renderizado de `walk` ya fué asignado. La llamada a `setWalk` sólo lo cambiará para el *siguiente* renderizado, pero no afectará al gestor de eventos del renderizado anterior.

Esta línea puede parecer contraintuitiva al principio:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

Pero tiene sentido si lo lees como: "Si el semáforo muestra 'Camine ahora', el mensaje debería decir 'Pare ahora'". La variable `walk` dentro de su controlador de eventos coincide con el valor de ese render de `walk` y no cambia.

Puede comprobar que es correcto aplicando el método de sustitución. Cuando `walk` es `true`, obtienes:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

Así, al hacer clic en "Cambiar a parar" se pone en cola un renderizado con `walk` ajustado a `false`, y avisa de que "La parada es lo siguiente".

</Solution>

</Challenges>
