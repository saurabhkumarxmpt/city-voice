const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

const sendVerificationEmail= async(toEmail, token)=>{
    const verifyURL= `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
        from: `City Voice <${process.env.EMAIL_USER}>`,
        to:toEmail,
        subject:'✅ Apna Email Verify Karo — City Voice',
        html:`
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
            <h2 style="color: #2563eb;">City Voice mein Aapka Swagat Hai! 🏙️</h2>
            <p>Apna account verify karne ke liye neeche button dabayein:</p>
            <a href="${verifyURL}"
            style="display:inline-block; padding: 12px 24px; background:#2563eb;
                    color:white; border-radius:6px; text-decoration:none; font-size:16px;">
            Email Verify Karo
            </a>
            <p style="color:#888; margin-top:20px;">
            Yeh link <strong>15 minutes</strong> mein expire ho jaayega.<br/>
            Agar aapne request nahi ki toh ignore karein.
            </p>
        </div>`,
    });
};

module.exports= {sendVerificationEmail};