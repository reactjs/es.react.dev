---
id: add-react-to-a-website
title: Agregar React a un sitio web
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

Utiliza sólo lo que necesites de React.

React fue diseñado desde el principio para que se pudiera adoptar de forma gradual, y **puedas utilizar sólo las cosas que necesites de React**. Quizás solo quieras agregar una "pizca de interactividad" a una página existente. Los componentes de React son una gran manera de hacer eso.

La mayoría de sitios web no son, y no necesitan ser, aplicaciones de una sóla página. Con **unas pocas líneas de código y sin herramientas de compilación**, puedes probar React en lugares pequeños de tu sitio web. Y de allí puedes expandir su presencia de forma gradual, o mantenerlo contenido a unos pocos en unos widgets dinámicos.

---

- [Agrega React en Un Minuto](#add-react-in-one-minute)
- [Opcional: Prueba React con JSX](#optional-try-react-with-jsx) (sin necesidad de usar bundler!)

## Agrega React en un minuto {#add-react-in-one-minute}

En esta sección, vamos a mostrarte como agregar un componente de React a una página HTML existente. Puedes seguir los pasos en tu sitio web, o crear un nuevo archivo HTML para practicar.

No habrá necesidad de usar herramientas complicadas u otros requerimientos para instalar -- **para completar esta sección, sólo necesitas de una conexión a internet y un minuto de tu tiempo.**

Opcional: [Descargar el ejemplo completo (2KB comprimido)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### Paso 1: Agrega un contenedor del DOM al HTML {#step-1-add-a-dom-container-to-the-html}

Para iniciar, abre la página HTML que deseas editar. Agrega una etiqueta `<div>` vacía para marcar el lugar donde deseas visualizar algo con React. Por ejemplo:

```html{3}
<!-- ... HTML existente ... -->

<div id="like_button_container"></div>

<!-- ... HTML existente ... -->
```

A este `<div>` le agregamos un atributo HTML `id` que es único. Esto nos permitirá encontrarlo desde el código Javascript más adelante y visualizar un componente de React adentro de este.

>Consejo
>
>Puedes agregar un "contenedor" `<div>` como este en **cualquier sitio** dentro de la etiqueta `<body>`. Puedes tener la cantidad de contenedores independientes en el DOM que desees. Por lo general éstos están vacíos -- React reemplazará cualquier contenido existente dentro de los contenedores del DOM.

### Paso 2: Agrega las etiquetas de script {#step-2-add-the-script-tags}

Lo siguiente es agregar tres etiquetas `<script>` a la página HTML justo antes de cerrar la etiqueta `</body>`:

```html{5,6,9}
  <!-- ... más HTML ... -->

  <!-- Cargar React. -->
  <!-- Nota: cuando se despliegue, reemplazar "development.js" con "production.min.js". -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!-- Cargamos nuestro componente de React. -->
  <script src="like_button.js"></script>

</body>
```

Las primeras dos etiquetas cargan React. La tercera carga tu código del componente.

### Paso 3: Crea un componente de React {#step-3-create-a-react-component}

Crea un archivo llamado `like_button.js` en el mismo lugar donde tienes tu archivo HTML.

Abre **[este código inicial](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** y pégalo en el archivo que acabaste de crear.

>Consejo
>
>Este código define un componente de React llamado `LikeButton`. No te preocupes si aún no lo entiendes -- vamos a cubrir los elementos básicos de React luego en nuestro [tutorial práctico](/tutorial/tutorial.html) y [guía de conceptos principal](/docs/hello-world.html). Por ahora, ¡vamos a hacer que se muestre en la pantalla!

Después **[en el código inicial](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, agrega las siguientes dos lineas al final de `like_button.js`:

```js{3,4}
// ... el código inicial que pegaste ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

Estas dos lineas de código encuentran el `<div>` que agregamos en nuestro HTML en el primer paso y muestran el componente de React para nuestro botón de "Like" dentro del mismo.

### ¡Eso es todo! {#thats-it}

No hay un cuarto paso. **Ya agregaste tu primer componente de React a tu sitio web.**

Dale un vistazo a las siguientes secciones para más consejos sobre como integrar React.

**[Mira el código fuente del ejemplo completo](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Descargar el ejemplo completo (2KB comprimido)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### Consejo: Reusar un componente {#tip-reuse-a-component}

Por lo general, es deseado mostrar componentes de React en múltiples lugares de una página HTML. Aquí hay un ejemplo que muestra el botón de "Like" tres veces y le pasa algunos datos al mismo:

[Mira el código fuente del ejemplo completo](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[Descargar el ejemplo completo (2KB comprimido)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>Nota
>
>Esta estrategía es útil cuando las partes de la página que funcionan en React están aisladas entre sí. En código de React, es mucho más fácil usar [composición de componentes](/docs/components-and-props.html#composing-components) en su lugar.

### Consejo: Compactar JavaScript para producción {#tip-minify-javascript-for-production}

Antes de desplegar tu sitio web a producción, debes ser consciente que no compactar tu JavaScript puede disminuir de forma considerable la carga de tu página.

Si ya has compactado los scripts de tu aplicación, **tu sitio estará listo para producción** si aseguras que el HTML desplegado carga las versiones de React finalizadas en `production.min.js`:

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

Si no tienes un paso para compactar tus scripts, [aquí hay una forma en que puedes establecerlo](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Opcional: Prueba React con JSX {#optional-try-react-with-jsx}

En los ejemplos anteriores, hemos dependido solamente de características que son soportadas de forma nativa por los navegadores. Es por esto que usamos una llamada a una función de JavaScript para decirle a React que mostrar:

```js
const e = React.createElement;

// Muestra un <button> que contenga "Like"
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

Sin embargo, React también ofrece la opción para usar [JSX](/docs/introducing-jsx.html):

```js
// Muestra un <button> que contenga "Like"
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

Estos dos fragmentos de código son equivalentes. Mientras **JSX es [completamente opcional](/docs/react-without-jsx.html)**, muchas personas lo encuentran útil para escribir código relacionado con la interfaz de usuario -- ya sea usando React o con otras bibliotecas.

Puedes experimentar con JSX usando [este conversor en línea](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3).

### Prueba JSX de forma rápida {#quickly-try-jsx}

La forma más rápida de probar JSX en tu proyecto es agregando esta etiqueta `<script>` en tu página:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

Ahora puedes usar JSX en cualquier etiqueta de `<script>` al agregarle el atributo `type="text/babel"`. Aquí hay [un ejemplo de un archivo HTML con JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) que puedes descargar y experimentar con él.

Este enfoque está bien mientras aprendes o creas demostraciones simples. Sin embargo, hace que tu sitio web sea lento y **no es apropiado para utilizarse en producción**. Cuando estés listo para seguir adelante, elimina esta etiqueta de `<script>` y los atributos `type="text/babel"` que hayas agregado. En la siguiente sección vas a configurar un preprocesador de JSX que convertirá todas tus etiquetas de `<script>` automáticamente.

### Agregar JSX a un proyecto {#add-jsx-to-a-project}

Agregar JSX a un proyecto no necesita de herramientas complicadas como un bundler o un servidor de desarrollo. Básicamente, agregar JSX **es muy parecido a agregar un preprocesador de CSS.** El único requisito es que tengas [Node.js](https://nodejs.org/) instalado en tu computador.

En tu terminal, ve a la carpeta que contiene tu proyecto y pega estos dos comandos:

1. **Paso 1:** Ejecuta `npm init -y` (si falla, [aquí está como arreglarlo](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **Paso 2:** Ejecuta `npm install babel-cli@6 babel-preset-react-app@3`

>Consejo
>
>Aquí **sólo estamos usando npm para instalar el preprocesador de JSX;** no lo vas a necesitar para nada más. Tanto React como el código de la aplicación pueden seguir como una etiqueta de `<script>` sin cambio alguno.

¡Felicitaciones! Acabas de agregar una **configuración de JSX lista para producción** a tu proyecto.


### Ejecuta el preprocesador de JSX {#run-jsx-preprocessor}

Crea una carpeta llamada `src` y ejecuta este comando en la terminal:

```
npx babel --watch src --out-dir . --presets react-app/prod
```

>Nota
>
>`npx` no es un error de escritura -- es una [herramienta de ejecución de paquetes incluida en npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>Si ves algún mensaje de error que te dice que "Has instalado equivocadamente el paquete de `babel`", puede ser que olvidaste realizar [el paso anterior](#add-jsx-to-a-project). Realiza el paso anterior en la misma carpeta en que estás y vuelve a intentar este paso.

No esperes hasta que termine -- este comando inicia un observador automático para JSX.

Si ahora creas un archivo llamado `src/like_button.js` con este **[código inicial de JSX](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, el observador va a crear un `like_button.js` preprocesado con el código JavaScript original que es apto para el navegador. Cuando edites el código del archivo que tiene JSX, el transformador va a volver a ejecutarse de forma automática.

Como un bonus, esto también te permite utilizar características nuevas de la sintaxis de JavaScript, como las clases, sin que te preocupes de que no funcionen en navegadores antiguos. La herramienta que hemos usado se llama Babel, y puedes leer más sobre ella en [su documentación](https://babeljs.io/docs/en/babel-cli/).

Si notas que se te está haciendo más cómodo manejar las herramientas de configuración y quieres sacarle mayor provecho, [en la próxima sección](/docs/create-a-new-react-app.html) se describen unas de las cadenas de herramientas más populares y accesibles. Dado el caso que no te sientas así -- esas etiquetas de script serán suficiente.
