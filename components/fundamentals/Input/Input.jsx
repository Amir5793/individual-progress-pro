import "./Input.css"

export const Input = ({
                          placeholder, hintTxt, onValueChange = () => {
    }, size = 'medium'
                      }) => {
    return (<div className="input-container">
            {size !== "large" ? <input
                type="text"
                id="modern-input"
                placeholder=" "
                required onChange={e => {
                onValueChange(e.target.value)
            }}/> : <textarea name="" id="" maxLength={80} rows={3} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    const currentLines = e.target.value.split('\n').length;
                    if (currentLines >= 3) {
                        e.preventDefault();
                        // optionally show a toast or tooltip
                    }
                }
            }} className="large"></textarea>}

            <label className="placeholder" htmlFor="modern-input">{placeholder}</label>
            <div className="hint">{hintTxt}</div>
            <button className="details-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="about-svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path fill="var(--accent-yellow)"
                          d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>
                </svg>
            </button>
        </div>)
}