import { useEffect } from 'react';

const sections = [
  {
    title: 'Education',
    entries: [{
      organization: 'Brigham Young University', location: 'Provo, UT', role: 'Bachelor of Science in Computer Science (In Progress)', dates: '2023–2027',
      bullets: [
        'Pursuing a Bachelor’s degree in Computer Science with a Software Engineering emphasis',
        'Proficient in Java, Python, JavaScript, C++, and C',
        'Coursework in data structures, algorithms, databases, and web development',
      ],
    }],
  },
  {
    title: 'Work Experience',
    entries: [
      {
        organization: 'BYU Technology Support Center (TSC)', location: 'Provo, UT', role: 'TSC Agent · Courses Team Lead', dates: '2023–Present',
        bullets: [
          'Advanced from Calls Agent to Senior Analyst and Supervisor, then joined the Courses Team supporting faculty on Canvas and Learning Suite.',
          'Led student support for learning management systems.',
          'Resolved support requests for students, faculty, and staff by phone and email, owning tickets through resolution.',
          'Collaborated with teammates and escalated complex cases while maintaining ownership of customer concerns.',
        ],
      },
      {
        organization: 'Merrell Recycling', location: 'Mapleton, UT', role: 'Owner / Operator', dates: '2010–2016',
        bullets: [
          'Maintained six years of on-time weekly curbside recycling service across three cities, serving every scheduled home.',
          'Acquired customers through events, online publications, and phone outreach.',
          'Negotiated the sale of the business to Recyclops.',
        ],
      },
    ],
  },
  {
    title: 'Projects',
    entries: [
      {
        organization: 'Chess Application', location: 'Java · Console game with networked components', role: '', dates: '',
        href: 'https://github.com/Nivlac17/chess', bullets: ['Developed a console chess game in Java.', 'Implemented WebSocket communication and SQL database integration.'],
      },
      {
        organization: 'Lines of Light', location: 'Online grid art game', role: '', dates: '',
        href: 'https://github.com/Nivlac17/startup', bullets: ['Built a React frontend hosted on AWS for drawing and saving art to an online database with secure login.'],
      },
    ],
  },
  {
    title: 'Volunteer Work',
    entries: [
      {
        organization: 'The Church of Jesus Christ of Latter-day Saints', location: 'El Salvador', role: 'Missionary', dates: '2021–2023',
        bullets: [
          'Served local communities through service, teaching, and proselytizing; taught English Connect and self-reliance courses.',
          'Held leadership roles including Missionary Trainer and District Leader.',
          'Fluent Spanish speaker; assisted people through difficult life situations.',
        ],
      },
      {
        organization: 'Scouting', location: 'Mapleton, UT', role: 'Community Service', dates: '2021–2023',
        bullets: ['Earned the rank of Eagle Scout.', 'Organized service projects, fundraisers, and events.'],
      },
    ],
  },
];

export default function ResumePage() {
  useEffect(() => {
    document.title = 'Calvin W. Merrell | Resume';
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, nofollow';
    return () => {
      document.title = 'Calvin Merrell';
      robots?.remove();
    };
  }, []);

  return (
    <main className="resume-page">
      <div className="resume-toolbar"><span>Calvin W. Merrell · Resume</span><button onClick={() => window.print()}>Print / Save PDF</button></div>
      <article className="resume-sheet">
        <header className="resume-header">
          <p className="resume-kicker">Resume</p>
          <h1>Calvin W. Merrell</h1>
          <div className="resume-contact">
            <a href="mailto:calvinwmerrell@byu.edu">calvinwmerrell@byu.edu</a><span aria-hidden="true">·</span>
            <a href="https://linkedin.com/in/calvin-merrell-549a2b281" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </header>

        <section className="resume-section">
          <h2>Skills</h2>
          <p className="resume-skills">Computer troubleshooting · Java · Python · JavaScript · C++ · C · React · Git · SQL · WebSocket · HTTP · Team leadership · Adaptability · Communication · Strong work ethic · Positive attitude</p>
        </section>

        {sections.map((section) => (
          <section className="resume-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.entries.map((entry) => (
              <div className="resume-entry" key={entry.organization}>
                <div className="resume-entry-heading">
                  <div>
                    <h3>{entry.organization}</h3>
                    {entry.role && <p className="resume-role">{entry.role}</p>}
                  </div>
                  <div className="resume-meta">{entry.location}{entry.dates && <span>{entry.dates}</span>}</div>
                </div>
                {entry.href && <p className="resume-project-link"><a href={entry.href} target="_blank" rel="noreferrer">{entry.href.replace('https://', '')}</a>{entry.location && ` · ${entry.location}`}</p>}
                <ul>{entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </div>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
