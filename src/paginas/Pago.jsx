export default function Pago({ carrito, total, totalConDescuento, onIncrementar, onDecrementar, onPagar, children }) {
  return (
    <section className="pago">
      <h2>Pago</h2>
      <div className="carrito">
        {children}
      </div>
      <div className="resumen">
        <div>Total: ${total}</div>
        <div>Total con descuento: ${totalConDescuento}</div>
        <button className="boton-pagar" onClick={onPagar} disabled={carrito.length === 0}>
          Pagar
        </button>
      </div>
    </section>
  );
}


