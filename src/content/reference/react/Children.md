---
title: Children
---

<Pitfall>

El uso de `Children` es poco común y puede conducir a un código frágil. [Ver alternativas comunes.](#alternatives)

</Pitfall>

<Intro>

`Children` te permite manipular y transformar el JSX que recibes como la [prop `children`.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Llama `Children.count(children)` para contar el número de hijos en la estructura de datos `children`.

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Filas totales: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[Ver más ejemplos abajo.](#counting-children)

#### Parámetros {/*children-count-parameters*/}

* `children`: el valor de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) que recibe tu componente.

#### Devuelve {/*children-count-returns*/}

El número de nodos dentro de estos hijos (`children`).

#### Advertencias {/*children-count-caveats*/}

- Nodos vacíos (`null`, `undefined`, y booleanos), strings, números, y [elementos de React](/apis/react/createElement) cuentan como nodos individuales. Los *arrays* no cuentan como nodos individuales, pero sus hijos sí. **El recorrido no va más profundo que al nivel de los elementos de React:** no se renderizan, y no se recorren sus hijos. Los [Fragmentos](/apis/react/Fragment) no se recorren.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Llama a `Children.forEach(children, fn, thisArg?)` para correr algún código por cada hijo en la estructura de datos `children`.

```js RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Ver más ejemplos abajo.](#running-some-code-for-each-child)

#### Parámetros {/*children-foreach-parameters*/}

* `children`: El valor de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) que recibe por tu componente.
* `fn`: La función que deseas ejecutar para cada hijo, similar al callback del [método array `forEach`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Se llamará con el hijo como primer argumento y su índice como segundo argumento. El índice empieza en `0` y se incrementa por cada llamada.
* **opcional** `thisArg`: El [valor `this`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this) con el que se debe llamar a la función `fn`. Si se omite, es `undefined`.

#### Devuelve {/*children-foreach-returns*/}

`Children.forEach` devuelve `undefined`.

#### Advertencias {/*children-foreach-caveats*/}

- Nodos vacíos (`null`, `undefined`, y booleanos), strings, números, y [elementos de React](/apis/react/createElement) cuentan como nodos individuales. Los *arrays* no cuentan como nodos individuales, pero sus hijos si. **El recorrido no va más profundo que al nivel de los elementos de React:** no se renderizan, y sus hijos no se recorren. Los [Fragmentos](/apis/react/Fragment) no se recorren.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Llamar `Children.map(children, fn, thisArg?)` para mapear o transformar cada hijo en la estructura de datos `children`.

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Ver más ejemplos abajo.](#transforming-children)

#### Parámetros {/*children-map-parameters*/}

* `children`: El valor de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) que recibe por tu componente.
* `fn`: La función de mapeo, similar al *callback* del [método `map` de un *array*](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Se llamará con el hijo como primer argumento y su índice como segundo argumento. El índice empieza en `0` y se incrementa por cada llamada. Necesitas devolver un nodo de React de esta función. Puede ser un nodo vacío (`null`, `undefined`, o un booleano), un string, un número, un elemento de React, o un *array* de otros nodos de React.
* **opcional** `thisArg`: El [valor `this`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this) con el que se debe llamar a la función `fn`. Si se omite, es `undefined`.

#### Devuelve {/*children-map-returns*/}

Si `children` es `null` o `undefined`, devuelve el mismo valor.

De lo contrario, devuelve un array plano que consta de los nodos que ha devuelto de la función `fn`. El *array* devuelto contendrá todos los nodos que devolviste excepto por `null` y `undefined`.

#### Advertencias {/*children-map-caveats*/}

- Nodos vacíos (`null`, `undefined`, y booleanos), strings, números, y [elementos de React](/apis/react/createElement) cuentan como nodos individuales. Los *arrays* no cuentan como nodos individuales, pero sus hijos sí. **El recorrido no va más profundo que al nivel de los elementos de React:** no se renderizan, y no se recorren sus hijos. Los [Fragmentos](/apis/react/Fragment) no se recorren.

- Si devuelve un elemento o un *array* de elementos con _keys_ desde `fn`, **las _keys_ de los elementos devueltos se combinarán automáticamente con la clave del elemento original correspondiente de `children`.** Cuando devuelves múltiples elementos desde `fn` en un *array*, sus _keys_ solo necesitan ser únicas localmente entre sí.

---

### `Children.only(children)` {/*children-only*/}


Llamar `Children.only(children)` para comprobar que `children` representa un solo elemento de React.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Parámetros {/*children-only-parameters*/}

* `children`: El valor de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) que recibe tu componente.

#### Devuelve {/*children-only-returns*/}

Si `children` [es un elemento válido,](/apis/react/isValidElement) devuelve ese elemento.

De lo contrario, lanza un error.

#### Advertencias {/*children-only-caveats*/}

- Este método siempre **lanza un error si pasas un *array* (como el valor de retorno de `Children.map`) como `children`.** En otras palabras, hace cumplir que `children` es un solo elemento de React, no que sea un *array* con un solo elemento.

---

### `Children.toArray(children)` {/*children-toarray*/}

Llama `Children.toArray(children)` para crear un array a partir de la estructura de datos `children`.

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Parámetros {/*children-toarray-parameters*/}

* `children`: El valor de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) que recibe tu componente.

#### Devuelve {/*children-toarray-returns*/}

Devuelve un array plano de los elementos de `children`.

#### Advertencias {/*children-toarray-caveats*/}

- Nodos vacíos (`null`, `undefined`, y booleanos) se omitirán en el *array* devuelto. **Las _keys_ de los elementos devueltos se calcularán a partir de las _keys_ de los elementos originales y su nivel de anidamiento y posición.** Esto asegura que aplanar el array no introduzca cambios en el comportamiento.

---

## Uso {/*usage*/}

### Transformar children {/*transforming-children*/}

Para transformar el JSX de tu componente [que recibe como la prop `children`,](/learn/passing-props-to-a-component#passing-jsx-as-children) llama a `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

En el ejemplo anterior, `RowList` envuelve cada hijo que recibe en un contenedor `<div className="Row>`. Por ejemplo, digamos que el componente padre pasa tres etiquetas `<p>` como la prop `children` a `RowList`:

```js
<RowList>
  <p>Este es el primer elemento.</p>
  <p>Este es el segundo elemento.</p>
  <p>Este es el tercer elemento.</p>
</RowList>
```

Después, con la implementación anterior de `RowList`, el resultado final renderizado se verá así:

```js
<div className="RowList">
  <div className="Row">
    <p>Este es el primer elemento.</p>
  </div>
  <div className="Row">
    <p>Este es el segundo elemento.</p>
  </div>
  <div className="Row">
    <p>Este es el tercer elemento.</p>
  </div>
</div>
```

`Children.map` es similar [a la transformación de *arrays* con `map()`.](/learn/rendering-lists) La diferencia es que la estructura de datos de `children` se considera *opaca.* Esto significa que incluso si a veces es un *array*, no debes asumir que es un *array* o cualquier otro tipo de datos en particular. Esta es la razón por la que debes usar `Children.map` si necesitas transformarla.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Este es el primer elemento.</p>
      <p>Este es el segundo elemento.</p>
      <p>Este es el tercer elemento.</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

<DeepDive>

#### ¿Por qué la prop `children` no siempre es un *array*? {/*why-is-the-children-prop-not-always-an-array*/}

En React, la prop `children` se considera una estructura de datos *opaca*. Esto significa que no debes confiar en cómo está estructurada. Para transformar, filtrar, o contar children, deberías usar los métodos `Children`.

En la practica, la estructura de datos `children` a menudo se representa como un array internamente. Sin embargo, si solo hay un hijos, entonces React no creará un array extra ya que esto conduciría a una sobrecarga de memoria innecesaria. Siempre y cuando uses los métodos `Children` en lugar de hacer una introspección directa de los prop `children`, tú código no se romperá incluso si React cambia la forma en que se implementa realmente la estructura de datos.

Incluso cuando `children` es un array, `Children.map` tiene un comportamiento especial útil. Por ejemplo, `Children.map` combina las [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key) en los elementos devueltos en las _keys_ del `children` que le has pasado. Esto asegura que los hijos JSX originales no "pierdan" las _keys_ incluso si se envuelven como en el ejemplo anterior.

</DeepDive>

<Pitfall>

La estructura de datos `children` **no incluye la salida renderizada** de los componentes que pasas como JSX. En el siguiente ejemplo, los hijos (`children`) recibidos por el `RowList` solo contienen dos elementos en lugar de tres:

1. `<p>Este es el primer elemento</p>`
2. `<MoreRows />`

Esta es la razón por la que solo se generan dos contenedores de fila en este ejemplo:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Este es el primer elemento.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>Este es el segundo elemento.</p>
      <p>Este es el tercer elemento.</p>
    </>
  );
}
```

```js RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

