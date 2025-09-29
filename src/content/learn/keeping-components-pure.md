---
title: Mantener los componentes puros
---

<Intro>

Algunas funciones de JavaScript son *puras.* Las funciones puras solo realizan un cálculo y nada más. Al escribir estrictamente tus componentes como funciones puras, puedes evitar una clase completa de errores desconcertantes y un comportamiento impredecible a medida que crece tu base de código. Sin embargo, para obtener estos beneficios, hay algunas reglas que debes seguir.

</Intro>

<YouWillLearn>

* Qué es la pureza y cómo te ayuda a evitar errores
* Cómo mantener los componentes puros manteniendo los cambios fuera de la fase de renderizado
* Cómo usar el modo estricto para encontrar errores en tus componentes

</YouWillLearn>

## Pureza: componentes como fórmulas {/*purity-components-as-formulas*/}

En informática (y especialmente en el mundo de la programación funcional), [una función pura](https://wikipedia.org/wiki/Pure_function) es una función con las siguientes características:

* **Se ocupa de sus propios asuntos.** No cambia ningún objeto o variable que existiera antes de ser llamado.
* **Las mismas entradas, la misma salida.** Dadas las mismas entradas, una función pura siempre debe devolver el mismo resultado.

Es posible que ya estés familiarizado con un ejemplo de funciones puras: fórmulas en matemáticas.

Considera esta fórmula matemática: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Si <Math><MathI>x</MathI> = 2</Math> entonces <Math><MathI>y</MathI> = 4</Math>. Siempre.

Si <Math><MathI>x</MathI> = 3</Math> entonces <Math><MathI>y</MathI> = 6</Math>. Siempre.

Si <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> a veces no será <Math>9</Math> o <Math>–1</Math> o <Math>2.5</Math> dependiendo de la hora del día o del estado del mercado de valores.

Si <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> y <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> _siempre_ será <Math>6</Math>. 

Si convirtiéramos esto en una función de JavaScript, se vería así:

```js
function double(number) {
  return 2 * number;
}
```

En el ejemplo anterior, `double` es una **función pura.** Si le pasas `3`, devolverá `6`. Siempre.

React está diseñado en torno a este concepto. **React supone que cada componente que escribes es una función pura.** Esto significa que los componentes que escribes en React siempre deben devolver el mismo JSX dadas las mismas entradas:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Hervir {drinkers} tazas de agua.</li>
      <li>Añadir {drinkers} cucharadas de té y {0.5 * drinkers} cucharada de especias.</li>
      <li>Añadir {0.5 * drinkers} tazas de leche hirviendo y azúcar a gusto.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Receta de té Chai especiado</h1>
      <h2>Para dos</h2>
      <Recipe drinkers={2} />
      <h2>Para una reunión</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Cuando pasas `drinkers={2}` a `Recipe`, devolverá el JSX que contiene `2 cups of water`. Siempre.

Si pasas `drinkers={4}`, devolverá el JSX que contiene `4 cups of water`. Siempre.

Como una fórmula matemática.

Puedes pensar en tus componentes como recetas: si las sigues y no agregas nuevos ingredientes durante el proceso de cocción, obtendrás el mismo plato siempre. Ese "plato" es el JSX que el componente le pasa a React para [renderizar.](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="Una receta de té para x personas: toma x tazas de agua, añade x cucharadas de té y 0.5x cucharadas de especias y 0.5x tazas de leche" />

## Efectos secundarios: consecuencias (no)deseadas {/*side-effects-unintended-consequences*/}

El proceso de renderizado de React siempre debe ser puro. Los componentes solo deben *devolver* su JSX, y no *cambiar* cualquier objeto o variable que existiera antes de renderizar: ¡Eso los haría impuros!

Aquí hay un componente que rompe esta regla:

<Sandpack>

```js {expectedErrors: {'react-compiler': [5]}}
let guest = 0;

function Cup() {
  // Mal: ¡Cambiar una variable preexistente!
  guest = guest + 1;
  return <h2>Taza de té para invitado #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Este componente está leyendo y escribiendo una variable `guest` declarada fuera de ella. Esto significa que **llamar a este componente varias veces producirá diferente JSX!** Y lo que es más, si _otros_ componentes leen `guest`, también producirán diferente JSX, ¡dependiendo de cuándo se procesaron! Eso no es predecible.

Volviendo a nuestra fórmula <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, ahora incluso si <Math><MathI>x</MathI> = 2</Math>, no podemos confiar en que <Math><MathI>y</MathI> = 4</Math>. Nuestras pruebas podrían fallar, nuestros usuarios estarían desconcertados, los aviones se caerían del cielo —¡puedes ver cómo esto conduciría a errores confusos!

Puedes arreglar este componente [pasando `guest` como prop en su lugar](/learn/passing-props-to-a-component):

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Taza de té para invitado #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

Ahora tu componente ya es puro, ya que el JSX que devuelve solo depende de la prop `guest`.

En general, no debes esperar que tus componentes se rendericen en ningún orden en particular. No importa si llamas <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> antes o después <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: ambas fórmulas se resolverán independientemente una de la otra. Del mismo modo, cada componente solo debe "pensar por sí mismo" y no intentar coordinarse o depender de otros durante el renderizado. El renderizado es como un examen escolar: ¡cada componente debe calcular su JSX por su cuenta!

<DeepDive>

#### Detección de cálculos impuros con Strict Mode {/*detecting-impure-calculations-with-strict-mode*/}

Aunque es posible que aún no los hayas usado todos, en React hay tres tipos de entradas que puedes leer mientras se renderiza: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), y [context.](/learn/passing-data-deeply-with-context) Siempre debes tratar estas entradas como solo lectura.

Cuando quieras *cambiar* algo en respuesta a la entrada del usuario, debes [asignar el estado](/learn/state-a-components-memory) en lugar de reescribir la variable. Nunca debes cambiar variables u objetos preexistentes mientras tu componente está renderizando.

React ofrece un "Modo estricto" en el que llama a la función de cada componente dos veces durante el desarrollo. **Al llamar a las funciones del componente dos veces, el modo estricto ayuda a encontrar componentes que rompan estas reglas.**

Observa cómo el ejemplo original mostraba "Guest #2", "Guest #4", y "Guest #6" en lugar de "Guest #1", "Guest #2", y "Guest #3". La función original era impura, por lo que al llamarla dos veces se rompió. Pero la versión corregida funciona sin importar que la función sea llamada dos veces cada vez. **Las funciones puras solo se calculan, por lo que llamarlas dos veces no cambiará nada** —como llamar `double(2)` dos veces no cambia lo que se devuelve, y devuelve <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> dos veces, no cambia lo que <MathI>y</MathI> es. Las mismas entradas, las mismas salidas. Siempre.

El modo estricto no tiene ningún efecto en producción, por lo que no ralentizará la aplicación para tus usuarios. Para optar por el modo estricto, puedes envolver tu componente raíz en `<React.StrictMode>`. Algunos frameworks hacen esto por defecto.

</DeepDive>

### Mutación local: el pequeño secreto de tus componentes {/*local-mutation-your-components-little-secret*/}

En el ejemplo anterior, el problema era que el componente cambiaba una variable *preexistente* mientras renderizaba. Esto a menudo se llama **"mutación"** para que suene un poco más aterrador. ¡Las funciones puras no mutan las variables fuera del alcance de la función ni los objetos que se crearon antes de la llamada —¡Eso las hace impuras!

Sin embargo, **está completamente bien cambiar variables y objetos que acabas de crear mientras renderizas.** En este ejemplo, creas un _array_ `[]`, lo asignas a la variable `cups`, y luego haces un `push` con una docena de tazas adentro:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Taza de té para invitado #{guest}</h2>;
}

export default function TeaGathering() {
  const cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

¡Si la variable `cups` o el _array_ `[]` se crearon fuera de la función `TeaGathering`, este sería un gran problema! Estarías cambiando un objeto *preexistente* haciendo push a ese array.

Sin embargo, está bien porque los has creado *durante el mismo renderizado*, dentro de `TeaGathering`. Ningún código fuera de `TeaGathering` sabrá nunca que esto ha ocurrido. Esto se llama **"mutación local"** —es como el pequeño secreto de tu componente.

## ¿Dónde _puedes_ causar efectos secundarios? {/*where-you-_can_-cause-side-effects*/}

Si bien la programación funcional depende en gran medida de la pureza, en algún momento, en algún lugar, _algo_ tiene que cambiar. ¡Ese es el punto en programación! Estos cambios —actualizar la pantalla, iniciar una animación, cambiar los datos— se llaman **efectos secundarios.** Son cosas que suceden _"a un lado"_, no durante el renderizado.

En React, **los efectos secundarios generalmente deberían estar dentro de los [controladores de eventos.](/learn/responding-to-events)** Los controladores de eventos son funciones que React ejecuta cuando realiza alguna acción (por ejemplo, cuando haces clic en un botón). ¡Aunque los controladores de eventos están definidos *dentro* de tu componente, no corren *durante* el renderizado! **Por lo tanto, los controladores de eventos no necesitan ser puros.**

Si has agotado todas las demás opciones y no puedes encontrar el controlador de evento adecuado para tu efecto secundario, aún puedes adjuntarlo en la devolución del JSX con un llamado a [`useEffect`](/reference/react/useEffect) en tu componente. Esto le dice a React que lo ejecute más tarde, después del renderizado, cuando se permiten efectos secundarios. **Sin embargo, este enfoque debería ser tu último recurso.**

Cuando sea posible, intenta expresar tu lógica con un solo renderizado. ¡Te sorprenderá lo lejos que esto puede llevarte!

<DeepDive>

#### ¿Por qué a React le importa la pureza? {/*why-does-react-care-about-purity*/}

Escribir funciones puras requiere cierto hábito y disciplina. Pero también desbloquea maravillosas oportunidades:

* ¡Tus componentes podrían ejecutarse en un entorno diferente (por ejemplo, en el servidor)! Como devuelven el mismo resultado para las mismas entradas, un componente puede atender muchas solicitudes de los usuarios.
* Puedes mejorar el rendimiento [omitiendo el renderizado](/reference/react/memo) de componentes cuyas entradas no han cambiado. Esto es seguro porque las funciones puras siempre devuelven los mismos resultados, por lo que son seguras para almacenar en caché.
* Si algunos datos cambian en medio del renderizado de un árbol de componentes profundos, React puede reiniciar el renderizado sin perder tiempo para terminar el renderizado desactualizado. La pureza hace que sea seguro dejar de calcular en cualquier momento.

Cada nueva característica de React que estamos construyendo aprovecha la pureza. Desde la búsqueda de datos hasta las animaciones y el rendimiento, mantener los componentes puros desbloquea el poder del paradigma de React.

</DeepDive>

<Recap>

* Lo que significa que un componente debe ser puro:
  * **Se ocupa de sus propios asuntos.** No debe cambiar ningún objeto o variable que existiera antes del renderizado.
  * **Las mismas entradas, la misma salida.** Dadas las mismas entradas, un componente siempre debe devolver el mismo JSX.
* El renderizado puede ocurrir en cualquier momento, por lo que los componentes no deben depender de la secuencia de renderizado de los demás.
* No debe mutar ninguna de las entradas que usan sus componentes para renderizar. Eso incluye props, estado y contexto. Para actualizar la pantalla, ["asignar" el estado](/learn/state-a-components-memory) en lugar de mutar objetos preexistentes.
* Esfuérzate por expresar la lógica de tu componente en el JSX. Cuando necesites "cambiar cosas", generalmente querrás hacerlo en un controlador de evento. Como último recurso, puedes usar `useEffect`.
* Escribir funciones puras requiere un poco de práctica, pero desbloquea el poder del paradigma de React.

</Recap>



<Challenges>

#### Arreglar un reloj roto {/*fix-a-broken-clock*/}

Este componente intenta establecer en el `<h1>` la clase `"night"` desde la media noche hasta las 6 de la mañana , y `"day"` para las otras horas. Sin embargo, no funciona. ¿Puedes arreglar este componente?

Puedes verificar si tu solución funciona cambiando temporalmente la zona horaria de la computadora. Cuando la hora actual es entre la medianoche y las seis de la mañana, ¡el reloj debería tener colores invertidos!

<Hint>

Renderizar es un *cálculo*, no debería tratar de "hacer" cosas. ¿Puedes expresar la misma idea de manera diferente?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Puedes arreglar este componente calculando el `className` e incluirlo en la salida del renderizado:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

En este ejemplo, el efecto secundario (que modifica el DOM) no fue necesario en absoluto. Solo necesitabas devolver JSX.

</Solution>

#### Arreglar un perfil roto {/*fix-a-broken-profile*/}

Dos componentes `Profile` son renderizados uno al lado del otro con datos diferentes. Presiona "Contraer" en el primer perfil, Y luego "Expandir".  Notarás que ambos perfiles ahora muestran a la misma persona. Esto es un error.

Encuentra la causa del error y arréglalo.

<Hint>

El código con errores está en `Profile.js`. ¡Asegúrate de leerlo todo de arriba a abajo!

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}} src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Contraer' : 'Expandir'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

El problema es que el componente `Profile` escribe en una variable preexistente llamada `currentPerson`, y los componentes `Header` y `Avatar` lo leen de él. Esto los convierte *a los tres* en impuros y difíciles de predecir.

Para corregir el error, elimine la variable `currentPerson`. En su lugar, pasa toda la información de `Profile` a `Header` y `Avatar` a través de props. Tendrás que agregar una prop `person` en ambos componentes y pasarla hacia abajo.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Contraer' : 'Expandir'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Recuerda que React no garantiza que las funciones de los componentes se ejecutarán en un orden en particular, por lo que no puedes comunicarte entre ellas estableciendo variables. Toda la comunicación debe realizarse a través de props.

</Solution>

#### Arregla una bandeja de historias rota {/*fix-a-broken-story-tray*/}

El CEO de su empresa te pide que agregues "historias" a tu aplicación de reloj en línea, y no puedes decir que no. Has escrito un componente `StoryTray` que acepta una lista de `stories`, seguido del placeholder "Crear historia".

Implementaste el placeholder "Crear historia" para incluir más historias falsas al final del array `stories` que recibes por props. Pero por alguna razón, "Crear historia" aparece más de una vez. Arregla el problema.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Crear historia'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

<<<<<<< HEAD
let initialStories = [
  {id: 0, label: "Historia de Ankit" },
  {id: 1, label: "Historia de Taylor" },
=======
const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // PISTA: Evita que la memoria crezca por siempre mientras lees documentos.
  // Estamos rompiendo nuestras propias reglas aquí.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>Son las {time.toLocaleTimeString()} ahora.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Observa cómo cada vez que se actualiza el reloj, se agrega "Crear historia" *dos veces*. Esto sirve como una pista de que tenemos una mutación durante el renderizado —El modo estricto llama a los componentes dos veces para que estos problemas sean más notables.

La función `StoryTray` no es pura. Al llamar `push` en el _array_ de `stories` recibido (¡como prop!), está mutando un objecto que fue creado *antes* de comenzar el renderizado de `StoryTray`. Esto lo hace defectuoso y muy difícil de predecir.

La solución más simple es no tocar el _array_ y renderizar "Crear historia" por separado:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Crear historia</li>
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

<<<<<<< HEAD
let initialStories = [
  {id: 0, label: "Historia de Ankit" },
  {id: 1, label: "Historia de Taylor" },
=======
const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // PISTA: Evita que la memoria crezca por siempre mientras lees documentos.
  // Estamos rompiendo nuestras propias reglas aquí.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>Son las {time.toLocaleTimeString()} ahora.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Como alternativa, podrías crear un _nuevo_ array (copiando el existente) antes de agregarle un elemento (con `push`):

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
<<<<<<< HEAD
  // ¡Copia el array!
  let storiesToDisplay = stories.slice();
=======
  // Copy the array!
  const storiesToDisplay = stories.slice();
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

  // Esto no afecta al array original:
  storiesToDisplay.push({
    id: 'create',
    label: 'Crear historia'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

<<<<<<< HEAD
let initialStories = [
  {id: 0, label: "Historia de Ankit" },
  {id: 1, label: "Historia de Taylor" },
=======
const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // PISTA: Evita que la memoria crezca por siempre mientras lees documentos.
  // Estamos rompiendo nuestras propias reglas aquí.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>Son las {time.toLocaleTimeString()} ahora.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Esto mantiene tu mutación local y tu función de renderizado pura. Sin embargo, aún debes tener cuidado: por ejemplo, si intentaste cambiar alguno de los elementos existentes en el array, también tendrías que clonar esos elementos.

Es útil recordar qué operaciones mutan arrays y cuáles no. Por ejemplo,  `push`, `pop`, `reverse`, y `sort` mutarán el _array_ original pero `slice`, `filter`, y `map` crearán uno nuevo.

</Solution>

</Challenges>
