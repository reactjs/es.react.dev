---
title: React llama a los Components y Hooks
---

<Intro>
React se encarga de renderizar los componentes y hooks cuando sea necesario para optimizar la experiencia del usuario. Es declarativo: le dices a React qué renderizar en la lógica de tu componente, y React se encargará de decidir cómo mostrarlo de la mejor manera a tu usuario.
</Intro>

<InlineToc />

---

## Nunca llames a funciones de componentes directamente {/*never-call-component-functions-directly*/}
Los componentes solo deben ser utilizados en JSX. No los llames como funciones regulares. React debería ser quien los llame.

React debe decidir cuándo se llama a la función del componente [durante el renderizado](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code). En React, lo haces usando JSX.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Bien: Solo utiliza componentes en JSX
}
```

```js {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Mal: Nunca llamarlos directamente
}
```

Si un componente contiene Hooks, es fácil violar las [Reglas de los Hooks](/reference/rules/rules-of-hooks) cuando los componentes se llaman directamente en un bucle o de forma condicional.

Permitir que React orqueste el renderizado también ofrece una serie de beneficios:

* **Los componentes se convierten en más que funciones.** React puede aumentarlos con funcionalidades como el _estado local_ mediante Hooks que están vinculados a la identidad del componente en el árbol.
* **Los tipos de componentes participan en la reconciliación.** Al dejar que React llame a tus componentes, también le estás diciendo más sobre la estructura conceptual de tu árbol. Por ejemplo, cuando pasas de renderizar `<Feed>` a la página `<Profile>` React no intentará reutilizarlos.
* **React puede mejorar tu experiencia de usuario.**  Por ejemplo, puede permitir que el navegador haga algo de trabajo entre las llamadas a los componentes para que el re-renderizado de un árbol de componentes grande no bloquee el hilo principal.
* **Mejor historial de depuración.** Si los componentes son ciudadanos de primera clase de los que la librería es consciente, podemos construir herramientas de desarrollo enriquecidas para la introspección durante el desarrollo.
* **Reconciliación más eficiente.** React puede decidir exactamente qué componentes del árbol necesitan ser re-renderizados y saltarse los que no lo necesitan. Eso hace que tu aplicación sea más rápida y reactiva.

---

## Nunca pases Hooks como valores regulares {/*never-pass-around-hooks-as-regular-values*/}

Los Hooks solo deben ser llamados dentro de componentes. Nunca los pases como un valor regular.

Los hooks te permiten aumentar un componente con las características de React. Siempre deben ser llamados como una función, y nunca pasados como un valor regular. Esto permite el _razonamiento local_, o la capacidad de los desarrolladores para entender todo lo que un componente puede hacer con solo mirar ese componente de forma aislada.

Romper esta regla hará que React no optimice automáticamente tu componente.

### No mutes dinámicamente a un Hook {/*dont-dynamically-mutate-a-hook*/}

Los hooks deben ser como "estáticos" como sea posible. Esto significa que no debes mutarlos dinámicamente. Por ejemplo, esto significa que no debes escribir hooks de orden superior:

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Mal: no escribas hooks de orden superior
  const data = useDataWithLogging();
}
```

Los hooks deben ser inmutables y no ser mutados. En su lugar, muta un hook dinámicamente, crea una versión estática del hook con la funcionalidad deseada.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Bien: Crea una nueva versión del hook
}

function useDataWithLogging() {
  // ... Crea una nueva versión del hook e implementa la lógica aquí
}
```

### No uses dinámicamente a un Hook {/*dont-dynamically-use-hooks*/}

Los hooks tampoco deben ser utilizados dinámicamente: por ejemplo, en lugar de hacer inyección de dependencias en un componente pasando un Hook como un valor:

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Mal: no pases hooks como props
}
```

Deberías siempre integrar la llamada del hook en el componente y manejar cualquier lógica en él.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Bien: Llama al hook directamente
}

function useDataWithLogging() {
  // Si hay alguna lógica condicional para cambiar el comportamiento del hook, debe ser integrada // en el hook
}
```

De esta manera, el componente, `<Button />` es mucho más fácil de entender y depurar. Cuando los Hooks se utilizan de forma dinámica, aumentan considerablemente la complejidad de tu aplicación e impiden el razonamiento local, lo que hace que tu equipo sea menos productivo a largo plazo. También hace que sea más fácil romper accidentalmente las [Reglas de los Hooks](/reference/rules/rules-of-hooks) que establecen que los Hooks no deben ser llamados condicionalmente. Si encuentrasen la necesidad de mockear componentes para realizar pruebas, es preferible mockear el servidor en su lugar para que responda con datos predefinidos. Si es posible, también suele ser más eficaz probar tu aplicación con pruebas de extremo a extremo (end-to-end).

