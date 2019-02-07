---
id: react-without-jsx
title: React Without JSX
permalink: docs/react-without-jsx.html
---

JSX no es un requisito para usar React. Usar react sin JSX es especialmente conveniente cuando no necesitas configurar herramientas de compilacion en tu ambiente de desarrollo.

Cada elemento JSX es solamente azucar sintactico para llamar `React.createElement(component, props, ...children)`. Por lo tanto, cualquier cosa que se pueda hacer con JSX se puede hacer con Javascript puro.

Por ejemplo, este código escrito con JSX:

```js
class Hello extends React.Component
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```
se puede compilar a este que no usa JSX:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Si tienes curiosidad por ver mas ejemplos de como JSX se convierte a Javascript, puedes probar el [compilador en linea de Babel](babel://jsx-simple-example).

El componente puede ser proporcionada como una cadena, o como una subclase de `React.Component`, o una función simple para componentes sin estado.

Si te cansas de escribir tanto `React.createElement`, un patrón común es assignarlo a una variable corta:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

Si usas esta forma abreviada para `React.createElement`, puede ser casi tan conveniente usar React sin JSX.

Alternativamente, puedes referefirte a proyectos comunitarios como [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) y [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) que ofrecen una sintaxis terser.
