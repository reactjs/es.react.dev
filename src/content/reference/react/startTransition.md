---
title: startTransition
---

<Intro>

<<<<<<< HEAD
`startTransition` permite actualizar el estado sin bloquear la UI.
=======
`startTransition` lets you render a part of the UI in the background.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

La función `startTransition` te permite marcar una actualización de estado como una Transición.

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
* `scope`: Una función que actualiza algún estado llamando a una o más [funciones `set`](/reference/react/useState#setstate). React llama inmediatamente a `scope` sin argumentos y marca todas las actualizaciones de estado programadas de forma síncrona durante la llamada a la función `scope` como Transiciones. Estas serán [sin bloqueo](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) y [no mostrarán indicadores de carga no deseados.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
=======
* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls awaited in the `action` will be included in the transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](#preventing-unwanted-loading-indicators).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

#### Devuelve {/*returns*/}

`startTransition` no devuelve nada.

#### Advertencias {/*caveats*/}

* `startTransition` no proporciona una forma de rastrear si hay una Transición pendiente. Para mostrar un indicador pendiente mientras se produce la Transición, debes utilizar [`useTransition`](/reference/react/useTransition) en su lugar.

* Solo puedes envolver una actualización en una Transición si tienes acceso a la función `set`  de ese estado. Si deseas iniciar una Transición en respuesta a alguna prop o un valor de devolución de un Hook personalizado, intenta usar [`useDeferredValue`](/reference/react/useDeferredValue) en su lugar.

<<<<<<< HEAD
* La función que pasas a `startTransition` debe ser sincrónica. React ejecuta inmediatamente esta función, marcando todas las actualizaciones de estado que ocurren mientras se ejecuta como Transiciones. Si intentas realizar más actualizaciones de estado más tarde (por ejemplo, en un timeout), no se marcarán como Transiciones.
=======
* The function you pass to the of `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

* Una actualización de estado marcada como una Transición será interrumpida por otras actualizaciones de estado. Por ejemplo, si actualizas un componente de gráfico dentro de una Transición, pero luego comienzas a escribir en una entrada de texto mientras el gráfico está en medio de una rerenderización, React reiniciará el trabajo de renderizado en el componente de gráfico después de manejar la actualización de estado de la entrada de texto.

* Las actualizaciones de Transición no se pueden utilizar para controlar entradas de texto.

<<<<<<< HEAD
* Si hay varias Transiciones en curso, React actualmente las agrupa. Esta es una limitación que probablemente se eliminará en una versión futura.
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

---

## Uso {/*usage*/}

### Marcar una actualización de estado como una Transición sin bloqueo {/*marking-a-state-update-as-a-non-blocking-transition*/}

Puedes marcar una actualización de estado como una Transición envolviéndola en una llamada `startTransition`:

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

Las Transiciones te permiten mantener la actualización de la interfaz de usuario receptiva incluso en dispositivos lentos.

Con una Transición, tu interfaz de usuario sigue siendo receptiva en medio de una nueva renderización. Por ejemplo, si el usuario hace clic en una pestaña pero luego cambia de opinión y hace clic en otra pestaña, puede hacerlo sin esperar a que termine la primera renderización.

<Note>

`startTransition` es muy similar a [`useTransition`](/reference/react/useTransition), excepto que no proporciona la bandera `isPending` para rastrear si una Transición está en curso. Puedes llamar a `startTransition` cuando `useTransition` no esté disponible. Por ejemplo, `startTransition` funciona fuera de los componentes, como desde una biblioteca de datos.

[Aprende sobre las Transiciones y ve ejemplos en la página de `useTransition`.](/reference/react/useTransition)

</Note>
