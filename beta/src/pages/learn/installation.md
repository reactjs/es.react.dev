---
title: Instalación
---

<Intro>

React se ha diseñado desde un inicio para una adopción gradual, así puedes usar tan poco o mucho de React como necesites. Ya sea que quieras probar de qué va React, agregar interactividad a una página HTML o crear una aplicación compleja con React, los enlaces de esta sección te ayudarán a comenzar.

</Intro>

<YouWillLearn isChapter={true}>

* [Cómo añadir React a una página HTML](/learn/add-react-to-a-website)
* [Cómo iniciar un proyecto completo en React](/learn/start-a-new-react-project)
* [Cómo configurar tu editor](/learn/editor-setup)
* [Cómo instalar las Herramientas de Desarrollo de React](/learn/react-developer-tools)

</YouWillLearn>

## Prueba React {/*try-react*/}

No necesitas instalar nada para jugar con React. ¡Prueba editar este ejemplo de código!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

Utilizamos ejemplos interactivos de código (*sandboxes*) a lo largo de esta documentación como ayuda a la enseñanza. Estos ejemplos te ayudan a familiarizarte con la forma en que React funciona y te ayudarán a decidir si React es lo adecuado para ti. Fuera de la documentación de React, también existen muchos *sandboxes* en línea que permiten usar React: por ejemplo, [CodeSandbox](https://codesandbox.io/s/new), [Stackblitz](https://stackblitz.com/fork/react), o [CodePen](
https://codepen.io/pen/?template=wvdqJJm).

### Prueba React localmente {/*try-react-locally*/}

Para probar React de forma local en tu computadora, [descarga esta página HTML](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html). ¡Ábrela en tu editor y en tu navegador!

## Añade React a una página {/*add-react-to-a-page*/}

Si estás trabajando con un sitio existente y solo necesitas añadir un poco de React, puedes [añadir React con una etiqueta script](/learn/add-react-to-a-website).

## Iniciar un proyecto de React {/*start-a-react-project*/}

Si estás listo para [iniciar un proyecto completamente](/learn/start-a-new-react-project) en React, puedes configurar una herramienta mínima que provea una agradable experiencia de desarrollo. También puedes comenzar con un framework que tome más decisiones por ti desde un inicio.

## Próximos pasos {/*next-steps*/}

¡Por dónde comiences depende de cómo te gusta aprender, qué necesitas lograr y adónde quieres dirigirte luego! ¿Por qué no leer [Pensar en React](/learn/thinking-in-react)--nuestro tutorial introductorio? O puedes saltar a [Describir la UI](/learn/describing-the-ui) para jugar con más ejemplos y aprender cada tema paso a paso. ¡No hay una forma incorrecta de aprender React!
