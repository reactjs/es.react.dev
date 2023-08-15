---
title: experimental_useEffectEvent
---

<Wip>

**Esta API es experimental y aún no está disponible en una versión estable de React.**

Puedes probarla actualizando los paquetes de React a la versión experimental más reciente:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Las versiones experimentales de React pueden contener errores. No las uses en producción.

</Wip>


<Intro>

`useEffectEvent` es un Hook de React que te permite extraer lógica no reactiva en un [Evento de Efecto](/learn/separating-events-from-effects#declaring-an-effect-event).

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />
