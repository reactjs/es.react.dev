---
title: <StrictMode>
---


<Intro>

`<StrictMode>` te permite encontrar errores comunes en los componentes al comienzo del desarrollo.


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

Usa `StrictMode` para habilitar comportamientos de compilación y advertencias adicionales (Modo Estricto) dentro del árbol de componentes que se encuentra dentro:

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

[Ver más ejemplos abajo.](#usage)

El Modo Estricto habilita los siguientes comportamientos solo en desarrollo:

- Tus componentes se [volverán a renderizar una vez más](#fixing-bugs-found-by-double-rendering-in-development) para encontrar errores causados por renderizaciones impuras.
- Tus componentes [volverán a ejecutar los Efectos una vez más](#fixing-bugs-found-by-re-running-effects-in-development) para encontrar errores causados por la ausencia de la fase de limpieza de estos.
- Se comprobará el uso en tus componentes de [APIs obsoletas.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode`, no acepta props.

#### Advertencias {/*caveats*/}

* No hay forma de excluirse del Modo Estricto dentro de un árbol envuelto en `<StrictMode>`. Esto te asegura de que se comprueban todos los componentes dentro de `<StrictMode>`. Si dos equipos que trabajan en un producto no están de acuerdo sobre si le resultan valiosas estas comprobaciones, necesitarían o bien llegar a un consenso o bien mover `<StrictMode>` abajo en el árbol.

---

## Uso {/*usage*/}

### Habilitar el Modo Estricto para toda la aplicación {/*enabling-strict-mode-for-entire-app*/}

El Modo Estricto, habilita chequeos adicionales solo en desarrollo para el todo el árbol de componentes dentro del componente `<StrictMode>`. Estos chequeos ayudan a encontrar errores comunes en tus componentes al principio del proceso de desarrollo.


Para habilitar el Modo Estricto en toda tu aplicación, envuelve tu componente raíz con `<StrictMode>` cuando lo renderices:

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

Nuestra recomendación es que envuelvas toda tu aplicación en Modo Estricto, especialmente para aplicaciones recientemente creadas. Si usas un framework que hace la llamada a [`createRoot`](/reference/react-dom/client/createRoot) por ti, comprueba su documentación para saber como habilitar el Modo Estricto.

A pesar de que las comprobaciones del Modo Estricta **solo se ejecutan en desarrollo,** te ayudan a encontrar errores que ya existen en tu código, pero que puede ser difícil reproducirlos de forma confiable en producción. El Modo Estricto te permite corregir errores antes que tus usuarios los reporten.

<Note>

El Modo Estricto habilita los siguientes chequeos en desarrollo:

- Tus componentes se [renderizarán una vez más](#fixing-bugs-found-by-double-rendering-in-development) para encontrar errores causados por renderizaciones impuras.
- Tus componentes [ejecutarán los Efectos una vez más](#fixing-bugs-found-by-re-running-effects-in-development) para encontrar errores causados por la ausencia de la fase de limpieza de estos.
- Se comprobará el uso en tus componentes de [APIs obsoletas.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Todos estos chequeos es hacen solo en desarrollo y no afectan la compilación de producción.**

</Note>

---

### Habilitar el Modo Estricto para una parte de la aplicación {/*enabling-strict-mode-for-a-part-of-the-app*/}

También puedes habilitar el Modo Estricto para cualquier parte de tu aplicación:

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

En este ejemplo, el chequeo de Strict Mode no se ejecutarán en los componentes `Header` y `Footer`. Sin embargo, sí se ejecutarán en `Sidebar` y `Content` al igual que todos los componentes dentro de estos, sin importar la profundidad.

---

### Solución de errores encontrados por renderizado doble en desarrollo {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React asume que cada componente que escribes es una función pura.](/learn/keeping-components-pure) Esto significa que los componentes de React que escribes deben siempre devolver el mismo JSX dadas las mismas entradas (props, estado y contexto).

Los componentes que rompen esta regla se comportan impredeciblemente y causan errores. Para ayudarte a encontrar código impuro accidental, el Modo Estricto llama algunas de tus funciones (solo las que deberían ser puras) **dos veces en desarrollo.** Esto incluye:

- El cuerpo de la función de tu componente (solo lógica de nivel superior, por lo que esto no incluye el código dentro de los manejadores de eventos)
- Funciones que pasas a [`useState`](/reference/react/useState), [funciones `set`](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), o [`useReducer`](/reference/react/useReducer)
- Algunos métodos de los componentes de clase como [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([ve la lista entera](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Si una función es pura, ejecutarla dos veces no cambia su comportamiento porque una función pura produce el mismo resultado cada vez. Sin embargo, si una función es impura (por ejemplo, si muta los datos que recibe), ejecutarla dos veces tiende a ser perceptible (¡eso es lo que la hace impura!) Esto te ayuda a detectar y corregir el error antes.

**Aquí hay un ejemplo para ilustrar como el renderizado doble en el Modo Estricto te ayuda a encontrar errores antes.**

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

Hay un error en el código arriba. Sin embargo, puede pasar desapercibido con facilidad porque la salida inicial parece correcta.

Este error será más perceptible si el componente `StoryTray` se vuelve a renderizar múltiples veces. Por ejemplo, hagamos que `StoryTray` se vuelva a renderizar con un diferente color de fondo cada vez que el puntero pase sobre el componente:

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

Date cuenta como cada momento que el puntero pasa por encima del componente `StoryTray`, "Create Story" se añade a la lista nuevamente. La intención del código fue añadirla una vez al final. Pero `StoryTray`, directamente modifica el array `stories` de las props. Cada momento que `StoryTray` se renderiza, añade "Create Story" de nuevo al final del mismo array. En otras palabras, `StoryTray` no es una función pura, ejecutándola múltiples veces produce diferente resultados.

Para arreglar este problema, puedes hacer una copia del array y modificar la copia en vez de la original:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

Esto [haría la función `StoryTray` pura.](/learn/keeping-components-pure) Cada vez que es llamada, solo modificaría una nueva copia del array y no afectaría cualquier objeto o variable externo. Esto soluciona el error, pero tuviste que hacer que el componente se vuelva a renderizar más a menudo antes que se convirtiera obvio que algo está mal con su comportamiento.

**En el ejemplo original, el error no fue obvio. Ahora vamos a envolver el código original (con errores) en `<StrictMode>`**

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

**El Modo Estricto *siempre* llama a tu función de renderizado dos veces, por lo que puedes ver el error de inmediato** ("Create Story", aparece dos veces). Esto permite darte cuenta de este tipo de errores al principio en el proceso. Cuando corriges el componente para renderizarse en Modo Estricto, *también* corriges futuros posibles errores en producción como la funcionalidad **hover** (pasar por encima el puntero) de antes:

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

Sin Modo Estricto, era fácil saltarse el error hasta que agregaste más rerenderizados. El Modo Estricto hizo aparecer el mismo error de inmediato. El Modo Estricto te ayuda a encontrar errores antes de que se los subas a tu equipo y a tus usuarios.

[Lee más sobre mantener componentes puros.](learn/keeping-components-pure)

<Note>

Si tienes instaladas [las Herramientas de Desarrollo de React](/learn/react-developer-tools), cualquier llamada a `console.log` durante la segunda llamada al renderizado va a aparecer levemente atenuada. Las Herramientas de Desarrollo de React también ofrecen una configuración (desactivada por defecto) para suprimirlas completamente.

</Note>

---

### Arreglar errores detectados al volver ejecutar Efectos en desarrollo {/*fixing-bugs-found-by-re-running-effects-in-development*/}

El Modo Estricto puede también ayudar a encontrar errores en los [Efectos.](/learn/synchronizing-with-effects)

Cada Efecto tiene algún código de configuración y podría tener algún código de limpieza. Normalmente, React llama al código de configuración cuando el componente *se monta* (se añadió a la pantalla) y llama a la limpieza cuando el componente *se desmonta* (se eliminó de la pantalla). React entonces llama a la limpieza y configuración de nuevo si sus dependencias cambiaron desde el último renderizado.

Cuando Strict Mode está activo, React también ejecutará **un ciclo extra de configuración+limpieza en desarrollo por cada Efecto.** Esto podría sorprender, pero ayuda a revelar errores sutiles que son difíciles de detectar manualmente.

**Aquí tienes un ejemplo para ilustrarte cómo volver a renderizar Efectos en Modo Estricto ayuda a encontrar errores al principio.**

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

Hay un problema con este código pero podría no quedar claro inmediatamente.

Para hacer este problema más obvio, implementemos una funcionalidad. En el siguiente ejemplo, `roomId` no está codificado de forma fija. En cambio, el usuario puede seleccionar el `roomId` al que quiere conectarse desde un dropdown. Haz clic en "Open chat" y luego selecciona diferentes salas de chat una por una. Mantén la cuenta del número de conexiones activas en la consola:

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

Vas a darte cuenta de que el número de conexiones abiertas siempre se mantiene creciendo. En una aplicación real, esto causaría problemas de rendimiento y de red. El problema es que a [tu Efecto le falta una función de limpieza:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Ahora que tu Efecto “hace una limpieza” al concluir y destruye las conexiones obsoletas, la fuga está resuelta. Sin embargo, date cuenta de que el problema no se hizo visible hasta que añadiste más funcionaliades (el cuadro de selección).

**En el ejemplo original, el error no era obvio. Ahora envolvamos el código original (con errores) en `<StrictMode>`:**

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

**Con Modo Estricto, ves inmediatamente que hay un problema** (el número de conexiones activas salta a 2). El Modo Estricto ejecuta un ciclo extra de configuración+limpieza por cada Efecto. Este Efecto no tiene lógica de limpieza, por lo que crea una conexión extra, pero no la destruye. Esto es una pista de que te falta una función de limpieza.

El Modo Estricto te permite notar este tipo de errores al principio del proceso. Cuando corriges tu Efecto al añadir una función de limpieza en Modo Estricto, *también* corriges varios posibles futuros errores en producción como el cuadro de selección anterior:

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

Date cuenta de como la cuenta de conexiones activas en la consola ya no sigue creciendo.

Sin Modo Estricto, es fácil pasar por alto que tu Efecto necesita limpieza. Al ejecutar *configuración → limpieza → configuración* en vez de *configuración* para tu Efecto en desarrollo, el Modo Estricto hizo que la lógica de limpieza faltante fuera más notable.

[Lee más sobre la implementación de la limpieza de los Efectos.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Arreglar advertencias de código obsoleto habilitadas en el Modo Estricto {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React advierte si algún componente en cualquier lugar dentro de un árbol `<StrictMode>` usa una de estas APIs obsoletas: 

* [`findDOMNode`](/reference/react-dom/findDOMNode). [Ver alternativas.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* Métodos de ciclo de vida `UNSAFE_` como [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Ver alternativas.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* API antigua de contexto ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), y [`getChildContext`](/reference/react/Component#getchildcontext)). [Ver alternativas.](/reference/react/createContext)
* Antiguas refs de strings ([`this.refs`](/reference/react/Component#refs)). [Ver alternativas.](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

Estas APIs son usadas principalmente en los [componentes de clase](/reference/react/Component) más antiguos, por lo que no es común que aparezcan en aplicaciones modernas.
