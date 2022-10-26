---
title: Children
---

<Pitfall>

Usando `Children` es poco común y puede conducir a un código frágil. [Ver alternativas comunes.](#alternatives)

</Pitfall>

<Intro>

`Children` te permite manipular y transformar el JSX que recibes como el [`children` prop.](/learn/passing-props-to-a-component#passing-jsx-as-children)

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

## Uso {/*usage*/}

### Transformar children {/*transforming-children*/}

Para transformar el JSX de tu componente [que recibe como el `children` prop,](/learn/passing-props-to-a-component#passing-jsx-as-children) llama `Children.map`:

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

En el ejemplo anterior, el `RowList` envuelve cada child que recibe un `<div className="Row>` contenedor. Por ejemplo, digamos que el componente padre pasa tres etiquetas `<p>` como el `children` prop a `RowList`:

```js
<RowList>
  <p>Este es el primer elemento.</p>
  <p>Este es el segundo elemento.</p>
  <p>Este es el tercer elemento.</p>
</RowList>
```

Después, con la implementación anterior del `RowList`, el resultado final renderizado se verá así:

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

`Children.map` es similar [a la transformación de arrays con `map()`.](/learn/rendering-lists) La diferencia es que el `children` se considera la estructura de datos *opaque.* Esto significa que incluso si a veces es un array, no debe asumir que es un array o cualquier otro tipo de datos en particular. Esta es la razón por la que debes usar `Children.map` si necesitas transformarlo.

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

<DeepDive title="Porqué el children prop no siempre es un array?">

En React, el `children` prop es considerado una estructura de datos *opaque*. Esto significa que no debe confiar en cómo está estructurado. Para transformar, filtrar, o contar children, deberías usar los métodos `Children`.

En la practica, la estructura de datos `children` a menudo se representa como un array internamente. Sin embargo, Si solo hay un child, entonces React no creará un array extra ya que esto conduciría a una sobrecarga de memoria innecesaria. Siempre y cuando use los métodos `Children` en lugar de hacer una introspección directa de los `children` prop, tú código no se romperá incluso si React cambia la forma en que se implementa realmente la estructura de datos.

Incluso cuando `children` es un array, `Children.map` tiene un comportamiento especial útil. Por ejemplo, `Children.map` combina las [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key) en los elementos devueltos en las keys del `children` que has pasado a ella. Esto asegura que los JSX children originales no "pierdan" las keys incluso si se envuelven como en el ejemplo anterior.

</DeepDive>

<Pitfall>

La estructura de datos `children` **no incluye el output renderizado** de los componentes que pasas como JSX. En el siguiente ejemplo, El `children` recibido por el `RowList` solo contiene dos elementos en lugar de tres:

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

**No hay forma de obtener el output renderizado de un componente interno** como `<MoreRows />` al manipular `children`. Esta es la razón por [normalmente es mejor usar una de las soluciones alternativas.](#alternatives)

</Pitfall>

---

### Corriendo un código para cada child {/*running-some-code-for-each-child*/}

Llama `Children.forEach` para iterar sobre cada child en la estructura de datos `children`. No devuelve ningún valor y es similar al [método array `forEach`.](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Puede usarlo para ejecutar una lógica personalizada como construir su propio array.

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
  result.pop(); // Remueve el ultimo separator
  return result;
}
```

</Sandpack>

<Pitfall>

Como se mencionó anteriormente, no hay forma de obtener el output renderizado de un componente interno al manipular `children`. Esta es la razón por [normalmente es mejor usar una de las soluciones alternativas.](#alternatives)

</Pitfall>

---

### Contar children {/*counting-children*/}

Llama `Children.count(children)` para calcular el número de children.

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

Como se mencionó anteriormente, no hay forma de obtener el output renderizado de un componente interno al manipular `children`. Esta es la razón por [normalmente es mejor usar una de las soluciones alternativas.](#alternatives)

</Pitfall>

---

### Convertir children a un array {/*converting-children-to-an-array*/}

Llama `Children.toArray(children)` para convertir la estructura de datos `children` en un array de JavaScript regular. Esto le permite manipular el array con métodos de array integrados como [`filter`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), ó [`reverse`.](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) 

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

Como se mencionó anteriormente, no hay forma de obtener el output renderizado de un componente interno al manipular `children`. Esta es la razón por [normalmente es mejor usar una de las soluciones alternativas.](#alternatives)

</Pitfall>

---

## Alternativas {/*alternatives*/}

<Note>

En esta sección se describen alternativas a la API `Children` (con `C` mayúscula) eso es importado asi:

```js
import { Children } from 'react';
```

No lo confundas con [Uso de `children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) (`c` minúscula), lo cual es bueno y alentador.

</Note>

### Exponer varios componentes {/*exposing-multiple-components*/}

Manipular children con los métodos `Children` a menudo conduce a un código frágil. Cuando tú pasas un children a un componente en JSX, por lo general, no espera que el componente manipule o transforme al children individualmente.

Cuando pueda, trate de evitar el uso de los métodos `Children`. Por ejemplo, si quieres que cada child de `RowList` este envuelto en `<div className="Row">`, exporte un componente `Row` y envuelve manualmente cada Row dentro de él de esta manera:

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

A diferencia de usar `Children.map`, este enfoque no envuelve a todos los child automáticamente. **Sin embargo, este enfoque tiene un beneficio significativo en comparación con el [ejemplo anterior con `Children.map`](#transforming-children) porque funciona incluso si sigues extrayendo más componentes.** Por ejemplo, todavía funciona si extrae su propio componente `MoreRows`:

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

Esto no funcionaría con `Children.map` porque "vería" `<MoreRows />` como un solo child (y un solo row).

---

### Aceptar un array de objetos como prop {/*accepting-an-array-of-objects-as-a-prop*/}

También puede pasar explícitamente un array como prop. Por ejemplo, este `RowList` acepta el array `rows` como un prop :

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

Ya que `rows` es un array regular de JavaScript, el componente `RowList` puede usar métodos de matriz incorporados como [`map`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map) en el.

Este patrón es especialmente útil cuando desea poder pasar más información como datos estructurados junto con un children. En el siguiente ejemplo, el componente `TabSwitcher` recibe un array de objetos `tabs` como prop:

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

A diferencia de pasar el children como JSX, este enfoque le permite asociar algunos datos adicionales como `header` con cada elemento. Porque estás trabajando con las `tabs` directamente, y es una matriz, no necesita los métodos `Children`.

---

### Llamar a un accesorio de representación para personalizar la representación {/*calling-a-render-prop-to-customize-rendering*/}

En lugar de producir JSX para cada artículo, también puede pasar una función que devuelve JSX, y llamar a esa función cuando sea necesario. En este ejemplo, el componente `App` pasa una función `renderContent` al componente `TabSwitcher`. El componente `TabSwitcher` llama `renderContent` solo para el tab seleccionado:

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
        return <p>Este es el {tabId} elemento.</p>;
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

Un prop como `renderContent` se llama como *render prop*. Porque es un prop que especifica cómo representar una parte de la interfaz de usuario. Sin embargo, no tiene nada de especial: es un prop regular que resulta ser una función.

Render props son funciones, por lo que les puedes pasar información. Por ejemplo, este componente `RowList` pasa el `id` y el `index` por cada fila del render prop `renderRow`, que usa `index` para resaltar las filas pares:

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
            <p>Este es el {id} elemento.</p>
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

Este es otro ejemplo de cómo los componentes padre e hijo pueden cooperar sin manipular a los children.

---

## Referencia {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Llama `Children.count(children)` para contar el numero children en la estructura de datos `children`.

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

[Ver más ejemplos anteriores.](#counting-children)

#### Parámetros {/*children-count-parameters*/}

* `children`: el valor de [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recibido por tú componente.

#### Regresa {/*children-count-returns*/}

El numero de nodos de estos `children`.

#### Advertencias {/*children-count-caveats*/}

- Nodos vacíos (`null`, `undefined`, y Booleans), strings, numbers, y [React elements](/apis/react/createElement) cuentan como nodos individuales. Arrays no cuentan como arreglos individuales, pero sus children si. **El recorrido no va más profundo que React elements:** ellos no se renderizan, y sus children no son afectados. [Fragments](/apis/react/Fragment) no son afectados.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Llamar `Children.forEach(children, fn, thisArg?)` para correr algún código por cada child en la estructura de datos `children`.

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

[Ver más ejemplos anteriores.](#running-some-code-for-each-child)

#### Parámetros {/*children-foreach-parameters*/}

* `children`: El valor de [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recibido por tú componente.
* `fn`: La función que desea ejecutar para cada child, similar al callback del [método array `forEach`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Se llamará con el child como primer argumento y su index como segundo argumento. el index empieza en `0` y se incrementa por cada llamada.
* **opcional** `thisArg`: El [valor `this`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this) con el que se debe llamar a la función `fn`. Si se omite, es `undefined`.

#### Regresa {/*children-foreach-returns*/}

`Children.forEach` regresa `undefined`.

#### Advertencias {/*children-foreach-caveats*/}

- Nodos vacíos (`null`, `undefined`, y Booleans), strings, numbers, y [React elements](/apis/react/createElement) cuentan como nodos individuales. Arrays no cuentan como arreglos individuales, pero sus children si. **El recorrido no va más profundo que React elements:** ellos no se renderizan, y sus children no son afectados. [Fragments](/apis/react/Fragment) no son afectados.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Llamar `Children.map(children, fn, thisArg?)` para mapear o transformar cada child en la estructura de datos `children`.

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

[Ver más ejemplos anteriores.](#transforming-children)

#### Parámetros {/*children-map-parameters*/}

* `children`: El valor de [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recibido por tú componente.
* `fn`: La función de mapeo, similar al callback del [método array `map`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Se llamará con el child como primer argumento y su index como segundo argumento. el index empieza en `0` y se incrementa por cada llamada. Necesitas regresar un React node de esta función. Esto puede ser un nodo vacío (`null`, `undefined`, o un Boolean), un string, un number, un React element, o un array de otros React nodes.
* **opcional** `thisArg`: El [valor `this`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this) con el que se debe llamar a la función `fn`. Si se omite, es `undefined`.

#### Regresa {/*children-map-returns*/}

Si `children` es `null` o `undefined`, regresa el mismo valor.

De lo contrario, devuelve un array plano que consta de los nodos que ha devuelto de la función `fn`. devuelta contendrá todos los nodos que devolvió excepto por `null` y `undefined`.

#### Advertencias {/*children-map-caveats*/}

- Nodos vacíos (`null`, `undefined`, y Booleans), strings, numbers, y [React elements](/apis/react/createElement) cuentan como nodos individuales. Arrays no cuentan como arreglos individuales, pero sus children si. **El recorrido no va más profundo que React elements:** ellos no se renderizan, y sus children no son afectados. [Fragments](/apis/react/Fragment) no son afectados.

- Si devuelve un elemento o un array de elementos con keys de `fn`, **las keys de los elementos devueltos se combinará automáticamente con la clave del elemento original correspondiente de `children`.** Cuando devuelves múltiples elementos de `fn` en una array, sus keys solo necesitan ser únicas localmente entre sí.

---

### `Children.only(children)` {/*children-only*/}


Llamar `Children.only(children)` para afirmar que `children` representa un solo React element.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Parámetros {/*children-only-parameters*/}

* `children`: El valor de [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recibido por tú componente.

#### Regresa {/*children-only-returns*/}

Si `children` [es un elemento valido,](/apis/react/isValidElement) regresa ese elemento.

De lo contrario, lanza un error.

#### Advertencias {/*children-only-caveats*/}

- Este método siempre se **lanza si pasas un array (como el valor de retorno de `Children.map`) como `children`.** En otras palabras, hace cumplir que `children` es un solo React element, no es que sea un array con un solo elemento.

---

### `Children.toArray(children)` {/*children-toarray*/}

Llamar `Children.toArray(children)` para crear un array a partir de la estructura de datos `children`.

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Parámetros {/*children-toarray-parameters*/}

* `children`: El valor de [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recibido por tú componente.

#### Regresa {/*children-toarray-returns*/}

Devuelve un array plano de elementos en `children`.

#### Advertencias {/*children-toarray-caveats*/}

- Nodos vacíos (`null`, `undefined`, y Booleans) se omitirán en el array devuelto. **Las keys de los elementos devueltos se calcularán a partir de las keys de los elementos originales y su nivel de anidamiento y posición.** Esto asegura que aplanar el array no introduzca cambios en el comportamiento.

---

## Solución de problemas {/*troubleshooting*/}

### Paso un componente personalizado, pero los métodos `Children` y no muestran su resultado de renderizado {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Supongamos que pasa dos children a `RowList` como esto:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

Si haces `Children.count(children)` dentro de `RowList`, obtendrás `2`. Incluso si `MoreRows` renderiza 10 elementos diferentes, o si vuelve `null`, `Children.count(children)`seguirá siendo `2`. Desde la perspectiva de `RowList`, solo "ve" el JSX que ha recibido. No "ve" las partes internas del componente `MoreRows`.

La limitación dificulta la extracción de un componente. Por eso las [alternativas](#alternatives) son preferibles al uso de `Children`.
