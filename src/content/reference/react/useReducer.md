---
title: useReducer
---

<Intro>

`useReducer` es un Hook de React que te permite agregar un [reducer](/learn/extracting-state-logic-into-a-reducer) a tu componente.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Llama a `useReducer` en el nivel superior de tu componente para gestionar su estado con un [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `reducer`: La función reductora que debe retornar el estado inicial. Debe ser pura, debe tomar el estado y la acción como argumentos, y debe devolver el siguiente estado. El estado y la acción pueden ser de cualquier tipo. 
* `initialArg`: El valor a partir del cual se calcula el estado inicial. Puede ser un valor de cualquier tipo. Cómo se calcula el estado inicial depende del siguiente argumento `init`.
**opcional** `init`: La función inicializadora que especifica cómo se calcula el estado inicial. Si no se especifica, el estado inicial se establece en `initialArg`. En caso contrario, el estado inicial es el resultado de llamar a `init(initialArg)`.

#### Retorna {/*returns*/}

`useReducer` devuelve un array con exactamente dos valores:

1. El estado actual. Durante el primer renderizado, se establece a `init(initialArg)` o `initialArg` (si no hay `init`).
2. La [función `dispatch`](#dispatch) que permite actualizar el estado a un valor diferente y activar una nueva renderización.

#### Advertencias {/*caveats*/}

* `useReducer` es un Hook, por lo que sólo puedes llamarlo **en el nivel superior de tu componente** o en tus propios Hooks. No puedes llamarlo dentro de bucles o condiciones. Si lo necesitas, extrae un nuevo componente y mueve el estado a él.
* En Modo Estricto, React **llamará a tu reducer e inicializador dos veces** para [ayudarte a encontrar impurezas accidentales](#my-reducer-or-initializer-function-runs-twice) Este es un comportamiento sólo de desarrollo y no afecta a la producción. Si tu reducer e inicializador son puros (como deberían ser), esto no debería afectar tu lógica. El resultado de una de las llamadas se ignora.

---

### función `dispatch` {/*dispatch*/}

La función `dispatch` devuelta por `useReducer` te permite actualizar el estado a un valor diferente y activar una nueva renderización. Es necesario pasar la acción como único argumento a la función `dispatch`:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React establecerá el siguiente estado al resultado de llamar a la función `reducer` que has proporcionado con el `state` actual y la acción que has pasado a `dispatch`.

#### Parámetros {/*dispatch-parameters*/}

* `action`: La acción realizada por el usuario. Puede ser un valor de cualquier tipo. Por convención, una acción suele ser un objeto con una propiedad `type` que lo identifica y, opcionalmente, otras propiedades con información adicional.

#### Retorna {/*dispatch-returns*/}

Las funciones `dispatch` no tienen valor de retorno.

#### Advertencias {/*setstate-caveats*/}

* La función `dispatch` **sólo actualiza la variable de estado para el *siguiente* renderizado**. Si lees la variable de estado después de llamar a la función `dispatch`, [seguirás obteniendo el valor antiguo](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) que estaba en la pantalla antes de la llamada.

* Si el nuevo valor que proporcionas es idéntico al `state` actual, determinado por una comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **saltará el renderizado del componente y sus hijos.** Esto es una optimización. React aún puede necesitar llamar a tu componente antes de ignorar el resultado, pero no debería afectar a tu código.

* React [agrupa las actualizaciones de estado.](/learn/queueing-a-series-of-state-updates) Actualiza la pantalla **después de que todos los manejadores de eventos se hayan ejecutado** y hayan llamado a sus funciones `set`. Esto evita múltiples rerenderizados durante un único evento. En el raro caso de que necesites forzar a React a actualizar la pantalla antes, por ejemplo para acceder al DOM, puedes usar [`flushSync`.](/apis/react-dom/flushsync)

---

## Uso {/*usage*/}

### Agregar un reducer a un componente {/*adding-a-reducer-to-a-component*/}

Invoca `useReducer` en la parte superior de tu componente para manejar el estado con un [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` retorna un array con exactamente dos elementos:

1. El <CodeStep step={1}>estado actual</CodeStep> de esta variable de estado, inicialmente asignado al <CodeStep step={3}>estado inicial</CodeStep> que proporcionaste.
2. La función <CodeStep step={2}>`dispatch` </CodeStep> que te permite cambiarlo en respuesta a la interacción.

Para actualizar lo que aparece en pantalla, llama a <CodeStep step={2}>`dispatch`</CodeStep> con un objeto que representa lo que hizo el usuario, llamado *acción*:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React pasará el estado actual y la acción a tu <CodeStep step={4}>función reducer</CodeStep>. Tu reducer calculará y retornará el siguiente estado. React almacenará ese siguiente estado, renderizará tu componente con él y actualizará la UI.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` es muy similar a [`useState`](/reference/react/useState), pero te permite mover la lógica de actualización de estado de los manejadores de eventos a una única función fuera de tu componente. Más información sobre [elegir entre `useState` y `useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### Escribir la función reducer {/*writing-the-reducer-function*/}

Una función reducer se declara así:

```js
function reducer(state, action) {
  // ...
}
```

Luego hay que completar el código que calculará y retornará el siguiente estado. Por convención, es común escribirlo como una [declaración `switch`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) Para cada `case` en el `switch`, calcula y devuelve un estado siguiente.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Las acciones pueden tener cualquier forma. Por convención, es común pasar objetos con una propiedad `type` que identifica la acción. Debe incluir la información mínima necesaria que el reducer necesita para calcular el siguiente estado.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Los nombres de los tipos de acción son locales a tu componente. [Cada acción describe una única interacción, aunque provoque múltiples cambios en los datos.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) La forma del estado es arbitraria, pero normalmente será un objeto o un array.

Lee [extrayendo lógica de estado en un reducer](/learn/extracting-state-logic-into-a-reducer) para saber más.

<Pitfall>

El estado es de sólo lectura. No modifiques ningún objeto o arrays del estado:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1;
      return state;
    }
```

En su lugar, devuelve siempre nuevos objetos desde tu reducer:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Instead, return a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Lee [actualizar objetos en el estado](/learn/updating-objects-in-state) y [actualizar arrays en el estado](/learn/updating-arrays-in-state) para saber más.

</Pitfall>

<Recipes titleText="Ejemplos básicos de useReducer" titleId="examples-basic">

#### Form (object) {/*form-object*/}

En este ejemplo, el reducer gestiona un objeto de estado con dos campos: `name` y `age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Todo list (array) {/*todo-list-array*/}

En este ejemplo, el reducer gestiona un array de tareas. El array necesita ser actualizado [sin mutación.](/learn/updating-arrays-in-state)

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

#### Escribir lógica de actualización concisa con Immer {/*writing-concise-update-logic-with-immer*/}

Si actualizar arrays y objetos sin mutación te resulta tedioso, puedes utilizar una biblioteca como [Immer](https://github.com/immerjs/use-immer#useimmerreducer) para reducir el código repetitivo. Immer te permite escribir código conciso como si estuvieras mutando objetos, pero por debajo realiza actualizaciones inmutables:

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Evitar recrear el estado inicial {/*evitar-recrear-el-estado-inicial*/}

React guarda el estado inicial una vez y lo ignora en las siguientes renderizaciones.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

Aunque el resultado de `createInitialState(username)` sólo se utiliza para el renderizado inicial, sigues llamando a esta función en cada renderizado. Esto puede ser un desperdicio si está creando grandes arrays o realizando cálculos costosos.

Para solucionar esto, puedes **pasarlo como una función _initializer_** a `useReducer` como tercer argumento en su lugar:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Fíjate que estás pasando `createInitialState`, que es la *función en sí*, y no `createInitialState()`, que es el resultado de llamarla. De esta manera, el estado inicial no se vuelve a crear después de la inicialización.

En el ejemplo anterior, `createInitialState` toma un argumento `username`. Si tu inicializador no necesita ninguna información para calcular el estado inicial, puedes pasar `null` como segundo argumento a `useReducer`.

<Recipes titleText="La diferencia entre pasar un inicializador y pasar el estado inicial directamente" titleId="examples-initializer">

#### Pasar la función inicializadora {/*passing-the-initializer-function*/}

Este ejemplo pasa la función inicializadora, por lo que la función `createInitialState` sólo se ejecuta durante la inicialización. No se ejecuta cuando el componente se vuelve a renderizar, como cuando se escribe en la entrada.

<Sandpack>

```js App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Pasar el estado inicial directamente {/*passing-the-initial-state-directly*/}

Este ejemplo **no** pasa la función inicializadora, por lo que la función `createInitialState` se ejecuta en cada render, como cuando se escribe en la entrada. No hay ninguna diferencia observable en el comportamiento, pero este código es menos eficiente.

<Sandpack>

```js App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## Solución de problemas {/*troubleshooting*/}

### He despachado una acción, pero el registro me da el valor de estado antiguo {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Llamar a la función `dispatch` **no cambia el estado del código en ejecución**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Request a re-render with 43
  console.log(state.age);  // Still 42!

  setTimeout(() => {
    console.log(state.age); // Also 42!
  }, 5000);
}
```

Esto se debe a que [el estado se comporta como una instantánea] (/learn/state-as-a-snapshot) La actualización del estado solicita otra renderización con el nuevo valor de estado, pero no afecta a la variable JavaScript `state` en su manejador de eventos ya en ejecución.

Si necesitas averiguar el valor del siguiente estado, puedes calcularlo manualmente llamando tú mismo al reducer:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### He despachado una acción, pero la pantalla no se actualiza {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React **ignorará tu actualización si el siguiente estado es igual al anterior,** determinado por una comparación [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Esto suele ocurrir cuando cambias un objeto o un array de estado directamente:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Wrong: mutating existing object
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Wrong: mutating existing object
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Has mutado un objeto `state` existente y lo has devuelto, por lo que React ha ignorado la actualización. Para solucionarlo, tienes que asegurarte de que siempre estás [actualizando objetos en el estado](/learn/updating-objects-in-state) y [actualizando arrays en el estado](/learn/updating-arrays-in-state) en lugar de mutarlos:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Una parte del estado de mi reductor se vuelve undefined después de despachar {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Asegúrate de que cada rama `case` **copia todos los campos existentes** al devolver el nuevo estado:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Don't forget this!
        age: state.age + 1
      };
    }
    // ...
```

Sin el `...state` de arriba, el siguiente estado devuelto sólo contendría el campo `edad` y nada más.

---

### Todo el estado de mi reducer se vuelve undefined después de despachar {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Si tu estado se convierte inesperadamente en `undefined`, probablemente te estás olvidando de devolver el estado con `return` en uno de los casos, o tu tipo de acción no coincide con ninguna de las declaraciones `case`. Para saber por qué, lanza un error fuera del `switch`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

También puedes utilizar un comprobador de tipos estático como TypeScript para detectar estos errores.

---

### Recibo un error: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Puede que obtengas un error que dice: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` (Demasiados rerenderizados. React limita el número de renderizados para evitar un bucle infinito). Normalmente, esto significa que estás enviando incondicionalmente una acción *durante la renderización*, por lo que tu componente entra en un bucle: renderización, envío (que provoca una renderización), renderización, envío (que provoca una renderización), y así sucesivamente. Muy a menudo, esto es causado por un error al especificar un manejador de eventos:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Si no puedes encontrar la causa de este error, haz clic en la flecha situada junto al error en la consola y busque en la pila de JavaScript la llamada específica a la función `dispatch` responsable del error.

---

### Mi función reductora o inicializadora se ejecuta dos veces {/*my-reducer-or-initializer-function-runs-twice*/}

En [Modo Estricto](/apis/react/StrictMode), React llamará a tus funciones reductoras e inicializadoras dos veces. Esto no debería romper tu código.

Este comportamiento **sólo para desarrollo** te ayuda a [mantener los componentes puros.](/learn/keeping-components-pure) React utiliza el resultado de una de las llamadas, e ignora el resultado de la otra llamada. Mientras tus funciones de componente, inicializadora y reducer sean puras, esto no debería afectar a tu lógica. Sin embargo, si accidentalmente son impuras, esto te ayuda a detectar los errores.

Por ejemplo, esta función reducer impura muta un array en estado:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Mistake: mutating state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Como React llama a tu función reductora dos veces, verás que la tarea se ha añadido dos veces, así que sabrás que hay un error. En este ejemplo, puedes corregir el error [reemplazando el array en lugar de mutarlo](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct: replacing with new state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Ahora que esta función reducer es pura, llamarla una vez extra no hace ninguna diferencia en el comportamiento. Esta es la razón por la que React llamándola dos veces te ayuda a encontrar errores. **Los manejadores de eventos no necesitan ser puros.** así que React nunca llamará a tus manejadores de eventos dos veces.

Lee [mantener los componentes puros](/learn/keeping-components-pure) para obtener más información.
