---
title: 'Haciendo referencia a valores utilizando Refs'
---

<Intro>

Cuando quieres que un componente "recuerdo" alguna información, pero no quieres que esa información [active nuevos renderizados](/learn/render-and-commit), puedes usar una *ref*.

</Intro>

<YouWillLearn>

- Cómo añadir una ref a tu componente
- Cómo actualizar el valor de una ref
- En qué se diferencian las refs y el estado
- Cómo usar las refs de manera segura

</YouWillLearn>

## Agregando una ref a tu componente {/*adding-a-ref-to-your-component*/}

Puedes añadir una ref a tu componente importando el Hook `useRef` desde React:

```js
import { useRef } from 'react';
```

Dentro de tu componente, llama al Hook `useRef` y pasa el valor inicial al que quieres hacer referencia como único parámetro. Por ejemplo, este es una ref con el valor `0`:

```js
const ref = useRef(0);
```

`useRef` devuelve un objeto como este:

```js
{ 
  current: 0 // El valor que le pasaste al useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Una flecha con 'current' escrito en ella metida en un bolsillo con 'ref' escrito en el." />

Puedes acceder al valor actual de esa ref a través de la propiedad `ref.current`. Este valor es mutable intencionalmente, lo que significa que puedes tanto leer como escribir en él. Es como un bolsillo secreto de tu componente que React no puede rastrear. (Esto es lo que lo hace una "escotilla de escape" del flujo de datos de una vía de React—más sobre eso a continuación!)

Aquí, un botón incrementará `ref.current` en cada clic:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Has hecho clic ' + ref.current + ' veces!');
  }

  return (
    <button onClick={handleClick}>
      Clic aquí!
    </button>
  );
}
```

</Sandpack>

La ref apunta hacia un número, pero, como [el estado](/learn/state-a-components-memory), podrías apuntar a cualquier cosa: un string, un objeto, o incluso una función. A diferencia del estado, la ref es un objeto plano de JavaScript con la propiedad `current` que puedes leer y modificar.

Fíjate como **el componente no se re-renderiza con cada incremento.** Como el estado, las refs son retenidos por React entre cada re-renderizado. Sin embargo, asignar el estado re-renderiza un componente. Cambiar una ref no!

## Ejemplo: creando un cronómetro {/*example-building-a-stopwatch*/}

Puedes combinar las refs y el estado en un solo componente. Por ejemplo, hagamos un cronómetro que el usuario pueda iniciar y detener al presionar un botón. Para poder mostrar cuánto tiempo ha pasado desde que el usuario pulsó "Iniciar", necesitarás mantener rastreado cuándo el botón de Iniciar fue presionado y cuál es el tiempo actual. **Esta información es usada para la renderización, asi que la guardala en el estado:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Cuando el usuario presione "Iniciar", usarás [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) para poder actualizar el tiempo cada 10 milisegundos:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Empieza a contar.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Actualiza el tiempo actual cada 10 milisegundos.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Tiempo transcurrido: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Iniciar
      </button>
    </>
  );
}
```

</Sandpack>

Cuando el boton "Detener" es presionado, necesitas cancelar el intervalo existente para que deje de actualizar la variable `now` del estado. Puedes hacer esto llamando [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), pero necesitas pasarle el identificador del intervalo que fue previamente devuelto por la llamada del `setInterval` cuando el usuario presionó Iniciar. Necesitas guardar el identificador del intervalo en alguna parte. **Como el identificador de un intervalo no es usado para la renderización, puedes guardarlo en una ref:**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Tiempo transcurrido: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Iniciar
      </button>
      <button onClick={handleStop}>
        Detener
      </button>
    </>
  );
}
```

</Sandpack>

Cuando una pieza de información es usada para la renderización, guárdala en el estado. Cuando una pieza de información solo se necesita en los manejadores de eventos y no requiere un re-renderizado, usar una ref quizás sea más eficiente.

## Diferencias entre las refs y el estado {/*differences-between-refs-and-state*/}

