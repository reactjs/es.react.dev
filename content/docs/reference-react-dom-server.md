---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

<div class="scary">

> Estos documentos son antiguos y no se actualizarán. Vaya a [react.dev](https://react.dev/) para ver los nuevos documentos de React.
>
> Estas nuevas páginas de documentación enseñan React moderno:
>
> - [`react-dom`: API del servidor](https://react.dev/reference/react-dom/server)

</div>

El objeto `ReactDOMServer` te permite renderizar componentes a un marcado estático. Normalmente, se usa en un servidor de Node:

```js
// módulos ES
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Resumen {#overview}

Estos métodos solo están disponibles en los **entornos con [Streams de Node.js](https://nodejs.org/api/stream.html):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

Estos métodos solo están disponibles en los **entornos con [Streams Web](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (esto incluye navegadores, Deno y algunos *runtimes* modernos de *edge computing*):

- [`renderToReadableStream()`](#rendertoreadablestream)

Los siguientes métodos se pueden utilizar en entornos que no tienen disponibles *streams*:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

## Referencia {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

<div class="scary">

> Este contenido está desactualizado.
>
> Lea la nueva documentación de React para [`renderToPipeableStream`](https://beta.es.reactjs.org/reference/react-dom/server/renderToPipeableStream).

</div>

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Renderiza un elemento React a su HTML inicial. Devuelve un *stream* (flujo) con un método `pipe(res)` que conduce la salida y `abort()` para abortar la petición. Es completamente compatible con Suspense y con la realización de *streaming* de HTML con bloques de contenido «demorados» que luego «aparecen» usando etiquetas `<script>`. [Lee más en](https://github.com/reactwg/react-18/discussions/37).

Si llamas [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) en un nodo que ya tiene este marcado de servidor, React lo conservará y solo adjuntará controladores de eventos, lo que te permitirá tener una experiencia de primera carga muy eficaz.

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

Mira la [lista completa de opciones](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Nota:
>
> Esta es una API específica de Node.js. Los entornos con [Streams Web](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), como Deno y *runtimes* modernos de *edge computing*, deberían usar en su lugar [`renderToReadableStream`](#rendertoreadablestream).
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

<div class="scary">

> Este contenido está desactualizado.
>
> Lea la nueva documentación de React para [`renderToReadableStream`](https://beta.es.reactjs.org/reference/react-dom/server/renderToReadableStream).

</div>

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

<div class="scary">

> Este contenido está desactualizado.
>
> Lea la nueva documentación de React para [`renderToNodeStream`](https://beta.es.reactjs.org/reference/react-dom/server/renderToNodeStream).

</div>

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Renderiza un elemento React a su HTML inicial. Devuelve un [Readable stream de Node.js](https://nodejs.org/api/stream.html#stream_readable_streams) que genera una cadena HTML. La salida HTML de este flujo es exactamente igual a lo que devolvería [`ReactDOMServer.renderToString`](#rendertostring) Puede usar este método para generar HTML en el servidor y enviar el marcado en la solicitud inicial para que las páginas se carguen más rápido y permitir que los motores de búsqueda rastreen sus páginas con fines de SEO.

Si llamas [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) en un nodo que ya tiene este marcado de servidor, React lo conservará y solo adjuntará controladores de eventos, lo que te permitirá tener una experiencia de primera carga muy eficaz.

> Nota:
>
> Solo para el servidor. Esta API no está disponible en el navegador.
>
> El flujo devuelto por este método devolverá un flujo de bytes codificado en utf-8. Si necesita un flujo en otra codificación, observa un proyecto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que proporciona flujos de transformación para la transcodificación de texto.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

<div class="scary">

> Este contenido está desactualizado.
>
> Lea la nueva documentación de React para [`renderToStaticNodeStream`](https://beta.es.reactjs.org/reference/react-dom/server/renderToStaticNodeStream).

</div>

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
> El flujo devuelto por este método devolverá un flujo de bytes codificado en utf-8. Si necesita un flujo en otra codificación, chequea un proyecto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que proporciona flujos de transformación para la transcodificación de texto.

* * *

### `renderToString()` {#rendertostring}

<div class="scary">

> Este contenido está desactualizado.
>
> Lea la nueva documentación de React para [`renderToString`](https://beta.es.reactjs.org/reference/react-dom/server/renderToString).

</div>

```javascript
ReactDOMServer.renderToString(element)
```

Renderiza un elemento React a su HTML inicial. React devolverá HTML en una cadena de texto. Puedes usar este método para generar HTML en el servidor y enviar el marcado en la solicitud inicial para que las páginas se carguen más rápido y permitir que los motores de búsqueda rastreen tus páginas con fines de SEO.

Si llamas [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) a un nodo que ya tiene este marcado desde el servidor, React lo conservará y solo adjuntará los controladores de eventos, lo que te permitirá tener una experiencia de primera carga muy eficaz.

> Nota
>
> Esta API tiene compatibilidad limitada con Suspense y no permite realizar *streaming*.
>
> En el servidor, se recomienda usar en cambio, o bien [`renderToPipeableStream`](#rendertopipeablestream) (para Node.js) o [`renderToReadableStream`](#rendertoreadablestream) (para Streams Web).

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

<div class="scary">

> Este contenido está desactualizado.
>
> Lea la nueva documentación de React para [`renderToStaticMarkup`](https://beta.es.reactjs.org/reference/react-dom/server/renderToStaticMarkup).

</div>

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar a [`renderToString`](#rendertostring), excepto que esto no crea atributos DOM adicionales que React usa internamente, como `data-reactroot`. Esto es útil si desea utilizar React como un simple generador de páginas estáticas, ya que eliminar los atributos adicionales puede ahorrar algunos bytes.

Si planeas usar React en el cliente para hacer que el marcado sea interactivo, no uses este método. En su lugar, usa [`renderToString`](#rendertostring) en el servidor y [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) en el cliente.
