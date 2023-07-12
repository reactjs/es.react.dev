---
title: "Cómo actualizar a React 18"
---

8 de marzo de 2022 por [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

Como compartimos en la publicación de lanzamiento, React 18 introduce características impulsadas por nuestro nuevo renderizador concurrente, con una estrategia de adopción gradual para aplicaciones existentes. En esta publicación, te guiaremos a través de los pasos para actualizar a React 18.

Por favor, informa cualquier problema que encuentres durante la actualización a React 18.

</Intro>

<Note>

Para los usuarios de React Native, React 18 se lanzará en una versión futura de React Native. Esto se debe a que React 18 depende de la nueva arquitectura de React Native para beneficiarse de las nuevas capacidades presentadas en esta publicación del blog. Para obtener más información, consulta el discurso principal de React Conf aquí.

</Note>

## Instalación {/*installing*/}

Para instalar la última versión de React:

```bash
npm install react react-dom
```

O si estás usando yarn:

```bash
yarn add react react-dom
```

## Actualizaciones en las API de renderizado en el cliente {/*updates-to-client-rendering-apis*/}

Cuando instales React 18 por primera vez, verás una advertencia en la consola:

<ConsoleBlock level="error">

ReactDOM.render ya no es compatible en React 18. Usa createRoot en su lugar. Hasta que cambies a la nueva API, tu aplicación se comportará como si estuviera ejecutando React 17. Más información: [enlace](https://reactjs.org/link/switch-to-createroot)

</ConsoleBlock>

React 18 introduce una nueva API de raíz que proporciona una mejor ergonomía para administrar las raíces. La nueva API de raíz también habilita el nuevo renderizador concurrente, que te permite optar por las características concurrentes.

```js
// Antes
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// Después
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) si usas TypeScript
root.render(<App tab="home" />);
```

También hemos cambiado unmountComponentAtNode a root.unmount:

```js
// Antes
unmountComponentAtNode(container);

// Después
root.unmount();
```

También hemos eliminado la devolución de llamada de render, ya que generalmente no tiene el resultado esperado cuando se usa Suspense:

```js
// Antes
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// Después
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

No hay un reemplazo directo de la antigua API de devolución de llamada de renderización, depende de tu caso de uso. Consulta la publicación del grupo de trabajo para [Reemplazar el renderizado con createRoot](https://github.com/reactwg/react-18/discussions/5) para obtener más información.

</Note>

Finalmente, si tu aplicación utiliza renderizado del lado del servidor con hidratación, actualiza `hydrate` a `hydrateRoot`:

```js
// Antes
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// Después
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// A diferencia de `createRoot`, aquí no necesitas llamar a `root.render()` por separado.
```

Para obtener más información, consulta la discusión del grupo de trabajo aquí.

<Note>

Si tu aplicación deja de funcionar después de la actualización, verifica si está envuelta en `<StrictMode>`. Strict Mode se ha vuelto más estricto en React 18, y es posible que no todos tus componentes sean resistentes a las nuevas comprobaciones que agrega en el modo de desarrollo. Si al quitar Strict Mode se soluciona el problema de tu aplicación, puedes eliminarlo durante la actualización y luego agregarlo nuevamente (ya sea en la parte superior o para una parte del árbol) después de corregir los problemas que señala.

</Note>

## Actualizaciones de las API de Renderizado del Servidor {/*actualizaciones-de-las-api-de-renderizado-del-servidor*/}

En esta versión, estamos renovando nuestras API de `react-dom/server` para admitir por completo Suspense en el servidor y el renderizado de transmisión. Como parte de estos cambios, estamos deprecando la antigua API de transmisión de nodo (`Node streaming API`), que no admite la transmisión incremental de Suspense en el servidor.

El uso de esta API ahora mostrará una advertencia:

`renderToNodeStream`: **Deprecado ⛔️️**

En su lugar, para transmisión en entornos Node, usa:

`renderToPipeableStream`: **Nuevo ✨**

También estamos introduciendo una nueva API para admitir el renderizado de transmisión con Suspense en entornos de tiempo de ejecución de vanguardia, como Deno y Cloudflare Workers:

`renderToReadableStream`: **Nuevo ✨**

Las siguientes API seguirán funcionando, pero con soporte limitado para Suspense:

`renderToString`: **Limitado ⚠️**
`renderToStaticMarkup`: **Limitado ⚠️**

Finalmente, esta API seguirá funcionando para el renderizado de correos electrónicos:

`renderToStaticNodeStream`

Para obtener más información sobre los cambios en las API de renderizado en el servidor, consulta la publicación del grupo de trabajo sobre [Actualización a React 18 en el servidor](https://github.com/reactwg/react-18/discussions/22), una [inmersión profunda en la nueva arquitectura de Suspense SSR](https://github.com/reactwg/react-18/discussions/37) y la charla de [Shaundai Person](https://twitter.com/shaundai) sobre [Renderizado en el servidor en tiempo real con Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) en React Conf 2021.

## Actualizaciones de las Definiciones de TypeScript {/*actualizaciones-de-las-definiciones-de-typescript*/}

Si tu proyecto utiliza TypeScript, deberás actualizar las dependencias de `@types/react` y `@types/react-dom` a las últimas versiones. Los nuevos tipos son más seguros y detectan problemas que solían ser ignorados por el comprobador de tipos. El cambio más notable es que ahora es necesario listar explícitamente la propiedad `children` al definir props, por ejemplo:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

Consulta la [solicitud de extracción de typings de React 18](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) para obtener una lista completa de cambios solo en tipos. Enlaza a ejemplos de correcciones en los tipos de biblioteca para que puedas ver cómo ajustar tu código. Puedes utilizar el [script de migración automatizada](https://github.com/eps1lon/types-react-codemod) para ayudar a adaptar más rápidamente el código de tu aplicación a los nuevos y más seguros typings.

Si encuentras un error en los typings, por favor [envía un informe](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package) en el repositorio de DefinitelyTyped.

## Batching automático {/*automatic-batching*/}

React 18 agrega mejoras de rendimiento incorporadas realizando más agrupaciones de actualizaciones automáticamente. La agrupación (batching) es cuando React agrupa múltiples actualizaciones de estado en una sola re-renderización para mejorar el rendimiento. Antes de React 18, solo se agrupaban las actualizaciones dentro de los controladores de eventos de React. Las actualizaciones dentro de promesas, setTimeout, controladores de eventos nativos u otros eventos no se agrupaban en React de forma predeterminada:

Antes de React 18, solo se agrupaban los eventos de React:

```js
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React solo volverá a renderizar una vez al final (¡eso es agrupación!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React renderizará dos veces, una vez por cada actualización de estado (sin agrupación)
}, 1000);
```

A partir de React 18 y con `createRoot`, todas las actualizaciones se agruparán automáticamente, sin importar su origen. Esto significa que las actualizaciones dentro de `setTimeout`, promesas, controladores de eventos nativos u otros eventos se agruparán de la misma manera que las actualizaciones dentro de eventos de React:

Después de React 18, las actualizaciones dentro de `setTimeout`, promesas, controladores de eventos nativos u otros eventos se agrupan:

```js
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React solo volverá a renderizar una vez al final (¡eso es agrupación!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React solo volverá a renderizar una vez al final (¡eso es agrupación!)
}, 1000);
```

Este es un cambio que rompe la compatibilidad, pero esperamos que resulte en menos trabajo de renderización y, por lo tanto, en un mejor rendimiento en tus aplicaciones. Si deseas desactivar la agrupación automática, puedes utilizar `flushSync`:

```javascript
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React ya ha actualizado el DOM en este punto
  flushSync(() => {
    setFlag(f => !f);
  });
  // React ya ha actualizado el DOM en este punto
}
```

Para obtener más información, consulta la [explicación detallada sobre la batching automático](https://github.com/reactwg/react-18/discussions/21).

## Nuevas API para bibliotecas {/*new-apis-for-libraries*/}

En el Grupo de Trabajo de React 18, trabajamos con los

 mantenedores de bibliotecas para crear nuevas API necesarias para admitir la representación concurrente en casos de uso específicos de las bibliotecas, como estilos y almacenes externos. Para admitir React 18, algunas bibliotecas deberán cambiar a una de las siguientes API:

- `useSyncExternalStore` es un nuevo hook que permite a los almacenes externos admitir lecturas concurrentes forzando que las actualizaciones del almacén sean síncronas. Esta nueva API se recomienda para cualquier biblioteca que se integre con el estado externo a React. Para obtener más información, consulta la publicación general y los detalles de la API de `useSyncExternalStore`.

- `useInsertionEffect` es un nuevo hook que permite a las bibliotecas de CSS-in-JS abordar problemas de rendimiento al inyectar estilos en la representación. A menos que ya hayas creado una biblioteca de CSS-in-JS, no esperamos que uses esto. Este hook se ejecutará después de que el DOM haya sufrido mutaciones, pero antes de que los efectos de diseño lean el nuevo diseño. Esto soluciona un problema que ya existía en React 17 y versiones anteriores, pero es aún más importante en React 18 porque React le da prioridad al navegador durante la representación concurrente, lo que le permite volver a calcular el diseño. Para obtener más información, consulta la [Guía de actualización de bibliotecas para `<style>`](https://github.com/reactwg/react-18/discussions/110).

React 18 también introduce nuevas API para la representación concurrente, como `startTransition`, `useDeferredValue` y `useId`, de las cuales compartimos más detalles en la publicación de lanzamiento.

## Actualizaciones en Strict Mode {/*updates-to-strict-mode*/}

En el futuro, nos gustaría agregar una función que permita a React agregar y eliminar secciones de la interfaz de usuario mientras se conserva el estado. Por ejemplo, cuando un usuario cambia de pestaña en una pantalla y regresa, React debería mostrar de inmediato la pantalla anterior. Para lograr esto, React desmontaría y volvería a montar árboles utilizando el mismo estado de componente que antes.

Esta función brindará un mejor rendimiento por defecto en React, pero requiere que los componentes sean resistentes a que los efectos se monten y desmonten varias veces. La mayoría de los efectos funcionarán sin cambios, pero algunos efectos asumen que solo se montan o desmontan una vez.

Para ayudar a detectar estos problemas, React 18 introduce una nueva verificación solo para desarrollo en Strict Mode. Esta nueva verificación desmontará y volverá a montar automáticamente cada componente cuando un componente se monte por primera vez, restaurando el estado anterior en el segundo montaje.

Antes de este cambio, React montaba el componente y creaba los efectos:

```
* React monta el componente.
    * Se crean los efectos de diseño.
    * Se crean los efectos de efecto.
