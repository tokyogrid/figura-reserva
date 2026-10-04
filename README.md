# Figura Reserva - Sistema de pre-venta de figuras de anime

Web para que los clientes reserven figuras de anime que tú compras en Japón (Subuya, Suruga-ya, Mandarake) y les envías a España o vendes por Vinted.

## Características

- **Catálogo público** con filtros (búsqueda, categoría, serie, stock)
- **Carrito + Stripe Checkout** para cobrar la reserva al momento
- **Panel de admin** para gestionar productos, pedidos y solicitudes
- **Solicitudes de figuras** - clientes piden lo que no está en catálogo
- **Emails automáticos** (Resend) para confirmaciones y notificaciones
- **Tracking de pedidos** público para clientes
- **Stock reservado** automáticamente al pagar

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite (desarrollo) / PostgreSQL (producción)
- Stripe (pagos)
- Resend (emails)
- Lucide React (iconos)

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus claves reales

# 3. Inicializar base de datos
npm run db:push

# 4. Desarrollo
npm run dev
```

## Variables de entorno requeridas

```env
# Database (SQLite para desarrollo)
DATABASE_URL="file:./dev.db"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Figura Reserva"

# Admin (genera hash con: npx tsx -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash('tu-password', 12))")
ADMIN_EMAIL="tu@email.com"
ADMIN_PASSWORD_HASH="$2a$12$..."

# Resend (emails)
RESEND_API_KEY="re_..."

# Session (mínimo 32 caracteres aleatorios)
SESSION_PASSWORD="clave-super-secreta-de-almenos-32-caracteres"
```

## Configurar Stripe Webhook

```bash
# En desarrollo con ngrok
ngrok http 3000
# Copia la URL https y añade /api/stripe/webhook
# En Stripe Dashboard > Webhooks > Add endpoint
# Eventos: checkout.session.completed, checkout.session.expired, payment_intent.payment_failed
```

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                 # Home
│   ├── catalogo/                # Catálogo público
│   │   ├── page.tsx
│   │   ├── CatalogContent.tsx
│   │   └── [slug]/              # Detalle producto
│   ├── checkout/                # Pago Stripe
│   ├── solicitar/               # Formulario solicitud figura
│   ├── como-funciona/           # Landing explicativa
│   ├── pedido/[id]/             # Tracking público
│   ├── admin/                   # Panel admin (protegido)
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard
│   │   ├── products/            # CRUD productos
│   │   ├── orders/              # Gestión pedidos
│   │   └── requests/            # Solicitudes clientes
│   └── api/                     # API Routes
│       ├── products/            # Catálogo público
│       ├── checkout/            # Crear sesión Stripe
│       ├── stripe/webhook/      # Webhook Stripe
│       ├── admin/               # Admin APIs
│       └── requests/            # Solicitudes API
├── components/
│   ├── ui/                      # Componentes base (Button, Input, Card, Badge, Toaster)
│   ├── Header.tsx
│   ├── CartDrawer.tsx
│   └── CartProvider.tsx
├── lib/
│   ├── prisma.ts                # Cliente Prisma
│   ├── stripe.ts                # Helpers Stripe
│   ├── email.ts                 # Emails Resend
│   ├── cart-context.tsx         # Estado carrito global
│   ├── auth.ts                  # Auth admin (JWT en cookies)
│   └── utils.ts                 # Utilidades (formato precio, fechas, etc.)
└── middleware.ts                # Protección rutas admin
```

## Flujo de trabajo

1. **Cliente** ve catálogo → añade al carrito → paga con Stripe
2. **Webhook Stripe** confirma pago → crea pedido en BD → reserva stock → emails
3. **Tú (admin)** ves pedido en `/admin/orders` → cambias estado: `CONFIRMED` → `PURCHASING` → `SHIPPED` → `DELIVERED`
4. **Cliente** recibe emails en cada paso y puede ver tracking en `/pedido/{id}`
5. **Opcional**: Cliente solicita figura no en catálogo → tú la buscas → creas producto → cliente reserva

## Despliegue en Vercel

1. Push a GitHub
2. Import en Vercel
3. Añade variables de entorno en Vercel Dashboard
4. Configura webhook Stripe con URL de producción
5. Cambia `DATABASE_URL` a PostgreSQL (Neon, Supabase, Railway, etc.)

```bash
# Para producción con PostgreSQL
# En prisma/schema.prisma cambia:
# provider = "postgresql"
# Y usa DATABASE_URL de tu proveedor
```

## Comandos útiles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # ESLint
npm run db:push      # Sincronizar schema Prisma
npm run db:studio    # Prisma Studio (GUI base de datos)
```

## Personalización

- **Colores**: Edita `tailwind.config.ts`
- **Emails**: Modifica `src/lib/email.ts`
- **Estados pedido**: Edita enums en `prisma/schema.prisma` y labels en `src/lib/utils.ts`
- **Campos producto**: Añade en schema Prisma y formulario admin

## Licencia

MIT - Úsalo libremente para tu negocio de figuras.