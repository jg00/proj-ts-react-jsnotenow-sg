import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { order, data } = state.cells;
    const orderedCells = order.map((id) => data[id]); // access cell.content to all cells

    const showFunc = `
    import _React from 'react'
    import _ReactDOM from 'react-dom'

    var show = (value) => {
      const root = document.querySelector('#root')
      
      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          _ReactDOM.render(value, root)
        } else {
          root.innerHTML = JSON.stringify(value)
        }
      } else {
        root.innerHTML = value
      }
    }
  `;

    // Redefined show() function
    const showFuncNoop = `var show = () => {}`;

    const cumulativeCode = [];

    for (let c of orderedCells) {
      if (c.type === "code") {
        // Associate appropriate show() function prior to every cell. Inject real version of the showFunc to current code cell edited.
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          // Otherwise this must be a previous cell
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode; // ex: ["console.log('a')", "console.log('b')"]
  }).join("\n");
};
