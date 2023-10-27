---
title: experimental_taintUniqueValue
---

<Wip>

**Esta API es experimental y aún no está disponible en una versión estable de React.**

Puedes intentarlo actualizando los paquetes de React a la versión experimental más reciente:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Las versiones experimentales de React pueden contener errores. No las utilices en producción.

Esta API solo está disponible dentro de [React Server Components](/reference/react/use-client).

</Wip>


<Intro>

`taintUniqueValue` Te permite evitar que se pasen valores únicos a componentes del cliente, como contraseñas, claves o tokens.

```js
taintUniqueValue(errMessage, lifetime, value)
```

Para evitar pasar un objeto que contenga datos sensibles, consulta [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Llama a `taintUniqueValue` con una contraseña, token, clave o hash para registrarlo en React como algo que no debe permitirse pasar al cliente tal cual:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass secret keys to the client.',
  process,
  process.env.SECRET_KEY
);
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `message`: El mensaje que deseas mostrar si se pasa `value` a un componente del cliente. Este mensaje se mostrará como parte del error que se generará si `value` se pasa a un componente del cliente.

* `lifetime`: Cualquier objeto que indique cuánto tiempo debe permanecer marcado `value`. `value` será bloqueado para que no se envíe a ningún componente del cliente mientras este objeto siga existiendo. Por ejemplo, pasar `globalThis` bloquea el valor durante la duración de una aplicación. `lifetime` suele ser un objeto cuyas propiedades contienen `value`.

* `value`: Una cadena, bigint o TypedArray. `value` debe ser una secuencia única de caracteres o bytes con una alta entropía, como un token criptográfico, una clave privada, un hash o una contraseña larga. `value` será bloqueado para que no se envíe a ningún componente del cliente.

#### Returns {/*returns*/}

`experimental_taintUniqueValue` returns `undefined`.

#### Caveats {/*caveats*/}

- Derivar nuevos valores a partir de valores marcados puede comprometer la protección del marcado. Los nuevos valores creados al convertir en mayúsculas valores marcados, concatenar valores de cadena marcados en una cadena más grande, convertir valores marcados en base64, obtener subcadenas de valores marcados y otras transformaciones similares no están marcados a menos que llames explícitamente a `taintUniqueValue` en estos valores recién creados.

---

## Usage {/*usage*/}

### Prevent a token from being passed to Client Components {/*prevent-a-token-from-being-passed-to-client-components*/}

Para garantizar que información sensible como contraseñas, tokens de sesión u otros valores únicos no se pasen involuntariamente a componentes del cliente, la función `taintUniqueValue` proporciona una capa de protección. Cuando un valor está marcado, cualquier intento de pasarlo a un componente del cliente resultará en un error.

El argumento lifetime define la duración durante la cual el valor permanece marcado. Para valores que deben permanecer marcados indefinidamente, objetos como [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) o `process` pueden servir como el argumento `lifetime`. Estos objetos tienen una vida útil que abarca toda la duración de la ejecución de tu aplicación.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass a user password to the client.',
  globalThis,
  process.env.SECRET_KEY
);
```

Si la vida útil del valor marcado está ligada a un objeto, el argumento `lifetime` debe ser el objeto que encapsula el valor. Esto garantiza que el valor marcado permanezca protegido durante toda la vida útil del objeto que lo encapsula.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Do not pass a user session token to the client.',
    user,
    user.session.token
  );
  return user;
}
```

En este ejemplo, el objeto `user` actúa como el argumento `lifetime. Si este objeto se almacena en una caché global o es accesible mediante otra solicitud, el token de sesión permanece marcado.

<Pitfall>

**Do not rely solely on tainting for security.** El marcado de un valor no bloquea todos los valores derivados posibles. Por ejemplo, crear un nuevo valor convirtiendo en mayúsculas una cadena marcada no marcará el nuevo valor.


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Do not pass the password to the client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` is not tainted
```

En este ejemplo, la constante `password` está marcada. Luego, `password` se utiliza para crear un nuevo valor, `uppercasePassword`, llamando al método `toUpperCase` en `password`. El nuevo valor creado, `uppercasePassword`, no está marcado.

Otras formas similares de derivar nuevos valores a partir de valores marcados, como la concatenación en una cadena más grande, la conversión a base64 o la obtención de una subcadena, crean valores no marcados.

El marcado protege solo contra errores simples, como pasar explícitamente valores secretos al cliente. Errores en la llamada a `taintUniqueValue`, como usar un almacén global fuera de React sin el objeto de duración correspondiente, pueden hacer que el valor marcado deje de estar marcado. El marcado es una capa de protección; una aplicación segura tendrá múltiples capas de protección, APIs bien diseñadas y patrones de aislamiento.


</Pitfall>

<DeepDive>

#### Using `server-only` and `taintUniqueValue` to prevent leaking secrets {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

Si estás ejecutando un entorno de Componentes del Servidor que tiene acceso a claves privadas o contraseñas, como contraseñas de bases de datos, debes tener cuidado de no pasar eso a un Componente del Cliente.

```js
export async function Dashboard(props) {
  // DO NOT DO THIS
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

Este ejemplo filtraría el token de API secreto al cliente. Si este token de API puede utilizarse para acceder a datos a los que este usuario en particular no debería tener acceso, podría dar lugar a una brecha de datos.

[comment]: <> (TODO: Link to `server-only` docs once they are written)

Idealmente, los secretos como este se abstraen en un solo archivo de ayuda que solo puede ser importado por utilidades de datos de confianza en el servidor. El archivo de ayuda incluso puede estar etiquetado con [`server-only`](https://www.npmjs.com/package/server-only) para asegurarse de que este archivo no sea importado en el cliente.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

A veces, los errores ocurren durante la refactorización y es posible que no todos tus colegas estén al tanto de esto. 
Para protegerse contra estos errores en el futuro, podemos "marcar" la contraseña real:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.'
  process,
  process.env.API_PASSWORD
);
```

Ahora, siempre que alguien intente pasar esta contraseña a un Componente del Cliente o enviar la contraseña a un Componente del Cliente con una Acción del Servidor, se generará un error con el mensaje que definiste al llamar a `taintUniqueValue`.

</DeepDive>

---
