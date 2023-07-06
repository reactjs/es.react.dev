---
title: "React Canaries: Habilitar el despliegue de funcionalidades incrementales por fuera de Meta"
---

3 de Mayo de 2023 por [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), y [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Nos gustaría ofrecer a la comunidad de React una opción para adoptar las nuevas características tan pronto su diseño está cerca de su etapa final, antes de que sean lanzados a una versión estable (similar a cómo Meta ha utilizado internamente las más recientes versiones de React). Estamos presentando oficialmente un nuevo [canal de lanzamiento Canary](/community/versioning-policy#canary-channel) con apoyo oficial. Permite que las configuraciones seleccionadas como los frameworks desvinculen la adopción de funcionalidades individuales de React del calendario de lanzamiento de React.

</Intro>

-

## tl;dr {/*tldr*/}

* Estamos presentando un [canal de lanzamiento Canary](/community/versioning-policy#canary-channel) con apoyo oficial para React. Dado que está oficialmente soportado, sí surge alguna regresión, la trataremos con una urgencia similar a como tratamos los errores de las versiones estables.
* Canaries te permite empezar a usar nuevas características de React antes de que lleguen a las versiones estables de semver.
* A diferencia del canal [Experimental](/community/versioning-policy#experimental-channel), React Canaries sólo incluye características que razonablemente creemos que están listas para su adopción. Animamos a los frameworks a considerar la inclusión de versiones fijadas de Canary React.
* Anunciaremos los cambios de última minuto y las nuevas características en nuestro blog a medida que lleguen a las versiones Canary.
* **Como siempre, React continua usando semver para cada versión estable.**

## Como las funcionalidades de React son usualmente desarrolladas {/*how-react-features-are-usually-developed*/}

Normalmente, cada funcionalidad de React ha pasado por las mismas etapas:

1. Desarrollamos una versión inicial y la clasificamos como `experimental_` o `unstable_`. Esta funcionalidad solo esta disponible en el canal de versión `experimental`. En este punto, esta funcionalidad se espera que cambie significativamente.
2. Buscamos un equipo en Meta dispuestos a probar esta funcionalidad y darnos una retroalimentación de esta. Esto lleva a una ronda de cambios. A medida que la funcionalidad se vuelve más estable, trabajamos con más equipos en Meta para seguir probándola.
3. Eventualmente, nos sentimos seguros en su diseño. Eliminamos su etiqueta de clasificación del nombre de la API, y hacemos disponible la funcionalidad por defecto en la rama `main`, que de hecho la mayoría de productos de Meta usa. En este punto cualquier equipo en Meta puede usar esta funcionalidad.
4. A medida que ganamos confianza, también publicamos un RFC para la nueva funcionalidad. En este punto sabemos que el diseño funciona para una gran cantidad de casos de uso, pero probablemente debamos hacer algunos ajustes de último minuto.
5. Cuando estamos a punto de lanzar una versión de código abierto, redactamos la documentación de la funcionalidad y finalmente la desplegamos en una versión estable de React.

Este manual funciona bien para la mayoría de las funciones que hemos lanzado hasta ahora. Sin embargo, puede haber una brecha significativa entre el momento en que la funcionalidad está generalmente lista para su uso (paso 3) y cuando se libera en código abierto (paso 5).

**Nos gustaría ofrecer a la comunidad de React una opción para seguir el mismo enfoque que Meta, y adoptar antes nuevas funcionalidades individuales (a medida que estén disponibles) sin tener que esperar al próximo ciclo de lanzamiento de React.**

Como siempre, todas las funcionalidades de React acabarán llegando a la versión estable.

## ¿No podemos hacer más versiones menores? {/*can-we-just-do-more-minor-releases*/}

Por lo general, *hacemos* uso de versiones menores para agregar nuevas funcionalidades.

Sin embargo, no siempre es posible. A veces, las nuevas características están interconectadas con *otras* que aún no se han completado del todo y sobre las cuales seguimos trabajando activamente. No podemos publicarlas por separado porque sus implementaciones están relacionadas. Tampoco podemos hacer versiones por separado porque afectan a los mismos paquetes (por ejemplo, `react` y `react-dom`). Además tenemos que mantener la capacidad de iterar sobre las piezas que no están listas sin una ráfaga de lanzamientos de versiones mayores, que semver nos obligaría a realizar.

En Meta, hemos resuelto este problema construyendo React desde la rama `main`, y actualizándolo manualmente a un commit específico cada semana. Este es también el enfoque que las versiones de React Native han estado siguiendo durante los últimos años. Cada lanzamiento *estable* de React Native esta vinculado a un commit específico de la rama `main` del repositorio de React. Esto permite a React Native incluir importantes correcciones de errores y adoptar gradualmente nuevas funcionalidades de React a nivel de framework sin estar acoplando al horario global de lanzamientos de React.

Nos gustaría poner este flujo de trabajo a disposición de otros frameworks y configuraciones definidas. Por ejemplo, permite a un framework *sobre* React incluir un cambio de ultimo minuto relacionado a este mismo *antes* de que este cambio se incluya en una versión estable de React. Esto es particularmente útil porque algunos cambios de último minuto sólo afectan a las integraciones del framework. Esto permite a un framework publicar dicho cambio en su propia versión menor sin romper semver.

Los lanzamientos continuos en el canal de Canaries nos permitirán tener un bucle de retroalimentación más estrecho y garantizar que las nuevas características se prueben exhaustivamente en la comunidad. Este flujo de trabajo es cercano a como TC39, el comité de estándares de JavaScript, [maneja los cambios en etapas numeradas](https://tc39.es/process-document/). Las nuevas funcionalidades de React pueden estar disponibles en frameworks construidos sobre React antes de que estén en una versión estable de React del mismo modo que las nuevas funcionalidades de JavaScript llegan a los navegadores antes de ser ratificadas oficialmente como parte de la especificación.

## Por qué no utilizar versiones experimentales? {/*why-not-use-experimental-releases-instead*/}

Aunque técnicamente *puedes* utilizar [versiones Experimentales](/community/versioning-policy#canary-channel), no recomendamos su uso en producción porque las APIs experimentales pueden sufrir cambios significativos en su proceso de desarrollo (o incluso pueden ser eliminadas por completo). Mientras que también Canaries pueda contener errores (como cualquier versión), en el futuro tenemos previsto anunciar en nuestro blog cualquier cambio importante que se produzca. La versión Canaries son las más cercanas al código que Meta ejecuta internamente, por lo que en general se pueden esperar que sean relativamente estables. Sin embargo, es *necesario* mantener la versión fijada y escanear manualmente el registro de commits de GitHub al actualizar entre los demás commits fijados.

**Esperamos que la mayoría de las personas que utilizan React diferente a una configuración definida (como lo es un framework) quieran seguir utilizando las versiones estables.** Sin embargo, si estás construyendo un framework, puede que quieras considerar incluir una versión Canary de React fijada a un commit en particular, y actualizarla a tu propio ritmo. El beneficio de esto es que te permite enviar funcionalidades individuales de React y correcciones de errores en temprano desarrollo para tus usuarios y además en tu propio horario de lanzamiento, similar a como React Native lo ha estado haciendo durante los últimos años. La desventaja es que asumirías la responsabilidad adicional de revisar que commits de React se están incorporando y comunicar a tus usuarios qué cambios de React se incluyen en tus versiones.

Si eres un creador de un framework y quieres probar este método, por favor ponte en contacto con nosotros.

## Anunciar cambios de último minuto y nuevas funcionalidades con antelación {/*announcing-breaking-changes-and-new-features-early*/}

Los lanzamientos de Canary representan nuestra mejor estimación de lo que se incluirá en la próxima versión estable de React en cualquier momento dado.

Tradicionalmente, sólo hemos anunciado los cambios de último minuto al *final* del ciclo de su publicación (cuando hacíamos un lanzamiento mayor). Ahora que los lanzamientos de Canary son una forma oficial de consumir React, planeamos cambiar hacia el anuncio de cambios de último minuto y nuevas funcionalidades significativas a medida que *lleguen* a Canary. Por ejemplo, si fusionamos un cambio de último minuto que saldrá en Canary, escribiremos un post sobre él en el blog de React, incluyendo codemods e instrucciones de migración si es necesario. Entonces, si eres el autor de un framework desarrollando una versión mayor que actualiza ka versión fijada de React Canary, para incluir ese cambio puedes enlazarla a nuestro artículo del blog desde tus notas de versión. Por último, cuando una versión mayor estable de React esté lista, las enlazaremos a los artículos del blog ya publicados, el cual esperamos que ayuden a nuestro equipo a progresar rápidamente.

Planeamos documentar las APIs a medida que formen parte de Canaries (incluso si estas APIs aún no están disponibles fuera de ellas). Las APIs que sólo estén disponibles en Canaries se marcarán con una nota especial en las páginas correspondientes. Esto incluirá a las APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), y algunas otras (como `cache` y `createServerContext`) que enviaremos RFCs para ellas.

## Canaries deben estar fijadas {/*canaries-must-be-pinned*/}

Si decides adoptar el flujo de trabajo de Canary para tu aplicación o framework, asegúrate de fijar siempre la versión *exacta* de Canary que estas utilizando. Dado que Canaries son versiones preliminares, es posible que incluyan cambios de último minuto.

## Ejemplo: React Server Components {/*example-react-server-components*/}

Como [anunciamos en marzo](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), las convenciones de React Server Components han concluido, y no esperamos cambios significativos relacionados con su contrato de la API user-facing. Sin embargo, aún no podemos ofrecer apoyo para React Server Components en una versión estable de React porque aún seguimos trabajando en varias funcionalidades entrelazadas exclusivas del framework (como [asset loading](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) y aún esperamos allí más cambios de último minuto.

Esto significa que React Server Components están listos para ser adoptados por los frameworks. Sin embargo, hasta la próxima versión mayor de React, la única manera de que un framework los adopte es enviando una versión fijada Canary de React. (Para evitar empaquetar dos copias de React, los frameworks que deseen hacer esto tendrían que resolver los conflictos de `react` y `react-dom` a la versión fijada de Canary que envíen con su framework, y explicar esto a sus usuarios. Como un ejemplo, esto es lo que hace Next.js App Router.)

## Probar las bibliotecas con las versiones Stable y Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

No esperamos que los autores de las bibliotecas prueben cada una de las versiones de Canary, ya que sería excesivamente difícil. Sin embargo, al igual que cuando [introdujimos originalmente los diferentes canales de pre-lanzamiento de React hace tres años](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), animamos a las bibliotecas a realizar pruebas en *ambas* versiones tanto en las últimas versiones estables como con las últimas versiones de Canary. Si ves un cambio en el comportamiento que no haya sido anunciado, por favor, reporta el error en el repositorio de React para que podamos ayudar a diagnosticarlo. Esperamos que a medida que esta práctica se vaya adoptando, se reducirá la cantidad de esfuerzo necesario para actualizar las bibliotecas a las nuevas versiones principales de React, ya que las regresiones accidentales se encontrarán a medida que vayan apareciendo.

<Note>

Estrictamente hablando, Canary no es un *nuevo* canal de publicación (antes se llamaba Next). Sin embargo, hemos decido cambiarle el nombre para evitar confusiones con Next.js. Lo anunciamos como un *nuevo* canal de publicación para comunicar las nuevas expectativas, como Canaries siendo una forma oficialmente de utilizar React.

</Note>

## Las versiones estables funcionan como antes {/*stable-releases-work-like-before*/}

No presentamos ningún cambio a las versiones estables de React.



