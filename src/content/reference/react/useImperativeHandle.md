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
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... tus métodos ...
    };
  }, []);
  // ...
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `ref`: La `ref` que recibiste como prop del componente `MyInput`.

* `createHandle`: Una función que no toma argumentos y devuelve el identificador ref que quieres exponer. El identificador ref que devuelve puede tener cualquier tipo. Por lo general, devolverá un objeto con lo métodos que quieres exponer.

* **opcional** `dependencies`: La lista de todos los valores reactivos a los que se hace referencia dentro del código de `createHandle`. Los valores reactivos incluye props, estados, y todas las variables y funciones declaradas directamente dentro del cuerpo de tu componente.  Si tu linter es [configurado por React](/learn/editor-setup#linting), va a verificar que cada valor reactivo esté correctamente especificado como una dependencia. La lista de dependencias deben tener un número constante de elementos y ser escritos en una sola linea como `[dep1, dep2, dep3]`. React comparará cada dependencia con su valor anterior usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Si un nuevo renderizado resultara en un cambio a una dependencia, o si no especificaste las dependencias completamente, tu función `createHandle` se volverá a ejecutar, y el nuevo identificador recién creado será asignado a ref. 

<Note>

<<<<<<< HEAD
A partir de React 19, [`ref` está disponible como una prop.](/blog/2024/12/05/react-19#ref-as-a-prop) En React 18 y versiones anteriores, era necesario obtener la `ref` de [`forwardRef`.](/reference/react/forwardRef)
=======
Starting with React 19, [`ref` is available as a prop.](/blog/2024/12/05/react-19#ref-as-a-prop) In React 18 and earlier, it was necessary to get the `ref` from [`forwardRef`.](/reference/react/forwardRef) 
>>>>>>> 91614a51a1be9078777bc337ba83fc62e606cc14

</Note>

#### Devuelve {/*returns*/}

`useImperativeHandle` devuelve `undefined`.

---

## Uso {/*usage*/}

### Exponer un identificador ref personalizado al componente padre {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Para exponer un nodo DOM al elemento padre, pasa la prop `ref` al nodo.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

Con el código de arriba, [una ref a `MyInput` va a recibir el nodo DOM de `<input>`.](/learn/manipulating-the-dom-with-refs) Aun así, puedes exponer un valor personalizado en su lugar. Para personalizar el identificador expuesto, llama a `useImperativeHandle` en el nivel superior  de tu componente:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... tus métodos ...
    };
  }, []);

  return <input />;
};
```

Ten en cuenta que en el código de arriba, la `ref` ya no se pasa al `<input>`.

Por ejemplo, supongamos que no quieres exponer el nodo DOM entero de `<input>`, pero quieres exponer dos de sus métodos: `focus` y `scrollIntoView`. Para hacer esto, mantén el DOM real del navegador en una ref separada. Entonces usa `useImperativeHandle` para exponer un identificador solamente con los métodos que quieres que el componente padre llame:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
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

  return <input ref={inputRef} />;
};
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
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Editar
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
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
};

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

Los métodos que expones a través de un identificador imperativo no tienen que coincidir exactamente a los métodos del DOM. Por ejemplo, el componente `Post` en el ejemplo de abajo expone a `scrollAndFocusAddComment` por medio de un identificador imperativo. Esto le permite a la `Página` padre desplazar la lista de comentarios *y* enfocar el campo de entrada cuando haces click al botón.

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

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
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
        <p>¡Bienvenidos a mi blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
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
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}

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
