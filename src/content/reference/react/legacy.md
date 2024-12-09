---
title: "APIs heredadas de React"
---

<Intro>

Estas APIs se exportan desde el paquete `react`, pero no se recomiendan para ser usadas en código nuevo. Consulta las páginas de API individuales vinculadas para conocer las alternativas sugeridas.

</Intro>

---

## APIs heredadas {/*legacy-apis*/}

<<<<<<< HEAD
* [`Children`](/reference/react/Children) te permite manipular y transformar el JSX recibido como la propiedad `children`. [Ver alternativas.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) te permite crear un elemento React usando otro elemento como punto de partida. [Ver alternativas.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) te permite definir un componente React como una clase JavaScript. [Ver alternativas.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) te permite crear un elemento React. Por lo general, en su lugar, se utiliza JSX.
* [`createRef`](/reference/react/createRef) crea un objeto ref que puede contener un valor arbitrario. [Ver alternativas.](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) verifica si un valor es un elemento React. Por lo general, se utiliza con [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) es similar a [`Component`,](/reference/react/Component) pero omite el renderizado con las mismas props. [Ver alternativas.](/reference/react/PureComponent#alternatives)
=======
* [`Children`](/reference/react/Children) lets you manipulate and transform the JSX received as the `children` prop. [See alternatives.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) lets you create a React element using another element as a starting point. [See alternatives.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) lets you define a React component as a JavaScript class. [See alternatives.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) lets you create a React element. Typically, you'll use JSX instead.
* [`createRef`](/reference/react/createRef) creates a ref object which can contain arbitrary value. [See alternatives.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node to parent component with a [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) checks whether a value is a React element. Typically used with [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) is similar to [`Component`,](/reference/react/Component) but it skip re-renders with same props. [See alternatives.](/reference/react/PureComponent#alternatives)
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

---

<<<<<<< HEAD
## APIs obsoletas {/*deprecated-apis*/}
=======
## Removed APIs {/*removed-apis*/}
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

These APIs were removed in React 19:

<<<<<<< HEAD
Estas APIs se eliminarán en una futura versión mayor de React.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) te permite crear una función que produce elementos React de un cierto tipo.
=======
* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context.Provider`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
