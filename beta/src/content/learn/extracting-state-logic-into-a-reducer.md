---
title: Extrayendo lógica de estado en un reducer
---

<Intro>

Los componentes con muchas actualizaciones de estado distribuidas a través de varios *event handlers* pueden ser agobiantes. Para estos casos, puedes consolidar toda la lógica de actualización de estado fuera del componente en una única función, llamada _reducer._

</Intro>

<YouWillLearn>

- Que es una función de reducer
- Como refactorizar de `useState` a `useReducer`
- Cuando utilizar un reducer
- Como escribir uno de manera correcta

</YouWillLearn>

## Consolidando lógica de estado con un reducer {/*consolidate-state-logic-with-a-reducer*/}

A medida que tus componentes crecen en complejidad, puede volverse difícil a simple vista todas las maneras en las cuales el estado de un componente es actualizado. Por ejemplo el componente `TaskApp` mantiene un *array* de `tasks` en estado y usa tres *event handlers* diferentes para agregar, borrar y editar tasks.

<Sandpack>

```js App.js
import {useState} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Cada uno de estos *event handlers* llama a `setTasks` con el fin de actualizar el estado. A medida que el componente crece, también lo hace la cantidad de lógica de estado esparcida a lo largo de éste. Para reducir esta complejidad y mantener toda la lógica en un lugar de fácil acceso, puedes mover esa lógica de estado a una función única fuera del componente **llamada un "reducer".**

Los *reducers* son una forma diferente de manejar el estado. Puedes migrar de `useState` a `useReducer` en tres pasos:

1. **Cambia** de actualizar un estado a despachar *actions*.
2. **Escribe** una función de *reducer*.
3. **Usa** el *reducer* desde tu componente.

### Paso 1: Cambia de establecer un estado a despachar *actions* {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Tus *event handlers* actualmente especifican _que hacer_ al actualizar un estado:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Elimina toda la lógica de actualización de estado. Lo que queda son estos tres *event handlers*:

- `handleAddTask(text)` es llamado cuando el usuario presiona "Add".
- `handleChangeTask(task)` es llamado cuando el usuario cambia una task o presiona "Save".
- `handleDeleteTask(taskId)` es llamado cuando el usuario presiona "Delete".

Manejar el estado con reducers es ligeramente diferente a directamente actualizar el estado. En lugar de decirle a React "que hacer" al actualizar el estado, especificas "que acaba de hacer el usuario" despachando "actions" desde tus *event handlers*. (La lógica de actualización de estado estará en otro lugar!) Entonces en lugar de "actualizar `tasks`" a través de un *event handler*, estás despachando una *action* de "task agregada/cambiada/borrada". Esto es más descriptivo acerca de la intención del usuario.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

El objeto que pasas a `dispatch` es llamado un "action":

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // objeto de "action":
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

Es un objeto regular de JavaScript. Tú decides que poner dentro de él, pero generalmente debe contener la mínima información acerca de _que ocurrió_. (Agregarás la función de  `dispatch` en un paso posterior.)

<Note>

Un objeto de action puede tener cualquier forma.

Por convención, es común proporcionar un string `type` que describe que ocurrió, y transmite cualquier información adicional en otros campos. El `type` es específico a un componente, en este ejemplo tanto `'added'` o `'added_task'` estaría bien. ¡Elige un nombre que describa que ocurrió!

```js
dispatch({
  // específico al componente
  type: 'what_happened',
  // otros campos van aquí
});
```

</Note>

### Paso 2: Escribe una función de reducer {/*step-2-write-a-reducer-function*/}

Una función de reducer es donde pondrás tu lógica de estado. Recibe dos argumentos, el estado actual y el objeto de *action*, y devuelve el siguiente estado.

```js
function yourReducer(state, action) {
  // devuelve siguiente estado a React para ser actualizado
}
```

React actualizará el estado a lo que se devuelve desde el reducer.

Para mover la lógica de actualización de estado desde tus *event handlers* a una función de reducer en este ejemplo, vas a:

1. Declarar el estado actual (`tasks`) como primer argumento.
2. Declarar el objeto `action` como segundo argumento.
3. Devolver el _siguiente_ estado desde el reducer (con el cual React actualizará el estado).

Aquí se encuentra toda la lógica de actualización de estado migrada a una función de reducer:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

> Como la función de reducer recibe el estado (`tasks`) como un argumento, puedes **declararlo fuera de tu componente.** Esto reduce el nivel de indentación y puede hacer que tu código sea más fácil de leer.

<Note>

El código arriba usa esta sentencias if/else, pero es una convención usar [sentencias switch](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/switch) dentro de los reducers. El resultado es el mismo, pero puede ser más sencillo leer sentencias switch a simple vista.

Las estaremos usando a lo largo del resto de esta documentación de la siguiente manera:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

Recomendamos envolver cada instancia `case` entre llaves `{` y `}` así las variables declarados dentro de los diferentes `case`s no conflictúan entre ellas. También, un `case` debería generalmente terminar con un `return`. Si olvidas de hacer un `return`, el codigo "caerá" hasta el siguiente  `case`, lo que puede llevarte a errores!

Si todavía no te sientes cómodo con sentencias switch, utilizar if/else está bien.

</Note>

<DeepDive title="¿Por qué los reducers se llaman de esta manera?">

Aunque los reducers pueden "reducir" la cantidad de código dentro de tu componente, son en realidad llamados así por la operación [`reduce()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) la cual se puede realizar en arrays.

