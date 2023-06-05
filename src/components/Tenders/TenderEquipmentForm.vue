<template>
  <div>
    <v-card>
        <v-card-title>
          <span class="text-h5">Редактирование оборудования</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="equipment.name" label="Название"/>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="equipment.variation" label="Вид"/>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="equipment.price" label="Стоимость"/>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="equipment.count" label="Количетсво"/>
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
              @click="closeEditEquipment"
            >
              Закрыть
            </v-btn>
            <v-btn
              color="primary"
              @click="saveEquipmentItem"
            >
              Сохранить
            </v-btn>
        </v-card-actions>
      </v-card>
  </div>
</template>

<script>
export default {
  name: 'equipment-form',
  props: {
      item: {
        type: Object,
        required: true
      }
    },

  mounted() {
    this.equipment.name = this.item.name
    this.equipment.count = this.item.count
    this.equipment.price = this.item.price
    this.equipment.variation = this.item.variation
  },
  
  data: () => ({
    equipment:{
      name: '',
      count: '',
      price: '',
      variation: ''
    },
  }),

  methods: {
    closeEditEquipment() {
      this.$emit('close')
    },
    saveEquipmentItem() {
      this.$emit('saveEqip', {
        id: this.item.index,
        value: {...this.equipment}
      })
    }
  }
}
</script>

<style scoped>

</style>