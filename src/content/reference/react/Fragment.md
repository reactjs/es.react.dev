---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, a menudo utilizado a través de la sintaxis `<>...</>`, te permite agrupar elementos sin hacer uso de un nodo que los envuelva.

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

- **Opcional** `key`: Los Fragmentos declarados con la sintaxis explícita `<Fragment>` pueden tener [*keys*.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Advertencias {/*caveats*/}

- Si quisieras pasarle una `key` a un Fragmento, no podrias usar la sintaxis `<>...</>`. Tendrias que importar explícitamente `Fragment` desde `'react'` y renderizar `<Fragment key={yourKey}>...</Fragment>`.

- React no [restablece el estado](/learn/preserving-and-resetting-state) cuando renderizas desde un `<><Child /></>` a un `[<Child />]` y viceversa, o cuando renderizas desde un `<><Child /></>` a un `<Child />` y viceversa. Ten en cuenta de que esto sólo funciona a un nivel de profundidad: por ejemplo, ir desde un `<><><Child /></></>` a un `<Child />` restablece el estado. Échale un ojo a la sintaxis en detalle [aquí.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

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
