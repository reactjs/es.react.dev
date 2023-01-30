---
id: optimizing-performance
title: Optimizando el Rendimiento
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

Internamente, React utiliza diferentes técnicas inteligentes para minimizar el número de operaciones DOM costosas requeridas para actualizar la interfaz de usuario. Para muchas aplicaciones, el uso de React conllevará a una interfaz de usuario rápida sin hacer mucho trabajo para optimizar específicamente el rendimiento. Sin embargo, hay varias maneras de acelerar tu aplicación de React.

## Usa el compilado de Producción {#use-the-production-build}

Si estás haciendo análisis comparativos o experimentando problemas de rendimiento en tus aplicaciones de React, asegúrate que estás probando con el compilado minificado.

Por defecto, React incluye muchas alertas útiles. Estas advertencias son muy útiles en desarrollo. Sin embargo, estas hacen a React más pesado y lento, así que debes asegurarte de usar la versión de producción cuando desplieges la aplicación.

Si no estás seguro si tu proceso de compilación está configurado correctamente, puedes revisarlo instalando [React Developer Tools para Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Si visitas un sitio con React en modo de producción, el ícono tendrá un fondo oscuro:

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

Si visitas un sitio con React en modo de desarrollo, el ícono tendrá un fondo rojo:

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

Se espera que uses el modo de desarrollo cuando estás trabajando en tu aplicación, y el modo de producción cuando despliegues tu aplicación a los usuarios.

Abajo puedes encontrar las instrucciones para compilar tu aplicación para producción.

### Create React App {#create-react-app}

Si tu proyecto fue construido con [Create React App](https://github.com/facebookincubator/create-react-app), ejecuta:

```
npm run build
```

Esto creará un compilado de producción de tu aplicación en el directorio `build/` de tu proyecto.

Recuerda que esto es solo una necesidad antes de desplegar a producción. Para el desarrollo normal, usa `npm start`.

### Compilados de un solo archivo {#single-file-builds}

Ofrecemos versiones listas para producción de React y React DOM como un solo archivo:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

Recuerda que solo los archivos de React que terminan con `production.min.js` son apropiados para producción.

### Brunch {#brunch}

Para el compilado de producción de Brunch más eficiente, instala el plugin [`terser-brunch`](https://github.com/brunch/terser-brunch):

```
# Si usas npm
npm install --save-dev terser-brunch

# Si usas Yarn
yarn add --dev terser-brunch
```

Entonces, para crear un compilado de producción, agrega la bandera `-p` al comando `build`:

```
brunch build -p
```

Recuerda que solo necesitas hacer esto para los compilados de producción. No deberías pasar la bandera `-p` o aplicar el plugin en desarrollo, porque ocultará las advertencias de React y hará las compilaciones mucho más lentas.

### Browserify {#browserify}

Para el compilado de producción con Browserify más eficiente, instala estos plugins:

```
# Si usas npm
npm install --save-dev envify terser uglifyify

# Si usas Yarn
yarn add --dev envify terser uglifyify  
```

Para crear un compilado de producción, asegúrate de agregar estas transformaciones **(El orden es importante)**:

* La transformación [`envify`](https://github.com/hughsk/envify) asegura que el ambiente del compilado sea correcto. Hazlo global (`-g`).
* La transformación [`uglifyify`](https://github.com/hughsk/uglifyify) remueve los *import* de desarollo. Hazlo global también (`-g`).
* Finalmente, el *bundle* resultante es pasado a [`terser`](https://github.com/terser-js/terser) para el proceso de *mangling* ([Lee por qué](https://github.com/hughsk/uglifyify#motivationusage)).

Por ejemplo:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

Recuerda que solo necesitas hacer esto para los compilados de producción. No deberías aplicar estos plugins en desarrollo por que ocultaran advertencias útiles de React, y harán los compilados mucho más lentos.

### Rollup {#rollup}

Para un compilado de producción más eficiente con Rollup, instala algunos plugins:

```
# Si usas npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# Si usas Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

Para crear un compilado de producción, asegúrate de agregar estos plugins **(el orden es importante)**:

* El plugin [`replace`](https://github.com/rollup/rollup-plugin-replace) asegura que el ambiente correcto para el compilado de producción sea establecido.
* El pluglin [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) proporciona soporte para CommonJS en Rollup.
* El plugin [`terser`](https://github.com/TrySound/rollup-plugin-terser) comprime y realiza *mangle* sobre el compilado final.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

Para un ejemplo de configuración completa [mira este gist](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

Recuerda que solo necesitas esto para los compilados de producción. No deberías aplicar el plugin `terser` o el plugin `replace` con el valor `'production'` en desarrollo, por que esto ocultará las advertencias de React y hará los compilados mucho más lentos.

### webpack {#webpack}

>**Nota:**
>
>Si estás usando Create React App, por favor sigue [las instrucciones arriba](#create-react-app).<br>
>Esta sección solo es relevante si configuras webpack directamente.

Webpack v4+ va a minificar tu código por defecto en el modo producción.

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

Puedes aprender más acerca de esto en la [documentación de webpack](https://webpack.js.org/guides/production/).

Recuerda que solo necesitas hacer esto para las *builds* de producción. No deberías aplicar `TerserPlugin` en desarrollo, porque ocultará las advertencias de React y hará las *builds* mucho más lentas.

## Análisis de rendimiento de componentes con DevTools Profiler {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ y `react-native` 0.57+ proveen capacidades de análisis de rendimiento (_profiling_) mejoradas en modo *DEV* con *React DevTools Profiler*.
Un resumen del profiler puede ser encontrado en la publicación ["Introducing the React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
Un video tutorial del profiler está [disponible en YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

Si aún no has instalado *React DevTools*, puedes encontrarlo aquí:

- [Extensión de navegador para Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Extensión de navegador para Firefox](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Paquete independiente para Node](https://www.npmjs.com/package/react-devtools)

> Nota
>
> Un *bundle* para análisis de rendimiento en producción de `react-dom` está disponible como`react-dom/profiling`.
> Lee más sobre esto en [fb.me/react-profiling](https://fb.me/react-profiling)

> Nota
>
> Antes de React 17, usábamos la [API estándar User Timing](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) para realizar el análisis de rendimiento de componentes con la pestaña de rendimiento de Chrome.
> Para una explicación más detallada, consulta [este artículo de Ben Schwarz (en inglés)](https://calibreapp.com/blog/react-performance-profiling-optimization).

## Virtualizar listas largas {#virtualize-long-lists}

Si su aplicación renderiza largas listas de datos (cientos o miles de filas), recomendamos que uses una técnica conocida como *"windowing"*. Esta técnica solo renderiza un pequeño subconjunto de tus filas en un momento dado, y puede reducir dramáticamente el tiempo que demora en re-renderizar los componentes, así como el numero de nodos creados en el *DOM*.

[react-window](https://react-window.now.sh/) y [react-virtualized](https://bvaughn.github.io/react-virtualized/) son bibliotecas de *windowing* populares. Estas proveen varios componentes reusables para mostrar listas, grillas y datos tabulares. También puedes crear tu propio componente *windowing*, como [hizo Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), si quieres algo más a la medida para tu aplicación.

## Evitar reconciliación {#avoid-reconciliation}

React construye y mantiene una representación interna de la interfaz de usuario renderizada. Esta incluye los elementos React que retornas de tus componentes. Esta representación permite a React evitar crear nodos DOM y acceder a los existentes más allá de lo necesario, ya que puede ser más lento que las operaciones en objetos JavaScript. A veces a esto se le llama "DOM Virtual", pero funciona de la misma forma en React Native.

Cuando una propiedad o estado de un componente cambia, React decide si es necesario actualizar el DOM comparando el elemento recién retornado con el previamente renderizado. Si no son iguales, React actualizará el DOM.

Aunque React solo actualiza los nodos DOM modificados, el re-renderizado aun lleva algo de tiempo. En muchos casos no es un problema, pero si la desaceleración es notable puedes acelerar el proceso anulando la función del ciclo de vida `shouldComponentUpdate`, el cual se ejecuta antes de que el proceso de re-renderizado comience. La implementación por defecto de esta función retorna `true`, permitiendo a React hacer la actualización.

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Si sabes que en algunas situaciones tu componente no necesita actualizarse, puedes retornar `false` desde `shouldComponentUpdate` para omitir todo el proceso de renderizacion, incluida la invocación de `render()` en este componente y debajo de él.

En la mayoría de los casos, en vez de escribir `shouldComponentUpdate()`, puedes heredar [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Esto es equivalente a implementar `shouldComponentUpdate()` con una comparación superficial del las propiedades y estados previos y actuales.

## shouldComponentUpdate en acción {#shouldcomponentupdate-in-action}

Aquí hay un subárbol de componentes. Para cada uno, `SCU` indica que `shouldComponentUpdate` devolvió, y `vDOMEq` indica si los elementos React renderizados fueron equivalentes. Finalmente, el color de los círculos indica si el componente tiene que ser reconciliado o no.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Como `shouldComponentUpdate` retornó `false` para el subárbol con raíz en C2, React no intentó renderizar C2, y por lo tanto ni siquiera tuvo que invocar `shouldComponentUpdate` en C4 y C5.

Para C1 y C3, `shouldComponentUpdate` retornó `true`, así que React tuvo que descender a las hojas y verificarlas. Para C6 `shouldComponentUpdate` retornó `true`, y dado que los elementos no eran equivalentes React tuvo que actualizar el DOM.

El último caso interesante es C8. React tuvo que renderizar este componente, pero como los elementos de React que devolvió eran iguales a los previamente renderizados, no tuvo que actualizar el DOM.

Nota que React solo tiene que hacer mutaciones DOM para C6, lo cual es inevitable. Para C8, se rescató mediante la comparación de los elementos React representados, y para el subárbol C2 y C7, ni siquiera tuvo que comparar los elementos ya que los rescatamos en `shouldComponentUpdate`, y `render` no fue llamado.

## Ejemplos {#examples}

Si la única forma en que tu componente cambie es cuando cambia la variable `props.color` o el `state.count`, puedes hacer que `shouldComponentUpdate` compruebe eso:

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

En este código, `shouldComponentUpdate` solo esta verificando sí hay algún cambio en `props.color` o `state.count`. Si esos valores no cambian, el componente no se actualiza. Si tu componente se vuelve más complejo, podrías usar un patrón similar de hacer una "comparación superficial" entre todos los campos de `props` y `state` para determinar si el componente debería actualizarse. Este patrón es lo suficientemente común como para que React proporcione un ayudante para utilizar esta lógica - simplemente hereda de `React.PureComponent`. Este código es una forma mas simple de lograr lo mismo: 

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

La mayoría de las veces, puedes usar `React.PureComponent` en vez de escribir tu propio `shouldComponentUpdate`. Sólo hace una comparación superficial, por lo que no puede usarlo si las propiedades o el estado han sido mutados de una manera que una comparación superficial pasaría por alto.

Esto puede ser un problema con estructuras de datos más complejas. Por ejemplo, supongamos que quieres un componente `ListOfWords` para representar una lista de palabras separadas por comas, con un componente padre `WordAdder` que te permite hacer clic en un botón para agregar una palabra a la lista. Este código *no* funciona correctamente:

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

El problema es que `PureComponent` hará una comparación simple entre los valores antiguos y nuevos de `this.props.words`. Dado que este código muta la matriz `words`en el método `handleClick` de `WordAdder`, los valores antiguos y nuevos de `this.props.words` se compararán como iguales, aunque las palabras actuales de la matriz hayan cambiado. La `ListOfWords` no se actualizará a pesar de que tiene nuevas palabras que se deben renderizar.

## El poder de no mutar los datos {#the-power-of-not-mutating-data}

La forma más sencilla de evitar este problema es evitar la mutación de valores que estas utilizando como propiedades o estados. Por ejemplo, el método `handleClick` anterior podría ser reescrito usando `concat`: 

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 soporta [operador de propagación](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) para matrices, lo cual puede hacer esto mas fácil. Si estas usando *Create React App*, esta sintaxis está disponible por defecto.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

También puedes reescribir el código que muta los objetos para evitar la mutación, de forma similar.Por ejemplo, digamos que tenemos un objeto llamado `colormap` y queremos escribir una función que cambie `colormap.right` para que sea `'blue'`. Podríamos escribir:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

Para escribir esto sin mutar el objeto original, podemos usar el método [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method:

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` ahora devuelve un nuevo objeto, en lugar de mutar el anterior. `Object.assign` está en ES6 y requiere un *polyfill*.

[La sintaxis de propagación de objetos](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Sintaxis_Spread) hace más fácil la actualización de objetos sin mutación:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

Esta funcionalidad fue añadida a JavaScript en ES2018.

Si estás utilizando *Create React App*, tanto `Object.assign` y *la sintaxis de propagación en objetos* están disponibles por defecto.

Cuando te encuentras ante objetos anidados, actualizarlos de manera inmutable puede sentirse complicado. Si te ves ante este problema, échale un vistazo a [Immer](https://github.com/mweststrate/immer) o [immutability-helper](https://github.com/kolodny/immutability-helper). Estas bibliotecas te permiten escribir código altamente legible sin perder los beneficios de la inmutabilidad.
