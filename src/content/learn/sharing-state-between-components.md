---
title: Compartir estado entre componentes
---

<Intro>

Hay ocasiones en las que quieres que el estado de dos componentes cambien siempre juntos. Para hacerlo, elimina el estado de los dos, muévelo al padre común más cercano y luego pásalo a través de props. Esto se conoce como *elevar el estado (lifting state up)*, y es una de las cosas más comunes que harás al escribir código React.

</Intro>

<YouWillLearn>

- Cómo compartir el estado entre componentes por elevación
- Qué son los componentes controlados y no controlados

</YouWillLearn>

## Elevar el estado con un ejemplo {/*lifting-state-up-by-example*/}

En este ejemplo, el componente padre `Accordion` renderiza dos componentes `Panel`:

* `Accordion`
  - `Panel`
  - `Panel`

Cada componente `Panel` tiene un estado booleano 'isActive' que determina si su contenido es visible.

Presiona el botón Mostrar en ambos paneles:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Mostrar
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Alma Ata, Kazajistán</h2>
      <Panel title="Acerca de">
        Con una población de unos 2 millones de habitantes, Alma Ata es la mayor ciudad de Kazajistán. De 1929 a 1997 fue su capital.
      </Panel>
      <Panel title="Etimología">
        El nombre proviene de <span lang="kk-KZ">алма</span>, palabra en kazajo que significa "manzana" y suele traducirse como "lleno de manzanas". De hecho, se cree que la región que rodea a Alma Ata es el hogar ancestral de la manzana, y se considera que este fruto silvestre <i lang="la">Malus sieversii</i> es un candidato probable para el ancestro de la manzana doméstica moderna.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Observa que pulsar el botón de un panel no afecta al otro: son independientes.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagrama que muestra un árbol de tres componentes, un padre llamado Accordion y dos hijos llamados Panel. Ambos componentes Panel contienen isActive con valor false.">

Inicialmente, el estado `isActive` de cada `Panel` es `false`, por lo que ambos aparecen colapsados

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="El mismo diagrama que el anterior, con el valor de isActive establecido en true, mediante un click, en el primer componente hijo Panel. El segundo componente Panel todavía contiene el valor false." >

Al hacer clic en cualquiera de los botones del `Panel` sólo se actualizará el estado `isActive` de ese `Panel`.

</Diagram>

</DiagramGroup>

**Pero ahora digamos que quieres cambiarlo para que solo se mantenga expandido un panel a la vez.** Con ese diseño, al expandir el segundo panel se debería colapsar el primero. ¿Cómo lo harías?

Para coordinar estos dos paneles, es necesario "elevar su estado" a un componente padre en tres pasos:

1. **Remueve** el estado de los componentes hijos.
2. **Transfiere** los datos codificados desde el padre común.
3. **Añade** estado al padre común y pasarlo hacia abajo junto con los controladores de eventos.

Esto permitirá que el componente `Accordion` coordine ambos `Panel` y sólo expanda uno a la vez.

### Paso 1: Elimina el estado de los componentes hijos {/*step-1-remove-state-from-the-child-components*/}

Le darás el control de `isActive` del `Panel` a su componente padre. Esto significa que el componente padre pasará `isActive` al `Panel` como prop. Empieza por **eliminar esta línea** del componente `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

Y en su lugar, añade `isActive` a la lista de props del `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Ahora el componente padre de `Panel` puede *controlar* `isActive` [pasándolo como prop.](/learn/passing-props-to-a-component) A la inversa, el componente `Panel` ahora no tiene *ningún control* sobre el valor de `isActive`--¡ahora depende del componente padre!

### Paso 2: Pasa los datos codificados desde el componente padre común {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Para elevar el estado, debes localizar el componente padre común más cercano de *ambos* componentes hijos que deseas coordinar:

* `Accordion` *(padre común más cercano)*
  - `Panel`
  - `Panel`

En este ejemplo, es el componente `Accordion`, dado que está por encima de ambos paneles y puede controlar sus props, se convertirá en la "fuente de la verdad" para saber qué panel está actualmente activo. Haz que el componente `Accordion` pase un valor codificado de `isActive` (por ejemplo, `true`) a ambos paneles:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Alma Ata, Kazajistán</h2>
      <Panel title="Acerca de" isActive={true}>
        Con una población de unos 2 millones de habitantes, Alma Ata es la mayor ciudad de Kazajistán. De 1929 a 1997 fue su capital.
      </Panel>
      <Panel title="Etimología" isActive={true}>
        El nombre proviene de <span lang="kk-KZ">алма</span>, palabra en kazajo que significa "manzana" y suele traducirse como "lleno de manzanas". De hecho, se cree que la región que rodea a Alma Ata es el hogar ancestral de la manzana, y se considera que este fruto silvestre <i lang="la">Malus sieversii</i> es un candidato probable para el ancestro de la manzana doméstica moderna.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Mostrar
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Intenta editar los valores codificados de `isActive` en el componente `Accordion` y ve el resultado en la pantalla.

