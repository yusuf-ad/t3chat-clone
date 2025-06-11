"use client";

import { cn } from "@/lib/utils";
import { marked } from "marked";
import type * as React from "react";
import {
  Suspense,
  isValidElement,
  memo,
  useMemo,
  useEffect,
  useState,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const DEFAULT_PRE_BLOCK_CLASS =
  "my-4 overflow-x-auto w-fit rounded-xl bg-zinc-950 text-zinc-50 dark:bg-zinc-900 border border-border p-4";

interface ReactElementWithChildren extends React.ReactElement {
  props: {
    children?: React.ReactNode;
    [key: string]: unknown;
  };
}

const extractTextContent = (node: React.ReactNode): string => {
  if (typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join("");
  }
  if (isValidElement(node)) {
    const element = node as ReactElementWithChildren;
    return extractTextContent(element.props.children);
  }
  return "";
};

interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
  language: string;
}

const kebabToCamelCase = (str: string) => {
  return str.replace(/-([a-z])/g, (g) => g[1]!.toUpperCase());
};

const VALID_STYLE_PROPERTIES = new Set([
  "color",
  "backgroundColor",
  "fontStyle",
  "fontWeight",
  "textDecoration",
  "opacity",
  "textDecorationColor",
  "textDecorationStyle",
  "textDecorationLine",
  "textDecorationThickness",
  "textUnderlineOffset",
  "textUnderlinePosition",
  "textShadow",
  "fontFamily",
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "wordSpacing",
  "textTransform",
  "textAlign",
  "textIndent",
  "textOverflow",
  "whiteSpace",
  "wordBreak",
  "wordWrap",
  "overflowWrap",
  "writingMode",
  "textOrientation",
  "textRendering",
  "textEmphasis",
  "textEmphasisColor",
  "textEmphasisStyle",
  "textEmphasisPosition",
  "textSpacing",
  "textJustify",
  "textAlignLast",
  "textCombineUpright",
  "textSizeAdjust",
  "textShadow",
  "textStroke",
  "textStrokeWidth",
  "textStrokeColor",
]);

const convertStylesToCamelCase = (styles: Record<string, string>) => {
  const camelCaseStyles: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    const camelKey = kebabToCamelCase(key);
    // Only include valid CSS properties
    if (VALID_STYLE_PROPERTIES.has(camelKey)) {
      camelCaseStyles[camelKey] = value;
    }
  }
  return camelCaseStyles;
};

const HighlightedPre = memo(
  ({ children, className, language, ...props }: HighlightedPreProps) => {
    const [tokens, setTokens] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const code = extractTextContent(children);

    useEffect(() => {
      let mounted = true;

      const highlightCode = async () => {
        try {
          const { codeToTokens, bundledLanguages } = await import("shiki");

          if (!(language in bundledLanguages)) {
            if (mounted) {
              setIsLoading(false);
            }
            return;
          }

          const { tokens } = await codeToTokens(code, {
            lang: language as keyof typeof bundledLanguages,
            themes: {
              light: "github-dark",
              dark: "github-dark",
            },
          });

          if (mounted) {
            setTokens(tokens);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error highlighting code:", error);
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

      highlightCode();

      return () => {
        mounted = false;
      };
    }, [code, language]);

    if (isLoading) {
      return (
        <pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
          <code className="whitespace-pre-wrap">{children}</code>
        </pre>
      );
    }

    if (!tokens) {
      return (
        <pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
          <code className="whitespace-pre-wrap">{children}</code>
        </pre>
      );
    }

    return (
      <pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
        <code className="whitespace-pre-wrap">
          {tokens.map((line, lineIndex) => (
            <span key={`line-${lineIndex}`}>
              {line.map((token: any, tokenIndex: number) => {
                const style = token.htmlStyle
                  ? typeof token.htmlStyle === "string"
                    ? undefined
                    : convertStylesToCamelCase(token.htmlStyle)
                  : undefined;

                return (
                  <span key={`token-${tokenIndex}`} style={style}>
                    {token.content}
                  </span>
                );
              })}
              {lineIndex !== tokens.length - 1 && "\n"}
            </span>
          ))}
        </code>
      </pre>
    );
  },
);

HighlightedPre.displayName = "HighlightedPre";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  language: string;
}

const CodeBlock = ({
  children,
  language,
  className,
  ...props
}: CodeBlockProps) => {
  return (
    <Suspense
      fallback={
        <pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
          <code className="whitespace-pre-wrap">{children}</code>
        </pre>
      }
    >
      <HighlightedPre language={language} {...props}>
        {children}
      </HighlightedPre>
    </Suspense>
  );
};

CodeBlock.displayName = "CodeBlock";

const components: Partial<Components> = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-2 scroll-m-20 text-4xl font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-8 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-4 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="mt-4 scroll-m-20 text-lg font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className="mt-4 scroll-m-20 text-lg font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className="mt-4 scroll-m-20 text-base font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h6>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-6 [&:not(:first-child)]:mt-4" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <span className="font-semibold" {...props}>
      {children}
    </span>
  ),
  a: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-medium underline underline-offset-4"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 ml-6 list-decimal" {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 ml-6 list-disc" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="mt-2" {...props}>
      {children}
    </li>
  ),
  blockquote: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mt-4 border-l-2 pl-6 italic" {...props}>
      {children}
    </blockquote>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className="relative w-full overflow-hidden border-none text-sm"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="last:border-b-none m-0 border-b" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  ),
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/a11y/useAltText: alt is not required
    <img className="rounded-md" alt={alt} {...props} />
  ),
  code: ({ children, node, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
      return (
        <CodeBlock language={match[1]} className={className} {...props}>
          {children}
        </CodeBlock>
      );
    }
    return (
      <code
        className={cn(
          "bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-sm",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
  if (!markdown) {
    return [];
  }
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

interface MarkdownBlockProps {
  content: string;
  className?: string;
}

const MemoizedMarkdownBlock = memo(
  ({ content, className }: MarkdownBlockProps) => {
    return (
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) {
      return false;
    }
    return true;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

interface MarkdownContentProps {
  content: string;
  id: string;
  className?: string;
}

export const MarkdownContent = memo(
  ({ content, id, className }: MarkdownContentProps) => {
    const blocks = useMemo(
      () => parseMarkdownIntoBlocks(content || ""),
      [content],
    );

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock
        content={block}
        className={className}
        key={`${id}-block_${
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          index
        }`}
      />
    ));
  },
);

MarkdownContent.displayName = "MarkdownContent";
