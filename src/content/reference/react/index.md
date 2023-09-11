---
title: "Hooks integrados de React"
---

<Intro>

Los *Hooks* te permiten usar diferentes funciones de React desde tus componentes. Puedes usar los Hooks integrados o combinarlos para construir tu propio Hook. Esta página lista todos los *Hooks integrados* en React.

</Intro>

---

## Hooks de estado {/*state-hooks*/}

El *estado* permite que un componente ["recuerde" información como la entrada de un usuario.](/learn/state-a-components-memory) Por ejemplo, un componente de formulario puede utilizar un estado para guardar la entrada del valor mientras que un componente de galería de imágenes puede utilizar un estado para guardar el índice de la imagen seleccionada.

Para añadir un estado a un componente, usa uno de estos Hooks:

* [`useState`](/reference/react/useState) declara una variable de estado que puedes actualizar directamente.
* [`useReducer`](/reference/react/useReducer) declara una variable de estado con la lógica de actualización dentro de una [función reductora.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Hooks de contexto {/*context-hooks*/}

El *contexto* permite a un componente [recibir información de padres lejanos sin pasarlas como props.](/learn/passing-props-to-a-component) Por ejemplo, el componente en el nivel superior de tu aplicación puede pasar el actual tema de la UI a todos los componentes dentro, sin importar la profundidad dentro del componente.

* [`useContext`](/reference/react/useContext) lee y se subscribe a un contexto.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Hooks de refs {/*ref-hooks*/}

Las *refs* le permiten a un componente [mantener alguna información que no es utilizada para el renderizado](/learn/referencing-values-with-refs) como un nodo del DOM o el ID de un *timeout*. A diferencia del estado, actualizar una *ref* no vuelve a renderizar tu componente. Las *refs* son una "puerta de escape" del paradigma de React. Son útiles cuando necesitas trabajar con sistemas distintos de React, como las APIs integradas del navegador.

* [`useRef`](/reference/react/useRef) declara una ref. Puede contener cualquier valor, pero la mayoría de las veces se utiliza para contener un nodo del DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) permite personalizar la *ref* expuesta por tu componente. Esto rara vez se usa.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Hooks de Efecto {/*effect-hooks*/}

El *Hook de Efecto* permite a un componente [conectarse y sincronizarse con sistemas externos.](/learn/synchronizing-with-effects) Esto incluye lidiar con la red, el DOM del navegador, animaciones, *widgets* escritos utilizando una biblioteca de UI diferente y otro código que no es de React.

* [`useEffect`](/reference/react/useEffect) conecta un componente a un sistema externo.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Los *Hooks de Efecto* son una "puerta de escape" del paradigma de React. No utilices los *Efectos* para guiar el flujo de los datos de tu aplicación. Si no estás interactuando con un sistema externo, [puede que no necesites un Hook de Efecto.](/learn/you-might-not-need-an-effect)

Hay dos variaciones poco usadas de `useEffect` con diferencias en los tiempos en que se llaman:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) se activa antes de que el navegador vuelva a pintar la pantalla. Aquí puedes hacer cálculos de maquetación (*layout*).
* [`useInsertionEffect`](/reference/react/useInsertionEffect) se activa antes de que React haga cambios en el DOM. Aquí las bibliotecas pueden insertar CSS dinámico.

---

## Hooks de rendimiento {/*performance-hooks*/}

Una forma común de optimizar el rendimiento del rerenderizado es evitar trabajo innecesario. Por ejemplo, puedes decirle a React que reutilice un cálculo guardado en caché o que se salte un rerenderizado si los datos no han cambiado desde el renderizado anterior.

Para evitar cálculos y renderizados innecesarios, usa uno de estos Hooks:

- [`useMemo`](/reference/react/useMemo) permite guardar en caché los resultados de un cálculo costoso.
- [`useCallback`](/reference/react/useCallback) permite guardar en caché una función definida antes de pasarla a un componente optimizado.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Algunas veces no podrás evitar un rerenderizado porque la pantalla realmente necesita una actualización. En ese caso, puedes mejorar el rendimiento separando las actualizaciones bloqueantes que deben ser síncronas (como al escribir dentro de una entrada de texto) de las actualizaciones no bloqueantes, que no necesitan bloquear la interfaz de usuario (como actualizar un gráfico).

Para priorizar el renderizado, usa uno de estos Hooks:

- [`useTransition`](/reference/react/useTransition) permite marcar una transición de estado como no bloqueante y permitir que otras actualizaciones la interrumpan.
- [`useDeferredValue`](/reference/react/useDeferredValue) te permite aplazar la actualización de una parte no crítica de la interfaz de usuario y dejar que otras partes se actualicen primero.

---

<<<<<<< HEAD
## Otros Hooks {/*other-hooks*/}
=======
## Resource Hooks {/*resource-hooks*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this Hook:

- [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## Other Hooks {/*other-hooks*/}
>>>>>>> 5219d736a7c181a830f7646e616eb97774b43272

Estos Hooks son mayormente útiles para autores de bibliotecas y no son comúnmente usadas en el código de la aplicación.

- [`useDebugValue`](/reference/react/useDebugValue) permite personalizar la etiqueta que las Herramientas de Desarrollo de React muestran para tu Hook personalizado.
- [`useId`](/reference/react/useId) permite que un componente se asocie un ID único. Normalmente, se utiliza con las APIs de accesibilidad.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) permite que un componente se subscriba a un almacenamiento (*store*) externo.

---

## Tus propios Hooks {/*your-own-hooks*/}

También puedes [definir tus propios Hooks personalizados](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) como funciones JavaScript.