La operación `reduce()` permite tomar un array y "acumular" un único valor a partir de varios

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

La función que se pasa para `reducir` es conocida como un "reducer". Toma el _resultado hasta el momento_ y el _item actual,_ luego devuelve el _siguiente resultado._ Los reducers de React son un ejemplo de la misma idea: toman el _estado hasta el momento_ y la _action_, y devuelven el _siguiente estado._ De esta manera, se acumulan actions sobre el tiempo en estado.

Puedes incluso utilizar el método `reduce()` con un `initialState` y un array de `actions` para calcular el estado final pasándole tu función de reducer a él:

<Sandpack>

```js index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Probablemente no necesites hacer esto por tu cuenta, pero ¡es similar a lo que React hace!

</DeepDive>

### Paso 3: Usa el reducer desde tu componente {/*step-3-use-the-reducer-from-your-component*/}

Finalmente, debes conectar el `tasksReducer` a tu componente. Asegúrate de importar el Hook `useReducer` de React:

```js
import {useReducer} from 'react';
```

Luego puedes reemplazar `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

con `useReducer` de esta manera:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

El Hook `useReducer` es similar a `useState`— debes pasar un estado inicial y devuelve un valor con estado y una manera de actualizar estado (en este caso, la funcion de dispatch). Pero es un poco diferente. 

El Hook `useReducer` toma dos parámetros:

1. Una función de reducer
2. Un estado inicial

Y devuelve:

1. Un valor con estado
2. Una función de dispatch (para "despachar" acciones del usuario hacia el reducer)

Ahora está completamente conectado! Ahora, el reducer es declarado al final del archivo del componente:

<Sandpack>

```js App.js
import {useReducer} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Si lo deseas, puedes incluso mover el reducer a un archivo diferente:

<Sandpack>

```js App.js
import {useReducer} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

La lógica del componente puede ser más sencilla de leer cuando separas conceptos como éste. Ahora los *event handlers* sólo especifican _que ocurrió_ despachando *actions*, y la función de reducer determina _cómo se actualiza el estado_ en respuesta a ellos.

## Comparando `useState` y `useReducer` {/*comparing-usestate-and-usereducer*/}

¡Los reducers no carecen de desventajas! Aquí hay algunas maneras en las que puedas compararlos: 

- **Tamaño del código:** Generalmente, con `useState` debes escribir menos código por adelantado. Con `useReducer`, debes escribir la función de reducer _y_ las actions a despachar. Sin embargo, `useReducer` puede ayudar a disminuir el código si demasiados *event handlers* modifican el estado de una manera similar
- **Legibilidad:** `useState` es muy sencillo de leer cuando las actualizaciones de estado son simples. Cuando se vuelven más complejas, pueden inflar el código de tu componente y hacerlo difícil de escanear. En este caso, `useReducer` te permite separar limpiamente el _cómo_ de la lógica de actualización desde el _que ocurrió_ de los *event handlers*.
- **Depurando:** Cuando tienes un error con `useState`, puede ser difícil decir _dónde_ el estado ha sido actualizado incorrectamente, y _por qué_. Con `useReducer`, puedes agregar un *log* de la consola en tu reducer para ver cada actualización de estado, y _por qué_ ocurrió (debido a qué `action`). Si cada `action` es correcta, sabrás que el error se encuentra en la propia lógica del reducer. Sin embargo, debes pasar por más código que con `useState`.
- **Pruebas:** Un reducer es una función pura que no depende de tu componente. Esto significa que puedes exportarla y probarla separadamente de manera aislada. Mientras que generalmente es mejor probar componentes en un entorno más realista, para actualizaciones de estado complejas, puede ser útil asegurar que tu reducer devuelve un estado particular para un estado y *action* particular.
- **Preferencia personal:** Algunas personas prefieren reducers, otras no. Está bien. Es una cuestión de preferencia. Siempre puedes convertir entre `useState` y `useReducer` de un lado a otro: ¡son equivalentes!

