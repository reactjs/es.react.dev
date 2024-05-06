---
<<<<<<< HEAD
title: "El plan para React 18"
=======
title: "The Plan for React 18"
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage, and Seth Webster
date: 2021/06/08
description: The React team is excited to share a few updates. We’ve started work on the React 18 release, which will be our next major version. We’ve created a Working Group to prepare the community for gradual adoption of new features in React 18. We’ve published a React 18 Alpha so that library authors can try it and provide feedback...
>>>>>>> 556063bdce0ed00f29824bc628f79dac0a4be9f4
---

8 de junio de 2021 por [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://twitter.com/dan_abramov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage) y [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

El equipo de React está emocionado por compartir algunas novedades:

1. Empezamos a trabajar en el lanzamiento de React 18, nuestra próxima versión mayor.
2. Creamos un grupo de trabajo para preparar a la comunidad ante una adopción gradual de las nuevas características en React 18.
3. Publicamos React 18 Alpha para que los autores de bibliotecas puedan probarlo y darnos sus impresiones.

Estas actualizaciones son principalmente apuntado a los mantenedores de otras bibliotecas. Si estás aprendiendo, enseñando o usando React para construir aplicaciones para usuarios, puedes ignorar esta publicación de manera segura. ¡Pero eres bienvenido de seguir las discusiones en el Grupo de Trabajo de React 18 si sientes curiosidad!

---

</Intro>

## ¿Qué hay de nuevo en React 18? {/*whats-coming-in-react-18*/}

Cuando se publique, React 18 incluirá mejoras listas para usar (como [procesamiento por lotes automático](https://github.com/reactwg/react-18/discussions/21)), nuevas APIs (como [`startTransition`](https://github.com/reactwg/react-18/discussions/41)), y un [nuevo renderizad del lado del servidor con *streaming*](https://github.com/reactwg/react-18/discussions/37) integrado con `React.lazy`.

Estas características son posibles gracias a un nuevo mecanismo de suscripción que estamos agregando en React 18. Se llama "renderizado concurrente" y permite a React preparar múltiples versiones de la interfaz de usuario al mismo tiempo. Este cambio se produce principalmente tras bambalinas, pero abre nuevas posibilidades para mejorar el rendimiento real y percibido de tu aplicación.

Si has estado siguiendo nuestra investigación sobre el futuro de React (¡no esperamos que lo hagas!), es posible que hayas oído hablar de algo llamado "modo concurrente" que podría romper tu aplicación. En respuesta a estos comentarios de la comunidad, hemos rediseñado la estrategia de actualización para una adopción gradual. En lugar de un "modo" de todo o nada, el renderizado concurrente solo se habilitará para las actualizaciones activadas por una de las nuevas funciones. En la práctica, esto significa **que podrás adoptar React 18 sin reescribir y probar las nuevas funciones a tu propio ritmo.**

## Una estrategia de adopción gradual {/*a-gradual-adoption-strategy*/}

Dado que la concurrencia en React 18 es opcional, no hay cambios significativos en el comportamiento de los componentes. **Puedes actualizar a React 18 con cambios mínimos o sin cambios en el código de tu aplicación, con un nivel de esfuerzo comparable al de una versión mayor típica de React**. Según nuestra experiencia en la conversión de varias aplicaciones a React 18, esperamos que muchos usuarios puedan actualizar en una sola tarde.

Publicamos con éxito características concurrentes en decenas de miles de componentes en Facebook y, en nuestra experiencia, hemos descubierto que la mayoría de los componentes de React "simplemente funcionan" sin cambios adicionales. Estamos comprometidos a asegurarnos de que esta sea una actualización sin problemas para toda la comunidad, por lo que hoy anunciamos el Grupo de Trabajo de React 18.

## Trabajando con la comunidad {/*working-with-the-community*/}

Estamos probando algo nuevo para esta versión: hemos invitado a un panel de expertos, desarrolladores, autores de bibliotecas y educadores de toda la comunidad de React para participar en nuestro [Grupo de Trabajo de React 18](https://github.com/reactwg/react-18) para proporcionar comentarios, hacer preguntas y colaborar en el lanzamiento. No pudimos invitar a todos los que queríamos a este pequeño grupo inicial, pero si este experimento funciona, ¡esperamos que hayan más en el futuro!

**El objetivo del Grupo de Trabajo de React 18 es preparar al ecosistema para una adopción gradual y sin problemas de React 18 por parte de las aplicaciones y bibliotecas existentes.** El Grupo de Trabajo está alojado en [GitHub Discussions](https://github.com/reactwg/react-18/discussions) y está disponible para su lectura pública. Los miembros del grupo de trabajo pueden dejar comentarios, hacer preguntas y compartir ideas. El equipo central también utilizará el repositorio de discusiones para compartir los hallazgos de nuestra investigación. A medida que se acerque la versión estable, también se publicará en este blog cualquier información importante.

Para obtener más información sobre la actualización a React 18, o recursos adicionales sobre el lanzamiento, consulta la [publicación del anuncio de React 18](https://github.com/reactwg/react-18/discussions/4).

## Acceso al Grupo de Trabajo de React 18 {/*accessing-the-react-18-working-group*/}

Todos pueden leer las discusiones en el [repositorio del Grupo de Trabajo de React 18](https://github.com/reactwg/react-18).

Debido a que esperamos un aumento inicial de interés en el Grupo de Trabajo, solo los miembros invitados podrán crear o comentar en los hilos. Sin embargo, los hilos son completamente públicos, por lo que todos tienen acceso a la misma información. Creemos que este es un buen compromiso entre crear un entorno productivo para los miembros del grupo de trabajo y, al mismo tiempo, mantener la transparencia con la comunidad en general.

Como siempre, puedes subir reportes de errores, preguntas y comentarios en general a nuestro [*issue tracker*](https://github.com/facebook/react/issues).

## ¿Cómo probar React 18 Alpha hoy? {/*how-to-try-react-18-alpha-today*/}

Nuevas versiones alphas se [publican regularmente en npm usando la etiqueta `@alpha`](https://github.com/reactwg/react-18/discussions/9). Estas versiones se crean utilizando el commit más reciente de nuestro repositorio principal. Cuando se fusiona una característica o una corrección de errores, aparecerá en el alpha al siguiente día de la semana.

Puede haber cambios significativos de comportamiento o de API entre las versiones alpha. Recuerde que **las versiones alpha no se recomiendan para aplicaciones de producción orientadas al usuario**.

## Cronograma proyectado para el lanzamiento de React 18 {/*projected-react-18-release-timeline*/}

No tenemos programada una fecha de lanzamiento específica, pero esperamos que sean necesarios varios meses de comentarios e iteraciones antes de que React 18 esté listo para la mayoría de las aplicaciones en producción.

* Biblioteca Alpha: Disponible hoy
* Beta pública: Al menos en varios meses
* Candidato de lanzamiento (RC): Al menos varias semanas después de la Beta
* Disponibilidad general: Al menos varias semanas después del RC

Más detalles sobre nuestro cronograma proyectado para el lanzamiento están [disponibles en el Grupo de Trabajo](https://github.com/reactwg/react-18/discussions/9). Publicaremos actualizaciones en este blog cuando estemos más cerca de un lanzamiento público.
