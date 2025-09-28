import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

// componentes
import Encabezado from "./componentes/Encabezado.jsx";
import BarraBusqueda from "./componentes/BarraBusqueda.jsx";
import CuadriculaProductos from "./componentes/CuadriculaProductos.jsx";
import ItemCarro from "./componentes/ItemCarro.jsx";
import CuponDescuento from "./componentes/CuponDescuento.jsx";
import LoginModal from "./componentes/LoginModal.jsx";

// paginas
import Catalogo from "./paginas/Catalogo.jsx";
import Pago from "./paginas/Pago.jsx";
import Exito from "./paginas/Exito.jsx";
import AdminPage from "./paginas/AdminPage.jsx";

function App() {
  // estado global: productos, carrito, tema, uiRoute, cupon, mensaje exito
  const [modoOscuro, setModoOscuro] = useState(false);
  const [rutaUI, setRutaUI] = useState("catalogo"); // "catalogo" | "pago" | "exito" | "admin"
  const [autenticado, setAutenticado] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cupones, setCupones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [cupon, setCupon] = useState("");
  const [mensaje, setMensaje] = useState("");

  // persistencia del tema
  useEffect(() => {
    const modoGuardado = localStorage.getItem("modoOscuro");
    if (modoGuardado) setModoOscuro(JSON.parse(modoGuardado));
  }, []);
  
  useEffect(() => {
    localStorage.setItem("modoOscuro", JSON.stringify(modoOscuro));
  }, [modoOscuro]);

  // aplicar clase al body para modo oscuro
  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add('modo-oscuro');
      document.documentElement.classList.add('modo-oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
      document.documentElement.classList.remove('modo-oscuro');
    }
  }, [modoOscuro]);

  // fetch productos y cupones desde API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, cuponesRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/productos'),
          fetch('http://127.0.0.1:5000/api/cupones')
        ]);
        const productosData = await productosRes.json();
        const cuponesData = await cuponesRes.json();
        setProductos(productosData.map(p => ({ id: p.id, nombre: p.titulo, precio: p.precio })));
        setCupones(cuponesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const productosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return productos;
    const q = busqueda.toLowerCase();
    return productos.filter(
      (p) => p.nombre.toLowerCase().includes(q)
    );
  }, [productos, busqueda]);

  const toggleModoOscuro = () => setModoOscuro((v) => !v);

  const intentarAccesoAdmin = () => {
    if (autenticado) {
      setRutaUI("admin");
    } else {
      setMostrarLogin(true);
    }
  };

  const actualizarProductos = (nuevosProductos) => {
    setProductos(nuevosProductos);
  };

  const actualizarCupones = (nuevosCupones) => {
    setCupones(nuevosCupones);
  };

  const verificarPassword = (password) => {
    if (password === "1234") {
      setAutenticado(true);
      setMostrarLogin(false);
      setRutaUI("admin");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const cerrarSesion = () => {
    setAutenticado(false);
    setRutaUI("catalogo");
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((i) => i.id === producto.id || i.nombre === producto.nombre);
      if (existente) {
        return prev.map((i) =>
          (i.id === producto.id || i.nombre === producto.nombre)
            ? { ...i, cantidad: i.cantidad + (producto.cantidad ?? 1) }
            : i
        );
      }
      return [...prev, { ...producto, cantidad: producto.cantidad ?? 1 }];
    });
  };

  const incrementar = (idNombre) => {
    setCarrito((prev) => prev.map((i) =>
      (i.id === idNombre || i.nombre === idNombre)
        ? { ...i, cantidad: i.cantidad + 1 }
        : i
    ));
  };

  const decrementar = (idNombre) => {
    setCarrito((prev) => prev
      .map((i) => (i.id === idNombre || i.nombre === idNombre) ? { ...i, cantidad: i.cantidad - 1 } : i)
      .filter((i) => i.cantidad > 0)
    );
  };

  const total = useMemo(() => carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0), [carrito]);

  const aplicarCupon = (codigo) => {
    setCupon(codigo.trim());
  };

  const totalConDescuento = useMemo(() => {
    if (!cupon) return total;

    const codigo = cupon.toUpperCase();
    const cuponEncontrado = cupones.find(c => c.codigo === codigo);

    if (!cuponEncontrado) return total;

    const descuento = cuponEncontrado.descuento;
    return Math.round(total * (1 - descuento) * 100) / 100;
  }, [total, cupon, cupones]);

  const pagarCarrito = () => {
    setCarrito([]);
    setMensaje("¡Compra realizada con éxito! Gracias por tu compra.");
    setRutaUI("exito");
    setTimeout(() => setMensaje(""), 4000);
  };

  return (
    <div>
      {(rutaUI !== "admin" || autenticado) && (
        <Encabezado modoOscuro={modoOscuro} onToggleTema={toggleModoOscuro} onIrCatalogo={() => setRutaUI("catalogo")} onIrPago={() => setRutaUI("pago")} onIrAdmin={intentarAccesoAdmin} />
      )}

      {rutaUI === "catalogo" && (
        <Catalogo>
          <BarraBusqueda value={busqueda} onChange={setBusqueda} />
          <CuadriculaProductos productos={productosFiltrados} onAgregar={agregarAlCarrito} />
        </Catalogo>
      )}

      {rutaUI === "pago" && (
        <Pago
          carrito={carrito}
          total={total}
          totalConDescuento={totalConDescuento}
          onIncrementar={incrementar}
          onDecrementar={decrementar}
          onPagar={pagarCarrito}
        >
          <CuponDescuento value={cupon} onApply={aplicarCupon} />
          {carrito.map((item) => (
            <ItemCarro
              key={item.id ?? item.nombre}
              item={item}
              onIncrement={() => incrementar(item.id ?? item.nombre)}
              onDecrement={() => decrementar(item.id ?? item.nombre)}
            />
          ))}
        </Pago>
      )}

      {rutaUI === "exito" && (
        <Exito mensaje={mensaje} onSeguirComprando={() => setRutaUI("catalogo")} />
      )}

      {rutaUI === "admin" && autenticado && (
        <AdminPage
          productos={productos}
          cupones={cupones}
          onActualizarProductos={actualizarProductos}
          onActualizarCupones={actualizarCupones}
          onCerrarSesion={cerrarSesion}
        />
      )}

      {mostrarLogin && (
        <LoginModal
          onVerificar={verificarPassword}
          onCerrar={() => setMostrarLogin(false)}
        />
      )}
    </div>
  );
}

export default App;
