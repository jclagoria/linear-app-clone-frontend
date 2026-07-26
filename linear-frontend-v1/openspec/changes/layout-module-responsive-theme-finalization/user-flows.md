# User Flows — Layout Module — Responsive & Theme Finalization

## Actors

| Actor | Description |
|-------|-------------|
| User | Portal user who can navigate the application and customize their view |

## Flow Inventory

### Layout Module: Dashboard View

**Actor**: User  
**Entry**: User logs in and lands on Dashboard page  
**Exit**: User navigates away from Dashboard

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| Dashboard | empty, loading, populated | Main application overview with layout module |
| Projects | empty, loading, populated | Project list with responsive sidebar |
| Tasks | empty, loading, populated | Task management with sidebar and theme controls |
| Settings | empty, loading, populated | User preferences and theme selection settings |

#### Navigation Graph

```mermaid
graph TD
    Dashboard -->|sidebar navigation| Projects
    Dashboard -->|sidebar navigation| Tasks
    Dashboard -->|header navigation| Settings
    Projects -->|sidebar navigation| Dashboard
    Projects -->|project details| Project Detail
    Tasks -->|sidebar navigation| Dashboard
    Tasks -->|task details| Task Detail
    Settings -->|sidebar navigation| Dashboard
    Project Detail -->|sidebar navigation| Projects
    Task Detail -->|sidebar navigation| Tasks
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| Dashboard | User clicks sidebar toggle | SidebarCollapsed | Desktop/tablet only |
| SidebarCollapsed | User clicks sidebar toggle | SidebarExpanded | Desktop/tablet only |
| Dashboard | User clicks theme toggle | ThemeDark | Applies dark theme |
| Dashboard | User clicks theme toggle | ThemeLight | Applies light theme |
| Dashboard | User clicks system theme | ThemeSystem | Detects OS preference |
| Dashboard | Window resize | MobileLayout | Viewports < 768px |
| MobileLayout | User opens sidebar | SidebarOverlay | Mobile overlay |
| SidebarOverlay | User clicks backdrop | MobileLayout | Closes overlay |

---

### Layout Module: Mobile-First Experience

**Actor**: User  
**Entry**: User on mobile device with viewport < 768px  
**Exit**: User completes task or navigates away

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| MobileDashboard | empty, loading, populated | Main view with hamburger menu |
| MobileProjects | empty, loading, populated | Projects list with overlay sidebar |
| MobileTasks | empty, loading, populated | Tasks with overlay sidebar and theme bar |

#### Navigation Graph

```mermaid
graph TD
    MobileDashboard -->|hamburger menu| MobileProjects
    MobileDashboard -->|hamburger menu| MobileTasks
    MobileDashboard -->|app bar| Settings
    MobileProjects -->|project tap| Project Detail
    MobileTasks -->|task tap| Task Detail
    MobileProjects -->|back button| MobileDashboard
    MobileTasks -->|back button| MobileDashboard
    Project Detail -->|back button| MobileProjects
    Task Detail -->|back button| MobileTasks
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| MobileDashboard | Viewport resize | TabletLayout | Viewports 768-1024px |
| TabletLayout | Window resize | DesktopLayout | Viewports > 1024px |
| MobileDashboard | User clicks hamburger | SidebarOverlay | Opens mobile sidebar |
| SidebarOverlay | User clicks X | MobileDashboard | Closes sidebar |
| SidebarOverlay | User clicks backdrop | MobileDashboard | Closes sidebar |
| MobileDashboard | User selects theme | ThemeChanged | Applies theme globally |