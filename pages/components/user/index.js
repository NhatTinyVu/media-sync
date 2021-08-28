const User = ({ name, active }) => {
  return (
    <div
      style={{
        padding: 8,
        border: "1px solid #ccc",
        display: "inline-block",
        ...(active ? { color: "red", fontWeight: "bold" } : {}),
      }}
    >
      {name}
      {active ? " (host)" : ""}
    </div>
  );
};

export default User;
