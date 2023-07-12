---
title: forwardRef
---

<Intro>

`forwardRef` le permite a tu componente exponer un nodo DOM al componente padre con una [ref.](/learn/manipulating-the-dom-with-refs)

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Referencias {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Llama a `forwardRef()` para que tu componente reciba un ref y la reenvíe a un componente hijo:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `render`: La función de renderización de tu componente. React llama a esta función con las props y `ref` que tu componente recibió de su padre. El JSX que devuelve será la salida de tu componente.

#### Devuelve {/*returns*/}

`forwardRef` devuelve un componente de React que puedes renderizar en JSX. A diferencia de los componentes de React definidos como funciones simples, un componente devuelto por `forwardRef` también puede recibir una prop `ref`.

#### Advertencias {/*caveats*/}

* En el modo estricto, React **llamará a tu función de renderizado dos veces** para [ayudarte a encontrar impurezas accidentales.](#my-initializer-or-updater-function-runs-twice) Este es un comportamiento sólo de desarrollo y no ocurre en producción. Si tu función de renderizado es pura (como debería ser), esto no debería afectar a la lógica de tu componente. El resultado de una de las llamadas será ignorado.


---

### Función `render` {/*render-function*/}

`forwardRef` acepta una función de renderizado como argumento. React llama a esta función con `props` y `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Parámetros {/*render-parameters*/}

* `props`: Las props pasadas por el componente padre.

* `ref`:  El atributo `ref` pasado por el componente padre. La `ref` puede ser un objeto o una función. Si el componente padre no ha pasado un ref, será `null`. Deberás pasar la "ref" que recibas o bien a otro componente, o bien a [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### Devuelve {/*render-returns*/}

`forwardRef` devuelve un componente de React que puedes renderizar en JSX. A diferencia de los componentes de React definidos como funciones simples, el componente devuelto por `forwardRef` puede tomar una prop `ref`.

---

## Uso {/*usage*/}

### Exponer un nodo DOM al componente padre {/*exposing-a-dom-node-to-the-parent-component*/}

Por defecto, los nodos DOM de cada componente son privados. Sin embargo, a veces es útil exponer un nodo DOM al padre, por ejemplo, para permitir enfocarlo. Para permitirlo, envuelve la definición de tu componente con `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Recibirás una <CodeStep step={1}>ref</CodeStep> como segundo argumento después de props. Pásala al nodo DOM que quieras exponer:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Esto permite al componente padre `Form` acceder al <CodeStep step={2}>`<input>` nodo DOM</CodeStep> expuesto por `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Este componente `Form` [pasa una ref](/reference/useRef#manipulating-the-dom-with-a-ref) a `MyInput`. El componente `MyInput` *pasa* esa ref a la etiqueta `<input>` del navegador. Como resultado, el componente `Form` puede acceder a ese nodo DOM `<input>` y llamar a [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) en él.

Ten en cuenta que al exponer una ref al nodo DOM dentro de tu componente, estás dificultando la posibilidad de cambiar el interior de tu componente más adelante. Por lo general, expondrás los nodos DOM de los componentes reutilizables de bajo nivel como los botones o las entradas de texto, pero no lo harás para los componentes de nivel de aplicación como un avatar o un comentario.

<Recipes title="Ejemplos del paso de una ref">

#### Enfocar una entrada de texto {/*focusing-a-text-input*/}

Al hacer clic en el botón el campo de texto (_input_) tomará el foco. El componente `Form` define una ref y la pasa al componente `MyInput`. El componente `MyInput` la reenvía al elemento nativo `<input>`. Esto permite que el componente `Form` enfoque el `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Reproducir y pausar un vídeo {/*playing-and-pausing-a-video*/}

Al hacer clic en el botón, se llamará a [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) y [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) en un `<video>` del nodo DOM. El componente `App` define una ref y la pasa al componente `MyVideoPlayer`. El componente `MyVideoPlayer` pasa esa ref al nodo `<video>` del navegador. Esto permite al componente `App` reproducir y pausar el `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Pasar una ref a través de múltiples componentes {/*forwarding-a-ref-through-multiple-components*/}

En lugar de pasar una `ref` a un nodo DOM, puedes pasarla a un componente propio como `MyInput`.:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Si ese componente `MyInput` pasa una ref a su `<input>`, una ref a `FormField` te dará ese `<input>`:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

El componente `Form` del formulario define una ref y la pasa a `FormField`. El componente `FormField` pasa esa ref a `MyInput`, que a su vez la pasa a un nodo DOM `<input>`. Así es como `Form` accede a ese nodo DOM.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Exposición de un manejador imperativo en lugar de un nodo DOM {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

En lugar de exponer un nodo DOM completo, puedes exponer un objeto personalizado, llamado manejador imperativo (*imperative handle*), con un conjunto de métodos más restringido. Para hacer esto, tendrías que definir una ref separada para guardar el nodo DOM:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

A continuación, pasa la `ref` que has recibido a [`useImperativeHandle`](/reference/react/useImperativeHandle) y especifica el valor que quieres exponer a la `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Si algún componente obtiene ahora una ref a `MyInput`, sólo recibirá su objeto `{ focus, scrollIntoView }` en lugar del nodo DOM. Esto te permite limitar la información que expones sobre tu nodo DOM al mínimo.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Más información sobre el uso de manejadores imperativos.](/reference/react/useImperativeHandle)

<Pitfall>

**No abuses de las refs.** Sólo deberías usar refs para comportamientos *imperativos* que no puedes expresar como props: por ejemplo, desplazarse a un nodo, enfocar un nodo, desencadenar una animación, seleccionar texto, etc.

**Si puedes expresar algo como una prop, no debes usar una ref.** Por ejemplo, en lugar de exponer un manejador imperativo como `{ open, close }` de un componente `Modal`, es mejor tomar `isOpen` como prop `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) puede ayudarte a exponer comportamientos imperativos a través de props.

</Pitfall>

---

## Solución de problemas {/*troubleshooting*/}

### Mi componente está envuelto en `forwardRef`, pero la `ref` a él es siempre `null`. {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Esto suele significar que olvidaste utilizar la `ref` que recibiste.

Por ejemplo, este componente no hace nada con su `ref`:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Para solucionarlo, pasa la `ref` a un nodo DOM o a otro componente que pueda aceptar una ref:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

La `ref` a `MyInput` también podría ser `null` si parte de la lógica es condicional:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Si `showInput` es `false`, la ref no será reenviada a ningún nodo, y una ref a `MyInput` permanecerá vacía. Esto es particularmente fácil de pasar por alto si la condición está oculta dentro de otro componente, como `Panel` en este ejemplo:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
