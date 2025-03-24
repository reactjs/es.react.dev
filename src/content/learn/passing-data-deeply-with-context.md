---
title: Pasar datos en profundidad con contexto
---

<Intro>

Por lo general, pasarás información desde un componente padre a un componente hijo por medio de props. Sin embargo, pasar props puede convertirse en una tarea verbosa e inconveniente si tienes que pasarlas a través de múltiples componentes, o si varios componentes en tu aplicación necesitan la misma información. El *contexto* permite que cierta información del componente padre esté disponible en cualquier componente del árbol que esté por debajo de él sin importar qué tan profundo sea y sin pasar la información explícitamente por medio de props.

</Intro>

<YouWillLearn>

- Qué es "perforación de props"
- Cómo reemplazar el paso repetitivo de props con contexto
- Casos de uso comunes para el contexto
- Alternativas comunes al contexto

</YouWillLearn>

## El problema con pasar props {/*the-problem-with-passing-props*/}

[Pasar props](/learn/passing-props-to-a-component) es una gran manera de enviar explícitamente datos a través del árbol de la UI a componentes que los usen.

No obstante, pasar props puede convertirse en una tarea verbosa e inconveniente cuando necesitas enviar algunas props profundamente a través del árbol, o si múltiples componentes necesitan de las mismas. El ancestro común más cercano podría estar muy alejado de los componentes que necesitan los datos, y [elevar el estado](/learn/sharing-state-between-components) tan alto puede ocasionar la situación llamada "perforación de props".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Un diagrama con un árbol de tres componentes. El padre contiene una burbuja que representa un valor resaltado en morado. El valor fluye hacia los dos hijos, ambos resaltados en morado." >

Elevar el estado

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Un diagrama con un árbol de diez nodos, cada nodo tiene dos o menos hijos. El nodo raíz contiene una burbuja que representa un valor resaltado en morado. El valor fluye a través de los dos hijos, los cuales pasan el valor pero no lo contienen. El hijo izquierdo envía el valor a sus dos hijos, los cuales están resaltados en morado. El hijo derecho del nodo raíz pasa el valor únicamente a través de su hijo derecho, el cual está resaltado en morado. Ese hijo pasa el valor a través de su único hijo, y el hijo único a su vez envía el valor a sus dos hijos, ambos resaltados en morado.">

Perforación de props

</Diagram>

</DiagramGroup>

¿No sería grandioso si existiese alguna forma de "teletransportar" datos a componentes en el árbol que lo necesiten sin tener que pasar props? ¡Con el contexto de React es posible!

## Contexto: una alternativa a pasar props {/*context-an-alternative-to-passing-props*/}

El contexto permite que el componente padre provea datos al árbol entero debajo de él. Hay muchas utilidades para el contexto. Este es un solo ejemplo. Considera el componente `Heading` que acepta `level` como su tamaño:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Título</Heading>
      <Heading level={2}>Encabezado</Heading>
      <Heading level={3}>Sub-encabezado</Heading>
      <Heading level={4}>Sub-sub-encabezado</Heading>
      <Heading level={5}>Sub-sub-sub-encabezado</Heading>
      <Heading level={6}>Sub-sub-sub-sub-encabezado</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Supongamos que quieres múltiples encabezados (*headings*) dentro del mismo componente `Section` para siempre tener el mismo tamaño:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Título</Heading>
      <Section>
        <Heading level={2}>Encabezado</Heading>
        <Heading level={2}>Encabezado</Heading>
        <Heading level={2}>Encabezado</Heading>
        <Section>
          <Heading level={3}>Sub-encabezado</Heading>
          <Heading level={3}>Sub-encabezado</Heading>
          <Heading level={3}>Sub-encabezado</Heading>
          <Section>
            <Heading level={4}>Sub-sub-encabezado</Heading>
            <Heading level={4}>Sub-sub-encabezado</Heading>
            <Heading level={4}>Sub-sub-encabezado</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Actualmente, estás pasando la prop `level` a cada `<Heading>` separadamente:

