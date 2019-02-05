---
id: hooks-state
title: Usando el Hook de efecto
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-intro.html
---

Los *Hooks* son una nueva característica que te permite usar estado y otras características de React sin escribir una clase. Actualmente están disponibles en la versión v16.8.0-alpha.1 de React.

El *Hook de efecto* te permite llevar a cabo efectos secundarios en componentes funcionales:

```js{1,6-10}
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // De forma similar a componentDidMount y componentDidUpdate
  useEffect(() => {
    // Actualiza el título del documento usando la API del navegador
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Este fragmento está basado en el [ejemplo de contador de la página anterior](/docs/hooks-state.html), pero le hemos añadido una funcionalidad nueva: actualizamos el título del documento con un mensaje personalizado que incluye el número de clicks.

Peticiones de datos, establecimiento de suscripciones y actualizaciones manuales del DOM en componentes de React serían ejemplos de efectos secundarios. Tanto si estás acostumbrado a llamar a estas operaciones efectos secundarios (o simplemente efectos) como si no, probablemente los has llevado a cabo en tus componentes con anterioridad.

>Consejo
>
>Si estás familiarizado con el ciclo de vida de las clases de React y sus métodos, el Hook `useEffect` equivale a `componentDidMount`, `componentDidUpdate` y `componentWillUnmount` combinados.

Hay dos tipos de efectos secundarios en los componentes de React: aquellos que necesitan una operación de saneamiento y los que si la necesitan. Vamos a profundizar más en esta distinción.

## Efectons sin saneamiento

En ciertas ocasiones, queremos **ejecutar código adicional después de que React haya actualizado el DOM.** Peticiones de red, mutaciones manuales del DOM, y registros son ejemplos comúnes de efectos que no requieren una acción de saneamiento. Decimos esto porque podemos ejecutarlos y olvidarnos de ellos inmediatamente. Vamos a comparar como las clases y los Hooks nos permiten expresar dichos efectos.

### Ejemplo con clases

En los componentes de React con clases, el método `render` no debería causar efectos secundarios por si mismo. Sería prematuro. Normalmente queremos llevar a cabo nuestros efectos *después* de que React haya actualizado el DOM.

Y es por eso que en las clases de React, ponemos los efectos secundarios en `componentDidMount` y `componentDidUpdate`. Volviendo a nuestro ejemplo, aquí tenemos el componente clase contador de React que actualiza el título del documento justo después de que React haga cambios en el DOM:

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

Fíjate en como **hemos duplicado el código en los dos métodos del ciclo de vida en la clase**

Esto es porque en muchas ocasiones queremos llevar a cabo el mismo efecto secundario sin importar si el componente acaba de montarse o si se ha actualizado. Conceptualmente, queremos que ocurra después de cada renderizado, pero las clases de React no tienen un método que haga eso. Podríamos extraer un método, pero aún así tendríamos que llamarlo en los dos sitios.

Veamos ahora como podemos hacer lo mismo con el Hook `useEffect`.

### Ejemplo con Hooks

Ya hemos visto este ejemplo al principio de la página, pero veámoslo más detenidamete:

```js{1,6-8}
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**¿Qué hace `useEffect`?** Al usar este Hook, le estamos indicando a React que el componente tiene que hacer algo después de renderizarse. React recordará la función que le hemos pasado (nos referiremos a ella como nuestro "efecto"), y la llamará más tarde después de actualizar el DOM. En este efecto, actualizamos el título del documento, pero también podríamos hacer peticiones de datos o invocar alguna API imperativa.

**¿Por qué se llama a `useEffect` dentro del componente?** Poner `useEffect` dentro del componente nos permite acceder a la variable de estado `count` (o a cualquier prop) directamente desde el efecto. No necesitamos una API especial para acceder a ella, ya se encuentra en el ámbito de la función. Los Hooks se aprovechan de los closures de JavaScript y evitan introducir APIs específicas de React donde JavaScript ya proporciona una solución.

