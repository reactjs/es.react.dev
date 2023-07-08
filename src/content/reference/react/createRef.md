---
title: createRef
---

<Pitfall>

`createRef` se usa principalmente para [componentes de clase.](/reference/react/Component) Los componentes de función generalmente usan [`useRef`](/reference/react/useRef) en su lugar.

</Pitfall>

<Intro>

`createRef` crea un objeto [ref](/learn/referencing-values-with-refs) que puede contener un valor arbitrario.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `createRef()` {/*createref*/}

Invoca a `createRef` para declarar una [ref](/learn/referencing-values-with-refs) dentro de un [componente de clase.](/reference/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

`createRef` no recibe parámetros.

#### Retorna {/*returns*/}

`createRef` retorna un objeto con una única propiedad:

* `current`: Inicialmente, se inicializa en `null`. Posteriormente, se puede asignar a cualquier otra cosa. Si pasas el objeto ref a React como un atributo `ref` de un nodo JSX, React asignará su propiedad `current`.

#### Advertencias {/*caveats*/}

* `createRef` siempre devuelve un objeto *diferente*. Es equivalente a escribir `{ current: null }` manualmente.
* En un componente de función, probablemente querrás usar [`useRef`](/reference/react/useRef) en su lugar, que siempre devuelve el mismo objeto.
* `const ref = useRef()` es equivalente a `const [ref, _] = useState(() => createRef(null))`.

---

## Uso {/*usage*/}

### Declarar una referencia en un componente de clase {/*declaring-a-ref-in-a-class-component*/}

Para declarar una referencia ref dentro de un [componente de clase](/reference/react/Component), invoca a `createRef` y asigna el resultado a un campo de clase:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Si ahora pasas `ref={this.inputRef}` a un `<input>` en tu JSX, React llenará `this.inputRef.current` con el nodo del DOM del input. Por ejemplo, así es como puedes crear un botón que enfoca el input:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Enfoca el input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` se usa principalmente para [componentes de clase](/reference/react/Component). Los componentes de función generalmente dependen de [`useRef`](/reference/react/useRef) en su lugar.

</Pitfall>

---

## Alternativas {/*alternatives*/}

### Migrando de una clase con `createRef` a una función con `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Recomendamos utilizar componentes de función en lugar de [componentes de clase](/reference/react/Component) en código nuevo. Si tienes componentes de clase existentes que utilizan `createRef`, así es cómo puedes convertirlos. Este es el código original:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Enfoca el input
        </button>
      </>
    );
  }
}
```

</Sandpack>

Cuando [convierta este componente de clase a función,](/reference/react/Component#alternatives) reemplace las invocaciones de `createRef` con [`useRef`:](/reference/react/useRef)

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Enfoca el input
      </button>
    </>
  );
}
```

</Sandpack>
