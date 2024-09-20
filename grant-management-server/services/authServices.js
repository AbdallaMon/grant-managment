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
        userId: user.id,
        userRole: user.role,
        accountStatus: user.isActive
    }, SECRET_KEY, { expiresIn: '4h' });

    return {  user,token };
}

export function logoutUser() {
    return {
        token: "",
        options: { maxAge: -1, path: '/' },
    };
}

export const requestPasswordReset = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('لا يوجد مستخدم بهذا البريد الإلكتروني');
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
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
        where: { id: decoded.userId },
        data: { password: hashedPassword },
    });

    return 'تم إعادة تعيين كلمة المرور بنجاح، يرجى تسجيل الدخول';
};

