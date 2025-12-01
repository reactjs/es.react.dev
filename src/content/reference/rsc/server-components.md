---
title: Server Components
---

<<<<<<< HEAD
<RSC>

Los Server Components son para usarse en [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</RSC>

=======
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0
<Intro>

Los Server Components son un nuevo tipo de Componente que se renderizan con antelación, antes del empaquetado, en un entorno separado de tu aplicación en el cliente o servidor SSR.

</Intro>

Este entorno separado es el "servidor" en React Server Components. Los Server Components pueden ejecutarse una vez en el momento de la compilación en su servidor CI, o pueden ejecutarse para cada solicitud utilizando un servidor web.

<InlineToc />

<Note>

#### ¿Cómo se crea la compatibilidad para los Server Components? {/*how-do-i-build-support-for-server-components*/}

<<<<<<< HEAD
Mientras que los React Server Components en React 19 son estables y no se romperán entre versiones menores, las API subyacentes utilizadas para implementar un bundler o framework de React Server Components no siguen un versionado semántico y pueden romperse entre versiones menores en React 19.x.
=======
While React Server Components in React 19 are stable and will not break between minor versions, the underlying APIs used to implement a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

Para soportar React Server Components como bundler o framework, recomendamos usar una versión específica de React, o usar la versión Canary. Seguiremos trabajando con bundlers y frameworks para estabilizar las API utilizadas para implementar React Server Components en el futuro.

</Note>

### Server Components sin Servidor {/*server-components-without-a-server*/}
Los Server components pueden ejecutarse en tiempo de compilación para leer del sistema de archivos u obtener contenido estático, por lo que no es necesario un servidor web. Por ejemplo, es posible que desee leer datos estáticos de un sistema de gestión de contenidos.

Sin Server Components, es común obtener datos estáticos en el cliente con un efecto:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTA: se carga *después* del primer renderizado.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Este patrón significa que los usuarios tienen que descargar y analizar 75K adicionales (comprimidos en gzip) de bibliotecas, y esperar por una segunda petición para obtener los datos después de que se cargue la página, sólo para representar contenido estático que no cambiará durante el ciclo de vida de la página.

Con Server Components, puedes renderizar estos componentes una vez en el tiempo de compilación:

```js
import marked from 'marked'; // No incluido en el paquete
import sanitizeHtml from 'sanitize-html'; // No incluido en el paquete

async function Page({page}) {
  // NOTA: se carga *durante* el renderizado, cuando se construye la aplicación.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

El resultado renderizado puede entonces ser renderizado del lado del servidor (SSR) a HTML y subido a un CDN. Cuando se cargue la aplicación, el cliente no verá el componente original `Page`, ni las costosas librerías para renderizar el markdown. El cliente sólo verá el resultado renderizado:

```js
<div><!-- html for markdown --></div>
```

Esto significa que el contenido es visible durante la primera carga de la página, y el paquete no incluye las costosas bibliotecas necesarias para renderizar el contenido estático.

<Note>

Quizá pudiste notar que el Server Component de arriba es una función asíncrona:

```js
async function Page({page}) {
  //...
}
```

Los Componentes Asíncronos son una nueva característica de los Server Components que te permiten `esperar` en el renderizado.

Véase [Componentes asíncronos con Server Components](#async-components-with-server-components) más abajo.

</Note>

### Server Components con Servidor {/*server-components-with-a-server*/}
Los Server Components también pueden ejecutarse en un servidor web durante la solicitud de una página, lo que te permite acceder a la capa de datos sin tener que crear una API. Se renderizan antes de empaquetar la aplicación y pueden pasar datos y JSX como props a los Client Components.

Sin Server Components, es común obtener datos dinámicos en el cliente en un Efecto:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTA: se carga *después* del primer renderizado.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTA: se carga *después* del renderizado de Note.
  // Provocando una costosa cascada cliente-servidor.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Con Server Components, puedes leer los datos y representarlos en el componente:

```js
import db from './database';

async function Note({id}) {
  // NOTA: se carga *durante* el renderizado.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTA: se carga *después* de Note,
  // pero es rápido si los datos están ubicados en el mismo lugar.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

El bundler luego combina los datos, los Server Components renderizados y los Client Components dinámicos en un paquete. Opcionalmente, ese paquete puede ser renderizado del lado del servidor (SSR) para crear el HTML inicial de la página. Cuando se carga la página, el navegador no ve los componentes originales `Note` y `Author`; sólo se envía al cliente la salida renderizada:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

Los Server Components pueden hacerse dinámicos al recuperarlos de un servidor, donde pueden acceder a los datos y renderizarse de nuevo. Esta nueva arquitectura de aplicaciones combina el sencillo modelo mental "solicitud/respuesta" de las Multi-Page Applications (MPA) centradas en el servidor con la interactividad fluida de las Single Page Applications (SPA) centradas en el cliente, ofreciéndole lo mejor de ambos mundos.

### Añadir interactividad a los Server Components {/*adding-interactivity-to-server-components*/}

Los Server Components no se envían al navegador, por lo que no pueden utilizar APIs interactivas como `useState`. Para añadir interactividad a los Server Components, puede componerlos con Client Component utilizando la directiva `"use client"`.

<Note>

#### No hay directiva para los Server Components. {/*there-is-no-directive-for-server-components*/}

Un malentendido común es que los Server Components se denotan por `"use server"`, pero no hay directiva para Server Components. La directiva `"use server"` se utiliza para las Server Functions.

Para más información, consulte la documentación de [Directivas](/reference/rsc/directives).

</Note>


En el siguiente ejemplo, el Server Component `Notes` importa un Client Component `Expandable` que utiliza el estado para cambiar su estado `expanded`:
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

Esto funciona renderizando primero `Notes` como un Server Component, y luego instruyendo al bundler para que cree un bundle para el Client Component `Expandable`. En el navegador, los Client Component verán la salida de los Server Component pasados como props:

```js
<head>
  <!-- el bundle para Client Components -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### Componentes asíncronos con Server Components {/*async-components-with-server-components*/}

Los Server Components introducen una nueva forma de escribir Componentes usando async/await.  Cuando `esperas` en un componente asíncrono, React suspenderá y esperará a que la promesa se resuelva antes de reanudar la renderización. Esto funciona a través de los límites de servidor/cliente con soporte de streaming para Suspense.

Incluso puedes crear una promesa en el servidor y esperarla en el cliente:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Suspenderá el Server Component.
  const note = await db.notes.get(id);
<<<<<<< HEAD
  
  // NOTA: no se espera, se iniciará aquí y se esperará en el cliente.
=======

  // NOTE: not awaited, will start here and await on the client.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTA: esto reanudará la promesa desde el servidor.
  // Se suspenderá hasta que los datos estén disponibles.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

El contenido de `note` es un dato importante para que la página se renderice, así que lo `esperamos` en el servidor. Los comentarios están por debajo del pliegue y son de menor prioridad, así que iniciamos la promesa en el servidor, y la esperamos en el cliente con la `use` API. Esto Suspenderá en el cliente, sin bloquear el contenido `note` de la renderización.

Dado que los componentes asíncronos no están soportados en el cliente, esperamos la promesa con `use`.
