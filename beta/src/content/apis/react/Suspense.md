---
title: Suspense
---

<Intro>

`Suspense` es un componente de React que muestra una interfaz previa o *fallback* hasta que sus hijos hayan terminado de cargar.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Visualización de una interfaz previa mientras algo se está cargando {/*displaying-a-fallback-while-something-is-loading*/}

Puedes envolver cualquier parte de la aplicación con un componente Suspense. Si los datos o el código en  <CodeStep step={2}>su hijo</CodeStep> aún no se ha cargado, React pasará a renderizar la prop <CodeStep step={1}>`fallback`</CodeStep> en su lugar. Por ejemplo:

```js [[1, 3, "<LoadingSpinner />"], [2, 4, "<Comments />"]]
<>
  <Post />
  <Suspense fallback={<LoadingSpinner />}>
    <Comments />
  </Suspense>
</>
```

Supongamos que `Comments` tarda más en cargarse que `Post`. Sin una barrera Suspense, React no podría mostrar ninguno de los dos componentes hasta que ambos se hubieran cargado: `Post` estaría bloqueado por `Comments`.

Debido a la barrera Suspense, `Post` no necesita esperar a `Comments`. React renderiza `LoadingSpinner` en su lugar. Una vez que `Comments` termina de cargar, React reemplaza `LoadingSpinner` con `Comments`.

Suspense nunca mostrará "agujeros" involuntarios en tu contenido. Por ejemplo, si `PhotoAlbums` se ha cargado pero `Notes` no, con la estructura de abajo, seguirá mostrando un `LoadingSpinner` en lugar de todo el `Grid`:

```js {4-7}
<>
  <ProfileHeader />
  <Suspense fallback={<LoadingSpinner />}>
    <Grid>
      <PhotoAlbums />
      <Notes />
    </Grid>
  </Suspense>
</>
```

