---
title: useState
---

<Intro>

`useState` es un Hook de React que te permite agregar una [variable de estado](/learn/state-a-components-memory) a tu componente.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Llama a `useState` en el nivel superior de tu componente para declarar una [variable de estado](/learn/state-a-components-memory).

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

La convención es nombrar variables de estado como `[algo, setAlgo]` usando [desestructuración de arrays](https://javascript.info/destructuring-assignment).

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `initialState`: El valor que deseas que tenga el estado inicialmente. Puede ser un valor de cualquier tipo, pero hay un comportamiento especial para las funciones. Este argumento se ignora después del renderizado inicial.
  * Si pasa una función como `initialState`, se tratará como una _función inicializadora_. Debe ser pura, no debe aceptar argumentos y debe devolver un valor de cualquier tipo. React llamará a tu función de inicialización al inicializar el componente y almacenará su valor de devolución como el estado inicial. [Ve un ejemplo debajo.](#avoiding-recreating-the-initial-state)

#### Devuelve {/*returns*/}

`useState` devuelve un _array_ con exactamente dos valores:

1. El estado actual. Durante el primer renderizado, coincidirá con el `initialState` que hayas pasado.
2. La [función `set`](#setstate) que te permite actualizar el estado a un valor diferente y desencadenar un nuevo renderizado.

#### Advertencias {/*caveats*/}

* `useState` es un Hook, por lo que solo puedes llamarlo **en el nivel superior de tu componente** o en tus propios Hooks. No puedes llamarlo dentro de bucles o condiciones. Si lo necesitas, extrae un nuevo componente y mueva el estado a él.
* En [Modo estricto](/reference/react/StrictMode), React **llamará a tu función de inicialización dos veces** para [ayudarte a encontrar impurezas accidentales.](#my-initializer-or-updater-function-runs-twoveces) Este es un comportamiento exclusivo de desarrollo y no ocurre en producción. Si tu función de inicialización es pura (como debería ser), esto no debería afectar la lógica de tu componente. Se ignorará el resultado de una de las llamadas.

---

### Funciones `set` , como `setAlgo(siguienteEstado)` {/*setstate*/}

La función `set` devuelta por `useState` te permite actualizar el estado a un valor diferente y desencadenar un nuevo renderizado. Puedes pasar el siguiente estado directamente, o una función que lo calcule a partir del estado anterior:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parámetros {/*setstate-parameters*/}

  * `siguienteEstado`: El valor que deseas que tenga el estado. Puede ser un valor de cualquier tipo, pero hay un comportamiento especial para las funciones.
   * Si pasas una función como `siguienteEstado`, se tratará como una _función de actualización_. Debe ser pura, debe tomar el estado pendiente como único argumento y debe devolver el siguiente estado. React pondrá tu función de actualización en una cola y volverá a renderizar tu componente. Durante el próximo renderizado, React calculará el siguiente estado aplicando todas las actualizaciones en cola al estado anterior. [Ve un ejemplo debajo.](#updating-state-based-on-the-previous-state)

#### Devuelve {/*setstate-returns*/}

Las funciones `set` no tienen un valor de devolución.

#### Advertencias {/*setstate-caveats*/}

* La función `set` **solo actualiza la variable de estado para el *próximo* renderizado**. Si lees la variable de estado después de llamar a la función `set`, [seguirás obteniendo el valor anterior](#ive-updated-the-state-but-logging-gives-me-the-old-value) que estaba en la pantalla antes de tu llamada.

* Si el nuevo valor que proporcionas es idéntico al `estado` actual, según lo determinado por un [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **omitirá volver a renderizar el componente y sus hijos.** Esta es una optimización. Aunque en algunos casos React aún puede necesitar llamar a tu componente antes de omitir los hijos, no debería afectar tu código.

* React [agrupa actualizaciones de estado.](/learn/queueing-a-series-of-state-updates) Actualiza la pantalla **después de que todos los controladores de eventos se hayan ejecutado** y hayan llamado a sus funciones `set`. Esto evita múltiples renderizados durante un solo evento. En el raro caso de que necesite forzar a React a actualizar la pantalla antes, por ejemplo, para acceder al DOM, puedes usar [`flushSync`.](/reference/react-dom/flushSync)

* La función `set` tiene una identidad estable, por lo que a menudo verás que se omite de las dependencias de los Efectos, pero que se incluya no causa que el Efecto se dispare. Si el *linter* te permite omitir una dependencia sin errores, es seguro hacerlo. [Aprende más sobre eliminar dependencias de los Efectos.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Llamar a la función `set` *durante el renderizado* solo está permitido desde el componente que se está renderizando. React descartará su salida e inmediatamente intentará renderizarlo nuevamente con el nuevo estado. Este patrón rara vez se necesita, pero puedes usarlo para **almacenar información de los renderizados anteriores**. [Ve un ejemplo debajo.](#storing-information-from-previous-renders)

* En [Modo estricto](/reference/react/StrictMode), React **llamará a tu función de actualización dos veces** para [ayudarte a encontrar impurezas accidentales.](#my-initializer-or-updater-function-runs-twice) Este es un comportamiento exclusivo de desarrollo y no ocurre en producción. Si tu función de actualización es pura (como debería ser), esto no debería afectar la lógica de tu componente. Se ignorará el resultado de una de las llamadas.

---

## Uso {/*usage*/}

### Agregar estado a un componente {/*adding-state-to-a-component*/}

Llama a `useState` en el nivel superior de tu componente para declarar una o más [variables de estado.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

La convención es nombrar variables de estado como `[algo, setAlgo]` utilizando la [desestructuración de _arrays_.](https://javascript.info/destructuring-assignment) 

`useState` devuelve un _array_ con exactamente dos elementos:

1. El <CodeStep step={1}>estado actual</CodeStep> de esta variable de estado, establecida inicialmente en el <CodeStep step={3}>estado inicial</CodeStep> que proporcionaste.
2. La <CodeStep step={2}>función `set`</CodeStep> que te permite cambiarlo a cualquier otro valor en respuesta a la interacción. 

Para actualizar lo que está en la pantalla, llama a la función `set` con algún estado:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React almacenará el siguiente estado, renderizará tu componente nuevamente con los nuevos valores y actualizará la interfaz de usuario. 

<Pitfall>

Llamar a la función `set` [**no  cambia** el estado actual en el código que ya se está ejecutando ](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // ¡Sigue siendo "Taylor"!
}
```

Solo afecta lo que `useState` devolverá a partir del *siguiente* renderizado. 

</Pitfall>

<Recipes tituloText="Ejemplos básicos de useState" titleId="examples-basic">

#### Contador (número) {/*counter-number*/}

En este ejemplo, la variable `contador` contiene un número. Al hacer click en el botón lo incrementa

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Hiciste clic {count} veces
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Campo de texto (cadena) {/*text-field-string*/}

En este ejemplo, la variable de estado `texto` contiene una cadena. Cuando escribes,`handleChange` lee el último valor ingresado al elemento input del DOM desde el navegador y llama  `setTexto` para actualizar el estado. Esto te permite mostrar el actual `texto` abajo. 

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hola');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>Escribiste: {text}</p>
      <button onClick={() => setText('hola')}>
        Reiniciar
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (booleano) {/*checkbox-boolean*/}

En este ejemplo, la variable de estado `liked` contiene un valor booleano.  Al hacer click en el checkbox, `setLiked` actualiza la variable de estado `liked` si es que la entrada del checkbox del navegador fue marcada. La variable `liked` se utiliza para representar el texto debajo del checkbox.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        Me gustó esto
      </label>
      <p>{liked ? 'Te' : 'No te'} gustó esto.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Formulario (dos variables) {/*form-two-variables*/}

Se puede declarar más de una variable de estado en el mismo componente. Cada variable de estado es completamente independiente. 

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Incrementar edad
      </button>
      <p>Hola, {name}. Tienes {age} años.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Actualización de estado con base en el estado anterior {/*updating-state-based-on-the-previous-state*/}

Supongamos que `age` es `42`. La función `handler` llama `setAge(age + 1)` tres veces:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

¡Sin embargo, después de un click, `age` solo será `43` en lugar de 45!  Esto se debe a que llamar a la función `set ` no actualizará  la variable de estado `age` en el código que ya se está ejecutando.  Así que cada llamada `setAge(age + 1)` se convierte en `setAge(43)`. 

Para resolver este problema, **puedes pasar una  función de actualización**  a `setAge` en lugar del siguiente estado: 

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Aquí, `a => a + 1` es la función de actualización. Toma el <CodeStep step={1}>estado pendiente</CodeStep> y calcula el <CodeStep step={2}>siguiente estado</CodeStep> a partir de él.

React pone sus funciones de actualización en una [cola.](/learn/queueing-a-series-of-state-updates) Entonces, durante el siguiente renderizado, las llamará en el mismo orden:

1. `a => a + 1` recibirá `42` como estado pendiente y devolverá `43` como el siguiente estado.
1. `a => a + 1` recibirá `43` como estado pendiente y devolverá `44` como el siguiente estado.
1. `a => a + 1` recibirá `44` como estado pendiente y devolverá `45` como el siguiente estado.

No hay otras actualizaciones en cola, por lo que React almacenará `45` como el estado actual al final.

Por convención, es común nombrar el argumento de estado pendiente como la primera letra del nombre de la variable de estado, como `a` para `age`. No obstante, también puedes llamarlo como `prevAge` o cualquier otra cosa que te resulte más clara.

React puede [llamar a tus actualizadores dos veces](#my-initializer-or-updater-function-runs-twice) en desarrollo para verificar que sean [puros.](/learn/keeping-components-pure)

<DeepDive>

#### ¿Siempre se prefiere usar un actualizador? {/*is-using-an-updater-always-preferred*/}

Es posible que escuches una recomendación para escribir siempre código como `setEdad(e => e + 1)` si el estado que está configurando se calcula a partir del estado anterior.  No hay daño en ello, pero tampoco es necesario siempre. 

En la mayoría de los casos, no hay diferencia entre estos dos enfoques. React siempre se asegura de que para las acciones intencionales del usuario, como los clicks, la variable de estado `edad` se actualizará antes del siguiente click. Esto significa que no hay riesgo de que un controlador de clicks vea un mensaje "obsoleto" de `edad` al comienzo del controlador de evento.

Sin embargo, si realizas varias actualizaciones dentro del mismo evento, los actualizadores pueden ser útiles. También son útiles si acceder a la variable de estado en sí es un inconveniente (es posible que te encuentres con esto al optimizar los renderizados). 

Si prefieres la coherencia a una sintaxis un poco más detallada, es razonable escribir siempre un actualizador si el estado que está configurando se calcula a partir del estado anterior.  Si se calcula a partir del estado anterior de alguna  otra  variable de estado, es posible que desees combinarlos en un solo objeto y [uses un reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes tituloText="La diferencia entre pasar un actualizador y pasar el siguiente estado directamente" titleId="examples-updater">

#### Pasar la función de actualización {/*passing-the-updater-function*/}

Este ejemplo pasa la función de actualización, por lo que funciona el botón "+3". 

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Tu edad: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Pasar el siguiente estado directamente {/*passing-the-next-state-directly*/}

Este ejemplo  **no pasa** la función de actualización, por lo que el botón "+3" **no funciona según lo previsto** . 

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Tu edad: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Actualización de objetos y _arrays_ en el estado {/*updating-objects-and-arrays-in-state*/}

Se pueden poner objetos y _arrays_ en el estado. En React, el estado se considera de solo lectura, por lo que **debes reemplazar en lugar de  *mutar* tus objetos existentes**. Por ejemplo, si tienes un objeto `formulario` en el estado, no lo actualices así: 

```js
// 🚩 No cambies un objeto en un estado como este:
formulario.primerNombre = 'Taylor';
```

En su lugar, reemplaza todo el objeto creando uno nuevo:

```js
// ✅ Reemplaza el estado con un nuevo objeto
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Lee [actualizar objetos en el estado](/learn/updating-objects-in-state) y [actualizar _arrays_ en el estado](/learn/updating-arrays-in-state) para saber más.

<Recipes tituloText="Ejemplos de objetos y arrays en estado" titleId="examples-objects">

#### Formulario (objeto) {/*form-object*/}

En este ejemplo, la variable de estado `formulario` contiene un objeto.  Cada entrada tiene un controlador de cambios que llama `setFormulario` con el siguiente estado de todo el formulario.  La sintaxis de propagación `{ ...formulario }` garantiza que el objeto de estado se reemplace en lugar de mutarse. 

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        Nombre:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Apellidos:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Correo electrónico:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Formulario (objeto anidado) {/*form-nested-object*/}

En este ejemplo, el estado está más anidado. Cuando actualizas el estado anidado, debes crear una copia del objeto que está actualizando, así como cualquier objeto que lo "contenga" en el camino hacia arriba. Lee [actualizar un objeto anidado](/learn/updating-objects-in-state#updating-a-nested-object) para obtener más información. 

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
<<<<<<< HEAD
      title: 'Nana azul',
      city: 'Hamburgo',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
=======
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Nombre:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Título:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Ciudad:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Imagen:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' por '}
        {person.name}
        <br />
        (localizada en {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### Lista (array) {/*list-array*/}

En este ejemplo, la variable de estado `todos` contiene un _array_. Cada controlador de botón llama a `setTodos` con la próxima versión de ese _array_. La sintaxis de propagación `[...todos]`, `todos.map()` y `todos.filter()` aseguran que el _array_ de estado se reemplace en lugar de mutarse.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Agregar tarea"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Añadir</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Guardar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

<Solution />

#### Escribir lógica de actualización concisa con Immer {/*writing-concise-update-logic-with-immer*/}

Si actualizar _arrays_ y objetos sin mutación resulta tedioso, puedes usar una biblioteca como [Immer](https://github.com/immerjs/use-immer) para reducir el código repetitivo. Immer te permite escribir código conciso como si estuvieras mutando objetos, pero internamente realiza actualizaciones inmutables:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Grandes barrigas', seen: false },
  { id: 1, title: 'Paisaje lunar', seen: false },
  { id: 2, title: 'Guerreros de terracota', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Lista de deseos para obras de arte</h1>
      <h2>Mi lista de obras de arte para ver:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
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

<Solution />

</Recipes>

---

### Evitar recrear el estado inicial {/*avoiding-recreating-the-initial-state*/}

React guarda el estado inicial una vez y lo ignora en los próximos renderizados.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Aunque el resultado de `createInitialTodos()` solo se usa para el renderizado inicial, todavía está llamando a esta función en cada renderizado. Esto puede ser un desperdicio si se trata de crear _arrays_ grandes o realizar cálculos costosos.

Para resolver esto, puedes **pasarlo como una función inicializadora** a `useState` en su lugar:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Observa que estás pasando `createInitialTodos`, que es la *función misma*, y no `createInitialTodos()`, que es el resultado de llamarla. Si pasas una función a `useState`, React solo la llamará durante la inicialización.

React puede [llamar a tus inicializadores dos veces](#my-initializer-or-updater-function-runs-twice) en desarrollo para verificar que sean [puros.](/learn/keeping-components-pure)

<Recipes tituloText="La diferencia entre pasar un inicializador y pasar el valor inicial directamente" titleId="examples-initializer">

#### Paso de la función de inicializadora {/*passing-the-initializer-function*/}

Este ejemplo pasa la función de inicialización, por lo que la función `createInitialTodos` solo se ejecuta durante la inicialización. No se ejecuta cuando el componente se vuelve a renderizar, como cuando escribe en la entrada.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Agregar</button>
      <ul>
        {todos.map(item => (
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

Este ejemplo **no** pasa la función de inicialización, por lo que la función `createInitialTodos` se ejecuta en cada renderizado, como cuando escribes en la entrada. No hay una diferencia observable en el comportamiento, pero este código es menos eficiente.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Agregar</button>
      <ul>
        {todos.map(item => (
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

### Reinicio del estado con una _key_ {/*resetting-state-with-a-key*/}

Por lo general, es posible que encuentre el atributo _`key`_ al [renderizar listas.](/learn/rendering-lists) Sin embargo, también tiene otro propósito.

Puede **reiniciar el estado de un componente pasando una _`key`_ diferente a un componente.** En este ejemplo, el botón Reiniciar cambia la variable de estado `versión`, que pasamos como una _`key`_ al `Formulario`. Cuando la _`key`_ cambia, React vuelve a crear el componente `Formulario` (y todos sus hijos) desde cero, por lo que su estado se reinicia.

Lea [preservar y reiniciar el estado](/learn/preserving-and-resetting-state) para obtener más información.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reiniciar</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hola, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Almacenamiento de información de renderizados anteriores {/*storing-information-from-previous-renders*/}

Por lo general, actualizarás el estado en los controladores de eventos. Sin embargo, en casos excepcionales, es posible que desees ajustar el estado en respuesta al renderizado; por ejemplo, es posible que desees cambiar una variable de estado cuando cambia una propiedad.

En la mayoría de los casos, no lo necesitas:

* **Si el valor que necesitas se puede calcular completamente a partir de las props actuales u otro estado, [elimina ese estado redundante por completo.](/learn/choosing-the-state-structure#avoid-redundant-state)** Si te preocupa volver a calcular con demasiada frecuencia, el [Hook `useMemo`](/reference/react/useMemo) puede ayudarte.
* Si deseas reiniciar el estado de todo el árbol de componentes, [pasa una _`key`_ diferente a tu componente.](#resetting-state-with-a-key)
* Si puedes, actualiza todo el estado relevante en los controladores de eventos.

En el raro caso de que ninguno de estos se aplique, hay un patrón que puedes usar para actualizar el estado en función de los valores que se han renderizado hasta el momento, llamando a una función `set` mientras tu componente se está renderizando.

Aquí hay un ejemplo. Este componente `CountLabel` muestra la propiedad `count` que se le pasó:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Digamos que quieres mostrar si el contador ha *aumentado o disminuido* desde el último cambio. La prop `count` no te lo dice, -- necesitas realizar un seguimiento de su valor anterior. Agrega la variable de estado `prevCount` para realizar un seguimiento. Agrega otra variable de estado llamada `trend` para determinar si el conteo ha aumentado o disminuido. Compara `prevCount` con `count` y, si no son iguales, actualiza tanto `prevCount` como `trend`. Ahora puedes mostrar tanto el accesorio de conteo actual como *cómo ha cambiado desde el último renderizado*.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Aumentar
      </button>
      <button onClick={() => setCount(count - 1)}>
        Disminuir
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'aumenta' : 'disminuye');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>El contador {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Ten en cuenta que si llamas a una función `set` durante el renderizado, debe estar dentro de una condición como `prevCount !== count`, y debe haber una llamada como `setPrevCount(count)` dentro de la condición. De lo contrario, tu componente se volvería a procesar en un bucle hasta que se bloquee. Además, solo puedes actualizar el estado del componente *actualmente renderizado* de esta manera. Llamar a la función `set` de *otro* componente durante el renderizado es un error. Finalmente, tu llamada `set` aún debería [actualizar el estado sin mutación](#updating-objects-and-arrays-in-state) -- este caso especial no significa que puedas romper otras reglas de [funciones puras.](/learn/keeping-components-pure)

Este patrón puede ser difícil de entender y, por lo general, es mejor evitarlo. Sin embargo, es mejor que actualizar el estado en un Efecto. Cuando llamas a la función `set` durante el renderizado, React volverá a renderizar ese componente inmediatamente después de que tu componente salga con una declaración `return` y antes de renderizar los hijos. De esta manera, sus hijos no necesitan renderizarse dos veces. El resto de la función de tu componente aún se ejecutará (y el resultado se descartará), pero si tu condición está por debajo de todas las llamadas a Hooks, puedes agregar un `return;` anticipado dentro de él para reiniciar el renderizado antes.

---

## Solución de problemas {/*troubleshooting*/}

### He actualizado el estado, pero el registro me da el valor anterior {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Llamar a la función `set` **no cambia el estado en el código en ejecución**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Solicitar un re-render con 1
  console.log(count);  // Todavía 0!

  setTimeout(() => {
    console.log(count); // También es 0!
  }, 5000);
}
```

Esto se debe a que [los estados se comportan como una instantánea.](/learn/state-as-a-snapshot) La actualización del estado solicita otro procesamiento con el nuevo valor del estado, pero no afecta la variable de JavaScript `count` en tu controlador de evento que ya se está ejecutando.

Si necesitas usar el siguiente estado, puedes guardarlo en una variable antes de pasarlo a la función `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### He actualizado el estado, pero la pantalla no se actualiza {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React **ignorará tu actualización si el siguiente estado es igual al estado anterior**, según lo determine un [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Esto generalmente sucede cuando cambias un objeto o un _array_ en el estado directamente:

```js
obj.x = 10;  // 🚩 Incorrecto: mutar objeto existente
setObj(obj); // 🚩 No hace nada
```

Mutaste un objeto `obj` existente y se lo volviste a pasar a `setObj`, por lo que React ignoró la actualización. Para solucionar esto, debes asegurarte de estar siempre [_reemplazando_ objetos y arreglos en el estado en lugar de _mutarlos_](#updating-objects-and-arrays-in-state) :

```js
// ✅ Correcto: crear un nuevo objeto
setObj({
  ...obj,
  x: 10
});
```

---

### Recibo un error: "Demasiados renderizados" {/*im-getting-an-error-too-many-re-renders*/}

Es posible que recibas un error que diga: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` (`Demasiados renderizados. React limita la cantidad de renderizados para evitar un bucle infinito.`) Por lo general, esto significa que estás estableciendo el estado incondicionalmente *durante el renderizado*, por lo que tu componente entra en un bucle: renderizar, establecer el estado (lo que provoca un renderizado), renderizar, establecer estado (que provoca un renderizado), y así sucesivamente. Muy a menudo, esto se debe a un error al especificar un controlador de evento:

```js {1-2}
// 🚩 Incorrecto: llama al controlador durante el procesamiento
return <button onClick={handleClick()}>Hazme clic</button>

// ✅ Correcto: pasa el controlador de evento
return <button onClick={handleClick}>Hazme clic</button>

// ✅ Correcto: pasa una función en línea
return <button onClick={(e) => handleClick(e)}>Hazme clic</button>
```

Si no puedes encontrar la causa de este error, haz clic en la flecha al lado del error en la consola y mira a través de la pila de JavaScript para encontrar la llamada de función `set` específica responsable del error.

---

### Mi función de inicialización o actualización se ejecuta dos veces {/*my-initializer-or-updater-function-runs-twice*/}

En [Modo estricto](/reference/react/StrictMode), React llamará a algunas de tus funciones dos veces en lugar de una:

```js {2,5-6,11-12}
function TodoList() {
  // Esta función de componente se ejecutará dos veces por cada procesamiento.

  const [todos, setTodos] = useState(() => {
    // Esta función de inicialización se ejecutará dos veces durante la inicialización.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Esta función de actualización se ejecutará dos veces por cada click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

Esto se espera y no debería romper tu código.

Este comportamiento que ocurre **solo en desarrollo** te ayuda a [mantener los componentes puros.](/learn/keeping-components-pure) React usa el resultado de una de las llamadas e ignora el resultado de la otra llamada. Siempre que tus funciones de componente, inicializadoras y actualizadoras sean puras, esto no debería afectar su lógica. Sin embargo, si son impuras accidentalmente, esto te ayuda a detectar los errores y corregirlos.

Por ejemplo, esta función de actualización impura muta un _array_ en el estado:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Error: estado mutando
  prevTodos.push(createTodo());
});
```

Debido a que React llama a tu función de actualización dos veces, verás que la tarea pendiente se agregó dos veces, por lo que sabrás que hay un error. En este ejemplo, puede corregir el error [reemplazando el _array_ en lugar de mutarlo](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correcto: reemplazar con nuevo estado
  return [...prevTodos, createTodo()];
});
```

Ahora que esta función de actualización es pura, llamarla una vez más no hace una diferencia en el comportamiento. Es por eso que al React llamarla dos veces te ayuda a encontrar errores. **Solo las funciones de componente, inicializadoras y actualizadoras deben ser puras.** Los controladores de eventos no necesitan ser puros, por lo que React nunca llamará a tus controladores de eventos dos veces.

Lea [mantener los componentes puros](/learn/keeping-components-pure) para obtener más información.

---

### Estoy tratando de establecer el estado como una función, pero termina siendo llamada {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

No puedes poner una función en un estado como este:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Debido a que estás pasando una función, React asume que `someFunction` es una [función inicializadora](#avoiding-recreating-the-initial-state), y que `someOtherFunction` es una [función actualizadora](#updating-state-based-on-the-previous-state), por lo que intenta llamarlas y almacenar el resultado. Para realmente *almacenar* una función, tienes que poner `() =>` delante de ellas en ambos casos. Entonces React almacenará las funciones que pases.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
