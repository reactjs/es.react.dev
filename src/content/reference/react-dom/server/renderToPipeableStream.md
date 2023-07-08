---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` renderiza un árbol de React en un [*Stream* de Node.js](https://nodejs.org/api/stream.html) que se puede canalizar.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Esta API es específica para Node.js. Si estás trabajando en entornos con [Web *Streams*,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) como Deno y *edge runtimes* modernos, utiliza [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) en su lugar.

</Note>

---

## Referencia {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

Llama a `renderToPipeableStream` para renderizar tu árbol de React como HTML en un [*Stream* de Node.js.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

En el cliente, llama a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para hacer interactivo el HTML generado por el servidor.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: Un nodo de React que quieres renderizar como HTML. Por ejemplo, un elemento JSX como `<App />`. Se espera que represente todo el documento, por lo que el componente `App` debería renderizar la etiqueta `<html>`.

* **opcional** `options`: Un objeto con opciones de *streaming*.
  * **opcional** `bootstrapScriptContent`: Si lo especificas, este *string* se colocará en una etiqueta `<script>` en línea.
  * **opcional** `bootstrapScripts`: Un *array* de *strings* con URLs para las etiquetas `<script>` que quieres emitir en la página. Úsalo para incluir el `<script>` que llama a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Si no deseas ejecutar React en el cliente, simplemente omítelo.
  * **opcional** `bootstrapModules`: Igual que `bootstrapScripts`, pero emite [`<script type="module">`](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules) en su lugar.
  * **opcional** `identifierPrefix`: Un *string* que indica el prefijo que React usa para los IDs generados por [`useId`.](/reference/react/useId) Es útil para evitar conflictos cuando usas múltiples raíces en la misma página. Debe ser el mismo prefijo que se pasa a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **opcional** `namespaceURI`: Un *string* con la raíz del [namespace URI](https://developer.mozilla.org/es/docs/Web/API/Document/createElementNS#namespace_uris_v%C3%A1lidos) para el *stream*. El valor predeterminado es HTML estándar. Pasa `'http://www.w3.org/2000/svg'` para SVG o `'http://www.w3.org/1998/Math/MathML'` para MathML.
  * **opcional** `nonce`: Un *string* de [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) para permitir *scripts* de [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **opcional** `onAllReady`: Un *callback* que se ejecuta cuando todo el renderizado está completo, incluyendo tanto el [*shell*](#specifying-what-goes-into-the-shell) como todo el [contenido adicional.](#streaming-more-content-as-it-loads) Puedes usarlo en lugar de `onShellReady` para [rastreadores y generación estática.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Si comienzas el *streaming* aquí, no obtendrás ninguna carga progresiva. El *stream* contendrá el HTML final.
  * **opcional** `onError`: Un *callback* que se ejecuta cada vez que hay un error del servidor, ya sea [recuperable](#recovering-from-errors-outside-the-shell) o [no.](#recovering-from-errors-inside-the-shell) Por defecto, esto sólo llama a `console.error`. Si lo reemplazas para [registrar informes de errores,](#logging-crashes-on-the-server) asegúrate de seguir llamando a `console.error`. También puedes usarlo para [ajustar el código de estado](#setting-the-status-code) antes de que se emita el *shell*.
  * **opcional** `onShellReady`: Un *callback* que se ejecuta justo después de que se haya renderizado el [*shell*](#specifying-what-goes-into-the-shell) inicial. Aquí puedes [establecer el código de estado](#setting-the-status-code) y llamar a `pipe` para iniciar el *streaming*. React comenzará el [*streaming* de contenido adicional](#streaming-more-content-as-it-loads) después del *shell* junto con las etiquetas de `<script>` en línea que sustituyan los *fallbacks* de carga HTML por el contenido.
  * **opcional** `onShellError`: Un *callback* que se ejecutará si hay un error al renderizar el *shell* inicial, recibiendo el error como argumento. Si esto ocurre, no se habrá emitido ningún *byte* desde el *stream*, y no se llamará ni a `onShellReady` ni a `onAllReady`, por lo que puedes [generar un *shell* HTML de respaldo.](#recovering-from-errors-inside-the-shell)
  * **opcional** `progressiveChunkSize`: Define el número de *bytes* en un *chunk*. [Lee más acerca de la heurística predeterminada.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### Retorna {/*returns*/}

`renderToPipeableStream` retorna un objeto con dos métodos:

* `pipe` envía el HTML al [*stream* escribible de Node.js.](https://nodejs.org/api/stream.html#writable-streams) Llama a `pipe` en `onShellReady` si quieres habilitar el *streaming*, o en `onAllReady` para rastreadores y generación estática.
* `abort` te permite [abortar el renderizado del servidor](#aborting-server-rendering) y renderizar el resto en el cliente.

---

## Uso {/*usage*/}

### Renderizar un árbol de React como HTML en un *stream* de Node.js {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Llama a `renderToPipeableStream` para renderizar tu árbol de React como HTML en un [*stream* de Node.js:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// La sintaxis del controlador de rutas depende de tu framework de backend
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Debes proporcionar el <CodeStep step={1}>componente raíz</CodeStep> y una lista de <CodeStep step={2}>rutas de `<script>` de arranque</CodeStep>. Tu componente raíz debe retornar **el documento completo, incluyendo la etiqueta `<html>` raíz.**

Por ejemplo, tu componente raíz podría verse así:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Mi aplicación</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React inyectará el [doctype](https://developer.mozilla.org/es/docs/Glossary/Doctype) y las <CodeStep step={2}>etiquetas de `<script>` de arranque</CodeStep> en el *stream* HTML resultante:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML de tus componentes ... -->
</html>
<script src="/main.js" async=""></script>
```

