<template>
  <table>
    <thead>
      <tr>
        <th>123wqe</th>
      </tr>
    </thead>
    <tbody>
      <DynamicScroller
        :items="items"
        :min-item-size="rowHeight"
        keyField="first"
        class="scroller"
        >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            tag="tr"
            :size-dependencies="[
                                item.first, item.second,
                                ]"
            :data-index="index"
            >
            <td>
              {{ item.first }}
            </td>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </tbody>
  </table>
</template>

<script>
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { convertToUnit } from '../helpers/util'

export default {
  name: 'TableOnSteroidsSample',
  components: { DynamicScroller, DynamicScrollerItem },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    chunkSize: {
      type: Number,
      default: () => 25
    },
    headerHeight: {
      type: Number,
      default: () => 48
    },
    height: {
      type: [Number, String],
      default: () => 500
    },
    rowHeight: {
      type: Number,
      default: () => 48
    }
  },
  data () {
    return {
      scrollTop: 0,
      oldChunk: 0,
      scrollDebounce: null,
      invalidateCache: false
    }
  },
  computed: {
    itemsLength () {
      return this.items.length
    },
    totalHeight () {
      return (this.itemsLength * this.rowHeight) + this.headerHeight
    },
    topIndex () {
      return Math.floor(this.scrollTop / this.rowHeight)
    },
    chunkIndex () {
      return Math.floor(this.topIndex / this.chunkSize)
    },
    startIndex () {
      return Math.max(0, (this.scrollTop / this.rowHeight) - 24)
    },
    visibleNodeCount () {
      return Math.min(this.itemsLength - this.startIndex, Math.ceil(this.height / this.rowHeight) + 2 * 24)
    },
    offsetTop () {
      return Math.max(0, this.startIndex * this.rowHeight)
    },
    stopIndex () {
      return Math.min(this.startIndex + this.visibleNodeCount, this.itemsLength)
    },
    offsetBottom () {
      return Math.max(0, (this.itemsLength - this.stopIndex) * this.rowHeight)
    }
  },
  watch: {
    chunkIndex (newValue, oldValue) {
      this.oldChunk = oldValue
    },
    items () {
      this.cachedItems = null
      this.$refs.table.scrollTop = 0
    }
  },
  // created () {
  //   this.cachedItems = null
  // },
  // mounted () {
  //   this.scrollDebounce = debounce(this.onScroll, 50)
  //   this.$refs.table.addEventListener('scroll', this.scrollDebounce, { passive: true })
  // },
  // beforeUnmount () {
  //   this.$refs.table.removeEventListener('scroll', this.scrollDebounce)
  // },
  methods: {
    genHeader () {
      return this.$createElement('thead', [
        this.$createElement('tr',
          this.headers.map((el) => {
            return this.$createElement('th', { style: this.createStyleHeight(this.headerHeight) }, [el.text])
          })
        )
      ])
    },
    genBody () {
      this.cachedItems = this.genItems()

      return this.$createElement('tbody',
        {
          staticClass: 'tos-virtual-table__table',
          style: { 'will-change': 'transform', transform: `translateY(${this.offsetTop})` }
        },
        [
          // this.$createElement('tr', { style: this.createStyleHeight(this.offsetTop) }),
          this.cachedItems
          // this.$createElement('tr', { style: this.createStyleHeight(this.offsetBottom) })
        ]
      )
    },
    genItems () {
      const items = this.items.slice(this.startIndex, this.stopIndex)
      return items.map((item) => {
        return this.$createElement('tr',
          this.headers.map((el) => {
            return this.$createElement('td', { style: this.createStyleHeight(this.rowHeight) }, [item[el.value]])
          })
        )
      })
    },
    createStyleHeight (height) {
      return {
        height: `${height}px`
      }
    },
    onScroll (e) {
      const target = e.target
      this.scrollTop = target.scrollTop
      console.log(e.target)
    },
    genTable () {
      return this.$createElement('div', {
      }, [
        this.$createElement('table',
          {
            staticClass: 'tos-virtual-table',
            style: {
              height: convertToUnit(this.height)
            },
            ref: 'table'
          },
          [this.genHeader(), this.genBody(this.items)])
      ])
    }
  },
  render (h) {
    return h('div', {
    }, [
      this.$slots.top,
      this.genTable(),
      this.$slots.bottom
    ])
  }
}
</script>
<style scoped lang="sass">
@import '../../node_modules/vue-virtual-scroller/dist/vue-virtual-scroller.css'
.scroller
  height: 300px
  width: 300px
table
  border-spacing: 0
td, th
  padding: 0
.tos-virtual-table
  overflow-y: auto
.tos-virtual-table__table
  position: relative
  overflow: hidden
  will-change: transform

</style>
