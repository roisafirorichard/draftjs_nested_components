import React, { useState } from "react";
import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw
} from "draft-js";
import styled from "styled-components";
import { getEditorData } from "./utils/editor";
import { Atomic } from "./components";
import draftJsCss from "../../utils/draftJsCss";

const StyledWrapper = styled.div`
  & {
    ${draftJsCss}
    border: 1px solid #dedede;
    padding: 10px;
    border-radius: 2px;
  }
`;

export default () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [readOnly, setReadOnly] = useState(false);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onBoldClick = () =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));

  const addCustomReactComponent = (type, editorState, data = {}) => () => {
    const contentState = editorState.getCurrentContent();
    const newContentState = contentState.createEntity(type, "IMMUTABLE", data);
    const entityKey = newContentState.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: newContentState
    });
    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

  const { contentState } = getEditorData(editorState);
  return (
    <>
      <StyledWrapper>
        <button onClick={onBoldClick}>Bold</button>
        <button onClick={addCustomReactComponent("ABTEST", editorState)}>
          inject react Component
        </button>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          readOnly={readOnly}
          blockRendererFn={block => {
            if (block.getType() === "atomic") {
              return {
                component: Atomic,
                editable: false,
                props: {
                  getEditorState: () => editorState,
                  onChange: es => setEditorState(es),
                  setReadOnly
                }
              };
            }
          }}
        />
      </StyledWrapper>
      <pre>{JSON.stringify(convertToRaw(contentState), null, 2)}</pre>
    </>
  );
};
