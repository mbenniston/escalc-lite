<script setup>
import { computed, ref, useId } from 'vue'
import { VueMermaidRender } from 'vue-mermaid-render'
import VueZoomable from 'vue-zoomable'
import { ESCalcLite } from '../../src'
import { formatAsMermaid } from './format-as-mermaid'
import 'vue-zoomable/dist/style.css'

const graphId = useId()
const text = ref('2 - 4')
const graphCode = computed(() => {
  try {
    return formatAsMermaid(ESCalcLite.parse(text.value))
  } catch {
    return null
  }
})
const result = computed(() => {
  try {
    return ESCalcLite.evaluate(text.value)
  } catch {
    return null
  }
})
</script>

<template>
  <div class="demo">
    <div>
      <label> Expression </label>
      <br />
      <textarea
        v-model="text"
        aria-label="Expression"
        class="expression"
        placeholder="e.g. 1-2"
      />
    </div>
    <div>
      <label> Graph </label>
      <br />
      <VueZoomable
        style="width: 100%; height: 500px; border: 1px solid black"
        :selector="`#${graphId}`"
        :enable-control-button="false"
        :max-zoom="Infinity"
      >
        <VueMermaidRender
          v-show="graphCode !== null"
          :id="graphId"
          :content="graphCode"
          :config="{ maxTextSize: Infinity }"
        />
        <div v-show="graphCode === null">Failed to generate graph</div>
      </VueZoomable>
    </div>

    <div>
      <label> Output </label>
      <br />
      <div>{{ result }}</div>
    </div>
  </div>
</template>

<style>
.demo {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 12px;
}

label {
  font-size: 14px;
}

.expression {
  flex-grow: 1;
  resize: none;
}
</style>
