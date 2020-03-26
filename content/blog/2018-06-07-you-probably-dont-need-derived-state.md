---
title: "Probablemente no necesitas estado derivado"
author: [bvaughn]
---

React 16.4 incluyó una [solución para un error en getDerivedStateFromProps](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops) que causó que algunos errores existentes en componentes de React se reprodujeran con mayor consistencia. Si esta versión expuso un caso en el que tu aplicación estaba usando un antipatrón y dejó de funcionar correctamente después de la solución, lo sentimos por la confusión creada. En este artículo, explicaremos algunos antipatrones comunes que involucran estado derivado y nuestras alternativas preferidas.

Por mucho tiempo, el método de ciclo de vida `componentWillReceiveProps` era la única forma de actualizar el estado en respuesta a un cambio en las props sin un renderizado adicional. En la versión 16.3, [introdujimos un reemplazo, `getDerivedStateFromProps`](/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes) para resolver los mismos casos de uso de forma más segura. Al mismo tiempo, nos hemos dado cuenta que se tienen muchas concepciones erróneas sobre cómo usar ambos métodos, y hemos encontrado antipatrones que terminan en errores sutiles y confusos. La solución del error en `getDerivedStateFromProps` en la versión 16.4 [hace que el estado derivado sea más predecible](https://github.com/facebook/react/issues/12898), de manera que los resultados de usarlo incorrectamente sean más fáciles de detectar.

> Nota
>
> Todos los antipatrones descritos en este artículo se pueden aplicar tanto al antiguo `componentWillReceiveProps` como al más nuevo `getDerivedStateFromProps`.

 Este artículo cubrirá los siguientes temas:
* [¿Cuándo usar estado derivado?](#when-to-use-derived-state)
* [Errores comunes al usar estado derivado](#common-bugs-when-using-derived-state)
  * [Antipatrón: Copiar incondicionalmente las props al estado](#anti-pattern-unconditionally-copying-props-to-state)
  * [Antipatrón: Borrar el estado cuando cambian las props](#anti-pattern-erasing-state-when-props-change)
* [Soluciones preferidas](#preferred-solutions)
* [¿Y qué pasa con la memoización?](#what-about-memoization)

## ¿Cuándo usar estado derivado? {#when-to-use-derived-state}

`getDerivedStateFromProps` existe solamente con un propósito. Permite a un componente actualizar su estado interno como resultado de **cambios en las props**. Nuestro artículo anterior en el blog proporcionaba algunos ejemplos, como [guardar la dirección actual del desplazamiento con base en una prop de los cambios de intervalos de desplazamiento](/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) o [cargar datos externos especificados por una prop fuente](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change).

No proporcionamos muchos ejemplos, porque por regla general, **el estado derivado debe ser usado con moderación**. Todos los problemas con el estado derivado que hemos visto pueden reducirse en última instancia o bien (1) a actualizar incondicionalmente el estado a partir de las props o (2) a actualizar el estado cuando las props y el estado no coinciden. (Veremos ambos con mayor detalle más adelante).

* Si estás usando estado derivado para memoizar algún cálculo basado solo en las props actuales, no necesitas estado derivado. Ve debajo [¿Y qué pasa con la memoización?](#what-about-memoization).
* Si estás actualizando el estado derivado incondicionalmente o actualizándolo cuando las props y el estado no coinciden, es probable que tu componente reinicie su estado con demasiada frecuencia. Continúa leyendo para mayores detalles.

## Errores comunes cuando se usa estado derivado {#common-bugs-when-using-derived-state}

Los términos [«controlado»](/docs/forms.html#controlled-components) y [«no controlado»](/docs/uncontrolled-components.html) a menudo hacen referencia a las entradas de un formulario, pero también pueden describir donde residen los datos de un componente cualquiera. Los datos que se pasan como props se pueden ver como **controlados** (porque el componente padre _controla_ los datos). Los datos que existen solo en el estado interno se pueden ver como **no controlados** (porque el padre no puede cambiarlos directamente).

El error más común con el estado derivado es mezclar ambos. Cuando un valor del estado derivado también se actualiza por llamadas a `setState`, no existe una sola fuente de verdad para los datos. El [ejemplo de la carga de datos externos](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change) que se mencionó arriba puede parecer similar, pero es diferente en varias aspectos importantes. En el ejemplo de la carga, hay una clara fuente de verdad tanto para la prop «fuente» y el estado «de carga». Cuando la prop fuente cambia, el estado de carga **siempre** debería sobrescribirse. A la inversa, el estado se sobrescribe solo cuando la prop **cambia** y de otra manera es manejada por el componente.

Los problemas surgen cuando cualquiera de estas restricciones cambian. Esto suele suceder de dos formas. Veamos ambas.

### Antipatrón: Copiar incondicionalmente las props al estado {#anti-pattern-unconditionally-copying-props-to-state}

Una concepción errónea que se encuentra a menudo es que `getDerivedStateFromProps` y `componentWillReceiveProps` se llaman solo cuando las props «cambian». Estos métodos de ciclo de vida se llaman cada vez que el componente padre se vuelve a renderizar, sin importar si las props son «diferentes» a las anteriores. Debido a esto, siempre ha sido inseguro sobrescribir _incondicionalmente_ el estado usando cualquiera de estos métodos de ciclo de vida. **Hacerlo causará que las actualizaciones al estado se pierdan.**

Consideremos un ejemplo para demostrar el problema. Se tiene un componente `EmailInput` que «refleja» una prop email en el estado:

```js
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // ¡Esto borrará cualquier actualización del estado local!
    // No lo hagas.
    this.setState({ email: nextProps.email });
  }
}
```

Al principio, este componente puede que sea vea bien. El estado se inicializa con el valor especificado por las props y se actualiza cuando escribimos en el `<input>`. Pero si nuestro componente padre se rerenderiza, ¡cualquier cosa que hayamos escrito en el `<input>` se perderá! ([Encuentra un ejemplo en esta demo](https://codesandbox.io/s/m3w9zn1z8x)). Esto es cierto incluso si fuéramos a comparar `nextProps.email !== this.state.email` antes de reiniciar.

En este ejemplo sencillo, para solucionar esto se puede añadir `shouldComponenteUpdate` para rerenderizar solo cuando la prop email ha cambiado. Sin embargo, en la práctica, los componentes usualmente aceptan múltiples props, otra prop que cambie aún podría causar un rerenderizado y un reinicio inadecuado. Las props que son funciones u objetos a menudo se crean en línea, dificultando la implementación de `shouldComponentUpdate` que devuelva verdadero de forma confiable solo cuando un cambio material ha ocurrido. [Aquí hay una demo que muestra cómo ocurre.](https://codesandbox.io/s/jl0w6r9w59) Como resultado, `shouldComponentUpdate` es mejor usarlo como una optimización del rendimiento, no para asegurar la corrección del estado derivado.

Esperamos que quede claro en este punto por qué **es una mala idea copiar incondicionalmente las props al estado**. Antes de analizar posibles soluciones, miremos otro patrón problemático que guarda relación con este: ¿Y si fuéramos a actualizar el estado solamente cuando la prop email cambia?

### Antipatrón: Borrar el estado cuando las props cambian {#anti-pattern-erasing-state-when-props-change}

Continuando con el ejemplo de arriba, podríamos evitar accidentalmente borrar el estado si solo actualizamos cuando `props.email` cambia:

```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // Cada vez que props.email cambia, actualiza el estado.
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }
  
  // ...
}
```

> Nota
>
> Aún cuando el ejemplo de arriba muestra `componentWillReceiveProps`, el mismo antipatrón se aplica a  `getDerivedStateFromProps`.

Acabamos de hacer una gran mejora. Ahora nuestro componente borrará lo que hemos escrito solo cuando las props cambian en realidad.

Aún hay un problema sutil. Imagina una aplicación de gestión de contraseñas que use el componente de entrada de arriba. Cuando se navega entre los detalles para dos cuentas con el mismo correo, la entrada fallará en reiniciarse. ¡Esto ocurre porque el valor de la prop que se pasa al componente sería el mismo para ambas cuentas! Esto sería una sorpresa para el usuario, dado que un cambio sin guardar en una cuenta parecería afectar otras cuentas que comparten el mismo correo. ([Mira la demo aquí](https://codesandbox.io/s/mz2lnkjkrx)).

Este es un diseño fallido desde la base, pero es también un error fácil de cometer. ([¡A mí también me pasó!](https://twitter.com/brian_d_vaughn/status/959600888242307072)). Afortunadamente hay dos alternativas que funcionan mejor. La clave para ambas es que **para cualquier dato, necesitas elegir un solo componente que lo posea como la fuente de verdad y evita duplicarlo en otros componentes.** Veamos cada una de las alternativas.

## Soluciones preferidas {#preferred-solutions}

### Recomendación: Componente completamente controlado {#recommendation-fully-controlled-component}

Una forma de evitar los problemas mencionados anteriormente consiste en eliminar completamente el estado de nuestro componente. Si la dirección de correo solo existe como una prop, entonces no tenemos que preocuparnos por los conflictos con el estado. Podríamos incluso convertir `EmailInput` a un componente de función más ligero:
```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

Este enforque simplifica la implementación de nuestro componente, pero si todavía quisiéramos almacenar un valor a modo de borrador, el componente padre del formulario necesitaría hacerlo ahora manualmente. ([Haz clic aquí para ver una demo de este patrón.](https://codesandbox.io/s/7154w1l551))

### Recomendación: Componente completamente no controlado con una `key` {#recommendation-fully-uncontrolled-component-with-a-key}

Otra alternativa sería que nuestro componente se encargara completamente del estado del «borrador» del correo. En este caso, nuestro componente seguiría aceptando una prop para el valor _inicial_, pero ignoraría los cambios sucesivos a esa prop:

```js
class EmailInput extends Component {
  state = { email: this.props.defaultEmail };

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }
}
```

Para poder reiniciar el valor cuando nos movemos a un elemento diferente (como en el ejemplo del gestor de contraseñas), podemos utilizar el atributo especial de React llamado `key`. Cuando un atributo `key` cambia, React [_creará_ una nueva instancia del componente en lugar de _actualizar_ el actual](/docs/reconciliation.html#keys). El atributo `key` se utiliza a menudo para listas dinámicas, pero también es útil aquí. En nuestro caso, podríamos utilizar el ID de usuario para recrear el campo email cada vez que se seleccione un nuevo usuario:

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

Cada vez que el ID cambia, el componente `EmailInput` será recreado y su estado se reiniciará al último valor `defaultEmail`. ([Haz clic aquí para ver una demo de este patrón.](https://codesandbox.io/s/6v1znlxyxn)) Con este enfoque, no tienes que añadir `key` a cada campo. Tendría más sentido poner un atributo `key` en todo el formulario. Cada vez que el campo `key` cambia, todos los componentes dentro del formulario serán recreados con un estado nuevo.

En la mayoría de los casos, este es la mejor forma de manejar estado que necesita reiniciarse.

> Nota
>
> Si bien esto puede parecer lento, la diferencia en el rendimiento usualmente es insignificante. Usar un atributo `key` incluso puede ser más rápido si los componentes tienen una lógica compleja que se ejecuta en las actualizaciones, dado que se evita ejecutar el algoritmo de *diferenciación* para ese subárbol.

#### Alternativa 1: Reiniciar un componente controlado con una prop ID {#alternative-1-reset-uncontrolled-component-with-an-id-prop}

Si `key` no funciona por alguna razón (quizá la inicialización del componente es muy costosa), una solución que funciona, aunque engorrosa, consistiría en observar los cambios a «userID» en `getDerivedStateFromProps`:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Cada vez que el usuario actual cambia,
    // Reiniciar cualquier parte del estado que esté atada a ese usuario.
    // En este ejemplo, es solo email.
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Esto también proporciona la flexibilidad de solo reiniciar partes del estado interno de nuestro componente si elegimos que así sea. ([Haz clic aquí para ver una demo de este patrón.](https://codesandbox.io/s/rjyvp7l3rq))

> Nota
>
> Si bien el ejemplo de arriba muestra `getDerivedStateFromProps`, la misma técnica se puede usar con `componentWillReceiveProps`.

#### Alternativa 2: Reiniciar un componente no controlado con un método de instancia {#alternative-2-reset-uncontrolled-component-with-an-instance-method}

En contadas ocasiones, puedes necesitar reiniciar el estado incluso si no hay un ID apropiado para usarse como `key`. Una solución consiste en reiniciar el atributo `key` con un valor aleatorio o un número que se autoincremente cada vez que se quiera reiniciar el estado. Otra alternativa viable consiste en exponer un método de instancia para reiniciar imperativamente el estado interno:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```

El componente padre del formulario podría entonces [usar una `ref` para llamar este método](/docs/glossary.html#refs). ([Haz clic aquí para ver una demo de este patrón.](https://codesandbox.io/s/l70krvpykl))

Las refs pueden ser útiles en algunos casos como este, pero generalmente te recomendamos usarlas con moderación. Incluso en la demo, este método imperativo no es ideal, porque ocurrirán dos renderizados en lugar de uno.

-----

### Resumiendo {#recap}

Para resumir, cuando se diseña un componente, es importante decidir si sus datos serán controlados o no controlados.

En lugar de intentar **«reflejar» el valor de una prop en el estado**, haz que el componente sea **controlado**, y consolidar los dos valores divergentes en el estado de un componente padre. Por ejemplo, en lugar de que un hijo acepte un `props.valor` confirmado y monitoree un `state.valor` «temporal», que el padre maneje tanto `state.valorTemporal` y `state.valorConfirmado` y controle el valor del hijo directamente. Esto hace que el flujo de datos se más explícito y predecible.

Para componentes **no controlados**, si intentas reiniciar el estado cuando una prop en particular (usualmente un ID) cambia, tienes varias opciones:
* **Recomendación: Reiniciar _todo el estado interno_, usar el atributo `key`.**
* Alternativa 1: Reiniciar _solo algunos campos de estado_, monitorear cambios en una propiedad especial (p. ej. `props.userID`).
* Alternativa 2: Puedes considerar también recurrir a un método de instancia imperativo usando refs.

## ¿Y qué pasa con la memoización? {#what-about-memoization}

También hemos visto el uso de estado derivado para asegurar que un valor costoso que se usa en `render` sea recalculado solo cuando las entradas cambian. Esta técnica se conoce como [memoización](https://en.wikipedia.org/wiki/Memoization).

El uso de estado derivado para memoización no está necesariamente mal, pero a menudo no es la mejor solución. Existe una complejidad intrínseca en el manejo de estado derivado, y esta complejidad crece con cada propiedad adicional. Por ejemplo, si añadimos un segundo campo derivado al estado de nuestro componente, entonces nuestra implementación necesitaría monitorear independientemente los cambios de ambos.

Veamos un ejemplo de un componente que toma una prop (una lista de elementos) y renderiza los elementos que cumplan una consulta de búsqueda introducida por el usuario. Podríamos usar estado derivado para almacenar la lista filtrada:

```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // *******************************************************
  // NOTA: este ejemplo NO usa el enfoque recomendado.
  // Consulta los ejemplos de abajo para ver nuestras recomendaciones.
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // Volver a ejcutar el filtrado cada vez que la lista o el texto del filtro cambian.
    // Observa que necesitamos almacenar prevPropsList y prevFilterText para detectar cambios.
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

Esta implementación evita recalcular `filteredList` con más frecuencia de la necesaria. Pero es demasiado complicada, porque tiene que monitorerar y detectar cambios independientemente tanto en las props como en el estado para poder actualizar adecuadamente la lista filtrada. En este ejemplo, podríamos lograr una simplificación si usáramos `PureComponent` y moviéramos la operación de filtrado al método render:

```js
// Un PureComponent solo se rerenderiza si al menos un valor de estado o prop cambia.
// Se determina si cambió haciendo una comparación superficial de los elementos del estado y las props.
class Example extends PureComponent {
  // El estado solo necesita almacenar el texto del filtro actual:
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // El método render en este PureComponent se llama solo si
    // props.list o state.filterText han cambiado.
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

El enfoque de arriba es mucho más claro y simple que la versión con estado derivado. En ocasiones, sin embargo, no será lo suficientemente bueno. El filtrado pueder ser lento para listas grandes, y `PureComponent` no prevendría que se rerenderizara si otra prop cambiara. Para manejar ambas preocupaciones, podríamos añadir una utilidad de memoización para evitar refiltrar innecesariamente nuestra lista:

```js
import memoize from "memoize-one";

class Example extends Component {
  // El estado solo necesita almacenar el texto del filtro actual:
  state = { filterText: "" };

  // Volver a ejecutar el filtrado cada vez que cambia la lista o el texto del filtro:
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // Calcular la última lista filtrada. Si estos argumentos no han cambiado desde 
    // el último renderizado, `memoize-one` reutilizará el último valor de retorno.
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

¡Esto es mucho más simple y el rendimiento es tan bueno como el de la versión con estado derivado!

Cuando utilizamos memoización, recuerda un par de restricciones:

1. En la mayoría de los casos, querrás **adjuntar la función memoizada a una instancia de componente**. Esto previene que múltiples intancias de un componente se reinicien entre ellas las llaves memoizadas.
1. Normalmente querrás usar una utilidad de memoización con un **tamaño limitado de caché** para prevenir fugas de memoria con el tiempo. (En el ejemplo de arriba usamos `memoized-one`, porque solo guarda en caché los argumentos y el resultado más recientes).
1. Ninguna de las implementaciones mostradas en esta sección funcionarán si `props.list` se recrea cada vez que el componente padre se renderiza. Pero en la mayoría de los casos, esta configuración es apropiada.

## Conclusión {#in-closing}

En aplicaciones del mundo real, los componentes a menudo contienen una mezcla de comportamientos controlados y no controlados. ¡Eso está bien! Si cada valor tiene una clara fuente de verdad, puedes evitar los antipatrones que se mencionaron anteriormente.

También vale la pena reiterar que `getDerivedStateFromProps` (y en general el estado derivado) es una funcionalidad avanzada y debe usarse con moderación dada su complejidad. Si tu caso de uso se aparta de estos patrones, por favor, ¡compártelo con nosotros en [GitHub](https://github.com/reactjs/reactjs.org/issues/new) o [Twitter](https://twitter.com/reactjs)!
