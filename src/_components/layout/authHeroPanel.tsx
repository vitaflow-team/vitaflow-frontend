import Image from 'next/image';

interface AuthHeroPanelProps {
  caption: string;
}

/** Brand-tinted photo shown beside the sign-in and sign-up forms on large screens. */
export function AuthHeroPanel({ caption }: AuthHeroPanelProps) {
  return (
    <div className="relative w-full h-full hidden lg:block">
      <Image
        src="/signin.png"
        alt="Itens de treino e acompanhamento nutricional: kettlebell, tênis, fita métrica, caderno, estetoscópio e calculadora"
        fill
        className="object-cover grayscale contrast-125"
      />
      {/* Duotone in the brand colors: the original photo is purple, outside the
          palette; mix-blend-color swaps its hue for the gradient while keeping
          the photo's luminosity (which is why the image above is grayscale). */}
      <div
        className="absolute inset-0 mix-blend-color"
        style={{
          backgroundImage:
            'linear-gradient(160deg, hsl(49 14% 20%) 0%, hsl(43 30% 45%) 55%, hsl(48 45% 68%) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/15 to-transparent" />
      <p className="absolute bottom-6 left-6 right-6 text-secondary text-lg font-semibold italic">
        {caption}
      </p>
    </div>
  );
}
