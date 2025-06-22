import DefaultTheme from 'vitepress/theme'
import ESCalcLiteGraph from '../../components/escalc-lite-graph.vue'
import 'virtual:group-icons.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ESCalcLiteGraph', ESCalcLiteGraph)
  },
}
