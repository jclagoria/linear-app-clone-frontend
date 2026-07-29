# Graph Report - .  (2026-07-29)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2105 nodes · 3115 edges · 270 communities (150 shown, 120 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 159 edges (avg confidence: 0.82)
- Token cost: 7,945 input · 3,126 output

## Graph Freshness
- Built from commit: `8e7d8c9b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Optimistic Update Manager
- API Client Infrastructure
- UI Component Library
- Issue Data Stores
- App Layout System
- Auth and Error Handling
- Base UI Components
- Issue API Integration
- Keyboard Shortcut Module
- Keyboard Sequence Logic
- Form Validation Hooks
- Design System Specifications
- Auth and Page Routing
- Frontend Architecture ADRs
- Feature-Sliced Design Patterns
- Form Management System
- Realtime State Management
- Auth and Project Setup
- MSW Mocking Infrastructure
- Label Management Store
- Realtime Event Schemas
- TypeScript Configuration
- Event Deduplication Logic
- API Specification Fixes
- Sidebar Navigation Components
- Build and Test Config
- Generic UI Components
- Development Dependencies
- Documentation Templates
- WebSocket Client Logic
- Mock API Environment
- Comment Management Features
- Core Project Dependencies
- Realtime UI Indicators
- Issue API Services
- Realtime Event Router
- Issue Assignment Logic
- Issue Watcher Features
- Tech Stack Selection
- State Selectors and Memoization
- API Error Interceptors
- Issue Detail Components
- Form Data Schemas
- Header and Navigation
- Issue Watcher Components
- Frontend Tech Stack
- WebSocket Channel Architecture
- NPM Scripts
- Auth Session Store
- Watcher API and UI
- API Client Methods
- Architecture and ADRs
- Keyboard Module Design
- Issue Form Components
- Cycle and Project Stores
- WebSocket Mock Server
- WebSocket Mock Server
- WebSocket Mock Server
- WebSocket Mock Server
- WebSocket UI Specifications
- Comment UI Components
- Label Management Design
- Component Design System
- Docker Containerization
- Issue Filter Store
- Commitlint Configuration
- Error Handling UI
- Architecture Decision Records
- Event Handler Testing
- WebSocket Mocking Utility
- WebSocket Mocking Utility
- Project Management Module
- Keyboard Context Provider
- Issue List Components
- Realtime UI Mockups
- Auth Module Design
- Layout Shell Components
- Optimistic Update Context
- WebSocket Mocking Utility
- Toast Notification System
- MSW Worker Setup
- Layout and Sidebar Design
- Feature View Mockups
- App Entry Point
- WebSocket Context Provider
- Auth and Login Hooks
- Watcher UI Components
- User Registration API
- Cache Store Logic
- WebSocket State Store
- API Contract Proposals
- Event Subscription Mockups
- Store Architecture Design
- Issue Management Mockups
- Lint and Format Config
- Registration Form Logic
- Shortcut API Services
- Shortcut Toast UI
- Notification UI Components
- Issue Editing Page
- Notification Store
- Toast Notification Store
- UI State Management
- Error Banner Component
- Schema and Metadata
- Issue Management Mockups
- Layout and Accessibility
- Deployment Configuration
- Comment Management UI
- Registration Form
- Delete Confirmation Modal
- Comment Item Component
- Watchers State Management
- Issue Creation Page
- Project API Services
- SVG Icon Assets
- Modal Stack Store
- Rate Limit Management
- Breadcrumb Navigation
- MCP Configuration
- Docker Nginx Setup
- Delete Comment Mockups
- Delete Comment Planning
- Edit Comment Planning
- Auth Page Mockups
- Label Management UI
- MSW Mock Server
- Delete Confirmation Dialog
- Label Validation Schemas
- Team State Management
- Login Form Component
- Keyboard Shortcut Actions
- Keyboard Shortcut Provider
- Notification Hook
- Empty State Component
- Theme Selection UI
- Comment Thread Page
- Issue Board Page
- Projects Overview Page
- Registration Page
- Theme Management Hook
- Rate Limit Toast
- Vite Environment Types
- TypeScript Configuration
- Optimistic UI Updates
- Auth State Module
- ESLint Configuration
- ESLint TS Resolver
- ESLint Core Config
- ESLint Boundary Rules
- ESLint React Plugin
- ESLint Hooks Plugin
- Husky Git Hooks
- Lint Staged Config
- Task Implementation Review
- Auth Architecture ADRs
- Edit Comment Mockups
- Watcher UI Components
- Playwright Testing
- Prettier Formatting
- Tailwind Vite Plugin
- Testing Library Events
- Node Type Definitions
- React Type Definitions
- TypeScript ESLint Plugin
- Vite Build Tool
- Vitest Testing Framework
- App Router Configuration
- Project Page Tests
- Test Setup Configuration
- Label Accessibility
- Label List States
- Label Badge Accessibility
- Label Badge States
- Label Picker Accessibility
- Label Picker States
- Toast UI States
- Label Badge Component
- API Module
- Form Module
- Keyboard Module
- Layout Module
- Routing Module
- UI Module
- Work Module
- User Flows
- Auth API Specification
- State Module Mockups
- Auth Store Specification
- Docker Containerization Mockups
- Issue Status Specification
- Issue Status Mockups
- Issue Status Review
- Assignee API Specification
- Issue Assignment Logic
- Issue Assignment Stack
- Issue Assignment Flows
- Layout Specification Config
- Work Module UI
- Delete Comment Config
- Issue Response Mockups
- Issue Model Mockups
- Pagination Response ADR
- Pagination Design System
- Pagination API Specification
- Pagination Response Review
- Pagination Tech Selection
- Pagination Mockups
- Query Parameter ADR
- Query Parameter Design
- Query Parameter Specification
- Query Parameter Review
- Query Parameter Tech
- Query Parameter Mockups
- Form Validation Metadata
- Keyboard Implementation Metadata
- Layout Specification
- Layout Theme Review
- Responsive Layout Tasks
- Realtime Updates Specification
- User Registration Specification
- Edit Comment Specification
- Issue Watchers Specification
- WebSocket Layout Mockups
- WebSocket Comment Mockups
- WebSocket Error Mockups
- Design System Clone
- Project List Proposal
- Frontend Tech Selection
- Project List Flows

## God Nodes (most connected - your core abstractions)
1. `ApiError` - 24 edges
2. `processEvent()` - 20 edges
3. `compilerOptions` - 19 edges
4. `Layout Module Frontend Design` - 18 edges
5. `Layout Module Design System` - 18 edges
6. `routeEvent()` - 17 edges
7. `React 19` - 17 edges
8. `Fix: Create Issue Missing teamId` - 17 edges
9. `Issue` - 16 edges
10. `setupEventRouter()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `zustand` --implements--> `IssuesStore`  [INFERRED]
  package.json → openspec/changes/archive/2026-07-23-fix-pagination-response-shape/specs/frontend/pagination-response-shape.md
