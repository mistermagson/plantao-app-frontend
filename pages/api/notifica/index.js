import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'relayh.trf3.jus.br',
    port: 25,
    secure: false,
    ignoreTLS: true
});


async function notificaEmail(req, res){

    if (req.method === 'POST') {
        const { name, email, message } = req.body;

        const mailOptions = {
            from: ` "NUAJ" admms-nuaj@trf3.jus.br`,
            to: email,
            subject: `Email do Sistema de Agendamento de PLANTAO`,
            text: message,
            html: `<p>${message}</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};


export default notificaEmail

