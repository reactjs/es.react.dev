---
title: Agregar React a un proyecto existente
---

<Intro>

Si quieres añadir algo de interactividad a tu proyecto existente, no lo tienes que escribir de nuevo en React. Agrega React a tu stack *actual* y renderiza componentes React en cualquier lugar.

</Intro>

<Note>

**Debes instalar [Node.js](https://nodejs.org/es/) para el desarrollo local.** Aunque puedes [probar React](/learn/installation#try-react) en línea o con una simple página HTML, siendo realista la mayoría de herramientas de JavaScript que querrás utilizar para desarrollar requieren Node.js.

</Note>

## Utilizar React para una subruta completa de tu página web existente {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Digamos que tienes una aplicación web existente en `example.com` construida con otra tecnología de servidor (como Rails), y quieres implementar todas las rutas que comienzan por `example.com/some-app/` completamente con React.

Así es como recomendamos configurarlo:

1. **Construye la parte React de tu app** utilizando uno de los [*frameworks* basados en React](/learn/start-a-new-react-project).
2. **Especifica `/some-app` como la *ruta base***  en la configuración de tu framework (aquí tienes como: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configura tu servidor o un proxy** para que todas las peticiones bajo `/some-app/` sean manejadas por tu aplicación React.

Esto garantiza que la parte React de tu aplicación se pueda [beneficiar de las mejoras practicas](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) integradas en aquellos frameworks.

Muchos frameworks basados en React son full-stack y permiten que tu aplicación React aproveche el servidor. Sin embargo, puedes utilizar el mismo enfoque incluso si no puedes o no quieres ejecutar JavaScript en el servidor. En ese caso, sirve la exportación HTML/CSS/JS ([`next export` output](https://nextjs.org/docs/advanced-features/static-html-export) para Next.js, por defecto para Gatsby) en `/some-app/` en su lugar.

## Utilizar React para una parte de tu página existente {/*using-react-for-a-part-of-your-existing-page*/}

Digamos que tienes una página existente creada con otra tecnología (una de servidor como Rails, o de cliente como Backbone), y quieres renderizar componentes React interactivos en algún lugar de la página. Esta es una forma común de integrar React y, de hecho, ¡así es como se veía la mayoría del uso de React en Meta durante muchos años!

Puedes hacer esto en dos pasos:

1. **Configura un entorno de JavaScript** que te permita utilizar la [sintaxis JSX](/learn/writing-markup-with-jsx), dividir tu código en módulos con la sintaxis [`import`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/export), y utilizar paquetes (por ejemplo React) del gestor de paquetes [npm](https://www.npmjs.com/).
2. **Renderiza tus componentes React** donde quieras verlos en la página.

El método exacto dependerá de la configuración de tu página existente, así que repasemos algunos detalles.

### Paso 1: Configurar un entorno de JavaScript modular {/*step-1-set-up-a-modular-javascript-environment*/}

Un entorno de JavaScript modular te permite escribir tus componentes React en archivos individuales, en lugar de escribir todo tu código en un solo archivo. También te permite utilizar todos los maravillosos paquetes publicados por otros desarrolladores en el registro [npm](https://www.npmjs.com/) (¡Incluyendo el propio React!) La manera de hacerlo depende de tu configuración existente:

* **Si tu aplicación ya está dividida en archivos que utilizan la sintaxis `import`,** prueba a utilizar tu configuración existente. Comprueba si escribir `<div />` en tu código JS causa un error de sintaxis. Si causa un error de sintaxis, es posible que necesites [transformar tu código JavaScript con Babel](https://babeljs.io/setup), y habilitar el [_preset_ de Babel React](https://babeljs.io/docs/babel-preset-react) para utilizar JSX.

* **Si tu aplicación no tiene una configuración existente para compilar módulos JavaScript,** configurarlo con [Vite](https://es.vitejs.dev/). La comunidad de Vite mantienen [varias integraciones con *frameworks* de backend](https://github.com/vitejs/awesome-vite#integrations-with-backends), incluyendo Rails, Django y Laravel. Si tu *framework* de backend no aparece en la lista, [sigue esta guía](https://es.vitejs.dev/guide/backend-integration.html) para integrar la compilación con Vite con tu backend de forma manual.

Para comprobar que tu configuración funciona, lanza el siguiente comando en el directorio de tu proyecto:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Después agrega las siguientes líneas de código al principio de tu archivo JavaScript principal (quizás se llama `index.js` o `main.js`):

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- El contenido existente de tu página (en este ejemplo, es reemplazado) -->
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

// Borra el contenido HTML existente
document.body.innerHTML = '<div id="app"></div>';

// Renderiza tu componente React en su lugar
const root = createRoot(document.getElementById('app'));
root.render(<h1>¡Hola, mundo!</h1>);
```

</Sandpack>

Si el contenido completo de tu página fue reemplazado por un "¡Hola, mundo!", ¡todo ha funcionado!. Sigue leyendo.

<Note>

Integrar un entorno de JavaScript modular en un proyecto existente por primera vez puede ser intimidante, ¡pero vale la pena! Si te quedas atascado, prueba nuestros [recursos de la comunidad](/community) o el [Vite Chat](https://chat.vitejs.dev/).

</Note>

### Paso 2: Renderizar componentes React en cualquier lugar de la página {/*step-2-render-react-components-anywhere-on-the-page*/}

En el paso anterior, pusiste el siguiente código al principio de tu archivo principal:

```js
import { createRoot } from 'react-dom/client';

// Borra el contenido HTML existente
document.body.innerHTML = '<div id="app"></div>';

// Renderiza tu componente React en su lugar
const root = createRoot(document.getElementById('app'));
root.render(<h1>¡Hola, mundo!</h1>);
```

Por supuesto, ¡en realidad no deseas borrar el contenido HTML existente!.

Elimina este código.

En cambio, probablemente quieres renderizar tus componentes React en zonas especificas de tu HTML. Abre tu página HTML (o las plantillas de servidor que lo generan) y agrega un [`id`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/id) único a cualquier etiqueta, por ejemplo:

```html
<!-- ... en algún lugar de tu html ... -->
<nav id="navigation"></nav>
<!-- ... más html ... -->
```

Esto te permite encontrar aquel elemento HTML con [`document.getElementById`](https://developer.mozilla.org/es/docs/Web/API/Document/getElementById) y pasarlo a [`createRoot`](/reference/react-dom/client/createRoot) para que puedas renderizar tu propio componente React dentro:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>Este párrafo es parte del HTML.</p>
    <nav id="navigation"></nav>
    <p>Este párrafo también es parte del HTML.</p>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Implementar realmente una barra de navegación
  return <h1>Hola desde React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Observa como el contenido HTML original de `index.html` se mantiene, pero ahora tu propio componente React `NavigationBar` aparece dentro del `<nav id="navigation">` de tu HTML. Lee la [documentación sobre el uso de `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) para aprender más sobre renderizar componentes React dentro de una página HTML existente.

Cuando adoptas React en un proyecto existente, es común empezar con pequeños componentes interactivos (como botones), y luego seguir "moviendo hacia arriba" gradualmente hasta que finalmente toda tu página está construida con React. Si logras llegar a este punto, recomendamos migrar a [un framework de React](/learn/start-a-new-react-project) enseguida para sacar el máximo provecho de React.

## Utilizar React Native en una aplicación móvil nativa existente {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) también puede ser integrada en aplicaciones nativas existentes de forma incremental. Si tienes una aplicación nativa existente para Android (Java o Kotlin) o iOS (Objective-C o Swift), [sigue esta guía](https://reactnative.dev/docs/integration-with-existing-apps) para añadirle una pantalla de React Native.
