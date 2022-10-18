---
title: useRef
---

<Intro>

`useRef` es un React Hook que te permite referenciar un valor que no es necesario para el renderizado.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Referenciar un valor con una referencia {/*referencing-a-value-with-a-ref*/}

Llame a `useRef` en el nivel superior de su componente para declarar uno o más [referencias.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` devuelve una <CodeStep step={1}>referencia al objeto</CodeStep> con una sola  <CodeStep step={2}>propiedad `actual` </CodeStep> Establecida inicialmente con el <CodeStep step={3}>Valor inicial</CodeStep> que usted proporcionó.

En los siguientes renderizados, `useRef` devolverá el mismo objeto. Puedes cambiar su propiedad `actual` para almacenar información y leerla más tarde. Esto puede recordarte a [estado](/apis/react/useState), pero hay una diferencia importante.

**El cambio de una referencia no provoca una nueva renderización.** Esto significa que las referencias son perfectas para almacenar información que no afecta a la salida visual de su componente. Por ejemplo, si necesita almacenar un [ID de intervalo](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) y recuperarlo más tarde, puedes ponerlo en una referencia. Para actualizar el valor dentro de la referencia, es necesario cambiar manualmente su<CodeStep step={2}>propiedad `actual`</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Más tarde, puedes leer el ID de ese intervalo desde la referencia para poder llamar a [borrar ese intervalo](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Al utilizar una referencia, te aseguras de que:

- Puedes **almacenar información** entre renderizados (a diferencia de las variables regulares, que se reinician en cada renderizado).
- El cambio de la misma **no desencadena un renderizado** (a diferencia de las variables de estado, que desencadenan un renderizado).
- La **información es local** para cada copia de su componente (a diferencia de las variables externas, que son compartidas).

El cambio de una referencia no desencadena un renderizado, por lo que las referencias no son apropiadas para almacenar información que se quiere mostrar en la pantalla. Utiliza el estado para eso. Leer más sobre [elegir entre `useRef` y `useState`].(/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="Ejemplos de referencia a un valor con useRef" titleId="ejemplos-valor">

#### Contador de clics {/*click-counter*/}

Este componente utiliza una referencia para llevar la cuenta de las veces que se ha pulsado el botón. Tenga en cuenta que está bien usar una referencia en lugar de un estado aquí porque el recuento de clics sólo se lee y se escribe en un controlador de eventos.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Haz clic en mí!
    </button>
  );
}
```

</Sandpack>

Si muestra `{ref.current}` en el JSX, el número no se actualizará al hacer clic. Esto se debe a que el establecimiento de `ref.current` no desencadena un renderizado. La información que se utiliza para el renderizado debe ser el estado en su lugar.

<Solution />

#### Un cronómetro {/*a-stopwatch*/}

Este ejemplo utiliza una combinación de estado y referencias. Tanto `startTime` como `now` son variables de estado porque se utilizan para la renderización. Pero también necesitamos mantener un [ID de intervalo](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) para que podamos detener el intervalo al pulsar el botón. Dado que el ID del intervalo no se utiliza para el renderizado, es conveniente mantenerlo en una referencia, y actualizarlo manualmente.

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
      <h1>El tiempo transcurre: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Empezar
      </button>
      <button onClick={handleStop}>
        Parar
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**No escriba _ni lea_ `ref.current` durante la renderización.**

React espera que el cuerpo de tu componente [se comporte como una función pura](/learn/keeping-components-pure):

- Si las entradas ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), y [context](/learn/passing-data-deeply-with-context)) son iguales, debería devolver exactamente el mismo JSX.
- Llamarla en un orden diferente o con argumentos diferentes no debería afectar a los resultados de otras llamadas.

Leer o escribir una referencia **durante el renderizado** rompe estas expectativas.

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 No escriba una referencia durante el renderizado
  myRef.current = 123;
  // ...
  // 🚩 No leer una referencia durante el renderizado
  return <h1>{myOtherRef.current}</h1>;
}
```

Puedes leer o escribir referencias **desde manejadores de eventos o efectos en su lugar**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Se pueden leer o escribir referencias en efectos
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Puedes leer o escribir referencias en los manejadores de eventos
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Si tiene que leer [o escribir](/apis/react/useState#storing-information-from-previous-renders) algo durante la renderizacion, [utilice el estado](/apis/react/useState) en su lugar.

Si rompes estas reglas, tu componente puede seguir funcionando, pero la mayoría de las nuevas características que estamos añadiendo a React se basarán en estas expectativas. Lee más sobre [mantener tus componentes puros.](/learn/keeping-components-pure#where-you-can-cause-side-effects)

</Pitfall>

---

### Manipulación del DOM con una referencia {/*manipulating-the-dom-with-a-ref*/}

Es particularmente común utilizar una referencia para manipular el [DOM].(https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) React tiene soporte incorporado para esto.

En primer lugar, declare una <CodeStep step={1}>referencia al objeto</CodeStep> con un <CodeStep step={3}>valor inicial</CodeStep> de `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Entonces pasa tu objeto de referencia como el atributo `ref` al JSX del nodo DOM que quieres manipular:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

