---
title: 'Referenciar valores con refs'
---

<Intro>

Cuando quieres que un componente "recuerde" alguna información, pero no quieres que esa información [provoque nuevos renderizados](/learn/render-and-commit), puedes usar una *ref*.

</Intro>

<YouWillLearn>

- Cómo añadir una ref a tu componente
- Cómo actualizar el valor de una ref
- En qué se diferencian las refs y el estado
- Cómo usar las refs de manera segura

</YouWillLearn>

## Añadir una ref a tu componente {/*adding-a-ref-to-your-component*/}

Puedes añadir una ref a tu componente importando el Hook `useRef` desde React:

```js
import { useRef } from 'react';
```

Dentro de tu componente, llama al Hook `useRef` y pasa el valor inicial al que quieres hacer referencia como único argumento. Por ejemplo, esta es una ref al valor `0`:

```js
const ref = useRef(0);
```

`useRef` devuelve un objeto como este:

```js
{ 
  current: 0 // El valor que le pasaste a useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Una flecha con que tiene escrito 'current' metida en un bolsillo que tiene escrito 'ref'." />

Puedes acceder al valor actual de esa ref a través de la propiedad `ref.current`. Este valor es mutable intencionalmente, lo que significa que puedes tanto leerlo como modificarlo. Es como un bolsillo secreto de tu componente que React no puede rastrear. (Esto es lo que lo hace una "puerta de escape" del flujo de datos de una vía de React: ¡Más sobre eso a continuación!)

Aquí, un botón incrementará `ref.current` en cada clic:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Hiciste clic ' + ref.current + ' veces!');
  }

  return (
    <button onClick={handleClick}>
      ¡Hazme clic!
    </button>
  );
}
```

</Sandpack>

La ref hace referencia a un número, pero, al igual que [el estado](/learn/state-a-components-memory), podrías hace referencia a cualquier cosa: un string, un objeto, o incluso una función. A diferencia del estado, la ref es un objeto plano de JavaScript con la propiedad `current` que puedes leer y modificar.

Fíjate como **el componente no se rerenderiza con cada incremento.** Al igual que con el estado, las refs son retenidas por React entre rerenderizados. Sin embargo, asignar el estado rerenderiza un componente. ¡Cambiar una ref no!

## Ejemplo: crear un cronómetro {/*example-building-a-stopwatch*/}

Puedes combinar las refs y el estado en un solo componente. Por ejemplo, hagamos un cronómetro que el usuario pueda iniciar y detener al presionar un botón. Para poder mostrar cuánto tiempo ha pasado desde que el usuario pulsó "Iniciar", necesitarás mantener rastreado cuándo el botón de Iniciar fue presionado y cuál es el tiempo actual. **Esta información se usa para el renderizado, así que guárdala en el estado:**

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

Cuando se presiona el botón "Detener", necesitas cancelar el intervalo existente para que deje de actualizar la variable de estado `now`. Puedes hacerlo con una llamada a [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), pero necesitas pasarle el identificador del intervalo que fue previamente devuelto por la llamada a `setInterval` cuando el usuario presionó Iniciar. Necesitas guardar el identificador del intervalo en alguna parte. **Como el identificador de un intervalo no se usa para el renderizado, puedes guardarlo en una ref:**

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

Cuando una pieza de información es usada para el renderizado, guárdala en el estado. Cuando una pieza de información solo se necesita en los controladores de eventos y no requiere un rerenderizado, usar una ref quizás sea más eficiente.

## Diferencias entre las refs y el estado {/*differences-between-refs-and-state*/}

Tal vez estés pensando que las refs parecen menos "estrictas" que el estado —puedes mutarlos en lugar de siempre tener que utilizar una función asignadora del estado, por ejemplo. Pero en la mayoría de los casos, querrás usar el estado. Las refs son una "puerta de escape" que no necesitarás a menudo. Esta es la comparación entre el estado y las refs:

