---
id: faq-versioning
title: Política de versiones
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React sigue los principios de [versionado semántico (semver)](https://semver.org/lang/es/).

Esto significa que lo hace con un número de versión **x.y.z**:

* Al lanzar **correcciones de errores críticos**, hacemos el lanzamiento de un **parche** cambiando el número **z** (ej: 15.6.2 a 15.6.3).
* Al lanzar una **nueva funcionalidad** o **correciones de errores no críticos**, hacemos un **lanzamiento menor** cambiando el número **y** (ej: 15.6.2 a 15.7.0).
* Al lanzar **cambios con rupturas**, hacemos un **lanzamiento importante** cambiando el número **x** (ej: 15.6.2 a 16.0.0).

Los lanzamientos importantes también pueden contener nuevas funcionalidades, y cualquier lanzamiento puede incluir correcciones de errores.

Los lanzamientos menores son el tipo de lanzamiento más común.

> Esta política de versiones no aplica a compilados de pre-lanzamientos en los canales de "Next" o "Experimental". [Aprende más sobre pre-lanzamientos.](/docs/release-channels.html)

### Cambios con rupturas {#breaking-changes}

Los cambios con rupturas son inconvenientes para todos, por lo que intentamos minimizar el número de lanzamientos importantes – por ejemplo, React 15 fue lanzado en Abril de 2016 y React 16 fue lanzado en Septiembre de 2017; no esperamos lanzar React 17 hasta algún momento en el 2020.

En cambio, lanzamos nuevas funcionalidades en versiones menores. Esto significa que los lanzamientos menores son a menudo más interesantes que los lanzamientos importantes, a pesar de su modesto nombre.

### Compromiso a la estabilidad {#commitment-to-stability}

A medida que actualizamos React, intentamos minimizar el esfuerzo necesario para aprovechar nuevas funcionalidades. Cuando sea posible, mantendremos un API antiguo funcionando, incluso si eso significa ponerlo en un paquete separado. Por ejemplo, [el uso de *mixins* no ha sido recomendado durante años](/blog/2016/07/13/mixins-considered-harmful.html) pero aún son aceptados hasta hoy en día [mediante el uso de create-react-class](/docs/react-without-es6.html#mixins) y muchas bases de código aún siguen utilizándolos en código estable pero antiguo.

Más de un millón de desarrolladores utilizan React, manteniendo colectivamente millones de componentes. Solamente la base de código de Facebook tiene más de 50.000 componentes de React. Esto significa que tenemos que hacer lo más fácil posible actualizar a nuevas versiones de React; si hacemos grandes cambios sin una guía de actualización, la gente se quedará atascada en versiones antiguas. Probamos estas guías de actualización en Facebook – si nuestro equipo de menos de 10 personas puede actualizar 50.000 componentes por si mismos, esperamos que la actualización sea manejable para cualquiera que utilice React. En muchos casos, escribimos [*scripts* automatizados](https://github.com/reactjs/react-codemod) para actualizar la sintaxis de componentes, que luego incluimos en la versión de código abierto para que todo el mundo los utilice.

### Mejoras graduales a través de advertencias {#gradual-upgrades-via-warnings}

Las versiones de desarrollo de React incluyen muchas advertencias útiles. Siempre que es posible, añadimos advertencias en preparación a futuros cambios con rupturas. De esta manera, si tu aplicación no tiene advertencias en el último lanzamiento, esta será compatible con el próximo lanzamiento importante. Esto te permite actualizar tu aplicación un componente a la vez.

Las advertencias de desarrollo no afectarán el comportamiento en tiempo de ejecución de tu aplicación. De esa forma, puedes estar seguro de que tu aplicación se comportará de la misma manera entre la versión de desarrollo y la versión de producción -- las únicas diferencias son que la versión de producción no registrará las advertencias y es más eficiente. (Si alguna vez observas lo contrario, por favor abre un caso).

### ¿Qué cuenta como un cambio con rupturas? {#what-counts-as-a-breaking-change}

En general, *no publicamos* una versión importante por cambios a:

* **Advertencias de desarrollo.** Dado que no afectan el comportamiento en producción, podemos añadir nuevas advertencias o modificar advertencias existentes entre versiones importantes. De hecho, esto es lo que nos permite advertir de forma fiable sobre los próximos cambios con rupturas.
* **APIs que comienzan con `unstable_`.** Estas ofrecen funcionalidades experimentales sobre cuyas APIs todavía no estamos seguros. Al publicar esto con un prefijo `unstable_`, podemos iterar más rápido y llegar a un API estable lo antes posible.
* **Versiones alfa y *canary* de React.**  Proporcionamos versiones alfa de React como una manera de probar nuevas características con antelación, pero necesitamos la flexibilidad para hacer cambios basados en lo que aprendemos en el período alfa. Si utilizas estas versiones, ten en cuenta que las APIs pueden cambiar antes de la versión estable sea publicada.
* **APIs no documentadas y estructuras de datos internas.** Si accedes a nombres de propiedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` o `__reactInternalInstance$uk43rzhitjg`, no podemos garantizar nada. Estás por tu cuenta.

Esta política está diseñada para ser pragmática: desde luego, no queremos causarte dolores de cabeza. Si publicáramos una nueva versión importante por cada uno de estos cambios, acabaríamos lanzando más versiones importantes y causaríamos más inconvenientes con el versionado a la comunidad. También significaría que no podríamos mejorar React tan rápido como nos gustaría.

Dicho esto, si creemos que algún cambio en esta lista va a provocar grandes problemas en la comunidad, haremos todo lo posible para proporcionar una guía de actualización gradual.

### Si un lanzamiento menor no incluye nuevas funcionalidades, por qué no es un parche? {#minors-versus-patches}

Es posible que un lanzamiento menor no incluya nuevas funcionalidades. [Esto es permitido por semver](https://semver.org/#spec-item-7), que dice **"[un lanzamiento menor] PUEDE incrementarse si una funcionalidad substancial o mejoras son introducidas en el código privado. PUEDE incluir cambios a nivel de parche."**

Sin embargo, sale a flote la pregunta de por qué estos lanzamientos no son versionados como parches.

La respuesta es que cualquier cambio a React (o cualquier otro software) lleva cierto riesgo de romperse de maneras inesperadas. Imagina un escenario en el que el lanzamiento del parche que arregla un error accidentalmente crea un nuevo error. Esto no solo sería disruptivo para los desarrolladores, sino que también dañaría la confianza en futuros lanzamientos de parches. Es especialmente lamentable si el arreglo original es para un error que es raramente encontrado en la práctica.

Tenemos un buen record de mantener los lanzamientos de React libres de errores, pero los lanzamientos de parches tienen un nivel mayor de confiabilidad ya que la mayoría de los desarrolladores asumen que pueden adoptarlos sin consecuencias adversas.

Por estas razones, reservamos los lanzamientos de parches exclusivamente para los errores más críticos y vulnerabilidades de seguridad.

Si el lanzamiento incluye cambios no esenciales - como por ejemplo refactorizados internos, cambios a los detalles de implementación, mejoras de rendimiento, o arreglos a errores menores - lanzaremos la versión menor incluso cuando no hay nuevas funcionalidades.