Tal vez estés pensando que las refs parecen menos "estrictos" que el estado—puedes mutarlos en lugar de siempre tener que utilizar una función asignadora del estado, por ejemplo. Pero en la mayoría de los casos, querrás usar el estado. Las refs son una "escotilla de escape" que no necesitarás a menudo. Esta es la comparación entre el estado y las refs:

| las refs                                                                                  | el estado                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` devuelve `{ current: initialValue }`                            | `useState(initialValue)` devuelve el valor actual de una variable de estado y una función asignadora del estado ( `[value, setValue]`) |
| No desencadena un re-renderizado cuando lo cambias.   | Desencadena un re-renderizado cuando lo cambias.                                        |
| Mutable—puedes modificar y actualizar el valor de `current` fuera del proceso de renderización. | "Immutable"—necesitas usar la función asignadora del estado para modificar variables de estado para poner en cola un re-renderizado.               |
| No deberías leer (o escribir) el valor de `current` durante la renderización. | Puedes leer el estado en cualquier momento. Sin embargo, cada renderizado tiene su propia [instantánea](/learn/state-as-a-snapshot) del estado la cual no cambia.

Este es un botón contador que está implementado con el estado:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Has hecho {count} clics
    </button>
  );
}
```

</Sandpack>

Como el valor de `count` es mostrado, tiene sentido usar un valor del estado para eso. Cuando el valor del contador es asignado con `setCount()`, React re-renderiza el componente y la pantalla se actualiza para reflejar la nueva cuenta.

Si trataste de implementar esto con una ref, React nunca re-renderizaría el componente, así que nunca verías la cuenta cambiar! Observa como al hacer clic en este botón **no se actualiza su texto**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Esto no re-renderiza el componente!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      Has hecho {countRef.current} clics
    </button>
  );
}
```

</Sandpack>

Esta es la razón por la que leer `ref.current` durante el renderizado conduce a un cógigo poco fiable. Si necesitas eso, en su lugar usa el estado.

<DeepDive title="¿Cómo useRef funciona internamente?">

A pesar de que tanto `useState` como `useRef` son proporcionados por React, en principio `useRef` podría ser implementado _por encima de_ `useState`. Puedes imaginar que internamente en React, `useRef` es implementado de esta manera:

```js
// Internamente en React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Durante el primer renderizado, `useRef` devuelve `{ current: initialValue }`. Este objeto es almacenado por Reacto, asi que durante el siguiente renderizado el mismo objeto será devuelto. Fíjate como el asignador de estado no es usado en este ejemplo. Es innecesario porque `useRef` siempre necesita devolver el mismo objeto!

React proporciona una versión integrada de `useRef` porque es suficientemente común en la practica. Pero puedes pensar en ello como si fuera una variable de estado normal sin un asignador. Si estas familiarizado con la programación orientada a objetos, las refs puede que te recuerden a los campos de instancias—pero en lugar de `this.something` escribes `somethingRef.current`.

</DeepDive>

## Cuándo usar refs {/*when-to-use-refs*/}

Típicamente, usarás una ref cuando tu componente necesite "salir" de React y comunicarse con APIs externas—a menudo una API del navegador no impactará en la apariencia de un componentete. Estas son algunas de estas raras situaciones:

