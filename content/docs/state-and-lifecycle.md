---
id: state-and-lifecycle
title: Estado y ciclo de vida
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

Esta página introduce el concepto de estado y ciclo de vida en un componente de React. Puedes encontrar una [referencia detallada de la API de un componente aquí](/docs/react-component.html).

Consideremos el ejemplo del reloj de [una de las secciones anteriores](/docs/rendering-elements.html#updating-the-rendered-element). En [Renderizando elementos](/docs/rendering-elements.html#rendering-an-element-into-the-dom), aprendimos solo una forma de actualizar la interfaz de usuario. Invocamos a `ReactDOM.render()` para que cambie el resultado renderizado.

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

En esta sección, aprenderemos como hacer al componente `Clock` verdaderamente reutilizable y encapsulado. Configurarás tu propio temporizador y se actualizará cada segundo.

Podemos comenzar por encapsular cómo se ve el reloj:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Sin embargo, se pierde un requisito crucial: el hecho de que `Clock` configure un temporizador y actualice la interfaz de usuario cada segundo debe ser un detalle de implementación de `Clock`.

Idealmente, queremos escribir esto una vez y que `Clock` se actualice a sí mismo:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Para implementar esto, necesitamos agregar «estado» al componente `Clock`.

El estado es similar a las props, pero es privado y está completamente controlado por el componente.

## Convertir una función en una clase {#converting-a-function-to-a-class}

Se puede convertir un componente de función como `Clock` en una clase en cinco pasos:

1. Crear una [clase ES6](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Classes) con el mismo nombre que herede de `React.Component`.

2. Agregar un único método vacío llamado `render()`.

3. Mover el cuerpo de la función al método `render()`.

4. Reemplazar `props` con `this.props` en el cuerpo de `render()`.

5. Borrar el resto de la declaración de la función ya vacía.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` ahora se define como una clase en lugar de una función.

El método `render` se invocará cada vez que ocurre una actualización; pero, siempre y cuando rendericemos `<Clock />` en el mismo nodo del DOM, se usará solo una única instancia de la clase `Clock`. Esto nos permite utilizar características adicionales como el estado local y los métodos de ciclo de vida.

## Agregar estado local a una clase {#adding-local-state-to-a-class}

Moveremos `date` de las props hacia el estado en tres pasos:

1) Reemplazar `this.props.date` con `this.state.date` en el método `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Añadir un [constructor de clase](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Classes#Constructor) que asigne el `this.state` inicial:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Nota cómo pasamos `props` al constructor base:

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Los componentes de clase siempre deben invocar al constructor base con `props`.

3) Eliminar la prop `date` del elemento `<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Posteriormente regresaremos el código del temporizador al propio componente.

El resultado es el siguiente:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

A continuación, haremos que `Clock` configure su propio temporizador y se actualice cada segundo.

## Agregar métodos de ciclo de vida a una clase {#adding-lifecycle-methods-to-a-class}

En aplicaciones con muchos componentes, es muy importante liberar recursos tomados por los componentes cuando se destruyen.

Queremos [configurar un temporizador](`https://developer.mozilla.org/es/docs/Web/API/WindowTimers/setInterval`) cada vez que `Clock` se renderice en el DOM por primera vez. Esto se llama «montaje» en React.

También queremos [borrar ese temporizador](https://developer.mozilla.org/es/docs/Web/API/WindowTimers/clearInterval) cada vez que el DOM producido por `Clock` se elimine. Esto se llama «desmontaje» en React.

Podemos declarar métodos especiales en la clase del componente para ejecutar algún código cuando un componente se monta y desmonta:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Estos métodos son llamados «métodos de ciclo de vida».

El método `componentDidMount()` se ejecuta después que la salida del componente ha sido renderizada en el DOM. Este es un buen lugar para configurar un temporizador:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Nota como guardamos el ID del temporizador en `this` (`this.timerID`).

Si bien `this.props` es configurado por el mismo React y `this.state` tiene un significado especial, eres libre de añadir campos adicionales a la clase manualmente si necesitas almacenar algo que no participa en el flujo de datos (como el ID de un temporizador).

Eliminaremos el temporizador en el método de ciclo de vida `componentWillUnmount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Finalmente, implementaremos un método llamado `tick()` que el componente `Clock` ejecutará cada segundo.

Utilizará `this.setState()` para programar actualizaciones al estado local del componente. 

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

Ahora el reloj cambia cada segundo.

Repasemos rápidamente lo que está sucediendo y el orden en que se invocan los métodos:

1) Cuando se pasa `<Clock />` a `ReactDOM.render()`, React invoca al constructor del componente `Clock`. Ya que `Clock` necesita mostrar la hora actual, inicializa `this.state` con un objeto que incluye la hora actual. Luego actualizaremos este estado.

2) React invoca entonces al método `render()` del componente `Clock`. Así es como React sabe lo que se debe mostrar en pantalla. React entonces actualiza el DOM para que coincida con la salida del renderizado de `Clock`.

3) Cuando la salida de `Clock` se inserta en el DOM, React invoca al método de ciclo de vida `componentDidMount()`. Dentro de él, el componente `Clock` le pide al navegador que configure un temporizador para invocar al método `tick()` del componente una vez por segundo.

4) Cada segundo el navegador invoca al método `tick()`. Dentro de él, el componente `Clock` planifica una actualización de la interfaz de usuario al invocar a `setState()` con un objeto que contiene la hora actual. Gracias a la invocación a `setState()`, React sabe que el estado cambió e invoca de nuevo al método `render()` para saber qué debe estar en la pantalla. Esta vez, `this.state.date` en el método `render()` será diferente, por lo que el resultado del renderizado incluirá la hora actualizada. Conforme a eso React actualiza el DOM.

5) Si el componente `Clock` se elimina en algún momento del DOM, React invoca al método de ciclo de vida `componentWillUnmount()`, por lo que el temporizador se detiene.

## Usar el estado correctamente {#using-state-correctly}

Hay tres cosas que debes saber sobre `setState()`.

### No modifiques el estado directamente {#do-not-modify-state-directly}

Por ejemplo, esto no volverá a renderizar un componente:

```js
// Incorrecto
this.state.comment = 'Hello';
```

En su lugar utiliza `setState()`:

```js
// Correcto
this.setState({comment: 'Hello'});
```

El único lugar donde puedes asignar `this.state` es el constructor.

### Las actualizaciones del estado pueden ser asíncronas {#state-updates-may-be-asynchronous}

React puede agrupar varias invocaciones a `setState()` en una sola actualización para mejorar el rendimiento.

Debido a que `this.props` y `this.state` pueden actualizarse de forma asincrónica, no debes confiar en sus valores para calcular el siguiente estado.

Por ejemplo, este código puede fallar en actualizar el contador:

```js
// Incorrecto
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Para arreglarlo, usa una segunda forma de `setState()` que acepta una función en lugar de un objeto. Esa función recibirá el estado previo como primer argumento, y las props en el momento en que se aplica la actualización como segundo argumento:

```js
// Correcto
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

Anteriormente usamos una [función flecha](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Funciones/Arrow_functions), pero se podría haber hecho igualmente con funciones comunes:

```js
// Correcto
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Las actualizaciones de estado se fusionan {#state-updates-are-merged}

Cuando invocas a `setState()`, React combina el objeto que proporcionaste con el estado actual.

Por ejemplo, tu estado puede contener varias variables independientes:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Luego puedes actualizarlas independientemente con invocaciones separadas a `setState()`:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

La fusión es superficial, asi que `this.setState({comments})` deja intacto a `this.state.posts`, pero reemplaza completamente `this.state.comments`.

## Los datos fluyen hacia abajo {#the-data-flows-down}

Ni los componentes padres o hijos pueden saber si un determinado componente tiene o no tiene estado y no les debería importar si se define como una función o una clase.

Por eso es que el estado a menudo se le denomina local o encapsulado. No es accesible desde otro componente excepto de aquel que lo posee y lo asigna.

Un componente puede elegir pasar su estado como props a sus componentes hijos:

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

Esto también funciona para componentes definidos por el usuario:

```js
<FormattedDate date={this.state.date} />
```

El componente `FormattedDate` recibiría `date` en sus props y no sabría si vino del estado de `Clock`, de los props de `Clock`, o si se escribió manualmente:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

A esto comúnmente se le llama flujo de datos «descendente» o «unidireccional». Cualquier estado siempre es propiedad de algún componente específico, y cualquier dato o interfaz de usuario derivados de ese estado solo pueden afectar los componentes «debajo» de ellos en el árbol.

Si imaginas un árbol de componentes como una cascada de props, el estado de cada componente es como una fuente de agua adicional que se le une en un punto arbitrario, pero también fluye hacia abajo.

Para mostrar que todos los componentes están verdaderamente aislados, podemos crear un componente `App` que represente tres componentes `<Clock>`:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Cada `Clock` configura su propio temporizador y se actualiza de forma independiente.

En las aplicaciones de React, si un componente tiene o no estado se considera un detalle de implementación del componente que puede cambiar con el tiempo. Puedes usar componentes sin estado dentro de componentes con estado y viceversa.
