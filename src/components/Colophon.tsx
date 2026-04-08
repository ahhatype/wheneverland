export default function Colophon() {
  return (
    <footer className="text-xs font-bold text-foreground leading-tight">
      <h3
        className="uppercase fancy font-medium tracking-[0.2em] mb-4"
      >
        Colophon
      </h3>
      <p className="mb-3">
        Headings and display type set in{" "}
        <a
          href="https://velvetyne.fr/fonts/compagnon/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-accent"
        >
          Compagnon
        </a>
        , designed by Juliette Duh&eacute;, L&eacute;a Pradine, Valentin Papon,
        Chlo&eacute; Lozano &amp; S&eacute;bastien Riollier at EESAB-Rennes,
        Typography Creation Studio, Master Graphic Design, 2018.
      </p>
      <p className="mb-3">
        Light &amp; Roman by Duh&eacute; &amp; Pradine. Italic by Papon.
        Medium by Riollier. Script by Lozano Yegge.
      </p>
      <p className="mb-3">
        Published by{" "}
        <a
          href="https://velvetyne.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-accent"
        >
          Velvetyne
        </a>
        , a libre font foundry. Made in France, made in Brittany.
      </p>
      <p className="text-black">
        Licensed under the{" "}
        <a
          href="https://openfontlicense.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          SIL Open Font License, Version 1.1
        </a>
        . Body text set in Source Sans 3.
      </p>
    </footer>
  );
}
