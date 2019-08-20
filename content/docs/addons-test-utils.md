---
id: test-utils
title: Utilidades para pruebas
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Importando**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 con npm
```

## Introducción {#overview}

`ReactTestUtils` facilita probar los componentes de React en cualquiera de los frameworks de pruebas que elijas. En Facebook usamos [Jest](https://facebook.github.io/jest/) para realizar las pruebas de JavaScript sin problemas. Aprende como iniciar con Jest en el [tutorial para React](https://jestjs.io/docs/tutorial-react) que se encuentra en el sitio web de Jest.

> Nota:
>
> Recomendamos utilizar [React Testing Library](https://testing-library.com/react) que está diseñada para permitir e incentivar la escritura de las pruebas para que usen los componentes de la misma forma en que lo harían los usuarios finales.
>
> Como otra opción, Airbnb ha liberado una utilidad de pruebas llamada [Enzyme](https://airbnb.io/enzyme/), que hace fácil asegurar, manipular y navegar por los resultados de tus Componentes de React.

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Referencia {#reference}

### `act()` {#act}

Para preparar la asertividad en un componente, debes envolver el código que lo renderiza y que realiza actualizaciones sobre este en un llamado a `act()`. Esto hace que tus pruebas corran de una forma más parecida a como lo hace React en el navegador.

>Nota
>
>Si usas `react-test-renderer`, este también provee un método `act` que se comporta de la misma forma.

Por ejemplo, digamos que tenemos este componente `Counter`:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>
          Click me
        </button>
      </div>
    );
  }
}
```

Y así es como podemos probarlo:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Prueba la primer renderización y componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Prueba la segunda renderización y componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

No olvides que la ejecución de eventos del DOM solo funciona cuando el contenedor del DOM es agregado al `document`. Puedes utilizar una biblioteca como [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) para reducir todo el código repetitivo.

- El documento de [`recetas`](/docs/testing-recipes.html) contiene más detalles de cómo funciona `act()`, con ejemplos y usos.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Pasa un módulo de un componente a simular a este método para mejorarlo con métodos útiles los cuales permiten que sea utilizado como un componente de React simulado. En lugar de renderizar de la forma usual, el componente simplemente se convertirá en un `<div>` (u otra etiqueta si se proporciona `mockTagName`) que contiene cualquiera de los hijos proporcionados.

> Nota:
>
> `mockComponent()` es una API heredada. En su lugar, recomendamos usar [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Retorna `true` si `element` es cualquier elemento de React.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Retorna `true` si `element` es un Elemento de React cuyo tipo es un `componentClass` de React.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Retorna `true` si `instance` es un componente del DOM (tal como un `<div>` o `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Retorna `true` si `instance` es un componente definido por el usuario, tal como una clase o una función.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Retorna `true` si `instance` es un componente cuyo tipo es un `componentClass` de React.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Navega por todos los componentes en `tree` y acumula todos los componentes en donde `test(component)` sea `true`. Esto no es útil por sí solo, pero es utilizado como primitiva para otras utilidades de prueba.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Encuentra todos los elementos en el DOM de componentes presentes en el árbol de renderizado que sean componentes del DOM cuyo nombre de clase sea `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Igual a [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) pero espera que solo haya un resultado, y retorna ese único resultado, de lo contrario lanza una excepción si hay algún otro número de coincidencias diferentes a una.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Encuentra todos los elementos en el DOM de componentes presentes en el árbol de renderizado que sean componentes del DOM cuyo nombre de etiqueta sea igual a `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Igual a [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) pero espera que solo haya un resultado y retorna ese único resultado, de lo contario lanza una excepción si hay algún otro número de coincidencias diferentes a una.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Encuentra todas las instancias de componentes cuyo tipo sea igual a `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Igual a [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) pero espera que solo haya un resultado y retorna ese único resultado, de lo contrario lanza una excepción si hay algún otro número de coincidencias diferentes a una.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Renderiza un Elemento de React en un nodo separado del DOM en el documento. **Esta función requiere un DOM.** Esto es equivalente a hacer:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Nota:
>
> Necesitarás tener `window`, `window.document` y `window.document.createElement` habilitados de forma global **antes** de importar `React`. De otro modo React pensará que no tiene acceso al DOM y los métodos como `setState` no funcionarán.

* * *

## Otras utilidades {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Simula la ejecución de un evento en un nodo del DOM con los datos de evento `eventData` opcionales.

`Simulate` tiene un método para [cada uno de los eventos que React entiende](/docs/events.html#supported-events).

**Haciendo clic en un elemento**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Cambiando el valor en un campo de entrada y presionando ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Nota
>
> Tendrás que proveer cualquiera de las propiedades del evento que se esté usando en tu componente (p.e. keyCode, which, etc...) ya que React no creará ninguna de estas por ti.

* * *
