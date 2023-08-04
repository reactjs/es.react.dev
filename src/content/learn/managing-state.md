---
title: Gestión del estado
---

<Intro>

A medida que tu aplicación crece, es de ayuda ser más intencional sobre cómo se organiza tu estado y cómo los datos fluyen entre tus componentes. El estado redundante o duplicado es una fuente común de errores. En este capítulo, aprenderás cómo estructurar bien tu estado, cómo mantener la lógica de actualización de estado y cómo compartir el estado entre componentes distantes.

</Intro>

<YouWillLearn isChapter={true}>

* [Cómo pensar en los cambios de la interfaz de usuario como cambios de estado](/learn/reacting-to-input-with-state)
* [Cómo estructurar bien el estado](/learn/choosing-the-state-structure)
* [Cómo "levantar el estado" para compartirlo entre componentes](/learn/sharing-state-between-components)
* [Cómo controlar si el estado se preserva o se reinicia](/learn/preserving-and-resetting-state)
* [Cómo consolidar una lógica de estado compleja en una función](/learn/extracting-state-logic-into-a-reducer)
* [Cómo pasar la información sin "_prop drilling_" (perforación de _prop_)](/learn/passing-data-deeply-with-context)
* [Cómo escalar la administración del estado a medida que crece tu aplicación](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## Reacción a la entrada de datos con el estado {/*reacting-to-input-with-state*/}

Con React, no modificarás la interfaz de usuario directamente desde el código. Por ejemplo, no escribirás comandos como "deshabilitar el botón", "habilitar el botón", "mostrar el mensaje de éxito", etc. En su lugar, describirás la interfaz de usuario que deseas ver para los diferentes estados visuales de tu componente ("estado inicial", "estado de escritura", "estado de éxito"), y luego activar los cambios de estado en respuesta a la entrada del usuario. Esto es similar a cómo los diseñadores piensan sobre la interfaz de usuario.

Aquí tenemos un formulario de preguntas construido con React. Fíjate en cómo utiliza la variable de estado `status` para determinar si se activa o desactiva el botón de envío, y si se muestra el mensaje de éxito en su lugar.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Cuestionario sobre ciudades</h2>
      <p>
        ¿En qué ciudad hay un cartel publicitario que convierte el aire en agua potable?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Enviar
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Simulando una respuesta que viene de la red
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

Lee **[Reaccionar a la entrada de datos con el estado](/learn/reacting-to-input-with-state)** para aprender a enfocar las interacciones con una mentalidad basada en el estado.

</LearnMore>

## Elegir la estructura del estado {/*choosing-the-state-structure*/}

Estructurar bien el estado puede marcar la diferencia entre un componente que sea agradable de modificar y depurar, y uno que sea una fuente constante de errores. El principio más importante es que el estado no debe contener información redundante o duplicada. Si hay algún estado innecesario, es fácil olvidarse de actualizarlo, ¡e introducir errores!

Por ejemplo, este formulario tiene una variable de estado **redundante** `fullName`:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Regístrate</h2>
      <label>
        Nombre:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Apellido:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Tu ticket será emitido a: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Puedes eliminarlo y simplificar el código calculando `fullName` mientras el componente se está renderizando:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Regístrate</h2>
      <label>
        Nombre:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Apellido:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Tu ticket será emitido a: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Esto puede parecer un pequeño cambio, pero muchos errores en las aplicaciones React se solucionan de esta manera.

<LearnMore path="/learn/choosing-the-state-structure">

Lee **[Elegir la estructura del estado](/learn/choosing-the-state-structure)** para aprender a diseñar la forma del estado para evitar errores.

</LearnMore>

## Compartir el estado entre componentes {/*sharing-state-between-components*/}

A veces, quieres que el estado de dos componentes cambie a la vez siempre. Para hacerlo, quita el estado de ambos, muévelo a su padre común más cercano, y luego pásalo a ellos vía props. Esto se conoce como "levantar el estado", y es una de las cosas más comunes que harás escribiendo código React.

En este ejemplo, sólo un panel debe estar activo a la vez. Para conseguirlo, en lugar de mantener el estado activo dentro de cada panel individual, el componente padre mantiene el estado y especifica las props para sus hijos.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Alma Ata, Kazajistán</h2>
      <Panel
        title="Acerca de"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Con una población de unos 2 millones de habitantes, Alma Ata es la mayor ciudad de Kazajistán. De 1929 a 1997 fue su capital.
      </Panel>
      <Panel
        title="Etimología"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        El nombre proviene de <span lang="kk-KZ">алма</span>, la palabra en kazajo para "manzana", y suele traducirse como "lleno de manzanas". De hecho, se cree que la región que rodea a Alma Ata es el hogar ancestral de la manzana, y el <i lang="la">Malus Silvestris</i> se considera un candidato probable para el ancestro de la manzana doméstica moderna.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Mostrar
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

Lee **[Compartir estado entre componentes](/learn/sharing-state-between-components)** para aprender a levantar el estado y mantener los componentes sincronizados.

</LearnMore>

## Preservar y reiniciar el estado {/*preserving-and-resetting-state*/}

Cuando se vuelve a renderizar un componente, React necesita decidir qué partes del árbol se mantienen (y se actualizan), y qué partes se descartan o se vuelven a crear desde cero. En la mayoría de los casos, el comportamiento automático de React funciona bastante bien. Por defecto, React conserva las partes del árbol que "coinciden" con el árbol de componentes previamente renderizado.

Sin embargo, a veces esto no es lo que quieres. Por ejemplo, en esta aplicación, si se escribe un mensaje y luego se cambia de destinatario no se reinicia la entrada. Esto puede hacer que el usuario envíe accidentalmente un mensaje a la persona equivocada:

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chatear con ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Enviar a {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

React permite anular el comportamiento por defecto, y *forzar* a un componente a reiniciar su estado pasándole una `key` diferente, como `<Chat key={email} />`. Esto le dice a React que si el destinatario es diferente, debe ser considerado como un componente `Chat` diferente que necesita ser recreado desde cero con los nuevos datos (y entradas de UI). Ahora al cambiar de destinatario siempre se reinicia el campo de entrada, aunque se renderice el mismo componente.

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chatear con ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Enviar a {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

Lee **[Preservar y reiniciar el estado](/learn/preserving-and-resetting-state)** para aprender la vida del estado y cómo controlarla.

</LearnMore>

## Extracción de la lógica de estado en un reductor {/*extracting-state-logic-into-a-reducer*/}

Los componentes con muchas actualizaciones de estado repartidas entre muchos controladores de eventos pueden resultar abrumadores. Para estos casos, puedes consolidar toda la lógica de actualización de estado fuera de tu componente en una sola función, llamada "reductor". Tus controladores de eventos se vuelven concisos porque sólo especifican las "acciones" del usuario. Al final del archivo, la función reductora especifica cómo debe actualizarse el estado en respuesta a cada acción.

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>Itinerario de Praga</h1>
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visitar el Museo Kafka', done: true },
  { id: 1, text: 'Ver espectáculo de títeres', done: false },
  { id: 2, text: 'Foto del muro de Lennon', done: false }
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Agregar tarea"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Agregar</button>
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Eliminar
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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Lee **[Extraer la lógica de estado en un reductor](/learn/extracting-state-logic-into-a-reducer)** para aprender a consolidar la lógica en la función reductora.

</LearnMore>

## Pasar datos en profundidad con el contexto {/*passing-data-deeply-with-context*/}

Normalmente, se pasa información de un componente padre a un componente hijo a través de props. Pero pasar props puede ser un inconveniente si necesitas pasar alguna prop a través de muchos componentes, o si muchos componentes necesitan la misma información. Context permite que el componente padre haga que cierta información esté disponible para cualquier componente en el árbol por debajo de él -sin importar lo profundo que sea- sin pasarla explícitamente a través de props.

Aquí, el componente `Heading` determina su nivel de encabezamiento "preguntando" a la `Section` más cercana por su nivel. Cada `Section` rastrea su propio nivel preguntando a la `Section` padre y añadiéndole uno. Cada `Section` proporciona información a todos los componentes que se encuentran por debajo de ella sin necesidad de pasar props--lo hace a través del contexto.

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
      throw Error('Heading must be inside a Section!');
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
      throw Error('Unknown level: ' + level);
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

<LearnMore path="/learn/passing-data-deeply-with-context">

Lee **[Pasar datos en profundidad con el contexto](/learn/passing-data-deeply-with-context)** para aprender a usar el contexto como una alternativa a pasar props.

</LearnMore>

## Escalado con reductor y contexto {/*scaling-up-with-reducer-and-context*/}

Los reductores permiten consolidar la lógica de actualización del estado de un componente. El contexto te permite pasar información en profundidad a otros componentes. Puedes combinar reductores y contexto para gestionar el estado de una pantalla compleja.

Con este enfoque, un componente principal con estado complejo lo gestiona con un reductor. Otros componentes en cualquier parte del árbol pueden leer su estado a través del contexto. También pueden enviar acciones para actualizar ese estado.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Día libre en Kioto</h1>
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
      <TasksDispatchContext.Provider
        value={dispatch}
      >
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
  { id: 0, text: 'El Camino del Filósofo', done: true },
  { id: 1, text: 'Visitar el templo', done: false },
  { id: 2, text: 'Beber té matcha', done: false }
];
```

```js AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Agregar tarea"
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
        Eliminar
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

Lee **[Ampliación con Reductor y Contexto](/learn/scaling-up-with-reducer-and-context)** para aprender cómo se escala la gestión de estados en una aplicación en crecimiento.

</LearnMore>

## ¿Qué es lo siguiente? {/*whats-next*/}

Dirígete a [Reaccionar a la entrada de datos con el estado](/learn/reacting-to-input-with-state) para empezar a leer este capítulo página a página.

O, si ya estás familiarizado con estos temas, ¿por qué no lees sobre  [Escotillas de escape](/learn/escape-hatches)?
