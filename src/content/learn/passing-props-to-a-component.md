---
title: Pasar props a un componente
---

<Intro>

Los componentes de React utilizan *props* para comunicarse entre sí. Cada componente padre puede enviar información a sus componentes hijos mediante el uso de props. Las props pueden parecerte similares a los atributos HTML, pero permiten pasar cualquier valor de JavaScript a través de ellas, como objetos, arrays y funciones.

</Intro>

<YouWillLearn>

* Cómo pasar props a un componente
* Cómo acceder a las props desde un componente
* Cómo asignar valores predeterminados para las props
* Cómo pasar código JSX a un componente
* Cómo las props cambian con el tiempo

</YouWillLearn>

## Props conocidas {/*familiar-props*/}

Las props son los datos que se pasan a un elemento JSX. Por ejemplo, `className`, `src`, `alt`, `width` y `height` son algunas de las props que se pueden pasar a un elemento `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Las props que puedes utilizar con una etiqueta `<img>` están predefinidas (ReactDOM se ajusta al [estándar HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Sin embargo, puedes pasar cualquier prop a *tus propios* componentes, como `<Avatar>`, para personalizarlos. ¡Aquí te mostramos cómo hacerlo!

## Pasar props a un componente {/*passing-props-to-a-component*/}

En este código, el componente `Profile` no está pasando ninguna prop a su componente hijo, `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Puedes pasar props al elemento `Avatar` en dos pasos.

### Paso 1: Pasar props al component hijo {/*step-1-pass-props-to-the-child-component*/}

Primero, pasa algunas props al elemento `Avatar`. Por ejemplo, vamos a asignar dos props: `person` (un objeto) y `size` (un número):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Si te resulta confuso el uso de llaves dobles después de `person=`, recuerda que [simplemente estamos pasando un objeto](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) dentro de las llaves JSX.

</Note>

Ahora puedes acceder a estas props dentro del componente `Avatar`.

### Paso 2: Acceder a props dentro del componente hijo {/*step-2-read-props-inside-the-child-component*/}

Puedes acceder a estas props especificando sus nombres `person, size` separados por comas dentro de `({` y `})` justo después de `function Avatar`. Esto te permitirá utilizarlas dentro del código de `Avatar` como si fueran variables.

```js
function Avatar({ person, size }) {
  // puedes acceder a los valores de person y size desde aquí
}
```

Agrega lógica a `Avatar` que utilice las props `person` y `size` para la renderización, ¡y eso es todo!.

Ahora puedes configurar `Avatar` para que se renderice de diferentes maneras con distintas props. ¡Prueba ajustando los valores!

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js src/utils.js
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Las props te permiten considerar de forma independiente los componentes padre e hijo. Por ejemplo, puedes modificar las props `person` o `size` dentro del componente `Profile` sin preocuparte por cómo serán utilizadas por el componente `Avatar`. De manera similar, puedes cambiar la forma en que `Avatar` utiliza estas props sin necesidad de revisar el componente `Profile`.

Considera las props como "controles" que puedes ajustar. Cumplen el mismo papel que los argumentos de una función—de hecho, ¡las props _son_ el único argumento de tu componente! Las funciones de los componentes de React aceptan un único argumento, un objeto `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

En general, no necesitas acceder al objeto completo de `props`, por lo que puedes desestructurarlo en props individuales.

<Pitfall>

**Asegurate de incluir el par de llaves `{` y `}`** dentro de `(` y `)` al declarar las props:

```js
function Avatar({ person, size }) {
  // ...
}
```

Esta sintaxis se conoce como ["desestructuración"](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#desempacar_campos_de_objetos_pasados_como_parámetro_de_función) y es equivalente a acceder a propiedades de un parámetro de función:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Asignar un valor predeterminado para una prop {/*specifying-a-default-value-for-a-prop*/}

Si quieres asignar un valor predeterminado para una prop en caso de que no se especifique ningún valor, puedes hacerlo mediante la desestructuración colocando `=` seguido del valor predeterminado justo después del parámetro:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Ahora, si renderizas `<Avatar person={...} />` sin la prop `size`, el valor de `size` se establecerá automáticamente en `100`.

El valor predeterminado sólo se utilizará si falta la prop `size` o si se pasa `size={undefined}`. Sin embargo, si se pasa `size={null}` o `size={0}`, el valor predeterminado **no** se aplicará.

## Reenviar props con la sintaxis de propagación JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

A veces, pasar props se vuelve muy repetitivo:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

No hay ningún problema en tener código repetitivo—ya que puede ser más legible. Sin embargo, en ocasiones, es posible que prefieras ser más conciso. Algunos componentes reenvían todas sus props a sus hijos, como lo hace `Profile` con `Avatar`. Dado que no utilizan directamente ninguna de sus props, tiene sentido utilizar una sintaxis de "propagación" más concisa:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Esto permite reenviar todas las props de `Profile` a `Avatar` sin la necesidad de especificar cada una de ellas.

**Recuerda utilizar la sintaxis de propagación con moderación.** Si estás utilizando esta sintaxis en cada componente, es probable que algo no esté correctamente estructurado. En muchos casos, esto sugiere que deberías dividir tus componentes y pasar los hijos como elementos JSX separados. ¡Más información sobre esto a continuación!

## Pasar JSX como hijos {/*passing-jsx-as-children*/}

Es común anidar etiquetas nativas del navegador:

```js
<div>
  <img />
