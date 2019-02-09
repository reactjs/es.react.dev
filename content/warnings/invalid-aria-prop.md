---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

La advertencia invalid-aria-prop se activará si intentas renderizar un elemento DOM con un aria-* prop que no existe en la Iniciativa de accesibilidad web (WAI) Aplicación de Internet enriquecida accesible (ARIA) [especificación](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Si sientes que estás utilizando un prop válido, revisa la ortografía cuidadosamente. `aria-labelledby` y` aria-activedescendant` a menudo están mal escritas.

2. React aún no reconoce el atributo que has especificado. Esto probablemente se solucionará en una versión futura de React. Sin embargo, React actualmente elimina todos los atributos desconocidos, por lo que especificarlos en su aplicación React no hará que se renderizen
