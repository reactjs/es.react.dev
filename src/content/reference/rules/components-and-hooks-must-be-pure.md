---
title: Los Componentes y Hooks deben ser puros
---

<Intro>
Las funciones puras solo realizan un cálculo y nada más. Hacen que tu código sea más fácil de entender, depurar y permite que React optimice automáticamente tus components y Hooks de forma correcta.
</Intro>

<Note>
Esta página de referencia cubre temas avanzados y requiere familiarización con los conceptos cubiertos en la página [Mantener los componentes puros {/*keeping-components-pure*/}](/learn/keeping-components-pure).
</Note>

<InlineToc />

### ¿Por qué la pureza importa? {/*why-does-purity-matter*/}

Uno de los conceptos clave que hace a React, _Reaccionar_ es la _pureza_. Un componente o Hook puro es aquel que es:

* **Idempotente** – [siempre obtienes el mismo resultado cuando](/learn/keeping-components-pure#purity-components-as-formulas) lo ejecutas con las mismas entradas – props, estado, contexto - en el caso de entradas de componentes; y argumentos en el caso de entradas de hooks.
* **No tiene efectos secundarios en el renderizado** – El código con efectos secundarios debería ejecutarse [**separado del renderizado**](#how-does-react-run-your-code). Por ejemplo, mediante un [manejador de eventos](/learn/responding-to-events) – donde el usuario interactúa con la UI y hace que se actualice; o como un [Effect](/reference/react/useEffect) – que se ejecuta después del renderizado.
* **No muta valores extra-locales**: Los Componentes y Hooks [nunca deberían mutar valores que no hayan sido creados localmente](#mutation) en el renderizado.

Cuando el renderizado se mantiene puro, React puede entender cómo priorizar cuales actualizaciones son más importantes para ser mostradas primero al usuario. Esto se hace posible gracias a la pureza en el renderizado: como los componentes no tienen efectos secundarios, [durante el renderizado](#how-does-react-run-your-code), React puede pausar la renderización de componentes cuya actualización no es tan importante, y volver por ellos solo después cuando se necesite.

En concreto, esto significa que la lógica de renderizado puede ejecutarse múltiples veces de una forma que permite a React darle a tu usuario una experiencia agradable. Sin embargo, si tu componente tiene un efecto secundario sin seguimiento - como modificar el valor de una variable global [durante el renderizado](#how-does-react-run-your-code) – cuando react ejecuta tu código de renderizado de nuevo, tus efectos secundarios serán disparados nuevamente de una forma que no corresponderá con lo que quieres. Esto a menudo causa bugs inesperados que pueden degradar la forma en que tus usuarios experimentan tu aplicación. Puedes ver un [ejemplo de esto en la página Mantener los Componentes Puros](/learn/keeping-components-pure#side-effects-unintended-consequences).

#### ¿Cómo React ejecuta tu código? {/*how-does-react-run-your-code*/}

React es declarativo: le dices a React _qué_ debe renderizar y React se encargará de decidir _cómo_ mostrarlo de la mejor manera a tu usuario. Para lograr esto, React tiene algunas fases en las que ejecuta tu código. No necesitas conocer toas estas fases para usar React de manera efectiva. Pero, a grandes rasgos, deberías saber qué código se ejecuta dentro del _renderizado_ y qué se ejecuta fuera de él.

El _renderizado_ se refiere al cálculo de cómo debería verse la siguiente versión de tu UI. Después del renderizado, los [Efectos](/reference/react/useEffect) se _vacían_ (es decir, se ejecutan hasta que no quedan más) y pueden actualizar el cálculo si los Efectos tienen impactos en el diseño. React toma este nueva cálculo y lo compara con el cálculo utilizado para crear la versión anterior de tu UI, luego _consolida_ solo los cambios mínimos necesarios al [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (lo que tu usuario ve en realidad) para que se actualice a la última versión.

<DeepDive>

#### ¿Cómo saber si el código se ejecuta durante el renderizado? {/*how-to-tell-if-code-runs-in-render*/}

Una regla rápida para saber si el código se ejecuta durante el renderizado es examinar dónde está: si está escrito en el nivel superior, como en el ejemplo a continuación, es muy probable que se ejecute durante el renderizado.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // creado durante el renderizado
  // ...
}
```

Los manejadores de eventos y los Efectos no se ejecutan durante el renderizado:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // este código va dentro de un manejador de eventos, por lo que solo se ejecuta cuando el usuario lo dispara
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // este código va dentro de un Effect, por lo que solo se ejecuta después del renderizado
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## Los Components y Hooks deben ser idempotentes {/*components-and-hooks-must-be-idempotent*/}

Los Componentes siempre deben devolver la misma salida con respecto a sus entradas - props, estados y contextos. Esto se conoce como _idempotencia_. La [idempotencia](https://en.wikipedia.org/wiki/Idempotence) es un término popularizado en la programación funcional. Se refiere a la idea de que [siempre obtienes el mismo resultado cada vez que](learn/keeping-components-pure) ejecutas ese fragmento de código con las mismas entradas.

Esto significa que _todo_ código que se ejecuta [durante el renderizado](#how-does-react-run-your-code) debe también ser idempotente para que esta regla se mantenga. Por ejemplo, esta línea de código no es idempotente (y por lo tanto, tampoco lo es el componente):

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Mal: siempre retorna un resultado diferente!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` no es idempotente ya que siempre devuelve la fecha actual y cambia su resultado cada vez que es llamado. Cuando renderizas el componente anterior, la hora que se muestra en la pantalla se queda atascada en el momento en que se renderizó el componente. De manera similar, las funciones como `Math.random()` tampoco son idempotentes, porque devuelven resultados diferentes cada vez que se llaman, incluso cuando las entradas son las mismas.

Esto no significa que no debas usar funciones no-idempotentes como `new Date()` _en absoluto_ – solo debes evitar usarlas [durante el renderizado](#how-does-react-run-your-code). En este caso, podemos _sincronizar_ la fecha más reciente con este compoente usando un [Efecto](/reference/react/useEffect):

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Lleva el seguimiento del estado de la fecha actual. `useState` recibe una función inicializadora como su
  //    estado inicial. Solo se ejecuta una vez cuando se llama al hook, por lo que solo la fecha actual al
  //    momento en que se llama el hook se establece primero.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Actualiza la fecha actual cada segundo usando `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Bien: el código no-idempotente ya no se ejecuta durante el renderizado
    }, 1000);
    // 3. Devuelve una función de limpieza para evitar fugas de memoria.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

Al envolver la llamada no-idempotente `new Date()` en un Efecto, lleva ese cálculo [fuera del renderizado](#how-does-react-run-your-code).

Si no necesitas sincronizar algún estado externo con React, también puedes considerar usar un [manejador de eventos](/learn/responding-to-events) si solo se necesita que se actualice en respuesta a una interacción del usuario.

---

## Los efectos secundarios deben ejecutarse fuera del renderizado {/*side-effects-must-run-outside-of-render*/}

Los [efectos secundarios](/learn/keeping-components-pure#side-effects-unintended-consequences) no deben ejecutarse [en el renderizado](#how-does-react-run-your-code), ya que React puede renderizar los componentes múltiples veces para crear la mejor experiencia posible para el usuario.

<Note>
Los efectos secundarios son un término más amplio que los Efectos. Los Efectos se refieren específicamente al código que va contenido dentro de un `useEffect`, mientras que un efecto secundario es un término general para el código que tiene algún efecto observable además de su resultado principal de devolver un valor al invocador.

Los efectos secundarios van escritos generalmente dentro de [manejadores de eventos](/learn/responding-to-events) o Efectos. Pero nunca durante el renderizado.
</Note>

Si bien el renderizado debe mantenerse puro, los efectos secundarios son necesarios en cierto punto para que tu aplicación haga algo interesante, ¡como mostrar algo en la pantalla!
La clave de esta regla es que los efectos secundarios no deben ejecutarse [en el renderizado](#how-does-react-run-your-code), ya que React puede renderizar los componentes múltiples veces. En la mayoría de los casos utilizarás [manejadores de eventos](learn/responding-to-events) para manejar los efectos secundarios. El uso de un manejador de eventos le dice explícitamente a React que este código no necesita ejecutarse durante el renderizado, manteniendo el renderizado puro. Si has agotado todas las opciones – y sólo como último recurso – también puedes manejar los efectos secundarios usando `useEffect`.

### ¿Cuándo es correcto mutar? {/*mutation*/}

#### Mutación local {/*local-mutation*/}
Un ejemplo común de un efecto secundario es la mutación, que en Javascript se refiere al cambio de valor de un valor no-[primitivo](https://developer.mozilla.org/en-US/docs/Glossary/Primitive). En general, aunque la mutación no es idiomática en React, la mutación _local_ está perfectamente bien:

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Bien: creado localmente
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Bien: la mutación local está bien
  }
  return <section>{items}</section>;
}
```

No hay necesidad de contorsionar tu código para evitar la mutación local. También podría usarse [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) aquí por brevedad, pero no hay nada de malo en crear un array local y luego agregarle elementos [durante el renderizado](#how-does-react-run-your-code).

Aunque parezca que estamos mutando `items`, la clave a notar es que este código solo lo hace de manera _local_ – la mutación no es "recordada" cuando el componente se renderiza de nuevo. En otras palabras, `items` sólo permanece el tiempo que dura el componente. Como `items` siempre se _recrea_ cada vez que se renderiza `<FriendList />`, el componente siempre devolverá el mismo resultado.

Por otro lado, si `items` se crea fuera del componente, mantiene sus valores anteriores y recuerda los cambios:

```js {1,7}
const items = []; // 🔴 Mal: creado fuera del componente
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Mal: muta un valor creado fuera del renderizado
  }
  return <section>{items}</section>;
}
```

Cuando `<FriendList />` se ejecuta de nuevo, continuaremos agregando `friends` a `items` cada vez que se ejecuta el componente, lo que resulta en múltiples resultados duplicados. Esta versión de `<FriendList />` tiene efectos secundarios observables [durante el renderizado](#how-does-react-run-your-code) y **rompe la regla**.

#### Inicialización perezosa {/*lazy-initialization*/}

La inicialización perezosa también está bien, a pesar de no ser completamente "pura":

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Bien: si no afecta a otros componentes
  // Continúa con el renderizado...
}
```

#### Al cambiar el DOM {/*changing-the-dom*/}

Los efectos secundarios que son directamente visibles para el usuario no están permitidos en la lógica de renderizado de los componentes de React. En otras palabras, simplemente llamar a una función de componente no debería producir por sí mismo un cambio en la pantalla.

```js {2}
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Mal: Cambia el DOM
}
```

Una forma de lograr el resultado deseado para actualizar `document.title` fuera del renderizado es [sincronizar el componente con `document`](/learn/synchronizing-with-effects).


Mientras llamar a un componente múltiples veces sea seguro y no afecte el renderizado de otros componentes, a React no le importa si es 100% puro en el sentido estricto de la programación funcional. Es más importante que [los componentes sean idempotentes](/reference/rules/components-and-hooks-must-be-pure).

---

## Las props y el estado son inmutables {/*props-and-state-are-immutable*/}

Las props y el estado de un componente son [instantáneas](learn/state-as-a-snapshot) inmutables. Nunca las mutes directamente. En su lugar, pasa nuevas props y usa la función setter de `useState`.

Puedes pensar en los valores de props y estado como instantáneas que se actualizan después del renderizado. Por esta razón, no modificas las variables de props o estado directamente: en su lugar, pasa nuevas props o usa la función setter proporcionada para decirle a React que el estado necesita actualizarse la próxima vez que se renderice el componente.

### No mutar las Props {/*props*/}

Las props son inmutables porque si las mutas, la aplicación producirá una salida inconsistente, lo que puede ser difícil de depurar ya que puede o no funcionar dependiendo de la circunstancia.

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Mal: nunca mutar las props directamente
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Bien: hacer una copia en su lugar
  return <Link url={url}>{item.title}</Link>;
}
```

### No mutar el Estado {/*state*/}
`useState` devuelve la variable de estado y un setter para actualizar el estado.

```js
const [stateVariable, setter] = useState(0);
```

En lugar de actualizar la variable de estado directamente, debemos actualizarla usando la función setter que se devuelve con `useState`. Cambiar los valores en la variable de estado no provoca que el componente se actualice, dejando a tus usuarios con una UI desactualizada. Usar la función setter le informa a React que el estado ha cambiado y que necesitamos poner en cola un re-renderizado para actualizar la UI.

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Bien: usar la función setter devuelta por useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Bien: usar la función setter devuelta por useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## Los valores de retorno y los argumentos de los Hooks son inmutables {/*return-values-and-arguments-to-hooks-are-immutable*/}

Cuando se pasan valores a un Hook, no debes modificarlos. Como las props en JSX, los valores se vuelven inmutables cuando se pasan a un Hook.

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Mal: nunca mutar los argumentos de un hook directamente
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Bien: hacer una copia en su lugar
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

Un principio importante en React es el _razonamiento local_: la habilidad de entender lo que hace un componente o Hook al examinar su código de forma aislada. Los Hooks deben tratarse como "cajas negras" cuando se llaman. Por ejemplo, un Hook personalizado puede haber usado sus argumentos como dependencias para memoizar valores dentro de él:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

Si mutaras los argumentos de los Hooks, la memoización del hook personalizado se volvería incorrecta, por lo que es importante evitar hacerlo.

```js {4}
style = useIconStyle(icon);         // `style` se memoiza basado en `icon`
icon.enabled = false;               // Mal: 🔴 nunca mutar los argumentos de un hook directamente
style = useIconStyle(icon);         // resultado memoizado previamente
```

```js {4}
style = useIconStyle(icon);         // `style` se memoiza basado en `icon`
icon = { ...icon, enabled: false }; // Bien: ✅ hacer una copia en su lugar
style = useIconStyle(icon);         // se calcula el nuevo valor de `style
```

De manera similar, es importante no modificar los valores de retorno de los Hooks, ya que podrían haber sido memorizados.

---

## Los valores son inmutables después de ser pasados a JSX {/*values-are-immutable-after-being-passed-to-jsx*/}

No mutes valores después de que hayan sido utilizados en JSX. Mueve la mutación antes de que se cree el JSX.

Cuando usas JSX en una expresión, React puede evaluar el JSX de forma anticipada antes de que el componente termine de renderizarse. Esto significa que mutar valores después de que hayan sido pasados a JSX puede llevar a UIs desactualizadas, ya que React no sabrá cómo actualizar la salida del componente.

```js {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Mal: styles ya ha sido usado en el JSX de arriba
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Bien: creamos un nuevo valor
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
