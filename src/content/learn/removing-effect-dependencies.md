---
title: 'Eliminar dependencias de los Efectos'
---

<Intro>

Cuando escribes un Efecto, el linter verificará que has incluido todos los valores reactivos (como las props y el estado) que tu Efecto lee en la lista de dependencias de tu Efecto. Así se asegura que el Efecto se mantenga sincronizado con las últimas props y el último estado de tu componente. Dependencias innecesarias pueden ocasionar que tu Efecto se ejecute demasiadas veces, o incluso crear un ciclo infinito. Sigue esta guía para revisar y eliminar dependencias innecesarias de tus Efectos.

</Intro>

<YouWillLearn>

- Cómo arreglar ciclos infinitos de dependencias de un Efecto
- Qué hacer cuando quieres eliminar una dependencia
- Cómo leer un valor en un Efecto sin "reaccionar" a él
- Cómo y por qué evitar objectos y funciones como dependencias
- Por qué suprimir la advertencia de la dependencia es peligroso, y qué hacer en su lugar

</YouWillLearn>

## Las dependencias deben corresponderse con el código {/*dependencies-should-match-the-code*/}

Cuando escribes un Efecto, primero debes especificar como [iniciar y parar](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) lo que sea que tu Efecto está haciendo.

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
   // ...
}
```

Entonces, si dejas la lista de dependencias del Efecto vacía (`[]`), el linter sugerirá las dependencias correctas:

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
  }, []); // <-- ¡Corrige el error aquí!
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

Llénalas de acuerdo a lo que dice el linter:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas las dependencias declaradas
  // ...
}
```

[Los Efectos "reaccionan" a valores reactivos](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values). Dado que `roomId` es un valor reactivo (puede cambiar debido a una nueva renderización), el linter verifica que lo hayas especificado como dependencia. Si `roomId` recibe un valor diferente, React volverá a sincronizar tu Efecto. Esto asegura que el chat permanece conectado a la sala seleccionada y "reacciona" al *dropdown*:

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

### Para eliminar una dependencia, prueba que no es una dependencia {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Debes notar que no puedes "escoger" tus dependencias de tu Efecto. Cada <CodeStep step={2}>valor reactivo</CodeStep> que se usa en el código de tu Efecto debe declararse en tu lista de dependencias. La lista de dependencias de tu Efecto está determinada por el código a su alrededor:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Este es un valor reactivo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Este Efecto lee el valor reactivo
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Por tanto debes especificar el valor reactivo como una dependencia de tu Efecto
  // ...
}
```

[Los valores reactivos](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) incluyen las props y todas las variables y funciones declaradas directamente dentro de componente. Dado que `roomId` es un valor reactivo, no puedes eliminarlo de la lista de dependencias. El linter no lo permitiría:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect tiene una dependencia que falta: 'roomId'
  // ...
}
```

¡Y el linter estaría en lo correcto! Dado que `roomId` puede cambiar con el tiempo, esto introduciría un bug en tu código.

