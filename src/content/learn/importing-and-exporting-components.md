---
title: Importar y exportar componentes
---

<Intro>

La magia de los componentes reside en su reusabilidad: puedes crear componentes que se componen a su vez de otros componentes. Pero mientras anidas más y más componentes, a menudo tiene sentido comenzar a separarlos en diferentes archivos. Esto permite que tus archivos se mantengan fáciles de localizar y puedas reutilizar componentes en más lugares.

</Intro>

<YouWillLearn>

* Qué es un archivo de componente raíz
* Cómo importar y exportar un componente
* Cuándo usar imports y exports *defaults* o con nombre
* Cómo importar o exportar múltiples componentes de un archivo
* Cómo separar componentes en múltiples archivos

</YouWillLearn>

## El archivo de componente raíz {/*the-root-component-file*/}

En [Tu primer componente](/learn/your-first-component), hiciste un componente `Profile` y un componente `Gallery` que lo renderiza:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Científicos increíbles</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Estos viven actualmente en este ejemplo en un **archivo de componente raíz,** llamado `App.js`. En [Create React App](https://create-react-app.dev/), tu aplicación vive en `src/App.js`. No obstante, en dependencia de tu configuración, tu componente raíz podría estar en otro archivo. Si utilizas un framework con enrutamiento basado en archivos, como Next.js, tu componente raíz será diferente para cada página.

## Exportar e importar un componente {/*exporting-and-importing-a-component*/}

¿Y si quisieras cambiar la pantalla de inicio en el futuro y poner allí una lista de libros científicos? ¿O ubicar todos los perfiles en otro lugar? Tiene sentido mover `Gallery` y `Profile` fuera del componente raíz. Esto los haría más modulares y reutilizables en otros archivos. Puedes mover un componente en tres pasos:

1. **Crea** un nuevo archivo JS para poner los componentes dentro.
2. **Exporta** tu componente de función desde ese archivo (ya sea usando exports [por defecto](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/export#usando_el_export_por_defecto) o [con nombre](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/export#syntax)).
3. **Impórtalo** en el archivo en el que usarás el componente (usando la técnica correspondiente de importar exports [por defecto](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/import#importaci%C3%B3n_de_elementos_por_defecto) o [con nombre](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/import#importa_un_solo_miembro_de_un_m%C3%B3dulo.)).

Aquí tanto `Profile` y `Gallery` se han movido fuera de `App.js` en un nuevo archivo llamado `Gallery.js`. Ahora puedes cambiar `App.js` para importar `Gallery` desde `Gallery.js`:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Científicos increíbles</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Nota cómo este ejemplo está ahora descompuesto en dos archivos:

1. `Gallery.js`:
     - Define el componente `Profile` que se usa solo dentro del mismo archivo y no se exporta.
     - Define el componente `Gallery` como un **export por defecto**.
2. `App.js`:
     - Importa `Gallery` como un **import por defecto** desde `Gallery.js`.
     - Exporta el componente raíz `App` como un **export por defecto**.


<Note>

Puede que te encuentres archivos que omiten la extensión de archivo `.js` de esta forma:

```js 
import Gallery from './Gallery';
```

Tanto `'./Gallery.js'` como `'./Gallery'` funcionarán con React, aunque la primera forma es más cercana a cómo lo hacen los [módulos nativos de ES](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules).

</Note>

<DeepDive>

#### Exports por defecto vs. con nombre {/*default-vs-named-exports*/}

Hay dos formas fundamentales de exportar valores con JavaScript: exports por defecto y exports con nombre. Hasta ahora nuestros ejemplos solo han usado exports por defecto. Pero puedes usar uno o ambos en el mismo archivo. **Un archivo no puede tener más de un export _por defecto_, pero puede tener tantos exports _con nombre_ como desees.**

![Exports por defecto y con nombre](/images/docs/illustrations/i_import-export.svg)

Cómo exportas tu componente dicta la forma en que debes importarlo. ¡Tendrás un error si intentas importar un export por defecto de la misma forma que lo harías con un export con nombre! Este cuadro te puede ayudar a recordarlo:

| Sintaxis     | Sentencia export                      | Sentencia import                        |
|--------------|---------------------------------------|-----------------------------------------|
| Por defecto  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Con nombre   | `export function Button() {}`         | `import { Button } from './Button.js';` |

Cuando escribes un import _por defecto_ puedes poner cualquier nombre después de `import`. Por ejemplo, podrías escribir en su lugar `import Banana from './Button.js'` y aun así te daría el mismo export por defecto. En cambio, con los imports con nombre, tiene que haber una correspondencia con los nombres en ambos lados. ¡Por eso se llaman exports _con nombre_!

**Las personas a menudo utilizan exports por defecto si el archivo solo exporta un componente, y usan exports con nombre si exporta varios componentes y valores.** Independientemente del estilo de codificación que prefieras, siempre proporciona nombres con sentido a las funciones de tus componentes y a los archivos que las contienen. Componentes sin nombre como `export default () => {}` no se recomiendan, porque hacen que la depuración sea más difícil.

</DeepDive>

## Exportar e importar múltiples componentes del mismo archivo {/*exporting-and-importing-multiple-components-from-the-same-file*/}

¿Y si quisieras mostrar solo un `Profile` en lugar de toda la galería? Puedes exportar el componente `Profile` también. Pero `Gallery.js` ya tiene un export *por defecto*, y no puedes tener _dos_ exports por defecto. Podrías crear un nuevo archivo con un export por defecto, o podrías añadir un export *con nombre* para `Profile`. **¡Un archivo solo puede contener un export por defecto, pero puede tener múltiples exports con nombre!**

<Note>

> Para reducir la potencial confusión entre exports por defecto y con nombre, algunos equipos escogen utilizar solo un estilo (por defecto o con nombre), o evitan mezclarlos en un mismo archivo. Es una cuestión de preferencias. ¡Haz lo que funcione mejor para ti!

</Note>

Primero, **exporta** `Profile` desde `Gallery.js` usando un export con nombre (sin la palabra clave `default`):

```js
export function Profile() {
  // ...
}
```

Luego, **importa** `Profile` de `Gallery.js` a `App.js` usando un import con nombre (con llaves):

```js
import { Profile } from './Gallery.js';
```

Por último, **renderiza** `<Profile />` en el componente `App`:

```js
export default function App() {
  return <Profile />;
}
```

Ahora `Gallery.js` contiene dos exports: un export por defecto `Gallery`, y un export con nombre `Profile`. `App.js` importa ambos. Intenta editar `<Profile />` cambiándolo a `<Gallery />` y viceversa en este ejemplo:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Científicos increíbles</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Ahora estás usando una mezcla de exports por defecto y con nombre:

* `Gallery.js`:
  - Exporta el componente `Profile` como un **export con nombre llamado `Profile`**.
  - Exporta el componente `Gallery` como un **export por defecto**.
* `App.js`:
  - Importa `Profile` como un **import con nombre llamado `Profile`** desde `Gallery.js`.
  - Importa `Gallery` como un **import por defecto** desde `Gallery.js`.
  - Exporta el componente raíz `App` como un **export por defecto**.

<Recap>

En esta página aprendiste:

* Qué es un archivo de componente raíz
* Como importar y exportar un componente
* Cuándo y cómo usar imports y exports por defecto y con nombre
* Cómo exportar múltiples componentes desde el mismo archivo

</Recap>



<Challenges>

#### Separa los componentes aún más {/*split-the-components-further*/}

Actualmente, `Gallery.js` exporta tanto `Profile` como `Gallery`, lo cual es un poco confuso.

Mueve el componente `Profile` a su propio `Profile.js`, y luego cambia el componente `App` para que renderice tanto `<Profile />` como `<Gallery />` uno detrás del otro.

Puedes usar o bien un export por defecto o bien un export con nombre para `Profile`, ¡pero asegúrate de usar la sintaxis de import correspondiente tanto en `App.js` como en `Gallery.js`! Te puedes apoyar en la tabla de la sección de profundización de arriba:

| Sintaxis         | Sentencia export                           | Sentencia import                          |
| -----------      | -----------                                | -----------                               |
| Por defecto  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Con nombre    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

No olvides importar tus componentes donde se llamen. ¿Acaso `Gallery` no usa también a `Profile`?

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// ¡Muéveme a Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Científicos increíbles</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Después de tenerlo funcionando con un tipo de export, hazlo funcionar con el otro tipo.

<Solution>

Esta es la solución con exports con nombre:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Científicos increíbles</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Esta es la solución con exports por defecto:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Científicos increíbles</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
