---
id: reconciliation
title: Reconciliación
permalink: docs/reconciliation.html
---

React proporciona una API declarativa para que no tengas que preocuparte sobre qué cambia exactamente en cada actualización. Esto facilita mucho la escritura de aplicaciones, pero podría no ser obvio cómo se implementa esto dentro de React. Este artículo explica las elecciones que hicimos en el algoritmo "diferencial" de React para que las actualizaciones de los componentes sean predecibles y al mismo tiempo sean lo suficiente rápidas para las aplicaciones de alto rendimiento.

## Motivación {#motivation}

Cuando usas React, en un momento dado puedes pensar que la función `render()` crea un árbol de elementos de React. En la siguiente actualización de estado o propiedades, esa función `render()` devolverá un árbol diferente de elementos de React. React luego debe descubrir cómo actualizar de manera eficiente la interfaz de usuario para que coincida con el árbol más reciente.

Existen algunas soluciones genéricas para este problema algorítmico de generar el número mínimo de operaciones para transformar un árbol en otro. Sin embargo, los [algoritmos de vanguardia](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) tienen una complejidad en el orden de O(n<sup>3</sup>) donde n es el número de elementos en el árbol.

Si utilizamos esto en React, mostrar 1000 elementos requeriría del orden de mil millones de comparaciones. Esto sería demasiado costoso. En su lugar, React implementa un algoritmo heurístico O(n) basado en dos suposiciones.

1. Dos elementos de diferentes tipos producirán diferentes árboles.
2. El desarrollador puede insinuar qué elementos secundarios pueden ser estables en diferentes renders con una propiedad `key`.

En la práctica, estos supuestos son válidos para casi todos los casos de uso práctico.

## El algoritmo diferencial {#the-diffing-algorithm}

Al diferenciar dos árboles, React primero compara dos elementos raíz. El comportamiento es diferente dependiendo de los tipos de elementos raíz.

### Elementos de diferentes tipos {#elements-of-different-types}

Cada vez que los elementos raíz tienen diferentes tipos, React derribará el árbol viejo y construirá el nuevo árbol desde cero. Pasando de `<a>` a `<img>`, o de `<Article>` a `<Comment>`, o de `<Button>` a `<div>` - cualquiera de esos conducirá a una reconstrucción completa.

Al derribar un árbol, los nodos antiguos del DOM se destruyen. Las instacias de los componentes reciben `componentWillUnmount()`. Al construir un nuevo árbol, los nuevos elementos del DOM se insertan. Las instancias de componentes reciben `componentWillMount()` y luego `componentDidMount()`. Cualquier estado asociado al árbol viejo se pierde.

Cualquier componente debajo de la raíz también se desmontará y se destruirá su estado. Por ejemplo, cuando difiere:

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

Esto destruirá el `Counter` viejo y volvera a montar uno nuevo.

### Elementos del DOM del mismo tipo {#dom-elements-of-the-same-type}

Al comparar dos elementos elementos React DOM del mismo tipo, React analiza los atributos de ambos, mantiene el mismo nodo DOM subyacente, y solo actualiza los atributos modificados. Por ejemplo:

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

Comparando estos dos elementos, React sabe que solo debe modificar el `className` en el nodo DOM subyacente.

Al actualizar `style`, React también sabe actualizar solo las propiedades que cambiaron. Por ejemplo:

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

Al convertir entre estos dos elementos, React sabe que solo debe modificar el estilo `color`, no el `fontWeight`.

Después de manejar el nodo DOM, React recurre a los hijos.

### Componentes del mismo tipo {#component-elements-of-the-same-type}

Cuando se actualiza un componente, la instancia permanece igual, por lo que el estado se mantiene en todas las representaciones. React actualiza las propiedades de la instancia del componente subyacente para que coincida con el nuevo elemento, y llama a `componentWillReceiveProps()` y `componentWillUpdate()` en la instancia subyacente.

A continuación, se llama al método `render()` y al algoritmo de diferenciación en el resultado anterior y el nuevo resultado.

