//NDC.ArticlesByAuthorCard

const { authorArticlesArray, filter, handleFilterArticles, widgets } = props;

const CardContainer = styled.a`
    color: black;
    font-size: 16px;
    line-height: 19.2px;
    font-family: inherit;
    box-shadow: 0px 0px 30px 0px #0000000D;
    cursor: pointer;
    with: fit-content;
    min-width: 18rem;
    display: flex;
    flex-wrap: nowrap;

    &:hover {
        color: white;
        text-decoration: none;
        background: linear-gradient(90deg, rgba(147,51,234,1) 0%, rgba(79,70,229,1) 100%);
    }
`;

const ImgContainer = styled.div`
  border-radius: 20px;
  overflow: hidden;
`;

return (
  <div className="col-sm-12 col-lg-6 col-xl-4 gy-3">
    <CardContainer
      className="card h-100 p-3"
      onClick={() => handleFilterArticles(filter)}
    >
      <ImgContainer>
        <Widget
          src={widgets.views.editableWidgets.profileShortInlineBlock}
          props={{
            widgets,
            accountId: authorArticlesArray[0].value.metadata.author,
            tooltip: true,
            maxWidth: "90%",
          }}
        />
      </ImgContainer>
      <span>{authorArticlesArray.length} articles</span>
    </CardContainer>
  </div>
);
