import React from "react";
import { storiesOf } from "@storybook/react";

import { CodeEditor } from "..";

const stories = storiesOf("Code Editor test", module);

stories.add("CodeEditor", () => {
  return <CodeEditor />;
});
