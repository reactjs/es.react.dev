---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Esta guía de referencia documenta el contenedor `SyntheticEvent` que forma parte del sistema de eventos de React. Consulte la guía [Eventos de manipulación](/docs/handling-events.html) para obtener más información.

## Overview {#overview}

A sus manejadores de eventos se les pasarán instancias de `SyntheticEvent`, un contenedor agnóstico al navegador alrededor del evento nativo del navegador. Tiene la misma interfaz que el evento nativo del navegador, incluyendo `stopPropagation()` y `preventDefault()`, excepto que los eventos funcionan de manera idéntica en todos los navegadores.

Si encuentras que necesitas el evento del navegador subyacente por alguna razón, simplemente use el atributo `nativeEvent` para obtenerlo. Cada objeto `SyntheticEvent` tiene los siguientes atributos:

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
> A partir de la versión 0.14, devolver `false` desde un controlador de eventos ya no detendrá la propagación de eventos. En su lugar, `e.stopPropagation()` o `e.preventDefault()` deben activarse manualmente, según corresponda.

### Agrupación de eventos {#event-pooling}

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

  // No funcionará. this.state.clickEvent solo contendrá valores nulos.
  this.setState({clickEvent: event});

  // Todavía puedes exportar propiedades de eventos.
  this.setState({eventType: event.type});
}
```

> Nota:
>
<<<<<<< HEAD
> Si desea acceder a las propiedades del evento de forma asíncrona, debe llamar a `event.persist()` en el evento, lo que eliminará el evento sintético del grupo y permitirá que el código de usuario retenga las referencias al evento.

## Eventos Soportados

React normaliza los eventos para que tengan propiedades consistentes en diferentes navegadores.

Los controladores de eventos a continuación se activan por un evento en la fase de propagación. Para registrar un controlador de eventos llamado en la fase de captura, agregue `Capture` al nombre del evento; por ejemplo, en lugar de usar `onClick`, usarías` onClickCapture` para manejar el evento de click en la fase de captura.

- [Eventos del Portapapeles](#clipboard-events)
- [Eventos de Composición](#composition-events)
- [Eventos del Teclado](#keyboard-events)
- [Eventos de Enfoque](#focus-events)
- [Formar Eventos](#form-events)
- [Eventos del Ratón](#mouse-events)
- [Eventos del Puntero](#pointer-events)
- [Eventos de Selección](#selection-events)
- [Eventos Táctiles](#touch-events)
- [Eventos de la Interfaz de Usuario](#ui-events)
- [Eventos de la Rueda del Ratón](#wheel-events)
- [Eventos de Medios](#media-events)
- [Eventos de Imagen](#image-events)
- [Eventos de Animación](#animation-events)
- [Eventos de Transición](#transition-events)
- [Otros Eventos](#other-events)

* * *

## Referencia

### Eventos del Portapapeles
=======
> If you want to access the event properties in an asynchronous way, you should call `event.persist()` on the event, which will remove the synthetic event from the pool and allow references to the event to be retained by user code.

## Supported Events {#supported-events}

React normalizes events so that they have consistent properties across different browsers.

The event handlers below are triggered by an event in the bubbling phase. To register an event handler for the capture phase, append `Capture` to the event name; for example, instead of using `onClick`, you would use `onClickCapture` to handle the click event in the capture phase.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)

* * *

## Reference {#reference}

### Clipboard Events {#clipboard-events}
>>>>>>> aada3a308493614b7d5b4b438b5c345d7ecc6c53

Nombres de Eventos:

```
onCopy onCut onPaste
```

Propiedades:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Eventos de Composición {#composition-events}

Nombres de Eventos:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Propiedades:

```javascript
string data

```

* * *

### Eventos del Teclado {#keyboard-events}

Nombres de Eventos:

```
onKeyDown onKeyPress onKeyUp
```

Propiedades:

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

La propiedad `key` puede tomar cualquiera de los valores documentados en [la especificación de DOM Level 3 Events](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### Eventos de Enfoque {#focus-events}

Nombres de Eventos:

```
onFocus onBlur
```

Estos eventos de enfoque funcionan en todos los elementos en React DOM, no sólo en los elementos de formulario.

Propiedades:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Eventos de Formulario {#form-events}

Nombres de Eventos:

```
onChange onInput onInvalid onSubmit
```

Para obtener más información sobre el evento onChange, consulte [Formularios](/docs/forms.html).

* * *

### Eventos del Ratón {#mouse-events}

Nombres de Eventos:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

Los eventos `onMouseEnter` y `onMouseLeave` se propagan desde el elemento que se deja hasta el que se ingresa en lugar del bubbling normal y no tienen una fase de captura.

Propiedades:

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

### Eventos Puntero {#pointer-events}

Nombres de Eventos:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

Los eventos `onPointerEnter` y `onPointerLeave` se propagan desde el elemento que se deja hasta el que se ingresa en lugar del bubbling normal y no tienen una fase de captura.

Propiedades:

Como se define en [la especificación W3](https://www.w3.org/TR/pointerevents/), los eventos de puntero extienden los [Eventos de Ratón](#mouse-events) con las siguientes propiedades:

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

Una nota sobre la compatibilidad con varios navegadores:

Los eventos de puntero aún no son compatibles con todos los navegadores (en el momento de escritura de este artículo, los navegadores compatibles incluyen: Chrome, Firefox, Edge e Internet Explorer). React deliberada no admite polyfill para otros navegadores, ya que un polyfill de conformidad estándar aumentaría significativamente el tamaño del paquete de `react-dom`.

Si su aplicación requiere eventos de puntero, le recomendamos que agregue un polyfill de evento de puntero de terceros.

* * *

### Eventos de Selección {#selection-events}

Nombres de Eventos

```
onSelect
```

* * *

### Eventos Táctiles {#touch-events}

Nombres de Eventos:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Propiedades:

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

### Eventos de la Interfaz de Usuario {#ui-events}

Nombres de Eventos:

```
onScroll
```

Propiedades:

```javascript
number detail
DOMAbstractView view
```

* * *

### Eventos de la Rueda del Ratón {#wheel-events}

Nombres de Eventos:

```
onWheel
```

Propiedades:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Eventos de Medios {#media-events}

Nombres de Eventos:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Eventos de Imagen {#image-events}

Nombres de Eventos:

```
onLoad onError
```

* * *

### Eventos de Animación {#animation-events}

Nombres de Eventos:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Propiedades:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Eventos de Transición {#transition-events}

Nombres de Eventos:

```
onTransitionEnd
```

Propiedades:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Otros Eventos {#other-events}

Nombres de Eventos:

```
onToggle
```
