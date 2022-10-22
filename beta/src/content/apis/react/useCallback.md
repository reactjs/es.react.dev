---
title: useCallback
---

<Intro>

`useCallback` es un Hook de React que te permite almacenar la definición de una función entre renderizados subsecuentes.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Omitir re-renderizados de componentes {/*skipping-re-rendering-of-components*/}

Cuando optimizas el rendimiento de renderizado, a veces necesitarás almacenar en caché las funciones que pasas a los componentes secundarios. Veamos primero la sintaxis para hacer esto, y luego veamos en qué casos es útil.

Para almacenar una función entre subsecuentes renderizados de tu componente, envuelve su definición 
en el Hook `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Debes enviar dos elementos a `useCallback`:

1. La definición de la función que quieres almacenar en caché entre renderizados subsecuentes.
2. Una <CodeStep step={2}>lista de dependencias</CodeStep> que incluya cada valor dentro de tu componente que se usa dentro de tu función.

En el primer renderizado, la <CodeStep step={3}>función retornada</CodeStep> por `useCallback` será la función que pasaste.

En los siguientes renderizados, React comparará las <CodeStep step={2}>dependencias</CodeStep> con aquellas que pasaste en el renderizado anterior. Si ninguna de las dependencias ha cambiado (comparadas con [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` retornará la misma función que antes. De lo contrario, `useCallback` retornará la función que pasaste en *este* renderizado.

En otras palabras, `useCallback` almacena una función entre renderizados subsecuentes hasta que sus dependencias cambien.

**Vamos a ver un ejemplo para entender cuándo esto es útil.**

