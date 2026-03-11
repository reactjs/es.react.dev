---
title: act
---

<Intro>

`act` es un auxiliar de pruebas para aplicar actualizaciones pendientes de React antes de realizar aserciones.

```js
await act(async actFn)
```

</Intro>

Para preparar un componente para las aserciones, envuelve el código que lo renderiza y realiza actualizaciones dentro de una llamada a `await act()`. Esto hace que tu prueba se ejecute de forma más parecida a cómo funciona React en el navegador.

<Note>
Puede que encuentres que usar `act()` directamente es un poco verboso. Para evitar algo del código repetitivo, podrías usar una biblioteca como [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), cuyos auxiliares están envueltos con `act()`.
</Note>


<InlineToc />

---

## Referencia {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

Al escribir pruebas de UI, tareas como el renderizado, eventos del usuario o la obtención de datos pueden considerarse como "unidades" de interacción con una interfaz de usuario. React proporciona un auxiliar llamado `act()` que se asegura de que todas las actualizaciones relacionadas con estas "unidades" hayan sido procesadas y aplicadas al DOM antes de realizar cualquier aserción.

El nombre `act` proviene del patrón [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert) (Organizar-Actuar-Afirmar).

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

Recomendamos usar `act` con `await` y una función `async`. Aunque la versión síncrona funciona en muchos casos, no funciona en todos y debido a la forma en que React programa las actualizaciones internamente, es difícil predecir cuándo puedes usar la versión síncrona.

Deprecaremos y eliminaremos la versión síncrona en el futuro.

</Note>

#### Parámetros {/*parameters*/}

* `async actFn`: Una función asíncrona que envuelve renderizados o interacciones para los componentes que se están probando. Cualquier actualización disparada dentro de `actFn` se agrega a una cola interna de act, que luego se procesan juntas para aplicar cualquier cambio al DOM. Dado que es asíncrona, React también ejecutará cualquier código que cruce un límite asíncrono y vaciará cualquier actualización programada.

#### Retorno {/*returns*/}

`act` no devuelve nada.

## Uso {/*usage*/}

Al probar un componente, puedes usar `act` para realizar aserciones sobre su salida.

Por ejemplo, supongamos que tenemos este componente `Counter`, los ejemplos de uso a continuación muestran cómo probarlo:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### Renderizar componentes en pruebas {/*rendering-components-in-tests*/}

Para probar la salida del renderizado de un componente, envuelve el renderizado dentro de `act()`:

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  
  // ✅ Renderiza el componente dentro de act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

Aquí, creamos un contenedor, lo añadimos al documento y renderizamos el componente `Counter` dentro de `act()`. Esto asegura que el componente se renderice y sus efectos se apliquen antes de realizar las aserciones.

Usar `act` asegura que todas las actualizaciones se hayan aplicado antes de realizar las aserciones.

### Despachar eventos en pruebas {/*dispatching-events-in-tests*/}

Para probar eventos, envuelve el despacho del evento dentro de `act()`:

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  // ✅ Despacha el evento dentro de act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

Aquí, renderizamos el componente con `act` y luego despachamos el evento dentro de otro `act()`. Esto asegura que todas las actualizaciones del evento se apliquen antes de realizar las aserciones.

<Pitfall>

No olvides que despachar eventos del DOM solo funciona cuando el contenedor del DOM se ha añadido al documento. Puedes usar una biblioteca como [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) para reducir el código repetitivo.

</Pitfall>

## Solución de problemas {/*troubleshooting*/}

### Recibo un error: "The current testing environment is not configured to support act"(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

Usar `act` requiere configurar `global.IS_REACT_ACT_ENVIRONMENT=true` en tu entorno de pruebas. Esto es para asegurar que `act` solo se use en el entorno correcto.

Si no configuras la variable global, verás un error como este:

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

Para solucionarlo, añade esto a tu archivo de configuración global para las pruebas de React:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

En frameworks de pruebas como [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), `IS_REACT_ACT_ENVIRONMENT` ya está configurado por ti.

</Note>
