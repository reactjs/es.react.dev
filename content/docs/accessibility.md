---
id: accessibility
title: Accesibilidad
permalink: docs/accessibility.html
---

## ¿Por qué Accesibilidad?

La accesibilidad web (también conocida como [** a11y **] (https://en.wiktionary.org/wiki/a11y)) es el diseño y la creación de sitios web que pueden ser utilizados por todos. El soporte de accesibilidad es necesario para permitir que la tecnología de asistencia interprete las páginas web.

React es totalmente compatible con la creación de sitios web accesibles, a menudo mediante el uso de técnicas estándar de HTML.

## Normas y lineamientos

### WCAG {#wcag}

Las [Pautas de Accesibilidad de Contenido Web (WCAG por sus siglas en inglés)](https://www.w3.org/WAI/intro/wcag) proporcionan pautas para crear sitios web accesibles.

Las siguientes listas de verificación WCAG proporcionan una visión general:

- [Lista de verificación WCAG de Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [Lista de verificación WCAG de WebAIM](http://webaim.org/standards/wcag/checklist)
- [Lista de verificación de El Proyecto A11Y](http://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

El documento [Iniciativa de Accesibilidad Web - Aplicaciones de Internet Enriquecidas y Accesibles (WAI-ARIA por sus siglas en inglés)](https://www.w3.org/WAI/intro/aria) contiene técnicas para construir widgets de JavaScript totalmente accesibles.

Tenga en cuenta que todos los atributos HTML `aria- *` son totalmente compatibles con JSX. Mientras que la mayoría de las propiedades y atributos de DOM en React son camelCase, estos atributos deben tener un guión (también conocido como kebab-case, lisp-case, etc.) ya que están en HTML simple:

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## HTML semnántico

El HTML semántico es la base de la accesibilidad en una aplicación web. Haciendo uso de los diversos elementos HTML para reforzar el significado de la información en nuestros sitios web a menudo nos dará accesibilidad de forma gratuita.

- [Referencia de elementos HTML en MDN](https://developer.mozilla.org/es/docs/Web/HTML/Elemento)

A veces rompemos la semántica HTML cuando agregamos elementos `<div>` a nuestro JSX para hacer que nuestro código React funcione, especialmente cuando trabajamos con listas (`<ol>`, `<ul>` y `<dl>`) y la etiqueta `<table>` de HTML.
En estos casos, deberíamos usar [Fragmentos React](/docs/fragments.html) para agrupar varios elementos.

Por ejemplo,

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

Puedes asignar una colección de elementos a un arreglo de fragmentos como lo haría con cualquier otro tipo de elemento:

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Fragments should also have a `key` prop when mapping collections
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Cuando no necesites ninguna prop en la etiqueta Fragment, puedes usar la [sintaxis corta](/docs/fragments.html#short-syntax), si tus herramientas lo admiten:

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

Para más información, consulta [la documentación de Fragmentos](/docs/fragments.html).

## Formularios accesibles

### Etiquetado

Todos los controles de formulario HTML, como `<input>` y `<textarea>`, deben ser etiquetados de forma accesible. Necesitamos proporcionar etiquetas descriptivas que también estén expuestas a los lectores de pantalla.

Los siguientes recursos nos muestran cómo hacer esto:

- [El W3C nos muestra cómo etiquetar elementos](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM nos muestra cómo etiquetar elementos](http://webaim.org/techniques/forms/controls)
- [El Grupo Paciello explica los nombres accesibles](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Aunque estas prácticas estándar de HTML se pueden usar directamente en React, ten en cuenta que el atributo `for` se escribe como `htmlFor` en JSX:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### Notificando errores al usuario

Las situaciones de error deben ser entendidas por todos los usuarios. El siguiente enlace también nos muestra cómo exponer textos de error a lectores de pantalla:

- [El W3C demuestra notificaciones de usuario](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM analiza la validación de formularios](http://webaim.org/techniques/formvalidation/)

## Control de foco

Asegúrese de que su aplicación web pueda ser operada completamente solo con el teclado:

- [WebAIM habla sobre accesibilidad de teclado](http://webaim.org/techniques/keyboard/)

### Foco de teclado y contorno de foco

El foco del teclado se refiere al elemento actual en el DOM que está seleccionado para aceptar la entrada desde el teclado. Lo vemos en todas partes como un contorno de foco similar al que se muestra en la siguiente imagen:

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

Solamente use CSS que elimine este contorno, por ejemplo, configurando `outline: 0`, si lo va a reemplazar por otra implementación de contorno de foco.

### Mecanismos para omitir hacia el contenido deseado.

Proporcione un mecanismo para permitir que los usuarios omitan las secciones de navegación en su aplicación, ya que esto ayuda y acelera la navegación con el teclado.

Skiplink o Skip Navigation son enlaces de navegación ocultos que solo se hacen visibles cuando los usuarios de teclado interactúan con la página. Son muy fáciles de implementar con anclajes internos de página y algunos estilos:

- [WebAIM - Omitir enlaces de navegación](http://webaim.org/techniques/skipnav/)

También utilice elementos y roles de puntos de referencia, como `<main>` y `<aside>`, para delimitar las regiones de la página ya que la tecnología de asistencia permite al usuario navegar rápidamente a estas secciones.

Lea más sobre el uso de estos elementos para mejorar la accesibilidad aquí:

- [Puntos de referencia accesibles](http://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Gestionando programáticamente el foco.

Nuestras aplicaciones React modifican continuamente el DOM de HTML durante el tiempo de ejecución, lo que a veces hace que el foco del teclado se pierda o se establezca en un elemento inesperado. Para reparar esto, tenemos que empujar programáticamente el foco del teclado en la dirección correcta. Por ejemplo, al restablecer el foco del teclado a un botón que abrió una ventana modal después de que se cierre esa ventana modal.

MDN Web Docs analiza esto y describe cómo podemos construir [widgets de JavaScript navegables por el teclado](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Para establecer el foco en React, podemos usar [Referencias a elementos del DOM](/docs/refs-and-the-dom.html).

Usando esto, primero creamos una referencia a un elemento en el JSX de una clase de componente:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Crea una referencia para almacenar el elemento textInput del DOM
    this.textInput = React.createRef();
  }
  render() {
  // Utiliza la devolución de llamada `ref` para almacenar una referencia al elemento DOM de entrada de texto 
  // en un campo de instancia (por ejemplo, this.textInput).
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Entonces podemos enfocarlo en otro lugar de nuestro componente cuando sea necesario:

 ```javascript
 focus() {
   // Enfoca explícitamente la entrada de texto usando la API de DOM sin formato
    // Nota: estamos accediendo a "actual" para obtener el nodo DOM
   this.textInput.current.focus();
 }
 ```

A veces, un componente padre debe establecer el foco en un elemento dentro de un componente hijo. Podemos hacer esto [exponiendo las referencias del DOM a los componentes padre](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components)
a través de una prop especial en el componente hijo que envía la referencia del padre al nodo DOM del hijo.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Ahora puedes establecer el foco cuando sea necesario.
this.inputElement.current.focus();
```

Cuando se utiliza un HOC para extender componentes, se recomienda [reenviar la referencia](/docs/forwarding-refs.html) al componente envuelto usando la función `forwardRef` de React. Si un HOC de un tercero no implementa el reenvío de ref, el patrón anterior se puede utilizar como una alternativa de todas formas.


Un gran ejemplo de gestión de foco es el [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Este es un ejemplo relativamente raro de una ventana modal totalmente accesible. No solo establece el foco inicial en el botón de cancelación (lo que evita que el usuario de teclado active accidentalmente la acción exitosa) y atrapa el foco del teclado dentro del modal, sino que también restablece el foco hacia el elemento que inicialmente activó el modal.

>Nota:
>
>Si bien esta es una característica de accesibilidad muy importante, también es una técnica que debe usarse con prudencia. Úsalo para reparar el flujo de foco del teclado cuando está perturbado, no para intentar anticipar cómo 
>los usuarios desean usar las aplicaciones.

## Mouse and pointer events {#mouse-and-pointer-events}

Ensure that all functionality exposed through a mouse or pointer event can also be accessed using the keyboard alone. Depending only on the pointer device will lead to many cases where
keyboard users cannot use your application.

To illustrate this, let's look at a prolific example of broken accessibility caused by click events. This is the outside click pattern, where a user can disable an opened popover by clicking outside the element.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

This is typically implemented by attaching a `click` event to the `window` object that closes the popover:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

This may work fine for users with pointer devices, such as a mouse, but operating this with the keyboard alone leads to broken functionality when tabbing to the next element
as the `window` object never receives a `click` event. This can lead to obscured functionality which blocks users from using your application.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

The same functionality can be achieved by using an appropriate event handlers instead, such as `onBlur` and `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // We close the popover on the next tick by using setTimeout.
  // This is necessary because we need to first check if
  // another child of the element has received focus as
  // the blur event fires prior to the new focus event.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // If a child receives focus, do not close the popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React assists us by bubbling the blur and
    // focus events to the parent.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

This code exposes the functionality to both pointer device and keyboard users. Also note the added `aria-*` props to support screen-reader users. For simplicity's sake
the keyboard events to enable `arrow key` interaction of the popover options have not been implemented.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

This is one example of many cases where depending on only pointer and mouse events will break functionality for keyboard users. Always testing with the keyboard will immediately
highlight the problem areas which can then be fixed by using keyboard aware event handlers.

## More Complex Widgets {#more-complex-widgets}

A more complex user experience should not mean a less accessible one. Whereas accessibility is most easily achieved by coding as close to HTML as possible,
even the most complex widget can be coded accessibly.

Here we require knowledge of [ARIA Roles](https://www.w3.org/TR/wai-aria/#roles) as well as [ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties).
These are toolboxes filled with HTML attributes that are fully supported in JSX and enable us to construct fully accessible, highly functional React components.

Each type of widget has a specific design pattern and is expected to function in a certain way by users and user agents alike:

- [WAI-ARIA Authoring Practices - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Examples](http://heydonworks.com/practical_aria_examples/)
- [Inclusive Components](https://inclusive-components.design/)

## Other Points for Consideration {#other-points-for-consideration}

### Setting the language {#setting-the-language}

Indicate the human language of page texts as screen reader software uses this to select the correct voice settings:

- [WebAIM - Document Language](http://webaim.org/techniques/screenreader/#language)

### Setting the document title {#setting-the-document-title}

Set the document `<title>` to correctly describe the current page content as this ensures that the user remains aware of the current page context:

- [WCAG - Understanding the Document Title Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

We can set this in React using the [React Document Title Component](https://github.com/gaearon/react-document-title).

### Color contrast {#color-contrast}

Ensure that all readable text on your website has sufficient color contrast to remain maximally readable by users with low vision:

- [WCAG - Understanding the Color Contrast Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Everything About Color Contrast And Why You Should Rethink It](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - What is Color Contrast](http://a11yproject.com/posts/what-is-color-contrast/)

It can be tedious to manually calculate the proper color combinations for all cases in your website so instead, you can [calculate an entire accessible color palette with Colorable](http://jxnblk.com/colorable/).

Both the aXe and WAVE tools mentioned below also include color contrast tests and will report on contrast errors.

If you want to extend your contrast testing abilities you can use these tools:

- [WebAIM - Color Contrast Checker](http://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## Development and Testing Tools {#development-and-testing-tools}

There are a number of tools we can use to assist in the creation of accessible web applications.

### The keyboard {#the-keyboard}

By far the easiest and also one of the most important checks is to test if your entire website can be reached and used with the keyboard alone. Do this by:

1. Plugging out your mouse.
1. Using `Tab` and `Shift+Tab` to browse.
1. Using `Enter` to activate elements.
1. Where required, using your keyboard arrow keys to interact with some elements, such as menus and dropdowns.

### Development assistance {#development-assistance}

We can check some accessibility features directly in our JSX code. Often intellisense checks are already provided in JSX aware IDE's for the ARIA roles, states and properties. We also
have access to the following tool:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

The [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin for ESLint provides AST linting feedback regarding accessibility issues in your JSX. Many
IDE's allow you to integrate these findings directly into code analysis and source code windows.

[Create React App](https://github.com/facebookincubator/create-react-app) has this plugin with a subset of rules activated. If you want to enable even more accessibility rules,
you can create an `.eslintrc` file in the root of your project with this content:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Testing accessibility in the browser {#testing-accessibility-in-the-browser}

A number of tools exist that can run accessibility audits on web pages in your browser. Please use them in combination with other accessibility checks mentioned here as they can only
test the technical accessibility of your HTML.

#### aXe, aXe-core and react-axe {#axe-axe-core-and-react-axe}

Deque Systems offers [aXe-core](https://github.com/dequelabs/axe-core) for automated and end-to-end accessibility tests of your applications. This module includes integrations for Selenium.

[The Accessibility Engine](https://www.deque.com/products/axe/) or aXe, is an accessibility inspector browser extension built on `aXe-core`.

You can also use the [react-axe](https://github.com/dylanb/react-axe) module to report these accessibility findings directly to the console while developing and debugging.

#### WebAIM WAVE {#webaim-wave}

The [Web Accessibility Evaluation Tool](http://wave.webaim.org/extension/) is another accessibility browser extension.

#### Accessibility inspectors and the Accessibility Tree {#accessibility-inspectors-and-the-accessibility-tree}

[The Accessibility Tree](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) is a subset of the DOM tree that contains accessible objects for every DOM element that should be exposed
to assistive technology, such as screen readers.

In some browsers we can easily view the accessibility information for each element in the accessibility tree:

- [Using the Accessibility Inspector in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Activate the Accessibility Inspector in Chrome](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)
- [Using the Accessibility Inspector in OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Screen readers {#screen-readers}

Testing with a screen reader should form part of your accessibility tests.

Please note that browser / screen reader combinations matter. It is recommended that you test your application in the browser best suited to your screen reader of choice.

### Commonly Used Screen Readers {#commonly-used-screen-readers}

#### NVDA in Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) or NVDA is an open source Windows screen reader that is widely used.

Refer to the following guides on how to best use NVDA:

- [WebAIM - Using NVDA to Evaluate Web Accessibility](http://webaim.org/articles/nvda/)
- [Deque - NVDA Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver in Safari {#voiceover-in-safari}

VoiceOver is an integrated screen reader on Apple devices.

Refer to the following guides on how activate and use VoiceOver:

- [WebAIM - Using VoiceOver to Evaluate Web Accessibility](http://webaim.org/articles/voiceover/)
- [Deque - VoiceOver for OS X Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver for iOS Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS in Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](http://www.freedomscientific.com/Products/Blindness/JAWS) or JAWS, is a prolifically used screen reader on Windows.

Refer to the following guides on how to best use JAWS:

- [WebAIM - Using JAWS to Evaluate Web Accessibility](http://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Other Screen Readers {#other-screen-readers}

#### ChromeVox in Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](http://www.chromevox.com/) is an integrated screen reader on Chromebooks and is available [as an extension](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) for Google Chrome.

Refer to the following guides on how best to use ChromeVox:

- [Google Chromebook Help - Use the Built-in Screen Reader](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic Keyboard Shortcuts Reference](http://www.chromevox.com/keyboard_shortcuts.html)
