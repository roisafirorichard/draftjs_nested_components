export const getEditorData = editorState => {
  return {
    contentState: editorState.getCurrentContent(),
    inlineStyle: editorState.getCurrentInlineStyle(),
    selectionState: editorState.getSelection(),
    hasFocus: editorState.getSelection().getHasFocus(),
    isCollapsed: editorState.getSelection().isCollapsed(),
    startKey: editorState.getSelection().getStartKey(),
    startOffset: editorState.getSelection().getStartOffset(),
    endKey: editorState.getSelection().getEndKey(),
    endOffset: editorState.getSelection().getEndOffset()
  };
};

export const findEntityInSelection = (editorState, entityType) => {
  const { startKey, startOffset, endOffset } = getEditorData(editorState);
  const entities = getEntitiesByBlockKey(editorState, entityType, startKey);
  if (entities.length === 0) return null;

  let selectedEntity = null;
  entities.forEach(entity => {
    const { blockKey, start, end } = entity;
    if (
      blockKey === startKey &&
      ((startOffset > start && startOffset < end) ||
        (endOffset > start && endOffset < end) ||
        (startOffset === start && endOffset === end))
    ) {
      selectedEntity = entity;
    }
  });
  return selectedEntity;
};

export const getEntitiesByBlockKey = (
  editorState,
  entityType = null,
  blockKey = null
) => {
  return getEntities(editorState, entityType).filter(
    entity => entity.blockKey === blockKey
  );
};

export const getEntities = (
  editorState,
  entityType = null,
  selectedEntityKey = null
) => {
  const { contentState } = getEditorData(editorState);
  const entities = [];
  contentState.getBlocksAsArray().forEach(block => {
    let selectedEntity = null;
    block.findEntityRanges(
      character => {
        const entityKey = character.getEntity();
        if (entityKey !== null) {
          const entity = contentState.getEntity(entityKey);
          if (!entityType || (entityType && entity.getType() === entityType)) {
            if (
              selectedEntityKey === null ||
              (selectedEntityKey !== null && entityKey === selectedEntityKey)
            ) {
              selectedEntity = {
                entityKey,
                blockKey: block.getKey(),
                entity: contentState.getEntity(entityKey)
              };
              return true;
            } else {
              return false;
            }
          }
        }
        return false;
      },
      (start, end) => {
        entities.push({ ...selectedEntity, start, end });
      }
    );
  });
  return entities;
};
