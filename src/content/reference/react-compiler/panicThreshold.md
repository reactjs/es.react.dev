---
title: panicThreshold
---

<Intro>

La opción `panicThreshold` controla cómo maneja React Compiler los errores durante la compilación.

</Intro>

```js
{
  panicThreshold: 'none' // Recomendado
}
```

<InlineToc />

---

## Referencia {/*reference*/}

### `panicThreshold` {/*panicthreshold*/}

Determina si los errores de compilación deben detener la compilación u omitir la optimización.

#### Tipo {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### Valor predeterminado {/*default-value*/}

`'none'`

#### Opciones {/*options*/}

- **`'none'`** (predeterminado, recomendado): Omite los componentes que no se pueden compilar y continúa con la compilación
- **`'critical_errors'`**: Detiene la compilación solo ante errores críticos del compilador
- **`'all_errors'`**: Detiene la compilación ante cualquier diagnóstico del compilador

#### Advertencias {/*caveats*/}

- Las compilaciones de producción siempre deben usar `'none'`
- Los fallos de compilación impiden que tu aplicación se compile
- Con `'none'`, el compilador detecta y omite automáticamente el código problemático
- Los umbrales más estrictos solo son útiles durante el desarrollo para depurar

---

## Uso {/*usage*/}

### Configuración de producción (recomendada) {/*production-configuration*/}

Para compilaciones de producción, usa siempre `'none'`. Este es el valor predeterminado:

```js
{
  panicThreshold: 'none'
}
```

Esto garantiza:

- Que tu compilación nunca falle por problemas del compilador
- Que los componentes que no se pueden optimizar funcionen con normalidad
- Que se optimicen la mayor cantidad de componentes posible
- Implementaciones de producción estables

### Depuración durante el desarrollo {/*development-debugging*/}

Usa temporalmente umbrales más estrictos para encontrar problemas:

```js
const isDevelopment = process.env.NODE_ENV === 'development';

{
  panicThreshold: isDevelopment ? 'critical_errors' : 'none',
  logger: {
    logEvent(filename, event) {
      if (isDevelopment && event.kind === 'CompileError') {
        // ...
      }
    }
  }
}
```
