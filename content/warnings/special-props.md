---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

La mayoría de los props en elementos JSX se pasan al componente, sin embargo, hay dos props especiales (`ref` y `key`) que son utilizados por React, y por lo tanto no se reenvían al componente.

Por ejemplo, intentar acceder a `this.props.key` desde un componente (es decir, la función render o [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) no está definida. Si necesita acceder al mismo valor dentro del componente hijo, debe pasarlo como un prop diferente (por ejemplo: `<ListItemWrapper key={result.id} id={result.id} />`). Si bien esto puede parecer redundante, es importante separar la lógica de la aplicación de las sugerencias de conciliación.
