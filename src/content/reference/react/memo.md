---
title: memo
---

<Intro>

`memo` te permite saltarte el rerenderizado de un componente cuando sus props no han cambiado.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Envuelve un componente en `memo` para obtener una versión _memoizada_ de ese componente. Esta versión memoizada de tu componente usualmente no se rerenderizará cuando su componente padre se rerenderice siempre y cuando sus props no hayan cambiado. Pero puede que aún así React la rerenderice: la memoización es solo una optimización de rendimiento, no una garantía.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `Component`: El componente que quieres memoizar. El `memo` no modifica este componente, pero devuelve un nuevo componente memoizado en su lugar. Cualquier componente válido de React, incluyendo funciones y componentes [`forwardRef`](/apis/react/forwardRef), es aceptado.

* **opcional** `arePropsEqual`: Una función que acepta dos parámetros: las props previas del componente y las nuevas. Debería devolver `true` si las props antiguas y las nuevas son iguales: es decir, si el componente renderizará la misma salida y se comportará de la misma manera con las nuevas props que con las antiguas. De lo contrario, debería devolver `false`.

#### Devuelve {/*returns*/}

`memo` devuelve un nuevo componente de React. Se comporta de la misma manera que el componente proporcionado a `memo` excepto que React no siempre lo rerenderizará cuando su padre sea rerenderizado a menos que sus props hayan cambiado.

---

## Uso {/*usage*/}

### Saltar el rerenderizado cuando las props no han cambiado {/*skipping-re-rendering-when-props-are-unchanged*/}

React normalmente rerenderiza un componente siempre que su padre se rerenderiza. Con `memo`, puedes crear un componente que no se rerenderizará cuando su padre se rerenderice siempre y cuando sus nuevas props sean las mismas que sus antiguas props. Dicho componente se dice que está *memoizado*.

Para memoizar un componente, envuélvelo en una llamada a `memo` y usa el valor que devuelve en lugar de tu componente original:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

Un componente de React siempre debería tener [lógica de renderizado pura.](/learn/keeping-components-pure) Esto significa que debe devolver la misma salida si sus props, estado, y contexto no han cambiado. Al usar `memo`, le estás diciendo a React que tu componente cumple con este requerimiento, así React no necesita rerenderizar tu componente siempre y cuando sus props no hayan cambiado. Cuando usas `memo`, tu componente aún se rerenderizará si su propio estado cambia o si un contexto que usa cambia.

En este ejemplo, fíjate que el componente `Greeting` se rerenderiza siempre que se cambia `name` (porque esa es una de sus props), pero no cuando se cambia `address` (porque no se pasa a `Greeting` como una prop):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**Solo deberías depender de `memo` como una optimización de rendimiento.** Si tu código no funciona sin él, encuentra el problema subyacente y soluciónalo primero. Después puedes añadir `memo` para mejorar el rendimiento.

</Note>

<DeepDive>

#### ¿Deberías añadir memo en todos lados? {/*should-you-add-memo-everywhere*/}

Si tu aplicación es como este sitio, y la mayoría de las interacciones son bruscas (como reemplazar una página o una sección completa), la memoización es usualmente innecesaria. Por otro lado, si tu aplicación es más como un editor de dibujos, y la mayoría de las interacciones son granulares (como mover formas), entonces puede que la memoización sea muy útil.

Optimizar con `memo` solo vale la pena cuando tu componente se rerenderiza a menudo con las mismas props, y su lógica de rerenderizado es cara. Si no hay retraso perceptible cuando tu componente se rerenderiza, `memo` es innecesario. Ten en cuenta que `memo` es completamente inútil si las props pasadas a tu componente son *siempre diferentes,* como si pasas un objeto o una función plana definida durante el renderizado. Esta es la razón por la que a menudo necesitarás [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) y [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) junto con `memo`.

No hay ningún beneficio al envolver un componente en `memo` en otros casos. No hay perjuicio significativo al hacerlo tampoco, así que algunos equipos eligen no pensar en casos individuales, y memoizar todo lo posible. La desventaja de este enfoque es que el código se vuelve menos legible. También, no todas las memoizaciones son efectivas: un solo valor que es "siempre nuevo" es suficiente para romper la memoización para un componente entero.

**En la práctica, puedes hacer que mucha memoización sea innecesaria siguiendo algunos principios:**

