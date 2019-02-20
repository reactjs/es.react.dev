---
id: hooks-faq
title: Hooks FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

Los *Hooks* son una adición nueva en React 16.8. Te permiten user el estado y
otras características de React sin la necesidad de escribir una clase.

Esta página responde algunas de las preguntas frecuentes acerca de los [Hooks](/docs/hooks-overview.html).


<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[Estrategia de Adopción](#adoption-strategy)**
  * [¿Qué versiones de React incluyen Hooks?](#which-versions-of-react-include-hooks)
  * [¿Necesito reescribir todos mis componentes que ya sean clases?](#do-i-need-to-rewrite-all-my-class-components)
  * [¿Qué puedo hacer con Hooks que no pueda hacer con clases?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [¿Qué tanto de mi conocimiento de React se mantiene relevante?](#how-much-of-my-react-knowledge-stays-relevant)
  * [¿Debería usar Hooks, clases, o una mezcla de ambos?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [¿Cubren los Hooks todos los casos de uso de las clases?](#do-hooks-cover-all-use-cases-for-classes)
  * [¿Reemplazan los hooks a los render props y los Componente de Orden Superior (HOC)?](#do-hooks-replace-render-props-and-higher-order-components)
  * [¿Qué significan los Hooks para APIs populares como el connect de Redux, o React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [¿Funcionan los Hooks con tipado estático?](#do-hooks-work-with-static-typing)
  * [¿Cómo probar Componentes que usan Hooks?](#how-to-test-components-that-use-hooks)
  * [¿Qué hacen cumplir las reglas de lint?](#what-exactly-do-the-lint-rules-enforce)
* **[De las clases a los Hooks](#from-classes-to-hooks)**
  * [¿Cómo corresponden los métodos del ciclo de vida a los Hooks?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [¿Existe algo similar a las variables de instancia?](#is-there-something-like-instance-variables)
  * [¿Debería usar una o muchas variables de estado?](#should-i-use-one-or-many-state-variables)
  * [¿Puedo correr un efecto solo cuando ocurran actualizaciones?](#can-i-run-an-effect-only-on-updates)
  * [¿Cómo obtengo las props o el estado previo?](#how-to-get-the-previous-props-or-state)
  * [¿Cómo implemento getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [¿Hay algo similar a forceUpdate?](#is-there-something-like-forceupdate)
  * [¿Puedo crear una referencia (ref) a un Componente de función?](#can-i-make-a-ref-to-a-function-component)
  * [¿Qué significa [thing, setThing] = useState()?](#what-does-const-thing-setthing--usestate-mean)
* **[Optimizaciones de desempeño](#performance-optimizations)**
  * [¿Puedo saltarme un efecto durante las actualizaciones?](#can-i-skip-an-effect-on-updates)
  * [¿Cómo implemento shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [¿Cómo memorizar (memoize) los cálculos?](#how-to-memoize-calculations)
  * [¿Cómo crear objetos costosos de manera perezosa (lazy)?](#how-to-create-expensive-objects-lazily)
  * [¿Son los hooks lentos debido a la creación de funciones en el render?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [¿Cómo evitar pasar callbacks hacia abajo?](#how-to-avoid-passing-callbacks-down)
  * [¿Cómo leer un valor que cambia frecuentemente desde useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Bajo el capó](#under-the-hood)**
  * [¿Cómo asocia React las llamadas a los Hooks con Componentes?](#how-does-react-associate-hook-calls-with-components)
  * [¿Cuáles son los antecedentes de los Hooks?](#what-is-the-prior-art-for-hooks)

## Estrategia de Adopción {#adoption-strategy}

### ¿Qué versiones de React incluyen Hooks? {#which-versions-of-react-include-hooks}

Empezando con React 16.8.0, se incluye una implementación estable de Hooks para:

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Nótese que **para habilitar los Hooks, todos los paquetes de React deben estar en la versión 16.8.0 o superior**. Los Hooks no van a funcionar si olvidas, por ejemplo, actualizar React DOM.

React Native soportará Hooks completamente en su próxima versión estable.

### ¿Necesito reescribir todos mis componentes que ya sean clases? {#do-i-need-to-rewrite-all-my-class-components}

No. [No hay planes](/docs/hooks-intro.html#gradual-adoption-strategy) de remover las clases de React -- todos debemos seguir lanzando productos y no nos podemos dar el lujo de reescribir. Recomendamos usar Hooks en tu código nuevo.

### ¿Qué puedo hacer con Hooks que no pueda hacer con clases? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Los Hooks ofrecen una nueva, poderosa y expresiva forma de reusar funcionalidad entre componentes. La sección ["Construyendo tus Propios Hooks"](/docs/hooks-custom.html) provee un vistazo a las posibilidades. [Este artículo](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) por uno de los miembros clave del equipo de React se adentra más en las nuevas capacidades que proveen los Hooks.

### ¿Qué tanto de mi conocimiento de React se mantiene relevante? {#how-much-of-my-react-knowledge-stays-relevant}

Los Hooks son una manera más directa de usar la características de React que ya conoces -- como el estado, ciclo de vida, contexto, y las referencias (refs). No cambian de manera fundamental el funcionamiento de React, y tu conocimiento de componentes, props, y el flujo de datos de arriba hacia abajo sigue siendo igual de relevante.

Los Hooks tienen también su propia curva de aprendizaje. Si hay algo faltante en esta documentación, [levanta un issue](https://github.com/reactjs/es.reactjs.org/issues/new) y trataremos de ayudar.

### ¿Debería usar Hooks, clases, o una mezcla de ambos? {#should-i-use-hooks-classes-or-a-mix-of-both}

Cuando estés listo, te recomendamos empezar a usar Hooks en los nuevos componentes que escribas. Asegúrate que todo tu equipo esté de acuerdo en usarlos, y que estén familiarizados con esta documentación. No recomendamos reescribir tus classes exitentes a menos de que hayas planeado reescribirlas de cualquier manera (por ejemplo para arreglar bugs).

No puedes usar Hooks *dentro* de un Componente de Clase, pero definitivamente puedes mezclar componentes de clase y componentes de función con Hooks en un mismo árbol. Si un componente es una clase, o una función que utiliza Hooks es un detalle de implementación del Componente. A largo plazo, experamos que los Hooks sean la manera más usada de escribir Componentes de React.

### ¿Cubren los Hooks todos los casos de uso de las clases? {#do-hooks-cover-all-use-cases-for-classes}

Nuestra meta es que los Hooks cubran todos los casos de uso de las clases lo más pronto posible. En este momento no existen equivalentes de los ciclos de vida poco comunes `getSnapshotBeforeUpdate` y `componentDidCatch`, pero planeamos añadirlos pronto.

Los Hooks aún son jóvenes, y algunas librerías  de terceros podrían no ser compatibles con Hooks de momento.

### ¿Reemplazan los hooks a los render props y los Componente de Orden Superior (HOC)? {#do-hooks-replace-render-props-and-higher-order-components}

En muchas ocasiones, render props y los componentes de orden superior, renderizan un sólo hijo. Pensamos que los Hooks son una forma más sencilla de soportar este caso de uso. Aún hay lugar para ambos patrones (por ejemplo, un scroller virtual podría tener un prop `renderItem`, o un conmponente que sea un contenedor visual podría tener su propia estructura de DOM). Pero en la mayoría de los casos, los Hooks serán suficiente y ayudaran a reducir la anidación en tu arbol.

### ¿Qué significan los Hooks para APIs populares como el connect de Redux, o React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Puedes seguir usando exactamente las mismas APIs que siempre has usado, seguirán funcionando.

En el futuro, nuevas versiones de estas librerías también podrían exportar Hooks personalizados como `useRedux()` or `useRouter()`, que te permitan usar las mismas características sin necesidad de usar componentes que los envuelvan.

### ¿Funcionan los Hooks con tipado estático? {#do-hooks-work-with-static-typing}

Los Hooks fueron diseñados con el tipado estático en mente. Al ser funciones, son más fáciles de tipar que patrones como los componentes de orden superior (HOC). Las últimas definiciones para React de TypeScript y Flow incluyen soporte para Hooks.

Aún más importante, los Hooks personalizados tienen el poder de restringir la API de React si quisieras tiparlas de una manera más estricta. React te da las primitivas, pero puedes combinarlas de distintas maneras de las que proveemos por defecto.

### ¿Cómo probar Componentes que usan Hooks? {#how-to-test-components-that-use-hooks}

Desde el punto de vista de React, un componente que use Hooks, sigue siendo un componente normal. Si las herramientas de prueba que utilizas no dependen de los mecanismos internos de React, probar los componentes que usen Hooks, no debería ser diferente de probar cualquier otro componente.

Por ejemplo, asumamos que tenemos este componente de Conteo:

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

Para reducir el boilerplate, recomendamos usar [`react-testing-library`](https://git.io/react-testing-library) que está diseñada para promover pruebas que utilicen tus componentes como lo harían los usuarios finales.

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

* `render`: Es el cuerpo de el componente de función en sí.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: El [Hook `useEffect`](/docs/hooks-reference.html#useeffect) puede expresar todas las combinaciones de estos (incluyendo casos [poco](#can-i-skip-an-effect-on-updates) [comunes](#can-i-run-an-effect-only-on-updates)).

* `componentDidCatch` y `getDerivedStateFromError`: Aún no hay Hooks equivalentes a estos métodos, pero serán añadidos pronto.

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

Conceptualmente, puedes pensar en los refs como símiles a las variables de instancia en una clase. A menos que estés utilizando inicialización perezosa ([lazy initialization](#how-to-create-expensive-objects-lazily)), evita setear referencias durante el renderizado -- esto podría llevar a comportamiento inesperado. En cambio, generalmente querrás modificar las referencias en manejadores de eventos y efectos.

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

Si extrañas esta mezcla automática, puedes escribir un Hook personalizado `useLegacyState` que mezcle las actualizaciones al objeto de estado. Sin embargo, **Recomendamos dividir el estado en múltiples variables de estado, basado en los valores que tienden a cambiar juntos**.

Por ejemplo, podríamos dividir el estado de nuestor componente en objetos `position` y `size`, y siempre reemplazar `position` sin la necesidad de mezclar.

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

Ambas aproximaciones, poner todo el estado en un solo llamdo a `useState`, y usar un llamado a `useState` por cada campo, pueden funcionar. Los Componentes suelen ser más legibles cuando encuentras un balance entre ambos extremos, y agrupas partes del estado relacionadas en unas cuantas variables de estado independientes. Si la lógica del estado se vuelve muy compleja, recomendamos [manejarla con un reductor](/docs/hooks-reference.html#usereducer), o un Hook personalizado.

### ¿Puedo correr un efecto solo cuando ocurran actualizaciones? {#can-i-run-an-effect-only-on-updates}

Este es un caso de uso poco común. Si lo necesitas, puedes usar [una referencia mutable](#is-there-something-like-instance-variables) para guardar manualmente una bandera booleana que corresponde a si es el primer renderizado, o renderizados subsecuentes, luego puedes verificar la bandera en tu efecto. (Si te encuentras haciendo esto regularmente podrías crear un Hook Personalizado).

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

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
  ```

Es posible que en el futuro React provea un `usePrevious` Hook por defecto, ya que es un caso de uso relativamente común.

Mira también [el patrón recomendado para un estado derivado](#how-do-i-implement-getderivedstatefromprops).

### ¿Cómo implemento getDerivedStateFromProps??

A pesar de que probablemente [no lo necesites](/blog/2018/06/07/you-probably-dont-need-derived-state.html), en los pocos casos en los que sea necesario (por ejemplo implementando un componente `<Transition>`), puedes actualizar el estado en medio de la renderización. React correrá de nuevo el componente con el estado actualizado inmediatamente después de correr el primer renderizaod, así que no es costoso.

Aquí, guardamos el valor anterior del prop `row` en una variable de estado para poder comparar:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

Esto puede parecer extraño en un principio, pero una actualización durante el renderizado es exactamente lo que siempre ha sido `getDerivedStateFromProps` conceptualmente.

### ¿Hay algo similar a forceUpdate?

Los Hooks `useState` y `useReducer` [evitan las actualizaciones](/docs/hooks-reference.html#bailing-out-of-a-state-update) si el siguiente valor es igual al anterior. Mutar el estado y llamar a `setState` no causarán un re-renderizado.

Usualmente, no deberías mutar el estado local en React. Sin embargo, como una salida de emergencia, puedes usar un contador incremental para forzar un re-renderizado incluso si el estado no ha cambiado:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Intenta evitar este patrón de ser posible.

### ¿Puedo crear una referencia (ref) a un Componente de función?

A pesar de que no deberías necesitar esto muy seguido, podrías exponer algunos métodos imperativos a un componente padre con con el Hook [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### ¿Qué significa [thing, setThing] = useState()?

Si no estás familiarizado con esta sintaxis, mira la [explicación](/docs/hooks-state.html#tip-what-do-square-brackets-mean) en la documentación de los Hooks de estado.


## Performance Optimizations

### Can I skip an effect on updates?

Yes. See [conditionally firing an effect](/docs/hooks-reference.html#conditionally-firing-an-effect). Note that forgetting to handle updates often [introduces bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), which is why this isn't the default behavior.

### How do I implement `shouldComponentUpdate`?

You can wrap a function component with `React.memo` to shallowly compare its props:

```js
const Button = React.memo((props) => {
  // your component
});
```

It's not a Hook because it doesn't compose like Hooks do. `React.memo` is equivalent to `PureComponent`, but it only compares props. (You can also add a second argument to specify a custom comparison function that takes the old and new props. If it returns true, the update is skipped.)

`React.memo` doesn't compare state because there is no single state object to compare. But you can make children pure too, or even [optimize individual children with `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).


### How to memoize calculations?

The [`useMemo`](/docs/hooks-reference.html#usememo) Hook lets you cache calculations between multiple renders by "remembering" the previous computation:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

This code calls `computeExpensiveValue(a, b)`. But if the inputs `[a, b]` haven't changed since the last value, `useMemo` skips calling it a second time and simply reuses the last value it returned.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance. (For rare cases when a value must *never* be recomputed, you can [lazily initialize](#how-to-create-expensive-objects-lazily) a ref.)

Conveniently, `useMemo` also lets you skip an expensive re-render of a child:

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Note that this approach won't work in a loop because Hook calls [can't](/docs/hooks-rules.html) be placed inside loops. But you can extract a separate component for the list item, and call `useMemo` there.

### How to create expensive objects lazily?

`useMemo` lets you [memoize an expensive calculation](#how-to-memoize-calculations) if the inputs are the same. However, it only serves as a hint, and doesn't *guarantee* the computation won't re-run. But sometimes need to be sure an object is only created once.

**The first common use case is when creating the initial state is expensive:**

```js
function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

To avoid re-creating the ignored initial state, we can pass a **function** to `useState`:

```js
function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React will only call this function during the first render. See the [`useState` API reference](/docs/hooks-reference.html#usestate).

**You might also occasionally want to avoid re-creating the `useRef()` initial value.** For example, maybe you want to ensure some imperative class instance only gets created once:

```js
function Image(props) {
  // ⚠️ IntersectionObserver is created on every render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **does not** accept a special function overload like `useState`. Instead, you can write your own function that creates and sets it lazily:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver is created lazily once
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // When you need it, call getObserver()
  // ...
}
```

This avoids creating an expensive object until it's truly needed for the first time. If you use Flow or TypeScript, you can also give `getObserver()` a non-nullable type for convenience.


### Are Hooks slow because of creating functions in render?

No. In modern browsers, the raw performance of closures compared to classes doesn't differ significantly except in extreme scenarios.

In addition, consider that the design of Hooks is more efficient in a couple ways:

* Hooks avoid a lot of the overhead that classes require, like the cost of creating class instances and binding event handlers in the constructor.

* **Idiomatic code using Hooks doesn't need the deep component tree nesting** that is prevalent in codebases that use higher-order components, render props, and context. With smaller component trees, React has less work to do.

Traditionally, performance concerns around inline functions in React have been related to how passing new callbacks on each render breaks `shouldComponentUpdate` optimizations in child components. Hooks approach this problem from three sides.

* The [`useCallback`](/docs/hooks-reference.html#usecallback) Hook lets you keep the same callback reference between re-renders so that `shouldComponentUpdate` continues to work:

    ```js{2}
    // Will not change unless `a` or `b` changes
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* The [`useMemo` Hook](/docs/hooks-faq.html#how-to-memoize-calculations) makes it easier to control when individual children update, reducing the need for pure components.

* Finally, the `useReducer` Hook reduces the need to pass callbacks deeply, as explained below.

### How to avoid passing callbacks down?

We've found that most people don't enjoy manually passing callbacks through every level of a component tree. Even though it is more explicit, it can feel like a lot of "plumbing".

In large component trees, an alternative we recommend is to pass down a `dispatch` function from [`useReducer`](/docs/hooks-reference.html#usereducer) via context:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Tip: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Any child in the tree inside `TodosApp` can use the `dispatch` function to pass actions up to `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

This is both more convenient from the maintenance perspective (no need to keep forwarding callbacks), and avoids the callback problem altogether. Passing `dispatch` down like this is the recommended pattern for deep updates.

Note that you can still choose whether to pass the application *state* down as props (more explicit) or as context (more convenient for very deep updates). If you use context to pass down the state too, use two different context types -- the `dispatch` context never changes, so components that read it don't need to rerender unless they also need the application state.

### How to read an often-changing value from `useCallback`?

>Note
>
>We recommend to [pass `dispatch` down in context](#how-to-avoid-passing-callbacks-down) rather than individual callbacks in props. The approach below is only mentioned here for completeness and as an escape hatch.
>
>Also note that this pattern might cause problems in the [concurrent mode](/blog/2018/03/27/update-on-async-rendering.html). We plan to provide more ergonomic alternatives in the future, but the safest solution right now is to always invalidate the callback if some value it depends on changes.

In some rare cases you might need to memoize a callback with [`useCallback`](/docs/hooks-reference.html#usecallback) but the memoization doesn't work very well because the inner function has to be re-created too often. If the function you're memoizing is an event handler and isn't used during rendering, you can use [ref as an instance variable](#is-there-something-like-instance-variables), and save the last committed value into it manually:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

This is a rather convoluted pattern but it shows that you can do this escape hatch optimization if you need it. It's more bearable if you extract it to a custom Hook:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
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

  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

In either case, we **don't recommend this pattern** and only show it here for completeness. Instead, it is preferable to [avoid passing callbacks deep down](#how-to-avoid-passing-callbacks-down).


## Under the Hood

### How does React associate Hook calls with components?

React keeps track of the currently rendering component. Thanks to the [Rules of Hooks](/docs/hooks-rules.html), we know that Hooks are only called from React components (or custom Hooks -- which are also only called from React components).

There is an internal list of "memory cells" associated with each component. They're just JavaScript objects where we can put some data. When you call a Hook like `useState()`, it reads the current cell (or initializes it during the first render), and then moves the pointer to the next one. This is how multiple `useState()` calls each get independent local state.

### What is the prior art for Hooks?

Hooks synthesize ideas from several different sources:

* Our old experiments with functional APIs in the [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) repository.
* React community's experiments with render prop APIs, including [Ryan Florence](https://github.com/ryanflorence)'s [Reactions Component](https://github.com/reactions/component).
* [Dominic Gannaway](https://github.com/trueadm)'s [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) proposal as a sugar syntax for render props.
* State variables and state cells in [DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) in ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) in Rx.
* [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) in Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) came up with the original design for Hooks, later refined by [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), and other members of the React team.
