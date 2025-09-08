---
title: "'use server'"
titleForTitleTag: "Directiva 'use server'"
---

<RSC>

`'use server'` se utiliza con [React Server Components](/reference/rsc/server-components).

</RSC>

<Intro>

`'use server'` marca funciones del lado del servidor que pueden llamarse desde el código del lado del cliente.

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `'use server'` {/*use-server*/}

Añade `'use server'` al principio del cuerpo de una función asíncrona para marcar la función como invocable desde el cliente. Llamamos a estas funciones [_Server Functions_](/reference/rsc/server-functions).

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

Cuando se llama a una Server Function desde el cliente, se realizará una petición de red al servidor que incluye una copia serializada de cualquier argumento pasado. Si la Server Function devuelve un valor, ese valor será serializado y devuelto al cliente.

En lugar de marcar funciones individualmente con `'use server'`, puedes añadir la directiva al principio de un archivo para marcar todas las funciones exportadas dentro de ese archivo como Server Functions, que pueden usarse en cualquier lugar, inclusive en código cliente.

#### Advertencias {/*caveats*/}
* `'use server'` debe estar al principio de su función o módulo; por encima de cualquier otro código incluyendo importaciones (los comentarios por encima de las directivas están permitidos). Deben escribirse con comillas simples o dobles, no con comillas invertidas.
* `'use server'` solo puede usarse en archivos del lado del servidor. Las Server Functions resultantes pueden pasarse a Client Components a través de props. Consulta los [tipos compatibles para serialización](#serializable-parameters-and-return-values).
* Para importar Server Functions desde [código cliente](/reference/rsc/use-client), la directiva debe usarse a nivel de módulo.
* Debido a que las llamadas de red subyacentes son siempre asíncronas, `'use server'` solo puede usarse en funciones asíncronas.
* Siempre trata los argumentos de las Server Functions como entradas no confiables y autoriza cualquier mutación. Consulta [consideraciones de seguridad](#security).
* Las Server Functions deben llamarse en una [Transición](/reference/react/useTransition). Las Server Functions pasadas a [`<form action>`](/reference/react-dom/components/form#props) o [`formAction`](/reference/react-dom/components/input#props) se llamarán automáticamente en una transición.
* Las Server Functions están diseñadas para mutaciones que actualizan el estado del servidor; no se recomiendan para la obtención de datos. En consecuencia, los frameworks que implementan Server Functions típicamente procesan una acción a la vez y no tienen una forma de almacenar en caché el valor de retorno.

### Consideraciones de seguridad {/*security*/}

Los argumentos de las Server Functions están completamente controlados por el cliente. Por seguridad, siempre trátalos como entradas no confiables y asegúrate de validar y escapar los argumentos según corresponda.

En cualquier Server Function, asegúrate de validar que el usuario conectado está autorizado para realizar esa acción.

<Wip>

Para evitar el envío de datos sensibles desde una Server Function, hay APIs experimentales de taint para evitar que valores y objetos únicos se pasen al código cliente.

Consulta [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) y [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Argumentos y valores de retorno serializables {/*serializable-parameters-and-return-values*/}

Dado que el código cliente llama a la Server Function a través de la red, cualquier argumento pasado necesitará ser serializable.

Aquí están los tipos compatibles para argumentos de Server Functions:

* Primitivos
	* [string](https://developer.mozilla.org/es/docs/Glossary/String)
	* [number](https://developer.mozilla.org/es/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/es/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/es/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/es/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Symbol), solo símbolos registrados en el registro global de Symbol mediante [`Symbol.for`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables que contienen valores serializables
	* [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) y [ArrayBuffer](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Instancias de [FormData](https://developer.mozilla.org/es/docs/Web/API/FormData)
* [Objetos](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) planos: aquellos creados con [inicializadores de objeto](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Object_initializer), con propiedades serializables
* Funciones que son Server Functions
* [Promises](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notablemente, estos no son compatibles:
* Elementos de React, o [JSX](/learn/writing-markup-with-jsx)
* Funciones, incluyendo funciones de componente o cualquier otra función que no sea una Server Function
* [Clases](https://developer.mozilla.org/es/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objetos que son instancias de cualquier clase (aparte de las incorporadas mencionadas) u objetos con [un prototipo nulo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Símbolos no registrados globalmente, ej. `Symbol('my new symbol')`
* Eventos de controladores de eventos.

Los valores de retorno serializables compatibles son los mismos que las [props serializables](/reference/rsc/use-client#passing-props-from-server-to-client-components) para una barrera de Client Component.

<<<<<<< HEAD
## Uso {/*usage*/}
=======
Supported serializable return values are the same as [serializable props](/reference/rsc/use-client#serializable-types) for a boundary Client Component.
>>>>>>> d34c6a2c6fa49fc6f64b07aa4fa979d86d41c4e8

### Server Functions en formularios {/*server-functions-in-forms*/}

El caso de uso más común de las Server Functions será llamar a funciones que mutan datos. En el navegador, el [elemento HTML form](https://developer.mozilla.org/es/docs/Web/HTML/Element/form) es el enfoque tradicional para que un usuario envíe una mutación. Con React Server Components, React introduce soporte de primera clase para Server Functions como Acciones en [formularios](/reference/react-dom/components/form).

Aquí hay un formulario que permite solicitar un nombre de usuario.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

En este ejemplo `requestUsername` es una Server Function pasada a un `<form>`. Cuando un usuario envía este formulario, hay una petición de red a la función del servidor `requestUsername`. Al llamar a una Server Function en un formulario, React proporcionará el [FormData](https://developer.mozilla.org/es/docs/Web/API/FormData) del formulario como el primer argumento de la Server Function.

Al pasar una Server Function a la `action` del formulario, React puede [mejorar progresivamente](https://developer.mozilla.org/es/docs/Glossary/Progressive_Enhancement) el formulario. Esto significa que los formularios pueden enviarse antes de que se cargue el bundle de JavaScript.

#### Manejo de valores de retorno en formularios {/*handling-return-values*/}

En la solicitud del formulario podría estar la posibilidad de que un nombre de usuario no esté disponible. `requestUsername` debería decirnos si falla o no.

Para actualizar la UI en base al resultado de una Server Function mientras se soporta mejora progresiva, usa [`useActionState`](/reference/react/useActionState).

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

Ten en cuenta que como la mayoría de los Hooks, `useActionState` solo puede llamarse en [código cliente](/reference/rsc/use-client).

### Llamar a una Server Function fuera de `<form>` {/*calling-a-server-function-outside-of-form*/}

Las Server Functions son endpoints del servidor expuestos y pueden llamarse desde cualquier lugar en el código cliente.

Cuando uses una Server Function fuera de un [formulario](/reference/react-dom/components/form), llama a la Server Function en una [Transición](/reference/react/useTransition), lo que te permite mostrar un indicador de carga, mostrar [actualizaciones de estado optimistas](/reference/react/useOptimistic), y manejar errores inesperados. Los formularios envolverán automáticamente las Server Functions en transiciones.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

Para leer un valor de retorno de una Server Function, necesitas usar `await` en la promesa que retorna.