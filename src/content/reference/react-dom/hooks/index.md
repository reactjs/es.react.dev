---
title: "Hooks integrados de React DOM"
---

<Intro>

El paquete de `react-dom` contiene Hooks que es solo se admiten para aplicaciones web (que se ejecutan en el entorno DOM del navegador). Estos Hooks no son compatibles en entornos que no son de navegador, como en aplicaciones de iOS, Android o Windows. Si estas buscando Hooks que sean compatibles en navegadores web *y otros entornos*, consulta [la página de React Hooks](/reference/react). Esta página enumera todos los Hooks en el paquete `react-dom`.

</Intro>

---

## Form Hooks {/*form-hooks*/}

<Canary>

Los Form Hooks actualmente solo están disponibles en React Canary y canales experimentales. Aprende más sobre los [canales de lanzamiento de React aquí](/community/versioning-policy#all-release-channels).

</Canary>

*Forms* let you create interactive controls for submitting information.  To manage forms in your components, use one of these Hooks:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) allows you to make updates to the UI based on the status of the a form.
* [`useFormState`](/reference/react-dom/hooks/useFormState) allows you to manage state inside a form.

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

