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

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referencia {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Renderiza un elemento React a su HTML inicial. React devolverá HTML en una cadena de texto. Puedes usar este método para generar HTML en el servidor y enviar el marcado en la solicitud inicial para que las páginas se carguen más rápido y permitir que los motores de búsqueda rastreen tus páginas con fines de SEO.

Si llamas [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) a un nodo que ya tiene este marcado desde el servidor, React lo conservará y solo adjuntará los controladores de eventos, lo que te permitirá tener una experiencia de primera carga muy eficaz.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar a [`renderToString`](#rendertostring), excepto que esto no crea atributos DOM adicionales que React usa internamente, como `data-reactroot`. Esto es útil si desea utilizar React como un simple generador de páginas estáticas, ya que eliminar los atributos adicionales puede ahorrar algunos bytes.

Si planeas usar React en el cliente para hacer que el marcado sea interactivo, no use este método. En su lugar, use [`renderToString`](#rendertostring)  en el servidor y [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) en el cliente.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Renderiza un elemento React a su HTML inicial. Devuelve una [Secuencia de lectura](https://nodejs.org/api/stream.html#stream_readable_streams) que genera una cadena HTML. La salida HTML de este flujo es exactamente igual a lo que devolvería [`ReactDOMServer.renderToString`](#rendertostring) Puede usar este método para generar HTML en el servidor y enviar el marcado en la solicitud inicial para que las páginas se carguen más rápido y permitir que los motores de búsqueda rastreen sus páginas con fines de SEO.

Si llamas [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) en un nodo que ya tiene este marcado de servidor, React lo conservará y solo adjuntará controladores de eventos, lo que te permitirá tener una experiencia de primera carga muy eficaz.

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

Si planeas usar React en el cliente para hacer que el marcado sea interactivo, no use este método. En su lugar, utilice [`renderToNodeStream`](#rendertonodestream) en el servidor y [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) en el cliente.

> Nota:
>
> Solo para el servidor. Esta API no está disponible en el navegador.
>
> El flujo devuelto por este método devolverá un flujo de bytes codificado en utf-8. Si necesita un flujo en otra codificación, observa un proyecto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que proporciona flujos de transformación para la transcodificación de texto.
