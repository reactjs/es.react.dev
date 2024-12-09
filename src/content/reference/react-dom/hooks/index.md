---
title: "Hooks integrados de React DOM"
---

<Intro>

El paquete de `react-dom` contiene Hooks que solo se admiten para aplicaciones web (que se ejecutan en el entorno DOM del navegador). Estos Hooks no son compatibles en entornos que no son de navegador, como en aplicaciones de iOS, Android o Windows. Si estás buscando Hooks que sean compatibles en navegadores web *y otros entornos*, consulta [la página de Hooks de React](/reference/react). Esta página enumera todos los Hooks en el paquete `react-dom`.

</Intro>

---

## Hooks de Formularios {/*form-hooks*/}

<<<<<<< HEAD
<Canary>

Los Hooks de Formularios actualmente solo están disponibles en React Canary y canales experimentales. Aprende más sobre los [canales de lanzamiento de React aquí](/community/versioning-policy#all-release-channels).

</Canary>

Los formularios (*forms*) te permiten crear controles interactivos para enviar información. Para manejar formularios en tus componentes, usa uno de estos Hooks:
=======
*Forms* let you create interactive controls for submitting information.  To manage forms in your components, use one of these Hooks:
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

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
