---
title: "'use client'"
titleForTitleTag: "Directiva 'use client'"
---

<RSC>

`'use client'` se utiliza con [React Server Components](/reference/rsc/server-components).

</RSC>


<Intro>

`'use client'` te permite marcar qué código se ejecuta en el cliente.

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `'use client'` {/*use-client*/}

Añade `'use client'` al inicio de un archivo para marcar el módulo y sus dependencias transitivas como código del cliente.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Cuando un archivo marcado con `'use client'` es importado desde un Server Component, los [bundlers compatibles](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) tratarán la importación del módulo como una barrera entre el código que se ejecuta en el servidor y el que se ejecuta en el cliente.

Las dependencias de `RichTextEditor`, `formatDate` y `Button` también se evaluarán en el cliente independientemente de si sus módulos contienen una directiva `'use client'`. Ten en cuenta que un módulo puede ser evaluado en el servidor cuando se importa desde código del servidor y en el cliente cuando se importa desde código del cliente.

#### Advertencias {/*caveats*/}

* `'use client'` debe estar al principio del archivo, por encima de cualquier importación u otro código (los comentarios están permitidos). Debe escribirse con comillas simples o dobles, pero no con comillas invertidas.
* Cuando un módulo `'use client'` es importado desde otro módulo renderizado en el cliente, la directiva no tiene efecto.
* Cuando un módulo de componente contiene la directiva `'use client'`, cualquier uso de ese componente está garantizado que será un Client Component. Sin embargo, un componente puede seguir siendo evaluado en el cliente incluso si no tiene la directiva `'use client'`.
	* Un componente se considera Client Component si está definido en un módulo con la directiva `'use client'` o cuando es una dependencia transitiva de un módulo que contiene una directiva `'use client'`. De lo contrario, es un Server Component.
