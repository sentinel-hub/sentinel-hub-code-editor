import React from "react";

export default function useSentinelHubUseCases(editorRef) {
  function manuallyInsertEvalscript(evalscript = "") {
    if (!editorRef.current) {
      throw new Error("Editor ref is undefined");
    }

    const fullRange = editorRef.current.getModel().getFullModelRange();

    editorRef.current.executeEdits(null, [
      {
        text: "",
        range: fullRange,
      },
    ]);

    var line = editorRef.current.getPosition();
    var range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
    var id = { major: 1, minor: 1 };
    var text = evalscript;
    var op = {
      identifier: id,
      range: range,
      text: text,
      forceMoveMarkers: true,
    };
    editorRef.current.executeEdits("my-source", [op]);
  }
  return {
    manuallyInsertEvalscript,
  };
}
