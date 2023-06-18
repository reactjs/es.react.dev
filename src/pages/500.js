/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page
      toc={[]}
      routeTree={sidebarLearn}
      meta={{title: 'Something Went Wrong'}}>
      <MaxWidth>
        <Intro>
          <P>Algo salió muy mal.</P>
          <P>Lo siento.</P>
          <P>
            Si lo desea, por favor{' '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              informe del error.
            </A>
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
