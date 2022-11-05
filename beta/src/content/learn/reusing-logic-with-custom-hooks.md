---
title: 'Reutilizar la lógica del código con Custom Hooks'
---

<Intro>

React viene con varios Hooks integrados como `useState`, `useContext` y `useEffect`. A veces, desearás que haya un Hook para algún propósito más específico: por ejemplo, para obtener datos, para mantener un seguimiento de si un usuario está conectado o para conectarse a una sala de chat. Es posible que no encuentres estos Hooks en React, pero puedes crear tus propios Hooks para las necesidades de tu aplicación.

</Intro>

<YouWillLearn>

- Qué son los Custom Hooks y cómo escribirlos por tu cuenta
- Cómo reutilizar la lógica del código entre componentes
- Cómo nombrar y estructurar tus Custom Hooks
- Cuándo y por qué extraer Custom Hooks

</YouWillLearn>

## Custom Hooks: compartir la lógica del código entre componentes {/*custom-hooks-sharing-logic-between-components*/}

Imagine que está desarrollando una aplicación que depende en gran medida de la red (como la mayoría de aplicaciones). Quieres informar al usuario si su conexión de red se interrumpió accidentalmente mientras usaban su aplicación. ¿Cómo lo harías?

Parece que necesitarás dos cosas en tu componente:

1. Una parte del estado que rastree si la red está en línea.
2. Un efecto que se suscriba a los eventos globales: [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) y [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event), y actualizar ese estado.

Esto mantendrá su componente [sincronizado](/learn/synchronizing-with-effects) con el estatus de la red. Podrías empezar con algo como esto:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ En línea' : '❌ Desconectado'}</h1>;
}
```

</Sandpack>

Intente encender y apagar su red y observe cómo se actualiza `StatusBar` en respuesta a tus acciones.

Ahora imagina que *también* quieres usar la misma lógica del código en un componente diferente. Quieres implementar un botón Guardar que se desactivará y mostrará "Reconectando ..." en lugar de "Guardar" mientras la red está apagada.

Para empezar, puedes copiar y pegar el estado `isOnline` y el efecto en `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progreso guardado');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Guardar progreso' : 'Reconectando...'}
    </button>
  );
}
```

</Sandpack>

Comprueba que, si apagas la red, el botón cambiará su apariencia.

Estos dos componentes funcionan bien, pero la duplicación de la lógica del código entre estos es desafortunada. Parece que a pesar de que tienen una *apariencia visual* diferente, quieres reutilizar la lógica entre estos.

### Extraer tu propio Custom Hook de un componente {/*extracting-your-own-custom-hook-from-a-component*/}

Imagine por un momento que, similar a [`useState`](/apis/react/useState) y [`useEffect`](/apis/react/useEffect), hay un Hook integrado denominado `useOnlineStatus`. Entonces, ambos componentes podrían simplificarse y podrías eliminar la duplicación entre estos:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progreso guardado');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Guardar progreso' : 'Reconectando...'}
    </button>
  );
}
```

Aunque no exista un Hook integrado, puedes escribirlo por tu cuenta. Declara una función llamada `useOnlineStatus` y mueve todo el código duplicado dentro, desde los componentes que escribiste anteriormente:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

En el final de la función, retorna `isOnline`. Esto permite a tus componentes leer ese valor:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progreso guardado');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Guardar progreso' : 'Reconectando...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Verifica que al encender y apagar la red se actualicen ambos componentes.

Ahora tus componentes no tienen tanta lógica repetitiva. **Más importante aún, el código dentro de estos describe *qué quieren hacer* (¡usar el estatus de conectado!) en lugar de *cómo hacerlo* (suscribirse a los eventos del navegador).**

Cuando extraes la lógica del código en un Custom Hook, puedes ocultar los detalles retorcidos de cómo tratas con algún sistema externo o una API del navegador. El código de tus componentes expresan tu intención, no la implementación.

### Los nombres de Hooks siempre empiezan con `use` {/*hook-names-always-start-with-use*/}

