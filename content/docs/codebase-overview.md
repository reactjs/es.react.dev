---
id: codebase-overview
title: Codebase Overview
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

Esta sección te dará una perspectiva general de la organización del código base de React, sus convenciones, e implementación.

TODO: cambiar por url español
Si quieres [contribuir a React](/docs/how-to-contribute.html) esperamos que esta guía te ayude a sentirte más cómodo al hacer cambios.

No recomendamos necesariamente alguna de estas convenciones en aplicaciones de React. Muchas de ellas existen por razones históricas y pueden cambiar con el tiempo.

### Dependencias Externas {#depencias-externas}

React prácticamente no tiene dependencias externas. Por lo general, un `require()` apunta a un archivo en el código base de React. Sin embargo, hay algunas pocas excepciones relativamente raras.

El [repositorio fbjs](https://github.com/facebook/fbjs) existe porque React comparte algunas pequeñas utilidades con bibliotecas como [Relay](https://github.com/facebook/relay), y nosotros las mantenemos sincronizadas. Nosotros no dependemos de pequeños módulos en el ecosistema de Node porque queremos que los ingenieros de Facebook puedan realizar cambios cuando sean necesarios. Ninguna de las utilidades de fbjs son consideras como una API pública, y sólo estan destinadas para ser usadas en proyectos de Facebook como React.

// TODO: top-level folders proper translation
### Carpetas principales {#carpetas-principales}

Después de clonar el [repositorio de React](https://github.com/facebook/react), verás algunas carpetas principales en él.

* [`packages`](https://github.com/facebook/react/tree/master/packages) contiene metadatos (como el `package.json`) y el código fuente (subdirectorio `src`) para todos los paquetes en el repositorio de React. **Si tú cambio esta relacionado con el código, el subdirectorio `src` de cada paquete es donde pasarás la mayoría del tiempo.
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) contiene algunas pequeñas aplcaciones de prueba para colaboradores.
* [`build`] es el compilado de React. No esta en el repositorio pero aparecerá en la carpeta clonada de React después de que [compiles](/docs/how-to-contribute.html#development-workflow) por primera vez.

La documentación esta [en un repositorio a parte de React](https://github.com/reactjs/reactjs.org).

Hay otras carpetas pero son principalmente usadas como herramientas y no vas a necesitarlas al momento de contribuir.

### Ubicación de las Pruebas {#ubicación-de-las-pruebas}

Nosotros no tenemos un directorio raíz para las pruebas unitarias. En cambio, están ubicadas en un directorio llamado `__tests__` relativo a los archivos que prueban.

Por ejemplo, una prueba para [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) esta ubicada junto a[`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js).

### Advertencias e Invariantes {#advertencias-e-invariantes}

El código base de React usa el módulo `warning` para mostrar advertencias:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```

**La advertencia se muestra cuando la condición `warning` es `false`.**

Una forma de pensar al respecto es que la condición debe reflejar la situacón normal más no una condicion excepcional.

Es una buena idea evitar enviar multiples advertencias a la consola.

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

Las advertencias sólo estan disponibles en desarrollo. En producción, son removidas. Si necesitas prohibir la ejecución de un código, usa el módulo `invariant`:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**El invariante se muestra cuando la condición `invariant` es `false`.**

"Invariante" es una forma de decir "está condición siempre es true". Puedes pensar al respecto como si hicieras un assertion.

Es importante mantener el comportamiento del ambiente de producción y desarrollo similar, asi que la condición `invariant` aplica para ambos. Los mensajes de error son reemplazados automáticamente por códigos de error en producción para evitar que afecten de forma negativa el tamaño en bytes.

### Desarrollo y Producción {#desarrollo-y-producción}

Puedes usar la variable speudo-global `__DEV__` en el código base para proteger bloques de código únicamente en desarrollo.

// TODO: revizar la traducción de esta línea.
Esta variable es agregada durante la fase de compilación, y se transforma en verificaciones de `process.env.NODE_ENV !== 'production'` en las compilaciones de CommonJS.

Para compilaciones independientes, se vuelve `true` en la compilación no minificada, y se remueve por completo junto con los bloques `if` que protege en la compilación minificada.

```js
if (__DEV__) {
  // This code will only run in development.
}
```

### Flow {#flow}

Recientemente se introdujo validaciones [Flow](https://flow.org/) al código fuente. Archivos marcados con la anotación `@flow` en el comentario de encabezado de la licencia se están validando.

Se aceptan PR's [para agregar anotaciones Flow al código existente](https://github.com/facebook/react/pull/7600/files). Las anotaciones Flow son así:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

Cuando sea posible, nuevo código podría usar anotaciones Flow.
Puedes usar `yarn flow` localmente para verificar tu código con Flow.

### Inyección Dinámica {#inyección-dinámica}

React usa inyección dinámica en algunos módulos. Mientras esta función se específica de forma explícita, no deja de ser inoportuna porque dificulta la comprensión del código. La razón principal de su existencia es que React originalmente soportaba el DOM como objetivo. React Native empezo como un fork de React. Nosotros tuvimos que agregar inyección dinámica para permitir que React Native sobreescribiera algunos comportamientos.

Tu puedes ver módulos declarando sus dependencias dinámicas así:


```js
// Dynamically injected
var textComponentClass = null;

// Relies on dynamically injected value
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Provides an opportunity for dynamic injection
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

El campo `injection` no se maneja de alguna forma en especial. Pero por convención, significa que el módulo quiere tener algunas (presuntamente específicas a la plataforma) dependencias inyectadas al momento de ejecución.

Hay multiples puntos de inyección en el código fuente. En el futuro, pretendemos remover el mecanismo de inyección dinámica y conectar todas las piezas de forma estática durante la compilación.

### Multiples paquetes {#multiple-paquetes}

React es un [monorepo](https://danluu.com/monorepo/). Su repositorio contiene multiples paquetes separados de tal forma que sus cambios puedan coordinarse, y los issues se encuentran en un sólo lugar.

### Núcleo de React {#núcle-de-react}

El "núcleo" de React incluye todas las [APIs principales de React](/docs/top-level-api.html#react), por ejemplo:

* `React.createElement()`
* `React.Component()`
* `React.Children`

**El núcleo de React incluye las APIs para definir componentes.** Este no incluye el algoritmo de [reconciliación](/docs/reconciliation.html) o algún código específico a la platarforma. Y es usado por componentes de React DOM y React Native.

El código del núcleo de React esta ubicado en [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) en el árbol de fuentes. Esta disponible en npm como el paquete [react](https://www.npmjs.com/package/react). La compilación del navegador se llama `react.js`, y se exporta de forma global como `React`.

### Renderizadores {#renderers}

React fue creado originalmente para el DOM pero fue adaptado para dar soporte a plataformas nativas con [React Native](https://facebook.github.io/react-native/)
- Esto introdujo el concepto de "renderizadores" en React.

**Los renderizadores gestionan cómo un árbol de React se convierte en la plataforma de llamadas subyacente.**

Los renderizadores también estan ubicados en [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [Render de React DOM](https://github.com/facebook/react/tree/master/packages/react-dom) renderiza componentes de React en el DOM. Esto implementa [APIs principales de `ReactDOM`](/docs/react-dom.html) y esta disponible como un paquete npm [`react-dom`](https://www.npmjs.com/package/react-dom). También puede ser usada como una version independiente del navegador llamada `react-dom.js` que un global de `ReactDOM`.
* [Render de React Native](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renderiza componentes de React en vistas nativas. Es usado internamente por React Native.
* [Render de Pruebas de React](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renderiza componentes de React en árboles JSON. Es usada por la funcionalidad [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) de [Jest](https://facebook.github.io/jest) y esta disponible como el paquete npm [react-test-renderer](https://www.npmjs.com/package/react-test-renderer).

Otro renderizador oficialmente soportado es [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). Antes estaba en un [repositorio de GitHub](https://github.com/reactjs/react-art) separado pero lo movimos en la estructura principal de directorios por ahora.

>**Note:**
>
> Tecnicamente el  [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) es una capa delgada que enseña a React a interactuar con la implementación de React Native. El verdadero código espicífo a la plataforma que se encarga de las vistas nativas esta en el [repositorio de React Native](https://github.com/facebook/react-native) junto con sus componentes.

### Reconciliadores {#reconcilers}

Incluso aunque los diferentes renderizadores como React DOM y React Native necesitan compartir gran parte de la lógica. En particular, el algoritmo de [reconciliación](/docs/reconciliation.html) debe ser tan similar como sea posible para que el renderizado declarativo, los componentes personalizados, el estado, los métodos del ciclo de vida, y refs funcionen de forma consistente a tráves de las plataformas.

Para resolver esto, diferentes renderizadores comparten parte del código. Llamamos a esto un `reconciliador`. Cuando se planifica una actulización como `setState()`, el reconciliador llama el método `render()` en los componentes del árbol y los monta, actuliza, o desmonta.

Los reconciliadores no estan enpaquetados por separado porque actualmente no esta en una API pública. Por el contrario, son exclusivamente usados por los renderizadores como React DOM y React Native.

### Reconcilador de pila {#stack-reconciler}

El reconciliador de "pila" es la implementación que permite el funcionamiento de React 15 y versiones previas. Nosotros paramos de usarla, pero esta documentada en detalla en la [próxima sección](/docs/implementation-notes.html).

### Reconciliador Fiber {#fiber-reconciler}

El reconciliador "fiber" es un nuevo esfuerzo dedicado a resolver los problemas inherentes al reconciliador de pila y arreglar algunos issues. Ha sido el reconciliador por defecto desde React 16.

Sus objetivos principales son:

* Habilidad de dividir trabajo interrumplible en partes.
* Habilidad de priorizar, rebase, y reusar trabajo en progreso.
* Habilidad para moverse entre padres e hijos para soportar maquetación en React.
* Habilidad para retornar múltiples elementos desde el método `render()`.
* Mejor soporte a error boundaries.

Puedes leer más acerca de Arquitectura de React Fiber [aquí](https://github.com/acdlite/react-fiber-architecture) y [aquí](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e). Como se soporta desde React 16, las funcionalidades asíncronas no se ha habilitado aún.

Su código fuente esta ubicado en [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Sistema de Eventos {#event-system}

React implementa un sistema de eventos sintético que es agnostico de los renderizadores y funciona con React DOM y React Native. Su código fuente esta localizado en [`packages/events`](https://github.com/facebook/react/tree/master/packages/events).

Hay un [video con una muestra a profundidad del código](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 mins).

There is a [video with a deep code dive into it](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 mins).

### Que sigue? {#what-next}

Lee la [próxima sección](/docs/implementation-notes.html) para aprender en más detalle acerca de la implementación del reconciliador antes de React 16. No hemos documentado los aspectos internos del nuevo reconciliador aún.

Read the [next section](/docs/implementation-notes.html) to learn about the pre-React 16 implementation of reconciler in more detail. We haven't documented the internals of the new reconciler yet.
