//NDC.AllArticlesSortByAuthors

const {
  finalArticles,
  tabs,
  widgets,
  handleOpenArticle,
  handleFilterArticles,
  authorForWidget,
} = props;

const finalArticlesBySbt = finalArticles;
const allFinalArticles = [];

Object.values(finalArticlesBySbt).forEach((sbt) => {
  const allArticlesOnSbt = sbt.map((article) => article);
  allFinalArticles = [...allFinalArticles, ...allArticlesOnSbt];
});

const articlesAuthors =
  allFinalArticles.length &&
  Array.from(allFinalArticles, ({ author }) => author);

let authors = [...new Set(articlesAuthors)];

let articlesByAuthorsArray = [];
authors.map((author) => {
  let thisAuthorArtciles = allFinalArticles.filter(
    (article) => article.author == author
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
            value: authorArticlesArray[0].author,
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