### Paso 3: Añadir el estado al componente padre común {/*step-3-add-state-to-the-common-parent*/}

Elevar el estado suele cambiar la naturaleza de lo que se almacena como estado.

En este caso, solo un panel debe estar activo a la vez. Esto significa que el componente padre común `Accordion` necesita llevar la cuenta de *qué* panel es el que se encuentra activo. En lugar de un valor `booleano`, podría utilizar un número como índice del `Panel` activo para la variable de estado:

```js
const [activeIndex, setActiveIndex] = useState(0);
```
Cuando el `activeIndex` es `0`, el primer panel está activo, y cuando es `1`, lo estará el segundo.

Al hacer clic en el botón "Mostrar" en cualquiera de los dos `Paneles` es necesario cambiar el índice activo en el `Accordion`. Un `Panel` no puede establecer el estado `activeIndex` directamente porque está definido dentro del `Accordion`. El componente `Accordion` necesita *permitir explícitamente* que el componente `Panel` cambie su estado [pasando un controlador de evento como prop](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

El `<button>` dentro del `Panel` ahora usará como prop `onShow` como su controlador de evento de click:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Alma Ata, Kazajistán</h2>
      <Panel
        title="Acerca de"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Con una población de unos 2 millones de habitantes, Alma Ata es la mayor ciudad de Kazajistán. De 1929 a 1997 fue su capital.
      </Panel>
      <Panel
        title="Etimología"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        El nombre proviene de <span lang="kk-KZ">алма</span>, palabra en kazajo que significa "manzana" y suele traducirse como "lleno de manzanas". De hecho, se cree que la región que rodea a Alma Ata es el hogar ancestral de la manzana, y se considera que este fruto silvestre <i lang="la">Malus sieversii</i> es un candidato probable para el ancestro de la manzana doméstica moderna.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Mostrar
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

¡Esto completa la elevación del estado! Mover el estado al componente padre común permitió coordinar los dos paneles. El uso de la activación por índice, en lugar de dos props "isShow", aseguró que solo un panel se encuentre activo en un momento dado. Y pasar el controlador de evento al hijo permitió al hijo cambiar el estado del padre.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagrama que muestra un árbol de tres componentes, un padre llamado Accordion y dos hijos llamados Panel. Accordion contiene un valor activeIndex de cero que, cuando es pasado al primer Panel, se convierte en true para isActive y false en isActive para el segundo Panel." >

Inicialmente, `Accordion` posee un `activeIndex` de `0`, por lo que el primer `Panel` recibe `isActive = true`.

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="El mismo diagrama que el anterior, con el valor de activeIndex del componente padre Acordeón resaltado que indica un click y cuyo valor se ha modificado a uno. También se resalta el flujo hacia los dos componentes hijos Panel donde el valor de isActive que se pasa a cada hijo se establece al revés: false para el primer Panel y true para el segundo.">

Cuando el estado de `Accordion` en `activeIndex` cambia a `1`, el segundo `Panel` recibe `isActive = true` en su lugar.

</Diagram>

</DiagramGroup>

<DeepDive>

#### Componentes controlados y no controlados {/*controlled-and-uncontrolled-components*/}

Es común llamar a un componente con algún estado local "no controlado". Por ejemplo, el componente original `Panel` con una variable de estado `isActive` no está controlado porque su padre no puede influir sobre el `Panel` si está activo o no.

Por el contrario, se podría decir que un componente es "controlado" cuando la información importante en él es determinada por props en lugar de su propio estado local. Esto permite al componente padre especificar completamente su comportamiento. El componente final de `Panel` con la propiedad `isActive` es controlado por el componente `Accordion`.

Los componentes no controlados son más fáciles de usar dentro de sus padres porque requieren menos configuración. Pero son menos flexibles cuando quieres coordinarlos entre sí. Los componentes controlados son lo más flexible, pero requieren que los componentes padres los configuren completamente con props.

En la práctica, componentes "controlado" y "no controlado" no son términos técnicos estrictos: cada componente suele tener una mezcla de estado local y por props. Sin embargo, es una forma útil de describir cómo se diseñan los componentes y qué capacidades ofrecen.

Cuando escribas un componente, plantéate qué información debe ser controlada (mediante props), y qué información debe ser no controlada (mediante estado). Pero siempre puedes cambiar de opinión y refactorizar más tarde.

</DeepDive>

## Una única fuente de verdad para cada estado {/*a-single-source-of-truth-for-each-state*/}

En una aplicación React, muchos componentes tendrán su propio estado. Algunos estados pueden "vivir" cerca de los componentes hoja (componentes en la parte inferior del árbol) como las entradas. Otros estados pueden "vivir" más cerca de la parte superior de la aplicación. Por ejemplo, incluso las bibliotecas de enrutamiento del lado del cliente suelen implementarse almacenando la ruta actual en el estado de React, y pasándola hacia abajo mediante props.

Para cada estado individualizado, se elegirá el componente que lo "albergue". Este principio también se conoce como tener una ["única fuente de la verdad" (single source of truth).](https://en.wikipedia.org/wiki/Single_source_of_truth) No significa que todo el estado viva en un solo lugar, sino que para _cada_ pieza de estado, hay un componente _específico_ que contiene esa pieza de información. En lugar de duplicar el estado compartido entre los componentes, lo *elevarás* a su padre común compartido, y lo *pasarás a los hijos*  que lo necesiten.

Tu aplicación cambiará a medida que trabajes en ella. Es común que muevas el estado hacia abajo o hacia arriba mientras aún estás averiguando dónde "vive" cada pieza del estado. Todo esto forma parte del proceso.

Para ver cómo se siente esto en la práctica con algunos componentes más, lee [Pensar en React.](/learn/thinking-in-react)

<Recap>

* Cuando quieras coordinar dos componentes, mueve su estado a su padre común.
* Luego pasa la información hacia abajo a través de props desde su padre común.
* Finalmente, pasa los controladores de eventos hacia abajo para que los hijos puedan cambiar el estado del padre.
* Es útil considerar los componentes como "controlados" (manejados por accesorios) o "no controlados" (manejados por el estado).

</Recap>

<Challenges>

#### Entradas sincronizadas {/*synced-inputs*/}

Estas dos entradas son independientes. Haz que se mantengan sincronizadas: la edición de una entrada debería actualizar la otra con el mismo texto, y viceversa.

<Hint>

Tendrás que elevar su estado al componente padre.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="Primera entrada" />
      <Input label="Segunda entrada" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Mueve la variable de estado `text` al componente padre junto con la controladora `handleChange`. Luego pásalos como props a ambos componentes `Input`. Esto los mantendrá sincronizados.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="Primera entrada"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Segunda entrada"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Filtrando una lista {/*filtering-a-list*/}

En este ejemplo, la `SearchBar` tiene su propio estado `query` que controla la entrada de texto. Su componente padre `FilterableList` muestra una `List` de elementos, pero no tiene en cuenta la consulta de búsqueda. 

Utilice la función `filterItems(foods, query)` para filtrar la lista según la consulta de búsqueda. Para probar los cambios, compruebe que al escribir "s" en la entrada se filtra la lista a "Sushi", "Shish kebab" y "Dim sum".

Tenga en cuenta que `filterItems` ya está implementado e importado, por lo que no necesita escribirlo usted mismo.

<Hint>

Querrás eliminar el estado `query` y la controladora `handleChange` de `SearchBar`, y moverlos a la `FilterableList`. Luego pásalos como props a la `SearchBar` como `query` y `onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Buscar:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'El sushi es un plato tradicional japonés de arroz preparado en vinagre.'
}, {
  id: 1,
  name: 'Dal',
  description: 'La forma más común de preparar el dal es en forma de sopa a la que se pueden añadir cebollas, tomates y diversas especias.'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Los Pierogi son bolas de masa rellenas que se hacen envolviendo una masa sin levadura con un relleno salado o dulce y cociéndolas en agua hirviendo.'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'El shish kebab es una comida popular de cubos de carne ensartados y asados.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum es una gran variedad de pequeños platos que los cantoneses disfrutan tradicionalmente en los restaurantes para el desayuno y el almuerzo.'
}];
```

</Sandpack>

<Solution>

Pasa el estado `query` al componente `FilterableList`. Llama a `filterItems(foods, query)` para obtener la lista filtrada y pásala al componente `List`. Ahora el cambio de la consulta (query input) se ve reflejada en la lista:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Buscar:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'El sushi es un plato tradicional japonés de arroz preparado en vinagre.'
}, {
  id: 1,
  name: 'Dal',
  description: 'La forma más común de preparar el dal es en forma de sopa a la que se pueden añadir cebollas, tomates y diversas especias.'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Los Pierogi son bolas de masa rellenas que se hacen envolviendo una masa sin levadura con un relleno salado o dulce y cociéndolas en agua hirviendo.'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'El shish kebab es una comida popular de cubos de carne ensartados y asados.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum es una gran variedad de pequeños platos que los cantoneses disfrutan tradicionalmente en los restaurantes para el desayuno y el almuerzo.'
}];
```

</Sandpack>

</Solution>

</Challenges>