**No hay forma de obtener la salida renderizada de un componente interno** como `<MoreRows />` al manipular `children`. Esta es la razón por la que [normalmente es mejor usar una de las soluciones alternativas.](#alternatives)

</Pitfall>

---

### Ejecutar un código para cada hijo {/*running-some-code-for-each-child*/}

Llama a `Children.forEach` para iterar sobre cada hijo en la estructura de datos `children`. No devuelve ningún valor y es similar al [método `forEach` de un *array*.](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Puedes usarlo para ejecutar una lógica personalizada como construir tu propio *array*.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>Este es el primer elemento.</p>
      <p>Este es el segundo elemento.</p>
      <p>Este es el tercer elemento.</p>
    </SeparatorList>
  );
}
```

```js SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Eliminar el último separator
  return result;
}
```

</Sandpack>

<Pitfall>

Como se mencionó anteriormente, no hay forma de obtener la salida renderizada de un componente interno al manipular `children`. Esta es la razón por la que [normalmente es mejor usar una de las soluciones alternativas.](#alternatives)

</Pitfall>

---

### Contar hijos {/*counting-children*/}

Llama `Children.count(children)` para calcular el número de hijos.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Este es el primer elemento.</p>
      <p>Este es el segundo elemento.</p>
      <p>Este es el tercer elemento.</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Filas totales: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Como se mencionó anteriormente, no hay forma de obtener la salida renderizada de un componente interno al manipular `children`. Esta es la razón por la que [normalmente es mejor usar una de las soluciones alternativas.](#alternatives)

</Pitfall>

---

### Convertir children a un array {/*converting-children-to-an-array*/}

Llama `Children.toArray(children)` para convertir la estructura de datos `children` en un array de JavaScript regular. Esto te permite manipular el array con métodos de array integrados como [`filter`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), o [`reverse`.](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) 

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>Este es el primer elemento.</p>
      <p>Este es el segundo elemento.</p>
      <p>Este es el tercer elemento.</p>
    </ReversedList>
  );
}
```

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Como se mencionó anteriormente, no hay forma de obtener la salida renderizada de un componente interno al manipular `children`. Esta es la razón por la que [normalmente es mejor usar una de las soluciones alternativas.](#alternatives)

</Pitfall>

---

## Alternativas {/*alternatives*/}

<Note>

En esta sección se describen alternativas a la API `Children` (con `C` mayúscula) que se importa de esta manera:

```js
import { Children } from 'react';
```

No lo confundas con el [uso de la prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) (`c` minúscula), lo cual es bueno y recomendado.

</Note>

### Exponer varios componentes {/*exposing-multiple-components*/}

Manipular hijos con los métodos de `Children` a menudo conduce a un código frágil. Cuando pasas hijos a un componente en JSX, por lo general, no esperas que el componente manipule o transforme los hijos individuales.

Cuando puedas, trata de evitar el uso de los métodos de `Children`. Por ejemplo, si quieres que cada hijo de `RowList` esté envuelto en `<div className="Row">`, exporta un componente `Row` y envuelve manualmente cada fila dentro de él de esta manera:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Este es el primer elemento.</p>
      </Row>
      <Row>
        <p>Este es el segundo elemento.</p>
      </Row>
      <Row>
        <p>Este es el tercer elemento.</p>
      </Row>
    </RowList>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

A diferencia de usar `Children.map`, este enfoque no envuelve a todos los hijos automáticamente. **Sin embargo, este enfoque tiene un beneficio significativo en comparación con el [ejemplo anterior con `Children.map`](#transforming-children) porque funciona incluso si sigues extrayendo más componentes.** Por ejemplo, todavía funciona si extraes tu propio componente `MoreRows`:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Este es el primer elemento.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>Este es el segundo elemento.</p>
      </Row>
      <Row>
        <p>Este es el tercer elemento.</p>
      </Row>
    </>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

Esto no funcionaría con `Children.map` porque "vería" `<MoreRows />` como un solo hijo (y una sola fila).

---

### Aceptar un *array* de objetos como prop {/*accepting-an-array-of-objects-as-a-prop*/}

También puedes pasar explícitamente un *array* como prop. Por ejemplo, este `RowList` acepta el array `rows` como una prop:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>Este es el primer elemento.</p> },
      { id: 'second', content: <p>Este es el segundo elemento.</p> },
      { id: 'third', content: <p>Este es el tercer elemento.</p> }
    ]} />
  );
}
```

```js RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

