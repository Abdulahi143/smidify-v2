import { Fragment } from "react";
import Link from "next/link";
import type { CompanyContent } from "@/lib/content/company";
import type { Project } from "@/lib/queries/projects";
import { QuoteForm } from "@/components/site/QuoteForm";
import { defaultCompanyContent } from "@/lib/content/company";
import { mediaUrl } from "@/lib/media";
export function Lines({
  value,
  accentLast = false,
}: {
  value: string | undefined;
  accentLast?: boolean;
}) {
  const lines = (value ?? "").split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {accentLast && i === lines.length - 1 ? <span>{line}</span> : line}
        </Fragment>
      ))}
    </>
  );
}
const placeholders = [
  {
    id: "web",
    category: "Websites",
    title: "Website project",
    customer: "Customer name to be added.",
    brief: "Customer goals and challenges to be added.",
    solution: "Project scope and delivered work to be added.",
    outcome: "Verified results to be added.",
    image: "",
    url: "",
    placeholder: true,
  },
  {
    id: "apps",
    category: "Applications",
    title: "Application project",
    customer: "Customer name to be added.",
    brief: "Customer goals and challenges to be added.",
    solution: "Project scope and delivered work to be added.",
    outcome: "Verified results to be added.",
    image: "",
    url: "",
    placeholder: true,
  },
  {
    id: "systems",
    category: "Infrastructure",
    title: "Connected systems project",
    customer: "Customer name to be added.",
    brief: "Customer goals and challenges to be added.",
    solution: "Project scope and delivered work to be added.",
    outcome: "Verified results to be added.",
    image: "",
    url: "",
    placeholder: true,
  },
];
function CompanyProjects({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.length
        ? projects.map((p, i) => (
            <article className="project" key={p.id}>
              {p.cover_path ? (
                <div className="project-art">
                  <img
                    className="project-image"
                    src={mediaUrl(p.cover_path)}
                    alt={p.cover_alt || p.title}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  className={"project-art " + ["web", "apps", "systems"][i % 3]}
                  aria-hidden="true"
                >
                  <div className="project-symbol" />
                </div>
              )}
              <div className="project-type">{p.kinds.join(" / ")}</div>
              <h3>
                <Link href={"/work/" + p.slug}>{p.title}</Link>
              </h3>
              {p.client && <p>{p.client}</p>}
              <dl>
                {[
                  ["The brief", p.problem || p.summary],
                  ["Our solution", p.solution],
                  ["The outcome", p.result],
                ].map(([label, value]) =>
                  value ? (
                    <Fragment key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </Fragment>
                  ) : null,
                )}
              </dl>
              <Link className="project-link" href={"/work/" + p.slug}>
                View project ↗
              </Link>
            </article>
          ))
        : placeholders.map((p, i) => (
            <article className="project" key={p.id}>
              <div
                className={"project-art " + ["web", "apps", "systems"][i % 3]}
                aria-hidden="true"
              >
                <div className="project-symbol" />
                <span>Project preview to come</span>
              </div>
              <div className="project-type">{p.category} / Placeholder</div>
              <h3>{p.title}</h3>
              <p>{p.customer}</p>
              <dl>
                {[
                  ["The brief", p.brief],
                  ["Our solution", p.solution],
                  ["The outcome", p.outcome],
                ].map(([label, value]) => (
                  <Fragment key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </Fragment>
                ))}
              </dl>
            </article>
          ))}
    </div>
  );
}
export function CompanyHome({
  content,
  projects,
}: {
  content: CompanyContent;
  projects: Project[];
}) {
  const { copy } = content;
  return (
    <div className="company-home">
      <div className="hero">
        <div className="eyebrow">
          <Lines value={copy.heroLabel} />
        </div>
        <h1>
          <Lines value={copy.heroTitle} accentLast />
        </h1>
        <p className="hero-copy">
          <Lines value={copy.heroDescription} />
        </p>
        <img
          className="keystone-art"
          src="/brand/smidify-keystone-sculpture.svg"
          width="600"
          height="640"
          alt="A sage-green keystone sculpture: two curved supports and a central stone coming together."
          fetchPriority="high"
        />
        <div className="hero-bottom">
          <a href="#about">
            <Lines value={copy.heroLink} /> <span className="arrow">{"↓"}</span>
          </a>
          <span className="small">
            <Lines value={copy.heroFootnote} />
          </span>
        </div>
      </div>
      {"\n"}
      <section className="intro" id="about">
        <div className="eyebrow">
          <Lines value={copy.aboutLabel} />
        </div>
        <div>
          <h2>
            <Lines value={copy.aboutTitle} />
          </h2>
          <p>
            <Lines value={copy.aboutIntro} />
          </p>
          <p>
            <Lines value={copy.aboutBody} />
          </p>
        </div>
      </section>
      {"\n"}
      <section id="approach">
        <div className="section-top">
          <div>
            <div className="eyebrow">
              <Lines value={copy.expertiseLabel} />
            </div>
            <h2>
              <Lines value={copy.expertiseTitle} />
            </h2>
          </div>
          <p>
            <Lines value={copy.expertiseIntro} />
          </p>
        </div>
        <div className="principles">
          <article className="principle">
            <span className="number">{"01"}</span>
            <h3>
              <Lines value={copy.service1Title} />
            </h3>
            <p>
              <Lines value={copy.service1Body} />
            </p>
          </article>
          <article className="principle">
            <span className="number">{"02"}</span>
            <h3>
              <Lines value={copy.service2Title} />
            </h3>
            <p>
              <Lines value={copy.service2Body} />
            </p>
          </article>
          <article className="principle">
            <span className="number">{"03"}</span>
            <h3>
              <Lines value={copy.service3Title} />
            </h3>
            <p>
              <Lines value={copy.service3Body} />
            </p>
          </article>
        </div>
      </section>
      {"\n"}
      <section
        className="projects"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="section-top">
          <div>
            <div className="eyebrow">
              <Lines value={copy.projectsLabel} />
            </div>
            <h2 id="projects-title">
              <Lines value={copy.projectsTitle} />
            </h2>
          </div>
          <p>
            <Lines value={copy.projectsIntro} />
          </p>
        </div>
        <CompanyProjects projects={projects} />
        <p className="placeholder-note">
          <Lines
            value={
              projects.length &&
              copy.projectsNote === defaultCompanyContent.copy.projectsNote
                ? ""
                : copy.projectsNote
            }
          />
        </p>
      </section>
      {"\n"}
      <section id="milestones" aria-labelledby="milestones-title">
        <div className="section-top">
          <div>
            <div className="eyebrow">
              <Lines value={copy.milestonesLabel} />
            </div>
            <h2 id="milestones-title">
              <Lines value={copy.milestonesTitle} />
            </h2>
          </div>
          <p>
            <Lines value={copy.milestonesIntro} />
          </p>
        </div>
        <div className="timeline">
          {content.milestones.map((m) => (
            <article className="milestone" key={m.id}>
              <time>{m.date}</time>
              <div>
                <h3>{m.title}</h3>
                <p>
                  <Lines value={m.description} />
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="placeholder-note">
          <Lines value={copy.milestonesNote} />
        </p>
      </section>
      {"\n"}
      <section className="vision" id="vision">
        <div className="eyebrow">
          <Lines value={copy.visionLabel} />
        </div>
        <div>
          <h2>
            <Lines value={copy.visionTitle} />
          </h2>
          <p>
            <Lines value={copy.visionBody} />
          </p>
        </div>
      </section>
      {"\n"}
      <section className="contact" id="contact">
        <div>
          <div className="eyebrow">
            <Lines value={copy.contactLabel} />
          </div>
          <h2>
            <Lines value={copy.contactTitle} />
          </h2>
        </div>
        <p className="contact-note">
          <Lines value={copy.contactIntro} />
          <br />
          <a href={"mailto:" + copy.contactEmail} className="contact-email">
            <Lines value={copy.contactEmail} />
            {" ↗"}
          </a>
        </p>
        <div id="quote" className="company-quote">
          <h3>Have a project in mind?</h3>
          <QuoteForm variant="inline" />
        </div>
      </section>
    </div>
  );
}
