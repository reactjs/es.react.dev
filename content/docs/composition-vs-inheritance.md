---
id: composition-vs-inheritance
title: Composición vs. herencia
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React tiene un potente modelo de composición, y recomendamos usar composición en lugar de herencia para reutilizar código entre componentes.

En esta sección consideraremos algunos problemas en los que los desarrolladores nuevos en React a menudo emplean herencia, y mostraremos cómo los podemos resolver con composición.

## Contención {#containment}

Algunos componentes no conocen sus hijos de antemano. Esto es especialmente común para componentes como `Sidebar` o `Dialog` que representan "cajas" genéricas.

Recomendamos que estos componentes usen la prop especial children para pasar elementos hijos directamente en su resultado:

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

Esto permite que otros componentes les pasen hijos arbitrarios anidando el JSX:

```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

**[Pruébalo en CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

Cualquier cosa dentro de la etiqueta JSX `<FancyBorder>` se pasa dentro del componente `FancyBorder` como la prop `children`. Como `FancyBorder` renderiza `{props.children}` dentro de un `<div>`, los elementos que se le han pasado aparecen en el resultado final.

Aunque es menos común, a veces puedes necesitar múltiples "agujeros" en un componente. En estos casos puedes inventarte tu propia convención en lugar de usar `children`: 

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

Los elementos como `<Contacts />` y `<Chat />` son simplemente objetos, por lo que puedes pasarlos como props como cualquier otro dato. Este enfoque puede recordarte a "huecos" (slots) en otras bibliotecas, pero no hay limitaciones en lo que puedes pasar como props en React.

## Especialización {#specialization}

A veces pensamos en componentes como "casos concretos" de otros componentes. Por ejemplo, podríamos decir que un `WelcomeDialog` es un caso concreto de `Dialog`. 

En React, esto también se consigue por composición, en la que un componente más "específico" renderiza uno más "genérico" y lo configura con props:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

La composición funciona igual de bien para componentes definidos como clases:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          ¡Apúntame!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Bienvenido abordo, ${this.state.login}!`);
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## ¿Entonces qué pasa con la herencia? {#so-what-about-inheritance}

En Facebook usamos React en miles de componentes, y no hemos hallado ningún caso de uso en el que recomendaríamos crear jerarquías de herencia de componentes.

Las props y la composición te dan toda la flexibilidad que necesitas para personalizar el aspecto y el comportamiento de un componente de forma explícita y segura. Recuerda que los componentes pueden aceptar props arbitrarias, incluyendo valores primitivos, elementos de React y funciones. 

Si quieres reutilizar funcionalidad que no es de interfaz entre componentes, sugerimos que la extraigas en un módulo de JavaScript independiente. Los componentes pueden importarlo y usar esa función, objeto, o clase, sin extenderla.
