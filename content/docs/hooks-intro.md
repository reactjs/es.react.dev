---
id: hooks-intro
title: Presentando Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks* son una nueva característica en React 16.8. Estos te permiten usar el estado y otras características de React sin escribir una clase.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Declara una nueva variable de estado, la cual llamaremos “count”
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Esta nueva función `useState` es el primer "Hook" que vamos a aprender, pero este ejemplo es solo una introducción. ¡No te preocupes si aún no tiene sentido!

**Puedes empezar a aprender Hooks [en la siguiente página](/docs/hooks-overview.html).** En esta página, continuaremos explicando por qué estamos agregando Hooks a React y cómo estos pueden ayudarte a escribir aplicaciones grandiosas.

>Nota
>
>React 16.8.0 es la primera versión que es compatible con Hooks. Al actualizar, no olvides actualizar todos los paquetes, incluyendo React DOM.
>React Native es compatible con Hooks desde [la versión 0.59 de React Native](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059).

## Video de introducción {#video-introduction}

En el React Conf 2018, Sophie Alpert y Dan Abramov presentaron Hooks, seguidos por Ryan Florence demostrando cómo refactorizar una aplicación usándolos. Mira el video aquí:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Sin cambios con rupturas {#no-breaking-changes}

Antes de continuar, debes notar que los Hooks son:

* **Completamente opcionales.** Puedes probar Hooks en unos pocos componentes sin reescribir ningún código existente. Pero no tienes que aprender o usar Hooks ahora mismo si no quieres.
* **100% compatibles con versiones anteriores.** Los Hooks no tienen cambios con rupturas con respecto a versiones existentes.
* **Disponibles de inmediato.** Los Hooks ya están disponibles con el lanzamiento de la versión v16.8.0.

**No hay planes para remover el modelo de clases de React.** Puedes leer más sobre la estrategia de adopción gradual de Hooks en la [sección inferior](#gradual-adoption-strategy) de esta página.

**Los Hooks no reemplazan tu conocimiento de los conceptos de React.** Por el contrario, los Hooks proporcionan una API más directa a los conceptos que ya conoces de React: _props_, estado, contexto, referencias, y ciclo de vida. Como veremos más adelante, los hooks también ofrecen una nueva y poderosa forma de combinarlos.

**Si sólo quieres empezar a aprender a usar hooks, ¡no dudes en [saltar directamente a la siguiente página!](/docs/hooks-overview.html)** También puedes seguir leyendo esta página para saber más acerca de por qué estamos añadiendo Hooks y cómo vamos a empezar a usarlos sin tener que reescribir nuestras aplicaciones.

## Motivación {#motivation}

Los Hooks resuelven una amplia variedad de problemas aparentemente desconectados en React que hemos encontrado durante más de cinco años de escribir y mantener decenas de miles de componentes. Ya sea que estés aprendiendo React, usándolo diariamente o incluso prefieras una librería diferente con un modelo de componentes similar, es posible que reconozcas algunos de estos problemas.

### Es difícil reutilizar la lógica de estado entre componentes {#its-hard-to-reuse-stateful-logic-between-components}

React no ofrece una forma de "acoplar" comportamientos re-utilizables a un componente (Por ejemplo, al conectarse a un _store_). Si llevas un tiempo trabajando con React, puedes estar familiarizado con patrones como [render props](/docs/render-props.html) y [componentes de orden superior](/docs/higher-order-components.html) que tratan resolver esto. Pero estos patrones requieren que reestructures tus componentes al usarlos, lo cual puede ser complicado y hacen que tu código sea más difícil de seguir. Si observas una aplicación típica de React usando _React DevTools_, Lo más probable es que encuentres un "wrapper hell" de componentes envueltos en capas de _providers_, _consumers_, _componentes de orden superior_, _render props_, y otras abstracciones. Aunque podemos [filtrarlos usando las DevTools](https://github.com/facebook/react-devtools/pull/503), esto apunta a un problema aún más profundo: React necesita una mejor primitiva para compartir lógica de estado.

Con Hooks, puedes extraer lógica de estado de un componente de tal forma que este pueda ser probado y re-usado independientemente. **Los Hooks te permiten reutilizar lógica de estado sin cambiar la jerarquía de tu componente.** Esto facilita el compartir Hooks entre muchos componentes o incluso con la comunidad.

Discutiremos esto más a fondo en [Construyendo tus propios Hooks](/docs/hooks-custom.html).

### Los componentes complejos se vuelven difíciles de entender {#complex-components-become-hard-to-understand}

A menudo tenemos que mantener componentes que empiezan simples pero con el pasar del tiempo crecen y se convierten en un lío inmanejable de multiples lógicas de estado y efectos secundarios. Cada método del ciclo de vida a menudo contiene una mezcla de lógica no relacionada entre sí. Por ejemplo, los componentes pueden realizar alguna consulta de datos en el `componentDidMount` y `componentDidUpdate`. Sin embargo, el mismo método `componentDidMount` también puede contener lógica no relacionada que cree escuchadores de eventos, y los limpie en el `componentWillUnmount`. El código relacionado entre sí y que cambia a la vez es separado, pero el código que no tiene nada que ver termina combinado en un solo método. Esto hace que sea demasiado fácil introducir errores e inconsistencias.

En muchos casos no es posible dividir estos componentes en otros más pequeños porque la lógica de estado está por todas partes. También es difícil probarlos. Esta es una de las razones por las que muchas personas prefieren combinar React con una librería de administración de estado separada. Sin embargo, esto a menudo introduce demasiada abstracción, requiere que saltes entre diferentes archivos, y hace que la reutilización de componentes sea más difícil.

Para resolver esto, **Hooks te permite dividir un componente en funciones más pequeñas basadas en las piezas relacionadas (como la configuración de una suscripción o la consulta de datos)**,  en lugar de forzar una división basada en los métodos del ciclo de vida. También puedes optar por administrar el estado local del componente con un _reducer_ para hacerlo más predecible.

Discutiremos esto más a fondo en [Usando el *Hook* de efecto](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Las clases confunden tanto a las personas como a las máquinas{#classes-confuse-both-people-and-machines}

Además de dificultar la reutilización y organización del código, hemos descubierto que las clases pueden ser una gran barrera para el aprendizaje de React. Tienes que entender cómo funciona `this` en JavaScript, que es muy diferente a cómo funciona en la mayoría de los lenguajes. Tienes que recordar agregar _bind_ a tus manejadores de eventos. Sin inestables [propuestas de sintaxis](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), el código es muy verboso. Las personas pueden entender _props_, el estado, y el flujo de datos de arriba hacia abajo perfectamente, pero todavía tiene dificultades con las clases. La distinción entre componentes de función y de clase en React y cuándo usar cada uno de ellos lleva a desacuerdos incluso entre los desarrolladores experimentados de React.

Además, React ha estado en el mercado durante unos cinco años, y queremos asegurarnos de que siga siendo relevante en los próximos cinco años. Como muestran [Svelte](https://svelte.dev/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), y otros, la [compilación anticipada](https://es.wikipedia.org/wiki/Compilaci%C3%B3n_anticipada) de componentes tiene mucho potencial a futuro. Especialmente si no se limita a las plantillas. Recientemente, hemos estado experimentando con el [encarpetado de componentes](https://github.com/facebook/react/issues/7323) usando [Prepack](https://prepack.io/), y hemos visto resultados preliminares prometedores. Sin embargo, encontramos que los componentes de clase pueden fomentar patrones involuntarios que hacen que estas optimizaciones nos lleven a un camino más lento. Las clases también presentan problemas para las herramientas de hoy en día. Por ejemplo, las clases no minifican muy bien, y hacen que la recarga en caliente sea confusa y poco fiable. Queremos presentar una API que hace más probable que el código se mantenga en la ruta optimizable.

Para resolver estos problemas, **Hooks te permiten usar más de las funciones de React sin clases.** Conceptualmente, los componentes de React siempre han estado más cerca de las funciones. Los Hooks abarcan funciones, pero sin sacrificar el espíritu práctico de React. Los Hooks proporcionan acceso a vías de escape imprescindibles y no requieren que aprendas técnicas complejas de programación funcional o reactiva.

>Ejemplos
>
>[Hooks a simple vista](/docs/hooks-overview.html) es un buen lugar para comenzar a aprender Hooks.

## Estrategia de adopción gradual {#gradual-adoption-strategy}

>**TLDR: No hay planes para eliminar las clases de React.**

Sabemos que los desarrolladores de React están enfocados en la creación de productos de software y no tienen tiempo para analizar cada nueva API que se está lanzando. Los Hooks son muy nuevos, y tal vez sea mejor esperar más ejemplos y tutoriales antes de pensar en aprenderlos o adoptarlos.

También entendemos que la barra para añadir una nueva primitiva a React es extremadamente alta. Para los lectores curiosos, hemos preparado un [RFC detallado](https://github.com/reactjs/rfcs/pull/68) que se sumerge en la motivación con más detalles y proporciona una perspectiva extra sobre las decisiones de diseño específicas y el estado de la técnica relacionado.

**Es crucial, que los Hooks trabajen codo a codo con el código existente para que puedas adoptarlos gradualmente.** No hay prisa por migrar a los Hooks. Recomendamos evitar cualquier "gran reescritura", especialmente para componentes de clase complejos que ya existan. Se necesita un poco de cambio de mentalidad para empezar a "pensar en Hooks". En nuestra experiencia, es mejor practicar primero el uso de Hooks en componentes nuevos y no críticos, y asegurarnos de que todos los miembros del equipo se sientan cómodos con ellos. Después de que le des una oportunidad a Hooks, por favor siéntete libre de [enviarnos tus comentarios](https://github.com/facebook/react/issues/new), positivos o negativos.

Pretendemos que Hooks cubra todos los casos de uso existentes para las clases, pero **seguiremos soportando los componentes de clase en un futuro previsible.** En Facebook, tenemos decenas de miles de componentes escritos como clases, y no tenemos absolutamente ningún plan para reescribirlos. En su lugar, estamos empezando a usar Hooks en el nuevo código junto con las clases.

## Preguntas frecuentes {#frequently-asked-questions}

Hemos preparado una página de [Preguntas frecuentes acerca de Hooks](/docs/hooks-faq.html) que responde a las preguntas más frecuentes sobre Hooks.

## Próximos pasos {#next-steps}

Al final de esta página, deberías tener una idea aproximada de los problemas que los Hooks están resolviendo, pero muchos detalles probablemente no están claros. ¡No te preocupes! **Ahora vayamos a la [siguiente página](/docs/hooks-overview.html) donde empezamos a aprender sobre los Hooks por medio de ejemplos.**
