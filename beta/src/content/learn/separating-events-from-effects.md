---
title: 'Separating Events from Effects'
---

<Intro>

Los controladores de eventos solo se vuelven a ejecutar cuando realizas la misma interacción de nuevo. A diferencia de los controladores de eventos, los efectos se re-sincronizan si algún valor que leen, como una propiedad o una variable de estado, es diferente de lo que era durante la última representación. A veces, también quieres una combinación de ambos comportamientos: un efecto que se vuelve a ejecutar en respuesta a algunos valores pero no a otros. Esta página te enseñará cómo hacerlo.

</Intro>

<YouWillLearn>

- Cómo elegir entre un controlador de eventos y un efecto
- Por qué los efectos son reactivos y los controladores de eventos no lo son
- Qué hacer cuando quieres que parte del código de tu efecto no sea reactivo
- Qué son los Eventos de Efecto y cómo extraerlos de tus efectos
- Cómo leer las últimas propiedades y el estado de los efectos usando Eventos de Efecto

</YouWillLearn>

## Eligiendo entre controladores de eventos y Efectos {/*choosing-between-event-handlers-and-effects*/}

Primero, vamos a recapitular la diferencia entre controladores de eventos y Efectos.

Imagina que estas implementando un componente chat room. Tus requerimientos lucirían algo asi:

1. Tu componente, debería de conectarse de forma automática a la sala de chat seleccionada.
2. Cuando hagas click en el botón "Send", debería de enviar un mensaje al chat.

Digamos que ya tienes el código implementado para ello, pero no estas seguro de donde ponerlo. Deberías de usar controladores de eventos o Efectos? Cada vez que necesites contestar este pregunta, considera ["por qué" se necesita ejecutar el código.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Los controladores de eventos responden a interacciones especificas {/*event-handlers-run-in-response-to-specific-interactions*/}

Desde la perspectiva de un usuario, enviar un mensaje debería de pasar "porque" el particular botón de "Send" fue cliqueado. De otra forma, el usuario se molestara si tu envías su mensaje, en cualquier otro momento, o por cualquier otra razón. Este es el porque, enviar un mensaje debería de ser un controlador de evento. Los controladores de eventos te permiten manejar interacciones especificas como por ejemplo, clicks:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>;
    </>
  );
}
```

Con un controlador de evento, tu puedes estar seguro de que "sendMessage(message)" "unicamente" se activara si el usuario presiona el botón.

### Los efectos se ejecutan siempre que se necesita sincronización. {/*effects-run-whenever-synchronization-is-needed*/}

Recuerda que también necesitas que el componente se mantenga conectado a la sala de chat. Donde va ese código?

La "razón" para ejecutar este código no es ninguna interacción en particular. No es importante, el como o de que forma el usuario navego hasta la sala de chat. Ahora que ellos están viéndola, y pueden interactuar con ella, el componente necesita mantenerse conectado al servidor de chat seleccionado. Incluso si el componente de la sala de chat, fuese la pantalla inicial de tu aplicación y el usuario no a realizado ningún tipo de interacción, aún necesitarías conectarte. Es por eso que es un efecto:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Con este código, puedes estar seguro de que siempre hay una conexión activa al servidor de chat seleccionado actualmente, "independientemente" de las interacciones específicas realizadas por el usuario. Ya sea que el usuario solo haya abierto tu aplicación, seleccionado una sala diferente o navegado a otra pantalla y vuelto atrás, tu Efecto garantizará que el componente "permanezca sincronizado" con la sala seleccionada actualmente y se mantendrá sincronizado con los cambios en tiempo real en la sala [y volver a conectarse siempre que sea necesario.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
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
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // Una implementación real de hecho se conectaría al servidor
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Valores reactivos y lógica reactiva {/*reactive-values-and-reactive-logic*/}

Intuitivamente, podrías decir que los controladores de eventos siempre se activan "manualmente", por ejemplo, haciendo clic en un botón. Los efectos, por otro lado, son "automáticos": se ejecutan y vuelven a ejecutarse tantas veces como sea necesario para mantenerse sincronizados.

Hay una forma más precisa de pensar en esto.

Las propiedades, el estado y las variables declaradas dentro del cuerpo del componente se llaman <CodeStep step={2}>valores reactivos</CodeStep>. En este ejemplo, "serverUrl" no es un valor reactivo, pero "roomId" y "message" sí lo son. Participan en el flujo de datos de renderizado:


```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Los valores reactivos como estos pueden cambiar debido a un nuevo renderizado. Por ejemplo, el usuario puede editar el mensaje o elegir un "roomId" diferente en un desplegable. Los controladores de eventos y los efectos son diferentes en cómo responden a los cambios:

