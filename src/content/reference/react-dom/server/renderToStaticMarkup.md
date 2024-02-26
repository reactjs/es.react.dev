---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` renderiza un árbol React no interactivo a un _string_ de HTML.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

En el servidor, llama a `renderToStaticMarkup` para renderizar tu aplicación a HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

Esto producirá una salida de HTML no interactiva de tus componentes de React.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: Un nodo React que deseas renderizar a HTML. Por ejemplo, un nodo JSX como `<Page />`.
* **opcional** `options`: Un objeto de configuración para el renderizado en el servidor.
  * **opcional** `identifierPrefix`: Un prefijo de *string* que React utiliza para los IDs generados por [`useId`.](/reference/react/useId) Es útil para evitar conflictos cuando se utilizan múltiples raíces en la misma página.

#### Devuelve {/*returns*/}

Un _string_ de HTML.

#### Advertencias {/*caveats*/}

* La salida de `renderToStaticMarkup` no puede ser hidratada.

* `renderToStaticMarkup` tiene un soporte limitado para _Suspense_. Si un componente se suspende, `renderToStaticMarkup` inmediatamente envía su _fallback_ como HTML.

* `renderToStaticMarkup` funciona en el navegador, pero usarlo en el código del cliente no es recomendable. Si necesitas renderizar un componente a HTML en el navegador, [obtén el HTML renderizándolo en un nodo DOM.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Uso {/*usage*/}

### Renderizar un árbol React no interactivo como HTML en un _string_ {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Llama a `renderToStaticMarkup` para renderizar tu aplicación a un _string_ de HTML que puedas enviar con la respuesta del servidor:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// La sintaxis del manejador de rutas depende de tu framework de backend
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Esto producirá la salida inicial de HTML no interactiva de tus componentes de React.

<Pitfall>

Este método renderiza **HTML no interactivo que no puede ser hidratado.** Esto es útil si deseas usar React como un generador de páginas estáticas simple, o si estás renderizando contenido completamente estático, como correos electrónicos.

Las aplicaciones interactivas deben usar [`renderToString`](/reference/react-dom/server/renderToString) en el servidor y [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) en el cliente.

</Pitfall>
