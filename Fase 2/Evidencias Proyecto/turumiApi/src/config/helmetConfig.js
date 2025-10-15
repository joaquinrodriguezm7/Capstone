import helmet from "helmet";

const helmetConfig = helmet({
  // Protecciones por defecto
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // solo tu dominio
      scriptSrc: ["'self'"], // scripts locales
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // CSS externo
      imgSrc: ["'self'", "data:", "https://*.s3.amazonaws.com"], // imágenes en S3
      connectSrc: ["'self'", "http://localhost:3000"], // tu API en desarrollo
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // fuentes externas
      objectSrc: ["'none'"], // bloquea plugins como Flash
    },
  },

  frameguard: { action: "deny" }, // evita clickjacking
  noSniff: true, // evita MIME type sniffing
  hidePoweredBy: true, // elimina X-Powered-By
  referrerPolicy: { policy: "no-referrer" }, // controla información de referer
  hsts: process.env.NODE_ENV === "production" ? { 
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true
  } : undefined
});

export default helmetConfig;
