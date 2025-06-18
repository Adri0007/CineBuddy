const nodemailer = require('nodemailer');

async function testMail() {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'babikfabian@gmail.com',     // Hier deine Gmail-Adresse eintragen
      pass: 'dxxp nnfl fwue wlgw'
    },
  });

  try {
    let info = await transporter.sendMail({
      from: '"Dein Kino" <babikfabian@gmail.com>',  // Gleiche Mail-Adresse wie oben
      to: 'babikfabian@gmail.com',                   // Du kannst hier auch eine andere Empfänger-Mail angeben
      subject: 'Test Mail',
      html: '<h1>Test Mail</h1><p>Dies ist eine Test-Mail.</p>',
    });
    console.log('Mail gesendet:', info.messageId);
  } catch (error) {
    console.error('Fehler beim Mailversand:', error);
  }
}

testMail();
