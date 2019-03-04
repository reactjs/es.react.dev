---
id: optimizing-performance
title: Optimizando el Rendimiento
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

Internamente, React utiliza diferentes técnicas inteligentes para minimizar el número de operaciones DOM costosas requeridas para actualizar la interfaz de usuario. Para muchas aplicaciones, el uso de React conllevará a una interfaz de usuario rápida sin hacer mucho trabajo para optimizar específicamente el rendimiento. Sin embargo, hay varias maneras de acelerar tu aplicación de React.

## Usar la *Build* de Producción

Si estás haciendo análisis comparativos o experimentando problemas de rendimiento en tus aplicacions de React, asegúrate que estas probando con una *build* minificada.

Por defecto, React incluye muchas alertas útiles. Estas alertas son muy útiles en desarrollo. Sin embargo, estas hacen a React más pesado y lento, así que debes asegurarte de usar la versión de producción cuando desplieges la aplicación.

Si no estás seguro si tu proceso de *build* está configurado correctamente, puedes revisarlo instalando [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Si visitas un sitio con React en modo de producción, el ícono tendrá un fondo oscuro:

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

Si visitas un sitio con React en modo de desarrollo, el ícono tendrá un fondo rojo:

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

Se espera que uses el modo de desarrollo cuando estás trabajando en tu aplicación, y el modo de producción cuando despliegues tu aplicación a los usuarios.

Abajo puedes encontrar las instrucciones para construir tu aplicación de producción.

### Create React App {#create-react-app}

Si tu proyecto fui construido con [Create React App](https://github.com/facebookincubator/create-react-app), ejecuta:

```
npm run build
```

Esto creará una *build* de producción de tu aplicación el directorio  `build/` de tu proyecto.

Recuerda que esto es solo una necesidad antes de desplegar a producción. Para el desarrollo normal, usa `npm start`.

### Single-File Builds {#single-file-builds}

Ofrecemos versiones listas para producción de React y React DOM como un archivo:

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Recuerda que solo los archivos de React que terminan con `production.min.js` son apropiados para producción.

### Brunch {#brunch}

Para la *build* de producción Brunch más eficiente, instala el plugin [`uglify-js-brunch`](https://github.com/brunch/uglify-js-brunch):

```
# Si usas npm
npm install --save-dev uglify-js-brunch

# Si usas Yarn
yarn add --dev uglify-js-brunch
```

Entonces, para crear una *build* de producción, agrega la bandera `-p` al comando `build`:

```
brunch build -p
```
Recuerda que solo necesitas hacer esto para las *build* de producción. Tú no deberías pasar la bandera `-p` o aplicar el plugin en desarrollo, por que ocultará las advertencias de React y hará las *builds* mucho mas lentas.

### Browserify {#browserify}

Para la *build* de producción con Browserify más eficiente, instala algunos plugins:

```
# Si usas npm
npm install --save-dev envify uglify-js uglifyify 

# Si usas Yarn
yarn add --dev envify uglify-js uglifyify 
```
Para crear una *build* de producción, asegúrate de agregar estas transformaciones **(El orden es importante)**:

* La transformación [`envify`](https://github.com/hughsk/envify) asegura que el ambiente de la *build* sea correcto. Hazlo lo global (`-g`).
* La transformación [`uglifyify`](https://github.com/hughsk/uglifyify) remueve los import de desarollo. Hazlo global tambien (`-g`).
* Finalmente, el *bundle* resultante es canalizado a [`uglify-js`](https://github.com/mishoo/UglifyJS2) para mutilar ([Lee porque](https://github.com/hughsk/uglifyify#motivationusage)).

Por ejemplo:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | uglifyjs --compress --mangle > ./bundle.js
```

>**Nota:**
>
>El nombre del paquete es `uglify-js`, pero el binario que proporciona se llama `uglifyjs`.<br>
>Estoy no es un error de imprenta.

Recuerda que solo necesitas hacer esto para las *builds* de producción. No deberías aplicar estos plugins en desarrollo por que ocultaran las advertencias de React, y haran las *builds* mucho mas lentas.

### Rollup {#rollup}

Para la *build* de producción mas eficiente en Rollup, instala algunos plugins:

```
# Si usas npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 

# Si usas Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 
```

Para crear una *build* de producción, asegúrate de agregar estos plugins **(el orden es importante)**:

* El plugin [`replace`](https://github.com/rollup/rollup-plugin-replace) asegura que el ambiente correcto para la *build* de producción sea establecido.
* El pluglin [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) proporciona soporte para CommonJS en Rollup.
* El plugin [`uglify`](https://github.com/TrySound/rollup-plugin-uglify) comprime y mutila el *bundle* final.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-uglify')(),
  // ...
]
```

Para un ejemple de configuración completo [mira este gist](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

Recuerda que solo necesitas esto para las *builds* de producción. No deberías aplicar el plugin `uglify` o el plugin `replace` con el valor `'production'` en desarrollo, por que esto ocultará las advertencias de React y hará las *builds* mucho más lentas.

### webpack {#webpack}

>**Nota:**
>
>Si estás usando Create React App, por favor sigue [las instrucciones arriba](#create-react-app).<br>
>Esta sección solo es relevante si configuras webpack directamente.

Para la *build* de producción más eficiente en webpack, asegúrate de incluir estos plugins en tu configuración de producción:

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
}),
new webpack.optimize.UglifyJsPlugin()
```

Puedes aprender más acerca de esto en la [documentación de webpack](https://webpack.js.org/guides/production-build/).

Recuerda que solo necesitas hacer para las *builds* de producción. No deberias aplicar `UglifyJsPlugin` o `DefinePlugin` con valor `'production'` en desarrollo, por que ocultaran las advertencias de React y hará las *builds* mucho más lentas.

## Profiling Components with the Chrome Performance Tab {#profiling-components-with-the-chrome-performance-tab}

En el modo de **desarrollo**, puedes visualizar como montar componentes, actualizarlos y desmontarlos usando las herramientas para rendimiento soportadas por los navegadores. Por ejemplo:

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="React components in Chrome timeline" /></center>

Para hacer esto en Chrome:

1. Temporalmente, **Deshabilita todas la extensiones de Chrome, especialmente React DevTools**, ¡Ellas pueden sesgar significativamente los resultados!

2. Asegúrate de estar ejecutando la aplicación en modo de desarrollo.

3. Abre la pestaña **[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)** Chrome DevTools y presiona **Record**.

4. Define las acciones que quieres perfilar. No grabes mas de 20 segundos o Chrome podría colgarse.

5. Para de grabar.

6. Los eventos de React se agruparan bajo la etiqueta **User Timing**.

For a more detailed walkthrough, check out [this article by Ben Schwarz](https://calibreapp.com/blog/2017-11-28-debugging-react/).

Note that **the numbers are relative so components will render faster in production**. Still, this should help you realize when unrelated UI gets updated by mistake, and how deep and how often your UI updates occur.

Currently Chrome, Edge, and IE are the only browsers supporting this feature, but we use the standard [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) so we expect more browsers to add support for it.

## Profiling Components with the DevTools Profiler {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ and `react-native` 0.57+ provide enhanced profiling capabilities in DEV mode with the React DevTools Profiler.
An overview of the Profiler can be found in the blog post ["Introducing the React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
A video walkthrough of the profiler is also [available on YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

If you haven't yet installed the React DevTools, you can find them here:

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

> Note
>
> A production profiling bundle of `react-dom` is also available as `react-dom/profiling`.
> Read more about how to use this bundle at [fb.me/react-profiling](https://fb.me/react-profiling)

## Virtualize Long Lists {#virtualize-long-lists}

If your application renders long lists of data (hundreds or thousands of rows), we recommended using a technique known as "windowing". This technique only renders a small subset of your rows at any given time, and can dramatically reduce the time it takes to re-render the components as well as the number of DOM nodes created.

[react-window](https://react-window.now.sh/) and [react-virtualized](https://bvaughn.github.io/react-virtualized/) are popular windowing libraries. They provide several reusable components for displaying lists, grids, and tabular data. You can also create your own windowing component, like [Twitter did](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), if you want something more tailored to your application's specific use case.

## Avoid Reconciliation {#avoid-reconciliation}

React builds and maintains an internal representation of the rendered UI. It includes the React elements you return from your components. This representation lets React avoid creating DOM nodes and accessing existing ones beyond necessity, as that can be slower than operations on JavaScript objects. Sometimes it is referred to as a "virtual DOM", but it works the same way on React Native.

When a component's props or state change, React decides whether an actual DOM update is necessary by comparing the newly returned element with the previously rendered one. When they are not equal, React will update the DOM.

You can now visualize these re-renders of the virtual DOM with React DevTools:

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

In the developer console select the **Highlight Updates** option in the **React** tab:

<center><img src="../images/blog/devtools-highlight-updates.png" style="max-width:100%; margin-top:10px;" alt="How to enable highlight updates" /></center>

Interact with your page and you should see colored borders momentarily appear around any components that have re-rendered. This lets you spot re-renders that were not necessary. You can learn more about this React DevTools feature from this [blog post](https://blog.logrocket.com/make-react-fast-again-part-3-highlighting-component-updates-6119e45e6833) from [Ben Edelstein](https://blog.logrocket.com/@edelstein).

Consider this example:

<center><img src="../images/blog/highlight-updates-example.gif" style="max-width:100%; margin-top:20px;" alt="React DevTools Highlight Updates example" /></center>

Note that when we're entering a second todo, the first todo also flashes on the screen on every keystroke. This means it is being re-rendered by React together with the input. This is sometimes called a "wasted" render. We know it is unnecessary because the first todo content has not changed, but React doesn't know this.

Even though React only updates the changed DOM nodes, re-rendering still takes some time. In many cases it's not a problem, but if the slowdown is noticeable, you can speed all of this up by overriding the lifecycle function `shouldComponentUpdate`, which is triggered before the re-rendering process starts. The default implementation of this function returns `true`, leaving React to perform the update:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

If you know that in some situations your component doesn't need to update, you can return `false` from `shouldComponentUpdate` instead, to skip the whole rendering process, including calling `render()` on this component and below.

In most cases, instead of writing `shouldComponentUpdate()` by hand, you can inherit from [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). It is equivalent to implementing `shouldComponentUpdate()` with a shallow comparison of current and previous props and state.

## shouldComponentUpdate In Action {#shouldcomponentupdate-in-action}

Here's a subtree of components. For each one, `SCU` indicates what `shouldComponentUpdate` returned, and `vDOMEq` indicates whether the rendered React elements were equivalent. Finally, the circle's color indicates whether the component had to be reconciled or not.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Since `shouldComponentUpdate` returned `false` for the subtree rooted at C2, React did not attempt to render C2, and thus didn't even have to invoke `shouldComponentUpdate` on C4 and C5.

For C1 and C3, `shouldComponentUpdate` returned `true`, so React had to go down to the leaves and check them. For C6 `shouldComponentUpdate` returned `true`, and since the rendered elements weren't equivalent React had to update the DOM.

The last interesting case is C8. React had to render this component, but since the React elements it returned were equal to the previously rendered ones, it didn't have to update the DOM.

Note that React only had to do DOM mutations for C6, which was inevitable. For C8, it bailed out by comparing the rendered React elements, and for C2's subtree and C7, it didn't even have to compare the elements as we bailed out on `shouldComponentUpdate`, and `render` was not called.

## Examples {#examples}

If the only way your component ever changes is when the `props.color` or the `state.count` variable changes, you could have `shouldComponentUpdate` check that:

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

In this code, `shouldComponentUpdate` is just checking if there is any change in `props.color` or `state.count`. If those values don't change, the component doesn't update. If your component got more complex, you could use a similar pattern of doing a "shallow comparison" between all the fields of `props` and `state` to determine if the component should update. This pattern is common enough that React provides a helper to use this logic - just inherit from `React.PureComponent`. So this code is a simpler way to achieve the same thing:

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

Most of the time, you can use `React.PureComponent` instead of writing your own `shouldComponentUpdate`. It only does a shallow comparison, so you can't use it if the props or state may have been mutated in a way that a shallow comparison would miss.

This can be a problem with more complex data structures. For example, let's say you want a `ListOfWords` component to render a comma-separated list of words, with a parent `WordAdder` component that lets you click a button to add a word to the list. This code does *not* work correctly:

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

The problem is that `PureComponent` will do a simple comparison between the old and new values of `this.props.words`. Since this code mutates the `words` array in the `handleClick` method of `WordAdder`, the old and new values of `this.props.words` will compare as equal, even though the actual words in the array have changed. The `ListOfWords` will thus not update even though it has new words that should be rendered.

## The Power Of Not Mutating Data {#the-power-of-not-mutating-data}

The simplest way to avoid this problem is to avoid mutating values that you are using as props or state. For example, the `handleClick` method above could be rewritten using `concat` as:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 supports a [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) for arrays which can make this easier. If you're using Create React App, this syntax is available by default.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

You can also rewrite code that mutates objects to avoid mutation, in a similar way. For example, let's say we have an object named `colormap` and we want to write a function that changes `colormap.right` to be `'blue'`. We could write:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

To write this without mutating the original object, we can use [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method:

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` now returns a new object, rather than mutating the old one. `Object.assign` is in ES6 and requires a polyfill.

There is a JavaScript proposal to add [object spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread) to make it easier to update objects without mutation as well:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

If you're using Create React App, both `Object.assign` and the object spread syntax are available by default.

## Using Immutable Data Structures {#using-immutable-data-structures}

[Immutable.js](https://github.com/facebook/immutable-js) is another way to solve this problem. It provides immutable, persistent collections that work via structural sharing:

* *Immutable*: once created, a collection cannot be altered at another point in time.
* *Persistent*: new collections can be created from a previous collection and a mutation such as set. The original collection is still valid after the new collection is created.
* *Structural Sharing*: new collections are created using as much of the same structure as the original collection as possible, reducing copying to a minimum to improve performance.

Immutability makes tracking changes cheap. A change will always result in a new object so we only need to check if the reference to the object has changed. For example, in this regular JavaScript code:

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

Although `y` was edited, since it's a reference to the same object as `x`, this comparison returns `true`. You can write similar code with immutable.js:

```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
x === y; // false
x === z; // true
```

In this case, since a new reference is returned when mutating `x`, we can use a reference equality check `(x === y)` to verify that the new value stored in `y` is different than the original value stored in `x`.

Two other libraries that can help use immutable data are [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) and [immutability-helper](https://github.com/kolodny/immutability-helper).

Immutable data structures provide you with a cheap way to track changes on objects, which is all we need to implement `shouldComponentUpdate`. This can often provide you with a nice performance boost.
