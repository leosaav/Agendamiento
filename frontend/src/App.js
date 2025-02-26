import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', date: '', time: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/schedule', form);
      if (response.data.success) {
        alert('Cita agendada con éxito');
      }
    } catch (error) {
      console.error(error);
      alert('Error al agendar la cita');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Agendar Cita</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo</label>
          <input type="email" className="form-control" id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Teléfono</label>
          <input type="tel" className="form-control" id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="mb-3">
          <label htmlFor="service" className="form-label">Servicio</label>
          <select className="form-select" id="service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
            <option value="servicio1">Servicio 1</option>
            <option value="servicio2">Servicio 2</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Fecha</label>
          <input type="date" className="form-control" id="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="mb-3">
          <label htmlFor="time" className="form-label">Hora</label>
          <input type="time" className="form-control" id="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary">Agendar</button>
      </form>
    </div>
  );
}

export default App;