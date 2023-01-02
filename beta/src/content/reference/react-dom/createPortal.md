---
title: createPortal
---

<Intro>

`createPortal` te permite convertir algunos hijos en una parte diferente del DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode)}
</div>
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `createPortal(children, domNode)` {/*createportal*/}

Para crear un portal, llama a `createPortal`, pasando algo de JSX y el nodo del DOM donde debería renderizar:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Este hijo se coloca en el div padre.</p>
  {createPortal(
    <p>Este hijo se coloca en el cuerpo del documento.</p>,
    document.body
  )}
</div>
```

[Vea más ejemplos a continuación.](#usage)

Un portal solo cambia la ubicación física del nodo del DOM. En todos los demás sentidos, el JSX renderizado en un portal actúa como un nodo hijo del componente React que lo renderiza. Por ejemplo, el hijo puede acceder al contexto proporcionado por el padre, y los eventos siguen apareciendo de los hijos a los padres de acuerdo con el árbol React.

#### Parámetros {/*parameters*/}

* `children`: Cualquier cosa que se pueda renderizar con React, como una pieza de JSX (e.g. `<div />` o `<SomeComponent />`), un [Fragment](/reference/react/Fragment) (`<>...</>`), un string o number, o un array de estos.

* `domNode`: Algunos nodos del DOM, como los devueltos por `document.getElementById()`. El nodo ya debería existir. Pasar un nodo del DOM diferente durante una actualización hará que se vuelva a crear el contenido del portal.

#### Devuelve {/*returns*/}
`createPortal` devuelve un nodo de React que puede incluirse en JSX o devolverse desde un componente React. Si React lo encuentra en el renderizado, colocará el `children` proporcionado dentro del `domNode` proporcionado.

#### Advertencias {/*caveats*/}

* Los eventos de los portales se propagan según el árbol React en lugar del árbol del DOM. Por ejemplo, si hace click dentro de un portal y el portal está envuelto en `<div onClick>`, ese `onClick` el controlador disparará. Si esto causa problemas, detenga la propagación del evento desde el interior del portal o mueva el propio portal hacia arriba en el árbol de React.

---

## Uso {/*usage*/}

### Renderizar a una parte diferente del DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Portals* deja a tus componentes renderizar a algunos de sus hijos en un lugar diferente en el DOM. Esto permite que una parte de su componente "escape" de cualquier contenedor en el que pueda estar. Por ejemplo, un componente puede mostrar un modal de diálogo o información sobre herramientas que aparece encima y fuera del resto de la página.

Para crear un portal, renderizar el resultado de `createPortal` con <CodeStep step={1}>algo de JSX</CodeStep> y el <CodeStep step={2}>nodo del DOM donde debería ir</CodeStep>:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Este hijo se coloca en el div padre.</p>
      {createPortal(
        <p>Este hijo es colocado en el cuerpo del documento.</p>,
        document.body
      )}
    </div>
  );
}
```

React pondrá los nodos del DOM en <CodeStep step={1}>el JSX que pasaste</CodeStep> dentro del <CodeStep step={2}>nodo del DOM que proporcionó</CodeStep>. Sin un portal, el segundo `<p>` sería colocado dentro del padre `<div>`, pero el portal lo "teleported" al [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Este hijo se coloca en el div padre.</p>
      {createPortal(
        <p>Este hijo es colocado en el cuerpo del documento.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Observe cómo el segundo párrafo aparece visualmente fuera del padre `<div>` sin el borde. Si inspecciona la estructura del DOM con las herramientas de desarrollador, puedes confirmar que el segundo `<p>` se colocó directamente en el `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>Este hijo se coloca dentro del div padre.</p>
      </div>
    ...
  </div>
  <p>Este hijo es colocado en el cuerpo del documento.</p>
</body>
```

Un portal solo cambia la ubicación física del nodo del DOM. En todos los demás sentidos, el JSX renderizado en un portal actúa como un nodo hijo del componente React que lo renderiza. Por ejemplo, el hijo puede acceder al contexto proporcionado por el padre, y los eventos siguen apareciendo de los hijos a los padres de acuerdo con el árbol React.

---

### Renderizado de un diálogo de un modal con un portal {/*rendering-a-modal-dialog-with-a-portal*/}

Puede usar un portal para crear un diálogo con un modal que flote sobre el resto de la página, incluso si el componente que convoca el diálogo está dentro de un contenedor con `overflow: hidden` u otros estilos que interfieren con el diálogo.

En este ejemplo, los dos contenedores tienen estilos que interrumpen el diálogo con el modal, pero el que se convierte en un portal no se ve afectado porque, en el DOM, el modal no está contenido dentro de los elementos renderizados por sus padres.

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
        Mostrar un modal sin portal
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
        Mostrar un modal usando un portal
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
      <div>Soy un diálogo con un modal</div>
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

Es importante asegurarse de que su aplicación sea accesible cuando use portales. Por ejemplo, es posible que deba administrar el enfoque del teclado para que el usuario pueda mover el enfoque dentro y fuera del portal de forma natural.

Siga el [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) al crear modales. Si utiliza un paquete comunitario, asegúrese de que sea accesible y siga estas pautas.

</Pitfall>

---

### Renderizado de componentes de React en marcado de servidor que no es de React {/*rendering-react-components-into-non-react-server-markup*/}

Los portales pueden ser útiles si su raíz de React es solo parte de una página estática o renderizada por un servidor que no está construida con React. Por ejemplo, si su página está construida con un framework de servidor como Rails o PHP, puede crear áreas interactivas dentro de áreas estáticas como barras laterales. Comparado con tener [multiple separate React roots,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) Los portales le permiten tratar la aplicación como un solo árbol React con estado compartido, aunque sus partes se representen en diferentes partes del DOM.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mi app</title></head>
  <body>
    <h1>Bienvenido a mi aplicación híbrida</h1>
    <div class="parent">
      <div class="sidebar">
        Este es el marcado del servidor que no es React
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
  return <p>Esta parte es renderizada por React.</p>;
}

function SidebarContent() {
  return <p>¡Esta parte también está renderizada por React!</p>;
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

### Renderizado de componentes de React en nodos del DOM que no son de React {/*rendering-react-components-into-non-react-dom-nodes*/}

También puede usar un portal para administrar el contenido de un nodo del DOM que se administra fuera de React. Por ejemplo, suponga que se está integrando con un widget de un mapa que no es de React y desea mostrar el contenido de React dentro de una ventana emergente.

Para ello, declara un `popupContainer` variable de estado para almacenar el nodo del DOM en el que se va a representar:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Cuando inicialice el widget de terceros, almacene el nodo DOM devuelto por el widget para que pueda renderizado:

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

Esto le permite usar `createPortal` para representar el contenido de React en `popupContainer` una vez que esté disponible:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

Aquí hay un ejemplo completo con el que puedes jugar:

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
        <p>Hello from React!</p>,
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

