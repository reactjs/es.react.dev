---
title: Tu primer componente
---

<Intro>

Los *componentes* son uno de los conceptos esenciales de React. Constituyen los cimientos sobre los que construyes interfaces de usuario (UIs por sus siglas en inglés). ¡Y eso los convierte en el lugar perfecto para comenzar tu recorrido por React!

</Intro>

<YouWillLearn>

* Qué es un componente
* Qué papel desempeñan los componentes en una aplicación de React
* Cómo escribir tu primer componente de React

</YouWillLearn>

## Componentes: Elementos básicos para construir UIs {/*components-ui-building-blocks*/}

En la Web, HTML nos permite crear documentos estructurados con su conjunto integrado de etiquetas como `<h1>` y `<li>`:

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

Este marcado representa este artículo `<article>`, su encabezado `<h1>`, y una tabla de contenidos (abreviada) representada como una lista ordenada `<ol>`. Un marcado como este, combinado con CSS para los estilos y JavaScript para la interactividad, están detrás de cada barra lateral, avatar, modal, menú desplegable y cualquier otra pieza de UI que ves en la web.

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
React te permite combinar tu marcado, CSS y JavaScript en «componentes» personalizados, **elementos reutilizables de UI para tu aplicación.** El código de la tabla de contenidos que viste arriba pudo haberse transformado en un componente `<TableOfContents />` que podrías renderizar en cada página. Por detrás, seguiría utilizando las mismas etiquetas HTML como `<article>`, `<h1>`, etc.
=======
React lets you combine your markup, CSS, and JavaScript into custom "components", **reusable UI elements for your app.** The table of contents code you saw above could be turned into a `<TableOfContents />` component you could render on every page. Under the hood, it still uses the same HTML tags like `<article>`, `<h1>`, etc.
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