```js
<Section>
  <Heading level={3}>Acerca de</Heading>
  <Heading level={3}>Fotos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Sería genial si pudieras pasar la prop `level` al componente `<Section>` y removerlo del `<Heading>`. De esta forma podrías reforzar que todos los encabezados tengan el mismo tamaño en una misma sección (*section*):

```js
<Section level={3}>
  <Heading>Acerca de</Heading>
  <Heading>Fotos</Heading>
  <Heading>Videos</Heading>
</Section>
```

¿Pero como podría el componente `<Heading>` conocer el `level` de su `<Section>` más cercano? **Eso requeriría alguna forma en la que el hijo "pediría" datos desde algún lugar arriba en el árbol.**

No podrías lograrlo únicamente con props. Aquí es donde el contexto entra a jugar. Lo conseguirás en tres pasos:

1. **Crear** un contexto (puedes llamarlo `LevelContext`, ya que es para el `level` de los encabezados)
2. **Usar** ese contexto desde el componente que necesita los datos (`Heading` usará `LevelContext`)
3. **Proveer** ese contexto desde el componente que especifica los datos (`Section` proveerá `LevelContext`)

El contexto permite que en un padre (incluso uno distante) provea algunos datos a la totalidad del árbol dentro de él.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Un diagrama con un árbol de tres componentes. El padre contiene una burbuja que representa un valor resaltado en naranja el cual proyecta hacia sus dos hijos, cada uno resaltado en naranja." >

Usar contexto en un hijo cercano

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Un diagrama con un árbol de diez nodos, cada nodo con dos hijos o menos. El nodo raíz padre contiene una burbuja que representa un valor resaltado en naranja. El valor proyecta directamente a cuatro hojas y un componente intermedio en el árbol, los cuales todos están resaltados en naranja. Ninguno de los componentes intermedios restantes están resaltados.">

Usar contexto en hijos lejanos

</Diagram>

</DiagramGroup>

### Paso 1: Crear el contexto {/*step-1-create-the-context*/}

Primeramente, necesitas crear el contexto. Necesitarás **exportarlo desde un archivo** para que tus componentes lo puedan usar: 

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Título</Heading>
      <Section>
        <Heading level={2}>Encabezado</Heading>
        <Heading level={2}>Encabezado</Heading>
        <Heading level={2}>Encabezado</Heading>
        <Section>
          <Heading level={3}>Sub-encabezado</Heading>
          <Heading level={3}>Sub-encabezado</Heading>
          <Heading level={3}>Sub-encabezado</Heading>
          <Section>
            <Heading level={4}>Sub-sub-encabezado</Heading>
            <Heading level={4}>Sub-sub-encabezado</Heading>
            <Heading level={4}>Sub-sub-encabezado</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

El único parámetro que se le pasa a `createContext` es el valor _predeterminado_. En este caso, `1` se refiere al nivel de encabezado más grande, pero puedes pasar cualquier valor (incluso un objeto). Ya verás la importancia del valor predeterminado en el siguiente paso.

### Paso 2: Usar el contexto {/*step-2-use-the-context*/}

Importa el Hook `useContext` desde React y tu contexto:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Actualmente, el componente `Heading` lee `level` con props:

```js
export default function Heading({ level, children }) {
  // ...
}
```

En su lugar, remueve la prop `level` y lee el valor desde el contexto que acabas de importar, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` es un Hook. Así como `useState` y `useReducer`, únicamente puedes llamar a un Hook inmediatamente adentro de un componente de React (no dentro de ciclos o condiciones). **`useContext` le dice a React que el componente `Heading` quiere leer el contexto `LevelContext`.**

Ahora que el componente `Heading` no tiene una prop `level`, ya no tienes que pasarla a `Heading` en tu JSX de esta forma:

