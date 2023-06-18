<template>
    <div style="padding-left: 14vw; padding-top: 100px; padding-right: 20px;" v-if="access.keys > 1">
      <div>
        <div class="text-h5 font-weight-bold mb-10"
          v-text="'Для генерации ключа введите запрос и нажмите кнопку &quot;Создать&quot;'"
        ></div>

        <v-row>
          <v-col>
            <v-text-field
              label="Заказчик"
              type="text"
              v-model="customer"
              id="customerfield"
            ></v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              label="Доп. информация"
              type="text"
              v-model="additionalInfo"
            ></v-text-field>
          </v-col>
        </v-row>

        <div
          v-for="(nonce, idx) of nonces"
          v-bind:key="idx"
        >
          <div class="d-flex mnx-2">
            <div class="flex-grow-1 d-flex align-center px-2">
              <v-text-field
                label="Запрос"
                id="noncefield"
                type="text"
                v-model="nonces[idx]"
              ></v-text-field>
            </div>

            <div class="d-flex align-center px-2">
              <v-btn
                color="error"
                v-bind:disabled="idx === 0"
                v-on:click="removeNonce(idx)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>

        <div class="d-flex mnx-2 mb-3">
          <div class="flex-grow-1 d-flex align-center px-2"></div>

          <div class="d-flex align-center px-2">
            <v-btn
              color="success"
              v-on:click="addNewNonce"
            >
              <v-icon>
                mdi-plus-box-multiple
              </v-icon>
            </v-btn>
          </div>
        </div>

        <v-row class="pt-3 pb-7 mt-4 checkbox-row">
          <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
            <v-checkbox class="mt-0"
              label="Раздел &quot;Пользователи&quot;"
              required
              v-model="checkboxes.n"
            ></v-checkbox>
          </v-col>
          
          <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
            <v-checkbox class="mt-0"
              label="Сервер приложений"
              required
              v-model="checkboxes.s"
            ></v-checkbox>
          </v-col>
          
          <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
            <v-checkbox class="mt-0"
              label="Раздел &quot;Аналитика&quot;"
              required
              v-model="checkboxes.o"
            ></v-checkbox>
          </v-col>

          <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
            <v-checkbox class="mt-0"
              label="Просмотр системных логов и краткой статистики"
              required
              v-model="checkboxes.v"
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row class="pt-3 pb-7 mt-4 checkbox-row">
          <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
            <v-checkbox class="mt-0"
              label="Раздел &quot;Настройка регистратора&quot;"
              required
              v-model="checkboxes.e"
            ></v-checkbox>
          </v-col>
          
          <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
            <v-checkbox class="mt-0"
              label="Общие настройки"
              required
              v-model="checkboxes.m"
            ></v-checkbox>
          </v-col>
          
          <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
            <v-checkbox class="mt-0"
              label="Управление СВ"
              required
              v-model="checkboxes.a"
            ></v-checkbox>
          </v-col>
          
          <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
            <v-checkbox class="mt-0"
              label="Хранение данных"
              required
              v-model="checkboxes.t"
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-text-field
          label="Максимальное количество регистраторов"
          type="number"
          v-model="regcount"
        ></v-text-field>

        <v-btn
          id="createKey"
          block
          color="primary"
          class="my-5"
          v-bind:loading="isFetchInProcess"
          v-on:click="submit($event)"
        >
          Создать
        </v-btn>

        <!-- v-bind:value="keysText" -->           
        <h4>Ключ</h4> 
        <v-textarea
          readonly
          auto-grow 
          v-model="keysText"
        >
          <!-- {{keysText}} -->
        </v-textarea>

      </div>

      <div class="overflow position-fixed"
        v-if="isAlertVisible"
      >
        <v-alert class="alert"
          densemdi-logout
          text
          v-bind:type="isFetchSuccess ? 'success' : 'error'"
        >
          {{ isUnautorized ? 'Неверный пароль!' : isFetchSuccess ? 'Ключ успешно сгенерирован и скопирован в буфер обмена!' : 'Ошибка генерации ключа!' }}
        </v-alert>
      </div>
    </div>
</template>

<script>
import { logout } from '../api'

import { mapState } from 'pinia'
import {useAuthStore} from '@/plugins/store/auth'


