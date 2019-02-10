---
id: static-type-checking
title: Comprobación de tipo estático
permalink: docs/static-type-checking.html
prev: typechecking-with-prototypes.html
next: refs-and-the-dom.html
---

Comprobador de tipo estático [Flow](https://flow.org/) y [TypeScript](https://www.typescriptlang.org/) identifican cierto tipo de problemas incluso antes de ejecutar tu código. También pueden mejorar el flujo de trabajo del desarrollador al agregar características como la finalización automática. Por este motivo, recomendamos utilizar Flow o TypeScript en lugar de `PropTypes` para bases de código más grandes.

## Flow {#flow}

[Flow](https://flow.org/) es un comprobador de tipo estático para tu código JavaScript. Desarrollado por Facebook y a menudo usado con React. te permite escribir las variables, funciones y componentes React con una sintaxis de tipo especial, detectando antes los errores. Puedes leer una [Introducción a Flow](https://flow.org/en/docs/getting-started/) para conocer sus conceptos básicos.

Para usar Flow, tu necesitas:

* Agregar Flow como una dependencia a tu proyecto.
* Asegúrate que la sintaxis de Flow se elimina del código compilado.
* Agregue comentarios de tipo y ejecute Flow para verificarlos.

Vamos a explicar estos pasos a continuación en detalle.

### Agregando Flow a tu proyecto {#adding-flow-to-a-project}

Primero, navega hasta el directorio donde está tu proyecto, en la terminal, Deberás ejecutar el siguiente comando:

 Si usas [Yarn](https://yarnpkg.com/), ejecuta:

```bash
yarn add --dev flow-bin
```

Si usas [npm](https://www.npmjs.com/), ejecuta:

```bash
npm install --save-dev flow-bin
```

Este comando instala la última versión de Flow en tu proyecto.

Ahora, agrega `flow` a la sección `"scripts"` del `package.json` en tu proyecto, así podrás usarlo desde la terminal:

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

Finalmente, ejecuta uno de los siguientes comandos:

Si usas [Yarn](https://yarnpkg.com/), ejecuta:

```bash
yarn run flow init
```

Si usas [npm](https://www.npmjs.com/), ejecuta:

```bash
npm run flow init
```

Este comando creará un archivo de configuración de Flow que deberás confirmar (commit).

### Elimminando la sintaxis de Flow del código compilado {#stripping-flow-syntax-from-the-compiled-code}

Flow extiende el lenguaje JavaScript con una sintaxis especial para declaraciones y anotaciones de tipo. Sin embargo, los navegadores no interpretan esta sintaxis, por lo que debes asegurarte de que no termine en el paquete compilado de JavaScript que envías al navegador.

La forma exacta de hacerlo depende de las herramientas que utilices para compilar JavaScript.

#### Comando Create React App {#create-react-app}

Si tu proyecto fue configurado usando el comando [Create React App](https://github.com/facebookincubator/create-react-app), Felicitaciones! Las declaraciones y anotaciones de Flow ya se están eliminando de forma predeterminada, por lo que no necesitas nada más en este paso.

#### Babel {#babel}

>Nota:
>
>Estas instrucciones **NO** son para usuarios que usaron Create React App. aunque la aplicación creada con este comando usa babel, ya esta configurada para entender Flow. Solo siga este paso si **NO** usaste dicho comando.

Si configuró manualmente Babel para su proyecto, deberás instalar un ajuste preestablecido especial para Flow.

Si usas Yarn, ejecuta:

```bash
yarn add --dev babel-preset-flow
```

Si usas npm, ejecuta:

```bash
npm install --save-dev babel-preset-flow
```

Luego agrega el preajuste `flow` a tu [Configuración de Babel](https://babeljs.io/docs/usage/babelrc/). Por ejemplo, si configuraste Babel a través del archivo `.babelrc`, podría verse así:

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

Esto te permitirá usar la sintaxis de Flow en tu código.

>Nota:
>
>Flow no requiere el preajuste `react`, pero a menudo se usan juntos. Flow en si mismo entiende la sintaxis JSX fuera de la caja.

#### Otras configuraciones {#other-build-setups}

Si no usaste el comando Create React App o Babel, puedes usar [flow-remove-types](https://github.com/flowtype/flow-remove-types) para eliminar las anotaciones de tipo.

### Corriendo Flow {#running-flow}

Si seguiste las instrucciones anteriores, deberías poder ejecutar Flow por primera vez.

```bash
yarn flow
```

Si usas npm, ejecuta:

```bash
npm run flow
```

Deberías ver un mensaje como el siguiente:

```
No errors!
✨  Done in 0.17s.
```

### Agregando anotaciones de tipo Flow {#adding-flow-type-annotations}

Por defecto, Flow solo verifica los archivos que incluyen esta anotación:

```js
// @flow
```

Nomalmente se coloca en la parte superior de un archivo. Intente agregarlo a algunos archivos en tu proyecto y ejecute `yarn flow` o `npm run flow` para que mires si Flow ya encontró algún problema.

También hay [una opción](https://flow.org/en/docs/config/options/#toc-all-boolean) para forzar a Flow a verificar **todos** los archivos independientemente de la anotación. Esto puede ser demaciado ruidoso para los proyectos existentes, pero es razonable para un nuevo proyecto si desea escribirlo completamente con Flow.

Ahora estás listo! Te recomendamos consultar los siguientes recursos para obtener más información sobre Flow:

* [Documentación Flow: Anotaciones de tipo](https://flow.org/en/docs/types/)
* [Documentación Flow: Editores](https://flow.org/en/docs/editors/)
* [Documentación Flow: React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) Es un lenguaje de programación desarrollado por Microsoft.  Es un superconjunto escrito de JavaScript e incluye su propio compilador. Al ser un lenguaje escrito, TypeScript puede detectar errores y fallos en el momento de la creación, mucho antes de que tu aplicación entre en funcionamiento. Puedes obtener más información sobre el uso de TypeScript con React [Aquí](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

Para usar TypeScript, necesitas:
* Agregar TypeScript como una dependencia en tu proyecto.
* Configurar las opciones del compilador de TypeScript.
* Usa las extensiones de archivo correctas.
* Agregue definiciones para las bibliotecas que usa.

Repasemos esto en detalle..

### Usando TypeScript con Create React App {#using-typescript-with-create-react-app}

El comando Create React App soporta TypeScript fuera de la caja.

Para crear un **nuevo proyecto** con soporte TypeScript, ejecute:

```bash
npx create-react-app my-app --typescript
```

También puedes agregarlo a un **proyecto existente Create React App**, [documentación aquí](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Nota:
>
>Si tu usas Create React App, tu puedes **omitir el resto de esta página**. Describe la configuración manual que no se aplica a los usuarios de este comando.


### Agregando TypeScript a tu proyecto {#adding-typescript-to-a-project}
Todo comienza con ejecutar un comando en tu terminal.

Si tu usas [Yarn](https://yarnpkg.com/), ejecuta:

```bash
yarn add --dev typescript
```

Si tu usas [npm](https://www.npmjs.com/), ejecuta:

```bash
npm install --save-dev typescript
```

Felicidades Has instalado la última versión de TypeScript en tu proyecto. Instalar TypeScript nos da acceso al comando `tsc`. Antes de la configuración, agreguemos `tsc` a la sección de" scripts "en nuestro `package.json`:

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### Configurando el compilador de TypeScript {#configuring-the-typescript-compiler}
El compilador no nos sirve de nada hasta que le decimos qué hacer. En TypeScript, estas reglas se definen en un archivo especial llamado `tsconfig.json`. Para generar este archivo ejecute:

```bash
tsc --init
```

Mirando el `tsconfig.json` generado ahora, puede ver que hay muchas opciones que puede usar para configurar el compilador. Para obtener una descripción detallada de todas las opciones, consulte [aquí](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

De las muchas opciones, veremos `rootDir` y `outDir`. De esta manera, el compilador tomará los archivos de typescript y generará archivos de javascript. Sin embargo, no queremos confundirnos con nuestros archivos de origen y la salida generada.

Abordaremos esto en dos pasos:
* En primer lugar, vamos a organizar nuestra estructura de proyecto de esta manera. Pondremos todo nuestro código fuente en el directorio `src`.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* A continuación, le diremos al compilador dónde está nuestro código fuente y dónde debería ir la salida.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

¡Genial! Ahora, cuando ejecutamos nuestro script de compilación, el compilador enviará el javascript generado a la carpeta `build`. El [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) proporciona un `tsconfig.json` con un buen conjunto de reglas para comenzar.

En general, no deseas mantener el javascript generado en tu control de código fuente, así que asegúrate de agregar la carpeta de compilación a tu `.gitignore`.

### Extensiones de archivo {#file-extensions}
En React, lo más probable es que escribas tus componentes en un archivo `.js`. En TypeScript tenemos 2 extensiones de archivo.:

`.ts` es la extensión de archivo predeterminada, mientras que `.tsx` es una extensión especial que se usa para los archivos que contienen `JSX`.

### Corriendo TypeScript {#running-typescript}
Si seguiste las instrucciones anteriores, deberías poder ejecutar TypeScript por primera vez.

Si usas yarn, ejecuta:

```bash
yarn build
```

Si usas npm, ejecuta:

```bash
npm run build
```

Si no ves ninguna salida, significa que se completó correctamente.

### Tipo de definiciones {#type-definitions}
Para poder mostrar errores y sugerencias de otros paquetes, el compilador se basa en archivos de declaración. Un archivo de declaración proporciona toda la información de tipo sobre una biblioteca. Esto nos permite usar bibliotecas javascript como las de npm en nuestro proyecto.

Hay dos formas principales de obtener declaraciones para una biblioteca.:

__Bundled__ - La biblioteca tiene sus propios archivos de declaración bundles. Esto es genial para nosotros, ya que todo lo que tenemos que hacer es instalar la biblioteca, y podemos usarla de inmediato. Para verificar si una biblioteca tiene tipos bundles, busque un archivo `index.d.ts` en el proyecto. Algunas bibliotecas lo tendrán especificado en su `package.json` bajo el campo `typings` o `types`.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped es un gran repositorio de declaraciones para bibliotecas que no incluyen un archivo bundle. Las declaraciones son de carácter público y son administradas por Microsoft y colaboradores de código abierto. React, por ejemplo, no incluye su propio archivo de declaración. En su lugar, podemos obtenerlo de DefinitelyTyped. Para ello ingresa este comando en tu terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Local Declarations__
A veces, el paquete que desea utilizar no incluye declaraciones bundle ni está disponible en DefinitelyTyped. En ese caso, podemos tener un archivo de declaración local. Para hacer esto, cree un archivo `declarations.d.ts` en la raíz de tu directorio de origen. Una simple declaración podría verse así:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

¡Ya estás listo para codificar! Recomendamos consultar los siguientes recursos para obtener más información sobre TypeScript:

* [Documentación TypeScript: Tipos Basicos](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [Documentación TypeScript: Migración desde Javascript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [Documentación TypeScript: React y Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/) no es un lenguaje nuevo; Es una nueva sintaxis y una cadena de herramientas desarrollada por el lenguaje probado en batalla, [OCaml](https://ocaml.org/). Reason le da a OCaml una sintaxis familiar orientada a los programadores de JavaScript, y se dirige a los flujos de trabajo existentes de NPM/Yarn que ya conocen.

Reason se desarrolla en Facebook y se usa en algunos de sus productos como Messenger. Todavía es un tanto experimental, pero tiene [enlaces de React dedicados](https://reasonml.github.io/reason-react/) mantenidos por Facebook y una [comunidad vibrante](https://reasonml.github.io/docsen/community.html).

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) es un lenguaje de tipo estático desarrollado por JetBrains. Sus plataformas de destino incluyen JVM, Android, LLVM y [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html).

JetBrains desarrolla y mantiene varias herramientas específicamente para la comunidad React: [React bindings](https://github.com/JetBrains/kotlin-wrappers) así como [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). Este último te ayuda a comenzar a crear aplicaciones React con Kotlin sin configuración de compilación.

## Otros lenguajes {#other-languages}

Tenga en cuenta que hay otros lenguajes de tipo estático que se compilan en JavaScript y, por lo tanto, son compatibles con React. Por ejemplo, [F#/Fable](http://fable.io)with [elmish-react](https://elmish.github.io/react). Visite sus respectivos sitios para obtener más información y siéntete libre de agregar más idiomas tipificados estáticamente que funcionan con React a esta página!
