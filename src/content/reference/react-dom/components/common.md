---
title: "Componentes comunes (p. ej. <div>)"
---

<Intro>

Todos los componentes integrados, como [`<div>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/div), admiten algunas props y eventos comunes.

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### Componentes comunes (p. ej. `<div>`) {/*common*/}

```js
<div className="wrapper">Algún contenido</div>
```

[Ver más ejemplos abajo.](#usage)

#### Props {/*common-props*/}

Estas props especiales de React son compatibles con todos los componentes integrados:

* `children`: Un nodo de React (un elemento, un string, un número, [un portal,](/reference/react-dom/createPortal) un nodo vacío como `null`, `undefined` y booleanos, o un array de otros nodos de React). Especifica el contenido dentro del componente. Cuando usas JSX, por lo general especificarás la prop `children` implícitamente mediante la anidación de etiquetas como `<div><span /></div>`.

* `dangerouslySetInnerHTML`: Un objeto de la forma `{ __html: '<p>some html</p>' }` con un string HTML sin procesar dentro. Anula la propiedad [`innerHTML`](https://developer.mozilla.org/es/docs/Web/API/Element/innerHTML) del nodo del DOM y muestra el HTML pasado en el interior. Debe usarse con extrema precaución. Si el HTML no es de confianza (por ejemplo, si se basa en datos de usuario), se corre el riesgo de introducir una vulnerabilidad [XSS](https://es.wikipedia.org/wiki/Cross-site_scripting). [Lee más sobre cómo utilizar `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: Un objeto ref de [`useRef`](/reference/react/useRef) o [`createRef`](/reference/react/createRef), o una función [callback `ref`,](#ref-callback) o un string para [legacy refs.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Tu ref se llenará con el elemento DOM para este nodo. [Lee más sobre cómo manipular el DOM con refs.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Un booleano. Si es `true`, suprime la advertencia que React muestra para los elementos que tienen tanto `children` como `contentEditable={true}` (que normalmente no funcionan juntos). Úsalo si estás construyendo una biblioteca de entrada de texto que gestiona el contenido `contentEditable` manualmente.

* `suppressHydrationWarning`: Un booleano. Si usas [renderizado en el servidor,](/reference/react-dom/server) normalmente hay una advertencia cuando el servidor y el cliente renderizan un contenido diferente. En algunos casos extraños (como marcas de tiempo), es muy difícil o incluso imposible garantizar una concidencia exacta. Si estableces `suppressHydrationWarning` en `true`, React no te advertirá sobre las inconsistencias en los atributos y el contenido de este elemento. Sólo funciona a un nivel de profundidad, y está destinado a ser utilizado como una salida de emergencia. No lo uses en exceso. [Lee más sobre cómo suprimir errores de hidratación.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: Un objeto con estilos CSS, por ejemplo `{ fontWeight: 'bold', margin: 20 }`. Al igual que la propiedad [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) del DOM, los nombres de las propiedades CSS deben escribirse en camelCase, por ejemplo `fontWeight` en lugar de `font-weight`. Puedes pasar strings o números como valores. Si pasas un número, como `width: 100`, React automáticamente agregará `px` ("píxeles") al valor a menos que sea una [propiedad sin unidades.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Se recomienda usar `style` sólo para estilos dinámicos donde no se conocen los valores de estilo de antemano. En otros casos, aplicar clases clases CSS simples con `className` es más eficiente. [Lee más sobre `className` y `style`.](#applying-css-styles)

Estas propiedades DOM estándar también son compatibles con todos los componentes integrados:

* [`accessKey`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/accesskey): Un string. Especifica un acceso directo del teclado para el elemento. [Generalmente no se recomienda.](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/accesskey)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): Los atributos ARIA te permiten especificar la información del árbol de accesibilidad para este elemento. Consulta [atributos ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) para obtener una referencia completa. En React, todos los nombres de atributos ARIA son exactamente iguales que en HTML. 
* [`autoCapitalize`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/autocapitalize): Un string. Especifica si la entrada de texto que escribe el usuario se escribe en mayúsculas y cómo.
* [`className`](https://developer.mozilla.org/es/docs/Web/API/Element/className): Un string. Especifica el nombre de la clase CSS del elemento. [Lee más sobre cómo aplicar estilos de CSS.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/contenteditable): Un booleano. Si es `true`, el navegador permite al usuario editar directamente el elemento renderizado. Esto se utiliza para implementar bibliotecas de entrada de texto enriquecido como [Lexical.](https://lexical.dev/) React advierte si intentas pasar `children` a un elemento con `contentEditable={true}` porque React no podrá actualizar su contenido después de que el usuario lo edite. 
* [`data-*`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/data-*): Los atributos de datos permiten adjuntar algún dato tipo string, por ejemplo `data-fruit="banana"`. En React, comúnmente no se utilizan porque generalmente se leen datos de props o del estado en su lugar.
* [`dir`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/dir): `'ltr'` or `'rtl'`. Especifica la dirección de texto del elemento.
* [`draggable`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/draggable): Un booleano. Especifica si el elemento puede ser arrastrado. [Lee más sobre la API de arrastrar y soltar de HTML.](https://developer.mozilla.org/es/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Un string. Especifica qué acción presentar para la tecla Enter de los teclados virtuales.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Un string. Para [`<label>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/label) y [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), permite [asociar la etiqueta con algún control.](/reference/react-dom/components/input#providing-a-label-for-an-input) Lo mismo para el [atributo HTML `for`.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React utiliza los nombres de propiedades DOM estándar (`htmlFor`) en lugar de los nombres de los atributos HTML.
* [`hidden`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/hidden): Un booleano o un string. Especifica si el elemento debe estar oculto.
* [`id`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/id): Un string. Especifica un identificador único para este elemento, el cual puede ser usado para encontrarlo después o conectarlo con otros elementos. Genéralo con [`useId`](/reference/react/useId) para evitar conflictos entre varias instancias del mismo componente.
* [`is`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/is): Un string. Si se especifica, el componente se comportará como un [elemento personalizado.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Un string. Especifica qué tipo de teclado mostrar (por ejemplo, texto, número o teléfono).
* [`itemProp`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/itemprop): Un string. Especifica cuál propiedad representa el elemento para los rastreadores de datos estructurados.
* [`lang`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/lang): Un string. Especifica el idioma del elemento.
* [`onAnimationEnd`](https://developer.mozilla.org/es/docs/Web/API/Element/animationend_event): Una función manejadora de eventos [`AnimationEvent`](#animationevent-handler). Se dispara cuando una animación de CSS se completa.
* `onAnimationEndCapture`: Una versión de `onAnimationEnd` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): Una función manejadora de eventos [`AnimationEvent`](#animationevent-handler). Se dispara cuando una iteración de una animación de CSS termina y comienza otra.
* `onAnimationIterationCapture`: Una versión de `onAnimationIteration` que se dispara en la [fase de captura](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): Una función manejadora de eventos [`AnimationEvent`](#animationevent-handler). Se dispara cuando una animación de CSS comienza.
* `onAnimationStartCapture`: `onAnimationStart`, pero se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando se hace clic en un botón no primario.
* `onAuxClickCapture`: Una versión de `onAuxClick` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: Una función manejadora de eventos [`InputEvent`](#inputevent-handler). Se dispara antes de que se modifique el valor de un elemento editable. React aún *no* utiliza el evento nativo [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event), sino que intenta emularlo utilizando otros eventos.
* `onBeforeInputCapture`: Una versión de `onBeforeInput` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: Una función manejadora de eventos [`FocusEvent`](#focusevent-handler). Se dispara cuando un elemento pierde el foco. A diferencia del evento [`blur`](https://developer.mozilla.org/es/docs/Web/API/Element/blur_event) integrado en el navegador, en React, el evento `onBlur` se propaga.
* `onBlurCapture`: Una versión de `onBlur` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/es/docs/Web/API/Element/click_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando se hace clic en el botón principal del dispositivo señalador.
* `onClickCapture`: Una versión de `onClick` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): Una función manejadora de eventos [`CompositionEvent`](#compositionevent-handler). Se dispara cuando un [editor de método de entrada](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) comienza una nueva sesión de composición.
* `onCompositionStartCapture`: Una versión de `onCompositionStart` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): Una función manejadora de eventos [`CompositionEvent`](#compositionevent-handler). Se dispara cuando un [editor de métodos de entrada](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) completa o cancela una sesión de composición.
* `onCompositionEndCapture`: Una versión de `onCompositionEnd` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): Una función manejadora de eventos [`CompositionEvent`](#compositionevent-handler). Se dispara cuando un [editor de métodos de entrada](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) recibe un nuevo carácter.
* `onCompositionUpdateCapture`: Una versión de `onCompositionUpdate` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando el usuario intenta abrir un menú contextual.
* `onContextMenuCapture`: Una versión de `onContextMenu` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): Una función manejadora de eventos [`ClipboardEvent`](#clipboardevent-handler). Se dispara cuando el usuario intenta copiar algo en el portapapeles.
* `onCopyCapture`: Una versión de `onCopy` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): Una función manejadora de eventos [`ClipboardEvent`](#clipboardevent-handler). Se dispara cuando el usuario intenta cortar algo en el cortapapeles.
* `onCutCapture`: Una versión de `onCut` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando el usuario hace doble click. Corresponde al evento [`dblclick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event) del navegador.
* `onDoubleClickCapture`: Una versión de `onDoubleClick` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): Una función manejadora de eventos [`DragEvent`](#dragevent-handler). Se dispara mientras el usuario arrastra algo. 
* `onDragCapture`: Una versión de `onDrag` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): Una función manejadora de eventos [`DragEvent`](#dragevent-handler). Se dispara cuando el usuario deja de arrastrar algo. 
* `onDragEndCapture`: Una versión de `onDragEnd` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): Una función manejadora de eventos [`DragEvent`](#dragevent-handler). Se dispara cuando el contenido arrastrado entra en un objetivo válido para soltarlo. 
* `onDragEnterCapture`: Una versión de `onDragEnter` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/es/docs/Web/API/HTMLElement/dragover_event): Una función manejadora de eventos [`DragEvent`](#dragevent-handler). Se dispara en un objetivo de soltar válido mientras el contenido arrastrado está sobre él. Debes llamar `e.preventDefault()` aquí para permitir soltar.
* `onDragOverCapture`: Una versión de `onDragOver` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/es/docs/Web/API/HTMLElement/dragstart_event): Una función manejadora de eventos [`DragEvent`](#dragevent-handler). Se dispara cuando el usuario comienza a arrastrar un elemento.
* `onDragStartCapture`: Una versión de `onDragStart` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): Una función manejadora de eventos [`DragEvent`](#dragevent-handler). Se dispara cuando se suelta algo en un objetivo de soltar válido.
* `onDropCapture`: Una versión de `onDrop` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: A [`FocusEvent`](#focusevent-handler). Se dispara cuando un elemento pierde el foco. A diferencia del evento de [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) integrado del navegador, en React el evento `onFocus` se propaga.
* `onFocusCapture`: Una versión de `onFocus` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/es/docs/Web/API/Element/gotpointercapture_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando un elemento captura un puntero.
* `onGotPointerCaptureCapture`: Una versión de `onGotPointerCapture` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/es/docs/Web/API/Element/keydown_event): Una función manejadora de eventos [`KeyboardEvent`](#pointerevent-handler). Se dispara cuando una tecla es presionada.
* `onKeyDownCapture`: Una versión de `onKeyDown` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): Una función manejadora de eventos [`KeyboardEvent`](#pointerevent-handler). Obsoleta. En su lugar, usa `onKeyDown` o `onBeforeInput`.
* `onKeyPressCapture`: Una versión de `onKeyPress` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/es/docs/Web/API/Element/keyup_event): Una función manejadora de eventos [`KeyboardEvent`](#pointerevent-handler). Se dispara cuando se suelta una tecla.
* `onKeyUpCapture`: Una versión de `onKeyUp` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/es/docs/Web/API/Element/lostpointercapture_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando un elemento deja de capturar un puntero.
* `onLostPointerCaptureCapture`: Una versión de `onLostPointerCapture` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/es/docs/Web/API/Element/mousedown_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando el puntero se presiona.
* `onMouseDownCapture`: Una versión de `onMouseDown` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando el puntero se mueve dentro de un elemento. No tiene una fase de captura. , `onMouseLeave` y `onMouseEnter` se propagan desde el elemento que se deja al que se ingresa.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando el puntero se mueve fuera de un elemento. No tiene una fase de captura. En su lugar, `onMouseLeave` y `onMouseEnter` se propagan desde el elemento que se deja al que se ingresa.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando el puntero cambia de coordenadas.
* `onMouseMoveCapture`: Una versión de `onMouseMove` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando el puntero se mueve fuera de un elemento, o si se mueve a un elemento hijo.
* `onMouseOutCapture`: Una versión de `onMouseOut` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): Una función manejadora de eventos [`MouseEvent`](#mouseevent-handler). Se dispara cuando se suelta el puntero.
* `onMouseUpCapture`: Una versión de `onMouseUp` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando el navegador cancela una interacción de puntero.
* `onPointerCancelCapture`: Una versión de `onPointerCancel` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando el puntero se vuelve activo.
* `onPointerDownCapture`: Una versión de `onPointerDown` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando un cursor se mueve dentro de un elemento. No tiene una fase de captura. En su lugar, `onPointerLeave` y `onPointerEnter` se propagan desde el elemento que se deja al que se ingresa.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando un puntero se mueve fuera de un elemento. No tiene una fase de captura. En su lugar, `onPointerLeave` y `onPointerEnter` se propagan desde el elemento que se deja al que se ingresa.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando un puntero cambia de coordenadas.
* `onPointerMoveCapture`: Una versión de `onPointerMove` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando un puntero se mueve fuera de un elemento, si la interacción del puntero es cancelada, y [por algunas otras razones.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: Una versión de `onPointerOut` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): Una función manejadora de eventos [`PointerEvent`](#pointerevent-handler). Se dispara cuando un puntero ya no está activo.
* `onPointerUpCapture`: Una versión de `onPointerUp` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): Una función manejadora de eventos [`ClipboardEvent`](#clipboardevent-handler). Se dispara cuando el usuario intenta pegar algo desde el portapapeles.
* `onPasteCapture`: Una versión de `onPaste` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/es/docs/Web/API/Element/scroll_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando se ha desplazado un elemento. Este evento no se propaga.
* `onScrollCapture`: Una versión de `onScroll` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/es/docs/Web/API/HTMLInputElement/select_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara después de que la selección dentro de un elemento editable, como un input, cambia. React extiende el evento `onSelect` para que funcione también en elementos con `contentEditable={true}`. Además, React lo extiende para que se active cuando la selección esté vacía y en ediciones (que pueden afectar la selección).
* `onSelectCapture`: Una versión de `onSelect` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): Una función manejadora de eventos [`TouchEvent`](#touchevent-handler). Se dispara cuando el navegador cancela una interacción táctil.
* `onTouchCancelCapture`: Una versión de `onTouchCancel` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): Una función manejadora de eventos [`TouchEvent`](#touchevent-handler). Se dispara cuando se quitan uno o más puntos táctiles.
* `onTouchEndCapture`: Una versión de `onTouchEnd` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): Una función manejadora de eventos [`TouchEvent`](#touchevent-handler). Se dispara cuando se mueven uno o más puntos táctiles.
* `onTouchMoveCapture`: Una versión de `onTouchMove` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/es/docs/Web/API/Element/touchstart_event): Una función manejadora de eventos [`TouchEvent`](#touchevent-handler). Se dispara cuando se colocan uno más puntos táctiles
* `onTouchStartCapture`: Una versión de `onTouchStart` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/es/docs/Web/API/Element/transitionend_event): Una función manejadora de eventos [`TransitionEvent`](#transitionevent-handler). Se dispara cuando se completa una transición de CSS.
* `onTransitionEndCapture`: Una versión de `onTransitionEnd` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/es/docs/Web/API/Element/wheel_event): Una función manejadora de eventos [`WheelEvent`](#wheelevent-handler). Se dispara cuando el usuario gira un botón de rueda en un dispositivo señalador.
* `onWheelCapture`: Una versión de `onWheel` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Un string. Especifica el rol del elemento explícitamente para las tecnologías de asistencia.

* [`slot`](https://developer.mozilla.org/en-US/docs/Web/API/Element/slot): Un string. Especifica el nombre del slot cuando se utiliza shadow DOM. En React, normalmente se logra un patrón equivalente al pasar JSX como props, por ejemplo `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/spellcheck): Un booleano o `null`. Si explícitamente se establece en `true` o `false`, habilita o deshabilita la corrección ortográfica.
* [`tabIndex`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/tabindex): Un número. Anula el comportamiento por defecto del botón Tab. [Evita utilizar valores distintos de -1 y 0.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/title): Un string. Especifica el texto de información de ayuda para el elemento.
* [`translate`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/translate): Ya sea `'yes'` o `'no'`. Pasar `'no'` excluye el contenido del elemento de ser traducido.

También puedes pasar atributos personalizados como props, por ejemplo `mycustomprop="someValue"`. Esto puede ser útil al integrar bibliotecas de terceros. El nombre del atributo personalizado debe estar en minúsculas y no debe empezar con `on`. El valor se convertirá a un string. Si pasas `null` o `undefined`, se eliminará el atributo personalizado.

Estos eventos se disparan sólo para los elementos [`<form>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/form):

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando se reinicia un formulario.
* `onResetCapture`: Una versión de `onReset` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/es/docs/Web/API/HTMLFormElement/submit_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando se envía un formulario.
* `onSubmitCapture`: Una versión de `onSubmit` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)

Estos eventos se disparan sólo para los elementos [`<dialog>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/dialog). A diferencia de los eventos del navegador, se propagan en React:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el usuario intenta cerrar el diálogo.
* `onCancelCapture`: Una versión de `onCancel` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)

* [`onClose`](https://developer.mozilla.org/es/docs/Web/API/HTMLDialogElement/close_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando un diálogo ha sido cerrado.
* `onCloseCapture`: Una versión de `onClose` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)

Estos eventos sólo se disparan para los elementos [`<details>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/details). A diferencia de los eventos del navegador, se propagan en React:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el usuario cambia el estado de los detalles.
* `onToggleCapture`: Una versión de `onToggle` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)


Estos eventos se disparan para los elementos [`<img>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/link), and [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag). A diferencia de los eventos del navegador, se propagan en React:

* `onLoad`: Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el recurso ha sido cargado.
* `onLoadCapture`: Una versión de `onLoad` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el recurso no se ha podido cargar.
* `onErrorCapture`: Una versión de `onError` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)

Estos eventos se disparan para recursos como [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) y [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). A diferencia de los eventos del navegador, se propagan en React:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el recurso no se ha cargado completamente, pero no debido a un error.
* `onAbortCapture`: Una versión de `onAbort` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/es/docs/Web/API/HTMLMediaElement/canplay_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando hay suficientes datos para empezar a reproducir, pero no los suficientes para reproducir hasta el final sin búfer.
* `onCanPlayCapture`: Una versión de `onCanPlay` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando hay suficientes datos y es posible empezar a reproducir sin búfer hasta el final.
* `onCanPlayThroughCapture`: Una versión de `onCanPlayThrough` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando la duración del archivo multimedia ha sido actualizada.
* `onDurationChangeCapture`: Una versión de `onDurationChange` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el recurso multimedia se ha quedado vacío.
* `onEmptiedCapture`: Una versión de `onEmptied` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el navegador encuentra contenido multimedia cifrado.
* `onEncryptedCapture`: Una versión de `onEncrypted` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando la reproducción se detiene porque no hay nada más que reproducir.
* `onEndedCapture`: Una versión de `onEnded` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Una función manejadora de eventos [`Event`](#event-handler) function. Se dispara cuando no se ha podido cargar el recurso.
* `onErrorCapture`: Una versión de `onError` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/es/docs/Web/API/HTMLMediaElement/loadeddata_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el marco de reproducción actual se ha cargado.
* `onLoadedDataCapture`: Una versión de `onLoadedData` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando se han cargado los metadatos.
* `onLoadedMetadataCapture`: Una versión de `onLoadedMetadata` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el navegador ha comenzado a cargar el recurso.
* `onLoadStartCapture`: Una versión de `onLoadStart` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando se ha pausado el recurso multimedia.
* `onPauseCapture`: Una versión de `onPause` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando se ha reanudado la reproducción del recurso multimedia.
* `onPlayCapture`: Una versión de `onPlay` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el archivo multimedia comienza o reinicia la reproducción.
* `onPlayingCapture`: Una versión de `onPlaying` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara periódicamente mientras se está cargando el recurso.
* `onProgressCapture`: Una versión de `onProgress` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando la velocidad de reproducción cambia.
* `onRateChangeCapture`: Una versión de `onRateChange` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* `onResize`: Una función manejadora de eventos [`Event`](#event-handler). Se activa cuando cambia el tamaño del video.
* `onResizeCapture`: Una versión de `onResize` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando se completa una operación de búsqueda.
* `onSeekedCapture`: Una versión de `onSeeked` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando comienza una operación de búsqueda.
* `onSeekingCapture`: Una versión de `onSeeking` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el navegador está esperando datos pero no los carga.
* `onStalledCapture`: Una versión de `onStalled` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando la carga del recurso se ha suspendido.
* `onSuspendCapture`: Una versión de `onSuspend` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el tiempo actual de la reproducción se actualiza.
* `onTimeUpdateCapture`: Una versión de `onTimeUpdate` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando el volumen ha cambiado.
* `onVolumeChangeCapture`: Una versión de `onVolumeChange` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): Una función manejadora de eventos [`Event`](#event-handler). Se dispara cuando la reproducción se detuvo debido a la falta temporal de datos.
* `onWaitingCapture`: Una versión de `onWaiting` que se dispara en la [fase de captura.](/learn/responding-to-events#capture-phase-events)

#### Advertencias {/*common-caveats*/}

- No puedes pasar tanto `children` como `dangerouslySetInnerHTML` al mismo tiempo.
- Algunos eventos (como `onAbort` y `onLoad`) no se propagan en el navegador, pero sí en React.

---

### Función callback `ref` {/*ref-callback*/}

En lugar de un objeto ref (como el devuelto por [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), puedes pasar una función al atributo `ref`.

```js
<div ref={(node) => console.log(node)} />
```

[Vea un ejemplo de la función callback `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Cuando el nodo del DOM `<div>` es agregado a la pantalla, React llamará a tu callback `ref` con el nodo del DOM como argumento. Cuando ese nodo del DOM `<div>` se elimina, React llamará a tu callback `ref` con `null`.

React también llamará a tu callback `ref` cada vez que pases un callback `ref` *diferente*. En el ejemplo anterior, `(node) => { ... }` es una función diferente en cada renderizado. Cuando tu componente se vuelva a renderizar, la función *anterior* será llamada con `null` como argumento, y la *siguiente* función será llamada con el nodo del DOM.

#### Parámetros {/*ref-callback-parameters*/}

* `node`: Un nodo del DOM o `null`. React te pasará el nodo del DOM cuando se vincule la ref, y `null` cuando la ref se desvincule. A menos que pases la misma función ref para el callback `ref` en cada renderizado, el callback se desprenderá temporalmente y se volverá a vincular durante cada renderizado del componente.

#### Retornos {/*returns*/}

No retornes nada desde el callback `ref`.

---

### Objeto de evento de React {/*react-event-object*/}

Los manejadores de eventos recibirán un *objeto de evento de React.* A veces también se le conoce como un "evento sintético".

```js
<button onClick={e => {
  console.log(e); // Objeto de evento de React
}} />
```

Cumple con el mismo estándar que los eventos DOM subyacentes, pero soluciona algunas inconsistencia del navegador.

Algunos eventos de React no se asignan directamente a los eventos nativos del navegador. Por ejemplo en `onMouseLeave`, `e.nativeEvent` apuntará a un evento `mouseout`. La asignación específica no forma parte de la API pública y puede cambiar en el futuro. Si necesitas el evento del navegador subyacente por alguna razón, léelo desde `e.nativeEvent`.

#### Propiedades {/*react-event-object-properties*/}

Los objetos de evento de React implementan algunas de las propiedades estándar de [`Evento`](https://developer.mozilla.org/es/docs/Web/API/Event):

* [`bubbles`](https://developer.mozilla.org/es/docs/Web/API/Event/bubbles): Un booleano. Devuelve si el evento se propaga a través del DOM. 
* [`cancelable`](https://developer.mozilla.org/es/docs/Web/API/Event/cancelable): Un booleano. Devuelve si el evento se puede cancelar.
* [`currentTarget`](https://developer.mozilla.org/es/docs/Web/API/Event/currentTarget): Un nodo del DOM. Devuelve el nodo al que se vincula el manejador de eventos actual en el árbol de React.
* [`defaultPrevented`](https://developer.mozilla.org/es/docs/Web/API/Event/defaultPrevented): Un booleano. Devuelve si se llamó a `preventDefault`.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Un número. Devuelve en qué fase se encuentra el evento actualmente.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Un booleano. Devuelve si el evento fue iniciado por el usuario.
* [`target`](https://developer.mozilla.org/es/docs/Web/API/Event/target): Un nodo del DOM. Devuelve el nodo en el que ha ocurrido el evento (que podría ser un hijo distante)
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Un número. Devuelve la hora (en milisegundos) en la que ocurrió el evento.

Además, los objetos de evento de React proporcionan estas propiedades:

* `nativeEvent`: Un [`Evento`](https://developer.mozilla.org/es/docs/Web/API/Event) del DOM. El objeto de evento original del navegador.

#### Métodos {/*react-event-object-methods*/}

Los objetos de evento de React implementan algunos de los métodos estándar de [`Evento`](https://developer.mozilla.org/es/docs/Web/API/Event):

* [`preventDefault()`](https://developer.mozilla.org/es/docs/Web/API/Event/preventDefault): Evita la acción del navegador predeterminada para el evento.
* [`stopPropagation()`](https://developer.mozilla.org/es/docs/Web/API/Event/stopPropagation): Detiene la propagación del evento a través del árbol de React.

Además, los objetos de evento de React proporcionan estos métodos:

* `isDefaultPrevented()`:  Devuelve un valor booleano que indica si se llamó a `preventDefault`.
* `isPropagationStopped()`: Devuelve un valor booleano que indica si se llamó a `stopPropagation`.
* `persist()`: No se usa con React DOM. Con React Native, llámalo para leer las propiedades del evento después del evento.
* `isPersistent()`: No se usa con React DOM. Con React Native, devuelve si se ha llamado a persist.

#### Advertencias {/*react-event-object-caveats*/}

* Los valores de `currentTarget`, `eventPhase`, `target`, y `type` reflejan los valores que tu código de React espera. Sin embargo, internamente, React vincula los manejadores de eventos en la raíz, pero esto no se refleja en los objetos de evento de React. Por ejemplo, `e.currentTarget` puede no ser lo mismo que el valor subyacente `e.nativeEvent.currentTarget`. Para eventos con polyfills, `e.type` (tipo de evento de React) puede ser diferente de `e.nativeEvent.type` (tipo subyacente).

---

### Función manejadora de eventos `AnimationEvent` {/*animationevent-handler*/}

Un tipo de manejador de eventos para los eventos de [animación CSS](https://developer.mozilla.org/es/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parámetros {/*animationevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`AnimationEvent`](https://developer.mozilla.org/es/docs/Web/API/AnimationEvent):
  * [`animationName`](https://developer.mozilla.org/es/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### Función manejadora de eventos `ClipboardEvent` {/*clipboadevent-handler*/}

Un tipo de manejador de eventos para los eventos de [Clipboard API](https://developer.mozilla.org/es/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parámetros {/*clipboadevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`ClipboardEvent`](https://developer.mozilla.org/es/docs/Web/API/ClipboardEvent):

  * [`clipboardData`](https://developer.mozilla.org/es/docs/Web/API/ClipboardEvent/clipboardData)

---

### Función manejadora de eventos `CompositionEvent` {/*compositionevent-handler*/}

Un tipo de manejador de eventos para los eventos del [editor de métodos de entrada](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parámetros {/*compositionevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### Función manejadora de eventos `DragEvent` {/*dragevent-handler*/}

Un tipo de manejador de eventos para los eventos de la [API de arrastrar y soltar de HTML](https://developer.mozilla.org/es/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Fuente de arrastre
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Área de destino
  </div>
</>
```

#### Parámetros {/*dragevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`DragEvent`](https://developer.mozilla.org/es/docs/Web/API/DragEvent):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  También incluye las propiedades heredadas de [`MouseEvent`](https://developer.mozilla.org/es/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  También incluye las propiedades heredadas de [`UIEvent`](https://developer.mozilla.org/es/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Función manejadora de eventos `FocusEvent` {/*focusevent-handler*/}

Un tipo de manejador de eventos para los eventos de foco.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Mira un ejemplo.](#handling-focus-events)

#### Parámetros {/*focusevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  También incluye las propiedades heredadas de [`UIEvent`](https://developer.mozilla.org/es/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Función manejadora de eventos `Event` {/*event-handler*/}

Un tipo de función manejadora de eventos genéricos.

#### Parámetros {/*event-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) sin propiedades adicionales.

---

### Función manejadora de eventos `InputEvent` {/*inputevent-handler*/}

Un tipo de manejador de eventos para el evento `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parámetros {/*inputevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### Función manejadora de eventos `KeyboardEvent` {/*keyboardevent-handler*/}

Un tipo de manejador de eventos para eventos de teclado.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Mira un ejemplo.](#handling-keyboard-events)

#### Parámetros {/*keyboardevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`KeyboardEvent`](https://developer.mozilla.org/es/docs/Web/API/KeyboardEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/es/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/es/docs/Web/API/UIEvent/which)

  También incluye las propiedades heredadas de [`UIEvent`](https://developer.mozilla.org/es/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Función manejadora de eventos `MouseEvent` {/*mouseevent-handler*/}

Un tipo de manejador de eventos para eventos del mouse.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Mira un ejemplo.](#handling-mouse-events)

#### Parámetros {/*mouseevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`MouseEvent`](https://developer.mozilla.org/es/docs/Web/API/MouseEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/es/docs/Web/API/MouseEvent/shiftKey)

  También incluye las propiedades heredadas de [`UIEvent`](https://developer.mozilla.org/es/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Función manejadora de eventos `PointerEvent` {/*pointerevent-handler*/}

Un tipo de manejador de eventos para [eventos del puntero.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Mira un ejemplo.](#handling-pointer-events)

#### Parámetros {/*pointerevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  También incluye las propiedades heredadas de [`MouseEvent`](https://developer.mozilla.org/es/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  También incluye las propiedades heredadas de [`UIEvent`](https://developer.mozilla.org/es/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Función manejadora de eventos `TouchEvent` {/*touchevent-handler*/}

Un tipo de manejador de eventos para [eventos táctiles.](https://developer.mozilla.org/es/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Parámetros {/*touchevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`TouchEvent`](https://developer.mozilla.org/es/docs/Web/API/TouchEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  También incluye las propiedades heredadas de [`UIEvent`](https://developer.mozilla.org/es/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Función manejadora de eventos `TransitionEvent` {/*transitionevent-handler*/}

Un tipo de manejador de eventos para los eventos de transición CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parámetros {/*transitionevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### Función manejadora de eventos `UIEvent` {/*uievent-handler*/}

Un tipo de manejador de eventos para eventos de UI genéricos.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parámetros {/*uievent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`UIEvent`](https://developer.mozilla.org/es/docs/Web/API/UIEvent):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)
  
---

### Función manejadora de eventos `WheelEvent` {/*wheelevent-handler*/}

Un tipo de manejador de eventos para el evento `onWheel`.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parámetros {/*wheelevent-handler-parameters*/}

* `e`: Un [objeto de evento de React](#react-event-object) con propiedades adicionales de [`WheelEvent`](https://developer.mozilla.org/es/docs/Web/API/WheelEvent):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  También incluye las propiedades heredadas de [`MouseEvent`](https://developer.mozilla.org/es/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  También incluye las propiedades heredadas de [`UIEvent`](https://developer.mozilla.org/es/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Uso {/*usage*/}

### Aplicar estilos CSS {/*applying-css-styles*/}

En React, se especifica una clase de CSS con [`className`.](https://developer.mozilla.org/es/docs/Web/API/Element/className) Funciona como el atributo `class`en HTML:

```js
<img className="avatar" />
```

Luego, se escriben las reglas CSS para dicha clase en un archivo CSS separado.

```css
/* En tu archivo CSS */
.avatar {
  border-radius: 50%;
}
```

React no indica cómo agregar archivos CSS. En el caso más simple, añadirás una etiqueta [`<link>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/link) en el HTML. Si usas un framework o alguna herramienta de compilación, consulta su documentación para aprender cómo añadir un archivo CSS a tu proyecto.

A veces, los valores de estilo dependen de los datos. Usa el atributo `style` para pasar algunos estilos dinámicamente:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


En el ejemplo anterior, `style={{}}` no es una sintaxis especial, sino un objeto `{}` regular dentro de las [llaves JSX](/learn/javascript-in-jsx-with-curly-braces) `style={ }`. Recomendamos utilizar el atributo `style` sólo cuando los estilos dependen de variables JavaScript.

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### ¿Cómo aplicar múltiples clases de CSS de forma condicional? {/*how-to-apply-multiple-css-classes-conditionally*/}

Para aplicar clases de CSS de forma condicional, necesitas producir el string de `className` tú mismo utilizando JavaScript.

Por ejemplo, `className={'row ' + (isSelected ? 'selected': '')}` producirá ya sea  `className="row"` o `className="row selected"` dependiendo de si `isSelected` es `true`.

Para hacer esto más legible, puedes usar una pequeña biblioteca de ayuda como [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

Es conveniente si tienes múltiples clases condicionales:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Manipular un nodo del DOM con una ref {/*manipulating-a-dom-node-with-a-ref*/}

A veces, necesitarás obtener el nodo del DOM del navegador asociado con una etiqueta en JSX. Por ejemplo, si quieres enfocar un `<input>` cuando se hace clic en un botón, necesitas llamar a [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) en el nodo del DOM `<input>` del navegador.

Para obtener el nodo del DOM del navegador de una etiqueta, declara una ref y pásala como el atributo ref a esa etiqueta:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React pondrá el nodo del DOM en `inputRef.current` después de que haya sido renderizado en la pantalla.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Lee más sobre cómo [manipular el DOM con refs](/learn/manipulating-the-dom-with-refs) y [consulta más ejemplos.](/reference/react/useRef#examples-dom)

Para casos de uso más avanzados, el atributo ref también acepta una [función callback.](#ref-callback)

---

### dangerouslySetInnerHTML {/*dangerously-setting-the-inner-html*/}

Puedes pasar un string HTML sin procesar a un elemento de esta manera:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Esto es peligroso. Al igual que con la propiedad subyacente del DOM [`innerHTML`](https://developer.mozilla.org/es/docs/Web/API/Element/innerHTML), debes tener precaución extrema! A menos que el markup venga de una fuente completamente confiable, se podría correr el riesgo de introducir una vulnerabilidad [XSS](https://es.wikipedia.org/wiki/Cross-site_scripting) de esta manera.**

Por ejemplo, si utilizas una biblioteca de Markdown que convierte Markdown a HTML, debes confiar en que el parser no contenga errores y el usuario sólo vea su propio input, puedes mostrar el HTML resultante de esta manera:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Ingresa texto en markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // Esto SÓLO es seguro porque el HTML resultante
  // se muestra al mismo usuario y confías en que
  // este parser de Markdown no tiene errores.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

Para entender por qué el renderizado arbitrario de HTML es peligroso, reemplaza el código anterior con esto: 

```js {1-4,7,8}
const post = {
  // // Imagina que este contenido se almacena en la base de datos.
  content: `<img src="" onerror='alert("has sido hackeado")'>`
};

export default function MarkdownPreview() {
  // 🔴  AGUJERO DE SEGURIDAD: pasando input no confiable a dangerouslySetInnerHTML.
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

El código incrustado en el HTML se ejecutará. Un hacker podría utilizar este agujero de seguridad para robar información de los usuarios o realizar acciones en su nombre. **Solo usa `dangerouslySetInnerHTML` con datos confiables y sanitizados.**

---

### Manejo de eventos del mouse {/*handling-mouse-events*/}

Este ejemplo muestra algunos [eventos del mouse](#mouseevent-handler) comunes y cuándo se disparan.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Manejo de eventos del puntero {/*handling-pointer-events*/}

Este ejemplo muestra algunos [eventos del puntero](#pointerevent-handler) comunes y cuándo se disparan.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Manejo de eventos de foco {/*handling-focus-events*/}

En React, los [eventos de foco](#focusevent-handler) se propagan. Puedes usar el `currentTarget` y `relatedTarget` para diferenciar si los eventos de enfoque o desenfoque se originaron fuera del elemento padre. El ejemplo muestra cómo detectar el enfoque en un hijo, el enfoque en el elemento padre, y cómo detectar el enfoque al entrar o salir de todo el subárbol.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // No se activa al cambiar el enfoque entre los hijos
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // No se activa al cambiar el enfoque entre los hijos
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Manejo de eventos de teclado {/*handling-keyboard-events*/}

Este ejemplo muestra algunos [eventos del teclado](#keyboardevent-handler) comunes y cuándo se disparan.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
