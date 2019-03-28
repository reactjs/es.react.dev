---
id: glossary
title: Glosario de términos de React
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Aplicación de página única {#single-page-application}

Una aplicación de página única (single-page application) es una aplicación que carga una única página HTML y todos los componentes necesarios (tales como JavaScript y CSS) para que se ejecute la aplicación. Cualquier interacción con la página o páginas subsecuentes no requiere hacer solicitudes al servidor lo que significa que la página no es recargada.

Aunque puedes construir una aplicación de página única con React, esto no es un requerimiento. React también puede ser utilizado para mejorar pequeñas partes de sitios web existentes con interactividad adicional. El código escrito en React puede coexistir pacíficamente con páginas renderizadas de lado del servidor por lenguajes como PHP, ó cualquier otra biblioteca del lado del cliente. De hecho, así es como React está siendo utilizado en Facebook.

## ES6, ES2015, ES2016, etc {#es6-es2015-es2016-etc}

Estas siglas se refieren a las más recientes versiones del estándar de Especificación de Lenguaje ECMAScript, del cual JavaScript es una implementación. La versión ES6 (también conocida como ES2015) incluye muchas adiciones a las versiones previas tales como: funciones flecha, clases, plantillas de cadena de texto, declaraciones de variables con `let` y `const`. Puedes aprender más sobre versiones específicas [aquí](https://es.wikipedia.org/wiki/ECMAScript#Versions).

## Compiladores {#compilers}

Un compilador de JavaScript toma el código JavaScript, lo transforma y devuelve en un formato diferente. El caso de uso más común es tomar código JavaScript con sintaxis ES6 y transformarlo en código que navegadores más antiguos puedan interpretar. [Babel](https://babeljs.io/) es el compilador más usado con React.

## Bundlers {#bundlers}

Los *bundlers* toman el código JavaScript y CSS escrito como módulos separados (frecuentemente cientos de ellos), y los combina en unos cuantos archivos mejor optimizados para los navegadores. Algunos *bundlers* comúnmente usandos en aplicaciones de React son [Webpack](https://webpack.js.org/) y [Browserify](http://browserify.org/).

## Package managers {#package-managers}

Los *package managers* son herramientas que te permiten administrar las dependencias de tu proyecto. [npm](https://www.npmjs.com/) y [Yarn](https://yarnpkg.com/) son dos *package managers* comúnmente usados en aplicaciones de React. Ambos son clientes para el mismo registro de paquetes npm.

## CDN {#cdn}

CDN son las siglas en inglés de *Content Delivery Network* (Red de Entrega de Contenido). Los *CDN* entregan contenido estático en caché desde una red de servidores alrededor del mundo.

## JSX {#jsx}

JSX es una extensión de sintaxis para JavaScript. Es similar a un *template language*, pero tiene todo el poder de JavaScript. JSX es compilado a llamadas `React.createElement()` que regresan simples objetos de JavaScript llamados *"elementos de React"*. Puedes encontrar una introducción básica a JSX en la documentación [aquí](/docs/introducing-jsx.html) y un tutorial más completo de JSX [aquí](/docs/jsx-in-depth.html).

*React DOM* usa una convención de nombres en *camelCase* para las propiedades en lugar de nombres de atributos HTML. Por ejemplo, `tabindex` se vuelve `tabIndex` en JSX. El atributo `class` se escribe como `className` ya que `class` es una palabra reservada en JavaScript:

```js
const name = 'Clementine';
ReactDOM.render(
  <h1 className="hello">My name is {name}!</h1>,
  document.getElementById('root')
);
```  

## [Elementos](/docs/rendering-elements.html) {#elements}

Los elementos de React son los bloques de construcción de una aplicación de React. Uno podría confundir los elementos con el concepto más ampliamente conocido de "componentes". Un elemento describe lo que quieres ver en pantalla. Los elementos de React son inmutables.

```js
const element = <h1>Hola, mundo</h1>;
```

Normalmente, los elementos no se utilizan directamente, si no que se devuelven desde los componentes.

## [Componentes](/docs/components-and-props.html) {#components}

Los componentes de React son pequeños y reutilizables fragmentos de código que devuelven un elemento de React para ser renderizado en una página. La versión más simple de un componente de React es una función en simple JavaScript que regrese un elemento de React:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
Los componentes también pueden ser clases de ES6:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Los componentes pueden ser divididos en distintas piezas de funcionalidad y usados en otros componentes. Los componentes pueden regresar otros componentes, arreglos, cadenas de texto y números. Una buena regla es que si una parte de tu interfaz es usada varias veces (Botón, Panel, Avatar), o es lo suficientemente compleja (App, Noticias, Comentario), es un buen candidato para ser un componente reusable. Los nombres de los componentes deberían también comenzar con una letra mayúscula (`<Wrapper/>` **no** `<wrapper/>`). Consulta [esta documentación](/docs/components-and-props.html#rendering-a-component) para obtener más información sobre el renderizado de componentes.

### [`props`](/docs/components-and-props.html) {#props}

`props` son entradas de un componente de React. Son información que es pasada desde un componente padre a un componente hijo.

Recuerda que los `props` son de sólo lectura. No deben ser modificados de ninguna forma: 

```js
// Incorrecto!
props.number = 42;
```

Si necesitas modificar algún valor en respuesta de una entrada del usuario o una respuesta de red, usa el `estado` en su lugar.

### `props.children` {#propschildren}

`props.children` está disponible en cada componente. Contiene el contenido ubicado entre las etiquetas de apertura y cierre de un componente. Por ejemplo:

```js
<Welcome>Hello world!</Welcome>
```

La cadena de texto `Hello world!` está disponible en `props.children` en el componente `Welcome`:

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```
Para los componentes definidos como clases, usa `this.props.children`:

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`estado`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

Un componente necesita `estado` cuando algunos datos asociados a el cambian con el tiempo. Por ejemplo, un componente `Checkbox` tal vez necesite `isChecked` en su estado, y un componente `NewsFeed` tal vez necesite mantener un registro de `fetchedPosts` en su estado.

La diferencia más importante entre `estado` y `props` es que los `props` son pasados desde un componente padre, pero el `estado` es manejado por el propio componente. Un componente no puede cambiar sus `props`, pero puede cambiar su `estado`.

Para cada pieza particular de datos cambiantes, debería existir solo un componente que lo "posea" en su estado. No intentes sincronizar estado de dos componentes distintos. En su lugar, [elévalo](/docs/lifting-state-up.html) a su ancestro compartido más cercano, y pásalo como *props* en ambos.

## [Métodos de ciclo de vida](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

Los métodos de ciclo de vida son funcionalidad personalizada que se ejecutan durante las diferentes fases de un componente. Existen métodos disponibles cuando el componente se crea y se inserta en el *DOM* ([*mounting*](/docs/react-component.html#mounting)), cuando el componente se actualiza, y cuando el componente es desmontado o removido del *DOM*. 

 ## [Componentes controlados](/docs/forms.html#controlled-components) vs. [componentes no controlados](/docs/uncontrolled-components.html)

React tiene dos enfoques distintos para tratar con las entradas de formularios.

Un elemento de entrada de un formulario cuyo valor está controlado por React es llamado *componente controlado*. Cuando un usuario introduce información en un *componente controlado* se activa un manejador de eventos de cambio y el código decide si la entrada es válida (volviendo a renderizar con el valor actualizado). Si no se vuelve a renderizar, el elemento del formulario permanecerá sin cambios.

Un *componente no controlado* funciona como los elementos de un formulario fuera de React. Cuando un usuario introduce información en un campo del formulario (una caja de texto, una lista de selección, etc) la información actualizada es reflejada sin que React tenga que hacer nada. Sin embargo, esto también significa que no se puede forzar al campo a que tenga un valor determinado.

En la mayoría de los casos debes usar *componentes controlados*.

## [Keys](/docs/lists-and-keys.html) {#keys}

Una *"key"* es un atributo especial (cadena de texto) de que necesitas incluir cuando creas un arreglo de elementos. Las *keys* ayudan a React a identificar que elementos han cambiado, han sido agregados o removidos. Las *keys* deben asignarse a los elementos dentro de un arreglo para darles una identidad estable.

Las *keys* sólo tienen que ser únicas entre elementos hermanos en el mismo arreglo. No necesitan ser únicos en toda la aplicación o incluso en el mismo componente.

No pases algo como `Math.random()` a las *keys*. Es importante que las *keys* tengan una "indentidad estable" a través de múltiples renderizados así React puede determinar cuales elementos fueron agregados, removidos o re-ordenados. Idealmente, las *keys* deberían corresponder a un identificador único y estable que venga desde los datos, por ejemplo: `post.id`.

## [Referencias](/docs/refs-and-the-dom.html) {#refs}

React admite un atributo especial que se puede agregar a cualquier componente. El atributo `ref` puede ser un objeto creado por [la función `React.createRef()`](/docs/react-api.html#reactcreateref) o una función *callback*, o una cadena de texto (en la API antigua). Cuando el atributo `ref` es una función de *callback*, la función recibe el elemento *DOM* subyacente o la instancia de clase (dependiendo del tipo de elemento) como argumento. Esto permite tener acceso directo al *DOM* del elemento o a la instancia del componente.

Usa los *refs* con moderación. Si te encuentras frecuentemente haciendo uso de los *refs* para "hacer que las cosas sucedan" en tu aplicación, considera familiarizarte más con [flujos de datos de arriba hacia abajo](/docs/lifting-state-up.html).

## [Eventos](/docs/handling-events.html) {#events}

El manejo de eventos con elementos de React tiene algunas diferencias sintácticas:

* Los manejadores de eventos en React son nombrados usando *camelCase*, en lugar de *lowercase*.
* Con JSX pasas una función como manejador de eventos, en lugar de una cadena de texto.

## [Reconciliación](/docs/reconciliation.html) {#reconciliation}

Cuando las *props* o el *estado* de un componente de React cambia, React decide si una actualización al *DOM* es necesaria comparando el elemento recién devuelto con el renderizado previamente. Cuando no son iguales, React actualizará el *DOM*. Este proceso es llamado "reconciliación".
