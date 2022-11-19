---
titulo: useState
---

<Intro>

`useState` es un React Hook que le permite agregar una [variable de estado](/learn/state-a-components-memory) a su componente.

```js
const [estado, setEstado] = useState(estadoInicial)
```

</Intro>

<InlineToc />

---

## Uso {/*uso*/}

### Agregar estado a un componente {/*agregar-estado-a-un-componente*/}

Llamar `useState` en el nivel superior de su componente para declarar una o más [variables de estado.](/learn/state-a-components-memory)

```js [[1, 4, "edad"], [2, 4, "setEdad"], [3, 4, "42"], [1, 5, "nombre"], [2, 5, "setNombre"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [edad, setEdad] = useState(42);
  const [nombre, setNombre] = useState('Taylor');
  // ...
```

La convención es nombrar variables de estado como `[algo, setAlgo]` utilizando la [desestructuración de matrices.](https://javascript.info/destructuring-assignment) 

`useState` devuelve un array con exactamente dos elementos:

1. El <CodeStep step={1}>estado actual</CodeStep> de esta variable de estado, establecida inicialmente en el <CodeStep step={3}>estado inicial</CodeStep> que proporcionó.
2. La <CodeStep step={2}>función `set`</CodeStep> que le permite cambiarlo a cualquier otro valor en respuesta a la interacción. 

Para actualizar lo que está en la pantalla, llame a la función set con algún estado: 

```js [[2, 2, "setNombre"]]
function handleClick() {
  setNombre('Robin');
}
```

React almacenará el siguiente estado, renderizará su componente nuevamente con los nuevos valores y actualizará la interfaz de usuario. 

<Pitfall>


Llamando a la función `set` [**no  cambia** el estado actual en el código que ya se está ejecutando ](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setNombre('Robin');
  console.log(nombre); // Sigue siendo "Taylor"!
}
```
Solo afecta lo que `useState` devolverá a partir del *siguiente* render. 

</Pitfall>

<Recipes tituloText="Ejemplos básicos de useState" tituloId="examples-basic">

#### Contador (número) {/*counter-number*/}

En este ejemplo, la variable `contador` contiene un número. Al hacer click en el botón lo incrementa

<Sandpack>

```js
import { useState } from 'react';

export default function Contador() {
  const [contador, setContador] = useState(0);

  function handleClick() {
    setContador(contador + 1);
  }

  return (
    <button onClick={handleClick}>
      Me presionaste {contador} veces
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Campo de texto (cadena) {/*text-field-string*/}
                                                                                            
En este ejemplo, la variable de estado `texto` contiene una cadena. Cuando escribes,`handleChange` lee el ultimo valor ingresado al elemento input del DOM desde el navegador y llama  `setTexto` para actualizar el estado.  Esto le permite mostrar el actual `texto`  abajo. 

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [texto, setTexto] = useState('hola');

  function handleChange(e) {
    setTexto(e.target.value);
  }

  return (
    <>
      <input value={texto} onChange={handleChange} />
      <p>Escribiste: {texto}</p>
      <button onClick={() => setTexto('hola')}>
        Reiniciar
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (booleano) {/*checkbox-boolean*/}

En este ejemplo, la variable de estado `meGusta` contiene un valor booleano.  Al hacer click en el checkbox, `setMeGusta` actualiza la variable de estado `meGusta` si es que la entrada del checkbox del navegador fue marcada.  La variable `meGusta` se utiliza para representar el texto debajo del checkbox. 

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [meGusta, setMeGusta] = useState(true);

  function handleChange(e) {
    setMeGusta(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={meGusta}
          onChange={handleChange}
        />
        Me gusta esto
      </label>
      <p>A ti {meGusta ? 'te gusta' : 'no te gusta'} esto.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Formulario (dos variables) {/*form-two-variables*/}

Se puede declarar más de una variable de estado en el mismo componente.  Cada variable de estado es completamente independiente. 

<Sandpack>

```js
import { useState } from 'react';

export default function Formulario() {
  const [nombre, setNombre] = useState('Taylor');
  const [edad, setEdad] = useState(42);

  return (
    <>
      <input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
      />
      <button onClick={() => setEdad(edad + 1)}>
        Incrementar edad
      </button>
      <p>Hola, {nombre}. Tu tiene {edad} años.</p>
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

### Estado de actualización basado en el estado anterior {/*updating-state-based-on-the-previous-state*/}

Supongamos que `edad` es `42`. La función `handler` llama `setEdad(edad + 1)` tres veces:

```js
function handleClick() {
  setEdad(edad + 1); // setEdad(42 + 1)
  setEdad(edad + 1); // setEdad(42 + 1)
  setEdad(edad + 1); // setEdad(42 + 1)
}
```
Sin embargo, después de un click, `edad` solo será `43` en lugar de 45!  Esto se debe a que llamar a la función `set ` no actualizará  la variable de estado `edad` en el código que ya se está ejecutando.  Así que cada llamada `setAge(age + 1)` se convierte en `setEdad(43)`. 

Para resolver este problema, **puede pasar una  función de actualización**  a `setEdad` en lugar del siguiente estado: 

```js [[1, 2, "e ", 2], [2, 2, "e + 1"], [1, 3, "e ", 2], [2, 3, "e + 1"], [1, 4, "e ", 2], [2, 4, "e + 1"]]
function handleClick() {
  setEdad(e => e + 1); // setEdad(42 => 43)
  setEdad(e => e + 1); // setEdad(43 => 44)
  setEdad(e => e + 1); // setEdad(44 => 45)
}
```

Aqui, `e => e + 1` es la función de actualización. Toma el <CodeStep step={1}>estado pendiente</CodeStep> y calcula el <CodeStep step={2}>siguiente estado</CodeStep> a partir de él.

React pone sus funciones de actualización en una [cola.](/learn/queueing-a-series-of-state-updates) Entonces, durante el siguiente renderizado, las llamara en el mismo orden:

1. `e => e + 1` recibirá `42` como estado pendiente y devolverá `43` como el siguiente estado.
1. `e => e + 1` recibirá `43` como estado pendiente y devolverá `44` como el siguiente estado.
1. `e => e + 1` recibirá `44` como estado pendiente y devolverá `45` como el siguiente estado.

No hay otras actualizaciones en cola, por lo que React almacenará `45` como el estado actual al final.

Por convención, es común nombrar el argumento de estado pendiente como la primera letra del nombre de la variable de estado, como `e` para `edad`. No obstante, también puedes llamarlo como `prevEdad` o cualquier otra cosa que te resulte más clara.

React puede [llamar a sus actualizadores dos veces](#my-initializer-or-updater-function-runs-twice) en desarrollo para verificar que sean [puros.](/learn/keeping-components-pure)

<DeepDive titulo="¿Siempre se prefiere usar un actualizador?">

Es posible que escuches una recomendación para escribir siempre código como `setEdad(e => e + 1)` si el estado que está configurando se calcula a partir del estado anterior.  No hay daño en ello, pero tampoco siempre es necesario. 

En la mayoría de los casos, no hay diferencia entre estos dos enfoques. React siempre se asegura de que para las acciones intencionales del usuario, como los click, la variable de estado `edad` se actualizará antes del siguiente click. Esto significa que no hay riesgo de que un controlador de clicks vea un mensaje "obsoleto" de `edad` al comienzo del controlador de eventos.

Sin embargo, si realiza varias actualizaciones dentro del mismo evento, los actualizadores pueden ser útiles. También son útiles si acceder a la variable de estado en sí es un inconveniente (es posible que te encuentres con esto al optimizar los renderizados). 

Si prefiere la coherencia a una sintaxis un poco más detallada, es razonable escribir siempre un actualizador si el estado que está configurando se calcula a partir del estado anterior.  Si se calcula a partir del estado anterior de alguna  otra  variable de estado, es posible que desee combinarlos en un solo objeto y [uses un reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes tituloText="La diferencia entre pasar un actualizador y pasar el siguiente estado directamente" tituloId="examples-updater">

#### Pasar la funcion de actualización {/*passing-the-updater-function*/}

Este ejemplo pasa la función de actualización, por lo que funciona el botón "+3". 

<Sandpack>

```js
import { useState } from 'react';

export default function Contador() {
  const [edad, setEdad] = useState(42);

  function incremento() {
    setEdad(a => a + 1);
  }

  return (
    <>
      <h1>Tu edad: {edad}</h1>
      <button onClick={() => {
        incremento();
        incremento();
        incremento();
      }}>+3</button>
      <button onClick={() => {
        incremento();
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

#### Pasando el siguiente estado directamente  {/*passing-the-next-state-directly*/}

Este ejemplo  **no pasa** la función de actualización, por lo que el botón "+3" **no funciona según lo previsto** . 

<Sandpack>

```js
import { useState } from 'react';

export default function Contador() {
  const [edad, setEdad] = useState(42);

  function increment() {
    setEdad(edad + 1);
  }

  return (
    <>
      <h1>Tu edad: {edad}</h1>
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

### Actualización de objetos y matrices en el estado  {/*updating-objects-and-arrays-in-state*/}

Se pueden poner objetos y matrices en el estado. En React, el estado se considera de solo lectura, por lo  que **debe reemplazarse  en lugar de  *mutar*  sus objetos existentes**  .   Por ejemplo, si tienes un objeto `formulario` en el estado, no lo actualices así: 


```js
// 🚩 No cambies un objeto en un estado como este:
formulario.primernombre = 'Taylor';
```

En su lugar, reemplace todo el objeto creando uno nuevo:

```js
// ✅ Reemplaza el estado con un nuevo objeto
setFormulario({
  ...formulario,
  primernombre: 'Taylor'
});
```

Lea [updating objects in state](/learn/updating-objects-in-state) and [updating arrays in state](/learn/updating-arrays-in-state) to learn more.

<Recipes tituloText="Ejemplos de objetos y arreglos en estado" tituloId="examples-objects">

#### Formulario (object) {/*form-object*/}

En este ejemplo, la variable de estado `formulario` contiene un objeto.  Cada entrada tiene un controlador de cambios que llama `setFormulario` con el siguiente estado de todo el formulario.  La sintaxis extendida `{ ...formulario }` garantiza que el objeto de estado se reemplace en lugar de mutar. 


<Sandpack>

```js
import { useState } from 'react';

export default function Formulario() {
  const [formulario, setFormulario] = useState({
    nombre: 'Barbara',
    apellido: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        Nombre:
        <input
          value={formulario.nombre}
          onChange={e => {
            setFormulario({
              ...formulario,
              nombre: e.target.value
            });
          }}
        />
      </label>
      <label>
        Apellido:
        <input
          value={formulario.apellido}
          onChange={e => {
            setForm({
              ...formulario,
              apellido: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={formulario.email}
          onChange={e => {
            setForm({
              ...formulario,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {formulario.nombre}{' '}
        {formulario.apellido}{' '}
        ({formulario.email})
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

#### Formulario (objeto anidado)  {/*form-nested-object*/}

En este ejemplo, el estado está más anidado.   Cuando actualiza el estado anidado, debe crear una copia del objeto que está actualizando, así como cualquier objeto que lo "contenga" en el camino hacia arriba.   Lea  [actualizar un objeto anidado](/learn/updating-objects-in-state#updating-a-nested-object)  para obtener más información. 


<Sandpack>

```js
import { useState } from 'react';

export default function Formulario() {
  const [persona, setPersona] = useState({
    nombre: 'Niki de Saint Phalle',
    obra: {
      titulo: 'Blue Nana',
      ciudad: 'Hamburg',
      imagen: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handlenombreChange(e) {
    setPersona({
      ...persona,
      nombre: e.target.value
    });
  }

  function handletituloChange(e) {
    setPersona({
      ...persona,
      obra: {
        ...persona.artwork,
        titulo: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPersona({
      ...persona,
      artwork: {
        ...persona.artwork,
        city: e.target.value
      }
    });
  }

  function handleimagenChange(e) {
    setPersona({
      ...persona,
      artwork: {
        ...persona.artwork,
        imagen: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Nombre:
        <input
          value={persona.nombre}
          onChange={handlenombreChange}
        />
      </label>
      <label>
        Titulo:
        <input
          value={persona.artwork.titulo}
          onChange={handletituloChange}
        />
      </label>
      <label>
        Ciudad:
        <input
          value={persona.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Imagen:
        <input
          value={persona.artwork.imagen}
          onChange={handleimagenChange}
        />
      </label>
      <p>
        <i>{persona.artwork.titulo}</i>
        {' by '}
        {persona.nombre}
        <br />
        (ubicado en {persona.artwork.city})
      </p>
      <img 
        src={persona.artwork.imagen} 
        alt={persona.artwork.titulo}
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

En este ejemplo, la variable de estado `todos` contiene una matriz. Cada controlador de botón llama a `setTodos` con la próxima versión de esa matriz. La sintaxis de propagación `[...todos]`, `todos.map()` y `todos.filter()` aseguran que la matriz de estado se reemplace en lugar de mutar.

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, titulo: 'Comprar leche', done: true },
  { id: 1, titulo: 'Comer tacos', done: false },
  { id: 2, titulo: 'Preparar té', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(titulo) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        titulo: titulo,
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

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [titulo, settitulo] = useState('');
  return (
    <>
      <input
        placeholder="Agregar para hacer"
        value={titulo}
        onChange={e => settitulo(e.target.value)}
      />
      <button onClick={() => {
        settitulo('');
        onAddTodo(titulo);
      }}>Agregar</button>
    </>
  )
}
```

```js TaskList.js
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
          value={todo.titulo}
          onChange={e => {
            onChange({
              ...todo,
              titulo: e.target.value
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
        {todo.titulo}
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
        Borrar
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

Si actualizar matrices y objetos sin mutación resulta tedioso, puede usar una biblioteca como [Immer](https://github.com/immerjs/use-immer) para reducir el código repetitivo. Immer te permite escribir código conciso como si estuvieras mutando objetos, pero bajo el capó realiza actualizaciones inmutables:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, titulo: 'Big Bellies', seen: false },
  { id: 1, titulo: 'Paisaje Lunar', seen: false },
  { id: 2, titulo: 'Ejército de Terracota', seen: true },
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
      <h1>Lista de cubo de arte</h1>
      <h2>Mi lista de arte para ver:</h2>
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
            {artwork.titulo}
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
  const [todos, setTodos] = useState(crearIniciarTodos());
  // ...
```

Aunque el resultado de `crearIniciarTodos()` solo se usa para el renderizado inicial, todavía está llamando a esta función en cada renderizado. Esto puede ser un desperdicio si se trata de crear matrices grandes o realizar cálculos costosos.

Para resolver esto, puede **pasarlo como una función _initializer_** a `useState` en su lugar:

```js
function TodoList() {
  const [todos, setTodos] = useState(crearInicialTodos);
  // ...
```

Observa que está pasando `crearIniciarTodos`, que es la *función misma*, y no `crearIniciarTodos()`, que es el resultado de llamarla. Si pasa una función a `useState`, React solo la llamará durante la inicialización.

React puede [llamar a sus inicializadores dos veces](#my-initializer-or-updater-function-runs-twice) en desarrollo para verificar que sean [puros.](/learn/manteniendo-componentes-puros)

<Recipes tituloText="The difference between passing an initializer and passing the initial state directly" tituloId="examples-initializer">

#### Pasando la función de inicializador {/*passing-the-initializer-function*/}

Este ejemplo pasa la función de inicialización, por lo que la función `crearIniciarTodos` solo se ejecuta durante la inicialización. No se ejecuta cuando el componente se vuelve a renderizar, como cuando escribe en la entrada.

<Sandpack>

```js
import { useState } from 'react';

function crearIniciarTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      texto: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(crearIniciarTodos);
  const [texto, setTexto] = useState('');

  return (
    <>
      <input
        value={texto}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setTexto('');
        setTodos([{
          id: todos.length,
          texto: texto
        }, ...todos]);
      }}>Agregar</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.texto}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Pasando el estado inicial directamente {/*passing-the-initial-state-directly*/}

Este ejemplo **no** pasa la función de inicialización, por lo que la función `crearIniciarTodos` se ejecuta en cada representación, como cuando escribes en la entrada. No hay una diferencia observable en el comportamiento, pero este código es menos eficiente.

<Sandpack>

```js
import { useState } from 'react';

function crearIniciarTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      texto: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(crearIniciarTodos());
  const [texto, setTexto] = useState('');

  return (
    <>
      <input
        value={texto}
        onChange={e => setTexto(e.target.value)}
      />
      <button onClick={() => {
        setTexto('');
        setTodos([{
          id: todos.length,
          texto: texto
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.texto}
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

### Restablecimiento de estado con una key {/*resetting-state-with-a-key*/}

Por lo general, es posible que encuentre el atributo `key` al [representar listas.](/learn/rendering-lists) Sin embargo, también tiene otro propósito.

Puede **restablecer el estado de un componente pasando una `key` diferente a un componente.** En este ejemplo, el botón Restablecer cambia la variable de estado `versión`, que pasamos como una `key` al `Formulario`. Cuando la `key` cambia, React vuelve a crear el componente `Formulario` (y todos sus elementos secundarios) desde cero, por lo que su estado se restablece.

Lea [preservar y restablecer el estado](/aprender/preservar-y-restablecer-el-estado) para obtener más información.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Formulario key={version} />
    </>
  );
}

function Formulario() {
  const [nombre, setNombre] = useState('Taylor');

  return (
    <>
      <input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
      />
      <p>Hola, {nombre}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Almacenamiento de información de renders anteriores {/*storing-information-from-previous-renders*/}

Por lo general, actualizará el estado en los controladores de eventos. Sin embargo, en casos excepcionales, es posible que desee ajustar el estado en respuesta a la representación; por ejemplo, es posible que desee cambiar una variable de estado cuando cambia una propiedad.

En la mayoría de los casos, no necesita esto:

* **Si el valor que necesita se puede calcular completamente a partir de los accesorios actuales u otro estado, [elimine ese estado redundante por completo.](/learn/choosing-the-state-structure#avoid-redundant-state)** Si te preocupa volver a calcular con demasiada frecuencia, el [Hook `useMemo`](/apis/react/usememo) puede ayudarte.
* Si desea restablecer el estado de todo el árbol de componentes, [pase una `key` diferente a su componente.](#resetting-state-with-a-key)
* Si puede, actualice todo el estado relevante en los controladores de eventos.

En el raro caso de que ninguno de estos se aplique, hay un patrón que puede usar para actualizar el estado en función de los valores que se han representado hasta el momento, llamando a una función `set` mientras su componente se está procesando.

Aquí hay un ejemplo. Este componente `EtiquetaDeConteo` muestra la propiedad `conteo` que se le pasó:

```js EtiquetaDeConteo.js
export default function EtiquetaDeConteo({ conteo }) {
  return <h1>{conteo}</h1>
}
```
Digamos que quiere mostrar si el contador ha *aumentado o disminuido* desde el último cambio. El accesorio `conteo` no le dice esto, -- necesita realizar un seguimiento de su valor anterior. Agregue la variable de estado `prevConteo` para realizar un seguimiento. Agregue otra variable de estado llamada `trend` para determinar si el conteo ha aumentado o disminuido. Compare `prevConteo` con `conteo` y, si no son iguales, actualice tanto `prevConteo` como `trend`. Ahora puede mostrar tanto el accesorio de conteo actual como *cómo ha cambiado desde el último renderizado*.

<Sandpack>

```js App.js
import { useState } from 'react';
import EtiquetaDeConteo from './EtiquetaDeConteo.js';

export default function App() {
  const [conteo, setConteo] = useState(0);
  return (
    <>
      <button onClick={() => setConteo(conteo + 1)}>
        Incrementar
      </button>
      <button onClick={() => setConteo(conteo - 1)}>
        Disminuir
      </button>
      <EtiquetaDeConteo conteo={conteo} />
    </>
  );
}
```

```js EtiquetaDeConteo.js active
import { useState } from 'react';

export default function EtiquetaDeConteo({ conteo }) {
  const [prevConteo, setprevConteo] = useState(conteo);
  const [trend, setTrend] = useState(null);
  if (prevConteo !== conteo) {
    setprevConteo(conteo);
    setTrend(conteo > prevConteo ? 'incrementando' : 'disminuyendo');
  }
  return (
    <>
      <h1>{conteo}</h1>
      {trend && <p>El conteo está {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Tenga en cuenta que si llama a una función `set` durante la renderización, debe estar dentro de una condición como `prevConteo !== conteo`, y debe haber una llamada como `setPrevConteo(conteo)` dentro de la condición. De lo contrario, su componente se volvería a procesar en un bucle hasta que se bloquee. Además, solo puede actualizar el estado del componente *actualmente renderizado* de esta manera. Llamar a la función `set` de *otro* componente durante el renderizado es un error. Finalmente, su llamada `set` aún debería [actualizar el estado sin mutación](#updating-objects-and-arrays-in-state) -- este caso especial no significa que pueda romper otras reglas de [funciones puras.](/learn/keeping-components-pure)

Este patrón puede ser difícil de entender y, por lo general, es mejor evitarlo. Sin embargo, es mejor que actualizar el estado en un efecto. Cuando llamas a la función `set` durante el renderizado, React volverá a renderizar ese componente inmediatamente después de que tu componente salga con una declaración `return` y antes de renderizar a los elementos secundarios. De esta manera, sus hijos no necesitan renderizar dos veces. El resto de la función de su componente aún se ejecutará (y el resultado se descartará), pero si su condición está por debajo de todas las llamadas a Hooks, puede agregar un `retorno` anticipado dentro de él para reiniciar el renderizado antes.


---

## Reference {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Llame a `useState` en el nivel superior de su componente para declarar una [variable de estado](/learn/state-a-components-memory).

```js
import { useState } from 'react';

function MyComponent() {
  const [edad, setEdad] = useState(28);
  const [nombre, setNombre] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

La convención es nombrar variables de estado como `[algo, setAlgo]` usando [desestructuración de matriz](https://javascript.info/destructuring-assignment).

[Vea más ejemplos arriba.](#examples-basic)

#### Parameteros {/*parameters*/}

* `initialState`: El valor que desea que tenga el estado inicialmente. Puede ser un valor de cualquier tipo, pero hay un comportamiento especial para las funciones. Este argumento se ignora después del renderizado inicial.
  * Si pasa una función como `initialState`, se tratará como una _función inicializadora_. Debe ser pura, no debe aceptar argumentos y debe devolver un valor de cualquier tipo. React llamará a su función de inicialización al inicializar el componente y almacenará su valor de retorno como el estado inicial. [Vea un ejemplo arriba.](#avoiding-recreating-the-initial-state)
  

#### Returns {/*returns*/}

`useState` devuelve una matriz con exactamente dos valores:

1. El estado actual. Durante el primer renderizado, coincidirá con el `initialState` que haya pasado.
2. La [función `set`](#setstate) que le permite actualizar el estado a un valor diferente y desencadenar una nueva representación.

#### Advertencias {/*caveats*/}

* `useState` es un Hook, por lo que solo puede llamarlo **en el nivel superior de su componente** o sus propios Hooks. No puedes llamarlo dentro de bucles o condiciones. Si lo necesita, extraiga un nuevo componente y mueva el estado a él.
* En [Modo estricto](/apis/react/StrictMode), React **llamará a su función de inicialización dos veces** para [ayudarlo a encontrar impurezas accidentales.](#my-initializer-or-updater-function-runs-twoveces) Este es un comportamiento exclusivo de desarrollo y no afecta la producción. Si su función de inicialización es pura (como debería ser), esto no debería afectar la lógica de su componente. Se ignorará el resultado de una de las llamadas.
---

### Funciones `set` , como `setAlgo(siguienteEstado)` {/*setstate*/}

La función `set` devuelta por `useState` le permite actualizar el estado a un valor diferente y desencadenar una nueva representación. Puede pasar el siguiente estado directamente, o una función que lo calcule a partir del estado anterior:

```js
const [nombre, setNombre] = useState('Edward');

function handleClick() {
  setNombre('Taylor');
  setEdad(a => a + 1);
  // ...
```

#### Parametros {/*setstate-parameters*/}

  * `siguienteEstado`: El valor que desea que tenga el estado. Puede ser un valor de cualquier tipo, pero hay un comportamiento especial para las funciones.
   * Si pasa una función como `siguienteEstado`, se tratará como una _función de actualización_. Debe ser puro, debe tomar el estado pendiente como único argumento y debe devolver el siguiente estado. React pondrá su función de actualización en una cola y volverá a renderizar su componente. Durante el próximo renderizado, React calculará el siguiente estado aplicando todas las actualizaciones en cola al estado anterior. [Vea un ejemplo arriba.](#updating-state-based-on-the-previous-state)

#### Returns {/*setstate-returns*/}

Las funciones `set` no tienen un valor de retorno.

#### Advertencias {/*setstate-caveats*/}

* La función `set` **solo actualiza la variable de estado para el *próximo* renderizado**. Si lee la variable de estado después de llamar a la función `set`, [todavía obtendrá el valor anterior](#ive-updated-the-state-but-logging-gives-me-the-old-value) que estaba en la pantalla antes de su llamada.

* Si el nuevo valor que proporciona es idéntico al `estado` actual, según lo determinado por un [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **omitirá volver a renderizar el componente y sus elementos secundarios.** Esta es una optimización. Aunque en algunos casos React aún puede necesitar llamar a su componente antes de omitir a los elementos secundarios, no debería afectar su código.

* Reaccionar [actualizaciones de estado por lotes.](/learn/queueing-a-series-of-state-updates) Actualiza la pantalla **después de que todos los controladores de eventos se hayan ejecutado** y hayan llamado a sus funciones `set`. Esto evita múltiples renderizaciones durante un solo evento. En el raro caso de que necesite forzar a React a actualizar la pantalla antes, por ejemplo, para acceder al DOM, puede usar [`flushSync`.](/apis/react-dom/flushsync)

* Llamar a la función `set` *durante el renderizado* solo está permitido desde el componente de renderizado actual. React descartará su salida e inmediatamente intentará renderizarla nuevamente con el nuevo estado. Este patrón rara vez se necesita, pero puede usarlo para **almacenar información de los renderizados anteriores**. [Vea un ejemplo arriba.](#storing-information-from-previous-renders)

* En [Modo estricto](/apis/react/StrictMode), React **llamará a su función de actualización dos veces** para [ayudarlo a encontrar impurezas accidentales.](#my-initializer-or-updater-function-runs-twice) Este es un comportamiento exclusivo de desarrollo y no afecta la producción. Si su función de actualización es pura (como debería ser), esto no debería afectar la lógica de su componente. Se ignorará el resultado de una de las llamadas.
---

## Solución de problemas {/*troubleshooting*/}

### He actualizado el estado, pero el registro me da el valor anterior {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Llamar a la función `set` **no cambia el estado en el código en ejecución**:

```js {4,5,8}
function handleClick() {
  console.log(conteo);  // 0

  setConteo(conteo + 1); // Solicitar un re-render con 1
  console.log(conteo);  // Todavía 0!

  setTimeout(() => {
    console.log(conteo); // Tambien es 0!
  }, 5000);
}
```

Esto se debe a que [los estados se comportan como una instantánea.](/learn/state-as-a-snapshot) La actualización del estado solicita otro procesamiento con el nuevo valor del estado, pero no afecta la variable de JavaScript `conteo` en su evento Handler que ya se está ejecutando.

Si necesita usar el siguiente estado, puede guardarlo en una variable antes de pasarlo a la función `set`:

```js
const nextconteo = conteo + 1;
setConteo(nextconteo);

console.log(conteo);     // 0
console.log(nextconteo); // 1
```

---

### He actualizado el estado, pero la pantalla no se actualiza {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React **ignorará su actualización si el siguiente estado es igual al estado anterior**, según lo determine un [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Esto generalmente sucede cuando cambia un objeto o una matriz en el estado directamente :

```js
obj.x = 10;  // 🚩 Incorrecto: mutar objeto existente
setObj(obj); // 🚩 No hace nada
```

Mutó un objeto `obj` existente y lo devolvió a `setObj`, por lo que React ignoró la actualización. Para solucionar esto, debe asegurarse de estar siempre [_reemplazando_ objetos y arreglos en estado en lugar de _mutarlos_](#updating-objects-and-arrays-in-state) :

```js
// ✅ Correcto: creando un nuevo objeto
setObj({
  ...obj,
  x: 10
});
```

---

### Recibo un error: "Demasiados renderizados" {/*im-getting-an-error-too-many-re-renders*/}

Es posible que reciba un error que diga: `Demasiados renderizados. React limita la cantidad de renderizaciones para evitar un bucle infinito.` Por lo general, esto significa que está configurando incondicionalmente el estado *durante el renderizado*, por lo que su componente entra en un bucle: renderizar, establecer el estado (lo que provoca un renderizado), renderizar, establecer estado (que provoca un renderizado), y así sucesivamente. Muy a menudo, esto se debe a un error al especificar un controlador de eventos:

```js {1-2}
// 🚩 Incorrecto: llama al controlador durante el procesamiento
return <button onClick={handleClick()}>Haz click en mi</button>

// ✅ Correcto: pasa el controlador de eventos
return <button onClick={handleClick}>Haz click en mi</button>

// ✅ Correcto: transmite una función en línea
return <button onClick={(e) => handleClick(e)}>Haz click en mi</button>
```

Si no puede encontrar la causa de este error, haga clic en la flecha al lado del error en la consola y mire a través de la pila de JavaScript para encontrar la llamada de función `set` específica responsable del error.

---

### Mi función de inicializador o actualizador se ejecuta dos veces {/*my-initializer-or-updater-function-runs-twice*/}

En [Modo estricto](/apis/react/StrictMode), React llamará a algunas de sus funciones dos veces en lugar de una:

```js {2,5-6,11-12}
function TodoList() {
 // Esta función de componente se ejecutará dos veces por cada procesamiento.

  const [todos, setTodos] = useState(() => {
   // Esta función de inicialización se ejecutará dos veces durante la inicialización.
    return crearTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Esta función de actualización se ejecutará dos veces por cada click.
      return [...prevTodos, crearTodo()];
    });
  }
  // ...
```

Esto se espera y no debería romper su código.

Este comportamiento de **solo desarrollo** lo ayuda a [mantener los componentes puros.](/learn/keeping-components-pure) React usa el resultado de una de las llamadas e ignora el resultado de la otra llamada. Siempre que sus funciones de componente, inicializador y actualizador sean puras, esto no debería afectar su lógica. Sin embargo, si son impuros accidentalmente, esto le ayuda a detectar los errores y corregirlos.

Por ejemplo, esta función de actualización impura muta una matriz en el estado:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Error: estado mutando
  prevTodos.push(crearTodo());
});
```

Debido a que React llama a su función de actualización dos veces, verá que la tarea pendiente se agregó dos veces, por lo que sabrá que hay un error. En este ejemplo, puede corregir el error [reemplazando la matriz en lugar de mutarla](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correcto: reemplazando con nuevo estado
  return [...prevTodos, crearTodo()];
});
```

Ahora que esta función de actualización es pura, llamarla un tiempo extra no hace una diferencia en el comportamiento. Es por eso que React llamarlo dos veces lo ayuda a encontrar errores. **Solo las funciones de componente, inicializador y actualizador deben ser puras.** Los controladores de eventos no necesitan ser puros, por lo que React nunca llamará a sus controladores de eventos dos veces.

Lea [manteniendo los componentes puros](/learn/keeping-components-pure) para obtener más información.

---

### Estoy tratando de establecer el estado de una función, pero es llamado en su lugar {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

No puedes poner una función en un estado como este:

```js
const [fn, setFn] = useState(algunaFuncion);

function handleClick() {
  setFn(algunaOtraFuncion);
}
```

Debido a que estás pasando una función, React asume que `algunaFuncion` es una [función inicializadora](#avoiding-recreating-the-initial-state), y que `algunaOtraFuncion` es una [función actualizadora](#updating-state-based-on-the-previous-state), por lo que intenta llamarlos y almacenar el resultado. Para realmente *almacenar* una función, tienes que poner `() =>` delante de ellos en ambos casos. Entonces React almacenará las funciones que pase.

```js {1,4}
const [fn, setFn] = useState(() => algunaFuncion);

function handleClick() {
  setFn(() => algunaOtraFuncion);
}
```
