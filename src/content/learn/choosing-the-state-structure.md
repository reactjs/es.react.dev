---
title: Elección de la estructura del estado
---

<Intro>

Estructurar bien el estado puede marcar la diferencia entre un componente que es agradable de modificar y depurar, y uno que es una fuente constante de errores. Estos son algunos consejos que debe tener en cuenta al estructurar el estado.

</Intro>

<YouWillLearn>

* Cuando usar una versus múltiples variables de estado.
* Qué evitar al organizar el estado.
* Cómo solucionar problemas comunes con la estructura del estado.

</YouWillLearn>

## Principios para la estructuración del estado {/*principles-for-structuring-state*/}

Cuando escribes un componente que contiene algún estado, tendrás que tomar decisiones acerca de cuántas variables de estado usar y cuál debería ser la forma de tus datos. Si bien es posible escribir programas correctos incluso con una estructura de estado deficiente, existen algunos principios que pueden guiarte para tomar mejores decisiones:

1. **Estado relacionado con el grupo.** Si siempre actualizas dos o más variables de estado al mismo tiempo, considera fusionarlas en una sola variable de estado.
2. **Evita las contradicciones en el estado.** Cuando el estado está estructurado de manera que varias partes del estado pueden contradecirse y "estar en desacuerdo" entre sí, deja espacio para errores. Trata de evitar esto.
3. **Evita el estado redundante.** Si puedes calcular alguna información de las propiedades del componente o sus variables de estado existentes durante el renderizado, no debes poner esa información en el estado de ese componente.
4. **Evita la duplicación de estado.** Cuando los mismos datos se duplican entre varias variables de estado o dentro de objetos anidados, es difícil mantenerlos sincronizados. Reduce la duplicación cuando puedas.
5. **Evita el estado profundamente anidado.** El estado profundamente jerárquico no es muy conveniente para actualizar. Cuando sea posible, prefiere estructurar el estado de forma plana.

El objetivo detrás de estos principios es *hacer que el estado sea fácil de actualizar sin introducir errores*. La eliminación de datos redundantes y duplicados del estado ayuda a garantizar que todas sus piezas permanezcan sincronizadas. Esto es similar a cómo un ingeniero de base de datos podría querer ["normalizar" la estructura de la base de datos](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) para reducir la posibilidad de errores. Parafraseando a Albert Einstein, **"Haz que tu estado sea lo más simple posible, pero no más simple".**

Ahora veamos cómo se aplican estos principios en acción.

## Estado relativo al grupo {/*group-related-state*/}

En ocasiones, es posible que no estés seguro entre usar una o varias variables de estado.

¿Deberías hacer esto?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

¿O esto?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Técnicamente, puedes usar cualquiera de estos enfoques. Pero **si algunas de las dos variables de estado siempre cambian juntas, podría ser una buena idea unificarlas en una sola variable de estado.** Entonces no olvidarás mantenerlos siempre sincronizados, como en este ejemplo donde al mover el cursor se actualizan ambas coordenadas del punto rojo:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Otro caso en el que agruparás datos en un objeto o una matriz es cuando no sabes cuántas partes diferentes del estado se necesitarán. Por ejemplo, es útil cuando tienes un formulario en el que el usuario puede agregar campos personalizados.

<Pitfall>

Si tu variable de estado es un objeto, recuerda que [no se puede actualizar solo un campo en él](/learn/updating-objects-in-state) sin copiar explícitamente los otros campos. Por ejemplo, no puedes hacer `setPosition({ x: 100 })` pues en el ejemplo anterior no tendría la propiedad `y` en ningún lugar. En su lugar, si quisieras establecer solo la propiedad `x`, la definirías así `setPosition({ ...position, x: 100 })`, o las dividirías en dos variables de estado y harías `setX(100)`.

</Pitfall>

## Evitar contradicciones en el estado {/*avoid-contradictions-in-state*/}

