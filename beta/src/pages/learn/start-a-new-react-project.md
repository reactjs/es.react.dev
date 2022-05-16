---
title: Iniciar un nuevo proyecto de React
---

<Intro>

<<<<<<< HEAD
Si estás aprendiendo React o estás considerando añadirlo a un proyecto existente, puedes comenzar rápidamente por [añadir React a cualquier página HTML con etiquetas script](/learn/add-react-to-a-website). ¡Si tu proyecto va a necesitar muchos componentes y muchos archivos, podría ser hora de que consideres la opción que hay debajo!

</Intro>

## Escoge tu propia aventura {/*choose-your-own-adventure*/}

React es una biblioteca que te permite organizar código de UI al separarla en piezas que se nombran componentes. React no se preocupa por el enrutamiento o el manejo de datos. Para estas funcionalidades necesitarás usar bibliotecas de terceros o escribir tus propias soluciones. Esto significa que hay varias formas de comenzar un proyecto en React:

* Comenzar con una **configuración mínima con solo una cadena de herramientas (_toolchain_)** y añadir funcionalidades a tu proyecto mientras se hagan necesarias.
* Comenzar con un **framework más rígido** con funcionalidades comunes ya incluidas.

Ya sea que estás comenzando a aprender, que estás buscando construir algo grande o que quieres configurar tu propia cadena de herramientas, esta guía te indicará el camino apropiado.

## Iniciándote con una cadena de herramientas de React {/*getting-started-with-a-react-toolchain*/}

