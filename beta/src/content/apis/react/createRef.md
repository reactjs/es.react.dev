---
title: createRef
---

<Pitfall>

`createRef` se utiliza principalmente para [componentes de clase.](/apis/react/Component) Los componentes de función generalmente se basan en [`useRef`](/apis/react/useRef) su lugar.

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

## Uso {/*usage*/}

### Declarar una referencia en un componente de clase {/*declaring-a-ref-in-a-class-component*/}

Para declarar una referencia dentro de un [class component,](/apis/react/Component) llame `createRef` y asigne su resultado a un campo de clase:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Si ahora pasa `ref={this.inputRef}` a an `<input>` en su JSX, React se completará `this.inputRef.current` con el nodo DOM de entrada. Por ejemplo, así es como crea un botón que enfoca la entrada:

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
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` se utiliza principalmente para [componentes de clase.](/apis/react/Component) Los componentes de función generalmente se basan en [`useRef`](/apis/react/useRef) su lugar.

</Pitfall>

---

## Alternativas {/*alternatives*/}

### Migrar de una clase con `createRef` a una función con `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Recomendamos usar componentes de función en lugar de [componentes de clase ](/apis/react/Component) en el nuevo código. Si tiene algunos componentes de clase existentes que usan `createRef`, así es como puede convertirlos. Este es el código original:

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
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

Cuando [convierta este componente de una clase a una función,](/apis/react/Component#alternatives) reemplace las llamadas a `createRef` con llamadas a [`useRef`:](/apis/react/useRef)

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

---

## Referencia {/*reference*/}

### `createRef()` {/*createref*/}

Llame `createRef` para declarar una [ref](/learn/referencing-values-with-refs) dentro de un [componente de clase.](/apis/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

<Pitfall>

`createRef` se utiliza principalmente para [componentes de clase.](/apis/react/Component) Los componentes de función generalmente se basan en [`useRef`](/apis/react/useRef) su lugar.

</Pitfall>

#### Parámetros {/*parameters*/}

`createRef` no toma parámetros.

#### Devoluciones {/*returns*/}

`createRef` devuelve un objeto con una sola propiedad:

* `current`: Inicialmente, está configurado en `null`. Más tarde puede configurarlo en otra cosa. Si pasa el objeto ref a React como un `ref` atributo a un nodo JSX, React establecerá su `current` propiedad.

#### Advertencias {/*caveats*/}

* `createRef` siempre devuelve un objeto *diferente*. Es equivalente a escribirte a `{ current: null }` ti mismo.
* En un componente de función, probablemente desee [`useRef`](/apis/react/useRef) que siempre devuelva el mismo objeto.
* `const ref = useRef()` es equivalente a `const [ref, _] = useState(() => createRef(null))`.


