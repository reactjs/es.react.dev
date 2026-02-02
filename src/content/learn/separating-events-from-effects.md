---
title: 'Separar eventos de Efectos'
---

<Intro>

Los controladores de eventos solo se vuelven a ejecutar cuando vuelves a realizar la misma interacción. A diferencia de los controladores de eventos, los Efectos se resincronizan si algún valor que leen, como una prop o una variable de estado, es diferente de lo que era durante el último renderizado. A veces, también quieres una mezcla de ambos comportamientos: un Efecto que se vuelve a ejecutar en respuesta a algunos valores pero no a otros. Esta página te enseñará cómo hacerlo.

</Intro>

<YouWillLearn>

- Cómo escoger entre un controlador de evento y un Efecto
- Por qué los Efectos son reactivos, y los controladores de eventos no lo son
- Qué hacer cuando quieres que una parte del código de tu Efecto no sea reactivo
- Qué son los eventos de Efecto y cómo extraerlos de tus Efectos
- Cómo leer las últimas props y estados de los Efectos usando Eventos de Efecto

</YouWillLearn>

## Elegir entre controladores de eventos y Efectos {/*choosing-between-event-handlers-and-effects*/}

Primero, vamos a recapitular la diferencia entre controladores de eventos y Efectos.

Imagina que estas implementando un componente de sala de chat. Tus requerimientos se verán así:

1. Tu componente debería conectarse de forma automática a la sala de chat seleccionada.
1. Cuándo hagas click al botón "Enviar", debería enviar un mensaje al chat.

Digamos que ya tienes el código implementado para ello, pero no estas seguro de donde ponerlo. ¿Deberías de usar controladores de eventos o Efectos? Cada vez que necesites contestar este pregunta, considera [*por qué* se necesita ejecutar el código.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Los controladores de eventos se ejecutan en respuesta a interacciones especificas {/*event-handlers-run-in-response-to-specific-interactions*/}

Desde la perspectiva del usuario, el envío de un mensaje debe producirse *porque* se hace clic en particular en el botón "Enviar". El usuario se enfadará bastante si envías su mensaje en cualquier otro momento o por cualquier otro motivo. Esta es la razón por la que enviar un mensaje debería ser un controlador de evento. Los controladores de eventos te permiten controlar interacciones específicas:

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
      <button onClick={handleSendClick}>Enviar</button>
    </>
  );
}
```

Con un controlador de Evento, puedes estar seguro que `sendMessage(message)` *únicamente* se activará si el usuario presiona el botón.

### Los Efectos se ejecutan siempre que es necesaria la sincronización {/*effects-run-whenever-synchronization-is-needed*/}

Recuerda que también necesitas mantener el componente conectado a la sala de chat. ¿Dónde va ese código?

La *razón* para ejecutar este código no es ninguna interacción en particular. No es importante, el cómo o de qué forma el usuario navegó hasta la sala de chat. Ahora que ellos están viéndola y pueden interactuar con ella, el componente necesita mantenerse conectado al servidor de chat seleccionado. Incluso si el componente de la sala de chat fuera la pantalla inicial de tu aplicación y el usuario no ha realizado ningún tipo de interacción, *todavía* necesitarías conectarte. Es por eso que es un Efecto:

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

Con este código, puedes estar seguro que siempre hay una conexión activa al servidor de chat seleccionado actualmente, *independientemente* de las interacciones específicas realizadas por el usuario. Si el usuario solo ha abierto tu aplicación, seleccionado una sala diferente o navegado a otra pantalla y volvió, tu Efecto garantiza que el componente *permanecerá sincronizado* con la sala seleccionada a actualmente, y [volverá a conectarse cuando sea necesario.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

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
      <h1>¡Bienvenido a la sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Enviar</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Selecciona la sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="viaje">viaje</option>
          <option value="música">música</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Cerrar chat' : 'Abrir chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 Enviaste: ' + message);
}

export function createConnection(serverUrl, roomId) {
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
input, select { margin-right: 20px; }
```

</Sandpack>

## Valores reactivos y lógica reactiva {/*reactive-values-and-reactive-logic*/}

