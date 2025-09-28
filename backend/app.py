from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "db.sqlite"

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.after_request
def add_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return resp

def get_conn():
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                precio REAL NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS cupones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT NOT NULL UNIQUE,
                descuento REAL NOT NULL
            )
        """)
        conn.commit()

@app.route("/api/ping")
def ping():
    return jsonify({"ok": True}), 200

@app.route("/api/productos", methods=["GET"])
def listar_productos():
    with get_conn() as conn:
        rows = conn.execute("SELECT id, titulo, precio FROM productos ORDER BY id DESC").fetchall()
        return jsonify([dict(r) for r in rows]), 200

@app.route("/api/productos/<int:pid>", methods=["GET"])
def obtener_producto(pid):
    with get_conn() as conn:
        row = conn.execute("SELECT id, titulo, precio FROM productos WHERE id = ?", (pid,)).fetchone()
        if not row:
            return jsonify({"error": "No existe"}), 404
        return jsonify(dict(row)), 200

@app.route("/api/productos", methods=["POST"])
def crear_producto():
    payload = request.get_json(force=True) or {}
    titulo = payload.get("titulo")
    precio = payload.get("precio")
    if not titulo or precio is None:
        return jsonify({"error": "Faltan campos"}), 400
    with get_conn() as conn:
        cur = conn.execute("INSERT INTO productos(titulo, precio) VALUES (?,?)", (titulo, float(precio)))
        conn.commit()
        return jsonify({"id": cur.lastrowid, "titulo": titulo, "precio": float(precio)}), 201

@app.route("/api/productos/<int:pid>", methods=["PUT"])
def actualizar_producto(pid):
    payload = request.get_json(force=True) or {}
    titulo = payload.get("titulo")
    precio = payload.get("precio")
    if not titulo or precio is None:
        return jsonify({"error": "Faltan campos"}), 400
    with get_conn() as conn:
        cur = conn.execute("UPDATE productos SET titulo=?, precio=? WHERE id=?", (titulo, float(precio), pid))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "No existe"}), 404
    return jsonify({"id": pid, "titulo": titulo, "precio": float(precio)}), 200

@app.route("/api/productos/<int:pid>", methods=["DELETE"])
def eliminar_producto(pid):
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM productos WHERE id=?", (pid,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "No existe"}), 404
    return jsonify({"ok": True}), 200

@app.route("/api/cupones", methods=["GET"])
def listar_cupones():
    with get_conn() as conn:
        rows = conn.execute("SELECT id, codigo, descuento FROM cupones ORDER BY id DESC").fetchall()
        return jsonify([dict(r) for r in rows]), 200

@app.route("/api/cupones/<int:cid>", methods=["GET"])
def obtener_cupon(cid):
    with get_conn() as conn:
        row = conn.execute("SELECT id, codigo, descuento FROM cupones WHERE id = ?", (cid,)).fetchone()
        if not row:
            return jsonify({"error": "No existe"}), 404
        return jsonify(dict(row)), 200

@app.route("/api/cupones", methods=["POST"])
def crear_cupon():
    payload = request.get_json(force=True) or {}
    codigo = payload.get("codigo")
    descuento = payload.get("descuento")
    if not codigo or descuento is None:
        return jsonify({"error": "Faltan campos"}), 400
    with get_conn() as conn:
        cur = conn.execute("INSERT INTO cupones(codigo, descuento) VALUES (?,?)", (codigo.upper(), float(descuento)))
        conn.commit()
        return jsonify({"id": cur.lastrowid, "codigo": codigo.upper(), "descuento": float(descuento)}), 201

@app.route("/api/cupones/<int:cid>", methods=["PUT"])
def actualizar_cupon(cid):
    payload = request.get_json(force=True) or {}
    codigo = payload.get("codigo")
    descuento = payload.get("descuento")
    if not codigo or descuento is None:
        return jsonify({"error": "Faltan campos"}), 400
    with get_conn() as conn:
        cur = conn.execute("UPDATE cupones SET codigo=?, descuento=? WHERE id=?", (codigo.upper(), float(descuento), cid))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "No existe"}), 404
    return jsonify({"id": cid, "codigo": codigo.upper(), "descuento": float(descuento)}), 200

@app.route("/api/cupones/<int:cid>", methods=["DELETE"])
def eliminar_cupon(cid):
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM cupones WHERE id=?", (cid,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "No existe"}), 404
    return jsonify({"ok": True}), 200

if __name__ == "__main__":
    init_db()
    app.run(debug=True, host="127.0.0.1", port=5000)
