MapsCar 

Credenciales admin por defecto:
- Username: Admin123
- Contraseña: Administrador_123

Comandos backend:
cd mapscar-api
npm install
npx prisma generate
npx prisma migrate dev --mapscar init
npx prisma db seed
npm run dev

Comandos frontend:
cd mapscar-web
npm install
npm run dev
