import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from './sendMail.js';
import prisma from "../prisma/prisma.js";
const SECRET_KEY = process.env.SECRET_KEY;

export async function loginUser(email, password) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            role: true,
            password: true,
            emailConfirmed: true,
            isActive: true,
        },
    });

    if (!user) {
        throw new Error("لم يتم العثور على مستخدم بهذا البريد الإلكتروني");
    }

    if (!user.password) {
        throw new Error("ليس لديك كلمة مرور، من فضلك قم بإعادة تعيين كلمة المرور الخاصة بك");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error("كلمة المرور غير صحيحة");
    }

    if (!user.emailConfirmed) {
        throw new Error("البريد الإلكتروني الخاص بك غير مؤكد");
    }

    if (!user.isActive) {
        throw new Error("تم حظر حسابك، لا يمكنك تسجيل الدخول");
    }

 const token=   jwt.sign({
     id: user.id,
       role: user.role,
        accountStatus: user.isActive,
     emailConfirmed:user.emailConfirmed
    }, SECRET_KEY, { expiresIn: '4h' });

    return {  user,token };
}

export function logoutUser() {
    return {
        token: "",
        options: { maxAge: -1, path: '/' },
    };
}

export const createUser = async (userData) => {
    const { basicInfo,contactInfo,studyInformation} = userData;
const {email,password,confirmPassword}=basicInfo
    delete  basicInfo.email;
    delete  basicInfo.password;
    delete  basicInfo.confirmPassword;
    if (basicInfo.birthDate) {
        basicInfo.birthDate = new Date(basicInfo.birthDate);
    }
    if(basicInfo.hasDisability==="no"){
        basicInfo.hasDisability=false
    }else{
        basicInfo.hasDisability=true

    }
    if (password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
        throw new Error('يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم وأن تكون 8 أحرف على الأقل');
    }
    if(password!==confirmPassword){
        throw new Error('كلمة المرور ليست متطابقة مع تاكيد كلمة المرور');
    }
    // تشفير كلمة المرور

    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: "STUDENT",
            personalInfo: {
                create: {
                    basicInfo: {
                        create: basicInfo,
                    },
                    contactInfo: {
                        create: contactInfo,
                    },
                    studyInfo: {
                        create: studyInformation,
                    },
                },
            },
        },
    });

    // Generate confirmation token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });

    // Send confirmation email
    const confirmationLink = `${process.env.ORIGIN}/confirm?token=${token}`;
    const emailHtml = `
        <p>يرجى تأكيد بريدك الإلكتروني بالنقر على الرابط التالي:</p>
        <a href="${confirmationLink}">تأكيد البريد الإلكتروني</a>
    `;
    await sendEmail(email, 'تأكيد البريد الإلكتروني', emailHtml);

    return user;
};
export const requestPasswordReset = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('لا يوجد مستخدم بهذا البريد الإلكتروني');
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    const resetLink = `${process.env.ORIGIN}/reset?token=${token}`;

    const emailSubject = 'طلب إعادة تعيين كلمة المرور';
    const emailHtml = `
        <p>لقد طلبت أو شخص آخر إعادة تعيين كلمة المرور لحسابك.</p>
        <p>يرجى النقر على الرابط التالي لإعادة تعيين كلمة المرور:</p>
        <a href="${resetLink}">إعادة تعيين كلمة المرور</a>
        <p>ينتهي هذا الرابط بعد ساعة واحدة.</p>
    `;

    await sendEmail(email, emailSubject, emailHtml);
    return "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني";
};

export const resetPassword = async (token, newPassword) => {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
        throw new Error('رابط إعادة تعيين كلمة المرور غير صالح أو منتهي');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);

    await prisma.user.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
    });

    return 'تم إعادة تعيين كلمة المرور بنجاح، يرجى تسجيل الدخول';
};

export const confirmEmail = async (token) => {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
        throw new Error('رابط إعادة تعيين كلمة المرور غير صالح أو منتهي');
    }
    const user=await prisma.user.update({
        where: { id: decoded.userId },
        data: { emailConfirmed: true },
    });
  const loginToken=jwt.sign({
        id: user.id,
        role: user.role,
        accountStatus: user.isActive,
        emailConfirmed:user.emailConfirmed
    }, SECRET_KEY, { expiresIn: '4h' });
    const loginUser={
    id: user.id,
    role: user.role,
    accountStatus: user.isActive,
    emailConfirmed:user.emailConfirmed
}
    return {message:'تم تاكيد حسابك بنجاح , جاري اعادة توجيهك ',loginUser,loginToken}
};

