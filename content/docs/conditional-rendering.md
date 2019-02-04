---
id: conditional-rendering
title: Renderizado condicional
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

En React, puedes crear distintos componentes que encapsulan el comportamiento que necesitas. Entonces, puedes renderizar solamente algunos de ellos, dependiendo del estado de tu aplicación.

El renderizado condicional en React funciona de la misma forma que lo hacen las condiciones en JavaScript. Usa operadores de JavaScript como [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) o el [operador condicional](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/if...else) para crear elementos representando el estado actual, y deja que React actualice la UI para emparejarlos.

Considera estos dos componentes::

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

Vamos a crear un componente `Greeting` que muestra cualquiera de estos componentes dependiendo si el usuario ha iniciado sesión:

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Intentar cambiando isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Este ejemplo renderiza un saludo diferente según el valor de la prop `isLoggedIn`.

### Variables de elementos

Puedes usar variables para almacenar elementos. Esto puede ayudarte para renderizar condicionalmente una parte del componente mientras el resto del resultado no cambia.

Considera estos dos componentes nuevos que representan botones de Logout y Login:

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

En el siguiente ejemplo, crearemos un [componente con estado](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) llamado `LoginControl`.

El componente va a renderizar `<LoginButton  />` o `<LogoutButton />` dependiendo de su estado actual. También va a renderizar un `<Greeting  />` del ejemplo anterior:

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }
  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }
  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }
    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Si bien declarar una variable y usar una sentencia `if` es una buena forma de renderizar condicionalmente un componente, a veces podrías querer usar una sintaxis más corta. Hay algunas formas de hacer condiciones en la misma línea en JSX, explicadas a continuación.

### If en la misma línea con operador lógico &&

Puedes [embeber cualquier expresión en JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) envolviéndola en llaves. Esto incluye al operador lógico `&&` de JavaScript. Puede ser ùtil para incluir condicionalmente un elemento:

```js{6-10}
function Buzon(props) {
  const mensajesNoLeidos = props.mensajesNoLeidos;
  return (
    <div>
      <h1>¡Hola!</h1>
      {mensajesNoLeidos.length > 0 &&
        <h2>
          Tienes {mensajesNoLeidos.length} mensajes sin leer.
        </h2>
      }
    </div>
  );
}

const mensajes = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Buzon mensajesNoLeidos={mensajes} />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Funciona porque en JavaScript, `true && expresión` siempre evalúa a `expresión`, y `false && expresión` siempre evalúa a `false`.

Por eso, si la condición es `true`, el elemento just después de `&&` aparecerá en el resultado. Si es `false`, React lo ignorará.

### en la misma línea If-Else con operador condicional

Otro método para el renderizado condicional en la misma línea de elementos es usar el operador condicional [`condición ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) de JavaScript.

En el siguiente ejemplo, lo usaremos para renderizar de forma condicional un bloque de texto pequeño.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      El usuario <b>{isLoggedIn ? 'está' : 'no está'}</b> conectado.
    </div>
  );
}
```

También puede usarse para expresiones más grandes, aunque es menos obvio lo que está pasando:

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.manejarClickCierreSesion} />
      ) : (
        <LoginButton  onClick={this.manejarClickInicioSesion} />
      )}
    </div>
  );
}
```

Al igual que en JavaScript, depende de ti elegir un estilo apropiado en base a lo que a ti y a tu equipo consideran más legible. Recuerda también que cuando las condiciones se vuelven demasiado complejas, puede ser un buen momento para [extraer un componente](/docs/components-and-props.html#extracting-components).

### Evitar que el componente se renderice

En casos excepcionales, es posible que desees que un componente se oculte a sí mismo aunque haya sido renderizado por otro componente. Para hacer esto, devuelve `null` en lugar del resultado de render.

En el siguiente ejemplo, el `<BannerAdvertencia />` se renderiza dependiendo del valor de la prop llamada `advertencia`. Si el valor de la prop es `false`, entonces el componente no se renderiza:

```javascript{2-4,29}
function BannerAdvertencia(props) {
  if (!props.advertencia) {
    return null;
  }

  return (
    <div className="advertencia">
     ¡Advertencia!
    </div>
  );
}

class Pagina extends React.Component {
  constructor(props) {
    super(props);
    this.state = {advertencia: true};
    this.manejarClickConmutacion = this.manejarClickConmutacion.bind(this);
  }

  manejarClickConmutacion() {
    this.setState(state => ({
      Advertencia: !state.advertencia
    }));
  }

  render() {
    return (
      <div>
        <BannerAdvertencia advertencia={this.state.advertencia} />
        <button onClick={this.manejarClickConmutacion}>
          {this.state.advertencia ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Pagina />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Devolviendo `null` desde el método `render` de un componente no influye en la activación de los métodos del ciclo de vida del componente. Por ejemplo `componentDidUpdate` seguirá siendo llamado.


