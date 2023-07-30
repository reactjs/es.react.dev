---
title: "El estado: la memoria de un componente"
---

<Intro>

Los componentes a menudo necesitan cambiar lo que se muestra en pantalla como resultado de una interacción. Escribir dentro de un formulario debería actualizar el campo de texto, hacer clic en "siguiente" en un carrusel de imágenes debería cambiar la imagen que es mostrada; hacer clic en un botón para comprar un producto debería actualizar el carrito de compras. En los ejemplos anteriores los componentes deben "recordar" cosas: el campo de texto, la imagen actual, el carrito de compras. En React, a este tipo de memoria de los componentes se le conoce como estado.

</Intro>

<YouWillLearn>

* Cómo agregar una variable de estado con el Hook de [`useState`](/reference/react/useState) 
* Qué par de valores devuelve el hook de `useState`
* Cómo agregar más de una variable de estado
* Por qué se le llama local al estado

</YouWillLearn>

## Cuando una variable regular no es suficiente {/*when-a-regular-variable-isnt-enough*/}

Aquí hay un componente que renderiza una imagen de una escultura. Al hacer clic en el botón "Siguiente", debería mostrarse la siguiente escultura cambiando el índice `index` a `1`, luego a `2`, y así sucesivamente. Sin embargo, esto **no funcionará** (¡puedes intentarlo!):

<Sandpack>

