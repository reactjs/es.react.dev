---
title: Añadir React a un sitio web
---

<Intro>

<<<<<<< HEAD
React se ha diseñado desde un inicio para una adopción gradual, así puedes usar tan poco o mucho de React como necesites. Ya sea que estás trabajando con *micro-frontends*, un sistema existente o simplemente probando React, puedes empezar a añadir componentes interactivos de React a una página HTML con solo unas pocas líneas de código- ¡y sin herramientas para compilar!

</Intro>

## Añade React en un minuto {/*add-react-in-one-minute*/}

Puedes añadir componentes de React a una página HTML existente en menos de un minuto. Pruébalo con tu propio sitio web [o un archivo HTML vacío](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip)—todo lo que necesitas es una conexión a internet y un editor de texto como Notepad (o VSCode-¡chequea nuestra guía sobre [cómo puedes configurar el tuyo](/learn/editor-setup/)!).

### Paso 1: Añade un elemento al HTML {/*step-1-add-an-element-to-the-html*/}

En la página HTML que quieres editar, añade un elemento HTML, algo como una etiqueta `<div>` vacía con un `id` único que marque el lugar dónde quieres mostrar algo en React.

Puedes ubicar un elemento «contenedor» como este `<div>` en cualquier lugar dentro de la etiqueta `<body>`. React reemplazará cualquier contenido existente dentro de los elementos HTML, así que por lo general están vacíos. Puedes tener tantos de estos elementos HTML en una página como lo necesites.
=======
You don't have to build your whole website with React. Adding React to HTML doesn't require installation, takes a minute, and lets you start writing interactive components right away.

</Intro>

<YouWillLearn>

* How to add React to an HTML page in one minute
* What is the JSX syntax and how to quickly try it
* How to set up a JSX preprocessor for production

</YouWillLearn>

## Add React in one minute {/*add-react-in-one-minute*/}

React has been designed from the start for gradual adoption. Most websites aren't (and don't need to be) fully built with React. This guide shows how to add some “sprinkles of interactivity” to an existing HTML page.

