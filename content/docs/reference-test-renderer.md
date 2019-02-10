---
id: test-renderer
title: Renderizador de Prueba
permalink: docs/test-renderer.html
layout: docs
category: Referencia
---

**Importando**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 with npm
```

## Resumen {#overview}

Este paquete proporciona un procesador de React que se puede usar para procesar componentes de React a objetos JavaScript puros, sin depender del DOM o de un entorno móvil nativo.

Básicamente, este paquete facilita tomar una instantánea de la jerarquía de la vista de la plataforma (similar a un árbol DOM) representada por un componente React DOM o React Nativo sin usar un navegador o [jsdom](https://github.com/tmpvar/jsdom).

Ejemplo:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Puede usar la función de pruebas de instantánea (`snapshot`) de Jest para guardar automáticamente una copia del árbol JSON en un archivo y comprobar en sus pruebas que no ha cambiado: [Aprende más sobre ello](http://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

También puede recorrer la salida para encontrar nodos específicos y hacer afirmaciones sobre ellos.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)

### Instancias de TestRenderer {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Referencia {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Crea una instancia `TestRenderer` con el elemento React pasado como argumento. No utiliza el DOM real, pero aún así representa completamente el árbol de componentes en memoria para que puedas hacer afirmaciones al respecto. La instancia devuelta tiene los siguientes métodos y propiedades.

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Devuelve un objeto que representa el árbol renderizado en formato `JSON`. Este árbol solo contiene los nodos específicos de la plataforma como `<div>` o `<View>` y sus `props`, pero no contiene ningún componente escrito por el usuario. Esta representación es práctica para usarla en [pruebas de instantanea (`snapshot`)](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Devuelve un objeto que representa el árbol renderizado. A diferencia de `toJSON()`, la representación es más detallada, e incluye los componentes escritos por el usuario. Probablemente no necesites de este método al menos que estes escribiendo tu propia biblioteca de afirmaciones sobre el renderizador de prueba.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Re-renderiza el nuevo árbol en memoria con un nuevo elemento raíz. Esto simula una actualización de React en la raíz. Si el nuevo elemento posee el mismo tipo y `key` del elemento anterior, el árbol será actualizado, de lo contrario se re-montara un nuevo árbol.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Desmonta el árbol en memoria, generando los eventos apropiados del ciclo de vida.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Devuelve la instancia correspondiente a la raíz del elemento, si está disponible. Este método no funciona si el elemento raíz es un componente funcional, ya que los mismos no poseen instancias.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Devuelve el objeto `test instance` de la raíz, el cual es útil para realizar afirmaciones acerca de nodos específicos en el árbol. Este puede ser usado para buscar otros objetos `test instance` ubicados más profundo en el árbol del componente.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Busca un único objeto `test instance` descendiente para el cual `test(testInstance)` devuelve `true`. Si `test(testInstance)` no devuelve `true` para exactamente una sola instancia, entonces genera un error.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Busca un único objeto `test instance` descendiente con el `type` pasado como argumento. Si no existe un único descendiente con el tipo provisto genera un error.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Busca un único objeto `test instance` descendiente con los `props` pasados como argumento. Si no existe un único descendiente con los `props` genera un error.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Busca todos los objetos `test instance` descendientes para los cuales `test(testInstance)` devuelve `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Busca todos los objetos `test instance` descendientes con el tipo (`type`) pasado como argumento.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```


Busca todos los objetos `test instance` descendientes con los `props` pasados como argumento.
Find all descendant test instances with the provided `props`.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

La instancia de componente correspondiente a este objeto `test instance`. Está únicamente disponible para componentes de clase, ya que los componentes funcionales no poseen instancias. Es equivalente al valor de `this` dentro del componente.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

El tipo del componente que corresponde a este objeto `test instance`. Por ejemplo, un componente `<Button />` tiene un tipo `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

Los `props` correspondientes a este objeto `test instance`. Por ejemplo, un componente `<Button size="small" />` tiene las siguientes propiedades: `{size: 'small'}`.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

El objeto `test instance` padre.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Los objetos `test instance` hijos directos.

## Ideas {#ideas}

La función `TestRenderer.create` puede recibir una opción `createNodeMock` la cual permite la creación de `refs` adaptados para ser usados como objetos falsos en pruebas. `createNodeMock` acepta el elemento actual y debe retornar un objeto `ref` falso. Esto es útil cuando se necesita realizar pruebas sobre un componente que depende de `ref`

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock a focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
