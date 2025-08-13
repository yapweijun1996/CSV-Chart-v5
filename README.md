# CSV to Charts (Client-Only)

This is a client-side application that allows you to upload a CSV file, generate aggregates, and visualize the results as charts. It runs entirely in your browser, with no server-side processing required.

## Features

-   **CSV Parsing**: Uses PapaParse to handle CSV files directly in the browser.
-   **Data Profiling**: Automatically infers data types and profiles the columns of your dataset.
-   **Web Workers**: Offloads heavy processing (parsing and database queries) to Web Workers to keep the UI responsive.
-   **DuckDB-Wasm**: Leverages the power of DuckDB-Wasm for fast, in-browser analytical queries.
-   **Charting**: Uses Chart.js to render a variety of charts, including time-series, bar, pie, scatter, and histograms.
-   **PWA Ready**: Includes a service worker and manifest for offline use and installation.
-   **Data Export**: Allows you to export aggregated data as CSV and charts as PNG, or download a ZIP archive of all results.

## How to Use

1.  **Run a local web server**: Because the application uses Web Workers (for modules), you need to serve the files from a local web server. You cannot simply open `index.html` from your local file system.
    -   If you have Python 3, you can run:
        ```bash
        python -m http.server
        ```
    -   If you have Node.js, you can use a simple server package like `http-server`:
        ```bash
        npx http-server
        ```
2.  **Open the application**: Once the server is running, open your browser and navigate to the local address (e.g., `http://localhost:8000`).
3.  **Load a CSV file**: Click the "Choose a CSV file" button and select a CSV file from your computer.
4.  **Generate Charts**:
    -   **Auto (No-AI)**: Click this button to use a deterministic planner that generates a set of standard charts based on the data profile.
    -   **Plan with AI (hook)**: This is a placeholder for integrating a custom AI planner. By default, it uses the same deterministic logic.
5.  **View and Export Results**: The generated charts and tables will be displayed on the page. You can:
    -   View the SQL query used to generate each chart.
    -   Download the aggregated data as a CSV file.
    -   Save the chart as a PNG image.
    -   Export all results as a single ZIP file.

## Troubleshooting

### "DuckDB loading..." message persists

If the application shows a "DuckDB loading..." message that does not go away, it is likely because you have opened the `index.html` file directly in your browser from the local file system (e.g., using a `file:///...` URL).

**Reason**: This application relies on Web Workers to run DuckDB in the background. For security reasons, modern browsers restrict the use of Web Workers when a page is loaded from the local file system.

**Solution**: You must run a local web server to serve the application files. Please follow the instructions in the "How to Use" section to start a local server.

## Project Structure

-   `index.html`: The main application file containing the UI and client-side logic.
-   `parser.worker.js`: A Web Worker for parsing and profiling the CSV data.
-   `duckdb.worker.js`: A Web Worker for running DuckDB queries.
-   `store.js`: A simple IndexedDB-based store for caching data previews.
-   `service-worker.js`: A service worker for offline caching.
-   `manifest.json`: The web app manifest for PWA features.
-   `context.md`: Project context and architectural notes.