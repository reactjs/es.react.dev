---
id: concurrent-mode-reference
title: Referencia del API del modo concurrente (Experimental)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Advertencia:
>
>Esta página describe **funcionalidades experimentales que [aún no están disponibles](/docs/concurrent-mode-adoption.html) en una versión estable**. No dependas de compilados experimentales de React en aplicaciones en producción. Estas funcionalidades pueden cambiar significativamente y sin previo aviso antes de formar parte de React.
>
>Esta documentación está dirigida a usuarios pioneros y personas curiosas. **Si te estás iniciando en React, no te preocupes por estas funcionalidades,** no necesitas aprenderlas inmediatamente.

</div>

Esta página es una referencia del API del [Modo concurrente](/docs/concurrent-mode-intro.html) de React. Si estás buscando una guía de introducción, revisa [Patrones concurrentes en interfaces de usuario](/docs/concurrent-mode-patterns.html).

**Nota: Esto es un una vista previa de la comunidad y no es la versión final estable. Es probable que existan futuros cambios a estas APIs. ¡Úsalas bajo tu propio riesgo!**

- [Habilitando el modo concurrente](#concurrent-mode)
    - [`createRoot`](#createroot)
    - [`createBlockingRoot`](#createblockingroot)
- [Suspense](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## Habilitando el modo concurrente {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

Reemplaza `ReactDOM.render(<App />, rootNode)` y habilita el Modo concurrente.

Para más información del Modo concurrente, revisa la [documentación del modo concurrente.](/docs/concurrent-mode-intro.html)

### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

Reemplaza `ReactDOM.render(<App />, rootNode)` y habilita el [Modo de bloqueo](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode).

Optar por el Modo concurrente introduce cambios semánticos en como React funciona. Esto siginifca que no puedes usar el Modo concurrente en solo algunos componentes. Por lo tanto, algunas aplicaciones no estarían aptas de realizar una migración directa hacia el Modo concurrente.

El Modo de bloqueo solo contiene pequeños subconjuntos de las características del Modo concurrente y está pensado como un paso de migración intermedia para aplicaciones que no puedan migrar directamente.

## API de Suspense {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` permite que tus componentes "esperen" algo antes de que puedan renderizar, mostrando un contenido de respaldo mientras esperan.

En este ejemplo, `ProfileDetails` está esperando una llamada asíncrona del API para obtener algunos datos. Mientras esperamos a `ProfileDetails` y `ProfilePhoto`, vamos a ir mostrando `Loading...` como contenido de respaldo mientras tanto. Es importante tener en cuenta que hasta que todos los hijos de `<Suspense>` hayan cargado, continuaremos mostrando el contenido de respaldo.

`Suspense` lleva dos props:
* **fallback** lleva un indicador de carga. El contenido de respaldo es mostrado hasta que todos los hijos de `Suspense` hayan terminado de renderizar.
* **unstable_avoidThisFallback** lleva un booleano. Le dice a React si debe "omitir" revelar este límite durante la carga inicial. Es probable que esta API sea eliminada en una versión futura.

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` ayuda a coordinar muchos componentes que pueden suspenderse organizando el orden en que estos componentes se muestran al usuario.

Cuando varios componentes necesitan obtener datos, estos datos pueden llegar en un orden impredecible. Sin embargo, si envuelves estos elementos en un `SuspenseList`, React no mostrará un elemento de la lista hasta que todos los elementos anteriores se hayan mostrado (este comportamiente es ajustable).

`SuspenseList` lleva dos props:
* **revealOrder (forwards, backwards, together)** define el orden en el cual los hijos de `SuspenseList` deberían ser mostrados.
  * `together` muestra *todos* ellos cuando estén listos en lugar de uno por uno.
* **tail (collapsed, hidden)** decide como los contenidos de respaldo en un `SuspenseList` son mostrados. 
    * Por defecto, `SuspenseList` va a mostrar todos los contenidos de respaldo en la lista.
    * `collapsed` solo muestra el siguiente contenido de respaldo en la lista.
    * `hidden` no muestra ningun contenido de respaldo.

Tener en cuenta que `SuspenseList` solo funciona en los componentes `Suspense` y `SuspenseList` más cercanos debajo de él. No busca límites más profundos que un nivel. Sin embargo, es posible anidar múltiples componentes `SuspenseList` entre sí para construir grillas.

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` permite a los componentes evitar estados de carga no deseada al esperar que se cargue el contenido antes de **transicionar hacia la siguiente pantalla**. También permite que los componentes difieran las actualizaciones de datos obtenidos más lentas hasta la siguiente renderización, de modo que se puedan presentar actualizaciones más cruciales de inmediato.

El hook `useTransition` retorna dos valores en un array.
* `startTransition` es una función que toma un callback. Nosotros podemos usarlo para decirle a React cual estado queremos diferir.
* `isPending` es un booleano. Es la manera en que React nos informa si estamos esperando que la transición termine.

**Si alguna actualización de estado causa que un componente se suspenda, esa actualización de estado debería estar envuelta en una transición.**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
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
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

En este código, envolvimos nuestra obtención de datos con `startTransition`. Esto nos permite empezar a obtener los datos del perfil de inmediato, mientras diferimos el renderizado de la siguiente página de perfil y su `Spinner` asociado durante 2 segundos (el tiempo mostrado en `timeoutMs`).

El booleano `isPending` le permite a React saber si nuestro componente está transicionando, por lo que somos capaces de informar al usuario esto mostrando algun texto de carga en la página de perfil anterior.

**Para una mirada a profundidad en transiciones, puedes leer [Patrones concurrentes en interfaces de usuario](/docs/concurrent-mode-patterns.html#transitions).**

#### Configuración de useTransition {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition` acepta una **Configuración de suspenso opcional** con un `timeoutMs`. Este tiempo de espera (en milisegundos) le dice a React cuánto tiempo esperar antes de mostrar el siguiente estado (la nueva página de perfil en el ejemplo anterior).

**Nota: Recomendamos que compartas tu Configuración de suspenso entre diferentes módulos.**


### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

Retorna una versión diferida del valor que puede "quedarse atrás" con un máximo de `timeoutMs`.

Esto se usa comúnmente para mantener la interfaz responsiva cuando tienes algo que se renderiza inmediatamente basado en la entrada del usuario y algo que necesita esperar para obtener un dato.

Un buen ejemplo de esto es una entrada de texto.

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 }); 

  return (
    <div className="App">
      {/* Sigue pasando el texto actual a la entrada */}
      <input value={text} onChange={handleChange} />
      ...
      {/* Pero la lista tiene permitido "quedarse atrás" cuando sea necesario */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

Esto nos permite empezar a mostrar el nuevo texto para el `input` inmediatamente, lo que permite que la página se sienta responsiva. Mientras tanto, `MySlowList` "se queda atrás" por hasta 2 segundos de acuerdo con `timeoutMs` antes de actualizar, permitiendo renderizar con el texto actual en segundo plano.

**Para una mirada a profundidad en valores diferidos, puedes leer [Patrones concurrentes en interfaces de usuario](/docs/concurrent-mode-patterns.html#deferring-a-value).**

#### Configuración de useDeferredValue {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue` acepta una **Configuración de suspenso opcional** con un `timeoutMs`. Este tiempo de espera (en milisegundos) le dice a React cuánto tiempo se puede retrasar el valor diferido.

React siempre intentará usar un retraso más corto cuando la red y el dispositivo se lo permitan.
