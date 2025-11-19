import { ReactNode } from "react";
import { useAppContainer } from "../contexts/app-container.context";
import { DI_TOKENS } from "@kennelo/infrastructure/di/tokens";
import { LinkComponent } from "../adapters/link.adapter";

interface AppLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
}

export function AppLink(props: AppLinkProps) {
  const container = useAppContainer();

  if (container.has(DI_TOKENS.LinkComponent)) {
    const LinkAdapter = container.resolve<LinkComponent>(DI_TOKENS.LinkComponent);
    return <LinkAdapter {...props} />;
  }

  return (
    <a href={props.href} className={props.className}>
      {props.children}
    </a>
  );
}
