// NDC.CompactPost

const {
  widgets,
  article,
  kanbanColumns,
  handleOpenArticle,
  handleFilterArticles,
  handleShareButton,
  colLabel,
  baseActions,
  callLibs,
} = props;

const libSrcArray = [widgets.libs.libArticle];

State.init({
  showModal: false,
  functionsToCallByLibrary: {
    article: [],
  },
});

function compactPostStateUpdate(obj) {
  State.update(obj);
}

function onCommit() {
  State.update({ showModal: false });
}

function onCancel() {
  State.update({ showModal: false });
}

function moveArticleListener() {
  if (!state.newLabel) {
    return;
  }
  //To test without commiting use the next line and comment the rest
  // onCommit();
  // State.update({ saving: true });
  const article = getArticleData();
  const newLibsCalls = Object.assign({}, state.functionsToCallByLibrary);
  newLibsCalls.article.push({
    functionName: "createArticle",
    key: "createdArticle",
    props: {
      article,
      onCommit,
      onCancel,
    },
  });

  State.update({ functionsToCallByLibrary: newLibsCalls });
}

function getArticleData() {
  let newTags = article.tags.filter((tag) => {
    let lowerCaseTag = tag.toLowerCase().replace(` `, "-");

    const lowercaseLabels = [];
    kanbanColumns.forEach((col) =>
      lowercaseLabels.push(col.toLowerCase().replace(` `, "-"))
    );

    return !lowercaseLabels.includes(lowerCaseTag);
  });

  newTags.push(state.newLabel.toLowerCase().replace(` `, "-"));

  let newArticleData = article;
  newArticleData.tags = newTags;

  return newArticleData;
}

const Spinner = () => {
  return (
    <SpinnerContainer className="spinner-border text-secondary" role="status">
      <span className="sr-only" title="Loading..."></span>
    </SpinnerContainer>
  );
};

const ModalContainer = styled.div`
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(10px);
    z-index: 1;
  `;

const ChangeLabelMainContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid black;
  `;

const ClosePopUpContainer = styled.div`
    display: flex;  
    flex-direction: row-reverse;
  `;

const CloseIcon = styled.div`
    cursor: pointer;
  `;

function handleLabelSelection(selectedLabel) {
  State.update({
    newLabel: selectedLabel.replace(` `, "-"),
  });
}

function closeModal() {
  State.update({ showModal: false });
}

const modal = (
  <ModalContainer>
    <ChangeLabelMainContainer>
      <ClosePopUpContainer>
        <CloseIcon className="bi bi-x" onClick={closeModal}></CloseIcon>
      </ClosePopUpContainer>
      <Widget
        src={widgets.views.standardWidgets.newStyledComponents.Input.Select}
        props={{
          label: "Select new label",
          placeholder: kanbanColumns[0],
          value: state.newLabel ?? colLabel,
          options: kanbanColumns.map((label) => {
            return { title: label, value: col };
          }),
          onChange: handleLabelSelection,
        }}
      />
      <Widget
        src={widgets.views.standardWidgets.newStyledComponents.Input.Button}
        props={{
          className: "info my-3",
          onClick: moveArticleListener,
          disabled: !state.newLabel,
          children: (
            <div className="d-flex justify-conten-center align-items-center">
              {state.saving ? (
                <Spinner />
              ) : (
                <>
                  <span>Move</span>
                  <i className="bi bi-check2"></i>
                </>
              )}
            </div>
          ),
        }}
      />
    </ChangeLabelMainContainer>
  </ModalContainer>
);

const header = (
  <div className="card-header">
    <small className="text-muted">
      <div className="row justify-content-between">
        <div className="w-75 text-truncate">
          <a
            href={`#/mob.near/widget/ProfilePage?accountId=${article.author}`}
            target="_blank"
            className="link-dark text-truncate w-100"
          >
            <Widget
              src={widgets.views.standardWidgets.profileImage}
              props={{
                metadata,
                accountId: article.author,
                widgetName,
                style: { height: "1.5em", width: "1.5em", minWidth: "1.5em" },
              }}
            />
            <span className="text-muted">@{article.author}</span>
          </a>
        </div>
        <div className="w-25">
          <div className="d-flex justify-content-end">
            <Widget
              src={
                widgets.views.standardWidgets.newStyledComponents.Input.Button
              }
              props={{
                size: "sm",
                className: "info outline icon",
                children: <i className="bi bi-share"></i>,
                onClick: () =>
                  handleShareButton(true, {
                    type: "sharedBlockHeight",
                    value: article.blockHeight,
                  }),
              }}
            />
          </div>
        </div>
      </div>
    </small>
  </div>
);

const borders = {
  Idea: "border-secondary",
  Comment: "border-secondary",
  Submission: "border-secondary",
  Attestation: "border-secondary",
  Sponsorship: "border-secondary",
};

const CursorPointer = styled.p`
    cursor: pointer;
  `;

function toggleShowModal() {
  State.update({ showModal: !state.showModal });
}

const articleTags = article.tags ? (
  <div className="card-title">
    {article.tags.map((tag) => {
      const filter = { filterBy: "tag", value: tag };
      return (
        <CursorPointer onClick={() => handleFilterArticles(filter)}>
          <Widget
            src={
              widgets.views.standardWidgets.newStyledComponents.Element.Badge
            }
            props={{
              children: tag,
              variant: "round info",
              size: "sm",
            }}
          />
        </CursorPointer>
      );
    })}
  </div>
) : null;

const articleTitle = (
  <div className="card-text">
    <div className="row justify-content-between">
      <h6 className="col-9">{article.title}</h6>
    </div>
  </div>
);

const footerActionButtons = (
  <div className="d-flex justify-content-start w-100">
    <Widget
      src={widgets.views.standardWidgets.newStyledComponents.Input.Button}
      props={{
        children: (
          <div className="d-flex align-items-center justify-content-center">
            <span className="mx-1">Move</span>
            <i className="bi bi-arrows"></i>
          </div>
        ),
        disabled: context.accountId !== article.author,
        size: "sm",
        className: "info outline w-25",
        onClick: toggleShowModal,
      }}
    />
    <Widget
      src={widgets.views.standardWidgets.newStyledComponents.Input.Button}
      props={{
        children: (
          <div className="d-flex align-items-center justify-content-center">
            <span className="mx-1">View</span>
            <i className="bi bi-eye fs-6"></i>
          </div>
        ),
        size: "sm",
        className: "info mx-1 w-25",
        onClick: () => {
          handleOpenArticle(article);
        },
      }}
    />
  </div>
);

const CallLibrary = styled.div`
    display: block;
  `;

const Card = styled.div`
    user-select: none;
    &:hover {
      box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
    }
  
  `;

const LimitedMarkdown = styled.div`
        max-height: 6em;
  `;

// Should make sure the posts under the currently top viewed post are limited in size.
const descriptionArea = (
  <LimitedMarkdown className="overflow-auto">
    <Markdown className="card-text" text={article.body}></Markdown>
  </LimitedMarkdown>
);

return (
  <>
    {state.showModal && modal}
    <Card className={`card my-2 ${borders["Submission"]}`}>
      {header}
      <div className="card-body">
        {articleTitle}
        {descriptionArea}
        {articleTags}
        {footerActionButtons}
      </div>
    </Card>
    <CallLibrary>
      {libSrcArray.map((src) => {
        return callLibs(
          src,
          compactPostStateUpdate,
          state.functionsToCallByLibrary,
          { baseAction: baseActions.articlesBaseAction },
          "CompactPost"
        );
      })}
    </CallLibrary>
  </>
);