```js
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Siguiente
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        por {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} de {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Aunque Colvin es predominantemente conocida por temas abstractos que aluden a símbolos prehispánicos, esta gigantesca escultura, un homenaje a la neurocirugía, es una de sus obras de arte público más reconocibles.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Una estatua de bronce de dos manos cruzadas sosteniendo delicadamente un cerebro humano con la punta de sus dedos.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Tsta enorme flor plateada (75 pies o 23 m) se encuentra en Buenos Aires. Está diseñado para moverse, cerrando sus pétalos por la tarde o cuando soplan fuertes vientos y abriéndolos por la mañana.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conocido por su preocupación por la igualdad y la justicia social, así como por las cualidades esenciales y espirituales de la humanidad. Esta enorme pieza de bronce (de 7 pies o 2,13 metros) representa lo que él describió como "una presencia negra simbólica impregnada de un sentido de humanidad universal".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La escultura que representa una cabeza humana parece omnipresente y solemne. Irradia calma y serenidad.'
}, {
  name: 'Moai',
  artist: 'Artista Desconocido',
  description: 'Ubicados en la Isla de Pascua, hay 1000 moai, o estatuas monumentales existentes, creadas por los primeros Rapa Nui, que algunos creen que representaban a ancestros deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Tres bustos monumentales de piedra con las cabezas desproporcionadamente grandes con rostros sombríos.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Las Nanas son criaturas triunfantes, símbolos de feminidad y maternidad. En un principio, Saint Phalle utilizaba telas y objetos encontrados para las Nanas, y más tarde introdujo el poliéster para conseguir un efecto más vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Una gran escultura de mosaico de una caprichosa figura femenina bailando con un colorido traje que emana alegría.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstracta de bronce es parte de la serie The Family of Man ubicada en Yorkshire Sculpture Park. Hepworth optó por no crear representaciones literales del mundo, sino que desarrolló formas abstractas inspiradas en personas y paisajes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Una escultura alta formada por tres elementos apilados unos sobre otros que recuerdan una figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendiente de cuatro generaciones de talladores de madera, el trabajo de Fakeye combinó temas Yoruba tradicionales y contemporáneos.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Una intrincada escultura de madera de un guerrero con el rostro centrado en un caballo adornado con patrones.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow es conocida por sus esculturas del cuerpo fragmentado como metáfora de la fragilidad y la impermanencia de la juventud y la belleza. Esta escultura representa dos vientres grandes muy realistas apilados uno encima del otro, cada uno de unos cinco pies (1,5 m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La escultura recuerda una cascada de pliegues, muy diferente a los vientres de las esculturas clásicas.'
}, {
  name: 'Terracotta Army',
  artist: 'Artista Desconocido',
  description: 'El Ejército de terracota es una colección de esculturas de terracota que representan los ejércitos de Qin Shi Huang, el primer emperador de China. El ejército constaba de más de 8.000 soldados, 130 carros con 520 caballos y 150 caballos de caballería.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreros solemnes, cada uno con una expresión facial y una armadura únicas.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conocida por recoger objetos de los escombros de la ciudad de Nueva York, que luego ensamblaría en construcciones monumentales. En este, usó partes dispares como un poste de la cama, un alfiler de malabares y un fragmento de asiento, clavándolos y pegándolos en cajas que reflejan la influencia de la abstracción geométrica del espacio y la forma del cubismo.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Una escultura negra mate donde los elementos individuales son inicialmente indistinguibles.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusiona lo tradicional y lo moderno, lo natural y lo industrial. Su arte se centra en la relación entre el hombre y la naturaleza. Su trabajo fue descrito como convincente tanto abstracta como figurativamente, desafiando la gravedad, y una "fina síntesis de materiales inverosímiles.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Una escultura parecida a un alambre montado en una pared de hormigón que desciende al suelo. Parece ligero.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'El Zoológico de Taipei realizó una Zona de Hipopótamos con hipopótamos sumergidos jugando.',
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

El controlador de evento `handleClick` está actualizando una variable local, `index`. Pero dos cosas impiden que ese cambio sea visible:

1. **Las variables locales no persisten entre renderizaciones.** Cuando React renderiza este componente por segunda vez, lo hace desde cero, no considera ningún cambio en las variables locales.
2. **Los cambios en las variables locales no activarán renderizaciones.** React no se da cuenta de que necesita renderizar el componente nuevamente con los nuevos datos.

Para actualizar un componente con datos nuevos, deben pasar las siguientes dos cosas:

1. **Conservar** los datos entre renderizaciones.
2. **Provocar** que React renderice el componente con nuevos datos (re-renderizado).

El Hook de [`useState`](/reference/react/useState) ofrece dos cosas:

1. Una **variable de estado** para mantener los datos entre renderizados.
2. Una **función que setea el estado** para actualizar la variable y provocar que React renderice el componente nuevamente.

## Agregar una variable de estado {/*adding-a-state-variable*/}

Para agregar una variable de estado, debemos importar el `useState` de React al inicio del archivo:

```js
import { useState } from 'react';
```

Luego, reemplazamos esta línea:

```js
let index = 0;
```

con

```js
const [index, setIndex] = useState(0);
```

`index` es una variable de estado y `setIndex` es la función que setea el estado.

> La sintaxis de `[` y `]` se le conoce cómo [desestructuración de un array](https://javascript.info/destructuring-assignment) y permite leer valores de un array. El array devuelto por `useState` siempre contará con exactamente dos valores.

Así es como funcionan juntos en el `handleClick`:

```js
function handleClick() {
  setIndex(index + 1);
}
```

Ahora al hacer clic en el botón "Siguiente" cambia la escultura actual:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Siguiente
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        por {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} de {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Aunque Colvin es predominantemente conocida por temas abstractos que aluden a símbolos prehispánicos, esta gigantesca escultura, un homenaje a la neurocirugía, es una de sus obras de arte público más reconocibles.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Una estatua de bronce de dos manos cruzadas sosteniendo delicadamente un cerebro humano con la punta de sus dedos.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Esta enorme flor plateada (75 pies o 23 m) se encuentra en Buenos Aires. Está diseñado para moverse, cerrando sus pétalos por la tarde o cuando soplan fuertes vientos y abriéndolos por la mañana.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conocido por su preocupación por la igualdad y la justicia social, así como por las cualidades esenciales y espirituales de la humanidad. Esta enorme pieza de bronce (de 7 pies o 2,13 metros) representa lo que él describió como "una presencia negra simbólica impregnada de un sentido de humanidad universal".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La escultura que representa una cabeza humana parece omnipresente y solemne. Irradia calma y serenidad.'
}, {
  name: 'Moai',
  artist: 'Artista Desconocido',
  description: 'Ubicados en la Isla de Pascua, hay 1000 moai, o estatuas monumentales existentes, creadas por los primeros Rapa Nui, que algunos creen que representaban a ancestros deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Tres bustos monumentales de piedra con las cabezas desproporcionadamente grandes con rostros sombríos.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Las Nanas son criaturas triunfantes, símbolos de feminidad y maternidad. En un principio, Saint Phalle utilizaba telas y objetos encontrados para las Nanas, y más tarde introdujo el poliéster para conseguir un efecto más vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Una gran escultura de mosaico de una caprichosa figura femenina bailando con un colorido traje que emana alegría.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstracta de bronce es parte de la serie The Family of Man ubicada en Yorkshire Sculpture Park. Hepworth optó por no crear representaciones literales del mundo, sino que desarrolló formas abstractas inspiradas en personas y paisajes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Una escultura alta formada por tres elementos apilados unos sobre otros que recuerdan una figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendiente de cuatro generaciones de talladores de madera, el trabajo de Fakeye combinó temas Yoruba tradicionales y contemporáneos.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Una intrincada escultura de madera de un guerrero con el rostro centrado en un caballo adornado con patrones.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow es conocida por sus esculturas del cuerpo fragmentado como metáfora de la fragilidad y la impermanencia de la juventud y la belleza. Esta escultura representa dos vientres grandes muy realistas apilados uno encima del otro, cada uno de unos cinco pies (1,5 m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La escultura recuerda una cascada de pliegues, muy diferente a los vientres de las esculturas clásicas.'
}, {
  name: 'Terracotta Army',
  artist: 'Artista Desconocido',
  description: 'El Ejército de terracota es una colección de esculturas de terracota que representan los ejércitos de Qin Shi Huang, el primer emperador de China. El ejército constaba de más de 8.000 soldados, 130 carros con 520 caballos y 150 caballos de caballería.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreros solemnes, cada uno con una expresión facial y una armadura únicas.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conocida por recoger objetos de los escombros de la ciudad de Nueva York, que luego ensamblaría en construcciones monumentales. En este, usó partes dispares como un poste de la cama, un alfiler de malabares y un fragmento de asiento, clavándolos y pegándolos en cajas que reflejan la influencia de la abstracción geométrica del espacio y la forma del cubismo.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Una escultura negra mate donde los elementos individuales son inicialmente indistinguibles.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusiona lo tradicional y lo moderno, lo natural y lo industrial. Su arte se centra en la relación entre el hombre y la naturaleza. Su trabajo fue descrito como convincente tanto abstracta como figurativamente, desafiando la gravedad, y una "fina síntesis de materiales inverosímiles.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Una escultura parecida a un alambre montado en una pared de hormigón que desciende al suelo. Parece ligero.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'El Zoológico de Taipei realizó una Zona de Hipopótamos con hipopótamos sumergidos jugando.',
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

### Conoce tu primer Hook {/*meet-your-first-hook*/}

En React, `useState`, así como cualquier otra función que empiece con "`use`", se le conoce como Hook.

Los *Hooks* son funciones especiales que sólo están disponibles mientras React está [renderizando](/learn/render-and-commit#step-1-trigger-a-render) (algo que veremos con más detalle en la página siguiente). Los Hooks permiten "engancharnos" a diferentes características de React.

El estado es solo una de esas características, pero conoceremos los otros Hooks más adelante.

<Pitfall>

**Las funciones-Hook que empiecen con `use` deben ser solo llamadas en el nivel superior de los componentes o [en tus propios Hooks.](/learn/reusing-logic-with-custom-hooks)** No podemos usar Hooks dentro de condicionales, bucles, u otras funciones anidadas. Los Hooks son funciones, pero es útil pensar en ellos como declaraciones independientes de las necesidades de nuestro componente. Las funciones de React se "usan" en la parte superior del componente de manera similar a cómo se "importan" módulos en la parte superior de un archivo.

</Pitfall>

### Anatomía del `useState` {/*anatomy-of-usestate*/}

Cuando llamamos al [`useState`](/reference/react/useState), le estamos diciendo a React que debe recordar algo:

```js
const [index, setIndex] = useState(0);
```

En este caso, queremos que React recuerde el `index`.

<Note>

> La convención es nombrar estas dos variables como `const [algo, setAlgo]`. Podemos nombrarlo como queramos, pero mantener las convenciones hacen que las cosas sean más fáciles de entender en todos los proyectos.

</Note>

El único argumento para `useState` es el **valor inicial** de su variable de estado. En este ejemplo, el valor inicial de `index` se establece en `0` con `useState(0)`.

Cada vez que el componente se renderiza, el `useState` devuelve un *array* que contiene dos valores:

1. La **variable de estado** (`index`) con el valor que almacenaste.
2. La **función que establece el estado** (`setIndex`) que puede actualizar la variable de estado y alertar a React para que renderice el componente nuevamente.

Así es como sucede en acción:

```js
const [index, setIndex] = useState(0);
```

1. **Tu componente se renderiza por primera vez.** Debido a que pasamos `0` a `useState` como valor inicial para `index`, esto devolverá `[0, setIndex]`. React recuerda que `0` es el último valor de estado.
2. **Actualizas el estado.** Cuando un usuario hace clic en el botón, llama a `setIndex(index + 1)`. `index` es `0`, por lo tanto es `setIndex(1)`. Esto le dice a React que recuerde que `index` es `1` ahora y ejecuta otro renderizado.
3. **El componente se renderiza por segunda vez.** React todavía ve `useState(0)`, pero debido a que React *recuerda* que estableció `index` en `1`, devuelve `[1, setIndex]` en su lugar.
4. ¡Y así sucesivamente!

## Colocar múltiples variables de estado a un componente {/*giving-a-component-multiple-state-variables*/}

Podemos tener más de una variable de estado de diferentes tipos en un componente. Este componente tiene dos variables de estado, un `index` numérico y un `showMore` booleano que se activa al hacer clic en "Mostrar detalles":

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
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

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Aunque Colvin es predominantemente conocida por temas abstractos que aluden a símbolos prehispánicos, esta gigantesca escultura, un homenaje a la neurocirugía, es una de sus obras de arte público más reconocibles.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Una estatua de bronce de dos manos cruzadas sosteniendo delicadamente un cerebro humano con la punta de sus dedos.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Esta enorme flor plateada (75 pies o 23 m) se encuentra en Buenos Aires. Está diseñado para moverse, cerrando sus pétalos por la tarde o cuando soplan fuertes vientos y abriéndolos por la mañana.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conocido por su preocupación por la igualdad y la justicia social, así como por las cualidades esenciales y espirituales de la humanidad. Esta enorme pieza de bronce (de 7 pies o 2,13 metros) representa lo que él describió como "una presencia negra simbólica impregnada de un sentido de humanidad universal".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La escultura que representa una cabeza humana parece omnipresente y solemne. Irradia calma y serenidad.'
}, {
  name: 'Moai',
  artist: 'Artista Desconocido',
  description: 'Ubicados en la Isla de Pascua, hay 1000 moai, o estatuas monumentales existentes, creadas por los primeros Rapa Nui, que algunos creen que representaban a ancestros deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Tres bustos monumentales de piedra con las cabezas desproporcionadamente grandes con rostros sombríos.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Las Nanas son criaturas triunfantes, símbolos de feminidad y maternidad. En un principio, Saint Phalle utilizaba telas y objetos encontrados para las Nanas, y más tarde introdujo el poliéster para conseguir un efecto más vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Una gran escultura de mosaico de una caprichosa figura femenina bailando con un colorido traje que emana alegría.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstracta de bronce es parte de la serie The Family of Man ubicada en Yorkshire Sculpture Park. Hepworth optó por no crear representaciones literales del mundo, sino que desarrolló formas abstractas inspiradas en personas y paisajes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Una escultura alta formada por tres elementos apilados unos sobre otros que recuerdan una figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendiente de cuatro generaciones de talladores de madera, el trabajo de Fakeye combinó temas Yoruba tradicionales y contemporáneos.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Una intrincada escultura de madera de un guerrero con el rostro centrado en un caballo adornado con patrones.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow es conocida por sus esculturas del cuerpo fragmentado como metáfora de la fragilidad y la impermanencia de la juventud y la belleza. Esta escultura representa dos vientres grandes muy realistas apilados uno encima del otro, cada uno de unos cinco pies (1,5 m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La escultura recuerda una cascada de pliegues, muy diferente a los vientres de las esculturas clásicas.'
}, {
  name: 'Terracotta Army',
  artist: 'Artista Desconocido',
  description: 'El Ejército de terracota es una colección de esculturas de terracota que representan los ejércitos de Qin Shi Huang, el primer emperador de China. El ejército constaba de más de 8.000 soldados, 130 carros con 520 caballos y 150 caballos de caballería.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreros solemnes, cada uno con una expresión facial y una armadura únicas.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conocida por recoger objetos de los escombros de la ciudad de Nueva York, que luego ensamblaría en construcciones monumentales. En este, usó partes dispares como un poste de la cama, un alfiler de malabares y un fragmento de asiento, clavándolos y pegándolos en cajas que reflejan la influencia de la abstracción geométrica del espacio y la forma del cubismo.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Una escultura negra mate donde los elementos individuales son inicialmente indistinguibles.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusiona lo tradicional y lo moderno, lo natural y lo industrial. Su arte se centra en la relación entre el hombre y la naturaleza. Su trabajo fue descrito como convincente tanto abstracta como figurativamente, desafiando la gravedad, y una "fina síntesis de materiales inverosímiles.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Una escultura parecida a un alambre montado en una pared de hormigón que desciende al suelo. Parece ligero.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'El Zoológico de Taipei realizó una Zona de Hipopótamos con hipopótamos sumergidos jugando.',
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

Es una buena idea tener múltiples variables de estado si no se encuentran relacionadas entre sí, como `index` y `showMore` en este ejemplo. Pero si encontramos que a menudo cambiamos dos variables de estado juntas, podría ser mejor combinarlas en una sola. Por ejemplo, si tenemos un formulario con muchos campos, es más conveniente tener una única variable de estado que contenga un objeto que una variable de estado por campo. [Elegir la estructura del estado](/learn/choosing-the-state-structure) tiene más consejos sobre esto.

<DeepDive>

#### ¿Cómo sabe React qué estado devolver? {/*how-does-react-know-which-state-to-return*/}

Es posible que hayas notado que la llamada a `useState` no recibe ninguna información sobre *a qué* variable de estado se refiere. No hay un "identificador" que se pase a `useState`, entonces, ¿cómo sabe cuál de las variables de estado debería devolver? ¿Se basa en algún tipo de magia para esto? La respuesta es no.

En cambio, para habilitar su sintaxis concisa, los Hooks **se basan en un orden de llamada estable en cada representación del mismo componente.** Esto funciona bien en la práctica porque si seguimos la regla anterior ("solo llamar a los Hooks en el nivel superior"), los Hooks siempre se llamarán en el mismo orden. Además, este [complemento para el linter] (https://www.npmjs.com/package/eslint-plugin-react-hooks) detecta la mayoría de los errores.

Internamente, React mantiene un *array* de pares de estados para cada componente. También mantiene el índice de par actual, el cual se establece en `0` antes de ser renderizado. Cada vez que llamamos a `useState`, React devuelve el siguiente par de estados e incrementa el índice. Puedes leer más sobre este mecanismo en [React Hooks: No es magia, sólo son Arrays.](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

Este ejemplo **no usa React** pero nos da una idea de cómo funciona `useState` internamente:

<Sandpack>

```js index.js active
let componentHooks = [];
let currentHookIndex = 0;

