---
title: "React 19.2"
author: El equipo de React
date: 2025/10/01
description: React 19.2 agrega nuevas características como Activity, React Performance Tracks, useEffectEvent y más.
---

1 de octubre de 2025 por [El equipo de React](/community/team)

---

<Intro>

¡React 19.2 ya está disponible en npm!

</Intro>

Este es nuestro tercer lanzamiento en el último año, después de React 19 en diciembre y React 19.1 en junio. En esta publicación, daremos una visión general de las nuevas características de React 19.2 y destacaremos algunos cambios notables.

<InlineToc />

---

## Nuevas características de React {/*new-react-features*/}

### `<Activity />` {/*activity*/}

`<Activity>` te permite dividir tu aplicación en "actividades" que pueden ser controladas y priorizadas.

Puedes usar Activity como una alternativa a renderizar condicionalmente partes de tu aplicación:

```js
// Antes
{isVisible && <Page />}

// Después
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

En React 19.2, Activity soporta dos modos: `visible` y `hidden`.

- `hidden`: oculta los hijos, desmonta los efectos y difiere todas las actualizaciones hasta que React no tenga más trabajo pendiente.
- `visible`: muestra los hijos, monta los efectos y permite que las actualizaciones se procesen normalmente.

Esto significa que puedes prerenderizar y mantener renderizadas partes ocultas de la app sin afectar el rendimiento de lo que está visible en pantalla.

Puedes usar Activity para renderizar partes ocultas de la app a las que es probable que el usuario navegue a continuación, o para guardar el estado de partes de las que el usuario se aleja. Esto ayuda a que las navegaciones sean más rápidas cargando datos, CSS e imágenes en segundo plano, y permite que las navegaciones hacia atrás mantengan el estado, como los campos de entrada.

En el futuro, planeamos agregar más modos a Activity para diferentes casos de uso.

Para ejemplos de cómo usar Activity, consulta la [documentación de Activity](/reference/react/Activity).

---

### `useEffectEvent` {/*use-effect-event*/}

Un patrón común con `useEffect` es notificar al código de la app sobre algún tipo de "evento" de un sistema externo. Por ejemplo, cuando una sala de chat se conecta, podrías querer mostrar una notificación:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('¡Conectado!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]);
  // ...
```

El problema con el código anterior es que un cambio en cualquier valor usado dentro de ese "evento" hará que el Effect circundante se vuelva a ejecutar. Por ejemplo, cambiar el `theme` hará que la sala de chat se reconecte. Esto tiene sentido para valores relacionados con la lógica del Effect, como `roomId`, pero no para `theme`.

Para solucionar esto, la mayoría de los usuarios simplemente desactivan la regla de lint y excluyen la dependencia. Pero eso puede llevar a errores, ya que el linter ya no puede ayudarte a mantener las dependencias actualizadas si necesitas modificar el Effect más adelante.

Con `useEffectEvent`, puedes separar la parte de "evento" de esta lógica fuera del Effect que la emite:

```js {2,3,4,9}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('¡Conectado!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas las dependencias declaradas (Effect Events no son dependencias)
  // ...
```

Similar a los eventos del DOM, los Effect Events siempre “ven” las últimas props y estado.

**Los Effect Events _no_ deben declararse en el array de dependencias**. Necesitarás actualizar a `eslint-plugin-react-hooks@6.1.0` para que el linter no intente insertarlos como dependencias. Ten en cuenta que los Effect Events solo pueden declararse en el mismo componente o Hook que su Effect "propietario". Estas restricciones son verificadas por el linter.

<Note>

#### Cuándo usar `useEffectEvent` {/*when-to-use-useeffectevent*/}

Debes usar `useEffectEvent` para funciones que conceptualmente son "eventos" que se disparan desde un Effect en vez de un evento de usuario (eso es lo que lo hace un "Effect Event"). No necesitas envolver todo en `useEffectEvent`, ni usarlo solo para silenciar el error de lint, ya que esto puede causar errores.

Para un análisis profundo sobre cómo pensar los Effect Events, consulta: [Separando eventos de efectos](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects).

</Note>

---

### `cacheSignal` {/*cache-signal*/}

<RSC>

`cacheSignal` solo debe usarse con [React Server Components](/reference/rsc/server-components).

</RSC>

`cacheSignal` te permite saber cuándo la vida útil de [`cache()`](/reference/react/cache) ha terminado:

