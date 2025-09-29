---
title: Crear una aplicación React desde cero
---

<Intro>

Si tu aplicación tiene limitaciones que no están bien cubiertas por los frameworks existentes, prefieres crear tu propio framework o simplemente quieres aprender los conceptos básicos de una aplicación React, puedes crear una aplicación React desde cero.

</Intro>

<DeepDive>

#### Considere usar un framework {/*consider-using-a-framework*/}

Comenzar desde cero es una manera sencilla de iniciar con React, pero una desventaja importante a tener en cuenta es que tomar esta ruta es a menudo lo mismo que montar tu propio framework improvisado. Conforme tus necesidades evolucionen, podrías tener que solucionar problemas más similares a los de un framework, para los cuales nuestros frameworks recomendados ya cuentan con soluciones bien desarrolladas y respaldadas.

Por ejemplo, si en el futuro tu aplicación necesita soporte para server-side rendering (SSR), static site generation (SSG), y/o React Server Components (RSC), tendrás que implementarlos por tu cuenta. Del mismo modo, las futuras características de React que requieran integración a nivel de framework tendrán que ser implementadas por ti mismo si quieres utilizarlas.

Nuestros frameworks recomendados también le ayudan a crear aplicaciones con mejor rendimiento. Por ejemplo, reducir o eliminar las cascadas de peticiones de red mejora la experiencia del usuario. Puede que esto no sea una gran prioridad cuando estás construyendo un proyecto de juguete, pero si tu aplicación gana usuarios puede que quieras mejorar su rendimiento.

Seguir esta ruta también hace que sea más difícil obtener soporte, ya que la forma en que desarrolle el enrutamiento, la obtención de datos y otras funciones será específica para su situación. Solo debe elegir esta opción si se siente cómodo abordando estos problemas por su cuenta o si está seguro de que nunca necesitará estas funciones.

Para obtener una lista de frameworks recomendados, consulte [Crear una aplicación React](/learn/creating-a-react-app).

</DeepDive>


## Paso 1: Instalar una herramienta de compilación {/*step-1-install-a-build-tool*/}

El primer paso es instalar una herramienta de compilación como `vite`, `parcel` o `rsbuild`. Estas herramientas permiten empaquetar y ejecutar el código fuente, proporcionan un servidor de desarrollo local y un comando de compilación para desplegar tu aplicación en un servidor de producción.

### Vite {/*vite*/}

