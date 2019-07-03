---
id: fragments
title: Fragmentos
permalink: docs/fragments.html
---
Un patrón común en React es que un componente devuelva múltiples elementos. Los Fragmentos te permiten agrupar una lista de hijos sin agregar nodos extra al DOM.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

También hay una nueva [sintaxis corta](#short-syntax) para declararlos.

## Motivación {#motivation}

Un patrón común es que un componente devuelva una lista de hijos. Toma este código de ejemplo en React:

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` tendría que devolver múltiples elementos `<td>` para que el código HTML renderizado sea válido. Si un div padre fue utilizado dentro del código `render()` de `<Columns />`, entonces el código HTML resultante será inválido.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

resulta en una salida de `<Table />` de:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Los Fragmentos solucionan este problema.

## Uso {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

que resulta en una salida correcta de `<Table />` de:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Sintaxis corta {#short-syntax}

Hay una sintaxis nueva, más corta que puedes usar para declarar fragmentos. Parecen etiquetas vacías:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

Puedes utilizar `<></>` de la misma manera que usarías cualquier otro elemento, excepto que este no soporta llaves o atributos.

### Fragmentos incrustados {#keyed-fragments}

Fragmentos declarados con la sintaxis explícita `<React.Fragment>` pueden tener llaves. Un caso de uso para esto es el mapeo de una colección a un arreglo de fragmentos -- por ejemplo, para crear una lista de descripción:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Sin el prop 'key', React disparará una advertencia de key
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` es el único atributo que se puede pasar a `Fragment`. En el futuro, vamos a agregar soporte para atributos adicionales como manejadores de eventos.

### Demostración en vivo {#live-demo}

Puedes probar la nueva sintaxis de fragmentos JSX con este [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
