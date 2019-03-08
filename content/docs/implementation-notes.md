---
id: implementation-notes
title: Notas de implementación
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---
Esta sección es una colección de notas de implementación para el [reconciliador de pila](/docs/codebase-overview.html#stack-reconciler).

Es muy técnica y asume un gran entendimiento de la API pública de React como también sobre la división de React en núcleo, renderizadores y el reconciliador. Si no estás muy familiarizado con el código base de React, primero lee la [visión general del código base](/docs/codebase-overview.html).

Además se asume una buena comprensión de las [diferencias entre componentes de React, sus instancias y sus elementos](/blog/2015/12/18/react-components-elements-and-instances.html).

El reconciliador de pila se usó en React 15 y también en versiones anteriores. Está ubicado en [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Video: Construyendo React desde 0 {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) dió una charla sobre [construir React desde 0](https://www.youtube.com/watch?v=_MAD4Oly9yg) que inspiró este documento.

Tanto este documento como su charla son simplificaciones del código base real por lo que obtendrás un mejor entendimiento familiarizándote con ambos.

### Visión general {#overview}

El reconciliador por sí mismo no tiene una API pública. Los [renderizadores](/docs/codebase-overview.html#stack-renderers) como React DOM y React Native lo usan para actualizar de manera eficiente la interfaz de usuario acorde a los componentes de React diseñados por el usuario. 

### Montando como un Proceso Recursivo {#mounting-as-a-recursive-process}

Consideremos la primera vez que montas un componente:

```js
ReactDOM.render(<App />, rootEl);
```

React DOM pasará `<App />` al reconciliador. Recuerda que `<App />` es un elemento de React, es decir, una descripción de *qué* hay que renderizar. Puedes pensarlo como si fuera un objecto simple:

```js
console.log(<App />);
// { type: App, props: {} }
```

El reconciliador comprobará si `App` es una clase o una función.

Si `App` es una función, el reconciliador llamará `App(props)` para renderizar el elemento.

Si `App` es una clase, el reconciliador instanciará una `App` con `new App(props)`, llamará al método del ciclo de vida `componentWillMount()`, y por último llamará al método `render()` para obtener el método renderizado.

De cualquier manera, el reconciliador averiguará a que elemento se renderizó `App`.

Este proceso es recursivo. `App` puede ser renderizado como `<Greeting />`, `<Greeting />` puede ser renderizado como `<Button />`, y así sucesivamente. El reconciliador examinará a fondo a través de los componentes definidos por el usuario de manera recursiva a medida que averigua a qué se renderiza cada componente.

Puedes imaginar este proceso como pseudocódigo:

```js
function isClass(type) {
  // Las subclases de React.Component tienen este indicador
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Esta función toma un elemento de React (Por ej. <App />)
// y devuelve un DOM o un nodo nativo que representa el árbol montado.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // Determinaremos el elemento renderizado
  // ejecutando su tipo como una función
  // o creando una instancia y llamando a render().
  var renderedElement;
  if (isClass(type)) {
    // Componente de clase
    var publicInstance = new type(props);
    // Establecer las props
    publicInstance.props = props;
    // Llamar al ciclo de vida si es necesario
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Obtener el elemento renderizado llamando a render()
    renderedElement = publicInstance.render();
  } else {
    // Componente de función
    renderedElement = type(props);
  }

  // Este proceso es recursivo porque un componente
  // puede devolver un elemento con un tipo de otro componente.
  return mount(renderedElement);

  // Nota: ¡esta implementación está incompleta y se repite indefinidamente!
  // Solo acepta elementos como <App /> o <Button />.
  // Todavía no acepta elementos como <div /> o <p />.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**Nota:**
>
>Esto realmente *es* pseudocódigo. No es similar a la implementación real. Además causará un desbordamiento de pila porque no hemos analizado cuando parar la recursividad.

Hagamos un repaso de algunas ideas clave con el ejemplo anterior:

* Los elementos de React son objetos simples que representan el tipo de un componente (Por ej. `App`) y las props.
* Los componentes definidos por el usuario (Por ej. `App`) pueden ser clases o funciones pero todos "se renderizan" como elementos.
* El "montaje" es un proceso recursivo que crea un DOM o un árbol nativo dado el elemento de React de mayor nivel (Por ej. `<App />`).

### Montando elementos principales {#mounting-host-elements}

Este proceso sería inservible si no renderizáramos algo en la pantalla como resultado.

Sumados a los componentes definidos por el usuario ("compuestos"), los elementos de React también pueden representar componentes específicos a la plataforma ("principales"). Por ejemplo, `Button` puede devolver un `<div />` desde su método render.

Si la propiedad `type` de un elemento es una *string*, estamos trabajando con un elemento principal:

```js
console.log(<div />);
// { type: 'div', props: {} }
```
No hay código definido por el usuario asociado con elementos principales.

Cuando el reconciliador encuentra un elemento principal, deja que el renderizador se encargue de montarlo. Por ejemplo, React DOM podría crear un nodo del DOM.

Si el elemento principal tiene hijos, el reconciliador los monta de manera recursiva siguiendo el mismo algoritmo como en el caso anterior. No importa si los hijos son principales (como `<div><hr /></div>`), compuestos (como `<div><Button /></div>`), o ambos.

Los nodos del DOM producidos por componentes hijos serán anexados al nodo padre del DOM, y recursivamente, la estructura completa del DOM será ensamblada.

>**Nota:**
>
>El reconciliador mismo no está ligado al DOM. El resultado exacto del montaje (a veces llamado "mount image" en el código fuente) depende del renderizador, y puede ser un nodo del DOM (React DOM), una *string* (React DOM Server), o un número representando una vista nativa (React Native).

Si fueramos a extender el código para aceptar elementos principales, se vería así:

```js
function isClass(type) {
  // Las subclases de React.Component tienen este indicador
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Esta función sólo acepta elementos de tipo compuesto.
// Por ejemplo, acepta <App /> y <Button />, pero no <div />.
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // Componente de clase
    var publicInstance = new type(props);
    // Establecer las props
    publicInstance.props = props;
    // Llamar al ciclo de vida si es necesario
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Componente de función
    renderedElement = type(props);
  }

  // Esto es recursivo pero eventualmente alcanzaremos el final de la recursión
  // cuando el elemento sea principal (Por ej. <div /> en vez de compuesto (Por ej. <App />):
  return mount(renderedElement);
}

// Esta función solo acepta elementos de tipo principal.
// Por ejemplo, acepta <div /> y <p /> pero no <App />.
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // Este bloque de código no debería estar en el reconciliador.
  // Diferentes renderizadores podrían inicializar nodos de manera diferente.
  // Por ejemplo, React Native crearía vistas para iOS o Android.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Montaje de los hijos
  children.forEach(childElement => {
    // Los hijos pueden ser principiales (Por ej. <div />) o compuestos (Por ej. <Button />)
    // También los montaremos de manera recursiva:
    var childNode = mount(childElement);

    // Esta línea de código también es específica a cada renderizador.
    // Sería diferente dependiendo del renderizador:
    node.appendChild(childNode);
  });

  // Devolver el nodo del DOM como resultado del montaje.
  // Aquí es donde la recursión finaliza.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Componentes definidos por el usuario
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Componentes específicos a la plataforma
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

Esto funciona pero todavía está lejos de ser la implementación real del reconciliador. El ingrediente faltante clave es el soporte para actualizaciones.

### Introducción a Instancias Internas {#introducing-internal-instances}

La característica clave de React es que puedes re-renderizar todo, y no recreará el DOM or reiniciará el estado:

```js
ReactDOM.render(<App />, rootEl);
// Debería reusar el DOM existente:
ReactDOM.render(<App />, rootEl);
```
Sin embargo, nuestra implementación anterior solo sabe cómo montar el árbol inicial. No puede realizar actualizaciones sobre él porque no guarda toda la información necesaria, como todas las `publicInstance`s, o qué DOM `node`s corresponden a qué componentes.

El código base del reconciliador de pila resuelve esto convirtiendo la función `mount()` en un método y poniéndolo en una clase. Hay inconvenientes con este enfoque, y estamos yendo en la dirección opuesta con la [reescritura en curso del reconciliador](/docs/codebase-overview.html#fiber-reconciler). A pesar de eso así es como funciona ahora.

En vez de funciones `mountHost` y `mountComposite` separadas, crearemos dos clases: `DOMComponent` y `CompositeComponent`.

Ambas clases tienen un constructor que acepta `element`, como también un método `mount()` que devuelve el nodo montado. Vamos a reemplazar la función `mount()` de mayor nivel por una fábrica que instanciará la clase correcta:

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Componentes definidos por el usuario
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Componentes específicos a la plataforma
    return new DOMComponent(element);
  }  
}
```

Primero, consideremos la implementación de `CompositeComponent`:

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // Para elementos compuestos, exponer la instancia de la clase.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Componente de clase
      publicInstance = new type(props);
      // Establecer las props
      publicInstance.props = props;
      // Llamar al ciclo de vida si es necesario
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Componente de función
      publicInstance = null;
      renderedElement = type(props);
    }

    // Guardar la instancia pública
    this.publicInstance = publicInstance;

    // Instanciar la instancia interna hija acorde al elemento.
    // Sería un DOMComponent para <div /> o <p />,
    // y un CompositeComponent para <App /> o <Button />:
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Montar el resultado renderizado
    return renderedComponent.mount();
  }
}
```

Esto no es muy diferente de nuestra implementación previa de `mountComposite()`, pero ahora podemos guardar alguna información, como `this.currentElement`, `this.renderedComponent`, y `this.publicInstance`, para usar durante las actualizaciones.

Ten en cuenta que una instancia de `CompositeComponent` no es lo mismo que una instancia del `element.type` proporcionado por el usuario. `CompositeComponent` es un detalle de la implementación de nuestro reconciliador, y nunca es expuesto al usuario. La clase definida por el usuario es la que leemos en `element.type`, y `CompositeComponent` crea una instancia de esa clase.

Para evitar la confusión, llamaremos a las instancias de `CompositeComponent` y `DOMComponent` "instancias internas". Éstas existen para que podamos asociar datos antiguos a ellas. Sólo el renderizador y el reconciliador estan al tanto de que existen.

En contraste, llamamos "instancia pública" a una instancia de una clase definida por el usuario. La instancia pública es lo que ves como `this` en `render()` y en otros métodos de tus componentes personalizados.

La función `mountHost()`, refactorizada para ser el método `mount()` en la clase `DOMComponent`, también resulta familiar:

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // Para componentes del DOM, sólo exponer el nodo del DOM.
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Crear y guardar el nodo
    var node = document.createElement(type);
    this.node = node;

    // Establecer los atributos
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Crear y guardar los hijos incluídos.
    // Cada uno de ellos puede ser un DOMComponent o un CompositeComponent,
    // dependiendo de si el tipo del elemento es un string o una función.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Juntar los nodos del DOM que los hijos devuelven en el montaje
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Devolver el nodo del DOM como resultado del montaje
    return node;
  }
}
```

La principal diferencia después de refactorizar `mountHost()` es que ahora podemos mantener `this.node` y `this.renderedChildren` asociados con la instancia interna del componente del DOM. También los usaremos para aplicar actualizaciones no destructivas en el futuro.

Como resultado, cada instancia interna, compuesta o principal, ahora apunta a sus instancias internas hijas. Para ayudar a visualizar esto, si el componente `<App>` de una función renderiza un componente de clase `<Button>`, y la clase `Button` renderiza un `<div>`, el árbol de la instancia interna se vería así:

```js
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```

En el DOM sólo verías el `<div>`. Sin embargo el árbol de la instancia interna contiene las instancias internas tanto compuesta como principal.

Las instancias internas compuestas necesitan almacenar:

* El elemento actual.
* La instancia pública si el tipo del elemento es una clase.
* La única instancia interna renderizada. Puede ser un `DOMComponent` o un `CompositeComponent`.

Las instancias internas principales necesitan almacenar:

* El elemento actual.
* El nodo del DOM.
* Todas las instancias internas hijas. Cada una de ellas puede ser un `DOMComponent` o un `CompositeComponent`.

Si se te dificulta imaginar como está estructurado un árbol de instancias internas en aplicaciones más complejas, las [React DevTools](https://github.com/facebook/react-devtools) pueden darte una aproximación, ya que resaltan las instancias principales con gris, y las instancias compuestas con lila:

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

Para completar este refactoreo, introduciremos una función que monta el árbol completo a un nodo contenedor, al igual que `ReactDOM.render()`. Devuelve una instancia pública, también como `ReactDOM.render()`:

```js
function mountTree(element, containerNode) {
  // Crear la instancia interna de mayor nivel
  var rootComponent = instantiateComponent(element);

  // Montar el componente de mayor nivel al contenedor
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Devolver la instancia pública que provee
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Desmontaje {#unmounting}

Ahora que tenemos instancias internas que se aferran a sus hijos y a los nodos del DOM, podemos implementar el desmontaje. Para un elemento compuesto, el desmontaje llama a un método de ciclo de vida y entra en recursión.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Llamar al método del ciclo de vida si es necesario
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Desmontar el único componente renderizado
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```
Para `DomComponent`, el desmontaje le avisa a cada hijo que se debe desmontar:

```js
class DOMComponent {

  // ...

  unmount() {
    // Desmontar todos los hijos
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

En la práctica, desmontar componentes del DOM también remueve los escuchadores de eventos y limpia algunas cachés, pero nos saltearemos esos detalles.

Ahora podemos agregar una nueva función de mayor nivel llamada `unmountTree(containerNode)` que es similar a `ReactDOM.unmountComponentAtNode()`:

```js
function unmountTree(containerNode) {
  // Leer esta instancia interna desde un nodo del DOM:
  // (Esto no funciona todavía, necesitaremos cambiar mountTree() para guardarlo.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Desmontar el árbol y limpiar el contenedor
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

Para que esto funcione, necesitamos leer una instancia interna raíz de un nodo del DOM. Modificaremos `mountTree()` para agregar la propiedad `_internalInstance` al nodo raíz del DOM. También le enseñaremos a `mountTree()` a destruir cualquier árbol existente así puede ser llamado múltiples veces:

```js
function mountTree(element, containerNode) {
  // Destruir cualquier árbol existente
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Creaer la instancia interna de mayor nivel
  var rootComponent = instantiateComponent(element);

  // Montar el componente de mayor nivel al contenedor
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Guardar una referencia a la instancia interna
  node._internalInstance = rootComponent;

  // Devolver la instancia pública que provee
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

Ahora, ejecutando `unmountTree()`, o ejecutando `mountTree()` repetidamente, remueve el árbol viejo y ejecuta el método de ciclo de vida `componentWillUnmount()` en los componentes.

### Actualizando {#updating}

En la sección anterior, implementamos el desmontaje. Sin embargo React no sería muy útil si cada cambio en una prop desmontara y montara el árbol entero. El objetivo del reconciliador es el de reusar instancias existentes donde sea posible para preservar el DOM y el estado:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Debería reusar el DOM existente:
mountTree(<App />, rootEl);
```

Extenderemos el contrato de nuestra instancia interna con un método más. Sumado a `mount()` y `unmount()`, tanto `DOMComponent` como `CompositeComponent` implementarán un nuevo método llamado `receive(nextElement)`:

```js
class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
```

Su trabajo es hacer lo necesario para mantener el componente (y a cualquiera de sus hijos) actualizados con la descripción provista por `nextElement`.

Esta es la parte frecuentemente descripta como "diferenciación del virtual DOM" aunque lo que realmente sucede es que recorremos el árbol interno recursivamente y dejamos que cada instancia interna reciba una actualización.

### Actualizando componentes compuestos {#updating-composite-components}

Cuando un componente compuesto recibe un nuevo elemento, ejecutamos el método de ciclo de vida `componentWillUpdate()`.

Luego re-renderizamos el componente con las nuevas props, y obtenemos el siguiente elemento renderizado:

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Actualizar *el propio* elemento
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Averiguar cual es el resultado del siguiente render()
    var nextRenderedElement;
    if (isClass(type)) {
      // Componente de clase
      // Llamar al ciclo de vida si es necesario
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Actualizar las props
      publicInstance.props = nextProps;
      // Re-renderizar
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Componente de función
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Después, podemos mirar el `type` del elemento renderizado. Si el `type` no cambió desde el último renderizado, el siguiente componente puede ser actualizado en su lugar.

Por ejemplo, si devuelve `<Button color="red" />` la primera vez, y `<Button color="blue" />` la segunda vez, podemos simplemente decirle a la instancia interna correspondiente que ejecute `receive()` al siguiente elemento:

```js
    // ...

    // Si el tipo del elemento renderizado no cambió,
    // reusar la instancia existente del componente y salir.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

Sin embargo, si el siguiente elemento renderizado tiene un `type` diferente al del anterior elemento renderizado, no podemos actualizar la instancia interna. Un `<button>` no puede "convertirse" en un `<input>`.

En cambio, tenemos que desmontar la instancia interna existene y montar la nueva correspondiente al tipo del elemento renderizado. Por ejemplo, esto es lo que pasa cuando un componente que anteriormente renderizaba un `<button />` ahora renderiza un `<input />`.

```js
    // ...

    // Si llegamos hasta este punto, necesitamos desmontar el componente
    // montado anteriormente, montar el nuevo, y cambiar sus nodos.

    // Encontrar el nodo viejo porque será necesario reemplazarlo
    var prevNode = prevRenderedComponent.getHostNode();

    // Desmontar el hijo viejo y montar el nuevo
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Reemplazar la referencia al hijo
    this.renderedComponent = nextRenderedComponent;

    // Reemplazar el nodo viejo por el nuevo
    // Nota: este código es específico a cada renderizador
    // e idealmente debería estar fuera de CompositeComponent:
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

Para resumir, cuando un componente compuesto recibe un nuevo elemento, puede delegar la actualización a sus instancias internas renderizadas, o desmontarlo y montar uno nuevo en su lugar.

Hay otra condición por la que un componente elegirá volver a montar en vez de recibir un elemento, y es cuando la `key` del elemento ha cambiado. No hablamos sobre el manejo de `key` en este documento porque agrega más complejidad a un tutorial complejo en sí.

Nótese que necesitamos agregar un método llamado `getHostNode()` al contrato de la instancia interna para que sea posible localizar el nodo específico a la plataforma y reemplazarlo durante la actualización. Su implementación para ambas clases es simple:

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Consultar al componente renderizado para que lo provea.
    // Esto examinará de manera recursiva cualquier compuesto.
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }  
}
```

### Updating Host Components {#updating-host-components}

Host component implementations, such as `DOMComponent`, update differently. When they receive an element, they need to update the underlying platform-specific view. In case of React DOM, this means updating the DOM attributes:

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Remove old attributes.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Set next attributes.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Then, host components need to update their children. Unlike composite components, they might contain more than a single child.

In this simplified example, we use an array of internal instances and iterate over it, either updating or replacing the internal instances depending on whether the received `type` matches their previous `type`. The real reconciler also takes element's `key` in the account and track moves in addition to insertions and deletions, but we will omit this logic.

We collect DOM operations on children in a list so we can execute them in batch:

```js
    // ...

    // These are arrays of React elements:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // These are arrays of internal instances:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // As we iterate over children, we will add operations to the array.
    var operationQueue = [];

    // Note: the section below is extremely simplified!
    // It doesn't handle reorders, children with holes, or keys.
    // It only exists to illustrate the overall flow, not the specifics.

    for (var i = 0; i < nextChildren.length; i++) {
      // Try to get an existing internal instance for this child
      var prevChild = prevRenderedChildren[i];

      // If there is no internal instance under this index,
      // a child has been appended to the end. Create a new
      // internal instance, mount it, and use its node.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Record that we need to append a node
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // We can only update the instance if its element's type matches.
      // For example, <Button size="small" /> can be updated to
      // <Button size="large" /> but not to an <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // If we can't update an existing instance, we have to unmount it
      // and mount a new one instead of it.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Record that we need to swap the nodes
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // If we can update an existing internal instance,
      // just let it receive the next element and handle its own update.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Finally, unmount any children that don't exist:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Record that we need to remove the node
      operationQueue.push({type: 'REMOVE', node});
    }

    // Point the list of rendered children to the updated version.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

As the last step, we execute the DOM operations. Again, the real reconciler code is more complex because it also handles moves:

```js
    // ...

    // Process the operation queue.
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }
}
```

And that is it for updating host components.

### Top-Level Updates {#top-level-updates}

Now that both `CompositeComponent` and `DOMComponent` implement the `receive(nextElement)` method, we can change the top-level `mountTree()` function to use it when the element `type` is the same as it was the last time:

```js
function mountTree(element, containerNode) {
  // Check for an existing tree
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // If we can, reuse the existing root component
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Otherwise, unmount the existing tree
    unmountTree(containerNode);
  }

  // ...

}
```

Now calling `mountTree()` two times with the same type isn't destructive:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reuses the existing DOM:
mountTree(<App />, rootEl);
```

These are the basics of how React works internally.

### What We Left Out {#what-we-left-out}

This document is simplified compared to the real codebase. There are a few important aspects we didn't address:

* Components can render `null`, and the reconciler can handle "empty slots" in arrays and rendered output.

* The reconciler also reads `key` from the elements, and uses it to establish which internal instance corresponds to which element in an array. A bulk of complexity in the actual React implementation is related to that.

* In addition to composite and host internal instance classes, there are also classes for "text" and "empty" components. They represent text nodes and the "empty slots" you get by rendering `null`.

* Renderers use [injection](/docs/codebase-overview.html#dynamic-injection) to pass the host internal class to the reconciler. For example, React DOM tells the reconciler to use `ReactDOMComponent` as the host internal instance implementation.

* The logic for updating the list of children is extracted into a mixin called `ReactMultiChild` which is used by the host internal instance class implementations both in React DOM and React Native.

* The reconciler also implements support for `setState()` in composite components. Multiple updates inside event handlers get batched into a single update.

* The reconciler also takes care of attaching and detaching refs to composite components and host nodes.

* Lifecycle methods that are called after the DOM is ready, such as `componentDidMount()` and `componentDidUpdate()`, get collected into "callback queues" and are executed in a single batch.

* React puts information about the current update into an internal object called "transaction". Transactions are useful for keeping track of the queue of pending lifecycle methods, the current DOM nesting for the warnings, and anything else that is "global" to a specific update. Transactions also ensure React "cleans everything up" after updates. For example, the transaction class provided by React DOM restores the input selection after any update.

### Jumping into the Code {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) is where the code like `mountTree()` and `unmountTree()` from this tutorial lives. It takes care of mounting and unmounting top-level components. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) is its React Native analog.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) is the equivalent of `DOMComponent` in this tutorial. It implements the host component class for React DOM renderer. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) is its React Native analog.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) is the equivalent of `CompositeComponent` in this tutorial. It handles calling user-defined components and maintaining their state.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) contains the switch that picks the right internal instance class to construct for an element. It is equivalent to `instantiateComponent()` in this tutorial.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) is a wrapper with `mountComponent()`, `receiveComponent()`, and `unmountComponent()` methods. It calls the underlying implementations on the internal instances, but also includes some code around them that is shared by all internal instance implementations.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) implements the logic for mounting, updating, and unmounting children according to the `key` of their elements.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) implements processing the operation queue for child insertions, deletions, and moves independently of the renderer.

* `mount()`, `receive()`, and `unmount()` are really called `mountComponent()`, `receiveComponent()`, and `unmountComponent()` in React codebase for legacy reasons, but they receive elements.

* Properties on the internal instances start with an underscore, e.g. `_currentElement`. They are considered to be read-only public fields throughout the codebase.

### Future Directions {#future-directions}

Stack reconciler has inherent limitations such as being synchronous and unable to interrupt the work or split it in chunks. There is a work in progress on the [new Fiber reconciler](/docs/codebase-overview.html#fiber-reconciler) with a [completely different architecture](https://github.com/acdlite/react-fiber-architecture). In the future, we intend to replace stack reconciler with it, but at the moment it is far from feature parity.

### Next Steps {#next-steps}

Read the [next section](/docs/design-principles.html) to learn about the guiding principles we use for React development.
