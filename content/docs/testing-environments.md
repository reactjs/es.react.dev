---
id: testing-environments
title: Entornos de Pruebas
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

Este documento repasa los factores que pueden afectar tu entorno y contiene recomendaciones para algunos escenarios.

### Bibliotecas de ejecución de pruebas {#test-runners}

Bibliotecas para ejecución de pruebas como [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) permiten escribir conjuntos de pruebas en JavasScript regular y correrlas como parte de tu proceso de desarrollo. Adicionalmente, los suits de pruebas son ejecutados como parte de integraciones continuas.

- Jest es altamente compatible con proyectos de React, soportando características como [modulos simulados](#mocking-modules) y [temporizadores](#mocking-timers), y soporte [`jsdom`](#mocking-a-rendering-surface). **Si usas Create React App, [Jest ya esta incluido para usar fácilmente](https://facebook.github.io/create-react-app/docs/running-tests) con una configuracion por defecto útil.**
- Bibliotecas como [mocha](https://mochajs.org/#running-mocha-in-the-browser) funcionan bien en un entorno de navegador real, y puede ayudar con pruebas que necesiten de ello explícitamente.
- Las pruebas "end-to-end" son usadas para probar flujos más largos a través de múltiples páginas y que requieren una [configuración diferente](#end-to-end-tests-aka-e2e-tests).

### Simulando una superficie de renderizado {#mocking-a-rendering-surface}

Las pruebas usualmente son ejecutadas en un entorno sin acceso a una superficie de renderizado real como un navegador. Para estos entornos, recomendamos simular el navegador usando [`jsdom`](https://github.com/jsdom/jsdom), una implementación de navegador que se ejecuta sobre Node.js.

En la mayoría de los casos, `jsdom` se comporta como lo haría un navegador normal, pero no tiene características como [navegación y layout](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). Aún así es útil para la mayoría de las pruebas de componentes web, al correr más rápido por no tener que iniciar un navegador para cada prueba. También se ejecuta en el mismo proceso que tus pruebas, así que puedes escribir código para examinar y comprobar resultados en el DOM renderizado.

Tal como en un navegador real, jsdom nos permite simular interacciones del usuario; las pruebas pueden llamar eventos en nodos del DOM, y entonces observar y comprobar los efectos resultantes de estas acciones [<small>(ejemplo)</small>](/docs/testing-recipes.html#events).

Una gran parte de pruebas a la interfaz gráfica pueden ser escritas con la configuración descrita más arriba: usando Jest como biblioteca de prueba, renderizando en jsdom y con interacciones especificas del usuario como una secuencia de eventos del navegador, iniciadas por la función `act()` [<small>(ejemplo)</small>](/docs/testing-recipes.html). Por ejemplo, muchas de las propias pruebas de React están escritas con esta combinación.

Si estas escribiendo una biblioteca que prueba principalmente un comportamiento específico del navegador y requiere comportamiento nativo del navegador como el layout o inputs reales, puedes usar un framewrok como [mocha.](https://mochajs.org/)

En un entorno donde _no puedes_ simular el DOM (por ejemplo, probando componentes de React Native en Node.js), podrías usar [simuladores de eventos](/docs/test-utils.html#simulate) para simular interacciones con elementos. De manera alternativa, también puedes usar el _helper_ `fireEvent` de [`@testing-library/react-native`](https://testing-library.com/docs/native-testing-library).

Frameworks como [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) y [webdriver](https://www.seleniumhq.org/projects/webdriver/) son útiles para ejecutar pruebas ["end-to-end"](#end-to-end-tests-aka-e2e-tests).

### Simulando funciones {#mocking-functions}

Cuando se están escribiendo pruebas, nos gustaría simular partes de nuestro código que no tienen un equivalente en nuestro entorno de pruebas (por ejemplo revisar el estado de `navigator.onLine` dentro de Node.js). Las pruebas también podrían espiar algunas funciones y observar como otras partes de la prueba interactúan con ellas. Es entonces útil ser capaz de simular selectivamente estas funciones con versiones más amigables para las pruebas.

Esto es especialmente útil en los llamados para obtener datos. Es preferible usar datos "falsos" para estas pruebas para evitar la lentitud y lo engorroso de llamados a endpoints API reales [<small>(ejemplo)</small>](/docs/testing-recipes.html#data-fetching). Esto ayuda a que las pruebas sean predecibles. Bibliotecas como [Jest](https://jestjs.io/) y [sinon](https://sinonjs.org/), entre otras, soportan funciones simuladas. Para pruebas "end-to-end", simular una red puede ser más complicado, pero también podrías querer probar los endpoints API reales en ellos igualmente.

### Simulando módulos {#mocking-modules}

Algunos componentes tienen dependencias de módulos que quizás no funcionen bien en entornos de prueba, o no son necesarios para nuestras pruebas. Puede ser útil simular de manera selectiva estos módulos con reemplazos adecuados [<small>(example)</small>](/docs/testing-recipes.html#mocking-modules).

En Node.js, bibliotecas como Jest soportan la [simulación de módulos](https://jestjs.io/docs/en/manual-mocks). También podrías usar bibliotecas como [`mock-require`](https://www.npmjs.com/package/mock-require).

### Simulando temporizadores {#mocking-timers}

Hay componentes que pudiesen estar usando funciones basadas en el tiempo como `setTimeout`, `setInterval`, or `Date.now`. En entornos de prueba, puede ser de ayuda simular estas funciones con reemplazos que te permitan "avanzar" manualmente el tiempo. ¡Esto es excelente para asegurar que tus pruebas se ejecuten rápidamente! Las pruebas que dependen de temporizadores aún podrian ser resueltas en orden, pero mas rápido [<small>(ejemplo)</small>](/docs/testing-recipes.html#timers). La mayoría de los frameworks, incluyendo [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) y [lolex](https://github.com/sinonjs/lolex), te permiten simular temporizadores en tus pruebas.

Algunas veces, podrías no querer simular los temporizadores. Por ejemplo, quizás estás probando una animación, o interactuando con un endpoint que es sensitivo al tiempo (como una API limitadora de peticiones). Bibliotecas con simuladores de temporizadores te permite habilitar y deshabilitarlas en base a pruebas o suits, de forma que tú puedas elegir como estas pruebas serán ejecutadas.

### Pruebas "end-to-end" {#end-to-end-tests-aka-e2e-tests}

Las pruebas "end-to-end" son útiles para flujos más largos, especialmente si estos son críticos para tu negocio (como los pagos o registros). Para estas pruebas, probablemente quisieras probar cómo un navegador real renderiza toda la aplicación, solicita datos de un endpoint API real, usa sesiones y cookies, navega entre diferentes enlaces. Podrías también querer hacer comprobaciones no solamente en el estado del DOM sino también en los datos que usa (por ejemplo, para verificar si las actualizaciones persisten en la base de datos).

En este escenario, podrías usar un framework como [Cypress](https://www.cypress.io/) o una biblioteca como [puppeteer](https://github.com/GoogleChrome/puppeteer) de forma que puedas navegar entre diferentes rutas y comprobar los efectos no solo del navegador si no potencialmente del backend también.
