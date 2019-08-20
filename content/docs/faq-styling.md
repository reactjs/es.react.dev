---
id: faq-styling
title: Estilo y CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### ¿Cómo agrego clases CSS a los componentes? {#how-do-i-add-css-classes-to-components}

Pasa una string como la prop `className`:

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

Es común que las clases CSS dependan de las props o del estado del componente:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>Tip
>
>Si a menudo escribes código como este, el paquete [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) puede hacerlo más simple.

### ¿Puedo usar estilos en línea? {#can-i-use-inline-styles}

Sí, ve la documentación sobre estilo [aquí](/docs/dom-elements.html#style).

### ¿Los estilos en línea son malos? {#are-inline-styles-bad}

Las clases CSS son generalmente mejores para el rendimiento que los estilos en línea.

### ¿Qué es CSS-in-JS? {#what-is-css-in-js}

"CSS-in-JS" se refiere a un patrón donde el CSS se compone usando JavaScript en lugar de definirlo en archivos externos. Lee una comparación de las bibliotecas CSS-in-JS [aquí](https://github.com/MicheleBertoli/css-in-js).

_Ten en cuenta que esta funcionalidad no es parte de React, sino que es proporcionada por bibliotecas de terceros._ React no tiene una opinión sobre cómo se definen los estilos; en caso de dudas, un buen punto de partida es definir tus estilos en un archivo `*.css` separado como de costumbre y referirse a ellos usando [`className`](/docs/dom-elements.html#classname).

### ¿Puedo hacer animaciones en React? {#can-i-do-animations-in-react}

React puede usarse para potenciar animaciones. Revisa [React Transition Group](https://reactcommunity.org/react-transition-group/) y [React Motion](https://github.com/chenglou/react-motion) o [React Spring](https://github.com/react-spring/react-spring), por ejemplo.
