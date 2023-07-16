---
title: "Las API heredadas de React"
---

<Intro>

Estas API se exportan desde el paquete `react`, pero no se recomiendan para ser usadas en código nuevo. Consulta las páginas de API individuales vinculadas para conocer las alternativas sugeridas.

</Intro>

---

## Las API heredadas {/*legacy-apis*/}

* [`Children`](/reference/react/Children) te permite manipular y transformar el JSX recibido como la propiedad `children`. [Ver alternativas.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) te permite crear un elemento React usando otro elemento como punto de partida. [Ver alternativas.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) te permite definir un componente React como una clase JavaScript. [Ver alternativas.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) te permite crear un elemento React. Por lo general, en su lugar, se utiliza JSX.
* [`createRef`](/reference/react/createRef) crea un objeto ref que puede contener un valor arbitrario. [Ver alternativas.](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) verifica si un valor es un elemento React. Por lo general, se utiliza con [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) es similar a [`Component`,](/reference/react/Component) pero omite el renderizado con las mismas props. [Ver alternativas.](/reference/react/PureComponent#alternatives)


---

## Las API obsoletas {/*deprecated-apis*/}

<Deprecated>

Estas API se eliminarán en una futura versión mayor de React.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) te permite crear una función que produce elementos React de un cierto tipo.
