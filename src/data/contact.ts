export interface ContactMethod {
  label: string;
  value: string;
  href?: string;
}

export const contact: {
  email: string;
  phone: string;
  location: string;
  methods: ContactMethod[];
  socials: ContactMethod[];
} = {
  email: 'eknotts64@gmail.com',
  phone: '+1 (740) 440-5428',
  location: 'Columbus, OH',
  methods: [
    { label: 'Email', value: 'eknotts64@gmail.com', href: 'mailto:eknotts64@gmail.com' },
    { label: 'Phone', value: '+1 (740) 440-5428', href: 'tel:+17404405428' },
    { label: 'Location', value: 'Columbus, OH' },
  ],
  socials: [
    { label: 'GitHub', value: 'github.com/ethank64', href: 'https://github.com/ethank64' },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/ethan-knotts-4b349a2b6',
      href: 'https://www.linkedin.com/in/ethan-knotts-4b349a2b6/',
    },
  ],
};
