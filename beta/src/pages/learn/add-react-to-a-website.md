---
title: Añadir React a un sitio web
---

<Intro>

React se ha diseñado desde un inicio para una adopción gradual, así puedes usar tan poco o mucho de React como necesites. Ya sea que estás trabajando con *micro-frontends*, un sistema existente o simplemente probando React, puedes empezar a añadir componentes interactivos de React a una página HTML con solo unas pocas líneas de código- ¡y sin herramientas para compilar!

</Intro>

## Añade React en un minuto {/*add-react-in-one-minute*/}

Puedes añadir componentes de React a una página HTML existente en menos de un minuto. Pruébalo con tu propio sitio web [o un archivo HTML vacío](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip)—todo lo que necesitas es una conexión a internet y un editor de texto como Notepad (o VSCode-¡chequea nuestra guía sobre [cómo puedes configurar el tuyo](/learn/editor-setup/)!).

### Paso 1: Añade un elemento al HTML {/*step-1-add-an-element-to-the-html*/}

En la página HTML que quieres editar, añade un elemento HTML, algo como una etiqueta `<div>` vacía con un `id` único que marque el lugar dónde quieres mostrar algo en React.

Puedes ubicar un elemento «contenedor» como este `<div>` en cualquier lugar dentro de la etiqueta `<body>`. React reemplazará cualquier contenido existente dentro de los elementos HTML, así que por lo general están vacíos. Puedes tener tantos de estos elementos HTML en una página como lo necesites.

```html {3}
<!-- ... existing HTML ... -->

<div id="component-goes-here"></div>

<!-- ... existing HTML ... -->
```

### Paso 2: Añade las etiquetas script {/*step-2-add-the-script-tags*/}

En la página HTML, justo antes de cerrar la etiqueta `</body>`, añade tres etiquetas `<script>` para los siguientes archivos:

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

Por último, añade tres líneas al final de **like_button.js**. Estas tres líneas de código se encargan de encontrar el `<div>` que has añadido a tu HTML en el primer paso, crear una aplicación de React con él y luego mostrar el componente de React del botón «Like» dentro de ella.

```js
const domContainer = document.getElementById('component-goes-here');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(LikeButton));
```

**¡Felicidades! ¡Acabas de renderizar tu primer componente de React en tu sitio web!**