Aquí hay un formulario de comentarios de un hotel con variables de estado `isSending` y `isSent`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>¡Gracias por tu retroalimentación!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>¿Cómo fue tu estadía en El Poney Pisador?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Enviar
      </button>
      {isSending && <p>Enviando...</p>}
    </form>
  );
}

// Pretender enviar un mensaje.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Si bien este código funciona, deja la puerta abierta para estados "imposibles". Por ejemplo, si olvidas llamar a `setIsSent` y `setIsSending` juntos, puede terminar en una situación en la que tanto `isSending` como `isSent` son `true` al mismo tiempo. Cuanto más complejo sea tu componente, más difícil será entender lo que sucedió.

**Dado que `isSending` y `isSent` nunca deben ser `true` al mismo tiempo, es mejor reemplazarlos con una variable de estado `status` que puede tomar uno de *tres* estados válidos:** `'typing '` (initial), `'sending'` y `'sent'`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>¡Gracias por tu retroalimentación!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>¿Cómo fue tu estadía en El Poney Pisador?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Enviar
      </button>
      {isSending && <p>Enviando...</p>}
    </form>
  );
}

// Pretender enviar un mensaje.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Todavía puedes declarar algunas constantes para mejorar la legibilidad:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

Pero no son variables de estado, por lo que no debes preocuparte de que no estén sincronizadas entre sí.

## Evitar estado redundante {/*avoid-redundant-state*/}

Si puedes calcular alguna información de las props del componente o sus variables de estado existentes durante el renderizado, **no debes** poner esa información en el estado de ese componente.

Por ejemplo, toma este formulario. Funciona, pero ¿puedes encontrar algún estado redundante en él?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Vamos a registrarte</h2>
      <label>
        Nombre:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Apellido:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
       Su boleto será emitido a:<b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Este formulario tiene tres variables de estado: `firstName`, `lastName` y `fullName`. Sin embargo, `fullName` es redundante. **Siempre puedes calcular `fullName` a partir de `firstName` y `lastName` durante el renderizado, así que quítalo del estado.**

Así es como puedes hacerlo:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Vamos a registrarte</h2>
      <label>
        Nombre:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Apellido:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Su boleto será emitido a: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

aquí, `fullName` *no* es una variable de estado. En cambio, se calcula durante el renderizado:

```js
const fullName = firstName + ' ' + lastName;
```

Como resultado, los controladores de cambios no necesitan hacer nada especial para actualizarlo. Cuando llamas a `setFirstName` o `setLastName`, activas una nueva representación y luego el siguiente `fullName` se calculará a partir de los nuevos datos.

<DeepDive>

#### No reflejar props en el estado {/*don-t-mirror-props-in-state*/}

Un ejemplo común de estado redundante es un código como este:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

Aquí, una variable de estado `color` se inicializa en la prop `messageColor`. El problema es que **si el componente principal pasa un valor diferente de `messageColor` más adelante (por ejemplo, `'red'` en lugar de `'blue'`), ¡la *variable de estado* `color`¡no se actualizará!** el estado solo se inicializa durante el primer renderizado.

Esta es la razón por la que "reflejar" alguna prop en una variable de estado puede generar confusión. En su lugar, usa el accesorio `messageColor` directamente en tu código. Si deseas darle un nombre más corto, use una constante:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

De esta forma, no se sincroniza con la propiedad que se pasa desde el componente principal.

"Reflejar" props en estado solo tiene sentido cuando *quieres* ignorar todas las actualizaciones de una prop en específico. Por convención, comienza el nombre de la prop con `initial` or `default` para aclarar que sus nuevos valores se ignoran:

```js
function Message({ initialColor }) {
// La variable de estado `color` contiene el *primer* valor de `initialColor`.
// Se ignoran los cambios posteriores a la prop `initialColor`.
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## Evita la duplicación en el estado {/*avoid-duplication-in-state*/}

Este componente de lista de menú te permite elegir un solo refrigerio de viaje entre varios:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crujiente de algas', id: 1 },
  { title: 'barra de granola', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>¿Cuál es tu merienda de viaje?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Seleccionar</button>
          </li>
        ))}
      </ul>
      <p>Seleccionaste {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Actualmente, almacena el elemento seleccionado como un objeto en la variable de estado `selectedItem`. Sin embargo, esto no está bien: **el contenido de `selectedItem` es el mismo objeto que uno de los elementos dentro de la lista de `items`.** Esto significa que la información sobre el elemento en sí está duplicada en dos lugares.

¿Por qué es esto un problema? Hagamos que cada elemento sea editable:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crujiente de algas', id: 1 },
  { title: 'barra de granola', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>¿Cuál es tu merienda de viaje?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Seleccionar</button>
          </li>
        ))}
      </ul>
      <p>Seleccionaste {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Observe cómo si primero haces clic en "Seleccionar" en un elemento y *luego* lo editas, **la entrada se actualiza, pero la etiqueta en la parte inferior no refleja las ediciones.** Esto se debe a que tienes un estado duplicado y te olvidaste de actualizar `selectedItem`.

Aunque también podría actualizar `selectedItem`, una solución más fácil es eliminar la duplicación. En este ejemplo, en lugar de un objeto `selectedItem` (que crea una duplicación con objetos dentro de `items`), mantienes `selectedId` en el estado, y *luego* obtienes el `selectedItem` buscando en la matriz `items` un artículo con esa identificación:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crujiente de algas', id: 1 },
  { title: 'barra de granola', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>¿Cuál es tu merienda de viaje?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Seleccionar</button>
          </li>
        ))}
      </ul>
      <p>Seleccionaste {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

(Alternativamente, puedes mantener el índice seleccionado en el estado).

El estado solía duplicarse de esta manera:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedItem = {id: 0, title: 'pretzels'}`

Pero después del cambio es así:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedId = 0`

¡La duplicación se ha ido, y solo conservas el estado esencial!

Ahora, si editas el ítem *seleccionado*, el siguiente mensaje se actualizará inmediatamente. Esto se debe a que `setItems` desencadena una nueva representación, y `items.find(...)` encontraría el ítem con el título actualizado. No era necesario mantener *el ítem seleccionado* en el estado, porque solo el *ID seleccionado* es esencial. El resto podría calcularse durante el renderizado.

## Evita el estado profundamente anidado {/*avoid-deeply-nested-state*/}

Imagina un plan de viaje compuesto por planetas, continentes y países. Es posible que sientas la tentación de estructurar tu estado mediante objetos y matrices anidados, como en este ejemplo:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>Lugares para visitar</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js places.js active
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Tierra',
    childPlaces: [{
      id: 2,
      title: 'África',
      childPlaces: [{
        id: 3,
        title: 'Botsuana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egipto',
        childPlaces: []
      }, {
        id: 5,
        title: 'Kenia',
        childPlaces: []
      }, {
        id: 6,
        title: 'Madagascar',
        childPlaces: []
      }, {
        id: 7,
        title: 'Marruecos',
        childPlaces: []
      }, {
        id: 8,
        title: 'Nigeria',
        childPlaces: []
      }, {
        id: 9,
        title: 'Sudáfrica',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Las Américas',
      childPlaces: [{
        id: 11,
        title: 'Argentina',
        childPlaces: []
      }, {
        id: 12,
        title: 'Brasil',
        childPlaces: []
      }, {
        id: 13,
        title: 'Barbados',
        childPlaces: []
      }, {
        id: 14,
        title: 'Canadá',
        childPlaces: []
      }, {
        id: 15,
        title: 'Jamaica',
        childPlaces: []
      }, {
        id: 16,
        title: 'México',
        childPlaces: []
      }, {
        id: 17,
        title: 'Trinidad y Tobago',
        childPlaces: []
      }, {
        id: 18,
        title: 'Venezuela',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Asia',
      childPlaces: [{
        id: 20,
        title: 'China',
        childPlaces: []
      }, {
        id: 21,
        title: 'India',
        childPlaces: []
      }, {
        id: 22,
        title: 'Singapur',
        childPlaces: []
      }, {
        id: 23,
        title: 'Corea del sur',
        childPlaces: []
      }, {
        id: 24,
        title: 'Tailandia',
        childPlaces: []
      }, {
        id: 25,
        title: 'Vietnam',
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'Europa',
      childPlaces: [{
        id: 27,
        title: 'Croacia',
        childPlaces: [],
      }, {
        id: 28,
        title: 'Francia',
        childPlaces: [],
      }, {
        id: 29,
        title: 'Alemania',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Italia',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 32,
        title: 'España',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Turquía',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'Oceanía',
      childPlaces: [{
        id: 35,
        title: 'Australia',
        childPlaces: [],
      }, {
        id: 36,
        title: 'Bora Bora (Polinesia Francesa)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Isla de pascua (Chile)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Fiyi',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Hawái (Estados Unidos)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'Nueva Zelanda',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'Luna',
    childPlaces: [{
      id: 43,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 44,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 45,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'Marte',
    childPlaces: [{
      id: 47,
      title: 'Corn Town',
      childPlaces: []
    }, {
      id: 48,
      title: 'Green Hill',
      childPlaces: []
    }]
  }]
};
```

