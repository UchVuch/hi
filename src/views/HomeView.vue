<template>
  <div class="d-flex h-100" style="padding-top: 30vh;">
    <div class="table__wrapper w-100" style="padding: 0 75px 30px 18vw;">
      <TendersTable @show="openTenderModal" :tenders="tenders"/>
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
      <TenderForm @close="dialog = false" @save="saveTender" :tender="currentTender"/>
    </v-dialog>
  </div>
</template>

<script>
import TendersTable from "../components/Tenders/TendersTable.vue"
import TenderForm from "../components/Tenders/TenderForm.vue"
import TenderEquipmentForm from "../components/Tenders/TenderEquipmentForm.vue"
export default {
  components: { TendersTable, TenderForm, TenderEquipmentForm },
  mounted() {
    // this.selectColumnsNames()
    console.log(this.tenders)
  },
  data: () => ({
    alert: false,
    dialog: false,
    currentTender: {},
    tenders: [
    {
        id: 1,
        stage: 2,
        contract:{
          seller_name: 'name1',
          customer_name: 'name2',
          procuring:{
          contract:{amount:null,date:1674651234},
          guarantee:{amount:3452.43,date:null},
          },
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
          }
        ],
          number:431,
          date:1684454400,
          terms:{
          date:1684454400,
          note:"text",
          },
          addresses:["123","456"],
          contacts:["1234","1234"],
        },
        shipment:{
          date:1684516379,
          equipment:[
          {
          name:"equip00",
          count:2,
          price:3555.33,
          variation:"variation3",
          },
          {
          name:"equip11",
          count:22,
          price:345.33,
          variation:"variation1",
          }
        ],
        },
        inspection:{
          penalties:123.32,
          payment:456.33,
          approved:true,
        }
      },
      {
        id: 2,
        stage: 1,
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
          name:"equip03",
          count:2,
          price:3555.33,
          variation:"variation3",
          },
          {
          name:"equip13",
          count:22,
          price:345.33,
          variation:"variation1",
          }],
        },
        inspection:{
          penalties:0,
          payment:200,
          approved:false,
        }
      },
    ]
  }),

  computed: {
  },

  methods: {
    saveTender(item) {
      console.log(JSON.stringify(item))
    },
    // saveEquipmentItem(index) {
    //   this.contract.equipment[index] = {...this.equipment}
    // },
    
    openTenderModal(item) {
      this.currentTender = {...item}
      console.log(this.currentTender)
      this.dialog = true
    },
  }
}

</script>

<style scoped>
</style>