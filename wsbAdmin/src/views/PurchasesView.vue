<template>
  <div
    v-if="access.purchases > 0"
    class="h-100"
    style="padding-top: 10vh"
  >
    <div class="table__wrapper w-100">
      <TendersTable
        :filtered-tenders="filteredTenders"
        :content-cells="createContentTableCells"
        :settings="[...settingsTable.settings]"
        :creating="false"
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
            Закупки
          </h1>
        </template>
        <template #filters>
          <div class="mb-6">
            <AccordionContent>
              <template #title>
                Фильтры
              </template>
              <AsyncSelect
                v-model="filterValue"
                :items="tendersOptions"
                item-value="id"
                item-title="value"
                variant="solo-filled"
                label="Выберите договор"
                hint="Фильтр по договорам"
                class="filter-contracts"
                :stop-async="stopLoadOptions"
                :is-loading="isOptionsLoading"
                @load="loadMoreOptions"
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
      <PurchaseForm
        :tender="currentTender"
        :watch-tender="true"
        @close="closeTenderModal"
        @close-with-tender="setFilterValue"
        @save="saveTender"
        @create="createTender"
      />
    </v-dialog>
  </div>
</template>

<script>
import { FRONTEND_VERSION } from '../variables'
import { setSettingsTable, getSettingsTable } from '@/api'
import { customFetch, getTenders, putTender, postTender } from '@/api'

import formatToDateRu from '@/helpers/formatToDateRu'

import { mapState } from 'pinia'
import { useAuthStore } from '@/plugins/store/auth'

import TendersTable from '@/components/Tables/TendersTable.vue'
import PurchaseForm from '@/components/Purchases/PurchaseForm.vue'
import AsyncSelect from '@/components/Tables/AsyncSelect.vue'
import AccordionContent from '../components/UI/AccordionContent.vue'

const settings = {
  version: FRONTEND_VERSION,
  settings: [
    {
      name: 'sellerName',
      value: 'Имя продавца',
      hidden: false,
    },
    {
      name: 'customerName',
      value: 'Имя клиента',
      hidden: false,
    },
    {
      name: 'equipment',
      value: 'Оборудование',
      hidden: false,
    },
    {
      name: 'shipment_equipment',
      value: 'Отгружено',
      hidden: false,
    },
    {
      name: 'date',
      value: 'Дата заказа',
      hidden: false,
    },
    {
      name: 'production_date',
      value: 'Дата изготовления',
      hidden: false,
    },
    {
      name: 'warehouse_date',
      value: 'Дата на складе',
      hidden: false,
    },
    {
      name: 'amount',
      value: 'Сумма',
      hidden: false,
    },
    {
      name: 'payType',
      value: 'Тип оплаты',
      hidden: false,
    },
    {
      name: 'delivery_address',
      value: 'Адрес доставки',
      hidden: false,
    },
  ],
}