### Recursión en hijos {#recursing-on-children}

De forma predeterminada, cuando hay recursión en los hijos de un nodo DOM, React simplemente itera sobre ambas listas de hijos al mismo tiempo y genera una mutación siempre que haya diferencia. 

Por ejemplo, al agregar un elemento al final de los hijos, la conversión entre estos dos árboles funciona bien:

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React coincidirá con los árboles `<li>first</li>`, con los dos árboles `<li>second</li>` y luego insertará el árbol `<li>third</li>`.

Si lo implementas ingenuamente, la inserción de un elemento al principio tiene un peor rendimiento. Por ejemplo, la conversión entre estos dos árboles funcionaría mal:

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React mutará a cada hijo en lugar de darse cuenta que puede mantener intactos los subárboles `<li>Duke</li>` y `<li>Villanova</li>`. Esta ineficiencia puede ser un problema.

### *Keys* {#keys}

Para resolver este problema, React admite un atributo `key`. Cuando los hijos tienen claves, React lo usa para relacionar los hijos del árbol original con los hijos del árbol posterior. Por ejemplo, agregando una clave a nuestro ejemplo anterior puede hacer que la conversión de árbol sea eficiente:

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

Ahora, React sabe que el elemento con la clave `'2014'` es nuevo, y los elementos con la clave `'2015'` y `'2016'` se acaban de mover.

En la práctica, encontrar una clave no suele ser difícil. Es posible que el elemento que va a mostrar ya tenga un ID único, por lo que la clave puede provenir de sus datos:

```js
<li key={item.id}>{item.name}</li>
```

Cuando ese no sea el caso, puedes agregar una nueva propiedad de ID a su modelo o marcar algunas partes del contenido para generar una clave. La clave solo tiene que ser única entre sus hermanos, no globalmente única.

Como último recurso, puedes pasar el índice de un elemento en la matriz como una clave. Esto puede funcionar bien si los ítems nunca se reordenan, pero los reordenamientos serán lentos.

Reorganizar también puede causar problemas de estado del componente cuando los índices se utilizan como claves. Si la clave es un índice, mover un elemento lo cambia. Como resultado, el estado el componente para cosas como entradas no controladas pueden mezclarse y actualizarse de manera inesperada.

[Aquí](codepen://reconciliation/index-used-as-key) hay un ejemplo de los problemas que pueden ser causados por el uso de índices como claves en Codepen, y [aquí](codepen://reconciliation/no-index-used-as-key) es una versión actualizada del mismo ejemplo que muestra cómo no usar los índices como claves solucionará estos problemas de reordenación, clasificación y preparación.

## Compensaciones {#tradeoffs}

Es importante recordar que el algoritmo de reconciliación es un detalle de la implementación. React podría volver a renderizar toda la aplicación en cada acción; El resultado final sería el mismo. Para que quede claro, volver a renderizar en este contexto significa llamar a `render` para todos los componentes, no significa que React los desmonte y los vuelva a montar. Solo aplicará las diferencias siguiendo las reglas establecidas en las secciones anteriores. 

Regularmente refinamos las heurísticas para que los casos de uso común sean más rápidos. En la implementación actual, puedes expresar el hecho de que un subárbol se ha movido entre sus hermanos, pero no puede decir que se haya movido a otro lugar. El algoritmo reenviará ese subárbol completo.

Debido a que React se basa en heurísticas, si no se cumplen las suposiciones detrás de ellas, el rendimiento se verá afectado.

1. El algoritmo no intentará hacer coincidir subárboles de diferentes tipos de componentes. Si te ves alternando entre dos tipos de componentes muy similares, es posible que quieras hacerlo del mismo tipo. En la práctica, no hemos encontrado que esto sea un problema.

2. Las claves deben ser estables, predecibles y únicas. Las claves inestables (como las producidas por `Math.random()`) harán que muchas instancias de componentes y nodos del DOM se vuelvan a crear innecesariamente, lo que puede causar una degradación del rendimiento y la pérdida del estado en componentes hijos.
