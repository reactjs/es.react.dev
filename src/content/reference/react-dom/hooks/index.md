---
title: "Hooks integrados de React DOM"
---

<Intro>

<<<<<<< HEAD
El paquete de `react-dom` contiene Hooks que solo se admiten para aplicaciones web (que se ejecutan en el entorno DOM del navegador). Estos Hooks no son compatibles en entornos que no son de navegador, como en aplicaciones de iOS, Android o Windows. Si estás buscando Hooks que sean compatibles en navegadores web *y otros entornos*, consulta [la página de Hooks de React](/reference/react). Esta página enumera todos los Hooks en el paquete `react-dom`.
=======
The `react-dom` package contains Hooks that are only supported for web applications (which run in the browser DOM environment). These Hooks are not supported in non-browser environments like iOS, Android, or Windows applications. If you are looking for Hooks that are supported in web browsers *and other environments* see [the React Hooks page](/reference/react/hooks). This page lists all the Hooks in the `react-dom` package.
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

</Intro>

---

## Hooks de Formularios {/*form-hooks*/}

Los formularios (*forms*) te permiten crear controles interactivos para enviar información. Para manejar formularios en tus componentes, usa uno de estos Hooks:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) facilita la actualización de la interfaz de usuario basada en el estado del formulario.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
