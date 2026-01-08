const express = require("express");
const router = express.Router();
const db = require("../db");


// CREATE client
router.post("/", (req, res) => {
  const { names, sex, address, phone, email } = req.body;

  if (!names || !sex || !phone || !email) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const sql = "INSERT INTO clients (names, sex, address, phone, email) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [names, sex, address, phone, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Client added successfully" });
  });
});


// READ all clients
router.get("/", (req, res) => {
  db.query("SELECT * FROM clients", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});


// UPDATE client
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { names, sex, address, phone, email } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid client ID" });
  }

  const sql = `
    UPDATE clients 
    SET names=?, sex=?, address=?, phone=?, email=?
    WHERE id=?
  `;

  db.query(sql, [names, sex, address, phone, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json({ message: "Client updated successfully" });
  });
});


// DELETE client
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid client ID" });
  }

  db.query("DELETE FROM clients WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  });
});

module.exports = router;
