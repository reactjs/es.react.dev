---
title: "APIs heredadas de React"
---

<Intro>

Estas APIs se exportan desde el paquete `react`, pero no se recomiendan para ser usadas en código nuevo. Consulta las páginas de API individuales vinculadas para conocer las alternativas sugeridas.

</Intro>

---

## APIs heredadas {/*legacy-apis*/}

* [`Children`](/reference/react/Children) te permite manipular y transformar el JSX recibido como la prop `children`. [Ver alternativas.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) te permite crear un elemento de React utilizando otro elemento como punto de partida. [Ver alternativas.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) te permite definir un componente de React como una clase de JavaScript. [Ver alternativas.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) te permite crear un elemento de React. Normalmente, utilizarás JSX en su lugar.
* [`createRef`](/reference/react/createRef) crea un objeto ref que puede contener un valor arbitrario. [Ver alternativas.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) permite que tu componente exponga un nodo DOM al componente padre con una [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) comprueba si un valor es un elemento de React. Normalmente se utiliza con [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) es similar a [`Component`,](/reference/react/Component) pero omite los rerenderizados con las mismas props. [Ver alternativas.](/reference/react/PureComponent#alternatives)

---

## APIs eliminadas {/*removed-apis*/}

Las siguientes API se eliminaron en React 19:

<<<<<<< HEAD
* [`createFactory`](https://18.react.dev/reference/react/createFactory): utiliza JSX en su lugar.
* Componentes de Clase: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): utiliza [`static contextType`](#static-contexttype) en su lugar.
* Componentes de Clase: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): utiliza [`static contextType`](#static-contexttype) en su lugar.
* Componentes de Clase: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): utiliza [`Context.Provider`](/reference/react/createContext#provider) en su lugar.
* Componentes de Clase: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): utiliza un sistema de tipos como [TypeScript](https://www.typescriptlang.org/) en su lugar.
* Componentes de Clase: [`this.refs`](https://18.react.dev//reference/react/Component#refs): utiliza [`createRef`](/reference/react/createRef) en su lugar.
=======
* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.
>>>>>>> 341c312916e1b657262bbe14b134a6f1779fecf1
