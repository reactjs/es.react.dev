---
title: preinitModule
---

<Note>

[Los frameworks basados en React](/learn/start-a-new-react-project) con frecuencia manejan la carga de recursos por ti, por lo que es posible que no necesites llamar a esta API tú mismo. Consulta la documentación de tu framework para más detalles.

</Note>

<Intro>

`preinitModule` te permite precargar y evaluar de forma anticipada un módulo ESM.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

Para preinicializar un módulo ESM, llama a la función `preinitModule` de `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Ver más ejemplos abajo.](#usage)

La función `preinitModule` proporciona al navegador una señal de que debería comenzar a descargar y ejecutar el módulo dado, lo cual puede ahorrar tiempo. Los módulos que preinicializas se ejecutan cuando terminan de descargarse.

#### Parámetros {/*parameters*/}

* `href`: un string. La URL del módulo que deseas descargar y ejecutar.
* `options`: un objeto. Contiene las siguientes propiedades:
  *  `as`: un string requerido. Debe ser `'script'`.
  *  `crossOrigin`: un string. La [política de CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a utilizar. Sus valores posibles son `anonymous` y `use-credentials`.
  *  `integrity`: un string. Un hash criptográfico del módulo, para [verificar su autenticidad](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: un string. Un [nonce criptográfico para permitir el módulo](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) cuando se utiliza una Política de Seguridad de Contenido estricta.

#### Devuelve {/*returns*/}

`preinitModule` no devuelve nada.

#### Advertencias {/*caveats*/}

* Múltiples llamadas a `preinitModule` con el mismo `href` tienen el mismo efecto que una sola llamada.
* En el navegador, puedes llamar a `preinitModule` en cualquier situación: mientras renderizas un componente, en un Efecto, en un manejador de eventos, etc.
* En el renderizado del lado del servidor o al renderizar Componentes de Servidor, `preinitModule` solo tiene efecto si lo llamas mientras renderizas un componente o en un contexto asíncrono que se origina a partir del renderizado de un componente. Cualquier otra llamada será ignorada.

---

## Uso {/*usage*/}

### Precarga durante el renderizado {/*preloading-when-rendering*/}

Llama a `preinitModule` al renderizar un componente si sabes que el componente o sus hijos utilizarán un módulo específico y estás de acuerdo con que el módulo sea evaluado y, por lo tanto, surta efecto inmediatamente después de descargarse.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Si deseas que el navegador descargue el módulo pero no lo ejecute de inmediato, usa [`preloadModule`](/reference/react-dom/preloadModule) en su lugar. Si deseas preinicializar un script que no es un módulo ESM, usa [`preinit`](/reference/react-dom/preinit).

### Precarga en un manejador de eventos {/*preloading-in-an-event-handler*/}

Llama a `preinitModule` en un manejador de eventos antes de hacer la transición a una página o estado donde el módulo será necesario. Esto inicia el proceso antes que si lo llamaras durante el renderizado de la nueva página o estado.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
