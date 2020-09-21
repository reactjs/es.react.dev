---
id: higher-order-components
title: Componentes de orden superior
permalink: docs/higher-order-components.html
---

Un componente de orden superior (*HOC* por las siglas en inglés de *higher-order component*) es una técnica avanzada en React para el reuso de la lógica de componentes. Los *HOCs* no son parte de la API de React. Son un patrón que surge de la naturaleza composicional de React.

En concreto, **un componente de orden superior es una función que recibe un componente y devuelve un nuevo componente.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Mientras que un componente transforma _props_ en interfaz de usuario, un componente de orden superior transforma un componente en otro.

Los *HOCs* son comunes en bibliotecas de terceros usadas en React, tales como [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) en *Redux* y [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html) en *Relay*.

En este documento discutiremos por qué los componentes de orden superior son útiles y como escribir tus propios *HOCs*.

## Usa HOCs para preocupaciones transversales

> **Nota**
>
> Anteriormente recomendábamos el uso de *mixins* para manejar las preocupaciones transversales. Desde entonces, nos hemos dado cuenta que los *mixins* causan más problemas de los que resuelven. [Lee más](/blog/2016/07/13/mixins-considered-harmful.html) acerca de por qué hemos decidido alejarnos de los *mixins* y como puedes migrar tus componentes existentes.

Los componentes son la unidad primaria de reuso de código en React. Sin embargo, encontrarás que algunos patrones no se ajustan directamente a componentes tradicionales.

Por ejemplo, digamos que tienes un componente `CommentList` que se suscribe a una fuente de datos externa para renderizar una lista de comentarios:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" es alguna fuente de datos global
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Suscribirse a los cambios
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Eliminar el manejador de eventos de cambios
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Actualizar el estado del componente cuando la fuente de datos cambie
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Posteriormente escribes un componente para suscribirte a un único post de un blog, el cual sigue un patrón similar:

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` y `BlogPost` no son idénticos, ambos llaman a métodos distintos en `DataSource`, y renderizan una salida diferente. Pero gran parte de su implementación es la misma:

- Al montar, añadir un manejador de eventos de cambio al `DataSource`.
- En el manejador de eventos, llamar `setState` cada vez que la fuente de datos cambie.
- Al desmontar, eliminar el manejador de eventos de cambio.

Puedes imaginarte que en una aplicación grande, este mismo patrón de suscribirse a `DataSource` y llamar `setState` se repetirá una y otra vez. Necesitamos una abstracción que nos permita definir esta lógica en un solo lugar y compartirla a través de múltiples componentes. En esto es donde los componentes de orden superior se destacan.

Podemos crear una función que cree componentes, como `CommentList` y `BlogPost`, que se subscriben a `DataSource`. La función aceptará como uno de sus argumentos un componente hijo que recibirá los datos suscritos como un *prop*. Llamemos esta función `withSubscription`:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

El primer parámetro es el componente envuelto. El segundo parámetro obtiene los datos en los que estamos interesados dado un `DataSource` y los *props* actuales.

Cuando `CommentListWithSubscription` y `BlogPostWithSubscription` sean renderizados, `CommentList` y `BlogPost` recibirán un *prop* `data` con los datos más actualizados recibidos de `DataSource`:

```js
// Esta función recibe un componente...
function withSubscription(WrappedComponent, selectData) {
  // ...y devuelve otro componente...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... que se encarga de la suscripción...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... y renderiza el componente envuelto con los datos frescos!
      // Toma nota de que pasamos cualquier prop adicional
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Nótese que un *HOC* no modifica el componente de entrada, ni usa herencia para copiar su comportamiento. En su lugar, un *HOC* **compone** el componente original al **envolverlo** en un componente contenedor. Un *HOC* es una función pura sin efectos colaterales.

¡Y, eso es todo!. El componente envuelto recibe todos los *props* del contenedor, junto con un nuevo *prop*, `data`, el cual es usado para renderizar su salida. Al *HOC* no le importa cómo o porqué los datos son usados, y al componente envuelto no le importa de donde proceden los datos.

Debido a que `withSubscription` es una función normal, puedes añadir tantos, o tan pocos, argumentos como desees. Por ejemplo, puedes querer hacer el nombre del *prop* `data` configurable, para aislar aún más el *HOC* del componente envuelto. O podrías aceptar un argumento que configure `shouldComponentUpdate`, o alguno que configure la fuente de datos. Todo esto es posible porque el *HOC* tiene el control total sobre como se define el componente.

Tal como los componentes, el contrato entre `withSubscription` y el componente envuelto está basado completamente en los *props*. Esto hace fácil intercambiar un *HOC* por otro, siempre y cuando provean los mismos *props* al componente envuelto. Esto puede ser útil si cambias de bibliotecas de obtención de datos, por ejemplo.

## No mutes el componente original. Usa composición.

Resiste la tentación de modificar el prototipo de un componente (o de mutarlo de cualquier otra forma) dentro de un *HOC*

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // El hecho de que estamos devolviendo la entrada original es una pista
  // de que ha sido mutada.
  return InputComponent;
}

