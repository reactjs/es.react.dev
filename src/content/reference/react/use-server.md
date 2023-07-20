---
title: "'use server'"
---

<Wip>

Esta sección está incompleta.

Estas directivas solo son necesarias si estás [usando React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) o construyendo una librería compatible con ellos.

</Wip>


<Intro>

`'use server'` marca funciones del lado del servidor que pueden llamarse desde el código del lado del cliente.

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `'use server'` {/*use-server*/}

Añade `'use server';` en la parte superior de una función asíncrona para marcar que la función puede ser ejecutada por el cliente.

```js
async function addToCart(data) {
  'use server';
  // ...
}

// <ProductDetailPage addToCart={addToCart} />
```

Esta función puede ser pasada al cliente. Cuando es llamada en el cliente, hará una petición de red al servidor que incluye una copia serializada de cualquier argumento pasado. Si la función del servidor devuelve un valor, ese valor será serializado y devuelto al cliente.

Alternativamente, añade `'use server'` en la parte superior de un archivo para marcar todas las exportaciones dentro de ese archivo como funciones asíncronas del servidor que pueden ser usadas en cualquier lugar, incluso importadas en los archivos de componentes de cliente.

#### Advertencias {/*caveats*/}

* Recuerda que los parámetros de las funciones marcadas con `'use server'` están totalmente controlados en el cliente. Por seguridad, siempre tratálos como entradas no confiables, asegúrate de validar y escapar los argumentos según corresponda.
* Para evitar la confusión que podría resultar de mezclar el código del lado del cliente y del lado del servidor en el mismo archivo, `'use server'` solo puede ser usado en archivos del lado del servidor; las funciones resultantes pueden pasarse a componentes de cliente a través de las _props_.
* Dado que las llamadas a la red subyacente son siempre asíncronas, `'use server'` solo puede utilizarse en funciones asíncronas.
* Directivas como `'use server'` deben estar en el inicio de su función o archivo, por encima de cualquier otro código incluyendo importaciones (comentarios por encima de las directivas están bien). Deben escribirse con comillas simples o dobles, no con comillas invertidas. (El formato de la directiva `'use xyz'` se parece en algo a la convención de nombres de los Hooks `useXyz()`, pero el parecido es coincidencia).
