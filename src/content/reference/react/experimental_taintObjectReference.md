---
title: experimental_taintObjectReference
---

<Wip>

**Esta API es experimental y aún no está disponible en una versión estable de React.**

Puedes probarla actualizando los paquetes de React a la versión experimental más reciente:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Las versiones experimentales de React pueden contener errores. No las uses en producción.

Esta API unicamente está disponible dentro de Componentes de Servidor en React

</Wip>


<Intro>

`taintObjectReference` te permite evitar que una instancia específica de objeto sea pasada a un Componente Cliente, como un objecto `user`.

```js
experimental_taintObjectReference(message, object);
```

Para prevenir el pasar una llave, hash o token, ver [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Llama a `taintObjectReference` con un objeto para registrarlo en React como algo que no debería permitirse pasar al Cliente tal cual:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `message`: El mensaje que deseas mostrar si el objeto se pasa a un Componente Cliente. Este mensaje se mostrará como parte del Error que se lanzará si el objeto se pasa a un Componente Cliente.



* `object`: El objeto a contaminar. Funciones e instancias de clases pueden ser pasadas a `taintObjectReference` como `object`. Las funciones y clases ya están bloqueadas para ser pasadas a Componentes Cliente, pero el mensaje de error predeterminado de React será reemplazado por lo que hayas definido en el `message`. Cuando una instancia específica de una matriz tipada se pasa a `taintObjectReference` como `object`, cualquier otra copia de la matriz tipada no será contaminada.

#### Devuelve {/*returns*/}

`experimental_taintObjectReference` devuelve `undefined`.

#### Caveats {/*caveats*/}

- Recrear o clonar un objeto contaminado crea un nuevo objeto no contaminado que puede contener datos sensibles. Por ejemplo, si tienes un objeto `user` contaminado, `const userInfo = {name: user.name, ssn: user.ssn}` o `{...user}` creará nuevos objetos que no estarán contamidos. `taintObjectReference` solo protege contra errores simples cuando el objeto se pasa sin cambios a un Componente Cliente.

<Pitfall>

**No confíes únicamente en la 'contaminación' para la seguridad.** No confíes únicamente en la 'contaminación' para la seguridad. Contaminar un objeto no evita la filtración de todos los valores derivados posibles. Por ejemplo, el clon de un objeto contaminado creará un nuevo objeto no contaminado. Usar datos de un objeto contaminado (e.j. `{secret: taintedObj.secret}`) creará un nuevo valor u objeto que no esté contaminado. La contaminación es una capa de protección; una aplicación segura tendrá múltiples capas de protección, APIs bien diseñadas y patrones de aislamiento.

</Pitfall>

---

## Uso {/*usage*/}

### Evita que los datos de usuario lleguen al cliente de manera no intencionada {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Un Componente Cliente nunca debería aceptar objetos que contengan datos sensibles. Idealmente, las funciones de obtención de datos no deberían exponer datos a los que el usuario actual no debería tener acceso. A veces, ocurren errores durante la refactorización. Para protegernos contra estos errores en el futuro, podemos 'contaminar' el objeto de usuario en nuestra API de datos.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

Ahora, cada vez que alguien intente pasar este objeto a un Componente Cliente, se lanzará un error con el mensaje de error proporcionado.

<DeepDive>

#### Protegiendo contra fugas en la obtención de datos. {/*protecting-against-leaks-in-data-fetching*/}

Si estás ejecutando un entorno de Componentes de Servidor que tiene acceso a datos sensibles, debes tener cuidado de no pasar objetos directamente:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

Idealmente, la función `getUser` no debería exponer datos a los que el `user` actual no debería tener acceso. Para evitar pasar el objeto de usuario a un Componente Cliente más adelante, podemos "contaminar" el objeto de usuario:


```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

Ahora, si alguien intenta pasar el objeto de `user` a un Componente Cliente, se lanzará un error con el mensaje de error proporcionado.

</DeepDive>
