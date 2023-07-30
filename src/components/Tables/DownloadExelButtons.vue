<template>
  <div class="buttons__wrapper">
    <v-btn color="add-new" @click="openMenu">
      Выгрузить в Excel
    </v-btn>
    <div class="buttons" :class="{ 'buttons--open': dialogMenu }">
      <div class="buttons__header">
        <v-icon color="close-modal" icon="mdi-close" size="small" @click="closeMenu"></v-icon>
      </div>
      <div class="buttons__content">
        <v-btn 
          color="primary" 
          @click="closeMenu" 
          :download="`Тендеры ${search}${page}.xls`" 
          :href="`api/tenders/export?start=${start}&length=${length}&columns=${columns}&seach=${search}`"
        >
          текущая страница
        </v-btn>
        <v-btn 
          color="primary" 
          @click="closeMenu" 
          :download="'Все тендеры.xls'" 
          :href="`api/tenders/export?start=0&length=${totalTenders}&columns=${columns}&seach=${search}`"
        >
        все страницы
      </v-btn>
      </div>
    </div>
  </div>
</template>
<script>

export default {
name: 'download-exel-buttons',

props: {
  search: {
    type: String,
    required: true
  },
  page: {
    type: Number,
    required: true
  }, 
  length: {
    type: Number,
    required: true
  },
  totalTenders: {
    type: Number,
    required: true
  },
  columns: {
    type: String,
    required: true
  }
},

data: () => ({
  dialogMenu: false,
}),

computed: {
  start() {
    return this.page * this.length - this.length
  }
},

methods: {
  openMenu() {
    this.dialogMenu = true
  },
  closeMenu() {
    this.dialogMenu = false
  },
}
}
</script>
<style scoped>
.buttons__wrapper {
  position: relative;
  margin-right: 16px;
}
.buttons {
  display: none;
  position: absolute;
  z-index: 100;
  top: 40px;
  left: -150px;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 8px 10px 10px 8px rgba(34, 60, 80, 0.2);
  background-color: #fff;
}
.buttons--open {
  display: block;
}
.buttons__header {
  display: flex;
  justify-content: flex-end;
}
.buttons__content {
  display: flex;
  gap: 15px;
  padding: 5px;
}
</style>
