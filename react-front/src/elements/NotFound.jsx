const NotFound = () => {
  return (
    <div className="layout-content--full" style={
        {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px"
        }
    }>
      <img
        src="/others/not-found.png"
        alt="Page non trouvée"
        style={{ width: "200px" }}
      />
      <h2>Page Non Trouvée</h2>
      <p>Désolé, la page que vous cherchez n&apos;existe pas.</p>
    </div>
  );
};

export default NotFound;