- `Assignee Endpoint Frontend Design` --uses--> `react-hook-form`  [EXTRACTED]
  openspec/changes/archive/2026-07-21-implement-patch-issues-id-assignee-endpoint/design-frontend.md → package.json
- `Form Module ADR Review Manifest` --references--> `react-hook-form`  [EXTRACTED]
  openspec/changes/archive/2026-07-24-form-validation-submission/adr.md → package.json
- `Tech Selection — Linear App Clone (Frontend)` --decides--> `react-hook-form`  [EXTRACTED]
  openspec/changes/archive/2026-07-25-lag-29-implementation/tech-stack.md → package.json
- `RateLimitStore` --implemented_with--> `zustand`  [EXTRACTED]
  openspec/changes/archive/2026-07-19-api-client-error-handling/design-frontend.md → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Frontend Technology Stack** — openspec_changes_list_projects_api_tech_stack_md, openspec_changes_list_projects_api_adr_md [EXTRACTED 0.90]
- **Frontend Stack Selection Decisions** — adr_0005_react_hook_form_zod_react_hook_form_zod, adr_0006_stack_selection_stack_selection, adr_0007_store_isolation_store_isolation, adr_0009_ui_component_architecture_ui_component_architecture [EXTRACTED 0.95]
- **Issue API Operations — Dedicated Endpoints Pattern** — adr_0010_dedicated_status_endpoint_dedicated_status_endpoint, adr_0011_dedicated_assignee_endpoint_dedicated_assignee_endpoint, adr_0012_watcher_feature_slice_watcher_feature_slice [EXTRACTED 0.95]
- **Real-time Transport Stack — SSE, WebSocket, Optimistic Updates** — adr_0013_sse_for_real_time_transport_sse_transport, adr_0014_optimistic_updates_with_rollback_optimistic_updates, docs_architecture_frontend_websocket_provider_pattern, docs_websocket_frontend_changes_async_api_alignment [EXTRACTED 0.95]
- **hyperedge_02_realtime_stack** — openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_zustand_5, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_vite_8, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_typescript_6, openspec_changes_archive_2024_07_24_realtime_websocket_events_docs_stack_frontend_md_native_websocket [EXTRACTED 1.00]
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
- **Domain State Stores (AuthStore, IssuesStore, UIStore, WebSocketStore)** — openspec_changes_archive_2026-07-18-state-module-cache-selectors_concept_authstore [EXTRACTED 1.00]
- **Cache Mechanisms (TTL, LRU, Stale-While-Revalidate)** — openspec_changes_archive_2026-07-18-state-module-cache-selectors_concept_cachelayer, openspec_changes_archive_2026-07-18-state-module-cache-selectors_tasks-frontend_md [EXTRACTED 1.00]
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
- **IssueDetailPage Features** — concept_issuedetailpage, concept_delete_comment_feature, concept_edit_comment_feature, concept_issue_watchers_feature [EXTRACTED 1.00]
- **Tech Stack Dependencies** — concept_vite_8 [EXTRACTED 1.00]
- **Author-Only Components** — concept_commentcard_component, concept_author_only_access_control, concept_delete_comment_feature, concept_edit_comment_feature [INFERRED 0.85]
- **fix-api-client-inconsistency documents** — openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_openspec_yaml_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_adr_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_design-frontend_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_design-system_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_proposal_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_review_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_tasks-frontend_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_tech-stack_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_user-flows_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_mockups_no-changes_doc, openspec_changes_archive_2026-07-23-fix-api-client-inconsistency_specs_frontend_api-client-consistency_doc [INFERRED]
- **fix-create-issue-teamid documents** — openspec_changes_archive_2026-07-23-fix-create-issue-teamid_openspec_yaml_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_adr_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_design-frontend_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_design-system_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_proposal_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_review_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_tasks-frontend_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_tech-stack_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_user-flows_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_mockups_index_doc, openspec_changes_archive_2026-07-23-fix-create-issue-teamid_specs_frontend_issue-creation_doc [INFERRED]
- **API infrastructure layer** — concept_apiclient_singleton, concept_auth_token_injection, concept_401_auto_refresh, concept_cache_before_fetch [INFERRED]
- **Issue Module Files** — src_entities_issue_api_index_ts, src_entities_issue_model_store_ts, src_entities_issue_model_types_ts, src_entities_issue_ui_issuefilters_tsx, src_pages_issuespage_tsx [INFERRED 0.85]
- **OpenSpec Change Artifacts** — concept_pagination_shape_fix, concept_query_param_mismatch_fix, concept_api_contract_alignment [INFERRED 0.75]
- **API Contract Alignment Concepts** — concept_statusid_param, concept_labelids_param, concept_openapi_spec, concept_fetchissuesparams_type [INFERRED 0.85]
- **Shared Tech Stack Decisions (LAG-29 and Layout Module)** — concept_vitest [INFERRED 0.95]
- **Layout Module ADR Decisions** — concept_react_context, concept_css_custom_properties, concept_matchmedia_api, concept_localstorage_persistence [INFERRED 1.00]
- **Keyboard Module Spec Requirements** — concept_keyboard_shortcuts, concept_context_management, concept_specificity_based_conflict_resolution [INFERRED 1.00]
- **Realtime Event Processing Stack** — concept_sse_transport, concept_optimistic_updates, concept_event_deduplication [INFERRED 0.85]
- **Realtime Mockup Collection** — openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_index_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_issue_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_issue_detail_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_project_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_cycle_list_html, openspec_changes_archive_2026-07-26-realtime-issue-updates_mockups_notification_dropdown_html [EXTRACTED 1.00]
- **Layout Module Components** — concept_layout_provider, concept_sidebar, concept_theme_toggle [EXTRACTED 1.00]
- **Comment CRUD operations** — openspec_specs_frontend_delete-comment_md_commentcard, openspec_specs_frontend_delete-comment_md_commentlist, openspec_specs_frontend_edit-comment_md_editcomment, openspec_specs_frontend_delete-comment_md_deleteconfirmoverlay [INFERRED 0.85]
- **Optimistic update pattern** — openspec_specs_frontend_optimistic-updates_md_optimisticupdatemanager, openspec_specs_frontend_optimistic-updates_md_optimisticupdateprovider, openspec_specs_frontend_optimistic-updates_md_useoptimisticupdate, openspec_specs_frontend_optimistic-updates_md_reverttoast [EXTRACTED 1.00]
- **WebSocket event handlers** — openspec_specs_frontend_realtime-events_md_issueeventhandler, openspec_specs_frontend_realtime-events_md_commenteventhandler, openspec_specs_frontend_realtime-events_md_projecteventhandler, openspec_specs_frontend_realtime-events_md_cycleeventhandler, openspec_specs_frontend_realtime-events_md_notificationeventhandler [EXTRACTED 1.00]
- **Form Module subsystem boundary** — openspec_specs_frontend_formstate_spec_md, openspec_specs_frontend_validation_spec_md, openspec_specs_frontend_submission_spec_md, openspec_specs_frontend_fieldwrappers_spec_md [INFERRED 0.85]
- **UI input primitive components** — openspec_specs_frontend_uigenericcomponents_md_button, openspec_specs_frontend_uigenericcomponents_md_input, openspec_specs_frontend_uigenericcomponents_md_select, openspec_specs_frontend_uigenericcomponents_md_checkbox, openspec_specs_frontend_uigenericcomponents_md_textarea [EXTRACTED 1.00]
- **Client-side store layer** — openspec_specs_frontend_storearchitecture_md, openspec_specs_frontend_uistore_md, openspec_specs_frontend_websocketstore_md [INFERRED 0.85]
- **SVG Icons Group** — src_shared_assets_icons_trash_svg, src_shared_assets_icons_x_svg [INFERRED 0.85]

