---
id: fragmentos
title: Fragmentos
permalink: docs/fragmentos.html
---
Un patrón común en React es que un componente devuelva multiples elementos. Los Fragments le permiten agrupar una lista de hijos sin agregar nodos extra al DOM.

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

También hay una nueva [sintaxis corta](#short-syntax) para declararlos, pero aún no es soportada por todas las herramientas populares.

## Motivación

Un patrón común es que un componente devuelva una lista de hijos. Tome este código de ejemplo en React:

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

`<Columns />` tendría que devolver múltiples elementos `<td>` para que el código HTML renderizado sea valido. Si un div padre fue utilizado dentro del código `render()` de `<Columns />`, entonces el código HTML resultante será inválido.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hola</td>
        <td>Mundo</td>
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
      <td>Hola</td>
      <td>Mundo</td>
    </div>
  </tr>
</table>
```

Los Fragments solucionan este problema.

## Uso

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hola</td>
        <td>Mundo</td>
      </React.Fragment>
    );
  }
}
```

que resulta en una correcta salida de `<Table />` de:

```jsx
<table>
  <tr>
    <td>Hola</td>
    <td>Mundo</td>
  </tr>
</table>
```

### Sintaxis corta

Hay una sintaxis nueva, más corta que puede usar para declarar fragments. Parecen etiquetas vacías:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hola</td>
        <td>Mundo</td>
      </>
    );
  }
}
```

Puede utilizar `<></>` de la misma manera que usaría cualquier otro elemento, excepto que este no soporta llaves o atributos.

Considere que: **[muchas herramientas no lo soportan aún](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)**, por lo que podría escribir explícitamente `<React.Fragment>` hasta que las herramientas se pongan al día.

### Fragments incrustados

Fragments declarados con la sintaxis explícita `<React.Fragment>` pueden tener llaves. Un caso de uso para esto es el mapeo de una colección a un arreglo de fragmento -- por ejemplo, para crear una lista de descripción:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Sin la 'key', React disparará una advertencia de key
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

### Demostración en vivo

Puede probar la nueva sintaxis de fragmentos JSX con este [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).