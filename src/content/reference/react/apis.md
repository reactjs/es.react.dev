---
title: "APIs integradas de React"
---

<Intro>

Además de [Hooks](/reference/react) y [Componentes](/reference/react/components), el paquete `react` exporta algunas otras APIs que son útiles para definir componentes. Esta página lista todas las demás APIs modernas de React.

</Intro>

---

* [`createContext`](/reference/react/createContext) te permite definir y proporcionar contexto a los componentes hijos. Se utiliza con [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) te permite retrasar la carga del código de un componente hasta que se renderice por primera vez.
* [`memo`](/reference/react/memo) permite que tu componente omita nuevas renderizaciones con las mismas props. Se utiliza con [`useMemo`](/reference/react/useMemo) y [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) te permite marcar una actualización de estado como no urgente. Similar a [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) te permite envolver renderizados e interacciones en pruebas para asegurar que las actualizaciones se hayan procesado antes de hacer afirmaciones.

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
