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

- [Basic Hooks](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Additional Hooks](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## Hooks Básicos {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

Devuelve un valor con estado y una función para actualizarlo.

Durante el renderizado inicial, el estado devuelto (`state`) es el mismo que el valor pasado como primer argumento (`initialState`).

La función `setState` se usa para actualizar el estado. Acepta un nuevo valor de estado y encola una nueva renderización del componente.

```js
setState(newState);
```

En las renderizaciones siguientes, el primer valor devuelto por `useState` será siempre el estado más reciente después de aplicar las actualizaciones.

#### Actualizaciones funcionales {#functional-updates}

Si el nuevo estado se calcula utilizando el estado anterior, puede pasar una función a `setState`. La función recibirá el valor anterior y devolverá un valor actualizado. Aquí hay un ejemplo de un componente contador que usa ambas formas de `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </>
  );
}
```

Los botones "+" y "-" usan la forma funcional, porque el valor actualizado se basa en el valor anterior. Pero el botón "Restablecer" usa la forma normal, porque siempre vuelve a establecer la cuenta en 0.

> Nota
>
> A diferencia del método `setState` que se encuentra en los componentes de la clase,`useState` no combina automáticamente los objetos. Puede replicar este comportamiento combinando la función de actualizador de función con la sintaxis spread de objetos:
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

Si se actualiza un Hook de estado con el mismo valor que el estado actual, React evitará la renderización de los hijos y disparar los efectos. (React utiliza el [algoritmo de comparación `Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/is#Description)).

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

Acepta una función que contiene código imperativo, posiblemente código efectivo.

Las mutaciones, suscripciones, temporizadores, registro y otros efectos secundarios no están permitidos dentro del cuerpo principal de un componente funcional (denominado como _render phase_ de React). Si lo hace, dará lugar a errores confusos e inconsistencias en la interfaz de usuario.

En su lugar, use `useEffect`. La función pasada a `useEffect` se ejecutará después de que el renderizado es confirmado en la pantalla. Piense en los efectos como una escotilla de escape del mundo puramente funcional de React al mundo imperativo.

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

Sin embargo, no todos los efectos pueden ser diferidos. Por ejemplo, una mutación de DOM que es visible para el usuario debe ejecutarse de manera sincrónica antes del siguiente render para que el usuario no perciba una inconsistencia visual. (La distinción es conceptualmente similar a la de los listeners de eventos pasivos y de los activos). Para estos tipos de efectos, React proporciona un Hook adicional llamado [`useLayoutEffect`](#uselayouteffect). Tiene la misma firma que `useEffect`, y solo difiere cuando se ejecuta.

Aunque `useEffect` se aplaza hasta después de que el navegador se haya pintado, se garantiza que se activará antes de cualquier nuevo render. React siempre eliminará los efectos de un render anterior antes de comenzar una nueva actualización.

#### Disparar un efecto condicionalmente. {#conditionally-firing-an-effect}

El comportamiento predeterminado para los efectos es ejecutar el efecto después de cada render completo. De esa manera, siempre se recrea un efecto si cambia uno de sus inputs.

Sin embargo, esto puede ser excesivo en algunos casos, como el ejemplo de suscripción de la sección anterior. No necesitamos crear una nueva suscripción en cada actualización, solo si las propiedades de `source` han cambiado.

Para implementar esto, pase un segundo argumento a `useEffect` que es el conjunto de valores de los que depende el efecto. Nuestro ejemplo actualizado ahora se ve así:

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

Pasar en un arreglo vacío `[]` de entradas le dice a React que su efecto no depende de ningún valor del componente, por lo que ese efecto se ejecutaría solo en el montaje y la limpieza en el desmontaje; no se ejecutará en las actualizaciones.

> Nota
>
> El arreglo de entradas no se pasa como argumentos a la función de efecto. Sin embargo, conceptualmente, eso es lo que representan: cada valor al que se hace referencia dentro de la función de efecto también debería aparecer en el arreglo de entradas. En el futuro, un compilador lo suficientemente avanzado podría crear esta matriz automáticamente.

### `useContext` {#usecontext}

```js
const context = useContext(Context);
```

Acepta un objeto de contexto (el valor devuelto de `React.createContext`) y devuelve el valor de contexto actual, como lo proporciona el proveedor de contexto más cercano para el contexto dado.

Cuando el proveedor se actualiza, este Hook activará un render extra con el último valor de contexto.

## Hooks adicionales {#additional-hooks}

Los siguientes Hooks son variantes de los básicos de la sección anterior o solo son necesarios para casos de borde específicos. No te estreses por aprenderlos por adelantado.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Una alternativa a [`useState`](#usestate). Acepta un reducer de tipo `(state, action) => newState` y devuelve el estado actual emparejado con un método` dispatch`. (Si está familiarizado con Redux, ya sabe cómo funciona).

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

function Counter({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

#### Especificar el estado inicial {#specifying-the-initial-state}

Hay dos formas diferentes de inicializar el estado de `useReducer`. Puedes elegir uno dependiendo de tu caso de uso. La forma más simple para pasar el estado inicial es como un segundo argumento:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Nota
>
>React no utiliza la convención del argumento `state = initialState` popularizada por Redux. El valor inicial a veces necesita tener una dependencia en las props y por tanto se especifica en cambio en la llamada al Hook. Si te parece muy importante, puedes llamar a `useReducer(reducer, undefined, reducer)` para emular el comportamiento de Redux, pero no se recomienda

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
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

#### Evitar un *dispatch* {#bailing-out-of-a-dispatch}

Si devuelves el mismo valor del estado actual desde un Hook reductor, React evitará el renderizado de los hijos y disparar efectos. (React utiliza el [algoritmo de comparación `Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/is#Description)).

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Retorna un callback [memorizado](https://en.wikipedia.org/wiki/Memoization).

Pase un callback en línea y un arreglo de entradas. `useCallback` devolverá una versión memorizada del callback que solo cambia si una de las entradas ha cambiado. Esto es útil cuando se transfieren callbacks a componentes hijos optimizados que dependen de la igualdad de referencia para evitar renders innecesarias (por ejemplo, `shouldComponentUpdate`).

`useCallback(fn, inputs)` es igual a `useMemo(() => fn, inputs)`.

> Nota
>
> El arreglo de entradas no se pasa como argumentos al callback. Sin embargo, conceptualmente, eso es lo que representan: cada valor al que se hace referencia dentro del callback también debe aparecer en el arreglo de entradas. En el futuro, un compilador lo suficientemente avanzado podría crear esta matriz automáticamente.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Devuelve un valor [memorizado](https://en.wikipedia.org/wiki/Memoization).

Pasa una función de "crear" y un arreglo de entradas. `useMemo` solo volverá a calcular el valor memorizado cuando una de las entradas haya cambiado. Esta optimización ayuda a evitar cálculos costosos en cada render.

Recuerde que la función pasada a `useMemo` se ejecuta durante el renderizado. No hagas nada allí que normalmente no harías al renderizar. Por ejemplo, los efectos secundarios pertenecen a `useEffect`, no a` useMemo`.

Si no se proporciona un arreglo, se calculará un nuevo valor cada vez que se pase una nueva instancia de función como primer argumento. (Con una función en línea, en cada render).

**Puede confiar en `useMemo` como una optimización del rendimiento, no como una garantía semántica.** En el futuro, React puede elegir "olvidar" algunos valores previamente memorizados y recalcularlos en el próximo renderizado, por ejemplo para liberar memoria para componentes fuera de pantalla. Escribe tu código para que aún funcione sin `useMemo` - y luego agrégalo para optimizar el rendimiento.

> Nota
>
> El arreglo de entradas no se pasa como argumentos a la función. Sin embargo, conceptualmente, eso es lo que representan: cada valor al que se hace referencia dentro de la función también debe aparecer en el arreglo de entradas. En el futuro, un compilador lo suficientemente avanzado podría crear este arreglo automáticamente.

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

Tenga en cuenta que `useRef()` es mas útil que el atributo `ref`. Es [útil para mantener cualquier valor mutable en torno a](/docs/hooks-faq.html#is-there-something-like-instance-variables) similar a cómo utilizarías los campos de instancia en las clases.

### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [inputs])
```

`useImperativeHandle` personaliza el valor de instancia que se expone a los componentes padres cuando se usa` ref`. Como siempre, el código imperativo que usa refs debe evitarse en la mayoría de los casos. `useImperativeHandle` debe usarse con `forwardRef`:

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

En este ejemplo, un componente padre que muestra `<FancyInput ref={fancyInputRef} />` podría llamar a `fancyInputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

La firma es idéntica a `useEffect`, pero se dispara de forma síncrona después de todas las mutaciones de DOM. Use esto para leer el diseño del DOM y volver a renderizar de forma sincrónica. Las actualizaciones programadas dentro de `useLayoutEffect` se vaciarán sincrónicamente, antes de que el navegador tenga la oportunidad de pintar.

Prefiera el `useEffect` estándar cuando sea posible para evitar el bloqueo de actualizaciones visuales.

> Consejo
>
> Si está migrando código de un componente de clase, `useLayoutEffect` se dispara en la misma fase que` componentDidMount` y `componentDidUpdate`, por lo que si no está seguro de qué effect Hook usar, este es probablemente el menos riesgoso.

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