```

Con Strict Mode en React 18, React simula el desmontaje y remontaje del componente en modo de desarrollo:

```
* React monta el componente.
    * Se crean los efectos de diseño.
    * Se crean los efectos de efecto.
* React simula el desmontaje del componente.
    * Se destruyen los efectos de diseño.
    * Se destruyen los efectos de efecto.
* React simula el montaje del componente con el estado anterior.
    * Se ejecuta el código de configuración del efecto
 de diseño.
    * Se ejecuta el código de configuración del efecto de efecto.
```

Para obtener más información, consulta las publicaciones del grupo de trabajo sobre Agregar estado reutilizable a StrictMode y Cómo admitir estado reutilizable en efectos.

## Configuración de tu entorno de pruebas {/*configuring-your-testing-environment*/}

Cuando actualices tus pruebas para usar `createRoot`, es posible que veas esta advertencia en la consola de pruebas:

<ConsoleBlock level="error">

La configuración actual del entorno de pruebas no admite act(…)

</ConsoleBlock>

Para solucionarlo, establece `globalThis.IS_REACT_ACT_ENVIRONMENT` en `true` antes de ejecutar tu prueba:

```js
// En tu archivo de configuración de pruebas
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

El propósito de esta marca es indicarle a React que se está ejecutando en un entorno similar a una prueba unitaria. React mostrará advertencias útiles si olvidas envolver una actualización con `act`.

