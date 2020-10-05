---
title: "Introduciendo el concepto de JSX"
author: [sebmarkbage]
---

En Facebook hemos estado usando JSX por un largo tiempo. Originalmente lo introdujimos al mundo el ultimo año junto a React, pero en realidad lo usábamos de otra forma antes de usarlo para crear nodos nativos del DOM.
También hemos visto esfuerzos similares surgir de nuestro trabajo para ser utilizado con otras librarías de maneras interesantes. En este punto React JSX es solo una de muchas implementaciones.

Para que sea más fácil de implementar nuevas versiones y asegurar que la sintaxis se mantenga compatible, estamos formalizando la sintaxis de JSX como un funcionamiento independiente sin ningún significado semántico. Es completamente independiente de React en si.

Lee las especificaciones ahora en <https://facebook.github.io/jsx/>.

Esta no es una propuesta para estandarizarlo en ECMAScript. Es solo un documento de referencia en donde los escritores de transpiladores y los resaltadores de sintaxis puedan concordar. Esta actualmente en una etapa de boceto pero probablemente continúe hasta convertirse en un documento.

Siéntete libre de abrir un [reporte en GitHub](https://github.com/facebook/jsx/issues/new) o una Pull Request si encuentras algo que está incorrecto.