Supongamos que estás pasando una función `handleSubmit` desde `ProductPage` hasta el componente `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

Notarás que cambiar la propiedad `theme` congela la aplicación por un momento, pero si pruebas eliminar `<ShippingForm />` de tu JSX, se siente rápido. Esto te dice que vale la pena intentar optimizar el componente `ShippingForm`.

**Por defecto, cuando un componente se renderiza nuevamente, React renderiza recursivamente a todos sus hijos.** Esto es porque, cuando `ProductPage` se renderiza nuevamente con un `theme` diferente, el componente `ShippingForm` *también* se renderiza nuevamente. Esto está bien para componentes que no requieren mucho cálculo para renderizarse nuevamente. Pero si has verificado que un renderizado es lento, puedes decirle a `ShippingForm` que omita el renderizado nuevamente cuando sus props son las mismas que en el último renderizado, envolviéndolo en [`memo`:](/apis/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Con este cambio, `ShippingForm` omitirá el nuevo renderizado si todas las props son las *mismas* que en el último renderizado.** Acá es donde el almacenamiento en caché de una función se vuelve importante. Imagina que definiste `handleSubmit` sin `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Cada vez que el tema cambie, esta será una función diferente...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... así las props de ShippingForm nunca serán iguales, y cada vez se renderizará nuevamente */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**En JavaScript, la expresión `function () {}` o `() => {}` siempre crea una función _diferente_,** similar a como el objeto literal `{}` siempre crea un nuevo objeto. Normalmente, esto no sería un problema, pero en este caso significa que las props de `ShippingForm` nunca serán las mismas, y tu optimización con [`memo`](/apis/react/memo) no funcionará. Aquí es donde `useCallback` se vuelve útil:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Dile a React que almacene tu función entre renderizados subsecuentes...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...siempre y cuando estas dependencias no cambien...

  return (
    <div className={theme}>
      {/* ...ShippingForm recibirá las mismas props y omitirá el renderizado subsecuente */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Al envolver `handleSubmit` en `useCallback`, te aseguras de que sea la *misma* función entre los renderizados subsecuentes** (hasta que las dependencias cambien). No *deberías* envolver una función en `useCallback` a menos de que lo hagas por alguna razón específica. En este ejemplo, la razón por la que pasamos `handleSubmit` a un componente envuelto en [`memo`](/apis/react/memo) es que esto le permite omitir el renderizado subsecuente. Existen otras razones por las que podrías necesitar `useCallback` que se describen más adelante en esta página.

<Note>

**Solo deberías pensar en `useCallback` como en una optimización de rendimiento.** Si tu código no funciona sin él, encuentra el problema subyacente y arréglalo primero. Luego puedes agregar `useCallback` para mejorar el rendimiento.

</Note>

<DeepDive title="¿Cómo se relaciona useCallback con useMemo?">

Ocasionalmente verás [`useMemo`](/apis/react/useMemo) junto a `useCallback`. Ambos son útiles cuando deseas optimizar un componente hijo. Te permiten [memoizar](https://es.wikipedia.org/wiki/Memoizaci%C3%B3n) (o, en otras palabras, almacenar en caché) aquello que estás enviando:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Llama a la función y almacena su resultado
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Almacena la función como tal
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

La diferencia está en *qué* te permiten almacenar:

* **[`useMemo`](/apis/react/useMemo) almacena el *resultado* de tu función.** En este ejemplo, se almacena el resultado de `computeRequirements(product)` para que no cambie a menos que `product` cambie. Esto permite enviar el objeto `requirements` sin re-renderizar `ShippingForm` innecesariamente. Cuando realmente sea necesario, React llamará a la función durante la renderización para calcular su resultado.
* **`useCallback` almacena *la función en sí.*** A diferencia de `useMemo`, no llama a la función recibida. En su lugar, almacena la función que proporcionaste para que `handleSubmit` *en sí* no cambie a menos que `productId` o `referrer` cambien. Esto permite enviar la función `handleSubmit` sin re-renderizar `ShippingForm` innecesariamente. Tu código no se llamará hasta que el usuario envíe el formulario.

Si ya estás familiarizado con [`useMemo`](/apis/react/useMemo), tal vez te sea útil ver `useCallback` como esto:

```js
// Implementación simplificada (dentro de React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Leer más sobre la diferencia entre `useMemo` y `useCallback`.](/apis/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive title="¿Siempre deberías usar useCallback?">

Si tu aplicación es similar a este sitio, y la mayoría de las interacciones son bastas (como reemplazar una página o una sección entera), la memoización generalmente es innecesaria. Por otro lado, si tu aplicación es similar a un editor de dibujo, y la mayor parte de sus interacciones son granulares (como mover figuras), entonces la memoización puede ser muy útil.

Almacenar una función con `useCallback` solo es beneficioso en unos pocos casos:

- Al enviarla como prop al componente envuelto en [`memo`](/apis/react/memo). Querrás omitir el renderizado subsecuente si el valor no ha cambiado. La memoización permite que tu componente se renderice nuevamente solo cuando las dependencias son las mismas.
- La función que estás enviando se usa más tarde como una dependencia de algún Hook. Por ejemplo, cuando otra función envuelta en `useCallback` depende de ella, o cuando dependes de dicha función desde [`useEffect.`](/apis/react/useEffect)

No existe ningún beneficio en envolver una función en `useCallback` en otros casos. Aunque tampoco afecta negativamente hacerlo, por lo que algunos equipos prefieren no enfocarse en los casos de uso individuales y memoizar todo lo posible. La desventaja de este enfoque es que el código se vuelve menos legible. Por otro lado, no toda la memoización es efectiva: un solo valor que "siempre es nuevo" es suficiente para romper la memoización de todo el componente.

Observa que `useCallback` no evita *crear* la función. Siempre estás creando una nueva función (¡y eso está bien!), pero React lo ignora y devuelve la función almacenada si las dependencias no han cambiado.

**En la práctica, puedes hacer que mucha memoización sea innecesaria siguiendo unos pocos principios:**

1. Cuando un componente envuelve visualmente a otros componentes, permite que [acepte JSX como hijos.](/learn/passing-props-to-a-component#passing-jsx-as-children) De esta manera, cuando el componente contenedor actualiza su propio estado, React sabe que sus hijos no necesitan volver a renderizarse.
1. Utiliza el estado local y no [eleves el estado](/learn/sharing-state-between-components) más allá de lo necesario. Por ejemplo, no mantengas estados transitorios como formularios y si un elemento está o no en la cima de tu árbol o en una biblioteca de estado global.
1. Mantén tu [lógica de renderización pura.](/learn/keeping-components-pure) Si volver a renderizar un componente genera un problema o produce algún artefacto visual notable, ¡es un error en tu componente! Arregla el error en lugar de agregar memoización.
1. Evita [Efectos innecesarios que actualizan el estado.](/learn/you-might-not-need-an-effect) La mayor parte de los problemas de rendimiento en aplicaciones de React son causados por cadenas de actualizaciones originadas en Efectos que provocan que tus componentes se rendericen una y otra vez.
1. Intenta [eliminar dependencias innecesarias de tus Efectos.](/learn/removing-effect-dependencies) Por ejemplo, en lugar de utilizar la memoización, a menudo es más simple mover algún objeto o función dentro de un Efecto o fuera del componente.

Si una interacción específica aún se siente lenta, [utiliza el perfilador de React Developer Tools](/blog/2018/09/10/introducing-the-react-profiler.html) para ver qué componentes se beneficiarían más de la memoización, para agregarla donde sea necesario. Estos principios hacen que tus componentes sean más fáciles de depurar y entender, por lo que es bueno seguirlos en cualquier caso. A largo plazo, estamos investigando [el uso de la memoización granular automática](https://www.youtube.com/watch?v=lGEMwh32soc) para resolver esto de una vez por todas.

</DeepDive>

<Recipes titleText="La diferencia entre useCallback y declarar la función directamente" titleId="examples-rerendering">

#### Omitir re-renderizados con `useCallback` y `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

En este ejemplo, el componente `ShippingForm` se **ralentiza artificialmente** para que puedas ver lo que sucede cuando un componente de React que estás renderizando es realmente lento. Intenta incrementar el contador y cambiar el tema.

Incrementar el contador se siente lento porque obliga al `ShippingForm` ralentizado a volver a renderizarse. Eso es lo que se espera dado que el contador ha cambiado, y por lo tanto, necesitas reflejar la nueva elección del usuario en la pantalla.

Luego, intenta cambiar el tema. **¡Gracias a `useCallback` junto con [`memo`](/apis/react/memo), es rápido a pesar del ralentizado artificial!** `ShippingForm` omitió el renderizado subsecuente porque la función `handleSubmit` no ha cambiado. La función `handleSubmit` no ha cambiado porque tanto `productId` como `referral` (las dependencias de tu `useCallback`) no han cambiado desde el último renderizado.

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo Oscuro
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagina que esto envía una request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // No hace nada por 500 ms para emular un componente lento
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Nota: ¡<code>ShippingForm</code> está artificialmente ralentizado!</b></p>
      <label>
        Número de items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Calle:
        <input name="street" />
      </label>
      <label>
        Ciudad:
        <input name="city" />
      </label>
      <label>
        Código postal:
        <input name="zipCode" />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

#### Siempre re-renderizar un componente {/*always-re-rendering-a-component*/}

En este ejemplo, la implementación de `ShoppingForm` también se **ralentiza artificialmente** para que puedas ver lo que sucede cuando un componente de React que estás renderizando es realmente lento. Intenta incrementar el contador y cambiar el tema.

A diferencia del ejemplo anterior, ¡cambiar el tema ahora también es lento! Esto es porque **no hay una llamada a `useMemo` en esta versión,** por lo que `handleSubmit` siempre es una nueva función, y el componente `ShoppingForm` ralentizado no puede omitir el re-renderizado.

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo Oscuro
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagina que esto envía una request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // No hace nada por 500 ms para emular un componente lento
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Nota: ¡<code>ShippingForm</code> está artificialmente ralentizado!</b></p>
      <label>
        Número de items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Calle:
        <input name="street" />
      </label>
      <label>
        Ciudad:
        <input name="city" />
      </label>
      <label>
        Código postal:
        <input name="zipCode" />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


Sin embargo, acá está el mismo código **con la ralentización artificial removida.** ¿Te parece que la falta de `useCallback` es notable o no?

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo Oscuro
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagina que esto envía una request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Número de items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Calle:
        <input name="street" />
      </label>
      <label>
        Ciudad:
        <input name="city" />
      </label>
      <label>
        Código postal:
        <input name="zipCode" />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


Generalmente, el código sin memoización funciona bien. Si tus interacciones son lo suficientemente rápidas, no necesitas de la memoización.

Ten en cuenta que necesitas correr React en modo de producción, deshabilitar [React Developer Tools](/learn/react-developer-tools), y usar dispositivos similares a los que tus usuarios tienen para obtener una idea real de lo que está ralentizando tu aplicación.

<Solution />

</Recipes>

---

### Updating state from a memoized callback {/*updating-state-from-a-memoized-callback*/}

Sometimes, you might need to update state based on previous state from a memoized callback.

This `handleAddTodo` function specifies `todos` as a dependency because it computes the next todos from it:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

You'll usually want your memoized functions to have as few dependencies as possible. When you read some state only to calculate the next state, you can remove that dependency by passing an [updater function](/apis/react/useState#updating-state-based-on-the-previous-state) instead:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

Here, instead of making `todos` a dependency of your function and reading it there, you pass an instruction about *how* to update the state (`todos => [...todos, newTodo]`) to React. [Read more about updater functions.](/apis/react/useState#updating-state-based-on-the-previous-state)

---

### Preventing an Effect from firing too often {/*preventing-an-effect-from-firing-too-often*/}

Sometimes, you might want to call a function from inside an [Effect:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

This creates a problem. [Every reactive value must be declared as a dependency of your Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) However, if you declare `createOptions` as a dependency, it will cause your Effect to constantly reconnect to the chat room:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problem: This dependency changes on every render
  // ...
```

To solve this, you can wrap the function you need to call from an Effect into `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes
  // ...
```

This ensures that the `createOptions` function is the same between re-renders if the `roomId` is the same. **However, it's even better to remove the need for a function dependency.** Move your function *inside* the Effect:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ No need for useCallback or function dependencies!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

Now your code is simpler and doesn't need `useCallback`. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Optimizing a custom Hook {/*optimizing-a-custom-hook*/}

If you're writing a [custom Hook,](/learn/reusing-logic-with-custom-hooks) it's recommended to wrap any functions that it returns into `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

This ensures that the consumers of your Hook can optimize their own code when needed.

---

## Reference {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Call `useCallback` at the top level of your component to declare a memoized callback:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[See more examples above.](#examples-rerendering)

#### Parameters {/*parameters*/}

* `fn`: The function value that you want to memoize. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render. On subsequent renders, React will return the same function again if the `dependencies` have not changed since the last render. Otherwise, it will give you the function that you have passed during the current render, and store it in case it can be reused later. React will not call the function. The function is returned to you so you can decide when and whether to call it.

* `dependencies`: The list of all reactive values referenced inside of the `fn` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm.

#### Returns {/*returns*/}

On the initial render, `useCallback` returns the `fn` function you have passed.

During subsequent renders, it will either return an already stored `fn`  function from the last render (if the dependencies haven't changed), or return the `fn` function you have passed during this render.

#### Caveats {/*caveats*/}

* `useCallback` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* React **will not throw away the cached function unless there is a specific reason to do that.** For example, in development, React throws away the cache when you edit the file of your component. Both in development and in production, React will throw away the cache if your component suspends during the initial mount. In the future, React may add more features that take advantage of throwing away the cache--for example, if React adds built-in support for virtualized lists in the future, it would make sense to throw away the cache for items that scroll out of the virtualized table viewport. This should match your expectations if you rely on `useCallback` as a performance optimization. Otherwise, a [state variable](/apis/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) or a [ref](/apis/react/useRef#avoiding-recreating-the-ref-contents) may be more appropriate.

---

## Troubleshooting {/*troubleshooting*/}

### Every time my component renders, `useCallback` returns a different function {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Make sure you've specified the dependency array as a second argument!

If you forget the dependency array, `useCallback` will return a new function every time:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Returns a new function every time: no dependency array
  // ...
```

This is the corrected version passing the dependency array as a second argument:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Does not return a new function unnecessarily
  // ...
```

If this doesn't help, then the problem is that at least one of your dependencies is different from the previous render. You can debug this problem by manually logging your dependencies to the console:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

You can then right-click on the arrays from different re-renders in the console and select "Store as a global variable" for both of them. Assuming the first one got saved as `temp1` and the second one got saved as `temp2`, you can then use the browser console to check whether each dependency in both arrays is the same:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

When you find which dependency is breaking memoization, either find a way to remove it, or [memoize it as well.](/apis/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### I need to call `useCallback` for each list item in a loop, but it's not allowed {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Suppose the `Chart` component is wrapped in [`memo`](/api/react/memo). You want to skip re-rendering every `Chart` in the list when the `ReportList` component re-renders. However, you can't call `useCallback` in a loop:

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useCallback in a loop like this:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Instead, extract a component for an individual item, and put `useCallback` there:

```js {5,12-21}
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
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Alternatively, you could remove `useCallback` in the last snippet and instead wrap `Report` itself in [`memo`.](/api/react/memo) If the `item` prop does not change, `Report` will skip re-rendering, so `Chart` will skip re-rendering too:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
