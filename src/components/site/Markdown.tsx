import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="max-w-[68ch] text-[18px] leading-[30px] [&_a]:underline [&_blockquote]:border-0 [&_blockquote]:italic [&_blockquote]:text-[22px] [&_blockquote]:leading-9 [&_blockquote]:my-[30px] [&_blockquote]:pl-5 [&_h2]:mt-10 [&_h2]:mb-[15px] [&_h2]:text-[30px] [&_h2]:leading-9 [&_h3]:mt-[30px] [&_h3]:mb-2.5 [&_h3]:text-[22px] [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_table]:my-5 [&_td]:pr-5 [&_ul]:list-disc [&_ul]:pl-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
