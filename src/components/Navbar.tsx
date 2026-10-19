export interface NavbarProps {
  title?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NAV_TABS = [
  { id: 'catalog', label: 'Plans' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'enrollment', label: 'Enrollment & Beneficiaries' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'chapels', label: 'Chapels' },
  { id: 'eburol', label: 'E-Burol' }
] as const;

export function handleTabSelection(tab: string, callback: (tab: string) => void): string {
  callback(tab);
  return tab;
}

export function Navbar({ title = 'ecommerce-stpeterv2-frontend', activeTab, onTabChange }: NavbarProps) {
  return (
    <header className="header-topbar">
      <div className="header-container">
        <div className="brand-wrapper">
          <div className="cross-icon" aria-hidden="true">†</div>
          <div>
            <h1 className="brand-title">{title}</h1>
            <div className="brand-subtitle">St. Peter Life Plan & Chapels • E-Commerce</div>
          </div>
        </div>

        <nav className="nav-links" aria-label="Main Navigation">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabSelection(tab.id, onTabChange)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="hotline-badge">
          <span aria-hidden="true">📞</span>
          <span>24/7 Hotline: (02) 8371-1234</span>
        </div>
      </div>
    </header>
  );
}