
const {
  tags,
  setTags,
  clearTags,
  setClearTags
} = props

const normalizeTag = (tag) =>
  tag
    .replaceAll(/[- \.]/g, "_")
    .replaceAll(/[^\w]+/g, "")
    .replaceAll(/_+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase()
    .trim("-");

const [editorTags, setEditorTags] = useState(tags.map((tag) => ({
  name: normalizeTag(tag),
})))

useEffect(() => {
  if(clearTags){
    handleTagsChange([])
    setClearTags(false)
  }
}, [clearTags])


const handleTagsChange = (tags) => {
  tags = tags.map((tag) => {
    tag.name = normalizeTag(tag.name);
    return tag;
  });
  setEditorTags(tags);
  setTags(tags.map((tag) => tag.name))
};

return (
  <>
    <Typeahead
      id={`tags-selector-${Date.now()}`}
      multiple
      labelKey="name"
      onChange={handleTagsChange}
      options={[]}
      placeholder="Input tags"
      selected={editorTags}
      positionFixed
      allowNew
    />
  </>
);
