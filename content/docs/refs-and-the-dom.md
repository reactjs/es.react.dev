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

Las referencias proporcionan una forma de acceder a los nodos del DOM o a elementos React creados en el método de renderizado.

En un flujo normal en datos de React, [las propiedades](/docs/components-and-props.html) son la única forma en la que los componentes padres pueden interactuar con sus hijos. Para modificar un hijo, vuelves a renderizarlo con propiedades nuevas. Sin embargo, hay ciertos casos donde necesitarás modificar imperativamente un hijo fuera del flujo de datos típico. El hijo a ser modificado puede ser una instancia de un componente React, o un elemento del DOM. Para ambos casos, React proporciona una via de escape.

### Cuando usar referencias {#when-to-use-refs}

Existen unos cuantos buenos casos de uso para referencias:

* Controlar enfoques, selección de texto, o reproducción de medios.
* Activar animaciones imperativas.
* Integración con bibliotecas DOM de terceros.

Evita usar referencias en cualquier cosa que pueda ser hecha declarativamente.

Por ejemplo, en lugar de exponer los métodos `open()` y `close()` en un componente `Dialog`, pasa una propiedad `isOpen` a este en su lugar.

### No abuses de las referencias {#dont-overuse-refs}

Tu primer pensamiento puede ser usar referencias para "hacer que las cosas funcionen" en tu aplicación. De ser este el caso, espera un momento, y piensa críticamente donde debe estar el estado en la jerarquía de componentes. Frecuentemente, se vuelve mas claro que el lugar donde debería "estar" el estado, es en el nivel más alto de la jerarquía. Mira la guía [Levantando El Estado](/docs/lifting-state-up.html) para ejemplos de esto.

> Nota
>
> Los ejemplos a continuación han sido actualizados para hacer uso del API `React.createRef()` introducido en React 16.3. Si estas usando una versión de React anterior a esta, recomendamos usar en su lugar [referencias mediante callback](#callback-refs).

### Creando referencias {#creating-refs}

Las referencias son creadas usando `React.createRef()` y agregándolas a elementos de React mediante el atributo `ref`. Las referencias son asignadas comúnmente a una propiedad de instancia cuando un componente es construido, así pueden ser referenciadas por el componente.

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

### Accediendo a referencias {#accessing-refs}

Cuando una referencia es pasada a un elemento en el `renderizado`, una referencia al nodo pasa a ser accesible en el atributo `current` de la referencia.

```javascript
const node = this.myRef.current;
```

El valor de la referencia es diferente dependiendo del tipo de nodo:

- Cuando el atributo `ref` es usado en un elemento HTML, la `referencia` creada en el constructor con `React.createRef()` recibe el elemento DOM adyacente como su propiedad `current`.
- Cuando el atributo `ref` es usado en un componente de clase personalizado, el objeto de la `referencia` recibe la instancia montada del componente como su atributo `current`.
- **No puedes hacer uso de `referencias` en componentes de función** debido a que no tienen instancias.

Los ejemplos a continuación demuestran las diferencias.

### Agregando una referencia a un elemento del DOM {#adding-a-ref-to-a-dom-element}

Esta código utiliza un `ref` para guardar una referencia al nodo del DOM:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Crea una referencia para guardar el elemento textInput del DOM
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Hace enfoque explícitamente del campo de texto, haciendo uso de un API del DOM
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

React asignará a la propiedad `current` el elemento del DOM cuando el componente sea montado, y la asignará de nuevo `null` cuando sea desmontado. La `referencia` es actualizada antes de los métodos `componentDidMount` o `componentDidUpdate`.

#### Agregando una referencia a un componente de clase {#adding-a-ref-to-a-class-component}

Si quisiéramos envolver el `CustomTextInput` de arriba para simular sobre este un click después de montarse, podríamos utilizar una referencia para obtener acceso al input personalizado y llamar a su método `focusTextInput` manualmente:

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

#### Referencias y componentes de función {#refs-and-function-components}

Por defecto, **no puedes usar el atributo `ref` en componentes de función** debido a que no tienen instancias:

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

Sí deseas permitir que las personas tomen una `ref` de tu componente de función, puedes usar [`forwardRef`](/docs/forwarding-refs.html) (posiblemente en conjunto con [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)), o puedes convertir el componente a una clase.

Sin embargo, puedes **usar el atributo `ref` dentro de un componente de función** siempre y cuando hagas referencia de un elemento del DOM o de un componente de clase.

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput debe estar declarado aquí para que la ref pueda hacer referencia a este
  let textInput = useRef(null);

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

### Exponiendo referencias del DOM a componentes padres {#exposing-dom-refs-to-parent-components}

En casos raros, puede que necesites acceder al nodo DOM de un hijo desde un componente padre. Esto generalmente no es recomendado porque rompe con la encapsulación del componente, pero puede ser util ocasionalmente para hacer enfoque, o medir el tamaño o posición de un nodo del DOM hijo.

Bien podrías [agregar una referencia al componente hijo](#adding-a-ref-to-a-class-component), esta no es la solución ideal, porque lo que obtendrías sería la instancia del componente en vez del nodo del DOM. Adicionalmente, esto no funcionaría con componentes de función.

Si usas React 16.3 o una versión mayor, recomendamos usar [paso de referencias](/docs/forwarding-refs.html) para estos casos. **Paso de referencias permite que los componentes decidan exponer cualquier referencia de sus hijos como si fuera la suya**. Puedes encontrar un ejemplo detallado de como exponer los nodos DOM de los hijos a un componente padre [en la documentación de paso de referencias](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Si usas React 16.2 o una versión más antigua, o si necesitas más flexibilidad de la que ofrece el paso de referencias, puedes utilizar [este enfoque alternativo](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) y pasar explícitamente una referencia como una propiedad nombrada diferente.

Siempre que sea posible, recomendamos no exponer los nodos del DOM, pero puede ser util como una vía de escape. Recuerda que este enfoque require que agregues código al componente hijo. Si no tienes control alguno sobre la implementación del componente hijo, tu ultima opción es usar [`findDOMNode()`](/docs/react-dom.html#finddomnode), pero esto no es recomendado, y esta despreciado en modo estricto: [`(StrictMode)`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Referencias mediante callback {#callback-refs}

React también ofrece otra manera de agregar referencias con "referencias mediante callback", que da un control mas detallado sobre cuando las referencias son establecidas o no.

En lugar de pasar un atributo a `ref` creado por `createRef()`, pasas una función. La función recibe la instancia del componente React o el elemento DOM del HTML como su argumento, que puede ser guardado y accedido desde otros lugares.

El ejemplo a continuación implementa un patrón común: usar el `ref` mediante un callback para guardar una referencia al nodo del DOM en una propiedad de la instancia.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Hace enfoque del campo de texto usando un método propio del DOM
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // Auto enfoca el campo después de que el componente se monta
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

React llamara al callback del `ref` con el elemento del DOM cuando el componente sea montado, y lo llamara con `null` cuando este se desmonte. Se asegura que las referencias serán actualizadas antes que el `componentDidMount` o el `componentDidUpdate` sean ejecutados.

Puedes pasar una referencia mediante callback entre componentes tal como puedes con los objetos de referencias creados con `React.createRef().`

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

En el ejemplo de arriba, `Parent` pasa su referencia mediante callback como una propiedad `inputRef` al `CustomTextInput`, y el componente `CustomTextInput` pasa la misma funcion como un atributo especial `ref` al `<input>`. Como resultado, `this.inputElement` en el `Parent` sera asignado con el nodo del DOM correspondiente al elemento `input` del `CustomTextInput`.

### API antigua: Referencias mediante cadena de texto {#legacy-api-string-refs}

Si trabajaste con React antes, puede que estes familiarizado con un API antigua donde el atributo `ref` es una cadena de texto, justo como `"textInput"`, y el nodo del DOM es accedido como `this.refs.textInput`. No recomendamos usar esto, ya que las referencias mediante cadenas de texto tienen [ciertos problemas](https://github.com/facebook/react/pull/8333#issuecomment-271648615), son consideradas antiguas, y **posiblemente seran removidas en una de las futuras versiones**.

> Nota
>
> Si estas considerando usar `this.refs.textInput` para acceder a las referencias, recomendamos que uses en su lugar o bien [referencias mediante callback](#callback-refs) o [el API `createRef`](#creating-refs).

### Advertencias sobre referencias mediante callback {#caveats-with-callback-refs}

Si el callback de `ref` es definido como una *arrow function*, esta sera llamada 2 veces durante las actualizaciones, la primera con `null`, y la siguiente con el elemento DOM correspondiente. Esto se debe a que una nueva instancia de la funcion es creada en cada renderizado, por lo que React necesita limpiar la referencia vieja y agregar la nueva. Puedes evitar esto definiendo el callback del `ref` como un metodo en la clase, pero recuerda que no deberia importar en la mayoria de los casos.
