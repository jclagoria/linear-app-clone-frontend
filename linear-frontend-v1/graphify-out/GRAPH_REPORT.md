# Graph Report - .  (2026-07-30)

## Corpus Check
- 540 files · ~371,096 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2034 nodes · 3119 edges · 102 communities (68 shown, 34 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 163 edges (avg confidence: 0.82)
- Token cost: 10,000 input · 5,000 output

## Community Hubs (Navigation)
- Cycles & Optimistic Updates
- WebSocket Client & Events
- API Client Core
- Shared UI Components
- Keyboard Shortcuts
- Form Utilities
- Event Schema Types
- Label Management
- Sidebar & Navigation
- Issue API
- Selectors & Filters
- Issue Detail View
- Form Schemas & Validation
- Create Project Dialog
- Header & Notifications
- Auth Store & Login
- Watchers UI
- ApiClient Methods
- Issue Form
- Mock WebSocket Endpoints
- Mock WebSocket Endpoints
- Mock WebSocket Endpoints
- Mock WebSocket Endpoints
- Comment Card
- Issue Store & Filters
- Mock WebSocket Helpers
- Mock WebSocket Helpers
- Keyboard Provider
- Issue Card & List
- Optimistic Provider
- Mock WebSocket
- Toast Container
- MSW Mock Server
- App Bootstrap
- WebSocket Provider
- Login & Auth Hooks
- Watch Button
- Auth Registration API
- Projects API
- Cache Store
- WebSocket Store
- Register Form Hook
- Shortcuts API
- Toast Container UI
- Notification Item
- Edit Issue Page
- Notifications Store
- Toast Store
- UI Store
- Error Banner
- Register Form UI
- Delete Confirm Modal
- Comment Item
- Watchers Store
- Create Issue Page
- Modal Store
- Rate Limit Store
- Breadcrumb UI
- Confirm Delete Dialog
- Label Validation
- Team Store
- Login Form UI
- Shortcut Actions
- Keyboard Wrapper
- Notifications Hook
- Empty State UI
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 75
- Community 76
- Community 78
- Community 81
- Community 95
- Community 98

## God Nodes (most connected - your core abstractions)
1. `ApiError` - 25 edges
2. `processEvent()` - 20 edges
3. `routeEvent()` - 17 edges
4. `Issue` - 16 edges
5. `setupEventRouter()` - 16 edges
6. `useOptimisticStore` - 15 edges
7. `ApiClient` - 14 edges
8. `Label` - 12 edges
9. `createWSClient()` - 12 edges
10. `clearDedupStore()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `FetchIssuesResponse` --references--> `Issue`  [EXTRACTED]
  entities/issue/api/index.ts → entities/issue/model/types.ts
- `Issue` --references--> `IssueCardProps`  [EXTRACTED]
  entities/issue/model/types.ts → entities/issue/ui/IssueCard.tsx
- `Issue` --references--> `IssueListProps`  [EXTRACTED]
  entities/issue/model/types.ts → entities/issue/ui/IssueList.tsx
- `IssuesState` --references--> `Comment`  [EXTRACTED]
  entities/issue/model/store.ts → entities/issue/model/types.ts
- `IssuesState` --references--> `Issue`  [EXTRACTED]
  entities/issue/model/store.ts → entities/issue/model/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Frontend Stack Selection Decisions** — adr_0005_react_hook_form_zod_react_hook_form_zod, adr_0006_stack_selection_stack_selection, adr_0007_store_isolation_store_isolation, adr_0009_ui_component_architecture_ui_component_architecture [EXTRACTED 0.95]
- **Issue API Operations — Dedicated Endpoints Pattern** — adr_0010_dedicated_status_endpoint_dedicated_status_endpoint, adr_0011_dedicated_assignee_endpoint_dedicated_assignee_endpoint, adr_0012_watcher_feature_slice_watcher_feature_slice [EXTRACTED 0.95]
- **Real-time Transport Stack — SSE, WebSocket, Optimistic Updates** — adr_0013_sse_for_real_time_transport_sse_transport, adr_0014_optimistic_updates_with_rollback_optimistic_updates, docs_architecture_frontend_websocket_provider_pattern, docs_websocket_frontend_changes_async_api_alignment [EXTRACTED 0.95]
- **hyperedge_02_3_adrs** — openspec_changes_archive_2024_07_24_realtime_websocket_events_adr_md_native_websocket_adr, openspec_changes_archive_2024_07_24_realtime_websocket_events_adr_md_zustand_adr, openspec_changes_archive_2024_07_24_realtime_websocket_events_adr_md_optimistic_adr [EXTRACTED 1.00]
- **hyperedge_02_ws_lifecycle_components** — openspec_changes_archive_2024_07_24_realtime_websocket_events_design_system_md_connection_status_indicator, openspec_changes_archive_2024_07_24_realtime_websocket_events_design_system_md_reconnection_toast, openspec_changes_archive_2024_07_24_realtime_websocket_events_design_system_md_connection_error_modal [INFERRED 0.85]
- **hyperedge_02_realtime_stack** — openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_zustand_5, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_vite_8, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_typescript_6, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_native_websocket [EXTRACTED 1.00]
- **Realtime WebSocket Events Mockups** — openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_issue-assignee-selector, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_issue-card, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_issue-detail, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_issue-list, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_notification-panel, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_project-card, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_project-list, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_reconnection-toast, openspec_changes_archive_2024-07-24-realtime-websocket-events_mockups_revert-toast [EXTRACTED 1.00]
- **Realtime WebSocket Event Specs** — openspec_changes_archive_2024-07-24-realtime-websocket-events_specs_frontend_event-subscription, openspec_changes_archive_2024-07-24-realtime-websocket-events_specs_frontend_optimistic-updates, openspec_changes_archive_2024-07-24-realtime-websocket-events_specs_frontend_websocket-connection [EXTRACTED 1.00]
- **Auth Module Documentation** — openspec_changes_archive_2026-07-17-auth-module_proposal, openspec_changes_archive_2026-07-17-auth-module_design-frontend, openspec_changes_archive_2026-07-17-auth-module_design-system, openspec_changes_archive_2026-07-17-auth-module_tech-stack, openspec_changes_archive_2026-07-17-auth-module_user-flows, openspec_changes_archive_2026-07-17-auth-module_tasks-frontend, openspec_changes_archive_2026-07-17-auth-module_review, openspec_changes_archive_2026-07-17-auth-module_adr [EXTRACTED 1.00]
- **Routing Module Design Artifacts** — openspec_changes_archive_2026-07-17-routing-module_adr_md, openspec_changes_archive_2026-07-17-routing-module_design-frontend_md, openspec_changes_archive_2026-07-17-routing-module_design-system_md, openspec_changes_archive_2026-07-17-routing-module_proposal_md, openspec_changes_archive_2026-07-17-routing-module_specs_frontend_routing_md, openspec_changes_archive_2026-07-17-routing-module_tasks-frontend_md, openspec_changes_archive_2026-07-17-routing-module_tech-stack_md, openspec_changes_archive_2026-07-17-routing-module_user-flows_md [EXTRACTED 1.00]
- **Protected Route Pages** — issues_page, projects_page, cycles_page, settings_page, issue_detail_page, project_detail_page, dashboard_page [INFERRED 0.85]
- **MSW Handlers Centralization Artifacts** — openspec_changes_archive_2026-07-18-centralize-msw-handlers_adr_md, openspec_changes_archive_2026-07-18-centralize-msw-handlers_design-frontend_md, openspec_changes_archive_2026-07-18-centralize-msw-handlers_design-system_md, openspec_changes_archive_2026-07-18-centralize-msw-handlers_proposal_md [EXTRACTED 1.00]
- **MSW Handler Centralization Architecture** — concept_msw_handlers_centralized, concept_server_runtime_msw, concept_browser_runtime_msw [EXTRACTED 1.00]
- **HttpOnly Cookie Auth Flow** — concept_httponly_cookie_auth, concept_credentials_include, concept_session_hydrate, concept_silent_token_refresh [EXTRACTED 1.00]
- **State Module Architecture Foundation** — concept_zustand_stores, concept_cache_layer_ttl, concept_derived_selectors, concept_store_isolation [EXTRACTED 1.00]
- **API Client Error Handling Change Artifacts** — openspec_changes_archive_2026-07-19-api-client-error-handling_.openspec_yaml, openspec_changes_archive_2026-07-19-api-client-error-handling_adr_md, openspec_changes_archive_2026-07-19-api-client-error-handling_design-frontend_md, openspec_changes_archive_2026-07-19-api-client-error-handling_design-system_md, openspec_changes_archive_2026-07-19-api-client-error-handling_proposal_md, openspec_changes_archive_2026-07-19-api-client-error-handling_review_md, openspec_changes_archive_2026-07-19-api-client-error-handling_tasks-frontend_md, openspec_changes_archive_2026-07-19-api-client-error-handling_tech-stack_md, openspec_changes_archive_2026-07-19-api-client-error-handling_user-flows_md, openspec_changes_archive_2026-07-19-api-client-error-handling_mockups_error-banner_html, openspec_changes_archive_2026-07-19-api-client-error-handling_mockups_index_html, openspec_changes_archive_2026-07-19-api-client-error-handling_mockups_rate-limit-toast_html, openspec_changes_archive_2026-07-19-api-client-error-handling_specs_frontend_api-client_md [EXTRACTED 1.00]
- **UI Generic Components Change Artifacts** — openspec_changes_archive_2026-07-20-ui-generic-components_adr_md, openspec_changes_archive_2026-07-20-ui-generic-components_design-frontend_md, openspec_changes_archive_2026-07-20-ui-generic-components_design-system_md, openspec_changes_archive_2026-07-20-ui-generic-components_proposal_md, openspec_changes_archive_2026-07-20-ui-generic-components_review_md, openspec_changes_archive_2026-07-20-ui-generic-components_tasks-frontend_md, openspec_changes_archive_2026-07-20-ui-generic-components_tech-stack_md, openspec_changes_archive_2026-07-20-ui-generic-components_user-flows_md [EXTRACTED 1.00]
- **UI Generic Component Library** — ui_generic_button, ui_generic_text_input, ui_generic_select, ui_generic_checkbox, ui_generic_textarea, ui_generic_modal, ui_generic_card, ui_generic_toast, ui_generic_empty_state, ui_generic_spinner, ui_generic_loading_overlay [EXTRACTED 1.00]
- **UI Generic Components Library** — component_button, component_input, component_select, component_checkbox, component_textarea, component_modal, component_card, component_toast, component_emptystate, component_loadingindicator [INFERRED]
- **Issue Status Transition Feature** — feature_issue_status_transition, component_issuestatusbadge, workflow_default, concept_workflow_validation, openspec_changes_archive_2026_07_21_implement_issue_status_transition_adr_0010_dedicated_status_endpoint [INFERRED]
- **Issue Assign/Unassign Feature** — feature_issue_assign_unassign, component_issueformmodal, openspec_changes_archive_2026_07_21_implement_patch_issues_id_assignee_endpoint_adr_0011_dedicated_assignee_endpoint, concept_optimistic_update, concept_cache_invalidation [INFERRED]
- **hyperedge_assignee_endpoint_artifacts** — openspec_changes_archive_2026-07-21-implement-patch-issues-id-assignee-endpoint_proposal_md, openspec_changes_archive_2026-07-21-implement-patch-issues-id-assignee-endpoint_review_md, openspec_changes_archive_2026-07-21-implement-patch-issues-id-assignee-endpoint_tasks-frontend_md, openspec_changes_archive_2026-07-21-implement-patch-issues-id-assignee-endpoint_specs_frontend_assign-issue_md [EXTRACTED 1.00]
- **hyperedge_layout_component_tree** — app_layout_component, sidebar_component, header_component, backdrop_component, nav_link_component, team_selector_component, theme_toggle_component, notification_badge_component, sidebar_toggle_component, hamburger_button_component [EXTRACTED 1.00]
- **hyperedge_layout_module_artifacts** — openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_proposal_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_review_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_tasks-frontend_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_tech-stack_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_design-frontend_md, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_design-system_md [EXTRACTED 1.00]
- **Layout Module Change Artifacts** — openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_mockups_index, openspec_changes_archive_2026-07-21-layout-module-page-structure-theme_specs_frontend_layout-module [EXTRACTED 1.00]
- **Work Module: Issues Store & UI Change Artifacts** — openspec_changes_archive_2026-07-21-work-module-issues-store-ui_proposal, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_adr, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_design-frontend, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_design-system, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_specs_frontend_work-module-issues, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_user-flows, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_tech-stack, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_tasks-frontend, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_review, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_index, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_issues-page, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_issue-detail, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_issue-form-modal, openspec_changes_archive_2026-07-21-work-module-issues-store-ui_mockups_confirm-delete-dialog [EXTRACTED 1.00]
- **Delete Comment Change Artifacts** — openspec_changes_archive_2026-07-22-delete-comment_proposal, openspec_changes_archive_2026-07-22-delete-comment_adr, openspec_changes_archive_2026-07-22-delete-comment_design-frontend, openspec_changes_archive_2026-07-22-delete-comment_design-system [EXTRACTED 1.00]
- **Author-Only Components** — concept_commentcard_component, concept_author_only_access_control, concept_delete_comment_feature, concept_edit_comment_feature [INFERRED 0.85]
- **Tech Stack Dependencies** — concept_vite_8 [EXTRACTED 1.00]
- **IssueDetailPage Features** — concept_issuedetailpage, concept_delete_comment_feature, concept_edit_comment_feature, concept_issue_watchers_feature [EXTRACTED 1.00]
- **Watcher UI Component Composition** — concept_watchersection_component, concept_watchbutton_component, concept_watcherlist_component, concept_watcheritem_component [EXTRACTED 1.00]
- **Label UI Component Composition** — component_labelbadge, componentLabellist, component_labelpicker, component_toast [EXTRACTED 1.00]
- **Design System Token Categories** — concept_layout_tokens, concept_typography_tokens, concept_color_semantics [EXTRACTED 1.00]
- **** — openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_.openspec.yaml, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_adr.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_design-frontend.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_design-system.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_proposal.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_review.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_tasks-frontend.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_tech-stack.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_user-flows.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_mockups_readme.md, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_specs_frontend_delete-issue-api.md [EXTRACTED 1.00]
- **** — src_entities_issue_api_index.ts, src_entities_issue_model_types.ts, openspec_changes_archive_2026-07-23-fix-delete-issue-response-type_delete_issue_return_type_fix, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_issue_model_alignment [INFERRED 0.75]
- **** — openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_.openspec.yaml, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_adr.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_design-frontend.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_design-system.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_proposal.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_review.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_tasks-frontend.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_tech-stack.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_user-flows.md, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_mockups_index.html, openspec_changes_archive_2026-07-23-fix-issue-model-missing-fields_specs_frontend_issue-model.md [EXTRACTED 1.00]
- **Issue Module Files** — src_entities_issue_api_index_ts, src_entities_issue_model_store_ts, src_entities_issue_model_types_ts, src_entities_issue_ui_issuefilters_tsx, src_pages_issuespage_tsx [INFERRED 0.85]
- **OpenSpec Change Artifacts** — concept_pagination_shape_fix, concept_query_param_mismatch_fix, concept_api_contract_alignment [INFERRED 0.75]
- **API Contract Alignment Concepts** — concept_statusid_param, concept_labelids_param, concept_openapi_spec, concept_fetchissuesparams_type [INFERRED 0.85]
- **** — concept_textfield_wrapper, concept_selectfield_wrapper, concept_checkboxfield_wrapper, concept_textareafield_wrapper [EXTRACTED 1.00]
- **** — concept_form_module, concept_validation_system, concept_submission_flow, concept_field_wrapper_pattern, concept_form_state_management [EXTRACTED 1.00]
- **** — concept_keyboard_module, concept_keyboard_shortcut_registry, concept_keyboard_context_management, concept_context_specificity, concept_keyboard_store [EXTRACTED 1.00]
- **Keyboard Module Spec Requirements** — concept_keyboard_shortcuts, concept_context_management, concept_specificity_based_conflict_resolution [INFERRED 1.00]
- **Shared Tech Stack Decisions (LAG-29 and Layout Module)** — concept_vitest [INFERRED 0.95]
- **Layout Module ADR Decisions** — concept_react_context, concept_css_custom_properties, concept_matchmedia_api, concept_localstorage_persistence [INFERRED 1.00]
- **Layout Module Components** — concept_layout_provider, concept_sidebar, concept_theme_toggle [EXTRACTED 1.00]
- **Realtime Event Processing Stack** — concept_sse_transport, concept_optimistic_updates, concept_event_deduplication [INFERRED 0.85]
- **Realtime Mockup Collection** — openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_index_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_issue_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_issue_detail_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_project_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_cycle_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_notification_dropdown_html [EXTRACTED 1.00]
- **** — openspec_changes_archive_2026_07_28_implement_register_user_api_mockups_auth_login_html, openspec_changes_archive_2026_07_28_implement_register_user_api_mockups_auth_register_html, openspec_changes_archive_2026_07_28_implement_register_user_api_mockups_index_html [EXTRACTED 1.00]
- **** — openspec_changes_archive_2026_07_28_implement_register_user_api_design_system_md, openspec_changes_archive_2026_07_28_implement_register_user_api_specs_frontend_register_user_spec_md, openspec_changes_archive_2026_07_28_implement_register_user_api_user_flows_md [INFERRED 0.75]
- **** — openspec_changes_archive_2026-07-28-ws-frontend-asyncapi-align_ws-frontend-asyncapi-align_mockups_error-toast, openspec_changes_archive_2026-07-28-ws-frontend-asyncapi-align_ws-frontend-asyncapi-align_mockups_header-status, openspec_changes_archive_2026-07-28-ws-frontend-asyncapi-align_ws-frontend-asyncapi-align_mockups_issue-board, openspec_changes_archive_2026-07-28-ws-frontend-asyncapi-align_ws-frontend-asyncapi-align_mockups_notification-panel [INFERRED 0.75]
- **** — openspec_changes_archive_2026_07_28_ws_frontend_asyncapi_align_ws_frontend_asyncapi_align_adr_md, openspec_changes_archive_2026_07_28_ws_frontend_asyncapi_align_ws_frontend_asyncapi_align_design_frontend_md, openspec_changes_archive_2026_07_28_ws_frontend_asyncapi_align_ws_frontend_asyncapi_align_design_system_md [INFERRED 0.85]
- **** — concept_websocket_authentication, concept_channel_subscription, concept_event_processing, concept_error_handling, concept_connection_status_display [EXTRACTED 1.00]
- **** — openspec_schemas_frontend-schema_templates_technology_stack-templates, openspec_schemas_frontend-schema_templates_technology_architecture-templates, openspec_schemas_frontend-schema_templates_technology_deployment-templates [EXTRACTED 1.00]
- **Comment CRUD operations** — openspec_specs_frontend_delete-comment_md_commentcard, openspec_specs_frontend_delete-comment_md_commentlist, openspec_specs_frontend_edit-comment_md_editcomment, openspec_specs_frontend_delete-comment_md_deleteconfirmoverlay [INFERRED 0.85]
- **Form Module subsystem boundary** — openspec_specs_frontend_formstate_spec_md, openspec_specs_frontend_validation_spec_md, openspec_specs_frontend_submission_spec_md, openspec_specs_frontend_fieldwrappers_spec_md [INFERRED 0.85]
- **Optimistic update pattern** — openspec_specs_frontend_optimistic-updates_md_optimisticupdatemanager, openspec_specs_frontend_optimistic-updates_md_optimisticupdateprovider, openspec_specs_frontend_optimistic-updates_md_useoptimisticupdate, openspec_specs_frontend_optimistic-updates_md_reverttoast [EXTRACTED 1.00]
- **WebSocket event handlers** — openspec_specs_frontend_realtime-events_md_issueeventhandler, openspec_specs_frontend_realtime-events_md_commenteventhandler, openspec_specs_frontend_realtime-events_md_projecteventhandler, openspec_specs_frontend_realtime-events_md_cycleeventhandler, openspec_specs_frontend_realtime-events_md_notificationeventhandler [EXTRACTED 1.00]
- **Client-side store layer** — openspec_specs_frontend_storearchitecture_md, openspec_specs_frontend_uistore_md, openspec_specs_frontend_websocketstore_md [INFERRED 0.85]
- **UI input primitive components** — openspec_specs_frontend_uigenericcomponents_md_button, openspec_specs_frontend_uigenericcomponents_md_input, openspec_specs_frontend_uigenericcomponents_md_select, openspec_specs_frontend_uigenericcomponents_md_checkbox, openspec_specs_frontend_uigenericcomponents_md_textarea [EXTRACTED 1.00]
- **SVG Icons Group** — src_shared_assets_icons_trash_svg, src_shared_assets_icons_x_svg [INFERRED 0.85]
- **ADR Constellation Governing Frontend Features** — openspec_changes_archive_2026_07_22_label_management_endpoints_adr_stack_selection, openspec_changes_archive_2026_07_22_label_management_endpoints_adr_store_isolation, openspec_changes_archive_2026_07_29_list_projects_api_adr_error_taxonomy, openspec_changes_archive_2026_07_29_list_projects_api_adr_ui_component_arch, openspec_changes_archive_2026_07_30_create_project_api_adr_feature_sliced, openspec_changes_archive_2026_07_30_create_project_api_adr_rhf_zod, openspec_changes_archive_2026_07_30_create_project_api_adr_optimistic [EXTRACTED 1.00]
- **Tech Stack Decisions** — react_vite, tailwind_css, zod_validation, react_router, fetch_api_client, zustand_store, react_hook_form [EXTRACTED 1.00]
- **Create Project Feature** — openspec_changes_archive_2026_07_30_create_project_api_proposal_md_create_project_api_function, openspec_changes_archive_2026_07_30_create_project_api_proposal_md_useprojectsstore, openspec_changes_archive_2026_07_30_create_project_api_proposal_md_projectform, openspec_changes_archive_2026_07_30_create_project_api_proposal_md_createdprojectdialog, openspec_changes_archive_2026_07_30_create_project_api_proposal_md_projects_page [EXTRACTED 1.00]
- **Org Sidebar Feature** — openspec_changes_consume_teams_api_and_render_org_sidebar_proposal_md_orgsidebar_widget, openspec_changes_consume_teams_api_and_render_org_sidebar_proposal_md_team_store, openspec_changes_consume_teams_api_and_render_org_sidebar_proposal_md_use_teams_hook, openspec_changes_consume_teams_api_and_render_org_sidebar_proposal_md_fetchmyteams, openspec_changes_consume_teams_api_and_render_org_sidebar_proposal_md_team_entity, openspec_changes_consume_teams_api_and_render_org_sidebar_proposal_md_orgsection_component, openspec_changes_consume_teams_api_and_render_org_sidebar_proposal_md_teamitem_component [EXTRACTED 1.00]

## Communities (102 total, 34 thin omitted)

### Community 0 - "Cycles & Optimistic Updates"
Cohesion: 0.06
Nodes (47): CyclesState, useCyclesStore, Cycle, Project, OptimisticUpdate, applyOptimistic(), ApplyOptimisticOptions, checkStaleUpdates() (+39 more)

### Community 1 - "WebSocket Client & Events"
Cohesion: 0.07
Nodes (43): WSEvent, WSEventType, createWSClient(), WSClientConfig, cleanupEntityDedupStore(), cleanupSeenEvents(), clearDedupStore(), clearEntityDedupStore() (+35 more)

### Community 2 - "API Client Core"
Cohesion: 0.09
Nodes (35): ApiClientConfig, RequestInterceptor, RequestMethod, RequestOptions, ResponseInterceptor, dispatchTable, dispatchToHandler(), ErrorHandler (+27 more)

### Community 3 - "Shared UI Components"
Cohesion: 0.06
Nodes (32): Button, ButtonProps, ButtonSize, ButtonVariant, sizeStyles, variantStyles, Card(), CardProps (+24 more)

### Community 4 - "Keyboard Shortcuts"
Cohesion: 0.08
Nodes (22): getCurrentSequence(), handleKeyInSequence(), isInSequence(), resetSequence(), SequenceState, state, Shortcut, ShortcutContext (+14 more)

### Community 5 - "Form Utilities"
Cohesion: 0.08
Nodes (27): useDebounce(), useFormFormik(), UseFormFormikOptions, UseFormFormikReturn, AsyncFormData, asyncValidationSchema, AsyncValidationTestForm(), DoubleSubmitTestForm() (+19 more)

### Community 6 - "Event Schema Types"
Cohesion: 0.09
Nodes (25): CommentEventPayload, CommentEventType, CycleEventPayload, CycleEventType, IssueEventPayload, IssueEventType, isValidEventType(), LabelEventPayload (+17 more)

### Community 7 - "Label Management"
Cohesion: 0.13
Nodes (12): IssueLabelsState, LabelDefinitionsState, useIssueLabelsStore, useLabelDefinitionsStore, Label, LabelBadge(), LabelBadgeProps, LabelListProps (+4 more)

### Community 8 - "Sidebar & Navigation"
Cohesion: 0.14
Nodes (16): useActiveRoute(), HamburgerButton, HamburgerButtonProps, MobileSidebarOverlay(), MobileSidebarOverlayProps, navItems, teams, NavLink (+8 more)

### Community 9 - "Issue API"
Cohesion: 0.13
Nodes (5): FetchIssuesParams, FetchIssuesResponse, CreateIssueData, PaginationCursor, UpdateIssueData

### Community 10 - "Selectors & Filters"
Cohesion: 0.16
Nodes (14): ActiveFilters, Cycle, ProjectProgress, selectActiveCycle, selectFilteredIssues, selectIssuesByStatus, selectProjectProgress, selectUnreadCount (+6 more)

### Community 11 - "Issue Detail View"
Cohesion: 0.18
Nodes (9): CommentList(), IssueDetailProps, priorityLabels, IssueStatusBadge(), IssueStatusBadgeProps, STATUS_OPTIONS, statusColorMap, SkeletonLoader() (+1 more)

### Community 12 - "Form Schemas & Validation"
Cohesion: 0.22
Nodes (8): CreateIssueFormData, createIssueSchema, EditIssueFormData, editIssueSchema, ProfileFormData, profileSchema, ProjectSettingsFormData, projectSettingsSchema

### Community 13 - "Create Project Dialog"
Cohesion: 0.24
Nodes (7): CreateProjectFormSchema, createProjectSchema, mockProject, CreateProjectDialog(), CreateProjectDialogProps, ProjectForm(), ProjectFormProps

### Community 14 - "Header & Notifications"
Cohesion: 0.23
Nodes (9): Header(), HeaderProps, NotificationBell(), NotificationBellProps, SearchTrigger(), SearchTriggerProps, themeConfig, themeCycle (+1 more)

### Community 15 - "Auth Store & Login"
Cohesion: 0.21
Nodes (10): AuthState, initialAuthState, useAuthStore, AuthError, LoginFormData, LoginResponse, LogoutResponse, RefreshResponse (+2 more)

### Community 16 - "Watchers UI"
Cohesion: 0.24
Nodes (4): Watcher, WatcherItem(), WatcherItemProps, WatcherListProps

### Community 18 - "Issue Form"
Cohesion: 0.30
Nodes (8): Issue, issueFormFieldLabels, IssueFormSchema, IssueForm(), IssueFormProps, priorityOptions, statusOptions, IssueFormModalProps

### Community 23 - "Comment Card"
Cohesion: 0.33
Nodes (8): Comment, CommentCard(), CommentCardProps, formatTimestamp(), initials(), CommentListProps, mockComment, otherComment

### Community 24 - "Issue Store & Filters"
Cohesion: 0.24
Nodes (7): initialFilters, initialIssuesState, IssuesState, useIssuesStore, IssueFilters, IssueFiltersProps, statusOptions

### Community 27 - "Keyboard Provider"
Cohesion: 0.32
Nodes (6): getRouteContext(), isInputElement(), KeyboardContext, KeyboardContextValue, KeyboardProvider(), KeyboardProviderProps

### Community 28 - "Issue Card & List"
Cohesion: 0.29
Nodes (5): IssueCard(), IssueCardProps, priorityLabels, statusColors, IssueListProps

### Community 29 - "Optimistic Provider"
Cohesion: 0.29
Nodes (4): OptimisticContext, OptimisticContextValue, OptimisticProviderProps, TODO: Implement optimistic update context (Phase 3)

### Community 31 - "Toast Container"
Cohesion: 0.29
Nodes (4): POSITION_STYLES, Toast, TOAST_STYLES, ToastContainerProps

### Community 32 - "MSW Mock Server"
Cohesion: 0.38
Nodes (4): worker, handlers, mockIssues, server

### Community 33 - "App Bootstrap"
Cohesion: 0.47
Nodes (3): App(), StoreProvider(), StoreProviderProps

### Community 34 - "WebSocket Provider"
Cohesion: 0.33
Nodes (3): WebSocketContext, WebSocketContextValue, WebSocketProviderProps

### Community 35 - "Login & Auth Hooks"
Cohesion: 0.47
Nodes (4): useAuth(), LoginFormData, loginSchema, useLoginForm()

### Community 36 - "Watch Button"
Cohesion: 0.40
Nodes (3): WatchButton(), WatchButtonProps, WatcherSectionProps

### Community 37 - "Auth Registration API"
Cohesion: 0.33
Nodes (3): RegisterError, RegisterPayload, RegisterResponse

### Community 38 - "Projects API"
Cohesion: 0.33
Nodes (3): CreateProjectPayload, PaginatedResponse, ProjectListParams

### Community 39 - "Cache Store"
Cohesion: 0.33
Nodes (4): CacheEntry, CacheState, DEFAULT_TTLS, useCacheStore

### Community 40 - "WebSocket Store"
Cohesion: 0.33
Nodes (5): ConnectionStatus, initialWebSocketState, Notification, useWebSocketStore, WebSocketState

### Community 41 - "Register Form Hook"
Cohesion: 0.50
Nodes (3): RegisterFormData, registerSchema, useRegisterForm()

### Community 43 - "Toast Container UI"
Cohesion: 0.50
Nodes (3): SHORTCUT_TOAST_MESSAGES, ToastContainer(), ToastContainerProps

### Community 44 - "Notification Item"
Cohesion: 0.40
Nodes (3): NotificationItemData, NotificationItemProps, TYPE_ICONS

### Community 45 - "Edit Issue Page"
Cohesion: 0.40
Nodes (3): priorityOptions, projectOptions, statusOptions

### Community 46 - "Notifications Store"
Cohesion: 0.40
Nodes (4): initialNotificationsState, NotificationItem, NotificationsState, useNotificationsStore

### Community 47 - "Toast Store"
Cohesion: 0.40
Nodes (4): Toast, ToastState, ToastVariant, useToastStore

### Community 48 - "UI Store"
Cohesion: 0.40
Nodes (4): KeyboardContext, Theme, UIState, useUIStore

### Community 49 - "Error Banner"
Cohesion: 0.40
Nodes (3): ErrorBannerProps, ErrorBannerType, typeStyles

### Community 54 - "Watchers Store"
Cohesion: 0.50
Nodes (3): initialWatchersState, useWatchersStore, WatchersState

### Community 57 - "Modal Store"
Cohesion: 0.50
Nodes (3): ModalStackItem, ModalState, useModalStore

### Community 58 - "Rate Limit Store"
Cohesion: 0.50
Nodes (3): EndpointRateLimit, RateLimitState, useRateLimitStore

## Knowledge Gaps
- **562 isolated node(s):** `StoreProviderProps`, `KeyboardContextValue`, `KeyboardContext`, `KeyboardProviderProps`, `OptimisticContextValue` (+557 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `StoreProviderProps`, `KeyboardContextValue`, `KeyboardContext` to the rest of the system?**
  _562 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Cycles & Optimistic Updates` be split into smaller, more focused modules?**
  _Cohesion score 0.056140350877192984 - nodes in this community are weakly interconnected._
- **Should `WebSocket Client & Events` be split into smaller, more focused modules?**
  _Cohesion score 0.07433489827856025 - nodes in this community are weakly interconnected._
- **Should `API Client Core` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Shared UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.060129509713228495 - nodes in this community are weakly interconnected._
- **Should `Keyboard Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.07928118393234672 - nodes in this community are weakly interconnected._
- **Should `Form Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.07781649245063879 - nodes in this community are weakly interconnected._