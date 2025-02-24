---
title: "React Labs: En qué hemos estado trabajando – junio 2022"
author:  Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage, and Xuan Huang
date: 2022/06/15
description: React 18 estuvo por años en desarrollo, y con él llegaron lecciones valiosas para el equipo de React. Su lanzamiento fue el resultado de muchos años de investigación y exploración de diversos caminos. Algunos de esos caminos fueron exitosos; muchos otros fueron callejones sin salida que nos llevaron a nuevas ideas. Una lección que hemos aprendido es que resulta frustrante para la comunidad esperar nuevas funcionalidades sin tener información sobre las rutas que estamos explorando.
---

15 de junio de 2022 por [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), y [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[React 18](/blog/2022/03/29/react-v18) estuvo por años en desarrollo, y con él llegaron lecciones valiosas para el equipo de React. Su lanzamiento fue el resultado de muchos años de investigación y exploración de diversos caminos. Algunos de esos caminos fueron exitosos; muchos otros fueron callejones sin salida que nos llevaron a nuevas ideas. Una lección que hemos aprendido es que resulta frustrante para la comunidad esperar nuevas funcionalidades sin tener información sobre las rutas que estamos explorando.

</Intro>

---

Normalmente tenemos varios proyectos en marcha en todo momento, que van desde los más experimentales hasta los que están claramente definidos. En un futuro nos gustaría comenzar a compartir regularmente con la comunidad más información sobre en qué hemos estado trabajando en relación a estos proyectos.

Para establecer expectativas, esta no es una ruta con plazos definidos. Muchos de estos proyectos se encuentran en investigación activa y es difícil establecer fechas de lanzamiento concretas. Dependiendo de lo que aprendamos, es posible que incluso algunos de ellos nunca se lancen en su iteración actual. En cambio, queremos compartir contigo los espacios de problemas que están siendo analizados activamente y lo que hemos aprendido hasta ahora.

## Server Components {/*server-components*/}

En diciembre de 2020 anunciamos un [experimental demo of React Server Components](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) (RSC). Desde entonces, hemos estado finalizando sus dependencias en React 18 y trabajando en cambios inspirados por la retroalimentación recibida durante las pruebas.

En particular, estamos dejando la idea de tener bibliotecas de I/O bifurcadas (por ejemplo, react-fetch) y, en su lugar, adoptando un modelo de async/await para una mejor compatibilidad. Esto no bloquea técnicamente el lanzamiento de los RSC porque también se puede hacer uso de enrutadores para la recuperación de datos. Otro cambio es que también nos estamos alejando del enfoque de la extensión de archivo en favor de [annotating boundaries](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278).

<<<<<<< HEAD
Estamos trabajando en colaboración con Vercel y Shopify para unificar el soporte del bundler para la semántica compartida tanto en Webpack como en Vite. Antes del lanzamiento, queremos asegurarnos de que la semántica de los RSCs sea la misma en todo el ecosistema de React. Este es el principal obstáculo para alcanzar estabilidad.
=======
We’re working together with Vercel and Shopify to unify bundler support for shared semantics in both webpack and Vite. Before launch, we want to make sure that the semantics of RSCs are the same across the whole React ecosystem. This is the major blocker for reaching stable.
>>>>>>> fc29603434ec04621139738f4740caed89d659a7

## Carga de recursos {/*asset-loading*/}

Actualmente, los recursos como scripts, estilos externos, fuentes e imágenes generalmente se precargan y cargan utilizando sistemas externos. Esto puede dificultar la coordinación en nuevos entornos como la transmisión de datos, los Componentes del Servidor y otros. Estamos evaluando la posibilidad de agregar APIs para precargar y cargar recursos externos sin duplicaciones a través de APIs de React que funcionen en todos los entornos de React.

También estamos considerando que sean compatibles con Suspense, de modo que puedas tener imágenes, CSS y fuentes que bloqueen la visualización hasta que se carguen, pero que no bloqueen la transmisión y el renderizado simultáneo. Esto puede ayudar a evitar [cambios rápidos y caóticos (popcorning)](https://twitter.com/sebmarkbage/status/1516852731251724293) cuando los elementos visuales aparecen y provocan cambios en la presentación.

## Optimizaciones del renderizado estático de servidor {/*static-server-rendering-optimizations*/}

La Generación de Sitios Estáticos (SSG) y la Regeneración Estática Incremental (ISR) son excelentes formas de conseguir rendimiento para páginas que se pueden almacenar en caché, pero creemos que podemos agregar funcionalidades para mejorar el rendimiento del Renderizado del Lado del Servidor (SSR) dinámico, especialmente cuando la mayoría pero no todo el contenido se puede almacenar en caché. Estamos explorando formas de optimizar el renderizado en el servidor utilizando compilación y pases estáticos.

## Compilador de optimización de React {/*react-compiler*/}

Presentamos una [early preview](https://www.youtube.com/watch?v=lGEMwh32soc) de React Forget en React Conf 2021. Es un compilador que genera automáticamente llamadas equivalentes a `useMemo` y `useCallback` para minimizar el costo de volver a renderizar, al mismo tiempo que conserva el modelo de programación de React.

Recientemente, terminamos una reescritura del compilador para hacerlo más confiable y eficiente. Esta nueva arquitectura nos permite analizar y memorizar patrones más complejos, como el uso de [mutaciones locales](/learn/keeping-components-pure#local-mutation-your-components-little-secret), y abre muchas nuevas oportunidades de optimización en tiempo de compilación más allá de simplemente igualar los Hooks de memoización.

También estamos trabajando en un espacio de experimentación para explorar muchos aspectos del compilador. Si bien el objetivo del espacio de experimentación es facilitar el desarrollo del compilador, creemos que también facilitará probarlo y desarrollar percepción sobre lo que hace el compilador. Revela varias ideas sobre cómo funciona internamente y muestra en tiempo real las salidas del compilador mientras escribes. Esto se incluirá junto con el compilador cuando se lance.

## Offscreen {/*offscreen*/}

Hoy en día, si deseas ocultar y mostrar un componente, tienes dos opciones. Una es agregarlo o quitarlo completamente del árbol. El problema con este enfoque es que el estado de tu interfaz de usuario se pierde cada vez que desmontas el componente, incluido el estado almacenado en el DOM, como la posición de desplazamiento (scroll position).

La otra opción es mantener el componente montado y cambiar su visibilidad usando CSS. Esto preserva el estado de tu interfaz de usuario, pero conlleva un costo en términos de rendimiento, ya que React debe seguir renderizando el componente oculto y todos sus elementos hijos cada vez que recibe nuevas actualizaciones.

Offscreen introduce una tercera opción: ocultar la interfaz de usuario visualmente, pero darle menor prioridad a su contenido. La idea es similar en esencia a la propiedad CSS `content-visibility`: cuando el contenido está oculto, no es necesario que permanezca sincronizado con el resto de la UI. React puede posponer el trabajo de renderizado hasta que el resto de la aplicación esté inactiva o hasta que el contenido vuelva a ser visible.

Offscreen es una función de bajo nivel que desbloquea funciones de alto nivel. Similar a otras características concurrentes de React, como `startTransition`, en la mayoría de los casos no interactuarás directamente con la API de Offscreen, sino más bien a través de un framework rígido para implementar patrones como: 

* **Transiciones instantáneas.** Algunos frameworks de enrutamiento ya precargan datos para acelerar las navegaciones subsecuentes, como cuando se pasa el cursor sobre un enlace. Con Offscreen, también podrán prerrenderizar la próxima pantalla en segundo plano.
* **Estado reutilizable.** De manera similar, al navegar entre rutas o pestañas, puedes utilizar Offscreen para preservar el estado de la pantalla anterior, de modo que puedas regresar y retomar desde donde lo dejaste.
* **Renderizado de listas virtualizadas.** Cuando se muestran grandes listas de elementos, los frameworks de listas virtualizadas prerrenderizarán más filas de las que están actualmente visibles. Puedes utilizar Offscreen para prerrenderizar las filas ocultas con una prioridad menor que los elementos visibles en la lista.
* **Contenido en segundo plano.** También estamos explorando una característica relacionada para dar menor prioridad al contenido en segundo plano sin ocultarlo, por ejemplo, al mostrar un modal superpuesto.

## Rastreo de transiciones {/*transition-tracing*/}

Actualmente, React cuenta con dos herramientas de perfilado. El [perfilador original](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) muestra una descripción general de todos los commits en una sesión de perfilado. Para cada commit, también muestra todos los componentes que se han renderizado y el tiempo que les llevó renderizarse. También tenemos una versión beta de un [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) presentado en React 18, que muestra cuándo los componentes programan actualizaciones y cuándo React trabaja en estas actualizaciones. Ambos perfiladores ayudan a los desarrolladores a identificar problemas de rendimiento en su código.e

Nos hemos dado cuenta que a los desarrolladores no les resulta muy útil conocer acerca de commits individuales lentos o componentes fuera de contexto. Es más util saber qué es lo que realmente provoca que los commits sean lentos. Y que los desarrolladores desean poder rastrear interacciones específicas (por ejemplo, un clic en un botón, una carga inicial o una navegación de página) para detectar regresiones de rendimiento y comprender por qué una interacción fue lenta y cómo solucionarla.

Anteriormente intentamos resolver este problema creando una [Interaction Tracing API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16), pero tenía algunos fallos de diseño fundamentales que reducían la precisión para rastrear por qué una interacción era lenta y a veces resultaban en interacciones que nunca finalizaban. Terminamos [removing this API](https://github.com/facebook/react/pull/20037) debido a estos problemas.

Estamos trabajando en una nueva versión de la API de Rastreo de Interacciones (llamada provisionalmente Transition Tracing debido a que se inicia mediante `startTransition`) que resuelve estos problemas.

## Nueva documentación de React {/*new-react-docs*/}

El año pasado, anunciamos la versión beta del nuevo sitio web de documentación de React ([más tarde lanzado como react.dev](/blog/2023/03/16/introducing-react-dev)). Los nuevos materiales de aprendizaje enseñan primero los Hooks y cuentan con nuevos diagramas, ilustraciones, así como muchos ejemplos y desafíos interactivos. Pausamos ese trabajo para centrarnos en el lanzamiento de React 18, pero ahora que React 18 ya está disponible, estamos trabajando activamente para finalizar y lanzar la nueva documentación.

Actualmente estamos redactando una sección detallada sobre los efectos, ya que hemos escuchado que es uno de los temas más desafiantes tanto para usuarios nuevos como experimentados de React. [Sincronizar con Efectos](/learn/synchronizing-with-effects) es la primera página publicada en la serie, y habrá más en las próximas semanas. Cuando comenzamos a escribir una sección detallada sobre los efectos, nos dimos cuenta de que muchos patrones comunes de efectos pueden simplificarse al agregar un nuevo primitivo a React. Hemos compartido algunas ideas iniciales sobre esto en el [useEvent RFC](https://github.com/reactjs/rfcs/pull/220). Actualmente se encuentra en una etapa inicial de investigación y aún estamos iterando sobre la idea. Agradecemos los comentarios de la comunidad hasta ahora sobre el RFC, así como el [feedback](https://github.com/reactjs/react.dev/issues/3308) y contribuciones a la reescritura en curso de la documentación. Queremos agradecer especialmente a [Harish Kumar](https://github.com/harish-sethuraman) por enviar y revisar muchas mejoras en la implementación del nuevo sitio web.

*¡Gracias a [Sophie Alpert](https://twitter.com/sophiebits) por revisar esta publicación del blog!*
