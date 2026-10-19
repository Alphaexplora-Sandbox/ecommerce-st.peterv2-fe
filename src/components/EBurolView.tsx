import { useState } from 'react';
import type { Tribute } from '../types';

export function verifyFamilyPin(inputPin: string): boolean {
  return inputPin.trim() === '882194';
}

export function buildTribute(sender: string, rel: string, message: string): Tribute {
  return {
    id: String(Date.now()),
    senderName: sender.trim() || 'Anonymous Relative',
    relationship: rel.trim() || 'Friend/Family',
    message: message.trim(),
    createdAt: 'Just now'
  };
}

export function handleVerifyPinAction(
  pin: string,
  setIsAuth: (a: boolean) => void,
  setPinErr: (e: string | null) => void
): boolean {
  if (verifyFamilyPin(pin)) {
    setIsAuth(true);
    setPinErr(null);
    return true;
  }
  setPinErr('Incorrect 6-digit family PIN. Please verify with the family administrator.');
  return false;
}

export function handleLightCandleAction(
  setCount: React.Dispatch<React.SetStateAction<number>>,
  setIsLit: (l: boolean) => void
): void {
  setIsLit(true);
  setCount((prev) => prev + 1);
  setTimeout(() => setIsLit(false), 800);
}

export function handleAddTributeAction(
  sender: string,
  rel: string,
  msg: string,
  tributes: Tribute[],
  setTributes: (t: Tribute[]) => void,
  resetForm: () => void
): boolean {
  if (!sender.trim() || !msg.trim()) return false;
  const tribute = buildTribute(sender, rel, msg);
  setTributes([tribute, ...tributes]);
  resetForm();
  return true;
}

export function createEBurolEventHandlers(
  pinInput: string,
  setIsAuthenticated: (b: boolean) => void,
  setPinError: (e: string | null) => void,
  setCandleCount: React.Dispatch<React.SetStateAction<number>>,
  setIsLighting: (b: boolean) => void,
  newSender: string,
  newRel: string,
  newMsg: string,
  tributes: Tribute[],
  setTributes: (t: Tribute[]) => void,
  resetForm: () => void
) {
  return {
    onVerifySubmit: (e?: { preventDefault: () => void }) => {
      e?.preventDefault();
      return handleVerifyPinAction(pinInput, setIsAuthenticated, setPinError);
    },
    onCandleClick: () => {
      handleLightCandleAction(setCandleCount, setIsLighting);
    },
    onTributeSubmit: (e?: { preventDefault: () => void }) => {
      e?.preventDefault();
      return handleAddTributeAction(newSender, newRel, newMsg, tributes, setTributes, resetForm);
    }
  };
}

export function createEBurolStateHelpers(
  setPinInput: (p: string) => void,
  setNewSender: (s: string) => void,
  setNewRel: (r: string) => void,
  setNewMsg: (m: string) => void
) {
  return {
    updatePin: (p: string) => setPinInput(p),
    updateSender: (s: string) => setNewSender(s),
    updateRel: (r: string) => setNewRel(r),
    updateMsg: (m: string) => setNewMsg(m)
  };
}

