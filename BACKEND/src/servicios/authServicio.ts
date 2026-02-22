import { query } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mailer";

const SECRET = process.env.JWT_SECRET || "secreto_super_seguro_123";

export const login = async (username: string, pass: string) => {
    // 1. Buscar usuario
    const res = await query("SELECT * FROM usuarios WHERE username = ?", [username]);
    if (res.rows.length === 0) {
        throw new Error("Usuario no encontrado");
    }

    const usuario = res.rows[0];

    // 2. Verificar si está bloqueado
    if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
        const resto = Math.ceil((new Date(usuario.bloqueado_hasta).getTime() - new Date().getTime()) / 60000);
        throw new Error(`Cuenta bloqueada. Intente de nuevo en ${resto} minutos.`);
    }

    // 3. Verificar contraseña
    const esValida = await bcrypt.compare(pass, usuario.password);

    if (!esValida) {
        // Incrementar intentos fallidos
        const nuevosIntentos = usuario.intentos_fallidos + 1;
        if (nuevosIntentos >= 5) {
            // Bloquear por 10 minutos
            const bloq = new Date();
            bloq.setMinutes(bloq.getMinutes() + 10);
            await query("UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?", [nuevosIntentos, bloq, usuario.id]);
            throw new Error("Demasiados intentos. Cuenta bloqueada por 10 minutos.");
        } else {
            await query("UPDATE usuarios SET intentos_fallidos = ? WHERE id = ?", [nuevosIntentos, usuario.id]);
            throw new Error(`Contraseña incorrecta. Intentos restantes: ${5 - nuevosIntentos}`);
        }
    }

    // 4. Login exitoso: Resetear intentos y generar Token
    await query("UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?", [usuario.id]);

    const token = jwt.sign(
        { id: usuario.id, username: usuario.username, nombre: usuario.nombre },
        SECRET,
        { expiresIn: '8h' } // Sesión de 8 horas para comodidad de los adultos mayores
    );

    return {
        token,
        usuario: {
            id: usuario.id,
            username: usuario.username,
            nombre: usuario.nombre,
            rol: usuario.rol,
            expediente_id: usuario.expediente_id
        }
    };
};

export const forgotPassword = async (email: string) => {
    // 1. Verificar si el usuario existe por email
    const res = await query("SELECT * FROM usuarios WHERE email = ? AND activo = 1", [email]);

    if (res.rows.length === 0) {
        throw new Error("El correo ingresado no pertenece a ningún usuario registrado.");
    }

    const usuario = res.rows[0];

    // 2. Generar un token temporal de recuperación (validez 1 hora)
    const resetToken = jwt.sign(
        { id: usuario.id, type: 'reset' },
        SECRET,
        { expiresIn: '1h' }
    );

    // 3. Configurar el correo
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Logo (como es local por ahora, usamos el path de la landing o una URL si estuviera productivo)
    // Para Hostinger se usaría la URL real.

    const mailOptions = {
        from: `"Sistema Mensu" <${process.env.MAIL_USERNAME}>`,
        to: email,
        subject: "Recuperación de contraseña - Sistema Mensu",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="cid:logo_mensu" alt="Logo Mensu" style="width: 120px;" />
                </div>
                <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                    <h3 style="color: #2c3e50;">Hola, ${usuario.nombre || usuario.username}</h3>
                    <p style="color: #555; line-height: 1.6;">
                        Hemos recibido una solicitud para restablecer tu contraseña. Si no fuiste vos, podés ignorar este correo.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #2c3e50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Restablecer mi contraseña
                        </a>
                    </div>
                    <p style="color: #777; font-size: 0.8rem;">
                        Este enlace vencerá en 1 hora.
                    </p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #999; font-size: 0.8rem;">
                    &copy; ${new Date().getFullYear()} Mensu - Agrimensura y Topografía
                </div>
            </div>
        `,
        attachments: [
            {
                filename: 'logo_mensu.png',
                path: 'C:/agri/agrimensura/sis_agrimensura/FRONTEND/public/imagenes_landing/logo_mensu.png',
                cid: 'logo_mensu'
            }
        ]
    };

    // 4. Enviar correo
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de recuperación enviado exitosamente a: ${email}`);
    } catch (error) {
        console.error("Error al enviar email de recuperación:", error);
        throw new Error("No se pudo enviar el correo de recuperación. Intente más tarde.");
    }
};

