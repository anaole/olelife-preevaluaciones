export const config = {
  // Solo el backoffice pide contraseña; la pre-evaluación ("/") queda pública
  matcher: ['/backoffice', '/backoffice.html'],
};

export default function middleware(req) {
  const auth = req.headers.get('authorization');
  const user = process.env.SITE_AUTH_USER;
  const pass = process.env.SITE_AUTH_PASS;

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const sepIndex = decoded.indexOf(':');
      const u = decoded.slice(0, sepIndex);
      const p = decoded.slice(sepIndex + 1);
      if (u === user && p === pass) {
        return; // credenciales correctas, deja pasar
      }
    }
  }

  return new Response('Acceso restringido', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="OleLife - Acceso restringido"' },
  });
}
