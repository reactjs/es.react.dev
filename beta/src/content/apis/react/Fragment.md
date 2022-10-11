---
title: Fragmento (<>...</>)
---

<Intro>

El componente `Fragment`, que es usualmente usado atraves de la sintaxis `<>...</>`, te permite renderizar múltiples elementos en lugar de uno, sin tener que envolverlos dentro de otro elemento contenedor.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Retornando múltiples elementos {/*returning-multiple-elements*/}

Usa `Fragment`, o la sintaxis equivalente `<>...</>`, para agrupar múltiples elementos. Puedes usarlo para poner múltiples elementos en cualquier lugar donde un solo elemento puede ir. Por ejemplo, un componente solo puede retornar un elemento, pero usando un Fragmento puedes agrupar múltiples elementos y retornarlos como un grupo:

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

Los Fragmentos son útiles por que al agrupar varios elementos con un Fragmento no tiene efecto en el diseño o los estilos, a diferencia de si tu envolviste los elementos dentro de cualquier otro contenedor tal como un elemento del DOM. Si tu inspeccionas este ejemplo con las herramientas del navegador, verás que todos los nodos del DOM `<h1>` y `<p>` aparecen como hermanos sin envoltorios alrededor de ellos:

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

<DeepDive title="¿Como escribir un fragmento sin la sintaxis especial?">

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

### Asignando múltiples elementos a una variable {/*assigning-multiple-elements-to-a-variable*/}

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

### Agrupando elementos con texto {/*grouping-elements-with-text*/}

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

### Renderizando una lista de fragmentos {/*rendering-a-list-of-fragments*/}

Esta es una situación donde necesitas escribir `Fragment` explicitamente en lugar de usar la sintaxis `<></>`. Cuando [renderizas múltiples elementos dentro de un bucle](/learn/rendering-lists), necesitas asignar una `key` a cada elemento. Si los elementos dentro del bucle son Fragmentos, necesitar usar la sintaxis normal de un elemnto JSX con el fin de proveer el atributo `key`:

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

## Referencia {/*reference*/}

### `Fragment` {/*fragment*/}

Envolver elementos en un `<Fragment>` para agruparlos en situaciones donde necesitar un solo elemento. Agrupando elementos en `Fragment` no tiene efecto en el resultante del DOM; es lo mismo como si los elementos no estaban agrupados. La etiqueta JSX vacia `<></>` es la abreviatura de `<Fragment></Fragment>` en la mayoría de los casos.

#### Props {/*fragment-props*/}

- **Opcional** `key`: Fragmentos declarados con la sintaxis explicita `<Fragment>` pueden tener [llaves.](https://beta.reactjs.org/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Advertencias {/*caveats*/}

- Si quieres pasarle una `key` a un Fragmento, No puedes usar esta sintaxis `<>...</>`. Tienes que importar explicitamente `Fragment` desde `'react'` y renderizar `<Fragment key={yourKey}>...</Fragment>`.

- React no [restablece el estado](/learn/preserving-and-resetting-state) cuando vas desde renderizar `<><Child /></>` a `[<Child />]` o atrás, o cuando vas desde renderizar `<><Child /></>` a`<Child />` y atrás. Esto solo funciona a un nivel de profundidad: por ejemplo, yendo desde `<><><Child /></></>` a `<Child />` restablece el estado. Mira la sintaxis precisa [aquí.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)