</div>
```

En ocasiones, querrás anidar tus propios componentes de la misma forma:

```js
<Card>
  <Avatar />
</Card>
```

Al anidar contenido dentro de una etiqueta JSX, el componente padre recibirá ese contenido a través de una prop llamada `children`. En el ejemplo a continuación, el componente `Card` recibe una prop `children` con el valor de `<Avatar />` y lo renderiza dentro de un div contenedor:

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js src/utils.js
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
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

Prueba cambiando `<Avatar>` dentro de `<Card>` con algún texto para ver cómo el componente `Card` puede envolver cualquier contenido anidado. No es necesario que el componente "sepa" qué se está renderizando dentro de él. Este patrón flexible se puede observar en muchos casos.

Puedes imaginar un componente con una prop `children` como si tuviera un "hueco" que puede ser "llenado" por sus componentes padres con JSX arbitrario. La prop `children` suele utilizarse para crear envoltorios visuales como paneles, rejillas, etc.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## Cómo las props cambian con el tiempo {/*how-props-change-over-time*/}

El componente `Clock` que se muestra a continuación recibe dos props de su componente padre: `color` y `time`. (Se omite el código del componente padre porque utiliza [estado](/learn/state-a-components-memory), del cual no ahondaremos en este momento.)

Prueba cambiando el color en la lista desplegable que aparece a continuación:

<Sandpack>

```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
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
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Elige un color:{' '}
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

Este ejemplo demuestra que **un componente puede recibir props que cambian a lo largo del tiempo.** ¡Las props no siempre son estáticas! Aquí, la prop `time` cambia a cada segundo, y la prop `color` cambia cuando se elige un color diferente. Las props reflejan los datos de un componente en cualquier momento, y no sólo al inicio.

