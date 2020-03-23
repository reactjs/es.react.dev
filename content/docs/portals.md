---
id: portals
title: Portales
permalink: docs/portals.html
---

Los portales proporcionan una opción de primera clase para renderizar hijos en un nodo DOM que existe por fuera de la jerarquía del DOM del componente padre.

```js
ReactDOM.createPortal(child, container)
```

El primer argumento (`child`) es cualquier [hijo renderizable por React](/docs/react-component.html#render), como un elemento, cadena de caracteres o fragmento. El segundo argumento (`container`) es un elemento DOM.

## Uso {#usage}

Normalmente, cuando retornas un elemento del método de render de un componente, este se monta en el DOM como un elemento hijo del nodo padre más cercano:

```js{4,6}
render() {
  // React crea un nuevo elemento y muestra al 
  // componente hijo dentro de él.
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Sin embargo, a veces es útil insertar un hijo en una ubicación diferente en el DOM:

```js{6}
render() {
  // React *no* crea un nuevo div, convierte el hijo en `domNode`.
  // `domNode` es cualquier nodo DOM válido, independientemente de su ubicación en el DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Un caso de uso típico de los portales es cuando un componente principal tiene un estilo `overflow: hidden` o `z-index`, pero necesita que el elemento "salga" visualmente de su contenedor. Por ejemplo, cuadros de diálogo, *hovercards* y *tooltips*.

> Nota:
>
> Cuando trabajes con portales, recuerda que [administrar el foco del teclado](/docs/accessibility.html#programmatically-managing-focus) es muy importante.
>
> Para los cuadros de diálogos, asegúrate de que todos puedan interactuar con ellos siguiendo las [Prácticas de creación modal de WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## Propagación de eventos a través de portales {#event-bubbling-through-portals}

Aunque un portal puede estar en cualquier parte del árbol DOM, se comporta como un hijo de React normal en cualquier otra forma. Las características como el contexto funcionan exactamente de la misma manera, independientemente de si el elemento hijo es un portal, ya que el portal aún existe en el *árbol de React* sin importar la posición en el *árbol DOM*.

Esto incluye propagación de eventos. Un evento activado desde adentro de un portal se propagará a los ancestros en el *árbol de React*, incluso si esos elementos no son ancestros en el *árbol DOM*. Asumiendo la siguiente estructura HTML:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

Un componente `Parent` en `#app-root` sería capaz de detectar un evento de propagación no capturado desde el nodo hermano `#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// Estos dos contenedores son hermanos en el DOM.
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // El elemento del portal se inserta en el árbol DOM después de
    // que se montan los hijos del Modal, lo que significa que los hijos
    // se montarán en un nodo DOM separado. Si un componente hijo
    // requiere estar conectado inmediatamente cuando se monta al árbol del DOM
    // por ejemplo, para medir un nodo DOM, o usar 'autoFocus' en un descendiente,
    // agrega el estado a Modal y renderiza solo a los hijos 
    // cuando se inserta Modal en el árbol DOM.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Esto se activará cuando el botón en el Child sea cliqueado,
    // actualizando el estado de Parent,
    // aunque el botón no sea descendiente directo en el DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // El evento de clic en este botón se propagará hasta el padre, 
  // porque no hay un atributo 'onClick' definido.
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

La captura de un evento que sale de un portal en un componente padre permite el desarrollo de abstracciones más flexibles que no dependen intrínsecamente de los portales. Por ejemplo, si renderizas un componente `<Modal />`, el padre puede capturar sus eventos sin importar si es implementado usando portales.
