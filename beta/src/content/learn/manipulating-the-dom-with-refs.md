---
title: 'Manipulación del DOM con Refs'
---

<Intro>

React actualiza automáticamente el [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) para que coincida con su salida de renderizado, por lo que sus componentes no necesitarán manipularlo con frecuencia. Sin embargo, a veces es posible que necesite acceder a los elementos DOM administrados por React, por ejemplo, para enfocar un nodo, desplazarse hasta él o medir su tamaño y posición. No hay una forma integrada de hacer esas cosas en React, por lo que necesitará una referencia al nodo DOM.

</Intro>

<YouWillLearn>

- Cómo acceder a un nodo DOM administrado por React con el `ref` atributo
- Cómo  `ref` se relaciona el atributo JSX con el `useRef` Hook
- Cómo acceder al nodo DOM de otro componente
- En qué casos es seguro modificar el DOM administrado por React

</YouWillLearn>

## Obtener una referencia al nodo {/*getting-a-ref-to-the-node*/}

Para acceder a un nodo DOM administrado por React, primero importa el`useRef` Hook:

```js
import { useRef } from 'react';
```

Luego, utilícelo para declarar una referencia dentro de su componente:

```js
const myRef = useRef(null);
```

Finalmente, páselo al nodo DOM como el `ref` atributo:

```js
<div ref={myRef}>
```

