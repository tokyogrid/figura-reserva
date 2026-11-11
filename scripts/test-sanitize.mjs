import DOMPurify from "dompurify"

const testDesc = "\"Ichiban KUJI ONE PIECE ROAD TO DAWN - road to dawn - A journey to adventure -\" Este es el premio.\nLa escena de la primera aparici\u00f3n de Luffy y Garp en el d\u00eda de la infancia es tridimensional. Preste atenci\u00f3n a la creaci\u00f3n de la expresi\u00f3n de Luffy y Garp que recuerda a la escena."

try {
  const result = DOMPurify(testDesc, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  })
  console.log("result type:", typeof result)
  console.log("result:", result)
  console.log("result constructor:", result?.constructor?.name)
} catch (e) {
  console.log("ERROR:", e.message, e.stack)
}