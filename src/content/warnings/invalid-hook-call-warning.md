---
title: Reglas de los Hooks
---

Probablemente estás aquí porque te ha aparecido el siguiente mensaje de error:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.<div>**(Traducción)**</div>Hooks sólo pueden ser llamados dentro del cuerpo de un componente de función.

</ConsoleBlock>

Este mensaje puede aparecer por tres motivos comunes:

1. Estás **incumpliendo las Reglas de los Hooks**.
2. Estás usando **versiones incompatibles** de React y React DOM.
3. Estás usando **más de una instancia de React** en la misma aplicación.

Veamos cada uno de estos casos.

## Incumplir las Reglas de los Hooks {/*breaking-rules-of-hooks*/}

Las funciones que comienzan con `use` se conocen como [*Hooks*](/reference/react) en React.

**Evita utilizar Hooks dentro de ciclos, condicionales o funciones anidadas.** En su lugar, utiliza los Hooks únicamente en el nivel superior de tu función de React, antes de cualquier devolución anticipada. Los Hooks sólo deben ser utilizados durante la renderización de un componente de función en React:

* ✅ Utilízalos en el nivel superior del cuerpo de un [componente de función](/learn/your-first-component).
* ✅ Utilízalos en el nivel superior del cuerpo de un [Hook personalizado](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Correcto: en la parte superior de un componente de función
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Correcto: en la parte superior de un Hook personalizado
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

No se **permite** el uso de Hooks (funciones que comienzan con `use`) en ningún otro caso, por ejemplo:

* 🔴 Dentro de condicionales o ciclos.
* 🔴 Después de una declaración de `return` condicional.
* 🔴 En controladores de eventos.
* 🔴 En componentes de clase.
* 🔴 Dentro de funciones pasadas a `useMemo`, `useReducer`, o `useEffect`.

Incumplir estas reglas podría provocar la aparición de este error.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Incorrecto: dentro de una condicional (para solucionarlo, ¡colócalo fuera!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Incorrecto: dentro de un ciclo (para solucionarlo, ¡colócalo fuera!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Incorrecto: después de una devolución condicional (para solucionarlo, ¡colócalo antes de la devolución!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Incorrecto: dentro de un controlador de evento (para solucionarlo, ¡colócalo fuera!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Incorrecto: dentro de useMemo (para solucionarlo, ¡colócalo fuera!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Incorrecto: dentro de un componente de clase (para solucionarlo, ¡escribe un componente de función en lugar de uno de clase!)
    useEffect(() => {})
    // ...
  }
}
```

Puedes usar el [plugin de `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) para detectar estos errores.

<Note>

Los [Hooks personalizados](/learn/reusing-logic-with-custom-hooks) *pueden* llamar a otros Hooks (ese es su propósito principal). Esto es posible porque los Hooks personalizados también deben ser llamados sólo durante la renderización de un componente de función.

</Note>

## Uso de versiones incompatibles de React y React DOM {/*mismatching-versions-of-react-and-react-dom*/}

Puede que estés usando versiones antiguas de `react-dom` (< 16.8.0) o `react-native` (< 0.59) que no sean compatibles con Hooks. Para verificar la versión que estás utilizando, puedes ejecutar `npm ls react-dom` o `npm ls react-native` en la carpeta de tu aplicación. Si encuentras más de una versión instalada, esto podría causar problemas (más información a continuación).

## Uso de más de una instancia de React {/*duplicate-react*/}

Para que los Hooks funcionen correctamente, la importación de `react` en el código de tu aplicación debe apuntar al mismo módulo que la importación de `react` en el paquete `react-dom`.

Si estas importaciones de `react` apuntan a dos objetos de importación diferentes, verás esta advertencia. Esto puede ocurrir si **por error tienes dos copias** del paquete `react`.

Si usas Node para gestionar paquetes, puedes verificar esto en la carpeta de tu proyecto ejecutando:

<TerminalBlock>

npm ls react

</TerminalBlock>

Si detectas más de una instancia de React, tendrás que investigar las causas y corregir tu árbol de dependencias. Es posible que alguna biblioteca que estés utilizando especifique incorrectamente `react` como una dependencia en lugar de una dependencia entre pares. Mientras se soluciona este problema en la biblioteca, una posible solución temporal es utilizar [resoluciones de Yarn](https://runebook.dev/es/docs/yarn/selective-version-resolutions).

Para solucionar el problema, puedes intentar depurarlo agregando logs y reiniciando el servidor de desarrollo:

```js
// Añade esto en node_modules/react-dom/index.js
window.React1 = require('react');

// Añade esto en el archivo de tu componente
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

<<<<<<< HEAD
Si imprime `false`, es posible que tengas dos instancias de React y debas investigar las posibles causas. [Este issue](https://github.com/facebook/react/issues/13991) incluye algunas razones comunes encontradas por la comunidad.
=======
If it prints `false` then you might have two Reacts and need to figure out why that happened. [This issue](https://github.com/react/react/issues/13991) includes some common reasons encountered by the community.
>>>>>>> 6be2b020a0cabf2fd6dbff5c42c399b8ac323bca

Este problema también puede surgir al utilizar `npm link` u otro método equivalente, lo que hace que el empaquetador de módulos "vea" dos versiones de React — una en la carpeta de la aplicación y otra en la carpeta de la biblioteca. Si `myapp` y `mylib` son carpetas hermanas, una posible solución es ejecutar `npm link ../myapp/node_modules/react` desde `mylib`. De esta forma, la biblioteca utilizará la versión de React de la aplicación.

<Note>

En general, React permite el uso de varias instancias intependientes en una misma página (por ejemplo, si una aplicación y un widget de terceros lo utilizan). Sin embargo, puede surgir un problema si `require('react')` se resuelve de manera diferente entre el componente y la instancia de `react-dom` utilizada para renderizarlo.

</Note>

## Otras causas {/*other-causes*/}

<<<<<<< HEAD
Si ninguna de estas soluciones funcionó, por favor coméntalo en [este issue](https://github.com/facebook/react/issues/13991) y trataremos de ayudarte. Intenta crear un pequeño ejemplo que reproduzca el problema — Es posible que descubras la causa del problema mientras intentas reproducirlo.
=======
If none of this worked, please comment in [this issue](https://github.com/react/react/issues/13991) and we'll try to help. Try to create a small reproducing example — you might discover the problem as you're doing it.
>>>>>>> 6be2b020a0cabf2fd6dbff5c42c399b8ac323bca
