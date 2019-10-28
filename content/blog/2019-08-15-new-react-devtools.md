---
title: "Introduciendo las nuevas React DevTools"
author: [bvaughn]
---
Nos complace anunciarles una nueva liberación de las Herramientas de Desarrollo de React (*React DevTools*), disponible hoy en Chrome, Firefox y (Chromium) Edge!

<<<<<<< HEAD
## ¿Qué Cambió?
=======
## What's changed? {#whats-changed}
>>>>>>> 081bb31226919062938ef924472ba1b4170facfc

¡Mucho ha cambiado en la versión 4!
A un alto nivel, esta versión debería ofrecer ganancias significativas de rendimiento y una experiencia de navegación mejorada.
También ofrece soporte completo para los Hooks de React, incluyendo la inspección de objetos anidados.

![Captura de Pantalla de DevTools versión 4](../images/blog/devtools-v4-screenshot.png)

[Visite el tutorial interactivo](https://react-devtools-tutorial.now.sh/) para probar la nueva versión o [vea la bitácora de cambios](https://github.com/facebook/react/blob/master/packages/react-devtools/CHANGELOG.md#400-august-15-2019) para videos de demostración y más detalles.

<<<<<<< HEAD
## ¿Cuáles versiones de React son soportadas?
=======
## Which versions of React are supported? {#which-versions-of-react-are-supported}
>>>>>>> 081bb31226919062938ef924472ba1b4170facfc

**`react-dom`**

* `0`-`14.x`: No soportada
* `15.x`: Soportada (excepto por la nueva funcionalidad de filtrar componentes)
* `16.x`: Soportada

**`react-native`**
* `0`-`0.61`: No soportada
* `0.62`: Será soportada (cuando 0.62 sea liberada)

<<<<<<< HEAD
## ¿Cómo obtengo las nuevas DevTools?
=======
## How do I get the new DevTools? {#how-do-i-get-the-new-devtools}
>>>>>>> 081bb31226919062938ef924472ba1b4170facfc

React DevTools está disponible como una extensión para [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) y [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/).
Si ya instalaste la extensión, debería actualizarse de forma automática dentro de un par de horas.

Si usas el shell independiente (ej. en React Native o Safari), puedes installar la nueva versión [desde NPM](https://www.npmjs.com/package/react-devtools):

```shell
npm install -g react-devtools@^4
```

<<<<<<< HEAD
## ¿A dónde se fueron todos los elementos del DOM?
=======
## Where did all of the DOM elements go? {#where-did-all-of-the-dom-elements-go}
>>>>>>> 081bb31226919062938ef924472ba1b4170facfc

Las nuevas DevTools proveen una forma de filtrar los componentes del árbol para hacer más fácil navegar en jerarquías profundamente anidadas.
Los nodos anfitriones (ej. HTML `<div>`, React Native `<View>`) están *ocultos por defecto*, pero este filtro puede ser deshabilitado:

![Filtros de componentes de DevTools](../images/blog/devtools-component-filters.gif)

<<<<<<< HEAD
## ¿Cómo obtengo de nuevo la versión anterior?
=======
## How do I get the old version back? {#how-do-i-get-the-old-version-back}
>>>>>>> 081bb31226919062938ef924472ba1b4170facfc

Si estás trabajando con React Native version 60 (o anterior) puedes instalar la versión anterior de DevTools desde NPM:

```shell
npm install --dev react-devtools@^3
```

Para versiones anteriores de React DOM (v0.14 o previas) necesitarás compilar la extensión desde el código fuente:

```shell
# Haz Checkout del código fuente de la extensión
git clone https://github.com/facebook/react-devtools

cd react-devtools

# Haz Checkout de la rama de la versión anterior
git checkout v3

# Instala las dependencias y compila la extensión
yarn install
yarn build:extension

# Sigue las instrucciones en pantalla para completar la instalación
```

<<<<<<< HEAD
## ¡Gracias!
=======
## Thank you! {#thank-you}
>>>>>>> 081bb31226919062938ef924472ba1b4170facfc

Nos gustaría agradecer a todos que hicieron pruebas de la liberación temprana de DevTools versión 4.
Su feedback nos ayudó a mejorar esta liberación inicial de manera significativa.

¡Aún tenemos muchas funcionalidades emocionanetes planificadas y el feedback es siempre bienvenido!
Sientanse libres de abrir un [reporte en GitHub](https://github.com/facebook/react/issues/new?labels=Component:%20Developer%20Tools) o etiquetar [@reactjs en Twitter](https://twitter.com/reactjs).