```
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);

async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

Esto te permite limpiar o abortar trabajo cuando el resultado ya no se usará en la caché, como por ejemplo:

- React ha completado exitosamente el renderizado
- El renderizado fue abortado
- El renderizado falló

Para más información, consulta la [documentación de `cacheSignal`](/reference/react/cacheSignal).

---

### Performance Tracks {/*performance-tracks*/}

React 19.2 agrega un nuevo conjunto de [tracks personalizados](https://developer.chrome.com/docs/devtools/performance/extension) a los perfiles de rendimiento de Chrome DevTools para proporcionar más información sobre el rendimiento de tu app React:

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

La [documentación de React Performance Tracks](/reference/dev-tools/react-performance-tracks) explica todo lo que incluyen los tracks, pero aquí tienes una visión general.

#### Scheduler ⚛ {/*scheduler-*/}

El track Scheduler muestra en qué está trabajando React para diferentes prioridades, como "blocking" para interacciones de usuario, o "transition" para actualizaciones dentro de startTransition. Dentro de cada track, verás el tipo de trabajo realizado, como el evento que programó una actualización y cuándo ocurrió el renderizado de esa actualización.

También mostramos información como cuándo una actualización está bloqueada esperando otra prioridad, o cuándo React espera el repintado antes de continuar. El track Scheduler te ayuda a entender cómo React divide tu código en diferentes prioridades y el orden en que completó el trabajo.

Consulta la [documentación del track Scheduler](/reference/dev-tools/react-performance-tracks#scheduler) para ver todo lo incluido.

#### Componentes ⚛ {/*components-*/}

El track Componentes muestra el árbol de componentes en el que React está trabajando, ya sea para renderizar o ejecutar efectos. Dentro verás etiquetas como "Mount" cuando los hijos se montan o los efectos se montan, o "Blocked" cuando el renderizado está bloqueado por ceder trabajo fuera de React.

El track Componentes te ayuda a entender cuándo se renderizan los componentes o se ejecutan efectos, y el tiempo que toma completar ese trabajo para ayudar a identificar problemas de rendimiento.

Consulta la [documentación del track Componentes](/reference/dev-tools/react-performance-tracks#components) para ver todo lo incluido.

---

## Nuevas características de React DOM {/*new-react-dom-features*/}

### Prerenderizado parcial {/*partial-pre-rendering*/}

En 19.2 estamos agregando una nueva capacidad para prerenderizar parte de la app por adelantado y reanudar el renderizado más tarde.

Esta característica se llama "Prerenderizado Parcial" y te permite prerenderizar las partes estáticas de tu app y servirlas desde un CDN, y luego reanudar el renderizado del shell para completarlo con contenido dinámico más adelante.

Para prerenderizar una app y reanudarla después, primero llama a `prerender` con un `AbortController`:

```
const {prelude, postponed} = await prerender(<App />, {
  signal: controller.signal,
});

// Guarda el estado pospuesto para después
await savePostponedState(postponed);

// Envía el prelude al cliente o CDN.
```

Luego, puedes devolver el shell `prelude` al cliente y más tarde llamar a `resume` para "reanudar" a un stream SSR:

```
const postponed = await getPostponedState(request);
const resumeStream = await resume(<App />, postponed);

// Envía el stream al cliente.
```

O puedes llamar a `resumeAndPrerender` para reanudar y obtener HTML estático para SSG:

```
const postponedState = await getPostponedState(request);
const { prelude } = await resumeAndPrerender(<App />, postponedState);

