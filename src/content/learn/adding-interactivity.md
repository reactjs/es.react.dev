---
title: Agregar interactividad
---

<Intro>

Algunas cosas en la pantalla se actualizan en respuesta a la entrada del usuario. Por ejemplo, hacer clic en una galería de imágenes cambia la imagen activa. En React, los datos que cambian con el tiempo se denominan *estado.* Puedes agregar estado a cualquier componente y actualizarlo según sea necesario. En este capítulo, aprenderás a escribir componentes que controlen interacciones, actualicen tu estado y muestren resultados diferentes a lo largo del tiempo.

</Intro>

<YouWillLearn isChapter={true}>

* [Cómo controlar eventos iniciados por el usuario](/learn/responding-to-events)
* [Cómo hacer que los componentes "recuerden" información con estado](/learn/state-a-components-memory)
* [Cómo React actualiza la interfaz de usuario en dos fases](/learn/render-and-commit)
* [Por qué el estado no se actualiza justo después de cambiarlo](/learn/state-as-a-snapshot)
* [Cómo poner en cola varias actualizaciones de estado](/learn/queueing-a-series-of-state-updates)
* [Cómo actualizar un objeto en el estado](/learn/updating-objects-in-state)
* [Cómo actualizar un array en el estado](/learn/updating-arrays-in-state)

</YouWillLearn>

## Responder a eventos {/*responding-to-events*/}

React te permite agregar controladores de eventos a tu JSX. Los controladores de eventos son tus propias funciones que se activarán en respuesta a las interacciones del usuario, como hacer clic, pasar el mouse, enfocarse en las entradas de un formulario, etc.

