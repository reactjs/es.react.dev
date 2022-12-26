---
title: createElement
---

<Intro>

`createElement` te permite crear un elemento React. Sirve como alternativa a escribir [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

<<<<<<< HEAD:beta/src/content/apis/react/createElement.md
## Uso {/*usage*/}
=======
## Reference {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Call `createElement` to create a React element with the given `type`, `props`, and `children`.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `type`: The `type` argument must be a valid React component type. For example, it could be a tag name string (such as `'div'` or `'span'`), or a React component (a function, a class, or a special component like [`Fragment`](/reference/react/Fragment)).

* `props`: The `props` argument must either be an object or `null`. If you pass `null`, it will be treated the same as an empty object. React will create an element with props matching the `props` you have passed. Note that `ref` and `key` from your `props` object are special and will *not* be available as `element.props.ref` and `element.props.key` on the returned `element`. They will be available as `element.ref` and `element.key`.

* **optional** `...children`: Zero or more child nodes. They can be any React nodes, including React elements, strings, numbers, [portals](/reference/react-dom/createPortal), empty nodes (`null`, `undefined`, `true`, and `false`), and arrays of React nodes.

#### Returns {/*returns*/}

`createElement` returns a React element object with a few properties:

* `type`: The `type` you have passed.
* `props`: The `props` you have passed except for `ref` and `key`. If the `type` is a component with legacy `type.defaultProps`, then any missing or undefined `props` will get the values from `type.defaultProps`.
* `ref`: The `ref` you have passed. If missing, `null`.
* `key`: The `key` you have passed, coerced to a string. If missing, `null`.

Usually, you'll return the element from your component or make it a child of another element. Although you may read the element's properties, it's best to treat every element as opaque after it's created, and only render it.

#### Caveats {/*caveats*/}

* You must **treat React elements and their props as [immutable](https://en.wikipedia.org/wiki/Immutable_object)** and never change their contents after creation. In development, React will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) the returned element and its `props` property shallowly to enforce this.

* When you use JSX, **you must start a tag with a capital letter to render your own custom component.** In other words, `<Something />` is equivalent to `createElement(Something)`, but `<something />` (lowercase) is equivalent to `createElement('something')` (note it's a string, so it will be treated as a built-in HTML tag).

* You should only **pass children as multiple arguments to `createElement` if they are all statically known,** like `createElement('h1', {}, child1, child2, child3)`. If your children are dynamic, pass the entire array as the third argument: `createElement('ul', {}, listItems)`. This ensures that React will [warn you about missing `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) for any dynamic lists. For static lists this is not necessary because they never reorder.

---

## Usage {/*usage*/}
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a:beta/src/content/reference/react/createElement.md

### Crear un elemento sin JSX {/*creating-an-element-without-jsx*/}

Si no te gusta [JSX](/learn/writing-markup-with-jsx) o no puedes usarlo en tu proyecto, puedes usar `createElement` como alternativa.

Para crear un elemento sin JSX, llamas a `createElement` con <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>props</CodeStep> y <CodeStep step={3}>children</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

Los <CodeStep step={3}>children</CodeStep> son opcionales, y puedes pasar tantos como necesites (el ejemplo anterior tiene tres hijos). Este código mostrará un encabezado `<h1>` con un saludo. A modo de comparación, aquí está el mismo ejemplo reescrito con JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Para renderizar tu propio componente de React, pasas una función como `Greeting` como el <CodeStep step={1}>type</CodeStep> en lugar de un string como `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

Con JSX, se vería así:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

Aquí hay un ejemplo completo escrito con `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Y aquí está el mismo ejemplo usando JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Ambos estilos de código están bien, por lo que puedes usar el que prefieras para tu proyecto. El principal beneficio de usar JSX en comparación con `createElement` es que es fácil ver qué etiqueta de cierre corresponde a qué etiqueta de apertura.

<DeepDive>

#### ¿Qué es exactamente un elemento React? {/*what-is-a-react-element-exactly*/}

Un elemento es una descripción ligera de una pieza de la interfaz de usuario. Por ejemplo, ambos `<Greeting name="Taylor" />` y `createElement(Greeting, { name: 'Taylor' })` producen un objeto como este:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Ten en cuenta que crear este objeto no representa el componente `Greeting` o crear cualquier elemento del DOM.**

Un elemento React es más como una descripción — una instrucción para React para luego renderizar el componente `Greeting`. Al devolver este objeto en tu componente `App`, le dices a React qué hacer a continuación.

Crear elementos es extremadamente barato, por lo que no necesita intentar optimizarlo o evitarlo.

</DeepDive>
<<<<<<< HEAD:beta/src/content/apis/react/createElement.md

---

## Referencia {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Llamar `createElement` para crear un elemento de React con `type`, `props`, y `children`.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[Ver más ejemplos arriba.](#usage)

#### Parámetros {/*parameters*/}

* `type`: El argumento `type` debe ser un tipo de componente de React válido. Por ejemplo, podría ser un string con el nombre de una etiqueta (como `'div'` o `'span'`), o un componente de React (una función, una clase, o un componente especial como [`Fragment`](/apis/react/Fragment)).

* `props`: El argumento `props` debe ser un objeto o `null`. Si tu le pasas `null`, será tratado igual que un objecto vacío. React creará un elemento con props que coincidan con las `props` que has pasado. Ten en cuenta que `ref` y `key` de tu objecto `props` son especiales y lo harán *no* estar disponible como `element.props.ref` y `element.props.key` en el `element` devuelto. Estarán disponibles como `element.ref` y `element.key`.

* **opcional** `...children`: Cero o más nodos. Pueden ser cualquier nodo de React, incluidos Elementos de React, strings, números, [portales](/apis/react-dom/createPortal), nodos vacíos (`null`, `undefined`, `true`, y `false`), y arrays con nodos de React.

#### Devuelve {/*returns*/}

`createElement` devuelve un objecto React element con algunas propiedades:

* `type`: El `type` que pasaste.
* `props`: Los `props` que pasaste excepto `ref` y `key`. Si el `type` es un componente con `type.defaultProps` heredado, entonces cualquier `props` que falte o `props` indefinidas obtendrá los valores de `type.defaultProps`.
* `ref`: La `ref` que pasaste. Si no la pasaste es, `null`.
* `key`: La `key` que pasaste, forzada a ser string. Si no la pasaste es, `null`.

Por lo general, devolverá el elemento de tu componente o lo convertirá en hijo de otro elemento. Aunque puedes leer las propiedades del elemento, es mejor tratar cada elemento como opaco después de su creación, y solo renderizarlo.

#### Advertencias {/*caveats*/}

* Debes **tratar los elementos React y sus props como [inmutables](https://es.wikipedia.org/wiki/Objeto_inmutable)** y nunca cambiar sus contenidos después de creados. En desarrollo, React [congelaría](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) superficialmente el elemento devuelto y sus `props` para hacer cumplir esto.

* Cuando usas JSX, **debes comenzar una etiqueta con una letra mayúscula para renderizar tu propio componente personalizado.** En otras palabras, `<Something />` es equivalente a `createElement(Something)`, pero `<something />` (minúscula) es equivalente a `createElement('something')` (ten encuenta que es un string, por lo que se tratará como una etiqueta de HTML normal).

* Solo deberías **pasar children como múltiples argumentos para `createElement` si todos son estáticamente conocidos,** como `createElement('h1', {}, child1, child2, child3)`. Si tus children son dinámicos, pasa todo el arreglo como tercer argumento: `createElement('ul', {}, listItems)`. Esto asegura que React [advertirá sobre la falta de `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) para cualquier lista dinámica. Para las listas estáticas, esto no es necesario porque nunca se reordenan.
=======
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a:beta/src/content/reference/react/createElement.md
