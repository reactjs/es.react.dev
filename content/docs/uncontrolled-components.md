---
id: uncontrolled-components
title: Componentes no controlados
permalink: docs/uncontrolled-components.html
---

En la mayoría de los casos, te recomendamos usar [Componentes controlados](/docs/forms.html#controlled-components) para implementar formularios. En un componente controlado, los datos del formulario son manejados por un componente React. La alternativa son los componentes no controlados, donde los datos del formulario son manejados por el propio DOM.

Para escribir un componente no controlado, en lugar de escribir un controlador de eventos para cada actualización de estado, puedes [usar una referencia](/docs/refs-and-the-dom.html) para que obtengas los valores del formulario desde el DOM.

Por ejemplo, este código acepta un solo nombre en un componente no controlado:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Ya que un componente es la fuente de la verdad en el DOM, a veces es más fácil integrar el código React y el código no React cuando usas componentes no controlados. También puede haber menos código si optas por una solución rápida y sin muchos miramientos. De lo contrario, deberías por lo general utilizar componentes controlados.

Si aún no tienes claro qué tipo de componente debes usar para una situación en particular, puedes encontrar [este artículo sobre entradas controladas y no controladas](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) que puede ser útil.

### Valores predeterminados {#default-values}

En el ciclo de vida de renderizado de React, el atributo `value` en los elementos del formulario reemplazará el valor en el DOM con un componente no controlado, a menudo quieres React para especificar el valor inicial, pero dejas las actualizaciones posteriores sin control. Para manejar este caso, puedes especificar un `defaultValue` en lugar de `value`.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

Del mismo modo, `<input type="checkbox">` e `<input type="radio">` admiten `defaultChecked`, y `<select>` y `<textarea>` admiten `defaultValue`.

## La etiqueta de entrada de archivo {#the-file-input-tag}

En HTML, un `<input type="file">` permite al usuario elegir uno o más archivos del almacenamiento en sus dispositivos para cargarlos a un servidor o manipularlos mediante JavaScript a través de la [API de archivos](https://developer.mozilla.org/es/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

En React, un `<input type="file" />` siempre es un componente no controlado porque su valor solo puede ser establecido por un usuario, y no mediante programación.

Debes utilizar la API File para interactuar con ellos. El siguiente ejemplo muestra cómo crear un [referencia al nodo DOM](/docs/refs-and-the-dom.html) para acceder a los archivos en un controlador de envío:
`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)
