---
title: "Hooks integrados de React DOM"
---

<Intro>

El paquete de `react-dom` contiene Hooks que solo se admiten para aplicaciones web (que se ejecutan en el entorno DOM del navegador). Estos Hooks no son compatibles en entornos que no son de navegador, como en aplicaciones de iOS, Android o Windows. Si estás buscando Hooks que sean compatibles en navegadores web *y otros entornos*, consulta [la página de Hooks de React](/reference/react). Esta página enumera todos los Hooks en el paquete `react-dom`.

</Intro>

---

## Hooks de Formularios {/*form-hooks*/}

<Canary>

Los Hooks de Formularios actualmente solo están disponibles en React Canary y canales experimentales. Aprende más sobre los [canales de lanzamiento de React aquí](/community/versioning-policy#all-release-channels).

</Canary>

Los formularios (*forms*) te permiten crear controles interactivos para enviar información. Para manejar formularios en tus componentes, usa uno de estos Hooks:

<<<<<<< HEAD
* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) facilita la actualización de la interfaz de usuario basada en el estado del formulario.
* [`useFormState`](/reference/react-dom/hooks/useFormState) te permite gestionar el estado dentro de un formulario.
=======
* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) allows you to make updates to the UI based on the status of the a form.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

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
