---
title: 'Manipular el DOM con Refs'
---

<Intro>

React automáticamente actualiza el [DOM](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction) para que coincida con tu salida de renderizado, por lo que tus componentes no necesitarán manipularlo con frecuencia. Sin embargo, a veces es posible que necesites acceder a los elementos del DOM gestionados por React, por ejemplo, enfocar un nodo, desplazarse hasta él, o medir su tamaño y posición. No hay una forma integrada para hacer ese tipo de cosas en React, por lo que necesitarás una *ref* al nodo DOM.  

</Intro>

<YouWillLearn>

- Cómo acceder a un nodo DOM gestionado por React con el atributo `ref`
- Cómo el atributo `ref` de JSX se relaciona con el Hook `useRef`
- Cómo acceder al nodo DOM de otro componente
- En qué casos es seguro modificar el DOM gestionado por React

</YouWillLearn>

## Obtener una ref del nodo {/*getting-a-ref-to-the-node*/}

Para acceder a un nodo DOM gestionado por React, primero importa el Hook `useRef`:

```js
import { useRef } from 'react';
```

Luego, úsalo para declarar una ref dentro de tu componente

```js
const myRef = useRef(null);
```

Finalmente, pasa la ref como el atributo `ref` a la etiqueta JSX en el que quieres obtener el nodo DOM:

```js
<div ref={myRef}>
```

