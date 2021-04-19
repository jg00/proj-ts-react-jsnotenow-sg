import "./preview.css";
import { useRef, useEffect } from "react";

interface PreviewProps {
  code: string;
  err: string;
}

// IFrame content with event listener.
const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root')
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
            console.error(err)
          }

          window.addEventListener('error', (event)=>{
            event.preventDefault()
            handleError(event.error.message)
          })

          window.addEventListener('message', (event) => {
            try {
              eval(event.data)
            } catch (err){
              handleError(err)
            }
          }, false)
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;

    // Delay postMessage to allow for browser to update the srcdoc
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        title="preview"
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
