---
id: testing-recipes
title: Recetas sobre pruebas
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

Patrones comunes de pruebas para componentes de React.

> Nota:
>
> Esta página asume que estás usando [Jest](https://jestjs.io/) como programa de ejecución de pruebas. Si estás usando uno distinto, puede que necesites ajustar la API, pero la forma general de la solución probablemente será la misma. Lee más detalles sobre como configurar un entorno de pruebas en la página de [Entornos de prueba](/docs/testing-environments.html).

En esta página utilizaremos principalmente componentes de función. Sin embargo, estas estrategias de prueba no dependen de detalles de implementación y funcionan igualmente en componentes de clase.

- [Configuración/limpieza](#setup--teardown)
- [`act()`](#act)
- [Renderizado](#rendering)
- [Obtención de datos](#data-fetching)
- [Simulación de módulos](#mocking-modules)
- [Eventos](#events)
- [Temporizadores](#timers)
- [Pruebas de instantánea](#snapshot-testing)
- [Múltiples renderizadores](#multiple-renderers)
- [¿Falta algo?](#something-missing)

---

### Configuración/limpieza {#setup--teardown}

Para cada prueba, usualmente queremos renderizar nuestro árbol de React en un elemento del DOM que esté asociado a `document`. Esto es importante para poder recibir eventos del DOM. Cuando la prueba termina, queremos "limpiar" y desmontar el árbol de `document`.

Una forma común de hacerlo es usar un par de bloques `beforeEach` y `afterEach` de manera tal que siempre ejecuten y separen los efectos de la prueba misma:

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // configurar un elemento del DOM como objetivo del renderizado
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpieza al salir
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

Puedes usar un patrón diferente, pero ten en cuenta que queremos ejecutar la limpieza _incluso si falla una prueba_. De otro modo, las pruebas pueden tener "fugas" y una prueba puede cambiar el comportamiento de otra prueba. Eso dificulta la tarea de depurarlas.

---

### `act()` {#act}

Cuando se escriben pruebas de interfaz de usuario, tareas como el renderizado, los eventos de usuario, o la obtención de datos pueden considerarse "unidades" de interacción con la interfaz de usuario. React proporciona una utilidad llamada `act()` que asegura que todas las actualizaciones relacionadas con estas "unidades" hayan sido procesadas y aplicadas al DOM antes de que hagas cualquier afirmación:

```js
act(() => {
  // renderizar componentes
});
// hacer afirmaciones
```

Esto ayuda a que tus pruebas se ejecutan de una manera más cercana a la experiencia de un usuario real que usa tu aplicación. El resto de estos ejemplos utilizan `act()` para asegurar estas garantías.

Utilizar `act()` directamente puede parecerte demasiado verboso. Para evitar algo de este código repetitivo, puedes usar una biblioteca como [React Testing Library](https://testing-library.com/react), cuyas utilidades están envueltas con `act()`.

> Nota:
>
> El nombre `act` viene del patrón [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert).

---

### Renderizado {#rendering}

Comúnmente, te gustaría probar si un componente se renderiza correctamente para unas props dadas. Considera un componente simple que renderiza un mensaje basado en una prop:

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

Podemos escribir una prueba para este componente:

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // configurar un elemento del DOM como objetivo del renderizado
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpieza al salir
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renderiza con o sin nombre", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### Obtención de datos {#data-fetching}

En lugar de llamar APIs reales en todas tus pruebas, puedes simular peticiones con datos falsos. Simular peticiones con datos "falsos" previene pruebas con resultados impredecibles debido a un _backend_ no disponible y permite ejecutarlas más rápidamente. Nota: aún puedes querer ejecutar un subconjunto de pruebas usando un framework de ["extremo a extremo"](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests) que te diga que toda tu aplicación está funcionando correctamente en su conjunto.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

Podemos escribir pruebas para este componente:

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // configurar un elemento del DOM como objetivo del renderizado
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpieza al salir
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renderiza datos de usuario", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Usa la versión asíncrona de act para aplicar promesas resueltas
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // elimina la simulación para asegurar que las pruebas estén completamente aisladas
  global.fetch.mockRestore();
});
```

---

### Simulación de módulos {#mocking-modules}

Algunos módulos puede que no funcionen bien dentro de un entorno de pruebas, o puede que no sean esenciales para la prueba misma. Simular estos módulos con reemplazos "de imitación" puede hacer más fácil la escritura de pruebas para tu propio código.

Considera un componente `Contacto` que incluye un componente `GoogleMap` de terceros:

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

Si no queremos cargar este componente en nuestras pruebas, podemos simular la dependencia misma como un componente simulado y correr nuestras pruebas:

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // configurar un elemento del DOM como objetivo del renderizado
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpieza al salir
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("debe renderizar información de contacto", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### Eventos {#events}

Recomendamos enviar eventos reales del DOM en elementos del DOM y luego hacer afirmaciones sobre el resultado. Considera el componente `Toggle`:

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

Podríamos escribir pruebas para este componente:

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // configurar un elemento del DOM como objetivo del renderizado
  container = document.createElement("div");
  // container *debe* estar asociado a document para que los eventos funcionen correctamente.
  document.body.appendChild(container);
});

afterEach(() => {
  // limpiar al salir
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("cambia el valor cuando se le hace clic", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // encuentra el elemento  del botón y dispara algunos clics en él
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

Diferentes eventos del DOM y sus propiedades se describen en [MDN](https://developer.mozilla.org/es/docs/Web/API/MouseEvent). Nota que necesitas pasar `{ bubbles: true }` en cada evento que creas para que llegue al agente de escucha (_listener_) de React, porque React automáticamente delega los eventos al documento.

> Nota:
>
> React Testing Library ofrece una [utilidad más concisa](https://testing-library.com/docs/dom-testing-library/api-events) para disparar eventos.

---

### Temporizadores {#timers}

Tu código puede usar funciones basadas en temporizadores como `setTimeout` para programar más trabajo en el futuro. En este ejemplo, un panel de selección múltiple espera por una selección y avanza, terminando si una selección no se ha hecho en 5 segundos:

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

Podemos escribir pruebas para este componente aprovechando las [simulaciones de temporizadores de Jest](https://jestjs.io/docs/en/timer-mocks), y probando los diferentes estados en que puede estar.

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // configurar un elemento del DOM como objetivo del renderizado
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpiar al salir
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("debe seleccionar null después de acabarse el tiempo", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // adelantarse 100ms en el tiempo
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // y luego adelantarse 5 segundos
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("debe limpiar al eliminarse", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // desmonta la aplicación
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("debe aceptar selecciones", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

Puedes escribir temporizadores falsos solo para algunas pruebas. Arriba, los habilitamos llamando a `jest.useFakeTimers()`. La mayor ventaja que proporcionan es que tu prueba no tiene que esperar realmente cinco segundos para ejecutarse, y tampoco hay necesidad de hacer el código del componente más complejo solo para probarlo.

---

### Pruebas de instantánea {#snapshot-testing}

Frameworks como Jest también permiten guardar "instantáneas" de los datos con [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). Con estas, podemos "guardar" el resultado del componente renderizado y asegurarnos que un cambio a él tiene que hacerse explícitamente como un cambio a la instantánea.

En este ejemplo, renderizamos un componente y formateamos el HTML renderizado con el paquete [`pretty`](https://www.npmjs.com/package/pretty), antes de guardarlo como una instantánea en línea:

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // configurar un elemento del DOM como objetivo del renderizado
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpiar al salir
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("debe renderizar un saludo", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... jest lo llena automáticamente ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... jest lo llena automáticamente ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... jest lo llena automáticamente ... */
});
```

Generalmente es mejor hacer afirmaciones más específicas que usar instantáneas. Este tipo de pruebas incluyen detalles de implementación, por lo que pueden romperse con facilidad y los equipos pueden desensibilizarse ante las fallas de las instantáneas. [Simular algunos componentes hijos](#mocking-modules) de manera selectiva puede ayudar a reducir el tamaño de las instantáneas y mantenerlas más legibles para las revisiones de código.

---

### Múltiples renderizadores {#multiple-renderers}

En casos poco comunes, puedes ejecutar una prueba en un componente que utiliza múltiples renderizadores. Por ejemplo, puedes ejecutar pruebas de instantánea en un componente con `react-test-renderer`, que internamente utiliza `ReactDOM.render` dentro de un componente hijo para renderizar algún contenido. En este escenario, puedes envolver las actualizaciones con los `act()`s correspondientes a sus renderizadores.

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### ¿Falta algo? {#something-missing}

Si algún escenario común no está cubierto, por favor, háznoslo saber en el [servicio de seguimiento de incidencias](https://github.com/reactjs/reactjs.org/issues) del sitio de la documentación.
