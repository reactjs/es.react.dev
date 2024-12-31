---
title: startTransition
---

<Intro>

`startTransition` permite renderizar una parte de la UI en segundo plano.

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

* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls awaited in the `action` will be included in the transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Devuelve {/*returns*/}

`startTransition` no devuelve nada.

#### Advertencias {/*caveats*/}

* `startTransition` no proporciona una forma de rastrear si hay una Transición pendiente. Para mostrar un indicador pendiente mientras se produce la Transición, debes utilizar [`useTransition`](/reference/react/useTransition) en su lugar.

* Solo puedes envolver una actualización en una Transición si tienes acceso a la función `set`  de ese estado. Si deseas iniciar una Transición en respuesta a alguna prop o un valor de devolución de un Hook personalizado, intenta usar [`useDeferredValue`](/reference/react/useDeferredValue) en su lugar.

* The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Una actualización de estado marcada como una Transición será interrumpida por otras actualizaciones de estado. Por ejemplo, si actualizas un componente de gráfico dentro de una Transición, pero luego comienzas a escribir en una entrada de texto mientras el gráfico está en medio de una rerenderización, React reiniciará el trabajo de renderizado en el componente de gráfico después de manejar la actualización de estado de la entrada de texto.

* Las actualizaciones de Transición no se pueden utilizar para controlar entradas de texto.

* Si hay varias Transiciones en curso, React actualmente las agrupa. Esta es una limitación que podría eliminarse en una versión futura.

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
