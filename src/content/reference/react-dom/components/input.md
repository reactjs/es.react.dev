---
title: "<input>"
---

<Intro>

El [componente `<input>` integrado en el navegador](https://developer.mozilla.org/es/docs/Web/HTML/Element/input) te permite renderizar diferentes tipos de entradas de formularios.

```js
<input />
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `<input>` {/*input*/}

Para mostrar un input, renderiza el componente [`<input>` incorporado en el navegador](https://developer.mozilla.org/es/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[Ver más ejemplos abajo.](#usage)

#### Props {/*props*/}

`<input>` admite todas las [props comunes de los elementos.](/reference/react-dom/components/common#props)

Puedes [hacer un input controlado](#controlling-an-input-with-a-state-variable) pasando una de estas props:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Booleano. Para un entrada de tipo checkbox o radio button, controla si está seleccionado.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): String. Para una entrada de texto, controla su texto. (Para un radio button, especifica sus datos de formulario.)

Cuando pases cualquiera de ellos, debes también pasar un manejador `onChange` que actualice el valor pasado.

Estas props de `<input>` son solamente relevantes para inputs no controlados:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Booleano. Especifica [el valor inicial](#providing-an-initial-value-for-an-input) para inputs `type="checkbox"` y `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): String. Especifica [el valor inicial](#providing-an-initial-value-for-an-input) para un input de texto.

Estas props de `<input>` son relevantes para ambos inputs controlados y no controlados:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): String. Especifica cuales tipos de archivo son soportados por un input `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): String. Especifica el texto alternativo de una imagen para un input `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): String. Especifica el medio capturado (micrófono, video, o cámara) por un input `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): String. Especifica  uno de los posibles [comportamientos de autocompletado.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Booleano. Si es `true`, React enfocara al elemento al montarlo.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): String. Especifica el nombre del campo de formulario para la direccionalidad del elemento.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Booleano. Si es `true`, el input no será interactivo y aparecerá oscurecido.
* `children`: `<input>` no acepta hijos.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): String. Especifica el `id` del `<form>` al que este input pertenece. Si se omite, es el formulario padre más cercano.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): String. Sobrescribe el `<form action>` padre para `type="submit"` y `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): String. Sobrescribe el `<form enctype>` padre para `type="submit"` y `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): String. Sobrescribe el `<form method>` padre para `type="submit"` y `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): String. Sobrescribe el `<form noValidate>` padre para `type="submit"` y `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): String. Sobrescribe `<form target>` padre para `type="submit"` y `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): String. Especifica la altura de la imagen para `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): String. Especifica el `id` del `<datalist>` con las opciones de autocompletado.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Número. Especifica el máximo valor de los inputs de tipo numérico y de fecha y hora.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Número. Especifica la longitud máxima del texto y otros inputs.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Número. Especifica el valor mínimo de los inputs de tipo numérico y de fecha y hora.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Número. Especifica la longitud mínima de texto y otros inputs.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Booleano. Especifica si valores múltiples son permitidos para `<type="file"` y `type="email"`.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): String. Especifica el nombre para este input que se [envia con el formulario.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Un [manejador de eventos](/reference/react-dom/components/common#event-handler). Requerido para [inputs controlados.](#controlling-an-input-with-a-state-variable) Se activa inmediatamente cuando el valor del input es cambiado por el usuario (por ejemplo, se activa en cada pulsación de teclas). Se comporta como el [evento `input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) del navegador.
* `onChangeCapture`: Una versión de `onChange` que se activa en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/es/docs/Web/API/HTMLElement/input_event): Un [manejador de eventos](/reference/react-dom/components/common#event-handler). Se activa inmediatamente cuando el valor es cambiado por el usuario. Por razones históricas, en React es idiomático usar `onChange` en su lugar que funciona de forma similar.
* `onInputCapture`: Una version de `onInput` que se activa en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Un [manejador de eventos](/reference/react-dom/components/common#event-handler). Se activa si un input falla en la validación cuando se envía un formulario. A diferencia del evento integrado `invalid`, el evento `onInvalid` de React se propaga.
* `onInvalidCapture`: Una versión de `onInvalid` que se activa en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Un [manejador de evento](/reference/react-dom/components/common#event-handler). Se activa después de selección dentro de los cambios de un `<input>`. React hereda el evento `onSelect` para también activarse para selecciones vacías y en ediciones (las cuales pueden afectar la selección).
* `onSelectCapture`: Una versión `onSelect` que se activa en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): String. Especifica el patrón con el cual `value` debe coincidir.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): String. Mostrado en un color atenuado cuando el valor del input esta vació.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Booleano. Si es `true`, el usuario no puede editar el input.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Booleano. Si es `true`, el valor debe ser proporcionado para poder enviar el formulario.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Número. Similar a configurar el ancho, pero la unidad depende del control.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): String. Especifica la fuente de la imagen para un input `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Un número positivo o un string `'any'`. Especifica la distancia entre los valores validos.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): String. Uno de los [tipos de input.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  String. Especifica el ancho de la imagen para un input `type="image"`.

#### Advertencias {/*caveats*/}

- Los Checkboxes necesitan `checked` (o `defaultChecked`), no `value` (o `defaultValue`).
- Si un input de texto recibe una prop `value` de tipo string , será [tratado como controlado.](#controlling-an-input-with-a-state-variable)
- Si un checkbox o un radio button recibe una prop `checked` de tipo booleano, será [tratado como controlado.](#controlling-an-input-with-a-state-variable)
- Un input no puede ser controlado o no controlado al mismo tiempo.
- Un input no puede cambiar entre ser controlado o no durante su ciclo de vida.
- Cada input controlado necesita un manejador de evento `onChange` que sincrónicamente actualice su valor de respaldo.

---

## Uso {/*usage*/}

### Visualización de inputs de diferentes tipos {/*displaying-inputs-of-different-types*/}

Para visualizar un input, renderiza un componente `<input>`. Por defecto, será un input de tipo texto. Puedes pasar `type="checkbox"` para un checkbox, `type="radio"` para un radio button, [o uno de los otros tipos de inputs.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Input de texto: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Botones radio:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Opción 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Opción 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Opción 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Proporcionar una etiqueta para un input {/*providing-a-label-for-an-input*/}

Típicamente, pondrás cada `<input>` dentro de una etiqueta [`<label>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/label). Esto le dice al navegador que esta etiqueta esta asociada con ese input. Cuando el usuario da click a la etiqueta, el navegador automáticamente enfocará al input. También es esencial para la accesibilidad: un lector de pantalla anunciará la etiqueta cuando el usuario enfoque el input asociado.

