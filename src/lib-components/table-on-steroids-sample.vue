<script>
import { convertToUnit, debounce } from '../helpers/util'

export default {
  name: 'TableOnSteroidsSample',
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
      return Math.max(0, (this.chunkIndex * this.chunkSize) - this.chunkSize)
    },
    offsetTop () {
      return Math.max(0, this.startIndex * this.rowHeight)
    },
    stopIndex () {
      return Math.min(this.startIndex + (this.chunkSize * 3), this.itemsLength)
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
  created () {
    this.cachedItems = null
  },
  mounted () {
    this.scrollDebounce = debounce(this.onScroll, 50)
    this.$refs.table.addEventListener('scroll', this.scrollDebounce, { passive: true })
  },
  beforeUnmount () {
    this.$refs.table.removeEventListener('scroll', this.scrollDebounce)
  },
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
      if (this.cachedItems === null || this.chunkIndex !== this.oldChunk) {
        this.cachedItems = this.genItems()
        this.oldChunk = this.chunkIndex
      }
      console.log(this.itemsLength, this.totalHeight, this.topIndex, this.chunkIndex, this.startIndex, this.offsetTop, this.stopIndex, this.offsetBottom, 'test')
      console.log(this.scrollTop, 'test')

      return this.$createElement('tbody', [
        this.$createElement('tr', { style: this.createStyleHeight(this.offsetTop) }),
        this.cachedItems,
        this.$createElement('tr', { style: this.createStyleHeight(this.offsetBottom) })
      ])
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
    },
    genTable () {
      return this.$createElement('div', {
        staticClass: 'tos-virtual-table__table',
        ref: 'table'
      }, [
        this.$createElement('table', [this.genHeader(), this.genBody(this.items)])
      ])
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'tos-virtual-table',
      style: {
        height: convertToUnit(this.height)
      }
    }, [
      this.$slots.top,
      this.genTable(),
      this.$slots.bottom
    ])
  }
}
</script>
<style scoped lang="sass">
table
  border-spacing: 0
  td, th
    padding: 0
.tos-virtual-table
  position: relative
  overflow-y: auto
  display: flex
  .tos-virtual-table__table
    width: 50%
    height: 100%
    overflow-x: auto

</style>
