---
title: Escribir marcado con JSX
---

<Intro>

*JSX* es una extensión de sintaxis para JavaScript que permite escribir marcado similar a HTML dentro de una archivo JavaScript. Aunque hay otras formas de escribir componentes, la mayoría de los desarrolladores de React prefieren la concisión de JSX, y la mayoría de las bases de código lo usan.

</Intro>

<YouWillLearn>

* Por qué React mezcla marcado con lógica de renderizado
* En qué se diferencia JSX de HTML
* Cómo mostrar información con JSX

</YouWillLearn>

## JSX: Poniendo marcado dentro de JavaScript {/*jsx-putting-markup-into-javascript*/}

La Web se ha construido sobre HTML, CSS, y JavaScript. Durante muchos años, los desarrolladores web mantuvieron el contenido en HTML, el diseño en CSS, y la lógica en JavaScript, ¡a menudo en archivos separados!. El contenido se marcó dentro del HTML mientras que la lógica de la pagina vivía por separado en JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="Marcado HTML con fondo celeste y un div con dos etiquetas hijas: p y form.">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Tres manejadores de JavaScript con fondo amarillo: onSubmit, onLogin y onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Pero, a medida que la Web se volvió más interactiva, la lógica determinó cada vez más el contenido. ¡JavaScript estaba a cargo del HTML! Esto es la razón por la que **en React, la lógica de renderizado y el marcado viven juntos en el mismo lugar: componentes.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="Componente React con HTML y JavaScript de ejemplos anteriores mezclados. El nombre de la función es Sidebar que llama a la función isLoggedIn, resaltada en amarillo. Anidada dentro de la función resaltada en celeste está la etiqueta p de antes, y una etiqueta Form que hace referencia al componente mostrado en el siguiente diagrama.">

Componente de React `Sidebar.js`

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="Componente React con HTML y JavaScript de ejemplos anteriores mezclados. El nombre de la función es Form y contiene dos manejadores onClick y onSubmit resaltados en amarillo. Después de los manejadores está el HTML resaltado en celeste. El HTML contiene un elemento form con elementos input anidado, cada uno con una prop onClick.">

Componente de React `Form.js`

</Diagram>

</DiagramGroup>

Mantener juntas la lógica de renderizado y el marcado de un botón, garantiza que permanezcan sincronizados entre sí en cada edición. Por el contrario, los detalles que no están relacionados, como el marcado de un botón y el marcado de una barra lateral, están aislados entre sí, haciendo que sea más seguro cambiar cualquiera de ellos por su cuenta.

Cada componente de React es una función de JavaScript que puede contener algún marcado que React muestra en el navegador. Los componentes de React usan una extensión de sintaxis llamada JSX para representar el marcado. JSX se parece mucho a HTML, pero es un poco más estricto y puede mostrar información dinámica. La mejor manera de comprender esto es convertir algunos marcados HTML en marcado JSX.

<Note>