- Almacenar [identificadores de timeouts](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Almacenar y manipular [Elementos del DOM](https://developer.mozilla.org/docs/Web/API/Element), lo cual cubrimos en [la siguiente página](/learn/manipulating-the-dom-with-refs)
- Almacenar otros objetos que no son necesarios para calcular el JSX.

Si tu componente necesita almacenar algún valor, pero no impacta la lógica de la renderización, usa refs.

## Buenas prácticas para las refs {/*best-practices-for-refs*/}

Seguir estos principios hará que tus componentes sean más predecibles:

- **Trata a las refs como una escotilla de escape.** Las refs son útiles cuando trabajas con sistemas externos o APIs del navegador. Si mucha de la lógica de tu aplicación y el flujo de los datos dependen de las refs, puede que quieras reconsiderar su enfoque.
- **No leas o escribas `ref.current` durante la renderización.** Si se necesita alguna información durante la renderización, en su lugar usa [el estado](/learn/state-a-components-memory). Como React no sabe cuándo `ref.current` cambia, incluso leerlo mientras se renderiza hace que el comportamiento de tu componente sea difícil de predecir. (La única excepción a esto es codigo como `if (!ref.current) ref.current = new Thing()` el cual solo asigna la ref una vez durante el renderizado inicial).

Las limitaciones del estado en React no se aplican a las refs. Por ejemplo, el estado actúa como una [instantánea para cada renderizado](/learn/state-as-a-snapshot) y [no se actualíza de manera síncrona.](/learn/queueing-a-series-of-state-updates) Pero cuando mutas el valor actual de una ref, cambia inmediatamente:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Esto es porque **la propia ref es un objeto normal de JavaScript,** así que se comporta como uno.

Tampoco tienes que preocuparte por [evitar la mutación](/learn/updating-objects-in-state) cuando trabajas con una ref. Siempre y cuando el objeto que estás mutando no está siendo usado para la renderización, a React no le importa lo que hagas con la ref o con su contenido.

## Las Refs y el DOM {/*refs-and-the-dom*/}

Puedes apuntar una ref hacia cualquier valor. Sin embargo, el caso de uso más común para una ref es acceder a un elemento del DOM. Por ejemplo, esto es útil cuando quieres enfocar un input programáticamente. Cuando pasas una ref a un atributo `ref` en JSX, así `<div ref={myRef}>`, React colocará el elemento del DOM correspondiente en `myRef.current`. Puedes leer más sobre esto en [Manipulando el DOM con refs.](/learn/manipulating-the-dom-with-refs)

<Recap>

- Las refs son una escotilla de escape para quedarse con valores que no son usados para la renderización. No los necesitarás a menudo.
- Una ref es un objeto plano de JavaScript con una sola propiedad llamada `current`, la cual puedes leer o asignarle un valor.
- Puedes pedirle a React que te de una ref llamando al Hook `useRef`.
- Como el estado, las refs retienen información entre los re-renderizados de un componente.
- A diferencia del estado, asignar el valor de `current` de una ref no desencadena un re-renderizado.
- No leas o escribas `ref.current` durante la renderización. Esto hace que tu componente sea díficil de predecir.

</Recap>



<Challenges>

#### Arregla un input de chat roto {/*fix-a-broken-chat-input*/}

Escribe un mensaje y haz clic en "Enviar". Notarás que hay un retraso de tres segundos antes de que veas la alerta de "Enviado!". Durante este retraso, puedes ver un botón de "Deshacer". Haz clic en él. Este botón de "Deshacer" se supone que debe evitar que el mensaje de "Enviado!" aparezca. Hace esto llamando [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) para el identificador del timeout guardado durante `handleSend`. Sin embargo, incluso después de que "Deshacer" es clicado, el mensaje de "Enviado!" sigue apareciendo. Encuentra por qué no funciona, y arréglalo.

<Hint>

Variables comunes como `let timeoutID` no "sobreviven" entre los re-renderizados porque cada renderizado ejecuta tu componente (e inicializa sus variables) desde cero. ¿Deberías guardar el identificador del timeout en algún otro lugar?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Enviado!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Enviando...' : 'Enviar'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Deshacer
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Sea cuando sea que tu componente se re-renderice (tal y como cuando asignas un estado), todas las variables locales se inicializan desde cero. Esto es porque no puedes guardar el identificador del timeout en una variable local como `timeoutID` y luego esperar que otro manejador de eventos lo "vea" en el futuro. En cambio, almacénalo en una ref, el cual React preservará entre renderizados.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Enviado!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Enviando...' : 'Enviar'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Deshacer
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Arreglar un componente fallando al re-renderizar {/*fix-a-component-failing-to-re-render*/}

Este botón se supone que alterna entre mostrar "Encendido" y "Apagado". Sin embargo, siempre muestra "Apagado". ¿Qué está mal en este código? Arréglalo.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

En este ejemplo, el valor actual de una ref es usado para calcular la salida de la renderización: `{isOnRef.current ? 'Encendido' : 'Apagado'}`. Esta es una señal de que esta información no debería estar en una ref, y en su lugar debería estar colocada en el estado. Para arreglarlo, quita la ref y en su lugar usa el estado:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'Encendido' : 'Apagado'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Arregla el rebote {/*fix-debouncing*/}

En este ejemplo, todos los manejadores de clic están ["rebotados".](https://redd.one/blog/debounce-vs-throttle) Para ver que significa esto, presiona uno de los botones. Nota como el mensaje aparece un segundo después. Si presionas el botón mientras esperas el mensaje, el temporizador se reiniciará. Así que mantente cliqueando el mismo botón rápido muchas veces, el mensaje no aparecerá hasta un segundo *después* de que pares de hacer clic. El rebote te permite retrasar algunas acciones hasta que el usuario "pare de hacer cosas".

Este ejemplo funciona, pero no tan bien como se esperaba. Los botones no son independientes. Para ver el problema, haz clic en uno de los botones, y luego inmediatamente haz clic en otro botón. Esperarías que después de un retraso, verías el mensaje del botón. Pero solo el mensaje del último botón se muestra. El mensaje del primer botón se pierde.

¿Por qué los botones están interfiriendo con los demás? Encuentra y arregla el problema.

<Hint>

La última variable de timeout es compartida entre todos los componentes `DebouncedButton`. Por eso al hacer clic en un botón reinicia el timeout de otro botón. ¿Puedes almacenar un identificador de timeout separado para cada botón?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Cohete lanzado!')}
      >
        Lanza el cohete
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Sopa hervida!')}
      >
        Hierve la sopa
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Canción de cuna cantada!')}
      >
        Canta una canción de cuna
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Una variable como `timeoutID` es compartida entre todos los componentes. Esto es porque al hacer clic en el segundo botón reinicia el timeout pendiente del primer botón. Para solucionar esto, puedes guardar el timeout en una ref. Cada botón tendrá su propia ref, así no tendrán conflicto con los demás botones. Fíjate como al hacer clic a dos botones rápido se mostrarán ambos mensajes.

<Sandpack>

```js
import { useState, useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Cohete lanzado!')}
      >
        Lanza el cohete
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Sopa hervida!')}
      >
        Hierve la sopa
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Canción de cuna cantada!')}
      >
        Canta una canción de cuna
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Leer el último estado {/*read-the-latest-state*/}

En este ejemplo, después de que presionas "Enviar", hay un pequeño retraso antes de que el mensaje sea mostrado. Escribe "hola", presiona Enviar, y luego rápidamente edita el input otra véz. A pesar de tus cambios, la alerta seguiría mostrando "hola" (el cual fue el valor del estado [en el momento](/learn/state-as-a-snapshot#state-over-time) en que el botón fue presionado).

Usualmente, este comportamiento es lo que quieres en una aplicación. Sin embargo, hay algunos casos ocasionales donde quieres que algún código asíncrono lea la *última* versión de algún estado. ¿Puedes pensar en alguna manera de hacer que la alerta muestre el texto *actual* del input en lugar de el que estaba al momento del clic?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Enviando: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Enviar
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

El estado funciona [como una instantánea](/learn/state-as-a-snapshot), así que no puedes leer el último estado de una operación asíncrona como un timeout. Sin embargo, puedes guardar el último texto del input en una ref. Una ref es mutable, así que puedes leer la propiedad `current` en cualquier momento. Como el texto actual también es usado para la renderización, en este ejemplo, necesitaras *tanto* una variable de estado (para la renderización), *como* una ref (para leerlo en el timeout). Necesitarás actualizar el valor actual de la ref manualmente.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Enviando: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Enviar
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>