// Cómo funciona useState dentro de React (simplificado).
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // Este no es el primer render,
    // entonces el par de estados ya existe.
    // Devuélvelo y prepárate para la próxima llamada del Hook.
    currentHookIndex++;
    return pair;
  }

  // Esta es la primera vez que estamos renderizando,
  // así que crea un array de dos posiciones y guárdalo.
  pair = [initialState, setState];

  function setState(nextState) {
    // Cuando el usuario solicita un cambio de estado,
    // guarda el nuevo valor en el par.
    pair[0] = nextState;
    updateDOM();
  }

  // Guarda el par para futuros renderizados
  // y se prepara para la siguiente llamada del Hook.
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // Cada llamada a useState() devolverá el siguiente par.
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // Este ejemplo no usa React, entonces
  // devuelve un objeto como resultado en lugar de JSX.
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} por ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `${showMore ? 'Ocultar' : 'Mostrar'} detalles`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // Reinicia el índice del Hook actual
  // antes de renderizar el componente.
  currentHookIndex = 0;
  let output = Gallery();

  // Actualiza el DOM para que coincida con el resultado.
  // Esta es la parte que React hace por ti.
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Aunque Colvin es predominantemente conocida por temas abstractos que aluden a símbolos prehispánicos, esta gigantesca escultura, un homenaje a la neurocirugía, es una de sus obras de arte público más reconocibles.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Una estatua de bronce de dos manos cruzadas sosteniendo delicadamente un cerebro humano con la punta de sus dedos.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Esta enorme flor plateada (75 pies o 23 m) se encuentra en Buenos Aires. Está diseñado para moverse, cerrando sus pétalos por la tarde o cuando soplan fuertes vientos y abriéndolos por la mañana.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conocido por su preocupación por la igualdad y la justicia social, así como por las cualidades esenciales y espirituales de la humanidad. Esta enorme pieza de bronce (de 7 pies o 2,13 metros) representa lo que él describió como "una presencia negra simbólica impregnada de un sentido de humanidad universal".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La escultura que representa una cabeza humana parece omnipresente y solemne. Irradia calma y serenidad.'
}, {
  name: 'Moai',
  artist: 'Artista Desconocido',
  description: 'Ubicados en la Isla de Pascua, hay 1000 moai, o estatuas monumentales existentes, creadas por los primeros Rapa Nui, que algunos creen que representaban a ancestros deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Tres bustos monumentales de piedra con las cabezas desproporcionadamente grandes con rostros sombríos.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Las Nanas son criaturas triunfantes, símbolos de feminidad y maternidad. En un principio, Saint Phalle utilizaba telas y objetos encontrados para las Nanas, y más tarde introdujo el poliéster para conseguir un efecto más vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Una gran escultura de mosaico de una caprichosa figura femenina bailando con un colorido traje que emana alegría.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstracta de bronce es parte de la serie The Family of Man ubicada en Yorkshire Sculpture Park. Hepworth optó por no crear representaciones literales del mundo, sino que desarrolló formas abstractas inspiradas en personas y paisajes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Una escultura alta formada por tres elementos apilados unos sobre otros que recuerdan una figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendiente de cuatro generaciones de talladores de madera, el trabajo de Fakeye combinó temas Yoruba tradicionales y contemporáneos.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Una intrincada escultura de madera de un guerrero con el rostro centrado en un caballo adornado con patrones.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow es conocida por sus esculturas del cuerpo fragmentado como metáfora de la fragilidad y la impermanencia de la juventud y la belleza. Esta escultura representa dos vientres grandes muy realistas apilados uno encima del otro, cada uno de unos cinco pies (1,5 m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La escultura recuerda una cascada de pliegues, muy diferente a los vientres de las esculturas clásicas.'
}, {
  name: 'Terracotta Army',
  artist: 'Artista Desconocido',
  description: 'El Ejército de terracota es una colección de esculturas de terracota que representan los ejércitos de Qin Shi Huang, el primer emperador de China. El ejército constaba de más de 8.000 soldados, 130 carros con 520 caballos y 150 caballos de caballería.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreros solemnes, cada uno con una expresión facial y una armadura únicas.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conocida por recoger objetos de los escombros de la ciudad de Nueva York, que luego ensamblaría en construcciones monumentales. En este, usó partes dispares como un poste de la cama, un alfiler de malabares y un fragmento de asiento, clavándolos y pegándolos en cajas que reflejan la influencia de la abstracción geométrica del espacio y la forma del cubismo.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Una escultura negra mate donde los elementos individuales son inicialmente indistinguibles.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusiona lo tradicional y lo moderno, lo natural y lo industrial. Su arte se centra en la relación entre el hombre y la naturaleza. Su trabajo fue descrito como convincente tanto abstracta como figurativamente, desafiando la gravedad, y una "fina síntesis de materiales inverosímiles.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Una escultura parecida a un alambre montado en una pared de hormigón que desciende al suelo. Parece ligero.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'El Zoológico de Taipei realizó una Zona de Hipopótamos con hipopótamos sumergidos jugando.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Un grupo de esculturas de hipopótamos de bronce que emergen de la acera como si estuvieran nadando.'
}];