Las aplicaciones de React están construidas por componentes. Los componentes son construidos a partir de Hooks, ya sean integrados o personalizados. Es probable que a menudo uses Custom Hooks creados por alguien más, pero ocasionalmente, ¡podrías escribir uno!

Debes seguir estas convenciones de nomenclatura:

1. **Los nombres de componentes de React deben empezar con mayúscula,** como `StatusBar` y `SaveButton`. Los componentes de React también necesitan retornar algo que React conozca cómo mostrar, como un bloque de JSX
2. **Los nombres de Hooks deben empezar con `use` seguido por una mayúscula,** como [`useState`](/apis/react/useState) (integrado) o `useOnlineStatus` (personalizado, como antes en la página). Los Hooks pueden retornar valores arbitrarios.

Esta convención garantiza que siempre puedas mirar un componente y saber dónde pueden "esconder" su estado, efectos, y otras características de React. Por ejemplo, si ves una invocación de función denominada `getColor()` en tu componente, puedes estar seguro de que no contiene un estado de React, porque su nombre no empieza con `use`. Sin embargo, una invocación de función como `useOnlineStatus()`, probablemente contendrá otros Hooks.

<Note>

Si tu linter está [configurado para React,](/learn/editor-setup#linting) hará cumplir esta convención de nomenclatura. Desplázate hasta el sandbox de arriba y cambia el nombre de `useOnlineStatus` a `getOnlineStatus`. Ten en cuenta que el linter ya no permitirá utilizar `useState` o `useEffect` dentro de este nunca más. ¡Únicamente los componentes y Hooks pueden llamar a otros Hooks!

</Note>

<DeepDive title="Todas las funciones llamadas durante el renderizado deben comenzar con el prefijo use">

No. Las funciones que no *utilizan* Hooks no necesitan *ser* Hooks.

Si tu función no utiliza ningún Hook, evite el prefijo `use`. En su lugar, escríbalo como una función normal *sin* el prefijo `use`. Por ejemplo, a continuación `useSorted` no utiliza Hooks, entonces llámalo como `getSorted`:

```js
// 🔴 Evita: Un Hook que no usa Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Correcto: Una función normal que no usa Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

Esto asegura que tu código puede invocar esta función en cualquier lugar, incluyendo condicionales:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ Está bien llamar getSorted() condicionalmente porque no es un Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

Deberías colocar el prefijo `use` a una función (y por lo tanto convertirla en un Hook) si usas al menos un Hook dentro de esta:

```js
// ✅ Correcto: Un Hook que usa otros Hooks
function useAuth() {
  return useContext(Auth);
}
```

Técnicamente, esto no es aplicado por React. En principio, puedes hacer un Hook que no utilice otros Hooks. Esto suele ser confuso y limitante, por lo que es mejor evitar ese patrón. Sin embargo, puedes hacer casos raros donde sea útil. Por ejemplo, quizás tu función no utilice ningún Hook en este momento, pero planeas añadir algunos Hooks en el futuro. Entonces, tiene sentido nombrarlo con prefijo `use`.

```js {3-4}
// ✅ Correcto: Un Hook que probablemente contendrá otros Hooks después
function useAuth() {
  // Para hacer: Reemplazar con esta línea cuando la autenticación esté implementada:
  // return useContext(Auth);
  return TEST_USER;
}
```

Entonces los componentes no serán capaces de utilizarlo condicionalmente. Esto se volverá importante cuando realmente agregues Hooks dentro. Si no planeas utilizar Hooks dentro (ahora o más tarde), no lo conviertas en un Hook.

</DeepDive>

### Los Custom Hooks permiten compartir la lógica con estado, no el estado en sí mismo {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

En el ejemplo anterior, cuando encendía y apagaba la red, ambos componentes se actualizaban juntos. Sin embargo, es erróneo pensar que una única variable de estado `isOnline` es compartida entre ellos. Mira en este código:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Funciona de la misma manera que antes de extraer la duplicación:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```
¡Estas son dos variables de estado y efectos completamente independientes! Solo tuvieron el mismo valor al mismo tiempo, porque los sincronizó con el mismo valor externo (si la red está encendida)

Para ilustrar mejor esto, necesitaremos un ejemplo diferente. Considere este componente `Form`:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        Nombre:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Apellido:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Buenos días, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Existe cierta lógica repetitiva para cada campo del formulario:

1. Hay un pedazo de estado (`firstName` y `lastName`).
2. Hay una función controladora de cambios (`handleFirstNameChange` y `handleLastNameChange`).
3. Hay un bloque de JSX que especifica los atributos `value` y `onChange` para las etiquetas input.

Puedes extraer la lógica repetitiva dentro del Custom Hook `useFormInput`:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        Nombre:
        <input {...firstNameProps} />
      </label>
      <label>
        Apellido:
        <input {...lastNameProps} />
      </label>
      <p><b>Buenos días, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Ten en cuenta que solo se declara *una* variable de estado denominada `value`.

Sin embargo, el componente `Form` invoca a `useFormInput` *dos veces*:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

!Es por eso que funciona como declarar dos variables de estado separadas!

**Los Custom Hooks permiten compartir la *lógica con estado* pero no *el estado en sí.* Cada invocación al Hook es completamente independiente de cualquier otra invocación al mismo Hook.** Es por eso que los dos sandboxes anteriores son completamente equivalentes. Si lo desea, desplácese hacia atrás y compárelos. El comportamiento antes y después de extraer un Custom Hook es idéntico.

Cuando necesites compartir el estado en sí entre múltiples componentes, [levántalo y pásalo hacia abajo](/learn/sharing-state-between-components).

## Pasando valores reactivos entre Hooks {/*passing-reactive-values-between-hooks*/}

El código dentro de los Custom Hooks se volverá a ejecutar durante cada nueva renderización de tu componente. Por eso, como los componentes, los Custom Hooks [deben ser puros.](/learn/keeping-components-pure) ¡Piense en el código de los Custom Hooks como parte del cuerpo de tu componente!

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Elije la sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="viajes">viajes</option>
          <option value="música">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('Nuevo mensaje: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        URL del servidor:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>¡Te doy la bienvenida a la sala {roomId}!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Una implementación real en realidad se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Se esperaba que serverUrl fuera un string: Recibió: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Se esperaba que el roomId fuera un string. Recibió: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando a la sala "' + roomId + '" en ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hola')
          } else {
            messageCallback('xD');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectado de la sala "' + roomId + '" en ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('No se puede agregar la función controladora dos veces.');
      }
      if (event !== 'message') {
        throw Error('Solo se admite el evento "message".');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Cuando cambias `serverUrl` o `roomId`, el efecto ["reacciona" a tus cambios](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) y se vuelve a sincronizar. Puedes saber por los mensajes de la consola que el chat se vuelve a conectar cada vez que cambian las dependencias del efecto.

Ahora mueve el código del efecto dentro de un Custom Hook:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nuevo mensaje: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Esto permite al componente `ChatRoom` invocar tus Custom Hook sin preocuparse por cómo funciona internamente:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL del servidor:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>¡Te doy la bienvenida a la sala {roomId}!</h1>
    </>
  );
}
```

¡Esto parece mucho más simple! (Pero hace lo mismo).

Observa que la lógica *sigue respondiendo* a los cambios del prop y estado. Intenta editar la URL o la sala seleccionada:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="viaje">viaje</option>
          <option value="música">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL del servidor:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>¡Te doy la bienvenida a la sala {roomId}!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nuevo mensaje: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Una implementación real en realidad se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Se esperaba que serverUrl fuera un string. Recibió: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Se esperaba que roomId fuera un string. Recibió: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando a la sala "' + roomId + '" en ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hola')
          } else {
            messageCallback('xD');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectado de la sala "' + roomId + '" en ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('No se puede agregar la función controladora dos veces.');
      }
      if (event !== 'message') {
        throw Error('Solo se admite el evento "message".');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Observe cómo está tomando el valor de retorno de un Hook:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

y pasarlo como entrada a otro Hook:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Cada vez que tu componente `ChatRoom` se vuelve a renderizar, pasa el último `roomId` y `serverUrl` a tu Hook. Esta es la razón por la que tu efecto se vuelve a conectar al chat cada vez que sus valores son diferentes después de volver a renderizarse. (Si alguna vez trabajaste con un software de procesamiento de música, encadenar Hooks como este puede recordarte encadenar múltiples efectos de audio, como agregar reverberación o coro. Es como si la salida de `useState` "alimentara" la entrada de `useChatRoom`).

### Pasar controladores de eventos a los Custom Hooks {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

Esta sección describe una **API experimental que aún no se ha agregado a React,** por lo que aún no puedes usarla.

</Wip>

A medida que comience a usar `useChatRoom` en más componentes, es posible que desees permitir diferentes componentes que personalicen su comportamiento. Por ejemplo, actualmente, la lógica de qué hacer cuando llega un mensaje está escrita dentro del Hook:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nuevo mensaje: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Digamos que deseas mover esta lógica de regreso a tu componente:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Nuevo mensaje: ' + msg);
    }
  });
  // ...
```