- **La lógica dentro de los controladores de eventos *no es reactiva.*** No se ejecutará de nuevo a menos que el usuario realice de nuevo la misma interacción (por ejemplo, un clic). Los controladores de eventos pueden leer valores reactivos, pero no "reaccionan" a sus cambios.
- **La lógica dentro de los efectos es *reactiva*** Si tu efecto lee un valor reactivo, [debes especificarlo como dependencia.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)  Luego, si un nuevo renderizado hace que ese valor cambie, React volverá a ejecutar la lógica del efecto de nuevo con el nuevo valor.


Vamos a volver al ejemplo anterior para ilustrar esta diferencia.

### La lógica dentro de los controladores de eventos, no es reactiva {/*logic-inside-event-handlers-is-not-reactive*/}


Dale un vistazo a esta linea de código. Esta lógica debería de ser reactiva o no?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Desde la perspectiva del usuario, **un cambio en el "mensaje" _no_ significa que quieran enviar un mensaje.** Solo significa que el usuario está escribiendo. En otras palabras, la lógica que envía un mensaje no debe ser reactiva. No debe volver a ejecutarse solo porque el <CodeStep step={2}>valor reactivo</CodeStep> ha cambiado. Por eso colocaste esta lógica en el controlador de eventos:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Los controladores de eventos no son reactivos, asi que; "sendMessage(message)" solo se ejecutara cuando el usuario haga clic en el botón "Send".

### La lógica dentro de los Efectos es reactiva {/*logic-inside-effects-is-reactive*/}


Ahora volvamos a estas líneas:


```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Desde la perspectiva del usuario, **un cambio en el "roomId" *sí* significa que quieren conectarse a una sala diferente.** En otras palabras, la lógica para conectarse a la sala debe ser reactiva. *Quieres* que estas líneas de código "estén al día" con el <CodeStep step={2}>valor reactivo</CodeStep> y volver a ejecutarse si ese valor es diferente. Por eso pusiste esta lógica dentro de un efecto:


```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Los Efectos son reactivos, entonces "createConnection(serverUrl, roomId)" y "connection.connect()" debería ejecutarse por cada valor distinto del "roomId". Tu efecto mantendrá la conexión del chat sincronizada con la actual sala seleccionada.

## Extrayendo lógica no-reactiva fuera de los Efectos {/*extracting-non-reactive-logic-out-of-effects*/}

Las cosas se complican más cuando quieres mezclar lógica reactiva con lógica no reactiva.

Por ejemplo, imagina que quieres mostrar una notificación cuando el usuario se conecta al chat. Tienes que leer el tema actual (oscuro o claro) de las propiedades para poder mostrar la notificación en el color correcto:


```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
````

Sin embargo, `theme` es un valor reactivo (puede cambiar como resultado de un nuevo renderizado) y [cada valor reactivo leído por un Efecto, debe ser declarado como una dependencia.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Entonces ahora, tu tienes que especificar `theme` como una dependencia de tu Efecto.


```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
````

Juega con este ejemplo e intenta ver si puedes localizar el problema con esta experiencia de usuario:

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
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Una implementación real de hecho se conectaría al servidor
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

