
// square component
function Square(props) {
  // side length (in pixels)
  let side = 40;
  // string for transition
  let transitionString = `background-color ${String(props.transitionTime)}s ease-in-out`;

  return (
    <div 
      style={{
        position: "relative",
        backgroundColor: props.backgroundColor || 'white',
        width: `${side - 22}px`,
        height: `${side - 22}px`,
        display: "flex",
        alignItems: "center",
        border: "1px solid black",
        padding: "10px",
        margin: "0px",
        transition: transitionString
      }}
      onClick={props.handleClick}
    >
      {/* {props.text} */}
      <img src={props.img} alt={props.alt} width="40px" style={{position: "absolute", left: "-2px", filter: "drop-shadow(2px 2px 2px black) drop-shadow(-1px -1px 0 black)"}}/>
    </div>
  );
}

export default Square