// Envía el prelude HTML completo al CDN.
```

Para más información, consulta la documentación de las nuevas APIs:
- `react-dom/server`
  - [`resume`](/reference/react-dom/server/resume): para Web Streams.
  - [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) para Node Streams.
- `react-dom/static`
  - [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) para Web Streams.
  - [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) para Node Streams.

Además, las APIs de prerender ahora devuelven un estado `postpone` para pasar a las APIs de `resume`.

---

## Cambios notables {/*notable-changes*/}

### Agrupación de límites de Suspense para SSR {/*batching-suspense-boundaries-for-ssr*/}

Corregimos un error de comportamiento donde los límites de Suspense se revelaban de manera diferente dependiendo de si se renderizaban en el cliente o al hacer streaming desde el renderizado del lado del servidor.

A partir de 19.2, React agrupará las revelaciones de los límites de Suspense renderizados en el servidor por un corto tiempo, para permitir que se revele más contenido junto y alinearse con el comportamiento del cliente.

<Diagram name="19_2_batching_before" height={162} width={1270} alt="Diagrama con tres secciones, con una flecha que transiciona entre cada sección. La primera sección contiene un rectángulo de página mostrando un estado de carga con barras desvanecidas. El segundo panel muestra la mitad superior de la página revelada y resaltada en azul. El tercer panel muestra toda la página revelada y resaltada en azul.">

Anteriormente, durante el streaming SSR, el contenido de suspense reemplazaba inmediatamente los fallbacks.

</Diagram>

<Diagram name="19_2_batching_after" height={162} width={1270} alt="Diagrama con tres secciones, con una flecha que transiciona entre cada sección. La primera sección contiene un rectángulo de página mostrando un estado de carga con barras desvanecidas. El segundo panel muestra la misma página. El tercer panel muestra toda la página revelada y resaltada en azul.">

En React 19.2, los límites de suspense se agrupan por un pequeño periodo de tiempo, para permitir revelar más contenido junto.

</Diagram>

Esta corrección también prepara las apps para soportar `<ViewTransition>` para Suspense durante SSR. Al revelar más contenido junto, las animaciones pueden ejecutarse en lotes más grandes de contenido y evitar encadenar animaciones de contenido que se transmite muy seguido.

<Note>

React usa heurísticas para asegurar que la limitación no impacte los core web vitals ni el ranking de búsqueda.

Por ejemplo, si el tiempo total de carga de la página se acerca a 2.5s (que es el tiempo considerado "bueno" para [LCP](https://web.dev/articles/lcp)), React dejará de agrupar y revelará el contenido inmediatamente para que la limitación no sea la razón de perder la métrica.

</Note>

---

### SSR: Soporte de Web Streams para Node {/*ssr-web-streams-support-for-node*/}

React 19.2 agrega soporte para Web Streams en el streaming SSR en Node.js:
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) ahora está disponible para Node.js
- [`prerender`](/reference/react-dom/static/prerender) ahora está disponible para Node.js

Así como las nuevas APIs de `resume`:
- [`resume`](/reference/react-dom/server/resume): está disponible para Node.js.
- [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) está disponible para Node.js.


<Pitfall>

#### Prefiere Node Streams para renderizado del lado del servidor en Node.js {/*prefer-node-streams-for-server-side-rendering-in-nodejs*/}

En entornos Node.js, aún recomendamos altamente usar las APIs de Node Streams:

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)
- [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)

Esto es porque los Node Streams son mucho más rápidos que los Web Streams en Node, y los Web Streams no soportan compresión por defecto, lo que puede llevar a que los usuarios pierdan los beneficios del streaming.

</Pitfall>

---

### `eslint-plugin-react-hooks` v6 {/*eslint-plugin-react-hooks*/}

También publicamos `eslint-plugin-react-hooks@6.1.0` con configuración plana por defecto en el preset `recommended`, y opción para nuevas reglas impulsadas por el React Compiler.

Para seguir usando la configuración heredada, puedes cambiar a `recommended-legacy`:

```diff
- extends: ['plugin:react-hooks/recommended']
+ extends: ['plugin:react-hooks/recommended-legacy']
```

Para una lista completa de reglas habilitadas por el compilador, [consulta la documentación del linter](/reference/eslint-plugin-react-hooks#additional-rules).

Consulta el [changelog de eslint-plugin-react-hooks](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md#610) para ver todos los cambios.

---

### Actualización del prefijo por defecto de `useId` {/*update-the-default-useid-prefix*/}

En 19.2, actualizamos el prefijo por defecto de `useId` de `:r:` (19.0.0) o `«r»` (19.1.0) a `_r_`.

La intención original de usar un carácter especial que no fuera válido para selectores CSS era que fuera poco probable que colisionara con IDs escritos por los usuarios. Sin embargo, para soportar View Transitions, necesitamos asegurarnos de que los IDs generados por `useId` sean válidos para `view-transition-name` y nombres XML 1.0.

---

## Registro de cambios {/*changelog*/}

Otros cambios notables
- `react-dom`: Permitir usar nonce en estilos hoistable [#32461](https://github.com/facebook/react/pull/32461)
- `react-dom`: Advertir al usar un nodo propiedad de React como contenedor si también tiene contenido de texto [#32774](https://github.com/facebook/react/pull/32774)

Correcciones de errores notables
- `react`: Convertir context a "SomeContext" en vez de "SomeContext.Provider" [#33507](https://github.com/facebook/react/pull/33507)
- `react`: Corregir bucle infinito de useDeferredValue en evento popstate [#32821](https://github.com/facebook/react/pull/32821)
- `react`: Corregir un error al pasar un valor inicial a useDeferredValue [#34376](https://github.com/facebook/react/pull/34376)
- `react`: Corregir un fallo al enviar formularios con Client Actions [#33055](https://github.com/facebook/react/pull/33055)
- `react`: Ocultar/mostrar el contenido de límites de suspense deshidratados si se resuspenden [#32900](https://github.com/facebook/react/pull/32900)
- `react`: Evitar stack overflow en árboles anchos durante Hot Reload [#34145](https://github.com/facebook/react/pull/34145)
- `react`: Mejorar los stacks de componentes en varios lugares [#33629](https://github.com/facebook/react/pull/33629), [#33724](https://github.com/facebook/react/pull/33724), [#32735](https://github.com/facebook/react/pull/32735), [#33723](https://github.com/facebook/react/pull/33723)
- `react`: Corregir un error con React.use dentro de un componente React.lazy [#33941](https://github.com/facebook/react/pull/33941)
- `react-dom`: Dejar de advertir al usar atributos ARIA 1.3 [#34264](https://github.com/facebook/react/pull/34264)
- `react-dom`: Corregir un error con Suspense profundamente anidado dentro de fallbacks de Suspense [#33467](https://github.com/facebook/react/pull/33467)
- `react-dom`: Evitar quedarse colgado al suspender después de abortar durante el renderizado [#34192](https://github.com/facebook/react/pull/34192)

Para una lista completa de cambios, consulta el [registro de cambios](https://github.com/facebook/react/blob/main/CHANGELOG.md).


---

_Agradecimientos a [Ricky Hanlon](https://bsky.app/profile/ricky.fm) por [escribir esta publicación](https://www.youtube.com/shorts/T9X3YkgZRG0), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Matt Carroll](https://twitter.com/mattcarrollcode), [Jack Pope](https://jackpope.me) y [Joe Savona](https://x.com/en_JS) por revisar esta publicación._
