---
title: "'use server'"
canary: true
---

<Canary>

`'use server'` sólo es necesario si estás [usando React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) o construyendo una librería compatible con ellos.

</Canary>

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

* Recuerda que los parámetros de las funciones marcadas con `'use server'` están totalmente controlados por el cliente. Por seguridad, trátalos siempre como entradas no confiables, asegurándote de validar y escapar los argumentos como sea apropiado.
* Para evitar la confusión que podría resultar de mezclar código del lado del cliente y del lado del servidor en el mismo archivo, `'use server'` sólo puede usarse en archivos del lado del servidor; las funciones resultantes pueden pasarse a componentes del cliente a través de _props_.
* Dado que las llamadas de red subyacentes son siempre asíncronas, `'use server'` sólo puede usarse en funciones asíncronas.
* Directivas como `'use server'` deben estar al principio de tu función o fichero, por encima de cualquier otro código incluyendo importaciones (los comentarios sobre las directivas están bien). Deben escribirse con comillas simples o dobles, no con comillas invertidas. (El formato de la directiva `'use xyz'` se parece un poco a la convención de nomenclatura del Hook `useXyz()`, pero el parecido es coincidencia).

## Uso {/*usage*/}

<Wip>

Esta sección está incompleta. Consulte también la [Documentación de Next.js para componentes de servidor](https://beta.nextjs.org/docs/rendering/server-and-client-components).

</Wip>
