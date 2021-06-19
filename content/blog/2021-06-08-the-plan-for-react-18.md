---
title: "El plan para React 18"
author: [acdlite, bvaughn, abernathyca, gaearon, rachelnabors, rickhanlonii, sebmarkbage, sethwebster]
---

El equipo de React está emocionado por compartir algunas novedades:

1. Empezamos a trabajar en el lanzamiento de React 18, el cual será nuestra próxima versión mayor.
2. Creamos un Working Group para preparar a la comunidad ante una adopción gradual de las nuevas características en React 18.
3. Publicamos React 18 Alpha para que los autores de librerías puedan probarlo y dar feedback.

Estas actualizaciones son principalmente apuntado a los mantenedores de otras librerías. Si estás aprendiendo, enseñando o usando React para construir aplicaciones para usuarios, puedes ignorar esta publicación de manera segura. ¡Pero eres bienvenido de seguir las discusiones en el React 18 Working Group si eres curioso!

## Qué viene en React 18

Cuando sea publicado, React 18 incluirá mejoras listas para usar (como [procesamiento por lotes automático](https://github.com/reactwg/react-18/discussions/21)), nuevos APIs (como [`startTransition`](https://github.com/reactwg/react-18/discussions/41)), y una [nueva transmisión para el renderizado en el servidor](https://github.com/reactwg/react-18/discussions/37) con soporte incorporado para `React.lazy`.

Estas características son posibles gracias a un nuevo mecanismo de inclusión optativa que estamos agregando en React 18. Se llama “renderizado concurrente” y permite a React preparar múltiples versiones de la interfaz de usuario al mismo tiempo. Este cambio se produce principalmente entre bastidores, pero abre nuevas posibilidades para mejorar el rendimiento real y percibido de su aplicación.

Si ha estado siguiendo nuestra investigación sobre el futuro de React (¡no esperamos que lo hagas!), es posible que haya oído hablar de algo llamado “modo concurrente” que podría romper su aplicación. En respuesta a estos comentarios de la comunidad, hemos rediseñado la estrategia de actualización por una adopción gradual. En lugar de un “modo” de todo o nada, el renderizado concurrente solo se habilitará para las actualizaciones activadas por una de las nuevas funciones. En la práctica, esto significa **que podrá adoptar React 18 sin reescribir y probar las nuevas funciones a su propio ritmo.**

## Una estrategia de adopción gradual

Dado que la concurrencia en React 18 es opcional, no hay cambios significativos en el comportamiento de los componentes. **Puedes actualizar a React 18 con cambios mínimos o sin cambios en el código de su aplicación, con un nivel de esfuerzo comparable al de una versión principal típica de React**. Según nuestra experiencia en la conversión de varias aplicaciones a React 18, esperamos que muchos usuarios puedan actualizar en una sola tarde.

Enviamos con éxito características concurrentes a decenas de miles de componentes en Facebook y, en nuestra experiencia, hemos descubierto que la mayoría de los componentes de React “simplemente funcionan” sin cambios adicionales. Estamos comprometidos a asegurarnos de que esta sea una actualización sin problemas para toda la comunidad, por lo que hoy anunciamos el React 18 Working Group.

## Trabajando con la comunidad

Estamos probando algo nuevo para esta versión: hemos invitado a un grupo de expertos, desarrolladores, autores de librerías y educadores de toda la comunidad de React para participar en nuestro [React 18 Working Group](https://github.com/reactwg/react-18) para proporcionar comentarios, hacer preguntas y colaborar en la versión. No pudimos invitar a todos los que queríamos a este pequeño grupo inicial, pero si este experimento funciona, ¡esperamos que haya más en el futuro!

**El objetivo del React 18 Working Group es preparar el ecosistema para una adopción gradual y sin problemas de React 18 por parte de las aplicaciones y librerías existentes.** El Working Group está alojado en [GitHub Discussions](https://github.com/reactwg/react-18/discussions) y está disponible para su lectura pública. Los miembros del grupo de trabajo pueden dejar comentarios, hacer preguntas y compartir ideas. El equipo central también utilizará el repositorio de discusiones para compartir los hallazgos de nuestra investigación. A medida que se acerque la versión estable, también se publicará en este blog cualquier información importante.

Para obtener más información sobre la actualización a React 18, o recursos adicionales sobre el lanzamiento, consulte la [publicación del anuncio de React 18](https://github.com/reactwg/react-18/discussions/4).

## Accediendo al React 18 Working Group

Todos pueden leer las discusiones en el [repositorio del React 18 Working Group](https://github.com/reactwg/react-18).

Debido a que esperamos un aumento inicial de interés en el Working Group, solo los miembros invitados podrán crear o comentar en los hilos. Sin embargo, los hilos son completamente públicos, por lo que todos tienen acceso a la misma información. Creemos que este es un buen compromiso entre crear un entorno productivo para los miembros del grupo de trabajo y, al mismo tiempo, mantener la transparencia con la comunidad en general.

Como siempre, puedes subir reportes de bugs, preguntas y comentarios en general a nuestro [issue tracker](https://github.com/facebook/react/issues).

## Cómo probar React 18 hoy

Nuevas versiones alphas se [publican regularmente en npm usando la etiqueta `@alpha`](https://github.com/reactwg/react-18/discussions/9). Estas versiones se crean utilizando el commit más reciente de nuestro repositorio principal. Cuando se fusiona una característica o una corrección de errores, aparecerá en el alpha al siguiente día de la semana.

Puede haber cambios significativos de comportamiento o de API entre las versiones alpha. Recuerde que **las versiones alpha no se recomiendan para aplicaciones de producción orientadas al usuario**.

## Cronograma de lanzamiento proyectado para React 18

No tenemos programada una fecha de lanzamiento específica, pero esperamos que sean necesarios varios meses de comentarios e iteraciones antes de que React 18 esté listo para la mayoría de las aplicaciones de producción.

* Librería Alpha: Disponible hoy
* Beta público: Al menos en varios meses
* Candidato de lanzamiento (RC): Al menos varias semanas después del Beta
* General Availability: Al menos varias semanas después de RC

Más detalles sobre nuestro cronograma de lanzamiento proyectado están [disponibles en el Working Group](https://github.com/reactwg/react-18/discussions/9). Publicaremos actualizaciones en este blog cuando estemos más cerca de un lanzamiento público.
