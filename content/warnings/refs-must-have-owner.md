---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---

Probablemente estés aquí porque recibió uno de los siguientes mensajes de error:

*React 16.0.0+*
> Advertencia:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).

*versiones anteriores de React*
> Advertencia:
>
> addComponentAsRefTo(...): solo un ReactOwner puede tener refs. Es posible que esté agregando un ref a un componente que no se creó dentro del método `render` de un componente, o si tiene varias copias cargadas de React.

Esto usualmente significa una de tres cosas:

- Estás intentando agregar un `ref` a un componente de función.
- Está intentando agregar un `ref` a un elemento que se está creando fuera de la función render() de un componente.
- Tiene varias copias (en conflicto) de React cargadas (por ejemplo, debido a una dependencia npm mal configurada)

## Refs en los componentes de función {#refs-on-function-components}

Si `<Foo>` es un componente de función, no puedes agregarle una referencia:

```js
// ¡No funciona si Foo es una función!
<Foo ref={foo} />
```

If you need to add a ref to a component, convert it to a class first, or consider not using refs as they are [rarely necessary](/docs/refs-and-the-dom.html#when-to-use-refs).
Si necesitas agregar una referencia a un componente, primero conviértelo a una clase, o considera no usar las referencias ya que son [raramente necesarias](/docs/refs-and-the-dom.html#when-to-use-refs).

## Cadenas de Ref fuera del método Render {#strings-refs-outside-the-render-method}

Esto generalmente significa que estás intentando agregar una referencia a un componente que no tiene un propietario (es decir, no se creó dentro del método `render` de otro componente). Por ejemplo, esto no funcionará:

```js
// ¡No funciona!
ReactDOM.render(<App ref="app" />, el);
```

Intenta renderizar este componente dentro de un nuevo componente de nivel superior que contendrá la referencia. Como alternativa, puedes utilizar una referencia de callback:

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Considera si [realmente necesitas una referencia](/docs/refs-and-the-dom.html#when-to-use-refs) antes de usar este enfoque.

## Múltiples copias de React {#multiple-copies-of-react}

Bower hace un buen trabajo de deduplicación de dependencias, pero npm no lo hace. Si no está haciendo nada (elegante) con refs, hay una buena probabilidad de que el problema no sea con sus refs, sino más bien un problema con tener varias copias de React cargadas en tu proyecto. A veces, cuando ingresa un módulo de terceros a través de npm, obtendrás una copia duplicada de la biblioteca de dependencias, y esto puede crear problemas.

Si estás utilizando npm... `npm ls` o `npm ls react` pueden ayudarte a iluminarte.