Recomendamos utilizar un reducer si a menudo encuentras errores debidos a actualizaciones incorrectas de estado en algún componente, y deseas introducir más estructura a tu código. No es necesario usar reducers para todo: ¡siente la libertad de mezclar y combinar! Incluso puedes tener `useState` y `useReducer` en el mismo componente.

## Escribiendo reducers de manera correcta {/*writing-reducers-well*/}

Ten en cuenta estos dos consejos al escribir reducers:

- **Los reducers deben ser puros.** Al igual que las [funciones de actualización de estado](/learn/queueing-a-series-of-state-updates), los reducers ¡se ejecutan durante el renderizado! (Las *actions* se ponen en cola hasta el siguiente renderizado) Esto signfica que los reducers [deben ser puros](/learn/keeping-components-pure)—misma entrada siempre produce el mismo resultado. No deben enviar *requests*, programar *timeouts*, o realizar *efectos secundarios* (operaciones que impactan fuera del componente). Deben actualizar [objetos](/learn/updating-objects-in-state) y [arrays](/learn/updating-arrays-in-state) sin mutaciones.
- **Cada action describe una única interacción del usuario, incluso si eso conduce a múltiples cambios en los datos.** Por ejemplo, si un usuario presiona "Reset" en un formulario con cinco campos manejados por un reducer, tiene más sentido despachar una action de `reset_form` en lugar de cinco actions de `set_field`. Si muestras cada action en un reducer, esto debería ser suficientemente claro como para reconstruir las interacciones o respuestas que pasaron en que orden. Esto ayuda con la depuración!

## Escribiendo reducers concisos con Immer {/*writing-concise-reducers-with-immer*/}

Al igual que al [actualizar objetos](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) y [arrays](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) en estado regular, se puede utilizar la biblioteca de Immer para hacer los reducers más concisos. Aquí, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) te permite mutar el estado con `push` o una asignación `arr[i] =` :

<Sandpack>

```js App.js
import {useImmerReducer} from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
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

Los reducers deben ser puros, así que no deberían mutar estado. Pero Immer te provee de un objeto especial `draft` que es seguro de mutar. Por detrás, Immer creará una copia de tu estado con los cambios que has hecho a este objeto `draft`. Esto es la razón por la que los reducers manejados con `useImmerReducer` pueden mutar su primer argumento y no necesitan devolver un estado.

<Recap>

- Para convertir de `useState` a `useReducer`:
  1. Despachar actions desde event handlers.
  2. Escribir una función de reducer que devuelve el siguiente estado para un estado dado y action.
  3. Reemplazar `useState` con `useReducer`.
- Los reducers requieren que escribas un poco más de código, pero ayudan con la depuración y pruebas
- Los reducers deben ser puros.
- Cada *action* describe una interacción única del usuario.
- Usa Immer si deseas escribir reducers mutando el estado actual.

</Recap>

<Challenges>

#### Despachar actions desde event handlers {/*dispatch-actions-from-event-handlers*/}

Actualmente, los event handlers en `ContactList.js` y `Chat.js` tienen comentarios `// TODO`. Ésta es la razón por la que escribir en el input no funciona, y hacer clic sobre los botones no cambia el destinatario seleccionado.

Reemplaza estos dos `// TODO`s con el código para hacer `dispatch` de las actions correspondientes. Para ver la forma esperada y el *type* de las actions, revisa el reducer en `messengerReducer.js`. El reducer ya está escrito así que no necesitas cambiarlo. Solo tendrás que despachar las *actions* en `ContactList.js` y `Chat.js`.

<Hint>

La función de `dispatch` ya esta disponible en ambos componentes porque fue pasada como una prop. Así que necesitas llamar a `dispatch` con el  *action object* correspondiente.

Para revisar la forma del *action object*, puedes dar un vistazo al reducer y ver cuales campos del `action` se espera ver. Por ejemplo, el caso de `changed_selection` en el reducer luce como esto:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

Esto quiere decir que tu *action object* debería tener un `type: 'changed_selection'`. También vemos que `action.contactId` está siendo usado, así que necesitas incluir una propiedad `contactId` en tu action.

</Hint>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: Hacer dispatch de changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: Hacer dispatch de edited_message
          // (Leer el valor del input de e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Desde el código del reducer, puedes inferir que actions necesitan verse como esto:

