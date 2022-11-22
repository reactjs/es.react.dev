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

En React, cada actualización se divide en [dos fases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Durante el **renderizado,** React llama a sus componentes para averiguar qué debería estar en la pantalla.
* Durante la **confirmación,** React aplica cambios al DOM.

En general, [no querrás](/learn/referencing-values-with-refs#best-practices-for-refs) acceder a las referencias durante el renderizado. Eso también se aplica a las referencias que tienen nodos DOM. Durante el primer renderizado, los nodos DOM aún no se han creado, por lo `ref.current` que se crearán `null`. Y durante la representación de las actualizaciones, los nodos DOM aún no se han actualizado. Así que es demasiado pronto para leerlos.

Conjuntos de reacciones`ref.current` durante la confirmación. Antes de actualizar el DOM, React establece los `ref.current` valores afectados en `null`. Después de actualizar el DOM, React los establece inmediatamente en los nodos DOM correspondientes.

**Por lo general, accederá a las referencias desde los controladores de eventos.** Si desea hacer algo con una referencia, pero no hay un evento en particular para hacerlo, es posible que necesite un efecto. Discutiremos los efectos en las próximas páginas.

<DeepDive title="Vaciado de actualizaciones de estado sincrónicamente con flushSync">

Considere un código como este, que agrega una nueva tarea pendiente y desplaza la pantalla hacia abajo hasta el último elemento secundario de la lista. Observe cómo, por alguna razón, siempre se desplaza a la tarea que estaba  *justo antes* de la última agregada:

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

El problema es con estas dos líneas:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

En React, [las actualizaciones de estado están en cola.](/learn/queueing-a-series-of-state-updates) Por lo general, esto es lo que quieres. Sin embargo, aquí causa un problema porque `setTodos` no actualiza inmediatamente el DOM. Entonces, en el momento en que desplaza la lista hasta su último elemento, la tarea pendiente aún no se ha agregado. Esta es la razón por la que el desplazamiento siempre se "retrasa" en un elemento.

Para solucionar este problema, puede obligar a React a actualizar ("vaciar") el DOM de forma síncrona. Para hacer esto, importa `flushSync` desde `react-dom` y **envuelve la actualización de estado** en una `flushSync` llamada:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

`FlushSync` Esto le indicará a React que actualice el DOM sincrónicamente justo después de que se ejecute el código envuelto . Como resultado, la última tarea pendiente ya estará en el DOM cuando intente desplazarse hasta ella:

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

## Prácticas recomendadas para la manipulación de DOM con refs {/*best-practices-for-dom-manipulation-with-refs*/}

Los árbitros son una escotilla de escape. Solo debe usarlos cuando tenga que "salir de React". Los ejemplos comunes de esto incluyen administrar el enfoque, la posición de desplazamiento o llamar a las API del navegador que React no expone.

Si te limitas a acciones no destructivas como enfocar y desplazarte, no deberías encontrar ningún problema. Sin embargo, si intenta **modificar** el DOM manualmente, puede correr el riesgo de entrar en conflicto con los cambios que está realizando React.

Para ilustrar este problema, este ejemplo incluye un mensaje de bienvenida y dos botones. El primer botón alterna su presencia usando [la representación condicional](/learn/conditional-rendering) y el [estado](/learn/state-a-components-memory), como lo haría normalmente en React. El segundo botón usa la [`remove()` API DOM ](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) para eliminarlo a la fuerza del DOM fuera del control de React.

Intente presionar "Alternar con setState" varias veces. El mensaje debería desaparecer y aparecer de nuevo. Luego presione "Eliminar del DOM". Esto lo eliminará a la fuerza. Finalmente, presiona “Alternar con setState”:

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

Después de eliminar manualmente el elemento DOM, intentar usarlo `setState` para mostrarlo de nuevo provocará un bloqueo. Esto se debe a que ha cambiado el DOM y React no sabe cómo continuar administrándolo correctamente.

**Evite cambiar los nodos DOM administrados por React.** Modificar, agregar elementos secundarios o eliminar elementos secundarios de los elementos administrados por React puede generar resultados visuales inconsistentes o bloqueos como el anterior.

Sin embargo, esto no significa que no puedas hacerlo en absoluto. Requiere precaución. **S Puede modificar de forma segura partes del DOM que React _no tiene_ motivos para actualizar.** Por ejemplo, si algo `<div>` siempre está vacío en JSX, React no tendrá ningún motivo para tocar su lista de elementos secundarios. Por lo tanto, es seguro agregar o eliminar elementos manualmente allí.

<Recap>

- Las referencias son un concepto genérico, pero la mayoría de las veces las usará para contener elementos DOM.
- Le indicas a React que coloque un nodo DOM al `myRef.current` pasar `<div ref={myRef}>`.
- Por lo general, usará refs para acciones no destructivas como enfocar, desplazar o medir elementos DOM.
- Un componente no expone sus nodos DOM de forma predeterminada. Puede optar por exponer un nodo DOM usando `forwardRef` y pasando el segundo `ref` argumento a un nodo específico.
- Evite cambiar los nodos DOM administrados por React.
- Si modifica los nodos DOM administrados por React, modifique las partes que React no tiene motivos para actualizar.

</Recap>



<Challenges>

#### Reproducir y pausar el video {/*play-and-pause-the-video*/}

En este ejemplo, el botón alterna una variable de estado para alternar entre un estado de reproducción y de pausa. Sin embargo, para reproducir o pausar el video, cambiar el estado no es suficiente. También debe llamar [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) y [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) en el elemento DOM para el `<video>`. Agregue una referencia y haga que el botón funcione.

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

Para un desafío adicional, mantenga el botón "Reproducir" sincronizado con si el video se está reproduciendo, incluso si el usuario hace clic con el botón derecho en el video y lo reproduce usando los controles multimedia integrados del navegador. Es posible que desee escuchar `onPlay` y `onPause` en el video para hacer eso.

<Solution>

Declare una referencia y colóquela en el `<video>` elemento. Luego llame `ref.current.play()` y `ref.current.pause()` en el controlador de eventos dependiendo del siguiente estado.

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

Para manejar los controles del navegador integrados, puede agregar controladores `onPlay` y `onPause` al elemento `<video>` y llamar a `setIsPlaying` desde ellos. De esta forma, si el usuario reproduce el video usando los controles del navegador, el estado se ajustará en consecuencia.

</Solution>

#### Centrar el campo de búsqueda {/*focus-the-search-field*/}

Haga que al hacer clic en el botón "Buscar" se enfoque en el campo.

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

Agregue una referencia a la entrada y llame `focus()` oal nodo DOM para enfocarlo:

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

#### Desplazamiento de un carrusel de imágenes {/*scrolling-an-image-carousel*/}

Este carrusel de imágenes tiene un botón "Siguiente" que cambia la imagen activa. Haga que la galería se desplace horizontalmente a la imagen activa al hacer clic. Deberá llamar [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) al nodo DOM de la imagen activa:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

No necesita tener una referencia para cada imagen para este ejercicio. Debería ser suficiente tener una referencia a la imagen actualmente activa o a la lista misma. Úselo `flushSync` para asegurarse de que el DOM esté actualizado *antes* de desplazarse.

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

Puede declarar un `selectedRef` , y luego pasarlo condicionalmente solo a la imagen actual:

```js
<li ref={index === i ? selectedRef : null}>
```

Cuando `index === i`, lo que significa que la imagen es la seleccionada, `<li>` recibirá el `selectedRef`. React se asegurará de que `selectedRef.current` siempre apunte al nodo DOM correcto.

Tenga en cuenta que la `flushSync` llamada es necesaria para obligar a React a actualizar el DOM antes del desplazamiento. De lo contrario, `selectedRef.current` siempre apuntaría al elemento previamente seleccionado.

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

#### Enfoque el campo de búsqueda con componentes separados {/*focus-the-search-field-with-separate-components*/}

Haga que al hacer clic en el botón "Buscar" se enfoque en el campo. Tenga en cuenta que cada componente se define en un archivo separado y no debe sacarse de él. ¿Cómo los conectas entre sí?

<Hint>

Deberá `forwardRef` optar por exponer un nodo DOM de su propio componente como `SearchInput`.

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

Necesitarás agregar un `onClick` accesorio al `SearchButton`, a y hacer que lo `SearchButton` pase al navegador `<button>`.  También pasará una referencia a `<SearchInput>`,  que la reenviará al real `<input>` y la completará. Finalmente, en el controlador de clics, llamará `focus` al nodo DOM almacenado dentro de esa referencia.

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