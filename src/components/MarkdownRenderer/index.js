import { marked } from "marked";

function MarkdownRenderer({ markdownText }) {
    const safeText = typeof markdownText === "string" ? markdownText : "";
  return (
    <div dangerouslySetInnerHTML={{ __html: marked.parse(safeText) }} />
  );
}

export default MarkdownRenderer;
