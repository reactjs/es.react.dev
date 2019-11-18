---
id: concurrent-mode-intro
title: Introducción al Modo concurrente (experimental)
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

> Advertencia:
>
> Esta página describe **funcionalidades experimentales que [aún no están disponibles](/docs/concurrent-mode-adoption.html) en una versión estable**. No dependas de compilados experimentales de React en aplicaciones en producción. Estas funcionalidades pueden cambiar significativamente y sin advertencia antes de formar parte de React.
>
> Esta documentación está dirigida a usuarios pioneros y personas que sienten curiosidad. **Si te estás iniciando en React, no te preocupes por estas funcionalidades,** no necesitas aprenderlas inmediatamente.

</div>

Esta página proporciona un resumen teórico del Modo concurrente. *Para tener una introducción más práctica, quizá te interese revisar las próximas secciones:*

* [Suspense para la carga de datos](/docs/concurrent-mode-suspense.html) describe un nuevo mecanismo para la obtención de datos en componentes de React.
* [Patrones concurrentes en interfaces de usuario](/docs/concurrent-mode-patterns.html) muestra algunos patrones de interfaces de usuario vueltos realidad gracias al Modo concurrente y Suspense.
* [Adopción del Modo concurrente](/docs/concurrent-mode-adoption.html) explica como puedes probar el Modo concurrente en tu proyecto.
* [Referencia de la API del Modo concurrente](/docs/concurrent-mode-reference.html) documenta las nuevas API disponibles en los compilados experimentales.

## ¿Qué es el Modo concurrente? {#what-is-concurrent-mode}

El Modo concurrente es un conjunto de nuevas funcionalidades que ayudan a que las aplicaciones de React permanezcan responsivas y se ajusten de forma natural a las capacidades del dispositivo del usuario y la velocidad de la red.

Estas funcionalidades aún son experimentales y sujetas a cambios. Todavía no son parte de una versión estable de React, pero puedes probarlas en un compilado experimental.

## Bloqueo vs. renderizado interrumpible {#blocking-vs-interruptible-rendering}

**Para explicar el Modo concurrente, usaremos el control de versiones como una metáfora.** Si trabajas en un equipo, probablemente usas un sistema de control de versiones como Git y trabajas en ramas. Cuando una rama está lista, puedes mezclar tu trabajo en *master* de manera tal que otras personas puedan obtenerlos.

Antes de que existiera el control de versiones, el flujo de desarrollo era muy diferente. No había concepto de ramas. Si querías editar algunos archivos, tenías que decirle a todo el mundo que no tocara esos archivos hasta que terminaras tu trabajo. Ni siquiera podías comenzar a trabajar en esos archivos concurrentemente con esa persona, literalmente estabas *bloqueado* por ellos.

Esto ilustra como las bibliotecas de interfaces de usuario, como React, funcionan hoy en día. Una vez que inician el renderizado de una actualización, incluida la creación de nuevos nodos del DOM y ejecutar el código dentro de componentes, no pueden interrumpir su trabajo. A este comportamiento lo llamamos "renderizado con bloqueo".

En el Modo concurrente, el renderizado no bloquea, se puede interrumpir. Esto mejora la experiencia de usuario. También hace posibles nuevas funcionalidades que antes no eran posibles. Antes de que veamos ejemplos concretos en los [próximos](/docs/concurrent-mode-suspense.html) [capítulos](/docs/concurrent-mode-patterns.html), haremos un resumen de alto nivel de las nuevas funcionalidades.

### Renderizado interrumpible {#interruptible-rendering}

Pensemos en una lista filtrable de productos. ¿Alguna vez has escrito en un filtro de una lista y sentido que se traba con cada tecla presionada? Parte del trabajo utilizado en actualizar la lista de productos puede ser absolutamente necesario, como crear nuevos nodos del DOM, o el maquetado que debe hacer el navegador. Sin embargo, *cuándo* y *cómo* hacemos ese trabajo son cuestiones inmensamente importantes.

Una forma común de prevenir esta experiencia con trabas es "detener" la entrada (en inglés *debouncing*). Cuando se hace *debouncing* solo actualizamos la lista *después* de que el usuario para de escribir. Sin embargo, puede resultar frustrante que la interfaz no se actualice mientras escribimos. Como alternativa, podemos "regular" la entrada (en inglés *throttling*), y actualizar con cierta frecuencia máxima. Pero en dispositivos con pocas prestaciones aún terminaríamos con la experiencia de las trabas. Tanto *debouncing* como *throttling* crean una experiencia de usuario subóptima.

La razón de las trabas es simple: una vez que comienza el renderizado, no se puede interrumpir. De esta forma el navegador no puede actualizar la entrada de texto justo después de que se presiona la tecla. Sin importar cuán buena una biblioteca de interfaces de usuario (como React) luzca en una métrica, si utiliza renderizado con bloqueo, cierta carga de trabajo en tus componentes causarán siempre trabas. Y a menudo, no hay una forma fácil de solucionarlo.

**El Modo concurrente soluciona esta limitación fundamental al hacer el renderizado interrumpible.** Esto significa que cuando el usuario presiona otra tecla, React no necesita bloquear al navegador impidiéndole actualizar la entrada de texto. En cambio, puede permitirle al navegador pintar una actualización a la entrada de texto y luego continuar renderizando la lista actualizada *en memoria*. Cuando el renderizado termina, React actualiza el DOM, y los cambios se reflejan en la pantalla.

