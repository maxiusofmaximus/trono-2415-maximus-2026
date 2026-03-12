# Technical Design Document — TRONO 2415

## 1. Objetivo técnico
Implementar un vertical slice jugable que valide el loop principal, los sistemas de sospecha/confianza y la progresión por consecuencias persistentes.

## 2. Stack objetivo (agnóstico de engine)
- Módulo de misión con estados y objetivos.
- Módulo de IA social para NPC por rol.
- Módulo de consecuencias persistentes.
- Telemetría de decisiones y resultados.

## 3. Arquitectura funcional
- **Mission Runtime**: controla fases del loop y estados de misión.
- **Social Stealth System**: evalúa sospecha y credibilidad contextual.
- **Consequence Engine**: persiste variables entre misiones.
- **Narrative State Manager**: adapta briefing/debrief según estado de mundo.
- **Build System**: aplica bendiciones y habilidades activas.

## 4. Modelo de datos base
- PlayerProfile: atributos, habilidades, recursos.
- MissionState: objetivos, temporizadores, nivel de pánico.
- NPCState: rol, sospecha, confianza, memoria local.
- WorldState: distrito, facción, estabilidad temporal.
- DebriefSnapshot: resultado, causalidad, desbloqueos.

## 5. Reglas sistémicas mínimas (MVP)
- Toda misión registra sospecha global y local.
- Toda decisión crítica escribe al menos 1 cambio en WorldState.
- Toda misión produce debrief con métricas de impacto.
- Debe existir fallback no letal cuando una ruta falla.

## 6. Telemetría requerida
- Tiempo al primer objetivo cumplido.
- Distribución de rutas por tipo (social/técnica/estratégica).
- Variación de sospecha por segmento de misión.
- Vidas protegidas y daño colateral por intento.
- Retención por desbloqueo de build.

## 7. Criterios de rendimiento MVP
- Escena de misión estable en tasa objetivo definida por plataforma.
- Carga de misión por debajo del umbral establecido en producción.
- Guardado/carga de estado persistente sin pérdida de datos.

## 8. QA funcional mínimo
- Pruebas de loop completo de inicio a debrief.
- Pruebas de estados límite de sospecha/confianza.
- Pruebas de persistencia entre dos misiones consecutivas.
- Pruebas de accesibilidad y legibilidad de feedback.

## 9. Riesgos técnicos y mitigación
- Complejidad de IA social.
  - Mitigación: plantillas de rol con comportamiento parametrizable.
- Explosión de combinaciones de consecuencias.
  - Mitigación: matriz de consecuencias por capas y límites por misión.
- Pérdida de claridad en UI.
  - Mitigación: jerarquía estricta de señales y debrief explicativo.
