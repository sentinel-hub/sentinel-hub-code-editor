import React from "react";
import { storiesOf } from "@storybook/react";

import { CodeEditor } from "../components/CodeEditor/CodeEditor";
import Wrapper from "../components/Wrapper/Wrapper";

const stories = storiesOf("Code Editor test", module);

stories.add("CodeEditor", () => {
  return <Wrapper />;
});
  