// EnhancedComponent se encargará de logear cuando los props sean recibidos
const EnhancedComponent = logProps(InputComponent);
```

Existen varios problemas con esto. Uno es que el componente de entrada no podrá ser usado aparte del componente mejorado. Más importante aún, si aplicas otro *HOC* al `EnhancedComponent` que **también** mute `componentDidUpdate`, ¡la funcionalidad del primer *HOC* será sobrescrita!. Este *HOC* tampoco funcionará con componentes funcionales, los cuales no poseen los métodos del ciclo de vida.

Mutar *HOCs* es una abstracción con fugas, el consumidor tiene que saber como están implementados para evitar conflictos con otros *HOCs*.

En lugar de mutaciones, los *HOCs* deben usar composición, al envolver el componente de entrada en un componente contenedor.

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // Envuelve el componente de entrada en un contenedor, sin mutarlo. ¡Bien!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

Este *HOC* posee la misma funcionalidad que la versión con mutación, pero al mismo tiempo evita el potencial de conflictos. Funciona igualmente bien con componentes de clase o de función. Y dado que es una función pura es posible componerlo con otros *HOCs*, o incluso consigo mismo.

Puedes haber notado similitud entre los *HOCs* y un patrón llamado **componentes contenedores**. Los componentes contenedores son parte de una estrategia de separación de responsabilidades entre preocupaciones de alto y bajo nivel. Los contenedores manejan temas como subscripciones y estado, y pasan *props* a componentes que manejan temas como renderizar la interfaz de usuario. Los *HOCs* usan contenedores como parte de su implementación. Puedes pensar en los *HOCs* como definiciones de componentes contenedores parametrizables. 

## Convención: Pasa los *Props* no relacionados al componente envuelto

Los *HOCs* añaden funcionalidad a un componente. No deberían alterar de forma drástica su contrato. Se espera que el componente devuelto por un *HOC* tenga una interfaz similar al componente envuelto.

Los *HOCs* deben pasar directamente los *props* que no tengan relación con su preocupación específica. La mayoría de los *HOCs* contienen un método `render` que se ve algo como esto: 

```js
render() {
  // Filtra los props extras que son específicos de este HOC y que no deben
  // ser pasados
  const { extraProp, ...passThroughProps } = this.props;

  // Inyecta los props en el componente envuelto. Estos son usualmente valores
  // de estado o métodos de instancia
  const injectedProp = someStateOrInstanceMethod;

  // Pasa los props al componente envuelto
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

Esta convención ayuda a asegurar que los *HOCs* sean tan flexibles y reutilizables como sea posible.

## Convención: Maximizar la componibilidad

No todos los *HOCs* se ven igual. Algunas veces aceptan tan solo un argumento, el componente envuelto:

```js
const NavbarWithRouter = withRouter(Navbar);
```

Usualmente aceptan argumentos adicionales. En este ejemplo de *Relay* un objeto de configuración es usado para especificar las dependencias de datos de un componente:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

La firma más común para los *HOCs* se ve así:

```js
// `connect` en react-redux
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*!¿Qué?!* Si lo divides en partes es más fácil de entender que sucede.

```js
// connect es una función que retorna otra función
const enhance = connect(commentListSelector, commentListActions);
// La función retornada es un HOC, el cual retorna un componente conectado
// al `store` de Redux
const ConnectedComment = enhance(CommentList);
```
En otras palabras, `connect` es una función de orden superior que devuelve un componente de orden superior!

Esta forma puede parecer confusa o innecesaria, pero tiene una propiedad útil. Los *HOCs* de un solo argumento, como los que devuelve la función `connect` tienen la firma `Component => Component`. Las funciones cuyo tipo de salida es el mismo que el de entrada son muy fáciles de componer.

```js
// En lugar de hacer esto...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... puedes usar una utilidad para componer funciones
// compose(f, g, h) es lo mismo que (...args) => f(g(h(...args)))
const enhance = compose(
  // Ambos son HOCs que reciben un único argumento
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(Esta misma propiedad también permite a `connect`, y a otros *HOCs* de estilo mejoradores, que sean usados como decoradores, una propuesta experimental en JavaScript.)

La función utilitaria `compose` es provista por muchas bibliotecas de terceros, incluida en *lodash* (como [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), en [Redux](https://redux.js.org/api/compose), y en [Ramda](http://ramdajs.com/docs/#compose).

## Convención: Envuelve el nombre a mostrar para una depuración fácil

Los componentes contenedores creados por los *HOCs* se muestran en las [Herramientas de Desarrollo de React](https://github.com/facebook/react-devtools) como cualquier otro componente. Para facilitar la depuración elige que se muestre un nombre que comunique que es el resultado de un *HOC*.

La técnica más común consiste en envolver el `displayName` del componente envuelto. De esta forma si tu componente de orden superior se llama `withSubscription`, y el `displayName` del componente envuelto es `CommentList`, usa como nombre a mostrar `WithSubscription(CommentList)`:

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## Consideraciones

Los componentes de orden superior vienen con algunas consideraciones que no son obvias inmediatamente si eres nuevo en React.

### No uses *HOCs* dentro del método *render*

El algoritmo de detección de diferencias de React (llamado reconciliación) utiliza la identidad del componente para determinar si debe actualizar el subárbol existente o desecharlo y montar uno nuevo. Si el componente devuelto por `render` es idéntico (`===`) al componente de la llamada a `render` previa, React actualiza el subárbol calculando las diferencias con el nuevo. Si no son iguales, el subárbol anterior es desmontado completamente.

Normalmente no es necesario pensar acerca de esto. Pero importa para los *HOCs* porque significa que no puedes aplicar un *HOC* a un componente dentro del método `render` de otro componente:

```js
render() {
  // Una nueva versión de EnhancedComponent es creada en cada render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // Esto causa que el subárbol entero se desmonte/monte cada vez!
  return <EnhancedComponent />;
}
```

El problema aquí mostrado no es tan solo acerca del rendimiento, desmontar un componente causa que el estado de ese componente y de todos sus hijos se pierda.

En su lugar, aplica los *HOCs* por fuera de la definición del componente de manera que el componente resultante se creado solo una vez. De esta forma su identidad será consistente entre llamadas a `render`. Esto, de todas formas, es lo que usualmente deseas.

En aquellos casos extraños donde necesites aplicar un *HOC* de forma dinámica, también puedes hacerlo en los métodos del ciclo de vida, o en su constructor.

### Los métodos estáticos deben ser copiados

A veces resulta útil definir un método estático en un componente React. Por ejemplo, los contenedores de *Relay* exponen el método estático `getFragment` para facilitar la composición de fragmentos *GraphQL*.

Sin embargo, cuando aplicas un *HOC* a un componente, el componente original es envuelto en un componente contenedor. Eso quiere decir que el nuevo componente no tendrá ninguno de los métodos estáticos del componente original.

```js
// Define un método estático
WrappedComponent.staticMethod = function() {/*...*/}
// Ahora aplica un HOC
const EnhancedComponent = enhance(WrappedComponent);

// El componente mejorado no tiene el método estático
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

Para solucionar esto debes copiar los métodos en el contenedor antes de devolverlo:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Debes saber exactamente que método(s) copiar :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

Sin embargo, esto requiere que conozcas exactamente cuales métodos necesitan ser copiados. Puedes usar la biblioteca [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) para copiar automáticamente todos los métodos estáticos no relacionados con React:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Otra solución posible es exportar los métodos estáticos de forma separada del propio componente.

```js
// En lugar de...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...exporta el método de forma separada...
export { someFunction };

// ...y en el módulo que los consuma, importa ambos
import MyComponent, { someFunction } from './MyComponent.js';
```

### Las *Refs* no son pasadas

Aunque la convención para los componentes de orden superior es pasar todos los *props* al componente envuelto, esto no funciona para las *refs*. Esto es porque `ref` no es realmente un *prop*, al igual que `key` es manejado de forma especial por React. Si añades una *ref* a un elemento cuyo componente es el resultado de un *HOC*, esa *ref* se refiere a la instancia del componente contenedor más externo, no al componente envuelto.

La solución a este problema es usar la API `React.forwardRef` (introducida con React 16.3). [Aprende más acerca de esta API en la sección acerca de Reenvío de Refs](/docs/forwarding-refs.html).
