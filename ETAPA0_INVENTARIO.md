# ETAPA 0 - INVENTARIO Y PREPARACIÓN (FASE IDIOMA - PARTE A)

## 1. EVIDENCIA DE ESTADO INICIAL

### Git Status
```bash
$ git status
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

### Tag Creada
```bash
$ git tag
english-version
```

### Esquema Prisma Sin Cambios
```bash
$ git diff HEAD -- prisma/schema.prisma
(no output)
```

### Middleware Original (sin i18n)
```typescript
// src/middleware.ts - Sin next-intl, solo protección de rutas admin/checkout/account/order
```

### Next.config.js (sin configuración i18n)
- Sin configuración `i18n` 
- Sin redirects relacionados con locales
- CSP y headers de seguridad estándar

---

## 2. ETIQUETA CREADA
```bash
$ git tag english-version
```
Tag `english-version` creada en HEAD actual (commit 98750ce).

---

## 3. SCRIPT SMOKE TEST CREADO

### Archivo: `scripts/smoke.mjs`
- Ubicación: `scripts/smoke.mjs`
- Script npm: `"smoke": "node scripts/smoke.mjs"`
- Verifica: HTTP status, `<html lang="es">`, canonical URL, title no vacío
- Rutas testeadas: `/`, `/catalog`, `/request`, `/how-it-works`, `/contact`, `/vinted`, `/login`, `/register`, `/verify`, `/checkout` (302), `/account/orders` (302), `/admin/login`, `/robots.txt`, `/sitemap.xml`
- Extrae slug de `/sitemap.xml` para probar `/catalog/<slug>`
- Requiere servidor en producción (`npm run build && npm run start`)

### Script npm añadido a package.json:
```json
"smoke": "node scripts/smoke.mjs"
```

---

## 4. INVENTARIO DE ARCHIVOS CON TEXTO VISIBLE

### Archivos Principales (App Router)

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `src/app/page.tsx` | Page | Home - Hero, stats, features, productos destacados |
| `src/app/layout.tsx` | Layout | Root layout, metadata base, header/footer |
| `src/app/catalog/page.tsx` | Page | Catálogo principal con filtros |
| `src/app/catalog/[slug]/page.tsx` | Page | Ficha de producto (server) |
| `src/app/catalog/[slug]/ProductDetail.tsx` | Client | Detalle producto (client) |
| `src/app/catalog/[slug]/components/ProductDetailContent.tsx` | Client | Contenido detalle (botones, specs, etc.) |
| `src/app/catalog/CatalogContent.tsx` | Client | Contenido catálogo (filtros, grid, paginación) |
| `src/app/request/page.tsx` | Page | Solicitar figura (client wrapper) |
| `src/app/request/RequestClient.tsx` | Client | Formulario solicitud con drawer |
| `src/app/request/RequestDrawer.tsx` | Client | Drawer formulario solicitud |
| `src/app/how-it-works/page.tsx` | Page | Cómo funciona (server wrapper) |
| `src/app/how-it-works/HowItWorksContent.tsx` | Client | Contenido cómo funciona |
| `src/app/contact/page.tsx` | Page | Contacto (client wrapper) |
| `src/app/contact/ContactClient.tsx` | Client | Formulario contacto |
| `src/app/vinted/page.tsx` | Page | Vinted (client wrapper) |
| `src/app/vinted/VintedClient.tsx` | Client | Dashboard Vinted |
| `src/app/login/page.tsx` | Page | Login (wrapper + client) |
| `src/app/register/page.tsx` | Page | Registro (wrapper + client) |
| `src/app/verify/page.tsx` | Page | Verificación email (wrapper + client) |
| `src/app/checkout/page.tsx` | Page | Checkout (form + Stripe) |
| `src/app/checkout/success/page.tsx` | Page | Éxito checkout |
| `src/app/order/[id]/page.tsx` | Page | Seguimiento pedido |
| `src/app/vinted/page.tsx` | Page | Dashboard Vinted |
| `src/app/vinted/VintedClient.tsx` | Client | Dashboard Vinted interactivo |

### Componentes UI con Texto
| Archivo | Descripción |
|---------|-------------|
| `src/components/ProductCard.tsx` | Tarjeta producto (catalog, home) |
| `src/components/ProductCard.tsx` | ProductCardSkeleton |
| `src/components/Header.tsx` | Header, navegación, menú móvil, carrito |
| `src/components/CartDrawer.tsx` | Drawer carrito |
| `src/components/RequestDrawer.tsx` | Drawer solicitud figura |
| `src/components/ui/Button.tsx` | Botones (variants, sizes) |
| `src/components/ui/Input.tsx` | Input, Select, Textarea |
| `src/components/ui/Button.tsx` | DropdownMenu, RadioGroup, Label |
| `src/components/ui/Toast.tsx` | Toaster, toast notifications |

### Configuración y Utilidades (Textos Centralizados)
| Archivo | Contenido |
|---------|-----------|
| `src/lib/site-config.ts` | **Principal** - Todo el copy del sitio (hero, features, hero, catálogo, checkout, request, admin, FAQ, etc.) |
| `src/lib/site-config.ts` | Tipos TypeScript `SiteConfig` |
| `src/lib/utils.ts` | `formatPrice`, `formatDate`, `slugify`, labels de estados (pedido, pago, request, producto) |
| `src/lib/email.ts` | Plantillas email (Resend) - confirmaciones, admin, verificación |
| `src/lib/site-config.ts` | `siteConfig` - objeto centralizado con TODO el copy |

### Rutas API con Mensajes Visibles
| Ruta | Tipo |
|------|------|
| `/api/checkout` | Checkout Stripe |
| `/api/contact` | Formulario contacto |
| `/api/auth/*` | Auth (login, register, verify) |
| `/api/checkout` | Checkout Stripe |
| `/api/auth/verify` | Verificación email |
| `/api/contact` | Soporte |

---

## 4. STRINGS USADOS EN LÓGICA (NO TRADUCIR - MAPAS VALOR→ETIQUETA)

### Estados de Producto (`Product.status`)
| Valor BD | Etiqueta ES | Uso |
|----------|-------------|-----|
| `AVAILABLE` | "Disponible" | Filtro, tarjeta, ficha |
| `PRE_ORDER` | "Pre-order" | Ficha, catálogo |
| `LOW_STOCK` | "Pocas unidades" | Badge, ficha |
| `OUT_OF_STOCK` | "Agotado" | Badge, ficha, carrito |
| `PRE_ORDER` | "Pre-order (10-15 días)" | Ficha |
| `DISCONTINUED` | "Descatalogado" | Admin |

**Archivos**: `src/app/catalog/[slug]/components/ProductDetailContent.tsx`, `src/app/catalog/CatalogContent.tsx`, `src/components/ProductCard.tsx`, `src/app/catalog/page.tsx`, `src/app/page.tsx`, `src/app/catalog/[slug]/components/ProductDetailContent.tsx`, `src/lib/site-config.ts`, `src/lib/utils.ts`, `src/app/admin/products/page.tsx`, `src/app/admin/products/[id]/edit/page.tsx`, `src/app/admin/products/new/page.tsx`, `src/app/admin/products/page.tsx`, `src/app/api/admin/products/route.ts`, `src/app/api/products/route.ts`

### Estados de Pedido (`Order.status`)
| Valor BD | Etiqueta ES | Uso |
|----------|-------------|-----|
| `PENDING` | "Pendiente" | Cuenta, admin, email |
| `CONFIRMED` | "Confirmado" | Tracking, admin, email |
| `PURCHASING_IN_JAPAN` | "Comprando en Japón" | Tracking, email |
| `SHIPPED` | "Enviado" | Tracking, admin, email |
| `DELIVERED` | "Entregado" | Tracking, admin |
| `CANCELLED` | "Cancelado" | Admin, email |
| `REFUNDED` | "Reembolsado" | Admin, email |
| `PURCHASING_VINTED` | "Comprando (Vinted)" | Vinted |

**Archivos**: `src/app/account/orders/page.tsx`, `src/app/account/requests/page.tsx`, `src/app/account/requests/[id]/page.tsx`, `src/app/admin/orders/page.tsx`, `src/app/admin/orders/[id]/page.tsx`, `src/app/admin/orders/[id]/vinted-status/route.ts`, `src/app/order/[id]/OrderTrackingContent.tsx`, `src/app/api/admin/orders/[id]/route.ts`, `src/app/api/admin/orders/[id]/vinted-status/route.ts`, `src/lib/email.ts`, `src/lib/utils.ts`, `src/lib/site-config.ts`

### Estados de Pago (`Order.paymentStatus`)
| Valor BD | Etiqueta ES |
|----------|-------------|
| `UNPAID` | "Pendiente" |
| `PAID` | "Pagado" |
| `PARTIAL` | "Parcial" |
| `REFUNDED` | "Reembolsado" |
| `FAILED` | "Fallido" |

### Estados de Request (`FigureRequest.status`)
| Valor BD | Etiqueta ES |
|----------|-------------|
| `PENDING` | "Pendiente" |
| `SEARCHING` | "Buscando" |
| `FOUND` | "Encontrada - Pendiente confirmación" |
| `PURCHASING` | "Comprando" |
| `PURCHASED` | "Comprada" |
| `SHIPPED` | "Enviada" |
| `DELIVERED` | "Entregada" |
| `CANCELLED` | "Cancelada" |
| `UNAVAILABLE` | "No disponible" |

### Estados de Pago (`PaymentStatus`)
| Valor BD | Etiqueta ES |
|----------|-------------|
| `UNPAID` | "No pagado" |
| `PAID` | "Pagado" |
| `PARTIAL` | "Parcial" |
| `REFUNDED` | "Reembolsado" |
| `FAILED` | "Fallido" |

### Estados Vinted (`VintedOrder.status`)
| Valor BD | Etiqueta ES |
|----------|-------------|
| `PENDING` | "Pendiente" |
| `CONFIRMED` | "Confirmado" |
| `PURCHASING_IN_JAPAN` | "Comprando en Japón" |
| `AVAILABLE_ON_VINTED` | "Disponible en Vinted" |

---

## 5. GLOSARIO Y GUÍA DE ESTILO PROPUESTA

### Términos Clave (Glosario)

| Inglés | Español (España) | Notas |
|--------|------------------|-------|
| **Figure** | **Figura** | Sustantivo principal |
| **Reserve / Reserve Now** | **Reservar / Reservar ahora** | Verbo + CTA |
| **Reserve Figure** | **Reservar figura** | CTA principal |
| **Request Figure** | **Solicitar figura** | Página / CTA |
| **Request Figure** | **Solicitar figura** | Título página |
| **Order** | **Pedido** | Sustantivo |
| **Order Tracking** | **Seguimiento de pedido** | Página |
| **Order Tracking** | **Seguimiento de pedido** | Título página |
| **Cart** | **Carrito** | Header, drawer |
| **Cart Drawer** | **Carrito** | Componente |
| **Cart** | **Carrito** | Título drawer |
| **Checkout** | **Pagar / Finalizar compra** | Página / CTA |
| **Checkout Success** | **Pedido confirmado** | Página éxito |
| **Checkout Success** | **¡Pedido confirmado!** | Título página éxito |
| **Order Confirmation** | **Confirmación de pedido** | Email / Página |
| **Order Confirmation** | **Confirmación de pedido** | Título email |
| **Order Confirmation** | **Tu pedido está confirmado** | Texto email |
| **Request Figure** | **Solicitar figura** | Página / CTA |
| **Request Figure** | **Solicitar figura** | Título página |
| **Request Submitted** | **Solicitud enviada** | Toast / Confirmación |
| **My Orders** | **Mis pedidos** | Cuenta |
| **My Requests** | **Mis solicitudes** | Cuenta |
| **My Profile** | **Mi perfil** | Cuenta |
| **Account** | **Mi cuenta** | Navegación |
| **Login** | **Iniciar sesión** | Link / Página |
| **Register** | **Crear cuenta** | Link / Página |
| **Sign In** | **Iniciar sesión** | Botón / Link |
| **Sign Up** | **Crear cuenta** | Botón / Link |
| **Log Out** | **Cerrar sesión** | Botón / Menu |
| **Log Out** | **Cerrar sesión** | Dropdown |
| **My Account** | **Mi cuenta** | Dropdown |
| **Sign In** | **Iniciar sesión** | Dropdown |
| **Cart** | **Carrito** | Header |
| **Cart** | **Carrito ({count})** | Badge header |
| **Empty Cart** | **Tu carrito está vacío** | Estado vacío |
| **Continue Shopping** | **Seguir comprando** | Botón carrito vacío |
| **Checkout** | **Finalizar compra (€{total})** | Botón carrito |
| **Subtotal** | **Subtotal** | Carrito / Checkout |
| **Shipping** | **Envío** | Carrito / Checkout |
| **Free Shipping** | **Gratis** | Carrito / Checkout |
| **Free Shipping** | **Envío gratis** | Texto |
| **Free** | **Gratis** | Badge |
| **Total** | **Total** | Carrito / Checkout |
| **Secure Checkout** | **Pago seguro con Stripe** | Badge / Texto |
| **Secure Stripe Payment** | **Pago seguro con Stripe** | Texto |
| **Continue to Payment** | **Continuar al pago** | Botón |
| **Continue to Payment** | **Continuar al pago** | Botón checkout |
| **Shipping Information** | **Información de envío** | Sección formulario |
| **Billing Address** | **Dirección de facturación** | (si existe) |
| **Shipping Address** | **Dirección de envío** | Formulario |
| **Full Name** | **Nombre completo** | Campo |
| **Email** | **Email** | Campo |
| **Phone** | **Teléfono** | Campo |
| **Address** | **Dirección** | Campo |
| **City** | **Ciudad** | Campo |
| **Postal Code** | **Código postal** | Campo |
| **Country** | **País** | Campo |
| **Notes** | **Notas** | Campo |
| **Notes (Optional)** | **Notas (opcional)** | Placeholder |
| **Add to Cart** | **Añadir al carrito** | Botón ficha |
| **Add to Cart** | **Añadir al carrito** | Botón tarjeta |
| **Buy Now** | **Comprar ahora** | Botón ficha |
| **Reserve Now** | **Reservar ahora** | Botón ficha |
| **Reserve** | **Reservar** | Botón genérico |
| **Out of Stock** | **Agotado** | Badge / Estado |
| **Out of Stock** | **Agotado" | Estado ficha |
| **Out of Stock** | **Agotado" | Texto tarjeta |
| **Low Stock** | **Pocas unidades** | Badge |
| **Low Stock** | **Pocas unidades ({count} left)** | Texto ficha |
| **Low Stock** | **Solo {count} disponibles** | Texto tarjeta |
| **Pre-Order** | **Pre-order" | Badge / Estado |
| **Pre-Order** | **Pre-order (10-15 días)" | Texto ficha |
| **Pre-Order** | **Pre-order (10-15 días)" | Tooltip / Texto |
| **Featured** | **Destacado" | Badge |
| **Featured** | "Destacado" | Badge home / catálogo |
| **New** | "NUEVO" | Badge animado |
| **New" | "NUEVO" | Badge tarjeta |
| **Featured Figures** | "Figuras destacadas" | Sección home |
| **Latest Arrivals** | "Últimas llegadas" | Sección home |
| **Featured Figures** | "Figuras destacadas" | Título sección |
| **Popular Anime Series** | "Series de anime populares" | Sección home |
| **Figure Catalog** | "Catálogo de figuras" | Título catálogo |
| **Find your perfect figure** | "Encuentra tu figura perfecta" | Subtítulo catálogo |
| **Search by name, character, series...** | "Busca por nombre, personaje, serie..." | Placeholder búsqueda |
| **Category** | "Categoría" | Label filtro |
| **Series / Anime** | "Serie / Anime" | Label filtro |
| **In Stock Only** | "Solo en stock" | Checkbox filtro |
| **Sort** | "Ordenar" | Label select |
| **Featured** | "Destacados" | Opción orden |
| **Price: Low to High** | "Precio: menor a mayor" | Opción orden |
| **Price: High to Low** | "Precio: mayor a menor" | Opción orden |
| **Newest** | "Más nuevos" | Opción orden |
| **A-Z** | "A-Z" | Opción orden |
| **Clear Filters** | "Limpiar filtros" | Botón |
| **Clear** | "Limpiar" | Botón badge |
| **No Figures Found** | "No se han encontrado figuras" | Estado vacío |
| **No Figures Match** | "No hay figuras que coincidan" | Estado vacío búsqueda |
| **No Figures for Series** | "No hay figuras de esta serie" | Estado vacío serie |
| **Clear Filters** | "Limpiar filtros" | Botón estado vacío |
| **Browse Catalog** | "Ver catálogo" | Botón CTA vacío |
| **Request Figure** | "Solicitar figura" | Botón CTA vacío |
| **Request Figure** | "Solicitar figura" | CTA hero |
| **Request Figure** | "Solicitar figura" | Botón drawer |
| **Request a Figure** | "Solicitar una figura" | Título drawer |
| **Custom Figure Search** | "Búsqueda personalizada" | Subtítulo |
| **Japan Prices** | "Precios de Japón" | Beneficio |
| **Priority Access** | "Acceso prioritario" | Beneficio |
| **No Commitment** | "Sin compromiso" | Beneficio |
| **No purchase commitment** | "Sin compromiso de compra" | Texto beneficio |
| **Only reserve if you like the final price** | "Solo reservas si te gusta el precio final" | Texto beneficio |
| **How It Works** | "Cómo funciona" | Título sección |
| **How It Works** | "Cómo funciona" | Título página |
| **Choose Your Figure** | "Elige tu figura" | Paso 1 |
| **Reserve & Choose** | "Reserva y elige" | Paso 2 |
| **Option A** | "Opción A" | Label |
| **Option B** | "Opción B" | Label |
| **Buy Direct** | "Compra directa" | Label opción |
| **Ship to My Address** | "Envío a mi dirección" | Label opción |
| **Buy via Vinted** | "Comprar vía Vinted" | Label opción |
| **Other Address** | "Otra dirección" | Label opción |
| **Receive Your Figure** | "Recibe tu figura" | Paso final |
| **Why Not Buy Direct on Vinted** | "Por qué no comprar directo en Vinted/Wallapop" | Título comparación |
| **Price** | "Precio" | Columna tabla |
| **Authenticity** | "Autenticidad" | Columna tabla |
| **Condition** | "Estado" | Columna tabla |
| **Guarantee" | "Garantía" | Columna tabla |
| **Availability** | "Disponibilidad" | Columna tabla |
| **Exclusives" | "Exclusivas" | Columna tabla |
| **Frequently Asked Questions" | "Preguntas Frecuentes" | Título FAQ |
| **Is it safe to pay upfront?** | "¿Es seguro pagar por adelantado?" | FAQ Q |
| **How long until the figure arrives?** | "¿Cuánto tarda en llegar la figura?" | FAQ Q |
| **What if the figure arrives damaged?** | "¿Qué pasa si la figura llega dañada?" | FAQ Q |
| **Can I request figures not in catalog?** | "¿Puedo pedir figuras que no estén en el catálogo?" | FAQ Q |
| **Are figures 100% authentic?** | "¿Las figuras son 100% auténticas?" | FAQ Q |
| **Yes. We use Stripe..."** | "Sí. Usamos Stripe..." | FAQ A |
| **Depends on Japan availability..."** | "Depende de la disponibilidad en Japón..." | FAQ A |
| **14-day returns..."** | "14 días de devolución..." | FAQ A |
| **Absolutely! Use the Request Figure form..."** | "¡Por supuesto! Usa el formulario..." | FAQ A |
| **Contact Support" | "Contactar Soporte" | Título página |
| **Forgot your password?** | "¿Olvidaste tu contraseña?" | Link login |
| **Need help with your account?** | "¿Necesitas ayuda con tu cuenta?" | Link login |
| **Contact Support" | "Contactar Soporte" | Link login |
| **Don't have an account?"** | "¿No tienes cuenta?" | Texto login |
| **Create account" | "Crear cuenta" | Link registro |
| **Already have an account?"** | "¿Ya tienes cuenta?" | Texto registro |
| **Sign In" | "Iniciar sesión" | Link login |
| **Create Account" | "Crear cuenta" | Botón registro |
| **Sign In" | "Iniciar sesión" | Botón login |
| **Name" / "Nombre" | Campo |
| **Email" / "Email" | Campo |
| **Password" / "Contraseña" | Campo |
| **Confirm Password" | "Confirmar contraseña" | Campo |
| **Full Name" / "Nombre completo" | Campo |
| **Address" / "Dirección" | Campo |
| **City" / "Ciudad" | Campo |
| **Postal Code" / "Código postal" | Campo |
| **Country" / "País" | Campo |
| **Phone" / "Teléfono" | Campo |
| **Notes (optional)** | "Notas (opcional)" | Placeholder |
| **Submit" / "Enviar" | Botón |
| **Submit" / "Enviar" | Botón formulario |
| **Send Message" | "Enviar mensaje" | Botón contacto |
| **Message Sent!" | "¡Mensaje enviado!" | Toast éxito |
| **Your ticket ID: {id}"** | "Tu ticket ID: {id}" | Toast éxito |
| **We'll respond within 24-48 hours."** | "Responderemos en 24-48h." | Texto toast |
| **We'll respond within 24-48 hours."** | "Responderemos en 24-48h." | Texto contacto |
| **Check your spam folder."** | "Revisa tu carpeta de spam." | Texto ayuda |
| **Forgot password?"** | "¿Olvidaste tu contraseña?" | Link |
| **Contact Support" | "Contactar Soporte" | Link |
| **Back to Sign In" | "Volver a Iniciar Sesión" | Link |
| **Verify Your Email" | "Verifica tu email" | Título página |
| **Verify Your Email" | "Verifica tu correo" | Título página verify |
| **Enter the 6-digit code sent to {email}** | "Introduce el código de 6 dígitos enviado a {email}" | Instrucciones |
| **Didn't receive the code? Resend" | "¿No recibiste el código? Reenviar" | Link reenviar |
| **Code expires in 15 minutes."** | "El código expira en 15 minutos." | Texto ayuda |
| **Didn't receive it?"** | "¿No lo recibiste?" | Texto ayuda |
| **Check spam folder."** | "Revisa carpeta de spam." | Texto ayuda |
| **Already verified? Sign In"** | "¿Ya verificado? Iniciar sesión" | Link verify |
| **Order Confirmed!"** | "¡Pedido confirmado!" | Título éxito |
| **Order Confirmed!"** | "¡Pedido confirmado!" | Título página éxito |
| **Hi {name}, your order #{id} is confirmed."** | "Hola {name}, tu pedido #{id} está confirmado." | Texto email |
| **Thank you for your order!"** | "¡Gracias por tu pedido!" | Texto email |
| **We'll notify you by email at each step."** | "Te avisaremos por email en cada paso." | Texto email |
| **Order ID" / "ID Pedido" | Email / Página |
| **Total Paid" / "Total Pagado" | Email / Página |
| **Order Items" / "Artículos del Pedido" | Email / Página |
| **Qty" / "Cant." | Tabla |
| **Price" / "Precio" | Tabla |
| **Total" / "Total" | Tabla |
| **Next: Buying in Japan (1-2 weeks)"** | "Siguiente: Compra en Japón (1-2 semanas)" | Paso email |
| **Next: Buying in Japan (1-2 weeks)"** | "Siguiente: Compra en Japón (1-2 semanas)" | Paso página |
| **Est. Shipping: 2-3 weeks total"** | "Envío est.: 2-3 semanas total" | Estimación |
| **What Happens Now?"** | "¿Qué pasa ahora?" | Título pasos |
| **We'll notify you by email at each step."** | "Te avisaremos por email en cada paso." | Texto pasos |
| **Track Your Order" / "Seguir Pedido" | Botón CTA |
| **View My Order" / "Ver Mi Pedido" | Botón CTA |
| **Continue Shopping" / "Seguir Comprando" | Botón CTA |
| **View Order" / "Ver Pedido" | Botón CTA |
| **Continue Shopping" / "Seguir Comprando" | Botón CTA |
| **Request Figure" / "Solicitar Figura" | CTA hero |
| **Can't Find Your Figure?"** / "¿No Encuentras Tu Figura?" | Título CTA |
| **Request it and we'll search..."** / "Solicítala y buscaremos..." | Subtítulo CTA |
| **Request Figure" / "Solicitar Figura" | Botón CTA |
| **View My Order" / "Ver Mi Pedido" | Botón éxito |
| **Continue Shopping" / "Seguir Comprando" | Botón éxito |
| **Request Sent!" / "¡Solicitud Enviada!" | Título éxito request |
| **We'll contact you if we find it."** / "Te contactaremos si la encontramos." | Texto éxito |
| **Browse Catalog" / "Ver Catálogo" | Botón secundaria |
| **Request Another Figure" / "Solicitar Otra Figura" | Botón secundaria |

---

## Claims Comerciales Detectados - **[VERIFICAR]**

| Claim Inglés | Claim Español (Propuesto) | Estado | Nota |
|-------------|---------------------------|--------|------|
| "Best Price" | "Mejor Precio" | **[VERIFICAR]** | ¿Garantizado? |
| "Save up to 40%" | "Ahorra hasta un 40%" | **[VERIFICAR]** | ¿Datos reales? |
| "Best Price" | "Mejor Precio" | **[VERIFICAR]** | ¿Comparativa real? |
| "No Middlemen" | "Sin Intermediarios" | **[VERIFICAR]** | ¿Cierto 100%? |
| "Direct from Japan" | "Directo desde Japón" | **[VERIFICAR]** | ¿Origen verificado? |
| "24/7 Support" | "Soporte 24/7" | **[VERIFICAR]** | ¿Realmente 24/7? |
| "Free Shipping Over €100" | "Envío Gratis >100€" | **[VERIFICAR]** | Umbral correcto? |
| "14-Day Returns" | "Devoluciones 14 Días" | **[VERIFICAR]** | Política real? |
| "Money Back Guarantee" | "Garantía Devolución" | **[VERIFICAR]** | Términos reales? |
| "Authenticity Guaranteed" | "Autenticidad Garantizada" | **[VERIFICAR]** | Proceso real? |
| "Fast Shipping" | "Envío Rápido" | **[VERIFICAR]** | Plazos reales? |
| "24-48h Delivery" | "Entrega 24-48h" | **[VERIFICAR]** | Solo península? |
| "Secure Payment" | "Pago Seguro" | **[VERIFICAR]** | Stripe real? |
| "Money Back if Not Found" | "Devolución si no se encuentra" | **[VERIFICAR]** | Política real? |

---

## 6. SALIDA DE `npm run smoke`

> **NOTA**: No se puede ejecutar `npm run smoke` porque no hay base de datos local (`dev.db` no existe). El script requiere `npm run build && npm run start` con base de datos local funcionando (`file:./dev.db`).

### Próximos Pasos Requeridos:
1. Crear BD local: `npm run db:push` (requiere `DATABASE_URL="file:./dev.db"` en `.env.local`)
2. Ejecutar seed si existe: `npx prisma db seed` (si existe script)
3. Ejecutar: `npm run build && npm run start` en background
3. Ejecutar: `npm run smoke`

---

## RESUMEN ENTREGABLE

| Ítem | Estado |
|------|--------|
| ✅ Git status limpio | ✅ |
| ✅ Tag `english-version` creada | ✅ |
| ✅ Script `smoke.mjs` creado | ✅ |
| ✅ Script `npm run smoke` añadido a `package.json` | ✅ |
| ✅ `git diff HEAD -- prisma/schema.prisma` vacío | ✅ |
| ✅ Inventario de archivos completado | ✅ |
| ✅ Strings con lógica identificados y mapeados | ✅ |
| ✅ Glosario y guía de estilo propuestos | ✅ |
| ✅ Claims comerciales marcados `[VERIFICAR]` | ✅ |
| ⏳ `npm run smoke` pendiente (requiere BD local) | ⏳ Pendiente |
| ⏳ `npm run smoke` output | ⏳ Pendiente |

---

## PRÓXIMOS PASOS REQUERIDOS (PARA TU OK)

1. **Aprobar glosario y guía de estilo** (puedo ajustar términos)
2. **Crear BD local** (`npm run db:push` con `DATABASE_URL="file:./dev.db"`)
3. **Ejecutar `npm run build && npm run start`** en background
3. **Ejecutar `npm run smoke`** y pegar salida
3. **Confirmar A1** (Estructura global: html lang, header, footer, metadatos, home)

---

**PARADA - ESPERANDO TU OK PARA CONTINUAR CON A1**