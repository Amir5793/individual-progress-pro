import "./TagsCard.css"

export const TagsCard = ({tags}) => {
    return (
        <>
            <div className="card">
                <span className="title">All tags</span>
                <div className="card__tags">
                    <ul className="tag">
                        <li className="tag__name add-tag">Add a tag</li>
                        {tags.map(tag => {
                            return <li key={tags.findIndex((t) => {return t === tag})} className="tag__name">{tag}</li>
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}