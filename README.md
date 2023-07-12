# es.react.dev

Este repositorio contiene el código fuente y la documentación de [es.react.dev](https://es.react.dev/).

## Comenzar

### Prerrequisitos

1. Git.
1. Node: cualquier versión 12.x a partir de v12.0.0 o superior.
1. Yarn: consulta el [sitio web de Yarn para obtener instrucciones de instalación](https://yarnpkg.com/lang/en/docs/install/) (en inglés).
1. Una bifurcación (_fork_) del repositorio (para cualquier contribución).
1. Un clon (_clone_) del [repositorio es.react.dev](https://github.com/reactjs/es.react.dev) en tu máquina local.

### Instalación

1. `cd es.react.dev` para entrar en la raíz del proyecto.
2. `yarn` para instalar las dependencias npm del sitio web.

### Ejecución local

1. `yarn dev` para iniciar el servidor de desarrollo (desarrollado por [Next.js](https://nextjs.org/)).
1. `open http://localhost:3000` para abrir el sitio en tu navegador favorito.

## Contribución

### Directrices

La documentación está dividida en varias secciones con un tono y un propósito diferentes. Si tienes previsto escribir más de unas pocas frases, quizá te resulte útil familiarizarte con las [directrices de contribución](https://github.com/reactjs/es.react.dev/blob/main/CONTRIBUTING.md#guidelines-for-text) de las secciones correspondientes.

### Crear una rama (_branch_)

1. `git checkout main` desde cualquier carpeta de tu repositorio local `es.react.dev`.
1. `git pull origin main` para asegurarte de que tienes el último código principal (_main_).
1. `git checkout -b el-nombre-de-mi-rama` (sustituyendo `el-nombre-de-mi-rama` por un nombre adecuado) para crear una rama (_branch_).

### Hacer un cambio

1. Sigue las instrucciones de ["Ejecución local"](#ejecución-local).
1. Guarda los archivos y compruébalos en el navegador.
1. Los cambios en los componentes React en `src` se recargarán en caliente.
1. Los cambios en los archivos markdown de `content` se cargarán en caliente.
1. Si trabajas con plugins, puede que tengas que eliminar el directorio `.cache` y reiniciar el servidor.

### Prueba el cambio

1. Si es posible, prueba cualquier cambio visual en todas las versiones más recientes de los navegadores habituales, tanto en el escritorio como en el móvil.
2. Ejecuta `yarn check-all`. (Esto ejecutará Prettier, ESLint y validará los tipos).

### Empújalo (_Push it_)

1. `git add -A && git commit -m "Mi mensaje"` (sustituye `Mi mensaje` por un mensaje de confirmación, como `Arreglar logotipo de cabecera en Android`) para escenificar y confirmar tus cambios.
1. `git push my-fork-name el-nombre-de-mi-rama`.
1. Ve al [repositorio es.react.dev](https://github.com/reactjs/es.react.dev) y deberías ver las ramas empujadas recientemente.
1. Sigue las instrucciones de GitHub.
1. Si es posible, incluye capturas de pantalla de los cambios visuales. Se activará una compilación de vista previa después de que tus cambios se envíen a GitHub.

## Traducción

Si estás interesado en traducir `es.react.dev`, consulta los esfuerzos de traducción actuales [aquí](https://github.com/reactjs/react.dev/issues/4135) (en inglés).

## Licencia

El contenido enviado a [es.react.dev](https://es.react.dev/) tiene licencia CC-BY-4.0, tal y como se encuentra en el archivo [LICENSE-DOCS.md](https://github.com/reactjs/es.react.dev/blob/main/LICENSE-DOCS.md).
