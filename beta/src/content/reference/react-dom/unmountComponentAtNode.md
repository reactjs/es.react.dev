---
title: unmountComponentAtNode
---

<Deprecated>

Esta API se eliminará en una futura versión principal de React.

En React 18, `unmountComponentAtNode` fue reemplazado por [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

</Deprecated>

<Intro>

`unmountComponentAtNode` elimina un componente React montado del DOM.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

Llame `unmountComponentAtNode` para eliminar un componente React montado del DOM y limpie sus controladores de eventos y su estado.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[Vea más ejemplos a continuación.](#usage)

#### Parámetros {/*parameters*/}

* `domNode`: Un [elemento DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React eliminará un componente React montado de este elemento.

#### Devoluciones {/*returns*/}

`unmountComponentAtNode` devuelve `true` si un componente fue desmontado y `false` en caso contrario.

---

## Uso {/*usage*/}

Llame `unmountComponentAtNode` para eliminar un <CodeStep step={1}>componente React montado</CodeStep> de un <CodeStep step={2}>nodo DOM del navegador</CodeStep> y limpie sus controladores de eventos y su estado.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import {render, unmountComponentAtNode} from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
````


### Eliminar una aplicación React de un elemento DOM {/*removing-a-react-app-from-a-dom-element*/}

De vez en cuando, es posible que desee "rociar" React en una página existente o en una página que no está completamente escrita en React. En esos casos, es posible que deba "detener" la aplicación React, eliminando toda la interfaz de usuario, el estado y los oyentes del nodo DOM al que se renderizó.

En este ejemplo, al hacer clic en "Renderizar aplicación React" se renderizará una aplicación React. Haga clic en "Desmontar la aplicación React" para destruirla:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>Render React App</button>
    <button id='unmount'>Unmount React App</button>
    <!-- Este es el nodo de la aplicación React -->
    <div id='root'></div>
  </body>
</html>
```

```js index.js active
import './styles.css';
import {render, unmountComponentAtNode} from 'react-dom';
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
