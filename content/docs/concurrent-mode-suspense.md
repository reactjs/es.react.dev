---
id: concurrent-mode-suspense
title: Suspense para la carga de datos (experimental)
permalink: docs/concurrent-mode-suspense.html
prev: concurrent-mode-intro.html
next: concurrent-mode-patterns.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

> Advertencia:
>
> Esta página describe **funcionalidades experimentales que [aún no están disponibles](/docs/concurrent-mode-adoption.html) en una versión estable**. No dependas de compilados experimentales de React en aplicaciones en producción. Estas funcionalidades pueden cambiar significativamente y sin advertencia antes de formar parte de React.
>
> Esta documentación está dirigida a usuarios pioneros y personas que sienten curiosidad. **Si te estás iniciando en React, no te preocupes por estas funcionalidades,** no necesitas aprenderlas inmediatamente. Por ejemplo, si estás buscando un tutorial para realizar carga de datos y que funcione hoy, lee, en cambio, [este artículo](https://www.robinwieruch.de/react-hooks-fetch-data/).

</div>

React 16.6 añadió un componente `<Suspense>` que te permite "esperar" a que se cargue algún código y especificar declarativamente un estado de carga (como un _spinner_) mientras esperamos:

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Carga diferida

// Mostrar un spinner mientras se carga el perfil
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

Suspense para la carga de datos es una nueva funcionalidad que te permite también utilizar `<Suspense>` para **"esperar" declarativamente por cualquier otra cosa, incluyendo datos.** Esta página se enfoca en el caso de uso de la carga de datos, pero también puede esperar por imágenes, _scripts_, u otro trabajo asíncrono.

- [¿Qué es Suspense, exactamente?](#what-is-suspense-exactly)
  - [Lo que Suspense no es](#what-suspense-is-not)
  - [Lo que Suspense te permite hacer](#what-suspense-lets-you-do)
- [Uso de Suspense en la práctica](#using-suspense-in-practice)
  - [¿Y si no uso Relay?](#what-if-i-dont-use-relay)
  - [Para autores de bibliotecas](#for-library-authors)
- [Enfoques tradicionales vs. Suspense](#traditional-approaches-vs-suspense)
  - [Enfoque 1: Carga en el renderizado (sin usar Suspense)](#approach-1-fetch-on-render-not-using-suspense)
  - [Enfoque 2: Carga y luego renderizado (sin usar Suspense)](#approach-2-fetch-then-render-not-using-suspense)
v  - [Approach 3: Renderizar mientras se carga (usando Suspense)](#approach-3-render-as-you-fetch-using-suspense)
  [Comenzar a cargar con antelación](#start-fetching-early)
  - [Aún no lo sabemos todo](#were-still-figuring-this-out)
- [Suspense y las condiciones de carrera](#suspense-and-race-conditions)
  - [Condiciones de carrera con useEffect](#race-conditions-with-useeffect)
  - [Condiciones de carrera con componentDidUpdate](#race-conditions-with-componentdidupdate)
  - [El problema](#the-problem)
  - [Solución de las condiciones de carrera con Suspense](#solving-race-conditions-with-suspense)
- [Manejo de errores](#handling-errors)
- [Próximos pasos](#next-steps)

## ¿Qué es Suspense, exactamente? {#what-is-suspense-exactly}

Suspense permite que tus componentes "esperen" por algo antes de que se puedan renderizar. En [este ejemplo](https://codesandbox.io/s/frosty-hermann-bztrp), dos componentes esperan por una llamada asíncrona a una API para cargar algunos datos:

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Intenta leer información del usuario, aunque puede que aún no se haya cargado
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Intenta leer las publicaciones aunque puede que aún no se hayan cargado
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Este demo es una suerte de motivación. No te preocupes si aún no tiene sentido completamente. Hablaremos más sobre cómo funciona debajo. Ten en cuenta que Suspense es más un _mecanismo_, y ciertas API como `fetchProfileData()` o `resource.posts.read()` en el ejemplo de arriba no son muy importantes. Si tienes curiosidad, puedes encontrar sus definiciones en el _sandbox_ del demo.

Suspense no es una biblioteca para la carga de datos. Es un **mecanismo para que las bibliotecas de carga de datos** le comuniquen a React que *los datos que un componente está leyendo aún no están listos*. React puede entonces esperar a que estén listos y actualizar la interfaz de usuario. En Facebook, utilizamos Relay y [su nueva integración con Suspense](https://relay.dev/docs/en/experimental/step-by-step). Esperamos que otras bibliotecas como Apollo puedan proporcionar integraciones similares.

A largo plazo, esperamos que Suspense se vuelva la forma principal de leer datos asíncronos desde los componentes (sin importar de dónde vienen los datos).

### Lo que Suspense no es {#what-suspense-is-not}

Suspense es significativamente diferente a enfoques existentes para estos problemas, así que leer sobre esto por primera vez puede conducir a ideas equivocadas. Aclaremos las más comunes:

* **No es una implementación de carga de datos.** No asume que utilizas GraphQL, REST, u cualquier otro formato de datos, biblioteca, transporte o protocolo en particular.

* **No es un cliente listo para usarse.** No puedes "reemplazar" `fetch` o Relay con Suspense. Pero puedes utilizar una biblioteca que esté integrada con Suspense (por ejemplo, las [nuevas API de Relay](https://relay.dev/docs/en/experimental/api-reference)).

* **No acopla la carga de datos con la vista.** Ayuda a coordinar la muestra de los estados de carga en tu interfaz de usuario, pero no ata tú lógica de red a los componentes de React.

### Lo que Suspense te permite hacer {#what-suspense-lets-you-do}

¿Entonces, cuál es el punto de Suspense? Hay varias formas de responder esto:

* **Les permite a las bibliotecas de carga de datos integrarse profundamente con React.** Si una biblioteca de carga de datos implementa compatibilidad con Suspense, usarla desde React es una experiencia muy natural.

* **Te permite coordinar estados de carga diseñados intencionalmente.** No dice _cómo_ se obtienen los datos, pero te permite controlar con exactitud la secuencia visual de carga de tu aplicación.

* **Te permite evitar condiciones de carrera.** Incluso con `await`, el código asíncrono es a menudo propenso a errores. Suspense se siente más como leer datos _sincrónicamente_ (como si ya estuvieran cargados).

## Uso de Suspense en la práctica {#using-suspense-in-practice}

En Facebook, hasta ahora solo hemos usado en producción la integración de Suspense con Relay. **Si estás buscando una guía práctica de como iniciarte hoy, [¡revisa la guía de Relay!](https://relay.dev/docs/en/experimental/step-by-step) Demuestra patrones que nos han funcionado bien en producción.

**Los demos de código en este página utilizan una implementación "falsa" de API en lugar de Relay.** Esto hace que sean más fáciles de comprender si no estás familiarizado con GraphQL, pero no te dirán la "forma correcta" de construir una aplicación con Suspense. Esta página es más conceptual y se propone ayudarte a ver _por qué_ Suspense funciona de cierta manera, y qué problemas soluciona.

### ¿Y si no uso Relay? {#what-if-i-dont-use-relay}

Si no usas actualmente Relay, quizá debas esperar antes de que puedas probar Suspense realmente en tu aplicación. Hasta ahora, es la única implementación que hemos probado en producción y de la que podemos sentir seguros.

En los próximos meses, muchas bibliotecas aparecerán con diferentes formas de API con Suspense. Si prefieres aprender cuando las cosas estén más estables, quizá quieras ignorar este trabajo por ahora, y volver cuando el ecosistema de Suspense esté más maduro.

También puedes escribir tu propia integración para una biblioteca de carga de datos, si quisieras.

### Para autores de bibliotecas {#for-library-authors}

Esperamos ver mucha experimentación en la comunidad con otras bibliotecas. Hay algo importante que deben notar los autores de bibliotecas de carga de datos.

Aunque técnicamente se puede hacer, Suspense actualmente *no* está dirigida a usarse como una forma de comenzar a cargar datos cuando un componente se renderiza. En cambio, le permite a los componentes expresar que están "esperando" por datos que ya *se están cargando*. **[Building Great User Experiences with Concurrent Mode and Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) describe por qué esto es importante y cómo implementar este patrón en la práctica.**

A menos que tengas una idea para una solución que ayude a prevenir las cascadas, sugerimos preferir las API que favorezcan u obliguen a obtener los datos antes del renderizado. Por un ejemplo concreto, puede mirar la cómo la [API de Suspense de Relay](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) obliga la precarga. Nuestro mensaje acerca de esto no ha sido muy consistente en el pasado. Suspense para la carga de datos es aún experimental, por lo que puedes esperar que nuestras recomendaciones cambien con el tiempo mientras aprendemos más a través del uso en producción y comprendamos mejor el espacio problémico.

## Enfoques tradicionales vs. Suspense {#traditional-approaches-vs-suspense}

Podríamos introducir Suspense sin mencionar los enfoques populares de carga de datos. Sin embargo, esto hace que sea más difícil ver qué problemas soluciona Suspense, por qué vale la pena resolver estos problemas, y como Suspense es diferente a las soluciones existentes.

En cambio, veremos a Suspense como el próximo paso lógico en una secuencia de enfoques:

* **Carga en el renderizado (por ejemplo, `fetch` en `useEffect`):** Se comienza renderizando los componentes. Cada uno de estos componentes pueden disparar cargas de datos en sus efectos y métodos de ciclo de vida. Este enfoque a menudo conduce a "cascadas".
* **Carga y luego renderizado (por ejemplo, Relay sin Suspense):** Se comienza cargando todos los datos para la próxima pantalla tan rápido como sea posible. Cuando los datos están listos, se renderiza la nueva pantalla. No podemos hacer nada hasta que lleguen los datos.
* **Renderizado mientras se carga** (por ejemplo, Relay con Suspense): Se comienza a cargar los datos requeridos por la nueva pantalla tan pronto como sea posible, y se inicia a renderizar la nueva pantalla _inmediatamente_ (antes de que obtengamos una respuesta de red). Mientras los datos llegan, React intenta renderizar los componentes que aún necesitan datos hasta que estén todos listos.

> Nota
>
> Esto está algo simplificado, y en la práctica las soluciones tienden a usar una mezcla de diferentes enfoques. Aún así, los analizaremos por separado para contrastar mejor las concesiones que hace cada una.

Para comparar estos enfoques, implementaremos una página de perfil con cada uno de ellos.

### Enfoque 1: Carga en el renderizado (sin usar Suspense) {#approach-1-fetch-on-render-not-using-suspense}

Una forma común de cargar datos en las aplicaciones de React hoy en día es usar un efecto:

```js
// In a function component:
useEffect(() => {
  fetchSomething();
}, []);

// Or, in a class component:
componentDidMount() {
  fetchSomething();
}
```

Denominamos este enfoque "carga en el renderizado" porque no comienza a cargar hasta después de que el componente se ha cargado en pantalla. Esto lleva a un problema conocido como "cascada".

Considera los componentes `<ProfilePage>` (Página de Perfil) y `<ProfileTimeline>` (Historial del perfil):

```js{4-6,22-24}
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/fragrant-glade-8huj6)**

Si ejecutas este código y miras a los registros de la consola, notarás que la secuencia es:

1. Comenzamos a cargar los detalles del usuario
2. Esperamos...
3. Terminamos de cargar los detalles del usuario
4. Comenzamos a cargar las publicaciones
5. Esperamos...
6. Terminamos de cargar las publicaciones

Si cargar los detalles del usuario toma tres segundos, entonces, ¡solo _comenzaremos_ a cargar las publicaciones hasta después de tres segundos! Eso es una "cascada": una _secuencia_ no intencional que pudo haber sido paralelizada.

las cascadas son comunes en código que carga datos en el renderizado. Son posibles de resolver, pero mientras el producto crece, muchas personas prefieren utilizar una solución que los proteja ante este problema.

### Enfoque 2: Carga y luego renderizado (sin usar Suspense) {#approach-2-fetch-then-render-not-using-suspense}

Las bibliotecas pueden prevenir las cascadas al ofrecer una forma más centralizada de realizar la carga de datos. Por ejemplo, relay soluciona este problema al mover la información acerca de los datos que un componente necesita hacia *fragmentos* estáticamente analizables, que luego se componen en una sola consulta.

En esta página, no asumimos conocimiento sobre Relay, por lo que no la usaremos para este ejemplo. En cambio, escribiremos algo similar manualmente para combinar nuestros métodos de carga de datos:

```js
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
```

En este ejemplo, `<ProfilePage>` espera por ambas peticiones, pero las inicia en paralelo:

```js{1,2,8-13}
// Empezar a cargar datos tan pronto como sea posible
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// El hijo no ya no vuelve a iniciar una carga de datos
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/wandering-morning-ev6r0)**

Las secuencia de eventos ahora sería así:

1. Comenzamos a cargar los detalles de usuario
2. Comenzamos a cargar las publicaciones
3. Esperamos...
4. Terminamos de cargar los detalles de usuario
5. Terminamos de cargar las publicaciones

Hemos resuelto la anterior "cascada" de red, pero accidentalmente hemos introducido otra distinta. Esperamos por que *todos* los datos vuelvan con `Promise.all()` dentro de `fetchProfileData`, por lo que ahora no podemos renderizar los detalles del perfil hasta que las publicaciones también se hayan cargado. Tenemos que esperar por ambas.

Por supuesto, es posible resolverlo en este ejemplo en particular. Podríamos eliminar la llamada a `Promise.all()` y esperar por ambas promesas de forma separada. Sin embargo, este enfoque se vuelve progresivamente más difícil mientras crece la complejidad de nuestros datos y de nuestro árbol de componente. Es difícil escribir componentes confiables cuando partes arbitrarias del árbol de datos faltan o están viciadas. Por esta razón cargar todos los datos para la nueva pantalla y *luego* renderizar es a menudo una opción más práctica.

### Enfoque 3: Renderizar mientras se carga (usando Suspense) {#approach-3-render-as-you-fetch-using-suspense}

En el enfoque anterior, cargamos los datos antes de llamar a `setState`:

1. Comenzar a cargar
2. Terminar de cargar
3. Comenzar a renderizar

Con Suspense, comenzaremos a cagar primero, pero intercambiaremos los otros dos pasos:

1. Comenzar a cargar
2. **Comenzar a renderizar**
3. **Terminar de cargar**

**Con Suspense, no esperamos por que retorne la respuesta antes de comenzar a renderizar.** De hecho, comenzamos a renderizar *básicamente de forma inmediata* después de hacer la petición de red:

```js{2,17,23}
// Esto no es una Promesa. Es un objeto especial de nuestra integración con con Suspense. 
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Intenta leer la información del usuario, aunque puede no haberse cargado aún
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Intenta leer las publicaciones, aunque puede que no se hayan cargado aún
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Aquí está lo que pasa cuando renderizamos `<ProfilePage>` en la pantalla:

1. Ya hemos realizado las peticiones en `fetchProfileData()`. Nos devuelve un "recurso" especial en lugar de una promesa. En un ejemplo realista, sería provisto por la integración con Suspense de nuestra biblioteca de datos, como Relay.
2. React intenta renderizar `<ProfilePage>`. Devuelve `<ProfileDetails>` y `<ProfileTimeline>` como hijos.
3. React intenta renderizar `<ProfileDetails>`. Llama a `resource.user.read()`. Ninguno de los datos se han recibido aún, por lo que este componente se "suspende". React se lo salta, e intenta renderizar otros componentes en el árbol.
4. React intenta renderizar `<ProfileTimeline>`. Llama a `resource.posts.read()`. De nuevo, aún no hay datos, por lo que este componente se "suspende". React también se lo salta, e intenta renderizar otros componentes en el árbol.
5. No hay nada más que intentar renderizar. Dado que `<ProfileDetails>` se suspendió, React muestra el _fallback_ (componente temporal de reemplazo) del `<Suspense>` más cercano hacia arriba en el árbol: `<h1>Loading profile...</h1>`. Hemos terminado por ahora.

Este objeto `resource` representa los datos que aún no están allí, pero que eventualmente serán cargados. Cuando llamamos a `read()`, o bien obtenemos los datos, o el componente se "suspende".

**Mientras llegan más datos, React intentará renderizar, y cada vez podrá ser capaz de progresar "más adentro".** Cuando `resource.user` se carga, el componente renderizará satisfactoriamente y no necesitará más el _fallback_ `<h1>Loading profile...</h1>`. Eventualmente, obtendremos todos los datos, y no habrá más _fallbacks_ en la pantalla.

Esto tiene una implicación interesante. Incluso si usamos un cliente GraphQL que colecciona todos los requerimientos de datos en una sola petición, *si la respuesta se devuelve en flujo nos permite mostrar más contenido con mayor rapidez*. Dado que renderizamos mientras cargamos (en oposición a *después* de cargar), si `user` aparece en la respuesta antes que `posts`, seremos capaces de "desbloquear" la barrera exterior `<Suspense>` incluso antes de que la respuesta termine. Puede que no nos hayamos percatado de esto antes, pero incluso la solución de carga y luego renderizado contiene una cascada: entre la carga y el renderizado. Suspense no sufre en principio de esta cascada, y bibliotecas como Relay lo aprovechan.

Nota como hemos eliminado los chequeos `if (...)` "is loading" de nuestros componentes. Esto no solo elimina código repetitivo, sino que también simplifica el proceso de hacer cambios rápidos de diseño. Por ejemplo, si quisiéramos que los detalles del perfil y las publicaciones siempre aparecieran juntos, podríamos eliminar la barrera `<Suspense>` entre ellos. O podríamos hacerlos independientes uno del otro dándole a cada uno *su propia* barrera `<Suspense>`. Suspense te permite cambiar la granularidad de nuestros estados de carga y coordinar la secuencia sin cambios invasivos al código.

## Comenzar a cargar con antelación {#start-fetching-early}

Si estás trabajando en una biblioteca de carga de datos, hay un aspecto crucial del renderizado mientras se carga que es necesario no olvidar. **Se comienza a cargar _antes_ de renderizar.** Mira este ejemplo de código con detenimiento:

```js
// ¡Comienza a cargar los datos con antelación!
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // Intenta leer la información del usuario
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Nota que la llamada a `read()` en este ejemplo no *inicia* la carga. Solo intenta leer los datos que ya se **están cargando**. Esta diferencia es crucial para la creación de aplicaciones rápidas con Suspense. No queremos demorar la carga de datos hasta que un componente comienza a renderizarse. Como un autor de una biblioteca de carga de datos, puedes forzar que esto ocurra haciendo imposible obtener un objeto `resource` sin que se inicie una carga. Todos los demos en esta página que usan nuestra "API falsa" lo hacen.

Puedes objetar que cargar "en el nivel superior" como en este ejemplo no es práctico. ¿Qué hacemos si navegamos hacia otra página de perfil? Puede que queramos cargar datos basándonos en props. La respuesta a esto es que **en este caso queremos comenzar a cargar en los manejadores de eventos**. Aquí podemos ver un ejemplo simplificado de navegación entre páginas de usuario:

```js{1,2,10,11}
// Primera carga: tan pronto como sea posible
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // Próxima carga: cuando el usuario hace click
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

Con este enfoque, podemos **cargar el código y los datos en paralelo**. Cuando navegamos entre páginas no necesitamos esperar por que el código de la página cargue para comenzar a cargar sus datos. Podemos comenzar a cargar tanto el código como los datos al mismo tiempo (durante el clic al enlace), proveyendo una experiencia de usuario mucho mejor.

Esto plantea la disyuntiva de cómo sabemos *qué* cargar antes de renderizar la próxima pantalla. Hay varias formas de resolver esto (por ejemplo, haciendo una integración más cercana entre la carga de datos y tu solución de enrutamiento). Si trabajas en una biblioteca de carga de datos [Building Great User Experiences with Concurrent Mode and Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) presenta una descripción profunda de como conseguirlo y por qué es importante.

### Aún no lo sabemos todo {#were-still-figuring-this-out}

El propio Suspense como mecanismo es flexible y no tiene muchas restricciones. El código de productos necesita tener más restricciones para asegurar que no existan cascadas, pero hay formas distintas de proporcionar estas garantías. Algunas preguntas que aún estamos explorando incluyen:

* Cargar pronto puede ser complicado de expresar. ¿Cómo lo hacemos más fácil para evitar cascadas?
* Cuando cargamos datos para una página. ¿Puede la API promover la inclusión de datos para transiciones instantáneas *desde* ella?
* ¿Cuál es el tiempo de vida de una respuesta? La caché debe ser global o local? ¿Quién maneja la caché?
* ¿Pueden los _Proxies_ ayudar a expresar API de carga diferida sin insertar llamadas a `read()` por todos lados? 
* ¿Cómo luciría el equivalente a la composición de consultas GraphQL para datos arbitrarios con Suspense?

Relay tiene sus propias respuestas para algunas de estas preguntas. Ciertamente hay más de una sola forma de hacerlo y estamos emocionados de poder ver las nuevas ideas que se le ocurrirán a la comunidad de React.

## Suspense y las condiciones de carrera {#suspense-and-race-conditions}

Las condiciones de carrera son errores que ocurren por suposiciones incorrectas que se hacen acerca del orden en el que nuestro código se ejecutará. Al cargar datos en el Hook `useEffect` o en un método de ciclo de vida de una clase como `componentDidUpdate` a menudo conduce a ellos. Suspense ayuda aquí también, veamos como.

Para demostrar el problema, añadiremos un componente de primer nivel `<App>` que renderiza nuestro `<ProfilePage>` con un botón que nos permite **cambiar entre diferentes perfiles**:

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Next
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

Comparemos las diferencias en el manejo de este requerimiento entre las diferentes estrategias de carga de datos.

### Condiciones de carrera con `useEffect` {#race-conditions-with-useeffect}

Primero, probaremos una versión de nuestro ejemplo original de "carga en efecto". Lo modificaremos para pasar un parámetro `id` desde las props de `<ProfilePage>` a `fetchUser(id)` y `fetchPosts(id)`:

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/nervous-glade-b5sel)**

Nota cómo también cambiamos las dependencias del efecto de `[]` a `[id]`, porque queremos que el efecto se ejecute cuando cambie el `id`. De otra forma, no recargaríamos nuevos datos.

Si intentamos este código, podría parecer que funciona en un inicio. Sin embargo si hacemos aleatorio el tiempo de espera de la implementación de nuestra "falsa API" y presionamos el botón "Next" lo suficientemente rápido, veremos por los registros de la consola que algo está muy mal. **Las peticiones de perfiles anteriores pueden a veces "retornar" después de que ya hemos cambiado el perfil a otro ID, y en ese caso pueden sobrescribir el nuevo estado con una respuesta viciada para un ID diferente.**

Este problema se puede solucionar (puedes usar la función de limpieza del efecto para o bien ignorar o bien cancelar las respuestas viciadas), pero no es intuitivo y es difícil de depurar.

### Condiciones de carrera con `componentDidUpdate` {#race-conditions-with-componentdidupdate}

Se podría pensar que este es un problema específico de `useEffect` o de los Hooks. ¿Quizá si trasladamos este código a las clases o usamos una sintaxis conveniente como `async` / `await` resolvamos el problema?

Intentémoslo:

```js
class ProfilePage extends React.Component {
  state = {
    user: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Loading profile...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Loading posts...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/trusting-clarke-8twuq)**

Este código es bien fácil de leer.

Desafortunadamente, ni usando una clase, ni la sintaxis `async` / `await` nos ayudan a resolver este problema. Esta versión enfrenta las mismas condiciones de carrera, por las mismas razones.

### El problema {#the-problem}

Los componentes de React tienen su propio "ciclo de vida". Pueden recibir props o actualizar el estado en cualquier punto del tiempo. Sin embargo, cada petición asíncrona *también* tiene su propio *ciclo de vida*. Empieza cuando la realizamos, y termina cuando obtenemos una respuesta. La dificultad que experimentamos es la "sincronización" de varios procesos en el tiempo que se afectan entre sí. Esto es difícil de razonar.

### Solución de las condiciones de carrera con Suspense {#solving-race-conditions-with-suspense}

Escribamos este ejemplo nuevamente, pero solo usando Suspense:

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

En el ejemplo anterior, solo teníamos un `resource`, así que lo manteníamos en una variable en el nivel superior. Ahora que tenemos varios recursos, los movimos al estado del componente `<App>`:

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

Cuando hacemos clic en "Next", el componente `<App>` hace una petición al próximo perfil y pasa *ese* objeto hacia el componente `<ProfilePage>`:

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Next
    </button>
    <ProfilePage resource={resource} />
  </>
```

Nuevamente, nota que **no estamos esperando por la respuesta para establecer el estado**. Es la forma opuesta: establecemos el estado (y se comienza a renderizar) inmediatamente después de iniciar una petición**. Tan pronto como tenemos más datas, React "rellena" el contenido dento de los componentes `<Suspense>`.

Este código es muy legible, pero a diferencia de los ejemplos anteriores, la versión con Suspense no padece de la condiciones de carrera. Podrías estarte preguntando por qué. La respuesta es que en la versión con Suspense no tenemos que pensar tanto en términos de *tiempo* en nuestro código. Nuestro código original con condiciones de carrera necesitaba establecer el estado *justo en el momento después*, o de otra forma no estaría bien. Pero con Suspense, establecemos el estado *inmediatamente*, por lo que es más difícil cometer un error.

## Manejo de errores {#handling-errors}

Cuando escribimos código con Promesas, quizá queramos usar `catch()` para manejar errores. ¿Cómo funciona con Suspense, si no queremos *esperar* por las Promesas para empezar a renderizar?

Con Suspense, el manejo de errores de carga funciona de la misma forma que el manejo de errores de renderizado, puedes renderizar una [barrera de error](/docs/error-boundaries.html) en cualquier sitio para "atrapar" errores en los componentes que se encuentran debajo.

Primero definiremos un componente de barrera de error para usarlo en nuestro proyecto:

```js
// Actualmente las barreras de error tienen que ser clases.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

Y luego lo podemos poner en cualquier lugar en el árbol para atrapar errores:

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/adoring-goodall-8wbn7)**

Atrapará tanto errores de renderizado *como* errores de carga de datos con Suspense. Podemos tener tantas barreras de error como queramos, pero es mejor [ser intencional](https://aweary.dev/fault-tolerance-react/) acerca de su ubicación.

## Próximos pasos {#next-steps}

¡Hemos cubierto ahora los elementos básicos de Suspense para la carga de datos! Lo más importante, ahora comprendemos mejor *por qué* Suspense funciona de esta manera, y como encaja en el espacio de la carga de datos.

Suspense responde algunas preguntas, pero también plantea algunas nuevas:

* Si algún componente se "suspende", ¿se congela la aplicación? ¿Cómo evitarlo?
* ¿Y si quisiéramos mostrar un _spinner_ en un lugar diferente al componente de "encima" en el árbol?
* Si intencionalmente *quisiéramos* mostrar una interfaz inconsistente por un pequeño espacio de tiempo, ¿Podríamos hacerlo?
* En lugar de mostrar un _spinner_, ¿podemos añadir un efecto visual como "oscurecer" la pantalla actual?
* ¿Por qué nuestro [último ejemplo con Suspense](https://codesandbox.io/s/infallible-feather-xjtbu) emitió una advertencia al hacer clic en el botón "Next"?

Para responder a estas preguntas, nos referiremos a la próxima sección dedicada a [Patrones de interfaces de usuario concurrentes](/docs/concurrent-mode-patterns.html).
