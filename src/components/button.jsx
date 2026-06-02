export function MyButton({title, color, text, click}) {
  const buttonStyle = {
    backgroundColor: color, 
    color: text, 
    padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
     cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  }
  return (
    <button onClick={click} style= {buttonStyle}>
      {title || "place holder"}
    </button>
  );
}

export function Edit({title, color, text}) {
  const buttonStyle = {
    backgroundColor: color, 
    color: text, 
    padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
     cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  }
  return (
    <button style= {buttonStyle}>
      {title || "📝"}
    </button>
  );
}