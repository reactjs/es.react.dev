---
title: flushSync
---

<Pitfall>

El uso de `flushSync` es poco común y puede afectar el rendimiento de tu aplicación.

</Pitfall>

<Intro>

`flushSync` permite forzar a React a que ejecute de forma asíncrona cualquier actualización dentro de la función *callback* proporcionada. Esto asegura que el DOM se actualiza inmediatamente.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Llama a `flushSync` para forzar a React a ejecutar cualquier trabajo pendiente y actualizar el DOM de forma sincrónica.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

La mayoría de las veces, `flushSync` puede evitarse. Utiliza `flushSync` como último recurso.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}


* `callback`: Una función. React llamará inmediatamente a esta función *callback* y ejecutará cualquier actualización que contenga de forma sincrónica. También puede ejecutar cualquier actualización pendiente, o Efectos, o actualizaciones dentro de Efectos. Si una actualización se suspende como resultado de esta llamada `flushSync`, los *fallbacks* pueden volver a mostrarse.

#### Devuelve {/*returns*/}

`flushSync` devuelve `undefined`.

#### Advertencias {/*caveats*/}

* `flushSync` puede perjudicar significativamente el rendimiento. Utilízalo con moderación.
* `flushSync` puede forzar que las barreras de Suspense pendientes muestren su estado de `fallback`.
* `flushSync` puede ejecutar Efectos pendientes y aplicar sincrónicamente cualquier actualización que contengan antes de retornar.
* `flushSync` puede ejecutar actualizaciones fuera del *callback* cuando sea necesario para ejecutar las actualizaciones dentro del *callback*. Por ejemplo, si hay actualizaciones pendientes de un clic, React puede ejecutarlas antes de ejecutar las actualizaciones dentro del *callback*.

---

## Uso {/*usage*/}

### Ejecutar actualizaciones para integraciones de terceros {/*flushing-updates-for-third-party-integrations*/}

Cuando se hace una integración con código de terceros, como las APIs del navegador o bibliotecas de interfaz de usuario, puede ser necesario forzar a React a ejecutar las actualizaciones. Utiliza `flushSync` para forzar a React a que ejecute cualquier <CodeStep step={1}>actualización de estado</CodeStep> dentro de la función *callback* de forma sincrónica:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// Cuando se llegue a esta línea, el DOM estará actualizado.
```

Esto garantiza que, para cuando se ejecute la siguiente línea de código, React ya haya actualizado el DOM.

**Usar `flushSync` es poco común, y usarlo con frecuencia puede afectar significativamente el rendimiento de tu aplicación.** Si tu aplicación solo usa las APIs de React y no se integra con bibliotecas de terceros, `flushSync` debería ser innecesario.

Sin embargo, puede ser útil para la integración con código de terceros, como las APIs de los navegadores.

Algunas APIs de los navegadores esperan que los resultados dentro de *callbacks* se escriban en el DOM de forma sincrónica, al final del *callback*, para que el navegador pueda hacer algo con el DOM renderizado. En la mayoría de los casos, React se encarga de esto automáticamente. Pero en algunos casos puede ser necesario salir de React y forzar una actualización sincrónica.

Por ejemplo, la API `onbeforeprint` del navegador permite cambiar la página inmediatamente antes de que se abra el diálogo de impresión. Esto es útil para aplicar estilos de impresión personalizados que permiten que el documento se muestre mejor para la impresión.

En el ejemplo siguiente, se utiliza `flushSync` dentro de la función *callback* `onbeforeprint` para "vaciar" inmediatamente el estado de React en el DOM. Al hacer esto, cuando el diálogo de impresión se abre, el estado se ha actualizado en `isPrinting` a "yes":

<Sandpack>

```js App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

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

Si eliminas la llamada a `flushSync`, entonces el diálogo de impresión mostrará `isPrinting` como "no". Esto se debe a que React agrupa las actualizaciones de forma asíncrona y el diálogo de impresión se muestra antes de que se actualice el estado.

<Pitfall>

`flushSync` puede perjudicar significativamente el rendimiento, y puede forzar inesperadamente que barreras de Suspense pendientes muestren su estado de *fallback*.

La mayoría de las veces, `flushSync` puede evitarse, así que utiliza `flushSync` como último recurso.

</Pitfall>
