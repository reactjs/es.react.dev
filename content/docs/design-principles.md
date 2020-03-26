---
id: design-principles
title: Principios de diseño
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

Escribimos este documento para que tengas una mejor idea de como decidimos lo que hace y lo que no hace React, y como es nuestra filosofía de desarrollo. Si bien estamos entusiasmados por ver contribuciones de la comunidad, es poco probable que elijamos una ruta que viole uno o más de estos principios.

>**Nota:**
>
>Este documento asume un fuerte entendimiento de React. Describe los principios de diseño de *React en sí mismo*, no de componentes o aplicaciones de React.
>
>Para una introducción a React, chequea en su lugar [Pensando en React](/docs/thinking-in-react.html).

### Composición {#composition}

La característica clave de React es la composición de componentes. Los componentes escritos por distintas personas deben trabajar bien en conjunto. Es importante para nosotros que puedas añadir funcionalidad a un componente sin causar una ola de cambios a lo largo de la base de código.

Por ejemplo, debería ser posible introducir algún estado local en un componente sin cambiar ninguno de los componentes que lo usen. Igualmente, debería ser posible añadir código de inicialización y destrucción a cualquier componente cuando sea necesario.

No hay nada "malo" en usar estado o métodos del ciclo de vida en componentes. Como cualquier funcionalidad poderosa, deben ser usados con moderación, pero no tenemos intención de eliminarlos. Por el contrario, pensamos que son parte integral de lo que hace útil a React. Podríamos habilitar [patrones más funcionales](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) en el futuro, pero tanto el estado local como los métodos del ciclo de vida serán parte de ese modelo.