```js notifications.js
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

Cuando el `roomId` cambia, el chat se vuelve a conectar como se esperaría. Pero dado que `theme` también es una dependencia, el chat *también* se vuelve a conectar cada vez que cambias entre el tema oscuro y el tema claro. ¡Eso no es genial!

En otras palabras, tu *no* quieres que esta linea sea reactiva, incluso aunque se encuentre dentro de un Efecto (lo cual es reactivo):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Necesitas una forma de separar esta lógica no reactiva del efecto reactivo que la rodea.

### Declarando un evento Efecto {/*declaring-an-effect-event*/}

<Wip>

Esta sección describe una **API experimental que aún no se ha agregado a React**, por lo que aún no puedes usarla.

</Wip>

Usa un Hook especial llamado [`useEffectEvent`](/apis/react/useEffectEvent) para extraer esta lógica no-reactiva fuera de tu Efecto:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
````

Aquí, `onConnected` se llama a un *Evento de efecto*. Es parte de tu lógica de efecto, pero se comporta mucho más como un controlador de eventos. La lógica dentro de él no es reactiva y siempre "ve" los valores más recientes de tus propiedades y estado.

Ahora puedes llamar al evento de efecto `onConnected` desde dentro de tu Efecto:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Esto resuelve el problema. Ten en cuenta que tuviste que *eliminar* `onConnected` de la lista de dependencias de tu efecto. Los **eventos de efecto no son reactivos y deben omitirse de las dependencias. El linter dará un error si los incluyes.**

Verifica que el nuevo comportamiento funcione como te gustaría:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Una implementación real seria conectada al server
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

```js notifications.js hidden
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

Puedes pensar en los eventos de efecto como muy similares a los controladores de eventos. La principal diferencia es que los controladores de eventos se ejecutan en respuesta a una interacción del usuario, mientras que los eventos de Efecto son disparados por ti desde los Efectos. Los eventos de efecto te permiten "romper la cadena" entre la reactividad de los efectos y algún código que no debería ser reactivo.


### Leyendo las propiedades y el estado más recientes con eventos de efecto {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Esta sección describe una **API experimental que aún no se ha agregado a React,** por lo que aún no puedes usarla.

</Wip>

Los eventos de efecto te permiten solucionar muchos patrones en los que podrías estar tentado de suprimir el linter de dependencias.

Por ejemplo, digamos que tienes un efecto para registrar las visitas a la página:


```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Más tarde, agregas múltiples rutas a tu `sitio`. Ahora tu componente Page recibe una propiedad `url` con la ruta actual. Quieres pasar la `url` como parte de tu llamada a `logVisit`, pero el linter de dependencias se queja:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴El Hook de React useEffect tiene una dependencia faltante: 'url'
  // ...
}
```

Piensa en lo que quieres que haga el código. *Quieres* registrar una visita separada para diferentes URLs ya que cada URL representa una página diferente. En otras palabras, esta llamada a "logVisit" *debería* ser reactiva con respecto a la `url`. Por eso, en este caso, tiene sentido seguir el linter de dependencias y agregar `url` como dependencia:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Todas las dependencias declaradas
  // ...
}
```

Ahora, digamos que quieres incluir el numero de "items" en tu carrito de compra, junto con cada pagina visitada:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 El Hook de React useEffect tiene una dependencia faltante: 'numberOfItems'
  // ...
}
```

Tu usaste "numbersOfItems" dentro del Efecto, asi que el linter te pide que lo agregues como dependencia. Como sea, tu *no* quieres que el llamado a "logVisit" sea reactivo con respecto a "numberOfItems". Si el usuario pone algo dentro del carrito de compras, y el "numberOfItems" cambia, esto *no significa* que el usuario ha visitado la pagina nuevamente. En otras palabras, *visitando la pagina* se siente similar a un evento. Tu necesitas ser muy preciso acerca de *cuando* decir que va a pasar.

