---
title: APIs del servidor de React DOM
---

<Intro>

Las APIs del `react-dom/server` te permiten renderizar del lado del servidor componentes de React a HTML. Estas API solo se usan en el servidor en el nivel superior de su aplicación para generar el HTML inicial. Un [framework](/learn/start-a-new-react-project#full-stack-frameworkss) puede llamarlos por ti. La mayoría de tus componentes no necesitan importarlos o usarlos.

</Intro>

---

## APIs del servidor para transmisiones (streams) de Node.js {/*server-apis-for-nodejs-streams*/}

Estos métodos solo están disponibles en los entornos con [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renderiza un árbol de React a un [Node.js Stream.](https://nodejs.org/api/stream.html)

---

## APIs del servidor para Web Streams {/*server-apis-for-web-streams*/}

Estos métodos solo están disponibles en los entornos con [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), que incluye navegadores, Deno y algunos entornos de ejecución modernos:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) renderiza un árbol de React a un [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## APIs legadas del servidor para entornos sin *streaming* {/*legacy-server-apis-for-non-streaming-environments*/}

Estos métodos se pueden usar en los entornos que no admiten *streams*:

* [`renderToString`](/reference/react-dom/server/renderToString) renderiza un árbol de React a un string.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) renderiza un árbol de React no interactivo a un string.

Tienen funcionalidad limitada en comparación con las APIs de *streaming*.
