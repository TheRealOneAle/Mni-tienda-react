import { useState } from "react";

export default function CuponDescuento({ value, onApply }) {
  const [codigo, setCodigo] = useState(value ?? "");

  const handleApply = (e) => {
    e.preventDefault();
    onApply(codigo);
  };

  return (
    <form className="cupon" onSubmit={handleApply}>
      <input
        type="text"
        placeholder="Código de cupón"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <button type="submit">Aplicar</button>
    </form>
  );
}