**Para eliminar una dependencias, necesitas "probarle" al linter que *no necesita* ser una dependencia.** Por ejemplo, puedes mover `roomId` fuera de componente para probar que no es reactivo y no cambiará entre rerenderizados:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'música'; // Ya no es un valor reactivo

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Se declararon todas las dependencias
  // ...
}
```

Ahora que `roomId` no es un valor reactivo (y no puede cambiar en un rerenderizado) no necesita estar como dependencia:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'música';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>¡Bienvenido a la sala {roomId}!</h1>;
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

Por esto es que ahora podemos especificar una [lista de dependencias vacía (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means). Tu Efecto *realmente no* depende y de ningún valor reactivo, por lo que *realmente no* necesita volverse a ejecutar cuando cualquiera de las props o el estado del componente cambie.

### Para cambiar las dependencias, cambia el código {/*to-change-the-dependencies-change-the-code*/}

Puede que hayas notado un patrón en tu flujo de trabajo:

1. Primero, **cambias el código** de tu Efecto o como se declaran los valores reactivos.
2. Luego, sigues al linter y ajustas las dependencias para **hacerlas corresponder con el código que cambiaste**.
3. Si no estás a gusto con la lista de dependencias, puedes **ir al primer paso** (y cambiar el código nuevamente).

La última parte es importante. **Si quieres cambiar las dependencias, cambia primero el código que lo circunda**. Puedes pensar en la lista de dependencia como [una lista de todos los valores reactivos usado por el código de tu Efecto](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency). No *eliges* intencionalmente qué poner en esa lista. La lista *describe* tu código. Para cambiar la lista de dependencia, cambia el código.

Esto puede parecerse a resolver una ecuación. Puedes iniciar con un objetivo (por ejemplo, eliminar una dependencia), y necesitas "encontrar" el código exacto que logre ese objetivo. No todo el mundo encuentra divertido resolver ecuaciones ¡y lo mismo podría decirse sobre escribir Efectos! Por suerte, debajo hay una lista de recetas comunes que puedes probar.

<Pitfall>

Si tienes una base de código existente, puede que tengas algunos Efectos que suprimen la advertencia de *linter* de esta forma:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evita suprimir así la advertencia del linter:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Cuando las dependencias no se ajustan al código, hay un riesgo muy alto de introducir bugs.** Al suprimir el linter, le *mientes* a React sobre los valores de los que depende tu Efecto. En su lugar, usa las técnicas que se muestran debajo.

</Pitfall>

<DeepDive>

#### ¿Por qué es tan peligroso suprimir la advertencia del linter sobre las dependencias? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Suprimir la advertencia del *linter* conduce a errores muy poco intuitivos que son difíciles de encontrar y corregir. Aquí hay un ejemplo:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
 setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

Digamos que querías ejecutar el Efecto "solo durante el montaje". Has leído que [la lista de dependencias vacía (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) hacen eso, así que decides ignorar al linter y especificar a la fuerza `[]` como dependencias.

Este contador se supone que incremente cada segundo la cantidad configurable con los dos botones. Sin embargo, dado que le "mentiste" a React diciendo que este Efecto no tiene dependencias, React sigue usando la función `onTick` del renderizado inicial. [Durante ese renderizado](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` era `0` e `increment` era `1`. Por eso es que `onTick` de ese renderizado siempre llama a `setCount(0 + 1)` cada segundo, y siempre ves `1`. Errores como este son difíciles de corregir cuando están esparcidos por múltiples componentes.

¡Siempre hay una mejor solución que ignorar el linter! Para corregir este código, necesitas añadir `onTick` a la lista de dependencias. (Para asegurarte de que el intervalo solo se configure una vez, [haz `onTick` un Evento de Efecto])(/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)).

**Recomendamos tratar el error de *linter* de la lista de dependencias como un error de compilación. Si no lo suprimes, nunca verás bugs como este.** El resto de esta página documenta las alternativas para este y otros casos.

</DeepDive>

## Eliminar dependencias innecesarias {/*removing-unnecessary-dependencies*/}

Cada vez que ajustas las dependencias del Efecto para reflejar el código, mira a la lista de dependencias. ¿Tiene sentido volver a correr cuando alguna de estas dependencias cambie? A veces, la respuesta es "no":

- A veces, quieres volver a ejecutar *diferentes partes* de tu Efecto bajo condiciones diferentes.
- A veces, quieres leer solo el *último valor* de alguna dependencia en lugar de "reaccionar" a sus cambios.
- A veces, una dependencia puede cambiar muy a menudo de forma *no intencional* porque es un objeto o una función.

Para encontrar la solución correcta, necesitas responder algunas preguntas sobre tu Efecto. Revisémoslas.

### ¿Debería moverse este código a un controlador de evento? {/*should-this-code-move-to-an-event-handler*/}

Sobre lo primero que debes pensar es si este código debería ser un Efecto.

