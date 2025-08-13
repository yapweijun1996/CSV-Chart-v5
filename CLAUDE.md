# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **client-side CSV visualization application** that transforms CSV data into interactive charts and aggregated tables. It runs entirely in the browser without server dependencies, making it cross-platform compatible (Mac, Windows, Android, iOS).

### Key Architecture Components

- **Single-page application**: All functionality contained in `index.html` with embedded JavaScript
- **Web Worker architecture**: Uses `parser.worker.js` for non-blocking CSV parsing with PapaParse
- **Real-time data processing**: Auto-detects data types and generates aggregations using DuckDB-wasm concepts
- **Progressive Web App**: Includes service worker and manifest for offline functionality

## Development Setup

Since this uses Web Workers, you **must run a local web server**:

```bash
# Python 3
python -m http.server

# Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

**Never open index.html directly** (`file://`) as Web Workers are blocked for security reasons.

## Core Data Flow

1. **CSV Upload** → Auto-detection of delimiter and data types
2. **Data Profiling** → Column type inference (number, date, string) and role assignment
3. **Role Detection** → Automatic classification into:
   - `metric`: Numeric fields for calculations (Amount, QTY, Price)
   - `dimension`: Grouping categories (Party Name, Category)
   - `date`: Time-based fields
   - `id`: Unique identifiers (codes, IDs)
   - `ignore`: Fields excluded from aggregation
4. **Aggregation Engine** → Generates up to 10 automatic aggregates with SQL-like operations
5. **Chart Rendering** → Chart.js visualizations with responsive design

## Data Role System

The application uses ERP-optimized patterns for automatic role detection:

```javascript
// Priority patterns for common business data
metric: /(amount|total|qty|quantity|price|unit[_\s-]*price|revenue|sales|cost)/i
code: /(code|id|sku|account|编号|编码|货号|料号)/i
date: /(date|time|day|month|quarter|year|日期)/i
```

### Manual Override System
- Users can override auto-detected roles via modal interface
- Manual aggregates can be added with custom groupBy/metric combinations
- State persists in localStorage per dataset signature

## File Structure

- `index.html`: Main application with embedded CSS/JS (~1700+ lines)
- `parser.worker.js`: Web Worker for CSV parsing with PapaParse (~60 lines)
- `README.md`: User documentation and setup instructions
- `context.md`: Detailed project context and requirements

## Key Libraries (CDN)

- **PapaParse 5.4.1**: CSV parsing with auto-delimiter detection
- **Chart.js 4.4.3**: Responsive chart rendering
- **DuckDB-wasm** (planned): In-browser analytical queries

## Chart Types & Logic

Auto-selection based on data characteristics:
- **Line charts**: Date + metric combinations
- **Pie/Doughnut**: Small dimensions (≤8 unique values) + metrics
- **Bar charts**: Large dimensions + metrics
- **Horizontal bars**: For avg() aggregations
- **Manual override**: User can select from 9 chart types

## Performance Features

- **Streaming parser**: Handles large files (2000+ rows) with progress updates
- **Pagination**: Raw data table with search/sort/filter
- **Sticky headers**: For table navigation
- **Auto-sum footers**: Numeric column totals
- **Chart optimization**: Fixed heights, responsive containers, decimation for line charts

## Testing & Quality

No formal testing framework - manual testing required:
1. Test various CSV formats (comma, semicolon, tab delimiters)
2. Test large files (2000+ rows, 20+ columns)
3. Verify mobile responsiveness
4. Test Web Worker fallbacks
5. Validate chart rendering across different data sizes

## Common Development Tasks

When modifying the application:

1. **Role detection changes**: Update `inferRole()` function and NAME_PATTERNS
2. **New chart types**: Add to `computeChartConfig()` and option lists
3. **Aggregation logic**: Modify `groupAgg()` function
4. **UI components**: Everything is inline in index.html - search for className patterns
5. **Performance issues**: Check Web Worker timeout handling and chart resize logic

## State Management

- Raw data: `ROWS` array
- Column metadata: `PROFILE` object
- UI state: `PAGE`, `RPP`, `QUERY`, `SORT`
- Manual overrides: `MANUAL_ROLES`, `MANUAL_JOBS`
- Persistence: localStorage with dataset signature matching

## Browser Compatibility

- Modern browsers with ES6+ support
- Web Workers and IndexedDB required
- Canvas 2D context for Chart.js
- File API for CSV upload

## Future AI Integration

The architecture supports optional AI enhancement via:
- Custom aggregation suggestions
- Natural language chart descriptions
- Advanced pattern recognition
- Integration hooks already present in planning system