[Vite](https://es.vite.dev/) es una herramienta de compilación cuyo objetivo es proporcionar una experiencia de desarrollo más rápida y sencilla para los proyectos web modernos.

<TerminalBlock>
{`npm create vite@latest my-app -- --template react`}
</TerminalBlock>

Vite sigue una filosofía bien definida y viene con configuraciones predeterminadas sensatas listas para usar. Vite tiene un rico ecosistema de plugins para dar soporte a Fast Refresh (actualización rápida), JSX, Babel/SWC y otras características comunes. Consulta el [plugin React](https://es.vite.dev/plugins/#vite-plugin-react) de Vite o el [plugin React SWC](https://es.vite.dev/plugins/#vite-plugin-react-swc) y el [proyecto de ejemplo de React SSR](https://es.vite.dev/guide/ssr#proyectos-de-ejemplo) para empezar.

Vite ya se está utilizando como herramienta de compilación en uno de nuestros [frameworks recomendados](/learn/creating-a-react-app): [React Router](https://reactrouter.com/start/framework/installation).

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) combina una excelente experiencia de desarrollo sin configuración inicial con una arquitectura escalable que puede llevar tu proyecto desde sus inicios hasta aplicaciones masivas en producción.

<TerminalBlock>
{`npm install --save-dev parcel`}
</TerminalBlock>

Parcel es compatible de fábrica con Fast Refresh (actualización rápida), JSX, TypeScript, Flow y estilos. Consulta la [guía React de Parcel](https://parceljs.org/recipes/react/#getting-started) para empezar.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) es una herramienta de desarrollo basada en Rspack que ofrece una experiencia de desarrollo fluida para aplicaciones React. Incluye valores predeterminados cuidadosamente ajustados y optimizaciones de rendimiento listas para usar.

<TerminalBlock>
{`npx create-rsbuild --template react`}
</TerminalBlock>

Rsbuild incluye compatibilidad integrada para funcionalidades de React como Fast Refresh, JSX, TypeScript y estilos. Consulte la [guía React de Rsbuild](https://rsbuild.dev/guide/framework/react) para empezar.

<Note>

#### Metro para React Native {/*react-native*/}

Si estás empezando desde cero con React Native tendrás que utilizar [Metro](https://metrobundler.dev/), el bundler JavaScript para React Native. Metro soporta bundling para plataformas como iOS y Android, pero carece de muchas características en comparación con las herramientas aquí mencionadas. Recomendamos empezar con Vite, Parcel o Rsbuild a menos que tu proyecto requiera soporte para React Native.

</Note>

## Paso 2: Crear patrones comunes de aplicación {/*step-2-build-common-application-patterns*/}

Las herramientas de compilación enumeradas anteriormente comienzan con una aplicación de una sola página (SPA) solo para el cliente, pero no incluyen ninguna otra solución para funciones comunes como el enrutamiento, la obtención de datos o el diseño.

El ecosistema React incluye muchas herramientas para estos problemas. Hemos enumerado algunas que son ampliamente utilizadas como punto de partida, pero siéntete libre de elegir otras herramientas si esas funcionan mejor para ti.

### Enrutamiento {/*routing*/}

El enrutamiento determina qué contenido o páginas mostrar cuando un usuario visita una URL concreta. Necesitas configurar un enrutador para asignar URLs a diferentes partes de tu aplicación. También tendrás que manejar rutas anidadas, parámetros de ruta y parámetros de consulta.  Los enrutadores pueden configurarse dentro del código o definirse basándose en las estructuras de carpetas y archivos de los componentes.

Los enrutadores son una parte esencial de las aplicaciones modernas y suelen integrarse con la obtención de datos (incluida la obtención previa de datos de toda una página para una carga más rápida), la división de código (para minimizar el tamaño de los paquetes de cliente) y los enfoques de renderización de páginas (para decidir cómo se genera cada página).

Sugerimos utilizar:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### Obtención de datos {/*data-fetching*/}

La obtención de datos de un servidor u otra fuente de datos es una parte clave de la mayoría de las aplicaciones. Hacerlo correctamente requiere manejar estados de carga, estados de error y almacenar en caché los datos obtenidos, lo que puede ser complejo.

Las bibliotecas de obtención de datos creadas específicamente para este propósito hacen el trabajo duro de obtener y almacenar en caché los datos por ti, permitiéndote centrarte en qué datos necesita tu aplicación y cómo mostrarlos.  Estas bibliotecas suelen utilizarse directamente en los componentes, pero también pueden integrarse en cargadores de rutas para acelerar la obtención previa y mejorar el rendimiento, así como en la renderización del servidor.

Tenga en cuenta que la obtención de datos directamente en los componentes puede ralentizar los tiempos de carga debido a las caídas de peticiones de red, por lo que le recomendamos que, en la medida de lo posible, prefiera la obtención de datos en cargadores de enrutador o en el servidor.  Esto permite que los datos de una página se obtengan todos a la vez mientras se muestra la página.

Si estás obteniendo datos de la mayoría de backends o APIs de estilo REST, sugerimos usar:

- [React Query](https://react-query.tanstack.com/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

Si estás obteniendo datos de una API de GraphQL, sugerimos usar:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### División de código {/*code-splitting*/}

La división del código es el proceso de dividir una aplicación en paquetes más pequeños que puedan cargarse bajo demanda. El tamaño del código de una aplicación aumenta con cada nueva función y dependencia adicional. La carga de las aplicaciones puede volverse lenta porque todo el código de la aplicación debe enviarse antes de que pueda utilizarse. El almacenamiento en caché, la reducción de funciones/dependencias y el traslado de parte del código para que se ejecute en el servidor pueden ayudar a mitigar la lentitud de carga, pero son soluciones incompletas que pueden sacrificar la funcionalidad si se utilizan en exceso.

De manera similar, si confías en que las aplicaciones usen tu framework para dividir el código, podrías encontrarte con situaciones en las que la carga sea más lenta que si no se dividiera el código. Por ejemplo, la [carga diferida](/reference/react/lazy) de un gráfico retrasa el envío del código necesario para representarlo, dividiendo el código del gráfico del resto de la aplicación. [Parcel admite la división de código con React.lazy](https://parceljs.org/recipes/react/#code-splitting). Sin embargo, si el gráfico carga sus datos *después* de que se haya renderizado inicialmente, estará esperando dos veces. Esto es una cascada: en lugar de obtener los datos para el gráfico y enviar el código para renderizarlo simultáneamente, debe esperar a que cada paso se complete uno tras otro.

La división del código por rutas, cuando se integra con el empaquetamiento y la obtención de datos, puede reducir el tiempo de carga inicial de su aplicación y el tiempo que tarda en renderizarse el contenido visible más grande de la aplicación. ([Largest Contentful Paint](https://web.dev/articles/lcp?hl=es-419)).

<<<<<<< HEAD
Para obtener instrucciones sobre cómo dividir el código, consulte la documentación de su herramienta de compilación:
- [Optimizaciones de compilación](https://es.vite.dev/guide/features.html#optimizaciones-de-compilacion)
- [División de código con Parcel](https://parceljs.org/features/code-splitting/)
- [División de código con Rsbuild](https://rsbuild.dev/guide/optimization/code-splitting)
=======
For code-splitting instructions, see your build tool docs:
- [Vite build optimizations](https://vite.dev/guide/features.html#build-optimizations)
- [Parcel code splitting](https://parceljs.org/features/code-splitting/)
- [Rsbuild code splitting](https://rsbuild.dev/guide/optimization/code-splitting)
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

### Mejorar el rendimiento de las aplicaciones {/*improving-application-performance*/}

<<<<<<< HEAD
Dado que la herramienta de compilación que elija sólo admite aplicaciones de una sola página (SPA), tendrá que implementar otras [patrones de renderizado](https://www.patterns.dev/vanilla/rendering-patterns) como server-side rendering (SSR), static site generation (SSG), y/o React Server Components (RSC). Aunque al principio no necesites estas funciones, en el futuro puede que haya algunas rutas que se beneficien de SSR, SSG o RSC.
=======
Since the build tool you select only supports single page apps (SPAs), you'll need to implement other [rendering patterns](https://www.patterns.dev/vanilla/rendering-patterns) like server-side rendering (SSR), static site generation (SSG), and/or React Server Components (RSC). Even if you don't need these features at first, in the future there may be some routes that would benefit SSR, SSG or RSC.
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

* **Single-page apps (SPA)** cargan una única página HTML y la actualizan dinámicamente a medida que el usuario interactúa con la aplicación. Las SPA son más fáciles de usar, pero pueden tener tiempos de carga iniciales más lentos. Las SPA son la arquitectura por defecto de la mayoría de las herramientas de compilación.

* **Streaming Server-side rendering (SSR)** renderiza una página en el servidor y la envía completamente renderizada al cliente. La SSR puede mejorar el rendimiento, pero puede ser más compleja de configurar y mantener que una aplicación de una sola página. Con la adición de streaming, SSR puede ser muy complejo de configurar y mantener. Consulte la [guía de SSR de Vite]( https://es.vite.dev/guide/ssr).

* **Static site generation (SSG)** genera archivos HTML estáticos para tu aplicación en tiempo de compilación. SSG puede mejorar el rendimiento, pero puede ser más complejo de configurar y mantener que el renderizado del lado del servidor. Consulte la [guía de SSG de Vite](https://es.vite.dev/guide/ssr#renderizado-previo-ssg).

* **React Server Components (RSC)** Permite mezclar componentes de tiempo de compilación, solo de servidor e interactivos dentro de un único árbol de React. RSC puede mejorar el rendimiento, pero a día de hoy requiere una gran experiencia para su configuración y mantenimiento. Consulte los [ejemplos de RSC de Parcel](https://github.com/parcel-bundler/rsc-examples).

Tus estrategias de renderizado necesitan integrarse con tu router para que las aplicaciones construidas con tu framework puedan elegir la estrategia de renderizado a nivel de ruta. Esto permitirá diferentes estrategias de renderizado sin tener que reescribir toda la aplicación. Por ejemplo, la página de destino de tu aplicación podría beneficiarse de la generación estática (SSG), mientras que una página con un feed de contenido podría funcionar mejor con la renderización del lado del servidor.

Utilizar la estrategia de renderización adecuada para las rutas correctas puede reducir el tiempo que tarda en cargarse el primer byte de contenido ([Time to First Byte](https://web.dev/articles/ttfb?hl=es-419)), el primer contenido que se muestra ([First Contentful Paint](https://web.dev/articles/fcp?hl=es-419)), y el mayor contenido visible de la aplicación para renderizar ([Largest Contentful Paint](https://web.dev/articles/lcp?hl=es-419)).

### Y más... {/*and-more*/}

Estos son sólo algunos ejemplos de las características que una nueva aplicación tendrá que tener en cuenta cuando se construya desde cero. Muchas de las limitaciones con las que te encontrarás pueden ser difíciles de resolver, ya que cada problema está interconectado con los demás y puede requerir profundos conocimientos en áreas problemáticas con las que quizá no estés familiarizado.

Si no quieres resolver estos problemas por tu cuenta, puedes [empezar con un framework](/learn/creating-a-react-app) que ofrece estas funciones desde el primer momento.
