---
title: useDebugValue
---

<Intro>

`useDebugValue` es un Hook de React que te permite añadir una etiqueta a un Hook personalizado en las [herramientas de desarrollo de React.](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Añadir una etiqueta a un Hook personalizado {/*adding-a-label-to-a-custom-hook*/}

Llama a `useDebugValue` al principio de tu [Hook personalizado](/learn/reusing-logic-with-custom-hooks) para mostrar un <CodeStep step={1}>valor de depuración</CodeStep> legible para las [herramientas de desarrollo de React.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

Esto le da a los componentes llamados `useOnlineStatus` una etiqueta como `OnlineStatus: "Online"` cuando lo inspeccionas:

![Una captura de pantalla de las herramientas de desarrollo de React mostrando el valor de depuración](/images/docs/react-devtools-usedebugvalue.png)

Sin la llamada a `useDebugValue`, solo los datos subyacentes (en este ejemplo, `true`) será mostrada.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Desconectado'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

No recomendamos añadir valores de depuración a cada Hook personalizado. Es más valioso para Hooks personalizados que son parte de librerias compartidas y que tienen una estructura de datos compleja interna que es difícil de inspeccionar.

</Note>

---

### Aplazar el formato de un valor de depuración {/*deferring-formatting-of-a-debug-value*/}

Puedes también pasar una función de formateo como segundo argumento para `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Tu función de formateo recibirá el <CodeStep step={1}>valor de depuración</CodeStep> como parámetro y debe retornar un <CodeStep step={2}>valor de visualización formateado</CodeStep>. Cuando tu componente es inspeccionado, las herramientas de desarrollo de React llamará la función de formateo y mostrará el resultado.

Esto permite evitar ejecutar una lógica de formateo potencialmente costosa a no ser que el componente este siendo inspeccionado. Por ejemplo, si `date` es un valor de fecha, esto evita llamar a `toDateString()` para cada renderizado del componente. 

---

## Referencia {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvaluevalue-format*/}

Llama a `useDebugValue` al principio de tu [Hook personalizado](/learn/reusing-logic-with-custom-hooks) para mostrar un valor de depuración legible:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[Más ejemplos arriba.](#usage)

#### Parámetros {/*parameters*/}

* `value`: El valor que quieres mostrar en las herramientas de desarrollo de React. Puede tener cualquier tipo.
* `format` **opcional**: Una función de formateo. Cuando la función es inspeccionada, las herramientas de desarrollo de React llamará la función de formateo con `value` como argumento, y mostrará el valor formateado que es retornado (que puede tener cualquier tipo). Si no especificas la función de formateo, el mismo valor `value` original se mostrará


#### Devuelve {/*returns*/}

`useDebugValue` no devuelve nada.
