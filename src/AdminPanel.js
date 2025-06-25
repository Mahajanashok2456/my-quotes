import React, { useState } from 'react';

const FONTS = [
  'Segoe UI',
  'Roboto',
  'Merriweather',
  'Montserrat',
  'Dancing Script',
  'Indie Flower',
  'Caveat',
  'Pacifico',
];

export default function AdminPanel({ onAddQuote, onDeleteQuote, quotes }) {
  const [text, setText] = useState('');
  const [font, setFont] = useState(FONTS[0]);
  const [color, setColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!text.trim()) {
      setError('Quote cannot be empty');
      setLoading(false);
      return;
    }
    await onAddQuote({ text, font, color });
    setText('');
    setFont(FONTS[0]);
    setColor('#ffffff');
    setLoading(false);
  };

  return (
    <div className="admin-panel">
      <form className="add-quote-form" onSubmit={handleAdd}>
        <h2>Add New Quote</h2>
        <textarea
          placeholder="Enter quote..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          required
        />
        <div className="pickers">
          <label>
            Font:
            <select value={font} onChange={e => setFont(e.target.value)}>
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
          <label>
            Color:
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
          </label>
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Quote'}</button>
        {error && <div className="error-msg">{error}</div>}
      </form>
      <div className="admin-quotes-list">
        <h3>All Quotes</h3>
        {quotes.map(q => (
          <div className="admin-quote-item" key={q.id}>
            <span style={{ fontFamily: q.font, color: q.color }}>{q.text}</span>
            <button className="delete-btn" onClick={() => onDeleteQuote(q.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
} 