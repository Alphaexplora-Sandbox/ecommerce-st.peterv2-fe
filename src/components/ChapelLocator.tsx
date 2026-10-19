import { useState } from 'react';
import type { Chapel } from '../types';
import { bindInput, bindSelect } from './handlers';

export const INITIAL_CHAPELS: Chapel[] = [
  {
    id: 'quezon-city',
    name: 'St. Peter Chapel Quezon City',
    region: 'NCR',
    address: 'Quezon Avenue cor. Roosevelt Ave, Quezon City',
    contactNumber: '+63 2 8371-1234',
    totalViewingRooms: 12,
    hasCrematorium: true,
    hasAircon: true
  },
  {
    id: 'commonwealth',
    name: 'St. Peter Chapel Commonwealth',
    region: 'NCR',
    address: 'Commonwealth Avenue, Matandang Balara, Quezon City',
    contactNumber: '+63 2 8931-5678',
    totalViewingRooms: 8,
    hasCrematorium: true,
    hasAircon: true
  },
  {
    id: 'cebu-mandaue',
    name: 'St. Peter Chapel Mandaue',
    region: 'Region VII',
    address: 'A.C. Cortes Avenue, Mandaue City, Cebu',
    contactNumber: '+63 32 344-9000',
    totalViewingRooms: 10,
    hasCrematorium: true,
    hasAircon: true
  },
  {
    id: 'davao-central',
    name: 'St. Peter Chapel Davao',
    region: 'Region XI',
    address: 'McArthur Highway, Matina, Davao City',
    contactNumber: '+63 82 297-1111',
    totalViewingRooms: 6,
    hasCrematorium: false,
    hasAircon: true
  },
  {
    id: 'pampanga-angeles',
    name: 'St. Peter Chapel Angeles',
    region: 'Region III',
    address: 'MacArthur Highway, Balibago, Angeles City, Pampanga',
    contactNumber: '+63 45 625-2222',
    totalViewingRooms: 7,
    hasCrematorium: true,
    hasAircon: true
  }
];

export function filterChapelsList(chapels: Chapel[], region: string, crematoriumOnly: boolean, searchTerm: string): Chapel[] {
  return chapels.filter((c) => {
    if (region !== 'All' && c.region !== region) return false;
    if (crematoriumOnly && !c.hasCrematorium) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term) ||
        c.region.toLowerCase().includes(term)
      );
    }
    return true;
  });
}

export function createChapelFilterHelpers(
  setSearch: (s: string) => void,
  setRegion: (r: string) => void,
  setCrem: React.Dispatch<React.SetStateAction<boolean>>
) {
  return {
    updateSearch: (s: string) => setSearch(s),
    updateRegion: (r: string) => setRegion(r),
    toggleCrem: () => setCrem((prev) => !prev)
  };
}

export function ChapelLocator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [crematoriumOnly, setCrematoriumOnly] = useState(false);

  const filteredChapels = filterChapelsList(INITIAL_CHAPELS, selectedRegion, crematoriumOnly, searchTerm);
  const helpers = createChapelFilterHelpers(setSearchTerm, setSelectedRegion, setCrematoriumOnly);

  return (
    <section aria-labelledby="chapels-title" style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '2.5rem' }}>
      <div className="section-header">
        <div>
          <h2 id="chapels-title" className="section-title">Accredited St. Peter Chapel Directory</h2>
          <p className="section-subtitle">
            Find air-conditioned viewing sanctuaries and crematoriums near you (Over 250 chapels nationwide)
          </p>
        </div>
      </div>

      <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '2', minWidth: '220px' }}>
          <label htmlFor="chapel-search-input" className="form-label">Search Chapel or City:</label>
          <input
            id="chapel-search-input"
            type="text"
            className="form-input"
            placeholder="e.g. Quezon City, Cebu, Pampanga..."
            value={searchTerm}
            onChange={bindInput(helpers.updateSearch)}
          />
        </div>

        <div style={{ flex: '1', minWidth: '160px' }}>
          <label htmlFor="region-select" className="form-label">Filter by Region:</label>
          <select
            id="region-select"
            className="form-select"
            value={selectedRegion}
            onChange={bindSelect(helpers.updateRegion)}
          >
            <option value="All">All Regions</option>
            <option value="NCR">NCR (Metro Manila)</option>
            <option value="Region III">Region III (Central Luzon)</option>
            <option value="Region VII">Region VII (Central Visayas)</option>
            <option value="Region XI">Region XI (Davao Region)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <input
            id="crematorium-checkbox"
            type="checkbox"
            checked={crematoriumOnly}
            onChange={helpers.toggleCrem}
            style={{ width: '18px', height: '18px' }}
          />
          <label htmlFor="crematorium-checkbox" style={{ fontSize: '0.85rem', color: '#E2E8F0', cursor: 'pointer' }}>
            Has Crematorium
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredChapels.map((chapel) => (
          <article
            key={chapel.id}
            style={{
              background: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>{chapel.name}</h3>
              <span style={{ fontSize: '0.75rem', background: '#1E293B', color: '#D97706', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                {chapel.region}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.75rem', flex: 1 }}>
              📍 {chapel.address}
            </p>

            <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.75rem' }}>
              📞 <strong>{chapel.contactNumber}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #1E293B', fontSize: '0.75rem' }}>
              <span style={{ color: '#10B981' }}>✓ {chapel.totalViewingRooms} Viewing Rooms</span>
              {chapel.hasAircon && <span style={{ color: '#10B981' }}>✓ 24/7 Aircon</span>}
              {chapel.hasCrematorium && <span style={{ color: '#F59E0B' }}>✓ Crematorium</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}