Intuitivamente, podría decirse que los controladores de eventos siempre se activan "manualmente", por ejemplo, al pulsar un botón. Los Efectos, en cambio, son "automáticos": se ejecutan y se vuelven a ejecutar tantas veces como sea necesario para mantenerse sincronizados.

Hay una forma más precisa de pensar en esto.

Las propiedades, estados, y variables declarados dentro del cuerpo de tu componente son llamados <CodeStep step={2}>valores reactivos</CodeStep>. En este ejemplo, `serverUrl` no es un valor reactivo, pero `roomId` y `message` sí lo son. Participan en el flujo de datos de renderizado:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Valores reactivos como estos pueden cambiar debido a un re-renderizado. Por ejemplo, el usuario puede editar el `message` o elegir un `roomId` diferente en un desplegable. Los controladores de eventos y Efectos responden a los cambios de manera diferente:

- **La lógica dentro de los controladores de eventos no es *reactiva.*** No se ejecutará de nuevo a menos que el usuario vuelva a realizar la misma interacción (por ejemplo, un clic). Los controladores de eventos pueden leer valores reactivos sin "reaccionar" a sus cambios.
- **La lógica dentro de los Efectos es *reactiva.*** Si tu Efecto lee un valor reactivo, [tienes que especificarlo como una dependencia](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Luego, si una nueva renderización hace que ese valor cambie, React volverá a ejecutar la lógica de tu Efecto con el nuevo valor.

Volvamos al ejemplo anterior para ilustrar esta diferencia.

### La lógica dentro de los controladores de eventos no es reactiva {/*logic-inside-event-handlers-is-not-reactive*/}

Echa un vistazo a esta línea de código. ¿Esta lógica debería ser reactiva o no?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Desde la perspectiva del usuario, **un cambio en el `message` _no_ significa que quiera enviar un mensaje.** Solo significa que el usuario está escribiendo. En otras palabras, la lógica que envía un mensaje no debería ser reactiva. No debería volver a ejecutarse solo porque el <CodeStep step={2}>valor reactivo</CodeStep> ha cambiado. Por eso pertenece al controlador de evento:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Los controladores de eventos no son reactivos, por lo que `sendMessage(message)` solo se ejecutará cuando el usuario pulse el botón Enviar.

### La lógica dentro de los Efectos es reactiva {/*logic-inside-effects-is-reactive*/}

Ahora volvamos a estas líneas:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Desde la perspectiva del usuario, **un cambio en el `roomId` *significa* que quieren conectarse a una sala diferente.** En otras palabras, la lógica para conectarse a la sala debe ser reactiva. Usted *quiere* estas líneas de código para "mantenerse al día" con el <CodeStep step={2}>valor reactivo</CodeStep>, y para ejecutar de nuevo si ese valor es diferente. Es por eso que pertenece en un Efecto:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Los Efectos son reactivos, por lo que `createConnection(serverUrl, roomId)` y `connection.connect()` se ejecutarán para cada valor distinto de `roomId`. Tu Efecto mantiene la conexión de chat sincronizada con la sala seleccionada en ese momento.

## Extraer lógica no reactiva fuera de los Efectos {/*extracting-non-reactive-logic-out-of-effects*/}

Las cosas se vuelven más complicadas cuando tu quieres combinar lógica reactiva con lógica no reactiva.

Por ejemplo, imagina que quieres mostrar una notificación cuando el usuario se conecta al chat. Lees el tema actual (oscuro o claro) de los accesorios para poder mostrar la notificación en el color correcto:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('¡Conectado!', theme);
    });
    connection.connect();
    // ...
```

Sin embargo, `theme` es un valor reactivo (puede cambiar como resultado del re-renderizado), y [cada valor reactivo leído por un Efecto debe ser declarado como su dependencia](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Ahora tienes que especificar `theme` como una dependencia de tu Efecto:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('¡Conectado!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Todas las dependencias declaradas
  // ...
```

