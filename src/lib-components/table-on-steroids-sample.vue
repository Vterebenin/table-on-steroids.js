<template>
  <div class="TOS">
    <table>
      <slot
        name="head"
        :headers="headers"
        >
        <tr>
          <th
            v-for="(h, idx) in headers"
            :key="idx"
            >
            {{ h.text }}
          </th>
        </tr>
      </slot>
      <slot
        name="body"
        :items="items"
        :headers="headers"
        >
        <tr
          v-for="(item, index) in items"
          :key="index"
          >
          <td
            v-for="({ value }, idx) in headers"
            :key="idx"
            >
            {{ item[value] }}
          </td>
        </tr>
      </slot>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TableOnSteroidsSample', // vue component name
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      counter: 5,
      initCounter: 5,
      message: {
        action: null,
        amount: null
      }
    }
  },
  computed: {
    changedBy () {
      const { message } = this
      if (!message.action) return 'initialized'
      return `${message?.action} ${message.amount ?? ''}`.trim()
    }
  },
  methods: {
    increment (arg) {
      const amount = (typeof arg !== 'number') ? 1 : arg
      this.counter += amount
      this.message.action = 'incremented by'
      this.message.amount = amount
    },
    decrement (arg) {
      const amount = (typeof arg !== 'number') ? 1 : arg
      this.counter -= amount
      this.message.action = 'decremented by'
      this.message.amount = amount
    },
    reset () {
      this.counter = this.initCounter
      this.message.action = 'reset'
      this.message.amount = null
    }
  }
}
</script>

<style scoped>
.table-on-steroids-sample {
  display: block;
  width: 400px;
  margin: 25px auto;
  border: 1px solid #ccc;
  background: #eaeaea;
  text-align: center;
  padding: 25px;
}
.table-on-steroids-sample p {
  margin: 0 0 1em;
}
</style>
