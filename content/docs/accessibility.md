---
id: accessibility
title: Accesibilidad
permalink: docs/accessibility.html
---

## ¿Por qué Accesibilidad? {#why-accessibility}

La accesibilidad web (también conocida como [**a11y**](https://en.wiktionary.org/wiki/a11y)) es el diseño y la creación de sitios web que pueden ser utilizados por todos. El soporte de accesibilidad es necesario para permitir que la tecnología de asistencia interprete las páginas web.

React es totalmente compatible con la creación de sitios web accesibles, a menudo mediante el uso de técnicas estándar de HTML.

## Normas y lineamientos {#standards-and-guidelines}

### WCAG {#wcag}

Las [Pautas de Accesibilidad de Contenido Web (WCAG por sus siglas en inglés)](https://www.w3.org/WAI/intro/wcag) proporcionan pautas para crear sitios web accesibles.

Las siguientes listas de verificación WCAG proporcionan una visión general:

- [Lista de verificación WCAG de Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [Lista de verificación WCAG de WebAIM](http://webaim.org/standards/wcag/checklist)
- [Lista de verificación de El Proyecto A11Y](http://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

El documento [Iniciativa de Accesibilidad Web - Aplicaciones de Internet Enriquecidas y Accesibles (WAI-ARIA por sus siglas en inglés)](https://www.w3.org/WAI/intro/aria) contiene técnicas para construir widgets de JavaScript totalmente accesibles.

Ten en cuenta que todos los atributos HTML `aria- *` son totalmente compatibles con JSX. Mientras que la mayoría de las propiedades y atributos de DOM en React son camelCase, estos atributos deben tener un guión (también conocido como kebab-case, lisp-case, etc.) ya que están en HTML simple:

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

## HTML semántico {#semantic-html}

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

## Formularios accesibles {#accessible-forms}

### Etiquetado {#labeling}

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

### Notificando errores al usuario {#notifying-the-user-of-errors}

Las situaciones de error deben ser entendidas por todos los usuarios. El siguiente enlace también nos muestra cómo exponer textos de error a lectores de pantalla:

- [El W3C demuestra notificaciones de usuario](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM analiza la validación de formularios](http://webaim.org/techniques/formvalidation/)

## Control de foco {#focus-control}

Asegúrese de que su aplicación web pueda ser operada completamente solo con el teclado:

- [WebAIM habla sobre accesibilidad de teclado](http://webaim.org/techniques/keyboard/)

### Foco de teclado y contorno de foco {#keyboard-focus-and-focus-outline}

El foco del teclado se refiere al elemento actual en el DOM que está seleccionado para aceptar la entrada desde el teclado. Lo vemos en todas partes como un contorno de foco similar al que se muestra en la siguiente imagen:

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

Solamente use CSS que elimine este contorno, por ejemplo, configurando `outline: 0`, si lo va a reemplazar por otra implementación de contorno de foco.

### Mecanismos para omitir hacia el contenido deseado. {#mechanisms-to-skip-to-desired-content}

Proporcione un mecanismo para permitir que los usuarios omitan las secciones de navegación en su aplicación, ya que esto ayuda y acelera la navegación con el teclado.

Skiplink o Skip Navigation son enlaces de navegación ocultos que solo se hacen visibles cuando los usuarios de teclado interactúan con la página. Son muy fáciles de implementar con anclajes internos de página y algunos estilos:

- [WebAIM - Omitir enlaces de navegación](http://webaim.org/techniques/skipnav/)

También utilice elementos y roles de puntos de referencia, como `<main>` y `<aside>`, para delimitar las regiones de la página ya que la tecnología de asistencia permite al usuario navegar rápidamente a estas secciones.

Lea más sobre el uso de estos elementos para mejorar la accesibilidad aquí:

- [Puntos de referencia accesibles](http://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Gestionando programáticamente el foco. {#programmatically-managing-focus}

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

A veces, un componente padre debe establecer el foco en un elemento dentro de un componente hijo. Podemos hacer esto [exponiendo las referencias del DOM a los componentes padre](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components) a través de una prop especial en el componente hijo que envía la referencia del padre al nodo DOM del hijo.

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

## Eventos de ratón y puntero {#mouse-and-pointer-events}

Asegúrate que también se puede acceder a todas las funciones expuestas a través de un evento de mouse o puntero utilizando solo el teclado. Dependiendo solo del dispositivo puntero llevará a muchos casos donde Los usuarios de teclado no pueden usar tu aplicación.

Para ilustrar esto, veamos un ejemplo prolífico de accesibilidad rota causada por eventos de clic. Este es el patrón de clic externo, donde un usuario puede deshabilitar una ventana emergente abierta haciendo clic fuera del elemento.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

Esto se implementa normalmente adjuntando un evento `click` al objeto` window` que cierra la ventana emergente:

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
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Esto puede funcionar bien para los usuarios con dispositivos de puntero, como un ratón, pero si lo hace solo con el teclado la funcionalidad se rompe al pasar al elemento siguiente, ya que el objeto `window` nunca recibe el evento` click`. Esto puede llevar a una funcionalidad oculta que impide que los usuarios utilicen tu aplicación

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

La misma funcionalidad se puede lograr utilizando un controlador de eventos apropiado, como `onBlur` y` onFocus`:

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

  // Cerramos la ventana emergente en el siguiente tick usando setTimeout.
  // Esto es necesario porque primero debemos comprobar 
  // si otro hijo del elemento ha recibido el foco ya que
  // el evento de desenfoque se dispara antes del nuevo evento de foco.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Si un hijo recibe el foco, no cerrar la ventana emergente.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React nos ayuda burbujeando los eventos de desenfoque
    // y enfoque hacia los padres.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Este código expone la funcionalidad a los usuarios del dispositivo puntero y de teclado. También ten en cuenta las props `aria- *` para apoyar a los usuarios de lectores de pantalla. Por simplicidad, no se han implementado los eventos de teclado para habilitar la interacción `arrow key` de las opciones de ventanas emergentes.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

Este es un ejemplo de muchos casos en los que, dependiendo de solo el puntero y el mouse, los eventos interrumpirán la funcionalidad para los usuarios de teclado. Probando siempre con el teclado resaltará de inmediato las áreas problemáticas que luego se pueden solucionar mediante el uso de controladores de eventos compatibles con el teclado.

## Widgets más complejos {#more-complex-widgets}

Una experiencia de usuario más compleja no debe significar que sea menos accesible. Mientras que la accesibilidad se logra más fácilmente mediante la codificación lo más cerca posible de HTML, incluso el widget más complejo se puede codificar de manera accesible.

Aquí requerimos conocimiento de [Roles de ARIA](https://www.w3.org/TR/wai-aria/#roles) así como [Estados y propiedades de ARIA](https://www.w3.org/TR/wai-aria/#states_and_properties).
Estas son cajas de herramientas llenas de atributos HTML que son totalmente compatibles con JSX y nos permiten construir componentes React completamente accesibles y altamente funcionales.

Cada tipo de widget tiene un patrón de diseño específico y se espera que funcione de una manera determinada por parte de usuarios y agentes de usuarios por igual:

- [Prácticas de autoría de WAI-ARIA - Patrones de diseño y widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - Ejemplos ARIA](https://heydonworks.com/article/practical-aria-examples/)
- [Componentes Inclusivos](https://inclusive-components.design/)

## Otros puntos a considerar {#other-points-for-consideration}

### Configurando el idioma {#setting-the-language}

Indique el idioma humano de los textos de la página, ya que el software del lector de pantalla lo utiliza para seleccionar la configuración de voz correcta:

- [WebAIM - Documento de lenguaje](http://webaim.org/techniques/screenreader/#language)

### Configuración del título del documento {#setting-the-document-title}

Configure el `<title>` del documento para que describa correctamente el contenido de la página actual, ya que esto garantiza que el usuario esté al tanto del contexto de la página actual:

- [WCAG - Comprendiendo el requisito del título del documento](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

Podemos configurar esto en React usando el [Componente Título del Documento de React](https://github.com/gaearon/react-document-title).

### Contraste de color {#color-contrast}

Asegúrese de que todo el texto legible en su sitio web tenga el contraste de color suficiente para que los usuarios con poca visión puedan leerlo al máximo:

- [WCAG - Comprender el requisito de contraste de color](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Todo sobre el contraste de color y por qué debes repensarlo](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - ¿Qué es el contraste de color?](http://a11yproject.com/posts/what-is-color-contrast/)

Puede ser tedioso calcular manualmente las combinaciones de colores adecuadas para todos los casos en tu sitio web, por lo que puede [calcular una paleta de colores accesible completa con Colorable](http://jxnblk.com/colorable/).

Tanto las herramientas aXe como WAVE que se mencionan a continuación también incluyen pruebas de contraste de color e informarán sobre errores de contraste.

Si desea ampliar sus habilidades de prueba de contraste, puede utilizar estas herramientas:

- [WebAIM - Comprobador de contraste de color](http://webaim.org/resources/contrastchecker/)
- [El Grupo Paciello - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## Herramientas de desarrollo y pruebas {#development-and-testing-tools}

Hay una serie de herramientas que podemos utilizar para ayudar en la creación de aplicaciones web accesibles.

### El teclado {#the-keyboard}

La comprobación más fácil y también una de las más importantes es, por mucho, comprobar si se puede acceder a todo el sitio web y usarlo solo con el teclado. Hágalo de la siguiente forma:

1. Desconectando tu ratón.
1. Usando `Tab` y `Shift + Tab` para navegar.
1. Usando `Enter` para activar elementos.
1. Cuando sea necesario, utiliza las teclas de flecha del teclado para interactuar con algunos elementos, como menús y menús desplegables.

### Asistencia para el desarrollo {#development-assistance}

Podemos verificar algunas funciones de accesibilidad directamente en nuestro código JSX. A menudo, las comprobaciones de intellisense para roles, estados y propiedades ARIA ya son proporcionadas en IDE's preparados para JSX. También tenemos acceso a la siguiente herramienta:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

El complemento [eslint-plugin-jsx-a11y] (https://github.com/evcohen/eslint-plugin-jsx-a11y) para ESLint proporciona linting de AST sobre los problemas de accesibilidad en tu JSX. Muchos IDE's te permiten integrar estos hallazgos directamente en el análisis de código y las ventanas de código fuente.

[Create React App](https://github.com/facebookincubator/create-react-app) tiene este complemento con un subconjunto de reglas activadas. Si desea habilitar aún más reglas de accesibilidad, puede crear un archivo `.eslintrc` en la raíz de su proyecto con este contenido:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Probando accesibilidad en el navegador. {#testing-accessibility-in-the-browser}

Existen varias herramientas que pueden ejecutar auditorías de accesibilidad en las páginas web de su navegador. Utilízalas en combinación con otras comprobaciones de accesibilidad que se mencionan aquí, ya que solo pueden probar la accesibilidad técnica de su HTML.

#### aXe, aXe-core y react-axe {#axe-axe-core-and-react-axe}

Deque Systems offers [aXe-core](https://github.com/dequelabs/axe-core) for automated and end-to-end accessibility tests of your applications. This module includes integrations for Selenium.

[El Motor de Accesibilidad](https://www.deque.com/products/axe/) o aXe (por sus siglas en inglés), es una extensión inspectora de accesibilidad del navegador construida sobre `aXe-core`.

También puede usar el módulo [react-axe](https://github.com/dylanb/react-axe) para informar estos hallazgos de accesibilidad directamente a la consola mientras desarrolla y depura.

#### WebAIM WAVE {#webaim-wave}

La [Herramienta de evaluación de accesibilidad web](http://wave.webaim.org/extension/) (WAVE por sus siglas en inglés) es otra extensión de accesibilidad del navegador.

#### Inspectores de accesibilidad y el Árbol de Accesibilidad {#accessibility-inspectors-and-the-accessibility-tree}

[El Árbol de Accesibilidad](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) es un subconjunto del árbol DOM que contiene objetos accesibles para cada elemento del DOM que debería ser expuesto a la tecnología de asistencia, como los lectores de pantalla.

En algunos navegadores podemos ver fácilmente la información de accesibilidad para cada elemento en el árbol de accesibilidad:

- [Usando el inspector de accesibilidad en Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Activar el inspector de accesibilidad en Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Usando el inspector de accesibilidad en OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Lectores de pantalla {#screen-readers}

Las pruebas con un lector de pantalla deben formar parte de sus pruebas de accesibilidad.

Ten en cuenta que las combinaciones de navegador / lector de pantalla son importantes. Se recomienda que pruebe su aplicación en el navegador que mejor se adapte a su lector de pantalla.

### Lectores de pantalla de uso común {#commonly-used-screen-readers}

#### NVDA en Firefox {#nvda-in-firefox}

[Acceso a Escritorio No Visual](https://www.nvaccess.org/) o NVDA  por sus siglas en inglés, es un lector de pantalla de Windows de código abierto que es ampliamente usado.

Consulte las siguientes guías sobre cómo utilizar mejor NVDA:

- [WebAIM - Usando NVDA para evaluar la accesibilidad web](http://webaim.org/articles/nvda/)
- [Deque - Atajos de teclado NVDA](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver en Safari {#voiceover-in-safari}

VoiceOver es un lector de pantalla integrado en dispositivos Apple.

Consulta las siguientes guías sobre cómo activar y usar VoiceOver:

- [WebAIM - Uso de VoiceOver para evaluar la accesibilidad web](http://webaim.org/articles/voiceover/)
- [Deque - VoiceOver para los atajos de teclado de OS X](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver para accesos directos de iOS](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS en Internet Explorer {#jaws-in-internet-explorer}

[Acceso al Trabajo con el Habla](http://www.freedomscientific.com/Products/Blindness/JAWS) o JAWS por sus siglas en inglés, es un lector de pantalla de uso prolífico en Windows.

Consulte las siguientes guías sobre cómo utilizar mejor JAWS:

- [WebAIM - Uso de JAWS para evaluar la accesibilidad web](http://webaim.org/articles/jaws/)
- [Deque - Atajos de teclado de JAWS](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Otros lectores de pantalla {#other-screen-readers}

#### ChromeVox en Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](http://www.chromevox.com/) es un lector de pantalla integrado en Chromebooks y está disponible [como una extensión](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=es) para Google Chrome.

Refer to the following guides on how best to use ChromeVox:

- [Ayuda de Google Chromebook - Usa el lector de pantalla incorporado](https://support.google.com/chromebook/answer/7031755?hl=es)
- [Referencia de accesos directos del teclado clásico de ChromeVox](http://www.chromevox.com/keyboard_shortcuts.html)
