---
title: gating
---

<Intro>

Valida la configuración del [modo de gating](/reference/react-compiler/gating).

</Intro>

## Detalles de la regla {/*rule-details*/}

El modo de gating te permite adoptar React Compiler gradualmente al marcar componentes específicos para optimización. Esta regla garantiza que tu configuración de gating sea válida para que el compilador sepa qué componentes procesar.

### Inválido {/*invalid*/}

Ejemplos de código incorrecto para esta regla:

```js
// ❌ Faltan campos obligatorios
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // Falta el campo 'source'
      }
    }]
  ]
};

// ❌ Tipo de gating inválido
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // Debería ser un objeto
    }]
  ]
};
```

### Válido {/*valid*/}

Ejemplos de código correcto para esta regla:

```js
// ✅ Configuración completa de gating
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // nombre de la función exportada
        source: 'featureFlags' // nombre del módulo
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}

// ✅ Sin gating (compilar todo)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Sin campo gating - compila todos los componentes
    }]
  ]
};
```
