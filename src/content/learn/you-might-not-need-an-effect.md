---
title: 'Quizás no necesites un Efecto'
---

<Intro>

Los Efectos son una vía de escape del paradigma de React. Te permiten "salir" de React y sincronizar tus componentes con algún sistema externo, como un _widget_ que no es de React, una red o el DOM del navegador. Si no hay ningún sistema externo involucrado (por ejemplo, si deseas actualizar el estado de un componente cuando cambian ciertas _props_ o el estado), no deberías necesitar un Efecto. Eliminar Efectos innecesarios hará que tu código sea más fácil de seguir, se ejecute más rápido y sea menos propenso a errores.

</Intro>

<YouWillLearn>

* Por qué y cómo eliminar Efectos innecesarios de tus componentes.
* Cómo almacenar en caché cálculos costosos sin utilizar Efectos.
* Cómo restablecer y ajustar el estado del componente sin utilizar Efectos.
* Cómo compartir lógica entre controladores de eventos.
* Qué lógica debería ser trasladada a los controladores de eventos.
* Cómo notificar a los componentes padre acerca de cambios.

</YouWillLearn>

## Cómo eliminar Efectos innecesarios {/*how-to-remove-unnecessary-effects*/}

Hay dos casos comunes en los cuales no necesitas utilizar Efectos:

* **No necesitas Efectos para transformar datos antes de renderizar.** Por ejemplo, supongamos que deseas filtrar una lista antes de mostrarla. Podrías sentirte tentado/a a escribir un Efecto que actualice una variable de estado cuando cambie la lista. Sin embargo, esto es ineficiente. Cuando actualizas el estado, React primero llama a las funciones de tu componente para calcular lo que debería mostrarse en la pantalla. Luego, React ["confirmará"](/learn/render-and-commit) estos cambios en el DOM, actualizando la pantalla. Después, React ejecuta tus Efectos. ¡Si tu Efecto también actualiza inmediatamente el estado, esto reinicia todo el proceso desde cero! Para evitar pasadas de renderizado innecesarias, transforma todos los datos en el nivel superior de tus componentes. Ese código se volverá a ejecutar automáticamente cada vez que tus _props_ o estado cambien.
* **No necesitas Efectos para manejar eventos del usuario.** Por ejemplo, supongamos que deseas enviar una solicitud POST `/api/buy` y mostrar una notificación cuando el usuario compra un producto. En el controlador de eventos del botón "Comprar", sabes exactamente lo que sucedió. Para el momento en que se ejecuta un Efecto, no sabes *qué* hizo el usuario (por ejemplo, qué botón se hizo clic). Por esta razón, generalmente se manejan los eventos del usuario en los controladores de eventos correspondientes.

