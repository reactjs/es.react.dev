---
id: uncontrolled-components
title: Uncontrolled Components
permalink: docs/uncontrolled-components.html
---

En la mayoría de los casos, te recomendamos usar [Componentes Controlados](/docs/forms.html) para implementar formularios. En un componente controlado, los datos del formulario son manejados por un componente React. La alternativa son los componentes no controlados, donde los datos del formulario son manejados por el propio DOM.

Para escribir un componente no controlado, en lugar de escribir un controlador de eventos para cada actualización de estado, tu puedes [usar una referencia](/docs/refs-and-the-dom.html) para que obtengas los valores del formulario desde el DOM.

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

Ya que un componente no controlado mantiene la fuente de la verdad en el DOM, a veces es más fácil integrar el código React y el código no React cuando usas componentes no controlados. También puede ser un poco menos de código si quieres ser rápido y sucio. De lo contrario, normalmente debes utilizar componentes controlados.

Sí aún no tienes claro qué tipo de componente debes usar para una situación en particular, puedes encontrar [este articulo sobre entradas controladas y no controladas](http://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) para ser tu ayuda.

### Valores predeterminados

En el ciclo de vida de renderizado React, el atributo `value` en los elementos del formulario reemplazará el valor en el DOM con un componente no controlado, a menudo quieres React para especificar el valor inicial, pero dejas las actualizaciones posteriores sin control. Para manejar este caso, puedes especificar un `defaultValue` en lugar de `value`.

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

Del mismo modo, `<input type="checkbox">` y `<input type="radio">` respaldado por `defaultChecked`, y `<select>` y `<textarea>` respaldado por `defaultValue`.

## La etiqueta de entrada de archivo

En HTML, un `<input type="file">` permite al usuario elegir uno o más archivos del almacenamiento en sus dispositivos para cargarlos a un servidor o manipularlos mediante JavaScript a través de   [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

En React, un `<input type="file" />` siempre es un componente no controlado porque su valor solo puede ser establecido por un usuario, y no mediante programación.

Debes utilizar File API para interactuar con ellos. El siguiente ejemplo muestra cómo crear un [referencia al nodo DOM](/docs/refs-and-the-dom.html) para acceder a los archivos en un controlador de envío:
`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

