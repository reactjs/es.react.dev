---
title: "<option>"
---

<Intro>

El [componente integrado `<option>` del navegador](https://developer.mozilla.org/es/docs/Web/HTML/Element/option) te permite mostrar una opción dentro de un cuadro [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Alguna opción</option>
  <option value="otherOption">Otra opción</option>
</select>
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `<option>` {/*option*/}

El [componente integrado `<option>` del navegador](https://developer.mozilla.org/es/docs/Web/HTML/Element/option) te permite mostrar una opción dentro de un cuadro [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Alguna opción</option>
  <option value="otherOption">Otra opción</option>
</select>
```

[Ver más ejemplos abajo.](#usage)

#### Props {/*props*/}

`<option>` es compatible con todas las [props de elementos comunes.](/reference/react-dom/components/common#props)

Además, `<option>` admite estas props:

* [`disabled`](https://developer.mozilla.org/es/docs/Web/HTML/Element/option#attr-disabled): Un booleano. Si es `verdadero`, la opción no se podrá seleccionar y aparecerá atenuada.
* [`label`](https://developer.mozilla.org/es/docs/Web/HTML/Element/option#attr-label): Una string. Especifica el significado de la opción. Si no se especifica, se utiliza el texto dentro de la opción.
* [`value`](https://developer.mozilla.org/es/docs/Web/HTML/Element/option#attr-value: El valor que se usará [al enviar el `<select>` padre en un formulario](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) si se selecciona esta opción.

#### Advertencias {/*caveats*/}

* React no admite el atributo `selected` en `<option>`. En su lugar, pasa el `value` de esta opción al padre [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) para un cuadro de selección no controlado, o [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) para un cuadro de selección controlado.

---

## Uso {/*usage*/}

### Mostrar un cuadro de selección con opciones {/*displaying-a-select-box-with-options*/}

Representa un `<select>` con una lista de componentes `<option>` dentro para mostrar un cuadro de selección. Asigna a cada `<option>` un `value` que represente los datos que se enviarán con el formulario.

[Obtén más información sobre cómo mostrar un `<select>` con una lista de componentes `<option>`.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="manzana">Manzana</option>
        <option value="banano">Banano</option>
        <option value="naranja">Naranja</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>
