import React, { useState, useEffect } from 'react';

export default function AdminPage({ productos, cupones, onActualizarProductos, onActualizarCupones, onCerrarSesion, modoOscuro = false }) {
  const [nuevoProducto, setNuevoProducto] = useState({ titulo: '', precio: '' });
  const [nuevoCupon, setNuevoCupon] = useState({ codigo: '', descuento: '' });

  const agregarProducto = async () => {
    if (!nuevoProducto.titulo || !nuevoProducto.precio) return;
    try {
      const response = await fetch('http://127.0.0.1:5000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: nuevoProducto.titulo, precio: parseFloat(nuevoProducto.precio) })
      });
      if (response.ok) {
        const producto = await response.json();
        onActualizarProductos([...productos, { id: producto.id, nombre: producto.titulo, precio: producto.precio }]);
        setNuevoProducto({ titulo: '', precio: '' });
      }
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/productos/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onActualizarProductos(productos.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  const agregarCupon = async () => {
    if (!nuevoCupon.codigo || !nuevoCupon.descuento) return;
    try {
      const response = await fetch('http://127.0.0.1:5000/api/cupones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: nuevoCupon.codigo.toUpperCase(), descuento: parseFloat(nuevoCupon.descuento) })
      });
      if (response.ok) {
        const cupon = await response.json();
        onActualizarCupones([...cupones, cupon]);
        setNuevoCupon({ codigo: '', descuento: '' });
      }
    } catch (error) {
      console.error('Error agregando cupón:', error);
    }
  };

  const eliminarCupon = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/cupones/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onActualizarCupones(cupones.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error eliminando cupón:', error);
    }
  };

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ 
        backgroundColor: modoOscuro ? "#191919" : "#f5f5f4",
        color: modoOscuro ? "#e9d5ff" : "#374151"
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 
            className="text-3xl font-bold"
            style={{ color: modoOscuro ? "#c4b5fd" : "#1d4ed8" }}
          >
            Panel de Administración
          </h1>
          <button
            onClick={onCerrarSesion}
            className="text-white font-semibold py-2 px-6 rounded-lg border-2 shadow transition"
            style={{
              background: modoOscuro
                ? "linear-gradient(to right, #7c3aed, #581c87)"
                : "linear-gradient(to right, #2563eb, #3b82f6)",
              borderColor: modoOscuro ? "#a855f7" : "#1d4ed8",
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gestión de Productos */}
          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{ 
              backgroundColor: modoOscuro ? "#1c1917" : "#ffffff",
              borderColor: modoOscuro ? "#a855f7" : "#e5e7eb",
              border: `2px solid ${modoOscuro ? "#a855f7" : "#e5e7eb"}`
            }}
          >
            <h2 
              className="text-2xl font-bold mb-6"
              style={{ color: modoOscuro ? "#c4b5fd" : "#1d4ed8" }}
            >
              Productos
            </h2>

            {/* Formulario agregar producto */}
            <div className="mb-6">
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: modoOscuro ? "#a855f7" : "#1d4ed8" }}
              >
                Agregar Producto
              </h3>
              <input
                type="text"
                placeholder="Nombre del producto"
                value={nuevoProducto.titulo}
                onChange={(e) => setNuevoProducto({...nuevoProducto, titulo: e.target.value})}
                className="w-full p-3 rounded-lg border-2 mb-3"
                style={{
                  borderColor: modoOscuro ? "#a855f7" : "#93c5fd",
                  backgroundColor: modoOscuro ? "#1c1917" : "white",
                  color: modoOscuro ? "#e9d5ff" : "#000000",
                }}
              />
              <input
                type="number"
                placeholder="Precio"
                value={nuevoProducto.precio}
                onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                className="w-full p-3 rounded-lg border-2 mb-3"
                style={{
                  borderColor: modoOscuro ? "#a855f7" : "#93c5fd",
                  backgroundColor: modoOscuro ? "#1c1917" : "white",
                  color: modoOscuro ? "#e9d5ff" : "#000000",
                }}
              />
              <button 
                onClick={agregarProducto} 
                className="w-full p-3 rounded-lg font-semibold text-white transition"
                style={{
                  background: modoOscuro
                    ? "linear-gradient(to right, #7c3aed, #581c87)"
                    : "linear-gradient(to right, #2563eb, #3b82f6)",
                }}
              >
                Agregar Producto
              </button>
            </div>

            {/* Lista de productos */}
            <div>
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: modoOscuro ? "#a855f7" : "#1d4ed8" }}
              >
                Productos Existentes
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {productos.map(producto => (
                  <div 
                    key={producto.id} 
                    className="flex justify-between items-center p-3 rounded-lg border"
                    style={{
                      backgroundColor: modoOscuro ? "#2d2d2d" : "#f9fafb",
                      borderColor: modoOscuro ? "#a855f7" : "#e5e7eb",
                    }}
                  >
                    <span className="font-medium">
                      {producto.nombre} - ${producto.precio}
                    </span>
                    <button 
                      onClick={() => eliminarProducto(producto.id)} 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gestión de Cupones */}
          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{ 
              backgroundColor: modoOscuro ? "#1c1917" : "#ffffff",
              borderColor: modoOscuro ? "#a855f7" : "#e5e7eb",
              border: `2px solid ${modoOscuro ? "#a855f7" : "#e5e7eb"}`
            }}
          >
            <h2 
              className="text-2xl font-bold mb-6"
              style={{ color: modoOscuro ? "#c4b5fd" : "#1d4ed8" }}
            >
              Cupones
            </h2>

            {/* Formulario agregar cupón */}
            <div className="mb-6">
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: modoOscuro ? "#a855f7" : "#1d4ed8" }}
              >
                Agregar Cupón
              </h3>
              <input
                type="text"
                placeholder="Código del cupón"
                value={nuevoCupon.codigo}
                onChange={(e) => setNuevoCupon({...nuevoCupon, codigo: e.target.value})}
                className="w-full p-3 rounded-lg border-2 mb-3"
                style={{
                  borderColor: modoOscuro ? "#a855f7" : "#93c5fd",
                  backgroundColor: modoOscuro ? "#1c1917" : "white",
                  color: modoOscuro ? "#e9d5ff" : "#000000",
                }}
              />
              <input
                type="number"
                placeholder="Descuento (0.1 = 10%)"
                value={nuevoCupon.descuento}
                onChange={(e) => setNuevoCupon({...nuevoCupon, descuento: e.target.value})}
                className="w-full p-3 rounded-lg border-2 mb-3"
                style={{
                  borderColor: modoOscuro ? "#a855f7" : "#93c5fd",
                  backgroundColor: modoOscuro ? "#1c1917" : "white",
                  color: modoOscuro ? "#e9d5ff" : "#000000",
                }}
              />
              <button 
                onClick={agregarCupon} 
                className="w-full p-3 rounded-lg font-semibold text-white transition"
                style={{
                  background: modoOscuro
                    ? "linear-gradient(to right, #7c3aed, #581c87)"
                    : "linear-gradient(to right, #2563eb, #3b82f6)",
                }}
              >
                Agregar Cupón
              </button>
            </div>

            {/* Lista de cupones */}
            <div>
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: modoOscuro ? "#a855f7" : "#1d4ed8" }}
              >
                Cupones Existentes
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cupones.map(cupon => (
                  <div 
                    key={cupon.id} 
                    className="flex justify-between items-center p-3 rounded-lg border"
                    style={{
                      backgroundColor: modoOscuro ? "#2d2d2d" : "#f9fafb",
                      borderColor: modoOscuro ? "#a855f7" : "#e5e7eb",
                    }}
                  >
                    <span className="font-medium">
                      {cupon.codigo} - {(cupon.descuento * 100).toFixed(0)}% descuento
                    </span>
                    <button 
                      onClick={() => eliminarCupon(cupon.id)} 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}