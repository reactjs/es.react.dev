---
id: hooks-reference
title: Referencia de la API de los Hooks
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

Los *Hooks* son una nueva incorporación en React 16.8. Te permiten usar estado y otras características de React sin escribir una clase.

Esta página describe las API para los Hooks incorporados en React.

Si los Hooks son nuevos para ti, es posible que desees revisar primero [la descripción general](/docs/hooks-overview.html). También puedes encontrar información útil en la sección de [preguntas frecuentes](/docs/hooks-faq.html).

- [Hooks básicos](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Hooks adicionales](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## Hooks básicos {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

Devuelve un valor con estado y una función para actualizarlo.

Durante el renderizado inicial, el estado devuelto (`state`) es el mismo que el valor pasado como primer argumento (`initialState`).

La función `setState` se usa para actualizar el estado. Acepta un nuevo valor de estado y sitúa en la cola una nueva renderización del componente.

```js
setState(newState);
```

En las renderizaciones siguientes, el primer valor devuelto por `useState` será siempre el estado más reciente después de aplicar las actualizaciones.

>Nota
>
>React garantiza que la identidad de la función `setState` es estable y no cambiará en subsecuentes renderizados. Es por eso que es seguro omitirla de la lista de dependencias de `useEffect` o `useCallback`.

#### Actualizaciones funcionales {#functional-updates}

Si el nuevo estado se calcula utilizando el estado anterior, puede pasar una función a `setState`. La función recibirá el valor anterior y devolverá un valor actualizado. Aquí hay un ejemplo de un componente contador que usa ambas formas de `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

Los botones "+" y "-" usan la forma funcional, porque el valor actualizado se basa en el valor anterior. Pero el botón "Reset" usa la forma normal, porque siempre vuelve a establecer la cuenta al valor inicial.

Si tu función de actualización retorna el mismo valor que el valor del estado actual, el renderizado subsecuente será omitido completamente.

> Nota
>
> A diferencia del método `setState` que se encuentra en los componentes de la clase,`useState` no combina automáticamente los objetos. Puede replicar este comportamiento combinando la función de actualizador de función con la sintaxis de propagación de objetos:
>
> ```js
> setState(prevState => {
>   // Object.assign también funcionaría
>   return {...prevState, ...updatedValues};
> });
> ```
>
> Otra opción es `useReducer`, que es más adecuada para administrar objetos de estado que contienen múltiples subvalores.

#### Inicialización gradual {#lazy-initial-state}

El argumento `initialState` es el estado utilizado durante el render inicial. En renderizados posteriores, se ignora. Si el estado inicial es el resultado de un cálculo costoso, puede proporcionar una función en su lugar, que se ejecutará solo en el render inicial:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### Evitar una actualización del estado {#bailing-out-of-a-state-update}

Si se actualiza un Hook de estado con el mismo valor que el estado actual, React evitará renderizar los hijos y disparar los efectos. (React utiliza el [algoritmo de comparación `Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/is#Description)).

Recuerda que React puede necesitar renderizar de nuevo ese componente en específico antes de evitarlo. Esto no debería ser un problema ya que React no irá innecesariamente "más profundo" en el árbol. Si estás realizando cálculos costosos mientras renderizas, puedes optimizarlos con `useMemo`.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

Acepta una función que contiene código imperativo, posiblemente código efectivo.

Las mutaciones, suscripciones, temporizadores, registro y otros efectos secundarios no están permitidos dentro del cuerpo principal de un componente funcional (denominado como _render phase_ de React). Si lo hace, dará lugar a errores confusos e inconsistencias en la interfaz de usuario.

En su lugar, use `useEffect`. La función pasada a `useEffect` se ejecutará después de que el renderizado es confirmado en la pantalla. Piense en los efectos como una escotilla de escape de React del mundo puramente funcional al mundo imperativo.

Por defecto, los efectos se ejecutan después de cada renderizado completado, pero puede elegir ejecutarlo [solo cuando ciertos valores han cambiado](#conditionally-firing-an-effect).

#### Limpiando un efecto {#cleaning-up-an-effect}

A menudo, los efectos crean recursos que deben limpiarse antes de que el componente salga de la pantalla, como una suscripción o un ID de temporizador. Para hacer esto, la función pasada a `useEffect` puede devolver una función de limpieza. Por ejemplo, para crear una suscripción:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Limpiar la suscripción
    subscription.unsubscribe();
  };
});
```

  La función de limpieza se ejecuta antes de que el componente se elimine de la interfaz de usuario para evitar pérdidas de memoria. Además, si un componente se procesa varias veces (como suele hacer), el **efecto anterior se limpia antes de ejecutar el siguiente efecto**. En nuestro ejemplo, esto significa que se crea una nueva suscripción en cada actualización. Para evitar disparar un efecto en cada actualización, consulte la siguiente sección.

#### Tiempo de los efectos {#timing-of-effects}

A diferencia de `componentDidMount` y` componentDidUpdate`, la función enviada a `useEffect` se inicia **después** de la disposición y pintada de la página, durante un evento diferido. Esto lo hace adecuado para los muchos efectos secundarios comunes, como la configuración de suscripciones y los controladores de eventos, porque la mayoría de los tipos de trabajo no deben impedir que el navegador actualice la pantalla.

Sin embargo, no todos los efectos pueden ser diferidos. Por ejemplo, una mutación de DOM que es visible para el usuario debe ejecutarse de manera sincrónica antes del siguiente render para que el usuario no perciba una inconsistencia visual. (La distinción es conceptualmente similar a la de los listeners de eventos pasivos y de los activos). Para estos tipos de efectos, React proporciona un Hook adicional llamado [`useLayoutEffect`](#uselayouteffect). Tiene la misma firma que `useEffect` y solo difiere de este último en cuándo se ejecuta.

Aunque `useEffect` se aplaza hasta después de que el navegador se haya pintado, se garantiza que se activará antes de cualquier nuevo render. React siempre eliminará los efectos de un render anterior antes de comenzar una nueva actualización.

#### Disparar un efecto condicionalmente. {#conditionally-firing-an-effect}

El comportamiento predeterminado para los efectos es ejecutar el efecto después de cada renderizado que se completa. De esa manera, siempre se recrea un efecto si cambia una de sus dependencias.

Sin embargo, esto puede ser excesivo en algunos casos, como el ejemplo de suscripción de la sección anterior. No necesitamos crear una nueva suscripción en cada actualización, solo si las propiedades de `source` han cambiado.

Para implementar esto, pase un segundo argumento a `useEffect` que es el conjunto de valores de los que depende el efecto. Nuestro ejemplo actualizado se verá así:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Ahora la suscripción solo se volverá a crear cuando cambie `props.source`.

> Nota
>
>Si usas esta optimización, asegúrate de que incluyes **todos los valores del ámbito del componente (como props y estado) que cambien a lo largo del tiempo y que sean usados por el efecto**. De otra forma, tu código referenciará valores obsoletos de renderizados anteriores. Aprende más [cómo tratar con funciones](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) y [qué hacer cuando el array cambia con mucha frecuencia](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Si quieres ejecutar un efecto y sanearlo solamente una vez (al montar y desmontar), puedes pasar un array vacío (`[]`) como segundo argumento. Esto le indica a React que el efecto no depende de *ningún* valor proviniente de las props o el estado, de modo que no necesita volver a ejecutarse. Esto no se gestiona como un caso especial, obedece directamente al modo en el que siempre funcionan los arrays. 
>
>Si pasas un array vacío (`[]`), las props y el estado dentro del efecto siempre tendrán sus valores iniciales. Si bien pasar `[]` como segundo argumento se acerca al conocido modelo mental de `componentDidMount` y `componentWillUnmount`, a menudo hay [mejores](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [soluciones](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) para evitar volver a ejecutar los efectos con demasiada frecuencia. Además, no olvides que React pospone la ejecución de `useEffect` hasta que el navegador finaliza el trazado, de modo que hacer algún trabajo extra no es tan problemático.
>
>
>Recomendamos usar la regla [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) que forma parte de nuestro paquete [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Esta regla advierte cuando las dependencias se especifican incorrectamente y sugiere una solución.

El arreglo de entradas no se pasa como argumentos a la función de efecto. Sin embargo, conceptualmente, eso es lo que representan: cada valor al que se hace referencia dentro de la función de efecto también debería aparecer en el arreglo de entradas. En el futuro, un compilador lo suficientemente avanzado podría crear este arreglo automáticamente.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

Acepta un objeto de contexto (el valor devuelto de `React.createContext`) y devuelve el valor de contexto actual. El valor actual del contexto es determinado por la propiedad `value` del `<MyContext.Provider>` ascendentemente más cercano en el árbol al componente que hace la llamada.

Cuando el `<MyContext.Provider>` ascendentemente más cercano en el árbol se actualiza, el Hook activa una renderización con el `value` más reciente del contexto pasado a ese proveedor `MyContext`. Incluso sí un ancestro utiliza [`React.memo`](/docs/react-api.html#reactmemo) o [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate), una nueva renderización aún pasará empezando con el componente en si mismo usando `useContext`.

No olvides que el argumento enviado a `useContext` debe ser el *objeto del contexto en sí mismo*:

 * **Correcto:** `useContext(MyContext)`
 * **Incorrecto:** `useContext(MyContext.Consumer)`
 * **Incorrecto:** `useContext(MyContext.Provider)`

Un componente que llama a `useContext` siempre se volverá a renderizar cuando el valor del contexto cambie. Si volver a renderizar el componente es costoso, puedes [optimizar esto usando memorización](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>Consejo
>
>Si estás familiarizado con el API de contexto antes de Hooks, `useContext(MyContext)` es el equivalente a `static contextType = MyContext` en una clase, o a `<MyContext.Consumer>`.
>
>`useContext(MyContext)` solo te permite *leer* el contexto y suscribirte a sus cambios. Aún necesitas un `<MyContext.Provider>` arriba en el árbol para *proveer* el valor para este contexto.

**Poniendo todo junto con Context.Provider**

```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

