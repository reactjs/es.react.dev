---
title: hydrateRoot
---

<Intro>

`hydrateRoot` te permite mostrar componentes React dentro de un nodo DOM del navegador cuyo contenido HTML fue generado previamente por [`react-dom/server`.](/apis/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Uo {/*usage*/}

### Hydrating de HTML renderizado en el servidor {/*hydrating-server-rendered-html*/}


Si el HTML de tu aplicación fue generado por [`react-dom/server`](/apis/react-dom/client/createRoot),hay que *hidratarla* en el cliente.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import {hydrateRoot} from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
````

Esto hidratará el HTML del servidor dentro del <CodeStep step={1}>nodo DOM del navegador</CodeStep> con el <CodeStep step={2}>Componente React</CodeStep> para su aplicación. Por lo general, lo harás una vez al inicio. Si utilizas un marco de trabajo, puede hacer esto detrás de las escenas para ti.

Para hidratar tu aplicación, React "adjuntará" la lógica de tus componentes al HTML inicial generado desde el servidor. La hidratación convierte la instantánea inicial de HTML del servidor en una app totalmente interactiva que se ejecuta en el navegador.

<Sandpack>

```html public/index.html
<!--
  El contenido HTML dentro del <div id="root">...</div>
  fue generado desde la App por react-dom/server.
-->
<div id="root"><h1>Hola, mundo!</h1><button>Me has hecho clic<!-- -->0<!-- --> veces</button></div>
```

```js index.js active
import './styles.css';
import {hydrateRoot} from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hola, mundo!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Me has hecho clic {count} veces
    </button>
  );
}
```

</Sandpack>

No deberías necesitar llamar a `hydrateRoot` de nuevo o llamarlo en más sitios. A partir de este punto, React gestionará el DOM de tu aplicación. Si quieres actualizar la interfaz de usuario, tus componentes pueden hacerlo [usando un estado].(/apis/react/useState)

<Pitfall>

El árbol de React que pases a `hydrateRoot` tiene que producir **la misma salida** que en el servidor.

Esto es importante para la experiencia del usuario. El usuario pasará algún tiempo mirando el HTML generado por el servidor antes de que se cargue su código JavaScript. El renderizado del servidor crea la ilusión de que la aplicación se carga más rápido al mostrar la instantánea del HTML de su salida. Mostrar de repente un contenido diferente rompe esa ilusión. Por ello, la salida de renderizado del servidor debe coincidir con la salida de renderizado inicial en el cliente durante la hidratación.

Las causas más comunes que conducen a errores de hidratación incluyen:

* Espacios en blanco extra (como nuevas líneas) alrededor del HTML generado por React dentro del nodo raíz.
* Utilizar comprobaciones como `typeof window !== 'undefined'` en su lógica de renderizado.
* Utilizar APIs exclusivas del navegador como [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) en su lógica de renderizado.
* Renderización de datos diferentes en el servidor y en el cliente.

React puede recuperarse de algunos errores de hidratación, pero **debes solucionarlos como otros errores.** En el mejor de los casos, llevarán a una aplicación más lenta; en el peor, los manejadores de eventos se adjuntarán a los elementos equivocados.

</Pitfall>

### Actualización de un componente raíz hidratado {/*updating-a-hydrated-root-component*/}

Después de que la raíz haya terminado de hidratarse, puede llamar a [`root.render`](#root-render) para actualizar el componente raíz de React. **Al contrario que con [`createRoot`](/apis/react-dom/client/createRoot), normalmente no es necesario hacerlo porque el contenido inicial ya se ha renderizado como HTML.**

Si llamas a `root.render` en algún momento después de la hidratación, y la estructura del árbol de componentes coincide con lo que se renderizó previamente, React [preservará el estado].(/learn/preserving-and-resetting-state) Fíjate en que puedes escribir la entrada, lo que significa que las actualizaciones de las repetidas llamadas a `render` cada segundo en este ejemplo no son destructivas:

<Sandpack>

```html public/index.html
<!--
  Todo el contenido HTML dentro de  <div id="root">...</div> fue
  generado al renderizar <App /> con react-dom/server.
-->
<div id="root"><h1>Hola, mundo! <!-- -->0</h1><input placeholder="Escriba algo aquí"/></div>
```

```js index.js active
import {hydrateRoot} from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

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
      <input placeholder="Escriba algo aquí" />
    </>
  );
}
```

</Sandpack>

Es poco común llamar a [`root.render`](#root-render) en una raíz hidratada. Por lo general, se [actualizar el estado](/apis/react/useState) dentro de uno de los componentes.


---
## Referencia {/*reference*/}

### `hydrateRoot(domNode, options?)` {/*hydrate-root*/}

Llama a `hydrateRoot` para "adjuntar" React al HTML existente que ya fue renderizado por React en un entorno de servidor.

```js
const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React se unirá al HTML que existe dentro del `domNode`, y se encargará de gestionar el DOM dentro de él. Una aplicación completamente construida con React normalmente sólo tendrá una llamada a `hydrateRoot` con su componente raíz.

[Véanse los ejemplos anteriores.](#usage)

#### Parámetros {/*parameters*/}

* `domNode`: Un [elemento DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) que se ha representado como elemento raíz en el servidor.
* `reactNode`: El "nodo React" utilizado para renderizar el HTML existente. Normalmente será un trozo de JSX como `<App />` que se ha renderizado con un método `ReactDOM Server` como `renderToPipeableStream(<App />)`.

* **opcional** `options`: Un objeto que contiene opciones para esta raíz de React.

  * `onRecoverableError`: callback opcional llamado cuando React se recupera automáticamente de los errores.
  * `identifierPrefix`: prefijo opcional que React utiliza para los IDs generados por [`useId`.](/apis/react/useId) Útil para evitar conflictos cuando se utilizan varias raíces en la misma página. Debe ser el mismo prefijo que se utiliza en el servidor.

#### Devuelve {/*returns*/}

`hydrateRoot` devuelve un objeto con dos métodos: [`render`](#root-render) y [`unmount`.](#root-unmount)

#### Advertencias {/*caveats*/}
* `hydrateRoot()` espera que el contenido renderizado sea idéntico al contenido renderizado por el servidor. Deberías tratar los desajustes como errores y solucionarlos.
* En el modo de desarrollo, React avisa de los desajustes durante la hidratación. No hay garantías de que las diferencias de atributos sean parcheadas en caso de desajustes. Esto es importante por razones de rendimiento, ya que en la mayoría de las aplicaciones, los desajustes son raros, por lo que validar todo el marcado sería prohibitivamente caro.
* Es probable que sólo tengas una llamada a `hydrateRoot` en tu aplicación. Si utilizas un marco de trabajo, puede hacer esta llamada por ti.
* Si tu aplicación está renderizada por el cliente y no tiene HTML renderizado, el uso de `hydrateRoot()` no está soportado. Utilice [`createRoot()`](/apis/react-dom/client/createRoot) en su lugar.

---

### `root.render(reactNode)` {/*root-render*/}

Llama a `root.render` para actualizar un componente React dentro de una raíz React hidratada para un elemento DOM del navegador.

```js
root.render(<App />);
```

React actualizará `<App />` en la `root` hidratada.

[Véanse los ejemplos anteriores].(#usage)

#### Parámetros {/*root-render-parameters*/}

* `reactNode`: Un "nodo React" que quieres actualizar. Normalmente será un trozo de JSX como `<App />`, pero también puedes pasar un elemento React construido con [`createElement()`].(/apis/react/createElement), una cadena, un número, `null`, o `undefined`.


#### Devuelve {/*root-render-returns*/}

`root.render` devuelve `undefined`.

#### Advertencias {/*root-render-caveats*/}

* Si llamas a `root.render` antes de que la raíz haya terminado de hidratarse, React borrará el contenido HTML existente renderizado por el servidor y cambiará toda la raíz a renderizado por el cliente.

---

### `root.unmount()` {/*root-unmount*/}

Llama a `root.unmount` para destruir un árbol renderizado dentro de una raíz de React.

```js
root.unmount();
```

Una aplicación completamente construida con React normalmente no tendrá ninguna llamada a `root.unmount`.

Esto es muy útil si el nodo DOM de tu raíz React (o cualquiera de sus ancestros) puede ser eliminado del DOM por algún otro código. Por ejemplo, imagina un panel de pestañas jQuery que elimina las pestañas inactivas del DOM. Si se elimina una pestaña, todo lo que hay dentro de ella (incluyendo las raíces React que hay dentro) se eliminará también del DOM. En ese caso, tienes que decirle a React que "deje" de gestionar el contenido de la raíz eliminada llamando a `root.unmount`. De lo contrario, los componentes dentro de la raíz eliminada no sabrán limpiar y liberar recursos globales como las suscripciones.

Al llamar a `root.unmount` se desmontarán todos los componentes de la raíz y se "separará" React del nodo DOM raíz, incluyendo la eliminación de cualquier controlador de eventos o estado en el árbol. 


#### Parámetros {/*root-unmount-parameters*/}

`root.unmount` no acepta ningún parámetro.


#### Devuelve {/*root-unmount-returns*/}

`render` devuelve `null`.

#### Advertencias {/*root-unmount-caveats*/}

* Llamando a `root.unmount` se desmontarán todos los componentes del árbol y se "separará" React del nodo DOM raíz.

* * Una vez que se llama a `root.unmount` no se puede volver a llamar a `root.render` en la raíz. El intento de llamar a `root.render` en una raíz desmontada arrojará el error "No se puede actualizar una raíz no montada ".
