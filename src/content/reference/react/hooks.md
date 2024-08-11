---
title: "Hooks integrados en React "
---

<Intro>

Los *Hooks* te dejan usar diferentes características de React de sus componentes. Puedes también usar los Hooks integrados o combinarlos para crear el tuyo. Esta página enumera todos los Hooks integrados en React.

</Intro>

---

## Hooks de estado {/*state-hooks*/}

El *Estado* permite a un componente ["recordar" información como el input del usuario.](/learn/state-a-components-memory) Por ejemplo, un componente de formulario puede usar el estado para almacenar el valor de entrada, mientras que un componente de galería de imágenes puede usar el estado para almacenar el indicé de la imagen seleccionada.

Para añadir un estado a un componente, usa de estos Hooks:

* [`useState`](/reference/react/useState) declara un estado variable que puedes actualizar directamente.
* [`useReducer`](/reference/react/useReducer) declara un estado variable con la lógica de actualización dentro de una [función reductora.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Hooks de Contexto {/*context-hooks*/}

El *Contexto* permite a un componente [recibir información desde un componente padre distante sin pasarsela como props.](/learn/passing-props-to-a-component) Por ejemplo, tu componente en el nivel más alto de tu aplicación puede pasar el tema de interfaz de usuario actual a todos los componentes debajo, no importa que tan profundo estén.

* [`useContext`](/reference/react/useContext) lee y se suscribe a un Contexto.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Hooks Ref {/*ref-hooks*/}

Los *Refs* permiten a un componente [conserva algo de información que no es usada para el renderizado,](/learn/referencing-values-with-refs) como un nodo del DOM or el ID de un timeout. A diferencia del estado, actualizar un ref no no vuelve a renderizar tu componente. Los refs son una "puerta de escape" del paradigma de React. Son útiles cuando necesitas trabajar con sistemas que no son de React, como son las APIs integradas del navegador.

* [`useRef`](/reference/react/useRef) declara un ref. Puedes conservar cualquier valor en él, pero más frecuentemente se utiliza para conservar un node del DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) te permite personalizar el ref expuesto por tu componente. Es raramente utilizado.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Hooks de Efecto {/*effect-hooks*/}

Los *Efectos* permiten a un componente [conectarse y sincronizarse con sistemas externos.](/learn/synchronizing-with-effects) Esto incluye lidiar con la red, el DOM del navegador, animaciones, widgets escritos usando una biblioteca UI distinta, y otro código que no sea de React.

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

Los Efectos son una "puerta de escape" del paradigma de React. No utilices los Efectos para orquestar el flujo de los datos de tu aplicación. Si no estas interactuando con un sistema externo, [puede que no necesites un Efecto.](/learn/you-might-not-need-an-effect)

Hay dos variaciones raramente usadas de `useEffect` con diferencias en la sincronización:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) se activa antes de que el navegador vuelve a pintar la pantalla. Puedes medir la maquetación aquí.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) se activa antes de que React realice cambios al DOM. Las bibliotecas pueden insertar CSS dinámico aquí.

---

## Hooks de rendimiento {/*performance-hooks*/}

Una forma común de optimizar el rendimiento del re-renderizado es saltarse el trabajo innecesario. Por ejemplo, puedes decirle a React que reutilice cálculos que están en la caché o que se salte un re-renderizado si los datos no han cambiado desde el renderizado anterior.

Para saltarse cálculos y re-renderizados innecesarios, usa uno de estos Hooks:

- [`useMemo`](/reference/react/useMemo) te permite almacenar en caché el resultado de un cálculo costoso.
- [`useCallback`](/reference/react/useCallback) te permite almacenar en caché la definición de una función antes de pasarla a un componente optimizado.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

A veces, no podrás saltarte re-renderizados porque la pantalla realmente necesita actualizarse. En ese caso, puede mejorar el rendimiento separando actualizaciones bloqueantes que deben ser síncronas (como escribir en un input) desde actualizaciones no bloqueantes las cuales no necesitan bloquear la interfaz de usuario (como actualizar una gráfica).

Para priorizar el renderizado, usa uno de estos Hooks:

- [`useTransition`](/reference/react/useTransition) te permite marcar un estado de transición como no bloqueante y permite a otras actualizaciones interrumpirlo.
- [`useDeferredValue`](/reference/react/useDeferredValue) te permite aplazar la actualización de una parte no critica de la UI y permite a las otras partes actualizarse primero.

---

## Otros Hooks {/*other-hooks*/}

Estos Hooks son mayormente útiles para los autores de bibliotecas y no son comúnmente utilizados para el código de una aplicación.

- [`useDebugValue`](/reference/react/useDebugValue) te permite personalizar la etiqueta que las herramientas de desarrollo de muestran para tu Hook personalizado.
- [`useId`](/reference/react/useId) permite a un componente se asocie a sí mismo un identificador único. Típicamente es usado con APIs de accesibilidad.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) permite a un componente suscribirse a una store externo.
* [`useActionState`](/reference/react/useActionState) allows you to manage state of actions.

---

## Tus propios Hooks {/*your-own-hooks*/}

Puedes también [definir tus propios Hooks personalizados](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) como funciones de JavaScript.
