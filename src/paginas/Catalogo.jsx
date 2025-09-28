import React from "react";

export default function Catalogo({ children, modoOscuro = false }) {
  return (
    <section className="max-w-5xl mx-auto py-8 px-4">
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: modoOscuro ? "#c4b5fd" : "#1d4ed8" }}
      >
        Catálogo de Productos
      </h2>
      {children}
    </section>
  );
}


