<template>
  <div
    v-if="access.purchases > 0"
    class="h-100"
    style="padding-top: 10vh"
  >
    <div class="table__wrapper w-100">
      <TendersTable
        :filtered-tenders="finalTenders"
        :content-cells="createContentTableCells"
        :settings="settingsTable.settings"
        :page-name="pageName"
        :total-pages="totalPages"
        :total-tenders="totalTenders"
        :page="page"
        :length="length"
        @edit-tender="openTenderModal"
        @create-tender="openNewTenderModal"
        @change-page="changePage"
        @search="searchTenders"
        @save-settings="saveSettingsTable"
        @change-settings-table="changeSettingsTable"
        @hidden-table-column="hideColumn"
      >
        <template #title>
          <h1 class="mb-6">
            Заявки
          </h1>
        </template>
        <template #filters>
          <div class="mb-6">
            <AccordionContent>
              <template #title>
                Фильтры
              </template>
              <v-select
                v-model="statusFilter"
                :items="filterValues"
                item-value="id"
                item-title="name"
                label="Фильтр по статусу"
                variant="solo-filled"
                hide-details
                class="filter-status"
              />
            </AccordionContent>
          </div>
        </template>
      </TendersTable>
    </div>

    <v-dialog
      v-model="tenderModal"
      :width="isMobile ? '90%' : 'auto'"
    >
      <SupportForm
        :tender="currentTender"
        @close="tenderModal = false"
        @save="saveTender"
        @create="createTender"
      />
    </v-dialog>
  </div>
</template>

<script>
import { FRONTEND_VERSION } from '../variables'
import { setSettingsTable, getSettingsTable } from '@/api'
import {
  customFetch,
  getTenders,
  putTender,
  postTender,
  getUsers,
} from '@/api'

import formatToDateRu from '@/helpers/formatToDateRu'

import { mapState } from 'pinia'
import { useAuthStore } from '@/plugins/store/auth'

import TendersTable from '@/components/Tables/TendersTable.vue'
import SupportForm from '@/components/Support/SupportForm.vue'
import AccordionContent from '../components/UI/AccordionContent.vue'

const settings = {
  version: FRONTEND_VERSION,
  settings: [
    {
      name: 'customer',
      value: 'Клиент',
      hidden: false,
    },
    {
      name: 'problem_description',
      value: 'Описание проблемы',
      hidden: false,
    },
    {
      name: 'customer_contacts',
      value: 'Контакты клиента',
      hidden: false,
    },
    {
      name: 'status',
      value: 'Статус',
      hidden: false,
    },
    {
      name: 'responsible_persons',
      value: 'Ответственные',
      hidden: false,
    },
    {
      name: 'solution',
      value: 'Решение',
      hidden: false,
    },
    {
      name: 'correction_period',
      value: 'Срок исправления',
      hidden: false,
    },
    {
      name: 'complaint_date',
      value: 'Дата жалобы',
      hidden: false,
    },
  ],
}

