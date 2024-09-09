---
title: Renderizado condicional
---

<Intro>

Tus componentes a menudo necesitarán mostrar diferentes cosas dependiendo de diferentes condiciones. En React, puedes renderizar JSX de forma condicional utilizando la sintaxis de JavaScript como las declaraciones `if`, `&&` y los operadores `? :`.

</Intro>

<YouWillLearn>

* Cómo devolver distinto JSX dependiendo de una condición
* Cómo incluir o excluir condicionalmente un fragmento de JSX
* Atajos de sintaxis condicional comunes que encontrarás en las bases de código de React

</YouWillLearn>

## Devolución condicional de JSX {/*conditionally-returning-jsx*/}

Supongamos que tienes un componente `PackingList` que muestra varios `Items`, que pueden ser marcados como empaquetados o no:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<<<<<<< HEAD
Observa que algunos de los componentes `Item` tienen su prop `isPacked` asignada a `true` en lugar de `false`. Se desea añadir una marca de verificación (✔) a los elementos empaquetados si `isPacked={true}`.
=======
Notice that some of the `Item` components have their `isPacked` prop set to `true` instead of `false`. You want to add a checkmark (✅) to packed items if `isPacked={true}`.
>>>>>>> 9aa2e3668da290f92f8997a25f28bd3f58b2a26d

Puedes escribir esto como una declaración [`if`/`else`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/if...else) así:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Si la prop `isPacked` es `true`, este código **devuelve un árbol JSX diferente**. Con este cambio, algunos de los elementos obtienen una marca de verificación al final:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Prueba a editar lo que se devuelve en cualquiera de los dos casos y observa cómo cambia el resultado.

Observa cómo estás creando una lógica de ramificación con las sentencias `if` y `return` de JavaScript. En React, el flujo de control (como las condiciones) es manejado por JavaScript.

### Devolución de nada con `null` {/*conditionally-returning-nothing-with-null*/}

En algunas situaciones, no querrás mostrar nada en absoluto. Por ejemplo, digamos que no quieres mostrar elementos empaquetados en absoluto. Un componente debe devolver algo. En este caso, puedes devolver `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Si `isPacked` es verdadero, el componente no devolverá nada, `null`. En caso contrario, devolverá JSX para ser renderizado.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

En la práctica, devolver `null` en un componente no es común porque podría sorprender a un desarrollador que intente renderizarlo. Lo más frecuente es incluir o excluir condicionalmente el componente en el JSX del componente padre. Aquí se explica cómo hacerlo.

## Exclusión condicional de JSX {/*conditionally-including-jsx*/}

En el ejemplo anterior, controlabas qué árbol JSX (si es que había alguno) era devuelto por el componente. Es posible que ya hayas notado alguna duplicación en la salida de la renderización:

```js
<li className="item">{name} ✅</li>
```

es muy similar a

```js
<li className="item">{name}</li>
```

Ambas ramas condicionales devuelven `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Aunque esta duplicación no es perjudicial, podría hacer que tu código sea más difícil de mantener. ¿Qué pasa si quieres cambiar el `className`? ¡Tendrías que hacerlo en dos lugares en tu código! En tal situación, podrías incluir condicionalmente un poco de JSX para hacer tu código más [DRY](https://es.wikipedia.org/wiki/No_te_repitas).

### Operador condicional (ternario) (`? :`) {/*conditional-ternary-operator--*/}

JavaScript tiene una sintaxis compacta para escribir una expresión condicional -- el [operador condicional](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) u "operador ternario".

En lugar de esto:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Puedes escribir esto:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

<<<<<<< HEAD
Puedes leerlo como *"si `isPacked` es verdadero, entonces (`?`) renderiza `name + ' ✔'`, de lo contrario (`:`) renderiza `name`"*)
=======
You can read it as *"if `isPacked` is true, then (`?`) render `name + ' ✅'`, otherwise (`:`) render `name`"*.
>>>>>>> 9aa2e3668da290f92f8997a25f28bd3f58b2a26d

<DeepDive>

#### ¿Son estos dos ejemplos totalmente equivalentes? {/*are-these-two-examples-fully-equivalent*/}

