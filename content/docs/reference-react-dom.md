---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

El paquete `react-dom` proporciona métodos específicos del DOM que pueden ser utilizados en el nivel más alto de tu aplicación como una vía de escape del modelo de React si así lo necesitas.

```js
import * as ReactDOM from 'react-dom';
```

Si utilizas ES5 con npm, puedes escribir:

```js
var ReactDOM = require('react-dom');
```

El paquete `react-dom` también proporciona módulos específicos para aplicaciones en el cliente y el servidor:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)

## Resumen {#overview}

El paquete `react-dom` exporta estos métodos:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)

Estos métodos de `react-dom` también se exportan, pero se consideran legados:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Nota: 
> 
> Tanto `render` como `hydrate` se han reemplazado por [métodos del cliente](/docs/react-dom-client.html) en React 18. Estos métodos te advertirán que tu aplicación se comportará como si estuviera ejecutándose en React 17 (más información [aquí](https://es.reactjs.org/link/switch-to-createroot)).

### Soporte de navegadores {#browser-support}

React es compatible con todos los navegadores modernos, aunque [se requieren algunos polyfills](/docs/javascript-environment-requirements.html) para entornos más antiguos.

> Nota
>
> No aseguramos la compatibilidad con los navegadores más antiguos que no incluyen métodos ES5 o microtareas como Internet Explorer. Quizá encuentres que tus aplicaciones funcionan en estos navegadores si *polyfills* como [es5-shim y es5-sham](https://github.com/es-shims/es5-shim) están incluidos en la página, pero estás por tu cuenta si decides tomar este camino.

## Referencia {#reference}

### `createPortal()` {#createportal}

> Prueba la nueva documentación de React para [`createPortal`](https://beta.es.reactjs.org/reference/react-dom/createPortal).
>
> La nueva documentación reemplazará próximamente este sitio, que será archivado. [Deja tu opinión aquí](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
createPortal(child, container)
```

Crea un portal. Los portales proporcionan una forma de [renderizar hijos en un nodo del DOM que existe fuera de la jerarquía del DOM del componente](/docs/portals.html).

### `flushSync()` {#flushsync}

> Prueba la nueva documentación de React para [`flushSync`](https://beta.es.reactjs.org/reference/react-dom/flushSync).
>
> La nueva documentación reemplazará próximamente este sitio, que será archivado. [Deja tu opinión aquí](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
flushSync(callback)
```

Obliga a React a ejecutar síncronamente todas las actualizaciones dentro del *callback* proporcionado. Así se asegura que el DOM se actualiza inmediatamente.

```javascript
// Obliga a que esta actualización del estado sea síncrona.
flushSync(() => {
  setCount(count + 1);
});
// En este punto, el DOM está actualizado.

> Nota:
> 
> `flushSync` puede afectar significativamente el rendimiento. Úsalo con moderación.
> 
> `flushSync` puede obligar a las barreras Suspense pendientes a que muestren su estado `fallback`.
> 
> `flushSync` puede también ejecutar los efectos pendientes y aplicar sincrónicamente cualquier actualización que estas contengan antes de retornar.
> 
> `flushSync` también puede ejecutar actualizaciones fuera del *callback* cuando sea necesario para ejecutar la actualizaciones dentro del *callback*. Por ejemplo, si hay actualizaciones pendientes de un clic, React puede ejecutar esas antes de ejecutar las actualizaciones dentro del *callback*.

## Referencia legada {#legacy-reference}
### `render()` {#render}

> Prueba la nueva documentación de React para [`render`](https://beta.es.reactjs.org/reference/react-dom/render).
>
> La nueva documentación reemplazará próximamente este sitio, que será archivado. [Deja tu opinión aquí](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
render(element, container[, callback])
```

> Nota:
>
> `render` ha sido reemplazado con `createRoot` en React 18. Consulta [createRoot](/docs/react-dom-client.html#createroot) para más información.

Renderiza un elemento React al DOM en el `contenedor` suministrado y retorna una [referencia](/docs/more-about-refs.html) al componente (o devuelve `null` para [componentes sin estado](/docs/components-and-props.html#function-and-class-components)).

Si el elemento React fue previamente renderizado al `contenedor`, esto ejecutará una actualización en él, y solo mutará el DOM de ser necesario para reflejar el más reciente elemento React.

Si se suministra el *callback* opcional, será ejecutado después de que el componente es renderizado o actualizado.

> Nota:
>
> `render()` controla el contenido del nodo contenedor que suministras. Cualquiera de los elementos DOM dentro de este son reemplazados cuando se llama por primera vez. Las llamadas posteriores utilizan el algoritmo de diferenciado de React DOM para actualizaciones eficientes.
>
> `render()` no modifica el nodo contenedor (solo modifica los hijos del contenedor). Puede ser posible insertar un componente en un nodo existente del DOM sin sobrescribir los hijos existentes.
>
> `render()` actualmente retorna una referencia a la instancia `ReactComponent` raíz. Sin embargo, utilizar este valor retornado es una práctica vieja,
> y debe ser evitada debido a que en futuras versiones de React puede que los componentes se rendericen de manera asíncrona en algunos casos. Si deseas obtener una referencia a la instancia `ReactComponent` raíz,
> la solución preferida es agregar una [referencia mediante callback](/docs/refs-and-the-dom.html#callback-refs) al elemento raíz.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) instead.

* * *

### `hydrate()` {#hydrate}

> Prueba la nueva documentación de React para [`hydrate`](https://beta.es.reactjs.org/reference/react-dom/hydrate).
>
> La nueva documentación reemplazará próximamente este sitio, que será archivado. [Deja tu opinión aquí](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
hydrate(elemento, contenedor[, callback])
```

> Nota:
>
> `hydrate` ha sido reemplazado con `hydrateRoot` en React 18. Consulta [hydrateRoot](/docs/react-dom-client.html#hydrateroot) para más información.

Es igual a [`render()`](#render), pero es utilizado para hidratar un contenedor cuyo contenido HTML fue renderizado por [`ReactDOMServer`](/docs/react-dom-server.html). React tratará de agregar detectores de eventos al marcado existente.

React espera que el contenido renderizado sea idéntico entre el servidor y el cliente. Puede arreglar las diferencias del contenido de texto, pero deberías tratar los desajustes como errores y arreglarlos. En modo de desarrollo, React alerta sobre desajustes durante la hidratación. No hay garantías de que las diferencias de atributos sean arregladas en caso de desajustes. Esto es importante por razones de rendimiento, porque en la mayoría de las aplicaciones los desajustes son raros y validar todo el marcado sería demasiado costoso.

Si el atributo de un elemento o contenido de texto es inevitablemente diferente entre el servidor y el cliente (por ejemplo, una marca de tiempo), puedes silenciar la alerta agregando `suppressHydrationWarning={true}` al elemento. Esto solo funciona a 1 nivel de profundidad, y está pensado como una vía de escape. No abuses de él. A menos que sea contenido de texto, React aun no intentará arreglarlo, así que es posible que continúe inconsistente hasta próximas actualizaciones.

Si necesitas renderizar algo diferente de manera intencional en el servidor y en el cliente, puedes realizar un renderizado en 2 pasos. Los componentes que renderizan contenido diferente al cliente, pueden leer una variable de estado como `this.state.isClient`, la cual puedes cambiar a `true` en `componentDidMount()`. De esta manera, el paso de renderizado inicial renderizará el mismo contenido que el servidor, evitando desajustes, pero un paso adicional ocurrirá síncronamente justo después de la hidratación. Recuerda que este enfoque hará que tus componentes sean más lentos debido a que se deben renderizar dos veces, así que utilízalo con precaución.

Recuerda estar consciente de la experiencia de usuario en conexiones lentas. El código Javascript puede ser cargado significativamente después de que el HTML inicial sea renderizado, entonces, si renderizas algo diferente en el paso exclusivo por el cliente, la transición puede ser discorde. Sin embargo, si se ejecuta bien, puede ser beneficioso para renderizar una «capa» de la aplicación en el servidor, y solo mostrar unos *widgets* extra en el cliente. Para aprender cómo hacer esto sin tener desajustes en el marcado, consulta la explicación en el párrafo anterior.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

> Prueba la nueva documentación de React para [`unmountComponentAtNode`](https://beta.es.reactjs.org/reference/react-dom/unmountComponentAtNode).
>
> La nueva documentación reemplazará próximamente este sitio, que será archivado. [Deja tu opinión aquí](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
unmountComponentAtNode(contenedor)
```

> Nota:
>
> `unmountComponentAtNode` ha sido reemplazado con `root.unmount()` en React 18. Consulta [createRoot](/docs/react-dom-client.html#createroot) para más información.

Elimina un componente React ya montado en el DOM, y limpia sus manejadores de eventos y estado. Si ningún componente fue montado en el contenedor, llamar a esta función no hará nada. Retorna `true` si un componente fue desmontado, y `false` si no hay algún componente para desmontar.

* * *

### `findDOMNode()` {#finddomnode}

> Prueba la nueva documentación de React para [`findDOMNode`](https://beta.es.reactjs.org/reference/react-dom/findDOMNode).
>
> La nueva documentación reemplazará próximamente este sitio, que será archivado. [Deja tu opinión aquí](https://github.com/reactjs/reactjs.org/issues/3308)

> Nota:
>
> `findDOMNode` es una vía de escape para acceder al componente DOM subyacente. En la mayoría de los casos no se recomienda, debido a que rompe la abstracción del componente. [Su uso esta censurado en el modo estricto (StrictMode).](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```
Si este componente ha sido montado al DOM, este método retorna el elemento DOM nativo correspondiente. Este método es útil para leer valores fuera del DOM, como por ejemplo valores de formularios, o realizar mediciones del DOM. **En la mayoría de casos, puedes agregar una referencia al nodo del DOM, y evitar el uso de `findDOMNode` por completo**.

Cuando un componente es renderizado a `null` o `false`, `findDOMNode` retorna `null`. Cuando un componente es renderizado a una cadena de texto, `findDOMNode` retorna un nodo DOM de texto que contiene ese valor. En React 16, un componente puede retornar un fragmento con múltiples hijos, en este caso `findDOMNode` retornará el nodo del DOM correspondiente al primer hijo no vacío.

> Nota:
>
> `findDOMNode` solo funciona con componentes montados (esto significa, componentes que han sido puestos en el DOM). Si tratas de llamar este método con un componente que aún no ha sido montado (por ejemplo, llamar `findDOMNode()` en `render()` con un componente que aún no ha sido creado) generará una excepción.
>
> `findDOMNode` no puede ser utilizado en componentes de función.

* * *
