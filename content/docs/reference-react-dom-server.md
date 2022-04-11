---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

El objeto `ReactDOMServer` te permite renderizar componentes a un marcado estático. Normalmente, se usa en un servidor de Node:

```js
<<<<<<< HEAD
// módulos ES
import ReactDOMServer from 'react-dom/server';
=======
// ES modules
import * as ReactDOMServer from 'react-dom/server';
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Resumen {#overview}

<<<<<<< HEAD
Los siguientes métodos se pueden utilizar tanto en el servidor como en el entorno del navegador:
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

<<<<<<< HEAD
Estos métodos adicionales dependen de un paquete (`stream`) que **solo está disponible en el servidor**, y no funcionará en el navegador.

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referencia {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Renderiza un elemento React a su HTML inicial. React devolverá HTML en una cadena de texto. Puedes usar este método para generar HTML en el servidor y enviar el marcado en la solicitud inicial para que las páginas se carguen más rápido y permitir que los motores de búsqueda rastreen tus páginas con fines de SEO.

Si llamas [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) a un nodo que ya tiene este marcado desde el servidor, React lo conservará y solo adjuntará los controladores de eventos, lo que te permitirá tener una experiencia de primera carga muy eficaz.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar a [`renderToString`](#rendertostring), excepto que esto no crea atributos DOM adicionales que React usa internamente, como `data-reactroot`. Esto es útil si desea utilizar React como un simple generador de páginas estáticas, ya que eliminar los atributos adicionales puede ahorrar algunos bytes.

Si planeas usar React en el cliente para hacer que el marcado sea interactivo, no use este método. En su lugar, use [`renderToString`](#rendertostring)  en el servidor y [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) en el cliente.

* * *

=======
## Reference {#reference}

>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

<<<<<<< HEAD
Renderiza un elemento React a su HTML inicial. Devuelve una [Secuencia de lectura](https://nodejs.org/api/stream.html#stream_readable_streams) que genera una cadena HTML. La salida HTML de este flujo es exactamente igual a lo que devolvería [`ReactDOMServer.renderToString`](#rendertostring) Puede usar este método para generar HTML en el servidor y enviar el marcado en la solicitud inicial para que las páginas se carguen más rápido y permitir que los motores de búsqueda rastreen sus páginas con fines de SEO.
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

Si llamas [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) en un nodo que ya tiene este marcado de servidor, React lo conservará y solo adjuntará controladores de eventos, lo que te permitirá tener una experiencia de primera carga muy eficaz.

> Nota:
>
> Solo para el servidor. Esta API no está disponible en el navegador.
>
> El flujo devuelto por este método devolverá un flujo de bytes codificado en utf-8. Si necesita un flujo en otra codificación, observa un proyecto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que proporciona flujos de transformación para la transcodificación de texto.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Similar a [`renderToNodeStream`](#rendertonodestream), excepto que esto no crea atributos DOM adicionales que React usa internamente, como `data-reactroot`. Esto es útil si desea utilizar React como un simple generador de páginas estáticas, ya que eliminar los atributos adicionales puede ahorrar algunos bytes.

La salida HTML de este flujo es exactamente igual a lo que [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) devolvería.

Si planeas usar React en el cliente para hacer que el marcado sea interactivo, no use este método. En su lugar, utilice [`renderToNodeStream`](#rendertonodestream) en el servidor y [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) en el cliente.

> Nota:
>
> Solo para el servidor. Esta API no está disponible en el navegador.
>
<<<<<<< HEAD
> El flujo devuelto por este método devolverá un flujo de bytes codificado en utf-8. Si necesita un flujo en otra codificación, observa un proyecto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que proporciona flujos de transformación para la transcodificación de texto.
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