Si vienes de un entorno de programación orientada a objetos, podrías asumir que los dos ejemplos anteriores son sutilmente diferentes porque uno de ellos puede crear dos "instancias" diferentes de `<li>`. Pero los elementos JSX no son "instancias" porque no contienen ningún estado interno y no son nodos reales del DOM. Son descripciones ligeras, como los planos. Así que estos dos ejemplos, de hecho, *son* completamente equivalentes. En [Preservar y reiniciar el estado](/learn/preserving-and-resetting-state) se explica en detalle cómo funciona esto.

</DeepDive>

Ahora digamos que quieres envolver el texto del elemento completado en otra etiqueta HTML, como `<del>` para tacharlo. Puedes añadir aún más líneas nuevas y paréntesis para que sea más fácil anidar más JSX en cada uno de los casos:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Este estilo funciona bien para condiciones simples, pero utilízalo con moderación. Si tus componentes se desordenan con demasiado marcado condicional anidado, considera la posibilidad de extraer componentes hijos para limpiar las cosas. En React, el marcado es una parte de tu código, por lo que puedes utilizar herramientas como variables y funciones para ordenar las expresiones complejas.

### Operador lógico AND (`&&`) {/*logical-and-operator-*/}

Otro atajo común que encontrarás es el [operador lógico AND (`&&`) de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%20)%20operator,it%20returns%20a%20Boolean%20value.). Dentro de los componentes de React, a menudo surge cuando quieres renderizar algún JSX cuando la condición es verdadera, **o no renderizar nada en caso contrario.** Con `&&`, podrías renderizar condicionalmente la marca de verificación sólo si `isPacked` es `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

Puedes leer esto como *"si `isPacked`, entonces (`&&`) renderiza la marca de verificación, si no, no renderiza nada."*

Aquí está en acción:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Una [expresión JavaScript &&](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) devuelve el valor de su lado derecho (en nuestro caso, la marca de verificación) si el lado izquierdo (nuestra condición) es `true`. Pero si la condición es `false`, toda la expresión se convierte en `false`. React considera `false` como un "agujero" en el árbol JSX, al igual que `null` o `undefined`, y no renderiza nada en su lugar.


<Pitfall>

**No pongas números a la izquierda de `&&`.**

Para comprobar la condición, JavaScript convierte el lado izquierdo en un booleano automáticamente. Sin embargo, si el lado izquierdo es `0`, entonces toda la expresión obtiene ese valor (`0`), y React representará felizmente `0` en lugar de nada.

Por ejemplo, un error común es escribir código como `messageCount && <p>New messages</p>`. Es fácil suponer que no renderiza nada cuando `messageCount` es `0`, pero en realidad renderiza el propio `0`.

Para arreglarlo, haz que el lado izquierdo sea un booleano: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### Asignación condicional de JSX a una variable {/*conditionally-assigning-jsx-to-a-variable*/}

Cuando los atajos se interpongan en el camino de la escritura de código simple, prueba a utilizar una sentencia `if` y una variable. Puedes reasignar las variables definidas con [`let`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/let), así que empieza proporcionando el contenido por defecto que quieres mostrar, el nombre:

```js
let itemContent = name;
```

Utiliza una sentencia `if` para reasignar una expresión JSX a `itemContent` si `isPacked` es `true`:

```js
if (isPacked) {
  itemContent = name + " ✅";
}
```

[Las llaves abren la "ventana a JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Inserta la variable con llaves en el árbol JSX devuelto, anidando la expresión previamente calculada dentro de JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Este estilo es el más verboso, pero también el más flexible. Aquí está en acción:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Como antes, esto funciona no sólo para el texto, sino también para JSX arbitrario:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Si no estás familiarizado con JavaScript, esta variedad de estilos puede parecer abrumadora al principio. Sin embargo, aprenderlos te ayudará a leer y escribir cualquier código JavaScript -- ¡y no sólo los componentes de React! Escoge el que prefieras para empezar, y luego vuelve a consultar esta referencia si olvidas cómo funcionan los demás.

<Recap>

* En React, se controla la lógica de ramificación con JavaScript.
* Puedes devolver una expresión JSX condicionalmente con una sentencia `if`.
* Puedes guardar condicionalmente algún JSX en una variable y luego incluirlo dentro de otro JSX usando las llaves.
* En JSX, `{cond ? <A /> : <B />}` significa *"si `cond`, renderiza `<A />`, si no `<B />`"*.
* En JSX, `{cond && <A />}` significa *"si `cond`, renderiza `<A />`, si no, nada"*.
* Los atajos son comunes, pero no tienes que usarlos si prefieres el simple `if`.

</Recap>



<Challenges>

#### Mostrar un icono para los elementos incompletos con `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Utiliza el operador condicional (`cond ? a : b`) para renderizar un ❌ si `isPacked` no es `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje de vuelo" 
        />
        <Item 
          isPacked={true} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          isPacked={false} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Mostrar la importancia del elemento con `&&` {/*show-the-item-importance-with-*/}

En este ejemplo, cada "elemento" recibe una "importancia" numérica. Utiliza el operador `&&` para mostrar "_(Importancia: X)_" en cursiva, pero sólo para los elementos que tienen una importancia distinta de cero. Tu lista de elementos debería tener este aspecto:

* Traje de vuelo _(Importancia: 9)_
* Casco con dorado a la hoja
* Fotografía de Tam _(Importancia: 6)_

¡No olvides añadir un espacio entre las dos etiquetas!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          importance={9} 
          name="Traje de vuelo" 
        />
        <Item 
          importance={0} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          importance={6} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Esto debería servir:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importancia: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Lista de equipaje de Sally Ride</h1>
      <ul>
        <Item 
          importance={9} 
          name="Traje de vuelo" 
        />
        <Item 
          importance={0} 
          name="Casco con dorado a la hoja" 
        />
        <Item 
          importance={6} 
          name="Fotografía de Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Ten en cuenta que debes escribir `importance > 0 && ...` en lugar de `importance && ...` para que si `importance` es `0`, ¡no se muestre `0` como resultado!

En esta solución, se utilizan dos condiciones distintas para insertar un espacio entre el nombre y la etiqueta de importancia. Como alternativa, puedes utilizar un Fragmento con un espacio inicial: `importance > 0 && <> <i>...</i></>` o añadir un espacio inmediatamente dentro del `<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

