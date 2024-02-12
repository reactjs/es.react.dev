---
title: Reaccionar a las entradas con el estado
---

<Intro>

React utiliza una forma declarativa para manipular la UI. En vez de manipular trozos de la UI de forma individual directamente, describes los diferentes estados en los que puede estar tu componente, y cambias entre ellos en respuesta al lo que haga el usuario. Esto es similar a como los diseñadores piensan en la UI

</Intro>

<YouWillLearn>

* Como la programación de UI declarativa se diferencia de la programación de UI imperativa
* Como enumerar los diferentes estados visuales en los que tus componentes pueden estar
* Como forzar los cambios entre los distintos estados desde el código 

</YouWillLearn>

## Cómo la UI declarativa se compara a la declarativa {/*how-declarative-ui-compares-to-imperative*/}

Cuando diseñas interacciones con la UI, seguramente pensarás en como la UI *cambia* en respuesta a las acciones del usuario. Imagina un formulario que permita al usuario enviar una respuesta: 

* Cuando escribes algo en el formulario, el botón "Enviar" **se habilita.**
* Cuando presionas "Enviar", tanto el formulario como el botón **se deshabilitan,** y un indicativo de carga **aparece.**
* Si la petición es exitosa, el formulario **se oculta,** y un mensaje "Gracias" **aparece.**
* Si la petición falla, un mensaje de error **aparece,** y el formulario **se habilita** de nuevo.

En la **programación imperativa,** lo descrito arriba se corresponde directamente con como implementas la interacción. Tienes que escribir las instrucciones exactas para manipular la UI dependiendo de lo que acabe de suceder. Esta es otra manera de abordar este concepto: imagina acompañar a alguien en un coche mientras le dices paso a paso que tiene que hacer.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="En un coche conducido por una persona con apariencia ansiosa, representando a JavaScript, un pasajero le ordena al conductor a realizar una complicada secuencia de giros e indicaciones." />

No sabe a donde quieres ir, solo sigue tus indicaciones. (Y si le das las indicaciones incorrectas, ¡acabarás en el lugar equivocado!) Se llama *imperativo* por que tienes que "mandar" a cada elemento, desde el indicativo de carga hasta el botón, diciéndole al ordenador *cómo* tiene que actualizar la UI.

En este ejemplo de UI declarativa, el formulario esta construido *sin* React. Utiliza el [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) del navegador:

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Buen intento, pero incorrecto. ¡Inténtalo de nuevo!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>Cuestionario sobre ciudades</h2>
  <p>
    ¿Qué ciudad se ubica entre dos continentes?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Enviar</button>
  <p id="loading" style="display: none">Cargando...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">¡Correcto!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Manipular la UI de forma imperativa funciona lo suficientemente bien en ejemplos aislados, pero se vuelve mas complicado de manejar de forma exponencial en sistemas complejos. Imagina actualizar una pagina llena de formularios diferentes como este. Añadir un elemento nuevo a la UI o una nueva interacción requeriría revisar todo el código existente meticulosamente para asegurarse de no haber introducido un bug (por ejemplo, olvidando mostrar u ocultar algo).

React fue construido para solucionar este problema.

En React, no necesitas manipular directamente la UI,lo que significa que no necesitas habilitar, deshabilitar, mostrar, u ocultar los componentes directamente. En su lugar, tú **declaras lo que quieres mostrar,** y React averigua cómo actualizar la UI. Piensa en ello como montarte en un taxi y decirle al conductor a donde quieres ir en lugar de decirle paso por paso que hacer. Es el trabajo del conductor llevarte a tu destino, ¡e incluso conocerá algún atajo que no habías considerado!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="En un coche conducido por React, un pasajero indica el lugar al que desea ir en el mapa. React sabe como hacerlo." />

## Pensar en la UI de forma declarativa {/*thinking-about-ui-declaratively*/}

Arriba has visto como implementar un formulario de forma imperativa. Para entender mejor como pensar en React, recorrerás el ejemplo reimplementando esta UI en React más abajo:

