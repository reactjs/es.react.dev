---
title: "'use server'"
canary: true
---

<Canary>

<<<<<<< HEAD
Esta sección está incompleta.

Estas directivas solo son necesarias si estás [usando React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) o construyendo una librería compatible con ellos.

</Wip>
=======
`'use server'` is needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.

</Canary>
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77


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

<<<<<<< HEAD
* Recuerda que los parámetros de las funciones marcadas con `'use server'` están totalmente controlados en el cliente. Por seguridad, siempre tratálos como entradas no confiables, asegúrate de validar y escapar los argumentos según corresponda.
* Para evitar la confusión que podría resultar de mezclar el código del lado del cliente y del lado del servidor en el mismo archivo, `'use server'` solo puede ser usado en archivos del lado del servidor; las funciones resultantes pueden pasarse a componentes de cliente a través de las _props_.
* Dado que las llamadas a la red subyacente son siempre asíncronas, `'use server'` solo puede utilizarse en funciones asíncronas.
* Directivas como `'use server'` deben estar en el inicio de su función o archivo, por encima de cualquier otro código incluyendo importaciones (comentarios por encima de las directivas están bien). Deben escribirse con comillas simples o dobles, no con comillas invertidas. (El formato de la directiva `'use xyz'` se parece en algo a la convención de nombres de los Hooks `useXyz()`, pero el parecido es coincidencia).
=======
* Remember that parameters to functions marked with `'use server'` are fully client-controlled. For security, always treat them as untrusted input, making sure to validate and escape the arguments as appropriate.
* To avoid the confusion that might result from mixing client- and server-side code in the same file, `'use server'` can only be used in server-side files; the resulting functions can be passed to client components through props.
* Because the underlying network calls are always asynchronous, `'use server'` can be used only on async functions.
* Directives like `'use server'` must be at the very beginning of their function or file, above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks. (The `'use xyz'` directive format somewhat resembles the `useXyz()` Hook naming convention, but the similarity is coincidental.)

## Usage {/*usage*/}

<Wip>

This section is incomplete. See also the [Next.js documentation for Server Components](https://beta.nextjs.org/docs/rendering/server-and-client-components).

</Wip>
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
