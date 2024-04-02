// NDC.Reactions
const { getReactions, createReaction } = VM.require("communityvoice.ndctools.near/widget/lib.reactions")
const { getConfig } = VM.require("communityvoice.ndctools.near/widget/config.CommunityVoice")

const {
  isTest,
  authorForWidget,
  elementReactedId,
  widgets,
  disabled,
  baseActions,
} = props;
// Don't forget to put space between emoji and text -> "❤️ Positive"
const initialEmoji = "🤍 Like";
// It is important that 'Heart' Positive emoji is first
const emojiArray = [
  "❤️ Positive",
  "🙏 Thank you",
  "💯 Definitely",
  "👀 Thinking",
  "🔥 Awesome",
  "👍 Like",
  "🙌 Celebrate",
  "👏 Applause",
  "⚡ Lightning",
  "⋈ Bowtie",
];

const [reactionsData, setReactionsData] = useState({reactionsStatistics: [], userEmoji: undefined})
const [showEmojiList, setShowEmojiList] = useState(false)
const [loading, setLoading] = useState(true)

function loadReactions() {
  getReactions( getConfig(isTest), elementReactedId, context.accountId).then((reactions) => {
    setReactionsData(reactions)
    setLoading(false)
  })
}

useEffect(() => {
    loadReactions()
    setInterval(() => {
      loadReactions()
    }, 30000)
}, [])

// ================= Mouse Handlers ===============

function handleOnMouseEnter() {
  if (!disabled) {
    setShowEmojiList(true)
  }
}

function handleOnMouseLeave() {
  setShowEmojiList(false)
}

function onCommit() {
  setLoading(true)
  setTimeout(() => {
    loadReactions()
  }, 3000);
}

function onCancel() {
  setLoading(false)
}

function reactListener(emojiToWrite) {
  if (loading || disabled) {
    return;
  }
  setLoading(true)

  // decide to put unique emoji or white heart (unreaction emoji)
  // const emojiToWrite =
  //   emojiMessage === initialEmoji ? emojiArray[0] : emojiMessage;

  const author = context.accountId
  const result = createReaction(getConfig(isTest), emojiToWrite, elementReactedId, author, onCommit, onCancel)
  if(result.error) {
      console.error(result.data)
  }

}

// =============== CSS Styles ===============
const Button = styled.button`
    min-width: fit-content;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: start;
    height: 2.5em;
    padding: 6px 12px;
    margin: 2px 0;
    border: 0;
    border-radius: .375rem;
    ${
      !disabled &&
      `:hover {
      background: #EBEBEB; 
      outline: 1px solid #C6C7C8;
      }`
    }
    
  `;

const SmallReactButton = styled.button`
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: start;
    width: fit-content;
    height: 2.5em;
    padding: 6px 12px;
    margin: 2px 0;
    border: 0;
    border-radius: .375rem;
    ${
      !disabled &&
      `:hover {
      background: #EBEBEB; 
      outline: 1px solid #C6C7C8;
      }`
    }
  `;

const SmallButton = styled.button`
  position: relative;
    border: 0;
    background: transparent;
    width: 35px;
    height: 35px;
    color: ${({ isHeart }) => (isHeart ? "red" : "")};
  `;

const SmallButtonSpan = styled.span`
    font-size: 19px;
    :hover{
        position: absolute;
        font-size: 35px;
        bottom: -5px;
        width: 35px;
        height: 40px;
        transform: translateX(-50%) translateY(-50%);
    }
    
    @media (max-width: 599px) {
        ::before { 
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, .4);
            content: "";}
        :hover{
        ::before { 
            position: absolute;
            width: 100%;
            height: 120%;
            background-color: rgba(255, 255, 255, .4);
            content: "";}
    }
        
    }
  `;

// =============== NEW CSS Styles ===============!!!!!!!!
const EmojiWrapper = styled.div`
    display: inline-block;
    position: relative;
    overflow: visible !important;
    padding-left: 8px;
  `;

const EmojiListWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
    
    background: white;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
    position: absolute;
    right: 0;
    width: 370px;
    max-width: 35vw;
    flex-wrap: wrap;
    display: ${({ show }) => (show ? "flex" : "none")};
    transform: translateY(-10%);
    zIndex: 2;
  `;

const SpinnerContainer = styled.div`
    height: 1rem;
    width: 1rem;
    marginTop: 2px;
  `;

const CallLibrary = styled.div`
    display: none;
  `;

// =============== NEW JSX ===============!!!!!!!!
const Overlay = () => {
  return (
    <EmojiListWrapper
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      show={showEmojiList}
    >
      {emojiArray &&
        emojiArray.map((item) => {
          return (
            <SmallButton
              onClick={() => reactListener(item)}
              isHeart={index === 0}
            >
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    <div className="text-truncate text-start">
                      {item.slice(2)}
                    </div>
                  </Tooltip>
                }
              >
                <SmallButtonSpan>{item.slice(0, 2)}</SmallButtonSpan>
              </OverlayTrigger>
            </SmallButton>
          );
        })}
    </EmojiListWrapper>
  );
};

const Spinner = () => {
  return (
    <SpinnerContainer className="spinner-border text-secondary" role="status">
      <span className="sr-only" title="Loading..."></span>
    </SpinnerContainer>
  );
};

const renderReaction = (item, isInButton) => {
  return (
    ((item.accounts.includes(context.accountId) && isInButton) ||
      (!item.accounts.includes(context.accountId) && !isInButton)) && (
      <span>
        <Widget
          src={widgets.views.standardWidgets.wikiOnSocialDB_TooltipProfiles}
          className={isInButton ? "ps-3" : ""}
          props={{ accounts: item.accounts, emoji: item.emoji }}
        />
      </span>
    )
  );
};

return (
  <>
    <EmojiWrapper>
      {!disabled && (
        <>
          {reactionsData.userEmoji ? (
            <SmallReactButton
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            >
              {loading ? 
                <Spinner /> 
              :
                reactionsData.reactionsStatistics &&
                  reactionsData.reactionsStatistics.map((item) =>
                  renderReaction(item, true)
                  )
              }
            </SmallReactButton>
          ) : (
            <Button
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            >
              {loading ? 
                <Spinner />
              :
                initialEmoji
              }
            </Button>
          )}
        </>
      )}
      <Overlay />
      {reactionsData.reactionsStatistics &&
        reactionsData.reactionsStatistics.map((item) =>
          renderReaction(item, false)
        )}
    </EmojiWrapper>
  </>
);
