---
title: Reglas de los Hooks
---

<Intro>
Los Hooks se definen mediante funciones JavaScript. Representan un tipo especial de lógica de UI reutilizable, con ciertas restricciones acerca de dónde pueden ser llamados.
</Intro>

<InlineToc />

---

## Sólo llama a los Hooks en el nivel más alto {/*only-call-hooks-at-the-top-level*/}

En React, las funciones cuyos nombres empiezan con `use` son llamadas [*Hooks*](/reference/react).

**No llames a los Hooks dentro de bucles, condicionales, funciones anidadas o bloques `try`/`catch`/`finally`.** En su lugar, utilízalos siempre en el nivel más alto de tu función React, antes de cualquier retorno anticipado. Sólo puedes llamar a los Hooks mientras React esté renderizando un componente funcional:

* ✅ Llámalos en el nivel más alto del cuerpo de un [componente funcional](/learn/your-first-component).
* ✅ Llámalos en el nivel más alto del cuerpo de un [custom Hook](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Bien: nivel más alto en un componente funcional
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Bien: nivel más alto en un custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

No se admite llamar a los Hooks (funciones que empiezan con `use`) en  casos como por ejemplo:

* 🔴 No llamar a los Hooks dentro de condicionales o bucles.
* 🔴 No llamar a los Hooks después de una declaración `return` condicional.
* 🔴 No llamar a los Hooks dentro de event handlers.
* 🔴 No llamar a los Hooks dentro de componentes de clase.
* 🔴 No llamar a los Hooks dentro de funciones pasadas a `useMemo`, `useReducer` o `useEffect`.
* 🔴 No llamar a los Hooks dentro de bloques `try`/`catch`/`finally`.

Si rompes estas reglas, es posible que veas este error.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Mal: Hook llamado dentro de una condición (solución, muévelo afuera de la condición!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Mal: Hook llamado dentro de un bucle (solución, muévelo afuera del bucle!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Mal: Hook llamado después de una condición de retorno (solución, muévelo antes del return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Mal: Hook llamado dentro de una función event handler (solución, muévelo afuera de la función event handler!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Mal: Hook llamado dentro de un useMemo (solución, muévelo afuera de la función useMemo!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Mal: Hook llamado dentro de un componente de clase (solución, escribe un componente funcional en vez de un componente de clase!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Mal: Hook llamado dentro de un bloque try/catch/finally (solución, muévelo afuera del bloque!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

Puedes usar el [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks), para capturar estos errores.

<Note>

Es *posible* que los [Custom Hooks](/learn/reusing-logic-with-custom-hooks) llamen a otros Hooks (ése es su propósito). Esto funciona porque se supone que los custom Hooks sean también llamados, sólo mientras se renderiza un componente funcional.

</Note>

---

## Sólo llama a los Hooks desde funciones React {/*only-call-hooks-from-react-functions*/}

No llames a los Hooks desde funciones convencionales de JavaScript. En su lugar, puedes:

✅ Llamar a los Hooks desde componentes funcionales de React.
✅ Llamar a los Hooks desde otros [custom Hooks](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component).

Al seguir esta regla, nos aseguramos  que toda la lógica del estado de un componente, sea claramente visible desde su código fuente.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ No es ni un componente ni un custom Hook!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```