Este ejemplo está modificado para Hooks a partir del ejemplo anterior en de la [guía avanzada de Context](/docs/context.html), donde puedes encontrar más información sobre cuando y cómo usar Context.

## Hooks adicionales {#additional-hooks}

Los siguientes Hooks son variantes de los básicos de la sección anterior o solo son necesarios para casos extremos específicos. No te estreses por aprenderlos por adelantado.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Una alternativa a [`useState`](#usestate). Acepta un reducer de tipo `(state, action) => newState` y devuelve el estado actual emparejado con un método `dispatch`. (Si está familiarizado con Redux, ya sabe cómo funciona).

`useReducer` a menudo es preferible a `useState` cuando se tiene una lógica compleja que involucra múltiples subvalores o cuando el próximo estado depende del anterior. `useReducer` además te permite optimizar el rendimiento para componentes que activan actualizaciones profundas, porque [puedes pasar hacia abajo `dispatch` en lugar de *callbacks*](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Aquí está el ejemplo del contador de la sección [`useState`], reescrito para usar un reductor:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>Nota
>
>React garantiza que la identidad de la función `dispatch` es estable y no cambiará en subsecuentes renderizados. Es por eso que es seguro omitirla de la lista de dependencias de `useEffect` o `useCallback`.

#### Especificar el estado inicial {#specifying-the-initial-state}

Hay dos formas diferentes de inicializar el estado de `useReducer`. Puedes elegir uno u otro dependiendo de tu caso. La forma más simple para pasar el estado inicial es como un segundo argumento:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Nota
>
>React no utiliza la convención del argumento `state = initialState` popularizada por Redux. El valor inicial a veces necesita tener una dependencia en las props y por lo tanto tanto se especifica en la llamada al Hook. Si te parece muy importante, puedes llamar a `useReducer(reducer, undefined, reducer)` para emular el comportamiento de Redux, pero no se recomienda

#### Inicialización diferida {#lazy-initialization}

También puedes crear el estado inicial de manera diferida. Para hacerlo, le puedes pasar una función `init` como tercer argumento. El estado inicial será establecido como `init(initialArg)`.

Esto te permite extraer la lógica para calcular el estado inicial fuera del reductor. También es útil para reiniciar el estado luego en respuesta a una acción:

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### Evitar un *dispatch* {#bailing-out-of-a-dispatch}

Si devuelves el mismo valor del estado actual desde un Hook reductor, React evitará renderizar los hijos y disparar efectos. (React utiliza el [algoritmo de comparación `Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/is#Description)).

Ten en cuenta que React podría aún necesitar renderizar nuevamente ese componente específico antes de evitar el renderizado. Esto no debería ser una preocupación ya que React no va "más adentro" del árbol de forma innecesaria. Si estás haciendo cálculos muy costosos mientras renderizas, puedes optimizarlos con `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Devuelve un callback [memorizado](https://en.wikipedia.org/wiki/Memoization).

Pasa un callback en línea y un arreglo de dependencias. `useCallback` devolverá una versión memorizada del callback que solo cambia si una de las dependencias ha cambiado. Esto es útil cuando se transfieren callbacks a componentes hijos optimizados que dependen de la igualdad de referencia para evitar renders innecesarias (por ejemplo, `shouldComponentUpdate`).

`useCallback(fn, deps)` es igual a `useMemo(() => fn, deps)`.

> Nota
>
> El arreglo de dependencias no se pasa como argumentos al callback. Sin embargo, conceptualmente, eso es lo que representan: cada valor al que se hace referencia dentro del callback también debe aparecer en el arreglo de dependencias. En el futuro, un compilador lo suficientemente avanzado podría crear este arreglo automáticamente.
>
>Recomendamos usar la regla [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) que forma parte de nuestro paquete [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Esta regla advierte cuando las dependencias se especifican incorrectamente y sugiere una solución.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Devuelve un valor [memorizado](https://en.wikipedia.org/wiki/Memoization).

Pasa una función de "crear" y un arreglo de dependencias. `useMemo` solo volverá a calcular el valor memorizado cuando una de las dependencias haya cambiado. Esta optimización ayuda a evitar cálculos costosos en cada render.

Recuerde que la función pasada a `useMemo` se ejecuta durante el renderizado. No hagas nada allí que normalmente no harías al renderizar. Por ejemplo, los efectos secundarios pertenecen a `useEffect`, no a` useMemo`.

Si no se proporciona un arreglo, se calculará un nuevo valor en cada renderizado.

**Puede confiar en `useMemo` como una optimización del rendimiento, no como una garantía semántica.** En el futuro, React puede elegir "olvidar" algunos valores previamente memorizados y recalcularlos en el próximo renderizado, por ejemplo para liberar memoria para componentes fuera de pantalla. Escribe tu código para que aún funcione sin `useMemo` - y luego agrégalo para optimizar el rendimiento.

> Nota
>
> El arreglo de dependencias no se pasa como argumentos a la función. Sin embargo, conceptualmente, eso es lo que representan: cada valor al que se hace referencia dentro de la función también debe aparecer en el arreglo de dependencias. En el futuro, un compilador lo suficientemente avanzado podría crear este arreglo automáticamente.
>
>Recomendamos usar la regla [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) que forma parte de nuestro paquete [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Esta regla advierte cuando las dependencias se especifican incorrectamente y sugiere una solución.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` devuelve un objeto *ref* mutable cuya propiedad `.current` se inicializa con el argumento pasado (`initialValue`). El objeto devuelto se mantendrá persistente durante la vida completa del componente.

Un caso de uso común es para acceder a un hijo imperativamente:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` apunta al elemento de entrada de texto montado
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

En esencia, `useRef` es como una "caja" que puedes mantener en una variable mutable en su propiedad `.current`.

Puede que estes familiarizado con las referencias principalmente como un medio para [acceder al DOM](/docs/refs-and-the-dom.html). Si pasas un objeto de referencia a React con `<div ref={myRef} />`, React configurará su propiedad `.current` al nodo del DOM correspondiente cuando sea que el nodo cambie.

Sin embargo, `useRef()` es útil para más que el atributo `ref`. Es [conveniente para mantener cualquier valor mutable](/docs/hooks-faq.html#is-there-something-like-instance-variables) que es similiar a como usarías campos de instancia en las clases.

Esto funciona debido a que `useRef()` crea un objeto JavaScript plano. La única diferencia entre `useRef()` y crear un objeto `{current: ...}` por ti mismo es que `useRef` te dará el mismo objeto de referencia en cada renderizado.

Ten en cuenta que `useRef` *no* notifica cuando su contenido cambia. Mutar la propiedad `.current` no causa otro renderizado. Si quieres correr algún codigo cuando React agregue o quite una referencia de un nodo del DOM, puede que quieras utilizar en su lugar una [referencia mediante callback](/docs/hooks-faq.html#how-can-i-measure-a-dom-node).


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` personaliza el valor de instancia que se expone a los componentes padres cuando se usa` ref`. Como siempre, el código imperativo que usa refs debe evitarse en la mayoría de los casos. `useImperativeHandle` debe usarse con [`forwardRef`](/docs/react-api.html#reactforwardref):

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

En este ejemplo, un componente padre que muestra `<FancyInput ref={inputRef} />` podría llamar a `inputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

La firma es idéntica a `useEffect`, pero se dispara de forma síncrona después de todas las mutaciones de DOM. Use esto para leer el diseño del DOM y volver a renderizar de forma sincrónica. Las actualizaciones programadas dentro de `useLayoutEffect` se vaciarán sincrónicamente, antes de que el navegador tenga la oportunidad de pintar.

Prefiera el `useEffect` estándar cuando sea posible para evitar el bloqueo de actualizaciones visuales.

> Consejo
>
> Sí estas migrando código de un componente de clase, recuerda que `useLayoutEffect` se activa en la misma fase que `componentDidMount` y `componentDidUpdate`. Sin embargo, **recomendamos empezar con `useEffect` primero** y solo intentar con `useLayoutEffect` si el anterior causa problemas.
>
> Si usas renderizado mediante servidor, ten en cuenta que *ninguno* `useLayoutEffect` o `useEffect` pueden correr hasta que el JavaScript sea descargado. Esto es por lo que React advierte cuando un componente renderizado mediante servidor contiene `useLayoutEffect`. Para corregir esto, puedes o bien mover la lógica a `useEffect` (si no es necesaria para el primer renderizado), o retrasar mostrar el componente hasta después de que el cliente haya renderizado (si el HTML parece roto hasta que `useLayoutEffect` corre). 
>
> Para excluir un componente que necesita efectos de marco del HTML renderizado mediante servidor, renderízalo condicionalmente con `showChild && <Child />` y retrasa mostrarlo con `useEffect(() => { setShowChild(true); }, [])`. De esta manera, la interfaz de usuario no parecerá rota antes de la hidratación.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` puede usarse para mostrar una etiqueta para Hooks personalizados en React DevTools.

Por ejemplo, considera el Hook personalizado `useFriendStatus` descrito en ["Construyendo sus propios Hooks"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Mostrar una etiqueta en DevTools junto a este Hook
  // por ejemplo: "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> Consejo
>
> No recomendamos agregar valores de depuración a cada Hook personalizado. Es más valioso para los Hooks personalizados que forman parte de  bibliotecas compartidas.

#### Aplazar el formato de los valores de depuración {#defer-formatting-debug-values}

En algunos casos, formatear un valor para mostrar puede ser una operación costosa. También es innecesario a menos que un Hook sea realmente inspeccionado.

Por esta razón, `useDebugValue` acepta una función de formato como un segundo parámetro opcional. Esta función solo se llama si se inspeccionan los Hooks. Recibe el valor de depuración como parámetro y debe devolver un valor de visualización formateado.

Por ejemplo, un Hook personalizado que devolvió un valor de `Date` podría evitar llamar a la función `toDateString` innecesariamente al pasar el siguiente formateador:

```js
useDebugValue(date, date => date.toDateString());
```
