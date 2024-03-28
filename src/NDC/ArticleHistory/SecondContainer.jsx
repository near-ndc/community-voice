// NDC.ArticleHistory.SecondContainer

const {
  pathToCurrentArticle,
  pathToPrevArticle,
  currentBlockHeight,
  currentVersionData,
  allVersionsData,
  prevBlockHeight,
} = props;

if (!pathToCurrentArticle || !pathToPrevArticle || !currentBlockHeight)
  return "send pathToCurrentArticle and pathToPrevArticle and currentBlockHeight in props";

const currentCode = currentVersionData.value.articleData.body;

if (currentCode === null) return "Loading";

const prevCode = prevBlockHeight
  ? allVersionsData.find(
      (versionData) => versionData.blockHeight == prevBlockHeight
    ).body
  : undefined;

if (prevCode === null) return "Loading";

return (
  <Widget
    src={`bozon.near/widget/CodeDiff`}
    props={{ currentCode, prevCode, ...props }}
  />
);
