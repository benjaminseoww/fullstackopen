import { useState } from "react";

interface AltToggableProps {
  showButtonLabel: string;
  children: JSX.Element;
}

export default function AltToggable(props: AltToggableProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const showWhenVisible = { display: visible ? "" : "none" };
  const hideWhenVisible = { display: visible ? "none" : "" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div style={hideWhenVisible}>
        <button className="rounded-lg border-2 bg-gray-200 px-4" onClick={toggleVisibility}>{props.showButtonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button className="rounded-lg border-2 bg-gray-200 px-4" onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  );
}
