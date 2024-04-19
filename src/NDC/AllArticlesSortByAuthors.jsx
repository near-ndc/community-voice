//NDC.AllArticlesSortByAuthors

const {
  articles,
  widgets,
  handleFilterArticles,
  authorForWidget,
} = props;

const articlesAuthors =
  articles.length &&
  Array.from(articles, (article) => article.value.metadata.author);
  
let authors = [...new Set(articlesAuthors)];

let articlesByAuthorsArray = [];
authors.map((author) => {
  let thisAuthorArtciles = articles.filter(
    (article) => article.value.metadata.author == author
  );
  articlesByAuthorsArray.push(thisAuthorArtciles);
});

return (
  <div className="container-fluid">
    <h6>Total authors: {articlesByAuthorsArray.length}</h6>

    <div className="row card-group py-3">
      {articlesByAuthorsArray &&
        articlesByAuthorsArray.map((authorArticlesArray) => {
          const filter = {
            filterBy: "author",
            value: authorArticlesArray[0].value.metadata.author,
          };
          return (
            <Widget
              src={widgets.views.editableWidgets.articlesByAuthorCard}
              props={{
                authorArticlesArray,
                filter,
                handleFilterArticles,
                widgets,
              }}
            />
          );
        })}
    </div>
  </div>
);