Los componentes son a menudo descritos como "solo funciones", pero desde nuestro punto de vista necesitan ser más que eso para ser útiles. En React, los componentes describen cualquier comportamiento componible, y esto incluye el renderizado, el ciclo de vida y el estado. Algunas bibliotecas externas como [Relay](https://facebook.github.io/relay/) aumentan los componentes con otras responsabilidades tales como describir las dependencias de datos. Es posible que esas ideas también sean integradas en React de alguna manera.

### Abstracciones comunes {#common-abstraction}

En general [evitamos añadir funcionalidades](https://www.youtube.com/watch?v=4anAwXYqLG8) que puedan ser implementadas en espacio de usuario. No queremos sobrecargar tus aplicaciones con código de biblioteca que sea inútil. Sin embargo, existen excepciones.

Por ejemplo, si React no proveyera soporte para el estado local o métodos del ciclo de vida, las personas crearían abstracciones propias para eso. Cuando existen múltiples abstracciones compitiendo, React no puede imponer o aprovechar las propiedades de ninguna de ellas. Tendría que trabajar con el mínimo común denominador.

Es por eso que algunas veces añadimos funcionalidades a React. Si notamos que muchos componentes implementan una funcionalidad en específico de manera ineficiente o incompatible, podríamos preferir incluirla en React. No lo hacemos a la ligera. Cuando lo hacemos, es porque estamos confiados de que elevar el nivel de la abstracción beneficia al ecosistema en su conjunto. El estado, los métodos del ciclo de vida, y la normalización de eventos entre navegadores son ejemplos claros de esto.

Siempre discutimos estas propuestas de mejora con la comunidad. Puedes encontrar algunas de estas discusiones con la etiqueta ["big picture"](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") en el gestor de incidencias de React.

### Válvulas de escape {#escape-hatches}

React es pragmático. Esta guiado por la necesidad de los productos escritos en Facebook. Si bien es influenciado por algunos paradigmas que aún no son totalmente convencionales, tales como la programación funcional, mantenerlo accesible a un amplio rango de programadores con distintos niveles de experiencia y habilidades es uno de los objetivos explícitos del proyecto.

Si queremos descontinuar un patrón que no nos gusta, es nuestra responsabilidad considerar todos los casos de uso existentes para él, y antes de descontinuarlo [educar a la comunidad respecto a las alternativas](/blog/2016/07/13/mixins-considered-harmful.html). Si algún patrón es útil para construir aplicaciones, pero es difícil de expresar de una manera declarativa, [proveeremos una API imperativa](/docs/more-about-refs.html). Si no podemos encontrar una API perfecta para algo que consideramos necesario en múltiples aplicaciones, [temporalmente proporcionaremos una API funcional](/docs/legacy-context.html) siempre y cuando sea posible librarnos de ella posteriormente, y se deje la puerta abierta a mejoras futuras.

### Estabilidad {#stability}

Valoramos la estabilidad de la API. En Facebook tenemos más de 50 mil componentes usando React. Muchas otras compañías, incluyendo [Twitter](https://twitter.com/) y [Airbnb](https://www.airbnb.com/), también usan React extensamente. Es por eso que usualmente somos reacios a cambiar APIs o comportamientos públicos.

Sin embargo, creemos que la estabilidad en el sentido de "nada cambia" está sobrevalorada. Se transforma rápidamente en estancamiento. En su lugar, preferimos la estabilidad en el sentido de "es ampliamente usado en producción, y cuando algo cambia, hay una ruta clara (y preferiblemente automatizada) de migración."

Cuando descontinuamos un patrón, estudiamos su uso interno en Facebook y añadimos advertencias de descontinuación. Esto nos permite evaluar el impacto del cambio. A veces nos retractamos si vemos que es muy temprano, y que necesitamos pensar de una manera más estratégica como llevar las bases de código al punto en el cual estén listas para este cambio.

Si confiamos que el cambio no es muy disruptivo y que la estrategia de migración es viable para todos los casos de uso, liberamos las notificaciones de descontinuación a la comunidad de código abierto. Estamos en contacto cercano con muchos usuarios de React por fuera de Facebook, y monitoreamos proyectos de código abierto populares, y los guiamos en la resolución de estas descontinuaciones.

Dado el inmenso tamaño de la base de código en React de Facebook, una migración interna exitosa es a menudo un buen indicador de que otras compañías tampoco tendrán problemas. Sin embargo, a veces las personas nos indican casos de usos adicionales que no habíamos pensado, y añadimos válvulas de escape para ellos o repensamos nuestro enfoque.

No descontinuamos nada sin una buena razón. Reconocemos que a veces las advertencias de descontinuación causan frustración, pero las añadimos porque las descontinuaciones limpian el camino para las mejoras y nuevas funcionalidades que nosotros y muchos en la comunidad consideran valiosas.

Por ejemplo, en React 15.2.0 añadimos [una advertencia acerca de props desconocidos en el DOM](/warnings/unknown-prop.html). Muchos proyectos fueron afectados por esto. Sin embargo arreglar esta advertencia es importante para poder introducir en React soporte para [atributos personalizados](https://github.com/facebook/react/issues/140). Hay una razón como esta detrás de cada advertencia de descontinuación que añadimos.

Cuando añadimos una advertencia de descontinuación, la mantenemos por el resto de la versión mayor actual, y [cambiamos el comportamiento en la siguiente versión mayor](/blog/2016/02/19/new-versioning-scheme.html). Si hay un montón de trabajo manual involucrado, liberamos un script de [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) que automatiza la mayor parte del cambio. Los *Codemods* nos permiten avanzar sin estancamiento en una base de código masivo, y te alentamos a que también los uses.

Puedes encontrar los *codemods* que hemos liberado en el repositorio [react-codemod](https://github.com/reactjs/react-codemod).

### Interoperabilidad {#interoperability}

Valoramos altamente la interoperabilidad con sistemas existentes y la adopción gradual. Facebook tiene una base de código masiva que no es React. Sus sitios web usan una mezcla de un sistema de componentes del lado de servidor llamado XHP, bibliotecas internas de interfaz de usuario previas a React, y React. Para nosotros es importante que cualquier equipo de producto pueda [comenzar usando React para una funcionalidad pequeña](https://www.youtube.com/watch?v=BF58ZJ1ZQxY) en vez de reescribir su código para apostar por él.

Es por eso que React provee válvulas de escape para trabajar con modelos mutables, y trata de trabajar bien con otras bibliotecas de interfaz de usuario. Puedes envolver una interfaz de usuario imperativa en un componente declarativo, y viceversa. Esto es crucial para la adopción gradual.

### Planificación {#scheduling}

Incluso cuando tus componentes son descritos como funciones, al usar React no los llamas directamente. Cada componente retorna una [descripción de lo que necesita ser renderizado](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree), y dicha descripción puede incluir componentes escritos por el usuario como `<LikeButton>` y componentes específicos de la plataforma como `<div>`. Corresponde a React "desenrollar" `<LikeButton>` en algún momento en el futuro y aplicar recursivamente los cambios al árbol de interfaz de usuario de acuerdo a los resultados de renderizar los componentes.

Esta es una distinción sutil pero poderosa. Dado que no llamas la función del componente, pero dejas que React la llame, esto significa que React tiene el poder de retrasar esta llamada si es necesario. En su implementación actual React recorre el árbol recursivamente y llama a las funciones de renderizado del árbol completamente actualizado en un único `tick`. Sin embargo, en el futuro podría empezar a [retrasar algunas actualizaciones para evitar la eliminación de cuadros](https://github.com/facebook/react/issues/6170).

Este es un tema común en el diseño de React. Algunas bibliotecas populares implementan el enfoque *"push"* en el cual la computación se realiza cuando nuevos datos están disponibles. React, sin embargo, se apega al enfoque *"pull"* en el cual las computaciones pueden ser retrasadas hasta que sean necesarias.

React no es una biblioteca genérica de procesamiento de datos. Es una biblioteca para construir interfaces de usuario. Creemos que está posicionada de forma única en una aplicación para conocer cuales computaciones son relevantes inmediatamente y cuales no.

Si algo se encuentra fuera de la pantalla, podemos retrasar cualquier lógica relacionada. Si los datos están llegando más rápido que la tasa de cuadros por segundos, podemos fusionar y agrupar por lotes las actualizaciones. Podemos priorizar el trabajo proveniente de las interacciones del usuario (tales como las animaciones causadas por presionar un botón) por encima de trabajo en segundo plano menos importante (tal como renderizar nuevo contenido descargado recientemente de la red) para evitar la perdida de cuadros.

Para estar claros, no estamos aprovechando esto en este momento. Sin embargo la libertad de poder hacerlo es la razón por la que preferimos tener el control sobre la planificación, y por la que `setState()` es asíncrono. Conceptualmente, pensamos acerca de esto como "planificar una actualización".

El control sobre la planificación nos sería más difícil de obtener si dejamos que el usuario componga vistas directamente con un paradigma basado en *"push"* común en algunas variantes de la [Programación Funcional Reactiva](https://en.wikipedia.org/wiki/Functional_reactive_programming). Queremos tener la propiedad sobre el código "pega".

Es un objetivo clave para React que la cantidad del código de usuario que se ejecute antes de regresar a React sea mínimo. Esto asegura que React retenga la capacidad de planificar y dividir el trabajo en trozos de acuerdo a lo que conoce acerca de la interfaz de usuario.

Tenemos un chiste interno en el equipo de React acerca de que debería haberse llamado *"Schedule"* (el inglés para Plan), ya que React no quiere ser completamente "reactivo".

### Experiencia de desarrollador {#developer-experience}

Proveer una buena experiencia de desarrollador es importante para nosotros.

Por ejemplo, mantenemos las herramientas de desarrollo de React ([React DevTools](https://github.com/facebook/react-devtools)) las cuales te permiten inspeccionar el árbol de componentes de React en Chrome y Firefox. Hemos oído que proveen un gran incremento de productividad a los ingenieros de Facebook y a la comunidad.

También tratamos de dar un extra para proveer advertencias útiles a los desarrolladores. Por ejemplo, React te advierte en desarrollo si anidas etiquetas de una forma que el navegador no las entiende, o si cometes un error de transcripción en la API. Las advertencias a desarrolladores y los chequeos relacionados son la razón principal por la que la versión de desarrollo de React es más lenta que la versión de producción.

Los patrones de uso que observamos internamente en Facebook nos permiten entender cuales son los errores comunes, y prevenirlos de manera temprana. Cuando añadimos nuevas funcionalidades, tratamos de anticipar los errores comunes y advertir acerca de ellos.

Siempre estamos buscando formas de mejorar la experiencia de desarrollo. Nos encantaría oir tus sugerencias y aceptar contribuciones para mejorarla aún más.

### Depuración {#debugging}

Cuando algo sale mal, es importante contar con las migajas de pan que te permitan rastrear el error a su origen en la base de código. En React, los *props* y el estado son esas migajas de pan.

Si ves algo malo en la pantalla, puedes abrir la herramientas de desarrollo de React, encontrar el componente responsable del renderizado, y ver si los *props* y el estado son correctos. Si lo son, sabes que el problema está en la función `render()` del componente, o en alguna función llamada por `render()`. El problema está aislado.

Si el estado es incorrecto, sabes que el problema es causado por alguna de las llamadas a `setState()` en este archivo. Esto también es relativamente simple de ubicar y arreglar, porque usualmente hay solo unas pocas llamadas a `setState()` en un solo archivo.

Si los *props* son incorrectos, puedes recorrer el árbol hacia arriba en el inspector, buscando el componente que haya sido el primero en "envenenar el pozo" al pasar *props* incorrectas.

Esta capacidad de rastrear cualquier interfaz de usuario hasta los datos que la produjeron en la forma de *props* y estado actual es muy importante para React. Es un objetivo explícito del diseño que el estado no esté "atrapado" en combinadores y clausuras, y que esté disponible a React directamente.

Si bien la interfaz de usuario es dinámica, creemos que funciones `render()` síncronas en función de los *props* y el estado convierten la depuración de un trabajo adivinatorio en un procedimiento aburrido pero finito. Nos gustaría preservar esta restricción aunque haga algunos casos de uso, tales como animaciones complejas, más difíciles. 

### Configuración {#configuration}

Encontramos que las opciones de configuración globales en tiempo de ejecución son problemáticas.

Por ejemplo, ocasionalmente se nos solicita que implementemos una función como `React.configure(options)` o `React.register(component)`. Sin embargo, esto plantea múltiples problemas, y no conocemos buenas soluciones para ellos.

¿Qué pasaría si alguien llama dicha función desde una biblioteca de componentes de terceros? ¿Y qué si una aplicación React contiene embebida otra aplicación React, y sus configuraciones son incompatibles? ¿Cómo podría un componente de terceros especificar que requiere una configuración en particular? Creemos que una configuración global no funciona bien con la composición. Dado que la composición es central en React, no proveemos configuración global en el código.

Sin embargo, sí proveemos alguna configuración global a nivel de compilación. Por ejemplo, proveemos procesos de compilación separados para desarrollo y producción. Podríamos también  [incluir una compilación para análisis de rendimiento](https://github.com/facebook/react/issues/6627) en el futuro, y estamos abiertos a considerar otras opciones de compilación.

### Más allá del DOM {#beyond-the-dom}

Vemos el valor de React en la forma en que nos permite escribir componentes con menos fallas y componerlos mejor. El DOM es la plataforma original de renderizado para React, pero [React Native](https://reactnative.dev/) es igual de importante tanto para Facebook como para la comunidad.

Ser agnóstico al renderizador es una restricción de diseño importante para React. Añade una sobrecarga en la representación interna. Por otra parte, cualquier mejora en el núcleo se traduce en una mejora a lo largo de todas las plataformas.

Tener un modelo de programación único nos permite formar equipos de ingeniería alrededor de productos, en lugar de plataformas. Hasta ahora este sacrificio ha valido la pena.

### Implementación {#implementation}

Tratamos de proveer APIs elegantes donde sea posible. Estamos mucho menos preocupados con que la implementación sea elegante. El mundo real está muy lejos de ser perfecto, y en una medida razonable preferimos poner el código feo en la biblioteca si eso significa que el usuario no tiene que escribirlo. Cuando evaluamos nuevo código, buscamos una implementación correcta, con buen rendimiento y que permita una buena experiencia de desarrollo. La elegancia es secundaria.

Preferimos código aburrido a código inteligente. El código es descartable y cambia a menudo. Así que es importante que [no introduzca nuevas abstracciones internas al menos que sea absolutamente necesario](https://youtu.be/4anAwXYqLG8?t=13m9s). Código detallado que sea fácil de mover, cambiar y eliminar es preferido sobre código elegante que esté abstraído de manera prematura y que sea difícil de cambiar. 

### Optimizado para instrumentación {#optimized-for-tooling}

Algunas APIs comúnmente usadas tienen nombres detallados. Por ejemplo, usamos `componentDidMount()` en lugar de `didMount()` o `onMount()`. Esto es [intencional](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). El objetivo es hacer los puntos de interacción con la biblioteca ampliamente visibles.

En una base de código masiva como la de Facebook, ser capaz de buscar los usos de una API específica es muy importante. Valoramos nombres distintivos y detallados, especialmente para las funcionalidades que deberían ser poco usadas. Por ejemplo, `dangerouslySetInnerHTML` es muy difícil de no ver en una revisión de código.

Optimizar para la búsqueda también es importante  por nuestra dependencia de [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) para realizar cambios incompatibles. Queremos que sea fácil y seguro aplicar gran cantidad de cambios automatizados a lo largo de la base de código, y los nombres distintivos detallados nos ayudan a lograr esto. De igual manera, los nombres distintivos facilitan escribir [reglas de validación](https://github.com/yannickcr/eslint-plugin-react) personalizadas para usar React sin preocuparse por falsos positivos.

[JSX](/docs/introducing-jsx.html) juega un papel similar. Si bien no es requerido con React, lo utilizamos ampliamente en Facebook por razones estéticas y pragmáticas.

En nuestra base de código, JSX provee una pista inequívoca a las herramientas de que están tratando con un árbol de elementos de React. Esto hace posible añadir optimizaciones en tiempo de compilación tales como [elevar elementos constantes](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/), y de forma segura validar y aplicar *codemods* al uso interno de componentes, e [incluir la ubicación del código fuente JSX](https://github.com/facebook/react/pull/6771)  en las advertencias.

### *Dogfooding* {#dogfooding}

Hacemos todo lo posible para abordar los problemas planteados por la comunidad. Sin embargo, es probable que prioricemos los problemas que las personas *también* experimentan internamente en Facebook. Quizás de manera contraria a la intuición, creemos que esta es la razón principal por la que la comunidad puede apostar por React.

El amplio uso interno nos da la confianza de que React no desaparecerá mañana. Le añade un valor de negocio tangible a la compañía y es usado en muchos de sus productos. Usar nuestro propio producto, una práctica conocida como [*Dogfooding*](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) en inglés, significa que nuestra visión permanece nítida y que tenemos una dirección enfocada hacia el futuro.

Esto no quiere decir que ignoramos los problemas identificados por la comunidad. Por ejemplo, añadimos soporte a los [componentes web](/docs/webcomponents.html) y a [SVG](https://github.com/facebook/react/pull/6243) en React a pesar de que no dependemos de ninguno de ellos internamente. Estamos [escuchando activamente tus puntos de dolor](https://github.com/facebook/react/issues/2686) y [los abordamos](/blog/2016/07/11/introducing-reacts-error-code-system.html) de la mejor manera posible. La comunidad es lo que hace que React sea especial para nosotros, y nos sentimos honrados de contribuir.

Después de haber liberado muchos proyectos de código abierto en Facebook, hemos aprendido que tratar de hacer a todo el mundo feliz al mismo tiempo producía proyectos mal enfocados que no escalaban bien. En su lugar, descubrimos que elegir a una pequeña audiencia y enfocarnos en hacerlos felices produce un efecto neto positivo. Eso es exactamente lo que hicimos con React, y hasta ahora resolver los problemas encontrados por los equipos de producto en Facebook se ha traducido bien a la comunidad de código abierto.

La desventaja de este enfoque es que a veces fallamos en dar suficiente foco a los aspectos con los que los equipos de Facebook no tienen que lidiar, tales como la experiencia de "comenzar". Estamos muy conscientes de esto, y estamos buscando como mejorarlo de una forma que beneficie a todos en la comunidad sin cometer los mismos errores que tuvimos anteriormente con proyectos de código abierto.
