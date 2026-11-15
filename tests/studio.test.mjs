import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Use the project's TypeScript compiler; no separate test runtime is required.
function loadSource(path, mocks = {}) {
  const filename = fileURLToPath(new URL(`../${path}`, import.meta.url));
  const localRequire = createRequire(filename);
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const compiled = { exports: {} };
  const run = new Function("require", "module", "exports", outputText);
  run(
    (name) => (Object.hasOwn(mocks, name) ? mocks[name] : localRequire(name)),
    compiled,
    compiled.exports,
  );
  return compiled.exports;
}

const { mergeSavedValues } = loadSource("src/components/admin/editor-state.ts");
const { postSchema, projectSchema } = loadSource(
  "src/lib/validation/content.ts",
);
const { companySchema, defaultCompanyContent } = loadSource(
  "src/lib/content/company.ts",
);
const submitted = {
  id: null,
  title: "First title",
  slug: "first-title",
  status: "draft",
};
const saved = { ...submitted, id: "saved-id", status: "published" };

test("a save preserves text typed while the request was in flight", () => {
  const current = { ...submitted, title: "The newer text" };
  assert.deepEqual(mergeSavedValues(current, submitted, saved), {
    ...saved,
    title: "The newer text",
  });
});
test("a save preserves a newly edited URL and review status", () => {
  const current = { ...submitted, slug: "new-url", status: "in_review" };
  const result = mergeSavedValues(current, submitted, saved);
  assert.equal(result.slug, "new-url");
  assert.equal(result.status, "in_review");
  assert.equal(result.id, "saved-id");
});
test("publish applies its status when the user has made no newer status edit", () => {
  assert.equal(
    mergeSavedValues(submitted, submitted, saved).status,
    "published",
  );
});

const project = {
  id: null,
  title: "A new project",
  slug: "new-project",
  summary: "",
  kinds: [],
  client: "",
  timeline: "",
  year: null,
  cover_path: null,
  cover_alt: "",
  gallery_paths: [],
  gallery_alts: [],
  problem: "",
  solution: "",
  result: "",
  quote: "",
  quote_author: "",
  featured: false,
  status: "draft",
};
const post = {
  id: null,
  title: "A new post",
  slug: "new-post",
  excerpt: "",
  category: "Engineering",
  body_md: "",
  cover_path: null,
  cover_alt: "",
  featured: false,
  status: "draft",
};
test("incomplete project content can be saved as a draft", () => {
  assert.equal(projectSchema.safeParse(project).success, true);
});
test("publishing requires both summary and cover image", () => {
  const result = projectSchema.safeParse({ ...project, status: "published" });
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map((issue) => issue.path[0]).sort(), [
    "cover_path",
    "summary",
  ]);
});
test("cover and gallery images require meaningful alt text", () => {
  const result = projectSchema.safeParse({
    ...project,
    cover_path: "projects/cover.jpg",
    gallery_paths: ["projects/gallery.jpg"],
  });
  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some((issue) => issue.path.join(".") === "cover_alt"),
  );
  assert.ok(
    result.error.issues.some(
      (issue) => issue.path.join(".") === "gallery_alts.0",
    ),
  );
});
test("posts can be drafted, while publication checks still apply", () => {
  assert.equal(postSchema.safeParse(post).success, true);
  assert.equal(
    postSchema.safeParse({ ...post, status: "published" }).success,
    false,
  );
});
test("publishing a complete post passes validation", () => {
  assert.equal(
    postSchema.safeParse({
      ...post,
      status: "published",
      excerpt: "An introduction.",
      cover_path: "posts/cover.jpg",
      cover_alt: "A prototype on a desk",
    }).success,
    true,
  );
});
test("old website content acquires new fields without overwriting existing copy", () => {
  const result = companySchema.parse({
    copy: {
      heroTitle: "Our existing headline",
      contactEmail: "team@example.com",
    },
    milestones: [],
  });
  assert.equal(result.copy.heroTitle, "Our existing headline");
  assert.equal(result.copy.contactEmail, "team@example.com");
  assert.equal(
    result.copy.journalTitle,
    defaultCompanyContent.copy.journalTitle,
  );
});
test("unknown website fields, invalid contact email, and duplicate milestones are rejected", () => {
  assert.equal(
    companySchema.safeParse({
      ...defaultCompanyContent,
      copy: { ...defaultCompanyContent.copy, unsupported: "x" },
    }).success,
    false,
  );
  assert.equal(
    companySchema.safeParse({
      ...defaultCompanyContent,
      copy: { ...defaultCompanyContent.copy, contactEmail: "invalid" },
    }).success,
    false,
  );
  const milestone = {
    id: "one",
    title: "Launch",
    date: "2026",
    description: "",
  };
  assert.equal(
    companySchema.safeParse({
      ...defaultCompanyContent,
      milestones: [milestone, milestone],
    }).success,
    false,
  );
});

