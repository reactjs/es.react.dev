---
id: integrating-with-other-libraries
title: Integración con otras bibliotecas
permalink: docs/integrating-with-other-libraries.html
---

React puede ser utilizado en cualquier aplicación web. Puede integrarse en otras aplicaciones y, con un poco de cuidado, otras aplicaciones pueden integrarse en React. Esta guía examinará algunos de los casos de uso más comunes, centrándose en la integración con [jQuery](https://jquery.com/) y [Backbone](https://backbonejs.org/), pero las mismas ideas pueden ser aplicadas a la integración de componentes con cualquier código existente.

## Integración con los plugins de manipulación del DOM {#integrating-with-dom-manipulation-plugins}

React es inconsciente de los cambios realizados en el DOM fuera de React. React determina las actualizaciones basándose en su propia representación interna, y si los mismos nodos DOM son manipulados por otra biblioteca, React se confunde y no tiene forma de recuperarse.

Esto no significa que sea imposible o incluso necesariamente difícil de combinar React con otras formas de afectar el DOM, solo hay que tener en cuenta lo que está haciendo cada uno.

La forma más fácil de evitar conflictos es evitar que el componente React se actualice. Puedes hacer esto renderizando elementos que React no tiene motivos para actualizar, como un `<div />` vacío.

### Cómo abordar el problema {#how-to-approach-the-problem}

Para demostrar esto, vamos a definir un wrapper para un plugin genérico de jQuery.

Adjuntaremos un [ref](/docs/refs-and-the-dom.html) al elemento DOM raíz. Dentro de `componentDidMount`, obtendremos una referencia a él para que podamos pasarlo al plugin jQuery.

Para evitar que React toque el DOM después del montaje, devolveremos un `<div />` vacío desde el método `render()`. El elemento `<div />` no tiene propiedades ni hijos, por lo que React no tiene ninguna razón para actualizarlo, dejando el plugin jQuery libre para administrar esa parte del DOM:

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Ten en cuenta que definimos los [métodos del ciclo de vida](/docs/react-component.html#the-component-lifecycle) `componentDidMount` y` componentWillUnmount`. Muchos plugins de jQuery adjuntan listeners de eventos al DOM, por lo que es importante desmontarlos en `componentWillUnmount`. Si el complemento no proporciona un método para la limpieza, probablemente tendrás que proporcionar el tuyo, recordando eliminar cualquier listener de eventos que el plugin haya registrado para evitar pérdidas de memoria.

### Integración con el plugin jQuery Chosen {#integrating-with-jquery-chosen-plugin}

Para un ejemplo más concreto de estos conceptos, escribamos un wrapper mínimo para el plugin [Chosen](https://harvesthq.github.io/chosen/), que aumenta las entradas `<select>`.

>**Nota:**
>
> Solo porque es posible, no significa que sea el mejor enfoque para las aplicaciones React. Te recomendamos que uses los componentes React cuando puedas. Los componentes de React son más fáciles de reutilizar en las aplicaciones de React y, a menudo, brindan más control sobre su comportamiento y apariencia.

Primero, veamos lo que `Chosen` le hace al DOM.

Si lo llama en un nodo DOM `<select>`, este lee los atributos fuera del nodo DOM original, lo oculta con un estilo en línea y luego agrega un nodo DOM separado con su propia representación visual justo después del `<select> `. Luego, se activan los eventos de jQuery para notificarnos sobre los cambios.

Digamos que esta es la API que buscamos con nuestro componente wrapper `<Chosen>`:

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

Lo implementaremos como un [componente no controlado](/docs/uncontrolled-components.html) por simplicidad.

Primero, crearemos un componente vacío con un método `render()` donde devolvemos `<select>` envuelto en un `<div>`:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Observa cómo envolvimos `<select>` en un `<div>` extra. Esto es necesario porque `Chosen` agregará otro elemento DOM justo después del nodo `<select>` que le pasamos. Sin embargo, en lo que respecta a React, `<div>` siempre tiene un solo hijo. Así es como nos aseguramos de que las actualizaciones de React no entren en conflicto con el nodo DOM adicional añadido por `Chosen`. Es importante que si modificas el DOM fuera del flujo de React, debes asegurarte de que React no tenga una razón para tocar esos nodos DOM.

A continuación, implementaremos los métodos del ciclo de vida. Necesitamos inicializar `Chosen` con la referencia al nodo `<select>` en `componentDidMount`, y eliminarlo en `componentWillUnmount`:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Ten en cuenta que React no asigna ningún significado especial al campo `this.el`. Solo funciona porque previamente hemos asignado este campo desde un `ref` en el método `render()`:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Esto es suficiente para hacer que nuestro componente se renderice, pero también queremos que se nos notifique acerca de los cambios de valor. Para hacer esto, nos suscribiremos al evento jQuery `change` en el `<select>` gestionado por `Chosen`.

No pasaremos `this.props.onChange` directamente a Chosen porque los props de los componentes pueden cambiar con el tiempo, y eso incluye a los controladores de eventos. En su lugar, declararemos un método `handleChange()` que llama a `this.props.onChange`, y lo suscribiremos al evento jQuery `change`:

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Finalmente, queda una cosa más por hacer. En React, los props pueden cambiar con el tiempo. Por ejemplo, el componente `<Chosen>` puede obtener diferentes hijos si el estado del componente padre cambia. Esto significa que en los puntos de integración es importante que actualicemos manualmente el DOM en respuesta a las actualizaciones de los props, ya que no dejamos que React administre el DOM por nosotros.

La documentación de `Chosen` sugiere que podemos usar la API jQuery `trigger()` para notificarle sobre los cambios en el elemento DOM original. Dejaremos que React se encargue de actualizar `this.props.children` dentro de `<select>`, pero también agregaremos un método de ciclo de vida `componentDidUpdate()` que notifica a `Chosen` sobre los cambios en la lista de hijos:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

De esta manera, `Chosen` sabrá que actualizará su elemento DOM cuando cambien los hijos de `<select>` administrados por React.

La implementación completa del componente `Chosen` se ve así:

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Integración con otras bibliotecas de vista {#integrating-with-other-view-libraries}

React puede integrarse en otras aplicaciones gracias a la flexibilidad de [`ReactDOM.render()`](/docs/react-dom.html#render).

Aunque React se usa comúnmente en el inicio para cargar un solo componente React raíz en el DOM, `ReactDOM.render()` también se puede llamar varias veces para partes independientes de la interfaz de usuario que pueden ser tan pequeñas como un botón, o tan grandes como una aplicación.

De hecho, así es exactamente cómo se utiliza React en Facebook. Esto nos permite escribir aplicaciones en React pieza por pieza y combinarlas con nuestras plantillas existentes generadas por el servidor y otros códigos del lado del cliente.

### Reemplazando el renderizado basado en strings con React {#replacing-string-based-rendering-with-react}

Un patrón común en las aplicaciones web más antiguas es describir los fragmentos del DOM como un string e insertarlo en el DOM de la siguiente manera: `$el.html(htmlString)`. Estos puntos en un código base son perfectos para introducir React. Solo reescribe el renderizado basado en string como un componente React.

Así que la siguiente implementación de jQuery...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

... podría reescribirse usando un componente React:

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

Desde aquí, puedes comenzar a mover más lógica al componente y comenzar a adoptar prácticas de React más comunes. Por ejemplo, en los componentes es mejor no confiar en las ID porque el mismo componente se puede representar varias veces. En su lugar, usaremos el [sistema de eventos de React](/docs/handling-events.html) y registraremos el controlador de clic directamente en el elemento React `<button>`:

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

Puedes tener tantos componentes aislados como desees y usar `ReactDOM.render()` para renderizarlos a diferentes contenedores DOM. Gradualmente, a medida que conviertas más de tu aplicación a React, podrás combinarlos en componentes más grandes y mover algunos de los `ReactDOM.render()` mas arriba en la jerarquía.

### Incrustación de React en una vista de Backbone {#embedding-react-in-a-backbone-view}

Las vistas de [Backbone](https://backbonejs.org/) suelen utilizar strings HTML, o funciones plantillas que producen strings, para crear el contenido de sus elementos DOM. Este proceso, también, puede reemplazarse con la representación de un componente React.

A continuación, crearemos una vista de Backbone llamada `ParagraphView`. Anulará la función `render()` de Backbone para renderizar un componente React `<Paragraph>` en el elemento DOM proporcionado por Backbone (`this.el`). Aquí también estamos usando [`ReactDOM.render()`](/docs/react-dom.html#render):

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

Es importante que también llamemos a `ReactDOM.unmountComponentAtNode()` en el método `remove` para que React anule el registro de los controladores de eventos y otros recursos asociados con el árbol de componentes cuando se desconecta.

Cuando se elimina un componente *desde dentro de* un árbol de React, la limpieza se realiza automáticamente, pero como estamos eliminando todo el árbol a mano, debemos llamar a este método.

## Integración con capas de modelo {#integrating-with-model-layers}

Aunque generalmente se recomienda usar un flujo de datos unidireccional como [el estado de React](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), o [Redux](https://redux.js.org/), los componentes React pueden usar una capa modelo de otros frameworks.

### Usando Modelos de Backbone en Componentes de React {#using-backbone-models-in-react-components}

La forma más sencilla de consumir modelos y colecciones [Backbone](https://backbonejs.org/) desde un componente React es escuchar los diversos eventos de cambio y forzar manualmente una actualización.

Los componentes responsables de renderizar modelos escucharán los eventos `'change'`, mientras que los componentes responsables de renderizar las colecciónes escucharán los eventos de `'add'` y `'remove'`. En ambos casos, llama a [`this.forceUpdate()`](/docs/react-component.html#forceupdate) para volver renderizar el componente con los nuevos datos.

En el ejemplo a continuación, el componente `List` renderiza una colección Backbone, utilizando el componente `Item` para renderizar elementos individuales.

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Extracción de datos de modelos Backbone {#extracting-data-from-backbone-models}

El enfoque anterior requiere que sus componentes React estén al tanto de los modelos y colecciones de Backbone. Si luego planeas migrar a otra solución de administración de datos, es posible que desees concentrar el conocimiento sobre Backbone en la menor cantidad posible de partes del código.

Una solución para esto es extraer los atributos del modelo como datos sin formato cada vez que cambie, y mantener esta lógica en un solo lugar. Lo siguiente es [un componente de orden superior](/docs/higher-order-components.html) que extrae todos los atributos de un modelo de Backbone al estado, pasando los datos al componente envuelto.

De esta manera, solo el componente de orden superior necesita conocer los aspectos internos del modelo de Backbone, y la mayoría de los componentes de la aplicación pueden permanecer ajenos a Backbone.

En el siguiente ejemplo, haremos una copia de los atributos del modelo para formar el estado inicial. Nos suscribimos al evento `change` (y cancelamos la suscripción al desmontar), y cuando sucede, actualizamos el estado con los atributos actuales del modelo. Finalmente, nos aseguramos de que si el prop `model` cambia, no nos olvidemos de cancelar la suscripción del modelo anterior y suscribirnos al nuevo.

Ten en cuenta que este ejemplo no pretende ser exhaustivo con respecto al trabajo con Backbone, pero debería darte una idea de cómo abordar esto de una manera genérica:

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

Para demostrar cómo usarlo, conectaremos un componente React `NameInput` a un modelo de Backbone, y actualizaremos su atributo `firstName` cada vez que cambie la entrada:

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Esta técnica no se limita a Backbone. Puedes usar React con cualquier biblioteca de modelos suscribiéndote a sus cambios en los métodos del ciclo de vida y, opcionalmente, copiando los datos al estado local de React.