* El código que está marcado para evaluación en el cliente no se limita a componentes. Todo el código que forma parte del subárbol del módulo del cliente se envía y ejecuta en el cliente.
* Cuando un módulo evaluado en el servidor importa valores de un módulo `'use client'`, los valores deben ser un componente de React o [valores de props serializables compatibles](#passing-props-from-server-to-client-components) para ser pasados a un componente del cliente. Cualquier otro caso de uso lanzará una excepción.

### Cómo `'use client'` marca el código del cliente {/*how-use-client-marks-client-code*/}

En una aplicación React, los componentes a menudo se dividen en archivos separados, o [módulos](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

Para aplicaciones que usan React Server Components, la aplicación se renderiza en el servidor por defecto. `'use client'` introduce una barrera servidor-cliente en el [árbol de dependencias de módulos](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), creando en la practica un subárbol de módulos del cliente.

Para ilustrar mejor esto, considera la siguiente aplicación de React Server Components.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Tu cita inspiradora es:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspírame de nuevo</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don't let yesterday take up too much of today." — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

En el árbol de dependencias de módulos de esta aplicación de ejemplo, la directiva `'use client'` en `InspirationGenerator.js` marca ese módulo y todas sus dependencias transitivas como módulos del cliente. El subárbol que comienza en `InspirationGenerator.js` ahora está marcado como módulos del cliente.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="Un gráfico de árbol con el nodo superior que representa el módulo 'App.js'. 'App.js' tiene tres hijos: 'Copyright.js', 'FancyText.js' y 'InspirationGenerator.js'. 'InspirationGenerator.js' tiene dos hijos: 'FancyText.js' e 'inspirations.js'. Los nodos bajo e incluyendo 'InspirationGenerator.js' tienen un fondo amarillo para significar que este subgráfico se renderiza en el cliente debido a la directiva 'use client' en 'InspirationGenerator.js'.">
`'use client'` segmenta el árbol de dependencias de módulos de la aplicación de React Server Components, marcando `InspirationGenerator.js` y todas sus dependencias como renderizadas en el cliente.
</Diagram>

Durante el renderizado, el framework renderizará el componente root en el servidor y continuará a través del [árbol de renderizado](/learn/understanding-your-ui-as-a-tree#the-render-tree), optando por no evaluar código importado desde código marcado como cliente.

La sección del árbol de renderizado generada en el servidor se envía al cliente. El cliente, con su código del cliente descargado, completa el renderizado del resto del árbol.

<Diagram name="use_client_render_tree" height={250} width={500} alt="Un gráfico de árbol donde cada nodo representa un componente y sus hijos como componentes hijos. El nodo de nivel superior está etiquetado como 'App' y tiene dos componentes hijos 'InspirationGenerator' y 'FancyText'. 'InspirationGenerator' tiene dos componentes hijos, 'FancyText' y 'Copyright'. Tanto 'InspirationGenerator' como su componente hijo 'FancyText' están marcados para ser renderizados en el cliente.">
El árbol de renderizado para la aplicación de React Server Components. `InspirationGenerator` y su componente hijo `FancyText` son componentes exportados desde código marcado como cliente y se consideran Client Components.
</Diagram>

Introducimos las siguientes definiciones:

* **Client Components** son componentes en un árbol de renderizado que se renderizan en el cliente.
* **Server Components** son componentes en un árbol de renderizado que se renderizan en el servidor.

Trabajando a través de la aplicación de ejemplo, `App`, `FancyText` y `Copyright` se renderizan en el servidor y se consideran Server Components. Como `InspirationGenerator.js` y sus dependencias transitivas están marcadas como código del cliente, el componente `InspirationGenerator` y su componente hijo `FancyText` son Client Components.

<DeepDive>
#### ¿Cómo es que `FancyText` es tanto un Server como un Client Component? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

Por las definiciones anteriores, el componente `FancyText` es tanto un Server como un Client Component, ¿cómo puede ser esto?

Primero, aclaremos que el término "componente" no es muy preciso. Aquí hay dos formas en que "componente" puede entenderse:

1. Un "componente" puede referirse a una **definición de componente**. En la mayoría de los casos, esto será una función.

```js
// Esta es una definición de un componente
function MyComponent() {
  return <p>My Component</p>
}
```

2. Un "componente" también puede referirse a un **uso de componente** de su definición.
```js
import MyComponent from './MyComponent';

function App() {
  // Este es un uso de componente
  return <MyComponent />;
}
```

A menudo, la imprecisión no es importante al explicar conceptos, pero en este caso lo es.

Cuando hablamos de Server o Client Components, nos referimos a usos de componentes.

* Si el componente está definido en un módulo con la directiva `'use client'`, o el componente es importado y utilizado en un Client Component, entonces el uso del componente es un Client Component.
* De lo contrario, el uso del componente es un Server Component.


<Diagram name="use_client_render_tree" height={150} width={450} alt="Un gráfico de árbol donde cada nodo representa un componente y sus hijos como componentes hijos. El nodo de nivel superior está etiquetado como 'App' y tiene dos componentes hijos 'InspirationGenerator' y 'FancyText'. 'InspirationGenerator' tiene dos componentes hijos, 'FancyText' y 'Copyright'. Tanto 'InspirationGenerator' como su componente hijo 'FancyText' están marcados para ser renderizados en el cliente.">Un árbol de renderizado ilustra usos de componentes.</Diagram>

Volviendo a la pregunta de `FancyText`, vemos que la definición del componente _no_ tiene la directiva `'use client'` y tiene dos usos.

El uso de `FancyText` como hijo de `App`, marca el uso como un Server Component. Cuando `FancyText` es importado y utilizado bajo `InspirationGenerator`, ese uso de `FancyText` es un Client Component ya que `InspirationGenerator` contiene la directiva `'use client'`.

Esto significa que la definición del componente para `FancyText` será evaluada tanto en el servidor, como descargada por el cliente para renderizar su uso como Client Component.

</DeepDive>

<DeepDive>

#### ¿Por qué `Copyright` es un Server Component? {/*why-is-copyright-a-server-component*/}

Como `Copyright` se renderiza como hijo del Client Component `InspirationGenerator`, podrías sorprenderte de que sea un Server Component.

Recuerda que `'use client'` define la barrera entre el código del servidor y del cliente en el _árbol de dependencias de módulos_, no en el árbol de renderizado.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="Un gráfico de árbol con el nodo superior que representa el módulo 'App.js'. 'App.js' tiene tres hijos: 'Copyright.js', 'FancyText.js' y 'InspirationGenerator.js'. 'InspirationGenerator.js' tiene dos hijos: 'FancyText.js' e 'inspirations.js'. Los nodos bajo e incluyendo 'InspirationGenerator.js' tienen un fondo amarillo para significar que este subgráfico se renderiza en el cliente debido a la directiva 'use client' en 'InspirationGenerator.js'.">
`'use client'` define la barrera entre el código del servidor y del cliente en el árbol de dependencias de módulos.
</Diagram>

En el árbol de dependencias del módulo, vemos que `App.js` importa y llama a `Copyright` desde el módulo `Copyright.js`. Como `Copyright.js` no contiene una directiva `'use client'`, el uso del componente se renderiza en el servidor. `App` también se renderiza en el servidor ya que es el componente raíz.

Los Client Components pueden renderizar Server Components porque puedes pasar JSX como props. En este caso, `InspirationGenerator` recibe `Copyright` como [children](/learn/passing-props-to-a-component#passing-jsx-as-children). Sin embargo, el módulo `InspirationGenerator` nunca importa directamente el módulo `Copyright` ni llama al componente, todo eso lo hace `App`. De hecho, el componente `Copyright` se ejecuta completamente antes de que `InspirationGenerator` comience a renderizarse.

La conclusión es que una relación padre-hijo de renderizado entre componentes no garantiza que se rendericen en el mismo entorno.

</DeepDive>

### Cuándo usar `'use client'` {/*when-to-use-use-client*/}

Con `'use client'`, puedes determinar cuándo los componentes son Client Components. Como los Server Components son el valor predeterminado, aquí hay un breve resumen de las ventajas y limitaciones de los Server Components para determinar cuándo necesitas marcar algo para que se renderice en el cliente.

Por simplicidad, hablamos de Server Components, pero los mismos principios se aplican a todo el código en tu aplicación que se ejecuta en el servidor.

#### Ventajas de los Server Components {/*advantages*/}
* Los Server Components pueden reducir la cantidad de código envia y ejecuta en el cliente. Solo los módulos del cliente se agrupan y evalúan en el cliente.
* Los Server Components se benefician de ejecutarse en el servidor. Pueden acceder al sistema de archivos local y pueden experimentar baja latencia para obtener datos y solicitudes de red.

#### Limitaciones de los Server Components {/*limitations*/}
* Los Server Components no pueden soportar interacción ya que los controladores de eventos deben registrarse y activarse por el cliente.
	* Por ejemplo, controladores de eventos como `onClick` solo pueden definirse en Client Components.
* Los Server Components no pueden usar la mayoría de los Hooks.
	* Cuando los Server Components se renderizan, su salida es esencialmente una lista de componentes para que el cliente renderice. Los Server Components no mantienen en memoria después del renderizado y no pueden tener estado propio.

### Tipos serializables devueltos por los Server Components {/*serializable-types*/}

Como en cualquier aplicación React, los componentes padres pasan datos a los componentes hijos. Como se renderizan en diferentes entornos, pasar datos de un Server Component a un Client Component requiere consideraciones adicionales.

Los valores de props pasados de un Server Component a un Client Component deben ser serializables.

Las props serializables incluyen:
* Primitivos
	* [string](https://developer.mozilla.org/es/docs/Glossary/String)
	* [number](https://developer.mozilla.org/es/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/es/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/es/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/es/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Symbol), solo símbolos registrados en el registro global de Symbol a través de [`Symbol.for`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables que contienen valores serializables
	* [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) y [ArrayBuffer](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [Objetos](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) planos: aquellos creados con [inicializadores de objeto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), con propiedades serializables
* Funciones que son [Server Functions](/reference/rsc/server-functions)
* Elementos de Client o Server Component (JSX)
* [Promises](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notablemente, estos no son compatibles:
* [Funciones](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) que no son exportadas desde módulos marcados como cliente o marcadas con [`'use server'`](/reference/rsc/use-server)
* [Clases](https://developer.mozilla.org/es/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objetos que son instancias de cualquier clase (además de los integrados mencionados) u objetos con [un prototipo nulo](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Símbolos no registrados globalmente, ej. `Symbol('my new symbol')`


## Uso {/*usage*/}

### Construir con interactividad y estado {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Valor del contador: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

Como `Counter` requiere tanto el Hook `useState` como controladores de eventos para incrementar o decrementar el valor, este componente debe ser un Client Component y necsita una directiva `'use client'` al inicio.

En contraste, un componente que renderiza UI sin interacción no necesita ser un Client Component.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

Por ejemplo, el componente padre de `Counter`, `CounterContainer`, no requiere `'use client'` ya que no es interactivo ni tiene estado. Además, `CounterContainer` debe ser un Server Component ya que lee del sistema de archivos local en el servidor, lo cual solo es posible en un Server Component.

También hay componentes que no usan ninguna característica exclusiva del servidor o del cliente y pueden ser agnósticos a dónde se renderizan. En nuestro ejemplo anterior, `FancyText` es uno de esos componentes.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

En este caso, no añadimos la directiva `'use client'`, lo que resulta en que la _salida_ de `FancyText` (en lugar de su código fuente) se envíe al navegador cuando se hace referencia desde un Server Component. Como se demostró en el ejemplo anterior de la aplicación Inspirations, `FancyText` se usa tanto como Server o Client Component, dependiendo de dónde se importe y use.

Pero si la salida HTML de `FancyText` fuera grande en relación con su código fuente (incluyendo dependencias), podría ser más eficiente forzarlo a que siempre sea un Client Component. Los componentes que devuelven una cadena larga de ruta SVG son un caso donde podria ser más eficiente forzar un componente a ser Client Component.

### Usar APIs del cliente {/*using-client-apis*/}

Tu aplicación React puede usar APIs específicas del cliente, como las APIs del navegador para almacenamiento web, manipulación de audio y video, y hardware del dispositivo, entre [otras](https://developer.mozilla.org/es/docs/Web/API).

En este ejemplo, el componente usa [APIs DOM](https://developer.mozilla.org/es/docs/Glossary/DOM) para manipular un elemento [`canvas`](https://developer.mozilla.org/es/docs/Web/HTML/Element/canvas). Como esas APIs solo están disponibles en el navegador, debe marcarse como un Client Component.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Usar bibliotecas de terceros {/*using-third-party-libraries*/}

A menudo en una aplicación React, aprovecharás bibliotecas de terceros para manejar patrones o lógica de UI comunes.

Estas bibliotecas pueden depender de Hooks de componentes o APIs del cliente. Los componentes de terceros que usan cualquiera de las siguientes APIs de React deben ejecutarse en el cliente:
* [createContext](/reference/react/createContext)
* Hooks de [`react`](/reference/react/hooks) y [`react-dom`](/reference/react-dom/hooks), excluyendo [`use`](/reference/react/use) y [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* Si usan APIs del cliente, ej. inserción DOM o vistas de plataforma nativa

Si estas bibliotecas han sido actualizadas para ser compatibles con React Server Components, entonces ya incluirán marcadores `'use client'` propios, permitiéndote usarlas directamente desde tus Server Components. Si una biblioteca no ha sido actualizada, o si un componente necesita props como controladores de eventos que solo pueden definirse en el cliente, es posible que necesites agregar tu propio archivo de Client Component entre el Client Component de terceros y tu Server Component donde te gustaría usarlo.

[TODO]: <> (Solución de problemas - necesito casos de uso)