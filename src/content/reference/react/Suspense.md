---
title: <Suspense>
---

<Intro>

`<Suspense>` te permite mostrar una interfaz alternativa o *fallback* hasta que sus hijos hayan terminado de cargar.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Props {/*props*/}
* `children`: La interfaz que realmente se pretende renderizar. Si `children` se suspende mientras se renderiza, la barrera de Suspense pasará a renderizar `fallback`.
* `fallback`: Una interfaz alternativa a renderizar en lugar de la interfaz real si esta no ha terminado de cargar. Se acepta cualquier nodo React válido, aunque en la práctica, un *fallback* es una vista ligera de relleno, como un *spinner* de carga o un esqueleto. Suspense cambiará automáticamente a `fallback` cuando `children` se suspenda, y volverá a `children` cuando los datos estén listos. Si `fallback` se suspende mientras se renderiza, activará la barrera de Suspense padre más cercana.

#### Advertencias {/*caveats*/}

- React no preserva ningún estado para los renderizados que se suspendieron antes de que pudieran montarse por primera vez. Cuando el componente se haya cargado, React volverá a intentar renderizar el árbol suspendido desde cero.
-  Si la suspensión estaba mostrando contenido para el árbol, pero luego se volvió a suspender, el `fallback` se mostrará de nuevo a menos que la actualización que lo causó fuese causada por [`startTransition`](/reference/react/startTransition) o [`useDeferredValue`](/reference/react/useDeferredValue).
- Si React necesita ocultar el contenido ya visible porque se suspendió de nuevo, limpiará [los Efectos de *layout*](/reference/react/useLayoutEffect) en el árbol de contenido. Cuando el contenido esté listo para mostrarse de nuevo, React disparará los Efectos de *layout* de nuevo. Esto le permite asegurarse de que los Efectos que miden el diseño del DOM no intentan hacerlo mientras el contenido está oculto.
- React incluye optimizaciones internas como *Renderizado en el servidor con Streaming* e *Hidratación selectiva* que se integran con Suspense. Puedes leer [una visión general de la arquitectura](https://github.com/reactwg/react-18/discussions/37) y ver [esta charla técnica](https://www.youtube.com/watch?v=pj5N-Khihgc) para conocer más.

---

## Uso {/*usage*/}

### Visualización de una interfaz alternativa mientras se carga el contenido {/*displaying-a-fallback-while-content-is-loading*/}

Puedes envolver cualquier parte de la aplicación con un barrera de Suspense:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React mostrará tu <CodeStep step={1}>*fallback* de carga</CodeStep> hasta que se haya cargado todo el código y los datos que necesiten <CodeStep step={2}>los hijos</CodeStep>.

En el ejemplo de abajo, el componente `Albums` *se suspende* mientras carga la lista de álbumes. Hasta que no esté listo para renderizar, React hace que la barrera de Suspense más próxima desde arriba cambie a mostrar el *fallback*: tu componente `Loading`. Luego, una vez que se carguen los datos, React esconde el *fallback* `Loading` y renderiza el componente `Albums` con datos.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

<Note>

**Sólo las fuentes de datos habilitadas para Suspense activarán un componente Suspense.** Entre ellas se incluyen:

- Carga de datos en frameworks capaces de manejar Suspense como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) y [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Código de carga diferida de componentes con [`lazy`](/reference/react/lazy)
- Leer el valor de una promesa guardada en caché con [`use`](/reference/react/use)

Suspense **no** detecta la carga de datos cuando se hace en un Efecto o un controlador de evento.

La forma exacta en que cargarías los datos en el componente `Albums` de arriba depende de tu framework. Si usas un framework capaz de manejar Suspense, encontrarás los detalles en su documentación de la carga de datos.

Aún no se admite la carga de datos con Suspense sin el uso de un framework que tenga su propia forma de implementarla. Los requisitos para implementar una fuente de datos habilitada para Suspense son inestables y no están documentados. En una futura versión de React se publicará una API oficial para integrar fuentes de datos con Suspense.

</Note>

---

### Revelar contenido todo de una vez {/*revealing-content-together-at-once*/}

Por defecto, todo el árbol dentro de Suspense se trata como una sola unidad. Por ejemplo, incluso si *solo uno* de estos componentes se suspende mientras espera por algunos datos, *todos* juntos serán reemplazados por el indicador de carga:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Luego, una vez que todos estén listos para mostrarse, aparecerán todos de una vez.

En el ejemplo de abajo, tanto `Biography` como `Albums` cargan algunos datos. Sin embargo, como están agrupados en la misma barrera de Suspense, estos componentes siempre "aparecen* juntos al mismo tiempo.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Los componentes que cargan datos no tienen que ser hijos directos de una barrera de Suspense. Por ejemplo, puedes mover `Biography` y `Albums` dentro de un nuevo componente `Details`. Esto no cambia el comportamiento. Como `Biography` y `Albums` comparten la misma barrera de Suspense más cercana, se muestran juntos de forma coordinada.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### Revelar el contenido anidado mientras se carga {/*revealing-nested-content-as-it-loads*/}

Cuando un componente se suspende, el componente Suspense padre más cercan muestra el *fallback*. Esto te permite anidar varios componentes Suspense para crear una secuencia de carga. El *fallback* de cada barrera de Suspense se rellenará a medida que el siguiente nivel de contenido esté disponible. Por ejemplo, puedes darle su propio *fallback* de carga a la lista de álbumes:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

Con este cambio, no se necesita esperar por que cargue `Albums` para mostrar `Biography`.

La secuencia sería:

1. Si `Biography` aún no ha cargado, se muestra `BigSpinner` en lugar de toda el área de contenido.
2. Una vez que `Biography` termine de cargar, `BigSpinner` se reemplaza por el contenido.
3. Si `Albums` aún no ha cargado, se muestra `AlbumsGlimmer` en lugar de `Albums` y su padre `Panel`.
4. Por último, una vez que `Albums` termina de cargar, reemplaza a `AlbumsGlimmer`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Las barrearas de Suspense te permiten coordinar qué partes de tu UI deben siempre "aparecer" juntas al mismo tiempo y qué partes deberían revelar progresivamente más contenido en una secuencia de estados de carga. Puedes añadir, mover o eliminar barreras de Suspense en cualquier lugar del árbol sin afectar el comportamiento restante de tu aplicación.

No pongas una barrera de Suspense alrededor de cada componte. Las barreras de Suspense no deberían ser más granulares que la secuencia de carga que quieres que el usuario experimente. Si trabajas con un diseñador, pregúntale dónde deben colocarse los estados de carga --es probable que ya los hayan incluido en el diseño de sus *wireframes*.

---

### Mostrar contenido antiguo mientras se carga el nuevo {/*showing-stale-content-while-fresh-content-is-loading*/}

En este ejemplo, el componente `SearchResults` se suspende mientras carga los resultados de búsqueda. Intenta escribir `"a"`, espera por los resultados, y luego edítalo a `"ab"`. Los resultados para `"a"` se reemplazarán por el *fallback* de carga.

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
    setTimeout(resolve, 500);
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

Un patrón de UI común consiste en *aplazar* la actualización de la lista de resultados y seguir mostrando los resultados anteriores hasta que los nuevos resultados estén listos. El Hook [`useDeferredValue`](/reference/react/useDeferredValue) te permite pasar una versión aplazada de la consulta:

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

La consulta `query` se actualizará inmediatamente, por lo que el input mostrará el nuevo valor. Sin embargo, la consulta aplazada `deferredQuery` mostrará el valor anterior hasta que los datos se hayan cargado, por lo que `SearchResults` mostrará los resultados antiguos por un tiempo.

Para que le resulte más claro al usuario, puedes añadir un indicador visual cuando la lista de resultados antigua se esté mostrando:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Escribe `"a"` en el ejemplo de abajo, espera por los resultados, y luego edita el input a `"ab"`. Fíjate cómo en lugar del *fallback* de Suspense, verás ahora de forma ligeramente atenuada la lista de resultados antigua hasta que se carguen los nuevos resultados:


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
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
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
    setTimeout(resolve, 500);
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

<Note>

Tanto los valores aplazados como las [Transiciones](#preventing-already-revealed-content-from-hiding) te permiten evitar *fallbacks* de Suspense y en su lugar usar indicadores en línea. Las Transiciones marcan todas la actualización como no urgente, por lo que se usan típicamente por frameworks y bibliotecas de enrutamiento para la navegación. Los valores aplazados, en cambio, son útiles sobre todo en código de aplicación en el que quieres marcar una parte de la UI como no urgente, traducido como que está permitido que *se quede por detrás* del resto de la UI.

</Note>

---

### Prevenir que el contenido ya revelado se esconda {/*preventing-already-revealed-content-from-hiding*/}

Cuando un componente se suspende, la barrera padre de Suspense más cercana cambia a mostrar el *fallback*. Esto puede conducir a una experiencia de usuario discordante si ya estaba mostrando algún contenido. Presiona el botón en el ejemplo de abajo:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Cuando presionaste el botón, el componente `Router` renderizó `ArtistPage` en lugar de `IndexPage`. Un componente dentro de `ArtistPage` se suspendió, por lo que la barrera de Suspense más cercana comenzó a mostrar un *fallback* La barrera de Suspense más cercana estaba cerca de la raíz, por lo que todo el sitio quedó reemplazado por `BigSpinner`.

Para prevenir que esto pase, puedes marcar la actualización del estado de navegación como una *Transición* con [`startTransition`:](/reference/react/startTransition)

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);      
    });
  }
  // ...
