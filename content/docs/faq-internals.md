---
id: faq-internals
title: DOM virtual y detalles de implementación
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### ¿Qué es el DOM virtual? {#what-is-the-virtual-dom}

El DOM virtual (VDOM) es un concepto de programación donde una representación ideal o "virtual" de la IU se mantiene en memoria y en sincronía con el DOM "real", mediante una biblioteca como ReactDOM. Este proceso se conoce como [reconciliación](/docs/reconciliation.html).

Este enfoque hace posible la API declarativa de React: le dices a React en qué estado quieres que esté la IU, y se hará cargo de llevar el DOM a ese estado. Esto abstrae la manipulación de atributos, manejo de eventos y actualización manual del DOM que de otra manera tendrías que usar para construir tu aplicación.

Ya que "DOM virtual" es más un patrón que una tecnología específica, las personas a veces le dan significados diferentes. En el mundo de React, el término "DOM virtual" es normalmente asociado con [elementos de React](/docs/rendering-elements.html) ya que son objetos representando la interfaz de usuario. Sin embargo, React también usa objetos internos llamados "fibers" para mantener información adicional acerca del árbol de componentes. Éstos pueden ser también considerados como parte de la implementación de "DOM virtual" de React.

### ¿Es el Shadow DOM lo mismo que el DOM virtual? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

No, son diferentes. El Shadow DOM es una tecnología de los navegadores diseñada principalmente para limitar el alcance de variables y CSS en componentes web. El DOM virtual es un concepto que implementan bibliotecas en JavaScript por encima de las APIs de los navegadores.

### ¿Qué es "React Fiber"? {#what-is-react-fiber}

Fiber es el nuevo motor de reconciliación en React 16. Su principal objetivo es permitir el renderizado incremental del DOM virtual. [Leer más](https://github.com/acdlite/react-fiber-architecture).
