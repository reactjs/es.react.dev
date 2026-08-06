---
title: globals
---

<Intro>

Valida la asignación o mutación de globales durante el renderizado, como parte de garantizar que los [efectos secundarios deben ejecutarse fuera del renderizado](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render).

</Intro>

## Detalles de la regla {/*rule-details*/}

Las variables globales existen fuera del control de React. Cuando las modificas durante el renderizado, rompes la suposición de React de que el renderizado es puro. Esto puede hacer que los componentes se comporten de manera diferente en desarrollo y producción, romper Fast Refresh e impedir que tu aplicación se optimice con funciones como React Compiler.

### Inválido {/*invalid*/}

Ejemplos de código incorrecto para esta regla:

```js
// ❌ Contador global
let renderCount = 0;
function Component() {
  renderCount++; // Mutar un global
  return <div>Count: {renderCount}</div>;
}

// ❌ Modificar propiedades de window
function Component({userId}) {
  window.currentUser = userId; // Mutación global
  return <div>User: {userId}</div>;
}

// ❌ push en un arreglo global
const events = [];
function Component({event}) {
  events.push(event); // Mutar un arreglo global
  return <div>Events: {events.length}</div>;
}

// ❌ Manipulación de caché
const cache = {};
function Component({id}) {
  if (!cache[id]) {
    cache[id] = fetchData(id); // Modificar la caché durante el renderizado
  }
  return <div>{cache[id]}</div>;
}
```

### Válido {/*valid*/}

Ejemplos de código correcto para esta regla:

```js
// ✅ Usa estado para contadores
function Component() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked: {clickCount} times
    </button>
  );
}

// ✅ Usa contexto para valores globales
function Component() {
  const user = useContext(UserContext);
  return <div>User: {user.id}</div>;
}

// ✅ Sincroniza el estado externo con React
function Component({title}) {
  useEffect(() => {
    document.title = title; // Correcto en un efecto
  }, [title]);

  return <div>Page: {title}</div>;
}
```
