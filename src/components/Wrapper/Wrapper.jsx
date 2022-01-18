import React, { useEffect } from "react";
import { CodeEditor } from "../CodeEditor/CodeEditor";

export default function Wrapper() {
  useEffect(() => {
    const newNode = document.createElement("div");
    newNode.setAttribute("id", "select-root");
    const rootNode = document.querySelector("#root");
    rootNode.before(newNode);
  }, []);
  return (
    <div
      style={{
        height: "200vh",
        display: "flex",
        alignItems: "center",
        width: 400,
        background: "black",
      }}
      className="panel"
    >
      <textarea name="" id="" value="HEHEHEHEHE" cols="30" rows="10"></textarea>
      <div style={{ height: 400 }}>
        <CodeEditor portalId="select-root" />
        <h1 style={{ color: "white" }}>
          Wrapper to simulate parent div in apps like EOB and RB
        </h1>
      </div>
    </div>
  );
}