#### Refactorizar una serie de `? :` a `if` y variables {/*refactor-a-series-of---to-if-and-variables*/}

Este componente `Drink` utiliza una serie de condiciones `? :` para mostrar diferente información dependiendo de si la prop `name` es `té` o `café`. El problema es que la información sobre cada bebida está repartida entre varias condiciones. Refactoriza este código para utilizar una única sentencia `if` en lugar de tres condiciones `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Parte de la planta</dt>
        <dd>{name === 'té' ? 'hoja' : 'grano'}</dd>
        <dt>Contenido de cafeína</dt>
        <dd>{name === 'té' ? '15–70 mg/taza' : '80–185 mg/taza'}</dd>
        <dt>Antigüedad</dt>
        <dd>{name === 'té' ? '4,000+ años' : '1,000+ años'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="té" />
      <Drink name="café" />
    </div>
  );
}
```

</Sandpack>

Una vez refactorizado el código para utilizar `if`, ¿tienes más ideas sobre cómo simplificarlo?

<Solution>

Hay muchas maneras de hacerlo, pero este es un punto de partida:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'té') {
    part = 'hoja';
    caffeine = '15–70 mg/taza';
    age = '4,000+ años';
  } else if (name === 'café') {
    part = 'grano';
    caffeine = '80–185 mg/taza';
    age = '1,000+ años';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Parte de la planta</dt>
        <dd>{part}</dd>
        <dt>Contenido de cafeína</dt>
        <dd>{caffeine}</dd>
        <dt>Antigüedad</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="té" />
      <Drink name="café" />
    </div>
  );
}
```

</Sandpack>

Aquí la información sobre cada bebida se agrupa en lugar de estar repartida en múltiples condiciones. Esto facilita la adición de más bebidas en el futuro.

Otra solución sería eliminar la condición por completo moviendo la información a los objetos:

<Sandpack>

```js
const drinks = {
  té: {
    part: 'hoja',
    caffeine: '15–70 mg/taza',
    age: '4,000+ años'
  },
  café: {
    part: 'grano',
    caffeine: '80–185 mg/taza',
    age: '1,000+ años'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Parte de la planta</dt>
        <dd>{info.part}</dd>
        <dt>Contenido de cafeína</dt>
        <dd>{info.caffeine}</dd>
        <dt>Antigüedad</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="té" />
      <Drink name="café" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
