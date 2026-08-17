---
title: preconnect
---

<Intro>

`preconnect` te permite conectarte anticipadamente a un servidor desde el cual esperas cargar recursos.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

Para preconectarte a un host, llama a la función `preconnect` de `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[Ver más ejemplos a continuación.](#usage)

<<<<<<< HEAD
La función `preconnect` proporciona al navegador una sugerencia de que debería abrir una conexión al servidor dado. Si el navegador decide hacerlo, esto puede acelerar la carga de recursos desde ese servidor.
=======
The `preconnect` function provides the browser with a hint that it should open a connection to the given server. If the browser chooses to do so, this can speed up the loading of resources from that server.
>>>>>>> 383a1e9239c8c084a16a19daa4fc2a7ad04e2a3a

#### Parámetros {/*parameters*/}

* `href`: una cadena. La URL del servidor al que deseas conectarte.


#### Devuelve {/*returns*/}

`preconnect` no devuelve nada.

#### Advertencias {/*caveats*/}

* Múltiples llamadas a `preconnect` con el mismo servidor tienen el mismo efecto que una sola llamada.
* En el navegador, puedes llamar a `preconnect` en cualquier situación: mientras renderizas un componente, en un Efecto, en un controlador de eventos, y así sucesivamente.
* En el renderizado del lado del servidor o al renderizar Componentes de Servidor, `preconnect` solo tiene efecto si lo llamas mientras renderizas un componente o en un contexto asíncrono que se origina al renderizar un componente. Cualquier otra llamada será ignorada.
* Si conoces los recursos específicos que necesitarás, puedes llamar a [otras funciones](/reference/react-dom/#resource-preloading-apis) que comenzarán a cargar los recursos de inmediato.
* No hay beneficio en preconectarse al mismo servidor en el que está alojada la página web, porque ya se habrá conectado para cuando se dé la sugerencia.

---

## Uso {/*usage*/}

### Preconexión al renderizar {/*preconnecting-when-rendering*/}

Llama a `preconnect` al renderizar un componente si sabes que sus hijos cargarán recursos externos desde ese host.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Preconexión en un controlador de eventos {/*preconnecting-in-an-event-handler*/}

Llama a `preconnect` en un controlador de eventos antes de hacer la transición a una página o estado donde se necesitarán recursos externos. Esto inicia el proceso antes que si lo llamas durante el renderizado de la nueva página o estado.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
