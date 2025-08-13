Got it ✅
Here’s your **latest `context.md`** for the project, reflecting our recent discussion on **auto role detection**, **aggregation logic**, and **human override**.

---

# **Project Context — CSV → Auto Aggregates → Charts**

## **1. Project Goal**

Build a **JavaScript-based web application** (multi-platform: Mac, Windows, Android, iOS via browser) that:

1. Accepts large CSV input (20+ columns, 2000+ rows).
2. Auto-detects **data roles** for each column (metric, dimension, id, date, ignore).
3. Auto-generates up to **10 aggregate tables** with **Chart.js visualizations**.
4. Allows **human override** of auto decisions (before aggregation).
5. Supports different chart types based on the detected data.
6. Allows user filtering, search, sorting, pagination, and auto-sum for metrics in tables.

---

## **2. Data Role System**

Each CSV column gets a **role** assigned by auto-detection rules, with optional human override.

| Role          | Description                                         | Example                                  |
| ------------- | --------------------------------------------------- | ---------------------------------------- |
| **id**        | Unique identifier per entity or row                 | Party Code, Stock Code, Invoice No       |
| **dimension** | Grouping category (text with limited unique values) | Party Name, Stock Desc, Category, Region |
| **metric**    | Numeric field for calculations                      | QTY, PRICE, Amount, Discount %           |
| **date**      | Time-based field                                    | Order Date, Ship Date                    |
| **ignore**    | Field excluded from aggregation                     | Free-text Notes, Internal comments       |

---

### **Auto Detection Logic**

```js
function detectRole(name, type, uniqueCount, rowCount) {
  const lowerName = name.toLowerCase();

  // Keyword-based override
  if (/\b(price|amount|qty|quantity|total|sales|cost|discount)\b/i.test(lowerName)) return 'metric';
  if (/\b(code|id|number|no)\b/i.test(lowerName)) return 'id';
  if (/\b(date|time)\b/i.test(lowerName)) return 'date';

  // Data-based rules
  if (type === 'number') return 'metric';
  if (type === 'date') return 'date';
  if (type === 'string') {
    if (uniqueCount > rowCount * 0.8) return 'id';
    return 'dimension';
  }

  return 'dimension';
}
```

---

## **3. Aggregation Rules**

1. **Auto Aggregation** — System analyzes role profile:

   * Picks **dimension/date** as `groupBy`
   * Picks **metric** for aggregation (`sum`, `avg`, `count`, `min`, `max`)
   * Picks best chart type (pie, bar, line, stacked bar, scatter, radar, polar area, doughnut, bubble)
2. **Human Override** — User can:

   * Change column roles
   * Select different groupBy + metric combinations
   * Choose chart type manually

---

## **4. Chart Type Mapping**

| Data Combination         | Suggested Chart       |
| ------------------------ | --------------------- |
| date + metric            | line chart            |
| small-dimension + metric | pie/doughnut chart    |
| large-dimension + metric | bar/stacked bar chart |
| two metrics              | scatter chart         |
| category + percentage    | polar area / radar    |

---

## **5. UI/UX Flow**

1. **CSV Upload** → auto delimiter detection & parsing (PapaParse)
2. **Profile Table** → show each column name, type, unique count, role dropdown
3. **Generate Aggregates**:

   * System proposes up to 10 aggregate jobs
   * Each job produces:

     * Data table (sortable, filterable, paginated, auto-sum tfoot)
     * Chart (fixed-height card with Chart.js)
4. **Download Option** → Export each aggregate as CSV
5. **Raw Data Table** → full CSV view with search, sort, pagination

---

## **6. Libraries**

* **PapaParse** → CSV parsing & delimiter detection
* **Chart.js v4** → Chart rendering
* **DataTables.js** → Interactive table with sorting, pagination, filtering
* **Custom JS** → Role detection, aggregation logic, chart-table sync

---

## **7. Future AI Extension (Optional)**

* Use **Gemma 3 27B** (via Gemini API) to suggest:

  * Additional insights
  * Interesting aggregation combinations
  * Natural language chart summaries

---

This context ensures we can start **simple** with **full JavaScript logic** and later **add AI** without breaking the system.

---

If you want, I can now give you an **updated HTML+JS code** that:

1. Implements this **auto role detection**
2. Lets user override in a table dropdown
3. Generates aggregates + charts **in card format**
4. Shows sortable/filterable/paginated tables with auto-sum footer
