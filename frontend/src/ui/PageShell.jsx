import { Container } from "./Container.jsx";
import { Badge } from "./Badge.jsx";

export function PageShell({ eyebrow, title, subtitle, children }) {
  return (
    <div>
      <section className="py-12 md:py-16">
        <Container>
          <Badge className="bg-gradient-to-r from-white/10 to-white/0">{eyebrow}</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-900/60 md:text-base">{subtitle}</p> : null}
        </Container>
      </section>
      <section className="pb-16">
        <Container>{children}</Container>
      </section>
    </div>
  );
}


