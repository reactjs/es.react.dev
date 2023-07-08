---
title: render
---

<Deprecated>

Esta API se eliminará en una futura versión mayor de React.

En React 18, `render` fue reemplazado por [`createRoot`.](/reference/react-dom/client/createRoot) Al usar `render` en React 18 se te advertirá que tu aplicación se comportará como si estuviera ejecutándose en React 17. Aprende más [aquí.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`render` renderiza una pieza de [JSX](/learn/writing-markup-with-jsx) ("nodo de React") en un nodo del DOM del navegador.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Utiliza `render` para mostrar un componente de React dentro de un elemento del DOM del navegador.

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

React mostrará `<App />`  en el `domNode`, y se encargará de gestionar el DOM dentro de él.

Una aplicación totalmente construida con React tendrá usualmente una sola llamada a `render` con su componente raíz. Una página que utiliza React para partes de la página puede tener tantas llamadas a `render` como sean necesarias.

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: Un *nodo de React* que quieras mostrar. Por lo general se trata de una pieza de JSX como `<App />`, pero también puedes pasar un elemento de React construido con [`createElement()`](/reference/react/createElement), un _string_, un número, `null`, o `undefined`.

* `domNode`: Un [elemento del DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React mostrará el `reactNode` que pases dentro de este elemento del DOM. Desde este momento, React administrará el DOM dentro de `domNode` y lo actualizará cuando tu árbol de React cambie.

* `callback` **opcional**: Una función. Si se pasa, React la llamará luego de que tu componente sea colocado dentro del DOM.


#### Retorno {/*returns*/}

`render` Por lo general retorna `null`. Sin embargo, si el `reactNode` que pasas es un *component de clase*, entonces retornará una instancia de ese componente.

#### Advertencias {/*caveats*/}

* En React 18, `render` fue reemplazado por [`createRoot`.](/reference/react-dom/client/createRoot) Por favor usa `createRoot` para React 18 y versiones posteriores.

* La primera vez que llamas a `render`, React limpiará todo el contenido HTML existente dentro del `domNode` antes de renderizar el componente de React dentro de este. Si tu `domNode` contiene HTML generado por React en el servidor o durante la compilación, usa en su lugar [`hydrate()`](/reference/react-dom/hydrate), ya que este adjunta los manejadores de eventos al HTML existente.

* Si llamas a `render` en el mismo `domNode` más de una vez, React actualizará el DOM según sea necesario para reflejar el JSX más reciente que hayas pasado. React decidirá qué partes del DOM se pueden reutilizar y cuáles necesitan ser recreadas ["haciendo una comparación"](/learn/preserving-and-resetting-state) con el árbol previamente renderizado. Llamar de nuevo a `render` en el mismo `domNode` es similar a llamar a la función [`set` ](/reference/react/useState#setstate) en el componente raíz: React evita actualizaciones innecesarias del DOM.

* Si tu aplicación está totalmente construida con React, es probable que tengas una sola llamada a `render` en tu aplicación. (Si usas un framework, puede que haga esta llamada por ti.) Cuando quieras renderizar un fragmento de JSX en un lugar diferente del árbol del DOM que no sea hijo de tu componente (por ejemplo, un modal o un _tooltip_), usa [`createPortal`](/reference/react-dom/createPortal) en lugar de `render`.

---

## Uso {/*usage*/}

Usa `render` para mostrar un <CodeStep step={1}>componente de React</CodeStep> dentro de un <CodeStep step={2}>nodo DOM del navegador</CodeStep>.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### Renderiza el componente raíz {/*rendering-the-root-component*/}

En aplicaciones totalmente construidas con React, **por lo general sólo realizarás esto una vez al inicio** --para renderizar el componente "raíz".

<Sandpack>

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>¡Hola, mundo!</h1>;
}
```

</Sandpack>

Generalmente no necesitas llamar a `render` de nuevo o llamarlo en otros lugares. En este punto, React manejará el DOM de tu aplicación. Si quieres actualizar la UI, tu componente puede hacerlo [con el uso de estado.](/reference/react/useState)

---

### Renderizar múltiples raíces {/*rendering-multiple-roots*/}

Si tu página [no está totalmente construida con React](/learn/add-react-to-a-website), llama a `render` por cada pieza de UI de nivel superior que esté administrada por React.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>Este párrafo no está renderizado por React (abre el archivo index.html para verificarlo).</p>
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
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
      <Comment text="¡Hola!" author="Sophie" />
      <Comment text="¿Cómo estás?" author="Sunil" />
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

Puedes destruir los árboles renderizados con [`unmountComponentAtNode()`.](/reference/react-dom/unmountComponentAtNode)

---

### Actualizar el árbol renderizado {/*updating-the-rendered-tree*/}

Puedes llamar a `render` más de una vez en el mismo nodo del DOM. Siempre y cuando la estructura del árbol del componente coincida con lo renderizado previamente, React [preservará el estado.](/learn/preserving-and-resetting-state) Nota como puedes escribir en el input, lo que significa que las repetidas llamadas a `render` cada segundo en este ejemplo no son destructivas:

<Sandpack>

```js index.js active
import { render } from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>¡Hola, mundo! {counter}</h1>
      <input placeholder="Escribe algo aquí" />
    </>
  );
}
```

</Sandpack>

No es muy común llamar a `render` varias veces. Por lo general lo que debes hacer es [actualizar el estado](/reference/react/useState) dentro de uno de los componentes.