Si justo estás aprendiendo a usar React, te recomendamos [Create React App](https://create-react-app.dev/), la forma más popular de probar las funcionalidades de React y una forma magnífica de construir una aplicación de una sola página del lado del cliente. Create React App es una cadena de herramientas sin demasiadas opiniones y configurada solo para React. Las cadenas de herramientas te ayudan con cosas como:

* Escalar a muchos archivos y componentes
* Usar bibliotecas de terceros de npm
* Detectar errores comunes de forma temprana
* Editar CSS y JS en vivo en un entorno de desarrollo
* Optimizar el resultado para producción

¡Puedes iniciarte con Create React App con una sola línea de código en tu terminal! (**¡Asegúrate de tener instalado [Node.js](https://nodejs.org/)!**).
=======
If you're starting a new project, we recommend to use a toolchain or a framework. These tools provide a comfortable development environment but require a local Node.js installation.

</Intro>

<YouWillLearn>

* How toolchains are different from frameworks
* How to start a project with a minimal toolchain
* How to start a project with a fully-featured framework
* What's inside popular toolchains and frameworks

</YouWillLearn>

## Choose your own adventure {/*choose-your-own-adventure*/}

React is a library that lets you organize UI code by breaking it apart into pieces called components. React doesn't take care of routing or data management. This means there are several ways to start a new React project:

* [Start with an **HTML file and a script tag**.](/learn/add-react-to-a-website) This doesn't require Node.js setup but offers limited features.
* Start with a **minimal toolchain,** adding more features to your project as you go. (Great for learning!)
* Start with an **opinionated framework** that has common features like data fetching and routing built-in.

## Getting started with a minimal toolchain {/*getting-started-with-a-minimal-toolchain*/}

If you're **learning React,** we recommend [Create React App](https://create-react-app.dev/). It is the most popular way to try out React and build a new single-page, client-side application. It's made for React but isn't opinionated about routing or data fetching.

First, install [Node.js](https://nodejs.org/en/). Then open your terminal and run this line to create a project:
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Ahora puedes ejecutar tu aplicación con:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

Para más información, [consulta la guía oficial](https://create-react-app.dev/docs/getting-started).

<<<<<<< HEAD
> Create React App no maneja la lógica del *backend* o las bases de datos; solo crea una línea de construcción. Esto significa que puedes utilizar cualquier *backend* que desees. ¡Pero si estás buscando más funcionalidades como enrutamiento y lógica del lado del servidor, continúa leyendo!

### Otras opciones {/*other-options*/}

Create React App es magnífica para iniciar a trabajar con React, pero si quisieras una cadena de herramientas aún más ligera, puedes probar alguna de estas otras que son populares:
=======
> Create React App doesn't handle backend logic or databases. You can use it with any backend. When you build a project, you'll get a folder with static HTML, CSS and JS. Because Create React App can't take advantage of the server, it doesn't provide the best performance. If you're looking for faster loading times and built-in features like routing and server-side logic, we recommend using a framework instead.

### Popular alternatives {/*popular-alternatives*/}
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)

<<<<<<< HEAD
## Construir con React y un framework {/*building-with-react-and-a-framework*/}

Si estás pensando en construir un proyecto más grande listo para producción, [Next.js](https://nextjs.org/) es un muy buen lugar para comenzar. Next.js es un framework popular y ligero para aplicaciones hechas con React ya sean estáticas o renderizadas del lado del servidor. Viene preempaquetado con funcionalidades como enrutamiento, estilos, y renderizado del lado del servidor, lo que permite comenzar un proyecto rápidamente.

[Comienza a construir con Next.js](https://nextjs.org/docs/getting-started) usando la guía oficial.

### Otras opciones {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/) te permite generar sitios web estáticos con React y GraphQL.
* [Razzle](https://razzlejs.org/) es un framework para el renderizado del lado del servidor que no requiere ninguna configuración, pero ofrece más flexibilidad que Next.js.
=======
## Building with a full-featured framework {/*building-with-a-full-featured-framework*/}

If you're looking to **start a production-ready project,** [Next.js](https://nextjs.org/) is a great place to start. Next.js is a popular, lightweight framework for static and server‑rendered applications built with React. It comes pre-packaged with features like routing, styling, and server-side rendering, getting your project up and running quickly. 

The [Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) tutorial is a great introduction to building with React and Next.js.

### Popular alternatives {/*popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

## Cadenas personalizadas {/*custom-toolchains*/}

<<<<<<< HEAD
Puede que prefieras crear y configurar tu propia cadena de herramientas. Una cadena de herramientas de construcción para JavaScript consiste en:

* Un **manejador de paquetes**-te permite instalar, actualizar y manejar paquetes de terceros. [Yarn](https://yarnpkg.com/) y [npm](https://www.npmjs.com/) son dos manejadores de paquetes populares.
* Un **bundler (empaquetador)**-te permite escribir código modular y mezclarlo en pequeños paquetes para optimizar los tiempos de carga. [Webpack](https://webpack.js.org/), [Snowpack](https://www.snowpack.dev/) y [Parcel](https://parceljs.org/) son varios *bundlers* populares.
* Un **compilador**-te permite escribir código moderno de JavaScript que funciona en navegadores más antiguos. [Babel](https://babeljs.io/) es un ejemplo.

En un proyecto más grande, puede que también quieras tener una herramienta que maneje múltiples paquetes en un solo repositorio. [Nx](https://nx.dev/react) es un ejemplo de este tipo de herramienta.

Si prefieres configurar tu propia cadena de herramientas desde cero, [consulta esta guía](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) que recrea algunas de las funcionalidades de CreateReactApp.
=======
You may prefer to create and configure your own toolchain. A toolchain typically consists of:

* A **package manager** lets you install, update, and manage third-party packages. Popular package managers: [npm](https://www.npmjs.com/) (built into Node.js), [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/).
* A **compiler** lets you compile modern language features and additional syntax like JSX or type annotations for the browsers. Popular compilers: [Babel](https://babeljs.io/), [TypeScript](http://typescript.org/), [swc](https://swc.rs/).
* A **bundler** lets you write modular code and bundle it together into small packages to optimize load time. Popular bundlers: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc](https://swc.rs/).
* A **minifier** makes your code more compact so that it loads faster. Popular minifiers: [Terser](https://terser.org/), [swc](https://swc.rs/).
* A **server** handles server requests so that you can render components to HTML. Popular servers: [Express](https://expressjs.com/).
* A **linter** checks your code for common mistakes. Popular linters: [ESLint](https://eslint.org/).
* A **test runner** lets you run tests against your code. Popular test runners: [Jest](https://jestjs.io/).

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality. A framework will usually also provide a routing and a data fetching solution. In a larger project, you might also want to manage multiple packages in a single repository with a tool like [Nx](https://nx.dev/react).

>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4
