---
description: Reglas del agente para diseñar el juego TRONO 2415 con enfoque Spec-Driven Development
globs: *
alwaysApply: true
---

# Guía Operativa del Proyecto

## Propósito
Este repositorio está orientado al diseño de un videojuego narrativo y sistémico: **TRONO 2415**.  
El objetivo del agente es producir documentación accionable para diseño, narrativa, mecánicas, producción y prototipado.

## Enfoque obligatorio: Spec-Driven Development
Antes de proponer implementación técnica o contenido nuevo, seguir este flujo:

1. Definir intención y alcance del cambio.
2. Actualizar primero el concepto de juego.
3. Actualizar después el GDD con detalle sistémico.
4. Cerrar con criterios de validación del cambio.

## Orden de actualización de documentos
Cuando haya cambios de visión o mecánicas:

1. `GAME_CONCEPT_DOCUMENT.md`  
   Ajustar propuesta de valor, fantasía del jugador, tono y posicionamiento.
2. `GDD.md`  
   Alinear sistemas, loop, progresión, misiones, riesgos y alcance MVP.
3. Coherencia final  
   Verificar que ambos documentos no se contradigan.

## Reglas de escritura
- Mantener tono profesional, claro y directo.
- Preferir listas y estructura escaneable.
- Evitar ambigüedad en objetivos y resultados.
- Diferenciar claramente visión, diseño y ejecución.

## Reglas narrativas del proyecto
- El eje es el **bien mayor**, no la glorificación del daño.
- Tratar eventos históricos sensibles con respeto y enfoque humano.
- Priorizar prevención, protección y responsabilidad moral.
- Evitar describir procedimientos de daño realista.

## Reglas de diseño de gameplay
- Diseñar sistemas con múltiples rutas de resolución.
- Favorecer mecánicas no letales y sigilo social.
- Definir consecuencias persistentes entre misiones.
- Asegurar que cada nueva mecánica tenga propósito en el loop principal.

## Reglas de trabajo con Excalidraw MCP
- Usar `excalidraw-mcp` como canal visual para diagramar ideas.
- Convertir cada diagrama en decisiones concretas dentro de GDD y Concept.
- Registrar cambios importantes en formato de decisión de diseño.

## Criterios de calidad por entrega
Cada iteración debe dejar:
- Objetivo del cambio explícito.
- Cambios aplicados en ambos documentos cuando corresponda.
- Impacto en gameplay/narrativa claramente explicado.
- Próximo paso recomendado para mantener continuidad.
