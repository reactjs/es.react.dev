---
title: "¿Ya está traducido React? ¡Sí! Sim! はい！"
author: [tesseralis]
---

Nos emociona poder anunciar un esfuerzo continuo para mantener traducciones oficiales en diferentes idiomas del sitio web de la documentación de React. Gracias a los esfuerzos de los miembros de la comunidad de React de todo el mundo, ¡React está siendo traducido a *cerca de 30* idiomas! Puedes encontrarlos en la nueva página de [Idiomas](/languages).

¡Aún más, los tres idiomas siguientes han completado la traducción de la mayoría de la documentación de React! 🎉

* **Español: [es.reactjs.org](https://es.reactjs.org)**
* **Japonés: [ja.reactjs.org](https://ja.reactjs.org)**
* **Portugués de Brasil: [pt-br.reactjs.org](https://pt-br.reactjs.org)**

¡Felicitaciones especiales a [Alejandro Ñáñez Ortiz](https://github.com/alejandronanez), [Rainer Martínez Fraga](https://github.com/carburo), [David Morales](https://github.com/dmorales), [Miguel Alejandro Bolivar Portilla](https://github.com/Darking360) y a todos los que contribuyen a la traducción al español por ser los primeros en traducir *completamente* las páginas principales de la documentación!

## Por qué importa la localización {#why-localization-matters}

React tiene ya muchos *meetups* y conferencias alrededor del mundo, pero muchos programadores no usan el inglés como su idioma principal. Nos encantaría apoyar a las comunidades locales que utilizan React al hacer disponible nuestra documentación en los idiomas más populares.

En el pasado, los miembros de la comunidad de React han creado traducciones no oficiales para el [chino](https://github.com/discountry/react), [árabe](https://wiki.hsoub.com/React) y [coreano](https://github.com/reactjs/ko.reactjs.org/issues/4). Al crear un canal oficial para estas traducciones, esperamos que sean más fáciles de encontrar y ayudar a conseguir que los usuarios de React que no hablan inglés no sean dejados de lado.

## Contribuir {#contributing}

Si te gustaría ayudar con una traducción en curso, revisa la página de [Idiomas](/languages) y haz clic en el enlace «Contribuir» correspondiente a tu idioma.

¿No encuentras tu idioma? Si te gustaría mantener la bifurcación de tu idioma, ¡sigue las instrucciones en el [repositorio de traducción](https://github.com/reactjs/reactjs.org-translation#starting-a-new-translation)!

## Historia de fondo {#backstory}

¡Hola a todos! ¡Soy [Nat](https://twitter.com/tesseralis)! Puede que me conozcan como la [mujer de los poliedros](https://www.youtube.com/watch?v=Ew-UzGC8RqQ). Durante las últimas semanas, he ayudado al equipo de React a coordinar sus esfuerzos de traducción. Aquí les digo como lo hice.

Nuestro enfoque inicial para las traducciones consistía en el uso de una plataforma de software como servicio (SaaS) que permite a los usuarios enviar traducciones. Ya existía un [*pull request*](https://github.com/reactjs/reactjs.org/pull/873) para integrarla y mi responsabilidad inicial era terminar esa integración. Sin embargo, teníamos algunas preocupaciones con la factibilidad de esa integración y la calidad actual de las traducciones en la plataforma. Nuestra preocupación fundamental consistía en asegurar que las traducciones se mantuvieran actualizadas con respecto al repositorio principal y no se «paralizaran».

[Dan](https://twitter.com/dan_abramov) me animó a buscar soluciones alternativas y nos encontramos con la forma en que [Vue](https://vuejs.org) mantenía sus traducciones: a través de diferentes bifurcaciones del repositorio principal en Github. En particular, la [traducción japonesa](https://jp.vuejs.org) usaba un bot que periódicamente comprueba si existen cambios en el repositorio en inglés y envía *pull requests* cada vez que exista un cambio.

Este enfoque nos gustó por varias razones:

* Necesitaba menos integración de código para comenzar.
* Animaba la existencia de mantenedores activos por cada repositorio para asegurar la calidad.
* Los contribuidores ya comprenden a Github como una plataforma y están motivados a contribuir directamente a la organización de React.

Iniciamos un periodo de pruebas inicial con tres idiomas: español, japonés y chino simplificado. Esto nos permitió trabajar en cualquier problema en nuestro proceso y asegurarnos de que las traducciones futuras estuvieran organizadas para el éxito. Quise darles libertad a los equipos de traducción para que escogieran las herramientas con las que se sintieran más cómodos. El único requerimiento es una [lista de tareas](https://github.com/reactjs/reactjs.org-translation/blob/master/PROGRESS.template.md) que recoge el orden de importancia para la traducción de las páginas.

Después del periodo de prueba estábamos listos para aceptar más idiomas. Creé un [*script*](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/create.js) para automatizar la creación de un nuevo repositorio de idioma, y un sitio, [*Is React Translated Yet?*](https://isreacttranslatedyet.com), para seguir el progreso de las diferentes traducciones. ¡Iniciamos *10* nuevas traducciones solo en nuestro primer día!

Debido a la automatización, el resto del mantenimiento fue viento en popa. Eventualmente creamos una [canal en Slack](https://rt-slack-invite.herokuapp.com) para facilitarle a los traductores compartir información, y publiqué una guía que consolida las [responsabilidades de los mantenedores](https://github.com/reactjs/reactjs.org-translation/blob/master/maintainer-guide.md). Permitir a los traductores hablar entre sí fue muy positivo. Por ejemplo: ¡Las traducciones al árabe, persa y hebreo fueron capaces de comunicarse para hacer que funcionase [la escritura de derecha a izquierda](https://es.wikipedia.org/wiki/Escritura_de_derecha_a_izquierda)!

## El bot {#the-bot}

La parte más desafiante estuvo en conseguir que el bot sincronizara los cambios de la versión en inglés del sitio. Usamos en un inicio el bot [che-tsumi](https://github.com/vuejs-jp/che-tsumi) creado por el equipo de traducción al japonés de Vue, pero pronto decidimos construir nuestro propio bot que se adecuara a nuestras necesidades. En particular, el bot che-tsumi funciona haciendo [*cherry pick*](https://git-scm.com/docs/git-cherry-pick) en los nuevos *commits*. Esto terminó causando una ola de incidencias nuevas que estaban interconectadas, sobre todo con [el lanzamiento de los Hooks](/blog/2019/02/06/react-v16.8.0.html).

Al final, decidimos que en lugar de hacer *cherry pick* en cada *commit*, tenía más sentido mezclar todos los *commits* nuevos y crear un *pull request* aproximadamente uno cada día. Los conflictos se mezclan tal cual y se listan en el [pull-request](https://github.com/reactjs/pt-BR.reactjs.org/pull/114), dejando una lista de tareas para que los mantenedores las solucionen.

La creación del [*script* de sincronización](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/sync.js) fue bastante fácil: descarga el repositorio traducido, añade el original como un remoto, baja el contenido de este, mezcla los conflictos y crea un *pull request*.

El problema era encontrar un lugar para que se ejecutara el bot. Soy una desarrolladora *frontend* por una razón. Heroku y compañía me son ajenos y son para mí un motivo de *eterna* frustración. ¡De hecho, hasta el pasado martes, estaba ejecutando el *script* a mano en mi computadora local!

El mayor desafío era el espacio. Cada bifurcación del repositorio tiene alrededor de 100MB, lo que toma minutos para clonar en mi computadora local. Tenemos *32* bifurcaciones, y las opciones gratuitas dentro de la mayoría de las plataformas de despliegue que comprobé te limitan a 512MB de almacenamiento.

Después de varios cálculos con el bloc de notas, encontré una solución: eliminar cada repositorio una vez que termina el *script* y limitar la concurrencia de los *scripts* de sincronización que se ejecutan a la vez para que estén dentro de los requerimientos de almacenamiento. Afortunadamente, los dynos de Heroku tienen una conexión a internet mucho más rápida y son capaces de clonar rápidamente incluso el repositorio de React.

Me encontré otros problemas menores. Intenté utilizar el complemento de [planificación](https://elements.heroku.com/addons/scheduler) de Heroku, de manera que no tuviera que escribir ningún código que involucrara `watch`, pero terminó ejecutándose muy inconsistentemente, y [tuve un colapso existencial en Twitter](https://twitter.com/tesseralis/status/1097387938088796160) cuando no podía resolver cómo enviar *commits* desde el dyno de Heroku. ¡Pero al final, esta ingeniera *frontend* fue capaz de hacer funcionar el bot!

Hay, como siempre, mejoras que quiero hacerle al bot. Actualmente no comprueba si hay un *pull request* aún en curso antes de crear otro. Todavía es difícil saber el cambio exacto que ocurrió en la fuente original, y es posible pasar por alto un cambio necesario en la traducción. Pero confío en que los mantenedores que hemos escogido puedan lidiar con estos problemas. Y el bot es de [código abierto](https://github.com/reactjs/reactjs.org-translation): ¡En caso de que alguien quiera ayudarme a hacer estas mejoras!

## Gracias {#thanks}

Para concluir, me gustaría extender mi gratitud a las siguientes personas y grupos:

 * Todos los mantenedores y contribuidores de las traducciones que ayudan a traducir React a más de treinta idiomas.
 * El [*Vue.js Japan User Group*](https://github.com/vuejs-jp) por iniciar la idea de tener traducciones manejadas por un bot, y especialmente [Hanatani Takuma](https://github.com/potato4d) por ayudarnos a comprender su enfoque y a mantener la traducción japonesa.
 * [Soichiro Miki](https://github.com/smikitky) por muchas [contribuciones](https://github.com/reactjs/reactjs.org/pull/1636) y comentarios reflexivos sobre todo el proceso de traducción, así como por mantener la traducción japonesa.
 * [Eric Nakagawa](https://github.com/ericnakagawa) por manejar nuestro anterior proceso de traducción.
 * [Brian Vaughn](https://github.com/bvaughn) por poner a punto la [página de idiomas](/languages) y manejar todos los subdominios.

 Y finalmente, gracias a [Dan Abramov](https://twitter.com/dan_abramov) por darme esta oportunidad y ser un gran mentor a lo largo del camino.
