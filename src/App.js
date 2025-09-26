import React, { useEffect, useState } from "react";
import Payment from "./Payment";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("❌ Error cargando productos:", err);
      setProductos([]);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.product_id === product.id);
      if (found) {
        return prev.map((p) =>
          p.product_id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          nombre: product.name, // 👈 ahora usa "name"
          precio: Number(product.price),
          qty: 1,
          image: product.image_url,
        },
      ];
    });
  };

  const removeFromCart = (product_id) => {
    setCart((prev) => prev.filter((p) => p.product_id !== product_id));
  };

  const changeQty = (product_id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((p) => (p.product_id === product_id ? { ...p, qty } : p))
    );
  };

  const getTotal = () =>
    cart.reduce((s, i) => s + i.precio * i.qty, 0).toFixed(2);

  const handleCheckout = async (paymentData) => {
    setLoadingCheckout(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      for (const item of cart) {
        for (let i = 0; i < item.qty; i++) {
          await fetch(`http://localhost:3001/pedir/${item.product_id}`, {
            method: "POST",
          });
        }
      }
      alert(`✅ Pago aceptado con ${paymentData.method}. Pedido procesado.`);
      await fetchProducts();
      setCart([]);
      setShowPayment(false);
    } catch (err) {
      console.error("Error en checkout:", err);
      alert("❌ Ocurrió un error procesando su pedido.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <>
      <header>
        <h1>🛍️ Simulador de Pedidos</h1>
      </header>

      <div className="container">
        <h2>Productos Disponibles</h2>

        <div className="grid">
          {productos.length ? (
            productos.map((p) => (
              <div className="card" key={p.id}>
                <div className="card-media">
                  <img
                    src={
                      p.image_url ||
                      `https://via.placeholder.com/260x160?text=${encodeURIComponent(
                        p.name || "Producto"
                      )}`
                    }
                    alt={p.name}
                  />
                </div>
                <div className="card-body">
                  <h3>{p.name}</h3>
                  <p className="desc">{p.description || ""}</p>
                  <div className="meta">
                    <strong>${Number(p.price).toFixed(2)}</strong>
                    <span className="stock">Stock: {p.stock}</span>
                  </div>
                  <div className="actions">
                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock <= 0}
                    >
                      {p.stock > 0 ? "Agregar al carrito" : "Agotado"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Cargando productos...</p>
          )}
        </div>
      </div>

      {/* 🛒 Carrito flotante */}
      {cart.length > 0 && (
        <div className="cart">
          <h3>Tu Carrito</h3>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.product_id} className="cart-item">
                <img
                  src={
                    item.image ||
                    `https://via.placeholder.com/40?text=${item.nombre}`
                  }
                  alt={item.nombre}
                  className="cart-img"
                />
                <div className="cart-info">
                  <strong>{item.nombre}</strong>
                  <div className="cart-controls">
                    <button
                      onClick={() =>
                        changeQty(item.product_id, item.qty - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        changeQty(item.product_id, Number(e.target.value) || 1)
                      }
                      min="1"
                    />
                    <button
                      onClick={() =>
                        changeQty(item.product_id, item.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-price">
                  ${(item.precio * item.qty).toFixed(2)}
                  <button
                    className="small danger"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div>
              Total: <strong>${getTotal()}</strong>
            </div>
            <div className="cart-actions">
              <button className="primary" onClick={() => setShowPayment(true)}>
                Pagar
              </button>
              <button className="secondary" onClick={() => setCart([])}>
                Vaciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💳 Modal de pago */}
      {showPayment && (
        <div className="modal-backdrop">
          <div className="modal">
            <Payment
              total={Number(getTotal())}
              onCancel={() => setShowPayment(false)}
              onPay={handleCheckout}
              loading={loadingCheckout}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
