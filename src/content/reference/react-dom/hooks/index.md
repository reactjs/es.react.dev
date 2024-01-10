---
title: "Hooks integrados de React DOM"
---

<Intro>

El paquete de `react-dom` contiene Hooks que solo se admiten para aplicaciones web (que se ejecutan en el entorno DOM del navegador). Estos Hooks no son compatibles en entornos que no son de navegador, como en aplicaciones de iOS, Android o Windows. Si estas buscando Hooks que sean compatibles en navegadores web *y otros entornos*, consulta [la página de React Hooks](/reference/react). Esta página enumera todos los Hooks en el paquete `react-dom`.

</Intro>

---

## Form Hooks {/*form-hooks*/}

<Canary>

Form Hooks actualmente solo están disponibles en React Canary y canales experimentales. Aprende más sobre los [canales de lanzamiento de React aquí](/community/versioning-policy#all-release-channels).

</Canary>

*Forms* te permiten crear controles interactivos para enviar información. Para manejar forms en tus componentes, usa uno de estos Hooks :

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) facilita la actualización de la interfaz de usuario basada en el estado del formulario.
* [`useFormState`](/reference/react-dom/hooks/useFormState) te permite gestionar el estado dentro de un formulario.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useFormState(increment, 0);
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