```js
<Section>
  <Heading level={4}>Sub-sub-encabezado</Heading>
  <Heading level={4}>Sub-sub-encabezado</Heading>
  <Heading level={4}>Sub-sub-encabezado</Heading>
</Section>
```

Actualiza el JSX para que sea `Section` el que recibe la prop:

```jsx
<Section level={4}>
  <Heading>Sub-sub-encabezado</Heading>
  <Heading>Sub-sub-encabezado</Heading>
  <Heading>Sub-sub-encabezado</Heading>
</Section>
```

Como recordatorio, esta es la estructura que estabas intentando que funcionara:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Título</Heading>
      <Section level={2}>
        <Heading>Encabezado</Heading>
        <Heading>Encabezado</Heading>
        <Heading>Encabezado</Heading>
        <Section level={3}>
          <Heading>Sub-encabezado</Heading>
          <Heading>Sub-encabezado</Heading>
          <Heading>Sub-encabezado</Heading>
          <Section level={4}>
            <Heading>Sub-sub-encabezado</Heading>
            <Heading>Sub-sub-encabezado</Heading>
            <Heading>Sub-sub-encabezado</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Nota que este ejemplo no funciona, ¡Aún! Todos los encabezados tienen el mismo tamaño porque **pese a que estás *usando* el contexto, no lo has *proveído* aún.** ¡React no sabe dónde obtenerlo!

Si no provees el contexto, React usará el valor predeterminado que especificaste en el paso previo. En este ejemplo, especificaste `1` como el parámetro de `createContext`, entonces `useContext(LevelContext)` devuelve `1`, ajustando todos los encabezados a `<h1>`. Arreglemos este problema haciendo que cada `Section` provea su propio contexto.

### Paso 3: Proveer el contexto {/*step-3-provide-the-context*/}

El componente `Section` actualmente renderiza sus hijos:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Envuélvelos con un proveedor de contexto** para proveer `LevelContext` a ellos:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

<<<<<<< HEAD
Esto le dice a React: "si cualquier componente adentro de este `<Section>` pregunta por `LevelContext`, envíales este `level`". El componente usará el valor del `<LevelContext.Provider>` más cercano en el árbol de la UI encima de él.
=======
This tells React: "if any component inside this `<Section>` asks for `LevelContext`, give them this `level`." The component will use the value of the nearest `<LevelContext>` in the UI tree above it.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Título</Heading>
      <Section level={2}>
        <Heading>Encabezado</Heading>
        <Heading>Encabezado</Heading>
        <Heading>Encabezado</Heading>
        <Section level={3}>
          <Heading>Sub-encabezado</Heading>
          <Heading>Sub-encabezado</Heading>
          <Heading>Sub-encabezado</Heading>
          <Section level={4}>
            <Heading>Sub-sub-encabezado</Heading>
            <Heading>Sub-sub-encabezado</Heading>
            <Heading>Sub-sub-encabezado</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Es el mismo resultado del código original, ¡pero no tuviste que pasar la prop `level` a cada componente `Heading`! En su lugar, el componente "comprende" su nivel de encabezado al preguntarle al `Section` más cercano de arriba:

<<<<<<< HEAD
1. Pasas la prop `level` al `<Section>`.
2. `Section` envuelve a sus hijos con `<LevelContext.Provider value={level}>`.
3. `Heading` pregunta el valor más cercano de arriba de `LevelContext` por medio de `useContext(LevelContext)`.
=======
1. You pass a `level` prop to the `<Section>`.
2. `Section` wraps its children into `<LevelContext value={level}>`.
3. `Heading` asks the closest value of `LevelContext` above with `useContext(LevelContext)`.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

## Usar y proveer el contexto desde el mismo componente {/*using-and-providing-context-from-the-same-component*/}

Actualmente, aún puedes especificar el `level` de cada sección manualmente:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Debido a que el contexto te permite leer información desde un componente de arriba, cada `Section` podría leer el `level` del `Section` de arriba, y pasar `level + 1` hacia abajo automáticamente. Así es como lo podrías conseguir:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

