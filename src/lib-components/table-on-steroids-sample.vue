<script>
import { convertToUnit } from '../helpers/util'

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
      invalidateCache: false,
      start: 0,
      timeout: null,
      perPage: 25
    }
  },
  computed: {
    itemsLength () {
      return this.items.length
    },
    startHeight () {
      return this.start * this.rowHeight - this.headerHeight
    },
    endHeight () {
      return this.rowHeight * (this.itemsLength - this.start - this.perPage)
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
      return Math.max(0, this.startIndex * this.rowHeight - this.rowHeight)
    },
    stopIndex () {
      return Math.min(this.startIndex + (this.chunkSize * 3), this.itemsLength)
    },
    offsetBottom () {
      return Math.max(0, this.totalHeight - this.rowHeight - this.offsetTop - this.rowHeight * this.chunkSize * 3)
    },
    genItems () {
      const items = this.items.slice(this.start, this.perPage + this.start)
      return items.map((item) => {
        return this.$createElement('tr',
          this.headers.map((el) => {
            return this.$createElement('td', { style: { height: `${this.rowHeight}px` } }, [item[el.value]])
          })
        )
      })
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
    // this.scrollDebounce = debounce(this.onScroll, 300)
    this.$refs.table.addEventListener('scroll', this.onScroll, { passive: true })
  },
  beforeUnmount () {
    this.$refs.table.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    genHeader () {
      return this.$createElement('thead', [
        this.$createElement('tr',
          this.headers.map((el) => {
            return this.$createElement('th', { style: { height: `${this.rowHeight}px` } }, [el.text])
          })
        )
      ])
    },
    genBody () {
      console.log(this.itemsLength, this.totalHeight, this.topIndex, this.chunkIndex, this.startIndex, this.offsetTop, this.stopIndex, this.offsetBottom, 'test')
      console.log(this.scrollTop, 'test')

      return this.$createElement('tbody', [
        this.$createElement('tr', [this.$createElement('td', { colspan: this.headers.length, style: this.createStyleHeight(this.startHeight) })]),
        this.genItems,
        this.$createElement('tr', [this.$createElement('td', { colspan: this.headers.length, style: this.createStyleHeight(this.endHeight) })])
      ])
    },
    createStyleHeight (height) {
      return {
        paddingTop: `${height}px`
      }
    },
    onScroll (e) {
      // const target = e.target
      // this.scrollTop = target.scrollTop
      console.log('test')
      this.timeout && clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        const { scrollTop } = e.target
        const rows = Math.ceil(scrollTop / this.rowHeight)

        this.start = rows + this.perPage > this.items.length
          ? this.items.length - this.perPage
          : rows

        this.$nextTick(() => {
          e.target.scrollTop = scrollTop
        })
      }, 20)
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
