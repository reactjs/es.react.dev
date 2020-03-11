---
id: concurrent-mode-adoption
title: Adopción del modo concurrente (Experimental)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Advertencia:
>
>Esta página describe **funcionalidades experimentales que [aún no están disponibles](/docs/concurrent-mode-adoption.html) en una versión estable**. No dependas de compilados experimentales de React en aplicaciones en producción. Estas funcionalidades pueden cambiar significativamente y sin advertencia antes de formar parte de React.
>	
>Esta documentación está dirigida a usuarios pioneros y personas que sienten curiosidad. **Si te estás iniciando en React, no te preocupes por estas funcionalidades,** no necesitas aprenderlas inmediatamente.

</div>

- [Instalación](#installation)
  - [¿Para quién es esta versión experimental?](#who-is-this-experimental-release-for)
  - [Habilitar el modo concurrente](#enabling-concurrent-mode)
- [¿Qué esperar?](#what-to-expect)
  - [Paso de migración: modo de bloqueo](#migration-step-blocking-mode)
  - [¿Por qué tantos modos?](#why-so-many-modes)
  - [Comparación de características](#feature-comparison)

## Instalación {#installation}

El Modo Concurrente solo está disponible en [compilados experimentales](/blog/2019/10/22/react-release-channels.html#experimental-channel) de React. Para instalarlos, ejecuta:

```
npm install react@experimental react-dom@experimental
```

**No hay garantías de versionado semántico para los compilados experimentales.**  
Se puede añadir, cambiar o eliminar las API en cualquier versión `@experimental`.

**Las versiones experimentales tendrán frecuentes cambios disruptivos.**

Puedes probar estos compilados en proyectos personales o en una rama, pero no recomendamos ejecutarlos en producción. En Facebook, *sí* los ejecutamos en producción, pero solo porque también estamos ahí para solucionar los errores cuando algo se rompe. ¡Has sido advertido!

### ¿Para quién es la versión experimental?  {#who-is-this-experimental-release-for}

Esta versión está dirigida principalmente a los pioneros, autores de bibliotecas y gente curiosa.

Estamos usando este código en producción (y nos funciona), pero aún existen algunos errores, funcionalidades que faltan, y lagunas en la documentación. Nos gustaría escuchar más acerca de qué se rompe en el Modo Concurrente para que lo podamos preparar mejor para una versión oficial estable en el futuro.

### Habilitar el Modo Concurrente {#enabling-concurrent-mode}

Normalmente, cuando añadimos nuevas funcionalidades a React, puedes comenzar a usarlas inmediantamente. Los Fragmentos, el contexto, e incluso los Hooks son ejemplos de tales funcionalidades. Las puedes usar en código nuevo sin hacer ningún cambio al código existente.

El Modo Concurrente es diferente. Introduce cambios semánticos a cómo React funciona. De otra forma, las [nuevas funcionalidades](/docs/concurrent-mode-patterns.html) que se habilitan *no serían posibles*. Es por eso que están agrupadas en un nuevo "modo" en lugar de ser lanzadas una por una por separado.

No puedes optar por el Modo Concurrente en base a subárboles. En cambio, para optar por él, tienes que hacerlo en el lugar donde hoy llamas a `ReactDOM.render()`.

**Esto habilitará el Modo Concurrente para todo el árbol `<App />` :**

```js
import ReactDOM from 'react-dom';

// Si anteriormente tenías:
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// Puedes optar por el modo concurrente escribiendo:

ReactDOM.createRoot(
  document.getElementById('root')
).render(<App />);
```

>Nota:
>
>Las API del Modo Concurrente como `createRoot` solo existen en los compilados experimentadles de React.

En el Modo Concurrente, los métodos de ciclo de vida [previamente marcados](/blog/2018/03/27/update-on-async-rendering.html) como "inseguros" de hecho son inseguros, y conducen aún a más errores que en React hoy en día. No recomendamos intentar el Modo Concurrente hasta que tu aplicación sea compatible con el [Modo estricto](/docs/strict-mode.html).

## ¿Qué esperar? {#what-to-expect}

Si tienes una aplicación grande existente, o si tu aplicación depende de muchos paquetes de terceros, por favor no esperes que seas capaz de usar el Modo Concurrente de forma inmediata. **Por ejemplo, en Facebook estamos usando el Modo concurrente para el nuevo sitio web, pero no tenemos planeado habilitarlo en el sitio antiguo.** Esto ocurre porque nuestro antiguo sitio web aún utiliza métodos de ciclo de vida inseguros en el código del producto, bibliotecas de terceros incompatibles y patrones que no funcionan bien en el Modo Concurrente.

En nuestra experiencia, el código que usa patrones idiomáticos de React y que no depende de soluciones del manejo de estado de forma externa es el más fácil de conseguir que se ejecute en el Modo Concurrente. Describiremos los problemas comunes que hemos visto y las soluciones a ellas de forma separada en las próximas semanas.

### Paso de migración: Modo de bloqueo {#migration-step-blocking-mode}

Para bases de código más antiguas, el Modo Concurrente pueden ser un paso que vaya demasiado lejos. Por eso es que también proporcionamos un nuevo "Modo de bloqueo" en los compilados experimentales de React. Puedes probarlos sustituyendo`createRoot` con `createBlockingRoot`.  Solo ofrece un *pequeño subconjunto* de la funcionalidades del Modo Concurrente, pero es más cercano a como React funciona hoy y puede servir como un paso de migración.

Para recapitular:

* **Modo legado:** `ReactDOM.render(<App />, rootNode)`. Es el que las aplicaciones de React utilizan hoy en día. No hay planes para eliminar el modo legado en el futuro cercano, pero no será capaz de incluir estas nuevas funcionalidades. 
* **Modo de bloqueo:** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`. Actualmente es experimental. Su intención es ser un primer paso para la migración de las aplicaciones que quieran obtener un subconjunto de las funcionalidades del Modo Concurrente.
* **Modo Concurrente:** `ReactDOM.createRoot(rootNode).render(<App />)`. . Actualmente es experimental. En el futuro, luego de que se estabilice, esperamos convertirlo en el modo predeterminado para React. Este modo habilita *todas* las nuevas funcionalidades.

### ¿Por qúe tantos modos? {#why-so-many-modes}

Pensamos que es mejor ofrecer una [estrategia gradual de migración](/docs/faq-versioning.html#commitment-to-stability) que hacer grandes cambios disruptivos, o dejar que React se estanque hasta la irrelevancia.

En la práctica, esperamos que la mayoría de las aplicaciones que usan el Modo Legado hoy sean capaces de migrar al menos al Modo de bloqueo (si no al Modo Concurrente). Esta fragmentación puede ser molesta para las bibliotecas que se propongan ser compatibles con todos los modos a corto plazo. Sin embargo, mover gradualmente al ecosistema lejos del Modo Legado, también *resolverá* problemas que afectan a bibliotecas importantes en el ecosistema, como el [comportamiento confuso de Suspense al leer una disposición de elementos](https://github.com/facebook/react/issues/14536) y la [falta de garantías consistentes en el procesamiento por lotes](https://github.com/facebook/react/issues/15080). Existen un número de errores que no pueden ser solucionados en el Modo Legado sin cambiar semánticas, pero que no existen en el Modo de bloqueo o el Concurrente.

Puedes hacerte la idea del Modo de bloqueo como una versión "graciosamente degradada" del Modo Concurrente. **Como resultado, a largo plazo debemos ser capaces de converger y parar de pensar de una vez por todas acerca de los distintos Modos.** Pero por ahora, los modos son una estrategia importante de migración. Le permiten a todos decidir cuándo vale la pena migrar, y realizar las actualizaciones a su propio paso.

### Comparación de funcionalidades {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |Modo Heredado|Modo Bloqueo   |Modo Concurrente |
|---  |---  |---  |---  |
|[String Refs](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[Legacy Context](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative Multitasking |🚫  |🚫  |✅  |
|Automatic batching of multiple setStates     |🚫* |✅  |✅  |
|[Priority-based Rendering](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[Interruptible Prerendering](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*: El modo legado tiene procesamiento por lotes automático en los eventos manejados por React, pero está limitado a una tarea del navegador. Los eventos que no son de React deben optar por ese comportamiento usando `unstable_batchedUpdates`. En el Modo de bloqueo y el concurrente, todos los `setState` son procesados en lote de forma predeterminada.

\*\*: Muestra advertencias en desarrollo.
