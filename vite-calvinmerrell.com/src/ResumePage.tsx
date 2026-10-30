import { useEffect } from 'react';

const sections = [
  {
    title: 'Education',
    entries: [{
      organization: 'Brigham Young University', location: 'Provo, UT', role: 'Bachelor of Science in Computer Science (In Progress)', dates: '2023–2027',
      bullets: [
        'Pursuing a Bachelor’s degree in Computer Science with a Software Engineering emphasis',
        'Proficiency in Java, Python, JavaScript, C++, and C',
        'Coursework included data structures, algorithms, databases, and web development',
      ],
    }],
  },
  {
    title: 'Work Experience',
    entries: [
      {
        organization: 'BYU Technology Support Center (TSC)', location: 'Provo, UT', role: 'TSC Agent · Courses Team Lead', dates: '2023–Present',
        bullets: [
          'Started as a Calls Agent, promoted to Senior Analyst, and promoted to Supervisor.',
          'Joined the Courses Team to provide direct support to faculty using learning management systems such as Canvas and Learning Suite.',
          'Promoted to Courses Team Lead, responsible for student learning management system support.',
          'Provided technical support for students, faculty, and staff by phone and email.',
          'Worked directly with customers to resolve tickets from start to finish, ensuring issues were fully resolved before closure.',
          'Collaborated with team members and escalated complex cases when necessary while maintaining ownership of customer concerns, demonstrating patience and persistence in troubleshooting.',
        ],
      },
      {
        organization: 'Merrell Recycling', location: 'Mapleton, UT', role: 'Owner / Operator', dates: '2010–2016',
        bullets: [
          'Maintained a six-year perfect record for on-time weekly curbside recycling for customers in three cities without ever missing a house.',
          'Provided customer service, including acquiring customers through events, online publications, and phone calls.',
          'Negotiated the acquisition of the business by Recyclops.',
        ],
      },
    ],
  },
  {
    title: 'Projects',
    entries: [
      {
        organization: 'Chess Application (Java)', location: 'Console-based chess game with networked components', role: '', dates: '',
        href: 'https://github.com/Nivlac17/chess', bullets: ['Developed a console chess game in Java.', 'Implemented WebSocket communication and SQL database integration.'],
      },
      {
        organization: 'Lines of Light', location: 'Online Grid Art Game', role: '', dates: '',
        href: 'https://github.com/Nivlac17/startup', bullets: ['Built a React frontend hosted on AWS that allows users to draw and save art to an online database with a secure login system.'],
      },
    ],
  },
  {
    title: 'Volunteer Work',
    entries: [
      {
        organization: 'The Church of Jesus Christ of Latter-day Saints', location: 'El Salvador', role: 'Missionary', dates: '2021–2023',
        bullets: [
          'Served the people of El Salvador, working 13-hour days, seven days a week, doing community service, proselytizing, and teaching classes.',
          'Taught English courses (English Connect) and Self-Reliance courses.',
          'Held multiple leadership roles, including Missionary Trainer and District Leader.',
          'Fluent Spanish speaker.',
          'Assisted people through difficult life situations.',
        ],
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
          <p className="resume-skills">Computer troubleshooting · Java · Python · JavaScript · C++ · C · React · Git · SQL · WebSocket · HTTP · Team leadership · Ability to adapt to situations · Strong work ethic · Positive attitude · Strong communication</p>
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
