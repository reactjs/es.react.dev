---
title: Iniciar un nuevo proyecto de React
---

<Intro>

Si estás iniciando un nuevo proyecto, recomendamos usar una cadena de herramientas (*toolchain*) o un *framework*. Estas herramientas proporcionan un entorno de desarrollo cómodo, pero requieren una instalación local de Node.js.

</Intro>

<YouWillLearn>

* En qué se diferencian las cadenas de herramientas de los *frameworks*
* Cómo iniciar un proyecto con una cadena de herramientas mínima
* Cómo iniciar un proyecto con un *framework* con todas las funcionalidades
* Qué hay dentro de las cadenas de herramientas y *frameworks* populares

</YouWillLearn>

## Escoge tu propia aventura {/*choose-your-own-adventure*/}

React es una biblioteca que te permite organizar código de UI al separarla en piezas llamadas componentes. React no se preocupa por el enrutamiento o el manejo de datos. Esto significa que hay varias formas de comenzar un proyecto en React:

* [Comenzar con un archivo **HTML y una etiqueta script**.](/learn/add-react-to-a-website) Esto no requiere una configuración de Node.js, pero ofrece funcionalidades limitadas.
* Comenzar con una **configuración mínima con solo una cadena de herramientas (_toolchain_)** y añadir funcionalidades a tu proyecto mientras se hagan necesarias. (Estupendo para aprender)!
* Comenzar con un **framework más rígido** con funcionalidades comunes ya incluidas.

## Iniciándote con una cadena de herramientas de React {/*getting-started-with-a-react-toolchain*/}

Si **estás aprendiendo React,** te recomendamos [Create React App](https://create-react-app.dev/). Es la forma más popular de probar React y de construir una nueva aplicación de una sola página del lado del cliente. Está hecha para React pero sin opiniones para el enrutamiento o la carga de datos:

Primero, instala [Node.js](https://nodejs.org/en/). Luego abre tu terminal y ejecuta esta línea para crear un proyecto:

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Ahora puedes ejecutar tu aplicación con:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

Para más información, [consulta la guía oficial](https://create-react-app.dev/docs/getting-started).

> Create React App no maneja la lógica del *backend* o las bases de datos. Puedes usarla con cualquier *backend*. Cuando construyes un proyecto, obtendrás una carpeta con código estático de HTML, CSS y JS. Dado que Create React App no puede beneficiarse de lo que ofrece el servidor, no proporciona el mejor rendimiento. Si buscas mejores tiempos de carga y funcionalidades integradas como enrutamiento y lógica del lado de servidor, recomendamos que uses en su lugar un *framework*.

### Alternativas populares {/*popular-alternatives*/}

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)

## Construir con un framework con todas las funcionalidades {/*building-with-a-full-featured-framework*/}

Si estás pensando en **comenzar un proyecto listo para producción,** [Next.js](https://nextjs.org/) es un muy buen lugar para comenzar. Next.js es un framework popular y ligero para aplicaciones hechas con React ya sean estáticas o renderizadas del lado del servidor. Viene preempaquetado con funcionalidades como enrutamiento, estilos, y renderizado del lado del servidor, lo que permite comenzar un proyecto rápidamente.

El tutorial [*Next.js Foundations*](https://nextjs.org/learn/foundations/about-nextjs) es una estupenda introducción a cómo construir con React y Next.js.

### Alternativas populares {/*popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## Cadenas personalizadas {/*custom-toolchains*/}

Puede que prefieras crear y configurar tu propia cadena de herramientas. Una cadena de herramientas generalmente está compuesta por:

* Un **manejador de paquetes** te permite instalar, actualizar y manejar paquetes de terceros. Manejadores de paquetes populares: [npm](https://www.npmjs.com/) (integrado en Node.js), [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/).
* Un **compilador** te permite compilar para los navegadores funcionalidades modernas del lenguaje y sintaxis adicional como JSX o anotaciones de tipo. Compiladores populares: [Babel](https://babeljs.io/), [TypeScript](http://typescript.org/), [swc](https://swc.rs/).
* Un **bundler (empaquetador)** te permite escribir código modular y mezclarlo en paquetes más pequeños para optimizar el tiempo de carga. *Bundlers* populares: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc](https://swc.rs/).
* Un **minificador** hace tu código más compacto para que cargue más rápido. Minificadores populares: [Terser](https://terser.org/), [swc](https://swc.rs/).
* Un **servidor** maneja las peticiones al servidor para que puedas renderizar componentes en HTML. Servidores populares: [Express](https://expressjs.com/).
* Un **linter** chequea tu código buscando errores comunes. Linters populares: [ESLint](https://eslint.org/).
* Un **test runner (sistema de ejecución de pruebas)** te permite ejecutar tus pruebas contra tu código. Test runners populares: [Jest](https://jestjs.io/).

Si prefieres configurar tu propia cadena de herramientas desde cero, [consulta esta guía](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) que recrea algunas de las funcionalidades de Create React App. Un *framework* usualmente también proporcionará una solución para enrutamiento y carga de datos. En un proyecto más grande, puede que también quieras manejar múltiples paquetes en un solo repositorio con una herramienta como [Nx](https://nx.dev/react) o [Turborepo](https://turborepo.org/).
