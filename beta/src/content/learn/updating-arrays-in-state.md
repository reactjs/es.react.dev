---
title: Actualizando arreglos en el estado
---

<Intro>

Los arreglos son mutables en JavaScript, pero tú podrías tratarlos como inmutables cuando los almacenas en el estado. Justo como los objetos, cuando quieras actualizar un arreglo almacenado en el estado, necesitas crear uno nuevo ( o hacer una copia de uno existente), luego almacenarlo en el estado para hacer uso de este nuevo arreglo. 

</Intro>

<YouWillLearn>

- Cómo añadir, remover, o cambiar items en un arreglo en el estado de React
- Cómo actualizar un objeto dentro de un arreglo
- Cómo copiar un arreglo de forma menos repetitiva con Immer

</YouWillLearn>

## Actualizando arreglos sin mutación {/*updating-arrays-without-mutation*/}

En JavaScript, los arreglos son sólo otro tipo de objeto. [Como con los objetos](/learn/updating-objects-in-state), **deberías tratar los arreglos en estado React como solo lectura.** Esto significa que no deberías reasignar elementos dentro de un arreglo como `arr[0] = 'pájaro'`, y tampoco deberías usar métodos que puedan mutar el arreglo, como `push()` y `pop()`.

En su lugar, cada vez que quieras actualizar un arreglo, querrás pasar un, *nuevo* arreglo a su función de configuración de estado.Para hacer eso, puedes crear un nuevo arreglo a partir de el arreglo original en su estado llamando a sus métodos no mutantes como `filter()` por `map()`. Luego puede establecer su estado a partir de un nuevo arreglo.

Aquí hay una tabla de referencia con las operaciones más comunes con arreglos. Cuando se trata de arreglos dentro de el estado de React, necesitarás evitar los métodos de la columna izquierda, y en su lugar es preferible usar los métodos de la columna derecha.