Ya que `rows` es un *array* regular de JavaScript, el componente `RowList` puede usar métodos de incorporados de *arrays* como [`map`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map) en él.

Este patrón es especialmente útil cuando deseas poder pasar más información como datos estructurados junto con los hijos. En el siguiente ejemplo, el componente `TabSwitcher` recibe un array de objetos `tabs` como prop:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>Este es el primer elemento.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>Este es el segundo elemento.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>Este es el tercer elemento.</p>
      }
    ]} />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

A diferencia de pasar los hijos como JSX, este enfoque te permite asociar algunos datos adicionales como `header` con cada elemento. Como estás trabajando con `tabs` directamente, y es un *array*, no necesita los métodos de `Children`.

---

### Llamar a una prop de renderizado para adaptar el renderizado {/*calling-a-render-prop-to-customize-rendering*/}

En lugar de producir JSX para cada elemento, también puedes pasar una función que devuelva JSX, y llamar a esa función cuando sea necesario. En este ejemplo, el componente `App` pasa una función `renderContent` al componente `TabSwitcher`. El componente `TabSwitcher` llama a `renderContent` solo para la pestaña (*tab*) seleccionada:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['primero', 'segundo', 'tercero']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>Este es el elemento {tabId}.</p>;
      }}
    />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

Una prop como `renderContent` se llama *render prop* o prop de renderizado, porque es un prop que especifica cómo representar una parte de la interfaz de usuario. Sin embargo, no tiene nada de especial: es una prop regular que resulta ser una función.

Las props de renderizado son funciones, por lo que les puedes pasar información. Por ejemplo, este componente `RowList` pasa el `id` y el `index` de cada fila a la prop de renderizado `renderRow`, que usa `index` para resaltar las filas pares:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['primero', 'segundo', 'tercero']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>Este es el elemento {id}.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Filas totales: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Este es otro ejemplo de cómo los componentes padre e hijo pueden cooperar sin manipular a los hijos.

---

## Solución de problemas {/*troubleshooting*/}

### Paso un componente personalizado, pero los métodos de `Children` no muestran su resultado del renderizado {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Supongamos que pasa dos hijos a `RowList` como esto:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

Si haces `Children.count(children)` dentro de `RowList`, obtendrás `2`. Incluso si `MoreRows` renderiza 10 elementos diferentes, o si devuelve `null`, `Children.count(children)`seguirá siendo `2`. Desde la perspectiva de `RowList`, solo "ve" el JSX que ha recibido. No "ve" las partes internas del componente `MoreRows`.

La limitación dificulta la extracción de un componente. Por eso las [alternativas](#alternatives) son preferibles al uso de `Children`.
