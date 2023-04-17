---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` es un Hook de React que te permite personalizar el identificador expuesto como una [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Llama a `useImperativeHandle` en el nivel superior de tu componente para personalizar el identificador ref que se expone:

```js
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... tus métodos ...
    };
  }, []);
  // ...
```

[Mira más ejemplos debajo.](#usage)

#### Parámetros {/*parameters*/}

* `ref`: La `ref` que recibes como segundo argumento de la [función render `forwardRef`](/reference/react/forwardRef#render-function)

<<<<<<< HEAD:beta/src/content/reference/react/useImperativeHandle.md
* `createHandle`: Una función que no toma argumentos y devuelve el identificador ref que quieres exponer. El identificador ref que devuelve puede tener cualquier tipo. Por lo general, devolverá un objeto con lo métodos que quieres exponer.

* **opcional** `dependencies`: La lista de todos los valores reactivos a los que se hace referencia dentro del código de `createHandle`. Los valores reactivos incluye props, estados, y todas las variables y funciones declaradas directamente dentro del cuerpo de tu componente.  Si tu linter es [configurado por React](/learn/editor-setup#linting), va a verificar que cada valor reactivo esté correctamente especificado como una dependencia. La lista de dependencias deben tener un número constante de elementos y ser escritos en una sola linea como `[dep1, dep2, dep3]`. React comparará cada dependencia con su valor anterior usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Si un nuevo renderizado resultara en un cambio a una dependencia, o si no especificaste las dependencias completamente, tu función `createHandle` se volverá a ejecutar, y el nuevo identificador recién creado será asignado a ref. 
=======
* `createHandle`: A function that takes no arguments and returns the ref handle you want to expose. That ref handle can have any type. Usually, you will return an object with the methods you want to expose.

* **optional** `dependencies`: The list of all reactive values referenced inside of the `createHandle` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If a re-render resulted in a change to some dependency, or if you omitted this argument, your `createHandle` function will re-execute, and the newly created handle will be assigned to the ref.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/reference/react/useImperativeHandle.md

#### Devuelve {/*returns*/}

`useImperativeHandle` devuelve `undefined`.

---

## Uso {/*usage*/}

### Exponer un identificador ref personalizado al componente padre {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Los componentes por defecto no exponen sus nodos DOM a los componentes padre. Por ejemplo, si quieres el componente padre de `MyInput` para [tener acceso](/learn/manipulating-the-dom-with-refs) al nodo DOM de  `<input>`, tienes que optar por [`forwardRef`:](/reference/react/forwardRef)

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

Con el código de arriba, [una ref a `MyInput` va a recibir el nodo DOM de `<input>`.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) Aun así, puedes exponer un valor personalizado en su lugar. Para personalizar el identificador expuesto, llama a `useImperativeHandle` en el nivel superior  de tu componente:

```js {4-8}
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... tus métodos ...
    };
  }, []);

  return <input {...props} />;
});
```

Ten en cuenta que en el código de arriba, la `ref` ya no se reenvía a `<input>`.

Por ejemplo, supongamos que no quieres exponer el nodo DOM entero de `<input>`, pero quieres exponer dos de sus métodos: `focus` y `scrollIntoView`. Para hacer esto, mantén el DOM real del navegador en una ref separada. Entonces usa `useImperativeHandle` para exponer un identificador solamente con los métodos que quieres que el componente padre llame:

```js {7-14}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Ahora, si el componente padre obtiene una ref a `MyInput`, podrá llamar a los métodos `focus` y `scrollIntoView` en él. Sin embargo, no va a tener acceso completo al nodo DOM de `<input>` de manera más profunda.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    //Esto no funcionará porque el nodo DOM no está expuesto
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Editar
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Exponer tus propios métodos imperativos {/*exposing-your-own-imperative-methods*/}

<<<<<<< HEAD:beta/src/content/reference/react/useImperativeHandle.md
Los métodos que expones a través de un identificador imperativo no tienen que coincidir exactamente a los métodos del DOM. Por ejemplo, el componente `Post` en el ejemplo de abajo expone a `scrollAndFocusAddComment` por medio de un identificador imperativo. Esto le permite a la `Página` padre desplazar la lista de comentarios *y* enfocar el campo de entrada cuando haces click al botón.
=======
The methods you expose via an imperative handle don't have to match the DOM methods exactly. For example, this `Post` component exposes a `scrollAndFocusAddComment` method via an imperative handle. This lets the parent `Page` scroll the list of comments *and* focus the input field when you click the button:
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/reference/react/useImperativeHandle.md

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Escribe un comentario
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js Post.js
import { forwardRef, useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

const Post = forwardRef((props, ref) => {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Bienvenidos a mi blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});

export default Post;
```


```js CommentList.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CommentList = forwardRef(function CommentList(props, ref) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comentario #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});

export default CommentList;
```

```js AddComment.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Añadir comentario..." ref={ref} />;
});

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**No sobreutilizar las refs.** Solo debes usar las refs para comportamientos *imperativos* que no puedes expresar como props: por ejemplo desplazarse a un nodo, enfocar un nodo, activar una animación, seleccionar texto, etc.

**Si puedes expresar algo como una prop, no deberias usar una ref.** Por ejemplo, en vez de exponer un identificador imperativo como `{ open, close }` del componente `Modal`, es mejor tomar `isOpen` como una prop, algo como `<Modal isOpen={isOpen} />`. [Efectos](/learn/synchronizing-with-effects) puede ayudarte a exponer comportamientos imperativos via props.

</Pitfall>
