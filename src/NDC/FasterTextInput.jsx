const {
  title,
  setTitle,
  editable,
  placeholder,
} = props

return (
  <input
    className="form-control mt-2"
    value={title}
    readonly={editable ? "readonly" : false}
    disabled={editable ? "disabled" : false}
    placeholder={placeholder}
    onChange={(e) => {
      setTitle(e.target.value)
    }}
  />
);