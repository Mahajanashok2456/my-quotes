import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import StarsBackground from './StarsBackground';

function App() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    fetchQuotes();
    checkSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdmin(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchQuotes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setQuotes(data);
    setLoading(false);
  }

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    setAdmin(!!session);
    setCheckingSession(false);
  }

  async function handleAddQuote({ text, font, color }) {
    const { data, error } = await supabase.from('quotes').insert([{ text, font, color }]);
    if (!error) fetchQuotes();
  }

  async function handleDeleteQuote(id) {
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (!error) fetchQuotes();
  }

  function handleLogout() {
    supabase.auth.signOut();
    setAdmin(false);
    setShowAdminModal(false);
  }

  return (
    <div className="App">
      <StarsBackground numStars={120} />
      <header className="main-header">
        <h1 className="main-title">Can You Feel?</h1>
        <div className="main-slogan">
          <div>Share yo' feelings too 💬</div>
        </div>
        <div className="slogan-separator"></div>
      </header>
      <main>
        {loading ? (
          <p>Loading quotes...</p>
        ) : quotes.length === 0 ? (
          <div className="empty-state">
            <span className="star-icon" role="img" aria-label="star">✨</span>
            <div className="empty-title">No quotes yet…</div>
            <div className="empty-desc">Be the first to share something beautiful</div>
          </div>
        ) : (
          <div className="quotes-list">
            {quotes.map((q) => (
              <div className="quote-card" key={q.id}>
                <span style={{ fontFamily: q.font, color: q.color }}>{q.text}</span>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* Floating Instagram button */}
      <a
        className="floating-ig-btn"
        href="https://www.instagram.com/mahajan_2456"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span role="img" aria-label="instagram"></span> Share your POV with author 💖
      </a>
      {/* Floating Admin button */}
      <button className="floating-admin-btn" onClick={() => setShowAdminModal(true)}>
        Admin access <span style={{fontSize:'1.3em',marginLeft:'0.2em'}}>+</span>
      </button>
      {/* Admin Modal */}
      {showAdminModal && (
        <div className="modal-bg" onClick={() => setShowAdminModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {checkingSession ? null : admin ? (
              <>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                <AdminPanel
                  quotes={quotes}
                  onAddQuote={handleAddQuote}
                  onDeleteQuote={handleDeleteQuote}
                />
              </>
            ) : (
              <AdminLogin onLogin={checkSession} />
            )}
          </div>
        </div>
      )}
      <footer className="main-footer">
        <div className="footer-message">
          "Hello everyone! I believe quotes are something that we truly feel from the depths of our hearts - they come out through letters as our genuine feelings. If you like this, hit a like and comment. Love from MAHAJAN ASHOK💖"
        </div>
        <div className="footer-links">
          <span role="img" aria-label="heart">♡</span> Feel • Share • Connect <span role="img" aria-label="heart">♡</span>
        </div>
        <div className="footer-copyright">
          © 2024 Can You Feel? - Where words touch souls
        </div>
      </footer>
    </div>
  );
}

export default App;
