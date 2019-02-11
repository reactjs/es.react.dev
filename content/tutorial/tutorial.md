---
id: tutorial
title: "Tutorial: Intro a React"
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

Vamos a contruir un pequeño juego durante este tutorial. **Deberás estar tentado a obviarlo porque tú no estás construyendo juegos en el día a día, pero dale una oportunidad.** Las técnicas que aprenderás en el tutorial son fundamentales para construir cualquier aplicación de React, y dominarlo te dará un entendimiento profundo de React.

>Tip
>
>Este tutorial está diseñado para personas que prefieren **aprender haciendo**. Si tu prefieres aprender los conceptos desde el principio, revisa nuestra [guía paso a paso](/docs/hello-world.html). Podrías encontrar este tutorial y la guía, complementarias entre sí.

Este tutorial está dividido en varias secciones:

* [Configuración para el tutorial](#configuracion-para-el-tutorial) te dará un punto de partida para seguir el tutorial.
* [Visión general](#vision-general) te enseñará **los fundamentos** de React: componentes, props y estado.
* [Completando el juego](#completando-el-juego) te enseñará **las técnicas más comunes** en desarrollo de React.
* [Agregando Time Travel](#agregando-time-travel) te dará una **visión más profunda** de las fortalezas únicas de React.

No tienes que completar todas las secciones a la vez para obtener el valor de este tutorial. Prueba llegar tan lejos como puedas, incluso si es una o dos secciones.

Está bien copiar y pegar el código mientras sigues el tutorial, pero te recomendamos que lo escribaas a mano. Esto te ayudará a desarrollar una memoria muscular y un entendimiento más sólido.

### ¿Qué estamos construyendo? {#what-are-we-building}

En este tutorial, te mostraremoscómo construir un juego de tic-tac-toe interactivo con React.

Puedes ver lo que construiremos aquí: **[Resultado Final](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Si el código no te hace sentido, o si no estás familiarizado con la sintaxis de código, ¡no te preocupes! El objetivo de este tutorial es ayudarte a entender React y su sintaxis.

Recomentamos que revises el juego de tic-tac-toe antes de continuar con el tutorial. Una de las características que notarás es que hay una lista enumerada a la derecha del tablero del jugador. Esta lista da una historia de todos los movimientos que han ocurrido en el juego, y se va actualizando conforme el juego progresa.

Puedes cerrar el juego de tic-tac-toe una vez que te familiarizaste con él. Empezaremos desde una plantilla más simple en este tutorial. Nuestro siguiente paso es configurarlo de tal forma que puedas empezar a construir el juego.

### Prerequisitos {#prerequisites}

Asumimos que tienes cierta familiaridad con HTML y JavaScript, pero deberías ser capaz de seguir adelante incluso si vienes de un lenguaje de programación diferente. También suponemos que estás familiarizado con conceptos de programación como funciones, objetos, arrays, y en menor medida, clases.

Si necesitas revisar JavaScript, te recomendamos leer [esta guía](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Ten en cuenta que también usamos algunas características de ES6, una versión reciente de JavaScript. En este tutorial, estamos usando [funciones flecha](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [clases](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), sentencias [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) y [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const). Puedes usar el [Babel REPL](babel://es5-syntax-example) para revisar a qué código compila ES6.

## Configuración para el tutorial {#setup-for-the-tutorial}

Hay dos maneras de completar este tutorial: puedes escribir el código en tu navegador, o puedes configurar tu entorno de desarrollo local en tu computador.

### Opción de configuración 1: Escribe código en el navegador {#setup-option-1-write-code-in-the-browser}

¡Ésta es la forma más rápida de empezar!

Primero, abre este **[código inicial](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** en una nueva pestaña. La nueva pestaña deberá mostrar un tablero vacío del juego de tic-tac-toe y código de React. Estaremos editando el código de React en este tutorial.

Ahora puedes saltarte a la segunda opción de configuración o ir a la sección de [visión general](#vision-general) para obtener una idea general de React.

### Opción de configuración 2: Entorno de desarrollo local {#setup-option-2-local-development-environment}

¡Ésta es completamente opcional y no es requeridad para éste tutorial!

<br>

<details>

<summary><b>Opcional: Instrucciones para seguir adelante localmente usando tu editor de texto preferido</b></summary>

Esta configuración requiere más trabajo pero te permite completar el tutorial usando un editor de tu elección. Aquí los pasos a seguir:

1. Asegúrate de tener una versión reciente de [Node.js](https://nodejs.org/en/) instalada.
2. Sigue las [instrucciones de instalación de Create React App](/docs/create-a-new-react-app.html#create-react-app) para hacer un nuevo proyecto.

```bash
npx create-react-app my-app
```

1. Elimina todos los archivos en la carpeta `src/` del nuevo proyecto.

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

1. Agrega un archivo llamado `index.css` en la carpeta `src/` con [este código CSS](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

2. Agrega un archivo llamado `index.js` en la carpeta `src/` con [este código JS](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

3. Agrega estas 3 líneas en la parte superior del archivo `index.js` en la carpeta `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Ahora, si tu ejecutas `npm start` en la carpeta del proyecto y abres `http://localhost:3000` en el navegador, deberías ver un campo de tic-tac-toe vacío.

Recomendamos seguir [estas instrucciones](https://babeljs.io/docs/editors/) para configurar el resaltado de sintaxis para tu editor.

</details>

### ¡Ayuda, estoy atorado! {#help-im-stuck}

Si te atoras, revisa los [recursos de soporte de la comunidad](/community/support.html). En particular, [el chat de Reactiflux](https://discord.gg/0ZcbPKXt5bZjGY5n) es una gran manera de obtener ayuda rápidamente. Si no recibes una respuesta, o sigues atorado, por favor crea un issue, y te ayudaremos.

## Visión General {#overview}

Ahora que está tu entorno configurado, ¡vamos a obtener una visión general de React!

### ¿Qué es React? {#what-is-react}

React es una librería de JavaScript declarativa, eficiente y flexible para construir interfaces de usuario. Permite componer UIs complejas de pequeñas y aisladas piezas de código llamadas "componentes".

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

El componente anterior `ShoppingList` solo renderiza componentes pre-construidos del DOM como `<div />` y `<li />`. Pero, también puedes componener y renderizar componentes personalizados de React. Por ejemplo, ahora podemos referirmos al listado de compras completo escribiendo `<ShoppingList />`. Cada componente de React está encapsulado y puede operar independientemente; esto te permite construir UIs complejas desde componentes simples.

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

En el método `renderSquare` de Board, cambia el código para pasar una prop llamada `value` al Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
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

Si hacemos click en un cuadrado ahora, deberíamos de obtener una alerta en nuestro navegador.

>Nota
>
>Para continuar escribiendo código sin problemas y evitar el [confuso comportamiento de `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), vamos a usar la [sintaxis de funciones flecha](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) para manejar eventos aquí y más abajo:
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
>Ten en cuenta cómo con `onClick={() => alert('click')}`, estamos pasando *una función* como valor del prop `onClick`. Esto solo se ejecuta luego de un click. Olvidar `() =>` y escribir `onClick={alert('click')}` es un error común, y ejecutaría la alerta cada vez que el componente se re-renderice.

Como un siguiente paso, queremos que el componente Square "recuerde" que fue clickeado, y se rellene con una marca de "X". Para "recordar" cosas, los componente usan **estado**.

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
>En las [clases de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), necesitas siempre llamar `super` cuando defines el constructor de una subclase. Todas las clases de componentes de React que tienen un `constructor` deben empezar con una llamada a `super(props)`.

Ahora vamos a cambiar el método `render` de Square para mostrar el valor del estado actual cuando es clickeado:

* Reemplaza `this.props.value` por `this.state.value` dentro de la etiqueta `<button>`.
* Reemplaza el manejador de evento `() => alert()` por `() => this.setState({value: 'X'})`.
* Pon los props `className` y `onClick` en líneas separadas para mejor legibilidad.

Luedo de estos cambios, la etiqueta `<button>` que es retornada del método `render` de Square se ve así:

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

El React DevTools te permite revisar las props y el estado de tus componentes de React.

Después de instalar React DevTools, puedes hacer click derecho en cualquier elemento de la página, click en "Inspect" para abrir las herramientas de desarrollo, y la pestaña de React aparecerá como la última pestaña a la derecha.

**Sin embargo, notar que hay unos cuantos pasos extras para hacerlo funcionar con CodePen:**

1. Loguéate o regístrate y confirma tu correo electrónico (requerido para prevenir spam).
2. Click en el botón "Fork".
3. Click en "Change View" y luego selecciona "Debug mode".
4. En la nueva pestaña que se abre, el devtools debería ahora tener una pestaña de React.

## Completando el juego {#completing-the-game}

Ahora tenemos los bloques de construcción básicos para nuestro juego tic-tac-toe. Para completar el juego, necesitamos alternar colocando "X" y "O" en el tablero, y necesitas una forma de determinar el ganador.

### Elevando el estado {#lifting-state-up}

Actualmente, cada componente Square mantiene el estado del juego. Para determinar un ganador, necesitamos mantener el valor de cada uno de los 9 cuadrador en un solo lugar.

Podemos pensar que el tablero debería solo preguntar a cada cuadrado por su estado. Aunque este enfoque es posible en React, te incentivamos a que no lo uses porque el código se vuelve difícil de ententer, susceptible a errores, y difícil de refactorizar. En su lugar, el mejor enfoque es almacenar el estado del juego en el componente padre Board en vez de cada componente Square. El componente Board puede decirle a cada cuadrado que mostrar pasándole un prop [tal cual hicimos cuando pasamos un número a cada cuadrado](#passing-data-through-props).

**Para recopilar datos de múltiples hijos, o tener dos componentes hijos comunicados entre si, necesitas declarar el estado compartido en su componente padre. El componente padre puede pasar el estado hacia los hijos usando props; esto mantiene los componentes hijos sincronizados entre ellos y con su componente padre.**

Elevar el estado al componente padre es común cuando componentes de React son refactorizados, vamos a tomar esta oportunidad para intentarlo. Añadiremos un constructor al Board y estableceremos el estado inicial de Board para contener un arreglo con 9 valores null. Estos 9 nulls corresponden a los 9 cuadrados:

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

  render() {
    const status = 'Siguiente jugador: X';

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

Cuando rellenemos el tablero luego, el tablero se verá algo así:

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

Luego, necesitamos cambiar lo que sucede cuando un cuadrado es clickeado. El componente Board ahora mantiene qué cuadrados están rellenos. Necesitamos crear una forma para que el cuadrado actualiza el estado del componente Board. Debido a que el estado es considerado privado al componente que lo define, no podemos actualizar el stado de Board directamente desde Square.

Para mantener el estado de Board privado, necesitamos pasar una función como prop desde Board a Square. Esta función será llamada cuando un cuadrado es clickeado. Cambiaremos el método `renderSquare` en Board a:

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
5. No tenemos definido el método `handleClick()` aun, así que nuestro código falla.

>Nota
>
>El atributo `onClick` del elemento `<button>` del DOM tiene un significado especial para React porque es un componente pre-construido. PAra componentes personalizados como Square, la nomenclatura la decides tú. Podemos nombrar el prop `onClick` de Square o el método `handleClick` de Board diferente. En React, sin embargo, es una convención usar los nombres `on[Evento]` para props que representan eventos y `handle[Event]` para los métodos que manejan los eventos.

Cuando intentamos clickear un cuadrado, deberíamos obtener un eerror porque no hemos definido `handleClick` aun. Vamos ahora a agregar `handleClick` a la clase Board:

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

Luego de estos cambios, podemos nuevamente clickear en los cuadrados para rellenarlos. Sin embargo, ahora el estado está almacenado en el componente Board en lugar de cada componente Square. Cuando el estado del Board cambia, los componentes Square se re-renderiza automáticamente. Mantener el estado de todos los cuadrados en el componente Board nos permitirá determinar el ganador en el futuro.

Debido a que el componente Square ahora no mantiene estado, los componentes Square reciben valores del  componente Board e informan al mismo cuando son clickeados. En términos de React, los componentes Square ahora son **componentes controlados**. El componente Board tiene control completo sobre ellos.

Notar cómo en `handleClick`, llamamos `.slice()` para crear una copia del array de `squares` para modificarlo en vez de modificar el array existente. Ahora explicareomos porqué crear una copia del array `squares` en la siguiente sección.

### ¿Porqué es importante la Inmutabilidad? {#why-immutability-is-important}

En el ejemplo de código anterior, sugerimos que uses el operador `.slice()` para crear una copia del array de `squares` para modificar en vez de modificar el array existente. Ahora discutiremos inmutabilidad y porqué es importante aprenderlo.

Hay generalmente dos enfoques para cambiar datos. El primer enfoque es *mutar* los datos directamente cambienado sus valores. El segundo enfoque es reemplazar los datos con una nueva copia que tiene los cambios deseados.

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

Inmutabilidad hace que funcionalidades complejas sean mucho más fácil de implementar. Luego en este tutorial, implementaremos una funcionalidad de "viaje en el tiempo" que nos permite repasar el historial del juego tic-tac-toe y "volver" a movimientos previos. Esta funcionalidad no es específica de juegos, una habilidad de deshacer y rehacer ciertas acciones es un requerimiento común en aplicaciones. Evitar la mutación de datos directamente nos permite mantener intacto versiones previas del historial del juego, y reusarlas luego.

#### Detectar cambios {#detecting-changes}

Detectar cambios en objetos mutables es difícil porque son modificados directmante. Esta detección requiere que los objetos mutables sean comparados a la copia previa del mismo y que el árbol entero del objeto sea recorrido.

Detectar cambios en objetos inmutables es considerablemente más sencillo. Si el objeto inmutable que está siendo referenciado es diferente del anterior, significa que el objeto ha cambiado.

#### Determinar cuando re-renderizar en React {#determining-when-to-re-render-in-react}

El beneficio principal de inmutabilidad es que te ayuda a construir _componentes puros_ en React. Datos inmutables pueden determinar fácilmente si se han realizado cambios, que ayuda también a determinar cuando un componente requiere ser re-renderizado.

Puedes aprender más acerca de `shouldComponentUpdate()` y cómo puedes construir *componentes puros* leyendo [Optimizando el rendimiento](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

We'll now change the Square to be a **function component**.

In React, **function components** are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

Replace the Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

We have changed `this.props` to `props` both times it appears.

**[View the full code at this point](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Note
>
>When we modified the Square to be a function component, we also changed `onClick={() => this.props.onClick()}` to a shorter `onClick={props.onClick}` (note the lack of parentheses on *both* sides). In a class, we used an arrow function to access the correct `this` value, but in a function component we don't need to worry about `this`.

### Taking Turns {#taking-turns}

We now need to fix an obvious defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. We can set this default by modifying the initial state in our Board constructor:

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

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

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

With this change, "X"s and "O"s can take turns. Let's also change the "status" text in Board's `render` so that it displays which player has the next turn:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After applying these changes, you should have this Board component:

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

**[View the full code at this point](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declaring a Winner {#declaring-a-winner}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. We can determine a winner by adding this helper function to the end of the file:

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

We will call `calculateWinner(squares)` in the Board's `render` function to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in Board's `render` function with this code:

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
      // the rest has not changed
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

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

**[View the full code at this point](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So *you're* probably the real winner here.

## Adding Time Travel {#adding-time-travel}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {#storing-a-history-of-moves}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
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

Now we need to decide which component should own the `history` state.

### Lifting State Up, Again {#lifting-state-up-again}

We'll want the top-level Game component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, we'll set up the initial state for the Game component within its constructor:

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

Next, we'll have the Board component receive `squares` and `onClick` props from the Game component. Since we now have a single click handler in Board for many Squares, we'll need to pass the location of each Square into the `onClick` handler to indicate which Square was clicked. Here are the required steps to transform the Board component:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

The Board component now looks like this:

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

We'll update the Game component's `render` function to use the most recent history entry to determine and display the game's status:

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

Since the Game component is now rendering the game's status, we can remove the corresponding code from the Board's `render` method. After refactoring, the Board's `render` function looks like this:

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

Finally, we need to move the `handleClick` method from the Board component to the Game component. We also need to modify `handleClick` because the Game component's state is structured differently. Within the Game's `handleClick` method, we concatenate new history entries onto `history`.

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

>Note
>
>Unlike the array `push()` method you might be more familiar with, the `concat()` method doesn't mutate the original array, so we prefer it.

At this point, the Board component only needs the `renderSquare` and `render` methods. The game's state and the `handleClick` method should be in the Game component.

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {#showing-the-past-moves}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

In JavaScript, arrays have a [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for mapping data to other data, for example:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Using the `map` method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game's `render` method:

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

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

For each move in the tic-tac-toes's game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's discuss what the above warning means.

### Picking a Key {#picking-a-key}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what we intended. Because React cannot know our intentions, we need to specify a *key* property for each list item to differentiate each list item from its siblings. One option would be to use the strings `alexa`, `ben`, `claudia`. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved. Keys tell React about the identity of each component which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it belongs in `props`, `key` cannot be referenced using `this.props.key`. React automatically uses `key` to decide which components to update. A component cannot inquire about its `key`.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.


### Implementing Time Travel {#implementing-time-travel}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game component's `render` method, we can add the key as `<li key={move}>` and React's warning about keys should disappear:

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

**[View the full code at this point](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

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

Next, we'll define the `jumpTo` method in Game to update that `stepNumber`. We also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.

The `stepNumber` state we've added reflects the move displayed to the user now. After we make a new move, we need to update `stepNumber` by adding `stepNumber: history.length` as part of the `this.setState` argument. This ensures we don't get stuck showing the same move after a new one has been made.

We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect.

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

Finally, we will modify the Game component's `render` method from always rendering the last move to rendering the currently selected move according to `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Wrapping Up {#wrapping-up}

Congratulations! You've created a tic-tac-toe game that:

* Lets you play tic-tac-toe,
* Indicates when a player has won the game,
* Stores a game's history as a game progresses,
* Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
