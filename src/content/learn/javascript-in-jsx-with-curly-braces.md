---
title: JavaScript en JSX con llaves
---

<Intro>

JSX te permite escribir marcas similares a HTML dentro de un archivo JavaScript, manteniendo la lógica de renderizado y el contenido en el mismo lugar. A veces vas a querer agregar un poco de lógica JavaScript o hacer referencia a una propiedad dinámica dentro de ese marcado. En esta situación, puedes usar llaves en tu JSX para abrir una ventana a JavaScript.

</Intro>

<YouWillLearn>

* Cómo pasar strings con comillas
* Cómo hacer referencia a una variable de JavaScript dentro de JSX con llaves
* Cómo llamar una función de JavaScript dentro de JSX con llaves
* Cómo usar un objeto de JavaScript dentro de JSX con llaves

</YouWillLearn>

## Pasando strings con comillas {/*passing-strings-with-quotes*/}

Cuando desees pasar un atributo string a JSX, lo pones entre comillas simples o dobles:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Aquí, `"https://i.imgur.com/7vQD0fPs.jpg"` y `"Gregorio Y. Zara"` están siendo pasados como strings.

Pero, ¿qué sucede si quieres especificar dinámicamente el texto `src` o `alt`? Puedes **usar un valor de JavaScript reemplazando las comillas de apertura `"` y de cierre `"` con las llaves de apertura `{` y de cierre `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Observa la diferencia entre `className="avatar"`, que especifica un nombre de clase CSS `"avatar"` que hace que la imagen sea redonda, y `src={avatar}` que lee el valor de una variable JavaScript llamada `avatar`. ¡Eso es porque las llaves te permiten trabajar con JavaScript allí mismo en tu marcado!.

## Usando llaves: Una ventana al mundo de JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX es una forma especial de escribir JavaScript. Eso significa que es posible utilizar JavaScript dentro de él, con llaves `{ }`. El ejemplo siguiente declara primero un nombre para el científico, `name`, y luego lo inserta con llaves dentro de `<h1>`:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>Lista de tareas pendientes de {name}</h1>
  );
}
```

</Sandpack>

Intenta cambiar el valor de `name` de `'Gregorio Y. Zara'` a `'Hedy Lamarr'`. ¿Ves cómo cambia el título de la lista de tareas pendientes?

Cualquier expresión JavaScript funcionará entre llaves, incluidas las llamadas a funciones como `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'es-ES',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>Lista de tareas pendientes del {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Dónde usar llaves {/*where-to-use-curly-braces*/}

Solo puedes usar llaves de dos maneras dentro de JSX:

1. **Como texto** directamente dentro de una etiqueta JSX: `<h1>Lista de tareas pendientes de {name}</h1>` funcionará, pero `<{tag}>Lista de tareas pendientes de Gregorio Y. Zara</{tag}>` no lo hará.
2. **Como atributos** inmediatamente después del signo `=`: `src={avatar}` leerá la variable `avatar`, pero `src="{avatar}"` pasará el string `"{avatar}"`.  

## Usando "llaves dobles": CSS y otros objetos en JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Además de strings, números, y otras expresiones de JavaScript, incluso puedes pasar objetos en JSX. Los objetos también se indican con llaves, como `{ name: "Hedy Lamarr", inventions: 5 }`. Por lo tanto, para pasar un objeto de JavaScript en JSX, debes envolver el objeto en otro par de llaves: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Puedes ver esto con estilos en línea CSS, en JSX. React no requiere que uses estilos en línea (las clases CSS funcionan muy bien para la mayoría de los casos). Pero cuando necesitas un estilo en línea, pasas un objeto al atributo `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Intenta cambiar los valores de `backgroundColor` y `color`.

Realmente puedes ver el objeto JavaScript dentro de las llaves cuando lo escribes así:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

La próxima vez que veas `{{` y `}}` en JSX, ¡sabe que no es más que un objeto dentro de las llaves JSX!

<Pitfall>

Las propiedades de `style` en línea se escriben en camelCase. Por ejemplo, el HTML `<ul style="background-color: black">` se escribiría como `<ul style={{ backgroundColor: 'black' }}>` en tu componente.

</Pitfall>

## Más diversión con objetos de JavaScript y llaves {/*more-fun-with-javascript-objects-and-curly-braces*/}

Puedes mover varias expresiones a un objeto, y hacer referencia a ellas en tu JSX dentro de llaves:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Tareas pendientes de {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

En este ejemplo, el objeto JavaScript `person` contiene un string `name` y un objeto `theme`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

El componente puede usar estos valores de `person` así:

```js
<div style={person.theme}>
  <h1>Tareas pendientes de {person.name}</h1>
```

JSX es muy mínimo como lenguaje de plantillas porque te permite organizar datos y lógica usando JavaScript. 

<Recap>

Ahora ya sabes casi todo sobre JSX:

* Los atributos de JSX dentro de comillas son pasados como strings.
* Las llaves te permiten meter lógica y variables de JavaScript en tu mercado.
* Funcionan dentro del contenido de la etiqueta JSX o inmediatamente después de `=` en los atributos.
* `{{` y `}}` no es una sintaxis especial: es un objeto JavaScript metido dentro de llaves JSX. 

</Recap>

<Challenges>

#### Arreglar el error {/*fix-the-mistake*/}

Este código se bloquea con un error que dice `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Tareas pendientes de {person}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

¿Puedes encontrar el problema?

<Hint>Busca lo que hay dentro de las llaves. ¿Estamos poniendo lo correcto ahí?</Hint>

<Solution>

Esto sucede porque este ejemplo renderiza *un objeto en sí* en el marcado en lugar de un string: `<h1>Tareas pendientes de {person}</h1>`¡está tratando de renderizar todo el objeto `person`!. Incluir objetos sin procesar como contenido de texto arroja un error porque React no sabe cómo quieres mostrarlos.

Para arreglarlo, reemplaza `<h1>Tareas pendientes de {person}</h1>` con `<h1>Tareas pendientes de {person.name}</h1>`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Tareas pendientes de {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Extraer información hacia un objeto {/*extract-information-into-an-object*/}

Extrae la URL de la imagen hacia el objeto `person`.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Tareas pendientes de {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Mueve la URL de la imagen a una propiedad llamada `person.imageUrl` y léela desde la etiqueta `<img>` usando las llaves:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Tareas pendientes de {person.name}</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Escribe una expresión dentro de llaves JSX {/*write-an-expression-inside-jsx-curly-braces*/}

En el objeto a continuación, la URL de la imagen completa está dividida en 4 partes: la URL de base, `imageId`, `imageSize` y la extensión del archivo.

Queremos que la URL de la imagen combine estos atributos juntos: la URL de base (siempre `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), y la extensión del archivo (siempre `'.jpg'`). Sin embargo, algo está mal con la forma en que la etiqueta `<img>` especifica su `src`.

¿Puedes arreglarlo?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Tareas pendientes de {person.name}</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Para verificar que tu solución funcionó, intenta cambiar el valor de `imageSize` a `'b'`. La imagen debería cambiar de tamaño después de tu edición.

<Solution>

Puedes escribirlo como `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` abre la expresión de JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` produce el string URL correcto.
3. `}` cierra la expresión de JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Tareas pendientes de {person.name}</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

También puedes mover esta expresión en una función separada como `getImageUrl` a continuación:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Tareas pendientes de {person.name}</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
      <li>Mejorar el videoteléfono</li>
      <li>Preparar clases de aeronáutica</li>
      <li>Trabajar en el motor de alcohol</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

¡Las variables y funciones pueden ayudarte a mantener el marcado simple!

</Solution>

</Challenges>
