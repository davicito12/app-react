import React, { useState } from "react";

function Payment({ total, onCancel, onPay }) {
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Validación según método
    if (method === "card") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        setError("⚠️ Debes completar todos los datos de la tarjeta.");
        return;
      }
      if (!/^\d{16}$/.test(cardNumber)) {
        setError("⚠️ El número de tarjeta debe tener 16 dígitos.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError("⚠️ La fecha de expiración debe tener el formato MM/AA.");
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError("⚠️ El CVV debe ser de 3 o 4 dígitos.");
        return;
      }
    }

    // Limpia errores y envía datos
    setError("");
    onPay({ method, cardNumber, cardName, expiry, cvv });
  };

  return (
    <div className="modal">
      <h2>💳 Pagar</h2>
      <p>
        <strong>Total a pagar:</strong> ${total.toFixed(2)}
      </p>

      <h3>Método de pago</h3>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="card">💳 Tarjeta de Crédito/Débito</option>
        <option value="paypal">🪙 PayPal</option>
        <option value="cash">💵 Efectivo contra entrega</option>
        <option value="bank">🏦 Transferencia bancaria</option>
        <option value="qr">📲 Pago con QR</option>
      </select>

      {/* FORMULARIO SEGÚN MÉTODO */}
      {method === "card" && (
        <>
          <h3>Datos de tarjeta</h3>
          <input
            type="text"
            placeholder="Número de tarjeta (16 dígitos)"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nombre en tarjeta"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </>
      )}

      {method === "paypal" && (
        <div className="paypal-box">
          <p>Serás redirigido a <strong>PayPal</strong> para completar el pago.</p>
          <img
            src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
            alt="PayPal"
            style={{ width: "120px", marginTop: "10px" }}
          />
        </div>
      )}

      {method === "cash" && (
        <div className="cash-box">
          <p>
            Pagarás en <strong>efectivo</strong> al recibir el pedido en tu
            domicilio.
          </p>
        </div>
      )}

      {method === "bank" && (
        <div className="bank-box">
          <p>
            Transferencia bancaria a: <br />
            <strong>Banco XYZ</strong> <br />
            <strong>Cuenta: 1234-5678-9012</strong>
          </p>
        </div>
      )}

      {method === "qr" && (
        <div className="qr-box">
          <p>Escanea el código QR para completar tu compra:</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=Pago%20de%20${total.toFixed(
              2
            )}`}
            alt="QR de pago"
          />
        </div>
      )}

      {/* ⚠️ Mensaje de error */}
      {error && <p className="error-msg">{error}</p>}

      <div className="actions">
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" onClick={handleSubmit}>
          Confirmar pago ${total.toFixed(2)}
        </button>
      </div>

      <p className="note">
        🔒 Este es un entorno de prueba. No se realizan cargos reales.
      </p>
    </div>
  );
}

export default Payment;