export default {
    data: () => ({
      drawer: false,
      group: null,

      keysText: '',
      customer: '',
      additionalInfo: '',

      nonces: [ '' ],
      regcount: '99',
      checkboxes: {
        n: true, s: true, o: true, v: true, e: true, m: true, a: true, t: true,
      },

      isUnautorized: false,
      isAlertVisible: false,
      isFetchSuccess: false,
      isFetchInProcess: false,
      errorDescription: 'Ошибка',
    }),

    computed: {
      options() {
        let result = ''
        
        const keys = ['n', 's', 'o', 'v', 'e', 'm', 'a', 't' ]

        keys.forEach(key => {
          result += this.checkboxes[key] ? key : '.'
        })

        return result
      },

      ...mapState(useAuthStore, {
        access: 'access'
      }),
    },
    
    methods: {
      clipboardKey (e) { 
        navigator.clipboard.writeText(this.keysText)
        console.log(e)
       },
      clipText(e) {
        // console.log(this.keys)
        
        setTimeout(()=>{
          // console.log(this.keys, 'иЗ КОПИРОВАНИЯ')
          navigator.clipboard.writeText(this.keysText)
        },5) 
      },
      addNewNonce() {
        this.nonces.push('')
      },
      removeNonce(idx) {
        this.nonces.splice(idx, 1)
      },
      async submit(e) {
        // console.log('sf')
        // console.log(this.keysText)
        // this.keysText = 'Копирует2'
        // console.log(this.keysText)
          

       if(document.getElementById("customerfield").value==""){
        alert("Введите заказчика!")
        return;
       }else if(document.getElementById("noncefield").value==""){
        alert("Введите ключ запроса!")
        return;
       }
        this.isAlertVisible = false
        this.isFetchInProcess = true
        this.isUnautorized = false

        const noncePropery = this.nonces.map(nonce => nonce.replace(/\s/g, '')).join(',')

        
          const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/key?nonce=${ noncePropery }&regcount=${ this.regcount }&options=${ this.options }&company=${ this.customer }&reason=${ this.additionalInfo }`)
          
          if (response.status == 401) {
            this.username = ''
            this.password = ''
            await logout()   
            return
          }

          this.keys = await response.json()

          this.keysText = this.keys.map(key => `${ key.first }|${ key.second }`).join('\r\n')

          

          
        
          navigator.clipboard.writeText(this.keysText)
          
          this.isFetchSuccess = true
        

        this.isFetchInProcess = false
        this.isAlertVisible = true

        setTimeout(() => {
          this.isAlertVisible = false
        }, 1500)
      },
      customAlert(message) {
        const dialogbox = document.getElementById('dialogbox')

        dialogbox.style.top = "50px"
        dialogbox.style.right = "15px"

        dialogbox.style.display = "block"

        document.getElementById('dialogboxbody').textContent = message

        setTimeout(() => {
          dialogbox.style.animationName = 'slit-in-fade'
        }, 1400)
        setTimeout(() => {
          dialogbox.style.animationName = 'slit-in-vertical'
          dialogbox.style.display = "none"
        }, 1600)
      },
    }
}
</script>

<style scoped>
 .position-fixed {
    position: fixed;
  }

  .mnx-2 {
    margin-left: -8px;
    margin-right: -8px;
  }

  .role-col {
    flex-grow: 1.4 !important;
  }

  .file-dialog textarea.v-field__input{
    width: 700px;
    padding-left: 23px !important;
  }

  .file-line > .v-btn,
  .folder-line > .v-btn {
    width: auto;
    min-width: 24px;
    box-shadow: none;
    background-color: transparent;
  }

  .folder-line span.file-name {
    color: #2a92ca !important;
  }

  .change-user-dialog {
    width: 800px;
  }

  .change-user-dialog .v-select__selection-text,
  .create-user .v-select__selection-text {
    padding-left: 8px;
  }

  .checkbox-row .v-selection-control .v-label {
    height: 160%;
    white-space: normal;
  }

  .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
    background-color: #333;
  }

  .app {
    background-color: #444 !important;
  }

  .v-input input {
    padding-left: 8px !important;
  }

  .v-input .v-label {
    padding-left: 8px;
  }

  .v-textarea textarea {
    min-height: 92px !important;
    padding-left: 8px !important;
  }

  .overflow {
    background-color: white;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    max-width: 100%;
    z-index: 2;
  }

  .alert {
    margin: 0 auto !important;
    width: 100%;
    max-width: 100%;
  }

  #dialogbox{
  display: none;
  position: absolute;
  z-index: 10;
  top:0;
  right: 0;
  background: rgb(37, 37, 37);
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.575);
  transition: 0.3s;
  min-width: 250px;
  max-width: 450px;
  border-left: 4px solid rgb(114, 79, 79);
  /* border-left: 4px solid rgb(var(--v-theme-error)); */
  padding: 16px;
  word-wrap: break-word;
  }

  #dialogbox:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.911);
  }

  .slit-in-vertical {
    -webkit-animation: slit-in-vertical 0.45s ease-out both;
    animation: slit-in-vertical 0.45s ease-out both;
  }

  @keyframes slit-in-vertical {
    0% {
      -webkit-transform: translateX(800px);
      transform: translateX(800px);
      opacity: 0;
    }
    54% {
      -webkit-transform: translateX(160px);
      transform: translateX(160px);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
  }
  @keyframes slit-in-fade {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>