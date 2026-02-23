---
title: useCallback
---

<Intro>

`useCallback` es un Hook de React que te permite almacenar la definición de una función entre renderizados subsecuentes.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useCallback` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Referencia {/*reference*/}

### `useCallback(fn, dependencias)` {/*usecallback*/}

Llama a `useCallback` en el nivel superior de tu componente guardar en caché entre rerenderizados una definición de una función:

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

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `fn`: La función que deseas guardar en caché. Puede recibir cualquier argumento y devolver cualquier valor. React devolverá (¡no llamará!) tu función durante el renderizado inicial. En los renderizados subsecuentes, React devolverá la misma función nuevamente si las `dependencias` no han cambiado desde el último renderizado. Si no es así, React devolverá la función que pasaste durante el renderizado actual, y la almacenará en caso de que se necesite reutilizar más adelante. React no llamará a la función. La función se devolverá para que puedas decidir si y cuándo llamarla.

* `dependencias`: La lista de todos los valores reactivos dentro de la función `fn`. Los valores reactivos incluyen props, estado y todas las variables y funciones declaradas directamente dentro del cuerpo de tu componente. Si tu *linter* está [configurado para React](/learn/editor-setup#linting), verificará que cada valor reactivo esté debidamente especificado como una dependencia. La lista de dependencias debe tener un número constante de elementos y estar escrita en línea, de la forma `[dep1, dep2, dep3]`. React comparará cada dependencia con su valor anterior usando el algoritmo de comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Devuelve {/*returns*/}

En el renderizado inicial, `useCallback` devuelve la función `fn` que le has enviado. 

<<<<<<< HEAD
Durante los renderizados siguientes, puede devolver una función `fn` ya almacenada desde el último renderizado (si las dependencias no han cambiado), o devolver la función `fn` que hayas enviado durante el renderizado actual.
=======
During subsequent renders, it will either return an already stored `fn` function from the last render (if the dependencies haven't changed), or return the `fn` function you have passed during this render.
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

#### Advertencias {/*caveats*/}

* `useCallback` es un Hook, por lo que solo puedes llamarlo **en el nivel superior de tu componente** o en tus propios Hooks. No puedes llamarlo dentro de un ciclo ni de una condición. Si necesitas hacerlo, debes extraer un nuevo componente y mover el estado a él.
* React **no descartará la función almacenada a menos que haya una razón específica para hacerlo.** Por ejemplo, en el ambiente de desarrollo, React descarta la caché cuando editas algún archivo de tu componente. Tanto en desarrollo como en producción, React descartará la caché si tu componente se suspende durante el montaje inicial. En el futuro, es posible que React agregue más características que aprovechen el descarte de caché --por ejemplo, si React agrega soporte nativo para listas virtuales en el futuro, tendría sentido descartar la caché para los elementos que estén fuera de la vista de la tabla virtualizada. Esto debería cumplir con tus expectativas si dependes de `useCallback` como una optimización de rendimiento. De lo contrario, una [variable de estado](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) o una [referencia](/reference/react/useRef#avoiding-recreating-the-ref-contents) podrían ser más apropiadas.

---

## Uso {/*usage*/}

### Omitir rerenderizados de componentes {/*skipping-re-rendering-of-components*/}

Cuando optimizas el rendimiento del renderizado, a veces necesitarás almacenar en caché las funciones que pasas a los componentes hijos. Veamos primero la sintaxis para hacerlo y luego veamos en qué casos es útil.

Para almacenar una función entre rerenderizados de tu componente, envuelve su definición en el Hook `useCallback`:

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

1. La definición de la función que quieres almacenar en caché entre rerenderizados.
2. Una <CodeStep step={2}>lista de dependencias</CodeStep> que incluya cada valor dentro de tu componente que se usa dentro de tu función.

En el primer renderizado, la <CodeStep step={3}>función devuelta</CodeStep> por `useCallback` será la función que pasaste.

En los siguientes renderizados, React comparará las <CodeStep step={2}>dependencias</CodeStep> con aquellas que pasaste en el renderizado anterior. Si ninguna de las dependencias ha cambiado (comparadas con [`Object.is`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` devolverá la misma función que antes. De lo contrario, `useCallback` devolverá la función que pasaste en *este* renderizado.

