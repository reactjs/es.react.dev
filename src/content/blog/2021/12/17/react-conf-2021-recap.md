---
<<<<<<< HEAD
title: "Resumen de React Conf 2021"
=======
title: "React Conf 2021 Recap"
author: Jesslyn Tannady and Rick Hanlon
date: 2021/12/17
description: Last week we hosted our 6th React Conf. In previous years, we've used the React Conf stage to deliver industry changing announcements such as React Native and React Hooks. This year, we shared our multi-platform vision for React, starting with the release of React 18 and gradual adoption of concurrent features.
>>>>>>> 556063bdce0ed00f29824bc628f79dac0a4be9f4
---

17 de diciembre de 2021 por [Jesslyn Tannady](https://twitter.com/jtannady) y [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

La semana pasada organizamos nuestra 6ª React Conf. En años anteriores, usamos el escenario React Conf para ofrecer anuncios que cambiaron la industria, como [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) y [_React Hooks_](https://es.reactjs.org/docs/hooks-intro.html). Este año, compartimos nuestra visión multiplataforma para React, comenzando con el lanzamiento de React 18 y la adopción gradual de funcionalidades concurrentes.

</Intro>

---

Esta fue la primera vez que React Conf se presentó en línea y se transmitió de forma gratuita, traducida a 8 idiomas diferentes. Participantes de todo el mundo se unieron a nuestra conferencia Discord y al evento de repetición para la accesibilidad en todas las zonas horarias. Más de 50 000 personas se registraron, con más de 60 000 visualizaciones de 19 charlas y 5000 participantes en Discord en ambos eventos.

Todas las charlas están [disponibles para transmitir en línea](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

Aquí hay un resumen de lo que se compartió en el escenario:

## React 18 y funcionalidades concurrentes {/*react-18-and-concurrent-features*/}

En la conferencia, compartimos nuestra visión del futuro de React a partir de React 18.

React 18 añade el tan esperado renderizador concurrente y actualizaciones a Suspense sin ningún cambio importante. Las aplicaciones pueden actualizarse a React 18 y empezar a adoptar gradualmente funcionalidades concurrentes con el mismo esfuerzo que cualquier otra versión importante.

**Esto significa que no hay modo concurrente, solo funcionalidades concurrentes.**

En la conferencia también compartimos nuestra visión de Suspense, Server Components, los nuevos grupos de trabajo de React y nuestra visión a largo plazo de React Native para múltiples plataformas.

Vea la conferencia completa de [Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), y [Rick Hanlon](https://twitter.com/rickhanlonii) aquí:

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## React 18 para desarrolladores de aplicaciones {/*react-18-for-application-developers*/}

En la conferencia también anunciamos que ya se puede probar React 18 RC. A la espera de nuevos comentarios, esta es la versión exacta de React que publicaremos como estable a principios del próximo año.

Para probar React 18 RC, actualiza tus dependencias:

```bash
npm install react@rc react-dom@rc
```

y cambiar a la nueva `createRoot` API:

```js
// Antes
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// Después
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

Para ver una demostración de la actualización a React 18, consulte la charla de [Shruti Kapoor](https://twitter.com/shrutikapoor08) aquí:

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Renderización de servidores de streaming con Suspense {/*streaming-server-rendering-with-suspense*/}

React 18 también incluye mejoras en el rendimiento de la renderización del lado del servidor mediante Suspense.

La renderización de servidor de streaming permite generar HTML a partir de componentes React en el servidor, y transmitir ese HTML a los usuarios. En React 18, puedes utilizar `Suspense` para dividir tu aplicación en unidades independientes más pequeñas que pueden ser transmitidas independientemente unas de otras sin bloquear el resto de la aplicación. Esto significa que los usuarios verán tu contenido antes y podrán empezar a interactuar con él mucho más rápido.

Si quieres profundizar en el tema, consulta la charla de [Shaundai Person](https://twitter.com/shaundai) aquí:

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## El primer grupo de trabajo de React {/*the-first-react-working-group*/}

Para React 18, creamos nuestro primer grupo de trabajo para colaborar con un panel de expertos, desarrolladores, mantenedores de bibliotecas y educadores. Juntos trabajamos para crear nuestra estrategia de adopción gradual y perfeccionar nuevas API como `useId`, `useSyncExternalStore` y `useInsertionEffect`.

Para una visión general de este trabajo, véase la charla de [Aakansha' Doshi](https://twitter.com/aakansha1216):

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## Herramientas para desarrolladores de React {/*react-developer-tooling*/}

Para dar soporte a las nuevas características de esta versión, también hemos anunciado la creación del nuevo equipo React DevTools y un nuevo Timeline Profiler para ayudar a los desarrolladores a depurar sus aplicaciones React.

Para obtener más información y una demostración de las nuevas funciones de DevTools, consulte la charla de [Brian Vaughn](https://twitter.com/brian_d_vaughn):

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## React sin memo {/*react-without-memo*/}

Mirando más hacia el futuro, [Xuan Huang (黄玄)](https://twitter.com/Huxpro) compartió una actualización de nuestra investigación de React Labs sobre un compilador auto-recordatorio. Echa un vistazo a esta charla para obtener más información y una demostración del prototipo del compilador:

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## Conferencia sobre React Docs {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors) inició una sección de conferencias sobre aprendizaje y diseño con React con una conferencia sobre nuestra inversión en la nueva documentación de React ([ahora disponible como react.dev](/blog/2023/03/16/introducing-react-dev)):

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## Y más... {/*and-more*/}

**También escuchamos charlas sobre aprendizaje y diseño con React:**

- Debbie O'Brien: [Cosas que he aprendido de los nuevos documentos de React](https://youtu.be/-7odLW_hG7s).
- Sarah Rainsberger: [Aprendizaje en el navegador](https://youtu.be/5X-WEQflCL0).
- Linton Ye: [El ROI (retorno de la inversión) de diseñar con React](https://youtu.be/7cPWmID5XAk).
- Delba de Oliveira: [Parques infantiles interactivos con React](https://youtu.be/zL8cz2W0z34).

**Charlas de los equipos Relay, React Native y PyTorch:**

- Robert Balicki: [Reintroducción de Relay](https://youtu.be/lhVGdErZuN4).
- Eric Rozell y Steven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
- Roman Rädle: [Aprendizaje automático en el dispositivo para React Native](https://youtu.be/NLj73vrc2I8).

**Y charlas de la comunidad sobre accesibilidad, herramientas y componentes de servidor:**

- Daishi Kato: [React 18 para librerías de tiendas externas](https://youtu.be/oPfSC5bQPR8).
- Diego Haz: [Construyendo Componentes Accesibles en React 18](https://youtu.be/dcm8fjBfro8).
- Tafu Nakazaki: [Componentes de formulario accesibles en japonés con React](https://youtu.be/S4a0QlsH0pU).
- Lyle Troxell: [Herramientas de UI para artistas](https://youtu.be/b3l4WxipFsE).
- Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

## Agradecimientos {/*thank-you*/}

Este fue nuestro primer año planeando una conferencia nosotros mismos, y tenemos muchas personas a las que agradecer.

Primero, gracias a todos nuestros oradores. [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0), y [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Gracias a todos los que han contribuido con sus comentarios sobre las charlas, incluyendo a [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS), [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors), y [Tim Yung](https://twitter.com/yungsters).

Gracias a [Lauren Tan](https://twitter.com/potetotes) por organizar la conferencia Discord y ser nuestra administradora de Discord.

Gracias a [Seth Webster](https://twitter.com/sethwebster) por sus comentarios sobre la dirección general y por asegurarse de que nos centráramos en la diversidad y la inclusión.

Gracias a [Rachel Nabors](https://twitter.com/rachelnabors) por encabezar nuestro esfuerzo de moderación y a [Aisha Blake](https://twitter.com/AishaBlake) por crear nuestra guía de moderación, dirigiendo nuestro equipo de moderación. capacitar a los traductores y moderadores, y ayudar a moderar ambos eventos.

Gracias a nuestros moderadores [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li y [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Gracias a [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0) y Vihang Patel de [React India](https://www.reactindia.io/) y [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15) y [YanLun Li](https://twitter. com/anneincoding) de [React China](https://twitter.com/ReactChina) por ayudar a moderar nuestro evento de repetición y mantenerlo atractivo para la comunidad.

Gracias a Vercel por publicar su [Kit de inicio de eventos virtuales](https://vercel.com/virtual-event-starter-kit), en el que se construyó el sitio web de la conferencia, y a [Lee Robinson](https://twitter.com/leeerob) y [Delba de Oliveira](https://twitter.com/delba_oliveira) por compartir su experiencia con Next.js Conf.

Gracias a [Leah Silber](https://twitter.com/wifelette) por compartir su experiencia en la realización de conferencias, los aprendizajes de la ejecución de [RustConf](https://rustconf.com/) y por su libro [Event Driven](https://leanpub.com/eventdriven/) y los consejos que contiene para realizar conferencias.

Gracias a [Kevin Lewis](https://twitter.com/_phzn) y [Rachel Nabors](https://twitter.com/rachelnabors) por compartir su experiencia al dirigir Women of React Conf.

Gracias a [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic), y [Shaundai Person](https://twitter.com/shaundai) por sus consejos e ideas durante la planificación.

Gracias a [Dan Lebowitz](https://twitter.com/lebo) por ayudarme a diseñar y construir el sitio web de la conferencia y las entradas.

Gracias a Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman y otros miembros del equipo de Facebook Video Productions por grabar los videos para las charlas de los empleados de Keynote y Meta.

Gracias a nuestro socio HitPlay por ayudar a organizar la conferencia, editar todos los videos en la transmisión, traducir todas las charlas y moderar Discord en varios idiomas.

Finalmente, ¡gracias a todos nuestros participantes por hacer de esta una gran React Conf!
