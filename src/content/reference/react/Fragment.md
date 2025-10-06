---
title: <Fragment> (<>...</>)
---

<Intro>

<<<<<<< HEAD
`<Fragment>`, a menudo utilizado a través de la sintaxis `<>...</>`, te permite agrupar elementos sin hacer uso de un nodo que los envuelva.
=======
`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node. 

<Experimental> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Experimental>
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `<Fragment>` {/*fragment*/}

Envuelve elementos en un `<Fragment>` para agruparlos en situaciones donde necesites un solo elemento. Agrupar elementos en `Fragment` no tiene efecto en el DOM resultante; ya que quedará igual que si los elementos no estuvieran agrupados. La etiqueta JSX vacía `<></>` es la abreviatura de `<Fragment></Fragment>` en la mayoría de los casos.

#### Props {/*props*/}

<<<<<<< HEAD
- **Opcional** `key`: Los Fragmentos declarados con la sintaxis explícita `<Fragment>` pueden tener [*keys*.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <ExperimentalBadge />  **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.

### <ExperimentalBadge /> FragmentInstance {/*fragmentinstance*/}

When you pass a ref to a fragment, React provides a `FragmentInstance` object with methods for interacting with the DOM nodes wrapped by the fragment:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Adds an event listener to all first-level DOM children of the Fragment.
- `removeEventListener(type, listener, options?)`: Removes an event listener from all first-level DOM children of the Fragment.
- `dispatchEvent(event)`: Dispatches an event to a virtual child of the Fragment to call any added listeners and can bubble to the DOM parent.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Compares the document position of the Fragment with another node.
  - If the Fragment has children, the native `compareDocumentPosition` value is returned. 
  - Empty Fragments will attempt to compare positioning within the React tree and include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elements that have a different relationship in the React tree and DOM tree due to portaling or other insertions are `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Returns a flat array of `DOMRect` objects representing the bounding rectangles of all children.
- `getRootNode()`: Returns the root node containing the Fragment's parent DOM node.

**Focus management methods:**
- `focus(options?)`: Focuses the first focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `focusLast(options?)`: Focuses the last focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `blur()`: Removes focus if `document.activeElement` is within the Fragment.

**Observer methods:**
- `observeUsing(observer)`: Starts observing the Fragment's DOM children with an IntersectionObserver or ResizeObserver.
- `unobserveUsing(observer)`: Stops observing the Fragment's DOM children with the specified observer.
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

#### Advertencias {/*caveats*/}

- Si quisieras pasarle una `key` a un Fragmento, no podrias usar la sintaxis `<>...</>`. Tendrias que importar explícitamente `Fragment` desde `'react'` y renderizar `<Fragment key={yourKey}>...</Fragment>`.

- React no [reinicia el estado](/learn/preserving-and-resetting-state) cuando renderizas desde un `<><Child /></>` a un `[<Child />]` y viceversa, o cuando renderizas desde un `<><Child /></>` a un `<Child />` y viceversa. Ten en cuenta de que esto sólo funciona a un nivel de profundidad: por ejemplo, ir desde un `<><><Child /></></>` a un `<Child />` reinicia el estado. Échale un ojo a la sintaxis en detalle [aquí.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

- <ExperimentalBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

---

## Uso {/*usage*/}

### Devolver múltiples elementos {/*returning-multiple-elements*/}

Usa `Fragment`, o la sintaxis equivalente `<>...</>`, para agrupar múltiples elementos. Puedes usarlo para poner múltiples elementos en cualquier lugar donde un solo elemento puede ir. Por ejemplo, un componente solo puede devolver un elemento, pero usando un Fragmento puedes agrupar múltiples elementos y devolverlos como un grupo:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Los Fragmentos son útiles porque la agrupación de elementos con un Fragmento no tiene efecto en el diseño o los estilos, al contrario de cómo sería si envolvieras los elementos dentro de cualquier otro contenedor tal como un elemento del DOM. Si inspeccionas este ejemplo con las herramientas del navegador, verás que todos los nodos del DOM `<h1>` y `<article>` aparecen como hermanos sin envoltorios alrededor de ellos:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### ¿Como escribir un fragmento sin la sintaxis especial? {/*how-to-write-a-fragment-without-the-special-syntax*/}

El ejemplo anterior es equivalente a importar `Fragment` de React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Usualmente no necesitarás esto a menos que necesites [pasar una `key` a tu `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Asignar múltiples elementos a una variable {/*assigning-multiple-elements-to-a-variable*/}

Como cualquier otro elemento, puedes asignar Fragmentos a variables, pasarlos como props, y así sucesivamente:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### Agrupar elementos con texto {/*grouping-elements-with-text*/}

Puedes usar `Fragment` para agrupar texto con componentes:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Renderizar una lista de fragmentos {/*rendering-a-list-of-fragments*/}

Esta es una situación donde necesitas escribir `Fragment` explicitamente en lugar de usar la sintaxis `<></>`. Cuando [renderizas múltiples elementos dentro de un bucle](/learn/rendering-lists), necesitas asignar una `key` a cada elemento. Si los elementos dentro del bucle son Fragmentos, necesitar usar la sintaxis habitual de un elemento JSX con el fin de proveer el atributo `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Puedes inspeccionar el DOM para verificar que no hay ningun envoltorio alrededor del Fragmento hijo:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### <ExperimentalBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <ExperimentalBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <ExperimentalBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  const fragmentRef = useRef(null);

  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
