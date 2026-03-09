---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` es para autores de bibliotecas CSS-en-JS. A menos que estés trabajando en una biblioteca CSS-en-JS y necesites un lugar donde inyectar los estilos, probablemente busques [`useEffect`](/reference/react/useEffect) o [`useLayoutEffect`](/reference/react/useLayoutEffect) en su lugar.

</Pitfall>

<Intro>

`useInsertionEffect` permite insertar elementos en el DOM antes de que se dispare cualquier Efecto de diseño (*layout*).

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Llama a `useInsertionEffect` para insertar estilos antes de que se dispare cualquier Efecto que pueda necesitar leer el diseño:

```js
import { useInsertionEffect } from 'react';

// Dentro de tu biblioteca CSS-en-JS
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inyecta las etiquetas <style> aquí ...
  });
  return rule;
}
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `setup`: La función con la lógica de tus Efectos. Tu función _setup_ también puede devolver opcionalmente una función de *limpieza*. Cuando tu componente es añadido al DOM, pero antes de que se dispare cualquier Efecto de diseño, React ejecutará tu función _setup_. Después de cada re-renderizado con dependencias modificadas, React ejecutará primero la función de limpieza (si la has proporcionado) con los valores antiguos, y luego ejecutará tu función _setup_ con los nuevos valores. Cuando tu componente es removido del DOM, React ejecutará tu función de limpieza.

* ***opcional** `dependencias`: La lista de todos los valores reactivos referenciados dentro del el código de `setup`. Los valores reactivos incluyen props, estado y todas las variables y funciones declaradas directamente dentro del cuerpo de tu componente. Si tu linter está [configurado para React](/learn/editor-setup#linting), verificará que cada valor reactivo esté correctamente especificado como dependencia. La lista de dependencias tienen que tener un número constante de elementos y que sean escritos en línea como `[dep1, dep2, dep3]`. React comparará cada dependencia con su valor previo usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Si no especificas ninguna dependencia, tu Efecto se volverá a ejecutar después de cada renderizado del componente.

#### Devuelve {/*returns*/}

`useInsertionEffect` devuelve `undefined`.

#### Advertencias {/*caveats*/}

* Los Efectos sólo se ejecutan en el cliente. No se ejecutan durante el renderizado del servidor.
* No puedes actualizar el estado desde dentro de `useInsertionEffect`.
* En el momento en que se ejecuta `useInsertionEffect`, las referencias aún no se han adjuntado.
* `useInsertionEffect` puede ejecutarse antes o después de que el DOM haya sido actualizado. No debes confiar en que el DOM se actualice en un momento determinado.
* A diferencia de otros tipos de Efectos, que disparan la limpieza por cada Efecto y luego el _setup_ por cada Efecto, `useInsertionEffect` disparará ambos, limpieza y _setup_, un componente a la vez. El resultado es un "intercalado" de funciones de limpieza y _setup_.
---

## Uso {/*usage*/}

### Inyección de estilos dinámicos desde bibliotecas de CSS-en-JS {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Tradicionalmente, añadirías estilo a los componentes de React usando CSS plano.

```js
// En tu archivo JS:
<button className="success" />

// En tu archivo CSS:
.success { color: green; }
```

Algunos equipos prefieren incluir sus estilos directamente en el código JavaScript en lugar de escribir archivos CSS. Esto normalmente requiere usar una biblioteca CSS-en-JS o una herramienta. Existen tres formas comunes de plantear el CSS-en-JS:

1. Extracción estática de archivos CSS con un compilador
2. Estilos en línea, ej. `<div style={{ opacity: 1 }}>`
3. Inyección durante el runtime de las etiquetas `<style>`

Si usas CSS-en-JS, recomendamos la combinación de los dos primeros enfoques (archivos CSS para estilos estáticos, estilos en línea para estilos dinámicos). **No recomendamos la inyección durante el runtime de la etiqueta `<style>` por dos razones:**

1. La inyección durante el runtime fuerza al navegador a recalcular los estilos mucho más a menudo.
2. La inyección durante el runtime puede ser muy lenta si ocurre en un tiempo inadecuado en el ciclo de vida de React.

El primer problema no se puede resolver, pero `useInsertionEffect` te ayuda a solucionar el segundo problema.

Llama a `useInsertionEffect` para insertar los estilos antes de que se disparen los Efectos de diseño:

```js {4-11}
// En tu biblioteca CSS-en-JS
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // Como hemos explicado antes, no recomendamos la inyección durante el runtime de las etiquetas <style>.
    // Pero si tienes que hacerlo, entonces es importante que sea dentro del useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

De forma similar a `useEffect`, `useInsertionEffect` no se ejecuta en el servidor. Si tienes que agrupar las reglas CSS has usado en el servidor, puedes hacerlo durante el renderizado:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Lee más sobre actualizar bibliotecas CSS-en-JS con la inyección en runtime `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### ¿Cómo puede ser esto mejor que inyectar estilos durante el renderizado o useLayoutEffect? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

<<<<<<< HEAD
Si insertas los estilos durante el renderizado y React está procesando una [actualización no bloqueante,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) el navegador recalculará los estilos en cada frame mientras renderiza un árbol de componentes, lo que puede ser **extremadamente lento.**
=======
If you insert styles during rendering and React is processing a [non-blocking update,](/reference/react/useTransition#perform-non-blocking-updates-with-actions) the browser will recalculate the styles every single frame while rendering a component tree, which can be **extremely slow.**
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

`useInsertionEffect` es mejor que insertar estilos durante [`useLayoutEffect`](/reference/react/useLayoutEffect) o [`useEffect`](/reference/react/useEffect) porque asegura que en el tiempo en que otros Efectos se ejecuten en tus componentes, las etiquetas `<style>` ya han sido añadidas. De otro modo, los cálculos de layout en Efectos regulares podrían ser incorrectos por los estilos desactualizados.

</DeepDive>