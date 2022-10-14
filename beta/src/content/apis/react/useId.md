---
title: useId
---

<Intro>

`useId` es un Hook de React para generar IDs unicos que se puede pasar a los atributos de accesibilidad.


```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

<Pitfall>

**No utilices `useId` para generar keys en una lista.** [Las keys deben generarse a partir de sus datos.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Generación de ID únicos para atributos de accesibilidad {/*generating-unique-ids-for-accessibility-attributes*/}

Llame a `useId` en el nivel superior de su componente para generar una ID única:

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

[Atrbutos de accesibilidad HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) como [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) le permite especificar que dos etiquetas están relacionadas entre sí. Por ejemplo, puede especificar que un determinado elemento (como una entrada) sea descrito por otro elemento (como un párrafo).

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

Sin embargo, utliziar identificaciones como este no es una buena práctica en React. Un componente puede representarse más de una vez en la página, ¡pero las ID tienen que ser únicas! En lugar de utliziar una ID, puede generar una ID única con `useId`:

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

Ahora, incluso si `PasswordField` aparece varias veces en la pantalla, las identificaciones generadas no chocarán.

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

[Mira este video](https://www.youtube.com/watch?v=0dNzNcuEuOo) para ver la diferencia en la experiencia del usuario con tecnologías de asistencia.

<Pitfall>

**`useId` requiere un árbol de componentes idéntico en el servidor y el cliente** cuando cuando utiliza [server rendering](/apis/react-dom/server). Si los árboles que se representan en el servidor y el cliente no coinciden exactamente, las ID generadas no coincidirán.

</Pitfall>

<DeepDive title="Por qué useId es mejor que un contador incremental?">

Quizás se pregunte por qué `useId` es mejor que incrementar una variable global como `nextId++`.

El principal beneficio de `useId` es que React asegura que funciona con [server rendering.](/apis/react-dom/server) Durante el server rendering, sus componentes generan salida HTML. Mas tarde, en el cliente [hydrate](/apis/react-dom/client/hydrateRoot) adjunta sus controladores de eventos al HTML generado. Para que la hidratación funcione, la salida del cliente debe coincidir con el HTML del servidor.

Esto es muy difícil de garantizar con un contador incremental porque el orden en que se hidratan los componentes del cliente puede no coincidir con el orden en que se emitió el HTML del servidor. Al llamar a `useId`, te aseguras de que la hidratación funcionará y la salida coincidirá entre el servidor y el cliente.

Dentro de React, `useId` se genera a partir de la "ruta principal" del componente llamado. Esta es la razón por la que, si el cliente y el árbol del servidor son iguales, la "ruta principal" coincidirá independientemente del orden de representación.

</DeepDive>

---

### Generar ID para varios elementos relacionados {/*generating-ids-for-several-related-elements*/}

Si necesita proporcionar ID a varios elementos relacionados, puede llamar a `useId` para generar un prefijo compartido para ellos:

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

Esto le permite evitar llamar a `useId` para cada elemento que necesita una identificación única.

---

### Especificación de un prefijo compartido para todas las ID generadas {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Si renderiza varias aplicaciones React independientes en una sola página, puede pasar `identifierPrefix` como una opción para las llamadas [`createRoot`](/apis/react-dom/client/createRoot#parameters) o [`hydrateRoot`](/apis/react-dom/client/hydrateRoot). Esto garantiza que los ID generados por las dos aplicaciones diferentes nunca entren en conflicto porque cada identificador generado con `useId` comenzará con el prefijo distinto que haya especificado.

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

---

## Referencia {/*reference*/}

### `useId()` {/*useid*/}

Llame a `useId` en el nivel superior de su componente para generar una ID única:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Vea más ejemplos arriba.](#usage)

#### Parametros {/*parameters*/}

`useId` no toma ningún parámetro.

#### Retorna {/*returns*/}

`useId` devuelve una cadena de ID única asociada con esta llamada `useId` llamado en un componente particular.

#### Advertencias {/*caveats*/}

* `useId` es un Hook, así que solo puedes llamarlo **en el nivel superior de su componente** o en tus propios hooks. No puedes llamarlo dentro de bucles o condiciones. Si lo necesita, extraiga un nuevo componente y mueva el estado a él.

* `useId` **no debe usarse para generar keys** en una lista. [Las keys deben generarse a partir de sus datos.](/learn/rendering-lists#where-to-get-your-key)
