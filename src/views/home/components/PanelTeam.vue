<template>
  <div class="teamlist-component">
    <div class="team-wrapper">
      <div class="team-title">

      </div>
      <div class="team-content">
        <img src="@/assets/images/001.png">
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.teamlist-component {
  height: 100%;
  width: 100%;

  .team-wrapper {
    height: 100%;
    width: 100%;
    .team-title {
      height: 50px;
      padding-left: 20px;
      border-radius: 4px;
      position: relative;
    }
    .team-content {
      text-align: center;
    }
  }
}
</style>