const { Lines } = loadSource("src/components/site/CopyLines.tsx");
const { CompanyHome } = loadSource("src/components/site/CompanyHome.tsx", {
  "./CopyLines": { Lines },
  "next/link": ({ href, children, ...props }) =>
    React.createElement("a", { href, ...props }, children),
  "next/image": ({ src, alt }) => React.createElement("img", { src, alt }),
  "@/lib/media": { mediaUrl: (path) => path },
  "./PostRow": { PostRow: () => null },
  "./QuoteForm": {
    QuoteForm: () => React.createElement("form", { "data-test": "quote" }),
  },
  "./HeroFilm": { HeroFilm: () => null },
  "./CompanyHome.module.css": {
    milestones: "milestones",
    timeline: "timeline",
  },
});
function home(content) {
  return renderToStaticMarkup(
    React.createElement(CompanyHome, {
      content,
      projects: [],
      posts: [],
      services: [],
      contentConfigured: false,
    }),
  );
}
test("the shared live/preview homepage renderer displays saved copy in the current design", () => {
  const html = home({
    ...defaultCompanyContent,
    copy: {
      ...defaultCompanyContent.copy,
      heroTitle: "A custom headline",
      contactEmail: "new@example.com",
    },
  });
  assert.match(html, /class="cinema-home"/);
  assert.match(html, /A custom headline/);
  assert.match(html, /mailto:new@example.com/);
  assert.doesNotMatch(html, /BUILT FOR/);
});
test("milestones appear when entered and stay hidden when empty", () => {
  assert.doesNotMatch(home(defaultCompanyContent), /id="milestones"/);
  assert.match(
    home({
      ...defaultCompanyContent,
      milestones: [
        {
          id: "launch",
          title: "Our launch",
          date: "2026",
          description: "First release",
        },
      ],
    }),
    /Our launch/,
  );
});

const { localStudioPreviewEnabled } = loadSource(
  "src/lib/studio-preview-policy.ts",
);
test("local preview requires an explicit flag and a loopback host in development", () => {
  for (const host of ["localhost:3000", "127.0.0.1:3000", "[::1]:3000"]) {
    assert.equal(
      localStudioPreviewEnabled({ mode: "development", enabled: "1", host }),
      true,
    );
  }
  for (const host of [
    null,
    "smidify.com",
    "localhost.evil.example",
    "localhost@evil.example",
    "evil.example@localhost",
    "192.168.1.20:3000",
  ]) {
    assert.equal(
      localStudioPreviewEnabled({ mode: "development", enabled: "1", host }),
      false,
    );
  }
  assert.equal(
    localStudioPreviewEnabled({
      mode: "development",
      enabled: undefined,
      host: "localhost:3000",
    }),
    false,
  );
});
test("production and test modes never allow the local bypass, even with its flag set", () => {
  for (const mode of ["production", "test", undefined]) {
    assert.equal(
      localStudioPreviewEnabled({ mode, enabled: "1", host: "localhost:3000" }),
      false,
    );
  }
});
test("a preview viewer cannot acquire the real admin client for mutations", async () => {
  const auth = loadSource("src/lib/auth.ts", {
    react: { cache: (callback) => callback },
    "next/navigation": {
      forbidden: () => {
        throw Error("Forbidden");
      },
      redirect: () => {
        throw Error("Redirect");
      },
    },
    "@/lib/studio-preview": { isLocalStudioPreview: async () => true },
    "@/lib/supabase/server": {
      createClient: () => {
        throw Error("Preview must never connect to the real backend");
      },
    },
  });
  assert.equal((await auth.requireStudioViewer()).preview, true);
  await assert.rejects(auth.requireAdmin(), /read-only/);
});

