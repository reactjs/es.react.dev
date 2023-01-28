---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` puede afectar el desempeño. Se prefiere el uso de [`useEffect`](/reference/react/useEffect) cuando sea posible.

</Pitfall>

<Intro>

`useLayoutEffect` es una versión de [`useEffect`](/reference/react/useEffect) que se acciona antes que el navegador vuelva a pintar la pantalla.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Llama a `useLayoutEffect` para ejecutar las medidas de diseño antes que el navegador vuelva a pintar la pantalla:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[Mira más ejemplos debajo.](#usage)

#### Parámetros {/*parameters*/}

* `setup`: La función con la lógica de tu efecto. Tu función setup o de configuración puede retornar opcionalmente una función de *limpieza*. Antes que tu componente sea agregado primeramente al DOM, react va a ejecutar tu función de configuración. Después de cada renderizado con dependencias modificadas, react primero va a ejecutar la función de limpieza (si tú lo provees) con los valores anteriores, y luego ejecuta tu función de configuración con los nuevos valores. Antes que tu componente sea eliminado del DOM, react va a ejecutar tu función de limpieza una última vez.
 
* **opcional** `dependencies`: La lista de todos los valores reactivos referenciados dentro del código de `setup`. Los valores reactivos incluyen props, estados, y todas las variables y funciones declaradas directamente dentro del cuerpo de tu componente. Si tu linter está [configurado para React](/learn/editor-setup#linting), va a verificar que cada valor reactivo este correctamente especificado como una dependencia. La lista de dependencias tiene que tener un número constante de elementos y ser escritos en linea como `[dep1, dep2, dep3]`. React va a comparar cada dependencia con su valor anterior usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Si no especificas del todo las dependencias, tu Efecto se volverá a ejecutar después de cada renderizado del componente.

#### Devuelve {/*returns*/}

`useLayoutEffect` devuelve `undefined`.

#### Advertencias {/*caveats*/}

* `useLayoutEffect` es un Hook, así que solo puedes llamarlo **en el nivel mas alto de tu componente** o en tus propios hooks. No puedes llamarlo dentro de bucles o condicionales. Si lo necesitas, extrae un nuevo componente y mueve el estado a él.

* Cuando el modo estricto está activado, react va a **ejecutar una configuración adicional solo para desarrollo + ciclo de limpieza**  antes de la primera configuración real. Esta es una prueba de estrés que asegura que tu lógica de limpieza sea un "espejo" de tu lógica de configuración y se detenga o se deshaga lo que sea que tu configuración esté haciendo. Si esto causa un problema [necesitas implementar la función de limpieza.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Si algunas de tus dependencias son objetos o funciones definidas dentro del componente, hay un riesgo de que ellas **causen el efecto de volver a ejecutarse mas de lo necesario.** Para arreglar esto, elimina dependencias de [objetos](/reference/react/useEffect#removing-unnecessary-object-dependencies) y [funciones](/reference/react/useEffect#removing-unnecessary-function-dependencies) innecesarias. También puedes [extraer actualizaciones de estados](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) y  [lógica que no es reactiva](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) fuera de tu Efecto.

* Efectos **solo se ejecuta en el lado del cliente.** No se ejecuta durante el renderizado del lado del servidor

* El código dentro de `useLayoutEffect` y todos los estados actualizados programados desde él **bloquea el navegador de volver a pintar en la pantalla.** Cuando es usado excesivamente, esto puede hacer tu aplicación muy lenta. Cuando sea posible, se prefiere usar [`useEffect`.](/reference/reac/useEffect) 

---

## Uso {/*usage*/}

### Medir el layout antes que el navegador vuelva a pintar la pantalla {/*measuring-layout-before-the-browser-repaints-the-screen*/}

La mayoría de los componentes no necesitan conocer sus posiciones y tamaños en la pantalla para decidir que renderizar. Ellos solo retornan algo de JSX con CSS. Luego, el navegador calcula sus layout (posición y tamaño) y vuelve a repintar la pantalla. 

Aveces, eso no es suficiente. Imagina un tooltip que aparece junto a algún elemento cuando pasas con el ratón por encima de él. Si hay suficiente espacio, el tooltip debe aparecer arriba del elemento, pero si no tiene suficiente espacio para encajar, debe aparecer debajo. Esto significa que para renderizar el tooltip en la posición final correcta, necesitas saber su altura (quiere decir, si cabe en la parte superior).

Para hacer esto, necesitas renderizar en dos pasos:

1. Renderiza el tooltip en cualquier lugar (incluso con una posición incorrecta).
2. Mide su altura y decide dónde colocar el tooltip.
3. Renderiza el tooltip *de nuevo* en la posición correcta.

**Todo esto necesita pasar antes que el navegador vuelva a pintar la pantalla.** No quieres que el usuario vea el tooltip moviéndose. Llama a `useLayoutEffect` para llevar a cabo las medidas del layout antes que el navegador vuelva a pintar la pantalla. 

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Aún no sabes la altura real 

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Vuelve a renderizar ahora que sabes la altura real
  }, []);

  // ...usa tooltipHeight en la lógica del renderizado debajo...
}
```

