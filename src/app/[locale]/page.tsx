import { Link } from '@/i18n/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/ContactForm';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const m = (await getMessages()) as Record<string, unknown>;
  const hero = m.hero as {
    available: string; roles: string[]; phrases: string[]; lead: string;
    ctaStart: string; ctaSee: string; location: string; yob: string; multilingual: string; scroll: string;
  };
  const marquee = m.marquee as string[];
  const about = m.about as { eyebrow: string; title: string; p1: string; p2: string; quote: string; facts: Array<{ k: string; v: string }> };
  const work = m.work as { eyebrow: string; title: string; subtitle: string; cards: Array<{ slug: string; no: string; title: string; desc?: string; art: string; tags: string[]; bgDark?: boolean }> };
  const tape = m.tape as { eyebrow: string; title: string; titleSerif: string; cta: string; cards: Array<{ no: string; title: string; pat: Record<string, string> }> };
  const caps = m.capabilities as { eyebrow: string; title: string; subtitle: string; items: Array<{ no: string; title: string; titleSerif: string; desc: string }> };
  const process = m.process as { eyebrow: string; title: string; subtitle: string; steps: Array<{ no: string; phase: string; duration: string; text: string }> };
  const stats = m.stats as { eyebrow: string; title: string; titleSerif: string; subtitle: string; items: Array<{ count: number; label: string; desc: string } | string>; lastLabel: string; lastDesc: string };
  const testimonials = m.testimonials as { eyebrow: string; items: Array<{ quote: string; name: string; role: string }> };
  const quote = m.quote as { eyebrow: string; text: string; who: string };
  const contact = m.contact as { eyebrow: string; headline: string[]; headlineSerif: string; headlineAcc: string; ctaStart: string; ctaReview: string; elsewhere: string; channels: string[] };
  const contactForm = m.contactForm as { eyebrow: string; nameLabel: string; namePlaceholder: string; emailLabel: string; emailPlaceholder: string; messageLabel: string; messagePlaceholder: string; submitLabel: string; submitHint: string };
  const avail = m.availability as { available: string; nextSlot: string; nextSlotValue: string };

  // hero head split-words (EN: "Frontend developer crafting interfaces that live and breathe.")
  const heroLines = locale === 'ar'
    ? [
        { cls: 'lt', text: 'مطوّر' },
        { cls: 'lt', text: 'واجهات' },
        { cls: 'lt serif', text: 'يصنع' },
        { cls: 'lt', text: 'تجارب' },
        { cls: 'lt', text: 'رقمية' },
        { cls: 'lt serif', text: 'حيّة' },
        { cls: 'lt', text: 'وتُحَسّ' },
        { cls: 'lt', text: 'بالتفاصيل.' },
      ]
    : [
        { cls: 'lt', text: 'Frontend' },
        { cls: 'lt', text: 'developer' },
        { cls: 'lt serif', text: 'crafting' },
        { cls: 'lt', text: 'interfaces' },
        { cls: 'lt', text: 'that' },
        { cls: 'lt serif', text: 'live' },
        { cls: 'lt', text: 'and' },
        { cls: 'lt', text: 'breathe.' },
      ];

  // Contact head (5 words)
  const contactWords = contact.headline as string[];
  const contactSerifIdx = contactWords.findIndex((w) => w === contact.headlineSerif);
  const contactAccIdx = contactWords.findIndex((w) => w === contact.headlineAcc);

  return (
    <>
      {/* HERO */}
      <section className="section hero" id="top">
        <div className="hero-orb" aria-hidden="true" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-meta">
              <div className="hero-meta-top">
                <span className="dot" />
                <span className="meta">{hero.available}</span>
              </div>
              <div className="avail">
                <span className="dot" aria-hidden="true" />
                <span className="label">{avail.available}</span>
                <span className="meta">{avail.nextSlot} — {avail.nextSlotValue}</span>
              </div>
              <h1>
                {heroLines.map((w, i) => (
                  <span key={i} className={`split-word ${w.cls}`} data-d={i}><span>{w.text}</span></span>
                ))}
              </h1>
              <div className="hero-roles">
                {(hero.roles as string[]).map((r: string, i: number) => (
                  <span key={r}>
                    {i > 0 && <span className="sep"> / </span>}
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <aside className="hero-side reveal" data-d="2">
              <div className="rotator" aria-live="polite">
                <div className="phrases" id="phrases">
                  {(hero.phrases as string[]).map((p: string, i: number) => (
                    <div key={i} className={`phrase${i === 0 ? ' is-on' : ''}`}>
                      <span><span>{p}</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="lead">{hero.lead}</p>
              <div className="hero-cta">
                <a href="#contact" className="btn btn-solid magnetic" data-cursor="hire">
                  {hero.ctaStart}<span className="arr">→</span>
                </a>
                <a href="#work" className="btn btn-ghost magnetic" data-cursor="see">{hero.ctaSee}</a>
              </div>
            </aside>
          </div>
          <div className="hero-bottom">
            <div className="meta">
              {hero.location}<br />
              <strong>{hero.yob}</strong> · {hero.multilingual}
            </div>
            <span className="scroll-hint"><span className="line" />{hero.scroll}</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {(marquee as string[]).map((m, i) => <span key={`a${i}`}>{m}</span>)}
          {(marquee as string[]).map((m, i) => <span key={`b${i}`}>{m}</span>)}
        </div>
      </div>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <div className="about">
            <aside className="about-side reveal">
              <p className="eyebrow">{about.eyebrow}</p>
              <h2>{about.title}</h2>
            </aside>
            <div className="about-body">
              <p className="about-p reveal">{about.p1}</p>
              <p className="about-p reveal" data-d="1">{about.p2}</p>
              <blockquote className="about-quote reveal" data-d="2">{about.quote}</blockquote>
              <div className="about-grid">
                {(about.facts as Array<{ k: string; v: string }>).map((f, i) => (
                  <div key={i} className="about-fact reveal" data-d={i < 2 ? 3 : 4}>
                    <span className="k">{f.k}</span>
                    <span className="v">{f.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO WORK */}
      <section className="section" id="work">
        <div className="container">
          <div className="work-head">
            <div>
              <p className="eyebrow">{work.eyebrow}</p>
              <h2>{work.title}</h2>
            </div>
            <p>{work.subtitle}</p>
          </div>

          <div className="bento">
            {(work.cards as Array<{
              slug: string; no: string; title: string; desc?: string; art: string;
              tags: string[]; bgDark?: boolean;
            }>).map((c, i) => {
              const variant = i === 0 ? 'b-feature' : i === 1 || i === 2 ? 'b-mid' : 'b-wide';
              const dark = c.bgDark ? ' bg-dark' : '';
              return (
                <Link
                  key={c.slug}
                  href={`/work/${c.slug}`}
                  className={`b-card ${variant}${dark} reveal magnetic`}
                  data-cursor="open"
                  data-d={(i % 4) + 1}
                >
                  <div className="b-head">
                    <span className="no">{c.no}</span>
                    <span className="arrow">→</span>
                  </div>
                  <h3>{c.title}</h3>
                  {c.desc && <p>{c.desc}</p>}
                  <div className="art">{c.art}</div>
                  <div className="tags">
                    {c.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TAPE */}
      <section className="tape-wrap" id="tape">
        <div className="tape-head container">
          <p className="eyebrow">{tape.eyebrow}</p>
          <h2>
            {tape.title}
            <span className="serif"> {tape.titleSerif}</span>
          </h2>
          <span className="tape-cta">{tape.cta}</span>
        </div>
        <div className="tape-pin" id="tapePin">
          <div className="tape-track" id="tapeTrack">
            {(tape.cards as Array<{ no: string; title: string; pat: Record<string, string> }>).map((tc, i) => (
              <article key={i} className="tape-card">
                <span className="num">{tc.no}</span>
                <h3>{tc.title}</h3>
                <p className="pat">
                  {Object.entries(tc.pat).map(([k, v], j) => (
                    <span key={k}>
                      {j > 0 && <span> · </span>}
                      <strong>{k}</strong> — {v}
                    </span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section" id="capabilities">
        <div className="container">
          <div className="caps-head">
            <div>
              <p className="eyebrow">{caps.eyebrow}</p>
              <h2>{caps.title}</h2>
            </div>
            <p>{caps.subtitle}</p>
          </div>
          <div className="caps">
            {(caps.items as Array<{ no: string; title: string; titleSerif: string; desc: string }>).map((c) => (
              <div key={c.no} className="cap reveal magnetic" data-cursor="read">
                <span className="no">{c.no}</span>
                <h3>
                  {c.title.replace(c.titleSerif, '')}
                  <span className="serif">{c.titleSerif}</span>
                </h3>
                <p>{c.desc}</p>
                <span className="ar">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="process">
        <div className="container">
          <div className="caps-head">
            <div>
              <p className="eyebrow">{process.eyebrow}</p>
              <h2>{process.title}</h2>
            </div>
            <p>{process.subtitle}</p>
          </div>
          <div className="process">
            {process.steps.map((s) => (
              <div key={s.no} className="process-step reveal">
                <span className="no">{s.no}</span>
                <div className="meta">
                  <h3>{s.phase}</h3>
                  <span className="duration">{s.duration}</span>
                </div>
                <p className="text">{s.text}</p>
                <span className="num" aria-hidden="true">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-wrap" id="stats">
        <div className="stats-head">
          <div>
            <p className="eyebrow">{stats.eyebrow}</p>
            <h2>
              {stats.title}
              <span className="serif"> {stats.titleSerif}</span>
            </h2>
          </div>
          <p style={{ color: 'var(--dark-muted)' }}>{stats.subtitle}</p>
        </div>
        <div className="stats-grid">
          {(stats.items as Array<{ count: number; label: string; desc: string } | string>).map((s, i) => {
            if (typeof s === 'string') {
              return (
                <div key={i} className="stat reveal" data-d={i + 1}>
                  <span className="n num">
                    <span className="acc">99</span>
                    <span style={{ color: 'var(--dark-muted)', fontSize: '0.4em' }}>/</span>
                    <span className="acc">100</span>
                  </span>
                  <span className="lbl">{stats.lastLabel}</span>
                  <span className="d">{stats.lastDesc}</span>
                </div>
              );
            }
            return (
              <div key={i} className="stat reveal" data-d={i + 1}>
                <span className="n num"><span className="acc num" data-count={s.count}>0</span></span>
                <span className="lbl">{s.label}</span>
                <span className="d">{s.desc}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS — paired marquee */}
      <section className="testimonials" id="testimonials">
        <div className="testimonials-head">
          <div>
            <p className="eyebrow">{testimonials.eyebrow}</p>
            <h2>
              {locale === 'ar' ? 'أربع قطع' : 'Four pieces of'}
              <span className="serif"> {locale === 'ar' ? 'دليل.' : 'proof.'}</span>
            </h2>
          </div>
        </div>
        <div className="testimonials-track-wrap">
          <div className="testimonials-track">
            {testimonials.items.concat(testimonials.items).map((t, i) => (
              <article key={i} className="testimonial-card">
                <blockquote>“{t.quote}”</blockquote>
                <div className="who">
                  <span className="name">{t.name}</span>
                  <span className="role">{t.role}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="testimonials-track reverse">
            {testimonials.items.slice().reverse().concat(testimonials.items.slice().reverse()).map((t, i) => (
              <article key={i} className="testimonial-card">
                <blockquote>“{t.quote}”</blockquote>
                <div className="who">
                  <span className="name">{t.name}</span>
                  <span className="role">{t.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="section quote">
        <div className="container">
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{quote.eyebrow}</p>
          <mark className="reveal">{quote.text}</mark>
          <span className="who">— {quote.who}</span>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div className="container">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2>
            {contactWords.map((w: string, i: number) => {
              let cls = 'lt';
              if (i === contactSerifIdx) cls += ' serif';
              if (i === contactAccIdx) cls += ' acc';
              return (
                <span key={i} className={`split-word ${cls}`} data-d={i}><span>{w}</span></span>
              );
            })}
          </h2>
          <div className="contact-cta">
            <a href="mailto:hello@hussien.dev" className="btn btn-solid magnetic" data-cursor="mail">
              {contact.ctaStart}<span className="arr">→</span>
            </a>
            <a href="#work" className="btn btn-ghost magnetic" data-cursor="see">{contact.ctaReview}</a>
          </div>
          <div className="contact-channels">
            <span>{contact.elsewhere}</span>
            <a href="https://github.com/flavasava2022" target="_blank" rel="noopener" data-cursor="open">{(contact.channels as string[])[0]}</a>
            <a href="#" data-cursor="ln">{(contact.channels as string[])[1]}</a>
            <a href="#" data-cursor="cv">{(contact.channels as string[])[2]}</a>
            <a href="mailto:hello@hussien.dev" data-cursor="mail">{(contact.channels as string[])[3]}</a>
          </div>
          <ContactForm
            eyebrow={contactForm.eyebrow}
            nameLabel={contactForm.nameLabel}
            namePlaceholder={contactForm.namePlaceholder}
            emailLabel={contactForm.emailLabel}
            emailPlaceholder={contactForm.emailPlaceholder}
            messageLabel={contactForm.messageLabel}
            messagePlaceholder={contactForm.messagePlaceholder}
            submitLabel={contactForm.submitLabel}
            submitHint={contactForm.submitHint}
          />
        </div>
      </section>
    </>
  );
}
