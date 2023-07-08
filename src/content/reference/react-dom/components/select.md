---
title: "<select>"
---

<Intro>

El [componente nativo del navegador `<select>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/select) te permite renderizar un recuadro select con opciones.

```js
<select>
  <option value="someOption">Una opción</option>
  <option value="otherOption">Otra opción</option>
</select>
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `<select>` {/*select*/}

Para mostrar un recuadro de selección, renderiza el componente [nativo del navegador `<select>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/select).

```js
<select>
  <option value="someOption">Una opción</option>
  <option value="otherOption">Otra opción</option>
</select>
```

[Ver más ejemplos abajo.](#usage)

#### Props {/*props*/}

`<select>` soporta todos los [elementos prop comunes.](/reference/react-dom/components/common#props)

Puedes [hacer un recuadro de selección controlado](#controlling-a-select-box-with-a-state-variable) al pasar una prop `value`:

* `value`: Un string (o un array de strings para [`multiple={true}`](#enabling-multiple-selection)). Controla qué opción se ha seleccionado. Cada valor de string coincide con el `value` de alguna `<option>` anidada dentro del `<select>`.

Cuando pases un `value`, tienes que incluir también un handler `onChange` que actualice el valor que has pasado.

Si tu `<select>` es no controlado, deberías incluir en su lugar la prop `defaultValue`:

* `defaultValue`: Un string (o un array de strings para [`multiple={true}`](#enabling-multiple-selection)). Especifica [la opción inicial seleccionada.](#providing-an-initially-selected-option)

Estas props del `<select>` son relevantes tanto para recuadros de selección no controlados como controlados:

* [`autoComplete`](https://developer.mozilla.org/es/docs/Web/HTML/Element/select#attr-autocomplete): Un string. Especifica uno de los posibles [comportamientos de autocompletado.](https://developer.mozilla.org/es/docs/Web/HTML/Element/select#attr-autocomplete)
* [`autoFocus`](https://developer.mozilla.org/es/docs/Web/HTML/Element/select#attr-autofocus): Un booleano. Si es `true`, React enfocará el elemento en su montaje.
* `children`: `<select>` acepta [`<option>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) y el componente [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) como children. También puedes pasarle tus propios componentes siempre y cuando ellos rendericen eventualmente uno de los componentes aceptados. Si pasas tus propios componentes que eventualmente rendericen la etiqueta `<option>`, cada `<option>` que renderices debe tener un `value`.
* [`disabled`](https://developer.mozilla.org/es/docs/Web/HTML/Element/select#attr-disabled): Un booleano. Si es `true`, el recuadro de selección no será interactivo y aparecerá atenuado.
* [`form`](https://developer.mozilla.org/es/docs/Web/HTML/Element/select#attr-form): Un string. Especifica el `id` del `<form>` al que pertenece este recuadro de selección. Si se omite, es al form padre más próximo.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple): Un booleano. Si es `true`, el navegador permite [selección múltiple.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-name): Un string. Especifica el nombre de este recuadro de selección que será enviado [con el submit del form.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: Una función [`Event` handler](/reference/react-dom/components/common#event-handler). Necesaria para los [recuadros de selección controlados.](#controlling-a-select-box-with-a-state-variable) Se ejecuta inmediatamente cuando el usuario elige una opción diferente. Se comporta como el [evento `input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) del navegador.
* `onChangeCapture`: Una versión de `onChange` que se ejecuta en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Una función [`Event` handler](/reference/react-dom/components/common#event-handler). Se ejecuta inmediatamente cuando el valor es cambiado por el usuario. Por razones históricas, en React es propio al lenguaje usar `onChange` en su lugar que funciona de forma similar.
* `onInputCapture`: Una versión de `onInput` que se ejecuta en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Una función [`Event` handler](/reference/react-dom/components/common#event-handler). Se ejecuta si un input falla en la validación en el envío de un formulario. A diferencia del evento nativo `invalid`, el evento `onInvalid` de React se propaga.
* `onInvalidCapture`: Una versión de `onInvalid` que se ejecuta en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/es/docs/Web/HTML/Element/select#attr-required): Un booleano. Si es `true`, el valor tiene que ser incluido por el formulario para que se envíe.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-size): Un número. Para selecciones de `multiple={true}`, especifica el número escogido de elementos visibles inicialmente.

#### Advertencias {/*caveats*/}

- A diferencia de en HTML, pasar un atributo `selected` a `<option>` no está soportado. En su lugar, usa [`<select defaultValue>`](#providing-an-initially-selected-option) para recuadros de selección no controlados y [`<select value>`](#controlling-a-select-box-with-a-state-variable) para recuadros de selección controlados.
- Si un recuadro de selección recibe una prop `value` será [tratado como controlado.](#controlling-a-select-box-with-a-state-variable)
- Un recuadro de selección no puede ser controlado y no controlado al mismo tiempo.
- Un recuadro de selección no puede cambiar entre controlado y no controlado durante su ciclo de vida.
- Cada recuadro de selección necesita un event handler `onChange` que actualice de forma síncrona su valor permitido.

---

## Uso {/*usage*/}

### Muestra un recuadro de selección con opciones {/*displaying-a-select-box-with-options*/}

Renderiza un `<select>` con una lista de componentes `<option>` dentro para mostrar un recuadro de selección. Da a cada `<option>` un `value` representando los datos que serán enviados en el envío del formulario.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Elige una fruta:
      <select name="selectedFruit">
        <option value="apple">Manzana</option>
        <option value="banana">Plátano</option>
        <option value="orange">Naranja</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

---

### Incluir una label para un recuadro de selección {/*providing-a-label-for-a-select-box*/}

De forma típica, incluirás cada `<select>` dentro de una etiqueta [`<label>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/label). Esto indica al navegador que esta label está asociada con ese recuadro de selección. Cuando el usuario hace click en la label, el navegador automáticamente enfocará el recuadro de selección. También es esencial para la accesibilidad: un lector de pantalla reproducirá la leyenda de esa label cuando el usuario enfoque el recuadro de selección.

Si no puedes anidar un `<select>` en una `<label>`, asócialos al pasarles el mismo ID a `<select id>` y a [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Para evitar conflictos entre múltiples instancias de un componente, genera ese ID usando [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Elige una fruta:
        <select name="selectedFruit">
          <option value="apple">Manzana</option>
          <option value="banana">Plátano</option>
          <option value="orange">Naranja</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Elige una verdura:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Pepino</option>
        <option value="corn">Maíz</option>
        <option value="tomato">Tomate</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Incluir una opción inicial seleccionada {/*providing-an-initially-selected-option*/}

Por defecto, el navegador seleccionará el primer `<option>` de la lista. Para seleccionar otra opción distinta por defecto, incluye ese `value` del `<option>` como el `defaultValue` para el elemento `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Elige una fruta:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Manzana</option>
        <option value="banana">Plátano</option>
        <option value="orange">Naranja</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

<Pitfall>

A diferencia de en HTML, pasar un atributo `selected` a un `<option>` individual no está soportado.

</Pitfall>

---

### Permitir la selección múltiple {/*enabling-multiple-selection*/}

Pasa `multiple={true}` al `<select>` para permitir al usuario seleccionar múltiples opciones. En ese caso, si también especificas un `defaultValue` para escoger la opción inicial seleccionada, debe ser un array.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Elige algunas frutas:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Manzana</option>
        <option value="banana">Plátano</option>
        <option value="orange">Naranja</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Leer el valor del recuadro de selección al enviar un formulario {/*reading-the-select-box-value-when-submitting-a-form*/}

Añade un [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) que envuelve tu recuadro de selección con un [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) dentro. Llamará a tu event handler `<form onSubmit>`. Por defecto, el navegador enviará los datos del formularo a la URL actual y recargará la página. Puedes sobreescribir este comportamiento llamando a `e.preventDefault()`. Lee los datos del formulario con [`new FormData(e.target)`](https://developer.mozilla.org/es/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Evita que el navegador recargue la página
    e.preventDefault();
    // Lee los datos del formulario
    const form = e.target;
    const formData = new FormData(form);
    // Puedes pasar formData como cuerpo del fetch directamente:
    fetch('/some-api', { method: form.method, body: formData });
    // Puedes generar una URL de él, como hace el navegador por defecto:
    console.log(new URLSearchParams(formData).toString());
    // Puedes trabajar con él como un objeto plano.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Esto no incluye múltiples valores de selección
    // O puedes obtener un array de pares name-value.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Elige tu fruta favorita:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Manzana</option>
          <option value="banana">Plátano</option>
          <option value="orange">Naranja</option>
        </select>
      </label>
      <label>
        Elige todas tus verduras favoritas:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Pepino</option>
          <option value="corn">Maíz</option>
          <option value="tomato">Tomate</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Da un `name` a tu `<select>`, por ejemplo `<select name="selectedFruit" />`. El `name` que especifiques será usado como key en los datos del formulario, por ejemplo `{ selectedFruit: "orange" }`.

Si usas `<select multiple={true}>`, el [`FormData`](https://developer.mozilla.org/es/docs/Web/API/FormData) leerás del formulario que incluirá cada valor seleccionado como un par name-value separado. Revisa detenidamente los console logs en el ejemplo de arriba.

</Note>

<Pitfall>

Por defecto, *cualquier* `<button>` dentro de un `<form>` lo enviará. ¡Esto puede ser desconcertante! Si tienes tu propio componente `Button` personalizado, piensa en devolver un [`<button type="button">`](https://developer.mozilla.org/es/docs/Web/HTML/Element/input/button) en lugar de `<button>`. Entonces, para actuar de forma explícita, usa `<button type="submit">` para los buttons que *deben* enviar el formulario.

</Pitfall>

---

### Controlar un recuadro de selección con una variable de estado {/*controlling-a-select-box-with-a-state-variable*/}

Un recuadro de selección como `<select />` es *no controlado.* Incluso si [incluyes un valor seleccionado inicialmente](#providing-an-initially-selected-option) como `<select defaultValue="orange" />`, tu JSX sólo especifica el valor inicial, no su valor ahora mismo.

**Para renderizar un recuadro de selección _controlado_, añádele su prop `value`.** React forzará al recuadro de selección para tener siempre el `value` que pasaste. De forma típica, controlarás un recuadro de selección declarando una [variable de estado:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Declara una variable de estado,...
  // ...
  return (
    <select
      value={selectedFruit} // ...fuerza al valor del select a coincidir con la variable de estado,...
      onChange={e => setSelectedFruit(e.target.value)} // ...¡y a actualizar la variable de estado con cualquier cambio!
    >
      <option value="apple">Manzana</option>
      <option value="banana">Plátano</option>
      <option value="orange">Naranja</option>
    </select>
  );
}
```

Esto es útil si quieres volver a renderizar alguna parte de la UI en respuesta a cada selección.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Elige una fruta:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Manzana</option>
          <option value="banana">Plátano</option>
          <option value="orange">Naranja</option>
        </select>
      </label>
      <hr />
      <label>
        Elige todas tus verduras favoritas:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Pepino</option>
          <option value="corn">Maíz</option>
          <option value="tomato">Tomate</option>
        </select>
      </label>
      <hr />
      <p>Tu fruta favorita: {selectedFruit}</p>
      <p>Tus verduras favoritas: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Si pasas un `value` sin un `onChange`, será imposible seleccionar una opción.** Cuando controlas un recuadro de selección al pasarle algún `value`, *fuerzas* que siempre tenga el valor que has pasado. Así que si le incluyes una variable de estado como `value` pero olvidas actualizar esa variable de estado de forma síncrona durante el event handler `onChange`, React revertirá el recuadro de selección después de cada pulsación de tecla de vuelta al `value` que especificaste.

A diferencia de HTML, pasar un atributo `selected` a un `<option>` individual no está soportado.

</Pitfall>
