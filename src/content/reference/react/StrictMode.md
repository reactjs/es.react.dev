---
title: <StrictMode>
---


<Intro>

`<StrictMode>` le permite encontrar errores comunes en los componentes al comienzo del desarrollo.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Use `StrictMode` para habilitar comportamientos de compilación y advertencias adicionales dentro del árbol de componentes que se encuentra dentro:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Ve más ejemplos abajo.](#Uso)

Strict Mode, habilitá los siguientes comportamientos de solo desarrollo:

- Tus componentes van a [volver a renderizarse una vez más](#fixing-bugs-found-by-double-rendering-in-development) para encontrar errores causados por renderizaciones impuras.
- Tus componentes van a [volver a ejecutar Effects una vez más](#fixing-bugs-found-by-re-running-effects-in-development) para encontrar errores causados por limpieza de Effects faltantes.
- Tus componentes van a [ser chequeados por uso de APIs obsoletas.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode`, no acepta props.

#### Advertencias {/*caveats*/}

* No hay forma de excluirse del Strict Mode dentro de un árbol envuelto en `<StrictMode>`. Esto te da confianza de que todos los componentes dentro de `<StrictMode>` son chequeados. Si dos equipos trabajan en un producto, no están de acuerdo sobre si encuentran los chequeos valiosos, necesitarían tanto llegar a un consenso o mover `<StrictMode>` abajo en el árbol.

---

## Uso {/*usage*/}

### Habilitando Strict Mode para la aplicación {/*enabling-strict-mode-for-entire-app*/}

Strict Mode, habilita chequeos adicionales de solo desarrollo para el árbol de componentes entero dentro del componente `<StrictMode>`. Estos chequeos ayudan a encontrar errores comunes en tus componentes al principio del proceso de desarrollo.

Para habilitar Strict Mode en toda tu aplicación, envuelve tu componente raíz con `<StrictMode>` cuando lo renderices:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Nosotros recomendamos envolver toda tu aplicación en Strict Mode, especialmente para aplicaciones recientemente creadas. Si usas un framework cuál es llamado [`createRoot`](/reference/react-dom/client/createRoot). Chequea su documentación para saber como habilitar Strict Mode.

A pesar de que, Strict Mode chequea **que solo corra en desarrollo,** te ayudará a encontrar errores que ya existen en tu código, pero pueden ser complicado reproducirlos de forma confiable en producción. Strict Mode, te permite corregir errores antes que tus usuarios los reporten.

<Note>

Strict Mode, habilita los siguientes chequeos en desarrollo:

- Tus componentes van a [volver a renderizarse una vez más](#fixing-bugs-found-by-double-rendering-in-development) para encontrar errores causados por renderizaciones impuras.
- Tus componentes van a [volver a correr Effects una vez más](#fixing-bugs-found-by-re-running-effects-in-development) para encontrar errores causados por limpieza de Effects faltantes.
- Tus componentes van a [ser chequeados por uso de APIs obsoletas.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Todos estos chequeos son solo desarrollo y no afectan la compilación de producción.**

</Note>

---

### Habilitando Strict Mode para una parte de la aplicación {/*enabling-strict-mode-for-a-part-of-the-app*/}

Tu también puedes habilitar Strict Mode para cualquier parte de tu aplicación:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

En este ejemplo, el chequeo de Strict Mode no va a correr en los componentes `Header` y `Footer`. De igual manera, si van a correr en `Sidebar` y `Content` al igual que todos los componentes dentro, no importa la profundidad.

---

### Solucionando errores encontrados por renderizado doble en desarrollo {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React, asume que cada componente que tú escribes es una función pura.](/learn/keeping-components-pure) Esto significa que los componentes de React que tú escribes deben siempre regresar el mismo JSX dando las mismas entradas (props, state y context).

Los componentes que rompen esta regla se comportan impredeciblemente y causan errores. Para ayudarte a encontrar código impuro accidental, Strict Mode, llama algunas de tus funciones (solo las que podrían ser puras) **dos veces en desarrollo.** Esto incluye:

- El cuerpo de la función de su componente (solo lógica de nivel superior, por lo que esto no incluye el código dentro de los controladores de eventos)
- Funciones que pasas a [`useState`](/reference/react/useState), [`set` functions](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), o [`useReducer`](/reference/react/useReducer)
- Algunos métodos de componentes de clase como [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([ve la lista entera](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Si una función es pura, ejecutarla dos veces no cambia su comportamiento porque una función pura produce el mismo resultado en cada vez. De igual manera, si una función es impura (por ejemplo, si muta la data que recibe), ejecutarla dos veces tiende a ser perceptible (¡eso es lo que la hace impura!) Esto te ayuda a detectar y corregir el error antes.

**Aquí hay un ejemplo para ilustrar como el renderizado doble en Strict Mode te ayuda a encontrar errores antes.**

Este componente `StoryTray` toma un array de `stories` y añade un último artículo "Create Story" al final:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Hay un error en el código arriba. De igual manera, es fácil de saltar porque la salida inicial aparece correcto.

Este error va a convertirse más perceptible si el componente `StoryTray` vuelve a renderizar multiples veces. Por ejemplo, hagamos que `StoryTray` vuelva a renderizar con un diferente color de fondo en cualquier momento que tu ratón flote encima del componente:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Date cuenta como cada momento que tu ratón flota encima del componente `StoryTray`, "Create Story" se añade a la lista de nuevo. La intención del código fue añadirla una vez al final. Pero `StoryTray`, directamente modifica el array `stories` de las props. Cada momento que `StoryTray` renderiza, se añade a "Create Story" de nuevo al final del mismo array. En otras palabras, `StoryTray` no es una función pura, ejecutándola múltiples veces produce diferente resultados.

Para arreglar este problema, tú puedes hacer una copia del array y modificar la copia en vez de la original:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

Esto [haría la función `StoryTray` pura.](/learn/keeping-components-pure) Cada vez que es llamada, solo modificaría una nueva copia del array y no afectaría cualquier objeto o variable externo. Esto soluciona el error, pero tuviste que hacer que el componente se vuelva a renderizar más a menudo antes que se convirtiera obvio que algo está mal con su comportamiento.

**En el ejemplo original, el bug no fue obvio. Ahora vamos a envolver el original código (con errores) en `<StrictMode>`**

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode *siempre* llama tu función renderizada dos veces, entonces puedes ver el error de inmediato** ("Create Story", aparece dos veces). Esto te notifica semejantes errores al principio en el proceso. Cuando corriges el componente para renderizar en Strict Mode, tu *también* corriges futuros posibles errores en producción como la funcionalidad **hover**(flotar) de antes:

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Sin Strict Mode, era fácil saltarse el error hasta que tu agregaste mas renderizaciones. Strict Mode hizo aparecer el mismo error de inmediato. Strict Mode te ayuda a encontrar errores antes de subirlos a tu equipo y a tu usuarios.

[Lee más sobre mantener componentes puros.](learn/keeping-components-pure)

<Note>

Si tienes [React DevTools](/learn/react-developer-tools) instalado, cualquier llamada a `console.log` durante la segunda llamada al renderizado va a aparecer levemente atenuado. React DevTools también ofrece una configuración (apagada por defecto) para suprimirlas completamente.

</Note>

---

### Arreglando errores encontrados por volver a ejecutar Effects en desarrollo {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode puede también ayudar a encontrar bugs en [Effects.](/learn/synchronizing-with-effects)

Cada Effect tiene algún código configurado y podría tener algún código de limpieza. Normalmente, React llama la configuración cuando el componente *mounts* (se añadió a la pantalla) y llama la limpieza cuando el componente *unmounts* (se removio de la pantalla). React entonces llama la limpieza y configuración de nuevo si sus dependencias cambiaron desde el último renderizado.


Cuando Strict Mode está prendida, React va también ejecutar **Un ciclo extra de configuración+limpieza en desarrollo por cada Effect.** Esto podría ser sorpresivo, pero esto ayuda a revelar errores sutiles que son difíciles de detectar manualmente.

**Aquí tienes un ejemplo para ilustrarte como volver a renderizar Effects en Strict Mode ayuda a encontrar errores al principio.**

Considera este ejemplo que conecta un componente a un chat:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Hay un problema con este código pero no podría ser limpiado inmediatamente.

Para hacer este problema más obvio, implementemos una característica. En el siguiente ejemplo, `roomId` no está hard-codeado. En vez, el usuario puede seleccionar el `roomId` que quiere conectarse desde un dropdown. Cliquea "Open chat" y entonces selecciona diferente salas de chat uno por uno. Mantén el rastreo del número de conexiones activas en la consola:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Vas a darte cuenta de que el número de conexiones abiertas siempre se mantiene creciendo. En una aplicación real, esto causaría problemas de rendimiento y de red. El problema es que [tu Effect esta falta de una función de limpieza:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Ahora que tu Effect “limpia” después de sí mismo y destruye las conexiones obsoletas, la fuga está resuelta. Sin embargo, date cuenta de que el problema no se convirtió visible hasta que se había añadido más características (la caja seleccionada.)


**En el ejemplo original, el error no era obvio. Ahora envolvamos el código original (buggy) en `<StrictMode>`:**

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Con Strict Mode, ves inmediatamente que hay un problema** (el número de conexiones activas salta a dos[2]). Strict Mode ejecuta un ciclo extra configuración+limpieza por cada Effect. Este Effect no tiene lógica de limpieza, entonces él crea una conexión extra, pero no la destruye. Esto es una pista que te falta una función de limpieza.

Strict Mode te permite notar semejantes errores al principio del proceso. Cuando tú corriges tu Effect al añadir una función de limpieza en Strict Mode, tu *también* corriges varios posibles futuros errores en producción como la selección de caja anterior:

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Date cuenta de como la cuenta de conexiones activas en la consola no se mantiene creciendo mucho más.

Sin Strict Mode, es fácil pasar por alto que tu Effect necesita limpieza. Al ejecutar *configuración → limpieza → configuración* en vez de *configuración* por tu Effect en desarrollo, El Strict Mode hizo que la lógica de limpieza faltante fuera más notable.

[Lee más sobre la implementación de la limpieza de Effect.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Arreglando advertencias obsoletas permitidas por Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React advierte si algún componente en cualquier lugar dentro de un árbol `<StrictMode>` usa una de estas APIs obsoletas: 

* [`findDOMNode`](/reference/react-dom/findDOMNode). [Ver alternativas.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* `UNSAFE_` ciclo de vida de métodos de clase como [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Ver alternativas.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* Herencia context ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), y [`getChildContext`](/reference/react/Component#getchildcontext)). [Ver alternativas.](/reference/react/createContext)
* Herencia de strings refs ([`this.refs`](/reference/react/Component#refs)). [Ver alternativas.](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

Estas APIs son primordialmente usadas en viejos [componentes de clase](/reference/react/Component) entonces raramente aparecen en aplicaciones modernas.
