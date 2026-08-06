---
title: config
---

<Intro>

Valida las [opciones de configuración](/reference/react-compiler/configuration) del compilador.

</Intro>

## Detalles de la regla {/*rule-details*/}

React Compiler acepta varias [opciones de configuración](/reference/react-compiler/configuration) para controlar su comportamiento. Esta regla valida que tu configuración use nombres de opciones y tipos de valores correctos, evitando fallos silenciosos por errores tipográficos o ajustes incorrectos.

### Inválido {/*invalid*/}

Ejemplos de código incorrecto para esta regla:

```js
// ❌ Nombre de opción desconocido
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // Error tipográfico: debería ser compilationMode
    }]
  ]
};

// ❌ Valor de opción inválido
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // Inválido: usa 'all' o 'infer'
    }]
  ]
};
```

### Válido {/*valid*/}

Ejemplos de código correcto para esta regla:

```js
// ✅ Configuración válida del compilador
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## Solución de problemas {/*troubleshooting*/}

### La configuración no funciona como se espera {/*config-not-working*/}

Tu configuración del compilador podría tener errores tipográficos o valores incorrectos:

```js
// ❌ Incorrecto: errores comunes de configuración
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Error tipográfico en el nombre de la opción
      compilationMod: 'all',
      // Tipo de valor incorrecto
      panicThreshold: true,
      // Opción desconocida
      optimizationLevel: 'max'
    }]
  ]
};
```

Consulta la [documentación de configuración](/reference/react-compiler/configuration) para ver las opciones válidas:

```js
// ✅ Mejor: configuración válida
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // o 'infer'
      panicThreshold: 'none', // o 'critical_errors', 'all_errors'
      // Usa solo opciones documentadas
    }]
  ]
};
```
