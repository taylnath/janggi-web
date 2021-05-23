
// square component
function Square(props) {
  // side length (in pixels)
  let side = 60;
  // string for transition
  let transitionString = `background-color ${String(props.transitionTime)}s ease-in-out`;

  return (
    <div 
      style={{
        backgroundColor: props.backgroundColor,
        width: `${side - 22}px`,
        height: `${side - 22}px`,
        textAlign:"center",
        border: "2px solid black",
        position: "absolute",
        left: `${props.xPos * 60}px`,
        top: `${props.yPos * 60}px`,
        padding: "10px",
        transition: transitionString
      }}
      onClick={props.changeColor}
    >
    </div>
  );
}

export default Square