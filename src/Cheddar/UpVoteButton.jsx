//Cheddar.UpVoteButton
const { createUpVote, deleteUpVote } = VM.require(
    'chatter.cheddar.near/widget/lib.upVotes'
) || { createUpVote: () => {}, deleteUpVote: () => {} }
const { getConfig } = VM.require(
    'chatter.cheddar.near/widget/config.CommunityVoice'
) || { getConfig: () => {} }

const {
    isTest,
    authorForWidget,
    reactedElementData,
    widgets,
    disabled,
    upVotes: articleUpVotes,
    baseActions,
    loadUpVotes,
    loadingUpVotes,
    setLoadingUpVotes,
    setUpVotes,
} = props

const data = reactedElementData

let userVote = articleUpVotes
    ? articleUpVotes.find((vote) => vote.accountId === context.accountId)
    : undefined

function getUpVoteButtonClass() {
    if (userVote) {
        return 'primary'
    } else {
        return 'primary outline'
    }
}

function onCommitUpVotes() {
    setLoadingUpVotes(true)
    setUpVotes([])
    setTimeout(() => {
        loadUpVotes()
    }, 3000)
}

function onCancelUpVotes() {
    setLoadingUpVotes(false)
}

function handleUpVote() {
    userVote
        ? deleteUpVote(
              getConfig(isTest),
              userVote.value.metadata.articleId,
              userVote.value.metadata.id,
              onCommitUpVotes,
              onCancelUpVotes
          )
        : createUpVote(
              getConfig(isTest),
              data.value.metadata.id,
              data.value.metadata.author,
              onCommitUpVotes,
              onCancelUpVotes
          )
}

const IconContainer = styled.div`
    transform: rotate(-90deg);
`

const Icon = styled.i`
    margin: 0px !important;
`

const CallLibrary = styled.div`
    display: none;
`

const SpinnerContainer = styled.div`
    height: 1.3rem;
    width: 1.3rem;
    margintop: 2px;
`

return (
    <>
        <div
            title={
                (disabled || !canLoggedUserVote) &&
                "You can't vote since you don't have any SBT"
            }
        >
            {loadingUpVotes ? (
                <Widget
                    src={
                        widgets.views.standardWidgets.newStyledComponents.Input
                            .Button
                    }
                    props={{
                        children: (
                            <div className="d-flex">
                                <SpinnerContainer
                                    className="spinner-border text-secondary"
                                    role="status"
                                >
                                    <span
                                        className="sr-only"
                                        title="Loading..."
                                    ></span>
                                </SpinnerContainer>
                            </div>
                        ),
                        size: 'sm',
                    }}
                />
            ) : (
                <Widget
                    src={
                        widgets.views.standardWidgets.newStyledComponents.Input
                            .Button
                    }
                    props={{
                        children: (
                            <div className="d-flex">
                                <span>{`+${articleUpVotes.length}`}</span>
                                <IconContainer>
                                    <Icon
                                        className={`bi bi-fast-forward-fill ${
                                            !disabled && 'text-success'
                                        }`}
                                    ></Icon>
                                </IconContainer>
                            </div>
                        ),
                        disabled: disabled,
                        className: `${getUpVoteButtonClass()}`,
                        size: 'sm',
                        onClick: handleUpVote,
                    }}
                />
            )}
        </div>
    </>
)
