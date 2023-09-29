---
title: El estado como una instantánea
---

<Intro>

Las variables de estado pueden parecerse a las variables normales de JavaScript en las que se puede leer y escribir. Sin embargo, el estado se comporta más como una instantánea. Al asignarlo no se cambia la variable de estado que ya tienes, sino que se desencadena una rerenderizado.

</Intro>

<YouWillLearn>

* Cómo la asignación del estado desencadena los rerenderizados.
* Cuándo y cómo se actualiza el estado.
* Por qué el estado no se actualiza inmediatamente después de asignarlo.
* Cómo los controladores de eventos acceden a una "instantánea" del estado.

</YouWillLearn>

## La asignación de estado desencadena renderizados {/*setting-state-triggers-renders*/}

Puedes hacerte la idea de tu interfaz de usuario como una que cambia directamente al evento del usuario como un clic. En React, funciona un poco diferente de este modelo mental. En la página anterior, viste que [al asignar estado se solicita un rerenderizado](/learn/render-and-commit#step-1-trigger-a-render) de React. Esto significa que para que una interfaz reaccione al evento, es necesario *actualizar el estado*.

En este ejemplo, al pulsar "Enviar", `setIsSent(true)` indica a React que vuelva a renderizar la UI:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('¡Hola!');
  if (isSent) {
    return <h1>¡Tu mensaje está en camino!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Mensaje"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
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

1. Se ejecuta el controlador de evento `onSubmit`.
2. `setIsSent(true)` asigna `isSent` a `true` y pone en cola un nuevo renderizado.
3. React vuelve a renderizar el componente según el nuevo valor de `isSent`.

Veamos con más detalle la relación entre estado y renderizado.

## El renderizado toma una instantánea en el tiempo {/*rendering-takes-a-snapshot-in-time*/}

["Renderizado"](/learn/render-and-commit#step-2-react-renders-your-components) significa que React está llamando a tu componente, que es una función. El JSX que devuelves de esa función es como una instantánea de la UI en el tiempo. Tus props, controladores de eventos y variables locales fueron todos calculados **usando su estado en el momento del renderizado.**

A diferencia de una fotografía o un fotograma de una película, la "instantánea" de la interfaz de usuario que devuelves es interactiva. Incluye lógica como controladores de eventos que especifican lo que sucede en respuesta a las entradas. React entonces actualiza la pantalla para que coincida con esta instantánea y conecta los controladores de eventos. Como resultado, al pulsar un botón se activará el controlador de clic de tu JSX.

Cuando React vuelve a renderizar un componente:

1. React vuelve a llamar a tu función.
2. Tu función devuelve una nueva instantánea JSX.
3. React entonces actualiza la pantalla para que coincida con la instantánea devuelta por tu función.

<IllustrationBlock sequential>
    <Illustration caption="React ejecuta la función" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calcula la instantánea" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Actualiza el árbol del DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Como memoria de un componente, el estado no es como una variable regular que desaparece después de que tu función devuelva un valor. El estado en realidad "vive" en el propio React -como si estuviera en una estantería- fuera de tu función. Cuando React llama a tu componente, te da una instantánea del estado para ese renderizado en particular. Tu componente devuelve una instantánea de la interfaz de usuario con un nuevo conjunto de accesorios y controladores de eventos en su JSX, todo calculado **usando los valores de estado de ese renderizado**.

<IllustrationBlock sequential>
  <Illustration caption="Le dices a React que actualice el estado" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React actualiza el valor del estado" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React pasa una instantánea del valor del estado al componente" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

He aquí un pequeño experimento para mostrarte cómo funciona esto. En este ejemplo, se podría esperar que al hacer clic en el botón "+3" se incrementara el contador tres veces porque se llama a `setNumber(number + 1)` tres veces.

Mira lo que ocurre cuando haces clic en el botón "+3":

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

**La asignación del estado sólo lo cambia para el *siguiente* renderizado.** Durante el primer renderizado, `number` era `0`. Es por eso que en el controlador `onClick` de *ese renderizado* el valor de `number` sigue siendo `0`, incluso después de que se llamara `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Esto es lo que el controlador de clic de este botón le dice a React que haga:

1. `setNumber(number + 1)`: `number` es `0` así que `setNumber(0 + 1)`.
    - React se prepara para el cambiar `number` a `1` en el siguiente renderizado.
2. `setNumber(number + 1)`: `number` es `0` así que `setNumber(0 + 1)`.
    - React se prepara para el cambiar `number` a `1` en el siguiente renderizado.
3. `setNumber(number + 1)`: `number` es `0` así que `setNumber(0 + 1)`.
    - React se prepara para el cambiar `number` a `1` en el siguiente renderizado.

Aunque hayas llamado a `setNumber(number + 1)` tres veces, en el controlador de evento de *ese renderizado* `number` es siempre `0`, por lo que asignas el estado a `1` tres veces. Por eso, una vez que el controlador de evento termina, React vuelve a renderizar el componente con `number` igual a `1` en lugar de `3`.

También puedes visualizarlo sustituyendo mentalmente las variables de estado por sus valores en tu código. Haciendo que la variable de estado `number` sea `0` para *ese renderizado*, tu controlador de evento se ve así:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Para el siguiente renderizado, `number` es `1`, así que en *ese renderizado* el controlador de clics luce así:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Por eso, al pulsar de nuevo el botón, el contador se pone en `2`, y luego a `3` en el siguiente clic, y así sucesivamente.

## El estado a través del tiempo {/*state-over-time*/}

Bueno, eso fue divertido. Intenta adivinar que mostrará la alerta al hacer clic en este botón:

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

Si utilizas el método de sustitución de antes, puedes adivinar que la alerta mostrará "0":

```js
setNumber(0 + 5);
alert(0);
```

¿Pero, qué pasa si pones un temporizador en la alerta, de modo que sólo se dispare _después_ de que el componente se vuelva a renderizar? ¿Diría "0" o "5"? Adivínalo.

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

¿Sorprendido? Si se utiliza el método de sustitución, se puede ver la "instantánea" del estado que se pasa a la alerta.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

El estado almacenado en React puede haber cambiado en el momento en que se ejecuta la alerta, pero se programó utilizando una instantánea del estado en el momento en que el usuario interactuó con ella.

**El valor de una variable de estado nunca cambia dentro de un renderizado,** incluso si el código de tu controlador de evento es asíncrono. Dentro del `onClick` de *ese renderizado*, el valor de `number` sigue siendo `0` incluso después de que se llama a `setNumber(number + 5)`. Su valor se "fijó" cuando React "tomó la instantánea" de la UI al llamar a tu componente.

Aquí hay un ejemplo de cómo eso hace que tus controladores de eventos sean menos propensos a errores de sincronización. A continuación se muestra un formulario que envía un mensaje con un retraso de cinco segundos. Imagina este escenario:

1. Pulsas el botón "Enviar", enviando "Hola" a Alice.
2. Antes de que termine la demora de cinco segundos, cambia el valor del campo "Para" a "Bob".

¿Qué esperas que muestre la alerta (`alert`)? ¿Mostrará "Has dicho Hola a Alice"? ¿O será "Has dicho Hola a Bob"? Haz una suposición con base en lo que sabes y luego pruébalo:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hola');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Has dicho ${message} a ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Para:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Mensaje"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React mantiene los valores de estado "fijados" dentro de los controladores de eventos de un renderizado.** No hay que preocuparse de si el estado ha cambiado mientras se ejecuta el código.

Pero, ¿y si quieres leer el último estado antes de un nuevo renderizado? Necesitarás usar una [función de actualización de estado](/learn/queueing-a-series-of-state-updates), ¡tratada en la siguiente página!

<Recap>

* Asignar un estado solicita un rerenderizado
* React almacena el estado fuera de tu componente, como si estuviera en una estantería.
* Cuando llamas a `useState`, React te da una instantánea del estado *para ese renderizado*.
* Las variables y los controladores de eventos no "sobreviven" a los rerenderizados. Cada renderizado tiene sus propios controladores de eventos.
* Cada renderizado (y las funciones dentro de él) siempre "verán" la instantánea del estado que React dio a *ese* renderizado.
* Puedes sustituir mentalmente el estado en los controladores de eventos, de forma similar a como piensas en el JSX renderizado.
* Los controladores de eventos creados en el pasado tienen los valores de estado del renderizado en el que fueron creados.

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
        Cambia a {walk ? 'Parar' : 'Caminar'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Caminar' : 'Parar'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Añade un `alert` al controlador de clics. Cuando la luz es verde y dice "Caminar", al hacer clic en el botón debe decir "Parar es lo siguiente". Cuando la luz es roja y dice "Parar", al hacer clic en el botón debe decir "Caminar es lo siguiente".

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
    alert(walk ? 'Parar es lo siguiente' : 'Caminar es lo siguiente');
  }

  return (
    <>
      <button onClick={handleClick}>
        Cambia a {walk ? 'Parar' : 'Caminar'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Caminar' : 'Parar'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Ya sea que lo pongas antes o después del `setWalk` no hace ninguna diferencia. El valor del renderizado de `walk` queda fijo. La llamada a `setWalk` sólo lo cambiará para el *siguiente* renderizado, pero no afectará al gestor de eventos del renderizado anterior.

Esta línea puede parecer paradójica en un inicio:

```js
alert(walk ? 'Parar es lo siguiente' : 'Caminar es lo siguiente');
```

Pero tiene sentido si lo lees como: "Si el semáforo muestra 'Caminar ahora', el mensaje debería decir 'Parar es lo siguiente'". La variable `walk` dentro de tu controlador de evento coincide con el valor de `walk` de ese renderizado y no cambia.

Puedes comprobar que es correcto aplicando el método de sustitución. Cuando `walk` es `true`, obtienes:

```js
<button onClick={() => {
  setWalk(false);
  alert('Parar es lo siguiente');
}}>
  Cambia a Parar
</button>
<h1 style={{color: 'darkgreen'}}>
  Caminar
</h1>
```

Así, al hacer clic en "Cambia a Parar" se pone en cola un renderizado con `walk` ajustado a `false`, y avisa de que "Parar es lo siguiente".

</Solution>

</Challenges>