En el cliente, tu script de arranque debe [hidratar todo el `document` con una llamada a `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Esto adjuntará escuchadores de eventos al HTML generado por el servidor y lo hará interactivo.

<DeepDive>

#### Lectura de rutas de recursos CSS y JS desde la salida de compilación {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Las URLs finales de los recursos (como archivos JavaScript y CSS) a menudo se cifran después de la compilación. Por ejemplo, en lugar de `styles.css`, podrías terminar con `styles.123456.css`. El cifrado de los nombres de archivo de recursos estáticos garantiza que cada compilación distinta del mismo recurso tendrá un nombre de archivo diferente. Esto es útil porque te permite habilitar de manera segura el almacenamiento en caché a largo plazo para los recursos estáticos: un archivo con un nombre determinado nunca cambiará de contenido.

Sin embargo, si no conoces las URLs de los recursos hasta después de la compilación, no hay forma de colocarlas en el código fuente. Por ejemplo, escribir `"/styles.css"` en JSX como se hizo antes no funcionaría. Para evitar incluirlos en el código fuente, tu componente raíz puede leer los nombres de archivo reales de un mapa pasado como una prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

En el servidor, renderiza `<App assetMap={assetMap} />` y pasa tu `assetMap` con las URLs de los recursos:

```js {1-5,8,9}
// Deberás obtener este JSON desde tus herramientas de compilación, por ejemplo, leyéndolo desde la salida de compilación.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Ahora que tu servidor está renderizando `<App assetMap={assetMap} />`, debes renderizarlo también con `assetMap` en el cliente para evitar errores de hidratación. Puedes serializar y pasar `assetMap` al cliente de esta manera:

```js {9-10}
// Deberás obtener este JSON desde tus herramientas de compilación.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Ten cuidado: es seguro stringify() ya que estos datos no son generados por el usuario.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

En el ejemplo anterior, la opción `bootstrapScriptContent` agrega una etiqueta `<script>` adicional en línea que establece la variable global `window.assetMap` en el cliente. Esto permite que el código del cliente lea el mismo `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Tanto el cliente como el servidor renderizan `App` con la misma prop `assetMap`, por lo que no hay errores de hidratación.

</DeepDive>

---

### *Streaming* de más contenidos a medida que se cargan {/*streaming-more-content-as-it-loads*/}

El *streaming* permite al usuario visualizar el contenido incluso antes de que todos los datos se hayan cargado en el servidor. Por ejemplo, imagina una página de perfil que muestra una portada, una barra lateral con amigos y fotos, y una lista de posts:

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

Si la carga de datos para `<Posts />` tarda algún tiempo, es ideal mostrar el resto del contenido de la página de perfil al usuario sin esperar a los posts. Para ello, [envuelve `Posts` en una barrera de `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

Esto le indica a React que comience a hacer *streaming* del HTML antes de que se carguen los datos de `Posts`. React enviará primero el HTML para la carga del *fallback* (`PostsGlimmer`), y luego, cuando `Posts` termine de cargar sus datos, React enviará el HTML restante junto con una etiqueta `<script>` en línea que reemplaza el *fallback* por ese HTML. Desde la perspectiva del usuario, la página aparecerá primero con el `PostsGlimmer`, que luego será reemplazado por `Posts`.

También puedes [anidar barreras de `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) para crear una secuencia de carga más granular:

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

En este ejemplo, React puede empezar a hacer *streaming* de la página incluso antes. Sólo necesitas esperar a que `ProfileLayout` y `ProfileCover` finalicen su renderizado, ya que no están envueltos en ninguna barrera de `<Suspense>`. No obstante, si `Sidebar`, `Friends`, o `Photos` necesitan cargar algunos datos, React enviará el HTML para el *fallback* `BigSpinner` en su lugar. Entonces, conforme más datos estén disponibles, más contenido se revelará hasta que todo sea visible.

El *streaming* no necesita esperar a que React se cargue en el navegador o a que tu aplicación se vuelva interactiva. El contenido HTML del servidor se mostrará gradualmente antes de que se carguen cualquiera de las etiquetas `<script>`.

[Lee más sobre cómo funciona el *streaming* HTML](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Sólo se activará el componente Suspense con fuentes de datos habilitadas para Suspense.** Estas incluyen:

- Obtención de datos con *frameworks* habilitados para Suspense, como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) y [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Carga diferida de código de componentes con [`lazy`](/reference/react/lazy)

Suspense **no** detectará cuando se obtengan datos dentro de un Efecto o manejador de eventos.

La forma exacta de cargar los datos en el componente `Posts` anterior dependerá de tu *framework*. Si usas un *framework* habilitado para Suspense, encontrarás los detalles en su documentación de obtención de datos.

Por ahora, no se admite la obtención de datos habilitada para Suspense sin el uso de un *framework* con enfoque específico. Los requisitos para implementar una fuente de datos habilitada para Suspense son inestables y no están documentados. En una versión futura de React, se publicará una API oficial para integrar fuentes de datos con Suspense.

</Note>

---

### Especificar lo que va dentro del *shell* {/*specifying-what-goes-into-the-shell*/}

La parte de tu aplicación fuera de cualquier barrera de `<Suspense>` se le llama *shell:*

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

Determina el estado de carga más temprano que el usuario puede ver:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Si envuelves toda la aplicación en una barrera de `<Suspense>` en la raíz, el *shell* sólo contendrá ese *spinner*. Pero esta experiencia de usuario no es agradable, porque ver un gran *spinner* en la pantalla puede resultar más lento y molesto que esperar un poco más y ver el diseño real. Por esta razón, normalmente querrás colocar las barreras de `<Suspense>` de manera que el *shell* se sienta  *minimalista pero completo*--como un esqueleto de todo el diseño de la página.

El *callback* `onShellReady` se ejecuta cuando se ha renderizado todo el *shell*. Es entonces cuando suele comenzar el *streaming*:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Cuando se ejecuta `onShellReady`, es posible que los componentes dentro de las barreras de `<Suspense>` anidadas aún estén cargando datos.

---

### Registrar errores en el servidor {/*logging-crashes-on-the-server*/}

Por defecto, todos los errores en el servidor se registran en la consola. Puedes cambiar este comportamiento para registrar informes de errores:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Si proporcionas tu propia implementación de `onError`, asegúrate de registrar también los errores en la consola como se muestra arriba.

---

### Recuperar errores dentro del *shell* {/*recovering-from-errors-inside-the-shell*/}

En este ejemplo, el *shell* contiene `ProfileLayout`, `ProfileCover`, y `PostsGlimmer`:

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

Si se produce un error durante el renderizado de estos componentes, React no tendrá ningún HTML relevante para enviar al cliente. Puedes personalizar `onShellError` para enviar un HTML de respaldo que no dependa del renderizado del servidor como último recurso:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Algo salió mal</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Si hay un error al generar el *shell*, tanto `onError` como `onShellError` se ejecutarán. Usa `onError` para informar errores y usa `onShellError` para enviar el documento HTML de respaldo. Tu HTML de respaldo no tiene que ser una página de error. En cambio, puedes incluir un *shell* alternativo que renderice tu aplicación sólo en el cliente.

---

### Recuperar errores fuera del *shell* {/*recovering-from-errors-outside-the-shell*/}

En este ejemplo, el componente `<Posts />` está envuelto en un `<Suspense>` y *no* forma parte del *shell:*

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

Si se produce un error en el componente `Posts` o en cualquier lugar dentro de él, React va a [intentar recuperarse de la siguiente manera:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)

1. Emitirá el *fallback* de carga para la barrera de `<Suspense>` más cercana (`PostsGlimmer`) en el HTML.
2. "Abandonará" el intento de renderizar el contenido `Posts` en el servidor.
3. Cuando el código JavaScript se cargue en el cliente, React *reintentará* renderizar `Posts` en el cliente.

Si el reintento de renderizar `Posts` en el cliente *también* falla, React lanzará el error en el cliente. Como con todos los errores lanzados durante el renderizado, la [barrera de error padre más cercana](/reference/react/Component#static-getderivedstatefromerror) determinará como presentar el error al usuario. En la práctica, esto significa que el usuario verá un indicador de carga hasta que se tenga la certeza de que el error no es recuperable.

Si el reintento de renderizar `Posts`en el cliente tiene éxito, el *fallback* de carga desde el servidor se reemplazará con la salida de renderizado del cliente. El usuario no sabrá que hubo un error en el servidor. Aún así, se activarán los *callbacks* `onError` del servidor y [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) del cliente para que puedas ser notificado del error.

---

### Establecer el código de estado {/*setting-the-status-code*/}

Al hacer *streaming* de la página, se presenta un compromiso: quieres que el usuario vea el contenido lo más pronto posible, pero una vez que inicia el proceso, no puedes establecer el código de estado de la respuesta.

Al [dividir tu aplicación](#specifying-what-goes-into-the-shell) en el *shell* (sobre todas las barreras de `<Suspense>`) y el resto de contenido, ya has resuelto una parte de ese problema. Si el *shell* genera un error, puedes usar el *callback* `onShellError` para establecer el código de estado del error. Si no, puedes enviar "OK", ya que sabes que la aplicación puede recuperarse en el cliente.

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Algo salió mal</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Si un componente *fuera* del *shell* (es decir, dentro de una barrera de `<Suspense>`) lanza un error, React no detendrá el renderizado. Esto significa que se ejecutará el *callback* `onError`, pero aún obtendrás `onShellReady` en lugar de `onShellError`. Esto se debe a que React intentará recuperarse de ese error en el cliente, [tal como se describe arriba.](#recovering-from-errors-outside-the-shell)

Sin embargo, si quieres, puedes aprovechar que un error haya ocurrido para establecer el código de estado:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Algo salió mal</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Esto sólo capturará errores fuera del *shell* que ocurrieron durante la generación del contenido inicial del *shell*, así que no es estricto. Si es fundamental saber si ocurrió un error en algún contenido, puedes moverlo al *shell*.

---

### Manejar diferentes errores de diferentes maneras {/*handling-different-errors-in-different-ways*/}

Puedes [crear tus propias subclases de `Error`](https://es.javascript.info/custom-errors) y usar el operador [`instanceof`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/instanceof) para verificar qué error se ha lanzado. Por ejemplo, puedes definir una clase personalizada como `NotFoundError` y lanzarla desde tu componente. De esta manera tus *callbacks* `onError`, `onShellReady` y `onShellError` pueden realizar acciones diferentes según el tipo de error:

```js {2,4-14,19,24,30}
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

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Algo salió mal</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Ten en cuenta que una vez que emites el *shell* y comienzas el *streaming*, no puedes cambiar el código de estado.

---

### Esperar a que todo el contenido se cargue para los rastreadores y generación estática {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

El *streaming* mejora la experiencia de usuario porque este puede ver el contenido a medida que está disponible.

Sin embargo, cuando un rastreador visita tu página o estás generando las páginas en tiempo de compilación, quizás prefieras esperar a que todo el contenido esté disponible antes de producir la salida HTML final, en lugar de revelarlo progresivamente.

Puedes esperar a que todo el contenido se cargue utilizando el *callback* `onAllReady`:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depende de tu estrategia de detección de bots ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Algo salió mal</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Un visitante normal recibirá un *stream* de contenido cargado progresivamente. Por el contrario, un rastreador recibirá la salida HTML final después de que se carguen todos los datos. Ten en cuenta que esto implica que el rastreador tendrá que esperar a que *todos* los datos se carguen, algunos de los cuales pueden ser lentos para cargar o generar errores. Dependiendo de tu aplicación, podrías optar por enviar también el *shell* a los rastreadores.

---

### Abortar el renderizado del servidor {/*aborting-server-rendering*/}

Puedes forzar al renderizado del servidor a "rendirse" después de un tiempo de espera:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React limpiará los *fallbacks* de carga restantes como HTML e intentará renderizar el resto en el cliente.
