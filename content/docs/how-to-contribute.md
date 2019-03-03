---
id: how-to-contribute
title: Cómo contribuir
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

React es uno de los primeros proyectos de código abierto de Facebook que si bien está siendo desarrollado muy activamente, al mismo tiempo se utiliza para crear código que les llega a todos en [facebook.com](https://www.facebook.com). Todavía estamos trabajando en los problemas para hacer que la contribución a este proyecto sea lo más fácil y transparente posible, pero aún no hemos llegado a ese punto. Esperamos que este documento haga que el proceso de contribución sea claro y responda algunas preguntas que pueda tener.

### [Código de conducta](https://code.facebook.com/codeofconduct) {#code-of-conduct}

Facebook ha adoptado un código de conducta que esperamos que los participantes del proyecto cumplan. Lee [el texto completo](https://code.facebook.com/codeofconduct) para que puedas comprender qué acciones serán o no toleradas.

### Desarrollo abierto {#open-development}

Todo el trabajo en React sucede directamente en [GitHub](https://github.com/facebook/react). Tanto los miembros del equipo central como los colaboradores externos envían *pull requests* que pasan por el mismo proceso de revisión.

### Organización de las ramas {#branch-organization}

Haremos todo lo posible por mantener la [rama `master`](https://github.com/facebook/react/tree/master) en buen estado, con pruebas que pasen todo el tiempo. Pero para avanzar rápidamente, realizaremos cambios en la API con los que tu aplicación podría no ser compatible. Recomendamos que uses [la última versión estable de React](/downloads.html).

Si envías un *pull request*, hazlo contra la rama `master`. Mantenemos ramas estables para las versiones principales por separado, pero no aceptamos *pull requests* directamente a ellas. En su lugar, seleccionamos cambios compatibles de la rama *master* y los pasamos a la última versión mayor estable.

### Versionado semántico {#semantic-versioning}

React sigue [el versionado semántico](https://semver.org/). Lanzamos versiones de parches para correcciones de errores, versiones menores para nuevas funciones y versiones mayores para cualquier cambio importante. Cuando hacemos cambios importantes, también introducimos advertencias de descontinuación en una versión menor para que nuestros usuarios conozcan los próximos cambios y migren su código de antemano.

Etiquetamos cada *pull request* con un rótulo que indica si el cambio debería ir en la siguiente versión de [parche](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-patch), [menor](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-minor), o [mayor](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-major). Lanzamos nuevas versiones de parches cada pocas semanas, versiones menores cada pocos meses y versiones mayores una o dos veces al año.

Cada cambio significativo se documenta en el [archivo de registro de cambios](https://github.com/facebook/react/blob/master/CHANGELOG.md).

### Errores {#bugs}

#### Dónde encontrar problemas conocidos {#where-to-find-known-issues}

Estamos utilizando el sistema de [*incidencias* de GitHub](https://github.com/facebook/react/issues) para nuestros errores públicos. Mantenemos una estrecha vigilancia sobre esto y tratamos de avisar cuando tenemos una solución interna en curso. Antes de hacer un nuevo reporte, asegúrate de que tu problema no exista ya.

#### Reportando nuevas incidencias {#reporting-new-issues}

La mejor manera de solucionar tu error es proporcionar un caso de prueba reducido. Esta [plantilla JSFiddle](https://jsfiddle.net/Luktwrdm/) es un gran punto de partida.

#### Errores de seguridad {#security-bugs}

Facebook tiene un [programa de recompensas](https://www.facebook.com/whitehat/) para la divulgación segura de errores de seguridad. Con esto en mente, por favor, no abras incidencias públicas. Sigue el proceso descrito en esa página.

### Cómo entrar en contacto {#how-to-get-in-touch}

* IRC: [#reactjs en freenode](https://webchat.freenode.net/?channels=reactjs)
* Foro de discusión: [discuss.reactjs.org](https://discuss.reactjs.org/)

También hay [una comunidad activa de usuarios de React en la plataforma de chat Discord](https://www.reactiflux.com/) en caso de que necesites ayuda con React.

### Proponer un cambio {#proposing-a-change}

Si tiene la intención de cambiar la API pública o realizar cambios no triviales en la implementación, recomendamos [abrir una incidencia](https://github.com/facebook/react/issues/new). Esto nos permite llegar a un acuerdo sobre tu propuesta antes que le pongas un gran esfuerzo.

Si solo estás solucionando un error, está bien enviar un *pull request* de inmediato, pero seguimos recomendando que abras una incidencia que detalle que es lo que estás solucionando. Esto es útil en caso de que no aceptemos esa solución en particular, pero aún queramos hacer el seguimiento del problema.

### Tu primer pull request {#your-first-pull-request}

¿Trabajando en tu primer *pull request*? Puedes aprender cómo en esta serie de videos gratis:

**[Cómo contribuir a un proyecto de código abierto en GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**

Para ayudarte a familiarizarte con nuestro proceso de contribución, tenemos una lista de **[incidencias adecuadas para comenzar](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** que contienen errores que tienen un alcance relativamente limitado. Este es un gran lugar para empezar.

Si decides solucionar una incidencia, asegúrate de revisar el hilo de comentarios en caso de que alguien ya esté trabajando en una solución. Si nadie está trabajando en ello en este momento, deja un comentario que indique que deseas trabajar en ella para que otras personas no dupliquen accidentalmente su esfuerzo.

Si alguien reclama una incidencia pero no hace un seguimiento por más de dos semanas, está bien que te hagas cargo pero aún así debes dejar un comentario.

### Enviar un pull request {#sending-a-pull-request}

El equipo principal está monitoreando los *pull requests*. Revisaremos tu *pull request* y haremos un *merge*, solicitaremos cambios o lo cerraremos con una explicación. Para los cambios de API, es posible que tengamos que arreglar nuestros usos internos en Facebook.com, lo que podría causar algún retraso. Haremos nuestro mejor esfuerzo para proporcionar actualizaciones y comentarios durante todo el proceso.

**Antes de enviar un _pull request_**, asegúrate de que se haga lo siguiente:

1. Haz un *fork* [del repositorio](https://github.com/facebook/react) y crea tu rama a partir de `master`.
2. Ejecuta `yarn` en la raíz del repositorio.
3. Si has corregido un error o has agregado un código que debería probarse, ¡agrega pruebas!
4. Asegúrate de que el conjunto de pruebas pasa (`yarn test`). Consejo: `yarn test --watch TestName` es útil en desarrollo.
5. Ejecuta `yarn test-prod` para probar en el entorno de producción. Es compatible con las mismas opciones que `yarn test`.
6. Si necesitas un depurador, ejecuta `yarn debug-test --watch TestName`, abre `chrome://inspect` y presiona "Inspeccionar".
7. Formatea tu código con [prettier](https://github.com/prettier/prettier) (`yarn prettier`).
8. Asegúrate de ejecutar lint en tu código (`yarn lint`). Consejo: `yarn linc` para verificar solo los archivos modificados.
9. Ejecuta los controles de tipo de [Flow](https://flowtype.org/) (`yarn flow`).
10. Si aún no lo has hecho, completa el CLA.

### Acuerdo de Licencia de Contribuidor (CLA) {#contributor-license-agreement-cla}

Para aceptar tu pull request, necesitamos que envíes un CLA. Solo necesitas hacer esto una vez, así que si lo has hecho para otro proyecto de código abierto de Facebook, estás listo. Si estás enviando un *pull request* por primera vez, haznos saber que has completado el CLA y podemos verificarlo con tu nombre de usuario de GitHub.

**[Completa tu CLA aquí.](https://code.facebook.com/cla)**

### Prerequisitos para contribuir {#contribution-prerequisites}

* Tienes [Node](https://nodejs.org) instalado con v8.0.0+ y [Yarn](https://yarnpkg.com/en/) con v1.2.0+.
* Tienes `gcc` instalado o te sientes cómodo instalando un compilador si es necesario. Algunas de nuestras dependencias pueden requerir un paso de compilación. En OS X, las herramientas de línea de comandos de Xcode cubrirán esto. En Ubuntu, `apt-get install build-essential` instalará los paquetes necesarios. Comandos similares deberían funcionar en otras distribuciones de Linux. Windows requerirá algunos pasos adicionales, consulta las [instrucciones de instalación de `node-gyp`](https://github.com/nodejs/node-gyp#installation) para obtener más información.
* Estás familiarizado con Git.

### Flujo de trabajo de desarrollo {#development-workflow}

Después de clonar React, ejecuta `yarn` para obtener sus dependencias.
A continuación, puedes ejecutar varios comandos:

* `yarn lint` comprueba el estilo del código.
* `yarn linc` es como` yarn lint` pero más rápido, porque solo verifica los archivos que difieren en tu rama.
* `yarn test` ejecuta el conjunto total de pruebas.
* `yarn test --watch` ejecuta un observador de pruebas interactivo.
* `yarn test <pattern>` ejecuta pruebas con nombres de archivos que coincidan.
* `yarn test-prod` ejecuta pruebas en el entorno de producción. Es compatible con todas las mismas opciones que `yarn test`.
* `yarn debug-test` es igual que` yarn test` pero con un depurador. Abre `chrome://inspect` y presiona "Inspeccionar".
* `yarn flow` ejecuta todas las comprobaciones de tipos de [Flow](https://flowtype.org/).
* `yarn build` crea una carpeta` build` con todos los paquetes.
* `yarn build react/index,react-dom/index --type=UMD` crea las compilaciones UMD solo de React y ReactDOM.

Recomendamos ejecutar `yarn test` (o sus variaciones anteriores) para asegurarte de no introducir ninguna regresión mientras trabajas en tu cambio. Sin embargo, puede ser útil probar tu compilación de React en un proyecto real.

En primer lugar, ejecuta `yarn build`. Esto producirá paquetes precompilados en la carpeta `build`, así como también preparará paquetes npm dentro de `build/packages`.

La forma más fácil de probar tus cambios es ejecutar `yarn build react/index,react-dom/index --type=UMD` y luego abrir `fixtures/packaging/babel-standalone/dev.html`. Este archivo ya utiliza `react.development.js` de la carpeta` build` por lo que recogerá tus cambios.

Si deseas probar los cambios en tu proyecto React existente, puedes copiar `build/dist/react.development.js`,`build/dist/react-dom.development.js`, o cualquier otro producto de compilación en tu aplicación y usarlos en lugar de la versión estable. Si tu proyecto usa React desde npm, puedes eliminar `react` y` react-dom` en sus dependencias y usar `yarn link` para apuntarlos a tu carpeta local `build`:

```sh
cd ~/ruta_a_tu_clon_react/build/node_modules/react
yarn link
cd ~/ruta_a_tu_clon_react/build/node_modules/react-dom
yarn link
cd /ruta/a/tu/proyecto
yarn link react react-dom
```

Cada vez que ejecutes `yarn build` en la carpeta React, las versiones actualizadas aparecerán dentro de `node_modules` en tu proyecto. A continuación, puedes reconstruir tu proyecto para probar tus cambios.

Aún requerimos que tu *pull request* contenga pruebas unitarias para cualquier funcionalidad nueva. De esta manera podemos asegurarnos de que tu código no falle en el futuro.

### Guía de estilo {#style-guide}

Utilizamos un formateador de código automático llamado [Prettier](https://prettier.io/).
Ejecuta `yarn prettier` después de realizar cualquier cambio en el código.

Luego, nuestra guía detectará la mayoría de los problemas que puedan existir en tu código. 
Puedes verificar el estado de tu estilo de código simplemente ejecutando `yarn linc`.

Sin embargo, todavía hay algunos estilos que el *linter* no puede recoger. Si no estás seguro de algo, consulta la [Guía de estilo de Airbnb](https://github.com/airbnb/javascript) que te guiará en la dirección correcta.

### Video introductorio {#introductory-video}

Es posible que te interese ver [este breve video](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26 minutos) que brinda una introducción sobre cómo contribuir a React.

#### Momentos destacados del video: {#video-highlights}
- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - Construir y probar React localmente
- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - Crear y enviar *pull requests*
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - Organizar el código
- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - Registro de React en npm
- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - Adición de nuevas funcionalidades a React

Para obtener una descripción realista de lo que se _siente_ contribuir a React por primera vez, echa un vistazo a [esta entretenida charla de ReactNYC](https://www.youtube.com/watch?v=GWCcZ6fnpn4).

### Solicitud de comentarios (RFC) {#request-for-comments-rfc}

Muchos cambios, incluyendo correcciones de errores y mejoras en la documentación, se pueden implementar y revisar a través del flujo de trabajo normal de *pull request* de GitHub.

Sin embargo, algunos cambios son "sustanciales", y pedimos que se sometan a un proceso de diseño y produzcan un consenso entre el equipo central de React.

El proceso "RFC" (solicitud de comentarios) tiene como objetivo proporcionar una ruta coherente y controlada para que las nuevas características ingresen al proyecto. Puedes contribuir visitando el [repositorio rfcs](https://github.com/reactjs/rfcs).

### Licencia {#license}

Al contribuir a React, aceptas que tus contribuciones se otorgarán bajo su licencia MIT.

### ¿Qué hay luego? {#what-next}

Lee la [sección siguiente](/docs/codebase-overview.html) para saber cómo está organizada la base de código.