Imagina un formulario. Al enviarse, actualizas la variable de estado `submitted` a `true`. Necesitas enviar una petición POST y mostrar una notificación. Has decidido ubicar este código dentro de un Efecto que "reacciona" al cambio de `submitted` a `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Evita: Lógica específica de Evento dentro de un Efecto
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Después, quieres estilizar el mensaje de notificación de acuerdo al tema actual, así que lees el tema actual. Dado que `theme` se declara en el cuerpo del componente, es un valor reactivo, y debes declararlo como una dependencia:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Evita: Lógica específica de Evento dentro de un Efecto
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ Todas las dependencias declaradas

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Pero al hacer esto, has introducido un bug. Imagina que envías un formulario primero y luego cambias entre temas oscuros y claros. La variable `theme` cambiará, el Efecto se volverá a ejecutar, ¡y por tanto mostrará la misma notificación nuevamente!

**El problema aquí es que no debió haber sido nunca un Efecto**. Quieres enviar una petición POST y mostrar la notificación en respuesta al *envío del formulario*, que es una interacción particular. Cuando quieres ejecutar algún código en respuesta a una interacción particular, pon esa lógica directamente en el controlador de evento correspondiente:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Bien: Lógica específica de Evento se llama desde controladores de eventos
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

Ahora que el código está en un controlador de evento, no es reactivo --por lo que solo se ejecutará cuando el usuario envía el formulario--. Lee más acerca de [escoger entre controladores de eventos y Efectos](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) y [cómo eliminar Efectos innecesarios](/learn/you-might-not-need-an-effect).

### ¿Tú Efecto hace varias cosas no relacionadas? {/*is-your-effect-doing-several-unrelated-things*/}

La próxima preguntas que te debes hacer es si tu Efecto está haciendo varias cosas no relacionadas.

Imagina que estás creando un formulario de envíos en el que el usuario necesita elegir su ciudad y área. Obtienes la lista de ciudades `cities` del servidor de acuerdo al país seleccionado `country` de forma tal que los puedas mostrar como opciones en un *dropdown*:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ Todas las dependencias declaradas

  // ...
```

