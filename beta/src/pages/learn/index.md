---
title: Inicio rápido
---

<Intro>

¡Bienvenido a la documentación de React! Esta página te dará una introducción al 80% de los conceptos de React que usarás a diario.

</Intro>

<YouWillLearn>

- Cómo crear y anidar componentes
- Cómo añadir marcado y estilos
- Cómo mostrar datos
- Cómo renderizar condicionales y listas
- Cómo responder a eventos y actualizar la pantalla
- Cómo compartir datos entre componentes

</YouWillLearn>

## Crear y anidar componentes {/*components*/}

<<<<<<< HEAD
Las aplicaciones de React están hechas a partir de componentes. Un componente es una pieza de UI (siglas en inglés de interfaz de usuario) que tiene su propia lógica y apariencia. Un componente puede ser tan pequeño como un botón, o tan grande como toda una página.
=======
React apps are made out of *components*. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

Los componentes de React son funciones de JavaScript que retornan marcado (*markup*):

```js
function MyButton() {
  return (
    <button>Click me</button>
  );
}
```

Ahora que has declarado `MyButton`, puedes anidarlo en otro componente:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Nota que `<MyButton />` empieza con mayúscula. Así es como sabes que es un componente de React. Los nombres de los componentes de React siempre deben comenzar con mayúscula, mientras las etiquetas HTML deben estar minúsculas.

Mira el resultado:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Click me
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

