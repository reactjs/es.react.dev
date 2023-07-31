---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` es para autores de bibliotecas CSS-en-JS. A menos que estés trabajando en una biblioteca CSS-en-JS y necesites un lugar donde inyectar los estilos, probablemente busques [`useEffect`](/reference/react/useEffect) o [`useLayoutEffect`](/reference/react/useLayoutEffect) en su lugar.

</Pitfall>

<Intro>

<<<<<<< HEAD
`useInsertionEffect` es una versión de [`useEffect`](/reference/react/useEffect) que se dispara antes de cualquier mutación del DOM.
=======
`useInsertionEffect` allows inserting elements into the DOM before any layout effects fire.
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

<<<<<<< HEAD
Llama a `useInsertionEffect` para insertar los estilos antes de cualquier mutación en el DOM:
=======
Call `useInsertionEffect` to insert styles before any effects fire that may need to read layout:
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

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

<<<<<<< HEAD
* `setup`: La función con la lógica de tu Efecto. Tu función setup puede opcionalmente devolver una función de *limpieza*. Antes de que tu componente sea añadido primero al DOM, React ejecutará tu función setup. Después de cada re-renderizado con dependencias modificadas, React ejecutará primero la función de limpieza (si es que la habías incluido) con los valores antiguos y entonces ejecutará tu función setup con los nuevos valores. Antes de que tu componente sea eliminado del DOM, React ejecutará tu función de limpieza una última vez.
=======
* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. When your component is added to the DOM, but before any layout effects fire, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. When your component is removed from the DOM, React will run your cleanup function.
 
* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm. If you don't specify the dependencies at all, your Effect will re-run after every re-render of the component.
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

* ***opcional** `dependencias`: La lista de todos los valores reactivos referenciados dentro del el código de `setup`. Los valores reactivos incluyen props, estado y todas las variables y funciones declaradas directamente dentro del cuerpo de tu componente. Si tu linter está [configurado para React](/learn/editor-setup#linting), verificará que cada valor reactivo esté correctamente especificado como dependencia. La lista de dependencias tienen que tener un número constante de elementos y que sean escritos en línea como `[dep1, dep2, dep3]`. React comparará cada dependencia con su valor previo usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Si no especificas ninguna dependencia, tu Efecto se volverá a ejecutar después de cada renderizado del componente.

#### Devuelve {/*returns*/}

`useInsertionEffect` devuelve `undefined`.

<<<<<<< HEAD
#### Advertencias {/*caveats*/}

* Los Efectos que sólo se ejecutan en el cliente. No se ejecutan durante el renderizado en el servidor.
* No puedes actualizar el estado dentro de `useInsertionEffect`.
* En el tiempo en que `useInsertionEffect` se ejecuta, las referencias aún no han sido acopladas y el DOM todavía no ha sido actualizado.

=======
* Effects only run on the client. They don't run during server rendering.
* You can't update state from inside `useInsertionEffect`.
* By the time `useInsertionEffect` runs, refs are not attached yet.
* `useInsertionEffect` may run either before or after the DOM has been updated. You shouldn't rely on the DOM being updated at any particular time.
* Unlike other types of Effects, which fire cleanup for every Effect and then setup for every Effect, `useInsertionEffect` will fire both cleanup and setup one component at a time. This results in an "interleaving" of the cleanup and setup functions.
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4
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

<<<<<<< HEAD
Llama a `useInsertionEffect` para insertar los estilos antes de cualquier mutación del DOM:
=======
Call `useInsertionEffect` to insert the styles before any layout effects fire:
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

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

Si insertas los estilos durante el renderizado y React está procesando una [actualización no bloqueante,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) el navegador recalculará los estilos en cada frame mientras renderiza un árbol de componentes, lo que puede ser **extremadamente lento.**

`useInsertionEffect` es mejor que insertar estilos durante [`useLayoutEffect`](/reference/react/useLayoutEffect) o [`useEffect`](/reference/react/useEffect) porque asegura que en el tiempo en que otros Efectos se ejecuten en tus componentes, las etiquetas `<style>` ya han sido añadidas. De otro modo, los cálculos de layout en Efectos regulares podrían ser incorrectos por los estilos desactualizados.

</DeepDive>