| las refs                                                                                  | el estado                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` devuelve `{ current: initialValue }`                            | `useState(initialValue)` devuelve el valor actual de una variable de estado y una función asignadora del estado ( `[value, setValue]`) |
| No desencadena un rerenderizado cuando lo cambias.   | Desencadena un rerenderizado cuando lo cambias.                                        |
| Mutable: puedes modificar y actualizar el valor de `current` fuera del proceso de renderizado. | "Immutable": necesitas usar la función asignadora del estado para modificar variables de estado para poner en cola un rerenderizado.               |
| No deberías leer (o escribir) el valor de `current` durante el renderizado. | Puedes leer el estado en cualquier momento. Sin embargo, cada renderizado tiene su propia [instantánea](/learn/state-as-a-snapshot) del estado que no cambia.

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
      Hiciste clic {count} veces
    </button>
  );
}
```

</Sandpack>

Como el valor de `count` es mostrado, tiene sentido usar un valor del estado. Cuando se asigna el valor del contador con `setCount()`, React rerenderiza el componente y la pantalla se actualiza para reflejar el nuevo contador.

Si intentaras implementarlo con una ref, React nunca rerenderizaría el componente, ¡y nunca verías cambiar el contador! Observa como al hacer clic en este botón **no se actualiza su texto**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // ¡Esto no rerenderiza el componente!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      Hiciste clic {countRef.current} veces
    </button>
  );
}
```

</Sandpack>

Esta es la razón por la que leer `ref.current` durante el renderizado conduce a un código poco fiable. Si eso es lo que necesitas, usa en su lugar el estado.

<DeepDive>

#### ¿Cómo useRef funciona internamente? {/*how-does-use-ref-work-inside*/}

A pesar de que React proporciona tanto `useState` como `useRef`, en principio `useRef` se podría implementar _a partir de_ `useState`. Puedes imaginar que internamente en React, `useRef` se implementa de esta manera:

```js
// Internamente en React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Durante el primer renderizado, `useRef` devuelve `{ current: initialValue }`. React almacena este objeto, así que durante el siguiente renderizado se devolverá el mismo objeto. Fíjate como el asignador de estado no se usa en este ejemplo. ¡Es innecesario porque `useRef` siempre necesita devolver el mismo objeto!

React proporciona una versión integrada de `useRef` porque es suficientemente común en la practica. Pero puedes imaginártelo como si fuera una variable de estado normal sin un asignador. Si estas familiarizado con la programación orientada a objetos, las refs puede que te recuerden a los campos de instancias, pero en lugar de `this.something` escribes `somethingRef.current`.

</DeepDive>

## ¿Cuándo usar refs? {/*when-to-use-refs*/}

Típicamente, usarás una ref cuando tu componente necesite "salir" de React y comunicarse con APIs externas —a menudo una API del navegador no impactará en la apariencia de un componente. Estas son algunas de estas situaciones raras:

- Almacenar [identificadores de timeouts](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Almacenar y manipular [elementos del DOM](https://developer.mozilla.org/docs/Web/API/Element), que cubrimos en [la siguiente página](/learn/manipulating-the-dom-with-refs)
- Almacenar otros objetos que no son necesarios para calcular el JSX.

Si tu componente necesita almacenar algún valor, pero no impacta la lógica del renderizado, usa refs.

## Buenas prácticas para las refs {/*best-practices-for-refs*/}

Seguir estos principios hará que tus componentes sean más predecibles:

- **Trata a las refs como una puerta de escape.** Las refs son útiles cuando trabajas con sistemas externos o APIs del navegador. Si mucho de la lógica de tu aplicación y del flujo de los datos depende de las refs, es posible que quieras reconsiderar tu enfoque.
- **No leas o escribas `ref.current` durante el renderizado.** Si se necesita alguna información durante el renderizado, usa en su lugar [el estado](/learn/state-a-components-memory). Como React no sabe cuándo `ref.current` cambia, incluso leerlo mientras se renderiza hace que el comportamiento de tu componente sea difícil de predecir. (La única excepción a esto es código como `if (!ref.current) ref.current = new Thing()` que solo asigna la ref una vez durante el renderizado inicial).

Las limitaciones del estado en React no se aplican a las refs. Por ejemplo, el estado actúa como una [instantánea para cada renderizado](/learn/state-as-a-snapshot) y [no se actualiza de manera síncrona.](/learn/queueing-a-series-of-state-updates) Pero cuando mutas el valor actual de una ref, cambia inmediatamente:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Esto es porque **la propia ref es un objeto normal de JavaScript,** así que se comporta como uno.

Tampoco tienes que preocuparte por [evitar la mutación](/learn/updating-objects-in-state) cuando trabajas con una ref. Siempre y cuando el objeto que estás mutando no se esté usando para el renderizado, a React no le importa lo que hagas con la ref o con su contenido.

## Las refs y el DOM {/*refs-and-the-dom*/}

Puedes apuntar una ref a cualquier valor. Sin embargo, el uso más común para una ref es acceder a un elemento DOM. Por ejemplo, esto es útil si deseas enfocar un input programáticamente. Cuando pasas una ref a un atributo `ref` en JSX, como `<div ref={myRef}>`, React pondrá el elemento DOM correspondiente en `myRef.current`. Una vez que el elemento es eliminado del DOM, React actualizará `myRef.current` a `null`. Puedes leer más sobre esto en [Manipular el DOM con Refs.](/learn/manipulating-the-dom-with-refs)

<Recap>

- Las refs son una puerta de escape para guardar valores que no se usan en el renderizado. No las necesitarás a menudo.
- Una ref es un objeto plano de JavaScript con una sola propiedad llamada `current`, que puedes leer o asignarle un valor.
- Puedes pedirle a React que te dé una ref llamando al Hook `useRef`.
- Como el estado, las refs retienen información entre los rerenderizados de un componente.
- A diferencia del estado, asignar el valor de `current` de una ref no desencadena un rerenderizado.
- No leas o escribas `ref.current` durante el renderizado. Esto hace que tu componente sea difícil de predecir.

</Recap>



<Challenges>

#### Arregla un input de chat roto {/*fix-a-broken-chat-input*/}

Escribe un mensaje y haz clic en "Enviar". Notarás que hay un retraso de tres segundos antes de que veas la alerta de "¡Enviado!". Durante este retraso, puedes ver un botón de "Deshacer". Haz clic en él. Este botón de "Deshacer" se supone que debe evitar que el mensaje de "¡Enviado!" aparezca. Hace esto llamando a [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) para el identificador del timeout guardado durante `handleSend`. Sin embargo, incluso después de hacer clic en "Deshacer", el mensaje de "¡Enviado!" sigue apareciendo. Encuentra por qué no funciona, y arréglalo.

<Hint>

Variables comunes como `let timeoutID` no "sobreviven" entre rerenderizados porque cada renderizado ejecuta tu componente (e inicializa sus variables) desde cero. ¿Deberías guardar el identificador del timeout en algún otro lugar?

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
      alert('¡Enviado!');
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

Sin importar cuándo tu componente se rerenderice (como cuando asignas el estado), todas las variables locales se inicializan desde cero. Por eso es que no puedes guardar el identificador del timeout en una variable local como `timeoutID` y luego esperar que otro controlador de evento lo "vea" en el futuro. En cambio, almacénalo en una ref, que React preservará entre renderizados.

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
      alert('¡Enviado!');
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


#### Arregla un componente que no logra rerenderizar {/*fix-a-component-failing-to-re-render*/}

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
      {isOnRef.current ? 'Encendido' : 'Apagado'}
    </button>
  );
}
```

</Sandpack>

<Solution>

En este ejemplo, el valor actual de una ref se usa para calcular la salida del renderizado: `{isOnRef.current ? 'Encendido' : 'Apagado'}`. Esta es una señal de que esta información no debería estar en una ref, y en su lugar debería colocarse en el estado. Para arreglarlo, quita la ref y en su lugar usa el estado:

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

#### Arregla el _debounce_ {/*fix-debouncing*/}

<<<<<<< HEAD
En este ejemplo, todos los controladores de clic usan [el "corte de rebote" o _"debounce"_.](https://redd.one/blog/debounce-vs-throttle) Para ver que significa esto, presiona uno de los botones. Fíjate como el mensaje aparece un segundo después. Si presionas el botón mientras esperas el mensaje, el temporizador se reiniciará. Así que si te mantienes cliqueando el mismo botón rápidamente muchas veces, el mensaje no aparecerá hasta un segundo *después* de que pares de hacer clic. El _debounce_ te permite retrasar algunas acciones hasta que el usuario "pare de hacer cosas".
=======
In this example, all button click handlers are ["debounced".](https://kettanaito.com/blog/debounce-vs-throttle) To see what this means, press one of the buttons. Notice how the message appears a second later. If you press the button while waiting for the message, the timer will reset. So if you keep clicking the same button fast many times, the message won't appear until a second *after* you stop clicking. Debouncing lets you delay some action until the user "stops doing things".
>>>>>>> d34c6a2c6fa49fc6f64b07aa4fa979d86d41c4e8

Este ejemplo funciona, pero no tan bien como se esperaba. Los botones no son independientes. Para ver el problema, haz clic en uno de los botones, y luego inmediatamente haz clic en otro botón. Esperarías que después de un retraso, podrías ver los mensajes de ambos botones. Pero solo se muestra el mensaje del último botón. El mensaje del primer botón se pierde.

¿Por qué los botones están interfiriendo con los demás? Encuentra y arregla el problema.

<Hint>

La variable del último ID del timeout se comparte entre todos los componentes `DebouncedButton`. Por eso si se hace clic en un botón se reinicia el timeout de otro botón. ¿Puedes almacenar un ID de timeout por separado para cada botón?

</Hint>

<Sandpack>

```js
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
        onClick={() => alert('¡Cohete lanzado!')}
      >
        Lanza el cohete
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('¡Sopa hervida!')}
      >
        Hierve la sopa
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('¡Canción de cuna cantada!')}
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

