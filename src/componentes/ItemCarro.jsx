export default function ItemCarro({ item, onIncrement, onDecrement }) {
  return (
    <div className="carrito-item">
      <div className="info">
        <h4>{item.nombre}</h4>
        <span>${item.precio} x {item.cantidad}</span>
      </div>
      <div className="controles">
        <button onClick={onDecrement}>-</button>
        <button onClick={onIncrement}>+</button>
        <span className="subtotal">${item.precio * item.cantidad}</span>
      </div>
    </div>
  );
}


