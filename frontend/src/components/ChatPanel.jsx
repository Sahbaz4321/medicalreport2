import React, { useState } from 'react';
import { chatAboutReportApi } from '../services/api';

const ChatPanel = ({ analysis }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !analysis) return;

    const userMessage = { role: 'user', text: question };
    setMessages((prev) => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion('');
    setLoading(true);
    try {
      const res = await chatAboutReportApi(currentQuestion, analysis);
      const aiMessage = { role: 'ai', text: res.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        role: 'ai',
        text: 'Sorry, something went wrong while generating an answer.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-2 d-flex align-items-center">
          <i className="bi bi-chat-dots me-2 text-primary"></i>
          Ask AI About Your Report
        </h6>
        <p className="small text-muted mb-2">
          Ask natural-language questions, such as “Is my cholesterol dangerous?”.
        </p>

        <div className="flex-grow-1 mb-2 border rounded-3 p-2 bg-light overflow-auto" style={{ minHeight: 160 }}>
          {messages.length === 0 && (
            <p className="small text-muted mb-0">
              No questions yet. Type a question below once a report has been analyzed.
            </p>
          )}
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={
                'mb-2 small ' +
                (m.role === 'user' ? 'text-end' : 'text-start')
              }
            >
              <div
                className={
                  'd-inline-block px-2 py-1 rounded-3 ' +
                  (m.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white border')
                }
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              placeholder={
                analysis
                  ? 'Ask something about your results...'
                  : 'Analyze a report first to enable chat'
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={!analysis || loading}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!analysis || loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <i className="bi bi-send"></i>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;