Los componentes integrados como `<button>` solo admiten eventos de navegador integrados como `onClick`. Sin embargo, también puedes crear tus propios componentes y darle a sus props de controladores de eventos los nombres específicos de la aplicación que desees.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('¡Reproduciendo!')}
      onUploadImage={() => alert('¡Cargando!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Reproducir película
      </Button>
      <Button onClick={onUploadImage}>
        Cargar imagen
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

Lee **[Responder a eventos](/learn/responding-to-events)** para aprender cómo agregar controladores de eventos.

</LearnMore>

## El estado: la memoria de un componente {/*state-a-components-memory*/}

Los componentes a menudo necesitan cambiar lo que aparece en la pantalla como resultado de una interacción. Escribir en el formulario debería actualizar el campo de entrada, hacer clic en "siguiente" en un carrusel de imágenes debería cambiar la imagen que se muestra, hacer clic en "comprar" pone un producto en el carrito de compras. Los componentes necesitan "recordar" cosas: el valor de entrada actual, la imagen actual, el carrito de compras. En React, este tipo de memoria específica del componente se llama *estado*.

Puedes agregar estado a un componente con un [`useState`](/reference/react/useState) Hook. Los *Hooks* son funciones especiales que permiten que tus componentes usen funciones de React (el estado es una de esas funciones). El Hook `useState` te permite declarar una variable de estado. Toma el estado inicial y devuelve un par de valores: el estado actual y una función de establecimiento de estado que te permite actualizarlo.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Así es como una galería de imágenes usa y actualiza el estado al hacer clic:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Siguiente
      </button>
      <h2>
        <i>{sculpture.name} </i>
        por {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} de {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Ocultar' : 'Mostrar'} detalles
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Aunque Colvin es predominantemente conocida por temas abstractos que aluden a símbolos prehispánicos, esta gigantesca escultura, un homenaje a la neurocirugía, es una de sus obras de arte público más reconocibles.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Una estatua de bronce de dos manos cruzadas sosteniendo delicadamente un cerebro humano en la punta de sus dedos.'
}, {
  name: 'Floralis genérica',
  artist: 'Eduardo Catalano',
  description: 'Esta enorme flor plateada (75 pies o 23 m) se encuentra en Buenos Aires. Está diseñado para moverse, cerrando sus pétalos por la tarde o cuando soplan fuertes vientos y abriéndolos por la mañana.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Una gigantesca escultura de flor metálica con pétalos reflectantes como espejos y fuertes estambres.'
}, {
  name: 'Presencia eterna',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conocido por su preocupación por la igualdad, la justicia social, así como por las cualidades esenciales y espirituales de la humanidad. Este bronce masivo (7 pies o 2,13 m) representa lo que él describió como "una presencia negra simbólica infundida con un sentido de humanidad universal"."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La escultura que representa una cabeza humana parece omnipresente y solemne. Irradia calma y serenidad.'
}, {
  name: 'Moái',
  artist: 'Artista desconocido',
  description: 'Ubicados en la Isla de Pascua, hay 1,000 moáis, o estatuas monumentales existentes, creadas por los primeros rapanui, que algunos creen que representan a ancestros deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Tres bustos monumentales de piedra con las cabezas desproporcionadamente grandes con rostros sombríos.'
}, {
  name: 'Nana azul',
  artist: 'Niki de Saint Phalle',
  description: 'Las Nanas son criaturas triunfantes, símbolos de feminidad y maternidad. En un principio, Saint Phalle utilizaba telas y objetos encontrados para las Nanas, y más tarde introdujo el poliéster para conseguir un efecto más vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Gran escultura en mosaico de una caprichosa figura femenina bailando con un colorido traje que emana alegría.'
}, {
  name: 'Forma definitiva',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstracta de bronce es parte de la serie La Familia del Hombre ubicada en Yorkshire Sculpture Park. Hepworth optó por no crear representaciones literales del mundo, sino que desarrolló formas abstractas inspiradas en personas y paisajes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Una escultura alta formada por tres elementos apilados unos sobre otros que recuerdan una figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendiente de cuatro generaciones de talladores de madera, el trabajo de Fakeye combinó temas yoruba tradicionales y contemporáneos.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Una intrincada escultura de madera de un guerrero con el rostro centrado en un caballo adornado con motivos.'
}, {
  name: 'Grandes barrigas',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow es conocida por sus esculturas del cuerpo fragmentado como metáfora de la fragilidad y la impermanencia de la juventud y la belleza. Esta escultura representa dos barrigas grandes muy realistas apiladas una encima de otra, cada una de unos cinco pies (1,5 m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La escultura recuerda una cascada de pliegues, muy diferente a los vientres de las esculturas clásicas.'
}, {
  name: 'Guerreros de terracota',
  artist: 'Artista desconocido',
  description: 'Los Guerreros de terracota es una colección de esculturas de terracota que representan los ejércitos de Qin Shi Huang, el primer emperador de China. El ejército constaba de más de 8.000 soldados, 130 carros con 520 caballos y 150 caballos de caballería.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreros solemnes, cada uno con una expresión facial y una armadura únicas.'
}, {
  name: 'Paisaje lunar',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conocida por recoger objetos de los escombros de la ciudad de Nueva York, que luego ensamblaría en construcciones monumentales. En este, usó partes dispares como un poste de cama, una clava de malabarista y un fragmento de asiento, clavándolos y pegándolos en cajas que reflejan la influencia de la abstracción geométrica del espacio y la forma del cubismo.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Una escultura negra mate donde los elementos individuales son inicialmente indistinguibles.'
}, {
  name: 'Aureola',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusiona lo tradicional y lo moderno, lo natural y lo industrial. Su arte se centra en la relación entre el hombre y la naturaleza. Su trabajo fue descrito como convincente tanto en sentido abstracto como figurado, que desafía la gravedad y una "fina síntesis de materiales inverosímiles".',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Una escultura parecida a un alambre pálido montada en una pared de hormigón y descendiendo al suelo. Parece ligero.'
}, {
  name: 'Hipopótamos',
  artist: 'Zoológico de Taipei',
  description: 'El Zoológico de Taipei encargó una Plaza del Hipopótamo con hipopótamos sumergidos jugando.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Un grupo de esculturas de hipopótamos de bronce que emergen de la acera como si estuvieran nadando.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Lee **[El estado: la memoria de un componente](/learn/state-a-components-memory)** para aprender a recordar un valor y actualizarlo en la interacción.

</LearnMore>

## Renderizado y confirmación {/*render-and-commit*/}

Antes de que tus componentes se muestren en la pantalla, deben ser renderizados por React. Comprender los pasos de este proceso te ayudará a pensar en cómo se ejecuta tu código y explicar su comportamiento.

Imagina que tus componentes son cocineros en la cocina, montando sabrosos platos a partir de los ingredientes. En este escenario, React es el camarero que hace las peticiones de los clientes y les trae sus pedidos. Este proceso de solicitud y servicio de UI tiene tres pasos:

1. **Desencadenamiento** de un renderizado (entrega del pedido del cliente a la cocina)
2. **Renderizado** del componente (preparación del pedido en la cocina)
3. **Confirmación** con el DOM (poner el pedido sobre la mesa)

<IllustrationBlock sequential>
  <Illustration caption="Desencadenamiento" alt="React como un camarero en un restaurante, recogiendo los pedidos de los usuarios y entregándolos a la Cocina de Componentes." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Renderizado" alt="El Chef de tarjetas le da a React un nuevo componente tarjeta." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Confirmación" alt="React entrega la tarjeta al usuario en su mesa." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Lee **[Renderizado y confirmación](/learn/render-and-commit)** para conocer el ciclo de vida de una actualización de la interfaz de usuario.

</LearnMore>

## El estado como una instantánea {/*state-as-a-snapshot*/}

A diferencia de las variables regulares de JavaScript, el estado de React se comporta más como una instantánea. Establecerlo no cambia la variable de estado que ya tienes, sino que activa una nuevo renderizado. ¡Esto puede ser sorprendente al principio!

```js
console.log(count);  // 0
setCount(count + 1); // Solicitar un nuevo renderizado con 1.
console.log(count);  // ¡Todavía 0!
```

Este comportamiento te ayuda a evitar errores sutiles. Aquí hay una pequeña aplicación de chat. Intenta adivinar qué sucede si presionas "Enviar" primero y *luego* cambias el destinatario a Bob. ¿El nombre de quién aparecerá en la `alerta` cinco segundos después?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hola');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Le dijiste ${message} a ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Para:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Mensaje"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Lee **[El estado como una instantánea](/learn/state-as-a-snapshot)** para saber por qué el estado aparece "fijo" y sin cambios dentro de los controladores de eventos.

</LearnMore>

## Poner en cola una serie de actualizaciones de estado {/*queueing-a-series-of-state-updates*/}

Este componente tiene errores: hacer clic en "+3" incrementa la puntuación solo una vez.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Puntaje: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[El estado como una instantánea](/learn/state-as-a-snapshot) explica por qué sucede esto. Al establecer el estado se solicita un nuevo rerenderizado, pero no lo cambia en el código que ya se está ejecutando. Entonces `score` sigue siendo `0` justo después de llamar a `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Puedes solucionar esto pasando una *función de actualización* al configurar el estado. Observa cómo reemplazar `setScore(score + 1)` con `setScore(s => s + 1)` corrige el botón "+3". Esto te permite poner en cola múltiples actualizaciones de estado.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Puntaje: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Lee **[Poner en cola una serie de actualizaciones del estado](/learn/queueing-a-series-of-state-updates)** para obtener información sobre cómo poner en cola una secuencia de actualizaciones de estado.

</LearnMore>

## Actualizar objetos en el estado {/*updating-objects-in-state*/}

El estado puede contener cualquier tipo de valor de JavaScript, incluidos los objetos. Pero no debes cambiar los objetos y arrays que tienes en el estado de React directamente. En cambio, cuando desees actualizar un objeto y un array, debes crear uno nuevo (o hacer una copia de uno existente) y luego actualizar el estado para usar esa copia.

Por lo general, usarás la sintaxis de propagación `...` para copiar objetos y arrays que desees cambiar. Por ejemplo, actualizar un objeto

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Nana azul',
      city: 'Hamburgo',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Nombre:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Título:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Ciudad:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Imagen:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' de '}
        {person.name}
        <br />
        (ubicado en {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Si copiar objetos en el código se vuelve tedioso, puedes usar una biblioteca como [Immer](https://github.com/immerjs/use-immer) para reducir el código repetitivo:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Nana azul',
      city: 'Hamburgo',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Nombre:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Título:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Ciudad:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Imagen:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' de '}
        {person.name}
        <br />
        (ubicado en {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

Lee **[Actualizar objetos en el estado](/learn/updating-objects-in-state)** para aprender cómo actualizar objetos correctamente.

</LearnMore>

## Actualizar arrays en el estado {/*updating-arrays-in-state*/}

Los arrays son otro tipo de objetos de JavaScript mutables que puedes almacenar en el estado y debes tratar como de solo lectura. Al igual que con los objetos, cuando deseas actualizar un array almacenado en el estado, se debe crear uno nuevo (o hacer una copia de uno existente) y luego configurar el estado para utilizar el nuevo array:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Grandes barrigas', seen: false },
  { id: 1, title: 'Paisaje lunar', seen: false },
  { id: 2, title: 'Guerreros de terracota', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Lista de deseos de arte</h1>
      <h2>Mi lista de arte para ver:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Si copiar arrays en el código se vuelve tedioso, puedes usar una biblioteca como [Immer](https://github.com/immerjs/use-immer) para reducir el código repetitivo:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Grandes barrigas', seen: false },
  { id: 1, title: 'Paisaje lunar', seen: false },
  { id: 2, title: 'Guerreros de terracota', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Lista de deseos de arte</h1>
      <h2>Mi lista de arte para ver:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
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

<LearnMore path="/learn/updating-arrays-in-state">

Lee **[Actualizar arrays en el estado](/learn/updating-arrays-in-state)** para aprender a actualizar arrays correctamente.

</LearnMore>

## ¿Qué sigue? {/*whats-next*/}

Dirígete a [Responder a eventos](/learn/responding-to-events) para comenzar a leer este capítulo página por página.

O, si ya estás familiarizado con estos temas, ¿por qué no lees sobre [Gestión del estado](/learn/managing-state)?
