---
title: PureComponent
---

<Pitfall>

<<<<<<< HEAD:beta/src/content/reference/react/PureComponent.md
Recomendamos definir los componentes como funciones en lugar de clases. [Ver cómo migrar.](#alternatives)
=======
We recommend defining components as functions instead of classes. [See how to migrate.](#alternatives)
>>>>>>> e5fd79cdbb296b87cab7dff17c3b7feee5dba96b:src/content/reference/react/PureComponent.md

</Pitfall>

<Intro>

`PureComponent` es parecido a [`Component`](/reference/react/Component) pero se salta los rerenderizados para las mismas props y estado. Los componentes de clase todavía son compatibles con React, pero no recomendamos usarlos en código nuevo.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>¡Hola, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Referencia {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Para omitir volver a renderizar un componente de clase para las mismas props y estado, extiende `PureComponent` en lugar de [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>¡Hola, {this.props.name}!</h1>;
  }
}
```

`PureComponent` es una subclase de `Component` y admite [todas las APIs de `Component`.](/reference/react/Component#reference) Extender `PureComponent` es equivalente a definir un método personalizado [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) que compara superficialmente las props y el estado.


[Ve más ejemplos debajo.](#usage)

---

## Uso {/*usage*/}

### Omitir renderizados innecesarios para componentes de clase {/*skipping-unnecessary-re-renders-for-class-components*/}

React normalmente rerenderiza un componente cada vez que su padre se rerenderiza. Como optimización, puedes crear un componente que React no rerenderizará cuando su padre se renderice, siempre que sus props y estado nuevos sean los mismos que los anteriores. [Los componentes de clase](/reference/react/Component) pueden optar por este comportamiento extendiendo `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>¡Hola, {this.props.name}!</h1>;
  }
}
```

Un componente de React siempre debe tener [lógica de renderizado pura.](/learn/keeping-components-pure) Esto significa que debe devolver el mismo resultado si sus props, estado y contexto no han cambiado. Al usar `PureComponent`, le estás diciendo a React que tu componente cumple con este requisito, por lo que React no necesita volver a renderizar siempre que sus props y estado no hayan cambiado. Sin embargo, tu componente aún se rerenderizará si cambia un contexto que esté usando.

En este ejemplo, observa que el componente `Greeting` se vuelve a renderizar cada vez que se cambia `name` (porque es una de sus props), pero no cuando se cambia `address` (porque no se pasa a `Greeting` como prop):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting se renderizó a las", new Date().toLocaleTimeString());
    return <h3>Hola{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nombre{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Dirección{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

<<<<<<< HEAD:beta/src/content/reference/react/PureComponent.md
Recomendamos definir los componentes como funciones en lugar de clases. [Ver cómo migrar.](#alternatives)
=======
We recommend defining components as functions instead of classes. [See how to migrate.](#alternatives)
>>>>>>> e5fd79cdbb296b87cab7dff17c3b7feee5dba96b:src/content/reference/react/PureComponent.md

</Pitfall>

---

## Alternativas {/*alternatives*/}

### Migración de un componente de clase `PureComponent` a una función {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

<<<<<<< HEAD:beta/src/content/reference/react/PureComponent.md
Recomendamos usar componentes de función en lugar de [componentes de clase](/reference/react/Component) en código nuevo. Si tienes algunos componentes de clase existentes que usan `PureComponent`, te mostramos como puedes convertirlos. Este es el código original:
=======
We recommend using function components instead of [class components](/reference/react/Component) in new code. If you have some existing class components using `PureComponent`, here is how you can convert them. This is the original code:
>>>>>>> e5fd79cdbb296b87cab7dff17c3b7feee5dba96b:src/content/reference/react/PureComponent.md

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting se renderizó a las", new Date().toLocaleTimeString());
    return <h3>¡Hola{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nombre{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Dirección{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Al [convertir este componente de una clase a una función,](/reference/react/Component#alternatives) envuélvelo en [`memo`:](/reference/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting se renderizó a las", new Date().toLocaleTimeString());
  return <h3>¡Hola{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nombre{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Dirección{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

A diferencia de `PureComponent`, [`memo`](/reference/react/memo) no compara el nuevo y el viejo estado. En los componentes de función, al llamar a la [función `set`](/reference/react/useState#setstate) con el mismo estado [ya se evita el rerenderizado de forma predeterminada,](/reference/react/memo#updating-a-memoized-component-using-state) incluso sin `memo`.

</Note>
