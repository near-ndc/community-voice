const tagsPattern = "*/profile/tags/*";
const placeholder = props.placeholder ?? "Tags";
const initialTagsObject = props.initialTagsObject || {};

const tagsOptions = {};

const normalizeTag = (tag) =>
  tag
    .replaceAll(/[- \.]/g, "_")
    .replaceAll(/[^\w]+/g, "")
    .replaceAll(/_+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase()
    .trim("-");

const tagsCount = {};

const processTagsObject = (obj) => {
  Object.entries(obj).forEach((kv) => {
    if (typeof kv[1] === "object") {
      processTagsObject(kv[1]);
    } else {
      const tag = normalizeTag(kv[0]);
      tagsCount[tag] = (tagsCount[tag] || 0) + 1;
    }
  });
};

const getTags = () => {
  processTagsObject(tagsOptions);
  const tags = Object.entries(tagsCount);
  tags.sort((a, b) => b[1] - a[1]);
  return tags.map((t) => ({
    name: t[0],
    count: t[1],
  }));
};

if (!state.allTags) {
  initState({
    allTags: getTags(),
    tags: Object.keys(initialTagsObject).map((tag) => ({
      name: normalizeTag(tag),
    })),
    originalTags: Object.fromEntries(
      Object.keys(initialTagsObject).map((tag) => [tag, null])
    ),
    id: `tags-selector-${Date.now()}`,
  });
}

const setTags = (tags) => {
  props.forceClear && props.stateUpdate({ clearTags: false });
  tags = tags.map((o) => {
    o.name = normalizeTag(o.name);
    return o;
  });
  State.update({ tags });
  if (props.setTagsObject) {
    props.setTagsObject(
      Object.assign({}, Object.fromEntries(tags.map((tag) => [tag.name, ""])))
    );
  }
};

return (
  <>
    <Typeahead
      id={state.id}
      multiple
      labelKey="name"
      onChange={setTags}
      options={state.allTags}
      placeholder={placeholder}
      selected={props.forceClear ? [] : state.tags}
      positionFixed
      allowNew
    />
    {props.debug && (
      <div>
        Debugging tags:
        <pre>{JSON.stringify(state.tags)}</pre>
      </div>
    )}
  </>
);
