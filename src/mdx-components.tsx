import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="case-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="case-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="case-h3">{children}</h3>,
    p: ({ children }) => <p className="case-p">{children}</p>,
    ul: ({ children }) => <ul className="case-ul">{children}</ul>,
    ol: ({ children }) => <ol className="case-ol">{children}</ol>,
    li: ({ children }) => <li className="case-li">{children}</li>,
    a: ({ href, children }) => (
      <Link href={href ?? '#'} className="case-a">
        {children}
      </Link>
    ),
    ...components,
  };
}
