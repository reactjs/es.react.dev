---
title: useMemo
---

<Intro>

`useMemo` es un Hook de React que te permite guardar en caché el resultado de un cálculo entre renderizados.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useMemo` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Referencia {/*reference*/}

### `useMemo(calcularValor, dependencias)` {/*usememo*/}

Llama a `useMemo` en el nivel superior de tu componente para guardar en caché un cálculo entre rerenderizados:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `calcularValor`: La función que calcula el valor que deseas memoizar. Debe ser pura, no debe aceptar argumentos y debe devolver un valor de cualquier tipo. React llamará a tu función durante el renderizado inicial. En renderizados posteriores, React devolverá el mismo valor nuevamente si las `dependencias` no han cambiado desde el última renderizado. De lo contrario, llamará a `calcularValor`, devolverá su resultado y lo almacenará en caso de que pueda reutilizarse más tarde.

* `dependencias`: La lista de todos los valores reactivos a los que se hace referencia dentro del código `calcularValor`. Los valores reactivos incluyen props, estado y todas las variables y funciones declaradas directamente dentro del cuerpo de tu componente. Si tu linter está [configurado para React](/learn/editor-setup#linting), verificará que cada valor reactivo esté correctamente especificado como una dependencia. La lista de dependencias debe tener un número constante de elementos y escribirse en línea como `[dep1, dep2, dep3]`. React comparará cada dependencia con su valor anterior usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Devuelve {/*returns*/}

En el renderizado inicial, `useMemo` devuelve el resultado de llamar a `calcularValor` sin argumentos.

Durante los renderizados posteriores, devolverá un valor ya almacenado del último renderizado (si las dependencias no han cambiado), o llamará a `calcularValor` nuevamente y devolverá el resultado que `calcularValor` haya devuelto.

#### Advertencias {/*caveats*/}

* `useMemo` es un Hook, por lo que solo puede llamarse **en el nivel superior del componente** o sus propios Hooks. No puedes llamarlo dentro de bucles o condiciones. Si lo necesitas, extrae un nuevo componente y mueve el estado a él.
* En modo estricto, React **llamará a tu función de cálculo dos veces** para [ayudarte a encontrar impurezas accidentales.](#my-calculation-runs-twice-on-every-re-render) Este comportamiento ocurre solo en desarrollo y no afecta a producción. Si tu función de cálculo es pura (como debería ser), esto no debería afectar la lógica de tu componente. Se ignorará el resultado de una de las llamadas. 
* React **no descartará el valor almacenado en caché a menos que haya una razón específica para hacerlo.** Por ejemplo, en desarrollo, React descartará la caché cuando edites el archivo de tu componente. Tanto en desarrollo como en producción, React desechará la caché si tu componente se suspende durante el montaje inicial. En el futuro, React puede agregar más funcionalidades que hagan descartar la caché; por ejemplo, si React incorporara una funcionalidad para listas virtualizadas en el futuro, tendría sentido desechar la caché para los elementos que al desplazarse salen del área visible de la lista virtualizada. Esto debería estar a tono con tus expectativas si dependes de `useMemo` únicamente como una optimización de rendimiento. De lo contrario, una [variable de estado](/reference/react/useState#avoiding-recreating-the-initial-state) o una [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) pueden ser más apropiadas.

<Note>

Guardar en caché valores como este también se conoce como [*memoización*,](https://es.wikipedia.org/wiki/Memoizaci%C3%B3n), y es por eso que el Hook se llama `useMemo`.

</Note>

---

## Uso {/*usage*/}

### Evitar recálculos costosos {/*skipping-expensive-recalculations*/}

Para almacenar en caché un cálculo entre renderizados, envuélvelo en `useMemo` en el nivel superior de tu componente:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Necesitas pasar dos cosas a `useMemo`:

1. Una <CodeStep step={1}>función de cálculo</CodeStep> que no toma argumentos, como `() =>`, y devuelve lo que querías calcular.
2. Una <CodeStep step={2}>lista de dependencias</CodeStep> que incluye cada valor dentro de tu componente que se usa dentro del cálculo.

En el renderizado inicial, el<CodeStep step={3}>valor</CodeStep> que obtendrás de `useMemo` será el resultado de llamar a tu <CodeStep step={1}>cálculo</CodeStep>.

En cada procesamiento posterior, React comparará las <CodeStep step={2}>dependencias</CodeStep> con las dependencias que pasaste durante el último renderizado. Si ninguna de las dependencias ha cambiado (comparado con [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo ` devolverá el valor que ya calculó antes. De lo contrario, React volverá a ejecutar tu cálculo y devolverá el nuevo valor.

