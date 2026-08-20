import { CONTACT } from '../config'

// Build a WhatsApp click-to-chat link with a prefilled message.
export function waLink(message, number = CONTACT.whatsappPrimary) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
