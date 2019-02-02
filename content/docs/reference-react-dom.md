---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

Si cargas React desde una etiqueta `<script>`, estas APIs de alto nivel estarán disponibles en la variable global `ReactDOM`. Si usas ES6 con npm, puedes escribir `import ReactDOM from 'react-dom'`. Si usas ES5 con npm, puedes escribir `var ReactDOM = require('react-dom')`.

## Resumen

El paquete `react-dom` proporciona métodos específicos del DOM que pueden ser utilizados en el nivel más alto de tu aplicación como una escotilla de escape para salir del modelo de React si así lo necesitas. La mayoría de tus componentes no deberían necesitar usar este módulo.

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Soporte de Navegadores

React soporta todos los navegadores populares, incluyendo Internet Explorer 9 y versiones posteriores, aunque [algunos polyfills son requeridos](/docs/javascript-environment-requirements.html) para navegadores más viejos como IE 9 e IE 10.

> Nota
>
> No soportamos navegadores viejos que no soporten métodos ES5, pero puede que te des cuenta de que tus aplicaciones funcionan en navegadores viejos si polyfills como [es5-shim y es5-sham](https://github.com/es-shims/es5-shim) están incluidas en la pagina. Estás por tu cuenta si decides tomar este camino.

* * *

## Referencia

### `render()`

```javascript
ReactDOM.render(elemento, contenedor[, callback])
```

Renderiza un elemento React al DOM en el `contenedor` suministrado y retorna una [referencia](/docs/more-about-refs.html) al componente (o devuelve `null` para [componentes sin estado](/docs/components-and-props.html#functional-and-class-components)).

Si el elemento React fue previamente renderizado al `contenedor`, esto ejecutará una actualización en él, y solo mutará el DOM de ser necesario para reflejar el más reciente elemento React.

Si el callback opcional es suministrado, será ejecutado después de que el componente es renderizado o actualizado.

> Nota:
>
> `ReactDOM.render()` controla el contenido del nodo contenedor que suministras. Cualquiera de los elementos DOM adentro de este son reemplazados cuando es llamado por primera vez. Las llamadas posteriores utilizan el algoritmo de diferenciado de React DOM para actualizaciones eficientes.
>
> `ReactDOM.render()` no modifica el nodo contenedor (solo modifica los hijos del contenedor). Puede ser posible insertar un componente en un nodo existente del DOM sin sobrescribir los hijos existentes.
>
> `ReactDOM.render()` actualmente retorna una referencia a la instancia `ReactComponent` raíz. Sin embargo, utilizar este valor retornado es una práctica vieja,
> y debe ser evitada debido a que en futuras versiones de React puede que los componentes se rendericen de manera asíncrona en algunos casos. Si deseas obtener una referencia a la instancia `ReactComponent` raíz,
> la solución preferida es agregar una [referencia mediante callback](/docs/more-about-refs.html#the-ref-callback-attribute) al elemento raíz.
>
> Usar `ReactDOM.render()` para actualizar un contenedor renderizado por servidor es una práctica vieja, y será deprecada en la versión 17 de React. Usa [`hydrate()`](#hydrate) en su lugar.

* * *

### `hydrate()`

```javascript
ReactDOM.hydrate(elemento, contenedor[, callback])
```

Es igual a [`render()`](#render), pero es utilizado para actualizar un contenedor cuyo contenido HTML fue renderizado por [`ReactDOMServer`](/docs/react-dom-server.html). React tratará de agregar detectores de eventos al marcado existente.

React espera que el contenido renderizado sea idéntico entre el servidor y el cliente. Puede arreglar las diferencias del contenido de texto, pero deberías tratar los desajustes como errores, y arreglarlos. En modo de desarrollo, React alerta sobre desajustes durante la actualización. No hay garantías de que las diferencias de atributos serán arregladas en caso de desajustes. Esto es importante por razones de rendimiento, porque en la mayoría de las aplicaciones los desajustes son raros, por esto validar todo el marcado seria prohibitivamente costoso.

Si el atributo de un elemento o contenido de texto es inevitablemente diferente entre el servidor y el cliente (por ejemplo, una marca de tiempo), puedes silenciar la alerta agregando `suppressHydrationWarning={true}` al elemento. Esto solo funciona a 1 nivel de profundidad, y es pensado para ser una escotilla de escape. No abuses de él. A menos que sea contenido de texto, React aun no intentará arreglarlo, así que es posible que continue inconsistente hasta próximas actualizaciones.

Si necesitas renderizar algo diferente de manera intencional en el servidor y en el cliente, puedes realizar un renderizado en 2 pasos. Los componentes que renderizan contenido diferente al cliente, pueden leer una variable de estado como `this.state.isClient`, la cual puedes cambiar a `true` en `componentDidMount()`. De esta manera, el pase de renderizado inicial renderizará el mismo contenido que el servidor, evitando desajustes, pero un pase adicional pasará síncronamente justo después de la actualización. Recuerda que este enfoque hará que tus componentes sean más lentos debido a que se deben renderizar 2 veces, asi que usa esto con precaución.

Recuerda estar consciente de la experiencia de usuario en conexiones lentas. El código Javascript puede ser cargado significativamente después de que el HTML inicial sea renderizado, entonces, si renderizas algo diferente en el pase exclusivo por el cliente, la transición puede ser discorde. Sin embargo, si se ejecuta bien, puede ser beneficioso para renderizar una "capa" de la aplicación en el servidor, y solo mostrar unos widgets extra en el cliente. Para aprender cómo hacer esto sin tener desajustes en el marcado, consulta la explicación en el párrafo anterior.

* * *

### `unmountComponentAtNode()`

```javascript
ReactDOM.unmountComponentAtNode(contenedor)
```

Remueve un componente React ya montado en el DOM, y limpia sus manejadores de eventos y estado. Si ningún componente fue montado en el contenedor, llamar a esta función no hará nada. Retorna `true` si un componente fue desmontado, y `false` si no hay algún componente para desmontar.

* * *

### `findDOMNode()`

> Nota:
>
> `findDOMNode` es una escotilla de escape para acceder al componente DOM subyacente. En la mayoría de los casos, usar esta escotilla de escape no es recomendado debido a que atraviesa la abstracción del componente. [Esto ha sido deprecado en modo estricto: `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(componente)
```
Si este componente ha sido montado al DOM, este método retorna el elemento DOM nativo correspondiente. Este método es útil para leer valores fuera del DOM, como por ejemplo valores de formularios, o realizar mediciones del DOM. **En la mayoría de casos, puedes agregar una referencia al nodo del DOM, y evitar el uso de `findDOMNode` por completo**.

Cuando un componente es renderizado a `null` o `false`, `findDOMNode` retorna `null`. Cuando un componente es renderizado a una cadena de texto, `findDOMNode` retorna un nodo DOM de texto que contiene ese valor. En React 16, un componente puede retornar un fragmento con múltiples hijos, en este caso `findDOMNode` retornará el nodo del DOM correspondiente al primer hijo no vació.

> Nota:
>
> `findDOMNode` solo funciona con componentes montados (esto significa, componentes que han sido puestos en el DOM). Si tratas de llamar este método con un componente que aún no ha sido montado (por ejemplo, llamar `findDOMNode()` en `render()` con un componente que aún no ha sido creado) generará una excepción.
>
> `findDOMNode` no puede ser utilizado con componentes de tipo función.

* * *

### `createPortal()`

```javascript
ReactDOM.createPortal(hijo, contenedor)
```

Crea un portal. Los portales proveen una forma para [renderizar hijos a un nodo del DOM que existe fuera de la jerarquía del componente DOM](/docs/portals.html).