Divide el código en dos partes:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Todas las dependencias declaradas.
  // ...
}
```

Aquí, `onVisit` es un evento de efecto. El código dentro de él no es reactivo. Por eso puedes usar `numberOfItems` (o cualquier otro valor reactivo!) sin preocuparte de que cause que el código circundante se ejecute de nuevo ante los cambios.

Por otro lado, el efecto en sí sigue siendo reactivo. El código dentro del efecto utiliza la propiedad `url`, por lo que el efecto se volverá a ejecutar después de cada renderizado con una `url` diferente. Esto, a su vez, llamará al evento de efecto `onVisit`.

Como resultado, llamarás a `logVisit` por cada cambio en la `url` y siempre leerás el número más reciente de `numberOfItems`. Sin embargo, si `numberOfItems` cambia por sí solo, esto no causará que se vuelva a ejecutar ningún código.


<Note>

Es posible que te estés preguntando si podrías llamar a `onVisit()` sin argumentos y leer la `url` dentro de él:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Esto funcionaría, pero es mejor pasar esta `url` al evento de Efecto de forma explícita. **Al pasar `url` como argumento a tu Evento de Efecto, estás diciendo que visitar una página con una `url` diferente constituye un "evento" separado desde el punto de vista del usuario.** La `visitedUrl` es una *parte* del "evento" que ocurrió:


```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Dado que tu evento de efecto "pide" explícitamente la `visitedUrl`, ahora no puedes eliminar accidentalmente la dependencia de `url` del Efecto. Si eliminas la dependencia de `url` (lo que causaría que las visitas a páginas distintas se cuenten como una sola), el linter te avisará al respecto. Quieres que `onVisit` sea reactivo en lo que respecta a la `url`, por lo que en lugar de leer la `url` dentro (donde no sería reactivo), la pasas *desde* tu Efecto.

Esto se vuelve especialmente importante si hay algún tipo de lógica asíncrona dentro del Efecto:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Retrasar el registro de visitas
  }, [url]);
```

En este ejemplo, `url` dentro de `onVisit` corresponde a la url más *reciente* (que podría haber cambiado ya), pero `visitedUrl` corresponde a la `url` que originalmente causó que este Efecto (y esta llamada a `onVisit`) se ejecutara.

</Note>

<DeepDive>

#### ¿Está bien suprimir el linter en su lugar? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

En los conjuntos de código existentes, a veces puedes ver que la regla del linter se suprime de esta manera:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Evita suprimir el linter así:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Después de que `useEffectEvent` se convierta en una parte estable de React, recomendamos **nunca suprimir el linter** de esta manera.

La primera desventaja de suprimir la regla es que React ya no te avisará cuando tu Efecto necesite "reaccionar" a una nueva dependencia reactiva que hayas introducido en tu código. Por ejemplo, en el ejemplo anterior, agregaste `url` como dependencias *porque* React te recordó hacerlo. Ya no recibirás más recordatorios para cualquier edición futura de ese efecto si desactivas el linter. Esto lleva a errores.


Aquí tienes un ejemplo de un error confuso causado por suprimir el linter. En este ejemplo, la función `handleMove` se supone que debe leer el valor actual de la variable de estado `canMove` para decidir si el punto debe seguir el cursor. Sin embargo, `canMove` siempre es true dentro de `handleMove`. ¿Puedes ver por qué?


<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

El problema con este código es suprimir el linter de dependencias. Si eliminas la supresión, verás que este efecto debe depender de la función `handleMove`. Esto tiene sentido: `handleMove` se declara dentro del cuerpo del componente, lo que lo convierte en un valor reactivo. ¡Cada valor reactivo debe especificarse como dependencia, o potencialmente puede volverse obsoleto con el tiempo!

El autor del código original ha "mentido" a React diciendo que el efecto no depende (`[]`) de ningún valor reactivo. Por eso React no volvió a sincronizar el efecto después de que `canMove` haya cambiado (y `handleMove` con él). Debido a que React no volvió a sincronizar el Efecto, el `handleMove` adjunto como oyente es la función `handleMove` creada durante el render inicial. Durante el render inicial, `canMove` era true, por lo que `handleMove` del render inicial siempre verá ese valor.


**Si nunca suprimimos el linter, nunca veremos problemas con valores obsoletos.**

Con `useEffectEvent`, no es necesario "mentir" al linter y el código funciona como se espera:

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Esto no significa que `useEffectEvent` sea *siempre* la solución correcta. Solo debes aplicarlo a las líneas de código que no quieres que sean reactivas. Por ejemplo, en el sandbox anterior, no querías que el código del Efecto fuera reactivo con respecto a `canMove`. Por eso tenía sentido extraer un Evento de Efecto.


Lee [Removiendo dependencias del Efecto](/learn/removing-effect-dependencies) para conocer otras alternativas correctas a la supresión del linter.

</DeepDive>

### Limitaciones de los Eventos de Efecto {/*limitations-of-effect-events*/}

<Wip>

Esta sección describe una **API experimental que aún no se ha agregado a React,** por lo que todavía no puedes usarla.

</Wip>

Los eventos de efecto tienen muy pocas opciones de uso:

* **Solo llámalos desde dentro de los efectos.**
* **Nunca pásalos a otros componentes o Hooks.**

Por ejemplo, no declares y pases un Evento de Efecto de esta manera:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Evita: Pasar eventos de efecto

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Necesita especificar "callback" en las dependencias
}
```

