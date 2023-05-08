---
title: Advertencia de Prop ARIA invalida
---

Esta advertencia se activará si intentas representar un elemento del DOM con una propiedad `aria-*` que no existe en la Iniciativa de Accesibilidad Web (WAI) Aplicaciones de internet accesiblemente ricas (ARIA) [especificación](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Si crees que estás utilizando un prop válido, verifica la ortografía cuidadosamente. `aria-labelledby` y `aria-activedescendant` a menudo están mal escritos.

2. Si escribiste `aria-role`, es posible que hayas querido decir `role`.

3. De lo contrario, si estás en la última versión de React DOM y verificaste que estás usando un nombre de propiedad válido que figura en la especificación ARIA, [informe un error](https://github.com/facebook/react/issues/new/choose).
