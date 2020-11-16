---
id: javascript-environment-requirements
title: Requerimientos del entorno de JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 depende de tipos de colección [Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Map) y [Set](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Set). Si aceptas navegadores y dispositivos más antiguos que aún no los proporcionan de forma nativa (por ejemplo, IE <11) o que tienen implementaciones no compatibles (por ejemplo, IE 11), considera la posibilidad de incluir un *polyfill* global en tu aplicación empaquetada, como [core-js](https://github.com/zloirock/core-js) o [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

Un entorno con *polyfill* para React 16 que usa core-js para aceptar navegadores más antiguos podría verse de la siguiente forma:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
