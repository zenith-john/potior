<script lang="ts">
export default {
  data() {
    return {
      text: '',
      words: [] as string[],
      word_data: '',
    }
  },
  mounted() {
    fetch('word_data.txt').then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    }).then(data => {
      this.word_data = data;
      console.log("Word data loaded!");
    });
  },
  computed: {

  },
  methods: {
    parse(text: string) {
      let reg = /{[\s]*([a-z_*]*[0-4]?)([\s]+[\d]+)?[\s]*}/g;
      let matches = text.matchAll(reg);
      let newReg = '';
      let pronouciation = '';
      let numbers = '';
      newReg += '^(';
      for (let match of matches) {
        newReg += '.';
        pronouciation += this.convertPronouce(match[1]);
        numbers += ' ' + this.convertNumber(match[2]);
      }
      newReg += ') ' + pronouciation + numbers;
      return newReg;
    },
    convertPronouce(text: string) {
      let ret = text;
      if (ret != "" && !ret[text.length - 1].match(/[0-4]/)) {
        ret += '[0-4]';
      }
      ret = ret.replace(/\*/g, ".*");
      ret = ret.replace(/_/g, ".");
      return ret;
    },
    convertNumber(text: string) {
      if (text == null || text.match(/[\s]+$/) != null) {
        return "[\\d]+";
      }
      else {
        let num = text.match(/[\d]+/);
        if (num == null)
          return "";
        else return num[0];
      }
    },
    searchWords() {
      let regex = new RegExp(this.parse(this.text), 'gm');
      let matches = this.word_data.matchAll(regex);
      let ret: string[] = [];
      let count = 0;
      let shown: { [key: string]: boolean } = {};
      for (let match of matches) {
        if (!(match[1] in shown)) {
          ret.push(match[1]);
          shown[match[1]] = true;
          count++;
          if (count > 100) break;
        }
      }
      this.words = ret;
    }
  }
}
</script>

<template>
  <div>
    Nutri for Chinese words (Version 0.1):
    <label for="text">
      <input v-model="text" />
    </label>
    <button @click="searchWords">search</button>
  </div>
  <div>
    <ul>
      <li v-for="word in words">{{ word }}</li>
    </ul>
  </div>
  <div>
    Rules:
    <ul>
      <li>Every character should be embraced by {}.</li>
      <li>The general pronouciation is given by pinyin but the tone is given by number (0 for light tone). For example,
        “课” = ke4. You can use
        * to represent arbitrary number of characters and _ to represent one character.</li>
      <li>The possible second field in braces suggest the strokes number of character.</li>
      <li>Only first 100 results are shown</li>
    </ul>
    Examples:
    <ul>
      <li>{hun} {mi} => 昏迷</li>
      <li>{yin} {d*4} => 印度 ...</li>
      <li>{* 10} {* 12} {* 9} => 莫斯科 ...</li>
    </ul>
  </div>
  <div>
    Acknowledgements:
    <ul>
      <li>The Chinese character data (pronouciation and strokes) are from <a
          href="https://github.com/mapull/chinese-dictionary/">https://github.com/mapull/chinese-dictionary/</a>. (With
        some mistakes fixed)
      </li>
      <li>The currently used word data are from <a
          href="https://github.com/rime/rime-pinyin-simp/blob/master/pinyin_simp.dict.yaml">https://github.com/rime/rime-pinyin-simp/blob/master/pinyin_simp.dict.yaml</a>
        containing 65120 words.
      </li>
    </ul>
  </div>
</template>

<style></style>
