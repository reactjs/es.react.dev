---
title: "Introduciendo la especificación de JSX"
author: [sebmarkbage]
---

En Facebook hemos estado usando JSX por un largo tiempo. Originalmente lo introdujimos al mundo el año pasado junto con React, pero en realidad lo usábamos de otra forma anteriormente para crear nodos nativos del DOM. También hemos visto esfuerzos similares surgir de nuestro trabajo para ser utilizado con otras bibliotecas de maneras interesantes. En este punto React JSX es solo una de muchas implementaciones.

Para que sea más fácil de implementar nuevas versiones y asegurar que la sintaxis se mantenga compatible, estamos formalizando la sintaxis de JSX como una especificación independiente sin ningún significado semántico. Es completamente independiente del propio React.

Lee la especificación ahora en <https://facebook.github.io/jsx/>.

Esta no es una propuesta que deba estandarizarse en ECMAScript. Es solo un documento de referencia en donde los escritores de transpiladores y los resaltadores de sintaxis puedan concordar. Está actualmente en una etapa de boceto pero probablemente continúe hasta convertirse en un documento.

Siéntete libre de abrir un [reporte en GitHub](https://github.com/facebook/jsx/issues/new) o una Pull Request si encuentras algo que está incorrecto.