
// square component
function Square(props) {
  // side length (in pixels)
  let side = 40;
  // string for transition
  let transitionString = `background-color ${String(props.transitionTime)}s ease-in-out`;

  return (
    <div 
      style={{
        backgroundColor: props.backgroundColor,
        width: `${side - 22}px`,
        height: `${side - 22}px`,
        // textAlign:"center",
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        border: "1px solid black",
        // position: "absolute",
        // left: `${props.xPos * 60}px`,
        // top: `${props.yPos * 60}px`,
        padding: "10px",
        margin: "0px",
        transition: transitionString
      }}
      onClick={props.handleClick}
    >
      {props.text}
      <img src={props.img} alt={props.alt} width="40px" style={{position: "relative", left: "-30px"}}/>
    </div>
  );
}

export default Square