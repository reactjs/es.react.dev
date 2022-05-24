---
id: strict-mode
title: Modo estricto
permalink: docs/strict-mode.html
---

`StrictMode` es una herramienta para destacar problemas potenciales en la aplicación. Al igual que `Fragment`, `StrictMode` no renderiza nada en la interfaz de usuario. Este modo también activa advertencias y comprobaciones adicionales para sus descendientes.

> Nota:
>
> Las comprobaciones hechas por el modo estricto solamente son ejecutadas en el modo de desarrollo; _no van a impactar producción_.

Puedes habilitar el modo estricto para cualquier parte de tu aplicación. Por ejemplo:
`embed:strict-mode/enabling-strict-mode.js`

En el ejemplo anterior, las comprobaciones del modo estricto *no* va a correr en los componentes de `Header` y `Footer`. Sin embargo, `ComponentOne` y `ComponentTwo`, así como todos sus descendientes, tendrán las comprobaciones.

`StrictMode` en la actualidad ayuda a:
* [Identificar ciclos de vida inseguros](#identifying-unsafe-lifecycles)
* [Advertencia sobre el uso de la API legado de string ref](#warning-about-legacy-string-ref-api-usage)
* [Advertencia sobre el uso del método obsoleto findDOMNode](#warning-about-deprecated-finddomnode-usage)
* [Detectar efectos secundarios inesperados](#detecting-unexpected-side-effects)
* [Detectar el uso de la API legado para el contexto](#detecting-legacy-context-api)
* [Asegurar estado reutilizable](#ensuring-reusable-state)

Funcionalidades adicionales serán agregadas en futuras versiones de React.

### Identificar ciclos de vida inseguros {#identifying-unsafe-lifecycles}

Como fue explicado [en este artículo del blog](/blog/2018/03/27/update-on-async-rendering.html), algunos ciclos de vida antiguos son inseguros para ser usados en aplicaciones de React asíncronas. Sin embargo, si tu aplicación utiliza bibliotecas de terceros, puede ser difícil asegurar que estos ciclos de vida no estén siendo utilizados. Por fortuna, ¡el modo estricto puede ayudar con esto!

Cuando el modo estricto está habilitado, React reúne en una lista todos los componentes de clases que están usando ciclos de vida inseguros, y registra por medio de un mensaje de advertencia la información sobre estos componentes, de esta forma:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Solucionar los problemas identificados por el modo estricto _ahora_, hará que sea más fácil para ti aprovechar el renderizado asíncrono en futuras versiones de React.

### Advertencia sobre el uso de la API legado de string ref {#warning-about-legacy-string-ref-api-usage}

Anteriormente, React proporcionaba dos formas para utilizar refs: la API legado de string ref y la API por callback. Aunque la API de string ref era la más cómoda de las dos, tenía [muchas desventajas](https://github.com/facebook/react/issues/1373) y por lo tanto nuestra recomendación oficial fue [usar la forma de callback en su lugar](/docs/refs-and-the-dom.html#legacy-api-string-refs)

React 16.3 agregó una tercera opción que ofrece la comodidad que tiene string ref sin ninguna de las desventajas:
`embed:16-3-release-blog-post/create-ref-example.js`

Desde que los object refs fueron agregados en gran parte como reemplazo a los string refs, el modo estricto ahora advierte sobre el uso de string refs.

> **Nota:**
>
> Los callback refs seguirán siendo soportados en conjunto con la nueva API de `createRef`.
>
> No necesitas reemplazar los callback refs en tu componente. Son un poco más flexibles, por lo que continuarán estando como una característica avanzada.

[Aprende más sobre la API `createRef` aquí.](/docs/refs-and-the-dom.html)

### Advertencia sobre el uso del método obsoleto findDOMNode {#warning-about-deprecated-finddomnode-usage}

React solía soportar `findDOMNode` para buscar en el árbol un nodo del DOM dada una instancia de una clase. Normalmente no necesitas hacer esto ya que puedes [vincular un ref directamente un nodo del DOM](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode`también puede ser utilizado en componentes con clases pero esto estaba dañando los niveles de abstracción al permitir a un padre solicitar que cierto hijo fuera renderizado. Esto crea un peligro para refactorizar algo en el caso que no puedas cambiar los detalles de la implementación de un componente ya que un padre puede estar utilizando uno de sus nodos del DOM. `findDOMNode` sólo retorna el primer hijo, pero con el uso de los Fragmentos, es posible que un componente pueda renderizar múltiples nodos del DOM. `findDOMNode` es una API de solo lectura para usar una sola vez. Sólo da una respuesta cuando se invoca el método. Si un componente hijo renderiza un nodo diferente, no hay forma alguna de manipular este cambio. Por lo tanto `findDOMNode` solo funciona si los componentes simpre retornan un solo nodo de DOM que nunca cambie.

En su lugar puedes hacer que este comportamiento sea explicito pasando un ref a tu componente personalizado y transmitiéndolo al DOM usando el [reenvío de ref](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

También puedes agregar un nodo del DOM envuelto en tu componente y vincular un ref directamente al mismo.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> Nota:
>
> En CSS, el atributo [`display: contents`](https://developer.mozilla.org/es/docs/Web/CSS/display#display_contents) puede ser usado si no quieres que el nodo sea parte de la estructura.

### Detectar efectos secundarios inesperados {#detecting-unexpected-side-effects}

Conceptualmente, React funciona en dos fases:
* La fase de **renderizado** determina que cambios deben ser hechos a p.ej. el DOM. Durante esta fase, React llama a `render` y compara su resultado con los del renderizado anterior.
* La fase de **confirmación** es aquella donde React aplica cualquiera de los cambios. (En el caso de React en el DOM, esto es cuando React inserta, actualiza y remueve nodos del DOM.) React también llama ciclos de vida tales como `componentDidMount` y `componentDidUpdate` durante esta fase.

La fase de **confirmación** es muy rápida generalmente, pero el renderizado puede ser lento. Por esta razón, el próximo modo asíncrono (que no está habilitado por defecto aún) separa el trabajo de renderizado en diferentes etapas, pausando y reanudando el trabajo para prevenir bloquear el navegador. Esto significa que React puede que invoque los ciclos de vida presentes en la fase de renderizado múltiples veces antes de terminar la confirmación, o puede invocarlos todos sin terminar la confirmación (porque ocurrió algún error o una interrupción de alta prioridad).

El ciclo de vida de la fase de renderizado incluye los siguientes métodos de los componentes en clases:
* `constructor`
* `componentWillMount` (or `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* Funciones de actualización de `setState` (el primer argumento)

Ya que los métodos arriba mencionados pueden ser llamados más de una vez, es importante que estos no contengan ningún efecto secundario. Ignorar esta regla puede llevar a una cantidad de problemas, incluyendo fugas de memoria y estados de aplicación inválido. Desafortunadamente, puede ser muy difícil el detectar estos problemas ya con frecuencia pueden ser [no deterministas](https://es.wikipedia.org/wiki/Algoritmo_determinista).

El modo estricto no puede detectar efectos secundarios de forma automática por ti, pero te puede ayudar a encontrarlos al hacerlos un poco más deterministas. Esto se logra al invocar dos veces las siguientes funciones:

* Los métodos `constructor`, `render` y `shouldComponentUpdate` de los componentes de clase
* El método estático `getDerivedStateFromProps` de los componentes de clase
* El cuerpo de los componentes de función
* Funciones de actualización del estado (el primer argumento de `setState`)
* Las funciones que se pasan a `useState`, `useMemo` o `useReducer`

> Nota:
>
> Esto solo aplica al modo de desarrollo. _Los ciclos de vida no serán invocados dos veces en el modo de producción._

Por ejemplo, considera el siguiente código:
`embed:strict-mode/side-effects-in-constructor.js`

En primera instancia, este código no debería parecer problemático. Pero si `SharedApplicationState.recordEvent` no es [idempotente](https://es.wikipedia.org/wiki/Idempotencia_(inform%C3%A1tica)), entonces al instanciar este componente múltiples veces puede llevar a que tenga un estado de aplicación inválido. Estos tipo de bug sutiles pueden no manifestarse durante el desarrollo, o quizas sí lo hagan pero de forma inconsistente y se pase por alto.

Al invocar los métodos dos veces, como el constructor del componente, el modo estricto hace que patrones como estos sean más fáciles de encontrar.

> Nota:
>
> A partir de React 17, React modifica automáticamente los métodos de consola como `console.log()` para silenciar los logs en la segunda llamada a las funciones de ciclo de vida. Sin embargo, esto puede causar comportamientos no deseados en algunos casos para los que se puede [usar una solución alternativa](https://github.com/facebook/react/issues/20090#issuecomment-715927125).
>
> Comenzando con React 18, React no suprime ningún log. No obstante, si tienes instaladas las herramientas de desarrollo de React, los logs de la segunda llamada aparecerán ligeramente atenuados. React DevTools también ofrece una configuración (desactivada por defecto) para suprimirlos completamente.

### Detectar el uso de la API legada para el contexto {#detecting-legacy-context-api}

La API legada para el contexto es propensa a errores, y será eliminada en una versión principal a futuro. Aún está funcionando para todas las versiones 16.x pero mostrará el siguiente mensaje de advertencia si se usa en modo estricto:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Lee sobre la [nueva documentación de la API de contexto](/docs/context.html) para ayudarte a migrar a la nueva versión.


### Ensuring reusable state {#ensuring-reusable-state}

In the future, we’d like to add a feature that allows React to add and remove sections of the UI while preserving state. For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen. To do this, React support remounting trees using the same component state used before unmounting.

This feature will give React better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times. Most effects will work without any changes, but some effects do not properly clean up subscriptions in the destroy callback, or implicitly assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode. This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

To demonstrate the development behavior you'll see in Strict Mode with this feature, consider what happens when React mounts a new component. Without this change, when a component mounts, React creates the effects:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```

With Strict Mode starting in React 18, whenever a component mounts in development, React will simulate immediately unmounting and remounting the component:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates effects being destroyed on a mounted component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates effects being re-created on a mounted component.
    * Layout effects are created
    * Effect setup code runs
```

On the second mount, React will restore the state from the first mount. This feature simulates user behavior such as a user tabbing away from a screen and back, ensuring that code will properly handle state restoration.

When the component unmounts, effects are destroyed as normal:

```
* React unmounts the component.
  * Layout effects are destroyed.
  * Effect effects are destroyed.
```

Unmounting and remounting includes:

- `componentDidMount`
- `componentWillUnmount`
- `useEffect`
- `useLayoutEffect`
- `useInsertionEffect`

> Note:
>
> This only applies to development mode, _production behavior is unchanged_.

For help supporting common issues, see:
  - [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18)
