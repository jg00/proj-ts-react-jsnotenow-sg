interface ActionBarButtonProps {
  iconClassNames: string;
  onClick: () => void;
}

const ActionBarButton: React.FC<ActionBarButtonProps> = ({
  iconClassNames,
  onClick,
}) => {
  return (
    <button className="button is-primary is-small" onClick={onClick}>
      <span className="icon">
        <i className={iconClassNames}></i>
      </span>
    </button>
  );
};

export default ActionBarButton;
