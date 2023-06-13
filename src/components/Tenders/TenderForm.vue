<template>
  <div>
    <v-card style="overflow-y: auto;">
    <v-card-title>
      <span class="text-h5" v-if="isNewTender">Новый тендер</span>
      <span class="text-h5" v-else>Тендер</span>
    </v-card-title>
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab value="contract"> <v-icon class="mr-2" size="large" icon="mdi-check-circle" title="Этап активен" color="green"></v-icon> Подписание</v-tab>
      <v-tab value="shipment"> 
        <v-icon class="mr-2" size="large" icon="mdi-check-circle" width="30" v-if="stage > 0" title="Этап активен" color="green"></v-icon> 
        <v-icon class="mr-2" size="large" icon="mdi-minus-circle" v-else title="Этап неактивен" color="error"></v-icon> 
        Отгрузка
      </v-tab>
      <v-tab value="inspection">
        <v-icon class="mr-2" size="large" icon="mdi-check-circle" width="30" v-if="stage > 1" title="Этап активен" color="green"></v-icon> 
        <v-icon class="mr-2" size="large" icon="mdi-minus-circle" v-else title="Этап неактивен" color="error"></v-icon> 
        Приемка
      </v-tab>
    </v-tabs>
    <v-window v-model="tab" style="overflow-y: auto; height: 75vh;">
        <v-window-item value="contract">
          <v-card-text>
            <v-container>
              <v-form ref="form1">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="contract.seller_name"
                      label="Имя продавца"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="contract.customer_name"
                      label="Имя клиента"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="contract.number"
                      label="Номер договора"
                      hint="Укажите целое число"
                      :rules="notDecimal"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="contract.date"
                      :rules="isValidDate"
                      label="Дата"
                      hint="Дата в формате дд.мм.гггг — 02.06.2023"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <p class="line-title">Условия</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="contract.terms.date"
                          :rules="isValidDate"
                          label="Дата"
                          hint="Дата в формате дд.мм.гггг — 02.06.2023"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="contract.terms.note"
                          label="Примечание"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <p class="line-title">Контракт</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="contract.procuring.contract.amount"
                          label="Сумма"
                          hint="Десятичные значения указываются через точку, например 350.05"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="contract.procuring.contract.date"
                          :rules="isValidDate"
                          label="Дата"
                          hint="Дата в формате дд.мм.гггг — 02.06.2023"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <p class="line-title">Гарантия</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="contract.procuring.guarantee.amount"
                          label="Сумма"
                          hint="Десятичные значения указываются через точку, например 350.05"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="contract.procuring.guarantee.date"
                          :rules="isValidDate"
                          label="Дата"
                          hint="Дата в формате дд.мм.гггг — 02.06.2023"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <p class="line-title">Адреcа и контакты</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="contract.addresses"
                          label="Адрес"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="contract.contacts"
                          label="Контакт"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <div>
                      <span class="mr-4 line-title">Оборудование</span>
                      <v-btn color="primary" title="Добавить" @click="addEquipment">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <template v-for="item in contract.equipment">
                      <div class="pa-2 d-flex align-center justify-space-between">
                        <div class="text-h6">{{item?.name}} {{item?.variation}}<span v-if="item.price || item.count"> — {{item?.price}} руб / {{item?.count }} шт</span></div>
                        <div class="d-flex ml-4" style="margin-left: auto;">
                          <v-btn @click="editEqipment(contract.equipment.indexOf(item), item)" color="primary" title="Изменить"><v-icon icon="mdi-pencil"></v-icon></v-btn>
                          <v-btn @click="deleteEqipment(contract.equipment.indexOf(item))" color="red" title="Удалить" class="ml-2"><v-icon icon="mdi-delete"></v-icon></v-btn>
                        </div>
                      </div>
                    </template>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
        </v-window-item>

        <v-window-item value="shipment">
          <v-card-text>
          <v-container>
            <v-row v-if="stage === 0">
              <v-col cols="12">
                <v-btn
                  color="primary"
                  variant="text"
                  block
                  @click="stage = 1"
                >
                  Начать этап
                </v-btn>
            </v-col>
            </v-row>
            <v-form ref="form2" v-if="stage > 0">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="shipment.date"
                      :rules="isValidDate"
                      label="Дата"
                      hint="Дата в формате дд.мм.гггг — 02.06.2023"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <div>
                      <span class="mr-4 line-title">Оборудование</span>
                      <v-btn color="primary" title="Добавить" @click="addEquipment">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <template v-for="item in shipment.equipment">
                      <div class="pa-2 d-flex align-center justify-space-between">
                        <div class="text-h6">{{item?.name}} {{item?.variation}}<span v-if="item.price || item.count"> — {{item?.price}} руб / {{item?.count }} шт</span></div>
                        <div class="d-flex ml-4" style="margin-left: auto;">
                          <v-btn @click="editEqipment(shipment.equipment.indexOf(item), item)" color="primary" title="Изменить"><v-icon icon="mdi-pencil"></v-icon></v-btn>
                          <v-btn @click="deleteEqipment(shipment.equipment.indexOf(item))" color="red" title="Удалить" class="ml-2"><v-icon icon="mdi-delete"></v-icon></v-btn>
                        </div>
                      </div>
                    </template>
                  </v-col>  
                </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        </v-window-item>

        <v-window-item value="inspection">
          <v-card-text>
            <v-container>
            <v-row v-if="stage < 2">
              <v-col cols="12">
                <v-btn
                  color="primary"
                  variant="text"
                  block
                  @click="stage = 2"
                >
                  Начать этап
                </v-btn>
            </v-col>
            </v-row>
            <v-form ref="form2" v-if="stage > 1">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="inspection.penalties"
                      label="Штрафы"
                      hint="Десятичные значения указываются через точку, например 350.05"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="inspection.payment"
                      label="Оплата"
                      hint="Десятичные значения указываются через точку, например 350.05"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="inspection.approved"
                      :items="['Да', 'Нет']"
                      label="Одобрено — Да/Нет"
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
          @click="closeTenderModal"
        >
          Закрыть
        </v-btn>
        <v-btn
          color="primary"
          @click="saveStage"
          v-if="isNewTender"
        >
          Создать
        </v-btn>
        <v-btn
          color="primary"
          @click="saveStage"
          v-else
        > 
        Сохранить
      </v-btn>
      </v-card-actions>
    </v-card>
  
    <v-dialog v-model="dialogEquipment" width="55%">
        <TenderEquipmentForm @saveEqip="saveCurrentEqipment" @close="closeEditEquipment" :item="currentEqipment"/>
    </v-dialog>
  </div>
