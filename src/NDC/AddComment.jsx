// NDC.AddComment

const {
  widgets,
  isTest,
  article,
  onCloseModal,
  originalComment,
  isReplying,
  username,
  placement,
  rootCommentId,
  replyingTo,
  callLibs,
  baseActions,
  editionData,
} = props;

const rootId = rootCommentId ?? article.id; //To render in the proper location

const commentId = editionData ? editionData.value.comment.commentId : undefined; //(OPTIONAL) to edit comment

const isEdition = commentId !== undefined;

const ModalCard = styled.div`
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
  `;
const CommentCard = styled.div`
    display: flex;
    width: 400px;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid transparent;
    margin-left: auto;
    margin-right: auto;
    margin-buttom: 50%;
    @media only screen and (max-width: 480px) {
      width: 90%;
    }
  `;
const H1 = styled.h1`
    color: black;
    font-size: 14px;
    font-weight: 500;
  `;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    align-self: stretch;
  `;
const CommentBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
  `;
const BComment = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  `;
const BCommentmessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  `;
const BCMHeader = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    gap: 8px;
  `;
const BCMProfile = styled.div`
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    flex-direction: row;
    border-radius: 29px;
    background: #d0d6d9;
    text-align: center;
  `;
const BCMProfileimg = styled.img`
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    vertical-align: initial;
  `;
const BCMProfileUsername = styled.label`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    color: #000;
    font-size: 14px;
  
    font-style: normal;
    font-weight: 500;
    line-height: 120%;
  `;
const BCMMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-self: stretch;
    color: #686b6d;
    font-size: 14px;
  
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
  `;
const BFooter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
  `;
const BFootercont = styled.div`
    display: flex;
    align-items: center;
    align-self: stretch;
  `;
const BFootercontTime = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1 0 0;
  `;
const BFCTimetext = styled.div`
    display: flex;
    height: 19.394px;
    flex-direction: column;
    justify-content: center;
    flex: 1 0 0;
    color: #000;
    font-size: 14px;
  
    font-style: normal;
    font-weight: 300;
    line-height: normal;
  `;
