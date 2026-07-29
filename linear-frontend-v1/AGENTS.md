## Mandatory Project Rules

Sigue siempre este orden de prioridad al entender código o hacer cambios:

### 1. CodeGraph + Graphify (Inteligencia de Código)
Antes de leer archivos con `read`, `grep` o `find`, usa siempre las herramientas de grafo:

- Si existe `.codegraph/` → usa **CodeGraph** (`codegraph_explore` o `codegraph explore`)
- Si existe `graphify-out/graph.json` → usa **Graphify** primero (`graphify query`, `graphify path`, `graphify explain`)

**Nunca** hagas suposiciones sobre la implementación sin consultar primero el grafo.

### 2. Memory (Conocimiento Persistente)
Antes de responder sobre decisiones anteriores, convenciones, arquitectura, preferencias del usuario o historia del proyecto:

→ Usa `memory_search` (del headroom_memory MCP)

Después de tomar decisiones importantes, descubrir convenciones o aprender hechos relevantes:

→ Usa `memory_save` para persistir la información.

La memoria es tu **primera fuente de verdad** para contexto histórico.

### 3. RTK - Comandos Optimizados (Ahorro de Tokens)
Cuando necesites ejecutar comandos de terminal, **siempre usa el prefijo `rtk`**:

```bash
# Ejemplos recomendados
rtk git status          rtk git diff           rtk git log
rtk ls                  rtk read <file>        rtk grep <pattern>
rtk pytest              rtk cargo test         rtk test <cmd>
rtk docker ps           rtk kubectl get        rtk gh pr view