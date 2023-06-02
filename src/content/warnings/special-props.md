---
title: Advertencia de props especiales
---

En un elemento JSX, la mayoría de las props se pasan al componente, pero hay dos props especiales (`ref` y `key`) que React utiliza y que no se transmiten al componente.

Por ejemplo, no es posible acceder a `props.key` desde un componente. Si necesitas utilizar ese valor dentro del componente hijo, debes pasar el valor como una prop diferente (por ejemplo: `<ListItemWrapper key={result.id} id={result.id} />` y leer `props.id`). Aunque parezca redundante, es importante separar la lógica de la aplicación de las pistas para React.
