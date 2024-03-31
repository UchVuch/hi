<template>
  <div
    v-if="access.tenders > 0"
    class="h-100"
    style="padding-top: 10vh"
  >
    <div class="table__wrapper w-100">
      <TendersTable
        :filtered-tenders="filteredTenders"
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
            Договоры
          </h1>
        </template>
        <template #filters>
          <div class="mb-6">
            <AccordionContent>
              <template #title>
                Фильтры
              </template>
              <div class="filters__list">
                <v-select
                  v-model="statusFilter"
                  :items="filterValues"
                  class="filter-status"
                  :class="{ 'filter-mobile': isMobile }"
                  hide-details
                  label="Фильтр по статусу"
                  item-title="name"
                  item-value="id"
                  variant="solo-filled"
                >
                  <template #no-data>
                    <div>Нет тегов</div>
                  </template>
                </v-select>
                <v-select
                  v-model="tags"
                  :items="tagsItems"
                  class="filter-tags"
                  :class="{ 'filter-mobile': isMobile }"
                  clearable
                  chips
                  multiple
                  label="Теги"
                  item-value="id"
                  variant="solo-filled"
                >
                  <template #no-data>
                    <div>Нет тегов</div>
                  </template>
                  <template #chip="{ item }">
                    <span class="ml-2">
                      <v-icon
                        icon="mdi-star"
                        :color="item.raw.color"
                      />
                      <span>{{ item.raw.name }}</span>
                    </span>
                  </template>
                  <template #item="{ props }">
                    <v-list-item
                      v-bind="props"
                      :title="props.title.name"
                    >
                      <template #prepend>
                        <v-icon
                          icon="mdi-star"
                          :color="props.title.color"
                        />
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
            </AccordionContent>
          </div>
        </template>
      </TendersTable>
    </div>

    <v-dialog
      v-model="tenderModal"
      :width="isMobile ? '90%' : '100%'"
    >
      <TenderForm
        :tender="currentTender"
        @close="tenderModal = false"
        @save="saveTender"
        @create="createTender"
        @delete="deleteTender"
      />
    </v-dialog>
  </div>
</template>

<script>
import { FRONTEND_VERSION } from '../variables'
import { setSettingsTable, getSettingsTable } from '@/api'
import {
  customFetch,
  getContracts,
  putTender,
  postTender,
  deleteContract,
  getTags,
} from '@/api'

import formatToDateRu from '@/helpers/formatToDateRu'
import formatToDate from '@/helpers/formatToDate'
import formatFromDatePicker from '@/helpers/formatFromDatePicker'

import { mapState } from 'pinia'
import { useAuthStore } from '@/plugins/store/auth'

import TendersTable from '@/components/Tables/TendersTable.vue'
import TenderForm from '@/components/Tenders/TenderForm.vue'
import AccordionContent from '@/components/UI/AccordionContent.vue'

// стандартные настройки
const settings = {
  version: FRONTEND_VERSION,
  settings: [
    {
      name: 'contract.seller_name',
      value: 'Имя продавца',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.customer_name',
      value: 'Имя клиента',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.procuring',
      value: 'Контракт',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.equipment',
      value: 'Оборудование в контракте',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.number',
      value: 'Номер договора',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.date',
      value: 'Дата контракта',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.inn',
      value: 'ИНН',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.partner',
      value: 'Партнёр',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.pay_type',
      value: 'Тип оплаты',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.tags',
      value: 'Теги',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.tender_link',
      value: 'Ссылка на конкурс',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.terms',
      value: 'Условия контракта',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.addresses',
      value: 'Адреса',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract.contacts',
      value: 'Контакты',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'shipment.date',
      value: 'Дата начала отгрузки',
      hidden: false,
      stage: 'shipment',
    },
    {
      name: 'shipment.end_date',
      value: 'Дата конца отгрузки',
      hidden: false,
      stage: 'shipment',
    },
    {
      name: 'shipment.equipment',
      value: 'Отгрузка оборудования',
      hidden: false,
      stage: 'shipment',
    },
    {
      name: 'inspection.payments',
      value: 'Оплата',
      hidden: false,
      stage: 'inspection',
    },
    {
      name: 'inspection.penalties',
      value: 'Штраф',
      hidden: false,
      stage: 'inspection',
    },
    {
      name: 'inspection.approved',
      value: 'Одобрено',
      hidden: false,
      stage: 'inspection',
    },
    {
      name: 'inspection.getting_signing_documents',
      value: 'Получение/подписание документов',
      hidden: false,
      stage: 'inspection',
    },
  ],
}

