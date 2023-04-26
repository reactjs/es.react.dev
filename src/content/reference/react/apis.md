---
title: "APIs incorporadas de React"
---

<Intro>

Además de [Hooks](/reference/react) y [Components](/reference/react/components), el paquete `react` exporta algunas otras APIs que son útiles para definir componentes. Esta página lista todas las APIs modernas restantes de React.

</Intro>

---

* [`createContext`](/reference/react/createContext) te permite definir y proporcionar contexto a los componentes hijos. Se utiliza con [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) permite que tu componente exponga un nodo DOM como una referencia al padre. Se utiliza con [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) te permite retrasar la carga del código de un componente hasta que se renderize por primera vez.
* [`memo`](/reference/react/memo) permite que tu componente omita nuevas renderizaciones con las mismas props. Se utiliza con [`useMemo`](/reference/react/useMemo) y [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) te permite marcar una actualización de estado como no urgente. Similar a [`useTransition`.](/reference/react/useTransition)
