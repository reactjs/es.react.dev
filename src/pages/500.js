/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
          <P>Lo sentimos.</P>
          <P>
            Si lo desea, por favor{' '}
            <A href="https://github.com/reactjs/es.react.dev/issues/new">
              informe el error.
            </A>
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
