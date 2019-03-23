---
title: "Community Round-up #1"
author: [vjeux]
---

El código de React fue hecho público hace dos semanas y ya es hora de un pequeño resumen de lo que ha estado sucediendo.

## Editor de preguntas de Khan Academy {#khan-academy-question-editor}

Parece que [Sophie Alpert](http://sophiebits.com/) es la primera persona externa de Facebook e Instagram en publicar código de React a producción. Estamos muy agradecidos por sus contribuciones en forma de _pull requests_, reportes de bugs y presencia en IRC ([#reactjs en Freenode](irc://chat.freenode.net/reactjs)). Sophie escribió sobre su experiencia usando React:

> Acabo de reescribir un proyecto de 2000 líneas en React y varios _pull requests_ para React. Todo lo que he visto hasta ahora sobre React parece muy bien pensado y estoy orgullosa de ser la primera usuaria en producción de React que no es de FB/IG.
>
> El proyecto que reescribí en React (y sigo mejorando) es el editor de preguntas de Khan Academy que los creadores de contenido pueden usar para ingresar preguntas y sugerencias que se le presentarán a los estudiantes: 

> <figure><a href="http://sophiebits.com/2013/06/09/using-react-to-speed-up-khan-academy.html"><img src="../images/blog/khan-academy-editor.png"></a></figure>
>
> [Leer el post completo...](http://sophiebits.com/2013/06/09/using-react-to-speed-up-khan-academy.html)

## Mejora mi Backbone.View (reemplazándolo con React) {#pimp-my-backboneview-by-replacing-it-with-react}

[Paul Seiffert](https://blog.mayflower.de/) escribió un _blog post_ que explica cómo integrar React con las aplicaciones en Backbone.

> React tiene algunos conceptos interesantes para los objetos de vista de JavaScript que pueden usarse para eliminar este gran problema que tengo con Backbone.js.
>
> Como en la mayoría de las implementaciones de MVC (aunque React es probablemente solo una implementación de VC), una vista es una parte de la pantalla que está gestionada por un objeto de control. Este objeto es responsable de decidir cuándo volver a renderizar la vista y cómo reaccionar al _input_ del usuario. Con React, estos objetos controladores de vista se denominan componentes. Un componente sabe cómo representar su vista y cómo manejar la interacción del usuario con él.
>
> Lo interesante es que React está descubriendo por sí mismo cuándo volver a renderizar una vista y cómo hacerlo de la manera más eficiente.
>
> [Leer el post completo...](https://blog.mayflower.de/3937-Backbone-React.html)

## Usando React de Facebook con require.js {#using-facebooks-react-with-requirejs}

[Mario Mueller](http://blog.xenji.com/) escribió un componente de menú en React y pudo integrarlo fácilmente con require.js, EventEmitter2 y bower.

> Recientemente me topé con la biblioteca React de Facebook; una biblioteca de JavaScript para crear componentes para el frontend reutilizables. Incluso si esta versión solo está en la versión 0.3.x se comporta de forma muy estable, es rápido y es divertido de  codificar. Soy un aficionado de require.js, así que intenté usar React dentro del ecosistema (entorno) de require.js. No fue tan difícil como se esperaba y aquí hay algunos ejemplos y algunas ideas al respecto.
> 
> [Leer el post completo...](http://blog.xenji.com/2013/06/facebooks-react-require-js.html)

## Los orígenes de React {#origins-of-react}

[Pete Hunt](http://www.petehunt.net/blog/) explicó lo que diferencia a React de otras bibliotecas de JavaScript en [una publicación previa del blog](/blog/2013/06/05/why-react.html). [Lee Byron](http://leebyron.com/) da otra perspectiva en Quora: 

> React no es como ninguna otra biblioteca de JavaScript popular, y resuelve un problema muy específico: la renderización compleja de la interfaz de usuario. También está destinado a ser utilizado junto a muchas otras bibliotecas populares. Por ejemplo, React funciona bien con Backbone.js, entre muchos otros. 
>
> React nació de las frustraciones con el patrón común de escribir enlaces de datos bidireccionales en aplicaciones MVC complejas. React es una implementación de enlaces de datos unidireccionales. 
>
> [Leer el post completo...](https://www.quora.com/React-JS-Library/How-is-Facebooks-React-JavaScript-library/answer/Lee-Byron?srid=3DcX)