De la misma forma que con las etiquetas HTML, puedes componer, ordenar y anidar componentes para diseñar páginas completas. Por ejemplo la página de documentación que estás leyendo está hecha de componentes de React:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
En la medida en que tu proyecto crece, notarás que muchos de tus diseños se pueden componer mediante la reutilización de componentes que ya escribiste, acelerando el desarrollo. ¡Nuestra tabla de contenido de arriba podría añadirse a cualquier pantalla con `<TableOfContents />`! Incluso puedes montar tu proyecto con los miles de componentes compartidos por la comunidad de código abierto de React como [Chakra UI](https://chakra-ui.com/) y [Material UI](https://material-ui.com/).
=======
As your project grows, you will notice that many of your designs can be composed by reusing components you already wrote, speeding up your development. Our table of contents above could be added to any screen with `<TableOfContents />`! You can even jumpstart your project with the thousands of components shared by the React open source community like [Chakra UI](https://chakra-ui.com/) and [Material UI.](https://material-ui.com/)
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

## Definir un componente {/*defining-a-component*/}

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
Tradicionalmente cuando se crean páginas web, los desarrolladores web usaban lenguaje de marcado para describir el contenido y luego añadían interacciones agregando un poco de JavaScript. Esto funcionaba perfectamente cuando las interacciones eran algo *deseable, pero no imprescindible* en la web. Ahora es algo que se espera de muchos sitios y de todas las aplicaciones. React pone la interactividad primero usando aún la misma tecnología: **un componente de React es una función de JavaScript a la que puedes _agregar markup_**. Aquí vemos cómo luce esto (puede editar el ejemplo de abajo):
=======
Traditionally when creating web pages, web developers marked up their content and then added interaction by sprinkling on some JavaScript. This worked great when interaction was a nice-to-have on the web. Now it is expected for many sites and all apps. React puts interactivity first while still using the same technology: **a React component is a JavaScript function that you can _sprinkle with markup_.** Here's what that looks like (you can edit the example below):
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Y aquí veremos cómo construir un componente:

### Paso 1: Exporta el componente {/*step-1-export-the-component*/}

El prefijo `export default` es parte de la sintaxis [estándar de Javascript](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (no es específico de React). Te permite marcar la función principal en un archivo para que luego puedas importarlas en otros archivos. (¡Más sobre importar en [Importar y exportar componentes](/learn/importing-and-exporting-components)!).

### Paso 2: Define la función {/*step-2-define-the-function*/}

Con `function Profile() { }` defines una función con el nombre `Profile`.

<Gotcha>

¡Los componentes de React son funciones regulares de JavaScript, pero **sus nombres deben comenzar con letra mayúscula** o no funcionarán!

</Gotcha>

### Paso 3: Añade marcado {/*step-3-add-markup*/}

El componente retorna una etiqueta `<img />` con atributos `src` y `alt`. `<img />` se escribe como en HTML, ¡pero en realidad es JavaScript por detrás! Esta sintaxis se llama [JSX](/learn/writing-markup-with-jsx), y te permite incorporar marcado dentro de JavaScript.

Las sentencias `return` se pueden escribir todo en una línea, como en este componente:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Pero si tu marcado no está todo en la misma línea que la palabra clave `return`, debes ponerlo dentro de paréntesis como en este ejemplo:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Gotcha>

¡Sin paréntesis, todo el código que está en las líneas posteriores al `return` [serán ignoradas](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Gotcha>

## Usar un componente {/*using-a-component*/}

Ahora que has definido tu componente `Profile`, puedes anidarlo dentro de otros componentes. Por ejemplo, puedes exportar un componente `Gallery` que utilice múltiples componentes `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### Lo que ve el navegador {/*what-the-browser-sees*/}

Nota la diferencia de mayúsculas y minúsculas:

* `<section>` está en minúsculas, por lo que React sabe que nos referimos a una etiqueta HTML.
* `<Profile />` comienza con una `P` mayúscula, por lo que React sabe que queremos usar nuestro componente llamado `Profile`.

Y `Profile` contiene aún más HTML: `<img />`. Al final lo que el navegador ve es esto:

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Anidar y organizar componentes {/*nesting-and-organizing-components*/}

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
Los componentes son funciones regulares de JavaScript, por lo que puedes tener múltiples componentes en el mismo archivo. Esto es conveniente cuando los componentes son relativamente pequeños o están estrechamente relacionados entre sí. Si este archivo se torna abarrotado, siempre puedes mover `Profile` a una archivo separado. Aprenderás como hacer esto pronto en la [página sobre *imports*](/learn/importing-and-exporting-components).
=======
Components are regular JavaScript functions, so you can keep multiple components in the same file. This is convenient when components are relatively small or tightly related to each other. If this file gets crowded, you can always move `Profile` to a separate file. You will learn how to do this shortly on the [page about imports.](/learn/importing-and-exporting-components)
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

Dado que los componentes `Profile` se renderizan dentro de `Gallery` —¡incluso varias veces!— podemos decir que `Gallery` es un **componente padre**, que renderiza cada `Profile` como un «hijo». Este es la parte mágica de React: puedes definir un componente una vez, y luego usarlo en muchos lugares y tantas veces como quieras.

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
<DeepDive title="Componentes de arriba a abajo">
=======
<DeepDive title="Components all the way down">
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

Tu aplicación de React comienza en un componente «raíz». Usualmente, se crea automáticamente cuando inicias un nuevo proyecto. Por ejemplo, si utilizas [CodeSandbox](https://codesandbox.io/) o [Create React App](https://create-react-app.dev/), el componente raíz se define en `src/App.js`. Si utilizas el framework [Next.js](https://nextjs.org/), el componente raíz se define en `pages/index.js`. En estos ejemplos, has estado exportando componentes raíces.

La mayoría de las aplicaciones de React utilizan componentes de arriba a abajo. Esto significa que no solo usarás componentes para las piezas reutilizables como los botones, pero también para piezas más grandes como barras laterales, listas, ¡y en última instancia, páginas completas! Los componentes son una forma útil de organizar código de UI y marcado, incluso cuando algunos de ellos solo se utilicen una vez.

Frameworks como Next.js lo llevan un paso más allá. En lugar de usar un archivo HTML vacío y dejar a React «ocuparse» de manejar la página con JavaScript, *también* generan el HTML automáticamente a partir de tus componentes de React. Esto permite que tu aplicación muestre algún contenido antes de que el código de JavaScript cargue.

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
Aún así, muchos sitios web solo utilizan React para [añadir «pequeñas gotas de interactividad»](/learn/add-react-to-a-website). Tienen muchos componentes raíces en lugar de uno solo para la página completa. Puedes utilizar tanto o tan poco de React como lo necesites.
=======
Still, many websites only use React to [add "sprinkles of interactivity".](/learn/add-react-to-a-website) They have many root components instead of a single one for the entire page. You can use as much—or as little—React as you need.
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

</DeepDive>

<Recap>

¡Acabas de probar por primera vez React! Recapitulemos algunos puntos clave.

* React te permite crear componentes, **elementos reutilizables de UI para tu aplicación.**
* En una aplicación de React, cada pieza de UI es un componente.
* Los componentes de React son funciones regulares de JavaScript excepto que:

  1. Sus nombres siempre empiezan con mayúscula.
  2. Retorna marcado JSX.

</Recap>



<Challenges>

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
### Exporta el componente {/*export-the-component*/}
=======
#### Export the component {/*export-the-component*/}
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

Este ejemplo interactivo no funciona porque el componente raíz no está exportado:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

¡Intenta arreglarlo tú mismo antes de mirar la solución!

<Solution>

Añade `export default` antes de la definición de la función de esta forma:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
Puedes estar preguntándote por qué escribir solo `export` no es suficiente para arreglar este ejemplo. Puedes aprender sobre las diferencias entre `export` y `export default` en [Importar y exportar componentes](/learn/importing-and-exporting-components).

</Solution>

### Arregla la sentencia return {/*fix-the-return-statement*/}
=======
You might be wondering why writing `export` alone is not enough to fix this example. You can learn the difference between `export` and `export default` in [Importing and Exporting Components.](/learn/importing-and-exporting-components)

</Solution>

#### Fix the return statement {/*fix-the-return-statement*/}
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

Algo no está bien con esta sentencia `return`. ¿Puedes arreglarla?

<Hint>

Puede que tengas un error «Unexpected token» mientras intentas arreglar este ejemplo. En ese caso, chequea que el punto y coma aparece *después* del paréntesis de cierre. Si dejas un punto y coma dentro de `return ( )` ocurrirá un error.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Puedes arreglar este componente moviendo la sentencia return a una línea de esta forma:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

O poniendo el marcado JSX que se va retornar dentro de paréntesis que se abren justo luego de `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
### Detecta el error {/*spot-the-mistake*/}
=======
#### Spot the mistake {/*spot-the-mistake*/}
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

Hay algo mal con cómo se declara y usa el componente `Profile`. ¿Puedes detectar el error? (¡Trata de recordar cómo distingue React los componentes de las etiquetas regulares de HTML!).

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Los nombres de los componentes de React deben comenzar con mayúscula.

Cambia `function profile()` a `function Profile()`, y luego cambia cada `<profile />` a `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
### Tu propio componente {/*your-own-component*/}
=======
#### Your own component {/*your-own-component*/}
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/your-first-component.md

Escribe un componente desde cero. Puedes darle cualquier nombre válido y retornar cualquier marcado. Si te quedas sin ideas, puedes escribir un componente `Congratulations` que muestre `<h1>Good job!</h1>`. ¡No olvides exportarlo!

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>