Try this out with your own website or [an empty HTML file](https://gist.github.com/gaearon/edf814aeee85062bc9b9830aeaf27b88/archive/3b31c3cdcea7dfcfd38a81905a0052dd8e5f71ec.zip). All you need is an internet connection and a text editor like Notepad or VSCode. (Here's [how to configure your editor](/learn/editor-setup/) for syntax highlighting!)

### Step 1: Add a root HTML tag {/*step-1-add-a-root-html-tag*/}

First, open the HTML page you want to edit. Add an empty `<div>` tag to mark the spot where you want to display something with React. Give this `<div>` a unique `id` attribute value. For example:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```html {3}
<!-- ... existing HTML ... -->

<div id="like-button-root"></div>

<!-- ... existing HTML ... -->
```

<<<<<<< HEAD
### Paso 2: Añade las etiquetas script {/*step-2-add-the-script-tags*/}
=======
It's called a "root" because it's where the React tree will start. You can place a root HTML tag like this anywhere inside the `<body>` tag. Leave it empty because React will replace its contents with your React component.

You may have as many root HTML tags as you need on one page.

### Step 2: Add the script tags {/*step-2-add-the-script-tags*/}
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

En la página HTML, justo antes de cerrar la etiqueta `</body>`, añade tres etiquetas `<script>` para los siguientes archivos:

<<<<<<< HEAD
- [**react.development.js**](https://unpkg.com/react@18/umd/react.development.js) carga el núcleo de React
- [**react-dom.development.js**](https://unpkg.com/react-dom@18/umd/react-dom.development.js) le permite a React renderizar elementos HTML en el [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).
- **like_button.js** ¡Es dónde escribirás tu componente en el paso 3!

<Gotcha>

Al desplegar, reemplaza "development.js" con "production.min.js".

</Gotcha>

```html
  <!-- end of the page -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### Paso 3: Crea un componente de React {/*step-3-create-a-react-component*/}

Crea un archivo que se llame **like_button.js** junto a tu página HTML, añade este fragmento de código y guarda el archivo. Este código define un componente de React llamado `LikeButton`. [Puedes aprender más sobre como hacer componentes en nuestras guías.](/learn/your-first-component)
=======
- [`react.development.js`](https://unpkg.com/react@18/umd/react.development.js) lets you define React components.
- [`react-dom.development.js`](https://unpkg.com/react-dom@18/umd/react-dom.development.js) lets React render HTML elements to the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).
- **`like-button.js`** is where you'll write your component in the next step!

Your HTML should now end like this:

```html
    <!-- end of the page -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="like-button.js"></script>
  </body>
</html>
```

<Gotcha>

Before deploying to a live website, make sure to replace `development.js` with `production.min.js`! Development builds of React provide more helpful error messages, but slow down your website *a lot.*

</Gotcha>

### Step 3: Create a React component {/*step-3-create-a-react-component*/}

Create a file called **`like-button.js`** next to your HTML page, add this code snippet, and save the file. This code defines a React component called `LikeButton`. (Learn more about making components in the [Quick Start!](/learn))
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

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

<<<<<<< HEAD
### Paso 4: Añade tu componente de React a la página {/*step-4-add-your-react-component-to-the-page*/}

Por último, añade tres líneas al final de **like_button.js**. Estas tres líneas de código se encargan de encontrar el `<div>` que has añadido a tu HTML en el primer paso, crear una aplicación de React con él y luego mostrar el componente de React del botón «Like» dentro de ella.
=======
### Step 4: Add your React component to the page {/*step-4-add-your-react-component-to-the-page*/}

Lastly, add three lines to the bottom of **`like-button.js`**. These lines of code find the `<div>` you added to the HTML in the first step, create a React root, and then display the "Like" button React component inside of it:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```js
const rootNode = document.getElementById('like-button-root');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(LikeButton));
```

**¡Felicidades! ¡Acabas de renderizar tu primer componente de React en tu sitio web!**

<<<<<<< HEAD
- [Mira el código fuente completo del ejemplo](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [Descarga el ejemplo completo (2KB comprimido con zip)](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)
=======
- [View the full example source code](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e)
- [Download the full example (2KB zipped)](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e/archive/651935b26a48ac68b2de032d874526f2d0896848.zip)
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

#### ¡Puedes reutilizar componentes! {/*you-can-reuse-components*/}

<<<<<<< HEAD
Puede que quieras mostrar un componente de React en múltiples lugares en la misma página HTML. Esto es sobre todo más útil cuando las partes de la página controladas por React están aisladas unas de otras. Puedes hacerlo llamando a `ReactDOM.createRoot()` en múltiples elementos contenedores.

1. En **index.html**, añade un elemento contenedor adicional `<div id="component-goes-here-too"></div>`.
2. En **like_button.js**, añade un `ReactDOM.render()` adicional para el nuevo elemento contenedor:
=======
You might want to display React components in multiple places on the same HTML page. This is useful if React-powered parts of your page are separate from each other. You can do this by putting multiple root tags in your HTML and then rendering React components inside each of them with `ReactDOM.createRoot()`. For example:

1. In **`index.html`**, add an additional container element `<div id="another-root"></div>`.
2. In **`like-button.js`**, add three more lines at the end:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```js {6,7,8,9}
const anotherRootNode = document.getElementById('another-root');
const anotherRoot = ReactDOM.createRoot(anotherRootNode);
anotherRoot.render(React.createElement(LikeButton));
```

<<<<<<< HEAD
¡Mira [un ejemplo que muestra el botón «Like» tres veces y le pasa algunos datos](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!(https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!
=======
If you need to render the same component in many places, you can assign a CSS `class` instead of `id` to each root, and then find them all. Here is [an example that displays three "Like" buttons and passes data to each.](https://gist.github.com/gaearon/779b12e05ffd5f51ffadd50b7ded5bc8)
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

### Paso 5: Minifica JavaScript para producción {/*step-5-minify-javascript-for-production*/}

El código no minificado de JavaScript puede ralentizar significativamente los tiempos de carga para tus usuarios. Antes de desplegar tu sitio web a producción es una buena idea minificar sus scripts.

- **Si no tienes un paso de minificación** para tus scripts, [aquí hay una forma de configurarlo](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).
- **Si ya estás minificando** los scripts de tu aplicación, tu sitio estará listo para producción si te aseguras de que el HTML desplegado carga las versiones de React que terminan en `production.min.js`, como estas:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## Prueba React con JSX {/*try-react-with-jsx*/}

<<<<<<< HEAD
Los ejemplos de arriba dependen de funcionalidades que son compatibles de forma nativa con los navegadores. Es por esto que **like_button.js** utiliza una llamada a una función para decirle a React qué tiene que mostrar:
=======
The examples above rely on features that are natively supported by browsers. This is why **`like-button.js`** uses a JavaScript function call to tell React what to display:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

Sin embargo, React también ofrece una opción para usar [JSX](/learn/writing-markup-with-jsx), una sintaxis de JavaScript similar a HTML. Permite escribir:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

<<<<<<< HEAD
Estos dos fragmentos de código son equivalentes. JSX es una sintaxis popular para describir marcado en JavaScript. Muchas personas lo encuentran familiar y útil para escribir código de UI--tanto con React como con otras bibliotecas. ¡Puede que veas «marcado esparcido por tu JavaScript» en otros proyectos!
=======
These two code snippets are equivalent. JSX is popular syntax for describing markup in JavaScript. Many people find it familiar and helpful for writing UI code--both with React and with other libraries.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

> Puedes interactuar con la transformación de marcado HTML en JSX usando este [convertir en línea](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.17).

### Prueba JSX {/*try-jsx*/}

<<<<<<< HEAD
La forma más rápida de probar JSX en tu proyecto es añadir el compilador de Babel al `<head>` de tu página junto con React y ReactDOM de esta forma:
=======
The quickest way to try JSX is to add the Babel compiler as a `<script>` tag to the page. Put it before **`like-button.js`**, and then add `type="text/babel"` attribute to the `<script>` tag for **`like-button.js`**:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```html {3,4}
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="like-button.js" type="text/babel"></script>
</body>
```

<<<<<<< HEAD
Ahora puedes usar JSX en cualquier etiqueta `<script>` si le añades el atributo `type="text/babel"`. Por ejemplo:

```jsx {1}
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<h1>Hello, world!</h1>);
</script>
```

Para convertir **like_button.js** para que use JSX:

1. En **like_button.js**, reemplaza
=======
Now you can open **`like-button.js`** and replace
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

<<<<<<< HEAD
con:
=======
with the equivalent JSX code:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```jsx
return (
  <button onClick={() => setLiked(true)}>
    Like
  </button>
);
```

<<<<<<< HEAD
2. En **index.html**, añade `type="text/babel"` a la etiqueta script del botón:
=======
It may feel a bit unusual at first to mix JS with markup, but it will grow on you! Check out [Writing Markup in JSX](/learn/writing-markup-with-jsx) for an introduction. Here is [an example HTML file with JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) that you can download and play with.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

<Gotcha>

<<<<<<< HEAD
Aquí hay [un ejemplo de un archivo HTML con JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) que puedes descargar y jugar con él.

Esta forma está bien para aprender y crear demos sencillos. Sin embargo, ralentiza tu sitio web y **no es apropiada para producción**. Cuando estés listo para seguir adelante, elimina esta nueva etiqueta `<script>` y los atributos `type="text/babel"` que añadiste. En cambio, en la próxima sección configurarás un preprocesador JSX para convertir todas tus etiquetas `<script>` automáticamente.
=======
The Babel `<script>` compiler is fine for learning and creating simple demos. However, **it makes your website slow and isn't suitable for production**. When you're ready to move forward, remove the Babel `<script>` tag and remove the `type="text/babel"` attribute you've added in this step. Instead, in the next section you will set up a JSX preprocessor to convert all your `<script>` tags from JSX to JS.

</Gotcha>
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

### Añade JSX a un proyecto {/*add-jsx-to-a-project*/}

Añadir JSX a un proyecto no requiere herramientas complicadas como un [*bundler* (empaquetador)](/learn/start-a-new-react-project#custom-toolchains) o un servidor de desarrollo. Añadir un preprocesador de JSX es bastante parecido a añadir un preprocesador de CSS.

Ve a la carpeta de tu proyecto en la terminal, y pega estos dos comandos (**¡Asegúrate de tener instalado [Node.js](https://nodejs.org/)!**):

1. `npm init -y` (si falla, [aquí hay una solución](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

Solo necesitas npm para instalar el preprocesador de JSX. No lo necesitarás para nada más. Tanto React como el código de la aplicación se pueden quedar como etiquetas `<script>` sin cambios.

¡Felicidades! Acabas de añadir una **configuración de JSX lista para producción** a tu proyecto.

### Corre el preprocesador de JSX {/*run-the-jsx-preprocessor*/}

<<<<<<< HEAD
Puedes preprocesar JSX de forma tal que cada vez que guardes un archivo con JSX dentro, la transformación se vuelva a ejecutar y convierta el JSX en un archivo nuevo con JavaScript simple.

1. Crea una carpeta llamada **src**
2. En tu terminal, ejecuta este comando: `npx babel --watch src --out-dir . --presets react-app/prod ` (¡No esperes a que termine! Este comando inicia un *watcher* (observador) automático para JSX).
3. Mueve tu **like_button.js** con JSX a la nueva carpeta **src** (o crea un **like_button.js** que contenga este [código JSX para iniciar](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js))

El *watcher* creará un **like_button.js** preprocesado con el código JavaScript simple que es adecuado para un navegador.
=======
You can preprocess JSX so that every time you save a file with JSX in it, the transform will be re-run, converting the JSX file into a new, plain JavaScript file that the browser can understand. Here's how to set this up:

1. Create a folder called **`src`**.
2. In your terminal, run this command: `npx babel --watch src --out-dir . --presets react-app/prod ` (Don't wait for it to finish! This command starts an automated watcher for edits to JSX inside `src`.)
3. Move your JSX-ified **`like-button.js`** ([it should look like this!](https://gist.githubusercontent.com/gaearon/1884acf8834f1ef9a574a953f77ed4d8/raw/dfc664bbd25992c5278c3bf3d8504424c1104ecf/like-button.js)) to the new **`src`** folder.

The watcher will create a preprocessed **`like-button.js`** with the plain JavaScript code suitable for the browser.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

<Gotcha>

Si ves un mensaje de error que dice «*You have mistakenly installed the `babel` package* (has instalado erróneamente el paquete babel)», puede que te haya faltado [el paso previo](#add-jsx-to-a-project). Realízalo en la misma carpeta y luego inténtalo nuevamente.

</Gotcha>

<<<<<<< HEAD
Como un plus, esto también te permite utilizar funcionalidades de sintaxis de JavaScript moderno como las clases sin tener que preocuparte por causar errores en navegadores antiguos. La herramienta que acabamos de usar se llama Babel y puedes aprender más sobre ella en [su documentación](https://babeljs.io/docs/en/babel-cli/).
=======
The tool you just used is called Babel, and you can learn more about it from [its documentation](https://babeljs.io/docs/en/babel-cli/). In addition to JSX, it lets you use the most recent JavaScript syntax features without worrying about breaking older browsers.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

Si te empiezas a sentir cómodo con las herramientas de construcción y quieres que hagan más por ti, [cubrimos algunas de las más populares y accesibles aquí](/learn/start-a-new-react-project).

<DeepDive title="React without JSX">

Originalmente JSX se introdujo para que escribir componentes con React se sintiera tan familiar como escribir HTML. Desde entonces, la sintaxis se ha generalizado. Sin embargo, hay momentos en que no quieres o no puedes usar JSX. Tienes dos opciones:

<<<<<<< HEAD
- Usar una alternativa como [htm](https://github.com/developit/htm) que no usa un compilador-utiliza las plantillas etiquetadas, nativas en JavaScript.
- Usar [`React.createElement()`](/apis/createelement), que tiene una estructura especial que se explica debajo.
=======
- Use a JSX alternative like [htm](https://github.com/developit/htm) which uses JavaScript [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) instead of a compiler.
- Use [`React.createElement()`](/apis/createelement) which has a special structure explained below.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

Con JSX, escribirías un componete de esta forma:

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

<<<<<<< HEAD
Acepta tres argumentos: `React.createElement(component, props, children)`. Funcionan así:

1. Un **componente**, que puede ser una cadena representando un elemento HTML o un componente de función
2. Un objeto de todas las [**props** que deseas pasar](/learn/passing-props-to-a-component)
3. Un objeto de todos los *hijos* que el componente puede tener, como cadenas de texto
=======
It accepts several arguments: `React.createElement(component, props, ...children)`.

Here's how they work:

1. A **component**, which can be a string representing an HTML element or a function component
2. An object of any [**props** you want to pass](/learn/passing-props-to-a-component)
3. The rest are **children** the component might have, such as text strings or other elements
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

Si te cansas de escribir `React.createElement()`, un patrón común es asignar una forma abreviada:

```js
const e = React.createElement;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
```

<<<<<<< HEAD
Si utilizas esta forma abreviada para `React.createElement()`, puede ser casi tan conveniente utilizar React sin JSX.
=======
Then, if you prefer this style, it can be just as convenient as JSX.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

</DeepDive>
