<script lang="ts">

export default {
  data() {
    return {
      unicode: '',
      chars: '',
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
    },
    codify(chars: string) {
      let ret = "";
      for (var i = 0; i < chars.length; i++) {
        if (i != 0) {
          ret = ret + " ";
        }
        ret += chars.charCodeAt(i).toString(16);
      }
      return ret;
    },
    update_unicode(event: Event) {
      if (event.target !== null) {
        this.unicode = (event.target as HTMLInputElement).value;
      }
      this.chars = this.decode(this.unicode);
    },
    update_chars(event: Event) {
      if (event.target !== null) {
        this.chars = (event.target as HTMLInputElement).value;
      }
      this.unicode = this.codify(this.chars);
    }
  }
}
</script>

<template>
  <div>
    <label for="unicode">
      Unicode separated by space:
      <input v-bind:value="unicode" @input="event => update_unicode(event)" />
    </label>
  </div>
  <div>
    <label for="chars">
      Characters:
      <input v-bind:value="chars" @input="event => update_chars(event)" />
    </label>
  </div>
  <div> For example: 6807 51C6 <=> 标准</div>
</template>

<style></style>
