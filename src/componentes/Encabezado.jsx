import React from "react";

export default function Encabezado({
  modoOscuro,
  onToggleTema,
  onIrCatalogo,
  onIrPago,
  onIrAdmin,
  cantidadCarrito = 0,
  paginaActual = "catalogo"
}) {
  return (
    <header
      className="flex justify-between items-center py-4 px-6 bg-white dark:bg-[#23143a] border-b-2 border-blue-500 dark:border-purple-400 shadow mb-6"
      style={{
        backgroundColor: modoOscuro ? "#23143a" : "white",
        borderColor: modoOscuro ? "#a855f7" : "#3b82f6",
      }}
    >
      <div className="flex items-center gap-4">
        <h1 
          className="text-2xl font-bold"
          style={{ color: modoOscuro ? "#c4b5fd" : "#1d4ed8" }}
        >
          🛍️ Tienda Online
        </h1>
        <nav className="flex gap-4">
          <button
            onClick={onIrCatalogo}
            className="font-bold transition-colors"
            style={{
              color: modoOscuro
                ? paginaActual === "catalogo"
                  ? "#c4b5fd"
                  : "#e9d5ff"
                : paginaActual === "catalogo"
                ? "#1d4ed8"
                : "#374151",
            }}
          >
            Catálogo
          </button>
          <button
            onClick={onIrPago}
            className="font-bold transition-colors"
            style={{
              color: modoOscuro
                ? paginaActual === "pago"
                  ? "#c4b5fd"
                  : "#e9d5ff"
                : paginaActual === "pago"
                ? "#1d4ed8"
                : "#374151",
            }}
          >
            Carrito ({cantidadCarrito})
          </button>
          <button
            onClick={onIrAdmin}
            className="font-bold transition-colors"
            style={{
              color: modoOscuro
                ? paginaActual === "admin"
                  ? "#c4b5fd"
                  : "#e9d5ff"
                : paginaActual === "admin"
                ? "#1d4ed8"
                : "#374151",
            }}
          >
            Admin
          </button>
        </nav>
      </div>
      <button
        onClick={onToggleTema}
        className="text-white font-semibold py-2 px-6 rounded-lg border-2 shadow transition"
        style={{
          background: modoOscuro
            ? "linear-gradient(to right, #7c3aed, #581c87)"
            : "linear-gradient(to right, #2563eb, #3b82f6)",
          borderColor: modoOscuro ? "#a855f7" : "#1d4ed8",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = modoOscuro
            ? "linear-gradient(to right, #581c87, #4c1d95)"
            : "linear-gradient(to right, #1d4ed8, #2563eb)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = modoOscuro
            ? "linear-gradient(to right, #7c3aed, #581c87)"
            : "linear-gradient(to right, #2563eb, #3b82f6)";
        }}
      >
        Cambiar a tema {modoOscuro ? "claro" : "oscuro"}
      </button>
    </header>
  );
}


