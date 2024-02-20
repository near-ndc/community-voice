// NDC.CommentView

const {
  widgets,
  data,
  isTest,
  authorForWidget,
  isReply,
  orginalCommentData,
  canLoggedUserCreateComment,
  articleSbts,
  callLibs,
  baseActions,
  sharedCommentId,
  articleToRenderData,
} = props;

State.init({
  showModal: false,
  hasReply: false,
  functionsToCallByLibrary: {
    comment: [],
  },
});

const libSrcArray = [widgets.libs.libComment];

function stateUpdate(obj) {
  State.update(obj);
}

const CallLibrary = styled.div`
  display: none;
`;

const CommentCard = styled.div`
    margin-left: ${isReply ? "2rem" : "0"};
    display: flex;
    padding: 14px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    border-radius: "10px"};
    background: ${
      sharedCommentId === data.value.comment.commentId
        ? "rgba(194, 205, 255, 0.8)"
        : "#fff"
    };
    width: 100%;
  `;

const CommentCardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  `;

const CommentUserContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
  `;

const CommentEdition = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
  `;

const ProfileImageComment = styled.img`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 20px;
  `;

const CommentUser = styled.p`
    color: #000;
    font-size: 12px;
    font-weight: 500;
    line-height: 120%;
    margin: 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

const ReplyCounterDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
  `;

const ReplyIconPurple = styled.img`
    width: 14px;
    height: 14px;
  `;

const ReplyCounterText = styled.p`
    color: #000;
    font-size: 10px;
    font-weight: 500;
    margin: 0px;
  `;

const CommentCardContent = styled.p`
    color: #585b5c;
    font-size: 12px;
    line-height: 18px;
    display: flex;
    flex-direction: column;
    margin: 0px;
  `;

const CommentCardLowerSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    width: 100%;
  `;

const TimestampCommentDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1 0 0;
  `;

const TimestampIconComment = styled.img`
    width: 12px;
    height: 12px;
  `;

const TimestampTextComment = styled.span`
    color: #000;
    font-size: 10px;
    font-weight: 300;
    margin: 0px;
  `;

const EditedIndication = styled.span`
    font-size: 12px;
    margin: 0px;
