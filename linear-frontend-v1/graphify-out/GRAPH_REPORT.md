# Graph Report - .  (2026-07-28)

## Corpus Check
- Large corpus: 739 files · ~347,275 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 2116 nodes · 3105 edges · 261 communities (144 shown, 117 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 157 edges (avg confidence: 0.82)
- Token cost: 107,189 input · 56,134 output

## Community Hubs (Navigation)
- Error Handling & Auth Tokens
- Realtime & Optimistic Updates
- API Client Infrastructure
- Architecture & Design System
- Form Field Wrappers
- API Client Specs
- Shared UI Components
- App Pages & Routing
- API Client Fixes
- Keyboard Shortcuts
- Form Validation Patterns
- Form Hooks & Utilities
- Design System Rationale
- Frontend Module Docs
- Architecture Decisions
- Layout & Accessibility
- Architecture Decision Records
- Auth & Mock Service Worker
- Label Entity API
- Realtime Event Schemas
- TypeScript Config
- Event Processor
- OpenSpec Change Archive
- Package Dependencies
- Issue Module Types
- Sidebar Widget
- Config References
- State Module Documentation
- Dev Tooling
- Client-Side State & Theming
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 144
- Community 145
- Community 146
- Community 147
- Community 148
- Community 149
- Community 150
- Community 151
- Community 152
- Community 153
- Community 154
- Community 155
- Community 156
- Community 157
- Community 158
- Community 159
- Community 160
- Community 161
- Community 162
- Community 163
- Community 164
- Community 165
- Community 166
- Community 168
- Community 187
- Community 188
- Community 189
- Community 190
- Community 191
- Community 192
- Community 193
- Community 194
- Community 195
- Community 196
- Community 197
- Community 198
- Community 199
- Community 200
- Community 201
- Community 202
- Community 204
- Community 205
- Community 206
- Community 207
- Community 208
- Community 209
- Community 211
- Community 212
- Community 213
- Community 214
- Community 215
- Community 216
- Community 217
- Community 218
- Community 219
- Community 220
- Community 221
- Community 222
- Community 223
- Community 224
- Community 225
- Community 226
- Community 227
- Community 228
- Community 229
- Community 230
- Community 231
- Community 232
- Community 233
- Community 234
- Community 235
- Community 236
- Community 237
- Community 238
- Community 239
- Community 240
- Community 241
- Community 242
- Community 243
- Community 245
- Community 246
- Community 247

## God Nodes (most connected - your core abstractions)
1. `ApiError` - 24 edges
2. `processEvent()` - 20 edges
3. `compilerOptions` - 19 edges
4. `Layout Module Frontend Design` - 18 edges
5. `Layout Module Design System` - 18 edges
6. `routeEvent()` - 17 edges
7. `Fix: Create Issue Missing teamId` - 17 edges
8. `Issue` - 16 edges
9. `setupEventRouter()` - 16 edges
10. `Routing Module ADR Review` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Fix: API Client Inconsistency` --modifies--> `Zustand store for issues`  [EXTRACTED]
  openspec/changes/archive/2026-07-23-fix-api-client-inconsistency/proposal.md → src/entities/issue/model/store.ts
- `Fix: Create Issue Missing teamId` --modifies--> `Issue type definitions`  [EXTRACTED]
  openspec/changes/archive/2026-07-23-fix-create-issue-teamid/proposal.md → src/entities/issue/model/types.ts
- `Fix: Create Issue Missing teamId` --creates--> `Team Zustand store (new)`  [EXTRACTED]
  openspec/changes/archive/2026-07-23-fix-create-issue-teamid/proposal.md → src/entities/team/model/store.ts
- `Fix: Create Issue Missing teamId` --modifies--> `MSW mock handlers`  [EXTRACTED]
  openspec/changes/archive/2026-07-23-fix-create-issue-teamid/proposal.md → src/mocks/handlers.ts
- `Fix: Create Issue Missing teamId` --modifies--> `Issues page component`  [EXTRACTED]
  openspec/changes/archive/2026-07-23-fix-create-issue-teamid/proposal.md → src/pages/IssuesPage.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Frontend Stack Selection Decisions** — adr_0005_react_hook_form_zod_react_hook_form_zod, adr_0006_stack_selection_stack_selection, adr_0007_store_isolation_store_isolation, adr_0009_ui_component_architecture_ui_component_architecture [EXTRACTED 0.95]
- **Issue API Operations — Dedicated Endpoints Pattern** — adr_0010_dedicated_status_endpoint_dedicated_status_endpoint, adr_0011_dedicated_assignee_endpoint_dedicated_assignee_endpoint, adr_0012_watcher_feature_slice_watcher_feature_slice [EXTRACTED 0.95]
- **Real-time Transport Stack — SSE, WebSocket, Optimistic Updates** — adr_0013_sse_for_real_time_transport_sse_transport, adr_0014_optimistic_updates_with_rollback_optimistic_updates, docs_architecture_frontend_websocket_provider_pattern, docs_websocket_frontend_changes_async_api_alignment [EXTRACTED 0.95]
- **hyperedge_02_realtime_stack** — openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_react_19, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_zustand_5, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_vite_8, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_typescript_6, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_native_websocket [EXTRACTED 1.00]
- **hyperedge_02_3_adrs** — openspec_changes_archive_2024_07_24_realtime_websocket_events_adr_md_native_websocket_adr, openspec_changes_archive_2024_07_24_realtime_websocket_events_adr_md_zustand_adr, openspec_changes_archive_2024_07_24_realtime_websocket_events_adr_md_optimistic_adr [EXTRACTED 1.00]
- **hyperedge_02_ws_lifecycle_components** — openspec_changes_archive_2024_07_24_realtime_websocket_events_design_system_md_connection_status_indicator, openspec_changes_archive_2024_07_24_realtime_websocket_events_design_system_md_reconnection_toast, openspec_changes_archive_2024_07_24_realtime_websocket_events_design_system_md_connection_error_modal [INFERRED 0.85]
- **Realtime WebSocket Events Mockups** — openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_issue-assignee-selector, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_issue-card, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_issue-detail, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_issue-list, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_notification-panel, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_project-card, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_project-list, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_reconnection-toast, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_revert-toast [EXTRACTED 1.00]
- **Auth Module Documentation** — openspec_changes_archive_2026-07-17-auth-module_proposal, openspec_changes_archive_2026-07-17-auth-module_design-frontend, openspec_changes_archive_2026-07-17-auth-module_design-system, openspec_changes_archive_2026-07-17-auth-module_tech-stack, openspec_changes_archive_2026-07-17-auth-module_user-flows, openspec_changes_archive_2026-07-17-auth-module_tasks-frontend, openspec_changes_archive_2026-07-17-auth-module_review, openspec_changes_archive_2026-07-17-auth-module_adr [EXTRACTED 1.00]
- **Realtime WebSocket Event Specs** — openspec_changes_archive_2024-07-24-realtime-websocket-events_specs_frontend_event-subscription, openspec_changes_archive_2024-07-24-realtime-websocket-events_specs_frontend_optimistic-updates, openspec_changes_archive_2024-07-24-realtime-websocket-events_specs_frontend_websocket-connection [EXTRACTED 1.00]
- **Routing Module Design Artifacts** — openspec_changes_archive_2026-07-17-routing-module_adr_md, openspec_changes_archive_2026-07-17-routing-module_design-frontend_md, openspec_changes_archive_2026-07-17-routing-module_design-system_md, openspec_changes_archive_2026-07-17-routing-module_proposal_md, openspec_changes_archive_2026-07-17-routing-module_specs_frontend_routing_md, openspec_changes_archive_2026-07-17-routing-module_tasks-frontend_md, openspec_changes_archive_2026-07-17-routing-module_tech-stack_md, openspec_changes_archive_2026-07-17-routing-module_user-flows_md [EXTRACTED 1.00]
- **MSW Handlers Centralization Artifacts** — openspec_changes_archive_2026-07-18-centralize-msw-handlers_adr_md, openspec_changes_archive_2026-07-18-centralize-msw-handlers_design-frontend_md, openspec_changes_archive_2026-07-18-centralize-msw-handlers_design-system_md, openspec_changes_archive_2026-07-18-centralize-msw-handlers_proposal_md [EXTRACTED 1.00]
- **Protected Route Pages** — issues_page, projects_page, cycles_page, settings_page, issue_detail_page, project_detail_page, dashboard_page [INFERRED 0.85]
- **MSW Handler Centralization Architecture** — concept_msw_handlers_centralized, concept_server_runtime_msw, concept_browser_runtime_msw [EXTRACTED 1.00]
- **HttpOnly Cookie Auth Flow** — concept_httponly_cookie_auth, concept_credentials_include, concept_session_hydrate, concept_silent_token_refresh [EXTRACTED 1.00]
- **State Module Architecture Foundation** — concept_zustand_stores, concept_cache_layer_ttl, concept_derived_selectors, concept_store_isolation [EXTRACTED 1.00]
- **Domain State Stores (AuthStore, IssuesStore, UIStore, WebSocketStore)** — openspec_changes_archive_2026-07-18-state-module-cache-selectors_concept_authstore, openspec_changes_archive_2026-07-18-state-module-cache-selectors_concept_issuesstore, openspec_changes_archive_2026-07-18-state-module-cache-selectors_concept_uistore, openspec_changes_archive_2026-07-18-state-module-cache-selectors_concept_websocketstore [EXTRACTED 1.00]
- **Cache Mechanisms (TTL, LRU, Stale-While-Revalidate)** — openspec_changes_archive_2026-07-18-state-module-cache-selectors_concept_cachelayer, openspec_changes_archive_2026-07-18-state-module-cache-selectors_specs_frontend_cache-layer_md, openspec_changes_archive_2026-07-18-state-module-cache-selectors_tasks-frontend_md [EXTRACTED 1.00]
- **Container Infrastructure (Docker, nginx, Alpine)** — openspec_changes_archive_2026-07-19-add-dockerfile-containerization_concept_docker_multistage_build, openspec_changes_archive_2026-07-19-add-dockerfile-containerization_concept_nginx, openspec_changes_archive_2026-07-19-add-dockerfile-containerization_design-frontend_md [EXTRACTED 1.00]
- **API Client Error Handling Change Artifacts** — openspec_changes_archive_2026-07-19-api-client-error-handling_.openspec_yaml, openspec_changes_archive_2026-07-19-api-client-error-handling_adr_md, openspec_changes_archive_2026-07-19-api-client-error-handling_design-frontend_md, openspec_changes_archive_2026-07-19-api-client-error-handling_design-system_md, openspec_changes_archive_2026-07-19-api-client-error-handling_proposal_md, openspec_changes_archive_2026-07-19-api-client-error-handling_review_md, openspec_changes_archive_2026-07-19-api-client-error-handling_tasks-frontend_md, openspec_changes_archive_2026-07-19-api-client-error-handling_tech-stack_md, openspec_changes_archive_2026-07-19-api-client-error-handling_user-flows_md, openspec_changes_archive_2026-07-19-api-client-error-handling_mockups_error-banner_html, openspec_changes_archive_2026-07-19-api-client-error-handling_mockups_index_html, openspec_changes_archive_2026-07-19-api-client-error-handling_mockups_rate-limit-toast_html, openspec_changes_archive_2026-07-19-api-client-error-handling_specs_frontend_api-client_md [EXTRACTED 1.00]
- **UI Generic Components Change Artifacts** — openspec_changes_archive_2026-07-20-ui-generic-components_adr_md, openspec_changes_archive_2026-07-20-ui-generic-components_design-frontend_md, openspec_changes_archive_2026-07-20-ui-generic-components_design-system_md, openspec_changes_archive_2026-07-20-ui-generic-components_proposal_md, openspec_changes_archive_2026-07-20-ui-generic-components_review_md, openspec_changes_archive_2026-07-20-ui-generic-components_tasks-frontend_md, openspec_changes_archive_2026-07-20-ui-generic-components_tech-stack_md, openspec_changes_archive_2026-07-20-ui-generic-components_user-flows_md [EXTRACTED 1.00]
- **UI Generic Component Library** — ui_generic_button, ui_generic_text_input, ui_generic_select, ui_generic_checkbox, ui_generic_textarea, ui_generic_modal, ui_generic_card, ui_generic_toast, ui_generic_empty_state, ui_generic_spinner, ui_generic_loading_overlay [EXTRACTED 1.00]
- **UI Generic Components Library** — component_button, component_input, component_select, component_checkbox, component_textarea, component_modal, component_card, component_toast, component_emptystate, component_loadingindicator [INFERRED]
- **Issue Status Transition Feature** — feature_issue_status_transition, component_issuestatusbadge, workflow_default, concept_workflow_validation, openspec_changes_archive_2026_07_21_implement_issue_status_transition_adr_0010_dedicated_status_endpoint [INFERRED]
- **Issue Assign/Unassign Feature** — feature_issue_assign_unassign, component_issueformmodal, openspec_changes_archive_2026_07_21_implement_patch_issues_id_assignee_endpoint_adr_0011_dedicated_assignee_endpoint, concept_optimistic_update, concept_cache_invalidation [INFERRED]
- **hyperedge_assignee_endpoint_artifacts** — openspec_changes_archive_2026-07-21-implement-patch-issues-id-assignee-endpoint_proposal_md, openspec_changes_archive_2026-07-21-implement-patch-issues-id-assignee-endpoint_review_md, openspec_changes_archive_2026-07-21-implement-patch-issues-id-assignee-endpoint_tasks-frontend_md, openspec_changes_archive_2026-07-21-implement-patch-issues-id-assignee-endpoint_specs_frontend_assign-issue_md [EXTRACTED 1.00]
- **hyperedge_layout_module_artifacts** — openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_proposal_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_review_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_tasks-frontend_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_tech-stack_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_design-frontend_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_design-system_md [EXTRACTED 1.00]
- **hyperedge_layout_component_tree** — app_layout_component, sidebar_component, header_component, backdrop_component, nav_link_component, team_selector_component, theme_toggle_component, notification_badge_component, sidebar_toggle_component, hamburger_button_component [EXTRACTED 1.00]
- **Work Module: Issues Store & UI Change Artifacts** — openspec_changes_archive_2026-07-21-work-module-issues-store-ui_proposal, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_adr, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_design-frontend, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_design-system, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_specs_frontend_work-module-issues, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_user-flows, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_tech-stack, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_tasks-frontend, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_review, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_index, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_issues-page, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_issue-detail, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_issue-form-modal, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_confirm-delete-dialog [EXTRACTED 1.00]
- **Delete Comment Change Artifacts** — openspec_changes_archive_2026-07-22-delete-comment_proposal, openspec_changes_archive_2026-07-22-delete-comment_adr, openspec_changes_archive_2026-07-22-delete-comment_design-frontend, openspec_changes_archive_2026-07-22-delete-comment_design-system [EXTRACTED 1.00]
- **Layout Module Change Artifacts** — openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_mockups_index, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_specs_frontend_layout-module [EXTRACTED 1.00]
- **IssueDetailPage Features** — concept_issuedetailpage, concept_delete_comment_feature, concept_edit_comment_feature, concept_issue_watchers_feature [EXTRACTED 1.00]
- **Tech Stack Dependencies** — concept_react_19, concept_vite_8, concept_zustand_state_management, concept_tailwind_css_v4 [EXTRACTED 1.00]
- **Author-Only Components** — concept_commentcard_component, concept_author_only_access_control, concept_delete_comment_feature, concept_edit_comment_feature [INFERRED 0.85]
- **Watcher UI Component Composition** — concept_watchersection_component, concept_watchbutton_component, concept_watcherlist_component, concept_watcheritem_component [EXTRACTED 1.00]
- **Label UI Component Composition** — component_labelbadge, componentLabellist, component_labelpicker, component_toast [EXTRACTED 1.00]
- **Design System Token Categories** — concept_layout_tokens, concept_typography_tokens, concept_color_semantics [EXTRACTED 1.00]
- **fix-api-client-inconsistency documents** — openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_openspec_yaml_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_adr_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_design-frontend_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_design-system_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_proposal_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_review_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_tasks-frontend_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_tech-stack_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_user-flows_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_mockups_no-changes_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_specs_frontend_api-client-consistency_doc [INFERRED]
- **fix-create-issue-teamid documents** — openspec_changes_archive_2026-07-23-fix-create-issue-teamid_openspec_yaml_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_adr_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_design-frontend_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_design-system_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_proposal_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_review_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_tasks-frontend_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_tech-stack_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_user-flows_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_mockups_index_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_specs_frontend_issue-creation_doc [INFERRED]
- **API infrastructure layer** — concept_apiclient_singleton, concept_auth_token_injection, concept_401_auto_refresh, concept_cache_before_fetch [INFERRED]
- **** — openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_.openspec.yaml, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_adr.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_design-frontend.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_design-system.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_proposal.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_review.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_tasks-frontend.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_tech-stack.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_user-flows.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_mockups_readme.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_specs_frontend_delete-issue-api.md [EXTRACTED 1.00]
- **** — openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_.openspec.yaml, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_adr.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_design-frontend.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_design-system.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_proposal.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_review.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_tasks-frontend.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_tech-stack.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_user-flows.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_mockups_index.html, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_specs_frontend_issue-model.md [EXTRACTED 1.00]
- **** — src_entities_issue_api_index.ts, src_entities_issue_model_types.ts, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_delete_issue_return_type_fix, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_issue_model_alignment [INFERRED 0.75]
- **Issue Module Files** — src_entities_issue_api_index_ts, src_entities_issue_model_store_ts, src_entities_issue_model_types_ts, src_entities_issue_ui_issuefilters_tsx, src_pages_issuespage_tsx [INFERRED 0.85]
- **OpenSpec Change Artifacts** — concept_pagination_shape_fix, concept_query_param_mismatch_fix, concept_api_contract_alignment [INFERRED 0.75]
- **API Contract Alignment Concepts** — concept_statusid_param, concept_labelids_param, concept_openapi_spec, concept_fetchissuesparams_type [INFERRED 0.85]
- **** — concept_form_module, concept_validation_system, concept_submission_flow, concept_field_wrapper_pattern, concept_form_state_management [EXTRACTED 1.00]
- **** — concept_keyboard_module, concept_keyboard_shortcut_registry, concept_keyboard_context_management, concept_context_specificity, concept_keyboard_store [EXTRACTED 1.00]
- **** — concept_textfield_wrapper, concept_selectfield_wrapper, concept_checkboxfield_wrapper, concept_textareafield_wrapper [EXTRACTED 1.00]
- **Shared Tech Stack Decisions (LAG-29 and Layout Module)** — concept_react_19, concept_zustand, concept_tailwind_css_v4, concept_vitest [INFERRED 0.95]
- **Layout Module ADR Decisions** — concept_react_context, concept_css_custom_properties, concept_matchmedia_api, concept_localstorage_persistence [INFERRED 1.00]
- **Keyboard Module Spec Requirements** — concept_keyboard_shortcuts, concept_context_management, concept_specificity_based_conflict_resolution [INFERRED 1.00]
- **Realtime Event Processing Stack** — concept_sse_transport, concept_optimistic_updates, concept_event_deduplication [INFERRED 0.85]
- **Realtime Mockup Collection** — openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_index_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_issue_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_issue_detail_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_project_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_cycle_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_notification_dropdown_html [EXTRACTED 1.00]
- **Layout Module Components** — concept_layout_provider, concept_sidebar, concept_theme_toggle [EXTRACTED 1.00]
- **** — openspec_changes_archive_2026_07_28_implement_register_user_api_design_system_md, openspec_changes_archive_2026_07_28_implement_register_user_api_specs_frontend_register_user_spec_md, openspec_changes_archive_2026_07_28_implement_register_user_api_user_flows_md [INFERRED 0.75]
- **** — openspec_changes_archive_2026_07_28_ws_frontend_asyncapi_align_ws_frontend_asyncapi_align_adr_md, openspec_changes_archive_2026_07_28_ws_frontend_asyncapi_align_ws_frontend_asyncapi_align_design_frontend_md, openspec_changes_archive_2026_07_28_ws_frontend_asyncapi_align_ws_frontend_asyncapi_align_design_system_md [INFERRED 0.85]
- **** — openspec_changes_archive_2026_07_28_implement_register_user_api_mockups_auth_login_html, openspec_changes_archive_2026_07_28_implement_register_user_api_mockups_auth_register_html, openspec_changes_archive_2026_07_28_implement_register_user_api_mockups_index_html [EXTRACTED 1.00]
- **** — openspec_changes_archive_2026-07-28-ws-frontend-asyncapi-align_ws-frontend-asyncapi-align_mockups_error-toast, openspec_changes_archive_2026-07-28-ws-frontend-asyncapi-align_ws-frontend-asyncapi-align_mockups_header-status, openspec_changes_archive_2026-07-28-ws-frontend-asyncapi-align_ws-frontend-asyncapi-align_mockups_issue-board, openspec_changes_archive_2026-07-28-ws-frontend-asyncapi-align_ws-frontend-asyncapi-align_mockups_notification-panel [INFERRED 0.75]
- **** — concept_websocket_authentication, concept_channel_subscription, concept_event_processing, concept_error_handling, concept_connection_status_display [EXTRACTED 1.00]
- **** — openspec_schemas_frontend-schema_templates_technology_stack-templates, openspec_schemas_frontend-schema_templates_technology_architecture-templates, openspec_schemas_frontend-schema_templates_technology_deployment-templates [EXTRACTED 1.00]
- **Comment CRUD operations** — openspec_specs_frontend_delete-comment_md_commentcard, openspec_specs_frontend_delete-comment_md_commentlist, openspec_specs_frontend_edit-comment_md_editcomment, openspec_specs_frontend_delete-comment_md_deleteconfirmoverlay [INFERRED 0.85]
- **Optimistic update pattern** — openspec_specs_frontend_optimistic-updates_md_optimisticupdatemanager, openspec_specs_frontend_optimistic-updates_md_optimisticupdateprovider, openspec_specs_frontend_optimistic-updates_md_useoptimisticupdate, openspec_specs_frontend_optimistic-updates_md_reverttoast [EXTRACTED 1.00]
- **WebSocket event handlers** — openspec_specs_frontend_realtime-events_md_issueeventhandler, openspec_specs_frontend_realtime-events_md_commenteventhandler, openspec_specs_frontend_realtime-events_md_projecteventhandler, openspec_specs_frontend_realtime-events_md_cycleeventhandler, openspec_specs_frontend_realtime-events_md_notificationeventhandler [EXTRACTED 1.00]
- **Form Module subsystem boundary** — openspec_specs_frontend_formstate_spec_md, openspec_specs_frontend_validation_spec_md, openspec_specs_frontend_submission_spec_md, openspec_specs_frontend_fieldwrappers_spec_md [INFERRED 0.85]
- **UI input primitive components** — openspec_specs_frontend_uigenericcomponents_md_button, openspec_specs_frontend_uigenericcomponents_md_input, openspec_specs_frontend_uigenericcomponents_md_select, openspec_specs_frontend_uigenericcomponents_md_checkbox, openspec_specs_frontend_uigenericcomponents_md_textarea [EXTRACTED 1.00]
- **Client-side store layer** — openspec_specs_frontend_storearchitecture_md, openspec_specs_frontend_uistore_md, openspec_specs_frontend_websocketstore_md [INFERRED 0.85]
- **SVG Icons Group** — src_shared_assets_icons_trash_svg, src_shared_assets_icons_x_svg [INFERRED 0.85]

## Communities (261 total, 117 thin omitted)

### Community 0 - "Error Handling & Auth Tokens"
Cohesion: 0.06
Nodes (74): Error Subscriber Pattern, HTTP Interceptor Pipeline, JWT Dual Token Auth, Rate Limit Tracking, ApiClient, API Error Taxonomy, Button Component Spec, ErrorBanner Component Spec (+66 more)

### Community 1 - "Realtime & Optimistic Updates"
Cohesion: 0.06
Nodes (41): OptimisticUpdate, applyOptimistic(), ApplyOptimisticOptions, checkStaleUpdates(), createOptimisticUpdate(), onRevertEvent(), onStaleRevert(), RevertListener (+33 more)

### Community 2 - "API Client Infrastructure"
Cohesion: 0.09
Nodes (35): ApiClientConfig, RequestInterceptor, RequestMethod, RequestOptions, ResponseInterceptor, dispatchTable, dispatchToHandler(), ErrorHandler (+27 more)

### Community 3 - "Architecture & Design System"
Cohesion: 0.06
Nodes (59): Feature-Sliced Design Architecture, Store Isolation Pattern, Button, Card, Checkbox, EmptyState, ErrorBanner Component, Input (+51 more)

### Community 4 - "Form Field Wrappers"
Cohesion: 0.05
Nodes (49): Field Wrapper Components — Frontend Specification, CheckboxField, SelectField, TextareaField, TextField, Form State Management — Frontend Specification, Issue Creation — Frontend Specification, IssueFormModal (+41 more)

### Community 5 - "API Client Specs"
Cohesion: 0.04
Nodes (49): ApiClient, ApiError, ErrorHandler, ErrorTaxonomy, InterceptorPipeline, RateLimitStore, TokenRefreshFlow, AssignIssueApi (+41 more)

### Community 6 - "Shared UI Components"
Cohesion: 0.06
Nodes (32): Button, ButtonProps, ButtonSize, ButtonVariant, sizeStyles, variantStyles, Card(), CardProps (+24 more)

### Community 7 - "App Pages & Routing"
Cohesion: 0.09
Nodes (46): Auth Hydration, AuthGuard, Breadcrumb, CyclesPage, DashboardPage, Feature-Sliced Design Architecture, IssueDetailPage, IssuesPage (+38 more)

### Community 8 - "API Client Fixes"
Cohesion: 0.07
Nodes (45): Fix: API Client Inconsistency, Fix: Create Issue Missing teamId, 401 Auto-Refresh, apiClient Singleton, Auth Token Injection, Cache-Before-Fetch Pattern, createIssue() Function, CreateIssueData Type (+37 more)

### Community 9 - "Keyboard Shortcuts"
Cohesion: 0.08
Nodes (22): getCurrentSequence(), handleKeyInSequence(), isInSequence(), resetSequence(), SequenceState, state, Shortcut, ShortcutContext (+14 more)

### Community 10 - "Form Validation Patterns"
Cohesion: 0.08
Nodes (43): Async Validation, CheckboxField Wrapper, Context-Specificity Hierarchy, Double Submit Guard, Field Wrapper Pattern, Form Module, Form State Management, Keyboard Context Management (+35 more)

### Community 11 - "Form Hooks & Utilities"
Cohesion: 0.08
Nodes (27): useDebounce(), useFormFormik(), UseFormFormikOptions, UseFormFormikReturn, AsyncFormData, asyncValidationSchema, AsyncValidationTestForm(), DoubleSubmitTestForm() (+19 more)

### Community 12 - "Design System Rationale"
Cohesion: 0.06
Nodes (41): Client-Side Validation, ConnectionErrorModal Component, ConnectionStatusIndicator Component, Loading State, Color Semantics, Component Catalog, Layout Tokens, Design System — Linear App Clone (+33 more)

### Community 13 - "Frontend Module Docs"
Cohesion: 0.07
Nodes (34): IssuesState, Optimistic Update Interface, Realtime Module, State Module, WebSocketState, ADR Review, Auth Handshake Decision, Deduplication Decision (+26 more)

### Community 14 - "Architecture Decisions"
Cohesion: 0.09
Nodes (32): ADR-0006 Stack Selection Zustand Vite React Router Vitest, ADR-0007 Store Isolation, ARIA Live Regions, Cache-First Stale-While-Revalidate Strategy, Cache Layer with TTL, ConnectionStatusIndicator, Derived State Selectors, Event Deduplication (+24 more)

### Community 15 - "Layout & Accessibility"
Cohesion: 0.17
Nodes (31): WCAG 2.1 AA Accessibility Conformance, AppLayout Component, Backdrop Component, CSS Custom Property Theme System, Flexbox Layout Shell, Focus Management Pattern, HamburgerButton Component, Header Component (+23 more)

### Community 16 - "Architecture Decision Records"
Cohesion: 0.09
Nodes (30): Feature-Sliced Design Architecture, React Hook Form + Zod for Form Management, Stack Selection — Zustand, Vite, React Router, Vitest, Store Isolation — Separate Zustand Stores per Domain, API Error Taxonomy via Class Hierarchy, UI Component Architecture — Presentational Primitives, Dedicated Status Transition Endpoint for Issue Workflow, Dedicated Assignee Transition Endpoint for Issue Assignment (+22 more)

### Community 17 - "Auth & Mock Service Worker"
Cohesion: 0.11
Nodes (29): MSW Browser Worker Runtime, Fetch Credentials Include Pattern, Cursor-Based Pagination, HttpOnly Cookie Authentication, LocalStorage Token Removal, Centralized MSW Handlers, Per-Test Handler Override, MSW Node Server Runtime (+21 more)

### Community 18 - "Label Entity API"
Cohesion: 0.13
Nodes (12): IssueLabelsState, LabelDefinitionsState, useIssueLabelsStore, useLabelDefinitionsStore, Label, LabelBadge(), LabelBadgeProps, LabelListProps (+4 more)

### Community 19 - "Realtime Event Schemas"
Cohesion: 0.09
Nodes (24): CommentEventPayload, CommentEventType, CycleEventPayload, CycleEventType, IssueEventPayload, IssueEventType, isValidEventType(), LabelEventPayload (+16 more)

### Community 20 - "TypeScript Config"
Cohesion: 0.08
Nodes (25): DOM, DOM.Iterable, ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules (+17 more)

### Community 21 - "Event Processor"
Cohesion: 0.19
Nodes (13): cleanupEntityDedupStore(), cleanupSeenEvents(), clearDedupStore(), clearEntityDedupStore(), eventHandlers, getEntityKey(), isDuplicateEntityEvent(), lastEntityEvent (+5 more)

### Community 22 - "OpenSpec Change Archive"
Cohesion: 0.12
Nodes (24): OpenSpec Config — fix-delete-issue-response-type, ADR Review — fix-delete-issue-response-type, deleteIssue() Return Type Fix, Frontend Design — fix-delete-issue-response-type, Design System — fix-delete-issue-response-type, Proposal — fix-delete-issue-response-type, Review — fix-delete-issue-response-type, Spec: Delete Issue API Return Type (+16 more)

### Community 23 - "Package Dependencies"
Cohesion: 0.09
Nodes (23): class-variance-authority, clsx, @hookform/resolvers, lucide-react, dependencies, class-variance-authority, clsx, @hookform/resolvers (+15 more)

### Community 24 - "Issue Module Types"
Cohesion: 0.16
Nodes (23): apiClient, CacheStore, FetchIssuesParams, FetchIssuesResponse, IssueFilters, IssuesStore, labelIds Query Parameter, OpenAPI 3.1 Spec (+15 more)

### Community 25 - "Sidebar Widget"
Cohesion: 0.14
Nodes (16): useActiveRoute(), HamburgerButton, HamburgerButtonProps, MobileSidebarOverlay(), MobileSidebarOverlayProps, navItems, teams, NavLink (+8 more)

### Community 26 - "Config References"
Cohesion: 0.10
Nodes (20): ES2023, node, playwright.config.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib (+12 more)

### Community 27 - "State Module Documentation"
Cohesion: 0.21
Nodes (20): AuthGuard, AuthStore, CacheLayer, IssuesStore, Selectors, Store Architecture, StoreProvider, UIStore (+12 more)

### Community 28 - "Dev Tooling"
Cohesion: 0.11
Nodes (19): @commitlint/cli, eslint, eslint-plugin-react, husky, msw, devDependencies, @commitlint/cli, eslint (+11 more)

### Community 29 - "Client-Side State & Theming"
Cohesion: 0.15
Nodes (19): CSS Custom Properties, localStorage Persistence, matchMedia API, Page Layout Shell, React Context, Responsive Breakpoints (768/1024), Responsive Design, Theme Switching (light/dark/system) (+11 more)

### Community 30 - "Community 30"
Cohesion: 0.11
Nodes (19): Design System Concept, Frontend Schema Pipeline, Mockups Convention, Frontend Schema, ADR Template, Frontend Design Template, Design System Template, Mockups README Template (+11 more)

### Community 31 - "Community 31"
Cohesion: 0.23
Nodes (10): createWSClient(), WSClientConfig, setupEventRouter(), createHeartbeat(), DEFAULT_CONFIG, HeartbeatConfig, calculateBackoff(), DEFAULT_CONFIG (+2 more)

### Community 32 - "Community 32"
Cohesion: 0.16
Nodes (18): API Base Path Constant, Auth + Issues Mock API, ConnectionIndicator, EmptyState, ErrorBanner, HeaderBar, IssueList Component, LoadingSkeleton (+10 more)

### Community 33 - "Community 33"
Cohesion: 0.17
Nodes (17): Author-Only Access Control, CommentCard Component, CommentList Component, Delete Comment Feature, DeleteConfirmation Component, DeleteConfirmOverlay Component, Edit Comment Feature, Inline Confirmation Pattern (+9 more)

### Community 34 - "Community 34"
Cohesion: 0.21
Nodes (17): Issue Watchers, IssueDetailPage, Label Accessibility Requirements, Label Management, Optimistic Update, REST API OpenAPI Contract, Watcher Accessibility Requirements, Watcher API Endpoints (+9 more)

### Community 35 - "Community 35"
Cohesion: 0.13
Nodes (17): ConnectionErrorModal, ConnectionStatusIndicator, Design System — Realtime, IssueAssigneeSelector, IssueCard, NotificationBadge, NotificationItem, NotificationPanel (+9 more)

### Community 36 - "Community 36"
Cohesion: 0.13
Nodes (5): FetchIssuesParams, FetchIssuesResponse, CreateIssueData, PaginationCursor, UpdateIssueData

### Community 37 - "Community 37"
Cohesion: 0.18
Nodes (14): handleCommentEvent(), handleCycleEvent(), handleIssueEvent(), handleLabelEvent(), handleNotificationEvent(), handleProjectEvent(), handleUserEvent(), isAutoUpdateEnabled() (+6 more)

### Community 38 - "Community 38"
Cohesion: 0.28
Nodes (16): ADR-0011 Dedicated Assign Endpoint, BUSINESS_RULE_ERROR (422), Cache Invalidation by Prefix, changeStatus Store Action Pattern, Issue Entity, Implement PATCH /issues/{id}/assignee Endpoint Proposal, Issue Assign/Unassign Endpoint Review, Issue Assign Frontend Specification (+8 more)

### Community 39 - "Community 39"
Cohesion: 0.16
Nodes (14): ActiveFilters, Cycle, ProjectProgress, selectActiveCycle, selectFilteredIssues, selectIssuesByStatus, selectProjectProgress, selectUnreadCount (+6 more)

### Community 40 - "Community 40"
Cohesion: 0.20
Nodes (15): Issue Watchers Feature, Optimistic Update Pattern, Pessimistic Update Pattern, Toast Notifications, useWatchersStore, WatchButton Component, Watcher Type Definition, WatcherItem Component (+7 more)

### Community 41 - "Community 41"
Cohesion: 0.19
Nodes (14): AuthGuard, AuthStore, Button, Design System Tokens, ErrorBanner, LoginForm, LoginPage, React 19 + Vite + pnpm (+6 more)

### Community 42 - "Community 42"
Cohesion: 0.30
Nodes (14): react-hook-form with Zod Validation, RegisterForm, Separate API Layer Pattern, Zustand Issues Store, Issues Store ADRs, Issues Store Frontend Design, Issues Store Proposal, Issues Store Review (+6 more)

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (9): CommentList(), IssueDetailProps, priorityLabels, IssueStatusBadge(), IssueStatusBadgeProps, STATUS_OPTIONS, statusColorMap, SkeletonLoader() (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.22
Nodes (8): CreateIssueFormData, createIssueSchema, EditIssueFormData, editIssueSchema, ProfileFormData, profileSchema, ProjectSettingsFormData, projectSettingsSchema

### Community 45 - "Community 45"
Cohesion: 0.23
Nodes (9): Header(), HeaderProps, NotificationBell(), NotificationBellProps, SearchTrigger(), SearchTriggerProps, themeConfig, themeCycle (+1 more)

### Community 46 - "Community 46"
Cohesion: 0.15
Nodes (13): EventMessage, issue:{issueId} Channel, team:{teamId} Channel, user:{userId} Channel, WebSocket Gateway, Auth Endpoints, Issue Endpoints, Issue Status Transition (+5 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (13): scripts, build, dev, format, format:check, lint, lint:fix, prepare (+5 more)

### Community 48 - "Community 48"
Cohesion: 0.21
Nodes (10): AuthState, initialAuthState, useAuthStore, AuthError, LoginFormData, LoginResponse, LogoutResponse, RefreshResponse (+2 more)

### Community 49 - "Community 49"
Cohesion: 0.24
Nodes (4): Watcher, WatcherItem(), WatcherItemProps, WatcherListProps

### Community 51 - "Community 51"
Cohesion: 0.23
Nodes (12): LabelList, LabelPicker, Cache Strategy, Label Type Definition, Label API Endpoints, Label Validation Schemas, useCacheStore, useIssueLabelsStore (+4 more)

### Community 52 - "Community 52"
Cohesion: 0.23
Nodes (12): Context Management, Keyboard Shortcuts, Specificity-Based Conflict Resolution, Delete Confirmation Modal — Mockup, Keyboard Module — Mockups Index, Keyboard Settings — Mockup, Shortcut Help Modal — Mockup, Toast Notification — Mockup (+4 more)

### Community 53 - "Community 53"
Cohesion: 0.20
Nodes (12): Feature-Sliced Design, Store Isolation Pattern, Zustand State Management, Delete Comment ADR Review, Issue Watchers Tech Stack, Label Management ADR Review, Label Management Tech Stack, Edit Comment ADR Review (+4 more)

### Community 54 - "Community 54"
Cohesion: 0.27
Nodes (12): Playwright, React 19, Server-Sent Events (SSE), Tailwind CSS v4, Vite 8, Vitest, Zod, Zustand (+4 more)

### Community 55 - "Community 55"
Cohesion: 0.30
Nodes (8): Issue, issueFormFieldLabels, IssueFormSchema, IssueForm(), IssueFormProps, priorityOptions, statusOptions, IssueFormModalProps

### Community 56 - "Community 56"
Cohesion: 0.32
Nodes (8): CyclesState, useCyclesStore, Cycle, Project, WSEventPayload, WSEventType, ProjectsState, useProjectsStore

### Community 61 - "Community 61"
Cohesion: 0.29
Nodes (11): Channel Subscription, Connection Status Display, WebSocket Error Handling, Event Processing, WebSocket Authentication, WebSocket Error Toast Mockup, Header Connection Status Mockup, WebSocket UI Mockup Index (+3 more)

### Community 62 - "Community 62"
Cohesion: 0.33
Nodes (8): Comment, CommentCard(), CommentCardProps, formatTimestamp(), initials(), CommentListProps, mockComment, otherComment

### Community 63 - "Community 63"
Cohesion: 0.38
Nodes (10): ADR Review Manifest — Containerization, Docker Multi-Stage Build, nginx, Containerization Design — Frontend, Design System — Dockerfile Containerization, Proposal — Add Dockerfile for Containerization, Review — Add Dockerfile for Containerization, Tasks — Add Dockerfile for Containerization (Frontend) (+2 more)

### Community 64 - "Community 64"
Cohesion: 0.24
Nodes (7): initialFilters, initialIssuesState, IssuesState, useIssuesStore, IssueFilters, IssueFiltersProps, statusOptions

### Community 65 - "Community 65"
Cohesion: 0.25
Nodes (5): WSEvent, clearEventHandlers(), registerEventHandler(), mockLogout, mockSetLastHeartbeat

### Community 68 - "Community 68"
Cohesion: 0.25
Nodes (7): commitlint, extends, name, private, type, version, @commitlint/config-conventional

### Community 69 - "Community 69"
Cohesion: 0.32
Nodes (6): getRouteContext(), isInputElement(), KeyboardContext, KeyboardContextValue, KeyboardProvider(), KeyboardProviderProps

### Community 70 - "Community 70"
Cohesion: 0.29
Nodes (5): IssueCard(), IssueCardProps, priorityLabels, statusColors, IssueListProps

### Community 71 - "Community 71"
Cohesion: 0.29
Nodes (7): IssueAssigneeSelector Mockup, IssueCard Mockup, ProjectCard Mockup, ReconnectionToast Mockup, RevertToast Mockup, Optimistic Updates Spec, WebSocket Connection Spec

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (7): Auth Module Frontend Design, Design System, Auth Login Mockup, Auth Module Proposal, Auth Module Review, Auth Module Frontend Tasks, Auth Module User Flows

### Community 73 - "Community 73"
Cohesion: 0.29
Nodes (7): Header, PageLayout, ResponsiveDesktopLayout, ResponsiveMobileLayout, ResponsiveTabletLayout, Sidebar, ThemeToggle

### Community 74 - "Community 74"
Cohesion: 0.29
Nodes (4): OptimisticContext, OptimisticContextValue, OptimisticProviderProps, TODO: Implement optimistic update context (Phase 3)

### Community 76 - "Community 76"
Cohesion: 0.29
Nodes (4): POSITION_STYLES, Toast, TOAST_STYLES, ToastContainerProps

### Community 77 - "Community 77"
Cohesion: 0.38
Nodes (4): worker, handlers, mockIssues, server

### Community 78 - "Community 78"
Cohesion: 0.47
Nodes (6): LayoutProvider, Sidebar, ThemeToggle, Settings Mockup, Tasks Mockup, Layout Module Responsive Sidebar Theme Specification

### Community 79 - "Community 79"
Cohesion: 0.33
Nodes (6): Cycle List View Mockup, Realtime Mockups Index, Issue Detail View Mockup, Issue List View Mockup, Notification Dropdown Mockup, Project List View Mockup

### Community 80 - "Community 80"
Cohesion: 0.47
Nodes (3): App(), StoreProvider(), StoreProviderProps

### Community 81 - "Community 81"
Cohesion: 0.33
Nodes (3): WebSocketContext, WebSocketContextValue, WebSocketProviderProps

### Community 82 - "Community 82"
Cohesion: 0.47
Nodes (4): useAuth(), LoginFormData, loginSchema, useLoginForm()

### Community 83 - "Community 83"
Cohesion: 0.40
Nodes (3): WatchButton(), WatchButtonProps, WatcherSectionProps

### Community 84 - "Community 84"
Cohesion: 0.33
Nodes (3): RegisterError, RegisterPayload, RegisterResponse

### Community 85 - "Community 85"
Cohesion: 0.33
Nodes (4): CacheEntry, CacheState, DEFAULT_TTLS, useCacheStore

### Community 86 - "Community 86"
Cohesion: 0.33
Nodes (5): ConnectionStatus, initialWebSocketState, Notification, useWebSocketStore, WebSocketState

### Community 87 - "Community 87"
Cohesion: 0.40
Nodes (5): API Contract Alignment, Pagination Response Shape Fix, Query Parameter Mismatch Fix, Proposal — Fix Pagination Response Shape, Proposal — Fix Query Parameter Mismatch

### Community 88 - "Community 88"
Cohesion: 0.40
Nodes (5): IssueDetail Mockup, IssueList Mockup, NotificationPanel Mockup, ProjectList Mockup, Event Subscription Spec

### Community 89 - "Community 89"
Cohesion: 0.80
Nodes (5): Confirm Delete Dialog Mockup, Work Module Mockup Index, Issue Detail Mockup, Issue Form Modal Mockup, Issues Page Mockup

### Community 90 - "Community 90"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css}, *.{ts,tsx}, eslint --fix, prettier --write

### Community 91 - "Community 91"
Cohesion: 0.50
Nodes (3): RegisterFormData, registerSchema, useRegisterForm()

### Community 93 - "Community 93"
Cohesion: 0.50
Nodes (3): SHORTCUT_TOAST_MESSAGES, ToastContainer(), ToastContainerProps

### Community 94 - "Community 94"
Cohesion: 0.40
Nodes (3): NotificationItemData, NotificationItemProps, TYPE_ICONS

### Community 95 - "Community 95"
Cohesion: 0.40
Nodes (3): priorityOptions, projectOptions, statusOptions

### Community 96 - "Community 96"
Cohesion: 0.40
Nodes (4): initialNotificationsState, NotificationItem, NotificationsState, useNotificationsStore

### Community 97 - "Community 97"
Cohesion: 0.40
Nodes (4): Toast, ToastState, ToastVariant, useToastStore

### Community 98 - "Community 98"
Cohesion: 0.40
Nodes (4): KeyboardContext, Theme, UIState, useUIStore

### Community 99 - "Community 99"
Cohesion: 0.40
Nodes (3): ErrorBannerProps, ErrorBannerType, typeStyles

### Community 100 - "Community 100"
Cohesion: 0.50
Nodes (4): Change Metadata, OpenSpec Artifact Rules, frontend-schema, OpenSpec Schema Collection

### Community 101 - "Community 101"
Cohesion: 0.83
Nodes (4): Issue Assign Mockups Index, Issue Detail Page Mockup, Issue Form Modal Mockup, Issues List Mockup

### Community 102 - "Community 102"
Cohesion: 0.50
Nodes (4): AccessibilityConventions, LayoutRegions, ResponsiveLayout, WireframeTemplate

### Community 103 - "Community 103"
Cohesion: 0.50
Nodes (4): Dockerfile, NginxConfig, SecurityHeaders, SpaFallbackRouting

### Community 104 - "Community 104"
Cohesion: 0.67
Nodes (4): CommentCard, CommentList, DeleteConfirmOverlay, EditComment

### Community 109 - "Community 109"
Cohesion: 0.50
Nodes (3): initialWatchersState, useWatchersStore, WatchersState

### Community 113 - "Community 113"
Cohesion: 0.50
Nodes (3): ModalStackItem, ModalState, useModalStore

### Community 114 - "Community 114"
Cohesion: 0.50
Nodes (3): EndpointRateLimit, RateLimitState, useRateLimitStore

### Community 117 - "Community 117"
Cohesion: 0.67
Nodes (3): Containerized SPA Serving, Dockerfile Multi-Stage Build, Nginx Server

### Community 118 - "Community 118"
Cohesion: 0.67
Nodes (3): Delete Comment Mockups Index, Delete Comment Issue Detail Mockup, Delete Comment User Flows

### Community 119 - "Community 119"
Cohesion: 0.67
Nodes (3): Delete Comment Review, Delete Comment Frontend Spec, Delete Comment Frontend Tasks

### Community 120 - "Community 120"
Cohesion: 0.67
Nodes (3): Edit Comment Review, Edit Comment Frontend Spec, Edit Comment Frontend Tasks

### Community 121 - "Community 121"
Cohesion: 1.00
Nodes (3): Sign In — Mockup, Create Account — Mockup, Auth Pages — Mockups

### Community 122 - "Community 122"
Cohesion: 0.67
Nodes (3): LabelBadge, LabelList, LabelPicker

### Community 123 - "Community 123"
Cohesion: 0.67
Nodes (3): MswBrowser, MswHandlers, MswServer

## Knowledge Gaps
- **643 isolated node(s):** `codegraph`, `name`, `private`, `version`, `type` (+638 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **117 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Feature-Sliced Design` connect `Community 53` to `Error Handling & Auth Tokens`, `Community 34`, `Community 42`, `Architecture Decisions`, `Community 52`, `Community 54`, `Client-Side State & Theming`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `API Client Tech Stack` connect `Error Handling & Auth Tokens` to `Community 53`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Register User API ADR` connect `Community 42` to `Community 41`, `Community 53`, `Architecture Decisions`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `codegraph`, `name`, `private` to the rest of the system?**
  _643 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Error Handling & Auth Tokens` be split into smaller, more focused modules?**
  _Cohesion score 0.058496853017400964 - nodes in this community are weakly interconnected._
- **Should `Realtime & Optimistic Updates` be split into smaller, more focused modules?**
  _Cohesion score 0.06247086247086247 - nodes in this community are weakly interconnected._
- **Should `API Client Infrastructure` be split into smaller, more focused modules?**
  _Cohesion score 0.08951048951048951 - nodes in this community are weakly interconnected._