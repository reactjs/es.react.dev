---
id: thinking-in-react
title: Pensando en React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

React es, en nuestra opinión, la mejor forma de construir aplicaciones Web grandes y rápidas usando JavaScript. Ha escalado muy bien para nosotros en Facebook e Instagram.

Una de las grandes ventajas de React es cómo te hace pensar acerca de la aplicación mientras la construyes. En esta oportunidad vamos a ver el proceso de pensamiento al construir una tabla de productos con una funcionalidad de búsqueda usando React.

## Empieza con un mock {#start-with-a-mock}

Imagina que ya tenemos un API JSON y un mock de nuestro diseñador. Este luce más o menos así:

![Mockup](../images/blog/thinking-in-react-mock.png)

Nuestro API JSON devuelve información en el siguiente formato:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Paso 1: Divide la interfaz de usuario en una jerarquía de componentes {#step-1-break-the-ui-into-a-component-hierarchy}

Lo primero que vas a querer hacer es dibujar cajas alrededor de cada componente (y subcomponente) en el mock y darles nombres a todos ellos. Si trabajas con un diseñador, probablemente ya lo hayan hecho ¡Así que ve a hablar con ellos! ¡Los nombres de sus capas de Photoshop podrían terminar siendo los nombres de tus componentes de React!

¿Pero cómo sabes qué debería ser su propio componente? Usa las mismas técnicas para decidir si deberías crear una función u objeto nuevo. Una técnica es el [principio de responsabilidad única](https://es.wikipedia.org/wiki/Principio_de_responsabilidad_%C3%BAnica), esto significa que un componente debe, idealmente, hacer solo una cosa. Si termina creciendo entonces debería ser dividido en componentes más pequeños.

Dado a que normalmente estarás mostrando modelos de datos JSON de una API al usuario descubrirás que, si tu modelo fue construido correctamente, tu interfaz de usuario (y por lo tanto tu estructura de componentes) mapeará muy bien. Eso es porque la interfaz de usuario y el modelo de datos tienden a adherirse a la misma *arquitectura de información*. Separa tu interfaz de usuario en componentes de forma tal que cada componente se corresponda con una parte de tu modelo de datos.

![Diagrama de componentes](../images/blog/thinking-in-react-components.png)

Verás que tenemos cinco componentes en nuestra aplicación de ejemplo. Hemos escrito en cursiva la información que representan cada uno.

  1. **`FilterableProductTable` (naranja):** contiene la totalidad del ejemplo
  2. **`SearchBar` (azul):** recibe *lo que escriba el usuario*
  3. **`ProductTable` (verde):** muestra y filtra la *colección de datos* con base en *lo que escriba el usuario*
  4. **`ProductCategoryRow` (turquesa):** muestra el encabezado de cada *categoría*
  5. **`ProductRow` (rojo):** muestra una fila por cada *producto*

Si observas `ProductTable`, verás que el encabezado de la tabla (conteniendo las etiquetas "Name" y "Price") no es su propio componente. Esto es cuestión de preferencia, y hay argumentos para hacerlo de ambas formas. Para este ejemplo, decidimos dejarlos como parte de `ProductTable` porque es parte de representar la *colección de datos*, que es parte de las responsabilidades de `ProductTable`. De todas formas, si este encabezado crece hasta volverse demasiado complejo (por ejemplo, si tuviéramos que agregar una forma de ordenarlos), tendría sentido entonces que sea su propio componente `ProductTableHeader`.

Ahora que hemos identificado los componentes en nuestro mock, vamos a ordenarlos jerárquicamente. Esto es fácil. Los componentes que aparecen dentro de otro componente en nuestro mock deberían aparecer como hijos en la jerarquía.

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Paso 2: Crea una versión estática en React {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Revisa el código <a href="https://codepen.io/gaearon/pen/BwWzwm">Pensando en React: Paso 2</a> en <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Ahora que tenemos nuestra jerarquía de componentes, es momento de implementar la aplicación. La forma más fácil es construir una versión que tome nuestro modelo de datos y muestre la interfaz de usuario sin interactividad. Es mejor desacoplar estos procesos porque crear una versión estática requiere escribir un montón pero no pensar tanto, mientras que agregar interactividad requiere pensar un montón y no escribir tanto. Vamos a ver por qué.

Para construir una versión estática de tu aplicación que muestre tu modelo de datos vas a necesitar construir componentes que reusen otros componentes y pasen datos usando *props*. *props* son una forma de pasar datos de un padre a su hijo. Si estás familiarizado con el concepto de *estado*, **no uses para nada el estado** para crear esta versión estática. El estado está reservado para interactividad, esto es, cuando los datos cambian a través del tiempo. Dado que esta es una versión estática de la aplicación, no lo necesitas.

Puedes construir tu aplicación de arriba para abajo o de abajo para arriba. Esto es, puedes o empezar construyendo los componentes más arriba en la jerarquía (empezar por `FilterableProductTable`) o puedes empezar por los que están más abajo (`ProductRow`). En ejemplos simples es normalmente más fácil empezar de arriba para abajo, en proyectos más grandes es más usual empezar a la inversa e ir escribiendo pruebas mientras vas subiendo en la jerarquía.

Al final de este paso tendrás una colección de componentes reutilizables que representan tu modelo de datos. Estos componente solo tendrán un método `render()` ya que esta es la versión estática de la aplicación. El primer componente de la jerarquía (`FilterableProductTable`) recibe tu modelo de datos como prop. Si realizas un cambio en este y ejecutas `ReactDOM.render()` de nuevo, la interfaz de usuario se va a actualizar. Es fácil ver cómo se actualiza la interfaz de usuario y donde hacer cambios ya que no hay nada complicado ocurriendo. El **flujo de datos en un sentido** de React (también llamado *one-way binding*) ayuda a mantener todo modular y rápido.

Revisa la [documentación de React](/docs/) si necesitas ayuda con este paso.

### Una pequeña pausa: Props vs. estado {#a-brief-interlude-props-vs-state}

Hay dos tipos de datos en React: props y estado. Es importante entender la diferencia entre estos dos; ojea la [documentación oficial de React](/docs/state-and-lifecycle.html) si no estás seguro de la diferencia entre ambos. Consulta también [¿Cuál es la diferencia entre state y props?](/docs/faq-state.html#what-is-the-difference-between-state-and-props)

## Paso 3: Identificar la versión mínima (pero completa) del estado de tu interfaz de usuario  {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

Para hacer tu interfaz de usuario interactiva vas a necesitar realizar cambios en tu modelo de datos interno. React lo logra gracias a su **estado**.

Para armar tu aplicación de forma correcta necesitas primero pensar en la mínima cantidad de estado mutable que necesita la aplicación. Lo importante acá es que [*no te repitas*](https://es.wikipedia.org/wiki/No_te_repitas) (DRY: Don't Repeat Yourself). Necesitas descubrir la mínima representación del estado que tu aplicación va a necesitar y calcular el resto bajo demanda. Por ejemplo, si estás creando una lista de tareas pendientes, solo mantén un array de las tareas, no mantengas una variable a parte en el estado para contar cuantas hay. En vez de eso, cuando vayas a mostrar cuántas hay simplemente obtén el largo del array de tareas.

Piensa en todas la información que posee nuestra aplicación de ejemplo. Tenemos:

  * La lista original de productos
  * El texto de búsqueda que el usuario ingresó
  * El valor del checkbox
  * La lista filtrada de productos

Vayamos uno por uno y pensemos cuales son parte del estado. Hazte estas tres preguntas por cada pieza de información:

  1. ¿Viene del padre como props? Entonces probablemente no sea estado.
  2. ¿Se queda sin cambios con el tiempo? Entonces, probablemente no sea estado.
  3. ¿Puedes calcularlo con base a otro estado o prop en tu componente? Entonces, no es parte del estado.

La lista original de productos llega como props, entonces no es estado. El texto de búsqueda y el valor del checkbox parecen ser estado ya que cambian con el tiempo y no se pueden calcular usando otra información. Finalmente, la lista filtrada de productos no es estado debido a que puede ser calculada combinando la lista original de productos con el texto de búsqueda y el valor del checkbox.

Finalmente, nuestro estado es:

  * El texto de búsqueda que el usuario ingresó
  * El valor del checkbox

## Paso 4: Identificar dónde debe vivir tu estado {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Revisa el código <a href="https://codepen.io/gaearon/pen/qPrNQZ">Pensando en React: Paso 4</a> en <a href="https://codepen.io">CodePen</a>.</p>

Bien, hemos identificado la mínima cantidad de estado en la aplicación. Lo siguiente que necesitamos hacer es identificar qué componentes modifican o *son dueños* de este estado.

Recuerda: React se trata de usar un flujo de datos en un sentido. Puede que no sea inmediatamente obvio cuál componente debería poseer el estado. **Esta es normalmente la parte más complicada para quienes están arrancando con React**, así que sigue estos pasos para averiguarlo.

Para cada parte del estado de tu aplicación:

  * Identifica qué componentes muestran algo con base a este estado.
  * Busca un componente común a estos más arriba en la jerarquía.
  * Este componente o uno más arriba en la jerarquía debería poseer el estado.
  * Si no puedes crear un nuevo componente que tenga sentido que posea el estado, crea un nuevo componente simplemente para poseer el estado y agrégalo en la jerarquía sobre los componentes que lo necesitan.

Usemos esta estrategia para nuestra aplicación:

  * `ProductTable` necesita filtrar la lista de productos con base al estado y `SearchBar` necesita mostrar el texto de búsqueda y el estado del checkbox.
  * El componente padre común a ambos es `FilterableProductTable`.
  * Conceptualmente tiene sentido que el texto de búsqueda y el valor del checkbox vivan en `FilterableProductTable`.

Genial, hemos decidido que nuestro estado viva en `FilterableProductTable`. Primero, agrega `this.state = {filterText: '', inStockOnly: false}` al `constructor` de `FilterableProductTable` para reflejar el estado inicial de tu aplicación. Entonces pasa `filterText` y `inStockOnly` a `ProductTable` y `SearchBar` como props. Finalmente usa estos props para filtrar las filas en `ProductTable` y establece el valor de los campos del formulario en `SearchBar`.

Ya puedes ir viendo como tu aplicación se va a comportar. Cambia `filterText` a `"ball"` como valor inicial y recarga tu aplicación. Verás que la tabla de datos se actualizó correctamente.

## Paso 5: Agregar flujo de datos inverso {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">Revisa el código <a href="https://codepen.io/gaearon/pen/LzWZvb">Pensando en React: Paso 5</a> en <a href="https://codepen.io">CodePen</a>.</p>

Hasta ahora, hemos creado una aplicación que funciona correctamente como una función de los props y estado fluyendo hacia abajo en la jerarquía. Es momento entonces de empezar a soportar que los datos fluyan en el otro sentido: el componente de formulario ubicado más abajo en la jerarquía necesita actualizar el estado en `FilterableProductTable`.

React hace de este flujo de datos explícito para que sea más fácil entender cómo funciona la aplicación, a cambio necesita un poco más de código que un flujo de datos en dos sentidos tradicional.

Si intentas escribir o marcar la caja en la versión actual del ejemplo, verás que React ignora lo que hagas. Esto es intencional, ya que definimos el prop `value` del `input` para ser siempre igual al `estado` recibido de `FilterableProductTable`.

Vamos a pensar que es lo que queremos que ocurra. Queremos estar seguros de que cada vez que el usuario modifica el formulario, se actualiza el estado para reflejar lo que el usuario ingresó. Ya que los componentes solo pueden actualizar su propio estado, entonces `FilterableProductTable` necesita pasar funciones a `SearchBar` que este ejecutará cada vez que el estado deba actualizarse. Podemos usar el evento `onChange` del input para que nos notifique de esto. La función que pasa `FilterableProductTable` va a ejecutar entonces `setState()`, y la aplicación se va a actualizar.

Aunque parece complejo, son en realidad unas pocas líneas de código. Y se vuelve realmente explícito como fluyen los datos a través de la aplicación.

## Eso es todo {#and-thats-it}

Ojalá esto te haya dado una idea de cómo pensar al momento de crear componentes y aplicaciones con React. Aunque puede ser un poco más de código de lo que estás acostumbrado, recuerda que uno lee más código del que escribe y es menos difícil leer este código modular y explícito. Mientras vayas creando colecciones grandes de componentes, vas a apreciar esta claridad y modularidad, y con la reutilización de componente, las líneas de código van a empezar a reducirse. :)
