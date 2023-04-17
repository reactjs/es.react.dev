---
id: handling-events
title: Manejando eventos
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

<div class="scary">

> Estos documentos son antiguos y no se actualizarán. Vaya a [react.dev](https://react.dev/) para ver los nuevos documentos de React.
> 
> Estas nuevas páginas de la documentación enseñan React moderno e incluyen ejemplos interactivos:
>
> - [Responder a eventos](https://beta.es.reactjs.org/learn/responding-to-events)

</div>

Manejar eventos en elementos de React es muy similar a manejar eventos con elementos del DOM. Hay algunas diferencias de sintaxis:

* Los eventos de React se nombran usando camelCase, en vez de minúsculas.
* Con JSX pasas una función como el manejador del evento, en vez de un string.

Por ejemplo, el HTML:

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

En React es algo diferente:

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

Otra diferencia es que en React no puedes retornar `false` para prevenir el comportamiento por defecto. Debes, explícitamente, llamar `preventDefault`. Por ejemplo, en un HTML plano, para prevenir el comportamiento por defecto de enviar un formulario, puedes escribir:

```html
<form onsubmit="console.log('You clicked submit.'); return false">
  <button type="submit">Submit</button>
</form>
```

En cambio en React, esto podría ser:

```js{3}
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

Aquí, `e` es un evento sintético. React define estos eventos sintéticos acorde a las [especificaciones W3C](https://www.w3.org/TR/DOM-Level-3-Events/), para que no tengas que preocuparte por la compatibilidad entre distintos navegadores. Los eventos de React no funcionan exactamente igual que los eventos nativos. Mira la guía de referencia [`SyntheticEvent`](/docs/events.html) para aprender más.

Cuando estás utilizando React, generalmente no necesitas llamar `addEventListener` para agregar escuchadores de eventos a un elemento del DOM después de que este es creado. En cambio, solo debes proveer un manejador de eventos cuando el elemento se renderiza inicialmente.

Cuando defines un componente usando una [clase de ES6](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Classes), un patrón muy común es que los manejadores de eventos sean un método de la clase. Por ejemplo, este componente `Toggle` renderiza un botón que permite al usuario cambiar el estado entre "ENCENDIDO" y "APAGADO":

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Este enlace es necesario para hacer que `this` funcione en el callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

Tienes que tener mucho cuidado en cuanto al significado de `this` en los callbacks de JSX. En JavaScript, los métodos de clase no están [ligados](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_objects/Function/bind) por defecto. Si olvidas ligar `this.handleClick` y lo pasas a `onClick`, `this` será `undefined` cuando se llame la función.

Esto no es un comportamiento especifico de React; esto hace parte de [como operan las funciones JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). Generalmente, si refieres un método sin usar `()` después de este, tal como `onClick={this.handleClick}`, deberías ligar ese método.

Si te molesta llamar `bind`, existen dos maneras de evitarlo. Puedes usar [la sintaxis de campos públicos de clases](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes/Public_class_fields#campos_de_instancia_p%C3%BAblicos) para ligar los callbacks correctamente:

```js{2-6}
class LoggingButton extends React.Component {
  // Esta sintaxis nos asegura que `this` está ligado dentro de handleClick
  handleClick = () => {
    console.log('this is:', this);
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

Esta sintaxis está habilitada por defecto en [Create React App](https://github.com/facebookincubator/create-react-app).

Si no estas usando la sintaxis de campos públicos de clases, puedes usar una [función flecha](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions) en el callback:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // Esta sintaxis nos asegura que `this` esta ligado dentro de handleClick
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

El problema con esta sintaxis es que un callback diferente es creado cada vez que `LogginButton` es renderizado. En la mayoría de los casos, esto está bien. Sin embargo, si este callback se pasa como una propiedad a componentes más bajos, estos componentes podrían renderizarse nuevamente. Generalmente, recomendamos ligar en el constructor o usar la sintaxis de campos de clases, para evitar esta clase de problemas de rendimiento.

## Pasando argumentos a escuchadores de eventos {#passing-arguments-to-event-handlers}

Dentro de un bucle es muy común querer pasar un parámetro extra a un manejador de eventos. Por ejemplo, si `id` es el ID de una fila, cualquiera de los códigos a continuación podría funcionar:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

Las dos líneas anteriores son equivalentes, y utilizan [funciones flecha](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) y [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) respectivamente.

En ambos casos, el argumento `e` que representa el evento de React va a ser pasado como un segundo argumento después del ID. Con una función flecha, tenemos que pasarlo explícitamente, pero con `bind` cualquier argumento adicional es pasado automáticamente
