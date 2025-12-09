import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from "@docusaurus/plugin-content-docs";
import type { Props } from "@theme/DocCard";

import Link from "@docusaurus/Link";
import {
  findFirstSidebarItemLink,
  useDocById,
} from "@docusaurus/plugin-content-docs/client";
import { usePluralForm } from "@docusaurus/theme-common";
// import isInternalUrl from "@docusaurus/isInternalUrl";
import { translate } from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import clsx from "clsx";
import React, { type ReactNode } from "react";

import styles from "./styles.module.css";

export default function DocCard({ item }: Props): ReactNode {
  switch (item.type) {
    case "category":
      return <CardCategory item={item} />;
    case "link":
      return <CardLink item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}

function CardCategory({ item }: { item: PropSidebarItemCategory }): ReactNode {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();

  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }

  return (
    <CardLayout
      className={item.className}
      description={item.description ?? categoryItemsPlural(item.items.length)}
      href={href}
      icon=""
      title={item.label}
    />
  );
}

function CardContainer({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}): ReactNode {
  return (
    <Link
      className={clsx("card padding--lg", styles.cardContainer, className)}
      href={href}
    >
      {children}
    </Link>
  );
}

function CardLayout({
  className,
  description,
  href,
  icon,
  title,
}: {
  className?: string;
  description?: string;
  href: string;
  icon: ReactNode;
  title: string;
}): ReactNode {
  return (
    <CardContainer className={className} href={href}>
      <Heading
        as="h2"
        className={clsx("text--truncate", styles.cardTitle)}
        title={title}
      >
        {icon} {title}
      </Heading>
      {description && (
        <p className={clsx("line-clamp-3 text-sm/6")} title={description}>
          {description}
        </p>
      )}
    </CardContainer>
  );
}

function CardLink({ item }: { item: PropSidebarItemLink }): ReactNode {
  // const icon = isInternalUrl(item.href) ? "📄️" : "🔗";
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      className={item.className}
      description={item.description ?? doc?.description}
      href={item.href}
      icon=""
      title={item.label}
    />
  );
}

function useCategoryItemsPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          description:
            "The default description for a category card in the generated index about how many items this category includes",
          id: "theme.docs.DocCard.categoryDescription.plurals",
          message: "1 item|{count} items",
        },
        { count },
      ),
    );
}
