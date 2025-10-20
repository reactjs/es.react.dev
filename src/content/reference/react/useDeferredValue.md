---
title: useDeferredValue
---

<Intro>

`useDeferredValue` es un Hook de React que permite realizar una actualización en diferido de una parte de la UI.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

Llama a `useDeferredValue` en el nivel superior de tu componente para obtener una versión diferida del valor.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `value`: El valor que se quiere diferir. Puede ser de cualquier tipo.
* **optional** `initialValue`: A value to use during the initial render of a component. If this option is omitted, `useDeferredValue` will not defer during the initial render, because there's no previous version of `value` that it can render instead.


#### Devuelve {/*returns*/}

- `currentValue`: During the initial render, the returned deferred value will be the `initialValue`, or the same as the value you provided. During updates, React will first attempt a re-render with the old value (so it will return the old value), and then try another re-render in the background with the new value (so it will return the updated value).

#### Advertencias {/*caveats*/}

- When an update is inside a Transition, `useDeferredValue` always returns the new `value` and does not spawn a deferred render, since the update is already deferred.

- The values you pass to `useDeferredValue` should either be primitive values (like strings and numbers) or objects created outside of rendering. If you create a new object during rendering and immediately pass it to `useDeferredValue`, it will be different on every render, causing unnecessary background re-renders.

