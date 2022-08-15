---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

La advertencia invalid-aria-prop se activará si intentas renderizar un elemento DOM con una prop aria-* que no existe en la [especificación](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) *Accessibility Initiative* (WAI) *Accessible Rich Internet Application* (ARIA).

1. Si sientes que estás utilizando una prop válida, revisa la ortografía cuidadosamente. `aria-labelledby` y` aria-activedescendant` a menudo están mal escritas.

<<<<<<< HEAD
2. React aún no reconoce el atributo que has especificado. Esto probablemente se solucionará en una versión futura de React.
=======
2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
>>>>>>> 5fed75dac5f4e208369b102a1337d76944111b33
