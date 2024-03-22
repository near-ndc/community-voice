const { getComments } = VM.require("sayalot.near/widget/lib.comment");
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice");

const [comments, setComments] = useState([]);

const isTest = !!props.isTest;

const config = getConfig(isTest);

function loadComments() {
  const articleId = "ayelen.near-1699314338205";
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

let commentExampleToEdit = comments[0]
commentExampleToEdit.commentData.commentText = "Text edited"

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
      onClick={() => {
        createComment(
          config,
          context.accountId,
          "Text of the comment",
          "ayelen.near", //replyingTo will have the userName of the person you are responding to in case it is a reply. If not, use an empty string.
          "ayelen.near-1699314338205",
          ()=>{console.log("Create comment clicked")},
          ()=>{console.log("Comment created")},
          ()=>{console.log("Comment creation canceled")},
        );
      }}
    >
      createComment
    </button>
    <button
      onClick={() => {
        editComment(
          config,
          commentExampleToEdit,
          ()=>{console.log("Edit comment clicked")},
          ()=>{console.log("Comment edited")},
          ()=>{console.log("Comment edition canceled")},
        );
      }}
    >
      editComment
    </button>
    <button
      onClick={() => {
        deleteComment(
          config,
          commentExampleToEdit.metadata.id,
          commentExampleToEdit.metadata.articleId,
          ()=>{console.log("Delete comment clicked")},
          ()=>{console.log("Comment deleted")},
          ()=>{console.log("Comment delet canceled")},
        );
      }}
    >
      deleteComment
    </button>
  </>
);
