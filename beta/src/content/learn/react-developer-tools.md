---
title: Herramientas de Desarrollo de React
---

<Intro>

Utiliza las Herramientas de Desarrollo de React (*React Developer Tools*) para inspeccionar [componentes](/learn/your-first-component) de React, editar [props](/learn/passing-props-to-a-component) y [estado](/learn/state-a-components-memory), e identificar problemas de rendimiento.

</Intro>

<YouWillLearn>

* Cómo instalar las Herramientas de Desarrollo de React

</YouWillLearn>

## Extensión del navegador {/*browser-extension*/}

La forma más fácil de depurar sitios web construidos con React es instalar la extensión de las Herramientas de Desarrollo de React. Está disponible para varios de los navegadores más populares:

* [Instálalas para **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Instálalas para **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Instálalas para **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Ahora, si visitas un sitio web **construido con React**, verás los paneles de _Components_ (componentes) y _Profiler_ (perfilador o generador de perfiles).

![Extensión de las Herramientas de Desarrollo de React](/images/docs/react-devtools-extension.png)

### Safari y otros navegadores {/*safari-and-other-browsers*/}
Para otros navegadores (por ejemplo, Safari), instala el paquete de npm [`react-devtools`](https://www.npmjs.com/package/react-devtools):
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

A continuación abre las herramientas de desarrollo desde la terminal:
```bash
react-devtools
```

Luego conecta tu sitio web añadiendo la siguiente etiqueta `<script>` al inicio del `<head>` de tu sitio web:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Ahora recarga tu sitio web en el navegador para verlo en las herramientas de desarrollo.

![Versión autónoma de las Herramientas de Desarrollo de React](/images/docs/react-devtools-standalone.png)

## Móvil (React Native) {/*mobile-react-native*/}
Las Herramientas de Desarrollo de React se pueden utilizar también para inspeccionar aplicaciones escritas con [React Native](https://reactnative.dev/):

Las forma más fácil de usar las Herramientas de Desarrollo de React es instalarlas globalmente:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Luego abre las herramientas de desarrollo desde la terminal.
```bash
react-devtools
```

Debería conectarse a cualquier aplicación local de React Native que se esté ejecutando.

> Prueba recargar la aplicación si las herramientas de desarrollo no se conectan después de algunos segundos.

[Aprende más sobre la depuración en React Native.](https://reactnative.dev/docs/debugging)
