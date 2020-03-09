---
id: forms
title: Formularios
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

Los elementos de formularios en HTML funcionan un poco diferente a otros elementos del DOM en React, debido a que los elementos de formularios conservan naturalmente algún estado interno. Por ejemplo, este formulario solamente en HTML, acepta un solo nombre.

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

Este formulario tiene el comportamiento predeterminado en HTML que consiste en navegar a una nueva página cuando el usuario envía el formulario. Si deseas este comportamiento en React, simplemente ya funciona así. Pero en la mayoría de casos, es conveniente tener una función en Javascript que se encargue del envío del formulario, y que tenga acceso a los datos que el usuario introdujo en el formulario. La forma predeterminada para conseguir esto es una técnica llamada "componentes controlados".

## Componentes controlados {#controlled-components}

En HTML, los elementos de formularios como los `<input>`, `<textarea>` y el `<select>` normalmente mantienen sus propios estados y los actualizan de acuerdo a la interacción del usuario. En React, el estado mutable es mantenido normalmente en la propiedad estado de los componentes, y solo se actualiza con [`setState()`](/docs/react-component.html#setstate).

Podemos combinar ambos haciendo que el estado de React sea la "única fuente de la verdad". De esta manera, los componentes React que rendericen un formulario también controlan lo que pasa en ese formulario con las subsecuentes entradas del usuario. Un campo de un formulario cuyos valores son controlados por React de esta forma es denominado "componente controlado".

Por ejemplo, si queremos hacer que el ejemplo anterior muestre el nombre que esta siendo suministrado, podemos escribir el formulario como un componente controlado:

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

Ya que el atributo `value` es agregado en nuestro elemento del formulario, el valor mostrado siempre será el de `this.state.value`, haciendo que el estado de React sea la fuente de la verdad. Ya que `handleChange` corre cada vez que una tecla es oprimida para actualizar el estado de React, el valor mostrado será actualizado mientras que el usuario escribe.

Con un componente controlado, toda mutación del estado tendrá asociada una función controlador. Esto hace más directo modificar o validar la entrada del usuario. Por ejemplo, si quisiéramos asegurar que los nombres sean escritos con todas las letras en mayúscula, podríamos escribir el `handleChange` como:

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## La etiqueta textarea {#the-textarea-tag}

En HTML, el elemento `<textarea>` define su texto por sus hijos:

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

En React, un `<textarea>` utiliza un atributo `value` en su lugar. De esta manera, un formulario que hace uso de un `<textarea>` puede ser escrito de manera similar a un formulario que utiliza un campo en una sola línea:

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

Recuerda que `this.state.value` es inicializado en el constructor, de manera que el área de texto empiece con algo de texto.

## La etiqueta select {#the-select-tag}

En HTML, `<select>` crea una lista desplegable. Por ejemplo, este HTML crea una lista desplegable de sabores:

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

Ten en cuenta que la opción *Coco* es inicialmente seleccionada, debido al atributo `selected`. React, en lugar de utilizar el atributo `selected`, utiliza un atributo `value` en la raíz de la etiqueta `select`. Esto es más conveniente en un componente controlado debido a que solo necesitas actualizarlo en un solo lugar, por ejemplo:

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

En resumen, esto hace que `<input type="text">`, `<textarea>`, y `<select>` trabajen de manera similar, todos aceptan un atributo `value` el cual puedes usar para implementar un componente controlado.

> Nota
>
> Puedes pasar un array al atributo `value`, permitiendo que selecciones múltiples opciones en una etiqueta `select`:
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## La etiqueta file input {#the-file-input-tag}

En HTML, un `<input type="file">` permite que el usuario escoja uno o varios archivos de su dispositivo de almacenamiento para ser cargados a un servidor o ser manipulados por Javascript mediante el [API de Archivos](https://developer.mozilla.org/es/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Ya que su valor es solo de lectura, es un componente **no controlado** en React. Es explicado en detalle junto a otros componentes no controlados [más adelante en la documentación](/docs/uncontrolled-components.html#the-file-input-tag).

## Manejando múltiples inputs {#handling-multiple-inputs}

Cuando necesitas manejar múltiples elementos `input` controlados, puedes agregar un atributo `name` a cada uno de los elementos y dejar que la función controladora decida que hacer basada en el valor de `event.target.name`.

Por ejemplo:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.name === 'isGoing' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Ten en cuenta como utilizamos la sintaxis de la [propiedad *name* computada de ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) para actualizar la clave del estado correspondiente al nombre del *input*.

```js{2}
this.setState({
  [name]: value
});
```
Esto es equivalente a este código ES5:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

También, ya que `setState()` automáticamente [combina un estado parcial al estado actual](/docs/state-and-lifecycle.html#state-updates-are-merged), solamente necesitamos llamarlo con las partes que han cambiado.

## Valor nulo en un input controlado {#controlled-input-null-value}

Especificar la propiedad `value` en un [componente controlado](/docs/forms.html#controlled-components) evita que el usuario cambie la entrada a menos que así lo quiera. Si has especificado un `value` pero la entrada aún es editable, quizás agregaste accidentalmente al `value` un valor `undefined` o `null`.

El código a continuación demuestra esto. (El input está bloqueado en principio, pero se vuelve editable después de un corto retraso).

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Alternativas a componentes controlados {#alternatives-to-controlled-components}

A veces puede ser tedioso usar componentes controlados, debido a que se necesita escribir un controlador de eventos para cada forma en la que tus datos puedan cambiar y agregarlos a todos en el estado del *input* a través del componente React. Esto puede volverse particularmente molesto cuando estás convirtiendo una base de código existente a React, o integrando una aplicación React con una biblioteca que no integra React. En estas situaciones, puede que quieras leer acerca de [componentes no controlados](/docs/uncontrolled-components.html), una técnica alternativa para implementar *inputs* en formularios.

## Soluciones completas {#fully-fledged-solutions}

Si lo que estás buscando es una solución completa incluyendo validación, tener en cuenta los campos visitados y manejar el envío del formulario, [Formik](https://jaredpalmer.com/formik) es una de las opciones populares. Sin embargo, está construido con los mismos principios de los componentes controlados y manejo de estado, así que no los dejes de aprender.
