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
var ReactTestUtils = require('react-dom/test-utils'); // ES5 with npm
```

## Introducción

`ReactTestUtils` facilita probar los componentes de React en cualquiera de los frameworks de pruebas que elijas. En Facebook usamos [Jest](https://facebook.github.io/jest/) para realizar las pruebas de JavaScript sin problemas. Aprende como iniciar con Jest en el [tutorial para React](http://facebook.github.io/jest/docs/en/tutorial-react.html#content) que se encuentra en el sitio web de Jest.

> Nota:
>
> We recommend using [`react-testing-library`](https://git.io/react-testing-library) which is designed to enable and encourage writing tests that use your components as the end users do.
>
> Alternatively, Airbnb has released a testing utility called [Enzyme](http://airbnb.io/enzyme/), which makes it easy to assert, manipulate, and traverse your React Components' output.

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

## Referencia

### `act()`

To prepare a component for assertions, wrap the code rendering it and performing updates inside an `act()` call. This makes your test run closer to how React works in the browser.

>Note
>
>If you use `react-test-renderer`, it also provides an `act` export that behaves the same way.

For example, let's say we have this `Counter` component:

```js
class App extends React.Component {
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

Here is how we can test it:

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
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

Don't forget that dispatching DOM events only works when the DOM container is added to the `document`. You can use a helper like [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) to reduce the boilerplate code.

* * *

### `mockComponent()`

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Pasa un módulo de un componente a simular a este método para mejorarlo con métodos útiles los cuales permiten que sea utilizado como un componente de React simulado. En lugar de renderizar de la forma usual, el componente simplemente se convertirá en un `<div>` (u otra etiqueta si se proporciona `mockTagName`) que contiene cualquiera de los hijos proporcionados.

> Nota:
>
> `mockComponent()` es una API heredada. En su lugar, recomendamos usar [renderizado superficial](/docs/test-utils.html#shallow-rendering) o [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

* * *

### `isElement()`

```javascript
isElement(element)
```

Retorna `true` si `element` es cualquier elemento de React.

* * *

### `isElementOfType()`

```javascript
isElementOfType(
  element,
  componentClass
)
```

Retorna `true` si `element` es un Elemento de React cuyo tipo es un `componentClass` de React.

* * *

### `isDOMComponent()`

```javascript
isDOMComponent(instance)
```

Retorna `true` si `instance` es un componente del DOM (tal como un `<div>` o `<span>`).

* * *

### `isCompositeComponent()`

```javascript
isCompositeComponent(instance)
```

Retorna `true` si `instance` es un componente definido por el usuario, tal como una clase o una función.

* * *

### `isCompositeComponentWithType()`

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Retorna `true` si `instance` es un componente cuyo tipo es un `componentClass` de React.

* * *

### `findAllInRenderedTree()`

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Navega por todos los componentes en `tree` y acumula todos los componentes en donde `test(component)` sea `true`. Esto no es útil por sí solo, pero es utilizado como primitivo para otras utilidades de prueba.

* * *

### `scryRenderedDOMComponentsWithClass()`

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Encuentra todos los elementos en el DOM de componentes presentes en el árbol de renderizado que sean componentes del DOM cuyo nombre de clase sea `className`.

* * *

### `findRenderedDOMComponentWithClass()`

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Igual a [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) pero espera que sólo haya un resultado, y retorna ese único resultado, de lo contrario lanza una excepción si hay algún otro número de coincidencias diferentes a una.

* * *

### `scryRenderedDOMComponentsWithTag()`

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Encuentra todos los elementos en el DOM de componentes presentes en el árbol de renderizado que sean componentes del DOM cuyo nombre de etiqueta sea igual a `tagName`.

* * *

### `findRenderedDOMComponentWithTag()`

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Igual a [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) pero espera que sólo haya un resultado y retorna ese único resultado, de lo contario lanza una excepción si hay algún otro número de coincidencias diferentes a una.

* * *

### `scryRenderedComponentsWithType()`

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Encuentra todas las instancias de componentes cuyo tipo sea igual a `componentClass`.

* * *

### `findRenderedComponentWithType()`

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Igual a [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) pero espera que sólo haya un resultado y retorna ese único resultado, de lo contrario lanza una excepción si hay algún otro número de coincidencias diferentes a una.

***

### `renderIntoDocument()`

```javascript
renderIntoDocument(element)
```

Render a React element into a detached DOM node in the document. **This function requires a DOM.** It is effectively equivalent to:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Note:
>
> You will need to have `window`, `window.document` and `window.document.createElement` globally available **before** you import `React`. Otherwise React will think it can't access the DOM and methods like `setState` won't work.

* * *

## Other Utilities

### `Simulate`

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Simulate an event dispatch on a DOM node with optional `eventData` event data.

`Simulate` has a method for [every event that React understands](/docs/events.html#supported-events).

**Clicking an element**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Changing the value of an input field and then pressing ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Note
>
> You will have to provide any event property that you're using in your component (e.g. keyCode, which, etc...) as React is not creating any of these for you.

* * *