También puedes establecer la marca en `false` para indicarle a React que no se necesita `act`. Esto puede ser útil para pruebas de extremo a extremo que simulan un entorno completo de navegador.

Eventualmente, esperamos que las bibliotecas de pruebas configuren esto automáticamente. Por ejemplo, la próxima versión de React Testing Library tendrá soporte incorporado para React 18 sin necesidad de configuración adicional.

Obtén más información sobre la API de pruebas `act` y los cambios relacionados en el grupo de trabajo.

## Eliminación del soporte para Internet Explorer {/**dropping-support-for-internet-explore*/} {/*eliminación-del-soporte-para-internet-explorer-dropping-support-for-internet-explore*/}

En esta versión, React dejará de admitir Internet Explorer, el cual [dejará de recibir soporte el 15 de junio de 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). Estamos realizando este cambio ahora debido a que las nuevas funciones introducidas en React 18 se construyen utilizando características modernas del navegador, como microtareas, que no pueden ser adecuadamente polifiladas en IE.

Si necesitas admitir Internet Explorer, te recomendamos que te quedes con React 17.

## Deprecaciones {/*deprecations*/}

- `react-dom`: `ReactDOM.render` ha sido deprecado. Su uso mostrará una advertencia y ejecutará tu aplicación en modo React 17.
- `react-dom`: `ReactDOM.hydrate` ha sido deprecado. Su uso mostrará una advertencia y ejecutará tu aplicación en modo React 17.
- `react-dom`: `ReactDOM.unmountComponentAtNode` ha sido deprecado.
- `react-dom`: `ReactDOM.renderSubtreeIntoContainer` ha sido deprecado.
- `react-dom/server`: `ReactDOMServer.renderToNodeStream` ha sido deprecado.

## Otros cambios disruptivos {/*other-breaking-changes*/}

