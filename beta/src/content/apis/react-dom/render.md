---
title: render
---

<Pitfall>

En React 18, `render` fue reemplazado por [`createRoot`.](/apis/react-dom/client/createRoot) Al usar `render` en React 18 se te advertirá que tu aplicación se comportará como si estuviera ejecutándose en React 17. Aprende mas [aquí.](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis)

</Pitfall>


<Intro>

`render` renderiza una pieza de [JSX](/learn/writing-markup-with-jsx) ("React node") en un nodo del DOM del navegador.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

Usa `render` para mostrar un <CodeStep step={1}>componente de React</CodeStep> dentro de un <CodeStep step={2}>nodo DOM del navegador</CodeStep>.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
````

### Renderiza el componente raíz {/*rendering-the-root-component*/}

En aplicaciones totalmente construidas con React, **por lo general sólo realizarás esto una vez al inicio** --para renderizar el componente "raíz".

<Sandpack>

```js index.js active
import './styles.css';
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>¡Hola, mundo!</h1>;
}
```

</Sandpack>

Generalmente no necesitas llamar a `render` de nuevo o llamarlo en otros lugares. En este punto, React manejará el DOM de tu aplicación. Si quieres actualizar la UI, tu componente puede hacerlo [con el uso de estado.](/apis/react/useState)

---

### Renderlizando múltiples raices "roots"  {/*rendering-multiple-roots*/}

Si tu página [no está totalmente construida con React](/learn/add-react-to-a-website), debes llamar a `render` por cada pieza de nivel superior "top-leve" de la UI administrada por React.

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
      <Comment text="Hola!" author="Sophie" />
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

Puedes destruir los árboles renderizados con [`unmountComponentAtNode()`.](/apis/react-dom/unmountComponentAtNode)

---

### Actualizando el árbol renderizado {/*updating-the-rendered-tree*/}

Puedes llamar a `render` más de una vez en el mismo nodo DOM. Siempre y cuando la estructura de componente de árbol coincida con lo renderizado previamente, React [preservará el estado.](/learn/preserving-and-resetting-state) Nota como puedes escribir en el input, lo que significa que se cada segundo se actualiza repetidamente `render` y en este ejemplo no se destruye.

<Sandpack>

```js index.js active
import {render} from 'react-dom';
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
      <h1>Hola, mundo! {counter}</h1>
      <input placeholder="Escribe algo aquí" />
    </>
  );
}
```

</Sandpack>

No es muy común llamar a `render` varias veces. Por lo general [actualizarás el estado](/apis/react/useState) dentro de uno de los componentes.

---

## Referencia {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Utiliza `render` para mostrar un componente de React dentro del navegador o elemento del DOM.

```js
const domNode = document.getElementById('root');
render(<App />, domNode);
```

React mostrará `<App />`  en el `domNode`, y se encargará de gestionar el DOM dentro de él.

Una aplicación totalmente construida con React usualmente tendrá sólo un llamado a `render` con su componente raíz "root". Una página que utiliza "sprinkles" de React para partes de la página puede tener tantas llamadas `render` como sean necesarias.

[Vea los ejemplos anteriores.](#usage)

#### Parámetros {/*parameters*/}

* `reactNode`: Un *React node* que tu quieras mostrar. Por lo general se trata de un fragmento o pieza de JSX `<App />`, pero también puedes pasar un elemento de React "React element" construido con [`createElement()`](/apis/react/createElement), una cadena de text "string", un número "number", `null`, or `undefined`.

* `domNode`: Un [elemento del DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React mostrará el `reactNode` que tú pases dentro de este elemento del DOM. Desde este momento, React administrará el DOM dentro de `domNode` y lo actualizará cuando tu árbol de React cambie.

* **Opcional** `callback`: Una función. Si se pasa, React la llamará luego de que tu componente sea colocado dentro del DOM.


#### Retorno - Returns {/*returns*/}

`render` Por lo general retorna `null`. Sin embargo, si el `reactNode` que pasas es de tipo *class component*, entonces este retornará una instancia de ese componente.

#### Advertencias {/*caveats*/}

* En React 18, `render` fue reemplazado por [`createRoot`.](/apis/react-dom/client/createRoot) Por favor usa `createRoot` para React 18 y versiones posteriores.

* La primer ver que llamas a `render`, React limpiará todo el HTML contenido existente dentro del `domNode` antes de renderizar el componente de React dentro de este. Si tu `domNode` contiene HTML generado por React en el servidor o durante la construcción, usa [`hydrate()`](/apis/react-dom/hydrate) en lugar de, ya que este adjunta los manejadores de evento al HTML existente.

* Si llamas a `render` en el mismo `domNode` mas de una vez, React actualizará el DOM según sea necesario para reflear el mas reciente JSX que hayas pasado. React decidirá que partes del DOM pueden ser reutilizadas y cuáles necesitan se recreadas ["emparejándolas"](/learn/preserving-and-resetting-state) con el árbol previamente renderizado. Llamar a `render` en el mismo `domNode` nuevamente es similar a llamar a la función [`set` ](/apis/react/useState#setstate) en el componente raíz "root": React evita actualizaciones innecesarias del DOM.

* Si tu aplicación está totalmente construida con React, es probable que sólo tengas un llamado a `render` en tu aplicación. (Si usas un framework, éste puede hacer el llamado por ti.) Cuando quieras renderizar un fragmento de JSX en un lugar diferente del árbol DOM que no sea hijo de tu componente (por ejemplo, una modal o un tooltip), usa [`createPortal`](/apis/react-dom/createPortal) en lugar de `render`.

---
