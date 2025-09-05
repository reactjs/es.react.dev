---
title: Reglas de React
---

<Intro>
Así como los diferentes lenguajes de programación tienen sus propias formas de expresar conceptos, React tiene sus propios _idioms_ - o reglas - para expresar patrones de una forma que resulte fácil de entender y que permita crear aplicaciones de alta calidad.
</Intro>

<InlineToc />

---

<Note>
Para aprender más sobre cómo expresar UIs con React, recomendamos leer [Pensando en React](/learn/thinking-in-react).
</Note>

Esta sección describe las reglas que necesitas seguir para escribir código React idiomático. Escribir código React idiomático puede ayudarte a crear aplicaciones bien organizadas, seguras y componibles. Estas propiedades hacen que tu aplicación sea más resistente a los cambios y facilitan el trabajo con otros desarrolladores, librerías y herramientas.

Estas reglas son conocidas como las **Reglas de React**. Son reglas – y no solo directrices –  en el sentido de que si se rompen, es probable que tu aplicación tenga errores. Tu código también se vuelve poco idiomático y más difícil de entender y de razonar.

Recomendamos encarecidamente usar [Strict Mode](/reference/react/StrictMode) junto con el [ESLint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) para ayudar a que tu base de código siga las Reglas de React. Al seguir las Reglas de React, podrás encontrar y abordar estos errores y mantener tu aplicación.

---

## Los components y Hooks deben ser puros {/*components-and-hooks-must-be-pure*/}

[La Pureza en Componentes y Hooks](/reference/rules/components-and-hooks-must-be-pure) es una regla clave de React que hace que tu aplicación sea predecible, fácil de depurar y permite que React optimice automáticamente tu código.

* [Los Components y Hooks deben ser idempotentes](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – Se asume que los componentes de React siempre devuelven la misma salida con respecto a sus entradas – props, estado, y contexto.
* [Los efectos secundarios deben ejecutarse fuera del renderizado](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – Los efectos secundarios no deben ejecutarse en el renderizado, ya que React puede renderizar los componentes múltiples veces para crear la mejor experiencia posible para el usuario.
* [Las props y el estado son inmutables](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – Las props y el estado de un componente son instantáneas inmutables con respecto a un único renderizado. Nunca las mutes directamente.
* [Los valores de retorno y los argumentos de los Hooks son inmutables](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Una vez que los valores se pasan a un Hook, no debes modificarlos. Como las props en JSX, los valores se vuelven inmutables cuando se pasan a un Hook.
* [Los valores son inmutables después de ser pasados a JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – No mutes valores después de que se han utilizado en JSX. Mueve la mutación antes de que se cree el JSX.

---

## React llama a los Components y Hooks {/*react-calls-components-and-hooks*/}

[React se encarga de renderizar los componentes y hooks cuando sea necesario para optimizar la experiencia del usuario.](/reference/rules/react-calls-components-and-hooks) Es declarativo: le dices a React qué renderizar en la lógica de tu componente, y React se encargará de decidir cómo mostrarlo de la mejor manera a tu usuario.

* [Nunca llames a funciones de componentes directamente](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Los componentes solo deben ser utilizados en JSX. No los llames como funciones regulares.
* [Nunca pases Hooks como valores regulares](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – Los Hooks solo deben ser llamados dentro de componentes. Nunca los pases como un valor regular.

---

## Reglas de los Hooks {/*rules-of-hooks*/}

Los Hooks se definen mediante funciones JavaScript, pero representan un tipo especial de lógica de UI reutilizable con restricciones sobre dónde se pueden llamar. Debes seguir las [Reglas de los Hooks](/reference/rules/rules-of-hooks) cuando los uses.

* [Sólo llama a los Hooks en el nivel más alto](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – No llames a los Hooks dentro de bucles, condicionales o funciones anidadas. En su lugar, utilízalos siempre en el nivel más alto de tu función React, antes de cualquier retorno anticipado. 
* [Sólo llama a los Hooks desde funciones React](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – No llames a los Hooks desde funciones convencionales de JavaScript.