Para hacer que esto funcione, cambia tu Hook para tomar `onReceiveMessage` como una de sus opciones nombradas:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ Todas las dependencias declaradas
}
```

Esto funcionará, pero hay una mejora que puedes hacer cuando tu Custom Hook acepta controladores de eventos.

Agregar una dependencia en `onReceiveMessage` no es ideal, porque causará que el chat se vuelva a conectar cada vez que el componente se vuelva a renderizar. [Envuelva este controlador en una función de evento para eliminarlo de las dependencias:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Todas las dependencias declaradas
}
```

Ahora el chat no se volverá a conectar cada vez que el componente `ChatRoom` se vuelva a renderizar. Aquí hay una demostración completamente funcional de pasar un controlador de eventos a un Custom Hook con el que puedes manipular:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Elije la sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="viaje">viaje</option>
          <option value="música">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Nuevo mensaje: ' + msg);
    }
  });

  return (
    <>
      <label>
        URL del servidor:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>¡Te doy la bienvenida a la sala {roomId}!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEvent as useEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Una implementación real en realidad se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Se esperaba que serverUrl fuera un string. Recibió: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Se esperaba que roomId fuera un string. Recibió: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando a la sala "' + roomId + '" en ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hola')
          } else {
            messageCallback('xD');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectado de la sala "' + roomId + '" en ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('No se puede agregar la función controladora dos veces.');
      }
      if (event !== 'message') {
        throw Error('Solo se admite el evento "message".');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Observe cómo ya no necesita saber *cómo* `useChatRoom` funciona para usarlo. Podrías agregarlo a cualquier otro componente, pasar cualquier otra opción y funcionará de la misma manera. Ese es el poder de los Custom Hooks.

## Cuándo usar Custom Hooks {/*when-to-use-custom-hooks*/}

No necesitas extraer un Custom Hook por cada pequeño fragmento duplicado de tu código. Cierta duplicación está bien. Por ejemplo, probablemente no sea necesario extraer un Hook `useFormInput` para envolver una sola invocación de `useState` como antes.

Sin embargo, cada vez que escriba un efecto, considere si sería más claro envolverlo también en un Custom Hook. [No deberías necesitar efectos con mucha frecuencia,](/learn/you-might-not-need-an-effect) por lo que si estás escribiendo uno, significa que necesitas "salir de React" para sincronizar con algún sistema externo o hacer algo para lo que React no tiene API integrada. Envolver tu efecto en un Custom Hook permite comunicar con precisión su intención y cómo fluyen los datos a través de este.

Por ejemplo, considere un componente `ShippingForm` que muestre dos menús desplegables: uno muestra la lista de ciudades y otro muestra la lista de áreas en la ciudad seleccionada. Puedes comenzar con un código que se vea así:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // Este efecto recupera las ciudades de un país
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // Este efecto recupera las áreas para una ciudad seleccionada
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Aunque este código es bastante repetitivo, [es correcto mantener estos efectos separados unos de otros.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Estos sincronizan dos cosas diferentes, por lo que no debes fusionarlos en un solo efecto. En su lugar, puedes simplificar el componente anterior `ShippingForm`, para extraer la lógica en común entre estos en tu propio Hook `useData`:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Ahora puedes reemplazar ambos efectos en los componentes `ShippingForm` con invocaciones a `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Extraer un Custom Hook hace que el flujo de datos sea explícito. Alimenta la entrada `url` y obtiene la salida `data`. Al "ocultar" tu efecto dentro de `useData`, también puedes evitar que alguien trabaje en el componente `ShippingForm` y agregue [dependencias innecesarias](/learn/removing-effect-dependencies). Idealmente, con el tiempo, la mayoría de los efectos de su aplicación estarán en Custom Hooks.

<DeepDive title="Conserva tus Custom Hooks enfocados en casos de uso concretos de alto nivel">

Comienza por elegir el nombre de tu Custom Hook. Si tiene dificultades para elegir un nombre claro, puede significar que su efecto está demasiado acoplado al resto de la lógica de tu componente y aún no está listo para ser extraído.

Idealmente, el nombre de tu Custom Hook debe ser lo suficientemente claro como para que incluso una persona que no escribe código con frecuencia, pueda tener una buena idea sobre lo que hace tu Custom 

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Cuando sincronizas con un sistema externo, el nombre de tu Custom Hook puede ser más técnico y usar un lenguaje específico para ese sistema. Es bueno siempre que sea claro para una persona familiarizada con ese sistema:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Conserva tus Custom Hooks enfocados en casos de uso específico de alto nivel.** Evita crear y usar Custom Hooks de "ciclo de vida" que actúen como alternativas y envoltorios convenientes para la propia API `useEffect`.

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Por ejemplo, este Hook `useMount` intenta garantizar que parte del código solo se ejecute "en el montaje" del componente:

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  // 🔴 Evita: usar Custom Hooks de "ciclo de vida"
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Evita: usar Custom Hooks de "ciclo de vida"
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 El Hook useEffect de React tiene una dependencia faltante: 'fn'
}
```

**Los Custom Hooks de "ciclo de vida" como `useMount` no encajan bien en el paradigma de React.** Por ejemplo, este código de ejemplo tiene un error (no "reacciona" a los cambios de `roomId` o `serverUrl`), pero el linter no te avisará porque el linter solamente verifica las invocaciones directas del `useEffect`. No sabrá acerca de tu Hook.

Si estás escribiendo un efecto, comienza por usar la API de React directamente:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Correcto: dos efectos sin procesar separados por propósito

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Luego, puedes (pero no tienes que hacerlo) extraer Custom Hooks para diferentes casos de uso de alto nivel:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');


  // ✅ Genial: Custom Hooks con el nombre de su propósito
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Un buen Custom Hook hace que el código de invocación sea más declarativo al restringir lo que hace.** Por ejemplo, `useChatRoom(options)` solo puede conectarse a la sala de chat, mientras `useImpressionLog(eventName, extraData)` solo puede enviar un registro de impresión a las analíticas. Si la API de tu Custom Hook no restringe los casos de uso y es muy abstracta, a la larga es probable que presente más problemas de los que resuelve.

</DeepDive>

### Los Custom Hooks te ayudan a migrar a mejores patrones {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Los efectos son un ["escotilla de escape"](/learn/escape-hatches): los usas cuando necesitas "salir de React" y cuando no hay mejor solución integrada para su caso de uso. Con el tiempo, el objetivo del equipo de React es reducir al mínimo la cantidad de efectos en tu aplicación al proporcionar soluciones más específicas para problemas más específicos. Envolver los efectos en Custom Hooks facilita actualizar tu código cuando estas soluciones estén disponibles. Volvamos a este ejemplo:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progreso guardado');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Guardar progreso' : 'Reconectando...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

En el ejemplo anterior, `useOnlineStatus` es implementado con un par de [`useState`](/apis/react/useState) y [`useEffect`.](/apis/react/useEffect) Sin embargo, esta no es la mejor solución posible. Hay una serie de casos extremos que no considera. Por ejemplo, asume que cuando el componente es montado, `isOnline` ya es `true`, pero esto puede ser incorrecto si la red ya se desconectó. Puede usar la API del navegador [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) para verificar eso, pero usarla directamente se rompería si ejecutas tu aplicación de React en un servidor para generar el HTML inicial. En resumen, este código podría mejorarse.

Afortunadamente, React 18 incluye una API llamada [`useSyncExternalStore`](/apis/react/useSyncExternalStore) que se encarga de todos estos problemas por ti. Así es como funciona tu Hook `useOnlineStatus`, reescrito para aprovechar esta nueva API:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progreso guardado');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Guardar progreso' : 'Reconectando...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // Cómo obtener el valor en el cliente
    () => true // Cómo obtener el valor en el servidor
  );
}