export const resetPassword = async (token: string, nuevaPass: string) => {
    try {
        // 1. Verificar el token
        const decodificado: any = jwt.verify(token, SECRET);

        // Seguridad extra: verificar que el tipo sea 'reset'
        if (decodificado.type !== 'reset') {
            throw new Error("Token inválido para esta operación.");
        }

        // 2. Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(nuevaPass, salt);

        // 3. Actualizar en la base de datos
        await query(
            "UPDATE usuarios SET password = ?, intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?",
            [hash, decodificado.id]
        );

        console.log(`Contraseña actualizada para el usuario ID: ${decodificado.id}`);
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new Error("El enlace ha vencido. Por favor, solicitá uno nuevo.");
        }
        throw new Error(error.message || "Token inválido o error al procesar.");
    }
};

export const sendInvitationEmail = async (email: string, expedienteId: number, nombreCliente: string) => {
    // 1. Generar token de invitación (válido por 48 horas)
    const invitationToken = jwt.sign(
        { expedienteId, email, nombre: nombreCliente, type: 'invitation' },
        SECRET,
        { expiresIn: '48h' }
    );

    const registrationLink = `http://localhost:5173/registro-cliente?token=${invitationToken}`;

    const mailOptions = {
        from: `"Estudio Daviña - Sistema" <${process.env.MAIL_USERNAME}>`,
        to: email,
        subject: "Sistema de Seguimiento de Gestión para Servicios de Agrimensura",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a237e; margin: 0; font-size: 28px; letter-spacing: -0.5px;">Estudio de Agrimensura Daviña</h1>
                    <div style="margin-top: 10px;">
                        <img src="cid:logo_mensu" alt="Logo Mensu" style="width: 80px; opacity: 0.9;" />
                    </div>
                </div>
                
                <div style="padding: 25px; background-color: #f8f9fa; border-radius: 12px; border-left: 4px solid #1a237e;">
                    <h3 style="color: #1a237e; margin-top: 0; font-size: 20px;">Estimado/a ${nombreCliente},</h3>
                    <p style="color: #444; line-height: 1.7; font-size: 16px;">
                        Para brindarte un mejor servicio, hemos habilitado nuestro <strong>Portal de Seguimiento</strong>. 
                        Desde aquí podrás ver el estado de tu expediente en tiempo real.
                    </p>
                    <p style="color: #444; line-height: 1.7; font-size: 16px; font-weight: 500;">
                        Por favor, completá tu registro para activar tu cuenta:
                    </p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${registrationLink}" style="background-color: #1a237e; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; transition: background 0.3s;">
                            Crea tu usuario y contraseña
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 13px; font-style: italic;">
                        Este enlace tiene una validez de 48 horas.
                    </p>
                </div>
                
                <div style="margin-top: 30px; text-align: center; border-top: 1px solid #eee; paddingTop: 20px;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        Este es un mensaje automático, por favor no lo respondas.
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                        &copy; ${new Date().getFullYear()} Estudio de Agrimensura Daviña
                    </p>
                </div>
            </div>
        `,
        attachments: [
            {
                filename: 'logo_mensu.png',
                path: 'C:/agri/agrimensura/sis_agrimensura/FRONTEND/public/imagenes_landing/logo_mensu.png',
                cid: 'logo_mensu'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invitación enviada a ${email} para el expediente ${expedienteId}`);
    } catch (error) {
        console.error("Error al enviar invitación por email:", error);
        // No lanzamos error para no trabar la creación del expediente, pero avisamos.
    }
};

export const registerFromInvitation = async (token: string, username: string, pass: string) => {
    // 1. Verificar token
    const decodificado: any = jwt.verify(token, SECRET);
    if (decodificado.type !== 'invitation') throw new Error("Token de invitación inválido.");

    const nombre = decodificado.nombre || "Cliente";

    // 2. Verificar si el usuario ya existe
    const existUser = await query("SELECT id FROM usuarios WHERE username = ?", [username]);
    if (existUser.rows.length > 0) throw new Error("El nombre de usuario seleccionado ya existe.");

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);

    // 4. Crear usuario con rol 'cliente' y vincular expediente
    await query(
        `INSERT INTO usuarios (username, password, nombre, email, rol, expediente_id, activo) 
         VALUES (?, ?, ?, ?, 'cliente', ?, 1)`,
        [username, hash, nombre, decodificado.email, decodificado.expedienteId]
    );

    // 5. Generar login automático
    return login(username, pass);
};
