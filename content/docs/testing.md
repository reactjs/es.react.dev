---
id: testing
title: Testing Overview
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

Puedes probar un componente de React similar a como pruebas otro código JavaScript.


Hay varias formas de probar un componente React, la mayoría se agrupan en dos categorías:

* **Renderizado del árbol de componentes** en un entorno de prueba simplificado y comprobación de sus salidas.
* **Ejecutando la aplicación completa** en un entorno de prueba más realista utilizando un navegador web (más conocido como pruebas “end-to-end”).

Esta sección de la documentación está enfocada en estrategias de prueba para el primer caso. Mientras las pruebas de tipo “end-to-end” pueden ser muy útiles para prever regresiones a flujos de trabajos importantes, estas pruebas no están relacionadas con los componentes React particularmente y están fuera del alcance de esta sección.

### Concesiones {#tradeoffs}


Cuando estás eligiendo las herramientas para realizar las pruebas, vale la pena considerar algunas Concesiones:

* **Velocidad de iteración vs Entorno realista:** Algunas herramientas ofrecen un ciclo de retroalimentación muy rápido entre hacer un cambio y ver el resultado, pero no modelan el comportamiento del navegador con precisión. Otras herramientas pueden usar un entorno de navegador real, pero reducen la velocidad de iteración y son menos confiables en un servidor de integración continua.
* **Cuanto abarcar:** Cuando pruebas componentes la diferencia entre Prueba Unitaria y Prueba de Integración puede ser borrosa. Si estas probando un formulario, se deben probar los botones del formulario en esta prueba? O el componente del botón debe tener su propia suit de pruebas? Debería la refactorización del botón afectar el resultado de las pruebas del formulario?

Disferentes respuestas deben funcionar para disferentes equipos y disferentes productos.

### Herramientas recomendadas {#tools}

**[Jest](https://facebook.github.io/jest/)** Es una libreria JavaScript para la ejecución de pruebas que permite acceder al DOM via [`jsdom`](#mocking-a-rendering-surface). Aunque JSDOM solo se aproxima a como realmente los  navegadores web trabajan es suficiente para probar los componentes React. Jest brinda una gran velocidad de iteración convinada con potentes funcionalidades como moking [modules](#mocking-modules) y temporizadores [timers](#mocking-timers) esto permite tener mayor control sobre como se ejecuta el codigo.

**[Biblioteca de Pruebas para React](https://testing-library.com/react)** es una biblioteca de utilidades que te ayudan a probar componentes React sin depender de los detalles de su implementación. Este enfoque simplifica la refactorización y también lo empuja hacia las mejores prácticas de accesibilidad, aunque no proporciona una forma de renderizar "superficialmente" un componente sin sus hijos, Jest te permite hacerlo  gracias a su funcionalidad para [simular](/docs/testing-recipes.html#mocking-modules).

### Más Información {#learn-more}

Esta sección esta dividida en dos paginas:

- [Recipes](/docs/testing-recipes.html): Patrones comunes cuando escribes Pruebas para los componentes React.
- [Entornos](/docs/testing-environments.html): Que debes considerar cuando estes configurando un entorno de pruebas para componentes React.
