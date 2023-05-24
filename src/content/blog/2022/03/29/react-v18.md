---
title: "React v18.0"
---

29 de marzo de 2022 por [The React Team](/community/team)

---

<Intro>

React 18 ya está disponible en npm! En nuestro último artículo, compartimos instrucciones paso a paso para [actualizar tu aplicación a React 18](/blog/2022/03/08/react-18-upgrade-guide). En este artículo, daremos una descripción general de las novedades en React 18 y lo que significa para el futuro.

</Intro>

---

Nuestra última versión importante incluye mejoras listas para usar, como el procesamiento por lotes automático, nuevas API como startTransition y renderizado en el servidor con transmisión con soporte para Suspense.

Muchas de las características en React 18 se basan en nuestro nuevo renderizador concurrente, un cambio interno que desbloquea nuevas y poderosas capacidades. React Concurrente es opcional, solo se activa cuando se utiliza una característica concurrente, pero creemos que tendrá un gran impacto en la forma en que las personas construyen aplicaciones.

Hemos dedicado años a investigar y desarrollar el soporte para la concurrencia en React, y nos hemos esforzado aún más para ofrecer un camino de adopción gradual para los usuarios existentes. El verano pasado, [formamos el Grupo de Trabajo de React 18](/blog/2021/06/08/the-plan-for-react-18) para recopilar comentarios de expertos en la comunidad y garantizar una experiencia de actualización fluida para todo el ecosistema de React.

En caso de que te lo hayas perdido, compartimos gran parte de esta visión en React Conf 2021.