Este es un buen ejemplo de [obtener datos en un Efecto](/learn/you-might-not-need-an-effect#fetching-data). Estás sincronizando el estado `cities` con la red de acuerdo a la prop `country`. No puedes hacer esto en un controlador de evento porque necesitas obtener los datos tan pronto como se muestre `ShippingForm` y cada vez que cambie `country` (sin importar qué interacciones causa el cambio).

Digamos ahora que estás añadiendo una segunda caja de selección para las areas de la ciudad, que debería obtener las `areas` para la ciudad `city` actualmente seleccionada. Podrías comenzar añadiendo una segunda llamada `fetch` para la lista de areas dentro del mismo Efecto:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Evitar: Un solo efecto sincroniza dos procesos independientes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ Todas las dependencias declaradas

  // ...
```

Sin embargo, como ahora el Efecto usa la variable de estado `city`, tienes que añadir `city` a la lista de dependencias. Resulta que esto introduce un problema. Ahora, cada vez que el usuario seleccionar una ciudad diferente, el Efecto volverá a ejecutarse y llamar a `fetchCities(country)`. Como resultado, obtendrás innecesariamente la lista de ciudades muchas veces.

**El problema con este código es que estás sincronizando dos cosas que no guardan relación:**

1. Quieres sincronizar el estado `cities` con la red con base en la prop `country`.
1. Quieres sincronizar el estado `areas` con la red con base en el estado `city`.

Divide la lógica en dos Efectos y cada uno reaccionará a la variable que necesita para sincronizarse:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ Todas las dependencias declaradas

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ Todas las dependencias declaradas

  // ...
```

Ahora el primer Efecto solo se vuelve a ejecutar si `country` cambia, mientras el segundo Efecto se vuelve a ejecutar cuando `city` cambia. Los has separado a propósito: dos cosas diferentes se sincronizan con dos Efectos separados. Dos Efectos separados tienen dos listas de dependencias separadas, por lo que ya no se activarán mutuamente sin quererlo.

El código final no es más largo que el original, pero separar estos Efectos aún es correcto. [Cada Efecto debe representar un proceso de sincronización independiente](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process). En este ejemplo, eliminar un Efecto no rompe la lógica del otro Efecto. Este es un buen indicador de que *sincronizan cosas diferentes*, y tenía sentido separarlos. Si la duplicación te preocupa, puedes mejorar este código aún más [extrayendo lógica repetitiva en un Hook personalizado](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks).

### ¿Estás leyendo algún estado para calcular el próximo estado? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Este Efecto actualiza la variable de estado `messages` con un nuevo *array* creado cada vez que llega un nuevo mensaje:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Usa la variable `messages` para [crear un nuevo *array*](/learn/updating-arrays-in-state) que se inicia con todos los mensajes existentes y añade el nuevo mensaje al final. Sin embargo, dado que `messages` es un valor reactivo que un Efecto lee, debe ser una dependencia:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ Todas las dependencias declaradas
  // ...
```

Y cuando se incluye `messages` como dependencia se introduce un problema.

Cada vez que recibes un mensaje, `setMessages()` causa que el componente se vuelva a renderizar con un nuevo *array* `messages` que incluye el mensaje recibido. Sin embargo, dado que este Efecto ahora depende de `messages`, esto *también* resincronizará el Efecto. Por tanto cada nuevo mensaje hará que el chat se reconecte. ¡El usuario no querría eso!

Para resolver el problema, no leas `messages` dentro del Efecto. En cambio, pasa una [función actualizadora](/reference/react/useState#updating-state-based-on-the-previous-state) a `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas las dependencias declaradas
  // ...
```

**Ten en cuenta que ahora el Efecto no lee para nada la variable `messages`**. Solo necesitas pasar una función actualizadora como `msgs => [...msgs, receivedMessage]`. React [pone tu función actualizadora en una cola](/learn/queueing-a-series-of-state-updates) y le proporcionará el parámetro `msgs` en el próximo renderizado. Es por esto que el Efecto en sí ya no necesita la dependencia de `messages`. Como resultado de esta solución, al recibir un mensaje de chat ya no se provocará que el chat se reconecte.

### ¿Quieres leer un valor sin "reaccionar" as sus cambios? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Esta sección describe una **API experimental que aún no se ha añadido a React**, por lo que aún no puedes usarla.

</Wip>

Supón que quieres poner un sonido cuando el usuario recibe un nuevo mensaje a menos que `isMuted` sea `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Dado que tu Efecto ahora usa `isMuted` en su código, tienes que añadirlo a las dependencias:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ Todas las dependencias declaradas
  // ...
```

El problema es que cada vez que `isMuted` cambie (por ejemplo, cuando el usuario presiona el botón "Muted"), el Efecto se volverá a sincronizar y se reconectará al servidor de chat. ¡Esta no es la experiencia de usuario deseada! (En este ejemplo, aún deshabilitando el linter no funcionaría --si haces eso, `isMuted` se quedaría "atrapado" en su valor antiguo--).

Para resolver este problema, necesitas extraer la lógica que no debe ser reactiva fuera de tu Efecto. No quieres que este Efecto "reaccione" a los cambios de `isMuted`. [Mueve este pedazo de lógica a un Evento de Efecto:](/learn/separating-events-from-effects#declaring-an-effect-event):

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas las dependencias declaradas
  // ...
```

Los Eventos de Efecto te permiten separar un Efecto en partes reactivas (que deben "reaccionar" a valores reactivos como `roomId` y sus cambios) y partes no reactivas (que solo leen sus últimos valores, como `onMessage` lee `isMuted`). **Ahora que has leído `isMuted` dentro de un Evento de Efecto, no necesita ser una dependencia de tu Efecto**. Como resultado, el chat no se reconectará cuando cambies la configuración "Muted" de *on* a *off*, ¡solucionando el problema original!

#### Envolver un controlador de evento de las props {/*wrapping-an-event-handler-from-the-props*/}

Puede que te hayas encontrado con un problema similar en el que tu componente recibe un controlador de evento como una prop:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ Todas las dependencias declaradas
  // ...
```

Supón que el componente padre pasa un función `onReceiveMessage` diferente en cada renderizado:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Dado que `onReceiveMessage` es una dependencia de tu Efecto, causaría que el Efecto se vuelva a sincronizar después de cada rerenderizado del padre. Esto haría que se reconecte al chat. Para resolver esto, envuelve la llamada en un Evento de Efecto:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas las dependencias declaradas
  // ...
```

Los Eventos de Efecto no son reactivas, por lo que no necesitas especificarlas como dependencias. Como resultado, el chat no se reconectará más aún si el componente padre pasa una función que es diferente en cada rerenderizado.

#### Separar código reactivo y código no reactivo {/*separating-reactive-and-non-reactive-code*/}

En este ejemplo, quieres registrar una visita cada vez que cambia `roomId`. Quieres incluir el valor actual de `notificationCount` con cada registro, pero *no* quieres que un cambio a `notificationCount` dispare un nuevo evento de registro.

La solución nuevamente consiste en separar el código no reactivo en un Evento de Efecto:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Todas las dependencias declaradas
  // ...
}
```

Quieres que tu lógica sea reactiva con respecto a `roomId`, por lo que quieres leer `roomId` dentro de tu Efecto. Sin embargo, no quieres que un cambio a `notificationCount` registre una nueva visita, por lo que lees `notificationCount` dentro del Evento de Efecto. [Aprende más sobre leer las últimas props y estado desde Efectos con el uso de Eventos de Efecto](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events).

### ¿Algún valor reactivo cambia inintencionadamente? {/*does-some-reactive-value-change-unintentionally*/}

A veces, *sí* quieres que tu Efecto reaccione a cierto valor, pero los cambios a ese valor son más frecuentes de lo que quisieras --y puede que no refleje un cambio real desde la perspectiva del usuario--. Por ejemplo, digamos que creas un objeto `options` en el cuerpo de tu componente, y luego lees ese objeto dentro de tu Efecto:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Este objeto se declara en el cuerpo del componente, por lo que es un [valor reactivo](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values). Cuando lees un valor reactivo como este dentro de un Efecto, lo declaras como una dependencia. Esto garantiza que tu Efecto "reacciona" a sus cambios:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Todas las dependencias declaradas
  // ...
```

