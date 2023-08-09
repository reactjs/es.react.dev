# Contribuir

¡Gracias por tu interés en contribuir a React Docs!

## Código de conducta

Facebook ha adoptado un Código de Conducta que esperamos que cumplan
del proyecto. Por favor, [lee el texto completo](https://code.facebook.com/codeofconduct)
para que puedas comprender qué acciones se tolerarán y cuáles no.

## Consejos de redacción técnica

Este es un [buen resumen](https://medium.com/@kvosswinkel/coding-like-a-journalist-ee52360a16bc) de cosas a tener en cuenta al escribir documentos técnicos.

## Pautas para el texto

**Las distintas secciones tienen intencionadamente estilos diferentes.**

La documentación está dividida en secciones para atender a diferentes estilos de aprendizaje y casos de uso. Cuando edites un artículo, intenta igualar el tono y el estilo del texto que lo rodea. Al crear un nuevo artículo, intenta que coincida con el tono de los demás artículos de la misma sección. Conoce a continuación la motivación de cada sección.

**[Aprende React](https://es.react.dev/learn)** está diseñado para introducir conceptos fundamentales paso a paso. Cada artículo individual de Aprende React se basa en los conocimientos de los anteriores, así que asegúrate de no añadir ninguna "dependencia cíclica" entre ellos. Es importante que el lector pueda empezar por el primer artículo y llegar hasta el último artículo de Aprende React sin tener que "mirar hacia delante" en busca de una definición. Esto explica algunas opciones de ordenación (por ejemplo, que el estado se explique antes que los eventos, o que "pensar en React" no utilice refs). Learn React también sirve como manual de referencia para los conceptos de React, por lo que es importante ser muy estricto con sus definiciones y las relaciones entre ellas.

**[Referencia API](https://es.react.dev/reference/react)** está organizada por APIs y no por conceptos. Pretende ser exhaustiva. Cualquier caso práctico o recomendación que se haya omitido por brevedad en Aprende React se mencionará en la documentación de referencia de las API correspondientes.

**Intenta seguir tus propias instrucciones.**

Cuando escribas instrucciones paso a paso (por ejemplo, cómo instalar algo), intenta olvidar todo lo que sabes sobre el tema y sigue realmente las instrucciones que has escrito, paso a paso. A menudo descubrirás que hay conocimientos implícitos que olvidaste mencionar, o que en las instrucciones faltan pasos o están desordenados. Puntos extra por hacer que *otra persona* siga los pasos y observar con qué dificultades se encuentra. A menudo será algo muy sencillo que no has previsto.

## Pautas para los ejemplos de código

### Sintaxis

#### Prefiere JSX a `createElement`.

Ignora esto si estás describiendo específicamente `createElement`.

#### Usa `const` cuando sea posible, si no `let`. No uses `var`.

Ignora esto si estás escribiendo específicamente sobre ES5.

#### No utilices funciones de ES6 cuando las funciones equivalentes de ES5 no tienen inconvenientes.

Recuerda que ES6 es todavía nuevo para mucha gente. Aunque lo usamos en muchos sitios (`const` / `let`, clases, funciones de flecha), si el código ES5 equivalente es igual de sencillo y legible, considera usarlo.

En particular, deberías preferir las declaraciones `function` con nombre a las flechas `const myFunction = () => ...` para las funciones de nivel superior. Sin embargo, *deberías* usar funciones de flecha cuando proporcionen una mejora tangible (como preservar el contexto `this` dentro de un componente). Considera ambos lados de la compensación cuando decidas si utilizar una nueva función.

#### No utilices funciones que aún no estén normalizadas.

Por ejemplo, **no** escribas esto:

```js
class MyComponent extends React.Component {
  state = {value: ''};
  handleChange = (e) => {
    this.setState({value: e.target.value});
  };
}
```

En su lugar, **escribe** esto:

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: ''};
  }
  handleChange(e) {
    this.setState({value: e.target.value});
  }
}
```

Ignora esta regla si estás describiendo específicamente una propuesta experimental. Asegúrate de mencionar su carácter experimental en el código y en el texto que lo acompaña.

### Estilo

- Utiliza punto y coma.
- No dejes espacio entre los nombres de las funciones y los paréntesis (`method() {}` no `method () {}`).
- En caso de duda, utiliza el estilo por defecto preferido por [Prettier](https://prettier.io/playground/).

### Resaltar

Utiliza `js` como lenguaje de resaltado en los bloques de código Markdown:

````
```js
// Código
```
````

A veces verás bloques con números.  
Indican al sitio web que resalte líneas concretas.

Puedes resaltar una sola línea:

````
```js {2}
function hello() {
  // esta línea quedará resaltada
}
```
````

Un rango de líneas:

````
```js {2-4}
function hello() {
  // estas líneas
  // quedarán
  // resaltadas
}
```
````

O incluso varios rangos:

````
```js {2-4,6}
function hello() {
  // estas líneas
  // quedarán
  // resaltadas
  console.log('Hola');
  // también ésta
  console.log('a todos');
}
```
````

Ten en cuenta que si mueves algún código en un ejemplo con resaltado, también tendrás que actualizar el resaltado.

¡No tengas miedo de utilizar a menudo el resaltado! Es muy valioso cuando necesitas centrar la atención del lector en un detalle concreto que es fácil pasar por alto.