```

</Sandpack>

Observa cómo *no necesitabas cambiar ninguno de los componentes* para realizar esta migración:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Esta es otra razón por la que envolver efectos en Custom Hook suele ser beneficioso:

1. Haces que el flujo de datos hacia y desde tus efectos sea muy explícito.
2. Permites que tus componentes se centren en la intención en lugar de la implementación exacta de tus efectos.
3. Cuando React agrega nuevas funciones, puedes eliminar esos efectos sin cambiar ninguno de tus componentes.

De manera similar a un [sistema de diseño,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) podrías resultarte útil comenzar a extraer modismos comunes de los componentes de tu aplicación en Custom Hooks. Esto mantendría el código de tus componentes enfocado en la intención y le permitirá evitar escribir efectos sin procesar muy a menudo. También hay muchos Custom Hooks excelentes mantenidos por la comunidad de React.

<DeepDive title="¿React proporcionará alguna solución integrada para la obtención de datos?">

Todavía estamos trabajando en los detalles, pero esperamos que en el futuro escribas la obtención de datos de esta menera:

```js {1,4,6}
import { use } from 'react'; // ¡No disponible aún!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Si usas Custom Hooks como el anterior `useData` en tu aplicación, este requerirá menos cambios para migrar al enfoque recomendado eventualmente que si escribes efectos sin procesar en cada componente manualmente. Sin embargo, el enfoque antiguo seguirá funcionando bien, entonces si te sientes feliz escribiendo efectos sin procesar, puedes continuar haciéndolo.