JSX y React son independientes. A menudo se usan en conjunto, pero se *pueden* [usar de forma separada](https://es.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform). JSX es una extensión de sintaxis, mientras React es una biblioteca de JavaScript.

</Note>

## Convertir HTML a JSX {/*converting-html-to-jsx*/}

Supongamos que tienes algo de HTML (perfectamente válido):


```html
<h1>Tareas Pendientes de Hedy Lamarr</h1>
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  class="photo"
>
<ul>
    <li>Inventar nuevos semáforos
    <li>Ensayar la escena de la película
    <li>Mejorar la tecnología del espectro
</ul>
```

Y quieres ponerlo en tu componente:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Si lo copias y pegas tal como está, no funcionará:


<Sandpack>

```js
export default function TodoList() {
  return (
    // ¡Esto no funciona!
    <h1>Tareas Pendientes de Hedy Lamarr</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Inventar nuevos semáforos
      <li>Ensayar la escena de la película
      <li>Mejorar la tecnología del espectro
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

¡Esto se debe a que JSX es más estricto y tiene algunas restricciones más que HTML! Si lees los mensajes de error anteriores, te guiarán a corregir el marcado, o puedes seguir la guía a continuación.

<Note>

La mayoría de las veces, los mensajes de error en pantalla de React te ayudarán a encontrar donde está el problema. ¡Dales una lectura si te quedas atascado!.

</Note>

## Las Reglas de JSX {/*the-rules-of-jsx*/}

### 1. Devolver un solo elemento raíz {/*1-return-a-single-root-element*/}

Para devolver múltiples elementos de un componente, **envuélvelos con una sola etiqueta principal**.

Por ejemplo, puedes usar un `<div>`:

```js {1,11}
<div>
  <h1>Tareas Pendientes de Hedy Lamarr</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Si no deseas agregar un `<div>` adicional a tu marcado, puedes escribir `<>` y `</>` en su lugar:

```js {1,11}
<>
  <h1>Tareas Pendientes de Hedy Lamarr</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Esta etiqueta vacía se llama un *[Fragmento](/reference/react/Fragment)*. Los Fragmentos te permiten agrupar cosas sin dejar ningún rastro en el árbol HTML del navegador.

<DeepDive>

#### ¿Por qué se necesita envolver múltiples etiquetas JSX? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX parece HTML, pero por debajo se transforma en objetos planos de JavaScript. No puedes devolver dos objetos desde una función sin envolverlos en un array. Esto explica por qué tampoco puedes devolver dos etiquetas JSX sin envolverlas en otra etiqueta o Fragmento.

</DeepDive>

### 2. Cierra todas las etiquetas {/*2-close-all-the-tags*/}

JSX requiere que las etiquetas se cierren explícitamente: las etiquetas de cierre automático como `<img>` deben convertirse en `<img />`, y etiquetas envolventes como `<li>naranjas` deben convertirse como `<li>naranjas</li>`.

Así es como la imagen y los elementos de lista de Hedy Lamarr se ven cerrados:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Inventar nuevos semáforos</li>
    <li>Ensayar la escena de la película</li>
    <li>Mejorar la tecnología del espectro</li>
  </ul>
</>
```

### 3. ¡camelCase <s>todo</s> la mayoría de las cosas! {/*3-camelcase-salls-most-of-the-things*/}

JSX se convierte en JavaScript y los atributos escritos en JSX se convierten en _keys_ de objetos JavaScript. En tus propios componentes, a menudo vas a querer leer esos atributos en variables. Pero JavaScript tiene limitaciones en los nombres de variables. Por ejemplo, sus nombres no pueden contener guiones ni ser palabras reservadas como `class`.

Por eso, en React, muchos atributos HTML y SVG están escritos en camelCase. Por ejemplo, en lugar de `stroke-width` usa `strokeWidth`. Dado que `class` es una palabra reservada, en React escribes `className` en su lugar, con el nombre de la [propiedad DOM correspondiente](https://developer.mozilla.org/es/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

Puedes [encontrar todos estos atributos en la lista de props de los componentes DOM](/reference/react-dom/components/common). Si te equivocas en uno, no te preocupes, React imprimirá un mensaje con una posible corrección en la [consola del navegador](https://developer.mozilla.org/docs/Tools/Browser_Console).

<Pitfall>

Por razones históricas, los atributos [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) y [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) se escriben como en HTML, con guiones.

</Pitfall>

### Consejo profesional: usa un convertidor JSX {/*pro-tip-use-a-jsx-converter*/}

¡Convertir todos estos atributos en el marcado existente puede ser tedioso! Recomendamos usar un [convertidor](https://transform.tools/html-to-jsx) para traducir su HTML y SVG existente a JSX. Los convertidores son muy útiles en la práctica, pero aun así vale la pena entender lo que sucede así puedes escribir JSX cómodamente por tu cuenta.

Aquí está tu resultado final:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Tareas Pendientes de Hedy Lamarr</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Inventar nuevos semáforos</li>
        <li>Ensayar la escena de la película</li>
        <li>Mejorar la tecnología del espectro</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Ahora sabes por qué existe JSX y cómo usarlo en componentes:

* Los componentes de React agrupan la lógica de renderización junto con el marcado porque están relacionados.
* JSX es similar a HTML, con algunas diferencias. Puede usar un [convertidor](https://transform.tools/html-to-jsx) si lo necesita.
* Los mensajes de error a menudo te guiarán en la dirección correcta para corregir tu marcado.

</Recap>



<Challenges>

#### Convierte algo de HTML a JSX {/*convert-some-html-to-jsx*/}

Este HTML se pegó en un componente, pero no es JSX válido. Arreglalo;

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>¡Bienvenido a mi sitio web!</h1>
    </div>
    <p class="summary">
      Puedes encontrar mis reflexiones aquí.
      <br><br>
      <b>¡Y <i>fotografías</b></i> de científicos!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

¡Tú decides si hacerlo a mano o usando el convertidor!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>¡Bienvenido a mi sitio web!</h1>
      </div>
      <p className="summary">
        Puedes encontrar mis reflexiones aquí.
        <br /><br />
        <b>¡Y <i>fotografías</i></b> de científicos!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
