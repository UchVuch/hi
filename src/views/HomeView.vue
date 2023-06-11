<template>
  <div class="d-flex h-100" style="padding-top: 30vh;">
    <div class="table__wrapper w-100" style="padding: 0 75px 30px 18vw;">
      <TendersTable @editTender="openTenderModal" @createTender="openNewTenderModal" @change="changePage" :tenders="currentTenders" :totalPages="totalPages" :page="page"/>
      <v-alert
        style="position: absolute; top: 60px; right: 20px; z-index: 5000;"
        v-model="alert"
        type="error"
      title="Нельзя начать новый этап"
      text="Чтобы начать новый этап, заполните все поля предыдущего"
      >
      </v-alert>
    </div>

    <v-dialog v-model="tenderModal">
      <TenderForm @close="tenderModal = false" @save="saveTender" @create="createTender" :tender="currentTender"/>
    </v-dialog>
  </div>
</template>

<script>
import { getTenders, putTender, postTender } from "@/api"

import TendersTable from "../components/Tenders/TendersTable.vue"
import TenderForm from "../components/Tenders/TenderForm.vue"
import TenderEquipmentForm from "../components/Tenders/TenderEquipmentForm.vue"

export default {
  components: { TendersTable, TenderForm, TenderEquipmentForm },
  async created() {
    await this.getCurrentTenders()
    console.log(this.tenders)
  },
  data: () => ({
    alert: false,
    tenderModal: false,
    start: 0,
    length: 10,
    page: 1,
    totalPages: 0,
    currentTender: {},
    tenders: []
  }),

  computed: {
    currentTenders() {
      return [...this.tenders]
    }
  }, 

  methods: {
    openTenderModal(item) {
      this.currentTender = {...item}
      this.tenderModal = true
    },
    openNewTenderModal() {
      this.currentTender = {}
      this.tenderModal = true
    },
    async changePage(pageNumber) {
      this.page = pageNumber
      this.start = pageNumber * this.length - this.length
      await this.getCurrentTenders()
    },
    async saveTender(item) {
      console.log('cохранить', JSON.stringify(item))
      await putTender(item, item.id)
      await this.getCurrentTenders()
      this.tenderModal = false
    },
    async createTender(item) {
      console.log('создать', JSON.stringify(item))
      await postTender(item)
      await this.getCurrentTenders()
      this.tenderModal = false
    },
    async getCurrentTenders() {
      const { records_total: totalTenders, records_filtered, data } = await getTenders(this.start, this.length)
      console.log(data)
      this.totalPages = totalTenders / this.length
      this.tenders = [...data]
    },
  },
}

</script>

<style scoped>
</style>