Juegue con este ejemplo y vea si puede detectar el problema con esta experiencia de usuario:

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
        Escoje la sala de chat:{' '}
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
        Usar tema oscuro
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
        throw Error('No se puede agregar el controlador dos veces.');
      }
      if (event !== 'connected') {
        throw Error('Solo se admite el evento "connected".');
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

Cuando el `roomId` cambia, el chat se reconecta como es de esperar. Pero como `theme` también es una dependencia, el chat *también* se reconecta cada vez que cambias entre el tema oscuro y el claro. Esto no es bueno.

En otras palabras, *no* quieres que esta línea sea reactiva, aunque esté dentro de un Efecto (que es reactivo):

```js
      // ...
      showNotification('¡Conectado!', theme);
      // ...
```

Necesitas una forma de separar esta lógica no reactiva del Efecto reactivo que la rodea.

### Declaración de un Evento de Efecto {/*declaring-an-effect-event*/}

<<<<<<< HEAD
<Wip>

Esta sección describe una API **experimental que aún no se ha publicado** en una versión estable de React.

</Wip>

Utiliza un Hook especial llamado [`useEffectEvent`](/reference/react/experimental_useEffectEvent) para extraer esta lógica no reactiva de su Efecto:
=======
Use a special Hook called [`useEffectEvent`](/reference/react/useEffectEvent) to extract this non-reactive logic out of your Effect:
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('¡Conectado!', theme);
  });
  // ...
```

Aquí, `onConnected` se llama un *Evento de Efecto.* Es una parte de tu lógica de Efecto, pero se comporta mucho más como un controlador de evento. La lógica dentro de él no es reactiva, y siempre "ve" los últimos valores de tus props y estado.

Ahora puedes llamar al Evento de Efecto `onConnected` desde dentro de tu Efecto:

```js {2-4,9,13}
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
  }, [roomId]); // ✅ Todas las dependencias declaradas
  // ...
```

<<<<<<< HEAD
Esto resuelve el problema. Ten en cuenta que has tenido que *eliminar* `onConnected` de la lista de dependencias de tu Efecto. **Los Eventos de Efecto no son reactivos y deben ser omitidos de las dependencias.**
Verifica que el nuevo comportamiento funciona como esperas:
=======
This solves the problem. Note that you had to *remove* `theme` from the list of your Effect's dependencies, because it's no longer used in the Effect. You also don't need to *add* `onConnected` to it, because **Effect Events are not reactive and must be omitted from dependencies.**

Verify that the new behavior works as you would expect:
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

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
        Escoje la sala de chat:{' '}
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
        Usar tema oscuro
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
        throw Error('No se puede añadir el controlador dos veces.');
      }
      if (event !== 'connected') {
        throw Error('Solo se admite el evento "connected".');
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

<<<<<<< HEAD
Puedes pensar que los Eventos de Efecto son muy similares a los controladores de eventos. La principal diferencia es que los controladores de eventos se ejecutan en respuesta a las interacciones del usuario, mientras que los Eventos de Efecto son disparados por ti desde los Efectos. Los Eventos de Efecto te permiten "romper la cadena" entre la reactividad de los Efectos y el código que no debería ser reactivo.
=======
You can think of Effect Events as being very similar to event handlers. The main difference is that event handlers run in response to user interactions, whereas Effect Events are triggered by you from Effects. Effect Events let you "break the chain" between the reactivity of Effects and code that should not be reactive.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

### Leer las últimas propiedades y el estado con los Eventos de Efecto {/*reading-latest-props-and-state-with-effect-events*/}

<<<<<<< HEAD
<Wip>

Esta sección describe una API **experimental que aún no se ha publicado** en una versión estable de React.

</Wip>

Los Eventos de Efecto le permiten arreglar muchos patrones en los que podría verse tentado a eliminar el linter de dependencias.
=======
Effect Events let you fix many patterns where you might be tempted to suppress the dependency linter.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

Por ejemplo, digamos que tienes un Efecto para registrar las visitas a la página:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Más tarde, añades múltiples rutas a tu sitio. Ahora tu componente `Page` recibe una propiedad `url` con la ruta actual. Quieres pasar la `url` como parte de tu llamada `logVisit`, pero el linter de dependencias se queja:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 Hook de React useEffect tiene una dependencia que falta: 'url'
  // ...
}
```

