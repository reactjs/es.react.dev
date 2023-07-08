---
title: useContext
---

<Intro>

`useContext` es un Hook de React que te permite leer y suscribirte a un [contexto](/learn/passing-data-deeply-with-context) desde tu componente.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Referencias {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Llama `useContext` en el nivel superior de tu componente para leer y suscribirte al [contexto.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `SomeContext`: El contexto que creaste previamente con [`createContext`](/reference/react/createContext). El propio contexto no guarda información, solo representa el tipo de información que puedes proporcionar o leer desde tus componentes.

#### Salidas {/*returns*/}

`useContext` devuelve el valor del contexto para el componente que lo llama. Está determinado como el `value` pasado al `SomeContext.Provider` más cercano arriba del componente que llama en el árbol. Si no existe tal proveedor, entonces el valor devuelto será el `defaultValue` que le pasaste a [`createContext`](/reference/react/createContext) para ese contexto. El valor devuelto siempre está actualizado. React rerenderiza automáticamente los componentes que leen algún contexto si este cambia.

#### Advertencias {/*caveats*/}

* La llamada de `useContext()` en un componente no es afectada por los proveedores devueltos desde el *mismo* componente. El `<Context.Provider>` correspondiente **necesita estar *arriba*** del componente que hace la llamada de `useContext()`.
* React **rerenderiza automáticamente** todos los hijos que usen un contexto particular empezando desde el proveedor que recibe un `value` diferente. Los valores anteriores y los siguientes son comparados con [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Saltarse el rerenderizado con [`memo`](/reference/react/memo) no evita que los hijos reciban valores de contexto frescos de arriba.
* Si tu sistema de compilación produce módulos duplicados en la salida (lo cual puede pasar si usas enlaces simbólicos), esto puede romper el contexto. Pasar algo a través del contexto solo funciona si `SomeContext` que usas para proporcionar el contexto y `SomeContext` que usas para leerlo son ***exactamente* el mismo objeto**, como está determinado por la comparación `===`.

---

## Uso {/*usage*/}


### Pasar datos de manera profunda en el árbol {/*passing-data-deeply-into-the-tree*/}

Llama `useContext` en el nivel superior de tu componente para leer y suscribirte al [contexto.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` devuelve el <CodeStep step={2}>valor del contexto</CodeStep> para el <CodeStep step={1}>contexto</CodeStep> que le pasaste. Para determinar el valor del contexto, React busca en el árbol de componentes y encuentra **el proveedor de contexto más cercano arriba** para ese contexto en particular.

Para pasar el contexto a un `Button`, envuélvelo o envuelve a uno de sus componentes padres dentro del proveedor de contexto correspondiente:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renderiza botones dentro ...
}
```

No importa cuántas capas de componentes hay entre el proveedor y el `Button`. Cuando un `Button` *en cualquier lugar* dentro de `Form` llama `useContext(ThemeContext)`, recibirá `"dark"` como valor.

<Pitfall>

`useContext()` siempre busca al proveedor más cercano *arriba* del componente que lo llama. Busca hacia arriba y **no** toma en cuenta a los proveedores en el componente desde el cual estás llamando `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Registrarse</Button>
      <Button>Iniciar sesión</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Actualizar los datos pasados a través del contexto {/*updating-data-passed-via-context*/}

A menudo, querrás que el contexto cambie a través del tiempo. Para actualizar el contexto, necesitas combinarlo con [el estado.](/reference/react/useState) Declara una variable de estado en el componente padre, y pasa el estado actual como el <CodeStep step={2}>valor de contexto</CodeStep> al proveedor.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Cambiar a tema claro
      </Button>
    </ThemeContext.Provider>
  );
}
```

Ahora cualquier `Button` dentro del proveedor recibirá el valor actual de `theme`. Si llamas `setTheme` para actualizar el valor de `theme` que pasaste al proveedor, todos los componentes `Button` se rerenderizarán con el nuevo valor `'light'`.

<Recipes titleText="Ejemplos de actualizar el contexto" titleId="examples-basic">

#### Actualizar un valor a través del contexto {/*updating-a-value-via-context*/}

En este ejemplo, el componente `MyApp` guarda una variable de estado la cual es luego pasada al proveedor de `ThemeContext`. Marcar la casilla "Dark mode" actualiza el estado. Cambiar el valor proporcionado rerenderiza todos los componentes que utilizan ese contexto.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Usar modo oscuro
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Bienvenido">
      <Button>Registrarse</Button>
      <Button>Iniciar sesión</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Fíjate que `value="dark"` pasa el string `"dark"`, pero `value={theme}` pasa el valor de la variable JavaScript `theme` con [llaves de JSX.](/learn/javascript-in-jsx-with-curly-braces) Las llaves también te permiten pasar valores de contexto que no son strings.

<Solution />

#### Actualizar un objeto a través del contexto {/*updating-an-object-via-context*/}

En este ejemplo, hay una variable de estado `currentUser` que guarda un objeto. Puedes combinar `{ currentUser, setCurrentUser }` en un único objeto y luego pasarlo a través del contexto dentro de `value={}`. Esto le permite a cualquier componente debajo, como `LoginButton`, leer tanto `currentUser` como `setCurrentUser`, y luego llamar `setCurrentUser` cuando sea necesario.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Bienvenido">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>Iniciaste sesión como {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Iniciar sesión como Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Múltiples contextos {/*multiple-contexts*/}

En este ejemplo, hay dos contextos independientes. `ThemeContext` proporciona el tema actual, el cual es un string, mientras que `CurrentUserContext` guarda el objeto que representa el usuario actual.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Usar modo oscuro
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Bienvenido">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Iniciaste sesión como {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        Nombre{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Apellido{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Iniciar sesión
      </Button>
      {!canLogin && <i>Llena ambos campos.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Extraer proveedores a un componente {/*extracting-providers-to-a-component*/}

A medida que tu aplicación crece, se espera que tengas una "pirámide" de contextos cercanos a la raíz de tu aplicación. No hay nada malo con eso. Sin embargo, si te disgusta estéticamente el anidamiento, puedes extraer los proveedores en un único componente. En este ejemplo, `MyProviders` oculta el "plumbing" y renderiza los componentes hijos pasados a él dentro de los proveedores necesarios. Fíjate que el estado de `theme` y `setTheme` es necesario en el propio `MyApp`, así que `MyApp` todavía posee esa pieza del estado.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Usar modo oscuro
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Bienvenido">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Iniciaste sesión como {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        Nombre{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Apellido{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Llena ambos campos.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Escalar con el contexto y un reducer {/*scaling-up-with-context-and-a-reducer*/}

En aplicaciones más grandes, es común combinar el contexto con un [reducer](/reference/react/useReducer) para extraer la lógica relacionada con algún estado fuera de los componentes. En este ejemplo, todo el "cableado" está escondido en el `TasksContext.js`, el cual contiene un reducer y dos contextos separados.

Lee una [guía completa](/learn/scaling-up-with-reducer-and-context) de este ejemplo.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Día libre en Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Agregar</button>
    </>
  );
}

let nextId = 3;
```

```js TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Guardar
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Especificar un valor por defecto {/*specifying-a-fallback-default-value*/}

Si React no puede encontrar ningún proveedor de ese <CodeStep step={1}>contexto</CodeStep> en particular en el árbol padre, el valor del contexto devuelto por `useContext()` será igual al <CodeStep step={3}>valor por defecto</CodeStep> que especificaste cuando [creaste ese contexto](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

El valor por defecto **nunca cambia**. Si quieres actualizar el contexto, úsalo en conjunto con el estado como está [descrito arriba.](#updating-data-passed-via-context)

A menudo, en lugar de `null`, hay algunos valores significativos más que puedes usar por defecto, por ejemplo:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

De esta manera, si accidentalmente renderizas algún componente sin su proveedor correspondiente, no se romperá. Esto también ayuda a que tus componentes funcionen bien en un ambiente de pruebas sin configurar un montón de proveedores en las pruebas.

En este ejemplo a continuación, el botón "Cambiar tema" siempre es claro, porque está **afuera de cualquier proveedor de contexto del tema** y el valor por defecto del contexto del tema es `'light'`. Intenta editar el tema por defecto para que sea `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Cambiar tema
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Bienvenido">
      <Button>Registrarse</Button>
      <Button>Iniciar sesión</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Sobreescribir el contexto para una parte del árbol {/*overriding-context-for-a-part-of-the-tree*/}

Puedes sobreescribir el contexto para una parte del árbol al envolver esa parte en un proveedor con un valor diferente.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

Puedes anidar y sobreescribir proveedores tantas veces como necesites.

<Recipes title="Ejemplos de sobreescribir el contexto">

#### Sobreescribir un tema {/*overriding-a-theme*/}

Aquí, el botón *dentro* del `Footer` recibe un valor del contexto diferente (`"light"`) que los objetos fuera (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Bienvenido">
      <Button>Registrarse</Button>
      <Button>Iniciar sesión</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Ajustes</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Encabezados anidados automáticamente {/*automatically-nested-headings*/}

Puedes "acumular" información cuando anidas proveedores de contexto. En este ejemplo, el componente `Section` hace seguimiento del `LevelContext` el cual especifica la profundidad del anidamiento de los sections. Lee el `LevelContext` del section padre, y proporciona el número de `LevelContext` incrementado por uno de sus hijos. Como resultado, el componente `Heading` puede decidir automáticamente cual de las etiquetas `<h1>`, `<h2>`, `<h3>`, ..., usará en base a dentro de cuántos componentes `Section` está siendo anidado.

Lee una [guía detallada](/learn/passing-data-deeply-with-context) de este ejemplo.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Título</Heading>
      <Section>
        <Heading>Encabezado</Heading>
        <Heading>Encabezado</Heading>
        <Heading>Encabezado</Heading>
        <Section>
          <Heading>Sub-encabezado</Heading>
          <Heading>Sub-encabezado</Heading>
          <Heading>Sub-encabezado</Heading>
          <Section>
            <Heading>Sub-sub-encabezado</Heading>
            <Heading>Sub-sub-encabezado</Heading>
            <Heading>Sub-sub-encabezado</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('¡El encabezado debe estar dentro de un Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Nivel desconocido: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Optimizar rerenderizados al pasar objetos y funciones {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Puedes pasar cualquier valor a través del contexto, incluyendo objetos y funciones.

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Aquí, el <CodeStep step={2}>valor del contexto</CodeStep> es un objeto de JavaScript con dos propiedades, una de las cuales es una función. Siempre que `MyApp` se rerenderice (por ejemplo, en una actualización de ruta), este será un objeto *diferente* apuntando a una función *diferente*, así que React también tendrá que rerenderizar todos los componentes en lo profundo del árbol que llamen `useContext(AuthContext)`.

En aplicaciones más pequeñas, esto no es un problema. Sin embargo, no hay necesidad de rerenderizarlas si los datos subyacentes, como `currentUser`, no han cambiado. Para ayudar a React a aprovechar esa información, puedes envolver la función `login` con [`useCallback`](/reference/react/useCallback) y envolver la creación del objeto en un [`useMemo`](/reference/react/useMemo). Esta es una optimización del rendimiento:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Como resultado de este cambio, incluso si `MyApp` necesita rerenderizarse, los componentes que llaman `useContext(AuthContext)` no se rerenderizarán a menos que `currentUser` haya cambiado. Lee más sobre [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) y [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Solución de problemas {/*troubleshooting*/}

### Mi componente no ve el valor desde mi proveedor {/*my-component-doesnt-see-the-value-from-my-provider*/}

Hay algunas maneras comunes en que esto puede ocurrir:

1. Estás renderizando `<SomeContext.Provider>` en el mismo componente (o debajo de) donde estás llamando `useContext()`. Mueve `<SomeContext.Provider>` *arriba y afuera* del componente que llama `useContext()`.
2. Puede que hayas olvidado envolver tu componente con `<SomeContext.Provider>`, o quizás lo colocaste en una parte diferente del árbol de la que pensabas. Revisa si la jerarquía está correcta utilizando [React DevTools.](/learn/react-developer-tools)
3. Puede que tengas un problema de compilación con tus herramientas que provoque que `SomeContext` como es visto desde el componente proveedor y que `SomeContext` como es visto desde el componente que lee sean dos objetos diferentes. Esto puede suceder si usas enlaces simbólicos, por ejemplo. Puedes verificar esto al asignarlos a variables globales como `window.SomeContext1` y `window.SomeContext2` y luego verificar si `window.SomeContext1 === window.SomeContext2` en la consola. Si no son el mismo, necesitas arreglar ese problema a nivel de herramienta de compilación.

### Siempre recibo `undefined` de mi contexto a pesar de que el valor por defecto es diferente {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Puede que tengas un proveedor sin un `value` en el árbol:

```js {1,2}
// 🚩 No funciona: No hay prop value
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

Si te olvidas de especificar un `value`, es como pasar `value={undefined}`.

Es posible que hayas utilizado un nombre de prop diferente por error:

```js {1,2}
// 🚩 No funciona: la prop debería llamarse "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

En ambos casos deberías ver una advertencia de React en la consola. Para solucionarlos llama a la prop `value`:

```js {1,2}
// ✅ Pasando la prop value
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Fíjate que el [valor por defecto de tu llamada `createContext(defaultValue)`](#specifying-a-fallback-default-value) solo es usado **si no hay ningún proveedor que coincida arriba en absoluto.** Si hay algún componente `<SomeContext.Provider value={undefined}>` en algún lugar del árbol, el componente llamando `useContext(SomeContext)` *recibirá* `undefined` como el valor del contexto.
