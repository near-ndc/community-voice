function generateMetadata(metadataHelper) {
  const { idPrefix, author, versionKey } = metadataHelper;
  const now = Date.now();
  return {
    id: `${idPrefix}/${author}/${now}`,
    author,
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
