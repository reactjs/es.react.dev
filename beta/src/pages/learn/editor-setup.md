---
title: Configurar un editor
---

<Intro>

Un editor configurado apropiadamente puede hacer la lectura del código más clara y la escritura más rápida. ¡Incluso puede ayudarte a detectar errores mientras los escribes! Si esta es tu primera vez configurando un editor o estás buscando mejorar la configuración de tu editor actual, tenemos algunas recomendaciones.

</Intro>

<<<<<<< HEAD
## Tu editor {/*your-editor*/}
=======
<YouWillLearn>

* What the most popular editors are
* How to format your code automatically

</YouWillLearn>

## Your editor {/*your-editor*/}
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

[VS Code](https://code.visualstudio.com/) es uno de los editores más populares hoy en día. Tiene disponible un mercado digital de extensiones y se integra bien con servicios populares como GitHub. La mayoría de las funcionalidades que se listan debajo se pueden añadir a VS Code también a través de extensiones, ¡lo que lo hace muy configurable!

Otros editores de texto populares que se usan en la comunidad de React incluyen a:

<<<<<<< HEAD
* [WebStorm](https://www.jetbrains.com/webstorm/)—un entorno de desarrollo integrado diseñado específicamente para JavaScript.
* [Sublime Text](https://www.sublimetext.com/)—permite trabajar con JSX y TypeScript, incluye [resaltado de sintaxis](https://stackoverflow.com/a/70960574/458193) y autocompletado de forma nativa.
* [Vim](https://www.vim.org/)—un editor de texto altamente configurable hecho para crear y cambiar cualquier tipo de texto de forma muy eficiente. Se incluye como «vi» en la mayoría de los sistemas UNIX y con OS X de Apple.
=======
* [WebStorm](https://www.jetbrains.com/webstorm/) is an integrated development environment designed specifically for JavaScript.
* [Sublime Text](https://www.sublimetext.com/) has support for JSX and TypeScript, [syntax highlighting](https://stackoverflow.com/a/70960574/458193) and autocomplete built in.
* [Vim](https://www.vim.org/) is a highly configurable text editor built to make creating and changing any kind of text very efficient. It is included as "vi" with most UNIX systems and with Apple OS X.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

## Funcionalidades recomendadas en un editor de texto {/*recommended-text-editor-features*/}

Algunos editores vienen con estas funcionalidades integradas por defecto, pero otros puede que requieran añadir una extensión. ¡Chequea qué tipo de integración proporciona tu editor de preferencia para tener seguridad!

### Linting (análisis de código) {/*linting*/}

Las herramientas de análisis de código de tipo *linters* permiten encontrar problemas en tu código mientras lo escribes, ayudando a corregirlos de forma temprana. [ESLint](https://eslint.org/) es un *linter* popular de código abierto para JavaScript.

* [Instala ESLint con la recomendación recomendada para React](https://www.npmjs.com/package/eslint-config-react-app) (¡asegúrate de tener [Node instalado!](https://nodejs.org/en/download/current/))
* [Integra ESLint en VSCode con la extensión oficial](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Formateo {/*formatting*/}

¡Lo último que quieres al compartir tu código con otro contribuidor es entrar en un debate sobre [tabuladores vs. espacios](https://www.google.com/search?q=tabs+vs+spaces)! Afortunadamente, [Prettier](https://prettier.io/) limpiará tu código al reformatearlo para que se ajuste a unas reglas predefinidas y configurables. Ejecuta Prettier y todas tus tabuladores se convertirán en espacios-y tu nivel de sangrado, comillas, etc. también se cambiarán para ajustarse a la configuración. En la configuración ideal, Prettier se ejecutará cuando guardas tu archivo, realizando estas ediciones rápidamente por ti.

Puedes instalar la [extensión de Prettier en VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) siguiendo estos pasos:

<<<<<<< HEAD
1. Ejecuta VS Code
2. Utiliza *Quick Open* (presiona `CTRL/CMD + P`)
3. Pega `ext install esbenp.prettier-vscode`
4. Presiona enter
=======
1. Launch VS Code
2. Use Quick Open (press Ctrl/Cmd+P)
3. Paste in `ext install esbenp.prettier-vscode`
4. Press Enter
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

#### Formateo al guardar {/*formatting-on-save*/}

Idealmente, deberías formatear tu código cada vez que guardas. ¡VS Code tiene configuraciones para hacerlo!

<<<<<<< HEAD
1. En VS Code, presiona `CTRL/CMD + SHIFT + P`.
2. Escribe «settings»
3. Presiona enter
4. En la barra de búsqueda, escribe «format on save»
5. ¡Asegúrate de que la opción «format on save» esté marcada!

> Prettier en ocasiones puede entrar en conflicto con otros *linters*. Pero generalmente hay una forma de que se ejecuten juntos sin conflictos. Por ejemplo, si estás usando Prettier con ESLint, puedes utilizar el plugin [eslint-prettier](https://github.com/prettier/eslint-plugin-prettier) para ejecutar prettier como una regla de ESLint.
=======
1. In VS Code, press `CTRL/CMD + SHIFT + P`.
2. Type "settings"
3. Hit Enter
4. In the search bar, type "format on save"
5. Be sure the "format on save" option is ticked!

> If your ESLint preset has formatting rules, they may conflict with Prettier. We recommend to disable all formatting rules in your ESLint preset using [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) so that ESLint is *only* used for catching logical mistakes. If you want to enforce that files are formatted before a pull request is merged, use [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) for your continuous integration.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4