* En [la presentación principal](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa), explicamos cómo React 18 encaja en nuestra misión de facilitar a los desarrolladores la creación de excelentes experiencias de usuario
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) [demostró cómo utilizar las nuevas características de React 18](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [Shaundai Person](https://twitter.com/shaundai) nos brindó una descripción general del [renderizado en tiempo real en el servidor con Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)

A continuación se muestra una descripción completa de lo que puedes esperar en esta versión, comenzando con el Renderizado Concurrente.

<Note>

Para los usuarios de React Native, React 18 se lanzará en React Native con la Nueva Arquitectura de React Native. Para más información, puedes ver la [presentación oficial de la React Conf aquí](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## Que es React Concurrente? {/*what-is-concurrent-react*/}

La adición más importante en React 18 es algo en lo que esperamos que nunca tengas que pensar: la concurrencia. Creemos que esto es en gran medida cierto para los desarrolladores de aplicaciones, aunque la situación puede ser un poco más complicada para los mantenedores de bibliotecas.

La concurrencia no es una característica en sí misma. Es un nuevo mecanismo detrás de escena que permite a React preparar múltiples versiones de tu interfaz de usuario al mismo tiempo. Puedes pensar en la concurrencia como un detalle de implementación: es valiosa debido a las características que desbloquea. React utiliza técnicas sofisticadas en su implementación interna, como colas de prioridad y múltiples búferes. Pero no verás esos conceptos en ninguna de nuestras APIs públicas.

Cuando diseñamos las APIs, tratamos de ocultar los detalles de implementación a los desarrolladores. Como desarrollador de React, te enfocas en cómo quieres que sea la experiencia del usuario y React se encarga de cómo ofrecer esa experiencia. Por lo tanto, no esperamos que los desarrolladores de React sepan cómo funciona la concurrencia bajo el capó.

Sin embargo, React Concurrente es más importante que un simple detalle de implementación, es una actualización fundamental en el modelo de renderizado central de React. Entonces, aunque no es muy importante saber cómo funciona la concurrencia, puede valer la pena saber qué es a grandes rasgos.

Una propiedad clave de React Concurrente es que el renderizado es interrumpible. Cuando actualizas por primera vez a React 18, antes de agregar cualquier característica concurrente, las actualizaciones se renderizan de la misma manera que en versiones anteriores de React: en una transacción única, sin interrupciones y sincrónica. Con el renderizado sincrónico, una vez que comienza el renderizado de una actualización, nada puede interrumpirlo hasta que el usuario pueda ver el resultado en la pantalla.

En un renderizado concurrente, esto no siempre es el caso. React puede comenzar a renderizar una actualización, pausar en el medio y luego continuar más tarde. Incluso puede abandonar por completo un renderizado en progreso. React garantiza que la interfaz de usuario se mantendrá consistente incluso si se interrumpe un renderizado. Para lograr esto, espera para realizar mutaciones en el DOM hasta el final, una vez que se ha evaluado todo el árbol. Con esta capacidad, React puede preparar nuevas pantallas en segundo plano sin bloquear el hilo principal. Esto significa que la interfaz de usuario puede responder de inmediato a la entrada del usuario incluso si se encuentra en medio de una tarea de renderizado grande, creando una experiencia de usuario fluida.

Otro ejemplo es el estado reutilizable. React Concurrente puede eliminar secciones de la interfaz de usuario de la pantalla y luego agregarlas nuevamente más tarde, reutilizando el estado anterior. Por ejemplo, cuando un usuario cambia de pestaña en una pantalla y vuelve, React debería poder restaurar la pantalla anterior en el mismo estado en el que se encontraba antes. En una próxima versión menor, planeamos agregar un nuevo componente llamado `<Offscreen>` que implementa este patrón. Del mismo modo, podrás utilizar Offscreen para preparar una nueva interfaz de usuario en segundo plano para que esté lista antes de que el usuario la revele.

El renderizado concurrente es una poderosa herramienta nueva en React y la mayoría de nuestras nuevas características están diseñadas para aprovecharla, incluyendo Suspense, transiciones y renderizado en tiempo real en el servidor. Pero React 18 es solo el comienzo de lo que buscamos construir sobre esta nueva base.

## Adoptando Gradualmente las Características Concurrentes {/*gradually-adopting-concurrent-features*/}

Técnicamente, el renderizado concurrente es un cambio disruptivo. Debido a que el renderizado concurrente es interrumpible, los componentes se comportan de manera ligeramente diferente cuando está habilitado.

En nuestras pruebas, hemos actualizado miles de componentes a React 18. Lo que hemos encontrado es que casi todos los componentes existentes "simplemente funcionan" con el renderizado concurrente, sin necesidad de realizar cambios. Sin embargo, algunos de ellos pueden requerir un esfuerzo adicional de migración. Aunque los cambios suelen ser pequeños, aún tienes la capacidad de hacerlos a tu propio ritmo. El nuevo comportamiento de renderizado en React 18 **solo se activa en las partes de tu aplicación que utilizan nuevas características.**

La estrategia general de actualización consiste en hacer que tu aplicación funcione con React 18 sin romper el código existente. Luego, puedes comenzar gradualmente a agregar características concurrentes a tu propio ritmo. Puedes utilizar [`<StrictMode>`](/reference/react/StrictMode) para ayudar a detectar errores relacionados con la concurrencia durante el desarrollo. Strict Mode no afecta el comportamiento en producción, pero durante el desarrollo mostrará advertencias adicionales y duplicará la invocación de funciones que se espera que sean idempotentes. No detectará todo, pero es efectivo para prevenir los errores más comunes.

Después de actualizar a React 18, podrás comenzar a utilizar características concurrentes de inmediato. Por ejemplo, puedes utilizar startTransition para navegar entre pantallas sin bloquear la entrada del usuario. O usar useDeferredValue para limitar la frecuencia de las costosas re-renderizaciones.

Sin embargo, a largo plazo, esperamos que la forma principal de agregar concurrencia a tu aplicación sea utilizando una biblioteca o marco de trabajo compatible con la concurrencia. En la mayoría de los casos, no interactuarás directamente con las APIs concurrentes. Por ejemplo, en lugar de que los desarrolladores llamen a startTransition cada vez que naveguen a una nueva pantalla, las bibliotecas de enrutamiento envolverán automáticamente las navegaciones en startTransition.

Puede llevar algún tiempo que las bibliotecas se actualicen para ser compatibles con la concurrencia. Hemos proporcionado nuevas APIs para facilitar a las bibliotecas aprovechar las características concurrentes. Mientras tanto, te pedimos paciencia con los mantenedores mientras trabajamos en la migración gradual del ecosistema de React.

Para obtener más información, consulta nuestra publicación anterior: [Como actualizar a React 18](/blog/2022/03/08/react-18-upgrade-guide).

## Suspense in Data Frameworks {/*suspense-in-data-frameworks*/}

En React 18, puedes comenzar a usar [Suspense](/reference/react/Suspense) para la obtención de datos en frameworks frecuentes como Relay, Next.js, Hydrogen, or Remix. La obtención ad hoc de datos con Suspense es técnicamente posible, pero aún no se recomienda como una estrategia general.

En el futuro, es posible que expongamos primitivas adicionales que faciliten el acceso a tus datos con Suspense, tal vez sin necesidad de utilizar un marco de trabajo opinionado. Sin embargo, Suspense funciona mejor cuando está profundamente integrado en la arquitectura de tu aplicación: en tu enrutador, en tu capa de datos y en tu entorno de renderizado en el servidor. Por lo tanto, incluso a largo plazo, esperamos que las bibliotecas y marcos de trabajo desempeñen un papel crucial en el ecosistema de React.

Al igual que en versiones anteriores de React, también puedes utilizar Suspense para el fragmento de código en el cliente con React.lazy. Pero nuestra visión de Suspense siempre ha sido mucho más que cargar código; el objetivo es ampliar el soporte para Suspense para que eventualmente, el mismo fallback declarativo de Suspense pueda manejar cualquier operación asíncrona (carga de código, datos, imágenes, etc.)

## Server Components Está aún en Desarrollo {/*server-components-is-still-in-development*/}

[**Server Components**](/blog/2020/12/21/data-fetching-with-react-server-components) es una característica próxima que permite a los desarrolladores crear aplicaciones que abarcan el servidor y el cliente, combinando la interactividad completa de las aplicaciones del lado del cliente con el rendimiento mejorado del renderizado tradicional en el servidor. Server Components no está inherentemente vinculado a Concurrent React, pero está diseñado para funcionar mejor con características concurrentes como Suspense y el renderizado en el servidor en streaming.

Server Components todavía está en fase experimental, pero esperamos lanzar una versión inicial en una versión menor de 18.x. Mientras tanto, estamos trabajando con frameworks como Next.js, Hydrogen y Remix para avanzar en la propuesta y prepararla para su adopción generalizada.

## Que Hay De Nuevo en React 18 {/*whats-new-in-react-18*/}

### Nueva Función: Agrupación Automática {/*new-feature-automatic-batching*/}

La agrupación (batching) es cuando React agrupa múltiples actualizaciones de estado en una sola re-renderización para mejorar el rendimiento. Sin la agrupación automática, solo se agrupaban las actualizaciones dentro de los controladores de eventos de React. Las actualizaciones dentro de promesas, setTimeout, controladores de eventos nativos u otros eventos no se agrupaban automáticamente en React por defecto. Con la agrupación automática, estas actualizaciones se agruparán automáticamente:


```js
// Antes: solo los eventos de React se agrupaban.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React se renderizará dos veces, una vez por cada actualización de estado (sin agrupación).
}, 1000);
// Después: las actualizaciones dentro de timeouts, promesas,
// controladores de eventos nativos o cualquier otro evento se agrupan.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React solo se volverá a renderizar una vez al final (¡eso es agrupación!).
}, 1000);
```

Para más información, consulta este artículo sobre la [agrupación automática para reducir las re-renderizaciones en React 18](https://github.com/reactwg/react-18/discussions/21).

### Nueva Característica: Trancisiones {/*new-feature-transitions*/}

Una transición es un nuevo concepto en React para distinguir entre actualizaciones urgentes y no-urgentes.

* **Actualizaciones urgentes** reflejan interacción directa, como escribir, hacer click, presionar, y así sucesivamente.
* **Actualizaciones de transición** permiten la transición de la interfaz de usuario de una vista a otra.

Las actualizaciones urgentes como escribir, hacer clic o presionar requieren una respuesta inmediata para coincidir con nuestras intuiciones sobre cómo se comportan los objetos físicos. De lo contrario, se sienten "incorrectas". Sin embargo, las transiciones son diferentes porque el usuario no espera ver cada valor intermedio en la pantalla.

Por ejemplo, cuando seleccionas un filtro en un menú desplegable, esperas que el propio botón del filtro responda de inmediato cuando haces clic. Sin embargo, los resultados reales pueden transicionar por separado. Un pequeño retraso sería imperceptible y a menudo esperado. Y si cambias el filtro nuevamente antes de que los resultados terminen de renderizarse, solo te importará ver los últimos resultados.

Típicamente, para tener la mejor experiencia de usuario, una única entrada del usuario debería resultar en una actualización urgente y otra no urgente. Puedes utilizar la API startTransition dentro de un evento de entrada para informar a React qué actualizaciones son urgentes y cuáles son "transiciones":


```js
import { startTransition } from 'react';

// Urgente: Mostrar lo que se escribió
setInputValue(input);

// Marcar cualquier actualización de estado dentro como transiciones
startTransition(() => {
  // Transición: muestra el resultado
  setSearchQuery(input);
});
```


Las actualizaciones envueltas en startTransition se manejan como no urgentes y se interrumpirán si llegan actualizaciones más urgentes, como clics o pulsaciones de teclas. Si una transición se interrumpe por el usuario (por ejemplo, al escribir varios caracteres seguidos), React descartará el trabajo de renderizado obsoleto que no se completó y solo renderizará la última actualización.

* `useTransition`: un gancho (hook) para iniciar transiciones, que incluya un valor para rastrear el estado pendiente.
* `startTransition`: un método para iniciar transiciones cuando el gancho (hook) no es utilizado.

(Las transiciones optarán por el renderizado concurrente, lo cual permite interrumpir la actualización. Si el contenido se suspende de nuevo, las transiciones también indican a React que continúe mostrando el contenido actual mientras renderiza el contenido de la transición en segundo plano. Consulta [Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) para obtener más información).

[Consulta la documentación de transiciones aquí](/reference/react/useTransition).

### Nuevas Características Suspense {/*new-suspense-features*/}

Suspense te permite especificar declarativamente el estado de carga para una parte del árbol de componentes si aún no está listo para mostrarse:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```
Suspense convierte el "estado de carga de la interfaz de usuario" en un concepto declarativo de primera clase en el modelo de programación de React. Esto nos permite construir características de nivel superior sobre él.

Introdujimos una versión limitada de Suspense hace varios años. Sin embargo, el único caso de uso compatible era la división de código con React.lazy, y no se admitía en absoluto al renderizar en el servidor.

En React 18, hemos agregado soporte para Suspense en el servidor y hemos ampliado sus capacidades utilizando funciones de renderizado concurrente.

Suspense en React 18 funciona mejor cuando se combina con la API de transición. Si suspendes durante una transición, React evitará que el contenido ya visible sea reemplazado por un respaldo. En su lugar, React retrasará el renderizado hasta que se haya cargado suficiente información para evitar un mal estado de carga.

Para más información, consulta el RFC para [Suspense en React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md).

### Nuevas API de Renderizado en Cliente y Servidor {/*new-client-and-server-rendering-apis*/}

En esta versión, aprovechamos la oportunidad para rediseñar las API que exponemos para el renderizado en el cliente y en el servidor. Estos cambios permiten a los usuarios seguir utilizando las antiguas API en el modo React 17 mientras actualizan a las nuevas API en React 18.

#### Cliente React DOM {/*react-dom-client*/}

Estas nuevas API son exportadas desde `react-dom/client`:

* `createRoot`: Nuevo metodo para crear un root para `render`(renderizar) o `unmount` (desmontar). Usalo en lugar de `ReactDOM.render`. Las nuevas características en React 18 no funcionan sin él.
* `hydrateRoot`: Nuevo método para hidratar una aplicación renderizada en el servidor. Úsalo en lugar de `ReactDOM.hydrate` en conjunto con las nuevas API de React DOM Server. Las nuevas características en React 18 no funcionan sin él.

Tanto `createRoot` como `hydrateRoot` aceptan una nueva opción llamada `onRecoverableError` en el caso de que necesites ser notificado cuando React recupere errores durante el renderizado o la hidratación para el registro. Por defecto, React usará [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError), o `console.error` en navegadores antiguos.

[Consulta la documentación de Cliente React DOM aquí](/reference/react-dom/client).

#### Servidor React DOM {/*react-dom-server*/}

Estas nuevas APIs son exportadas desde `react-dom/server` y tienen soporte completo para Suspense en el servidor:
* `renderToPipeableStream`: para transmisión en entornos de Node
* `renderToReadableStream`: para entornos de tiempo de ejecución modernos, como Deno y Cloudflare workers.

El método existente `renderToString` sigue en funcionamiento, pero se desaconseja su uso.

[Consulta la documentación de Servidor React DOM aquí](/reference/react-dom/server).

### Nuevos Comportamientos del Modo Estricto {/*new-strict-mode-behaviors*/}

En el futuro, nos gustaría agregar una función que permita a React agregar y eliminar secciones de la interfaz de usuario mientras se preserva el estado. Por ejemplo, cuando un usuario cambia de pestaña y vuelve, React debería poder mostrar inmediatamente la pantalla anterior. Para lograr esto, React desmontaría y volvería a montar los árboles utilizando el mismo estado del componente como antes.

Esta característica proporcionará un mejor rendimiento por defecto en las aplicaciones de React, pero requiere que los componentes sean resistentes a que los efectos se monten y destruyan varias veces. La mayoría de los efectos funcionarán sin cambios, pero algunos efectos asumen que solo se montan o destruyen una vez.

Para ayudar a detectar estos problemas, React 18 introduce una nueva verificación exclusiva para el modo estricto en el entorno de desarrollo. Esta nueva verificación desmontará y volverá a montar automáticamente cada componente cuando se monte por primera vez, restaurando el estado anterior en el segundo montaje.

Antes de este cambio, React montaba el componente y creaba los efectos:

```
* React monta el componente.
  * Se crean los efectos de diseño (layout effects).
  * Se crean los efectos.
```


Con el modo estricto (Strict Mode) en React 18, React simulará el desmontaje y remontaje del componente en modo de desarrollo:

```
* React monta el componente.
  * Se crean los efectos de diseño (layout effects).
  * Se crean los efectos.
* React simula el desmontaje del componente.
  * Se destruyen los efectos de diseño (layout effects).
  * Se destruyen los efectos.
* React simula el montaje del components con el estado anterior.
  * Se crean los efectos de diseño (layout effects).
  * Se crean los efectos.
```

[Consulta la documentación sobre cómo garantizar el estado reutilizable aquí](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### Nuevos Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId` es un nuevo gancho (hook) para generar IDs unicos tanto en el cliente como en el servidor, evitando desajustes en la hidratación. Es especialmente útil para bibliotecas de componentes que se integran con API de accesibilidad que requieren identificadores únicos. Esto resuelve un problema que ya existe en React 17 y versiones anteriores, pero es aún más importante en React 18 debido a cómo el nuevo renderizador de servidor en streaming entrega el HTML sin un orden específico. [Consulta la documentación](/reference/react/useId).

> Note
>
> `useId` **no está** diseñado para generar [llaves en una lista](/learn/rendering-lists#where-to-get-your-key). Las llaves deben ser generadas a partir de tus datos.

#### useTransition {/*usetransition*/}

`useTransition` y `startTransition` te permiten marcar algunas actualizaciones de estado como no urgentes. Otras actualizaciones de estado se consideran urgentes de manera predeterminada. React permitirá que las actualizaciones de estado urgentes (por ejemplo, actualizar un campo de texto) interrumpan las actualizaciones de estado no urgentes (por ejemplo, renderizar una lista de resultados de búsqueda). [Consulta la documentación aquí](/reference/react/useTransition)

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` te permite posponer el re-renderizado de una parte no urgente del árbol. Es similar a la técnica de debounce, pero tiene algunas ventajas en comparación con esta. No hay un retraso de tiempo fijo, por lo que React intentará el renderizado diferido justo después de que el primer renderizado se refleje en la pantalla. El renderizado diferido es interrumpible y no bloquea la entrada del usuario. [Consulta la documentación aquí](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` es un nuevo hook que permite a las tiendas externas admitir lecturas concurrentes al forzar que las actualizaciones de la tienda sean síncronas. Elimina la necesidad de usar useEffect al implementar suscripciones a fuentes de datos externas, y se recomienda para cualquier biblioteca que se integre con un estado externo a React. [Consulte la documentación aquí](/reference/react/useSyncExternalStore).

> Note
>
> `useSyncExternalStore` está destinado a ser utilizado por bibliotecas, no por el código de aplicación.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect`  es un nuevo hook que permite a las bibliotecas de CSS-in-JS abordar problemas de rendimiento al inyectar estilos durante el renderizado. A menos que ya hayas construido una biblioteca de CSS-in-JS, no esperamos que nunca lo utilices. Este hook se ejecutará después de que el DOM haya sido mutado, pero antes de que los efectos de diseño (layout effects) lean el nuevo diseño. Esto resuelve un problema que ya existe en React 17 y versiones anteriores, pero es aún más importante en React 18 porque React cede al navegador durante el renderizado concurrente, dándole la oportunidad de recalcular el diseño. [Consulta la documentación aquí](/reference/react/useInsertionEffect).

> Note
>
> `useInsertionEffect` está destinado a ser utilizado por bibliotecas, no por el código de aplicación.

## Cómo Actualizar {/*how-to-upgrade*/}

Consulta [Cómo Actualizar a React 18](/blog/2022/03/08/react-18-upgrade-guide) para obtener instrucciones paso a paso y una lista completa de cambios significativos y trascendentales.

## Changelog (Registro de Cambios) {/*changelog*/}

### React {/*react*/}

* Añadido `useTransition` y `useDeferredValue` para separar las actualizaciones urgentes de las transiciones. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) por [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), y [@sebmarkbage](https://github.com/sebmarkbage))
* Añadido `useId` para generar IDs únicos. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) por [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), y [@sebmarkbage](https://github.com/sebmarkbage))
* Añadido `useSyncExternalStore` para ayudar a liberías de tiendas externas a integrarse con React. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) por [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), y [@drarmstr](https://github.com/drarmstr))
* Añadido `startTransition` como una versión de `useTransition` sin comentarios pendientes.([#19696](https://github.com/facebook/react/pull/19696) por [@rickhanlonii](https://github.com/rickhanlonii))
* Añadido `useInsertionEffect` para librerías CSS-en-JS. ([#21913](https://github.com/facebook/react/pull/21913)  por [@rickhanlonii](https://github.com/rickhanlonii))
* Hecho que Suspense remonte los efectos de diseño cuando el contenido vuelve a aparecer.([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) por [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), y [@lunaruan](https://github.com/lunaruan))
* Hecho que `<StrictMode>`  vuelva a ejecutar los efectos para verificar el estado restaurable. ([#19523](https://github.com/facebook/react/pull/19523) , [#21418](https://github.com/facebook/react/pull/21418)  por [@bvaughn](https://github.com/bvaughn) y [@lunaruan](https://github.com/lunaruan))
* Se asume que los Symbols siempre están disponibles. ([#23348](https://github.com/facebook/react/pull/23348)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Removido `object-assign` polyfill. ([#23351](https://github.com/facebook/react/pull/23351)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Removida la API `unstable_changedBits` incompatible.  ([#20953](https://github.com/facebook/react/pull/20953)  por [@acdlite](https://github.com/acdlite))
* Permitido a los componentes renderizar undefined. ([#21869](https://github.com/facebook/react/pull/21869) por [@rickhanlonii](https://github.com/rickhanlonii))
* Sincronizada la ejecución de `useEffect` generada por eventos discretos como los clics.([#21150](https://github.com/facebook/react/pull/21150)  por [@acdlite](https://github.com/acdlite))
* Ahora, Suspense `fallback={undefined}` se comporta de la misma manera que `null` y se ignora. ([#21854](https://github.com/facebook/react/pull/21854)  por [@rickhanlonii](https://github.com/rickhanlonii))
* Considerar que todas las llamadas a `lazy()`  que resuelven al mismo componente sean equivalentes. ([#20357](https://github.com/facebook/react/pull/20357)  por [@sebmarkbage](https://github.com/sebmarkbage))
* No realizar cambios en la consola durante el primer renderizado ([#22308](https://github.com/facebook/react/pull/22308) por [@lunaruan](https://github.com/lunaruan))
* Mejorado el uso de memoria ([#21039](https://github.com/facebook/react/pull/21039)  por [@bgirard](https://github.com/bgirard))
* Improve messages if string coercion throws (Temporal.*, Symbol, etc.) ([#22064](https://github.com/facebook/react/pull/22064)  por [@justingrant](https://github.com/justingrant))
* Utilizar `setImmediate` cuando este disponible en lugar de `MessageChannel`. ([#20834](https://github.com/facebook/react/pull/20834)  por [@gaearon](https://github.com/gaearon))
* Corregir la falta de propagación del contexto dentro de árboles suspendidos. ([#23095](https://github.com/facebook/react/pull/23095)  por [@gaearon](https://github.com/gaearon))
* Corregir el uso incorrecto de props observado por `useReducer` al eliminar el mecanismo de salida anticipada. ([#22445](https://github.com/facebook/react/pull/22445)  por [@josephsavona](https://github.com/josephsavona))
* Corregir `setState` que resultaba ignorado en Safari cuando se agregaban iframes. ([#23111](https://github.com/facebook/react/pull/23111)  por [@gaearon](https://github.com/gaearon))
* Corregir un choque cuando se renderiza `ZonedDateTime` en el árbol. ([#20617](https://github.com/facebook/react/pull/20617)  por [@dimaqq](https://github.com/dimaqq))
* Corregir un choque cuando el document es pasado a `null` en los tests. ([#22695](https://github.com/facebook/react/pull/22695)  por [@SimenB](https://github.com/SimenB))
* Corregir que `onLoad` no se activa cuando las características concurrentes están activadas ([#23316](https://github.com/facebook/react/pull/23316)  por [@gnoff](https://github.com/gnoff))
* Corregir una advertencia cuando el selector retorna `NaN`.  ([#23333](https://github.com/facebook/react/pull/23333)  por [@hachibeeDI](https://github.com/hachibeeDI))
* Corregir un choque cuando el documento es pasado a `null` en los tests. ([#22695](https://github.com/facebook/react/pull/22695) por [@SimenB](https://github.com/SimenB))
* Corregir el encabezado de licencia generado. ([#23004](https://github.com/facebook/react/pull/23004)  por [@vitaliemiron](https://github.com/vitaliemiron))
* Añadir `package.json` como uno de los puntos de entrada. ([#22954](https://github.com/facebook/react/pull/22954)  por [@Jack](https://github.com/Jack-Works))
* Permitir la suspensión fuera de un límite de Suspense. ([#23267](https://github.com/facebook/react/pull/23267)  por [@acdlite](https://github.com/acdlite))
* Log a recoverable error whenever hydration fails. ([#23319](https://github.com/facebook/react/pull/23319)  por [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* Añadir `createRoot` y `hydrateRoot`. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) por [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), y [@sebmarkbage](https://github.com/sebmarkbage))
* Añadir hidratación selectiva. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) por [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), y [@sebmarkbage](https://github.com/sebmarkbage))
* Añadir `aria-description` a la lista de atributos ARIA conocidos. ([#22142](https://github.com/facebook/react/pull/22142)  por [@mahyareb](https://github.com/mahyareb))
* Añadir el evento `onResize` para elementos de video. ([#21973](https://github.com/facebook/react/pull/21973)  por [@rileyjshaw](https://github.com/rileyjshaw))
* Añadir `imageSizes` y `imageSrcSet` a propiedades conocidas. ([#22550](https://github.com/facebook/react/pull/22550)  por [@eps1lon](https://github.com/eps1lon))
* Permitir hijos de tipo `<option>` no string si es proporcionado el `value`.  ([#21431](https://github.com/facebook/react/pull/21431)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Arreglar el estilo de `aspectRatio` que no se aplica. ([#21100](https://github.com/facebook/react/pull/21100)  por [@gaearon](https://github.com/gaearon))
* Advertir si se llama a `renderSubtreeIntoContainer`. ([#23355](https://github.com/facebook/react/pull/23355)  por [@acdlite](https://github.com/acdlite))

### Servidor React DOM {/*react-dom-server-1*/}

* Añadir un nuevo renderizado de transmisión. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) por [@sebmarkbage](https://github.com/sebmarkbage))
* Arreglar los proveedores de contexto en SSR cuando se manejan multiples pedidos. ([#23171](https://github.com/facebook/react/pull/23171)  por [@frandiox](https://github.com/frandiox))
* Revertir a la renderización del cliente en el caso de que haya una discrepancia de texto. ([#23354](https://github.com/facebook/react/pull/23354)  por [@acdlite](https://github.com/acdlite))
* Deprecar `renderToNodeStream`. ([#23359](https://github.com/facebook/react/pull/23359)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Corregir un registro de error espurio en el nuevo renderizador del servidor. ([#24043](https://github.com/facebook/react/pull/24043)  por [@eps1lon](https://github.com/eps1lon))
* Corregir un problema en el nuevo renderizado del servidor. ([#22617](https://github.com/facebook/react/pull/22617)  por [@shuding](https://github.com/shuding))
* Ignorar los valores de símbolos y funcion dentro de los elementos personalizados en el servidor. ([#21157](https://github.com/facebook/react/pull/21157)  por [@sebmarkbage](https://github.com/sebmarkbage))

### Utilidades de Pruebas React DOM {/*react-dom-test-utils*/}

* Lanzar error cuando se usa `act` en producción. ([#21686](https://github.com/facebook/react/pull/21686)  por [@acdlite](https://github.com/acdlite))
* Soporte para deshabilitar las advertencias espurias con `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/facebook/react/pull/22561)  por [@acdlite](https://github.com/acdlite))
* Expandir las advertencias act para cubrir todas las APIs que podrían crear trabajo en React. ([#22607](https://github.com/facebook/react/pull/22607)  por [@acdlite](https://github.com/acdlite))
* Hacer agrupamientos de actualizaciones `act`. ([#21797](https://github.com/facebook/react/pull/21797)  por [@acdlite](https://github.com/acdlite))
* Remover advertencias por effectos pasivos colgados. ([#22609](https://github.com/facebook/react/pull/22609)  por [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Hacer seguimiento de los roots montados tarde en Fast Refresh. ([#22740](https://github.com/facebook/react/pull/22740)  por [@anc95](https://github.com/anc95))
* Añadir el campo `exports` en `package.json`. ([#23087](https://github.com/facebook/react/pull/23087)  por [@otakustay](https://github.com/otakustay))

### Componentes del Servidor (Experimental) {/*server-components-experimental*/}

* Añadir soporte a Server Context. ([#23244](https://github.com/facebook/react/pull/23244)  por [@salazarm](https://github.com/salazarm))
* Añadir soporte a `lazy`. ([#24068](https://github.com/facebook/react/pull/24068)  por [@gnoff](https://github.com/gnoff))
* Actualizar insersiones de webpack para webpack 5 ([#22739](https://github.com/facebook/react/pull/22739)  por [@michenly](https://github.com/michenly))
* Corregir un error en el cargador de Node. ([#22537](https://github.com/facebook/react/pull/22537)  por [@btea](https://github.com/btea))
* Usar `globalThis` en lugar de `window` para entornos de borde. ([#22777](https://github.com/facebook/react/pull/22777)  por [@huozhi](https://github.com/huozhi))

