//Cheddar.AllArticlesSortByAuthors

const {
    finalArticles,
    tabs,
    widgets,
    handleOpenArticle,
    handleFilterArticles,
    authorForWidget,
} = props

const allFinalArticles = finalArticles

const articlesAuthors =
    allFinalArticles.length &&
    Array.from(allFinalArticles, (article) => article.value.metadata.author)

let authors = [...new Set(articlesAuthors)]

let articlesByAuthorsArray = []
authors.map((author) => {
    let thisAuthorArtciles = allFinalArticles.filter(
        (article) => article.value.metadata.author == author
    )
    articlesByAuthorsArray.push(thisAuthorArtciles)
})

return (
    <div className="container-fluid m-0">
        <h6>Total authors: {articlesByAuthorsArray.length}</h6>

        <div className="row card-group">
            {articlesByAuthorsArray &&
                articlesByAuthorsArray.map((authorArticlesArray) => {
                    const filter = {
                        filterBy: 'author',
                        value: authorArticlesArray[0].value.metadata.author,
                    }
                    return (
                        <Widget
                            src={
                                widgets.views.editableWidgets
                                    .articlesByAuthorCard
                            }
                            props={{
                                authorArticlesArray,
                                filter,
                                handleFilterArticles,
                                widgets,
                            }}
                        />
                    )
                })}
        </div>
    </div>
)