Piense en lo que quiere que haga el código. Usted *quiere* registrar una visita separada para diferentes URLs ya que cada URL representa una página diferente. En otras palabras, esta llamada a `logVisit` *debería* ser reactiva con respecto a la `url`. Por eso, en este caso, tiene sentido seguir el linter de dependencias, y añadir `url` como dependencia:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Todas las dependencias declaradas
  // ...
}
```

Supongamos ahora que desea incluir el número de artículos en el carrito de compras junto con cada visita a la página:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Has utilizado `numberOfItems` dentro del Efecto, por lo que el linter te pide que lo añadas como dependencia. Sin embargo, *no* quieres que la llamada a `logVisit` sea reactiva con respecto a `numberOfItems`. Si el usuario pone algo en el carro de la compra, y el `numberOfItems` cambia, esto *no significa* que el usuario haya visitado la página de nuevo. En otras palabras, *visitar la página* es, en cierto sentido, un "evento". Ocurre en un momento preciso.

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
  }, [url]); // ✅ Todas las dependencias declaradas
  // ...
}
```

Aquí, `onVisit` es un Evento de Efecto. El código que contiene no es reactivo. Por eso puedes usar `numberOfItems` (¡o cualquier otro valor reactivo!) sin preocuparte de que cause que el código circundante se vuelva a ejecutar con los cambios.

Por otro lado, el Efecto en sí sigue siendo reactivo. El código dentro del Efecto utiliza la propiedad `url`, por lo que el Efecto se volverá a ejecutar después de cada rerenderizado con una `url` diferente. Esto, a su vez, llamará al Evento de Efecto "onVisit".

Como resultado, se llamará a `logVisit` por cada cambio en la `url`, y siempre se leerá el último `numberOfItems`. Sin embargo, si `numberOfItems` cambia por sí mismo, esto no hará que se vuelva a ejecutar el código.

<Note>

Puede que te preguntes si podrías llamar a `onVisit()` sin argumentos, y leer la `url` que contiene:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Esto funcionaría, pero es mejor pasar esta `url` al Evento de Efecto explícitamente. **Al pasar `url` como argumento a tu Evento de Efecto, estás diciendo que visitar una página con una `url` diferente constituye un "evento" separado desde la perspectiva del usuario.** La `visitedUrl` es una parte del "evento" que ocurrió:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Desde que tu Evento de Efecto "pregunta" explícitamente por la `visitedUrl`, ahora no puedes eliminar accidentalmente `url` de las dependencias del Efecto. Si eliminas la dependencia `url` (provocando que distintas visitas a la página se cuenten como una), el linter te advertirá de ello. Quieres que `onVisit` sea reactivo con respecto a la `url`, así que en lugar de leer la `url` dentro (donde no sería reactivo), la pasas *desde* tu Efecto.

Esto es especialmente importante si hay alguna lógica asíncrona dentro del Efecto:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Retraso en el registro de visitas
  }, [url]);
