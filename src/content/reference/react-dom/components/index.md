---
title: "Componentes de React DOM"
---

<Intro>

React admite todos los componentes [HTML](https://developer.mozilla.org/es/docs/Web/HTML/Element) y [SVG](https://developer.mozilla.org/es/docs/Web/SVG/Element) integrados en el navegador.

</Intro>

---

## Componentes comunes {/*common-components*/}

Todos los componentes integrados en el navegador admiten algunas props y eventos.

* [Componentes comunes (ej. `<div>`)](/reference/react-dom/components/common)

Esto incluye props específicos de React como `ref` y `dangerouslySetInnerHTML`.

---

## Componentes de formulario {/*form-components*/}

Estos componentes integrados en el navegador aceptan la entrada del usuario:

* [`<input>`](/reference/react-dom/components/input)
* [`<select>`](/reference/react-dom/components/select)
* [`<textarea>`](/reference/react-dom/components/textarea)

Son especiales en React porque pasando el prop `value` los hace *[controlados.](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)*

---

## Todos los componentes HTML {/*all-html-components*/}

React admite todos los componentes HTML integrados en el navegador. Esto incluye:

* [`<aside>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/aside)
* [`<audio>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/audio)
* [`<b>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/b)
* [`<base>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/base)
* [`<bdi>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/bdi)
* [`<bdo>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/bdo)
* [`<blockquote>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/blockquote)
* [`<body>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/body)
* [`<br>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/br)
* [`<button>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/button)
* [`<canvas>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/canvas)
* [`<caption>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/caption)
* [`<cite>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/cite)
* [`<code>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/code)
* [`<col>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/col)
* [`<colgroup>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/colgroup)
* [`<data>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/data)
* [`<datalist>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/datalist)
* [`<dd>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/dd)
* [`<del>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/del)
* [`<details>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/details)
* [`<dfn>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/dfn)
* [`<dialog>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/dialog)
* [`<div>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/div)
* [`<dl>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/dl)
* [`<dt>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/dt)
* [`<em>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/em)
* [`<embed>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/embed)
* [`<fieldset>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/fieldset)
* [`<figcaption>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/figcaption)
* [`<figure>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/figure)
* [`<footer>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/footer)
* [`<form>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/form)
* [`<h1>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/Heading_Elements)
* [`<head>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/head)
* [`<header>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/header)
* [`<hgroup>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/hgroup)
* [`<hr>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/hr)
* [`<html>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/html)
* [`<i>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/i)
* [`<iframe>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/iframe)
* [`<img>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/img)
* [`<input>`](/reference/react-dom/components/input)
* [`<ins>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/ins)
* [`<kbd>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/kbd)
* [`<label>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/label)
* [`<legend>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/legend)
* [`<li>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/li)
* [`<link>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/link)
* [`<main>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/main)
* [`<map>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/map)
* [`<mark>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/mark)
* [`<menu>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/menu)
* [`<meta>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/meta)
* [`<meter>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter)
* [`<nav>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/nav)
* [`<noscript>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/noscript)
* [`<object>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/object)
* [`<ol>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/ol)
* [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup)
* [`<option>`](/reference/react-dom/components/option)
* [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)
* [`<p>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/p)
* [`<picture>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/picture)
* [`<pre>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/pre)
* [`<progress>`](/reference/react-dom/components/progress)
* [`<q>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/q)
* [`<rp>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp)
* [`<rt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt)
* [`<ruby>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby)
* [`<s>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/s)
* [`<samp>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/samp)
* [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
* [`<section>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/section)
* [`<select>`](/reference/react-dom/components/select)
* [`<slot>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/slot)
* [`<small>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/small)
* [`<source>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/source)
* [`<span>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/span)
* [`<strong>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/strong)
* [`<style>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/style)
* [`<sub>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/sub)
* [`<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary)
* [`<sup>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/sup)
* [`<table>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/table)
* [`<tbody>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody)
* [`<td>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/td)
* [`<template>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/template)
* [`<textarea>`](/reference/react-dom/components/textarea)
* [`<tfoot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot)
* [`<th>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/th)
* [`<thead>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead)
* [`<time>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/time)
* [`<title>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/title)
* [`<tr>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/tr)
* [`<track>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/track)
* [`<u>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/u)
* [`<ul>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/ul)
* [`<var>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/var)
* [`<video>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/video)
* [`<wbr>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/wbr)

<Note>

Similar al [estándar DOM,](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model) React usa la convención `camelCase` para los nombres de las props. Por ejemplo, escribirás `tabIndex` en lugar de `tabindex`. Puedes convertir HTML existente a JSX con un [convertidor en línea.](https://transform.tools/html-to-jsx)

</Note>

---

### Elementos HTML personalizados {/*custom-html-elements*/}

Si renderizas una etiqueta con un guión, como `<my-element>`, React asumirá que quieres renderizar un [elemento HTML personalizado.](https://developer.mozilla.org/es/docs/Web/Web_Components/Using_custom_elements) En React, el renderizado de elementos personalizados funciona de manera diferente desde el renderizado de etiquetas integradas del navegador:

- Todas las props de los elementos personalizados son serializadas a strings y siempre se configuran usando atributos.

- Los elementos personalizados aceptan `class` en vez de `className`, y `for` en vez de `htmlFor`.

Si renderizas un elemento HTML integrado en el navegador con un atributo [`is`](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/is), también será tratado como un elemento personalizado.

<Note>

[Una versión futura de React incluirá un soporte más completo para elementos personalizados.](https://github.com/facebook/react/issues/11347#issuecomment-1122275286)

Puedes probar actualizando los paquetes de React a la versión experimental más reciente:

- `react@experimental`
- `react-dom@experimental`

Las versiones experimentales de React pueden contener errores. No las uses en producción.

</Note>
---

## Todos los componentes SVG {/*all-svg-components*/}

React admite todos los componentes SVG integrados en el navegador. Esto incluye:

* [`<a>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/a)
* [`<animate>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/animate)
* [`<animateMotion>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion)
* [`<animateTransform>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateTransform)
* [`<circle>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/circle)
* [`<clipPath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath)
* [`<defs>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs)
* [`<desc>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc)
* [`<discard>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/discard)
* [`<ellipse>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/ellipse)
* [`<feBlend>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feBlend)
* [`<feColorMatrix>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix)
* [`<feComponentTransfer>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComponentTransfer)
* [`<feComposite>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComposite)
* [`<feConvolveMatrix>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feConvolveMatrix)
* [`<feDiffuseLighting>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDiffuseLighting)
* [`<feDisplacementMap>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap)
* [`<feDistantLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDistantLight)
* [`<feDropShadow>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDropShadow)
* [`<feFlood>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFlood)
* [`<feFuncA>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncA)
* [`<feFuncB>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncB)
* [`<feFuncG>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncG)
* [`<feFuncR>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncR)
* [`<feGaussianBlur>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur)
* [`<feImage>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feImage)
* [`<feMerge>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMerge)
* [`<feMergeNode>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMergeNode)
* [`<feMorphology>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMorphology)
* [`<feOffset>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feOffset)
* [`<fePointLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/fePointLight)
* [`<feSpecularLighting>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpecularLighting)
* [`<feSpotLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpotLight)
* [`<feTile>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTile)
* [`<feTurbulence>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
* [`<filter>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter)
* [`<foreignObject>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject)
* [`<g>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/g)
* `<hatch>`
* `<hatchpath>`
* [`<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image)
* [`<line>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line)
* [`<linearGradient>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient)
* [`<marker>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker)
* [`<mask>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mask)
* [`<metadata>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/metadata)
* [`<mpath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mpath)
* [`<path>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path)
* [`<pattern>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/pattern)
* [`<polygon>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon)
* [`<polyline>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline)
* [`<radialGradient>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/radialGradient)
* [`<rect>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/rect)
* [`<script>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/script)
* [`<set>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/set)
* [`<stop>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop)
* [`<style>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/style)
* [`<svg>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/svg)
* [`<switch>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/switch)
* [`<symbol>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol)
* [`<text>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/text)
* [`<textPath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/textPath)
* [`<title>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)
* [`<tspan>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/tspan)
* [`<use>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/use)
* [`<view>`](https://developer.mozilla.org/es/docs/Web/SVG/Element/view)

<Note>

Similar al [estándar DOM,](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model) React usa la`camelCase` para los nombres de las props. Por ejemplo, escribirás `tabIndex` en lugar de `tabindex`. Puedes convertir SVG existente a JSX con un [convertidor en línea.](https://transform.tools/)

Los atributos de espacio de nombres también tienen que estar escritos sin los dos puntos:

* `xlink:actuate` se convierte en `xlinkActuate`.
* `xlink:arcrole` se convierte en `xlinkArcrole`.
* `xlink:href` se convierte en `xlinkHref`.
* `xlink:role` se convierte en `xlinkRole`.
* `xlink:show` se convierte en `xlinkShow`.
* `xlink:title` se convierte en `xlinkTitle`.
* `xlink:type` se convierte en `xlinkType`.
* `xml:base` se convierte en `xmlBase`.
* `xml:lang` se convierte en `xmlLang`.
* `xml:space` se convierte en `xmlSpace`.
* `xmlns:xlink` se convierte en `xmlnsXlink`.

</Note>
