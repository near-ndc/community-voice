//NDC.UpVoteButton
const { createUpVote, deleteUpVote } = VM.require("cv.near/widget/lib.upVotes")
const { getConfig } = VM.require("cv.near/widget/config.CommunityVoice")

const {
  isTest,
  authorForWidget,
  reactedElementData,
  widgets,
  disabled,
  articleSbts,
  upVotes: articleUpVotes,
  baseActions,
} = props;

const data = reactedElementData;

let userVote = articleUpVotes.find((vote) => vote.accountId === context.accountId);

function getUpVoteButtonClass() {
  if (userVote) {
    return "info";
  } else {
    return "info outline";
  }
}

function stateUpdate(obj) {
  State.update(obj);
}

function onCommit() {
  console.log("On commit")
}

function onCancel() {
  console.log("On cancel")
}

function handleUpVote() {
  userVote?
    deleteUpVote(
      getConfig(isTest),
      userVote.value.metadata.articleId,
      userVote.value.metadata.id,
      onCommit,
      onCancel
    )
  :
    createUpVote(
      getConfig(isTest),
      data.value.metadata.id,
      data.value.metadata.author,
      onCommit,
      onCancel
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

return (
  <>
    <div title={disabled && "You don't own this SBT"}>
      <Widget
        src={widgets.views.standardWidgets.newStyledComponents.Input.Button}
        props={{
          children: (
            <div className="d-flex">
              <span>{`+${articleUpVotes.length}`}</span>
              <IconContainer>
                <Icon
                  className={`bi bi-fast-forward-fill ${
                    !disabled && "text-success"
                  }`}
                ></Icon>
              </IconContainer>
            </div>
          ),
          disabled,
          className: `${getUpVoteButtonClass()}`,
          size: "sm",
          onClick: handleUpVote,
        }}
      />
    </div>
  </>
);
