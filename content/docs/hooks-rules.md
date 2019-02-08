---
id: hooks-rules
title: Reglas de los Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

Los *Hooks* son una de las próximas funcionalidades que te permitirá usar el estado y otras caracteristicas de React sin tener que escribir una clase. Actualmente están disponibles en la versión de React v16.8.0-alpha.1.

Los Hooks son funciones de JavaScript, pero necesitas seguir dos reglas cuando los uses. Proporcionamos un [plugin de linter](https://www.npmjs.com/package/eslint-plugin-react-hooks) para hacer cumplir estas reglas automáticamente.

### Llama Hooks solo en el nivel superior

**No llames Hooks dentro de ciclos, condicionales, or funciones anidadas.** En vez de eso, usa siempre Hooks en el nivel superior de tu función en React. Siguiendo esta regla, te aseguras de que los hooks se llamen en el mismo orden cada vez que un componente se renderiza. Esto es lo que permite a React preservar correctamente el estado de los hooks entre multiples llamados a `useState` y `useEffect`. (Si eres curioso, vamos a explicar esto en detalle [más abajo](#explicación).)

### Llama Hooks solo en funciones de React

**No llames Hooks desde funciones JavaScript regulares.** En vez de eso, puedes:

* ✅ Llama Hooks desde componentes funcionales de React.
* ✅ Llama Hooks desde Hooks personalizados (aprenderemos acerca de ellos [en la siguiente página](/docs/hooks-custom.html)).

Siguiendo esta regla, te aseguras de que toda la lógica del estado de un componente sea claramente visible desde tu código fuente.

## Plugin de ESLint

Lanzamos un plugin de ESLint llamado [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) que hace cumplir estas dos reglas. Puedes añadir este plugin a tu proyecto si quieres probarlo:

```bash
npm install eslint-plugin-react-hooks
```

```js
// Tu configuración de ESLint
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error"
  }
}
```

En el futuro, tenemos la intención de incluir este plugin por defecto en Create React App y otros paquetes similares.

**You can skip to the next page explaining how to write [your own Hooks](/docs/hooks-custom.html) now.** On this page, we'll continue by explaining the reasoning behind these rules.

## Explicación

As we [learned earlier](/docs/hooks-state.html#tip-using-multiple-state-variables), we can use multiple State or Effect Hooks in a single component:

```js
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

So how does React know which state corresponds to which `useState` call? The answer is that **React relies on the order in which Hooks are called**. Our example works because the order of the Hook calls is the same on every render:

```js
// ------------
// First render
// ------------
useState('Mary')           // 1. Initialize the name state variable with 'Mary'
useEffect(persistForm)     // 2. Add an effect for persisting the form
useState('Poppins')        // 3. Initialize the surname state variable with 'Poppins'
useEffect(updateTitle)     // 4. Add an effect for updating the title

// -------------
// Second render
// -------------
useState('Mary')           // 1. Read the name state variable (argument is ignored)
useEffect(persistForm)     // 2. Replace the effect for persisting the form
useState('Poppins')        // 3. Read the surname state variable (argument is ignored)
useEffect(updateTitle)     // 4. Replace the effect for updating the title

// ...
```

As long as the order of the Hook calls is the same between renders, React can associate some local state with each of them. But what happens if we put a Hook call (for example, the `persistForm` effect) inside a condition?

```js
  // 🔴 We're breaking the first rule by using a Hook in a condition
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

The `name !== ''` condition is `true` on the first render, so we run this Hook. However, on the next render the user might clear the form, making the condition `false`. Now that we skip this Hook during rendering, the order of the Hook calls becomes different:

```js
useState('Mary')           // 1. Read the name state variable (argument is ignored)
// useEffect(persistForm)  // 🔴 This Hook was skipped!
useState('Poppins')        // 🔴 2 (but was 3). Fail to read the surname state variable
useEffect(updateTitle)     // 🔴 3 (but was 4). Fail to replace the effect
```

React wouldn't know what to return for the second `useState` Hook call. React expected that the second Hook call in this component corresponds to the `persistForm` effect, just like during the previous render, but it doesn't anymore. From that point, every next Hook call after the one we skipped would also shift by one, leading to bugs.

**This is why Hooks must be called on the top level of our components.** If we want to run an effect conditionally, we can put that condition *inside* our Hook:

```js
  useEffect(function persistForm() {
    // 👍 We're not breaking the first rule anymore
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**Note that you don't need to worry about this problem if you use the [provided lint rule](https://www.npmjs.com/package/eslint-plugin-react-hooks).** But now you also know *why* Hooks work this way, and which issues the rule is preventing.

## Next Steps

Finally, we're ready to learn about [writing your own Hooks](/docs/hooks-custom.html)! Custom Hooks let you combine Hooks provided by React into your own abstractions, and reuse common stateful logic between different components.
