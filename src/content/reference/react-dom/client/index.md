---
title: APIs del cliente React DOM
---

<Intro>

Las APIs de `react-dom/client` te permiten renderizar componentes de React en el cliente (en el navegador). Estas APIs son típicamente usadas en el nivel superior de tu aplicación para inicializar tu árbol de React. Un [framework](/learn/start-a-new-react-project#full-stack-frameworks) podría llamar a estas APIs por ti. La mayoría de tus componentes no necesitan importarlas o usarlas.

</Intro>

---

## APIs del cliente {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) te permite crear una raíz para mostrar componentes de React dentro de un nodo del DOM del navegador.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) te permite mostrar componentes de React dentro de un nodo DOM del navegador cuyo contenido HTML fue generado previamente por [`react-dom/server.`](/reference/react-dom/server)

---

## Compatibilidad con navegadores {/*browser-support*/}

React es compatible con todos los navegadores populares, incluyendo Internet Explorer 9 en adelante. Algunos polyfills son requeridos para navegadores viejos como IE 9 e IE 10.