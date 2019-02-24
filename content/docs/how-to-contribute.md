---
id: how-to-contribute
title: ¿Cómo Contribuir?
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

React es uno de los primeros proyectos de código abierto de Facebook que se encuentran bajo una fase de desarrollo activa y también se utiliza para entregar productos de sofware a todos en [facebook.com](https://www.facebook.com). Todavía estamos trabajando en los problemas para hacer que la contribución a este proyecto sea lo más fácil y transparente posible, pero aún no hemos llegado a ese punto. Esperamos que este documento haga que el proceso de contribución sea claro y responda algunas preguntas que pueda tener.

### [Codigo de Conducta](https://code.facebook.com/codeofconduct) {#code-of-conduct}

Facebook ha adoptado un Código de conducta que esperamos que los participantes del proyecto cumplan. Lea [el texto completo](https://code.facebook.com/codeofconduct) para que pueda comprender qué acciones serán o no toleradas.

### Desarrollo Abierto {#open-development}

Todo el trabajo en React sucede directamente en [GitHub](https://github.com/facebook/react). Tanto los miembros del equipo central como los colaboradores externos envían pull requests que pasan por el mismo proceso de revisión.

### Organizacion de Ramas {#branch-organization}

Haremos todo lo posible para mantener la [rama `maestra`](https://github.com/facebook/react/tree/master) en buen estado, con pruebas que pasen todo el tiempo. Pero para avanzar rápidamente, realizaremos cambios en la API con los que tu aplicación podría no ser compatible. Recomendamos que uses [la última versión estable de React](/downloads.html).

Si envías un pull request, hazlo contra la rama `master`. Mantenemos ramas estables para las versiones principales por separado, pero no aceptamos pull requests directamente a ellas. En su lugar, seleccionamos los cambios que no se rompen de la versión principal a la última versión estable.

### Versionamiento Semántico {#semantic-versioning}

React sigue [el versionamiento semántico](http://semver.org/). Lanzamos versiones de parches para correcciones de errores, versiones secundarias para nuevas funciones y versiones principales para cualquier cambio importante. Cuando hacemos cambios importantes, también introducimos advertencias de descontinuación en una versión menor para que nuestros usuarios conozcan los próximos cambios y migren su código de antemano.

Etiquetamos cada pull request con un rótulo que indica si el cambio debería ir en la siguiente version [parche](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-patch), [menor](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-minor), o [mayor](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-major). Lanzamos nuevas versiones de parches cada pocas semanas, versiones menores cada pocos meses y versiones mayores una o dos veces al año.

Cada cambio significativo se documenta en el [archivo de registro de cambios](https://github.com/facebook/react/blob/master/CHANGELOG.md).

### Bugs {#bugs}

#### Donde Encontrar Problemas Conocidos {#where-to-find-known-issues}

Estamos utilizando [GitHub Issues](https://github.com/facebook/react/issues) para nuestros bugs. Mantenemos una estrecha vigilancia sobre esto y tratamos de avisar cuando tenemos una solución interna en curso. Antes de reportar un nuevo problema, asegúrese de que su bug no haya sido reportado.

#### Reportando Nuevos Problemas {#reporting-new-issues}

La mejor manera de solucionar su bug es proporcionar un caso de prueba reducido. Esta [plantilla JSFiddle](https://jsfiddle.net/Luktwrdm/) es un gran punto de partida.

#### Bugs de Seguridad {#security-bugs}

Facebook tiene un [programa de recompensas](https://www.facebook.com/whitehat/) para la divulgación segura de errores de seguridad. Con esto en mente, por favor no envie problemas públicos. Siga el proceso descrito en esa página.

### Como entrar en contacto {#how-to-get-in-touch}

* IRC: [#reactjs en freenode](https://webchat.freenode.net/?channels=reactjs)
* Foro de discusión: [Discuss.reactjs.org](https://discuss.reactjs.org/)

También hay [una comunidad activa de usuarios de React en la plataforma de chat Discord](http://www.reactiflux.com/) en caso de que necesite ayuda con React.

### Proponiendo un Cambio {#proposing-a-change}

Si tiene la intención de cambiar la API pública o realizar cambios no triviales en la implementación, recomendamos [presentar el problema](https://github.com/facebook/react/issues/new). Esto nos permite llegar a un acuerdo sobre su propuesta antes que le ponga un gran esfuerzo.

Si solo está solucionando un error, está bien enviar un pull request de inmediato, pero le recomendamos que presente el problema que detalle que es lo que está solucionando. Esto es útil en caso de que no aceptemos esa solución en particular, pero de todas maneras queremos hacer el seguimiento del problema.

### Tu Primer Pull Request {#your-first-pull-request}

¿Trabajando en tu primer Pull Request? Puedes aprender como en esta serie de videos gratis:

**[Cómo contribuir a un proyecto de código abierto en GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**

Para ayudarlo a empaparse los pies y familiarizarse con nuestro proceso de contribución, tenemos una lista de **[Buenas Primeras Tareas](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** que contienen errores que tienen un alcance relativamente limitado. Este es un gran lugar para empezar.

Si decide solucionar un problema, asegúrese de revisar el hilo de comentarios en caso de que alguien ya esté trabajando en una solución. Si nadie está trabajando en ello en este momento, deje un comentario que indique que desea trabajar en él para que otras personas no dupliquen accidentalmente su esfuerzo.

Si alguien reclama un problema pero no hace un seguimiento por más de dos semanas, está bien que se haga cargo pero aún así debe dejar un comentario.

### Enviando un Pull Request {#sending-a-pull-request}

El equipo principal está monitoreando los Pull Requests. Revisaremos tu Pull Request y haremos un Merge, solicitaremos cambios o lo con una explicación. Para los cambios de API, es posible que tengamos que arreglar nuestros usos internos en Facebook.com, lo que podría causar algún retraso. Haremos nuestro mejor esfuerzo para proporcionar actualizaciones y comentarios durante todo el proceso.

**Antes de enviar un Pull Request**, asegúrese de que se haga lo siguiente:

1. Haga un Fork de [el repositorio](https://github.com/facebook/react) y cree su rama desde `master`.
2. Ejecute `yarn` en la raíz del repositorio.
3. Si ha corregido un error o ha agregado un código que debería probarse, ¡agregue pruebas!
4. Asegúrese de que el conjunto de pruebas pasa (`yarn test`). Consejo: `yarn test --watch TestName` es útil en el desarrollo.
5. Ejecute `yarn test-prod` para probar en el entorno de producción. Es compatible con las mismas opciones que `yarn test`.
6. Si necesita un depurador, ejecute `yarn debug-test --watch TestName`, abra `chrome://inspect` y presione "Inspeccionar".
7. Formatea tu código con [prettier](https://github.com/prettier/prettier) (`yarn prettier`).
8. Asegúrese de que su código corra (`yarn lint`). Consejo: `yarn linc` para verificar solo los archivos modificados.
9. Ejecute los controles de tipo [Flow](https://flowtype.org/) (`yarn flow`).
10. Si aún no lo has hecho, completa el CLA.

### Acuerdo de Licencia de Contribuidor (CLA) {#contributor-license-agreement-cla}

Para aceptar su pull request, necesitamos que envíe un CLA. Solo necesitas hacer esto una vez, así que si lo has hecho para otro proyecto de código abierto de Facebook, estás listo. Si está enviando un pull request por primera vez, háganos saber que ha completado el CLA y podemos verificarlo con su nombre de usuario de GitHub.

**[Completa tu CLA aquí.](https://code.facebook.com/cla)**

### Prerequisitos para Contribuir {#contribution-prerequisites}

* Tienes [Node](https://nodejs.org) instalado con v8.0.0+ y [Yarn](https://yarnpkg.com/en/) con v1.2.0+.
* Tienes `gcc` instalado o te sientes cómodo instalando un compilador si es necesario. Algunas de nuestras dependencias pueden requerir un paso de compilación. En OS X, las herramientas de línea de comandos de Xcode cubrirán esto. En Ubuntu, `apt-get install build-essential` instalará los paquetes necesarios. Comandos similares deberían funcionar en otras distribuciones de Linux. Windows requerirá algunos pasos adicionales, consulte las [instrucciones de instalación de `node-gyp`](https://github.com/nodejs/node-gyp#installation) para obtener más información.
* Usted está familiarizado con Git.

### Flujo de Trabajo de Desarrollo {#development-workflow}

Después de clonar React, ejecute `yarn` para obtener sus dependencias.
A continuación, puede ejecutar varios comandos:

* `yarn lint` comprueba el estilo del código.
* `yarn Linc` es como` Yarn Lint` pero más rápido porque solo verifica los archivos que difieren en tu rama.
* `yarn test` ejecuta el conjunto total de pruebas.
* `yarn test --Watch` ejecuta un observador de pruebas interactivo.
* `yarn test <pattern>` ejecuta pruebas con nombres de archivos que coincidan.
* `yarn test-prod` ejecuta pruebas en el entorno de producción. Es compatible con todas las mismas opciones que `yarn test`.
* `yarn debug-test` es igual que` yarn test` pero con un depurador. Abra `chrome://inspect` y presione "Inspeccionar".
* `yarn flow` ejecuta todas las comprobaciones de tipos [Flow](https://flowtype.org/).
* `yarn build` crea una carpeta` build` con todos los paquetes.
* `yarn build react/index,react-dom/index --type=UMD` crea las compilaciones UMD de solo React y ReactDOM.

Recomendamos ejecutar `yarn test` (o sus variaciones anteriores) para asegurarse de no introducir ninguna regresión mientras trabaja en su cambio. Sin embargo, puede ser útil probar su compilación de React en un proyecto real.

En primer lugar, ejecute `yarn build`. Esto producirá paquetes predefinidos en la carpeta `build`, así como también preparará paquetes npm dentro de `build/packages`.

La forma más fácil de probar tus cambios es ejecutar `yarn build react/index,react-dom/index --type=UMD` y luego abrir `fixtures/packaging/babel-standalone/dev.html`. Este archivo ya utiliza `react.development.js` de la carpeta` build` por lo que recogerá sus cambios.

Si desea probar los cambios en su proyecto React existente, puede copiar `build/dist/react.development.js`,`build/dist/react-dom.development.js`, o cualquier otro producto de compilación en su aplicación y usarlos en lugar de la versión estable. Si su proyecto usa React desde npm, puede eliminar `react` y` react-dom` en sus dependencias y usar `yarn link` para apuntarlos a su carpeta local `build`:

```sh
cd ~/ruta_a_tu_clon_react/build/node_modules/react
yarn link
cd ~/ruta_a_tu_clon_react/build/node_modules/ react-dom
yarn link
cd /ruta/a/tu/proyecto
yarn link react react-dom
```

Cada vez que ejecute `yarn build` en la carpeta React, las versiones actualizadas aparecerán en los` node_modules` de su proyecto. A continuación, puede reconstruir su proyecto para probar sus cambios.

Aún requerimos que su pull request contenga pruebas unitarias para cualquier funcionalidad nueva. De esta manera podemos asegurarnos de no romper tu código en el futuro.

### Style Guide {#style-guide}

Utilizamos un formateador de código automático llamado [Prettier](https://prettier.io/).
Ejecute `yarn prettier` después de realizar cualquier cambio en el código.

Luego, nuestra guía detectará la mayoría de los problemas que puedan existir en su código.
Puede verificar el estado de su estilo de código simplemente ejecutando `yarn linc`.

Sin embargo, todavía hay algunos estilos que la impresora no puede recoger. Si no está seguro de algo, consulte la [Guía de estilo de Airbnb](https://github.com/airbnb/javascript) que lo guiará en la dirección correcta.

### Video Introductorio {#introductory-video}

Es posible que le interese ver [este breve video](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26 minutos) que brinda una introducción sobre cómo contribuir a React.

#### Videos Destacados: {#video-highlights}
- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - Construir y probar React localmente
- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - Creando y enviando pull requests
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - Organizando el código
- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - Registro de React en npm
- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - Adición de nuevas funcionalidades a React

Para obtener una descripción realista de lo que _feels_ le gusta contribuir a Reaccionar por primera vez, echa un vistazo a [esta entretenida charla de ReactNYC](https://www.youtube.com/watch?v=GWCcZ6fnpn4).

### Solicitud de comentarios (RFC) {#request-for-comments-rfc}

Muchos cambios, incluyendo correcciones de errores y mejoras en la documentación, se pueden implementar y revisar a través del flujo de trabajo normal de pull request de GitHub.

Sin embargo, algunos cambios son "sustanciales", y pedimos que se sometan a un proceso de diseño y produzcan un consenso entre el equipo central de React.

El proceso "RFC" (solicitud de comentarios) tiene como objetivo proporcionar una ruta coherente y controlada para que las nuevas características ingresen al proyecto. Puede contribuir visitando el [repositorio de rfcs](https://github.com/reactjs/rfcs).

### Licencia {#license}

Al contribuir a React, acepta que sus contribuciones se otorgarán bajo su licencia MIT.

### Que hay luego? {#what-next}

Lea la [sección siguiente](/docs/codebase-overview.html) para saber cómo está organizado el código base.
