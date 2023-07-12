---
title: "<progress>"
---

<Intro>

El [componente `<progress>` integrado en el navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) te permite renderizar un indicador de progreso.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `<progress>` {/*progress*/}

Para mostrar un indicador de progreso, renderiza el componente [`<progress>` incorporado del navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[Ver más ejemplos abajo.](#usage)

#### Props {/*props*/}

`<progress>` admite todas las [propiedades comunes de los elementos.](/reference/react-dom/components/common#props)

Además, `<progress>` admite estas propiedades:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-max): Un número. Especifica el `valor` máximo. Por defecto es `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-value): Un número entre `0` y `max`, o `null` para un progreso indeterminado. Especifica cuánto se ha completado.

---

## Uso {/*usage*/}

### Control de un indicador de progreso {/*controlling-a-progress-indicator*/}

Para mostrar un indicador de progreso, renderiza un componente `<progress>`. Puedes pasar un `valor` numérico entre `0` y el valor `max` que especifiques. Si no pasas un valor `max`, se asumirá que es `1` por defecto.

Si la operación no está en curso, pasa `value={null}` para poner el indicador de progreso en un estado indeterminado.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