## Communities (270 total, 120 thin omitted)

### Community 0 - "Optimistic Update Manager"
Cohesion: 0.06
Nodes (41): OptimisticUpdate, applyOptimistic(), ApplyOptimisticOptions, checkStaleUpdates(), createOptimisticUpdate(), onRevertEvent(), onStaleRevert(), RevertListener (+33 more)

### Community 1 - "API Client Infrastructure"
Cohesion: 0.09
Nodes (35): ApiClientConfig, RequestInterceptor, RequestMethod, RequestOptions, ResponseInterceptor, dispatchTable, dispatchToHandler(), ErrorHandler (+27 more)

### Community 2 - "UI Component Library"
Cohesion: 0.07
Nodes (55): LabelList, Button, Card, Checkbox, EmptyState, ErrorBanner Component, Input, IssueFormModal (+47 more)

### Community 3 - "Issue Data Stores"
Cohesion: 0.08
Nodes (50): CacheStore, FetchIssuesParams, FetchIssuesResponse, IssueFilters, IssuesStore, labelIds Query Parameter, OpenAPI 3.1 Spec, PaginationCursor (+42 more)

### Community 4 - "App Layout System"
Cohesion: 0.09
Nodes (49): WCAG 2.1 AA Accessibility Conformance, AppLayout Component, Backdrop Component, CSS Custom Properties, localStorage Persistence, matchMedia API, Page Layout Shell, React Context (+41 more)

