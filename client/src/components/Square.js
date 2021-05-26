
// square component
function Square(props) {
  // side length (in pixels)
  let side = 40;
  // string for transition
  let transitionString = `background-color ${String(props.transitionTime)}s ease-in-out`;
  let filterString = `drop-shadow(2px 2px 2px ${props.backgroundColor || 'black'}) drop-shadow(-1px -1px 0 ${props.backgroundColor || 'black'})`
  let borderString = (props.img) ? "none" : `2px solid ${props.backgroundColor}`;
  let paddingString = (!props.img && props.backgroundColor) ? "6px" : "10px";
  if (borderString !== "none" && borderString !== ""){
    console.log("bg color is", props.backgroundColor);
  }

  return (
    <div 
      style={{
        position: "relative",
        backgroundImage: props.backgroundImage,
        backgroundSize: "contain",
        width: `${side - 22}px`,
        height: `${side - 22}px`,
        display: "flex",
        alignItems: "center",
        border: borderString,
        padding: paddingString,
        margin: "0px",
        transition: transitionString
      }}
      onClick={props.handleClick}
    >
      <div class="statusBackground"
        style={{
          backgroundColor: props.backgroundColor,
        }}
      >
      {/* {props.text} */}
      <img src={props.img} alt={props.alt} width="40px" style={{position: "absolute", left: "-2px", top: "-2px", filter: filterString}}/>
    </div>
    </div>
  );
}

export default Square