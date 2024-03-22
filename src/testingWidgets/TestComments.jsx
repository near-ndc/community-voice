const { getComments, createComment, editComment, deleteComment } = VM.require(
  "sayalot.near/widget/lib.comment"
);
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice");

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
    console.log("newComments: ", newComments)
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
    replyingTo: "ayelen.near", //replyingTo will have the userName of the person you are responding to in case it is a reply. If not, use undefined.
    articleId,
    onCommit,
    onCancel
  });
}

function doEdition() {
  editComment({
    config,
    comment: commentExampleToEdit,
    onCommit: () => {
      console.log("Comment edited");
    },
    onCancel: () => {
      console.log("Comment edition canceled");
    }
  });
}

let commentExampleToEdit = comments[0];
if (commentExampleToEdit) {
  commentExampleToEdit.value.comment.text = "Text edited";
}

function supressComment() {
  deleteComment({
    config,
    commentId: commentExampleToEdit.metadata.id,
    articleId: commentExampleToEdit.metadata.articleId,
    onCommit: () => {
      console.log("Comment deleted");
    },
    onCancel: () => {
      console.log("Comment delet canceled");
    }
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
