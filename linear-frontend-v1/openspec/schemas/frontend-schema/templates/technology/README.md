# Technology Templates — Frontend Schema

This directory can hold frontend-specific technology templates.

## Fallback Behavior

If templates are not found here, the tech-selection skill will use templates from:
```
openspec/schemas/fullstack-schema/templates/technology/
```

## Customizing Templates

To use frontend-specific templates, copy from fullstack-schema and customize:

```bash
cp openspec/schemas/fullstack-schema/templates/technology/*.md openspec/schemas/frontend-schema/templates/technology/
```

Then edit the files to focus on frontend-specific concerns:
- `stack-templates.md` — Frontend stack documentation
- `architecture-templates.md` — Frontend architecture documentation
- `deployment-templates.md` — Frontend deployment documentation
