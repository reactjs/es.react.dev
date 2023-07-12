---
title: Conservar y reiniciar el estado
---
 
<Intro>

El estado está aislado entre los componentes. React mantiene un registro de qué estado pertenece a qué componente basándose en su lugar en el árbol de la interfaz de usuario (UI). Puedes controlar cuándo conservar el estado y cuándo restablecerlo entre rerenderizados.

</Intro>

<YouWillLearn>

* Cómo React "ve" las estructuras de los componentes
* Cuándo React elige preservar o reiniciar el estado
* Cómo forzar a React a restablecer el estado del componente
* Cómo las claves y los tipos afectan a la preservación del estado

</YouWillLearn>

## El árbol de la UI {/*the-ui-tree*/}

Los navegadores utilizan muchas estructuras de árbol para modelar la interfaz de usuario. El [DOM](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction) representa los elementos HTML, el [CSSOM](https://developer.mozilla.org/es/docs/Web/API/CSS_Object_Model) hace lo mismo con el CSS. ¡Hay incluso un  [árbol de accesibilidad](https://developer.mozilla.org/es/docs/Glossary/Accessibility_tree)!

React también utiliza estructuras de árbol para gestionar y modelar la UI que estás generando. React crea **árboles de UI** a partir de su JSX. Posteriormente, React DOM actualiza los elementos del DOM del navegador para que coincidan con ese árbol UI. (React Native traduce estos árboles en elementos específicos para plataformas móviles).

<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagrama con tres secciones dispuestas horizontalmente. En la primera sección, hay tres rectángulos apilados verticalmente, con las etiquetas 'Componente A', 'Componente B', y 'Componente C'. La transición al siguiente panel es una flecha con el logo de React en la parte superior etiquetada como 'React'. La sección central contiene un árbol de componentes, con la raíz etiquetada 'A' y dos hijos etiquetados 'B' y 'C'. La siguiente sección vuelve a ser una transición con una flecha con el logo de React en la parte superior, etiquetada como 'React'. La tercera y última sección es un wireframe de un navegador, que contiene un árbol de 8 nodos, que sólo tiene un subconjunto resaltado (indicando el subárbol de la sección central).">

A partir de los componentes, React crea un árbol de interfaz de usuario que React DOM utiliza para representar el DOM.

</Diagram>

</DiagramGroup>

## State is tied to a position in the tree {/*state-is-tied-to-a-position-in-the-tree*/}

Cuando se le da un estado a un componente, podrías pensar que el estado "vive" dentro del componente. Pero en realidad el estado se mantiene en React. React asocia cada pieza de estado que mantiene con el componente correcto gracias al lugar que ocupa ese componente en el árbol de la UI.


En este caso, sólo hay una etiqueta JSX  `<Counter />`, pero se representa en dos posiciones diferentes:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Esta sería la apariencia del árbol:    

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagrama de un árbol de componentes de React. El nodo raíz está etiquetado como 'div' y tiene dos hijos. Cada uno de los hijos está etiquetado como 'Counter' y ambos contienen una burbuja de estado etiquetada como 'count' con valor 0.">

Árbol de React

</Diagram>

</DiagramGroup>

**Son dos contadores separados porque cada uno se renderiza en su propia posición en el árbol.** Normalmente no tienes que pensar en estas posiciones para usar React, pero puede ser útil para entender cómo funciona.

En React, cada componente en la pantalla tiene un estado totalmente aislado. Por ejemplo, si renderizas dos componentes `Counter`, uno al lado del otro, cada uno de ellos obtendrá sus propios e independientes estados `score` y `hover`.

Prueba a hacer clic en ambos contadores y observa que no se afectan mutuamente:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Como puedes ver, cuando se actualiza un contador, sólo se actualiza el estado de ese componente:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagrama de un árbol de componentes de React. El nodo raíz está etiquetado como 'div' y tiene dos hijos. El hijo izquierdo se llama 'Counter' y contiene una burbuja de estado llamada 'count' con valor 0. El hijo derecho se llama 'Counter' y contiene una burbuja de estado llamada 'count' con valor 1. La burbuja de estado del hijo derecho está resaltada en amarillo para indicar que su valor se ha actualizado.">

Actualización del estado

</Diagram>

</DiagramGroup>


React mantendrá el estado mientras se renderice el mismo componente en la misma posición. Para ver esto, incrementa ambos contadores, luego quita el segundo componente desmarcando la casilla "Render the second counter", y luego vuelve a añadirlo marcándola de nuevo:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Observa cómo en el momento en que dejas de renderizar el segundo contador, su estado desaparece por completo. Eso es porque cuando React elimina un componente, destruye su estado.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagrama de un árbol de componentes React. El nodo raíz está etiquetado como 'div' y tiene dos hijos. El hijo izquierdo se llama 'Counter' y contiene una burbuja de estado llamada 'count' con valor 0. El hijo de la derecha no está, y en su lugar hay una imagen amarilla '¡puf!', destacando el componente que se está eliminando del árbol.">

Eliminación de un componente

</Diagram>

</DiagramGroup>

Al marcar "Renderizar el segundo contador", se inicializa un segundo `Counter` y su estado se inicializa desde cero (`score = 0`) y se añade al DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagrama de un árbol de componentes de React. El nodo raíz está etiquetado como 'div' y tiene dos hijos. El hijo izquierdo se llama 'Counter' y contiene una burbuja de estado llamada 'count' con valor 0. El hijo derecho se llama 'Counter' y contiene una burbuja de estado llamada 'count' con valor 0. Todo el nodo hijo derecho está resaltado en amarillo, indicando que acaba de ser añadido al árbol.">

Añadiendo un componente

</Diagram>

</DiagramGroup>

**React preserva el estado de un componente mientras se renderiza en su posición en el árbol de la interfaz de usuario.** Si se elimina, o se renderiza un componente diferente en la misma posición, React descarta su estado.

## El mismo componente en la misma posición conserva el estado {/*same-component-at-the-same-position-preserves-state*/}

En este ejemplo, hay dos tipos diferentes de etiquetas `<Counter />`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Cuando se marca o desactiva la casilla, el estado del contador no se reinicia. Tanto si `isFancy` es `true` como si es `false`, siempre tendrás un `<Counter />` como primer hijo del `div` devuelto desde el componente raíz `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagrama con dos secciones separadas por una flecha de transición entre ellas. Cada sección contiene un diseño de componentes con un padre etiquetado como 'App' que contiene una burbuja de estado etiquetada como isFancy. Este componente tiene un hijo etiquetado 'div', que lleva a una burbuja de prop que contiene isFancy (resaltada en púrpura) que pasa al único hijo. El último hijo se llama 'Counter'y contiene una burbuja de estado con la etiqueta 'count' y el valor 3 en ambos diagramas. En la sección izquierda del diagrama, no hay nada resaltado y el valor de estado del padre isFancy es falso. En la sección derecha del diagrama, el valor del estado padre isFancy ha cambiado a verdadero y está resaltado en amarillo, al igual que la burbuja de props que está debajo, que también ha cambiado su valor isFancy a verdadero.">

La actualización del estado de la `App` no reinicia el `Counter` porque el `Counter` permanece en la misma posición

</Diagram>

</DiagramGroup>


Es el mismo componente en la misma posición, por lo tanto desde la perspectiva de React, es el mismo contador.

<Pitfall>

¡Recuerda que **es la posición en el árbol de la UI --no en el markup JSX-- lo que le importa a React!** Este componente tiene dos cláusulas `return` con diferentes etiquetas JSX `<Counter />` dentro y fuera del `if`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Se podría esperar que el estado se restableciera al marcar la casilla de verificación, pero no es así. Esto se debe a que **las dos etiquetas `<Counter />` se renderizan en la misma posición.** React no sabe dónde colocas las condiciones en tu función. Todo lo que "ve" es el árbol que devuelves. En ambos casos, el componente `App` devuelve un `<div>` con `<Counter />` como primer hijo. Por eso React los considera como _el mismo_ `<Counter />`.

Puedes pensar que tienen la misma "dirección": el primer hijo del primer hijo de la raíz. Así es como React los hace coincidir entre los renderizados anteriores y los siguientes, independientemente de cómo estructures tu lógica.

</Pitfall>

## Diferentes componentes en la misma posición reinician el estado {/*different-components-at-the-same-position-reset-state*/}

En este ejemplo, al marcar la casilla de verificación se sustituirá `<Counter>` por un `<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Aquí se cambia entre _diferentes_ tipos de componentes en la misma posición.  Inicialmente, el primer hijo del `<div>` contenía un `Counter`. Pero cuando lo cambiaste por un `p`, React eliminó el `Counter` del árbol de la UI y destruyó su estado.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagrama con tres secciones, con una flecha de transición entre cada sección. La primera sección contiene un componente React etiquetado 'div' con un único hijo etiquetado 'Counter' que contiene una burbuja de estado etiquetada 'count' con valor 3. La sección del medio tiene el mismo padre 'div', pero el componente hijo ha sido eliminado, indicado por una imagen amarilla '¡puf!'. La tercera sección tiene el mismo padre 'div', pero con un nuevo hijo llamado 'p', resaltado en amarillo.">

Cuando `Counter` cambia a `p`, se borra el `Counter` y se añade `p`

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagrama con tres secciones, con una flecha de transición entre cada sección. La primera sección contiene un componente de React etiquetado como 'p'. La sección del medio tiene el mismo padre 'div', pero el componente hijo ha sido eliminado, indicado por una imagen amarilla '¡puf!'. La tercera sección tiene el mismo padre 'div' de nuevo, ahora con un nuevo hijo etiquetado 'Counter' que contiene una burbuja de estado etiquetada 'count' con valor 0, resaltada en amarillo.">

Al volver a cambiar, se borra `p` y se añade el `Counter`.

</Diagram>

</DiagramGroup>

Además, **cuando se renderiza un componente diferente en la misma posición, se reinicia el estado de todo su subárbol.** Para ver cómo funciona, incrementa el contador y luego marca la casilla:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

El estado del contador se restablece cuando se hace clic en la casilla de verificación. Aunque se renderiza un `Counter`, el primer hijo del `div` cambia de `div` a `section`. Cuando el `div` hijo se eliminó del DOM, todo el árbol debajo de él (incluyendo el `Counter` y su estado) se destruyó también.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagrama con tres secciones, con una flecha de transición entre cada sección. La primera sección contiene un componente de React etiquetado 'div' con un único hijo etiquetado 'section', que tiene un único hijo etiquetado 'Counter' que contiene una burbuja de estado etiquetada 'count' con valor 3. La sección del medio tiene el mismo padre 'div', pero los componentes hijos se han eliminado, lo que se indica con una imagen amarilla '¡puf!'. La tercera sección tiene el mismo padre 'div', ahora con un nuevo hijo llamado 'div', resaltado en amarillo, también con un nuevo hijo llamado 'Counter' que contiene una burbuja de estado llamada 'count' con valor 0, todo resaltado en amarillo.">

Cuando `section` cambia a `div`, se elimina la `section` y se añade el nuevo `div`

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagrama con tres secciones, con una flecha de transición entre cada sección. La primera sección contiene un componente de React etiquetado 'div' con un único hijo etiquetado 'div', que tiene un único hijo etiquetado 'Counter' que contiene una burbuja de estado etiquetada 'count' con valor 0. La sección del medio tiene el mismo padre 'div', pero los componentes hijos se han eliminado, lo que se indica con una imagen amarilla '¡puf!'. La tercera sección tiene el mismo padre 'div', ahora con un nuevo hijo llamado 'section', resaltado en amarillo, también con un nuevo hijo llamado 'Counter' que contiene una burbuja de estado llamada 'count' con valor 0, todo resaltado en amarillo.">

Al volver a cambiar, se elimina el `div` y se añade la nueva `section`.

</Diagram>

</DiagramGroup>

Como regla general, **si quieres preservar el estado entre rerenderizados, la estructura de tu árbol necesita "coincidir"** de un render a otro. Si la estructura es diferente, el estado se destruye porque React destruye el estado cuando elimina un componente del árbol.

<Pitfall>

Es por este motivo que no se deben anidar las definiciones de las funciones de los componentes.

Aquí, la función del componente `MyTextField` se define *dentro* de `MyComponent`:

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


Cada vez que se hace clic en el botón, el estado de la entrada desaparece. Esto se debe a que se crea una función *diferente* de `MyTextField` para cada renderizado de `MyComponent`. Estás renderizando un componente *diferente* en la misma posición, por lo que React reinicia todo el estado que esté anidado por debajo. Esto conlleva a errores y problemas de rendimiento. Para evitar este problema, **declara siempre las funciones del componente en el nivel superior, y no anides sus definiciones.**

</Pitfall>

## Reiniciar el estado en la misma posición {/*resetting-state-at-the-same-position*/}

Por defecto, React preserva el estado de un componente mientras permanece en la misma posición. Normalmente, esto es exactamente lo que quieres, así que tiene sentido como comportamiento por defecto. Pero a veces, es posible que quieras reiniciar el estado de un componente. Considera esta aplicación que permite a dos jugadores llevar la cuenta de sus puntuaciones durante cada turno:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Actualmente, cuando se cambia de jugador, la puntuación se conserva. Los dos `Counter` aparecen en la misma posición, por lo que React los ve como *el mismo* `Counter` cuya prop `person` ha cambiado.

Pero conceptualmente, en esta aplicación deberían ser dos contadores separados. Podrían aparecer en el mismo lugar en la UI, pero uno es un contador para Taylor, y otro es un contador para Sarah.

Hay dos maneras de restablecer el estado al cambiar entre ellos:

1. Renderizar los componentes en diferentes posiciones
2. Dar a cada componente una identidad explícita con `key`.


### Opción 1: Renderizar un componente en diferentes posiciones {/*option-1-rendering-a-component-in-different-positions*/}

Si quieres que estos dos `Counter` sean independientes, puedes representarlos en dos posiciones diferentes:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Inicialmente, `isPlayerA` es `true`. Así que la primera posición contiene el estado `Counter`, y la segunda está vacía.
* Cuando haces clic en el botón "Next player", la primera posición se borra, pero la segunda contiene ahora un 'Counter'.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagrama con un árbol de componentes React. El padre está etiquetado como ’Scoreboard' con una burbuja de estado etiquetada como isPlayerA con valor 'true'. El único hijo, dispuesto a la izquierda, se llama Counter con una burbuja de estado llamada 'count' y valor 0. Todo el hijo de la izquierda está resaltado en amarillo, indicando que fue añadido.">

Estado inicial

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagrama con un árbol de componentes de React. El padre está etiquetado como 'Marcador' con una burbuja de estado etiquetada como isPlayerA con valor 'false'. La burbuja de estado está resaltada en amarillo, indicando que ha cambiado. El hijo de la izquierda es reemplazado por una imagen amarilla '¡puf!' que indica que ha sido eliminado y hay un nuevo hijo a la derecha, resaltado en amarillo indicando que fue agregado. El nuevo hijo se denomina 'Counter' y contiene una burbuja de estado denominada 'count' con valor 0.">

Pulsando "next"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagrama con un árbol de componentes React. El padre está etiquetado como 'Scoreboard' con una burbuja de estado etiquetada como isPlayerA con valor 'true'. La burbuja de estado está resaltada en amarillo, indicando que ha cambiado. Hay un nuevo hijo a la izquierda, resaltado en amarillo indicando que se ha añadido. El nuevo hijo se llama 'Counter' y contiene una burbuja de estado llamada 'count' con valor 0. El hijo de la derecha es reemplazado por una imagen amarilla '¡puf!' que indica que ha sido eliminado.">

Pulsando "next" de nuevo

</Diagram>

</DiagramGroup>

> El estado de cada `Counter` se destruye cada vez que se elimina del DOM. Por eso se reinician cada vez que se hace clic en el botón.

Esta solución es conveniente cuando sólo tienes unos pocos componentes independientes renderizados en el mismo lugar. En este ejemplo, sólo tienes dos, por lo que no es una molestia renderizar ambos por separado en el JSX.

### Option 2: Opción 2: Restablecer el estado con _key_ {/*option-2-resetting-state-with-a-key*/}

También hay otra forma, más genérica, de restablecer el estado de un componente.

Es posible que hayas visto _`key`_ al [renderizar listas.](/learn/rendering-lists#keeping-list-items-in-order-with-key) Las _keys_ no son sólo para las listas. Puedes usar _keys_ para que React distinga entre cualquier componente. Por defecto, React utiliza el orden dentro del padre ("primer contador", "segundo contador") para discernir entre los componentes. Pero las _keys_ te permiten decirle a React que no es sólo un *primer* contador, o un *segundo* contador, sino un contador específico; por ejemplo, el contador de *Taylor*. De esta manera, React conocerá el contador de *Taylor* dondequiera que aparezca en el árbol!

En este ejemplo, los dos `<Counter />` no comparten estado aunque aparezcan en el mismo lugar en JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

El cambio entre Taylor y Sarah no conserva el estado. Esto se debe a que **le asignaste diferentes `key`s:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Especificar una _`key`_ le dice a React que use la propia _`key`_ como parte de la posición, en lugar de su orden dentro del padre. Por eso, aunque los renderices en el mismo lugar en JSX, desde la perspectiva de React, son dos contadores diferentes. Como resultado, nunca compartirán estado. Cada vez que un contador aparece en la pantalla, su estado se crea. Cada vez que se elimina, su estado se destruye. Alternar entre ellos reinicia su estado una y otra vez.

<Note>

> Recuerda que las _keys_ no son únicas globalmente. Sólo especifican la posición *dentro del padre*.

</Note>

### Restablecer un formulario con una _key_ {/*resetting-a-form-with-a-key*/}

Restablecer el estado con una _key_ es especialmente útil cuando se trata de formularios.

En esta aplicación de chat, el componente `<Chat>` contiene el estado del cuadro de texto:

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Prueba a introducir algo en el cuadro de texto y luego pulsa "Alice" o "Bob" para elegir un destinatario diferente. Notarás que el estado del cuadro de texto se conserva porque el `<Chat>` se renderiza en la misma posición en el árbol.

**En muchas aplicaciones, este puede ser el comportamiento deseado, pero no en una aplicación de chat!**. No quieres que el usuario envíe un mensaje que ya ha escrito a una persona equivocada debido a un clic accidental. Para solucionarlo, añade una `key`:

```js
<Chat key={to.id} contact={to} />
```

Esto asegura que cuando selecciones un destinatario diferente, el componente `Chat` se recreará desde cero, incluyendo cualquier estado en el árbol que esté por debajo. React también recreará los elementos del DOM en lugar de reutilizarlos.

Ahora al cambiar de destinatario siempre se borra el campo de texto:

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### Preserving state for removed components {/*preserving-state-for-removed-components*/}

En una aplicación de chat real, probablemente querrás recuperar el estado de la entrada cuando el usuario vuelva a seleccionar el destinatario anterior. Hay algunas maneras de mantener el estado "vivo" para un componente que ya no es visible:

- Podrías mostrar _todos_ los chats en lugar de sólo el actual, pero ocultar todos los demás con CSS. Los chats no se eliminarían del árbol, por lo que su estado local se conservaría. Esta solución funciona muy bien para UIs simples. Pero puede ser muy lenta si los árboles ocultos son grandes y contienen muchos nodos DOM.
- Podrías [subir el estado](/learn/sharing-state-between-components) y mantener el mensaje pendiente para cada destinatario en el componente padre. De esta manera, cuando los componentes hijos se eliminan, no importa, porque es el padre el que mantiene la información importante. Esta es la solución más común.
También podrías utilizar una fuente diferente además del estado de React. Por ejemplo, probablemente quieras que el borrador de un mensaje persista incluso si el usuario cierra accidentalmente la página. Para implementar esto, podrías hacer que el componente `Chat` inicialice su estado leyendo de [`localStorage`](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage) y guardar los borradores allí también.

Independientemente de la estrategia que elijas, un chat _con Alice_ es conceptualmente distinto de un chat _con Bob_, por lo que tiene sentido dar una _`key`_ al árbol `<Chat>` basado en el destinatario actual.

</DeepDive>

<Recap>

- React mantiene el estado mientras el mismo componente se renderice en la misma posición.
- El estado no se mantiene en las etiquetas JSX. Se asocia a la posición del árbol en la que se coloca ese JSX.
- Puedes forzar a un subárbol a restablecer su estado dándole una _key_ diferente.
- No anides las definiciones de los componentes, o restablecerás el estado por accidente.

</Recap>



<Challenges>

#### Corregir la desaparición del texto de entrada {/*fix-disappearing-input-text*/}

Este ejemplo muestra un mensaje cuando se pulsa el botón. Sin embargo, al pulsar el botón también se reinicia accidentalmente la entrada. ¿Por qué ocurre esto? Arréglalo para que al pulsar el botón no se restablezca el texto de entrada.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

El problema es que `Form` se renderiza en diferentes posiciones. En la rama `if`, es el segundo hijo del `<div>`, pero en la rama `else`, es el primer hijo. Por lo tanto, el tipo de componente en cada posición cambia. La primera posición cambia entre tener un `p` y un `Form`, mientras que la segunda posición cambia entre tener un `Form` y un `button`. React restablece el estado cada vez que cambia el tipo de componente.

La solución más sencilla es unificar las ramas para que `Form` se renderice siempre en la misma posición:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Técnicamente, también podría añadir `null` antes de `<Form />` en la rama `else` para que coincida con la estructura de la rama `if`:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

De esta manera, `Form` es siempre el segundo hijo, por lo que permanece en la misma posición y mantiene su estado. Pero este enfoque es mucho menos obvio e introduce el riesgo de que alguien más elimine ese `null`.

</Solution>

#### Intercambiar dos campos de formulario {/*swap-two-form-fields*/}

Este formulario permite introducir el nombre y los apellidos. También tiene una casilla de verificación que controla qué campo va primero. Si marca la casilla, el campo "Last name" aparecerá antes que el campo "First name".

Casi funciona, pero hay un error. Si rellenas la entrada "First name" y marcas la casilla, el texto se queda en la primera entrada (que ahora es "Last name"). Arréglalo para que el texto de la entrada *también* se mueva cuando inviertas el orden.

<Hint>

Parece que para estos campos, su posición dentro del padre no es suficiente. ¿Hay alguna manera de decirle a React cómo hacer coincidir el estado entre los rerenderizados?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Da una _`key`_ a ambos componentes `<Field>` en ambas ramas `if` y `else`. Esto le dice a React cómo "emparejar" el estado correcto para cualquiera de los dos `<Field>` incluso si su orden dentro del padre cambia:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Restablecer un formulario detallado {/*reset-a-detail-form*/}

Esta es una lista de contactos editable. Puedes editar los datos del contacto seleccionado y luego pulsar "Save" para actualizarlo, o "Reset" para deshacer los cambios.

Cuando seleccionas un contacto diferente (por ejemplo, Alicia), el estado se actualiza pero el formulario sigue mostrando los detalles del contacto anterior. Arréglalo para que el formulario se restablezca cuando cambie el contacto seleccionado.

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Proporciona una `key={selectedId}` al componente `EditContact`. De esta manera, al cambiar entre diferentes contactos se restablecerá el formulario:

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Borrar una imagen mientras se carga {/*clear-an-image-while-its-loading*/}

Al pulsar "Next", el navegador comienza a cargar la siguiente imagen.  Sin embargo, como se muestra en la misma etiqueta `<img>`, por defecto se seguiría viendo la imagen anterior hasta que se cargue la siguiente. Esto puede ser indeseable si es importante que el texto coincida siempre con la imagen. Cámbialo para que en el momento en que pulses "Next", la imagen anterior se borre inmediatamente.

<Hint>

¿Hay alguna manera de decirle a React que vuelva a crear el DOM en lugar de reutilizarlo?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Puede proporcionar una _`key`_ a la etiqueta `<img>`. Cuando esa _`key`_ cambie, React volverá a crear el nodo DOM `<img>` desde cero. Esto provoca un breve destello cuando se carga cada imagen, por lo que no es algo que quieras hacer para cada imagen de tu aplicación. Pero tiene sentido si quieres asegurarte de que la imagen siempre coincide con el texto.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Arreglar un estado mal colocado en la lista {/*fix-misplaced-state-in-the-list*/}

En esta lista, cada `Contact` tiene un estado que determina si se ha pulsado "Show email" para él. Pulsa "Show email" para Alice, y luego marca la casilla "Show in reverse order". Notarás que ahora es el correo electrónico de _Taylor_ el que está expandido, pero el de Alice --que se ha movido a la parte inferior-- aparece colapsado.

Arréglalo para que el estado expandido se asocie a cada contacto, independientemente del orden elegido.

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

El problema es que este ejemplo utilizaba el índice como `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Sin embargo,  queremos que el estado se asocie a _cada contacto en particular_.

Si se utiliza el ID del contacto como _`key`_ se soluciona el problema:

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

El estado está asociado a la posición del árbol. Una _`key`_ permite especificar una posición con nombre en lugar de depender del orden.

</Solution>

</Challenges>
