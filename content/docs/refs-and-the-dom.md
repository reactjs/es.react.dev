---
id: refs-and-the-dom
title: Referencias y el DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Las referencias proporcionan una forma de acceder a los nodos del DOM o a elementos React creados en el metodo de renderizado.

En un flujo normal de datos de React, [las propiedades](/docs/components-and-props.html) son la unica forma en la que los componentes padres pueden interactuar con sus hijos. Para modificar un hijo, vuelves a renderizarlo con propiedades nuevas. Sin embargo, hay ciertos casos donde necesitarás modificar imperativamente un hijo fuera del flujo de datos tipico. El hijo a ser modificado puede ser una instancia de un componente React, o puede ser un elemento del DOM. Para ambos casos, React proporciona una via de escape.

### Cuando Usar Referencias

Existen unos cuantos buenos casos de uso para referencias:

* Controlar enfoques, selección de texto, o reproducción de medios.
* Activar animaciones imperativas.
* Integración con librerías DOM de terceros.

Evita el uso de referencias en cualquier cosa que pueda ser hecha declarativamente.

Por ejemplo, en lugar de exponer los métodos `open()` y `close()` a un componente `Dialog`, pasa una propiedad `isOpen` a este en su lugar.

### No Abuses de las Referencias

Tu primer pensamiento puede ser usar referencias para "hacer que las cosas funcionen" en tu aplicación. De ser este el caso, espera un momento, y piensa críticamente donde debe estar el estado en la jerarquía de componentes. Frecuentemente, se vuelve mas claro que el lugar donde debería "estar" el estado, es en el nivel más alto de la jerarquía. Mira la guía [Levantando El Estado](/docs/lifting-state-up.html) para ejemplos de esto.

