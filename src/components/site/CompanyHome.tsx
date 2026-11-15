import Link from "next/link";
import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { CompanyContent } from "@/lib/content/company";
import type { Project } from "@/lib/queries/projects";
import type { Post } from "@/lib/queries/posts";
import type { Service } from "@/lib/queries/services";
import { PostRow } from "./PostRow";
import { QuoteForm } from "./QuoteForm";
import { HeroFilm } from "./HeroFilm";
import styles from "./CompanyHome.module.css";
import { Lines } from "./CopyLines";

/** Shared by the live homepage and authenticated draft preview. */
export function CompanyHome({
  content,
  projects,
  posts,
  services,
  contentConfigured,
}: {
  content: CompanyContent;
  projects: Project[];
  posts: Post[];
  services: Service[];
  contentConfigured: boolean;
}) {
  const { copy } = content;
  const localPreview =
    process.env.NODE_ENV === "development" &&
    process.env.SMIDIFY_STUDIO_PREVIEW === "1";
  const capabilities = [
    { title: copy.service1Title, text: copy.service1Body, number: "01" },
    { title: copy.service2Title, text: copy.service2Body, number: "02" },
    { title: copy.service3Title, text: copy.service3Body, number: "03" },
  ];
  return (
    <div className="cinema-home">
      <section className="cinema-hero" aria-labelledby="hero-title">
        <HeroFilm />
        <div className="hero-shade" />
        <div className="home-container hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> {copy.heroLabel}
          </p>
          <h1 id="hero-title">
            <Lines value={copy.heroTitle} />
          </h1>
          <p className="hero-description">
            <Lines value={copy.heroDescription} />
          </p>
          <div className="hero-actions">
            <Link href="/work" className="cinema-button">
              {copy.heroLink} <span aria-hidden="true">↗</span>
            </Link>
            <Link href="#quote" className="cinema-text-link">
              {copy.heroSecondaryLink} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-bottom home-container">
          <span>{copy.heroFootnote}</span>
          <a href="#intro" aria-label="Discover Smidify">
            {copy.heroScrollLabel} <span aria-hidden="true">↓</span>
          </a>
          <span>{copy.navTagline}</span>
        </div>
      </section>

      <section id="intro" className="home-container home-intro">
        <p className="eyebrow">{copy.aboutLabel}</p>
        <div>
          <h2>
            <Lines value={copy.aboutTitle} accentLast />
          </h2>
          <p>
            <Lines value={copy.aboutIntro} />
          </p>
          <Link href="/process" className="light-text-link">
            {copy.aboutBody} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section
        className="home-capabilities home-container"
        aria-labelledby="capabilities-title"
      >
        <div className="section-heading">
          <p id="capabilities-title" className="eyebrow">
            {copy.expertiseLabel}
          </p>
          <span>{copy.expertiseTitle}</span>
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
              <p className="eyebrow">{copy.projectsLabel}</p>
              <h2 id="work-title">
                <Lines value={copy.projectsTitle} />
              </h2>
            </div>
            <Link href="/work" className="cinema-text-link">
              {copy.projectsIntro} <span aria-hidden="true">↗</span>
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
              <span className="eyebrow">{copy.workEmptyLabel}</span>
              <h3>
                <Lines value={copy.projectsNote} />
              </h3>
              <Link href="#quote" className="cinema-button">
                {copy.workEmptyLink} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {content.milestones.length > 0 && (
        <section
          id="milestones"
          className={`home-container ${styles.milestones}`}
          aria-labelledby="milestones-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">{copy.milestonesLabel}</p>
              <h2 id="milestones-title">{copy.milestonesTitle}</h2>
            </div>
          </div>
          {copy.milestonesIntro ? <p>{copy.milestonesIntro}</p> : null}
          <ol className={styles.timeline}>
            {content.milestones.map((milestone) => (
              <li key={milestone.id}>
                <span>{milestone.date}</span>
                <h3>{milestone.title}</h3>
                <p>
                  <Lines value={milestone.description} />
                </p>
              </li>
            ))}
          </ol>
          {copy.milestonesNote ? <p>{copy.milestonesNote}</p> : null}
        </section>
      )}

      <section
        className="home-container home-people"
        aria-labelledby="people-title"
      >
        <div className="people-copy">
          <p className="eyebrow">{copy.visionLabel}</p>
          <h2 id="people-title">
            <Lines value={copy.visionTitle} accentLast />
          </h2>
          <p>
            <Lines value={copy.visionBody} />
          </p>
          <Link href="/process" className="light-text-link">
            {copy.expertiseIntro} <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="team-portraits" aria-label="Our team">
          <figure className="team-portrait">
            <div className="team-portrait-image">
              <Image
                src="/team/team-portrait-one.png"
                alt={`${copy.team1Name}, ${copy.team1Role}`}
                fill
                sizes="(min-width: 768px) 23vw, 45vw"
              />
            </div>
            <figcaption>
              <h3>{copy.team1Name}</h3>
              <p>
                <Lines value={copy.team1Role} />
              </p>
            </figcaption>
          </figure>
          <figure className="team-portrait">
            <div className="team-portrait-image">
              <Image
                src="/team/team-portrait-two.png"
                alt={`${copy.team2Name}, ${copy.team2Role}`}
                fill
                sizes="(min-width: 768px) 23vw, 45vw"
              />
            </div>
            <figcaption>
              <h3>{copy.team2Name}</h3>
              <p>
                <Lines value={copy.team2Role} />
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="home-container home-journal">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{copy.journalLabel}</p>
              <h2>
                <Lines value={copy.journalTitle} />
              </h2>
            </div>
            <Link href="/blog" className="light-text-link">
              {copy.journalLink} ↗
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
            <p className="eyebrow">{copy.contactLabel}</p>
            <h2>
              <Lines value={copy.contactTitle} accentLast />
            </h2>
            <p>
              <Lines value={copy.contactIntro} />
            </p>
          </div>
          <div className="quote-panel">
            <h3>{copy.quotePanelTitle}</h3>
            <p>{copy.quotePanelIntro}</p>
            {contentConfigured || localPreview ? (
              <QuoteForm variant="inline" preview={localPreview} />
            ) : (
              <a
                href={`mailto:${copy.contactEmail}`}
                className="light-text-link"
              >
                Email {copy.contactEmail} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
