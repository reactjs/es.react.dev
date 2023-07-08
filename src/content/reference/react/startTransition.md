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

La función `startTransition` te permite marcar una actualización de estado como una transición.

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

* `scope`: Una función que actualiza algún estado llamando a una o más [funciones `set`](/reference/react/useState#setstate). React llama inmediatamente a `scope` sin parámetros y marca todas las actualizaciones de estado programadas de forma síncrona durante la llamada a la función `scope` como transiciones. Estas serán [sin bloqueo](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) y [no mostrarán indicadores de carga no deseados.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### Returns {/*returns*/}

`startTransition` no devuelve nada.

#### Advertencias {/*caveats*/}

* `startTransition` no proporciona una forma de rastrear si hay una transición pendiente. Para mostrar un indicador pendiente mientras se produce la transición, debes utilizar [`useTransition`](/reference/react/useTransition) en su lugar.

* Solo puedes envolver una actualización en una transición si tienes acceso a la función `set`  de ese estado. Si deseas iniciar una transición en respuesta a alguna prop o un valor de retorno de un Hook personalizado, intenta usar [`useDeferredValue`](/reference/react/usedeferredvalue) en su lugar.

* La función que pasas a `startTransition` debe ser sincrónica. React ejecuta inmediatamente esta función, marcando todas las actualizaciones de estado que ocurren mientras se ejecuta como transiciones. Si intentas realizar más actualizaciones de estado más tarde (por ejemplo, en un timeout), no se marcarán como transiciones.

* Una actualización de estado marcada como una transición será interrumpida por otras actualizaciones de estado. Por ejemplo, si actualizas un componente de gráfico dentro de una transición, pero luego comienzas a escribir en una entrada de texto mientras el gráfico está en medio de una rerenderización, React reiniciará el trabajo de renderizado en el componente de gráfico después de manejar la actualización de estado de la entrada de texto.

* Las actualizaciones de transición no se pueden utilizar para controlar entradas de texto.

* Si hay varias transiciones en curso, React actualmente las agrupa. Esta es una limitación que probablemente se eliminará en una versión futura.

---

## Uso {/*usage*/}

### Marcar una actualización de estado como una transición sin bloqueo {/*marking-a-state-update-as-a-non-blocking-transition*/}

Puedes marcar una actualización de estado como una transición envolviéndola en una llamada `startTransition`:

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

Con una transición, tu interfaz de usuario sigue siendo receptiva en medio de una nueva renderización. Por ejemplo, si el usuario hace clic en una pestaña pero luego cambia de opinión y hace clic en otra pestaña, puede hacerlo sin esperar a que termine la primera renderización.

<Note>

`startTransition` es muy similar a [`useTransition`](/reference/react/useTransition), excepto que no proporciona la bandera `isPending` para rastrear si una transición está en curso. Puedes llamar a `startTransition` cuando `useTransition` no esté disponible. Por ejemplo, `startTransition` funciona fuera de los componentes, como desde una biblioteca de datos.

[Aprende sobre las transiciones y ve ejemplos en la página de `useTransition`.](/reference/react/useTransition)

</Note>
