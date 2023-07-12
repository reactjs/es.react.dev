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

## Referencia {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

Llama a la función `renderToReadableStream` para renderizar tu árbol de React como HTML a [un legible stream para web](https://nodejs.org/api/stream.html#writable-streams)

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

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: Es un nodo de React que quieres renderizar en HTML. Por ejemplo, un elemento JSX como `<App />`. Se presupone que representará el documento completo, por lo que el componente `App` debería renderizar la etiqueta `<html>`.

* **opcional** `options`: Objeto con las opciones de streaming.
  * **opcional** `bootstrapScriptContent`: Si se especifica, esta cadena será colocada dentro de una etiqueta `<script>`.
  * **opcional** `bootstrapScripts`: Array de strings que representan las URL para que la etiqueta `<script>` las emita en la página. Utiliza esto para incluír el `<script>` que llama a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Omítelo si no planeas usar React en el cliente.
  * **opcional** `bootstrapModules`: Igual que `bootstrapScripts`, pero emite [`<script type="module">`](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules) en su lugar.
  * **opcional** `identifierPrefix`: Prefijo (string) que React usa para los IDs generados mediante [`useId`.](/reference/react/useId) Útil para evitar conflictos cuando se usan múltiples raíces (roots) en la misma página. Debe ser el mismo prefijo que se le pasa a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **opcional** `namespaceURI`: Un string con la raíz del [namespace URI](https://developer.mozilla.org/es/docs/Web/API/Document/createElementNS#namespace_uris_válidos) para el stream. Por defecto se usa HTML. Usa `'http://www.w3.org/2000/svg'` para SVG o `'http://www.w3.org/1998/Math/MathML'` para MathML.
  * **opcional** `nonce`: Un string [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) que le permite al script la [`script-src` política de contenido seguro (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **opcional** `onError`: Callback que se activa cuando ocurre un error en el servidor, sea [recuperable](#recovering-from-errors-outside-the-shell) o [no.](#recovering-from-errors-inside-the-shell) Por defecto, solo ejecuta `console.error`. Si lo sobreescribes para [registrar errores en el servidor,](#logging-crashes-on-the-server) asegúrate que sigas llamando a `console.error`. También puedes usarlo para [ajustar el código de estado](#setting-the-status-code) antes de que el shell sea emitido.
  * **opcional** `progressiveChunkSize`: El número de bytes en un chunk. [Leer más sobre el heurístico que se usa por defecto.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **opcional** `signal`: Una [señal de aborto](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) que permite [abortar el renderizado en el servidor](#aborting-server-rendering) y el resto del renderizado en el cliente.


#### Devuelve {/*returns*/}

`renderToReadableStream` devuelve una promesa:

- Si el [shell](#specifying-what-goes-into-the-shell) se renderizó satisfactoriamente, la promesa se devolverá a un [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- Si el renderizado del shell falla, la promesa será rechazada. [Usa esto para mostrar un shell mediante un callback.](#recovering-from-errors-inside-the-shell)

El stream devuelto tiene una propiedad adicional:

* `allReady`: Promesa que se resuelve cuando todo el renderizado se ha completado, incluyendo tanto el [shell](#specifying-what-goes-into-the-shell) como todo el [contenido](#streaming-more-content-as-it-loads) adicional. Puedes esperar a `await stream.allReady` antes de devolver una respuesta [para rastreadores y generación estática.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Si usas esto, no obtendrás carga progresiva. El stream contendrá el HTML final.

---

## Uso {/*usage*/}

### Renderizar un árbol de React como HTML a un Readable Web Stream {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

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

React inyectará el [doctype](https://developer.mozilla.org/es/docs/Glossary/Doctype) y tus <CodeStep step={2}>etiquetas de `<script>` de arranque</CodeStep> dentro del HTML resultante del stream:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML de tus componentes ... -->
</html>
<script src="/main.js" async=""></script>
```

En el cliente, tu script inicial debería [hidratar el `document` entero con una llamada a `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Esto adjuntará detectores de eventos al HTML generado en el servidor, haciendo que este sea interactivo.

<DeepDive>

#### Leer recursos CSS y JS mediante su ruta a través del output {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Las URL finales de los recursos (como los archivos CSS y JS) suelen ser hasheadas después de la compilación. Por ejemplo, en lugar de `styles.css` podrías tener `styles.123456.css`. El hasheo de nombres de archivos estáticos garantiza que cada versión distinta del mismo recurso tendrá un nombre de archivo diferente. Esto es útil porque te permite activar de forma segura el almacenamiento en caché a largo plazo para recursos estáticos: un archivo con un nombre característico nunca cambiaría su contenido.

Sin embargo, si no conoces las URLs de los recursos hasta después de tener el build, no te será posible ponerlas en el código fuente. Por ejemplo, si hardcodeas `"/styles.css"` en JSX, esto no funcionaría, puesto que es una URL relativa. Para mantenerlas fuera del código fuente, tu componente raíz puede leer el nombre real de un archivo a través de un mapa pasado como propiedad:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>Mi app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
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
  'styles.css': '/styles.123456.css',
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
  'styles.css': '/styles.123456.css',
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

**Solo las fuentes de información "Suspense-enabled" activarán el componente Suspense.** Estas incluyen:

- Obtención de datos con frameworks "Suspense-enabled" como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) y [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Código de componentes lazy-loading con [`lazy`](/reference/react/lazy)

Suspense **no** detecta cuando la información es obtenida dentro de un Hook de efecto o un controlador deeventos.

La forma exacta en la que se cargará la información dentro del componente `Posts` depende del framework que se use. Si usas un framework "Suspense-enabled", podrás consultar en la documentación los detalles de cómo funciona la obtención de datos.

La obtención de datos "Suspense-enabled" sin el uso de un framework dogmático no está soportado todavía. Los requisitos para implementar una fuente de datos "Suspense-enabled" son inestables y se encuentran indocumentados. La API oficial para implementar fuentes de datos "Suspense-enabled" será publicada en versiones futuras de React. 

</Note>

---

### Especificar qué va dentro del shell {/*specifying-what-goes-into-the-shell*/}

La parte de tu app que va fuera de cualquier envoltura `<Suspense>` es conocida como *el shell:*

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

Determina el primer estado de carga que el usuario podrá ver:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Si envuelves toda la app dentro del componente `<Suspense>` en la raíz, el shell solo contendrá el círculo de carga. No obstante, esto generaría una experiencia de usuario poco agradable, ya que ver un símbolo de carga gigante puede hacer que la app se sienta lenta y es más molesto que esperar un poco más y ver la disposición real de la página. Es por esto que es conveniente utilizar el componente `<Suspense>` de forma que en el shell se vea el contenido *mínimo, pero que esté completo*--como si fuera el esqueleto de la disposición de la página.

La llamada asíncrona a `renderToReadableStream` será resuelta a un `stream` tan pronto como el shell haya sido renderizado. Entonces, empezarás a streamear creando y devolviendo una respuesta con este `stream`:

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

Para cuando el `stream` sea devuelto, los componentes anidados en `<Suspense>` podrían estar aún cargando la información.

---

### Registrando fallos en el servidor {/*logging-crashes-on-the-server*/}

Por defecto, todos los errores que ocurren en el servidor son registrados en la consola. Es posible sobreescribir esto para generar informes de fallo:

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

Si se provee una implementación personalizada de `onError`, no olvides registrar también los errores en la consola, como hacemos en el ejemplo superior.

---

### Recuperar errores dentro del shell {/*recovering-from-errors-inside-the-shell*/}

En este ejemplo, el shell contiene `ProfileLayout`, `ProfileCover` y `PostsGlimmer`:

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

Si ocurriera un error al renderizar estos componentes, React no tendría ningún HTML significativo que enviar al cliente. Envuelve la llamada a `renderToReadableStream` en un bloque `try...catch` para enviar HTML alternativo que no depende del renderizado en el servidor como último recurso:

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

Si ocurriera un error al generar el shell, tanto `onError` como el bloque `catch` serían disparados. Usa `onError` para reportar el error y el bloque `catch` para enviar el HTML alternativo. El HTML alternativo no tiene necesariamente por qué ser un mensaje de error. En su lugar, puedes incluír un shell alternativo que renderiza la app solo en el cliente.

---

### Recuperar errores fuera del shell {/*recovering-from-errors-outside-the-shell*/}

En este ejemplo, el componente `<Posts />` está envuelto en `<Suspense>`, por lo que *no* es parte del shell:

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

Si ocurriera un error en el componente `Posts` o en cualquier parte dentro del mismo, React [intentará recuperse de él:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)

1. Emitirá el respaldo de carga del `<Suspense>` más cercano (`PostsGlimmer`) en el HTML.
2. Dejará de intentar renderizar el contenido de `Posts` en el servidor.
3. Cuando el código de JavaScript cargue en el cliente, React *intentará* renderizar `Posts` en el cliente.

Si el intento de cargar `Posts` desde el cliente *también* falla, React lanzará el error en el cliente. Igual que con el resto de errores lanzados durante el renderizado, el [límite de error más cercano](/reference/react/Component#static-getderivedstatefromerror) determinará cómo mostrar el error al usuario. En la práctica, esto significa que el usuario verá un símbolo de carga hasta que el error sea imposible de recuperar.

Si el intento de renderizado de `Posts` en el cliente se logra con éxito, el símbolo de carga recibido desde el servidor será reemplazado con el HTML obtenido como resultado. El usuario no sabrá que ocurrió un error en el servidor. Sin embargo, la función `onError` del servidor y la función [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) del cliente serán disparadas, por lo que podrás ser notificado/a del error.

---

### Establecer el código de estado {/*setting-the-status-code*/}

El streaming requiere de una compensación. Se pretende empezar el streaming lo antes posible de forma que el usuario vea el contenido lo antes posible también. No obstante, una vez se empieza el streaming, no es posible establecer un código de estado.

Al [dividir la app](#specifying-what-goes-into-the-shell) en el shell (por encima de los perímetros `<Suspense>`) y el resto de contenido, ya se ha solucionado una parte de este problema. Si el shell falla, el bloque `catch` te permitirá establecer el código de estado del error. De lo contrario, sabes que la app se podrá recuperar en el cliente, por lo que puedes enviar un "OK".

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

Si un componente *fuera* del shell (por ejemplo, dentro del perímetro `<Suspense>`) lanza un error, React no dejará de renderizar. Esto significa que la función `onError` será disparada, pero tu código continuará ejecutándose sin entrar en el bloque `catch`. Esto es porque React tratará de recuperarse de este error en el cliente, [como hemos descrito previamente.](#recovering-from-errors-outside-the-shell)

Sin embargo, si lo deseas, puedes usar el hecho de que algo ha fallado para establecer el código de error:

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

Esto solo capturará errores de fuera del shell que ocurrieron mientras se generaba el contenido inicial del shell, por lo que no es exhaustivo. Si saber si ocurrió un error es fundamental para algún contenido, puede moverlo hacia arriba en el shell.

---

### Gestionar distintos errores de distintas maneras {/*handling-different-errors-in-different-ways*/}

Puedes [crear tus propias subclases de `Error`](https://javascript.info/custom-errors) y utilizar el operador [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) para comprobar qué error ha sido lanzado. Por ejemplo, puedes definir un `NotFoundError` personalizado y lanzarlo desde tu componente. Después, puedes guardar el error dentro de la función `onError` y hacer algo distinto antes de devolver la respuesta dependiendo del tipo de error:

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

Ten en cuenta que una vez emites el shell y empiezas a streamear, no podrás cambiar el código de error.

---

### Esperar a que se cargue todo el contenido para rastreadores y generación estática {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Streamear ofrece una mejor experiencia de usuario porque permite ver el contenido a medida que este está disponible.

Sin embargo, cuando un rastreador visita tu página, o si generas las páginas en tiempo de compilacón, quizá prefieras dejar que todo el contenido cargue primero, y después producir el HTML final en lugar de revelarlo de forma progresiva.

Puedes esperar a que todo el contenido cargue esperando a la promesa `stream.allReady`:

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
    let isCrawler = // ... depende de tu estrategia de detección de bots ...
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

Un visitante regular verá cargar el contenido de forma progresiva. Un rastreador recibirá el HTML final cuando toda la información haya cargado. No obstante, esto también significa que el rastreador tendrá que esperar a que *toda* la información cargue, lo cual puede fallar o tardar demasiado. Dependiendo de tu app, también puedes considerar si enviar todo el shell a los rastreadores.

---

### Abortar el renderizado en el servidor {/*aborting-server-rendering*/}

Puedes forzar al servidor a abandonar el renderizado después de un tiempo de espera:

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

React eliminará los respaldos de carga restantes como HTML e intentará renderizar el resto en el cliente.
