---
id: react-without-es6
title: React sin ES6
permalink: docs/react-without-es6.html
---

Normalmente definirías un componente de React cómo una clase simple de JavaScript:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Si aún no utilizas ES6, puedes utilizar el módulo `create-react-class`:


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

La API de clases en ES6 es similar a `createReactClass()` con algunas excepciones.

## Declarando _props_ por defecto {#declaring-default-props}

Con funciones y clases de ES6 `defaultProps` se define como una propiedad del componente:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

Con `createReactClass()`, es necesario que definas `getDefaultProps()` como una función en el objeto que se le pasa:

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## Configurando el estado inicial {#setting-the-initial-state}

En clases de ES6, puedes definir el estado inicial al asignar `this.state` en el constructor:

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

Con `createReactClass()`, debes proveer un método adicional `getInitialState` que retorna el estado inicial:

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Autobinding {#autobinding}

En componentes de React declarados como clases de ES6, los métodos se rigen por la misma semántica que las clases regulares de ES6. Esto significa que no vinculan `this` automáticamente a la instancia. Debes utilizar `.bind(this)` explícitamente en el constructor:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // Esta línea es importante!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Porque `this.handleClick` está vinculada, podemos utilizarla como un manejador de evento
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Con `createReactClass()`, esto no es necesario porque vincula todos los métodos:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

Esto significa que las clases de ES6 traen consigo la necesidad de escribir un poco más de código repetitivo para utilizar *manejadores de eventos*, pero la ventaja radica en una ligera mejora del rendimiento en aplicaciones grandes.

Si el código repetitivo no es atractivo para ti, puedes activar la propuesta de sintaxis **experimental** [Propiedades de Clases](https://babeljs.io/docs/plugins/transform-class-properties/) con Babel:


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // ADVERTENCIA: esta sintaxis es experimental!
  // Al usar una función de flecha aquí, el método queda vinculado:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Por favor, ten en cuenta que la sintaxis anterior es **experimental** y podría cambiar, o la propuesta podría no llegar a formar parte del lenguaje.

Si prefieres jugar a lo seguro, tienes algunas opciones:

* Vincular los métodos a la instancia desde el constructor.
* Usar funciones flecha, e.g. `onClick={(e) => this.handleClick(e)}`.
* Continuar utilizando `createReactClass`.

## Mixins {#mixins}

>**Nota:**
>
>ES6 fue lanzado sin soporte de mixins. Por lo tanto, no existe soporte de mixins cuando utilizas React con clases de ES6.
>
>**Nosotros también hemos encontrado muchos problemas en bases de código en los que se ha utilizado mixins, [y no recomendamos utilizarlos en código nuevo](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Esta sección existe únicamente por referencia.

Algunas veces componentes muy diferentes pueden compartir una funcionalidad en común. Estos son algunas veces llamados [preocupaciones transversales](https://en.wikipedia.org/wiki/Cross-cutting_concern). `createReactClass` te permite utilizar el sistema heredado de `mixins` para ello.

Un caso de uso común es un componente que necesita actualizarse con un intervalo de tiempo. Es fácil utilizar `setInterval()`, pero es importante cancelar tu intervalo cuando ya no lo necesites más para ahorrar memoria. React provee [métodos de ciclo de vida](/docs/react-component.html#the-component-lifecycle) que te permiten saber cuando un componente es creado o destruido. Creemos un _mixin_ sencillo que utilice esos métodos para proveer simplemente una función `setInterval()` que será limpiada automáticamente cuando tu componente sea destruido.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Utilizar el mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Llamar un método del mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

Si un componente utiliza multiples _mixins_ y varios _mixins_ definen el mismo método de ciclo de vida (e. varios _mixins_ quieren hacer algún tipo de limpieza cuando el componente sea destruido), todos los métodos de ciclo de vida tendrán la garantía de ser ejecutados. Los métodos definidos en _mixins_ se ejecutan en el orden en el que los _mixins_ fueron enumerados, seguidos de una llamada al método en el componente.