// Hacemos que la interfaz de usuario coincida con el estado inicial..
updateDOM();
```

```html public/index.html
<button id="nextButton">
  Siguiente
</button>
<h3 id="header"></h3>
<button id="moreButton"></button>
<p id="description"></p>
<img id="image">

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
button { display: block; margin-bottom: 10px; }
</style>
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

No es necesario que lo entiendas para usar React, pero podrías encontrarlo como un modelo mental útil.

</DeepDive>

## El estado es aislado y privado. {/*state-is-isolated-and-private*/}

El estado es local para una instancia de un componente en la pantalla. En otras palabras, **si renderizas el mismo componente dos veces, ¡cada copia tendrá un estado completamente aislado!** Cambiar uno de ellos no afectará al otro.

En este ejemplo, el anterior componente de `Galería` se ha renderizado dos veces sin cambios en su lógica. Puedes intentar hacer clic en los botones dentro de cada una de las galerías. Observarás que su estado es independiente:

<Sandpack>

```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}

```

```js Gallery.js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <section>
      <button onClick={handleNextClick}>
        Next
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
    </section>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Aunque Colvin es predominantemente conocida por temas abstractos que aluden a símbolos prehispánicos, esta gigantesca escultura, un homenaje a la neurocirugía, es una de sus obras de arte público más reconocibles.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Una estatua de bronce de dos manos cruzadas sosteniendo delicadamente un cerebro humano con la punta de sus dedos.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Esta enorme flor plateada (75 pies o 23 m) se encuentra en Buenos Aires. Está diseñado para moverse, cerrando sus pétalos por la tarde o cuando soplan fuertes vientos y abriéndolos por la mañana.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conocido por su preocupación por la igualdad y la justicia social, así como por las cualidades esenciales y espirituales de la humanidad. Esta enorme pieza de bronce (de 7 pies o 2,13 metros) representa lo que él describió como "una presencia negra simbólica impregnada de un sentido de humanidad universal".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La escultura que representa una cabeza humana parece omnipresente y solemne. Irradia calma y serenidad.'
}, {
  name: 'Moai',
  artist: 'Artista Desconocido',
  description: 'Ubicados en la Isla de Pascua, hay 1000 moai, o estatuas monumentales existentes, creadas por los primeros Rapa Nui, que algunos creen que representaban a ancestros deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Tres bustos monumentales de piedra con las cabezas desproporcionadamente grandes con rostros sombríos.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Las Nanas son criaturas triunfantes, símbolos de feminidad y maternidad. En un principio, Saint Phalle utilizaba telas y objetos encontrados para las Nanas, y más tarde introdujo el poliéster para conseguir un efecto más vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Una gran escultura de mosaico de una caprichosa figura femenina bailando con un colorido traje que emana alegría.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstracta de bronce es parte de la serie The Family of Man ubicada en Yorkshire Sculpture Park. Hepworth optó por no crear representaciones literales del mundo, sino que desarrolló formas abstractas inspiradas en personas y paisajes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Una escultura alta formada por tres elementos apilados unos sobre otros que recuerdan una figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendiente de cuatro generaciones de talladores de madera, el trabajo de Fakeye combinó temas Yoruba tradicionales y contemporáneos.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Una intrincada escultura de madera de un guerrero con el rostro centrado en un caballo adornado con patrones.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow es conocida por sus esculturas del cuerpo fragmentado como metáfora de la fragilidad y la impermanencia de la juventud y la belleza. Esta escultura representa dos vientres grandes muy realistas apilados uno encima del otro, cada uno de unos cinco pies (1,5 m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La escultura recuerda una cascada de pliegues, muy diferente a los vientres de las esculturas clásicas.'
}, {
  name: 'Terracotta Army',
  artist: 'Artista Desconocido',
  description: 'El Ejército de terracota es una colección de esculturas de terracota que representan los ejércitos de Qin Shi Huang, el primer emperador de China. El ejército constaba de más de 8.000 soldados, 130 carros con 520 caballos y 150 caballos de caballería.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreros solemnes, cada uno con una expresión facial y una armadura únicas.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conocida por recoger objetos de los escombros de la ciudad de Nueva York, que luego ensamblaría en construcciones monumentales. En este, usó partes dispares como un poste de la cama, un alfiler de malabares y un fragmento de asiento, clavándolos y pegándolos en cajas que reflejan la influencia de la abstracción geométrica del espacio y la forma del cubismo.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Una escultura negra mate donde los elementos individuales son inicialmente indistinguibles.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusiona lo tradicional y lo moderno, lo natural y lo industrial. Su arte se centra en la relación entre el hombre y la naturaleza. Su trabajo fue descrito como convincente tanto abstracta como figurativamente, desafiando la gravedad, y una "fina síntesis de materiales inverosímiles.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Una escultura parecida a un alambre montado en una pared de hormigón que desciende al suelo. Parece ligero.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'El Zoológico de Taipei realizó una Zona de Hipopótamos con hipopótamos sumergidos jugando.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Un grupo de esculturas de hipopótamos de bronce que emergen de la acera como si estuvieran nadando.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
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

Esto es lo que hace que el estado sea diferente de las variables regulares que declaramos en la parte superior de un módulo. El estado no está vinculado a una llamada de función en particular o a un lugar en el código, pero es "local" al lugar específico en la pantalla. Se han renderizado dos componentes `<Gallery />`, por lo que su estado se almacena por separado.

También observemos cómo el componente de la página `Page` no "sabe" nada sobre el estado del componente de la galería `Galery`, ni siquiera si es que posee algún estado. A diferencia de las props, **el estado es totalmente privado para el componente que lo declara.** El componente padre no puede cambiarlo. Esto permite agregar el estado a cualquier componente o eliminarlo sin afectar al resto de los componentes.

¿Qué pasaría si quisieramos que ambas galerías mantuvieran sus estados sincronizados? La forma correcta de hacerlo en React es *eliminar* el estado de los componentes secundarios y agregarlo a su padre más cercano. Las próximas páginas se centrarán en organizar el estado de un solo componente, pero volveremos a este tema en [Compartir estado entre componentes.](/learn/sharing-state-between-components)

<Recap>

* Debemos utilizar una variable de estado cuando necesitamos que un componente necesite "recordar" alguna información entre renderizaciones.
* Las variables de estado se declaran llamando al Hook `useState`.
* Los Hooks son funciones especiales que comienzan con `use`. Nos permiten "enlazarnos" a funciones de React como el estado.
* Evita llamar a Hooks de manera anidada (por ejemplo, dentro de bucles o condicionales). Llamar a Hooks -incluyendo al useState- solo es válido en el nivel superior de un componente u otro Hook.
* El Hook `useState` devuelve un *array* de dos valores: el estado actual y la función para actualizarlo.
* Puede tener más de una variable de estado. Internamente, React los empareja por orden.
* El estado es privado para un componente. Si los renderizamos en dos lugares, cada componente lo maneja individualmente.

</Recap>



<Challenges>

#### Completa la galería {/*complete-the-gallery*/}

Cuando presionamos "Siguiente" en la última escultura, el código falla. Arregla la lógica para evitar el bloqueo. Puedes hacer esto agregando lógica adicional al controlador de evento o deshabilitando el botón cuando la acción no es posible.

Después de arreglar el error, agrega un botón "Anterior" que muestre la escultura anterior. No debería chocar con la primera escultura.

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
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

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Aunque Colvin es predominantemente conocida por temas abstractos que aluden a símbolos prehispánicos, esta gigantesca escultura, un homenaje a la neurocirugía, es una de sus obras de arte público más reconocibles.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Una estatua de bronce de dos manos cruzadas sosteniendo delicadamente un cerebro humano con la punta de sus dedos.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Esta enorme flor plateada (75 pies o 23 m) se encuentra en Buenos Aires. Está diseñado para moverse, cerrando sus pétalos por la tarde o cuando soplan fuertes vientos y abriéndolos por la mañana.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conocido por su preocupación por la igualdad y la justicia social, así como por las cualidades esenciales y espirituales de la humanidad. Esta enorme pieza de bronce (de 7 pies o 2,13 metros) representa lo que él describió como "una presencia negra simbólica impregnada de un sentido de humanidad universal".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La escultura que representa una cabeza humana parece omnipresente y solemne. Irradia calma y serenidad.'
}, {
  name: 'Moai',
  artist: 'Artista Desconocido',
  description: 'Ubicados en la Isla de Pascua, hay 1000 moai, o estatuas monumentales existentes, creadas por los primeros Rapa Nui, que algunos creen que representaban a ancestros deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Tres bustos monumentales de piedra con las cabezas desproporcionadamente grandes con rostros sombríos.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Las Nanas son criaturas triunfantes, símbolos de feminidad y maternidad. En un principio, Saint Phalle utilizaba telas y objetos encontrados para las Nanas, y más tarde introdujo el poliéster para conseguir un efecto más vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Una gran escultura de mosaico de una caprichosa figura femenina bailando con un colorido traje que emana alegría.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstracta de bronce es parte de la serie The Family of Man ubicada en Yorkshire Sculpture Park. Hepworth optó por no crear representaciones literales del mundo, sino que desarrolló formas abstractas inspiradas en personas y paisajes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Una escultura alta formada por tres elementos apilados unos sobre otros que recuerdan una figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendiente de cuatro generaciones de talladores de madera, el trabajo de Fakeye combinó temas Yoruba tradicionales y contemporáneos.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Una intrincada escultura de madera de un guerrero con el rostro centrado en un caballo adornado con patrones.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow es conocida por sus esculturas del cuerpo fragmentado como metáfora de la fragilidad y la impermanencia de la juventud y la belleza. Esta escultura representa dos vientres grandes muy realistas apilados uno encima del otro, cada uno de unos cinco pies (1,5 m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La escultura recuerda una cascada de pliegues, muy diferente a los vientres de las esculturas clásicas.'
}, {
  name: 'Terracotta Army',
  artist: 'Artista Desconocido',
  description: 'El Ejército de terracota es una colección de esculturas de terracota que representan los ejércitos de Qin Shi Huang, el primer emperador de China. El ejército constaba de más de 8.000 soldados, 130 carros con 520 caballos y 150 caballos de caballería.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreros solemnes, cada uno con una expresión facial y una armadura únicas.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conocida por recoger objetos de los escombros de la ciudad de Nueva York, que luego ensamblaría en construcciones monumentales. En este, usó partes dispares como un poste de la cama, un alfiler de malabares y un fragmento de asiento, clavándolos y pegándolos en cajas que reflejan la influencia de la abstracción geométrica del espacio y la forma del cubismo.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Una escultura negra mate donde los elementos individuales son inicialmente indistinguibles.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusiona lo tradicional y lo moderno, lo natural y lo industrial. Su arte se centra en la relación entre el hombre y la naturaleza. Su trabajo fue descrito como convincente tanto abstracta como figurativamente, desafiando la gravedad, y una "fina síntesis de materiales inverosímiles.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Una escultura parecida a un alambre montado en una pared de hormigón que desciende al suelo. Parece ligero.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'El Zoológico de Taipei realizó una Zona de Hipopótamos con hipopótamos sumergidos jugando.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Un grupo de esculturas de hipopótamos de bronce que emergen de la acera como si estuvieran nadando.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

<Solution>

Esto agrega una condición de protección dentro de ambos controladores de eventos y deshabilita los botones cuando es necesario:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Anterior
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
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

```js data.js hidden
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Aunque Colvin es predominantemente conocida por temas abstractos que aluden a símbolos prehispánicos, esta gigantesca escultura, un homenaje a la neurocirugía, es una de sus obras de arte público más reconocibles.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Una estatua de bronce de dos manos cruzadas sosteniendo delicadamente un cerebro humano con la punta de sus dedos.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Esta enorme flor plateada (75 pies o 23 m) se encuentra en Buenos Aires. Está diseñado para moverse, cerrando sus pétalos por la tarde o cuando soplan fuertes vientos y abriéndolos por la mañana.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conocido por su preocupación por la igualdad y la justicia social, así como por las cualidades esenciales y espirituales de la humanidad. Esta enorme pieza de bronce (de 7 pies o 2,13 metros) representa lo que él describió como "una presencia negra simbólica impregnada de un sentido de humanidad universal".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La escultura que representa una cabeza humana parece omnipresente y solemne. Irradia calma y serenidad.'
}, {
  name: 'Moai',
  artist: 'Artista Desconocido',
  description: 'Ubicados en la Isla de Pascua, hay 1000 moai, o estatuas monumentales existentes, creadas por los primeros Rapa Nui, que algunos creen que representaban a ancestros deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Tres bustos monumentales de piedra con las cabezas desproporcionadamente grandes con rostros sombríos.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Las Nanas son criaturas triunfantes, símbolos de feminidad y maternidad. En un principio, Saint Phalle utilizaba telas y objetos encontrados para las Nanas, y más tarde introdujo el poliéster para conseguir un efecto más vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Una gran escultura de mosaico de una caprichosa figura femenina bailando con un colorido traje que emana alegría.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstracta de bronce es parte de la serie The Family of Man ubicada en Yorkshire Sculpture Park. Hepworth optó por no crear representaciones literales del mundo, sino que desarrolló formas abstractas inspiradas en personas y paisajes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Una escultura alta formada por tres elementos apilados unos sobre otros que recuerdan una figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendiente de cuatro generaciones de talladores de madera, el trabajo de Fakeye combinó temas Yoruba tradicionales y contemporáneos.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Una intrincada escultura de madera de un guerrero con el rostro centrado en un caballo adornado con patrones.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow es conocida por sus esculturas del cuerpo fragmentado como metáfora de la fragilidad y la impermanencia de la juventud y la belleza. Esta escultura representa dos vientres grandes muy realistas apilados uno encima del otro, cada uno de unos cinco pies (1,5 m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La escultura recuerda una cascada de pliegues, muy diferente a los vientres de las esculturas clásicas.'
}, {
  name: 'Terracotta Army',
  artist: 'Artista Desconocido',
  description: 'El Ejército de terracota es una colección de esculturas de terracota que representan los ejércitos de Qin Shi Huang, el primer emperador de China. El ejército constaba de más de 8.000 soldados, 130 carros con 520 caballos y 150 caballos de caballería.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreros solemnes, cada uno con una expresión facial y una armadura únicas.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conocida por recoger objetos de los escombros de la ciudad de Nueva York, que luego ensamblaría en construcciones monumentales. En este, usó partes dispares como un poste de la cama, un alfiler de malabares y un fragmento de asiento, clavándolos y pegándolos en cajas que reflejan la influencia de la abstracción geométrica del espacio y la forma del cubismo.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Una escultura negra mate donde los elementos individuales son inicialmente indistinguibles.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusiona lo tradicional y lo moderno, lo natural y lo industrial. Su arte se centra en la relación entre el hombre y la naturaleza. Su trabajo fue descrito como convincente tanto abstracta como figurativamente, desafiando la gravedad, y una "fina síntesis de materiales inverosímiles.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Una escultura parecida a un alambre montado en una pared de hormigón que desciende al suelo. Parece ligero.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'El Zoológico de Taipei realizó una Zona de Hipopótamos con hipopótamos sumergidos jugando.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Un grupo de esculturas de hipopótamos de bronce que emergen de la acera como si estuvieran nadando.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

¡Observa cómo `hasPrev` y `hasNext` se usan *ambos* para el JSX que se devuelve y dentro de los controladores de eventos! Este práctico patrón funciona porque las funciones controladoras de evento ["se cierran"](https://developer.mozilla.org/es/docs/Web/JavaScript/Closures) sobre cualquier variable declarada durante la renderización.

</Solution>

#### Arreglar entradas de formulario atascadas {/*fix-stuck-form-inputs*/}

Cuando escribimos en los campos del formulario, no obtenemos nada. Es como si los valores estuvieran "atascados" con cadenas vacías. El `valor` de la primera `<entrada>` está configurado para coincidir siempre con la variable `firstName`, y el `valor` de la segunda `<entrada>` está configurado para coincidir siempre con la variable `lastName`. Esto es correcto. Ambas entradas tienen controladores de eventos `onChange`, que intentan actualizar las variables en función de la última entrada del usuario (`e.target.value`). Sin embargo, las variables no parecen "recordar" sus valores entre renderizaciones. Solucionemos esto usando variables de estado en su lugar.

<Sandpack>

```js
export default function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="Nombre"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Apellido"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hola, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reiniciar</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

<Solution>

Primero, importamos el `useState` desde React. Luego reemplazamos `firstName` y `lastName` con variables de estado que declaramos llamando a `useState`. Finalmente, reemplazamos cada asignación `firstName = ...` con `setFirstName(...)`, y haga lo mismo con `lastName`. No olvidemos actualizar `handleReset` también para que funcione el botón de reinicio.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="Nombre"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Apellido"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hola, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reiniciar</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Arregla un error {/*fix-a-crash*/}

Aquí hay un pequeño formulario que se supone que permite al usuario dejar algunos comentarios. Cuando se envía el comentario, se supone que debe mostrar un mensaje de agradecimiento. Sin embargo, falla con un mensaje de error que dice "Se generaron menos Hooks de los esperados". ¿Puedes detectar el error y corregirlo?

<Hint>

¿Existe alguna limitación sobre _dónde_ se pueden llamar los Hooks? ¿Este componente rompe alguna regla? Comprueba si hay algún comentario que deshabilite las comprobaciones de linter; ¡aquí es donde a menudo se esconden los errores!

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>¡Gracias!</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Enviar</button>
      </form>
    );
  }
}
```

</Sandpack>

<Solution>

Los Hooks solo se pueden llamar en el nivel superior de un componente. Aquí, la primera definición `isSent` sigue esta regla, pero la definición `message` está anidada en una condición.

Muévelo fuera de la condición para solucionar el problema:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>¡Gracias!</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Enviar</button>
      </form>
    );
  }
}
```

</Sandpack>

¡Recuerda que los Hooks deben llamarse incondicionalmente y siempre en el mismo orden!

También puede eliminar el `else` innecesario para reducir el anidamiento. Sin embargo, sigue siendo importante que todas las llamadas a Hooks ocurran *antes* del primer `return`.

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>¡Gracias!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`Sending: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

