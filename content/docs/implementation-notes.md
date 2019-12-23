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

Es muy técnica y asume un gran entendimiento de la API pública de React como también sobre la división de React en núcleo, renderizadores y el reconciliador. Si no estás muy familiarizado con la base de código de React, primero lee la [visión general de la base de código](/docs/codebase-overview.html).

Además se asume una buena comprensión de las [diferencias entre componentes de React, sus instancias y sus elementos](/blog/2015/12/18/react-components-elements-and-instances.html).

El reconciliador de pila se usó en React 15 y también en versiones anteriores. Está ubicado en [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Video: Construyendo React desde 0 {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) dio una charla sobre [construir React desde 0](https://www.youtube.com/watch?v=_MAD4Oly9yg) que inspiró este documento.

Tanto este documento como su charla son simplificaciones de la base de código real por lo que obtendrás un mejor entendimiento familiarizándote con ambos.

### Visión general {#overview}

El reconciliador por sí mismo no tiene una API pública. Los [renderizadores](/docs/codebase-overview.html#renderers) como React DOM y React Native lo usan para actualizar de manera eficiente la interfaz de usuario acorde a los componentes de React diseñados por el usuario.

### El montaje como un proceso recursivo {#mounting-as-a-recursive-process}

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

Si `App` es una clase, el reconciliador instanciará una `App` con `new App(props)`, llamará al método del ciclo de vida `componentWillMount()`, y por último llamará al método `render()` para obtener el elemento renderizado.

De cualquier manera, el reconciliador averiguará a qué elemento se renderizó `App`.

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
// y devuelve un nodo DOM o nativo que representa el árbol montado.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // Determinaremos el elemento renderizado
  // ejecutando su tipo como una función
  // o creando una instancia y llamando a render().
  var renderedElement;
  if (isClass(type)) {
    // Clase componente
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
    // Función componente
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
* El "montaje" es un proceso recursivo que crea un árbol DOM o nativo dado el elemento de React de nivel superior (Por ej. `<App />`).

### Montaje de elementos anfitriones {#mounting-host-elements}

Este proceso sería inservible si no renderizáramos algo en la pantalla como resultado.

Sumados a los componentes definidos por el usuario o ("compuestos"), los elementos de React también pueden representar componentes específicos a la plataforma o ("anfitriones"). Por ejemplo, `Button` puede devolver un `<div />` desde su método render.

Si la propiedad `type` de un elemento es una *string*, sabemos que estamos trabajando con un elemento anfitrión:

```js
console.log(<div />);
// { type: 'div', props: {} }
```

No hay código definido por el usuario asociado con elementos anfitriones.

Cuando el reconciliador encuentra un elemento anfitrión, deja que el renderizador se encargue de montarlo. Por ejemplo, React DOM podría crear un nodo del DOM.

Si el elemento anfitrión tiene hijos, el reconciliador los monta de manera recursiva siguiendo el mismo algoritmo como en el caso anterior. No importa si los hijos son anfitriones (como `<div><hr /></div>`), compuestos (como `<div><Button /></div>`), o ambos.

Los nodos del DOM producidos por componentes hijos serán anexados al nodo padre del DOM, y recursivamente, la estructura completa del DOM será ensamblada.

>**Nota:**
>
>El reconciliador mismo no está ligado al DOM. El resultado exacto del montaje (a veces llamado "mount image" en el código fuente) depende del renderizador, y puede ser un nodo del DOM (React DOM), una *string* (React DOM Server), o un número representando una vista nativa (React Native).

Si fueramos a extender el código para aceptar elementos anfitriones, se vería así:

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
    // Clase componente
    var publicInstance = new type(props);
    // Establecer las props
    publicInstance.props = props;
    // Llamar al ciclo de vida si es necesario
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Función Componente
    renderedElement = type(props);
  }
  // Esto es recursivo pero eventualmente alcanzaremos el final de la recursión
  // cuando el elemento sea anfitrión (Por ej. <div /> en vez de compuesto (Por ej. <App />):
  return mount(renderedElement);
}

// Esta función solo acepta elementos de tipo anfitrión.
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
    // Los hijos pueden ser anfitriones (Por ej. <div />) o compuestos (Por ej. <Button />)
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

### Introducción de instancias internas {#introducing-internal-instances}

La característica clave de React es que puedes re-renderizar todo, y no recreará el DOM or reiniciará el estado:

```js
ReactDOM.render(<App />, rootEl);
// Debería reutilizar el DOM existente:
ReactDOM.render(<App />, rootEl);
```

Sin embargo, nuestra implementación anterior solo sabe cómo montar el árbol inicial. No puede realizar actualizaciones sobre él porque no guarda toda la información necesaria, como todas las `publicInstance`s, o qué DOM `node`s corresponden a qué componentes.

La base de código del reconciliador de pila resuelve esto convirtiendo la función `mount()` en un método y poniéndolo en una clase. Hay inconvenientes con este enfoque, y estamos yendo en la dirección opuesta con la [reescritura en curso del reconciliador](/docs/codebase-overview.html#fiber-reconciler). A pesar de eso así es como funciona ahora.

En vez de funciones `mountHost` y `mountComposite` separadas, crearemos dos clases: `DOMComponent` y `CompositeComponent`.

Ambas clases tienen un constructor que acepta `element`, como también un método `mount()` que devuelve el nodo montado. Vamos a reemplazar la función `mount()` de nivel superior por una [fábrica](https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)) que instanciará la clase correcta:

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
      // Clase componente
      publicInstance = new type(props);
      // Establecer las props
      publicInstance.props = props;
      // Llamar al ciclo de vida si es necesario
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Función componente
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

Para evitar la confusión, llamaremos a las instancias de `CompositeComponent` y `DOMComponent` "instancias internas". Estas existen para que podamos asociar datos antiguos a ellas. Solo el renderizador y el reconciliador están al tanto de que existen.

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

    // Crear y guardar los hijos incluidos.
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

Como resultado, cada instancia interna, compuesta o anfitrión, ahora apunta a sus instancias internas hijas. Para ayudar a visualizar esto, si el componente `<App>` de una función renderiza un componente de clase `<Button>`, y la clase `Button` renderiza un `<div>`, el árbol de la instancia interna se vería así:

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

En el DOM sólo verías el `<div>`. Sin embargo el árbol de la instancia interna contiene las instancias internas tanto compuestas como anfitriones.

Las instancias internas compuestas necesitan almacenar:

* El elemento actual.
* La instancia pública si el tipo del elemento es una clase.
* La única instancia interna renderizada. Puede ser un `DOMComponent` o un `CompositeComponent`.

Las instancias internas anfitriones necesitan almacenar:

* El elemento actual.
* El nodo del DOM.
* Todas las instancias internas hijas. Cada una de ellas puede ser un `DOMComponent` o un `CompositeComponent`.

Si se te dificulta imaginar como está estructurado un árbol de instancias internas en aplicaciones más complejas, las [React DevTools](https://github.com/facebook/react-devtools) pueden darte una aproximación, ya que resaltan las instancias anfitriones con gris, y las instancias compuestas con lila:

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

Para completar esta refactorización, introduciremos una función que monta el árbol completo a un nodo contenedor, al igual que `ReactDOM.render()`. Devuelve una instancia pública, también como `ReactDOM.render()`:

```js
function mountTree(element, containerNode) {
  // Crear la instancia interna de nivel superior
  var rootComponent = instantiateComponent(element);

  // Montar el componente de nivel superior al contenedor
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

En la práctica, desmontar componentes del DOM también remueve los manejadores de eventos y limpia algunas cachés, pero nos saltearemos esos detalles.

Ahora podemos agregar una nueva función de nivel superior llamada `unmountTree(containerNode)` que es similar a `ReactDOM.unmountComponentAtNode()`:

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

  // Creaer la instancia interna de nivel superior
  var rootComponent = instantiateComponent(element);

  // Montar el componente de nivel superior al contenedor
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

### Actualización {#updating}

En la sección anterior, implementamos el desmontaje. Sin embargo React no sería muy útil si cada cambio en una prop desmontara y montara el árbol entero. El objetivo del reconciliador es el de reutilizar instancias existentes donde sea posible para preservar el DOM y el estado:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Debería reutilizar el DOM existente:
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

### Actualización de componentes compuestos {#updating-composite-components}

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
      // Clase componente
      // Llamar al ciclo de vida si es necesario
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Actualizar las props
      publicInstance.props = nextProps;
      // Re-renderizar
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Función componente
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Después, podemos mirar el `type` del elemento renderizado. Si el `type` no cambió desde el último renderizado, el siguiente componente puede ser actualizado en su lugar.

Por ejemplo, si devuelve `<Button color="red" />` la primera vez, y `<Button color="blue" />` la segunda vez, podemos simplemente decirle a la instancia interna correspondiente que ejecute `receive()` al siguiente elemento:

```js
    // ...

    // Si el tipo del elemento renderizado no cambió,
    // reutilizar la instancia existente del componente y salir.
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

### Actualización de componentes anfitriones {#updating-host-components}

Las implementaciones de componentes anfitriones, como `DOMComponent`, se actualizan de manera diferente. Cuando reciben un elemento, necesitan actualizar la vista subyacente específica a la plataforma.

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Remover atributos viejos.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Establecer los siguientes atributos
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Luego, los componentes anfitriones necesitan actualizar sus hijos. A diferencia de los componentes compuestos, pueden contener más de un hijo.

En este ejemplo simplificado, usamos un *array* de instancias internas e iteramos sobre él, ya sea actualizándolo o reemplazando las instancias internas dependiendo de si el `type` recibido coincide con el `type` anterior. El reconciliador real además tiene en cuenta la `key` del elemento y rastrea los movimientos además de las inserciones y las supresiones, pero omitiremos esta lógica por ahora.

Recogemos las operaciones del DOM sobre hijos en una lista para poder ejecutarlas en lote:

```js
    // ...

    // Estos son arrays de elementos de React:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // Estos son arrays de instancias internas:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // A medida que iteramos sobre los hijos, añadiremos operaciones al array.
    var operationQueue = [];

    // Nota: ¡la siguiente sección está extremadamente simplificada!
    // No acepta reordenamientos, hijos con vacíos, o keys.
    // Sólo existe para ilustrar el flujo en general, sin especificaciones.

    for (var i = 0; i < nextChildren.length; i++) {
      // Tratar de obtener una instancia interna existente para este hijo
      var prevChild = prevRenderedChildren[i];

      // Si no hay una instancia interna en este índice,
      // un hijo ha sido anexado al final. Crear una nueva
      // instancia interna, montarla, y usar su nodo.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Registrar que necesitamos añadir un nodo
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Podemos actualizar la instancia solo si el type de su elemento coincide.
      // Por ejemplo, <Button size="small" /> puede ser actualizado a
      // <Button size="large" /> pero no a <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // Si no podemos actualizar una instancia existente, tenemos que
      // desmontarla y montar una nueva en su lugar.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Registar que necesitamos intercambiar los nodos
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Si podemos actualizar una instancia interna existente,
      // permitirle recibir el siguiente elemento y manejar so propia actualización.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Finalmente, desmontar cualquier hijo que no exista:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Registar que necesitamos remover el nodo
      operationQueue.push({type: 'REMOVE', node});
    }

    // Marcar la lista de hijos renderizados como la versión actualizada.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

Como último paso, ejecutamos las operaciones del DOM. Nuevamente, el código del reconciliador real es más complejos porque también maneja movimientos:

```js
    // ...

    // Procesar la cola de operaciones.
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

Y eso es todo para actualizar los componentes anfitriones.

### Actualizaciones de nivel superior {#top-level-updates}

Ahora que tanto `CompositeComponent` como `DOMComponent` implementan el método `receive(nextElement)`, podemos cambiar la función de nivel superior `mountTree()` para usarla cuando el `type` del elemento sea el mismo que la última vez:

```js
function mountTree(element, containerNode) {
  // Verificar por un árbol existente
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // Si podemos, reutilizar el componente raíz existente
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // En el otro caso, desmontar el árbol existente
    unmountTree(containerNode);
  }

  // ...

}
```

Ahora llamar a `mountTree()` dos veces con el mismo tipo no es destructivo:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reutiliza el DOM existente:
mountTree(<App />, rootEl);
```

Esto es lo básico sobre cómo funciona React internamente.

### Lo que dejamos fuera {#what-we-left-out}

Este documento está simplificado en comparación a la base de código real. Hay algunos aspectos importantes que no abordamos:

* Los componentes pueden renderizar `null`, y el reconciliador puede aceptar "espacios vacíos" en *arrays* y resultados renderizados.

* El reconciliador también lee la `key` de los elementos, y la usa para establecer a qué instancia interna corresponde cada elemento en un *array*. Una gran parte de la complejidad en la implementación actual de React tiene que ver con eso.

* Además de clases de instancias internas anfitriones y compuestas, también existen clases para componentes de "texto" y "vacíos". Representan nodos de texto y los "espacios vacíos" que se obtienen al renderizar `null`.

* Los renderizadores usan [inyección](/docs/codebase-overview.html#dynamic-injection) para pasar la clase interna anfitrión al reconciliador. Por ejemplo, React DOM le dice al reconciliador que use `ReactDOMComponent` como la implementación de una instancia interna anfitrión.

* La lógica para actualizar la lista de hijos se extrae en un mixin llamado `ReactMultiChild` que es utilizado por las implementaciones de clases de instancias internas anfitriones tanto para React DOM como para React Native.

* La implementación del reconciliador también permite el funcionamiento de `setState()` en componentes compuestos. Múltiples actualizaciones dentro de manejadores de eventos son procesadas por lote en una sola actualización.

* El reconciliador también se encarga de adjuntar y desconectar las referencias a componentes compuestos y nodos anfitriones.

+ Los métodos de ciclo de vida que son llamados después de que el DOM está listo, como `componentDidMount()` and `componentDidUpdate()`, son recogidos en "colas de callbacks" y son ejecutados en un solo lote.

* React pone información sobre la actualización en curso dentro de un objeto interno llamado "transacción". Las transacciones son útiles para hacer un seguimiento de la cola de métodos de ciclo de vida pendientes, la anidación actual del DOM para las alertas, y todo lo demás que sea "global" a una actualización específica. Las transacciones también aseguran que React "limpie todo" luego de las actualizaciones. Por ejemplo, la clase transacción provista por React DOM restaura la selección del *input* después de cada actualización.

### Metiéndose al código {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) es donde está el código de `mountTree()` y `unmountTree()` de este tutorial. Se encarga de montar y desmontar componentes de nivel superior. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) es su análogo en React Native.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) es el equivalente a `DOMComponent` en este tutorial. Implementa la clase de los componentes anfitriones para el renderizador React DOM. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) es su análogo en React Native.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) es el equivalente a `CompositeComponent` es este tutorial. Maneja las llamadas a componentes definidos por el usuario y el mantenimiento de su estado.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) contiene el interruptor que elige la clase correcta de una instancia interna a construir para un elemento. Es equivalente a `instantiateComponent()` en este tutorial.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) es un *wrapper* que contiene los métodos `mountComponent()`, `receiveComponent()` y `unmountComponent()`. Llama a las implementaciones subyacentes en las instancias internas, pero también incluye código sobre ellas que es compartido por todas las implementaciones de instancias internas.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) implementa la lógica para montar, actualizar, y desmontar hijos de acuerdo a la `key` de sus elementos.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) implementa el procesamiento de la cola de operaciones para inserciones de hijos, supresiones, y movimientos independientemente del renderizador.

* `mount()`, `receive()`, y `unmount()` son en realidad llamados `mountComponent()`, `receiveComponent()`, y `unmountComponent()` en la base de código de React por razones de herencia, pero reciben elementos.

* Las propiedades en las instancias internas comienzan con un guión bajo, por ej. `_currentElement`. Son considerados campos públicos de solo lectura a través de la base de código.

### Futuras direcciones {#future-directions}

El reconciliador de pila tiene limitaciones inherentes como ser sincrónico y no permitir interrumpir el trabajo o dividirlo en fragmentos. Hay trabajo en progreso en el [nuevo reconciliador Fiber](/docs/codebase-overview.html#fiber-reconciler) con una [arquitectura completamente diferente](https://github.com/acdlite/react-fiber-architecture). En el futuro, pretendemos reemplazar el reconciliador de pila con Fiber, pero por el momento está lejos de igualar sus características.

### Siguientes pasos {#next-steps}

Lee la [siguiente sección](/docs/design-principles.html) para aprender sobre los principios que nos guían en el desarrollo de React.