Es *cierto* que necesitas Efectos para [sincronizar](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) con sistemas externos. Por ejemplo, puedes escribir un Efecto que mantenga sincronizado un _widget_ de jQuery con el estado de React. También puedes obtener datos con Efectos, por ejemplo, puedes sincronizar los resultados de búsqueda con la consulta de búsqueda actual. Ten en cuenta que los [_frameworks_](/learn/start-a-new-react-project#production-grade-react-frameworks) modernos proporcionan mecanismos más eficientes y nativos para obtener datos que escribir Efectos directamente en tus componentes.

Para ayudarte a desarrollar la intuición adecuada, ¡veamos algunos ejemplos concretos comunes!

### Actualización del estado basada en _props_ o estado {/*updating-state-based-on-props-or-state*/}

Supongamos que tienes un componente con dos variables de estado: `firstName` y `lastName`. Deseas calcular un `fullName` a partir de ellos concatenándolos. Además, te gustaría que `fullName` se actualice cada vez que `firstName` o `lastName` cambien. Tu primer instinto podría ser agregar una variable de estado `fullName` y actualizarla en un Efecto:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Evitar: estado redundante y Efecto innecesario
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Esto es más complicado de lo necesario. También es ineficiente: realiza un pase de renderización completo con un valor obsoleto para `fullName`, y luego se vuelve a renderizar inmediatamente con el valor actualizado. Elimina la variable de estado y el Efecto:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Correcto: calculado durante el renderizado.
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Cuando algo puede calcularse a partir de las _props_ o el estado existente, [no lo pongas en el estado](/learn/choosing-the-state-structure#avoid-redundant-state). En su lugar, calcúlalo durante el renderizado.** Esto hace que tu código sea más rápido (evitas las actualizaciones adicionales "en cascada"), más simple (eliminas código innecesario) y menos propenso a errores (evitas errores causados por diferentes variables de estado desincronizadas entre sí). Si este enfoque te resulta nuevo, [Pensar en React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) explica qué debe ir en el estado.

### Almacenamiento en caché de cálculos costosos{/*caching-expensive-calculations*/}

Este componente calcula `visibleTodos` tomando los `todos` que recibe a través de _props_ y filtrándolos según la _prop_ `filter`. Podrías sentirte tentado/a de almacenar el resultado en el estado y actualizarlo desde un Efecto:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Evitar: estado redundante y Efecto innecesario
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Al igual que en el ejemplo anterior, esto es innecesario e ineficiente. Primero, elimina el estado y el Efecto:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Esto está bien si getFilteredTodos() no es lento.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Usualmente, ¡este código está bien! Pero tal vez `getFilteredTodos()` sea lento o tengas muchos `todos`. En ese caso, no querrás recalcular `getFilteredTodos()` si alguna variable de estado no relacionada, como `newTodo`, ha cambiado.

Puedes almacenar en caché (o ["memoizar"](https://es.wikipedia.org/wiki/Memoización)) un cálculo costoso envolviéndolo en un Hook de React [`useMemo`](/reference/react/useMemo):

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ No se vuelve a ejecutar a menos que cambien todos o filter.
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

O, escrito en una sola línea:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ No se vuelve a ejecutar getFilteredTodos() a menos que cambien todos o filter.
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Esto le indica a React que no deseas que la función interna se vuelva a ejecutar a menos que `todos` o `filter` hayan cambiado.** React recordará el valor de retorno de `getFilteredTodos()` durante el renderizado inicial. Durante los siguientes renderizados, verificará si `todos` o `filter` son diferentes. Si son iguales que la última vez, `useMemo` devolverá el último resultado almacenado. Pero si son diferentes, React llamará nuevamente a la función interna (y almacenará su resultado).

La función que envuelves en [`useMemo`](/reference/react/useMemo) se ejecuta durante el renderizado, por lo que esto solo funciona para [cálculos puros.](/learn/keeping-components-pure)

<DeepDive>

#### ¿Cómo determinar si un cálculo es costoso? {/*how-to-tell-if-a-calculation-is-expensive*/}

En general, a menos que estés creando o iterando sobre miles de objetos, probablemente no es costoso. Si deseas tener más confianza, puedes agregar un registro en la consola para medir el tiempo que se tarda en ejecutar una pieza de código:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Realiza la interacción que estás midiendo (por ejemplo, escribir en el campo de entrada (_input_)). Luego, verás registros en la consola como `filter array: 0.15ms`. Si el tiempo total registrado suma una cantidad significativa (digamos, `1ms` o más), podría tener sentido memoizar ese cálculo. Como experimento, puedes envolver el cálculo en `useMemo` para verificar si el tiempo total registrado ha disminuido para esa interacción o no:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Se omite si todos y filter no han cambiado
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` no hará que el *primer* renderizado sea más rápido. Solo te ayuda a evitar trabajo innecesario en las actualizaciones.

Ten en cuenta que tu máquina probablemente sea más rápida que la de tus usuarios, por lo que es una buena idea probar el rendimiento con una ralentización artificial. Por ejemplo, Chrome ofrece una opción de [limitación de CPU](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) para esto.

También ten en cuenta que medir el rendimiento en desarrollo no te dará los resultados más precisos. (Por ejemplo, cuando [Modo Estricto](/reference/react/StrictMode) está activado, verás que cada componente se renderiza dos veces en lugar de una). Para obtener los tiempos más precisos, construye tu aplicación para producción y pruébala en un dispositivo similar al que usan tus usuarios.

</DeepDive>

### Restablecer todo el estado cuando una _prop_ cambia {/*resetting-all-state-when-a-prop-changes*/}

Este componente `ProfilePage` recibe una prop `userId`. La página contiene una entrada de texto de comentario, y utiliza una variable de estado `comment` para guardar su valor. Un día, te das cuenta de un problema: cuando navegas de un perfil a otro, el estado `comment` no se reinicia. Como resultado, es fácil publicar accidentalmente un comentario en el perfil de un usuario incorrecto. Para solucionar el problema, quieres limpiar la variable de estado `comment` cada vez que el `userId` cambie:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Evitar: Restablecer el estado en un cambio de prop dentro de un Efecto.
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Esto es ineficiente porque `ProfilePage` y sus hijos primero se renderizarán con el valor obsoleto, y luego se renderizarán de nuevo. También es complicado porque necesitarías hacer esto en *cada* componente que tenga algún estado dentro de `ProfilePage`. Por ejemplo, si la interfaz de usuario del comentario está anidada, también querrías limpiar el estado del comentario anidado.

En lugar de ello, puedes decirle a React que cada perfil de usuario es conceptualmente un perfil _diferente_ dándole una _key_ explícita. Divide tu componente en dos y pasa un atributo `key` del componente exterior al interior:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ Esto y cualquier otro estado a continuación se reiniciará automáticamente al cambiar la key
  const [comment, setComment] = useState('');
  // ...
}
```

Usualmente, React conserva el estado cuando el mismo componente se renderiza en el mismo lugar. **Al pasar `userId` como una `key` al componente `Profile`, le estás pidiendo a React que trate a dos componentes `Profile` con diferentes `userId` como dos componentes diferentes que no deberían compartir ningún estado.** Cuando la key (que has establecido como `userId`) cambie, React recreará el DOM y [reiniciará el estado](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) del componente `Profile` y todos sus hijos. Ahora el campo `comment` se borrará automáticamente cuando se navegue entre perfiles.

Ten en cuenta que en este ejemplo, solo el componente externo `ProfilePage` es exportado y visible para otros archivos en el proyecto. Los componentes que renderizan `ProfilePage` no necesitan pasar la key a este: pasan `userId` como una prop regular. El hecho de que `ProfilePage` lo pase como una `key` al componente interno `Profile` es un detalle de implementación.

### Actualizar parte del estado cuando cambie una prop {/*adjusting-some-state-when-a-prop-changes*/}

A veces, querrás resetear o ajustar una parte del estado según un cambio de prop, pero no todo.

Este componente `List` recibe una lista de `items` como una prop y mantiene el elemento seleccionado en la variable de estado `selection`. Tu objetivo es resetear `selection` a `null` siempre que la prop `items` reciba un array diferente:

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Evitar: Ajustar el estado en un cambio de prop dentro de un Efecto.
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Esto, también, no es ideal. Cada vez que cambian los `items`, el componente `List` y sus componentes hijos se renderizarán inicialmente con un valor obsoleto de `selection`. Luego, React actualizará el DOM y ejecutará los Efectos. Finalmente, la llamada a `setSelection(null)` provocará otra nueva renderización del componente `List` y sus componentes hijos, reiniciando todo este proceso nuevamente.

Comienza por eliminar el Efecto. En su lugar, ajusta el estado directamente durante el renderizado:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Mejor: Ajusta el estado durante el renderizado.
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Almacenar información de renderizados previos](/reference/react/useState#storing-information-from-previous-renders) como se muestra en este ejemplo puede ser difícil de entender, pero es mejor que actualizar el mismo estado en un Efecto. En el ejemplo anterior, `setSelection` se llama directamente durante un renderizado. React volverá a renderizar el componente `List` *inmediatamente* después de salir del bloque de `return`. React aún no ha renderizado los hijos de `List` ni ha actualizado el DOM, lo que permite a los hijos de `List` omitir el renderizado del valor obsoleto de `selection`.

Cuando actualizas un componente durante el renderizado, React descarta el JSX devuelto y vuelve a intentar el renderizado de inmediato. Para evitar reintentos en cascada muy lentos, React solo te permite actualizar el estado del *mismo* componente durante el renderizado. Si intentas actualizar el estado de otro componente durante el renderizado, verás un error. Una condición como `items !== prevItems` es necesaria para evitar bucles. Puedes ajustar el estado de esta manera, pero cualquier otro efecto secundario (como cambios en el DOM o establecer tiempos de espera) debe mantenerse en los controladores de eventos o en Efectos para [mantener los componentes puros.](/learn/keeping-components-pure)

**Aunque este patrón es más eficiente que un Efecto, la mayoría de los componentes tampoco deberían necesitarlo.** No importa cómo lo hagas, ajustar el estado basado en las props u otro estado hace que tu flujo de datos sea más difícil de entender y depurar. Siempre verifica si puedes [resetear todo el estado con una key](#resetting-all-state-when-a-prop-changes) o [calcular todo durante el renderizado](#updating-state-based-on-props-or-state) en su lugar. Por ejemplo, en lugar de almacenar (y resetear) el *ítem* seleccionado, puedes almacenar el *ID del ítem seleccionado*:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Una mejor práctica: Calcular todo durante el renderizado
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Ahora no hay necesidad de "ajustar" el estado en lo absoluto. Si el _item_ con el ID seleccionado está en la lista, permanecerá seleccionado. Si no lo está, la `selection` calculada durante el renderizado será `null` porque no se encontró ningún _item_ coincidente. Este comportamiento es diferente, pero se podría decir que es mejor porque la mayoría de los cambios en `items` preservan la selección.

### Compartir la lógica entre manejadores de eventos {/*sharing-logic-between-event-handlers*/}

Supongamos que tienes una página de producto con dos botones (Comprar y Pagar) los cuales te permiten comprar ese producto. Quieres mostrar una notificación cada vez que el usuario pone el producto en el carrito. Llamar a `showNotification()` en los manejadores de clic de ambos botones se siente repetitivo, por lo que podrías estar tentado a colocar esta lógica en un Efecto:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Evita: Lógica específica para evento dentro de un Efecto
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Este Efecto es innecesario. Incluso es muy probable que cause errores. Por ejemplo, digamos que tu aplicación "recuerda" el carrito de compras entre recargas de la página. Si añades un producto al carrito una vez y refrescas la página, la notificación aparecerá de nuevo. Y seguirá apareciendo cada vez que refresques la página del producto. Esto se debe a que `product.isInCart` ya será `true` en la carga de la página, por lo que el Efecto anterior llamará a `showNotification()`.

**Cuando no estés seguro de si algún código debería estar en un Efecto o en un manejador de eventos, pregúntate *por qué* este código necesita ejecutarse. Usa Efectos solo para el código que debe ejecutarse *porque* el componente se mostró al usuario.** En este ejemplo, la notificación debería aparecer porque el usuario *presionó el botón*, ¡no porque se mostró la página! Elimina el Efecto y coloca la lógica compartida en una función llamada desde ambos manejadores de eventos:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Buena práctica: La lógica específica para eventos se llama desde los manejadores de eventos
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Esto tanto elimina el Efecto innecesario como corrige el error.

### Realizar una petición POST {/*sending-a-post-request*/}

Este componente `Form` envía dos tipos de solicitudes POST. Envía un evento de analíticas cuando se monta. Por otra parte, cuando llenas el formulario y haces clic en el botón Enviar, enviará una solicitud POST al endpoint `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Buena práctica: Esta lógica debe ejecutarse porque el componente se mostró al usuario
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Evita: Lógica específica de evento dentro de un Efecto
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Apliquemos el mismo criterio que en el ejemplo anterior.

La solicitud POST de analíticas debe permanecer en un Efecto. Esto es porque la _razón_ para enviar el evento de analíticas es que el formulario se mostró. (Se dispararía dos veces en desarrollo, pero [mira aquí](/learn/synchronizing-with-effects#sending-analytics) cómo lidiar con eso.)

Sin embargo, la solicitud POST a `/api/register` no es causada por el formulario siendo _mostrado al usuario_. Solo quieres enviar la solicitud en un momento específico en el tiempo: cuando el usuario presiona el botón. Solo debería ocurrir _en esa interacción en particular_. Elimina el segundo Efecto y mueve esa solicitud POST al manejador de eventos:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Buena práctica: Esta lógica se ejecuta porque el componente se mostró al usuario
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Buena práctica: La lógica para el evento se ejecuta en un manejador de eventos
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Cuando estaás por decidir si poner alguna lógica en un manejador de eventos o un Efecto, la pregunta principal que debes responder es _qué tipo de lógica_ es desde la perspectiva del usuario. Si esta lógica es causada por una interacción en particular, mantenla en el manejador de eventos. Si es causada porque el usuario _ve_ el componente en la pantalla, mantenla en el Efecto.

### Cadenas de cálculos {/*chains-of-computations*/}

A veces podrías sentirte tentado a encadenar Efectos que ajustan una pieza de estado basada en otro estado:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Evitar: Cadenas de Efectos que ajustan el estado solo para activarse entre sí
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Hay dos problemas con este código.

Un problema es que es muy ineficiente: el componente (y sus hijos) tienen que volver a renderizarse entre cada llamada a un actualizador `set-` en la cadena. En el ejemplo anterior, en el peor de los casos (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) hay tres renderizaciones innecesarias del árbol hacia debajo.

Incluso si no fuera lento, a medida que tu código evoluciona, te encontrarás con casos en los que la "cadena" que escribiste no se ajusta a los nuevos requisitos. Imagina que estás añadiendo una forma de repasar el historial de movimientos del juego. Lo harías actualizando cada variable de estado a un valor del pasado. Sin embargo, establecer el estado `card` a un valor del pasado desencadenaría de nuevo la cadena de Efectos y cambiaría los datos que estás mostrando. Este tipo de código es a menudo rígido y frágil.

En este caso, es mejor calcular lo que puedas durante la renderización, y ajustar el estado en el manejador de eventos:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calcula lo que puedas durante la renderización
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calcula todo el siguiente estado en el manejador de eventos
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

Esto es mucho más eficiente. Además, si implementas una forma de ver el historial del juego, ahora podrás establecer cada variable de estado en un movimiento del pasado sin activar la cadena de Efectos que ajusta cada otro valor. Si necesitas reutilizar la lógica entre varios controladores de eventos, puedes [extraer una función](#sharing-logic-between-event-handlers) y llamarla desde esos controladores.

Recuerda que dentro de los controladores de eventos, [el estado se comporta como una instantánea.](/learn/state-as-a-snapshot) Por ejemplo, incluso después de llamar a `setRound(round + 1)`, la variable `round` reflejará el valor en el momento en que el usuario hizo clic en el botón. Si necesitas usar el siguiente valor para cálculos, defínelo manualmente como `const nextRound = round + 1`.

En algunos casos, *no puedes* calcular el siguiente estado directamente en el controlador de eventos. Por ejemplo, imagina un formulario con múltiples menús desplegables donde las opciones del siguiente menú desplegable dependen del valor seleccionado en el menú desplegable anterior. En este caso, una cadena de Efectos es apropiada porque estás sincronizando con la red.

### Inicializar la aplicación {/*initializing-the-application*/}

Alguna lógica solo debería ejecutarse una vez cuando se carga la aplicación.

Podrías sentirte tentado a colocarla en un Efecto en el componente de nivel superior:

```js {2-6}
function App() {
  // 🔴 Evitar: Efectos con lógica que solo deben ejecutarse una vez.
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Sin embargo, rápidamente descubrirás que esto [se ejecuta dos veces en desarrollo](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development). Esto puede causar problemas, por ejemplo, tal vez invalide el _token_ de autenticación porque la función no fue diseñada para ser llamada dos veces. En general, tus componentes deberían ser resistentes a ser montados de nuevo. Esto incluye tu componente de nivel superior `App`.

Aunque en la práctica en producción es posible que nunca se vuelva a montar, seguir las mismas restricciones en todos los componentes facilita mover y reutilizar el código. Si alguna lógica debe ejecutarse *una vez por carga de la aplicación* en lugar de *una vez por montaje del componente*, agrega una variable de nivel superior para llevar un registro de si ya se ha ejecutado:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Se ejecuta solo una vez por carga de la aplicación.
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

También puedes ejecutarlo durante la inicialización del módulo y antes de que la aplicación se renderice:

```js {1,5}
if (typeof window !== 'undefined') { // Comprueba si estamos ejecutándolo en el navegador.
   // ✅ Solo se ejecuta una vez por carga de la aplicación
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

El código en el nivel superior se ejecuta una vez cuando se importa tu componente, incluso si no se llega a renderizar. Para evitar ralentización o comportamientos inesperados al importar componentes arbitrarios, no abuses de este patrón. Mantén la lógica de inicialización a nivel de la aplicación en módulos de componentes _root_, como `App.js`, o en el punto de entrada de tu aplicación.

### Notificar a los componentes padre sobre cambios de estado {/*notifying-parent-components-about-state-changes*/}

Digamos que estás escribiendo un componente `Toggle` con un estado interno `isOn` que puede ser `true` o `false`. Hay varias formas diferentes de cambiarlo (haciendo clic o arrastrando). Quieres notificar al componente padre cada vez que el estado interno de `Toggle` cambia, así que expones un evento `onChange` y lo llamas desde un Efecto:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Evitar: El manejador onChange se ejecuta demasiado tarde
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Como antes, esto no es ideal. El `Toggle` actualiza su estado primero, y React actualiza la pantalla. Luego React ejecuta el Efecto, que llama a la función `onChange` pasada desde un componente padre. Ahora el componente padre actualizará su propio estado, iniciando otro proceso de renderizado. Sería mejor hacer todo en un solo paso.

Elimina el Efecto y en su lugar actualiza el estado de *ambos* componentes dentro del mismo manejador de eventos:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Bien: Realiza todas las actualizaciones durante el evento que las causó
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Con este enfoque, tanto el componente `Toggle` como su componente padre actualizan su estado durante el evento. React [agrupa las actualizaciones](/learn/queueing-a-series-of-state-updates) de diferentes componentes, por lo que sólo habrá un paso de renderizado.

También podrías eliminar el estado por completo, y en su lugar recibir `isOn` del componente padre:

```js {1,2}
// ✅ También está bien: el componente está completamente controlado por su padre
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["Elevar el estado"](/learn/sharing-state-between-components) te permite que el componente padre controle completamente el `Toggle` cambiando el estado propio del padre. Esto significa que el componente padre tendrá que contener más lógica, pero habrá menos estado en general de qué preocuparse. ¡Cada vez que intentes mantener dos variables de estado diferentes sincronizadas, intenta elevar el estado en su lugar!

### Pasar datos al componente padre {/*passing-data-to-the-parent*/}

Este componente `Child` carga algunos datos y luego los pasa al componente `Parent` en un Efecto:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Evitar: Pasar datos al padre en un Efecto
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

En React, los datos fluyen de los componentes padres a sus hijos. Cuando ves algo incorrecto en la pantalla, puedes rastrear de dónde viene la información subiendo la cadena de componentes hasta que encuentres qué componente pasa la prop incorrecta o tiene el estado incorrecto. Cuando los componentes hijos actualizan el estado de sus componentes padres en Efectos, el flujo de datos se vuelve muy difícil de rastrear. Como tanto el hijo como el padre necesitan los mismos datos, deja que el componente padre recupere esos datos, y *pásalos hacia abajo* al hijo en su lugar:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Buena práctica: Pasar los datos desde padres a hijos
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Esto es más sencillo y mantiene el flujo de datos predecible: los datos fluyen hacia abajo desde el padre al hijo.

### Suscribirse a una fuente de datos externa {/*subscribing-to-an-external-store*/}

A veces, tus componentes pueden necesitar suscribirse a algunos datos fuera del estado de React. Estos datos podrían provenir de una biblioteca de terceros o de una API incorporada en el navegador. Como estos datos pueden cambiar sin que React lo sepa, necesitas suscribir manualmente tus componentes a ellos. Esto se hace a menudo con un Efecto, por ejemplo:

```js {2-17}
function useOnlineStatus() {
  // No ideal: Suscripción manual en un Efecto
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Aquí, el componente se suscribe a una fuente de datos externa (en este caso, la API `navigator.onLine` del navegador). Dado que esta API no existe en el servidor (por lo que no puede usarse para el HTML inicial), inicialmente el estado se establece en `true`. Siempre que el valor de esa fuente de datos cambia en el navegador, el componente actualiza su estado.

Aunque es común usar Efectos para esto, React tiene un Hook diseñado específicamente para suscribirse a una fuente externa que se prefiere en su lugar. Elimina el Efecto y reemplázalo con una llamada al Hook de React [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Buena práctica: Suscribirse a una fuente externa con un Hook integrado
  return useSyncExternalStore(
    subscribe, // React no volverá a suscribirse mientras pases la misma función
    () => navigator.onLine, // Acá va el cómo obtener el valor en el cliente
    () => true // Acá va el cómo obtener el valor en el servidor
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Este enfoque es menos propenso a errores que sincronizar manualmente datos mutables al estado de React con un Efecto. Generalmente, escribirás un Hook personalizado como `useOnlineStatus()` anteriormente para que no debas repetir este código en los componentes individuales. [Lee más sobre cómo suscribirte a fuentes externas desde componentes de React.](/reference/react/useSyncExternalStore)

### Cargar datos {/*fetching-data*/}

Muchas aplicaciones usan Efectos para iniciar la carga de datos. Es bastante común escribir un Efecto de carga de datos como este:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Evita: Obtener datos sin lógica de limpieza
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

No necesitas mover esta carga de datos a un manejador de eventos.

Esto puede parecer una contradicción con los ejemplos anteriores donde necesitabas poner la lógica en los manejadores de eventos. Sin embargo, considera que no es *el evento de escritura* el que es la razón principal para cargar datos. Las entradas de búsqueda a menudo se pre-rellenan desde la URL, y el usuario puede navegar hacia atrás y hacia adelante sin tocar la entrada de texto.

No importa de dónde vengan `page` y `query`. Mientras este componente sea visible, querrás mantener los `results` [sincronizados](/learn/synchronizing-with-effects) con los datos de la red para la `page` y `query` actuales. Por eso es un Efecto.

Sin embargo, el código anterior tiene un error. Imagina que escribes "hola" rápidamente. Entonces la `query` cambiará de "h", a "ho", "hol", y "hola". Esto iniciará búsquedas separadas, pero no hay garantía sobre el orden en que llegarán las respuestas. Por ejemplo, la respuesta "hol" puede llegar *después* de la respuesta "hola". Como "hol" llamará a `setResults()` al final, estarás mostrando los resultados de búsqueda incorrectos. Esto se llama una ["condición de carrera"](https://es.wikipedia.org/wiki/Condición_de_carrera): dos solicitudes diferentes "compitieron" entre sí y llegaron en un orden diferente al que esperabas.

**Para solucionar la condición de carrera, necesitas [agregar una función de limpieza](/learn/synchronizing-with-effects#fetching-data) para ignorar respuestas obsoletas:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Esto asegura que cuando tu Efecto carga datos, todas las respuestas excepto la última solicitada serán ignoradas.

Manejar las condiciones de carrera no es la única dificultad al implementar la carga de datos. También podrías querer pensar en almacenar en caché las respuestas (para que el usuario pueda hacer clic en "Atrás" y ver la pantalla anterior instantáneamente), en cómo obtener datos en el servidor (para que el HTML inicial renderizado por el servidor contenga el contenido obtenido en lugar de un spinner), y en cómo evitar cascadas de red (para que un hijo pueda cargar datos sin esperar a cada padre).

**Estos problemas se aplican a cualquier biblioteca de interfaz de usuario, no solo a React. Resolverlos no es trivial, por lo que los [frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) modernos proporcionan mecanismos de carga de datos integrados más eficientes que la carga de datos con Efectos.**

Si no usas un framework (y no quieres construir el tuyo propio) pero te gustaría hacer que la carga de datos desde Efectos sea más ergonómica, considera extraer tu lógica de obtención a un Hook personalizado como en el siguiente ejemplo:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Probablemente también querrás agregar alguna lógica para el manejo de errores y para seguir si el contenido está cargando. Puedes construir un Hook como este tú mismo o utilizar una de las muchas soluciones ya disponibles en el ecosistema de React. **Aunque esto por sí solo no será tan eficiente como usar el mecanismo de carga de datos integrado de un marco, trasladar la lógica de carga de datos a un Hook personalizado facilitará la adopción de una estrategia de carga de datos eficiente más tarde.**

En general, cada vez que debas recurrir a escribir Efectos, busca cuándo puedes extraer una pieza de funcionalidad a un Hook personalizado con una API más declarativa y diseñada específicamente como el `useData` anterior. Cuantas menos llamadas innecesarias a `useEffect` tengas en tus componentes, más fácil será el mantenimiento de tu aplicación.

<Recap>

- Si puedes calcular algo durante el renderizado, no necesitas un Efecto.
- Para almacenar en caché cálculos costosos, utiliza `useMemo` en lugar de `useEffect`.
- Para restablecer el estado de un árbol de componentes completo, pásale una `key` diferente.
- Para restablecer una porción de estado en respuesta a un cambio de prop, configúralo durante el renderizado.
- El código que se ejecuta porque un componente se *mostró* al usuario debería estar en Efectos, el resto debería estar en eventos.
- Si necesitas actualizar el estado de varios componentes, es mejor hacerlo durante un solo evento.
- Siempre que intentes sincronizar variables de estado en diferentes componentes, considera elevar el estado.
- Puedes obtener datos con Efectos, pero necesitas implementar limpieza para evitar condiciones de carrera.

</Recap>

<Challenges>

#### Transform data without Effects {/*transform-data-without-effects*/}

The `TodoList` below displays a list of todos. When the "Show only active todos" checkbox is ticked, completed todos are not displayed in the list. Regardless of which todos are visible, the footer displays the count of todos that are not yet completed.

Simplify this component by removing all the unnecessary state and Effects.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

If you can calculate something during rendering, you don't need state or an Effect that updates it.

</Hint>

<Solution>

There are only two essential pieces of state in this example: the list of `todos` and the `showActive` state variable which represents whether the checkbox is ticked. All of the other state variables are [redundant](/learn/choosing-the-state-structure#avoid-redundant-state) and can be calculated during rendering instead. This includes the `footer` which you can move directly into the surrounding JSX.

Your result should end up looking like this:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Cache a calculation without Effects {/*cache-a-calculation-without-effects*/}

In this example, filtering the todos was extracted into a separate function called `getVisibleTodos()`. This function contains a `console.log()` call inside of it which helps you notice when it's being called. Toggle "Show only active todos" and notice that it causes `getVisibleTodos()` to re-run. This is expected because visible todos change when you toggle which ones to display.

Your task is to remove the Effect that recomputes the `visibleTodos` list in the `TodoList` component. However, you need to make sure that `getVisibleTodos()` does *not* re-run (and so does not print any logs) when you type into the input.

<Hint>

One solution is to add a `useMemo` call to cache the visible todos. There is also another, less obvious solution.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Remove the state variable and the Effect, and instead add a `useMemo` call to cache the result of calling `getVisibleTodos()`:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

With this change, `getVisibleTodos()` will be called only if `todos` or `showActive` change. Typing into the input only changes the `text` state variable, so it does not trigger a call to `getVisibleTodos()`.

There is also another solution which does not need `useMemo`. Since the `text` state variable can't possibly affect the list of todos, you can extract the `NewTodo` form into a separate component, and move the `text` state variable inside of it:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

This approach satisfies the requirements too. When you type into the input, only the `text` state variable updates. Since the `text` state variable is in the child `NewTodo` component, the parent `TodoList` component won't get re-rendered. This is why `getVisibleTodos()` doesn't get called when you type. (It would still be called if the `TodoList` re-renders for another reason.)

</Solution>

#### Reset state without Effects {/*reset-state-without-effects*/}

This `EditContact` component receives a contact object shaped like `{ id, name, email }` as the `savedContact` prop. Try editing the name and email input fields. When you press Save, the contact's button above the form updates to the edited name. When you press Reset, any pending changes in the form are discarded. Play around with this UI to get a feel for it.

When you select a contact with the buttons at the top, the form resets to reflect that contact's details. This is done with an Effect inside `EditContact.js`. Remove this Effect. Find another way to reset the form when `savedContact.id` changes.

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

It would be nice if there was a way to tell React that when `savedContact.id` is different, the `EditContact` form is conceptually a _different contact's form_ and should not preserve state. Do you recall any such way?

</Hint>

<Solution>

Split the `EditContact` component in two. Move all the form state into the inner `EditForm` component. Export the outer `EditContact` component, and make it pass `savedContact.id` as the `key` to the inner `EditForm` component. As a result, the inner `EditForm` component resets all of the form state and recreates the DOM whenever you select a different contact.

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Submit a form without Effects {/*submit-a-form-without-effects*/}

This `Form` component lets you send a message to a friend. When you submit the form, the `showForm` state variable is set to `false`. This triggers an Effect calling `sendMessage(message)`, which sends the message (you can see it in the console). After the message is sent, you see a "Thank you" dialog with an "Open chat" button that lets you get back to the form.

Your app's users are sending way too many messages. To make chatting a little bit more difficult, you've decided to show the "Thank you" dialog *first* rather than the form. Change the `showForm` state variable to initialize to `false` instead of `true`. As soon as you make that change, the console will show that an empty message was sent. Something in this logic is wrong!

What's the root cause of this problem? And how can you fix it?

<Hint>

Should the message be sent _because_ the user saw the "Thank you" dialog? Or is it the other way around?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

The `showForm` state variable determines whether to show the form or the "Thank you" dialog. However, you aren't sending the message because the "Thank you" dialog was _displayed_. You want to send the message because the user has _submitted the form._ Delete the misleading Effect and move the `sendMessage` call inside the `handleSubmit` event handler:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Notice how in this version, only _submitting the form_ (which is an event) causes the message to be sent. It works equally well regardless of whether `showForm` is initially set to `true` or `false`. (Set it to `false` and notice no extra console messages.)

</Solution>

</Challenges>