</Sandpack>

Intenta mover la segunda llamada `useState` después de la condición `if` y observa cómo esto la rompe de nuevo.

Si tu linter está [configurado para React](/learn/editor-setup#linting), deberías ver un error cuando cometas un error como este. Si aparece un error cuando escribes el código errado localmente, deberías configurar el plugin del linter en tu proyecto.

</Solution>

#### Eliminar estado innecesario {/*remove-unnecessary-state*/}

Cuando se hace clic en el botón, este ejemplo debe solicitar el nombre del usuario y luego mostrar una alerta saludándolo. Intentaste usar el estado para mantener el nombre, pero por alguna razón siempre muestra "¡Hola!".

Para corregir este código, elimina la variable de estado innecesaria. (Discutiremos sobre [por qué esto no funcionó](/learn/state-as-a-snapshot) más adelante).

¿Puede explicar por qué esta variable de estado era innecesaria?

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    setName(prompt('¿Cuál es tu nombre?'));
    alert(`Hola, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Saludar
    </button>
  );
}
```

</Sandpack>

<Solution>

Aquí está la versión con la solución que usa una variable `name` regular declarada en la función que la necesita:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('¿Cuál es tu nombre?');
    alert(`Hola, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Saludar
    </button>
  );
}
```

</Sandpack>

Una variable de estado solo es necesaria para mantener la información entre renderizaciones de un componente. Dentro de un solo controlador de evento, una variable regular funcionará bien. Es recomendable no usar variables de estado cuando una variable regular funciona bien.

</Solution>

</Challenges>
