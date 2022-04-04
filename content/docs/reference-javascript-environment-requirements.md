---
id: javascript-environment-requirements
title: Requerimientos del entorno de JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18 es compatible con todos los navegadores modernos (Edge, Firefox, Chrome, Safari, etc).

Si debes mantener la compatibilidad con navegadores y dispositivos más antiguos como Internet Explorer que no proporcionan características modernas de forma nativa o tienen implementaciones que difieren de los estándares, considera incluir un *polyfill* global en tu aplicación compilada.

Esta es una lista de funcionalidades modernas que React 18 utiliza:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

El *polyfill* adecuado para estas funcionalidades depende de tu entorno. Para muchos usuarios, puedes configurar tus configuraciones de [BrowserList]. Para otros, puede que tengas que importar directamente *polyfills* como [`core-js`](https://github.com/zloirock/core-js).
