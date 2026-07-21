import { getMessages } from 'next-intl/server';

export async function Footer() {
  const m = (await getMessages()) as Record<string, unknown>;
  const ft = m.footer as { location: string; backToTop: string; settings: string };

  return (
    <footer className="container pagefoot" data-od-id="footer">
      <span>
        © <span id="year">2026</span> Hussien Essam · {ft.location}
      </span>
      <span className="ctrls">
        <a href="#top" data-cursor="top">{ft.backToTop}</a>
        <a href="#contact" data-cursor="set">{ft.settings}</a>
      </span>
    </footer>
  );
}
