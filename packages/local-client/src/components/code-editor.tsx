import "./code-editor.css";
import "./syntax.css";
import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>();

  // 1 onChange is passed here as props from calling code and will be used to only update the state set from the parent index.tsx

  // 2 onEditorDidMount is called whenever the editor is first displayed on the screen.
  // - 1st argument is a function to get the current value out of the editor.  So if we call getValue() from inside
  // onEditorDidMount we will get the current value or whatever is inside the text editor
  // - onEditorDidMount is only invoked when the editor is first dispalyed on the screen
  // - so getValue() function is useful but we are not able to call it when we need to call it

  // 3 So to make sure that we can call getValue() whenever the user changes some text inside of the editor
  // we are going to make use of the 2nd argument to onEditorDidMount.
  // The 2nd argument is a reference to the editor itself ie the actual monaco editor that is being displayed on the screen.

  // 4 So now we can use this direct reference to the monaco editor and add an event listener to it
  // by adding monacoEditor.onDidChangeModelContent(). This is how we get told whenever the editor
  // is updated in some way.
  // - Idea is once the editor is loaded we can 1 set up an event listener directly on the editor
  // and 2 also have access to the getValue() function.
  // - Now whenever something changes we can now make use and call getValue() function to get the current value
  // that is inside the text editor.

  // 5 Now we can make use of our callback onChange() passed as props from index.tsx so we can update
  // the state we called "input" which in turn will be the code to be bundled provided to fetchPlugin(input).

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    // console.log("Initial value on editor mount:", getValue());

    editorRef.current = monacoEditor;

    monacoEditor.onDidChangeModelContent(() => {
      // console.log("Current value on change:",getValue());

      onChange(getValue()); // Callback to update the state "input" from index.tsx that will eventually be bundled.
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    // Syntax highlighting JSX
    const highlighter = new Highlighter(
      //@ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    // console.log(editorRef.current)
    // get current value from editor
    const unformatted = editorRef.current.getModel().getValue();

    // format that value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");

    // set the formatted value back in the editor
    editorRef.current.setValue(formatted);
  };

  // 3 Note that value property here is 'only' an initial value and goes away after it is loaded.
  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark"
        language="javascript"
        height="100%"
        options={{
          wordWrap: "on",
          minimap: {
            enabled: false,
          },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;

/*
// onChange is not a prop we can set up so below will not work with the monaco editor
<MonacoEditor
  onChange = {onChange}

// Instead we get this editorDidMount property to handle get value out of the editor or to be told whenever the value changes inside of it in some way
// We provide a callback to editorDidMount.
<MonacoEditor
  editorDidMount={onEditorDidMount}
*/