¡Es importante declararlo como una dependencia! Esto garantiza, por ejemplo, que si cambia `roomId`, luego tu Efecto se volverá a conectar al chat con las nuevas opciones. Sin embargo, también hay un problema con el código de arriba. Para ver el problema, intenta escribir en la caja de texto del *sandbox* de abajo y mira que pasa en la consola:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Desactivar temporalmente el linter para demostrar el problema
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

En el *sandbox* de arriba, la caja de texto solo actualiza la variable de estado `message`. Desde la perspectiva del usuario, esto no debería afectar a la conexión del chat. Sin embargo, cada vez que actualizas la variable `message`, tu componente se vuelve a renderizar. Cuando tu componente rerenderiza, el código dentro de él se ejecuta nuevamente.

Esto significa que se crea un nuevo objeto `options` en cada rerenderizado del componente `ChatRoom`. React ve que ese objeto `options` es un *objeto diferente* al objeto `options` que se creó en el renderizado anterior. Es por eso que resincroniza tu Efecto (que depende de `options`) y el chat se reconecta mientras escribes.

**Este problema afecta a objetos y funciones en particular. En JavaScript, cada objeto y función creado nuevamente se considera distinto a todos los demás objetos. ¡No importa si el contenido dentro de ellos puede ser el mismo!**

```js {7-8}
// Durante el primer renderizado
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'música' };

// Durante el siguiente renderizado
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'música' };

// ¡Estos son dos objetos diferentes!
console.log(Object.is(options1, options2)); // falso
```

**Objetos y funciones como dependencias crean un riesgo de que tu Efecto se resincronice más a menudo de lo que necesitas.**

Es por esto que, siempre que sea posible, debes intentar evitar objetos y funciones como dependencias de los Efectos. En su lugar, intenta moverlos fuera del componente, o dentro del Efecto, o extraer valores primitivos fuera de ellos.

#### Mueve objetos estáticos y funciones fuera de tu componente {/*move-static-objects-and-functions-outside-your-component*/}

Si el objeto no depende de ninguna prop o estado, puedes mover ese objeto fuera de tu componente:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'música'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Todas las dependencias declaradas
  // ...
```

De esta forma, le *pruebas* al linter que no es reactivo. No puede cambiar como resultado de un rerenderizado, por lo que no necesita ser una dependencia de tu Efecto. Ahora si se rerenderiza `ChatRoom` no causará que se resincronice tu Efecto.

Esto también sirve para funciones:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'música'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Todas las dependencias declaradas
  // ...
```

Dado que `createOptions` se declara fuera del componente, no es un valor reactivo. Es por eso que no necesita especificarse en las dependencias de tu Efecto y por qué nunca causará que tu Efecto se resincronice.

#### Mueve objetos y funciones dinámicas dentro de tu Efecto {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Si tu objeto depende de algún valor reactivo que puede cambiar como resultado de un rerenderizado, como la prop `roomId`, no puedes sacarlo *fuera* de tu component. Sin embargo, sí puedes mover su creación *dentro* del código de tu Efecto:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ Todas las dependencias declaradas
  // ...
```

Ahora que `options` se declara dentro de tu Efecto, ya no es una dependencia de tu Efecto. En cambio, el único valor reactivo que usa tu Efecto es `roomId`. Dado que `roomId`  no es un objeto o una función, puedes tener la seguridad de que no será *inintencionadamente* diferente. En JavaScript, números y cadenas se comparan por su contenido:

```js {7-8}
// Durante el primer renderizado
const roomId1 = 'música';

// Durante el siguiente renderizado
const roomId2 = 'música';

// ¡Estos dos strings son los mismos!
console.log(Object.is(roomId1, roomId2)); // verdadero
```

Gracias a esta solución, el chat no se reconectará más si editas la caja de texto:

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

Sin embargo, *sí* se reconecta cuando cambias el botón desplegable para elegir `roomId`, como se esperaría.

Esto funciona también para funciones:

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas las dependencias declaradas
  // ...
```

