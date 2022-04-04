---
id: javascript-environment-requirements
title: Requerimientos del entorno de JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 depende de los tipos de colección [Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Map) y [Set](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Set). Si aceptas navegadores y dispositivos más antiguos que aún no los proporcionan de forma nativa (por ejemplo, IE < 11) o que tienen implementaciones no compatibles (por ejemplo, IE 11), considera la posibilidad de incluir un *polyfill* global en tu aplicación empaquetada, como [core-js](https://github.com/zloirock/core-js).

Un entorno con *polyfill* para React 16 que usa core-js para aceptar navegadores más antiguos podría verse de la siguiente forma:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React también depende de `requestAnimationFrame` (incluso en entornos de prueba).
Puedes usar el paquete [raf](https://www.npmjs.com/package/raf) para parchar `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
