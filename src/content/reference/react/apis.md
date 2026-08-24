---
title: "APIs integradas de React"
---

<Intro>

<<<<<<< HEAD
Además de [Hooks](/reference/react) y [Componentes](/reference/react/components), el paquete `react` exporta algunas otras APIs que son útiles para definir componentes. Esta página lista todas las demás APIs modernas de React.
=======
In addition to [Hooks](/reference/react/hooks) and [Components](/reference/react/components), the `react` package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

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
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
* [`cache`](/reference/react/cache) lets you cache the result of a data fetch or computation.
* [`cacheSignal`](/reference/react/cacheSignal) lets you know when the `cache()` lifetime is over.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) reads the current Owner Stack in development and returns it as a string if available.

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

You can pass these types of resources to [`use`](/reference/react/use):

* A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to read its resolved value.
* A [context](/learn/passing-data-deeply-with-context) to read its value.
* <CanaryBadge /> The value returned by [`browser`](/reference/react-dom/browser) to mark a component as browser-only during server rendering.

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```
