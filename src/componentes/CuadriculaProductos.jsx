import React from "react";
import TarjetaProducto from "./TarjetaProducto.jsx";

export default function CuadriculaProductos({ productos, onAgregar, modoOscuro = false }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-6 items-center justify-center">
      {productos.map((p) => (
        <TarjetaProducto 
          key={p.id ?? p.nombre} 
          producto={p} 
          onAgregar={onAgregar} 
          modoOscuro={modoOscuro}
        />
      ))}
    </div>
  );
}


