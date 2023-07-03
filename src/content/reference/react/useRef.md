---
title: useRef
---

<Intro>

`useRef` es un Hook de React que te permite referenciar un valor que no es necesario para el renderizado.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Llama a `useRef` en el nivel superior de tu componente para declarar una [ref.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Consulta más ejemplos debajo.](#usage)

#### Parámetros {/*parameters*/}

* `initialValue`: El valor que quieres que tenga inicialmente la propiedad `current` del objeto ref. Puede ser un valor de cualquier tipo. Este argumento se ignora después del renderizado inicial.

#### Devuelve {/*returns*/}

`useRef` devuelve un objeto con una sola propiedad:

* `current`: Inicialmente, se establece en el `initialValue` que has pasado. Más tarde puedes establecerlo a otra cosa. Si pasas el objeto ref a React como un atributo `ref` a un nodo JSX, React establecerá su propiedad `current`.

En los siguientes renderizados, `useRef` devolverá el mismo objeto.

#### Advertencias {/*caveats*/}

* Puedes mutar la propiedad `ref.current`. A diferencia del estado, es mutable. Sin embargo, si contiene un objeto que se utiliza para el renderizado (por ejemplo, una parte de tu estado), entonces no deberías mutar ese objeto.
* Cuando cambias la propiedad `ref.current`, React no vuelve a renderizar tu componente. React no está al tanto de cuándo la cambias porque una ref es un objeto JavaScript plano.
* No escribas _ni leas_ `ref.current` durante el renderizado, excepto para la [inicialización.](#avoiding-recreating-the-ref-contents) Esto hace que el comportamiento de tu componente sea impredecible.
* En el modo estricto, React **llamará a la función de tu componente dos veces** para [ayudarte a encontrar impurezas accidentales.](#my-initializer-or-updater-function-runs-twice) Este es un comportamiento solo de desarrollo y no afecta en producción. Esto significa que cada objeto ref se creará dos veces, y una de las versiones se descartará. Si la función de tu componente es pura (como debería ser), no debería afectar a la lógica de tu componente.

---

## Uso {/*usage*/}

### Referenciar un valor con una ref {/*referencing-a-value-with-a-ref*/}

Llama a `useRef` en el nivel superior de tu componente para declarar una o más [refs.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` devuelve un <CodeStep step={1}>objeto ref</CodeStep> con una sola  <CodeStep step={2}>propiedad `current` </CodeStep> establecida inicialmente con el <CodeStep step={3}>valor inicial</CodeStep> que proporcionaste.

En los siguientes renderizados, `useRef` devolverá el mismo objeto. Puedes cambiar su propiedad `current` para almacenar información y leerla más tarde. Esto puede recordarte al [estado](/reference/react/useState), pero hay una diferencia importante.

**El cambio de una ref no provoca un nuevo renderizado.** Esto significa que las refs son perfectas para almacenar información que no afecta a la salida visual de tu componente. Por ejemplo, si necesita almacenar un [ID de intervalo](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) y recuperarlo más tarde, puedes ponerlo en una ref. Para actualizar el valor dentro de la ref, es necesario cambiar manualmente su<CodeStep step={2}>propiedad `current`</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Más tarde, puedes leer el ID de ese intervalo desde la ref para poder [limpiar ese intervalo](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Al utilizar una ref, te aseguras de que:

- Puedes **almacenar información** entre renderizados (a diferencia de las variables regulares, que se reinician en cada renderizado).
- Si se cambia **no se desencadena un renderizado** (a diferencia de las variables de estado, que desencadenan un renderizado).
- La **información es local** para cada copia de tu componente (a diferencia de las variables externas, que son compartidas).

El cambio de una ref no desencadena un renderizado, por lo que las refs no son apropiadas para almacenar información que se quiere mostrar en la pantalla. Utiliza el estado para eso. Lee más sobre [elegir entre `useRef` y `useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="Ejemplos de referencia a un valor con useRef" titleId="examples-value">

#### Contador de clics {/*click-counter*/}

Este componente utiliza una ref para llevar la cuenta de las veces que se ha pulsado el botón. Ten en cuenta que está bien usar una ref en lugar de un estado aquí porque el recuento de clics sólo se lee y se escribe en un manejador de eventos.

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
      Click me!
    </button>
  );
}
```

</Sandpack>

Si muestras `{ref.current}` en el JSX, el número no se actualizará al hacer clic. Esto se debe a que el establecimiento de `ref.current` no desencadena un renderizado. La información que se utiliza para el renderizado debe ser estado.

<Solution />

#### Un cronómetro {/*a-stopwatch*/}

Este ejemplo utiliza una combinación de estado y refs. Tanto `startTime` como `now` son variables de estado porque se utilizan para el renderizado. Pero también necesitamos mantener un [ID de intervalo](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) para que podamos detener el intervalo al pulsar el botón. Dado que el ID del intervalo no se utiliza para el renderizado, es conveniente mantenerlo en una ref, y actualizarlo manualmente.

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
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**No escribas _ni leas_ `ref.current` durante el renderizado.**

React espera que el cuerpo de tu componente [se comporte como una función pura](/learn/keeping-components-pure):

- Si las entradas ([props](/learn/passing-props-to-a-component), [estado](/learn/state-a-components-memory), y [contexto](/learn/passing-data-deeply-with-context)) son iguales, debería devolver exactamente el mismo JSX.
- Llamarla en un orden diferente o con argumentos diferentes no debería afectar a los resultados de otras llamadas.

Leer o escribir una ref **durante el renderizado** rompe estas expectativas.

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 No escribas una ref durante el renderizado
  myRef.current = 123;
  // ...
  // 🚩 No leas una ref durante el renderizado
  return <h1>{myOtherRef.current}</h1>;
}
```

Puedes, en su lugar, leer o escribir refs **desde manejadores de eventos o efectos**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Se pueden leer o escribir refs en efectos
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Puedes leer o escribir refs en los manejadores de eventos
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Si *tienes* que leer [o escribir](/reference/react/useState#storing-information-from-previous-renders) algo durante el renderizado, [utiliza el estado](/reference/react/useState) en su lugar.

Si rompes estas reglas, tu componente puede seguir funcionando, pero la mayoría de las nuevas características que estamos añadiendo a React se basarán en estas expectativas. Lee más sobre [mantener tus componentes puros.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Pitfall>

---

### Manipulación del DOM con una ref {/*manipulating-the-dom-with-a-ref*/}

Es particularmente común utilizar una ref para manipular el [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) React tiene soporte incorporado para esto.

En primer lugar, declara una <CodeStep step={1}>objeto ref</CodeStep> con un <CodeStep step={3}>valor inicial</CodeStep> de `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Luego pasa tu objeto ref como el atributo `ref` al JSX del nodo DOM que quieres manipular:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

Después de que React cree el nodo DOM y lo ponga en la pantalla, React establecerá la <CodeStep step={2}>propiedad `current`</CodeStep> de tu objeto ref a ese nodo DOM. Ahora puedes acceder al nodo DOM de `<input>` y llamar a métodos como [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React establecerá la propiedad `current` a `null` cuando el nodo sea eliminado de la pantalla.

Lee más sobre la [manipulación del DOM con refs.](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="Ejemplos de manipulación del DOM con useRef" titleId="examples-dom">

#### Enfocar una entrada de texto {/*focusing-a-text-input*/}

En este ejemplo, al hacer clic en el botón se hará foco en la entrada de texto o *input*:

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Desplazamiento de una imagen a la vista {/*scrolling-an-image-into-view*/}

En este ejemplo, al hacer clic en el botón se desplazará una imagen a la vista. Utiliza una ref al nodo DOM de la lista, y luego llama a la API DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) para encontrar la imagen a la que queremos desplazarnos.

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

Este ejemplo utiliza una ref para llamar a [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) y [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) en un nodo DOM de`<video>`.

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

#### Exponer una ref a tu propio componente {/*exposing-a-ref-to-your-own-component*/}

A veces, es posible que quieras dejar que el componente padre manipule el DOM dentro de tu componente. Por ejemplo, tal vez estás escribiendo un componente `MyInput`, pero quieres que el padre sea capaz de enfocar la entrada (a la que el padre no tiene acceso). Puedes usar una combinación de `useRef` para mantener la entrada y [`forwardRef`](/reference/react/forwardRef) para exponerlo al componente padre. Lee un [recorrido detallado](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) aquí.

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Evitar la recreación del contenido de las refs {/*avoiding-recreating-the-ref-contents*/}

React guarda el valor inicial de la ref una vez y lo ignora en los siguientes renderizados.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Aunque el resultado de `new VideoPlayer()` sólo se utiliza para el renderizado inicial, todavía estás llamando a esta función en cada renderizado. Esto puede ser un desperdicio si está creando objetos costosos.

Para solucionarlo, puedes inicializar la ref de esta manera:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normalmente, no se permite escribir o leer `ref.current` durante el renderizado. Sin embargo, está bien en este caso porque el resultado es siempre el mismo, y la condición sólo se ejecuta durante la inicialización por lo que es totalmente predecible.

<DeepDive>

#### ¿Cómo evitar la comprobación de nulos al inicializar useRef posteriormente? {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

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

Aquí, el propio `playerRef` puede ser `null`. Sin embargo, deberías ser capaz de convencer a tu comprobador de tipos de que no hay ningún caso en el que `getPlayer()` devuelva `null`. Luego usa `getPlayer()` en tus manejadores de eventos.

</DeepDive>

---

## Solución de problemas {/*troubleshooting*/}

### No puedo obtener una ref a un componente personalizado {/*i-cant-get-a-ref-to-a-custom-component*/}

Si intentas pasar una `ref` a tu propio componente de esta manera

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Es posible que aparezca un error en la consola:

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()? (Advertencia: Los componentes de función no pueden recibir refs. Los intentos de acceso a esta ref fallarán. ¿Era tu intención usar React.forwardRef()?)

</ConsoleBlock>

Por defecto, tus propios componentes no exponen refs a los nodos del DOM que hay dentro de ellos.

Para solucionarlo, busca el componente del que quieres obtener una ref:

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

Y luego envuélvelo en [`forwardRef`](/reference/react/forwardRef) de la siguiente forma:
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

Luego el componente padre puede obtener una ref a él.

Más información sobre [el acceso a los nodos DOM de otro componente.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
