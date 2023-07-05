---
title: Iniciar un nuevo proyecto de React
---

<Intro>

Si deseas crear una nueva aplicación o un nuevo sitio web completamente con React, te recomendamos que elijas uno de los frameworks hechos con React y más populares en la comunidad. Los frameworks brindan funciones que la mayoría de las aplicaciones y los sitios eventualmente necesitan, incluido el enrutamiento, la obtención de datos y la generación de HTML.

</Intro>

<Note>

**Necesitarás instalar [Node.js](https://nodejs.org/es/) para el desarrollo local.** Puedes *también* optar por usar Node.js en producción, pero no tienes que hacerlo. Muchos frameworks de React permiten exportar a una carpeta HTML/CSS/JS estática.

</Note>

## Frameworks React de nivel de producción {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) es un framework de React muy completo.** Es versátil y te permite crear aplicaciones React de cualquier tamaño, desde un blog estático hasta una aplicación dinámica compleja. Para crear un nuevo proyecto Next.js, ejecuta en tu terminal:

<TerminalBlock>
npx create-next-app
</TerminalBlock>

Si eres nuevo en Next.js, mira el [tutorial de Next.js.](https://nextjs.org/learn/foundations/about-nextjs)

Next.js es mantenido por [Vercel](https://vercel.com/). Puedes [implementar una aplicación Next.js](https://nextjs.org/docs/deployment) en cualquier alojamiento Node.js, sin servidor, o en tu propio servidor. [Las aplicaciones Next.js estáticas](https://nextjs.org/docs/advanced-features/static-html-export) se pueden implementar en cualquier alojamiento estático.

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

<DeepDive>

#### ¿Puedo usar React sin un framework? {/*can-i-use-react-without-a-framework*/}

Definitivamente puedes usar React sin un framework; así es como [usarías React para una parte de tu página.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Sin embargo, si estás creando una nueva aplicación o un sitio completamente con React, te recomendamos que uses un framework.**

Aquí esta el porqué.

Incluso si no necesitas enrutamiento u obtención de datos al principio, es probable que desees agregar algunas bibliotecas para ello. A medida que tu paquete de JavaScript crece con cada nueva función, es posible que debas descubrir cómo dividir el código para cada ruta individualmente. A medida que tus necesidades de obtención de datos se vuelven más complejas, es probable que encuentres cascadas de red servidor-cliente que hacen que tu aplicación se sienta muy lenta. A medida que tu audiencia incluye más usuarios con malas condiciones de red y dispositivos de gama baja, es posible que debas generar HTML a partir de tus componentes para mostrar el contenido antes, ya sea en el servidor o durante el tiempo de compilación. Cambiar tu configuración para ejecutar parte de su código en el servidor o durante la compilación puede ser muy complicado.

**Estos problemas no son específicos de React. Esta es la razón por la que Svelte tiene SvelteKit, Vue tiene Nuxt, etc.** Para resolver estos problemas por tu cuenta, deberás integrar tu paquete con tu enrutador y con tu biblioteca de obtención de datos. No es difícil hacer que funcione una configuración inicial, pero hay muchas sutilezas involucradas en hacer una aplicación que se cargue rápidamente incluso a medida que crece con el tiempo. Querrás enviar la cantidad mínima de código de la aplicación, pero hacerlo en una sola petición de ida y vuelta entre el cliente y el servidor, en paralelo con los datos necesarios para la página. Es probable que desees que la página sea interactiva incluso antes de que se ejecute tu código JavaScript, para admitir la mejora progresiva. Es posible que desees generar una carpeta de archivos HTML completamente estáticos para tus páginas de marketing que se pueden alojar en cualquier lugar y seguir funcionando con JavaScript deshabilitado. Desarrollar estas capacidades por tu cuenta requiere mucho trabajo.

**Los frameworks de React en esta página resuelven problemas como estos de forma predeterminada, sin trabajo adicional de tu parte.** Te permiten comenzar de manera muy sencilla y luego escalar tu aplicación según tus necesidades. Cada framework de React tiene una comunidad, por lo que es más fácil encontrar respuestas a las preguntas y actualizar las herramientas. Los frameworks también brindan estructura a tu código, ayudándote a ti y a otros a retener el contexto y las habilidades entre diferentes proyectos. Por el contrario, con una configuración personalizada es más fácil quedarte atascado en versiones de dependencia no admitidas, y esencialmente terminarás creando tu propio framework, aunque uno sin comunidad o ruta de actualización (y si es algo como los que hemos hecho en el pasado, diseñado al azar).

Si todavía no estás convencido, o si tu aplicación tiene restricciones inusuales que estos frameworks no cumplen bien y deseas implementar tu propia configuración personalizada, no podemos detenerte, ¡hazlo! Toma `react` y `react-dom` de npm, configura tu proceso de compilación personalizado con un paquete como [Vite](https://es.vitejs.dev/) o [Parcel](https://parceljs.org/) y agregua otras herramientas a medida que las necesites para el enrutamiento, la generación estática o la representación del lado del servidor, y más.
</DeepDive>

## Frameworks React de última generación {/*bleeding-edge-react-frameworks*/}

A medida que exploramos cómo continuar mejorando React, nos dimos cuenta de que integrar React más estrechamente con los frameworks (específicamente, con tecnologías de enrutamiento, agrupación y servidor) es nuestra mayor oportunidad para ayudar a los usuarios de React a crear mejores aplicaciones. El equipo de Next.js acordó colaborar con nosotros en la investigación, el desarrollo, la integración y la prueba de funciones de React de última generación independientes del framework como [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Estas funcionalidades están cada día más cerca de estar listas para producción, y hemos mantenido conversaciones con otros desarrolladores de paquetes y frameworks para integrarlas. Esperamos que en uno o dos años todos los frameworks que aparecen en esta página sean totalmente compatibles con estas funciones. (Si eres autor de un framework y estás interesado en colaborar con nosotros para experimentar con estas funciones, ¡háznoslo saber!).

### Next.js (Enrutador de la aplicación) {/*nextjs-app-router*/}

**[El enrutador de aplicaciones de Next.js](https://beta.nextjs.org/docs/getting-started) es un rediseño de la API de Next.js con el objetivo de cumplir con la visión de arquitectura de pila completa del equipo de React.** te permite obtener datos en componentes asincrónicos que se ejecutan en el servidor o incluso durante la compilación.

Next.js es mantenido por [Vercel](https://vercel.com/). Puedes [implementar una aplicación Next.js](https://nextjs.org/docs/deployment) en cualquier alojamiento Node.js, sin servidor, o en tu propio servidor. Next.js también permite [exportar archivos estáticos](https://beta.nextjs.org/docs/configuring/static-export) que no requiere un servidor.
<Pitfall>

El enrutador de aplicaciones de Next.js está **actualmente en versión beta y aún no se recomienda para producción** (a partir de marzo de 2023). Para experimentar con él en un proyecto Next.js existente, [sigue esta guía de migración incremental](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>

<DeepDive>

#### ¿Qué características conforman la visión de la arquitectura completa del equipo de React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

El paquete del enrutador de aplicaciones de Next.js implementa completamente la [especificación oficial de los componentes del servidor React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Esto te permite combinar componentes compilados, solo de servidor e interactivos en un solo árbol de React.

Por ejemplo, puedes escribir un componente React solo para el servidor como una función "asincrónica" que es leida desde una base de datos o desde un archivo. Luego puedes pasar datos desde allí a tus componentes interactivos:

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

El enrutador de aplicaciones de Next.js también integra [obtención de datos con Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Esto te permite especificar un estado de carga (como un esqueleto) para diferentes partes de tu interfaz de usuario directamente en tu árbol React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components y Suspense son funciones de React en lugar de funciones de Next.js. Sin embargo, adoptarlos a nivel del framework requiere compromiso y un trabajo de implementación no trivial. Por el momento, el enrutador de aplicaciones Next.js es la implementación más completa. El equipo de React está trabajando con los desarrolladores de paquetes para que estas características sean más fáciles de implementar en la próxima generación de frameworks.

</DeepDive>
