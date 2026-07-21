'use client';

import { useState, type FormEvent } from 'react';

type Props = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  submitHint: string;
  privacyNote: string;
  responseNote: string;
};

const MAX = 600;

export function ContactForm(props: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = `${message}\n\n— ${name}\n${email}`;
    const subject = encodeURIComponent(`Project note from ${name || 'a visitor'}`);
    window.location.href = `mailto:hello@hussien.dev?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form-note-row">
        <span className="contact-form-note-pulse" aria-hidden="true" />
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

      <label className="cf-field">
        <span className="cf-label">
          {props.messageLabel}
          <span className="cf-counter" aria-live="polite">{message.length} / {MAX}</span>
        </span>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
          placeholder={props.messagePlaceholder}
          rows={5}
          maxLength={MAX}
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
