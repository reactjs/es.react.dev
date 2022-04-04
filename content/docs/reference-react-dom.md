---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
Si cargas React desde una etiqueta `<script>`, estas APIs de alto nivel estarán disponibles en la variable global `ReactDOM`. Si usas ES6 con npm, puedes escribir `import ReactDOM from 'react-dom'`. Si usas ES5 con npm, puedes escribir `var ReactDOM = require('react-dom')`.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

## Resumen {#overview}

<<<<<<< HEAD
El paquete `react-dom` proporciona métodos específicos del DOM que pueden ser utilizados en el nivel más alto de tu aplicación como una vía de escape del modelo de React si así lo necesitas. La mayoría de tus componentes no deberían necesitar usar este módulo.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### Soporte de navegadores {#browser-support}

<<<<<<< HEAD
React es compatible con todos los navegadores populares, incluyendo Internet Explorer 9 y versiones posteriores, aunque [se necesitan algunos *polyfills*](/docs/javascript-environment-requirements.html) para navegadores más antiguos como IE 9 e IE 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Nota
>
<<<<<<< HEAD
> No aseguramos la compatibilidad con los navegadores más antiguos que no incluyen métodos ES5, pero quizá encuentres que tus aplicaciones funcionan en estos navegadores si *polyfills* como [es5-shim y es5-sham](https://github.com/es-shims/es5-shim) están incluidos en la página. Estás por tu cuenta si decides tomar este camino.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

## Referencia {#reference}

### `createPortal()` {#createportal}

```javascript
<<<<<<< HEAD
ReactDOM.render(elemento, contenedor[, callback])
```

Renderiza un elemento React al DOM en el `contenedor` suministrado y retorna una [referencia](/docs/more-about-refs.html) al componente (o devuelve `null` para [componentes sin estado](/docs/components-and-props.html#function-and-class-components)).
=======
createPortal(child, container)
```

Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This method is useful for being able to read the result of those updates immediately.

> Note:
> 
> `flushSync` can have a significant impact on performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

Si el elemento React fue previamente renderizado al `contenedor`, esto ejecutará una actualización en él, y solo mutará el DOM de ser necesario para reflejar el más reciente elemento React.

Si se suministra el *callback* opcional, será ejecutado después de que el componente es renderizado o actualizado.

> Nota:
>
<<<<<<< HEAD
> `ReactDOM.render()` controla el contenido del nodo contenedor que suministras. Cualquiera de los elementos DOM dentro de este son reemplazados cuando se llama por primera vez. Las llamadas posteriores utilizan el algoritmo de diferenciado de React DOM para actualizaciones eficientes.
>
> `ReactDOM.render()` no modifica el nodo contenedor (solo modifica los hijos del contenedor). Puede ser posible insertar un componente en un nodo existente del DOM sin sobrescribir los hijos existentes.
>
> `ReactDOM.render()` actualmente retorna una referencia a la instancia `ReactComponent` raíz. Sin embargo, utilizar este valor retornado es una práctica vieja,
> y debe ser evitada debido a que en futuras versiones de React puede que los componentes se rendericen de manera asíncrona en algunos casos. Si deseas obtener una referencia a la instancia `ReactComponent` raíz,
> la solución preferida es agregar una [referencia mediante callback](/docs/refs-and-the-dom.html#callback-refs) al elemento raíz.
>
> El uso de `ReactDOM.render()` para hidratar un contenedor renderizado por servidor esta despreciado, y será eliminado en la versión 17 de React. Usa en su lugar [`hydrate()`](#hydrate).
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `hydrate()` {#hydrate}

```javascript
<<<<<<< HEAD
ReactDOM.hydrate(elemento, contenedor[, callback])
```

Es igual a [`render()`](#render), pero es utilizado para hidratar un contenedor cuyo contenido HTML fue renderizado por [`ReactDOMServer`](/docs/react-dom-server.html). React tratará de agregar detectores de eventos al marcado existente.
=======
hydrate(element, container[, callback])
```

> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

React espera que el contenido renderizado sea idéntico entre el servidor y el cliente. Puede arreglar las diferencias del contenido de texto, pero deberías tratar los desajustes como errores y arreglarlos. En modo de desarrollo, React alerta sobre desajustes durante la hidratación. No hay garantías de que las diferencias de atributos sean arregladas en caso de desajustes. Esto es importante por razones de rendimiento, porque en la mayoría de las aplicaciones los desajustes son raros y validar todo el marcado sería demasiado costoso.

Si el atributo de un elemento o contenido de texto es inevitablemente diferente entre el servidor y el cliente (por ejemplo, una marca de tiempo), puedes silenciar la alerta agregando `suppressHydrationWarning={true}` al elemento. Esto solo funciona a 1 nivel de profundidad, y está pensado como una vía de escape. No abuses de él. A menos que sea contenido de texto, React aun no intentará arreglarlo, así que es posible que continúe inconsistente hasta próximas actualizaciones.

Si necesitas renderizar algo diferente de manera intencional en el servidor y en el cliente, puedes realizar un renderizado en 2 pasos. Los componentes que renderizan contenido diferente al cliente, pueden leer una variable de estado como `this.state.isClient`, la cual puedes cambiar a `true` en `componentDidMount()`. De esta manera, el paso de renderizado inicial renderizará el mismo contenido que el servidor, evitando desajustes, pero un paso adicional ocurrirá síncronamente justo después de la hidratación. Recuerda que este enfoque hará que tus componentes sean más lentos debido a que se deben renderizar dos veces, así que utilízalo con precaución.

Recuerda estar consciente de la experiencia de usuario en conexiones lentas. El código Javascript puede ser cargado significativamente después de que el HTML inicial sea renderizado, entonces, si renderizas algo diferente en el paso exclusivo por el cliente, la transición puede ser discorde. Sin embargo, si se ejecuta bien, puede ser beneficioso para renderizar una «capa» de la aplicación en el servidor, y solo mostrar unos *widgets* extra en el cliente. Para aprender cómo hacer esto sin tener desajustes en el marcado, consulta la explicación en el párrafo anterior.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
<<<<<<< HEAD
ReactDOM.unmountComponentAtNode(contenedor)
```

Elimina un componente React ya montado en el DOM, y limpia sus manejadores de eventos y estado. Si ningún componente fue montado en el contenedor, llamar a esta función no hará nada. Retorna `true` si un componente fue desmontado, y `false` si no hay algún componente para desmontar.
=======
unmountComponentAtNode(container)
```

> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `findDOMNode()` {#finddomnode}

> Nota:
>
> `findDOMNode` es una vía de escape para acceder al componente DOM subyacente. En la mayoría de los casos no se recomienda, debido a que rompe la abstracción del componente. [Su uso esta censurado en el modo estricto (StrictMode).](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
<<<<<<< HEAD
ReactDOM.findDOMNode(componente)
=======
findDOMNode(component)
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
```
Si este componente ha sido montado al DOM, este método retorna el elemento DOM nativo correspondiente. Este método es útil para leer valores fuera del DOM, como por ejemplo valores de formularios, o realizar mediciones del DOM. **En la mayoría de casos, puedes agregar una referencia al nodo del DOM, y evitar el uso de `findDOMNode` por completo**.

Cuando un componente es renderizado a `null` o `false`, `findDOMNode` retorna `null`. Cuando un componente es renderizado a una cadena de texto, `findDOMNode` retorna un nodo DOM de texto que contiene ese valor. En React 16, un componente puede retornar un fragmento con múltiples hijos, en este caso `findDOMNode` retornará el nodo del DOM correspondiente al primer hijo no vacío.

> Nota:
>
> `findDOMNode` solo funciona con componentes montados (esto significa, componentes que han sido puestos en el DOM). Si tratas de llamar este método con un componente que aún no ha sido montado (por ejemplo, llamar `findDOMNode()` en `render()` con un componente que aún no ha sido creado) generará una excepción.
>
> `findDOMNode` no puede ser utilizado en componentes de función.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(hijo, contenedor)
```

Crea un portal. Los portales proveen una forma para [renderizar hijos a un nodo del DOM que existe fuera de la jerarquía del componente DOM](/docs/portals.html).
=======
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
