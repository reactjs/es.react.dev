---
title: findDOMNode
---

<Deprecated>

Esta API se eliminará en una futura versión mayor de React. [Ver las alternativas.](#alternatives)

</Deprecated>

<Intro>

`findDOMNode` encuentra el nodo DOM del navegador para una instancia de [componente de clase](/reference/react/Component) de React.

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

Llama a `findDOMNode` para encontrar el nodo DOM del navegador para una instancia dada de un [componente de clase](/reference/react/Component) de React.

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[Consulta más ejemplos debajo.](#usage)

#### Parámetros {/*parameters*/}

* `componentInstance`: Una instancia de la subclase [`Componente`](/reference/react/Component). Por ejemplo, `this` dentro de un componente de clase.


#### Returns {/*returns*/}

`findDOMNode` devuelve el primer nodo DOM del navegador más cercano dentro del `componentInstance` dado. Cuando un componente renderiza `null` o `false`, `findDOMNode` devuelve `null`. Cuando un componente renderiza un string, `findDOMNode` devuelve un nodo DOM de texto que contiene ese valor.

#### Advertencias {/*caveats*/}

* Un componente puede devolver un array o un [Fragment](/reference/react/Fragment) con múltiples hijos. En este caso, `findDOMNode` devolverá el nodo DOM correspondiente al primer hijo no vacío.

* `findDOMNode` solo funciona en componentes montados  (es decir, componentes que se han colocado en el DOM). Si intentas llamar a esto en un componente que aún no se ha montado (como llamar a `findDOMNode()` en `render()` en un componente que aún no se ha creado), se lanzará una excepción.

* `findDOMNode` solo devuelve el resultado en el momento de tu llamada. Si un componente hijo representa un nodo diferente más tarde, no hay manera de que se te notifique de este cambio.

* `findDOMNode` acepta una instancia de componente de clase, por lo que no se puede usar con componentes de función.

---

## Uso {/*usage*/}

### Encontrar el nodo DOM raíz de un componente de clase {/*finding-the-root-dom-node-of-a-class-component*/}

Llama a `findDOMNode` con una instancia de un [componente de clase](/reference/react/Component) (por lo general, `this`) para encontrar el nodo DOM que ha renderizado.

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hola" />
  }
}
```

Aquí, la variable `input` se establecerá en el elemento DOM `<input>`. Esto te permite hacer algo con él. Por ejemplo, al hacer clic en "Mostrar ejemplo" a continuación, se monta el input, [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) selecciona todo el texto del input:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar ejemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hola" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## Alternativas {/*alternatives*/}

### Leyendo el nodo DOM propio de un componente a través de una referencia {/*reading-components-own-dom-node-from-a-ref*/}

<<<<<<< HEAD:beta/src/content/reference/react-dom/findDOMNode.md
El código que utiliza `findDOMNode` es frágil debido a que la conexión entre el nodo JSX y el código que manipula el nodo DOM correspondiente no es explícita. Por ejemplo, prueba a envolver `<input />` de este ejemplo en un `<div>`:
=======
Code using `findDOMNode` is fragile because the connection between the JSX node and the code manipulating the corresponding DOM node is not explicit. For example, try wrapping this `<input />` into a `<div>`:
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/reference/react-dom/findDOMNode.md

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar ejemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Hola" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

Esto romperá el código porque ahora, `findDOMNode(this)` encuentra el nodo DOM `<div>`, pero el código espera un nodo DOM `<input>`. Para evitar este tipo de problemas, utiliza [`createRef`](/reference/react/createRef) para gestionar un nodo DOM específico.

<<<<<<< HEAD:beta/src/content/reference/react-dom/findDOMNode.md
En este ejemplo, ya no se usa `findDOMNode`. En su lugar, se define `inputRef = createRef(null)` como un campo de instancia en la clase. Para leer el nodo DOM de él, puedes usar `this.inputRef.current`. Para adjuntarlo al JSX, renderiza `<input ref={this.inputRef} />`. Has conectado el código que usa el nodo DOM con su JSX:
=======
In this example, `findDOMNode` is no longer used. Instead, `inputRef = createRef(null)` is defined as an instance field on the class. To read the DOM node from it, you can use `this.inputRef.current`. To attach it to the JSX, you render `<input ref={this.inputRef} />`. This connects the code using the DOM node to its JSX:
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/reference/react-dom/findDOMNode.md

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar ejemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Hola" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

En React moderno sin componentes de clase, el código equivalente llamaría a [`useRef`](/reference/react/useRef) en su lugar:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar ejemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Hola" />
}
```

