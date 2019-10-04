---
id: testing
title: Visión general de pruebas
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

Puedes probar un componente de React similar a como pruebas otro código JavaScript.

Hay varias formas de probar un componente React, la mayoría se agrupan en dos categorías:

* **Renderizado del árbol de componentes** en un entorno de prueba simplificado y comprobando sus salidas.
* **Ejecutando la aplicación completa** en un entorno de prueba más realista utilizando un navegador web (más conocido como pruebas “end-to-end”).

Esta sección de la documentación está enfocada en estrategias de prueba para el primer caso. Mientras las pruebas de tipo “end-to-end” pueden ser muy útiles para prever regresiones a flujos de trabajos importantes, estas pruebas no están relacionadas con los componentes React particularmente y están fuera del alcance de esta sección.

### Concesiones {#tradeoffs}


Cuando estás eligiendo las herramientas para realizar las pruebas, vale la pena considerar algunas Concesiones:

* **Velocidad de iteración vs Entorno realista:** Algunas herramientas ofrecen un ciclo de retroalimentación muy rápido entre hacer un cambio y ver el resultado, pero no modelan el comportamiento del navegador con precisión. Otras herramientas pueden usar un entorno de navegador real, pero reducen la velocidad de iteración y son menos confiables en un servidor de integración continua.
* **Cuanto abarcar:** Cuando pruebas componentes la diferencia entre Prueba Unitaria y Prueba de Integración puede ser borrosa. Si estás probando un formulario, se deben probar los botones del formulario en esta prueba? O el componente del botón debe tener su propia suit de pruebas? Debería la refactorización del botón afectar el resultado de las pruebas del formulario?

Diferentes respuestas pueden funcionar para diferentes equipos y diferentes productos.

### Herramientas recomendadas {#tools}

**[Jest](https://facebook.github.io/jest/)** Es una biblioteca de JavaScript para ejecución de pruebas que permite acceder al DOM mediante [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface). Aunque jsdom solo se aproxima a como realmente los navegadores web trabajan, usualmente es suficiente para probar componentes de React. Jest brinda una gran velocidad de iteración combinada con potentes funcionalidades como simular [módulos](/docs/testing-environments.html#mocking-modules) y [temporizadores](/docs/testing-environments.html#mocking-timers), esto permite tener mayor control sobre cómo se ejecuta el código.

**[Biblioteca de Pruebas para React](https://testing-library.com/react)** es una biblioteca de utilidades que te ayudan a probar componentes React sin depender de los detalles de su implementación. Este enfoque simplifica la refactorización y también lo empuja hacia las mejores prácticas de accesibilidad, aunque no proporciona una forma de renderizar "superficialmente" un componente sin sus hijos, Jest te permite hacerlo  gracias a su funcionalidad para [simular](/docs/testing-recipes.html#mocking-modules).

### Más Información {#learn-more}

Esta sección está dividida en dos páginas:

- [Recetas](/docs/testing-recipes.html): Patrones comunes cuando escribes pruebas para componentes React.
- [Entornos](/docs/testing-environments.html): Que debes considerar cuando estés configurando un entorno de pruebas para componentes React.
