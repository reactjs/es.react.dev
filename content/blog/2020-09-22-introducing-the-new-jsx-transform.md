---
title: "Introducción a la nueva transformación de JSX"
author: [lunaruan]
---

Aunque React 17 [no tiene nuevas funcionalidades](/blog/2020/08/10/react-v17-rc.html), brindará soporte para la nueva transformación de JSX. En este post, describiremos qué es y cómo probarlo.

## ¿Qué es una transformación de JSX? {#whats-a-jsx-transform}

Los navegadores no entienden JSX por defecto, por lo que la mayoría de usuarios de React utilizan un compilador como Babel o TypeScript para **transformar el código JSX en JavaScript normal**. Muchos kit de herramientas preconfigurados como Create React App o Next.js también incluyen una transformación de JSX internamente.

Junto con el lanzamiento de React 17, queríamos hacer algunas mejoras en la transformación de JSX, pero no queríamos romper las configuraciones existentes. Es por eso que [trabajamos con Babel](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154) para **ofrecer una nueva versión reescrita de la transformación de JSX** para las personas que quisieran actualizar.

La actualización a la nueva transformación es opcional, pero tiene algunos beneficios:

* Con la nueva transformación, puedes **usar JSX sin importar React**.
* Dependiendo de tu configuración, tu salida compilada puede **mejorar ligeramente el tamaño del paquete**.
* Permitirá futuras mejoras que **reducen la cantidad de conceptos** que necesita para aprender React.

**Esta actualización no cambiará la sintaxis de JSX y no es necesaria.** La antigua transformación de JSX seguirá funcionando como de costumbre y no hay planes para quitarle el soporte.


