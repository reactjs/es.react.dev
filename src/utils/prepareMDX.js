/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Children} from 'react';

// TODO: Esta lógica podría estar en plugins MDX en lugar de esto.

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const PREPARE_MDX_CACHE_BREAKER = 2;
// !!! IMPORTANTE !!! Revisa esto si cambias alguna lógica.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export function prepareMDX(rawChildren) {
  const toc = getTableOfContents(rawChildren, /* depth */ 10);
  const children = wrapChildrenInMaxWidthContainers(rawChildren);
  return {toc, children};
}

function wrapChildrenInMaxWidthContainers(children) {
  // Auto-envuelve todo excepto unos pocos tipos dentro
  // de envolturas <MaxWidth>. Sigue reusando la misma
  // envoltura tanto como pueda hasta que encontremos
  // una sección full-width que la interrumpa.
  let fullWidthTypes = [
    'Sandpack',
    'FullWidth',
    'Illustration',
    'IllustrationBlock',
    'Challenges',
    'Recipes',
  ];
  let wrapQueue = [];
  let finalChildren = [];
  function flushWrapper(key) {
    if (wrapQueue.length > 0) {
      const Wrapper = 'MaxWidth';
      finalChildren.push(<Wrapper key={key}>{wrapQueue}</Wrapper>);
      wrapQueue = [];
    }
  }
  function handleChild(child, key) {
    if (child == null) {
      return;
    }
    if (typeof child !== 'object') {
      wrapQueue.push(child);
      return;
    }
    if (fullWidthTypes.includes(child.type)) {
      flushWrapper(key);
      finalChildren.push(child);
    } else {
      wrapQueue.push(child);
    }
  }
  Children.forEach(children, handleChild);
  flushWrapper('last');
  return finalChildren;
}

function getTableOfContents(children, depth) {
  const anchors = [];
  extractHeaders(children, depth, anchors);
  if (anchors.length > 0) {
    anchors.unshift({
      url: '#',
      text: 'Overview',
      depth: 2,
    });
  }
  return anchors;
}

const headerTypes = new Set([
  'h1',
  'h2',
  'h3',
  'Challenges',
  'Recap',
  'TeamMember',
]);
function extractHeaders(children, depth, out) {
  for (const child of Children.toArray(children)) {
    if (child.type && headerTypes.has(child.type)) {
      let header;
      if (child.type === 'Challenges') {
        header = {
          url: '#challenges',
          depth: 2,
          text: 'Challenges',
        };
      } else if (child.type === 'Recap') {
        header = {
          url: '#recap',
          depth: 2,
          text: 'Recap',
        };
      } else if (child.type === 'TeamMember') {
        header = {
          url: '#' + child.props.permalink,
          depth: 3,
          text: child.props.name,
        };
      } else {
        header = {
          url: '#' + child.props.id,
          depth: (child.type && parseInt(child.type.replace('h', ''), 0)) ?? 0,
          text: child.props.children,
        };
      }
      out.push(header);
    } else if (child.children && depth > 0) {
      extractHeaders(child.children, depth - 1, out);
    }
  }
}
