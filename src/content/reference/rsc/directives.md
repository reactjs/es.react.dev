---
title: "Directivas"
canary: true
---

<Canary>

Estas directivas sólo son necesarias si estás [usando React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) o construyendo una librería compatible con ellos.

</Canary>

<Intro>

Las directivas proporcionan instrucciones para [bundlers compatibles con React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</Intro>

---

## Directivas de código fuente {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) te permite marcar qué código se ejecuta en el cliente.
* [`'use server'`](/reference/rsc/use-server) marca funciones del lado del servidor que pueden ser llamadas desde código del lado del cliente.
