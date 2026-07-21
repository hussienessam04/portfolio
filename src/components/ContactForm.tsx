'use client';

import { useState, type FormEvent } from 'react';

type Option = { value: string; label: string };

type Props = {
  eyebrow: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  typeLabel: string;
  typeOptions: Option[];
  scopeLabel: string;
  scopeOptions: Option[];
  timelineLabel: string;
  timelineOptions: Option[];
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  submitHint: string;
  privacyNote: string;
  responseNote: string;
};

export function ContactForm(props: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<string>(props.typeOptions[0]?.value ?? '');
  const [scope, setScope] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string>(props.timelineOptions[0]?.value ?? '');
  const [message, setMessage] = useState('');

  const toggleScope = (value: string) => {
    setScope((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const scopeLabel = scope
      .map((v) => props.scopeOptions.find((o) => o.value === v)?.label)
      .filter(Boolean)
      .join(', ');
    const typeLabel = props.typeOptions.find((o) => o.value === type)?.label ?? type;
    const timelineLabel = props.timelineOptions.find((o) => o.value === timeline)?.label ?? timeline;

    const body = [
      message,
      '',
      `— ${name} · ${email}`,
      '',
      `Type: ${typeLabel}`,
      scope.length ? `Scope: ${scopeLabel}` : null,
      `Timeline: ${timelineLabel}`,
    ]
      .filter(Boolean)
      .join('\n');

    const subject = encodeURIComponent(`Project note from ${name || 'a visitor'}`);
    window.location.href = `mailto:hello@hussien.dev?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form-head">
        <p className="eyebrow">{props.eyebrow}</p>
        <p className="contact-form-note">{props.responseNote}</p>
      </div>

      <div className="contact-form-row">
        <label className="cf-field">
          <span className="cf-label">{props.nameLabel}</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={props.namePlaceholder}
            autoComplete="name"
            required
          />
        </label>
        <label className="cf-field">
          <span className="cf-label">{props.emailLabel}</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={props.emailPlaceholder}
            autoComplete="email"
            required
          />
        </label>
      </div>

      <fieldset className="cf-field">
        <legend className="cf-label">{props.typeLabel}</legend>
        <div className="cf-chips">
          {props.typeOptions.map((o) => (
            <label key={o.value} className={`cf-chip${type === o.value ? ' is-on' : ''}`}>
              <input
                type="radio"
                name="type"
                value={o.value}
                checked={type === o.value}
                onChange={() => setType(o.value)}
                required
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="cf-field">
        <legend className="cf-label">{props.scopeLabel}</legend>
        <div className="cf-chips">
          {props.scopeOptions.map((o) => (
            <label key={o.value} className={`cf-chip${scope.includes(o.value) ? ' is-on' : ''}`}>
              <input
                type="checkbox"
                value={o.value}
                checked={scope.includes(o.value)}
                onChange={() => toggleScope(o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="cf-field">
        <legend className="cf-label">{props.timelineLabel}</legend>
        <div className="cf-chips">
          {props.timelineOptions.map((o) => (
            <label key={o.value} className={`cf-chip${timeline === o.value ? ' is-on' : ''}`}>
              <input
                type="radio"
                name="timeline"
                value={o.value}
                checked={timeline === o.value}
                onChange={() => setTimeline(o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="cf-field">
        <span className="cf-label">
          {props.messageLabel}
          <span className="cf-counter">{message.length} / 600</span>
        </span>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 600))}
          placeholder={props.messagePlaceholder}
          rows={5}
          maxLength={600}
          required
        />
      </label>

      <div className="contact-form-footer">
        <button type="submit" className="btn btn-solid magnetic" data-cursor="mail">
          {props.submitLabel}<span className="arr">→</span>
        </button>
        <p className="contact-form-privacy">{props.privacyNote}</p>
      </div>
      <p className="contact-form-subhint">{props.submitHint}</p>
    </form>
  );
}
