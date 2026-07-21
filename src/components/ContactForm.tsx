'use client';

import { useState, type FormEvent } from 'react';

type Props = {
  eyebrow: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  submitHint: string;
};

export function ContactForm(props: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project note from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:hello@hussien.dev?subject=${subject}&body=${body}`;
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <p className="eyebrow">{props.eyebrow}</p>
      <div className="row">
        <label>
          {props.nameLabel}
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
        <label>
          {props.emailLabel}
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
      <label>
        {props.messageLabel}
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={props.messagePlaceholder}
          required
        />
      </label>
      <div className="submit-row">
        <button type="submit" className="btn btn-solid magnetic" data-cursor="mail">
          {props.submitLabel}<span className="arr">→</span>
        </button>
        <span className="submit-hint">{props.submitHint}</span>
      </div>
    </form>
  );
}
