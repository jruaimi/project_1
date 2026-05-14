import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getMe } from '../services/auth';
import WebGLBackground from '../components/WebGLBackground';

const navShellStyle = {
  padding: '1px',
  background: 'linear-gradient(to right bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.5), rgba(203,213,225,0.3))',
  boxShadow: `rgba(0,0,0,0.06) 0px 0px 0px 1px,
    rgba(0,0,0,0.06) 0px 1px 1px -0.5px,
    rgba(0,0,0,0.06) 0px 3px 3px -1.5px`,
};

const navInnerStyle = {
  background: 'rgba(248,249,250,0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  padding: '0 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '60px',
};

const cardShellStyle = {
  padding: '1px',
  borderRadius: '17px',
  background: 'linear-gradient(to right bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.5), rgba(203,213,225,0.3))',
  boxShadow: `rgba(0,0,0,0.06) 0px 0px 0px 1px,
    rgba(0,0,0,0.06) 0px 1px 1px -0.5px,
    rgba(0,0,0,0.06) 0px 3px 3px -1.5px,
    rgba(0,0,0,0.06) 0px 6px 6px -3px,
    rgba(0,0,0,0.06) 0px 12px 12px -6px,
    rgba(0,0,0,0.06) 0px 24px 24px -12px`,
};

const cardInnerStyle = {
  borderRadius: '16px',
  background: 'rgba(248,249,250,0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  padding: '36px 40px',
};

export default function WelcomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => {
        logout();
        navigate('/login', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <WebGLBackground />

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, ...navShellStyle }}>
        <div style={navInnerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                background: '#0F172A',
                borderRadius: '8px',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#0F172A',
                letterSpacing: '-0.01em',
              }}
            >
              Compliance Platform
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user && (
              <span
                style={{
                  fontSize: '14px',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {user.username}
              </span>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: '7px 14px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0F172A',
                background: 'rgba(241,245,249,0.8)',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 160ms ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(241,245,249,0.8)'}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '900px',
          margin: '0 auto',
          padding: '64px 24px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
            Loading…
          </div>
        ) : (
          <>
            {/* Welcome header */}
            <div style={{ marginBottom: '40px' }}>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                }}
              >
                Dashboard
              </p>
              <h1
                style={{
                  fontSize: '40px',
                  fontWeight: 400,
                  color: '#0F172A',
                  lineHeight: '48px',
                  letterSpacing: '-0.025em',
                  marginBottom: '12px',
                }}
              >
                Welcome back{user ? `, ${user.username}` : ''}.
              </h1>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '24px', maxWidth: '520px' }}>
                You are authenticated and have access to the Compliance Platform. Review your compliance status and manage your workflow below.
              </p>
            </div>

            {/* Cards grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  label: 'Compliance Score',
                  value: '98%',
                  sub: 'All checks passing',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  ),
                  label: 'Active Policies',
                  value: '24',
                  sub: '3 pending review',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  label: 'Last Audit',
                  value: '7d ago',
                  sub: 'Next audit in 23 days',
                },
              ].map((card) => (
                <div key={card.label} style={cardShellStyle}>
                  <div style={{ ...cardInnerStyle, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {card.icon}
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>{card.label}</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: '32px', marginBottom: '4px' }}>{card.value}</p>
                    <p style={{ fontSize: '13px', color: '#94A3B8' }}>{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Microsoft Certifications 2026 */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8px',
                  }}
                >
                  Microsoft Learn
                </p>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#0F172A',
                    letterSpacing: '-0.015em',
                    marginBottom: '4px',
                  }}
                >
                  Microsoft Certifications 2026
                </h2>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '22px' }}>
                  Latest certifications from Microsoft for 2026 — validate your skills in Azure, AI, Security, and Microsoft 365.
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    code: 'AZ-104',
                    level: 'Associate',
                    levelColor: '#2563EB',
                    levelBg: '#EFF6FF',
                    name: 'Microsoft Azure Administrator',
                    description: 'Validate skills in implementing, managing, and monitoring an organization\'s Microsoft Azure environment, including virtual networks, storage, compute, identity, and governance.',
                    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/',
                  },
                  {
                    code: 'AI-900',
                    level: 'Fundamentals',
                    levelColor: '#7C3AED',
                    levelBg: '#F5F3FF',
                    name: 'Microsoft Azure AI Fundamentals',
                    description: 'Demonstrate foundational knowledge of machine learning and AI concepts, and how they are implemented using Azure services such as Azure AI Vision, Azure AI Language, and Azure OpenAI Service.',
                    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
                  },
                  {
                    code: 'SC-401',
                    level: 'Associate',
                    levelColor: '#DC2626',
                    levelBg: '#FEF2F2',
                    name: 'Administering Information Security in Microsoft 365',
                    description: 'Updated for 2026: covers AI security controls, Data Security Posture Management (DSPM) for AI, Microsoft Purview, and protecting content in AI-enabled Microsoft 365 environments.',
                    url: 'https://learn.microsoft.com/en-us/credentials/certifications/information-security-administrator/',
                  },
                  {
                    code: 'AZ-305',
                    level: 'Expert',
                    levelColor: '#D97706',
                    levelBg: '#FFFBEB',
                    name: 'Designing Microsoft Azure Infrastructure Solutions',
                    description: 'Design cloud and hybrid solutions running on Azure, including compute, network, storage, monitoring, and identity. Recommended for experienced Azure architects.',
                    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/',
                  },
                  {
                    code: 'MS-102',
                    level: 'Associate',
                    levelColor: '#059669',
                    levelBg: '#ECFDF5',
                    name: 'Microsoft 365 Administrator',
                    description: 'Manage Microsoft 365 services, user identity and access, compliance policies, and security for an enterprise Microsoft 365 environment.',
                    url: 'https://learn.microsoft.com/en-us/credentials/certifications/m365-administrator-expert/',
                  },
                  {
                    code: 'MS-721',
                    level: 'Associate',
                    levelColor: '#2563EB',
                    levelBg: '#EFF6FF',
                    name: 'Collaboration Communications Systems Engineer',
                    description: 'New in 2026: plan, deploy, configure, and manage Teams Phone, meetings, and certified devices. Added as a skilling option for the Calling for Microsoft Teams specialization.',
                    url: 'https://learn.microsoft.com/en-us/credentials/certifications/m365-collaboration-communications-systems-engineer/',
                  },
                ].map((cert) => (
                  <div key={cert.code} style={cardShellStyle}>
                    <div style={{ ...cardInnerStyle, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: cert.levelColor,
                              background: cert.levelBg,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {cert.level}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>{cert.code}</span>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '8px', lineHeight: '20px' }}>{cert.name}</p>
                        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '19px' }}>{cert.description}</p>
                      </div>
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginTop: '16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#2563EB',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                      >
                        Learn more
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account details card */}
            <div style={cardShellStyle}>
              <div style={cardInnerStyle}>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0F172A',
                    marginBottom: '20px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Account Details
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {[
                    { label: 'Username', value: user?.username ?? '—' },
                    { label: 'Role', value: user?.role ?? '—' },
                    { label: 'Status', value: 'Active' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                      <p style={{ fontSize: '15px', color: '#0F172A', fontWeight: 500 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
