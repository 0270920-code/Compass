[README_Neobank_Propuesta_Actualizada.md](https://github.com/user-attachments/files/34948313/README_Neobank_Propuesta_Actualizada.md)
# Neobank — Simulador educativo de metas de ahorro (FIN506)

**Equipo:** Sofía Torres y Bruno Aguirre · Universidad Panamericana · Noviembre de 2026.

## Qué es

Neobank es un **prototipo educativo** de una experiencia de ahorro. Una persona ficticia llamada Alex puede crear una meta, registrar aportaciones **simuladas** y consultar saldo, avance e historial. **No es un banco**, no abre cuentas, no recibe dinero, no procesa transferencias, no presta y no paga intereses.

> **Estado:** El repositorio contiene `index.html`, `styles.css`, `app.js`, `money.mjs`, `money.test.mjs` y `seed.json`. Las cuatro pruebas automatizadas de lógica monetaria pasaron en la revisión del 16/11/2026. **La ejecución completa en un navegador externo y una URL pública todavía deben verificarse por el equipo.** No describir la aplicación como desplegada sin haberlo comprobado.

## Requisitos

- Navegador moderno con JavaScript y `localStorage` habilitados.
- Para las pruebas automáticas: Node.js 20 o posterior.
- No requiere instalar dependencias de terceros.

## Cómo ejecutar el prototipo localmente

1. Descarga el repositorio y abre una terminal dentro de la carpeta que contiene `index.html`.
2. Inicia un servidor de archivos estáticos, por ejemplo:

   ```bash
   python3 -m http.server 8000
   ```

3. Abre `http://localhost:8000/` en un navegador moderno.
4. Sigue el flujo de demostración: **Enter demo → Save goal → Add simulated contribution → Review contribution → Confirm simulation → View goal and history**.
5. Para comenzar de nuevo, selecciona **Reset demo**.

**Verificación pendiente:** el comando anterior es una forma estándar de servir archivos estáticos, pero debe probarse en una computadora limpia y documentarse el resultado. Si el navegador no admite la importación JSON de `app.js`, habrá que corregir compatibilidad antes de la entrega.

## Datos y simulaciones

- `seed.json` contiene solo un usuario ficticio: **Alex**.
- La meta y las aportaciones se almacenan únicamente en el `localStorage` del navegador.
- Todos los montos monetarios se calculan en **centavos enteros de MXN**.
- Aportaciones, folios, saldos y progreso son **simulados**. Las comisiones y los intereses en la demostración son MXN 0.00.
- No se guardan credenciales bancarias ni datos personales reales.
- La suscripción de **MXN 29 al mes** existe únicamente como **supuesto del modelo financiero**, no como función de cobro del prototipo.

## Pruebas automáticas

Desde la raíz del repositorio:

```bash
node --test money.test.mjs
```

**Resultado observado el 16/11/2026:** 4 pruebas aprobadas; verifican lectura de centavos, suma exacta, rechazo de montos inválidos y límites de enteros seguros. **No son una prueba integral del navegador, del doble clic ni de la separación de usuarios.**

## Estructura principal

- `SPEC.md`: alcance, flujo, modelo de datos y supuestos.
- `DECISIONS.md`: decisiones y motivos del equipo.
- `BITACORA.md`: registro de sesiones que deben completar los integrantes.
- `PROJECT_METHOD.md` y `AGENTS.md`: método de trabajo y restricciones.
- `index.html`, `styles.css`, `app.js`: interfaz y lógica del prototipo.
- `money.mjs`, `money.test.mjs`: lógica monetaria y pruebas.
- `seed.json`: datos ficticios iniciales.

## Pendientes importantes para FIN506

- [ ] **Revisar con el profesor la discrepancia de alcance:** `SPEC.md` excluye login y multiusuario, mientras que la guía final exige autenticación y aislamiento de datos por usuario. No afirmar que se cumple ese requisito.
- [ ] Confirmar con el profesor la adopción del alcance después de la congelación de Avance 2 (`TODO-verify`).
- [ ] Verificar el flujo completo en navegador, incluyendo cancelación, doble confirmación, errores y persistencia.
- [ ] Proporcionar URL pública o build que el profesor pueda abrir sin ayuda; no colocar credenciales en GitHub.
- [ ] Grabar respaldo del demo de máximo dos minutos.
- [ ] Alinear el nombre visible `compass` en `index.html` con la marca del proyecto **Neobank**, previa decisión del equipo.
- [ ] Documentar pull requests revisados por el compañero y completar `BITACORA.md` con sesiones reales.
- [ ] Marcar toda afirmación jurídica no confirmada como `TODO-verify`.

## Modelo financiero y validación

La encuesta exploratoria del equipo tuvo **30 respuestas**; en la pregunta de precio hubo **28 respuestas válidas**, de las cuales **8** dijeron que pagarían MXN 29 al mes. Esto **no equivale a clientes reales**. Las proyecciones de usuarios, CAC, churn, ingresos y valuación son hipótesis y se documentan en el Excel financiero de FIN506.

---

**Antes de sustituir el README del repositorio:** ambos integrantes deben revisar este texto, ejecutar las instrucciones, aprobar los cambios por pull request y registrar la sesión real en `BITACORA.md`.
