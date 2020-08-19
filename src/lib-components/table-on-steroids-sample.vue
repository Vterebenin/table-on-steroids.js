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
      default: () => 10
    },
    headerHeight: {
      type: Number,
      default: () => 20
    },
    height: {
      type: [Number, String],
      default: () => 500
    },
    rowHeight: {
      type: Number,
      default: () => 20
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
      return Math.max(0, (this.itemsLength - this.stopIndex - this.startIndex) * this.rowHeight)
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
            return this.$createElement('th', [el.text])
          })
        )
      ])
    },
    genBody () {
      if (this.cachedItems === null || this.chunkIndex !== this.oldChunk) {
        this.cachedItems = this.genItems()
        this.oldChunk = this.chunkIndex
      }
      console.log(this.startIndex, this.stopIndex)
      console.log((this.chunkIndex * this.chunkSize) - this.chunkSize)

      console.log(this.offsetTop, this.offsetBottom)
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
            return this.$createElement('td', [item[el.value]])
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
      console.log('test')
      this.scrollTop = target.scrollTop
    }
  },
  render (h) {
    return h('div', {
      ref: 'table',
      staticClass: 'tos-table',
      style: {
        height: convertToUnit(this.height)
      }
    }, [
      this.$slots.top,
      this.$createElement('table', [this.genHeader(), this.genBody(this.items)]),
      this.$slots.bottom
    ])
  }
}
</script>
<style scoped lang="sass">
.tos-table
  overflow-y: scroll
  width: 800px
</style>
