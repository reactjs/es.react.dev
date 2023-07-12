---
title: Pensar en React
---

<Intro>

React puede cambiar tu forma de pensar en los diseños que miras y las aplicaciones que construyes. Cuando construyes una interfaz de usuario (UI) con React, primero la separarás en piezas denominadas *componentes*. Luego, describirás los diferentes estados visuales para cada uno de tus componentes. Para finalizar, conectarás tus componentes de forma tal que los datos fluyan por ellos. En este tutorial, te guiaremos en el proceso de pensamiento para construir una tabla de datos de productos con una funcionalidad de búsqueda usando React.

</Intro>

## Comienza con el boceto {/*start-with-the-mockup*/}

Imagina que ya tienes una API JSON y un boceto de un diseñador.

La API JSON devuelve algunos datos como estos:

```json
[
  { category: "Frutas", price: "$1", stocked: true, name: "Manzana" },
  { category: "Frutas", price: "$1", stocked: true, name: "Fruta del dragón" },
  { category: "Frutas", price: "$2", stocked: false, name: "Maracuyá" },
  { category: "Verduras", price: "$2", stocked: true, name: "Espinaca" },
  { category: "Verduras", price: "$4", stocked: false, name: "Calabaza" },
  { category: "Verduras", price: "$1", stocked: true, name: "Guisantes" }
]
```

El boceto luce así:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Para implementar una UI en React, a menudo seguirás los mismos cinco pasos.

## Paso 1: Separa la UI en una jerarquía de componentes {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Comienza por dibujar cuadros alrededor de cada componente y subcomponente en el boceto y nómbralos. Si trabajas con un diseñador puede que ya les haya dado nombres a estos componentes en su herramienta de diseño. ¡Chequea primero!

Dependiendo de tu formación y experiencia, puedes pensar en dividir un diseño en componentes de distintas maneras:

* **Programación**--utiliza las mismas técnicas para decidir si debes crear una nueva función o un objeto. Una de estas técnicas es el [principio de responsabilidad única](https://es.wikipedia.org/wiki/Principio_de_responsabilidad_única), es decir, lo ideal es que un componente sólo haga una cosa. Si termina creciendo, debería descomponerse en subcomponentes más pequeños.
* **CSS**--considera para qué harías selectores de clase. (Sin embargo, los componentes son un poco menos granulares).
* **Diseño**--considera cómo organizarías las capas del diseño.

Si tu JSON está bien estructurado, a menudo encontrarás que se corresponde naturalmente con la estructura de componentes de tu UI. Esto ocurre porque la UI y los modelos de datos a menudo tienen la misma arquitectura de información--o sea, la misma forma. Separa tu UI en componentes, de manera que cada componente se corresponda con una pieza de tu modelo de datos.

Hay cinco componentes en esta pantalla:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (gris) contiene toda la aplicación.
2. `SearchBar` (azul) recibe la entrada del usuario.
3. `ProductTable` (lavanda) muestra y filtra la lista de acuerdo a la entrada del usuario.
4. `ProductCategoryRow` (verde) muestra un encabezado para cada categoría.
5. `ProductRow`	(amarillo) muestra una fila para cada producto.

</CodeDiagram>

</FullWidth>

Si miras a `ProductTable` (lavanda), verás que el encabezado de la tabla (que contiene las etiquetas "Nombre"  y "Precio") no es un componente independiente. Esto es una cuestión de preferencias, y podrías hacerlo de ambas formas. Para este ejemplo, es parte de `ProductTable` porque aparece dentro de la lista de `ProductTable`. Sin embargo, si este encabezado crece y se vuelve complejo (por ejemplo, si añades ordenamiento), tendría sentido convertirlo en un componente independiente `ProductTableHeader`.

Ahora que has identificado los componentes en el boceto, ordénalos en una jerarquía:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Paso 2: Construye una versión estática en React {/*step-2-build-a-static-version-in-react*/}

Ahora que tienes tu jerarquía de componentes, es momento de implementar tu aplicación. El enfoque más sencillo consiste en construir una versión que renderiza la UI a partir de tu modelo de datos sin añadir ninguna interactividad... ¡Aún! A menudo es más fácil construir primero la versión estática y luego añadir la interactividad de forma independiente. Construir una versión estática requiere mucha escritura y poco pensamiento, pero añadir interactividad requiere mucho pensamiento y no mucha escritura.

Para construir la versión estática de tu aplicación que renderiza tu modelo de datos querrás construir [componentes](/learn/your-first-component) que reutilicen otros componentes y pasen datos usando [props](/learn/passing-props-to-a-component). Las props son una forma de pasar datos de padres a hijos. (Si estás familiarizado con el concepto de [estado](/learn/state-a-components-memory) no utilices nada de estado para construir esta versión estática. El estado se reserva solo para la interactividad, o sea, datos que cambian con el tiempo. Dado que esto es una versión estática de la aplicación, no lo necesitas).

Puedes construir "de arriba hacia abajo" empezando por construir los componentes más arriba en la jerarquía (como `FilterableProductTable`) o "de abajo hacia arriba" trabajando a partir de los componentes más abajo (como `ProductRow`). En ejemplos más simples, suele ser más fácil ir de arriba hacia abajo, y en proyectos más grandes, es más fácil ir de abajo hacia arriba.

<Sandpack>

```jsx App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Frutas", price: "$1", stocked: true, name: "Manzana"},
  {category: "Frutas", price: "$1", stocked: true, name: "Fruta del dragón"},
  {category: "Frutas", price: "$2", stocked: false, name: "Maracuyá"},
  {category: "Verduras", price: "$2", stocked: true, name: "Espinaca"},
  {category: "Verduras", price: "$4", stocked: false, name: "Calabaza"},
  {category: "Verduras", price: "$1", stocked: true, name: "Guisantes"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Si este código te parece intimidante, revisa primero el [Inicio rápido](/learn/)).

Después de construir tus componentes, tendrás una biblioteca de componentes reutilizables que renderizan tu modelo de datos. Dado que esta es una aplicación estática, los componentes solo devuelven JSX. El componente en la cima de la jerarquía (`FilterableProductTable`) tomará tu modelo de datos como una prop. Este se conoce como _flujo de datos en un sentido_, porque estos datos fluyen hacia abajo desde el componente en el nivel superior hacia aquellos que están al final del árbol.

<Pitfall>

En este punto, no deberías estar usando ningún valor de estado. ¡Eso es para el próximo paso!

</Pitfall>

## Paso 3: Encuentra la representación mínima pero completa del estado de la UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Para hacer la UI interactiva, necesitas dejar que los usuarios cambien tu modelo de datos. Para esto utilizarás *estado*.

Piensa en el estado como el conjunto mínimo de datos cambiantes que la aplicación necesita recordar. El principio más importante para estructurar datos es mantenerlos [DRY (*Don't Repeat Yourself* o No te repitas)](https://es.wikipedia.org/wiki/No_te_repitas). Encuentra la representación absolutamente mínima del estado que tu aplicación necesita y calcula lo demás bajo demanda. Por ejemplo, si estás construyendo una lista de compra, puedes almacenar los elementos en un arreglo en el estado. Si también quieres mostrar el número de elementos en la lista, no almacenes el número de elementos como otro valor de estado--en cambio, lee el tamaño de tu arreglo.

Ahora piensa en todas la piezas de datos en esta aplicación de ejemplo:

1. La lista original de productos
2. El texto de búsqueda que el usuario ha escrito
3. El valor del *checkbox*
4. La lista de productos filtrada

¿Cuáles de estos son estado? Identifica los que no lo son:

* ¿Se **mantiene sin cambios** con el tiempo? Si es así, no es estado.
* ¿Se **pasa desde un padre** por props? Si es así, no es estado.
* ¿**Puedes calcularlo** basado en estado existente on en props en tu componente? Si es así, ¡*definitivamente* no es estado!

Lo que queda probablemente es estado.

Veámoslos uno por uno nuevamente:

1. La lista original de productos se **pasa como props, por lo que no es estado**.
2. El texto de búsqueda parece ser estado dado que cambia con el tiempo y no puede ser calculado a partir de algo más.
3. El valor del *checkbox* parece ser estado porque cambia con el tiempo y no puede ser calculado a partir de algo más.
4. La lista filtrada de productos **no es estado porque puede ser calculada** tomando la lista original de productos y filtrándola de acuerdo al texto de búsqueda y el valor del *checkbox*.

¡Esto significa que solo el texto de búsqueda y el valor del *checkbox* son estado! ¡Bien hecho!

<DeepDive>

#### Props vs. estado {/*props-vs-state*/}

Hay dos formas de "modelar" datos en React: props y estado. Las dos son muy diferentes:

* [Las **props** son como argumentos que pasas](/learn/passing-props-to-a-component) a una función. Le permiten a un componente padre pasar datos a un componente hijo y personalizar su apariencia. Por ejemplo, un componente `Form` puede pasar una prop `color` a un componente `Button`.
* [El **estado** es como la memoria de un componente.](/learn/state-a-components-memory) Le permite a un componente realizar un seguimiento de alguna información y cambiarla en respuesta a interacciones. Por ejemplo, un componente `Button` pudiera querer hacer un seguimiento del estado `isHovered`.

Las props y el estado son diferentes, pero trabajan en conjunto. Un componente padre a menudo mantendrá alguna información en el estado (para poder cambiarla), y *pasarla* a componentes hijos como props. No pasa nada si la diferencia aún resulta difusa en la primera lectura. ¡Toma un poco de práctica para que realmente se fije!

</DeepDive>

## Paso 4: Identificar dónde debe vivir tu estado {/*step-4-identify-where-your-state-should-live*/}

Después de identificar los datos mínimos de estado de tu aplicación, debes identificar qué componente es responsable de cambiar este estado, o *posee* el estado. Recuerda: React utiliza un flujo de datos en una sola dirección, pasando datos hacia abajo de la jerarquía de componentes desde el componente padre al hijo. Puede no ser inmediatamente claro qué componente debe poseer qué estado. Esto puede suponer un reto si este concepto es nuevo para ti, pero puedes lograrlo si sigues los siguientes pasos.

Por cada pieza de estado en tu aplicación:

1. Identifica *cada* componente que renderiza algo basado en ese estado.
2. Encuentra su componente ancestro común más cercano--un componente que esté encima de todos en la jerarquía
3. Decide dónde debe residir el estado:
   1. A menudo, puedes poner el estado directamente en su ancestro común.
   2. También puedes poner el estado en algún componente encima de su ancestro común.
   3. Si no puedes encontrar un componente donde tiene sentido poseer el estado, crea un nuevo componente solo para almacenar ese estado y añádelo en algún lugar de la jerarquía encima del componente ancestro común.

En el paso anterior, encontraste dos elementos de estado en esta aplicación: el texto de la barra de búsqueda, y el valor del *checkbox*. En este ejemplo, siempre aparecen juntos, por lo que es más fácil pensar en ellos como un solo elemento de estado.

Ahora utilicemos nuestra estrategia para este estado:

1. **Identifica componentes que usen estado:**
    * `ProductTable` necesita filtrar la lista de productos con base en ese estado (texto de búsqueda y valor del *checkbox*).
    * `SearchBar` necesita mostrar ese estado (texto de búsqueda y valor del *checkbox*).
2. **Encuentra su ancestro común:** El primer componente ancestro que ambos componentes comparten es `FilterableProductTable`.
3. **Decide donde reside el estado:** Mantendremos el texto de filtrado y el estado de valor seleccionado en `FilterableProductTable`.

Por tanto los valores del estado residirán en `FilterableProductTable`.

Añade estado al componente con el [Hook `useState()`](/reference/react/useState). Los Hooks te permiten "engancharte" al [ciclo de renderizado](/learn/render-and-commit) de un componente (<abbr title="Nota de Traducción">N. de T.</abbr>: *hook* en inglés se puede traducir como "gancho"). Añade dos variables de estado al inicio de `FilterableProductTable` y especifica el estado inicial de tu aplicación:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Pasa entonces `filterText` e `inStockOnly` a `ProductTable` y `SearchBar` como props:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Puedes comenzar a ver como tu aplicación se comportará. Edita el valor inicial de `filterText` de `useState('')` a `useState('fruit')` en el ejemplo de código debajo. Verás que tanto el texto del cuadro de texto como la tabla se actualizan:

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Frutas", price: "$1", stocked: true, name: "Manzana"},
  {category: "Frutas", price: "$1", stocked: true, name: "Fruta del dragón"},
  {category: "Frutas", price: "$2", stocked: false, name: "Maracuyá"},
  {category: "Verduras", price: "$2", stocked: true, name: "Espinaca"},
  {category: "Verduras", price: "$4", stocked: false, name: "Calabaza"},
  {category: "Verduras", price: "$1", stocked: true, name: "Guisantes"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Nota que editar el formulario aún no funciona. Hay un error en la consola del _sandbox_ que explica por qué:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field. (Has proporcionado una prop \`value\` a un campo de un formulario sin el manejador de eventos \`onChange\`. Esto hará que se renderice un campo de solo lectura.)

</ConsoleBlock>

En el ejemplo de código de arriba `ProductTable` y `SearchBar` leen las props `filterText` e `inStockOnly` para renderizar la tabla, el cuadro de texto, y el *checkbox*. Por ejemplo, aquí tenemos como `SearchBar` puebla el valor del cuadro de texto:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

Sin embargo, no has añadido ningún código para responder a las acciones del usuario como la escritura en el teclado. Este será tu último paso.


## Paso 5: Añade flujo de datos inverso {/*step-5-add-inverse-data-flow*/}

Actualmente tu aplicación se renderiza correctamente con props y estado fluyendo hacia abajo en la jerarquía. Pero para cambiar el estado de acuerdo a la entrada del usuario necesitarás ser capaz de manejar datos fluyendo en la otra dirección: los componentes de formulario que se encuentran debajo en la jerarquía necesitan actualizar el estado en `FilterableProductTable`.

React hace este flujo de datos explícito, pero requiere un poco más de escritura que el enlazado de datos en doble sentido. Si tratas de escribir o seleccionar el *checkbox* en el ejemplo de arriba, verás que React ignora tu entrada. Esto es intencional. Al escribir `<input value={filterText} />`, haz establecido que la prop `value` del `input` sea siempre igual al estado `filterState` pasado desde `FilterableProductTable`. Dado que el estado `filterText` nunca es modificado, el *input* nunca cambia.

Debes lograr que cuando el usuario cambie las entradas del formulario, el estado se actualice para reflejar esos cambios. El estado lo posee `FilterableProductTable`, por lo que solo él puede llamar a `setFilterText` y `setInStockOnly`. Para permitir que `SearchBar` actualice el estado de `FilterableProductTable` necesitas pasar estas funciones para abajo hacia `SearchBar`:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Dentro de `SearchBar`, añadirás el manejador del evento `onChange` y modificarás el estado del padre desde allí:

```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Search..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

¡Ahora la aplicación funciona totalmente!

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Frutas", price: "$1", stocked: true, name: "Manzana"},
  {category: "Frutas", price: "$1", stocked: true, name: "Fruta del dragón"},
  {category: "Frutas", price: "$2", stocked: false, name: "Maracuyá"},
  {category: "Verduras", price: "$2", stocked: true, name: "Espinaca"},
  {category: "Verduras", price: "$4", stocked: false, name: "Calabaza"},
  {category: "Verduras", price: "$1", stocked: true, name: "Guisantes"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Puedes aprender todo sobre el manejo de eventos y actualizar el estado en la sección [Añadir interactividad](/learn/adding-interactivity).

## ¿A dónde ir a partir de aquí? {/*where-to-go-from-here*/}

Esta es una introducción breve de cómo pensar acerca de la construcción de componentes y aplicaciones con React. Puedes [comenzar un proyecto de React](/learn/installation) ahora mismo o [revisar con profundidad toda la sintaxis](/learn/describing-the-ui) utilizada en este tutorial.
