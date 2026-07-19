import { useRef, useEffect } from 'react';
import styled from "styled-components"

export const Input = ({placeholder, hintTxt, onValueChange = () => {}, size = 'medium', value = "", autoFocus = false,
                      }) => {
    const inputRef = useRef(null)

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus()
        }
    }, [autoFocus])

    const hasValue = value && value.length > 0;

    return (<StyledWrapper className="input-container">
        {size !== "large" ? <input
            ref={inputRef}
            type="text"
            id="modern-input"
            value={value}
            placeholder=" "
            required onChange={e => {
            onValueChange(e.target.value)
        }}/> : <textarea ref={inputRef} value={value} name="" id="" maxLength={80} rows={3} onKeyDown={(e) => {
            if (e.key === 'Enter') {
                const currentLines = e.target.value.split('\n').length;
                if (currentLines >= 3) {
                    e.preventDefault();
                }
            }
        }} onChange={e => {
            onValueChange(e.target.value)
        }} className="large"></textarea>}

        <label className="placeholder" htmlFor="modern-input">{placeholder}</label>
        <div className="hint">{hintTxt}</div>
        {!hasValue && (
            <button className="details-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="about-svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path fill="var(--accent-yellow)"
                          d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>
                </svg>
            </button>
        )}
    </StyledWrapper>)
}

const StyledWrapper = styled.div`
  position: relative;

  input, textarea {
    width: 100%;
    height: 5vh;
    padding: 10px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(-45deg, #3B3B98, #2C3A47, #182C61, #2f3640);
    background-size: 400% 400%;
    color: var(--text-primary);
    font-size: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    transition: border-color 0.3s, box-shadow 0.3s;
    animation: gradient 15s ease infinite;
  }

  input:focus, textarea:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
  }

  .large {
    height: 10vh;
    resize: none;
    overflow: hidden;
    line-break: strict;
  }

  .hint {
    position: absolute;
    bottom: -20px;
    left: 0;
    color: var(--accent-yellow);
    text-shadow: 1px 1px 1px var(--text-secondary);
    font-size: .8rem;
  }

  .placeholder {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translate(0, -50%);
    color: var(--text-secondary);
    transition: 0.2s;
    cursor: text;
  }

  input:focus + .placeholder, textarea:focus + .placeholder,
  input:not(:placeholder-shown) + .placeholder, textarea:not(:placeholder-shown) + .placeholder {
    top: -10px;
    left: 5px;
    font-size: 12px;
    color: var(--text-primary);
    text-shadow: 1px 1px 1px var(--text-secondary);
  }

  .details-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
  }

  .about-svg {
    width: 1.5vw;
    height: 1.5vw;
  }
`;