export function EBurolView({ initialAuthenticated = true, initialPinError = null }: { initialAuthenticated?: boolean; initialPinError?: string | null }) {
  const [pinInput, setPinInput] = useState('882194');
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [pinError, setPinError] = useState<string | null>(initialPinError);

  const [candleCount, setCandleCount] = useState(142);
  const [isLighting, setIsLighting] = useState(false);

  const [tributes, setTributes] = useState<Tribute[]>([
    {
      id: '1',
      senderName: 'Maria Santos',
      relationship: 'Niece (Dubai, UAE)',
      message: 'Sending our warmest prayers and love from Dubai. We will always cherish your wisdom, Tito Ramon.',
      createdAt: '1 hour ago'
    },
    {
      id: '2',
      senderName: 'Paolo Santos',
      relationship: 'Nephew (Melbourne, Australia)',
      message: 'Rest in eternal peace, Lolo Ramon. Thank you for all the memories.',
      createdAt: '3 hours ago'
    }
  ]);

  const [newSender, setNewSender] = useState('');
  const [newRel, setNewRel] = useState('');
  const [newMsg, setNewMsg] = useState('');

  const helpers = createEBurolStateHelpers(setPinInput, setNewSender, setNewRel, setNewMsg);

  const eventHandlers = createEBurolEventHandlers(
    pinInput,
    setIsAuthenticated,
    setPinError,
    setCandleCount,
    setIsLighting,
    newSender,
    newRel,
    newMsg,
    tributes,
    setTributes,
    () => {
      setNewSender('');
      setNewRel('');
      setNewMsg('');
    }
  );

  if (!isAuthenticated) {
    return (
      <section aria-labelledby="eburol-login-title" style={{ maxWidth: '480px', margin: '2rem auto', textAlign: 'center', background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', padding: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🕯️</div>
        <h2 id="eburol-login-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          E-Burol™ Private Wake Access
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '1.5rem' }}>
          Please enter the 6-digit family access PIN for Wake Sanctuary <strong>EBR-402</strong> (Ramon &quot;Tatay Mon&quot; Cruz).
        </p>

        <form onSubmit={eventHandlers.onVerifySubmit}>
          <div className="form-group">
            <label htmlFor="eburol-pin-input" className="form-label" style={{ textAlign: 'left' }}>6-Digit Family PIN:</label>
            <input
              id="eburol-pin-input"
              type="password"
              maxLength={6}
              className="form-input"
              style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.25em' }}
              value={pinInput}
              onChange={(e) => helpers.updatePin(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          {pinError && (
            <div style={{ color: '#F87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {pinError}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Access Private Sanctuary Stream →
          </button>
        </form>
      </section>
    );
  }

  return (
    <section aria-labelledby="eburol-title" style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '2.5rem' }}>
      <div className="section-header">
        <div>
          <h2 id="eburol-title" className="section-title">E-Burol™ Virtual Wake & Tribute Portal</h2>
          <p className="section-subtitle">
            Sanctuary Session <strong>EBR-402</strong> • St. Peter Chapel Quezon City (Aircon Chapel Room 3)
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', width: '100%', height: '240px', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} className="candle-glow-pulse">🕯️ ✝️ 🕯️</div>
              <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.95rem' }}>Live Sanctuary Feed (720p HD)</div>
              <div style={{ color: '#059669', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
                <span>Streaming live from Chapel Room 3</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '0.25rem' }}>
              In Loving Memory of Ramon &quot;Tatay Mon&quot; Cruz
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1rem' }}>
              June 14, 1968 — October 15, 2026 • Viewing until October 22, 2026
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-outline"
                style={{ flex: 1, fontSize: '0.85rem' }}
                onClick={() => alert('Integrated Floral Service: White Orchid Wreath dispatched to Chapel Room 3!')}
              >
                💐 Send Flower Wreath
              </button>
            </div>
          </div>
        </div>

        <div className="candle-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} className={isLighting ? 'candle-glow-pulse' : ''}>
            🕯️
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
            Light a Memorial Candle
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
            Offer a peaceful prayer and illuminate the virtual sanctuary
          </p>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginBottom: '1rem' }}>
            {candleCount.toLocaleString()}{' '}
            <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>candles lit by loved ones</span>
          </div>

          <div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
              onClick={eventHandlers.onCandleClick}
            >
              ✨ Light a Memorial Candle
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
          Family Guestbook & Tributes
        </h3>

        <form onSubmit={eventHandlers.onTributeSubmit} style={{ marginBottom: '1.5rem', background: '#1E293B', padding: '1.25rem', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label htmlFor="tribute-sender-input" className="form-label">Your Name:</label>
              <input
                id="tribute-sender-input"
                type="text"
                className="form-input"
                value={newSender}
                onChange={(e) => helpers.updateSender(e.target.value)}
                placeholder="e.g. Maria Santos"
                required
              />
            </div>

            <div>
              <label htmlFor="tribute-rel-input" className="form-label">Relationship / Location:</label>
              <input
                id="tribute-rel-input"
                type="text"
                className="form-input"
                value={newRel}
                onChange={(e) => helpers.updateRel(e.target.value)}
                placeholder="e.g. Niece (Dubai, UAE)"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tribute-msg-input" className="form-label">Condolence Message:</label>
            <textarea
              id="tribute-msg-input"
              className="form-input"
              rows={3}
              value={newMsg}
              onChange={(e) => helpers.updateMsg(e.target.value)}
              placeholder="Write your prayers, tributes, or memories..."
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
            Post Condolence Message
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tributes.map((t) => (
            <div key={t.id} style={{ background: '#1E293B', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #D97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{t.senderName} ({t.relationship})</span>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>{t.createdAt}</span>
              </div>
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>{t.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}