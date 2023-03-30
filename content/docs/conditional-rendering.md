---
id: conditional-rendering
title: Renderizado condicional
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

> Prueba la nueva documentación de React.
> 
> Estas nuevas páginas de la documentación enseñan React moderno e incluyen ejemplos interactivos:
>
> - [Renderizado condicional](https://beta.es.reactjs.org/learn/conditional-rendering)
>
> La nueva documentación reemplazará próximamente este sitio, que será archivado. [Deja tu opinión aquí](https://github.com/reactjs/reactjs.org/issues/3308)

En React, puedes crear distintos componentes que encapsulan el comportamiento que necesitas. Entonces, puedes renderizar solamente algunos de ellos, dependiendo del estado de tu aplicación.

El renderizado condicional en React funciona de la misma forma que lo hacen las condiciones en JavaScript. Usa operadores de JavaScript como [`if`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/if...else) o el [operador condicional](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Conditional_Operator) para crear elementos representando el estado actual, y deja que React actualice la interfaz de usuario para emparejarlos.

Considera estos dos componentes:

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

const root = ReactDOM.createRoot(document.getElementById('root')); 
// Intentar cambiando isLoggedIn={true}:
root.render(<Greeting isLoggedIn={false} />);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Este ejemplo renderiza un saludo diferente según el valor del prop `isLoggedIn`.

### Variables de elementos {#element-variables}

Puedes usar variables para almacenar elementos. Esto puede ayudarte para renderizar condicionalmente una parte del componente mientras el resto del resultado no cambia.

Considera estos dos componentes nuevos que representan botones de cierre e inicio de sesión:

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

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<LoginControl />);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Si bien declarar una variable y usar una sentencia `if` es una buena forma de renderizar condicionalmente un componente, a veces podrías querer usar una sintaxis más corta. Hay algunas formas de hacer condiciones en una línea en JSX, explicadas a continuación.

### If en una línea con operador lógico && {#inline-if-with-logical--operator}

Puedes [incluir expresiones en JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) envolviéndolas en llaves. Esto incluye el operador lógico `&&` de JavaScript. Puede ser útil para incluir condicionalmente un elemento:

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<Mailbox unreadMessages={messages} />);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Esto funciona porque en JavaScript, `true && expresión` siempre evalúa a `expresión`, y `false && expresión` siempre evalúa a `false`.

Por eso, si la condición es `true`, el elemento justo después de `&&` aparecerá en el resultado. Si es `false`, React lo ignorará.

Ten en cuenta que retornar expresiones falsas hará que el elemento después de '&&' sea omitido pero retornará el valor falso. En el ejemplo de abajo, '<div>0</div>' será retornado por el método de renderizado.

```javascript{2,5}
render() {
  const count = 0;
  return (
    <div>
      {count && <h1>Messages: {count}</h1>}
    </div>
  );
}
```

### If-Else en una línea con operador condicional {#inline-if-else-with-conditional-operator}

Otro método para el renderizado condicional de elementos en una línea es usar el operador condicional [`condición ? true : false`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Conditional_Operator) de JavaScript.

En el siguiente ejemplo, lo usaremos para renderizar de forma condicional un pequeño bloque de texto.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
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
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

Al igual que en JavaScript, depende de ti elegir un estilo apropiado según lo que tú y tu equipo consideren más legible. Recuerda también que cuando las condiciones se vuelven demasiado complejas, puede ser un buen momento para [extraer un componente](/docs/components-and-props.html#extracting-components).

### Evitar que el componente se renderice {#preventing-component-from-rendering}

En casos excepcionales, es posible que desees que un componente se oculte a sí mismo aunque haya sido renderizado por otro componente. Para hacer esto, devuelve `null` en lugar del resultado de renderizado.

En el siguiente ejemplo, el `<WarningBanner />` se renderiza dependiendo del valor del prop llamado `warn`. Si el valor del prop es `false`, entonces el componente no se renderiza:

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }
  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }
  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }
  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<Page />);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

El devolver `null` desde el método `render` de un componente no influye en la activación de los métodos del ciclo de vida del componente. Por ejemplo `componentDidUpdate` seguirá siendo llamado.


