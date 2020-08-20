<template>
  <div id="app">
    <table-on-steroids-sample
      :height="53*10"
      :headers="headers"
      :items="items"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { TableOnSteroidsSample } from '@/entry'

export default Vue.extend({
  name: 'ServeDev',
  components: {
    TableOnSteroidsSample
  },
  data () {
    return {
      headers: [
        {
          text: 'Заголовок 1',
          value: 'first'
        },
        {
          text: 'Заголовок 2',
          value: 'second'
        }
      ],
      items: []
    }
  },
  created () {
    for (let i = 0; i < 1000; i++) {
      this.items.push({
        first: `Значение под заголовком 1 ${i}`,
        second: `Значение под заголовком 2 ${i}`
      })
    }
  }
})
</script>