1. **Identifica** los diferentes estados visuales de tu componente
2. **Determina** qué produce esos cambios de estado
3. **Representa** el estado en memoria usando `useState`
4. **Elimina** cualquier variable de estado no esencial
5. **Conecta** los controladores de eventos para actualizar el estado

### Paso 1: Identifica los diferentes estados visuales de tu componente {/*step-1-identify-your-components-different-visual-states*/}

En las ciencias de la computación, tal vez escucharás algo sobre una ["máquina de estado"](https://en.wikipedia.org/wiki/Finite-state_machine) siendo este uno de muchos "estados". Si trabajas con un diseñador, habrás visto bocetos para diferentes "estados visuales". React se encuentra en un punto intermedio de diseño y ciencias de la computación, asi que ambas ideas son fuentes de inspiración.

Primero, necesitas visualizar todos los diferentes "estados" de la UI que el usuario pueda ver:

* **Vacío**: El formulario tiene deshabilitado el botón "Enviar".
* **Escribiendo**: El formulario tiene habilitado el botón "Enviar".
* **Enviando**: El formulario está completamente deshabilitado. Se muestra un indicador de carga.
* **Éxito**: El mensaje "Gracias" se muestra en lugar del formulario.
* **Error**: Igual que el estado de Escribiendo, pero con un mensaje de error extra.

Al igual que un diseñador, querrás "esbozar" o crear "bocetos" para los diferentes estados antes de añadir tu lógica. Por ejemplo, aquí hay un boceto solo para la parte visual del formulario. Este boceto es controlado por una prop llamado `status` con valor por defecto de `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>¡Correcto!</h1>
  }
  return (
    <>
      <h2>Cuestionario sobre ciudades</h2>
      <p>
       ¿En qué ciudad hay un cartel que convierte el aire en agua potable?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Enviar
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Podrías llamar a ese prop de la forma que quisieras, el nombre no es importante. Prueba a editar `status = 'empty'` a `status = 'success'` para que veas el mensaje aparecer. Esbozar te permita iterar en la UI rápidamente antes de comenzar con la lógica. Aquí hay una versión algo más desarrollada del mismo componente, todavía "controlada" por la prop `status`:

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>¡Correcto!</h1>
  }
  return (
    <>
      <h2>Cuestionario sobre ciudades</h2>
      <p>
        ¿En qué ciudad hay un cartel que convierte el aire en agua potable?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Enviar
        </button>
        {status === 'error' &&
          <p className="Error">
            Buen intento, pero incorrecto. ¡Intntalo de nuevo!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Mostrar muchos estados visuales a la vez {/*displaying-many-visual-states-at-once*/}

Si un componente tiene un montón de estados visuales, puede resultar conveniente mostrarlos todos en una página:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>¡Correcto!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Enviar
      </button>
      {status === 'error' &&
        <p className="Error">
          Buen intento, pero incorrecto. ¡Inténtalo de nuevo!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Páginas como estas son comúnmente llamadas como "guías de estilo en vivo" o "storybooks".

</DeepDive>

### Paso 2: Determina qué produce esos cambios de estado {/*step-2-determine-what-triggers-those-state-changes*/}

Puedes desencadenar actualizaciones de estado en respuesta a dos tipos de entradas:

* **Entradas humanas,** como hacer click en un botón, escribir en un campo, navegar a un link.
* **Entradas del ordenador,** como recibir una respuesta del navegador, que se complete un *timeout*, una imagen cargando.

<IllustrationBlock title="Types of inputs">
  <Illustration caption="Entradas humanas" alt="Un dedo." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Entradas del ordenador" alt="Unos y ceros." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

En ambos casos, **debes declarar [variables de estado](/learn/state-a-components-memory#anatomy-of-usestate) para actualizar la UI.** Para el formulario que vas a desarrollar, necesitarás cambiar el estado en respuesta de diferentes entradas:

* **Cambiar la entrada de texto** (humano) debería cambiar del estado *Vacío* al estado *Escribiendo* o al revés, dependiendo de si la caja de texto está vacía o no.
* **Hacer click el el botón Enviar** (humano) debería cambiarlo al estado *Enviando* .
* **Una respuesta exitosa de red** (ordenador) debería cambiarlo al estado *Éxito*.
* **Una respuesta fallida de red** (ordenador) debería cambiarlo al estado *Error* con el mensaje de error correspondiente.

<Note>

> ¡Ten en cuenta que las entradas humanas suelen necesitar [controladores de eventos](/learn/responding-to-events)!

</Note>

Para ayudarte a visualizar este flujo, intenta dibujar cada estado en papel como un círculo etiquetado, y cada cambio entre dos estados como una flecha. Puedes esbozar muchos flujos de esta manera y ordenar los errores mucho antes de la implementación.
<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="
Diagrama de flujo que se mueve de izquierda a derecha con 5 nodos. El primer nodo etiquetado 'vacío' tiene una arista etiquetada 'empezar a escribir' conectada a un nodo etiquetado 'escribiendo'. Ese nodo tiene una arista etiquetada 'presionar enviar' conectada a un nodo etiquetado 'enviando', que tiene dos aristas. La arista izquierda está etiquetada 'error de red' conectada a un nodo etiquetado 'error'. La arista derecha está etiquetada 'éxito de red' conectada a un nodo etiquetado 'éxito'.">

Estados del formulario

</Diagram>

</DiagramGroup>

### Paso 3: Representa el estado en memoria usando `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

A continuación, necesitarás representar los estados visuales de tu componente en la memoria con [`useState`.](/reference/react/useState) La simplicidad es clave: cada pieza de estado es una "pieza en movimiento", y **quieres tan pocas "piezas en movimiento" como sea posible.** ¡Más complejidad conduce a más errores!

Comienza con el estado que *absolutamente debe* estar allí. Por ejemplo, necesitarás almacenar la `respuesta` para la entrada y el `error` (si existe) para almacenar el último error:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Después, necesitarás una variable de estado que represente cuál de los estados visuales descritos anteriormente quieres mostrar. Generalmente hay más de una manera de representarlo en la memoria, por lo que necesitarás experimentar con ello.

Si tienes dificultades para pensar en la mejor manera inmediatamente, comienza agregando suficiente estado para que *definitivamente* estés seguro de que todos los posibles estados visuales están cubiertos:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Tu primera idea probablemente no sea la mejor, ¡pero está bien! ¡Refactorizar el estado es parte del proceso!

### Paso 4: Elimina cualquier variable de estado no esencial {/*step-4-remove-any-non-essential-state-variables*/}

Deberías evitar la duplicación en el contenido del estado, por lo que solo rastrearás lo que es esencial. Dedicar un poco de tiempo a refactorizar su estructura de estado hará que tus componentes sean más fáciles de entender, reducirá la duplicación y evitará significados no deseados. Tu objetivo es **prevenir los casos en los que el estado en la memoria no represente ninguna UI válida que te gustaría que viera un usuario.** (Por ejemplo, nunca deberías mostrar un mensaje de error y deshabilitar la entrada al mismo tiempo, ¡o el usuario no podría corregir el error!)

Aquí hay algunas preguntas que podrías hacerte sobre tus variables de estado:

* **¿Significa que el estado causa un paradoja?** Por ejemplo, `isTyping` y `isSubmitting` no pueden ser ambos `true`. Un paradoja generalmente significa que el estado no está lo suficientemente restringido. Hay cuatro combinaciones posibles de dos booleanos, pero solo tres corresponden a estados válidos. Para eliminar el estado "imposible", puede combinarlos en un `status` que debe ser uno de tres valores: `'typing'`, `'submitting'`, o `'success'`.
* **¿La misma información está disponible en otra variable de estado ya?** Otra paradoja: `isEmpty` y `isTyping` no pueden ser `true` al mismo tiempo. Al hacerlos variables de estado separadas, corre el riesgo de que se desincronicen y causen errores. Afortunadamente, se puede eliminar `isEmpty` y en su lugar verificar `answer.length === 0`.
* **¿Se puede obtener la misma información de la inversa de otra variable de estado?** `isError` no es necesario porque se puede comprobar `error !== null` en su lugar.

Después de esta limpieza, nos quedamos con 3 (¡a partir de 7!) variables de estado *esenciales* :

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', o 'success'
```

Sabes que son esenciales, porque no puedes eliminar ninguna de ellos sin romper la funcionalidad.

<DeepDive>

#### Eliminar estados "imposibles" con un reducer {/*eliminating-impossible-states-with-a-reducer*/}

Estas tres variables son una representación suficientemente buena del estado de este formulario. Sin embargo, todavía hay algunos estados intermedios que no tienen sentido. Por ejemplo, un `error` no nulo no tiene sentido cuando `status` es `'success'`. Para modelar el estado con más precisión, puedes [extraerlo en un reducer.](/learn/extracting-state-logic-into-a-reducer) ¡Los reducers le permiten unificar múltiples variables de estado en un solo objeto y consolidar toda la lógica relacionada!

</DeepDive>

### Paso 5: Conecta los controladores de eventos para actualizar el estado {/*step-5-connect-the-event-handlers-to-set-state*/}

Por último, crea controladores de eventos para establecer las variables de estado. A continuación se muestra el formulario final, con todos los controladores de eventos conectados:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>¡Correcto!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Cuestionario sobre ciudades</h2>
      <p>
        ¿En qué ciudad hay un cartel que convierte el aire en agua potable?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Enviar
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Buen intento, pero incorrecto. ¡Inténtalo de nuevo!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Aunque este código es más largo que el ejemplo imperativo original, es mucho menos frágil. Expresar todas las interacciones como cambios de estado te permite introducir nuevos estados visuales sin romper los existentes. También te permite cambiar lo que se debe mostrar en cada estado sin cambiar la lógica de la interacción en sí.

<Recap>

* La programación declarativa significa describir la interfaz de usuario para cada estado visual en lugar de microgestionar la interfaz de usuario (imperativa).
* Cuando desarrolles un componente:
  1. Identifica todos sus estados visuales.
  2. Determina los disparadores humanos y de computadora para los cambios de estado.
  3. Modela el estado con `useState`.
  4. Elimina el estado no esencial para evitar errores y paradojas.
  5. Conecta los controladores de eventos para actualizar el estado.

</Recap>



<Challenges>

#### Añade y elimina una clase de CSS {/*add-and-remove-a-css-class*/}

Haz que al hacer clic en la imagen *elimine* la clase CSS `background--active` del `<div>` externo, pero *agregue* la clase `picture--active` a la `<img>`. Al hacer clic en el fondo nuevamente, debería restaurar las clases CSS originales.

Visualmente, deberías esperar que al hacer clic en la imagen se elimine el fondo morado y se resalte el borde de la imagen. Al hacer clic fuera de la imagen, se resalta el fondo, pero se elimina el resaltado del borde de la imagen.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Casas de arcoiris en Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Este componente tiene dos estados visuales: cuando la imagen está activa y cuando la imagen está inactiva:

* Cuando la imagen está activa, las clases CSS son `background` y `picture picture--active`.
* Cuando la imagen está inactiva, las clases CSS son `background background--active` y `picture`.

Una sola variable de estado booleana es suficiente para recordar si la imagen está activa. La tarea original era eliminar o agregar clases CSS. Sin embargo, en React, necesitas *describir* lo que deseas ver en lugar de *manipular* los elementos de la interfaz de usuario. Por lo tanto, debes calcular ambas clases CSS en función del estado actual. También debes [detener la propagación](/learn/responding-to-events#stopping-propagation) para que al hacer clic en la imagen no se registre como un clic en el fondo.

Verifica que esta versión funcione haciendo clic en la imagen y luego fuera de ella:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Casas de arcoiris en Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Alternativamente, podrías devolver dos trozos de JSX separados:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Casas de arcoiris en Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Casas de arcoiris en Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Ten en cuenta que si dos trozos de JSX diferentes describen el mismo árbol, su anidamiento (primer `<div>` → primer `<img>`) tiene que coincidir. De lo contrario, cambiar `isActive` recrearía todo el árbol debajo y [reiniciaría su estado.](/learn/preserving-and-resetting-state) Es por eso que, si un árbol de JSX similar se devuelve en ambos casos, es mejor escribirlos como un solo trozo de JSX.

</Solution>

#### Editor de perfil {/*profile-editor*/}

Aquí está un pequeño formulario implementado con JavaScript y DOM. Juega con él para entender su comportamiento:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Editar Perfil') {
    editButton.textContent = 'Guardar Perfil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Editar Perfil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hola ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hola ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nombre:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Apellido:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Editar Perfil</button>
  <p><i id="helloText">Hola, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Este formulario cambia entre dos modos: en el modo de edición, ves los formularios de entrada y en el modo de visualización, solo ves los resultados. La etiqueta del botón cambia entre "Editar" y "Guardar" en dependencia del modo en que estés. Cuando cambias las entradas, el mensaje de bienvenida de la parte inferior se actualiza en tiempo real.

Tu tarea es reimplementarlo en React en el *sandbox* de abajo. Para tu conveniencia, el marcado ya ha sido convertido a JSX, pero tendrás que hacer que muestre y oculte las entradas como hace el original.

¡Asegúrate de que también actualice el texto de la parte inferior!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        Nombre:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Apellido:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Editar Perfil
      </button>
      <p><i>¡Hola, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Necesitarás dos variables de estado para guardar los valores de las entradas: `firstName` y `lastName`. También necesitarás una variable de estado `isEditing` que guarde si se debe mostrar las entradas o no. No deberías necesitar una variable `fullName` porque el nombre completo siempre se puede calcular a partir de `firstName` y `lastName`.

Finalmente, deberías utilizar [renderizado condicional](/learn/conditional-rendering) para mostrar o esconder las entradas en dependencia del valor de `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        Nombre:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Apellido:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Guardar' : 'Editar'} Profile
      </button>
      <p><i>Hola, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Compara esta solución a la original con código imperativo. ¿En qué se diferencian?

</Solution>

#### Refactoriza la solución imperativa sin React {/*refactor-the-imperative-solution-without-react*/}

Aquí está el *sandbox* original del desafío anterior, escrito de forma imperativa sin React:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Editar Perfil') {
    editButton.textContent = 'Guardar Perfil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Editar Perfil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hola ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hola ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nombre:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Apellido:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Editar Perfil</button>
  <p><i id="helloText">¡Hola, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Imagina que React no existiera. ¿Puedes refactorizar este código de una manera que haga que la lógica sea menos frágil y más similar a la versión de React? ¿Cómo se vería si el estado fuera explícito, como en React?

Si te cuesta pensar por dónde empezar, el código de abajo ya tiene la mayoría de la estructura en su lugar. Si comienzas aquí, completa la lógica que falta en la función `updateDOM`. (Dirígete al código original donde sea necesario.)

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Guardar Perfil';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Editar Perfil';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nombre:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Apellido:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Editar Perfil</button>
  <p><i id="helloText">¡Hola, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

La lógica faltante incluye el cambio de la visualización de las entradas y el contenido y la actualización de las etiquetas:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Guardar Perfil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Editar Perfil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    '¡' + 'Hola ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nombre:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Apellido:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Editar Perfil</button>
  <p><i id="helloText">¡Hola, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

La función `updateDOM` que escribiste muestra lo que hace React por debajo del capó cuando estableces el estado. (Sin embargo, React también evita tocar el DOM para las propiedades que no han cambiado desde la última vez que se establecieron.)

</Solution>

</Challenges>
