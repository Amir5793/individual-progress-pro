import "./DropDown.css"

export const DropDown = () => {
    return (
        <>
            <div className="dropdown">
                <input
                    hidden=""
                    className="sr-only"
                    name="state-dropdown"
                    id="state-dropdown"
                    type="checkbox"
                />
                <label
                    aria-label="dropdown scrollbar"
                    htmlFor="state-dropdown"
                    className="trigger"
                ></label>

                <ul className="list webkit-scrollbar" role="list" dir="auto">
                    <li className="listitem" role="listitem">
                        <article className="article">Hover to view scrollbar.</article>
                    </li>

                    <li className="listitem" role="listitem">
                        <article className="article">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium,
                            sunt tempora recusandae dolorum.
                        </article>
                    </li>

                    <li className="listitem" role="listitem">
                        <article className="article">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium,
                            sunt tempora recusandae dolorum.
                        </article>
                    </li>
                </ul>
            </div>
        </>
    )
}