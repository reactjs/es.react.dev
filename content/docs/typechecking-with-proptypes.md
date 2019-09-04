---
id: typechecking-with-proptypes
title: Verificación de tipos con PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Nota:
>
> `React.PropTypes` se movió a un paquete diferente desde React v15.5. Por favor usa [en su lugar la biblioteca `prop-types`](https://www.npmjs.com/package/prop-types).
>
>Nosotros ofrecemos [un script de codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) para automatizar la conversión.

A medida que tu aplicación crece, puedes capturar una gran cantidad de errores con verificación de tipos. Para algunas aplicaciones, puedes usar extensiones de Javascript como [Flow](https://flow.org/) o [TypeScript](https://www.typescriptlang.org/) para verificar los tipos en tu aplicación. Pero incluso si no usas alguno de ellos, React tiene algunas habilidades de verificación de tipos incorporadas. Para usar verificación de tipos en las props de un componente, puedes asignar la propiedad especial `PropTypes`:

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

`PropTypes` exporta un rango de validadores que pueden ser usados para estar seguros que la información recibida sea válida. En este ejemplo, usamos `PropTypes.string`. Cuando un valor inválido se asigna a una prop, se muestra una advertencia en la consola de Javascript. Por razones de desempeño, `PropTypes` solo se verifica en modo desarrollo.

### PropTypes {#proptypes}

Aquí hay un ejemplo que documenta los diferentes tipos de validadores:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // Puedes declarar que una propiedad es un tipo específico de JS. Por defecto, estas
  // son todas opcionales.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Cualquier cosa que sea interpretada: números, cadenas, elementos o un array
  // (o fragment) que contengan estos tipos.
  optionalNode: PropTypes.node,

  // Un elemento de React
  optionalElement: PropTypes.element,

  // Un tipo de elemento React (ej. MyComponent).
  optionalElementType: PropTypes.elementType,

  // Además puedes declarar que una prop es una instancia de una clase. Este usa
  // el operador instanceof de JS.
  optionalMessage: PropTypes.instanceOf(Message),

  // Puedes asegurar que una prop esta limitada a valores específicos si se
  // considera como enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // Un objeto que puede ser de diferentes tipos
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // Un array de determinado tipo
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // Un objeto con valores de propiedad de determinado tipo
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // Un objeto que tenga determinada estructura
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  
  // Un objeto con advertencias sobre propiedades adicionales
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // Puedes encadenar cualquiera de los anteriores con `isRequired` para asegurar
  // que se muestre una advertencia si la prop no se suministra.
  requiredFunc: PropTypes.func.isRequired,

  // Un valor de cualquier tipo
  requiredAny: PropTypes.any.isRequired,

  // También puedes suministrar un validador personalizado. Debe retornar un objeto Error
  // si la validación falla. No uses `console.warn` o throw, porque no va a funcionar en
  // `oneOfType`
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // También puedes suministrar un validador personalizado a `arrayOf` y `objectOf`.
  // Debe retornar un objeto Error si la validación falla. El validador se llamará
  // por cada key en el array o el objeto. Los primeros dos arguments del validador
  // son el array o el objeto, y la key del elemento actual.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### Solicitar un sólo hijo {#requiring-single-child}

Usando `PropTypes.element` puedes especificar que únicamente un hijo se pase al componente.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // Debe ser exactamente un elemento o generará una advertencia
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Valores por defecto de props {#default-prop-values}

Puedes definir los valores por defecto de tus props al asignar la propiedad especial `defaultProps`:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Especifica los valores por defecto de props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renderiza "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

Si estás usando un transform de Babel como [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/), puedes declarar `defaultProps` como una propiedad estática al interior de un componente clase de React. Esta sintaxis no se ha terminado y require un paso de compilación para funcionar en el navegador. Para mas información, puedes ver [class field proposal](https://github.com/tc39/proposal-class-fields).

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

`defaultProps` se usa para asegurar que `this.props.name` tendrá un valor si no fue especificado por el componente padre. La verificación de tipo de `propTypes` sucede después de resolver `defaultProps`, así que la verificación de tipo también se aplica a `defaultProps`.