export default {
  components: { TendersTable, PurchaseForm, AsyncSelect, AccordionContent },

  data: () => ({
    pageName: 'purchases',
    tenderModal: false,
    startTender: 0,
    lenthTenders: 5,

    searchText: '',
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

    filterValue: null,
    tendersOptions: [{ id: null, value: 'Все' }],
    maxOptions: 1,
    stopLoadOptions: false,
    isOptionsLoading: false,
  }),

  watch: {
    async filterValue() {
      await this.getCurrentTenders()
    },
  },

  async mounted() {
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

    const responseData = await customFetch(
      this,
      getTenders,
      'tenders',
      null,
      '',
      this.startTender,
      this.lenthTenders,
    )
    if (responseData) {
      const { records_filtered, data: tenders } = responseData
      this.maxOptions = records_filtered + 1
      this.startTender += this.lenthTenders
      this.tendersOptions = [
        ...this.tendersOptions,
        ...tenders.map((tender) => {
          return {
            id: tender.id,
            value: this.tenderToValue(tender),
          }
        }),
      ]
    }

    this.setFilterFromParamSearch()
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
        // id, date, amount, equipment
        const finalColumns = Object.keys(row).reduce((obj, key) => {
          if (columns.includes(key)) {
            obj[key] = row[key]
          }
          return obj
        }, {})
        finalColumns.id = row.id
        finalColumns.tenderId = row.tender_id
        finalColumns.caption = row.caption
        finalColumns.caption = row.caption
        finalColumns.contractDate = row.contractDate
        newArr.push(finalColumns)
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
            case 'date':
            case 'production_date':
            case 'warehouse_date':
              formatedTenderData.push(
                `${tender[propertyName] ? formatToDateRu(tender[propertyName]) : ''}`,
              )
              break
            case 'amount':
              formatedTenderData.push(`
                <div style="margin-bottom: 5px;">Заявлено: ${tender.equipment.length > 0 ? tender.equipment.reduce((total, item) => total + item.price * item.count, 0) : 0}₽</div>
                <div>Отгружено: ${tender.shipment_equipment.length > 0 ? tender.shipment_equipment.reduce((total, item) => total + item.price * item.count, 0) : 0}₽</div>
              `)
              break
            case 'equipment':
            case 'shipment_equipment':
              formatedTenderData.push(`
                ${
  tender[propertyName].length > 0
    ? `
                    <table style="height: 100%;">
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
            case 'payType':
              let value = ''
              if (tender[propertyName] === 0) value = 'Оплата по факту'
              if (tender[propertyName] === 1) value = 'Предоплата'
              if (tender[propertyName] === 2) value = 'Постоплата'
              formatedTenderData.push(value)
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
    async loadMoreOptions(message) {
      console.log(message)
      if (this.tendersOptions.length >= this.maxOptions) {
        this.stopLoadOptions = true
        return
      }
      this.isOptionsLoading = true
      const responseData = await customFetch(
        this,
        getTenders,
        'tenders',
        null,
        '',
        this.startTender,
        this.lenthTenders,
      )
      if (responseData) {
        const { data: tenders } = responseData
        this.tendersOptions = [
          ...this.tendersOptions,
          ...tenders.map((tender) => {
            return {
              id: tender.id,
              value: this.tenderToValue(tender),
            }
          }),
        ]
        this.startTender += this.lenthTenders
        this.isOptionsLoading = false
      }
    },
    updateSelectValue(value) {
      console.log(value)
      this.errorRequired = ''
    },
    tenderToValue(tender) {
      return `${tender.contract.customer_name ? tender.contract.customer_name + ',' : ''} ${tender.contract.date ? formatToDateRu(tender.contract.date) + ',' : ''} ${tender.contract.procuring.contract.amount ? tender.contract.procuring.contract.amount + ',' : ''} ${tender.contract.partner ? tender.contract.partner + ',' : ''} ${tender.contract.inn ? tender.contract.inn : ''}`
    },
    setFilterFromParamSearch() {
      const paramSearch = window.location.search
      if (paramSearch.includes('id')) {
        const tenderId = paramSearch.slice(paramSearch.indexOf('=') + 1)
        this.filterValue = Number(tenderId)
      }
    },
    setFilterValue(tenderId) {
      this.filterValue = Number(tenderId)
      this.tenderModal = false
    },
    async searchTenders(searchText) {
      this.searchText = searchText
      await this.getCurrentTenders()
    },
    closeTenderModal() {
      this.tenderModal = false
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
      console.log('чепез emit')
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
        '',
        this.searchText,
        this.start,
        this.length,
        this.filterValue,
      )
      if (responseData) {
        const { records_total, records_filtered, data, additional_data } =
          responseData
        this.totalTenders = records_filtered
        this.totalPages = Math.ceil(this.totalTenders / this.length)
        for (const item of data) {
          const currentTender = additional_data.used_tenders[item.tender_id]
          item.customerName = currentTender.contract.customer_name
          item.contractDate = currentTender.contract.date
          item.sellerName = currentTender.contract.seller_name
          item.payType = currentTender.contract.pay_type
          if (currentTender.contract.equipment.length > 0) {
            item.equipment = [...currentTender.contract.equipment]
            for (const [index, equip] of item.equipment.entries()) {
              const equipData =
                additional_data.used_equipment_variants[
                  equip.equipment_variant_id
                ]
              item.equipment[index] = { ...equip, ...equipData }
            }
          } else {
            item.equipment = []
          }
          if (currentTender?.shipment?.equipment?.length > 0) {
            item.shipment_equipment = [...currentTender.shipment.equipment]
            for (const [index, equip] of item.shipment_equipment.entries()) {
              const equipData =
                additional_data.used_equipment_variants[
                  equip.equipment_variant_id
                ]
              item.shipment_equipment[index] = { ...equip, ...equipData }
            }
          } else {
            item.shipment_equipment = []
          }
        }
        this.tenders = [...data]
      }
    },
  },
}
</script>

<style scoped>
.filter-contracts {
  max-width: 422px;
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
