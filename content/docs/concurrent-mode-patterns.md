---
id: concurrent-mode-patterns
title: Patrones concurrentes en interfaces de usuario (Experimental)
permalink: docs/concurrent-mode-patterns.html
prev: concurrent-mode-suspense.html
next: concurrent-mode-adoption.html
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

Usualmente, cuando actualizamos el estado, esperamos ver los cambios en la pantalla inmediatamente. Esto tiene sentido, porque queremos que nuestra aplicación continúe respondiendo a la entrada del usuario. Sin embargo, hay casos en que quisiéramos **postergar la aparición de una actualización en la pantalla**.

Por ejemplo, si cambiamos de una página a otra, y ni nuestro código o datos para la próxima pantalla se han cargado, puede ser frustrante ver inmediatamente una página en blanco con un indicador de carga. Podemos preferir permanecer más tiempo en la pantalla anterior. La implementación de este patrón ha sido históricamente difícil con React. El Modo Concurrente ofrece un nuevo conjunto de herramientas para hacerlo.

- [Transiciones](#transitions)
  - [Envolver setState en una transición](#wrapping-setstate-in-a-transition)
  - [Añadir un indicador de espera](#adding-a-pending-indicator)
  - [Revisión de los cambios](#reviewing-the-changes)
  - [¿Cuándo ocurre la actualización?](#where-does-the-update-happen)
  - [Las transiciones están en todos lados](#transitions-are-everywhere)
  - [Incorporar las transiciones en el sistema de diseño](#baking-transitions-into-the-design-system)
- [Los tres pasos](#the-three-steps)
  - [Predeterminado: Retirada → Esqueleto → Completado](#default-receded-skeleton-complete)
  - [Preferido: Pendiente → Esqueleto → Completado](#preferred-pending-skeleton-complete)
  - [Envolver funcionalidad diferida en `<Suspense>`](#wrap-lazy-features-in-suspense)
  - ["Tren" de revelación de Suspense](#suspense-reveal-train)
  - [Demora de un indicador de estado Pendiente](#delaying-a-pending-indicator)
  - [Recapitulación](#recap)
- [Otros patrones](#other-patterns)
  - [Separación del estado de alta y baja prioridad](#splitting-high-and-low-priority-state)
  - [Postergar un valor](#deferring-a-value)
  - [SuspenseList](#suspenselist)
- [Próximos pasos](#next-steps)

## Transiciones {#transitions}

Revisitemos [este demo](https://codesandbox.io/s/infallible-feather-xjtbu) de la página anterior acerca de [Suspense para la carga de datos](/docs/concurrent-mode-suspense.html).

Cuando hacemos clic en el botón "Next" para cambiar el perfil activo, los datos de la página existente desaparecen inmediatamente y vemos el indicador de carga para todo la página nuevamente. Podemos llamar a esto un estado de carga "no deseable". **Sería bueno si pudiéramos "saltárnoslo" y esperar a que cargue algún contenido antes de hacer la transición a la nueva pantalla.**

React ofrece un nuevo Hook integrado llamado `useTransition()` para ayudar con esto.

Podemos usarlo en tres pasos.

Primero, nos aseguraremos de que estamos realmente usando el Modo Concurrente. Hablaremos más luego sobre como [adoptar el Modo Concurrente](/docs/concurrent-mode-adoption.html), pero por ahora es suficiente saber que necesitamos utilizar `ReactDOM.createRoot()` en lugar de `ReactDOM.render()` para que esto funcione:

```js
const rootElement = document.getElementById("root");
// Optar por el Modo Concurrente
ReactDOM.createRoot(rootElement).render(<App />);
```

A continuación, importaremos el Hook `useTransition` desde React:

```js
import React, { useState, useTransition, Suspense } from "react";
```

Para finalizar, lo utilizaremos dentro del componente `App`:

```js{3-5}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  // ...
```

**Por sí solo, este código no hace nada aún.** Necesitaremos utilizar los valor de retorno de este Hook para establecer nuestra transición de estado. Hay dos valores retornados por `useTransition`:

* `startTransition` es una función. La usaremos para decirle a React *qué* actualización de estado queremos postergar.
* `isPending` es un booleano. Es React diciéndonos si esa transición está ocurriendo actualmente.

Los usaremos debajo.

Nota que pasamos un objeto de configuración para `useTransition`. Su propiedad `timeoutMs` especifica *cuánto tiempo estamos dispuestos a esperar para que la transición termine**. Al pasar `{timeoutMs: 3000}` estamos diciendo: "Si el próximo perfil toma más de 3 segundos en cargar, muestra este gran _spinner_, pero antes de ese tiempo está bien seguir mostrando la pantalla anterior".

### Envolver setState en una transición {#wrapping-setstate-in-a-transition}

Nuestro manejador del evento del clic del botón "Next" realiza la actualización que cambia el perfil actual en el estado:

```js{4}
<button
  onClick={() => {
    const nextUserId = getNextId(resource.userId);
    setResource(fetchProfileData(nextUserId));
  }}
>
```

Envolveremos esa actualización del estado en `startTransition`. De esa forma le decimos a React **que no nos importa que demore la actualización del estado** si conduce a un estado de carga no deseable:

```js{3,6}
<button
  onClick={() => {
    startTransition(() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    });
  }}
>
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/musing-driscoll-6nkie)**

Presiona "Next" varias veces. Notarás que ya se siente bien distinto. **En lugar de ver inmediatamente una pantalla vacía al hacer clic, ahora seguimos viendo la página anterior por un tiempo.** Cuando los datos se han cargado, React hace la transición hacia la nueva pantalla.

Si hacemos que las respuestas de nuestra API tarden 5 segundos, [podemos confirmar](https://codesandbox.io/s/relaxed-greider-suewh) que ahora React "se rinde" y hace de todas formas la transición hacia la próxima pantalla pasados los 3 segundos. Esto ocurre porque pasamos `{timeoutMs: 3000}` a `useTransition()`. Por ejemplo, si en cambio pasamos `{timeoutMs: 60000}`, esperaría todo un minuto.

### Añadir un indicador de espera {#adding-a-pending-indicator}

Aún hay algo que se siente roto acerca de [nuestro último ejemplo](https://codesandbox.io/s/musing-driscoll-6nkie). Seguro, está bien no ver un estado de carga "malo". ¡**Pero no tener ninguna indicación de progreso se siente incluso peor!** Cuando hacemos clic en "Next", no pasa nada y parece que la aplicación está rota.

Nuestra llamada a `useTransition()` devuelve dos valores: `startTransition` e `isPending`.

```js
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });
```

Ya hemos usado `startTransition` para envolver la actualización del estado. Ahora vamos a utilizar también `isPending`. React nos da este booleano para que podamos saber si **actualmente estamos esperando para que termine esta transición**. Lo usaremos para indicar que algo está ocurriendo:

```js{4,14}
return (
  <>
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          const nextUserId = getNextId(resource.userId);
          setResource(fetchProfileData(nextUserId));
        });
      }}
    >
      Next
    </button>
    {isPending ? " Loading..." : null}
    <ProfilePage resource={resource} />
  </>
);
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/jovial-lalande-26yep)**

Ahora, ¡esto se siente mucho mejor! Cuando hacemos clic en Next, se deshabilita porque hacerle clic varias veces no tiene sentido. Y el nuevo "Loading..." le dice al usuario que la aplicación no se ha congelado.

### Revisión de los cambios {#reviewing-the-changes}

Veamos nuevamente todos los cambios que hemos hecho desde el [ejemplo original](https://codesandbox.io/s/infallible-feather-xjtbu):

```js{3-5,9,11,14,19}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/jovial-lalande-26yep)**

Solo nos tomó siete líneas de código añadir esta transición:

* Hemos importado el Hook `useTransition` y usado en el componente que actualiza el estado.
* Hemos pasado `{timeoutMs: 3000}` para mantenernos en la pantalla anterior un máximo de 3 segundos.
* Hemos envuelto nuestra actualización de estado en `startTransition` para decirle a React que está bien postergarla.
* Estamos usando `usePending` para comunicar el progreso de la transición de estado al usuario.

Como resultado, hacer clic en "Next" no realiza una transición de estado inmediata hacia un estado de carga "no deseable", pero en cambio se queda en la pantalla anterior y comunica su progreso ahí.

### ¿Cuándo ocurre la actualización? {#where-does-the-update-happen}

Esto no era muy difícil de implementar. Sin embargo, si empiezas a pensar sobre cómo es posible que esto funcione, puede crear algunos pequeños cortocircuitos. Si actualizamos el estado, ¿cómo puede pasar que no veamos el resultado inmediatamente? ¿*Dónde* se está renderizando el nuevo <ProfilePage`?

Claramente, ambas "versiones" de `<ProfilePage>` existen al mismo tiempo. Sabemos que la antigua existe, porque la vemos en la pantalla e incluso muestra un indicador de progreso en ella. Y sabemos que la nueva versión también existe *en algún sitio*, ¡porque es la que estamos esperando!

**¿Pero, cómo existen dos versiones del mismo componente al mismo tiempo?**

Esto tiene que ver con la esencia del Modo Concurrente. [Anteriormente hemos dicho](/docs/concurrent-mode-intro.html#intentional-loading-sequences) es un poco como si React trabajara en la actualización del estado en una "rama". Otra forma de conceptualizarlo es que al envolver la actualización del estado en `startTransition` comienza a renderizarlo *"en un universo diferente"*, como en las películas de ciencia ficción. No "vemos" ese universo directamente, pero podemos obtener una señal desde él diciéndonos que algo está pasando (`isPending`). Cuando la actualización está lista, nuestros "universos" se mezclan, ¡y vemos el resultado en la pantalla!  

Juega con poco más con el [demo](https://codesandbox.io/s/jovial-lalande-26yep), e intenta imaginar que esto ocurre.

Por supuesto, dos versiones del árbol de renderizado *al mismo tiempo* es una ilusión, justo como la idea de que todos los programas se ejecutan en tu computadora al mismo tiempo es una ilusión. Un sistema operativo cambia entre diferentes aplicaciones muy rápidamente. De manera similar, React puede cambiar entre la versión del árbol que ves en la pantalla y la versión que está preparando para mostrar luego.

Una API como `useTransition` te permite enfocarte en la experiencia de usuario deseada, y no pensar en los mecanismos de su implementación. Aún así, puede ser una metáfora útil imaginar que las actualizaciones envueltas en `startTransition` ocurren "en una rama" o "en un mundo diferente".

### Las transiciones están en todos lados {#transitions-are-everywhere}

Como aprendimos del [paseo por Suspense](/docs/concurrent-mode-suspense.html), cualquier componente se puede "suspender" en cualquier momento si algunos datos que necesita no están listos todavía. Podemos ubicar estratégicamente barreras `<Suspense>` en diferentes partes del árbol para manejar esto, pero no siempre será suficiente.

Volvamos a nuestro [primer demo con Suspense](https://codesandbox.io/s/frosty-hermann-bztrp) donde solo había un perfil. Actualmente, carga los datos solo una vez. Añadiremos un botón "Refresh" para chequear por actualizaciones en el servidor.

Nuestro primer intento podría verse como esto:

```js{6-8,13-15}
const initialResource = fetchUserAndPosts();

function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchUserAndPosts());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button onClick={handleRefreshClick}>
        Refresh
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/boring-shadow-100tf)**

En este ejemplo, comenzamos a cargar datos al inicio *y* cada vez que se presione "Refresh". Ponemos el resultado de llamar a `fetchUserAndPosts()` en el estado de forma tal que los componentes debajo puedan comenzar a renderizar los nuevos datos de la petición que acabamos de hacer.

Podemos ver en [este ejemplo](https://codesandbox.io/s/boring-shadow-100tf) que presionar el botón "Refresh" funciona. Los componentes `<ProfileDetails>` y `<ProfileTimeline>` reciben una nueva prop `resource` que representa los datos nuevos, se "suspenden", porque no tenemos aún una respuesta, y vemos los componentes de respaldo. Cuando el componente carga, podemos ver las publicaciones actualizadas (nuestra API falsa los añade cada 3 segundos).

Sin embargo, la experiencia se siente discordante. Estamos navegando una página, pero fue reemplazada por un estado de carga como si estuviéramos interactuando con ella. Resulta desconcertante. **Como ocurrió anteriormente, para evitar un estado de carga no deseado, podemos envolver la actualización de estado en una transición:**

```js{2-5,9-11,21}
function ProfilePage() {
  const [startTransition, isPending] = useTransition({
    // Wait 10 seconds before fallback
    timeoutMs: 10000
  });
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    startTransition(() => {
      setResource(fetchProfileData());
    });
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button
        onClick={handleRefreshClick}
        disabled={isPending}
      >
        {isPending ? "Refreshing..." : "Refresh"}
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/sleepy-field-mohzb)**

¡Esto se siente mucho mejor! El hacer clic en "Refresh" ya no nos saca de la página que estamos navegando. Vemos que algo se está cargando "en línea", y cuando los datos están listos, se muestran.

### Incorporar las transiciones en el sistema de diseño {#baking-transitions-into-the-design-system}

Podemos ver ahora que la necesidad de `useTransition` es *muy* común. Básicamente cualquier clic a un botón o interacción que pueda llevar a que un componente se suspenda necesita ser envuelto en `useTransition` para evitar accidentalmente esconder al usuario algo con lo que está interactuando.

Esto puede llevar a mucho código repetitivo a lo largo de nuestros componentes. Por eso es que **generalmente recomendamos incluir `useTransition` en los componentes del *sistema de diseño* de tu aplicación. Por ejemplo, podemos extraer la lógica de transición en nuestro componente `<Button>`:

```js{7-9,20,24}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  function handleClick() {
    startTransition(() => {
      onClick();
    });
  }

  const spinner = (
    // ...
  );

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
      >
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/modest-ritchie-iufrh)**

Nota que al botón no le importa *qué* estamos actualizando. Está envolviendo *cualquier* actualización de estado que ocurra durante su manejador `onClick` en una transición. Ahora que nuestro `<Button>` se encarga de configurar la transición, el componente `<ProfilerPage>` no necesita hacerlo desde su parte:

```js{4-6,11-13}
function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchProfileData());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Button onClick={handleRefreshClick}>
        Refresh
      </Button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/modest-ritchie-iufrh)**

Cuando a un botón se le hace clic, comienza una transición y llama a `props.onClick()` dentro de ella, lo que dispara `handleRefreshClick` en el componente `<ProfilePage>`. Comenzamos a cargar los datos nuevos, pero no activa un _fallback_ o componente de respaldo, porque estamos dentro de una transición, y el tiempo de espera de 10 segundos especificado en la llamada a `useTransition` no ha transcurrido todavía. Mientras una transición está pendiente, el botón muestra un indicador de carga en línea.

Podemos ver ahora como el Modo Concurrente nos ayuda a lograr una buena experiencia de usuario sin sacrificar la separación y modularidad de los componentes. React coordina la transición.

## Los tres pasos {#the-three-steps}

Hasta ahora hemos analizado todos los diferentes estados visuales por los que puede atravesar una actualización. En esta sección les daremos nombres y hablaremos sobre la progresión entre ellos.

<br>

<img src="../images/docs/cm-steps-simple.png" alt="Three steps" />

Justo al final, tenemos el estado *Completado* (_Complete_). Ahí es a donde queremos llegar eventualmente. Representa el momento en que la próxima pantalla se ha renderizado completamente y no está cargando más datos.

Pero antes de que nuestra pantalla pueda estar Completada, podemos necesitar cargar algunos datos o código. Cuando estamos en la próxima pantalla, pero algunas partes de ella todavía se están cargando, tenemos un estado de **Esqueleto** (_Skeleton_).

Finalmente, hay dos formas principales que nos llevan al estado de Esqueleto. Ilustraremos la diferencia entre ellos con ejemplos concretos.

### Predeterminado: Retirado → Esqueleto → Completado {#default-receded-skeleton-complete}

Abre [este ejemplo](https://codesandbox.io/s/prod-grass-g1lh5) y haz clic en "Open Profile". Verás varios estados visuales uno por uno.

* **Retirada**: Por un segundo, verás el _fallback_ `<h1>Loading the app...</h1>`.
* **Esqueleto:** Verás el componente `<ProfilePage>` y dentro `<h2>Loading posts...</h2>`.
* **Completado:** Verás el componente `<ProfilePage>` sin componentes de respaldo dentro. Todo fue cargado.

¿Cómo separamos el estado de Retirada (_Receded_) y el de Esqueleto? La diferencia entre ellos es que el estado de **Retirada** se siente como "un paso hacia atrás" para el usuario, mientras el estado **Esqueleto** se siente como "un paso hacia adelante" en nuestro progreso para mostrar más contenido.

En este ejemplo, comenzamos nuestro viaje en el componente `<HomePage>`:

```js
<Suspense fallback={...}>
  {/* pantalla anterior */}
  <HomePage />
</Suspense>
```

Después del clic, React comenzó a renderizar la próxima pantalla:

```js
<Suspense fallback={...}>
  {/* próxima pantalla */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

Tanto `<ProfileDetails>` y `<ProfileTimeline>` necesitan datos para renderizarse, así que se suspenden:

```js{4,6}
<Suspense fallback={...}>
  {/* próxima pantalla */}
  <ProfilePage>
    <ProfileDetails /> {/* ¡se suspende! */}
    <Suspense fallback={<h2>Loading posts...</h2>}>
      <ProfileTimeline /> {/* ¡se suspende! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

Cuando un componente se suspende, React necesita mostrar el _fallback_ más cercano. Pero el _fallback_ más cercano a `<ProfileDetails>` está en el nivel superior:

```js{2,3,7}
<Suspense fallback={
  // Vemos ahora este fallback a causa de <ProfileDetails>
  <h1>Loading the app...</h1>
}>
  {/* próxima pantalla */}
  <ProfilePage>
    <ProfileDetails /> {/* ¡se suspende! */}
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

Es por eso que cuando damos clic al botón, se siente como si "diéramos un paso atrás". La barrera `<Suspense>` que estaba mostrando previamente contenido útil (`<Homepage />`) tuvo que "retirarse" para mostrar el _fallback_ (`<h1>Loading the app...</h1>`). Llamamos a este estado **Retirada**.

Mientras cargamos más datos, React volverá a intentar renderizar, y `<ProfileDetails>` puede renderizar satisfactoriamente. Finalmente, estamos en el estado **Esqueleto**. Vemos la nueva página con las partes faltantes:

```js{6,7,9}
<Suspense fallback={...}>
  {/* próxima pantalla */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={
      // Vemos este fallback a causa de <ProfileTimeline>
      <h2>Loading posts...</h2>
    }>
      <ProfileTimeline /> {/* ¡se suspende! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

Eventualmente, también se cargarán, y tenemos el estado **Completado**.

Este escenario (Retirada → Esqueleto → Completado) es el predeterminado. Sin embargo, el estado de Retirada no es muy placentero, porque "esconde" información existente. Es por eso que React nos deja optar por una secuencia diferente (**Pendiente** → Esqueleto → Completado) con `useTransition`.

### Preferido: Pendiente → Esqueleto → Completado {#preferred-pending-skeleton-complete}

Cuando utilizamos `useTransition`, React nos dejará "permanecer" en la pantalla anterior y mostrar allí un indicador de progreso. Lo llamamos un estado **Pendiente**. Se siente mucho mejor que el estado de Retirada, porque ninguno de nuestro contenido existente desaparece, y la página permanece interactiva.

Puedes comparar estos dos ejemplos para sentir la diferencia:

* Predeterminado: [Retirada → Esqueleto → Completado](https://codesandbox.io/s/prod-grass-g1lh5)
* **Preferido: [Pendiente → Esqueleto → Completado](https://codesandbox.io/s/focused-snow-xbkvl)**

La única diferencia entre estos dos ejemplos es que el primero utiliza `<button>`s corrientes, pero el segundo utiliza nuestro componente `<Button>` personalizado con `useTransition`.

### Envolver funcionalidad diferida en `<Suspense>` {#wrap-lazy-features-in-suspense}

Abre [este ejemplo](https://codesandbox.io/s/nameless-butterfly-fkw5q). Cuando presiones un botón, verás el estado Pendiente por un segundo antes de continuar. Esta transición se siente bien y fluida.

Ahora añadiremos una funcionalidad completamente nueva a la página de perfil, una lista de datos curiosos sobre una persona:

```js{8,13-25}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <ProfileTrivia resource={resource} />
    </>
  );
}

function ProfileTrivia({ resource }) {
  const trivia = resource.trivia.read();
  return (
    <>
      <h2>Fun Facts</h2>
      <ul>
        {trivia.map(fact => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/focused-mountain-uhkzg)**

Si presionas ahora "Open Profile", puedes ver que hay algo mal. ¡Toma siete segundos completos para hacer la transición! Esto es porque nuestra API de juguete es demasiado lenta. Digamos que no podemos hacer nuestra API más rápida. ¿Cómo podemos mejorar la experiencia de usuario con esta restricción?

Si no queremos permanecer en el estado de Espera por demasiado tiempo, nuestro primer instinto podría ser establecer un `timeoutMs` en `useTransition` a algo más pequeño, como `3000`. Puedes probarlo [aquí](https://codesandbox.io/s/practical-kowalevski-kpjg4). Esto nos permite escapar del prolongado estado Pendiente, pero aún no tenemos nada útil que mostrar.

Hay una forma más sencilla de resolverlo. **En lugar de hacer la transición más corta, podemos "desconectar" el componente lento de la transición** al envolverlo en `<Suspense>`:

```js{8,10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/condescending-shape-s6694)**

Esto permite comprender algo importante. React siempre prefiere ir al estado Esqueleto tan pronto como sea posible. Aún si usamos transiciones con largos tiempos de espera en todos lados, React no permanecerá en el estado Pendiente por más tiempo del que sea necesario para evitar el estado de Retirada.

**Si alguna funcionalidad no es una parte vital de la nueva pantalla, envuélvela en `<Suspense>` y deja que sea cargada diferidamente.** Esto permite que podamos mostrar el resto del contenido tan rápido como sea posible. En el caso contrario, si *no vale la pena mostrar* una pantalla sin algún componente, como `<ProfileDetails>` en nuestro ejemplo, no la envuelvas en `<Suspense>`. De esta manera las transiciones "esperarán" por que esté lista.

### "Tren" de revelación de Suspense {#suspense-reveal-train}

Cuando ya estamos en la próxima pantalla, a veces los datos que se necesitan para "desbloquear" diferentes barreras `<Suspense>` llegan en una rápida sucesión. Por ejemplo, dos respuestas diferentes pueden llegar después de 1000 ms y 1050 ms, respectivamente. Si ya has esperado un segundo, esperar por 50 ms no va a ser perceptible. Es por eso que React revela las barreras `<Suspense>` con un horario, como un "tren" que arriba periódicamente. Así se intercambia una pequeña demora por la reducción de los desechos de la maquetación y del número de cambios visuales presentados al usuario.

Puedes ver un demo [aquí](https://codesandbox.io/s/admiring-mendeleev-y54mk). Las respuestas de publicaciones ("posts") y hechos curiosos ("fun facts") llegan con 100ms entre ellas. Pero React las une y "revela" de forma conjunta sus barreras Suspense. 

### Demora de un indicador de estado Pendiente {#delaying-a-pending-indicator}

Nuestro componente `Button` inmediatamente mostrará el indicador del estado Pendiente al hacer clic sobre él:

```js{2,13}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  // ...

  return (
    <>
      <button onClick={handleClick} disabled={isPending}>
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/floral-thunder-iy826)**

Aquí se le señala al usuario que está ocurriendo algún trabajo. Sin embargo, si la transición es relativamente corta (menos de 500 ms), podría ser una distracción innecesaria y hacer que la transición se sintiera *más lenta*.

Una posible solución es *demorar la muestra del propio indicador*.

```css
.DelayedSpinner {
  animation: 0s linear 0.5s forwards makeVisible;
  visibility: hidden;
}

@keyframes makeVisible {
  to {
    visibility: visible;
  }
}
```

```js{2-4,10}
const spinner = (
  <span className="DelayedSpinner">
    {/* ... */}
  </span>
);

return (
  <>
    <button onClick={handleClick}>{children}</button>
    {isPending ? spinner : null}
  </>
);
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/gallant-spence-l6wbk)**

Con este cambio, aunque estamos en el estado Pendiente, no mostramos ninguna indicación al usuario hasta que no hayan pasado los 500 ms. Esto puede parecer que no es es una gran mejora cuando las respuestas de la API son lentas. Pero compara cómo se siente [antes](https://codesandbox.io/s/thirsty-liskov-1ygph) y [después](https://codesandbox.io/s/hardcore-http-s18xr) cuando la llamada a la API es rápida. Aún cuando el resto del código no ha cambiado, la eliminación de un indicador de carga que se muestra "demasiado rápido" mejora el rendimiento percibido al no llamar la atención sobre la demora.

### Recapitulación {#recap}

Lo más importante que hemos aprendido hasta ahora es que:

* Por defecto, nuestra secuencia de carga es Retirada → Esqueleto → Completado.
* El estado de Retirada no se percibe muy bien porque esconde contenido existente.
* Con `useTransition`, podemos optar por mostrar en su lugar primero un estado Pendiente. Esto nos mantendrá en la pantalla anterior mientras se prepara la pantalla siguiente.
* Si no queremos que algún componente retrase la transición, podemos envolverlo en su propia barrera `<Suspense>`.
* En lugar de llamar a `useTransition` en cada componente, podemos incluirlo dentro de nuestro sistema de diseño.

## Otros patrones {#other-patterns}

Las transiciones son probablemente el patrón más común que te encontrarás en el Modo Concurrente, pero hay otros más que puedes encontrar de utilidad.

### Separación del estado de alta y baja prioridad {#splitting-high-and-low-priority-state}

Cuando diseñas componentes de React, comúnmente es mejor encontrar la "representación mínima" del estado. Por ejemplo, en lugar de mantener `nombre`, `apellido` y `nombreCompleto` en el estado, a menudo es mejor mantener solo `nombre` y `apellido`, y luego calcular `nombreCompleto` en el renderizado. Esto nos permite evitar errores donde actualizamos un estado, pero olvidamos el otro.

Sin embargo, en Modo Concurrente hay casos en los que quizá *quieras* "duplicar" algunos datos en diferentes variables de estado. Considera esta pequeña aplicación de traducción:

```js
const initialQuery = "Hello, world";
const initialResource = fetchTranslation(initialQuery);

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setResource(fetchTranslation(value));
  }

  return (
    <>
      <input
        value={query}
        onChange={handleChange}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Translation resource={resource} />
      </Suspense>
    </>
  );
}

function Translation({ resource }) {
  return (
    <p>
      <b>{resource.read()}</b>
    </p>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/brave-villani-ypxvf)**

Nota cómo cuando escribes en la entrada de texto, el componente `<Translation>` se suspende, y vemos el _fallback_ `<p>Loading...</p>` hasta que obtenemos resultados nuevos. Esto no es ideal. Sería mejor si pudiéramos ver la traducción *anterior* por un tiempo mientras estamos cargando la nueva.

De hecho, si abrimos la consola, veremos una advertencia:

```
Warning: App triggered a user-blocking update that suspended.

The fix is to split the update into multiple parts: a user-blocking update to provide immediate feedback, and another update that triggers the bulk of the changes.

Refer to the documentation for useTransition to learn how to implement this pattern.
```

Como mencionamos antes, si alguna actualización de estado causa que un componente se suspenda, la actualización del estado debería estar envuelta por una transición. Agreguemos `useTransition` a nuestro componente:

```js{4-6,10,13}
function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 5000
  });

  function handleChange(e) {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
      setResource(fetchTranslation(value));
    });
  }

  // ...

}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/zen-keldysh-rifos)**

Intenta escribir ahora en la entrada de texto. ¡Algo anda mal! La entrada de texto se está actualizando muy lentamente.

Resolvimos el primer problema (la suspensión fuera de una transición). Pero ahora a causa de la transición, nuestro estado no se actualiza inmediatamente. ¡Y no puede "manejar" una entrada de texto controlada!

La respuesta a este problema **es separar el estado en dos partes** una parte con "alta prioridad" que se actualiza inmediatamente y otra parte con "baja prioridad" que puede esperar por una transición.

En nuestro ejemplo, ya tenemos dos variables de estado. La texto de la entrada está en `query`, y leemos la traducción de `resource`. Queremos cambiar el estado `query` para que ocurra inmediatamente, pero los cambios a `resource` (o sea, cargar una nueva traducción) deben disparar una transición.

Así la solución correcta sería poner a `setQuery` (que no se suspende) *fuera* de la transición, y a `setResource` (que se suspenderá) *dentro* de ella.

```js{4,5}
function handleChange(e) {
  const value = e.target.value;
  
  // Fuera de la transición (urgente)
  setQuery(value);

  startTransition(() => {
    // Dentro de la transición (puede ser postergado)
    setResource(fetchTranslation(value));
  });
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/lively-smoke-fdf93)**

Con este cambio, funciona como se espera. Podemos escribir en la entrada de texto inmediatamente, y la traducción luego "se pone al día" con lo que hemos escrito.

### Postergar un valor {#deferring-a-value}

Por defecto, React siempre renderiza una interfaz consistente. Considera un código como este:

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React garantiza que en cualquier momento que miremos a estos componentes en la pantalla, reflejarán los datos del mismo `user` (usuario). Si se pasa un `user` distinto debido a una actualización del estado, los verías cambiar al unísono. No podrás nunca grabar una pantalla y encontrar un fotograma en el que se mostraran valores de distintos `user`s. (¡Si se te presenta un caso como este, reporta el error!)

Esto tiene sentido en la gran mayoría de las situaciones. Una interfaz inconsistente genera confusión y puede darle la impresión equivocada a los usuarios. (Por ejemplo, sería terrible si el botón de envío de la mensajería y el selector de conversación "no estuvieran de acuerdo" sobre qué hilo de conversación está seleccionado actualmente)

Sin embargo, en ocasiones podría ser de ayuda la introducción intencional de una inconsistencia. Podríamos hacerlo manualmente "separando" el estado como hicimos arriba, pero React también ofrece un Hook integrado para esto:

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value, {
  timeoutMs: 5000
});
```

Para demostrar esta funcionalidad, usaremos [el ejemplo del cambio de perfil](https://codesandbox.io/s/musing-ramanujan-bgw2o). Haz clic en el botón "Next" y nota como toma un segundo para hacer una transición.

Digamos que la carga de los detalles de usuarios es muy rápida y toma solo 300 milisegundos. Actualmente, estamos esperando todo un segundo, porque necesitamos tanto los detalles como las publicaciones para mostrar una página de perfil consistente. ¿Pero, y si queremos mostrar los detalles más rápidamente?

Si estamos dispuestos a sacrificar la consistencia, podemos **pasar potencialmente datos viciados a los componentes que retrasan nuestra transición**. Eso es lo que nos permite hacer `useDeferredValue()`:

```js{2-4,10,11,21}
function ProfilePage({ resource }) {
  const deferredResource = useDeferredValue(resource, {
    timeoutMs: 1000
  });
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline
          resource={deferredResource}
          isStale={deferredResource !== resource}
        />
      </Suspense>
    </Suspense>
  );
}

function ProfileTimeline({ isStale, resource }) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/vigorous-keller-3ed2b)**

La concesión que estamos haciendo aquí consiste en que `<ProfileTimeline>` será inconsistente respecto a otros componentes y potencialmente mostrará un elemento más antiguo. Haz clic en "Next" varias veces, y lo notarás. Pero gracias a eso, fuimos capaces de acortar el tiempo de la transición de 1000 ms a 300 ms.

Que sea una concesión apropiada o no depende de la situación. Pero es una herramienta útil, especialmente cuando el contenido no cambia de forma muy visible entre los elementos, y el usuario puede ni siquiera darse cuenta de que están mirando a una versión viciada por un segundo.

Es válido hacer notar que `useDeferredValue` no es *solo* útil para la carga de datos. También ayuda cuando un árbol de componentes costoso causa que una interacción (como escribir en una entrada de texto) resulte lenta. Tal como podemos "postergar" un valor que toma mucho tiempo en cargar los datos (y mostrar su valor antiguo a pesar de que los otros componentes se actualizan), podemos hacer esto con los árboles que toman mucho tiempo para renderizarse.

Por ejemplo, considera una lista filtrable como esta:

```js
function App() {
  const [text, setText] = useState("hello");

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={text} />
    </div>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/pensive-shirley-wkp46)**

En este ejemplo **cada elemento en `<MySlowList>` tiene una ralentización artificial; cada uno de ellos bloquea el hilo por unos milisegundos**. Nunca haríamos esto en una aplicación real, pero esto nos ayuda a simular lo que puede ocurrir en un árbol de componentes profundo sin un lugar obvio que optimizar.

Podemos ver ahora como cuando escribimos en la entrada de texto causa demoras. Agreguemos ahora `useDeferredValue`:

```js{3-5,18}
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, {
    timeoutMs: 5000
  });

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={deferredText} />
    </div>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/infallible-dewdney-9fkv9)**

Ahora si escribimos hay menos intermitencia (aunque pagamos por esto mostrando los resultados con una demora).

¿Cuál es la diferencia entre esto y usar *debounce*? Nuestro ejemplo tiene una demora fija artificial (3 ms por cada uno de los 80 elementos), por lo que siempre va a existir una demora, sin importar cuán rápida sea nuestra computadora. Sin embargo, el valor de `useDeferredValue` solo "va detrás" si el renderizado se toma un tiempo. No hay una espera mínima impuesta por React. Con una carga de trabajo más realista, puedes esperar que la espera se ajuste al dispositivo del usuario. En máquinas rápidas, la espera podría ser menor o no existir, en máquinas lentas, sería más notable. En ambos casos, la aplicación se mantendría con la capacidad de responder. Esa es la ventaja de este mecanismo sobre _debounce_ o _throttle_, que siempre imponen una espera mínima y que no impiden que se bloquee el hilo mientras se renderiza.

Aún cuando hay una mejora en la respuesta, este ejemplo aún no es atractivo, porque le falta al Modo Concurrente algunas optimizaciones cruciales para este caso de uso. Aún así, es interesante ver que funcionalidades como `useDeferredValue` (o `useTransition`) son útiles sin importar si estamos esperando por la red o por que termine un trabajo computacional.

### SuspenseList {#suspenselist}

`<SuspenseList>` es el último patrón relacionado con la coordinación de los estados de carga.

Considera este ejemplo:

```js{5-10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/proud-tree-exg5t)**

La duración de la llamada a la API en este ejemplo es aleatoria. Si sigues refrescándola, notarás que algunas veces las publicaciones llegan primero, y a veces lo hacen los "hechos curiosos".

Esto representa un problema. Si la respuesta para los hechos curiosos llega primero, los veremos debajo del _fallback_ `<h2>Loading posts...</h2>` de las publicaciones. Puede que comencemos a leerlos, pero entonces llegará la respuesta de las *publicaciones*, y los hechos se moverán hacia abajo. Esto es discordante.

Una forma en la que podríamos solucionarlo es poniéndolos a ambos en una sola barrera:

```js
<Suspense fallback={<h2>Loading posts and fun facts...</h2>}>
  <ProfileTimeline resource={resource} />
  <ProfileTrivia resource={resource} />
</Suspense>
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/currying-violet-5jsiy)**

El problema con esto es que ahora *siempre* esperamos por que ambos se carguen. Sin embargo, si son las *publicaciones* las primeras que llegan, no hay razón para esperar a mostrarlas. Cuando los hechos curiosos se cargan luego, no cambiarán la disposición de los elementos, porque ya están debajo de las publicaciones.

Otros enfoques a esto mismo, como componer Promesas en una forma especial, son incrementalmente difíciles de lograr cuando los estados de carga están localizados en diferentes componentes por debajo del árbol.

Para solucionarlo importaremos `SuspenseList`:

```js
import { SuspenseList } from 'react';
```

`<SuspenseList>` coordina el "orden de revelación" de los nodos `<Suspense>` más cercanos debajo de ella:

```js{3,11}
function ProfilePage({ resource }) {
  return (
    <SuspenseList revealOrder="forwards">
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </SuspenseList>
  );
}
```

**[Pruébalo en CodeSandbox](https://codesandbox.io/s/black-wind-byilt)**

La opción `revealOrder="forwards"` significa que los nodos `<Suspense>` más cercanos dentro de la lista **solo "revelarán" su contenido en el orden en que aparecen en el árbol, incluso si sus datos arriban en orden distintos**. `<SuspenseList>` tiene otros modos interesantes: intenta cambiar `"forwards"` a `"backwards"` o `"together"` y mira lo que pasa.

Puedes controlar cuántos estados de carga están visibles de una vez con la prop `tail`. Si especificamos `tail="collapsed"`, veremos *como máximo un* fallback a la vez. Puedes jugar con ella [aquí](https://codesandbox.io/s/adoring-almeida-1zzjh).

Ten presente que `<SuspenseList>` se puede componer, como cualquier cosa en React. Por ejemplo, puedes crear una matriz al poner varias filas de `<SuspenseList>` dentro de una tabla `<SuspenseList>`.

## Próximos pasos {#next-steps}

El Modo Concurrente ofrece un poderoso modelo de programación de interfaces de usuario y un conjunto de nuevas primitivas con la propiedad de composición que ayudan a coordinar experiencias de usuario placenteras.

Es el resultado de varios años de investigación y desarrollo, pero no ha concluido. En la sección de [adopción del Modo Concurrente](/docs/concurrent-mode-adoption.html), describiremos como puedes probarlo y qué puedes esperar.
