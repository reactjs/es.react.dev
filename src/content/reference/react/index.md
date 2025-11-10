---
title: Descripción General de la Referencia de React
---

<Intro>

Esta sección ofrece documentación de referencia detallada para trabajar con React. Para una introducción a React, por favor visita la sección de [Aprende](/learn).

</Intro>

La documentación de referencia de React está dividida en subsecciones funcionales:

## React {/*react*/}

Funcionalidades programáticas de React:

* [Hooks](/reference/react/hooks) - Usa diferentes funcionalidades de React desde tus componentes.
* [Componentes](/reference/react/components) - Componentes integrados que puedes usar en tu JSX.
* [APIs](/reference/react/apis) - APIs útiles para definir componentes.
* [Directivas](/reference/rsc/directives) - Proporciona instrucciones a los empaquetadores compatibles con los React Server Components.

## React DOM {/*react-dom*/}

<<<<<<< HEAD
React-dom contiene funcionalidades que solo son compatibles con aplicaciones web (que se ejecutan en el entorno DOM del navegador). Esta sección se divide en lo siguiente:

* [Hooks](/reference/react-dom/hooks) - Hooks para aplicaciones web que se ejecutan en el entorno DOM del navegador.
* [Componentes](/reference/react-dom/components) - React es compatible con todos los componentes integrados de HTML y SVG del navegador.
* [APIs](/reference/react-dom) - El paquete `react-dom` contiene métodos compatibles únicamente con aplicaciones web.
* [APIs del cliente](/reference/react-dom/client) - Las APIs de `react-dom/client` te permiten renderizar componentes de React en el cliente (en el navegador).
* [APIs del servidor](/reference/react-dom/server) - Las APIs de `react-dom/server` te permiten renderizar componentes de React a HTML en el servidor.
=======
React DOM contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

* [Hooks](/reference/react-dom/hooks) - Hooks for web applications which run in the browser DOM environment.
* [Components](/reference/react-dom/components) - React supports all of the browser built-in HTML and SVG components.
* [APIs](/reference/react-dom) - The `react-dom` package contains methods supported only in web applications.
* [Client APIs](/reference/react-dom/client) - The `react-dom/client` APIs let you render React components on the client (in the browser).
* [Server APIs](/reference/react-dom/server) - The `react-dom/server` APIs let you render React components to HTML on the server.
* [Static APIs](/reference/react-dom/static) - The `react-dom/static` APIs let you generate static HTML for React components.

## React Compiler {/*react-compiler*/}

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

* [Configuration](/reference/react-compiler/configuration) - Configuration options for React Compiler.
* [Directives](/reference/react-compiler/directives) - Function-level directives to control compilation.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Guide for shipping pre-compiled library code.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

The [ESLint plugin for React Hooks](/reference/eslint-plugin-react-hooks) helps enforce the Rules of React:

* [Lints](/reference/eslint-plugin-react-hooks) - Detailed documentation for each lint with examples.
>>>>>>> d271a7ac11d2bf0d6e95ebdfacaf1038421f9be0

## Reglas de React {/*rules-of-react*/}

React tiene idioms — o reglas — sobre cómo expresar ciertos patrones de una forma fácil de entender y que permita crear aplicaciones de alta calidad:

* [Los Componentes y Hooks deben ser puros](/reference/rules/components-and-hooks-must-be-pure) – La pureza hace que tu código sea más fácil de entender, depurar y permite que React optimice automáticamente tus componentes y hooks de forma correcta.
* [React invoca los Componentes y Hooks](/reference/rules/react-calls-components-and-hooks) – React se encarga de renderizar los componentes y hooks cuando sea necesario para optimizar la experiencia del usuario.
* [Reglas de los Hooks](/reference/rules/rules-of-hooks) – Los hooks se definen utilizando funciones de JavaScript, pero representan un tipo especial de lógica de interfaz reutilizable con restricciones sobre dónde pueden ser llamados.

## APIs Legacy {/*legacy-apis*/}

* [APIs Legacy](/reference/react/legacy) - Exportadas desde el paquete `react`, pero no se recomienda su uso en código nuevo.