|              | evita (muta el arreglo)                  | preferido (retorna un nuevo arreglo)                                         |
|--------------|------------------------------------------|------------------------------------------------------------------------------|
| añadiendo    | `push`, `unshift`                        | `concat`, `[...arr]` operador de propagación ([ejemplo](#adding-to-an-array))|
| removiendo   | `pop`, `shift`, `splice`                 | `filter`, `slice` ([ejemplo](#removing-from-an-array))                       |
| reemplazando | `splice`, `arr[i] = ...` asigna          | `map` ([ejemplo](#replacing-items-in-an-array))                              |
| ordenando    | `reverse`, `sort`                        | copia el arreglo primero ([ejemplo](#making-other-changes-to-an-array))      |

Alternativamente, tú puedes [usar Immer](#write-concise-update-logic-with-immer) el cual te permite usar métodos de ambas columnas.

<Pitfall>

Desafortunadamente, [`slice`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) and [`splice`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) están nombrados de forma similar pero estos son my diferentes:

* `slice` te permite copiar un arreglo o una parte del mismo.
* `splice` **muta** el arreglo (para insertar o eliminar elementos).

En React, estarás usando `slice` (no `p`!) mucho más seguido porque no quieres mutar objetos o arreglos en el estado. [Actualizando objetos](/learn/updating-objects-in-state) explica qué es mutación y por qué esto no es recomendado para el estado.

</Pitfall>

### Añadiendo un arreglo {/*adding-to-an-array*/}

`push()` muta un arreglo, lo cual no queremos:

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
        setName('');
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

En su lugar, crea un *nuevo* arreglo el cual contenga los elementos existentes *y* un nuevo elemento al final. Hay multiples formas para hacer esto, pero la más fácil es usar la sintaxis `...` [operador de propagación en arreglos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Remplaza el estado
  [ // con el nuevo arreglo
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
        setName('');
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

El operador de propagación también te permite anteponer un elemento colocandolo *antes* de el original `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Coloca los elementos antiguos al final
]);
```

De esta forma, el operador de propagación puede hacer el trabajo tanto de `push()` añadiendo en el final del arreglo como de `unshift()` agregando al comienzo de el arreglo. ¡Pruebalo en el editor de arriba!

### Eliminando elementos de un arreglo {/*removing-from-an-array*/}

La forma más fácil de remover un elemento de un arreglo es *filtrarlo*. En otras palabras, producirás un nuevo arreglo el cual no contendrá ese elemento. Para hacer esto, usa el método `filter`, por ejemplo:

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

Haz click en el botón de "Eliminar" varias veces, y mira su controlador de clics.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Aquí, `artists.filter(a => a.id !== artist.id)` significa "crea un nuevo arreglo el cual consista de aquellos `artists` cuyos IDs son diferentes de `artist.id`". En otras palabras, el botón "Eliminar" de cada artista filtrará a _ese_ artista de el arreglo y luego solicitará una nueva representación con el arreglo resultante. Ten en cuenta que `filter` no modifica el arreglo original.

### Transformando un arreglo {/*transforming-an-array*/}

Si deseas cambiar algunos o todos los elementos de el arreglo, puedes usar `map()` para crear un **nuevo** arreglo. La función que pasará a `map` puede decidir qué hacer con cada elemento, en función de sus datos o su índice (o ambos).

En este ejemplo, un arreglo contiene las coordenadas de dos círculos y un cuadrado. Cuando presiona el botón, mueve solo los círculos 50 píxeles hacia abajo. Lo hace produciendo un nuevo arreglo de datos usando `map()`:

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
    // Vuelve a renderizar con el nuevo arreglo
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

### Reemplazo de elementos en un arreglo {/*replacing-items-in-an-array*/}

Es particularmente común querer reemplazar uno o más elementos en un arreglo. Las asignaciones como `arr[0] = 'pájaro'` están mutando el arreglo original, por lo que también querrás usar `map` para esto.

Para reemplazar un elemento, crea una un nuevo arreglo con `map`. Dentro de su llamada `map`, recibirá el índice del elemento como segundo argumento. Úsalo para decidir si devolver el elemento original (el primer argumento) o algo más:

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

### Insertando en un arreglo {/*inserting-into-an-array*/}

A veces, es posible que desees insertar un elemento en una posición particular que no esté ni al principio ni al final. Para hacer esto, puedes usar la sintaxis de propagación para arreglos `...` junto con el método `slice()`. El método `slice()` te permite cortar una "rebanada" de el arreglo. Para insertar un elemento, crearás un arreglo que extienda el segmento _antes_ del punto de inserción, luego el nuevo elemento y luego el resto de el arreglo original.

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
      // New item:
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

### Hacer otros cambios en un arreglo {/*making-other-changes-to-an-array*/}

Hay algunas cosas que no puedes hacer con la sintaxis extendida y los métodos que no mutan como `map()` y `filter()` solos. Por ejemplo, es posible que desees invertir u ordenar un arreglo. Los métodos JavaScript `reverse()` y `sort()` están mutando el arreglo original, por lo que no puede usarlos directamente.

**Sin embargo, puedes copiar el arreglo primero y luego realizar cambios en él.**

Por ejemplo:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
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
        Inverso
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

Aquí, usa la sintaxis de propagación `[...list]` para crear primero una copia de el arreglo original. Ahora que tienes una copia, puedes usar métodos de mutación como `nextList.reverse()` o `nextList.sort()`, o incluso asignar elementos individuales con `nextList[0] = "algo"`.

Sin embargo, **incluso si copias un arreglo, no puede mutar los elementos existentes _dentro_ de éste directamente.** Esto se debe a que la copia es superficial: el nuevo arreglo contendrá los mismos elementos que la original. Entonces, si modificas un objeto dentro de el arreglo copiado, estás mutando el estado existente. Por ejemplo, un código como este es un problema.

```js
const nextList = [...list];
nextList[0].seen = true; // Problema: muta list[0]
setList(nextList);
```

Aunque `nextList` y `list` son dos arreglos diferentes, **`nextList[0]` y `list[0]` apuntan al mismo objeto.** Entonces, al cambiar `nextList[0].seen`, está también cambiando `list[0].seen`. ¡Esta es una mutación de estado que debes evitar! Puedes resolver este problema de forma similar a [actualizar objetos JavaScript anidados](/learn/updating-objects-in-state#updating-a-nested-object): copiando elementos individuales que deseas cambiar en lugar de mutarlos. Así es cómo.

## Actualizando objetos dentro de arreglos {/*updating-objects-inside-arrays*/}

Los objetos no están _realmente_ ubicados "dentro" de los arreglos. Puede parecer que están "dentro" del código, pero cada objeto en un arreglo es un valor separado, al que "apunta" el arreglo. Es por eso que debe tener cuidado al cambiar campos anidados como `list[0]`. ¡La lista de obras de arte de otra persona puede apuntar al mismo elemento de el arreglo!

**Al actualizar el estado anidado, debe crear copias desde el punto en el que desea actualizar y hasta el nivel superior.** Veamos cómo funciona esto.

En este ejemplo, dos listas separadas de ilustraciones tienen el mismo estado inicial. Se supone que deben estar aislados, pero debido a una mutación, su estado se comparte accidentalmente y marcar una casilla en una lista afecta a la otra lista:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
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
      <h1>Bucket de arte</h1>
      <h2>Mi lista de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Tu lista de arte para ver:</h2>
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

Aunque el arreglo `myNextList` en sí mismo es nuevo, los *elementos iguales* son los mismos que en el arreglo `myList` original. Entonces, cambiar `artwork.seen` cambia el elemento de la obra de arte *original*. Ese elemento de la obra de arte también está en `yourArtworks`, lo que causa el error. Errores como este pueden ser difíciles de pensar, pero afortunadamente desaparecen si evitas el estado de mutación.

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
});
```

Aquí, `...` es la sintaxis de propagación de objetos utilizada para [crear una copia de un objeto.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

Con este enfoque, ninguno de los elementos del estado existentes se modifica y el error se soluciona:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
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
      <h1>Bucket de arte</h1>
      <h2>Mi lista de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Tu lista de arte para ver:</h2>
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

En general, **solo debes mutar objetos que acaba de crear.** Si estuvieras insertando una *nueva* obra de arte, podría mutarla, pero si se trata de algo que ya está en estado, debes hacer una copia.

### Escribe una lógica de actualización concisa con Immer {/*write-concise-update-logic-with-immer*/}

Al actualizar arreglos anidados sin mutación puede volverse un poco repetitivo. [Al igual que con los objetos](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- En general, no deberías de necesitar actualizar el estado más de un par de niveles de profundidad. Si tus objetos de estado son muy profundos, es posible que desees [reestructurarlos de manera diferente](/learn/choosing-the-state-structure#avoid-deeply-nested-state) para que sean planos.
- Si no deseas cambiar su estructura de estado, puedes preferir usar [Immer](https://github.com/immerjs/use-immer), que te permite escribir usando la sintaxis conveniente pero cambiante y se encarga de producir las copias para usted.

Aquí está el ejemplo de un Bucket de arte reescrito con Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourArtworks, updateYourList] = useImmer(
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
      <h1>Bucket de arte</h1>
      <h2>Mi lista de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Tu lista de arte para ver:</h2>
      <ItemList
        artworks={yourArtworks}
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

Detrás de escena, Immer siempre construye el siguiente estado desde cero de acuerdo con los cambios que ha realizado en el `draft`. Esto mantiene sus controladores de eventos muy concisos sin cambiar nunca el estado.

<Recap>

- Puedes poner arreglos en el estado, pero no puedes cambiarlos.
- En lugar de mutar un arreglo, crea una *nueva* versión y actualiza el estado.
- Puedes usar la sintaxis de propagación `[...arr, newItem]` para crear arreglos con nuevos elementos.
- Puedes usar `filter()` y `map()` para crear nuevos arreglos con elementos filtrados o transformados.
- Puedes usar Immer para mantener su código conciso.

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

Puedes usar la función `map` para crear un nuevo arreglo, y luego usar la sintaxis del operador de propagación de objetos `...` para crear una copia del objeto modificado para el nuevo arreglo:

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

Este carrito de compras tiene un botón "+" que funciona, pero el botón "–" no hace nada. Debes agregarle un controlador de eventos para que al presionarlo disminuya el `count` del producto correspondiente. Si presionas "–" cuando el conteo es 1, el producto debería eliminarse automáticamente del carrito. Asegúrate de que nunca muestre 0.

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

Primero puedes usar `map` para producir un nuevo arreglo, y luego `filter` para eliminar productos con un `count` establecido en `0`:

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

#### Repara las mutaciones usando métodos no mutativos {/*fix-the-mutations-using-non-mutative-methods*/}

En este ejemplo, todos los controladores de eventos en `App.js` usan mutación. Como resultado, la edición y eliminación de todos no funciona. Vuelva a escribir `handleAddTodo`, `handleChangeTodo` y `handleDeleteTodo` para usar los métodos no mutativos:

<Sandpack>

```js App.js
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

```js AddTodo.js
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

```js TaskList.js
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

En `handleAddTodo`, puedes usar el operador de propagación de arreglos. En `handleChangeTodo`, puedes crear un nuevo arreglo con `map`. En `handleDeleteTodo`, puedes crear un nuevo arreglo con `filter`. Ahora la lista funciona correctamente:

<Sandpack>

```js App.js
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

```js AddTodo.js
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

```js TaskList.js
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

Este es el mismo ejemplo que en el desafío anterior. Esta vez, arregla las mutaciones usando Immer. Para tú comodidad, `useImmer` ya está importado, por lo que debes cambiar la variable de estado `todos` para usarlo.

<Sandpack>

```js App.js
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

```js AddTodo.js
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

```js TaskList.js
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

Con Immer, puedes escribir código de forma mutativa, siempre y cuando solo esté mutando partes del `draft` que Immer le proporciona. Aquí, todas las mutaciones se realizan en el `draft` para que el código funcione:

<Sandpack>

```js App.js
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

```js AddTodo.js
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

```js TaskList.js
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

También puede mezclar y combinar los enfoques mutativos y no mutativos con Immer.

Por ejemplo, en esta versión `handleAddTodo` es implementado usando Immer `draft`, mientras `handleChangeTodo` y `handleDeleteTodo` usa los métodos no mutativos `map` y `filter`:

<Sandpack>

```js App.js
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

```js AddTodo.js
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

```js TaskList.js
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

Con Immer, puedes elegir el estilo el cual se sienta más natural por cada caso separado.

</Solution>

</Challenges>
