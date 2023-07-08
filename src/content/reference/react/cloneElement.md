---
title: cloneElement
---

<Pitfall>

El uso de `cloneElement` no es común y puede conducir a un código frágil. [Mira alternativas comunes.](#alternatives)

</Pitfall>

<Intro>

`cloneElement` te permite crear un nuevo elemento de React usando otro elemento como punto de partida.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `cloneElement(elemento, props, ...children)` {/*cloneelement*/}

Llama a `cloneElement` para crear un elemento React basado en el `elemento`, pero con diferentes `props` y `children`:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage">Goodbye</Row>
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `elemento`: El argumento `elemento` debe ser un elemento de React válido. Por ejemplo, podría ser un nodo JSX como `<Something />`, el resultado de llamar a [`createElement`](/reference/react/createElement), o el resultado de otra llamada a `cloneElement`.

* `props`: El argumento `props` debe ser un objeto o `null`. Si pasas `null`, el elemento clonado mantendrá todos los `element.props` originales. De lo contrario, para cada propiedad en el objeto `props`, el elemento devuelto "preferirá" el valor de `props` sobre el valor de `element.props`. El resto de las propiedades se completarán a partir de los `element.props` originales. Si pasas `props.key` o `props.ref`, reemplazarán a los originales.

* **opcional** `...children`: Cero o más nodos hijo. Pueden ser cualquier nodo React, incluidos elementos de React, cadenas, números, [portales](/reference/react-dom/createPortal), nodos vacíos (`null`, `undefined`, `true`, y `false`), y *arrays* de nodos de React. Si no pasas ningún argumento `...children`, se conservarán los `element.props.children` originales.

#### Devuelve {/*returns*/}

`cloneElement` devuelve un objeto de elemento de React con algunas propiedades:

* `type`: Igual que `element.type`.
* `props`: El resultado de mezclar superficialmente `element.props` con las `props` que has pasado para sobrescribirlas.
* `ref`: El `element.ref` original, a menos que se haya sobrescrito con `props.ref`.
* `key`: El `element.key` original, a menos que se haya sobrescrito con `props.key`.

Usualmente, devolverás el elemento desde tu componente o lo harás hijo de otro elemento. Aunque puedes leer las propiedades del elemento, es mejor tratar a cada elemento como opaco después de que se crea, y solo renderizarlo.

#### Advertencias {/*advertencias*/}

* Clonar un elemento **no modifica el elemento original.**

* Solo debes **pasar hijos como múltiples argumentos a `createElement` si todos son conocidos estáticamente**, como `cloneElement(element, null, child1, child2, child3)`. Si tus hijos son dinámicos, pasa todo el *array* como tercer argumento: `cloneElement(element, null, listItems)`. Esto garantiza que React te [advierta sobre las `key`s que faltan](/learn/rendering-lists#keeping-list-items-in-order-with-key) para cualquier lista dinámica. Para listas estáticas no es necesario porque nunca se reordenan.

* `cloneElement` hace que sea más difícil rastrear el flujo de datos, por lo que **prueba las [alternativas](/#alternatives) en su lugar.**

---

## Uso {/*usage*/}

### Sobrescribir props de un elemento {/*overriding-props-of-an-element*/}

Para sobrescribir las props de algún <CodeStep step={1}>elemento de React</CodeStep>, pásalo a `cloneElement` con las <CodeStep step={2}>props que quieres sobrescribir</CodeStep>:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Aquí, el <CodeStep step={3}>elemento clonado</CodeStep> resultante será `<Row title="Cabbage" isHighlighted={true} />`.

**Veamos un ejemplo para ver cuándo es útil.**

Imagina un componente `List` que renderiza sus [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) como una lista de filas seleccionables con un botón "Next" que cambia qué fila está seleccionada. El componente `List` necesita renderizar la `Row` seleccionada de manera diferente, por lo que clona cada hijo `<Row>` que ha recibido y agrega una propiedad extra `isHighlighted: true` o `isHighlighted: false`:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

Digamos que el JSX original recibido por `List` se ve así:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

Clonando sus hijos, `List` puede pasar información adicional a cada `Row` dentro. El resultado se ve así:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Observa cómo al presionar "Next" se actualiza el estado del `List`, y resalta una fila diferente:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Para resumir, `List` clonó los elementos `<Row />` que recibió y les agregó una propiedad extra.

<Pitfall>

Al clonar los hijos se hace difícil saber cómo fluye la información a través de tu aplicación. Intenta una de las [alternativas](#alternatives).

</Pitfall>

---

## Alternativas {/*alternatives*/}

### Pasar datos con una prop de renderizado {/*passing-data-with-a-render-prop*/}

En vez de usar `cloneElement`, considera aceptar una *render prop* (o prop de renderizado) como `renderItem`. Aquí, `List` recibe `renderItem` como una prop. `List` llama a `renderItem` para cada elemento y pasa `isHighlighted` como un argumento:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

La prop `renderItem` se llama una *"render prop"* porque es una propiedad que especifica cómo renderizar algo. Por ejemplo, puedes pasar una implementación de `renderItem` que renderice un `<Row>` con el valor `isHighlighted` dado:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

El resultado final es el mismo que con `cloneElement`:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Sin embargo, puedes rastrear claramente de dónde viene el valor `isHighlighted`.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Este patrón es preferido a `cloneElement` porque es más explícito.

---

### Pasar datos a través del contexto {/*passing-data-through-context*/}

Otra alternativa a `cloneElement` es [pasar datos a través del contexto.](/learn/passing-data-deeply-with-context)


Por ejemplo, puedes llamar a [`createContext`](/reference/react/createContext) para definir un `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

Tu componente `List` puede envolver cada elemento que renderiza en un proveedor de `HighlightContext`:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

Con este enfoque, `Row` no necesita recibir una propiedad `isHighlighted` en absoluto. En su lugar, lee del contexto:

```js Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

Esto permite que el componente que llama no sepa o se preocupe por pasar `isHighlighted` a `<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

En vez de eso, `List` y `Row` coordinan la lógica de resaltado a través del contexto.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Aprende más sobre pasar datos a través del contexto.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### Extraer lógica en un Hook personalizado {/*extracting-logic-into-a-custom-hook*/}

Otro enfoque que puedes probar es extraer la lógica "no visual" en tu propio Hook, y usar la información devuelta por tu Hook para decidir qué renderizar. Por ejemplo, puedes escribir un Hook personalizado `useList` como este:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Luego puedes usarlo así:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

El flujo de datos es explícito, pero el estado está dentro del Hook personalizado `useList` que puedes usar desde cualquier componente:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Este enfoque es particularmente útil si quieres reutilizar esta lógica entre diferentes componentes.