**¿Se ejecuta `useEffect` después de cada renderizado?** ¡Si! Por defecto se ejecuta después del primer renderizado **y** después de cada actualización. Más tarde trataremos [como personalizar este comportamiento](#tip-optimizing-performance-by-skipping-effects). En vez de pensar en términos de "montar" y "actualizar", puede resultarte más fácil pensar en efectos que ocurren "después del renderizado". React se asegura de que el DOM se ha actualizado antes de llevar a cabo el efecto.

### Explicación detallada

Ahora que sabemos algo más sobre los efectos, estas lineas deberían cobrar sentido:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

Declaramos la variable de estado `count` dentro del effecto porque se encuentra en el ámbito de nuestra función. Cuando React renderiza nuestro componente, recordará este efecto y lo ejecutará después de actualizar el DOM. Esto sucede en cada renderizado, incluyendo el primero.

Los desarrolladores experimentados en JavaScript se percatarán de que la función que le pasamos a `useEffect` es distinta en cada renderizado. Esto es intencionado. En realidad esto es lo que nos permite leer la variable `count` desde el interior de nuestro efecto sin preocuparnos de que su valor esté obsoleto. Cada vez que re-renderizamos, planificamos un _efecto_ diferente, reemplazando el anterior. En cierta manera, esto hace que los efectos funcionen más como parte del resultado del renderizado. Cada efecto pertenece a su correspondiente renderizado. [Más adelante](#explanation-why-effects-run-on-each-update) veremos más claramente porque esto es útil.

> Consejo
>
>A diferencia de `componentDidMount` o `componentDidUpdate`, los efectos planificados con `useEffect` no bloquean la actualización de la pantalla del navegador. Esto hace que tu aplicación responda mejor. La mayoría de efectos no necesitan suceder de manera síncrona. En los casos poco comunes en los que se necesita una ejecución síncrona (como en mediciones de la disposición de elementos), podemos usar el Hook [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) con una API idéntica a la de `useEffect`.

## Efectos con saneamiento

En el apartado anterior hemos visto como expresar efectos secundarios que no necesitan ningún saneamiento. Sin embargo, algunos efectos la necesitan. Por ejemplo, **si queremos establecer una suscripción** a alguna fuente de datos externa. En ese caso, ¡es importante sanear el efecto para no introducir una fuga de memoria! Comparemos como se puede hacer esto con clases y con Hooks.

### Ejemplo con clases

En una clase de React, normalmente se establece una suscripción en `componentDidMount`, y se cancela la suscripción en `componentWillUnmount`. Por ejemplo, digamos que tenemos un módulo `ChatAPI` que nos permite suscribirnos para saber si un amigo está conectado. Así es como podemos establecer la suscripción y mostrar ese estado usando una clase:

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

Fíjate en como `componentDidMount` y `componentWillUnmount` necesitan ser un reflejo el uno del otro. Los métodos del ciclo de vida nos obligan a separar esta lógica incluso cuando, conceptualmente, el código de ambos está relacionado con el mismo efecto.

>Nota
>
>Los lectores avispados podrán percatarse de que este ejemplo necesita también un método `componentDidUpdate` para ser completamente correcto. De momento vamos a ignorar este hecho, pero volveremos a él en una [sección posterior](#explanation-why-effects-run-on-each-update) de esta página. 

### Ejemplo usando Hooks

Veamos como podemos escribir este componente con Hooks.

Quizás puedas estar pensando que necesitaríamos un efecto aparte para llevar a cabo este saneamiento. Pero el código para añadir y eliminar una suscripción esta tan estrechamente relacionado que `useEffect` está diseñado para mantenerlo unido. Si tu efecto devuelve una función, React la ejecutará en el momento de sanear el efecto:

```js{10-16}
import { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Especifica como sanear este efecto:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**¿Por qué hemos devuelto una función en nuestro efecto?** Este es un mecanismo opcional de los efectos. Todos los efectos pueden devolver una función que los sanea más tarde. Esto nos permite mantener la lógica de añadir y eliminar suscripciones cerca la una de la otra. ¡Son parte del mismo efecto!

**¿Cuándo sanea React el efecto exáctamente?** React sanea el efecto cuando el componente se desmonta. Sin embargo, como hemos aprendido anteriormente, los efectos no se ejecutan solo una vez, sino en cada renderizado. He aquí el motivo por el cual React *también* sanea los efectos de renderizados anteriores antes de ejecutar los efectos del renderizado actual. Más adelante analizaremos [porque esto ayuda a evitar errores](#explanation-why-effects-run-on-each-update) y [como omitir este funcionamiento en el caso de que provoque problemas de rendimiento](#tip-optimizing-performance-by-skipping-effects).

>Nota
>
>No tenemos que nombrar la función devuelta por el efecto. La hemos llamado `cleanup` esta vez para clarificar su propósito, pero podemos devolver una función flecha o nombrarla de otra forma.

## Recapitulación

Hemos aprendido que `useEffect` nos permite expresar diferentes tipos de efectos secundarios después de que un componente se renderize. Algunos efectos pueden pueden devolver una función cuando requieran un saneamiento:

```js
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Otros efectos pueden no tener fase de saneamiento y no devolver nada.

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

El Hook de efecto unifica ambos casos en una única API. 

-------------

**Si crees que ya tienes un nivel de comprensión decente de como funciona el Hook de efecto o estás sobrepasado, puedes pasar a la [página siguiente sobre las reglas de los Hooks](/docs/hooks-rules.html) ahora.**

-------------

## Consejos para usar efectos

Vamos a continuar profundizando en algunos aspectos de `useEffect` que les resultarán curiosos de alguna forma a los usuarios de React experimentados. No te sientas obligado a indagar en ello ahora mismo. Siempre puedes volver a esta página para conocer más detalles del Hook de efecto.

### Consejo: Usa varios efectos para separar conceptos

Uno de los problemas que esbozamos en la [Motivación](/docs/hooks-intro.html#complex-components-become-hard-to-understand) para crear los Hooks es que los métodos del ciclo de vida de las clases suelen contener lógica que no está relacionada, pero la que lo esta se fragmenta en varios métodos. Este es un componente que combina la lógica del contador y el indicador de estado del amigo de los ejemplos anteriores:

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

Fíjate en como la lógica que asigna `document.title` se divide entre `componentDidMount` y `componentDidUpdate`. La lógica de la suscripción también se reparte entre `componentDidMount` y `componentWillUnmount`. Y `componentDidMount` contiene código de ambas tareas.

Entonces, ¿como resuelven los Hooks este problema? Del mismo modo que [puedes usar el Hook de *estado* más de una vez](/docs/hooks-state.html#tip-using-multiple-state-variables), puedes usar varios efectos. Esto nos permite separar la lógica que no está relacionada en diferentes efectos:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
}
```

**Los Hooks nos permiten separar el código en función de lo que hace** en vez de en función del nombre de un método de ciclo de vida. React aplicará *cada* efecto del componente en el orden en el que han sido especificados.

### Explicación: Porque los efectos se ejecutan en cada actualización

Si estás familiarizado con las clases, te preguntarás porque la fase de saneamiento de efecto ocurre después de cada re-renderizado y no simplemente cuando el componente se desmonta. Veamos un ejemplo práctico para ver portuq este diseño nos ayuda a crear componentes con menos bugs.

[Earlier on this page](#example-using-classes-1), we introduced an example `FriendStatus` component that displays whether a friend is online or not. Our class reads `friend.id` from `this.props`, subscribes to the friend status after the component mounts, and unsubscribes during unmounting:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**But what happens if the `friend` prop changes** while the component is on the screen? Our component would continue displaying the online status of a different friend. This is a bug. We would also cause a memory leak or crash when unmounting since the unsubscribe call would use the wrong friend ID.

In a class component, we would need to add `componentDidUpdate` to handle this case:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

Forgetting to handle `componentDidUpdate` properly is a common source of bugs in React applications.

Now consider the version of this component that uses Hooks:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

It doesn't suffer from this bug. (But we also didn't make any changes to it.)

There is no special code for handling updates because `useEffect` handles them *by default*. It cleans up the previous effects before applying the next effects. To illustrate this, here is a sequence of subscribe and unsubscribe calls that this component could produce over time:

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

This behavior ensures consistency by default and prevents bugs that are common in class components due to missing update logic.

### Tip: Optimizing Performance by Skipping Effects

In some cases, cleaning up or applying the effect after every render might create a performance problem. In class components, we can solve this by writing an extra comparison with `prevProps` or `prevState` inside `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

This requirement is common enough that it is built into the `useEffect` Hook API. You can tell React to *skip* applying an effect if certain values haven't changed between re-renders. To do so, pass an array as an optional second argument to `useEffect`:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

In the example above, we pass `[count]` as the second argument. What does this mean? If the `count` is `5`, and then our component re-renders with `count` still equal to `5`, React will compare `[5]` from the previous render and `[5]` from the next render. Because all items in the array are the same (`5 === 5`), React would skip the effect. That's our optimization.

When we render with `count` updated to `6`, React will compare the items in the `[5]` array from the previous render to items in the `[6]` array from the next render. This time, React will re-apply the effect because `5 !== 6`. If there are multiple items in the array, React will re-run the effect even if just one of them is different.

This also works for effects that have a cleanup phase:

```js{6}
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

In the future, the second argument might get added automatically by a build-time transformation.

>Note
>
>If you use this optimization, make sure the array includes **any values from the outer scope that change over time and that are used by the effect**. Otherwise, your code will reference stale values from previous renders. We'll also discuss other optimization options in the [Hooks API reference](/docs/hooks-reference.html).
>
>If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array (`[]`) as a second argument. This tells React that your effect doesn't depend on *any* values from props or state, so it never needs to re-run. This isn't handled as a special case -- it follows directly from how the inputs array always works. While passing `[]` is closer to the familiar `componentDidMount` and `componentWillUnmount` mental model, we suggest not making it a habit because it often leads to bugs, [as discussed above](#explanation-why-effects-run-on-each-update). Don't forget that React defers running `useEffect` until after the browser has painted, so doing extra work is less of a problem.

## Next Steps

Congratulations! This was a long page, but hopefully by the end most of your questions about effects were answered. You've learned both the State Hook and the Effect Hook, and there is a *lot* you can do with both of them combined. They cover most of the use cases for classes -- and where they don't, you might find the [additional Hooks](/docs/hooks-reference.html) helpful.

We're also starting to see how Hooks solve problems outlined in [Motivation](/docs/hooks-intro.html#motivation). We've seen how effect cleanup avoids duplication in `componentDidUpdate` and `componentWillUnmount`, brings related code closer together, and helps us avoid bugs. We've also seen how we can separate effects by their purpose, which is something we couldn't do in classes at all.

At this point you might be questioning how Hooks work. How can React know which `useState` call corresponds to which state variable between re-renders? How does React "match up" previous and next effects on every update? **On the next page we will learn about the [Rules of Hooks](/docs/hooks-rules.html) -- they're essential to making Hooks work.**