</DeepDive>

### Hay más de una forma de hacerlo {/*there-is-more-than-one-way-to-do-it*/}

Supongamos que deseas implementar una animación de aparición gradual *desde cero* usando la API del navegador [`requestAnimationFrame`](https://developer.mozilla.org/es/docs/Web/API/window/requestAnimationFrame). Podrías empezar con un efecto que configure un bucle de animación. Durante cada fotograma de la animación, podrías cambiar la opacidad del nodo del DOM que [mantienes en un ref](/learn/manipulating-the-dom-with-refs) hasta que alcance `1`. Tu código podría empezar así:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Todavía tenemos más fotogramas para pintar
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Te doy la bienvenida
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Quitar' : 'Mostrar'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Para que el componente sea más legible, podrías extraer la lógica en un Custom Hook denominado `useFadeIn`.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Te doy la bienvenida
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Quitar' : 'Mostrar'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Aún tenemos más fotogramas que pintar
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Podrías mantener el código de `useFadeIn` como está, pero también podrías refactorizarlo más. Por ejemplo, podrías extraer la lógica para configurar el bucle de animación fuera de `useFadeIn` en un nuevo Custom Hook llamado `useAnimationLoop`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Te doy la bienvenida
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Quitar' : 'Mostrar'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEvent as useEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

Sin embargo, no *tenías que* hacer eso. Al igual que con las funciones normales, en última instancia, decides dónde dibujar los límites entre las diferentes partes de tu código. Por ejemplo, también podrías adoptar un enfoque muy diferente. En lugar de mantener la lógica en el efecto, podrías mover la mayor parte de la lógica imperativa dentro de una [clase de JavaScript:](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Te doy la bienvenida
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Quitar' : 'Mostrar'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // Aún tenemos más fotogramas para pintar
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Los efectos te permiten conectar React a sistemas externos. Cuanta más coordinación se necesita entre los efectos (por ejemplo, para encadenar múltiples animaciones), más sentido tiene extraer completamente esa lógica de efectos y Hooks *completamente* como en el sandbox anterior. Luego, el código que extraes *se convierte* en el "sistema externo". Esto permite que tus efectos se mantengan simples porque solo necesitan enviar mensajes al sistema que moviste fuera de React.

Los ejemplos anteriores asumen que la lógica de aparición gradual debe escribirse en JavaScript. Sin embargo, esta particular animación de aparición gradual es más simple y eficiente de implementar con una simple [animación CSS:](https://developer.mozilla.org/es/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Te doy la bienvenida
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Quitar' : 'Mostrar'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

A veces, ¡ni si quiera necesitas un Hook!

<Recap>

- Los Custom Hooks te permiten compartir lógica entre componentes.
- Los Custom Hooks deben nombrarse comenzando con `use`, seguido por una letra mayúscula.
- Los Custom Hooks solo comparten lógica con estado, no el estado en sí.
- Puedes pasar valores reactivos de un Hook a otro, y se mantienen actualizados.
- Todos los Hooks se vuelven a ejecutar cada vez que tu componente se vuelve a renderizar.
- El código de tus Hooks debe ser puro, como el código de tu componente.
- Envuelve controladores de eventos recibidos por Custom Hooks en funciones de eventos.
- No hagas Custom Hooks como `useMount`. Conserva su propósito específico.
- Depende de ti el cómo y dónde elegir los límites de tu código.

</Recap>

<Challenges>

#### Extrae un Hook `useCounter` {/*extract-a-usecounter-hook*/}

Este componente usa una variable de estado y un efecto para mostrar un número que incrementa cada segundo. Extrae un esta lógica en un Custom Hook llamado `useCounter`. Tu objetivo es hacer que la implementación del componente `Counter` se vea exactamente así:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Segundos transcurridos: {count}</h1>;
}
```

Deberás escribir tu Custom Hook en `useCounter.js` e importarlo en el archivo `Counter.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Segundos transcurridos: {count}</h1>;
}
```

```js useCounter.js
// ¡Escribe tu Custom Hook en este archivo!
```

</Sandpack>

<Solution>

Tu código debería verse así:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Segundos transcurridos: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Observa que `App.js` no necesita importar `useState` o `useEffect` nunca más.

</Solution>

#### Haz que el retraso del contador sea configurable {/*make-the-counter-delay-configurable*/}

En este ejemplo, existe una variable de estado `delay` controlada por un deslizador, pero su valor no se usa. Pase el valor de `delay` a tu Custom Hook `useCounter` y cambia el Hook `useCounter` para usar el `delay` pasado en lugar de escribir en el código `1000` ms.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Duración de la marca: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Marcas: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Pasa el `delay` a tu Hook con `useCounter(delay)`. Luego, dentro del Hook, usa `delay` en lugar del valor escrito `1000`. Deberás agregar `delay` a las dependencias de tu efecto. Esto asegura que el cambio en `delay` restablecerá el intervalo.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Duración de la marca: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Marcas: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Extrae `useInterval` de `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Actualmente, tu Hook `useCounter` hace dos cosas. Establece un intervalo y también incrementa la variable de estado en cada marca de intervalo. Divide la lógica que establece el intervalo en un Hook separado llamado `useInterval`. Este debería recibir dos argumentos: el callback `onTick` y el `delay`. Después de este cambio, tu implementación `useCounter` debería verse así:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Escribe `useInterval` en el archivo `useInterval.js` e importarlo en el archivo `useCounter.js`.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Segundos transcurridos: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js useInterval.js
// ¡Escribe tu Hook aquí!
```

</Sandpack>

<Solution>

La lógica dentro de `useInterval` debería configurar y borrar el intervalo. No necesita hacer nada más.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Segundos transcurridos: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Ten en cuenta que hay un pequeño problema con esta solución, que resolverás en el próximo desafío.

</Solution>

#### Arregla el intervalo de reinicio {/*fix-a-resetting-interval*/}

En este ejemplo, hay *dos* intervalos separados.

El componente `App` invoca a `useCounter`, que invoca a `useInterval` para actualizar el contador cada segundo. Pero, el componente `App` *también* invoca a `useInterval` para actualizar aleatoriamente el color de fondo de la página cada dos segundos.

Por alguna razón, el callback que actualiza el fondo de la página nunca se ejecuta. Agrega algunos registros en `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Configurar un intervalo con retraso ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Borrar un intervalo con retraso ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

¿Los registros coinciden con lo que espera que suceda? Si algunos de tus efectos parecen volver a sincronizarse innecesariamente, ¿puedes adivinar qué dependencia está causando que esto suceda? ¿Hay alguna manera de [eliminar esa dependencia](/learn/removing-effect-dependencies) de tu efecto?

Después de arreglar el problema, deberías esperar que el fondo de la página se actualice cada dos segundos.

<Hint>

Parece que tu Hook `useInterval` acepta un event listener como un argumento. ¿Puedes pensar en alguna forma de envolver ese event listener para que no tenga que ser una dependencia de tu efecto?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Segundos transcurridos: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js
import { useEffect } from 'react';
import { experimental_useEvent as useEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Dentro de `useInterval`, envuelve el callback del marcador en una función de evento, como lo hizo [anteriormente en esta página.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

Esto te permitirá omitir `onTick` de las dependencias de tu efecto. El efecto no volverá a sincronizarse en cada nuevo renderizado del componente, entonces el cambio de color de fondo de la página no se restablecerá cada segundo antes de que tenga la oportunidad de activarse.

Con este cambio, ambos intervalos funcionan como se esperaba y no interfieren entre sí:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```


```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Segundos transcurridos: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';
import { experimental_useEvent as useEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Implementa un movimiento asombroso {/*implement-a-staggering-movement*/}

En este ejemplo, el Hook `usePointerPosition()` rastrea la posición actual del puntero. Intenta mover el cursor o el dedo sobre el área de vista previa y observe cómo el puntero rojo sigue su movimiento. Su posición se guarda en la variable `pos1`.

De hecho, se renderizan cinco (!) puntos rojos diferentes. No los ves porque actualmente todos aparecen en la misma posición. Esto es lo que necesitas arreglar. Lo que quieres implementar en su lugar es un movimiento "escalonado": cada punto debe "seguir" el camino del punto anterior. Por ejemplo, si mueves rápidamente el cursor, el primer punto debería seguirlo inmediatamente, el segundo punto debería seguir el primer punto con un pequeño retraso, el tercer punto debería seguir al segundo punto, y así sucesivamente.

Necesitas implementar el Custom Hook `useDelayedValue`. Su implementación actual retorna el `value` proporcionado. En su lugar, quieres retornar el valor de vuelta de `delay` hace ciertos milisegundos. Es posible que necesites algún estado y un efecto para hacer esto.

Después de implementar `useDelayedValue`, deberías ver que los puntos se mueven uno tras otro.

<Hint>

Necesitarás almacenar el `delayedValue` como una variable de estado en tu Custom Hook. Cuando el `value` cambie, querrás ejecutar un efecto. Este efecto debería actualizar `delayedValue` después del `delay`. Puede que te resulte útil invocar al `setTimeout`.

¿Este efecto necesita limpieza? ¿Por qué o por qué no?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // Para hacer: Implementar este Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Aquí está una versión que funciona. Mantienes el `delayedValue` como una variable de estado. Cuando `value` se actualiza, tu efecto programa un tiempo de espera para actualizar el `delayedValue`. Esto es porque el `delayedValue` siempre "se queda atrás" del actual `value`.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Ten en cuenta que este efecto *no* necesita limpieza. Si invocas `clearTimeout` en la función de limpieza, entonces cada vez que `value` cambia, restablecerá el tiempo de espera ya programado. Para mantener el movimiento continuo, quieres que se disparen todos los tiempos de espera.

</Solution>

</Challenges>
