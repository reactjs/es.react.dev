---
title: useOptimistic
---

<Intro>

`useOptimistic` es un Hook de React que te permite actualizar la interfaz de usuario / UI de manera optimista.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` es un Hook de React que permite mostrar un estado diferente mientras una acción asíncrona está en marcha. Acepta algún estado como argumento y devuelve una copia de ese estado que puede ser diferente durante la duración de una acción asíncrona como una petición de red. Provees una función que toma el estado actual y la entrada de la acción, y retorna el estado optimista para ser usado mientras la acción esté pendiente.

Este estado es llamado el estado "optimista" porque normalmente es usado para presentar inmediatamente al usuario el resultado de una acción, aunque la acción en realidad tarde tiempo para completarse.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // combinado y devuelve el nuevo estado
      // con el valor optimista
    }
  );
}
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `state`: el valor que se devolverá inicialmente y siempre que no haya acción pendiente.
* `updateFn(currentState, optimisticValue)`: una función que toma el estado actual y el valor optimista pasado a `addOptimistic` y devuelve el estado optimista resultante. Debe ser una función pura. `updateFn` toma dos parámetros. El `currentState` y el `optimisticValue`. El valor resultante será el valor combinado de `currentState` y `optimisticValue`.


#### Devuelve {/*returns*/}

* `optimisticState`: El estado optimista resultante. Es igual al estado a menos que una acción esté pendiente, en cuyo caso es igual al valor devuelto por `updateFn`.
* `addOptimistic`: `addOptimistic` es la función despachadora a llamar cuando tienes una actualización optimista. Toma un parámetro, `optimisticValue`, de cualquier tipo y llamará a `updateFn` con `state` `optimisticValue`.

---

## Uso {/*usage*/}

### Actualización optimista de formularios {/*optimistically-updating-with-forms*/}

El Hook `useOptimistic` provee una manera optimista de actualizar la interfaz de usuario antes de que una operación en segundo plano se complete, como una petición de red. En el contexto de los formularios, esta técnica ayuda a que las aplicaciones se sientan más receptivas. Cuando un usuario envía un formulario, en lugar de esperar la respuesta del servidor para reflejar los cambios, la interfaz se actualiza inmediatamente con el resultado esperado.

Por ejemplo, cuando un usuario escribe un mensaje en el formulario y luego presiona el botón de "Enviar", el Hook `useOptimistic` permite al mensaje aparecer inmediatamente en la lista con un label de "Enviando...", incluso antes que el mensaje sea enviado al servidor. Este enfoque  "optimista" da la impresión de velocidad y capacidad de respuesta. Luego, el formulario intenta enviar realmente el mensaje en segundo plano. Una vez que el servidor confirme que el mensaje ha sido recibido, el label "Enviando..." se elimina.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();
  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Enviando...)</small>}
        </div>
      ))}
<<<<<<< HEAD
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hola!" />
        <button type="submit">Enviar</button>
      </form>
=======
      
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "¡Hola!", sending: false, key: 1 }
  ]);
  async function sendMessageAction(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage }, ...messages]);
    })
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


</Sandpack>
