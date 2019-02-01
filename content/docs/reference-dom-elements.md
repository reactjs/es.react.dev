---
id: dom-elements
title: DOM Elements
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React implementa un sistema DOM independiente del navegador, por motivos de rendimiento y compatibilidad entre navegadores. Esto nos dio la oportunidad de pulir algunos detalles en las implementaciones del DOM en el navegador.

En React, todas las propiedades y atributos (incluyendo manejadores de eventos) deben escribirse en estilo camelCase. Por ejemplo, el atributo HTML `tabindex` corresponde al atributo `tabIndex` en React. Los atributos tipo `aria-*` y `data-*` son la excepción y deben escribirse en minúsculas. Por ejemplo, `aria-label` en HTML también es `aria-label` en React.

## Diferencias en los Atributos

Hay una serie de atributos HTML que funcionan de manera diferente en React.

### checked

El atributo `checked` es compatible con los componentes `<input>` tipo `checkbox` o `radio`. Lo puedes usar para establecer si el componente está marcado. Esto es útil para construir componentes controlados. `defaultChecked` es el equivalente no controlado; solo establece si el componente está marcado cuando se monta por primera vez.

### className

Para especificar una clase CSS, usa el atributo `className`. Esto aplica a todos los elementos regulares de DOM y SVG como `<div>`, `<a>`, y otros.

Si usas React con Web Components (lo cual no es común), usa el atributo `class` en lugar de `className`.

### dangerouslySetInnerHTML

En React, `dangerouslySetInnerHTML` es el atributo que reemplaza a `innerHTML` (propiedad DOM). Significa "establecer HTML interno peligrosamente". En general, es riesgoso establecer contenido HTML desde tu código, directamente con texto plano, porque puedes exponer inadvertidamente a tus usuarios a un ataque [cross-site scripting (XSS)](https://es.wikipedia.org/wiki/Cross-site_scripting). 

Por lo tanto, para establecer contenido HTML directamente desde React, debes usar el atributo `dangerouslySetInnerHTML`, como recordatorio de que es peligroso. Este atributo acepta un objeto con una propiedad `__html`. Por ejemplo:

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor

Ya que `for` es una palabra reservada en Javascript, los elementos de React usan el atributo `htmlFor` en su lugar.

### onChange

En React, el atributo `onChange` recibe una función manejadora que se ejecuta cada vez que el contenido en un `<input>` cambia. Este comportamiento es, intencionalmente, distinto al del evento `onchange` del DOM, cuyo nombre no es el más adecuado. 

### selected

El atributo `selected` es compatible con los componentes tipo `<option>`. Puedes usarlo para establecer si el elemento está seleccionado, lo cual es útil para construir componentes controlados.

### style

>Nota
>
>Algunos ejemplos en la documentación usan el atributo `style` por conveniencia, pero **generalmente no se recomienda usar el atributo `style` como medio principal para estilizar elementos**. En la mayoría de los casos, [`className`](#classname) debe ser usado para hacer referencia a clases definidas en documentos CSS externos. En React, el atributo `style` se usa con mayor frecuencia para añadir estilos computados dinámicamente al momento de renderización. Revisa tambièn [FAQ: Styling and CSS](/docs/faq-styling.html).

El atributo `style` acepta un objeto de Javascript con propiedades escritas en formato camelCase, en lugar de un CSS string. Esto es consistente con la propiedad DOM `style` en Javascript, es más eficiente y previene vulnerabilidades XSS. Por ejemplo:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

Ten en cuenta que estos estilos no reciben automáticamente los prefijos de compatibilidad entre navegadores. Para soportar navegadores antiguos, debes proveer las propiedades correspondientes:

```js
const divStyle = {
  WebkitTransition: 'all', // nota la 'W' mayúscula aquí 
  msTransition: 'all' // 'ms' es el único prefijo de proveedor en minúscula
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```
Las propiedades del objeto aceptado por `style` tienen formato camelCase para ser consistentes con la forma en que se accede a los estilos de los nodos DOM en JS (p.ej `node.style.backgroundImage`). Los prefijos de los proveedores [a excepción de `ms`](http://www.andismith.com/blog/2012/02/modernizr-prefixed/) deben iniciarse con letra mayúscula. Por esto `WebkitTransition` tiene una "W" mayúscula. 

React adjuntará automáticamente el sufijo "px" a ciertas propiedades numéricas. Si quieres usar unidades diferentes a "px", especifica el valor como un string con la unidad deseada. Por ejemplo: 

```js
// Estilo resultante: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Estilo resultante: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

No todas las propiedades numéricas del objeto `style` son convertidas a strings con píxeles, sin embargo. Ciertas propiedades se mantienen sin unidad (p.ej `zoom`, `order`, `flex`). Una lista completa de las propiedades sin unidad puede verse [aquí](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning

Normally, there is a warning when an element with children is also marked as `contentEditable`, because it won't work. This attribute suppresses that warning. Don't use this unless you are building a library like [Draft.js](https://facebook.github.io/draft-js/) that manages `contentEditable` manually.

### suppressHydrationWarning

If you use server-side React rendering, normally there is a warning when the server and the client render different content. However, in some rare cases, it is very hard or impossible to guarantee an exact match. For example, timestamps are expected to differ on the server and on the client.

If you set `suppressHydrationWarning` to `true`, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don't overuse it. You can read more about hydration in the [`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate).

### value

The `value` attribute is supported by `<input>` and `<textarea>` components. You can use it to set the value of the component. This is useful for building controlled components. `defaultValue` is the uncontrolled equivalent, which sets the value of the component when it is first mounted.

## All Supported HTML Attributes

As of React 16, any standard [or custom](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM attributes are fully supported.

React has always provided a JavaScript-centric API to the DOM. Since React components often take both custom and DOM-related props, React uses the `camelCase` convention just like the DOM APIs:

```js
<div tabIndex="-1" />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
```

These props work similarly to the corresponding HTML attributes, with the exception of the special cases documented above.

Some of the DOM attributes supported by React include:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Similarly, all SVG attributes are fully supported:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

You may also use custom attributes as long as they're fully lowercase.
