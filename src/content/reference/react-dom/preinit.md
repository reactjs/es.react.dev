---
title: preinit
---

<Note>

<<<<<<< HEAD
Los [frameworks basados en React](/learn/start-a-new-react-project) frecuentemente manejan la carga de recursos por ti, por lo que es posible que no necesites llamar a esta API tú mismo. Consulta la documentación de tu framework para más detalles.
=======
[React-based frameworks](/learn/creating-a-react-app) frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework's documentation for details.
>>>>>>> 6be2b020a0cabf2fd6dbff5c42c399b8ac323bca

</Note>

<Intro>

`preinit` te permite obtener y evaluar anticipadamente una hoja de estilos o un script externo.

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

Para preinicializar un script o una hoja de estilos, llama a la función `preinit` de `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[Ver más ejemplos a continuación.](#usage)

La función `preinit` proporciona al navegador una sugerencia de que debería comenzar a descargar y ejecutar el recurso dado, lo cual puede ahorrar tiempo. Los scripts que preinicializas con `preinit` se ejecutan cuando terminan de descargarse. Las hojas de estilos que preinicializas se insertan en el documento, lo que hace que entren en efecto de inmediato.

#### Parámetros {/*parameters*/}

<<<<<<< HEAD
* `href`: una cadena. La URL del recurso que deseas descargar y ejecutar.
* `options`: un objeto. Contiene las siguientes propiedades:
  *  `as`: una cadena requerida. El tipo de recurso. Sus valores posibles son `script` y `style`.
  * `precedence`: una cadena. Requerida con hojas de estilos. Indica dónde insertar la hoja de estilos en relación con otras. Las hojas de estilos con mayor precedencia pueden anular las de menor precedencia. Los valores posibles son `reset`, `low`, `medium`, `high`.
  *  `crossOrigin`: una cadena. La [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a utilizar. Sus valores posibles son `anonymous` y `use-credentials`. Es requerida cuando `as` está configurado como `"fetch"`.
  *  `integrity`: una cadena. Un hash criptográfico del recurso, para [verificar su autenticidad](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: una cadena. Un [nonce criptográfico para permitir el recurso](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) al usar una Política de Seguridad de Contenido estricta.
  *  `fetchPriority`: una cadena. Sugiere una prioridad relativa para obtener el recurso. Los valores posibles son `auto` (el predeterminado), `high` y `low`.
=======
* `href`: a string. The URL of the resource you want to download and execute.
* `options`: an object. It contains the following properties:
  *  `as`: a required string. The type of resource. Its possible values are `script` and `style`.
  * `precedence`: a string. Required with stylesheets. Says where to insert the stylesheet relative to others. Stylesheets with higher precedence can override those with lower precedence. The possible values are `reset`, `low`, `medium`, `high`.
  *  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`.
  *  `integrity`: a string. A cryptographic hash of the resource, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: a string. A cryptographic [nonce to allow the resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy.
  *  `fetchPriority`: a string. Suggests a relative priority for fetching the resource. The possible values are `auto` (the default), `high`, and `low`.
>>>>>>> 6be2b020a0cabf2fd6dbff5c42c399b8ac323bca

#### Devuelve {/*returns*/}

`preinit` no devuelve nada.

#### Advertencias {/*caveats*/}

* Múltiples llamadas a `preinit` con el mismo `href` tienen el mismo efecto que una sola llamada.
* En el navegador, puedes llamar a `preinit` en cualquier situación: mientras renderizas un componente, en un Efecto, en un controlador de eventos, y así sucesivamente.
* En el renderizado del lado del servidor o al renderizar Componentes de Servidor, `preinit` solo tiene efecto si lo llamas mientras renderizas un componente o en un contexto asíncrono que se origina al renderizar un componente. Cualquier otra llamada será ignorada.

---

## Uso {/*usage*/}

### Preinicialización al renderizar {/*preiniting-when-rendering*/}

Llama a `preinit` al renderizar un componente si sabes que él o sus hijos usarán un recurso específico, y estás de acuerdo con que el recurso se evalúe y entre en efecto inmediatamente al descargarse.

<Recipes titleText="Ejemplos de preinicialización">

#### Preinicializar un script externo {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Si quieres que el navegador descargue el script pero no lo ejecute de inmediato, usa [`preload`](/reference/react-dom/preload) en su lugar. Si quieres cargar un módulo ESM, usa [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Preinicializar una hoja de estilos {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

La opción `precedence`, que es requerida, te permite controlar el orden de las hojas de estilos dentro del documento. Las hojas de estilos con mayor precedencia pueden anular las de menor precedencia.

Si quieres descargar la hoja de estilos pero no insertarla en el documento de inmediato, usa [`preload`](/reference/react-dom/preload) en su lugar.

<Solution />

</Recipes>

### Preinicialización en un controlador de eventos {/*preiniting-in-an-event-handler*/}

Llama a `preinit` en un controlador de eventos antes de hacer la transición a una página o estado donde se necesitarán recursos externos. Esto inicia el proceso antes que si lo llamas durante el renderizado de la nueva página o estado.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
