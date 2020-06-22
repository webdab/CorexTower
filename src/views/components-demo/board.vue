<template>
  <div class="components-container board">
    <Kanban :key="1" :list="list1" :group="group" class="kanban todo" :header-text.sync="title" />
    <Kanban :key="2" :list="list2" :group="group" class="kanban working" :header-text.sync="Working" />
    <Kanban :key="3" :list="list3" :group="group" class="kanban done" :header-text.sync="Done" />
    <Kanban :key="4" :list="list4" :group="group" class="kanban bug" :header-text.sync="Bug" />
    <Kanban :key="5" :list="list5" :group="group" class="kanban add" :header-text.sync="Add" />
    <span class="addList" @click="addList">+添加清单</span>
  </div>

</template>

<script>
import Kanban from '@/components/Kanban'
export default {
  components: {
    Kanban
  },
  data() {
    return {
      group: 'mission',
      list1: [
        { name: 'Mission', id: 1 },
        { name: 'Mission', id: 2 },
        { name: 'Mission', id: 3 },
        { name: 'Mission', id: 4 }
      ],
      list2: [
        { name: 'Mission', id: 5 },
        { name: 'Mission', id: 6 },
        { name: 'Mission', id: 7 }
      ],
      list3: [
        { name: 'Mission', id: 8 },
        { name: 'Mission', id: 9 },
        { name: 'Mission', id: 10 }
      ],
      list4: [
        { name: 'Mission', id: 11 },
        { name: 'Mission', id: 12 },
        { name: 'Mission', id: 13 }
      ],
      list5: [
        { name: 'Mission', id: 14 },
        { name: 'Mission', id: 15 },
        { name: 'Mission', id: 16 }
      ],
      title: 'title',
      Working: 'Working',
      Done: 'Done',
      Bug: 'Bug',
      Add: 'Add'
    }
  },
  methods: {
    // 添加清单
    addList() {}
  }
}
</script>

<style lang="scss" scoped>
.board {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: flex-start;
  .addList {
    margin-right: 20px;
    display: inline-block;
    width: 324px;
    font-size: 20px;
    height: 60px;
    line-height: 20px;
    border: 1px solid #d9d3d3;
    padding: 20px 100px;
    color: #333;
    text-align: center;
    white-space: nowrap;
    &:hover {
      background-color: #f7fbfb;
    }
  }
}
.kanban {
  &.todo {
    .board-column-header {
      background: #efefef;
    }
  }
  &.working {
    .board-column-header {
      background: #efefef;
    }
  }
  &.done {
    .board-column-header {
      background: #efefef;
    }
  }
  &.bug {
    .board-column-header {
      background: #efefef;
    }
  }
  &.add {
    .board-column-header {
      background: #efefef;
    }
  }
  &.new {
    .board-column-header {
      background: #efefef;
    }
  }
}
</style>
