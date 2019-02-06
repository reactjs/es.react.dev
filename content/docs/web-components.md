---
id: web-components
title: Web Components
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React y [Componentes Web](https://developer.mozilla.org/es/docs/Web/Web_Components) están construidos para resolver diferentes problemas. Los componentes web proporciona una fuerte encapsulación para componentes reutilizables, mientras que React proporciona una biblioteca declarativa que mantiene el DOM sincronizado con tus datos. Los dos objetivos se complementan. Como desarrollador, eres libre de usar React en tus componentes web, utilizar componentes web en React, o ambos.

La mayoría de las personas que usan React no utilizan componentes web, pero es posible que desees hacerlo, especialmente si estás utilizando componentes de IU de terceros que se escriben utilizando componentes web.

## Usando `Web Components` en React

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Nota:
>
> Los componentes web a menudo exponen una API imperativa. Por ejemplo, un componente web `video` podría exponer las funciones `play()` y `pause()`. Para acceder a un API imperativa de un componente web, necesitarás utilizar una referencia para interactuar con el DOM directamente. Si estás utilizando componentes web de terceros, lo mejor sería escribir un componente React que sirva como un contenedor para tu componente web`.
>
> Los eventos emitidos por un componente web pueden no distribuirse correctamente a través de un árbol de renderizado React.
> Deberás agregar manualmente los controladores de eventos para manejarlos dentro de tus componentes React.

Una cosa que puede confundirte, es que los componentes web usan ***"class"*** en vez de ***"className"***

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

## Usando React en tus `Web Components`

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
>Este código **NO** funcionará si transformas clases con Babel. Ver [Este asunto](https://github.com/w3c/webcomponents/issues/587) para la discusión.
>Incluye el [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) antes de cargar tus componentes web para que puedas solucionar este problema.
