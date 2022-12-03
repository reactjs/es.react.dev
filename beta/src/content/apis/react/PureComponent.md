---
title: PureComponent
---

<Pitfall>

Recomendamos definir los componentes como funciones en lugar de clases. [Ver cómo migrar.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` es parecido a [`Component`](/apis/react/Component) pero se salta las re-renderizaciones para las mismas props y estado. Los componentes de clase todavía son compatibles con React, pero no recomendamos usarlos en código nuevo.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hola, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Uso {/*usage*/}

### Omitir renderizaciones innecesarias para componentes de clase {/*skipping-unnecessary-re-renders-for-class-components*/}

React normalmente vuelve a renderizar un componente cada vez que su elemento principal vuelve a renderizar. Como optimización, puede crear un componente que React no volverá a renderizar cuando su elemento principal vuelva a renderizar, siempre que sus nuevas props y estado sean los mismos que los antiguas props y estado. [Class components](/apis/react/Component) pueden optar por este comportamiento extendiendo `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hola, {this.props.name}!</h1>;
  }
}
```

Un componente de React siempre debe tener [lógica de representación pura.](/learn/keeping-components-pure) Esto significa que debe devolver el mismo resultado si sus accesorios, estado y contexto no han cambiado. Al usar `PureComponent`, le está diciendo a React que su componente cumple con este requisito, por lo que React no necesita volver a renderizar siempre que sus accesorios y estado no hayan cambiado. Sin embargo, su componente aún se volverá a representar si cambia un contexto que está usando.

En este ejemplo, observe que el componente `Greeting` se vuelve a representar cada vez que se cambia `name` (porque ese es uno de sus accesorios), pero no cuando se cambia `address` (porque no se pasa a `Greeting` como accesorio) :

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("El saludo se brindó en", new Date().toLocaleTimeString());
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

Recomendamos definir los componentes como funciones en lugar de clases. [Ver cómo migrar.](#alternatives)

</Pitfall>

---

## Alternativas {/*alternatives*/}

### Migración de un componente de clase `PureComponent` a una función {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Recomendamos usar componentes de función en lugar de [componentes de clase](/apis/react/Component) en el nuevo código. Si tiene algunos componentes de clase existentes que usan `PureComponent`, así es como puede convertirlos. Este es el código original:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("El saludo se brindó en", new Date().toLocaleTimeString());
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

Cuando [conviertes este componente de una clase a una función,](/apis/react/Component#alternatives) envuélvalo en [`memo`:](/apis/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("El saludo se brindó en", new Date().toLocaleTimeString());
  return <h3>Hola{name && ', '}{name}!</h3>;
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

A diferencia de `PureComponent`, [`memo`](/apis/react/memo) no compara el nuevo y el viejo estado. En los componentes de función, llamando al[`set` function](/apis/react/useState#setstate) con el mismo estado [ya impide que se vuelvan a renderizar de forma predeterminada,](/apis/react/memo#updating-a-memoized-component-using-state) incluso sin `memo`.

</Note>

---

## Referencia {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Para omitir volver a renderizar un componente de clase para las mismas props y estado, extienda `PureComponent` en lugar de [`Component`:](/apis/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hola, {this.props.name}!</h1>;
  }
}
```

`PureComponent` es una subclase de `Component` y admite [todas las API de `Component`.](/apis/react/Component#reference)Extender `PureComponent` es equivalente a definir un método personalizado [`shouldComponentUpdate`](/apis/react/Component#shouldcomponentupdate) que compara superficialmente las props y el estado.

[Ver más ejemplos.](#usage)
