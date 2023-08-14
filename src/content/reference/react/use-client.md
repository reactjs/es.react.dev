---
title: "'use client'"
canary: true
---

<Canary>

<<<<<<< HEAD
Estas directivas son necesarias sólo si estás [usando React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) o desarrollando una biblioteca compatible con ellos.

</Note>
=======
`'use client'` is needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.
</Canary>
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77


<Intro>

`'use client'` marca los archivos fuente cuyos componentes se ejecutan en el cliente.

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `'use client'` {/*use-client*/}

Agrega `'use client';` en la parte superior de un archivo para marcar que este archivo (incluyendo cualquier componente hijo que utilice) se ejecuta en el cliente, independientemente de dónde se importe.

```js
'use client';

import { useState } from 'react';

export default function RichTextEditor(props) {
  // ...
```

Cuando un archivo marcado con `'use client'` es importado desde un componente de servidor, los [bundlers compatibles](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) manejan la importación como el "punto de corte" entre el código exclusivo del servidor y el código del cliente. Los componentes en o por debajo de este punto en el gráfico del módulo pueden utilizar características exclusivas de React para el cliente, como [`useState`](/reference/react/useState).

#### Advertencias {/*caveats*/}

* No es necesario añadir `'use client'` a cada archivo que utiliza características exclusivas de React para el cliente, sólo los archivos que son importados desde archivos de componentes de servidor. `'use client'` marca la _barrera_  entre el código exclusivo del servidor y el código del cliente; cualquier componente más abajo en el árbol se ejecutará automáticamente en el cliente. Para ser renderizados desde componentes de servidor, los componentes exportados desde archivos con `'use client'` deben tener props serializables.
* Cuando se importa un archivo con `'use client'` desde un archivo de servidor, los valores importados pueden ser renderizados como un componente de React o o pasados mediante props a un componete del cliente. Cualqueir otro uso lanzará una excepción.
* Cuando se importa un archivo con `'use client'` desde otro archivo del cliente, la directiva no tiene efecto. Esto te permite escribir componentes exclusivos del cliente que pueden ser utilizados simultáneamente desde componentes del servidor y del cliente.
* Todo el código en un archivo `'use client'`, así como cualquier módulo que importe (directa o indirectamente), formará parte del gráfico de módulos del cliente y debe ser enviado y ejecutado por el cliente para ser renderizado en el navegador. Para reducir el tamaño del paquete del cliente y aprovechar al máximo el servidor, mueve el estado (y las directivas `'use client'`) más abajo en el árbol cuando sea posible y pasa los componetes del servidor renderizados [como hijos](/learn/passing-props-to-a-component#passing-jsx-as-children) a los componentes del cliente.
* Debido a que las props se serializan a través de la barrera servidor-cliente, ten en cuenta que la colocación de estas directivas puede afectar a la cantidad de datos enviados al cliente; evita estructuras de datos más grandes de lo necesario.
* Componentes como `<MarkdownRenderer>` que no utilizan características exclusivas ni del servidor ni del cliente, generalmente no deben ser marcados con `'use client'`. De esta manera, pueden renderizarse exclusivamente en el servidor cuando se utilizan desde un componente de servidor y se agregarán al paquete del cliente cuando se utilicen desde un componente del cliente.
* Las bibliotecas publicadas en npm deben incluir `'use client'` en los componentes de React exportados que puedan renderizarse con props serializables y que utilicen características exclusivas de React para el cliente, para permitir que esos componentes sean importados y renderizados por componentes de servidor. De lo contrario, los usuarios deberán envolver los componentes de la biblioteca en sus propios archivos con `'use client'`, lo que puede ser incómodo y evitar que la biblioteca mueva la lógica al servidor en un futuro. Al publicar archivos precompilados a npm, asegúrate de que los archivos fuente con `'use client'` terminen en un paquete marcado con `'use client'`, separado de cualquier paquete que contenga exportaciones que se puedan utilizar directamente en el servidor.
* Los componentes del cliente seguirán ejecutándose como parte del renderizado del lado del servidor (SSR) o en la generación de sitios estáticos en tiempo de compilación (SSG), que actúan como clientes para transformar la salida de renderización inicial de los componentes de React en HTML la cuál se puede renderizar antes de que se descarguen los paquetes de javascript. Pero, no pueden utilizar características exclusivas del servidor, como la lectura directa desde una base de datos.
* Las directivas como `'use client'` deben estar al comienzo del archivo, antes que cualquier importación u otro código (los comentarios arriba de las directivas están permitidos). Deben escribirse con comillas simples o dobles, no con comillas invertidas. (El formato de la directiva `'use xyz'` se asemeja un poco a la convención de nombres `useXyz()` de los Hooks, pero la similitud es coincidencia.)

## Uso {/*usage*/}

<Wip>

Esta sección está incompleta. Revisa también la [documentación de Next.js para componentes de servidor](https://beta.nextjs.org/docs/rendering/server-and-client-components).

</Wip>
