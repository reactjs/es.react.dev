---
title: Actualizar objetos en el estado
---

<Intro>

El estado puede contener cualquier tipo de valor JavaScript, incluyendo objetos. Pero no deberías cambiar los objetos que tienes en el estado de React directamente. En su lugar, cuando quieras actualizar un objeto, tienes que crear uno nuevo (o hacer una copia de uno existente), y luego configurar el estado para usar esa copia.

</Intro>

<YouWillLearn>

- Cómo actualizar correctamente un objeto en el estado de React
- Cómo actualizar un objeto anidado sin mutarlo
- Qué es la inmutabilidad y cómo no romperla
- Cómo hacer que la copia de objetos sea menos repetitiva con Immer

</YouWillLearn>

## ¿Qué es una mutación? {/*whats-a-mutation*/}

Puede almacenar cualquier tipo de valor de JavaScript en el estado.

```js
const [x, setX] = useState(0);
```

Hasta ahora has trabajado con números, _strings_ y booleanos. Estos tipos de valores de JavaScript son "inmutables", es decir, inmutables o de "sólo lectura". Se puede activar un re-renderizado para _reemplazar_ un valor:

```js
setX(5);
```

El estado `x` ha cambiado de `0` a `5`, pero el _número `0` en sí mismo_ no cambia. No es posible hacer ningún cambio en los valores primitivos incorporados como números, _strings_ y booleanos en JavaScript.

Consideremos ahora un objeto en estado:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Técnicamente, es posible cambiar el contenido del _objeto mismo_. **Esto se denomina mutación:**.

```js
position.x = 5;
```

Sin embargo, aunque los objetos en el estado de React son técnicamente mutables, deberías tratarlos **como si** fueran inmutables--como los números, booleanos y _strings_. En lugar de mutarlos, siempre debes reemplazarlos.

## Tratar el estado como de sólo lectura {/*treat-state-as-read-only*/}

En otras palabras, debes **tratar cualquier objeto JavaScript que pongas en estado como de sólo lectura.**

Este ejemplo mantiene un objeto en el estado para representar la posición actual del puntero. Se supone que el punto rojo se mueve cuando se toca o se mueve el cursor, sobre el área de vista previa. Pero el punto permanece en la posición inicial:

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
        position.x = e.clientX;
        position.y = e.clientY;
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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

El problema está en este trozo de código.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Este código modifica el objeto asignado a `position` desde [el renderizado anterior.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) Pero sin usar la función de ajuste de estado, React no tiene idea de que el objeto ha cambiado. Así que React no hace nada en respuesta. Es como intentar cambiar el orden de lo que has comido cuando ya has acabado. Aunque mutar el estado puede funcionar en algunos casos, no lo recomendamos. Debes tratar el valor del estado al que tienes acceso en un renderizado como de sólo lectura.

