import React from "react";
import AbTest from "./AbTest";

export default props => {
  const { block, contentState, blockProps } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const type = entity.getType();
  switch (type) {
    case "ABTEST":
      return (
        <AbTest
          {...props}
          {...blockProps}
          entity={entity}
          contentState={contentState}
        />
      );
    default:
      return <pre>pick a type</pre>;
  }
};
