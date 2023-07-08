---
title: unmountComponentAtNode
---

<Deprecated>

Esta API se eliminará en una versión mayor futura de React.

En React 18, `unmountComponentAtNode` fue reemplazado por [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

</Deprecated>

<Intro>

`unmountComponentAtNode` elimina un componente de React montado del DOM.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

Llama a `unmountComponentAtNode` para eliminar un componente de React montado del DOM y limpiar sus controladores de eventos y estado.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[Ver más ejemplos abajo.](#usage)

#### Parámetros {/*parameters*/}

* `domNode`: Un [elemento DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React eliminará un componente de React montado de este elemento.

#### Devuelve {/*returns*/}

`unmountComponentAtNode` devuelve `true` si se desmontó un componente y `false` en caso contrario.

---

## Uso {/*usage*/}

Llama a `unmountComponentAtNode` para eliminar un <CodeStep step={1}>componente de React montado</CodeStep> de un <CodeStep step={2}>nodo DOM del navegador</CodeStep> y limpiar sus controladores de eventos y estado.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### Eliminando una aplicación de React de un elemento DOM {/*removing-a-react-app-from-a-dom-element*/}

En ocasiones, es posible que desees "añadir" React a una página existente o a una página que no está completamente escrita en React. En esos casos, es posible que necesites "detener" la aplicación de React eliminando toda la interfaz de usuario, el estado y los controladores de eventos del nodo DOM en el que se renderizó.

En este ejemplo, al hacer clic en "Renderizar aplicación de React" se renderizará una aplicación de React. Haz clic en "Desmontar aplicación de React" para destruirla:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mi App</title></head>
  <body>
    <button id='render'>Renderizar aplicación de React</button>
    <button id='unmount'>Desmontar aplicación de React</button>
    <!-- Este es el nodo de la aplicación de React -->
    <div id='root'></div>
  </body>
</html>
```

```js index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>
