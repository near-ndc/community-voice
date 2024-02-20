// NDC.KanbanBoard

const {
  isTest,
  widgets,
  kanbanColumns,
  finalArticles,
  handleOpenArticle,
  handleShareButton,
  handleFilterArticles,
  authorForWidget,
  kanbanRequiredTags,
  kanbanExcludedTags,
  sbts,
  baseActions,
  callLibs,
} = props;

//Commented so you can test if needed

// function callLibs(
//   src,
//   stateUpdate,
//   functionsToCallByLibrary,
//   extraProps,
//   callerWidget
// ) {
//   return (
//     <Widget
//       src={src}
//       props={{
//         isTest,
//         stateUpdate,
//         functionsToCallByLibrary,
//         callLibs,
//         widgets,
//         callerWidget,
//         ...extraProps,
//       }}
//     />
//   );
// }

//This is here so the code dosn't brake if the functions are not passed
if (!handleFilterArticles) {
  handleFilterArticles = () => {
    console.log("handleFilterArticles clicked");
  };
}
if (!handleOpenArticle) {
  handleOpenArticle = () => {
    console.log("handleOpenArticle clicked");
  };
}
if (!handleShareButton) {
  handleShareButton = () => {
    console.log("handleShareButton clicked");
  };
}

const articles = finalArticles[sbts[0]];

if (!articles) {
  return (
    <h4 className="text-danger">
      Prop "articles" passed wrongly to NDC.KanbanBoard
    </h4>
  );
}

if (!kanbanRequiredTags) {
  kanbanRequiredTags = [];
}

if (!kanbanExcludedTags) {
  kanbanExcludedTags = [];
}

if (!kanbanColumns) {
  kanbanColumns = ["widget", "integration", "feature-request"];
}

const CursorPointer = styled.p`
    cursor: pointer;
  `;

const articlesPerLabel = kanbanColumns.map((cl) => {
  let articlesOnThisColumn = articles.filter((article) => {
    const lowerCaseCL = cl.toLocaleLowerCase().replace(` `, "-");

    return article.tags.includes(lowerCaseCL);
  });
  return { label: cl, articles: articlesOnThisColumn };
});

function getColumnWidth() {
  if (articlesPerLabel.length <= 3) {
    return "4";
  } else {
    return "3";
  }
}

return (
  <div>
    <div className="row mb-2">
      {kanbanRequiredTags.length > 0 ? (
        <div className="col">
          <small className="text-muted">
            Required tags:
            {kanbanRequiredTags.map((label) => {
              return (
                <CursorPointer
                  onClick={() =>
                    handleFilterArticles({
                      filterBy: "tag",
                      value: { label },
                    })
                  }
                >
                  <Widget
                    src={
                      widgets.views.standardWidgets.newStyledComponents.Element
                        .Badge
                    }
                    props={{
                      children: label,
                      variant: "round info",
                      size: "lg",
                    }}
                  />
                </CursorPointer>
              );
            })}
          </small>
        </div>
      ) : null}
      {kanbanExcludedTags.length > 0 ? (
        <div className="col">
          <small className="text-muted">
            Excluded labels:
            {kanbanExcludedTags.map((label) => {
              return (
                <CursorPointer
                  onClick={() =>
                    handleFilterArticles({
                      filterBy: "tag",
                      value: { label },
                    })
                  }
                >
                  <Widget
                    src={
                      widgets.views.standardWidgets.newStyledComponents.Element
                        .Badge
                    }
                    props={{
                      children: label,
                      variant: "round info",
                      size: "lg",
                    }}
                  />
                </CursorPointer>
              );
            })}
          </small>
        </div>
      ) : null}
    </div>

    <div className="row">
      {articlesPerLabel.map((col) => {
        return (
          <div className={`col-${getColumnWidth()}`}>
            <div className="card">
              <div className="card-body border-secondary">
                <h6 className="card-title">
                  {col.label.toUpperCase()}({col.articles.length})
                </h6>
                {col.articles.map((article) => {
                  return (
                    <Widget
                      src={widgets.views.editableWidgets.compactPost}
                      props={{
                        widgets,
                        article,
                        kanbanColumns,
                        handleOpenArticle,
                        handleFilterArticles,
                        handleShareButton,
                        colLabel: col.label,
                        baseActions,
                        callLibs,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
