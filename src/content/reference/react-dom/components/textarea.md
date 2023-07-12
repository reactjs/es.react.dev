---
title: "<textarea>"
---

<Intro>

El [componente `<textarea>` que viene integrado en el navegador](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea) te permite renderizar un input de texto multilínea.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `<textarea>` {/*textarea*/}

Para mostrar un text area, renderiza el componente [`<textarea>` que viene integrado en el navegador](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Ver más ejemplos abajo.](#usage)

#### Props {/*props*/}

`<textarea>` soporta todas [ las props comunes de los elementos.](/reference/react-dom/components/common#props)

Puedes [hacer un text area controlado](#controlling-a-text-area-with-a-state-variable) pasando la prop `value`:

* `value`: Un string. Controla el texto dentro del text area.

Cuando pasas `value`, también debes pasar un manejador `onChange` que actualice el valor proporcionado.

En cambio, si tu `<textarea>` no es controlado, puedes pasar la prop `defaultValue`:

* `defaultValue`: Un string. Especifica [el valor inicial](#providing-an-initial-value-for-a-text-area) para un text area.

Estas props de `<textarea>` son relevantes tanto para text areas controlados como no controlados:

* [`autoComplete`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-autocomplete): `'on'` u `'off'`. Especifica el comportamiento del autocompletado.
* [`autoFocus`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-autofocus): Un booleano. Si es `true`, React enfocará el elemento al montarlo.
* `children`: `<textarea>` no acepta hijos. Para establecer el valor inicial, usa `defaultValue`.
* [`cols`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-cols): Un número. Especifica la anchura por defecto en promedio de anchura de carácter. El valor por defecto es `20`.
* [`disabled`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-disabled): Un booleano. Si es `true`, el input no será interactivo y aparecerá atenuado.
* [`form`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-form): Un string. Especifica el `id` del `<form>` al que este input pertenece. Si es omitido, es el formulario padre más cercano.
* [`maxLength`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-maxlength): Un número. Especifica la longitud máxima del texto.
* [`minLength`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-minlength): Un número. Especifica la longitud mínima del texto.
* [`name`](https://developer.mozilla.org/es/docs/Web/HTML/Element/input#attr-name): Un string. Especifica el nombre para este input que es [enviado con el formulario.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: Una función [manejadora de eventos](/reference/react-dom/components/common#event-handler). Requerida para [text areas controlados.](#controlling-a-text-area-with-a-state-variable) Es ejecutada inmediatamente cuando el valor del input es modificado por el usuario (por ejemplo, es ejecutada con cada pulsación de tecla). Se comporta como el [evento `input`](https://developer.mozilla.org/es/docs/Web/API/HTMLElement/input_event) del navegador.
* `onChangeCapture`: Una versión de `onChange` que es ejecutada en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/es/docs/Web/API/HTMLElement/input_event): Una función [manejadora de eventos](/reference/react-dom/components/common#event-handler). Es ejecutada inmediatamente cuando el valor es cambiado por el usuario. Por razones históricas, en React es idiomático usar `onChange` en su lugar, el cual funciona de manera similar.
* `onInputCapture`: Una versión de `onInput` que es ejecutada en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/es/docs/Web/API/HTMLInputElement/invalid_event): Una función [manejadora de eventos](/reference/react-dom/components/common#event-handler). Es ejecutada si la validación de un input fracasa al enviar el formulario. A diferencia del evento `invalid` que viene integrado, el evento `onInvalid` de React se propaga.
* `onInvalidCapture`: Una versión de `onInvalid` que es ejecutado en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/es-US/docs/Web/API/HTMLTextAreaElement/select_event): Una función [manejadora de eventos](/reference/react-dom/components/common#event-handler). Es ejecutada después de que la selección dentro de `<textarea>` cambia. React extiende el evento `onSelect` para que también sea ejecutado para selecciones vacías y en ediciones (las cuales puede afectar la selección).
* `onSelectCapture`: Una versión de `onSelect` que es ejecutada en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-placeholder): Un string. Mostrado en un color atenuado cuando el valor del text area está vacío.
* [`readOnly`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-readonly): Un booleano. Si es `true`, el text area no puede ser editado por el usuario.
* [`required`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-required): Un booleano. Si es `true`, el valor debe ser proporcionado para que el formulario sea enviado.
* [`rows`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-rows): Un número. Especifica la altura por defecto en promedio de altura de carácter. El valor por defecto es `2`.
* [`wrap`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-wrap): `'hard'`, `'soft'`, u `'off'`. Especifica la manera en que el texto debe ser envuelto al enviar un form.

#### Advertencias {/*caveats*/}

- No es permitido pasar un hijo como `<textarea>algo</textarea>`. [Usa `defaultValue` para el contenido inicial.](#providing-an-initial-value-for-a-text-area)
- Si un text area recibe una prop `value` string, este será [tratado como controlado.](#controlling-a-text-area-with-a-state-variable)
- Un text area no puede ser controlado y no controlado a la vez.
- Un text area no puede alternar entre ser controlado o no controlado a lo largo de su vida.
- Todo text area controlado necesita un manejador de evento `onChange` que actualice su valor de manera síncrona.

---

## Uso {/*usage*/}

### Mostrar un text area {/*displaying-a-text-area*/}

Renderiza `<textarea>` para mostrar un text area. Puedes especificar su tamaño por defecto con los atributos [`rows`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-rows) y [`cols`](https://developer.mozilla.org/es/docs/Web/HTML/Element/textarea#attr-cols), pero por defecto el usuario será capaz de modificar su tamaño. Para deshabilitar la modificación de tamaño, puedes especificar `resize: none` en el CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Proporcionar un label para un text area {/*providing-a-label-for-a-text-area*/}

Típicamente, colocarás todos los `<textarea>` dentro de una etiqueta [`<label>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/label). Esto le indica al navegador que este label está asociado con ese text area. Cuando el usuario haga click en el label, el navegador enfocará el text area. Esto también es esencial para accesibilidad: un lector de pantallas anunciará el texto del label cuando el usuario enfoque el text area.

Si no puedes anidar el `<textarea>` dentro de un `<label>`, asócialos pasando el mismo identificador a `<textarea id>` y [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Para evitar conflictos entre instancias de un componente, genera un identificador con [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Proporcionar un valor inicial para un text area {/*providing-an-initial-value-for-a-text-area*/}

Opcionalmente puedes especificar el valor inicial de un text area. Pásalo a través de la prop `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

A diferencia de HTML, no es posible pasar el texto inicial como `<textarea>Algún contenido</textarea>`.

</Pitfall>

---

### Leer el valor de text area al enviar un formulario {/*reading-the-text-area-value-when-submitting-a-form*/}

 Agrega un [`<form>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/form) alrededor de tu text area con un [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit) dentro. Este llamará a tu manejador de evento `<form onSubmit>`. Por defecto, el navegador enviará los datos del formulario a el URL actual y actualizará la página. Puedes sobrescribir ese comportamiento llamando `e.preventDefault()`. Para leer los datos del formulario, usa [`new FormData(e.target)`](https://developer.mozilla.org/es/docs/Web/API/FormData).

<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Evita que el navegador actualice la página
    e.preventDefault();

    // Lee los datos del formulario
    const form = e.target;
    const formData = new FormData(form);

    // Puedes pasar formData directamente como body
    fetch('/some-api', { method: form.method, body: formData });

    // O puedes trabajarlo como un objeto plano:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Dale un `name` a tu `<textarea>`, por ejemplo `<textarea name="contenidoPost" />`. El `name` especificado será usado como *key* en los datos del form, por ejemplo `{ contenidoPost: "Tu contenido" }`.

</Note>

<Pitfall>

Por defecto, *cualquier* `button` dentro de un `<form>` lo enviará. ¡Esto podría tomarte por sorpresa! Si tienes tu propio componente de React `Button` personalizado, considera regresar [`<button type="button">`](https://developer.mozilla.org/es/docs/Web/HTML/Element/input/button) en lugar de `<button>`. Después, para ser explícito, usa `<button type="submit">` en los botones que *deberían* enviar el formulario.

</Pitfall>

---

### Controlar un text area con una variable de estado {/*controlling-a-text-area-with-a-state-variable*/}

Un text area como `<textarea />` es *no controlado.* Incluso si [pasas un valor inicial](#providing-an-initial-value-for-a-text-area) como `<textarea defaultValue="Texto inicial" />`, tu JSX solo especifica el valor inicial, no el valor actual.

**Para renderizar un text area _controlado_, pásale la prop `value`.** React forzará al text area a siempre tener `value` que pasaste. Normalmente, controlarás un text area declarando una [variable de estado:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declara una variable de estado...
  // ...
  return (
    <textarea
      value={postContent} // ...fuerza al valor del input a que coincida con la variable de estado...
      onChange={e => setPostContent(e.target.value)} // ... ¡y actualiza la variable de estado con cada cambio!
    />
  );
}
```

Esto es útil si quieres re-renderizar alguna parte de la IU cada vez que una tecla sea pulsada.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**Si pasas `value` sin `onChange`, será imposible escribir en el text area.** Cuando controlas un text area pasándole un `value`, lo estás forzando a siempre tener el valor proporcionado. Así que si pasas una variable de estado como un `value` pero olvidas actualizar esa variable de estado de manera síncrona durante el manejador de eventos `onChange`, React revertirá el text area al `value` especificado después de cada pulsación de tecla.

</Pitfall>

---

## Solución de problemas {/*troubleshooting*/}

### Mi text area no se actualiza cuando escribo en él {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Si renderizas un text area con `value` pero sin `onChange`, verás un error en la consola:

```js
// 🔴 Error: text area controlado sin manejador onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Como sugiere el mensaje de error, si solo quisiste [especificar el valor *inicial*,](#providing-an-initial-value-for-a-text-area) solo debes pasar `defaultValue`:

```js
// ✅ Bien: text area no controlado con un valor inicial
<textarea defaultValue={something} />
```

Si quieres [controlar este text area con una variable de estado,](#controlling-a-text-area-with-a-state-variable) especifica un manejador `onChange`:

```js
// ✅ Bien: text area controlado con onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Si el valor es de sólo lectura intencionalmente, agrega la prop `readOnly` para evitar el error:

```js
// ✅ Bien: text area controlado de solo lectura sin onChange
<textarea value={something} readOnly={true} />
```

---

### El caret de mi text area salta al inicio con cada pulsación de tecla {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Si [controlas un text area,](#controlling-a-text-area-with-a-state-variable) debes actualizar su variable de estado al valor del text area del DOM durante `onChange`.

No puedes actualizarlo a algo más que no sea `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Error: actualizar un input a algo que no sea e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Tampoco puedes actualizarlo de manera asíncrona:

```js
function handleChange(e) {
  // 🔴 Error: actualizar un input de manera asíncrona
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Para arreglar tu código, actualízalo de manera síncrona a `e.target.value`:

```js
function handleChange(e) {
  // ✅ Actualizar un input controlado a e.target.value de manera síncrona
  setFirstName(e.target.value);
}
```

Si esto no arregla el problema, es posible que el text area esté siendo removido y agregado nuevamente al DOM con cada pulsación de tecla. Esto puede suceder si estás [reiniciando el estado](/learn/preserving-and-resetting-state) accidentalmente en cada re-renderización. Por ejemplo, esto puede suceder si el text area o uno de sus padres siempre recibe un atributo `key` diferente, o si anidas definiciones de componentes (lo cual no está permitido en React y causa que el componente de "adentro" sea re-montado en cada renderización).

---

### Estoy obteniendo un error: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Si proporcionas un `value` al componente, este valor debe mantenerse como string durante todo su tiempo de vida.

No puedes pasar `value={undefined}` primero y después pasar `value="un string"` porque React no sabrá si quieres que el componente sea controlado o no controlado. Un componente controlado siempre debe recibir un `value` string, no `null` o `undefined`.

Si tu `value` viene de una API o una variable de estado, esta podría ser inicializada como `null` o `undefined`. En ese caso, asígnala a un string vacío (`''`) inicialmente, o pasa `value={someValue ?? ''}` para asegurar que `value` es un string.
