---
id: hooks-faq
title: Preguntas frecuentes sobre Hooks
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

Los *Hooks* son una adición nueva en React 16.8. Te permiten usar el estado y otras características de React sin la necesidad de escribir una clase.

Esta página responde algunas de las preguntas frecuentes acerca de los [Hooks](/docs/hooks-overview.html).

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[Estrategia de adopción](#adoption-strategy)**
  * [¿Qué versiones de React incluyen Hooks?](#which-versions-of-react-include-hooks)
  * [¿Necesito reescribir todos mis componentes que ya sean clases?](#do-i-need-to-rewrite-all-my-class-components)
  * [¿Qué puedo hacer con Hooks que no pueda hacer con clases?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [¿Qué tanto de mi conocimiento de React se mantiene relevante?](#how-much-of-my-react-knowledge-stays-relevant)
  * [¿Debería usar Hooks, clases, o una mezcla de ambos?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [¿Cubren los Hooks todos los casos de uso de las clases?](#do-hooks-cover-all-use-cases-for-classes)
  * [¿Reemplazan los hooks a los render props y los Componentes de Orden Superior (HOC)?](#do-hooks-replace-render-props-and-higher-order-components)
  * [¿Qué significan los Hooks para APIs populares como el connect de Redux, o React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [¿Funcionan los Hooks con tipado estático?](#do-hooks-work-with-static-typing)
  * [¿Cómo probar Componentes que usan Hooks?](#how-to-test-components-that-use-hooks)
  * [¿Qué hacen cumplir las reglas de lint?](#what-exactly-do-the-lint-rules-enforce)
* **[De las clases a los Hooks](#from-classes-to-hooks)**
  * [¿Cómo corresponden los métodos del ciclo de vida a los Hooks?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [¿Cómo puedo obtener datos con los Hooks?](#how-can-i-do-data-fetching-with-hooks)
  * [¿Existe algo similar a las variables de instancia?](#is-there-something-like-instance-variables)
  * [¿Debería usar una o muchas variables de estado?](#should-i-use-one-or-many-state-variables)
  * [¿Puedo correr un efecto solo cuando ocurran actualizaciones?](#can-i-run-an-effect-only-on-updates)
  * [¿Cómo obtengo las props o el estado previo?](#how-to-get-the-previous-props-or-state)
  * [¿Por qué estoy viendo props o estado obsoletos dentro de mi función?](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [¿Cómo implemento getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [¿Hay algo similar a forceUpdate?](#is-there-something-like-forceupdate)
  * [¿Puedo crear una referencia (ref) a un Componente de función?](#can-i-make-a-ref-to-a-function-component)
  * [¿Cómo puedo medir un nodo del DOM?](#how-can-i-measure-a-dom-node)
  * [¿Qué significa [thing, setThing] = useState()?](#what-does-const-thing-setthing--usestate-mean)
* **[Optimizaciones de desempeño](#performance-optimizations)**
  * [¿Puedo saltarme un efecto durante las actualizaciones?](#can-i-skip-an-effect-on-updates)
  * [¿Es seguro omitir funciones de la lista de dependencias?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [¿Qué puedo hacer si las dependencias de un efecto cambian con mucha frecuencia?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [¿Cómo implemento shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [¿Cómo memorizar (memoize) los cálculos?](#how-to-memoize-calculations)
  * [¿Cómo crear objetos costosos de manera diferida (lazy)?](#how-to-create-expensive-objects-lazily)
  * [¿Son los hooks lentos debido a la creación de funciones en el render?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [¿Cómo evitar pasar callbacks hacia abajo?](#how-to-avoid-passing-callbacks-down)
  * [¿Cómo leer un valor que cambia frecuentemente desde useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Bajo el capó](#under-the-hood)**
  * [¿Cómo asocia React las llamadas a los Hooks con Componentes?](#how-does-react-associate-hook-calls-with-components)
  * [¿Cuáles son los antecedentes de los Hooks?](#what-is-the-prior-art-for-hooks)

## Estrategia de adopción {#adoption-strategy}

### ¿Qué versiones de React incluyen Hooks? {#which-versions-of-react-include-hooks}

Empezando con React 16.8.0, se incluye una implementación estable de Hooks para:

* React DOM
* React Native
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Nótese que **para habilitar los Hooks, todos los paquetes de React deben estar en la versión 16.8.0 o superior**. Los Hooks no van a funcionar si olvidas, por ejemplo, actualizar React DOM.

[React Native 0.59](https://facebook.github.io/react-native/blog/2019/03/12/releasing-react-native-059) y versiones superiores son compatibles con Hooks.

### ¿Necesito reescribir todos mis componentes que ya sean clases? {#do-i-need-to-rewrite-all-my-class-components}

No. [No hay planes](/docs/hooks-intro.html#gradual-adoption-strategy) de remover las clases de React -- todos debemos seguir lanzando productos y no nos podemos dar el lujo de reescribir. Recomendamos usar Hooks en tu código nuevo.

### ¿Qué puedo hacer con Hooks que no pueda hacer con clases? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Los Hooks ofrecen una nueva, poderosa y expresiva forma de reusar funcionalidad entre componentes. La sección ["Construyendo tus Propios Hooks"](/docs/hooks-custom.html) provee un vistazo a las posibilidades. [Este artículo](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) por uno de los miembros clave del equipo de React se adentra más en las nuevas capacidades que proveen los Hooks.

### ¿Qué tanto de mi conocimiento de React se mantiene relevante? {#how-much-of-my-react-knowledge-stays-relevant}

Los Hooks son una manera más directa de usar la características de React que ya conoces -- como el estado, ciclo de vida, contexto, y las referencias (refs). No cambian de manera fundamental el funcionamiento de React, y tu conocimiento de componentes, props, y el flujo de datos de arriba hacia abajo sigue siendo igual de relevante.

Los Hooks tienen también su propia curva de aprendizaje. Si hay algo faltante en esta documentación, [levanta un issue](https://github.com/reactjs/es.reactjs.org/issues/new) y trataremos de ayudar.

### ¿Debería usar Hooks, clases, o una mezcla de ambos? {#should-i-use-hooks-classes-or-a-mix-of-both}

Cuando estés listo, te recomendamos empezar a usar Hooks en los nuevos componentes que escribas. Asegúrate que todo tu equipo esté de acuerdo en usarlos, y que estén familiarizados con esta documentación. No recomendamos reescribir tus clases existentes a menos de que hayas planeado reescribirlas de cualquier manera (por ejemplo para arreglar bugs).

<<<<<<< HEAD
No puedes usar Hooks *dentro* de un Componente de Clase, pero definitivamente puedes mezclar componentes de clase y componentes de función con Hooks en un mismo árbol. Si un componente es una clase, o una función que utiliza Hooks es un detalle de implementación del Componente. A largo plazo, experamos que los Hooks sean la manera más usada de escribir Componentes de React.
=======
You can't use Hooks *inside* a class component, but you can definitely mix classes and function components with Hooks in a single tree. Whether a component is a class or a function that uses Hooks is an implementation detail of that component. In the longer term, we expect Hooks to be the primary way people write React components.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

### ¿Cubren los Hooks todos los casos de uso de las clases? {#do-hooks-cover-all-use-cases-for-classes}

<<<<<<< HEAD
Nuestra meta es que los Hooks cubran todos los casos de uso de las clases lo más pronto posible. En este momento no existen equivalentes de los ciclos de vida poco comunes `getSnapshotBeforeUpdate` y `componentDidCatch`, pero planeamos añadirlos pronto.
=======
Our goal is for Hooks to cover all use cases for classes as soon as possible. There are no Hook equivalents to the uncommon `getSnapshotBeforeUpdate`, `getDerivedStateFromError` and `componentDidCatch` lifecycles yet, but we plan to add them soon.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

Los Hooks aún son jóvenes, y algunas librerías  de terceros podrían no ser compatibles con Hooks de momento.

### ¿Reemplazan los hooks a los render props y los Componentes de Orden Superior (HOC)? {#do-hooks-replace-render-props-and-higher-order-components}

En muchas ocasiones, render props y los componentes de orden superior, renderizan un sólo hijo. Pensamos que los Hooks son una forma más sencilla de soportar este caso de uso. Aún hay lugar para ambos patrones (por ejemplo, un scroller virtual podría tener un prop `renderItem`, o un componente que sea un contenedor visual podría tener su propia estructura de DOM). Pero en la mayoría de los casos, los Hooks serán suficiente y ayudaran a reducir la anidación en tu arbol.

### ¿Qué significan los Hooks para APIs populares como el connect de Redux, o React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Puedes seguir usando exactamente las mismas APIs que siempre has usado, seguirán funcionando.

React Redux desde v7.1.0 [tiene una API con Hooks](https://react-redux.js.org/api/hooks) y expone hooks como `useDispatch` o `useSelector`.

React Router [tiene compatibilidad con hooks](https://reacttraining.com/react-router/web/api/Hooks) desde v5.1.

Otras bibliotecas pueden ofrecer compatibilidad con hooks en el futuro también.

### ¿Funcionan los Hooks con tipado estático? {#do-hooks-work-with-static-typing}

Los Hooks fueron diseñados con el tipado estático en mente. Al ser funciones, son más fáciles de tipar que patrones como los componentes de orden superior (HOC). Las últimas definiciones para React de TypeScript y Flow incluyen soporte para Hooks.

Aún más importante, los Hooks personalizados tienen el poder de restringir la API de React si quisieras tiparlas de una manera más estricta. React te da las primitivas, pero puedes combinarlas de distintas maneras de las que proveemos por defecto.

### ¿Cómo probar Componentes que usan Hooks? {#how-to-test-components-that-use-hooks}

Desde el punto de vista de React, un componente que use Hooks, sigue siendo un componente normal. Si las herramientas de prueba que utilizas no dependen de los mecanismos internos de React, probar los componentes que usen Hooks, no debería ser diferente de probar cualquier otro componente.

>Nota
>
>[Recetas de pruebas](/docs/testing-recipes.html) incluye muchos ejemplo que puedes copiar y pegar.

Por ejemplo, asumamos que tenemos este componente de conteo:

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Vamos a probarlo usando React DOM. Para asegurarnos de que el comportamiento concuerda con lo que sucede en el browser, envolveremos el código, renderizándolo y actualizándolo usando llamadas a [`ReactTestUtils.act()`](/docs/test-utils.html#act).

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Probamos el primer render y efecto
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Probamos el segundo render y efecto
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

Las llamadas a `act()` también resolverán los efectos adentro de ellas.

Si necesitas probar un Hook personalizado, puedes hacerlo creando un componente en tu prueba, y usando tu Hook desde el mismo. Luego puedes probar el componente que escribiste.

Para reducir el _boilerplate_, recomendamos usar [React Testing Library](https://testing-library.com/react) que está diseñada para promover pruebas que utilicen tus componentes como lo harían los usuarios finales.

Para más información, revisa [Recetas de pruebas](/docs/testing-recipes.html).

### ¿Qué hacen cumplir las [reglas de lint](https://www.npmjs.com/package/eslint-plugin-react-hooks)? {#what-exactly-do-the-lint-rules-enforce}

Proveemos un [plugin de ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) que hace cumplir las [reglas de los Hooks](/docs/hooks-rules.html) para evitar bugs. Asume que cualquier función cuyo nombre empiece con "`use`", seguido de una letra mayúscula es un Hook. Reconocemos que esta heurística no es perfecta, y podría haber algunos falsos positivos, pero sin una convención que cubra a todo el ecosistema no hay manera de hacer que los Hooks funcionen bien en este aspecto -- y nombres más largos desalientan a las personas de usar Hooks, o la convención.

En particular, la regla hace cumplir que:

* Las llamadas a Hooks están dentro de una función cuyo nombre usa `PascalCase` (que se asume es un Componente), u otra función cuyo nombre empieza con "`use`", seguido de una letra mayúscula (por ejemplo `useSomething`, que se asume es un Hook personalizado).
* Los Hooks se llaman en el mismo orden en cada llamado a render.

Hay algunas heurísticas más, y podrían cambiar con el tiempo mientras ajustamos las reglas para generar un balance entre encontrar bugs y encontrar falsos positivos.

## De las clases a los Hooks {#from-classes-to-hooks}

### ¿Cómo corresponden los métodos del ciclo de vida a los Hooks?{#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Los componentes de Función no requieren un constructor. Puedes inicializar el estado en la llamada a [`useState`](/docs/hooks-reference.html#usestate). Si el cálculo del estado inicial es costoso, puedes pasar una función a `useState`.

* `getDerivedStateFromProps`: Agenda una actualización [durante el renderizado](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Ver `React.memo` [abajo](#how-do-i-implement-shouldcomponentupdate).

* `render`: Es el cuerpo del componente de función en sí.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: El [Hook `useEffect`](/docs/hooks-reference.html#useeffect) puede expresar todas las combinaciones de estos (incluyendo casos [poco](#can-i-skip-an-effect-on-updates) [comunes](#can-i-run-an-effect-only-on-updates)).

<<<<<<< HEAD
* `componentDidCatch` y `getDerivedStateFromError`: Aún no hay Hooks equivalentes a estos métodos, pero serán añadidos pronto.
=======
* `getSnapshotBeforeUpdate`, `componentDidCatch` and `getDerivedStateFromError`: There are no Hook equivalents for these methods yet, but they will be added soon.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

### ¿Cómo puedo obtener datos con los Hooks? {#how-can-i-do-data-fetching-with-hooks}

Aquí hay un [pequeño demo](https://codesandbox.io/s/jvvkoo8pq3) a modo introductorio. Para aprender más, consulta este [artículo](https://www.robinwieruch.de/react-hooks-fetch-data/) acerca de la obtención de datos con los Hooks.

### ¿Existe algo similar a las variables de instancia? {#is-there-something-like-instance-variables}

Si!, el Hook [`useRef()`](/docs/hooks-reference.html#useref) no es solo para referencias al DOM. El objeto "ref" es un contenedor genérico cuya propiedad `current` es mutable y puede contener cualquier valor, similar a una variable de instancia en una clase.

Puedes escribir en el desde adentro de `useEffect`:

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

Si simplemente quisieramos setear un intérvalo no necesitaríamos le referencia (`id` podría ser local al efecto), pero es útil si queremos limpiar el intérvalo de un manejador de evento.

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

Conceptualmente, puedes pensar en los refs como símiles a las variables de instancia en una clase. A menos que estés utilizando inicialización diferida ([lazy initialization](#how-to-create-expensive-objects-lazily)), evita setear referencias durante el renderizado -- esto podría llevar a comportamiento inesperado. En cambio, generalmente querrás modificar las referencias en manejadores de eventos y efectos.

### ¿Debería usar una o muchas variables de estado? {#should-i-use-one-or-many-state-variables}

Si vienes de las clases, podrías estar tentado a siempre llamar a `useState()` una sola vez y poner todo tu estado dentro de un solo objeto. Lo puedes hacer si quieres. Aquí hay un ejemplo que sigue el movimiento del mouse. mantenemos su posición y tamaño en el estado local:

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Ahora digamos que queremos escribir un poco de lógica que cambie `left` y `top` cuando el usuario mueva el mouse. Nota como mezclamos estos campos en el estado previo manualmente:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Spreading "...state" ensures we don't "lose" width and height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Note: this implementation is a bit simplified
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Esto se debe a que cuando actualizamos una variable de estado, *reemplazamos* su valor. Esto es diferente de `this.setState` en una clase, que *mezcla* los campos actualizados en el objeto.

<<<<<<< HEAD
Si extrañas esta mezcla automática, puedes escribir un Hook personalizado `useLegacyState` que mezcle las actualizaciones al objeto de estado. Sin embargo, **Recomendamos dividir el estado en múltiples variables de estado, basado en los valores que tienden a cambiar juntos**.
=======
If you miss automatic merging, you could write a custom `useLegacyState` Hook that merges object state updates. However, **we recommend to split state into multiple state variables based on which values tend to change together.**
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

Por ejemplo, podríamos dividir el estado de nuestro componente en objetos `position` y `size`, y siempre reemplazar `position` sin la necesidad de mezclar.

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

Separar variables de estado independientes también tiene otro beneficio. Hace fácil extraer lógica relacionada en un Hook personalizado, por ejemplo:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

Nota cómo podemos mover el llamado a `useState` para la variable de estado `position` y el efecto relacionado en un Hook personalizado sin cambiar su código. Si todo el estado estuviera en un solo objeto, extraerlo sería más difícil.

Ambas aproximaciones, poner todo el estado en un solo llamado a `useState`, y usar un llamado a `useState` por cada campo, pueden funcionar. Los Componentes suelen ser más legibles cuando encuentras un balance entre ambos extremos y agrupas partes del estado relacionadas en unas cuantas variables de estado independientes. Si la lógica del estado se vuelve muy compleja, recomendamos [manejarla con un reductor](/docs/hooks-reference.html#usereducer), o un Hook personalizado.

### ¿Puedo correr un efecto solo cuando ocurran actualizaciones? {#can-i-run-an-effect-only-on-updates}

Este es un caso de uso poco común. Si lo necesitas, puedes usar [una referencia mutable](#is-there-something-like-instance-variables) para guardar manualmente una bandera booleana que corresponde a si es el primer renderizado, o renderizados subsecuentes, luego puedes verificar la bandera en tu efecto. Si te encuentras haciendo esto regularmente podrías crear un Hook Personalizado.

### ¿Cómo obtengo las props o el estado previo? {#how-to-get-the-previous-props-or-state}

Actualmente lo puedes hacer manualmente [con una referencia](#is-there-something-like-instance-variables):

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

Esto podría ser un poco complicado, pero puedes extraer la funcionalidad en un Hook personalizado:

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Nota como esto podría funcionar para props, estado, o cualquier otro valor calculado.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count + 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

Es posible que en el futuro React provea un Hook `usePrevious` por defecto, ya que es un caso de uso relativamente común.

Mira también [el patrón recomendado para un estado derivado](#how-do-i-implement-getderivedstatefromprops).

### ¿Por qué estoy viendo props o estado obsoletos dentro de mi función? {#why-am-i-seeing-stale-props-or-state-inside-my-function}

Cualquier función dentro de un componente, incluidos los manejadores de eventos y los efectos, "ven" los props y estado del renderizado en el que fueron creados. Por ejemplo, considera código como este:

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

Si hiciste clic primero en "Show alert" y luego incrementas el contador, la alerta mostrará la variable `count` **en el momento en que hiciste click el botón "Show alert". Esto previene errores causados por código que asume que los props y estado no cambian**.

Si quieres intencionalmente leer el *último* estado de un callback asíncrono, podrías guardarla en [una ref](/docs/hooks-faq.html#is-there-something-like-instance-variables), mutarla y leer de ella.

Finalmente, otra razón posible para que veas props o estado obsoletos es que hayas usado la optimización del "array de dependencias" pero no especificaste correctamente todas las dependencias. Por ejemplo, si un efecto especifica `[]` como segundo argumento pero lee `someProp` dentro, continuará "viendo" el valor inicial de `someProp`. La solución pasa por o bien eliminar el array de dependencias, o arreglarlo. Aquí se explica [como puedes lidiar con funciones](#is-it-safe-to-omit-functions-from-the-list-of-dependencies), y aquí hay [otras estrategias comunes](#what-can-i-do-if-my-effect-dependencies-change-too-often) para ejecutar efectos con menos frecuencia sin dejar de especifica despendencias incorrectamente.

>Nota
>
>Proporcionamos una regla de ESLint llamada [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) como parte de nuestro paquete [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Esta regla advierte cuando las dependencias se especifican incorrectamente y sugiere una solución.

### ¿Cómo implemento getDerivedStateFromProps? {#how-do-i-implement-getderivedstatefromprops}

A pesar de que probablemente [no lo necesites](/blog/2018/06/07/you-probably-dont-need-derived-state.html), en los pocos casos en los que sea necesario (por ejemplo implementando un componente `<Transition>`), puedes actualizar el estado en medio de la renderización. React correrá de nuevo el componente con el estado actualizado inmediatamente después de correr el primer renderizado, así que no es costoso.

Aquí, guardamos el valor anterior del prop `row` en una variable de estado para poder comparar:

```js
function ScrollView({row}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

Esto puede parecer extraño en un principio, pero una actualización durante el renderizado es exactamente lo que siempre ha sido `getDerivedStateFromProps` conceptualmente.

### ¿Hay algo similar a forceUpdate? {#is-there-something-like-forceupdate}

Los Hooks `useState` y `useReducer` [evitan las actualizaciones](/docs/hooks-reference.html#bailing-out-of-a-state-update) si el siguiente valor es igual al anterior. Mutar el estado y llamar a `setState` no causarán un re-renderizado.

Usualmente, no deberías mutar el estado local en React. Sin embargo, como una salida de emergencia, puedes usar un contador incremental para forzar un re-renderizado incluso si el estado no ha cambiado:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Intenta evitar este patrón de ser posible. 

### ¿Puedo crear una referencia (ref) a un Componente de función? {#can-i-make-a-ref-to-a-function-component}

A pesar de que no deberías necesitar esto muy seguido, podrías exponer algunos métodos imperativos a un componente padre con con el Hook [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### ¿Cómo puedo medir un nodo del DOM? {#how-can-i-measure-a-dom-node}

Una manera rudimentaria para medir la posición o el tamaño de un nodo del DOM es usar una [referencia mediante callback](/docs/refs-and-the-dom.html#callback-refs). React llamara el callback cuando la referencia sea asocida a un nodo diferente. Aquí hay un [pequeño demo](https://codesandbox.io/s/l7m0v5x4v9):

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

No escogimos `useRef` para este ejemplo porque un objeto de referencia no notifica sobre los *cambios* al valor actual de la referencia. Usando una referencia mediante callback lo aseguramos [incluso si un componente hijo muestra el nodo medido después](https://codesandbox.io/s/818zzk8m78) (por ejemplo, en respuesta a un click), aun somos notificados al respecto en el componente padre y podemos actualizar las medidas.

Recuerda que pasamos `[]` como un arreglo de dependencias a `useCallback`. Esto asegura que nuestro callback por referencia no cambie entre renderizados, y de esta manera React no lo llamara innecesariamente.

En este ejemplo, el callback ref será llamado solo cuando el componente se monta y se desmonta, ya que el componente `<h1>` permanece presente durante cualquier renderizado. Si quieres ser notificado cada vez que un componente se redimensiona, podrías usar [`ResizeObserver`](https://developer.mozilla.org/es/docs/Web/API/ResizeObserver) o un Hook de terceros que ya implemente esta función.

Si quieres, puedes [extraer esta lógica](https://codesandbox.io/s/m5o42082xy) a un Hook reusable:

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```


### ¿Qué significa [thing, setThing] = useState()? {#what-does-const-thing-setthing--usestate-mean}

Si no estás familiarizado con esta sintaxis, mira la [explicación](/docs/hooks-state.html#tip-what-do-square-brackets-mean) en la documentación de los Hooks de estado.


## Optimizaciones de desempeño {#performance-optimizations}

### ¿Puedo saltarme un efecto durante las actualizaciones? {#can-i-skip-an-effect-on-updates}

Si. Mira [disparando un efecto condicionalmente](/docs/hooks-reference.html#conditionally-firing-an-effect). Ten en cuenta que no manejar las actualizaciones frecuentemente [introduce bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), por lo cual este no es el comportamiento por defecto.

### ¿Es seguro omitir funciones de la lista de dependencias? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

De manera general, no.

```js{3,8}
function Example() {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 Esto no es seguro (llama a `doSomething` que usa `someProp`)
}
```

Es difícil recordar cuáles props o estado son usadas por funciones fuera del efecto. Es por ello que **usualmente querrás declarar las funciones que necesita el efecto *dentro* de él.** De esta manera es fácil ver los valores del ámbito del componente de los que depende ese efecto:

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ Bien (nuestro efecto solo usa `someProp`)
}
```

Si luego de ello aún no usas ningún valor del ámbito del componente, es seguro especificar `[]`:

```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ Bien en este ejemplo, porque no usamos *ninguno* de los valores del ámbito del componente
```

En dependencia de tu caso de uso, hay otras opciones descritas debajo:

>Nota
>
>Proporcionamos la regla de ESLint [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) como parte del paquete [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Esta regla ayuda a encontrar componentes que no manejan las actualizaciones consistentemente.

Veamos por qué esto importa.

<<<<<<< HEAD
Si especificas una [lista de dependencias](/docs/hooks-reference.html#conditionally-firing-an-effect) como el último argumento de `useEffect`, `useMemo`, `useCallback`, o `useImperativeHandle`, debe incluir todos los valores usados dentro que participan en el flujo de datos de React. Aquí se incluyen props, estado y todo lo que esté derivado de ellos.
=======
If you specify a [list of dependencies](/docs/hooks-reference.html#conditionally-firing-an-effect) as the last argument to `useEffect`, `useMemo`, `useCallback`, or `useImperativeHandle`, it must include all values that are used inside the callback and participate in the React data flow. That includes props, state, and anything derived from them.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

*Únicamente* es seguro omitir una función de la lista de dependencias si nada dentro (o las funciones a las que se llama) referencia props, estado, o valores de ellos. Este ejemplo tiene un error:

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product' + productId); // Usa la prop productId
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 No válido, porque `fetchProduct` usa `productId`
  // ...
}
```

**La solución recomendada es mover la función _dentro_ de tu efecto**. Ello facilta ver qué props o estado usa tu efecto, y asegura que todos son declarados:

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Al mover esta función dentro del efecto, podemos ver claramente los valores que usa.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Válido, porque nuestro efecto solo usa productId
  // ...
}
```

Esto también te permite manejar respuestas fuera de orden con una variable local dentro del efecto:

```js{2,6,10}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }

    fetchProduct();
    return () => { ignore = true };
  }, [productId]);
```

Movimos la función dentro del efecto, de manera tal que no necesite estar en su lista de dependencias.

>Consejo
>
>Consulta este [pequeño demo](https://codesandbox.io/s/jvvkoo8pq3) y [este artículo](https://www.robinwieruch.de/react-hooks-fetch-data/) para aprender más sobre la obtención de datos con Hooks.

**Si por alguna razón _no puedes_ mover una funció dentro de un efecto, hay otras opciones:**

* **Puedes intentar mover esa función fuera de tu componente**. En ese caso, se garantiza que la función no referencie ningúna prop o estado, y además no necesita estar en la lista de dependencias.
* Si la función que estás llamando es un cálculo puro y es seguro llamarla mientras se renderiza, puedes **llamarla fuera del efecto,** y hacer que el efecto dependa del valor devuelto.
* Cómo último recurso, puedes **añadir una función a las dependencias del efecto, pero _envolver su definición_** en el Hook [`useCallback`](/docs/hooks-reference.html#usecallback). Esto asegura que no cambie en cada renderizado a menos que *sus propias* dependencias también cambien:

```js{2-5}
function ProductPage({ productId }) {
  // ✅ Envolver con useCallback para evitar que cambie en cada renderizado
  const fetchProduct = useCallback(() => {
    // ... Hace algo con productId ...
  }, [productId]); // ✅ All useCallback dependencies are specified

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct }) {
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ Se especifican todas las dependencias de useEffect
  // ...
}
```

Nota que en el ejemplo de arriba **necesitamos** mantener la función en la lista de dependencias. Esto asegura que un cambio en la prop `productId` de `ProductPage` automáticamente desencadena una nueva obtención de datos en el componente `ProductDetails`.

### ¿Qué puedo hacer si las dependencias de un efecto cambian con mucha frecuencia? {#what-can-i-do-if-my-effect-dependencies-change-too-often}

A veces, tu efecto puede estar usando un estado que cambia con demasiada frecuencia. Puedes estar tentado a omitir ese estado de una lista de dependencias, pero eso usualmente conduce a errores:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Este efecto depende del estado `count`
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Error: `count` no se especifica como una dependencia

  return <h1>{count}</h1>;
}
```

El conjunto vacío de dependencias, `[]`, significa que el efecto solo se ejecutará cuando el componente se monte, y no en cada rerenderizado. El problema es que dentro del *callback* de `setInterval`, el valor de `count` no cambia, porque hemos creado una clausura con el valor de `count` en `0` como estaba cuando la función *callback* del efecto se ejecutó. Cada segundo, esta función llama a `setCount(0 + 1)`, por lo que el contador `count` nunca sube de 1.

Especificar `[count]` como una lista de dependencias solucionaría el error, pero causaría que el intervalo se reiniciara con cada cambio. Efectivamente, cada `setInterval` tendría una oportunidad para ejecutarse antes de limpiarse (de forma similar a `setTimeout`). Esto puede no ser deseable. Para solucionarlo, podemos usar la [forma de actualización funcional de `setState`](/docs/hooks-reference.html#functional-updates). Nos permite especificar *cómo* el estado necesita cambiar sin referenciar el estado *actual*:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ Esto no depende en la variable `count` de afuera
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ Nuestro efecto no usa ninguna variable en el ámbito del componente

  return <h1>{count}</h1>;
}
```

(La identidad de la función `setCount` se garantiza que sea estable, por lo que es seguro omitirla.)

Ahora, el callback de `setInterval` se ejecuta una vez cada segundo, pero cada vez la llamada interna a `setCount` puede utilizar un valor actualizado para `count` (llamado `c` en este callback).

En casos más complejos (como en el que un estado depende de otro estado), intenta mover la lógica de actualización del estado fuera del efecto con el Hook [`useReducer`](/docs/hooks-reference.html#usereducer). [Este artículo](https://adamrackis.dev/state-and-use-reducer/) ofrece un ejemplo de cómo puedes hacerlo. **La identidad de la función `dispatch` de `useReducer` es siempre estable**, incluso si la función reductora se declara dentro del componente y lee sus props.

Como último recurso, si quieres algo como `this` en una clase, puedes [usar una ref](/docs/hooks-faq.html#is-there-something-like-instance-variables) para tener una variable mutable. Luego puedes escribirla y leerla. Por ejemplo:

```js{2-6,10-11,16}
function Example(props) {
  // Mantener las últimas props en una ref.
  const latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Leer la últimas props en cualquier momento
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // Este fecto nunca se vuelve a ejectuar
}
```

Únicamente haz esto si no puedes encontrar una mejor alternativa, dado que depender en mutaciones hace que los componenentes sean menos predecibles. Si hay un patrón específico que no se traduce bien, [abre una incidencia](https://github.com/facebook/react/issues/new) con un ejemplo de código ejecutable e intentaremos ayudar.

### ¿Cómo implemento shouldComponentUpdate? {#how-do-i-implement-shouldcomponentupdate}

Puedes envolver un componente de función con `React.memo`, para comparar sus props superficialmente.

```js
const Button = React.memo((props) => {
  // Tu Componente
});
```

No es un Hook porque no se compone como lo hacen los Hooks. `React.memo` es equivalente a `PureComponent`, pero solo compara las props. Puedes añadir un segundo argumento para especificar una función de comparación personalizada, que reciba las props viejas y las nuevas. Si retorna `true`, se obvia la actualización.

`React.memo` no compara el estado porque no existe un único objeto de estado para comparar. Pero puedes hacer los hijos puros también, o incluso [optimizar hijos individualmente con `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### ¿Cómo memorizar (memoize) los cálculos? {#how-to-memoize-calculations}

El Hook [`useMemo`](/docs/hooks-reference.html#usememo) te deja cachear cálculos entre múltiples renders "recordando" el cálculo anterior.

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Este código llama a `computeExpensiveValue(a, b)`. Pero si las dependencias `[a, b]` no han cambiado `useMemo` evita llamarle de nuevo y simplemente reusa el último valor que había retornado.

Recuerda que la función que se pasa a `useMemo` corre durante el renderizado. No hagas nada allí que no harías durante el renderizado. Por ejemplo, los efectos secundarios deberían estar en `useEffect`, no en `useMemo`.

**Puedes depender de `useMemo` como una mejora de desempeño, pero no como una garantía semántica.** En el futuro, React podría escoger "olvidar" algunos valores previamente memorizados y recalcularlos en el siguiente renderizado, por ejemplo para liberar memoria para los components que no se ven en pantalla. Escribe tu código de manera que pueda funcionar sin `useMemo` — y luego añádelo para mejorar el desempeño. Para casos extraños en los que un valor *nunca* deba ser recalculado, puedes inicializar una ref [de manera diferida](#how-to-create-expensive-objects-lazily).

Convenientemente `useMemo` también te deja saltar re-renderizados costosos de un hijo:

```js
function Parent({ a, b }) {
  // Solo re-renderizado si `a` cambia:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Solo re-renderizado si `b` cambia:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Ten en cuenta que este método no funcionará en un ciclo porque las llamadas a Hooks [no pueden](/docs/hooks-rules.html) ser puestas dentro de ciclos. Pero puedes extraer un componente separado para el item de la lista, y llamar `useMemo` allí.

### ¿Cómo crear objetos costosos de manera diferida (lazy)? {#how-to-create-expensive-objects-lazily}

`useMemo` te permite [memorizar un cálculo costoso](#how-to-memoize-calculations) si las dependencias son las mismas, sin embargo, solo funciona como un indicio, y no *garantiza* que el cálculo no se correrá de nuevo. Pero a veces necesitas estar seguro que un objeto sólo se cree una vez.

**El primer caso de uso común es cuando crear el estado inicial es costoso:**

```js
function Table(props) {
  // ⚠️ createRows() se llama en cada renderizado
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

Para evadir re-crear el estado inicial ignorado, podemos pasar una **función** a `useState`:

```js
function Table(props) {
  // ✅ createRows() solo se llama una vez.
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React solo llama a esta función durante el primer renderizado. Mira el [manual de referencia de la API de `useState`](/docs/hooks-reference.html#usestate).

**También podrías querer ocasionalmente evitar recrear el valor inicial de `useRef`.** Por ejemplo, tal vez quieres asegurarte de que alguna instancia de una clase imperativa solo se cree una vez:

```js
function Image(props) {
  // ⚠️ IntersectionObserver se crea en cada renderizado
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **no** acepta una sobrecarga especial con una función como `useState`. En cambio, puedes crear tu propia función que cree e inicialize el valor de manera diferida:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver se crea de manera diferida una vez.
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // Cuando lo necesites, llama a getObserver()
  // ...
}
```

Esto ayuda a evitar crear un objeto costoso hasta que sea realmente necesario por primera vez. Si usas Flow o TypeScript, puedes darle a `getOberver` un tipo no nulo por conveniencia.


### ¿Son los hooks lentos debido a la creación de funciones en el render? {#are-hooks-slow-because-of-creating-functions-in-render}

No. en los navegadores modernos, el desempeño de los closures comparado con el de las clases no difiere de manera significativa, exceptuando casos extremos.

Adicionalmente, considera que el diseño de los Hooks es más eficiente en un par de sentidos:

* Evitan gran parte de la complejidad (trabajo extra) que las clases requieren, como el costo de crear instancias de clase y ligar (bind) los manejadores de eventos en el constructor.

* **El código idiómatico usando Hooks no requiere el anidado profundo de componentes** que es prevalente en bases de código que utilizan componentes de orden superior, render props, y contexto. Con árboles de componentes más pequeños, React tiene menos trabajo que realizar.

Tradicionalmente, las preocupaciones de desempeño alrededor de funciones inline en React han estado relacionadas con como al pasar nuevos callbacks en cada renderizado rompe optimizaciones con `shouldComponentUpdate` en los componentes hijos. Los Hooks pueden resolver este problema desde tres ángulos diferentes.

* El Hook [`useCallback`](/docs/hooks-reference.html#usecallback) te permite mantener la misma referencia al callback entre re-renderizados, de manera que `shouldComponentUpdate` no se rompe.

    ```js{2}
    // No cambia a menos que `a` o `b` cambien
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* El Hook [`useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) hace más fácil controlar cuando se deberían actualizar hijos individualmente, reduciendo la necesidad de componentes puros.

* Finalmente el Hook [`useReducer`](/docs/hooks-reference.html#usereducer) reduce la necesidad de pasar callbacks profundamente, como se explica en la siguiente sección.

### ¿Cómo evitar pasar callbacks hacia abajo? {#how-to-avoid-passing-callbacks-down}

Nos hemos dado cuenta que la mayoría de personas no disfrutan pasar callbacks manualmente a través de cada nivel del árbol de componentes. A pesar de ser más explícito, se puede sentir como mucha "plomería".

En árboles de componentes muy grandes, una alternativa que recomendamos es pasar una función `dispatch` desde [`useReducer`](/docs/hooks-reference.html#usereducer) a través del contexto (Context):

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Nota: `dispatch` no cambia entre re-renderizados
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Todo hijo en el árbol dentro de `TodosApp` puede usar la función `dispatch` para pasar acciones hacia arriba, a  `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // Si queremos realizar una acción, podemos obtener dispatch del contexto.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

Esto es más conveniente desde la perspectiva de mantenimiento (no hay necesidad de seguir re-enviando callbacks) y resuelve el problema de los callbacks por completo. Pasar `dispatch` de esta manera es el patrón recomendado para actualizaciones profundas.

Ten en cuenta que aún puedes decidir si quieres pasar el *estado* de la aplicación hacia abajo como props (más explícito) o como contexto (más conveniente para actualizaciones profundas). Si usas el contexto para pasar el estado hacia abajo también, usa dos tipos diferentes de contexto -- el contexto de `dispatch` nunca cambia, así que los componentes que lean de el no necesitan re-renderizarse a menos que también necesiten el estado de la aplicación.

### ¿Cómo leer un valor que cambia frecuentemente desde useCallback? {#how-to-read-an-often-changing-value-from-usecallback}

>Nota
>
>Recomendamos [pasar `dispatch` a través del contexto](#how-to-avoid-passing-callbacks-down) en vez de callbacks individuales en las props. El siguiente método sólo se menciona para efectos de completitud y como una salida de emergencia.
>
>También ten en cuenta que este patrón puede causar problemas en el [modo concurrente](/blog/2018/03/27/update-on-async-rendering.html). Planeamos proveer alternativas más ergonómicas en el futuro, pero la solución más segura en este momento es siempre invalidar el callback si alguno de los valores de los que depende cambia.

En algunos extraños casos puede que necesites memorizar un callback con [`useCallback`](/docs/hooks-reference.html#usecallback), pero la memorización no funciona muy bien, debido a que la función interna debe ser re-creada muy seguido. Si la función que estás memorizando es un manejador de eventos y no se usa durante el renderizado, puedes utilizar [ref como una variable de estado](/docs/hooks-reference.html#usecallback) y guardar el último valor manualmente:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Se escribe en la referencia
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // See lee desde la ref
    alert(currentText);
  }, [textRef]); // No se recrea handleSubmit como [text] lo haría

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

Este es un patrón relativamente complicado, pero muestra que puedes utilizar esta salida de emergencia como optimización de ser necesario. Es más fácil de llevar si lo extraes a un Hook personalizado:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Será memorizado incluso si `text` cambia:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

En cualquier caso, **no recomendamos este patrón** y solo lo mostramos aquí para efectos de completitud. En cambio, es preferible [evitar pasar callbacks profundamente](#how-to-avoid-passing-callbacks-down).


## Bajo el capó {#under-the-hood}

### ¿Cómo asocia React las llamadas a los Hooks con Componentes? {#how-does-react-associate-hook-calls-with-components}

React está pendiente del componente que actualmente se está renderizando. Gracias a las [Reglas de los Hooks](/docs/hooks-rules.html), sabemos que los Hooks sólo son llamados desde componente de React (o Hooks personalizados -- los cuales también sólo son llamados desde componentes de React).

Hay una lista interna de "celdas de memoria" asociadas con cada componente. Son simplemente objetos de JavaScript donde podemos poner algunos datos. Cuando llamas un Hook como `useState()`, este lee la celda actual (o la inicializa durante el primer llamado), y luego mueve el puntero a la siguiente. Así es como llamados múltiples a `useState()` obtienen estados locales independientes.

### ¿Cuáles son los antecedentes de los Hooks? {#what-is-the-prior-art-for-hooks}

Los Hook sintetizan ideas de muchas fuentes diferentes:

* Nuestros viejos experimentos con APIs funcionales en el repositorio [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State).
* Los experimentos de la comunidad con las APIs de render props, incluyendo [Reactions Component](https://github.com/reactions/component) de [Ryan Florence](https://github.com/ryanflorence).
* [La palabra clave `adopt`](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) de [Dominic Gannaway](https://github.com/trueadm), que se propuso como sintaxis azucarada para las render props.
* Las variables y celdas de estado en [DisplayScript](http://displayscript.org/introduction.html).
* [Los componentes Reductores](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) en ReasonReact.
* [Las suscripciones](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) en Rx.
* [Los efectos algebraicos](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) en Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) propuso el diseño original de los Hooks, luego refinado por [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), y otros miembros del equipo de React.
