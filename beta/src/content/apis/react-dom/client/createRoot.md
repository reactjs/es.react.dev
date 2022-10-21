---
title: createRoot
---

<Intro>

`createRoot` te permite crear una raíz para mostrar componentes de React dentro de un nodo del DOM del navegador.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Renderizar una app construida completamente con React {/*rendering-an-app-fully-built-with-react*/}

Si tu app está construida completamente con React, crea una raíz única para tu app entera.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
````

Usualmente, solo necesitarás ejecutar este código una vez al inicio. Este código:

1. Encontrará el <CodeStep step={1}>nodo del DOM del navegador</CodeStep> definido en tu HTML.
2. Mostrará el <CodeStep step={2}>componente de React</CodeStep> para tu app.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Este es el nodo del DOM -->
    <div id="root"></div>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

**Si tu app está construida completamente con React, no deberías necesitar crear más raíces, o llamar a [`root.render`](#root-render) otra vez.** 

A partir de este punto, React administrará el DOM de tu app entera. Para agregar más componentes, [anídelos dentro del componente de la `App`.](/learn/importing-and-exporting-components) Cuando necesitas actualizar la interfaz del usuario (UI), cada uno de tus componentes puede lograr [por usar el estado.](/apis/react/useState) Cuando necesitas mostrar contenido adicional como un modal o herramientas de ayuda fuera del nodo del DOM, [renderizar con un portal.](/apis/react-dom/createPortal)

<Note>

Cuando tu HTML está vacío, el usuario ve una página en blanco hasta que el código de Javascript de la app se cargue y ejecute:

```html
<div id="root"></div>
```

¡Esto puede sentirse muy lento! Para resolver esto, puede generar el HTML inicial a partir de tus componentes [en el servidor o durante la compilación.](/apis/react-dom/server) Entonces tus visitantes pueden leer el texto, ver imágenes, y hacer clic en los enlaces antes de que se cargue cualqueria de los códigos de Javascript. Recomendamos [utilizar un framework](/learn/start-a-new-react-project#building-with-a-full-featured-framework) que realice esta optimización de forma inmediata. Dependiendo de cuando se ejecuta, se llama *renderizar de lado del servidor (SSR)*  o *generación de sitios estáticos (SSG)*

</Note>

<Pitfall>

**Aplicaciónes que utiliza la renderización del servidor o la generación estática deben llamar a [`hydrateRoot`](/apis/react-dom/client/hydrateRoot) en lugar de `createRoot`.** React luego se *hidratará* (reutilizar) los nodos del DOM de tu HTML en lugar de destruirlos y volver a crearlos.

</Pitfall>

---

### Renderizar una página construida parcialmente con React {/*rendering-a-page-partially-built-with-react*/}

Si tu página [no está construida completamente con React](/learn/add-react-to-a-website), puedes llamar a `createRoot` varias veces para crear una raíz para cada pieza de nivel superior del interfaz de usuario (UI) administrada por React. Puede mostrar contenido diferente en cada raíz por llamar a [`root.render`.](#root-render)

Aquí, dos componentes diferentes de React se renderizan a dos nodos del DOM definidos en el archivo `index.html`:

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

También se puede crear un nodo del DOM nuevo con [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) y añadirlo al documento manualmente.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // Puedes añadirlo por cualquier parte del documento
```

Para quitar el árbol de React del nodo del DOM y limpiar todos los recursos utilizados por él, llama a [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Mayormente es útil si tus componentes de React están dentro de una app escrita en otro framework.

---

### Actualización de un componente raíz {/*updating-a-root-component*/}

Puedes llamar a `render` más de una vez en la misma raíz. Siempre que el árbol de componentes corresponda con lo que se había renderizado anteriormente, React [mantendrá el estado.](/learn/preserving-and-resetting-state) Ten en cuenta que se puede escribir en el input que significa que las actualizaciones por llamar a `render` cada segundo en este ejemplo no son destructivos:

<Sandpack>

```js index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

No es común llamar `render` más de una vez. En cambio, se suele [actualizar el estado](/apis/react/useState) dentro de uno de los componentes.

---
## Referencia {/*reference*/}

### `createRoot(domNode, options?)` {/*create-root*/}

Llama a `createRoot` para crear una raíz de React y mostrar contenido dentro de un elemento del DOM del navegador.

```js
const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React creará una raíz para el `domNode` y tomará el control sobre manejar el DOM dentro de él. Después de crear una raíz, se necesita llamar a [`root.render`](#root-render) para mostrar un componente de React dentro de él:

```js
root.render(<App />);
```

Una app construida completamente con React suele llamar `createRoot` una vez para su componente de raíz. Una página que utiliza un poco de React para unas partes de la página puede tener tantas raíces como sean necesarias.

[Ver ejemplos hacia arriba.](#usage)

#### Parámetros {/*parameters*/}


* `domNode`: Un [elemento del DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React creará una raíz para este elemento del DOM y te permite que puedas llamar funciones en la raíz, como `render` y mostrar el contenido renderizado por React.

* **opcional** `opciones`: Un objeto contiene opciones para esta raíz React.

  * `onRecoverableError`: callback opcional llamado cuando React se recupera de errores automáticamente.
  * `identifierPrefix`: prefijo opcional que React utiliza para IDs generados por [`useId`.](/apis/react/useId) Útil para evitar conflictos cuando se utiliza raíces varias en la misma página.
#### Retornos {/*returns*/}

`createRoot` retorna un objeto con dos métodos: [`render`](#root-render) y [`unmount`.](#root-unmount)

#### Advertencias {/*caveats*/}

* Si tu app se renderiza por el servidor, usar `createRoot()` no es soportado. En cambio, utiliza [`hydrateRoot()`](/apis/react-dom/client/hydrateRoot).
* Probablemente, solo se llamará `createRoot` una vez en tu app. Si se utiliza un framework, puede que se haga por ti.
* Cuando quieres renderizar una pieza de JSX en otra parte del árbol del DOM que no es un hijo de tu componente (por ejemplo, un modal o una herramienta de ayuda), ocupa [`createPortal`](/apis/react-dom/createPortal) en vez de `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Llama `root.render` para mostrar una pieza de [JSX](/learn/writing-markup-with-jsx) ("React node") en el nodo del DOM del navegador de la raíz de React.

```js
root.render(<App />);
```

React mostrará `<App />` en la `root` y se encargará de administrar el DOM dentro de él.

[Ver ejemplos arriba](#usage)

#### Parámetros {/*root-render-parameters*/}

* `reactNode`: Un *Nodo de React* que desea mostrar. Por lo general, será una pieza de JSX como `<App />`, pero también puedes pasar un elemento de React construido con [`createElement()`](/apis/react/createElement), una string, un número, `null`, o `undefined`.


#### Retornos {/*root-render-returns*/}

`root.render` devuelve `undefined`.

#### Advertencias {/*root-render-caveats*/}

* La primera vez que tú llamas a `root.render`, React borrará todo el contenido HTML existente dentro de la raíz de React antes de representar el componente de React en él.

* Si el nodo del DOM de su raíz contiene HTML generado por React en el servidor o durante la compilación , usa [`hydrateRoot()`](/apis/react-dom/client/hydrateRoot) en cambio, que adjunta los controladores de eventos al HTML existente.

* Si tú llamas a `render` en la misma raíz más de una vez, React actualizará el DOM según sea necesario para reflejar el último JSX que pasó. React decidirá qué partes del DOM se pueden reutilizar y cuáles deben ser recreadas por ["emparejarlo"](/learn/preserving-and-resetting-state) con el árbol renderizado previamente. Llamar a `render` en la misma raíz nuevamente es similar a llamar a la [funcion `set`](/apis/react/useState#setstate) en el componente de raíz: React evita actualizaciones del DOM innecesarias.

---

### `root.unmount()` {/*root-unmount*/}

Llama a `root.unmount` para destruir un árbol renderizado dentro de una raíz de React.

```js
root.unmount();
```

Una app completamente construida con React usualmente no tendrá ninguna llamada a `root.unmount`.

Esto es principalmente útil si el nodo del DOM de su raiz de React (o cualquiera de sus ancestros) puede ser eliminado del DOM por algún otro código. Por ejemplo, imagine un panel de pestañas de jQuery que elimine las pestañas inactivas del DOM. Si se elimina una pestaña, todo lo que contiene (incluidas las raíces de React) también se eliminará del DOM. En ese caso, debe decirle a React que "detenga" la administración del contenido de la raíz eliminada por llamar a `root.unmount`. Si no, los componentes dentro de la raíz eliminada no sabrán cómo limpiar y liberar recursos globales como suscripciones.

Llamar a `root.unmount` desmontará todos los componentes en la raíz y "separará" React de la raíz del nodo del DOM, incluida la eliminación de cualquier controlador de eventos o estado en el árbol. 


#### Parámetros {/*root-unmount-parameters*/}

`root.unmount` no acepta ningún parámetro.


#### Retornos {/*root-unmount-returns*/}

`root.unmount` devuelve `undefined`.

#### Advertencias {/*root-unmount-caveats*/}

* Llamar a `root.unmount` desmontará todos los componentes en el árbol y "separará" React de la raíz del nodo del DOM.

* Una vez que llame a `root.unmount`, no podrá volver a llamar a `root.render` en la misma raíz. Intentar llamar a `root.render` en una raíz desmontada generará el error "No se puede actualizar una raíz desmontada". Sin embargo, puede crear una nueva raíz para el mismo nodo DOM después de que se haya desmontado la raíz anterior para ese nodo.

---

## Solución de problemas {/*troubleshooting*/}

### He creado una raíz, pero no se muestra nada {/*ive-created-a-root-but-nothing-is-displayed*/}

Asegúrate de no haber olvidado realmente *renderizar* tu app en la raíz:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Hasta que no hagas eso, no se muestra nada.

---

### Recibo un error: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Este error significa que lo que esté pasando a `createRoot` no es un nodo del DOM.

Si no estás seguro de lo que está pasando, intenta registrarlo:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Por ejemplo, si `domNode` es `null`, significa que [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) devolvió `null`. Esto pasa si no hay ningún nodo en el documento con la ID dado en el momento de su llamada. Puede haber algunas razones para ello:

1. El ID que está buscando puede diferir del ID que usaste en el archivo HTML. ¡Comprueba si hay errores tipográficos!
2. La etiqueta `<script>` de su paquete no puede "ver" ningún nodo del DOM que aparezca *after* de él en el HTML.

Si no puedes hacerlo funcionar, consulta [Adding React to a Website](/learn/add-react-to-a-website) para ver un ejemplo que sirve.

Otra forma común de obtener este error es escribir `createRoot(<App />)` en lugar de `createRoot(domNode)`.

---

### Recibo un error: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Este error significa que lo que pases a `root.render` no es un componente de React.

Esto puede occurrir si llamas a `root.render` con `Component` en lugar de `<Component />`:

```js {2,5}
// 🚩 Incorrecto: App es una función, no un Componente.
root.render(App);

// ✅ Correcto: <App /> es un componente.
root.render(<App />);
```

O si pasas una función a `root.render`, en lugar del resultado de llamarle:

```js {2,5}
// 🚩 Incorrecto: createApp es una función, no un componente.

// ✅ Correcto: llama a createApp para devolver un componente.
root.render(createApp());
```

Si no puedes hacerlo funcionar, consulte [Agregando React a un sitio web](/learn/add-react-to-a-website) para un ejemplo que funciona.

---

### Mi HTML renderizado por el servidor se recrea desde cero {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Si tú app está renderizada por el servidor e incluye el HTML inicial generado por React, puedes notar que crear una raíz y llamar a `root.render` elimina todo ese HTML, y luego recrear todos los nodos del DOM desde cero. Esto puede ser más lento, restablece el enfoque y las posiciones de desplazamiento y puede perder otras entradas del usuario.

Rutas renderizadas por el servidor deben usar [`hydrateRoot`](/apis/react-dom/client/hydrateRoot) en lugar de `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Ten en cuenta que tu API es diferente. En particular, usualmente no llamará a `root. render`.
