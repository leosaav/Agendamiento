const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

// Configuración de la base de datos
const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'agendamiento',
  password: 'password',
  port: 5432,
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-contraseña',
  },
});

// Configuración de Twilio
const client = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

// Endpoint para agendamiento web
app.post('/api/schedule', async (req, res) => {
  const { name, email, phone, service, date, time } = req.body;
  try {
    await pool.query(
      'INSERT INTO citas (name, email, phone, service, date, time) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, phone, service, date, time]
    );
    sendConfirmationEmail(email, service, date, time);
    sendConfirmationSMS(phone, service, date, time);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Endpoint para agendamiento por WhatsApp
app.post('/api/whatsapp', async (req, res) => {
  const { from, body } = req.body;
  if (body.includes("AGENDAR")) {
    // Procesar el mensaje y extraer detalles
    // Guardar en la base de datos
    // Enviar confirmación por WhatsApp
    sendConfirmationWhatsApp(from, service, date, time);
  }
  res.json({ success: true });
});

function sendConfirmationEmail(email, service, date, time) {
  const mailOptions = {
    from: 'tu-email@gmail.com',
    to: email,
    subject: 'Confirmación de Cita',
    text: `Tu cita para ${service} ha sido agendada para el ${date} a las ${time}.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });
}

function sendConfirmationSMS(phone, service, date, time) {
  client.messages.create({
    body: `Tu cita para ${service} ha sido agendada para el ${date} a las ${time}.`,
    from: '+1234567890',
    to: phone,
  })
  .then(message => console.log(message.sid))
  .catch(err => console.error(err));
}

function sendConfirmationWhatsApp(from, service, date, time) {
  client.messages.create({
    body: `Tu cita para ${service} ha sido agendada para el ${date} a las ${time}.`,
    from: 'whatsapp:+1234567890',
    to: `whatsapp:${from}`,
  })
  .then(message => console.log(message.sid))
  .catch(err => console.error(err));
}

app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});