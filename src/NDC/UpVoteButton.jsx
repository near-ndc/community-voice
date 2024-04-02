//NDC.UpVoteButton
const { createUpVote, deleteUpVote } = VM.require("communityvoice.ndctools.near/widget/lib.upVotes")
const { getConfig } = VM.require("communityvoice.ndctools.near/widget/config.CommunityVoice")

if(!createUpVote || !deleteUpVote || !getConfig){
  return <div className="spinner-border" role="status"></div>
}

if(!createUpVote || !deleteUpVote || !getConfig){
  return <div className="spinner-border" role="status"></div>
}

const {
  isTest,
  authorForWidget,
  reactedElementData,
  widgets,
  disabled,
  upVotes: articleUpVotes,
  loadUpVotes,
  loadingUpVotes,
  setLoadingUpVotes,
} = props;

const data = reactedElementData;

let userVote = articleUpVotes? articleUpVotes.find((vote) => vote.accountId === context.accountId) : undefined;

function getUpVoteButtonClass() {
  if (userVote) {
    return "info";
  } else {
    return "info outline";
  }
}

function onCommitUpVotes() {
  setLoadingUpVotes(true)
  setTimeout(() => {
    loadUpVotes()
  }, 3000);
}

function onCancelUpVotes() {
  setLoadingUpVotes(false)
}

function handleUpVote() {
  userVote?
    deleteUpVote(
      getConfig(isTest),
      userVote.value.metadata.articleId,
      userVote.value.metadata.id,
      onCommitUpVotes,
      onCancelUpVotes
    )
  :
    createUpVote(
      getConfig(isTest),
      data.value.metadata.id,
      data.value.metadata.author,
      onCommitUpVotes,
      onCancelUpVotes
    )
}

const IconContainer = styled.div`
    transform: rotate(-90deg);
  `;

const Icon = styled.i`
    margin: 0px !important;
  `;

const CallLibrary = styled.div`
    display: none;
  `;


const SpinnerContainer = styled.div`
    height: 1.3rem;
    width: 1.3rem;
    marginTop: 2px;
  `;  

return (
  <>
    <div title={(disabled) && "You can't vote since you don't have any SBT"}>
      {loadingUpVotes ? 
        <Widget
          src={widgets.views.standardWidgets.newStyledComponents.Input.Button}
          props={{
            children: 
              <div className="d-flex">
                <SpinnerContainer className="spinner-border text-secondary" role="status">
                  <span className="sr-only" title="Loading..."></span>
                </SpinnerContainer>
              </div>,
            size: "sm",
          }}
        />
      :
        <Widget
          src={widgets.views.standardWidgets.newStyledComponents.Input.Button}
          props={{
            children: (
              <div className="d-flex">
                <span>{`+${articleUpVotes.length}`}</span>
                <IconContainer>
                  <Icon
                    className={`bi bi-fast-forward-fill ${
                      (!disabled) && "text-success"
                    }`}
                  ></Icon>
                </IconContainer>
              </div>
            ),
            disabled: disabled,
            className: `${getUpVoteButtonClass()}`,
            size: "sm",
            onClick: handleUpVote,
          }}
        />
      }
    </div>
  </>
);