### Community 5 - "Auth and Error Handling"
Cohesion: 0.04
Nodes (48): Cache Invalidation, ApiClient, ApiError, ErrorHandler, ErrorTaxonomy, RateLimitStore, TokenRefreshFlow, AssignIssueApi (+40 more)

### Community 6 - "Base UI Components"
Cohesion: 0.06
Nodes (32): Button, ButtonProps, ButtonSize, ButtonVariant, sizeStyles, variantStyles, Card(), CardProps (+24 more)

### Community 7 - "Issue API Integration"
Cohesion: 0.07
Nodes (45): Fix: API Client Inconsistency, Fix: Create Issue Missing teamId, 401 Auto-Refresh, apiClient Singleton, Auth Token Injection, Cache-Before-Fetch Pattern, createIssue() Function, CreateIssueData Type (+37 more)

### Community 8 - "Keyboard Shortcut Module"
Cohesion: 0.07
Nodes (43): Context-Specificity Hierarchy, Keyboard Context Management, Keyboard Module, Keyboard Shortcut Registry, Keyboard Store (Zustand), Server-Sent Events, Shortcut Help Modal, Zustand + localStorage Offline-First (+35 more)

### Community 9 - "Keyboard Sequence Logic"
Cohesion: 0.08
Nodes (22): getCurrentSequence(), handleKeyInSequence(), isInSequence(), resetSequence(), SequenceState, state, Shortcut, ShortcutContext (+14 more)

### Community 10 - "Form Validation Hooks"
Cohesion: 0.08
Nodes (27): useDebounce(), useFormFormik(), UseFormFormikOptions, UseFormFormikReturn, AsyncFormData, asyncValidationSchema, AsyncValidationTestForm(), DoubleSubmitTestForm() (+19 more)

### Community 11 - "Design System Specifications"
Cohesion: 0.06
Nodes (41): Client-Side Validation, ConnectionErrorModal Component, ConnectionStatusIndicator Component, Loading State, Color Semantics, Component Catalog, Layout Tokens, Design System — Linear App Clone (+33 more)

### Community 12 - "Auth and Page Routing"
Cohesion: 0.11
Nodes (39): Auth Hydration, AuthGuard, Breadcrumb, CyclesPage, DashboardPage, IssueDetailPage, IssuesPage, LoginForm (+31 more)

### Community 13 - "Frontend Architecture ADRs"
Cohesion: 0.09
Nodes (32): ADR-0006 Stack Selection Zustand Vite React Router Vitest, ADR-0007 Store Isolation, ARIA Live Regions, Cache-First Stale-While-Revalidate Strategy, Cache Layer with TTL, ConnectionStatusIndicator, Derived State Selectors, Event Deduplication (+24 more)

### Community 14 - "Feature-Sliced Design Patterns"
Cohesion: 0.09
Nodes (30): Feature-Sliced Design Architecture, React Hook Form + Zod for Form Management, Stack Selection — Zustand, Vite, React Router, Vitest, Store Isolation — Separate Zustand Stores per Domain, API Error Taxonomy via Class Hierarchy, UI Component Architecture — Presentational Primitives, Dedicated Status Transition Endpoint for Issue Workflow, Dedicated Assignee Transition Endpoint for Issue Assignment (+22 more)

### Community 15 - "Form Management System"
Cohesion: 0.11
Nodes (30): Async Validation, CheckboxField Wrapper, Double Submit Guard, Field Wrapper Pattern, Form Module, Form State Management, SelectField Wrapper, Submission Flow (+22 more)

### Community 16 - "Realtime State Management"
Cohesion: 0.08
Nodes (30): IssuesState, Optimistic Update Interface, Realtime Module, State Module, WebSocketState, ADR Review, Auth Handshake Decision, Deduplication Decision (+22 more)

### Community 17 - "Auth and Project Setup"
Cohesion: 0.12
Nodes (29): AuthGuard, AuthStore, Button, Design System Tokens, ErrorBanner, LoginForm, LoginPage, React 19 + Vite + pnpm (+21 more)

### Community 18 - "MSW Mocking Infrastructure"
Cohesion: 0.11
Nodes (29): MSW Browser Worker Runtime, Fetch Credentials Include Pattern, Cursor-Based Pagination, HttpOnly Cookie Authentication, LocalStorage Token Removal, Centralized MSW Handlers, Per-Test Handler Override, MSW Node Server Runtime (+21 more)

### Community 19 - "Label Management Store"
Cohesion: 0.13
Nodes (12): IssueLabelsState, LabelDefinitionsState, useIssueLabelsStore, useLabelDefinitionsStore, Label, LabelBadge(), LabelBadgeProps, LabelListProps (+4 more)

### Community 20 - "Realtime Event Schemas"
Cohesion: 0.09
Nodes (24): CommentEventPayload, CommentEventType, CycleEventPayload, CycleEventType, IssueEventPayload, IssueEventType, isValidEventType(), LabelEventPayload (+16 more)

### Community 21 - "TypeScript Configuration"
Cohesion: 0.08
Nodes (25): DOM, DOM.Iterable, ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules (+17 more)

