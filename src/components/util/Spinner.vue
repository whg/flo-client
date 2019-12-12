<template lang="html">
<div class="spinner">
  <span></span>
  <span></span>
  <span></span>
</div>
</template>

<style lang="scss" scoped>
div.spinner {
  display: inline-block;
  span {
    display: inline-block;
    background: #666;
    width: 8px;
    border-radius: 5px;
    margin: 1px;
    height: 12px;
    animation: spinner 0.9s linear infinite;
  }
  span:nth-child(2) {
    animation-delay: 0.3s;
  }
  span:nth-child(3) {
    animation-delay: 0.6s;
  }
}

@keyframes spinner {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
}

</style>
