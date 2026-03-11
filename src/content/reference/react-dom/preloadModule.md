---
title: preloadModule
---

<Note>

[Los frameworks basados en React](/learn/start-a-new-react-project) con frecuencia manejan la carga de recursos por ti, por lo que es posible que no necesites llamar a esta API tú mismo. Consulta la documentación de tu framework para más detalles.

</Note>

<Intro>

`preloadModule` te permite precargar de forma anticipada un módulo ESM que esperas utilizar.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

Para precargar un módulo ESM, llama a la función `preloadModule` de `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Ver más ejemplos abajo.](#usage)

La función `preloadModule` proporciona al navegador una señal de que debería comenzar a descargar el módulo dado, lo cual puede ahorrar tiempo.

#### Parámetros {/*parameters*/}

* `href`: un string. La URL del módulo que deseas descargar.
* `options`: un objeto. Contiene las siguientes propiedades:
  *  `as`: un string requerido. Debe ser `'script'`.
  *  `crossOrigin`: un string. La [política de CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a utilizar. Sus valores posibles son `anonymous` y `use-credentials`.
  *  `integrity`: un string. Un hash criptográfico del módulo, para [verificar su autenticidad](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: un string. Un [nonce criptográfico para permitir el módulo](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) cuando se utiliza una Política de Seguridad de Contenido estricta.


#### Devuelve {/*returns*/}

`preloadModule` no devuelve nada.

#### Advertencias {/*caveats*/}

* Múltiples llamadas a `preloadModule` con el mismo `href` tienen el mismo efecto que una sola llamada.
* En el navegador, puedes llamar a `preloadModule` en cualquier situación: mientras renderizas un componente, en un Efecto, en un manejador de eventos, etc.
* En el renderizado del lado del servidor o al renderizar Componentes de Servidor, `preloadModule` solo tiene efecto si lo llamas mientras renderizas un componente o en un contexto asíncrono que se origina a partir del renderizado de un componente. Cualquier otra llamada será ignorada.

---

## Uso {/*usage*/}

### Precarga durante el renderizado {/*preloading-when-rendering*/}

Llama a `preloadModule` al renderizar un componente si sabes que el componente o sus hijos utilizarán un módulo específico.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Si deseas que el navegador comience a ejecutar el módulo de inmediato (en lugar de solo descargarlo), usa [`preinitModule`](/reference/react-dom/preinitModule) en su lugar. Si deseas cargar un script que no es un módulo ESM, usa [`preload`](/reference/react-dom/preload).

### Precarga en un manejador de eventos {/*preloading-in-an-event-handler*/}

Llama a `preloadModule` en un manejador de eventos antes de hacer la transición a una página o estado donde el módulo será necesario. Esto inicia el proceso antes que si lo llamaras durante el renderizado de la nueva página o estado.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
