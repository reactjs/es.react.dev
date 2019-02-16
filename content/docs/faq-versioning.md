---
id: faq-versioning
title: Política de Versiones
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React sigue los principios de [versionado semántico (semver)](https://semver.org/lang/es/).

Esto significa que lo hace con un número de versión **x.y.z**:

* Al publicar **cambios de ruptura**, hacemos una **publicación mayor** cambiando el número **x** (ej: 15.6.2 a 16.0.0).
* Al publicar **nueva funcionalidad**, hacemos una **publicación menor** cambiando el número **y** (ej: 15.6.2 a 15.7.0).
* Al publicar **correcciones de bugs**, publicamos un **patch** cambiando el número **z** (ej: 15.6.2 a 15.6.3).

Las publicaciones mayores también pueden contener nueva funcionalidad, y cualquier versión puede incluir correcciones de bugs.

### Cambios con Rupturas {#breaking-changes}

Los cambios de ruptura son inconvenientes para todos, por lo que intentamos minimizar el número de publicaciones importantes – por ejemplo, React 15 fue publicado en abril de 2016 y React 16 fue publicado en septiembre de 2017; no esperamos publicar React 17 hasta el 2019.

En cambio, publicamos nueva funcionalidad en versiones menores. Esto significa que las publicaciones menores son a menudo más interesantes que las publicaciones mayores, a pesar de su modesto nombre.

### Compromiso a la estabilidad {#commitment-to-stability}

A medida que actualizamos React, intentamos minimizar el esfuerzo necesario para aprovechar nueva funcionalidad. Cuando sea posible, mantendremos un API antiguo funcionando, incluso si eso significa ponerlo en un *package* separado. Por ejemplo, [el uso de mixins ha sido desalentado durante años](/blog/2016/07/13/mixins-considered-harmful.html) pero están respaldados hasta este día [a través de la clase create-react-class](/docs/react-without-es6.html#mixins) y muchos *codebases* siguen utilizándolos en código estable y *legacy*.

Más de un millón de desarrolladores utilizan React, manteniendo colectivamente millones de componentes. Solamente el codebase de Facebook tiene más de 50.000 componentes de React. Esto significa que tenemos hacer que sea lo más fácil posible actualizar a nuevas versiones de React; si hacemos grandes cambios sin un camino de migración, la gente se quedará atrapada en versiones antiguas. Probamos estas rutas de actualización en Facebook mismo – si nuestro equipo de menos de 10 personas puede actualizar 50.000 componentes, esperamos que la actualización sea manejable para cualquiera que utilice React. En muchos casos, escribimos [scripts automatizados](https://github.com/reactjs/react-codemod) para actualizar la sintaxis de componentes, que luego incluimos en la versión de código abierto para que todo el mundo los utilice.

### Mejoras graduales a través de advertencias {#gradual-upgrades-via-warnings}

Las versiones de desarrollo de React incluyen muchas advertencias útiles. Siempre que es posible, añadimos advertencias en preparación a futuros cambios con rupturas. De esta manera, si tu aplicación no tiene advertencias en el último lanzamiento, esta será compatible con el próximo lanzamiento importante. Esto te permite actualizar tu aplicación un componente a la vez.

Las advertencias de desarrollo no afectarán el comportamiento en tiempo de ejecución de tu aplicación. De esa manera, puedes sentir la confianza de que tu aplicación se comportará de la misma manera entre la versión de desarrollo y la versión de producción -- las únicas diferencias son que la versión de producción no registrará las advertencias y es más eficiente. (Si alguna vez observa lo contrario, por favor presentar un *issue*.)

### ¿Qué cuenta como un cambio de ruptura? {#what-counts-as-a-breaking-change}

En general, *no publicamos* una versión mayor por cambios a:

* **Advertencias de desarrollo.** Dado que no afectan al comportamiento de producción, podemos añadir nuevas advertencias o modificar advertencias existentes entre las versiones mayores. De hecho, esto es lo que nos permite advertir de forma fiable sobre los próximos cambios de ruptura.
* **APIs que comienzan con `unstable_`.** Estos ofrecen funcionalidades experimentales sobre cuyos APIs todavía no estamos seguros. Al publicar esto con un prefijo `unstable_`, podemos iterar más rápido y llegar a un API estable lo antes posible.
* **Versiones alfa y canarias de React.**  Proporcionamos versiones alfa de React como una manera de probar nuevas características temprano, pero necesitamos la flexibilidad para hacer cambios basados en lo que aprendemos en el período alfa.
* **APIs no documentadas y estructuras de datos internas.** Si accede a nombres de propiedad interna como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` o `__reactInternalInstance$uk43rzhitjg`, no podemos garantizar nada. Usted está por su cuenta.

Esta política está diseñada para ser pragmática: desde luego, no queremos causarle dolores de cabeza. Si publicaramos una nueva versión mayor por cada uno de estos cambios, acabaríamos publicando más versiones mayores y causaríamos más inconveniencias a la comunidad. También significaría que no podríamos mejorar React tan rápido como nos gustaría.

Dicho esto, si creemos que algún cambio en esta lista va a provocar grandes problemas en la comunidad, haremos todo lo posible para proporcionar una guía de migración gradual.
