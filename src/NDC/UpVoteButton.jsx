//NDC.UpVoteButton
const { addUpVote } = VM.require("sayalot.near/widget/lib.upVotes")
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice")

const {
  isTest,
  authorForWidget,
  reactedElementData,
  widgets,
  disabled,
  articleSbts,
  upVotes: articleUpVotes,
  callLibs,
  baseActions,
} = props;

const data = reactedElementData;

const libSrcArray = [widgets.libs.libUpVotes];

// const initLibCalls = {
//   upVotes: [
//     {
//       functionName: "getUpVotes",
//       key: "upVotesBySBT",
//       props: {
//         id: data.id ?? `${data.author}-${data.timeCreate}`,
//         sbtsNames: articleSbts,
//       },
//     },
//   ],
// };
// const initUpVotesBySBT = {};

// if (!articleUpVotes) {
//   State.init({
//     functionsToCallByLibrary: initLibCalls,
//     articleUpVotes: [],
//     upVotesBySBT: initUpVotesBySBT,
//   });
// } else {
//   State.init({
//     articleUpVotes,
//     functionsToCallByLibrary: { upVotes: [] },
//   });
// }

// if (state.upVotesBySBT && Object.keys(state.upVotesBySBT).length > 0) {
//   const key = Object.keys(state.upVotesBySBT)[0]; // There should always be one for now
//   const newUpvotes = state.upVotesBySBT[key];
//   if (JSON.stringify(state.articleUpVotes) !== JSON.stringify(newUpvotes)) {
//     State.update({ articleUpVotes: newUpvotes });
//   }
// }

let userVote = articleUpVotes.find((vote) => vote.accountId === context.accountId);

// let hasUserVoted = userVote !== undefined;

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
      data.value.metadata.id,
      userVote.value.metadata.id,
      onCommit,
      onCancel
    )
  :
    addUpVote(
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

    <CallLibrary>
      {libSrcArray.map((src) => {
        return callLibs(
          src,
          stateUpdate,
          state.functionsToCallByLibrary,
          { baseAction: baseActions.upVoteBaseAction },
          "Up vote button"
        );
      })}
    </CallLibrary>
  </>
);
