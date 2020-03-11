---
id: components-and-props
title: Componentes y propiedades
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---
Los componentes permiten separar la interfaz de usuario en piezas independientes, reutilizables y pensar en cada pieza de forma aislada.Esta página proporciona una introducción a la idea de los componentes.
Puedes encontrar una [API detallada sobre componentes aquí](/docs/react-component.html).

Conceptualmente, los componentes son como las funciones de JavaScript. Aceptan entradas arbitrarias (llamadas "props") y devuelven a React elementos que describen lo que debe aparecer en la pantalla.

## Componentes funcionales y de clase {#function-and-class-components}

La forma más sencilla de definir un componente es escribir una función de JavaScript:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Esta función es un componente de React válido porque acepta un solo argumento de objeto "props" (que proviene de propiedades) con datos y devuelve un elemento de React. Llamamos a dichos componentes "funcionales" porque literalmente son funciones JavaScript.

También puedes utilizar una [clase de ES6](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Classes) para definir un componente:


```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Los dos componentes anteriores son equivalentes desde el punto de vista de React.

Tanto los componentes de función como de clase tienen algunas características adicionales que veremos en las [próximas secciones](/docs/state-and-lifecycle.html).

## Renderizando un componente {#rendering-a-component}

Anteriormente, sólo encontramos elementos de React que representan las etiquetas del DOM:

```js
const element = <div />;
```

Sin embargo, los elementos también pueden representar componentes definidos por el usuario:

```js
const element = <Welcome name="Sara" />;
```

Cuando React ve un elemento representando un componente definido por el usuario, pasa atributos JSX e hijos a este componente como un solo objeto. Llamamos a este objeto "props".

Por ejemplo, este código muestra "Hello, Sara" en la página:

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://components-and-props/rendering-a-component)

Recapitulemos lo que sucede en este ejemplo:

1. Llamamos a `ReactDOM.render()` con el elemento `<Welcome name="Sara" />`.
2. React llama al componente `Welcome` con `{name: 'Sara'}` como "props".
3. Nuestro componente `Welcome` devuelve un elemento `<h1>Hello, Sara</h1>` como resultado.
4. React DOM actualiza eficientemente el DOM para que coincida con `<h1>Hello, Sara</h1>`.

> **Nota:** Comienza siempre los nombres de componentes con una letra mayúscula.
> 
>React trata los componentes que empiezan con letras minúsculas como etiquetas del DOM. Por ejemplo, `<div />` representa una etiqueta div HTML pero `<Welcome />` representa un componente y requiere que `Welcome` esté definido.
> 
> Para saber más sobre el razonamiento detrás de esta convención, puedes consultar [JSX en profundidad](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

## Composición de componentes {#composing-components}

Los componentes pueden referirse a otros componentes en su salida. Esto nos permite utilizar la misma abstracción de componente para cualquier nivel de detalle. Un botón, un cuadro de diálogo, un formulario, una pantalla: en aplicaciones de React, todos son expresados comúnmente como componentes.

Por ejemplo, podemos crear un componente `App` que renderiza `Welcome` muchas veces:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[](codepen://components-and-props/composing-components)

Por lo general, las aplicaciones de React nuevas tienen un único componente `App` en lo más alto. Sin embargo, si se integra React en una aplicación existente, se podría empezar de abajo hacia arriba con un pequeño componente como `Button` y poco a poco trabajar el camino a la cima de la jerarquía de la vista.

## Extracción de componentes {#extracting-components}

No tengas miedo de dividir los componentes en otros más pequeños.

Por ejemplo, considera este componente `Comment`:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components)

Acepta `author` (un objeto), `text` (un string), y `date` (una fecha) como props, y describe un comentario en una web de redes sociales.

Este componente puede ser difícil de cambiar debido a todo el anidamiento, y también es difícil reutilizar partes individuales de él. Vamos a extraer algunos componentes del mismo.

Primero, vamos a extraer `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

El `Avatar` no necesita saber que está siendo renderizado dentro de un `Comment`. Esto es por lo que le dimos a su propiedad un nombre más genérico: `user` en vez de `author`.

Recomendamos nombrar las props desde el punto de vista del componente, en vez de la del contexto en el que se va a utilizar.

Ahora podemos simplificar `Comment` un poquito:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

A continuacion, vamos a extraer un componente `UserInfo` que renderiza un `Avatar` al lado del nombre del usuario:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Esto nos permite simplificar `Comment` aun más:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components-continued)

Extraer componentes puede parecer un trabajo pesado al principio, pero tener una paleta de componentes reutilizables vale la pena en aplicaciones más grandes. Una buena regla en general es que si una parte de su interfaz de usuario se usa varias veces (`Button`, `Panel`, `Avatar`), o es lo suficientemente compleja por sí misma (`App`, `FeedStory`, `Comment`), es buen candidato para ser un componente reutilizable.

## Las props son de solo lectura {#props-are-read-only}

Ya sea que declares un componente [como una función o como una clase](#function-and-class-components), este nunca debe modificar sus props. Considera esta función `sum` :

```js
function sum(a, b) {
  return a + b;
}
```

Tales funciones son llamadas ["puras"](https://es.wikipedia.org/wiki/Programaci%C3%B3n_funcional#Funciones_puras) porque no tratan de cambiar sus entradas, y siempre devuelven el mismo resultado para las mismas entradas.

En contraste, esta función es impura porque cambia su propia entrada:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React es bastante flexible pero tiene una sola regla estricta:

**Todos los componentes de React deben actuar como funciones puras con respecto a sus props.**

Por supuesto, las interfaces de usuario de las aplicaciones son dinámicas y cambian con el tiempo. En la [siguiente sección](/docs/state-and-lifecycle.html), introduciremos un nuevo concepto de "estado". El estado le permite a los componentes de React cambiar su salida a lo largo del tiempo en respuesta a acciones del usuario, respuestas de red y cualquier otra cosa, sin violar esta regla.