Conceptualmente, puedes pensar en esto como que React prepara cada actualización "en una rama". Al igual que puedes dejar trabajo en ramas o cambiarte entre ellas, React en Modo concurrente puede interrumpir una actualización en curso para hacer algo más importante, y luego volver a lo que estaba haciendo anteriormente. Esta técnica podría también recordarte al [*buffering* doble](https://wiki.osdev.org/Double_Buffering) utilizado en videojuegos.

Las técnicas del Modo concurrente reducen la necesidad de *debounce* y *throttle* en interfaces de usuario. Dado que el renderizado se puede interrumpir, React no necesita *ralentizar* artificialmente el trabajo para evitar trabas. Puede comenzar a renderizar inmediatamente, pero aún interrumpir este trabajo cuando sea necesario para mantener la aplicación responsiva.

### Secuencias de carga intencionales {#intentional-loading-sequences}

Anteriormente hemos mencionado que el Modo concurrente es similar a React trabajando "en una rama". Las ramas son útiles no solo para arreglos a corto plazo, sino también para funcionalidades que requieren tiempo. En ocasiones te puedes encontrar trabajando en una funcionalidad, pero puede tardar semanas antes de que esté en un "estado lo suficientemente bueno" como para mezclarlo en *master*. Esta parte de nuestra metáfora del control de versiones también se aplica al renderizado.

Imagina que estamos navegando entre dos pantallas de una aplicación. A veces, no tenemos suficiente código y datos cargados para mostrar al usuario un estado de carga lo "suficientemente bueno" en la nueva pantalla. La transición hacia una pantalla en blanco o un gran *spinner* puede resultar una experiencia disonante. Sin embargo, también es común que no tome mucho tiempo cargar el código y los datos necesarios. **¿No sería mucho mejor si React pudiera permanecer en la pantalla anterior por un poco de tiempo más y "saltarse" el "estado de carga malo" antes de mostrar la nueva pantalla?**

Si bien es posible hacerlo hoy, puede ser difícil hacer la coordinación para que suceda. En el Modo concurrente, esta funcionalidad está incluida. React comienza a preparar primero la nueva pantalla en memoria, o siguiendo nuestra metáfora, "en una rama diferente". Así React puede esperar a actualizar el DOM para que se cargue más contenido. En Modo concurrente, podemos decirle a React que siga mostrando la pantalla antigua, completamente interactiva, con un indicador de carga en línea. Y cuando la nueva pantalla esté lista, React nos puede llevar a ella.

### Concurrencia {#concurrency}

Recapitulemos los dos ejemplos anteriores y veamos como el Modo concurrente los unifica. **En Modo concurrente*, React puede trabajar en varias actualizaciones de estado *concurrentemente***, exactamente igual a como las ramas permiten que varios miembros de un equipo trabajen independientemente:

* Para actualizaciones ligadas a la CPU (como la creación de nodos del DOM y la ejecución de código de componentes), concurrencia se traduce en que una actualización más urgente puede "interrumpir" un renderizado que ya se ha iniciado.
* Para actualizaciones ligadas a la entrada-salida (como la carga de código o datos desde la red), concurrencia se traduce en que React puede comenzar a renderizar en memoria incluso antes de que todos los datos lleguen, y evitar mostrar los estados de carga vacíos que resulten discordantes.

Es importante notar que, la forma en que *utilizas* React es la misma. Conceptos como componentes, props y estado funcionan fundamentalmente de la misma forma. Cuando quieras actualizar la pantalla, estableces el estado.

React usa una heurística para decidir cuán "urgente" es una actualización, y te permite ajustarla con unas pocas líneas de código, de forma tal que puedas lograr la experiencia de usuario deseada para cada interacción.

## Poner la investigación en producción {#putting-research-into-production}

Existe un tema común alrededor de las funcionalidades del Modo concurrente. **Su misión es ayudar a integrar los descubrimientos de las investigaciones sobre la interacción humano-computadora en interfaces de usuario reales.**

Por ejemplo, las investigaciones muestran que mostrar muchos estados de carga intermedios cuando se hace una transición entre pantallas hace que esta se sienta *más lenta*. Es por ello que el Modo concurrente muestra nuevos indicadores de estado en una "planificación" fija para evitar estados discordantes y demasiadas actualizaciones.

De forma similar, conocemos por investigaciones que las interacciones como el *hover* y la entrada de texto necesitan ser manejadas en un muy corto periodo de tiempo, mientras que los clics y las transiciones de páginas pueden esperar un poco más sin que se sientan lentas. Las diferentes "prioridades"  que el Modo concurrente utiliza internamente se corresponden aproximadamente a las categorías de interacción en las investigaciones de la percepción humana.

Equipos con un claro enfoque en la experiencia de usuario en ocasiones se enfrentan a problemas similares con soluciones *ad-hoc*. Sin embargo esas soluciones raramente sobreviven por mucho tiempo, dado que son difíciles de mantener. Con el Modo concurrente nuestro objetivo es incluir los resultados de las investigaciones en interfaces de usuario dentro de la abstracción misma y proporcionar formas idiomáticas de usarlos. Como una biblioteca de interfaces de usuario, React está bien posicionada para hacerlo.

## Próximos pasos {#next-steps}

¡Ahora sabes de qué se trata el Modo concurrente!

En las próximas páginas, aprenderás más detalles sobre temas específicos:

* [Suspense para la obtención de datos](/docs/concurrent-mode-suspense.html) describe un nuevo mecanismo para la obtención de datos en componentes de React.
* [Patrones concurrentes en interfaces de usuario](/docs/concurrent-mode-patterns.html) muestra algunos patrones de interfaces de usuario, hechos realidad gracias al Modo concurrente y a Suspense.
* [Adopción del Modo concurrente](/docs/concurrent-mode-adoption.html) explica como puedes probar el Modo concurrente en tu proyecto.
* [Referencia de la API del Modo concurrente](/docs/concurrent-mode-reference.html) documenta las nuevas API disponibles en compilados experimentales. 
