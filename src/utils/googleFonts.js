import { Poppins, Source_Sans_3 } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
export const primaryFont = Source_Sans_3({
    weight: ['400', '600', '700', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
})
export const secondaryFont = Poppins({
    weight: ['400', '700', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
})
