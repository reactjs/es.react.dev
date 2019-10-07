---
id: faq-funciones
title: Pasando funciones a componentes
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### ¿Cómo puedo pasar un controlador de eventos (como onClick) a un componente? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

Pasa controladores de eventos y otras funciones como props a componentes hijos:

```jsx
<button onClick={this.handleClick}>
```

Si necesitas tener acceso al componente padre dentro del evento, también debes enlazar la funciones a la instancia del componente (ver abajo).

### ¿Cómo enlazo una función a la instancia de un componente? {#how-do-i-bind-a-function-to-a-component-instance}

Hay varias maneras de asegurarte que las funciones tengan acceso a los atributos del componente como `this.props` y `this.state`, dependiendo de qué tipo de sintaxis o 

#### Enlazar dentro del constructor (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Se hizo click');
  }
  render() {
    return <button onClick={this.handleClick}>Clickéame</button>;
  }
}
```

#### Propiedades de las clases (propuesta de etapa 3) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Nota: esta sintaxis es experimental y todavía no está estandarizada.
  handleClick = () => {
    console.log('Se hizo click');
  }
  render() {
    return <button onClick={this.handleClick}>Clickéame</button>;
  }
}
```

#### Enlazar en la renderización {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Se hizo click');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Clickéame</button>;
  }
}
```

>**Nota:**
>
> Al usar `Function.prototype.bind` dentro de la renderización se crea una nueva función cada vez que el componente se renderiza, lo cual podría implicar problemas de rendimiento (ver abajo).

#### Funciones flecha en renderización {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Se hizo click');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Clickéame</button>;
  }
}
```

>**Nota:**
>
>Usar una función flecha en el renderizado crea una nueva función cada vez que se renderiza el componente, lo cual podría arruinar optimizaciones basadas en comparación estricta de identidad.

### ¿Está bien utilizar funciones flecha en los métodos de renderizado? {#is-it-ok-to-use-arrow-functions-in-render-methods}

Generalmente hablando, si está bien y normalmente es la forma más fácil de pasar parámetros a funciones.

Si tienes problemas de rendimiento, ¡no dudes en optimizar!

### ¿Por qué tiene que ser necesario enlazar? {#why-is-binding-necessary-at-all}

En JavaScript, estos dos fragmentos de código **no** son equivalentes.

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Los métodos de enlace nos aseguran que el segundo fragmento funcione de la misma manera que el primero.

Con React, normalmente solo necesitamos enlazar los métodos que *pasamos* a otros componentes. Por ejemplo: `<button onClick={this.handleClick}>` pasa `this.handleClick` por ende, se debería enlazar. Sin embargo, es innecesario enlazar el método `render` o los métodos de ciclo de vida: no los pasamos a otros componentes.
 
[Este artículo creado por Yehuda Katz](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) explica a detalle qué es enlazar, y cómo funcionan las funciones en JavaScript.

### ¿Por qué mi función está siendo llamada cada vez que mi componente renderiza? {#why-is-my-function-being-called-every-time-the-component-renders}

Asegúrate que no estés _llamando la función_ cuando la pases al componente:

```jsx
render() {
  // Incorrecto: ¡Se llama a handleClick en vez de ser pasado como una referencia!
  return <button onClick={this.handleClick()}>Clickéame!</button>
}
```

En lugar de eso, *pasa la función como tal* (sin los paréntesis)

```jsx
render() {
  // Correcto: handleClick se pasa como una referencia!
  return <button onClick={this.handleClick}>Clickéame</button>
}
```

### ¿Cómo paso un parámetro a un controlador de eventos o callback? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Puedes utilizar funciones flecha para envolver un controlador de eventos y pasar parámetros:

```jsx
<button onClick={() => this.handleClick(id)} />
```

Esto es lo equivalente de llamar `.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Ejemplo: Pasar parámetros utilizando función flecha {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // código ASCII del carácter.

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Ejemplo: Pasando parámetros usando data-attributes {#example-passing-params-using-data-attributes}

Alternativamente, puedes utilizar APIs del DOM para guardar los datos que necesitan los controladores de eventos. Considera esta propuesta si necesitas optimizar una gran cantidad de elementos o tu árbol de renderizado depende de las verificaciones de igualdad de React.PureComponent.

```jsx
const A = 65 // código ASCII del carácter

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### ¿Cómo puede prevenir que una función sea llamada muy rápidamente o muchas veces seguidas? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