```js
// Cuando el usuario presiona "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// Cuando el usuario escribe "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

Aquí hay un ejemplo actualizado para despachar los mensajes correspondientes:

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Limpiar el input al enviar un mensaje {/*clear-the-input-on-sending-a-message*/}

Actualmente, presionar "Send" no hace nada. Agregar un event handler al botón de "Send" que va a:

1. Mostrar un `alert` con el correo del destinatario y el mensaje.
2. Limpiar el input del mensaje.

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Hay un par de maneras en las cuales en las cuales se puede hacer en el event handler del botón de "Send". Un enfoque es mostrar una alerta y luego despachar una action de `edited_message` con un `message` vacío.

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Esto funciona y limpia el input cuando se presiona "Send"

Sin embargo, _desde la perspectiva del usuario_, enviar un mensaje es una acción diferente que editar un campo. Para reflejar esto, pueden crear en su lugar una _nueva_ action llamada `sent_message`, y manejarla de manera separada en el reducer.

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

El comportamiento resultante es el mismo. Pero ten en mente que los *action types* deberían idealmente describir "que hizo el usuario" más que "como quieres que el estado cambie". Esto lo hace más sencillo para luego agregar más funcionalidades.

Con cualquiera de las dos soluciones, es importante que **no** coloques la `alert` dentro de un reducer. El reducer debe ser una función pura--solo debe calcular el siguiente estado. No debería "hacer" nada, incluyendo mostrar mensajes al usuario. Eso debería suceder en el *event handler*. (Para ayudar a detectar errores como este, React llamará a sus reducers varias veces en *Strict Mode*. Es por eso que, si colocas una alerta en un reducer, se llama dos veces).

</Solution>

#### Restaurar valores de input al cambiar entre pestañas {/*restore-input-values-when-switching-between-tabs*/}

En este ejemplo, cambiar entre diferentes destinatarios siempre limpiar el input de texto:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Limpia el input
  };
```

Esto es porque no quieres compartir un solo borrador de mensaje entre varios destinatarios. Pero sería mejor si tu aplicación "recordara" un borrador para cada contacto separadamente, restaurandolos cuando cambias contactos.

Tu tarea es cambiar la manera en la que el estado está estructurado así se puede recordar un borrador de mensaje separado _por contacto_. Tendrás que hacer algunos cambios al reducer, el estado inicial y los componentes.

<Hint>

Puedes estructurar el estado así:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Borrador para contactId = 0
    1: 'Hello, Alice', // Borrador para contactId = 1
  },
};
```

La sintaxis de  [computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) `[key]: value` puede ayudarte a actualizar el objeto de `messages`:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Necesitarás actualizar el reducer para guardar y actualizar un borrador de mensaje separado por contacto:

```js
// Cuando el input es editado
case 'edited_message': {
  return {
    // Mantener otro estado como selecciones
    ...state,
    messages: {
      // Mantener los mensajes de otros contactos
      ...state.messages,
      // Pero cambiar el mensaje del contacto seleccionado
      [state.selectedId]: action.message
    }
  };
}
```

También actualizarías el componente de `Messenger` para leer el mensaje para el contacto actualmente seleccionado:

```js
const message = state.messages[state.selectedId];
```

Esta es la solución completa:

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

En particular, no necesitas cambiar ninguno de los *event handlers* para implementar este comportamiento diferente. Sin un reducer, necesitarías tener que cambiar cada *event handler* que actualice el estado.

</Solution>

#### Implementar `useReducer` desde cero {/*implement-usereducer-from-scratch*/}

En los ejemplos anteriores, importaste el Hook `useReducer` desde React. Esta vez, vas a implementar _el Hook `useReducer` mismo!_. Aquí tienes algo para empezar. No debería tomar más de 10 líneas de código.

Para probar tus cambios, intenta escribir en el input y seleccionar un contacto.

<Hint>

Aquí hay un un esquema más detallado de la implementación:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Recuerda que una función de reducer toma dos argumentos--el estado inicial y el *action object*--y devuelve el siguiente estado. ¿Qué debería hacer tu implementación de `dispatch` con esto?

</Hint>

<Sandpack>

```js App.js
import {useReducer} from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import {useState} from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Despachar un *action* llama al reducer con el estado actual y el action, y guarda el resultado como el siguiente estado. Así es como se ve en código:

<Sandpack>

```js App.js
import {useReducer} from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import {useState} from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Aunque no importa en la mayoría de los casos, una implementación ligeramente más acertada se ve así: 

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

Esto es porque las actions despachadas son puestas en cola hasta el siguiente render, [similar a las updater functions.](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>