Sin embargo, las props son [inmutables](https://en.wikipedia.org/wiki/Immutable_object)—un término de la informática que significa "inalterable". Si un componente necesita cambiar sus props (por ejemplo, en respuesta a una interacción del usuario o nuevos datos), debe "solicitar" a su componente padre que le pase _nuevas props_—¡un nuevo objeto! Las props antiguas se descartarán y eventualmente el motor de JavaScript liberará la memoria que ocupaban.

**No intentes "cambiar las props".** Cuando necesites responder al input del usuario (como cambiar el color seleccionado), deberás "establecer un estado", lo cual puedes aprender en [El estado: la memoria de un componente.](/learn/state-a-components-memory)

<Recap>

* Para pasar props, simplemente agrégalas al JSX, de la misma forma en que lo harías con los atributos HTML.
* Para acceder a las props, utiliza la sintaxis de desestructuración `function Avatar({ person, size })`.
* Puedes asignar un valor predeterminado como `size = 100`, que se utiliza para las props faltantes y `undefined`.
* Puedes reenviar todas las props con la sintaxis de propagación JSX `<Avatar {...props} />`, ¡pero no abuses de ella!
* Todo JSX anidado como `<Card><Avatar /></Card>` aparecerá como la prop `children` del componente `Card`.
* Las props son instantáneas de solo lectura en el tiempo: cada renderizado recibe una nueva versión de las props.
* No puedes cambiar las props. Si necesitas interactividad, tendrás que establecer un estado.

</Recap>



<Challenges>

#### Extraer un componente {/*extract-a-component*/}

Este componente `Gallery` contiene un marcado muy similar para dos perfiles. Extrae un componente `Profile` para reducir la duplicación. Tendrás que determinar qué props pasarle.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Científicos Notables</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profesión: </b> 
            física y química
          </li>
          <li>
            <b>Premios: 4 </b> 
            (Premio Nobel de Física, Premio Nobel de Química, Medalla Davy, Medalla Matteucci)
          </li>
          <li>
            <b>Descubrió: </b>
            polonio (elemento químico)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profesión: </b> 
            geoquímica
          </li>
          <li>
            <b>Premios: 2 </b> 
            (Premio Miyake de geoquímica, Premio Tanaka)
          </li>
          <li>
            <b>Descubrió: </b>
            un método para medir el dióxido de carbono en el agua de mar
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Comienza extrayendo el marcado para uno de los científicos. Luego, identifica las partes que no coinciden con el otro científico y hazlas configurables mediante props.

</Hint>

<Solution>

En esta solución, el componente `Profile` acepta varias props: `imageId` (un string), `name` (un string), `profession` (un string), `awards` (un array de strings), `discovery` (un string) e `imageSize` (un número).

Nota que la prop `imageSize` tiene un valor predeterminado, por eso no se la pasamos al componente.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profesión:</b> {profession}</li>
        <li>
          <b>Premios: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Descubrió: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Científicos Notables</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="física y química"
        discovery="polonio (elemento químico)"
        awards={[
          'Premio Nobel de Física',
          'Premio Nobel de Química',
          'Medalla Davy',
          'Medalla Matteucci'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geoquímico'
        discovery="un método para medir el dióxido de carbono en el agua de mar"
        awards={[
          'Premio Miyake de geoquímica',
          'Premio Tanaka'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Observa que no necesitas una prop separada llamada `awardCount` si ya tienes `awards` como un array. Puedes acceder a la cantidad de premios utilizando `awards.length`. Recuerda que las props pueden recibir cualquier valor, ¡incluso arrays!

Otra solución, que es más similares a los ejemplos antes expuestos en esta página, es agrupar toda la información sobre la persona en un solo objeto y pasar ese objeto como una única prop:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profesión:</b> {person.profession}
        </li>
        <li>
          <b>Premios: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Descubrió: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Científicos Notables</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'física y química',
        discovery: 'polonio (elemento químico)',
        awards: [
          'Premio Nobel de Física',
          'Premio Nobel de Química',
          'Medalla Davy',
          'Medalla Matteucci'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geoquímico',
        discovery: 'un método para medir el dióxido de carbono en el agua de mar',
        awards: [
          'Premio Miyake de geoquímica',
          'Premio Tanaka'
        ],
      }} />
    </div>
  );
}
```

```js src/utils.js
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Aunque la sintaxis se ve ligeramente diferente debido a que estás describiendo las propiedades de un objeto Javascript en lugar de una colección de atributos JSX, en general estos ejemplos son equivalentes y puedes elegir el método que más te convenga.

</Solution>

#### Ajustar el tamaño de la imagen según una prop {/*adjust-the-image-size-based-on-a-prop*/}

En este ejemplo, el componente `Avatar` recibe una prop numérica llamada `size` que determina el ancho y alto de la etiqueta `<img>`. En este caso, la prop `size` está establecida en `40`. Sin embargo, al abrir la imagen en una pestaña nueva, se puede observar que la imagen en sí tiene un tamaño mayor (`160` píxeles). El tamaño real de la imagen se determina en base al tamaño de la miniatura que se está solicitando.

Modifica el componente `Avatar` para que solicite el tamaño de imagen más adecuado en función de la prop `size`. Específicamente, si el valor de `size` es menor a `90`, pasa `'s'` ("small") en lugar de `'b'` ("big") a la función `getImageUrl`. Verifica que tus cambios funcionen correctamente al renderizar avatares con diferentes valores de `size` y al abrir las imágenes en una pestaña nueva.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Aquí tienes una posible forma de hacerlo:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

También podrías mostrar una imagen más nítida en pantallas de alta DPI teniendo en cuenta [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Las props permiten encapsular lógica como esta dentro del componente `Avatar` (y cambiarla más adelante si es necesario) para que todos puedan usar el componente `<Avatar>` sin preocuparse por cómo se solicitan y redimensionan las imágenes.

</Solution>

#### Pasar JSX en una prop `children` {/*passing-jsx-in-a-children-prop*/}

Extrae un componente `Card` del marcado que se muestra a continuación y usa la prop `children` para pasarle contenido diferente de JSX:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Foto</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>Información</h1>
          <p>Aklilu Lemma fue un destacado científico etíope que descubrió un tratamiento natural para la esquistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Cualquier JSX que coloques dentro de las etiquetas de un componente se pasará como la prop `children` a ese componente.

</Hint>

<Solution>

Así es como puedes usar el componente `Card` en ambos lugares:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Foto</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>Información</h1>
        <p>Aklilu Lemma fue un destacado científico etíope que descubrió un tratamiento natural para la esquistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

También puedes hacer que `title` sea una prop separada si quieres que cada `Card` siempre tenga un título:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Foto">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="Información">
        <p>Aklilu Lemma fue un destacado científico etíope que descubrió un tratamiento natural para la esquistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
