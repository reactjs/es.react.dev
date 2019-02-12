---
title: Invalid Hook Call Warning
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

Probablemente llegaste aquí porque obtuviste el siguiente mensaje de error:

 > Hooks can only be called inside the body of a function component.

Hay tres razones comunes por las cuales podrías estar viéndolo:

1. Tienes **versiones incongruentes** de React y React DOM.
2. Estás **rompiendo las [Reglas de los Hooks](/docs/hooks-rules.html)**.
3. Tienes **más de una copia de React** en la misma aplicación.

Demos un vistazo a cada uno de estos casos.

## Versiones incongruentes de React y React DOM {#mismatching-versions-of-react-and-react-dom}

Puede que estés usando una versión de `react-dom` (< 16.8.0) o `react-native` (< 0.59) que no es compatible con los Hooks. Puedes correr `npm ls react-dom` o `npm ls react-native` en el directorio de tu aplicación para verificar qué versión estás usando. Si encuentras más de una de ellas, esto también puede causar problemas (más abajo, más información sobre esto).

## Rompiendo las reglas de los Hooks {#rompiendo-las-reglas-de-los-hooks}

Solamente puedes llamar Hooks **mientras React está renderizando un componente funcional**:

* ✅ Llámalos en el nivel superior en el cuerpo de un componente funcional.
* ✅ Llámalos en el nivel superior en el cuerpo de un [Hook personalizado](/docs/hooks-custom.html).

**Lee más acerca de esto en las [Reglas de los Hooks](/docs/hooks-rules.html).**

```js{2-3,8-9}
function Counter() {
  // ✅ Bien: nivel superior en un componente funcional
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Bien: Nivel superior en un Hook personalizado
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Para evitar confusiones, **no** se admite llamar Hooks en otros casos:

* 🔴 No llames Hooks en componentes de clase.
* 🔴 No los llames en manejadores de eventos.
* 🔴 No llames Hooks dentro de funciones pasadas a `useMemo`, `useReducer`, o `useEffect`.

Si rompes estas reglas, podrías ver el error.

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 Mal: Dentro de un manejador de eventos (para arreglarlo, muévelo afuera!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 Mal: Dentro de useMemo (para arreglarlo, muévelo afuera!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 Mal: En un componente de clase
    useEffect(() => {})
    // ...
  }
}
```

Puedes usar el [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) para identificar algunos de estos errores.

>Nota
>
>[Los Hooks personalizados](/docs/hooks-custom.html) *podrían* llamar otros Hooks (ese es su propósito). Esto funciona porque los Hooks personalizados también se supone que deben llamarse únicamente mientras un componente funcional se está renderizando.


## React duplicado {#duplicate-react}

Para que los Hook funcionen, el import de `react` de tu código debe resolver al mismo módulo que el import de `react` dentro del paquete `react-dom`.

Si estos imports de `react` resuelven a dos objetos exports diferentes, verás esta advertencia. Esto podría suceder si **accidentalmente resultas con dos copias** del paquete `react`.

Si usas Node para gestión de paquetes, puedes correr este comando en el directorio de tu proyecto:

    npm ls react

Si ves más de un React, tendrás que descubrir por qué está sucediendo esto y arreglar tu árbol de dependencias. Por ejemplo, quizá una biblioteca que estás usando especifica incorrectamente `react` como una dependencia (en lugar de una peer dependency). Hasta que esa biblioteca sea arreglada, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) es una posible solución temporal.

También puedes intentar depurar este problema agregando algunos logs y reiniciando el servidor de desarrollo:

```js
// Agrega esto en node_modules/react-dom/index.js
window.React1 = require('react');

// Agrega esto en tu componente
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Si imprime `false` entonces probablemente tienes dos React y debes averiguar por qué. [Este issue](https://github.com/facebook/react/issues/13991) incluye varias razones comunes encontradas por la comunidad.

Este problema también ocurre cuando usas `npm link` o un equivalente. En ese caso, tu bundler podría "ver" dos Reacts — uno en la carpeta de aplicación y otro en la de bibliotecas. Asumiendo que `myapp` y `mylib` son carpetas hermanas, una solución posible es correr `npm link ../myapp/node_modules/react` en `mylib`. Esto debería hacer que la biblioteca use la copia de React de la aplicación.

>Nota
>
>En general, React admite usar múltiples copias independientes en una página (por ejemplo, si una página y un widget externo lo usan). Sólo falla si `require('react')` resuelve diferente entre un componente y la copia de `react-dom` con la que fue renderizado.

## Otras causas {#other-causes}

Si nada de esto funciona, por favor agrega un comentario en [este *issue*](https://github.com/facebook/react/issues/13991) y trataremos de ayudar. Intenta crear un pequeño ejemplo que reproduzca el problema — podrías encontrar la causa mientras lo haces.
