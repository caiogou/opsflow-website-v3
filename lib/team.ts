// Team members shown in the "Team" section. A member is rendered only when `photo` and `bio` are filled
// (no placeholder people on the live site). Photos go in /public/team/.
export type Member = {
  name: string
  role: { en: string; fr: string; de: string }
  bio: { en: string; fr: string; de: string }
  photo: string        // e.g. '/team/behrad.jpg'
  linkedin?: string
}

export const TEAM: Member[] = [
  // Behrad — pending: photo, full name, role, bio and LinkedIn URL (requested 23/set/2026)
]
