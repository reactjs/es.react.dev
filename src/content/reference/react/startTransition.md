---
title: startTransition
---

<Intro>

`startTransition` permite actualizar el estado sin bloquear la UI.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

<<<<<<< HEAD
La función `startTransition` te permite marcar una actualización de estado como una transición.
=======
The `startTransition` function lets you mark a state update as a Transition.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('acerca de');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

<<<<<<< HEAD
* `scope`: Una función que actualiza algún estado llamando a una o más [funciones `set`](/reference/react/useState#setstate). React llama inmediatamente a `scope` sin argumentos y marca todas las actualizaciones de estado programadas de forma síncrona durante la llamada a la función `scope` como transiciones. Estas serán [sin bloqueo](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) y [no mostrarán indicadores de carga no deseados.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as Transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

#### Devuelve {/*returns*/}

`startTransition` no devuelve nada.

#### Advertencias {/*caveats*/}

<<<<<<< HEAD
* `startTransition` no proporciona una forma de rastrear si hay una transición pendiente. Para mostrar un indicador pendiente mientras se produce la transición, debes utilizar [`useTransition`](/reference/react/useTransition) en su lugar.

* Solo puedes envolver una actualización en una transición si tienes acceso a la función `set`  de ese estado. Si deseas iniciar una transición en respuesta a alguna prop o un valor de devolución de un Hook personalizado, intenta usar [`useDeferredValue`](/reference/react/useDeferredValue) en su lugar.

* La función que pasas a `startTransition` debe ser sincrónica. React ejecuta inmediatamente esta función, marcando todas las actualizaciones de estado que ocurren mientras se ejecuta como transiciones. Si intentas realizar más actualizaciones de estado más tarde (por ejemplo, en un timeout), no se marcarán como transiciones.

* Una actualización de estado marcada como una transición será interrumpida por otras actualizaciones de estado. Por ejemplo, si actualizas un componente de gráfico dentro de una transición, pero luego comienzas a escribir en una entrada de texto mientras el gráfico está en medio de una rerenderización, React reiniciará el trabajo de renderizado en el componente de gráfico después de manejar la actualización de estado de la entrada de texto.
=======
* `startTransition` does not provide a way to track whether a Transition is pending. To show a pending indicator while the Transition is ongoing, you need [`useTransition`](/reference/react/useTransition) instead.

* You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook return value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as Transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as Transitions.

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

* Las actualizaciones de transición no se pueden utilizar para controlar entradas de texto.

<<<<<<< HEAD
* Si hay varias transiciones en curso, React actualmente las agrupa. Esta es una limitación que probablemente se eliminará en una versión futura.
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

---

## Uso {/*usage*/}

<<<<<<< HEAD
### Marcar una actualización de estado como una transición sin bloqueo {/*marking-a-state-update-as-a-non-blocking-transition*/}

Puedes marcar una actualización de estado como una transición envolviéndola en una llamada `startTransition`:
=======
### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

You can mark a state update as a *Transition* by wrapping it in a `startTransition` call:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('acerca de');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Las transiciones te permiten mantener la actualización de la interfaz de usuario receptiva incluso en dispositivos lentos.

<<<<<<< HEAD
Con una transición, tu interfaz de usuario sigue siendo receptiva en medio de una nueva renderización. Por ejemplo, si el usuario hace clic en una pestaña pero luego cambia de opinión y hace clic en otra pestaña, puede hacerlo sin esperar a que termine la primera renderización.

<Note>

`startTransition` es muy similar a [`useTransition`](/reference/react/useTransition), excepto que no proporciona la bandera `isPending` para rastrear si una transición está en curso. Puedes llamar a `startTransition` cuando `useTransition` no esté disponible. Por ejemplo, `startTransition` funciona fuera de los componentes, como desde una biblioteca de datos.

[Aprende sobre las transiciones y ve ejemplos en la página de `useTransition`.](/reference/react/useTransition)
=======
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.

<Note>

`startTransition` is very similar to [`useTransition`](/reference/react/useTransition), except that it does not provide the `isPending` flag to track whether a Transition is ongoing. You can call `startTransition` when `useTransition` is not available. For example, `startTransition` works outside components, such as from a data library.

[Learn about Transitions and see examples on the `useTransition` page.](/reference/react/useTransition)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

</Note>
