---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` es un Hook de React que te permite personalizar el manejador expuesto como una [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Llama a `useImperativeHandle` en el nivel superior de tu componente para personalizar el manejador de ref que se expone:

```js
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... Tus métodos ...
    };
  }, []);
  // ...
```

[Mira mas ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `ref`: La `ref` que recibes como segundo argumento de la [función render `forwardRef`](/reference/react/forwardRef#render-function)

* `createHandle`: Una función que no toma argumentos y devuelve el manejador de ref que quieres exponer. El manejador de ref que devuelve puede tener cualquier tipo. Por lo general, devolverá un objeto con lo métodos que quieres exponer.

* `dependencies` **opcional**: La lista de todos los valores reactivos a los que se hace referencia dentro del código de `createHandle`. Los valores reactivos incluye props, estados, y todas las variables y funciones declaradas directamente dentro del cuerpo de tu componente.  Si tu linter es [configurado por React](/learn/editor-setup#linting), va a verificar que cada valor reactivo esté correctamente especificado como una dependencia. La lista de dependencias deben tener un número constante de elementos y ser escritos en una sola linea como `[dep1, dep2, dep3]`. React comparará cada dependencia con su valor anterior usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Si un nuevo renderizado resultara en un cambio a una dependencia, o si no especificaste las dependencias completamente, tu función `createHandle` se volverá a ejecutar, y el nuevo manejador recien creado será asignado a ref. 

#### Devuelve {/*returns*/}

`useImperativeHandle` devuelve `undefined`.

---

## Uso {/*usage*/}

### Exponiendo un manejador de ref personalizado al componente padre {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Por defecto, los componentes no exponen sus nodos del DOM a los componentes padre. Por ejemplo, si quieres el componente padre de `MyInput` para [tener acceso](/learn/manipulating-the-dom-with-refs) al nodo DOM de  `<input>`, tienes que optar por [`forwardRef`:](/reference/react/forwardRef)

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

Con el código de arriba, [una ref a `MyInput` va a recibir el nodo DOM de `<input>`.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) Aun así, puedes exponer un valor personalizado en su lugar. Para personalizar el manejador expuesto, llama a `useImperativeHandle` en el nivel superior de tu componente:

```js {4-8}
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... Tus métodos ...
    };
  }, []);

  return <input {...props} />;
});
```

Ten en cuenta que en el código de arriba, La `ref` ya no se reenvía a `<input>`.

Por ejemplo, supongamos que no quieres exponer el nodo DOM entero de `<input>`, pero quieres exponer dos de sus métodos: `focus` y `scrollIntoView`. para hacer esto, manten el DOM real del buscador en un ref separado. Entonces usa `useImperativeHandle` para exponer un handle solamente con los métodos que quieres que el componente padre llame:

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

Ahora, si el componente padre obtiene una ref a `MyInput`, podrá llamar a los métodos `focus` y `scrollIntoView` en él. Sin embargo, no va a tener acceso completo al nodo DOM de `<input>` subyacente.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
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

### Exposing your own imperative methods {/*exposing-your-own-imperative-methods*/}

The methods you expose via an imperative handle don't have to match the DOM methods exactly. For example, the `Post` component in the example below exposes a `scrollAndFocusAddComment` method via an imperative handle. This lets the parent `Page` scroll the list of comments *and* focus the input field when you click the button:

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
        Write a comment
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
        <p>Welcome to my blog!</p>
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
    comments.push(<p key={i}>Comment #{i}</p>);
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
  return <input placeholder="Add comment..." ref={ref} />;
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

**Do not overuse refs.** You should only use refs for *imperative* behaviors that you can't express as props: for example, scrolling to a node, focusing a node, triggering an animation, selecting text, and so on.

**If you can express something as a prop, you should not use a ref.** For example, instead of exposing an imperative handle like `{ open, close }` from a `Modal` component, it is better to take `isOpen` as a prop like `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) can help you expose imperative behaviors via props.

</Pitfall>
