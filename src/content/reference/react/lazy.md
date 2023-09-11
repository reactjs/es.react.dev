---
title: lazy
---

<Intro>

`lazy` te permite diferir la carga del código del componente hasta que se renderice por primera vez.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `lazy(load)` {/*lazy*/}

Llama a `lazy` fuera de tus componentes para declarar un componente de carga diferida:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

<<<<<<< HEAD
- `load`: Una función que devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) o algún otro _thenable_ (un objeto tipo Promise con un método `then`). React no llamará a `load` hasta la primera vez que intentes renderizar el componente devuelto. Después de que React llame por primera vez a `load`, esperará a que se resuelva, y entonces renderizará el valor resuelto como un componente de React. Tanto la promesa devuelta como el valor resuelto de la promesa serán almacenados en caché, por lo que React no llamará a `load` más de una vez. Si la promesa se rechaza, React lanzará la razón de rechazo para dejar que el barrera de error más cercana lo maneje.
=======
* `load`: A function that returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or another *thenable* (a Promise-like object with a `then` method). React will not call `load` until the first time you attempt to render the returned component. After React first calls `load`, it will wait for it to resolve, and then render the resolved value's `.default` as a React component. Both the returned Promise and the Promise's resolved value will be cached, so React will not call `load` more than once. If the Promise rejects, React will `throw` the rejection reason for the nearest Error Boundary to handle.
>>>>>>> 5219d736a7c181a830f7646e616eb97774b43272

#### Devuelve {/*returns*/}

`lazy` devuelve un componente React que puedes renderizar en tu árbol. Mientras el código del componente lazy sigue cargando, el intento de renderizarlo se _suspenderá._ Usa [`<Suspense>`](/reference/react/Suspense) para mostrar un indicador de carga mientras se carga.

---

### Función `load` {/*load*/}

#### Parámetros {/*load-parameters*/}

`load` no recibe parámetros.

#### Devuelve {/*load-returns*/}

<<<<<<< HEAD
Necesitas devolver una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) o algún otro _thenable_ (un objeto tipo Promise con un método `then`). Eventualmente debes resolver un tipo de componente de React válido, como una función, [`memo`](/reference/react/memo), o un componente [`forwardRef`](/reference/react/forwardRef).
=======
You need to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or some other *thenable* (a Promise-like object with a `then` method). It needs to eventually resolve to an object whose `.default` property is a valid React component type, such as a function, [`memo`](/reference/react/memo), or a [`forwardRef`](/reference/react/forwardRef) component.
>>>>>>> 5219d736a7c181a830f7646e616eb97774b43272

---

## Uso {/*usage*/}

### Componentes de carga diferida con Suspense {/*suspense-for-code-splitting*/}

Por lo general, importas componentes con la declaración estática [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import):

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Para diferir la carga del código de este componente hasta que se renderice por primera vez, reemplaza esta importación con:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

<<<<<<< HEAD
Este código se basa en [`import()` dinámico,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) que puede requerir el apoyo del empaquetador o del framework.
=======
This code relies on [dynamic `import()`,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) which might require support from your bundler or framework. Using this pattern requires that the lazy component you're importing was exported as the `default` export.
>>>>>>> 5219d736a7c181a830f7646e616eb97774b43272

Ahora que el código de tu componente se carga bajo demanda, también debes especificar qué debe mostrarse mientras se carga. Puedes hacer esto envolviendo el componente lazy o cualquiera de sus padres en una barrera de [`<Suspense>`](/reference/react/Suspense):

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

En este ejemplo, el código para `MarkdownPreview` no se cargará hasta que intentes renderizarlo. Si `MarkdownPreview` aún no se ha cargado, `Loading` se mostrará en su lugar. Intenta marcar el checkbox:

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('¡Hola, **mundo**!');
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

// Agrega un retardo fijo para que puedas ver el estado de carga
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

Esta demostración se carga con un retraso artificial. La próxima vez que desmarques y marques el checkbox, `Preview` se almacenará en caché, por lo que no se mostrará ningún estado de carga. Para ver nuevamente el estado de carga, haz clic en "Reiniciar" en el sandbox.

[Obtén más información sobre cómo administrar los estados de carga con Suspense.](/reference/react/Suspense)

---

## Solución de problemas {/*troubleshooting*/}

### Mi estado del componente `lazy` se reinicia inesperadamente {/*my-lazy-components-state-gets-reset-unexpectedly*/}

No declarares componentes `lazy` _dentro_ de otros componentes:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Mal: Esto causará que todo el estado se reinicie en los re-renderizados.
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

En cambio, decláralos siempre en el nivel superior de tu módulo:

```js {3-4}
import { lazy } from 'react';

// ✅ Good: Declare lazy components outside of your components
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
