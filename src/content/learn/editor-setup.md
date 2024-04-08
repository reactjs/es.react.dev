---
title: Configurar un editor
---

<Intro>

Un editor configurado apropiadamente puede hacer la lectura del código más clara y la escritura más rápida. ¡Incluso puede ayudarte a detectar errores mientras los escribes! Si esta es tu primera vez configurando un editor o estás buscando mejorar la configuración de tu editor actual, tenemos algunas recomendaciones.

</Intro>

<YouWillLearn>

* Cuáles son los editores más populares
* Cómo formatear tu código automáticamente

</YouWillLearn>

## Your editor {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) es uno de los editores más populares hoy en día. Tiene disponible un mercado digital de extensiones y se integra bien con servicios populares como GitHub. La mayoría de las funcionalidades que se listan debajo se pueden añadir a VS Code también a través de extensiones, ¡lo que lo hace muy configurable!

Otros editores de texto populares que se usan en la comunidad de React incluyen a:

* [WebStorm](https://www.jetbrains.com/webstorm/) es un entorno de desarrollo integrado diseñado específicamente para JavaScript.
* [Sublime Text](https://www.sublimetext.com/) permite trabajar con JSX y TypeScript, incluye [resaltado de sintaxis](https://stackoverflow.com/a/70960574/458193) y autocompletado de forma nativa.
* [Vim](https://www.vim.org/) es un editor de texto altamente configurable hecho para crear y cambiar cualquier tipo de texto de forma muy eficiente. Se incluye como "vi" en la mayoría de los sistemas UNIX y con OS X de Apple.

## Funcionalidades recomendadas en un editor de texto {/*recommended-text-editor-features*/}

Algunos editores vienen con estas funcionalidades integradas por defecto, pero otros puede que requieran añadir una extensión. ¡Chequea qué tipo de integración proporciona tu editor de preferencia para tener seguridad!

### Linting (análisis de código) {/*linting*/}

Las herramientas de análisis de código de tipo *linters* permiten encontrar problemas en tu código mientras lo escribes, ayudando a corregirlos de forma temprana. [ESLint](https://eslint.org/) es un *linter* popular de código abierto para JavaScript.

* [Instala ESLint con la recomendación recomendada para React](https://www.npmjs.com/package/eslint-config-react-app) (¡asegúrate de tener [Node instalado!](https://nodejs.org/en/download/current/))
* [Integra ESLint en VSCode con la extensión oficial](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Asegúrate de haber habilitado todas las reglas de [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) para tu proyecto.** Son esenciales para la detección temprana de los errores más severos. La configuración recomendada [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) ya las incluye.

### Formateo {/*formatting*/}

¡Lo último que quieres al compartir tu código con otro contribuidor es entrar en un debate sobre [tabuladores vs. espacios](https://www.google.com/search?q=tabuladores+vs+espacios)! Afortunadamente, [Prettier](https://prettier.io/) limpiará tu código al reformatearlo para que se ajuste a unas reglas predefinidas y configurables. Ejecuta Prettier y todas tus tabuladores se convertirán en espacios-y tu nivel de sangrado, comillas, etc. también se cambiarán para ajustarse a la configuración. En la configuración ideal, Prettier se ejecutará cuando guardas tu archivo, realizando estas ediciones rápidamente por ti.

Puedes instalar la [extensión de Prettier en VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) siguiendo estos pasos:

1. Ejecuta VS Code
2. Utiliza *Quick Open* (presiona Ctrl/Cmd+P)
3. Pega `ext install esbenp.prettier-vscode`
4. Presiona Enter

#### Formateo al guardar {/*formatting-on-save*/}

Idealmente, deberías formatear tu código cada vez que guardas. ¡VS Code tiene configuraciones para hacerlo!

1. En VS Code, presiona `CTRL/CMD + SHIFT + P`.
2. Escribe "settings"
3. Presiona Enter
4. En la barra de búsqueda, escribe "format on save"
5. ¡Asegúrate de que la opción "format on save" esté marcada!

> Si tu *preset* de ESLint tiene reglas de formateo, podrían entrar en conflicto con Prettier. Recomendamos deshabilitar todas las reglas de formateo en tu *preset* de ESLint usando [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) de forma tal de que ESLint se use *solo* para detectar errores de lógica. Si quieres obligar a que todos los archivos se formateen antes de que se mezcle un *pull request*, utiliza [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) en tu sistema de integración continua.
