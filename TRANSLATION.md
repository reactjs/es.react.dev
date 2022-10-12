# Traducción

Progreso actual: https://github.com/reactjs/es.reactjs.org/issues/500

# Guía de estilo

## Identificadores de los títulos

Los títulos de las secciones tienen identificadores explícitos de la siguiente manera:

```md
## Try React {#try-react}
```

¡**NO** traduzcas estos identificadores! Se usan para la navegación y no funcionaría correctamente si se hace referencia externamente, o sea:

```md
Consulta la [sección de inicio](/getting-started#try-react) para más información.
```

✅ CORRECTO:

```md
## Prueba React {#try-react}
```

❌ INCORRECTO:

```md
## Prueba React {#prueba-react}
```

Esto hará que el enlace de arriba deje de funcionar.

## Texto en bloques de código

Deja el texto en los bloques de código sin traducir, excepto para los comentarios. Opcionalmente puedes traducir el texto en cadenas, ¡pero cuida de no traducir cadenas que hagan referencia a código!

Ejemplo:
```js
// Example
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ CORRECTO:

```js
// Ejemplo
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ TAMBIÉN CORRECTO:

```js
// Ejemplo
const element = <h1>Hola mundo</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

❌ INCORRECTO:

```js
// Ejemplo
const element = <h1>Hola mundo</h1>;
// "root" hace referencia a un indentificador de un elemento.
// NO LO TRADUZCAS
ReactDOM.render(element, document.getElementById('raíz'));
```

❌ DEFINITIVAMENTE INCORRECTO:

```js
// Ejemplo
const elemento = <h1>Hola mundo</h1>;
ReactDOM.hacer(elemento, documento.obtenerElementoPorId('raíz'));
```

## Enlaces externos

Si un enlace externo es a un artículo en un sitio de referencias como [MDN] o [Wikipedia] y existe una versión de este artículo en español con una calidad aceptable, considera sustituir el enlace por el de esa versión.

[MDN]: https://developer.mozilla.org/en-US/
[Wikipedia]: https://en.wikipedia.org/wiki/Main_Page

Ejemplo:

```md
React elements are [immutable](https://en.wikipedia.org/wiki/Immutable_object).
```

✅ BIEN:

```md
Los elementos de React son [inmutables](https://es.wikipedia.org/wiki/Objeto_inmutable).
```

Para enlaces que no tienen un equivalente en español (Stack Overflow, videos de YouTube, etcétera) mantén el enlace en inglés.

## Uso de mayúsculas en el nombre de las páginas y los encabezados

Cuando escribas los nombres de las páginas y de los encabezados, recuerda que solo debe empezar con mayúscula la primera palabra de la frase. 

Ejemplo:

```md
## Importing and Exporting Components
```

✅ CORRECTO:

```md
## Importar y exportar componentes
```

❌ INCORRECTO:

```md
## Importar y Exportar Componentes
```

## Usted, tú y vos

El uso de la segunda persona del singular varía en las diferentes variantes del español. Aunque todas son perfectamente válidas hemos optado por usar solo la forma «tú» para mantener la consistencia. Entre las razones para esta decisión se encuentra nuestro deseo de mantener el tono relativamente informal de la documentación original y evitar ambigüedades cuando se omite el pronombre.

## El gerundio

En inglés es común el uso del gerundio con función sustantiva en los títulos. Al traducirlo al español deberíamos evitar el calco, en este caso generalmente se puede usar el infinitivo:

Ejemplo:

```md
## Thinking in React
```

✅ CORRECTO:

```md
## Pensar en React
```

❌ INCORRECTO:

```md
## Pensando en React
```

# Traducciones comunes

Aquí hay algunas sugerencias para la traducción de términos de uso común en este tipo de documentación técnica.

| Original word/term | Suggestion |
| ------------------ | ---------- |
| array | *array* |
| arrow function | función flecha |
| assert | comprobar |
| bug | error |
| bundler | *bundler* |
| callback | *callback* |
| camelCase | *camelCase* |
| codebase | base de código |
| controlled component | componente controlado |
| debugging | depuración |
| event handler | manejador de eventos |
| event handler function | función manejadora de eventos |
| DOM | DOM |
| framework | *framework* |
| function component | componente de función |
| hook | *hook* |
| key | *key* |
| indentation | sangrado o tabulación |
| lazy initialization | inicialización diferida |
| library | biblioteca |
| lowercase | minúscula(s) |
| props | *props* |
| React element | Elemento de React |
| render | renderizar (verb), renderizado (noun)
| shallow rendering | renderizado superficial |
| set the state | asignar el estado |
| state | estado |
| string | *string* |
| template literals | *template literals* |
| uncontrolled component | componente no controlado |
| update the state | actualizar el estado
