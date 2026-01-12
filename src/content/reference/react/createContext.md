---
title: createContext
---

<Intro>

`createContext` te permite crear un [contexto](/learn/passing-data-deeply-with-context) que los componentes pueden proporcionar o leer.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Puedes llamar a `createContext` fuera de cualquier componente para crear un contexto.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `defaultValue`: El valor que desees que tenga el contexto cuando no hay un proveedor de contexto coincidente en el árbol sobre el componente que lee el contexto. Si no tiene ningún valor predeterminado significativo, especifica `null`. El valor predeterminado se entiende como una reserva de "último recurso". Es estático y nunca cambia con el tiempo.

#### Devuelve {/*returns*/}

`createContext` devuelve un objeto de contexto.

<<<<<<< HEAD
**El objeto de contexto en sí no contiene ninguna información.** Representa _qué_ contexto pueden leer o proporcionar otros componentes. Por lo general, utilizará [`SomeContext.Provider`](#provider) en los componentes anteriores para especificar el valor de contexto y llamará a [`useContext(SomeContext)`](/reference/react/useContext) en los componentes siguientes para leerlo. El objeto de contexto tiene algunas propiedades:

* `SomeContext.Provider` Te permite proporcionar el valor de contexto a los componentes.
* `SomeContext.Consumer` Es una forma alternativa y poco utilizada de leer el valor del contexto..
=======
**The context object itself does not hold any information.** It represents _which_ context other components read or provide. Typically, you will use [`SomeContext`](#provider) in components above to specify the context value, and call [`useContext(SomeContext)`](/reference/react/useContext) in components below to read it. The context object has a few properties:

* `SomeContext` lets you provide the context value to components.
* `SomeContext.Consumer` is an alternative and rarely used way to read the context value.
* `SomeContext.Provider` is a legacy way to provide the context value before React 19.
>>>>>>> 2da4f7fbd90ddc09835c9f85d61fd5644a271abc

---

### `SomeContext` Provider {/*provider*/}

Envuelve tus componentes en un proveedor de contexto para especificar el valor de este contexto para todos los componentes dentro:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}
```

<Note>

Starting in React 19, you can render `<SomeContext>` as a provider. 

In older versions of React, use `<SomeContext.Provider>`.

</Note>

#### Props {/*provider-props*/}

* `value`: El valor que desees pasar a todos los componentes que leen este contexto dentro de este proveedor, sin importar cuán profundo sea. El valor de contexto puede ser de cualquier tipo. Un componente que llama a [`useContext(SomeContext)`](/reference/react/useContext) dentro del proveedor recibe el valor (`value`) del proveedor de contexto correspondiente más interno que se encuentra arriba.

---

### `SomeContext.Consumer` {/*consumer*/}

Antes de que existiera `useContext`, había una forma más antigua de leer el contexto:

```js
function Button() {
  // 🟡 Forma antigua (no recomendado)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Aunque esta forma aún funciona, **el código recién escrito debería leer el contexto con [`useContext()`](/reference/react/useContext) en su lugar:**

```js
function Button() {
  // ✅ Forma recomendada
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: Una función. React llamará a la función que pases con el valor de contexto actual determinado por el mismo algoritmo que [`useContext()`](/reference/react/useContext) y renderizará el resultado que devuelves de esta función. React también volverá a ejecutar esta función y actualizará la interfaz de usuario siempre que el contexto pasado desde los componentes principales haya cambiado.

---

## Uso {/*usage*/}

### Crear un contexto {/*creating-context*/}

El contexto permite que los componentes [pasen información en profundidad](/learn/passing-data-deeply-with-context) sin pasar props explícitamente.

Llama a `createContext` fuera de cualquier componente para crear uno o más contextos.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` devuelve un <CodeStep step={1}>objeto context</CodeStep>. Los componentes pueden leer el contexto pasándolo a [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

De forma predeterminada, los valores que reciben serán los <CodeStep step={3}>valores predeterminados</CodeStep> que se han especificado al crear los contextos. Sin embargo, esto por sí mismo no es útil porque los valores predeterminados nunca cambian.

El contexto es útil porque puede **proporcionar otros valores dinámicos a sus componentes:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

Ahora el componente `Page` y cualquier componente dentro de él, sin importar cuán profundo sea, "verán" los valores de contexto dados. Si los valores del contexto dados cambian, React volverá a renderizar los componentes leyendo el contexto también.

[Aprende más sobre leer y proporcionar un contexto, y consulta ejemplos.](/reference/react/useContext)

---

### Importación y exportación de contexto desde un archivo {/*importing-and-exporting-context-from-a-file*/}

A menudo, los componentes de diferentes archivos necesitarán acceso al mismo contexto. Por eso es común declarar contextos en un archivo separado. Luego puedes usar la declaración [`export`](https://developer.mozilla.org/es/docs/web/javascript/reference/statements/export) para hacer que el contexto esté disponible para otros archivos:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Los componentes declarados en otros archivos pueden usar la declaración [`import`](https://developer.mozilla.org/es/docs/web/javascript/reference/statements/import) para leer o proveer un contexto:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

Esto funciona de manera similar a la [importación y exportación de componentes.](/learn/importing-and-exporting-components)

---

## Solución de problemas {/*troubleshooting*/}

### No puedo encontrar la manera de cambiar el valor del contexto {/*i-cant-find-a-way-to-change-the-context-value*/}


Un código como este especifica el valor de contexto *predeterminado*:

```js
const ThemeContext = createContext('light');
```

Este valor nunca cambia. React solo usa este valor como respaldo si no puede encontrar un proveedor coincidente arriba.

<<<<<<< HEAD
Para hacer que el contexto cambie con el tiempo, [agrega estado y envuelve los componentes en un proveedor de contexto.](/reference/react/useContext#updating-data-passed-via-context)

=======
To make context change over time, [add state and wrap components in a context provider.](/reference/react/useContext#updating-data-passed-via-context)
>>>>>>> 2da4f7fbd90ddc09835c9f85d61fd5644a271abc
