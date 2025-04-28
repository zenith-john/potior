<script lang="ts">

function replaceAt(str: string, index: number, replacement: string) {
  if (index >= str.length || index < 0) {
    return str; // Return the original string if the index is out of bounds
  }
  return str.substring(0, index) + replacement + str.substring(index + 1);
}

type CharConstrain = {
  pronounce: RegExp | null;
  strokes: number | null;
}

type CharRule = string | CharConstrain;

export default {
  data() {
    return {
      text: '',
      words: [] as string[],
      word_data: [] as string[],
      rules: [] as CharRule[],
      dict: {} as { [key: string]: { [key: string]: any } },
      count: 1,
    }
  },
  mounted() {
    fetch('word_data.txt').then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    }).then(data => {
      this.word_data = data.split(/\s/);
      console.log("Word data loaded!");
    });

    fetch('char.json').then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    }).then(data => {
      let dat = JSON.parse(data);
      for (let i in dat) {
        for (let j in dat[i].pinyin) {
          dat[i].pinyin[j] = this.convertPronouceChar(dat[i].pinyin[j]);
        }
        this.dict[dat[i].char] = dat[i];
      }
      console.log("Character data loaded!");
    });
  },
  computed: {
  },
  methods: {
    parse(text: string) {
      let reg = /[^\x00-\x7F]|{[\s]*([a-z_*]*[0-4]?)([\s]+[\d]+)?[\s]*}/g;
      let matches = text.matchAll(reg);
      this.rules = [];
      for (let match of matches) {
        this.rules.push(this.matchToRule(match));
      }
      console.log(this.rules.length);
      return;
    },
    matchToRule(match: RegExpExecArray) {
      if (match[1] == undefined) return match[0];
      else {
        return {
          pronounce: new RegExp(this.convertPronouce(match[1])),
          strokes: match[2] == undefined ? null : parseInt(match[2]),
        } as CharConstrain;
      }
    },
    convertPronouce(text: string) {
      let ret = text;
      if (ret != "" && !ret[text.length - 1].match(/[0-4]/)) {
        ret += '[0-4]';
      }
      ret = ret.replace(/\*/g, ".*");
      ret = ret.replace(/_/g, ".");
      return "^" + ret + "$";
    },
    searchWords() {
      this.parse(this.text);
      this.words = [];
      this.has_more = false;
      this.count = 0;
      for (let str of this.word_data) {
        if (this.isValidatedWord(str)) {
          if (this.count >= 100) {
            break;
          }
          this.words.push(str);
          console.log(str.length);
          this.count++;
        }
      }
    },
    convertPronouceChar(str: string) {
      let strs = str.split(" ");
      if (strs.length > 1) {
        let ret = '';
        for (let i in strs) {
          ret += this.convertPronouce(strs[i]);
        }
        return ret;
      }
      let ret = str;
      let dict = {
        'ā': ['a', '1'],
        'á': ['a', '2'],
        'ǎ': ['a', '3'],
        'à': ['a', '4'],
        'ō': ['o', '1'],
        'ó': ['o', '2'],
        'ǒ': ['o', '3'],
        'ò': ['o', '4'],
        'ē': ['e', '1'],
        'é': ['e', '2'],
        'ě': ['e', '3'],
        'è': ['e', '4'],
        'ī': ['i', '1'],
        'í': ['i', '2'],
        'ǐ': ['i', '3'],
        'ì': ['i', '4'],
        'ū': ['u', '1'],
        'ú': ['u', '2'],
        'ǔ': ['u', '3'],
        'ù': ['u', '4'],
        'ǖ': ['v', '1'],
        'ǘ': ['v', '2'],
        'ǚ': ['v', '3'],
        'ǜ': ['v', '4'],
        'ḿ': ['m', '2'],
        'ń': ['n', '2'],
        'ň': ['n', '3'],
      }
      let soft = true;
      for (let i = 0; i < str.length; i++) {
        if (str[i] in dict) {
          let tmp = str[i] as keyof typeof dict;
          ret = replaceAt(str, i, dict[tmp][0]);
          ret += dict[tmp][1];
          soft = false;
          break;
        }
      }
      if (soft) {
        ret += '0';
      }
      return ret;
    },

    isValidatedWord(str: string) {
      if ([...str].length != this.rules.length) {
        return false;
      }
      for (let i = 0; i < [...str].length; i++) {
        if (!(this.isValidatedChar([...str][i], this.rules[i]))) {
          return false;
        }
      }
      return true;
    },
    isValidatedChar(char: string, rule: CharRule) {
      if (typeof rule === "string") {
        return char == rule;
      }
      else {
        if (rule.pronounce != null && !(this.isValidatedPronounce(char, rule.pronounce))) {
          return false;
        }
        if (rule.strokes != null && !(this.isValidatedStrokes(char, rule.strokes))) {
          return false;
        }
        return true;
      }
    },
    isValidatedPronounce(char: string, pronounce: RegExp) {
      if (!(char in this.dict)) return false;
      for (let i = 0; i < this.dict[char].pinyin.length; i++) {
        if (this.dict[char].pinyin[i].match(pronounce)) {
          return true;
        }
      }
      return false;
    },
    isValidatedStrokes(char: string, strokes: number) {
      if (!(char in this.dict)) return false;
      return this.dict[char].strokes == strokes;
    }
  }
}
</script>

