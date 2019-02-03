---
id: conditional-rendering
title: Renderizado condicional
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
 - "tips/false-in-jsx.html"
---

En React, puedes crear distintos componentes que encapsulan el comportamiento que necesitas. Entonces, puedes renderizar solamente algunos de ellos, dependiendo del estado de tu aplicación.

El renderizado condicional en React funciona de la misma forma que lo hacen las condiciones en JavaScript. Usa operadores de JavaScript como [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) o el [operador condicional](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) para crear elementos representando el estado actual, y deja que React actualice la UI para emparejarlos.

Considera estos dos componentes::

```js
function SaludoParaUsuario(props) {
 return <h1>¡Bienvenido de vuelta!</h1>;
}

function SaludoParaInvitado(props) {
 return <h1>Por favor regístrese.</h1>;
}
```

Vamos a crear un componente `Saludo` que muestra cualquiera de estos componentes dependiendo si el usuario ha iniciado sesión:

```javascript{3-7,11,12}
function Saludo(props) {
 const estaConectado = props.estaConectado;
 if (estaConectado) {
   return <SaludoParaUsuario />;
 }
 return <SaludoParaInvitado />;
}

ReactDOM.render(
 // Intentar cambiando estaConectado={true}:
 <Saludo estaConectado={false} />,
 document.getElementById('raiz')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Este ejemplo renderiza un saludo diferente según el valor de la prop `estaConectado`.

### Variables de elementos

Puedes usar variables para almacenar elementos. Esto puede ayudarte para renderizar condicionalmente una parte del componente mientras el resto del resultado no cambia.

Considera estos dos componentes nuevos que representan botones de Cerrar sesión y Iniciar sesión:

```js
function BotonInicioSesion(props) {
 return (
   <button onClick={props.onClick}>
     Iniciar sesión
   </button>
 );
}

function BotonCierreSesion(props) {
 return (
   <button onClick={props.onClick}>
     Cerrar sesión
   </button>
 );
}
```

En el siguiente ejemplo, crearemos un [componente con estado](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) llamado `GestionInicioSesion`.

El componente va a renderizar `<BotonInicioSesion />` o `<BotonCierreSesion />` dependiendo de su estado actual. También va a renderizar un `<Saludo />` del ejemplo anterior:

```javascript{20-25,29,30}
class GestionInicioSesion extends React.Component {
 constructor(props) {
   super(props);
   this.manejarClickInicioSesion = this.manejarClickInicioSesion.bind(this);
   this.manejarClickCierreSesion = this.manejarClickCierreSesion.bind(this);
   this.state = {estaConectado: false};
 }

 manejarClickInicioSesion() {
   this.setState({estaConectado: true});
 }

 manejarClickCierreSesion() {
   this.setState({estaConectado: false});
 }

 render() {
   const estaConectado = this.state.estaConectado;
   let boton;

   if (estaConectado) {
     boton = <BotonCierreSesion onClick={this.manejarClickCierreSesion} />;
   } else {
     boton = <BotonInicioSesion onClick={this.manejarClickInicioSesion} />;
   }

   return (
     <div>
       <Saludo estaConectado={estaConectado} />
       {boton}
     </div>
   );
 }
}

ReactDOM.render(
 <GestionInicioSesion />,
 document.getElementById('raiz')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Si bien declarar una variable y usar una sentencia `if` es una buena forma de renderizar condicionalmente un componente, a veces podrías querer usar una sintaxis más corta. Hay algunas formas de hacer condiciones $INLINE en JSX, explicadas a continuación.

### If $INLINE con operador lógico &&

Puedes [embeber cualquier expresión en JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) envolviéndola en llaves. Esto incluye al operador lógico `&&` de JavaScript. Puede ser ùtil para incluir condicionalmente un elemento:

```js{6-10}
function Buzon(props) {
 const mensajesNoLeidos = props.mensajesNoLeidos;
 return (
   <div>
     <h1>¡Hola!</h1>
     {mensajesNoLeidos.length > 0 &&
       <h2>
         Tienes {mensajesNoLeidos.length} mensajes sin leer.
       </h2>
     }
   </div>
 );
}

const mensajes = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
 <Buzon mensajesNoLeidos={mensajes} />,
 document.getElementById('raiz')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Funciona porque en JavaScript, `true && expresión` siempre evalúa a `expresión`, y `false && expresión` siempre evalúa a `false`.

Por eso, si la condición es `true`, el elemento just después de `&&` aparecerá en el resultado. Si es `false`, React lo ignorará.

### $INLINE If-Else con operador condicional

Otro método para el renderizado condicional $INLINE de elementos es usar el operador condicional [`condición ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) de JavaScript.

En el siguiente ejemplo, lo usaremos para renderizar de forma condicional un bloque de texto pequeño.

```javascript{5}
render() {
 const estaConectado = this.state.estaConectado;
 return (
   <div>
     El usuario <b>{estaConectado ? 'está' : 'no está'}</b> conectado.
   </div>
 );
}
```

También puede usarse para expresiones más grandes, aunque es menos obvio lo que está pasando:

```js{5,7,9}
render() {
 const estaConectado = this.state.estaConectado;
 return (
   <div>
     {estaConectado ? (
       <BotonCierreSesion onClick={this.manejarClickCierreSesion} />
     ) : (
       <BotonInicioSesion onClick={this.manejarClickInicioSesion} />
     )}
   </div>
 );
}
```

Al igual que en JavaScript, depende de ti elegir un estilo apropiado en base a lo que a ti y a tu equipo consideran más legible. Recuerda también que cuando las condiciones se vuelven demasiado complejas, puede ser un buen momento para [extraer un componente](/docs/components-and-props.html#extracting-components).

### Evitar que el componente se renderice

En casos excepcionales, es posible que desees que un componente se oculte a sí mismo aunque haya sido renderizado por otro componente. Para hacer esto, devuelve `null` en lugar del resultado de render.

En el siguiente ejemplo, el `<BannerAdvertencia />` se renderiza dependiendo del valor de la prop llamada `advertencia`. Si el valor de la prop es `false`, entonces el componente no se renderiza:

```javascript{2-4,29}
function BannerAdvertencia(props) {
 if (!props.advertencia) {
   return null;
 }

 return (
   <div className="advertencia">
     ¡Advertencia!
   </div>
 );
}

class Pagina extends React.Component {
 constructor(props) {
   super(props);
   this.state = {advertencia: true};
   this.manejarClickConmutacion = this.manejarClickConmutacion.bind(this);
 }

 manejarClickConmutacion() {
   this.setState(state => ({
     Advertencia: !state.advertencia
   }));
 }

 render() {
   return (
     <div>
       <BannerAdvertencia advertencia={this.state.advertencia} />
       <button onClick={this.manejarClickConmutacion}>
         {this.state.advertencia ? 'Ocultar' : 'Mostrar'}
       </button>
     </div>
   );
 }
}

ReactDOM.render(
 <Pagina />,
 document.getElementById('raiz')
);
```

[**Pruébalo en CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Devolviendo `null` desde el método `render` de un componente no influye en la activación de los métodos del ciclo de vida del componente. Por ejemplo `componentDidUpdate` seguirá siendo llamado.


