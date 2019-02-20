---
id: lists-and-keys
title: Listas y keys
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Primero, vamos a revisar como transformas listas en Javascript. 

Dado el código de abajo, usamos la función [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) para tomar un array de `numbers` y duplicar sus valores. Asignamos el nuevo array devuelto por `map()` a la variable `doubled` y la mostramos:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Este código muestra `[2, 4, 6, 8, 10]` a la consola.

En React, transformar arrays en listas de [elementos](/docs/rendering-elements.html) es casi idéntico.

### Renderizado de Múltiples Componentes {#rendering-multiple-components}

Puedes hacer colecciones de elementos e [incluirlos en JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) usando llaves `{}`.

Debajo, recorreremos el array `numbers` usando la función [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) de Javascript. Devolvemos un elemento `<li>` por cada ítem . Finalmente, asignamos el array de elementos resultante a `listItems`:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

Incluimos entero el array `listItems` dentro de un elemento `<ul>`, y [lo renderizamos al DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Este código muestra una lista de números entre 1 y 5.

### Componente básico de lista {#basic-list-component}

Usualmente renderizarías listas dentro de un [componente](/docs/components-and-props.html).

Podemos refactorizar el ejemplo anterior en un componente que acepte un array de `numbers` e imprima una lista de elementos.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

Cuando ejecutes este código, serás advertido que una key debería ser proporcionada para ítems de lista. Una "key" es un atributo especial string que debes incluir al crear listas de elementos. Vamos a discutir por qué esto es importante en la próxima sección.

Vamos a asignar una `key` a nuestra lista de ítems dentro de `numbers.map()` y arreglar el problema de la falta de key.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Keys {#keys}

Las keys ayudan a React a identificar que ítems han cambiado, son agregados, o son eliminados. Las keys deben ser dadas a los elementos dentro del array para darle a los elementos una identidad estable:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

La mejor forma de elegir una key es usando un string que identifique únicamente a un elemento de la lista entre sus hermanos. Habitualmente vas a usar IDs de tus datos como key:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Cuando no tengas IDs estables para renderizar, puedes usar el índice del ítem como una key como último recurso:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

No recomendamos usar índices para keys si el orden de los ítems puede cambiar. Esto puede impactar negativamente el rendimiento y puede causar problemas con el estado del componente. Revisa el artículo de Robin Pokorny para una [explicación en profundidad de los impactos negativos de usar un índice como key](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). Si eliges no asignar una key explícita a la lista de ítems, React por defecto usará índices como keys.

Aquí hay una [explicación en profundidad sobre por qué las keys son necesarias](/docs/reconciliation.html#recursing-on-children) si estás interesado en aprender más.

### Extracción de componentes con keys {#extracting-components-with-keys}

Las keys solo tienen sentido en el contexto del array que las envuelve.

Por ejemplo, si [extraes](/docs/components-and-props.html#extracting-components) un componente `ListItem`, deberías mantener la key en los elementos `<ListItem />` del array en lugar de en el elemento `<li>` del propio `ListItem`.

**Ejemplo: Uso Incorrecto de Key**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Mal! No hay necesidad de especificar la key aquí:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Mal! La key debería haber sido especificada aquí:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Ejemplo: Uso Correcto de Key**

```javascript{2,3,9,10}
function ListItem(props) {
  // Correcto! No hay necesidad de especificar la key aquí:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correcto! La key debería ser especificada dentro del array.
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

Una buena regla es que los elementos dentro de `map()` necesitan keys.

### Las keys deben ser únicas solo entre hermanos {#keys-must-only-be-unique-among-siblings}

Las keys usadas dentro de arrays deberían ser únicas entre sus hermanos. Sin embargo, no necesitan ser únicas globalmente. Podemos usar las mismas keys cuando creamos dos arrays diferentes:

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Las keys sirven como una sugerencia para React pero no son pasadas a tus componentes. Si necesitas usar el mismo valor en tu componente, pásasela explícitamente como una propiedad con un nombre diferente:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

Con el ejemplo de arriba, el componente `Post` puede leer `props.id`, pero no `props.key`.

### Integrar map() en JSX {#embedding-map-in-jsx}

En los ejemplos de arriba declaramos una variable separada `listItems` y la incluimos en JSX:

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX permite [integrar cualquier expresión](/docs/introducing-jsx.html#embedding-expressions-in-jsx) en llaves así que podemos alinear el resultado de `map()`:

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Algunas veces esto resulta más claro en código, pero este estilo también puede ser abusado. Como en JavaScript, depende de ti decidir cuando vale la pena extraer una variable por legibilidad. Ten en mente que si el cuerpo de `map()` está muy anidado, puede ser un buen momento para [extraer un componente](/docs/components-and-props.html#extracting-components).