export default {
  components: { TendersTable, TenderForm, AccordionContent },

  data: () => ({
    pageName: 'tenders',
    statusFilter: '',
    filterValues: [
      {
        id: '',
        name: 'Все',
      },
      {
        id: false,
        name: 'Неактивные',
      },
      {
        id: true,
        name: 'Активные',
      },
    ],
    searchText: '',
    tags: [],
    tagsIds: [],
    tagsItems: [],
    tenderModal: false,
    start: 0,
    length: 10,
    page: 1,
    totalPages: 0,
    totalTenders: 0,
    currentTender: {},
    tenders: [],
    settingsTable: {
      version: 0,
      settings: [],
    },
  }),
  async mounted() {
    let settingsData = null
    // получаем настройки таблицы с сервера и после обновляем рендер таблицы
    const data = await customFetch(this, getSettingsTable, this.pageName)
    if (data) settingsData = data

    if (settingsData && Object.keys(settingsData).includes('version')) {
      settingsData.version === FRONTEND_VERSION
        ? (this.settingsTable = settingsData)
        : (this.settingsTable = settings)
    } else {
      this.settingsTable = settings
    }

    await this.getCurrentTenders()
    const contactTags = await customFetch(this, getTags, { is_tender: false })
    const tendertTags = await customFetch(this, getTags, { is_tender: true })
    contactTags.data || tendertTags.data
      ? (this.tagsItems = [...contactTags.data, ...tendertTags.data])
      : null
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
      return this.settingsTable.settings.map((row) => row.name)
    },
    visibleColumns() {
      return this.settingsTable.settings.filter(
        (column) => column.hidden === false,
      )
    },
    filteredTenders() {
      const columns = this.selectedColumnsNames
      const newArr = []
      this.currentTenders.forEach((row) => {
        let fullObj = {
          id: row.id,
          isTender: row.contract.is_tender,
          isActive: row.is_active,
          purchaseIds: [...row.purchase_ids],
          caption: row.caption,
        }
        // contract{}, shipment{}, inspection{}
        Object.keys(row).forEach((stage) => {
          if (row[stage]) {
            const stageObj = Object.keys(row[stage]).reduce((obj, key) => {
              const objKey = `${stage}.${key}`
              if (columns.includes(objKey)) {
                obj[objKey] = row[stage][key]
              }
              return obj
            }, {})
            fullObj = {
              ...fullObj,
              ...stageObj,
            }
          }
        })
        newArr.push(fullObj)
      })
      return newArr
    },
    createContentTableCells() {
      return this.filteredTenders.map((tender) => {
        const formatedTenderData = []

        this.visibleColumns
          .map((column) => column.name)
          .forEach((propertyName) => {
            switch (propertyName) {
            case 'contract.date':
            case 'shipment.date':
            case 'shipment.end_date':
              formatedTenderData.push(
                `${tender[propertyName] ? formatToDateRu(tender[propertyName]) : ''}`,
              )
              break
            case 'contract.procuring':
              formatedTenderData.push(`
                Контракт — ${tender[propertyName].contract.amount} / ${formatToDateRu(tender[propertyName].contract.date)} <br>
                Гарантия — ${tender[propertyName].guarantee.amount} / ${formatToDateRu(tender[propertyName].contract.date)}
              `)
              break
            case 'contract.equipment':
            case 'shipment.equipment':
              formatedTenderData.push(`
                ${
  tender[propertyName] && tender[propertyName].length > 0
    ? `
                  <table style="height: 100%">
                    <thead>
                      <tr>
                        <th style="min-width: 255px;"></th>
                        <th style="min-width: 100px;"></th>
                        <th style="min-width: 80px;"></th>
                        <th style="min-width: 100px;"></th>
                      </tr>
                    </thead>
                    <tbody>
                    ${tender[propertyName]
    .map(
      (item) =>
        `<tr>
                        <td><div style="width: 255px; height: 100%; overflow-wrap:break-word; padding-right: 3px;">${item.name} ${item.variation}</div></td>
                        <td><div style="width: 100px; height: 100%; overflow-wrap:break-word;">${item.price}₽</div></td>
                        <td><div style="width: 80px; height: 100%; overflow-wrap:break-word;">${item.count}шт</div></td>
                        <td><div style="width: 100px; height: 100%; overflow-wrap:break-word; text-align: right;">${item.price * item.count}₽</div></td>
                      </tr>`,
    )
    .join('')}
                    </tbody>
                  </table>
                  `
    : ''
}
              `)
              break
            case 'contract.addresses':
            case 'contract.contacts':
              formatedTenderData.push(`
                ${tender[propertyName] ? tender[propertyName].join(',') : ''}
              `)
              break
            case 'contract.terms':
              formatedTenderData.push(`
                ${tender[propertyName].date ? formatToDateRu(tender[propertyName].date) : tender[propertyName].note}
              `)
              break
            case 'contract.tender_link':
              formatedTenderData.push(
                `${tender[propertyName] ? tender[propertyName] : ''}`,
              )
              break
            case 'inspection.approved':
            case 'inspection.getting_signing_documents':
              formatedTenderData.push(tender[propertyName] ? 'Да' : 'Нет')
              break
            case 'inspection.payments':
              formatedTenderData.push(
                tender[propertyName] && tender[propertyName].length > 0
                  ? `
                  <table style="height: 100%;">
                    <thead>
                      <tr>
                        <th style="min-width: 150px;"></th>
                        <th style="min-width: 250px;"></th>
                        <th style="min-width: 100px;"></th>
                      </tr>
                    </thead>
                    <tbody>
                    ${tender[propertyName]
    .map(
      (item) =>
        `<tr>
                        <td><div style="width: 150px; height: 100%; overflow-wrap: break-word; padding-right: 3px;">${item.payment}₽</div></td>
                        <td><div style="width: 250px; height: 100%; overflow-wrap:break-word;">${item.caption}</div></td>
                        <td><div style="width: 100px; height: 100%; overflow-wrap: break-word; padding-right: 6px;">${item.date ? formatToDateRu(formatFromDatePicker(item.date)) : 'Нет даты'}</div></td>
                      </tr>`,
    )
    .join('')}
                    </tbody>
                  </table>
                `
                  : '',
              )
              break
            case 'contract.pay_type': {
              let value = ''
              if (tender[propertyName] === 0) value = 'Оплата по факту'
              if (tender[propertyName] === 1) value = 'Предоплата'
              if (tender[propertyName] === 2) value = 'Постоплата'
              formatedTenderData.push(value)
              break
            }
            case 'contract.tags':
              formatedTenderData.push(` 
                ${
  tender['contract.tags'] && this.tagsItems.length > 0
    ? tender['contract.tags']
      .map((tag) => {
        const currentTag = this.tagsItems.find(
          (t) => t.id === tag,
        )
        return `
                        <div style="padding: 0 12px; height: calc(var(--v-chip-height) + 0px); border-width: 0; border-radius: 9999px;">
                          <span class="mdi mdi-star" style="color: ${currentTag.color}; margin-right: 3px"></span>
                          ${currentTag.name}
                        </div>
                      `
      })
      .join(' ')
    : ''
}
              `)
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

  watch: {
    async statusFilter() {
      await this.getCurrentTenders()
    },
    async tags() {
      await this.getCurrentTenders()
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
    async deleteTender(id) {
      await customFetch(this, deleteContract, id)
    },
    async getCurrentTenders() {
      const responseData = await customFetch(this, getContracts, {
        search: this.searchText,
        start: this.start,
        length: this.length,
        is_active: this.statusFilter,
        tags: JSON.stringify(this.tags),
      })
      if (responseData) {
        const { records_total, records_filtered, data, additional_data } =
          responseData
        this.totalTenders = records_filtered
        this.totalPages = Math.ceil(this.totalTenders / this.length)
        for (const tender of data) {
          if (tender.contract?.equipment.length > 0) {
            for (const [index, equip] of tender.contract.equipment.entries()) {
              const equipData =
                additional_data.used_equipment_variants[
                  equip.equipment_variant_id
                ]
              tender.contract.equipment[index] = { ...equip, ...equipData }
            }
          }

          if (tender.shipment?.equipment.length > 0) {
            for (const [index, equip] of tender.shipment.equipment.entries()) {
              const equipData =
                additional_data.used_equipment_variants[
                  equip.equipment_variant_id
                ]
              tender.shipment.equipment[index] = { ...equip, ...equipData }
            }
          }

          if (tender?.inspection?.payments) {
            tender.inspection.payments.forEach((payment) =>
              payment.date !== 0
                ? (payment.date = formatToDate(payment.date))
                : 0,
            )
            console.log(tender.inspection.payments)
          }
        }
        this.tenders = [...data]
      }
    },
  },
}
</script>

<style scoped>
.table__wrapper {
  padding: 0px 35px 30px 20px;
}

.filters__list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-mobile {
  width: 300px;
}

.filter-status {
  max-width: 200px;
}

.filter-tags {
  max-width: 350px;
}

@media (max-width: 767px) {
  .table__wrapper {
    padding: 0 10px;
  }

  .filter-status {
    max-width: 350px;
  }
}
</style>
