---
id: forwarding-refs
title: Reenvío de refs
permalink: docs/forwarding-refs.html
---

El reenvío de refs es una técnica para pasar automáticamente una [ref](/docs/refs-and-the-dom.html) a través de un componente a uno de sus hijos. Esto normalmente no es necesario para la mayoría de los componentes en una aplicación. Sin embargo, puede ser útil para ciertos tipos de componentes, especialmente en bibliotecas de componentes reutilizables. Los escenarios más comunes son descritos a continuación.

## Reenviando refs a componentes DOM {#forwarding-refs-to-dom-components}

Considere un componente `FancyButton` que renderiza el elemento DOM nativo `button`:
`embed:forwarding-refs/fancy-button-simple.js`

Los componentes React ocultan sus detalles de implementación, incluyendo su salida renderizada. Otros componentes que usen `FancyButton` **usualmente no necesitarán** [obtener una ref](/docs/refs-and-the-dom.html) del elemento DOM interno `button`. Esto es bueno, ya que previene que los componentes dependan demasiado de la estructura DOM de otros.

Aunque dicho encapsulamiento es deseable para componentes a nivel de aplicación como `FeedStory` o `Comment`, puede ser inconveniente en el caso de componentes "hoja" altamente reutilizables como `FancyButton` o `MyTextInput`. Estos componentes tienden a ser usados a lo largo de las aplicaciones de forma similar a los componentes DOM `button` e `input`, y acceder sus nodos DOM puede resultar inevitable para gestionar el foco, la selección, o animaciones.

**El Reenvío de refs es una característica opcional que permite a algunos componentes tomar una `ref` que reciben, y pasarla (en otras palabras, "reenviarla") a un hijo.**

En el siguiente ejemplo, `FancyButton` usa `React.forwardRef` para obtener la `ref` que le pasaron, y luego reenviarla al `button` DOM que renderiza:

`embed:forwarding-refs/fancy-button-simple-ref.js`

De esta forma, los componentes que usan `FancyButton` pueden obtener una ref al nodo DOM `button` subyacente, y accederlo si es necesario - tal como si estuvieran usando el `button` DOM directamente.

A continuación un explicación paso a paso de lo que sucede en el ejemplo de arriba:

1. Creamos una [ref React](/docs/refs-and-the-dom.html) llamando `React.createRef` y la asignamos a la variable `ref`.
1. Pasamos nuestra `ref` hacia `<FancyButton ref={ref}>` al especificarla como un atributo JSX.
1. React pasa la `ref` a la función `(props, ref) => ...` dentro de `forwardRef` como segundo argumento.
1. Reenviamos este argumento `ref` hacia `<button ref={ref}>` al especificarla como un atributo JSX.
1. Cuando la ref es adjuntada, `ref.current` apuntará al nodo DOM `<button>`.

>Nota
>
>El segundo argumento `ref` solo existe cuando defines un componente con una llamada a `React.forwardRef`. Los componentes normales de función o de clase no reciben el argumento `ref` y ref támpoco está disponible entre sus props.
>
>El Reenvío de refs no esta limitado únicamente a componentes DOM. También se puede reenviar refs a instancias de componentes de clase.

## Nota para los mantenedores de bibliotecas de componentes {#note-for-component-library-maintainers}

**Una vez empiezas a usar `forwardRef` en una biblioteca de componentes, debes tratarlo como un cambio incompatible y liberar una nueva versión mayor de la biblioteca**. Esto es debido a que probablemente tu biblioteca tendrá un comportamiento observable muy diferente (tal como a que se asignan las refs, y que tipos son exportados), y esto puede romper aplicaciones y otras bibliotecas que dependan del comportamiento anterior.

Aplicar `React.forwardRef` de forma condicional cuando existe tampoco es recomendado por las mismas razones: cambia el comportamiento de tu biblioteca y puede romper las aplicaciones de tus usuarios cuando actualicen React.

## Reenviando refs en componentes de orden superior {#forwarding-refs-in-higher-order-components}

Esta técnica puede ser particularmente útil con [componentes de orden superior](/docs/higher-order-components.html) (también conocidos como `HOCs` por las siglas en inglés de _Higher-Order Components_). Comencemos con un ejemplo de un HOC que imprime los props de un componente a la consola:
`embed:forwarding-refs/log-props-before.js`

El HOC "logProps" pasa todas sus `props` al componente que envuelve, así que la salida renderizada será la misma. Por ejemplo, podemos usar este HOC para imprimir todas las `props` que son pasadas a nuestro componente "FancyButton":
`embed:forwarding-refs/fancy-button.js`

Hay un detalle en el ejemplo anterior: las refs no son pasadas. Esto es porque `ref` no es una prop. Al igual que `key`, es manejada de una forma diferente por React. Si añades una ref a un HOC, la ref se referirá al componente contenedor más externo, no al componente envuelto.

Esto significa que las `refs` que queremos para nuestro componente `FancyButton` de hecho estarán adjuntadas al componente `LogProps`:
`embed:forwarding-refs/fancy-button-ref.js`

Afortunadamente, podemos reenviar explícitamente refs al componente interno `FancyButton` usando el API `React.forwardRef`. `React.forwardRef` acepta una función de renderizado que recibe los parámetros `props` y `ref`, y devuelve un nodo React. Por ejemplo:
`embed:forwarding-refs/log-props-after.js`

## Mostrar un nombre personalizado en las herramientas de desarrollo {#displaying-a-custom-name-in-devtools}

`React.forwardRef` acepta una función de renderizado. Las herramientas de desarrollo de React (_React DevTools_) usan esta función para determinar que nombre mostrar para el componente que hace el reenvio.
 
Por ejemplo, el siguiente componente aparecerá como "*ForwardRef*" en _DevTools_:

`embed:forwarding-refs/wrapped-component.js`

Si nombras la función, _DevTools_ también incluirá su nombre (Ej: "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

Puedes incluso asignar la propiedad `displayName` de la función para que incluya el componente que estás envolviendo:

`embed:forwarding-refs/customized-display-name.js`
