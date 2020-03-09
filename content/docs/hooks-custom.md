---
id: hooks-custom
title: Construyendo tus propios Hooks
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

Los *Hooks* son una nueva incorporación en React 16.8. Te permiten usar estado y otras características de React sin escribir una clase.

Construir tus propios Hooks te permite extraer la lógica del componente en funciones reutilizables.

Cuando estábamos aprendiendo a [usar el Hook de Efecto](/docs/hooks-effect.html#example-using-hooks-1), vimos este componente de una aplicación de chat que muestra un mensaje indicando si un amigo está conectado o desconectado:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Supongamos ahora que nuestra aplicación de chat tiene también una lista de contactos y queremos que renderice nombres de usuarios con color verde. Podríamos copiar y pegar la lógica adaptada a nuestro componente `FriendListItem`, pero eso no sería ideal:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

En cambio, nos gustaría compartir esta lógica entre `FriendStatus` y `FriendListItem`.

Tradicionalmente en React, hemos tenido dos formas populares para compartir lógica de estados entre componentes: [renderizar props](/docs/render-props.html) y [componentes de orden mas alto](/docs/higher-order-components.html). Ahora veremos como los Hooks resuelven muchos de los mismos problemas sin forzarte a añadir más componentes al árbol.

## Extrayendo un Hook personalizado {#extracting-a-custom-hook}

Cuando queremos compartir lógica entre dos funciones de JavaScript, lo extraemos en una tercera función. Ambos, componentes y Hooks, son funciones, ¡así que esto funciona para ellos también!

**Un Hook personalizado es una función de JavaScript cuyo nombre comienza con "`use`" y que puede llamar a otros Hooks.** Por ejemplo, a continuación `useFriendStatus` es nuestro primer Hook personalizado:

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

No hay nada nuevo dentro, la lógica es copiada de los componentes anteriores. Al igual que en un componente, asegúrate de solo llamar a otros Hooks incondicionalmente en el nivel superior de tu Hook personalizado.

A diferencia de un componente de React, un Hook personalizado no necesita tener una firma específica. Podemos decidir lo que adopta como argumentos y que, si lo hace, debería devolver. En otras palabras, es como una función normal. Su nombre debería siempre empezar con `use` así se puede decir que de un vistazo las [reglas de Hooks](/docs/hooks-rules.html) se le aplican.

El propósito de nuestro Hook `useFriendStatus` es suscribirnos al estado de un amigo. Por esto toma a `friendID` como un argumento, y devuelve si este amigo está conectado:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Ahora veamos como podemos usar nuestro Hook personalizado.

## Usando un Hook personalizado {#using-a-custom-hook}

Al principio, nuestro objetivo declarado fue eliminar la lógica duplicada de los componentes `FriendStatus` y `FriendListItem`. Ambos quieren saber cuando un amigo está conectado.

Ahora que hemos extraído esta lógica a un Hook `useFriendStatus`, podemos *usarlo:*

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**¿Es este código equivalente a los ejemplos originales?** Sí, funciona exactamente de la misma forma. Si miras de cerca, notarás que no hicimos cambios en el comportamiento. Todo lo que hicimos fue extraer código común entre dos funciones en una función separada. **Los Hooks personalizados son una convención que surge naturalmente del diseño de los Hooks, en lugar de una característica de React.**

**¿Tengo que nombrar mis Hooks personalizados comenzando con "`use`"?** Por favor, hazlo. Esta convención es muy importante. Sin esta, no podríamos comprobar automáticamente violaciones de [ las reglas de los Hooks](/docs/hooks-rules.html) porque no podríamos decir si una cierta función contiene llamados a Hooks dentro de la misma.

**¿Dos componentes usando el mismo Hook comparten estado?** No. Los Hooks personalizados son un mecanismo para reutilizar *lógica de estado* (como configurar una suscripción y recordar el valor actual), pero cada vez que usas un Hook personalizado, todo estado y efecto dentro de este son aislados completamente.

**¿Cómo un Hook personalizado obtiene un estado aislado?** Cada *llamada* al Hook obtiene un estado aislado. Debido a que llamamos `useFriendStatus` directamente, desde el punto de vista de React nuestro componente llama a `useState` y `useEffect`. Y como [ aprendimos](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) [anteriormente](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) podemos llamar a `useState` y a ` useEffect` muchas veces en un componente y ellos van a ser completamente independientes.

### Truco: Pasa información entre Hooks {#tip-pass-information-between-hooks}

Ya que los Hooks son funciones, podemos pasar información entre ellos.

Para demostrar esto, vamos a usar otro componente de nuestro hipotético ejemplo de chat. Este es un selector del destinatario del mensaje de chat que muestra si el amigo seleccionado está conectado:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Mantenemos el amigo seleccionado actual en la variable de estado `recipientID`, y la actualizamos si el usuario elige a un amigo diferente en el selector `<select>`.

Como la llamada al Hook `useState` nos da el último valor de la variable de estado `recipientID`, podemos pasarla a nuestro Hook personalizado `useFriendStatus` como un argumento:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Esto nos permite saber cuándo el amigo *actualmente seleccionado* está en línea. Si elegimos un amigo diferente y actualizamos la variable de estado `recipientID`, nuestro Hook `useFriendStatus` eliminará su suscripción del amigo previamente seleccionado, y se suscribirá al estado del nuevo seleccionado.

## `usaTuImaginación()` {#useyourimagination}

Los Hooks personalizados ofrecen la flexibilidad de compartir lógica que no era posible antes con los componentes de React. Puedes escribir Hooks personalizados que cubran una amplia gama de casos de uso, como manejo de formularios, animación, suscripciones declarativas, temporizadores y probablemente muchos más que no hemos considerado. Además, puedes construir Hooks que sean tan fáciles de usar como las características integradas de React.

Intenta resistirte a añadir abstracción demasiado pronto. Ahora que los componentes funcionales pueden hacer más, es probable que el promedio de componentes funcionales en tu base de código se amplíe. Esto es normal, no te sientas como si *tuvieras* que dividirlo inmediatamente en Hooks. Pero también te animamos a empezar a descubrir casos donde un Hook personalizado podría ocultar la lógica compleja detrás de una interfaz simple, o ayudar a desenredar un componente desordenado.

Por ejemplo, quizás tienes un componente complejo que contiene gran cantidad de estado local que es gestionado en una forma *ad-hoc*. `useState` no hace más fácil la centralización de la lógica de actualización, así que podrías preferir escribirlo como un reductor [Redux](https://redux.js.org/):

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... otras acciones ...
    default:
      return state;
  }
}
```

Los reductores son muy convenientes para probar en aislamiento y escalar para expresar una lógica de actualización compleja. Puedes separarlos aun más en reductores más pequeños si es necesario. Sin embargo, es posible que también te gusten los beneficios de usar el estado local de React, o puedes no querer instalar otra biblioteca.

¿Y si pudiéramos escribir un Hook `useReducer` que nos permita manejar el estado *local* de nuestro componente con un reductor? Una versión simplificada de esto podría verse así:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Ahora podríamos usarlo en nuestro componente y dejar que el reductor maneje la gestión del estado:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

La necesidad de gestionar estados locales con un reductor en un componente complejo es lo suficientemente común que hemos integrado el Hook `useReducer` dentro de React. Lo encontrarás, junto con otros Hooks integrados, en la [referencia a la API de Hooks](/docs/hooks-reference.html).
