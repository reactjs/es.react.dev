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

Este marcado representa un artículo `<article>`, su encabezado `<h1>`, y una tabla de contenidos (abreviada) representada como una lista ordenada `<ol>`. Un marcado como este, combinado con CSS para los estilos y JavaScript para la interactividad, están detrás de cada barra lateral, avatar, modal, menú desplegable y cualquier otra pieza de UI que ves en la web.

React te permite combinar tu marcado, CSS y JavaScript en «componentes» personalizados, **elementos reutilizables de UI para tu aplicación.** El código de la tabla de contenidos que viste arriba pudo haberse transformado en un componente `<TableOfContents />` que podrías renderizar en cada página. Por detrás, seguiría utilizando las mismas etiquetas HTML como `<article>`, `<h1>`, etc.

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

En la medida en que tu proyecto crece, notarás que muchos de tus diseños se pueden componer mediante la reutilización de componentes que ya escribiste, acelerando el desarrollo. ¡Nuestra tabla de contenido de arriba podría añadirse a cualquier pantalla con `<TableOfContents />`! Incluso puedes montar tu proyecto con los miles de componentes compartidos por la comunidad de código abierto de React como [Chakra UI](https://chakra-ui.com/) y [Material UI](https://material-ui.com/).

## Definir un componente {/*defining-a-component*/}

Tradicionalmente, cuando se creaban páginas web, los desarrolladores web usaban lenguaje de marcado para describir el contenido y luego añadían interacciones agregando un poco de JavaScript. Esto funcionaba perfectamente cuando las interacciones eran algo *deseable, pero no imprescindible* en la web. Ahora es algo que se espera de muchos sitios y de todas las aplicaciones. React pone la interactividad primero usando aún la misma tecnología: **un componente de React es una función de JavaScript a la que puedes _agregar markup_**. Aquí vemos cómo luce esto (puede editar el ejemplo de abajo):

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

<Pitfall>

¡Los componentes de React son funciones regulares de JavaScript, pero **sus nombres deben comenzar con letra mayúscula** o no funcionarán!

</Pitfall>

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

<Pitfall>

¡Sin paréntesis, todo el código que está en las líneas posteriores al `return` [serán ignoradas](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

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

Los componentes son funciones regulares de JavaScript, por lo que puedes tener múltiples componentes en el mismo archivo. Esto es conveniente cuando los componentes son relativamente pequeños o están estrechamente relacionados entre sí. Si este archivo se torna abarrotado, siempre puedes mover `Profile` a un archivo separado. Aprenderás como hacer esto pronto en la [página sobre *imports*](/learn/importing-and-exporting-components).

Dado que los componentes `Profile` se renderizan dentro de `Gallery` —¡incluso varias veces!— podemos decir que `Gallery` es un **componente padre**, que renderiza cada `Profile` como un «hijo». Este es la parte mágica de React: puedes definir un componente una vez, y luego usarlo en muchos lugares y tantas veces como quieras.

<Pitfall>

Los componentes pueden renderizar otros componentes, pero **nunca debes anidar sus definiciones:**

```js {2-5}
export default function Gallery() {
  // 🔴 ¡Nunca definas un componente dentro de otro componente!
  function Profile() {
    // ...
  }
  // ...
}
```

El fragmento de código de arriba es [muy lento y causa errores.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) En su lugar, define cada componente en el primer nivel:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declara los componentes en el primer nivel
function Profile() {
  // ...
}
```

Cuando un componente hijo necesita datos de su padre, [pásalo por props](/learn/passing-props-to-a-component) en lugar de anidar las definiciones.

</Pitfall>

<DeepDive>

#### Componentes de arriba a abajo {/*components-all-the-way-down*/}

Tu aplicación de React comienza en un componente «raíz». Usualmente, se crea automáticamente cuando inicias un nuevo proyecto. Por ejemplo, si utilizas [CodeSandbox](https://codesandbox.io/) o [Create React App](https://create-react-app.dev/), el componente raíz se define en `src/App.js`. Si utilizas el framework [Next.js](https://nextjs.org/), el componente raíz se define en `pages/index.js`. En estos ejemplos, has estado exportando componentes raíces.

La mayoría de las aplicaciones de React utilizan componentes de arriba a abajo. Esto significa que no solo usarás componentes para las piezas reutilizables como los botones, pero también para piezas más grandes como barras laterales, listas, ¡y en última instancia, páginas completas! Los componentes son una forma útil de organizar código de UI y marcado, incluso cuando algunos de ellos solo se utilicen una vez.

Frameworks como Next.js lo llevan un paso más allá. En lugar de usar un archivo HTML vacío y dejar a React «ocuparse» de manejar la página con JavaScript, *también* generan el HTML automáticamente a partir de tus componentes de React. Esto permite que tu aplicación muestre algún contenido antes de que el código de JavaScript cargue.

Aún así, muchos sitios web solo utilizan React para [añadir «pequeñas gotas de interactividad»](/learn/add-react-to-a-website). Tienen muchos componentes raíces en lugar de uno solo para la página completa. Puedes utilizar tanto o tan poco de React como lo necesites.

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

#### Exporta el componente {/*export-the-component*/}

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

Puedes estar preguntándote por qué escribir solo `export` no es suficiente para arreglar este ejemplo. Puedes aprender sobre las diferencias entre `export` y `export default` en [Importar y exportar componentes](/learn/importing-and-exporting-components).

</Solution>

#### Arregla la sentencia de retorno {/*fix-the-return-statement*/}

Algo no está bien con esta sentencia `return`. ¿Puedes arreglarla?

<Hint>

<<<<<<< HEAD
Puede que tengas un error «Unexpected token» mientras intentas arreglar este ejemplo. Si te sucede, probablemente sea porque tienes algún punto y coma dentro de tu JSX, revisa que esté *después* del paréntesis de cierre. Si dejas un punto y coma dentro de un `return ( )` ocurrirá un error.
=======
You may get an "Unexpected token" error while trying to fix this. In that case, check that the semicolon appears *after* the closing parenthesis. Leaving a semicolon inside `return ( )` will cause an error.
>>>>>>> 47adefd30c46f486428d8231a68e639d62f02c9e

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

Puedes arreglar este componente moviendo la sentencia return a una sola línea de esta forma:

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

O poniendo el marcado JSX que se va a retornar dentro de paréntesis que se abren justo luego del `return`:

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

#### Detecta el error {/*spot-the-mistake*/}

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

#### Tu propio componente {/*your-own-component*/}

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
