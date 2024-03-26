//// ArticleBody

function RenderBodyNew(props) {}

function RenderBodyOld(props) {
  const { widgets, authorForWidget, content, sliceContent } = props;

  const ArticleBodyContainer = styled.div`
    margin: 0 0.5rem 0.5rem 0.5rem;
  `;

  let displayedContent = sliceContent ? content.slice(0, 1000) : content;

  return (
    <ArticleBodyContainer>
      <Widget
        src={widgets.views.standardWidgets.socialMarkdown}
        props={{
          text: displayedContent,
          onHashtag: (hashtag) => (
            <span
              key={hashtag}
              className="d-inline-flex"
              style={{ fontWeight: 500 }}
            >
              <a
                href={`https://near.social/${authorForWidget}/widget/${widgets.thisForum}?tagShared=${hashtag}`}
                target="_blank"
              >
                #{hashtag}
              </a>
            </span>
          ),
        }}
      />
      {sliceContent &&
        content.length > 1000 &&
        widgets.views.standardWidgets.styledComponents({
          Button: {
            text: `Show more`,
            size: "sm",
            className: "w-100 justify-content-center",
            onClick: () => {
              State.update({ sliceContent: false });
            },
            icon: <i className="bi bi-chat-square-text-fill"></i>,
          },
        })}
    </ArticleBodyContainer>
  );
}

return { RenderBodyNew, RenderBodyOld };
