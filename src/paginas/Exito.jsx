export default function Exito({ mensaje, onSeguirComprando }) {
  return (
    <section className="exito">
      <div className="mensaje-contenido">
        <span className="icono-check">✅</span>
        <p>{mensaje || "¡Compra realizada con éxito!"}</p>
      </div>
      <button onClick={onSeguirComprando}>Seguir comprando</button>
    </section>
  );
}


