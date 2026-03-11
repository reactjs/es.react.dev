---
title: prefetchDNS
---

<Intro>

`prefetchDNS` te permite buscar anticipadamente la IP de un servidor desde el cual esperas cargar recursos.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

Para buscar un host, llama a la función `prefetchDNS` de `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[Ver más ejemplos a continuación.](#usage)

La función `prefetchDNS` proporciona al navegador una sugerencia de que debería buscar la dirección IP de un servidor determinado. Si el navegador decide hacerlo, esto puede acelerar la carga de recursos desde ese servidor.

#### Parámetros {/*parameters*/}

* `href`: una cadena. La URL del servidor al que deseas conectarte.

#### Devuelve {/*returns*/}

`prefetchDNS` no devuelve nada.

#### Advertencias {/*caveats*/}

* Múltiples llamadas a `prefetchDNS` con el mismo servidor tienen el mismo efecto que una sola llamada.
* En el navegador, puedes llamar a `prefetchDNS` en cualquier situación: mientras renderizas un componente, en un Efecto, en un controlador de eventos, y así sucesivamente.
* En el renderizado del lado del servidor o al renderizar Componentes de Servidor, `prefetchDNS` solo tiene efecto si lo llamas mientras renderizas un componente o en un contexto asíncrono que se origina al renderizar un componente. Cualquier otra llamada será ignorada.
* Si conoces los recursos específicos que necesitarás, puedes llamar a [otras funciones](/reference/react-dom/#resource-preloading-apis) que comenzarán a cargar los recursos de inmediato.
* No hay beneficio en hacer prefetch del DNS del mismo servidor en el que está alojada la página web, porque ya se habrá buscado para cuando se dé la sugerencia.
* Comparado con [`preconnect`](/reference/react-dom/preconnect), `prefetchDNS` puede ser mejor si estás conectándote especulativamente a una gran cantidad de dominios, en cuyo caso la sobrecarga de las preconexiones podría superar el beneficio.

---

## Uso {/*usage*/}

### Prefetch de DNS al renderizar {/*prefetching-dns-when-rendering*/}

Llama a `prefetchDNS` al renderizar un componente si sabes que sus hijos cargarán recursos externos desde ese host.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### Prefetch de DNS en un controlador de eventos {/*prefetching-dns-in-an-event-handler*/}

Llama a `prefetchDNS` en un controlador de eventos antes de hacer la transición a una página o estado donde se necesitarán recursos externos. Esto inicia el proceso antes que si lo llamas durante el renderizado de la nueva página o estado.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
