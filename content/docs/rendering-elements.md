---
id: rendering-elements
title: Renderizando elementos
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Los elementos son los bloques más pequeños de las aplicaciones de React.

Un elemento describe lo que quieres ver en la pantalla:

```js
const element = <h1>Hello, world</h1>;
```

A diferencia de los elementos del DOM de los navegadores, los elementos de React son objetos planos, y su creación es de bajo costo. React DOM se encarga de actualizar el DOM para igualar los elementos de React.

>**Nota:**
>
>Uno podría confundir los elementos con el muy conocido concepto de "componentes". En la [siguiente sección](/docs/components-and-props.html) hablaremos de componentes. Los elementos son los que "constituyen" los componentes, y recomendamos leer esta sección antes de continuar.

## Renderizando un elemento en el DOM {#rendering-an-element-into-the-dom}

Digamos que hay un `<div>` en alguna parte de tu archivo HTML:

```html
<div id="root"></div>
```

Lo llamamos un nodo "raíz" porque todo lo que esté dentro de él será manejado por React DOM.

Las aplicaciones construidas solamente con React usualmente tienen un único nodo raíz en el DOM. Dado el caso que estés integrando React en una aplicación existente, puedes tener tantos nodos raíz del DOM aislados como quieras.

Para renderizar un elemento de React en un nodo raíz del DOM, pasa ambos a [`ReactDOM.render()`](/docs/react-dom.html#render):

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

Esto muestra "Hello, world" en la página.

## Actualizando el elemento renderizado {#updating-the-rendered-element}

Los elementos de React son [inmutables](https://es.wikipedia.org/wiki/Objeto_inmutable). Una vez creas un elemento, no puedes cambiar sus hijos o atributos. Un elemento es como un fotograma solitario en una película: este representa la interfaz de usuario en cierto punto en el tiempo.

Con nuestro conocimiento hasta este punto, la única manera de actualizar la interfaz de usuario es creando un nuevo elemento, y pasarlo a [`ReactDOM.render()`](/docs/react-dom.html#render).

Considera este ejemplo de un reloj en marcha:

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

Este llama a [`ReactDOM.render()`](/docs/react-dom.html#render) cada segundo desde un callback del [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).

>**Nota:**
>
>En la práctica, la mayoría de las aplicaciones de React solo llaman a [`ReactDOM.render()`](/docs/react-dom.html#render) una vez. En las siguientes secciones aprenderemos cómo el código se puede encapsular en [componentes con estado](/docs/state-and-lifecycle.html).
>
>Recomendamos que no te saltes ningún tema porque estos se relacionan entre ellos.

## React solo actualiza lo que es necesario {#react-only-updates-whats-necessary}

React DOM compara el elemento y su hijos con el elemento anterior, y solo aplica las actualizaciones del DOM que son necesarias para que el DOM esté en el estado deseado.

Puedes verificar esto inspeccionando el [último ejemplo](codepen://rendering-elements/update-rendered-element) con las herramientas del navegador:

![inspector del DOM mostrando actualizaciones diminutas](../images/docs/granular-dom-updates.gif)

Aunque creamos un elemento que describe el árbol de la interfaz de usuario en su totalidad en cada instante, React DOM solo actualiza el texto del nodo cuyo contenido cambió.

En nuestra experiencia, pensar en cómo la interfaz de usuario debería verse en un momento dado y no en cómo cambiarla en el tiempo, elimina toda una clase de errores.