Con este cambio, no es necesario pasar la prop `level` al `<Section>` o al `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Título</Heading>
      <Section>
        <Heading>Encabezado</Heading>
        <Heading>Encabezado</Heading>
        <Heading>Encabezado</Heading>
        <Section>
          <Heading>Sub-encabezado</Heading>
          <Heading>Sub-encabezado</Heading>
          <Heading>Sub-encabezado</Heading>
          <Section>
            <Heading>Sub-sub-encabezado</Heading>
            <Heading>Sub-sub-encabezado</Heading>
            <Heading>Sub-sub-encabezado</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Ahora, tanto el `Heading` como el `Section` leen el `LevelContext` para averiguar qué tan "profundos" están. El `Section` envuelve sus hijos con el `LevelContext` para especificar que cualquier componente adentro de él está a un nivel más "profundo".

<Note>

Este ejemplo usa niveles de encabezados porque muestran visualmente cómo componentes anidados pueden sobrescribir contextos. Sin embargo, los contextos son útiles para otros casos de uso también. Puedes pasar hacia abajo cualquier información necesitada por el subárbol entero: el color actual del tema, el usuario actual que inició sesión, entre otros.

</Note>

## El contexto pasa a través de componentes intermedios {/*context-passes-through-intermediate-components*/}

Puedes insertar tantos componentes como desees entre el componente que provee el contexto y el componente que lo usa. Esto incluye tanto componentes integrados como `<div>` como componentes construidos por ti.

En este ejemplo, el mismo componente `Post` (con un borde discontinuo) es renderizado en dos distintos niveles anidados. Nota que el `<Heading>` que está adentro tiene el nivel automáticamente desde el `<Section>` más cercano:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>Mi perfil</Heading>
      <Post
        title="¡Hola viajero!"
        body="Lee sobre mis aventuras."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Publicaciones</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Publicaciones recientes</Heading>
      <Post
        title="Sabores de Lisboa"
        body="¡...esos pastéis de nata!"
      />
      <Post
        title="Buenos Aires a ritmo de tango"
        body="¡Me encantó!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

No necesitaste hacer nada especial para esta tarea. Cada `Section` especifica el contexto para el árbol adentro de él, por lo que puedes insertar un `<Heading>` en cualquier lado, y tendrá el tamaño correcto.

**El contexto te permite crear componentes que se "adaptan a sus alrededores" y se despliegan de forma diferente dependiendo de _dónde_ (o en otras palabras, _en cuál contexto_) están siendo renderizados.**

El funcionamiento de los contextos te podría recordar a la [herencia de CSS.](https://developer.mozilla.org/es/docs/Web/CSS/inheritance) En CSS, puedes especificar `color: blue` para un `<div>`, y cualquier nodo DOM adentro de él, no importa qué tan profundo esté, heredará ese color a no ser de que otro nodo DOM en el medio lo sobrescriba con `color: green`. Asimismo, en React la única forma de sobrescribir un contexto que viene desde arriba es envolviendo sus hijos con un proveedor de contexto que tenga un valor distinto.

En CSS, diversas propiedades como `color` y `background-color` no se sobrescriben entre ellas. Puedes definir la propiedad `color` de todos los `<div>` a `red` sin impactar `background-color`. Similarmente, **diversos contextos de React no se sobrescriben entre ellos mismos.** Cada contexto que creas con `createContext()` está completamente separado de los otros, y une los componentes usando y proveyendo *ese* contexto en particular. Un componente podría usar o proveer muchos contextos diferentes sin ningún problema.

## Antes de usar contexto {/*before-you-use-context*/}

¡El uso contexto resulta muy atractivo! Sin embargo, esto también significa que fácilmente puedes terminar abusando de él. **Solo porque necesitas pasar algunas props a varios niveles en profundidad no significa que debas poner esa información en un contexto.**

Aquí hay algunas alternativas que podrías considerar antes de usar el contexto:

1. **Empieza [pasando props.](/learn/passing-props-to-a-component)** Si tus componentes no son triviales, no es inusual pasar muchas props hacia abajo a través de muchos componentes. Podría considerarse tedioso, ¡pero deja bien claro cuáles componentes usan cuáles datos! La persona dándole mantenimiento a tu código estará agradecida de que hiciste el flujo de datos explícito con props.
2. **Extraer componentes y [pasarles el JSX como `children`](/learn/passing-props-to-a-component#passing-jsx-as-children).** Si pasas algunos datos a través de muchas capas de componentes intermedios que no usan esos datos (y lo único que hacen es pasarlos hacia abajo), esto muchas veces significa que olvidaste extraer algunos componentes sobre la marcha. Por ejemplo, quizá pasaste algunas props como `posts` a componentes visuales que no las usan directamente, como lo puede ser `<Layout posts={posts} />`. En su lugar, haz que `Layout` tome `children` como prop, y renderiza `<Layout><Posts posts={posts} /></Layout>`. Esto reduce la cantidad de capas que hay entre el componente que especifica los datos y el componente que los necesita.

Si ninguna de estas alternativas funcionan bien para ti, considera el contexto.

## Casos de uso para el contexto {/*use-cases-for-context*/}

* **Temas:** Si tus aplicaciones permiten que los usuarios cambien la apariencia (por ejemplo, modo oscuro), puedes poner un proveedor de contexto en el primer nivel de tu aplicación, y usar ese contexto en componentes que necesiten ajustar su comportamiento visual.
* **Cuenta actual:** Muchos componentes podrían necesitar saber el usuario actual que inició sesión. Ponerlo en un contexto lo hace conveniente para leerlo desde cualquier lado del árbol. Algunas aplicaciones también te permiten manejar múltiples cuentas al mismo tiempo (por ejemplo, dejar un comentario con un usuario distinto). En esos casos, puede ser conveniente envolver parte de la UI con un proveedor anidado que tenga una cuenta actual diferente.
* **Enrutamiento:** La mayoría de las soluciones de enrutamiento usan contexto internamente para mantener la ruta actual. Así es como cada enlace "sabe" si está activo o no. Si construyes tu propio enrutador, podrías necesitar hacerlo también.
* **Gestionar estados:** A medida que tu aplicación crece, podrías terminar con muchos estados cerca de la parte superior de tu aplicación. Muchos componentes distantes de abajo podrían querer cambiarlos. Es común [usar un reducer con un contexto](/learn/scaling-up-with-reducer-and-context) para gestionar estados complejos y pasarlos a componentes lejanos sin mucha molestia.

El contexto no está limitado a valores estáticos. Si pasas un valor distinto en el siguiente render, ¡React actualizará todos los componentes debajo que lean el contexto! Es por esto que muchas veces el contexto es usado en combinación con estados.

En general, si alguna información es necesitada por componentes lejanos en diferentes partes del árbol, es un buen indicador de que el contexto te ayudará.

<Recap>

<<<<<<< HEAD
* El contexto permite que el componente provea alguna información al árbol completo debajo de él.
* Para pasar un contexto:
  1. Crear y exportar el contexto con `export const MyContext = createContext(defaultValue)`.
  2. Pasarlo al Hook `useContext(MyContext)` para leerlo en cualquier componente hijo, sin importar qué tan profundo es.
  3. Envolver los hijos con `<MyContext.Provider value={...}>` para proveerlo desde el padre.
* El contexto pasa a través de cualquier componente en el medio.
* El contexto te permite escribir componentes que se "adaptan a sus alrededores".
* Antes de usar contexto, trata de pasar props o pasar JSX como `children`.
=======
* Context lets a component provide some information to the entire tree below it.
* To pass context:
  1. Create and export it with `export const MyContext = createContext(defaultValue)`.
  2. Pass it to the `useContext(MyContext)` Hook to read it in any child component, no matter how deep.
  3. Wrap children into `<MyContext value={...}>` to provide it from a parent.
* Context passes through any components in the middle.
* Context lets you write components that "adapt to their surroundings".
* Before you use context, try passing props or passing JSX as `children`.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

</Recap>

<Challenges>

#### Reemplazar perforación de props con contexto {/*replace-prop-drilling-with-context*/}

En este ejemplo, activar la casilla cambia la prop `imageSize` que se pasa a cada `<PlaceImage>`. El estado de la casilla se mantiene en el nivel superior del componente `App`, pero cada `<PlaceImage>` necesita estar consciente del estado. 

Actualmente, `App` pasa `imageSize` a `List`, el cual lo pasa a cada `Place`, el cual lo pasa al `PlaceImage`. Remueve la prop `imageSize`, y en su lugar pásala desde el componente `App` directamente al `PlaceImage`.

Puedes declarar el contexto en `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Usa imágenes grandes
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap en Ciudad del Cabo, Sudáfrica',
  description: 'La tradición de elegir colores vivos para las casas comenzó a finales del siglo XX.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Pueblo del Arco Iris en Taichung, Taiwán',
  description: 'Para salvar las casas de la demolición, Huang Yung-Fu, un residente local, pintó la totalidad de las 1.200 de ellas en 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, México',
  description: 'Uno de los murales más grandes del mundo cubre las casas de un barrio en la ladera de una colina.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Escalera Selarón en Río de Janeiro, Brasil',
  description: 'Este lugar emblemático fue creado por Jorge Selarón, artista de origen chileno, como "homenaje al pueblo brasileño".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italia',
  description: 'Las casas están pintadas siguiendo un sistema de colores específico que se remonta al siglo XVI.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marruecos',
  description: 'Hay varias teorías sobre por qué las casas están pintadas de azul, entre ellas que el color repele a los mosquitos o que simboliza el cielo y el paraíso.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Aldea Cultural de Gamcheon en Busan, Corea del Sur',
  description: 'En 2009, el pueblo se convirtió en un centro cultural pintando las casas y presentando exposiciones e instalaciones artísticas.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

