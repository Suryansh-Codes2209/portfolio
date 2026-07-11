// @ts-nocheck
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Callout } from "./blog/callout";
import { Pre } from "./blog/copy-code";

function clsx(...args: any) {
	return args.filter(Boolean).join(" ");
}
const components = {
	h1: ({ className, ...props }) => (
		<h1
			className={clsx(
				"mt-2 scroll-m-20 text-4xl font-display tracking-tight text-fg",
				className,
			)}
			{...props}
		/>
	),
	h2: ({ className, ...props }) => (
		<h2
			className={clsx(
				"mt-10 scroll-m-20 border-b border-line pb-2 text-2xl sm:text-3xl font-display tracking-tight text-fg first:mt-0",
				className,
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }) => (
		<h3
			className={clsx(
				"mt-8 scroll-m-20 text-xl sm:text-2xl font-display tracking-tight text-fg",
				className,
			)}
			{...props}
		/>
	),
	h4: ({ className, ...props }) => (
		<h4
			className={clsx(
				"mt-8 scroll-m-20 text-lg font-display tracking-tight text-fg",
				className,
			)}
			{...props}
		/>
	),
	h5: ({ className, ...props }) => (
		<h5
			className={clsx(
				"mt-8 scroll-m-20 text-base font-semibold tracking-tight text-fg",
				className,
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }) => (
		<h6
			className={clsx(
				"mt-8 scroll-m-20 text-sm font-semibold tracking-tight text-fg",
				className,
			)}
			{...props}
		/>
	),
	a: ({ className, ...props }) => (
		<Link
			className={clsx(
				"font-medium text-accent-text underline underline-offset-4 transition-opacity hover:opacity-80",
				className,
			)}
			{...props}
		/>
	),
	p: ({ className, ...props }) => (
		<p
			className={clsx(
				"text-[1.05rem] leading-[1.8] text-fg-muted [&:not(:first-child)]:mt-6",
				className,
			)}
			{...props}
		/>
	),
	ul: ({ className, ...props }) => (
		<ul className={clsx("my-6 ml-6 list-disc text-fg-muted", className)} {...props} />
	),
	ol: ({ className, ...props }) => (
		<ol className={clsx("my-6 ml-6 list-decimal text-fg-muted", className)} {...props} />
	),
	li: ({ className, ...props }) => (
		<li className={clsx("mt-2", className)} {...props} />
	),
	strong: ({ className, ...props }) => (
		<strong className={clsx("font-semibold text-fg", className)} {...props} />
	),
	blockquote: ({ className, ...props }) => (
		<blockquote
			className={clsx(
				"mt-6 border-l-2 border-accent pl-6 italic text-fg-muted [&>*]:text-fg-muted",
				className,
			)}
			{...props}
		/>
	),
	img: ({
		className,
		alt,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement>) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={clsx("rounded-md border border-line", className)}
			alt={alt}
			{...props}
		/>
	),
	hr: ({ ...props }) => (
		<hr className="my-4 border-line md:my-8" {...props} />
	),
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="w-full my-6 overflow-y-auto">
			<table className={clsx("w-full", className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr
			className={clsx(
				"m-0 border-t border-line p-0 even:bg-surface-2",
				className,
			)}
			{...props}
		/>
	),
	th: ({ className, ...props }) => (
		<th
			className={clsx(
				"border border-line px-4 py-2 text-left font-bold text-fg [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }) => (
		<td
			className={clsx(
				"border border-line px-4 py-2 text-left text-fg-muted [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	pre: Pre,
	code: ({ className, ...props }) => (
		<code className={clsx("font-mono", className)} {...props} />
	),
	Image,
	Callout,
};

interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	const Component = useMDXComponent(code);

	return (
		<div className="mdx">
			<Component components={components} />
		</div>
	);
}
