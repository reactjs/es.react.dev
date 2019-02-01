---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Esta guía de referencia documenta la envoltura `SyntheticEvent` que forma parte del sistema de eventos de React. Consulte la guía [Eventos de manipulación](/docs/handling-events.html) para obtener más información.

## Overview

A sus manejadores de eventos se les pasarán instancias de `SyntheticEvent`, un contenedor de navegador cruzado alrededor del evento nativo del navegador. Tiene la misma interfaz que el evento nativo del navegador, incluyendo `stopPropagation ()` y `preventDefault ()`, excepto que los eventos funcionan de manera idéntica en todos los navegadores.

Si encuentra que necesita el evento del navegador subyacente por alguna razón, simplemente use el atributo `nativeEvent` para obtenerlo. Cada objeto `SyntheticEvent` tiene los siguientes atributos:

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

> Nota:
>
> A partir de v0.14, devolver `false` desde un controlador de eventos ya no detendrá la propagación de eventos. En su lugar, `e.stopPropagation ()` o `e.preventDefault ()` deben activarse manualmente, según corresponda.


### Agrupación de eventos

El `SyntheticEvent` está agrupado. Esto significa que el objeto `SyntheticEvent` se reutilizará y todas las propiedades se anularán después de que se haya invocado la devolución de llamada del evento.
Esto es por razones de rendimiento.
Como tal, no puede acceder al evento de forma asíncrona.

```javascript
function onClick(event) {
  console.log(event); // => objeto nulo.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Mo funcionará. this.state.clickEvent solo contendrá valores nulos.
  this.setState({clickEvent: event});

  // Todavía puede exportar propiedades de eventos.
  this.setState({eventType: event.type});
}
```

> Nota:
>
> Si desea acceder a las propiedades del evento de forma asíncrona, debe llamar a `event.persist()` en el evento, lo que eliminará el evento sintético del grupo y permitirá que el código de usuario retenga las referencias al evento.

## Eventos Apoyados

React normaliza los eventos para que tengan propiedades consistentes en diferentes navegadores.

Los controladores de eventos a continuación se activan por un evento en la fase de propagación. Para registrar un controlador de eventos para la fase de captura, agregue `Capture` al nombre del evento; por ejemplo, en lugar de usar `onClick`, usarías` onClickCapture` para manejar el evento de clic en la fase de captura.

- [Portapapeles Eventos](#clipboard-events)
- [Composición Eventos](#composition-events)
- [Eventos del Teclado](#keyboard-events)
- [Eventos de Enfoque](#focus-events)
- [Formar Eventos](#form-events)
- [Eventos del Ratón](#mouse-events)
- [Eventos Puntero](#pointer-events)
- [Selección Eventos](#selection-events)
- [Eventos Táctiles](#touch-events)
- [Eventos de la Interfaz de Usuario](#ui-events)
- [Ruedas Eventos](#wheel-events)
- [Eventos de Medios](#media-events)
- [Eventos de Imagen](#image-events)
- [Eventos de Animacion](#animation-events)
- [Eventos de Transición](#transition-events)
- [Otros Eventos](#other-events)

* * *

## Reference

### Clipboard Events

Event names:

```
onCopy onCut onPaste
```

Properties:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Composition Events

Event names:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Properties:

```javascript
string data

```

* * *

### Keyboard Events

Event names:

```
onKeyDown onKeyPress onKeyUp
```

Properties:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

The `key` property can take any of the values documented in the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### Focus Events

Event names:

```
onFocus onBlur
```

These focus events work on all elements in the React DOM, not just form elements.

Properties:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Form Events

Event names:

```
onChange onInput onInvalid onSubmit
```

For more information about the onChange event, see [Forms](/docs/forms.html).

* * *

### Mouse Events

Event names:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

The `onMouseEnter` and `onMouseLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase.

Properties:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Pointer Events

Event names:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

The `onPointerEnter` and `onPointerLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase.

Properties:

As defined in the [W3 spec](https://www.w3.org/TR/pointerevents/), pointer events extend [Mouse Events](#mouse-events) with the following properties:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

A note on cross-browser support:

Pointer events are not yet supported in every browser (at the time of writing this article, supported browsers include: Chrome, Firefox, Edge, and Internet Explorer). React deliberately does not polyfill support for other browsers because a standard-conform polyfill would significantly increase the bundle size of `react-dom`.

If your application requires pointer events, we recommend adding a third party pointer event polyfill.

* * *

### Selection Events

Event names:

```
onSelect
```

* * *

### Touch Events

Event names:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Properties:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI Events

Event names:

```
onScroll
```

Properties:

```javascript
number detail
DOMAbstractView view
```

* * *

### Wheel Events

Event names:

```
onWheel
```

Properties:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Media Events

Event names:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Image Events

Event names:

```
onLoad onError
```

* * *

### Animation Events

Event names:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Properties:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Transition Events

Event names:

```
onTransitionEnd
```

Properties:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Other Events

Event names:

```
onToggle
```
