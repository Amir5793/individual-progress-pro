import React from "react";
import styled from "styled-components";

export default function Header() {
    return (
        <StyledWrapper>
            <header className="header">
                <div className="greeting-block">
                    <div className="greeting-title">Good evening, AmirAli 👋</div>
                    <div className="greeting-sub">
                        &quot;Small progress, every day, leads to big results.&quot;
                    </div>
                </div>
                <div className="header-actions">
                    <button type="button" className="icon-btn" data-media-type="banani-button" aria-label="Archive progress">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"/>
                        </svg>
                    </button>
                    <button type="button" className="icon-btn" data-media-type="banani-button" aria-label="Adjust theme">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M18 12a6 6 0 1 1-12 0a6 6 0 0 1 12 0"/>
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75M4.399 4.399a.75.75 0 0 1 1.06 0l.393.392a.75.75 0 0 1-1.06 1.061l-.393-.393a.75.75 0 0 1 0-1.06m15.202 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 0 1-1.06-1.06l.393-.393a.75.75 0 0 1 1.06 0M1.25 12a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m19 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75m-2.102 6.148a.75.75 0 0 1 1.06 0l.393.393a.75.75 0 1 1-1.06 1.06l-.393-.393a.75.75 0 0 1 0-1.06m-12.296 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 1 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.061 0M12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </header>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .greeting-block .greeting-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.6px;
    margin-bottom: 6px;
  }

  .greeting-block .greeting-sub {
    font-size: 13px;
    color: var(--text-secondary);
    font-style: italic;
  }

  .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    padding-top: 4px;
  }

  .icon-btn {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-secondary);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    border: none;
  }

  .icon-btn svg {
    width: 1rem;
    height: 1rem;
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      gap: 14px;
      margin-bottom: 18px;
    }

    .greeting-block .greeting-title {
      font-size: 24px;
    }

    .header-actions {
      width: 100%;
      justify-content: flex-start;
      padding-top: 0;
    }
  }
`;