<template>
  <div>
    Nutri for Chinese words (Version 0.2.1):
    <label for="text">
      <input v-model="text" />
    </label>
    <button @click="searchWords">search</button>
  </div>
  <div>
    Findings:
    <ul>
      <li v-for="word in words">{{ word }}</li>
    </ul>
    <p v-if="count == 100">The above are first 100 results. Please give more restrictions if you don't find desired answer.
    </p>
    <p v-else-if="count == 0">No result found.</p>
  </div>
  <div>
    Explanation:
    <ul>
      <li>The tool is to find Chinese words with some restriction on pronunciation or stroke numbers.</li>
      <li>Only <em>Simplified Chinese</em> is supported.</li>
      <li>Every character description should be embraced by {}.</li>
      <li>The general pronunciation is given by pinyin but the tone is given by number (0 for light tone). For example,
        “课” = ke4. You can use
        * to represent arbitrary number of characters and _ to represent one character.</li>
      <li>The possible second field in braces suggest the strokes number of character.</li>
      <li>Only first 100 results are shown.</li>
      <li>The missing characters in Chinese character data (See Acknowledgements for the source) will not match any
        pronunciation or stroke description.</li>
    </ul>
    Examples:
    <ul>
      <li>{hun} {mi} => 昏迷 ……</li>
      <li>印 {d*4} => 印度 ……</li>
      <li>{* 10} {* 12} {* 9} => 莫斯科 ……</li>
    </ul>
  </div>
  <div>
    Acknowledgements:
    <ul>
      <li>The Chinese character data (pronunciation and strokes) are from <a
          href="https://github.com/mapull/chinese-dictionary/">https://github.com/mapull/chinese-dictionary/</a>. (With
        some mistakes fixed)
      </li>
      <li>The currently used word data are from <ul>
          <li> <a
              href="https://github.com/rime/rime-pinyin-simp/blob/master/pinyin_simp.dict.yaml">pinyin_simp.dict.yaml</a>
          </li>
          <li>
            <a
              href="https://github.com/rime/rime-luna-pinyin/blob/master/luna_pinyin.dict.yaml">luna_pinyin.dict.yaml</a>
          </li>
          <li>
            <a
              href="https://github.com/renyijiu/rime/blob/master/luna_pinyin.extended.dict.yaml">luna_pinyin.extended.dict.yaml</a>
          </li>
          <li>
            <a
              href="https://github.com/renyijiu/rime/blob/master/luna_pinyin.hanyu.dict.yaml">luna_pinyin.hanyu.dict.yaml</a>
          </li>
          <li>
            <a
              href="https://github.com/renyijiu/rime/blob/master/luna_pinyin.poetry.dict.yaml">luna_pinyin.poetry.dict.yaml</a>
          </li>
          <li>
            <a
              href="https://github.com/renyijiu/rime/blob/master/luna_pinyin.chengyusuyu.dict.yaml">luna_pinyin.chengyusuyu.dict.yaml</a>
          </li>
        </ul>
        containing 513095 words(?).
      </li>
      <li>
        The Simplified-Traditional Chinese conversion is worked out by <a
          href="https://github.com/BYVoid/OpenCC">OpenCC</a>.
      </li>
    </ul>
  </div>
  <div>
    Update Note:
    <ul>
      <li>
        Version 0.2.1:
        <ul>
          <li>Show information if no result is found.</li>
        </ul>
      </li>
      <li>
        Version 0.2:
        <ul>
          <li>
            The word dictionary is expanded.
          </li>
          <li>
            You can specify the character directly now.
          </li>
        </ul>
      </li>
      <li>Version 0.1: First published version.</li>
    </ul>
  </div>
</template>

<style>
em {
  font-weight: bold;
}
</style>
