---
title: "Hooks integrados de React"
---

<Intro>

Los *hooks* te dejan usar diferentes funciones de React desde tus componentes. Tú también puedes utilizar los hooks o combinarlos para construir tu propio hook. Esta página lista todos los *hooks integrados* en React.

</Intro>

---

## Hooks de estado {/*state-hooks*/}

El *estado* permite que un componente ["recuerde" información como la entrada de un usuario.](/learn/state-a-components-memory) Por ejemplo, un componente de formulario puede utilizar un estado para guardar la entrada del valor mientras que un componente de galería de imágenes puede utilizar un estado para guardar el índice de la imagen seleccionada.

Para añadir un estado a un componente, usa uno de estos hooks:
* [`useState`](/reference/react/useState) declara una variable de estado que tú puedes actualizar directamente.
* [`useReducer`](/reference/react/useReducer) declara una variable de estado con la lógica de actualización dentro de una [función reductora.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Hooks de contexto {/*context-hooks*/}

El *contexto* permite a un componente [recibir información de padres lejanos sin pasarlas como props.](/learn/passing-props-to-a-component) Por ejemplo, tu componente app de alto nivel puede pasar el actual tema UI a todos los componentes dentro, no importa la profundidad dentro del componente.

* [`useContext`](/reference/react/useContext) lee y subscribe a un contexto.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Hooks de refs {/*ref-hooks*/}

Las *refs* le permiten a un componente [mantener alguna información que no es utilizada para renderización](/learn/referencing-values-with-refs) como un nodo del DOM o un timeout ID. A diferencia con el estado, actualizando un *ref* no vuelve a renderizar tu componente. Las *refs* son una “escotilla de escape” del paradigma de React. Son útiles cuando tú necesitas trabajar con sistemas no-React, semejantes como el navegador incorporado de APIs.

* [`useRef`](/reference/react/useRef) declara una ref. Puede contener cualquier valor, pero la mayoría de las veces se utiliza para contener un nodo DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) permite personalizar la *ref* expuesta por su componente. Esto rara vez se usa

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Hooks de efecto {/*effect-hooks*/}

El *hook de efecto* permite a un componente [conectarse y sincronizarse con sistemas externos.](/learn/synchronizing-with-effects) Esto incluye lidiar con la red de trabajo, navegación DOM, animaciones, widgets escritos utilizando una libreria UI diferente y otro código no React.

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

Los *hooks de efecto* son una “escotilla de escape” del paradigma de React. No utilices los *efectos* para guiar el flujo de los datos de tu aplicación. Si no estás interactuando con un sistema externo, [puede que no necesites un hook de efecto.](/learn/you-might-not-need-an-effect)

Hay dos raras variaciones de usos de `useEffect` con tiempos de diferencias:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) dispara antes de que el navegador vuelva a pintar la pantalla. Puede medir el diseño de aquí.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) dispara antes de que React haga cambios en el DOM. Las librerías pueden insertar CSS dinámico aquí.

---

## Hooks de rendimiento {/*performance-hooks*/}

Una forma común de optimizar el rendimiento de la doble renderización es saltar el trabajo innecesario. Por ejemplo, tú puedes decirle a React para reusar un cálculo en el cache o saltar el re-renderizado si la data no tiene cambios desde el renderizado anterior.

Para saltar calculos y renderizaciones innecesarias, usa uno de estos hooks:

- [`useMemo`](/reference/react/useMemo) permite guardar en cache los resultados de un cálculo costoso.
- [`useCallback`](/reference/react/useCallback) permite guardar en cache una función definida antes de pasarla a un componente optimizado.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Algunas veces, no podrás saltar el doble renderizado porque la pantalla actualmente necesita una actualización. En ese caso, tú puedes mejorar el rendimiento separando las actualizaciones de bloqueo que deben ser síncronas (como al escribir dentro de una entrada) de actualizaciones no bloqueadas, las cuáles no necesitan bloquear la interfaz de usuario (como actualizar un gráfico).

Para priorizar el renderizado, usa uno de estos hooks:

- [`useTransition`](/reference/react/useTransition) permite marcar una transición de estado como no bloqueante y permitir que otras actualizaciones la interrumpan.
- [`useDeferredValue`](/reference/react/useDeferredValue) le permite aplazar la actualización de una parte no crítica de la interfaz de usuario y dejar que otras partes se actualicen primero.

---

## Otros hooks {/*other-hooks*/}

Estos hooks son mayormente útiles para autores de librerías y no son comúnmente usadas en el código de la aplicación.

- [`useDebugValue`](/reference/react/useDebugValue) permite personalizar la etiqueta que la herramienta de desarrollador de React muestra para tu hook personalizado.
- [`useId`](/reference/react/useId) permite que un componente asocie un ID único consigo mismo. Normalmente, se utiliza con las API de accesibilidad.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) permite que un componente se subscriba a una tienda externa.

---

## Tus propios hooks {/*your-own-hooks*/}

Tú también puedes [definir tus propios hooks personalizados](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) como funciones JavaScript.