import React, { useState } from 'react';
import './styles.css';

const VeyronAgentCard = ({ agentUrl }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAgentOpen = () => {
    setIsLoading(true);
    window.open(agentUrl, '_blank');
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="veyron-agent-card">
      <div className="veyron-agent-logo">
        <img src="/assets/veyron-logo.png" alt="Veyron Hungary Logo" />
      </div>
      
      <div className="veyron-agent-content">
        <h3>Luxusingatlan Marketing AI Ügynök</h3>
        <p>
          Specializált mesterséges intelligencia ügynökség, amely luxusingatlanokhoz készít elegáns marketing posztokat,
          kezeli az ingatlanképeket, és automatikusan továbbítja azokat a kívánt platformokra.
        </p>
        
        <div className="veyron-agent-features">
          <div className="feature-item">
            <span className="feature-icon">✏️</span>
            <span className="feature-text">Luxus tartalom</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🖼️</span>
            <span className="feature-text">Képfeltöltés</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <span className="feature-text">Webhook integráció</span>
          </div>
        </div>
        
        <button 
          className={`veyron-agent-button ${isLoading ? 'loading' : ''}`}
          onClick={handleAgentOpen}
          disabled={isLoading}
        >
          {isLoading ? 'Betöltés...' : 'AI Ügynök elindítása'}
        </button>
      </div>
    </div>
  );
};

export default VeyronAgentCard; 