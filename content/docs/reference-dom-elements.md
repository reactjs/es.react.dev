---
id: dom-elements
title: Elementos DOM
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

En React, todas las propiedades y atributos (incluidos los manejadores de eventos) deben escribirse en estilo *camelCase*. Por ejemplo, el atributo HTML `tabindex` corresponde al atributo `tabIndex` en React. Los atributos tipo `aria-*` y `data-*` son la excepción y deben escribirse en minúsculas. Por ejemplo, `aria-label` en HTML también es `aria-label` en React.

## Diferencias en los atributos {#differences-in-attributes}

Hay una serie de atributos HTML que funcionan de manera diferente en React.

### checked {#checked}

El atributo `checked` es compatible con los componentes `<input>` tipo `checkbox` o `radio`. Lo puedes usar para establecer si el componente está marcado. Esto es útil para construir componentes controlados. `defaultChecked` es el equivalente no controlado; solo establece si el componente está marcado cuando se monta por primera vez.

### className {#classname}

Para especificar una clase CSS, usa el atributo `className`. Esto aplica a todos los elementos regulares de DOM y SVG como `<div>`, `<a>`, y otros.

Si usas React con Web Components (lo cual no es común), usa el atributo `class` en lugar de `className`.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

En React, `dangerouslySetInnerHTML` es el atributo que reemplaza a `innerHTML` (propiedad DOM). Significa "establecer HTML interno peligrosamente". En general, es riesgoso establecer contenido HTML desde el código, porque puedes exponer inadvertidamente a tus usuarios a un ataque [*cross-site scripting* (XSS)](https://es.wikipedia.org/wiki/Cross-site_scripting). Por lo tanto, para establecer contenido HTML directamente desde React, debes usar el atributo `dangerouslySetInnerHTML` y pasarle un objeto con una propiedad `__html`, como recordatorio de que es peligroso. Por ejemplo:

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

Ya que `for` es una palabra reservada en Javascript, los elementos de React usan el atributo `htmlFor` en su lugar.

### onChange {#onchange}

El evento `onChange` se comporta según lo esperado: cuando el campo de un formulario cambia, se lanza el evento. No usamos intencionalmente el comportamiento existente en los navegadores, porque `onChange` no es un nombre adecuado para lo que hace y React depende de este evento para manejar la entrada del usuario en tiempo real.

### selected {#selected}

El atributo `selected` es compatible con los componentes tipo `<option>`. Puedes usarlo para establecer si el elemento está seleccionado, lo cual es útil para construir componentes controlados.

### style {#style}

>Nota
>
>Algunos ejemplos en la documentación usan el atributo `style` por conveniencia, pero **generalmente no se recomienda usar el atributo `style` como medio principal para estilizar elementos**. En la mayoría de los casos, [`className`](#classname) debe ser usado para hacer referencia a clases definidas en documentos CSS externos. En React, el atributo `style` se usa con mayor frecuencia para añadir estilos calculados dinámicamente al momento de renderización. Revisa también [Preguntas Frecuentes: Estilo y CSS](/docs/faq-styling.html).

El atributo `style` acepta un objeto de Javascript con propiedades escritas en formato *camelCase*, en lugar de un *string* CSS. Esto es consistente con la propiedad DOM `style` en Javascript, es más eficiente y previene vulnerabilidades XSS. Por ejemplo:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

Ten en cuenta que estos estilos no reciben automáticamente los prefijos de compatibilidad. Para ser compatible con navegadores antiguos, debes proveer las propiedades correspondientes:

```js
const divStyle = {
  WebkitTransition: 'all', // nota la 'W' mayúscula aquí 
  msTransition: 'all' // 'ms' es el único prefijo de proveedor de navegador en minúscula
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

Las propiedades del objeto aceptado por `style` tienen formato camelCase para ser consistentes con la forma en que se accede a los estilos de los nodos DOM en JS (p.ej `node.style.backgroundImage`). Los prefijos de compatibilidad, [a excepción de `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/), deben iniciarse con letra mayúscula. Por esto `WebkitTransition` tiene una "W" mayúscula. 

React adjuntará automáticamente el sufijo "px" a ciertas propiedades numéricas. Si quieres usar unidades diferentes a "px", especifica el valor como un *string* con la unidad deseada. Por ejemplo: 

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

Sin embargo, no todas las propiedades numéricas del objeto `style` son convertidas a *strings* con píxeles. Ciertas propiedades se mantienen sin unidad (p.ej `zoom`, `order`, `flex`). Una lista completa de las propiedades sin unidad puede verse [aquí](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Normalmente, hay una advertencia cuando un elemento con hijos también se marca como `contentEditable`, porque no funcionará. Este atributo suprime esa advertencia. No lo uses a menos que estés construyendo una biblioteca como [Draft.js](https://facebook.github.io/draft-js/) que administra `contentEditable` manualmente.

### suppressHydrationWarning {#suppresshydrationwarning}

Si usas renderización de React del lado del servidor, normalmente hay una advertencia cuando el servidor y el cliente presentan contenido diferente. Sin embargo, en algunos casos raros, es muy difícil o imposible garantizar una coincidencia exacta. Por ejemplo, se espera que las marcas de tiempo difieran en el servidor y en el cliente. 

Si estableces `suppressHydrationWarning` como `true`, React no te advertirá sobre los desajustes en los atributos y el contenido de ese elemento. Solo funciona a un nivel de profundidad y está diseñado para ser utilizado como una vía de escape. No lo uses en exceso. Puedes leer más sobre hidratación en la [documentación de `ReactDOM.hydrate()`](/docs/react-dom.html#hydrate).

### value {#value}

El atributo `value` es compatible con los componentes` <input> `y` <textarea> `. Puedes usarlo para establecer el valor del componente. Esto es útil para construir componentes controlados. `defaultValue` es el equivalente no controlado, que establece el valor del componente cuando se monta por primera vez.

## Todos los atributos HTML admitidos {#all-supported-html-attributes}

A partir de React 16, se admite cualquier atributo de DOM estándar [o personalizado](/blog/2017/09/08/dom-attributes-in-react-16.html).

React siempre ha proporcionado una API para el DOM centrada en JavaScript. Dado que los componentes de React a menudo reciben tanto props personalizados como props relacionados con el DOM, React utiliza la convención `camelCase` igual que las APIs del DOM:

```js
<div tabIndex="-1" />      // Como la API del DOM node.tabIndex
<div className="Button" /> // Como la API del DOM node.className
<input readOnly={true} />  // Como la API del DOM node.readOnly
```
Estos props funcionan de manera similar a sus atributos HTML correspondientes, con la excepción de los casos especiales documentados anteriormente.

Algunos de los atributos DOM admitidos por React son:

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

Similarmente, se admiten todos los atributos SVG: 


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

También puedes usar atributos personalizados siempre que estén completamente en minúsculas.
