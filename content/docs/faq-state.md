---
id: faq-state
title: Estado del componente
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### ¿Qué hace `setState`? {#what-does-setstate-do}

`setState()` programa una actualización al objeto `estado` de un componente. Cuando el estado cambia, el componente responde volviendo a renderizar.

### ¿Cuál es la diferencia entre `state` y `props`? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) (abreviatura de "*properties*") y [`state`](/docs/state-and-lifecycle.html) son objetos planos de JavaScript. Mientras ambos contienen información que influye en el resultado del render, son diferentes debido a una importante razón: `props` se pasa *al* componente (similar a los parámetros de una función) mientras que `state` se administra *dentro* del componente (similar a las variables declaradas dentro de una función).

Aquí hay algunos buenos recursos para leer más sobre cuándo usar `props` vs. `estado`:
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### ¿Por qué `setState` me está dando el valor incorrecto? {#why-is-setstate-giving-me-the-wrong-value}

En React, tanto `this.props` como `this.state` representan los valores *renderizados*, es decir, lo que hay actualmente en la pantalla.

Las llamadas a `setState` son asíncronas; no te fíes de que `this.state` refleje el nuevo valor inmediatamente después de llamar a `setState`. Pasa una función de actualización en lugar de un objeto si necesitas calcular valores en función del estado actual (revisa a continuación para más detalles).

Ejemplo de código que *no* se comportará como se espera:

```jsx
incrementCount() {
  // Nota: esto *no* funcionará como se espera.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // Digamos que `this.state.count` se inicia en 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // Cuando React rerenderiza el componente, `this.state.count` será 1, pero tu esperabas 3.

  // Esto es porque la función anterior `incrementCount()` lee de `this.state.count`,
  // pero React no actualiza `this.state.count` hasta que el componente se vuelve a renderizar.
  // Entonces `incrementCount()` termina leyendo `this.state.count` como 0 cada vez, y lo establece a 1.

  // ¡La solución se describe a continuación!
}
```

Ve a continuación cómo solucionar este problema.

### ¿Cómo actualizo el estado con valores que dependen del estado actual? {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

Pasa una función en lugar de un objeto a `setState` para asegurarte de que la llamada siempre use la versión más actualizada del estado (ver más abajo).

### ¿Cuál es la diferencia entre pasar un objeto o una función en `setState`? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

Pasar una función de actualización te permite acceder al valor del estado actual dentro del actualizador. Dado que las llamadas a `setState` son por lotes, esto te permite encadenar actualizaciones y asegurarte de que se construyan una encima de otra en lugar de generar conflictos:

```jsx
incrementCount() {
  this.setState((state) => {
    // Importante: lee `state` en vez de `this.state` al actualizar.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // Digamos que `this.state.count` inicia en 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // Si lees `this.state.count` ahora, aún sería 0.
  // Pero cuando React vuelva a renderizar el componente, será 3.
}
```

[Aprende más sobre setState](/docs/react-component.html#setstate)

### ¿Cuándo `setState` es asíncrono? {#when-is-setstate-asynchronous}

Actualmente, `setState` es asíncrono dentro de los controladores de eventos.

Esto garantiza, por ejemplo, que si `Parent` y `Child` llaman a `setState` durante un evento de click, `Child` no se renderiza dos veces. En su lugar, React "vacía" las actualizaciones del estado al final del evento del navegador. Esto se traduce en mejoras significativas de rendimiento en aplicaciones más grandes.

Este es un detalle de implementación, así que evita confiar en él directamente. En las versiones futuras, React realizará actualizaciones por lotes por defecto en más casos.

### ¿Por qué React no actualiza `this.state` de forma sincrónica? {#why-doesnt-react-update-thisstate-synchronously}

Como se explicó en la sección anterior, React intencionalmente "espera" hasta que todos los componentes llamen a `setState()` en sus controladores de eventos antes de comenzar a rerenderizar. Esto aumenta el rendimiento al evitar rerenderizados innecesarios.

Sin embargo, es posible que aún te estés preguntando por qué React no solo actualiza 'this.state' inmediatamente sin volver a renderizar.

Hay dos razones principales:

* Esto rompería la consistencia entre `props` y `state`, causando problemas que son muy difíciles de depurar.
* Esto haría que algunas de las nuevas funcionalidades en las que estamos trabajando sean imposibles de implementar.

Este [comentario de GitHub](https://github.com/facebook/react/issues/11527#issuecomment-360199710) profundiza en los ejemplos específicos.

### ¿Debo usar una biblioteca de manejo de estado como Redux o MobX? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[Tal vez.](https://redux.js.org/faq/general#when-should-i-use-redux)

Es una buena idea conocer primero React, antes de agregar bibliotecas adicionales. Puedes construir aplicaciones bastante complejas usando solo React.
