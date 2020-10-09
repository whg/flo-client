<template>
<div class="modal">
  <div class="background"></div>
  <div class="inner">
    <span class="close" @click="$emit('close')">✕</span>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;

  .inner {
    position: relative;
    border-radius: 10px;
    /* position: relative; */
    background: #fff;
    /* width: 640px; */
    padding: 20px;

    span.close {
      position: absolute;
      right: 15px;
      top: 6px;
      font-size: 25px;
      &:hover {
        cursor: pointer;
      }
    }

    .content {
      padding: 20px;
    }
  }
}
</style>
