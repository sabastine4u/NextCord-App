import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { useSearch, usePagination } from '../hooks/useSocialHooks';
import ProfileCard from '../components/user/ProfileCard';
import {
  SearchBar, FilterChips, Pagination, FullPageLoader, EmptyState, SectionHeader,
} from '../components/ui/UIComponents';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const FILTER_OPTIONS = [
  { value: 'all',         label: 'Everyone' },
  { value: 'following',   label: 'Following' },
  { value: 'Technology',  label: 'Tech' },
  { value: 'Design',      label: 'Design' },
  { value: 'Finance',     label: 'Finance' },
  { value: 'Education',   label: 'Education' },
];

const SEARCH_FIELDS = [
  'firstName', 'lastName', 'username',
  'address.city', 'occupation', 'company.title',
];

export default function ExplorePage() {
  const { users, usersLoading, following } = useSocial();
  const [searchBy, setSearchBy] = useState('all');

  // Custom filter fn that handles the "following" tab
  const {
    searchTerm, setSearchTerm, filterValue, setFilterValue, filtered,
  } = useSearch(users, { fields: SEARCH_FIELDS, filterKey: null });

  // Apply "following" filter on top
  const preFiltered = React.useMemo(() => {
    let list = filtered;
    if (filterValue === 'following') return list.filter(u => following.has(u.id));
    if (filterValue !== 'all') {
      return list.filter(u =>
        (u.interests || []).some(i => i.toLowerCase().includes(filterValue.toLowerCase()))
      );
    }
    return list;
  }, [filtered, filterValue, following]);

  const { page, totalPages, currentItems, goTo, next, prev } = usePagination(preFiltered, 9);

  if (usersLoading) return <FullPageLoader message="Discovering people..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHeader
        title="Explore People"
        subtitle={`${preFiltered.length} ${preFiltered.length === 1 ? 'person' : 'people'} found`}
      />

      {/* Search + Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SearchBar
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by name, city, occupation..."
        />
        <FilterChips
          options={FILTER_OPTIONS}
          value={filterValue}
          onChange={setFilterValue}
        />
      </div>

      {/* Grid */}
      {currentItems.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No people found"
          description="Try a different search term or filter."
          action={
            <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setFilterValue('all'); }}>
              Clear filters
            </button>
          }
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {currentItems.map((user, i) => (
            <ProfileCard key={user.id} user={user} delay={i * 50} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={prev}
        onNext={next}
        onGoTo={goTo}
      />
    </div>
  );
}