```

Aquí, `url` dentro de `onVisit` corresponde a la *última* `url` (que podría haber cambiado), pero `visitedUrl` corresponde a la `url` que originalmente causó que este Efecto (y esta llamada a `onVisit`) se ejecutara.

</Note>

<DeepDive>

#### ¿Está bien suprimir el linter de dependencia en su lugar? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

En las bases de código existentes, a veces puede ver la regla lint suprimida de esta manera:

```js {expectedErrors: {'react-compiler': [8]}} {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Evite suprimir el linter de este modo:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

<<<<<<< HEAD
Después de que `useEffectEvent` se convierta en una parte estable de React, recomendamos **nunca suprimir el linter**.
=======
We recommend **never suppressing the linter**.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

La primera desventaja de suprimir la regla es que React ya no te avisará cuando tu Efecto necesite "reaccionar" a una nueva dependencia reactiva que hayas introducido en tu código. En el ejemplo anterior, añadiste `url` a las dependencias *porque* React te lo recordó. Si desactivas el linter, ya no recibirás esos recordatorios para futuras ediciones de ese Efecto. Esto conduce a errores.

Aquí hay un ejemplo de un error confuso causado por la supresión del linter. En este ejemplo, se supone que la función `handleMove` lee el valor actual de la variable de estado `canMove` para decidir si el punto debe seguir al cursor. Sin embargo, `canMove` es siempre `true` dentro de `handleMove`.

¿Puedes ver por qué?

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
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
        El punto puede moverse
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


El problema con este código está en suprimir el linter de dependencia. Si eliminas la supresión, verás que este Efecto debería depender de la función `handleMove`. Esto tiene sentido: `handleMove` se declara dentro del cuerpo del componente, lo que lo convierte en un valor reactivo. Cada valor reactivo debe ser especificado como una dependencia, ¡o puede potencialmente volverse obsoleto con el tiempo!

El autor del código original ha "mentido" a React diciendo que el Efecto no depende (`[]`) de ningún valor reactivo. Por eso React no ha resincronizado el Efecto después de que `canMove` haya cambiado (y `handleMove` con él). Debido a que React no ha resincronizado el Efecto, el `handleMove` adjunto como listener es la función `handleMove` creada durante el render inicial. Durante el render inicial, `canMove` era `true`, por lo que `handleMove` del render inicial verá siempre ese valor.

**Si nunca suprimes el linter, nunca verás problemas con valores obsoletos.**

Con `useEffectEvent`, no hay necesidad de "mentir" al linter, y el código funciona como cabría esperar:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

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
        El punto puede moverse
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

Esto no significa que `useEffectEvent` sea *siempre* la solución correcta. Solo deberías aplicarlo a las líneas de código que no quieres que sean reactivas. En el sandbox anterior, no querías que el código del Efecto fuera reactivo con respecto a `canMove`. Por eso tenía sentido extraer un Evento de Efecto.

Leer [Eliminar dependencias de Efectos](/learn/removing-effect-dependencies) para otras alternativas correctas a la supresión del linter.

</DeepDive>

### Limitaciones de los Eventos de Efecto {/*limitations-of-effect-events*/}

<<<<<<< HEAD
<Wip>

Esta sección describe una API **experimental que aún no se ha publicado** en una versión estable de React.

</Wip>

Los Eventos de Efecto tienen un uso muy limitado:
=======
Effect Events are very limited in how you can use them:
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

* **Llámalos solo desde dentro Efectos.**
* **Nunca los pases a otros componentes o Hooks.**

Por ejemplo, no declares y pases un Evento de Efecto así:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Evitar: Pasar Eventos de Efecto

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
  }, [delay, callback]); // Necesitas especificar "callback" en las dependencias
}
```

En su lugar, declare siempre los Eventos de Efecto directamente junto a los Efectos que los utilizan:

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
      onTick(); // ✅ Bien: Solo se activa localmente dentro de un Efecto
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No es necesario especificar "onTick" (un evento de Efecto) como dependencia.
}
```

Los Eventos de Efecto son "piezas" no reactivas de tu código de Efecto. Deben estar junto al Efecto que los utiliza.

<Recap>

- Los controladores de eventos se ejecutan en respuesta a interacciones específicas.
- Los Efectos se ejecutan siempre que es necesaria la sincronización.
- La lógica dentro de los controladores de eventos no es reactiva.
- La lógica dentro de Efectos es reactiva.
- Puede mover la lógica no reactiva de Efectos a Eventos de Efecto.
- Llame a Eventos de Efecto solo desde dentro de Efectos.
- No pase Eventos de Efecto a otros componentes o Hooks.

</Recap>

<Challenges>

#### Corregir una variable que no se actualiza {/*fix-a-variable-that-doesnt-update*/}

Este componente `Timer` mantiene una variable de estado `count` que se incrementa cada segundo. El valor por el que se incrementa se almacena en la variable de estado `increment`. Puedes controlar la variable `increment` con los botones más y menos.

Sin embargo, no importa cuántas veces haga clic en el botón más, el contador sigue incrementándose en uno cada segundo. ¿Qué pasa con este código? ¿Por qué `increment` es siempre igual a `1` dentro del código del Efecto? Encuentra el error y arréglalo.

<Hint>

Para arreglar este código, basta con seguir las reglas.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
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
        Contador: {count}
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        Cada segundo, incrementar en:
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