### Community 22 - "Event Deduplication Logic"
Cohesion: 0.19
Nodes (13): cleanupEntityDedupStore(), cleanupSeenEvents(), clearDedupStore(), clearEntityDedupStore(), eventHandlers, getEntityKey(), isDuplicateEntityEvent(), lastEntityEvent (+5 more)

### Community 23 - "API Specification Fixes"
Cohesion: 0.12
Nodes (24): OpenSpec Config — fix-delete-issue-response-type, ADR Review — fix-delete-issue-response-type, deleteIssue() Return Type Fix, Frontend Design — fix-delete-issue-response-type, Design System — fix-delete-issue-response-type, Proposal — fix-delete-issue-response-type, Review — fix-delete-issue-response-type, Spec: Delete Issue API Return Type (+16 more)

### Community 24 - "Sidebar Navigation Components"
Cohesion: 0.14
Nodes (16): useActiveRoute(), HamburgerButton, HamburgerButtonProps, MobileSidebarOverlay(), MobileSidebarOverlayProps, navItems, teams, NavLink (+8 more)

### Community 25 - "Build and Test Config"
Cohesion: 0.10
Nodes (20): ES2023, node, playwright.config.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib (+12 more)

### Community 26 - "Generic UI Components"
Cohesion: 0.23
Nodes (20): lucide-react, UI Generic Components Frontend Design, UI Generic Components Proposal, UI Generic Components Review, UI Generic Components Tasks, UI Generic Components User Flows, class-variance-authority, Button Component (+12 more)

### Community 27 - "Development Dependencies"
Cohesion: 0.11
Nodes (19): @commitlint/cli, eslint-config-prettier, jsdom, msw, devDependencies, @commitlint/cli, eslint-config-prettier, jsdom (+11 more)

### Community 28 - "Documentation Templates"
Cohesion: 0.11
Nodes (19): Design System Concept, Frontend Schema Pipeline, Mockups Convention, Frontend Schema, ADR Template, Frontend Design Template, Design System Template, Mockups README Template (+11 more)

### Community 29 - "WebSocket Client Logic"
Cohesion: 0.23
Nodes (10): createWSClient(), WSClientConfig, setupEventRouter(), createHeartbeat(), DEFAULT_CONFIG, HeartbeatConfig, calculateBackoff(), DEFAULT_CONFIG (+2 more)

### Community 30 - "Mock API Environment"
Cohesion: 0.16
Nodes (18): API Base Path Constant, Auth + Issues Mock API, ConnectionIndicator, EmptyState, ErrorBanner, HeaderBar, IssueList Component, LoadingSkeleton (+10 more)

### Community 31 - "Comment Management Features"
Cohesion: 0.18
Nodes (18): Author-Only Access Control, CommentCard Component, CommentList Component, Delete Comment Feature, DeleteConfirmation Component, DeleteConfirmOverlay Component, Edit Comment Feature, Inline Confirmation Pattern (+10 more)

### Community 32 - "Core Project Dependencies"
Cohesion: 0.12
Nodes (17): clsx, @hookform/resolvers, dependencies, class-variance-authority, clsx, @hookform/resolvers, lucide-react, react (+9 more)

### Community 33 - "Realtime UI Indicators"
Cohesion: 0.13
Nodes (17): ConnectionErrorModal, ConnectionStatusIndicator, Design System — Realtime, IssueAssigneeSelector, IssueCard, NotificationBadge, NotificationItem, NotificationPanel (+9 more)

### Community 34 - "Issue API Services"
Cohesion: 0.13
Nodes (5): FetchIssuesParams, FetchIssuesResponse, CreateIssueData, PaginationCursor, UpdateIssueData

### Community 35 - "Realtime Event Router"
Cohesion: 0.18
Nodes (14): handleCommentEvent(), handleCycleEvent(), handleIssueEvent(), handleLabelEvent(), handleNotificationEvent(), handleProjectEvent(), handleUserEvent(), isAutoUpdateEnabled() (+6 more)

### Community 36 - "Issue Assignment Logic"
Cohesion: 0.28
Nodes (16): ADR-0011 Dedicated Assign Endpoint, BUSINESS_RULE_ERROR (422), Cache Invalidation by Prefix, changeStatus Store Action Pattern, Issue Entity, Implement PATCH /issues/{id}/assignee Endpoint Proposal, Issue Assign/Unassign Endpoint Review, Issue Assign Frontend Specification (+8 more)

### Community 37 - "Issue Watcher Features"
Cohesion: 0.22
Nodes (16): Issue Watchers, IssueDetailPage, Label Accessibility Requirements, Label Management, Optimistic Update, Watcher Accessibility Requirements, Watcher API Endpoints, Issue Watchers Proposal (+8 more)

### Community 38 - "Tech Stack Selection"
Cohesion: 0.17
Nodes (16): JWT Dual Token Auth, Routing Tech Stack, API Client Tech Stack, UI Generic Components Tech Stack, Issue Status Transition Tech Stack, playwright, tailwindcss, playwright (+8 more)

### Community 39 - "State Selectors and Memoization"
Cohesion: 0.16
Nodes (14): ActiveFilters, Cycle, ProjectProgress, selectActiveCycle, selectFilteredIssues, selectIssuesByStatus, selectProjectProgress, selectUnreadCount (+6 more)

### Community 40 - "API Error Interceptors"
Cohesion: 0.32
Nodes (14): apiClient, Error Subscriber Pattern, HTTP Interceptor Pipeline, Rate Limit Tracking, API Error Taxonomy, ErrorHandler Subscriber Pattern, Interceptor Pipeline, RateLimitStore (+6 more)

