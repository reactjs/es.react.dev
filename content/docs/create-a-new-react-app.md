---
id: create-a-new-react-app
title: Crear una nueva aplicación React
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Para obtener la mejor experiencia de usuario y desarrollador use una cadena de herramientas integrada.

Esta página describe algunas de las cadenas de herramientas de React más populares, las cuales ayudan con tareas como:

* Escalar a múltiples archivos y componentes.
* Usar bibliotecas de terceros desde npm.
* Detección temprana de errores comunes.
* Edición en vivo de CSS y JS en desarrollo.
* Optimización de la salida para producción.

Las cadenas de herramientas que se recomiendan en esta página **no requieren ninguna configuración para empezar**.

## Puede que no necesites una cadena de herramientas {#you-might-not-need-a-toolchain}

Si no experimentas los problemas descritos arriba, o aún no te sientes cómodo usando herramientas de Javascript, considera [añadir React como una etiqueta `<script>` en una página HTML](/docs/add-react-to-a-website.html), opcionalmente [con JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Esta es también **la manera más fácil de integrar React en un sitio web existente.** Siempre puedes añadir una cadena de herramientas más grande si lo consideras útil!

## Cadenas de herramientas recomendadas {#recommended-toolchains}

El equipo de React principalmente recomienda las siguientes soluciones:

- Si estás **aprendiendo React** o **creando una nueva [aplicación de página única](/docs/glossary.html#single-page-application),** usa [Create React App](#create-react-app).
- Si estás construyendo un **sito web renderizado en servidor con Node.js,** prueba [Next.js](#nextjs).
- Si estás construyendo un **sitio web orientado a contenido estático,** prueba [Gatsby](#gatsby).
- Si estás construyendo una **biblioteca de componentes** o **integrando una base de código existente**, prueba [Cadenas de Herramientas más Flexibles](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) es un ambiente cómodo para **aprender React**, y es la mejor manera de comenzar a construir **una nueva [aplicación de página única](/docs/glossary.html#single-page-application)** usando React.

**Create React App** configura tu ambiente de desarrollo de forma que puedas usar las últimas características de Javascript, brindando una buena experiencia de desarrollo, y optimizando tu aplicación para producción. Necesitarás tener [Node >= 8.10 y npm >= 5.6](https://nodejs.org/en/) instalados en tu máquina. Para crear un proyecto ejecuta:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Nota
>
>En la primera línea `npx` no es un error de escritura: Es una [herramienta de ejecución de paquetes que viene con npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App no se encarga de la lógica de `backend` o de bases de datos; tan solo crea un flujo de construcción para `frontend`, de manera que lo puedes usar con cualquier `backend`. Para ello internamente usa [Babel](https://babeljs.io/) y [webpack](https://webpack.js.org/), pero no necesitas saber nada de estas herramientas para usar Create React App.

Cuando estés listo para desplegar a producción, ejecuta `npm run build` lo cual crea una compilación optimizada de tu aplicación en el directorio `build`. Puedes aprender más acerca de **Create React App** [en su archivo README](https://github.com/facebookincubator/create-react-app#create-react-app--) y en la [Guía del Usuario](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) es un *framework* popular y ligero para **aplicaciones estáticas y renderizadas en servidor** construidas con React. Integra **soluciones de estilo y enrutamiento** y asume que estás usando [Node.js](https://nodejs.org/) como ambiente de servidor.
 
Aprende Next.js de [su guía oficial](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) es la mejor manera de crear **sitios web estáticos** usando React. Te permite usar componentes React, pero genera HTML y CSS pre-renderizado para garantizar el tiempo de carga más rápido.
 
Aprende Gatsby de [su guía oficial](https://www.gatsbyjs.org/docs/) y de [la galería de kits de inicio](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Cadenas de herramientas más flexibles {#more-flexible-toolchains}

Las siguientes cadenas de herramientas ofrecen más opciones y flexibilidad. Las recomendamos para los usuarios con más experiencia:

- **[Neutrino](https://neutrinojs.org/)** combina el poder de [webpack](https://webpack.js.org/) con la simplicidad de los *presets* (configuraciones preempaquetadas), e incluye *presets* para [aplicaciones React](https://neutrinojs.org/packages/react/) y [componentes React](https://neutrinojs.org/packages/react-components/).

- **[Parcel](https://parceljs.org/)** es un empaquetador de aplicaciones web rápido y de cero configuración que [funciona con React](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** es un framework de renderizado en servidor que no requiere ninguna configuración, pero ofrece más flexibilidad que Next.js.

## Creando una cadena de herramientas desde cero {#creating-a-toolchain-from-scratch}

Una cadena de herramientas para construir Javascript generalmente consiste de:

* Un **gestor de paquetes** como [Yarn](https://yarnpkg.com/) o [npm](https://www.npmjs.com/). Este te permite aprovechar el vasto ecosistema de paquetes de terceros, e instalarlos o actualizarlos de una manera fácil.

* Un **empaquetador** como [webpack](https://webpack.js.org/) o [Parcel](https://parceljs.org/). Este te permite escribir código modular y empaquetarlo junto en paquetes más pequeños que optimizan el tiempo de carga.

* Un **compilador** como [Babel](https://babeljs.io/). Este te permite escribir Javascript moderno que aún así funciona en navegadores más antiguos.

Si prefieres configurar tu propia cadena de herramientas JavaScript desde cero, [chequea esta guía](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) que recrea parte de la funcionalidad de **Create React App**.

No te olvides de asegurarte que tu cadena de herramientas esté [configurada apropiadamente para producción](/docs/optimizing-performance.html#use-the-production-build).
