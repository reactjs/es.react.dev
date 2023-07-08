---
title: Renderizado de listas
---

<Intro>

A menudo querrás mostrar muchos componentes similares de una colección de datos. Puedes usar los [métodos de array de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array#) para manipular un array de datos. En esta página, usarás [`filter()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) y [`map()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map) con React para filtrar y transformar tu array de datos en un array de componentes.

</Intro>

<YouWillLearn>

* Cómo renderizar componentes desde un array usando el método `map()` de JavaScript
* Cómo renderizar solo un componente específico usando `filter()` de JavaScript
* Cuándo y cómo usar las _keys_ de React

</YouWillLearn>

## Renderizar datos desde arrays {/*rendering-data-from-arrays*/}

Digamos que tienes una lista de contenido.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

La única diferencia entre esos elementos de la lista es su contenido, sus datos. A menudo necesitarás mostrar muchas instancias del mismo componente usando diferentes datos cuando construyas interfaces: desde listas de comentarios a galerías de fotos de perfiles. En estas situaciones, puedes guardar estos datos en objetos de JavaScript y arrays, y usar métodos como [`map()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map) y [`filter()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) para renderizar listas de componentes desde ellos.

Aquí hay un corto ejemplo de como generar una lista de elementos de un array:

1. **Mueve** los datos en un array:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **Mapea** los miembros de `people` en un nuevo array de nodos JSX, `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Devuelve** `listItems` desde tu componente envuelto en un `<ul>`:

```js
return <ul>{listItems}</ul>;
```

Aquí está el resultado:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Date cuenta que el sandbox anterior muestra un error por consola:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Aprenderás como arreglar este error más adelante en esta página. Antes de que lleguemos a eso, vamos a añadir algo de estructura a tus datos.

## Filtrar arrays de objetos {/*filtering-arrays-of-items*/}

Estos datos pueden ser estructurados incluso más.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Digamos que quieres una manera de mostrar solo las personas cuya profesión sea `'chemist'`. Puedes usar el método `filter()` de JavaScript para devolver solo esas personas. Este método coge un array de objetos, los pasa por un "test" (una función que devuelve `true` o `false`), y devuelve un nuevo array de solo esos objetos que han pasado el test (que han devuelto `true`).

Tú solo quieres  los objetos donde `profession` es `'chemist'`. La función "test" para esto se ve como `(person) => person.profession === 'chemist'`. Aquí está cómo juntarlo:

1. **Crea** un nuevo array solo de personas que sean "químicos", `chemists`, llamando al método `filter()` en `people` filtrando por `person.profession === 'chemist'`:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. Ahora **mapea** sobre `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
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
```

3. Por último, **devuelve** el `listItems` de tu componente:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
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
  return <ul>{listItems}</ul>;
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Las funciones de flecha implícitamente devuelven la expresión justo después del `=>`, así que no necesitas declarar un `return`:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

Sin embargo, **¡debes escibir el `return` explícitamente si tu `=>` está seguida por una llave`{`!**

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

Las funciones de flecha que tienen `=> {` se dice que tienen un ["cuerpo de bloque".](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions#cuerpo_de_función) Te permiten escribir más de una sola línea de código, pero  *tienes que* declarar un `return` por ti mismo. Si lo olvidas, ¡Nada será devuelto!

</Pitfall>

## Mantener los elementos de una lista en orden con _`key`_ {/*keeping-list-items-in-order-with-key*/}

Fíjate que todos los sandboxes anteriores mostraban un error en la consola:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Tienes que darle a cada elemento del array una _`key`_ (una cadena de texto o un número) que lo identifique de manera única entre otros elementos del array:

```js
<li key={person.id}>...</li>
```

<Note>

¡Los elementos JSX directamente dentro de una llamada a un `map()` siempre necesitan _keys_!

</Note>

Las _keys_ le indican a React que objeto del array corresponde a cada componente, para así poder emparejarlo más tarde. Esto se vuelve más importante si los objetos de tus arrays se pueden mover (<abbr title="por ejemplo">p. ej.</abbr> debido a un ordenamiento), insertar, o eliminar. Una _`key`_ bien escogida ayuda a React a entender lo que ha sucedido exactamente, y hacer las correctas actualizaciones en el árbol del DOM.

En vez de generar _keys_ sobre la marcha, deberías incluirlas en tus datos:

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
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Usado en JSX como key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Usado en JSX como key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Usado en JSX como key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Usado en JSX como key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Mostrar varios nodos DOM para cada elemento de una lista {/*displaying-several-dom-nodes-for-each-list-item*/}

¿Qué haces cuándo cada objeto necesita renderizar no uno, sino varios nodos del DOM?

El atajo de sintaxis del [`<>...</>` Fragment](/reference/react/Fragment) no te dejará pasarle una key, así que necesitas agruparlos en un solo `<div>`, o usar una sintaxis algo más larga y [más explícita del `<Fragment>`:](/reference/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Los Fragments desaparecen del DOM, así que esto producirá una lista plana de `<h1>`, `<p>`, `<h1>`, `<p>`, y así.

</DeepDive>

### Dónde conseguir tu _`key`_ {/*where-to-get-your-key*/}

Distintas fuentes de datos dan diferentes fuentes de _keys_:

* **Datos de una base de datos:** Si tus datos vienen de una base de datos, puedes usar las _keys_/ID de la base de datos, que son únicas por naturaleza.
* **Datos generados localmente:** Si tus datos son generados y persistidos localmente (p. ej. notas en una app de tomar notas), usa un contador incremental, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) o un paquete como [`uuid`](https://www.npmjs.com/package/uuid) cuando este creando objetos.

### Reglas de las _keys_ {/*rules-of-keys*/}

* **Las _keys_ tienen que ser únicas entre elementos hermanos.** Sin embargo, está bien usar las mismas _keys_ para nodos JSX en arrays _diferentes_.
* **Las _keys_ no tienen que cambiar** o ¡eso quitará su propósito! No las generes mientras renderizas.

### ¿Por qué React necesita _keys_? {/*why-does-react-need-keys*/}

Imagina que los archivos de tu escritorio no tuvieran nombres. En vez de eso, tu te referirías a ellos por su orden -- el primer archivo, el segundo, y así. Podrías acostumbrarte a ello, pero una vez borres un archivo, se volvería algo confuso. El segundo archivo se convertiría en el primero, el tercer archivo se convertiría en el segundo, y así.

Los nombres de archivos en una carpeta y las _keys_ JSX en un array tienen un propósito similar. Nos permiten identificar un objeto de manera única entre sus hermanos. Una _key_ bien escogida da más información aparte de la posición en el array. incluso si la _posición_ cambia devido a un reordenamiento, la _`key`_ permite a React identificar al elemento a lo largo de su ciclo de vida.

<Pitfall>

Podrías estar tentado a usar el índice del elemento en el array como su _key_. De hecho, eso es lo que React usará si tu no especifícas una _`key`_ en absoluto. Pero el orden en el que renderizas elementos cambiará con el tiempo si un elemento es insertado, borrado, o si se reordena su array. El índice como _key_ lleva a menudo a sutiles y confusos errores.

Igualmente, no generes _keys_ sobre la marcha, p. ej. con `key={Math.random()}`. Esto hará que las _keys_ nunca coincidan entre renderizados, llevando a todos tus componentes y al DOM a recrearse cada vez. No solo es una manera lenta, si no que también pierde cualquier input del usuario dentro de los elementos listados. En vez de eso, usa unas IDs basadas en datos.

Date cuenta de que tus componentes no reciben la _`key`_ como un prop. Solo es usado como pista para React. Si tus componentes necesitan un ID, se lo tienes que pasar como una prop separada: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

En esta página has aprendido:

* Como mover datos fuera de componentes y en estructuras de datos como arrays y objetos.
* Como genrerar sets de componentes similares con el método `map()` de JavaScript.
* Como crear arrays de objetos filtrados con el método `filter()` de JavaScript.
* Por qué y cómo poner la _`key`_ en cada componente en una colección para que React pueda seguir la pista de cada uno de ellos incluso si su posición o datos cambia.

</Recap>



<Challenges>

#### Dividir una lista en dos {/*splitting-a-list-in-two*/}

Este ejemplo muestra una lista de todas las personas.

Cambiala para mostrar dos listas separadas, una detrás de otra : **Químicos** y **Cualquier otro.** Como antes, puedes saber que persona es química comprobando si `person.profession === 'chemist'`.

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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Podrías usar el método `filter()` dos veces, creando dos arrays separados, y entonces un `map` sobre ambos:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
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
        )}
      </ul>
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

En esta solución, las llamadas al `map` están puestas directamente en línea dentro de los elementos padre `<ul>`, pero podrías introducir variables para ellos si eso te parece más legible.

Aún hay un poco de repetición entre las listas renderizadas. Puedes ir más lejos aún y extraer las partes repetitivas en un componente `<ListSection>`:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Un lector muy atento podría notar que con dos llamadas al `filter`, comprobamos la profesión de las personas dos veces. Comprobar una propiedad es muy rápido, así que en este ejemplo está bien. Si tu lógica fuese más costosa que eso, podrías reemplazar las llamadas al `filter` con un bucle que manualmente construya los arrays y compruebe a cada persona una vez.

De hecho, si `people` nunca cambia, podrías mover este código fuera del componente. Desde la perspectiva de React, lo único que importa es si le has dado un array de nodos JSX en el final. No importa como produces ese array:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Listas anidadas en un componente {/*nested-lists-in-one-component*/}

¡Haz una lista de recetas desde este array! Por cada receta en el array, coloca su nombre en un `<h2>` y lista sus ingredientes en un `<ul>`.

<Hint>

Esto va a requerir anidar dos llamadas al método `map` diferentes.

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Esta es una forma en la que podrías conseguirlo:

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Cada una de las `recipes` ya incluye un campo `id`, y eso es lo que el bucle exterior usa para su _`key`_. No hay un ID que puedas usar para hacer un bucle sobre los ingredientes. Sin embargo, es razonable asumir que el mismo ingrediente no estará listado dos veces dentro de la misma receta, por lo tanto su nombre puede servir como _`key`_. Alternativamente, podrías cambiar la estructura de los datos para añadir IDs, o usar el índice como _`key`_ (con la advertencia de que no puedes reordenar ingredientes de forma segura).

</Solution>

#### Extraer un componente de elemento de lista {/*extracting-a-list-item-component*/}

Este componente `RecipeList` contiene dos llamadas `map` anidadas. Para simplificarlo, extrae un componente `Recipe` de el que aceptará las props `id`, `name`, y `ingredients`. ¿Dónde colocarías la _`key`_ exterior y por qué?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Puedes copiar y pegar el JSX del `map` exterior en un nuevo componente `Recipe` y devolver ese JSX. Entonces puedes cambiar el `recipe.name` a `name`, `recipe.id` a `id`, y así, y pasarlos como props al componente `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Aquí, `<Recipe {...recipe} key={recipe.id} />` es un atajo de sintaxis diciendo "pasa todas las propiedades del obejto `recipe` como props al componente `Recipe`". También podrías escribir cada prop explícitamente: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Date cuente que la _`key`_ está especificada en el `<Recipe>` en sí más que en el `<div>` raíz devuelto de `Recipe`.** Esto es porque esta _`key`_ es necesaria directamente dentro del contexto del array circundante. Anteriormente, tenías un array de `<div>`s así que cada uno necesitaba una `key`, pero ahora tienes un array de `<Recipe>`s. Es decir, cuando extraes un componente, no te olvides de dejar la _`key`_ fuera del JSX que has copiado y pegado.

</Solution>

#### Lista con un separador {/*list-with-a-separator*/}

Este ejemplo renderiza un haiku famoso escrito por Katsushika Hokusai, con cada línea envuelta en una etiqueta `<p>`. Tu trabajo es insertar un separador `<hr />` entre cada párrafo. Tu estructura final debería verse algo como esto:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

Un haiku solo tiene tres líneas, pero tu solución debería funcionar con cualquier número de líneas. Fíjate que los elementos `<hr />` solo aparecen *entre* los elementos `<p>`, ¡no en el inicio o el final!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Este es un caso raro donde el índice como _key_ es aceptable porque las líneas de los poemas nunca se van a reordenar.)

<Hint>

Tendrás que convertir los `map` en un bucle manual, o usar un fragment.

</Hint>

<Solution>

Puedes escribir un bucle manual, insertando `<hr />` y `<p>...</p>` en el array de salida a medida que avanzas:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Usar el índice de la línea original como _`key`_ ya no funciona porque cada separador y cada párrafo están ahora en el mismo array. Sin embargo, puedes darle a cada uno de ellos una _key_ distintiva usando un sufijo, p. ej. `key={i + '-text'}`.

De forma alternativa, puedes renderizar una colección de fragments que contengan `<hr />` y `<p>...</p>`. Sin embargo, el atajo de sintaxis `<>...</>` no admite pasarle _keys_, así que tendrás que escribir `<Fragment>` explícitamente:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Recuerda, ¡los fragments (a menudo escritos como `<> </>`) te permiten agrupar nodos JSX sin añadir `<div>`s extra!

</Solution>

</Challenges>