Puedes escribir tus propias funciones para agrupar porciones de lógica dentro de tu Efecto. Siempre que las declares dentro de tu Efecto, no serán valores reactivos, y por tanto no necesitan ser dependencias de tu Efecto.

#### Leer valores primitivos de objetos {/*read-primitive-values-from-objects*/}

En ocasiones, puede que recibas un objeto como prop:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Todas las dependencias declaradas
  // ...
```

El riesgo aquí es que el componente padre cree el objeto durante el renderizado:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Esto causaría que tu Efecto se reconectara cada vez que el componente padre se rerenderiza. Para solucionarlo, lee toda la información necesaria del objeto *fuera* del Efecto y evita tener objetos y funciones como dependencias:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Todas las dependencias declaradas
  // ...
```

La lógica se vuelve un poco repetitiva (lees algunos valores de un objeto fuera de un Efecto, y luego creas un objeto con los mismos valores dentro de un Efecto). Pero deja muy explícitamente de qué información depende *realmente* tu Efecto. Si un objeto se vuelve a crear sin intención por el componente padre, el chat no se reconectaría. Sin embargo, si `options.roomId` o `options.serverUrl` sí cambian, el chat se volvería a conectar como esperarías.

#### Calcular valores primitivos de funciones {/*calculate-primitive-values-from-functions*/}

El mismo enfoque puede servir para las funciones. Por ejemplo, supón que el componente padre pasa una función:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Para evitar hacerla una dependencias (y causar que se reconecte on cada rerenderizado), llámala fuera del Efecto. Esto te da los valores `roomId` y `serverUrl` que no son objetos y que puedes leerlos desde dentro de tu Efecto:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Todas las dependencias declaradas
  // ...
```

Esto solo funciona para funciones [puras](/learn/keeping-components-pure) porque es seguro llamarlas durante el renderizado. Si tu función es un controlador de evento, pero no quieres que sus cambios resincronicen tu Efecto, [envuélvela en un Evento de Efecto](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Las dependencias siempre deben corresponderse con el código.
- Cuando no estás a gusto con tus dependencias, lo que necesitas editar es el código.
- Suprimir el linter lleva a errores confusos, y siempre deberías evitarlo.
- Para eliminar una dependencia, debes "probarle" al linter que no es necesaria.
- Si el código en tu Efecto debe ejecutarse como respuesta a una interacción específica, mueve el código a un controlador de evento.
- Si partes diferentes de tu Efecto deberían volverse a ejecutar por diferentes razones, divídelo en diferentes Efectos.
- Si quieres actualizar un estado basado en el estado anterior, pasa una función actualizadora.
- Si quieres leer el último valor sin "reaccionar" a él, extrae un Evento de Efecto de tu Efecto.
- En JavaScript, los objetos y funciones se consideran diferentes si se crean en momentos diferentes.
- Intenta evitar objetos y funciones como dependencias. Muévelos fuera del componente o dentro del Efecto.

</Recap>

<Challenges>

#### Arregla un intervalo que se reinicia {/*fix-a-resetting-interval*/}

Este Efecto configura un intervalo que hace tictac cada segundo. Has notado que algo extraño pasa: parece que el intervalo es destruido y recreado en cada tic. Arregla el código para que el interval no sea recreado constantemente.

<Hint>

Parece que el código de este Efecto depende de `count`. ¿Hay alguna forma de no necesitar esta dependencia? Debería haber una manera de actualizar el estado `count` con base en su valor anterior sin añadir una dependencia de ese valor.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creando el intervalo');
    const id = setInterval(() => {
      console.log('⏰ Tic del intervalo');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Borrando el intervalo');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Contador: {count}</h1>
}
```

</Sandpack>

<Solution>

Quieres actualizar desde dentro del Efecto el estado `count` para que sea `count + 1`. Sin embargo, esto hace que el Efecto dependa de `count`, que cambia con cada tic, y por eso el intervalo se recrea en cada tic.