Como de costumbre, cuando busques bugs en Efectos, empieza por buscar supresiones de linters.

Si eliminas el comentario de supresión, React te dirá que el código de este Efecto depende de `increment`, pero tú le "mentiste" a React afirmando que este Efecto no depende de ningún valor reactivo (`[]`). Añade `increment` al array de dependencias:

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
        Contador: {count}
        <button onClick={() => setCount(0)}>Resetear</button>
      </h1>
      <hr />
      <p>
        Cada segundo, incrementar en:
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

Ahora, cuando `increment` cambie, React resincronizará tu Efecto, lo que reiniciará el intervalo.

</Solution>

#### Arreglar un contador congelado {/*fix-a-freezing-counter*/}

Este componente `Timer` mantiene una variable de estado `count` que se incrementa cada segundo. El valor por el que aumenta se almacena en la variable de estado `increment`, que puedes controlar con los botones más y menos. Por ejemplo, prueba a pulsar el botón más nueve veces, y observa que la "cuenta" ahora aumenta cada segundo por diez en lugar de por uno.

Hay un pequeño problema con esta interfaz de usuario. Si pulsas los botones más de una vez por segundo, el temporizador parece detenerse. Solo se reanuda cuando ha pasado un segundo desde la última vez que pulsaste cualquiera de los botones. Averigua por qué ocurre esto y soluciona el problema para que el temporizador marque *cada* segundo sin interrupciones.

<Hint>

Parece que el Efecto que configura el temporizador "reacciona" al valor de `increment`. ¿La línea que utiliza el valor actual de `increment` para llamar a `setCount` realmente necesita ser reactiva?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

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
        Contador: {count}
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        Cada segundo, incrementar en:
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

El problema es que el código dentro del Efecto utiliza la variable de estado `increment`. Dado que es una dependencia de su Efecto, cada cambio en `increment` hace que el Efecto se vuelva a sincronizar, lo que hace que el intervalo se borre. Si sigues borrando el intervalo cada vez antes de que tenga la oportunidad de dispararse, parecerá como si el temporizador se hubiera estancado.

Para resolver el problema, extrae un Evento de Efecto `onTick` del Efecto:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

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
        Contador: {count}
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        Cada segundo, incrementar en:
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

Dado que "onTick" es un Evento de Efecto, el código que contiene no es reactivo. El cambio a `increment` no desencadena ningún Efecto.

</Solution>

#### Fijar un retraso no ajustable {/*fix-a-non-adjustable-delay*/}

En este ejemplo, puede personalizar el intervalo de retraso. Se almacena en una variable de estado `delay` que se actualiza mediante dos botones. Sin embargo, aunque pulses el botón "más 100 ms" hasta que el `delay` sea de 1000 milisegundos (es decir, un segundo), notarás que el temporizador sigue incrementándose muy rápido (cada 100 ms). Es como si tus cambios en el `delay` fueran ignorados. Encuentra y corrige el error.

<Hint>

El código dentro de los Eventos de Efecto no es reactivo. ¿Hay casos en los que _quisieras_ que la llamada a `setInterval` se volviera a ejecutar?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

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
        Contador: {count}
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        Incrementar en:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Retraso de incremento:
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

El problema con el ejemplo anterior es que extrajo un Evento de Efecto llamado `onMount` sin considerar lo que el código debería estar haciendo realmente. Solo deberías extraer Eventos de Efecto por una razón específica: cuando quieres hacer que una parte de tu código no sea reactiva. Sin embargo, la llamada a `setInterval` *debería* ser reactiva con respecto a la variable de estado `delay`. Si `delay` cambia, ¡quieres configurar el intervalo desde cero! Para arreglar este código, vuelve a meter todo el código reactivo dentro del Efecto:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

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
        Contador: {count}
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        Incrementar en:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Retraso de incremento:
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

