import { useState } from 'react';
import styled from 'styled-components';
import { Button, GroupBox, TextInput, Anchor, Frame, Hourglass } from 'react95';
import { contact } from '../../data/contact';

const FORMSUBMIT_ENDPOINT =
  'https://formsubmit.co/ajax/744d9f63dac2f014cc67ac4df691e118';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 10px;
  flex: 1;
  min-height: 0;
`;

const Sidebar = styled(Frame).attrs({ variant: 'well' })`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
  background: #fff;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  border-bottom: 1px solid #808080;
  padding-bottom: 2px;
  margin-bottom: 4px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  font-family: var(--font-content);
  font-size: 13px;
`;

const Label = styled.span`
  color: #555;
  font-family: var(--font-content);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Toast = styled.div<{ $variant: 'success' | 'error' }>`
  margin-top: 6px;
  background: ${({ $variant }) => ($variant === 'error' ? '#ffe1e1' : '#ffffe1')};
  border: 1px solid #808080;
  padding: 8px 10px;
  font-family: var(--font-content);
  font-size: 13px;
  line-height: 1.5;
`;

const Honeypot = styled.input`
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

const SendButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SendStatus =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

const empty: FormState = { name: '', email: '', subject: '', message: '' };

export function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [honey, setHoney] = useState('');
  const [status, setStatus] = useState<SendStatus>({ kind: 'idle' });

  const update = (field: keyof FormState) => (e: { target: { value: string } }) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.kind === 'sending') return;

    if (honey.trim() !== '') {
      setStatus({ kind: 'success' });
      setForm(empty);
      return;
    }

    setStatus({ kind: 'sending' });

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          _replyto: form.email,
          _subject: form.subject || `Portfolio contact from ${form.name}`,
          message: form.message,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = (await res.json().catch(() => ({}))) as { success?: string };
      if (data.success === 'false') {
        throw new Error('Submission rejected by server.');
      }

      setStatus({ kind: 'success' });
      setForm(empty);
    } catch (err) {
      setStatus({
        kind: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Could not send message.',
      });
    }
  };

  const sending = status.kind === 'sending';

  return (
    <Layout>
      <Sidebar>
        <div>
          <SectionTitle>Contact</SectionTitle>
          {contact.methods.map(m => (
            <Row key={m.label}>
              <Label>{m.label}</Label>
              {m.href ? (
                <Anchor href={m.href}>{m.value}</Anchor>
              ) : (
                <span>{m.value}</span>
              )}
            </Row>
          ))}
        </div>
        <div>
          <SectionTitle>Around the Web</SectionTitle>
          {contact.socials.map(s => (
            <Row key={s.label}>
              <Label>{s.label}</Label>
              <Anchor href={s.href} target="_blank" rel="noopener noreferrer">
                {s.value}
              </Anchor>
            </Row>
          ))}
        </div>
      </Sidebar>

      <GroupBox label="New Message">
        <Form onSubmit={handleSend}>
          <FormRow>
            <Label>To</Label>
            <TextInput value={contact.email} disabled fullWidth />
          </FormRow>
          <FormRow>
            <Label>From</Label>
            <TextInput
              value={form.name}
              onChange={update('name')}
              placeholder="Your name"
              required
              fullWidth
              disabled={sending}
            />
          </FormRow>
          <FormRow>
            <Label>Reply-To</Label>
            <TextInput
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              required
              fullWidth
              disabled={sending}
            />
          </FormRow>
          <FormRow>
            <Label>Subject</Label>
            <TextInput
              value={form.subject}
              onChange={update('subject')}
              required
              fullWidth
              disabled={sending}
            />
          </FormRow>
          <FormRow style={{ flex: 1, minHeight: 80 }}>
            <Label>Message</Label>
            <TextInput
              multiline
              rows={5}
              value={form.message}
              onChange={update('message')}
              required
              fullWidth
              disabled={sending}
            />
          </FormRow>

          <Honeypot
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={honey}
            onChange={e => setHoney(e.target.value)}
            aria-hidden="true"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <Button
              type="button"
              onClick={() => {
                setForm(empty);
                setStatus({ kind: 'idle' });
              }}
              disabled={sending}
            >
              Clear
            </Button>
            <Button type="submit" primary disabled={sending}>
              <SendButtonContent>
                {sending && <Hourglass size={16} />}
                {sending ? 'Sending...' : 'Send'}
              </SendButtonContent>
            </Button>
          </div>

          {status.kind === 'success' && (
            <Toast $variant="success">
              Message sent. Thanks -- I'll get back to you soon.
            </Toast>
          )}
          {status.kind === 'error' && (
            <Toast $variant="error">
              Couldn't deliver the message ({status.message}). You can email me
              directly at{' '}
              <Anchor href={`mailto:${contact.email}`}>{contact.email}</Anchor>.
            </Toast>
          )}
        </Form>
      </GroupBox>
    </Layout>
  );
}
