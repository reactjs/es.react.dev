---
title: Actualizar arrays en el estado
---

<Intro>

Los _arrays_ son mutables en JavaScript, pero deberían tratarse como inmutables cuando los almacenas en el estado. Al igual que los objetos, cuando quieras actualizar un _array_ almacenado en el estado, necesitas crear uno nuevo (o hacer una copia de uno existente) y luego asignar el estado para que utilice este nuevo _array_. 

</Intro>

<YouWillLearn>

- Cómo añadir, eliminar o cambiar elementos en un _array_ en el estado de React
- Cómo actualizar un objeto dentro de un _array_
- Cómo copiar un _array_ de forma menos repetitiva con Immer

</YouWillLearn>

## Actualizar _arrays_ sin mutación {/*updating-arrays-without-mutation*/}

En JavaScript, los _arrays_ son solo otro tipo de objeto. [Como con los objetos](/learn/updating-objects-in-state), **deberías tratar los _arrays_ en el estado de React como si fueran de solo lectura.** Esto significa que no deberías reasignar elementos dentro de un _array_ como `arr[0] = 'pájaro'`, y tampoco deberías usar métodos que puedan mutar el _array_, como `push()` y `pop()`.

En su lugar, cada vez que quieras actualizar un _array_, querrás pasar un *nuevo* _array_ a la función de asignación de estado. Para hacerlo, puedes crear un nuevo _array_ a partir del _array_ original en el estado si llamas a sus métodos que no lo muten como `filter()` y `map()`. Luego puedes asignar el estado a partir del nuevo _array_ resultante.

Aquí hay una tabla de referencia con las operaciones más comunes con _arrays_. Cuando se trata de _arrays_ dentro del estado de React, necesitarás evitar los métodos de la columna izquierda, y en su lugar es preferible usar los métodos de la columna derecha.