- [Mira el código fuente completo del ejemplo](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [Descarga el ejemplo completo (2KB comprimido con zip)](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### ¡Puedes reutilizar componentes! {/*you-can-reuse-components*/}

Puede que quieras mostrar un componente de React en múltiples lugares en la misma página HTML. Esto es sobre todo más útil cuando las partes de la página controladas por React están aisladas unas de otras. Puedes hacerlo llamando a `ReactDOM.createRoot()` en múltiples elementos contenedores.

1. En **index.html**, añade un elemento contenedor adicional `<div id="component-goes-here-too"></div>`.
2. En **like_button.js**, añade un `ReactDOM.render()` adicional para el nuevo elemento contenedor:

```js {6,7,8,9}
const root1 = ReactDOM.createRoot(
  document.getElementById('component-goes-here')
);
root1.render(React.createElement(LikeButton));

const root2 = ReactDOM.createRoot(
  document.getElementById('component-goes-here-too')
);
root2.render(React.createElement(LikeButton));
```

¡Mira [un ejemplo que muestra el botón «Like» tres veces y le pasa algunos datos](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!(https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!

### Paso 5: Minifica JavaScript para producción {/*step-5-minify-javascript-for-production*/}

El código no minificado de JavaScript puede ralentizar significativamente los tiempos de carga para tus usuarios. Antes de desplegar tu sitio web a producción es una buena idea minificar sus scripts.

- **Si no tienes un paso de minificación** para tus scripts, [aquí hay una forma de configurarlo](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).
- **Si ya estás minificando** los scripts de tu aplicación, tu sitio estará listo para producción si te aseguras de que el HTML desplegado carga las versiones de React que terminan en `production.min.js`, como estas:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## Prueba React con JSX {/*try-react-with-jsx*/}

Los ejemplos de arriba dependen de funcionalidades que son compatibles de forma nativa con los navegadores. Es por esto que **like_button.js** utiliza una llamada a una función para decirle a React qué tiene que mostrar:

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

Sin embargo, React también ofrece una opción para usar [JSX](/learn/writing-markup-with-jsx), una sintaxis de JavaScript similar a HTML. Permite escribir:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

Estos dos fragmentos de código son equivalentes. JSX es una sintaxis popular para describir marcado en JavaScript. Muchas personas lo encuentran familiar y útil para escribir código de UI--tanto con React como con otras bibliotecas. ¡Puede que veas «marcado esparcido por tu JavaScript» en otros proyectos!

> Puedes interactuar con la transformación de marcado HTML en JSX usando este [convertir en línea](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3).

### Prueba JSX {/*try-jsx*/}

La forma más rápida de probar JSX en tu proyecto es añadir el compilador de Babel al `<head>` de tu página junto con React y ReactDOM de esta forma:

```html {6}
<!-- ... rest of <head> ... -->

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... rest of <body> ... -->
```

Ahora puedes usar JSX en cualquier etiqueta `<script>` si le añades el atributo `type="text/babel"`. Por ejemplo:

```jsx {1}
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<h1>Hello, world!</h1>);
</script>
```

Para convertir **like_button.js** para que use JSX:

1. En **like_button.js**, reemplaza

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

con:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

2. En **index.html**, añade `type="text/babel"` a la etiqueta script del botón:

```html
<script src="like_button.js" type="text/babel"></script>
```

Aquí hay [un ejemplo de un archivo HTML con JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) que puedes descargar y jugar con él.

Esta forma está bien para aprender y crear demos sencillos. Sin embargo, ralentiza tu sitio web y **no es apropiada para producción**. Cuando estés listo para seguir adelante, elimina esta nueva etiqueta `<script>` y los atributos `type="text/babel"` que añadiste. En cambio, en la próxima sección configurarás un preprocesador JSX para convertir todas tus etiquetas `<script>` automáticamente.

### Añade JSX a un proyecto {/*add-jsx-to-a-project*/}

Añadir JSX a un proyecto no requiere herramientas complicadas como un [*bundler* (empaquetador)](/learn/start-a-new-react-project#custom-toolchains) o un servidor de desarrollo. Añadir un preprocesador de JSX es bastante parecido a añadir un preprocesador de CSS.

Ve a la carpeta de tu proyecto en la terminal, y pega estos dos comandos (**¡Asegúrate de tener instalado [Node.js](https://nodejs.org/)!**):

1. `npm init -y` (si falla, [aquí hay una solución](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

Solo necesitas npm para instalar el preprocesador de JSX. No lo necesitarás para nada más. Tanto React como el código de la aplicación se pueden quedar como etiquetas `<script>` sin cambios.

¡Felicidades! Acabas de añadir una **configuración de JSX lista para producción** a tu proyecto.

### Corre el preprocesador de JSX {/*run-the-jsx-preprocessor*/}

Puedes preprocesar JSX de forma tal que cada vez que guardes un archivo con JSX dentro, la transformación se vuelva a ejecutar y convierta el JSX en un archivo nuevo con JavaScript simple.

1. Crea una carpeta llamada **src**
2. En tu terminal, ejecuta este comando: `npx babel --watch src --out-dir . --presets react-app/prod ` (¡No esperes a que termine! Este comando inicia un *watcher* (observador) automático para JSX).
3. Mueve tu **like_button.js** con JSX a la nueva carpeta **src** (o crea un **like_button.js** que contenga este [código JSX para iniciar](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js))

El *watcher* creará un **like_button.js** preprocesado con el código JavaScript simple que es adecuado para un navegador.

<Gotcha>

Si ves un mensaje de error que dice «*You have mistakenly installed the `babel` package* (has instalado erróneamente el paquete babel)», puede que te haya faltado [el paso previo](#add-jsx-to-a-project). Realízalo en la misma carpeta y luego inténtalo nuevamente.

</Gotcha>

Como un plus, esto también te permite utilizar funcionalidades de sintaxis de JavaScript moderno como las clases sin tener que preocuparte por causar errores en navegadores antiguos. La herramienta que acabamos de usar se llama Babel y puedes aprender más sobre ella en [su documentación](https://babeljs.io/docs/en/babel-cli/).

Si te empiezas a sentir cómodo con las herramientas de construcción y quieres que hagan más por ti, [cubrimos algunas de las más populares y accesibles aquí](/learn/start-a-new-react-project).

<DeepDive title="React without JSX">

Originalmente JSX se introdujo para que escribir componentes con React se sintiera tan familiar como escribir HTML. Desde entonces, la sintaxis se ha generalizado. Sin embargo, hay momentos en que no quieres o no puedes usar JSX. Tienes dos opciones:

- Usar una alternativa como [htm](https://github.com/developit/htm) que no usa un compilador-utiliza las plantillas etiquetadas, nativas en JavaScript.
- Usar [`React.createElement()`](/apis/createelement), que tiene una estructura especial que se explica debajo.

Con JSX, escribirías un componete de esta forma:

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

Con `React.createElement()`, lo escribirías así:

```js
function Hello(props) {
  return React.createElement('div', null, `Hello ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Acepta tres argumentos: `React.createElement(component, props, children)`. Funcionan así:

1. Un **componente**, que puede ser una cadena representando un elemento HTML o un componente de función
2. Un objeto de todas las [**props** que deseas pasar](/learn/passing-props-to-a-component)
3. Un objeto de todos los *hijos* que el componente puede tener, como cadenas de texto

Si te cansas de escribir `React.createElement()`, un patrón común es asignar una forma abreviada:

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```

Si utilizas esta forma abreviada para `React.createElement()`, puede ser casi tan conveniente utilizar React sin JSX.

</DeepDive>
