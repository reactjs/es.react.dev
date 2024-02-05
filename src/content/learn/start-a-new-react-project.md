---
title: Iniciar un nuevo proyecto de React
---

<Intro>

<<<<<<< HEAD
Si deseas crear una nueva aplicación o un nuevo sitio web completamente con React, te recomendamos que elijas uno de los frameworks hechos con React y más populares en la comunidad. Los frameworks brindan funciones que la mayoría de las aplicaciones y los sitios eventualmente necesitan, incluido el enrutamiento, la obtención de datos y la generación de HTML.
=======
If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community.
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

</Intro>


<<<<<<< HEAD
**Necesitarás instalar [Node.js](https://nodejs.org/es/) para el desarrollo local.** Puedes *también* optar por usar Node.js en producción, pero no tienes que hacerlo. Muchos frameworks de React permiten exportar a una carpeta HTML/CSS/JS estática.
=======
You can use React without a framework, however we’ve found that most apps and sites eventually build solutions to common problems such as code-splitting, routing, data fetching, and generating HTML. These problems are common to all UI libraries, not just React.
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

By starting with a framework, you can get started with React quickly, and avoid essentially building your own framework later.

<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If your app has unusual constraints not served well by these frameworks, or you prefer to solve these problems yourself, you can roll your own custom setup with React. Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.

</DeepDive>

## Frameworks React de nivel de producción {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

<<<<<<< HEAD
**[Next.js](https://nextjs.org/) es un framework de React muy completo.** Es versátil y te permite crear aplicaciones React de cualquier tamaño, desde un blog estático hasta una aplicación dinámica compleja. Para crear un nuevo proyecto Next.js, ejecuta en tu terminal:
=======
### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Si no tienes experiencia con Next.js, prueba el [curso introductorio de Next.js.](https://nextjs.org/learn)

El mantenimiento de Next.js está a cargo de [Vercel](https://vercel.com/). Puedes [implementar una aplicación Next.js](https://nextjs.org/docs/app/building-your-application/deploying) en cualquier alojamiento de Node.js, *serverless*, o en tu propio servidor. Next.js también admite una [exportación estática](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) que no requiere un servidor.

### Remix {/*remix*/}

**[Remix](https://remix.run/) es un framework de React muy completo con enrutamiento anidado.** Te permite dividir tu aplicación en partes anidadas que pueden cargar datos en paralelo y actualizarse en respuesta a las acciones del usuario. Para crear un nuevo proyecto Remix, ejecuta:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Si eres nuevo en Remix, mira el [tutorial del blog de Remix](https://remix.run/docs/en/main/tutorials/blog) (corto) y el [tutorial de la aplicación](https://remix.run/docs/en/main/tutorials/jokes) (largo).

Remix es mantenido por [Shopify](https://www.shopify.com/es). Cuando creas un proyecto Remix, debes [elegir su destino de implementación](https://remix.run/docs/en/main/guides/deployment). Puedes implementar una aplicación Remix en cualquier ambiente Node.js, alojamiento sin servidor usando o escribiendo un [adaptador](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) es un framework de React para sitios web rápidos respaldados por un CMS.** Su ecosistema es rico en complementos y su capa de datos GraphQL simplifica la integración de contenido, API y servicios en un sitio web. Para crear un nuevo proyecto de Gatsby, ejecuta:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Si eres nuevo en Gatsby, revisa el [tutorial de Gatsby.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby es mantenido por [Netlify](https://www.netlify.com/). Puedes [implementar un sitio estático de Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) en cualquier alojamiento estático. Si optas por usar funciones solo del servidor, asegúrate de que tu proveedor de alojamiento las admita para Gatsby.

### Expo (para aplicaciones nativas) {/*expo*/}

**[Expo](https://expo.dev/) es un framework de React que te permite crear aplicaciones web, iOS y Android universales con interfaces de usuario verdaderamente nativas.** Proporciona un SDK para [React Native](https://reactnative.dev/) que facilita el uso de las partes nativas. Para crear un nuevo proyecto Expo, ejecuta:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Si eres nuevo en Expo, revisa el [tutorial de Expo](https://docs.expo.dev/tutorial/introduction/).

Expo es mantenida por [Expo (empresa)](https://expo.dev/about). La creación de aplicaciones con Expo es gratuita y puede enviarlas a las tiendas de aplicaciones de Google y Apple sin restricciones. Expo también ofrece servicios en la nube de pago opcionales.

<<<<<<< HEAD
<DeepDive>

#### ¿Puedo usar React sin un framework? {/*can-i-use-react-without-a-framework*/}

Definitivamente puedes usar React sin un framework; así es como [usarías React para una parte de tu página.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Sin embargo, si estás creando una nueva aplicación o un sitio completamente con React, te recomendamos que uses un framework.**

Aquí esta el porqué.

Incluso si no necesitas enrutamiento u obtención de datos al principio, es probable que desees agregar algunas bibliotecas para ello. A medida que tu paquete de JavaScript crece con cada nueva función, es posible que debas descubrir cómo dividir el código para cada ruta individualmente. A medida que tus necesidades de obtención de datos se vuelven más complejas, es probable que encuentres cascadas de red servidor-cliente que hacen que tu aplicación se sienta muy lenta. A medida que tu audiencia incluye más usuarios con malas condiciones de red y dispositivos de gama baja, es posible que debas generar HTML a partir de tus componentes para mostrar el contenido antes, ya sea en el servidor o durante el tiempo de compilación. Cambiar tu configuración para ejecutar parte de su código en el servidor o durante la compilación puede ser muy complicado.

**Estos problemas no son específicos de React. Esta es la razón por la que Svelte tiene SvelteKit, Vue tiene Nuxt, etc.** Para resolver estos problemas por tu cuenta, deberás integrar tu paquete con tu enrutador y con tu biblioteca de obtención de datos. No es difícil hacer que funcione una configuración inicial, pero hay muchas sutilezas involucradas en hacer una aplicación que se cargue rápidamente incluso a medida que crece con el tiempo. Querrás enviar la cantidad mínima de código de la aplicación, pero hacerlo en una sola petición de ida y vuelta entre el cliente y el servidor, en paralelo con los datos necesarios para la página. Es probable que desees que la página sea interactiva incluso antes de que se ejecute tu código JavaScript, para admitir la mejora progresiva. Es posible que desees generar una carpeta de archivos HTML completamente estáticos para tus páginas de marketing que se pueden alojar en cualquier lugar y seguir funcionando con JavaScript deshabilitado. Desarrollar estas capacidades por tu cuenta requiere mucho trabajo.

**Los frameworks de React en esta página resuelven problemas como estos de forma predeterminada, sin trabajo adicional de tu parte.** Te permiten comenzar de manera muy sencilla y luego escalar tu aplicación según tus necesidades. Cada framework de React tiene una comunidad, por lo que es más fácil encontrar respuestas a las preguntas y actualizar las herramientas. Los frameworks también brindan estructura a tu código, ayudándote a ti y a otros a retener el contexto y las habilidades entre diferentes proyectos. Por el contrario, con una configuración personalizada es más fácil quedarte atascado en versiones de dependencia no admitidas, y esencialmente terminarás creando tu propio framework, aunque uno sin comunidad o ruta de actualización (y si es algo como los que hemos hecho en el pasado, diseñado al azar).

Si todavía no estás convencido, o si tu aplicación tiene restricciones inusuales que estos frameworks no cumplen bien y deseas implementar tu propia configuración personalizada, no podemos detenerte, ¡hazlo! Toma `react` y `react-dom` de npm, configura tu proceso de compilación personalizado con un paquete como [Vite](https://es.vitejs.dev/) o [Parcel](https://parceljs.org/) y agrega otras herramientas a medida que las necesites para el enrutamiento, la generación estática o la representación del lado del servidor, y más.
</DeepDive>

## Frameworks React de última generación {/*bleeding-edge-react-frameworks*/}
=======
## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

A medida que exploramos cómo continuar mejorando React, nos dimos cuenta de que integrar React más estrechamente con los frameworks (específicamente, con tecnologías de enrutamiento, agrupación y servidor) es nuestra mayor oportunidad para ayudar a los usuarios de React a crear mejores aplicaciones. El equipo de Next.js acordó colaborar con nosotros en la investigación, el desarrollo, la integración y la prueba de funciones de React de última generación independientes del framework como [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Estas funcionalidades están cada día más cerca de estar listas para producción, y hemos mantenido conversaciones con otros desarrolladores de paquetes y frameworks para integrarlas. Esperamos que en uno o dos años todos los frameworks que aparecen en esta página sean totalmente compatibles con estas funciones. (Si eres autor de un framework y estás interesado en colaborar con nosotros para experimentar con estas funciones, ¡háznoslo saber!).

### Next.js (App Router) {/*nextjs-app-router*/}

**[El App Router de Next.js](https://nextjs.org/docs) es un rediseño de las API de Next.js con el objetivo de cumplir con la visión de arquitectura de pila completa (_full-stack_) del equipo de React.** Te permite obtener datos en componentes asíncronos que se ejecutan en el servidor o incluso durante la compilación.

Next.js es mantenido por [Vercel](https://vercel.com/). Puedes [implementar una aplicación Next.js](https://nextjs.org/docs/app/building-your-application/deploying) en cualquier alojamiento Node.js o sin servidor, o en tu propio servidor. Next.js también admite una [exportación estática](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) que no requiere un servidor.

<DeepDive>

#### ¿Qué características conforman la visión de la arquitectura completa del equipo de React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

El paquete App Router de Next.js implementa completamente la [especificación oficial de los componentes del servidor React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Esto te permite combinar componentes compilados, solo de servidor e interactivos en un solo árbol de React.

Por ejemplo, puedes escribir un componente React solo para el servidor como una función "asincrónica" que es leída desde una base de datos o desde un archivo. Luego puedes pasar datos desde allí a tus componentes interactivos:

```js
// Este componente se ejecuta *solo* en el servidor (o durante la compilación).
async function Talks({ confId }) {
  // 1. Estás en el servidor, así que puedes hablar con tu capa de datos. No se requiere punto final de API.
  const talks = await db.Talks.findAll({ confId });

  // 2. Agrega cualquier cantidad de lógica de representación. No harás que tu paquete de JavaScript sea más grande.
  const videos = talks.map(talk => talk.video);

  // 3. Pasa los datos a los componentes que se ejecutarán en el navegador.
  return <SearchableVideoList videos={videos} />;
}
```

El App Router de Next.js también integra [obtención de datos con Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Esto te permite especificar un estado de carga (como un esqueleto) para diferentes partes de tu interfaz de usuario directamente en tu árbol React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components y Suspense son funciones de React en lugar de funciones de Next.js. Sin embargo, adoptarlos a nivel del framework requiere compromiso y un trabajo de implementación no trivial. Por el momento, el App Router de Next.js es la implementación más completa. El equipo de React está trabajando con los desarrolladores de paquetes para que estas características sean más fáciles de implementar en la próxima generación de frameworks.

</DeepDive>