El _Hook_ `useRef` devuelve un objeto con una sola propiedad llamada `current`. Inicialmente, `myRef.current` va a ser `null`. Cuando React cree un nodo DOM para este `<div>`, React pondrá una referencia a este nodo en `myRef.current`. Entonces podrás acceder a este nodo DOM desde tus [manejadores de eventos](/learn/responding-to-events) y usar las [API de navegador](https://developer.mozilla.org/es/docs/Web/API/Element) integradas definidas en él.

```js
// Puedes usar cualquier API de navegador, por ejemplo:
myRef.current.scrollIntoView();
```

### Ejemplo: Enfocar el campo de texto _input_ {/*example-focusing-a-text-input*/}

En este ejemplo, hacer clic en el botón va a enfocar el _input_:

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
        Enfocar el input
      </button>
    </>
  );
}
```

</Sandpack>

Para implementar esto:

1. Declara `inputRef` con el _Hook_ `useRef`.
2. Pásalo como `<input ref={inputRef}>`. Esto le dice a React que **coloque el nodo DOM `<input>` en `inputRef.current`.**
3. En la función `handleClick`, lee el nodo _input_ del DOM desde `inputRef.current` y llama a [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) en él con `inputRef.current.focus()`.
4. Pasa el manejador de eventos `handleClick` a `<button>` con `onClick`.

Mientras manipular el DOM es el caso de uso más común para las refs, el _Hook_ `useRef` puede ser usado para almacenar otras cosas fuera de React, como las ID de temporizadores. De manera similar al estado, las refs permanecen entre renderizados. Las refs son como variables de estado que no desencadenan nuevos renderizados cuando las pones. Lee acerca de las refs en [Referenciar valores con refs.](/learn/referencing-values-with-refs)

### Ejemplo: Desplazarse a un elemento {/*example-scrolling-to-an-element*/}

Puedes tener más de una ref en un componente. En este ejemplo, hay un carrusel de tres imágenes. Cada botón centra una imagen al llamar al método del navegador [`scrollIntoView()`](https://developer.mozilla.org/es/docs/Web/API/Element/scrollIntoView) en el nodo DOM correspondiente:

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

<DeepDive>

#### Cómo gestionar una lista de refs usando un callback ref {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

En los ejemplos de arriba, hay un número predefinido de refs. Sin embargo, algunas veces es posible que necesites una ref en cada elemento de la lista, y no sabes cuantos vas a tener. Algo como esto **no va a funcionar**:

```js
<ul>
  {items.map((item) => {
    // ¡No funciona!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Esto es porque los **Hooks solo tienen que ser llamados en el nivel más alto de tu componente.** No puedes llamar a `useRef` en un bucle, en una condición, o dentro de una llamada a `map()`.

Una posible forma de evitar esto es hacer una sola ref a su elemento padre, y luego usar métodos de manipulación del DOM como [`querySelectorAll`](https://developer.mozilla.org/es/docs/Web/API/Document/querySelectorAll) para "encontrar" los nodos hijos individuales a partir de él. Sin embargo, esto es frágil y puede romperse si la estructura del DOM cambia.

Otra solución es **pasar una función al atributo `ref`.** A esto se le llama un [callback `ref`.](/reference/react-dom/components/common#ref-callback) React llamará tu callback ref con el nodo DOM cuando sea el momento de poner la ref, y con `null` cuando sea el momento de limpiarla. Esto te permite mantener tu propio array o un [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), y acceder a cualquier ref por su índice o algún tipo de ID.

Este ejemplo te muestra cómo puedes usar este enfoque para desplazarte a un nodo arbitrario en una lista larga:

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
      // Inicializa el Map en el primer uso
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

En este ejemplo, `itemsRef` no contiene un solo nodo DOM. En su lugar, contiene un [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) desde el ID del elemento hasta un nodo DOM. ([¡Las refs pueden contener cualquier valor!](/learn/referencing-values-with-refs)) El [callback `ref`](/reference/react-dom/components/common#ref-callback) en cada elemento de la lista se encarga de actualizar el Map:


```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Agregar al Map
      map.set(cat.id, node);
    } else {
      // Eliminar del Map
      map.delete(cat.id);
    }
  }}
>
```

Esto te permite leer nodos DOM individuales del Map más tarde.

</DeepDive>

## Accediendo a nodos DOM de otros componentes {/*accessing-another-components-dom-nodes*/}

Cuando colocas una ref en un componente integrado que devuelve de salida un elemento del navegador como `<input />`, React establecerá la propiedad `current` de esa ref al nodo DOM correspondiente (como el `<input />` real del navegador)

Sin embargo, si intentas poner una ref en tu **propio** componente, como `<MyInput />`, por defecto tendrás `null`. Aquí hay un ejemplo demostrándolo. Nota como al hacer clic en el botón **no** enfoca el _input_.

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
        Enfocar el input
      </button>
    </>
  );
}
```

</Sandpack>

Para ayudarte a notar el problema, React también mostrará un error en la consola.

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?  
**(Traducción)**  
Advertencia: A los componentes de función no se les pueden dar refs. Los intentos para acceder a esta ref no funcionará. ¿Quisiste decir usar React.forwardRef()? 

</ConsoleBlock>

Esto ocurre porque por defecto React no permite que un componente acceda a los nodos DOM de otros componentes. ¡Ni siquiera a sus propios hijos! Esto es intencionado. Las refs son una vía de escape que debe usarse con moderación. Manipular manualmente los nodos DOM de _otro_ componente hace tu código aún más frágil.

En cambio, los componentes que _quieran_ exponer sus nodos DOM tienen que **optar** por ese comportamiento. Un componente puede especificar que "reenvíe" su ref a uno de sus hijos. Aquí vemos como `MyInput` puede usar la API `forwardRef`:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Así es como funciona:

1. `<MyInput ref={inputRef} />` le dice a React que coloque el nodo DOM correspondiente en `inputRef.current`. Sin embargo, depende del componente `MyInput` utilizarlo o no; por defecto no lo hace.
2. El componente `MyInput` es declarado usando `forwardRef`. **Esto hace que pueda obtar por recibir el `inputRef` como segundo argumento de `ref`** la cual está declarada después de `props`.
3. `MyInput` por si mismo pasa la `ref` que recibió del `<input>` dentro de él.

Ahora al hacer clic en el botón para enfocar el _input_, funciona:

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
        Enfocar el input
      </button>
    </>
  );
}
```

</Sandpack>

En diseño de sistemas, es un patrón común para componentes de bajo nivel como botones, _inputs_, etc. reenviar sus refs a sus nodos DOM. Por otro lado, los componentes de alto nivel como formularios, listas, o secciones de página, usualmente no suelen exponer sus nodos DOM para evitar dependencias accidentales de la estructura del DOM.

<DeepDive>

#### Exponiendo un subconjunto de la API con un manejador imperativo {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

En el ejemplo de arriba, `MyInput` expone el elemento _input_ del DOM original. Esto le permite al componente padre llamar a `focus()` en él. Sin embargo, esto también le permite al componente padre hacer otra cosa, por ejemplo, cambiar sus estilos CSS. En casos pocos comunes, quizás quieras restringir la funcionalidad expuesta. Puedes hacer eso con `useImperativeHandle`:

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
    // Solo expone focus y nada más
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
        Enfocar el input
      </button>
    </>
  );
}
```

</Sandpack>

Aquí, `realInputRef` dentro de `MyInput` mantiene el nodo DOM de input actual. Sin embargo, `useImperativeHandle` indica a React a proveer tu propio objeto especial como el valor de una ref al componente padre. Por lo tanto, `inputRef.current` dentro del componente `Form` solo va a tener el método `focus`. En este caso, el "manejador" ref no es el nodo DOM, sino el objeto personalizado que creaste dentro de la llamada de `useImperativeHandle`. 

</DeepDive>

## Cuando React adjunta las refs {/*when-react-attaches-the-refs*/}

En React, cada actualización está dividida en [dos fases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Durante el **renderizado,** React llama a tus componentes para averiguar que deberia estar en la pantalla.
* Durante la **confirmación,** React aplica los cambios a el DOM.

En general, [no quieres](/learn/referencing-values-with-refs#best-practices-for-refs) acceder a las refs durante el renderizado. Eso va también para las refs que tienen nodos DOM. Durante el primer renderizado, los nodos DOM aún no han sido creados, entonces `ref.current` será `null`. Y durante el renderizado de actualizaciones, los nodos DOM aún no se han actualizado. Es muy temprano para leerlos.

React establece `ref.current` durante la confirmación. Antes de actualizar el DOM, React establece los valores afectados de `ref.current` a `null`. Después de actualizar el DOM, React inmediatamente los establece en los nodos DOM correspondientes.

**Generalmente, vas a acceder a las refs desde los manejadores de eventos.** Si quieres hacer algo con una ref, pero no hay un evento en particular para hacerlo, es posible que necesites un Efecto. Discutiremos los efectos en las próximas páginas. 

<DeepDive>

#### Vaciando actualizaciones de estado sincrónicamente con flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Considere un código como el siguiente, que agrega un nuevo todo y desplaza la pantalla hasta el último hijo de la lista. Observa cómo, por alguna razón, siempre se desplaza hacia el todo que estaba *justo antes* del último que se ha agregado.

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
        Agregar
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

El problema está con estas dos lineas:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

En React, [las actualizaciones de estados se ponen en cola.](/learn/queueing-a-series-of-state-updates) Generalmente, esto es lo que quieres. Sin embargo, aquí causa un problema porque `setTodos` no actualiza el DOM inmediatamente. Entonces, en el momento en el que desplazas la lista al último elemento, el todo aún no ha sido agregado. Esta es la razón por la que al desplazarse siempre se "retrasa" en un elemento.

Para arreglar este problema, puedes forzar a React a actualizar ("flush") el DOM sincrónicamente. Para hacer esto, importa `flushSync` del `react-dom` y **envuelve el actualizador de estado** en una llamada a `flushSync`:   


```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```
Esto le indicará a React que actualice el DOM sincrónicamente justo después que el código envuelto en `flushSync` se ejecute. Como resultado, el último todo ya estará en el DOM en el momento que intentes desplazarte hacia él.  

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
        Agregar
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

## Mejores prácticas para la manipulación del DOM con refs {/*best-practices-for-dom-manipulation-with-refs*/}

Las refs son una vía de escape. Sólo deberías usarlas cuando tengas que "salirte de React". Ejemplos comunes de esto incluyen la gestión del foco, la posición del scroll, o una llamada a las API del navegador que React no expone.

Si te limitas a acciones no destructivas como enfocar o desplazarte, no deberías encontrar ningún problema. Sin embargo, si intentas **modificar** el DOM manualmente, puedes arriesgarte a entrar en conflicto con los cambios que React está haciendo.

Para ilustrar este problema, este ejemplo incluye un mensaje de bienvenida y dos botones. El primer botón alterna su presencia usando [renderizado condicional](/learn/conditional-rendering) y [estado](/learn/state-a-components-memory), como normalmente lo harías en React. El segundo botón usa la [API del DOM `remove()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) para eliminarlo forzadamente del DOM fuera del control de React.

Intenta presionar "Alternar con setState" unas cuantas veces. El mensaje debe desaparecer y aparecer otra vez. Luego presiona "Eliminar del DOM". Esto lo eliminará forzadamente. Finalmente, presiona "Alternar con setState":

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Alternar con setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Eliminar del DOM
      </button>
      {show && <p ref={ref}>Hola Mundo</p>}
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

Después de que hayas eliminado el elemento DOM, intentar usar `setState` para mostrarlo de nuevo provocará un fallo. Esto se debe a que has cambiado el DOM, y React no sabe cómo seguir gestionándolo correctamente.

**Evita cambiar nodos DOM gestionados por React.** Modificar, agregar hijos, o eliminar hijos de elementos que son gestionados por React pueden traer resultados inconcistentes visuales o fallos como el de arriba. 

Sin embargo, esto no quiere decir que no puedas en absoluto. Requiere de cuidado. **Puedes modificar de manera segura partes del DOM que React _no tenga motivos_ para actualizar.** Por ejemplo, si algún `<div>` siempre está vacío en el JSX, React no tendrá un motivo para tocar su lista de elementos hijos. Por lo tanto, es seguro agregar o eliminar manualmente elementos allí.

<Recap>

- Las refs son un concepto genérico, pero a menudo las vas a usar para almacenar elementos del DOM.
- Tú le indicas a React a poner un nodo DOM dentro de `myRef.current` pasándole `<div ref={myRef}>`.
- Normalmente, vas a usar las refs para acciones no destructivas como enfocar, desplazar, o medir elementos DOM.
- Un componente no expone sus nodos DOM por defecto. Puedes optar por exponer un nodo DOM usando `forwardRef` y pasando el segundo argumento `ref` a un nodo específico.
- Evita cambiar nodos DOM gestionados por React.
- Si modificas nodos DOM gestionados por React, modifica las partes en donde React no tenga motivos para actualizar.

</Recap>



<Challenges>

#### Reproduce y pausa el video {/*play-and-pause-the-video*/}

En este ejemplo, el botón alterna una variable de estado para cambiar entre un estado de reproducción y un estado de pausa. Sin embargo, para que reproduza o pause el video, alternar el estado no es suficiente. También necesitas llamar a [`play()`](https://developer.mozilla.org/es/docs/Web/API/HTMLMediaElement/play) y [`pause()`](https://developer.mozilla.org/es/docs/Web/API/HTMLMediaElement/pause) en el elemento DOM para el `<video>`. Agrega una ref en él, y haz que el botón funcione. 

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
        {isPlaying ? 'Pausar' : 'Reproducir'}
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

Para un desafío extra, mantén el botón "Reproducir" sincronizado con la reproducción del vídeo, incluso si el usuario hace clic con el botón derecho del ratón en el vídeo y lo reproduce utilizando los controles multimedia integrados en el navegador. Para ello, es posible que quieras escuchar `onPlay` y `onPause` en el vídeo.

<Solution>

Declara una ref y colócala en el elemento `<video>`. Luego llama a `ref.current.play()` y `ref.current.pause()` en el manejador de evento dependiendo del siguiente estado.   

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

Para manejar los controles integrados del navegador, puedes agregar los manejadores `onPlay` y `onPause` al elemento `<video>` y llamar a `setIsPlaying` desde ellos. De esta manera, si el usuario reproduce el video usando los controles del navegador, el estado se ajustará en consecuencia.  

</Solution>

#### Enfoca el campo de búsqueda {/*focus-the-search-field*/}

Haz que al hacer click en el botón "Buscar" se enfoque en el campo de texto _input_.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Buscar</button>
      </nav>
      <input
        placeholder="¿Buscando algo?"
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

Agrega una ref al _input_, y llama a `focus()` en el nodo DOM para enfocarlo:

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
          Buscar
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="¿Buscando algo?"
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

#### Desplazar un carrusel de imágenes {/*scrolling-an-image-carousel*/}

Este carrusel de imágenes tiene un botón "Siguiente" que cambia la imagen activa. Haz que la galería se desplace horizontalmente hasta la imagen activa al hacer clic. Tu querrás llamar a [`scrollIntoView()`](https://developer.mozilla.org/es/docs/Web/API/Element/scrollIntoView) en el nodo DOM de la imagen activa:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Tu no necesitas tener una ref a cada imagen para este ejercicio. Debería ser suficiente tener una ref a la imagen actualmente activa, o a la propia lista. Usa `flushSync` para asegurarte de que el DOM se actualiza *antes* de que te desplaces.

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
          Siguiente
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

Puedes declarar una `selectedRef`, y pasarla condicionalmente solo a la imagen actual:

```js
<li ref={index === i ? selectedRef : null}>
```

Cuando `index === i`, significa que esa imagen es la seleccionada, el `<li>` recibirá la `selectedRef`. React se asegurará de que `selectedRef.current` siempre apunta al nodo DOM correcto.

Ten en cuenta que la llamada `flushSync` es necesaria para forzar a React a actualizar el DOM antes del desplazamiento. De lo contrario, `selectedRef.current` siempre apuntará al elemento anteriormente seleccionado.  

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
          Siguiente
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

#### Enfoca el campo de búsqueda con componentes separados {/*focus-the-search-field-with-separate-components*/}

Haz que al hacer clic en el botón "Buscar" se ponga el foco en el campo de texto _input_. Ten en cuenta que cada componente se define en un archivo separado y no debe moverse fuera de él. ¿Como los conectarías entre ellos?.

<Hint>

Necesitarás `forwardRef` para optar a exponer un nodo DOM de tu propio componente como `SearchInput`.

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
      Buscar
    </button>
  );
}
```

```js SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="¿Buscando algo?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Necesitarás agregar una propiedad `onClick` a `SearchButton`, y hacer que `SearchButton` lo pase al `<button>` del navegador. También pasarás una ref a `<SearchInput>`, que lo va a redirigir al `<input>` real y la completará. Finalmente, en el manejador de clic, llamarás  a `focus` en el nodo DOM almacenado dentro de esa ref.

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
      Buscar
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
        placeholder="¿Buscando algo?"
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