### Community 41 - "Issue Detail Components"
Cohesion: 0.18
Nodes (9): CommentList(), IssueDetailProps, priorityLabels, IssueStatusBadge(), IssueStatusBadgeProps, STATUS_OPTIONS, statusColorMap, SkeletonLoader() (+1 more)

### Community 42 - "Form Data Schemas"
Cohesion: 0.22
Nodes (8): CreateIssueFormData, createIssueSchema, EditIssueFormData, editIssueSchema, ProfileFormData, profileSchema, ProjectSettingsFormData, projectSettingsSchema

### Community 43 - "Header and Navigation"
Cohesion: 0.23
Nodes (9): Header(), HeaderProps, NotificationBell(), NotificationBellProps, SearchTrigger(), SearchTriggerProps, themeConfig, themeCycle (+1 more)

### Community 44 - "Issue Watcher Components"
Cohesion: 0.24
Nodes (13): Issue Watchers Feature, Optimistic Update Pattern, useWatchersStore, WatchButton Component, Watcher Type Definition, WatcherItem Component, WatcherList Component, WatcherSection Component (+5 more)

### Community 45 - "Frontend Tech Stack"
Cohesion: 0.23
Nodes (13): Server-Sent Events (SSE), Vite 8, Vitest, Zod, React Router 7.x, TypeScript 6.x, Vite 8.x, Tech Selection — Linear App Clone (Frontend) (+5 more)

### Community 46 - "WebSocket Channel Architecture"
Cohesion: 0.15
Nodes (13): EventMessage, issue:{issueId} Channel, team:{teamId} Channel, user:{userId} Channel, WebSocket Gateway, Auth Endpoints, Issue Endpoints, Issue Status Transition (+5 more)

### Community 47 - "NPM Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, format, format:check, lint, lint:fix, prepare (+5 more)

### Community 48 - "Auth Session Store"
Cohesion: 0.21
Nodes (10): AuthState, initialAuthState, useAuthStore, AuthError, LoginFormData, LoginResponse, LogoutResponse, RefreshResponse (+2 more)

### Community 49 - "Watcher API and UI"
Cohesion: 0.24
Nodes (4): Watcher, WatcherItem(), WatcherItemProps, WatcherListProps

### Community 51 - "Architecture and ADRs"
Cohesion: 0.21
Nodes (12): Store Isolation Pattern, Feature-Sliced Design, REST API OpenAPI Contract, Issue Watchers Tech Stack, Label Management ADR Review, Label Management Tech Stack, Edit Comment ADR Review, Issue Watchers ADR Review (+4 more)

### Community 52 - "Keyboard Module Design"
Cohesion: 0.23
Nodes (12): Context Management, Keyboard Shortcuts, Specificity-Based Conflict Resolution, Delete Confirmation Modal — Mockup, Keyboard Module — Mockups Index, Keyboard Settings — Mockup, Shortcut Help Modal — Mockup, Toast Notification — Mockup (+4 more)

### Community 53 - "Issue Form Components"
Cohesion: 0.30
Nodes (8): Issue, issueFormFieldLabels, IssueFormSchema, IssueForm(), IssueFormProps, priorityOptions, statusOptions, IssueFormModalProps

### Community 54 - "Cycle and Project Stores"
Cohesion: 0.30
Nodes (8): CyclesState, useCyclesStore, Cycle, Project, WSEventPayload, WSEventType, ProjectsState, useProjectsStore

### Community 59 - "WebSocket UI Specifications"
Cohesion: 0.29
Nodes (11): Channel Subscription, Connection Status Display, WebSocket Error Handling, Event Processing, WebSocket Authentication, WebSocket Error Toast Mockup, Header Connection Status Mockup, WebSocket UI Mockup Index (+3 more)

### Community 60 - "Comment UI Components"
Cohesion: 0.33
Nodes (8): Comment, CommentCard(), CommentCardProps, formatTimestamp(), initials(), CommentListProps, mockComment, otherComment

### Community 61 - "Label Management Design"
Cohesion: 0.29
Nodes (10): Cache Strategy, Label Type Definition, Label API Endpoints, Label Validation Schemas, useCacheStore, useIssueLabelsStore, useLabelDefinitionsStore, Label Management Frontend Design (+2 more)

### Community 62 - "Component Design System"
Cohesion: 0.20
Nodes (10): Button Component Spec, UI Generic Design System, Button Design System, Card Design System, Checkbox Design System, EmptyState Design System, LoadingIndicator Design System, Modal Design System (+2 more)

### Community 63 - "Docker Containerization"
Cohesion: 0.38
Nodes (10): ADR Review Manifest — Containerization, Docker Multi-Stage Build, nginx, Containerization Design — Frontend, Design System — Dockerfile Containerization, Proposal — Add Dockerfile for Containerization, Review — Add Dockerfile for Containerization, Tasks — Add Dockerfile for Containerization (Frontend) (+2 more)

### Community 64 - "Issue Filter Store"
Cohesion: 0.24
Nodes (7): initialFilters, initialIssuesState, IssuesState, useIssuesStore, IssueFilters, IssueFiltersProps, statusOptions

### Community 65 - "Commitlint Configuration"
Cohesion: 0.22
Nodes (8): @commitlint/config-conventional, commitlint, extends, @commitlint/config-conventional, name, private, type, version

