---
title: "APIs integradas de React"
---

<Intro>

<<<<<<< HEAD
Además de [Hooks](/reference/react) y [Componentes](/reference/react/components), el paquete `react` exporta algunas otras APIs que son útiles para definir componentes. Esta página lista todas las demás APIs modernas de React.
=======
In addition to [Hooks](/reference/react/hooks) and [Components](/reference/react/components), the `react` package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext) te permite definir y proporcionar contexto a los componentes hijos. Se utiliza con [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) permite que tu componente exponga un nodo DOM como una referencia al padre. Se utiliza con [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) te permite retrasar la carga del código de un componente hasta que se renderice por primera vez.
* [`memo`](/reference/react/memo) permite que tu componente omita nuevas renderizaciones con las mismas props. Se utiliza con [`useMemo`](/reference/react/useMemo) y [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) te permite marcar una actualización de estado como no urgente. Similar a [`useTransition`.](/reference/react/useTransition)
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this API:

* [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
