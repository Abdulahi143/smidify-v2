import { mediaUrl } from "@/lib/media";
import type { Metadata } from "next";
import Link from "next/link";
import { PostRow, QuoteForm } from "@/components/site";
import Image from "next/image";
import { HeroFilm } from "@/components/site/HeroFilm";
import { getLatestPosts } from "@/lib/queries/posts";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getServices } from "@/lib/queries/services";

export const metadata: Metadata = {
  title: "Smidify — Websites, apps, networks. Easy to work with.",
  description:
    "Smidify designs, builds and runs the software and infrastructure small and medium businesses depend on.",
};

const capabilities = [
  {
    title: "Websites",
    text: "A clear first impression. A better way to turn visitors into customers.",
    number: "01",
  },
  {
    title: "Apps",
    text: "Thoughtful tools that make everyday work feel effortless.",
    number: "02",
  },
  {
    title: "Networks",
    text: "Reliable infrastructure that keeps your business connected.",
    number: "03",
  },
];

export default async function Home() {
  const contentConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  // Keep the local design preview usable before a content backend is configured.
  // Configured backend errors still reach the normal error boundary.
  const [services, projects, posts] = await Promise.all([
    contentConfigured ? getServices() : Promise.resolve([]),
    getFeaturedProjects(3),
    getLatestPosts(3),
  ]);

  return (
    <div className="cinema-home">
      <section className="cinema-hero" aria-labelledby="hero-title">
        <HeroFilm />
        <div className="hero-shade" />
        <div className="home-container hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Ideas into everyday impact
          </p>
          <h1 id="hero-title">
            BUILT FOR
            <br />
            WHAT’S NEXT.
          </h1>
          <p className="hero-description">
            Websites, apps, networks.
            <br />
            Technology that moves your business forward.
            <br />
            People who make it easy.
          </p>
          <div className="hero-actions">
            <Link href="/work" className="cinema-button">
              Explore our work <span aria-hidden="true">↗</span>
            </Link>
            <Link href="#quote" className="cinema-text-link">
              Let’s talk <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-bottom home-container">
          <span>Designed. Built. Connected.</span>
          <a href="#intro" aria-label="Discover Smidify">
            Scroll to discover <span aria-hidden="true">↓</span>
          </a>
          <span>Smidify / Independent technology studio</span>
        </div>
      </section>

      <section id="intro" className="home-container home-intro">
        <p className="eyebrow">Small team. Complete picture.</p>
        <div>
          <h2>
            Good technology.
            <br />
            <span>Less complexity.</span>
          </h2>
          <p>
            We design, build and run the software and infrastructure your
            business depends on. From the first conversation to what comes next,
            you work with one team.
          </p>
          <Link href="/process" className="light-text-link">
            How we work <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section
        className="home-capabilities home-container"
        aria-labelledby="capabilities-title"
      >
        <div className="section-heading">
          <p id="capabilities-title" className="eyebrow">
            What we do
          </p>
          <span>One connected approach</span>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <Link
              href="/services"
              key={item.number}
              className="capability-card"
            >
              <span className="capability-number">{item.number} /</span>
              <h3>
                {item.title}
                <span aria-hidden="true">↗</span>
              </h3>
              <p>{item.text}</p>
            </Link>
          ))}
        </div>
        {services.length > 0 && (
          <p className="service-detail">
            {services.map((service) => service.title).join(" / ")}
          </p>
        )}
      </section>

      <section className="home-work" aria-labelledby="work-title">
        <div className="home-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">From idea to in use</p>
              <h2 id="work-title">Work that moves things.</h2>
            </div>
            <Link href="/work" className="cinema-text-link">
              All projects <span aria-hidden="true">↗</span>
            </Link>
          </div>
          {projects.length > 0 ? (
            <div className="cinema-projects">
              {projects.map((project, index) => (
                <Link
                  className="cinema-project"
                  href={`/work/${project.slug}`}
                  key={project.id}
                >
                  <div className={`project-visual project-visual-${index % 3}`}>
                    {project.cover_path ? (
                      <Image
                        src={mediaUrl(project.cover_path)}
                        alt={project.cover_alt || project.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="project-placeholder" aria-hidden="true">
                        <div />
                        <span>
                          SMIDIFY / {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                    <span className="project-open" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <div className="project-caption">
                    <h3>{project.title}</h3>
                    <span>{project.kinds.join(" / ")}</span>
                  </div>
                  <p>{project.summary}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="work-empty">
              <span className="eyebrow">The next chapter</span>
              <h3>
                Your idea could be
                <br />
                what comes next.
              </h3>
              <Link href="#quote" className="cinema-button">
                Start a conversation <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section
        className="home-container home-people"
        aria-labelledby="people-title"
      >
        <div className="people-copy">
          <p className="eyebrow">The people behind the pixels</p>
          <h2 id="people-title">
            Technology is personal.
            <br />
            <span>So is our approach.</span>
          </h2>
          <p>
            We listen first, explain things clearly and stay close to the work.
            A direct relationship with the people building your next step.
          </p>
          <Link href="/process" className="light-text-link">
            Meet our approach <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="team-portraits" aria-label="Our team">
          <figure className="team-portrait">
            <div className="team-portrait-image">
              <Image
                src="/team/team-portrait-one.png"
                alt="Abdiaziz, Co-founder, Technology & Solutions"
                fill
                sizes="(min-width: 1200px) 20vw, (min-width: 768px) 30vw, 45vw"
              />
            </div>
            <figcaption>
              <h3>Abdiaziz</h3>
              <p>
                <span>Co-founder,</span> <span>Technology &amp; Solutions</span>
              </p>
            </figcaption>
          </figure>
          <figure className="team-portrait">
            <div className="team-portrait-image">
              <Image
                src="/team/team-portrait-two.png"
                alt="Shakur, Co-founder, Full-Stack Developer"
                fill
                sizes="(min-width: 1200px) 20vw, (min-width: 768px) 30vw, 45vw"
              />
            </div>
            <figcaption>
              <h3>Shakur</h3>
              <p>
                <span>Co-founder,</span> <span>Full-Stack Developer</span>
              </p>
            </figcaption>
          </figure>
          <figure
            className="team-portrait team-portrait-pending"
            aria-label="Space for another team photo"
          >
            <div className="team-portrait-image">
              <span className="team-photo-slot" aria-hidden="true">
                +
              </span>
            </div>
          </figure>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="home-container home-journal">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notes from the studio</p>
              <h2>Always building. Always learning.</h2>
            </div>
            <Link href="/blog" className="light-text-link">
              The journal ↗
            </Link>
          </div>
          <div className="journal-grid">
            {posts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <section id="quote" className="home-quote">
        <div className="home-container quote-grid">
          <div>
            <p className="eyebrow">Your next step starts here</p>
            <h2>
              LET’S BUILD
              <br />
              SOMETHING
              <br />
              <span>THAT MATTERS.</span>
            </h2>
            <p>
              Tell us what you have in mind. We’ll reply within one working day
              with a plain-language estimate.
            </p>
          </div>
          <div className="quote-panel">
            <h3>A good place to start.</h3>
            <p>A few details. A real conversation.</p>
            {contentConfigured ? (
              <QuoteForm variant="inline" />
            ) : (
              <a href="mailto:hello@smidify.com" className="light-text-link">
                Email hello@smidify.com <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
