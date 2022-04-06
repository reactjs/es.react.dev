---
title: Iniciar un nuevo proyecto de React
---

<Intro>

Si estás aprendiendo React o estás considerando añadirlo a un proyecto existente, puedes comenzar rápidamente por [añadir React a cualquier página HTML con etiquetas script](/learn/add-react-to-a-website). ¡Si tu proyecto va a necesitar muchos componentes y muchos archivos, podría ser hora de que consideres la opción que hay debajo!

</Intro>

## Escoge tu propia aventura {/*choose-your-own-adventure*/}

React es una biblioteca que te permite organizar código de IU al separarla en piezas que se nombran componentes. React no se preocupa por el enrutamiento o el manejo de datos. Para estas funcionalidades necesitarás usar bibliotecas de terceros o escribir tus propias soluciones. Esto significa que hay varias formas de comenzar un proyecto en React:

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

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Ahora puedes ejecutar tu aplicación con:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

Para más información, [consulta la guía oficial](https://create-react-app.dev/docs/getting-started).

> Create React App no maneja la lógica del *backend* o las bases de datos; solo crea una línea de construcción. Esto significa que puedes utilizar cualquier *backend* que desees. ¡Pero si estás buscando más funcionalidades como enrutamiento y lógica del lado del servidor, continúa leyendo!

### Otras opciones {/*other-options*/}

Create React App es magnífica para iniciar a trabajar con React, pero si quisieras una cadena de herramientas aún más ligera, puedes probar alguna de estas otras que son populares:

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)
* [Snowpack](https://www.snowpack.dev/tutorials/react)

## Construir con React y un framework {/*building-with-react-and-a-framework*/}

Si estás pensando en construir un proyecto más grande listo para producción, [Next.js](https://nextjs.org/) es un muy buen lugar para comenzar. Next.js es un framework popular y ligero para aplicaciones hechas con React ya sean estáticas o renderizadas del lado del servidor. Viene preempaquetado con funcionalidades como enrutamiento, estilos, y renderizado del lado del servidor, lo que permite comenzar un proyecto rápidamente.

[Comienza a construir con Next.js](https://nextjs.org/docs/getting-started) usando la guía oficial.

### Otras opciones {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/) te permite generar sitios web estáticos con React y GraphQL.
* [Razzle](https://razzlejs.org/) es un framework para el renderizado del lado del servidor que no requiere ninguna configuración, pero ofrece más flexibilidad que Next.js.

## Cadenas personalizadas {/*custom-toolchains*/}

Puede que prefieras crear y configurar tu propia cadena de herramientas. Una cadena de herramientas de construcción para JavaScript consiste en:

* Un **manejador de paquetes**-te permite instalar, actualizar y manejar paquetes de terceros. [Yarn](https://yarnpkg.com/) y [npm](https://www.npmjs.com/) son dos manejadores de paquetes populares.
* Un **bundler (empaquetador)**-te permite escribir código modular y mezclarlo en pequeños paquetes para optimizar los tiempos de carga. [Webpack](https://webpack.js.org/), [Snowpack](https://www.snowpack.dev/) y [Parcel](https://parceljs.org/) son varios *bundlers* populares.
* Un **compilador**-te permite escribir código moderno de JavaScript que funciona en navegadores más antiguos. [Babel](https://babeljs.io/) es un ejemplo.

En un proyecto más grande, puede que también quieras tener una herramienta que maneje múltiples paquetes en un solo repositorio. [Nx](https://nx.dev/react) es un ejemplo de este tipo de herramienta.

Si prefieres configurar tu propia cadena de herramientas desde cero, [consulta esta guía](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) que recrea algunas de las funcionalidades de CreateReactApp.