Así es como funciona paso por paso:

1. `Tooltip` se renderiza inicialmente con `tooltipHeight = 0`  (el tooltip puede estar posicionado incorrectamente).
2. React lo coloca en el DOM y ejecuta el código en `useLayoutEffect`.
3. Tu `useLayoutEffect` [mide la altura](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) del contenido del tooltip y dispara inmediatamente un renderizado de nuevo.
4. `Tooltip` se vuelve a renderizar con el real `tooltipHeight` (el tooltip está posicionado correctamente).
5. React lo actualiza en el DOM y el navegador finalmente muestra el tooltip.

Pasa el ratón por encima de los botones debajo y mira como el tooltip ajusta su posición dependiendo de si encaja.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Este tooltip no encaja arriba del botón.
            <br />
            Es por esto que se muestra debajo del botón!
          </div>
        }
      >
        Pasa el ratón por encima (tooltip arriba)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Este tooltip encaja arriba del botón</div>
        }
      >
        Pasa el ratón por encima (tooltip debajo)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Este tooltip encaja arriba del botón</div>
        }
      >
        Pasa el ratón por encima (tooltip debajo)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Altura del tooltip medida: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // No encaja arriba, entonces colócalo debajo
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Ten en cuenta que aunque el componente `Tooltip` tiene que renderizar en dos pasos (primero, con `tooltipHeight` inicializado en `0` y luego con la medición real de la altura), tú solo ves el resultado final. Es por esto que necesitas `useLayoutEffect` en vez de [`useEffect`](/reference/react/useEffect) para este ejemplo. Veamos las diferencias en detalle debajo.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` bloquea el navegador para que no vuelva a pintarse {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React garantiza que el código dentro de `useLayoutEffect` y cada actualización de estado programada dentro de él va a ser procesada **antes que el navegador vuelva a pintar la pantalla.** Esto te permite renderizar el tooltip, medirlo, y volver a renderizar el tooltip sin que el usuario note el primer renderizado adicional. En otras palabras, `useLayoutEffect` bloquea el navegador de pintarse. 

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Este tooltip no encaja arriba del botón.
            <br />
            Es por esto que se muestra debajo del botón!
          </div>
        }
      >
        Pasa el ratón por encima (tooltip arriba)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Este tooltip encaja arriba del botón.</div>
        }
      >
         Pasa el ratón por encima (tooltip debajo)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Este tooltip encaja arriba del botón</div>
        }
      >
        Pasa el ratón por encima (tooltip debajo)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // No encaja arriba, entonces colócalo debajo
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` no bloquea el navegador {/*useeffect-does-not-block-the-browser*/}