En su lugar, siempre declare los Eventos de Efecto directamente junto a los Efectos que los usen:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Bien: Solo llamado localmente dentro de un efecto
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No necesita especificar "onTick" (un evento de efecto) como dependencia
}
```

Los Eventos de Efecto son "piezas" no reactivas de tu código de Efecto. Deben estar junto al Efecto que los use.

<Recap>

- Los manejadores de eventos se ejecutan en respuesta a interacciones específicas.
- Los Efectos se ejecutan siempre que se necesite sincronización.
- La lógica dentro de los manejadores de eventos no es reactiva.
- La lógica dentro de los Efectos es reactiva.
- Puedes mover la lógica no reactiva de los Efectos a Eventos de Efecto.
- Solo llama a los Eventos de Efecto desde dentro de los Efectos.
- No pases Eventos de Efecto a otros componentes o Hooks.

</Recap>

<Challenges>

#### Arregla la variable que no se actualiza {/*fix-a-variable-that-doesnt-update*/}

Este componente `Timer` mantiene una variable de estado `count` que aumenta cada segundo. El valor en el que aumenta se almacena en la variable de estado `increment`. Puedes controlar la variable `increment` con los botones más y menos.

Sin embargo, no importa cuántas veces haga clic en el botón más, el contador sigue aumentando en uno cada segundo. ¿Qué pasa con este código? ¿Por qué `increment` siempre es igual a `1` dentro del código del Efecto? Encuentra el error y corrígelo.

<Hint>

Para solucionar este código, basta con seguir las reglas.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Como de costumbre, cuando buscas errores en los Efectos, comienza buscando las supresiones del linter.

Si eliminas el comentario de supresión, React te dirá que el código de este Efecto depende de `increment`, pero le "mentiste" a React al afirmar que este Efecto no depende de ningún valor reactivo (`[]`). Agrega `increment` al array de dependencias:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Ahora, cuando `increment` cambie, React sincronizará de nuevo tu Efecto, lo que reiniciará el intervalo.

</Solution>

#### Fix a freezing counter {/*fix-a-freezing-counter*/}

Este componente `Timer` mantiene una variable de estado `count` que aumenta cada segundo. El valor en el que aumenta se almacena en la variable de estado `increment`, que puedes controlarla con los botones más y menos. Por ejemplo, prueba a presionar el botón más nueve veces y notarás que `count` ahora aumenta cada segundo en diez en lugar de en uno.

Hay un pequeño problema con esta interfaz de usuario. Es posible que te des cuenta de que si sigues presionando los botones más o menos más rápido de una vez por segundo, el propio temporizador parece detenerse. Solo se reanuda después de que haya pasado un segundo desde la última vez que presionaste cualquiera de los botones. Encuentra por qué está sucediendo esto y soluciona el problema para que el temporizador funcione en *cada* segundo sin interrupciones.

<Hint>

Parece que el efecto que configura el temporizador "reacciona" al valor de `increment`. ¿Realmente necesita ser reactiva la línea que usa el valor actual de `increment` para llamar a `setCount`?

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

The issue is that the code inside the Effect uses the `increment` state variable. Since it's a dependency of your Effect, every change to `increment` causes the Effect to re-synchronize, which causes the interval to clear. If you keep clearing the interval every time before it has a chance to fire, it will appear as if the timer has stalled.

To solve the issue, extract an `onTick` Effect Event from the Effect:

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Since `onTick` is an Effect Event, the code inside it isn't reactive. The change to `increment` does not trigger any Effects.

</Solution>

#### Fix a non-adjustable delay {/*fix-a-non-adjustable-delay*/}

In this example, you can customize the interval delay. It's stored in a `delay` state variable which is updated by two buttons. However, even if you press the "plus 100 ms" button until the `delay` is 1000 milliseconds (that is, a second), you'll notice that the timer still increments very fast (every 100 ms). It's as if your changes to the `delay` are ignored. Find and fix the bug.

<Hint>

Code inside Effect Events is not reactive. Are there cases in which you would _want_ the `setInterval` call to re-run?

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

The problem with the above example is that it extracted an Effect Event called `onMount` without considering what the code should actually be doing. You should only extract Effect Events for a specific reason: when you want to make a part of your code non-reactive. However, the `setInterval` call *should* be reactive with respect to the `delay` state variable. If the `delay` changes, you want to set up the interval from scratch! To fix this code, pull all the reactive code back inside the Effect:

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

In general, you should be suspicious of functions like `onMount` that focus on the *timing* rather than the *purpose* of a piece of code. It may feel "more descriptive" at first but it obscures your intent. As a rule of thumb, Effect Events should correspond to something that happens from the *user's* perspective. For example, `onMessage`, `onTick`, `onVisit`, or `onConnected` are good Effect Event names. Code inside them would likely not need to be reactive. On the other hand, `onMount`, `onUpdate`, `onUnmount`, or `onAfterRender` are so generic that it's easy to accidentally put code that *should* be reactive into them. This is why you should name your Effect Events after *what the user thinks has happened,* not when some code happened to run.

</Solution>

#### Fix a delayed notification {/*fix-a-delayed-notification*/}

When you join a chat room, this component shows a notification. However, it doesn't show the notification immediately. Instead, the notification is artificially delayed by two seconds so that the user has a chance to look around the UI.

This almost works, but there is a bug. Try changing the dropdown from "general" to "travel" and then to "music" very quickly. If you do it fast enough, you will see two notifications (as expected!) but they will *both* say "Welcome to music".

Fix it so that when you switch from "general" to "travel" and then to "music" very quickly, you see two notifications, the first one being "Welcome to travel" and the second one being "Welcome to music". (For an additional challenge, assuming you've *already* made the notifications show the correct rooms, change the code so that only the latter notification is displayed.)

<Hint>

Your Effect knows which room it connected to. Is there any information that you might want to pass to your Effect Event?

</Hint>

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
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

```js notifications.js hidden
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

<Solution>

Inside your Effect Event, `roomId` is the value *at the time Effect Event was called.*

Your Effect Event is called with a two second delay. If you're quickly switching from the travel to the music room, by the time the travel room's notification shows, `roomId` is already `"music"`. This is why both notifications say "Welcome to music".

To fix the issue, instead of reading the *latest* `roomId` inside the Effect Event, make it a parameter of your Effect Event, like `connectedRoomId` below. Then pass `roomId` from your Effect by calling `onConnected(roomId)`:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
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

```js notifications.js hidden
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

The Effect that had `roomId` set to `"travel"` (so it connected to the `"travel"` room) will show the notification for `"travel"`. The Effect that had `roomId` set to `"music"` (so it connected to the `"music"` room) will show the notification for `"music"`. In other words, `connectedRoomId` comes from your Effect (which is reactive), while `theme` always uses the latest value.

To solve the additional challenge, save the notification timeout ID and clear it in the cleanup function of your Effect:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
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

```js notifications.js hidden
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

This ensures that already scheduled (but not yet displayed) notifications get cancelled when you change rooms.

</Solution>

</Challenges>
