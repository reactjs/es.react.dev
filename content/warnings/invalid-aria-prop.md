---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

La advertencia invalid-aria-prop se activará si intentas renderizar un elemento DOM con una prop aria-* que no existe en la [especificación](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) *Accessibility Initiative* (WAI) *Accessible Rich Internet Application* (ARIA).

1. Si sientes que estás utilizando una prop válida, revisa la ortografía cuidadosamente. `aria-labelledby` y` aria-activedescendant` a menudo están mal escritas.

2. React aún no reconoce el atributo que has especificado. Esto probablemente se solucionará en una versión futura de React.