En general, deberías desconfiar de funciones como `onMount` que se centran en el *tiempo* más que en el *propósito* de un trozo de código. Puede parecer "más descriptivo" al principio, pero oscurece tu intención. Como regla general, los Eventos de Efecto deberían corresponder a algo que ocurre desde la perspectiva del *usuario*. Por ejemplo, `onMessage`, `onTick`, `onVisit`, o `onConnected` son buenos nombres de Eventos de Efecto. El código dentro de ellos probablemente no necesitaría ser reactivo. Por otro lado, `onMount`, `onUpdate`, `onUnmount`, o `onAfterRender` son tan genéricos que es fácil poner accidentalmente código que *debería* ser reactivo en ellos. Esta es la razón por la que deberías nombrar tus Eventos de Efecto después de *lo que el usuario piensa que ha pasado,* no cuando algún código se ha ejecutado.

</Solution>

#### Arreglar una notificación con retraso {/*fix-a-delayed-notification*/}

Al entrar en una sala de chat, este componente muestra una notificación. Sin embargo, no muestra la notificación inmediatamente. En su lugar, la notificación se retrasa artificialmente dos segundos para que el usuario tenga la oportunidad de echar un vistazo a la interfaz de usuario.

Esto casi funciona, pero hay un error. Intenta cambiar el menú desplegable de "general" a "viaje" y luego a "música" rápidamente. Si lo haces lo suficientemente rápido, verás dos notificaciones (¡como era de esperar!) pero *ambas* dirán "Bienvenido a la música".

Arréglalo para que cuando cambies de "general" a "viaje" y luego a "música" muy rápidamente, veas dos notificaciones, la primera sea "Bienvenido a viaje" y la segunda "Bienvenido a música". (Para un reto adicional, suponiendo que *ya* has hecho que las notificaciones muestren las salas correctas, cambia el código para que solo se muestre la última notificación).

<Hint>

Tu Efecto sabe a qué sala está conectado. ¿Hay alguna información que quieras pasar a tu Evento Efecto?

</Hint>

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
    showNotification('Bienvenido a ' + roomId, theme);
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

  return <h1>¡Bienvenido a la sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Elija la sala de chat:{' '}
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
        Utilizar un tema oscuro
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
        throw Error('Solo se admite el evento "connected".');
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

<Solution>

Dentro de tu Evento de Efecto, `roomId` es el valor *en el momento en que el Evento de Efecto fue llamado.*

Su Evento de Efecto es llamado con un retraso de dos segundos. Si estás cambiando rápidamente de la sala de viaje a la sala de música, en el momento en que se muestra la notificación de la sala de viaje, `roomId` ya es `"música"`. Por eso ambas notificaciones dicen "Bienvenido a música".

Para solucionar el problema, en lugar de leer el *latest* `roomId` dentro del Evento de Efecto, hazlo un parámetro de tu Evento de Efecto, como `connectedRoomId` abajo. Luego pasa `roomId` desde tu Efecto llamando a `onConnected(roomId)`:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Bienvenido a ' + connectedRoomId, theme);
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

  return <h1>¡Bienvenido a la sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Elija la sala de chat:{' '}
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
        Usar tema oscuro
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
        throw Error('No se puede añadir el controlador dos veces.');
      }
      if (event !== 'connected') {
        throw Error('Solo se admite el evento "connected".');
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

El Efecto que tenía `roomId` como `"viaje"` (por lo que se conectó a la sala `"viaje"`) mostrará la notificación de `"viaje"`. El Efecto que tiene `roomId` como `"música"` (por lo que se conectó a la sala `"música"`) mostrará la notificación de `"música"`. En otras palabras, `connectedRoomId` viene de tu Efecto (que es reactivo), mientras que `theme` siempre utiliza el último valor.

Para resolver el problema adicional, guarda el ID del tiempo de espera de la notificación y elimínalo en la función de limpieza de tu Efecto:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Bienvenido a ' + connectedRoomId, theme);
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

  return <h1>¡Bienvenido a la sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Elija la sala de chat:{' '}
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
        Utilizar un tema oscuro
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
        throw Error('No se puede añadir el controlador dos veces.');
      }
      if (event !== 'connected') {
        throw Error('Solo se admite el evento "connected".');
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

Esto garantiza que las notificaciones ya programadas (pero aún no mostradas) se cancelen cuando cambie de sala.

</Solution>

</Challenges>
