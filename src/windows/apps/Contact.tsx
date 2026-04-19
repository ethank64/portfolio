import { useState } from 'react';
import styled from 'styled-components';
import { Button, GroupBox, TextInput, Anchor, Frame } from 'react95';
import { contact } from '../../data/contact';

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
  margin-bottom: 6px;
  font-size: 12px;
`;

const Label = styled.span`
  color: #555;
  font-size: 11px;
  text-transform: uppercase;
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

const Toast = styled.div`
  margin-top: 6px;
  background: #ffffe1;
  border: 1px solid #808080;
  padding: 6px 10px;
  font-size: 12px;
`;

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const empty: FormState = { name: '', email: '', subject: '', message: '' };

export function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [sent, setSent] = useState(false);

  const update = (field: keyof FormState) => (e: { target: { value: string } }) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm(empty);
    window.setTimeout(() => setSent(false), 6000);
  };

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
            />
          </FormRow>
          <FormRow>
            <Label>Subject</Label>
            <TextInput
              value={form.subject}
              onChange={update('subject')}
              required
              fullWidth
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
            />
          </FormRow>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <Button type="button" onClick={() => setForm(empty)}>
              Clear
            </Button>
            <Button type="submit" primary>
              Send
            </Button>
          </div>
          {sent && (
            <Toast>
              Mail saved to Outbox. (Just kidding -- please email{' '}
              <Anchor href={`mailto:${contact.email}`}>{contact.email}</Anchor>{' '}
              directly.)
            </Toast>
          )}
        </Form>
      </GroupBox>
    </Layout>
  );
}
