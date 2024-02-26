---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` renderiza un árbol de React no interactivo a un [Stream legible de Node.js.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToStaticNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `renderToStaticNodeStream(reactNode, options?)` {/*rendertostaticnodestream*/}

En el servidor, llama a `renderToStaticNodeStream` para obtener un [Stream legible de Node.js](https://nodejs.org/api/stream.html#readable-streams).

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[Ver más ejemplos abajo.](#usage)

El stream producirá, en la salida, HTML no interactivo de tus componentes de React.

#### Parámetros {/*parameters*/}

* `reactNode`: Un nodo de React que quieres renderizar a HTML. Por ejemplo, un elemento JSX como `<Page />`.

* **opcional** `options`: Un objeto de configuración para el renderizado en el servidor.
  * **opcional** `identifierPrefix`: Un prefijo de *string* que React utiliza para los IDs generados por [`useId`.](/reference/react/useId) Es útil para evitar conflictos cuando se utilizan múltiples raíces en la misma página.

#### Devuelve {/*returns*/}

Un [Stream legible de Node.js](https://nodejs.org/api/stream.html#readable-streams) que produce un string HTML como salida. El HTML resultante no puede hidratarse en el cliente.

#### Advertencias {/*caveats*/}

* La salida de `renderToStaticNodeStream` no puede ser hidratada.

* Este método va a esperar que todas las [barreras de Suspense](/reference/react/Suspense) se completen antes de devolver alguna salida.

* A partir de React 18, este método almacena en búfer toda su salida, por lo que no ofrece realmente ningún beneficio de transmisión.

* El stream  devuelto es un flujo de bytes codificado en utf-8. Si necesitas un stream en otra codificación, echa un vistazo a un proyecto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que proporciona streams de transformación para la transcodificación de texto.

---

## Uso {/*usage*/}

### Renderizar un árbol de React como HTML estático a un Stream legible de Node.js {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

Llama a `renderToStaticNodeStream` para obtener un [Stream legible de Node.js](https://nodejs.org/api/stream.html#readable-streams) que puedes canalizar a la respuesta de tu servidor:

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// La sintaxis del manejador de rutas depende del framework de tu backend
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

El stream producirá la salida inicial no interactiva de HTML de tus componentes de React.

<Pitfall>

Este método renderiza **HTML no interactivo que no se puede hidratar.** Esto es útil si quieres utilizar React como un generador de páginas simple, o si estas renderizando  contenido completamente estático como correos electrónicos.

Las aplicaciones interactivas deben usar [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) en el servidor y [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) en el cliente.

</Pitfall>
