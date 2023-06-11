<template>
  <div class="d-flex justify-space-between">
    <div class="table mr-16">
      <div class="table__title d-flex justify-space-between">
        <h2 class="text-h4 mb-8">Тендеры</h2>
        <div>
          <v-btn 
            @click="openNewTenderModal"
            class="mr-5"
            color="primary"
          >
            Добавить тендер
          </v-btn>
          <v-btn 
            v-if="!isTableEdit"
            @click="startEditTable"
          >
            Редактировать
          </v-btn>
        </div>
      </div>
      <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-left" v-for="column in selectedColumns" :key="column.id">
            {{ column.value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="tenders-none" v-if="!rows.length">Тендеров нет</tr>
        <tr v-for="row in sortedRows" :key="row.id" v-else>
          <td
            v-for="item in selectedColumns"
            :key="item.name"
            @click="openTenderModal(item.stage, row)"
            style="cursor: pointer;"
          >
            <div v-html="renderTableCell(item.name, row)"></div>
          </td>
        </tr>
      </tbody>
      </v-table>
      <ul class="posts__pagination">
        <li class="posts__pagination-item" v-for="pageNumber in totalPages" :key="pageNumber">
          <button :class="{ 'current-page': pageNumber === page }" @click="changePage(pageNumber)">
            {{ pageNumber }}
          </button>
        </li>
      </ul>
    </div>
    <div class="edit-table ml-16">
      <div class="edit-table__content" v-if="isTableEdit">
        <!-- <v-btn class="w-100" @click="cancelEditTable">Отменить изменения</v-btn> -->
        <v-row class="mt-2">
          <v-col cols="5">
            <v-btn @click="endEditTable">Назад</v-btn>
          </v-col>
          <v-col cols="7">
            <v-btn color="primary w-100" @click="selectColumnsNames">Сохранить</v-btn>
          </v-col>
        </v-row>
        <v-card
          class="mx-auto mt-8 pa-3"
          min-width="200"
        >
          <h3 class="text-h6">Столбцы</h3>
          <draggable v-model="settingsTable">
              <template v-slot:item="{item}">
                <div class="d-flex align-center mb-2" style="cursor: grab;">
                  <div class="mr-4">
                    <v-btn
                      v-if="item.hidden"
                      title="Скрыт"
                      @click="columnHidden(item.name)"
                    >
                      <v-icon icon="mdi-eye-off" size="large"></v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      title="Активен"
                      @click="columnHidden(item.name)"
                    >
                      <v-icon icon="mdi-eye" size="large"></v-icon>
                    </v-btn>
                  </div>
                  <div>
                      {{item.value}}
                  </div>
                </div>
              </template>
          </draggable>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { setSettingsTable, getSettingsTable } from "@/api"

import formatToDate from '@/helpers/formatToDate'

import Draggable  from "vue3-draggable"

export default {
  components: { Draggable, },

  name: 'tenders-table',
  props: {
    tenders: {
      type: Object, 
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true
    }
  },
  emits: ['editTender', 'createTender', 'change'],

  async mounted() {
    // получаем настройки таблицы с сервера и после обновляем рендер таблицы
    // const settingsData = await getSettingsTable()
    const settingsData = null
    settingsData ? this.settingsTable = settingsData : '' 
    this.setSelectColumnsNames()
  },
  data: () => ({
    isTableEdit: false,
    selectedColumns: [],
    selectedColumnsNames: [],
    sortedRows: [],
    // settingsTable: [],
    // стандартные настройки
    settingsTable: [
      {
        name: 'contract_seller_name',
        value: 'Имя продавца',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'contract_customer_name',
        value: 'Имя клиента',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'contract_procuring',
        value: 'Контракт',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'contract_equipment',
        value: 'Оборудование в контракте',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'contract_number',
        value: 'Число контракта',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'contract_date',
        value: 'Дата контракта',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'contract_terms',
        value: 'Условия контракта',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'contract_addresses',
        value: 'Адреса',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'contract_contacts',
        value: 'Контакты',
        hidden: false,
        stage: 'contract',
      },
      {
        name: 'shipment_date',
        value: 'Дата отгрузки',
        hidden: false,
        stage: 'shipment',
      },
      {
        name: 'shipment_equipment',
        value: 'Отгрузка оборудования',
        hidden: false,
        stage: 'shipment',
      },
      {
        name: 'inspection_payment',
        value: 'Оплата',
        hidden: false,
        stage: 'inspection',
      },
      {
        name: 'inspection_penalties',
        value: 'Штраф',
        hidden: false,
        stage: 'inspection',
      },
      {
        name: 'inspection_approved',
        value: 'Одобрено',
        hidden: false,
        stage: 'inspection',
      },
    ],
  }),
  computed: {
    rows() {
      return [...this.tenders]
    }
  },
  watch: {
    rows() {
      this.sortRows()
    }
  },
  methods: {
    changePage(pageNumber) {
      this.$emit('change', pageNumber)
    },
    openTenderModal(stage, tender) {
      this.$emit('editTender', {
        stage: stage,
        tender: {...tender}
      })
    },
    openNewTenderModal() {
      this.$emit('createTender')
    },
    startEditTable() {
      this.isTableEdit = true
    },
    endEditTable() {
      this.isTableEdit = false
    },
    cancelEditTable() {
    },
    selectColumns() {
      this.selectedColumns = this.settingsTable.filter(row => !row.hidden)
    },
    sortRows() {
      const columns = this.selectedColumnsNames
      const newArr = []
      this.rows.forEach(row => {
        let fullObj = {
          id: row.id,
          stage: row.stage,
        }
        // contract{}, shipment{}, inspection{}
        const stageObg = Object.keys(row)
          .forEach(stage => {
            if (row[stage]) {
              const stageObj = Object.keys(row[stage])
                .reduce((obj, key) => {
                  const objKey = `${stage}_${key}`
                  if (columns.includes(objKey)) {
                    obj[objKey] = row[stage][key]
                  }
                  return obj
                }, {})
                fullObj = {
                  ...fullObj,
                  ...stageObj
                }
                // console.log(fullObj)
            }
          })
        newArr.push(fullObj)
      })
      console.log(newArr)
      this.sortedRows = newArr
      // со свойствами без приставок
      // const filteredColumns = Object.keys(row)
      //   .reduce((obj, key) => {
      //     if (columns.includes(key)) {
      //       obj[key] = row[key]
      //     }
      //     return obj
      //   }, {})
      //   newArr.push(filteredColumns)
      // })
      // console.log(newArr)
      // return newArr
    },
    setSelectColumnsNames() {
      this.selectedColumnsNames = this.settingsTable.filter(row => !row.hidden).map(row => row.name)
      this.selectColumns()
      this.sortRows()
    },
    async selectColumnsNames() {
      // тут подставить метод по отправке настроек на сервер
      await setSettingsTable(this.settingsTable)
      // обновляем настройки
      this.settingsTable = await getSettingsTable()
      this.setSelectColumnsNames()
    },
    columnHidden(name) {
      const column = this.settingsTable.find(item => item.name === name)
      column.hidden = !column.hidden
    },
    renderTableCell(name, row) {
      switch (name) {
        case 'contract_date':
        case 'shipment_date':
          return `${row[name] ? formatToDate(row[name]) : ''}`
          break
        case 'contract_procuring':
          return `
            Контракт — ${row[name].contract.amount} / ${formatToDate(row[name].contract.date)} <br>
            Гарантия — ${row[name].guarantee.amount} / ${formatToDate(row[name].contract.date)}
          `
          break
        case 'contract_equipment':
        case 'shipment_equipment':
          return `
            ${
              row[name] 
              ? row[name] 
                .map(item => `${item.name} ${item.variation} — ${item.price} X ${item.count}` )
                .join('<br>')
              : ''
            }
          `
          break
        case 'contract_addresses':
        case 'contract_contacts':
          return `
            ${row[name] ? row[name] : ''}
          `
          break
        case 'contract_terms':
          return `
            ${row[name].date ? formatToDate(row[name].date) : row[name].note}
          `
          break
        case 'inspection_approved':
          return row[name] ? 'Одобрено' : 'Неодобрено'
        default:
        return `${row[name] ? row[name] : ''}`
      }
    }
  },
}
</script>

<style scoped>
.posts__pagination {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.posts__pagination-item button {
  border: 1px solid rgb(182, 182, 182);
  border-radius: 5px;
  color: #000;
  background-color: #fff;
  width: 38px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.current-page {
  border: 2px solid #3b3b3b !important;
}
.edit-table {
  max-width: 300px;
}
.table {
  max-width: 1100px;
  min-width: 380px;
  overflow-x: auto;
}

.tenders-none {
  height: 150px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}

tbody tr:hover {
  opacity: 0.6;
}

td,th {
  vertical-align: top;
  min-width: 220px;
}

td div {
  padding-top: 10px;
  padding-bottom: 10px;
}

.v-table .v-table__wrapper > table > tbody > tr > td {
  border-left: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th {
  border-left: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>