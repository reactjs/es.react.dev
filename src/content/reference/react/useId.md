---
title: useId
---

<Intro>

`useId` es un Hook de React para generar IDs únicos que se pueden pasar a los atributos de accesibilidad.


```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `useId()` {/*useid*/}

Llama a `useId` en el nivel superior de tu componente para generar un ID único:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

`useId` no toma ningún parámetro.

#### Retorna {/*returns*/}

`useId` devuelve una cadena de ID única asociada con esta llamada `useId` llamado en un componente particular.

#### Advertencias {/*caveats*/}

* `useId` es un Hook, así que solo puedes llamarlo **en el nivel superior de tu componente** o en tus propios hooks. No puedes llamarlo dentro de bucles o condiciones. Si necesitas hacerlo, extrae un nuevo componente y mueve allí el estado.

* `useId` **no debe usarse para generar keys** en una lista. [Las keys deben generarse a partir de tus datos.](/learn/rendering-lists#where-to-get-your-key)

---

## Uso {/*usage*/}

<Pitfall>

**No utilices `useId` para generar keys en una lista.** [Las keys deben generarse a partir de tus datos.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Generación de ID únicos para atributos de accesibilidad {/*generating-unique-ids-for-accessibility-attributes*/}

Llama a `useId` en el nivel superior de tu componente para generar un ID único:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

A continuación, puedes pasar el <CodeStep step={1}>ID generado</CodeStep> a los diferentes atributos:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Veamos un ejemplo para ver cuándo es útil.**

[Atributos de accesibilidad HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) como [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) te permiten especificar que dos etiquetas están relacionadas entre sí. Por ejemplo, puedes especificar que un determinado elemento (como una entrada de texto) sea descrito por otro elemento (como un párrafo).

En HTML normal, lo escribirías así:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

Sin embargo, escribir IDs fijos como este no es una buena práctica en React. Un componente puede renderizarse más de una vez en la página, ¡pero los IDs tienen que ser únicos! En lugar de utilizar un ID fijo, puedes generar un ID único con `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

Ahora, incluso si `PasswordField` aparece varias veces en la pantalla, no habrá conflicto entre los IDs generados.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Mira este video](https://www.youtube.com/watch?v=0dNzNcuEuOo) para ver la diferencia en la experiencia de usuario con tecnologías de asistencia.

<Pitfall>

**`useId` requiere un árbol de componentes idéntico en el servidor y el cliente** cuando utilizas [renderizado en el servidor](/reference/react-dom/server). Si los árboles que se renderizan en el servidor y el cliente no coinciden exactamente, los IDs generados no coincidirán.

</Pitfall>

<DeepDive>

#### ¿Por qué useId es mejor que un contador incremental? {/*why-is-useid-better-than-an-incrementing-counter*/}

Puede que te preguntes por qué `useId` es mejor que incrementar una variable global como `nextId++`.

El principal beneficio de `useId` es que React se asegura de que funcione con el [renderizado en el servidor.](/reference/react-dom/server) Durante el renderizado en el servidos, tus componentes generan salida HTML. Más tarde, en el cliente, [la hidratación](/reference/react-dom/client/hydrateRoot) adjunta tus controladores de eventos al HTML generado. Para que la hidratación funcione, la salida del cliente debe coincidir con el HTML del servidor.

Esto es muy difícil de garantizar con un contador incremental porque el orden en que se hidratan los componentes del cliente puede no coincidir con el orden en que se emitió el HTML del servidor. Al llamar a `useId`, te aseguras de que la hidratación funcionará y la salida coincidirá entre el servidor y el cliente.

Dentro de React, `useId` se genera a partir de la "ruta del padre" del componente llamado. Esta es la razón por la que, si el cliente y el árbol del servidor son iguales, la "ruta del padre" coincidirá independientemente del orden del renderizado.

</DeepDive>

---

### Generar IDs para varios elementos relacionados {/*generating-ids-for-several-related-elements*/}

Si necesitas proporcionar IDs a varios elementos relacionados, puedes llamar a `useId` para generar un prefijo compartido para ellos:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Esto te permite evitar llamar a `useId` para cada elemento que necesite un ID único.

---

### Especificación de un prefijo compartido para todos los IDs generados {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Si renderizas varias aplicaciones de React independientes en una sola página, puedes pasar `identifierPrefix` como una opción para las llamadas [`createRoot`](/reference/react-dom/client/createRoot#parameters) o [`hydrateRoot`](/reference/react-dom/client/hydrateRoot). Esto garantiza que los IDs generados por las dos aplicaciones diferentes nunca entren en conflicto porque cada identificador generado con `useId` comenzará con el prefijo distinto que hayas especificado.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