### Community 66 - "Error Handling UI"
Cohesion: 0.33
Nodes (9): ErrorBanner Component Spec, Toast Component Spec, API Client Error Handling Schema, API Client Design System, ErrorBanner Mockup, API Client Mockup Hub, Rate Limit Toast Mockup, API Client Error Handling Review (+1 more)

### Community 67 - "Architecture Decision Records"
Cohesion: 0.42
Nodes (9): API Client Error Handling ADR Review, UI Generic Components ADR Review, Layout Module ADR Review, ADR-0004 Feature-Sliced Design, ADR-0005 React Hook Form + Zod, ADR-0006 Stack Selection, ADR-0007 Store Isolation, ADR-0008 API Error Taxonomy (+1 more)

### Community 68 - "Event Handler Testing"
Cohesion: 0.25
Nodes (5): WSEvent, clearEventHandlers(), registerEventHandler(), mockLogout, mockSetLastHeartbeat

### Community 71 - "Project Management Module"
Cohesion: 0.29
Nodes (8): ADR Review Manifest, List Projects — Frontend Design, Tasks — List Projects API, ProjectsPage, useProjectsStore, ProjectCard Component, ProjectList Component, StatusFilter Component

### Community 72 - "Keyboard Context Provider"
Cohesion: 0.32
Nodes (6): getRouteContext(), isInputElement(), KeyboardContext, KeyboardContextValue, KeyboardProvider(), KeyboardProviderProps

### Community 73 - "Issue List Components"
Cohesion: 0.29
Nodes (5): IssueCard(), IssueCardProps, priorityLabels, statusColors, IssueListProps

### Community 74 - "Realtime UI Mockups"
Cohesion: 0.29
Nodes (7): IssueAssigneeSelector Mockup, IssueCard Mockup, ProjectCard Mockup, ReconnectionToast Mockup, RevertToast Mockup, Optimistic Updates Spec, WebSocket Connection Spec

### Community 75 - "Auth Module Design"
Cohesion: 0.33
Nodes (7): Auth Module Frontend Design, Design System, Auth Login Mockup, Auth Module Proposal, Auth Module Review, Auth Module Frontend Tasks, Auth Module User Flows

### Community 76 - "Layout Shell Components"
Cohesion: 0.29
Nodes (7): Header, PageLayout, ResponsiveDesktopLayout, ResponsiveMobileLayout, ResponsiveTabletLayout, Sidebar, ThemeToggle

### Community 77 - "Optimistic Update Context"
Cohesion: 0.29
Nodes (4): OptimisticContext, OptimisticContextValue, OptimisticProviderProps, TODO: Implement optimistic update context (Phase 3)

### Community 79 - "Toast Notification System"
Cohesion: 0.29
Nodes (4): POSITION_STYLES, Toast, TOAST_STYLES, ToastContainerProps

### Community 80 - "MSW Worker Setup"
Cohesion: 0.38
Nodes (4): worker, handlers, mockIssues, server

### Community 81 - "Layout and Sidebar Design"
Cohesion: 0.47
Nodes (6): LayoutProvider, Sidebar, ThemeToggle, Settings Mockup, Tasks Mockup, Layout Module Responsive Sidebar Theme Specification

### Community 82 - "Feature View Mockups"
Cohesion: 0.33
Nodes (6): Cycle List View Mockup, Realtime Mockups Index, Issue Detail View Mockup, Issue List View Mockup, Notification Dropdown Mockup, Project List View Mockup

### Community 83 - "App Entry Point"
Cohesion: 0.47
Nodes (3): App(), StoreProvider(), StoreProviderProps

### Community 84 - "WebSocket Context Provider"
Cohesion: 0.33
Nodes (3): WebSocketContext, WebSocketContextValue, WebSocketProviderProps

### Community 85 - "Auth and Login Hooks"
Cohesion: 0.47
Nodes (4): useAuth(), LoginFormData, loginSchema, useLoginForm()

### Community 86 - "Watcher UI Components"
Cohesion: 0.40
Nodes (3): WatchButton(), WatchButtonProps, WatcherSectionProps

### Community 87 - "User Registration API"
Cohesion: 0.33
Nodes (3): RegisterError, RegisterPayload, RegisterResponse

### Community 88 - "Cache Store Logic"
Cohesion: 0.33
Nodes (4): CacheEntry, CacheState, DEFAULT_TTLS, useCacheStore

### Community 89 - "WebSocket State Store"
Cohesion: 0.33
Nodes (5): ConnectionStatus, initialWebSocketState, Notification, useWebSocketStore, WebSocketState

### Community 90 - "API Contract Proposals"
Cohesion: 0.40
Nodes (5): API Contract Alignment, Pagination Response Shape Fix, Query Parameter Mismatch Fix, Proposal — Fix Pagination Response Shape, Proposal — Fix Query Parameter Mismatch

### Community 91 - "Event Subscription Mockups"
Cohesion: 0.40
Nodes (5): IssueDetail Mockup, IssueList Mockup, NotificationPanel Mockup, ProjectList Mockup, Event Subscription Spec

### Community 92 - "Store Architecture Design"
Cohesion: 0.50
Nodes (5): Store Architecture, Store Architecture Spec, Tech Selection — Linear App Clone (Frontend), zustand, zustand

