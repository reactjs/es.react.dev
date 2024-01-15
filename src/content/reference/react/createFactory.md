---
title: createFactory
---

<Deprecated>

Esta API será eliminada en una futura versión mayor de React. [Ver las alternativas.](#alternatives)

</Deprecated>

<Intro>

`createFactory` te permite crear una función que produce elementos React de un tipo dado.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

Llama a `createFactory(type)` para crear una función fábrica que produzca elementos React de un `type` dado.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Luego puedes usarla para crear elementos React sin JSX:

```js
export default function App() {
  return button({
    onClick: () => {
      alert('¡Hiciste clic!')
    }
  }, 'Hazme clic');
}
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `type`: El argumento `type` debe ser un tipo de componente React válido. Por ejemplo, puede ser un _string_ de nombre de etiqueta (como `'div'` o `'span'`), o un componente React (una función, una clase, o un componente especial como [`Fragment`](/reference/react/Fragment)).

#### Devuelve {/*returns*/}

Devuelve una función fábrica. Esa función fábrica recibe un objeto `props` como primer argumento, seguido de una lista de argumentos `...hijos`, y devuelve un elemento React con el `type`, `props` e `hijos` dados.

---

## Uso {/*usage*/}

### Creación de elementos React con una fábrica {/*creating-react-elements-with-a-factory*/}

Aunque la mayoría de los proyectos React usan [JSX](/learn/writing-markup-with-jsx) para describir la interfaz de usuario, JSX no es necesario. En el pasado, `createFactory` solía ser una de las formas de describir la interfaz de usuario sin JSX.

Llama a `createFactory` para crear una *función fábrica* para un tipo de elemento específico como `'button'`:

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Llamar a esa función fábrica producirá elementos React con las props e hijos que hayas proporcionado:

<Sandpack>

```js src/App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('¡Hiciste clic!')
    }
  }, 'Hazme clic');
}
```

</Sandpack>

Así es como se usaba `createFactory` como alternativa a JSX. Sin embargo, `createFactory` está obsoleta, y no deberías llamar a `createFactory` en ningún código nuevo. Ve cómo migrar de `createFactory` más abajo.

---

## Alternativas {/*alternatives*/}

### Copiando `createFactory` en tu proyecto {/*copying-createfactory-into-your-project*/}

Si tu proyecto tiene muchas llamadas a `createFactory`, copia esta implementación `createFactory.js` en tu proyecto:

<Sandpack>

```js src/App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('¡Hiciste clic!')
    }
  }, 'Hazme clic');
}
```

```js src/createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

Esto te permite mantener todo tu código sin cambios excepto las importaciones.

---

### Reemplazar `createFactory` con `createElement` {/*replacing-createfactory-with-createelement*/}

Si tienes algunas llamadas a `createFactory` que no te importa portar manualmente, y no quieres usar JSX, puedes reemplazar cada llamada a una función fábrica con una llamada a [`createElement`](/reference/react/createElement). Por ejemplo, puedes reemplazar este código:

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('¡Hiciste clic!')
    }
  }, 'Hazme clic');
}
```

con este código:

```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('¡Hiciste clic!')
    }
  }, 'Hazme clic');
}
```

Este es un ejemplo completo de uso de React sin JSX:

<Sandpack>

```js src/App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('¡Hiciste clic!')
    }
  }, 'Hazme clic');
}
```

</Sandpack>

---

### Reemplazar `createFactory` con JSX {/*replacing-createfactory-with-jsx*/}

Finalmente, puedes usar JSX en lugar de `createFactory`. Esta es la forma más común de usar React:

<Sandpack>

```js src/App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('¡Hiciste clic!');
    }}>
      Hazme clic
    </button>
  );
};
```

</Sandpack>

<Pitfall>

A veces, tu código existente puede pasar alguna variable como `type` en lugar de una constante como `'button'`:

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

Para hacer lo mismo en JSX, necesitas renombrar tu variable para que comience con una letra mayúscula como `Type`:

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

De lo contrario React interpretará `<type>` como una etiqueta HTML incorporada porque está en minúsculas.

</Pitfall>
