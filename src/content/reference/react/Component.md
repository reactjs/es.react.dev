---
title: Component
---

<Pitfall>

Recomendamos definir los componentes como funciones en lugar de clases. [Mira cómo migrar.](#alternatives)

</Pitfall>

<Intro>

`Component` es la clase base para los componentes de React definidos como [clases en JavaScript.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) Los componentes de clase aún son compatibles con React, pero no recomendamos usarlos en nuevo código.

```js
class Greeting extends Component {
  render() {
    return <h1>Hola, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `Component` {/*component*/}

Para definir un componente de React como clase, se debe extender la clase incorporada `Component` y definir un método [`render`](#render).

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hola, {this.props.name}!</h1>;
  }
}
```

Sólo el método `render` es requerido, otros métodos son opcionales.

[Ver más ejemplos abajo.](#usage)

---

### `context` {/*context*/}

El [contexto](/learn/passing-data-deeply-with-context) de un componente de clase está disponible como `this.context`. Solo está disponible si especificas *cual* contexto deseas recibir usando [static contextType](#static-contexttype) (moderno) o [`static contextTypes`](#static-contexttypes) (deprecado).

Un componente de clase solo puede leer un contexto a la vez.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Leer `this.context` en componentes de clase es equivalente a usar [`useContext`](/reference/react/useContext) en componentes de función.

[Mira cómo migrar.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

Las props que se pasan a un componente de clase están disponibles como `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Leer `this.props` en componentes de clase es equivalente a [declarar props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) en componentes de función.

[Mira cómo migrar.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `refs` {/*refs*/}

<Deprecated>

Esta API será eliminada en una versión mayor futura de React. [Usa createRef en su lugar.](/reference/react/createRef)

</Deprecated>

Te permite acceder a [legacy string refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) para este componente.

---

### `state` {/*state*/}

El estado de un componente de clase está disponible como `this.state`. El campo `state` debe ser un objeto. No mutes el estado directamente. Si deseas cambiar el estado, llama a `setState` con el nuevo estado.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Incrementar edad
        </button>
        <p>Tienes {this.state.age} años.</p>
      </>
    );
  }
}
```

<Note>

Definir `state` en los componentes de clase es equivalente a llamar a [`useState`](/reference/react/useState) en los componentes de función.

[Mira cómo migrar.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

El [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) se ejecuta antes de que el componente de clase se *monte* (se agregue a la pantalla). Normalmente, en React se utiliza el constructor únicamente para dos propósitos. Te permite declarar el estado y [enlazar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) los métodos de la clase con la instancia de la clase:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Si usas la sintaxis moderna de JavaScript, rara vez se necesitan constructores. En su lugar, puedes reescribir este código usando la [sintaxis de campo de clase pública](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes/Public_class_fields) que es compatible tanto con navegadores modernos como con herramientas como [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Un constructor no debería tener efectos secundarios ni suscripciones.

#### Parámetros {/*constructor-parameters*/}

* `props`: Las props iniciales del componente.

#### Retorna {/*constructor-returns*/}

El `constructor` no debe retornar nada.

#### Precauciones {/*constructor-caveats*/}

* No ejecutes ningún efecto secundario o suscripciones en el constructor. En su lugar, utiliza [`componentDidMount`](#componentdidmount) para eso.

* Dentro de un constructor, debes llamar a `super(props)` antes que cualquier otra declaración. Si no lo haces, `this.props` será `undefined` mientras se ejecuta el constructor, lo que puede ser confuso y causar errores.

* El constructor es el único lugar donde puedes asignar [`this.state`](#state) directamente. En todos los demás métodos, debes utilizar [`this.setState()`](#setstate) en su lugar. No llames a `setState` en el constructor.

* Cuando usas [renderizado en el servidor,](/reference/react-dom/server) el constructor también se ejecutará en el servidor, seguido del método [`render`](#render). Sin embargo, los métodos del ciclo de vida como `componentDidMount` o `componentWillUnmount` no se ejecutarán en el servidor.

* Cuando [Strict Mode](/reference/react/StrictMode) está activado, React llamará al constructor dos veces en desarrollo y luego descartará una de las instancias. Esto ayuda a notar los efectos secundarios accidentales que deben moverse fuera del `constructor`.


<Note>

No hay una equivalencia exacta para `constructor` en los componentes de función. Para declarar el estado en un componente de función, llama a [`useState`.](/reference/react/useState) Para evitar recalcular el estado inicial, [pasa una función a `useState`.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

Si defines `componentDidCatch`, React lo llamará cuando algún componente hijo (incluso los distantes) lance un error durante el renderizado. Esto te permite registrar ese error en un servicio de reporte de errores en producción.

Normalmente, se utiliza junto con [`static getDerivedStateFromError`](#static-getderivedstatefromerror), lo que te permite actualizar el estado en respuesta a un error y mostrar un mensaje de error al usuario. Un componente con estos métodos se llama *error boundary*.

[Ver un ejemplo.](#catching-rendering-errors-with-an-error-boundary)

#### Parámetros {/*componentdidcatch-parameters*/}

* `error`: El error que fue lanzado. En la práctica, generalmente será una instancia de [`Error`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error), pero no se garantiza ya que JavaScript permite [`lanzar`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/throw) cualquier valor, incluyendo cadenas de texto o incluso `null`.

* `info`: Un objeto que contiene información adicional sobre el error. Su campo `componentStack` contiene una pila de rastreo con el componente que lanzó el error, así como los nombres y ubicaciones de origen de todos sus componentes padres. En producción, los nombres de los componentes se reducirán. Si configuras la notificación de errores en producción, puedes decodificar la pila de componentes utilizando sourcemaps de la misma manera que lo harías con las pilas de errores regulares de JavaScript.

#### Retorna {/*componentdidcatch-returns*/}

`componentDidCatch` no debería retornar nada.

#### Precauciones {/*componentdidcatch-caveats*/}

* En el pasado, era común llamar a `setState` dentro de `componentDidCatch` para actualizar la interfaz de usuario y mostrar un mensaje de error alternativo. Esto está obsoleto a favor de definir [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* Las versiones de producción y desarrollo de React difieren ligeramente en la forma en que `componentDidCatch` maneja los errores. En desarrollo, los errores se propagarán a `window`, lo que significa que cualquier `window.onerror` o `window.addEventListener('error', callback)` interceptará los errores capturados por `componentDidCatch`. En producción, en cambio, los errores no se propagarán, lo que significa que cualquier administrador de errores principal solo recibirá errores no capturados explícitamente por `componentDidCatch.

<Note>

Aún no hay un equivalente directo para `componentDidCatch` en componentes de función. Si deseas evitar crear componentes de clase, puedes escribir un solo componente `ErrorBoundary` como se menciona arriba y usarlo en toda tu aplicación. Alternativamente, puedes usar el paquete [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) que lo hace por ti.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

Si defines el método `componentDidMount`, React lo llamará cuando tu componente se agregue por primera vez *(se monte)* en la pantalla. Este es un lugar común para comenzar la obtención de datos, configurar suscripciones o manipular los nodos del DOM.

Si implementas `componentDidMount`, generalmente debes implementar otros métodos del ciclo de vida para evitar errores. Por ejemplo, si `componentDidMount` lee algún estado o propiedades, también debes implementar [`componentDidUpdate`](#componentdidupdate) para manejar sus cambios, y [`componentWillUnmount`](#componentwillunmount) para limpiar lo que `componentDidMount` estaba haciendo.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Ver más ejemplos.](#adding-lifecycle-methods-to-a-class-component)

#### Parámetros {/*componentdidmount-parameters*/}

`componentDidMount` no toma ningún parámetro.

#### Retorna {/*componentdidmount-returns*/}

`componentDidMount` no debería devolver nada.

#### Precauciones {/*componentdidmount-caveats*/}

- Cuando se activa el [modo estricto](/reference/react/StrictMode), en desarrollo React llamará a `componentDidMount`, luego inmediatamente llamará a [`componentWillUnmount`](#componentwillunmount) y luego llamará a `componentDidMount` nuevamente. Esto te ayuda a notar si olvidaste implementar `componentWillUnmount` o si su lógica no refleja completamente lo que hace `componentDidMount`.

- Aunque puedes llamar a [`setState`](#setstate) inmediatamente en `componentDidMount`, es mejor evitarlo siempre que puedas. Esto provocará un renderizado adicional, pero sucederá antes de que el navegador actualice la pantalla. Esto garantiza que aunque [`render`](#render) se llame dos veces en este caso, el usuario no verá el estado intermedio. Usa este patrón con precaución porque a menudo causa problemas de rendimiento. En la mayoría de los casos, deberías ser capaz de asignar el estado inicial en el [`constructor`](#constructor) en su lugar. Sin embargo, puede ser necesario en casos como modales y tooltips cuando necesitas medir un nodo DOM antes de renderizar algo que depende de su tamaño o posición.

<Note>

Para muchos casos de uso, definir `componentDidMount`, `componentDidUpdate` y `componentWillUnmount` juntos en componentes de clase es equivalente a llamar a [`useEffect`](/reference/react/useEffect) en componentes funcionales. En los casos raros donde es importante que el código se ejecute antes de renderizarse en el navegador, [`useLayoutEffect`](/reference/react/useLayoutEffect) es una opción más adecuada.

[Mira cómo migrar.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

Si defines el método `componentDidUpdate`, React lo llamará inmediatamente después de que tu componente haya sido renderizado de nuevo con las props o el estado actualizado. Este método no se llama para el renderizado inicial.

Puedes utilizarlo para manipular el DOM después de una actualización. También es un lugar común para hacer solicitudes de red siempre y cuando compares las props actuales con las props anteriores (por ejemplo, una solicitud de red puede no ser necesaria si las props no han cambiado). Normalmente, lo usarías junto con [`componentDidMount`](#componentdidmount) y [`componentWillUnmount`](#componentwillunmount):

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Ver más ejemplos.](#adding-lifecycle-methods-to-a-class-component)


#### Parámetros {/*componentdidupdate-parameters*/}

* `prevProps`: Las props antes de la actualización. Compara `prevProps` con [`this.props`](#props) para determinar lo que cambió.

* `prevState`: El estado antes de la actualización. Compara `prevState` con [`this.state`](#state) para determinar lo que cambió.

* `snapshot`: Si implementaste [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` contendrá el valor que retornaste desde ese método. De lo contrario, será `undefined`.

#### Retorna {/*componentdidupdate-returns*/}

`componentDidUpdate` no debería devolver nada.

#### Precauciones {/*componentdidupdate-caveats*/}

- `componentDidUpdate` no será llamado si [`shouldComponentUpdate`](#shouldcomponentupdate) está definido y devuelve `false`.

- La lógica dentro de `componentDidUpdate` generalmente debería estar envuelta en condiciones que comparan `this.props` con `prevProps` y `this.state` con `prevState`. De lo contrario, existe el riesgo de crear bucles infinitos.

- Aunque puedes llamar [`setState`](#setstate) inmediatamente en `componentDidUpdate`, es mejor evitarlo siempre que puedas. Desencadenará una representación adicional, pero sucederá antes de que el navegador actualice la pantalla. Esto garantiza que aunque [`render`](#render) se llamará dos veces en este caso, el usuario no verá el estado intermedio. Este patrón a menudo causa problemas de rendimiento, pero puede ser necesario para casos raros como modales y tooltips cuando necesita medir un nodo DOM antes de renderizar algo que depende de su tamaño o posición.

<Note>

Para muchos casos de uso, definir juntos `componentDidMount`, `componentDidUpdate` y `componentWillUnmount` en componentes de clase es equivalente a llamar a [`useEffect`](/reference/react/useEffect) en componentes de función. En los casos raros donde es importante que el código se ejecute antes de renderizar en el navegador, [`useLayoutEffect`](/reference/react/useLayoutEffect) es una opción más cercana.

[Mira cómo migrar](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function).
</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

Esta API ha sido renombrado de `componentWillMount` a [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) El nombre antiguo ha sido deprecado. En una versión importante futura de React, solo funcionará el nuevo nombre.

Ejecuta [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para actualizar automáticamente sus componentes.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>


Esta API ha sido renombrada de `componentWillReceiveProps` a [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) El nombre antiguo ha sido deprecado. En una versión mayor futura de React, solo funcionará el nuevo nombre.

Ejecuta [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para actualizar automáticamente tus componentes.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

Esta API ha sido renombrada de `componentWillUpdate` a [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) El nombre antiguo ha sido desaprobado. En una versión mayor futura de React, solo funcionará el nuevo nombre.

Ejecuta [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para actualizar automáticamente tus componentes.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

Si defines el método `componentWillUnmount`, React lo llamará antes de que tu componente sea eliminado *(desmontado)* de la pantalla. Este es un lugar común para cancelar la obtención de datos o eliminar suscripciones.

La lógica dentro de `componentWillUnmount` debe "reflejar" la lógica dentro de [`componentDidMount`.](#componentdidmount) Por ejemplo, si `componentDidMount` configura una suscripción, `componentWillUnmount` debe limpiar esa suscripción. Si la lógica de limpieza en `componentWillUnmount` lee algunas props o estado, generalmente también deberás implementar [`componentDidUpdate`](#componentdidupdate) para limpiar recursos (como suscripciones) correspondientes a las props y estados antiguos.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Ver más ejemplos.](#adding-lifecycle-methods-to-a-class-component)

#### Parámetros {/*componentwillunmount-parameters*/}

`componentWillUnmount` no recibe ningún parámetro.

#### Retorna {/*componentwillunmount-returns*/}

`componentWillUnmount` no debería devolver nada.

#### Precauciones {/*componentwillunmount-caveats*/}

- Cuando el [Modo Estricto](/reference/react/StrictMode) está activado, en desarrollo React llamará a [`componentDidMount`](#componentdidmount) y luego llamará inmediatamente a `componentWillUnmount`, y luego llamará a `componentDidMount` de nuevo. Esto ayuda a notar si olvidaste implementar `componentWillUnmount` o si su lógica no refleja completamente lo que hace `componentDidMount`.

<Note>

Para muchos casos de uso, definir `componentDidMount`, `componentDidUpdate` y `componentWillUnmount` juntos en componentes de clase es equivalente a llamar a [`useEffect`](/reference/react/useEffect) en componentes de función. En los casos raros donde es importante que el código se ejecute antes de la pintura del navegador, [`useLayoutEffect`](/reference/react/useLayoutEffect) es más adecuado.

[Consulta cómo migrar.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)
</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

`forceUpdate` fuerza a un componente a volver a renderizarse.

Por lo general, esto no es necesario. Si el método [`render`](#render) de tu componente solo lee de [`this.props`](#props), [`this.state`](#state) o [`this.context`](#context), se volverá a renderizar automáticamente cuando llames a [`setState`](#setstate) dentro de tu componente o uno de sus padres. Sin embargo, si el método `render` de tu componente lee directamente de una fuente de datos externa, debes indicarle a React que actualice la interfaz de usuario cuando cambie esa fuente de datos. Para eso sirve `forceUpdate`.

Trata de evitar todas las situaciones donde se necesita utilizar `forceUpdate` y solo lee de `this.props` y `this.state` en `render`.

#### Parámetros {/*forceupdate-parameters*/}

* **opcional** `callback` Si se especifica, React llamará al `callback` que hayas proporcionado después de que se haya realizado la actualización.

#### Retorna {/*forceupdate-returns*/}

`forceUpdate` no devuelve nada.

#### Precauciones {/*forceupdate-caveats*/}

- Si llamas a `forceUpdate`, React volverá a renderizar sin llamar a [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

La lectura de una fuente de datos externa y la actualización forzada de componentes de clase en respuesta a sus cambios con `forceUpdate` ha sido reemplazada por [`useSyncExternalStore`](/reference/react/useSyncExternalStore) en componentes de función.

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

Esta API será eliminada en una versión importante futura de React. [Usa en su lugar `Context.Provider`.](/reference/react/createContext#provider)

</Deprecated>

Permite especificar los valores para el [contexto heredado](https://reactjs.org/docs/legacy-context.html) que es proporcionado por este componente.

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

Si implementas `getSnapshotBeforeUpdate`, React lo llamará inmediatamente antes de actualizar el DOM. Esto permite que tu componente capture cierta información del DOM (por ejemplo, la posición de desplazamiento) antes de que potencialmente cambie. Cualquier valor devuelto por este método de ciclo de vida se pasará como parámetro a [`componentDidUpdate`.](#componentdidupdate)

Por ejemplo, puedes usarlo en una interfaz de usuario como un hilo de chat que necesita conservar su posición de desplazamiento durante las actualizaciones:


```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

En el ejemplo anterior, es importante leer la propiedad `scrollHeight` directamente en `getSnapshotBeforeUpdate`. No es seguro leerla en [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) o [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) porque existe un posible lapso de tiempo entre la llamada a estos métodos y la actualización del DOM por parte de React.

#### Parámetros {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: Props antes de la actualización. Compara `prevProps` con [`this.props`](#props) para determinar lo que cambió.

* `prevState`: Estado antes de la actualización. Compara `prevState` con [`this.state`](#state) para determinar lo que cambió.

#### Retorna {/*getsnapshotbeforeupdate-returns*/}

Deberías devolver un valor de instantánea de cualquier tipo que desees o `null`. El valor que devuelvas se pasará como tercer argumento a [`componentDidUpdate`.](#componentdidupdate)

#### Precauciones {/*getsnapshotbeforeupdate-caveats*/}

`getSnapshotBeforeUpdate` no se llamará si se define [`shouldComponentUpdate`](#shouldcomponentupdate) y devuelve `false`.

<Note>

Actualmente, no hay un equivalente a `getSnapshotBeforeUpdate` para componentes de función. Este caso de uso es muy poco común, pero si lo necesitas, por ahora tendrás que escribir un componente de clase.

</Note>

---

### `render()` {/*render*/}

El método `render` es el único método requerido en un componente de clase.

El método `render` debería especificar lo que deseas que aparezca en la pantalla, por ejemplo:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React puede llamar a `render` en cualquier momento, por lo que no debes asumir que se ejecuta en un momento determinado. Por lo general, el método `render` debería devolver una pieza de [JSX](/learn/writing-markup-with-jsx), pero se admiten algunos [otros tipos de retorno](#render-returns) (como cadenas). Para calcular el JSX devuelto, el método `render` puede leer [`this.props`](#props), [`this.state`](#state) y [`this.context`](#context).

Deberías escribir el método `render` como una función pura, lo que significa que debería devolver el mismo resultado si las props, el estado y el contexto son iguales. Tampoco debería contener efectos secundarios (como configurar suscripciones) o interactuar con las APIs del navegador. Los efectos secundarios deberían ocurrir en controladores de eventos o en métodos como [`componentDidMount`.](#componentdidmount)

#### Parámetros {/*render-parameters*/}

* `prevProps`: Props anteriores a la actualización. Compara `prevProps` con [`this.props`](#props) para determinar qué cambió.

* `prevState`: Estado anterior a la actualización. Compara `prevState` con [`this.state`](#state) para determinar qué cambió.

#### Retorna {/*render-returns*/}

`render` puede devolver cualquier nodo React válido. Esto incluye elementos React como `<div />`, cadenas de texto, números, [portales](/reference/react-dom/createPortal), nodos vacíos (`null`, `undefined`, `true` y `false`), y arrays de nodos de React.

#### Precauciones {/*render-caveats*/}

- `render` debe ser escrito como una función pura de props, state, y context. No debe tener efectos secundarios.
- `render` no será llamado si [`shouldComponentUpdate`](#shouldcomponentupdate) está definido y devuelve `false`.
- Cuando [Strict Mode](/reference/react/StrictMode) está activado, React llamará a `render` dos veces en desarrollo y luego descartará uno de los resultados. Esto te ayuda a notar los efectos secundarios accidentales que necesitan ser movidos fuera del método `render`.
- No hay una correspondencia uno a uno entre la llamada a `render` y la posterior llamada a `componentDidMount` o `componentDidUpdate`. Algunos de los resultados de la llamada a `render` pueden ser descartados por React cuando es beneficioso.
---

### `setState(nextState, callback?)` {/*setstate*/}

Llama a `setState` para actualizar el estado de tu componente React.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.
      </>
    );
  }
}
```

`setState` encola cambios en el estado del componente. Le dice a React que este componente y sus hijos necesitan volver a renderizarse con el nuevo estado. Esta es la forma principal en la que actualizará la interfaz de usuario en respuesta a interacciones.

<Pitfall>

Llamar a `setState` **no cambia** el estado actual en el código que ya se está ejecutando:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Still "Taylor"!
}
```

Solo afecta lo que `this.state` devolverá a partir del *siguiente* renderizado.
</Pitfall>

También puedes pasar una función a `setState`. Esto te permite actualizar el estado basándote en el estado anterior:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

No es necesario hacer esto, pero es útil si desea actualizar el estado varias veces durante el mismo evento.

#### Parámetros {/*setstate-parameters*/}

* `nextState`: Puede ser un objeto o una función.
  * Si pasa un objeto como `nextState`, se fusionará superficialmente en `this.state`.
  * Si pasa una función como `nextState`, se tratará como una _función de actualización_. Debe ser pura, debe tomar como argumentos el estado pendiente y las props, y debe devolver el objeto que se fusionará superficialmente en `this.state`. React pondrá su función de actualización en una cola y volverá a renderizar su componente. Durante el próximo renderizado, React calculará el siguiente estado aplicando todas las actualizaciones en cola al estado anterior.

* **opcional** `callback`: Si se especifica, React llamará al `callback` que ha proporcionado después de que se haya confirmado la actualización.

#### Retorna {/*setstate-returns*/}

`setState` no devuelve nada.

#### Precauciones {/*setstate-caveats*/}

- Piensa en `setState` como una *solicitud* en lugar de un comando inmediato para actualizar el componente. Cuando varios componentes actualizan su estado en respuesta a un evento, React los agrupa y los renderiza juntos en una sola pasada al final del evento. En el caso raro de que necesites forzar que una actualización de estado en particular se aplique de forma sincrónica, puedes envolverla en [`flushSync`](/reference/react-dom/flushSync), pero esto puede afectar el rendimiento.

- `setState` no actualiza `this.state` inmediatamente. Esto puede ser un problema potencial si se lee `this.state` justo después de llamar a `setState`. En su lugar, utiliza [`componentDidUpdate`](#componentdidupdate) o el argumento de `callback` de setState, ya que ambos están garantizados para activarse después de que se haya aplicado la actualización. Si necesitas establecer el estado basado en el estado anterior, puedes pasar una función a `nextState` como se describe anteriormente.

<Note>

Llamar a `setState` en componentes de clase es similar a llamar a una función `set` en componentes funcionales.

[Mira cómo migrar.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

Si defines `shouldComponentUpdate`, React lo llamará para determinar si se puede omitir una nueva representación.

Si estás seguro de que quieres escribirlo a mano, puedes comparar `this.props` con `nextProps` y `this.state` con `nextState` y devolver `false` para indicar a React que se puede omitir la actualización.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nothing has changed, so a re-render is unnecessary
      return false;
    }
    return true;
  }

  // ...
}

```

React llama a `shouldComponentUpdate` antes de renderizar cuando se reciben nuevas props o estado. Por defecto, devuelve `true`. Este método no se llama para la renderización inicial o cuando se usa [`forceUpdate`](#forceupdate).

#### Parámetros {/*shouldcomponentupdate-parameters*/}

- `nextProps`: Las próximas props que el componente está a punto de renderizar. Compare `nextProps` con [`this.props`](#props) para determinar lo que cambió.
- `nextState`: El próximo estado con el que el componente está a punto de renderizar. Compare `nextState` con [`this.state`](#props) para determinar lo que cambió.
- `nextContext`: El próximo contexto con el que el componente está a punto de renderizar. Compare `nextContext` con [`this.context`](#context) para determinar lo que cambió. Solo está disponible si se especifica [`static contextType`](#static-contexttype) (moderno) o [`static contextTypes`](#static-contexttypes) (legado).

#### Retorna {/*shouldcomponentupdate-returns*/}

Devuelve `true` si quieres que el componente se vuelva a renderizar. Ese es el comportamiento predeterminado.

Devuelve `false` para indicar a React que se puede omitir la re-renderización.

#### Precauciones {/*shouldcomponentupdate-caveats*/}

- Este método solo existe como una optimización de rendimiento. Si su componente falla sin él, primero solucione eso.

- Considera usar [`PureComponent`](/reference/react/PureComponent) en lugar de escribir `shouldComponentUpdate` manualmente. `PureComponent` compara superficialmente las props y el estado, y reduce la posibilidad de que omita una actualización necesaria.

- No recomendamos hacer verificaciones de igualdad profunda o usar `JSON.stringify` en `shouldComponentUpdate`. Esto hace que el rendimiento sea impredecible y dependa de la estructura de datos de cada prop y estado. En el mejor de los casos, corre el riesgo de introducir paradas de varios segundos en su aplicación, y en el peor de los casos, corre el riesgo de que se bloquee.

- Devolver `false` no impide que los componentes secundarios se vuelvan a renderizar cuando cambia su estado.

- Devolver `false` no *garantiza* que el componente no se volverá a renderizar. React utilizará el valor de retorno como una sugerencia, pero aún puede elegir volver a renderizar el componente si tiene sentido hacerlo por otras razones.

<Note>

Optimizar componentes de clase con `shouldComponentUpdate` es similar a optimizar componentes de función con [`memo`.](/reference/react/memo) Los componentes de función también ofrecen una optimización más granular con [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

Si defines `UNSAFE_componentWillMount`, React lo llamará inmediatamente después del [`constructor`.](#constructor) Solo existe por razones históricas y no debe usarse en ningún código nuevo. En su lugar, usa una de las alternativas:

- Para inicializar el estado, declara [`state`](#state) como un campo de clase o establece `this.state` dentro del [`constructor`.](#constructor)
- Si necesitas ejecutar un efecto secundario o configurar una suscripción, mueve esa lógica a [`componentDidMount`](#componentdidmount) en su lugar.

[Ver ejemplos de migración de los ciclos de vida inseguros.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parámetros {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` no acepta ningún parámetro.

#### Retorna {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` no debería retornar nada.

#### Precauciones {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` no se llamará si el componente implementa [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) o [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

- A pesar de su nombre, `UNSAFE_componentWillMount` no garantiza que el componente se *montará* si su aplicación usa características modernas de React como [`Suspense`.](/reference/react/Suspense) Si se suspende un intento de renderizado (por ejemplo, porque el código de algún componente hijo aún no se ha cargado), React descartará el árbol en progreso y tratará de construir el componente desde cero durante el próximo intento. Por eso, este método es "inseguro". El código que depende del montaje (como agregar una suscripción) debe ir en [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` es el único método del ciclo de vida que se ejecuta durante [renderizado en el servidor.](/reference/react-dom/server) Para todos los propósitos prácticos, es idéntico al [`constructor`](#constructor), por lo que debería usar el `constructor` para este tipo de lógica en su lugar.

<Note>

Llamar a [`setState`](#setstate) dentro de `UNSAFE_componentWillMount` en un componente de clase para inicializar el estado es equivalente a pasar ese estado como estado inicial a [`useState`](/reference/react/useState) en un componente de función.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

Si defines `UNSAFE_componentWillReceiveProps`, React lo llamará cuando el componente reciba nuevas props. Solo existe por razones históricas y no se debe usar en ningún código nuevo. En su lugar, utiliza una de las siguientes alternativas:

- Si necesitas **realizar un efecto secundario** (por ejemplo, buscar datos, ejecutar una animación o volver a inicializar una suscripción) en respuesta a cambios en las props, mueve esa lógica a [`componentDidUpdate`](#componentdidupdate) en su lugar.
- Si necesitas **evitar volver a calcular algunos datos solo cuando cambia una prop,** utiliza un [ayudante de memoización](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) en su lugar.
- Si necesitas **"restablecer" algunos estados cuando cambia una prop,** considera hacer que un componente sea [totalmente controlado](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) o [totalmente no controlado con una clave](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) en su lugar.
- Si necesitas **"ajustar" algunos estados cuando cambia una prop,** comprueba si puedes calcular toda la información necesaria solo a partir de las props durante la renderización. Si no puedes, utiliza [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops) en su lugar.

[Ver ejemplos de migración de ciclos de vida inseguros.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)
#### Parámetros {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: Las próximas props que el componente está a punto de recibir de su componente padre. Compara `nextProps` con [`this.props`](#props) para determinar qué ha cambiado.
- `nextContext`: El próximo contexto que el componente está a punto de recibir del proveedor más cercano. Compara `nextContext` con [`this.context`](#context) para determinar qué ha cambiado. Solo está disponible si se especifica [`static contextType`](#static-contexttype) (moderno) o [`static contextTypes`](#static-contexttypes) (legado).

#### Retorna {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` no debe devolver nada.

#### Precauciones {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` no se llamará si el componente implementa [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) o [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

- A pesar de su nombre, `UNSAFE_componentWillReceiveProps` no garantiza que el componente *recibirá* esas props si tu aplicación utiliza características modernas de React como [`Suspense`](/reference/react/Suspense). Si un intento de renderizado se suspende (por ejemplo, porque el código para algún componente hijo aún no se ha cargado), React descarta el árbol en progreso e intenta construir el componente desde cero durante el próximo intento. Para el momento del próximo intento de renderizado, las props podrían ser diferentes. Es por eso que este método es "inseguro". El código que debe ejecutarse solo para actualizaciones confirmadas (como restablecer una suscripción) debe ir en [`componentDidUpdate`](#componentdidupdate).

- `UNSAFE_componentWillReceiveProps` no significa que el componente haya recibido props *diferentes* a las de la última vez. Debes comparar `nextProps` y `this.props` por ti mismo para verificar si algo ha cambiado.

- React no llama a `UNSAFE_componentWillReceiveProps` con props iniciales durante el montaje. Solo llama a este método si alguna de las props del componente se va a actualizar. Por ejemplo, llamar a [`setState`](#setstate) generalmente no activa `UNSAFE_componentWillReceiveProps` dentro del mismo componente.

<Note>

Llamar a [`setState`](#setstate) dentro de `UNSAFE_componentWillReceiveProps` en un componente de clase para "ajustar" el estado es equivalente a [llamar a la función `set` de `useState` durante el renderizado](/reference/react/useState#storing-information-from-previous-renders) en un componente de función.
</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


Si defines `UNSAFE_componentWillUpdate`, React lo llamará antes de renderizar con las nuevas props o estado. Solo existe por razones históricas y no debe usarse en ningún código nuevo. En su lugar, usa una de las alternativas siguientes:

- Si necesitas realizar un efecto secundario (por ejemplo, recuperar datos, ejecutar una animación o reinicializar una suscripción) en respuesta a cambios de prop o estado, mueve esa lógica a [`componentDidUpdate`](#componentdidupdate) en su lugar.
- Si necesitas leer alguna información del DOM (por ejemplo, para guardar la posición actual de desplazamiento) para usarla en [`componentDidUpdate`](#componentdidupdate) más tarde, léela dentro de [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) en su lugar.

[Ver ejemplos de migración de ciclos de vida inseguros.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parámetros {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: Las próximas props con las que el componente está a punto de renderizarse. Compara `nextProps` con [`this.props`](#props) para determinar qué ha cambiado.
- `nextState`: El próximo estado con el que el componente está a punto de renderizarse. Compara `nextState` con [`this.state`](#state) para determinar qué ha cambiado.

#### Retorna {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` no debería devolver nada.

#### Precauciones {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` no se llamará si [`shouldComponentUpdate`](#shouldcomponentupdate) está definido y devuelve `false`.

- `UNSAFE_componentWillUpdate` no se llamará si el componente implementa [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) o [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

- No es compatible llamar a [`setState`](#setstate) (o cualquier método que lleve a que se llame a `setState`, como despachar una acción de Redux) durante `componentWillUpdate`.

- A pesar de su nombre, `UNSAFE_componentWillUpdate` no garantiza que el componente *se actualizará* si su aplicación utiliza características modernas de React como [`Suspense`.](/reference/react/Suspense) Si se suspende un intento de renderizado (por ejemplo, porque el código para algún componente hijo aún no se ha cargado), React descarta el árbol en progreso e intenta construir el componente desde cero durante el próximo intento. Para el momento del próximo intento de renderizado, las props y el estado pueden ser diferentes. Es por eso que este método es "peligroso". El código que solo debe ejecutarse para actualizaciones comprometidas (como restablecer una suscripción) debe ir en [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillUpdate` no significa que el componente haya recibido props o estado *diferentes* que la última vez. Necesitas comparar `nextProps` con `this.props` y `nextState` con `this.state` por ti mismo para verificar si algo ha cambiado.

- React no llama a `UNSAFE_componentWillUpdate` con las props y el estado iniciales durante el montaje.

<Note>

No hay un equivalente directo a `UNSAFE_componentWillUpdate` en componentes de función.

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

Esta API será eliminada en una futura versión importante de React. [En su lugar, usa `static contextType`.](#static-contexttype)

</Deprecated>

Te permite especificar qué [contexto legado](https://reactjs.org/docs/legacy-context.html) es proporcionado por este componente.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

Esta API será eliminada en una versión mayor futura de React. [Use `static contextType` en su lugar.](#static-contexttype)

</Deprecated>

Te permite especificar qué [contexto heredado](https://reactjs.org/docs/legacy-context.html) es consumido por este componente.

---

### `static contextType` {/*static-contexttype*/}

Si deseas leer `this.context` desde tu componente de clase, debes especificar qué contexto debe leer. El contexto que especifiques como `static contextType` debe ser un valor creado previamente por [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Leer `this.context` en componentes de clase es equivalente a [`useContext`](/reference/react/useContext) en componentes de función.

[Mira cómo migrar.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Puedes definir `static defaultProps` para establecer las props predeterminadas para la clase. Se utilizarán para props `undefined` y faltantes, pero no para props `null`.

Por ejemplo, así es como defines que la prop `color` debe tener como valor predeterminado `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

Si la propiedad `color` no se proporciona o es `undefined`, se establecerá por defecto en `'blue'`:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

Definir `defaultProps` en componentes de clase es similar a usar [valores predeterminados](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) en componentes de función.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

Si defines `static getDerivedStateFromError`, React lo llamará cuando un componente hijo (incluyendo componentes hijos distantes) arroje un error durante el rendering. Esto te permite mostrar un mensaje de error en lugar de limpiar la interfaz de usuario.

Por lo general, se utiliza junto con [`componentDidCatch`](#componentDidCatch), que te permite enviar el informe de errores a algún servicio de análisis. Un componente con estos métodos se llama una *línea de error*.

[Mira un ejemplo.](#catching-rendering-errors-with-an-error-boundary)

#### Parámetros {/*static-getderivedstatefromerror-parameters*/}

* `error`: El error que se produjo. En la práctica, generalmente será una instancia de [`Error`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error), pero esto no está garantizado porque JavaScript permite arrojar cualquier valor, incluyendo cadenas o incluso `null`.

#### Retorna {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` debería devolver el estado que indica al componente que muestre el mensaje de error.

#### Precauciones {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` debe ser una función pura. Si deseas realizar un efecto secundario (por ejemplo, llamar a un servicio de análisis), también debes implementar [`componentDidCatch`.](#componentdidcatch)


<Note>

Todavía no existe un equivalente directo de `static getDerivedStateFromError` en componentes de función. Si desea evitar crear componentes de clase, escriba un solo componente `ErrorBoundary` como se muestra arriba y úselo en toda su aplicación. Alternativamente, utilice el paquete [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) que lo hace.


</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

Si defines `static getDerivedStateFromProps`, React lo llamará justo antes de llamar a [`render`,](#render) tanto en el montaje inicial como en actualizaciones posteriores. Debería devolver un objeto para actualizar el estado, o `null` para no actualizar nada.

Este método existe para [casos de uso raros](https://es.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) donde el estado depende de los cambios en las propiedades con el tiempo. Por ejemplo, este componente `Form` restablece el estado `email` cuando cambia la propiedad `userID`:


```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Ten en cuenta que este patrón requiere que mantengas un valor anterior de la propiedad (como `userID`) en el estado (como `prevUserID`).


<Pitfall>

Derivar el estado conduce a un código verboso y hace que tus componentes sean difíciles de entender. [Asegúrate de estar familiarizado con alternativas más simples:](https://es.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- Si necesitas **realizar un efecto secundario** (por ejemplo, recuperar datos o una animación) en respuesta a un cambio en las propiedades, utiliza el método [`componentDidUpdate`](#componentdidupdate) en su lugar.
- Si deseas **volver a calcular algunos datos solo cuando cambia una propiedad,** [utiliza una función de memoización en su lugar.](https://es.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- Si deseas **"restablecer" algún estado cuando cambia una propiedad,** considera hacer que el componente sea [totalmente controlado](https://es.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) o [totalmente no controlado con una clave](https://es.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) en su lugar.


</Pitfall>

#### Parámetros {/*static-getderivedstatefromprops-parameters*/}

- `props`: Las próximas props que el componente está a punto de renderizar.
- `state`: El próximo estado que el componente está a punto de renderizar.

#### Retorna {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` devuelve un objeto para actualizar el estado, o `null` para no actualizar nada.

#### Precauciones {/*static-getderivedstatefromprops-caveats*/}

- Este método se ejecuta en *cada* renderización, independientemente de la causa. Esto es diferente de [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops), que solo se ejecuta cuando el padre causa una re-renderización y no como resultado de un `setState` local.
- Este método no tiene acceso a la instancia del componente. Si lo desea, puede reutilizar algún código entre `static getDerivedStateFromProps` y otros métodos de clase extrayendo funciones puras de las props y el estado del componente fuera de la definición de la clase.

<Note>

Implementar `static getDerivedStateFromProps` en un componente de clase es equivalente a [llamar a la función `set` de `useState` durante el renderizado](/reference/react/useState#storing-information-from-previous-renders) en un componente de función.

</Note>

---

## Uso {/*usage*/}

### Definiendo un componente de clase {/*defining-a-class-component*/}

Para definir un componente React como una clase, extiende la clase integrada `Component` y define un [`método render:`](#render).

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React llamará a tu método [`render`](#render) cada vez que necesite determinar qué mostrar en la pantalla. Por lo general, devolverás algo de [JSX](/learn/writing-markup-with-jsx). Tu método `render` debe ser una [función pura:](https://en.wikipedia.org/wiki/Pure_function) solo debe calcular el JSX.

De manera similar a [los componentes de función,](/learn/your-first-component#defining-a-component) un componente de clase puede [recibir información mediante props](/learn/your-first-component#defining-a-component) de su componente padre. Sin embargo, la sintaxis para leer los props es diferente. Por ejemplo, si el componente padre renderiza `<Greeting name="Taylor" />`, entonces puedes leer el prop `name` desde [`this.props`](#props), como `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Ten en cuenta que los Hooks (funciones que comienzan con `use`, como [`useState`](/reference/react/useState)) no son compatibles dentro de componentes de clase.

<Pitfall>

Recomendamos definir los componentes como funciones en lugar de clases. [Mira cómo migrar.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Añadiendo estado a un componente de clase {/*adding-state-to-a-class-component*/}

Para agregar [estado](/learn/state-a-components-memory) a una clase, se debe asignar un objeto a una propiedad llamada [`state`](#state). Para actualizar el estado, se debe llamar a [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Incrementar edad
        </button>
        <p>Hola, {this.state.name}. Tienes {this.state.age} años.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

Recomendamos definir los componentes como funciones en lugar de clases. [Mira cómo hacer la transición](#migrating-a-component-with-state-from-a-class-to-a-function).

</Pitfall>

---

### Añadiendo métodos de ciclo de vida a un componente de clase {/*adding-lifecycle-methods-to-a-class-component*/}

Hay algunos métodos especiales que puedes definir en tu clase.

Si defines el método [`componentDidMount`](#componentdidmount), React lo llamará cuando tu componente se agregue *(monte)* por primera vez en la pantalla. React llamará a [`componentDidUpdate`](#componentdidupdate) después de que tu componente se vuelva a renderizar debido a cambios en las props o el estado. React llamará a [`componentWillUnmount`](#componentwillunmount) después de que tu componente se haya eliminado *(desmontado)* de la pantalla.

Si implementas `componentDidMount`, generalmente necesitarás implementar los tres ciclos de vida para evitar errores. Por ejemplo, si `componentDidMount` lee algún estado o props, también debes implementar `componentDidUpdate` para manejar sus cambios, y `componentWillUnmount` para limpiar lo que `componentDidMount` estaba haciendo.

Por ejemplo, este componente `ChatRoom` mantiene una conexión de chat sincronizada con las props y el estado:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Selecciona el chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Bienvenido al chat {this.props.roomId}!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Nota que en desarrollo, cuando [Strict Mode](/reference/react/StrictMode) está activado, React llamará a `componentDidMount`, luego llamará inmediatamente a `componentWillUnmount`, y luego llamará a `componentDidMount` nuevamente. Esto te ayuda a notar si olvidaste implementar `componentWillUnmount` o si su lógica no refleja completamente lo que hace `componentDidMount`.

<Pitfall>

Recomendamos definir los componentes como funciones en lugar de clases. [Mira cómo migrar](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function).

</Pitfall>

---

### Capturando errores de renderizado con un error boundary {/*catching-rendering-errors-with-an-error-boundary*/}

Por defecto, si tu aplicación lanza un error durante el renderizado, React eliminará su interfaz de usuario de la pantalla. Para evitar esto, puedes envolver una parte de tu interfaz de usuario en un *error boundary*. Un error boundary es un componente especial que te permite mostrar alguna interfaz de usuario alternativa en lugar de la que falló, por ejemplo, un mensaje de error.

Para implementar un componente de error boundary, debes proporcionar [`static getDerivedStateFromError`](#static-getderivedstatefromerror) que te permite actualizar el estado en respuesta a un error y mostrar un mensaje de error al usuario. También puedes implementar opcionalmente [`componentDidCatch`](#componentdidcatch) para agregar algo de lógica adicional, por ejemplo, para registrar el error en un servicio de análisis.

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Luego, puedes envolver una parte de tu árbol de componentes con él:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

Si `Profile` o su componente hijo arroja un error, `ErrorBoundary` "capturará" ese error, mostrará una IU de respaldo con el mensaje de error que ha proporcionado y enviará un informe de error de producción a su servicio de informes de errores.

No es necesario envolver cada componente en un error boundary por separado. Al considerar la [granularidad de los error boundaries,](https://aweary.dev/fault-tolerance-react/) considere dónde tiene sentido mostrar un mensaje de error. Por ejemplo, en una aplicación de mensajería, tiene sentido colocar un error boundary alrededor de la lista de conversaciones. También tiene sentido colocar uno alrededor de cada mensaje individual. Sin embargo, no tendría sentido colocar un límite alrededor de cada avatar.

<Note>

Actualmente, no hay forma de escribir un error boundary como un componente de función. Sin embargo, no tienes que escribir la clase del error boundary tú mismo. Por ejemplo, puedes usar [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) en su lugar.

</Note>

---

## Alternativas {/*alternatives*/}

### Migrando un componente simple de clase a función {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Por lo general, [definirás los componentes como funciones](/learn/your-first-component#defining-a-component).

Por ejemplo, supongamos que estás convirtiendo este componente de clase `Greeting` en una función:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hola, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Defina una función llamada `Greeting`. Aquí es donde moverá el cuerpo de su función `render`.

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

En lugar de `this.props.name`, define la prop `name` [usando la sintaxis de desestructuración](/learn/passing-props-to-a-component) y lee directamente de ella:

```js
function Greeting({ name }) {
  return <h1>Hola, {name}!</h1>;
}
```

Aquí tienes un ejemplo completo:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Migrando un componente con estado de clase a funcion {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Supongamos que estás convirtiendo este componente de clase `Counter` en una función:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Incrementar edad
        </button>
        <p>Hola, {this.state.name}. Tienes {this.state.age} años.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Empieza declarando una función con las [variables de estado necesarias:](/reference/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

A continuación, convierte los manejadores de eventos:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Finalmente, reemplaza todas las referencias que comienzan con `this` con las variables y funciones que definiste en tu componente. Por ejemplo, reemplaza `this.state.age` con `age`, y reemplaza `this.handleNameChange` con `handleNameChange`.

Aquí tienes el componente completamente convertido:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Incrementar edad
      </button>
      <p>Hola, {name}. Tienes {age} años.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Migrando un componente con métodos de ciclo de vida de clase a funcion {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Supongamos que estás convirtiendo este componente de clase `ChatRoom` con métodos del ciclo de vida a una función:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Selecciona el chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Bienvenido al chat {this.props.roomId}!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Primero, verifica que tu método [`componentWillUnmount`](#componentwillunmount) haga lo contrario de [`componentDidMount`](#componentdidmount). En el ejemplo anterior, eso es cierto: desconecta la conexión que `componentDidMount` establece. Si falta tal lógica, agregala primero.

A continuación, verifica que tu método [`componentDidUpdate`](#componentdidupdate) maneje los cambios en todas las props y el estado que estás usando en `componentDidMount`. En el ejemplo anterior, `componentDidMount` llama a `setupConnection` que lee `this.state.serverUrl` y `this.props.roomId`. Es por eso que `componentDidUpdate` verifica si `this.state.serverUrl` y `this.props.roomId` han cambiado, y restablece la conexión si lo hicieron. Si falta la lógica de `componentDidUpdate` o no maneja los cambios en todas las props y el estado relevantes, corrígelo primero.

En el ejemplo anterior, la lógica dentro de los métodos de ciclo de vida conecta el componente a un sistema fuera de React (un servidor de chat). Para conectar un componente a un sistema externo, [describe esta lógica como un solo Effect:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

Esta llamada a [`useEffect`](/reference/react/useEffect) es equivalente a la lógica en los métodos del ciclo de vida mencionados anteriormente. Si sus métodos del ciclo de vida realizan varias cosas no relacionadas, [divídalos en varios efectos independientes.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Aquí hay un ejemplo completo con el que puede trabajar:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Selecciona el chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bienvenido al chat {roomId}!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

Si tu componente no se sincroniza con ningún sistema externo, [es posible que no necesites un Effect.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrando un componente con contexto de clase a funcion {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

En este ejemplo, los componentes de clase `Panel` y `Button` leen el [contexto](/learn/passing-data-deeply-with-context) desde [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Bienvenido">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Cuando los conviertas a componentes de función, reemplaza `this.context` con llamadas a [`useContext`](/reference/react/useContext):

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Bienvenido">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
