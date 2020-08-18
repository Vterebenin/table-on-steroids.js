<script>
import Vue from 'vue';
import { TableOnSteroidsSample } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    TableOnSteroidsSample,
  }
});
</script>

<template>
  <div id="app">
    <table-on-steroids-sample />
  </div>
</template>