const studioValidation = loadSource("src/lib/validation/studio.ts");
test("settings validate email and title and ignore unrelated content fields", () => {
  const result = studioValidation.studioSettingsSchema.parse({
    contactEmail: "team@example.com",
    metaTitle: " Site title ",
    metaDescription: "",
    footerTagline: "A studio",
    heroTitle: "Not a settings field",
  });
  assert.equal(result.metaTitle, "Site title");
  assert.equal(Object.hasOwn(result, "heroTitle"), false);
  assert.equal(
    studioValidation.studioSettingsSchema.safeParse({
      ...result,
      contactEmail: "invalid",
    }).success,
    false,
  );
});
test("password updates require 12 characters and matching confirmation", () => {
  assert.equal(
    studioValidation.passwordSchema.safeParse({
      password: "short",
      confirmation: "short",
    }).success,
    false,
  );
  assert.equal(
    studioValidation.passwordSchema.safeParse({
      password: "long-enough-password",
      confirmation: "different",
    }).success,
    false,
  );
  assert.equal(
    studioValidation.passwordSchema.safeParse({
      password: "long-enough-password",
      confirmation: "long-enough-password",
    }).success,
    true,
  );
});
test("media browsing and deletion reject traversal, absolute paths and malformed object paths", () => {
  for (const path of [
    "../secret",
    "/absolute/file.png",
    "library//file.png",
    "library/../file.png",
    "library/./file.png",
  ]) {
    assert.equal(
      studioValidation.mediaObjectSchema.safeParse(path).success,
      false,
    );
  }
  assert.equal(
    studioValidation.mediaFolderSchema.safeParse("projects/123-abc").success,
    true,
  );
  assert.equal(
    studioValidation.mediaFolderSchema.safeParse("../").success,
    false,
  );
  assert.equal(
    studioValidation.mediaObjectSchema.safeParse("library/cover-image.webp")
      .success,
    true,
  );
});
test("settings reject a stale revision before writing and preserve other website content", async () => {
  const draft = {
    content: structuredClone(defaultCompanyContent),
    revision: 4,
  };
  draft.content.copy.heroTitle = "Keep this approved headline";
  let writes = 0;
  const actions = loadSource("src/lib/actions/settings.ts", {
    "@/lib/auth": { requireAdmin: async () => ({}) },
    "@/lib/validation/studio": studioValidation,
    "./company": {
      getCompanyDraft: async () => draft,
      saveCompanyDraft: async (content, revision) => {
        writes++;
        assert.equal(revision, 4);
        assert.equal(content.copy.heroTitle, "Keep this approved headline");
        assert.equal(content.copy.contactEmail, "new@example.com");
        return { ok: true, revision: 5, updatedAt: "" };
      },
    },
  });
  const settings = {
    contactEmail: "new@example.com",
    metaTitle: "My studio",
    metaDescription: "Description",
    footerTagline: "Tagline",
  };
  assert.equal((await actions.saveStudioSettings(settings, 3)).ok, false);
  assert.equal(writes, 0);
  assert.equal((await actions.saveStudioSettings(settings, 4)).ok, true);
  assert.equal(writes, 1);
});
test("media deletion refuses an image referenced by content", async () => {
  let removals = 0;
  const query = {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    contains() {
      return this;
    },
    then(resolve) {
      return Promise.resolve({ count: 1, error: null }).then(resolve);
    },
  };
  const actions = loadSource("src/lib/actions/media.ts", {
    "next/cache": { revalidatePath() {} },
    "@/lib/auth": {
      requireAdmin: async () => ({
        supabase: {
          from: () => query,
          storage: {
            from: () => ({
              remove: async () => {
                removals++;
                return { error: null };
              },
            }),
          },
        },
      }),
    },
    "@/lib/validation/studio": studioValidation,
    "@/lib/queries/media": { listMedia: async () => [] },
  });
  await assert.rejects(
    actions.deleteMedia("library/cover.webp"),
    /used by a project or post/,
  );
  assert.equal(removals, 0);
});
test("media deletion removes an unused image only after checking all references", async () => {
  let checked = 0;
  let removed;
  const actions = loadSource("src/lib/actions/media.ts", {
    "next/cache": { revalidatePath() {} },
    "@/lib/auth": {
      requireAdmin: async () => ({
        supabase: {
          from: () => ({
            select() {
              return this;
            },
            eq() {
              return this;
            },
            contains() {
              return this;
            },
            then(resolve) {
              checked++;
              return Promise.resolve({ count: 0, error: null }).then(resolve);
            },
          }),
          storage: {
            from: () => ({
              remove: async (paths) => {
                removed = paths;
                return { error: null };
              },
            }),
          },
        },
      }),
    },
    "@/lib/validation/studio": studioValidation,
    "@/lib/queries/media": { listMedia: async () => [] },
  });
  await actions.deleteMedia("library/unused.webp");
  assert.equal(checked, 3);
  assert.deepEqual(removed, ["library/unused.webp"]);
});
const { serviceSchema } = loadSource("src/lib/validation/content.ts");
test("services support new records and validate ordering and required content", () => {
  const service = {
    id: null,
    num: "01",
    sort: 0,
    title: "Websites",
    body: "What we build",
    items: ["Design"],
  };
  assert.equal(serviceSchema.safeParse(service).success, true);
  assert.equal(
    serviceSchema.safeParse({ ...service, sort: -1 }).success,
    false,
  );
  assert.equal(
    serviceSchema.safeParse({ ...service, title: "" }).success,
    false,
  );
});
const pipelineValidation = loadSource("src/lib/validation/pipeline.ts", {
  "@/lib/content/process": {
    PROCESS_STAGES: [
      "idea",
      "discovery",
      "design",
      "build",
      "test",
      "launch",
      "care",
    ].map((key) => ({ key })),
  },
});
test("pipeline items accept supported stages and reject invalid stages and empty names", () => {
  const item = {
    id: null,
    name: "New client",
    kind: "website",
    stage: "idea",
    due_note: "",
  };
  assert.equal(
    pipelineValidation.pipelineItemSchema.safeParse(item).success,
    true,
  );
  assert.equal(
    pipelineValidation.pipelineItemSchema.safeParse({
      ...item,
      stage: "unknown",
    }).success,
    false,
  );
  assert.equal(
    pipelineValidation.pipelineItemSchema.safeParse({ ...item, name: " " })
      .success,
    false,
  );
});

test("deleting content preserves images that may be reused elsewhere", async () => {
  let storageDeletes = 0;
  let deleted = false;
  const chain = {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    maybeSingle: async () => ({
      data: { slug: "shared-image-project" },
      error: null,
    }),
    delete() {
      deleted = true;
      return this;
    },
    then(resolve) {
      return Promise.resolve({ error: null }).then(resolve);
    },
  };
  const actions = loadSource("src/lib/actions/content.ts", {
    "next/cache": { updateTag() {}, revalidatePath() {} },
    "@/lib/auth": {
      requireAdmin: async () => ({
        supabase: {
          from: () => chain,
          storage: {
            from: () => ({
              remove: async () => {
                storageDeletes++;
                return { error: null };
              },
            }),
          },
        },
      }),
    },
    "@/lib/validation": loadSource("src/lib/validation/content.ts"),
  });
  await actions.deleteProject("00000000-0000-4000-8000-000000000001");
  assert.equal(deleted, true);
  assert.equal(storageDeletes, 0);
});
