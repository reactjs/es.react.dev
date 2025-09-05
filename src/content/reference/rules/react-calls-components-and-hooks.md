---
title: React llama a los Components y Hooks
---

<Intro>
React se encarga de renderizar los componentes y hooks cuando sea necesario para optimizar la experiencia del usuario. Es declarativo: le dices a React qué renderizar en la lógica de tu componente, y React se encargará de decidir cómo mostrarlo de la mejor manera a tu usuario.
</Intro>

<InlineToc />

---

## Never call component functions directly {/*never-call-component-functions-directly*/}
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

## Never pass around Hooks as regular values {/*never-pass-around-hooks-as-regular-values*/}

Hooks should only be called inside of components or Hooks. Never pass it around as a regular value.

Hooks allow you to augment a component with React features. They should always be called as a function, and never passed around as a regular value. This enables _local reasoning_, or the ability for developers to understand everything a component can do by looking at that component in isolation.

Breaking this rule will cause React to not automatically optimize your component.

### Don't dynamically mutate a Hook {/*dont-dynamically-mutate-a-hook*/}

Hooks should be as "static" as possible. This means you shouldn't dynamically mutate them. For example, this means you shouldn't write higher order Hooks:

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Bad: don't write higher order Hooks
  const data = useDataWithLogging();
}
```

Hooks should be immutable and not be mutated. Instead of mutating a Hook dynamically, create a static version of the Hook with the desired functionality.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Good: Create a new version of the Hook
}

function useDataWithLogging() {
  // ... Create a new version of the Hook and inline the logic here
}
```

### Don't dynamically use Hooks {/*dont-dynamically-use-hooks*/}

Hooks should also not be dynamically used: for example, instead of doing dependency injection in a component by passing a Hook as a value:

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Bad: don't pass Hooks as props
}
```

You should always inline the call of the Hook into that component and handle any logic in there.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Good: Use the Hook directly
}

function useDataWithLogging() {
  // If there's any conditional logic to change the Hook's behavior, it should be inlined into
  // the Hook
}
```

This way, `<Button />` is much easier to understand and debug. When Hooks are used in dynamic ways, it increases the complexity of your app greatly and inhibits local reasoning, making your team less productive in the long term. It also makes it easier to accidentally break the [Rules of Hooks](/reference/rules/rules-of-hooks) that Hooks should not be called conditionally. If you find yourself needing to mock components for tests, it's better to mock the server instead to respond with canned data. If possible, it's also usually more effective to test your app with end-to-end tests.

