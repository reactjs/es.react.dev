---
title: "Preparándose para el futuro con las versiones preliminares de React"
author: [acdlite]
---

Para compartir los próximos cambios con nuestros socios en el ecosistema React, estamos estableciendo canales de prelanzamiento oficiales. Esperamos que este proceso nos ayude a realizar cambios en React con confianza y brinde a los desarrolladores la oportunidad de probar funciones experimentales.

> Esta publicación será más relevante para los desarrolladores que trabajan en frameworks, bibliotecas,o herramientas de desarrollador. Desarrolladores que usan React principalmente para crear aplicaciones orientadas al usuario, no debería tener que preocuparse por nuestros canales de prelanzamiento.

React se basa en una próspera comunidad de código abierto para presentar informes de errores, abrir pull requests, y [enviar RFCs](https://github.com/reactjs/rfcs). Para fomentar la retroalimentación, a veces compartimos versiones especiales de React que incluyen funciones inéditas.

Porque la fuente de la verdad para React es nuestra [público GitHub repository](https://github.com/facebook/react), siempre ha sido posible crear una copia de React que incluya los últimos cambios. Sin embargo, es mucho más fácil para los desarrolladores instalar React desde npm, por lo que ocasionalmente publicamos versiones preliminares en el registro de npm. Un ejemplo reciente es el 16.7 alpha, que incluía una versión anterior de la API Hooks.

Nos gustaría que sea aún más fácil para los desarrolladores probar versiones preliminares de React., por lo que formalizamos nuestro proceso con tres canales de publicación independientes.

## Release Channels {#release-channels}

> La información de esta publicación también está disponible en nuestro [Release Channels](/docs/release-channels.html) la página. Actualizaremos ese documento siempre que haya cambios en nuestro proceso de publicación.

Cada uno de los canales de lanzamiento de React está diseñado para un caso de uso distinto:

- [**Último**](#último-canal) Es para el estable, lanzamientos de semver React. Es lo que obtienes cuando instalas React desde npm. Este es el canal que ya estás usando hoy. **Use esto para todas las aplicaciones React orientadas al usuario.**
- [**Próximo**](#siguiente-canal) rastrea la rama maestra de React repositorio de código fuente. Piense en estos como candidatos de lanzamiento para el próximo lanzamiento menor de semver. Use esto para pruebas de integración entre React y proyectos de terceros.
- [**Experimental**](#canal-experimental) incluye API experimentales y funciones que no están disponibles en las versiones estables. Estos también rastrean la rama maestra, pero con banderas de funciones adicionales activadas. Use esto para probar las próximas funciones antes de que sean liberadas.

Todos los lanzamientos se publican en npm, pero solo los últimos usos [semantic versioning](/docs/faq-versioning.html). Prelanzamientos (los de los canales Next y Experimental) tener versiones generadas a partir de un hash de su contenido, e.g. `0.0.0-1022ee0ec` para Siguiente y `0.0.0-experimental-1022ee0ec` para Experimental.

**El único canal de lanzamiento oficialmente compatible para aplicaciones de cara al usuario es el último**. Las versiones siguiente y experimental se proporcionan solo con fines de prueba, y no ofrecemos garantías de que el comportamiento no cambie entre lanzamientos. No siguen el protocolo semver que usamos para las últimas versiones.

Publicando prelanzamientos en el mismo registro que usamos para lanzamientos estables, podemos aprovechar las muchas herramientas que admiten el flujo de trabajo npm, me gusta [unpkg](https://unpkg.com) and [CodeSandbox](https://codesandbox.io).

### Último Canal {#último-canal}

Latest es el canal utilizado para las versiones estables de React. Corresponde a la etiqueta `latest` en npm. Es el canal recomendado para todas las aplicaciones de React que se enviado a usuarios reales.

**Si no está segura de qué canal usar, es Latest.** Si eres una desarrolladora React, esto es lo que ya estas usando.

Puede esperar que las actualizaciones de Latest sean extremadamente estables. Las versiones siguen la semántica esquema de versionado. Obtenga más información sobre nuestro compromiso con la estabilidad y la migración incremental en nuestro [versioning policy](/docs/faq-versioning.html).

### Siguiente-canal {#siguiente-canal}

El Siguiente canal es un canal de presentación que pistas la rama maestra del repositorio de React. Usamos pre lanzamientos en el canal Siguiente como candidatos de lanzamiento para el Latest canal. Puede pensar en Next como un superconjunto de Latest que se actualiza con más frecuencia.

El grado de cambio entre la  más reciente Next lanzamiento y la más reciente Latest lanzamiento es aproximadamente lo mismo que encontraría entre dos menore 'semver estreno. Sin embargo, **el Siguiente canal no se ajusta al versionado semántico.** Debe esperar cambios ocasionales de ruptura entre sucesivo lanzamiento en el Siguiente canal.

**No utilice pre lanzamiento en aplicaciones orientadas al usuario.**

Los lanzamientos en Next se publican con la etiqueta `next` en npm. Las versiones se generan a partir de un hash del contenido de la compilación, e.g. `0.0.0-1022ee0ec`.

#### usando el next canal para pruebas-de integración {#using-the-next-channel-for-integration-testing}

El canal Next está diseñado para admitir pruebas de integración entre React y otros proyectos.

Todos los cambios en React pasan por extensas pruebas internas antes de ser lanzados al público. Sin embargo, there are myriad environments and hay una miríada entornos y configuracione utilizadas en todo el ecosistema React, and y no es posible para nosotros probar contra todos y cada uno.

Si eres el autor de un tercero React _framework_, biblioteca, desarrollador herramienta, o proyecto similar de tipo-infraestructura, puede ayudarnos a mantener a React estable para sus usuarios y para toda la comunidad de React ejecutando periódicamente su conjunta de pruebas contra los cambios más recientes. Si estas interesada, sigue estos pasos:

- Configure un trabajo cron utilizando su plataforma de integración continua preferida. Los trabajos cron son apoyado por ambos [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) y [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- En el trabajo cron, actualice sus paquetes React a la lanzamientos más reciente de React en el canal Siguiente, usando la etiqueta `next` en npm. Usando el npm cli:

  ```
  npm update react@next react-dom@next
  ```

  Or yarn:

  ```
  yarn upgrade react@next react-dom@next
  ```
- Ejecute su conjunto de pruebas en contra los paquetes actualizados.
- Si todo pasa, genial! Puedes contar en estado eso su proyecto funcionará con la próxima lanzamiente menor React.
- Si algo se rompe inesperadamente, por favor avísanos por [filing an issue](https://github.com/facebook/react/issues).

Un proyecto que usa este flujo de trabajo es Next.js. (Sin juego de palabras! Seriamente!) You can refer to their [CircleCI configuration](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) as an example.

### Canal experimental {#canal-experimental}

Como Next, el canal experimental es un canal de pre lanzamiento que la rama maestra del repositorio de React. A diferencia de Next, Las lanzamiento experimentales incluyen funciones adicionales y API que no están listas para una lanzamiento más ancho.

Generalmente, actualización de Next va acompañada de una actualización correspondiente de Experimental. Ellos se basan e la misma revisión  fuente, pero se construyen utilizando un conjunto diferente banderas de características.

Las lanzamiento experimentales tal  vez significativamente diferentes a las lanzamiento Next y Latest. **No utilice el lanzamiento experimental en aplicaciones orientadas al usuario.** Debe esperar frecuentes cambios de última hora entre lanzamientos en el canal experimental.

Los lanzamientos en Experimental se publican con la etiqueta ʻexperimental` en npm. Las versiones se generan a partir de un hash del contenido de la compilación, e.g. `0.0.0-experimental-1022ee0ec`.

#### Qué entra en una lanzamiento experimental? {#qué-entra-en-un-lanzamiento-experimental}

Las características experimentales son aquellas que no están listas para ser lanzadas al público en mas ancho, y pueden mayo cambiar drásticament antes de que se finalicen. Es posible que algunos experimentos nunca se finalizados -- la razón por la que tenemos experimentos es para probar la viabilidad de los cambios propuestos.

Por ejemplo, si el canal Experimental hubiera existido cuando anunciamos Hooks, habríamos lanzado Hooks al canal Experimental semanas antes de que estuvieran disponibles en Latest.

Puede resultarle valioso ejecutar pruebas de integración en contra Experimental. Esto es depende de usted. Sin embargo, Tenga en cuenta que Experimental es incluso menos estable que Next. **No garantizamos ninguna estabilidad entre lanzamientos experimentales.**

#### ¿Cómo puedo aprender más información sobre las caracteristicas experimentales?? {#¿Cómo-puedo-aprender-más-sobre-características-experimentales}

Las características experimentales pueden estar documentadas o no. Generalmente, los experimentos no se documentan hasta que están cerca de Envío en Next o Stable.

Si una característica no está documentada, Ellas pueden estar acompañadas por un [RFC](https://github.com/reactjs/rfcs).

Publicaremos en el blog React cuando estemos listos para anunciar nuevos experimentos, pero eso no significa que nosotros publicar todos los experimentos.

Siempre puede referirse a nuestro repositorio público de GitHub's [history](https://github.com/facebook/react/commits/master) para un exhaustivo lista de cambios.
