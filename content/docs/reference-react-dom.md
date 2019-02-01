---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

Si cargas React desde una etiqueta `<script>`, estas APIs de alto nivel estaran disponibles en la variable global `ReactDOM`. Si usas ES6 con npm, puedes escribir `import ReactDOM from 'react-dom'`. Si usas ES5 con npm, puedes escribir `var ReactDOM = require('react-dom')`.

## Resumen

El paquete `react-dom` proporciona métodos específicos del DOM que pueden ser utilizados en el nivel mas alto de tu aplicación como una escotilla de escape para salir del modelo de React si asi lo necesitas. La mayoría de tus componentes no deberían necesitar usar este modulo.

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Soporte de Navegadores

React soporta todos los navegadores populares, incluyendo Internet Explorer 9 y versiones posteriores, aunque [algunos polyfills son requeridos](/docs/javascript-environment-requirements.html) para navegadores mas viejos como IE 9 e IE 10.

> Nota
>
> No soportamos navegadores viejos que no soporten metodos ES5, pero puede que te des cuenta de que tus aplicaciones funcionan en navegadores viejos si polyfills como [es5-shim y es5-sham](https://github.com/es-shims/es5-shim) estan incluidas en la pagina. Estas por tu cuenta si decides tomar este camino.

* * *

## Referencia

### `render()`

```javascript
ReactDOM.render(elemento, contenedor[, callback])
```

Renderiza un elemento React al DOM en el `contenedor` suministrado y retorna una [referencia](/docs/more-about-refs.html) al componente (o devuelve `null` para [componentes sin estado](/docs/components-and-props.html#functional-and-class-components)).

Si el elemento React fue previamente renderizado al `contenedor`, esto ejecutara una actualización en el, y solo mutara el DOM de ser necesario para reflejar el mas reciente elemento React.

Si el callback opcional es suministrado, sera ejecutado después de que el componente es renderizado o actualizado.

> Nota:
>
> `ReactDOM.render()` controla el contenido del nodo contenedor que suministras. Cualquiera de los elementos DOM adentro de este son reemplazados cuando es llamado por primera vez. Las llamadas posteriores utilizan el algoritmo de diferenciado de React DOM para actualizaciones eficientes.
>
> `ReactDOM.render()` no modifica el nodo contenedor (solo modifica los hijos del contenedor). Puede ser posible insertar un componente en un nodo existente del DOM sin sobrescribir los hijos existentes.
>
> `ReactDOM.render()` actualmente retorna una referencia a la instancia `ReactComponent` raíz. Sin embargo, utilizar este valor retornado es una practica vieja,
> y debe ser evitada debido a que en futuras versiones de React puede que los componentes se renderizen de manera asíncrona en algunos casos. Si deseas obtener una referencia a la instancia `ReactComponent` raíz,
> la solución preferida es agregar una [referencia mediante callback](/docs/more-about-refs.html#the-ref-callback-attribute) al elemento raíz.
>
> Usar `ReactDOM.render()` para refrescar un contenedor renderizado por servidor es una practica vieja, y sera deprecada en la version 17 de React. Usa [`hydrate()`](#hydrate) en su lugar.

* * *

### `hydrate()`

```javascript
ReactDOM.hydrate(element, container[, callback])
```

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.

React expects that the rendered content is identical between the server and the client. It can patch up differences in text content, but you should treat mismatches as bugs and fix them. In development mode, React warns about mismatches during hydration. There are no guarantees that attribute differences will be patched up in case of mismatches. This is important for performance reasons because in most apps, mismatches are rare, and so validating all markup would be prohibitively expensive.

If a single element's attribute or text content is unavoidably different between the server and the client (for example, a timestamp), you may silence the warning by adding `suppressHydrationWarning={true}` to the element. It only works one level deep, and is intended to be an escape hatch. Don't overuse it. Unless it's text content, React still won't attempt to patch it up, so it may remain inconsistent until future updates.

If you intentionally need to render something different on the server and the client, you can do a two-pass rendering. Components that render something different on the client can read a state variable like `this.state.isClient`, which you can set to `true` in `componentDidMount()`. This way the initial render pass will render the same content as the server, avoiding mismatches, but an additional pass will happen synchronously right after hydration. Note that this approach will make your components slower because they have to render twice, so use it with caution.

Remember to be mindful of user experience on slow connections. The JavaScript code may load significantly later than the initial HTML render, so if you render something different in the client-only pass, the transition can be jarring. However, if executed well, it may be beneficial to render a "shell" of the application on the server, and only show some of the extra widgets on the client. To learn how to do this without getting the markup mismatch issues, refer to the explanation in the previous paragraph.

* * *

### `unmountComponentAtNode()`

```javascript
ReactDOM.unmountComponentAtNode(container)
```

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.

* * *

### `findDOMNode()`

> Note:
>
> `findDOMNode` is an escape hatch used to access the underlying DOM node. In most cases, use of this escape hatch is discouraged because it pierces the component abstraction. [It has been deprecated in `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
If this component has been mounted into the DOM, this returns the corresponding native browser DOM element. This method is useful for reading values out of the DOM, such as form field values and performing DOM measurements. **In most cases, you can attach a ref to the DOM node and avoid using `findDOMNode` at all.**

When a component renders to `null` or `false`, `findDOMNode` returns `null`. When a component renders to a string, `findDOMNode` returns a text DOM node containing that value. As of React 16, a component may return a fragment with multiple children, in which case `findDOMNode` will return the DOM node corresponding to the first non-empty child.

> Note:
>
> `findDOMNode` only works on mounted components (that is, components that have been placed in the DOM). If you try to call this on a component that has not been mounted yet (like calling `findDOMNode()` in `render()` on a component that has yet to be created) an exception will be thrown.
>
> `findDOMNode` cannot be used on function components.

* * *

### `createPortal()`

```javascript
ReactDOM.createPortal(child, container)
```

Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).
