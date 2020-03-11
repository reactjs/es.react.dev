---
id: profiler
title: API Profiler
layout: docs
category: Reference
permalink: docs/profiler.html
---

El `Profiler` (perfilador o generador de perfiles) mide con qué frecuencia se renderiza una aplicación React y cuál es el "costo" del renderizado.
Su propósito es ayudar a identificar partes de una aplicación que son lentas y pueden beneficiarse de [optimizaciones como la memoización](/docs/hooks-faq.html#how-to-memoize-calculations).

> Nota:
>
> La creación de perfiles agrega una sobrecarga adicional, por lo que **está deshabilitada en [la compilación de producción](/docs/optimizing-performance.html#use-the-production-build)**.
>
> Para acceder al análisis de rendimiento en producción, React proporciona una compilación de producción especial con la generación de perfiles habilitada.
> Lea más sobre cómo usar esta compilación en [fb.me/react-profiling](https://fb.me/react-profiling)

## Uso {#usage}

Se puede agregar un `Profiler` en cualquier parte de un árbol React para medir el costo de renderizar esa parte del árbol.
Requiere dos props: un `id` (string) y un callback `onRender` (función) que React llama cada vez que un componente dentro del árbol "confirma" una actualización.

Por ejemplo, para perfilar un componente `Navigation` y sus descendientes:

```js{3}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

Se pueden usar múltiples componentes `Profiler` para medir diferentes partes de una aplicación:
```js{3,6}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

Los componentes `Profiler` también se pueden anidar para medir diferentes componentes dentro del mismo subárbol:
```js{2,6,8}
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

> Nota
>
> Aunque `Profiler` es un componente liviano, debe usarse solo cuando sea necesario; cada uso agrega algo de sobrecarga de CPU y memoria a una aplicación.

## Callback `onRender` {#onrender-callback}

El `Profiler` requiere una función `onRender` como una prop.
React llama a esta función cada vez que un componente dentro del árbol perfilado "confirma" una actualización.
Recibe parámetros que describen lo que se procesó y cuánto tiempo tardó.

```js
function onRenderCallback(
  id, // la prop "id" del árbol Profiler que acaba de ser "confirmado"
  phase, // ya sea "mount" (si el árbol acaba de ser montado) o "update" (si se volvió a renderizar)
  actualDuration, // tiempo dedicado a procesar la actualización confirmada
  baseDuration, // tiempo estimado para renderizar todo el subárbol sin memoización
  startTime, // cuando React comenzó a procesar esta actualización
  commitTime, // cuando React confirmó esta actualización
  interactions // el conjunto de interacciones pertenecientes a esta actualización
) {
  // Agregar o registrar tiempos de renderizado ...
}
```

Echemos un vistazo más de cerca a cada uno de las props:

* **`id: string`** - 
La prop `id` del árbol` Profiler` que acaba de ser confirmado.
Esto se puede usar para identificar qué parte del árbol se confirmó si está utilizando varios perfiladores.
* **`phase: "mount" | "update"`** -
Identifica si el árbol se acaba de montar por primera vez o se vuelve a renderizar debido a un cambio en las props, el estado o los hooks.
* **`actualDuration: number`** -
Tiempo dedicado a renderizar el `Profiler` y sus descendientes para la actualización actual.
Esto indica qué tan bien el subárbol utiliza la memoización. (e.g. [`React.memo`](/docs/react-api.html#reactmemo), [`useMemo`](/docs/hooks-reference.html#usememo), [`shouldComponentUpdate`](/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)).
Idealmente, este valor debería disminuir significativamente después del montaje inicial, ya que muchos de los descendientes solo necesitarán volver a renderizar si cambian sus props específicas.
* **`baseDuration: number`** -
Duración del tiempo de renderizado más reciente para cada componente individual dentro del árbol de `Profiler`.
Este valor estima el costo de renderizado en el peor de los casos (por ejemplo, el montaje inicial o un árbol sin memoización).
* **`startTime: number`** -
Marca de tiempo cuando React comenzó a procesar la actualización actual.
* **`commitTime: number`** -
Marca de tiempo cuando React confirmó la actualización actual.
Este valor se comparte entre todos los perfiladores en una confirmación, lo que les permite agruparse si lo desean.
* **`interactions: Set`** -
Conjunto de ["interacciones"](https://fb.me/react-interaction-tracing) que se estaban rastreando cuando la actualización estaba programada (por ejemplo, cuando se llamó a `render` o` setState`).

> Nota
>
> Las interacciones se pueden usar para identificar la causa de una actualización, aunque la API para rastrearlas aún es experimental.
>
> Obtenga más información al respecto en [fb.me/react-interaction-tracing](https://fb.me/react-interaction-tracing)
