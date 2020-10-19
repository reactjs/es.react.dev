---
id: code-splitting
title: División de código
permalink: docs/code-splitting.html
---

## *Bundling* {#bundling}

<<<<<<< HEAD
La mayoría de las aplicaciones React tendrán sus archivos "empaquetados" o *bundled* con herramientas como
[Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) o 
[Browserify](http://browserify.org/).
El *bundling* es el proceso de seguir los archivos importados y fusionarlos en un
archivo único: un *bundle* o "paquete". Este *bundle* se puede incluir en una página web para cargar 
una aplicación completa de una sola vez.
=======
Most React apps will have their files "bundled" using tools like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or [Browserify](http://browserify.org/). Bundling is the process of following imported files and merging them into a single file: a "bundle". This bundle can then be included on a webpage to load an entire app at once.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

#### Ejemplo {#example}

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Nota:
>
> Tus *bundles* van a lucir muy diferente a esto.

<<<<<<< HEAD
Si usas [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), o una herramienta similar, vas a tener una configuración de Webpack incluida para generar el *bundle* de tu
aplicación.

Si no, tú mismo vas a tener que configurar el *bundling*. Por ejemplo, revisa las guías [Installation](https://webpack.js.org/guides/installation/) y
[Getting Started](https://webpack.js.org/guides/getting-started/) en la documentación de Webpack.
=======
If you're using [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your app.

If you aren't, you'll need to setup bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

## División de código {#code-splitting}

<<<<<<< HEAD
El *Bundling* es genial, pero a medida que tu aplicación crezca, tu *bundle* también crecerá. Especialmente
si incluyes grandes bibliotecas de terceros. Necesitas vigilar el código que incluyes en tu *bundle*, de manera que no lo hagas accidentalmente tan grande que tu aplicación se tome mucho tiempo en cargar.

Para evitar terminar con un *bundle* grande, es bueno adelantarse al problema
y comenzar a dividir tu *bundle*. División de código es una funcionalidad disponible en *bundlers* como [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) y Browserify (vía [factor-bundle](https://github.com/browserify/factor-bundle)) que puede crear múltiples *bundles* a ser cargados dinámicamente durante la ejecución de tu aplicación.

Dividir el código de tu aplicación puede ayudarte a cargar solo lo necesario en cada momento para el usuario, lo cual puede mejorar dramáticamente el rendimiento de tu aplicación. Si bien no habrás reducido la cantidad total de código en tu aplicación,
habrás evitado cargar código que el usuario podría no necesitar nunca, y reducido la cantidad necesaria
de código durante la carga inicial.


## `import()` {#import}

La mejor manera de introducir división de código en tu aplicación es a través de la sintaxis de `import()` dinámico.
=======
Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. You need to keep an eye on the code you are including in your bundle so that you don't accidentally make it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it's good to get ahead of the problem and start "splitting" your bundle. Code-Splitting is a feature
supported by bundlers like [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) and Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) which can create multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you "lazy-load" just the things that are currently needed by the user, which can dramatically improve the performance of your app. While you haven't reduced the overall amount of code in your app, you've avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.

## `import()` {#import}

The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

**Antes:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Después:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

<<<<<<< HEAD
Cuando Webpack se encuentra esta sintaxis, comienza a dividir el código de tu
aplicación automáticamente. Si estás usando Create React App, esto ya viene
configurado para ti y puedes comenzar a [usarlo](https://create-react-app.dev/docs/code-splitting/). También es compatible por defecto en [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

Si configuras Webpack por ti mismo, probablemente vas a querer leer la [guía sobre división de código](https://webpack.js.org/guides/code-splitting/) de Webpack. Tu configuración de Webpack debería verse vagamente [como esta](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Cuando uses [Babel](https://babeljs.io/), tienes que asegurarte de que Babel reconozca la sintaxis de `import()` dinámico pero no la transforme. Para ello vas a necesitar el [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).
=======
When Webpack comes across this syntax, it automatically starts code-splitting your app. If you're using Create React App, this is already configured for you and you can [start using it](https://create-react-app.dev/docs/code-splitting/) immediately. It's also supported out of the box in [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](https://babeljs.io/), you'll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

## `React.lazy` {#reactlazy}

> Nota:
>
> `React.lazy` y Suspense aún no están disponibles para hacer renderización del lado del servidor. Si quieres hacer división de código en una aplicación renderizada en el servidor, recomendamos [Loadable Components](https://github.com/gregberge/loadable-components). Tiene una buena [guía para dividir bundles con renderización del lado del servidor](https://loadable-components.com/docs/server-side-rendering/).

La función `React.lazy` te deja renderizar un *import* dinámico como un componente regular.

**Antes:**

```js
import OtherComponent from './OtherComponent';
```

**Después:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

`React.lazy` recibe una función que debe ejecutar un `import()` dinámico. Este debe retornar una `Promise` que se resuelve en un módulo con un *export* `default` que contenga un componente de React.

El componente lazy debería entonces ser renderizado adentro de un componente `Suspense`, lo que nos permite mostrar algún contenido predeterminado (como un indicador de carga) mientras estamos esperando a que el componente lazy cargue.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

El prop `fallback` acepta cualquier elemento de React que quieras renderizar mientras esperas que `OtherComponent` cargue. Puedes poner el componente `Suspense` en cualquier parte sobre el componente lazy. Incluso puedes envolver múltiples componentes lazy con un solo componente `Suspense`.   

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Límites de error {#error-boundaries}

Si el otro módulo no se carga (por ejemplo, debido a un fallo de la red), se generará un error. Puedes manejar estos errores para mostrar una buena experiencia de usuario y manejar la recuperación con [Límites de error](/docs/error-boundaries.html). Una vez hayas creado tu límite de error (Error Boundary) puedes usarlo en cualquier parte sobre tus componentes lazy para mostrar un estado de error cuando haya un error de red.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## División de código basada en rutas {#route-based-code-splitting}

<<<<<<< HEAD
Decidir en qué parte de tu aplicación introducir la división de código puede ser un poco complicado. Quieres asegurarte de elegir lugares que dividan los *bundles* de manera uniforme, sin interrumpir la experiencia del usuario.

Un buen lugar para comenzar es con las rutas. La mayoría de la gente en la web está acostumbrada a que las transiciones entre páginas se tomen cierto tiempo en cargar. También tiendes a volver a renderizar todo de una vez, así que es improbable que tus usuarios interactúen con otros elementos en la página al mismo tiempo.

Este es un ejemplo de cómo configurar la división de código basada en rutas en tu aplicación usando
bibliotecas como [React Router](https://reacttraining.com/react-router/) con `React.lazy`.
=======
Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won't disrupt the user experience.

A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Exports con nombres {#named-exports}

`React.lazy` actualmente solo admite *exports* tipo `default`. Si el módulo que desea importar utiliza *exports* con nombre, puede crear un módulo intermedio que lo vuelva a exportar como `default`. Esto garantiza que el *tree shaking* siga funcionando y que no importes componentes no utilizados.


```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
