---
title: preload
---

<Note>

Los [frameworks basados en React](/learn/start-a-new-react-project) frecuentemente manejan la carga de recursos por ti, por lo que es posible que no necesites llamar a esta API tú mismo. Consulta la documentación de tu framework para más detalles.

</Note>

<Intro>

`preload` te permite obtener anticipadamente un recurso como una hoja de estilos, fuente o script externo que esperas utilizar.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `preload(href, options)` {/*preload*/}

Para precargar un recurso, llama a la función `preload` de `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[Ver más ejemplos a continuación.](#usage)

La función `preload` proporciona al navegador una sugerencia de que debería comenzar a descargar el recurso dado, lo cual puede ahorrar tiempo.

#### Parámetros {/*parameters*/}

* `href`: una cadena. La URL del recurso que deseas descargar.
* `options`: un objeto. Contiene las siguientes propiedades:
  *  `as`: una cadena requerida. El tipo de recurso. Sus [valores posibles](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) son `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
  *  `crossOrigin`: una cadena. La [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a utilizar. Sus valores posibles son `anonymous` y `use-credentials`. Es requerida cuando `as` está configurado como `"fetch"`.
  *  `referrerPolicy`: una cadena. El [header Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) a enviar al obtener el recurso. Sus valores posibles son `no-referrer-when-downgrade` (el predeterminado), `no-referrer`, `origin`, `origin-when-cross-origin` y `unsafe-url`.
  *  `integrity`: una cadena. Un hash criptográfico del recurso, para [verificar su autenticidad](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `type`: una cadena. El tipo MIME del recurso.
  *  `nonce`: una cadena. Un [nonce criptográfico para permitir el recurso](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) al usar una Política de Seguridad de Contenido estricta.
  *  `fetchPriority`: una cadena. Sugiere una prioridad relativa para obtener el recurso. Los valores posibles son `auto` (el predeterminado), `high` y `low`.
  *  `imageSrcSet`: una cadena. Para uso exclusivo con `as: "image"`. Especifica el [conjunto de fuentes de la imagen](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  *  `imageSizes`: una cadena. Para uso exclusivo con `as: "image"`. Especifica los [tamaños de la imagen](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### Devuelve {/*returns*/}

`preload` no devuelve nada.

#### Advertencias {/*caveats*/}

* Múltiples llamadas equivalentes a `preload` tienen el mismo efecto que una sola llamada. Las llamadas a `preload` se consideran equivalentes según las siguientes reglas:
  * Dos llamadas son equivalentes si tienen el mismo `href`, excepto:
  * Si `as` está configurado como `image`, dos llamadas son equivalentes si tienen el mismo `href`, `imageSrcSet` e `imageSizes`.
* En el navegador, puedes llamar a `preload` en cualquier situación: mientras renderizas un componente, en un Efecto, en un controlador de eventos, y así sucesivamente.
* En el renderizado del lado del servidor o al renderizar Componentes de Servidor, `preload` solo tiene efecto si lo llamas mientras renderizas un componente o en un contexto asíncrono que se origina al renderizar un componente. Cualquier otra llamada será ignorada.

---

## Uso {/*usage*/}

### Precarga al renderizar {/*preloading-when-rendering*/}

Llama a `preload` al renderizar un componente si sabes que él o sus hijos usarán un recurso específico.

<Recipes titleText="Ejemplos de precarga">

#### Precargar un script externo {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Si quieres que el navegador comience a ejecutar el script inmediatamente (en lugar de solo descargarlo), usa [`preinit`](/reference/react-dom/preinit) en su lugar. Si quieres cargar un módulo ESM, usa [`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### Precargar una hoja de estilos {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

Si quieres que la hoja de estilos se inserte en el documento inmediatamente (lo que significa que el navegador comenzará a analizarla de inmediato en lugar de solo descargarla), usa [`preinit`](/reference/react-dom/preinit) en su lugar.

<Solution />

#### Precargar una fuente {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

Si precargas una hoja de estilos, es buena idea también precargar las fuentes a las que hace referencia la hoja de estilos. De esa manera, el navegador puede comenzar a descargar la fuente antes de haber descargado y analizado la hoja de estilos.

<Solution />

#### Precargar una imagen {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

Al precargar una imagen, las opciones `imageSrcSet` e `imageSizes` ayudan al navegador a [obtener la imagen del tamaño correcto para el tamaño de la pantalla](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### Precarga en un controlador de eventos {/*preloading-in-an-event-handler*/}

Llama a `preload` en un controlador de eventos antes de hacer la transición a una página o estado donde se necesitarán recursos externos. Esto inicia el proceso antes que si lo llamas durante el renderizado de la nueva página o estado.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
