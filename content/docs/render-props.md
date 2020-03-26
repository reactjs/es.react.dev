---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

El término ["render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) se refiere a una técnica para compartir código entre componentes en React utilizando una propiedad cuyo valor es una función.

Un componente con una `render prop` toma una función que devuelve un elemento de React y lo llama en lugar de implementar su propia lógica de representación.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

Algunas bibliotecas que utilizan `render props` son [React Router](https://reacttraining.com/react-router/web/api/Route/render-func), [Downshift](https://github.com/paypal/downshift) y [Formik](https://github.com/jaredpalmer/formik).

En este documento, discutiremos por qué las `render props` son útiles y cómo escribir las tuyas.

## Usa Render Props para preocupaciones transversales

Los componentes son la unidad primaria de reutilización de código en React, pero no siempre es obvio cómo compartir el estado o el comportamiento que un componente encapsula en otros componentes que necesitan ese mismo estado.

Por ejemplo, el siguiente componente rastrea la posición del cursor en una aplicación web:

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

A medida que el cursor se mueve alrededor de la pantalla, el componente muestra sus coordenadas (x, y) en un `<p>`.

Ahora la pregunta es: ¿Cómo podemos reutilizar este comportamiento en otro componente? En otras palabras, si otro componente necesita saber la posición del cursor, ¿podemos encapsular ese comportamiento para poder compartirlo fácilmente con ese componente?

Como los componentes son la unidad básica de reutilización de código en React, intentemos refactorizar el código un poco para usar un componente `<Mouse>` que encapsule el comportamiento que necesitamos reutilizar en otro lugar.

```js
// El componente <Mouse> encapsula el comportamiento que necesitamos...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ...pero, ¿cómo renderizamos algo más que un <p>? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </>
    );
  }
}
```

Ahora, el componente `<Mouse>` encapsula todo el comportamiento asociado con la escucha de eventos `mousemove` y el almacenamiento de la posición (x, y) del cursor, pero aún no es realmente reutilizable.

Por ejemplo, digamos que tenemos un componente `<Cat>` que representa la imagen de un gato persiguiendo el cursor alrededor de la pantalla. Podríamos usar una propiedad `<Cat mouse={{ x, y }}>` para indicar al componente las coordenadas del cursor de manera que sepa dónde colocar la imagen en la pantalla.

Como primer paso, puedes intentar renderizar el componente `<Cat>` *dentro del método `render` del componente `<Mouse>`*, de esta manera:

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          Podríamos simplemente cambiar el <p> por un <Cat> aquí ... pero luego
          necesitaríamos crear un componente <MouseWithSomethingElse> separado
          cada vez que necesitamos usarlo, por lo que <MouseWithCat>
          no es realmente reutilizable todavía.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Esta propuesta funcionará para nuestro caso de uso específico, pero no hemos logrado el objetivo de realmente encapsular el comportamiento de una manera reutilizable. Ahora, cada vez que queramos saber la posición del cursor para un caso de uso diferente, debemos crear un nuevo componente (es decir, esencialmente otro `<MouseWithCat>`) que renderice algo específicamente para ese caso de uso.

Aquí es donde entran en juego las `render props`: En lugar de codificar de forma fija un componente `<Cat>` dentro del componente `<Mouse>`, y cambiar efectivamente la salida de su método render, podemos proporcionar una función por medio props a `<Mouse>` que pueda utilizar para determinar dinámicamente lo que debe renderizar -una `render prop`.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          En lugar de proporcionar una representación estática de lo que <Mouse> renderiza,
          usa la `render prop` para determinar dinámicamente qué renderizar.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Ahora, en lugar de clonar efectivamente el componente `<Mouse>` y codificar de forma fija otra cosa en su método `render` para resolver un caso de uso específico, proporcionamos una `render prop` que `<Mouse>` pueda usar para dinámicamente determinar que renderizar.

Más concretamente, **una render prop es una prop que recibe una función que un componente utiliza para saber qué renderizar.**

Esta técnica hace que el comportamiento que necesitamos compartir sea extremadamente portátil. Para obtener ese comportamiento, genere un `<Mouse>` con una `render prop` que le diga qué renderizar con la posición (x, y) del cursor.

Una cosa interesante a tener en cuenta acerca de las `render props` es que puedes implementar la mayoría de los [componentes de orden superior](/docs/higher-order-components.html) (HOC) utilizando un componente regular con una `render prop`. Por ejemplo, si prefiere tener un `withMouse` HOC en lugar de un componente `<Mouse>`, puede crear fácilmente uno usando un `<Mouse>` regular con una `render prop`:

```js
// Si realmente quieres un HOC por alguna razón, puedes fácilmente
// crear uno usando un componente regular con una render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

Por lo tanto, usar una `render prop` hace que sea posible usar cualquier patrón.

## Usando otras Props diferentes de `render` {#using-props-other-than-render}

Es importante recordar que solo porque el patrón se llama `render props` *no tienes que usar una prop llamada `render` para usar este patrón*. De hecho, [*cualquier* prop que es una función que un componente utiliza para saber qué renderizar es técnicamente una "render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) .

Aunque los ejemplos anteriores usan `render`, ¡podríamos usar la proposición `children` con la misma facilidad!

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

Y recuerda, la propiedad `children` en realidad no necesita ser nombrada en la lista de "atributos" en su elemento JSX. En su lugar, puedes ponerlo directamente *dentro* del elemento!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Verás esta técnica utilizada en la API de [react-motion](https://github.com/chenglou/react-motion).

Ya que esta técnica es un poco inusual, probablemente querrás decir explícitamente que `children` debería ser una función en tus `propTypes` cuando diseñes una API como esta.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Advertencias {#caveats}

### Ten cuidado al usar Render Props con React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

El uso de una `render prop` puede no aprovechar la ventaja del uso de [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) si crea la función dentro del método `render`. Esto se debe a que la comparación de propiedades poco profundas siempre devolverá `false` para las nuevas props, y cada `render` en este caso generará un nuevo valor para la render prop.

Por ejemplo, continuando con nuestro componente `<Mouse>` de los ejemplos anteriores, si `Mouse` extendiera `React.PureComponent` en lugar de `React.Component`, nuestro ejemplo se vería así:

```js
class Mouse extends React.PureComponent {
  // Misma implementación que la anterior...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          ¡Esto está mal! El valor de la `render prop`
          será diferente en cada render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

En este ejemplo, cada vez que se renderiza `<MouseTracker>`, genera una nueva función como el valor de la propiedad `<Mouse render>`, negando así el efecto de `<Mouse>` extendiendo `React.PureComponent` en primer lugar!

Para solucionar este problema, a veces se puede definir la prop como un método de instancia, así:

```js
class MouseTracker extends React.Component {
  // Definido como un método de instancia, `this.renderTheCat` siempre
  // se refiere a la *misma* función cuando la usamos en render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

En los casos en los que no puede definir la propiedad de forma estática (por ejemplo, porque necesita encerrar las props y/o el estado del componente), el `<Mouse>` debería extender `React.Component` en su lugar.