Para resolverlo, usa la [función actualizadora](/reference/react/useState#updating-state-based-on-the-previous-state) y escribe `setCount(c => c + 1)` en lugar de `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creando el intervalo');
    const id = setInterval(() => {
      console.log('⏰ Tic del intervalo');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Borrando el intervalo');
      clearInterval(id);
    };
  }, []);

  return <h1>Contador: {count}</h1>
}
```

</Sandpack>

<<<<<<< HEAD
En lugar de leer `count` dentro del Efecto, pasas a React una instrucción `c => c + 1` ("¡incrementa este número!"). React la aplicará en el próximo renderizado. Y dado que ya no tienes que leer el valor de `count` dentro de tu Efecto, puedes mantener vacío (`[]`) el *array* de dependencias de tu Efecto. Así se evita que tu Efecto recree el intervalo en cada tic.
=======
Instead of reading `count` inside the Effect, you pass a `c => c + 1` instruction ("increment this number!") to React. React will apply it on the next render. And since you don't need to read the value of `count` inside your Effect anymore, you can keep your Effect's dependencies empty (`[]`). This prevents your Effect from re-creating the interval on every tick.
>>>>>>> 65d297e93b36be5370e58ab7828d022c741ecbe2

</Solution>

#### Arregla una animación que se vuelve a ejecutar {/*fix-a-retriggering-animation*/}

En este ejemplo, cuando presionas "Mostrar", se muestra con un efecto de fundido un mensaje de bienvenida. La animación toma un segundo. Cuando presionas "Remover", el mensaje de bienvenida desaparece inmediatamente. La lógica para la animación del efecto fundido se implementa en el archivo `animation.js` como un [bucle de animación](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) de JavaScript. No necesitas cambiar esa lógica. Puedes tratarla como una biblioteca de terceros. Tu Efecto crea una instancia de `FadeInAnimation` para el nodo del DOM, y luego llama `start(duration)` o `stop()` para controlar la animación. La duración `duration` se controla por un *slider*. Ajusta el *slider* y mira como cambia la animación.

Este código ya funciona, pero hay algo que quieres cambiar. Actualmente, cuando mueves el *slider* que controla la variable de estado `duration`, se vuelve a ejecutar la animación. Cambia el comportamiento para que el Efecto no "reaccione" a la variable `duration`. Cuando presiones "Mostrar", el Efecto debe usar el valor actual de `duration` en el *slider*. Sin embargo, el hecho de mover el *slider* no debería por sí solo volver a ejecutar la animación.

<Hint>

¿Hay una línea de código dentro del Efecto que no debería ser reactiva? ¿Cómo puedes mover código no reactivo fuera del Efecto?

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Bienvenido
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Duración de la atenuación: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remover' : 'Mostrar'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Saltar al final inmediatamente
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Comenzar a animar
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Todavía nos quedan más fotogramas por pintar
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
```

</Sandpack>

<Solution>

