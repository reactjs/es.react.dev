---
id: tutorial
title: "Tutorial: Introducción a React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

Este tutorial no asume ningún conocimiento previo sobre React.

## Antes de empezar el tutorial {#before-we-start-the-tutorial}

Vamos a construir un pequeño juego durante este tutorial. **Deberás estar tentado a obviarlo porque tú no estás construyendo juegos en el día a día, pero dale una oportunidad.** Las técnicas que aprenderás en el tutorial son fundamentales para construir cualquier aplicación de React, y dominarlo te dará un entendimiento profundo de React.

>Tip
>
>Este tutorial está diseñado para personas que prefieren **aprender haciendo**. Si tu prefieres aprender los conceptos desde el principio, revisa nuestra [guía paso a paso](/docs/hello-world.html). Podrías encontrar este tutorial y la guía, complementarias entre sí.

Este tutorial está dividido en varias secciones:

* [Configuración para el tutorial](#setup-for-the-tutorial) te dará un punto de partida para seguir el tutorial.
* [Visión general](#overview) te enseñará **los fundamentos** de React: componentes, props y estado.
* [Completando el juego](#completing-the-game) te enseñará **las técnicas más comunes** en desarrollo de React.
* [Agregando viaje en el tiempo](#adding-time-travel) te dará una **visión más profunda** de las fortalezas únicas de React.

No tienes que completar todas las secciones a la vez para obtener el valor de este tutorial. Prueba llegar tan lejos como puedas, incluso si es una o dos secciones.

### ¿Qué estamos construyendo? {#what-are-we-building}

En este tutorial, te mostraremos cómo construir un juego de tic-tac-toe interactivo con React.

Puedes ver lo que construiremos aquí: **[Resultado Final](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Si el código no te hace sentido, o si no estás familiarizado con la sintaxis de código, ¡no te preocupes! El objetivo de este tutorial es ayudarte a entender React y su sintaxis.

Recomendamos que revises el juego de tic-tac-toe antes de continuar con el tutorial. Una de las características que notarás es que hay una lista enumerada a la derecha del tablero del jugador. Esta lista da una historia de todos los movimientos que han ocurrido en el juego, y se va actualizando conforme el juego progresa.

Puedes cerrar el juego de tic-tac-toe una vez que te familiarizaste con él. Empezaremos desde una plantilla más simple en este tutorial. Nuestro siguiente paso es configurarlo de tal forma que puedas empezar a construir el juego.

### Prerrequisitos {#prerequisites}

Asumimos que tienes cierta familiaridad con HTML y JavaScript, pero deberías ser capaz de seguir adelante incluso si vienes de un lenguaje de programación diferente. También suponemos que estás familiarizado con conceptos de programación como funciones, objetos, arrays, y en menor medida, clases.

Si necesitas revisar JavaScript, te recomendamos leer [esta guía](https://developer.mozilla.org/es/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Ten en cuenta que también usamos algunas características de ES6, una versión reciente de JavaScript. En este tutorial, estamos usando [funciones flecha](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [clases](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes), sentencias [`let`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/let) y [`const`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/const). Puedes usar el [Babel REPL](babel://es5-syntax-example) para revisar a qué código compila ES6.

## Configuración para el tutorial {#setup-for-the-tutorial}

Hay dos maneras de completar este tutorial: puedes escribir el código en tu navegador, o puedes configurar tu entorno de desarrollo local en tu computador.

### Opción de configuración 1: Escribe código en el navegador {#setup-option-1-write-code-in-the-browser}

¡Esta es la forma más rápida de empezar!

Primero, abre este **[código inicial](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** en una nueva pestaña. La nueva pestaña deberá mostrar un tablero vacío del juego de tic-tac-toe y código de React. Estaremos editando el código de React en este tutorial.

Ahora puedes saltarte a la segunda opción de configuración o ir a la sección de [visión general](#overview) para obtener una idea general de React.

### Opción de configuración 2: Entorno de desarrollo local {#setup-option-2-local-development-environment}

¡Esta es completamente opcional y no es requerida para este tutorial!

<br>

<details>

<summary><b>Opcional: Instrucciones para seguir adelante localmente usando tu editor de texto preferido</b></summary>

Esta configuración requiere más trabajo pero te permite completar el tutorial usando un editor de tu elección. Aquí los pasos a seguir:

1. Asegúrate de tener una versión reciente de [Node.js](https://nodejs.org/en/) instalada.
2. Sigue las [instrucciones de instalación de Create React App](/docs/create-a-new-react-app.html#create-react-app) para hacer un nuevo proyecto.

```bash
npx create-react-app my-app
```

3. Elimina todos los archivos en la carpeta `src/` del nuevo proyecto.

> Nota:
>
>**No elimines la carpeta `src` por completo, solo los archivos de código fuente originales dentro de ella**. Reemplazaremos los archivos de código fuente por defecto con ejemplos para este proyecto en el siguiente paso.

```bash
cd my-app
cd src

# Si usas Mac ó Linux:
rm -f *

# Ó, si usas Windows:
del *

# Luego, regresa a la carpeta del proyecto
cd ..
```

4. Agrega un archivo llamado `index.css` en la carpeta `src/` con [este código CSS](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Agrega un archivo llamado `index.js` en la carpeta `src/` con [este código JS](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. Agrega estas 3 líneas en la parte superior del archivo `index.js` en la carpeta `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Ahora, si tu ejecutas `npm start` en la carpeta del proyecto y abres `http://localhost:3000` en el navegador, deberías ver un campo de tic-tac-toe vacío.

Recomendamos seguir [estas instrucciones](https://babeljs.io/docs/editors/) para configurar el resaltado de sintaxis para tu editor.

</details>

### ¡Ayuda, estoy atorado! {#help-im-stuck}

Si te atoras, revisa los [recursos de soporte de la comunidad](/community/support.html). En particular, [el chat de Reactiflux](https://discord.gg/reactiflux) es una gran manera de obtener ayuda rápidamente. Si no recibes una respuesta, o sigues atorado, por favor crea un issue, y te ayudaremos.

## Visión General {#overview}

Ahora que está tu entorno configurado, ¡vamos a obtener una visión general de React!

### ¿Qué es React? {#what-is-react}

React es una librería de JavaScript declarativa, eficiente y flexible para construir interfaces de usuario. Permite componer IUs complejas de pequeñas y aisladas piezas de código llamadas "componentes".

React tiene pocos tipos diferentes de componentes, pero vamos a empezar con la subclase `React.Component`:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Lista de compras para {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Uso de ejemplo: <ShoppingList name="Mark" />
```

Vamos a ver las etiquetas divertidas que parecen XML pronto. Usamos componentes para decirle a React lo que queremos que se vea en la pantalla. Cuando nuestros datos cambian, React actualizará eficientemente y volverá a renderizar (re-render) nuestros componentes.

Aquí, ShoppingList es una **clase de componente de React**, ó **tipo de componente de React**.  Un componente acepta parámetros, llamados `props` (abreviatura de "propiedades"), y retorna una jerarquía de vistas a mostrar a través del método `render`.

El método `render` retorna una *descripción* de lo que quieres ver en la pantalla. React toma la descripción y muestra el resultado. En particular, `render` retorna un **elemento de React**, el cuál es una ligera descripción de lo que hay que renderizar. La mayoría de desarrolladores de React usan una sintaxis especial llamada "JSX" que facilita la escritura de estas estructuras. La sintaxis `<div />` es transformada en tiempo de construcción a `React.createElement('div')`. El ejemplo anterior es equivalente a:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Ver la versión completa extendida.](babel://tutorial-expanded-version)

Si tienes curiosidad, `createElement()` está descrito en más detalle en la [referencia de la API](/docs/react-api.html#createelement), pero no lo usaremos en este tutorial. En cambio, seguiremos usando JSX.

JSX viene con todo el poder de JavaScript. Puedes poner *cualquier* expresión de JavaScript en el interior de las llaves dentro de JSX. Cada elemento de React es un objeto de JavaScript que puedes almacenar en una variable o pasar alrededor de tu programa.

El componente anterior `ShoppingList` solo renderiza componentes pre-construidos del DOM como `<div />` y `<li />`. Pero, también puedes componer y renderizar componentes personalizados de React. Por ejemplo, ahora podemos referirnos al listado de compras completo escribiendo `<ShoppingList />`. Cada componente de React está encapsulado y puede operar independientemente; esto te permite construir IUs complejas desde componentes simples.

## Inspeccionando el código inicial {#inspecting-the-starter-code}

Si vas a trabajar el tutorial **en tu navegador,** abre este código en un nuevo tab: **[Código inicial](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Si vas a trabajar el tutorial **localmente,** abre `src/index.js` en la carpeta de tu proyecto (ya has tocado este archivo durante la [configuración](#setup-option-2-local-development-environment)).

Este código inicial es la base de lo que estás construyendo. Nos han provisto los estilos de CSS así que solo necesitas enfocarte en aprender React y programar el juego tic-tac-toe.

Inspeccionando el código, notarás que tenemos 3 componentes de React:

* Square
* Board
* Game

El componente Square renderiza un simple `<button>` y el Board renderiza 9 cuadrados. El componente Game renderiza un table con valores de posición por defecto que modificaremos luego. Actualmente no hay componentes interactivos.

### Pasando datos a través de props {#passing-data-through-props}

Solo para ensuciarnos las manos, vamos a pasar algo de datos de nuestro componente Board a nuestro componente Square.

Recomendamos firmemente escribir el código a mano mientras sigues el tutorial sin copiar y pegar. Esto te ayudará a desarrollar una memoria muscular y un entendimiento más sólido.

En el método `renderSquare` de Board, cambia el código para pasar una prop llamada `value` al Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
}
```

Cambia el método `render` de Square para mostrar ese valor, reemplazando `{/* TODO */}` con `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

Antes:

![React Devtools](../images/tutorial/tictac-empty.png)

Después: Deberías ver un número en cada cuadrado del resultado renderizado.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

¡Felicidades! Acabas de "pasar una prop" de un componente padre Board a un componente hijo Square. Pasando props es cómo la información fluye en apps de React, de padres a hijos.

### Haciendo un componente interactivo {#making-an-interactive-component}

Vamos a rellenar el componente de Square con una "X" cuando damos click en él.
Primero, cambia la etiqueta button que es retornada del método `render()` del componente Square a esto:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Si haces click en un cuadrado ahora, deberías ver una alerta en tu navegador.

>Nota
>
>Para continuar escribiendo código sin problemas y evitar el [confuso comportamiento de `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), vamos a usar la [sintaxis de funciones flecha](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions) para manejar eventos aquí y más abajo:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Ten en cuenta cómo con `onClick={() => alert('click')}`, estamos pasando *una función* como valor del prop `onClick`. React solo llamará a esta función después de un click. Olvidar `() =>` y escribir `onClick={alert('click')}` es un error común, y ejecutaría la alerta cada vez que el componente se re-renderice.

Como un siguiente paso, queremos que el componente Square "recuerde" que fue clickeado, y se rellene con una marca de "X". Para "recordar" cosas, los componentes usan **estado**.

Los componentes de React pueden tener estado estableciendo `this.state` en sus constructores. `this.state` debe ser considerado como privado para un componente de React en el que es definido. Vamos a almacenar el valor actual de un cuadrado en `this.state`, y cambiarlo cuando el cuadrado es clickeado.

Primero, vamos a agregar el constructor a la clase para inicializar el estado:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Nota
>
>En las [clases de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes), necesitas siempre llamar `super` cuando defines el constructor de una subclase. Todas las clases de componentes de React que tienen un `constructor` deben empezar con una llamada a `super(props)`.

Ahora vamos a cambiar el método `render` de Square para mostrar el valor del estado actual cuando es clickeado:

* Reemplaza `this.props.value` por `this.state.value` dentro de la etiqueta `<button>`.
* Reemplaza el manejador de evento `onClick={...}` por `onClick={() => this.setState({value: 'X'})}`.
* Pon los props `className` y `onClick` en líneas separadas para mejor legibilidad.

Luego de estos cambios, la etiqueta `<button>` que es retornada del método `render` de Square se ve así:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Llamando a `this.setState` desde el manejador `onClick` en el método `render` de Square, decimos a React que re-renderice el cuadrado siempre que su `<button>` es clickeado. Luego de la actualización, el `this.state.value` del cuadrado será `'X'`, así que veremos `X` en el tablero de juego. Si tu haces click en cualquier cuadrado, una `X` debería mostrarse en el mismo.

Cuando llamas `setState` en un componente, React actualiza automáticamente los componentes hijos dentro del mismo también.

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Herramientas de desarrollo {#developer-tools}

La extensión de React Devtools para [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) y [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) te permite inspeccionar el árbol de componentes de React con tus herramientas de desarrollo del navegador.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools te permite revisar los props y el estado de tus componentes de React.

Después de instalar React DevTools, puedes hacer click derecho en cualquier elemento de la página, click en "Inspeccionar elemento" para abrir las herramientas de desarrollo, y la pestaña de React aparecerá como la última pestaña a la derecha. Usa "⚛️ Components" para inspeccionar el árbol de componentes.

**Sin embargo, notar que hay unos cuantos pasos extras para hacerlo funcionar con CodePen:**

1. Loguéate o regístrate y confirma tu correo electrónico (requerido para prevenir spam).
2. Click en el botón "Fork".
3. Click en "Change View" y luego selecciona "Debug mode".
4. En la nueva pestaña que se abre, el devtools debería ahora tener una pestaña de React.

## Completando el juego {#completing-the-game}

Ahora tenemos los bloques de construcción básicos para nuestro juego tic-tac-toe. Para completar el juego, necesitamos alternar colocando "X" y "O" en el tablero, y necesitas una forma de determinar el ganador.

### Elevando el estado {#lifting-state-up}

Actualmente, cada componente Square mantiene el estado del juego. Para determinar un ganador, necesitamos mantener el valor de cada uno de los 9 cuadrados en un solo lugar.

Podemos pensar que el tablero debería solo preguntar a cada cuadrado por su estado. Aunque este enfoque es posible en React, te incentivamos a que no lo uses porque el código se vuelve difícil de ententer, susceptible a errores, y difícil de refactorizar. En su lugar, el mejor enfoque es almacenar el estado del juego en el componente padre Board en vez de cada componente Square. El componente Board puede decirle a cada cuadrado que mostrar pasándole un prop [tal cual hicimos cuando pasamos un número a cada cuadrado](#passing-data-through-props).

**Para recopilar datos de múltiples hijos, o tener dos componentes hijos comunicados entre sí, necesitas declarar el estado compartido en su componente padre. El componente padre puede pasar el estado hacia los hijos usando props; esto mantiene los componentes hijos sincronizados entre ellos y con su componente padre.**

Elevar el estado al componente padre es común cuando componentes de React son refactorizados, vamos a tomar esta oportunidad para intentarlo. 

Añade un constructor al Board y establece el estado inicial de Board para contener un arreglo con 9 valores null. Estos 9 nulls corresponden a los 9 cuadrados:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }
```

Cuando rellenemos el tablero luego, el arreglo `this.state.squares` se verá algo así:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

El método `renderSquare` del componente Board actualmente se ve así:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Al principio, [pasamos el prop `value`](#passing-data-through-props) desde el Board para mostrar los números de 0 a 8 en cada cuadrado. En un paso previo, reemplazamos los números con una marca "X" [determinado por el estado del propio Square](#making-an-interactive-component). Esto es porque el cuadrado actualmente ignora el prop `value` pasado por el Board.

Ahora usaremos el prop pasando el mecanismo otra vez. Modificaremos el Board para instruir cada Square acerca de su valor actual (`'X'`, `'O'`, ó `null`). Ya tenemos definido el arreglo `squares` en  el constructor del Board, y modificaremos el método `renderSquare` para que lo lea desde allí:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Cada Square ahora recibirá un prop `value` que será `'X'`, `'O'`, ó `null` para cuadrados vacíos.

Luego, necesitamos cambiar lo que sucede cuando un cuadrado es clickeado. El componente Board ahora mantiene qué cuadrados están rellenos. Necesitamos crear una forma para que el cuadrado actualice el estado del componente Board. Debido a que el estado es considerado privado al componente que lo define, no podemos actualizar el estado de Board directamente desde Square.

En cambio, pasaremos una función como prop desde Board a Square y haremos que Square llame a esa función cuando un cuadrado sea clickeado. Cambiaremos el método `renderSquare` en Board a:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Nota
>
>Dividimos el elemento retornado en múltiples líneas por legibilidad, y agregamos paréntesis para que JavaScript no inserte un punto y coma después del `return` y rompa nuestro código.

Ahora estamos pasando dos props desde Board a Square: `value` y `onClick`. El prop `onClick` es una función que Square puede llamar cuando sea clickeado. Haremos los siguientes cambios a Square:

* Reemplazar `this.state.value` por `this.props.value` en el método `render` de Square
* Reemplazar `this.setState()` por `this.props.onClick()` en el método `render` de Square
* Eliminar el `constructor` de Square porque el componente ya no hace seguimiento del estado del juego

Luego de estos cambios, el componente Square se ve algo así:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

Cuando un cuadrado es clickeado, la función `onClick` provista por el componente Board es llamada. Aquí un repaso de cómo esto fue logrado:

1. El prop `onClick` en el componente pre-construido del DOM `<button>` le dice a React para establecer un escuchador del evento click.
2. Cuando el botón es clickeado, React llamará al manejador de evento `onClick` que está definido en el método `render()` de Square.
3. Este manejador de evento llama a `this.props.onClick()`. El prop `onClick` del componente Square fue especificado por el componente Board.
4. Debido a que el Board pasó `onClick={() => this.handleClick(i)}` a Square, el componente Square llama a `this.handleClick(i)` cuando es clickeado.
5. No tenemos definido el método `handleClick()` aun, así que nuestro código falla. Si haces click ahora verás una pantalla roja de error que dice algo como *"this.handleClick is not a function"* (this.handleClick no es una función).

>Nota
>
>El atributo `onClick` del elemento `<button>` del DOM tiene un significado especial para React porque es un componente pre-construido. Para componentes personalizados como Square, la nomenclatura la decides tú. Podríamos darle cualquier nombre al prop `onClick` de Square o al método `handleClick` de Board, y el código funcionaría de la misma forma. En React, sin embargo, es una convención usar los nombres `on[Evento]` para props que representan eventos y `handle[Event]` para los métodos que manejan los eventos.

Cuando intentamos clickear un cuadrado, deberíamos obtener un error porque no hemos definido `handleClick` aun. Vamos ahora a agregar `handleClick` a la clase Board:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

Luego de estos cambios, podemos nuevamente clickear en los cuadrados para rellenarlos de la misma forma que lo hicimos antes. Sin embargo, ahora el estado está almacenado en el componente Board en lugar de cada componente Square. Cuando el estado del Board cambia, los componentes Square se re-renderiza automáticamente. Mantener el estado de todos los cuadrados en el componente Board nos permitirá determinar el ganador en el futuro.

Debido a que el componente Square ahora no mantiene estado, los componentes Square reciben valores del  componente Board e informan al mismo cuando son clickeados. En términos de React, los componentes Square ahora son **componentes controlados**. El componente Board tiene control completo sobre ellos.

Notar cómo en `handleClick`, llamamos `.slice()` para crear una copia del array de `squares` para modificarlo en vez de modificar el array existente. Ahora explicaremos porqué crear una copia del array `squares` en la siguiente sección.

### ¿Por qué es importante la inmutabilidad? {#why-immutability-is-important}

En el ejemplo de código anterior, sugerimos que usaras el método `.slice()` para crear una copia del array de `squares` para modificarlo en vez de modificar el array existente. Ahora discutiremos la inmutabilidad y porqué es importante aprenderla.

Hay generalmente dos enfoques para cambiar datos. El primer enfoque es *mutar* los datos directamente cambiando sus valores. El segundo enfoque es reemplazar los datos con una nueva copia que tiene los cambios deseados.

#### Cambio de datos con mutación {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Ahora `player` es {score: 2, name: 'Jeff'}
```

#### Cambio de datos sin mutación {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Ahora `player` no ha cambiado, pero `newPlayer` es {score: 2, name: 'Jeff'}

// O si usas la sintaxis propuesta de propagación de objeto, puedes escribir:
// var newPlayer = {...player, score: 2};
```

El resultado final es el mismo, pero al no mutar (o cambiar los datos subyacentes) directamente, obtenemos muchos beneficios descritos a continuación

#### Funcionalidades complejas se vuelven simples {#complex-features-become-simple}

La inmutabilidad hace que funcionalidades complejas sean mucho más fácil de implementar. Luego en este tutorial, implementaremos una funcionalidad de "viaje en el tiempo" que nos permite repasar el historial del juego tic-tac-toe y "volver" a movimientos previos. Esta funcionalidad no es específica de juegos, una habilidad de deshacer y rehacer ciertas acciones es un requerimiento común en aplicaciones. Evitar la mutación de datos directamente nos permite mantener intacto versiones previas del historial del juego, y reusarlas luego.

#### Detectar cambios {#detecting-changes}

Detectar cambios en objetos mutables es difícil porque son modificados directamente. Esta detección requiere que los objetos mutables sean comparados a la copia previa del mismo y que el árbol entero del objeto sea recorrido.

Detectar cambios en objetos inmutables es considerablemente más sencillo. Si el objeto inmutable que está siendo referenciado es diferente del anterior, significa que el objeto ha cambiado.

#### Determinar cuando re-renderizar en React {#determining-when-to-re-render-in-react}

El beneficio principal de inmutabilidad es que te ayuda a construir _componentes puros_ en React. Datos inmutables pueden determinar fácilmente si se han realizado cambios, que ayuda también a determinar cuando un componente requiere ser re-renderizado.

Puedes aprender más acerca de `shouldComponentUpdate()` y cómo puedes construir *componentes puros* leyendo [Optimizando el rendimiento](/docs/optimizing-performance.html#examples).

### Componentes de función {#function-components}

Ahora cambiaremos el componente Square a ser un **componente de función**.

En React, **componentes de función** son una forma más simple de escribir componentes que solo contienen un método `render` y no tiene estado propio. En lugar de definir una clase que extiende `React.Component`, podemos escribir una función que toma `props` como parámetros y retorna lo que se debe renderizar. Componentes de función son menos tediosos de escribir que clases, y muchos componentes pueden ser expresados de esta manera.

Reemplaza la clase Square por esta función:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Hemos cambiado `this.props` a `props` en ambas veces que aparece.

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Nota
>
>Cuando modificamos el componente Square a ser un componente de función, también cambiamos `onClick={() => this.props.onClick()}` a una más corta `onClick={props.onClick}` (notar la falta de paréntesis en *ambos* lados).

### Tomando turnos {#taking-turns}

Ahora necesitamos corregir un defecto obvio en nuestro juego tic-tac-toe: las "O" no pueden ser marcadas en el tablero.

Estableceremos el primer movimiento a ser una "X" por defecto. Podemos establecer el valor por defecto modificando el estado inicial en nuestro constructor del componente Board:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Cada vez que el jugador haga un movimiento, `xIsNext` (un booleano) será invertido para determinar qué jugador sigue y el estado del juego será guardado. Actualizaremos la función `handleClick` del componente Board para invertir el valor de `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Con este cambio, "X"s y "O"s pueden tomar turnos. ¡Inténtalo! 

También vamos a cambiar el texto de "status" en el `render` del Board para que muestre qué jugador tiene el siguiente turno:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // el resto no ha cambiado
```

Luego de aplicar estos cambios, deberíamos tener este componente Board:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declarando un ganador {#declaring-a-winner}

Ahora que mostramos de qué jugador es el siguiente turno, debemos también mostrar cuando alguien ganó el juego y si no hay más movimientos que hacer. Copia esta función de apoyo y pégala al final del archivo.

```javascript
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

Dado un arreglo de 9 cuadrados, esta función comprobará si hay un ganador y devolverá `'X'`, `'O'` o `null` según corresponda.

Llamaremos a `calculateWinner(squares)` en el método `render` del componente Board para revisar si un jugador ha ganado. Si un jugador ha ganado, podemos mostrar un texto como: "Winner: X" o "Winner: O". Reemplazaremos la declaración del `status` en el método `render` de Board con este código:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // el resto del código no ha cambiado
```

Ahora podemos cambiar la función `handleClick` del componente Board para retornar rápidamente ignorando un click si alguien ha ganado el juego o si un cuadrado está ya rellenado:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

¡Felicidades! Ahora tienes un juego tic-tac-toe funcionando. Y también acabas de aprender lo básico de React. Así que *eres* probablemente el real ganador aquí.

## Agregando viaje en el tiempo {#adding-time-travel}

Como ejercicio final, vamos a hacer posible "retroceder en el tiempo" al movimiento previo en el juego.

### Almacenando un historial de movimientos {#storing-a-history-of-moves}

Si mutamos el array de `squares`, implementar viaje en el tiempo sería muy difícil.

Sin embargo, usamos `slice()` para crear una copia nueva del array de `squares` después de cada movimiento, y [lo tratamos como inmutable](#why-immutability-is-important). Esto nos permite almacenar cada versión previa del array de `squares`, y navegar entre los turnos que ya han pasado.

Almacenaremos los pasados arrays de `squares` en otro array llamado `history`. El array `history` representa todos los estados del tablero, desde el primer movimiento hasta el último, y tiene una forma como esta:

```javascript
history = [
  // Antes del primer movimiento
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // Luego del primer movimiento
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // Luego del segundo movimiento
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Ahora necesitamos decidir qué componente debe ser el dueño del estado `history`.

### Elevando el estado, otra vez {#lifting-state-up-again}

Queremos que el componente de nivel superior, Game, muestre una lista de los movimientos pasados. Necesitará acceso al `historial` para hacerlo, así que colocaremos el estado `history` en el componente Game.

Colocando el estado `history` en el componente Game te permite eliminar el estado `squares` de su componente hijo Board. Tal como ["elevamos el estado"](#lifting-state-up) del componente Square al componente Board, ahora elevaremos del Board al componente Game. Esto dará al componente Game completo control sobre los datos de Board, y permitirá instruir al tablero que renderice los turnos previos desde el `history`.

Primero, vamos a establecer el estado inicial para el componente Game en su constructor:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

A continuación, haremos que el componente Board reciba los props `squares` y `onClick` del componente Game. Desde ahora tenemos un solo manejador de click en Board para muchos Squares, necesitamos pasar la ubicación de cada Square en el manejador `onClick` para indicar qué cuadrado fue clickeado. Aquí están los pasos requeridos para transformar el componente Board:

* Eliminar el `constructor` en Board.
* Reemplazar `this.state.squares[i]` por `this.props.squares[i]` en el método `renderSquare` del componente Board.
* Reemplazar `this.handleClick(i)` por `this.props.onClick(i)` en el método `renderSquare` del componente Board.

El componente Board ahora se ve así:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Actualizaremos el método `render` del componente Game para usar la entrada más reciente del historial para determinar y mostrar el estado del juego:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Dado que el componente ahora está renderizando el estado del juego, podemos eliminar el código correspondiente del método `render` del Board. Luego de refactorizar, el método `render` se ve así:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Por último, necesitamos mover el método `handleClick` del componente Board al componente Game. También necesitamos modificar `handleClick` porque el estado del componente Game está estructurado diferente. En el método `handleClick` de Game, concatenamos la nueva entrada del historial en `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Nota
>
>A diferencia del método `push()` de los arrays que debes estar más familiarizado, el método `concat()` no muta el array original, por eso lo preferimos.

En este punto, el componente Board solo necesita los métodos `renderSquare` y `render`. El estado del juego y el método `handleClick` deberían estar en el componente Game.

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Mostrando los movimientos anteriores {#showing-the-past-moves}

Desde que grabamos el historial del juego tic-tac-toe, ahora podemos mostrarlo al jugador como una lista de movimientos anteriores.

Aprendimos antes que los elementos de React son objetos de primera clase en JavaScript; así que podemos pasarlo alrededor de nuestras aplicaciones. Para renderizar múltiples elementos en React, podemos usar un array de elementos de React.

En JavaScript, los arrays tienen un [método `map()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map) que es comúnmente usado para mapear datos a otros datos, por ejemplo:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Usando el método `map`, podemos mapear nuestro historial de movimientos a elementos de React representando botones en la pantalla, y mostrando una lista de botones para "saltar" a movimientos anteriores.

Vamos a `mapear` sobre el `historial` en el método `render` del componente Game:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

Por cada movimiento en el historial del juego de tic-tac-toe, creamos un elemento de lista `<li>` que contiene un botón `<button>`. El botón tiene un manejador `onClick` que invoca a un método llamado `this.jumpTo()`. No hemos implementado el método `jumpTo()` aun. Por ahora, debemos ver una lista de los movimientos que han ocurrido en el juego y una advertencia en la consola de las herramientas de desarrollador que dice:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Vamos a discutir que significa la advertencia anterior.

### Escogiendo una key {#picking-a-key}

Cuando renderizamos una lista, React almacena información acerca de cada elemento de la lista renderizado. Cuando actualizamos una lista, React necesita determinar que ha cambiado. Podríamos haber añadido, eliminado, reacomodado, o actualizado los elementos de la lista.

Imagina cambiar de

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

a

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Además de los contadores actualizados, un humano leyendo esto probablemente diría que se intercambiaron el orden de Alexa y Ben e insertaron Claudia entre ellos. Sin embargo, React es un programa de computadora y no sabe lo que intentamos. Porque React no puede saber nuestras intenciones, necesitamos especificar una propiedad *key* para cada elemento de la lista para diferenciar cada uno de sus hermanos. Una opción sería usar los strings `alexa`, `ben`, `claudia`. Si fueramos a mostrar datos de una base de datos, los ids de base de datos de  Alexa, Ben y Claudia podrían ser usados como keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

Cuando una lista es re-renderizada, React toma cada key del elemento de la lista y busca el elemento de la lista anterior que coincida el key. Si la lista actual tiene un key que no existía antes, React crea un componente. Si a la lista actual le falta un key que existía en la lista anterior, React destruye el componente previo. Si dos keys coinciden, el componente correspondiente es movido. Los keys le dicen a React acerca de la identidad de cada componente lo cual permite a React mantener su estado entre re-renderizados. Si el key de un componente cambia, el componente será destruido y re-creado con un nuevo estado.

`key` es una propiedad especial y reservada en React (al igual que con `ref`, una característica más avanzada). Cuando un elemento es creado, React extrae la propiedad `key` y la almacena directamente en el elemento retornado. Aun cuando el `key` puede verse que pertenece a las `props`, `key` no puede ser referenciado usando `this.props.key`. React automáticamente usa `key` para decidir qué componentes actualizar. Un componente no puede averiguar sobre su `key`.

**Se recomienda fuertemente que uses keys apropiado cuando construyas listas dinámicas**. Si no tienes un key apropiado, quizás quieras considerar reestructurar tus datos para que puedas tenerla.

Si el key no está especificado, React presentará una advertencia y usará el índice del array como índice por defecto. Usando el índice del array como un key es problemático cuando intentas reordenar los elementos de una lista ó insertar/eliminar elementos de la lista. Pasar explícitamente `key={i}` silencia la advertencia pero tiene los mismos problemas que los índices del array y no es recomendado en la mayoría de los casos.

Los keys no necesitan ser globalmente únicos; solo necesitan ser únicos entre componentes y sus hermanos..


### Implementando viaje en el tiempo {#implementing-time-travel}

En el historial del juego de tic-tac-toe, cada movimiento anterior tiene un ID único asociado; es el número secuencial del movimiento. Los movimientos nunca son reordenados, eliminados, ó insertados en el medio, así que es seguro usar los índices del movimiento como un key.

En el método `render` del componente Game, podemos agregar el key como `<li key={move}` la advertencia de React debería desaparecer:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Haciendo click en cualquiera de los botones de la lista arroja un error porque el método `jumpTo` no está definido. Antes de implementar `jumpTo`, agregaremos `stepNumber` al estado del componente Game para indicar qué paso estamos viendo actualmente.

Primero, agrega `stepNumber: 0` al estado inicial en el constructor de Game:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Luego, definiremos el método `jumpTo` en el componente Game para actualizar el `stepNumber`. También estableceremos `xIsNext` a verdadero si el número que estamos cambiando en `stepNumber` es par:

```javascript{5-10}
  handleClick(i) {
    // este método no ha cambiado
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    //  este método no ha cambiado
  }
```

Ahora haremos unos pequeños cambios al método `handleClick` de Game, el cuál se dispara cuando haces click en un cuadrado.

El estado `stepNumber` que hemos añadido ahora refleja el movimiento mostrado al usuario. Después de hacer un nuevo movimiento, necesitamos actualizar `stepNumber` añadiendo `stepNumber: history.length` como parte del argumento de `this.setState`. Esto asegura que no nos estanquemos mostrando el mismo movimiento después de uno nuevo realizado.

También reemplazaremos `this.state.history` por `this.state.history.slice(0, this.state.stepNumber + 1)`. Esto asegura que si "volvemos en el tiempo" y luego hacemos un nuevo movimiento desde ese punto, tiramos todo la historia "futura" que ahora sería incorrecta.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Finalmente, modificaremos el método `render` del componente Game de siempre renderizar el último movimiento a renderizar el movimiento seleccionado actualmente de acuerdo a `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // el resto no ha cambiado
```

Si clickeamos en cualquier paso de la historia del juego, el tablero tic-tac-toe debería actualizarse inmediatamente para mostrar el tablero como se veía luego de que el paso ocurrió.

**[Ver el código completo en este punto](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Concluyendo {#wrapping-up}

¡Felicitaciones! Has creado un juego de tic-tac-toe que:

* Te permite jugar tic-tac-toe,
* Indica cuando un jugador ha ganado el juego,
* Almacena el historial del juego como va progresando,
* Permite a los jugadores revisar el historial del juego y ver versiones anteriores del tablero de juego.

¡Buen trabajo! Esperamos que ahora te sientas que tienes un entendimiento decente sobre cómo funciona React.

Revisa el resultado final aquí: **[Resultado final](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Si tienes un tiempo extra o quieres practicar tus nuevas habilidades de React, aquí algunas ideas de mejoras que puedes hacer al juego de tic-tac-toe, las cuales están listadas en orden de dificultad creciente:

1. Muestra la ubicación para cada movimiento en el formato (columna, fila) en la lista del historial de movimientos.
2. Convierte en negrita el elemento actualmente seleccionado en la lista de movimientos.
3. Reescribe el Board para usar 2 ciclos para hacer los cuadrados en vez de escribirlos a mano.
4. Agrega un botón de switch que te permita ordenar los movimientos en orden ascendente o descendente.
5. Cuando alguien gana, resalta los 3 cuadrados que hicieron que gane.
6. Cuando nadie gana, muestra un mensaje acerca de que el resultado es un empate.

A lo largo de este tutorial, hemos abordado conceptos de React incluyendo elementos, componentes, props, y estado. Para una explicación más detallada de cada uno de estos temas, revisa [el resto de la documentación](/docs/hello-world.html). Para aprender más acerca de definir componentes, revisa la [referencia del API de `React.Component`](/docs/react-component.html).
