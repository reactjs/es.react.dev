---
title: useMemo
---

<Intro>

`useMemo` es un React Hook que te permite almacenar en caché el resultado de un cálculo entre renderizaciones.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Evitando recálculos costosos {/*skipping-expensive-recalculations*/}

Para almacenar en caché un cálculo entre renderizaciones, envuélvelo llamando a `useMemo` en el nivel superior de tu componente:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Necesitas pasar dos cosas a `useMemo`:

1. Una <CodeStep step={1}>función de cálculo</CodeStep> la cual no toma argumentos, como `() =>`, y devuelve lo que querías calcular.
2. Una <CodeStep step={2}>lista de dependencias</CodeStep> incluyendo cada valor dentro de su componente que se usa dentro de su cálculo.

En el render inicial, el<CodeStep step={3}>valor</CodeStep> que obtendrá de `useMemo` será el resultado de llamar a su <CodeStep step={1}>cálculo</CodeStep>.

En cada procesamiento posterior, React comparará las <CodeStep step={2}>dependencias</CodeStep> con las dependencias que pasó durante el último procesamiento. Si ninguna de las dependencias ha cambiado (en comparación con [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo ` devolverá el valor que ya calculó antes. De lo contrario, React volverá a ejecutar su cálculo y devolverá el nuevo valor.

En otras palabras, `useMemo` almacena en caché un resultado de cálculo entre renderizaciones hasta que cambian sus dependencias.

**Veamos un ejemplo para ver cuándo es útil.**

De forma predeterminada, React volverá a ejecutar todo el cuerpo de su componente cada vez que se vuelva a renderizar. Por ejemplo, si esta `TodoList` actualiza su estado o recibe nuevos accesorios de su padre, la función `filterTodos` se volverá a ejecutar:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Por lo general, esto no es un problema porque la mayoría de los cálculos son muy rápidos. Sin embargo, si está filtrando o transformando un arreglo grande, o está realizando algún cálculo costoso, es posible que desee omitir hacerlo nuevamente si los datos no han cambiado. Si `todos` y `tab` son los mismos que durante el último renderizado, envolver el cálculo en `useMemo` como antes le permite reutilizar `visibleTodos` que ya calculó antes. Este tipo de almacenamiento en caché se denomina *[memoización.](https://es.wikipedia.org/wiki/Memoizaci%C3%B3n)*

<Note>

**Solo debe confiar en `useMemo` como una optimización del rendimiento.** Si tu código no funciona sin él, encuentra el problema subyacente y arréglalo primero. Luego puedes agregar `useMemo` para mejorar el rendimiento.

</Note>

<DeepDive title="¿Cómo saber si un cálculo es costoso?">

En general, a menos que estés creando o recorriendo miles de objetos, probablemente no sea costoso. Si deseas obtener más confianza, puede agregar un registro de consola para medir el tiempo dedicado a una pieza de código:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Esto mide la interacción que está midiendo (por ejemplo, escribiendo en la entrada). Luego verás registros como `filter array: 0.15ms` en tu consola. Si el tiempo total registrado suma una cantidad significativa (por ejemplo, '1 ms' o más), podría tener sentido memorizar ese cálculo. Como experimento, puedes envolver el cálculo en `useMemo` para verificar si el tiempo total registrado ha disminuido para esa interacción o no:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Se omite si todos y la pestaña no han cambiado.
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` no hará que el *primer* renderizado sea más rápido. Solo lo ayuda a omitir el trabajo innecesario en las actualizaciones.

Ten en cuenta que tu máquina probablemente sea más rápida que la de sus usuarios, por lo que es una buena idea probar el rendimiento con una ralentización artificial. Por ejemplo, Chrome ofrece una opción [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) para esto.

También ten en cuenta que medir el rendimiento en el desarrollo no le dará los resultados más precisos. (Por ejemplo, cuando el [Modo estricto](/apis/react/StrictMode) está activado, verás que cada componente se procesa dos veces en lugar de una vez). Para obtener los tiempos más precisos, cree su aplicación para producción y pruébela en un dispositivo como sus usuarios.

</DeepDive>

<DeepDive title="¿Debería agregar useMemo en todas partes?">

Si tu aplicación es como este sitio y la mayoría de las interacciones son toscas (como reemplazar una página o una sección completa), la memorización generalmente no es necesaria. Por otro lado, si su aplicación se parece más a un editor de dibujos y la mayoría de las interacciones son granulares (como formas en movimiento), entonces la memorización le resultará muy útil.

Optimizar con `useMemo` solo es valioso en algunos casos:

- El cálculo que estás poniendo en `useMemo` es notablemente lento y sus dependencias rara vez cambian.
- Cuando lo que pasa como prop a un componente envuelto en [`memo`.](/apis/react/memo) Y quieres omitir la re-renderización si el valor no ha cambiado. La memorización permite que tu componente se vuelva a renderizar solo cuando las dependencias son las mismas.
- El valor que estás pasando se usa más tarde como una dependencia de algún Hook. Por ejemplo, tal vez otro valor de cálculo `useMemo` dependa de ello. O tal vez dependa de este valor de [`useEffect.`](/apis/react/useEffect)

No hay ningún beneficio en envolver un cálculo en `useMemo` en otros casos. Tampoco hay un daño significativo en hacer eso, por lo que algunos equipos optan por no pensar en casos individuales y memorizar tanto como sea posible. La desventaja de este enfoque es que el código se vuelve menos legible. Además, no toda la memorización es efectiva: un solo valor que es "siempre nuevo" es suficiente para interrumpir la memorización de un componente completo.

**En la práctica, puede hacer que muchas memorizaciones sean innecesarias siguiendo algunos principios:**

1. Cuando un componente envuelve visualmente otros componentes, déjalo [aceptar JSX como hijos.](/learn/passing-props-to-a-component#passing-jsx-as-children) De esta manera, cuando el componente contenedor actualice su propio estado, React sabe que sus hijos no necesitan volver a renderizar.
1. Preferir el estado local y no [elevar el estado](/learn/sharing-state-between-components) más allá de lo necesario. Por ejemplo, no mantenga el estado transitorio como formularios y si un elemento se encuentra en la parte superior de su árbol o en una biblioteca de estado global.
1. Mantenga su [lógica de renderizado pura.](/learn/keeping-components-pure) Si volver a renderizar un componente causa un problema o produce algún artefacto visual notable, ¡Es un error en tu componente! Soluciona el error en lugar de agregar memorización.
1. Evite [Efectos innecesarios que actualizan el estado.](/learn/you-might-not-need-an-effect) La mayoría de los problemas de rendimiento en las aplicaciones de React son causados por cadenas de actualizaciones que se originan en Efectos que hacen que sus componentes se rendericen una y otra vez.
1. Intenta [eliminar las dependencias innecesarias de sus Efectos.](/learn/removing-effect-dependencies) Por ejemplo, en lugar de memorizar, suele ser más sencillo mover algún objeto o función dentro de un efecto o fuera del componente.

Si una interacción específica aún se siente lenta, [usa el generador de perfiles de React Developer Tools](/blog/2018/09/10/introducing-the-react-profiler.html) para ver qué componentes se beneficiarían más de la memorización y agregar memorización donde sea necesario. Estos principios hacen que sus componentes sean más fáciles de depurar y comprender, por lo que es bueno seguirlos en cualquier caso. A largo plazo, estamos investigando [hacer memorización granular automáticamente](https://www.youtube.com/watch?v=lGEMwh32soc) para solucionar esto de una vez por todas.

</DeepDive>

<Recipes titleText="La diferencia entre useMemo y calcular un valor directamente" titleId="examples-recalculation">

#### Saltarse el recálculo con `useMemo` {/*skipping-recalculation-with-usememo*/}

En este ejemplo, la implementación de `filterTodos` se **ralentiza artificialmente** para que pueda ver qué sucede cuando alguna función de JavaScript que está llamando durante el renderizado es realmente lenta. Intente cambiar las pestañas y alternar el tema.

Cambiar las pestañas se siente lento porque obliga a que el `filterTodos` ralentizado se vuelva a ejecutar. Eso es de esperar porque la `tab` ha cambiado, por lo que todo el cálculo *necesita* volver a ejecutarse. (Si tiene curiosidad por qué se ejecuta dos veces, se explica [aquí.](#my-calculation-runs-twice-on-every-re-render))

A continuación, intenta alternar el tema. **Gracias a `useMemo`, ¡Es rápido a pesar de la ralentización artificial!** La llamada lenta `filterTodos` se omitió porque tanto `todos` como `tab` (que pasa como dependencias a `useMemo`) no han cambiado desde entonces el último render.

<Sandpack>

```js App.js
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

```js TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Nota: <code>filterTodos</code> ¡Se ralentiza artificialmente!</b></p>
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

```js utils.js
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
    // No haga nada durante 500 ms para emular un código extremadamente lento
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

#### Siempre recalculando un valor {/*always-recalculating-a-value*/}

En este ejemplo, la implementación de `filterTodos` también se **ralentiza artificialmente** para que pueda ver qué sucede cuando alguna función de JavaScript que está llamando durante el renderizado es realmente lenta. Intente cambiar las pestañas y alternar el tema.

A diferencia del ejemplo anterior, cambiar el tema también es lento ahora. Esto se debe a que **no hay una llamada `useMemo` en esta versión**, por lo que se llama al `filterTodos` artificialmente ralentizado cada vez que se vuelve a renderizar. Se llama incluso si solo ha cambiado `tema`.

<Sandpack>

```js App.js
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

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Nota: <code>filterTodos</code> ¡Se ralentiza artificialmente!</b></p>
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

```js utils.js
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
    // No hagas nada durante 500 ms para emular un código extremadamente lento
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

```js App.js
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

```js TodoList.js active
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

```js utils.js
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

Muy a menudo, el código sin memorización funciona bien. Si sus interacciones son lo suficientemente rápidas, es posible que no necesite la memorización.

Puedes intentar aumentar la cantidad de elementos pendientes en `utils.js` y ver cómo cambia el comportamiento. Para empezar, este cálculo en particular no fue muy costoso, pero si el número de todos crece significativamente, la mayor parte de la sobrecarga estará en volver a renderizar en lugar de filtrar. Continúa  leyendo para ver cómo puede optimizar el renderizado con `useMemo`.

<Solution />

</Recipes>

---

### Omitir la re-renderización de componentes {/*skipping-re-rendering-of-components*/}

En algunos casos, `useMemo` también puede ayudar a optimizar el comportamiento de volver a renderizar componentes secundarios. Para ilustrar esto, digamos que este componente `TodoList` pasa `visibleTodos` como prop al componente secundario `List`:

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

Te habrás dado cuenta de que alternar la prop `theme` congela la aplicación por un momento, pero si eliminas `<List />` de tu JSX, se siente rápido. Esto le dice que vale la pena intentar optimizar el componente `List`.

**De forma predeterminada, cuando un componente se vuelve a renderizar, React vuelve a renderizar a todos sus elementos secundarios de forma recursiva.** Por eso, cuando `TodoList` se vuelve a renderizar con un `theme` diferente, el componente `List` *también* vuelve a renderizar. Esto está bien para componentes que no requieren mucho cálculo para volver a renderizar. Pero si has verificado que una nueva renderización es lenta, puedes decirle a `List` que omita la nueva renderización cuando sus props sean los mismos que en la última renderización envolviéndola en [`memo`:](/apis/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Con este cambio, `List` omitirá volver a renderizar si todos sus accesorios son *mismos* que en el último renderizado.** ¡Aquí es donde el almacenamiento en caché del cálculo se vuelve importante! Imagina que calculaste `visibleTodos` sin `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Cada vez que cambie el tema, esta será una arreglo diferente...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... por lo que los accesorios de List nunca serán los mismos, y se volverán a renderizar cada vez */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**En el ejemplo anterior, la función `filterTodos` siempre crea una arreglo *diferente*,** similar a cómo el objeto literal `{}` siempre crea un nuevo objeto. Normalmente, esto no sería un problema, pero significa que las props de `List` nunca serán las mismas, y su optimización [`memo`](/apis/react/memo) no funcionará. Aquí es donde `useMemo` es útil:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Le dice a React que almacene en caché su cálculo entre renderizaciones...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...así que mientras estas dependencias no cambien...
  );
  return (
    <div className={theme}>
      {/* ...La lista recibirá los mismos props y puedes omitir la re-renderización */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**Al envolver el cálculo de `visibleTodos` en `useMemo`, te aseguras de que tenga el *mismo* valor entre las representaciones** (hasta que cambien las dependencias). No *tienes* que envolver un cálculo en `useMemo` a menos que lo hagas por alguna razón específica. En este ejemplo, la razón es que lo pasa a un componente envuelto en [`memo`,](/api/react/memo) y esto le permite omitir la nueva representación. Hay algunas otras razones para agregar `useMemo` que se describen más adelante en esta página.

<DeepDive title="Memorización de nodos JSX individuales">

En lugar de envolver `List` en [`memo`](/apis/react/memo), podrías envolver el nodo `<List />` JSX en `useMemo`:

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

El comportamiento sería el mismo. Si `visibleTodos` no ha cambiado, `List` no se volverá a representar.

Un nodo JSX como `<List items={visibleTodos} />` es un objeto como `{ type: List, props: { items: visibleTodos } }`. Crear este objeto es muy barato, pero React no sabe si su contenido es el mismo que la última vez o no. Esta es la razón por la que, de forma predeterminada, React volverá a representar el componente `List`.

Sin embargo, si React ve exactamente el mismo JSX que durante el renderizado anterior, no intentará volver a renderizar su componente. Esto se debe a que los nodos JSX son [inmutables.](https://es.wikipedia.org/wiki/Objeto_inmutable) Un objeto de nodo JSX no podría haber cambiado con el tiempo, por lo que React sabe que es seguro omitir una nueva representación. Sin embargo, para que esto funcione, el nodo tiene que *ser realmente el mismo objeto*, no simplemente tener el mismo aspecto en el código. Esto es lo que hace `useMemo` en este ejemplo.

Envolver manualmente los nodos JSX en `useMemo` no es conveniente. Por ejemplo, no puedes hacer esto condicionalmente. Por lo general, envolvería los componentes con [`memo`](/apis/react/memo) en lugar de envolver los nodos JSX.

</DeepDive>

<Recipes titleText="La diferencia entre saltarse los renderizados y volver a renderizar siempre" titleId="examples-rerendering">

#### Omitiendo el volver a renderizar con `useMemo` y `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

En este ejemplo, el componente `List` se **ralentiza artificialmente** para que pueda ver qué sucede cuando un componente React que está renderizando es realmente lento. Intenta cambiar las pestañas y alternar el tema.

Cambiar las pestañas se siente lento porque obliga a que `List` se vuelva a procesar. Eso es de esperar porque la `tab` ha cambiado, por lo que debe reflejar la nueva elección del usuario en la pantalla.

A continuación, intenta alternar el tema. **Gracias a `useMemo` junto con [`memo`](/apis/react/memo), ¡Es rápido a pesar de la ralentización artificial!** El componente `List` omitió volver a renderizar porque el arreglo `visibleItems` no ha cambiado desde entonces el último render. El arreglo `visibleItems` no ha cambiado porque tanto `todos` como `tab` (que pasas como dependencias a `useMemo`) no han cambiado desde el último renderizado.

<Sandpack>

```js App.js
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

```js TodoList.js active
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
      <p><b>Nota: <code>List</code> ¡Se ralentiza artificialmente!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
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

```js utils.js
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

#### Siempre volver a renderizar un componente {/*always-re-rendering-a-component*/}

En este ejemplo, la implementación de `List` también se **ralentiza artificialmente** para que pueda ver qué sucede cuando algún componente de React que está renderizando es realmente lento. Intente cambiar las pestañas y alternar el tema.

A diferencia del ejemplo anterior, cambiar el tema también es lento ahora. Esto se debe a que **no hay una llamada `useMemo` en esta versión,** por lo que `visibleTodos` siempre es un arreglo diferente, y el componente `List` ralentizado no puede omitir la re-renderización.

<Sandpack>

```js App.js
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

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> ¡Se ralentiza artificialmente!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
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

```js utils.js
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

```js App.js
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

```js TodoList.js active
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

```js List.js
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

```js utils.js
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

Muy a menudo, el código sin memorización funciona bien. Si sus interacciones son lo suficientemente rápidas, no necesita memorización.

Ten en cuenta que necesita ejecutar React en modo de producción, deshabilitar [React Developer Tools](/learn/react-developer-tools) y usar dispositivos similares a los que tienen los usuarios de tu aplicación para tener una idea realista de lo que está pasando ralentizando su aplicación.

<Solution />

</Recipes>

---

### Memorizando una dependencia de otro Hook {/*memoizing-a-dependency-of-another-hook*/}

Supon que tienes un cálculo que depende de un objeto creado directamente en el cuerpo del componente:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Precaución: Dependencia de un objeto creado en el cuerpo del componente
  // ...
```

Depender de un objeto como este anula el punto de memorización. Cuando un componente se vuelve a renderizar, todo el código directamente dentro del cuerpo del componente se vuelve a ejecutar. **Las líneas de código que crean el objeto `searchOptions` también se ejecutarán en cada renderizado.** Dado que `searchOptions` es una dependencia de su llamada `useMemo`, y es diferente cada vez, React sabrá que las dependencias son diferentes desde la última vez, y recalcular `searchItems` cada vez.

Para solucionar esto, puede memorizar el objeto `searchOptions` *en sí mismo* antes de pasarlo como una dependencia:

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

En el ejemplo anterior, si el `text` no cambió, el objeto `searchOptions` tampoco cambiará. Sin embargo, una solución aún mejor es mover la declaración del objeto `searchOptions` *dentro* de la función de cálculo `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Solo cambia cuando cambia allItems o el text
  // ...
```

**Ahora su cálculo depende directamente del `text` (que es una cadena y no puede ser "accidentalmente" nuevo como un objeto).**
Puede usar un enfoque similar para evitar que [`useEffect`](/apis/react/useEffect) vuelva a activarse innecesariamente. Antes de intentar optimizar las dependencias con `useMemo`, vea si puede hacerlas innecesarias. [Lea sobre la eliminación de dependencias de efectos.](/learn/removing-effect-dependencies)

---

### Memorización de una función {/*memoizing-a-function*/}

Supongamos que el componente `Form` está envuelto en [`memo`.](/apis/react/memo) Desea pasarle una función como accesorio:

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

Similar a cómo `{}` siempre crea un objeto diferente, declaraciones de funciones como `function() {}` y expresiones como `() => {}` producen una función *diferente* en cada renderización. Por sí mismo, crear una nueva función no es un problema. ¡Esto no es algo para evitar! Sin embargo, si el componente `Form` está memorizado, presumiblemente querrá omitir volver a renderizarlo cuando no haya cambiado ningúna proop. Una prop que es *siempre* diferente anularía el punto de memorización.

Para memorizar una función con `useMemo`, su función de cálculo tendría que devolver otra función:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + product.id + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

¡Esto parece torpe! **Memorizar funciones es lo suficientemente común como para que React tenga un Hook incorporado específicamente para eso. Envuelva sus funciones en [`useCallback`](/apis/react/useCallback) en lugar de `useMemo`** para evitar tener que escribir una función anidada adicional:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + product.id + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Los dos ejemplos anteriores son completamente equivalentes. El único beneficio de `useCallback` es que le permite evitar escribir una función anidada adicional dentro. No hace nada más. [Lea más sobre `useCallback`.](/apis/react/useCallback)

---

## Referencia {/*reference*/}

### `useMemo(calcularValor, dependencias)` {/*usememo*/}

Llama a `useMemo` en el nivel superior de tu componente para declarar un valor memorizado:

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

[See more examples above.](#examples-recalculation)

#### Parámetros {/*parameters*/}

* `calcularValor`: La función que calcula el valor que desea memorizar. Debe ser puro, no debe aceptar argumentos y debe devolver un valor de cualquier tipo. React llamará a tu función durante el renderizado inicial. En renderizaciones posteriores, React devolverá el mismo valor nuevamente si las `dependencias` no han cambiado desde la última renderización. De lo contrario, llamará a `calcularValor`, devolverá su resultado y lo almacenará en caso de que pueda reutilizarse más tarde.

* `dependencias`: La lista de todos los valores reactivos a los que se hace referencia dentro del código `calcularValor`. Los valores reactivos incluyen props, estado y todas las variables y funciones declaradas directamente dentro del cuerpo de su componente. Si su linter está [configurado para React](/learn/editor-setup#linting), verificará que cada valor reactivo esté correctamente especificado como una dependencia. La lista de dependencias debe tener un número constante de elementos y escribirse en línea como `[dep1, dep2, dep3]`. React comparará cada dependencia con su valor anterior usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Retornos {/*returns*/}

En el renderizado inicial, `useMemo` devuelve el resultado de llamar a `calcularValor` sin argumentos.

Durante los renderizados posteriores, devolverá un valor ya almacenado del último renderizado (si las dependencias no han cambiado), o llamará a `calcularValor` nuevamente y devolverá el resultado que `calcularValor` ha devuelto.

#### Advertencias {/*caveats*/}

* `useMemo` es un Hook, por lo que solo puede llamarlo **en el nivel superior de su componente** o sus propios Hooks. No puedes llamarlo dentro de bucles o condiciones. Si lo necesita, extraiga un nuevo componente y mueva el estado a él.
* En modo estricto, React **llamará a su función de cálculo dos veces** para [ayudarle a encontrar impurezas accidentales.](#my-calculation-runs-twice-on-every-re-render) Esto es solo para desarrollo comportamiento y no afecta la producción. Si su función de cálculo es pura (como debería ser), esto no debería afectar la lógica de su componente. Se ignorará el resultado de una de las llamadas. 
* React **no descartará el valor almacenado en caché a menos que haya una razón específica para hacerlo.** Por ejemplo, en desarrollo, React descartará el caché cuando edite el archivo de su componente. Tanto en desarrollo como en producción, React desechará el caché si su componente se suspende durante el montaje inicial. En el futuro, React puede agregar más funciones que se aprovechen de desechar el caché; por ejemplo, si React agrega soporte incorporado para listas virtualizadas en el futuro, tendría sentido desechar el caché para los elementos que se desplazan hacia afuera. de la ventana gráfica de la tabla virtualizada. Esto debería coincidir con sus expectativas si confía en `useMemo` únicamente como una optimización del rendimiento. De lo contrario, una [variable de estado](/apis/react/useState#avoiding-recreating-the-initial-state) o una [ref](/apis/react/useRef#avoiding-recreating-the-ref-contents) puede ser más apropiado.

---

## Solución de problemas {/*troubleshooting*/}

### Mi cálculo se ejecuta dos veces en cada renderizado {/*my-calculation-runs-twice-on-every-re-render*/}

En [Modo estricto](/apis/react/StrictMode), React llamará a algunas de sus funciones dos veces en lugar de una:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Esta función de componente se ejecutará dos veces por cada procesamiento.

  const visibleTodos = useMemo(() => {
    // Este cálculo se ejecutará dos veces si alguna de las dependencias cambia.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Esto se espera y no debería romper su código.

Este comportamiento de **solo desarrollo** lo ayuda a [mantener los componentes puros.](/learn/keeping-components-pure) React usa el resultado de una de las llamadas e ignora el resultado de la otra llamada. Siempre que sus funciones de componente y cálculo sean puras, esto no debería afectar su lógica. Sin embargo, si son impuros accidentalmente, esto le ayuda a detectar los errores y corregirlos.

Por ejemplo, esta función de cálculo impuro muta un arreglo que recibió como prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Error: mutar la prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

Debido a que React llama a su cálculo dos veces, verá que la tarea pendiente se agregó dos veces, por lo que sabrá que hay un error. Su cálculo no puede cambiar los objetos que recibió, pero puede cambiar cualquier objeto *nuevo* que haya creado durante el cálculo. Por ejemplo, si `filterTodos` siempre devuelve un arreglo *diferente*, puedes mutar *ese* arreglo:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correcto: mutar un objeto que creaste durante el cálculo
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Lea [manteniendo los componentes puros](/learn/keeping-components-pure) para obtener más información sobre la pureza.

Además, consulte las guías sobre [actualización de objetos](/learn/updating-objects-in-state) y [actualizando arreglos](/learn/updating-arrays-in-state) sin mutación.

---

### Se supone que mi llamada `useMemo` devuelve un objeto, pero devuelve undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Este código no funciona:

```js {1-2,5}
  // 🔴 No puede devolver un objeto desde una función de flecha con () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

En JavaScript, `() => {` inicia el cuerpo de la función de flecha, por lo que la llave `{` no es parte de su objeto. Es por eso que no devuelve un objeto y conduce a errores confusos. Podrías arreglarlo agregando paréntesis como `({` y `})`:

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

¡Asegúrate de haber especificado el arreglo de dependencias como segundo argumento!

Si olvida el arreglo de dependencia, `useMemo` volverá a ejecutar el cálculo cada vez:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalcula cada vez: sin arreglo de dependencia
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Esta es la versión corregida que pasa el arreglo de dependencia como segundo argumento:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ No recalcula innecesariamente
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Si esto no ayuda, entonces el problema es que al menos una de sus dependencias es diferente del renderizado anterior. Puedes depurar este problema registrando manualmente sus dependencias en la consola:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Si esto no ayuda, entonces el problema es que al menos una de tus dependencias es diferente del renderizado anterior. Luego, puede hacer clic con el botón derecho en los arreglos de diferentes renderizaciones en la consola y seleccionar "Almacenar como una variable global" para ambas. Suponiendo que el primero se guardó como `temp1` y el segundo se guardó como `temp2`, puede usar la consola del navegador para verificar si cada dependencia en ambos arreglos es la misma: puede depurar este problema registrando manualmente sus dependencias en la consola:

```js
Object.is(temp1[0], temp2[0]); // ¿La primera dependencia es la misma entre los arreglos?
Object.is(temp1[1], temp2[1]); // ¿La segunda dependencia es la misma entre los arreglos?
Object.is(temp1[2], temp2[2]); // ... y así sucesivamente para cada dependencia ...
```

Cuando encuentre qué dependencia está interrumpiendo la memorización, busca una manera de eliminarla o [memorícela también.](#memoizing-a-dependency-of-another-hook)

---

### Necesito llamar a `useMemo` para cada elemento de la lista en un bucle, pero no está permitido {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Supongamos que el componente `Chart` está envuelto en [`memo`](/api/react/memo). Quieres omitir el volver a renderizar cada `Chart` en la lista cuando el componente `ReportList` se vuelve a renderizar. Sin embargo, no puedes llamar a `useMemo` en un bucle:

```js {5-11}
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

En su lugar, extrae un componente para cada elemento y memorice los datos de elementos individuales:

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
  // ✅ Llame a useMemo en el nivel superior:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Alternativamente, puede eliminar `useMemo` y en su lugar envolver `Report` en [`memo`.](/api/react/memo) `Chart` también omitirá la re-renderización:

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