Una variable como `timeoutID` se comparte entre todos los componentes. Por esto si se hace clic en el segundo botón se reinicia el timeout pendiente del primer botón. Para solucionarlo, puedes guardar el timeout en una ref. Cada botón tendrá su propia ref, así no tendrán conflicto con los demás botones. Fíjate como al hacer clic a dos botones rápidamente se mostrarán ambos mensajes.

<Sandpack>

```js
import { useRef } from 'react';

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
        onClick={() => alert('¡Cohete lanzado!')}
      >
        Lanza el cohete
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('¡Sopa hervida!')}
      >
        Hierve la sopa
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('¡Canción de cuna cantada!')}
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

#### Lee el último estado {/*read-the-latest-state*/}

En este ejemplo, después de que presionas "Enviar", hay un pequeño retraso antes de que el mensaje se muestre. Escribe "hola", presiona Enviar, y luego rápidamente edita el input otra vez. A pesar de tus cambios, la alerta seguirá mostrando "hola" (que fue el valor del estado [en el momento](/learn/state-as-a-snapshot#state-over-time) en el que hiciste clic en el botón).

Normalmente, este es el comportamiento que quieres en una aplicación. Sin embargo, en ocasiones quieres que algún código asíncrono lea la *última* versión de algún estado. ¿Se te ocurre alguna manera de hacer que la alerta muestre el texto *actual* del input en lugar del que estaba en el momento del clic?

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

El estado funciona [como una instantánea](/learn/state-as-a-snapshot), así que no puedes leer el último estado de una operación asíncrona como un timeout. Sin embargo, puedes guardar el último texto del input en una ref. Una ref es mutable, así que puedes leer la propiedad `current` en cualquier momento. Como el texto actual también se usa para el renderizado, en este ejemplo, necesitaras *tanto* una variable de estado (para el renderizado), *como* una ref (para leerlo en el timeout). Necesitarás actualizar el valor actual de la ref manualmente.

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
