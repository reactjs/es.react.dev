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
> Airbnb ha liberado una utilidad para pruebas llamada Enzyme, que hace fácil asegurar, manipular y navegar por el resultado de sus Componentes de React. Si está decidiendo que utilidad para pruebas unitarias utilizar junto con Jest u otra herramienta para pruebas, vale la pena darle un vistazo a: [http://airbnb.io/enzyme/](http://airbnb.io/enzyme/)
>
> Como otra opción, también hay otra utilidad para pruebas llamada react-testing-library diseñada para permitir e incentivar el escribir las pruebas de sus componentes de la misma forma en que los usuarios finales los usarían. De igual forma, funciona con cualquiera de los ejecutores de pruebas: [https://git.io/react-testing-library](https://git.io/react-testing-library)

 - [`Simulate`](#simulate)
 - [`renderIntoDocument()`](#renderintodocument)
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

## Referencia

## Renderizado superficial

Cuando se escriben pruebas de unidad para React, el renderizado superficial puede ser de ayuda. El renderizado superficial permite renderizar el componente "un nivel de profundidad" y asegurar lo que su método de renderizado retorna, sin preocuparse acerca del comportamiento de los componentes hijos, los cuales no son instanciados o renderizados. Esto no requiere de un DOM.

> Nota:
>
> El renderizado superficial se ha movido a `react-test-renderer/shallow`.<br>
> [Puede encontrar más información sobre el renderizado superficial en su página de referencia](/docs/shallow-renderer.html)

## Otras utilidades

### `Simulate`

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Simula la ejecución de un evento en un nodo del DOM con los datos opcionales de evento `eventData`.

`Simulate` tiene un método para [cada uno de los eventos que React comprende](/docs/events.html#supported-events).

**Haciendo clic en un elemento**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Cambiar el valor en un campo de entrada y presionar ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Nota
>
> Se debe proveer cualquiera de las propiedades del evento que se esté usando en tu componente (p.e. keyCode, which, etc...) ya que React no creará ninguna de estas por ti.

* * *

### `renderIntoDocument()`

```javascript
renderIntoDocument(element)
```

Renderiza un Elemento de React en un nodo separado del DOM en el documento. **Esta función requiere un DOM**

> Nota:
>
> Necesitará tener `window`, `window.document` y `window.document.createElement` habilitados de forma global **antes** de importar `React`. De otro modo React pensará que no tiene acceso al DOM y los métodos como `setState` no funcionarán.

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

* * *