|              | evita (muta el _array_)                  | preferido (devuelve un nuevo _array_)                                         |
|--------------|------------------------------------------|------------------------------------------------------------------------------|
| añadir    | `push`, `unshift`                        | `concat`, `[...arr]` operador de propagación ([ejemplo](#adding-to-an-array))|
| eliminar   | `pop`, `shift`, `splice`                 | `filter`, `slice` ([ejemplo](#removing-from-an-array))                       |
| reemplazar | `splice`, `arr[i] = ...` asigna          | `map` ([ejemplo](#replacing-items-in-an-array))                              |
| ordenar    | `reverse`, `sort`                        | copia el _array_ primero ([ejemplo](#making-other-changes-to-an-array))      |

Como alternativa, puedes [usar Immer](#write-concise-update-logic-with-immer) el cual te permite usar métodos de ambas columnas.

<Pitfall>

Desafortunadamente, [`slice`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) y [`splice`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) tienen nombres muy similares pero son muy diferentes:

* `slice` te permite copiar un _array_ o una parte del mismo.
* `splice` **muta** el _array_ (para insertar o eliminar elementos).

En React, estarás usando `slice` (no `p`!) mucho más seguido porque no quieres mutar objetos o _arrays_ en el estado. [Actualizar objetos](/learn/updating-objects-in-state) explica qué es mutación y por qué no se recomienda para el estado.

</Pitfall>

### Añadir a un _array_ {/*adding-to-an-array*/}

`push()` muta un _array_, lo cual no queremos:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Escultores inspiradores:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Añadir</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

En su lugar, crea un *nuevo* _array_ que contenga los elementos existentes *y* un nuevo elemento al final. Hay múltiples formas de hacerlo, pero la más fácil es usar la sintaxis `...` [de propagación en _arrays_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Reemplaza el estado
  [ // con el nuevo _array_
    ...artists, // el cual contiene todos los elementos antiguos
    { id: nextId++, name: name } // y un nuevo elemento al final
  ]
);
```

Ahora funciona correctamente:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Escultores inspiradores:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Añadir</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

El operador de propagación también te permite anteponer un elemento al colocarlo *antes* del original `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Coloca los elementos antiguos al final
]);
```

De esta forma, el operador de propagación puede hacer el trabajo tanto de `push()` añadiendo al final del _array_ como de `unshift()` agregando al comienzo del _array_. ¡Pruébalo en el editor de arriba!

### Eliminar elementos de un _array_ {/*removing-from-an-array*/}

La forma más fácil de eliminar un elemento de un _array_ es *filtrarlo*. En otras palabras, producirás un nuevo _array_ que no contendrá ese elemento. Para hacerlo, usa el método `filter`, por ejemplo:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Escultores inspiradores:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Haz click en el botón "Eliminar" varias veces, y mira su controlador de clics.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Aquí, `artists.filter(a => a.id !== artist.id)` significa "crea un nuevo _array_ conformado por aquellos `artists` cuyos IDs son diferentes de `artist.id`". En otras palabras, el botón "Eliminar" de cada artista filtrará a _ese_ artista del _array_ y luego solicitará un rerenderizado con el _array_ resultante. Ten en cuenta que `filter` no modifica el _array_ original.

### Transformar un _array_ {/*transforming-an-array*/}

Si deseas cambiar algunos o todos los elementos del _array_, puedes usar `map()` para crear un **nuevo** _array_. La función que pasarás a `map` puede decidir qué hacer con cada elemento, en función de sus datos o su índice (o ambos).

En este ejemplo, un _array_ contiene las coordenadas de dos círculos y un cuadrado. Cuando presionas el botón, mueve solo los círculos 50 píxeles hacia abajo. Lo hace produciendo un nuevo _array_ de datos usando `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No cambia
        return shape;
      } else {
        // Devuelve un nuevo círculo 50px abajo
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Vuelve a renderizar con el nuevo _array_
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        ¡Mueve los círculos hacia abajo!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Reemplazar elementos en un _array_ {/*replacing-items-in-an-array*/}

Es particularmente común querer reemplazar uno o más elementos en un _array_. Las asignaciones como `arr[0] = 'pájaro'` están mutando el _array_ original, por lo que para esto también querrás usar `map`.

Para reemplazar un elemento, crea una un nuevo _array_ con `map`. Dentro de la llamada a `map`, recibirás el índice del elemento como segundo argumento. Úsalo para decidir si devolver el elemento original (el primer argumento) o algo más:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Incrementa el contador de clics
        return c + 1;
      } else {
        // El resto no ha cambiado
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Insertar en un _array_ {/*inserting-into-an-array*/}

A veces, es posible que desees insertar un elemento en una posición particular que no esté ni al principio ni al final. Para hacer esto, puedes usar la sintaxis de propagación para _arrays_ `...` junto con el método `slice()`. El método `slice()` te permite cortar una "rebanada" del _array_. Para insertar un elemento, crearás un _array_ que extienda el segmento _antes_ del punto de inserción, luego el nuevo elemento y luego el resto del _array_ original.

En este ejemplo, el botón "Insertar" siempre inserta en el índice `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Podría ser cualquier índice
    const nextArtists = [
      // Elementos antes del punto de inserción:
      ...artists.slice(0, insertAt),
      // Nuevo ítem:
      { id: nextId++, name: name },
      // Elementos después del punto de inserción:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Escultores inspiradores:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insertar
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Hacer otros cambios en un _array_ {/*making-other-changes-to-an-array*/}

Hay algunas cosas que no puedes hacer con la sintaxis extendida y los métodos que no mutan como `map()` y `filter()`. Por ejemplo, es posible que desees invertir u ordenar un _array_. Los métodos JavaScript `reverse()` y `sort()` mutan el _array_ original, por lo que no puedes usarlos directamente.

**Sin embargo, puedes copiar el _array_ primero y luego realizar cambios en él.**

Por ejemplo:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Grandes barrigas' },
  { id: 1, title: 'Paisaje lunar' },
  { id: 2, title: 'Guerreros de terracota' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Invertir
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Aquí, usas la sintaxis de propagación `[...list]` para crear primero una copia del _array_ original. Ahora que tienes una copia, puedes usar métodos de mutación como `nextList.reverse()` o `nextList.sort()`, o incluso asignar elementos individuales con `nextList[0] = "algo"`.

Sin embargo, **incluso si copias un _array_, no puedes mutar los elementos existentes _dentro_ de éste directamente.** Esto se debe a que la copia es superficial: el nuevo _array_ contendrá los mismos elementos que el original. Entonces, si modificas un objeto dentro del _array_ copiado, estás mutando el estado existente. Por ejemplo, un código como este es un problema.

```js
const nextList = [...list];
nextList[0].seen = true; // Problema: muta list[0]
setList(nextList);
```

Aunque `nextList` y `list` son dos _arrays_ diferentes, **`nextList[0]` y `list[0]` apuntan al mismo objeto.** Entonces, al cambiar `nextList[0].seen`, está también cambiando `list[0].seen`. ¡Esta es una mutación de estado que debes evitar! Puedes resolver este problema de forma similar a [actualizar objetos JavaScript anidados](/learn/updating-objects-in-state#updating-a-nested-object): copiando elementos individuales que deseas cambiar en lugar de mutarlos. Así es cómo.

## Actualizar objetos dentro de _arrays_ {/*updating-objects-inside-arrays*/}

Los objetos no están _realmente_ ubicados "dentro" de los _arrays_. Puede parecer que están "dentro" del código, pero cada objeto en un _array_ es un valor separado, al que "apunta" el _array_. Es por eso que debe tener cuidado al cambiar campos anidados como `list[0]`. ¡La lista de obras de arte de otra persona puede apuntar al mismo elemento del _array_!

**Al actualizar el estado anidado, debe crear copias desde el punto en el que desea actualizar y hasta el nivel superior.** Veamos cómo funciona esto.

En este ejemplo, dos listas separadas de ilustraciones tienen el mismo estado inicial. Se supone que deben estar aislados, pero debido a una mutación, su estado se comparte accidentalmente y marcar una casilla en una lista afecta a la otra lista:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Grandes barrigas', seen: false },
  { id: 1, title: 'Paisaje lunar', seen: false },
  { id: 2, title: 'Guerreros de terracota', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Lista de deseos de arte</h1>
      <h2>Mi lista de obras de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Tu lista de obras de arte para ver:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

El problema está en un código como este:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problema: muta un elemento existente
setMyList(myNextList);
```

Aunque el _array_ `myNextList` en sí mismo es nuevo, los *propios elementos* son los mismos que en el _array_ `myList` original. Entonces, cambiar `artwork.seen` cambia el elemento de la obra de arte *original*. Ese elemento de la obra de arte también está en `yourArtworks`, lo que causa el error. Puede ser difícil pensar en errores como este, pero afortunadamente desaparecen si evitas mutar el estado.

**Puedes usar `map` para sustituir un elemento antiguo con su versión actualizada sin mutación.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Crea un *nuevo* objeto con cambios
    return { ...artwork, seen: nextSeen };
  } else {
     // No cambia
    return artwork;
  }
}));
```

Aquí, `...` es la sintaxis de propagación de objetos utilizada para [crear una copia de un objeto.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

Con este enfoque, ninguno de los elementos del estado existentes se modifica y el error se soluciona:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Grandes barrigas', seen: false },
  { id: 1, title: 'Paisaje lunar', seen: false },
  { id: 2, title: 'Guerreros de terracota', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Crea un *nuevo* objeto con cambios
        return { ...artwork, seen: nextSeen };
      } else {
        // No cambia
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Crea un *nuevo* objeto con cambios
        return { ...artwork, seen: nextSeen };
      } else {
        // No cambia
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Lista de deseos de arte</h1>
      <h2>Mi lista de obras de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Tu lista de obras de arte para ver:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

En general, **solo debes mutar objetos que acabas de crear.** Si estuvieras insertando una *nueva* obra de arte, podrías mutarla, pero si se trata de algo que ya está en el estado, debes hacer una copia.

### Escribe una lógica de actualización concisa con Immer {/*write-concise-update-logic-with-immer*/}

Actualizar _arrays_ anidados sin mutación puede volverse un poco repetitivo. [Al igual que con los objetos](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- En general, no deberías necesitar actualizar el estado más de un par de niveles de profundidad. Si tus objetos de estado son muy profundos, es posible que desees [reestructurarlos de manera diferente](/learn/choosing-the-state-structure#avoid-deeply-nested-state) para que sean planos.
- Si no deseas cambiar la estructura de tu estado, puedes preferir usar [Immer](https://github.com/immerjs/use-immer), que te permite escribir usando la sintaxis conveniente, pero que realiza mutaciones, y se encarga de producir las copias por ti.

Aquí está el ejemplo de una Lista de deseos de arte reescrito con Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Grandes barrigas', seen: false },
  { id: 1, title: 'Paisaje lunar', seen: false },
  { id: 2, title: 'Guerreros de terracota', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Lista de deseos de arte</h1>
      <h2>Mi lista de obras de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Tu lista de obras de arte para ver:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Ten en cuenta cómo con Immer, **la mutación como `artwork.seen = nextSeen` ahora está bien:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Esto se debe a que no está mutando el estado _original_, sino que está mutando un objeto `draft` especial proporcionado por Immer. Del mismo modo, puedes aplicar métodos de mutación como `push()` y `pop()` al contenido del `draft`.

Tras bambalinas, Immer siempre construye el siguiente estado desde cero de acuerdo con los cambios que ha realizado en el `draft`. Esto mantiene tus controladores de eventos muy concisos sin mutar nunca el estado.

<Recap>

- Puedes poner _arrays_ en el estado, pero no puedes cambiarlos.
- En lugar de mutar un _array_, crea una *nueva* versión y actualiza el estado.
- Puedes usar la sintaxis de propagación `[...arr, newItem]` para crear _arrays_ con nuevos elementos.
- Puedes usar `filter()` y `map()` para crear nuevos _arrays_ con elementos filtrados o transformados.
- Puedes usar Immer para mantener tu código conciso.

</Recap>



<Challenges>

#### Actualizar un artículo en el carrito de compras {/*update-an-item-in-the-shopping-cart*/}

Completa la lógica `handleIncreaseClick` para que al presionar "+" aumente el número correspondiente:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Queso',
  count: 5,
}, {
  id: 2,
  name: 'Espaguetis',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Puedes usar la función `map` para crear un nuevo _array_, y luego usar la sintaxis del operador de propagación de objetos `...` para crear una copia del objeto modificado para el nuevo _array_:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Queso',
  count: 5,
}, {
  id: 2,
  name: 'Espaguetis',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Eliminar un artículo del carrito de compras {/*remove-an-item-from-the-shopping-cart*/}

Este carrito de compras tiene un botón "+" que funciona, pero el botón "–" no hace nada. Debes agregarle un controlador de evento para que al presionarlo disminuya el `count` del producto correspondiente. Si presionas "–" cuando el conteo es 1, el producto debería eliminarse automáticamente del carrito. Asegúrate de que nunca muestre 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Queso',
  count: 5,
}, {
  id: 2,
  name: 'Espaguetis',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Primero puedes usar `map` para producir un nuevo _array_, y luego `filter` para eliminar productos con un `count` establecido en `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Queso',
  count: 5,
}, {
  id: 2,
  name: 'Espaguetis',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Repara las mutaciones usando métodos que no muten {/*fix-the-mutations-using-non-mutative-methods*/}

En este ejemplo, todos los controladores de eventos en `App.js` usan mutación. Como resultado, la edición y eliminación de tareas no funciona. Vuelve a escribir `handleAddTodo`, `handleChangeTodo` y `handleDeleteTodo` para usar los métodos no que no realicen mutaciones:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leche', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Preparar té', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Agregar tarea"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Agregar</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Guardar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Eliminar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

En `handleAddTodo`, puedes usar el operador de propagación de _arrays_. En `handleChangeTodo`, puedes crear un nuevo _array_ con `map`. En `handleDeleteTodo`, puedes crear un nuevo _array_ con `filter`. Ahora la lista funciona correctamente:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leche', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Preparar té', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Añadir tarea"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Agregar</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Guardar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Eliminar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Arregla las mutaciones usando Immer {/*fix-the-mutations-using-immer*/}

Este es el mismo ejemplo que en el desafío anterior. Esta vez, arregla las mutaciones usando Immer. Para tu comodidad, `useImmer` ya está importado, por lo que debes cambiar la variable de estado `todos` para usarlo.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leche', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Preparar té', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Agregar tarea"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Añadir</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Guardadr
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Eliminar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Con Immer, puedes escribir código con estilo de mutación, siempre y cuando solo esté mutando partes del `draft` que Immer te proporciona. Aquí, todas las mutaciones se realizan en el `draft` para que el código funcione:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leche', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Preparar té', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Añadir tarea"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Agregar</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Guardar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Eliminar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

También puede mezclar y combinar los enfoques de mutación y no mutación con Immer.

Por ejemplo, en esta versión `handleAddTodo` se implementa con la mutación del `draft` de Immer, mientras `handleChangeTodo` y `handleDeleteTodo` usa los métodos sin mutación `map` y `filter`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leche', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Preparar té', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Nueva tarea"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Añadir</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Guardar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Eliminar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Con Immer, puedes elegir el estilo que se sienta más natural para cada caso individual.

</Solution>

</Challenges>