En otras palabras, `useCallback` almacena una función entre renderizados subsecuentes hasta que sus dependencias cambien.

**Vamos a ver un ejemplo para entender cuándo esto es útil.**

Supongamos que estás pasando una función `handleSubmit` desde `ProductPage` hacia el componente `ShippingForm`:

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

**Por defecto, cuando un componente se renderiza nuevamente, React renderiza recursivamente a todos sus hijos.** Esto es porque, cuando `ProductPage` se renderiza nuevamente con un `theme` diferente, el componente `ShippingForm` *también* se renderiza nuevamente. Esto está bien para componentes que no requieren mucho cálculo para renderizarse nuevamente. Pero si has verificado que un renderizado es lento, puedes decirle a `ShippingForm` que omita el rerenderizado cuando sus props son las mismas que en el último renderizado, envolviéndolo en [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Con este cambio, `ShippingForm` omitirá el rerenderizado si todas las props son las *mismas* que en el último renderizado.** Acá es donde el almacenamiento en caché de una función se vuelve importante. Imagina que definiste `handleSubmit` sin `useCallback`:

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

**En JavaScript, la expresión `function () {}` o `() => {}` siempre crea una función _diferente_,** similar a como el objeto literal `{}` siempre crea un nuevo objeto. Normalmente, esto no sería un problema, pero en este caso significa que las props de `ShippingForm` nunca serán las mismas, y tu optimización con [`memo`](/reference/react/memo) no funcionará. Aquí es donde `useCallback` se vuelve útil:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Dile a React que almacene tu función entre rerenderizados...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...siempre y cuando estas dependencias no cambien...

  return (
    <div className={theme}>
      {/* ...ShippingForm recibirá las mismas props y omitirá el rerenderizado */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Al envolver `handleSubmit` en `useCallback`, te aseguras de que sea la *misma* función entre los renderizados subsecuentes** (hasta que las dependencias cambien). No *deberías* envolver una función en `useCallback` a menos de que lo hagas por alguna razón específica. En este ejemplo, la razón por la que pasamos `handleSubmit` a un componente envuelto en [`memo`](/reference/react/memo) es que esto le permite omitir el rerenderizado. Existen otras razones por las que podrías necesitar `useCallback` que se describen más adelante en esta página.

<Note>

**Solo deberías pensar en `useCallback` como en una optimización de rendimiento.** Si tu código no funciona sin él, encuentra el problema subyacente y arréglalo primero. Luego puedes agregar `useCallback` para mejorar el rendimiento.

</Note>

<DeepDive>

#### ¿Cómo se relaciona useCallback con useMemo? {/*how-is-usecallback-related-to-usememo*/}

Ocasionalmente verás [`useMemo`](/reference/react/useMemo) junto a `useCallback`. Ambos son útiles cuando deseas optimizar un componente hijo. Te permiten [memoizar](https://es.wikipedia.org/wiki/Memoizaci%C3%B3n) (o, en otras palabras, guardar en caché) aquello que estás enviando:

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

* **[`useMemo`](/reference/react/useMemo) almacena el *resultado* de tu función.** En este ejemplo, se almacena el resultado de `computeRequirements(product)` para que no cambie a menos que `product` cambie. Esto permite enviar el objeto `requirements` sin rerenderizar `ShippingForm` innecesariamente. Cuando realmente sea necesario, React llamará a la función durante el renderizado para calcular su resultado.
* **`useCallback` almacena *la función en sí.*** A diferencia de `useMemo`, no llama a la función recibida. En su lugar, almacena la función que proporcionaste para que `handleSubmit` *en sí* no cambie a menos que `productId` o `referrer` cambien. Esto permite enviar la función `handleSubmit` sin rerenderizar `ShippingForm` innecesariamente. Tu código no se llamará hasta que el usuario envíe el formulario.

Si ya estás familiarizado con [`useMemo`](/reference/react/useMemo), tal vez te sea útil ver `useCallback` como esto:

<<<<<<< HEAD
```js
// Implementación simplificada (dentro de React)
=======
```js {expectedErrors: {'react-compiler': [3]}}
// Simplified implementation (inside React)
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Lee más sobre la diferencia entre `useMemo` y `useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### ¿Deberías siempre usar useCallback? {/*should-you-add-usecallback-everywhere*/}

<<<<<<< HEAD
Si tu aplicación es similar a este sitio, y la mayoría de las interacciones son bastas (como reemplazar una página o una sección entera), la memoización generalmente es innecesaria. Por otro lado, si tu aplicación es similar a un editor de dibujo, y la mayor parte de sus interacciones son granulares (como mover figuras), entonces la memoización puede ser muy útil.

Almacenar una función con `useCallback` solo es beneficioso en unos pocos casos:
=======
If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.

Caching a function with `useCallback` is only valuable in a few cases:
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

- Al enviarla como prop al componente envuelto en [`memo`](/reference/react/memo). Querrás omitir el renderizado subsecuente si el valor no ha cambiado. La memoización permite que tu componente se renderice nuevamente solo cuando las dependencias no sean las mismas.
- La función que estás enviando se usa más tarde como una dependencia de algún Hook. Por ejemplo, cuando otra función envuelta en `useCallback` depende de ella, o cuando dependes de dicha función desde [`useEffect.`](/reference/react/useEffect)

No existe ningún beneficio en envolver una función en `useCallback` en otros casos. Aunque tampoco afecta negativamente hacerlo, por lo que algunos equipos prefieren no enfocarse en los casos de uso individuales y memoizar todo lo posible. La desventaja de este enfoque es que el código se vuelve menos legible. Por otro lado, no toda la memoización es efectiva: un solo valor que "siempre es nuevo" es suficiente para romper la memoización de todo el componente.

Observa que `useCallback` no evita *crear* la función. Siempre estás creando una nueva función (¡y eso está bien!), pero React lo ignora y devuelve la función en caché si las dependencias no han cambiado.

**En la práctica, puedes hacer que mucha memoización sea innecesaria siguiendo unos pocos principios:**

<<<<<<< HEAD
1. Cuando un componente envuelve visualmente a otros componentes, permite que [acepte JSX como hijos.](/learn/passing-props-to-a-component#passing-jsx-as-children) De esta manera, cuando el componente contenedor actualiza su propio estado, React sabe que sus hijos no necesitan volver a renderizarse.
1. Utiliza el estado local y no [eleves el estado](/learn/sharing-state-between-components) más allá de lo necesario. Por ejemplo, no mantengas estados transitorios —como formularios y si a un elemento se le hace *hover*— en la cima de tu árbol o en una biblioteca de estado global.
1. Mantén tu [lógica de renderizado pura.](/learn/keeping-components-pure) Si rerenderizar un componente genera un problema o produce algún artefacto visual notable, ¡es un error en tu componente! Arregla el error en lugar de agregar memoización.
1. Evita [Efectos innecesarios que actualizan el estado.](/learn/you-might-not-need-an-effect) La mayor parte de los problemas de rendimiento en aplicaciones de React son causados por cadenas de actualizaciones originadas en Efectos que provocan que tus componentes se rendericen una y otra vez.
1. Intenta [eliminar dependencias innecesarias de tus Efectos.](/learn/removing-effect-dependencies) Por ejemplo, en lugar de utilizar la memoización, a menudo es más simple mover algún objeto o función dentro de un Efecto o fuera del componente.
=======
1. When a component visually wraps other components, let it [accept JSX as children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Then, if the wrapper component updates its own state, React knows that its children don't need to re-render.
2. Prefer local state and don't [lift state up](/learn/sharing-state-between-components) any further than necessary. Don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library.
3. Keep your [rendering logic pure.](/learn/keeping-components-pure) If re-rendering a component causes a problem or produces some noticeable visual artifact, it's a bug in your component! Fix the bug instead of adding memoization.
4. Avoid [unnecessary Effects that update state.](/learn/you-might-not-need-an-effect) Most performance problems in React apps are caused by chains of updates originating from Effects that cause your components to render over and over.
5. Try to [remove unnecessary dependencies from your Effects.](/learn/removing-effect-dependencies) For example, instead of memoization, it's often simpler to move some object or a function inside an Effect or outside the component.
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

Si una interacción específica aún se siente lenta, [utiliza el perfilador de las Herramientas de Desarrollo de React](https://es.legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) para ver qué componentes se beneficiarían más de la memoización, para agregarla donde sea necesario. Estos principios hacen que tus componentes sean más fáciles de depurar y entender, por lo que es bueno seguirlos en cualquier caso. A largo plazo, estamos investigando [el uso de la memoización granular automática](https://www.youtube.com/watch?v=lGEMwh32soc) para resolver esto de una vez por todas.

</DeepDive>

<Recipes titleText="La diferencia entre useCallback y declarar la función directamente" titleId="examples-rerendering">

#### Omitir rerenderizados con `useCallback` y `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

En este ejemplo, el componente `ShippingForm` se **ralentiza artificialmente** para que puedas ver lo que sucede cuando un componente de React que estás renderizando es realmente lento. Intenta incrementar el contador y cambiar el tema.

Incrementar el contador se siente lento porque obliga al `ShippingForm` ralentizado a volver a renderizarse. Eso es lo que se espera dado que el contador ha cambiado, y por lo tanto, necesitas reflejar la nueva elección del usuario en la pantalla.

Luego, intenta cambiar el tema. **¡Gracias a `useCallback` junto con [`memo`](/reference/react/memo), es rápido a pesar del ralentizado artificial!** `ShippingForm` omitió el renderizado subsecuente porque la función `handleSubmit` no ha cambiado. La función `handleSubmit` no ha cambiado porque tanto `productId` como `referral` (las dependencias de tu `useCallback`) no han cambiado desde el último renderizado.

<Sandpack>

```js src/App.js
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

```js src/ProductPage.js active
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
  // Imagina que esto envía una petición...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
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

#### Siempre rerenderizar un componente {/*always-re-rendering-a-component*/}

En este ejemplo, la implementación de `ShoppingForm` también se **ralentiza artificialmente** para que puedas ver lo que sucede cuando un componente de React que estás renderizando es realmente lento. Intenta incrementar el contador y cambiar el tema.

A diferencia del ejemplo anterior, ¡cambiar el tema ahora también es lento! Esto es porque **no hay una llamada a `useMemo` en esta versión,** por lo que `handleSubmit` siempre es una nueva función, y el componente `ShoppingForm` ralentizado no puede omitir el rerenderizado.

<Sandpack>

```js src/App.js
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

```js src/ProductPage.js active
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
  // Imagina que esto envía una petición...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
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


Sin embargo, acá está el mismo código **con la ralentización artificial eliminada.** ¿Te parece que la falta de `useCallback` es notable o no?

<Sandpack>

```js src/App.js
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

```js src/ProductPage.js active
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
  // Imagina que esto envía una petición...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
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

Ten en cuenta que necesitas correr React en modo de producción, deshabilitar las [Herramientas de Desarrollo de React](/learn/react-developer-tools), y usar dispositivos similares a los que tus usuarios tienen para obtener una idea real de lo que está ralentizando tu aplicación.

<Solution />

</Recipes>

---

### Actualizar estado desde un callback en caché {/*updating-state-from-a-memoized-callback*/}

En ocasiones, podrías necesitar actualizar el estado basado en su valor anterior desde un callback en caché.

La función `handleAddTodo` especifica `todos` como una dependencia, porque calcula los siguientes *todos* a partir de ella:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Por lo general es mejor que tus funciones almacenadas tengan el menor número de dependencias posibles. Cuando lees un estado solamente para calcular un estado subsecuente, puedes remover esa dependencia al enviar una [función de actualización](/reference/react/useState#updating-state-based-on-the-previous-state) en su lugar:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No se necesita la dependencia `todos`
  // ...
```

Aquí, en lugar de hacer que `todos` sea una dependencia de tu función y leerla allí, envías a React una instrucción sobre *cómo* actualizar el estado (`todos => [...todos, newTodo]`). [Lee más sobre las funciones de actualización.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Prevenir que un Efecto se dispare frecuentemente {/*preventing-an-effect-from-firing-too-often*/}

En ocasiones, es posible que desees llamar a una función desde un [Efecto:](/learn/synchronizing-with-effects)

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
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Esto genera un problema. [Todo valor reactivo debe ser declarado como una dependencia de tu Efecto.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Sin embargo, si declaras `createOptions` como una dependencia, esto provocará que tu Efecto se reconecte constantemente al chat:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problema: Esta dependencia cambia en cada renderizado
  // ...
```

Para solventar esto, puedes envolver la función que necesitas llamar desde un Efecto con `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Solo cambia cuando roomId cambia

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Solo cambia cuando createOptions cambia
  // ...
```

Esto asegura que la función `createOptions` sea la misma entre renderizados subsecuentes, siempre que `roomId` sea el mismo. **Sin embargo, es aún mejor eliminar la necesidad de una dependencia de la función.** Mueve tu función *dentro* del Efecto:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ No es necesario usar useCallback ni dependencias de función
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Solo cambia cuando roomId cambia
  // ...
```

Ahora tu código es mucho más simple y no requiere de `useCallback`. [Aprende más sobre eliminar dependencias de Efectos.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Optimizar un Hook personalizado {/*optimizing-a-custom-hook*/}

Si estás escribiendo un [Hook personalizado,](/learn/reusing-logic-with-custom-hooks) es recomendable envolver cualquier función que el Hook devuelva con `useCallback`:

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

Esto asegura que los consumidores de tu Hook puedan optimizar su propio código cuando sea necesario.

---

## Solución de problemas {/*troubleshooting*/}

### Cada vez que mi componente se renderiza, `useCallback` devuelve una función diferente {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

¡Asegúrate de haber especificado el *array* de dependencias como un segundo argumento!

Si olvidas el *array* de dependencias, `useCallback` devolverá una nueva función cada vez:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Devuelve una función cada vez: no existe un array de dependencias
  // ...
```

Esta es la versión corregida, enviando el *array* de dependencias como segundo argumento:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ No devuelve una nueva función innecesariamente
  // ...
```

Si esto no ayuda, entonces el problema es que al menos una de tus dependencias es diferente al renderizado anterior. Puedes depurar este problema manualmente registrando tus dependencias en la consola:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Después, puedes hacer click derecho en los *arrays* de diferentes renderizados en la consola y seleccionar la opción de "Guardar como variable global" para ambos. Suponiendo que el primero se haya guardado con el nombre `temp1` y el segundo con el nombre `temp2`, puedes usar la consola del navegador para verificar si cada dependencia en ambos *arrays* es la misma:

```js
Object.is(temp1[0], temp2[0]); // ¿Es la primera dependencia la misma entre los arrays?
Object.is(temp1[1], temp2[1]); // ¿Es la segunda dependencia la misma entre los arrays?
Object.is(temp1[2], temp2[2]); // ... y así consecutivamente para cada dependencia ...
```

Cuando encuentres cuál dependencia está rompiendo la memoización, puedes encontrar una manera de eliminarla o [memoízala también.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Necesito llamar `useCallback` para cada elemento de una lista dentro de un ciclo, pero no es permitido {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Suponiendo que el componente `Chart` está envuelto en [`memo`](/reference/react/memo). Deseas omitir el rerenderizado en cada `Chart` en la lista cuando el componente `ReportList` se rerenderiza. Sin embargo, no puedes llamar a `useCallback` dentro de un ciclo:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 No puedes llamar a useCallback dentro de un ciclo así:
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

En su lugar, extrae un componente para un elemento individual, y coloca `useCallback` allí:

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
  // ✅ Llama a useCallback en el nivel superior:
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

De forma alternativa, podrías eliminar `useCallback` en el último fragmento y envolver `Report` con [`memo`](/reference/react/memo) en su lugar. Si la prop `item` no cambia, `Report` omitirá el rerenderizado, por lo que `Chart` también lo hará:

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
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
