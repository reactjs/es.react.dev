---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

<<<<<<< HEAD
## *Bundling*
=======
## Bundling {#bundling}
>>>>>>> 57bcddcfa15a7dd7c902430687f2932856812d23

La mayoría de las aplicaciones React tendrán sus archivos "empaquetados" o *bundled* con herramientas como
[Webpack](https://webpack.js.org/) o [Browserify](http://browserify.org/).
El *bundling* es el proceso de seguir los archivos importados y fusionarlos en un
archivo único: un *bundle* o "paquete". Este *bundle* se puede incluir en una página web para cargar una aplicación completa de una sola vez.

<<<<<<< HEAD
#### Ejemplo
=======
#### Example {#example}
>>>>>>> 57bcddcfa15a7dd7c902430687f2932856812d23

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

Si usas [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/), o una herramienta similar, vas a tener una configuración de Webpack incluida para generar el *bundle* de tu aplicación.  

Si no, tú mismo vas a tener que configurar el *bundling*. Por ejemplo, revisa las guías [Installation](https://webpack.js.org/guides/installation/) y
[Getting Started](https://webpack.js.org/guides/getting-started/) en la documentación de Webpack.

## División de código

<<<<<<< HEAD
El *Bundling* es genial, pero a medida que tu aplicación crezca, tu *bundle* también crecerá. Especialmente
si incluyes grandes bibliotecas de terceros. Necesitas vigilar el código que incluyes en tu *bundle*, de manera que no lo hagas accidentalmente tan grande que tu aplicación se tome mucho tiempo en cargar.
=======
## Code Splitting {#code-splitting}
>>>>>>> 57bcddcfa15a7dd7c902430687f2932856812d23

Para evitar terminar con un *bundle* grande, es bueno adelantarse al problema
y comenzar a dividir tu *bundle*. [División de código](https://webpack.js.org/guides/code-splitting/) es una funcionalidad disponible en *bundlers* como Webpack y Browserify (vía [factor-bundle](https://github.com/browserify/factor-bundle)) que puede crear múltiples *bundles* a ser cargados dinámicamente durante la ejecución de tu aplicación.

Dividir el código de tu aplicación puede ayudarte a cargar solo lo necesario en cada momento para el usuario, lo cual puede mejorar dramáticamente el rendimiento de tu aplicación. Si bien no habrás reducido la cantidad total de código en tu aplicación,
habrás evitado cargar código que el usuario podría no necesitar nunca, y reducido la cantidad necesaria
de código durante la carga inicial.


## `import()` {#import}

La mejor manera de introducir división de código en tu aplicación es a través de la sintáxis de `import()`s dinámicos.

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

> Note:
>
> La sintáxis de `import()`s dinámicos es una [propuesta](https://github.com/tc39/proposal-dynamic-import)
> ECMAScript (JavaScript) que no es parte actual del estándar
> del lenguaje. Se espera que sea aceptada en el
> futuro cercano

Cuando Webpack se encuentra esta sintáxis, comienza a dividir el código de tu
aplicación automáticamente. Si estás usando Create React App, esto ya viene
configurado para ti y puedes comenzar a [usarlo](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting). It's also supported out of the box in [Next.js](https://github.com/zeit/next.js/#dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's
[guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](http://babeljs.io/), you'll need to make sure that Babel can
parse the dynamic import syntax but is not transforming it. For that you will need [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Note:
>
> `React.lazy` and Suspense is not yet available for server-side rendering. If you want to do code-splitting in a server rendered app, we recommend [Loadable Components](https://github.com/smooth-code/loadable-components). It has a nice [guide for bundle splitting with server-side rendering](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md).

The `React.lazy` function lets you render a dynamic import as a regular component.

**Before:**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**After:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

This will automatically load the bundle containing the `OtherComponent` when this component gets rendered.

`React.lazy` takes a function that must call a dynamic `import()`. This must return a `Promise` which resolves to a module with a `default` export containing a React component.

### Suspense {#suspense}

If the module containing the `OtherComponent` is not yet loaded by the time `MyComponent` renders, we must show some fallback content while we're waiting for it to load - such as a loading indicator. This is done using the `Suspense` component.

```js
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

The `fallback` prop accepts any React elements that you want to render while waiting for the component to load. You can place the `Suspense` component anywhere above the lazy component. You can even wrap multiple lazy components with a single `Suspense` component.

```js
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

### Error boundaries {#error-boundaries}

If the other module fails to load (for example, due to network failure), it will trigger an error. You can handle these errors to show a nice user experience and manage recovery with [Error Boundaries](/docs/error-boundaries.html). Once you've created your Error Boundary, you can use it anywhere above your lazy components to display an error state when there's a network error.

```js
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

## Route-based code splitting {#route-based-code-splitting}

Deciding where in your app to introduce code splitting can be a bit tricky. You
want to make sure you choose places that will split bundles evenly, but won't
disrupt the user experience.

A good place to start is with routes. Most people on the web are used to
page transitions taking some amount of time to load. You also tend to be
re-rendering the entire page at once so your users are unlikely to be
interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using
libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

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

## Named Exports {#named-exports}

`React.lazy` currently only supports default exports. If the module you want to import uses named exports, you can create an intermediate module that reexports it as the default. This ensures that treeshaking keeps working and that you don't pull in unused components.

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
