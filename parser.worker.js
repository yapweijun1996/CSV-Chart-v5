/**
 * CSV Parser Worker using PapaParse (self-hosted).
 * Avoids cross-origin worker issues by hosting on same origin.
 */
/* global self, Papa */

try {
  // Load PapaParse inside the worker scope; jsDelivr sends proper CORS headers
  self.importScripts('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js');
} catch (e) {
  // importScripts errors are fatal for worker usage
  self.postMessage({ error: true, message: 'Failed to load PapaParse in worker: ' + (e.message || String(e)) });
}

self.onmessage = function(event){
  try {
    const payload = event.data || {};
    const file = payload.file;
    const cfg = payload.config || {};
    if (!file) {
      self.postMessage({ error: true, message: 'No file received by worker' });
      return;
    }
    if (typeof Papa === 'undefined') {
      self.postMessage({ error: true, message: 'PapaParse not available in worker' });
      return;
    }

    const collectedRows = [];
    const workerConfig = {
      header: !!cfg.header,
      skipEmptyLines: cfg.skipEmptyLines || 'greedy',
      dynamicTyping: !!cfg.dynamicTyping,
      delimiter: cfg.delimiter || ',',
      quoteChar: cfg.quoteChar || '"',
      escapeChar: cfg.escapeChar || '"',
      step: (results)=>{
        if (results && 'data' in results) collectedRows.push(results.data);
      },
      complete: (results)=>{
        try{
          const meta = results && results.meta ? results.meta : {};
          const errors = results && Array.isArray(results.errors) ? results.errors : [];
          const data = (results && Array.isArray(results.data) && results.data.length) ? results.data : collectedRows;
          self.postMessage({ error:false, data, meta, errors });
        }catch(err){
          self.postMessage({ error:true, message: 'Worker complete handler error: ' + (err.message || String(err)) });
        }
      },
      error: (err, f, inputElem, reason)=>{
        self.postMessage({ error:true, message: (err && err.message) || reason || 'Unknown parse error in worker' });
      }
    };

    Papa.parse(file, workerConfig);
  } catch (e) {
    self.postMessage({ error: true, message: 'Worker runtime error: ' + (e.message || String(e)) });
  }
};