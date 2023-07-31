---
title: APIs del servidor de React DOM
---

<Intro>

Las APIs del `react-dom/server` te permiten renderizar componentes de React a HTML en el servidor. Estas API solo se usan en el servidor en el nivel superior de su aplicación para generar el HTML inicial. Un [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) puede llamarlos por ti. La mayoría de tus componentes no necesitan importarlos o usarlos.

</Intro>

---

## APIs del servidor para transmisiones (streams) de Node.js {/*server-apis-for-nodejs-streams*/}

Estos métodos solo están disponibles en los entornos con [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renderiza un árbol de React a un [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) renderiza un árbol de React no interactivo a un [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

---

## APIs del servidor para Web Streams {/*server-apis-for-web-streams*/}

Estos métodos solo están disponibles en los entornos con [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), que incluye navegadores, Deno y algunos entornos de ejecución modernos:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) renderiza un árbol de React a un [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## APIs del servidor para entornos sin *streaming* {/*server-apis-for-non-streaming-environments*/}

Estos métodos se pueden usar en los entornos que no admiten *streams*:

* [`renderToString`](/reference/react-dom/server/renderToString) renderiza un árbol de React a un string.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) renderiza un árbol de React no interactivo a un string.

Tienen funcionalidad limitada en comparación con las APIs de *streaming*.

---

## APIs del servidor obsoletas {/*deprecated-server-apis*/}

<Deprecated>

Estas APIs se eliminarán en una versión principal futura de React.

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) renderiza un árbol de React a un [Node.js Readable stream.](https://nodejs.org/api/stream.html#readable-streams) (Obsoleta.)
