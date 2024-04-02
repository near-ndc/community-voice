const { getComments, createComment, editComment, deleteComment } = VM.require(
  "communityvoice.ndctools.near/widget/lib.comment"
);
const { getConfig } = VM.require("communityvoice.ndctools.near/widget/config.CommunityVoice");

const [comments, setComments] = useState([]);

const isTest = !!props.isTest;

const config = getConfig(isTest);
const articleId = "ayelen.near-1699314338205";

function onCommit() {
  console.log("Executing on commit")
}

function onCancel() {
  console.log("Executing on cancel")
}

function loadComments() {
  getComments(articleId, config).then((newComments) => {
    setComments(newComments);
  });
}

useEffect(() => {
  loadComments();
  setInterval(() => {
    console.log("Loading comments interval", Date.now() / 1000);
    loadComments();
  }, 30000);
}, []);

function newComment() {
  createComment({
    config,
    author: context.accountId,
    commentText: "@ayelen.near Text of the comment",
    replyingTo: articleId, //replyingTo will have the rootId. It can be an articleId or a comment.value.comment.metadata.id.
    articleId,
    onCommit,
    onCancel
  });
}

let commentExampleToEdit = comments[comments.length - 1];

function doEdition() {
  commentExampleToEdit.value.commentData.text = "Text edited 4";
  editComment({
    config,
    comment: commentExampleToEdit,
    onCommit,
    onCancel,
  });
}


function supressComment() {
  deleteComment({
    config,
    commentId: commentExampleToEdit.value.metadata.id,
    articleId: commentExampleToEdit.value.metadata.articleId,
    rootId: commentExampleToEdit.value.metadata.rootId,
    onCommit,
    onCancel,
  });
}

return (
  <>
    <div>
      {errors && errors.length
        ? errors.map((err, index) => {
            return <div key={index}>{err}</div>;
          })
        : "No error"}
    </div>
    <div>Comments: {comments.length}</div>
    {comments && comments.length && (
      <div>
        {comments.map((upVote, index) => {
          return <div key={index}>{JSON.stringify(upVote)}</div>;
        })}
      </div>
    )}
    <button
      onClick={newComment}
    >
      createComment
    </button>
    <button
      onClick={doEdition}
    >
      editComment
    </button>
    <button
      onClick={supressComment}
    >
      deleteComment
    </button>
  </>
);