Aquí está el mismo ejemplo, pero con [`useEffect`](/reference/react/useEffect) en vez de `useLayoutEffect`. Si estas en un dispositivo mas lento, podrías notar que aveces el tooltip "parpadea" y de forma breve veras su posición inicial antes de la posición correcta.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Este tooltip no encaja arriba del botón.
            <br />
            Es por esto que se muestra debajo del botón!
          </div>
        }
      >
        Pasa el ratón por encima (tooltip arriba)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Este tooltip encaja arriba del botón</div>
        }
      >
        Pasa el ratón por encima (tooltip debajo)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Este tooltip encaja arriba del botón</div>
        }
      >
        Pasa el ratón por encima (tooltip debajo)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // No encaja arriba, entonces colócalo debajo
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Para hacer el error fácil de reproducir, esta versión agrega un delay artificial durante el renderizado. React va a dejar que el navegador pinte la pantalla antes que procese la actualización del estado dentro de `useEffect`. Como resultado, el tooltip parpadea.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Este tooltip no encaja arriba del botón.
            <br />
            Es por esto que se muestra debajo del botón!
          </div>
        }
      >
        Pasa el ratón por encima (tooltip arriba)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Este tooltip encaja arriba del botón</div>
        }
      >
        Pasa el ratón por encima (tooltip debajo)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Este tooltip encaja arriba del botón</div>
        }
      >
        Pasa el ratón por encima (tooltip debajo)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Esto ralentiza artificialmente el renderizado.
  let now = performance.now();
  while (performance.now() - now < 100) {
    // no hacer nada por un momento...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // No encaja arriba, entonces colócalo debajo
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Edita este ejemplo a `useLayoutEffect` y observa que bloquea el pintado incluso si se ralentiza el renderizado.

<Solution />

</Recipes>

<Note>

Rendering in two passes and blocking the browser hurts performance. Try to avoid this when you can.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "`useLayoutEffect` does nothing on the server" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

The purpose of `useLayoutEffect` is to let your component [use layout information for rendering:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Render the initial content.
2. Measure the layout *before the browser repaints the screen.*
3. Render the final content using the layout information you've read.

When you or your framework uses [server rendering](/reference/react-dom/server), your React app renders to HTML on the server for the initial render. This lets you show the initial HTML before the JavaScript code loads.

The problem is that on the server, there is no layout information.

In the [earlier example](#measuring-layout-before-the-browser-repaints-the-screen), the `useLayoutEffect` call in the `Tooltip` component lets it position itself correctly (either above or below content) depending on the content height. If you tried to render `Tooltip` as a part of the initial server HTML, this would be impossible to determine. On the server, there is no browser and no layout! So, even if you rendered it on the server, its position would "jump" on the client after the JavaScript loads and runs.

Usually, components that rely on layout information don't need to render on the server anyway. For example, it probably doesn't make sense to show a `Tooltip` during the initial render. It is triggered by a client interaction.

However, if you're running into this problem, you have a few options:

1. You can replace `useLayoutEffect` with [`useEffect`.](/reference/react/useEffect) This tells React that it's okay to display the initial render result without blocking the paint (because the original HTML will become visible before your Effect runs).

2. You can [mark your component as client-only.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content) This tells React to replace its content up to the closest [`<Suspense>`](/reference/react/Suspense) boundary with a loading fallback (for example, a spinner or a glimmer) during server rendering.

3. You can display different components on the server and on the client. One way to do this is to keep a boolean `isMounted` state that's initialized to `false`, and set it to `true` inside a `useEffect` call. Your rendering logic can then be like `return isMounted ? <RealContent /> : <FallbackContent />`. On the server and during the hydration, the user will see `FallbackContent` which should not call `useLayoutEffect`. Then React will replace it with `RealContent` which runs on the client only and can include `useLayoutEffect` calls.

4. If you synchronize your component with an external data store and rely on `useLayoutEffect` for different reasons than measuring layout, consider [`useSyncExternalStore`](/reference/react/useSyncExternalStore) instead which [supports server rendering.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)




