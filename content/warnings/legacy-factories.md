---
title: React Element Factories and JSX Warning
layout: single
permalink: warnings/legacy-factories.html
---

Probablemente llegaste aquí porque tu código está llamando tu componente como una función. Esto es ahora obsoleto:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // WARNING
}
```

## JSX {#jsx}

Los componentes de React ya no pueden ser llamados directamente de esta manera. En su lugar [puedes usar JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Sin JSX {#without-jsx}

Si no quieres o no puedes usar JSX, tendrás entonces que envolver tu componente en un *factory* antes de llamarlo:

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

Esta es una ruta de actualización fácil si ya tienes muchas llamadas como función.

## Componentes dinámicos sin JSX {#dynamic-components-without-jsx}

Si recibes un componente de clase de forma dinámica, entonces probablemente sea innecesario crear un *factory* para invocarlo inmediatamente. En su lugar puedes simplemente crear tu elemento en línea:

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## En profundidad {#in-depth}

[Lee más acerca de POR QUÉ estamos haciendo este cambio.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
