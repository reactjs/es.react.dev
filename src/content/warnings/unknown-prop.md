---
title: Advertencia de props desconocidas
---

La advertencia de "unknown-prop" se activará si intentas renderizar un elemento del DOM con una propiedad que React no reconoce como un atributo/propiedad válida del DOM. Debes asegurar que los elementos del DOM no tengan propiedades falsas flotando por ahí.

Existen algunas razones probables por las que podría esta advertencia aparecer:

1. ¿Estás usando `{...props}` o `cloneElement(element, props)`? Al copiar propiedades a un componente hijo, debes asegurar de no estar enviando accidentalmente propiedades que estaban destinadas solo para el componente padre. Consulta las soluciones comunes a este problema a continuación.

2. Estás utilizando un atributo del DOM no estándar en un nodo nativo del DOM, tal vez para representar datos personalizados. Si estás intentando adjuntar datos personalizados a un elemento estándar del DOM, considera utilizar un atributo de datos personalizado como se describe [en MDN](https://developer.mozilla.org/es/docs/Learn/HTML/Howto/Use_data_attributes).

3. React aún no reconoce el atributo que especificaste. Es probable que esto se solucione en una versión futura de React. React te permitirá pasar este atributo sin generar una advertencia si escribes el nombre del atributo en minúsculas.

4. Estás utilizando un componente de React en minúsculas, por ejemplo, `<myButton />`. React lo interpreta como una etiqueta del DOM porque la transformación JSX de React utiliza la convención de mayúsculas y minúsculas para distinguir entre componentes definidos por el usuario y etiquetas del DOM. Para tus propios componentes de React, utiliza PascalCase. Por ejemplo, escribe `<MyButton />` en lugar de `<myButton />`.

---

Si recibes esta advertencia porque pasas props de la siguiente forma `{...props}`, tu componente padre necesita "consumir" cualquier prop que esté destinada al componente padre y no al componente hijo. Aquí tienes un ejemplo:

**Incorrecto:** Se está enviando inesperadamente la propiedad `layout` al tag `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // !Incorrecto! Porque estás seguro de que "layout" no es una propiedad que entiende <div>.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // ¡Incorrecto! Porque estás seguro de que "layout" no es una propiedad que entiende <div>.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Correcto:** El operador de propagación (spread syntax) se puede utilizar para extraer variables de las props y colocar las props restantes en una variable.

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

**Correcto**: También puedes asignar las props a un nuevo objeto y eliminar las llaves que estás utilizando del nuevo objeto. Asegúrate de no eliminar las props del objeto original `this.props`, ya que el objeto se considera inmutable.

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
