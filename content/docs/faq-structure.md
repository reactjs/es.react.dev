---
id: faq-structure
title: Estructura de archivos
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### ¿Hay una forma recomendada de estructurar los proyectos React? {#is-there-a-recommended-way-to-structure-react-projects}

React no tiene opiniones sobre cómo poner los archivos en carpetas. Dicho esto, hay algunos enfoques comunes que son populares en el ecosistema que podrías considerar.

#### Agrupación por funcionalidades o rutas {#grouping-by-features-or-routes}

Una forma común de estructurar proyectos es ubicar CSS, JS y tests juntos dentro de carpetas agrupadas por funcionalidad o ruta.

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

La definición de una "funcionalidad" no es universal, y depende de ti elegir la granularidad. Si no puedes pensar en una lista de carpetas de nivel superior, puede preguntarle a los usuarios de tu producto cuáles son las partes principales y usar su modelo mental como estructura.

#### Agrupando por tipo de archivo {#grouping-by-file-type}

Otra forma popular de estructurar proyectos es agrupar archivos similares, por ejemplo:

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Algunas personas también prefieren ir más lejos y separar los componentes en diferentes carpetas dependiendo de su función en la aplicación. Por ejemplo, [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) es una metodología de diseño basada en este principio. Recuerda que a menudo es más productivo tratar estas metodologías como ejemplos útiles en lugar de reglas estrictas a seguir.

#### Evita el exceso de anidación {#avoid-too-much-nesting}

Hay muchos puntos débiles asociados con el anidamiento profundo de directorios en proyectos JavaScript. Se vuelve más difícil escribir importaciones relativas entre ellas o actualizar esas importaciones cuando se mueven los archivos. A menos que tengas una razón muy convincente para usar una estructura de carpetas profunda, considera limitarte a un máximo de tres o cuatro carpetas anidadas dentro de un solo proyecto. Por supuesto, esto es solo una recomendación y puede que no sea relevante para tu proyecto.

#### No lo pienses demasiado {#avoid-too-much-nesting}

Si estás comenzando un proyecto, [no gastes más de cinco minutos] (https://es.wikipedia.org/wiki/Par%C3%A1lisis_del_an%C3%A1lisis) en elegir una estructura de archivos. ¡Elige cualquiera de los enfoques anteriores (o crea uno propio) y comienza a escribir código! Probablemente querrás volver a pensarlo de todos modos después de haber escrito código real.

Si te sientes completamente atascado, comienza por mantener todos los archivos en una sola carpeta. Eventualmente crecerá lo suficiente como para que quieras separar algunos archivos del resto. Para ese momento, tendrás suficiente conocimientos para saber qué archivos editas juntos con mayor frecuencia. En general, es una buena idea mantener los archivos que a menudo cambian juntos cerca unos de otros. Este principio se llama "colocación".

A medida que los proyectos crecen, frecuentemente utilizan una combinación de los dos enfoques anteriores en la práctica. Así que elegir el "correcto" al principio no es muy importante.
