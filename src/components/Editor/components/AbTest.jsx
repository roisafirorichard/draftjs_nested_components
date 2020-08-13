import React, { useState } from "react";
import { EditorState } from "draft-js";

const updateDataOfBlock = (editorState, block, newData) => {
  const contentState = editorState.getCurrentContent();
  const newBlock = block.merge({
    data: newData
  });
  const newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock)
  });
  return EditorState.push(editorState, newContentState, "change-block-type");
};

export default props => {
  const { data = {}, block, getEditorState, onChange, setReadOnly } = props;
  const [isEnabled, setIsEnabled] = useState(data.isEnabled || false);
  const [value, setValue] = useState("");
  const onClick = () => {
    const data = block.getData();
    const newData = data.set("isEnabled", !isEnabled);
    onChange(updateDataOfBlock(getEditorState(), block, newData));
    setIsEnabled(!isEnabled);
  };

  return (
    <div
      type={data}
      onMouseDown={() => setReadOnly(true)}
      onMouseUp={() => setReadOnly(false)}
      onKeyDown={e => {
        e.stopPropagation();
        setReadOnly(true);
      }}
      onKeyUp={() => setReadOnly(false)}
      onSelect={e => e.stopPropagation()}
    >
      this is an AB test component with custom style{" "}
      <span onClick={onClick}>{isEnabled.toString()}</span>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
};