En otras palabras, `useMemo` guarda en caché un cálculo entre renderizados hasta que cambian sus dependencias.

**Veamos un ejemplo para ver cuándo es útil.**

De forma predeterminada, React volverá a ejecutar todo el cuerpo de tu componente cada vez que se vuelva a renderizar. Por ejemplo, si esta `TodoList` actualiza su estado o recibe nuevas props de su padre, la función `filterTodos` se volverá a ejecutar:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Por lo general, esto no es un problema porque la mayoría de los cálculos son muy rápidos. Sin embargo, si estás filtrando o transformando un *array* grande, o estás realizando algún cálculo costoso, es posible que desees omitir hacerlo nuevamente si los datos no han cambiado. Si tanto `todos` como `tab` son los mismos que durante el último renderizado, envolver el cálculo en `useMemo` como antes te permite reutilizar `visibleTodos` que ya se calculó antes.

Este tipo de almacenamiento en caché se denomina *[memoización.](https://es.wikipedia.org/wiki/Memoizaci%C3%B3n)*

<Note>

**Solo debes depender de `useMemo` como una optimización de rendimiento.** Si tu código no funciona sin él, encuentra el problema subyacente y arréglalo primero. Luego puedes agregar `useMemo` para mejorar el rendimiento.

</Note>

<DeepDive>

#### ¿Cómo saber si un cálculo es costoso? {/*how-to-tell-if-a-calculation-is-expensive*/}

En general, a menos que estés creando o recorriendo miles de objetos, probablemente no sea costoso. Si deseas tener más confianza, puede agregar un registro de consola para medir el tiempo dedicado a una pieza de código:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Realiza la interacción que estás midiendo (por ejemplo, escribiendo en la entrada de texto). Luego verás registros como `filter array: 0.15ms` en tu consola. Si el tiempo total registrado suma una cantidad significativa (por ejemplo, '1 ms' o más), podría tener sentido memoizar ese cálculo. Como experimento, puedes envolver el cálculo en `useMemo` para verificar si el tiempo total registrado ha disminuido para esa interacción o no:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Se omite si `todos` y `tab` no han cambiado.
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` no hará que el *primer* renderizado sea más rápido. Solo te ayuda a omitir el trabajo innecesario en las actualizaciones.

Ten en cuenta que tu máquina probablemente sea más rápida que la de tus usuarios, por lo que es una buena idea probar el rendimiento con una ralentización artificial. Por ejemplo, Chrome ofrece para esto una opción de [CPU *Throttling*](https://developer.chrome.com/blog/new-in-devtools-61/#throttling).

También ten en cuenta que medir el rendimiento en desarrollo no te dará los resultados más precisos. (Por ejemplo, cuando el [Modo estricto](/reference/react/StrictMode) está activado, verás que cada componente se renderiza dos veces en lugar de una vez). Para obtener los tiempos más precisos, construye tu aplicación para producción y pruébala en un dispositivo como el que tienen tus usuarios.

</DeepDive>

<DeepDive>

#### ¿Deberías agregar useMemo en todas partes? {/*should-you-add-usememo-everywhere*/}

<<<<<<< HEAD
Si tu aplicación es como este sitio y la mayoría de las interacciones son bruscas (como reemplazar una página o una sección completa), la memoización generalmente no es necesaria. Por otro lado, si tu aplicación se parece más a un editor de dibujos y la mayoría de las interacciones son granulares (como formas en movimiento), entonces la memoización podría resultarte muy útil.
=======
If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

Optimizar con `useMemo` solo es valioso en algunos casos:

- El cálculo que estás poniendo en `useMemo` es notablemente lento y tus dependencias rara vez cambian.
- Lo pasas como prop a un componente envuelto en [`memo`.](/reference/react/memo) Quieres omitir el rerenderizado si el valor no ha cambiado. La memoización permite que tu componente se vuelva a renderizar solo cuando las dependencias no son las mismas.
- El valor que estás pasando se usa más tarde como una dependencia de algún Hook. Por ejemplo, tal vez otro cálculo con `useMemo` depende de este. O tal vez dependas de este valor dentro de un [`useEffect.`](/reference/react/useEffect)

No hay ningún beneficio en envolver un cálculo en `useMemo` en otros casos. Tampoco hay un daño significativo en hacerlo, por lo que algunos equipos optan por no pensar en casos individuales y memoizar tanto como sea posible. La desventaja de este enfoque es que el código se vuelve menos legible. Además, no toda la memoización es efectiva: un solo valor que es "siempre nuevo" es suficiente para interrumpir la memoización de un componente completo.

**En la práctica, puedes hacer que muchas memoizaciones sean innecesarias siguiendo algunos principios:**

1. Cuando un componente envuelve visualmente otros componentes, déjalo [aceptar JSX como hijos.](/learn/passing-props-to-a-component#passing-jsx-as-children) De esta manera, cuando el componente contenedor actualice su propio estado, React sabe que sus hijos no necesitan volverse a renderizar.
1. Prefiere el estado local y no [eleves el estado](/learn/sharing-state-between-components) más allá de lo necesario. Por ejemplo, no mantengas el estado transitorio —como formularios y si se le está haciendo *hover* a un elemento— en la parte superior de tu árbol o en una biblioteca de estado global.
1. Mantén tu [lógica de renderizado pura.](/learn/keeping-components-pure) Si volver a renderizar un componente causa un problema o produce algún artefacto visual notable, ¡es un error en tu componente! Soluciona el error en lugar de agregar memoización.
1. Evita [Efectos innecesarios que actualicen el estado.](/learn/you-might-not-need-an-effect) La mayoría de los problemas de rendimiento en las aplicaciones de React son causados por cadenas de actualizaciones que se originan en Efectos que hacen que tus componentes se rendericen una y otra vez.
1. Intenta [eliminar las dependencias innecesarias de tus Efectos.](/learn/removing-effect-dependencies) Por ejemplo, en lugar de memoizar, suele ser más sencillo mover algún objeto o función dentro de un Efecto o fuera del componente.

Si una interacción específica aún se siente lenta, [usa el generador de perfiles de la Herramientas de Desarrollo de React](https://es.legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) para ver qué componentes se beneficiarían más de la memoización y agregar memoización donde sea necesario. Estos principios hacen que tus componentes sean más fáciles de depurar y comprender, por lo que es bueno seguirlos en cualquier caso. A largo plazo, estamos investigando [hacer memoización granular automáticamente](https://www.youtube.com/watch?v=lGEMwh32soc) para solucionar esto de una vez por todas.

</DeepDive>

<Recipes titleText="La diferencia entre useMemo y calcular un valor directamente" titleId="examples-recalculation">

#### Saltarse el recálculo con `useMemo` {/*skipping-recalculation-with-usememo*/}

En este ejemplo, la implementación de `filterTodos` se **ralentiza artificialmente** para que puedas ver qué sucede cuando alguna función de JavaScript que estás llamando durante el renderizado es realmente lenta. Intenta cambiar las pestañas y alternar el tema.

Cambiar las pestañas se siente lento porque obliga a que el `filterTodos` ralentizado se vuelva a ejecutar. Eso es de esperar porque `tab` ha cambiado, por lo que todo el cálculo *necesita* volver a ejecutarse. (Si tienes curiosidad por qué se ejecuta dos veces, se explica [aquí.](#my-calculation-runs-twice-on-every-re-render))

A continuación, intenta alternar el tema. **¡Gracias a `useMemo`, es rápido a pesar de la ralentización artificial!** La llamada lenta a `filterTodos` se omitió porque tanto `todos` como `tab` (que pasas como dependencias a `useMemo`) no han cambiado desde el último renderizado.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Activos
      </button>
      <button onClick={() => setTab('completed')}>
        Completados
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo oscuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Nota: ¡<code>filterTodos</code> se ralentiza artificialmente!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // No hacer nada durante 500 ms para emular un código extremadamente lento
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Recalcular siempre un valor {/*always-recalculating-a-value*/}

En este ejemplo, la implementación de `filterTodos` también se **ralentiza artificialmente** para que puedas ver qué sucede cuando alguna función de JavaScript que estás llamando durante el renderizado es realmente lenta. Intenta cambiar las pestañas y alternar el tema.

A diferencia del ejemplo anterior, cambiar el tema también es lento ahora. Esto se debe a que **no hay una llamada a `useMemo` en esta versión**, por lo que se llama al `filterTodos` artificialmente ralentizado cada vez que se vuelve a renderizar. Se llama incluso si solo ha cambiado `theme`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Activos
      </button>
      <button onClick={() => setTab('completed')}>
        Completados
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo oscuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Nota: ¡<code>filterTodos</code> se ralentiza artificialmente!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // No hacer nada durante 500 ms para emular un código extremadamente lento
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Sin embargo, aquí está el mismo código **con la ralentización artificial eliminada.** ¿Se nota o no la falta de `useMemo`?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Activos
      </button>
      <button onClick={() => setTab('completed')}>
        Completados
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo oscuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Muy a menudo, el código sin memoización funciona bien. Si tus interacciones son lo suficientemente rápidas, es posible que no necesites memoización.

Puedes intentar aumentar la cantidad de elementos pendientes en `utils.js` y ver cómo cambia el comportamiento. Para empezar, este cálculo en particular no fue muy costoso, pero si el número de elementos crece significativamente, la mayor parte de la sobrecarga estará en volver a renderizar en lugar de filtrar. Continúa leyendo para ver cómo puedes optimizar el rerenderizado con `useMemo`.

<Solution />

</Recipes>

---

### Omitir el rerenderizado de componentes {/*skipping-re-rendering-of-components*/}

En algunos casos, `useMemo` también puede ayudar a optimizar el rendimiento del rerenderizado de componentes hijos. Para ilustrar esto, digamos que este componente `TodoList` pasa `visibleTodos` como prop al componente hijo `List`:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

Te habrás dado cuenta de que alternar la prop `theme` congela la aplicación por un momento, pero si eliminas `<List />` de tu JSX, se siente rápido. Esto te dice que vale la pena intentar optimizar el componente `List`.

**De forma predeterminada, cuando un componente se vuelve a renderizar, React vuelve a renderizar a todos sus hijos de forma recursiva.** Por eso, cuando `TodoList` se vuelve a renderizar con un `theme` diferente, el componente `List` *también* se vuelve a renderizar. Esto está bien para componentes que no requieren mucho cálculo para volverse a renderizar. Pero si has verificado que un nuevo renderizado es lento, puedes decirle a `List` que omita el nuevo renderizado cuando sus props sean las mismos que en el último renderizado envolviéndola en [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Con este cambio, `List` omitirá volver a renderizar si todas sus props son las *mismas* que en el último renderizado.** ¡Aquí es donde guardar en caché el cálculo se vuelve importante! Imagina que calculaste `visibleTodos` sin `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Cada vez que cambie el tema, este será una *array* diferente...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... por lo que las props de List nunca serán las mismas, y se volverán a renderizar cada vez */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**En el ejemplo anterior, la función `filterTodos` siempre crea una *array* *diferente*,** similar a cómo el objeto literal `{}` siempre crea un nuevo objeto. Normalmente, esto no sería un problema, pero significa que las props de `List` nunca serán las mismas, y tu optimización con [`memo`](/reference/react/memo) no funcionará. Aquí es donde `useMemo` es útil:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Le dice a React que guarde en caché tu cálculo entre renderizados...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...así que mientras estas dependencias no cambien...
  );
  return (
    <div className={theme}>
      {/* ...La lista recibirá las mismos props y puedes omitir el rerenderizado */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**Al envolver el cálculo de `visibleTodos` en `useMemo`, te aseguras de que tenga el *mismo* valor entre los renderizados** (hasta que cambien las dependencias). No *tienes* que envolver un cálculo en `useMemo` a menos que lo hagas por alguna razón específica. En este ejemplo, la razón es que lo pasas a un componente envuelto en [`memo`,](/reference/react/memo) y esto te permite omitir el rerenderizado. Hay algunas otras razones para agregar `useMemo` que se describen más adelante en esta página.

<DeepDive>

#### Memoizar nodos individuales de JSX {/*memoizing-individual-jsx-nodes*/}

En lugar de envolver `List` en [`memo`](/reference/react/memo), podrías envolver el nodo de JSX `<List />` en `useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

El comportamiento sería el mismo. Si `visibleTodos` no ha cambiado, `List` no se rerenderizará.

Un nodo de JSX como `<List items={visibleTodos} />` es un objeto como `{ type: List, props: { items: visibleTodos } }`. Crear este objeto es muy barato, pero React no sabe si su contenido es el mismo que la última vez o no. Esta es la razón por la que, de forma predeterminada, React volverá a renderizar el componente `List`.

Sin embargo, si React ve exactamente el mismo JSX que durante el renderizado anterior, no intentará volver a renderizar tu componente. Esto se debe a que los nodos JSX son [inmutables.](https://es.wikipedia.org/wiki/Objeto_inmutable) Un objeto de nodo JSX no podría haber cambiado con el tiempo, por lo que React sabe que es seguro omitir un nuevo renderizado. Sin embargo, para que esto funcione, el nodo tiene que *ser realmente el mismo objeto*, no simplemente tener el mismo aspecto en el código. Esto es lo que hace `useMemo` en este ejemplo.

Envolver manualmente los nodos JSX en `useMemo` no es conveniente. Por ejemplo, no puedes hacerlo condicionalmente. Comúnmente es por esto que se envuelven los componentes con [`memo`](/reference/react/memo) en lugar de envolver los nodos de JSX.

</DeepDive>

<Recipes titleText="La diferencia entre saltarse los renderizados y rerenderizar siempre" titleId="examples-rerendering">

#### Omitir el rerenderizado con `useMemo` y `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

En este ejemplo, el componente `List` se **ralentiza artificialmente** para que puedas ver qué sucede cuando un componente React que estás renderizando es realmente lento. Intenta cambiar las pestañas y alternar el tema.

Cambiar las pestañas se siente lento porque obliga a que `List` se rerenderice. Eso es de esperar porque `tab` ha cambiado, y necesitas reflejar la nueva elección del usuario en la pantalla.

A continuación, intenta alternar el tema. **¡Gracias a `useMemo` junto con [`memo`](/reference/react/memo), es rápido a pesar de la ralentización artificial!** El componente `List` omitió rerenderizar porque el *array* `visibleTodos` no ha cambiado desde el último renderizado. El *array* `visibleTodos` no ha cambiado porque tanto `todos` como `tab` (que pasas como dependencias a `useMemo`) no han cambiado desde el último renderizado.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Activos
      </button>
      <button onClick={() => setTab('completed')}>
        Completados
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo oscuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Nota: ¡<code>List</code> se ralentiza artificialmente!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // No hacer nada durante 500 ms para emular un código extremadamente lento
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Siempre rerenderizar un componente {/*always-re-rendering-a-component*/}

En este ejemplo, la implementación de `List` también se **ralentiza artificialmente** para que puedas ver qué sucede cuando algún componente de React que estás renderizando es realmente lento. Intenta cambiar las pestañas y alternar el tema.

A diferencia del ejemplo anterior, cambiar el tema también es lento ahora. Esto se debe a que **no hay una llamada a `useMemo` en esta versión,** por lo que `visibleTodos` siempre es un *array* diferente, y el componente `List` ralentizado no puede omitir el rerenderizado.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Activos
      </button>
      <button onClick={() => setTab('completed')}>
        Completados
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo oscuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: ¡<code>List</code> se ralentiza artificialmente!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // No hagas nada durante 500 ms para emular un código extremadamente lento
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Sin embargo, aquí está el mismo código **con la ralentización artificial eliminada.** ¿Se nota o no la falta de `useMemo`?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Activos
      </button>
      <button onClick={() => setTab('completed')}>
        Completados
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo oscuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Muy a menudo, el código sin memoización funciona bien. Si tus interacciones son lo suficientemente rápidas, no necesitas memoización.

Ten en cuenta que necesitas ejecutar React en modo de producción, deshabilitar las [Herramientas de Desarrollo de React](/learn/react-developer-tools) y usar dispositivos similares a los que tienen los usuarios de tu aplicación para tener una idea realista de lo que realmente está ralentizando tu aplicación.

<Solution />

</Recipes>

---

### Evitando que un efecto se ejecute con frecuencia {/*preventing-an-effect-from-firing-too-often*/}


Algunas veces, tú podrías querer usar un valor dentro de un [Effect:](/learn/synchronizing-with-effects)

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Esto crea un problema. [Cada valor reactivo debe ser declarado como dependencia de tú efecto.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Sin embargo, si tú declaras `options` como dependecia, hará que tu efecto se reconecte constantemente a chat room:


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Problema: Esta dependencia cambia en cada renderizado.
  // ...
```

Para solucionar esto, tú puedes envolver el objeto que necesitas llamar desde un efecto en `useMemo`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Solo cambia cuando roomId cambia

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Solo cambia cuando options cambia
  // ...
```

Esto asegura que el objeto `options` es el mismo entre re-renderizados si `useMemo` retorna el objeto cambiado.

Sin embargo, ya que `useMemo` es una optimización de rendimiento, no una garantía semántica, React podría descartar el valor en caché si [Existe una razón específica para hacerlo](#caveats). Esto tambien hará que el efecto se vuelva a ejecutar, **Por lo que es aún mejor eliminar la necesidad de depender de una función** moviendo tu objeto *dentro* del efecto:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ ¡No necesitas useMemo o dependencias de objetos!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Solo cambia cuando roomId cambia
  // ...
```

Ahora tú codigo es más simple y no necesita de`useMemo`. [Aprende más sobre cómo remover dependecias en los efectos.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)


### Memoizar una dependencia de otro Hook {/*memoizing-a-dependency-of-another-hook*/}

Supón que tienes un cálculo que depende de un objeto creado directamente en el cuerpo del componente:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Precaución: Dependencia de un objeto creado en el cuerpo del componente
  // ...
```

Depender de un objeto como este anula el sentido de la memoización. Cuando un componente se vuelve a renderizar, todo el código directamente dentro del cuerpo del componente se vuelve a ejecutar. **Las líneas de código que crean el objeto `searchOptions` también se ejecutarán en cada renderizado.** Dado que `searchOptions` es una dependencia de tu llamada a `useMemo`, y es diferente cada vez, React sabrá que las dependencias son diferentes desde la última vez, y recalculará `searchItems` cada vez.

Para solucionar esto, puedes memoizar al *propio* objeto `searchOptions` antes de pasarlo como una dependencia:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Solo cambia cuando cambia el texto

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Solo cambia cuando cambia allItems o searchOptions
  // ...
```

En el ejemplo anterior, si `text` no cambia, el objeto `searchOptions` tampoco cambiará. Sin embargo, una solución aún mejor es mover la declaración del objeto `searchOptions` *dentro* de la función de cálculo de `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Solo cambia cuando cambia `allItems` o text
  // ...
```

**Ahora tu cálculo depende directamente de `text` (que es un string y no puede ser "accidentalmente" nuevo como un objeto).**
Puedes usar un enfoque similar para evitar que [`useEffect`](/reference/react/useEffect) vuelva a activarse innecesariamente. Antes de intentar optimizar las dependencias con `useMemo`, ve si puede hacerlas innecesarias. [Lee sobre la eliminación de dependencias de Efectos.](/learn/removing-effect-dependencies)

---

### Memoizar una función {/*memoizing-a-function*/}

Supongamos que el componente `Form` está envuelto en [`memo`.](/reference/react/memo) Deseas pasarle una función como prop:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

De forma similar a cómo `{}` siempre crea un objeto diferente, declaraciones de funciones como `function() {}` y expresiones como `() => {}` producen una función *diferente* en cada renderizado. Por sí mismo, crear una nueva función no es un problema. ¡Esto no es algo que haya que evitar! Sin embargo, si el componente `Form` está memoizado, presumiblemente querrás omitir volver a renderizarlo cuando no haya cambiado ninguna prop. Una prop que es *siempre* diferente anularía el sentido de la memoización.

Para memoizar una función con `useMemo`, su función de cálculo tendría que devolver otra función:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

¡Esto parece torpe! **Memoizar funciones es lo suficientemente común como para que React tenga un Hook incorporado específicamente para eso. Envuelve tus funciones en [`useCallback`](/reference/react/useCallback) en lugar de `useMemo`** para evitar tener que escribir una función anidada adicional:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Los dos ejemplos anteriores son completamente equivalentes. El único beneficio de `useCallback` es que te permite evitar escribir una función anidada adicional dentro. No hace nada más. [Lee más sobre `useCallback`.](/reference/react/useCallback)

---

## Solución de problemas {/*troubleshooting*/}

### Mi cálculo se ejecuta dos veces en cada renderizado {/*my-calculation-runs-twice-on-every-re-render*/}

En [Modo estricto](/reference/react/StrictMode), React llamará a algunas de tus funciones dos veces en lugar de una:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Esta función de componente se ejecutará dos veces por cada renderizado.

  const visibleTodos = useMemo(() => {
    // Este cálculo se ejecutará dos veces si alguna de las dependencias cambia.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Esto se espera y no debería romper tu código.

Este comportamiento aplica **solo en desarrollo** y te ayuda a [mantener los componentes puros.](/learn/keeping-components-pure) React usa el resultado de una de las llamadas e ignora el resultado de la otra llamada. Siempre que tus funciones de componente y cálculo sean puras, no debería afectar tu lógica. Sin embargo, si accidentalmente son impuras, esto te ayuda a detectar los errores y corregirlos.

Por ejemplo, esta función de cálculo impuro muta un *array* que recibió como prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Error: mutar la prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

Debido a que React llama a tu cálculo dos veces, verás que la tarea pendiente se agregó dos veces, por lo que sabrás que hay un error. Tu cálculo no puede cambiar los objetos que recibió, pero puede cambiar cualquier objeto *nuevo* que haya creado durante el cálculo. Por ejemplo, si `filterTodos` siempre devuelve un *array* *diferente*, puedes mutar *ese* *array*:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correcto: mutar un objeto que creaste durante el cálculo
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Lee [mantener los componentes puros](/learn/keeping-components-pure) para obtener más información sobre la pureza.

Además, consulte las guías sobre [actualización de objetos](/learn/updating-objects-in-state) y [actualización de *arrays*](/learn/updating-arrays-in-state) sin mutación.

---

### Se supone que mi llamada a `useMemo` devuelve un objeto, pero devuelve undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Este código no funciona:

```js {1-2,5}
  // 🔴 No puedes devolver un objeto desde una función flecha con () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

En JavaScript, `() => {` inicia el cuerpo de la función flecha, por lo que la llave `{` no es parte de tu objeto. Es por eso que no devuelve un objeto y conduce a errores confusos. Podrías arreglarlo agregando paréntesis como `({` y `})`:

```js {1-2,5}
  // Esto funciona, pero es fácil que alguien lo rompa de nuevo.
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

Sin embargo, esto sigue siendo confuso y demasiado fácil de romper eliminando los paréntesis.

Para evitar este error, escriba una declaración `return` explícitamente:

```js {1-3,6-7}
  // ✅ Esto funciona y es explícito.
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Cada vez que mi componente se renderiza, el cálculo en `useMemo` vuelve a ejecutarse {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

¡Asegúrate de haber especificado el *array* de dependencias como segundo argumento!

Si olvidas el *array* de dependencia, `useMemo` volverá a ejecutar el cálculo cada vez:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalcula cada vez: sin *array* de dependencias
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Esta es la versión corregida que pasa el *array* de dependencia como segundo argumento:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ No recalcula innecesariamente
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Si esto no ayuda, entonces el problema es que al menos una de tus dependencias es diferente del renderizado anterior. Puedes depurar este problema registrando manualmente tus dependencias en la consola:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Luego, puedes hacer clic derecho en los *arrays* de diferentes renderizados en la consola y seleccionar "Almacenar como una variable global" para ambas. Suponiendo que el primero se guardó como `temp1` y el segundo se guardó como `temp2`, puedes usar la consola del navegador para verificar si cada dependencia en ambos *arrays* es la misma:

```js
Object.is(temp1[0], temp2[0]); // ¿La primera dependencia es la misma entre los *arrays*?
Object.is(temp1[1], temp2[1]); // ¿La segunda dependencia es la misma entre los *arrays*?
Object.is(temp1[2], temp2[2]); // ... y así sucesivamente para cada dependencia ...
```

Cuando encuentres qué dependencia está interrumpiendo la memoización, busca una manera de eliminarla o [memoízala también.](#memoizing-a-dependency-of-another-hook)

---

### Necesito llamar a `useMemo` para cada elemento de la lista en un bucle, pero no está permitido {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Supongamos que el componente `Chart` está envuelto en [`memo`](/reference/react/memo). Quieres omitir volver a renderizar cada `Chart` en la lista cuando el componente `ReportList` se vuelve a renderizar. Sin embargo, no puedes llamar a `useMemo` en un bucle:

```js {expectedErrors: {'react-compiler': [6]}} {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 No puedes llamar a useMemo en un bucle como este:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

En su lugar, extrae un componente para cada elemento y memoiza los datos de elementos individuales:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Llama a useMemo en el nivel superior:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Alternativamente, puedes eliminar `useMemo` y en su lugar envolver `Report` en [`memo`.](/reference/react/memo) Si la prop `item` no cambia, `Report` omitirá el rerenderizado, y por tanto `Chart` también lo hará:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
