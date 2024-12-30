---
title: renderToString
---

<Pitfall>

`renderToString` no es compatible con transmisión (*streaming*) o espera de datos. [Ver alternativas.](#alternatives)

</Pitfall>

<Intro>

`renderToString` renderiza un árbol de React como una cadena de HTML.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

En el servidor, llama a `renderToString` para renderizar tu aplicación a HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

En el cliente, llama a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para hacer que el HTML generado por el servidor sea interactivo.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: Un nodo de React que deseas renderizar como HTML. Por ejemplo, un nodo JSX como `<App />`.

* **opcional** `options`: Un objeto de configuración para el renderizado en el servidor.
  * **opcional** `identifierPrefix`: Un prefijo de *string* que React utiliza para los IDs generados por [`useId`.](/reference/react/useId) Es útil para evitar conflictos cuando se utilizan múltiples raíces en la misma página. Debe ser el mismo prefijo que se pasa a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Devuelve {/*returns*/}

Una cadena de caracteres HTML.

#### Advertencias {/*caveats*/}

* `renderToString` tiene un soporte limitado para Suspense. Si un componente suspende, `renderToString` inmediatamente envía su fallback como HTML.

* `renderToString` funciona en el navegador, pero [no se recomienda](#removing-rendertostring-from-the-client-code) usarlo en el código del cliente.

---

## Uso {/*usage*/}

### Renderizar un árbol de React como HTML en una cadena de caracteres {/*rendering-a-react-tree-as-html-to-a-string*/}

Llama a `renderToString` para renderizar tu aplicación como una cadena de caracteres HTML que puedes enviar con la respuesta del servidor:

```js {5-6}
import { renderToString } from 'react-dom/server';

// La sintaxis del manejador de rutas depende de tu framework de backend.
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

Esto producirá la salida HTML inicial no interactiva de tus componentes de React. En el cliente, deberás llamar a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para *hidratar* ese HTML generado por el servidor y hacerlo interactivo.


<Pitfall>

`renderToString` no es compatible con transmisión o espera de datos. [Ver alternativas.](#alternatives)

</Pitfall>

---

## Alternativas {/*alternatives*/}

<<<<<<< HEAD
### Migración de `renderToString` a un método de transmisión en el servidor {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` devuelve una cadena de caracteres de inmediato, por lo que no admite transmisión (*streaming*) o espera de datos.
=======
### Migrating from `renderToString` to a streaming render on the server {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` returns a string immediately, so it does not support streaming content as it loads.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

Cuando sea posible, recomendamos utilizar estas alternativas totalmente funcionales:

* Si utilizas Node.js, utiliza [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* Si utilizas Deno o una versión moderna de runtime con [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), utiliza [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

Puedes continuar utilizando `renderToString` si tu entorno de servidor no admite *streams*.

---

<<<<<<< HEAD
### Eliminar `renderToString` del código del cliente {/*removing-rendertostring-from-the-client-code*/}
=======
### Migrating from `renderToString` to a static prerender on the server {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` returns a string immediately, so it does not support waiting for data to load for static HTML generation.

We recommend using these fully-featured alternatives:

* If you use Node.js, use [`prerenderToNodeStream`.](/reference/react-dom/static/prerenderToNodeStream)
* If you use Deno or a modern edge runtime with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), use [`prerender`.](/reference/react-dom/static/prerender)

You can continue using `renderToString` if your static site generation environment does not support streams.

---

### Removing `renderToString` from the client code {/*removing-rendertostring-from-the-client-code*/}
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

A veces, se usa `renderToString` en el cliente para convertir algún componente en HTML.

```js {1-2}
// 🚩 Innecesario: usar renderToString en el cliente
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // Por ejemplo, "<svg>...</svg>"
```

Importar `react-dom/server` **en el cliente**  aumenta innecesariamente el tamaño de tu paquete y debe evitarse.  Si necesitas renderizar algún componente como HTML en el navegador, utiliza [`createRoot`](/reference/react-dom/client/createRoot) y lee el HTML desde el DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // Por ejemplo, "<svg>...</svg>"
```

La llamada a [`flushSync`](/reference/react-dom/flushSync) es necesaria para que el DOM se actualice antes de leer su propiedad [`innerHTML.`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

---

## Solución de problemas {/*troubleshooting*/}

### Cuando un componente se suspende, el HTML siempre contiene un fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` no es compatible completamente con Suspense.

<<<<<<< HEAD
Si algún componente se suspende (Por ejemplo, porque está definido con [`lazy`](/reference/react/lazy) o busca datos), `renderToString` no esperará a que se resuelva su contenido. En su lugar, `renderToString` encontrará el límite de [`<Suspense>`](/reference/react/Suspense) más cercano por encima y renderizará su prop `fallback` en el HTML. El contenido no aparecerá hasta que se cargue el código del cliente.
=======
If some component suspends (for example, because it's defined with [`lazy`](/reference/react/lazy) or fetches data), `renderToString` will not wait for its content to resolve. Instead, `renderToString` will find the closest [`<Suspense>`](/reference/react/Suspense) boundary above it and render its `fallback` prop in the HTML. The content will not appear until the client code loads.

To solve this, use one of the [recommended streaming solutions.](#alternatives) For server side rendering, they can stream content in chunks as it resolves on the server so that the user sees the page being progressively filled in before the client code loads. For static site generation, they can wait for all the content to resolve before generating the static HTML.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

Para resolver esto, utiliza una de las [soluciones de streaming recomendadas.](#migrating-from-rendertostring-to-a-streaming-method-on-the-server) Pueden transmitir contenido en trozos a medida que se resuelve en el servidor para que el usuario vea cómo se rellena la página progresivamente antes de que se cargue el código del cliente.
