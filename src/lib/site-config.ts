// Tokyo Grid - Site Configuration
// Edit this file to change all text content across the site

export const siteConfig = {
  name: "Tokyo Grid",
  tagline: "Anime figures from Japan, reserved for you",
  description: "Reserve anime figures directly from Japan. We buy from Japanese suppliers and ship to your door. No markup, no risk.",
  url: "https://tokyogrid.com",
  
  // Navigation
  nav: {
    catalog: "Catalog",
    request: "Request Figure",
    howItWorks: "How It Works",
    vinted: "Our Vinted",
  },
  
  // Hero section
  hero: {
    badge: "New: Reserve anime figures from Japan risk-free",
    title: "Your anime figures without leaving home",
    subtitle: "You choose, we buy in Japan, you receive. No surprises.",
    ctaPrimary: "Browse Catalog",
    ctaSecondary: "Request Figure",
  },
  
  // Features
  features: [
    {
      icon: "Banknote",
      title: "Japan Prices",
      description: "We buy directly from Japanese suppliers. No middlemen, save up to 40%.",
    },
    {
      icon: "Shield",
      title: "Secure Reservation",
      description: "Pay when you reserve via Stripe. If we can't get the figure, full refund.",
    },
    {
      icon: "Truck",
      title: "Shipped to Your Door",
      description: "We receive in Spain, inspect, and ship via certified mail (€4.99, free over €100).",
    },
    {
      icon: "Package",
      title: "Also on Vinted",
      description: "Prefer Vinted? We list the figure on your account and handle the sale for you.",
    },
  ],
  
  // How it works steps
  howItWorks: {
    title: "How It Works",
    subtitle: "Choose any figure, pick your purchase method, we handle the rest",
    steps: [
      {
        number: 1,
        icon: "Search",
        title: "Choose Your Figure",
        description: "Browse our catalog of anime figures available from Japan, or request any figure not listed. We'll search our suppliers in Akihabara, Nakano, and online stores.",
        details: [
          "Real-time stock from Japan suppliers",
          "Request figures not in catalog",
          "Prices in EUR, no currency conversion needed",
          "See photos, specs, and availability before deciding",
        ],
      },
      {
        number: 2,
        icon: "CreditCard",
        title: "Reserve & Choose Purchase Method",
        description: "Reserve your figure by paying a deposit via Stripe (card, Apple Pay, Google Pay). Then choose how you want to receive it:",
        details: [
          "100% secure payment with Stripe (PCI DSS)",
          "Auto-refund if we can't get the figure",
          "Instant email confirmation with order details",
        ],
      },
      {
        number: 3,
        icon: "Package",
        title: "Option A — Buy Direct (We Ship to You)",
        description: "We buy the figure in Japan, receive it at our Spain warehouse, inspect it thoroughly, and ship it to your door via certified mail with tracking and insurance (€4.99, free over €100).",
        details: [
          "We buy from Japanese retailers and online stores",
          "Inspection: box, figure, accessories, authenticity holograms",
          "Photos of actual figure sent before shipping",
          "Certified mail with tracking, insurance up to €500",
          "14-day returns if not satisfied",
          "Delivery in 24-48h (mainland Spain) after we ship",
        ],
      },
      {
        number: 4,
        icon: "Package",
        title: "Option B — Reserve for Vinted Purchase",
        description: "Prefer to buy on Vinted? We list the figure on our Tokyo Grid Vinted account at the agreed price. You pay a small reservation fee on our site (deducted from the Vinted price). When listed, you get notified by email with a direct link to purchase on Vinted.",
        details: [
          "Reservation fee paid on our site (€5-€15 depending on figure)",
          "Fee is deducted from the final Vinted purchase price",
          "We list on our verified Tokyo Grid Vinted account",
          "You receive email with direct link to the Vinted listing",
          "Complete purchase on Vinted (protected by Vinted buyer protection)",
          "We handle shipping from our Spain address to you",
          "Same inspection & photos as Option A",
        ],
      },
      {
        number: 5,
        icon: "Truck",
        title: "Receive Your Figure",
        description: "Whether you chose Option A or B, the figure ships from our Spain address. You get certified mail with tracking, insurance, and the same quality inspection. Enjoy your authentic Japan figure!",
        details: [
          "Certified mail with tracking & insurance",
          "Delivery in 24-48h (mainland Spain)",
          "14-day returns if not satisfied",
          "Authenticity guaranteed: original box, holograms, accessories",
          "Email support for any questions",
        ],
      },
    ],
  },
  
  // Comparison table
  comparison: {
    title: "Why Not Buy Direct on Vinted/Wallapop?",
    subtitle: "Key differences between resale and direct reservation",
    headers: ["Aspect", "Vinted / Wallapop", "Tokyo Grid"],
    rows: [
      ["Price", "+50-200% over Japan price", "Japan price + small margin"],
      ["Authenticity", "Risk of bootlegs/fakes", "100% original, official stores"],
      ["Condition", "Photos sometimes misleading", "We send real photos before shipping"],
      ["Guarantee", "None (private sale)", "14-day returns + shipping insurance"],
      ["Availability", "Only what's already in Spain", "Access to full Japan catalog"],
      ["Exclusives", "Impossible to get", "Can source event/store exclusives"],
    ],
  },
  
  // FAQ
  faq: [
    {
      q: "Is it safe to pay upfront?",
      a: "Yes. We use Stripe (same as Shopify, Amazon). Your money is held until we confirm purchase. If we can't get the figure, Stripe auto-refunds to your card in 5-10 business days.",
    },
    {
      q: "How long until the figure arrives?",
      a: "Depends on Japan availability. Usually 2-3 weeks from payment: 1-2 weeks to buy and receive in Spain + 1 week to ship to you. We notify at every step.",
    },
    {
      q: "What if the figure arrives damaged or wrong?",
      a: "14-day returns (return shipping on us if our error). We inspect before shipping and send photos. If damaged in transit, mail insurance covers up to €500.",
    },
    {
      q: "Can I request figures not in catalog?",
      a: "Absolutely! Use the 'Request Figure' form. We search our suppliers and if found, notify you with price and photos. You get priority to reserve before it goes to catalog.",
    },
    {
      q: "How does Vinted work? Do you sell for me?",
      a: "If you ask, we list the figure on Vinted under your account with your photos/description. We handle messages, offers, and shipping. You get paid directly to your Vinted account. We take a small management fee (3-5%).",
    },
    {
      q: "Are figures 100% authentic?",
      a: "Yes. We only buy from official Japanese stores and retailers. Never from shady second-hand markets. Every figure comes with original box, authenticity holograms, and complete accessories.",
    },
  ],
  
  // Catalog
  catalog: {
    title: "Figure Catalog",
    subtitle: "Find your perfect figure and reserve at Japan prices",
    searchPlaceholder: "Search by name, character, series...",
    categoryPlaceholder: "Category",
    seriesPlaceholder: "Series / Anime",
    inStockOnly: "In stock only",
    sortOptions: [
      { value: "featured", label: "Featured" },
      { value: "price-asc", label: "Price: Low to High" },
      { value: "price-desc", label: "Price: High to Low" },
      { value: "newest", label: "Newest" },
      { value: "name", label: "A-Z" },
    ],
    noResults: "No figures found",
    noResultsDesc: "Try changing filters or search for something else",
    clearFilters: "Clear filters",
    loading: "Loading...",
  },
  
  // Product detail
  product: {
    addToCart: "Reserve Now",
    buyNow: "Buy Now",
    outOfStock: "Out of Stock",
    lowStock: "Low Stock - {count} left",
    preOrder: "Pre-Order (10-15 days)",
    quantity: "Quantity",
    maxAvailable: "Max {max} unit(s) available",
    shippingInfo: "Shipping €4.99 (free over €100)",
    securePayment: "Secure Stripe Payment",
    returns: "14-Day Returns",
    authentic: "Authentic",
    authenticDesc: "Bought from official JP stores",
    secure: "Secure",
    secureDesc: "Refund if we can't get it",
    fast: "Fast",
    fastDesc: "Shipped 24-48h after receipt",
  },
  
  // Checkout
  checkout: {
    title: "Checkout",
    emptyCart: "Cart is empty",
    emptyCartDesc: "Add figures to cart to proceed",
    browseCatalog: "Browse Catalog",
    shippingInfo: "Shipping Information",
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    postalCode: "Postal Code",
    country: "Country",
    notes: "Notes (optional)",
    notesPlaceholder: "Delivery instructions, mailbox, etc.",
    continueToPayment: "Continue to Secure Payment",
    orderSummary: "Order Summary",
    items: "item(s)",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    addForFreeShipping: "Add {amount} for free shipping",
    total: "Total",
    paymentMethods: "Card payment (Visa, Mastercard, Amex)",
    secure: "100% secure - We don't store your card details",
    confirmation: "You'll receive confirmation by email",
    purchaseOptions: {
      title: "How would you like to receive your figure?",
      direct: {
        label: "Ship to My Address",
        description: "We auto-fill your saved address from your account",
      },
      vinted: {
        label: "Other Address",
        description: "Enter a different shipping address manually",
      },
    },
  },
  
  // Checkout success
  checkoutSuccess: {
    title: "Order Confirmed!",
    subtitle: "Hi {name}, your order <strong>#{id}</strong> is confirmed.",
    emailSent: "Confirmation sent to {email}",
    nextStep: "Next: Buying in Japan (1-2 weeks)",
    shippingEstimate: "Estimated shipping: 2-3 weeks total",
    whatHappensNext: "What happens now?",
    steps: [
      "We buy your figures from Japanese suppliers at best price",
      "We receive in Spain, inspect, and prepare for shipping",
      "We ship via certified mail with tracking (or list on Vinted if you chose that)",
      "You receive your package and enjoy your figures!",
    ],
    continueShopping: "Continue Shopping",
    viewOrder: "View My Order",
  },
  
  // Request figure
  request: {
    title: "Can't Find Your Figure?",
    subtitle: "Tell us what you're looking for and we'll search our Japanese suppliers. If found, you get priority to reserve.",
    yourInfo: "Your Information",
    name: "Name",
    email: "Email",
    figureDetails: "Figure Details",
    series: "Series / Anime",
    seriesPlaceholder: "e.g., Spy × Family, One Piece, Evangelion...",
    character: "Character",
    characterPlaceholder: "e.g., Anya Forger, Monkey D. Luffy, Asuka Langley...",
    manufacturer: "Manufacturer",
    manufacturerPlaceholder: "Bandai, Good Smile, Kotobukiya...",
    scale: "Scale",
    scalePlaceholder: "1/7, 1/8, 1/6, Nendoroid...",
    budgetMax: "Max Budget (€)",
    budgetPlaceholder: "e.g., 150",
    notes: "Additional Notes",
    notesPlaceholder: "Specific version, exclusive, condition (new/used), reference links...",
    submit: "Submit Request",
    noCommitment: "No purchase commitment. We'll contact you if we find it and you decide whether to reserve.",
    benefits: [
      { icon: "Banknote", title: "Japan Prices", desc: "We search at best price from Japanese suppliers" },
      { icon: "Sparkles", title: "Priority Access", desc: "If found, you choose first whether to reserve" },
      { icon: "MessageSquare", title: "No Commitment", desc: "Only reserve if you like the final price" },
    ],
    success: {
      title: "Request Sent!",
      desc: "We received your request. We'll review and email you at <strong>{email}</strong> if we can find the figure.",
      browseCatalog: "Browse Current Catalog",
      requestAnother: "Request Another Figure",
    },
  },
  
  // Admin
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
    copyright: "Tokyo Grid - Anime figure imports from Japan",
    disclaimer: "Not affiliated with any mentioned brands or retailers.",
  },
  
  // Common
  common: {
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    create: "Create",
    update: "Update",
    search: "Search",
    filter: "Filters",
    clear: "Clear",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    close: "Close",
    open: "Open",
    required: "*",
    optional: "(optional)",
  },
  
  // Cart
  cart: {
    title: "Cart ({count})",
    empty: "Your cart is empty",
    emptyDesc: "Add figures from catalog to reserve them",
    continueShopping: "Continue Shopping",
    subtotal: "Subtotal ({count} items)",
    shipping: "Shipping",
    freeShipping: "Free",
    addForFree: "Add {amount} for free shipping",
    total: "Total",
    checkout: "Checkout ({total})",
    secureCheckout: "Secure Stripe Checkout · Guaranteed Reservation",
  },
  
  // Toast/Notifications
  toast: {
    addedToCart: "Added to cart",
    orderSuccess: "Order placed successfully",
    orderError: "Error placing order",
    requestSent: "Request sent! We'll contact you if found",
    requestError: "Error sending request",
    loginSuccess: "Welcome back",
    loginError: "Invalid credentials",
    productCreated: "Product created",
    productUpdated: "Product updated",
    productDeleted: "Product deleted",
    statusUpdated: "Status updated",
  },
}

export type SiteConfig = typeof siteConfig