> Nota
>
> Los ejemplos a continuación han sido actualizados para hacer uso del API `React.createRef()` introducido en React 16.3. Si estas usando una versión de React anterior a esta, recomendamos usar en su lugar [referencias mediante callback](#callback-refs).

### Creando Referencias

Las referencias son creadas usando `React.createRef()` y agregandolas a elementos React mediante el atributo `ref`. Las referencias son asignadas comunmente a una propiedad de instancia cuando un componente es construido, así puede ser referenciados mediante el componente.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Accediendo a Referencias

Cuando una referencia es pasada a un elemento en el `renderizado`, una referencia al nodo pasa a ser accesible en el atributo `current` de la referencia.

```javascript
const node = this.myRef.current;
```

El valor de la referencia es diferente dependiendo del tipo de nodo:

- Cuando el atributo `ref` es usado en un elemento HTML, la `referencia` creada en el constructor con `React.createRef()` recibe el elemento DOM adyacente como su propiedad `current`.
- Cuando el atributo `ref` es usado en un componente de clase personalizado, el objeto de la `referencia` recibe la instancia montada del componente como su atributo `current`.
- **No puedes hacer uso de `referencias` en componentes de función** debido a que no tienen instancias.

Los ejemplos a continuación demuestran las diferencias.

#### Agregando una Referencia a un elemnto del DOM

Esta código utiliza un `ref` para guardar una referencia al nodo del DOM:

This code uses a `ref` to store a reference to a DOM node:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // crea una referencia para guardar el elemento textInput del DOM
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Hace enfoque explicitamente del campo de texto haciendo uso de un API del DOM
    // Nota: Estamos accediendo la propiedad "current" para obtener el nodo del DOM
    this.textInput.current.focus();
  }

  render() {
    // Informa a React de que queremos agregar la referencia `textInput` que creamos
    // en el constructor a la etiqueta <input>
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React asignará a la propiedad `current` el elemento del DOM cuando el componente sea montado, y la asignará de nuevo `null` cuando sea desmontado. La `referencia` es actualizada antes de los métodos `componentDidMount` or `componentDidUpdate`.

#### Agregando una Referencia a un Componente de Clase

Si quisieramos envolver el `CustomTextInput` de más arriba para simular que esta siendo clickeado despues de montarse, podríamos utilizar una referencia para obtener acceso al input personalizado y llamar a su método `focusTextInput` manualmente:

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Recuerda que esto solo funciona si `CustomTextInput` es declarado como una clase:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Referencias y Componentes de Función

**No puedes usar el atributo `ref` en componentes de función** debido a que no tienen instancias:

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // Esto *no* va a funcionar!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Tienes que convertir el componente a una clase si necesitas utilizar una referencia en el, justo como cuando necesitas mëtodos del ciclo de vida, o utilizar estado.

Sin embargo, puedes **usar el atributo `ref` dentro de un componente de función** siempre y cuando hagas referencia de un elemento del DOM o de un componente de clase.

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput debe estar declarado aquí para que *ref* pueda referenciarlo
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Exponiendo Referencias del DOM a Componentes Padres

En casos raros, puede que necesites acceder al nodo DOM de un hijo desde un componente padre. Esto generalmente no es recomendado porque rompe con la encapsulación del componente, pero puede ser utíl ocacionalmente para hacer enfoque, o medir el tamaño o posición de un nodo hijo del DOM.

Bien podrías [agregar una referencia al componente hijo](#adding-a-ref-to-a-class-component), esta no es la solución ideal, porque lo que obtendrías sería la instancia del componente en vez del nodo del DOM. Adicionalmente, esto no funcionaría con componentes de función.

Si usas React 16.3 o una versión mayor, recomendamos usar [paso de referencias](/docs/forwarding-refs.html) para estos casos. **Paso de referencias permite que los componentes decidan exponer cualquier referencia de sus hijos como si fuera la suya**. Puedes encontrar un ejemplo detallado de como exponer los nodos DOM de los hijos a un componente padre [en la documentación de paso de referencias](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Si usas React 16.2 o una versión más antigua, o si necesitas más flexibilidad de la que provee el paso de referencias, puedes utilizar [este enfoque alternativo](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) y pasar explicitamente una referencia como una propiedad nombrada diferente.

Cuando sea posible, recomendamos no exponer los nodos del DOM, pero puede ser utíl como una vía de escape. Recuerda que este enfoque require que agregues código al componente hijo. Si no tienes control alguno sobre la implementación del componente hijo, tu ultima opción es usar [`findDOMNode()`](/docs/react-dom.html#finddomnode), pero esto no es recomendado, y esta dspreciado en modo estricto: [`(StrictMode)`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Referencias mediante Callback

React tambien ofrece otra manera de agregar referencias con "referencias mediante callback", que da un control mas detallado sobre cuando las referencias son establecidas o no.

En lugar de pasar un atributo a `ref` creado por `createRef()`, pasas una función. La función recibe la instancia del componente React o el elemento DOM del HTML como su argumento, que puede ser guardado y accedido desde otros lugares.

El ejemplo a continuación implementa un patrón común: usar el `ref` mediante callback para guardar una referencia al nodo del DOM en una propiedad de la instancia.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Hace enfoque del campo de texto usando un mëtodo propio del DOM
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // Auto enfoca el campo despues de que el componente se monta
    this.focusTextInput();
  }

  render() {
    // Usa el `ref` mediante callback para guardar una referencia al campo de texto del DOM
    // en una propiedad de la instancia (por ejemplo, this.textInput)
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts. Refs are guaranteed to be up-to-date before `componentDidMount` or `componentDidUpdate` fires.

You can pass callback refs between components like you can with object refs that were created with `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

In the example above, `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

### Legacy API: String Refs

If you worked with React before, you might be familiar with an older API where the `ref` attribute is a string, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against it because string refs have [some issues](https://github.com/facebook/react/pull/8333#issuecomment-271648615), are considered legacy, and **are likely to be removed in one of the future releases**. 

> Note
>
> If you're currently using `this.refs.textInput` to access refs, we recommend using either the [callback pattern](#callback-refs) or the [`createRef` API](#creating-refs) instead.

### Caveats with callback refs

If the `ref` callback is defined as an inline function, it will get called twice during updates, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the `ref` callback as a bound method on the class, but note that it shouldn't matter in most cases.
