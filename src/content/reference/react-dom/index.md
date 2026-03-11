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

## APIs de precarga de recursos {/*resource-preloading-apis*/}

Estas APIs se pueden utilizar para hacer las aplicaciones más rápidas al precargar recursos como scripts, hojas de estilos y fuentes tan pronto como sepas que los necesitarás, por ejemplo antes de navegar a otra página donde se utilizarán los recursos.

[Los frameworks basados en React](/learn/start-a-new-react-project) con frecuencia manejan la carga de recursos por ti, por lo que es posible que no necesites llamar a estas APIs tú mismo. Consulta la documentación de tu framework para más detalles.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) te permite precargar la dirección IP de un nombre de dominio DNS al que esperas conectarte.
* [`preconnect`](/reference/react-dom/preconnect) te permite conectarte a un servidor del que esperas solicitar recursos, incluso si aún no sabes qué recursos necesitarás.
* [`preload`](/reference/react-dom/preload) te permite precargar una hoja de estilos, fuente, imagen o script externo que esperas utilizar.
* [`preloadModule`](/reference/react-dom/preloadModule) te permite precargar un módulo ESM que esperas utilizar.
* [`preinit`](/reference/react-dom/preinit) te permite precargar y evaluar un script externo o precargar e insertar una hoja de estilos.
* [`preinitModule`](/reference/react-dom/preinitModule) te permite precargar y evaluar un módulo ESM.

---

## Puntos de entrada {/*entry-points*/}

El paquete `react-dom` proporciona dos puntos de entrada adicionales:

* [`react-dom/client`](/reference/react-dom/client) incluye APIs para renderizar componentes de React en el cliente, es decir, en el navegador.
* [`react-dom/server`](/reference/react-dom/server) incluye APIs para renderizar componentes de react en el servidor.

---

## APIs eliminadas {/*removed-apis*/}

Las siguientes API se eliminaron en React 19:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): consulta las [alternativas](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): utiliza [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) en su lugar.
* [`render`](https://18.react.dev/reference/react-dom/render): utiliza [`createRoot`](/reference/react-dom/client/createRoot) en su lugar.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): utiliza [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) en su lugar.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): utiliza las API de [`react-dom/server`](/reference/react-dom/server) en su lugar.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): utiliza las API de [`react-dom/server`](/reference/react-dom/server) en su lugar.
