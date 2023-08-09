---
title: Política de versiones
---

<Intro>

Todas las compilaciones estables de React pasan por un alto nivel de pruebas y siguen el versionado semántico (semver). React también ofrece canales de lanzamiento inestables para fomentar los comentarios tempranos sobre funcionalidades experimentales. Esta página describe lo que puedes esperar de los lanzamientos de React.

</Intro>

## Lanzamientos estables {/*stable-releases*/}

Los lanzamientos estables de React (también conocidos como canal de lanzamiento "latest") siguen los principios de [versionado semántico (semver)](https://semver.org/).

Eso significa que con un número de versión **x.y.z**:

* Cuando lanzamos **correcciones de errores críticos**, hacemos una **versión parche** cambiando el número **z** (ej: 15.6.2 a 15.6.3).
* Cuando lanzamos **nuevas funcionalidades** o **correcciones no críticas**, hacemos una **versión menor** cambiando el número **y** (ej: 15.6.2 a 15.7.0).
* Cuando lanzamos **cambios importantes**, hacemos una **versión mayor** cambiando el número **x** (ej: 15.6.2 a 16.0.0).

Las versiones mayores también pueden contener nuevas funcionalidades, y cualquier versión puede incluir correcciones de errores.

Las versiones menores son el tipo de versión más común.

### Cambios importantes {/*breaking-changes*/}

Los cambios importantes son inconvenientes para todos, por lo que intentamos minimizar el número de versiones mayores; por ejemplo, React 15 fue lanzado en abril de 2016 y React 16 fue lanzado en septiembre de 2017, y React 17 fue lanzado en octubre de 2020.

En cambio, lanzamos nuevas funcionalidades en versiones menores. Eso significa que las versiones menores suelen ser más interesantes y convincentes que las mayores, a pesar de su nombre modesto.

### Compromiso con la estabilidad {/*commitment-to-stability*/}

A medida que cambiamos React a lo largo del tiempo, tratamos de minimizar el esfuerzo requerido para aprovechar de nuevas funcionalidades. Cuando sea posible, mantendremos funcionando una API antigua, incluso si eso significa ponerla en un paquete separado. Por ejemplo, [los mixins han sido desalentados durante años](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) pero son soportados hasta el día de hoy [vía create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) y muchas bases de código continúan usándolos en código heredado estable.

Más de un millón de desarrolladores usan React, manteniendo colectivamente millones de componentes. El código base de Facebook solo tiene más de 50 000 componentes React. Eso significa que necesitamos hacer que sea tan fácil como sea posible actualizar a nuevas versiones de React; si hacemos grandes cambios sin una ruta de migración, las personas se quedarán atrapadas en versiones antiguas. Probamos estas rutas de actualización en el mismo Facebook – si nuestro equipo de menos de 10 personas puede actualizar más de 50 000 componentes, esperamos que la actualización sea manejable para cualquiera que use React. En muchos casos, escribimos [scripts automatizados](https://github.com/reactjs/react-codemod) para actualizar la sintaxis de los componentes, que luego incluimos en la versión de código abierto para que todos la usen.

### Actualizaciones graduales a través de advertencias {/*gradual-upgrades-via-warnings*/}

Las compilaciones de desarrollo de React incluyen muchas advertencias útiles. Siempre que es posible, agregamos advertencias en preparación para futuros cambios importantes. De esa forma, si su aplicación no tiene advertencias en la última versión, será compatible con la próxima versión mayor. Esto le permite actualizar sus aplicaciones un componente a la vez.

Las advertencias de desarrollo no afectarán el comportamiento del tiempo de ejecución de su aplicación. De esa manera, puede estar seguro de que su aplicación se comportará de la misma manera entre las compilaciones de desarrollo y producción; las únicas diferencias son que la compilación de producción no registrará las advertencias y eso es más eficiente. (Si alguna vez notas lo contrario, por favor presente una propuesta).

### ¿Qué cuenta como un cambio importante? {/*what-counts-as-a-breaking-change*/}

En general, *no* cambiamos la versión mayor para cambios en:

* **Advertencias de desarrollo.** Dado que estas no afectan el comportamiento de producción, podemos agregar nuevas advertencias o modificar advertencias existentes entre versiones mayores. De hecho, esto es lo que nos permite advertir de manera confiable sobre los próximos cambios importantes.
* **APIs que comienzan con `unstable_`.** Estas son proporcionadas como funcionalidades experimentales cuyas APIs aún no confiamos. Al lanzarlas con un prefijo `unstable_`, podemos iterar más rápido y obtener una API estable antes.
* **Versiones alfa y canary de React.** Proporcionamos versiones alfa de React como una forma de probar nuevas funciones tempranamente, pero necesitamos la flexibilidad para hacer cambios basados en lo que aprendemos en el período alfa. Si usas estas versiones, tenga en cuenta que las APIs pueden cambiar antes del lanzamiento estable.
* **APIs no documentadas y estructuras de datos internas.** Si accedes a nombres de propiedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` o `__reactInternalInstance$uk43rzhitjg`, no hay garantía. Estas por tu cuenta.

Esta política está diseñada para ser pragmática: ciertamente, no queremos causarle dolores de cabeza. Si cambiamos la versión mayor para todos estos cambios, terminaríamos lanzando más versiones mayores y, en última instancia, causando más problemas de versionado para la comunidad. También significaría que no podemos hacer progreso en el mejoramiento de React tan rápido como nos gustaría.

Dicho esto, si esperamos que un cambio en esta lista cause grandes problemas en la comunidad, haremos todo lo posible para proporcionar una ruta de migración gradual.

### Si una versión menor no incluye funciones nuevas ¿por qué no es un parche? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

Es posible que una versión menor no incluya nuevas funciones. [Esto está permitido por semver](https://semver.org/#spec-item-7), que establece que **"[una versión menor] PUEDE incrementarse si nuevas funcionalidades sustanciales o mejoras son introducidas dentro del código privado. PUEDE incluir cambios de nivel de parche."**

Sin embargo, plantea la pregunta de por qué estos lanzamientos no están versionados como parches en su lugar.

La respuesta es que cualquier cambio en React (u otro software) conlleva cierto riesgo de rotura en maneras inesperadas. Imagine un escenario donde el lanzamiento de un parche que corrige un error, introduce accidentalmente un error diferente. Esto no solo sería disruptivo para los desarrolladores, sino que también dañaría su confianza en futuros lanzamientos de parches. Es especialmente lamentable si la solución original es para un error que es raramente encuentrado en la práctica.

Tenemos un historial bastante bueno para mantener los lanzamientos de React libres de errores, pero los lanzamientos de parches tienen una barra aún más alta para la confiabilidad, porque la mayoría de los desarrolladores asumen que pueden ser adoptados sin consecuencias adversas.

Por estas razones, reservamos los lanzamientos de parches solo para los errores más críticos y vulnerabilidades de seguridad.

Si un lanzamiento incluye cambios no esenciales, como refactorización interna, cambios en los detalles de implementación, mejoras de rendimiento o correcciones de errores menores, cambiaremos la versión menor incluso cuando no haya nuevas funciones.

## Todos los canales de lanzamiento {/*all-release-channels*/}

React se basa en una próspera comunidad de código abierto para presentar informes de errores, abrir solicitudes de incorporación de cambios y [enviar RFCs](https://github.com/reactjs/rfcs). Para alentar los comentarios, a veces compartimos compilaciones especiales de React que incluyen funciones inéditas.

<Note>

Esta sección será más relevante para los desarrolladores que trabajan en marcos de trabajo, bibliotecas, o herramientas para desarrolladores. Los desarrolladores que usan React principalmente para crear aplicaciones orientadas al usuario no deberían necesitar preocuparse sobre nuestros canales de presentación.

</Note>

Cada uno de los canales de lanzamiento de React está diseñado para un caso de uso distinto:

- [**Latest**](#latest-channel) es para lanzamientos estables semver React. Es lo que obtienes cuando instalas React desde npm. Este es el canal que ya estás usando hoy. **Las aplicaciones orientadas al usuario que consumen React, directamente usan este canal.**

- [**Canary**](#canary-channel) rastrea la rama principal del repositorio del código fuente de React. Piense en estos como candidatos de lanzamiento para el próximo lanzamiento de semver. **[Los marcos de trabajo u otras configuraciones seleccionadas pueden elegir usar este canal con una versión fijada de React.](/blog/2023/05/03/react-canaries) También puede usar el canal canary para pruebas de integración entre React y proyectos de terceros.**

- [**Experimental**](#experimental-channel) incluye APIs experimentales y funciones que no están disponibles en los lanzamientos estables. Estos también rastrean la rama principal, pero con indicadores de funciones adicionales activados. Use esto para probar las próximas funciones antes de su lanzamiento.

Todos los lanzamientos son publicados en npm, pero solo latest utiliza el versionado semántico. Los prelanzamientos (aquellos en los canales canary y experimental) tienen versiones generadas a partir de un hash de sus contenidos y la fecha de confirmación, ej. `18.3.0-canary-388686f29-20230503` para canary y `0.0.0-experimental-388686f29-20230503` para experimental.

**Tanto los canales latest como canary son oficialmente soportados para aplicaciones orientadas al usuario, pero con diferentes expectativas**:

* Los lanzamientos latest siguen el modelo tradicional de semver.

* Los lanzamientos canary [deben ser fijados](/blog/2023/05/03/react-canaries) y pueden incluir cambios importantes. Ellos existen para configuraciones seleccionadas (como marcos de trabajo) que quieren lanzar gradualmente nuevas funciones y correcciones de errores de React en su propio calendario de lanzamiento.

Los lanzamientos experimentales se proporcionan solo con fines de prueba y no ofrecemos garantías de que el comportamiento no cambiará entre las lanzamientos. No siguen el protocolo semver que usamos para los lanzamientos de latest.

Al publicar versiones preliminares en el mismo registro que usamos para versiones estables, somos capaces de tomar ventaja de muchas herramientas que soportan el flujo de trabajo de npm, como [unpkg](https://unpkg.com) y [CodeSandbox](https://codesandbox.io).

### Canal latest {/*latest-channel*/}

Latest es el canal utilizado para versiones estables de React. Corresponde a la etiqueta `latest` en npm. Es el canal recomendado para todas las aplicaciones React que son enviadas a los usuarios reales.

**Si no estás seguro de qué canal deberías usar, es latest.** Si estás usando React directamente, esto es lo que ya estás usando. Puedes esperar que las actualizaciones latest sean extremadamente estables. Las versiones siguen el esquema de versionado semántico, como [se describió anteriormente.](#stable-releases)

### Canal canary {/*canary-channel*/}

El canal canary es un canal de presentación que rastrea la rama principal del repositorio de React. Usamos prelanzamientos en el canal canary como candidatos de lanzamiento para el canal latest. Puedes pensar en canary como un superconjunto de latest que es actualizado más frecuentemente.

El grado de cambio entre la versión canary más reciente y la versión latest más reciente es aproximadamente el mismo que encontrarías entre dos versiones menores de semver. Sin embargo, **el canal canary no se ajusta al versionado semántico.** Deberías esperar cambios importantes ocasionales entre lanzamientos sucesivos en el canal canary.

**No use versiones preliminares en aplicaciones orientadas al usuario directamente a menos que estés siguiendo el [flujo de trabajo de canary](/blog/2023/05/03/react-canaries).**

Los lanzamientos en canary se publican con la etiqueta `canary` en npm. Las versiones son generadas a partir de un hash del contenido de la compilación y la fecha de confirmación, ej. `18.3.0-canary-388686f29-20230503`.

#### Usando el canal canary para pruebas de integración {/*using-the-canary-channel-for-integration-testing*/}

El canal canary también soporta pruebas de integración entre React y otros proyectos.

Todos los cambios en React pasan por extensas pruebas internas antes de que sean lanzandos para el público. Sin embargo, hay innumerables entornos y configuraciones usados en todo el ecosistema de React, y no es posible para nosotros probar contra cada uno.

Si eres el autor de un marco de trabajo de React de terceros, biblioteca, herramienta para desarrolladores o proyecto de tipo de infraestructura similar, puedes ayudarnos a mantener React estable para tus usuarios y la comunidad entera de React, ejecutando periódicamente su conjunto de pruebas contra los cambios más recientes. Si estás interesado, sigue estos pasos:

- Configure un trabajo cron usando su plataforma de integración continua preferida. Los trabajos cron son soportados por [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) y [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- En el trabajo cron, actualice sus paquetes de React a la versión de React más reciente en el canal canary, usando la etiqueta `canary` en npm. Usando la CLI de npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  O yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Ejecute su conjunto de pruebas contra los paquetes actualizados.
- Si todo pasa, ¡genial! Puedes esperar que tu proyecto funcione con la próxima versión menor de React.
- Si algo se rompe inesperadamente, por favor déjanos saber [presentando una propuesta](https://github.com/facebook/react/issues).

Un proyecto que usa este flujo de trabajo es Next.js. Puedes referirte a su [configuración de CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) como un ejemplo.

### Canal experimental {/*experimental-channel*/}

Como canary, el canal experimental es un canal de presentación que rastrea la rama principal del repositorio de React. A diferencia de canary, las versiones experimentales incluyen funciones adicionales y APIs que no están listas para una versión más amplia.

Por lo general, una actualización en canary es acompañada por una actualización correspondiente a experimental. Se basan en la misma revisión de origen, pero son compilados usando un conjunto diferente de indicadores de funciones.

Los lanzamientos experimentales pueden ser significativamente diferentes que los lanzamientos en canary y latest. **No uses versiones experimentales en aplicaciones orientadas al usuario.** Deberías esperar cambios importantes frecuentes entre los lanzamientos en el canal experimental.

Los lanzamientos en experimental se publican con la etiqueta `experimental` en npm. Las versiones son generadas a partir de un hash del contenido de la compilación y la fecha de confirmación, ej. `0.0.0-experimental-68053d940-20210623`.

#### ¿Qué incluye un lanzamiento experimental? {/*what-goes-into-an-experimental-release*/}

Las funciones experimentales son unas que no están listas para ser lanzadas al público más amplio, y pueden cambiar drásticamente antes de que estén finalizadas. Algunos experimentos puede que nunca estén finalizados; la razón por la que tenemos experimentos es para probar la viabilidad de los cambios propuestos.

Por ejemplo, si el canal experimental hubiera existido cuando anunciamos Hooks, habríamos lanzado Hooks al canal experimental semanas antes de que estuvieran disponibles en latest.

Puede encontrar valioso, ejecutar pruebas de integración contra experimental. Esto depende de ti. Sin embargo, se le informa que experimental es incluso menos estable que canary. **No garantizamos ninguna estabilidad entre las versiones experimentales.**

#### ¿Cómo puedo aprender más sobre funciones experimentales? {/*how-can-i-learn-more-about-experimental-features*/}

Las funciones experimentales pueden o no estar documentadas. Por lo general, los experimentos no están documentados hasta que estén cerca del envío en canary o latest.

Si una función no está documentada, puede ir acompañada por un [RFC](https://github.com/reactjs/rfcs).

Publicaremos en el [blog de React](/blog) cuando estemos listos para anunciar nuevos experimentos, pero eso no significa que daremos a conocer cada experimento.

Siempre puedes consultar el [historial](https://github.com/facebook/react/commits/main) de nuestro repositorio público de GitHub por una lista completa de cambios.
