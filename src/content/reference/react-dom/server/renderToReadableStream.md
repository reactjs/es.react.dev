  ---
  title: renderToReadableStream
  ---

  <Intro>

  `renderToReadableStream` renderiza un arbol de React a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

  ```js
  const stream = await renderToReadableStream(reactNode, options?)
  ```

  </Intro>

  <InlineToc />

  <Note>

  Esta API depende de [Streams Web.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Para Node.js, usa [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) en su lugar.

  </Note>

  ---

  ## Referencias {/*reference*/}

  ### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

  Llama a la función `renderToReadableStream` para renderizar tu árbol de React como HTML a [Stream de Node.js.](https://nodejs.org/api/stream.html#writable-streams)

  ```js
  import { renderToReadableStream } from 'react-dom/server';

  async function handler(request) {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js']
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  }
  ```

  Desde el cliente, llama a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para hacer interactivo el HTML generado en el servidor.

  [Consulta los ejemplos más abajo.](#usage)

  #### Parámetros {/*parameters*/}

  * `reactNode`: Nodo de React que quieras renderizar a HTML. Por ejemplo, un elemento JSX como `<App />`. Se presupone que representará el documento completo, por lo que el componente `App` debería renderizar la etiqueta `<html>`.

  * **opcional** `options`: Objeto con las opciones de streaming.
    * **opcional** `bootstrapScriptContent`: If specified, this string will be placed in an inline `<script>` tag.
    * **opcional** `bootstrapScripts`: Array de strings que representan las URL para que la etiqueta `<script>` las emita en la página. Utiliza esto para incluír el `<script>` que llama a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Omítelo si no planeas usar React en el cliente.
    * **opcional** `bootstrapModules`: Igual que `bootstrapScripts`, pero emite [`<script type="module">`](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules) en su lugar.
    * **opcional** `identifierPrefix`: Prefijo (string) que React usa para los IDs generados mediante [`useId`.](/reference/react/useId) Útil para evitar conflictos cuando se usan múltiples raíces (roots) en la misma página. Debe ser el mismo prefijo que se le pasa a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
    * **opcional** `namespaceURI`: Un string con la raíz del [namespace URI](https://developer.mozilla.org/es/docs/Web/API/Document/createElementNS#namespace_uris_válidos) para el stream. Por defecto se usa HTML. Usa `'http://www.w3.org/2000/svg'` para SVG o `'http://www.w3.org/1998/Math/MathML'` para MathML.
    * **opcional** `nonce`: Un string [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) que le permita al script la [`script-src` política de contenido seguro (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
    * **opcional** `onError`: Retrollamada que se activa cuando ocurre un error en el servidor, sea [recuperable](#recovering-from-errors-outside-the-shell) o [no.](#recovering-from-errors-inside-the-shell) Por defecto, solo ejecuta `console.error`. Si lo sobreescribes para [registrar errores en el servidor,](#logging-crashes-on-the-server) asegúrate que sigues llamando a `console.error`. También puedes usarlo para [ajustar el código de estado](#setting-the-status-code) antes de que el shell sea emitido.
    * **opcional** `progressiveChunkSize`: El número de bytes en un chunk. [Leer más sobre el heurístico que se usa por defecto.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
    * **opcional** `signal`: Una [señal de aborto](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) que permite [abortar el renderizado en el servidor](#aborting-server-rendering) y el resto del renderizado en el cliente.


  #### Devuelve {/*returns*/}

  `renderToReadableStream` devuelve una promesa:

  - Si el [shell](#specifying-what-goes-into-the-shell) se renderizó satisfactoriamente, la promesa se resolverá a un [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
  - Si el renderizado del shell falla, la promesa será rechazada. [Usa esto para mostrar un shell mediante retrollamada.](#recovering-from-errors-inside-the-shell)

  El stream devuelto tiene una propiedad adicional:

  * `allReady`: Promesa que se resuelve cuando todo el renderizado se ha completado, incluyendo tanto el [shell](#specifying-what-goes-into-the-shell) como todo el [contenido](#streaming-more-content-as-it-loads) adicional. Puedes esperar a `await stream.allReady` antes de devolver una respuesta [para rastreadores y generación estática.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Si usas esto, no obtendrás carga progresiva. El stream contendrá el HTML final.

  ---

  ## Uso {/*usage*/}

  ### Renderizar árbol de React como HTML a Readable Web Stream {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

  Llama `renderToReadableStream` para renderizar tu árbol de React como HTML a [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

  ```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
  import { renderToReadableStream } from 'react-dom/server';

  async function handler(request) {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js']
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  }
  ```

  Junto al <CodeStep step={1}>componente raíz</CodeStep>, necesitas proporcionar una lista de <CodeStep step={2}>rutas de `<script>` de arranque</CodeStep>. Tu componente raíz debería devolver **el documento completo, incluyendo la etiqueta `<html>`.**

  Por ejemplo, debería verse de esta forma:

  ```js [[1, 1, "App"]]
  export default function App() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="/styles.css"></link>
          <title>Mi app</title>
        </head>
        <body>
          <Router />
        </body>
      </html>
    );
  }
  ```

  Rect inyectará el [doctype](https://developer.mozilla.org/es/docs/Glossary/Doctype) y tus <CodeStep step={2}>etiquetas de `<script>` de arranque</CodeStep> dentro del HTML resultante del stream:

  ```html [[2, 5, "/main.js"]]
  <!DOCTYPE html>
  <html>
    <!-- ... HTML de tus componentes ... -->
  </html>
  <script src="/main.js" async=""></script>
  ```

  En el cliente, tu script de arranque debería [hidratar el `document` entero con una llamada a `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

  ```js [[1, 4, "<App />"]]
  import { hydrateRoot } from 'react-dom/client';
  import App from './App.js';

  hydrateRoot(document, <App />);
  ```

  Esto adjuntará detectores de eventos al HTML generado en el servidor, haciendo que este sea interactivo.

  <DeepDive>

  #### Leer recursos CSS y JS mediante su ruta a través del output {/*reading-css-and-js-asset-paths-from-the-build-output*/}

  Las URL finales de los recursos (como los archivos CSS y JS) suelen ser hasheadas después de la compilación. Por ejemplo, en lugar de `estilos.css` podrías tener `estilos.123456.css`. Hashear nombres de archivos estáticos garantiza que cada build distinta del mismo recurso tendrá un nombre de archivo diferente. Esto es útil porque te permite activar de forma segura el almacenamiento en caché a largo plazo para recursos estáticos: un archivo con un nombre característico nunca cambiaría su contenido.

  Sin embargo, si no conoces las URLs de los recursos hasta después de tener la build, no te será posible ponerlas en el código fuente. Por ejemplo, *hardcod*eas `"/styles.css"` en JSX, esto no funcionaría, puesto que es una URL relativa. Para mantenerlas fuera del código fuente, tu componente raíz puede leer el nombre real de un archivo a través de un mapa pasado como propiedad:

  ```js {1,6}
  export default function App({ assetMap }) {
    return (
      <html>
        <head>
          <title>Mi app</title>
          <link rel="stylesheet" href={assetMap['estilos.css']}></link>
        </head>
        ...
      </html>
    );
  }
  ```

  En el servidor, renderiza `<App assetMap={assetMap} />` y pasa tu `assetMap` con las URLs de los recursos:

  ```js {1-5,8,9}
  // Necesitarás obtener este JSON a través de tus herramientas de compilación. Por ejemplo, leyéndolo desde la consola de compilación
  const assetMap = {
    'estilos.css': '/estilos.123456.css',
    'main.js': '/main.123456.js'
  };

  async function handler(request) {
    const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
      bootstrapScripts: [assetMap['/main.js']]
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  }
  ```

  Dado que es el servidor quien está renderizando `<App assetMap={assetMap} />`, necesitarás renderizarlo con `assetMap` en el cliente también para evitar errores de hidratación. Puedes serializar y pasar `assetMap` al cliente de esta forma:

  ```js {9-10}
  // Necesitarás obtener este JSON a través de tus herramientas de compilación.
  const assetMap = {
    'estilos.css': '/estilos.123456.css',
    'main.js': '/main.123456.js'
  };

  async function handler(request) {
    const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
      // Precaución: Es seguro usar stringify() aquí porque esta data no ha sido generada por el usuario.
      bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
      bootstrapScripts: [assetMap['/main.js']],
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  }
  ```

  En el ejemplo de arriba, la opción `bootstrapScriptContent` añade una etiqueta `<script>` extra que establece la variable global `window.assetMap` en el cliente. Esto le permite al código en el cliente leer el mismo `assetMap`:

  ```js {4}
  import { hydrateRoot } from 'react-dom/client';
  import App from './App.js';

  hydrateRoot(document, <App assetMap={window.assetMap} />);
  ```

  Tanto el cliente como el servidor renderizan `App` con la misma propiedad `assetMap`, por lo que no da lugar a errores de hidratación.

  </DeepDive>

  ---

  ### Streamear más contenido mientras carga {/*streaming-more-content-as-it-loads*/}

  Streamear le permite al usuario empezar a ver el contenido incluso antes de que se haya cargado del todo en el servidor. Como ejemplo, usaremos una página de perfil que muestra una cabecera, un menú lateral con amigos e imágenes, y una lista de publicaciones:

  ```js
  function ProfilePage() {
    return (
      <ProfileLayout>
        <ProfileCover />
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Posts />
      </ProfileLayout>
    );
  }
  ```

  Imagina que cargar la información de `<Posts />` toma un tiempo. Lo ideal sería mostrar al usuario el resto del perfil sin tener que esperar a que carguen las publicaciones. Para lograr esto, [envuelve el componente `Posts` dentro de `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

  ```js {9,11}
  function ProfilePage() {
    return (
      <ProfileLayout>
        <ProfileCover />
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </ProfileLayout>
    );
  }
  ```

  Esto le indica a React que comienze a streamear el HTML antes de que `Posts` cargue su información. React enviará primero el HTML del componente de carga (`PostsGlimmer`) y, después, cuando `Posts` termine de cargar su información, React enviará el HTML restante junto a una etiqueta `<script>` que reemplazará el HTML de carga enviado previamente por el nuevo contenido. Desde la perspectiva del usuario, la página aparecerá primero con el contenido de `PostsGlimmer`, y después será reemplazado por el de `Posts`.

  Se pueden [anidar componentes `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) para generar una secuencia de carga más granular:

  ```js {5,13}
  function ProfilePage() {
    return (
      <ProfileLayout>
        <ProfileCover />
        <Suspense fallback={<BigSpinner />}>
          <Sidebar>
            <Friends />
            <Photos />
          </Sidebar>
          <Suspense fallback={<PostsGlimmer />}>
            <Posts />
          </Suspense>
        </Suspense>
      </ProfileLayout>
    );
  }
  ```


  En este ejemplo, React puede empezar a streamear el contenido mucho antes. Solo `ProfileLayout` y `ProfileCover` deben terminar de renderizar primero porque no están envueltos en ningún componente `<Suspense>`. Sin embargo, si `Sidebar`, `Friends`, o `Photos` necesitan cargar información, React enviará el HTML de `BigSpinner` en su lugar. Después, a medida que más información se vuelve disponible, se irá revelando el contenido hasta que toda la página haya cargado.

  Cuando se streamea no es necesario esperar a que React en sí mismo cargue en el navegador o a que tu aplicación se vuelva interactiva. El contenido HTML irá siendo revelado progresivamente antes de que cualquier etiqueta `<script>` cargue.

  [Lee más sobre cómo funciona el streaming de HTML.](https://github.com/reactwg/react-18/discussions/37)

  <Note>

  **Only Suspense-enabled data sources will activate the Suspense component.** They include:

  - Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/advanced-features/react-18)
  - Lazy-loading component code with [`lazy`](/reference/react/lazy)

  Suspense **does not** detect when data is fetched inside an Effect or event handler.

  The exact way you would load data in the `Posts` component above depends on your framework. If you use a Suspense-enabled framework, you'll find the details in its data fetching documentation.

  Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React. 

  </Note>

  ---

  ### Specifying what goes into the shell {/*specifying-what-goes-into-the-shell*/}

  The part of your app outside of any `<Suspense>` boundaries is called *the shell:*

  ```js {3-5,13,14}
  function ProfilePage() {
    return (
      <ProfileLayout>
        <ProfileCover />
        <Suspense fallback={<BigSpinner />}>
          <Sidebar>
            <Friends />
            <Photos />
          </Sidebar>
          <Suspense fallback={<PostsGlimmer />}>
            <Posts />
          </Suspense>
        </Suspense>
      </ProfileLayout>
    );
  }
  ```

  It determines the earliest loading state that the user may see:

  ```js {3-5,13
  <ProfileLayout>
    <ProfileCover />
    <BigSpinner />
  </ProfileLayout>
  ```

  If you wrap the whole app into a `<Suspense>` boundary at the root, the shell will only contain that spinner. However, that's not a pleasant user experience because seeing a big spinner on the screen can feel slower and more annoying than waiting a bit more and seeing the real layout. This is why usually you'll want to place the `<Suspense>` boundaries so that the shell feels *minimal but complete*--like a skeleton of the entire page layout.

  The async call to `renderToReadableStream` will resolve to a `stream` as soon as the entire shell has been rendered. Usually, you'll start streaming then by creating and returning a response with that `stream`:

  ```js {5}
  async function handler(request) {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js']
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  }
  ```

  By the time the `stream` is returned, components in nested `<Suspense>` boundaries might still be loading data.

  ---

  ### Logging crashes on the server {/*logging-crashes-on-the-server*/}

  By default, all errors on the server are logged to console. You can override this behavior to log crash reports:

  ```js {4-7}
  async function handler(request) {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  }
  ```

  If you provide a custom `onError` implementation, don't forget to also log errors to the console like above.

  ---

  ### Recovering from errors inside the shell {/*recovering-from-errors-inside-the-shell*/}

  In this example, the shell contains `ProfileLayout`, `ProfileCover`, and `PostsGlimmer`:

  ```js {3-5,7-8}
  function ProfilePage() {
    return (
      <ProfileLayout>
        <ProfileCover />
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </ProfileLayout>
    );
  }
  ```

  If an error occurs while rendering those components, React won't have any meaningful HTML to send to the client. Wrap your `renderToReadableStream` call in a `try...catch` to send a fallback HTML that doesn't rely on server rendering as the last resort:

  ```js {2,13-18}
  async function handler(request) {
    try {
      const stream = await renderToReadableStream(<App />, {
        bootstrapScripts: ['/main.js'],
        onError(error) {
          console.error(error);
          logServerCrashReport(error);
        }
      });
      return new Response(stream, {
        headers: { 'content-type': 'text/html' },
      });
    } catch (error) {
      return new Response('<h1>Something went wrong</h1>', {
        status: 500,
        headers: { 'content-type': 'text/html' },
      });
    }
  }
  ```

  If there is an error while generating the shell, both `onError` and your `catch` block will fire. Use `onError` for error reporting and use the `catch` block to send the fallback HTML document. Your fallback HTML does not have to be an error page. Instead, you may include an alternative shell that renders your app on the client only.

  ---

  ### Recovering from errors outside the shell {/*recovering-from-errors-outside-the-shell*/}

  In this example, the `<Posts />` component is wrapped in `<Suspense>` so it is *not* a part of the shell:

  ```js {6}
  function ProfilePage() {
    return (
      <ProfileLayout>
        <ProfileCover />
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </ProfileLayout>
    );
  }
  ```

  If an error happens in the `Posts` component or somewhere inside it, React will [try to recover from it:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)

  1. It will emit the loading fallback for the closest `<Suspense>` boundary (`PostsGlimmer`) into the HTML.
  2. It will "give up" on trying to render the `Posts` content on the server anymore.
  3. When the JavaScript code loads on the client, React will *retry* rendering `Posts` on the client.

  If retrying rendering `Posts` on the client *also* fails, React will throw the error on the client. As with all the errors thrown during rendering, the [closest parent error boundary](/reference/react/Component#static-getderivedstatefromerror) determines how to present the error to the user. In practice, this means that the user will see a loading indicator until it is certain that the error is not recoverable.

  If retrying rendering `Posts` on the client succeeds, the loading fallback from the server will be replaced with the client rendering output. The user will not know that there was a server error. However, the server `onError` callback and the client [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) callbacks will fire so that you can get notified about the error.

  ---

  ### Setting the status code {/*setting-the-status-code*/}

  Streaming introduces a tradeoff. You want to start streaming the page as early as possible so that the user can see the content sooner. However, once you start streaming, you can no longer set the response status code.

  By [dividing your app](#specifying-what-goes-into-the-shell) into the shell (above all `<Suspense>` boundaries) and the rest of the content, you've already solved a part of this problem. If the shell errors, your `catch` block will run which lets you set the error status code. Otherwise, you know that the app may recover on the client, so you can send "OK".

  ```js {11}
  async function handler(request) {
    try {
      const stream = await renderToReadableStream(<App />, {
        bootstrapScripts: ['/main.js'],
        onError(error) {
          console.error(error);
          logServerCrashReport(error);
        }
      });
      return new Response(stream, {
        status: 200,
        headers: { 'content-type': 'text/html' },
      });
    } catch (error) {
      return new Response('<h1>Something went wrong</h1>', {
        status: 500,
        headers: { 'content-type': 'text/html' },
      });
    }
  }
  ```

  If a component *outside* the shell (i.e. inside a `<Suspense>` boundary) throws an error, React will not stop rendering. This means that the `onError` callback will fire, but your code will continue running without getting into the `catch` block. This is because React will try to recover from that error on the client, [as described above.](#recovering-from-errors-outside-the-shell)

  However, if you'd like, you can use the fact that something has errored to set the status code:

  ```js {3,7,13}
  async function handler(request) {
    try {
      let didError = false;
      const stream = await renderToReadableStream(<App />, {
        bootstrapScripts: ['/main.js'],
        onError(error) {
          didError = true;
          console.error(error);
          logServerCrashReport(error);
        }
      });
      return new Response(stream, {
        status: didError ? 500 : 200,
        headers: { 'content-type': 'text/html' },
      });
    } catch (error) {
      return new Response('<h1>Something went wrong</h1>', {
        status: 500,
        headers: { 'content-type': 'text/html' },
      });
    }
  }
  ```

  This will only catch errors outside the shell that happened while generating the initial shell content, so it's not exhaustive. If knowing whether an error occurred for some content is critical, you can move it up into the shell.

  ---

  ### Handling different errors in different ways {/*handling-different-errors-in-different-ways*/}

  You can [create your own `Error` subclasses](https://javascript.info/custom-errors) and use the [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operator to check which error is thrown. For example, you can define a custom `NotFoundError` and throw it from your component. Then you can save the error in `onError` and do something different before returning the response depending on the error type:

  ```js {2-3,5-15,22,28,33}
  async function handler(request) {
    let didError = false;
    let caughtError = null;

    function getStatusCode() {
      if (didError) {
        if (caughtError instanceof NotFoundError) {
          return 404;
        } else {
          return 500;
        }
      } else {
        return 200;
      }
    }

    try {
      const stream = await renderToReadableStream(<App />, {
        bootstrapScripts: ['/main.js'],
        onError(error) {
          didError = true;
          caughtError = error;
          console.error(error);
          logServerCrashReport(error);
        }
      });
      return new Response(stream, {
        status: getStatusCode(),
        headers: { 'content-type': 'text/html' },
      });
    } catch (error) {
      return new Response('<h1>Something went wrong</h1>', {
        status: getStatusCode(),
        headers: { 'content-type': 'text/html' },
      });
    }
  }
  ```

  Keep in mind that once you emit the shell and start streaming, you can't change the status code.

  ---

  ### Waiting for all content to load for crawlers and static generation {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

  Streaming offers a better user experience because the user can see the content as it becomes available.

  However, when a crawler visits your page, or if you're generating the pages at the build time, you might want to let all of the content load first and then produce the final HTML output instead of revealing it progressively.

  You can wait for all the content to load by awaiting the `stream.allReady` Promise:

  ```js {12-15}
  async function handler(request) {
    try {
      let didError = false;
      const stream = await renderToReadableStream(<App />, {
        bootstrapScripts: ['/main.js'],
        onError(error) {
          didError = true;
          console.error(error);
          logServerCrashReport(error);
        }
      });
      let isCrawler = // ... depends on your bot detection strategy ...
      if (isCrawler) {
        await stream.allReady;
      }
      return new Response(stream, {
        status: didError ? 500 : 200,
        headers: { 'content-type': 'text/html' },
      });
    } catch (error) {
      return new Response('<h1>Something went wrong</h1>', {
        status: 500,
        headers: { 'content-type': 'text/html' },
      });
    }
  }
  ```

  A regular visitor will get a stream of progressively loaded content. A crawler will receive the final HTML output after all the data loads. However, this also means that the crawler will have to wait for *all* data, some of which might be slow to load or error. Depending on your app, you could choose to send the shell to the crawlers too.

  ---

  ### Aborting server rendering {/*aborting-server-rendering*/}

  You can force the server rendering to "give up" after a timeout:

  ```js {3,4-6,9}
  async function handler(request) {
    try {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 10000);

      const stream = await renderToReadableStream(<App />, {
        signal: controller.signal,
        bootstrapScripts: ['/main.js'],
        onError(error) {
          didError = true;
          console.error(error);
          logServerCrashReport(error);
        }
      });
      // ...
  ```

  React will flush the remaining loading fallbacks as HTML, and will attempt to render the rest on the client.
