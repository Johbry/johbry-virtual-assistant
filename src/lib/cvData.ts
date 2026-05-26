/**
 * Datos del CV extraídos de config.yaml
 * Estructura centralizada para mostrar en el panel izquierdo
 */

export interface SkillItem {
  title: string;
  description?: string;
  link?: string;
}

export interface CVData {
  personal: {
    name: string;
    email: string;
    location: string;
    linkedin: string;
    github: string;
  };
  title: string;
  tagline: string;
  philosophy: string;
  skills: {
    category: string;
    items: (string | SkillItem)[];
  }[];
  experience: {
    title: string;
    company: string;
    period: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  knowledge: string[];
}

/**
 * Datos del CV de Johbry Mellado
 * Extraídos del AGENT_CHAT_PROMPT en config.yaml
 */
export const johbryCV: CVData = {
  personal: {
    name: 'Johbry Mellado',
    email: 'johbrym@gmail.com',
    location: 'Buenos Aires, Argentina',
    linkedin: 'linkedin.com/in/johbry-mellado',
    github: 'github.com/Johbry',
  },

  title: 'QA Automation Engineer',

  tagline: 'Especialista en garantizar calidad mediante automatización de pruebas end-to-end',

  philosophy: 'Si realmente no sé algo, lo acepto y busco la manera de aprenderlo, siempre dispuesta a crecer',

  skills: [
    {
      category: 'Automatización',
      items: [
        'WebdriverIO',
        'Appium',
        { title: 'Selenium', description: 'Framework para automatización web', link: 'https://www.selenium.dev' },
        'Cypress',
        'Playwright',
      ],
    },
    {
      category: 'API & Testing',
      items: [
        { title: 'Postman', description: 'Herramienta para testing de APIs', link: 'https://www.postman.com' },
        'REST APIs',
        'E2E',
        'Regresión',
        'Smoke Testing',
      ],
    },
    {
      category: 'AI Tools',
      items: [
        { title: 'Claude API', description: 'API de Claude para AI applications', link: 'https://claude.ai' },
        { title: 'Gemini API', description: 'API de Google Gemini', link: 'https://ai.google.dev' },
        { title: 'Strands Agents', description: 'Agent Harness SDK', link: 'https://strandsagents.com' },
        { title: 'LLM', description: 'Large Language Model' },
        { title: 'SDD', description: 'Specs Drive Development'},
      ],
    },
    {
      category: 'DevOps & Cloud',
      items: [
        'GitHub Actions',
        'CI/CD',
        { title: 'AWS S3', description: 'Servicio de almacenamiento en la nube' },
        { title: 'AWS Lambda', description: 'Serverless computing' },
        'AWS Amplify',
      ],
    },
    {
      category: 'Lenguajes',
      items: [
        'JavaScript',
        'TypeScript',
        'Node.js',
        'SQL',
      ],
    },
    {
      category: 'Herramientas',
      items: [
        'Jira',
        'Allure Reports',
        'Jest',
        'Mocha',
        { title: 'Git/GitHub', description: 'Control de versiones', link: 'https://github.com' },
        'VS Code',
      ],
    },
  ],

  experience: [
    {
      title: 'QA Automation Engineer',
      company: 'BIT S.A.',
      period: 'Septiembre 2023 - Presente',
      description: [
        'Automatización de casos de prueba E2E, regresión y smoke',
        'Reporte de bugs en Jira con seguimiento constante',
        'Infraestructura de testing con GitHub Actions + AWS S3',
      ],
    },
    {
      title: 'Quality Assurance Tester',
      company: 'SKILLCORP TECHNOLOGY C.A.',
      period: 'Diciembre 2019 - Noviembre 2021',
      description: [
        'Pruebas manuales en aplicaciones Web y Mobile',
        'Verificación de APIs con Postman',
        'Automatización de pruebas con Selenium',
      ],
    },
    {
      title: 'Auxiliar Administrativo',
      company: 'Plumrose Latinoamericana C.A.',
      period: 'Febrero 2017 - Agosto 2018',
      description: [
        'Gestión de inventarios',
        'Análisis contable',
      ],
    },
  ],

  education: [
    {
      institution: 'Argentina Programa',
      degree: 'Certificación en Testing Manual',
      year: '2023',
    },
    {
      institution: 'Universidad de Carabobo',
      degree: 'Licenciatura en Contabilidad Pública',
      year: '2011-2018',
    },
    {
      institution: 'Cursos Independientes',
      degree: 'SQL for Non-Programmers',
      year: '2020',
    },
  ],

  knowledge: [
    'Postman', 'API REST', 'WebdriverIO', 'Allure', 'Jest', 'Mocha', 'Javascript', 'Typescript',
    'TDD', 'Design Patterns', 'Appium', 'Jira', 'AWS Lambda', 'AWS S3', 'AWS Amplify',
    'GitLab', 'Github', 'Github Actions', 'CI/CD', 'Automation', 'QA Automation',
    'Selenium', 'Playwright', 'Stress Testing', 'Cypress', 'JMeter', 'Git', 'VS Code',
    'SQL', 'MongoDB', 'MySQL', 'OOP', 'Page Models', 'Claude API', 'Claude Code', 'LLM',
  ],
};
