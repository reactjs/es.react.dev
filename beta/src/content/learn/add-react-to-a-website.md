---
title: Añadir React a un sitio web
---

<Intro>

You don't have to build your whole website with React. Adding React to HTML doesn't require installation, takes a minute, and lets you start writing interactive components right away.

</Intro>

<YouWillLearn>

* How to add React to an HTML page in one minute
* What is the JSX syntax and how to quickly try it
* How to set up a JSX preprocessor for production

</YouWillLearn>

## Añade React en un minuto {/*add-react-in-one-minute*/}

React se ha diseñado desde un inicio para una adopción gradual. La mayoría de los sitios web no están (y no necesitan estar) construidos completamente con React. Esta guía te muestra como añadir «pequeñas gotas de interactividad» una página HTML existente.

Pruébalo con tu propio sitio web [o un archivo HTML vacío](https://gist.github.com/gaearon/edf814aeee85062bc9b9830aeaf27b88/archive/3b31c3cdcea7dfcfd38a81905a0052dd8e5f71ec.zip). Todo lo que necesitas es una conexión a internet y un editor de texto como Notepad o VSCode). (¡Chequea aquí nuestra guía sobre [cómo puedes configurar tu editor](/learn/editor-setup/)!).

### Paso 1: Añade un elemento HTML raíz {/*step-1-add-a-root-html-tag*/}

Primero, abre la página HTML que quieres editar. Añade una etiqueta `<div>` vacía que marque el lugar en que quieres mostrar algo con React. Asigna a este `<div>` un valor único para el atributo `id`. Por ejemplo:

```html {3}
<!-- ... existing HTML ... -->

<div id="like-button-root"></div>

<!-- ... existing HTML ... -->
```

Se llama «raíz» porque es donde comenzará el árbol de React. Puedes ubicar un etiqueta HTML raíz como esta en cualquier lugar dentro de la etiqueta `<body>`. Déjala vacía, porque React reemplazará su contenido con tu componente de React.

Puedes tener tantas etiquetas HTML raíz como necesites en una página.

### Paso 2: Añade las etiquetas script {/*step-2-add-the-script-tags*/}

En la página HTML, justo antes de cerrar la etiqueta `</body>`, añade tres etiquetas `<script>` para los siguientes archivos:

- [`react.development.js`](https://unpkg.com/react@18/umd/react.development.js) te permite definir componentes de React.
- [`react-dom.development.js`](https://unpkg.com/react-dom@18/umd/react-dom.development.js) le permite a React renderizar elementos HTML en el [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).
- **`like-button.js`** ¡Es donde escribirás tu componente en el próximo paso!

Tu HTML debe lucir así:

```html
    <!-- end of the page -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="like-button.js"></script>
  </body>
</html>
```

<Pitfall>

¡Antes de desplegar en un sitio público, asegúrate de reemplazar `development.j` con `production.min.js`! Los compilados de desarrollo de React proporcionan mensajes de error útiles, pero ralentizan tu sitio web *por mucho.*

</Pitfall>

### Paso 3: Crea un componente de React {/*step-3-create-a-react-component*/}

Crea un archivo que se llame **`like-button.js`** junto a tu página HTML, añade este fragmento de código y guarda el archivo. Este código define un componente de React llamado `LikeButton`. (Aprende más sobre como hacer componentes en la [Guía rápida](/learn))

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

### Paso 4: Añade tu componente de React a la página {/*step-4-add-your-react-component-to-the-page*/}

Por último, añade tres líneas al final de **`like-button.js`**. Estas líneas de código se encargan de encontrar el `<div>` que has añadido al HTML en el primer paso, crear una raíz de React y luego mostrar el componente de React del botón «Like» dentro de ella:

```js
const rootNode = document.getElementById('like-button-root');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(LikeButton));
```

**¡Felicidades! ¡Acabas de renderizar tu primer componente de React en tu sitio web!**

- [Mira el código fuente completo del ejemplo](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e)
- [Descarga el ejemplo completo (2KB comprimido con zip)](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e/archive/651935b26a48ac68b2de032d874526f2d0896848.zip)

#### ¡Puedes reutilizar componentes! {/*you-can-reuse-components*/}

Puede que quieras mostrar componentes de React en múltiples lugares en la misma página HTML. Esto es útil si las partes de tu página controladas por React están separadas unas de otras. Puedes hacerlo poniendo múltiples etiquetas raíz en tu HTML y luego renderizar componentes de React dentro de ellas con `ReactDOM.createRoot()`. Por ejemplo:

1. En **`index.html`**, añade un elemento contenedor adicional `<div id="another-root"></div>`.
2. En **`like-button.js`**, añade tres líneas más al final:

```js {6,7,8,9}
const anotherRootNode = document.getElementById('another-root');
const anotherRoot = ReactDOM.createRoot(anotherRootNode);
anotherRoot.render(React.createElement(LikeButton));
```

Si necesitas renderizar el mismo componente en muchos lugares puedes asignar un atributo `class` de CSS en lugar de `id` a cada raíz, y luego encontrarlas todas. Aquí hay [un ejemplo que muestra tres botones «Like» y pasa datos a cada uno.](https://gist.github.com/gaearon/779b12e05ffd5f51ffadd50b7ded5bc8)

### Paso 5: Minifica JavaScript para producción {/*step-5-minify-javascript-for-production*/}

El código no minificado de JavaScript puede ralentizar significativamente los tiempos de carga para tus usuarios. Antes de desplegar tu sitio web a producción es una buena idea minificar sus scripts.

- **Si no tienes un paso de minificación** para tus scripts, [aquí hay una forma de configurarlo](https://gist.github.com/gaearon/ee0201910608f15df3f8cd66aa83f98e).
- **Si ya estás minificando** los scripts de tu aplicación, tu sitio estará listo para producción si te aseguras de que el HTML desplegado carga las versiones de React que terminan en `production.min.js`, como estas:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## Prueba React con JSX {/*try-react-with-jsx*/}

Los ejemplos de arriba dependen de funcionalidades que son compatibles de forma nativa con los navegadores. Es por esto que **`like-button.js`** utiliza una llamada a una función para decirle a React qué tiene que mostrar:

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

Sin embargo, React también ofrece una opción para usar [JSX](/learn/writing-markup-with-jsx), una sintaxis de JavaScript similar a HTML. Permite escribir:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

Estos dos fragmentos de código son equivalentes. JSX es una sintaxis popular para describir marcado en JavaScript. Muchas personas lo encuentran familiar y útil para escribir código de UI--tanto con React como con otras bibliotecas.

> Puedes interactuar con la transformación de marcado HTML en JSX usando este [convertir en línea](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.17).

### Prueba JSX {/*try-jsx*/}

La forma más rápida de probar JSX en tu proyecto es añadir el compilador de Babel como una etiqueta `<script>` a la página. Ponla antes de **`like-button.js`**, y luego añade el atributo `type="text/babel"` a la etiqueta `<script>` para **`like-button.js`**:

```html {3,4}
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="like-button.js" type="text/babel"></script>
</body>
```

Ahora puedes abrir **`like-button.js`** y reemplazar

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

con el código JSX equivalente:

```jsx
return (
  <button onClick={() => setLiked(true)}>
    Like
  </button>
);
```

Puede parecer un poco inusual en un inicio mezclar JSX on marcado, ¡pero te llegará a gustar! Consulta [Escribir marcado con JSX](/learn/writing-markup-with-jsx) para una introducción. Aquí hay [un archivo HTML de ejemplo con JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) que puedes descargar y jugar con él.

<Pitfall>

El compilador de Babel con `<script>` está bien para aprender y crear demos sencillos. Sin embargo, **ralentiza tu sitio web y no es adecuado para producción**. Cuando estés listo para avanzar, eliminar la etiqueta `<script>` y elimina el atributo `type="text/babel"` que añadiste en este paso. En cambio, en la próxima sección configurarás un preprocesador JSX para convertir todas las etiquetas `<script>` de JSX a JS.

</Pitfall>

### Añade JSX a un proyecto {/*add-jsx-to-a-project*/}

Añadir JSX a un proyecto no requiere herramientas complicadas como un [*bundler* (empaquetador)](/learn/start-a-new-react-project#custom-toolchains) o un servidor de desarrollo. Añadir un preprocesador de JSX es bastante parecido a añadir un preprocesador de CSS.

Ve a la carpeta de tu proyecto en la terminal, y pega estos dos comandos (**¡Asegúrate de tener instalado [Node.js](https://nodejs.org/)!**):

1. `npm init -y` (si falla, [aquí hay una solución](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

Solo necesitas npm para instalar el preprocesador de JSX. No lo necesitarás para nada más. Tanto React como el código de la aplicación se pueden quedar como etiquetas `<script>` sin cambios.

¡Felicidades! Acabas de añadir una **configuración de JSX lista para producción** a tu proyecto.

### Corre el preprocesador de JSX {/*run-the-jsx-preprocessor*/}

Puedes preprocesar JSX de forma tal que cada vez que guardes un archivo con JSX dentro, la transformación se vuelva a ejecutar y convierta el JSX en un archivo nuevo con JavaScript simple que el navegador puede entender. Aquí puedes ver cómo hacer la configuración:

1. Crea una carpeta llamada **`src`**.
2. En tu terminal, ejecuta este comando: `npx babel --watch src --out-dir . --presets react-app/prod ` (¡No esperes a que termine! Este comando inicia un *watcher* (observador) automático para las ediciones de JSX dentro de `src`).
3. Mueve tu **`like-button.js`** con JSX ([¡debería lucir así!](https://gist.githubusercontent.com/gaearon/be5ae0fbf563d6c5fe5c1563907b13d2/raw/4c0d0b8c7f4fcb341720424c28c72059f8174c62/like-button.js)) a la nueva carpeta **`src`**.

El *watcher* creará un **`like-button.js`** preprocesado con el código JavaScript simple que es adecuado para un navegador.

<Pitfall>

Si ves un mensaje de error que dice «*You have mistakenly installed the `babel` package* (has instalado erróneamente el paquete babel)», puede que te haya faltado [el paso previo](#add-jsx-to-a-project). Realízalo en la misma carpeta y luego inténtalo nuevamente.

</Pitfall>

La herramienta que acabas de usar se llama Babel y puedes aprender más sobre ella en [su documentación](https://babeljs.io/docs/en/babel-cli/). Además de JSX, te permite utilizar la sintaxis más moderna de JavaScript sin tener que preocuparte por causar errores en navegadores antiguos.

Si te empiezas a sentir cómodo con las herramientas de construcción y quieres que hagan más por ti, [cubrimos algunas de las más populares y accesibles aquí](/learn/start-a-new-react-project).

<DeepDive>

#### React without JSX {/*react-without-jsx*/}

Originalmente JSX se introdujo para que escribir componentes con React se sintiera tan familiar como escribir HTML. Desde entonces, la sintaxis se ha generalizado. Sin embargo, hay momentos en que no quieres o no puedes usar JSX. Tienes dos opciones:

<<<<<<< HEAD
- Usar una alternativa a JSX como [htm](https://github.com/developit/htm) que utiliza [plantillas de cadena](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals) en lugar de un compilador.
- Usar [`React.createElement()`](/apis/react/createElement) que tiene una estructura especial que se explica debajo.
=======
- Use a JSX alternative like [htm](https://github.com/developit/htm) which uses JavaScript [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) instead of a compiler.
- Use [`React.createElement()`](/reference/react/createElement) which has a special structure explained below.
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a

Con JSX, escribirías un componente de esta forma:

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />, );
```

Con `React.createElement()`, lo escribirías así:

```js
function Hello(props) {
  return React.createElement('div', null, 'Hello ', props.toWhat);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(Hello, { toWhat: 'World' }, null)
);
```

Acepta varios argumentos: `React.createElement(component, props, ...children)`.

Y funcionan así:

1. Un **componente**, que puede ser una cadena representando un elemento HTML o un componente de función
2. Un objeto de todas las [**props** que deseas pasar](/learn/passing-props-to-a-component)
3. El resto son los *hijos* que el componente puede tener, como cadenas de texto u otros elementos.

Si te cansas de escribir `React.createElement()`, un patrón común es asignar una forma abreviada:

```js
const e = React.createElement;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
```

Si prefieres este estilo, puede ser entonces tan conveniente como JSX.

</DeepDive>
