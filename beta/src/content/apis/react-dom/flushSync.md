---
title: flushSync
---

<Pitfall>

El uso de `flushSync` es poco común y puede dañar el rendimiento de su aplicación.

</Pitfall>

<Intro>

`flushSync` permite forzar a React a que vacíe cualquier actualización dentro del callback proporcionado de forma sincrónica. Esto asegura que el DOM se actualiza inmediatamente.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Actualización de las integraciones de terceros {/*flushing-updates-for-third-party-integrations*/}

Cuando se integra con código de terceros, como las APIs del navegador o las bibliotecas de interfaz de usuario, puede ser necesario forzar a React a vaciar las actualizaciones. Utiliza `flushSync` para forzar a React a que vacíe cualquier <CodeStep step={1}>actualización de estado</CodeStep> dentro del callback de forma sincrónica:

```js [[1, 2, "setState(true)"]]
flushSync(() => {
  setState(true);
});
// Mediante esta línea se actualiza el DOM.
```

Esto garantiza que, para cuando se ejecute la siguiente línea de código, React ya haya actualizado el DOM.

**Usar `flushSync` es poco común, y usarlo con frecuencia puede afectar significativamente el rendimiento de su aplicación.** Si su aplicación solo usa las API de React y no se integra con bibliotecas de terceros, `flushSync` debería ser innecesario.

Sin embargo, puede ser útil para la integración con código de terceros, como las API de los navegadores.

Algunas APIs de los navegadores esperan que los resultados dentro de los callbacks se escriban en el DOM de forma sincrónica, al final del callback, para que el navegador pueda hacer algo con el DOM renderizado. En la mayoría de los casos, React se encarga de esto automáticamente. Pero en algunos casos puede ser necesario salir de React y forzar una actualización sincrónica.

Por ejemplo, la API `onbeforeprint` del navegador permite cambiar la página inmediatamente antes de que se abra el diálogo de impresión. Esto es útil para aplicar estilos de impresión personalizados que permiten que el documento se muestre mejor para la impresión.

En el ejemplo siguiente, se utiliza `flushSync` dentro de la llamada de retorno `onbeforeprint` para "vaciar" inmediatamente el estado de React en el DOM. Al hacer esto, cuando el diálogo de impresión se abre, el estado se ha actualizado en `isPrinting` es "yes":   

<Sandpack>

```js App.js active
import { useState, useEffect } from 'react';
import {flushSync} from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);
  
  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }
    
    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);
  
  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

Si eliminas la llamada a `flushSync`, entonces cuando el diálogo de impresión mostrará `isPrinting` como "no". Esto se debe a que React agrupa las actualizaciones de forma asíncrona y el diálogo de impresión se muestra antes de que se actualice el estado.

<Pitfall>

`flushSync` puede perjudicar significativamente el rendimiento, y puede forzar inesperadamente que los límites de suspensión pendientes muestren su estado de retroceso.

La mayoría de las veces, `flushSync` puede evitarse, así que utilice `flushSync` como último recurso.

</Pitfall>

---

## Referencia {/*reference*/}

### `flushSync(callback)` {/*create-root*/}

Llama a `flushSync` para forzar a React a vaciar cualquier trabajo pendiente y actualizar el DOM de forma sincrónica.

```js
flushSync(() => {
  setState(true);
});
```

La mayoría de las veces, `flushSync` puede evitarse. Utilice `flushSync` como último recurso.

[Vea los ejemplos anteriores.](#usage)

#### Parametros {/*parameters*/}


* `callback`: Una función. React llamará inmediatamente a esta llamada de retorno y vaciará cualquier actualización que contenga de forma sincrónica. También puede vaciar cualquier actualización pendiente, o efectos, o actualizaciones dentro de efectos. Si una actualización se suspende como resultado de esta llamada `flushSync`, los fallbacks pueden volver a mostrarse.

#### Devuelve {/*returns*/}

`flushSync` devuelve `undefined`.

#### Advertencias {/*caveats*/}

* `flushSync` puede perjudicar significativamente el rendimiento. Utilícelo con moderación.
* `flushSync` puede forzar que los límites de suspensión pendientes muestren su estado de `fallback`.
* `flushSync` pueden ejecutar los efectos pendientes y aplicar sincrónicamente las actualizaciones que contengan antes de regresar.
* `flushSync` puede vaciar las actualizaciones fuera del callback cuando sea necesario para vaciar las actualizaciones dentro del callback. Por ejemplo, si hay actualizaciones pendientes de un clic, React puede vaciarlas antes de vaciar las actualizaciones dentro de la devolución de llamada.
