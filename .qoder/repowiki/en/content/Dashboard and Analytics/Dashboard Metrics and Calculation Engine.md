# Dashboard Metrics and Calculation Engine

<cite>
**Referenced Files in This Document**
- [dashboard-metrics.ts](file://src/features/dashboard/utils/dashboard-metrics.ts)
- [index.ts](file://src/features/dashboard/utils/index.ts)
- [types.ts](file://src/features/dashboard/types.ts)
- [use-dashboard-page-logics.ts](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts)
- [page.tsx](file://src/features/dashboard/page.tsx)
- [list-items.ts](file://src/data/states/list-items.ts)
- [lists.ts](file://src/data/states/lists.ts)
- [checked-total-pie-chart.tsx](file://src/features/dashboard/components/checked-total-pie-chart.tsx)
- [recent-lists-section.tsx](file://src/features/dashboard/components/recent-lists-section.tsx)
- [item-variation-section.tsx](file://src/features/dashboard/components/item-variation-section.tsx)
- [metric-card.tsx](file://src/features/dashboard/components/metric-card.tsx)
- [use-item-price-comparison-logics.ts](file://src/features/dashboard/hooks/use-item-price-comparison-logics.ts)
- [dashboard-metrics.property.test.ts](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the dashboard metrics calculation engine responsible for transforming raw shopping list data into actionable insights. It covers:
- Core metrics computation: total checked price, percentage changes, and statistical aggregations
- Data transformation, filtering, and normalization utilities
- Strategies for different time periods and grouping methods
- Integration with the state management system, reactive updates, and caching
- Mathematical formulations for price trends, variance, and comparative metrics
- Examples of customization, edge case handling, and debugging techniques

## Project Structure
The dashboard metrics engine lives under the dashboard feature and integrates with the state layer and UI components.

```mermaid
graph TB
subgraph "Dashboard Feature"
U["utils/dashboard-metrics.ts"]
T["types.ts"]
H1["hooks/use-dashboard-page-logics.ts"]
H2["hooks/use-item-price-comparison-logics.ts"]
C1["components/checked-total-pie-chart.tsx"]
C2["components/recent-lists-section.tsx"]
C3["components/item-variation-section.tsx"]
MC["components/metric-card.tsx"]
P["page.tsx"]
end
subgraph "State Layer"
L["data/states/lists.ts"]
LI["data/states/list-items.ts"]
end
P --> H1
H1 --> U
H1 --> L
H1 --> LI
H2 --> U
H2 --> LI
U --> T
C1 --> U
C2 --> U
C3 --> U
MC --> C1
```

**Diagram sources**
- [dashboard-metrics.ts:1-421](file://src/features/dashboard/utils/dashboard-metrics.ts#L1-L421)
- [types.ts:1-65](file://src/features/dashboard/types.ts#L1-L65)
- [use-dashboard-page-logics.ts:1-98](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L1-L98)
- [use-item-price-comparison-logics.ts:1-82](file://src/features/dashboard/hooks/use-item-price-comparison-logics.ts#L1-L82)
- [checked-total-pie-chart.tsx:1-184](file://src/features/dashboard/components/checked-total-pie-chart.tsx#L1-L184)
- [recent-lists-section.tsx:1-43](file://src/features/dashboard/components/recent-lists-section.tsx#L1-L43)
- [item-variation-section.tsx:1-70](file://src/features/dashboard/components/item-variation-section.tsx#L1-L70)
- [metric-card.tsx:1-31](file://src/features/dashboard/components/metric-card.tsx#L1-L31)
- [page.tsx:1-135](file://src/features/dashboard/page.tsx#L1-L135)
- [lists.ts:1-27](file://src/data/states/lists.ts#L1-L27)
- [list-items.ts:1-24](file://src/data/states/list-items.ts#L1-L24)

**Section sources**
- [dashboard-metrics.ts:1-421](file://src/features/dashboard/utils/dashboard-metrics.ts#L1-L421)
- [types.ts:1-65](file://src/features/dashboard/types.ts#L1-L65)
- [use-dashboard-page-logics.ts:1-98](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L1-L98)
- [page.tsx:1-135](file://src/features/dashboard/page.tsx#L1-L135)
- [lists.ts:1-27](file://src/data/states/lists.ts#L1-L27)
- [list-items.ts:1-24](file://src/data/states/list-items.ts#L1-L24)

## Core Components
- Metrics utilities: filtering by period, grouping by list and item, building summaries, and computing statistics
- State integration: reactive retrieval of lists and items via Legend state observables
- UI components: rendering charts, recent lists, and item variations
- Tests: property-based tests validating correctness of totals, averages, and grouping

Key responsibilities:
- Filter and normalize timestamps for items and lists
- Compute checked totals per list and overall
- Aggregate item price variations with directional classification
- Build daily series with averaging and sample counts
- Provide cached summaries per period

**Section sources**
- [dashboard-metrics.ts:65-130](file://src/features/dashboard/utils/dashboard-metrics.ts#L65-L130)
- [dashboard-metrics.ts:161-195](file://src/features/dashboard/utils/dashboard-metrics.ts#L161-L195)
- [dashboard-metrics.ts:197-348](file://src/features/dashboard/utils/dashboard-metrics.ts#L197-L348)
- [dashboard-metrics.ts:389-405](file://src/features/dashboard/utils/dashboard-metrics.ts#L389-L405)
- [use-dashboard-page-logics.ts:41-97](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L41-L97)
- [dashboard-metrics.property.test.ts:88-203](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L88-L203)

## Architecture Overview
The engine follows a reactive pipeline:
- Real-time state streams feed normalized lists and items
- Hook orchestrates caching and computes dashboard summary per selected period
- Utilities compute metrics and statistics
- UI components render summaries and drill-down views

```mermaid
sequenceDiagram
participant UI as "Dashboard Page"
participant Hook as "use-dashboard-page-logics"
participant State as "Legend State Lists/Items"
participant Utils as "dashboard-metrics.ts"
UI->>Hook : mount and subscribe
Hook->>State : read lists$ and listItems$
State-->>Hook : normalized lists/items
Hook->>Utils : buildDashboardSummary(lists, items, period)
Utils->>Utils : filterItemsByPeriod()
Utils->>Utils : buildItemVariations(includeDailySeries=false)
Utils->>Utils : splitItemVariations()
Utils-->>Hook : DashboardSummary
Hook-->>UI : summary props (period, summary)
UI->>UI : render charts and sections
```

**Diagram sources**
- [page.tsx:49-97](file://src/features/dashboard/page.tsx#L49-L97)
- [use-dashboard-page-logics.ts:41-97](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L41-L97)
- [lists.ts:5-26](file://src/data/states/lists.ts#L5-L26)
- [list-items.ts:5-24](file://src/data/states/list-items.ts#L5-L24)
- [dashboard-metrics.ts:389-405](file://src/features/dashboard/utils/dashboard-metrics.ts#L389-L405)

## Detailed Component Analysis

### Metrics Utilities
The core utility module defines:
- Timestamp normalization and resolution
- Period-based filtering
- Checked price aggregation
- Pie slices per list
- Daily series aggregation with averaging
- Item variation computation with direction and percent change
- Summary builder and period helpers

```mermaid
flowchart TD
Start(["Build Dashboard Summary"]) --> Filter["Filter Items by Period"]
Filter --> Variations["Build Item Variations<br/>without daily series"]
Variations --> Split["Split Increases vs Decreases"]
Split --> Summary["Assemble DashboardSummary<br/>totalCheckedPrice, pieSlices, recentLists, increases, decreases"]
Summary --> End(["Return Summary"])
```

**Diagram sources**
- [dashboard-metrics.ts:389-405](file://src/features/dashboard/utils/dashboard-metrics.ts#L389-L405)
- [dashboard-metrics.ts:65-88](file://src/features/dashboard/utils/dashboard-metrics.ts#L65-L88)
- [dashboard-metrics.ts:325-348](file://src/features/dashboard/utils/dashboard-metrics.ts#L325-L348)
- [dashboard-metrics.ts:350-360](file://src/features/dashboard/utils/dashboard-metrics.ts#L350-L360)

Key algorithms and formulas:
- Total checked price: sum of price × amount for items marked as checked
- Percentage change: ((last − first) / first) × 100
- Direction classification: positive/negative threshold for increase/decrease; otherwise stable
- Average daily variation percent: mean of daily ((current − previous) / previous) × 100, skipping zero previous values

Edge cases handled:
- Missing dates fallback to creation/update timestamps
- Empty series returns safe defaults (zero averages, empty daily series)
- Non-positive prices filtered out for meaningful comparisons
- Normalization trims and lowercases item titles for grouping

**Section sources**
- [dashboard-metrics.ts:55-63](file://src/features/dashboard/utils/dashboard-metrics.ts#L55-L63)
- [dashboard-metrics.ts:100-103](file://src/features/dashboard/utils/dashboard-metrics.ts#L100-L103)
- [dashboard-metrics.ts:132-152](file://src/features/dashboard/utils/dashboard-metrics.ts#L132-L152)
- [dashboard-metrics.ts:161-195](file://src/features/dashboard/utils/dashboard-metrics.ts#L161-L195)
- [dashboard-metrics.ts:197-250](file://src/features/dashboard/utils/dashboard-metrics.ts#L197-L250)
- [dashboard-metrics.ts:256-323](file://src/features/dashboard/utils/dashboard-metrics.ts#L256-L323)
- [dashboard-metrics.ts:370-387](file://src/features/dashboard/utils/dashboard-metrics.ts#L370-L387)
- [dashboard-metrics.ts:407-421](file://src/features/dashboard/utils/dashboard-metrics.ts#L407-L421)

### State Management and Reactive Updates
- Lists and items are observable streams synchronized with Supabase and persisted locally
- The dashboard hook subscribes to these streams and normalizes data
- A per-period cache avoids recomputation on period changes
- Cache is invalidated when underlying lists or items change

```mermaid
sequenceDiagram
participant Store as "lists$ / listItems$"
participant Hook as "use-dashboard-page-logics"
participant Cache as "summaryCacheRef"
participant Utils as "buildDashboardSummary"
Store-->>Hook : new snapshot
Hook->>Cache : check period cache
alt cache miss
Hook->>Utils : compute summary
Utils-->>Hook : summary
Hook->>Cache : store summary
else cache hit
Hook->>Cache : return cached summary
end
```

**Diagram sources**
- [lists.ts:5-26](file://src/data/states/lists.ts#L5-L26)
- [list-items.ts:5-24](file://src/data/states/list-items.ts#L5-L24)
- [use-dashboard-page-logics.ts:41-97](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L41-L97)

**Section sources**
- [lists.ts:1-27](file://src/data/states/lists.ts#L1-L27)
- [list-items.ts:1-24](file://src/data/states/list-items.ts#L1-L24)
- [use-dashboard-page-logics.ts:41-97](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L41-L97)

### UI Integration and Rendering
- Dashboard page composes lazy-loaded sections and passes summary props
- Charts and sections consume normalized metrics and render visualizations
- Metric card component renders summarized values with optional subtitles

```mermaid
graph LR
P["page.tsx"] --> H["use-dashboard-page-logics"]
H --> U["dashboard-metrics.ts"]
U --> S["DashboardSummary"]
P --> C1["checked-total-pie-chart.tsx"]
P --> C2["recent-lists-section.tsx"]
P --> C3["item-variation-section.tsx"]
C1 --> S
C2 --> S
C3 --> S
MC["metric-card.tsx"] --> C1
```

**Diagram sources**
- [page.tsx:49-129](file://src/features/dashboard/page.tsx#L49-L129)
- [use-dashboard-page-logics.ts:90-96](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L90-L96)
- [checked-total-pie-chart.tsx:34-179](file://src/features/dashboard/components/checked-total-pie-chart.tsx#L34-L179)
- [recent-lists-section.tsx:15-42](file://src/features/dashboard/components/recent-lists-section.tsx#L15-L42)
- [item-variation-section.tsx:18-69](file://src/features/dashboard/components/item-variation-section.tsx#L18-L69)
- [metric-card.tsx:14-30](file://src/features/dashboard/components/metric-card.tsx#L14-L30)

**Section sources**
- [page.tsx:1-135](file://src/features/dashboard/page.tsx#L1-L135)
- [checked-total-pie-chart.tsx:1-184](file://src/features/dashboard/components/checked-total-pie-chart.tsx#L1-L184)
- [recent-lists-section.tsx:1-43](file://src/features/dashboard/components/recent-lists-section.tsx#L1-L43)
- [item-variation-section.tsx:1-70](file://src/features/dashboard/components/item-variation-section.tsx#L1-L70)
- [metric-card.tsx:1-31](file://src/features/dashboard/components/metric-card.tsx#L1-L31)

### Item Price Comparison Drill-Down
- A dedicated hook filters items by period, builds variations with daily series, and computes average daily variation percent
- Navigation passes item key/title and period to comparison page

```mermaid
sequenceDiagram
participant UI as "ItemVariationSection"
participant Hook as "use-item-price-comparison-logics"
participant State as "listItems$"
participant Utils as "dashboard-metrics.ts"
UI->>Hook : open item comparison
Hook->>State : read listItems$
State-->>Hook : normalized items
Hook->>Utils : filterItemsByPeriod()
Hook->>Utils : buildItemVariations(includeDailySeries=true)
Utils-->>Hook : variation
Hook->>Utils : calculateAverageDailyVariationPercent()
Utils-->>Hook : averageDailyVariation
Hook-->>UI : variation + averageDailyVariation
```

**Diagram sources**
- [use-item-price-comparison-logics.ts:32-81](file://src/features/dashboard/hooks/use-item-price-comparison-logics.ts#L32-L81)
- [list-items.ts:5-24](file://src/data/states/list-items.ts#L5-L24)
- [dashboard-metrics.ts:65-88](file://src/features/dashboard/utils/dashboard-metrics.ts#L65-L88)
- [dashboard-metrics.ts:325-348](file://src/features/dashboard/utils/dashboard-metrics.ts#L325-L348)
- [dashboard-metrics.ts:370-387](file://src/features/dashboard/utils/dashboard-metrics.ts#L370-L387)

**Section sources**
- [use-item-price-comparison-logics.ts:1-82](file://src/features/dashboard/hooks/use-item-price-comparison-logics.ts#L1-L82)
- [dashboard-metrics.ts:325-387](file://src/features/dashboard/utils/dashboard-metrics.ts#L325-L387)

## Dependency Analysis
- The metrics utilities depend on:
  - Types for shape definitions
  - Decimal.js for precise arithmetic
  - Locale-aware date formatting for labels
- The dashboard page depends on:
  - Hooks for reactive data and caching
  - Components for rendering
- State layer depends on:
  - Supabase synchronization and local persistence
  - Real-time filters scoped to the current user

```mermaid
graph TB
DM["dashboard-metrics.ts"] --> DEC["Decimal.js"]
DM --> TYPES["types.ts"]
PAGE["page.tsx"] --> H1["use-dashboard-page-logics.ts"]
PAGE --> H2["use-item-price-comparison-logics.ts"]
H1 --> DM
H2 --> DM
H1 --> L["lists.ts"]
H1 --> LI["list-items.ts"]
H2 --> LI
```

**Diagram sources**
- [dashboard-metrics.ts:1-14](file://src/features/dashboard/utils/dashboard-metrics.ts#L1-L14)
- [types.ts:1-65](file://src/features/dashboard/types.ts#L1-L65)
- [page.tsx:1-135](file://src/features/dashboard/page.tsx#L1-L135)
- [use-dashboard-page-logics.ts:1-98](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L1-L98)
- [use-item-price-comparison-logics.ts:1-82](file://src/features/dashboard/hooks/use-item-price-comparison-logics.ts#L1-L82)
- [lists.ts:1-27](file://src/data/states/lists.ts#L1-L27)
- [list-items.ts:1-24](file://src/data/states/list-items.ts#L1-L24)

**Section sources**
- [dashboard-metrics.ts:1-14](file://src/features/dashboard/utils/dashboard-metrics.ts#L1-L14)
- [types.ts:1-65](file://src/features/dashboard/types.ts#L1-L65)
- [lists.ts:1-27](file://src/data/states/lists.ts#L1-L27)
- [list-items.ts:1-24](file://src/data/states/list-items.ts#L1-L24)

## Performance Considerations
- Caching: Per-period summary cache prevents repeated computations when switching periods
- Filtering: Early exit for “all” period avoids unnecessary filtering work
- Aggregation: Single-pass reductions with Decimal minimize floating-point drift
- Rendering: Lazy loading of heavy components reduces initial load
- Real-time updates: Reactive hooks recompute only when watched state changes

Optimization opportunities:
- Memoize normalization steps for lists and items
- Consider indexed lookups for frequent queries (e.g., listId -> items)
- Batch updates when applying filters to very large datasets

**Section sources**
- [use-dashboard-page-logics.ts:41-97](file://src/features/dashboard/hooks/use-dashboard-page-logics.ts#L41-L97)
- [dashboard-metrics.ts:65-88](file://src/features/dashboard/utils/dashboard-metrics.ts#L65-L88)
- [dashboard-metrics.ts:55-63](file://src/features/dashboard/utils/dashboard-metrics.ts#L55-L63)

## Troubleshooting Guide
Common issues and resolutions:
- Incorrect totals:
  - Verify checked items are properly filtered and multiplied by amounts
  - Ensure Decimal arithmetic is used consistently for precision
- Missing or stale data:
  - Confirm state subscriptions are active and normalized
  - Clear cache on data changes to force recalculation
- Zero or negative price entries:
  - These are intentionally filtered out for meaningful comparisons
- Empty charts:
  - Ensure slices have positive values before rendering bars
- Drift in averages:
  - Use Decimal-based reductions and avoid intermediate rounding

Validation resources:
- Property-based tests confirm correctness of totals, averages, and grouping

**Section sources**
- [dashboard-metrics.property.test.ts:88-203](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L88-L203)
- [dashboard-metrics.ts:197-250](file://src/features/dashboard/utils/dashboard-metrics.ts#L197-L250)
- [dashboard-metrics.ts:325-348](file://src/features/dashboard/utils/dashboard-metrics.ts#L325-L348)

## Conclusion
The dashboard metrics engine combines reactive state management with robust calculation utilities to deliver accurate, efficient, and user-friendly financial insights. Its modular design supports customization, maintains performance through caching and memoization, and provides clear extension points for additional metrics and visualizations.

## Appendices

### Mathematical Formulas Reference
- Total checked price: Σ(price_i × amount_i) for i ∈ checked
- Percentage change: ((last − first) / first) × 100
- Direction classification:
  - Increase if recent delta > 0.01%
  - Decrease if recent delta < −0.01%
  - Stable otherwise
- Average daily variation percent: mean of ((current_t − current_{t−1}) / current_{t−1}) × 100 over t ∈ [2..n], skipping zero denominators

**Section sources**
- [dashboard-metrics.ts:217-225](file://src/features/dashboard/utils/dashboard-metrics.ts#L217-L225)
- [dashboard-metrics.ts:370-387](file://src/features/dashboard/utils/dashboard-metrics.ts#L370-L387)