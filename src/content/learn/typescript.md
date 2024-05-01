---
title: Usar TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript es una forma popular de añadir definiciones de tipos a bases de código JavaScript. De manera predeterminada, TypeScript [soporta JSX](/learn/writing-markup-with-jsx) y puedes obtener soporte completo para React Web añadiendo [`@types/react`](https://www.npmjs.com/package/@types/react) y [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) a tu proyecto.

</Intro>

<YouWillLearn>

* [TypeScript con Componentes de React](/learn/typescript#typescript-with-react-components)
* [Ejemplos de tipado con Hooks](/learn/typescript#example-hooks)
* [Tipos comunes de `@types/react`](/learn/typescript/#useful-types)
* [Lugares de aprendizaje adicional](/learn/typescript/#further-learning)

</YouWillLearn>

## Instalación {/*installation*/}

Todos los [frameworks React de grado de producción](/learn/start-a-new-react-project#production-grade-react-frameworks) ofrecen soporte para el uso de TypeScript. Sigue la guía específica del framework para la instalación:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Añadir TypeScript a un proyecto React existente {/*adding-typescript-to-an-existing-react-project*/}

Para instalar la última versión de las definiciones de tipos de React:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

Las siguientes opciones del compilador deben ser configuradas en tu `tsconfig.json`:

1. `dom` debe incluirse en [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Nota: Si no se especifica la opción `lib`, `dom` se incluye por defecto).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) debe configurarse con una de las opciones válidas. `preserve` debería ser suficiente para la mayoría de las aplicaciones.
  Si vas a publicar una biblioteca, consulta la [documentación `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) para saber qué valor elegir.

## TypeScript con Componentes de React {/*typescript-with-react-components*/}

<Note>

Cada archivo que contenga JSX debe usar la extensión de archivo `.tsx`. Esta es una extensión específica de TypeScript que indica a TypeScript que este archivo contiene JSX.

</Note>

Escribir TypeScript con React es muy similar a escribir JavaScript con React. La diferencia clave cuando se trabaja con un componente es que puedes proporcionar tipos para las props de tu componente. Estos tipos se pueden usar para comprobar la corrección y proporcionar documentación en línea en los editores.

Tomando el [componente `MyButton`](/learn#components) de la guía [Inicio Rápido](/learn), podemos añadir un tipo que describa el `title` para el botón:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Bienvenido a mi aplicación</h1>
      <MyButton title="Soy un botón" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Estos entornos de pruebas pueden manejar código TypeScript, pero no ejecutan el comprobador de tipos. Esto significa que puedes modificar los entornos de pruebas de TypeScript para aprender, pero no obtendrás errores de tipo ni advertencias. Para obtener la comprobación de tipos, puedes usar el [TypeScript Playground](https://www.typescriptlang.org/play) o usar un entorno de pruebas en línea más completo.

</Note>

Esta sintaxis en línea es la forma más sencilla de proporcionar tipos para un componente, aunque una vez que empiezas a tener unos cuantos campos para describir puede llegar a ser inmanejable. En su lugar, puedes utilizar una `interface` o `type` para describir las props del componente:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** El texto que se mostrará dentro del botón */
  title: string;
  /** Si se puede interactuar con el botón */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Bienvenido a mi aplicación</h1>
      <MyButton title="Soy un botón desactivado" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

El tipo que describe las props de tu componente puede ser tan simple o tan complejo como necesites, aunque debería ser un tipo de objeto descrito con `type` o `interface`. Puedes aprender sobre cómo TypeScript describe objetos en [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) pero también puedes estar interesado en usar [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) para describir una prop que puede ser uno de varios tipos diferentes y la guía [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) para casos de uso más avanzados.


## Ejemplos de Hooks {/*example-hooks*/}

Las definiciones de tipos de `@types/react` incluyen tipos para los Hooks incorporados, por lo que puedes usarlos en tus componentes sin ninguna configuración adicional. Están construidos para tener en cuenta el código que escribes en tu componente, por lo que obtendrás [tipos inferidos](https://www.typescriptlang.org/docs/handbook/type-inference.html) la mayor parte del tiempo e idealmente no necesitarás manejar las minucias de proporcionar los tipos.

Sin embargo, podemos ver algunos ejemplos de cómo proporcionar tipos para Hooks.

### `useState` {/*typing-usestate*/}

El [Hook `useState`](/reference/react/useState) reutilizará el valor pasado como estado inicial para determinar cuál debe ser el tipo del valor. Por ejemplo:

```ts
// Infiere el tipo como "boolean"
const [enabled, setEnabled] = useState(false);
```

<<<<<<< HEAD
Asignará el tipo `boolean` a `enabled`, y `setEnabled` será una función que acepte un argumento `boolean`, o una función que devuelva un `boolean`. Si quieres proporcionar explícitamente un tipo para el estado, puedes hacerlo proporcionando un argumento de tipo a la llamada `useState`:
=======
This will assign the type of `boolean` to `enabled`, and `setEnabled` will be a function accepting either a `boolean` argument, or a function that returns a `boolean`. If you want to explicitly provide a type for the state, you can do so by providing a type argument to the `useState` call:
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

```ts 
// Definiendo explícitamente el tipo como "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

Esto no es muy útil en este caso, pero un caso común en el que es posible que desees proporcionar un tipo es cuando tienes un tipo de unión. Por ejemplo, `status` puede ser uno de varios strings diferentes:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

O bien, como se recomienda en [Principios para la estructuración del estado](/learn/choosing-the-state-structure#principles-for-structuring-state), puedes agrupar estados relacionados en un objeto y describir las diferentes posibilidades a través de objetos de tipo:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

El [Hook `useReducer`](/reference/react/useReducer) es un Hook más complejo que recibe una función reductora y un estado inicial. Los tipos para la función reductora se infieren a partir del estado inicial. Opcionalmente, puedes proporcionar un argumento de tipo a la llamada del `useReducer` para dar un tipo al estado, pero generalmente es mejor establecer el tipo en el estado inicial:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Bienvenido a mi contador</h1>

      <p>Contador: {state.count}</p>
      <button onClick={addFive}>Sumar 5</button>
      <button onClick={reset}>Reiniciar</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


Usamos TypeScript en algunos lugares clave:

 - `interface State` describe la estructura del estado del reductor.
 - `type CounterAction` describe las diferentes acciones que puedes ser despachadas al reductor.
 - `const initialState: State` proporciona un tipo para el estado inicial, y también el tipo que `useReducer` utiliza por defecto.
 - `stateReducer(state: State, action: CounterAction): State` define los tipos para los argumentos y el valor de devolución de la función reductora.

Una alternativa más explícita para definir el tipo en `initialState` es proporcionar un argumento de tipo a `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

El [Hook `useContext`](/reference/react/useContext) es una técnica para pasar datos hacia abajo en el árbol de componentes sin tener que pasar props a través de los componentes. Se utiliza creando un componente proveedor y, a menudo, creando un Hook para consumir el valor en un componente hijo.

El tipo del valor proporcionado por el contexto se infiere a partir del valor pasado a la llamada de `createContext`:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Aspecto actual: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Esta técnica funciona cuando tienes un valor por defecto que tiene sentido - pero hay casos ocasionales en los que no, y en esos casos `null` puede parecer razonable como valor por defecto. Sin embargo, para permitir que el sistema de tipos entienda tu código, necesitas establecer explícitamente `ContextShape | null` en el `createContext`.

Esto causa el problema de que necesitas eliminar el `| null` en el tipo para los consumidores de contexto. Nuestra recomendación es que el Hook compruebe su existencia en tiempo de ejecución y lance un error si no está presente:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Este ejemplo es más sencillo, pero puedes imaginar un objeto más complejo aquí
type ComplexObject = {
  kind: string
};

// El context se crea con `| null` en el tipo, para reflejar con exactitud el valor predeterminado.
const Context = createContext<ComplexObject | null>(null);

// El `| null` será eliminado mediante la verificación en el Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Objeto actual: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

Los hooks [`useMemo`](/reference/react/useMemo) crearán/reaccederán a un valor memorizado desde una llamada a una función, reejecutando la función sólo cuando las dependencias pasadas como segundo parámetro cambien. El resultado de llamar al Hook se infiere del valor de devolución de la función en el primer parámetro. Se puede ser más explícito proporcionando un argumento de tipo al Hook.

```ts
// El tipo de visibleTodos se infiere del valor de devolución de filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

El [`useCallback`](/reference/react/useCallback) proporciona una referencia estable a una funcion siempre y cuando las dependencias pasadas como segundo parámetro sean las mismas. Al igual que con `useMemo`, el tipo de la función se infiere del valor de devolución de la función en el primer parámetro, y puedes ser más explícito al proporcionar un argumento de tipo al Hook.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

Cuando trabajas en el modo estricto de TypeScript, `useCallback` necesita que agregues tipos para los parámetros en tu función callback. Esto se debe a que el tipo del callback se infiere a partir del valor de devolución de la función, y sin parámetros no se puede entender completamente el tipo.

Dependiendo de tus preferencias de estilo de código, podrías usar las funciones `*EventHandler` de los tipos de React para proporcionar el tipo para el controlador de eventos al mismo tiempo que defines el callback:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## Tipos útiles {/*useful-types*/}

Hay un conjunto bastante amplio de tipos que provienen del paquete `@types/react`, vale la pena leerlo cuando te sientas cómodo con cómo interactúan React y TypeScript. Puedes encontrarlos [en la carpeta de React en DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Cubriremos algunos de los tipos más comunes aquí.

### Eventos del DOM {/*typing-dom-events*/}

Cuando trabajas con eventos del DOM en React, el tipo del evento suele inferirse a partir del controlador de eventos. Sin embargo, cuando desear extraer una función para ser pasada a un controlador de eventos, necesitarás establecer de manera explícita el tipo del evento.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Cámbiame");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Valor: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Existen muchos tipos de eventos disponibles en los tipos de React - la lista completa se puede encontrar [aquí](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373), la cual se basa en los [eventos más populares del DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

Al determinar el tipo que estás buscando, puedes mirar primero la información emergente para el controlador de eventos que estás utilizando, lo cual mostrará el tipo del evento.

Si necesitas utilizar un evento que no está incluido en esta lista, puedes emplear el tipo `React.SyntheticEvent`, que es el tipo base para todos los eventos.

### Elementos hijos {/*typing-children*/}

Hay dos caminos comunes para describir los hijos de un componente. El primero es utilizar el tipo `React.ReactNode`, que es una unión de todos los tipos posibles que se pueden pasar como hijos en JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Esta es una definición muy amplia de hijos. El segundo es utilizar el tipo `React.ReactElement`, que es sólo elementos JSX y no primitivas JavaScript como strings o numbers:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Ten en cuenta que no puedes usar TypeScript para describir que los hijos son un cierto tipo de elementos JSX, por lo que no puedes usar el sistema de tipos para describir un componente que sólo acepta hijos `<li>`.

Puedes ver un ejemplo tanto de `React.ReactNode` como de `React.ReactElement` con el verificador de tipos en [este playground de TypeScript](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Props de estilo {/*typing-style-props*/}

Cuando utilizas estilos en linea en React, puedes emplear `React.CSSProperties` para describir el objeto que se pasa a la prop `style`. Este tipo es una unión de todas las posibles propiedades CSS y es una forma efectiva de garantizar que estás proporcionando propiedades CSS válidas a la prop `style`, además de obtener autocompletado en tu editor.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Recursos adicionales {/*further-learning*/}

Esta guía ha abordado los fundamentos para usar TypeScript con React, pero hay mucho más por aprender.
Las páginas individuales de la API en la documentación pueden contener információn más detallada sobre cómo utilizarlas con TypeScript.

Recomendamos los siguientes recursos:

 - [The TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) es la documentación oficial para TypeScript, y abarca la mayoría de las características clave del lenguaje.

 - [The TypeScript release notes](https://devblogs.microsoft.com/typescript/) cubre las nuevas características en profundidad.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) es una hoja de referencia mantenida por la comunidad que trata sobre cómo utilizar TypeScript con React, abordando muchos casos útiles y proporcionando un enfoque más amplio que este documento.

 - [TypeScript Community Discord](https://discord.com/invite/typescript) es un lugar excelente para hacer preguntas y obtener ayuda con problemas de TypeScript y React.
