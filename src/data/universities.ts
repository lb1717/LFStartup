export interface University {
  id: string;
  name: string;
  logo: string;
}

export const universities: University[] = [
  {
    id: 'harvard',
    name: 'Harvard University',
    logo: '/images/harvard-logo.png',
  },
  {
    id: 'columbia',
    name: 'Columbia University',
    logo: '/images/columbia-logo.png',
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    logo: '/images/stanford-logo.png',
  },
  {
    id: 'mit',
    name: 'MIT',
    logo: '/images/mit-logo.png',
  },
]; 