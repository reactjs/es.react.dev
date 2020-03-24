---
id: hooks-rules
title: Reglas de los Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

Los *Hooks* son una nueva incorporación en React 16.8. Te permiten usar estado y otras características de React sin escribir una clase.

Los Hooks son funciones de JavaScript, pero necesitas seguir dos reglas cuando los uses. Proporcionamos un [plugin de linter](https://www.npmjs.com/package/eslint-plugin-react-hooks) para hacer cumplir estas reglas automáticamente.

### Llama Hooks solo en el nivel superior {#only-call-hooks-at-the-top-level}

**No llames Hooks dentro de ciclos, condicionales o funciones anidadas.** En vez de eso, usa siempre Hooks en el nivel superior de tu función en React. Siguiendo esta regla, te aseguras de que los hooks se llamen en el mismo orden cada vez que un componente se renderiza. Esto es lo que permite a React preservar correctamente el estado de los hooks entre multiples llamados a `useState` y `useEffect`. (Si eres curioso, vamos a explicar esto en detalle [más abajo](#explicación).)

### Llama Hooks solo en funciones de React {#only-call-hooks-from-react-functions}

**No llames Hooks desde funciones JavaScript regulares.** En vez de eso, puedes:

* ✅ Llama Hooks desde componentes funcionales de React.
* ✅ Llama Hooks desde Hooks personalizados (aprenderemos acerca de ellos [en la siguiente página](/docs/hooks-custom.html)).

Siguiendo esta regla, te aseguras de que toda la lógica del estado de un componente sea claramente visible desde tu código fuente.

## Plugin de ESLint {#eslint-plugin}

Lanzamos un plugin de ESLint llamado [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) que refuerza estas dos reglas. Puedes añadir este plugin a tu proyecto si quieres probarlo:

Este plugin es incluido por defecto en [Create React App](/docs/create-a-new-react-app.html#create-react-app).

```bash
npm install eslint-plugin-react-hooks --save-dev
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
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  }
}
```

**Puedes pasar a la siguiente página donde explicamos cómo escribir [tus propios Hooks](/docs/hooks-custom.html) ahora mismo.** En esta página, vamos a continuar explicando el razonamiento detrás de estas reglas.

## Explicación {#explanation}

Como [aprendimos anteriormente](/docs/hooks-state.html#tip-using-multiple-state-variables), podemos usar múltiples Hooks de Estado o Hooks de Efecto en un solo componente:

```js
function Form() {
  // 1. Usa la variable de estado del nombre
  const [name, setName] = useState('Mary');

  // 2. Usa un efecto para persistir el formulario
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Usa la variable de estado del apellido
  const [surname, setSurname] = useState('Poppins');

  // 4. Usa un efecto para la actualización del título
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

Entonces, cómo hace React para saber cuál estado corresponde a cuál llamado del `useState`? La respuesta es que **React se basa en el orden en el cual los Hooks son llamados**. Nuestro ejemplo funciona porque el orden en los llamados de los Hooks son el mismo en cada render:

```js
// ------------
// Primer render
// ------------
useState('Mary')           // 1. Inicializa la variable de estado del nombre con 'Mary'
useEffect(persistForm)     // 2. Agrega un efecto para persistir el formulario
useState('Poppins')        // 3. Inicializa la variable de estado del apellido con 'Poppins'
useEffect(updateTitle)     // 4. Agrega un efecto para la actualización del título

// -------------
// Segundo render
// -------------
useState('Mary')           // 1. Lee la variable de estado del nombre (el argumento es ignorado)
useEffect(persistForm)     // 2. Reemplaza el efecto para persistir el formulario
useState('Poppins')        // 3. Lee la variable de estado del apellido (el argumento es ignorado)
useEffect(updateTitle)     // 4. Reemplaza el efecto de actualización del título

// ...
```

Siempre y cuando el orden de los llamados a los Hooks sean los mismos entre renders, React puede asociar algún estado local con cada uno de ellos. Pero qué pasa si ponemos la llamada a un Hook (por ejemplo, el efecto `persistForm`) dentro de una condición?

```js
  // 🔴 Estamos rompiendo la primera regla al usar un Hook en una condición
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

La condición `name !== ''` es `true` en el primer render, entonces corremos el Hook. Sin embargo, en el siguiente render el usuario puede borrar el formulario, haciendo la condición `false`. Ahora que nos saltamos este Hook durante el renderizado, el orden de las llamadas a los Hooks se vuelve diferente: 

```js
useState('Mary')           // 1. Lee la variable de estado del nombre (el argumento es ignorado)
// useEffect(persistForm)  // 🔴 Este Hook fue saltado
useState('Poppins')        // 🔴 2 (pero era el 3). Falla la lectura de la variable de estado del apellido
useEffect(updateTitle)     // 🔴 3 (pero era el 4). Falla el reemplazo del efecto
```

React no sabría qué devolver para la segunda llamada del Hook `useState`. React esperaba que la segunda llamada al Hook en este componente correspondiera al efecto `persistForm`, igual que en el render anterior, pero ya no lo hace. A partir de este punto, cada siguiente llamada de un Hook después de la que nos saltamos también cambiaría de puesto por uno, lo que llevaría a la aparición de errores.

**Es por esto que los Hooks deben ser utilizados en el nivel superior de nuestros componentes.** Si queremos ejecutar un efecto condicionalmente, podemos poner esa condición *dentro* de nuestro Hook:

```js
  useEffect(function persistForm() {
    // 👍 No vamos a romper la primera regla nunca más.
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**Ten en cuenta que no necesitas preocuparte por este problema si usas las [reglas de lint provistas](https://www.npmjs.com/package/eslint-plugin-react-hooks).** Pero ahora también sabes *por qué* los Hooks funcionan de esta manera, y cuáles son los problemas que la primera regla está impidiendo.

## Siguientes pasos {#next-steps}

Finalmente, estamos listos para aprender acerca de cómo [escribir nuestros propios Hooks](/docs/hooks-custom.html)! Los Hooks personalizados te permiten combinar los Hooks proporcionados por React en sus propias abstracciones y reutilizar la lógica de estado común entre los diferentes componentes.