Tu Efecto necesita leer el último valor de `duration`, pero no quieres que "reaccione"  a los cambios de `duration`. Usas `duration` para iniciar la animación, pero el inicio de la animación no es reactivo. Extrae la línea de código no reactiva dentro de un Efecto de Evento y llama la función desde tu Efecto.

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Bienvenido
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Duración de la atenuación: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remover' : 'Mostrar'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
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
    if (progress < 1) {
      // Todavía nos quedan más fotogramas por pintar
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
```

</Sandpack>

Los Eventos de Efecto como `onAppear` no son reactivos, por lo que puedes leer `duration` dentro de este sin volver a desencadenar la animación.

</Solution>

#### Soluciona la reconexión del chat {/*fix-a-reconnecting-chat*/}

En este ejemplo, cada vez que presionas "Alternar tema", el chat se reconecte. ¿Por qué pasa esto? Soluciona el error para que el chat se reconecte solo cuando edites la URL del servidor o elijas una sala de chat diferente.

Trata `chat.js` como una biblioteca externa de terceros: puedes consultarla para comprobar su API, pero no la edites.

<Hint>

Hay más de una forma para solucionar esto, pero en última instancia querrás evitar tener un objecto como dependencia.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Alternar tema
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>¡Bienvenido a la sala {options.roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Tu Efecto se vuelve a ejecutar porque depende en el objeto `options`. Los objetos se pueden recrear inintencionadamente, deberías intentar evitar tenerlos como dependencias de tus Efectos siempre que sea posible.

La solución menos invasiva es leer `roomId` y `serverUrl` fuera del Efecto, y luego hacer que el Efecto dependa de esos valores primitivos (que no pueden cambiar inintencionadamente). Dentro del Efecto, crea un objeto y pásalo a `createConnection`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Alternar tema
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>¡Bienvenido a la sala {options.roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Sería aún mejor reemplazar la prop `options` de tipo objeto con las props más específicas `roomId` y `serverUrl`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Alternar tema
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>¡Bienvenido a la sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Limitarse a props primitivas siempre que sea posible facilita optimizar luego tus componentes.

</Solution>

#### Soluciona la reconexión del chat, de nuevo {/*fix-a-reconnecting-chat-again*/}

Este ejemplo se conecta al chat con o sin encriptación. Cambia el *checkbox* y nota los diferentes mensajes en la consola cuando la encriptación está activada y desactivada. Intenta cambiar la sala. Luego, intenta cambiar el tema. Cuando estás conectado a una sala de chat, recibirás nuevos mensajes a intervalos de algunos segundos. Verifica que su color se ajusta al tema que has escogido.

En este ejemplo, el chat se reconecta cada vez que intentas cambiar el tema. Arregla esto. Luego de la solución, cambiar el tema no debería reconectar el chat, pero cambiar la configuración de encriptación o cambiar de sala debería provocar una reconexión.

No cambies ningún código dentro de `chat.js`. Aparte de eso, puedes cambiar cualquier código siempre y cuando el resultado sea el mismo comportamiento. Por ejemplo, puede que encuentres útil cambiar qué props se pasan hacia abajo.

<Hint>

Estás pasando hacia abajo dos funciones: `onMessage` y `createConnection`. Ambas se crean nuevas cada vez que `App` se rerenderiza. Se consideran nuevos valores cada vez, que es lo que provoca que se vuelva a ejecutar tu Efecto.

Una de estas funciones es un controlador de evento. ¿Sabes de alguna forma de llamar un controlador de evento dentro de un Efecto sin "reaccionar" a los nuevos valores de la función controladora de evento? ¡Eso sería útil!

La otra función solo existe para pasar algún estado a un método de una API importada. ¿Es esta función realmente necesaria? ¿Cuál es la información esencial que se pasa hacia abajo? Podrías necesitar mover algunas importaciones de `App.js` a `ChatRoo.js`.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema oscuro
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Activar encriptación
      </label>
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
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('Nuevo mensaje: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>¡Bienvenido a la sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Conectando a la sala "' + roomId + '" ... (encriptado)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hola')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Desconectando de la sala "' + roomId + '" (encriptado)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando a la sala "' + roomId + '" room (sin encriptado)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hola')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectando de la sala "' + roomId + '" (sin encriptado)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Hay más de una forma correcta de solucionar esto, pero aquí se muestra una posible solución.

En el ejemplo original, cambiar el tema causó que se crearan funciones diferentes `onMessage` y `createConnection` y se pasaran hacia abajo. Dado que el Efecto depende de estas funciones, el chat se reconectaría cada vez que cambias el tema.

Para solucionar el problema con `onMessage` necesitas envolverla en un Evento de Efecto:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

A diferencia de la prop `onMessage`, el Evento de Efecto `onReceiveMessage` no es reactivo. Es por esto que no necesita ser una dependencia de tu Efecto. Como resultado, los cambios a `onMessage` no causarán que el chat se reconecte.

No puedes hacer lo mismo con `createConnection` porque *debería* ser reactiva. *Quieres* que el Efecto se vuelva a ejecutar si el usuario cambia entre una conexión encriptada y una sin encriptación, o si el usuario cambia la sala actual. Sin embargo, dado que `createConnection` es una función, no puedes comprobar si la información que lee ha cambiado *realmente* o no. Para resolver esto, en lugar de pasar hacia abajo `createConnection` desde el componente App, pasa los valores simples `roomId` e `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Nuevo mensaje: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Ahora puedes mover la función `createConnection` *dentro* del Efecto en lugar de pasarla hacia abajo desde `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Después de estos dos cambios, tu Efecto no depende más de ninguna función:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Valores de reacción
  const onReceiveMessage = useEffectEvent(onMessage); // No reactivo

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Lectura de un valor reactivo
      };
      if (isEncrypted) { // Lectura de un valor reactivo
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ Todas las dependencias declaradas
```

As a result, the chat re-connects only when something meaningful (`roomId` or `isEncrypted`) changes:

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema oscuro
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Activar encriptación
      </label>
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
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Nuevo mensaje: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>¡Bienvenido a la sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Conectando a la sala "' + roomId + '" ... (encriptado)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hola')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Desconectando de la sala "' + roomId + '" (encriptado)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Una aplicación real se conectaría al servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando a la sala "' + roomId + '" (sin encriptado)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hola')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectando de la sala "' + roomId + '" (sin encriptado)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
