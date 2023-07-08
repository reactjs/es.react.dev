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

## Referencia {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Llama a `isValidElement(value)` para comprobar si `value` es un elemento de React.

```js
import { isValidElement, createElement } from 'react';

// ✅ Elementos de React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ No son elementos de React
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `value`: El `valor` que deseas comprobar. Puede ser cualquier valor de cualquier tipo.

#### Devuelve {/*returns*/}

`isValidElement` devuelve `true` si `value` es un elemento de React. En caso contrario, devuelve `false`.

#### Advertencias {/*caveats*/}

* **Sólo las [etiquetas JSX](/learn/writing-markup-with-jsx) y los objetos devueltos por [`createElement`](/reference/react/createElement) se consideran elementos de React.**  Por ejemplo, aunque un número como `42` es un *nodo* de React válido (y puede ser devuelto desde un componente), no es un elemento de React válido. Los arrays y portales creados con [`createPortal`](/reference/react-dom/createPortal) tampoco se consideran elementos de React.

---

## Uso {/*usage*/}

### Comprobar si algo es un elemento de React {/*checking-if-something-is-a-react-element*/}

Llama `isValidElement` para comprobar si algún valor es un *elemento de React.*

Los elementos de React son:

- Los valores producidos al escribir una [etiqueta JSX](/learn/writing-markup-with-jsx)
- Los valores producidos por llamar [`createElement`](/reference/react/createElement)

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

Es muy poco común necesitar `isValidElement`. Es más útil si estás llamando a otra API que *sólo* acepta elementos (como hace [`cloneElement`](/reference/react/cloneElement) y quieres evitar un error cuando tu argumento no es un elemento de React.

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

- Un elemento de React creado como `<div />` o `createElement('div')`
- Un portal creado con [`createPortal`](/reference/react-dom/createPortal)
- Un _string_
- Un número
- `true`, `false`, `null`, o `undefined` (que no se visualizan)
- Un _array_ de otros nodos de React

**Nota que `isValidElement` comprueba si el argumento es un *elemento de React,* no si es un nodo de React.** Por ejemplo, `42` no es un elemento de React válido. Sin embargo, es un nodo de React perfectamente válido:

```js
function MyComponent() {
  return 42; // Está bien devolver un número del componente
}
```

Por eso no deberías usar `isValidElement` como forma de comprobar si algo puede ser renderizado.

</DeepDive>