</Sandpack>

Ahora, supongamos que deseas agregar un botón para eliminar un lugar que ya visitaste. ¿Cómo lo harías? [Actualizar el estado anidado](/learn/updating-objects-in-state#updating-a-nested-object) implica hacer copias de objetos desde la parte que cambió. La eliminación de un lugar profundamente anidado implica copiar toda la cadena de lugares principal. Dicho código puede ser muy detallado.

**Si el estado está demasiado anidado para actualizarse fácilmente, considera hacerlo "plano".** Esta es una manera de reestructurar estos datos. En lugar de una estructura similar a un árbol donde cada `lugar` tiene una matriz de *sus lugares secundarios*, puedes hacer que cada lugar contenga una matriz de *sus ID de lugares secundarios*. Luego puedes almacenar un mapeo de cada ID de lugar al lugar correspondiente.

Esta reestructuración de datos puede recordarte ver una tabla de base de datos:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lugares a visitar</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```

```js places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Tierra',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'África',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botsuana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egipto',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenia',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Marruecos',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Sudáfrica',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Las Américas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brasil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canadá',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'México',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad y Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapur',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Corea del sur',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Tailandia',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europa',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
<<<<<<< HEAD
    title: 'Europa',
    childIds: [28, 29, 30, 31, 32, 33, 34],
  },
  28: {
    id: 28,
    title: 'Croacia',
=======
    title: 'Croacia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'Francia',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  29: {
    id: 29,
<<<<<<< HEAD
    title: 'Francia',
=======
    title: 'Alemania',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  30: {
    id: 30,
<<<<<<< HEAD
    title: 'Alemania',
=======
    title: 'Italia',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  31: {
    id: 31,
<<<<<<< HEAD
    title: 'Italia',
=======
    title: 'Portugal',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
<<<<<<< HEAD
    title: 'España',
=======
    title: 'Turkey',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  34: {
    id: 34,
<<<<<<< HEAD
    title: 'Turquía',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Oceanía',
    childIds: [36, 37, 38, 39, 40, 41, 42],
=======
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
<<<<<<< HEAD
    title: 'Bora Bora (Polinesia Francesa)',
=======
    title: 'Easter Island (Chile)',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  38: {
    id: 38,
<<<<<<< HEAD
    title: 'Isla de Pascua (Chile)',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Fiyi',
=======
    title: 'Fiji',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  39: {
    id: 40,
    title: 'Hawái (Estados Unidos)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
<<<<<<< HEAD
    title: 'Nueva Zelanda',
=======
    title: 'Vanuatu',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  42: {
    id: 42,
    title: 'Luna',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
<<<<<<< HEAD
    title: 'Luna',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita (cráter)',
=======
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  45: {
    id: 45,
<<<<<<< HEAD
    title: 'Piccolomini (cráter)',
=======
    title: 'Tycho',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  46: {
    id: 46,
<<<<<<< HEAD
    title: 'Tycho (cráter)',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Marte',
    childIds: [48, 49]
  },
  48: {
    id: 48,
=======
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

</Sandpack>

**Ahora que el estado es "plano" (también conocido como "normalizado"), la actualización de elementos anidados se vuelve más fácil.**

Para eliminar un lugar ahora, solo necesitas actualizar dos niveles de estado:

* La versión actualizada de su lugar *principal* debería excluir el ID eliminado de su matriz `childIds`.
* La versión actualizada del objeto raíz de "tabla" debe incluir la versión actualizada del lugar principal.

Este es un ejemplo de cómo podrías hacerlo:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Crear una nueva versión del lugar principal
    // que no incluye ID del hijo.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Actualizar el objeto de estado raíz...
    setPlan({
      ...plan,
      // ...para que tenga el padre este actualizado.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lugares a visitar</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Completado
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
<<<<<<< HEAD
    title: 'Tierra',
    childIds: [2, 10, 19, 27, 35]
=======
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
  },
  2: {
    id: 2,
    title: 'África',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botsuana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egipto',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenia',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Marruecos',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Sudáfrica',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Las Américas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brasil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canadá',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'México',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad y Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
<<<<<<< HEAD
    childIds: [20, 21, 22, 23, 24, 25, 26],
=======
    childIds: [20, 21, 22, 23, 24, 25],   
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
<<<<<<< HEAD
    title: 'Singapur',
=======
    title: 'South Korea',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  24: {
    id: 24,
<<<<<<< HEAD
    title: 'Corea del norte',
=======
    title: 'Thailand',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  25: {
    id: 25,
<<<<<<< HEAD
    title: 'Tailandia',
=======
    title: 'Vietnam',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
<<<<<<< HEAD
    title: 'Europa',
    childIds: [28, 29, 30, 31, 32, 33, 34],
  },
  28: {
    id: 28,
    title: 'Croacia',
=======
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  29: {
    id: 29,
<<<<<<< HEAD
    title: 'Francia',
=======
    title: 'Germany',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  30: {
    id: 30,
<<<<<<< HEAD
    title: 'Alemania',
=======
    title: 'Italy',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  31: {
    id: 31,
<<<<<<< HEAD
    title: 'Italia',
=======
    title: 'Portugal',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
<<<<<<< HEAD
    title: 'España',
=======
    title: 'Turkey',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  34: {
    id: 34,
<<<<<<< HEAD
    title: 'Turquía',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Oceanía',
    childIds: [36, 37, 38, 39, 40, 41,, 42],
=======
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
<<<<<<< HEAD
    title: 'Bora Bora (Polinesia Francesa)',
=======
    title: 'Easter Island (Chile)',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  38: {
    id: 38,
<<<<<<< HEAD
    title: 'Isla de Pascua (Chile)',
=======
    title: 'Fiji',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  39: {
    id: 39,
<<<<<<< HEAD
    title: 'Fiyi',
=======
    title: 'Hawaii (the USA)',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  40: {
    id: 40,
<<<<<<< HEAD
    title: 'Hawái (Estados Unidos)',
=======
    title: 'New Zealand',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  41: {
    id: 41,
<<<<<<< HEAD
    title: 'Nueva Zelanda',
=======
    title: 'Vanuatu',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
<<<<<<< HEAD
    title: 'Luna',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita (cráter)',
=======
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  45: {
    id: 45,
<<<<<<< HEAD
    title: 'Piccolomini (cráter)',
=======
    title: 'Tycho',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  46: {
    id: 46,
<<<<<<< HEAD
    title: 'Tycho (cráter)',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Marte',
    childIds: [48, 49]
  },
  48: {
    id: 48,
=======
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

Puede anidar el estado tanto como desees, pero hacerlo "plano" puede resolver numerosos problemas. Facilita la actualización del estado y ayuda a garantizar que no haya duplicación en diferentes partes de un objeto anidado.

<DeepDive>

#### Mejorar el uso de memoria {/*improving-memory-usage*/}

Idealmente, también eliminaría los elementos eliminados (¡y sus hijos!) del objeto "tabla" para mejorar el uso de la memoria. Esta versión lo hace. También [usa Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) para hacer que la lógica de actualización sea más concisa.

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Elimina los ID secundarios del lugar principal.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Olvida este lugar y todo su subárbol.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lugares a visitar</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Completado
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
<<<<<<< HEAD
    title: 'Tierra',
    childIds: [2, 10, 19, 27, 35]
=======
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
  },
  2: {
    id: 2,
    title: 'África',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botsuana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egipto',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenia',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Marruecos',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Sudáfrica',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Las Américas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brasil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canadá',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'México',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad y Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
<<<<<<< HEAD
    childIds: [20, 21, 22, 23, 24, 25, 26],
=======
    childIds: [20, 21, 22, 23, 24, 25,],   
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
<<<<<<< HEAD
    title: 'Singapur',
=======
    title: 'South Korea',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  24: {
    id: 24,
<<<<<<< HEAD
    title: 'Corea del norte',
=======
    title: 'Thailand',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  25: {
    id: 25,
<<<<<<< HEAD
    title: 'Tailandia',
=======
    title: 'Vietnam',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
<<<<<<< HEAD
    title: 'Europa',
    childIds: [28, 29, 30, 31, 32, 33, 34],
  },
  28: {
    id: 28,
    title: 'Croacia',
=======
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  29: {
    id: 29,
<<<<<<< HEAD
    title: 'Francia',
=======
    title: 'Germany',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  30: {
    id: 30,
<<<<<<< HEAD
    title: 'Alemania',
=======
    title: 'Italy',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  31: {
    id: 31,
<<<<<<< HEAD
    title: 'Italia',
=======
    title: 'Portugal',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
<<<<<<< HEAD
    title: 'España',
=======
    title: 'Turkey',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  34: {
    id: 34,
<<<<<<< HEAD
    title: 'Turquía',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Oceanía',
    childIds: [36, 37, 38, 39, 40, 41,, 42],
=======
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40,, 41],   
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
<<<<<<< HEAD
    title: 'Bora Bora (Polinesia Francesa)',
=======
    title: 'Easter Island (Chile)',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  38: {
    id: 38,
<<<<<<< HEAD
    title: 'Isla de Pascua (Chile)',
=======
    title: 'Fiji',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  39: {
    id: 39,
<<<<<<< HEAD
    title: 'Fiyi',
=======
    title: 'Hawaii (the USA)',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  40: {
    id: 40,
<<<<<<< HEAD
    title: 'Hawái (Estados Unidos)',
=======
    title: 'New Zealand',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  41: {
    id: 41,
<<<<<<< HEAD
    title: 'Nueva Zelanda',
=======
    title: 'Vanuatu',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
<<<<<<< HEAD
    title: 'Luna',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita (cráter)',
=======
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  45: {
    id: 45,
<<<<<<< HEAD
    title: 'Piccolomini (cráter)',
=======
    title: 'Tycho',
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    childIds: []
  },
  46: {
    id: 46,
<<<<<<< HEAD
    title: 'Tycho (cráter)',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Marte',
    childIds: [48, 49]
  },
  48: {
    id: 48,
=======
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</DeepDive>

A veces, también puedes reducir el anidamiento de estados moviendo algunos de los estados anidados a los componentes secundarios. Esto funciona bien para el estado efímero de la interfaz de usuario que no necesita almacenarse, por ejemplo, si se pasa el cursor por encima de un elemento.

<Recap>

* Si dos variables de estado siempre se actualizan juntas, considera combinarlas en una.
* Elige cuidadosamente tus variables de estado para evitar crear estados "imposibles".
* Estructura tu estado de una manera que reduzca las posibilidades de que cometas un error al actualizarlo.
* Evita el estado redundante y duplicado para que no necesites mantenerlo sincronizado.
* No pongas props *en* estado a menos que desees evitar específicamente las actualizaciones.
* Para patrones de interfaz de usuario como la selección, mantén el ID o el índice en estado en lugar del objeto mismo.
* Si actualizar el estado profundamente anidado es complicado, intenta aplanarlo.

</Recap>

<Challenges>

#### Arreglar un componente que no se actualiza {/*fix-a-component-thats-not-updating*/}

Este componente `Reloj` recibe dos props: `color` y `tiempo`. Cuando seleccionas un color diferente en el cuadro de selección, el componente `Reloj` recibe una prop de `color` diferente de su componente principal. Sin embargo, por alguna razón, el color mostrado no se actualiza. ¿Por qué? Arregla el problema.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Selecciona un color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

El problema es que este componente tiene un estado de `color` inicializado con el valor inicial de la prop `color`. Pero cuando cambia la prop `color`, ¡esto no afecta la variable de estado! Entonces se desincronizan. Para solucionar este problema, elimina la variable de estado por completo y use la prop `color` directamente.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Selecciona un color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

O, usando la sintaxis de desestructuración:

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

#### Arreglar una lista de empaque rota {/*fix-a-broken-packing-list*/}

Esta lista de empaque tiene un pie de página que muestra cuántos artículos están empacados y cuántos artículos hay en total. Al principio parece funcionar, pero tiene errores. Por ejemplo, si marcas un artículo como empaquetado y luego lo eliminas, el contador no se actualizará correctamente. Arregla el contador para que esté siempre correcto.

<Hint>

¿Algún estado en este ejemplo es redundante?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Calcetines cálidos', packed: true },
  { id: 1, title: 'Diario de viaje', packed: false },
  { id: 2, title: 'Acuarelas', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>¡{packed} de {total} empacados!</b>
    </>
  );
}
```

```js AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Agregar ítem"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Agregar</button>
    </>
  )
}
```

```js PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Aunque podrías cambiar cuidadosamente cada controlador de evento para actualizar correctamente los contadores `total` y `packed`, el problema principal es que estas variables de estado existan desde un inicio. Son redundantes porque siempre se puede calcular el número de elementos (empaquetados o totales) a partir de la propia matriz `items`. Elimine el estado redundante para corregir el error:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Calcetines cálidos', packed: true },
  { id: 1, title: 'Diario de viaje', packed: false },
  { id: 2, title: 'Acuarelas', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>¡{packed} de {total} empacados!</b>
    </>
  );
}
```

```js AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Agregar ítem"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Agregar</button>
    </>
  )
}
```

```js PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Observa cómo los controladores de eventos solo se preocupan por llamar a `setItems` después de este cambio. Los recuentos de elementos ahora se calculan durante el siguiente renderizado desde `items`, por lo que siempre están actualizados.

</Solution>

#### Reparar la selección que desaparece {/*fix-the-disappearing-selection*/}

Hay una lista de `letters` en el estado. Cuando se pasa el ratón o se enfoca una carta en particular, ésta se resalta. La carta resaltada actualmente se almacena en la variable de estado `highlightedLetter`. Puedes "marcar" y "desmarcar" cartas individuales, lo que actualiza el _array_ de `letters` en el estado.

Este código funciona, pero hay un pequeño fallo en la UI. Cuando presionas "Marcar" o "Desmarcar", el resaltado desaparece por un momento. Sin embargo, reaparece en cuanto mueves el puntero o cambias a otra carta con el teclado. ¿Por qué ocurre esto? Arréglalo para que el resaltado no desaparezca después de hacer clic en el botón.

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Buzón de entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Desmarcar' : 'Marcar'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: '¿Listo para la aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: '¡Hora de registrarse!',
  isStarred: false,
}, {
  id: 2,
  subject: '¡El festival comienza en solo SIETE días!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

El problema es que estás manteniendo el objeto carta en `highlightedLetter`. Pero también estás guardando la misma información en el _array_ `letters`. Así que tu estado está duplicado. Cuando actualizas el _array_ `letters` después de pulsar el botón, creas un nuevo objeto carta que es diferente de `highlightedLetter`. Esta es la razón por la que la verificación `highlightedLetter === letter` se convierte en `false`, y el resaltado desaparece. Reaparecerá la próxima vez que llames a `setHighlightedLetter` cuando el puntero se mueva.

Para solucionar el problema, elimina la duplicación del estado. En lugar de almacenar *la propia carta* en dos lugares, almacena el `highlightedId` en su lugar. Entonces puedes comprobar `isHighlighted` para cada carta con `letter.id === highlightedId`, lo que funcionará incluso si el objeto `letter` ha cambiado desde el último renderizado.

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Buzón de entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Desmarcar' : 'Marcar'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: '¿Listo para la aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: '¡Hora de registrarse!',
  isStarred: false,
}, {
  id: 2,
  subject: '¡El festival comienza en solo SIETE días!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

#### Implementar la selección múltiple. {/*implement-multiple-selection*/}

En este ejemplo, cada `Letter` tiene una propiedad `isSelected` y un controlador `onToggle` que la marca como seleccionada. Esto funciona, pero el estado se almacena como un `selectedId` (ya sea `null` o un ID), por lo que solo se puede seleccionar una carta en un momento dado.

Cambia la estructura de estado para admitir la selección múltiple. (¿Cómo lo estructurarías? Piensa en esto antes de escribir el código). Cada casilla de verificación debe independizarse de las demás. Al hacer clic en una carta seleccionada, debería desmarcarse. Por último, el pie de página debe mostrar el número correcto de los elementos seleccionados.

<Hint>

En lugar de un único ID seleccionado, es posible que desees mantener una matriz o un[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) de IDs seleccionados en el estado.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: permitir selección múltiple
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: permitir selección múltiple
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>Buzón de entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: permitir selección múltiple
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Has seleccionado {selectedCount} cartas
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: '¿Listo para la aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: '¡Hora de registrarse!',
  isStarred: false,
}, {
  id: 2,
  subject: '¡El festival comienza en solo SIETE días!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

En lugar de un solo `selectedId`, mantén un *array* `selectedIds` en el estado. Por ejemplo, si selecciona la primera y la última carta, contendría `[0, 2]`. Cuando no se selecciona nada, sería un *array* `[]` vacío:

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // ¿Qué fue seleccionado previamente?
    if (selectedIds.includes(toggledId)) {
      // Luego elimine este ID del array.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // De lo contrario, agrega este ID al array.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>Buzón de entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Has seleccionado {selectedCount} cartas
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: '¿Listo para la aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: '¡Hora de registrarse!',
  isStarred: false,
}, {
  id: 2,
  subject: '¡El festival comienza en solo SIETE días!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Una desventaja menor de usar un array es que para cada elemento, está llamando `selectedIds.includes (letter.id)` para verificar si está seleccionado. Si el array es muy grande, esto puede convertirse en un problema de rendimiento porque la búsqueda de arrays con [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) toma un tiempo lineal, y está realizando esta búsqueda para cada elemento individual.

Para solucionar esto, puede mantener un [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) en estado, lo que proporciona una operación rápida [`has( )`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has):

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Crea una copia (para evitar la mutación).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>Buzón de entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Has seleccionado {selectedCount} cartas
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: '¿Listo para la aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: '¡Hora de registrarse!',
  isStarred: false,
}, {
  id: 2,
  subject: '¡El festival comienza en solo SIETE días!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Ahora cada elemento realiza una comprobación `selectedIds.has(letter.id)`, que es muy rápida.

Ten en cuenta que [no debes mutar objetos en estado](/learn/updating-objects-in-state), y eso también incluye Sets. Esta es la razón por la cual la función `handleToggle` crea una *copia* del Set primero y luego actualiza esa copia.

</Solution>

</Challenges>
