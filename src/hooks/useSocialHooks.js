import { useState, useMemo } from 'react';

// ── useSearch ─────────────────────────────────────────────────────────────────
/**
 * Generic multi-field search + filter hook.
 * @param {Array} items - array of items to search
 * @param {Object} config - { fields: ['name', 'city', ...], filterKey: 'occupation', defaultFilter: 'all' }
 */
export function useSearch(items = [], config = {}) {
  const { fields = ['firstName', 'lastName'], filterKey = null } = config;

  const [searchTerm, setSearchTerm]   = useState('');
  const [filterValue, setFilterValue] = useState('all');

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return items.filter(item => {
      // Search across multiple nested fields
      const matchesSearch = !q || fields.some(field => {
        const parts = field.split('.');
        let val = item;
        for (const p of parts) val = val?.[p];
        return String(val || '').toLowerCase().includes(q);
      });

      // Optional category filter
      const matchesFilter = !filterKey || filterValue === 'all' ||
        String(item[filterKey] || '').toLowerCase() === filterValue.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [items, searchTerm, filterValue, fields, filterKey]);

  const clearSearch = () => { setSearchTerm(''); setFilterValue('all'); };

  return { searchTerm, setSearchTerm, filterValue, setFilterValue, filtered, clearSearch };
}

// ── usePagination ──────────────────────────────────────────────────────────────
/**
 * Handles client-side pagination.
 * @param {Array} items - filtered array
 * @param {number} perPage - items per page
 */
export function usePagination(items = [], perPage = 8) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  const currentItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  const goTo   = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const next   = () => goTo(page + 1);
  const prev   = () => goTo(page - 1);
  const reset  = () => setPage(1);

  // Reset to page 1 when items change
  useMemo(() => { setPage(1); }, [items.length]);

  return { page, totalPages, currentItems, goTo, next, prev, reset };
}