Las palabras clave `export default` especifican el componente principal en el archivo. Si no estás familiarizado con alguna parte de la sintaxis de JavaScript, [MDN](https://developer.mozilla.org/es/docs/web/javascript/reference/statements/export) y [javascript.info](https://javascript.info/import-export) tienen magníficas referencias.

## Escribir marcado con JSX {/*writing-markup-with-jsx*/}

<<<<<<< HEAD
La sintaxis de marcado que viste arriba se llama JSX. Es totalmente opcional, pero la mayoría de los proyectos de React usan JSX por la comodidad que ofrece. Todas las [herramientas que recomendamos para el desarrollo local](/learn/installation) son compatibles con JSX sin ningún tipo de configuración.
=======
The markup syntax you've seen above is called *JSX*. It is optional, but most React projects use JSX for its convenience. All of the [tools we recommend for local development](/learn/installation) support JSX out of the box.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

JSX es más estricto que HTML. Tienes que cerrar etiquetas como `<br />`. Tu componente tampoco puede devolver múltiples etiquetas de JSX. Debes envolverlas en un padre compartido, como `<div>...</div>` o en un envoltorio vacío `<>...</>`:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

Si tienes mucho HTML que convertir a JSX, puedes utilizar un [convertidor en línea](https://transform.tools/html-to-jsx).

## Añadir estilos {/*adding-styles*/}

En React, especificas una clase de CSS con `className`. Funciona de la misma forma que el atributo [`class`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/class) de HTML:

```js
<img className="avatar" />
```

Luego escribes las reglas CSS para esa clase en un archivo CSS aparte:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React no prescribe como debes añadir tus archivos CSS. En el caso más simple, añades una etiqueta [`<link>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/link) a tu HTML. Si utilizas una herramienta de construcción o un framework, consulta su documentación para saber como añadir un archivo CSS a tu proyecto.

## Mostrar datos {/*displaying-data*/}

JSX te permite poner marcado dentro de JavaScript. Las llaves te permiten «escapar de nuevo» hacia JavaScript de forma tal que puedas incrustar una variable de tu código y mostrársela al usuario. Por ejemplo, esto mostrará `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

También puedes «escaparte hacia JavaScript» en los atributos JSX, pero tienes que utilizar llaves *en lugar de* comillas. Por ejemplo, `className="avatar"` pasa la cadena `"avatar"` como la clase CSS, pero `src={user.imageUrl}` lee el valor de la variable de JavaScript `user.imageUrl` y luego pasa el valor como el atributo `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Puedes también poner expresiones más complejas dentro de llaves, por ejemplo, [concatenación de cadenas](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

En el ejemplo de arriba, `style={{}}` no es una sintaxis especial, sino un objeto regular `{}` dentro de las llaves de JSX de `style={ }`. Puedes utilizar el atributo `style` cuando tus estilos dependen de variables de JavaScript.

## Renderizado condicional {/*conditional-rendering*/}

En React, no hay una sintaxis especial para escribir condicionales. En cambio, usarás las mismas técnicas que usas al escribir código regular de JavaScript. Por ejemplo, puedes usar una sentencia [`if`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/if...else) para incluir JSX condicionalmente:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Si prefieres un código más compacto, puedes utilizar el [operador `?` condicional](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). A diferencia de `if`, funciona dentro de JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Cuando no necesites la rama `else`, puedes también usar la [sintaxis lógica `&&`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation), más breve:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Todos estos enfoques también funcionan para especificar atributos condicionalmente. Si no estás familiarizado con toda esta sintaxis de JavaScript, puedes comenzar por usar siempre `if...else`.

## Renderizado de listas {/*rendering-lists*/}

Dependerás de funcionalidades de JavaScript como los [bucles `for`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for) y la [función map() de los arreglos](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map) para renderizar listas de componentes.

Por ejemplo, digamos que tienes un arreglo de productos:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

Dentro de tu componente, utiliza la función `map()` para transformar el arreglo de productos en un arreglo de elementos `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Nota que `<li>` tiene un atributo `key` (llave). Para cada elemento en una lista, debes pasar una cadena o un número que identifique ese elemento de forma única entre sus hermanos. Usualmente, una llave debe provenir de tus datos, como un ID de una base de datos. React dependerá de tus llaves para entender qué ha ocurrido si luego insertas, eliminas o reordenas los elementos.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Responder a eventos {/*responding-to-events*/}

<<<<<<< HEAD
Puedes responder a eventos declarando funciones de manejo de eventos dentro de tus componentes:
=======
You can respond to events by declaring *event handler* functions inside your components:
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

¡Nota que `onClick={handleClick}` no tiene paréntesis al final! No _llames_ a la función manejadora de eventos: solamente necesitas *pasarla hacia abajo*. React llamará a tu manejador de eventos cuando el usuario haga clic en el botón.

## Actualizar la pantalla {/*updating-the-screen*/}

A menudo, querrás que tu componente «recuerde» alguna información y la muestre. Por ejemplo, quizá quieras contar el número de veces que se hace clic en un botón. Para lograrlo, añade *estado* a tu componente.

Primero, importa [`useState`](/apis/usestate) de React:

```js {1,4}
import { useState } from 'react';
```

Ahora puedes declarar una *variable de estado* dentro de tu componente:

```js
function MyButton() {
  const [count, setCount] = useState(0);
```

Obtendrás dos cosas de `useState`: el estado actual (`count`), y la función que te permite actualizarlo (`setCount`). Puedes nombrarlos de cualquier forma, pero la convención es llamarlos algo como `[something, setSomething]`.

La primera vez que se muestra el botón, `count` será `0` porque  pasaste `0` a `useState()`. Cuando quieras cambiar el estado llama a `setCount()` y pásale el nuevo valor. Al hacer clic en este botón se incrementará el contador:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React llamará de nuevo a la función del componente. Esta vez, `count` será `1`. Luego será `2`. Y así sucesivamente.

Si renderizas el mismo componente varias veces, cada uno obtendrá su propio estado. Intenta hacer clic independientemente en cada botón:

<Sandpack>

```js
import { useState } from 'react';

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Nota que cada botón «recuerda» su propio estado `count` y que no afecta a otros botones.

## El uso de los Hooks {/*using-hooks*/}

<<<<<<< HEAD
Las funciones que comienzan con `use` se llaman Hooks. `useState` es un Hook nativo dentro de React. Puedes encontrar otros Hooks nativos en la [referencia de la API de React](/apis). También puedes escribir tus propios Hooks mediante la combinación de otros existentes.
=======
Functions starting with `use` are called *Hooks*. `useState` is a built-in Hook provided by React. You can find other built-in Hooks in the [React API reference](/apis). You can also write your own Hooks by combining the existing ones.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

Los Hooks son más restrictivos que las funciones regulares. Solo puedes llamar a los Hooks *en el primer nivel* de tus componentes (u otros Hooks). Si quisieras utilizar `useState` en una condicional o en un bucle, extrae un nuevo componente y ponlo ahí.

## Compartir datos entre componentes {/*sharing-data-between-components*/}

En el ejemplo anterior, cada `MyButton` tenía su propio `count` independiente, y cuando se hacía clic en cada botón, solo el `count` del botón cliqueado cambiaba:

<DiagramGroup>

<<<<<<< HEAD
<Diagram name="sharing_data_child" height={734} width={814} alt="Diagrama que muestra un árbol de tres componentes, un padre etiquetado como MyApp y dos hijos etiquetados como MyButton. Ambos componentes MyButton contienen una variable count con valor cero.">

Antes de hacer clic, cada MyButton tiene un valor de count puesto en cero.

</Diagram>

<Diagram name="sharing_data_child_clicked" height={734} width={814} alt="El mismo diagrama anterior, con la variable count del primero hijo MyButton señalada indicando un clic con el valor de count incrementado a uno. El segundo componente MyButton aún contiene el valor cero." >

Luego de hacer click solo un count de MyButton se actualiza.
=======
<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Initially, each `MyButton`'s `count` state is `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

The first `MyButton` updates its `count` to `1`
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

</Diagram>

</DiagramGroup>

Sin embargo, a menudo necesitas que los componentes *compartan datos y se actualicen siempre en conjunto*.

Para hacer que ambos componentes `MyButton` muestren el mismo `count` y se actualicen juntos, necesitas mover el estado de los botones individuales «hacia arriba» al componente más cercano que los contiene a todos.

En este ejemplo, es `MyApp`:

<DiagramGroup>

<<<<<<< HEAD
<Diagram name="sharing_data_parent" height={770} width={820} alt="Diagrama que muestra un árbol de tres componentes, un padre etiquetado como MyApp y dos hijos etiquetados como MyButton. MyApp contiene count con valor cero que se pasa hacia abajo a los dos componentes MyButton, que también tienen valor cero." >

Antes de hacer clic, count se almacena en MyApp y se pasa hacia abajo a los dos hijos como props.

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={770} width={820} alt="El mismo diagrama anterior con la variable count del componente padre MyApp señalada indicando un clic con el valor incrementado a uno. El flujo de ambos componentes hijo MyButton también está señalado y el valor de count en cada hijo está en uno indicando que el valor se pasó hacia abajo." >

Luego de hacer clic, count se actualiza en MyApp y el valor nuevo se pasa a ambos hijos como props.
=======
<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Initially, `MyApp`'s `count` state is `0` and is passed down to both children

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

On click, `MyApp` updates its `count` state to `1` and passes it down to both children
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

</Diagram>

</DiagramGroup>

Ahora cuando haces clic en cualquiera de los botones, `count` en `MyApp` cambiará, lo que causará que cambien ambos counts en `MyButton`. Aquí está como puedes expresarlo con código.

Primero, *mueve el estado hacia arriba* desde `MyButton` hacia `MyApp`:

```js {2,6-10}
function MyButton() {
  // ... we're moving code from here ...
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}
```

Luego, *pasa el estado hacia abajo* desde `MyApp` hacia cada `MyButton`, junto con la función compartida para manejar el evento de clic. Puedes pasar la información a `MyButton` usando las llaves de JSX, de la misma forma como lo hiciste anteriormente con las etiquetas nativas `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

La información que pasas hacia abajo se llaman _props_. Ahora el componente `MyApp` contiene el estado `count` y el manejador de eventos `handleClick`, y *pasa ambos hacia abajo como props* a cada uno de los botones.

Finalmente, cambia `MyButton` para que *lea* las props que le pasaste desde el componente padre:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

Cuando haces clic en el botón, el manejador `onClick` se dispara. A la prop `onClick` de cada botón se le asignó la función `handleClick` dentro de `MyApp`, de forma que el código dentro de ella se ejecuta. Ese código llama a `setCount(count + 1)`, que incremente la variable de estado `count`. El nuevo valor de `count` se pasa como prop a cada botón, y así todos muestran el nuevo valor.

Esto se llama «levantar el estado hacia arriba». Al mover el estado hacia arriba, lo compartimos entre componentes.

<Sandpack>

```js
import { useState } from 'react';

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Próximos pasos {/*next-steps*/}

¡En este punto ya conoces los elementos básicos de como escribir código en React!

Dirígete a [Pensar en React](/learn/thinking-in-react) para que veas como se siente en la práctica construir una interfaz de usuario con React.
