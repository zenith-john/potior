<script lang="ts">
export default {
  data() {
    return {
      code: '',
    }
  },
  mounted() { },
  computed: {

  },
  methods: {
    decode(code: string) {
      let codes = code.split(" ");
      let ret = "";
      for (var i in codes) {
        if (codes[i] != '') {
          ret += this.hexToChar(codes[i]);
        }
      }
      if (ret == '') return "\n"
      else return ret;
    },
    hexToChar(code: string) {
      let num = parseInt(code, 16);
      return String.fromCharCode(num);
    }
  }
}
</script>

<template>
  <label for="code">
    Enter Unicode separated by space:
    <input v-model="code" placeholder="Enter the code." />
  </label>
  <div>
    <pre>{{ decode(code) }}</pre>
  </div>
  <div> For example: 6807 51C6 => 标准</div>
</template>

<style></style>
