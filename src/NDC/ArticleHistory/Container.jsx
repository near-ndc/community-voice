// NDC.ArticleHistory.Container

const {
  pathToCurrentArticle,
  pathToPrevArticle,
  currentBlockHeight,
  currentVersionData,
  allVersionsData,
  prevBlockHeight,
  widgets,
} = props;

State.init({});

function getDatastring(time) {
  const date = new Date(time);
  return date.toDateString() + " " + date.toLocaleTimeString();
}

return (
  <div className="card border-primary">
    <div className="card-header">
      <small className="text-muted">
        <div className="row justify-content-between">
          <div className="col-4 d-flex frex-row justify-content-start align-items-center">
            <div className="p-2">changes in block #{currentBlockHeight}</div>

            <OverlayTrigger
              placement="auto"
              overlay={<Tooltip>count inserted lines</Tooltip>}
            >
              <span className="badge text-bg-success p-2 me-1 align-self-center">
                {state.lineCountInserted}
              </span>
            </OverlayTrigger>

            <OverlayTrigger
              placement="auto"
              overlay={<Tooltip>count deleted lines</Tooltip>}
            >
              <span className="badge text-bg-danger p-2 me-1 align-self-center">
                {state.lineCountDeleted}
              </span>
            </OverlayTrigger>
          </div>
          <div className="col-4 d-flex justify-content-end align-items-center">
            {getDatastring(currentVersionData.value.metadata.lastEditTimestamp)}
          </div>
        </div>
      </small>
    </div>
    <Widget
      src={widgets.views.editableWidgets.articleHistorySecondContainer}
      props={{
        pathToCurrentArticle: pathToCurrentArticle,
        pathToPrevArticle: pathToPrevArticle,
        currentBlockHeight: currentBlockHeight,
        currentVersionData,
        allVersionsData,
        prevBlockHeight: prevBlockHeight,
        findUniqueResult: (
          lineCountDeleted,
          lineCountInserted,
          lineCountCurrentCode,
          lineCountPrevCode,
          allLineCount
        ) => {
          if (
            state.lineCountDeleted === undefined ||
            state.lineCountInserted === undefined
          )
            State.update({ lineCountDeleted, lineCountInserted });
        },
      }}
    />
  </div>
);
