---
id: testing-environments
title: Testing Environments
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

Este documento repasa los factores que pueden afectar tu ambiente de desarrollo y recomendaciones para algunos escenarios.

### Bibliotecas de ejecución de pruebas {#test-runners}

Bibliotecas para ejecución de pruebas como [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) permiten escribir suit de pruebas en JavasScript regular y correrlas como parte de tu proceso de desarrollo. Adicionalmente, los suits de pruebas son ejecutados como parte de integraciones continuas.

- Jest es altamente compatible con projectos de React, soportando características como [modulos simulados](#mocking-modules) y [temporizadores](#mocking-timers), y soporte [`jsdom`](#mocking-a-rendering-surface). **Si usas Create React App, [Jest ya esta incluido para correr](https://facebook.github.io/create-react-app/docs/running-tests) con una configuracion por defecto útil.**
- Librerias como [mocha](https://mochajs.org/#running-mocha-in-the-browser) funcionan bien en un entorno de navegador real, y puede ayudar con pruebas que necesiten de ello explicitamente.
- Pruebas extremo a extremo son usadas para probar flujos más largos a través de múltiples páginas y requieren una [configuración diferente](#end-to-end-tests-aka-e2e-tests).

### Simulando una superficie de renderizado {#mocking-a-rendering-surface}

Las pruebas usualmente son ejecutadas en un ambiente sin acceso a una superficie de renderizado real como un navegador. Para estos ambientes, recomendamos simular el navegador usando [`jsdom`](https://github.com/jsdom/jsdom), una implementacion de navegador que se ejecuta sobre Node.js.

En la mayoría de los casos, jsdom se comporta como lo haría un navegador normal, pero no tiene características como [navegación y maquetado](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). Aún así es útil para la mayoría de las pruebas de componentes web, al correr más rápido por no tener que iniciar un navegador para cada prueba. También se ejecuta en el mismo proceso que tus pruebas, así que puedes escribir código para examinar y comprobar en el DOM renderizado.

Just like in a real browser, jsdom lets us model user interactions; tests can dispatch events on DOM nodes, and then observe and assert on the side effects of these actions [<small>(example)</small>](/docs/testing-recipes.html#events).

A large portion of UI tests can be written with the above setup: using Jest as a test runner, rendered to jsdom, with user interactions specified as sequences of browser events, powered by the `act()` helper [<small>(example)</small>](/docs/testing-recipes.html). For example, a lot of React's own tests are written with this combination.

If you're writing a library that tests mostly browser-specific behavior, and requires native browser behavior like layout or real inputs, you could use a framework like [mocha.](https://mochajs.org/)

In an environment where you _can't_ simulate a DOM (e.g. testing React Native components on Node.js), you could use [event simulation helpers](https://reactjs.org/docs/test-utils.html#simulate) to simulate interactions with elements. Alternately, you could use the `fireEvent` helper from [`@testing-library/react-native`](https://testing-library.com/docs/native-testing-library).

Frameworks like [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) and [webdriver](https://www.seleniumhq.org/projects/webdriver/) are useful for running [end-to-end tests](#end-to-end-tests-aka-e2e-tests).

### Mocking functions {#mocking-functions}

When writing tests, we'd like to mock out the parts of our code that don't have equivalents inside our testing environment (e.g. checking `navigator.onLine` status inside Node.js). Tests could also spy on some functions, and observe how other parts of the test interact with them. It is then useful to be able to selectively mock these functions with test-friendly versions.

This is especially useful for data fetching. It is usually preferable to use "fake" data for tests to avoid the slowness and flakiness due to fetching from real API endpoints [<small>(example)</small>](/docs/testing-recipes.html#data-fetching). This helps make the tests predictable. Libraries like [Jest](https://jestjs.io/) and [sinon](https://sinonjs.org/), among others, support mocked functions. For end-to-end tests, mocking network can be more difficult, but you might also want to test the real API endpoints in them anyway.

### Mocking modules {#mocking-modules}

Some components have dependencies for modules that may not work well in test environments, or aren't essential to our tests. It can be useful to selectively mock these modules out with suitable replacements [<small>(example)</small>](/docs/testing-recipes.html#mocking-modules).

On Node.js, runners like Jest [support mocking modules](https://jestjs.io/docs/en/manual-mocks). You could also use libraries like [`mock-require`](https://www.npmjs.com/package/mock-require).

### Mocking timers {#mocking-timers}

Components might be using time-based functions like `setTimeout`, `setInterval`, or `Date.now`. In testing environments, it can be helpful to mock these functions out with replacements that let you manually "advance" time. This is great for making sure your tests run fast! Tests that are dependent on timers would still resolve in order, but quicker [<small>(example)</small>](/docs/testing-recipes.html#timers). Most frameworks, including [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) and [lolex](https://github.com/sinonjs/lolex), let you mock timers in your tests.

Sometimes, you may not want to mock timers. For example, maybe you're testing an animation, or interacting with an endpoint that's sensitive to timing (like an API rate limiter). Libraries with timer mocks let you enable and disable them on a per test/suite basis, so you can explicitly choose how these tests would run.

### End-to-end tests {#end-to-end-tests-aka-e2e-tests}

End-to-end tests are useful for testing longer workflows, especially when they're critical to your business (such as payments or signups). For these tests, you'd probably want to test both how a real browser renders the whole app, fetches data from the real API endpoints, uses sessions and cookies, navigates between different links. You might also likely want to make assertions not just on the DOM state, but on the backing data as well (e.g. to verify whether the updates have been persisted to the database).

In this scenario, you would use a framework like [Cypress](https://www.cypress.io/) or a library like [puppeteer](https://github.com/GoogleChrome/puppeteer) so you can navigate between multiple routes and assert on side effects not just in the browser, but potentially on the backend as well.
