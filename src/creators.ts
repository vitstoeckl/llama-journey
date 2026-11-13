export interface Creator {
  name: string;
  /** Full profile address. Until it is filled in, the icon shows faded and does nothing. */
  instagram?: string;
  linkedin?: string;
  /** Written as https://wa.me/ and the number in international form, with no + or spaces. */
  whatsapp?: string;
  /** A file name in public/creators/. Until it is filled in, the person's initials show. */
  photo?: string;
}

// Vít gave his LinkedIn and WhatsApp on 2026-11-06. Still to come: Vít's Instagram and photo, and the
// others' profile links and photos.
export const CREATORS: Creator[] = [
  {
    name: 'Vít Stöckl',
    linkedin: 'https://www.linkedin.com/in/vitstock/',
    whatsapp: 'https://wa.me/420774654154',
  },
  { name: 'Noah Berko', linkedin: 'https://www.linkedin.com/in/noah-berko-1951a7437/' },
  { name: 'Haru Toida', whatsapp: 'https://wa.me/817012692578' },
  // The class's professor.
  { name: 'Paulo Augusto Arteaga Uribe', linkedin: 'https://www.linkedin.com/in/pauloarteagauribe/' },
];