### Community 93 - "Issue Management Mockups"
Cohesion: 0.80
Nodes (5): Confirm Delete Dialog Mockup, Work Module Mockup Index, Issue Detail Mockup, Issue Form Modal Mockup, Issues Page Mockup

### Community 94 - "Lint and Format Config"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css}, *.{ts,tsx}, eslint --fix, prettier --write

### Community 95 - "Registration Form Logic"
Cohesion: 0.50
Nodes (3): RegisterFormData, registerSchema, useRegisterForm()

### Community 97 - "Shortcut Toast UI"
Cohesion: 0.50
Nodes (3): SHORTCUT_TOAST_MESSAGES, ToastContainer(), ToastContainerProps

### Community 98 - "Notification UI Components"
Cohesion: 0.40
Nodes (3): NotificationItemData, NotificationItemProps, TYPE_ICONS

### Community 99 - "Issue Editing Page"
Cohesion: 0.40
Nodes (3): priorityOptions, projectOptions, statusOptions

### Community 100 - "Notification Store"
Cohesion: 0.40
Nodes (4): initialNotificationsState, NotificationItem, NotificationsState, useNotificationsStore

### Community 101 - "Toast Notification Store"
Cohesion: 0.40
Nodes (4): Toast, ToastState, ToastVariant, useToastStore

### Community 102 - "UI State Management"
Cohesion: 0.40
Nodes (4): KeyboardContext, Theme, UIState, useUIStore

### Community 103 - "Error Banner Component"
Cohesion: 0.40
Nodes (3): ErrorBannerProps, ErrorBannerType, typeStyles

### Community 104 - "Schema and Metadata"
Cohesion: 0.50
Nodes (4): Change Metadata, OpenSpec Artifact Rules, frontend-schema, OpenSpec Schema Collection

### Community 105 - "Issue Management Mockups"
Cohesion: 0.83
Nodes (4): Issue Assign Mockups Index, Issue Detail Page Mockup, Issue Form Modal Mockup, Issues List Mockup

### Community 106 - "Layout and Accessibility"
Cohesion: 0.50
Nodes (4): AccessibilityConventions, LayoutRegions, ResponsiveLayout, WireframeTemplate

### Community 107 - "Deployment Configuration"
Cohesion: 0.50
Nodes (4): Dockerfile, NginxConfig, SecurityHeaders, SpaFallbackRouting

### Community 108 - "Comment Management UI"
Cohesion: 0.67
Nodes (4): CommentCard, CommentList, DeleteConfirmOverlay, EditComment

### Community 113 - "Watchers State Management"
Cohesion: 0.50
Nodes (3): initialWatchersState, useWatchersStore, WatchersState

### Community 118 - "Modal Stack Store"
Cohesion: 0.50
Nodes (3): ModalStackItem, ModalState, useModalStore

### Community 119 - "Rate Limit Management"
Cohesion: 0.50
Nodes (3): EndpointRateLimit, RateLimitState, useRateLimitStore

### Community 122 - "Docker Nginx Setup"
Cohesion: 0.67
Nodes (3): Containerized SPA Serving, Dockerfile Multi-Stage Build, Nginx Server

### Community 123 - "Delete Comment Mockups"
Cohesion: 0.67
Nodes (3): Delete Comment Mockups Index, Delete Comment Issue Detail Mockup, Delete Comment User Flows

### Community 124 - "Delete Comment Planning"
Cohesion: 0.67
Nodes (3): Delete Comment Review, Delete Comment Frontend Spec, Delete Comment Frontend Tasks

### Community 125 - "Edit Comment Planning"
Cohesion: 0.67
Nodes (3): Edit Comment Review, Edit Comment Frontend Spec, Edit Comment Frontend Tasks

### Community 126 - "Auth Page Mockups"
Cohesion: 1.00
Nodes (3): Sign In — Mockup, Create Account — Mockup, Auth Pages — Mockups

### Community 127 - "Label Management UI"
Cohesion: 0.67
Nodes (3): LabelBadge, LabelList, LabelPicker

### Community 128 - "MSW Mock Server"
Cohesion: 0.67
Nodes (3): MswBrowser, MswHandlers, MswServer

## Knowledge Gaps
- **632 isolated node(s):** `codegraph`, `name`, `private`, `version`, `type` (+627 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **120 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `zustand` connect `Store Architecture Design` to `Issue Data Stores`, `App Layout System`, `Tech Stack Selection`, `API Error Interceptors`, `Frontend Tech Stack`, `Keyboard Module Design`, `Generic UI Components`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `IssuesStore` connect `Issue Data Stores` to `API Error Interceptors`, `Store Architecture Design`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Feature-Sliced Design` connect `Architecture and ADRs` to `App Layout System`, `Issue Watcher Features`, `Tech Stack Selection`, `Frontend Tech Stack`, `Frontend Architecture ADRs`, `Auth and Project Setup`, `Keyboard Module Design`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `codegraph`, `name`, `private` to the rest of the system?**
  _632 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Optimistic Update Manager` be split into smaller, more focused modules?**
  _Cohesion score 0.06247086247086247 - nodes in this community are weakly interconnected._
- **Should `API Client Infrastructure` be split into smaller, more focused modules?**
  _Cohesion score 0.08951048951048951 - nodes in this community are weakly interconnected._
- **Should `UI Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.07003367003367003 - nodes in this community are weakly interconnected._