`;

const DeleteCommentButton = styled.button`
    display: flex;
    width: 28px;
    padding: 2px 12px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    align-self: stretch;
    border-radius: 4px;
    border: 1px solid #c23f38;
    background: #f1d6d5;
  `;

const DeleteCommentIcon = styled.img`
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  `;

const ShareCommentButton = styled.button`
    display: flex;
    width: 28px;
    height: 28px;
    padding: 2px 12px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 4px;
    border: solid 1px transparent;
    background-image: linear-gradient(white, white),
      radial-gradient(circle at top left, #9333ea 0%, #4f46e5 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
  `;

const ShareCommentIcon = styled.img`
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  `;

const ReplyCommentButtonDisabled = styled.div`
    display: flex;
    padding: 2px 12px;
    cursor: not-allowed;
    background: rgb(195, 202, 206);
    color: rgb(130, 134, 136);
    border: 0px;
    align-items: center;
    gap: 6px;
    align-self: stretch;
    border-radius: 4px;
  `;

const ReplyCommentButtonActive = styled.div`
    cursor: pointer;
    display: flex;
    padding: 2px 12px;
    align-items: center;
    gap: 6px;
    align-self: stretch;
    border-radius: 4px;
    background: var(--buttons-yellow-default, #ffd50d);
  `;

const ReplyCommentText = styled.p`
    color: var(--primary-black, #000);
    font-size: 12px;
    font-weight: 500;
    line-height: 24px;
    margin: 0px;
  `;

const CommentReplySeparator = styled.hr`
    height: 0px;
    margin: 16px 0 16px 0;
    border: 1px solid rgba(208, 214, 217, 1);
  `;

const ReplyContainer = styled.div`
    display: flex;
    width: 260px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin: 0 0 0 35px;
  `;

const ReplyHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;
  `;

const ReplyContent = styled.p`
    color: #828688;
    font-size: 12px;
    line-height: 120%;
    margin: 0px;
  `;

const ReplyLowerSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4px;
  `;

const ReplyButtonSection = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
  `;

const DeleteReplyButton = styled.button`
    display: flex;
    padding: 2px 12px;
    align-items: center;
    gap: 6px;
    align-self: stretch;
    border-radius: 4px;
    border: 1px solid #c23f38;
    background: #f1d6d5;
  `;

const DeleteReplyText = styled.p`
    color: #c23f38;
    font-size: 12px;
    font-weight: 500;
    line-height: 24px;
    margin: 0px;
  `;

const AnswerContainer = styled.div`
    width: 96%;;
  `;

const renderDeleteModal = () => {
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
  const ModalContainer = styled.div`
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
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    align-self: stretch;
  `;
  const Footer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: end;
    gap: 16px;
    align-self: stretch;
  `;

  return (
    <ModalCard>
      <ModalContainer>
        <Container>
          <h3 className="w-100">Delete this comment?</h3>
          <Footer>
            <Widget
              src={
                widgets.views.standardWidgets.newStyledComponents.Input.Button
              }
              props={{
                children: "Yes, delete it",
                onClick: deleteCommentListener,
                variant: "danger",
              }}
            />
            <Widget
              src={
                widgets.views.standardWidgets.newStyledComponents.Input.Button
              }
              props={{
                children: "Cancel",
                onClick: closeDeleteCommentModal,
                variant: "info outline",
              }}
            />
          </Footer>
        </Container>
      </ModalContainer>
    </ModalCard>
  );
};

function onCommitDeletArticle() {
  State.update({
    showDeleteModal: false,
  });
}

function closeDeleteCommentModal() {
  State.update({
    showDeleteModal: false,
  });
}

function deleteCommentListener() {
  //To test without commiting use the next line and comment the rest
  // onCommit();
  State.update({ saving: true });
  const comment = data.value.comment;

  const newLibsCalls = Object.assign({}, state.functionsToCallByLibrary);
  newLibsCalls.comment.push({
    functionName: "deleteComment",
    key: "deletedComment",
    props: {
      comment,
      articleId: articleToRenderData.id,
      onCommit: onCommitDeletcomment,
      onCancel: closeDeleteCommentModal,
    },
  });

  State.update({ functionsToCallByLibrary: newLibsCalls });
}

function handleDeleteComment() {
  State.update({
    showDeleteModal: true,
  });
}

function closeModal() {
  State.update({ showModal: false });
}

function getProperRootId(isEdition) {
  if (isEdition) {
    return data.value.comment.rootId;
  }

  if (data.answers) {
    return data.value.comment.commentId;
  } else {
    return data.value.comment.rootId;
  }
}

function handleEditComment() {
  State.update({
    showModal: true,
    editionData: data,
    rootId: getProperRootId(true),
  });
}

function handleReplyListener() {
  if (!canLoggedUserCreateComment) {
    return;
  }

  State.update({
    showModal: true,
    editionData: undefined,
    rootId: getProperRootId(false),
  });
}

return (
  <>
    {state.showDeleteModal && renderDeleteModal()}
    <CommentCard id={data.value.comment.commentId}>
      <CommentCardHeader>
        <CommentUserContent>
          <Widget
            src={widgets.views.standardWidgets.newStyledComponents.Element.User}
            props={{
              accountId: data.accountId,
              options: {
                showHumanBadge: true,
                showImage: true,
                showSocialName: true,
                shortenLength: 15,
                size: "md",
              },
            }}
          />
        </CommentUserContent>

        {context.accountId == data.accountId && (
          <CommentEdition>
            <Widget
              src={
                widgets.views.standardWidgets.newStyledComponents.Input.Button
              }
              props={{
                children: (
                  <div className="d-flex justify-content-center align-items-center">
                    <span className="mx-2">Edit</span>
                    <i className="bi bi-pencil"></i>
                  </div>
                ),
                className: `info outline mt-2`,
                onClick: () => handleEditComment(),
              }}
            />
            <Widget
              src={
                widgets.views.standardWidgets.newStyledComponents.Input.Button
              }
              props={{
                children: (
                  <div className="d-flex justify-content-center align-items-center">
                    <i className="bi bi-trash"></i>
                  </div>
                ),
                className: `danger outline mt-2`,
                onClick: () => handleDeleteComment(),
              }}
            />
          </CommentEdition>
        )}
      </CommentCardHeader>
      <CommentCardContent>
        <Widget
          src={widgets.views.standardWidgets.socialMarkdown}
          props={{
            text: data.value.comment.text,
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
      </CommentCardContent>
      <CommentCardLowerSection>
        <TimestampCommentDiv>
          <i className="bi bi-clock" />
          <TimestampTextComment>
            {new Date(data.value.comment.timestamp).toDateString()}
          </TimestampTextComment>
          {data.isEdition && (
            <EditedIndication className="text-muted">(edited)</EditedIndication>
          )}
        </TimestampCommentDiv>
        <div>
          {state.showModal && (
            <Widget
              src={widgets.views.editableWidgets.addComment}
              props={{
                article: articleToRenderData,
                originalComment: data,
                widgets,
                isTest,
                replyingTo: data.accountId,
                placement: "bottom",
                onCloseModal: closeModal,
                callLibs,
                baseActions,
                editionData: state.editionData,
                rootCommentId: state.rootId,
              }}
            />
          )}
          {articleSbts.length > 0 && (
            <>
              <Widget
                src={
                  widgets.views.standardWidgets.newStyledComponents.Input.Button
                }
                props={{
                  children: (
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="mx-1">Reply</span>
                      <i className="bi bi bi-reply"></i>
                    </div>
                  ),
                  disabled: !canLoggedUserCreateComment,
                  size: "sm",
                  className: "info outline",
                  onClick: handleReplyListener,
                }}
              />
            </>
          )}
        </div>
        <Widget
          src={widgets.views.editableWidgets.reactions}
          props={{
            widgets,
            isTest,
            authorForWidget,
            elementReactedId: data.value.comment.commentId,
            disabled: !canLoggedUserCreateComment,
            callLibs,
            baseActions,
            sbtsNames: articleSbts,
          }}
        />
      </CommentCardLowerSection>
    </CommentCard>
    {!isReply && (
      <>
        {data.answers.length > 0 && (
          <i className="bi bi-arrow-return-right"></i>
        )}
        {data.answers.map((answer) => {
          return (
            <AnswerContainer>
              <Widget
                src={widgets.views.editableWidgets.commentView}
                props={{
                  widgets,
                  data: answer,
                  orginalCommentData: data,
                  isTest,
                  authorForWidget,
                  isReply: true,
                  canLoggedUserCreateComment,
                  articleSbts,
                  callLibs,
                  baseActions,
                  sharedCommentId,
                  articleToRenderData,
                }}
              />
            </AnswerContainer>
          );
        })}
      </>
    )}
    <CallLibrary>
      {libSrcArray.map((src) => {
        return callLibs(
          src,
          stateUpdate,
          state.functionsToCallByLibrary,
          { baseAction: baseActions.commentBaseAction },
          "NDC.CommentView"
        );
      })}
    </CallLibrary>
  </>
);