- Cuando `useDeferredValue` recibe un valor diferente (comparado con [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), además de la renderización actual (cuando aún utiliza el valor anterior), programa una re-renderización en segundo plano con el nuevo valor. La re-renderización en segundo plano es interrumpible: si hay otra actualización del `valor`, React reiniciará la re-renderización en segundo plano desde cero. Por ejemplo, si el usuario está escribiendo en un `input` más rápido de lo que la gráfica que recibe su valor diferido puede volver a renderizarse, la gráfica solo se volverá a renderizar cuando el usuario deje de escribir.

- `useDeferredValue` está integrado con [`<Suspense>`.](/reference/react/Suspense) Si la actualización en segundo plano causada por un nuevo valor suspende la UI, el usuario no verá el `fallback`. Verá el antiguo valor diferido hasta que se carguen los datos.

- `useDeferredValue` no previene por sí mismo las peticiones de red adicionales.

- No existe un retardo fijo causado por `useDeferredValue`. Tan pronto como React finalice el renderizado original, inmediatamente, empezará a trabajar sobre el re-renderizado en segundo plano con el nuevo valor diferido. Cualquier actualización causada por eventos (como escribir por teclado) interrumpirá y tendrá prioridad respecto al proceso de re-renderizado en segundo plano.

- El re-renderizado en segundo plano causado por `useDeferredValue` no dispara Efectos hasta que se haya confirmado en pantalla. Si el proceso de re-renderizado en segundo plano se suspende, los Efectos volverán a ejecutarse una vez los datos hayan sido cargados y la UI se haya actualizado.

---

## Uso {/*usage*/}

### Mostrar contenido desactualizado mientras se carga el contenido actualizado. {/*showing-stale-content-while-fresh-content-is-loading*/}

Llama a `useDeferredValue` en el nivel superior de tu componente para retrasar la actualización de alguna parte de tu UI.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Durante el renderizado inicial,  el <CodeStep step={2}>valor diferido</CodeStep> será el mismo que el <CodeStep step={1}>valor</CodeStep> que se proporcione.

Durante las actualizaciones, el <CodeStep step={2}>valor diferido</CodeStep> tendrá un "retardo" respecto al último <CodeStep step={1}>valor</CodeStep>. Concretamente, React re-renderizará primero *sin* actualizar el valor diferido y posteriormente intentará re-renderizar con el nuevo valor recibido en segundo plano.

**Analicemos un ejemplo para ver en qué situaciones resulta útil."**

<Note>

Este ejemplo asume que se está utilizando una origen de datos con _Suspense_ habilitado:

- Frameworks para la obtención de datos con _Suspense_ habilitado como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) y [Next.js](https://nextjs.org/docs/getting-started/react-essentials).
- Carga diferida de código de componentes con [`lazy`](/reference/react/lazy)
- Leer el valor de una promesa con [`use`](/reference/react/use)

- Componentes que empleen carga diferida mediante [`lazy`](/reference/react/lazy).

[Aprende más sobre _Suspense_ y sus limitaciones.](/reference/react/Suspense)

</Note>


En este ejemplo, el componente `SearchResults` [se suspende](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) mientras se obtienen los resultados de búsqueda. Intenta escribir `"a"`, espera a que se muestren los resultados y luego edita el valor a `"ab"`. El resultado para `"a"` sera reemplazado por el _fallback_ de carga que indica que se están obteniendo los nuevos resultados.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Buscar álbumes:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<<<<<<< HEAD
Una alternativa común en la UI es *diferir* la actualización de las listas de resultados y seguir mostrando los anteriores resultados hasta que los nuevos estén disponibles. Llama a `useDeferredValue` para pasar una versión diferida de la `query`:
=======
A common alternative UI pattern is to *defer* updating the list of results and to keep showing the previous results until the new results are ready. Call `useDeferredValue` to pass a deferred version of the query down:
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Buscar álbumes:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

La `query` se actualizará inmediatamente, por lo que el _input_ mostrará el nuevo valor. No obstante, el `deferredQuery` mantendrá el valor previo hasta que los datos se hayan cargado, por lo que `SearchResults` mostrará resultados obsoletos durante un instante.

Escribe `"a"` en el siguiente ejemplo, espera a que se carguen los resultados y entonces edita el valor del _input_ a `"ab"`. Observa como, en lugar del _Suspense fallback_, ahora podrás ver los resultados obsoletos en la lista hasta que los nuevos valores se hayan cargado:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Buscar álbumes:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### ¿Cómo funciona realmente diferir un valor? {/*how-does-deferring-a-value-work-under-the-hood*/}

Puedes pensar que ocurre de acuerdo a estos dos pasos:

<<<<<<< HEAD
1. **En primer lugar, React re-renderiza con la nueva `query` (`"ab"`) pero utilizando el anterior `deferredQuery` (cuyo valor aún es `"a"`).** El valor de `deferredQuery`, el cual se pasa a la lista resultante, está "diferido" respecto al valor de la `query`.
=======
1. **First, React re-renders with the new `query` (`"ab"`) but with the old `deferredQuery` (still `"a"`).** The `deferredQuery` value, which you pass to the result list, is *deferred:* it "lags behind" the `query` value.
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

2. **En segundo plano, React intentará re-renderizar con *ambos* `query` y `deferredQuery` actualizados con el valor `"ab"`.** Si este re-renderizado se completa, React lo mostrará por pantalla. De lo contrario, si se "suspende" (los resultados para `"ab"` aún no se han cargado), React abandonará este intento de renderización y re-intentará este re-renderizado nuevamente una vez los datos hayan sido cargados. El usuario seguirá viendo el valor diferido obsoleto hasta que los datos hayan sido cargados.

La renderización diferida en segundo plano se puede interrumpir. Por ejemplo, si escribimos en el _input_ nuevamente, React abandonará esa renderización y comenzará una nueva con el nuevo valor. React siempre utilizará el último valor proporcionado.

Ten en cuenta que sigue habiendo una petición de red por cada pulsación de tecla. Lo que se aplaza aquí es la visualización de los resultados (hasta que estén listos), no las peticiones de red en sí. Incluso si el usuario continúa escribiendo, las respuestas para cada pulsación de tecla se almacenan en caché, por lo que pulsar _Backspace_ es instantáneo y no se obtiene de nuevo.

</DeepDive>

---

### Indicar que el contenido es obsoleto {/*indicating-that-the-content-is-stale*/}

En el ejemplo anterior no se está indicando que los resultados de la lista, para la ultima query ejecutada, aún están cargando. Esto puede llegar a ser confuso para el usuario si los nuevos resultados toman un tiempo para cargarse y estar disponibles. Para hacer esto algo mas obvio para el usuario, se puede añadir una indicación visual cuando los resultados de la lista que se muestra están obsoletos:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Con este cambio, tan pronto como el usuario comience a escribir, los resultados obsoletos de la lista se atenuarán temporalmente hasta que los nuevos resultados estén disponibles. También puedes emplear una transición mediante CSS para crear un retardo a la hora de atenuar los resultados de tal forma que se produzca una transición suave y gradual cuando estos se atenúen. Observa el siguiente ejemplo:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Buscar álbumes:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### Diferir el re-renderizando una parte de la UI {/*deferring-re-rendering-for-a-part-of-the-ui*/}

Puedes utilizar `useDeferredValue` como medio para optimizar el rendimiento. Es útil cuando una parte de tu UI es más lenta a la hora de re-renderizar y no existe una forma fácil de optimizarlo a fin de evitar que otras partes de la UI se bloqueen.

Imagina que tienes un campo de texto _input_ y un componente (como un gráfico o una lista larga) que se vuelve a mostrar cada vez que pulsas una tecla:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

En primer lugar, optimizaremos `SlowList` para evitar re-renderizados cuando las `props` son las mismas. Para hacer esto, [lo envolveremos en `memo`](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

No obstante, esto solo serviría si las `props` de `SlowList` son *las mismas* que en el anterior renderizado. El problema que se experimenta ahora es que el componente es lento cuando las `props` son *distintas* y cuando se necesita mostrar valores distintos a los previos.

En concreto, el principal problema de rendimiento es que, cada vez que se introduce un nuevo valor en el _input_, el componente `SlowList` recibe nuevas `props` y se re-renderiza por completo. Esto hace que el comportamiento del componente se sienta entrecortado. En este caso, `useDeferredValue` te permite priorizar la actualización del _input_ (que es más rápida) frente a la actualización de la lista de resultados (que es más lenta):

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

Esto no hace que el re-renderizado de `SlowList` sea más rápido. Sin embargo indica a React que el re-renderizado de la lista puede se postergado para que no bloquee la introducción de nuevos valores al _input_. La actualización de la lista tendrá un retardo con respecto al nuevo valor introducido en el _input_ y posteriormente se actualizará. Tal y como ocurría anteriormente, React intentará actualizar los resultados de la lista lo antes posible, pero no bloqueando al usuario de introducir nuevos valores en el _input_.

<Recipes titleText="Diferencias entre el uso de useDeferredValue y un re-renderizado no optimizado" titleId="examples">

#### Re-renderizado diferido de la lista {/*deferred-re-rendering-of-the-list*/}

En este ejemplo, cada ítem del componente `SlowList` está **ralentizado artificialmente** para que puedas observar como `useDeferredValue` te permite mantener el _input_ con una respuesta rápida. Escribe en el _input_ y nota como la escritura se siente rápida mientras la lista tiene un retardo respecto a la escritura.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // No hace nada durante 1 ms por ítem para emular un código extremadamente lento
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Re-renderizado de la lista sin optimizar {/*unoptimized-re-rendering-of-the-list*/}

En este ejemplo cada ítem del componente `SlowList` está **ralentizado artificialmente** pero no se está utilizando `useDeferredValue`.

Nota como la escritura se nota muy entrecortada. Esto es porque, al no utilizar `useDeferredValue`, cada pulsación de teclado, que introduce nuevos valores en el _input_, fuerza a que toda la lista se re-renderice inmediatamente de forma ininterrumpida.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // No hace nada durante 1 ms por ítem para emular un código extremadamente lento
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Esta optimización requiere que `SlowList` esté envuelto en [`memo`.](/reference/react/memo) Esto es porque, cada vez que se produce un cambio en `text`, React necesita ser capaz de re-renderizar el componente padre rápidamente. Durante este re-renderizado `deferredText` aún mantiene el valor previo, por lo que `SlowList` es capaz de saltarse el re-renderizado (las `props` no han cambiado). Sin utilizar [`memo`,](/reference/react/memo) esto podría desencadenar un nuevo re-renderizado, lo cual no cumpliría el propósito de la optimización.

</Pitfall>

<DeepDive>

#### ¿Qué diferencia "diferir un valor" respecto a hacer _debounce_ y _throttle_? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Existen dos técnicas de optimización que podrías haber utilizado en esta situación:

- *Debounce*: esperar hasta que el usuario deje de escribir (durante, por ejemplo, un segundo) y actualizar la lista posteriormente.
- *Throttle*: Actualizar la lista un numero limitado de veces cada cierto tiempo (por ejemplo, como mucho, una vez por segundo).

Mientras que estas técnicas son útiles en algunos casos, `useDeferredValue` es mejor en cuanto a optimizar el proceso de renderizado ya que esta profundamente integrado con React y se adapta al dispositivo que utilice el usuario.

En lugar de _debounce_ o _throttle_, no requiere emplear un retardo fijo. Si el dispositivo del usuario es rápido (por ejemplo una computadora potente), el re-renderizado diferido ocurrirá prácticamente de forma inmediata e imperceptible. Si el dispositivo del usuario es lento la actualización de la lista tras modificar el valor del _input_ tendrá un retardo proporcional a lo lento que sea dicho dispositivo.

Añadir que los re-renderizados diferidos realizados por `useDeferredValue` se pueden interrumpir por defecto. Esto significa que, si React se encuentra en mitad de un proceso de re-renderizado de una lista con muchos resultados, pero el usuario pulsa una tecla sobre el _input_, a fin de introducir un nuevo valor, React abandonará ese re-renderizado y comenzará uno nuevo en segundo plano. En contraste, _debounce_ y _throttle_ producen una experiencia entrecortada ya que *bloquean* y posponen el momento en el que se re-renderiza el contenido por cada pulsación de tecla cuando se introducen nuevos valores en el _input_.

Si la optimización no ocurre durante el renderizado, _debounce_ y _throttle_ aún son útiles en ese caso. Por ejemplo, te permitirán realizar menos peticiones de red. También puedes utilizar estas técnicas al mismo tiempo.

</DeepDive>