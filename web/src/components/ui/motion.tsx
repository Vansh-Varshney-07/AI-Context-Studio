'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

type MotionDivProps = HTMLMotionProps<'div'> & React.HTMLAttributes<HTMLDivElement>;
type MotionSpanProps = HTMLMotionProps<'span'> & React.HTMLAttributes<HTMLSpanElement>;
type MotionSectionProps = HTMLMotionProps<'section'> & React.HTMLAttributes<HTMLElement>;
type MotionArticleProps = HTMLMotionProps<'article'> & React.HTMLAttributes<HTMLElement>;
type MotionAsideProps = HTMLMotionProps<'aside'> & React.HTMLAttributes<HTMLElement>;
type MotionHeaderProps = HTMLMotionProps<'header'> & React.HTMLAttributes<HTMLElement>;
type MotionFooterProps = HTMLMotionProps<'footer'> & React.HTMLAttributes<HTMLElement>;
type MotionMainProps = HTMLMotionProps<'main'> & React.HTMLAttributes<HTMLElement>;
type MotionNavProps = HTMLMotionProps<'nav'> & React.HTMLAttributes<HTMLElement>;
type MotionUlProps = HTMLMotionProps<'ul'> & React.HTMLAttributes<HTMLUListElement>;
type MotionOlProps = HTMLMotionProps<'ol'> & React.HTMLAttributes<HTMLOListElement>;
type MotionLiProps = HTMLMotionProps<'li'> & React.HTMLAttributes<HTMLLIElement>;
type MotionButtonProps = HTMLMotionProps<'button'> & React.ButtonHTMLAttributes<HTMLButtonElement>;
type MotionAnchorProps = HTMLMotionProps<'a'> & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type MotionImgProps = HTMLMotionProps<'img'> & React.ImgHTMLAttributes<HTMLImageElement>;
type MotionPProps = HTMLMotionProps<'p'> & React.HTMLAttributes<HTMLParagraphElement>;
type MotionH1Props = HTMLMotionProps<'h1'> & React.HTMLAttributes<HTMLHeadingElement>;
type MotionH2Props = HTMLMotionProps<'h2'> & React.HTMLAttributes<HTMLHeadingElement>;
type MotionH3Props = HTMLMotionProps<'h3'> & React.HTMLAttributes<HTMLHeadingElement>;
type MotionH4Props = HTMLMotionProps<'h4'> & React.HTMLAttributes<HTMLHeadingElement>;

export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>((props, ref) => (
  <motion.div ref={ref} {...props} />
));
MotionDiv.displayName = 'MotionDiv';

export const MotionSpan = forwardRef<HTMLSpanElement, MotionSpanProps>((props, ref) => (
  <motion.span ref={ref} {...props} />
));
MotionSpan.displayName = 'MotionSpan';

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>((props, ref) => (
  <motion.section ref={ref} {...props} />
));
MotionSection.displayName = 'MotionSection';

export const MotionArticle = forwardRef<HTMLElement, MotionArticleProps>((props, ref) => (
  <motion.article ref={ref} {...props} />
));
MotionArticle.displayName = 'MotionArticle';

export const MotionAside = forwardRef<HTMLElement, MotionAsideProps>((props, ref) => (
  <motion.aside ref={ref} {...props} />
));
MotionAside.displayName = 'MotionAside';

export const MotionHeader = forwardRef<HTMLElement, MotionHeaderProps>((props, ref) => (
  <motion.header ref={ref} {...props} />
));
MotionHeader.displayName = 'MotionHeader';

export const MotionFooter = forwardRef<HTMLElement, MotionFooterProps>((props, ref) => (
  <motion.footer ref={ref} {...props} />
));
MotionFooter.displayName = 'MotionFooter';

export const MotionMain = forwardRef<HTMLElement, MotionMainProps>((props, ref) => (
  <motion.main ref={ref} {...props} />
));
MotionMain.displayName = 'MotionMain';

export const MotionNav = forwardRef<HTMLElement, MotionNavProps>((props, ref) => (
  <motion.nav ref={ref} {...props} />
));
MotionNav.displayName = 'MotionNav';

export const MotionUl = forwardRef<HTMLUListElement, MotionUlProps>((props, ref) => (
  <motion.ul ref={ref} {...props} />
));
MotionUl.displayName = 'MotionUl';

export const MotionOl = forwardRef<HTMLOListElement, MotionOlProps>((props, ref) => (
  <motion.ol ref={ref} {...props} />
));
MotionOl.displayName = 'MotionOl';

export const MotionLi = forwardRef<HTMLLIElement, MotionLiProps>((props, ref) => (
  <motion.li ref={ref} {...props} />
));
MotionLi.displayName = 'MotionLi';

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>((props, ref) => (
  <motion.button ref={ref} {...props} />
));
MotionButton.displayName = 'MotionButton';

export const MotionAnchor = forwardRef<HTMLAnchorElement, MotionAnchorProps>((props, ref) => (
  <motion.a ref={ref} {...props} />
));
MotionAnchor.displayName = 'MotionAnchor';

export const MotionImg = forwardRef<HTMLImageElement, MotionImgProps>((props, ref) => (
  <motion.img ref={ref} {...props} />
));
MotionImg.displayName = 'MotionImg';

export const MotionP = forwardRef<HTMLParagraphElement, MotionPProps>((props, ref) => (
  <motion.p ref={ref} {...props} />
));
MotionP.displayName = 'MotionP';

export const MotionH1 = forwardRef<HTMLHeadingElement, MotionH1Props>((props, ref) => (
  <motion.h1 ref={ref} {...props} />
));
MotionH1.displayName = 'MotionH1';

export const MotionH2 = forwardRef<HTMLHeadingElement, MotionH2Props>((props, ref) => (
  <motion.h2 ref={ref} {...props} />
));
MotionH2.displayName = 'MotionH2';

export const MotionH3 = forwardRef<HTMLHeadingElement, MotionH3Props>((props, ref) => (
  <motion.h3 ref={ref} {...props} />
));
MotionH3.displayName = 'MotionH3';

export const MotionH4 = forwardRef<HTMLHeadingElement, MotionH4Props>((props, ref) => (
  <motion.h4 ref={ref} {...props} />
));
MotionH4.displayName = 'MotionH4';
