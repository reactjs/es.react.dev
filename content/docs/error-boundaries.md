---
id: error-boundaries
title: Límites de errores
permalink: docs/error-boundaries.html
---

En el pasado, los errores de JavaScript dentro de los componentes solían corromper el estado interno de React y hacían que [emitiera](https://github.com/facebook/react/issues/4026) [errores](https://github.com/facebook/react/issues/6895) [crípticos](https://github.com/facebook/react/issues/8579) en siguientes renderizados. Estos errores siempre eran causados por un error previo en el código de aplicación, pero React no proveía una manera de gestionarlos elegantemente en componentes, y no podía recuperarse de ellos.

## Introduciendo Límites de Errores {#introducing-error-boundaries}

Un error de JavaScript en una parte de la interfaz no debería romper toda la aplicación. Para resolver este problema, React 16 introduce el nuevo concepto de “límite de errores”.

Los límites de errores son componentes de React que **capturan errores de JavaScript en cualquier parte de su árbol de componentes hijo, registran esos errores, y muestran una interfaz de repuesto** en lugar del árbol de componentes que ha fallado. Los límites de errores capturan errores durante el renderizado, en métodos del ciclo de vida, y en constructores de todo el árbol bajo ellos.

> Nota
>
> Los límites de errores **no** capturan errores de:
>
> * Manejadores de eventos ([aprende más](#how-about-event-handlers))
> * Código asíncrono (p.ej. callbacks de `setTimeout` o `requestAnimationFrame`)
> * Renderizado en el servidor
> * Errores lanzados en el propio límite de errores (en lugar de en sus hijos)

Un componente de clase (class component) se convierte en límite de errores si define uno (o ambos) de los métodos del ciclo de vida [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) o [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). Usa `static getDerivedStateFromError()` para renderizar una interfaz de repuesto cuando se lance un error. Usa `componentDidCatch()` para registrar información de los errores.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de repuesto
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

Luego puedes usarlo como un componente normal:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

Los límites de errores funcionan como un bloque catch{} de JavaScript, pero para componentes. Sólo los componentes de clase (class components) pueden ser límites de errores. En la práctica, la mayor parte del tiempo declararás un límite de errores una vez y lo usarás a lo largo de tu aplicación.

Ten en cuenta que **los límites de errores sólo capturan errores en los componentes bajo ellos en el árbol**. Un límite de errores no puede capturar un error dentro de sí mismo. Si un límite de errores falla tratando de renderizar el mensaje de error, el error se propagará al límite de errores más cercano por encima de él. Esto también es similar al funcionamiento de los bloques catch{} en JavaScript.

## Live Demo {#live-demo}

Mira [este ejemplo de declaración y uso de un límite de errores](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) con [React 16](/blog/2017/09/26/react-v16.0.html).


## Dónde poner Límites de Errores {#where-to-place-error-boundaries}

La granularidad de los límites de errores depende de tí. Puedes envolver los componentes de enrutado de alto nivel para mostrar un mensaje de "Algo ha ido mal" al usuario, tal como a menudo gestionan los errores los frameworks del lado del servidor. También puedes envolver widgets aisladas en un límite de error para evitar que hagan fallar el resto de la aplicación.

## Nuevo comportamiento para los errores no capturados {#new-behavior-for-uncaught-errors}

Este cambio tiene una implicación importante. **A partir de React 16, los errores que no sean capturados por ningún límite de error resultarán en el desmontado de todo el árbol de componentes de React.**

Debatimos esta decisión, pero en nuestra experiencia es peor dejar una interfaz corrompida que eliminarla completamente. Por ejemplo, en un producto como Messenger dejar la interfaz rota visible puede llevar a que alguien mande un mensaje a la persona equivocada. De manera similar, es peor que una aplicacion de pagos muestre un total erróneo a no renderizar nada.

Este cambio significa que cuando migres a React 16, probablemente descubras fallos existentes en tu aplicación que antes habían pasado desapercibidos. Añadir límites de errores te permite dar una mejor experiencia de usuario cuando algo va mal.

Por ejemplo, en Facebook Messenger se envuelven los contenidos de la barra lateral, el panel de información, el registro de conversaciones, y el input de mensajes en límites de errores separados. Si falla un componente en una de esas áreas de la interfaz, el resto continúan estando interactivos.

También te animamos a que uses servicios de reporte de errores de JS (o crees el tuyo), para que puedas descubrir excepciones no controladas cuando occuren en producción y arreglarlas.


## Trazas de la pila de componentes {#component-stack-traces}

React 16 muestra todos los errores que ocurrieron durante el rendering por consola en desarrollo, incluso si la aplicación se los traga accidentalmente. Además de las pilas de mensajes de error y de JavaScript, también provee trazas de la pila de componentes. Ahora puedes ver en qué parte exactamente del árbol de componentes ha ocurrido el fallo:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Error capturado por componente Límite de Errores">

También puedes ver los nombres de los ficheros y los números de línea en la traza de la pila de componentes. Esto funciona por defecto en proyectos de [Create React App](https://github.com/facebookincubator/create-react-app):

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error capturado por componente Límite de Errores con números de línea">

Si no usas Create React App, puedes añadir manualmente [este plugin](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) a tu configuración de Babel. Ten en cuenta que está pensado sólo para desarrollo y **debe ser desabilitado en producción**.

> Nota
>
> Los nombres de componentes que se muestran en las trazas de pila dependen de la propiedad [`Function.name`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function/name). Si das soporte a navegadores antiguos y dispositivos que puede que no provean esto nativamente (p.ej. IE 11), considera incluir un polyfill de `Function.name` en tu aplicación empaquetada, como [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). Alternativamente, puedes poner la propiedad [`displayName`](/docs/react-component.html#displayname) en todos tus componentes.


## ¿Qué pasa con try/catch? {#how-about-trycatch}

`try` / `catch` está muy bien, pero sólo funciona para código imperativo:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

No obstante, los componentes de React son declarativos y especifican *qué* se debe renderizar:

```js
<Button />
```

Los límites de errores preservan la naturaleza declarativa de React, y se comportan como esperarías. Por ejemplo, incluso si un error ocurre en un método `componentDidUpdate` causado por un `setState` en algún sitio profundo dentro del árbol, se propagará de todas formas correctamente al límite de errores más cercano.

## ¿Qué pasa con los manejadores de eventos? {#how-about-event-handlers}

Los límites de errores **no** capturan errores en los manejadores de eventos.

React no necesita límites de errores para recuperarse de errores en los manejadores de eventos. A diferencia del método render y de los métodos del ciclo de vida, los manejadores de eventos no ocurren durante el renderizado, por lo que, si lanzan una excepción, React sigue sabiendo qué mostrar en la pantalla.

Si necesitas capturar un error dentro de un manejador de eventos, usa la sentencia de `try` / `catch` normal de JavaScript.

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Hacer algo que puede lanzar una excepción
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

Fíjate en que el ejemplo de arriba muestra el comportamiento normal de JavaScript y no usa límites de errores.

## Cambios de nomenclatura desde React 15 {#naming-changes-from-react-15}

React 15 incluía un soporte muy limitado para límites de errores con un nombre de método diferente: `unstable_handleError`. Este método ya no funciona, y necesitarás cambiarlo a `componentDidCatch` en tu código a partir del primer lanzamiento beta de la versión 16.

Para este cambio, hemos provisto un [codemod](https://github.com/reactjs/react-codemod#error-boundaries) para migrar automáticamente tu código.
