---
title: Crear una aplicación de React
---

<Intro>

Si quieres crear una nueva aplicación o sitio web con React, te recomendamos comenzar con un framework.

</Intro>

Si tu aplicación tiene restricciones que no son bien atendidas por los frameworks existentes, prefieres construir tu propio framework, o simplemente quieres aprender lo básico de una aplicación de React, puedes [crear una aplicación de React desde cero](/learn/build-a-react-app-from-scratch).

## Frameworks full-stack {/*full-stack-frameworks*/}

Estos frameworks recomendados soportan todas las funcionalidades que necesitas para desplegar y escalar tu aplicación en producción. Han integrado las últimas funcionalidades de React y aprovechan la arquitectura de React.

<Note>

#### Los frameworks full-stack no requieren un servidor. {/*react-frameworks-do-not-require-a-server*/}

Todos los frameworks en esta página soportan renderizado del lado del cliente ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), aplicaciones de una sola página ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)) y generación de sitios estáticos ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). Estas aplicaciones pueden desplegarse en un [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) o servicio de hosting estático sin un servidor. Además, estos frameworks te permiten añadir renderizado del lado del servidor en base a cada ruta, cuando tenga sentido para tu caso de uso.

Esto te permite comenzar con una aplicación solo del lado del cliente, y si tus necesidades cambian más adelante, puedes optar por usar funcionalidades del servidor en rutas individuales sin reescribir tu aplicación. Consulta la documentación de tu framework para configurar la estrategia de renderizado.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[El App Router de Next.js](https://nextjs.org/docs) es un framework de React que aprovecha al máximo la arquitectura de React para habilitar aplicaciones React full-stack.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js es mantenido por [Vercel](https://vercel.com/). Puedes [desplegar una aplicación de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) en cualquier proveedor de hosting que soporte Node.js o contenedores Docker, o en tu propio servidor. Next.js también soporta [exportación estática](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) que no requiere un servidor.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) es la biblioteca de enrutamiento más popular para React y puede combinarse con Vite para crear un framework React full-stack**. Enfatiza las APIs web estándar y tiene varias [plantillas listas para desplegar](https://github.com/remix-run/react-router-templates) para varios entornos de ejecución y plataformas de JavaScript.

Para crear un nuevo proyecto con el framework React Router, ejecuta:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router es mantenido por [Shopify](https://www.shopify.com).

### Expo (para aplicaciones nativas) {/*expo*/}

**[Expo](https://expo.dev/) es un framework de React que te permite crear aplicaciones universales para Android, iOS y web con UIs verdaderamente nativas.** Proporciona un SDK para [React Native](https://reactnative.dev/) que hace que las partes nativas sean más fáciles de usar. Para crear un nuevo proyecto de Expo, ejecuta:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Si eres nuevo en Expo, consulta el [tutorial de Expo](https://docs.expo.dev/tutorial/introduction/).

Expo es mantenido por [Expo (la empresa)](https://expo.dev/about). Crear aplicaciones con Expo es gratuito y puedes enviarlas a las tiendas de aplicaciones de Google y Apple sin restricciones. Expo además proporciona servicios en la nube de pago opcionales.


## Otros frameworks {/*other-frameworks*/}

Hay otros frameworks emergentes que están trabajando hacia nuestra visión de React full-stack:

- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start es un framework React full-stack potenciado por TanStack Router. Proporciona SSR de documento completo, streaming, funciones del servidor, empaquetado y más usando herramientas como Nitro y Vite.
- [RedwoodJS](https://redwoodjs.com/): Redwood es un framework React full-stack con muchos paquetes y configuraciones preinstaladas que facilitan la creación de aplicaciones web full-stack.

<DeepDive>

#### ¿Qué funcionalidades componen la visión de arquitectura full-stack del equipo de React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

El empaquetador del App Router de Next.js implementa completamente la [especificación oficial de React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Esto te permite mezclar componentes de tiempo de compilación, solo del servidor e interactivos en un único árbol de React.

Por ejemplo, puedes escribir un componente React que solo se ejecuta en el servidor como una función `async` que lee de una base de datos o de un archivo. Luego puedes pasar los datos hacia abajo a tus componentes interactivos:

```js
// Este componente se ejecuta *solo* en el servidor (o durante la compilación).
async function Talks({ confId }) {
  // 1. Estás en el servidor, así que puedes comunicarte con tu capa de datos. No se necesita endpoint de API.
  const talks = await db.Talks.findAll({ confId });

  // 2. Añade cualquier cantidad de lógica de renderizado. No hará más grande tu paquete de JavaScript.
  const videos = talks.map(talk => talk.video);

  // 3. Pasa los datos hacia abajo a los componentes que se ejecutarán en el navegador.
  return <SearchableVideoList videos={videos} />;
}
```

El App Router de Next.js también integra [obtención de datos con Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Esto te permite especificar un estado de carga (como un esqueleto de marcador de posición) para diferentes partes de tu interfaz de usuario directamente en tu árbol de React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components y Suspense son funcionalidades de React en lugar de funcionalidades de Next.js. Sin embargo, adoptarlas a nivel de framework requiere aceptación y un trabajo de implementación no trivial. En este momento, el App Router de Next.js es la implementación más completa. El equipo de React está trabajando con desarrolladores de empaquetadores para hacer que estas funcionalidades sean más fáciles de implementar en la próxima generación de frameworks.

</DeepDive>

## Empezar desde cero {/*start-from-scratch*/}

Si tu aplicación tiene restricciones que no son bien atendidas por los frameworks existentes, prefieres construir tu propio framework, o simplemente quieres aprender lo básico de una aplicación de React, hay otras opciones disponibles para iniciar un proyecto de React desde cero.

Empezar desde cero te da más flexibilidad, pero requiere que tomes decisiones sobre qué herramientas usar para el enrutamiento, la obtención de datos y otros patrones de uso comunes. Es muy parecido a construir tu propio framework, en lugar de usar uno que ya existe. Los [frameworks que recomendamos](#full-stack-frameworks) tienen soluciones integradas para estos problemas.

Si quieres construir tus propias soluciones, consulta nuestra guía para [crear una aplicación de React desde cero](/learn/build-a-react-app-from-scratch) para instrucciones sobre cómo configurar un nuevo proyecto de React comenzando con una herramienta de compilación como [Vite](https://vite.dev/), [Parcel](https://parceljs.org/) o [RSbuild](https://rsbuild.dev/).

-----

_Si eres autor de un framework interesado en ser incluido en esta página, [por favor haznos saber](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
