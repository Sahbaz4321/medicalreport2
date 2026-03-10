import React, { useState, useRef, useEffect } from 'react';
import { chatAboutReportApi } from '../services/api';

const ChatPanel = ({ analysis }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  // Floating Chat Button (when closed)
  if (!isOpen) {
    return (
      <div className="chat-panel-toggle-wrapper">
        <button
          className="btn chat-float-btn btn-glow rounded-pill shadow-lg"
          onClick={toggleChat}
          title="Ask AI about your report"
        >
          <i className="bi bi-chat-dots-fill me-2"></i>
          <span>Ask AI</span>
          <span className="chat-badge-dot"></span>
        </button>
      </div>
    );
  }

  // Chat Panel (when open)
  return (
    <div className="card-modern chat-panel-card h-100 shadow-lg border-0">
      {/* Chat Header */}
      <div className="chat-header d-flex align-items-center justify-content-between p-3 border-bottom">
        <div className="d-flex align-items-center">
          <div className="chat-avatar me-2">
            <i className="bi bi-robot"></i>
          </div>
          <div>
            <h6 className="mb-0 fw-bold">AI Health Assistant</h6>
            <small className="text-muted">Ask about your report</small>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-minimize"
            onClick={toggleChat}
            title="Minimize chat"
          >
            <i className="bi bi-dash"></i>
          </button>
          <button
            className="btn btn-sm btn-close-chat"
            onClick={closeChat}
            title="Close chat"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      {/* Chat Instructions */}
      {!analysis && (
        <div className="chat-instructions p-3 text-center">
          <div className="chat-instructions-icon mb-2">
            <i className="bi bi-file-medical"></i>
          </div>
          <p className="small text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Analyze a report first to enable AI chat
          </p>
        </div>
      )}

      {/* Messages Container */}
      <div className="chat-messages flex-grow-1 p-3">
        {messages.length === 0 ? (
          <div className="chat-welcome text-center py-4">
            <div className="chat-welcome-icon mb-3">
              <i className="bi bi-chat-heart"></i>
            </div>
            <h6 className="fw-bold mb-2">Welcome to AI Assistant!</h6>
            <p className="small text-muted mb-0">
              Ask me anything about your medical report.<br />
              Try questions like:
            </p>
            <div className="chat-suggestions mt-3">
              <button
                className="btn btn-sm btn-suggestion me-1 mb-1"
                disabled={!analysis}
                onClick={() => setQuestion("What do my results mean?")}
              >
                "What do my results mean?"
              </button>
              <button
                className="btn btn-sm btn-suggestion me-1 mb-1"
                disabled={!analysis}
                onClick={() => setQuestion("Should I be worried about my results?")}
              >
                "Should I be worried?"
              </button>
              <button
                className="btn btn-sm btn-suggestion me-1 mb-1"
                disabled={!analysis}
                onClick={() => setQuestion("What lifestyle changes do you recommend?")}
              >
                "Lifestyle recommendations?"
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`message-wrapper ${m.role === 'user' ? 'message-user' : 'message-ai'} mb-3`}
              >
                {m.role === 'ai' && (
                  <div className="message-avatar me-2">
                    <i className="bi bi-robot"></i>
                  </div>
                )}
                <div
                  className={`message-bubble ${m.role === 'user' ? 'bg-primary text-white' : 'bg-light'}`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="message-avatar ms-2">
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="message-wrapper message-ai mb-3">
                <div className="message-avatar me-2">
                  <i className="bi bi-robot"></i>
                </div>
                <div className="message-bubble bg-light">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input p-3 border-top">
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-modern"
            placeholder={
              analysis
                ? 'Ask something about your results...'
                : 'Select a report to enable chat'
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!analysis || loading}
          />
          <button
            className="btn btn-primary btn-send"
            type="submit"
            disabled={!analysis || loading || !question.trim()}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="bi bi-send-fill"></i>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;

