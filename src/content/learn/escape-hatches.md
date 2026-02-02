---
title: Puertas de escape
---

<Intro>

Algunos de tus componentes puede que necesiten controlar y sincronizarse con sistemas externos a React. Por ejemplo, puede que necesites enfocar un input usando la API del navegador, reproducir o pausar un reproductor de video implementado sin React, o conectar y escuchar mensajes de un servidor remoto. En este capítulo, aprenderás las puertas de escape que te permiten "salir" de React y conectarte con sistemas externos. La mayoría de la lógica de tu aplicación y flujo de datos no deberían depender de estas características.

</Intro>

<YouWillLearn isChapter={true}>

* [Cómo "recordar" información sin volver a renderizar](/learn/referencing-values-with-refs)
* [Cómo acceder a los elementos del DOM manejados por React](/learn/manipulating-the-dom-with-refs)
* [Cómo sincronizar componentes con sistemas externos](/learn/synchronizing-with-effects)
* [Cómo eliminar Efectos innecesarios de tus componentes](/learn/you-might-not-need-an-effect)
* [Cómo el ciclo de vida de un Efecto es diferente al de un componente](/learn/lifecycle-of-reactive-effects)
* [Cómo cuidar algunos valores de Efectos desencadenantes](/learn/separating-events-from-effects)
* [Cómo hacer que tu Efecto se vuelva a ejecutar con menos frecuencia](/learn/removing-effect-dependencies)
* [Cómo compartir lógica entre componentes](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Referenciar valores con refs {/*referencing-values-with-refs*/}

Cuando quieres que un componente "recuerde" cierta información, pero no quieres que esa información [desencadene nuevos renderizados](/learn/render-and-commit), puedes usar una *ref*:

```js
const ref = useRef(0);
```

Al igual que un estado, las refs son retenidas por React entre nuevos renderizados. Sin embargo, al asignar un nuevo valor al estado se vuelve a renderizar el componente. ¡Cambiar el valor de la ref no lo hace! Puedes acceder al valor actual de esa ref a través de la propiedad `ref.current`.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('¡Hiciste clic ' + ref.current + ' veces!');
  }

  return (
    <button onClick={handleClick}>
      ¡Hazme clic!
    </button>
  );
}
```

</Sandpack>

Una ref es como un bolsillo secreto de tu componente que React no puede rastrear. Por ejemplo, puedes usar refs para almacenar [timeout IDs](https://developer.mozilla.org/es/docs/Web/API/setTimeout#valor_devuelto), [DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element), y otros objetos que no tienen un impacto en el resultado del renderizado de tu componente.

<LearnMore path="/learn/referencing-values-with-refs">

Lee **[Referenciar valores con refs](/learn/referencing-values-with-refs)** para aprender como usar las refs y recordar información.

</LearnMore>

## Manipular el DOM con refs {/*manipulating-the-dom-with-refs*/}

React automáticamente actualiza el DOM para coincidir con el resultado de tu renderizado, por lo que tus componentes no se necesitarán manipular frecuentemente. Sin embargo, algunas veces puede que necesites acceder a los elementos del DOM gestionados por React—por ejemplo, referenciar un nodo, desplazarse hacia él, o medir su tamaño y posición. No hay una manera integrada de hacer esto en React, así que necesitarás una ref hacia el nodo del DOM. Por ejemplo, al hacer clic en el botón se enfocará el input usando una ref:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Enfoca el input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Lee **[Manipular el DOM con refs](/learn/manipulating-the-dom-with-refs)** para aprender como acceder a los elementos del DOM manejados por React.

</LearnMore>

## Sincronizar con Efectos {/*synchronizing-with-effects*/}

Algunos componentes necesitan sincronizarse con sistemas externos. Por ejemplo, es posible que desees controlar un componente que no sea de React basado en el estado de React, establecer una conexión a un servidor, enviar reporte de analíticas cuando un componente aparece en la pantalla. A diferencia de los controladores de eventos, que permiten controlar eventos concretos, los *Efectos* te permiten ejecutar algún código después de renderizar. Úsalos para sincronizar tu componente con un sistema externo a React.

Presiona Reproducir/Pausar unas veces y mira cómo el reproductor de video permanece sincronizado al valor de la prop `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pausar' : 'Reproducir'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Algunos Efectos pueden "limpiarse" por sí mismos. Por ejemplo, un Efecto que establece una conexión a un servidor de chat debería devolver una *función de limpieza* que le dice a React como desconectar tu componente de ese servidor:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>¡Bienvenido al chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Una aplicación real se conectaría al servidor
  return {
    connect() {
      console.log('✅ Conectando...');
    },
    disconnect() {
      console.log('❌ Desconectado.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

En desarrollo, React ejecutará inmediatamente y limpiará tu Efecto una vez más. Es por esto que ves `"✅ Conectando..."` impreso dos veces. Esto asegura que no olvides de aplicar la función de limpieza.

<LearnMore path="/learn/synchronizing-with-effects">

Lee **[Sincronizar con Efectos](/learn/synchronizing-with-effects)** para aprender a como sincronizar componentes con sistemas externos.

</LearnMore>

## Quizás no necesites un Efecto {/*you-might-not-need-an-effect*/}

Los Efectos son una puerta de escape del paradigma de React. Te permiten "salir" de React y sincronizar tus componentes con algún sistema externo. Si no hay un sistema externo involucrado (por ejemplo, si quieres actualizar el estado de un componente cuando cambien algunas props o estados), no deberías necesitar un Efecto. La eliminación de Efectos innecesarios harán tu código más fácil de comprender, más rápido de ejecutar y menos propenso a errores.

Hay dos casos comunes en los que no necesitas Efectos:
- **No necesitas Efectos para transformar los datos para el renderizado.**
- **No necesitas Efectos para controlar eventos de usuario.**

Por ejemplo, no necesitas un Efecto para ajustar algún estado basado en otro estado:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Evitar: estado redundante y Efecto innecesario
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

En lugar a eso, calcula todo lo que puedas mientras renderizas:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Bien: calculado durante el renderizado
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Sin embargo, *necesitas* Efectos para sincronizar con sistemas externos.

<LearnMore path="/learn/you-might-not-need-an-effect">

Lee **[Puede que no necesites un Efecto](/learn/you-might-not-need-an-effect)** para aprender como eliminar Efectos innecesarios.

</LearnMore>

## Ciclo de vida de los Efectos reactivos {/*lifecycle-of-reactive-effects*/}

Los Efectos tienen un ciclo de vida diferente al de los componentes. Los componentes se pueden montar, actualizar, o desmontar. Un Efecto puede únicamente hacer dos cosas: empezar a sincronizar algo, y a detener ese sincronizado más adelante. Este ciclo puede suceder varias veces si tu Efecto depende de props y estados que pueden cambiar sobre el tiempo.

Este Efecto depende del valor de la prop `roomId`. Las props son *valores reactivos,* que significan que pueden cambiar al volver a renderizar. Observa que el Efecto *se vuelve a sincronizar* (y se vuelve a conectar al servidor) si `roomId` cambia:

<Sandpack>

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

  return <h1>¡Bienvenido a la sala {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escoge la sala de chat:{' '}
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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Una aplicación real se conectaría al servidor
  return {
    connect() {
      console.log('✅ Conectando a la sala "' + roomId + '" en ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado de la sala "' + roomId + '" en ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React proporciona una regla al linter para comprobar que hayas especificado correctamente las dependencias de tus Efectos. Si olvidas especificar `roomId` en la lista de dependencias en el ejemplo anterior, el linter encontrará automáticamente ese error.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Lee **[Ciclo de vida de eventos reactivos](/learn/lifecycle-of-reactive-effects)** para aprender como el ciclo de vida de un Efecto es diferente al de un componente.

</LearnMore>

## Separar eventos de Efectos {/*separating-events-from-effects*/}

<<<<<<< HEAD
<Wip>

Esta sección describe una **API experimental que aún no se ha publicado** en una versión estable de React.

</Wip>

Los controladores de eventos únicamente se vuelven a ejecutar cuando realizas de nuevo la misma interacción. A diferencia de los controladores de eventos, los Efectos se vuelven a sincronizar si alguno de los valores que leen, como props o estados, son diferentes a los del último renderizado. Algunas veces, quieres una mezcla de ambos comportamientos: un Efecto que se vuelve a ejecutar en respuesta de algunos valores.
=======
Event handlers only re-run when you perform the same interaction again. Unlike event handlers, Effects re-synchronize if any of the values they read, like props or state, are different than during last render. Sometimes, you want a mix of both behaviors: an Effect that re-runs in response to some values but not others.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

Todo el código dentro de los Efectos es *reactivo.* Se ejecutará de nuevo si algún valor reactivo que lee, ha cambiado debido a una nueva renderización. Por ejemplo, este Efecto volverá a conectarse con el chat si `roomId` o `theme` han cambiado:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('¡Conectado!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>¡Bienvenido a la sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Escoge la sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="viaje">viaje</option>
          <option value="música">música</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usa el tema oscuro
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Una aplicación real se conectaría al servidor
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Esto no es lo ideal. Quieres volver a conectar con el chat únicamente si el `roomId` ha cambiado. ¡Cambiar el tema (mediante `theme`) no debería provocar una reconexión con el chat! Mueve el código que lee el `theme` fuera de tu Efecto hacia un *Evento de Efecto*:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('¡Conectado!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>¡Bienvenido a la sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Escoge la sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="viaje">viaje</option>
          <option value="música">música</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usa el tema oscuro
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Una aplicación real se conectaría al servidor
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

El código dentro de los Eventos de Efecto no son reactivos, así que cambiando el tema (mediante el `theme`) no hace que tu Efecto se vuelva a conectar más.

<LearnMore path="/learn/separating-events-from-effects">

Lee **[Separar Eventos de Efectos](/learn/separating-events-from-effects)** para aprender como evitar que algunos valores vuelvan a desencadenar Efectos.

</LearnMore>

## Eliminar dependencias de Efectos {/*removing-effect-dependencies*/}

Cuando escribes un Efecto, el linter verificará que hayas incluido cada valor reactivo (como props y estados) que el Efecto lee en la lista de tus dependencias de Efectos. Esto asegura que tus Efectos permanezcan sincronizados con las últimas props y estados de tu componente. Las dependencias innecesarias pueden causar que tu Efecto se ejecute frecuentemente, incluso llegar a crear un ciclo infinito. La manera en que los elimines dependerá de cada caso.

Por ejemplo, este Efecto depende del objeto `options`  el cual se recrea cada vez que cambies el input:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>¡Bienvenido a la sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escoge la sala de chat:{' '}
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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  return {
    connect() {
      console.log('✅ Conectando a la sala "' + roomId + '" en ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectando de la sala "' + roomId + '" en ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

No quieres que el chat se vuelva a conectar cada vez que empieces a escribir un mensaje. Para resolver este problema, mueve el objeto `options` dentro del Efecto así solo depende únicamente del string `roomId`:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>¡Bienvenido a la sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escoge la sala de chat:{' '}
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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  return {
    connect() {
      console.log('✅ Conectando a la sala "' + roomId + '" en ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado de "' + roomId + '" en ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Fíjate que no empezaste editando la lista de dependencias para eliminar la dependencia `options`. Eso sería un error. En lugar de eso, cambiaste el código alrededor, así que la dependencia se volvió *innecesaria.* Piensa en la lista de dependencias como una lista de todos los valores reactivos utilizados por el código de tu Efecto. Tú no escogiste intencionadamente que poner en esa lista. La lista describe tu código. Para cambiar la lista de dependencias, cambia el código.

<LearnMore path="/learn/removing-effect-dependencies">

Lee **[Eliminar dependencias de Efectos](/learn/removing-effect-dependencies)** para aprender a hacer que tu Efecto se repita con menos frecuencia.

</LearnMore>

## Reutilizar la lógica con hooks personalizados {/*reusing-logic-with-custom-hooks*/}

React viene con Hooks integrados como `useState`, `useContext`, y `useEffect`. Algunas veces, desearás que existiera un Hook para un propósito específico: por ejemplo, para llamar datos, para saber si el usuario está conectado, o para conectarse a una sala de chat. Para realizar esto, puedes crear tus propios Hooks de acuerdo a las necesidades de tu aplicación.

En este ejemplo, el Hook integrado `usePointerPosition` rastrea la posición del cursor, mientras que el Hook integrado `useDelayedValue` devuelve un valor que está "rezagado" con respecto al valor que le pasaste por un cierto número de milisegundos. Mueve el cursor sobre el área de vista previa del sandbox para ver un rastro de puntos en movimiento que siguen al cursor:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
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

```js src/usePointerPosition.js
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

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Puedes crear Hooks integrados, componerlos juntos, pasar datos entre ellos y reutilizarlos entre componentes. A medida que tu aplicación crezca, escribirás menos Efectos a mano porque podrás reutilizar los Hooks integrados que ya hayas escrito. También existen excelentes Hooks integrados mantenidos por la comunidad de React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Lee **[Reutilizar la lógica con Hooks integrados](/learn/reusing-logic-with-custom-hooks)** para aprender como compartir lógica entre componentes.

</LearnMore>

## ¿Qué sigue? {/*whats-next*/}

¡Dirígete a [Referenciar valores con refs](/learn/referencing-values-with-refs) para empezar a leer este capítulo!
