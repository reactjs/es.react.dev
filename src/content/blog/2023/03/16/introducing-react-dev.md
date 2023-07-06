---
title: "Presentación de react.dev"
---

16 de Marzo de 2023 por [Dan Abramov](https://twitter.com/dan_abramov) y [Rachel Nabors](https://twitter.com/rachelnabors)

---

<Intro>

Hoy estamos encantados de lanzar [react.dev](https://react.dev), el nuevo hogar de React y su documentación. En esta publicación, nos gustaría mostrarte el nuevo sitio.

</Intro>

---

## tl;dr {/*tldr*/}

* El nuevo sitio de React ([react.dev](https://react.dev)) enseña React moderno con componentes de función y Hooks.
* Hemos incluido diagramas, ilustraciones, desafíos y más de 600 nuevos ejemplos interactivos.
* El antiguo sitio de documentación de React se ha trasladado a [legacy.reactjs.org](https://legacy.reactjs.org).

## Nuevo sitio, nuevo dominio, nueva página de inicio {/*new-site-new-domain-new-homepage*/}

Primero, un poco de organización.

Para celebrar el lanzamiento de la nueva documentación y, lo que es más importante, para separar claramente el contenido antiguo del nuevo, nos hemos mudado al dominio más corto [react.dev](https://react.dev). El antiguo dominio [reactjs.org](https://reactjs.org) ahora redireccionará aquí.

La antigua documentación de React ahora se encuentra archivada en [legacy.reactjs.org](https://legacy.reactjs.org). Todos los enlaces existentes al contenido antiguo se redirigirán automáticamente allí para evitar "romper la web", pero el sitio antiguo no recibirá muchas más actualizaciones.

Lo creas o no, React pronto cumplirá diez años. ¡En años de JavaScript, es como todo un siglo! Hemos actualizado [la página de inicio de React](https://react.dev) para reflejar por qué creemos que React es una excelente manera de crear interfaces de usuario en la actualidad, y hemos actualizado las guías de inicio para mencionar de manera más prominente los frameworks modernos basados en React.

¡Si aún no has visto la nueva página de inicio, échale un vistazo!

## Compromiso total con React moderno y Hooks {/*going-all-in-on-modern-react-with-hooks*/}

Cuando lanzamos React Hooks en 2018, la documentación de Hooks asumía que el lector estaba familiarizado con los componentes de clase. Esto ayudó a la comunidad a adoptar Hooks rápidamente, pero después de un tiempo, los viejos documentos dejaron de ser útiles para los nuevos lectores. Los nuevos lectores tenían que aprender React dos veces: una vez con componentes de clase y luego nuevamente con Hooks.

**Los nuevos documentos enseñan React con Hooks desde el principio.**  Los documentos se dividen en dos secciones principales:

* **[Aprende React](/learn)** es un curso autodidacta que enseña React desde cero.
* **[Referencia de la API](/reference)** proporciona los detalles y ejemplos de uso de cada API de React.

Veamos más de cerca qué puedes encontrar en cada sección.

<Note>

Todavía hay algunos casos raros de uso de componentes de clase que aún no tienen un equivalente basado en Hooks. Los componentes de clase siguen siendo compatibles y se documentan en la sección de [APIs heredadas de React](/reference/react/legacy) del nuevo sitio.

</Note>

## Inicio rápido {/*quick-start*/}

La sección de Aprendizaje comienza con la página de [Inicio rápido](/learn). Es un breve recorrido introductorio de React. Presenta la sintaxis de conceptos como componentes, props y estado, pero no se adentra en muchos detalles sobre cómo utilizarlos.

Si te gusta aprender haciendo, te recomendamos que consultes el [tutorial de Tic-Tac-Toe](/learn/tutorial-tic-tac-toe) a continuación. Te guiará en la construcción de un pequeño juego con React, al mismo tiempo que te enseña las habilidades que utilizarás a diario. Esto es lo que construirás:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Ganador: ' + winner;
  } else {
    status = 'Próximo jugador: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir a la movida #' + move;
    } else {
      description = 'Ir al inicio del juego';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

También nos gustaría destacar [Pensar en React](/learn/thinking-in-react), ese tutorial que hizo que React "hiciera clic" para muchos de nosotros. **Hemos actualizado ambos tutoriales clásicos para utilizar componentes de función y Hooks,** por lo que están como nuevos.

<Note>

El ejemplo anterior es un *sandbox*. ¡Hemos agregado muchos sandboxes, más de 600, por todas partes en el sitio! Puedes editar cualquier sandbox o presionar "Bifurcar" en la esquina superior derecha para abrirlo en una pestaña separada. Los sandboxes te permiten jugar rápidamente con las APIs de React, explorar tus ideas y comprobar tu comprensión.

</Note>

## Aprende React paso a paso {/*learn-react-step-by-step*/}

Nos gustaría que todas las personas del mundo tengan la misma oportunidad de aprender React de forma gratuita por sí mismas.

Por eso, la sección de Aprender está organizada como un curso autodidacta dividido en capítulos. Los dos primeros capítulos describen los fundamentos de React. Si eres nuevo en React o quieres refrescar tu memoria, comienza aquí:

- **[Describir la UI](/learn/describing-the-ui)** enseña cómo mostrar información con componentes.
- **[Agregar interactividad](/learn/adding-interactivity)** enseña cómo actualizar la pantalla en respuesta a la entrada del usuario.

Los dos siguientes capítulos son más avanzados y te darán una comprensión más profunda de las partes más difíciles:

- **[Gestión del estado](/learn/managing-state)** enseña cómo organizar tu lógica a medida que tu aplicación crece en complejidad.
- **[Puertas de escape](/learn/escape-hatches)** enseña cómo "salir" de React y cuándo tiene más sentido hacerlo.

Cada capítulo consta de varias páginas relacionadas. La mayoría de estas páginas enseñan una habilidad o técnica específica, como [Escribir marcado con JSX](/learn/writing-markup-with-jsx), [Actualizar objetos en el estado](/learn/updating-objects-in-state), o [Compartir estado entre componentes](/learn/sharing-state-between-components).  Algunas páginas se centran en explicar una idea, como [Renderizado y confirmación](/learn/render-and-commit), o [El estado como una instantánea](/learn/state-as-a-snapshot). Y hay algunas pocas, como [Es posible que no necesites un Effect](/learn/you-might-not-need-an-effect),  que comparten nuestras sugerencias basadas en lo que hemos aprendido a lo largo de estos años.

No es necesario leer estos capítulos en secuencia. ¡¿Quién tiene tiempo para eso?! Pero podrías hacerlo. Las páginas de la sección de Aprender solo se basan en conceptos introducidos por las páginas anteriores. Si quieres leerlo como un libro, ¡adelante!

### Verifica tu comprensión con desafíos {/*check-your-understanding-with-challenges*/}

La mayoría de las páginas de la sección de Aprender terminan con algunos desafíos para verificar tu comprensión. Por ejemplo, aquí tienes algunos desafíos de la página sobre [Renderizado Condicional](/learn/conditional-rendering#challenges).

¡No tienes que resolverlos ahora mismo! A menos que *realmente* quieras hacerlo.

<Challenges noTitle={true}>

#### Mostrar un ícono para elementos incompletos con `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Utiliza el operador condicional (`cond ? a : b`) para renderizar una ❌ si `isPacked` no es `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial" 
        />
        <Item 
          isPacked={true} 
          name="Casco con una hoja dorada" 
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial" 
        />
        <Item 
          isPacked={true} 
          name="Casco con una hoja dorada" 
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Mostrar la importancia del elemento con `&&` {/*show-the-item-importance-with-*/}

En este ejemplo, cada `elemento` recibe una prop de `importancia` numérica. Usa el operador `&&` para renderizar "_(Importancia: X)_" en cursiva, pero sólo para los elementos que tienen una importancia distinta de cero. Tu lista de elementos debería lucier así:

* Traje espacial _(Importancia: 9)_
* Casco con una hoja dorada
* Foto de Tam _(Importancia: 6)_

¡No olvides agregar un espacio entre las dos etiquetas!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Traje espacial" 
        />
        <Item 
          importance={0} 
          name="Casco con una hoja dorada" 
        />
        <Item 
          importance={6} 
          name="Foto de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Esto debería funcionar:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Traje espacial" 
        />
        <Item 
          importance={0} 
          name="Casco con una hoja dorada" 
        />
        <Item 
          importance={6} 
          name="Foto de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Ten en cuenta que debes escribir  `importance > 0 && ...` en lugar de `importance && ...` para que si `importance` es `0`, `0` no sea mostrado como el resultado.

En esta solución, se utilizan dos condiciones separadas para insertar un espacio entre el nombre y la etiqueta de importancia. Alternativamente, podrías usar un fragmento con un espacio inicial: `importance > 0 && <> <i>...</i></>` o agregar un espacio inmediatamente dentro de `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

</Challenges>

Observa el botón "Mostrar solución" en la esquina inferior izquierda. Es útil si quieres comprobar por ti mismo/a.

### Desarrolla una intuición con diagramas e ilustraciones {/*build-an-intuition-with-diagrams-and-illustrations*/}

Cuando no pudimos descubrir cómo explicar algo solo con código y palabras, hemos agregado diagramas que ayudan a proporcionar cierta intuición. Por ejemplo, aquí hay uno de los diagramas de [Conservar y reiniciar el estado](/learn/preserving-and-resetting-state):

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagrama con tres secciones, con una flecha que transiciona entre cada sección. La primera sección contiene un componente de React etiquetado como 'div' con un único hijo etiquetado como 'section', el cual tiene un único hijo etiquetado como 'Counter' que contiene una burbuja de estado etiquetada como 'count' con un valor de 3. En la sección del medio, el mismo componente 'div' padre se encuentra presente, pero los componentes hijos han sido eliminados, indicado por una imagen de 'prueba' amarilla. La tercera sección tiene nuevamente el mismo componente 'div' padre, ahora con un nuevo hijo etiquetado como 'div', resaltado en amarillo, y también con un nuevo hijo etiquetado como 'Counter' que contiene una burbuja de estado etiquetada como 'count' con un valor de 0, todos ellos resaltados en amarillo.">

Cuando `section` cambia a `div`, `section` es eliminada y el nuevo `div` is añadido.

</Diagram>

También encontrarás algunas ilustraciones a lo largo de la documentación (aquí tienes una de ellas que muestra al [navegador pintando la pantalla](/learn/render-and-commit#epilogue-browser-paint)):

<Illustration alt="Un navegador pintando un bodegón con un elemento card'." src="/images/docs/illustrations/i_browser-paint.png" />

Hemos confirmado con los proveedores de navegadores que esta representación es 100% científicamente precisa.

## Una nueva y detallada Referencia de la API {/*a-new-detailed-api-reference*/}

En la [Referencia de la API](/reference/react), cada API de React ahora tiene una página dedicada. Esto incluye todo tipo de APIs:

- Hooks incorporados como [`useState`](/reference/react/useState).
- Componentes incorporados como [`<Suspense>`](/reference/react/Suspense).
- Componentes de navegadores incorporados como [`<input>`](/reference/react-dom/components/input).
- APIs orientadas al framework como [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream).
- Otras APIs de React como [`memo`](/reference/react/memo).

Observarás que cada página de API se divide en al menos dos segmentos: *Referencia* y *Uso*.

[Referencia](/reference/react/useState#reference) describe la firma formal de la API al listar sus argumentos y valores de retorno. Es concisa, pero puede sentirse un poco abstracta si no estás familiarizado con esa API. Describe qué hace una API, pero no cómo utilizarla.

[Uso](/reference/react/useState#usage) muestra por qué y cómo utilizarías esta API en la práctica, como podría explicarlo un colega o un amigo. Muestra los **escenarios canónicos de cómo el equipo de React pretendía que se utilizara cada API.** Hemos añadido fragmentos de código con colores, ejemplos de cómo usar diferentes APIs juntas y recetas que puedes copiar y pegar:

<Recipes titleText="Ejemplos básicos de useState" titleId="examples-basic">

#### Contador (número) {/*counter-number*/}

En este ejemplo, la variable de estado `count` almacena un número. Al hacer clic en el botón, se incrementa.

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
      Me presionaste {count} veces
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Campo de texto (string) {/*text-field-string*/}

En este ejemplo, la variables de estado `text` almacena un string. Cuando escribes, la función `handleChange` lee el último valor de entrada del elemento DOM de entrada del navegador y llama a `setText` para actualizar el estado. Esto te permite mostrar al `text` actual debajo.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>Escribiste: {text}</p>
      <button onClick={() => setText('hello')}>
        Restablecer
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (boolean) {/*checkbox-boolean*/}

En este ejemplo, la variable de estado `liked` almacena un booleano. Cuando haces click en el input, `setLiked` actualiza la variable de estado `liked` dependiendo si el checkbox está marcado o no. La variable `liked` se utiliza para mostrar el texto debajo del checkbox.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        Me gustó esto
      </label>
      <p>{liked ? 'Te gustó' : 'No te gustó'} esto.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Form (dos variables) {/*form-two-variables*/}

Puedes declarar más de una variable de estado en el mismo componente. Cada variable de estado es completamente independiente.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Incrementar edad
      </button>
      <p>Hola, {name}. Tienes {age} años.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

Algunas páginas de la API también incluyen [solución de problemas](/reference/react/useEffect#troubleshooting) (para problemas comunes) y [Alternativas](/reference/react-dom/findDOMNode#alternatives) (para APIs obsoletas).

Esperamos que este enfoque haga que la referencia de la API sea útil no solo como una forma de buscar un argumento, sino también como una forma de ver todas las cosas diferentes que se pueden hacer con cualquier API y cómo se conecta con las demás.

## ¿Qué sigue? {/*whats-next*/}

¡Eso es todo para nuestro pequeño recorrido! Echa un vistazo al nuevo sitio web, mira lo que te gusta o no te gusta, y sigue enviando tus comentarios en la [encuesta anónima](https://www.surveymonkey.co.uk/r/PYRPF3X) o en nuestro [rastreador de problemas](https://github.com/reactjs/reactjs.org/issues).

Reconocemos que este proyecto ha tardado mucho en lanzarse. Queríamos mantener un alto nivel de calidad que la comunidad de React se merece. Mientras escribíamos estos documentos y creamos todos los ejemplos, encontramos errores en algunas de nuestras propias explicaciones, fallos en React e incluso lagunas en el diseño de React que ahora estamos trabajando para solucionar. Esperamos que la nueva documentación nos ayude a mantener un estándar más alto para React en el futuro.

Hemos escuchado muchas de sus solicitudes para ampliar el contenido y la funcionalidad del sitio web, por ejemplo:

- Proporcionar una versión de TypeScript para todos los ejemplos;
- Crear las guías actualizadas de rendimiento, pruebas y accesibilidad;
- Documentar los Componentes del Servidor de React de forma independiente de los frameworks que los admiten;
- Trabajar con nuestra comunidad internacional para traducir los nuevos documentos;
- Agregar características faltantes al nuevo sitio web (por ejemplo, RSS para este blog).

Ahora que [react.dev](https://react.dev/) está disponible, podremos cambiar nuestro enfoque de "ponernos al día" con los recursos educativos de terceros de React a agregar nueva información y mejorar aún más nuestro nuevo sitio web. 

Creemos que nunca ha habido un mejor momento para aprender React.

## ¿Quiénes trabajaron en esto? {/*who-worked-on-this*/}

En el equipo de React, [Rachel Nabors](https://twitter.com/rachelnabors/)  lideró el proyecto (y proporcionó las ilustraciones), y [Dan Abramov](https://twitter.com/dan_abramov) diseñó el plan de estudios. Ambos coautoraron la mayor parte del contenido juntos también.

Por supuesto, ningún proyecto tan grande se realiza en aislamiento. ¡Tenemos muchas personas a quienes agradecer!

[Sylwia Vargas](https://twitter.com/SylwiaVargas)  renovó nuestros ejemplos para ir más allá de "foo/bar/baz" y gatitos, y presentar científicos, artistas y ciudades de todo el mundo. [Maggie Appleton](https://twitter.com/Mappletons) convirtió nuestros garabatos en un sistema de diagramas claro.

Gracias a [David McCabe](https://twitter.com/mcc_abe), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), and [Matt Carroll](https://twitter.com/mattcarrollcode) por las contribuciones adicionales. También nos gustaría agradecer a [Natalia Tepluhina](https://twitter.com/n_tepluhina) y a [Sebastian Markbåge](https://twitter.com/sebmarkbage) por sus ideas y comentarios.

Gracias a [Dan Lebowitz](https://twitter.com/lebo) por el diseño del sitio y a [Razvan Gradinar](https://dribbble.com/GradinarRazvan) por el diseño de sandbox.

En el ámbito del desarrollo, gracias a [Jared Palmer](https://twitter.com/jaredpalmer) por el desarrollo del prototipo. Gracias a  [Dane Grant](https://twitter.com/danecando) y a [Dustin Goodman](https://twitter.com/dustinsgoodman) de [ThisDotLabs](https://www.thisdot.co/) por su apoyo en el desarrollo de la interfaz de usuario. Gracias a [Ives van Hoorne](https://twitter.com/CompuIves), [Alex Moldovan](https://twitter.com/alexnmoldovan), [Jasper De Moor](https://twitter.com/JasperDeMoor), y a [Danilo Woznica](https://twitter.com/danilowoz) de [CodeSandbox](https://codesandbox.io/) por su trabajo en la integración del sandbox. Gracias a [Rick Hanlon](https://twitter.com/rickhanlonii) por el desarrollo y trabajo de diseño,  puliendo nuestros colores y detalles más finos. Gracias a [Harish Kumar](https://www.strek.in/) y [Luna Ruan](https://twitter.com/lunaruan) por agregar nuevas características al sitio y ayudar a mantenerlo.

Un enorme agradecimiento a todas las personas que se ofrecieron voluntariamente para participar en el programa de pruebas alfa y beta. Su entusiasmo y valiosos comentarios nos ayudaron a dar forma a estos documentos. Un agradecimiento especial a nuestra probadora beta, [Debbie O'Brien](https://twitter.com/debs_obrien), quien dio una charla sobre su experiencia utilizando los documentos de React en React Conf 2021.

Por último, gracias a la comunidad de React por ser la inspiración detrás de este esfuerzo. Ustedes son la razón por la que hacemos esto, y esperamos que los nuevos documentos les ayuden a utilizar React para construir cualquier interfaz de usuario que deseen.
