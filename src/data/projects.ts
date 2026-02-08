export interface Project {
  id: string;
  title: string;
  summary: string;
  longDescription: string;
  impact: string[];
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'pixel-frame',
    title: 'Pixel Frame',
    summary:
      'A 64x64 LED matrix in a picture frame, controlled in real-time from a web app over WebSockets.',
    longDescription:
      'Pixel Frame combines hardware and software into a collaborative art display. Users draw from a browser interface and see updates streamed to a microcontroller-driven LED matrix. The system is designed for low-latency updates and shared interaction, making it great for live demos and social spaces.',
    impact: [
      'Built a real-time drawing pipeline from browser to physical hardware',
      'Enabled collaborative interaction with WebSocket-powered updates',
      'Packaged as an approachable hardware + web showcase project'
    ],
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
    technologies: ['JavaScript', 'WebSockets', 'Microcontroller', 'Realtime UI'],
    githubUrl: 'https://github.com/ethank64/pixel-frame',
    featured: true
  },
  {
    id: 'safety-screamer',
    title: 'Safety Screamer',
    summary:
      'A mobile app that discourages distracted driving by reacting when users leave the app during a drive.',
    longDescription:
      'Safety Screamer promotes safer driving habits by keeping users focused. If the user navigates away while driving, the app plays guilt-style reminder messages to nudge attention back to the road. The core design goal is behavior reinforcement through immediate feedback.',
    impact: [
      'Designed around a clear safety behavior goal',
      'Implemented app-state-triggered feedback to reduce phone distraction',
      'Shipped as a unique, memorable mobile concept project'
    ],
    image:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=800&fit=crop',
    technologies: ['Mobile App', 'UX', 'Behavior Design', 'Safety Tech'],
    githubUrl: 'https://github.com/ethank64/safety-screamer',
    featured: true
  }
];
