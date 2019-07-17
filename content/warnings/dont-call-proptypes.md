---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

> Nota:
>
> `React.PropTypes` se ha mudado a un paquete diferente desde React v15.5. Utiliza [la biblioteca `prop-types` en su lugar](https://www.npmjs.com/package/prop-types).
>
> Proporcionamos [un script codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) para automatizar la conversión.

En una importante versión futura de React, el código que implementa las funciones de validación PropType se eliminará en producción. Una vez que esto suceda, cualquier código que llame a estas funciones manualmente (que no se haya eliminado en producción) generará un error.

### Declarar PropTypes todavía está bien {#declaring-proptypes-is-still-fine}

El uso normal de PropTypes todavía es compatible:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

Nada cambia aquí.

### No llames PropTypes directamente {#dont-call-proptypes-directly}

Ya no se admite el uso de PropTypes de otra manera que no sea la anotación de componentes React con ellos:

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// ¡No soportado!
var error = apiShape(json, 'response');
```

Si dependes en el uso de PropTypes como este, te recomendamos que uses o crees una bifurcación de PropTypes (como [estos](https://github.com/aackerman/PropTypes) [dos](https://github.com/developit/proptypes) paquetes).

Si no corriges la advertencia, este código se bloqueará en la versión de producción que use React 16.

### Si no llamas directamente a PropTypes pero sigues recibiendo la advertencia {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

Inspecciona la traza producida por la advertencia. Encontrarás la definición del componente responsable de la llamada directa PropTypes. Probablemente, el problema se deba a PropTypes de terceros que envuelven PropTypes de React, por ejemplo:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Usa prop `active` en su lugar'
  )
}
```

En este caso, `ThirdPartyPropTypes.deprecated` es un contenedor que llama a `PropTypes.bool`. Este patrón en sí mismo está bien, pero desencadena un falso positivo porque React cree que tú estás llamando directamente a PropTypes. La siguiente sección explica cómo solucionar este problema para una biblioteca que implementa algo como `ThirdPartyPropTypes`. Si no es una biblioteca que escribiste, puedes abrir un issue en su proyecto.

### Solucionando el falso positivo en PropTypes de terceros {#fixing-the-false-positive-in-third-party-proptypes}

Si tú eres autor de una biblioteca PropTypes y dejas que los consumidores envuelvan los PropTypes React existentes, es posible que comiencen a ver esta advertencia proveniente de su biblioteca. Esto sucede porque React no ve un último argumento "secreto" que [se pasa](https://github.com/facebook/react/pull/7132) para detectar llamadas de PropTypes manuales.

Aquí esta cómo solucionarlo. Usaremos `deprecated` de [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) como un ejemplo. La implementación actual sólo pasa los argumentos `props`,`propName` y `componentName`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

Para corregir el falso positivo, asegurate de pasar **todos** los argumentos al PropType envuelto. Esto es fácil de hacer con la notación ES6 `...rest`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Nota ...rest aqui
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // y aqui
  };
}
```

Esto silenciará la advertencia.