- Temporización consistente de `useEffect`: Ahora, React siempre ejecuta de forma síncrona las funciones de efecto si la actualización se desencadenó durante un evento discreto de entrada de usuario, como un clic o un evento de teclado. Anteriormente, el comportamiento no siempre era predecible ni consistente.

- Errores de hidratación más estrictos: Las discrepancias de hidratación debido a contenido de texto faltante o adicional ahora se tratan como errores en lugar de advertencias. React ya no intentará "corregir" nodos individuales mediante la inserción o eliminación de un nodo en el cliente en un intento de que coincida con el marcado del servidor, y volverá a la representación del cliente hasta el límite más cercano de `<Suspense>` en el árbol. Esto asegura que el árbol hidratado sea consistente y evita posibles problemas de privacidad y seguridad que pueden ser causados por discrepancias de hidratación.

- Los árboles de suspensión son siempre consistentes: Si un componente se suspende antes de ser completamente agregado al árbol, React no lo agregará al árbol en un estado incompleto ni ejecutará sus efectos. En cambio, React descartará completamente el nuevo árbol, esperará a que la operación asíncrona termine y luego intentará el renderizado nuevamente desde cero. React renderizará el intento de reintentar de forma concurrente y sin bloquear el navegador.

- Efectos de diseño con Suspense: Cuando un árbol se suspende nuevamente y vuelve a su estado de respaldo, React ahora limpiará los efectos de diseño y luego los recreará cuando se muestre el contenido dentro del límite. Esto soluciona un problema que impedía que las bibliotecas de componentes midieran correctamente el diseño cuando se usaban con Suspense.

- Nuevos requisitos de entorno de JavaScript: Ahora, React depende de las características de los navegadores modernos, como Promise, Symbol y Object.assign. Si necesitas admitir navegadores y dispositivos más antiguos, como Internet Explorer, que no proporcionan características de navegadores modernos de forma nativa o tienen implementaciones no compatibles, considera incluir un polyfill global en tu aplicación empaquetada.

## Otros cambios notables {/*other-notable-changes*/}

### React {/*react*/}

- Ahora los componentes pueden renderizar `undefined`: React ya no muestra advertencias si retornas `undefined` desde un componente. Esto hace que los valores de retorno permitidos en los componentes sean consistentes con los valores permitidos en medio de un árbol de componentes. Te sugerimos usar un linter para evitar errores como olvidar una declaración de retorno antes de JSX.

- **En las pruebas, las advertencias de `act` ahora son opcionales:** Si estás ejecutando pruebas de extremo a extremo, las advertencias de `act` son innecesarias. Hemos introducido un mecanismo [opcional](https://github.com/reactwg/react-18/discussions/102) para que puedas habilitarlas solo en pruebas unitarias donde sean útiles y beneficiosas.

- No hay advertencia sobre `setState` en componentes desmontados: Anteriormente, React mostraba advertencias sobre pérdidas de memoria cuando llamabas a `setState` en un componente desmontado. Esta advertencia se agregó para las suscripciones, pero la mayoría de las veces se encontraba en escenarios donde el establecimiento de estado está bien y las soluciones alternativas empeoran el código. Hemos eliminado esta [advertencia](https://github.com/facebook/react/pull/22114).

- No se suprimen los registros de la consola: Cuando usas el "Modo Estricto" (`Strict Mode`), React renderiza cada componente dos veces para ayudarte a encontrar efectos secundarios inesperados. En React 17, suprimimos los registros de la consola para una de las dos renderizaciones para que los registros fueran más fáciles de leer. En respuesta a los [comentarios de la comunidad](https://github.com/facebook/react/issues/21783) que indicaban que esto era confuso, hemos eliminado la supresión. En su lugar, si tienes instaladas las React DevTools, los registros de la segunda renderización se mostrarán en gris y habrá una opción (desactivada de forma predeterminada) para suprimirlos por completo.

- Mejora en el uso de memoria: React ahora limpia más campos internos al desmontar, lo que reduce el impacto de posibles fugas de memoria no corregidas que puedan existir en el código de tu aplicación.

### React DOM Server {/*react-dom-server*/}

- `renderToString`: Ya no generará un error al suspenderse en el servidor. En su lugar, emitirá el HTML de respaldo para el límite más cercano de `<Suspense>` y luego volverá a intentar renderizar el mismo contenido en el cliente. Aún se recomienda que cambies a una API de transmisión como `renderToPipeableStream` o `renderToReadableStream` en su lugar.

- `renderToStaticMarkup`: Ya no generará un error al suspenderse en el servidor. En su lugar, emitirá el HTML de respaldo para el límite más cercano de `<Suspense>`.

## Registro de cambios {/*changelog*/}

Puedes ver el registro de cambios completo [aquí](https://github.com/facebook/react/blob/main/CHANGELOG.md).