</template>

<script>
import validateDate from '@/helpers/validateDate'
import currentDate from '@/helpers/currentDate'
import formatToDate from '@/helpers/formatToDate'
import formatFromDate from '@/helpers/formatFromDate'

import TenderEquipmentForm from './TenderEquipmentForm.vue'

export default {
    components: { TenderEquipmentForm },

    name: "tender-form",
    props: {
      tender: {
        type: Object,
        required: true
      }
    },
    emits: ['close', 'save', 'create'],

    mounted() {
      if (Object.keys(this.tender).length > 0) {

        this.tab = this.tender.stage
        this.id = this.tender.tender.id

        this.contract.seller_name = this.tender.tender.contract_seller_name
        this.contract.customer_name = this.tender.tender.contract_customer_name
        this.contract.procuring.contract.amount = this.tender.tender.contract_procuring.contract.amount.toString()
        this.contract.procuring.contract.date = formatToDate(this.tender.tender.contract_procuring.contract.date)
        this.contract.procuring.guarantee.amount = this.tender.tender.contract_procuring.guarantee.amount.toString()
        this.contract.procuring.guarantee.date = formatToDate(this.tender.tender.contract_procuring.guarantee.date)
        this.contract.equipment = [...this.tender.tender.contract_equipment]
        this.contract.number = this.tender.tender.contract_number.toString()
        this.contract.date = formatToDate(this.tender.tender.contract_date)
        this.contract.terms.date = formatToDate(this.tender.tender.contract_terms.date)
        this.contract.terms.text = this.tender.tender.contract_terms.text
        this.contract.addresses = this.tender.tender.contract_addresses.join(',')
        this.contract.contacts = this.tender.tender.contract_contacts.join(',')

        if (this.tender.tender.inspection_penalties) {
          this.inspection.penalties = this.tender.tender.inspection_penalties.toString()
          this.inspection.payment = this.tender.tender.inspection_payment.toString()
          this.inspection.approved = this.tender.tender.inspection_approved ? 'Да' : 'Нет'
        } else {
          this.stage = 1
        }

        if (this.tender.tender.shipment_date) {
          this.shipment.date = formatToDate(this.tender.tender.shipment_date)
          this.shipment.equipment = [...this.tender.tender.shipment_equipment]
        } else {
          this.stage = 0
        }

      } else {
        this.isNewTender = true
        this.id = 0
        this.stage = 0
      }
    },

    data: () => ({
      isNewTender: false,
      tab: 'contract',
      dialogEquipment: false,
      currentEqipment: {},
      isValidDate: [
        value => {
          return validateDate(value)
        }
      ],
      notDecimal: [
        value => {
          if (value.includes('.') || value.includes(',')) {
            return 'Номер договора не должен быть десятичным числом'
          } 
          return true
        }
      ],
      required: [
          value => {
              if (value)
                  return true;
              return "Заполните поле";
          },
      ],
      id: null,
      stage: 2,
      contract: {
        seller_name: '',
        customer_name: '',
        procuring: {
          contract: { amount: '0', date:  formatToDate( currentDate() ) },
          guarantee: { amount: '0', date: formatToDate( currentDate() ) },
        },
        equipment: [],
        number: '0',
        date: formatToDate( currentDate() ),
        terms: {
          date: formatToDate( currentDate() ),
          note: '',
        },
        addresses: '',
        contacts: '',
      },
      shipment: {
        date: formatToDate( currentDate() ),
        equipment: [],
      },
      inspection: {
        penalties: '0',
        payment: '0',
        approved: 'Нет',
      },
    }),

    methods: {
      closeTenderModal() {
        this.$emit('close')
      },
      formatTypeEquipment(array) {
        return array.map(item => {
          return {
            ...item,
            count: Number(item.count),
            price: Number(item.price),
          }
        })
      },
      saveStage() {
        const tender = {
          id: this.id,
          contract: {
            seller_name: this.contract.seller_name,
            customer_name: this.contract.customer_name,
            procuring: {
              contract: { 
                amount: Number(this.contract.procuring.contract.amount),
                date: formatFromDate(this.contract.procuring.contract.date)
                },
              guarantee: { 
                amount: Number(this.contract.procuring.guarantee.amount),
                date: formatFromDate(this.contract.procuring.guarantee.date)
              }
            },
            equipment: this.formatTypeEquipment(this.contract.equipment),
            number: Number(this.contract.number),
            date: formatFromDate(this.contract.date),
            terms: {
              date: formatFromDate(this.contract.terms.date),
              note: this.contract.terms.note,
            },
            addresses: this.contract.addresses.split(','),
            contacts: this.contract.contacts.split(',')
          },
          
          shipment: this.stage < 1 ? null : {
            date: formatFromDate(this.shipment.date),
            equipment: this.formatTypeEquipment(this.shipment.equipment)
          },
          inspection: this.stage < 2 ? null : {
            penalties: Number(this.inspection.penalties),
            payment: Number(this.inspection.payment),
            approved: this.inspection.approved === 'Да' ? true : false,
          },
        }
        if (this.isNewTender) {
          this.$emit('create', tender)
        } else {
          this.$emit('save', tender)
        }
      },
      closeEditEquipment() {
        this.dialogEquipment = false
      },
      addEquipment() {
        this[this.tab].equipment.push({name: 'Новое оборудование', price: '', count: '', variation: ''})
      },
      deleteEqipment(index) {
        this[this.tab].equipment.splice(index, 1)
      },
      editEqipment(index, item) {
        this.currentEqipment = {
          index: index,
          ...item
        }
        this.dialogEquipment = true
      },
      saveCurrentEqipment(item) {
        this[this.tab].equipment[item.id] = item.value
        this.dialogEquipment = false
      }
    }
}
</script>

<style scoped>
.line-title {
  font-size: 20px;
  margin-block: 15px 10px;
}
</style>