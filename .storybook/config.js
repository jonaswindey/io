import { configure } from '@kadira/storybook'

function loadStories() {
  require('../lib/components/stories/test')
}

configure(loadStories, module)
