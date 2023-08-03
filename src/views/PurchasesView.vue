<template>
  <div class="d-flex h-100" style="padding-top: 30vh;" v-if="access.purchases > 0">
    <div class="table__wrapper w-100">
      <PurchaseTable @editTender="openTenderModal" @createTender="openNewTenderModal" @change="changePage" @search="searchTenders" 
      :tenders="currentTenders" :totalPages="totalPages" :totalTenders="totalTenders" :page="page" :length="length"/>
    </div>

    <v-dialog v-model="tenderModal">
      <PurchaseForm @close="tenderModal = false" @save="saveTender" @create="createTender" :tender="currentTender"/>
    </v-dialog>
  </div>
</template>

<script>
import { getTenders, putTender, postTender } from "@/api"

import { mapState } from 'pinia'
import {useAuthStore} from '@/plugins/store/auth'

import PurchaseTable from "@/components/Purchases/PurchaseTable.vue"
import PurchaseForm from "@/components/Purchases/PurchaseForm.vue"

export default {
  components: { PurchaseTable, PurchaseForm, },
  async mounted() {
    await this.getCurrentTenders()
  },
  data: () => ({
    pageName: 'purchases',
    tenderModal: false,
    start: 0,
    length: 10,
    page: 1,
    totalPages: 0,
    totalTenders: 0,
    currentTender: {},
    tenders: []
  }),

  computed: {
    currentTenders() {
      return [...this.tenders]
    },
    ...mapState(useAuthStore, {
      access: 'access'
    })
  }, 

  methods: {
    async searchTenders(searchText) {
      await this.getCurrentTenders(searchText)
    },
    openTenderModal(item) {
      console.log(item)
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
      await putTender(this.pageName, item, item.id)
      await this.getCurrentTenders()
      this.tenderModal = false
    },
    async createTender(item) {
      console.log('создать', JSON.stringify(item))
      await postTender(this.pageName, item)
      await this.getCurrentTenders()
      this.tenderModal = false
    },
    async getCurrentTenders(serchText = '') {
      const { records_total, records_filtered, data } = await getTenders(this.pageName, this.start, this.length, serchText)
      this.totalTenders = records_filtered
      this.totalPages = Math.ceil( this.totalTenders / this.length )
      this.tenders = [...data]
    },
  },
}

</script>

<style scoped>
.table__wrapper {
  padding: 0px 35px 30px 20px;
}
</style>