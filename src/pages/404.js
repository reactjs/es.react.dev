/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Not Found'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>Esta página no existe.</P>
          <P>
            Si esto es un error{', '}
            <A href="https://github.com/reactjs/es.react.dev/issues/new">
              háganoslo saber
            </A>
            {', '}
            ¡e intentaremos solucionarlo!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
