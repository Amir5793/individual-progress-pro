import "./TagsCard.css"

export const TagsCard = ({tags, func, selectedTag}) => {
    return (
        <>
            <div className="card">
                <span className="title">All tags</span>
                <div className="card__tags">
                    <ul className="tag">
                        <li className="tag__name add-tag">Add a tag</li>
                        {tags.map(tag => {
                            return <li onClick={() => {func(tag)}} key={tags.findIndex((t) => {return t === tag})} className="tag__name">{tag}</li>
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}