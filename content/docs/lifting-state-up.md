---
id: lifting-state-up
title: Levantando el estado
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Usualmente, muchos componentes necesitan reflejar el mismo cambio en los datos. Recomendamos elevar el estado compartido al ancestro común más cercano. Veamos cómo funciona.

En esta sección, crearemos una calculadora de temperatura que calculará si el agua hervirá a una determinada temperatura.

Comenzaremos con un componente llamado `BoilingVerdict`. Este acepta la temperatura en `celsius` como una propiedad e imprime si es suficiente para que el agua hierva:

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

Luego, crearemos un componente llamado `Calculator`. Este renderiza un `<input>` que permite insertar la temperatura y guarda su valor en `this.state.temperature`.

Además, renderiza el `BoilingVerdict` para el valor insertado.

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Añadiendo una segunda entrada {#adding-a-second-input}

Nuestro nuevo requisito es que, además de la temperatura en Celsius, proveemos la temperatura en Fahrenheit, y estas se mantienen sincronizadas.

Podemos comenzar por extraer el componente `TemperatureInput` de `Calculator`. Añadiremos una nueva propiedad `scale` al mismo que podrá ser `"c"` o `"f"`:

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Ahora podemos cambiar `Calculator` para que renderice dos entradas separadas para la temperatura:

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Ahora tenemos dos entradas, pero cuando insertamos la temperatura en una de ellas, la otra no se actualiza. Esto contradice nuestro requisito: queremos que se mantengan sincronizadas.

Tampoco podemos mostrar el componente `BoilingVerdict` de `Calculator`. `Calculator` no conoce la temperatura actual porque está escondida dentro de `TemperatureInput`.

## Escribiendo funciones de conversión {#writing-conversion-functions}

Primeramente, escribiremos dos funciones para convertir de Celsius a Fahrenheit y viceversa:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Estas dos funciones convierten números. Escribiremos otra función que tomará la cadena `temperature` y una función de conversión como parámetros y retornará una cadena. La usaremos para calcular el valor de una entrada basado en la otra entrada.

Retorna una cadena vacía si `temperature` es inválida y mantiene la salida redondeada al tercer lugar decimal:

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

Por ejemplo, `tryConvert('abc', toCelsius)` retorna una cadena vacía, y `tryConvert('10.22', toFahrenheit)` retorna `'50.396'`.

## Levantando el estado {#lifting-state-up}

Actualmente, ambos componentes `TemperatureInput` mantienen de manera independiente sus valores en el estado local:

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

Sin embargo, queremos que estas dos entradas estén sincronizadas. Cuando actualicemos la entrada de Celsius, la entrada de Fahrenheit debe reflejar la conversión de temperatura, y viceversa.

En React, la compartición del estado puede lograrse moviendo el estado hacia arriba al ancestro común más cercano de los componentes que lo necesitan. A esto se le llama "levantar el estado". Eliminaremos el estado local de `TemperatureInput` y lo moveremos hacia `Calculator`.

Si `Calculator` posee el estado compartido, entonces se convierte en la "fuente de verdad" para la temperatura actual en ambas entradas. Este puede instruir a ambos a tener valores consistentes entre sí. Puesto que las propiedades de ambos componentes `TemperatureInput` vienen del mismo componente `Calculator`, las dos entradas siempre estarán sincronizadas.

Veamos cómo trabaja esto paso a paso.

Primeramente, reemplazaremos `this.state.temperature` con `this.props.temperature` en el componente `TemperatureInput`. Por ahora, pretendamos que `this.props.temperature` ya existe, aunque necesitaremos pasarlo de el componente `Calculator` en el futuro:

```js{3}
  render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

Sabemos que [las propiedades son de solo lectura](/docs/components-and-props.html#props-are-read-only). Cuando `temperature` estaba en el estado local, `TemperatureInput` solo llama a `this.setState()` para modificarlo. Sin embargo, ahora que `temperature` viene del padre como una propiedad, `TemperatureInput` no tiene ningún control sobre la misma.

En React, esto se resuelve usualmente haciendo un componente "controlado". Así como el `<input>` del DOM acepta una propiedad `value` y otra `onChange`, también `TemperatureInput` puede aceptar  las propiedades `temperature` y `onTemperatureChange` de su padre `Calculator`.

Ahora, cuando `TemperatureInput` quiera actualizar su temperatura, este llama a `this.props.onTemperatureChange`:

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Nota:
>
>No existe un significado especial para los nombres de las propiedades `temperature` o `onTemperatureChange` en los componentes. Pudimos haberles dado otro nombre, como `value` y `onChange` lo cual es una convención común.

La propiedad `onTemperatureChange` será proporcionada de manera conjunta con `temperature` por el componente padre `Calculator`. Este manejará el cambio modificando su estado local, volviendo a renderizar ambas entradas con los nuevos valores. Analizaremos los cambios en la implementación de `Calculator` en un momento.

Antes de ahondar en los cambios de `Calculator`, recapitulemos nuestros cambios al componente `TemperatureInput`. Hemos eliminado el estado local de este, y en vez de leer `this.state.temperature`, ahora leemos `this.props.temperature`. En vez de llamar a `this.setState()` cuando queremos hacer un cambio, ahora llamamos a `this.props.onTemperatureChange()`, que será proporcionado por `Calculator`:

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Ahora miremos el componente `Calculator`.

Guardaremos `temperature` y `scale` en su estado local. Este es el estado que hemos "levantado" de las entradas, y servirá como la "fuente de verdad" para ambos. Es la representación mínima de todos los datos que debemos conocer para renderizar ambas entradas.

Por ejemplo, si insertamos 37 en la entrada de Celsius, el estado del componente `Calculator` será:

```js
{
  temperature: '37',
  scale: 'c'
}
```

Si luego editamos el valor de Fahrenheit para que sea 212, el estado de `Calculator` será:

```js
{
  temperature: '212',
  scale: 'f'
}
```

Pudimos haber guardado el valor de ambas entradas pero resulta que no es necesario. Es suficiente con guardar el valor de la entrada recientemente cambiada, y la escala que esta representa. Entonces podemos inferir el valor de la otra entrada basados solamente en el valor actual de `temperature` y `scale`.

Las entradas se mantienen sincronizadas porque los valores son calculados a partir del mismo estado:

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Ahora, no importa qué entrada edites, `this.state.temperature` y `this.state.scale` en el componente `Calculator` se actualizan. Una de las entradas toma el valor tal cual, entonces cualquier dato del usuario se conserva, y el valor de la otra entrada es recalculado basado en este cambio.

Recapitulemos qué pasa cuando editamos una entrada:

* React llama a la función especificada como `onChange` en el `<input>` del DOM. En nuestro caso es el método `handleChange` en el componente `TemperatureInput`.
* El método `handleChange` en el componente `TemperatureInput` llama a `this.props.onTemperatureChange()` con el nuevo valor. Sus propiedades, incluyendo `onTemperatureChange`, fueron provistas para el componente padre `Calculator`.
* Cuando renderizó previamente, `Calculator` especificó que `onTemperatureChange` del componente `TemperatureInput` con la escala Celsius es el método `handleCelsiusChange` y `onTemperatureChange` del componente `TemperatureUnit` con escala Fahrenheit es el método `handleFahrenheitChange`. Entonces, cada uno de estos métodos es llamado dependiendo del componente que se edite.
* Dentro de estos métodos, el componente `Calculator` pregunta a React para volver a renderizar a sí mismo llamando al método `this.setState()` con el nuevo valor y la escala actual de la entrada que acabamos de editar.
* React llama al método `render` del componente `Calculator` para saber cómo debe lucir la interfaz de usuario. Los valores de ambas entradas son recalculados en base a la temperatura actual y la escala activa. La conversión de temperatura es hecha aquí.
* React llama a los métodos `render` de los componentes `TemperatureInput` de manera individual con sus nuevas propiedades especificadas por `Calculator`. Aprende como sus interfaces de usuario deberían verse.
* React llama al método `render` del componente `BoilingVerdict`, pasando la temperatura en Celsius como una propiedad.
* React DOM actualiza el DOM con el componente `BoilingVerdict` y sincroniza los valores deseados para las entradas. La entrada que acabamos de actualizar recibe su valor actual, y la otra entrada es actualizada a su temperatura luego de hacer la conversión.

Toda actualización sigue los mismos pasos y las entradas se mantienen sincronizadas.

## Lecciones aprendidas {#lessons-learned}

Debe haber una sola "fuente de verdad" para cada dato que cambie en una aplicación de React. Usualmente, el estado se agrega primeramente al componente que lo necesita para su renderización. Luego, si otro componente también lo necesita, puedes levantar el estado hacia el ancestro común más cercano. En vez de tratar de sincronizar el estado entre distintos componentes, deberías confiar en el [flujo de datos descendente](/docs/state-and-lifecycle.html#the-data-flows-down).

Levantar el estado implica escribir más código *"boilerplate"* que los enfoques *"two-way binding"*, pero como beneficio, toma menos tiempo encontrar un error. Como todo estado "vive" en algún componente y sólo ese componente puede cambiar, el margen de error se ve reducido grandemente. De manera adicional, puedes implementar lógica adicional para transformar o rechazar algún cambio en la entrada del usuario.

Si algo puede ser derivado de las propiedades o el estado, probablemente no debería estar en el estado. Por ejemplo, en vez de almacenar `celsiusValue` y `fahrenheitValue`, solamente almacenamos la última edición a `temperature` y `scale`. El valor de la otra entrada siempre puede ser calculado desde el método `render()`. Esto nos permite limpiar o aplicar un redondeo a la otra entrada sin perder la precisión en la entrada del usuario.

Cuando veas que algo está mal en la interfaz de usuario, puedes usar [React Developer Tools](https://github.com/facebook/react/tree/master/packages/react-devtools) para inspeccionar las propiedades y moverte hacia arriba en el árbol hasta encontrar el componente responsable de actualizar el estado. Esto te permite seguir un error hasta su fuente:

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">