```

Esto le dice a React que la transición de estado no es urgente y que es mejor seguir mostrando la página anterior en lugar de esconder contenido ya revelado. Nota como al hacer clic el botón ahora "espera" a que se carga `Biography`:

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Una Transición no espera por que cargue *todo* el contenido. Espera lo suficiente para evitar esconder contenido ya revelado. Por ejemplo, la maquetación (definida por `Layout`) del sitio ya había sido revelada, por lo que estaría mal esconderla dentro de un indicador de carga. Sin embargo, la barrera de `Suspense` anidada alrededor de `Albums` es nueva, por lo que la Transición no espera por ella.

<Note>

Los enrutadores preparados para Suspense deberían envolver por defecto las actualizaciones de navegación dentro de Transiciones.

</Note>

---

### Indicar que está ocurriendo una Transición {/*indicating-that-a-transition-is-happening*/}

En el ejemplo de arriba, una vez que haces clic al botón, no hay un indicador visual de que hay una navegación en proceso. Para añadir un indicador, puedes reemplazar [`startTransition`](/reference/react/startTransition) con [`useTransition`](/reference/react/useTransition) que te da un valor booleano `isPending` (que indica si la transición está pendiente). En el ejemplo de abajo, se usa para cambiar el estilo del encabezado del sitio mientras ocurre la Transición:

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Agrega un falso retraso para que se note la espera.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Reiniciar las barreras de Suspense al navegar {/*resetting-suspense-boundaries-on-navigation*/}

Durante una Transición, React evitará esconder el contenido que ya ha sido revelado. Sin embargo, si navegas a una ruta con distintos parámetros, querrías decirle a React que es un contenido *diferente*. Puedes expresar esto con una `key`:

```js
<ProfilePage key={queryParams.id} />
```

Imagina que estás navegando dentro de la página del perfil de un usuario, y algo se suspende. Si esa actualización se envuelve en una Transición no activará el *fallback* para el contenido ya visible. Ese es el comportamiento esperado.

Sin embargo, imagina ahora que estás navegando entre dos perfiles de usuario distintos. En ese caso, tiene sentido mostrar el *fallback*. Por ejemplo, la línea de tiempo de un usuario es un *contenido diferente* a la línea de tiempo de otro usuario. Al especificar una `key`, te aseguras de que React trate distintos perfiles de usuario como componentes diferente y reinicie las barreras de Suspense durante la navegación. Un framework de enrutamiento integrado con Suspense debería hacerlo automáticamente.

---

### Proporcionar un _fallback_ para errores de servidor y contenido solo-cliente {/*providing-a-fallback-for-server-errors-and-client-only-content*/}


<<<<<<< HEAD
Si utilizas una de las [APIs de renderizado en el servidor con *streaming*](/reference/react-dom/server) (o un *framework* que depende de ellas), React también utilizará tus barreras de `<Suspense>` para manejar errores en el servidor. Si un componente lanza un error en el servidor, React no abortará el renderizado en el servidor. Lo que hará será encontrar el componente `<Suspense>` más cercano encima de este e incluirá su *fallback* (un *spinner*, por ejemplo) dentro del HTML generado en el  servidor. El usuario verá un *spinner* en lugar de un error.
=======
On the client, React will attempt to render the same component again. If it errors on the client too, React will throw the error and display the closest [Error Boundary.](/reference/react/Component#static-getderivedstatefromerror) However, if it does not error on the client, React will not display the error to the user since the content was eventually displayed successfully.
>>>>>>> 55a317d40781a0054a05a9f6c443ae0bd71f7d7e

En el cliente, React intentará renderizar el mismo componente nuevamente. Si ocurre un error también en el cliente, React lanzará el error y mostrará la [barrera de error](/reference/react/Component#static-getderivedstatefromerror) más cercana. Sin embargo, si no ocurre un error en el cliente, React no le mostrará el error al usuario dado que el contenido eventualmente se le mostró al usuario satisfactoriamente.

Puedes usar esto para evitar que algunos componentes se rendericen en el servidor. Para lograrlo, lanza un error desde ellos en el entorno del servidor y envuélvelos en una barrera de `<Suspense>` para reemplazar su HTML con *fallbacks*:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

El HTML del servidor incluirá el indicador de carga. Este será reemplazado por el componente `Chat` en el cliente.

---

## Solución de problemas {/*troubleshooting*/}

### ¿Cómo puedo evitar que la interfaz de usuario sea sustituida por un *fallback* durante una actualización? {/*preventing-unwanted-fallbacks*/}

Reemplazar la interfaz de usuario visible por una de reserva crea una experiencia de usuario discordante. Esto puede ocurrir cuando una actualización hace que un componente se suspenda, y la barrera de Suspense más cercana ya está mostrando contenido al usuario.

Para evitar que esto ocurra, [marca la actualización como no urgente utilizando `startTransition`](#preventing-already-revealed-content-from-hiding). Durante una Transición, React esperará hasta que se hayan cargado suficientes datos para evitar que aparezca un *fallback* no deseado:

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Esto evitará ocultar el contenido existente. Sin embargo, cualquier barrera `Suspense` recién renderizada seguirá mostrando inmediatamente los *fallbacks* para evitar el bloqueo de la UI y dejar que el usuario vea el contenido a medida que esté disponible.

**React sólo evitará los "fallbacks" no deseados durante las actualizaciones no urgentes**. No retrasará un renderizado si es el resultado de una actualización urgente. Debes indicarlo con una API como [`startTransition`](/reference/react/startTransition) o [`useDeferredValue`](/reference/react/useDeferredValue).

Si tu router está integrado con Suspense, debería envolver sus actualizaciones en [`startTransition`](/reference/react/startTransition) automáticamente.