Si no puedes anidar un `<input>` dentro de un `<label>`, asocialos pasando el mismo ID al `<input id>` y al [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Para evitar conflictos entre múltiples instancias  de un componente, genera dicho ID con [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Tu primer nombre:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Tu edad:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Proporcionar un valor inicial para un input {/*providing-an-initial-value-for-an-input*/}

Puedes opcionalmente especificar el valor inicial para cualquier input. Pásalo como el `defaultValue` string para inputs de tipo texto. Checkboxes y radio buttons deben especificar el valor inicial con el `defaultChecked` booleano en su lugar.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Input de texto: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Botones radio:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Opción 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Opción 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Opción 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Leer los valores de los inputs cuando se envía un formulario {/*reading-the-input-values-when-submitting-a-form*/}

Añade un [`<form>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/form) que rodee tus inputs con un [`<button type="submit">`](https://developer.mozilla.org/es/docs/Web/HTML/Element/button) dentro. Llamará tu manejador de evento `<form onSubmit>`. Por defecto, el navegador enviará los datos del formulario a la URL actual y refrescará la página. Puedes sobrescribir ese comportamiento llamando `e.preventDefault()`. Para leer los datos del formulario, usa [`new FormData(e.target)`](https://developer.mozilla.org/es/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Previene que el navegador recargue la página
    e.preventDefault();

    // Lee los datos del formulario
    const form = e.target;
    const formData = new FormData(form);

    // Puedes pasar formData como el cuerpo de la consulta directamente:
    fetch('/some-api', { method: form.method, body: formData });

    // O puedes trabajar con él como un objecto plano:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Input de texto: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Botones radio:
        <label><input type="radio" name="myRadio" value="option1" /> Opctión 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Opción 3</label>
      </p>
      <hr />
      <button type="reset">Reiniciar formulario</button>
      <button type="submit">Enviar formulario</button>
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

Da un `name` para cada `<input>`, por ejemplo `<input name="firstName" defaultValue="Taylor" />`. El `name` que especifiques será usado como una llave en los datos del formulario, por ejemplo `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Por defecto, *cualquier* `<button>` dentro de un `<form>` lo enviará. ¡Esto puede ser sorprendente! Si tienes tu propio componente `Button` de React, considera retornar [`<button type="button">`](https://developer.mozilla.org/es/docs/Web/HTML/Element/input/button) en vez de `<button>`. Entonces, para ser explicito, usa `<button type="submit">` para botones que *se* supone envían el formulario.

</Pitfall>

---

### Controlar un input con un estado variable {/*controlling-an-input-with-a-state-variable*/}

Un input como `<input />` es *no controlado.* Incluso si [pasas un valor inicial](#providing-an-initial-value-for-an-input) como `<input defaultValue="Initial text" />`, tu JSX solo especifica el valor inicial. No controla cual debe ser el valor ahora mismo.

**Para renderizar un input _controlado_, pásale la prop `value` (o `checked` para checkboxes y radios).** React forzará al input para que siempre tenga el `value` que le pasaste. Típicamente, controlarás un input declarando una [variable de estado:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Declara una variable de estado...
  // ...
  return (
    <input
      value={firstName} // ... fuerza al valor del input para que coincida con la variable de estado...
      onChange={e => setFirstName(e.target.value)} // ... y actualiza la variable de estado en cada edición!
    />
  );
}
```

Un input controlado te servirá si necesitas un estado de cualquier forma -- por ejemplo, para renderizar tu UI en cada edición:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Tu nombre es {firstName}.</p>}
      ...
```

Es también útil si quieres ofrecer múltiples formas de ajustar el estado del input (por ejemplo, al dar click a un botón):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Edad:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Añade 10 años
        </button>
```

El `value` que pases a componentes controlados no debe ser `undefined` o `null`. Si necesitas que el valor inicial este vacío (así como el campo de `firstName` más abajo), inicializa tu variable de estado con un string vacío (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Primer nombre:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Edad:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Añade 10 años
        </button>
      </label>
      {firstName !== '' &&
        <p>Tu nombre es {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Tu edad es {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Si pasas un `value` sin un `onChange`, será imposible escribir dentro del input.** Cuando controlas un input pasándole algún `value`, lo *fuerzas* a siempre tener el valor que le pasaste. Entonces si pasas una variable de estado como un `value` pero olvidaste actualizar esa variable de estado sincrónicamente durante el manejador evento `onChange`, React revertirá al input después de cada pulsación del teclado al `value` que especificaste.

</Pitfall>

---

### Optimizar la re-renderización en cada pulsación del teclado {/*optimizing-re-rendering-on-every-keystroke*/}

Cuando usas un input controlado, pones el estado en cada pulsación del teclado. Si el componente que contiene tu estado renderiza de nuevo un árbol grande, este puede volverse lento. Hay varias formas en las que puedes optimizar el rendimiento del re-renderizado.

Por ejemplo, supón que empiezas con un formulario que renderiza de nuevo toda el contenido de la página en cada pulsación del teclado:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Ya que `<PageContent />` no depende del estado del input, puedes mover el valor del input dentro de su propio componente:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Esto mejora el rendimiento significativamente porque ahora solamente `SignupForm` renderiza de nuevo en cada pulsación del teclado.

Si no hay forma de evitar el re-renderizado (por ejemplo, si `PageContent` depende del valor de el input de búsqueda), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) te permite mantener el input controlado incluso a la mitad de un re-renderizado grande.

---

## Solución de problemas {/*troubleshooting*/}

### Mi input de tipo texto no se actualiza cuando escribo dentro de él {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Si renderizas un input con un `value` pero sin un `onChange`, verás un error en la consola:

```js
// 🔴 Error: input de texto controlado sin un manejador de evento onChange
<input value={something} />
```

<ConsoleBlock level="error">

Proporcionaste una prop `value` a un campo de formulario sin un manejador de evento `onChange`. Esto renderiza un campo de solo lectura. Si el campo debe ser mutable usa `defaultValue`. En caso contrario, establece `onChange` o `readOnly`.

</ConsoleBlock>

Como el mensaje de error sugiere, si solo quieres [especificar el valor *inicial* ,](#providing-an-initial-value-for-an-input) pasa `defaultValue` en su lugar:

```js
// ✅ Bien: input no controlado con un valor inicial
<input defaultValue={something} />
```

Si quieres [controlar este input con una variable de estado,](#controlling-an-input-with-a-state-variable) especifica un manejador de evento `onChange`:

```js
// ✅ Bien: input controlado con onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Si el valor es intencionalmente de solo lectura, añade una prop `readOnly` para eliminar el error:

```js
// ✅ Bien: input controlado de solo lectura sin un onChange
<input value={something} readOnly={true} />
```

---

### Mi checkbox no se actualiza cuando le doy click {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Si renderizas un checkbox con `checked` pero sin `onChange`, verás un error en la consola:

```js
// 🔴 Error: checkbox controlado sin un manejador de evento onChange
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

Proporcionaste una prop `checked` a un campo de formulario sin un manejador de evento `onChange`. Esto renderizará un campo de solo lectura. Si el campo debe ser mutable usa `defaultChecked`. En caso contrario, establece `onChange` o `readOnly`.

</ConsoleBlock>

Como el error sugiere, si solo quieres [especificar el valor *inicial*,](#providing-an-initial-value-for-an-input) pasa `defaultChecked` en su lugar:

```js
// ✅ Bien: checkbox no controlado con un valor inicial
<input type="checkbox" defaultChecked={something} />
```

Si quieres [controlar este checkbox con una variable de estado,](#controlling-an-input-with-a-state-variable) especifica un manejador de evento `onChange`:

```js
// ✅ Bien: checkbox controlado con onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Necesitas leer `e.target.checked` en vez de `e.target.value` para checkboxes.

</Pitfall>

Si el checkbox es intencionalmente de solo lectura, añade una prop `readOnly` para eliminar el error:

```js
// ✅ Bien: input controlado de solo lectura sin un onChange
<input type="checkbox" checked={something} readOnly={true} />
```

---

### El caret de mi input salta al principio de cada pulsación del teclado {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Si [controlas un input,](#controlling-an-input-with-a-state-variable) debes actualizar su variable de estado con el valor del input desde el DOM durante `onChange`.

No pudes actualizarlo a algo distinto a `e.target.value` (o `e.target.checked` para checkboxes):

```js
function handleChange(e) {
  // 🔴 Error: actualizando un input a algo distinto a e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

También no puedes actualizarlo asincrónicamente:

```js
function handleChange(e) {
  // 🔴 Error: actualizando un input asicrónicamente
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Para arreglar tu código, actualizalo sincrónicamente a `e.target.value`:

```js
function handleChange(e) {
  // ✅ Actualizando un input controlado a e.target.value sincrónicamente
  setFirstName(e.target.value);
}
```

Si esto no arregla el problema, es posible que el input sea removido y reañadido del DOM en cada pulsación del teclado. Esto puede psasr si accidentalmente estas [reseteando el estado](/learn/preserving-and-resetting-state) en cada re-renderizado. Por ejemplo, esto puede pasar si el input o uno de sus padres siempre recibe un atributo `key`, o si anidaste definiciones de componentes (lo cual no esta permitido en React y causa que el componente "interior" siempre sea considerado un árbol diferente).

---

### Estoy teniendo un error: "Un componente esta cambiando un input no controlado para ser controlado" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Si proporcionas un `value` al componente, debe seguir siendo un string durante de su ciclo de vida.

No puedes pasar `value={undefined}` primero y luego pasar `value="some string"` porque React no sabrá si quieres que el componente sea controlado o no. Un componente controlado debería siempre recibir un `value` de tipo string, no un `null` o `undefined`.

Si tu `value` viene desde una API o de una variable de estado, puede ser inicializado en `null` o `undefined`. En ese caso, o bien establécelo en un string vacío (`''`) inicialmente, o pasa `value={someValue ?? ''}` para asegurar que `value` es un string.

Similarmente, si pasas `checked` a un checkbox, asegúrate de que siempre sea un booleano.