Para realmente [conseguir un re-renderizado](/learn/state-as-a-snapshot#setting-state-triggers-renders) en este caso, **crea un objeto *nuevo* y pásalo a la función de configuración de estado:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Con `setPosition`, le estás diciendo a React:

* Reemplaza `position` con este nuevo objeto
* Y renderiza este componente de nuevo

Observa cómo el punto rojo sigue ahora a tu puntero cuando tocas o pasas el ratón por encima del área de vista previa:

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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### La mutación local es correcta {/*local-mutation-is-fine*/}

Un código como este es un problema porque modifica un objeto *existente* en el estado:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Pero un código como el siguiente está **absolutamente bien**, ya que estarías mutando un objeto que *acabas de crear*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

De hecho, es completamente equivalente a escribir lo siguiente:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

La mutación sólo es un problema cuando cambias objetos *existentes* que ya están en el estado. Mutar un objeto que acabas de crear está bien porque *ningún otro código hace referencia a él todavía.* Cambiarlo no va a afectar accidentalmente a algo que dependa de él. Esto se llama "mutación local". Incluso puedes hacer una mutación local [mientras renderizas.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) ¡Muy conveniente y completamente bien!

</DeepDive>  

## Copiar objetos con la sintaxis extendida {/*copying-objects-with-the-spread-syntax*/}

En el ejemplo anterior, el objeto `position` se crea siempre de nuevo a partir de la posición actual del cursor. Pero a menudo, querrás incluir datos *existentes* como parte del nuevo objeto que estás creando. Por ejemplo, puedes querer actualizar *sólo un* campo de un formulario, pero mantener los valores anteriores de todos los demás campos.

Estos campos de entrada no funcionan porque los controladores `onChange` mutan el estado:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        Nombre:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Apellido:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Correo electrónico:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Por ejemplo, esta línea muta el estado de un render pasado:

```js
person.firstName = e.target.value;
```

La forma fiable de obtener el comportamiento que buscas es crear un nuevo objeto y pasarlo a `setPerson`. Pero aquí, quieres también **copiar los datos existentes en él** porque sólo uno de los campos ha cambiado:

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

Se puede utilizar el `...` [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) para no tener que copiar cada propiedad por separado.

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

¡Ahora el formulario funciona! 

Fíjate en que no has declarado una variable de estado distinta para cada campo de entrada. Para los formularios grandes, es muy conveniente mantener todos los datos agrupados - ¡siempre y cuando los actualices correctamente!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        Nombre:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Apellido:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Correo electrónico:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Ten en cuenta que la sintaxis extendida  `...` es "superficial": sólo copia las cosas a un nivel de profundidad. Esto lo hace rápido, pero también significa que si quieres actualizar una propiedad anidada, tendrás que usarla más de una vez. 

<DeepDive>

#### Utilizar un único controlador de evento para diversos campos {/*using-a-single-event-handler-for-multiple-fields*/}

También puedes utilizar las llaves `[` y `]` dentro de tu definición de objeto para especificar una propiedad con un nombre dinámico. Aquí está el mismo ejemplo, pero con un solo controlador de evento en lugar de tres diferentes:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        Nombre:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Apellido:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Correo electrónico:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Aquí, `e.target.name` se refiere a la propiedad `name` dada al elemento DOM `<input>`.

</DeepDive>

## Actualizar un objeto anidado {/*updating-a-nested-object*/}

Considera una estructura de objetos anidados como esta:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Nana azul',
    city: 'Hamburgo',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Si quisieras actualizar `person.artwork.city`, está claro cómo hacerlo con la mutación:

```js
person.artwork.city = 'Nueva Delhi';
```

Pero en React, ¡se trata el estado como inmutable! Para cambiar la "ciudad", primero tendrías que producir el nuevo objeto "artwork" (pre-poblado con los datos de la anterior), y luego producir el nuevo objeto "person" que apunta a la nueva "artwork":

```js
const nextArtwork = { ...person.artwork, city: 'Nueva Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

O, escrito como una sola llamada a la función:

```js
setPerson({
  ...person, // Copia otros campos
  artwork: { // pero sustituye el artwork
    ...person.artwork, // por el mismo
    city: 'Nueva Delhi' // ¡pero en Nueva Delhi!
  }
});
```

Esto es un poco complicado, pero funciona bien para muchos casos:

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
        {' por '}
        {person.name}
        <br />
        (situada en {person.artwork.city})
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

<DeepDive>

#### Los objetos no están realmente anidados {/*objects-are-not-really-nested*/}

Un objeto de este tipo aparece "anidado" en el código:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Nana azul',
    city: 'Hamburgo',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Sin embargo, la "anidación" es una forma inexacta de pensar en el comportamiento de los objetos. Cuando el código se ejecuta, no existe tal cosa como un objeto "anidado". En realidad, se trata de dos objetos diferentes:

```js
let obj1 = {
  title: 'Nana azul',
  city: 'Hamburgo',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

El objeto `obj1` no está "dentro" de `obj2`. Por ejemplo, `obj3` también podría "apuntar" a `obj1`:

```js
let obj1 = {
  title: 'Nana azul',
  city: 'Hamburgo',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Si se muta `obj3.artwork.city`, afectaría tanto a `obj2.artwork.city` como a `obj1.city`. Esto se debe a que `obj3.artwork`, `obj2.artwork` y `obj1` son el mismo objeto. Esto es difícil de ver cuando se piensa en los objetos como "anidados". En cambio, son objetos separados que se "apuntan" unos a otros con propiedades.

</DeepDive>  

### Escribe una lógica de actualización concisa con Immer {/*write-concise-update-logic-with-immer*/}

Si su estado está profundamente anidado, podría considerar [aplanarlo.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) Pero, si no quieres cambiar la estructura de tu estado, puede que prefieras un atajo a los spreads anidados. [Immer](https://github.com/immerjs/use-immer) es una popular librería que te permite escribir utilizando la sintaxis conveniente pero mutante y se encarga de producir las copias por ti. Con Immer, el código que escribes parece que estés "rompiendo las reglas" y mutando un objeto:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Pero a diferencia de una mutación normal, ¡no sobrescribe el estado anterior!

<DeepDive>

#### ¿Cómo funciona Immer? {/*how-does-immer-work*/}

El borrador (`draft`) proporcionado por Immer es un tipo especial de objeto, llamado [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), que "registra" lo que haces con él. Por eso, ¡puedes mutar libremente todo lo que quieras! Bajo el capó, Immer se da cuenta de qué partes del "borrador" han sido cambiadas, y produce un objeto completamente nuevo que contiene tus ediciones.

</DeepDive>

Para probar Immer:

1. Ejecuta `npm install use-immer` para añadir Immer como dependencia
2. Luego sustituye `import { useState } de 'react'` por `import { useImmer } de 'use-immer'`.

Aquí está el ejemplo anterior convertido a Immer:

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
        {' por '}
        {person.name}
        <br />
        (situada en {person.artwork.city})
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

Fíjate en lo mucho más concisos que se han vuelto los controladores de eventos. Puedes mezclar y combinar `useState` y `useImmer` en un mismo componente tanto como quieras. Immer es una gran manera de mantener los controladores de actualización de manera concisa, especialmente si hay anidación en su estado, y la copia de objetos conduce a código repetitivo.

<DeepDive>

#### ¿Por qué no se recomienda mutar el estado en React? {/*why-is-mutating-state-not-recommended-in-react*/}

Hay algunas razones:

* **Debugging:** Si usas `console.log` y no mutas el estado, tus registros anteriores no se verán afectados por los cambios de estado más recientes. Así puedes ver claramente cómo ha cambiado el estado entre renders.
* **Optimizaciones:** Las [estrategias de optimización](/reference/react/memo) más comunes en React se basan en ahorrar trabajo si las props o el estado anteriores son los mismos que los siguientes. Si nunca se muta el estado, es muy rápido comprobar si ha habido algún cambio. Si `prevObj === obj`, puedes estar seguro de que nada ha podido cambiar en su interior.
* **Nuevas características:** Las nuevas características de React que estamos construyendo dependen de que el estado sea [tratado como una instantánea.](/learn/state-as-a-snapshot) Si estás mutando versiones anteriores del estado, eso puede impedirte utilizar las nuevas funciones.
* **Cambios de requisitos:** Algunas características de la aplicación, como la implementación de Deshacer/Rehacer, mostrar un historial de cambios, o permitir al usuario reiniciar un formulario a valores anteriores, son más fáciles de hacer cuando no se muta nada. Esto se debe a que puedes mantener copias pasadas del estado en la memoria, y reutilizarlas cuando sea apropiado. Si empiezas con un enfoque mutativo, características como estas pueden ser difíciles de añadir más adelante.
* **Implementación más sencilla:** Como React no se basa en la mutación, no necesita hacer nada especial con tus objetos. No necesita apropiarse de sus propiedades, envolverlos siempre en Proxies, o hacer otro trabajo en la inicialización como hacen muchas soluciones "reactivas". Esta es también la razón por la que React te permite poner cualquier objeto en el estado - no importa lo grande que sea - sin problemas adicionales de rendimiento o corrección.

En la práctica, a menudo puedes "salirte con la tuya" con la mutación de estado en React, pero te aconsejamos encarecidamente que no lo hagas para que puedas utilizar las nuevas características de React desarrolladas con este enfoque en mente. Los futuros colaboradores y quizás incluso tú mismo en el futuro te lo agradecerán.

</DeepDive>

<Recap>

* Tratar todo el estado en React como inmutable.
* Cuando se almacenan objetos en el estado, la mutación de los mismos no desencadenará renderizados y cambiará el estado en las "instantáneas" de los renderizados anteriores.
* En lugar de mutar un objeto, crea una *nueva* versión del mismo, y dispara un re-renderizado estableciendo el estado en él.
* Puedes usar la sintaxis extendida de objetos `{...obj, algo: 'newValue'}` para crear copias de objetos.
* La sintaxis extendida es superficial: sólo copia un nivel de profundidad.
* Para actualizar un objeto anidado, necesitas crear copias desde el lugar que estás actualizando.
* Para reducir el código de copia repetitivo, utiliza Immer.

</Recap>



<Challenges>

#### Corregir las actualizaciones de estado incorrectas {/*fix-incorrect-state-updates*/}

Este formulario tiene algunos errores. Haz clic en el botón que aumenta la puntuación unas cuantas veces. Observa que no aumenta. A continuación, edita el nombre, y observa que la puntuación se ha "puesto al día" con sus cambios. Por último, edita el apellido y observa que la puntuación ha desaparecido por completo.

Tu tarea es arreglar todos estos errores. A medida que los vayas arreglando, explica por qué ocurre cada uno de ellos.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Nombre:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Apellido:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Aquí hay una versión con ambos errores corregidos:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Nombre:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Apellido:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

El problema con `handlePlusClick` era que mutaba el objeto `player`. Como resultado, React no sabía que había una razón para volver a renderizar, y no actualizaba la puntuación en la pantalla. Por eso, cuando editabas el primer nombre, el estado se actualizaba, provocando un re-renderizado que _también_ actualizaba la puntuación en la pantalla.

El problema con `handleLastNameChange` era que no copiaba los campos existentes de `...player` en el nuevo objeto. Por eso la puntuación se perdía después de editar el último nombre.

</Solution>

#### Encontrar y arreglar la mutación {/*find-and-fix-the-mutation*/}

Hay una caja que se puede arrastrar sobre un fondo estático. Puedes cambiar el color de la caja usando la entrada de selección.

Pero hay un error. Si mueves la caja primero, y luego cambias su color, el fondo (¡que se supone que no se mueve!) "saltará" a la posición de la caja. Pero esto no debería ocurrir: la prop `position` del `Background` se establece en `initialPosition`, que es `{ x: 0, y: 0 }`. ¿Por qué se mueve el fondo después del cambio de color?

Encuentra el error y arréglalo.

<Hint>

Si algo inesperado cambia, hay una mutación. Encuentra la mutación en `App.js` y arréglala.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        ¡Arrástrame!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

El problema estaba en la mutación dentro de `handleMove`. Mutaba `shape.position`, pero ese es el mismo objeto al que apunta `initialPosition`. Por eso tanto la forma como el fondo se mueven. (Es una mutación, por lo que el cambio no se refleja en la pantalla hasta que una actualización no relacionada -el cambio de color- desencadena una nueva renderización).

La solución es eliminar la mutación de `handleMove`, y utilizar la sintaxis extendida para copiar la forma. Ten en cuenta que `+=` es una mutación, así que tienes que reescribirlo para usar una operación regular `+`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        ¡Arrástrame!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Actualizar un objeto con Immer {/*update-an-object-with-immer*/}

Este es el mismo ejemplo con errores que en el desafío anterior. Esta vez, arregla la mutación usando Immer. Para tu comodidad, `useImmer` ya está importado, así que tienes que cambiar la variable de estado `shape` para utilizarlo.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        ¡Arrástrame!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

<Solution>

Esta es la solución reescrita con Immer. Observa cómo los controladores de eventos están escritos de forma mutante, pero el error no se produce. Esto se debe a que bajo el capó, Immer nunca muta los objetos existentes.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        ¡Arrástrame!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
