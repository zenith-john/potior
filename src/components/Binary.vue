<script lang="ts">
export default {
  data() {
    return {
      code: "",
      morseTable: {} as { [key: string]: string },
      reverseVisible: false,
    }
  },
  mounted() {
    // Initialize morseTable
    const letters = 'abcdefghijklmnopqrstuvwxyz0123456789.,?\'!/()&:;=+-_"$@ ';
    const morseValues =
      [
        '.-', '-...', '-.-.', '-..', '.', '..-.',
        '--.', '....', '..', '.---',
        '-.-', '.-..', '--', '-.', '---',
        '.--.', '--.-', '.-.', '...', '-',
        '..-', '...-', '.--', '-..-', '-.--',
        '--..', '-----', '.----', '..---',
        '...--', '....-', '.....', '-....',
        '--...', '---..', '----.', '.-.-.-',
        '--..--', '..--..', '.----.', '-.-.--',
        '-..-.', '-.--.', '-.--.-',
        '.-...', '---...', '-.-.-.', '-...-',
        '.-.-.', '-....-', '..--.-',
        '.-..-.', '...-..-', '.--.-.'
      ];

    for (let i = 0; i < morseValues.length; i++) {
      this.morseTable[morseValues[i]] = letters.charAt(i);
    }
  },
  computed: {
    isValid() {
      if (this.code.match(/^[01\s]*$/) != null) {
        return true;
      }
      else {
        return false;
      }
    },
    reverse() {
      let ret = "";
      for (var i = 0; i < this.code.length; i++) {
        let char = this.code.charAt(i);
        if (char == '1') {
          ret += '0';
        }
        else if (char == '0') {
          ret += '1';
        }
        else {
          ret += char;
        }
      }
      return ret;
    }
  },
  methods: {
    binToInt(str: string) {
      if (str.match(/^[01]*$/) != null) {
        let ret = 0;
        for (var i = 0; i < str.length; i++) {
          ret *= 2;
          if (str.charAt(i) == '1') {
            ret++;
          }
        }
        return ret;
      }
      return -1;
    },
    morseToChar(code: string) {
      if (code in this.morseTable) {
        return this.morseTable[code];
      }
      else {
        return " UMC ";
      }
    },
    binary(code: string) {
      const gap = 5;
      let trim_code = code.replace(/\s/g, "");
      if (trim_code.length % gap != 0) {
        return "Invalid as binary code";
      }
      else {
        let ret = "";
        let shift = 'a'.charCodeAt(0) - 1;
        for (var i = 0; i < trim_code.length; i += gap) {
          ret += String.fromCharCode(shift + this.binToInt(trim_code.substring(i, i + gap)));
        }
        return ret;
      }
    },
    ascii(code: string) {
      const gap = 7;
      let trim_code = code.replace(/\s/g, "");
      if (trim_code.length % gap != 0) {
        return "Invalid as ascii code";
      }
      else {
        let ret = "";
        for (var i = 0; i < trim_code.length; i += gap) {
          ret += String.fromCharCode(this.binToInt(trim_code.substring(i, i + gap)));
        }
        return ret;
      }
    },
    bacon1(code: string) {
      const gap = 5;
      let trim_code = code.replace(/\s/g, "");
      if (trim_code.length % gap != 0) {
        return "Invalid as Bacon code";
      }
      else {
        let ret = "";
        let shift = 'a'.charCodeAt(0);
        for (var i = 0; i < trim_code.length; i += gap) {
          ret += String.fromCharCode(shift + this.binToInt(trim_code.substring(i, i + gap)));
        }
        return ret;
      }
    },
    bacon2(code: string) {
      const gap = 5;
      let trim_code = code.replace(/\s/g, "");
      if (trim_code.length % gap != 0) {
        return "Invalid as Bacon code";
      }
      else {
        let ret = "";
        let shift = 'a'.charCodeAt(0);
        for (var i = 0; i < trim_code.length; i += gap) {
          let num = this.binToInt(trim_code.substring(i, i + gap));
          if (num >= 20) {
            num = num + 2;
          }
          else if (num >= 10) {
            num = num + 1;
          }
          ret += String.fromCharCode(shift + num);
        }
        return ret;
      }
    },
    morse(code: string) {
      let morsify = code.replace(/1/g, "-").replace(/0/g, ".");
      let codes = morsify.split(" ");
      let ret = "";
      for (var i in codes) {
        if (codes[i] != "") {
          ret += this.morseToChar(codes[i]);
        }
      }
      return ret;
    },
    toggleReverse() {
      this.reverseVisible = !this.reverseVisible;
    }
  }
}
</script>

<template>
  <label for="code">
    Enter binary code (using 0 and 1):
    <input v-model="code" placeholder="Enter the code." />
    <template v-if="!isValid">
      Invalid input.
    </template>
  </label>
  <div>
    <p> Binary (5bit/1char): {{ binary(code) }} </p>
    <p> Ascii (7bit/1char): {{ ascii(code) }} </p>
    <p> Bacon (5bit/1char) I≠J,U≠V: {{ bacon1(code) }} </p>
    <p> Bacon (5bit/1char) I=J,U=V: {{ bacon2(code) }} </p>
    <p> Morse (1=-,0=.): {{ morse(code) }}</p>
    <button @click="toggleReverse">Reversed</button>
    <div :class="{ invisible: !reverseVisible }">
      <p> Reverse code: {{ reverse }}</p>
      <p> Binary (5bit/1char): {{ binary(reverse) }} </p>
      <p> Ascii (7bit/1char): {{ ascii(reverse) }} </p>
      <p> Bacon (5bit/1char) I≠J,U≠V: {{ bacon1(reverse) }} </p>
      <p> Bacon (5bit/1char) I=J,U=V: {{ bacon2(reverse) }} </p>
      <p> Morse (1=-,0=.): {{ morse(reverse) }}</p>
    </div>
  </div>
</template>

<style>
.invisible {
  display: none;
}
</style>