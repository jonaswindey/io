// components/stories/button.js

import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Electrical from '../inquiries/complementary/Electrical'

storiesOf('core.Electrical', module)
  .add('login', () => (
    <Electrical onclick={() => action('clicked')} />
  ))
