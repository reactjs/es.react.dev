/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import React from 'react';

import {media} from 'theme';

import type {Node} from 'react';

/**
 * This component wraps page content sections (eg header, footer, main).
 * It provides consistent margin and max width behavior.
 */
const Container = ({
  children,
  grayscale,
}: {
  children: Node,
  grayscale: boolean,
}) => (
  <div
    css={{
      paddingLeft: 20,
      paddingRight: 20,
      marginLeft: 'auto',
      marginRight: 'auto',
<<<<<<< HEAD
      filter: grayscale ? 'grayscale(100%)' : '',
=======
>>>>>>> c9b990070fc35d31b56957263e1ea9fe2fe67b40
      [media.greaterThan('medium')]: {
        width: '90%',
      },

      [media.size('xxlarge')]: {
        maxWidth: 1260,
      },
    }}>
    {children}
  </div>
);

export default Container;
