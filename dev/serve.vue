<template>
  <div id="app">
    <table-on-steroids-sample
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
      items: [
        {
          first: 'Значение под заголовком 1 1',
          second: 'Значение под заголовком 2 1'
        },
        {
          first: 'Значение под заголовком 1 2',
          second: 'Значение под заголовком 2 2'
        }
      ]
    }
  }
})
</script>
