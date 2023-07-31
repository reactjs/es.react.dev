---
title: React DOM APIs
---

<Intro>

El paquete `react-dom` incluye métodos que sólo son compatibles con aplicaciones web (aquellas que se ejecutan en el entorno del DOM del navegador). No son compatibles con React Native.

</Intro>

---

## APIs {/*apis*/}

Puedes importar las siguientes APIs en tus componentes, pero su uso es poco común:

* [`createPortal`](/reference/react-dom/createPortal) permite renderizar componentes hijos en una parte diferente del árbol del DOM.
* [`flushSync`](/reference/react-dom/flushSync) permite forzar a React a actualizar el estado y el DOM de manera síncrona.

---

## Puntos de entrada {/*entry-points*/}

El paquete `react-dom` proporciona dos puntos de entrada adicionales:

* [`react-dom/client`](/reference/react-dom/client) incluye APIs para renderizar componentes de React en el cliente, es decir, en el navegador.
* [`react-dom/server`](/reference/react-dom/server) incluye APIs para renderizar componentes de react en el servidor.

---

## APIs obsoletas {/*deprecated-apis*/}

<Deprecated>

Las siguientes APIs se eliminarán en una próxima versión mayor de React.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) busca el nodo de DOM más cercano correspondiente a una instancia de componente de clase.
* [`hydrate`](/reference/react-dom/hydrate) monta un árbol en el DOM creado a partir de HTML generado en el servidor. En su lugar, se recomienda usar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) monta un árbol en el DOM. En su lugar, se recomienda usar [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) desmonta un árbol del DOM. En su lugar, se recomienda usar [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).
