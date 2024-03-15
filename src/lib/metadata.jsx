function generateMetadata(metadataHelper) {
  const { idPrefix, author, sbt, versionKey } = metadataHelper;
  const now = Date.now();
  return {
    id: `${idPrefix}/${author}/${now}`,
    author,
    sbt, // Check lib.SBT -> getSBTWhiteList -> prop value
    createdTimestamp: now,
    lastEditTimestamp: now,
    versionKey, // Check `const versions` -> Object.keys(versions)
  };
}

function updateMetadata(previousMetadata, versionKey) {
  return {
    ...previousMetadata,
    lastEditTimestamp: Date.now(),
    versionKey,
  };
}

function buildDeleteMetadata(id) {
  return {
    id,
    isDelete: true,
    deleteTimestamp: Date.now(),
  };
}

return { generateMetadata, updateMetadata, buildDeleteMetadata };
