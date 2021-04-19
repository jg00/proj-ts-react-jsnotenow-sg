import "./action-bar.css";
import { useActions } from "../hooks/use-actions";
import ActionBarButton from "./action-bar-button";

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  const ActionBarConfig = [
    {
      iconClassName: "fas fa-arrow-up",
      onClick: () => moveCell(id, "up"),
    },
    {
      iconClassName: "fas fa-arrow-down",
      onClick: () => moveCell(id, "down"),
    },
    {
      iconClassName: "fas fa-times",
      onClick: () => deleteCell(id),
    },
  ];

  const ActionButtons = ActionBarConfig.map((config, index) => {
    return (
      <ActionBarButton
        key={index}
        iconClassNames={config.iconClassName}
        onClick={config.onClick}
      />
    );
  });

  return <div className="action-bar">{ActionButtons}</div>;
};

export default ActionBar;
