const User = ({ name, active, isHost }) => {
  return (
    <div
      style={{
        padding: "3px 16px",
        display: "inline-block",
        background: `rgba(255, 255, 255, 0.75)`,
        color: "#3e91f7",
        border: "1px solid #3e91f7",
        ...(active
          ? {
              color: "white",
              background: "#3e91f7",
              border: "1px solid #3e91f7",
            }
          : {}),
        ...(isHost
          ? {
              color: "white",
              fontWeight: "bold",
              background: "#ed5b56",
              border: "1px solid #ed5b56",
            }
          : {}),
      }}
    >
      {name}
      {isHost ? " (host)" : ""}
    </div>
  );
};

export default User;
