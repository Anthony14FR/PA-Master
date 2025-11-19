import { ReactNode } from "react";

export interface LinkComponentProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
}

export type LinkComponent = (props: LinkComponentProps) => JSX.Element;
