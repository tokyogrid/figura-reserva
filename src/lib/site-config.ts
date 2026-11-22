// Tokyo Grid - Site Configuration
// Edit this file to change all text content across the site

export const siteConfig = {
  name: "Tokyo Grid",
  tagline: "Figuras de anime de Japón, reservadas para ti",
  description: "Reserva figuras de anime directamente desde Japón. Compramos a proveedores japoneses y te las enviamos a casa. Sin intermediarios, sin riesgo.",
  url: "https://tokyogridstore.com",
  
  // Navigation
  nav: {
    catalog: "Catálogo",
    request: "Pedir Figura",
    howItWorks: "Cómo Funciona",
    vinted: "Nuestro Vinted",
  },
  
  // Hero section
  hero: {
    badge: "Novedad: Reserva figuras de anime desde Japón sin riesgo",
    title: "Tus figuras de anime sin salir de casa",
    subtitle: "Tú eliges, nosotros compramos en Japón, tú recibes. Sin sorpresas.",
    ctaPrimary: "Ver Catálogo",
    ctaSecondary: "Pedir Figura",
  },
  
  // Features
  features: [
    {
      icon: "Banknote",
      title: "Precios de Japón",
      description: "Compramos directamente a proveedores japoneses. Sin intermediarios, ahorra hasta un 40%.",
      titleColor: "text-purple-900",
    },
    {
      icon: "Shield",
      title: "Reserva Segura",
      description: "Pagas al reservar vía Stripe. Si no conseguimos la figura, devolución total.",
      titleColor: "text-purple-900",
    },
    {
      icon: "Truck",
      title: "Envío a tu Puerta",
      description: "Recibimos en España, inspeccionamos y enviamos por correo certificado (4,99 €, gratis desde 100 €).",
      titleColor: "text-purple-900",
    },
    {
      icon: "Package",
      title: "También en Vinted",
      description: "¿Prefieres Vinted? Publicamos la figura en tu cuenta y gestionamos la venta por ti.",
      titleColor: "text-purple-900",
    },
  ],
  
  // How it works steps
  howItWorks: {
    title: "Cómo Funciona",
    subtitle: "Eliges cualquier figura, escoges cómo comprarla, nosotros nos ocupamos del resto",
    steps: [
      {
        number: 1,
        icon: "Search",
        title: "Elige tu Figura",
        description: "Explora nuestro catálogo de figuras de anime disponibles desde Japón, o pide cualquier figura que no esté en la lista. Buscaremos a nuestros proveedores en Akihabara, Nakano y tiendas online.",
        details: [
          "Stock en tiempo real de proveedores de Japón",
          "Pide figuras que no estén en el catálogo",
          "Precios en EUR, sin conversión de moneda",
          "Fotos, especificaciones y disponibilidad antes de decidir",
        ],
      },
      {
        number: 2,
        icon: "CreditCard",
        title: "Reserva y Elige Cómo Comprar",
        description: "Reserva tu figura pagando una señal vía Stripe (tarjeta, Apple Pay, Google Pay). Luego eliges cómo quieres recibirla:",
        details: [
          "Pago 100 % seguro con Stripe (PCI DSS)",
          "Devolución automática si no conseguimos la figura",
          "Confirmación instantánea por email con los detalles del pedido",
        ],
      },
      {
        number: 3,
        icon: "Package",
        title: "Opción A — Compra Directa (Te la Enviamos)",
        description: "Compramos la figura en Japón, la recibimos en nuestro almacén en España, la inspeccionamos a fondo y te la enviamos a casa por correo certificado con seguimiento y seguro (4,99 €, gratis desde 100 €).",
        details: [
          "Compramos en tiendas japonesas y online",
          "Inspección: caja, figura, accesorios, hologramas de autenticidad",
          "Fotos de la figura real antes de enviarla",
          "Correo certificado con seguimiento, seguro hasta 500 €",
          "Devoluciones en 14 días si no te convence",
          "En stock: envío en 24-48 h | Sin stock: 10-20 días",
        ],
      },
      {
        number: 4,
        icon: "Package",
        title: "Opción B — Reserva para Comprar en Vinted",
        description: "¿Prefieres comprar en Vinted? Publicamos la figura en nuestra cuenta Tokyo Grid Vinted al precio acordado. Pagas una pequeña tarifa de reserva en nuestra web (se descuenta del precio en Vinted). Cuando se publique, te avisamos por email con el enlace directo para comprar en Vinted.",
        details: [
          "Tarifa de reserva pagada en nuestra web (5-15 € según la figura)",
          "La tarifa se descuenta del precio final de compra en Vinted",
          "Publicamos en nuestra cuenta verificada Tokyo Grid Vinted",
          "Recibes email con enlace directo al anuncio en Vinted",
          "Completa la compra en Vinted (protegido por la protección al comprador de Vinted)",
          "Gestionamos el envío desde nuestra dirección en España",
          "Misma inspección y fotos que la Opción A",
        ],
      },
      {
        number: 5,
        icon: "Truck",
        title: "Recibe tu Figura",
        description: "Elijas la Opción A o B, la figura sale de nuestra dirección en España. Recibes correo certificado con seguimiento, seguro y la misma inspección de calidad. ¡Disfruta de tu figura original de Japón!",
        details: [
          "Correo certificado con seguimiento y seguro",
          "Entrega en 24-48 h (Península)",
          "Devoluciones en 14 días si no te convence",
          "Autenticidad garantizada: caja original, hologramas, accesorios completos",
          "Soporte por email para cualquier duda",
        ],
      },
    ],
  },
  
  // Comparison table
  comparison: {
    title: "¿Por Qué No Comprar Directo en Vinted/Wallapop?",
    subtitle: "Diferencias clave entre reventa y reserva directa",
    headers: ["Aspecto", "Vinted / Wallapop", "Tokyo Grid"],
    rows: [
      ["Precio", "+50-200 % sobre precio de Japón", "Precio de Japón + pequeño margen"],
      ["Autenticidad", "Riesgo de bootlegs/falsificaciones", "100 % original, tiendas oficiales"],
      ["Estado", "Fotos a veces engañosas", "Enviamos fotos reales antes de enviar"],
      ["Garantía", "Ninguna (venta privada)", "Devoluciones 14 días + seguro de envío"],
      ["Disponibilidad", "Solo lo que ya está en España", "Acceso al catálogo completo de Japón"],
      ["Exclusivas", "Imposibles de conseguir", "Podemos conseguir exclusivas de eventos/tiendas"],
    ],
  },
  
  // FAQ
  faq: [
    {
      q: "¿Es seguro pagar por adelantado?",
      a: "Sí. Usamos Stripe (igual que Shopify, Amazon). Tu dinero se retiene hasta que confirmamos la compra. Si no conseguimos la figura, Stripe devuelve el dinero a tu tarjeta en 5-10 días laborables.",
    },
    {
      q: "¿Cuánto tarda en llegar la figura?",
      a: "Depende de la disponibilidad en Japón. Normalmente 2-3 semanas desde el pago: 1-2 semanas para comprar y recibir en España + 1 semana para enviártela. Te avisamos en cada paso.",
    },
    {
      q: "¿Qué pasa si la figura llega dañada o equivocada?",
      a: "Devoluciones en 14 días (gastos de envío a nuestro cargo si es error nuestro). Inspeccionamos antes de enviar y mandamos fotos. Si se daña en el transporte, el seguro postal cubre hasta 500 €.",
    },
    {
      q: "¿Pido figuras que no estén en el catálogo?",
      a: "¡Claro! Usa el formulario 'Pedir Figura'. Buscamos a nuestros proveedores y, si la encontramos, te avisamos con precio y fotos. Tienes prioridad para reservar antes de que salga al catálogo.",
    },
    {
      q: "¿Las figuras son 100 % auténticas?",
      a: "Sí. Solo compramos en tiendas oficiales y retailers japoneses. Nunca en mercados de segunda mano dudosos. Cada figura viene con caja original, hologramas de autenticidad y accesorios completos.",
    },
  ],
  
  // Catalog
  catalog: {
    title: "Catálogo de Figuras",
    subtitle: "Encuentra tu figura perfecta y resérvala al precio de Japón",
    searchPlaceholder: "Buscar por nombre, personaje, serie...",
    categoryPlaceholder: "Categoría",
    seriesPlaceholder: "Serie / Anime",
    inStockOnly: "Solo en stock",
    sortOptions: [
      { value: "featured", label: "Destacados" },
      { value: "price-asc", label: "Precio: de menor a mayor" },
      { value: "price-desc", label: "Precio: de mayor a menor" },
      { value: "newest", label: "Más nuevas" },
      { value: "name", label: "A-Z" },
    ],
    noResults: "No se han encontrado figuras",
    noResultsDesc: "Prueba a cambiar los filtros o busca otra cosa",
    clearFilters: "Limpiar filtros",
    loading: "Cargando...",
  },
  
  // Product detail
  product: {
    addToCart: "Reservar Ahora",
    buyNow: "Comprar Ahora",
    outOfStock: "Agotado",
    lowStock: "Pocas Unidades - {count} disponibles",
    preOrder: "Pre-Order (10-15 días)",
    quantity: "Cantidad",
    maxAvailable: "Máx. {max} unidad(es) disponibles",
    shippingInfo: "Envío 4,99 € (gratis desde 100 €)",
    securePayment: "Pago Seguro con Stripe",
    returns: "Devoluciones 14 Días",
    authentic: "Auténtico",
    authenticDesc: "Compradas en tiendas oficiales JP",
    secure: "Seguro",
    secureDesc: "Reembolso si no la conseguimos",
    fast: "Rápido",
    fastDesc: "Enviado 24-48 h tras recibirla",
  },
  
  // Checkout
  checkout: {
    title: "Finalizar Compra",
    emptyCart: "El carrito está vacío",
    emptyCartDesc: "Añade figuras del catálogo para continuar",
    browseCatalog: "Ver Catálogo",
    shippingInfo: "Datos de Envío",
    name: "Nombre Completo",
    email: "Email",
    phone: "Teléfono",
    address: "Dirección",
    city: "Ciudad",
    postalCode: "Código Postal",
    country: "País",
    notes: "Notas (opcional)",
    notesPlaceholder: "Instrucciones de entrega, buzón, etc.",
    continueToPayment: "Continuar al Pago Seguro",
    orderSummary: "Resumen del Pedido",
    items: "artículo(s)",
    subtotal: "Subtotal",
    shipping: "Envío",
    free: "Gratis",
    addForFreeShipping: "Añade {amount} para envío gratis",
    total: "Total",
    paymentMethods: "Pago con tarjeta (Visa, Mastercard, Amex)",
    secure: "100 % seguro - No guardamos tus datos de tarjeta",
    confirmation: "Recibirás la confirmación por email",
    purchaseOptions: {
      title: "¿Cómo quieres recibir tu figura?",
      direct: {
        label: "Enviar a Mi Dirección",
        description: "Rellenamos automáticamente tu dirección guardada",
      },
      vinted: {
        label: "Otra Dirección",
        description: "Introduce una dirección de envío distinta manualmente",
      },
    },
  },
  
  // Checkout success
  checkoutSuccess: {
    title: "¡Pedido Confirmado!",
    subtitle: "Hola {name}, tu pedido <strong>#{id}</strong> está confirmado.",
    emailSent: "Confirmación enviada a {email}",
    nextStep: "Siguiente paso: Compra en Japón (1-2 semanas)",
    shippingEstimate: "Envío estimado: 2-3 semanas en total",
    whatHappensNext: "¿Qué pasa ahora?",
    steps: [
      "Compramos tus figuras a proveedores japoneses al mejor precio",
      "Recibimos en España, inspeccionamos y preparamos el envío",
      "Enviamos por correo certificado con seguimiento (o publicamos en Vinted si elegiste esa opción)",
      "Recibes tu paquete y ¡disfrutas de tus figuras!",
    ],
    continueShopping: "Seguir Comprando",
    viewOrder: "Ver Mi Pedido",
  },
  
  // Request figure
  request: {
    title: "¿No Encuentras Tu Figura?",
    subtitle: "Cuéntanos qué buscas y la buscaremos entre nuestros proveedores japoneses. Si la encontramos, tienes prioridad para reservar.",
    yourInfo: "Tus Datos",
    name: "Nombre",
    email: "Email",
    figureDetails: "Detalles de la Figura",
    series: "Serie / Anime",
    seriesPlaceholder: "ej., Spy × Family, One Piece, Evangelion...",
    character: "Personaje",
    characterPlaceholder: "ej., Anya Forger, Monkey D. Luffy, Asuka Langley...",
    manufacturer: "Fabricante",
    manufacturerPlaceholder: "Bandai, Good Smile, Kotobukiya...",
    scale: "Escala",
    scalePlaceholder: "1/7, 1/8, 1/6, Nendoroid...",
    budgetMax: "Presupuesto Máx. (€)",
    budgetPlaceholder: "ej., 150",
    notes: "Notas Adicionales",
    notesPlaceholder: "Versión concreta, exclusiva, estado (nueva/usada), enlaces de referencia...",
    submit: "Enviar Petición",
    noCommitment: "Sin compromiso de compra. Te contactaremos si la encontramos y decides si reservas.",
    benefits: [
      { icon: "Banknote", title: "Precios de Japón", desc: "Buscamos al mejor precio entre proveedores japoneses" },
      { icon: "Sparkles", title: "Acceso Prioritario", desc: "Si la encontramos, eliges primero si reservas" },
      { icon: "MessageSquare", title: "Sin Compromiso", desc: "Solo reservas si te convence el precio final" },
    ],
    success: {
      title: "¡Petición Enviada!",
      desc: "Hemos recibido tu petición. La revisaremos y te enviaremos un email a <strong>{email}</strong> si podemos encontrar la figura.",
      browseCatalog: "Ver Catálogo Actual",
      requestAnother: "Pedir Otra Figura",
    },
  },
  
  // Admin (NO traducir - se queda en inglés según regla 5)
  admin: {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    requests: "Requests",
    logout: "Logout",
    viewSite: "View Site",
    stats: {
      products: "Active Products",
      orders: "Total Orders",
      pendingOrders: "Pending Orders",
      requests: "Total Requests",
      pendingRequests: "Pending Review",
      revenue: "Confirmed Revenue",
    },
    lowStock: "Low Stock ({count})",
    pendingRequestsLabel: "Pending Requests ({count})",
    recentOrders: "Recent Orders",
    noProducts: "No products yet",
    noOrders: "No orders yet",
    noRequests: "No requests yet",
    actions: {
      newProduct: "New Product",
      viewAll: "View All",
      refresh: "Refresh",
    },
    orderStatus: {
      PENDING: "Pending Payment",
      CONFIRMED: "Confirmed - Buying in Japan",
      PURCHASING: "Buying in Japan",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      REFUNDED: "Refunded",
    },
    paymentStatus: {
      PAID: "Paid",
      UNPAID: "Unpaid",
      FAILED: "Failed",
    },
    requestStatus: {
      PENDING: "Pending",
      CONTACTED: "Contacted",
      PRODUCT_CREATED: "Product Created",
      REJECTED: "Rejected",
    },
  },
  
  // Footer
  footer: {
    copyright: "Tokyo Grid - Importación de figuras de anime desde Japón",
    disclaimer: "No afiliado a ninguna marca o retailer mencionado.",
  },
  
  // Common
  common: {
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    create: "Crear",
    update: "Actualizar",
    search: "Buscar",
    filter: "Filtros",
    clear: "Limpiar",
    back: "Volver",
    next: "Siguiente",
    previous: "Anterior",
    submit: "Enviar",
    confirm: "Confirmar",
    yes: "Sí",
    no: "No",
    close: "Cerrar",
    open: "Abrir",
    required: "*",
    optional: "(opcional)",
  },
  
  // Cart
  cart: {
    title: "Carrito ({count})",
    empty: "Tu carrito está vacío",
    emptyDesc: "Añade figuras del catálogo para reservarlas",
    continueShopping: "Seguir Comprando",
    subtotal: "Subtotal ({count} artículos)",
    shipping: "Envío",
    freeShipping: "Gratis",
    addForFree: "Añade {amount} para envío gratis",
    total: "Total",
    checkout: "Finalizar Compra ({total})",
    secureCheckout: "Pago Seguro con Stripe · Reserva Garantizada",
  },
  
  // Toast/Notifications
  toast: {
    addedToCart: "Añadido al carrito",
    orderSuccess: "Pedido realizado con éxito",
    orderError: "Error al hacer el pedido",
    requestSent: "¡Petición enviada! Te contactaremos si la encontramos",
    requestError: "Error al enviar la petición",
    loginSuccess: "Bienvenido de nuevo",
    loginError: "Credenciales inválidas",
    productCreated: "Producto creado",
    productUpdated: "Producto actualizado",
    productDeleted: "Producto eliminado",
    statusUpdated: "Estado actualizado",
  },
}

export type SiteConfig = typeof siteConfig