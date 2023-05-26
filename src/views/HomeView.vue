<template>
  <div class="d-flex h-100" style="padding-top: 30vh;">
    <div class="table__wrapper d-flex justify-space-between w-100" style="padding: 0 75px 30px 320px;">
      <div class="table mr-16">
        <div class="table__title d-flex justify-space-between">
          <h2 class="text-h4 mb-8">Тендеры</h2>
          <v-btn 
            v-if="!isTableEdit"
            @click="startEditTable"
          >
            Редактировать
          </v-btn>
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
          <tr v-for="row in sortedRows">
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
      
      <v-alert
      style="position: absolute; top: 60px; right: 20px; z-index: 5000;"
      v-model="alert"
      type="error"
      title="Нельзя начать новый этап"
      text="Чтобы начать новый этап, заполните все поля предыдущего"
      >
      </v-alert>
    </div>

    <v-dialog v-model="dialog" width="1366" height="839">
        <v-card style="overflow-y: auto;">
        <v-card-title>
          <span class="text-h5">Тендер</span>
        </v-card-title>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab value="one"> <v-icon class="mr-2" size="large" icon="mdi-check-circle" title="Этап активен" color="green"></v-icon> Подписание</v-tab>
          <v-tab value="two"> 
            <v-icon class="mr-2" size="large" icon="mdi-check-circle" width="30" v-if="stage2" title="Этап активен" color="green"></v-icon> 
            <v-icon class="mr-2" size="large" icon="mdi-minus-circle" v-else title="Этап неактивен" color="error"></v-icon> 
            Отгрузка
          </v-tab>
          <v-tab value="three">
            <v-icon class="mr-2" size="large" icon="mdi-check-circle" width="30" v-if="stage3" title="Этап активен" color="green"></v-icon> 
            <v-icon class="mr-2" size="large" icon="mdi-minus-circle" v-else title="Этап неактивен" color="error"></v-icon> 
            Приемка
          </v-tab>
        </v-tabs>
        <v-window v-model="tab" style="overflow-y: auto; height: 691px;">
            <v-window-item value="one">
              <v-card-text>
                <v-container>
                  <v-form ref="form1">
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                          v-model="contract.seller_name"
                          label="Имя продавца*"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                        v-model="contract.customer_name"
                          label="Имя клиента*"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                        v-model="contract.number"
                          label="Число*"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                        v-model="contract.date"
                          label="Дата*"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <p>Условия</p>
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                            v-model="contract.terms.date"
                              label="Дата"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              v-model="contract.terms.note"
                              label="Примечание"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <p>Контракт</p>
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                            v-model="contract.procuring.contract.amount"
                              label="Сумма*"
                              :rules="required"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                            v-model="contract.procuring.contract.date"
                              label="Дата*"
                              :rules="required"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <p>Гарантия</p>
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                            v-model="contract.procuring.guarantee.amount"
                              label="Сумма*"
                              :rules="required"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                            v-model="contract.procuring.guarantee.date"
                              label="Дата*"
                              :rules="required"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <div>
                          <span class="mr-4">Оборудование</span>
                          <v-btn color="primary" title="Добавить">
                            <v-icon size="large" icon="mdi-plus"></v-icon>
                          </v-btn>
                        </div>
                        <template v-for="item in contract.equipment">
                          <div class="pa-2 d-flex align-center">
                            <div class="text-h6">{{item?.name}} {{item?.variation}} — {{item?.price}} / {{item?.count }}</div>
                            <div class="ml-4">
                              <v-btn color="primary" title="Изменить" @click="dialogEquipment = true"><v-icon icon="mdi-pencil"></v-icon></v-btn>
                              <v-btn color="red" title="Удалить" class="ml-2"><v-icon icon="mdi-delete"></v-icon></v-btn>
                            </div>
                          </div>
                        </template>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-btn
                          color="warning"
                          variant="text"
                          @click="resetValidation"
                        >
                          Очистить валидацию
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              <small>* — заполните для перехода к следующему этапу</small>
              </v-card-text>
            </v-window-item>

            <v-window-item value="two">
              <v-card-text>
              <v-container>
                <v-row v-if="!stage2">
                  <v-col
                    cols="12"
                  >
                    <v-btn
                      color="primary"
                      variant="text"
                      block
                      @click="validate"
                    >
                      Начать этап
                    </v-btn>
                </v-col>
                </v-row>
                <v-form ref="form2" v-if="stage2">
                    <v-row>
                      <v-col
                        cols="12"
                      >
                        <p>Оборудование</p>
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              label="Сумма*"
                              :rules="required"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              label="Дата*"
                              :rules="required"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="shipment.date"
                          label="Дата*"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-btn
                          color="warning"
                          variant="text"
                          @click="resetValidation"
                        >
                          Очистить валидацию
                        </v-btn>
                      </v-col>
                    </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            </v-window-item>

            <v-window-item value="three">
              <v-card-text>
                <v-container>
                <v-row v-if="!stage2">
                  <v-col
                    cols="12"
                  >
                    <v-btn
                      color="primary"
                      variant="text"
                      block
                      v-if="!stage3"
                      @click="stage3 = true"
                    >
                      Начать этап
                    </v-btn>
                </v-col>
                </v-row>
                <v-form ref="form2" v-if="stage3">
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                          v-model="inspection.penalties"
                          label="Штрафы*"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                        v-model="inspection.payment"
                          label="Оплата*"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-select
                        v-model="inspection.approved"
                          :items="['Да', 'Нет']"
                          label="Подтверждено*"
                          :rules="required"
                        ></v-select>
                      </v-col>
                    </v-row>
                </v-form>
              </v-container>
              </v-card-text>
            </v-window-item>
          </v-window>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = false"
            >
              Закрыть
            </v-btn>
            <v-btn
              color="primary"
              @click="saveStage"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEquipment" width="55%">
      <v-card>
        <v-card-title>
          <span class="text-h5">Редактирование оборудования</span>
        </v-card-title>
        <v-card-text>
                <v-container>
                  <v-form>
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                          v-model="equipment.name"
                          label="Название"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                        v-model="equipment.variation"
                          label="Вид"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                        v-model="equipment.price"
                          label="Стоимость"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                        v-model="equipment.count"
                          label="Количетсво"
                          :rules="required"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
                </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialogEquipment = false"
            >
              Закрыть
            </v-btn>
            <v-btn
              color="primary"
              @click="saveequipmentItem"
            >
              Сохранить
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Draggable  from "vue3-draggable"
export default {
  components: { Draggable  },
  mounted() {
    this.selectColumnsNames()
  },
  data: () => ({
    equipment:{
          name:"equip2",
          count:2,
          price:3555.33,
          variation:"variation3",
          },
    contract:{
          seller_name: '',
          customer_name:"name4",
          procuring:{
          contract:{amount:3452.43,date:new Date(1684514371*1000).toLocaleDateString('ru-RU')},
          guarantee:{amount:3452.43,date:new Date(1684514371*1000).toLocaleDateString('ru-RU')},
          },
          equipment:[
          {
          name:"equip2",
          count:2,
          price:3555.33,
          variation:"variation3",
          },
          {
          name:"equip3",
          count:22,
          price:345.33,
          variation:"variation1",
          }],
          number:431,
          date: new Date(1684514371*1000).toLocaleDateString('ru-RU'),
          terms:{
          date:null,
          note:"Ещё не назначена",
          },
          addresses:["123","456"],
          contacts:["1234","1234"],
        },
        shipment:{
          date: new Date(1684516379*1000).toLocaleDateString('ru-RU'),
          equipment:[
          {
          name:"equip0",
          count:2,
          price:3555.33,
          variation:"variation3",
          },
          {
          name:"equip1",
          count:22,
          price:345.33,
          variation:"variation1",
          }],
        },
        inspection:{
          penalties:123.32,
          payment:456.33,
          approved:true,
        },
    required: [
      value => {
        if (value) return true

        return 'Заполните поле'
      },
    ],
    alert: false,
    isTableEdit: false,
    stage2: false,
    stage3: false,
    tab: "one",
    dialog: false,
    dialogEquipment: false,
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
        name: 'inspection_approved',
        value: 'Одобрено',
        hidden: false,
        stage: 'inspection',
      },
    ],
    rows: [
      {
        contract:{
          status: true,
          seller_name: 'name1',
          customer_name: 'name2',
          procuring:{
          contract:{amount:null,date:1684514371},
          guarantee:{amount:3452.43,date:null},
          },
          equipment:null,
          number:431,
          date:1684514371,
          terms:{
          date:1684514371,
          note:"text",
          },
          addresses:["123","456"],
          contacts:["1234","1234"],
        },
        shipment:{
          status: true,
          date:1684516379,
          equipment:[
          {
          name:"equip0",
          count:2,
          price:3555.33,
          variation:"variation3",
          },
          {
          name:"equip1",
          count:22,
          price:345.33,
          variation:"variation1",
          }],
        },
        inspection:{
          status: false,
          penalties:123.32,
          payment:456.33,
          approved:true,
        }
      },
      {
        contract:{
          seller_name:"",
          customer_name:"name4",
          procuring:{
          contract:{amount:3452.43,date:1684514371},
          guarantee:{amount:3452.43,date:1684514371},
          },
          equipment:[
          {
          name:"equip2",
          count:2,
          price:3555.33,
          variation:"variation3",
          },
          {
          name:"equip3",
          count:22,
          price:345.33,
          variation:"variation1",
          }],
          number:431,
          date:1684514371,
          terms:{
          date: null,
          note:"Ещё не назначена",
          },
          addresses:["123","456"],
          contacts:["1234","1234"],
        },
        shipment:{
          date:1684516379,
          equipment:[
          {
          name:"equip0",
          count:2,
          price:3555.33,
          variation:"variation3",
          },
          {
          name:"equip1",
          count:22,
          price:345.33,
          variation:"variation1",
          }],
        },
        inspection:{
          penalties:123.32,
          payment:456.33,
          approved:true,
        }
      },
    ],
    selectedColumns: [],
    selectedColumnsNames: [],
    sortedRows: [],
  }),

  computed: {
  },

  methods: {
    openTenderModal(currentStage, tender) {
      this.dialog = true
      console.log(`Этап — ${currentStage}, тендер —`, tender)
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
        let fullObj = {}
        // contract{}, shipment{}, inspection{}
        const stageObg = Object.keys(row)
          .forEach(stage => {
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
              console.log(fullObj)
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
    selectColumnsNames() {
      this.selectedColumnsNames = this.settingsTable.filter(row => !row.hidden).map(row => row.name)
      this.sortRows()
      this.selectColumns()
    },
    saveStage() {
      this.dialog = false
      console.log(this.contract)
      this.rows[1].contract = {...this.contract}
      this.sortRows()
    },
    async validate () {
        const { valid } = await this.$refs.form1.validate()

        // if (valid) this.tab = "two"
        if (valid) {
          this.stage2 = true
        } else {
          this.alert = true
          setTimeout(()=> this.alert = false, 2000)
        }
    },
    resetValidation() {
      this.$refs.form1.resetValidation()
    },
    columnHidden(name) {
      const column = this.settingsTable.find(item => item.name === name)
      column.hidden = !column.hidden
    },
    renderTableCell(name, row) {
      switch (name) {
        case 'contract_date':
        case 'shipment_date':
          return `${row[name] ? new Date(row[name]*1000).toLocaleDateString('ru-RU') : ''}`
          break
        case 'contract_procuring':
          return `
            Контракт — ${row[name].contract.amount} / ${new Date(row[name].contract.date*1000).toLocaleDateString('ru-RU')} <br>
            Гарантия — ${row[name].guarantee.amount} / ${new Date(row[name].contract.date*1000).toLocaleDateString('ru-RU')}
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
            ${row[name] ? row[name].join(',<br>') : ''}
          `
          break
        case 'contract_terms':
          return `
            ${row[name].date ? new Date(row[name].date*1000).toLocaleDateString('ru-RU') : row[name].note}
          `
          break
        default:
        return `${row[name] ? row[name] : ''}`
      }
    }
  }
}

</script>

<style scoped>
.table {
  max-width: 1100px;
  overflow-x: auto;
}
.edit-table {
  max-width: 300px;
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