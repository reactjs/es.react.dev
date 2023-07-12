---
title: renderToNodeStream
---

<Deprecated>

Esta API se eliminará en una futura versión de React. En su lugar, usa [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

</Deprecated>

<Intro>

`renderToNodeStream` renderiza un árbol de React en un [*Stream* legible de Node.js.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `renderToNodeStream(reactNode)` {/*rendertonodestream*/}

En el servidor, llama a `renderToNodeStream` para obtener un [*Stream* legible de Node.js](https://nodejs.org/api/stream.html#readable-streams) que puedes enviar al flujo de la respuesta.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

En el cliente, llama a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para hacer interactivo el HTML generado por el servidor.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: Un nodo de React que deseas representar en HTML. Por ejemplo, un elemento JSX como `<App />`.

#### Retorna {/*returns*/}

Un [*Stream* legible de Node.js](https://nodejs.org/api/stream.html#readable-streams) que produce una cadena de HTML.

#### Advertencias {/*caveats*/}

* Este método esperará a que todas las [*Suspense boundaries*](/reference/react/Suspense) se completen antes de devolver cualquier resultado.

* A partir de React 18, este método almacena en búfer toda su salida, por lo que no ofrece realmente ningún beneficio de transmisión. Por esta razón, se recomienda que en su lugar migres a [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

* El *stream* devuelto es un flujo de bytes codificado en utf-8. Si necesitas un *stream* en otra codificación, echa un vistazo a un proyecto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que proporciona *streams* de transformación para la transcodificación de texto.

---

## Uso {/*usage*/}

### Renderizar un árbol de React como HTML en un *stream* legible de Node.js {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

Llama a `renderToNodeStream` para obtener un [*Stream* legible de Node.js](https://nodejs.org/api/stream.html#readable-streams) que puedes canalizar a la respuesta de tu servidor:

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// La sintaxis del manejador de rutas depende de tu framework de backend.
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

El *stream* producirá la salida inicial no interactiva de HTML de tus componentes de React. En el cliente, deberás llamar a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para *hidratar* el HTML generado por el servidor y hacerlo interactivo.
