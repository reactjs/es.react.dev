---
title: createPortal
---

<Intro>

`createPortal` permite renderizar componentes hijos en otra parte del DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Para crear un portal, debes llamar a `createPortal` y pasarle el JSX junto con el nodo de DOM donde se renderizará:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Este elemento hijo va en el div padre.</p>
  {createPortal(
    <p>Este elemento hijo va en el body.</p>,
    document.body
  )}
</div>
```

[Ver más ejemplos abajo.](#usage)

Un portal modifica solamente la ubicación física del nodo de DOM, mientras que el JSX que se renderiza en él actúa como un nodo hijo del componente de React que lo renderiza. Por lo tanto, el nodo hijo tendrá acceso al contexto proporcionado por el árbol padre y los eventos se propagarán de hijo a padre siguiendo la estructura del árbol de React.

#### Parámetros {/*parameters*/}

* `children`: Todo elemento que se pueda renderizar con React, ya sea código JSX (por ejemplo, `<div />` o `<SomeComponent />`), un [Fragment](/reference/react/Fragment) (`<>...</>`), un string o un número, o un array que contenga estos elementos.

* `domNode`: Un nodo de DOM, como el que devuelve `document.getElementById()`. El nodo debe existir previamente. Si durante una actualización se pasa un nodo de DOM diferente, el contenido del portal se volverá a crear.

* **opcional** `key`: Un valor único en forma de string o número que se usará como [key](/learn/rendering-lists/#keeping-list-items-in-order-with-key) para el portal.

#### Valor devuelto {/*returns*/}

`createPortal` devuelve un nodo de React que puede incluirse en JSX o ser devuelto desde un componente de React. Si React encuentra el nodo en la salida del renderizado, insertará `children` dentro del `domNode` proporcionado.

#### Advertencias {/*caveats*/}

* Los eventos del portal se propagan siguiendo la estructura del árbol de React en lugar del árbol del DOM. Por ejemplo, si haces clic dentro del portal, y el portal está envuelto en `<div onClick>`, ese `onClick` se ejecutará. Si esto causa problemas, puedes detener la propagación del evento desde el portal o levantar el portal en la estructura del árbol de React.

---

## Uso {/*usage*/}

### Renderizar en otra parte del DOM {/*rendering-to-a-different-part-of-the-dom*/}

Los *portales* permiten que tus componentes rendericen sus elementos hijos en otras partes del DOM, permitiéndoles "escapar" de cualquier contenedor en el que se encuentren. Por ejemplo, un componente puede mostrar una ventana modal o un tooltip que aparezca por encima y fuera del resto de la página.

Para crear un portal, renderiza el resultado de `createPortal` con <CodeStep step={1}>código JSX</CodeStep> y el <CodeStep step={2}>nodo de DOM en el cual se va a insertar</CodeStep>:

```js [[1, 8, "<p>Este elemento hijo va en el body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Este elemento hijo va en el div padre.</p>
      {createPortal(
        <p>Este elemento hijo va en el body.</p>,
        document.body
      )}
    </div>
  );
}
```

React insertará los nodos de DOM del <CodeStep step={1}>JSX que pasaste</CodeStep> dentro del <CodeStep step={2}>nodo de DOM que proporcionaste</CodeStep>.

Si no se utiliza un portal, el segundo `<p>` se insertaría dentro del `<div>` padre, pero gracias al uso del portal, este se "teletransporta" al elemento [`document.body`:](https://developer.mozilla.org/es/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Este elemento hijo va en el div padre.</p>
      {createPortal(
        <p>Este elemento hijo va en el body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Nota cómo el segundo párrafo aparece visualmente fuera del `<div>` padre con borde. Si inspeccionas la estructura del DOM con las herramientas para desarrolladores, verás que el segundo `<p>` se ha insertado directamente dentro del elemento `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>Este elemento hijo va dentro del div padre.</p>
      </div>
    ...
  </div>
  <p>Este elemento hijo va en el body.</p>
</body>
```

Un portal modifica solamente la ubicación física del nodo de DOM, mientras que el JSX que se renderiza en él actúa como un nodo hijo del componente de React que lo renderiza. Por lo tanto, el nodo hijo tendrá acceso al contexto proporcionado por el árbol padre y los eventos continuarán propagándose de hijo a padre siguiendo la estructura del árbol de React.

---

### Renderizar una ventana modal con un portal {/*rendering-a-modal-dialog-with-a-portal*/}

Los portales permiten dejar que una ventana modal aparezca por encima del resto de la página, incluso si el componente que la llama está dentro de un contenedor con estilos que afecten a la ventana modal, como `overflow: hidden`.

En este ejemplo, ambos contenedores tienen estilos que interfieren con la ventana modal, pero la que se renderiza a través de un portal no se ve afectada porque, en el DOM, la ventana no está dentro de los elementos JSX padres.

<Sandpack>

```js App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Mostrar modal sin uso de portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Mostrar modal con uso de portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>Soy una ventana modal</div>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
```


```css styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Es importante garantizar la accesibilidad de tu aplicación al utilizar portales. Para ello, puede que tengas que gestionar el foco del teclado para que el usuario pueda navegar dentro y fuera del portal de forma natural.

Sigue la [Guía de Creación de Ventanas Modales con WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) al crear portales. Si usas paquetes de la comunidad, asegúrate de que sean accesibles y sigan estas pautas.

</Pitfall>

---

### Renderizar componentes de React en marcado de servidor no generado por React {/*rendering-react-components-into-non-react-server-markup*/}

Los portales resultan útiles cuando se desea integrar contenido de React en páginas estáticas o generadas por el servidor. Por ejemplo, si la página está construida con un framework del lado del servidor como Rails, se puede agregar interactividad dentro de áreas estáticas, como sidebars. En lugar de tener [varias raíces de React por separado,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) los portales permiten tratar la aplicación como un solo árbol de React con estado compartido, a pesar de que sus partes se rendericen en otras secciones del DOM.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mi aplicación</title></head>
  <body>
    <h1>Bienvenido a mi aplicación híbrida</h1>
    <div class="parent">
      <div class="sidebar">
        Este marcado de servidor no se renderiza con React
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>Esta sección se renderiza con React</p>;
}

function SidebarContent() {
  return <p>¡Esta sección también se renderiza con React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Renderizar componentes de React en nodos de DOM no generados por React {/*rendering-react-components-into-non-react-dom-nodes*/}

Se puede manejar el contenido de un nodo de DOM fuera de React utilizando portales. Por ejemplo, si estás trabajando con un widget de mapa que no usa React y deseas renderizar contenido de React dentro de una ventana emergente, puedes hacerlo definiendo una variable de estado `popupContainer` que almacene el nodo de DOM donde se realizará la renderización.

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Al crear el widget de terceros, almacena el nodo de DOM devuelto para poder renderizar en él:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

De esta forma, puedes usar `createPortal` para renderizar contenido de React en `popupContainer` una vez que esté disponible:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>¡Saludos desde React!</p>,
      popupContainer
    )}
  </div>
);
```

A continuación, un ejemplo completo para que puedas probar:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>¡Saludos desde React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
