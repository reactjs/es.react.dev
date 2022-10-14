---
title: createFactory
---

<Deprecated>

Esta API será eliminada en una versión mayor de React en un futuro. [Ver las alternativas.](#alternatives)

</Deprecated>

<Intro>

`createFactory` permite crear una función que produce elementos React de un tipo determinado.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Creación de elementos React con una Factory {/*creating-react-elements-with-a-factory*/}

<Deprecated>

Esta API será eliminada en una versión mayor de React en un futuro. [Ver las alternativas.](#alternatives)

</Deprecated>

Aunque la mayoría de los proyectos React utilizan [JSX](/learn/writing-markup-with-jsx) para describir la interfaz de usuario, no se requiere JSX. En el pasado, `createFactory` solía ser una de las formas de describir la interfaz de usuario sin JSX.

Llama a `createFactory` para crear una *función de Factory* para un tipo de elemento específico como `'button'`:

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

La llamada a esa función de Factory producirá elementos React con los props y los hijos que hayas proporcionado:

<Sandpack>

```js App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

Así es como `createFactory` se utilizaba como alternativa a JSX. Sin embargo, `createFactory` está obsoleto, y no deberías llamar a `createFactory` en ningún código nuevo. Vea cómo migrar desde `createFactory` a continuación.

---

## Alternativas {/*alternatives*/}

### Copiando `createFactory` en tu proyecto {/*copying-createfactory-into-your-project*/}

Si tu proyecto tiene muchas llamadas a `createFactory`, copia esta implementación de `createFactory.js` en tu proyecto:

<Sandpack>

```js App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

```js createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

Esto le permite mantener todo su código sin cambios, excepto las importaciones.

---

### Sustitución de `createFactory` por `createElement`. {/*replacing-createfactory-with-createelement*/}

Si tienes unas cuantas llamadas a `createFactory` que no te interesa importa manualmente, y no quieres usar JSX, puedes reemplazar cada llamada a una función Factory con un [`createElement`](/api/react/createElement) llamada. Por ejemplo, puede sustituir este código:

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

con éste código:


```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

Aquí tienes un ejemplo completo de uso de React sin JSX:

<Sandpack>

```js App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

---

### Sustitución de `createFactory` por JSX {/*replacing-createfactory-with-jsx*/}

Por último, puedes utilizar JSX en lugar de `createFactory`. Esta es la forma más común de utilizar React:

<Sandpack>

```js App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Clicked!');
    }}>
      Click me
    </button>
  );
};
```

</Sandpack>

<Pitfall>

A veces, el código existente puede pasar alguna variable como `type` en lugar de una constante como `'button'':

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

Para hacer lo mismo en JSX, tienes que cambiar el nombre de tu variable para que empiece con una letra mayúscula como `Type`:

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

De lo contrario, React interpretará `<type>` como una etiqueta HTML incorporada porque está en minúsculas.

</Pitfall>

---

## Referencia {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

<Deprecated>

Esta API será eliminada en una versión mayor de React en un futuro. [Ver las alternativas.](#alternatives)

</Deprecated>

Llama a `createFactory(type)` para crear una función de fábrica que produzca elementos React de un `type` dado.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Entonces puedes usarlo para crear elementos React sin JSX:

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

#### Parámetros {/*parameters*/}

* `type`: El argumento `type` debe ser un tipo de componente React válido. Por ejemplo, puede ser una cadena de nombre de etiqueta (como `'div'` o `'span'`), o un componente React (una función, una clase o un componente especial como [`Fragment`](/apis/react/Fragment)).

#### Returns {/*returns*/}

Devuelve una función Factory. Esa función recibe un objeto `props` como primer argumento, seguido de una lista de argumentos `...children`, y devuelve un elemento React con el `type`, `props` y `children` dados.