El `useRef` Hook devuelve un objeto con una sola propiedad llamada `current`. Inicialmente, `myRef.current` será `null`. Cuando React crea un nodo DOM para este `<div>`, React pondrá una referencia a este nodo en `myRef.current`.  Luego puede acceder a este nodo DOM desde sus controladores de [eventos](/learn/responding-to-events) y usar las [ APIs de navegador integrado](https://developer.mozilla.org/docs/Web/API/Element) definidas en él.

```js
// Puede usar cualquier API del navegador, por ejemplo:
myRef.current.scrollIntoView();
```

### Ejemplo: enfocar una entrada de texto {/*example-focusing-a-text-input*/}

En este ejemplo, hacer clic en el botón enfocará la entrada:

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

Para implementar esto:

1. Declara `inputRef` con el `useRef` Hook.
2. Pasalo como `<input ref={inputRef}>`. Esto le dice a React que **coloque este `<input>`nodo DOM en `inputRef.current`.**
3. En la `handleClick` función, lea el nodo DOM de entrada `inputRef.current` y llámelo [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) con `inputRef.current.focus()`.
4. Pase el `handleClick` controlador de eventos a `<button>` con `onClick`.

Si bien la manipulación de DOM es el caso de uso más común para las referencias,  `useRef` Hook se puede usar para almacenar otras cosas fuera de React, como ID de temporizadores. De manera similar al estado, las referencias permanecen entre los renderizados. Las referencias son como variables de estado que no desencadenan re-renderizaciones cuando las configura. Para obtener una introducción a las referencias, consulte  [Referenciar valores con refs.](/learn/referencing-values-with-refs)

### Ejemplo: desplazarse a un elemento {/*example-scrolling-to-an-element*/}

Puede tener más de una sola referencia en un componente. En este ejemplo, hay un carrusel de tres imágenes. Cada botón centra una imagen llamando al [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) método del navegador del nodo DOM correspondiente:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
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

<DeepDive title="Cómo administrar una lista de referencias mediante una devolución de llamada de referencia">

En los ejemplos anteriores, hay un número predefinido de referencias. Sin embargo, a veces es posible que necesite una referencia para cada elemento de la lista y no sabe cuántos tendrá. Algo como esto **no funcionaría**:

```js
<ul>
  {items.map((item) => {
    // ¡No funciona!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Esto se debe a que **los ganchos solo deben llamarse en el nivel superior de su componente.** No puede llamar `useRef` en un ciclo, en una condición o dentro de una `map()` llamada.

Una forma posible de evitar esto es obtener una sola referencia a su elemento principal y luego usar métodos [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) de manipulación DOM como "encontrar" los nodos secundarios individuales de él. Sin embargo, esto es frágil y puede romperse si cambia su estructura DOM.

Otra solución es **pasar una función al `ref` atributo.** Esto se denomina "devolución de llamada de referencia". React llamará a su devolución de llamada de referencia con el nodo DOM cuando sea el momento de configurar la referencia y `null` cuando sea el momento de borrarla. Esto le permite mantener su propia matriz o [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), y acceder a cualquier referencia por su índice o algún tipo de ID.

Este ejemplo muestra cómo puede usar este enfoque para desplazarse a un nodo arbitrario en una lista larga:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const itemsRef = useRef(null);

  function scrollToId(itemId) {
    const map = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Inicialice el map en el primer uso.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>
          Tom
        </button>
        <button onClick={() => scrollToId(5)}>
          Maru
        </button>
        <button onClick={() => scrollToId(9)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          {catList.map(cat => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat.id, node);
                } else {
                  map.delete(cat.id);
                }
              }}
            >
              <img
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
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

En este ejemplo, `itemsRef` no contiene un solo nodo DOM. En su lugar, contiene un [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) del ID del elemento a un nodo DOM ([¡Los refs pueden contener cualquier valor!](/learn/referencing-values-with-refs)) La `ref` devolución de llamada en cada elemento de la lista se encarga de actualizar el Map:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Añadir al Map
      map.set(cat.id, node);
    } else {
      // Eliminar de la carpeta Map
      map.delete(cat.id);
    }
  }}
>
```

Esto le permite leer nodos DOM individuales del map más tarde.

</DeepDive>

## Acceder a los nodos DOM de otro componente {/*accessing-another-components-dom-nodes*/}

Cuando coloca una referencia en un componente integrado que genera un elemento del navegador como `<input />`, React establecerá la `current` propiedad de esa referencia en el nodo DOM correspondiente (como el real `<input />` en el navegador).

Sin embargo, si intenta poner una referencia en **su propio** componente, como `<MyInput />`, por defecto obtendrá `null`. Aquí hay un ejemplo que lo demuestra. Observe cómo hacer clic en el botón **no enfoca** la entrada:

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
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

Para ayudarlo a notar el problema, React también imprime un error en la consola:

<ConsoleBlock level="error">

Advertencia: Los componentes de la función no pueden recibir referencias. Los intentos de acceder a esta referencia fallarán. ¿Querías usar React.forwardRef()?

</ConsoleBlock>

Esto sucede porque, de forma predeterminada, React no permite que un componente acceda a los nodos DOM de otros componentes. ¡Ni siquiera para sus propios hijos! Esto es intencional. Los refs son una escotilla de escape que debe usarse con moderación. La manipulación manual de los nodos DOM del componente _another_ hace que el código sea aún más frágil.

En cambio, los componentes que desean exponer sus nodos DOM deben optar por ese comportamiento. Un componente puede especificar que "reenvía" su referencia a uno de sus hijos. Así es como`MyInput` se puede usar la `forwardRef` API:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Así es como funciona:

1. `<MyInput ref={inputRef} />` le dice a React que coloque el nodo DOM correspondiente en `inputRef.current`. Sin embargo, depende del `MyInput` componente optar por eso; de forma predeterminada, no lo hace.
2. El `MyInput` componente se declara mediante `forwardRef`. **Esto opta por recibir el `inputRef` de arriba como el segundo `ref` argumento**  que se declara después `props`.
3. `MyInput` mismo pasa lo `ref` que recibió al `<input>` interior de él.

Ahora hacer clic en el botón para enfocar la entrada funciona:

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

En los sistemas de diseño, es un patrón común que los componentes de bajo nivel, como botones, entradas, etc., reenvíen sus referencias a sus nodos DOM. Por otro lado, los componentes de alto nivel como formularios, listas o secciones de página generalmente no exponen sus nodos DOM para evitar dependencias accidentales en la estructura DOM.

<DeepDive title="Exponer un subconjunto de la API con un identificador imperativo">

En el ejemplo anterior, `MyInput` expone el elemento de entrada DOM original. Esto permite que el componente principa `focus()` lo llame. Sin embargo, esto también permite que el componente principal haga otra cosa, por ejemplo, cambiar sus estilos CSS. En casos poco comunes, es posible que desee restringir la funcionalidad expuesta. Puedes hacer eso con `useImperativeHandle`:

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
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

Aquí, el `realInputRef` interior `MyInput` contiene el nodo DOM de entrada real. Sin embargo, `useImperativeHandle` le indica a React que proporcione su propio objeto especial como el valor de una referencia al componente principal. Entonces, `inputRef.current` dentro del `Form` componente solo tendrá el `focus` método. En este caso, el "controlador" de referencia no es el nodo DOM, sino el objeto personalizado que crea dentro de `useImperativeHandle` la llamada.

</DeepDive>

## Cuando React adjunta las referencias {/*when-react-attaches-the-refs*/}

In React, every update is split in [two phases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* During **render,** React calls your components to figure out what should be on the screen.
* During **commit,** React applies changes to the DOM.

In general, you [don't want](/learn/referencing-values-with-refs#best-practices-for-refs) to access refs during rendering. That goes for refs holding DOM nodes as well. During the first render, the DOM nodes have not yet been created, so `ref.current` will be `null`. And during the rendering of updates, the DOM nodes haven't been updated yet. So it's too early to read them.

React sets `ref.current` during the commit. Before updating the DOM, React sets the affected `ref.current` values to `null`. After updating the DOM, React immediately sets them to the corresponding DOM nodes.

**Usually, you will access refs from event handlers.** If you want to do something with a ref, but there is no particular event to do it in, you might need an Effect. We will discuss effects on the next pages.

<DeepDive title="Flushing state updates synchronously with flushSync">

Consider code like this, which adds a new todo and scrolls the screen down to the last child of the list. Notice how, for some reason, it always scrolls to the todo that was *just before* the last added one:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

The issue is with these two lines:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

In React, [state updates are queued.](/learn/queueing-a-series-of-state-updates) Usually, this is what you want. However, here it causes a problem because `setTodos` does not immediately update the DOM. So the time you scroll the list to its last element, the todo has not yet been added. This is why scrolling always "lags behind" by one item.

To fix this issue, you can force React to update ("flush") the DOM synchronously. To do this, import `flushSync` from `react-dom` and **wrap the state update** into a `flushSync` call:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

This will instruct React to update the DOM synchronously right after the code wrapped in `flushSync` executes. As a result, the last todo will already be in the DOM by the time you try to scroll to it:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);      
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Best practices for DOM manipulation with refs {/*best-practices-for-dom-manipulation-with-refs*/}

Refs are an escape hatch. You should only use them when you have to "step outside React". Common examples of this include managing focus, scroll position, or calling browser APIs that React does not expose.

If you stick to non-destructive actions like focusing and scrolling, you shouldn't encounter any problems. However, if you try to **modify** the DOM manually, you can risk conflicting with the changes React is making.

To illustrate this problem, this example includes a welcome message and two buttons. The first button toggles its presence using [conditional rendering](/learn/conditional-rendering) and [state](/learn/state-a-components-memory), as you would usually do in React. The second button uses the [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) to forcefully remove it from the DOM outside of React's control.

Try pressing "Toggle with setState" a few times. The message should disappear and appear again. Then press "Remove from the DOM". This will forcefully remove it. Finally, press "Toggle with setState":

<Sandpack>

```js
import {useState, useRef} from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

After you've manually removed the DOM element, trying to use `setState` to show it again will lead to a crash. This is because you've changed the DOM, and React doesn't know how to continue managing it correctly.

**Avoid changing DOM nodes managed by React.** Modifying, adding children to, or removing children from elements that are managed by React can lead to inconsistent visual results or crashes like above.

However, this doesn't mean that you can't do it at all. It requires caution. **You can safely modify parts of the DOM that React has _no reason_ to update.** For example, if some `<div>` is always empty in the JSX, React won't have a reason to touch its children list. Therefore, it is safe to manually add or remove elements there.

<Recap>

- Refs are a generic concept, but most often you'll use them to hold DOM elements.
- You instruct React to put a DOM node into `myRef.current` by passing `<div ref={myRef}>`.
- Usually, you will use refs for non-destructive actions like focusing, scrolling, or measuring DOM elements.
- A component doesn't expose its DOM nodes by default. You can opt into exposing a DOM node by using `forwardRef` and passing the second `ref` argument down to a specific node.
- Avoid changing DOM nodes managed by React.
- If you do modify DOM nodes managed by React, modify parts that React has no reason to update.

</Recap>



<Challenges>

#### Play and pause the video {/*play-and-pause-the-video*/}

In this example, the button toggles a state variable to switch between a playing and a paused state. However, in order to actually play or pause the video, toggling state is not enough. You also need to call [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) and [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) on the DOM element for the `<video>`. Add a ref to it, and make the button work.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

For an extra challenge, keep the "Play" button in sync with whether the video is playing even if the user right-clicks the video and plays it using the built-in browser media controls. You might want to listen to `onPlay` and `onPause` on the video to do that.

<Solution>

Declare a ref and put it on the `<video>` element. Then call `ref.current.play()` and `ref.current.pause()` in the event handler depending on the next state.

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
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

In order to handle the built-in browser controls, you can add `onPlay` and `onPause` handlers to the `<video>` element and call `setIsPlaying` from them. This way, if the user plays the video using the browser controls, the state will adjust accordingly.

</Solution>

#### Focus the search field {/*focus-the-search-field*/}

Make it so that clicking the "Search" button puts focus into the field.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Add a ref to the input, and call `focus()` on the DOM node to focus it:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Scrolling an image carousel {/*scrolling-an-image-carousel*/}

This image carousel has a "Next" button that switches the active image. Make the gallery scroll horizontally to the active image on click. You will want to call [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) on the DOM node of the active image:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

You don't need to have a ref to every image for this exercise. It should be enough to have a ref to the currently active image, or to the list itself. Use `flushSync` to ensure the DOM is updated *before* you scroll.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

You can declare a `selectedRef`, and then pass it conditionally only to the current image:

```js
<li ref={index === i ? selectedRef : null}>
```

When `index === i`, meaning that the image is the selected one, the `<li>` will receive the `selectedRef`. React will make sure that `selectedRef.current` always points at the correct DOM node.

Note that the `flushSync` call is necessary to force React to update the DOM before the scroll. Otherwise, `selectedRef.current` would always point at the previously selected item.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Focus the search field with separate components {/*focus-the-search-field-with-separate-components*/}

Make it so that clicking the "Search" button puts focus into the field. Note that each component is defined in a separate file and shouldn't be moved out of it. How do you connect them together?

<Hint>

You'll need `forwardRef` to opt into exposing a DOM node from your own component like `SearchInput`.

</Hint>

<Sandpack>

```js App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

You'll need to add an `onClick` prop to the `SearchButton`, and make the `SearchButton` pass it down to the browser `<button>`. You'll also pass a ref down to `<SearchInput>`, which will forward it to the real `<input>` and populate it. Finally, in the click handler, you'll call `focus` on the DOM node stored inside that ref.

<Sandpack>

```js App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>