Después de que React cree el nodo DOM y lo ponga en la pantalla, React establecerá la <CodeStep step={2}>propiedad `actual`</CodeStep> de su objeto de referencia a ese nodo DOM. Ahora puedes acceder al nodo DOM de `<input>` y llamar a métodos como [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React devolverá la propiedad `actual` a `null` cuando el nodo sea eliminado de la pantalla.

Más información sobre la[manipulación del DOM con referencias.](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="Ejemplos de manipulación del DOM con useRef" titleId="examples-dom">

#### Enfocar una entrada de texto {/*focusing-a-text-input*/}

En este ejemplo, al hacer clic en el botón se centrará la entrada:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Centrar la entrada
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Desplazamiento de una imagen a la vista {/*scrolling-an-image-into-view*/}

En este ejemplo, al hacer clic en el botón se desplazará una imagen a la vista. Utiliza una referencia al nodo DOM de la lista, y luego llama al DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API para encontrar la imagen a la que queremos desplazarnos.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // Esta línea asume una estructura DOM particular:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Reproducir y pausar un vídeo {/*playing-and-pausing-a-video*/}

Este ejemplo utiliza una referencia para llamar a [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) y [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) en un nodo DOM de`<video>`.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Exponer una referencia a su propio componente {/*exposing-a-ref-to-your-own-component*/}

A veces, es posible que quieras dejar que el componente padre manipule el DOM dentro de tu componente. Por ejemplo, tal vez estás escribiendo un componente `MyInput`, pero quieres que el padre sea capaz de enfocar la entrada (a la que el padre no tiene acceso). Puedes usar una combinación de `useRef` para mantener la entrada y [`forwardRef`](/apis/react/forwardRef) para exponerlo al componente principal. Lea un [recorrido detallado](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) aquí.

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Centrar la entrada
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Evitar la recreación del contenido de las referencias {/*avoiding-recreating-the-ref-contents*/}

React guarda el valor inicial de la referencia una vez y lo ignora en los siguientes renderizados.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Aunque el resultado de `new VideoPlayer()` sólo se utiliza para el renderizado inicial, todavía estás llamando a esta función en cada renderizado. Esto puede ser un desperdicio si está creando objetos costosos.

Para solucionarlo, puedes inicializar la referencia de esta manera:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normalmente, no se permite escribir o leer `ref.current` durante el renderizado. Sin embargo, está bien en este caso porque el resultado es siempre el mismo, y la condición sólo se ejecuta durante la inicialización por lo que es totalmente predecible.

<DeepDive title="Cómo evitar la comprobación de nulos al inicializar useRef posteriormente">

Si utilizas un comprobador de tipos y no quieres comprobar siempre la existencia de `null`, puedes probar con un patrón como éste:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Aquí, el propio `playerRef` es anulable. Sin embargo, deberías ser capaz de convencer a tu comprobador de tipos de que no hay ningún caso en el que `getPlayer()` devuelva `null`. Entonces usa `getPlayer()` en tus manejadores de eventos.

</DeepDive>

---

## Referencia {/*reference*/}

### `useRef(valorInicial)` {/*useref*/}

Llame a `useRef` en el nivel superior de su componente para declarar una [referencia.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

Ver ejemplos de [valores de referencia](#examples-value) y [manipulación de DOM].(#examples-dom)

#### Parámetros {/*parameters*/}

* `ValorInicial`: El valor que quieres que tenga inicialmente la propiedad `actual` del objeto de referencia. Puede ser un valor de cualquier tipo. Este argumento se ignora después del renderizado inicial.

#### Devuelve {/*returns*/}

`useRef` devuelve un objeto con una sola propiedad:

* `actual`: Inicialmente, se establece en el `ValorInicial` que has pasado. Más tarde puedes establecerlo a otra cosa. Si pasas el objeto de referencia a React como un atributo `referencia` a un nodo JSX, React establecerá su propiedad `current`.

En los siguientes renderizados, `useRef` devolverá el mismo objeto.

#### Advertencias {/*caveats*/}

* Puedes mutar la propiedad `ref.current`. A diferencia del estado, es mutable. Sin embargo, si contiene un objeto que se utiliza para la representación (por ejemplo, un pedazo de su estado), entonces usted no debe mutar ese objeto.
* Cuando cambias la propiedad `ref.current`, React no vuelve a renderizar tu componente. React no se da cuenta de cuándo la cambias porque una referencia es un objeto JavaScript plano.
* No escriba _ni lea_ `ref.current` durante el renderizado, excepto para la [inicialización].(#avoiding-recreating-the-ref-contents) Esto hace que el comportamiento de su componente sea impredecible.
* En el modo estricto, React **llamará a la función de tu componente dos veces** para [ayudarte a encontrar impurezas accidentales.](#my-initializer-or-updater-function-runs-twice) Este es un comportamiento sólo de desarrollo y no afecta a la producción. Esto significa que cada objeto ref se creará dos veces, y una de las versiones se descartará. Si la función de su componente es pura (como debería ser), esto no debería afectar a la lógica de su componente.

---

## Solución de problemas {/*troubleshooting*/}

### No puedo obtener una referencia a un componente personalizado {/*i-cant-get-a-ref-to-a-custom-component*/}

Si intentas pasar una `referencia` a tu propio componente de esta manera

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Es posible que aparezca un error en la consola:

<ConsoleBlock level="error">

Advertencia: Los componentes de la función no pueden recibir referencias. Los intentos de acceder a esta referencia fallarán. ¿Quiere decir que utiliza React.forwardRef()?

</ConsoleBlock>

Por defecto, tus propios componentes no exponen las referencias a los nodos del DOM que hay dentro de ellos.

Para solucionarlo, busca el componente del que quieres obtener una referencia:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

Y luego envolverlo en [`forwardRef`](/apis/react/forwardRef) así:
```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

Entonces el componente padre puede obtener una referencia a él.

Más información sobre [el acceso a los nodos DOM de otro componente.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
