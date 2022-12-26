---
title: isValidElement
---

<Intro>

`isValidElement` comprueba si un valor es un elemento de React.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

<<<<<<< HEAD:beta/src/content/apis/react/isValidElement.md
## Uso {/*usage*/}
=======
## Reference {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Call `isValidElement(value)` to check whether `value` is a React element.

```js
import { isValidElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Not React elements
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `value`: The `value` you want to check. It can be any a value of any type.

#### Returns {/*returns*/}

`isValidElement` returns `true` if the `value` is a React element. Otherwise, it returns `false`.

#### Caveats {/*caveats*/}

* **Only [JSX tags](/learn/writing-markup-with-jsx) and objects returned by [`createElement`](/reference/react/createElement) are considered to be React elements.** For example, even though a number like `42` is a valid React *node* (and can be returned from a component), it is not a valid React element. Arrays and portals created with [`createPortal`](/reference/react-dom/createPortal) are also *not* considered to be React elements.

---

## Usage {/*usage*/}
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a:beta/src/content/reference/react/isValidElement.md

### Comprobar si algo es un elemento de React {/*checking-if-something-is-a-react-element*/}

Llama `isValidElement` para comprobar si algún valor es un *elemento de React.*

Los elementos de React son:

<<<<<<< HEAD:beta/src/content/apis/react/isValidElement.md
- Los valores producidos al escribir una [etiqueta JSX](/learn/writing-markup-with-jsx)
- Los valores producidos por llamar [`createElement`](/apis/react/createElement)
=======
- Values produced by writing a [JSX tag](/learn/writing-markup-with-jsx)
- Values produced by calling [`createElement`](/reference/react/createElement)
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a:beta/src/content/reference/react/isValidElement.md

Para los elementos de React, `isValidElement` devuelve `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ Las etiquetas JSX son elementos de React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Los valores devueltos por createElement son elementos de React
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Cualquier otro valor, como _strings_, números u objetos arbitrarios y _arrays_, no son elementos de React.

Para ellos, `isValidElement` devuelve `false`:

```js
// ❌ Estos *no* son elementos de React
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

<<<<<<< HEAD:beta/src/content/apis/react/isValidElement.md
Es muy poco común necesitar `isValidElement`. Es más útil si estás llamando a otra API que *sólo* acepta elementos (como hace [`cloneElement`](/apis/react/cloneElement) y quieres evitar un error cuando tu argumento no es un elemento de React.
=======
It is very uncommon to need `isValidElement`. It's mostly useful if you're calling another API that *only* accepts elements (like [`cloneElement`](/reference/react/cloneElement) does) and you want to avoid an error when your argument is not a React element.
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a:beta/src/content/reference/react/isValidElement.md

A menos que tengas alguna razón muy específica para añadir una comprobación con `isValidElement`, probablemente no la necesites.

<DeepDive>

#### Elementos de React vs nodos de React {/*react-elements-vs-react-nodes*/}

Cuando escribas un componente, puedes devolver cualquier tipo de *nodo de React* de él:

```js
function MyComponent() {
  // ... puedes devolver cualquier nodo de React ...
}
```

Un nodo de React puede ser:

<<<<<<< HEAD:beta/src/content/apis/react/isValidElement.md
- Un elemento de React creado como `<div />` o `createElement('div')`
- Un portal creado con [`createPortal`](/apis/react-dom/createPortal)
- Un _string_
- Un número
- `true`, `false`, `null`, o `undefined` (que no se visualizan)
- Un _array_ de otros nodos de React
=======
- A React element created like `<div />` or `createElement('div')`
- A portal created with [`createPortal`](/reference/react-dom/createPortal)
- A string
- A number
- `true`, `false`, `null`, or `undefined` (which are not displayed)
- An array of other React nodes
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a:beta/src/content/reference/react/isValidElement.md

**Nota que `isValidElement` comprueba si el argumento es un *elemento de React,* no si es un nodo de React.** Por ejemplo, `42` no es un elemento de React válido. Sin embargo, es un nodo de React perfectamente válido:

```js
function MyComponent() {
  return 42; // Está bien devolver un número del componente
}
```

Por eso no deberías usar `isValidElement` como forma de comprobar si algo puede ser renderizado.

</DeepDive>
<<<<<<< HEAD:beta/src/content/apis/react/isValidElement.md

---

## Referencia {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Llama a `isValidElement(value)` para comprobar si `value` es un elemento de React.

```js
import { isValidElement } from 'react';

// ✅ Elementos de React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ No son elementos de React
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Ver más ejemplos arriba.](#usage)

#### Parámetros {/*parameters*/}

* `value`: El `valor` que deseas comprobar. Puede ser cualquier valor de cualquier tipo.

#### Devuelve {/*returns*/}

`isValidElement` devuelve `true` si `value` es un elemento de React. En caso contrario, devuelve `false`.

#### Advertencias {/*caveats*/}

* **Sólo las [etiquetas JSX](/learn/writing-markup-with-jsx) y los objetos devueltos por [`createElement`](/apis/react/createElement) se consideran elementos de React.**  Por ejemplo, aunque un número como `42` es un *nodo* de React válido (y puede ser devuelto desde un componente), no es un elemento de React válido. Los arrays y portales creados con [`createPortal`](/apis/react-dom/createPortal) tampoco se consideran elementos de React.
=======
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a:beta/src/content/reference/react/isValidElement.md
