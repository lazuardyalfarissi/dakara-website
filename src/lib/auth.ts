async authorize(credentials) {
  // Ambil data dari Environment Variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Log untuk debug di Vercel (bisa dihapus setelah berhasil)
  console.log("Login attempt for:", credentials?.email);

  // Validasi input
  if (!credentials?.email || !credentials?.password) {
    console.error("Login Error: Missing credentials");
    return null;
  }

  // Proteksi jika Env Variables belum terbaca
  if (!adminEmail || !adminPassword) {
    console.error("Login Error: Server environment variables are not set");
    return null;
  }

  // Cek kecocokan
  if (
    credentials.email === adminEmail &&
    credentials.password === adminPassword
  ) {
    console.log("Login Success: Access granted for", adminEmail);
    return { 
      id: '1', 
      email: credentials.email, 
      name: 'Admin Dakara' 
    };
  }

  console.warn("Login Failed: Incorrect email or password");
  return null;
},