<script setup lang="ts"></script>

<template>
  <main>
    <div class="about">
      <p>
        <em>Potior</em> is a collection of puzzle hunt related tools. The name is not only a Latin
        word having the meaning "to be master of" and also an anagram of the famous directive
        Poirot.
      </p>
      <p>Tool List:</p>
      <ul>
        <li>
          <RouterLink to="/sudoku">Sudoku</RouterLink> is a Sudoku viewer with instant candidate presentation.
        </li>
        <li>
          <RouterLink to="/binary">Binary</RouterLink> is a tool spotaneous show result of different code consisting of
          only two characters.
        </li>
        <li>
          <RouterLink to="/unicode">Unicode</RouterLink> is a two-sided unicode-character converter.
        </li>
        <li>
          <RouterLink to="/chinese">Chinese</RouterLink> is a tool to find Chinese words similar to <a
            href="https://nutrimatic.org/2024/">Nutri</a>
        </li>
      </ul>
      The project is powered by
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. See and fork the
      <a href="https://github.com/zenith-john/potior/">repo</a> if you want to know how it works
      or contribute.
    </div>
  </main>
</template>

<style>
.about {
  margin: auto;
  max-width: 800px;
  font-size: 18px;
}
</style>
