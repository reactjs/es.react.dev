---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

La advertencia invalid-aria-prop se activará si intentas renderizar un elemento DOM con una prop aria-* que no existe en la [especificación](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) *Accessibility Initiative* (WAI) *Accessible Rich Internet Application* (ARIA).

1. Si sientes que estás utilizando una prop válida, revisa la ortografía cuidadosamente. `aria-labelledby` y` aria-activedescendant` a menudo están mal escritas.

2. Si escribiste `aria-role`, puede que hayas querido decir `role`.

3. En otro caso, si estás en la última versión de React DOM y verificaste que estás usando un nombre de propiedad válido listado en la especificación ARIA, por favor [reporta un bug](https://github.com/facebook/react/issues/new/choose).