export default {
  components: { TendersTable, SupportForm, AccordionContent },

  data: () => ({
    pageName: 'support',
    statusFilter: '',
    filterValues: [
      {
        id: '',
        name: 'Все',
      },
      {
        id: 0,
        name: 'Нерешённые',
      },
      {
        id: 1,
        name: 'Решённые',
      },
    ],
    tenderModal: false,
    searchText: '',
    start: 0,
    length: 10,
    page: 1,
    totalPages: 0,
    totalTenders: 0,
    currentTender: {},
    tenders: [],

    users: [],

    settingsTable: {
      version: 0,
      settings: [],
    },
  }),

  watch: {
    async statusFilter() {
      await this.getCurrentTenders()
    },
  },

  async mounted() {
    const usersData = await customFetch(this, getUsers)
    if (usersData) this.users = usersData.data

    let settingsData = null
    // получаем настройки таблицы с сервера и после обновляем рендер таблицы
    const data = await customFetch(this, getSettingsTable, this.pageName)
    if (data) settingsData = data

    console.log(settingsData)
    if (settingsData && Object.keys(settingsData).includes('version')) {
      settingsData.version === FRONTEND_VERSION
        ? (this.settingsTable = settingsData)
        : (this.settingsTable = settings)
    } else {
      this.settingsTable = settings
    }

    await this.getCurrentTenders()
  },

  computed: {
    ...mapState(useAuthStore, {
      isMobile: 'isMobile',
      access: 'access',
    }),
    currentTenders() {
      return [...this.tenders]
    },
    selectedColumnsNames() {
      return this.settingsTable.settings
        .filter((row) => row.hidden !== true)
        .map((row) => row.name)
    },
    visibleColumns() {
      return this.settingsTable.settings.filter(
        (column) => column.hidden === false,
      )
    },
    finalTenders() {
      const columns = this.selectedColumnsNames
      const newArr = []
      this.currentTenders.forEach((row) => {
        // id, date, amount, equipment
        const finalColumns = Object.keys(row).reduce((obj, key) => {
          if (columns.includes(key)) {
            obj[key] = row[key]
          }
          return obj
        }, {})
        finalColumns.id = row.id
        finalColumns.caption = row.caption
        newArr.push(finalColumns)
      })
      return newArr
    },
    createContentTableCells() {
      return this.finalTenders.map((tender) => {
        const formatedTenderData = []

        this.visibleColumns
          .map((column) => column.name)
          .forEach((propertyName) => {
            switch (propertyName) {
            case 'correction_period':
            case 'complaint_date':
              formatedTenderData.push(
                `${tender[propertyName] ? formatToDateRu(tender[propertyName]) : ''}`,
              )
              break
            case 'solution':
            case 'problem_description':
              formatedTenderData.push(
                `<div style="max-height: 400px; overflow-y: hidden;" title="${tender[propertyName]}">${tender[propertyName] ? tender[propertyName] : ''}</div>`,
              )
              break
            case 'status':
              formatedTenderData.push(
                `${tender[propertyName] ? 'Решён' : 'Не решён'}`,
              )
              break
            case 'responsible_persons':
              formatedTenderData.push(
                `${
                  tender[propertyName] && this.users.length > 0
                    ? tender[propertyName]
                      .map((personId) => {
                        const user = this.users.find(
                          (user) => user.id === personId,
                        )
                        return `${user.name} — ${user.username}`
                      })
                      .join('<br>')
                    : ''
                }`,
              )
              break
            default:
              formatedTenderData.push(
                `${tender[propertyName] ? tender[propertyName] : ''}`,
              )
            }
          })

        return formatedTenderData
      })
    },
  },

  methods: {
    async searchTenders(searchText) {
      this.searchText = searchText
      await this.getCurrentTenders()
    },
    openTenderModal(item) {
      console.log(item)
      this.currentTender = { ...item }
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
    hideColumn(name) {
      const column = this.settingsTable.settings.find(
        (item) => item.name === name,
      )
      column.hidden = !column.hidden
    },
    changeSettingsTable(settings) {
      this.settingsTable.settings = [...settings]
    },
    async saveSettingsTable(settings) {
      // тут подставить метод по отправке настроек на сервер
      const data = await customFetch(
        this,
        setSettingsTable,
        this.pageName,
        settings,
      )
      // обновляем настройки
      if (data) {
        const data = await customFetch(this, getSettingsTable, this.pageName)
        if (data) this.settingsTable = data
      }
    },
    async saveTender(item) {
      console.log('cохранить', JSON.stringify(item))
      const data = await customFetch(
        this,
        putTender,
        this.pageName,
        item,
        item.id,
      )
      if (data) {
        await this.getCurrentTenders()
        this.tenderModal = false
      }
    },
    async createTender(item) {
      console.log('создать', JSON.stringify(item))
      const data = await customFetch(this, postTender, this.pageName, item)
      if (data) {
        await this.getCurrentTenders()
        this.tenderModal = false
      }
    },

    async getCurrentTenders() {
      const responseData = await customFetch(
        this,
        getTenders,
        this.pageName,
        this.statusFilter,
        this.searchText,
        this.start,
        this.length,
      )
      if (responseData) {
        const { records_total, records_filtered, data } = responseData
        this.totalTenders = records_filtered
        this.totalPages = Math.ceil(this.totalTenders / this.length)
        this.tenders = [...data]
      }
    },
  },
}
</script>

<style scoped>
.filter-status {
  width: 200px;
}
.table__wrapper {
  padding: 0px 35px 30px 20px;
}
@media (max-width: 767px) {
  .table__wrapper {
    padding: 0 10px;
  }
}
</style>