1. Cuando un componente visualmente envuelve a otros componentes, permítele [aceptar JSX como hijos.](/learn/passing-props-to-a-component#passing-jsx-as-children) De esta manera, cuando el componente que envuelve actualiza su propio estado, React sabe que sus hijos no necesitan rerenderizarse.
1. Prefiere el estado local y no [levantes el estado](/learn/sharing-state-between-components) más lejos de lo necesario. Por ejemplo, no guardes estado transitorio —como formularios y si un elemento está recibiendo _hover_— en la cima de tu árbol o en una biblioteca de estado global.
1. Mantén tu [lógica de renderizado pura.](/learn/keeping-components-pure) Si volver a renderizar un componente causa un problema o produce algún artefacto visual notorio, ¡es un bug en tu componente! Arregla el bug en lugar de añadir memoización.
1. Evita [Efectos innecesarios que actualizan el estado.](/learn/you-might-not-need-an-effect) La mayoría de problemas de rendimiento en las aplicaciones de React son causados por cadenas de actualizaciones originadas por Efectos que causan que tus componentes se rendericen una y otra vez.
1. Trata de [eliminar dependencias innecesarias de tus Efectos.](/learn/removing-effect-dependencies) Por ejemplo, en lugar de la memoización, a menudo es más simple mover algún objeto o una función dentro de un Efecto o fuera del componente.

Si una interacción específica se siente retrasada, [usa el perfilador de las Herramientas de Desarrollo de React](https://es.legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) para ver qué componentes se beneficiarían más de la memoización, y añade la memoización donde sea necesario. Estos principios hacen que tus componentes sean fáciles de depurar y entender, así que es bueno seguirlos en cualquier caso. A largo plazo, estamos investigando poder [hacer memoización granular automáticamente](https://www.youtube.com/watch?v=lGEMwh32soc) para solucionar esto de una vez por todas.

</DeepDive>

---

### Actualizar un componente memoizado usando el estado {/*updating-a-memoized-component-using-state*/}

Incluso cuando un componente es memoizado, todavía se rerenderizará cuando su propio estado cambie. La memoización solo tiene que ver con las props que son pasadas al componente desde su padre.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Si asignas una variable de estado a su valor actual, React se saltará el rerenderizado de tu componente incluso sin `memo`. Puede que todavía veas que la función de tu componente se llame una vez más, pero el resultado será descartado.

---

### Actualizar un componente memoizado utilizando un contexto {/*updating-a-memoized-component-using-a-context*/}

Incluso cuando un componente es memoizado, todavía se rerenderizará cuando un contexto que está usando cambie. La memoización solo tiene que ver con las props que son pasadas al componente desde su padre.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

Para hacer que tu componente se rerenderice solo cuando una _parte_ de algún contexto cambie, divide tu componente en dos. Lee lo que necesitas del contexto en el componente exterior, y pásalo a un hijo memoizado como una prop.

---

### Minimizar los cambios en las props {/*minimizing-props-changes*/}

Cuando usas `memo`, tu componente se rerenderiza siempre que cualquier prop no sea *superficialmente igual* a como era previamente. Esto significa que React compara cada prop en tu componente con el valor previo de esa prop utilizando la comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Fíjate que `Object.is(3, 3)` es `true`, pero `Object.is({}, {})` es `false`.


Para aprovechar al máximo `memo`, minimiza las veces que las props cambian. Por ejemplo, si la prop es un objeto, evita que el padre vuelva a crear ese objeto cada vez usando [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Una mejor manera de minimizar los cambios en las props es asegurarse de que los componentes acepten la información mínima necesaria en sus props. Por ejemplo, puede aceptar valores individuales en lugar de un objeto entero:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Incluso los valores individuales pueden a veces ser proyectados a los que cambian con menor frecuencia. Por ejemplo, este es un componente que acepta un booleano para indicar la presencia de un valor en lugar de el propio valor:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Cuando necesitas pasar una función a un componente memoizado, o bien declárala fuera de tu componente y de esa manera nunca cambia, o bien utiliza [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) para cachear su definición entre rerenderizados.

---

### Especificar una función comparadora personalizada {/*specifying-a-custom-comparison-function*/}

En raros casos puede que sea inviable minimizar los cambios de las props de un componente memoizado. En ese caso, puedes proporcionar una función comparadora personalizada, que React usará para comparar las props antiguas y las nuevas en lugar de usar igualdad superficial. Esta función es pasada como segundo parámetro a `memo`. Debería devolver `true` solo si las nuevas props resultarían en la misma salida que las props antiguas; de lo contrario debería devolver `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

Si haces esto, usa el panel de rendimiento en las herramientas de desarrollo en tu navegador para asegurarte de que tu función comparadora en realidad es más rápida que rerenderizar el componente. Puede que te sorprendas.

Cuando hagas mediciones de rendimiento, asegúrate de que React se está ejecutando en modo de producción.

<Pitfall>

Si proporcionas una implementación `arePropsEqual` personalizada, **debes comparar todas las props, incluyendo las funciones.** Las funciones a menudo [se cierran sobre](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) las props y el estado de los componentes padres. Si devuelves `true` cuando `oldProps.onClick !== newProps.onClick`, tu componente se mantendrá "viendo" las props y el estado de un renderizado previo dentro de su manejador `onClick`, lo que lleva a errores muy confusos.

Evita hacer verificaciones profundas de igualdad dentro de `arePropsEqual` a menos que estés 100% seguro de que la estructura de datos con la que estás trabajando tiene una profundidad limitada conocida. **Las verificaciones profundas de igualdad pueden volverse increíblemente lentas** y pueden congelar tu aplicación por varios segundos si alguien luego cambia la estructura de datos.

</Pitfall>

---

## Solución de problemas {/*troubleshooting*/}
### Mi componente se re-renderiza cuando una prop es un objeto, array, o una función {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React compara las props antiguas y las nuevas con igualdad superficial: es decir, considera si cada nueva prop tiene la misma referencia que la prop antigua. Si creas un nuevo objeto o array cada vez que el padre se rerenderice, incluso si los elementos individuales son los mismos cada uno, React aún considerará que se ha cambiado. Similarmente, si creas una nueva función cuando renderizas el componente padre, React considerará que ha cambiado incluso si la función tiene la misma definición. Evita esto al [simplificar las props o memoizar las props en el componente padre](#minimizng-props-changes).