const BFCButton = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
  `;
const BFCButtonitem = styled.button`
    display: flex;
    padding: 2px 12px;
    align-items: center;
    gap: 6px;
    border-radius: 4px;
    border-width: 1px;
    border: solid 1px #9333ea;
  
    background-image: linear-gradient(#fff, #fff),
      radial-gradient(circle at top left, #f0e1ce, #f0e1ce);
    background-origin: border-box;
    background-clip: padding-box, border-box;
  `;
const BFCBIText = styled.label`
    font-size: 12px;
  
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: #9333ea;
    cursor: pointer;
  `;
const NewComment = styled.textarea`
    width: 100%;
    display: flex;
    height: 100px;
    padding: 9px 10px 0px 10px;
    align-items: flex-start;
  
    gap: 10px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid #d0d6d9;
    background: #fff;
  
    font-size: 12px;
  
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
  `;
const CommentFooter = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: end;
    gap: 16px;
    align-self: stretch;
  `;
const CFCancel = styled.button`
    display: flex;
    width: 107px;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #9333ea;
    border-radius: 10px;
    border-width: 1px;
    border: solid 1px #9333ea;
  
    background-image: linear-gradient(#fff, #fff),
      radial-gradient(circle at top left, #f0e1ce, #f0e1ce);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    @media only screen and (max-width: 480px) {
      width: 100%;
    }
  `;

const CFSubmit = styled.button`
    display: flex;
    width: 107px;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #000;
    display: flex;
    width: 107px;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
    border-width: 1px;
    border: solid 1px transparent;
  
    background-image: linear-gradient(#ffd50d, #ffd50d),
      radial-gradient(circle at top left, #f0e1ce, #f0e1ce);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    @media only screen and (max-width: 480px) {
      width: 100%;
    }
  `;

const Spinner = styled.div`
    height: 1rem;
    width: 1rem;
  `;

const CallLibrary = styled.div`
    display: none;
  `;

const libSrcArray = [widgets.libs.libComment];

function stateUpdate(obj) {
  State.update(obj);
}

State.init({
  theme,
  reply: "",
  cancel: false,
  e_message: "",
  functionsToCallByLibrary: {
    comment: [],
  },
});

function getShouldDisplayOriginalComment() {
  return (
    (!editionData && replyingTo) ||
    (editionData &&
      replyingTo &&
      editionData.value.comment.id !== editionData.value.comment.rootId)
  );
}

function getInitialText() {
  if (editionData) {
    if (!state.reply || editionData.value.comment.text === state.reply) {
      return editionData.value.comment.text;
    }
  } else if (state.reply && state.reply !== editionData.value.comment.text) {
    return state.reply;
  } else {
    return "Reply here";
  }
}

const SetText = (txt) => {
  State.update({ shareText: txt });
};

const renderSpinner = () => {
  return <Spinner className="spinner-border" role="status"></Spinner>;
};

function onCommit() {
  State.update({ showSpinner: false });
  onCloseModal();
}

function onCancel() {
  State.update({ showSpinner: false });
}

function handleSubmitButton() {
  if (state.showSpinner) {
    return () => {};
  } else {
    if (isEdition) {
      return editCommentListener;
    } else {
      return addCommentListener;
    }
  }
}

function onClickAddComment() {
  State.update({ showSpinner: true });
}

function addCommentListener() {
  const newLibCalls = Object.assign({}, state.functionsToCallByLibrary);

  const comment = {
    text: state.reply,
    timestamp: Date.now(),
    rootId,
  };

  newLibCalls.comment.push({
    functionName: "createComment",
    key: "createComment",
    props: {
      comment,
      replyingTo,
      articleId: article.id,
      onClick: onClickAddComment,
      onCommit,
      onCancel,
    },
  });
  State.update({ functionsToCallByLibrary: newLibCalls, reply: "Reply here" });
}

function editCommentListener() {
  const newLibCalls = Object.assign({}, state.functionsToCallByLibrary);

  const comment = {
    text: state.reply,
    timestamp: editionData.value.comment.timestamp ?? Date.now(),
    rootId,
    commentId,
  };

  newLibCalls.comment.push({
    functionName: "editComment",
    key: "editComment",
    props: {
      comment,
      articleId: article.id,
      onClick: onClickAddComment,
      onCommit,
      onCancel,
    },
  });
  State.update({ functionsToCallByLibrary: newLibCalls, reply: "Reply here" });
}

return (
  <ModalCard>
    <CommentCard>
      <H1>
        {isReplying
          ? "Reply to comment"
          : isEdition
          ? "Edit comment"
          : "Add a Comment"}
      </H1>
      <Container>
        {getShouldDisplayOriginalComment() && (
          <>
            <CommentBody>
              <BComment>
                <BCommentmessage>
                  <BCMHeader>
                    <BCMProfile>
                      <Widget
                        src={widgets.views.standardWidgets.profileImage}
                        props={{
                          accountId: replyingTo,
                          imageClassName: "rounded-circle w-100 h-100",
                          style: { width: "25px", height: "25px" },
                        }}
                      />
                    </BCMProfile>
                    <BCMProfileUsername>
                      {replyingTo ? "@" + replyingTo : "@user.near"}
                    </BCMProfileUsername>
                  </BCMHeader>
                  <BCMMessage>
                    {originalComment && originalComment.value.comment.text}
                  </BCMMessage>
                </BCommentmessage>
              </BComment>
              <BFooter>
                <label>{state.e_message}</label>
                <BFootercont>
                  <BFootercontTime>
                    <img
                      alt="schedule"
                      src={
                        "https://emerald-related-swordtail-341.mypinata.cloud/ipfs/QmP3uRUgZtqV3HAgcZoYaDA6JSPpFcpqULvgenWUs3ctSP"
                      }
                      style={{ width: "14px", height: "14px" }}
                    />
                  </BFootercontTime>
                </BFootercont>
              </BFooter>
            </CommentBody>
            <hr
              styled={{
                width: "100%",
                height: "0px",
                border: "1px solid rgba(130, 134, 136, 0.20)",
                flex: "none",
                background: "rgba(130, 134, 136, 0.20)",
                margin: "0px",
                flexGrow: "0",
              }}
            />
          </>
        )}
        <div className="w-100 col">
          <Widget
            src={widgets.views.standardWidgets.markownEditorIframe}
            props={{
              initialText: getInitialText(),
              onChange: (e) =>
                State.update({
                  reply: e,
                }),
            }}
          />
        </div>
        <CommentFooter>
          <Widget
            src={widgets.views.standardWidgets.styledComponents}
            props={{
              Button: {
                text: "Cancel",
                className: "secondary dark",
                onClick: onCloseModal,
              },
            }}
          />
          <Widget
            src={widgets.views.standardWidgets.styledComponents}
            props={{
              Button: {
                text: state.showSpinner ? "" : "Submit",
                onClick: handleSubmitButton(),
                icon: state.showSpinner ? renderSpinner() : <></>,
              },
            }}
          />
        </CommentFooter>
      </Container>
    </CommentCard>
    <CallLibrary>
      {libSrcArray.map((src) => {
        return callLibs(
          src,
          stateUpdate,
          state.functionsToCallByLibrary,
          { baseAction: baseActions.commentBaseAction },
          "AddComment"
        );
      })}
    </CallLibrary>
  </ModalCard>
);