Si tienes un controlador de eventos como `onClick` o `onScroll` y quieres prevenir que un *callback* sea disparado antes de tiempo, puedes limitar la tasa en la cual este *callback* es ejecutado. Se puede lograr usando:

- **throttle**: regula los cambios siguiendo una frecuencia basada en el tiempo (ej. [`_.throttle`](https://lodash.com/docs#throttle))
- **debounce**: publica cambios después de un periodo de inactividad (ej. [`_.debounce`](https://lodash.com/docs#debounce))
- **throttle con `requestAnimationFrame`**: regula los cambios en base a [`requestAnimationFrame`](https://developer.mozilla.org/es/docs/Web/API/Window/requestAnimationFrame) (ej [`raf-schd`](https://github.com/alexreardon/raf-schd))

Mira [esta visualización](http://demo.nimius.net/debounce_throttle/) para ver la comparación entre las funciones `throttle` y `debounce`.

> Nota:
>
>`_.debounce`, `_.throttle` y `raf-schd` proporcionan el método `cancel` para cancelar *callbacks* retrasados. Puedes llamar este método dentro de `componentWillUnmount` _o_ corrobora que el componente sigue montado dentro de la función retrasada.

#### Throttle {#throttle}

*Throttle* previene que una función sea llamada más de una vez según el tiempo determinado. El ejemplo que se encuentra debajo regula un controlador de evento tipo click para prevenir que se llame más de una vez por segundo.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

*Debounce* asegura que una función no va a ser ejecutada hasta que cierta cantidad de tiempo haya pasado desde la última vez que fue llamada. Esto puede ser muy útil cuando tienes que realizar operaciones demandantes como respuesta de un evento que puede ejecutarse muy rápido (ejemplo eventos de scroll o teclado). El siguiente ejemplo hace *debounce* de una entrada de texto con un demora de 250ms.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    // React reune a los eventos, por ende leemos su valor antes del debounce
    // Alternativamente, podemos llamar `event.persist()` y pasa todo el evento.
    // Para mas información acerca de éste tema reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/es/docs/Web/API/Window/requestAnimationFrame) es una forma de poner una función en cola para ser ejecutada por el navegador en un tiempo óptimo para el rendimiento del renderizado. Una función en cola con `requestAnimationFrame` va a dispararse en el siguiente cuadro. El navegador se va a encargar de que hayan 60 cuadros por segundo (60fps). Sin embargo, si el navegador no puede, el mismo navegador naturalmente va a limitar la cantidad de cuadros por segundo. Por ejemplo, un dispositivo podría solo manejar 30 fps, por ende, solo tendrás 30 cuadros por segundo. Usando `requestAnimationFrame` para throttle es una técnica muy útil ya que previene que tú mismo generes más de 60 actualizaciones por segundo. Si estás generando 100 actualizaciones por segundo, puedes crear esfuerzo adicional para el navegador que el usuario de todas formas no va a poder apreciar.

>**Nota:**
>
>Usando esta técnica podemos capturar el último valor capturado en un cuadro. Puedes ver a un ejemplo de cómo funciona este tipo de optimización en [`MDN`](https://developer.mozilla.org/es/docs/Web/Events/scroll)

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Crea una nueva función para agendar actualizaciones
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // Cuando recibimos un evento tipo scroll, agenda una actualización.
    // Si recibimos muchas actualizaciones dentro de un cuadro, solo vamos a publicar el último valor
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Cancela cualquier actualización pendiente ya que estamos 'unmounting'.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Probando tu límite de cuadros {#testing-your-rate-limiting}

Cuando probamos límites de cuadros de forma correcta, es muy útil tener la habilidad de adelantar el tiempo. Si estás utilizando [`jest`](https://facebook.github.io/jest/) puedes usar [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html) para adelantar el tiempo. Si estás utilizando *throttle* con `requestAnimationFrame` podrías encontrar útil [`raf-stub`](https://github.com/alexreardon/raf-stub) para controlar la frecuencia de los cuadros de animación.
