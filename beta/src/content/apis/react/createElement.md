---
title: createElement
---

<Intro>

`createElement` te permite crear un elemento React. Sirve como alternativa a la escritura de [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Creando un elemento sin JSX {/*creating-an-element-without-jsx*/}

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

Los <CodeStep step={3}>children</CodeStep> son opcionales, y puedes pasar tantos como tu necesites (el ejemplo anterior tiene tres hijos). Este código mostrará un encabezado `<h1>` con un saludo. A modo de comparación, aquí está el mismo ejemplo reescrito con JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Para renderizar tu propio componente de React, pasas una función como `Greeting` como el <CodeStep step={1}>type</CodeStep> en lugar de un `'h1'`:

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

<DeepDive title="Qué es exactamente un elemento React?">

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

* `props`: El argumento `props` debe ser un objeto o `null`. Si tu le pasas `null`, será tratado igual que un objecto vacio. React creará un elemento con props que coincidan con el `props` que tu has pasado. Ten en cuenta que `ref` y `key` de tu objecto `props` son especiales y lo harán *no* estar disponible como `element.props.ref` y `element.props.key` en el `element` devuelto. Estarán disponibles como `element.ref` y `element.key`.

* **opcional** `...children`: Cero o más nodos. Pueden ser cualquier nodo de React, incluidos Elementos de React, strings, números, [portales](/apis/react-dom/createPortal), nodos vacíos (`null`, `undefined`, `true`, y `false`), y arreglos con nodos de React.

#### Returns {/*returns*/}

`createElement` devuelve un objecto React element con algunas propiedades:

* `type`: El `type` que pasaste.
* `props`: Los `props` que pasaste excepto `ref` y `key`. Si el `type` es un componente con `type.defaultProps` heredado, entonces cualquier `props` que falte o `props` indefinidas obtendrá los valores de `type.defaultProps`.
* `ref`: El `ref` que pasaste. Si no lo pasaste es, `null`.
* `key`: El `key` que pasaste, forzado a ser string. Si no lo pasaste es, `null`.

Por lo general, devolverá el elemento de tu componente o lo convertirá en hijo de otro elemento. Aunque puedes leer las propiedades del elemento, es mejor tratar cada elemento como opaco después de su creación, y solo renderizarlo.

#### Advertencias {/*caveats*/}

* Debes **tratar elementos React y sus props como [immutables](https://es.wikipedia.org/wiki/Objeto_inmutable)** y nunca cambiar sus contenidos después de la creación. En desarrollo, React [congelaría](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) el elemento devuelto y su propiedad `props` para hacer cumplir esto.

* Cuando usas JSX, **debe comenzar una etiqueta con una letra mayúscula para representar tu propio componente personalizado.** En otras palabras, `<Something />` es equivalente a `createElement(Something)`, pero `<something />` (minúscula) es equivalente a `createElement('something')` (ten encuenta que es un string, por lo que se tratará como una etiqueta de HTML normal).

* Solo deberías **pasar children como múltiples argumentos para `createElement` si todos son estáticamente conocidos,** como `createElement('h1', {}, child1, child2, child3)`. Si tus children son dinámicos, pasa todo el arreglo como tercer argumento: `createElement('ul', {}, listItems)`. Esto asegura que React [advertirá sobre la falta de `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) para cualquier lista dinámica. Para las listas estáticas, esto no es necesario porque nunca se reordenan.