[React 17 RC](/blog/2020/08/10/react-v17-rc.html) ya incluye soporte para la nueva transformación, ¡así que pruébalo! Para que sea más fácil de adoptar, después del lanzamiento de React 17, también planeamos respaldar su soporte a React 16.x, React 15.x, y React 0.14.x. Puedes encontrar las instrucciones de actualización para diferentes herramientas a [continuación](#how-to-upgrade-to-the-new-jsx-transform).

Ahora echemos un vistazo más de cerca a las diferencias entre la transformación antigua y la nueva.

## ¿Qué es diferente en la nueva transformación? {#whats-different-in-the-new-transform}

Cuando usas JSX, el compilador lo transforma en llamadas a la función React que el navegador pueda entender. **La antigua transformación de JSX** convirtió JSX en llamadas a `React.createElement(...)`.

Por ejemplo, digamos que tu código fuente se ve así:

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

Internamente, la antigua transformación de JSX lo convierte en JavaScript normal:

```js
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

>Nota
>
>**Tu código fuente no necesita cambiar de ninguna manera.** Estamos describiendo cómo la tranformación de JSX convierte tu código fuente JSX en código JavaScript que un navegador puede entender.

Sin embargo, esto no es perfecto:

* Debido a que JSX se compiló en `React.createElement`, `React` bebe estar dentro del alcance si usa JSX.
* Hay algunas [mejoras de rendimiento y simplicaciones](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation) que `React.createElement` no permiten.

Para resolver estos problemas, React 17 introduce dos nuevos puntos de entrada al paquete React que están destinados a ser utilizados solo por compiladores como Babel y TypeScript. En lugar de transformar JSX en `React.createElement`, **la nueva transformación de JSX** importa automáticamente funciones especiales de esos nuevos puntos de entrada en el paquete de React y las llama.

Digamos que tu código fuente se ve así:

```js
function App() {
  return <h1>Hello World</h1>;
}
```

Esto es lo que compila la nueva transformación de JSX:

```js
// Inserted by a compiler (don't import it yourself!)
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

¡Ten en cuenta que nuestro código original **ya no necesita importar React** para usar JSX! (Pero aún necesitaríamos importar React para poder usar Hooks u otras exportaciones que proporciona React.)

**Este cambio es totalmente compatible con todo el código JSX existente**, por lo que no tendrás que cambiar tus componentes. Si tienes curiosidad, puedes consultar el [RFC técnico](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#detailed-design) para obtener más detalles sobre cómo funciona la nueva transformación.

> Nota
>
> Las funciones dentro de `react/jsx-runtime` y `react/jsx-dev-runtime` solo deben ser usadas por la transformación del compilador. Si necesitas crear elementos manualmente en tu código, debes seguir usando `React.createElement`. Seguirá funcionando y no desaparecerá.

## Cómo actualizar a la nueva transformación de JSX {#how-to-upgrade-to-the-new-jsx-transform}

Si no estás listo para actualizar a la nueva transformación de JSX o si estás utilizando JSX para otra biblioteca, no te preocupes. La transformación anterior no se eliminará y seguirá siendo compatible.

Si deseas actualizar, necesitarás dos cosas:

* **Una versión de React que admita la nueva transformación** (actualmente, solo [React 17 RC](/blog/2020/08/10/react-v17-rc.html) lo admite, pero después de que se haya lanzado React 17.0, planeamos hacer versiones compatibles adicionales para 0.14.x, 15.x y 16.x).
* **Un compilador compatible** (consulta las instrucciones para las diferentes herramientas a continuación).

Dado que la nueva transformación de JSX no requiere que React esté dentro del alcance, [también hemos preparado un script automatizado](#removing-unused-react-imports) que eliminará las importaciones innecesarias de tu código base.

### Create React App {#create-react-app}

[Se ha agregado](https://github.com/facebook/create-react-app/pull/9645) compatibilidad con Create React Appp y estará disponible en la [próxima versión v4.0](https://gist.github.com/iansu/4fab7a9bfa5fa6ebc87a908c62f5340b) que actualmente se encuentra en prueba beta.

### Next.js {#nextjs}

Next.js [v9.5.3](https://github.com/vercel/next.js/releases/tag/v9.5.3)+ usa la nueva transformación para versiones compatibles de React.

### Gatsby {#gatsby}

Gatsby [v2.24.5](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/CHANGELOG.md#22452-2020-08-28)+ usa la nueva transformación para versiones compatibles de React.

>Nota
>
>Si recibes [este error de Gatsby](https://github.com/gatsbyjs/gatsby/issues/26979) después de actualizar a React `17.0.0-rc.2`, ejecuta `npm update` para solucionarlo.

### Configuración manual de Babel {#manual-babel-setup}

El soporte para la nueva transformación de JSX está disponible en Babel [v7.9.0](https://babeljs.io/blog/2020/03/16/7.9.0) y superior.

Primero, deberás actualizar a la última transformación de Babel y complementos.

Si estás usando `@babel/plugin-transform-react-jsx`:

```bash
# for npm users
npm update @babel/core @babel/plugin-transform-react-jsx
```

```bash
# for yarn users
yarn upgrade @babel/core @babel/plugin-transform-react-jsx
```

Si estás usando `@babel/preset-react`:

```bash
# for npm users
npm update @babel/core @babel/preset-react
```

```bash
# for yarn users
yarn upgrade @babel/core @babel/preset-react
```

Actualmente, la antigua transformación (`"runtime": "classic"`) es la opción predeterminada. Para habilitar la nueva transformación, puede pasar `{"runtime": "automatic"}` como una opción a `@babel/plugin-transform-react-jsx` o `@babel/preset-react`:

```js
// If you are using @babel/preset-react
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}
```

```js
// If you're using @babel/plugin-transform-react-jsx
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "runtime": "automatic"
    }]
  ]
}
```

A partir de Babel 8, `"automatic"` será el tiempo de ejecución para ambos complementos. Para obtener más información, consulta la documentación de Babel para [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) y [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react).

> Nota
>
> Si usas JSX con una biblioteca que no sea React, puedes usar [la opción `importSource`](https://babeljs.io/docs/en/babel-preset-react#importsource) para importar desde esa biblioteca -- siempre que proporcione los puntos de entrada necesarios. Alternativamente, puedes seguir usando la transformación clásica que seguirá siendo compatible.

### ESLint {#eslint}

Si estás utilizando [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), las reglas `react/jsx-uses-react` y `react/react-in-jsx-scope` ya no son necesarias y se pueden desactivar o eliminar.

```js
{
  // ...
  "rules": {
    // ...
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### TypeScript {#typescript}

TypeScript adminte la transformación de JSX en [v4.1 beta](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#jsx-factories).

### Flow {#flow}

Flow admite la transformación de JSX en [v0.126.0](https://github.com/facebook/flow/releases/tag/v0.126.0) y posteriores.

## Eliminación de importaciones React no utilizadas {#removing-unused-react-imports}

Debido a que la nueva transformación de JSX importará automáticamente las funciones `react/jsx-runtime` necesarias, React no necesitará estar dentro del alcance cuando use JSX. Esto podría dar lugar a importaciones de React no utilizadas en tu código. No está de más conservarlos, pero si deseas eliminarlos, te recomendamos que ejecutes un script [“codemod”](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) para eliminarlos automáticamente:

```bash
cd your_project
npx react-codemod update-react-imports
```

>Nota
>
>Si recibes errores al ejecutar el codificador, intenta especificar un dialecto de JavaScript diferente cuando `npx react-codemod update-react-imports` te pida que elijas uno. En particular, en este momento, la configuración "JavaScript con Flow" admite una sintaxis más nueva que la configuración de "JavaScript", incluso si no usas Flow. [Crea un issue](https://github.com/reactjs/react-codemod/issues) si tienes problemas.
>
>Ten en cuenta que la salida de codificación no siempre coincidirá con el estilo de codificación de tu proyecto, por lo que es posible que desees ejecutar [Prettier](https://prettier.io/) después de que finalice la codificación para lograr un formateo coherente.


Ejecutar este codificador:

* Elimina todas las importaciones de React no utilizadas como resultado de la actualización a la nueva transformación JSX.
* Cambia todas las importaciones de React predeterminadas (es decir `import React from "react"`) a importaciones con nombre desestructuradas (ej. `import { useState } from "react"`), que será el estilo preferido en el futuro. Este código codificado **no** afectará las importaciones de namespaces existentes (es decir `import * as React from "react"`) que también es un estilo válido. Las importaciones predeterminadas seguirán funcionando en React 17, pero a largo plazo recomendamos alejarse de ellas.

Por ejemplo,

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

será reemplazado con

```js
function App() {
  return <h1>Hello World</h1>;
}
```

Si usas alguna otra importación de React, por ejemplo, un Hook, entonces el codificador lo convertirá en una importación con nombre.

por ejemplo,

```js
import React from 'react';

function App() {
  const [text, setText] = React.useState('Hello World');
  return <h1>{text}</h1>;
}
```

será reemplazado con

```js
import { useState } from 'react';

function App() {
  const [text, setText] = useState('Hello World');
  return <h1>{text}</h1>;
}
```

Además de limpiar las importaciones no utilizadas, esto también te ayudará a prepararse para una futura versión principal de React (no React 17) que admitirá los módulos ES y no tendrás una exportación predeterminada.

## Gracias {#thanks}

Nos gustaría agradecer a los mantenedores de Babel, TypeScript, Create React App, Next.js, Gatsby, ESLint y Flow por su ayuda para implementar e integrar la nueva transformación de JSX. También queremos agradecer a la comunidad React por sus comentarios y discusiones sobre el [RFC técnico](https://github.com/reactjs/rfcs/pull/107) relacionado.
