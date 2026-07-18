import styled from "styled-components"

export const TagsCard = ({tags, func, selectedTag}) => {
    return (
        <StyledWrapper>
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
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
  .card {
    width: 100% !important;
    height: 100% !important;
    background: #c0afd5;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    color: #554860;
    border-radius: 15px;
    box-shadow: -20px 20px 0px -5px #9c87c0;
  }

  .title {
    font-weight: 900;
    font-size: 1.7em;
    display: block;
    width: 100%;
    margin-bottom: 10px;
  }

  .tag__name {
    display: inline-block;
    color: #fff;
    font-size: 1.1em;
    background-color: #9c87c0;
    padding: 6px 23px 9px;
    border-radius: 70em;
    margin: 8px 6px 8px 0;
    margin-left: 0px;
    position: relative;
    text-transform: lowercase;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .tag__name::before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 40%;
    left: 7px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #554860;
  }

  .tag__name::after {
    content: "";
    position: absolute;
    right: 7px;
    top: 40%;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #554860;
  }

  .tag__name:hover {
    transform: scale(1.1);
    background-color: #9c87c0;
  }

  .add-tag {
  }
`;
