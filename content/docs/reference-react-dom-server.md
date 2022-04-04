---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

El objeto `ReactDOMServer` te permite renderizar componentes a un marcado estático. Normalmente, se usa en un servidor de Node:

```js
// módulos ES
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Resumen {#overview}

Los siguientes métodos se pueden utilizar tanto en el servidor como en el entorno del navegador:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

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

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
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
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Renderiza un elemento React a su HTML inicial. Devuelve una [Secuencia de lectura](https://nodejs.org/api/stream.html#stream_readable_streams) que genera una cadena HTML. La salida HTML de este flujo es exactamente igual a lo que devolvería [`ReactDOMServer.renderToString`](#rendertostring) Puede usar este método para generar HTML en el servidor y enviar el marcado en la solicitud inicial para que las páginas se carguen más rápido y permitir que los motores de búsqueda rastreen sus páginas con fines de SEO.

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
> El flujo devuelto por este método devolverá un flujo de bytes codificado en utf-8. Si necesita un flujo en otra codificación, observa un proyecto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que proporciona flujos de transformación para la transcodificación de texto.
