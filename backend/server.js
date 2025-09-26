const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'init_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
    } else {
        console.log('✅ Conectado a MySQL');
    }
});

// Listar productos
app.get('/products', (req, res) => {
    db.query(
        'SELECT id, name, description, price, stock, image_url FROM products',
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// Pedir producto
app.post('/pedir/:id', (req, res) => {
    const id = req.params.id;
    db.query(
        'UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0',
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ mensaje: 'Pedido realizado' });
        }
    );
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
