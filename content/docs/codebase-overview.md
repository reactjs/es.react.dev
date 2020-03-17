---
id: codebase-overview
title: Visión general de la base de código
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

Esta sección te dará una perspectiva general de la organización del código base de React, sus convenciones, e implementación.

Si quieres [contribuir a React](/docs/how-to-contribute.html) esperamos que esta guía te ayude a sentirte más cómodo al hacer cambios.

No recomendamos necesariamente alguna de estas convenciones en aplicaciones de React. Muchas de ellas existen por razones históricas y pueden cambiar con el tiempo.

### Carpetas principales {#top-level-folders}

Después de clonar el [repositorio de React](https://github.com/facebook/react), verás algunas carpetas principales en él.

* [`packages`](https://github.com/facebook/react/tree/master/packages) contiene metadatos (como el `package.json`) y el código fuente (subdirectorio `src`) para todos los paquetes en el repositorio de React. **Si tú cambio está relacionado con el código, el subdirectorio `src` de cada paquete es donde pasarás la mayoría del tiempo.**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) contiene algunas aplicaciones pequeñas de prueba para colaboradores.
* [`build`] es el compilado de React. No está en el repositorio pero aparecerá en la carpeta clonada de React después de que [compiles](/docs/how-to-contribute.html#development-workflow) por primera vez.

La documentación está [en un repositorio aparte de React](https://github.com/reactjs/reactjs.org).

Hay otras carpetas principales pero son usadas como herramientas y no vas a necesitarlas al momento de contribuir.

### Ubicación de las pruebas {#colocated-test}

No tenemos un carpeta principal para las pruebas unitarias. En cambio, están ubicadas en un directorio llamado `__tests__` relativo a los archivos que prueban.

Por ejemplo, una prueba para [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) está ubicada junto a [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js).

### Advertencias e Invariantes {#warnings-and-invariants}

El código base de React usa el módulo `warning` para mostrar advertencias:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```

**La advertencia se muestra cuando la condición `warning` es `false`.**

Una forma de pensar al respecto es que la condición debe reflejar la situación normal más no una condición excepcional.

Es una buena idea evitar duplicar advertencias en la consola.

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Math is not working today.'
  );
  didWarnAboutMath = true;
}
```

Las advertencias solo están disponibles en desarrollo. En producción, son removidas. Si necesitas prohibir la ejecución de un código, usa el módulo `invariant`:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**El invariante se muestra cuando la condición `invariant` es `false`.**

"Invariante" es una forma de decir "está condición siempre es true". Puedes pensar al respecto como si hicieras una comprobación.

Es importante mantener similar el comportamiento del ambiente de producción y desarrollo, de forma que la condición `invariant` aplique para ambos. Los mensajes de error son reemplazados automáticamente por códigos de error en producción para evitar que afecten de forma negativa el tamaño en bytes.

### Desarrollo y Producción {#development-and-production}

Puedes usar la variable seudo-global `__DEV__` en el código base para proteger bloques de código únicamente en desarrollo.

Esta variable es agregada durante la fase de compilación, y se transforma en verificaciones de la forma `process.env.NODE_ENV !== 'production'` en los compilados de CommonJS.

Para compilados independientes, se vuelve `true` en el compilado no minificado, y se remueve por completo junto con los bloques `if` que protege en el compilado minificado.

```js
if (__DEV__) {
  // Este código solo funcionará en desarrollo.
}
```

### Flow {#flow}

Recientemente se introdujeron validaciones [Flow](https://flow.org/) al código base. Archivos marcados con la anotación `@flow` en el comentario de encabezado de la licencia se están validando.

Aceptamos pull requests [para agregar anotaciones Flow al código existente](https://github.com/facebook/react/pull/7600/files). Las anotaciones Flow se ven así:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

Cuando sea posible, el nuevo código debería usar anotaciones Flow.
Puedes usar `yarn flow` localmente para verificar tu código con Flow.

### Inyección Dinámica {#dynamic-injection}

React usa inyección dinámica en algunos módulos. Mientras esta función se específica de forma explícita, no deja de ser inoportuna porque dificulta la comprensión del código. La razón principal de su existencia es que React originalmente soportaba el DOM como objetivo. React Native empezó como un fork de React. Tuvimos que agregar inyección dinámica para permitir que React Native sobreescribiera algunos comportamientos.

Puedes ver módulos declarando sus dependencias dinámicas de la siguiente manera:

```js
// Inyectado dinámicamente
var textComponentClass = null;

// Depende de un valor inyectado dinámicamente
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Da una oportunidad para la inyección dinamica
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

El campo `injection` no se maneja de alguna forma en especial. Pero por convención, significa que el módulo quiere tener algunas (presuntamente específicas a la plataforma) dependencias inyectadas al momento de su ejecución.

Hay múltiples puntos de inyección en el código base. En el futuro, pretendemos remover el mecanismo de inyección dinámica y conectar todas las piezas de forma estática durante la compilación.

### Múltiples paquetes {#multiple-packages}

React es un [monorepo](https://danluu.com/monorepo/). Su repositorio contiene múltiples paquetes separados de tal forma que sus cambios puedan coordinarse, y los issues se encuentren en un solo lugar.

### Núcleo de React {#react-core}

El "núcleo" de React incluye todas las [APIs principales de React](/docs/top-level-api.html#react), por ejemplo:

* `React.createElement()`
* `React.Component`
* `React.Children`

**El núcleo de React incluye las APIs necesarias para definir componentes.** Este no incluye el algoritmo de [reconciliación](/docs/reconciliation.html) o cualquier código específico a una plataforma. Es usado por componentes de React DOM y React Native.

El código del núcleo de React está ubicado en [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) en el árbol de fuentes. Está disponible en npm como el paquete [react](https://www.npmjs.com/package/react). La compilación del navegador se llama `react.js`, y exporta un global llamado `React`.

### Renderizadores {#renderers}

React fue creado originalmente para el DOM pero fue adaptado para dar soporte a plataformas nativas con [React Native](https://reactnative.dev/). Esto introdujo el concepto de "renderizadores" en React.

**Los renderizadores gestionan cómo un árbol de React se convierte en llamados de la plataforma subyacente.**

Los renderizadores también están ubicados en [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [Renderizador de React DOM](https://github.com/facebook/react/tree/master/packages/react-dom) renderiza componentes de React en el DOM. Implementa [APIs principales de `ReactDOM`](/docs/react-dom.html) y está disponible como un paquete npm [`react-dom`](https://www.npmjs.com/package/react-dom). También puede ser usado como un bundle independiente del navegador llamado `react-dom.js` que exporta un global de `ReactDOM`.
* [Renderizador de React Native](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renderiza componentes de React en vistas nativas. Es usado internamente por React Native.
* [Renderizador de pruebas de React](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renderiza componentes de React en árboles JSON. Es usada por la funcionalidad [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) de [Jest](https://facebook.github.io/jest) y está disponible como el paquete npm [react-test-renderer](https://www.npmjs.com/package/react-test-renderer).

Otro renderizador oficialmente soportado es [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). Antes estaba en un [repositorio de GitHub](https://github.com/reactjs/react-art) separado pero lo movimos a la estructura principal de directorios por ahora.

>**Nota:**
>
> Técnicamente [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) es una capa delgada que enseña a React a interactuar con la implementación de React Native. El verdadero código espicífico a la plataforma que se encarga de las vistas nativas está en el [repositorio de React Native](https://github.com/facebook/react-native) junto con sus componentes.

### Reconciliadores {#reconcilers}

Incluso los renderizadores como React DOM y React Native necesitan compartir una gran cantidad de lógica. En particular, el algoritmo de [reconciliación](/docs/reconciliation.html) debe ser tan similar como sea posible para que el renderizado declarativo, los componentes personalizados, el estado, los métodos del ciclo de vida, y las referencias funcionen de forma consistente a tráves de las plataformas.

Para resolver esto, diferentes renderizadores comparten parte del código entre sí. Llamamos a esta parte de React un `reconciliador`. Cuando se planifica una actualización como `setState()`, el reconciliador llama el método `render()` en los componentes del árbol y los monta, actualiza, o desmonta.

Los reconciliadores no están empaquetados por separado porque actualmente no tienen una API pública. Por el contrario, son exclusivamente usados por los renderizadores como React DOM y React Native.

### Reconciliador de pila {#stack-reconciler}

El reconciliador de "pila" es la implementación que permite el funcionamiento de React 15 y versiones previas. Dejamos de usarlo, pero está documentado en detalle en la [próxima sección](/docs/implementation-notes.html).

### Reconciliador Fiber {#fiber-reconciler}

El reconciliador "fiber" es un nuevo esfuerzo dedicado a resolver los problemas inherentes al reconciliador de pila y arreglar algunos issues. Ha sido el reconciliador por defecto desde React 16.

Sus objetivos principales son:

* Habilidad de dividir trabajo interrumplible en partes.
* Habilidad de priorizar, y reusar trabajo en progreso.
* Habilidad para moverse entre padres e hijos para soportar maquetación en React.
* Habilidad para retornar múltiples elementos desde el método `render()`.
* Mejor soporte a límites de error.

Puedes leer más acerca de la Arquitectura de React Fiber [aquí](https://github.com/acdlite/react-fiber-architecture) y [aquí](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). Como el soporte comenzó desde React 16, las funcionalidades asíncronas no se han habilitado aún.

Su código fuente está ubicado en [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Sistema de Eventos {#event-system}

React implementa un sistema de eventos sintético que es agnóstico de los renderizadores y funciona con React DOM y React Native. Su código fuente está localizado en [`packages/legacy-events`](https://github.com/facebook/react/tree/master/packages/legacy-events).

Aquí hay un [video con una muestra en profundidad del código](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 mins).

### ¿Qué sigue? {#what-next}

Lee la [próxima sección](/docs/implementation-notes.html) para aprender en más detalle acerca de la implementación del reconciliador antes de React 16. No hemos documentado los aspectos internos del nuevo reconciliador aún.
