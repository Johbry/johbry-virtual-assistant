'use client';

import Image from 'next/image';
import { johbryCV } from '@/lib/cvData';
import { colors } from '@/lib/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faBriefcase,
  faGraduationCap,
  faEnvelope,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { SkillItem } from '@/lib/cvData';

export default function CVPanel() {
  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: colors.neutral.offWhite }}
    >
      {/* Header con Logo */}
      <div
        className="flex-shrink-0 px-6 py-6 text-white shadow-sm flex items-center gap-5"
        style={{ background: colors.gradients.primary }}
      >
        {/* Logo con efecto de sombra y fondo */}
        <div className="flex-shrink-0">
          <div
            className="w-24 h-24 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: '#f6f7fa'
            }}
          >
            <div className="w-20 h-20">
              <Image
                src="/logo-johbry.png"
                alt="Johbry Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Nombre y Cargo */}
        <div className="flex-1">
          <h1 className="font-bold mb-1" style={{ fontSize: '28px' }}>{johbryCV.personal.name}</h1>
          <p
            className="text-base font-semibold"
            style={{ color: colors.primary.lime }}
          >
            {johbryCV.title}
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Filosofía */}
        <div>
          <p className="text-xs italic text-center px-3 py-2 rounded-lg" style={{
            backgroundColor: colors.neutral.white,
            borderLeft: `3px solid ${colors.primary.lime}`,
            color: colors.neutral.gray700,
          }}>
            💡 &quot;{johbryCV.philosophy}&quot;
          </p>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: colors.primary.teal }}>
            <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
            Habilidades
          </h2>
          <div className="space-y-3">
            {johbryCV.skills.map((skillGroup, idx) => (
              <div key={idx}>
                <p className="text-xs font-semibold mb-1" style={{ color: colors.neutral.gray700 }}>
                  {skillGroup.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, sidx) => {
                    const isObject = typeof skill === 'object';
                    const skillData = isObject ? skill as SkillItem : { title: skill as string };

                    return (
                      <div key={sidx} className="relative group">
                        {skillData.link ? (
                          <a
                            href={skillData.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 rounded-full text-white font-medium flex items-center gap-1 hover:opacity-90 transition cursor-pointer"
                            style={{
                              background: colors.gradients.primary,
                            }}
                            title={skillData.description || ''}
                          >
                            {skillData.title}
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span
                            className="text-xs px-2 py-1 rounded-full text-white font-medium block"
                            style={{
                              background: colors.gradients.primary,
                            }}
                            title={skillData.description || ''}
                          >
                            {skillData.title}
                          </span>
                        )}

                        {/* Tooltip */}
                        {skillData.description && (
                          <div
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                            style={{ backgroundColor: colors.neutral.gray800 }}
                          >
                            {skillData.description}
                            <div
                              className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2"
                              style={{
                                backgroundColor: colors.neutral.gray800,
                                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experiencia */}
        <div>
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: colors.primary.teal }}>
            <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />
            Experiencia
          </h2>
          <div className="space-y-3">
            {johbryCV.experience.map((job, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.neutral.white, borderLeft: `3px solid ${colors.primary.lime}` }}
              >
                <p className="text-xs font-bold" style={{ color: colors.primary.teal }}>
                  {job.title}
                </p>
                <p className="text-xs font-semibold" style={{ color: colors.neutral.gray600 }}>
                  {job.company}
                </p>
                <p className="text-xs" style={{ color: colors.neutral.gray500 }}>
                  {job.period}
                </p>
                <ul className="mt-2 space-y-1">
                  {job.description.map((desc, didx) => (
                    <li key={didx} className="text-xs leading-relaxed" style={{ color: colors.neutral.gray700 }}>
                      • {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Educación */}
        <div>
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: colors.primary.teal }}>
            <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4" />
            Educación
          </h2>
          <div className="space-y-2">
            {johbryCV.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg text-xs"
                style={{ backgroundColor: colors.neutral.white }}
              >
                <p className="font-semibold" style={{ color: colors.primary.teal }}>
                  {edu.degree}
                </p>
                <p style={{ color: colors.neutral.gray600 }}>{edu.institution}</p>
                <p style={{ color: colors.neutral.gray500 }}>{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer con contacto */}
      <div
        className="flex-shrink-0 px-6 py-4 border-t space-y-2"
        style={{
          backgroundColor: colors.neutral.white,
          borderTopColor: colors.neutral.gray200,
        }}
      >
        <h3 className="text-xs font-bold mb-2" style={{ color: colors.primary.teal }}>
          Contacto
        </h3>

        <a
          href={`mailto:${johbryCV.personal.email}`}
          className="flex items-center gap-2 text-xs p-2 rounded hover:opacity-80 transition"
          style={{
            color: colors.primary.teal,
            backgroundColor: colors.neutral.offWhite,
          }}
        >
          <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5" />
          {johbryCV.personal.email}
        </a>

        <a
          href={`https://${johbryCV.personal.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs p-2 rounded hover:opacity-80 transition"
          style={{
            color: colors.primary.teal,
            backgroundColor: colors.neutral.offWhite,
          }}
        >
          <FontAwesomeIcon icon={faLinkedin} className="w-3.5 h-3.5" />
          LinkedIn
        </a>

        <a
          href={`https://${johbryCV.personal.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs p-2 rounded hover:opacity-80 transition"
          style={{
            color: colors.primary.teal,
            backgroundColor: colors.neutral.offWhite,
          }}
        >
          <FontAwesomeIcon icon={faGithub} className="w-3.5 h-3.5" />
          GitHub
        </a>

        <p className="text-xs mt-3" style={{ color: colors.neutral.gray500 }}>
          📍 {johbryCV.personal.location}
        </p>
      </div>
    </div>
  );
}