</Sandpack>

[Lee más sobre cómo manipular el DOM con refs.](/learn/manipulating-the-dom-with-refs)

---

### Leer el nodo DOM de un componente hijo desde una ref reenviada {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

En este ejemplo, `findDOMNode(this)` encuentra un nodo DOM que pertenece a otro componente. El `AutoselectingInput` renderiza `MyInput`, que es tu propio componente que representa una entrada del navegador `<input>`.

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar ejemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js MyInput.js
export default function MyInput() {
  return <input defaultValue="Hola" />;
}
```

</Sandpack>

<<<<<<< HEAD:beta/src/content/reference/react-dom/findDOMNode.md
Ten en cuenta que llamar a `findDOMNode(this)` dentro de `AutoselectingInput` aún te da el nodo DOM `<input>`, aunque el JSX para este `<input>` está oculto dentro del componente `MyInput`. Esto parece conveniente para el ejemplo anterior, pero conduce a un código frágil. Imagínate que deseas editar `MyInput` más tarde y agregar un elemento `<div>` envuelto alrededor de él. Esto rompería el código de `AutoselectingInput` (que espera encontrar un nodo DOM `<input>`).
=======
Notice that calling `findDOMNode(this)` inside `AutoselectingInput` still gives you the DOM `<input>`--even though the JSX for this `<input>` is hidden inside the `MyInput` component. This seems convenient for the above example, but it leads to fragile code. Imagine that you wanted to edit `MyInput` later and add a wrapper `<div>` around it. This would break the code of `AutoselectingInput` (which expects to find an `<input>`).
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/reference/react-dom/findDOMNode.md

Para reemplazar `findDOMNode` en este ejemplo, los dos componentes deben coordinarse:

<<<<<<< HEAD:beta/src/content/reference/react-dom/findDOMNode.md
1. `AutoSelectingInput` debe declarar una ref, como [en el ejemplo anterior](#reading-components-own-dom-node-from-a-ref), y pasarlo a `<MyInput>`.
2. `MyInput` debe ser declarado con [`forwardRef`](/reference/react/forwardRef) para leer la ref pasado y pasarla hacia abajo al nodo `<input>`.
=======
1. `AutoSelectingInput` should declare a ref, like [in the earlier example](#reading-components-own-dom-node-from-a-ref), and pass it to `<MyInput>`.
2. `MyInput` should be declared with [`forwardRef`](/reference/react/forwardRef) to take that ref and forward it down to the `<input>` node.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/reference/react-dom/findDOMNode.md

Esta versión hace eso, por lo que ya no necesita `findDOMNode`:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar ejemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hola" />;
});

export default MyInput;
```

</Sandpack>

Así es como se vería este código con componentes de función en lugar de clases:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar ejemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Hola" />
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hola" />;
});

export default MyInput;
```

</Sandpack>

---

### Agregar un elemento envoltorio `<div>` {/*adding-a-wrapper-div-element*/}

A veces, un componente necesita conocer la posición y el tamaño de sus hijos. Esto hace tentador encontrar a los hijos con `findDOMNode(this)`, y luego usar métodos DOM como [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) para las mediciones.

<<<<<<< HEAD:beta/src/content/reference/react-dom/findDOMNode.md
Actualmente, no hay un equivalente directo para este uso, por lo que `findDOMNode` está en desuso pero aún no se ha eliminado completamente de React. Mientras tanto, puedes intentar renderizar un nodo envoltorio `<div>` alrededor del contenido como una solución temporal y obtener una referencia a ese nodo. Sin embargo, los envoltorios adicionales a veces pueden romper el estilo.
=======
There is currently no direct equivalent for this use case, which is why `findDOMNode` is deprecated but is not yet removed completely from React. In the meantime, you can try rendering a wrapper `<div>` node around the content as a workaround, and getting a ref to that node. However, extra wrappers can break styling.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/reference/react-dom/findDOMNode.md

```js
<div ref={someRef}>
  {children}
</div>
```

Esto también se aplica al enfoque y desplazamiento a hijos arbitrarios
