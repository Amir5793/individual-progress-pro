import "./CheckBox.css"

export const CheckBox = ({name, value, func = () => {console.log(value)}, checked}) => {
    return (
        <>
            <label className="cosmic-checkbox" onClick={() => {func()}}>
                <input type="radio" name={name} checked={checked} readOnly/>
                <div className="checkbox-container">
                    <div className="checkbox-box">
                        <div className="checkbox-bg"></div>

                        <svg className="checkmark" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M4 12.5L9.5 18L20 6"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>

                        <div className="particle p1"></div>
                        <div className="particle p2"></div>
                        <div className="particle p3"></div>
                        <div className="particle p4"></div>
                        <div className="particle p5"></div>
                        <div className="particle p6"></div>

                        <div className="ring ring-1"></div>
                        <div className="ring ring-2"></div>
                        <div className="ring ring-3"></div>

                        <div className="spark s1"></div>
                        <div className="spark s2"></div>
                        <div className="spark s3"></div>
                        <div className="spark s4"></div>
                        <div className="spark s5"></div>
                        <div className="spark s6"></div>
                        <div className="spark s7"></div>
                        <div className="spark s8"></div>
                    </div>
                    <span className="label-text">{value}</span>
                </div>
            </label>
        </>
    )
}