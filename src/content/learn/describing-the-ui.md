---
title: Describir la UI
---

<Intro>

React es una biblioteca de JavaScript para renderizar interfaces de usuario (UI por sus siglas en inglés). La UI se construye a partir de pequeñas unidades como botones, texto e imágenes. React te permite combinarlas en *componentes* reutilizables y anidables. Desde sitios web hasta aplicaciones de teléfonos, todo en la pantalla se puede descomponer en componentes. En este capítulo aprenderás a crear, adaptar y mostrar de forma condicional componentes de React.

</Intro>

<YouWillLearn isChapter={true}>

* [Cómo escribir tu primer componente de React](/learn/your-first-component)
* [Cuándo y cómo crear archivos con múltiples componentes](/learn/importing-and-exporting-components)
* [Cómo añadir marcado a JavaScript con JSX](/learn/writing-markup-with-jsx)
* [Cómo añadir llaves con JSX para acceder a funcionalidades de JavaScript desde tus componentes](/learn/javascript-in-jsx-with-curly-braces)
* [Cómo configurar componentes con props](/learn/passing-props-to-a-component)
* [Cómo renderizar componentes condicionalmente](/learn/conditional-rendering)
* [Cómo renderizar múltiples componentes a la vez](/learn/rendering-lists)
* [Cómo evitar errores confusos manteniendo los componentes puros](/learn/keeping-components-pure)

</YouWillLearn>

## Tu primer componente {/*your-first-component*/}

Las aplicaciones de React se construyen a partir de piezas independientes de UI llamadas *componentes*. Un componente de React es una función de JavaScript a la que le puedes agregar un poco de marcado (*markup*). Los componentes pueden ser tan pequeños como un botón, o tan grandes como una página entera. Aquí vemos un componente `Gallery` que renderiza tres components `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Lee **[Tu primer componente](/learn/your-first-component)** para que aprendas cómo declarar y utilizar componentes de React.

</LearnMore>

## Importar y exportar componentes {/*importing-and-exporting-components*/}

Es posible declarar muchos componentes en un archivo, pero los archivos grandes pueden resultar difíciles de navegar. Como solución, puedes *exportar* un componente a su propio archivo, y luego *importar* ese componente desde otro archivo:

<Sandpack>

```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Lee **[Importar y exportar componentes](/learn/importing-and-exporting-components)** para que aprendas como dividir componentes en archivos propios.

</LearnMore>

## Escribir marcado con JSX {/*writing-markup-with-jsx*/}

Cada componente de React es una función de JavaScript que puede contener algo de marcado que React renderiza en el navegador. Los componentes de React utilizan una sintaxis extendida que se llama JSX para representar ese marcado. JSX se parece muchísimo a HTML, pero es un poco más estricto y puede mostrar información dinámica.

Si pegamos marcado existente HTML en un componente de React, no funcionará siempre:

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Si tienes HTML existente como este, puedes arreglarlo usando un [convertidor](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Lee **[Escribir marcado con JSX](/learn/writing-markup-with-jsx)** para aprender cómo escribir JSX válido.

</LearnMore>

## JavaScript en JSX con llaves {/*javascript-in-jsx-with-curly-braces*/}

JSX te permite escribir marcado similar a HTML dentro de un archivo JavaScript, manteniendo la lógica de renderizado y el contenido en el mismo lugar. En ocasiones será deseable añadir un poco de lógica en JavaScript o referenciar una propiedad dinámica dentro del marcado. En esta situación, puedes utilizar llaves en tu JSX para "abrir una ventana" hacia JavaScript:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Lee **[JavaScript y JSX con llaves](/learn/javascript-in-jsx-with-curly-braces)** para aprender cómo acceder a JavaScript desde JSX.

</LearnMore>

## Pasar props a un componente {/*passing-props-to-a-component*/}

Los componentes de React utilizan *props* para comunicarse entre ellos. Cada componente padre puede pasar alguna información a sus componentes hijos dándoles props. Las props pueden recodarte a los atributos de HTML, pero puedes pasar cualquier valor de JavaScript con ellas, incluyendo objetos, arreglos, funciones, ¡e incluso JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Lee **[Pasar props a un componente](/learn/passing-props-to-a-component)** para aprender cómo pasar y leer props.

</LearnMore>

## Renderizado condicional {/*conditional-rendering*/}

Tus componentes a menudo necesitarán mostrar algo distinto en diferentes condiciones. En React, puedes renderizar JSX de forma condicional usando sintaxis de JavaScript como las sentencias `if`, y los operadores `&&` y `? :`.

En este ejemplo, el operador `&&` se utiliza para renderizar condicionalmente una marca:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Lee **[Renderizado condicional](/learn/conditional-rendering)** para aprender las diferentes formas de renderizar contenido condicionalmente.

</LearnMore>

## Renderizado de listas {/*rendering-lists*/}

A menudo querrás mostrar múltiples componentes similares a partir de una colección de datos. Puedes utilizar `filter()` y `map()` de JavaScript junto con React para filtrar y transformar tus arreglos de datos en un arreglo de componentes.

Para cada elemento del arreglo, deberás especificar una prop `key`. Usualmente, querrás usar un ID de la base de datos como `key`. Las `key` le permiten a React seguir el lugar de cada elemento en la lista aún cuando la lista cambie.

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Lee **[Renderizado de listas](/learn/rendering-lists)** para aprender cómo renderizar una lista de componentes, y cómo elegir una `key`.

</LearnMore>

## Mantener los componentes puros {/*keeping-components-pure*/}

Algunas funciones de JavaScript son *puras*. Una función pura:

* **Se ocupa de sus propios asuntos.** No cambia ningún objeto o variable que haya existido antes de ser llamada.
* **Misma entrada, misma salida.** Dada la misma entrada, una función pura debería devolver siempre el mismo resultado.

Si de forma estricta solo escribes tus componentes como funciones puras, puedes evitar toda una clase de errores desconcertantes y comportamientos impredecibles a medida que tu base de código crece. Aquí hay un ejemplo de un componente impuro:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Puedes hacer este componente puro pasando una prop en lugar de modificar una variable ya existente:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Lee **[Mantener los componentes puros](/learn/keeping-components-pure)** para aprender a escribir componentes como funciones puras y predecibles.

</LearnMore>

## ¿Qué sigue? {/*whats-next*/}

¡Dirígete a [Tu primer componente](/learn/your-first-component) para que comiences a leer este capítulo página por página!

O, si ya te resultan familiares estos temas, ¿por qué no leer sobre cómo [Añadir interactividad](/learn/adding-interactivity)?
