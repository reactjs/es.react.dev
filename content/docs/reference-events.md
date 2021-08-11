---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Esta guía de referencia documenta el contenedor `SyntheticEvent` que forma parte del sistema de eventos de React. Consulte la guía [Manejando eventos](/docs/handling-events.html) para obtener más información.

## Resumen {#overview}

A tus manejadores de eventos se les pasarán instancias de `SyntheticEvent`, un contenedor agnóstico al navegador alrededor del evento nativo del navegador. Tiene la misma interfaz que el evento nativo del navegador, incluyendo `stopPropagation()` y `preventDefault()`, excepto que los eventos funcionan de manera idéntica en todos los navegadores.

Si encuentras que necesitas el evento del navegador subyacente por alguna razón, simplemente use el atributo `nativeEvent` para obtenerlo. Los eventos sintéticos son diferentes y no tienen una correspondencia directa con los eventos nativos del navegador. Por ejemplo en `onMouseLeave` `event.nativeEvent` apuntará al evento `mouseout`. La correspondencia específica no es parte de la API pública y puede cambiar en cualquier momento. Cada objeto `SyntheticEvent` tiene los siguientes atributos:

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
void persist()
DOMEventTarget target
number timeStamp
string type
```

> Nota:
>
> A partir de la versión 17, `e.persist()` no hace nada porque `SyntheticEvent` ya no se [reutiliza](/docs/legacy-event-pooling.html).

> Nota:
>
> A partir de la versión 0.14, devolver `false` desde un controlador de eventos ya no detendrá la propagación de eventos. En su lugar, `e.stopPropagation()` o `e.preventDefault()` deben activarse manualmente, según corresponda.

## Eventos Soportados {#supported-events}

React normaliza los eventos para que tengan propiedades consistentes en diferentes navegadores.

Los controladores de eventos a continuación se activan por un evento en la fase de propagación. Para registrar un controlador de eventos llamado en la fase de captura, agrega `Capture` al nombre del evento; por ejemplo, en lugar de usar `onClick`, usarías` onClickCapture` para manejar el evento de click en la fase de captura.

- [Eventos del Portapapeles](#clipboard-events)
- [Eventos de Composición](#composition-events)
- [Eventos del Teclado](#keyboard-events)
- [Eventos de Enfoque](#focus-events)
- [Eventos de Formulario](#form-events)
- [Eventos genéricos](#generic-events)
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

## Referencia {#reference}

### Eventos del Portapapeles {#clipboard-events}

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

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

El manejador de evento `onFocus` se llama cuando el elemento (o algún elemento dentro de él) recibe el foco. Por ejemplo, se llama cuando el usuario hace clic en una entrad de texto.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

El manejador de evento `onBlur` se llama cuando el foco ha dejado el elemento (o ha dejado algún elemento dentro de él). Por ejemplo, se llama cuando el usuario hace clic fuera de una entrada de texto que tiene el foco.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detectar la entrada y salida del foco {#detecting-focus-entering-and-leaving}

Puedes usar `currentTarget` y `relatedTarget` para diferenciar si los eventos de foco y pérdida de foco se originan desde _fuera_ del elemento padre. Aquí hay una demo que puedes copiar y pegar que muestra como detectar el foco en un hijo, el foco sobre el propio elemento y cuando el foco entra o sale de todo el subárbol.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```

* * *

### Eventos de Formulario {#form-events}

Nombres de Eventos:

```
onChange onInput onInvalid onReset onSubmit 
```

Para obtener más información sobre el evento onChange, consulte [Formularios](/docs/forms.html).

* * *

### Eventos genéricos {#generic-events}

Nombres de eventos:

```
onError onLoad
```

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

Los eventos de puntero aún no son compatibles con todos los navegadores (en el momento de escritura de este artículo, los navegadores compatibles incluyen: Chrome, Firefox, Edge e Internet Explorer). React no admite *polyfills* deliberadamente para otros navegadores, ya que un *polyfill* de conformidad estándar aumentaría significativamente el tamaño del paquete de `react-dom`.

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

>Nota
>
>A partir de React 17, el event `onScroll` **no hace _bubbling_** en React. Esto se alinea con el comportamiento del navegador y previene confusiones cuando un elemento anidado con _scroll_ dispara eventos en un padre distante.

Properties:

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