Para revelar el contenido anidado a medida que se carga, es necesario [añadir más barreras Suspense.](#revealing-nested-content-as-it-loads)

<Pitfall>

**Sólo las fuentes de datos habilitadas para Suspense activarán una barrera Suspense.** Se dice que estas fuentes de datos se *suspenden* cuando los datos necesarios para el renderizado aún no se han cargado. Actualmente, Suspense sólo es compatible con:

- [Componentes de carga diferida (lazy-loading)](#suspense-for-code-splitting)
- Obtención de datos con frameworks como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/), [Next.js](https://nextjs.org/docs/advanced-features/react-18), [Hydrogen](https://hydrogen.shopify.dev/) y [Remix](https://remix.run/)

Aún no se admite la obtención de datos con Suspense sin el uso de un framework que tenga su propia forma de implementarla. Los requisitos para implementar una fuente de datos habilitada para Suspense son inestables y no están documentados. En una futura versión de React se publicará una API oficial para integrar fuentes de datos con Suspense.

Suspense no detecta cuándo los datos se obtienen dentro de un Efecto o un un manejador de eventos.

</Pitfall>

---

### Revelar el contenido anidado mientras se carga {/*revealing-nested-content-as-it-loads*/}

Cuando un componente se suspende, solo se activa el *fallback* de la barrera Suspense padre más cercana. Esto significa que puedes anidar varias barreras Suspense para crear una secuencia de carga. El *fallback* de cada barrera Suspense se rellenará a medida que el siguiente nivel de contenido esté disponible.

Para ilustrarlo, considera el siguiente ejemplo:

```js {1,4}
<Suspense fallback={<BigSpinner />}>
  <MainContent>
    <Post />
    <Suspense fallback={<CommentsGlimmer />}>
      <Comments />
    </Suspense>
  </MainContent>
</Suspense>
```

La secuencia será:

- Si `Post` aún no se ha cargado, `BigSpinner` se muestra en lugar de toda el área de contenido principal.
- Una vez que `Post` termina de cargar, `BigSpinner` es reemplazado por el contenido principal.
- Si aún no se ha cargado `Comments`, se muestra `CommentsGlimmer` en su lugar.
- Finalmente, una vez que `Comments` termina de cargarse, reemplaza a `CommentsGlimmer`. 

---

### Componentes de carga diferida con Suspense {/*lazy-loading-components-with-suspense*/}

La API [`lazy`](/apis/react/lazy) está fuertemente vinculada a Suspense. Cuando se renderiza un componente importado con `lazy`, se suspenderá si no se ha cargado todavía. Esto te permite mostrar un indicador de carga mientras el código de el componente se está cargando.

```js {3,12-15}
import { lazy, Suspense, useState } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  // ...
  return (
    <>
      ...
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview />
        </Suspense>
      )}
    </>
  );
}
```

En este ejemplo, el código de `MarkdownPreview` no se cargará hasta que intentes renderizarlo. Si `MarkdownPreview` no se ha cargado aún, se mostrará `Loading` en su lugar. Prueba a marcar la casilla de verificación:

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Esta demo se carga con un retraso artificial. La próxima vez que desmarques y marques la casilla de verificación, `Preview` se almacenará en la caché, por lo que no se mostrará el estado de carga. Para volver a ver el estado de carga, haz clic en "Reiniciar" en el sandbox.

---

## Referencia {/*reference*/}

### `Suspense` {/*suspense*/}

#### Props {/*suspense-props*/}
* `children`: La interfaz que realmente se pretende renderizar. Si `children` se suspende mientras se renderiza, la barrera Suspense pasará a renderizar `fallback`.
* `fallback`: Una interfaz alternativa a renderizar en lugar de la interfaz real si esta no ha terminado de cargar. Se acepta cualquier nodo React válido, aunque en la práctica, un *fallback* es una vista ligera de relleno, como un *spinner* de carga o un esqueleto. Suspense cambiará automáticamente a `fallback` cuando `children` se suspenda, y volverá a `children` cuando los datos estén listos. Si `fallback` se suspende mientras se renderiza, activará la barrera de Suspense padre más cercana.

### Advertencias {/*caveats*/}

- React no preserva ningún estado para los renderizados que se suspendieron antes de que pudieran montarse por primera vez. Cuando el componente se haya cargado, React volverá a intentar renderizar el árbol suspendido desde cero.
-  Si la suspensión estaba mostrando contenido para el árbol, pero luego se volvió a suspender, el `fallback` se mostrará de nuevo a menos que la actualización que lo causó fuese causada por [`startTransition`](/apis/react/startTransition) o [`useDeferredValue`](/apis/react/useDeferredValue).
- Si React necesita ocultar el contenido ya visible porque se suspendió de nuevo, limpiará [los Efectos de *layout*](/apis/react/useLayoutEffect) en el árbol de contenido. Cuando el contenido esté listo para mostrarse de nuevo, React disparará los Efectos de *layout* de nuevo. Esto le permite asegurarse de que los Efectos que miden el diseño del DOM no intentan hacerlo mientras el contenido está oculto.
- React incluye optimizaciones internas como *Renderizado en el servidor con Streaming* e *Hidratación selectiva* que se integran con Suspense. Puedes leer [una visión general de la arquitectura](https://github.com/reactwg/react-18/discussions/37) y ver [esta charla técnica](https://www.youtube.com/watch?v=pj5N-Khihgc) para conocer más.

---

## Solución de problemas {/*troubleshooting*/}

### ¿Cómo puedo evitar que la interfaz de usuario sea sustituida por un *fallback* durante una actualización? {/*preventing-unwanted-fallbacks*/}

Reemplazar la interfaz de usuario visible por una de reserva crea una experiencia de usuario discordante. Esto puede ocurrir cuando una actualización hace que un componente se suspenda, y la barrera Suspense más cercana ya está mostrando contenido al usuario.

Para evitar que esto ocurra, marca la actualización como no urgente utilizando [`startTransition`](/apis/react/startTransition). Durante una transición, React esperará hasta que se hayan cargado suficientes datos para evitar que aparezca un *fallback* no deseado:

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Esto evitará ocultar el contenido existente. Sin embargo, cualquier barrera `Suspense` recién renderizada seguirá mostrando inmediatamente los *fallbacks* para evitar el bloqueo de la UI y dejar que el usuario vea el contenido a medida que esté disponible.

**React sólo evitará los "fallbacks" no deseados durante las actualizaciones no urgentes**. No retrasará un renderizado si es el resultado de una actualización urgente. Debes indicarlo con una API como [`startTransition`](/apis/react/startTransition) o [`useDeferredValue`](/apis/react/useDeferredValue).

Si tu router está integrado con Suspense, debería envolver sus actualizaciones en [`startTransition`](/apis/react/startTransition) automáticamente.
