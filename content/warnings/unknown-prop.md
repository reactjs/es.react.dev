---
title: Unknown Prop Warning
layout: single
permalink: warnings/unknown-prop.html
---
La advertencia unknown-prop se activará si intenta renderizar un elemento DOM con una propiedad que React no reconoce como un atributo/propiedad del DOM legal. Debes asegurarte de que tus elementos DOM no tengan elementos falsos flotando alrededor.

Hay un par de razones probables por las que podría aparecer esta advertencia:

1. ¿Está utilizando `{...this.props}` o `cloneElement(element, this.props)`? Su componente está transfiriendo sus props directamente a un elemento hijo (por ejemplo, [transfiriendo props](/docs/transferring-props.html)). Al transferir props a un componente hijo, debe asegurarse de que no está enviando accidentalmente props cuya intención fue ser interpretado por el componente padre.

2. Está utilizando un atributo DOM no estándar en un nodo DOM nativo, tal vez para representar datos personalizados. Si está tratando de adjuntar datos personalizados a un elemento DOM estándar, considere usar un atributo de datos personalizados como se describe [en MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes ).

3. React aún no reconoce el atributo que ha especificado. Esto probablemente se solucionará en una versión futura de React. Sin embargo, React actualmente elimina todos los atributos desconocidos, por lo que especificarlos en su aplicación React no hará que se procesen.

4. Está utilizando un componente React sin mayúsculas. React lo interpreta como una etiqueta DOM porque [la transformación React JSX usa la convención de mayúsculas y minúsculas para distinguir entre los componentes definidos por el usuario y las etiquetas DOM](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

---

Para solucionar este problema, los componentes compuestos deben "consumir" cualquier prop que esté destinado para el componente compuesto y no para el componente hijo. Ejemplo:

**Malo:** El prop `layout` es inesperado se reenvía a la etiqueta` div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // ¡MALO! Porque sabe con seguridad que "layout" no es un prop que <div> entiende.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // ¡MALO! Porque sabe con seguridad que "layout" no es un prop que <div> entiende.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Bueno:** El spread operator se puede usar para sacar variables de los props y colocar los props restantes en una variable.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Bueno:** También puede asignar los props a un nuevo objeto y eliminar las llaves que está usando del nuevo objeto. Asegúrate de no eliminar los props del objeto original `this.props`, ya que ese objeto debe considerarse inmutable.

```js
function MyDiv(props) {

  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
