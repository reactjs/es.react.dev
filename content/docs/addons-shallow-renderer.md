---
id: shallow-renderer
title: Renderizador superficial
permalink: docs/shallow-renderer.html
layout: docs
category: Referencia
---

**Importando**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 con npm
```

## Resumen {#resumen}

El renderizado superficial es útil cuando escribes pruebas unitarias. El renderizado superficial te permite renderizar un componente a "un nivel de profundidad" y comprobar lo que su método de renderizado retorna sin preocuparse sobre el comportamiento de los componentes hijos, los cuales no son instanciados ni renderizados. Esto no requiere un DOM.

Por ejemplo, si tienes el siguiente componente:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Entonces puedes comprobar:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// en tu prueba:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

Las pruebas superficiales tienen algunas limitaciones, es decir, no soportan referencias.

> Nota:
>
> También recomendamos revisar la [API de Renderizado Superficial](https://airbnb.io/enzyme/docs/api/shallow.html) de Enzyme. Provee una API de alto nivel mucho mejor de la misma funcionalidad.

## Referencia {#referencia}

### `shallowRenderer.render()` {#shallowrendererrender}

Puedes ver el shallowRenderer como un "lugar" para renderizar el componente que quieres probar, y del cual quieres extraer el resultado del componente.

`shallowRenderer.render()` es parecido a [`ReactDOM.render()`](/docs/react-dom.html#render) pero no necesita DOM y solamente renderiza un único nivel de profundidad. Esto quiere decir que se pueden probar componentes sin tener en cuenta como sus hijos son implementados.

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

Después que `shallowRenderer.render()` es llamado, se puede usar `shallowRenderer.getRenderOutput()` para obtener el resultado superficialmente renderizado.

Entonces ya se pueden empezar a comprobar hechos sobre el resultado.
