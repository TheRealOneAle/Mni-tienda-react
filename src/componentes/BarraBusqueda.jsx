import React from "react";

export default function BarraBusqueda({ value, onChange, modoOscuro = false }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-md mx-auto block p-3 rounded-lg border-2 text-center text-lg"
        style={{
          borderColor: modoOscuro ? "#a855f7" : "#93c5fd",
          backgroundColor: modoOscuro ? "#1c1917" : "white",
          color: modoOscuro ? "#e9d5ff" : "#000000",
        }}
      />
    </div>
  );
}