Elimina la prop `imageSize` de todos los componentes.

<<<<<<< HEAD
Crea y exporta `ImageSizeContext` desde `Context.js`. Luego, envuelve la lista con `<ImageSizeContext.Provider value={imageSize}>` para pasar el valor hacia abajo, y `useContext(ImageSizeContext)` para leerlo en el componente `PlaceImage`:
=======
Create and export `ImageSizeContext` from `Context.js`. Then wrap the List into `<ImageSizeContext value={imageSize}>` to pass the value down, and `useContext(ImageSizeContext)` to read it in the `PlaceImage`:
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Usa imágenes grandes
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap en Ciudad del Cabo, Sudáfrica',
  description: 'La tradición de elegir colores vivos para las casas comenzó a finales del siglo XX.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Pueblo del Arco Iris en Taichung, Taiwán',
  description: 'Para salvar las casas de la demolición, Huang Yung-Fu, un residente local, pintó la totalidad de las 1.200 de ellas en 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, México',
  description: 'Uno de los murales más grandes del mundo cubre las casas de un barrio en la ladera de una colina.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Escalera Selarón en Río de Janeiro, Brasil',
  description: 'Este lugar emblemático fue creado por Jorge Selarón, artista de origen chileno, como "homenaje al pueblo brasileño".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italia',
  description: 'Las casas están pintadas siguiendo un sistema de colores específico que se remonta al siglo XVI.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marruecos',
  description: 'Hay varias teorías sobre por qué las casas están pintadas de azul, entre ellas que el color repele a los mosquitos o que simboliza el cielo y el paraíso.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Aldea Cultural de Gamcheon en Busan, Corea del Sur',
  description: 'En 2009, el pueblo se convirtió en un centro cultural pintando las casas y presentando exposiciones e instalaciones artísticas.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

Nota como los componentes en el medio ya no tienen que pasar `imageSize`.

</Solution>

</Challenges>
