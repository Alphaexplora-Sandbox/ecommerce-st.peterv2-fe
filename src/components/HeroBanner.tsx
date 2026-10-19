export function HeroBanner({ onExploreClick }: { onExploreClick: () => void }) {
  return (
    <section className="hero-card" aria-labelledby="hero-title">
      <div className="hero-pill">Official Digital Memorial Portal</div>
      <h2 id="hero-title" className="hero-heading">Guaranteed Peace of Mind for Generations to Come</h2>
      <p className="hero-lead">
        Secure pre-need burial and cremation packages with guaranteed anti-inflationary protection,
        flexible 5-year installment terms, 10% spot cash savings, and nationwide St. Peter chapel coverage.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          className="btn-primary"
          style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          onClick={onExploreClick}
        >
          Explore Memorial Plans & Calculator
        </button>
      </div>

      <div className="hero-pillars">
        <div className="pillar-item">
          <span>✓</span>
          <span>Anti-Inflationary Guarantee</span>
        </div>
        <div className="pillar-item">
          <span>✓</span>
          <span>10% Spot Cash Savings</span>
        </div>
        <div className="pillar-item">
          <span>✓</span>
          <span>100% Transferable & Assignable</span>
        </div>
        <div className="pillar-item">
          <span>✓</span>
          <span>250+ Chapels Nationwide</span>
        </div>
        <div className="pillar-item">
          <span>✓</span>
          <span>24/7 E-Burol Livestreaming</span>
        </div>
      </div>
    </section>
  );
}