---
id: context
title: Context
permalink: docs/context.html
---

Context provee una forma de pasar datos a través del árbol de componentes sin tener que pasar *props* manualmente en cada nivel.

En una aplicación típica de React, los datos se pasan de arriba hacia abajo (de padre a hijo) a través de *props*, pero esto puede ser complicado para ciertos tipos de *props* (por ejemplo, localización, el tema de la interfaz) que son necesarios para muchos componentes dentro de una aplicación. Context proporciona una forma de compartir valores como estos entre componentes sin tener que pasar explícitamente un *prop* a través de cada nivel del árbol.

- [Cuándo usar Context](#when-to-use-context)
- [Antes de usar Context](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [Ejemplos](#examples)
  - [Context dinámico](#dynamic-context)
  - [Actualizando Context desde un componente anidado](#updating-context-from-a-nested-component)
  - [Consumiendo múltiples Contexts](#consuming-multiple-contexts)
- [Advertencias](#caveats)
- [API antigua](#legacy-api)

## Cuándo usar Context {#when-to-use-context}

Context está diseñado para compartir datos que pueden considerarse "globales" para un árbol de componentes en React, como el usuario autenticado actual, el tema o el idioma preferido. Por ejemplo, en el código a continuación, pasamos manualmente un *prop* de "tema" para darle estilo al componente *Button*:

`embed:context/motivation-problem.js`

Usando Context podemos evitar pasar *props* a través de elementos intermedios:

`embed:context/motivation-solution.js`

## Antes de usar Context {#before-you-use-context}

Context se usa principalmente cuando algunos datos tienen que ser accesibles por *muchos* componentes en diferentes niveles de anidamiento. Aplícalo con moderación porque hace que la reutilización de componentes sea más difícil.

**Si solo deseas evitar pasar algunos props a través de muchos niveles, la [composición de componentes](/docs/composition-vs-inheritance.html) suele ser una solución más simple que Context.**

Por ejemplo, considera un componente `Page` que pasa un prop `user` y `avatarSize` varios niveles hacia abajo para que los componentes anidados `Link` y `Avatar` puedan leerlo:

```js
<Page user={user} avatarSize={avatarSize} />
// ... que renderiza ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... que renderiza ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... que renderiza ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Puede parecer redundante pasar los props de `user` y` avatarSize` a través de muchos niveles si al final solo el componente `Avatar` realmente lo necesita. También es molesto que cada vez que el componente `Avatar` necesite más props, también hay que agregarlos en todos los niveles intermedios.

Una forma de resolver este problema **sin usar Context** es [pasar el mismo componente `Avatar`](/docs/composition-vs-inheritance.html#containment) para que los componentes intermedios no tengan que saber sobre los props `usuario` o `avatarSize`:

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Ahora tenemos:
<Page user={user} avatarSize={avatarSize} />
// ... que renderiza ...
<PageLayout userLink={...} />
// ... que renderiza ...
<NavigationBar userLink={...} />
// ... que renderiza ...
{props.userLink}
```

Con este cambio, solo el componente más importante Page necesita saber sobre el uso de `user` y `avatarSize` de los componentes `Link` y `Avatar`.

Esta *inversión de control* puede hacer que tu código, en muchos casos, sea más limpio al reducir la cantidad de props que necesitas pasar a través de tu aplicación y dar más control a los componentes raíz. Sin embargo, esta no es la opción correcta en todos los casos: mover más complejidad más arriba en el árbol hace que esos componentes de nivel superior sean más complicados y obliga a los componentes de nivel inferior a ser más flexibles de lo que tu podrías desear.

No estás limitado a un solo hijo por componente. Puede pasar varios hijos, o incluso tener varios “huecos” (slots) separados para los hijos, [como se documenta aquí](/docs/composition-vs-inheritance.html#contenering):


```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

Este patrón es suficiente para muchos casos cuando necesitas separar a un componente hijo de sus componentes padres inmediatos. Puedes llevarlo aún más lejos con [render props](/docs/render-props.html) si el hijo necesita comunicarse con el padre antes de renderizar.

Sin embargo, a veces, los mismos datos deben ser accesibles por muchos componentes en el árbol y a diferentes niveles de anidamiento. Context te permite "transmitir" dichos datos, y los cambios, a todos los componentes de abajo. Los ejemplos comunes en los que el uso de Context podría ser más simple que otras alternativas incluyen la administración de la configuración de localización, el tema o un caché de datos.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Crea un objeto Context. Cuando React renderiza un componente que se suscribe a este objeto Context, este leerá el valor de contexto actual del `Provider` más cercano en el árbol.

El argumento `defaultValue` es usado **únicamente** cuando un componente no tiene un `Provider` superior a él en el árbol. Esto puede ser útil para probar componentes de forma aislada sin contenerlos. Nota: pasar `undefined` como valor al `Provider` no hace que los componentes que lo consumen utilicen `defaultValue`.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* algún valor */}>
```

Cada objeto Context viene con un componente `Provider` de React que permite que los componentes que lo consumen se suscriban a los cambios del contexto.

Acepta un prop `value` que se pasará a los componentes consumidores que son descendientes de este `Provider`. Un `Provider` puede estar conectado a muchos consumidores. Los `Providers` pueden estar anidados para sobreescribir los valores más profundos dentro del árbol.

Todos los consumidores que son descendientes de un `Provider` se vuelven a renderizar cada vez que cambia el prop `value` del `Provider`. La propagación del `Provider` a sus consumidores descendientes (incluyendo [`.contextType`](#classcontexttype) y [`useContext`](/docs/hooks-reference.html#usecontext)) no está sujeta al método `shouldComponentUpdate`, por lo que el consumidor se actualiza incluso cuando un componente padre evita la actualización.

Los cambios se determinan comparando los valores nuevos y antiguos utilizando el mismo algoritmo que [`Object.is`](//developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description). 

> Nota
> 
> La forma en que se determinan los cambios puede causar algunos problemas al pasar objetos como `value`: mira las [Advertencias](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* realiza un efecto secundario en el montaje utilizando el valor de MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* renderiza algo basado en el valor de MyContext */
  }
}
MyClass.contextType = MyContext;
```

A la propiedad `contextType` en una clase se le puede asignar un objeto Context creado por [`React.createContext()`](#reactcreatecontext). Esto te permite consumir el valor actual más cercano de ese Context utilizando `this.context`. Puedes hacer referencia a esto en cualquiera de los métodos del ciclo de vida, incluida la función de renderizado.

> Nota:
>
> Solo puedes suscribirte a un solo Context usando esta API. Si necesitas leer más de una, lee [Consumir múltiples Context](#consuming-multiple-contexts).
>
> Si estás utilizando la [sintaxis experimental de campos de clase pública](https://babeljs.io/docs/plugins/transform-class-properties/), puedes usar un campo de clase **static** para inicializar tu `contextType`.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* renderiza algo basado en el valor */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* renderiza algo basado en el valor de contexto */}
</MyContext.Consumer>
```

Un componente de React que se suscribe a cambios de contexto. Esto le permite suscribirse a un contexto dentro de un [componente de función](/docs/components-and-props.html#function-and-class-components).

Requiere una [función como hijo](/docs/render-props.html#using-props-other-than-render). La función recibe el valor de contexto actual y devuelve un nodo de React. El argumento `value` pasado a la función será igual al prop `value` del `Provider` más cercano para este contexto en el árbol. Si no hay un `Proveedor` superior para este contexto, el argumento `value` será igual al `defaultValue` que se pasó a `createContext()`.

> Nota
> 
> Para más información sobre el patrón 'función como hijo', ver [render props](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

El objeto Context acepta una propiedad de cadena de texto `displayName`. Las herramientas de desarrollo de React utilizan esta cadena de texto para determinar que mostrar para el Context.

Por ejemplo, el componente a continuación aparecerá como "NombreAMostrar" en las herramientas de desarrollo:

```js{2}
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'NombreAMostrar';

<MyContext.Provider> // "NombreAMostrar.Provider" en las herramientas de desarrollo
<MyContext.Consumer> // "NombreAMostrar.Consumer" en las herramientas de desarrollo
```

## Ejemplos {#examples}

### Context dinámico {#dynamic-context}

Un ejemplo más complejo con valores dinámicos para el tema:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### Actualizando Context desde un componente anidado {#updating-context-from-a-nested-component}

A menudo es necesario actualizar el contexto desde un componente que está anidado en algún lugar del árbol de componentes. En este caso, puedes pasar una función a través del contexto para permitir a los consumidores actualizar el contexto:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Consumir múltiples Context {#consuming-multiple-contexts}

Para mantener el renderizado de Context rápido, React necesita hacer que cada consumidor de contexto sea un nodo separado en el árbol.

`embed:context/multiple-contexts.js`

Si dos o más valores de contexto se usan a menudo juntos, es posible que desees considerar la creación de tu propio componente de procesamiento que proporcione ambos.

## Advertencias {#caveats}

Debido a que `Context` usa la identidad por referencia para determinar cuándo se debe volver a renderizar, hay algunos errores que podrían provocar renderizados involuntarios en los consumidores cuando se vuelve a renderizar en el padre del proveedor. Por ejemplo, el código a continuación volverá a renderizar a todos los consumidores cada vez que el `Proveedor` se vuelva a renderizar porque siempre se crea un nuevo objeto para `value`:

`embed:context/reference-caveats-problem.js`


Para evitar esto, levanta el valor al estado del padre:

`embed:context/reference-caveats-solution.js`

## API antigua {#legacy-api}

> Nota
> 
> React previamente había liberado el API experimental de Context. La antigua API será compatible con todas las versiones 16.x, pero las aplicaciones que la utilicen deberían migrar a la nueva versión. La API antigua se eliminará en una futura versión importante de React. Lee la [documentación antigua de Context aquí](/docs/legacy-context.html).
 
