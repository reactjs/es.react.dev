---
id: react-api
title: API de Alto Nivel de React
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React` es el punto de entrada a la biblioteca de React. Si se carga React desde una etiqueta `<script>`, estas API de alto nivel estarán disponibles en el `React` global. Si se usa ES6 con npm se puede escribir `import React from 'react'`. Si se usa ES5 con npm, se puede escribir `var React = require('react')`.

## Resumen {#overview}

### Componentes {#components}

Los componentes de React permiten dividir la UI en piezas independientes, reusables y pensar acerca de cada pieza aisladamente. Los componentes de React pueden ser definidos creando subclases `React.Component` o `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

Si no se usan las clases ES6, se puede usar el módulo `create-react-class`. Para más información, ver [Usar React sin ES6](/docs/react-without-es6.html).

Los componentes de React también pueden ser definidos como funciones que se pueden envolver:

- [`React.memo`](#reactmemo)

### Crear elementos de React {#creating-react-elements}

Se recomienda [usar JSX](/docs/introducing-jsx.html) para describir cómo debe verse la UI. Cada elemento de JSX es solo un azúcar sintáctico para llamar [`React.createElement()`](#createelement). Normalmente no se recurrirá a los siguientes métodos directamente si se está usando JSX.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

Para más información, ver [Usar React sin JSX](/docs/react-without-jsx.html).

### Transformar elementos {#transforming-elements}

`React` proporciona varias API para manipular elementos:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Fragmentos {#fragments}

`React` también proporciona un componente para renderizar múltiples elementos sin un contenedor.

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

Suspense permite que los componentes “esperen” algo antes de renderizar. Hoy Suspense solo mantiene un caso de uso: [cargar componentes activamente con `React.lazy`](/docs/code-splitting.html#reactlazy). En el futuro mantendrá otros casos de uso como captura de datos.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Hooks {#hooks}

Los *Hooks* son una nueva adición en React 16.8. Permiten usar el estado y otras características de React sin escribir una clase. Los Hooks tienen una [sección de documentos dedicados](/docs/hooks-intro.html) y una referencia API separada:

- [Hooks Básicos](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [Hooks Adicionales](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)

* * *

## Referencia {#reference}

### `React.Component` {#reactcomponent}

`React.Component` es la clase base para los componentes de React cuando estos son definidos usando [clases ES6](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes):

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Consulta [Referencia API React.Component](/docs/react-component.html) para ver una lista de métodos y propiedades relacionadas a la clase base `React.Component`.

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` es similar a [`React.Component`](#reactcomponent). La diferencia entre ellos es que [`React.Component`](#reactcomponent) no implementa [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), pero `React.PureComponent` lo implementa con un prop superficial y una comparación del estado. 

Si la función `render()` del componente de React renderiza el mismo resultado dados los mismos props y estado, se puede usar `React.PureComponent` para una mejora en el desempeño en algunos casos.

> Nota
>
> `shouldComponentUpdate()` del `React.PureComponent` solo compara superficialmente los objetos. Si estos contienen estructuras de datos complejos pueden producir falsos negativos para diferencias más profundas. Solo se extiende `PureComponent` cuando se espera tener los props y el estado simples o usar [`forceUpdate()`](/docs/react-component.html#forceupdate) cuando se sabe que las estructuras de datos profundos han cambiado. O considera usar [objetos inmutables](https://facebook.github.io/immutable-js/) para facilitar comparaciones rápidas de los datos anidados.
>
> Además, `shouldComponentUpdate()` del `React.PureComponent` omite las actualizaciones de los props para todo el componente del subárbol. Asegúrate que todos los componentes hijos también sean “puros”.

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* renderiza usando props */
});
```

`React.memo` es un [componente de orden superior](/docs/higher-order-components.html). Es similar a [`React.PureComponent`](#reactpurecomponent) pero para componentes de función en vez de clases.

Si el componente de función renderiza el mismo resultado dados los mismos props, se puede envolver en una llamada a `React.memo` para una mejora en el desempeño en algunos casos memoizando el resultado. Esto significa que React omitirá renderizar el componente y reusará el último resultado renderizado.

`React.memo` solamente afecta los cambios de props. Sí tu componente funcional envuelto en `React.memo` tiene un Hook [`useState`](/docs/hooks-state.html) o [`useContext`](/docs/hooks-reference.html#usecontext) en su implementación, será renderizado de nuevo cuando el estado o context cambien.

Por defecto solo comparará superficialmente objetos complejos en el objeto de props. Si se desea controlar la comparación, se puede proporcionar también una función de comparación personalizada como el segundo argumento.

```javascript
function MyComponent(props) {
  /* renderiza usando props */
}
function areEqual(prevProps, nextProps) {
  /*
  retorna true si al pasar los nextProps a renderizar retorna
  el mismo resultado que al pasar los prevProps a renderizar,
  de otro modo retorna false
  */
}
export default React.memo(MyComponent, areEqual);
```

Este método solamente existe como una **[optimización del desempeño](/docs/optimizing-performance.html).** No dependas de ello para “evitar” un renderizado, ya que puede conducir a errores.

> Nota
>
> A diferencia del método [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) en los componentes de clases, la función `areEqual` retorna `true` si los props son iguales y `false` si los props no son iguales. Esto es lo opuesto a `shouldComponentUpdate`.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Crea y retorna un nuevo [elemento React](/docs/rendering-elements.html) del tipo dado. El tipo del argumento puede ser ya sea un string de nombre de etiqueta (tales como `'div'` o `'span'`), un tipo de [componente React](/docs/components-and-props.html) (una clase o una función), o un tipo de [fragmento React](#reactfragment) .

El código escrito con [JSX](/docs/introducing-jsx.html) será convertido para usar `React.createElement()`. Normalmente no se invocará `React.createElement()` directamente si se está usando JSX. Para aprender más, ver [React Sin JSX](/docs/react-without-jsx.html).

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

Clona y retorna un elemento React usando `element` como punto de partida. El elemento resultante tendrá los props del elemento original con los nuevos props combinados superficialmente. Los nuevos hijos reemplazarán los hijos existentes. `key` y `ref` del elemento original serán preservados.

`React.cloneElement()` es casi equivalente a:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Sin embargo, también preserva los `refs`. Esto significa que, si se obtiene un hijo con un `ref` en él, no lo robará accidentalmente de su precedente. Se obtendrá el mismo `ref` adjunto al nuevo elemento.

Esta API fue introducida como un reemplazo al obsoleto `React.addons.cloneWithProps()`.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Retorna una función que produce elementos React de un tipo dado. Como [`React.createElement()`](#createElement), el tipo del argumento puede ser un string de nombre de etiqueta (como `'div'` o `'span'`), un tipo de [componente React](/docs/components-and-props.html) (una clase o una función) o un [fragmento React](#reactfragment).

Este auxiliar es considerado antiguo y en su lugar fomentamos el uso de JSX o de `React.createElement()`.

Normalmente no se invocará `React.createFactory()` directamente si se está usando JSX. Para aprender más, ver [React sin JSX](/docs/react-without-jsx.html).

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Verifica que el objeto sea un elemento React. Retorna `true` o `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` proporciona utilidades para lidiar con la estructura de datos opaca de `this.props.children`.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Invoca una función en cada hijo inmediato dentro de `children` con `this` establecido a `thisArg`. Si `children` es un array, será recorrido y la función será llamada para cada hijo en el array. Si children es `null` o `undefined`, este método retornará `null` o `undefined` en vez de un array.

> Nota
>
> Si `children` es un `Fragment` será tratado como un hijo único y no será recorrido.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Es como [`React.Children.map()`](#reactchildrenmap) pero no retorna un array.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Retorna el número total de componentes en `children`, igual al número de veces que un callback pasado a `map` o `forEach` sería invocado.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Verifica que `children` solo tenga un hijo (un elemento React) y lo retorna. De otro modo este método lanza un error.

> Nota:
>
>`React.Children.only()` no acepta el valor retornado de [`React.Children.map()`](#reactchildrenmap) porque es un array en lugar de un elemento React.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Retorna la estructura de datos opaca de `children` como un array plano con keys asignadas a cada hijo. Es útil si se desea manipular colecciones de hijos en los métodos de renderización, particularmente si se desea reordenar o segmentar `this.props.children` antes de pasarlo.

> Nota:
>
> `React.Children.toArray()` cambia las keys para preservar las semánticas de los array anidados cuando se aplanan listas de hijos. Esto quiere decir que `toArray` antepone cada key en el array retornado de modo que cada elemento de key esté dentro del alcance del array de entrada que lo contiene.

* * *

### `React.Fragment` {#reactfragment}

El componente `React.Fragment` permite retornar elementos múltiples en un método de `render()` sin crear un elemento DOM adicional:

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

También se puede usar con la sintaxis abreviada `<></>`. Para más información, ver [React v16.2.0: Soporte mejorado para fragmentos](/blog/2017/11/28/react-v16.2.0-fragment-support.html).


### `React.createRef` {#reactcreateref}

`React.createRef` crea un [ref](/docs/refs-and-the-dom.html) que puede ser adjunto a los elementos React por medio del atributo ref.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` crea un componente React que envía el atributo [ref](/docs/refs-and-the-dom.html) que recibe a otro componente más abajo en el árbol. Esta técnica no es muy común, pero es particularmente útil en dos escenarios:

* [Enviar refs a componentes DOM](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Enviar refs en componentes de orden superior](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` acepta una función de renderizado como un argumento. React llamará esta función con `props` y `ref` como dos argumentos. Esta función debe retornar un nodo React.

`embed:reference-react-forward-ref.js`

En el ejemplo anterior, React pasa un `ref` dado a un elemento `<FancyButton ref={ref}>` como un segundo argumento a la función de renderizado dentro de la llamada `React.forwardRef`. Esta función de renderizado pasa el `ref` al elemento `<button ref={ref}>`.

Como resultado, después que React adjunte el ref, `ref.current` apuntará directamente a la instancia del elemento DOM `<button>`.

Para más información, ver [reenvío de refs](/docs/forwarding-refs.html).

### `React.lazy` {#reactlazy}

`React.lazy()` permite definir un componente que es cargado dinámicamente. Esto ayuda a reducir el tamaño del bundle para demorar los componentes de carga que no son usados durante la renderización inicial.

Puedes aprender cómo usarlo desde nuestra [documentación de división de código](/docs/code-splitting.html#reactlazy). También puedes consultar [este artículo](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) que explica cómo usarlo con más detalle.

```js
// Este componente está cargado dinámicamente
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Ten en cuenta que renderizar componentes `lazy` requiere que haya un componente `<React.Suspense>` más alto en el árbol de renderización. Así es como se especifica un indicador de carga.

> **Nota**
>
> Usar `React.lazy` con importación dinámica requiere que Promises esté disponible en el entorno JS. Esto requiere un polyfill en IE versión 11 e inferiores.

### `React.Suspense` {#reactsuspense}

`React.Suspense` permite especificar el indicador de carga en caso de que algunos componentes en el árbol más abajo de él todavía no estén listos para renderizarse. Hoy en día, los componentes de carga diferida son el **único** caso compatible con `<React.Suspense>`:

```js
// Este componente está cargado dinámicamente
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Muestra <Spinner> hasta que OtherComponent cargue
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Esto está documentado en nuestra [guía de división de código](/docs/code-splitting.html#reactlazy). Ten en cuenta que los componentes `lazy` pueden estar muy profundo en el árbol `Suspense` -- no tiene que envolverlos a todos. La mejor práctica es colocar `<Suspense>` donde se desee ver un indicador de carga y usar `lazy()` para hacer división de código.

Aunque esto no es soportado actualmente, en el futuro planeamos dejar que `Suspense` maneje más escenarios como la captura de datos. Puedes leer sobre esto en nuestro [plan de ruta](/blog/2018/11/27/react-16-roadmap.html).

>Nota:
>
>`React.lazy()` y `<React.Suspense>` aún no son soportados por `ReactDOMServer`. Esto es una limitación conocida que será resuelta en el futuro.
