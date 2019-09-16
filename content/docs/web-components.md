---
id: web-components
title: Web Components
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React y [Web Components](https://developer.mozilla.org/es/docs/Web/Web_Components) están construidos para resolver diferentes problemas. Los Web Components proporciona una fuerte encapsulación para componentes reutilizables, mientras que React proporciona una biblioteca declarativa que mantiene el DOM sincronizado con tus datos. Los dos objetivos se complementan. Como desarrollador, eres libre de usar React en tus Web Components, utilizar Web Components en React, o ambos.

La mayoría de las personas que usan React no utilizan Web Components, pero es posible que desees hacerlo, especialmente si estás utilizando componentes de interfaz de usuario de terceros que se escriben utilizando Web Components.

## Usando Web Components en React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Nota:
>
> Los Web Components a menudo exponen una API imperativa. Por ejemplo, un Web Component `video` podría exponer las funciones `play()` y `pause()`. Para acceder a un API imperativa de un Web Component, necesitarás utilizar una referencia para interactuar con el DOM directamente. Si estás utilizando Web Components de terceros, lo mejor sería escribir un componente React que sirva como un contenedor para tu Web Component`.
>
> Los eventos emitidos por un Web Component pueden no distribuirse correctamente a través de un árbol de renderizado React.
> Deberás agregar manualmente los controladores de eventos para manejarlos dentro de tus componentes React.

Una cosa que puede confundirte, es que los Web Components usan ***"class"*** en vez de ***"className"***

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## Usando React en tus Web Components {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>Nota:
>
>Este código **NO** funcionará si transformas clases con Babel. Ver [Este caso](https://github.com/w3c/webcomponents/issues/587) para la discusión.
>Incluye el [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) antes de cargar tus Web Components para que puedas solucionar este problema.
